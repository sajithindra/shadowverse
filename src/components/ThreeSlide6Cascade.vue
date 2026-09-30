<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { attachPinchZoom, createStage, disposeTree } from '../three/stage'
import {
  createBladeServerTower,
  createRealisticCctvCamera,
  createNvrStorageUnit,
  createDiscardBin,
  type GpuCard,
} from '../three/hardware'
import { projectLabels, labelStyle, type SceneLabel } from '../three/labels'

const props = withDefaults(defineProps<{ minimal?: boolean }>(), { minimal: false })

const mountRef = ref<HTMLDivElement | null>(null)
const labels = ref<SceneLabel[]>([])

/**
 * Cascaded inference topology.
 *
 * The argument the plane has to make is that filtering by class collapses GPU
 * work: every frame hits cheap detection across three servers, but only the
 * small fraction carrying a person or a vehicle ever reaches a recognition
 * model. So the hardware is neutral graphite and colour is reserved for data
 * state — magenta is unclassified traffic, blue the vehicle branch, green the
 * person branch, amber the watchlist query the person branch ends in.
 */

const ACCENT = {
  all: 0xe02870,
  vehicle: 0x4a90d9,
  person: 0x3d8b5e,
  costly: 0xc49a3c,
  discard: 0x4a4f57,
} as const

const HEX = {
  all: '#e02870',
  vehicle: '#4a90d9',
  person: '#3d8b5e',
  costly: '#c49a3c',
} as const

/** Per-stage throughput. The drop between rows is the whole point. */
interface StageStat {
  id: string
  stage: string
  detail: string
  rate: string
  share: number
  color: string
}

const stageStats: StageStat[] = [
  {
    id: 's0',
    stage: 'Frames read from NVR',
    detail: '2,000 cameras at 30 fps',
    rate: '60,000 /s',
    share: 1,
    color: HEX.all,
  },
  {
    id: 's1',
    stage: 'Objects detected',
    detail: 'Three detection servers, every frame',
    rate: '7,200 /s',
    share: 0.12,
    color: HEX.all,
  },
  {
    id: 's2',
    stage: 'Vehicles routed',
    detail: 'Plate, make, model and colour',
    rate: '2,300 /s',
    share: 0.038,
    color: HEX.vehicle,
  },
  {
    id: 's3',
    stage: 'Persons routed',
    detail: 'Face detection on the crop',
    rate: '3,100 /s',
    share: 0.052,
    color: HEX.person,
  },
  {
    id: 's4',
    stage: 'Faces recognised',
    detail: 'Embedding plus watchlist search',
    rate: '1,200 /s',
    share: 0.02,
    color: HEX.costly,
  },
]

interface Inspectable {
  title: string
  role: string
  cost: string
  detail: string
  color: string
}

const selected = ref<Inspectable | null>(null)

let stage: ReturnType<typeof createStage> | null = null
let world: THREE.Group
let animId = 0
let resizeObserver: ResizeObserver | null = null
let detachPinch: (() => void) | null = null

const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2(-10, -10)
let pointerMoved = true
let isDragging = false
let dragButton = 0
let previous = { x: 0, y: 0 }
let downAt = { x: 0, y: 0 }

const interactables: THREE.Object3D[] = []
const allCards: Array<{ card: GpuCard; base: number; phase: number }> = []

/** A stream of work units travelling one branch of the cascade. */
interface Stream {
  curve: THREE.CatmullRomCurve3
  units: THREE.Mesh[]
  offsets: number[]
  speed: number
}
const streams: Stream[] = []

/** Branch points, which flare as work passes through them. */
const decisions: Array<{ mesh: THREE.Mesh; material: THREE.MeshBasicMaterial; phase: number }> = []

/** Blade cabinet drive LEDs, pulsed in the render loop. */
const ledMeshes: THREE.Mesh[] = []

const unitGeo = new THREE.SphereGeometry(0.16, 12, 12)

/** Footprint of the throughput readout, so labels can be routed around it. */
const READOUT_W = 268
const READOUT_H = 340

