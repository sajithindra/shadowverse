<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { createStage } from '../three/stage'
import {
  createBladeServerTower,
  createNvrStorageUnit,
  createRealisticCctvCamera,
} from '../three/hardware'





const props = withDefaults(
  defineProps<{
    minimal?: boolean
  }>(),
  {
    minimal: false
  }
)

interface CctvObject {
  group: THREE.Group
  baseRotationY: number
  phase: number
}

const animatedCctvCameras: CctvObject[] = []

const containerRef = ref<HTMLDivElement | null>(null)
const mountRef = ref<HTMLDivElement | null>(null)
const isFullscreen = ref(false)

const isLoadingModels = ref(true)
const modelLoadingProgress = ref(0)
const loadedGlbModels = {
  core: null as THREE.Object3D | null,
  agents: [] as THREE.Object3D[]
}

interface TelemetryData {
  name: string
  servers: string
  latency: string
  status: string
  detail?: string
}

const hoveredNode = ref<TelemetryData | null>(null)
const selectedNode = ref<TelemetryData | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let stage: ReturnType<typeof createStage> | null = null
let animId: number | null = null

let topologyGroup: THREE.Group
let coreReactorMesh: THREE.Mesh
let selectionRingMesh: THREE.Mesh | null = null

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2(-1000, -1000)
let isDragging = false
let dragButton = 0
let isShiftPressed = false
let previousMouse = { x: 0, y: 0 }

const MIN_ZOOM_Z = 12.0
const MAX_ZOOM_Z = 85.0
const DEFAULT_ZOOM_Z = 42.0

function zoomIn() {
  if (!camera) return
  const dir = new THREE.Vector3()
  camera.getWorldDirection(dir)
  camera.position.addScaledVector(dir, 4.5)
}

function zoomOut() {
  if (!camera) return
  const dir = new THREE.Vector3()
  camera.getWorldDirection(dir)
  camera.position.addScaledVector(dir, -4.5)
}

function setCameraPreset(preset: 'OVERVIEW' | 'CORE' | 'RESET') {
  if (!camera || !topologyGroup) return
  if (preset === 'CORE') {
    camera.position.set(0, 6.0, 22.0)
    camera.lookAt(0, 0, 0)
    topologyGroup.position.set(0, 0, 0)
    topologyGroup.rotation.set(0, 0, 0)
  } else if (preset === 'OVERVIEW') {
    camera.position.set(0, 18.0, 52.0)
    camera.lookAt(0, 0, 0)
    topologyGroup.position.set(0, 0, 0)
    topologyGroup.rotation.set(0.25, 0, 0)
  } else {
    resetZoom()
  }
}

function resetZoom() {
  if (!camera || !topologyGroup) return
  camera.position.set(0, 10.0, DEFAULT_ZOOM_Z)
  camera.lookAt(0, 0, 0)
  topologyGroup.position.set(0, 0, 0)
  topologyGroup.rotation.set(0.12, 0, 0)
  selectedNode.value = null
}

function onWheel(event: WheelEvent) {
  if (!camera || !mountRef.value) return
  event.preventDefault()

  const rect = mountRef.value.getBoundingClientRect()
  const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1
  const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1

  const targetVector = new THREE.Vector3(mouseX, mouseY, 0.5)
  targetVector.unproject(camera)
  const dir = targetVector.sub(camera.position).normalize()

  const zoomFactor = event.deltaY * -0.015
  const nextPos = camera.position.clone().addScaledVector(dir, zoomFactor)

  if (nextPos.z >= MIN_ZOOM_Z && nextPos.z <= MAX_ZOOM_Z) {
    camera.position.copy(nextPos)
  }
}

let pointerDownPos = { x: 0, y: 0 }

function onPointerDown(event: PointerEvent) {
  isDragging = true
  dragButton = event.button
  isShiftPressed = event.shiftKey
  previousMouse = { x: event.clientX, y: event.clientY }
  pointerDownPos = { x: event.clientX, y: event.clientY }

  window.addEventListener('pointermove', onGlobalPointerMove)
  window.addEventListener('pointerup', onGlobalPointerUp)
}

function onHoverMove(event: PointerEvent) {
  if (!mountRef.value) return
  const rect = mountRef.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  pointerMoved = true
}

