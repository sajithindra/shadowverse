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

const containerRef = ref<HTMLDivElement | null>(null)
const mountRef = ref<HTMLDivElement | null>(null)
const isFullscreen = ref(false)

interface CctvObject {
  group: THREE.Group
  baseRotationY: number
  phase: number
}

const animatedCctvCameras: CctvObject[] = []

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

let pipelineGroup: THREE.Group
let selectionRingMesh: THREE.Mesh | null = null

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2(-1000, -1000)
let isDragging = false
let dragButton = 0
let isShiftPressed = false
let previousMouse = { x: 0, y: 0 }

const MIN_ZOOM_Z = 15.0
const MAX_ZOOM_Z = 160.0
const DEFAULT_ZOOM_Z = 58.0

function zoomIn() {
  if (!camera) return
  const dir = new THREE.Vector3()
  camera.getWorldDirection(dir)
  camera.position.addScaledVector(dir, 7.0)
}

function zoomOut() {
  if (!camera) return
  const dir = new THREE.Vector3()
  camera.getWorldDirection(dir)
  camera.position.addScaledVector(dir, -7.0)
}

function setCameraPreset(preset: 'OVERVIEW' | 'PIPELINE' | 'RESET') {
  if (!camera || !pipelineGroup) return
  if (preset === 'PIPELINE') {
    camera.position.set(-10.0, 18.0, 65.0)
    camera.lookAt(-10.0, 0, 0)
    pipelineGroup.position.set(0, 0, 0)
    pipelineGroup.rotation.set(0, 0, 0)
  } else if (preset === 'OVERVIEW') {
    camera.position.set(0, 42.0, 115.0)
    camera.lookAt(0, 0, 0)
    pipelineGroup.position.set(0, 0, 0)
    pipelineGroup.rotation.set(0.30, 0, 0)
  } else {
    resetZoom()
  }
}

function resetZoom() {
  if (!camera || !pipelineGroup) return
  camera.position.set(0, 20.0, DEFAULT_ZOOM_Z)
  camera.lookAt(0, 0, 0)
  pipelineGroup.position.set(0, 0, 0)
  pipelineGroup.rotation.set(0.14, 0, 0)
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

  const zoomFactor = event.deltaY * -0.03

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

  if (isDragging && pipelineGroup) {
    const deltaX = event.clientX - previousMouse.x
    const deltaY = event.clientY - previousMouse.y

    if (dragButton === 2 || isShiftPressed || event.shiftKey) {
      pipelineGroup.position.x += deltaX * 0.04
      pipelineGroup.position.y -= deltaY * 0.04
    } else {
      pipelineGroup.rotation.y += deltaX * 0.006
      pipelineGroup.rotation.x += deltaY * 0.006
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

        // Find the top-level parent node group under pipelineGroup
        let targetObj: THREE.Object3D | null = topObj
        while (targetObj && targetObj.parent && targetObj.parent !== pipelineGroup && targetObj.parent !== scene) {
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

interface PipelineLabel {
  id: string
  text: string
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

const pipelineLabels = ref<PipelineLabel[]>([])
const allInteractables: THREE.Object3D[] = []

interface PacketStream {
  start: THREE.Vector3
  end: THREE.Vector3
  progress: number
  speed: number
  mesh: THREE.Mesh
  isDynamicBurst?: boolean
  timer?: number
  activeDuration?: number
  idleDuration?: number
  isActive?: boolean
  lineMat?: THREE.LineBasicMaterial
}

const packetList: PacketStream[] = []

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

// ════════ HELPER 1: HIGH-FIDELITY 4K BULLET CCTV SECURITY CAMERA ════════
// ════════ HELPER 2: HIGH-FIDELITY ENTERPRISE SERVER BLADE RACK TOWER ════════
// ════════ HELPER 3: REALISTIC 2U RACKMOUNT NVR STORAGE CHASSIS ════════
// ════════ HELPER 4: POLICE ENDPOINT DEVICES ════════
function create3DSmartphoneSlab(colorHex = 0xe02870): THREE.Group {
  const group = new THREE.Group()

  const phoneGeo = new THREE.BoxGeometry(1.4, 2.6, 0.16)
  const phoneMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, roughness: 0.2 })
  const phoneMesh = new THREE.Mesh(phoneGeo, phoneMat)
  group.add(phoneMesh)

  const screenGeo = new THREE.PlaneGeometry(1.25, 2.3)
  const screenMat = new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex, emissiveIntensity: 0.3, roughness: 0.05, side: THREE.DoubleSide })
  const screenMesh = new THREE.Mesh(screenGeo, screenMat)
  screenMesh.position.z = 0.09
  group.add(screenMesh)

  return group
}

function create3DFieldLaptop(colorHex = 0x4a7ebb): THREE.Group {
  const group = new THREE.Group()

  const baseGeo = new THREE.BoxGeometry(2.6, 0.15, 1.8)
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85 })
  const baseMesh = new THREE.Mesh(baseGeo, baseMat)
  group.add(baseMesh)

  const lidGeo = new THREE.BoxGeometry(2.6, 1.6, 0.1)
  const lidMat = new THREE.MeshStandardMaterial({ color: colorHex, metalness: 0.8, roughness: 0.2 })
  const lidMesh = new THREE.Mesh(lidGeo, lidMat)
  lidMesh.position.set(0, 0.8, -0.8)
  lidMesh.rotation.x = -0.25
  group.add(lidMesh)

  return group
}