function addLabel(
  id: string,
  text: string,
  subtext: string,
  color: string,
  worldPos: THREE.Vector3,
  isHeader = false,
) {
  labels.value.push({ id, text, subtext, color, worldPos, screenX: 0, screenY: 0, isHeader })
}

/** Tags every mesh under `root` so a click anywhere on it opens the same card. */
function makeInspectable(root: THREE.Object3D, data: Inspectable) {
  root.userData = data
  root.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.userData = data
      interactables.push(child)
    }
  })
}

/**
 * Routes work along a smooth curve; the unit count is the visible throughput.
 * `speed` is paths traversed per second, matched to the packet rate on the
 * other two topologies.
 */
function addStream(points: THREE.Vector3[], color: number, count: number, speed: number) {
  const curve = new THREE.CatmullRomCurve3(points)

  // Drawn as a flat unlit line, the same as the links on the other two planes.
  // The curve only supplies the routing; it is sampled into line segments so a
  // branch still bends without becoming a lit tube.
  world.add(
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)),
      new THREE.LineBasicMaterial({ color, opacity: 0.85, transparent: true }),
    ),
  )

  const unitMat = new THREE.MeshBasicMaterial({ color })

  const units: THREE.Mesh[] = []
  const offsets: number[] = []
  for (let i = 0; i < count; i++) {
    const unit = new THREE.Mesh(unitGeo, unitMat)
    world.add(unit)
    units.push(unit)
    offsets.push(i / count)
  }

  streams.push({ curve, units, offsets, speed })
}

/** A branch in the cascade: the question asked before work is allowed onward. */
function addDecision(position: THREE.Vector3, color: number, question: string, answer: string) {
  const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 })
  const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.5, 0), material)
  mesh.position.copy(position)
  mesh.castShadow = true
  world.add(mesh)
  decisions.push({ mesh, material, phase: decisions.length * 1.3 })

  makeInspectable(mesh, {
    title: question,
    role: 'Branch condition',
    cost: 'No GPU cost',
    detail: answer,
    color: `#${color.toString(16).padStart(6, '0')}`,
  })
}