function onGlobalPointerMove(event: PointerEvent) {
  if (!mountRef.value) return
  onHoverMove(event)

  if (isDragging && topologyGroup) {
    const deltaX = event.clientX - previousMouse.x
    const deltaY = event.clientY - previousMouse.y

    if (dragButton === 2 || isShiftPressed || event.shiftKey) {
      topologyGroup.position.x += deltaX * 0.02
      topologyGroup.position.y -= deltaY * 0.02
    } else {
      topologyGroup.rotation.y += deltaX * 0.006
      topologyGroup.rotation.x += deltaY * 0.006
    }
    previousMouse = { x: event.clientX, y: event.clientY }
  }
}

function onGlobalPointerUp(event: PointerEvent) {
  isDragging = false
  window.removeEventListener('pointermove', onGlobalPointerMove)
  window.removeEventListener('pointerup', onGlobalPointerUp)

  const distMoved = Math.hypot(event.clientX - pointerDownPos.x, event.clientY - pointerDownPos.y)
  if (distMoved < 5) {
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(allInteractables, true)

    if (intersects.length > 0 && intersects[0]) {
      const topObj = intersects[0].object
      if (topObj && topObj.userData && topObj.userData.name) {
        selectedNode.value = topObj.userData as TelemetryData

        // Find the top-level parent node group under topologyGroup
        let targetObj: THREE.Object3D | null = topObj
        while (targetObj && targetObj.parent && targetObj.parent !== topologyGroup && targetObj.parent !== scene) {
          targetObj = targetObj.parent
        }

        if (targetObj && selectionRingMesh) {
          selectionRingMesh.position.copy(targetObj.position)
          selectionRingMesh.position.y = targetObj.position.y - 0.1
          selectionRingMesh.rotation.x = Math.PI / 2
          selectionRingMesh.visible = true
        }
      }
    } else {
      selectedNode.value = null
      if (selectionRingMesh) selectionRingMesh.visible = false
    }
  }
}

function onContextMenu(event: MouseEvent) {
  event.preventDefault()
}

interface NodeLabel {
  id: string
  name: string
  subtext: string
  color: string
  worldPos: THREE.Vector3
  screenX: number
  screenY: number
  isHeader?: boolean
  zIndex?: number
  opacity?: number
  scale?: number
}

const nodeLabels = ref<NodeLabel[]>([])
const allInteractables: THREE.Object3D[] = []

interface Packet {
  start: THREE.Vector3
  end: THREE.Vector3
  progress: number
  speed: number
  mesh: THREE.Mesh
}

const packets: Packet[] = []

// Cached per-frame animation targets so animate() never walks the scene graph.
const ledMeshes: THREE.Mesh[] = []
let pointerMoved = true

function toggleFullscreen() {
  const elem = containerRef.value
  if (!elem) return

  if (!document.fullscreenElement) {
    elem.requestFullscreen().then(() => {
      isFullscreen.value = true
    }).catch(err => {
      console.warn('Fullscreen error:', err)
    })
  } else {
    document.exitFullscreen().then(() => {
      isFullscreen.value = false
    })
  }
}

function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
  setTimeout(handleResize, 100)
}

function handleResize() {
  if (!mountRef.value || !renderer || !camera) return
  const width = mountRef.value.clientWidth
  const height = mountRef.value.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

// ════════ HELPER: HIGH-FIDELITY 4K BULLET CCTV SECURITY CAMERA ════════
// ════════ HELPER: HIGH-FIDELITY ENTERPRISE SERVER BLADE RACK TOWER ════════
// ════════ HELPER: REALISTIC 2U RACKMOUNT NVR STORAGE CHASSIS ════════
// ════════ HELPER: REALISTIC 3-RACK SOVEREIGN HQ ENTERPRISE DATA CENTER ════════
function createSovereignHqCluster(): THREE.Group {
  const group = new THREE.Group()

  // Base Industrial Platform Plate
  const plateGeo = new THREE.BoxGeometry(7.6, 0.4, 4.0)
  const plateMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, roughness: 0.25 })
  const plateMesh = new THREE.Mesh(plateGeo, plateMat)
  plateMesh.position.y = -0.2
  group.add(plateMesh)

  // 3 Side-by-Side Enterprise Server Cabinets
  const rackOffsets = [-2.3, 0, 2.3]
  rackOffsets.forEach((offsetX) => {
    const { group: rack, leds: rackLeds } = createBladeServerTower(0x750d37)
    ledMeshes.push(...rackLeds)
    rack.position.set(offsetX, 0, 0)
    group.add(rack)
  })

  // Overhead Wire & Cable Tray Conduit
  const trayGeo = new THREE.BoxGeometry(7.2, 0.16, 0.5)
  const trayMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 })
  const trayMesh = new THREE.Mesh(trayGeo, trayMat)
  trayMesh.position.set(0, 4.4, 0)
  group.add(trayMesh)

  // Central Holographic Command Core Orb
  const coreOrbGeo = new THREE.IcosahedronGeometry(0.95, 3)
  const coreOrbMat = new THREE.MeshStandardMaterial({
    color: 0xe02870,
    emissive: 0x750d37,
    emissiveIntensity: 1.0,
    wireframe: true,
  })
  const coreOrbMesh = new THREE.Mesh(coreOrbGeo, coreOrbMat)
  coreOrbMesh.name = 'coreHqOrb'
  coreOrbMesh.position.set(0, 5.6, 0)
  group.add(coreOrbMesh)

  return group
}