function create3DStationPcTerminal(colorHex = 0x3d8b5e): THREE.Group {
  const group = new THREE.Group()

  const monGeo = new THREE.BoxGeometry(2.8, 1.7, 0.15)
  const monMat = new THREE.MeshStandardMaterial({ color: colorHex, metalness: 0.85 })
  const monMesh = new THREE.Mesh(monGeo, monMat)
  monMesh.position.set(-0.5, 0.75, 0)
  group.add(monMesh)

  const standGeo = new THREE.CylinderGeometry(0.1, 0.28, 0.55, 12)
  const standMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 })
  const standMesh = new THREE.Mesh(standGeo, standMat)
  standMesh.position.set(-0.5, -0.28, 0)
  group.add(standMesh)

  const towerGeo = new THREE.BoxGeometry(1.0, 1.9, 1.5)
  const towerMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 })
  const towerMesh = new THREE.Mesh(towerGeo, towerMat)
  towerMesh.position.set(1.4, 0.45, 0)
  group.add(towerMesh)

  return group
}

// ════════ HELPER 5: SHADOWWATCH HEXAGONAL GOVERNANCE HUB ════════
function createShadowWatchHub(): THREE.Group {
  const group = new THREE.Group()

  const baseGeo = new THREE.CylinderGeometry(2.6, 3.0, 0.5, 6)
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, roughness: 0.25 })
  const baseMesh = new THREE.Mesh(baseGeo, baseMat)
  baseMesh.position.y = -0.25
  group.add(baseMesh)

  const hubGeo = new THREE.CylinderGeometry(2.4, 2.4, 4.6, 6)
  const hubMat = new THREE.MeshStandardMaterial({ color: 0x111116, metalness: 0.9, roughness: 0.2 })
  const hubMesh = new THREE.Mesh(hubGeo, hubMat)
  hubMesh.position.y = 2.3
  group.add(hubMesh)

  const wireGeo = new THREE.CylinderGeometry(2.42, 2.42, 4.62, 6)
  const wireMat = new THREE.MeshBasicMaterial({ color: 0x3d8b5e, wireframe: true })
  const wireMesh = new THREE.Mesh(wireGeo, wireMat)
  wireMesh.position.y = 2.3
  group.add(wireMesh)

  const orbGeo = new THREE.IcosahedronGeometry(1.1, 3)
  const orbMat = new THREE.MeshStandardMaterial({ color: 0x3d8b5e, emissive: 0x3d8b5e, emissiveIntensity: 0.9, wireframe: true })
  const orbMesh = new THREE.Mesh(orbGeo, orbMat)
  orbMesh.name = 'coreHqOrb'
  orbMesh.position.set(0, 5.8, 0)
  group.add(orbMesh)

  return group
}