onMounted(() => {
  const mount = mountRef.value
  if (!mount) return

  stage = createStage(mount, { fov: 45, fogDensity: 0.018, exposure: 1.2, shadowExtent: 24 })
  const { scene, camera, renderer } = stage

  frameCamera()

  world = new THREE.Group()
  scene.add(world)
  // Same tilt and bare magenta grid as the other two topologies: no solid floor
  // plate, or this plane reads as a different surface to the rest of the deck.
  world.rotation.x = 0.12
  const gridHelper = new THREE.GridHelper(200, 100, 0x750d37, 0x27272a)
  gridHelper.position.y = -0.3
  world.add(gridHelper)

  // ── Detection tier, then one server per class ────────────────────────────
  // Ingest fans out across three identical detection servers — no single box
  // can carry 60,000 frames a second. What they agree on is then filtered: a
  // person goes to the person server, a vehicle to the vehicle server, and
  // everything else stops. Card counts encode the silicon each server needs.
  const bays = [
    {
      id: 'detect1',
      pos: new THREE.Vector3(-12, 0, -5),
      scale: 0.78,
      cards: 4,
      load: 0.95,
      accent: ACCENT.all,
      hex: HEX.all,
      title: 'DETECTION NODE 01',
      sub: 'EVERY FRAME · 4 GPUs',
      header: false,
      role: 'Detection tier · 1 of 3',
      cost: '4 GPUs at 95% — a third of the camera load',
      detail:
        'One of three identical detection servers. The 2,000 camera streams are split evenly across them, because 60,000 frames a second is more than any single box decodes. Each runs the same lightweight detector and answers one question: is there a vehicle or a person in this frame?',
    },
    {
      id: 'detect2',
      pos: new THREE.Vector3(-8, 0, 0),
      scale: 0.78,
      cards: 4,
      load: 0.93,
      accent: ACCENT.all,
      hex: HEX.all,
      title: 'DETECTION NODE 02',
      sub: 'EVERY FRAME · 4 GPUs',
      header: false,
      role: 'Detection tier · 2 of 3',
      cost: '4 GPUs at 93% — a third of the camera load',
      detail:
        'The second detection server. The tier scales by adding boxes, not by buying a bigger one: another 700 cameras is another node, and the servers behind the filter are untouched.',
    },
    {
      id: 'detect3',
      pos: new THREE.Vector3(-4, 0, 5),
      scale: 0.78,
      cards: 4,
      load: 0.9,
      accent: ACCENT.all,
      hex: HEX.all,
      title: 'DETECTION NODE 03',
      sub: 'EVERY FRAME · 4 GPUs',
      header: false,
      role: 'Detection tier · 3 of 3',
      cost: '4 GPUs at 90% — a third of the camera load',
      detail:
        'The third detection server. All three write their detections into the same filter, so a camera can be moved between nodes without anything downstream knowing.',
    },
    {
      id: 'vehicle',
      pos: new THREE.Vector3(10, 0, -7),
      cards: 6,
      load: 0.55,
      accent: ACCENT.vehicle,
      hex: HEX.vehicle,
      title: 'VEHICLE SERVER',
      sub: 'PLATE · MAKE · MODEL · COLOUR · 6 GPUs',
      header: true,
      role: 'Vehicle branch',
      cost: '6 GPUs at 55% — 3.8% of ingested frames',
      detail:
        'Every crop the filter labelled a vehicle lands here, and two models run on it. ANPR reads the number plate and checks it against the stolen-vehicle and warrant registries. A second classifier reads make, model and colour, so a vehicle is still identifiable when the plate is fake, obscured or simply unreadable at that angle.',
    },
    {
      id: 'person',
      pos: new THREE.Vector3(9.5, 0, 7),
      cards: 6,
      load: 0.62,
      accent: ACCENT.person,
      hex: HEX.person,
      title: 'PERSON SERVER',
      sub: 'FACE DETECTION + RECOGNITION · 6 GPUs',
      header: true,
      role: 'Person branch',
      cost: '6 GPUs at 62% — 5.2% of ingested frames',
      detail:
        'Every crop the filter labelled a person lands here. Face detection runs first and is deliberately cheap: it only finds the face in the crop. Recognition then turns that face into a 512-dimension embedding and queries the watchlist index. Running recognition on every frame instead of on this 5% would need roughly 500 GPUs.',
    },
  ]

  const bayPos: Record<string, THREE.Vector3> = {}

  for (const bay of bays) {
    // The cabinet holds six drawers, so that caps the cards on show; the label
    // carries the real GPU count for the tier.
    const rack = createBladeServerTower(bay.accent, Math.min(bay.cards, 6))
    rack.group.position.copy(bay.pos)
    if (bay.scale) rack.group.scale.setScalar(bay.scale)
    world.add(rack.group)
    ledMeshes.push(...rack.leds)
    bayPos[bay.id] = bay.pos

    rack.cards.forEach((card, i) => {
      card.setLoad(bay.load)
      allCards.push({ card, base: bay.load, phase: i * 0.6 + bay.pos.x })
    })

    makeInspectable(rack.group, {
      title: bay.title,
      role: bay.role,
      cost: bay.cost,
      detail: bay.detail,
      color: bay.hex,
    })

    if (bay.header) {
      addLabel(
        `bay-${bay.id}`,
        bay.title,
        bay.sub,
        bay.hex,
        bay.pos.clone().add(new THREE.Vector3(0, 5.2, 0)),
        true,
      )
    }
  }

  // One header for the tier, so three node badges do not read as three tiers.
  addLabel(
    'detect-tier',
    'OBJECT DETECTION',
    '3 SERVERS · EVERY FRAME · 12 GPUs',
    HEX.all,
    new THREE.Vector3(-8, 7.4, 0),
    true,
  )

  // ── Watchlist vector index ───────────────────────────────────────────────
  // Not a sixth server: a database the last stage queries.
  const indexPos = new THREE.Vector3(15, 0, 10)
  const indexGroup = new THREE.Group()
  indexGroup.position.copy(indexPos)
  indexGroup.scale.setScalar(0.5)

  // Same vocabulary as the cabinets: near-black body, 0x27272a faceplate and a
  // coloured wireframe outline.
  const discMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    metalness: 0.85,
    roughness: 0.25,
  })
  for (let i = 0; i < 4; i++) {
    const y = 0.9 + i * 0.95
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 0.5, 40), discMat)
    disc.position.y = y
    disc.castShadow = true
    disc.receiveShadow = true
    indexGroup.add(disc)

    const plate = new THREE.Mesh(
      new THREE.CylinderGeometry(1.9, 1.9, 0.06, 40),
      new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.95, roughness: 0.1 }),
    )
    plate.position.y = y + 0.28
    indexGroup.add(plate)
  }

  // One outline box around the whole stack, exactly as the cabinets are drawn.
  const indexWire = new THREE.Mesh(
    new THREE.BoxGeometry(4.4, 4.5, 4.4),
    new THREE.MeshBasicMaterial({ color: ACCENT.costly, wireframe: true }),
  )
  indexWire.position.y = 2.25
  indexGroup.add(indexWire)

  // Base plate, matching the cabinets' footing.
  const indexBase = new THREE.Mesh(
    new THREE.CylinderGeometry(2.4, 2.4, 0.3, 40),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85 }),
  )
  indexBase.position.y = 0.15
  indexBase.receiveShadow = true
  indexGroup.add(indexBase)

  world.add(indexGroup)

  makeInspectable(indexGroup, {
    title: 'QDRANT VECTOR INDEX',
    role: 'Watchlist store',
    cost: 'CPU only — no GPU',
    detail:
      'Face embeddings are matched by approximate nearest-neighbour search over the watchlist. A query returns the closest identities with a similarity score in single-digit milliseconds, so the cost of a match does not grow with the size of the watchlist.',
    color: HEX.costly,
  })

  addLabel(
    'qdrant',
    'QDRANT VECTOR INDEX',
    'WATCHLIST MATCH',
    HEX.costly,
    indexPos.clone().add(new THREE.Vector3(0, 3.0, 0)),
    true,
  )

  // ── Ingest: cameras record to the NVR; the detector reads from the NVR ───
  const nvrPos = new THREE.Vector3(-16.5, 0.8, 7)
  const camZ = [3.5, 7, 10.5]

  for (const z of camZ) {
    const cam = createRealisticCctvCamera(ACCENT.all)
    cam.position.set(-20, 1.2, z)
    world.add(cam)
    makeInspectable(cam, {
      title: '4K CCTV CAMERA',
      role: 'Source',
      cost: 'No GPU cost',
      detail:
        'Cameras do not talk to the inference tier. Each one records continuously to the NVR over RTSP, which is what keeps evidence intact even when the analytics stack is down for maintenance.',
      color: HEX.all,
    })
    // Camera to recorder.
    addStream(
      [
        new THREE.Vector3(-19.4, 1.2, z),
        new THREE.Vector3(-18, 1.4, (z + 7) * 0.5),
        nvrPos.clone().setY(0.9),
      ],
      ACCENT.all,
      3,
      0.9,
    )
  }

  // A prop, not a stage: it yields to the badges that carry the argument.
  addLabel('cctv', 'CCTV CAMERAS', '2,000 STREAMS · RTSP', HEX.all, new THREE.Vector3(-20, 4.2, 7))

  const nvrGroup = createNvrStorageUnit(ACCENT.all)
  nvrGroup.position.copy(nvrPos)
  world.add(nvrGroup)

  makeInspectable(nvrGroup, {
    title: 'NVR — NETWORK VIDEO RECORDER',
    role: 'Source of record',
    cost: 'Storage only — no GPU',
    detail:
      'Every camera writes here first. The inference tier pulls its frames from the NVR, not from the cameras, so analytics can be restarted, re-run or back-filled over recorded footage without touching the camera estate.',
    color: HEX.all,
  })

  addLabel(
    'nvr',
    'NVR',
    'ANALYTICS READS FROM HERE',
    HEX.all,
    nvrPos.clone().add(new THREE.Vector3(0, 2.6, 0)),
    true,
  )

  const ingest = nvrPos.clone().setY(1.2)

  // ── The filter ───────────────────────────────────────────────────────────
  // All three detection servers feed one decision: what class is this, and is
  // it worth paying for? Everything downstream hangs off the answer.
  const filter = new THREE.Vector3(2.5, 1.9, 0)
  addDecision(
    filter,
    ACCENT.all,
    'PERSON, VEHICLE, OR NEITHER?',
    'The only branch in the pipeline. The three detection servers hand their detections here and the class decides the route: a person to the person server, a vehicle to the vehicle server, and the 88% that is neither stops. That 88% is where almost all of the saving comes from — no recognition model is ever loaded for it.',
  )
  addLabel(
    'filter',
    'FILTER BY CLASS',
    '88% STOP HERE',
    HEX.all,
    filter.clone().add(new THREE.Vector3(0, 1.7, 0)),
  )

  // ── Work streams. Unit counts are the throughput at each hop. ────────────
  const rackFront = (id: string, dz = 1.2) => bayPos[id]!.clone().add(new THREE.Vector3(0, 1.9, dz))

  // Ingest fans out from the recorder to all three detection servers.
  for (const id of ['detect1', 'detect2', 'detect3']) {
    const front = bayPos[id]!.clone().add(new THREE.Vector3(0, 3.4, 0))
    addStream(
      [ingest, new THREE.Vector3(-14.5, 2.2, (front.z + 7) * 0.5), front],
      ACCENT.all,
      5,
      0.62,
    )
    // And each hands its detections to the filter.
    addStream(
      [rackFront(id), new THREE.Vector3(-1, 1.9, front.z * 0.5), filter],
      ACCENT.all,
      4,
      0.72,
    )
  }

  // The discarded majority. Drawn deliberately: it is the work not done, and
  // it is where almost all of the saving comes from.
  const bin = createDiscardBin()
  const binPos = new THREE.Vector3(3.5, 0, 12)
  bin.position.copy(binPos)
  bin.scale.setScalar(0.72)
  world.add(bin)
  makeInspectable(bin, {
    title: 'DISCARDED FRAMES',
    role: 'Early exit',
    cost: 'The saving',
    detail:
      'Frames with no vehicle and no person are dropped the moment the detection tier has looked at them. Nothing downstream ever sees them — no plate model, no face model, no vector search. This is where 88% of the potential GPU bill goes away.',
    color: '#8b919b',
  })

  // Units arc over the rim and fall in, so the discard is visibly a discard.
  const dropped = binPos.clone().add(new THREE.Vector3(0, 0.5, 0))
  addStream(
    [
      filter,
      new THREE.Vector3(3.2, 2.8, 6),
      binPos.clone().add(new THREE.Vector3(0, 1.8, 0)),
      dropped,
    ],
    ACCENT.discard,
    10,
    0.6,
  )
  addLabel(
    'dropped',
    'DROPPED HERE',
    '88% — NO VEHICLE, NO PERSON',
    '#8b919b',
    binPos.clone().add(new THREE.Vector3(0, 2.4, 0)),
  )

  // Vehicle branch: plate, make, model and colour on one server.
  addStream(
    [filter, new THREE.Vector3(6, 1.9, -4.5), rackFront('vehicle')],
    ACCENT.vehicle,
    5,
    0.68,
  )

  // Person branch: face detection and recognition on one server.
  addStream([filter, new THREE.Vector3(6, 1.9, 4.5), rackFront('person')], ACCENT.person, 6, 0.68)

  // The person server's recognition step queries the watchlist index.
  addStream(
    [rackFront('person'), new THREE.Vector3(12.5, 1.9, 9), indexPos.clone().setY(3.4)],
    ACCENT.costly,
    2,
    0.8,
  )

  const resize = () => {
    stage?.resize()
    frameCamera()
  }

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
  }
  window.addEventListener('resize', resize)
  // Pinch is the only zoom on a phone: the deck renders this plane in minimal
  // mode, without the zoom buttons.
  detachPinch = attachPinchZoom(mount, zoomBy)

  const clock = new THREE.Clock()

  const animate = () => {
    const t = clock.getElapsedTime()

    for (const s of streams) {
      for (let i = 0; i < s.units.length; i++) {
        const u = (s.offsets[i]! + t * s.speed) % 1
        s.curve.getPointAt(u, s.units[i]!.position)
      }
    }

    // GPU load breathes around its baseline so a busy rack looks alive and an
    // idle one stays visibly dark.
    for (const entry of allCards) {
      entry.card.setLoad(entry.base * (0.72 + 0.28 * Math.sin(t * 3 + entry.phase)))
    }

    ledMeshes.forEach((mesh) => {
      const mat = mesh.material as THREE.MeshStandardMaterial
      if (!mat) return
      const pulse = Math.sin(t * 5 + mesh.position.y * 10 + mesh.position.x * 20)
      mat.emissiveIntensity = pulse > 0.3 ? 0.95 : 0.15
    })

    for (const d of decisions) {
      d.material.opacity = 0.55 + 0.45 * Math.abs(Math.sin(t * 1.6 + d.phase))
      d.mesh.rotation.y = t * 0.45 + d.phase
    }

    const w = mount.clientWidth
    const h = mount.clientHeight
    projectLabels(labels.value, camera, world, w, h, {
      fadeStart: 40,
      fadeRange: 62,
      // Keeps badges out from under the throughput readout.
      reserved: [
        { x: 12 + READOUT_W / 2, y: h - 64 - READOUT_H / 2, hw: READOUT_W / 2, hh: READOUT_H / 2 },
      ],
    })

    if (pointerMoved) {
      pointerMoved = false
      raycaster.setFromCamera(pointer, camera)
      mount.style.cursor = raycaster.intersectObjects(interactables, false).length
        ? 'pointer'
        : 'grab'
    }

    renderer.render(scene, camera)
    animId = requestAnimationFrame(animate)
  }

  animate()
})