onMounted(() => {
  allInteractables.length = 0
  packets.length = 0
  animatedCctvCameras.length = 0

  const container = mountRef.value
  if (!container) return

  const width = container.clientWidth
  const height = container.clientHeight || 450

  // Shared render setup: ACES tone mapping, shadows and an image-based
  // environment, so metal reflects something instead of reading as flat card.
  stage = createStage(container, { fov: 45, fogDensity: 0.018, exposure: 1.2 })
  scene = stage.scene
  camera = stage.camera
  renderer = stage.renderer
  camera.position.set(0, 6.0, DEFAULT_ZOOM_Z)
  camera.lookAt(0, 0, 0)

  topologyGroup = new THREE.Group()
  topologyGroup.rotation.x = 0.1
  scene.add(topologyGroup)

  const gridHelper = new THREE.GridHelper(60, 40, 0x750d37, 0x27272a)
  gridHelper.position.y = -0.3
  topologyGroup.add(gridHelper)


  const selRingGeo = new THREE.RingGeometry(1.5, 1.7, 32)
  const selRingMat = new THREE.MeshBasicMaterial({ color: 0xe02870, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
  selectionRingMesh = new THREE.Mesh(selRingGeo, selRingMat)
  selectionRingMesh.visible = false
  topologyGroup.add(selectionRingMesh)

  const labelsList: NodeLabel[] = []

  function add3DPacket(start: THREE.Vector3, end: THREE.Vector3, colorHex = 0xe02870) {
    const numPackets = 3
    const speed = 0.008 + Math.random() * 0.006
    for (let i = 0; i < numPackets; i++) {
      const pktMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), new THREE.MeshBasicMaterial({ color: colorHex }))
      topologyGroup.add(pktMesh)
      packets.push({
        start,
        end,
        progress: i / numPackets,
        speed,
        mesh: pktMesh,
      })
    }
  }

  // 1. Central Sovereign Core HQ 3-Rack Data Center Cluster
  const coreGroup = createSovereignHqCluster()
  coreGroup.position.set(0, 0, 0)
  coreGroup.userData = {
    name: 'SHADOWVERSE SOVEREIGN CORE (HQ)',
    servers: 'Global Data Sync & Cross-District Federation (Primary State HQ)',
    latency: 'Sub-1ms Mesh Routing',
    status: 'ONLINE · SOVEREIGN MASTER',
    detail: 'Central state police command hub handling cross-district federation, global policy dispatch, and real-time incident routing.',
  }
  coreGroup.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.userData = coreGroup.userData
      allInteractables.push(child)
    }
  })

  topologyGroup.add(coreGroup)

  labelsList.push({
    id: 'core-label',
    name: 'SHADOWVERSE SOVEREIGN CORE',
    subtext: 'STATE POLICE HQ FEDERATION',
    color: '#750d37',
    worldPos: new THREE.Vector3(0, 6.4, 0),
    screenX: 0,
    screenY: 0,
    isHeader: true,
  })

  // 2. 6 National Edge Data Center Blade Towers (Major Indian Metro Hubs)
  const districtNodes = [
    { id: 'dc1', name: 'NATIONAL EDGE DATA CENTER 1', city: 'Mumbai Metro Edge', servers: 250, color: 0xe02870, colorHex: '#e02870' },
    { id: 'dc2', name: 'NATIONAL EDGE DATA CENTER 2', city: 'Delhi NCR Edge', servers: 220, color: 0x3d8b5e, colorHex: '#3d8b5e' },
    { id: 'dc3', name: 'NATIONAL EDGE DATA CENTER 3', city: 'Bengaluru Tech Hub', servers: 200, color: 0x4a7ebb, colorHex: '#4a7ebb' },
    { id: 'dc4', name: 'NATIONAL EDGE DATA CENTER 4', city: 'Hyderabad Cyberabad', servers: 180, color: 0x3d8b5e, colorHex: '#3d8b5e' },
    { id: 'dc5', name: 'NATIONAL EDGE DATA CENTER 5', city: 'Chennai Coastal Edge', servers: 160, color: 0xe02870, colorHex: '#e02870' },
    { id: 'dc6', name: 'NATIONAL EDGE DATA CENTER 6', city: 'Kolkata Eastern Edge', servers: 140, color: 0x4a7ebb, colorHex: '#4a7ebb' },
  ]

  const RING_RADIUS = 16.0
  const edgePositions: THREE.Vector3[] = []

  districtNodes.forEach((node, idx) => {
    const angle = (idx / districtNodes.length) * Math.PI * 2
    const x = Math.cos(angle) * RING_RADIUS
    const z = Math.sin(angle) * RING_RADIUS
    const y = 0
    const edgePos = new THREE.Vector3(x, y, z)
    edgePositions.push(edgePos)

    // District Server Cabinet Tower
    const { group: towerGroup, leds: towerLeds } = createBladeServerTower(node.color)
    ledMeshes.push(...towerLeds)
    towerGroup.position.copy(edgePos)
    towerGroup.userData = {
      name: `${node.name} (${node.city})`,
      servers: `${node.servers} Edge Compute Nodes · Dedicated CCTV & NVR Ingestion`,
      latency: `Sub-5ms Local Processing`,
      status: 'AUTONOMOUS OPERATIONAL EDGE',
      detail: `Local autonomous district blade server cabinet processing ${node.servers} compute nodes, 2,000+ CCTV camera streams, and sub-5ms local AI inference.`,
    }
    towerGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.userData = towerGroup.userData
        allInteractables.push(child)
      }
    })
    topologyGroup.add(towerGroup)

    labelsList.push({
      id: `label-${node.id}`,
      name: node.name,
      subtext: `${node.city.toUpperCase()} · ${node.servers} NODES`,
      color: node.colorHex,
      worldPos: new THREE.Vector3(x, y + 4.8, z),
      screenX: 0,
      screenY: 0,
    })

    // NVR Storage Aggregator Unit (placed outward at distance 5.5 from District Server Cabinet)
    const nvrAngle = angle - 0.25
    const nvrX = x + Math.cos(nvrAngle) * 5.5
    const nvrZ = z + Math.sin(nvrAngle) * 5.5
    const nvrPos = new THREE.Vector3(nvrX, 0.8, nvrZ)

    const nvrGroup = createNvrStorageUnit(0x3d8b5e)
    nvrGroup.position.copy(nvrPos)
    nvrGroup.userData = {
      name: `NVR AGGREGATOR UNIT (${node.city})`,
      servers: '4-Camera RTSP Stream Aggregator Unit',
      latency: 'INGESTING 4x 4K FEEDS',
      status: 'ACTIVE NVR',
      detail: 'Hardware 2U NVR storage chassis aggregating 4 live 4K CCTV RTSP video streams for high-speed GPU decoding.',
    }
    nvrGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.userData = nvrGroup.userData
        allInteractables.push(child)
      }
    })
    topologyGroup.add(nvrGroup)

    // 4 4K CCTV Bullet Security Cameras Clustered Around the NVR (Fan Arc Array)
    const numCameras = 4
    for (let c = 0; c < numCameras; c++) {
      const camArcOffset = -0.45 + c * 0.30
      const camAngle = nvrAngle + camArcOffset
      const camX = nvrX + Math.cos(camAngle) * 4.8
      const camZ = nvrZ + Math.sin(camAngle) * 4.8
      const camPos = new THREE.Vector3(camX, 1.2, camZ)

      const cctvPodGroup = createRealisticCctvCamera(0x3d8b5e)
      cctvPodGroup.position.copy(camPos)

      // Aim camera lens outward along its radial angle for multi-directional sector coverage
      const facingAngle = Math.atan2(camZ - nvrZ, camX - nvrX)
      cctvPodGroup.rotation.y = -facingAngle

      animatedCctvCameras.push({
        group: cctvPodGroup,
        baseRotationY: -facingAngle,
        phase: c * 0.7 + idx,
      })

      cctvPodGroup.userData = {
        name: `4K CCTV CAMERA ${c + 1} (${node.city})`,
        servers: `RTSP 60FPS Video Channel ${c + 1} Stream`,
        latency: 'SUB-20ms VISION AI INGESTION',
        status: `CAM-${c + 1} STREAMING`,
        detail: `Ultra-HD 4K IP security camera channel ${c + 1} streaming live 60FPS RTSP video frames into the NVR unit.`,
      }
      cctvPodGroup.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.userData = cctvPodGroup.userData
          allInteractables.push(child)
        }
      })
      topologyGroup.add(cctvPodGroup)

      // 1. Line & Packet: Each CCTV Camera -> NVR Unit
      topologyGroup.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([camPos, nvrPos]),
        new THREE.LineBasicMaterial({ color: 0x3d8b5e, opacity: 0.85, transparent: true })
      ))
      add3DPacket(camPos, nvrPos, 0x3d8b5e)
    }

    // 2. Line & Packet: NVR Unit -> District Blade Server Cabinet
    const serverTopPos = new THREE.Vector3(x, 1.7, z)
    topologyGroup.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([nvrPos, serverTopPos]),
      new THREE.LineBasicMaterial({ color: 0x06b6d4, opacity: 0.9, transparent: true })
    ))
    add3DPacket(nvrPos, serverTopPos, 0x06b6d4)

    // 3. Line & Packet: District Blade Server Cabinet -> Sovereign Core HQ
    const corePos = new THREE.Vector3(0, 1.0, 0)
    topologyGroup.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([serverTopPos, corePos]),
      new THREE.LineBasicMaterial({ color: node.color, opacity: 0.85, transparent: true })
    ))
    add3DPacket(serverTopPos, corePos, node.color)
  })

  // 5. DIRECT PEER-TO-PEER (P2P) INTER-DISTRICT EDGE MESH COMMUNICATIONS
  for (let i = 0; i < edgePositions.length; i++) {
    const nextIdx = (i + 1) % edgePositions.length
    const crossIdx = (i + 3) % edgePositions.length

    const p1 = edgePositions[i]
    const p2 = edgePositions[nextIdx]
    const p3 = edgePositions[crossIdx]

    // Direct Neighbor Peer Conduit
    if (p1 && p2) {
      const p1Top = new THREE.Vector3(p1.x, 1.7, p1.z)
      const p2Top = new THREE.Vector3(p2.x, 1.7, p2.z)

      const peerLineGeo = new THREE.BufferGeometry().setFromPoints([p1Top, p2Top])
      const peerLineMat = new THREE.LineBasicMaterial({ color: 0x3d8b5e, transparent: true, opacity: 0.85 })
      topologyGroup.add(new THREE.Line(peerLineGeo, peerLineMat))

      // Bi-directional Direct P2P Edge Packet Streams
      add3DPacket(p1Top, p2Top, 0x3d8b5e)
      add3DPacket(p2Top, p1Top, 0xe02870)
    }

    // Direct Cross-District Peer Conduit
    if (p1 && p3 && i < 3) {
      const p1Top = new THREE.Vector3(p1.x, 1.7, p1.z)
      const p3Top = new THREE.Vector3(p3.x, 1.7, p3.z)

      const crossLineGeo = new THREE.BufferGeometry().setFromPoints([p1Top, p3Top])
      const crossLineMat = new THREE.LineBasicMaterial({ color: 0x4a7ebb, transparent: true, opacity: 0.6 })
      topologyGroup.add(new THREE.Line(crossLineGeo, crossLineMat))

      add3DPacket(p1Top, p3Top, 0x4a7ebb)
    }
  }

  // Set loading complete
  isLoadingModels.value = false
  modelLoadingProgress.value = 100

  // Opt the built geometry into shadowing. Only lit, solid surfaces: wireframes
  // and unlit markers would just add cost and noise to the depth pass.
  topologyGroup.traverse((child) => {
    const mesh = child as THREE.Mesh
    if (!mesh.isMesh) return
    const mat = mesh.material as THREE.MeshStandardMaterial
    if (!mat || Array.isArray(mesh.material) || mat.wireframe) return
    if (!(mat as unknown as { isMeshStandardMaterial?: boolean }).isMeshStandardMaterial) return
    mesh.castShadow = true
    mesh.receiveShadow = true
  })

  nodeLabels.value = labelsList

  function update3DSpaceLabels() {
    if (!mountRef.value || !camera || !topologyGroup) return
    const containerW = mountRef.value.clientWidth
    const containerH = mountRef.value.clientHeight
    const tempVec = new THREE.Vector3()

    nodeLabels.value.forEach((lbl) => {
      tempVec.copy(lbl.worldPos)
      tempVec.applyMatrix4(topologyGroup.matrixWorld)
      const dist = camera.position.distanceTo(tempVec)
      lbl.zIndex = Math.max(1, Math.round(2000 - dist * 10))

      tempVec.project(camera)

      // Cull anything behind the camera or well outside the frame so badges
      // never pile up against the viewport edges.
      const onScreen = tempVec.z < 1.0 && Math.abs(tempVec.x) < 1.25 && Math.abs(tempVec.y) < 1.3

      // Depth cue: far badges recede in size and opacity, near ones stay crisp.
      const fade = Math.min(1, Math.max(0, (dist - 24) / 36))
      lbl.opacity = onScreen ? 1 - fade * 0.55 : 0
      lbl.scale = 1 - fade * 0.26

      const rawX = (tempVec.x * 0.5 + 0.5) * containerW
      const rawY = (-(tempVec.y * 0.5) + 0.5) * containerH

      lbl.screenX = Math.max(80, Math.min(containerW - 80, rawX))
      lbl.screenY = Math.max(48, Math.min(containerH - 24, rawY))
    })

    // Screen-space declutter: walk labels front-to-back and drop any badge that
    // would overlap a nearer one, so distant nodes never sit on top of close ones.
    const placed: Array<{ x: number; y: number; hw: number; hh: number }> = []
    nodeLabels.value
      .filter((l) => (l.opacity ?? 0) > 0)
      .sort((a, b) => {
        // Headers claim their space first; they are the primary read of the scene
        // and must never be culled by a secondary node badge.
        if (!!a.isHeader !== !!b.isHeader) return a.isHeader ? -1 : 1
        return (b.zIndex ?? 0) - (a.zIndex ?? 0)
      })
      .forEach((lbl) => {
        const sc = lbl.scale ?? 1
        const hw = (lbl.isHeader ? 132 : 108) * sc
        const hh = (lbl.isHeader ? 34 : 32) * sc
        // The badge is drawn above its anchor point, so test that shifted box.
        const cy = lbl.screenY - hh - 16 * sc
        const clash = placed.some(
          (p) => Math.abs(p.x - lbl.screenX) < p.hw + hw && Math.abs(p.y - cy) < p.hh + hh
        )
        // Headers are the scene's structure and always render; only the
        // secondary node badges yield when space runs out. Hiding uses opacity,
        // not display, so a badge fades instead of blinking as the camera moves
        // it across a collision boundary.
        if (clash && !lbl.isHeader) {
          lbl.opacity = 0
        } else {
          placed.push({ x: lbl.screenX, y: cy, hw, hh })
        }
      })
  }