onMounted(() => {
  allInteractables.length = 0
  packetList.length = 0
  animatedCctvCameras.length = 0

  const container = mountRef.value
  if (!container) return

  const width = container.clientWidth
  const height = container.clientHeight || 450

  // Shared render setup: ACES tone mapping, shadows and an image-based
  // environment, so metal reflects something instead of reading as flat card.
  stage = createStage(container, { fov: 45, fogDensity: 0.007, exposure: 1.2 })
  scene = stage.scene
  camera = stage.camera
  renderer = stage.renderer
  camera.position.set(0, 20.0, DEFAULT_ZOOM_Z)
  camera.lookAt(0, 0, 0)

  pipelineGroup = new THREE.Group()
  pipelineGroup.rotation.x = 0.14
  scene.add(pipelineGroup)

  const gridHelper = new THREE.GridHelper(200, 100, 0x750d37, 0x27272a)
  gridHelper.position.y = -0.3
  pipelineGroup.add(gridHelper)


  const selRingGeo = new THREE.RingGeometry(1.8, 2.1, 32)
  const selRingMat = new THREE.MeshBasicMaterial({ color: 0xe02870, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
  selectionRingMesh = new THREE.Mesh(selRingGeo, selRingMat)
  selectionRingMesh.visible = false
  pipelineGroup.add(selectionRingMesh)

  const labels: PipelineLabel[] = []

  function add3DPacket(
    start: THREE.Vector3,
    end: THREE.Vector3,
    color = 0xe02870,
    customSpeed?: number,
    isDynamicBurst = false,
    lineMat?: THREE.LineBasicMaterial
  ) {
    const numPackets = 3
    const speed = customSpeed ?? (0.012 + Math.random() * 0.01)
    for (let i = 0; i < numPackets; i++) {
      const geo = new THREE.SphereGeometry(0.24, 12, 12)
      const mat = new THREE.MeshBasicMaterial({ color })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.copy(start)
      pipelineGroup.add(mesh)
      packetList.push({
        start,
        end,
        progress: i / numPackets,
        speed,
        mesh,
        isDynamicBurst,
        timer: Math.floor(Math.random() * 100),
        activeDuration: Math.floor(100 + Math.random() * 120),
        idleDuration: Math.floor(60 + Math.random() * 120),
        isActive: true,
        lineMat,
      })
    }
  }

  // ════════ 3D FLOOR PLANE SECTOR 1: INGESTION & GPU DECODE (X = -48.0 to -32.0) ════════
  labels.push({
    id: 'col1-header',
    text: '1. INGESTION & DECODE',
    subtext: 'CCTV / NVR / GPU DECODE',
    color: '#3d8b5e',
    worldPos: new THREE.Vector3(-40.0, 9.0, 0),
    screenX: 0,
    screenY: 0,
    isHeader: true,
  })

  // 3 4K CCTV Bullet Security Cameras at X = -48.0
  const camPositions: THREE.Vector3[] = []
  for (let c = 0; c < 3; c++) {
    camPositions.push(new THREE.Vector3(-48.0, 1.2, -6.0 + c * 6.0))
  }

  for (let c = 0; c < 3; c++) {
    const camPos = camPositions[c]!
    const camPodGroup = createRealisticCctvCamera(0x3d8b5e)
    camPodGroup.position.copy(camPos)

    const facingAngle = Math.atan2(0 - camPos.z, -40.0 - camPos.x)
    camPodGroup.rotation.y = -facingAngle
    camPodGroup.rotation.z = Math.PI

    animatedCctvCameras.push({
      group: camPodGroup,
      baseRotationY: -facingAngle,
      phase: c * 0.8,
    })

    camPodGroup.userData = {
      name: `4K CCTV CAMERA #${c + 1}`,
      servers: 'RTSP 60FPS Video Feed Stream',
      latency: 'SUB-20ms VISION AI INGESTION',
      status: 'STREAMING TO NVR',
      detail: 'Ultra-HD dual-lens 4K IP camera streaming live 60FPS RTSP video frames into the NVR stream aggregator.',
    }
    camPodGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.userData = camPodGroup.userData
        allInteractables.push(child)
      }
    })
    pipelineGroup.add(camPodGroup)
  }

  // NVR Storage Aggregator Unit at X = -40.0
  const nvrPos = new THREE.Vector3(-40.0, 0.8, 0)
  const nvrGroup = createNvrStorageUnit(0x3d8b5e)
  nvrGroup.position.copy(nvrPos)
  nvrGroup.userData = {
    name: 'NVR UNIT',
    servers: 'RTSP Stream Aggregator for 12,000+ IP Cameras',
    latency: 'INGESTING FEEDS',
    status: 'ACTIVE NVR',
    detail: 'Hardware 2U NVR storage chassis aggregating multi-camera RTSP video streams for high-speed GPU decoding.',
  }
  nvrGroup.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.userData = nvrGroup.userData
      allInteractables.push(child)
    }
  })
  pipelineGroup.add(nvrGroup)

  // Conduits & Packets: Cameras -> NVR
  camPositions.forEach((pos) => {
    const dir = new THREE.Vector3().subVectors(nvrPos, pos).normalize()
    const lineStart = pos.clone().addScaledVector(dir, 0.85)

    pipelineGroup.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([lineStart, nvrPos]),
      new THREE.LineBasicMaterial({ color: 0x3d8b5e, transparent: true, opacity: 0.85 })
    ))
    add3DPacket(lineStart, nvrPos, 0x3d8b5e)
  })

  // Sovereign GPU Decode Server Cabinet at X = -32.0
  const serverPos = new THREE.Vector3(-32.0, 0, 0)
  const { group: serverCabinet, leds: cabinetLeds } = createBladeServerTower(0x4a7ebb)
  ledMeshes.push(...cabinetLeds)
  serverCabinet.position.copy(serverPos)
  serverCabinet.userData = {
    name: 'SOVEREIGN GPU SERVER',
    servers: 'Sub-50ms Hardware Stream Decoder (FFmpeg H.265 / NVDEC)',
    latency: 'SUB-50ms HW DECODE',
    status: 'FFMPEG HW DECODE ACTIVE',
    detail: 'High-density GPU server blade cabinet running hardware NVDEC H.265 frame extraction under 50ms.',
  }
  serverCabinet.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.userData = serverCabinet.userData
      allInteractables.push(child)
    }
  })
  pipelineGroup.add(serverCabinet)

  // Conduit & Packet: NVR -> GPU Server Cabinet
  const serverTopPos = new THREE.Vector3(-32.0, 2.5, 0)
  pipelineGroup.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([nvrPos, serverTopPos]),
    new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.9 })
  ))
  add3DPacket(nvrPos, serverTopPos, 0x06b6d4)

  // ════════ 3D FLOOR PLANE SECTOR 2: SHADOWVISION AI AGENTS ENCLOSURE (X = -20.0) ════════
  labels.push({
    id: 'col2-header',
    text: '2. SHADOWVISION AI AGENTS',
    subtext: 'AUTONOMOUS AI SWARM AGENTS',
    color: '#e02870',
    worldPos: new THREE.Vector3(-20.0, 9.0, 0),
    screenX: 0,
    screenY: 0,
    isHeader: true,
  })

  // Cybernetic Glass Enclosure Base & Frame (X = -20.0)
  const encBaseGeo = new THREE.BoxGeometry(6.5, 0.35, 14.5)
  const encBaseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, roughness: 0.25 })
  const encBaseMesh = new THREE.Mesh(encBaseGeo, encBaseMat)
  encBaseMesh.position.set(-20.0, -0.15, 0)
  pipelineGroup.add(encBaseMesh)

  const encFrameGeo = new THREE.BoxGeometry(6.54, 3.6, 14.54)
  const encFrameMat = new THREE.MeshBasicMaterial({ color: 0x750d37, wireframe: true })
  const encFrameMesh = new THREE.Mesh(encFrameGeo, encFrameMat)
  encFrameMesh.position.set(-20.0, 1.6, 0)
  encFrameMesh.userData = {
    name: 'SHADOWVISION AI AGENTS CONTAINER BOX',
    servers: 'Cybernetic enclosure housing Autonomous Safety, Protection, Tracking, & Law Agents',
    latency: 'SUB-20ms REASONING',
    status: 'AUTONOMOUS AGENTS EXECUTING & RECEIVING WRITES',
    detail: 'Cybernetic glass enclosure housing 4 specialized AI Swarm core reactors executing concurrently.',
  }
  pipelineGroup.add(encFrameMesh)
  allInteractables.push(encFrameMesh)

  const agentScenarios = [
    { title: 'SAFETY AGENT', sub: 'PERSON HURT', color: '#c44a4a', z: -5.2, detail: 'Monitors public spaces for fallen or distressed individuals using pose estimation.' },
    { title: 'PROTECTION AGENT', sub: 'CHILD ABANDONED', color: '#c49a3c', z: -1.7, detail: 'Detects unattended or wandering children and alerts nearby safety personnel.' },
    { title: 'TRACKING AGENT', sub: 'TRACKING PERSON', color: '#3d8b5e', z: 1.7, detail: 'Performs multi-camera ReID tracking across district edge camera networks.' },
    { title: 'LAW ENFORCEMENT AGENT', sub: 'STOLEN VEHICLE', color: '#e02870', z: 5.2, detail: 'Scans plate numbers against stolen vehicle databases and dispatches CAD alerts.' },
  ]

  const agentGroups: THREE.Group[] = []

  agentScenarios.forEach((ag, idx) => {
    const agGroup = new THREE.Group()
    agGroup.position.set(-20.0, 1.0, ag.z)

    const agGeo = new THREE.IcosahedronGeometry(0.95, 2)
    const agMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(ag.color), emissive: new THREE.Color(ag.color), emissiveIntensity: 0.5, wireframe: true })
    const agMesh = new THREE.Mesh(agGeo, agMat)
    agGroup.add(agMesh)

    const ringGeo = new THREE.TorusGeometry(1.2, 0.05, 12, 32)
    const ringMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(ag.color) })
    const ringMesh = new THREE.Mesh(ringGeo, ringMat)
    ringMesh.rotation.x = Math.PI / 3
    agGroup.add(ringMesh)

    agGroup.userData = {
      name: `AUTONOMOUS ${ag.title}`,
      servers: `Task: ${ag.sub}`,
      latency: 'SUB-20ms REASONING',
      status: 'AGENT QUERYING MODELS & EXECUTING',
      detail: ag.detail,
    }
    pipelineGroup.add(agGroup)
    allInteractables.push(agGroup)
    agentGroups.push(agGroup)

    labels.push({
      id: `agent-${idx}`,
      text: ag.title,
      subtext: ag.sub,
      color: ag.color,
      worldPos: new THREE.Vector3(-20.0, 3.2, ag.z),
      screenX: 0,
      screenY: 0,
    })

    // Conduit: GPU Server -> AI Swarm Core
    pipelineGroup.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([serverTopPos, agGroup.position]),
      new THREE.LineBasicMaterial({ color: 0x4a7ebb, transparent: true, opacity: 0.8 })
    ))
    add3DPacket(serverTopPos, agGroup.position, 0x4a7ebb)
  })

  // ════════ 3D FLOOR PLANE SECTOR 3: MODELS & ACTIONS STACK (X = -20.0, Split Z) ════════
  labels.push({
    id: 'col3-header',
    text: '3. MODELS & ACTIONS',
    subtext: 'SELECTIVE MODELS & ACTIONS STACK',
    color: '#4a7ebb',
    worldPos: new THREE.Vector3(-20.0, 14.5, 0),
    screenX: 0,
    screenY: 0,
    isHeader: true,
  })

  // Neural Models Router at X = -20.0, Z = -12.0
  const modelsContainerGeo = new THREE.BoxGeometry(11.0, 1.5, 3.0)
  const modelsContainerMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.25 })
  const modelsContainerMesh = new THREE.Mesh(modelsContainerGeo, modelsContainerMat)
  modelsContainerMesh.position.set(-20.0, 0.75, -12.0)
  modelsContainerMesh.userData = {
    name: 'SELECTIVE AI MODELS ROUTER BOX',
    servers: 'Pose Detection, Face Recognition, & Object/LPR Models Container',
    latency: 'DYNAMIC MODEL QUERY ROUTER',
    status: 'DYNAMIC MODEL QUERY ROUTER',
    detail: 'Holographic neural router dynamically routing frame queries to specialized AI chips on demand.',
  }
  pipelineGroup.add(modelsContainerMesh)
  allInteractables.push(modelsContainerMesh)

  labels.push({
    id: 'models-box-lbl',
    text: 'SELECTIVE AI MODELS ROUTER',
    subtext: 'POSE · FACE · OBJECT/LPR',
    color: '#4a7ebb',
    worldPos: new THREE.Vector3(-20.0, 2.8, -12.0),
    screenX: 0,
    screenY: 0,
  })

  const aiModels = [
    { name: 'POSE MODEL', desc: 'Hurt/Fall Detection', x: -23.5, color: '#c44a4a' },
    { name: 'FACE MODEL', desc: 'Child ReID', x: -20.0, color: '#c49a3c' },
    { name: 'OBJECT/LPR', desc: 'Stolen License Plate Search', x: -16.5, color: '#e02870' },
  ]

  const modelMeshes: THREE.Mesh[] = []

  aiModels.forEach((m, idx) => {
    const mGeo = new THREE.BoxGeometry(3.2, 0.9, 1.4)
    const mMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(m.color), metalness: 0.85 })
    const mMesh = new THREE.Mesh(mGeo, mMat)
    mMesh.position.set(m.x, 0.75, -12.0)
    mMesh.userData = {
      name: m.name,
      servers: m.desc,
      latency: 'EVALUATED BY AGENT',
      status: 'DYNAMIC QUERY EVALUATION',
      detail: `Neural network chip optimized for ${m.desc}.`,
    }
    pipelineGroup.add(mMesh)
    allInteractables.push(mMesh)
    modelMeshes.push(mMesh)

  })

  // Action Dispatch Chassis at X = -20.0, Z = +12.0
  const actionsContainerGeo = new THREE.BoxGeometry(13.0, 1.5, 3.0)
  const actionsContainerMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.25 })
  const actionsContainerMesh = new THREE.Mesh(actionsContainerGeo, actionsContainerMat)
  actionsContainerMesh.position.set(-20.0, 0.75, 12.0)
  actionsContainerMesh.userData = {
    name: 'ACTIONS EXECUTION CONTAINER BOX',
    servers: 'Simultaneous Dual Action Executions (Ambulance, Helpline, DB, Police Alert)',
    latency: 'REAL-TIME DISPATCH',
    status: 'REAL-TIME ACTION DISPATCH CONTAINER',
    detail: 'Automated action execution engine dispatching emergency medical, helpline, database, and police alerts.',
  }
  pipelineGroup.add(actionsContainerMesh)
  allInteractables.push(actionsContainerMesh)

  labels.push({
    id: 'actions-box-lbl',
    text: 'DYNAMIC ACTIONS DISPATCH BOX',
    subtext: 'AMBULANCE · HELPLINE · DB · POLICE',
    color: '#e02870',
    worldPos: new THREE.Vector3(-20.0, 2.8, 12.0),
    screenX: 0,
    screenY: 0,
  })

  const actionsData = [
    { title: 'AMBULANCE CALLED', desc: 'Calling Emergency Ambulance', x: -24.5, color: '#c44a4a' },
    { title: 'HELPLINE NOTIFIED', desc: 'Calling Help & Security', x: -21.5, color: '#c49a3c' },
    { title: 'WRITE DATABASE', desc: 'Writing Log to Database', x: -18.5, color: '#3d8b5e' },
    { title: 'ALERT POLICE', desc: 'Sending Alert to Police', x: -15.5, color: '#e02870' },
  ]

  const actionMeshes: THREE.Mesh[] = []

  actionsData.forEach((act, idx) => {
    const actGeo = new THREE.BoxGeometry(2.6, 0.9, 1.4)
    const actMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(act.color), metalness: 0.85 })
    const actMesh = new THREE.Mesh(actGeo, actMat)
    actMesh.position.set(act.x, 0.75, 12.0)
    actMesh.userData = {
      name: `ACTION: ${act.title}`,
      servers: act.desc,
      latency: 'EXECUTED BY AGENT',
      status: 'EXECUTED BY AUTONOMOUS AGENT',
      detail: `Automated system response triggering ${act.desc}.`,
    }
    pipelineGroup.add(actMesh)
    allInteractables.push(actMesh)
    actionMeshes.push(actMesh)

  })

  // ════════ 3D FLOOR PLANE SECTOR 4: SHADOWWATCH HUB & NATIONAL SERVERS (Central Governance, X = 0.0) ════════
  labels.push({
    id: 'col4-header',
    text: '4. SHADOWWATCH & NATIONAL SERVERS',
    subtext: 'AADHAAR · COURTS · RTO · BANKING · CARDS · GIS',
    color: '#3d8b5e',
    worldPos: new THREE.Vector3(0, 9.5, -9.0),
    screenX: 0,
    screenY: 0,
    isHeader: true,
  })

  const shadowwatchGroup = createShadowWatchHub()
  shadowwatchGroup.position.set(0, 0, 0)
  shadowwatchGroup.userData = {
    name: 'SHADOWWATCH GOVERNANCE & ALERT HUB BOX',
    servers: 'Receives alerts from Shadowverse & writes data back into Shadowverse',
    latency: 'BIDIRECTIONAL READ/WRITE ENGINE',
    status: 'BIDIRECTIONAL READ/WRITE ENGINE ACTIVE',
    detail: 'Central governance hexagonal server hub managing audit logs and bidirectional state write-backs.',
  }
  shadowwatchGroup.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.userData = shadowwatchGroup.userData
      allInteractables.push(child)
    }
  })
  pipelineGroup.add(shadowwatchGroup)

  labels.push({
    id: 'shadowwatch-lbl',
    text: 'SHADOWWATCH HUB',
    subtext: 'FORWARD POLICE DISPATCH',
    color: '#3d8b5e',
    worldPos: new THREE.Vector3(0, 7.2, 0),
    screenX: 0,
    screenY: 0,
  })

  // 6 Sovereign National Infrastructure Database Servers in a semi-circular arc (Negative Z space, R = 21.0)
  const nationalServers = [
    {
      id: 'aadhaar-srv',
      name: 'AADHAAR IDENTITY SERVER',
      city: 'UIDAI National Biometric Database',
      color: 0xc49a3c,
      colorHex: '#c49a3c',
      pos: new THREE.Vector3(-12.05, 0, -17.20),
      detail: 'Sovereign Aadhaar biometric identity verification engine performing 1:N face & fingerprint matching.',
    },
    {
      id: 'court-srv',
      name: 'COURT & JUDICIAL SERVER',
      city: 'National E-Courts System',
      color: 0x4a7ebb,
      colorHex: '#4a7ebb',
      pos: new THREE.Vector3(-5.79, 0, -20.19),
      detail: 'Judicial warrant ledger & e-courts case filing server executing real-time legal status verification.',
    },
    {
      id: 'rto-srv',
      name: 'RTO VEHICLE SERVER',
      city: 'Vahan & Sarathi National Registry',
      color: 0x3d8b5e,
      colorHex: '#3d8b5e',
      pos: new THREE.Vector3(1.10, 0, -20.97),
      detail: 'National RTO vehicle registration & driving license database validating ANPR plate queries under 10ms.',
    },
    {
      id: 'bank-srv',
      name: 'BANKING & FINANCIAL SERVER',
      city: 'Core Banking AML Ledger',
      color: 0x10b981,
      colorHex: '#10b981',
      pos: new THREE.Vector3(7.87, 0, -19.47),
      detail: 'Core banking transaction ledger monitoring anti-money laundering (AML) and financial fraud patterns.',
    },
    {
      id: 'card-srv',
      name: 'CREDIT CARD NETWORK SERVER',
      city: 'PCI-DSS Financial Intelligence',
      color: 0xe02870,
      colorHex: '#e02870',
      pos: new THREE.Vector3(13.78, 0, -15.85),
      detail: 'PCI-DSS card network intelligence engine detecting suspicious transaction locations & stolen card usage.',
    },
    {
      id: 'maps-srv',
      name: 'MAPS & SPATIAL GIS SERVER',
      city: 'National Spatial GIS System',
      color: 0x0284c7,
      colorHex: '#0284c7',
      pos: new THREE.Vector3(18.19, 0, -10.50),
      detail: 'High-precision national 3D GIS spatial mapping engine managing geofences and live officer tracking.',
    },
  ]

  const swCenterPos = new THREE.Vector3(0, 2.3, 0)

  nationalServers.forEach((srv) => {
    const { group: srvTower, leds: srvLeds } = createBladeServerTower(srv.color)
    ledMeshes.push(...srvLeds)
    srvTower.position.copy(srv.pos)
    srvTower.userData = {
      name: srv.name,
      servers: srv.city,
      latency: 'BIDIRECTIONAL 2-WAY DATA FLOW',
      status: 'SYNCED WITH SHADOWWATCH',
      detail: srv.detail,
    }
    srvTower.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.userData = srvTower.userData
        allInteractables.push(child)
      }
    })
    pipelineGroup.add(srvTower)

    const srvTopPos = srv.pos.clone().add(new THREE.Vector3(0, 2.5, 0))

    // 1. Line & Packet: ShadowWatch Hub -> National Server (Forward Stream)
    pipelineGroup.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([swCenterPos, srvTopPos]),
      new THREE.LineBasicMaterial({ color: srv.color, transparent: true, opacity: 0.85 })
    ))
    add3DPacket(swCenterPos, srvTopPos, srv.color, 0.015)

    // 2. Line & Packet: National Server -> ShadowWatch Hub (Return Stream)
    add3DPacket(srvTopPos, swCenterPos, srv.color, 0.015)
  })

  // ════════ DYNAMIC INTERMITTENT PACKET BURSTS FOR AI AGENTS ════════
  const agentTargetMap = [
    { targetModelIdx: 0, targetActionIdx: 0 },
    { targetModelIdx: 1, targetActionIdx: 1 },
    { targetModelIdx: 1, targetActionIdx: 2 },
    { targetModelIdx: 2, targetActionIdx: 3 },
  ]

  agentGroups.forEach((agGroup, idx) => {
    const agPos = agGroup.position
    const map = agentTargetMap[idx]
    if (!map) return

    // 1. AI Agent <-> AI Model (Bi-directional DYNAMIC BURST)
    const targetModelMesh = modelMeshes[map.targetModelIdx]
    if (targetModelMesh) {
      const mPos = targetModelMesh.position
      const lineMat = new THREE.LineBasicMaterial({ color: 0x4a7ebb, transparent: true, opacity: 0.8 })
      pipelineGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([agPos, mPos]), lineMat))

      add3DPacket(agPos, mPos, 0x4a7ebb, undefined, true, lineMat)
      add3DPacket(mPos, agPos, 0x4a7ebb, undefined, true, lineMat)
    }

    // 2. AI Agent <-> Action (Bi-directional DYNAMIC BURST)
    const targetActionMesh = actionMeshes[map.targetActionIdx]
    if (targetActionMesh) {
      const actPos = targetActionMesh.position
      const actLineMat = new THREE.LineBasicMaterial({ color: 0xe02870, transparent: true, opacity: 0.8 })
      pipelineGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([agPos, actPos]), actLineMat))

      add3DPacket(agPos, actPos, 0xe02870, undefined, true, actLineMat)
      add3DPacket(actPos, agPos, 0xe02870, undefined, true, actLineMat)
    }

    // 3. AI Agent -> ShadowWatch Hub (Connected to Unified Hub Height)
    pipelineGroup.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([agPos, swCenterPos]),
      new THREE.LineBasicMaterial({ color: 0x3d8b5e, transparent: true, opacity: 0.7 })
    ))
    add3DPacket(agPos, swCenterPos, 0x3d8b5e)
  })

  // ════════ 3D FLOOR PLANE SECTOR 5: POLICE ENDPOINTS (R = 21.0, Spaced East Arc) ════════
  labels.push({
    id: 'col5-header',
    text: '5. POLICE STATION ENDPOINTS',
    subtext: 'MOBILE · PATROL LAPTOP · COMMAND PC',
    color: '#4a7ebb',
    worldPos: new THREE.Vector3(18.0, 9.0, 0.0),
    screenX: 0,
    screenY: 0,
    isHeader: true,
  })

  // Smartphone Mobile App
  const phoneGroup = create3DSmartphoneSlab(0xe02870)
  phoneGroup.position.set(14.85, 0.8, 14.85)
  phoneGroup.userData = {
    name: 'POLICE OFFICER MOBILE APP',
    servers: 'Real-time Patrol Officer Alert Feed',
    latency: 'SYNCED WITH CENTRAL HUB',
    status: 'RECEIVING CENTRAL ALERTS',
    detail: 'Mobile application for field officers displaying real-time alert notifications and map directions.',
  }
  phoneGroup.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.userData = phoneGroup.userData
      allInteractables.push(child)
    }
  })
  pipelineGroup.add(phoneGroup)

  // Field Laptop Console
  const laptopGroup = create3DFieldLaptop(0x4a7ebb)
  laptopGroup.position.set(19.40, 0.8, 8.04)
  laptopGroup.userData = {
    name: 'POLICE FIELD LAPTOP CONSOLE',
    servers: 'Rugged Patrol Vehicle Dispatch Console',
    latency: 'SYNCED WITH CENTRAL HUB',
    status: 'RECEIVING CENTRAL ALERTS',
    detail: 'Patrol vehicle rugged laptop console displaying live CAD dispatch and suspect tracking.',
  }
  laptopGroup.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.userData = laptopGroup.userData
      allInteractables.push(child)
    }
  })
  pipelineGroup.add(laptopGroup)

  // Station Command PC Terminal
  const pcGroup = create3DStationPcTerminal(0x3d8b5e)
  pcGroup.position.set(21.00, 0.8, 0.00)
  pcGroup.userData = {
    name: 'STATION COMMAND PC TERMINAL',
    servers: 'Station Command Desktop Terminal',
    latency: 'SYNCED WITH CENTRAL HUB',
    status: 'RECEIVING CENTRAL ALERTS',
    detail: 'Station command center desktop terminal for supervisor oversight and evidence logging.',
  }
  pcGroup.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.userData = pcGroup.userData
      allInteractables.push(child)
    }
  })
  pipelineGroup.add(pcGroup)

  // Conduits: ShadowWatch Hub -> Endpoints (Unified Core Hub Anchor)
  const endpointPositions = [phoneGroup.position, laptopGroup.position, pcGroup.position]
  endpointPositions.forEach((pos) => {
    pipelineGroup.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([swCenterPos, pos]),
      new THREE.LineBasicMaterial({ color: 0x3d8b5e, transparent: true, opacity: 0.85 })
    ))
    add3DPacket(swCenterPos, pos, 0x3d8b5e)
  })

  // Opt the built geometry into shadowing. Only lit, solid surfaces: wireframes
  // and unlit markers would just add cost and noise to the depth pass.
  pipelineGroup.traverse((child) => {
    const mesh = child as THREE.Mesh
    if (!mesh.isMesh) return
    const mat = mesh.material as THREE.MeshStandardMaterial
    if (!mat || Array.isArray(mesh.material) || mat.wireframe) return
    if (!(mat as unknown as { isMeshStandardMaterial?: boolean }).isMeshStandardMaterial) return
    mesh.castShadow = true
    mesh.receiveShadow = true
  })

  pipelineLabels.value = labels

  function update3DSpaceLabels() {
    if (!mountRef.value || !camera || !pipelineGroup) return
    const containerW = mountRef.value.clientWidth
    const containerH = mountRef.value.clientHeight
    const tempVec = new THREE.Vector3()

    pipelineLabels.value.forEach((lbl) => {
      tempVec.copy(lbl.worldPos)
      tempVec.applyMatrix4(pipelineGroup.matrixWorld)
      const dist = camera.position.distanceTo(tempVec)
      lbl.zIndex = Math.max(1, Math.round(2000 - dist * 10))

      tempVec.project(camera)

      // Cull anything behind the camera or well outside the frame so badges
      // never pile up against the viewport edges.
      const onScreen = tempVec.z < 1.0 && Math.abs(tempVec.x) < 1.25 && Math.abs(tempVec.y) < 1.3

      // Depth cue: far badges recede in size and opacity, near ones stay crisp.
      const fade = Math.min(1, Math.max(0, (dist - 30) / 44))
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
    pipelineLabels.value
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
    packetList.forEach((p) => {
      if (p.isDynamicBurst) {
        if (!p.timer) p.timer = 0
        p.timer++
        if (p.isActive) {
          p.mesh.visible = true
          if (p.lineMat) p.lineMat.opacity = 0.85
          p.progress += p.speed
          if (p.progress > 1.0) p.progress = 0

          if (p.timer > (p.activeDuration || 120)) {
            p.isActive = false
            p.timer = 0
          }
        } else {
          p.mesh.visible = false
          if (p.lineMat) p.lineMat.opacity = 0.15
          if (p.timer > (p.idleDuration || 90)) {
            p.isActive = true
            p.timer = 0
            p.progress = 0
          }
        }
      } else {
        p.progress += p.speed
        if (p.progress > 1.0) p.progress = 0
      }
      p.mesh.position.lerpVectors(p.start, p.end, p.progress)
    })

    update3DSpaceLabels()

    // 1. Rotate and Pulse central Sovereign Core HQ holographic Core Orb
    if (shadowwatchGroup) {
      const orb = shadowwatchGroup.getObjectByName('coreHqOrb') as THREE.Mesh
      if (orb) {
        orb.rotation.y += 0.012
        orb.rotation.x += 0.006
        if (orb.material) {
          const mat = orb.material as THREE.MeshStandardMaterial
          mat.emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.003) * 0.3
        }
      }
    }

    // 2. Wave indicator flashing server LEDs
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
        <span class="text-[#e02870] font-black uppercase tracking-wider">// SHADOWVERSE REAL-TIME PIPELINE FLOW (GRAPH DATA MODEL)</span>
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
          @click="setCameraPreset('PIPELINE')"
          title="Focus Pipeline Core"
          class="px-2 py-0.5 text-[10px] font-mono font-bold uppercase border bg-[#121216] border-[#27272a] text-zinc-300 hover:border-[#750d37] hover:text-[#e02870] transition-colors cursor-pointer"
        >
          FOCUS PIPELINE
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
        v-for="lbl in pipelineLabels"
        :key="lbl.id"
        class="node-label absolute left-0 top-0 pointer-events-none flex flex-col items-center"
        :style="{
          transform: `translate3d(${lbl.screenX}px, ${lbl.screenY}px, 0) translate(-50%, -100%) scale(${lbl.scale ?? 1})`,
          opacity: lbl.opacity ?? 1,
          zIndex: lbl.zIndex || 10,
        }"
      >
        <!-- Stage Header: numbered pipeline stage, carries full weight -->
        <div
          v-if="lbl.isHeader"
          class="px-4 py-2 bg-[#0a0a0e]/92 backdrop-blur-sm border-2 font-mono shadow-2xl whitespace-nowrap text-center"
          :style="{ borderColor: lbl.color, boxShadow: `0 0 20px -6px ${lbl.color}` }"
        >
          <div class="text-white font-black text-xs sm:text-sm tracking-wider uppercase">{{ lbl.text }}</div>
          <div class="text-[10px] text-zinc-300 font-bold tracking-widest mt-0.5">{{ lbl.subtext }}</div>
        </div>

        <!-- Node Badge: lighter chrome so it reads as secondary to the stage headers -->
        <div
          v-else
          class="pl-2.5 pr-3 py-1.5 bg-[#0a0a0e]/88 backdrop-blur-sm border border-white/10 border-l-[3px] font-mono shadow-xl whitespace-nowrap text-left"
          :style="{ borderLeftColor: lbl.color }"
        >
          <div class="text-white font-bold text-[11px] sm:text-xs tracking-wide">{{ lbl.text }}</div>
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
            <span>PIPELINE TELEMETRY INSPECTOR</span>
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
          <span>4K INGESTION & NVR</span>
        </span>
        <span class="flex items-center gap-1 text-[#4a7ebb] font-bold">
          <span class="w-2 h-2 bg-[#4a7ebb]"></span>
          <span>GPU DECODE & NEURAL MODELS</span>
        </span>
        <span class="flex items-center gap-1 text-[#e02870] font-bold">
          <span class="w-2 h-2 bg-[#e02870]"></span>
          <span>AI AGENTS & ACTION DISPATCH</span>
        </span>
        <span class="flex items-center gap-1 text-[#3d8b5e] font-bold">
          <span class="w-2 h-2 bg-[#3d8b5e]"></span>
          <span>SHADOWWATCH & NATIONAL SERVERS</span>
        </span>
      </div>
      <span class="text-[#e02870] font-bold">CLICK NODE TO INSPECT · DRAG TO ROTATE/PAN</span>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Fira+Code:wght@400;500;600;700&display=swap');

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fade-in {
  animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

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