onBeforeUnmount(() => {
  if (animId) cancelAnimationFrame(animId)
  detachPinch?.()
  resizeObserver?.disconnect()
  window.removeEventListener('resize', onResize)
  window.removeEventListener('pointermove', onDragMove)
  window.removeEventListener('pointerup', onPointerUp)
  if (world) disposeTree(world)
  unitGeo.dispose()
  stage?.dispose()
})

function onResize() {
  stage?.resize()
}

function updatePointer(event: PointerEvent) {
  const mount = mountRef.value
  if (!mount) return
  const rect = mount.getBoundingClientRect()
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  pointerMoved = true
}

function onPointerDown(event: PointerEvent) {
  // A tap fires no pointermove first, so without this the release below
  // raycasts from wherever the pointer last hovered — never a hit on touch.
  updatePointer(event)
  isDragging = true
  dragButton = event.button
  previous = { x: event.clientX, y: event.clientY }
  downAt = { x: event.clientX, y: event.clientY }
  window.addEventListener('pointermove', onDragMove)
  window.addEventListener('pointerup', onPointerUp)
}

function onDragMove(event: PointerEvent) {
  updatePointer(event)
  if (!isDragging || !world) return

  const dx = event.clientX - previous.x
  const dy = event.clientY - previous.y

  if (dragButton === 2 || event.shiftKey) {
    world.position.x += dx * 0.06
    world.position.y -= dy * 0.06
  } else {
    world.rotation.y += dx * 0.005
    // Clamped so the scene can never tip past the floor plane.
    world.rotation.x = Math.max(-0.5, Math.min(0.6, world.rotation.x + dy * 0.004))
  }
  previous = { x: event.clientX, y: event.clientY }
}