function animate() {
  packets.forEach((p) => {
    p.progress += p.speed
    if (p.progress > 1.0) p.progress = 0
    p.mesh.position.lerpVectors(p.start, p.end, p.progress)
  })

  update3DSpaceLabels()

  // 1. Rotate and Pulse central Sovereign Core HQ holographic Core Orb
  if (coreGroup) {
    const orb = coreGroup.getObjectByName('coreHqOrb') as THREE.Mesh
    if (orb) {
      orb.rotation.y += 0.012
      orb.rotation.x += 0.006
      if (orb.material) {
        const mat = orb.material as THREE.MeshStandardMaterial
        mat.emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.003) * 0.3
      }
    }
  }

  // 2. Wave indicator flashing server LEDs (mesh list cached at build time)
  const flashTime = Date.now() * 0.005
  ledMeshes.forEach((mesh) => {
    const mat = mesh.material as THREE.MeshStandardMaterial
    if (mat) {
      const pulse = Math.sin(flashTime + mesh.position.y * 10 + mesh.position.x * 20)
      mat.emissiveIntensity = pulse > 0.3 ? 0.95 : 0.15
    }
  })

  // 3. Pointer cursor highlight on hover — only re-raycast when the pointer moved
  if (pointerMoved) {
    pointerMoved = false
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(allInteractables, true)
    if (mountRef.value) mountRef.value.style.cursor = intersects.length > 0 ? 'pointer' : 'grab'
  }

  renderer.render(scene, camera)
  animId = requestAnimationFrame(animate)
}



  animate()

  let resizeObserver: ResizeObserver | null = null
  if (mountRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      handleResize()
    })
    resizeObserver.observe(mountRef.value)
  }

  window.addEventListener('resize', handleResize)
  if (typeof document !== 'undefined') {
    document.addEventListener('fullscreenchange', handleFullscreenChange)
  }
})