function onPointerUp(event: PointerEvent) {
  isDragging = false
  window.removeEventListener('pointermove', onDragMove)
  window.removeEventListener('pointerup', onPointerUp)

  // A drag is not a click; only open the card if the pointer barely moved.
  if (Math.hypot(event.clientX - downAt.x, event.clientY - downAt.y) > 5) return
  if (!stage) return

  raycaster.setFromCamera(pointer, stage.camera)
  const hit = raycaster.intersectObjects(interactables, false)[0]
  selected.value = hit ? (hit.object.userData as Inspectable) : null
}

/** Distance the plane was composed at, on a wide screen. */
const DESIGN_DISTANCE = 42
/** Elevation held constant as the distance changes, so the plane keeps the
 *  near-eye-level view the rest of the deck uses. */
const CAMERA_PITCH = 10 / 42
/** Half-width of the part that carries the argument: the detection row, the
 *  filter and the two branch servers. */
const CORE_HALF_WIDTH = 15

/**
 * A phone cannot hold this whole pipeline at a readable size — fitting all of
 * it shrinks the racks to specks. So on a narrow viewport the frame is built
 * around the core instead, and the ingest chain and the watchlist index sit
 * just outside it, one drag away.
 */
function frameCamera() {
  if (!stage) return
  const camera = stage.camera
  const narrow = camera.aspect < 1
  const tanHalfH = Math.max(Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.aspect, 0.1)
  const distance = narrow
    ? Math.max(DESIGN_DISTANCE - 2, CORE_HALF_WIDTH / tanHalfH)
    : DESIGN_DISTANCE
  const centre = narrow ? 2 : -2
  camera.position.set(centre, distance * CAMERA_PITCH, distance)
  camera.lookAt(centre, 3.4, 3)
}

function zoomBy(deltaY: number) {
  if (!stage) return
  const camera = stage.camera
  // Proportional rather than a fixed step per event: a pinch fires many small
  // deltas per second and a fixed 8% step each time would slam into the limits.
  const scale = Math.exp(deltaY * 0.0009)
  const next = camera.position.length() * scale
  if (next > 18 && next < 140) camera.position.multiplyScalar(scale)
}

function onWheel(event: WheelEvent) {
  event.preventDefault()
  zoomBy(event.deltaY)
}

function onContextMenu(event: MouseEvent) {
  event.preventDefault()
}
</script>

<template>
  <div
    :class="
      props.minimal
        ? 'w-full h-full relative overflow-hidden select-none bg-transparent'
        : 'industrial-card p-3 sm:p-4 bg-[#09090b] border-[#e02870] relative overflow-hidden shadow-2xl my-3'
    "
  >
    <div
      ref="mountRef"
      data-scene
      @pointerdown="onPointerDown"
      @pointermove="updatePointer"
      @contextmenu="onContextMenu"
      @wheel="onWheel"
      class="w-full cursor-grab active:cursor-grabbing relative overflow-hidden touch-none select-none"
      :class="props.minimal ? 'h-full' : 'h-[58vh] sm:h-[65vh]'"
    >
      <!-- Floating 3D space labels: GPU-composited, depth-faded, stem-anchored -->
      <div
        v-for="lbl in labels"
        :key="lbl.id"
        class="node-label absolute left-0 top-0 pointer-events-none flex flex-col items-center"
        :style="labelStyle(lbl)"
      >
        <div
          v-if="lbl.isHeader"
          class="px-3 md:px-4 py-1.5 md:py-2 bg-[#0a0a0e]/92 backdrop-blur-sm border-2 font-mono shadow-2xl max-w-[42vw] md:max-w-none md:whitespace-nowrap text-center"
          :style="{ borderColor: lbl.color, boxShadow: `0 0 20px -6px ${lbl.color}` }"
        >
          <div class="text-white font-black text-[10px] md:text-sm tracking-wider uppercase">
            {{ lbl.text }}
          </div>
          <div class="text-[9px] md:text-[10px] text-zinc-300 font-bold tracking-widest mt-0.5">
            {{ lbl.subtext }}
          </div>
        </div>

        <div
          v-else
          class="pl-2 pr-2.5 md:pl-2.5 md:pr-3 py-1 md:py-1.5 bg-[#0a0a0e]/88 backdrop-blur-sm border border-white/10 border-l-[3px] font-mono shadow-xl max-w-[42vw] md:max-w-none md:whitespace-nowrap text-left"
          :style="{ borderLeftColor: lbl.color }"
        >
          <div class="text-white font-bold text-[10px] md:text-xs tracking-wide">
            {{ lbl.text }}
          </div>
          <div class="text-[9px] md:text-[10px] text-zinc-400 font-semibold tracking-wider mt-px">
            {{ lbl.subtext }}
          </div>
        </div>

        <div
          class="w-px h-4"
          :style="{ background: `linear-gradient(to bottom, ${lbl.color}, transparent)` }"
        ></div>
      </div>

      <!-- Throughput readout: the quantitative half of the cascade argument -->
      <div
        class="absolute bottom-[calc(3.5rem+env(safe-area-inset-bottom))] left-3 bg-[#0a0a0e]/90 backdrop-blur-sm border border-white/10 font-mono shadow-2xl z-20 w-[16.5rem] max-w-[calc(100%-1.5rem)]"
      >
        <div class="px-3 py-1.5 sm:py-2 border-b border-white/10">
          <div class="text-white font-black text-xs tracking-wide">GPU work per second</div>
          <div class="hidden sm:block text-[10px] text-zinc-400 mt-0.5">
            Each tier is fed only what the one before it kept
          </div>
        </div>
        <div class="px-3 py-1.5 sm:py-2 space-y-1 sm:space-y-1.5">
          <div v-for="s in stageStats" :key="s.id">
            <div class="flex items-baseline justify-between gap-2">
              <span class="text-[11px] text-zinc-200 font-semibold truncate">{{ s.stage }}</span>
              <span class="text-[11px] font-bold tabular-nums" :style="{ color: s.color }">{{
                s.rate
              }}</span>
            </div>
            <div class="h-1 bg-white/5 mt-1 overflow-hidden">
              <div
                class="h-full transition-[width] duration-700 ease-out"
                :style="{ width: `${Math.max(s.share * 100, 1.5)}%`, background: s.color }"
              ></div>
            </div>
            <div class="hidden sm:block text-[9px] text-zinc-500 mt-0.5">{{ s.detail }}</div>
          </div>
        </div>
        <div class="px-3 py-2 border-t border-white/10 text-[10px] text-zinc-300 leading-relaxed">
          Running face recognition on every frame would take roughly
          <span class="text-[#c49a3c] font-bold">500 GPUs</span>. Tiered, it takes
          <span class="text-[#3d8b5e] font-bold">24</span>.
        </div>
      </div>

      <!-- Inspector -->
      <div
        v-if="selected"
        class="absolute bottom-[calc(3.5rem+env(safe-area-inset-bottom))] right-3 left-3 sm:left-auto p-3 bg-[#0a0a0e]/95 backdrop-blur-sm border-2 font-mono text-xs text-white shadow-2xl z-30 max-w-sm sm:w-full space-y-2"
        :style="{ borderColor: selected.color }"
      >
        <div class="flex items-start justify-between gap-3 border-b border-white/10 pb-1.5">
          <div class="font-black uppercase text-xs" :style="{ color: selected.color }">
            {{ selected.title }}
          </div>
          <button
            @click="selected = null"
            class="text-zinc-400 hover:text-white cursor-pointer flex items-center shrink-0"
          >
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>
        <div class="text-[10px] text-zinc-400 font-semibold">{{ selected.role }}</div>
        <div class="text-zinc-300 text-[11px] leading-relaxed">{{ selected.detail }}</div>
        <div
          class="text-[10px] font-bold pt-1 border-t border-white/10"
          :style="{ color: selected.color }"
        >
          {{ selected.cost }}
        </div>
      </div>

      <div
        class="absolute top-3 left-3 max-w-[52%] sm:max-w-none font-mono text-[10px] text-zinc-500 z-10 pointer-events-none"
      >
        Tap a server to inspect · drag to orbit · pinch or scroll to zoom
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Repositioned every frame via transform, so only opacity transitions —
   transitioning transform would make labels lag the geometry. */
.node-label {
  will-change: transform, opacity;
  transition: opacity 0.22s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .node-label {
    transition: none;
  }
}
</style>