onBeforeUnmount(() => {
  if (animId) cancelAnimationFrame(animId)
  window.removeEventListener('resize', handleResize)
  stage?.dispose()
  if (typeof document !== 'undefined') {
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }
})
</script>

<template>
  <div
    ref="containerRef"
    :class="props.minimal ? 'w-full h-full relative overflow-hidden select-none bg-transparent' : ('industrial-card p-3 sm:p-4 bg-[#09090b] border-[#e02870] relative overflow-hidden group shadow-2xl my-3 transition-all ' + (isFullscreen ? 'fixed inset-0 z-50 my-0 rounded-none border-none p-6 bg-black' : ''))"
  >
    <!-- Header Control Bar (Only shown when not in minimal presentation mode) -->
    <div v-if="!props.minimal" class="flex items-center justify-between border-b border-[#27272a] pb-2 mb-1 font-mono text-xs z-10 relative">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-[#e02870] animate-ping"></span>
        <span class="text-[#e02870] font-black uppercase tracking-wider">// SHADOWVERSE DIST DATA CENTER DESIGN</span>
      </div>

      <!-- CAMERA PRESETS & CONTROL BUTTONS -->
      <div class="flex items-center gap-1 sm:gap-2">
        <button
          @click="setCameraPreset('OVERVIEW')"
          title="Overview Preset View"
          class="px-2 py-0.5 text-[10px] font-mono font-bold uppercase border bg-[#121216] border-[#27272a] text-zinc-300 hover:border-[#e02870] hover:text-[#e02870] transition-colors cursor-pointer"
        >
          OVERVIEW
        </button>
        <button
          @click="setCameraPreset('CORE')"
          title="Focus Core HQ"
          class="px-2 py-0.5 text-[10px] font-mono font-bold uppercase border bg-[#121216] border-[#27272a] text-zinc-300 hover:border-[#750d37] hover:text-[#e02870] transition-colors cursor-pointer"
        >
          FOCUS CORE
        </button>
        <button
          @click="zoomIn"
          title="Zoom In"
          class="px-2 py-0.5 text-[11px] font-mono font-black uppercase border bg-[#121216] border-[#27272a] text-white hover:border-[#e02870] hover:text-[#e02870] transition-colors cursor-pointer"
        >
          +
        </button>
        <button
          @click="zoomOut"
          title="Zoom Out"
          class="px-2 py-0.5 text-[11px] font-mono font-black uppercase border bg-[#121216] border-[#27272a] text-white hover:border-[#e02870] hover:text-[#e02870] transition-colors cursor-pointer"
        >
          -
        </button>
        <button
          @click="resetZoom"
          title="Reset Zoom & Pan"
          class="px-2 py-0.5 text-[10px] font-mono font-bold uppercase border bg-[#121216] border-[#27272a] text-zinc-300 hover:border-white transition-colors cursor-pointer hidden sm:inline"
        >
          RESET
        </button>
        <button
          @click="toggleFullscreen"
          class="px-2 py-0.5 text-[10px] font-mono font-bold uppercase border transition-colors cursor-pointer flex items-center gap-1 bg-[#121216] border-[#27272a] text-white hover:border-[#e02870]"
        >
          <span class="material-symbols-outlined text-xs">{{ isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}</span>
          <span>{{ isFullscreen ? 'EXIT' : 'FULLSCREEN' }}</span>
        </button>
      </div>
    </div>

    <!-- 3D WebGL Canvas Container -->
    <div
      ref="mountRef"
      @pointerdown="onPointerDown"
      @pointermove="onHoverMove"
      @contextmenu="onContextMenu"
      @wheel="onWheel"
      class="w-full cursor-grab active:cursor-grabbing relative overflow-hidden touch-none select-none"
      :class="props.minimal ? 'h-full' : (isFullscreen ? 'h-[calc(100vh-90px)]' : 'h-[58vh] sm:h-[65vh]')"
    >
      <!-- Floating 3D space label overlay: GPU-composited, depth-faded, stem-anchored -->
      <div
        v-for="lbl in nodeLabels"
        :key="lbl.id"
        class="node-label absolute left-0 top-0 pointer-events-none flex flex-col items-center"
        :style="{
          transform: `translate3d(${lbl.screenX}px, ${lbl.screenY}px, 0) translate(-50%, -100%) scale(${lbl.scale ?? 1})`,
          opacity: lbl.opacity ?? 1,
          zIndex: lbl.zIndex || 10,
        }"
      >
        <!-- Header Badge: the one anchor label, carries full weight -->
        <div
          v-if="lbl.isHeader"
          class="px-4 py-2 bg-[#0a0a0e]/92 backdrop-blur-sm border-2 font-mono shadow-2xl whitespace-nowrap text-center"
          :style="{ borderColor: lbl.color, boxShadow: `0 0 20px -6px ${lbl.color}` }"
        >
          <div class="text-white font-black text-xs sm:text-sm tracking-wider uppercase">{{ lbl.name }}</div>
          <div class="text-[10px] text-zinc-300 font-bold tracking-widest mt-0.5">{{ lbl.subtext }}</div>
        </div>

        <!-- Node Badge: lighter chrome so six of them do not fight the geometry -->
        <div
          v-else
          class="pl-2.5 pr-3 py-1.5 bg-[#0a0a0e]/88 backdrop-blur-sm border border-white/10 border-l-[3px] font-mono shadow-xl whitespace-nowrap text-left"
          :style="{ borderLeftColor: lbl.color }"
        >
          <div class="text-white font-bold text-[11px] sm:text-xs tracking-wide">{{ lbl.name }}</div>
          <div class="text-[9px] sm:text-[10px] text-zinc-400 font-semibold tracking-wider mt-px">{{ lbl.subtext }}</div>
        </div>

        <!-- Stem tying the badge to the object it names -->
        <div class="w-px h-4" :style="{ background: `linear-gradient(to bottom, ${lbl.color}, transparent)` }"></div>
      </div>

      <!-- SELECTED NODE TELEMETRY INSPECTION DRAWER CARD (UX) -->
      <div
        v-if="selectedNode"
        class="absolute bottom-14 right-3 p-3 bg-[#121216] border-2 border-[#e02870] font-mono text-xs text-white shadow-2xl z-30 max-w-sm w-full space-y-2 animate-fade-in"
      >
        <div class="flex items-center justify-between border-b border-[#27272a] pb-1.5">
          <div class="text-[#e02870] font-black uppercase text-xs flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm">info</span>
            <span>NODE TELEMETRY INSPECTOR</span>
          </div>
          <button @click="selectedNode = null" class="text-zinc-400 hover:text-white cursor-pointer flex items-center"><span class="material-symbols-outlined text-base">close</span></button>
        </div>
        <div class="font-bold text-sm text-[#e02870]">{{ selectedNode.name }}</div>
        <div class="text-zinc-300 text-[11px] leading-relaxed">{{ selectedNode.detail || selectedNode.servers }}</div>
        <div class="flex items-center justify-between text-[10px] pt-1 border-t border-[#27272a]">
          <span class="text-emerald-400 font-bold">{{ selectedNode.latency }}</span>
          <span class="px-2 py-0.5 bg-[#e02870]/20 text-[#e02870] font-bold border border-[#e02870]/40">{{ selectedNode.status }}</span>
        </div>
      </div>
    </div>

    <!-- Footer Legend (Only shown when not minimal) -->
    <div v-if="!props.minimal" class="flex flex-wrap items-center justify-between border-t border-[#27272a] pt-2 font-mono text-[10px] text-zinc-400 z-10 relative gap-2">
      <div class="flex flex-wrap items-center gap-3">
        <span class="flex items-center gap-1 text-[#3d8b5e] font-bold">
          <span class="w-2 h-2 bg-[#3d8b5e]"></span>
          <span>DIRECT P2P INTER-EDGE MESH</span>
        </span>
        <span class="flex items-center gap-1 text-[#750d37] font-bold">
          <span class="w-2 h-2 bg-[#750d37]"></span>
          <span>SOVEREIGN CORE HQ CLUSTER</span>
        </span>
        <span class="flex items-center gap-1 text-[#e02870] font-bold">
          <span class="w-2 h-2 bg-[#e02870]"></span>
          <span>DISTRICT BLADE SERVER CABINETS</span>
        </span>
        <span class="flex items-center gap-1 text-[#4a7ebb] font-bold">
          <span class="w-2 h-2 bg-[#4a7ebb]"></span>
          <span>4K CCTV CAMERAS & NVRs</span>
        </span>
      </div>
      <span class="text-[#e02870] font-bold">CLICK NODE TO INSPECT · DRAG TO ROTATE/PAN</span>
    </div>
  </div>
</template>

<style scoped>
/* Labels are repositioned every frame via transform, so only fade them in on
   mount — never transition transform, or they would lag the geometry. */
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
