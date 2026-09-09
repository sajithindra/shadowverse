<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import * as THREE from 'three'

const props = withDefaults(
  defineProps<{
    minimal?: boolean
  }>(),
  {
    minimal: false,
  }
)

interface CardData {
  id: number
  icon: string
  bigNumber: string
  metricTitle: string
  badge: string
  cardClass: string
  color: string
  hexColor: number
  problem: string
  solution: string
  takeaway: string
  subHeading: string
}

const cards: CardData[] = [
  {
    id: 0,
    icon: 'router',
    bigNumber: '99.1%',
    metricTitle: 'WAN Bandwidth Saved',
    badge: 'FLOCK AI EDGE',
    cardClass: 'tech-card-amber',
    color: '#fbbf24',
    hexColor: 0xf59e0b,
    subHeading: '8 Regional Edge DCs analyzing 100% video locally',
    problem: 'Streaming 200 Gbps raw video over 1,000 km WAN chokes city networks & causes dropouts.',
    solution: '100% video computed locally at 8 Edge DCs. Only metadata sent to HQ, reducing continuous WAN load to 1.2 Gbps.',
    takeaway: '200 Gbps ➔ 1.2 Gbps Continuous Load',
  },
  {
    id: 1,
    icon: 'videocam',
    bigNumber: '₹0',
    metricTitle: 'Camera Replacement Cost',
    badge: 'ZERO HARDWARE LOCK',
    cardClass: 'tech-card-emerald',
    color: '#34d399',
    hexColor: 0x10b981,
    subHeading: 'Universal Adapter Mesh for all IP & Analog cameras',
    problem: 'Proprietary VMS vendors force expensive hardware rip-and-replace & recurring per-camera license fees.',
    solution: 'Universal Adapter Mesh connects IP (ONVIF/RTSP) & analog DVRs (Hikvision, Dahua, Axis, CP Plus) seamlessly with zero camera changes.',
    takeaway: 'Works with 100% of Existing CCTV Assets',
  },
  {
    id: 2,
    icon: 'local_police',
    bigNumber: '<50ms',
    metricTitle: 'Auto-Match & Dispatch',
    badge: 'PALANTIR SWARM',
    cardClass: 'tech-card-blue',
    color: '#60a5fa',
    hexColor: 0x3b82f6,
    subHeading: 'Autonomous AI Swarm with sub-50ms police routing',
    problem: 'Disconnected police databases & manual video scrubbing take days to track suspect vehicles.',
    solution: 'Autonomous AI Swarm cross-matches VAHAN, eGujCop & AFIS in <50ms for instant 112 / PCR vehicle routing.',
    takeaway: 'Sub-50ms Real-Time Police Interception',
  },
  {
    id: 3,
    icon: 'shield_lock',
    bigNumber: '100%',
    metricTitle: 'On-Premise Sovereignty',
    badge: 'ZERO CLOUD LEAKS',
    cardClass: 'tech-card-crimson',
    color: '#e02870',
    hexColor: 0xe02870,
    subHeading: '100% Local Execution with Zero foreign cloud telemetry',
    problem: 'Foreign cloud AI solutions create national surveillance espionage risks & DPDP regulatory violations.',
    solution: '100% Local Execution. Zero foreign cloud telemetry. Protected by Logic Lock Zero-Trust FIDO2 MFA on police servers.',
    takeaway: 'Sovereign Data Storage (48h NVMe ➔ 90d Tape)',
  },
]

const containerRef = ref<HTMLDivElement | null>(null)
const mountRef = ref<HTMLDivElement | null>(null)
const isFullscreen = ref(false)

// Active Card Index: 0 to 3, or -1 for All Cards Grid View
const activeIndex = ref(0)
const isGridView = ref(false)
const activeCard = computed(() => cards[activeIndex.value] ?? cards[0]!)

// Auto-Play Sequencer State
const autoPlay = ref(true)
const autoPlayDuration = 4500 // 4.5s per card
const autoPlayProgress = ref(0)
let autoPlayInterval: ReturnType<typeof setInterval> | null = null

// Three.js State
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animId: number | null = null

let stageGroup: THREE.Group
let podMeshes: THREE.Group[] = []
let coreReactor: THREE.Mesh
let pulseRings: THREE.Mesh[] = []
let particleSystem: THREE.Points

// Camera Target for smooth lerping
const targetCameraPos = new THREE.Vector3(0, 10, 32)
const targetLookAt = new THREE.Vector3(0, 0, 0)
const currentLookAt = new THREE.Vector3(0, 0, 0)

// Raycasting & Interaction
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2(-1000, -1000)
let isDragging = false
let previousMouse = { x: 0, y: 0 }

// Screen projected 2D coordinates for 3D pods
interface PodLabel {
  id: number
  name: string
  bigNumber: string
  color: string
  screenX: number
  screenY: number
  visible: boolean
  zIndex?: number
}
const podLabels = ref<PodLabel[]>([])

// Initialize pod positions in an arc
const POD_RADIUS = 14
const POD_ANGLES = [
  -Math.PI * 0.45, // Pod 0 (Left-front)
  -Math.PI * 0.15, // Pod 1 (Center-left)
  Math.PI * 0.15,  // Pod 2 (Center-right)
  Math.PI * 0.45,  // Pod 3 (Right-front)
]

function getPodPosition(idx: number): THREE.Vector3 {
  const angle = POD_ANGLES[idx] ?? 0
  return new THREE.Vector3(
    Math.sin(angle) * POD_RADIUS,
    0,
    Math.cos(angle) * (POD_RADIUS * 0.7) - 2
  )
}

function initThree() {
  if (!mountRef.value) return

  const width = mountRef.value.clientWidth
  const height = mountRef.value.clientHeight

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x09090b, 0.022)

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(0, 12, 34)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.3
  mountRef.value.appendChild(renderer.domElement)

  stageGroup = new THREE.Group()
  scene.add(stageGroup)

  // 1. Cyber Grid Floor
  const gridHelper = new THREE.GridHelper(60, 40, 0x750d37, 0x1f1f26)
  gridHelper.position.y = -3
  stageGroup.add(gridHelper)

  // 2. Central Sovereign Fusion Core
  const coreGeo = new THREE.OctahedronGeometry(2.2, 0)
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xe02870,
    wireframe: true,
    transparent: true,
    opacity: 0.85,
  })
  coreReactor = new THREE.Mesh(coreGeo, coreMat)
  coreReactor.position.set(0, 1.5, -4)
  stageGroup.add(coreReactor)

  // Center Inner Glowing Core
  const coreInnerGeo = new THREE.IcosahedronGeometry(1.2, 1)
  const coreInnerMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.9,
  })
  const coreInner = new THREE.Mesh(coreInnerGeo, coreInnerMat)
  coreReactor.add(coreInner)

  // 3. Central Pulse Rings
  for (let i = 0; i < 3; i++) {
    const ringGeo = new THREE.RingGeometry(3.5 + i * 1.8, 3.6 + i * 1.8, 48)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x750d37,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4 - i * 0.1,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2
    ring.position.set(0, -2.8, -4)
    stageGroup.add(ring)
    pulseRings.push(ring)
  }

  // 4. Create the 4 3D Hologram Pods
  podMeshes = []
  podLabels.value = []

  cards.forEach((card, idx) => {
    const podGroup = new THREE.Group()
    const pos = getPodPosition(idx)
    podGroup.position.copy(pos)
    podGroup.userData = { id: idx, card }

    // Pedestal Base
    const baseGeo = new THREE.CylinderGeometry(2.0, 2.4, 0.6, 24)
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x111116,
      roughness: 0.3,
      metalness: 0.8,
    })
    const baseMesh = new THREE.Mesh(baseGeo, baseMat)
    baseMesh.position.y = -2.7
    podGroup.add(baseMesh)

    // Base Glowing Border Ring
    const baseRingGeo = new THREE.TorusGeometry(2.1, 0.08, 12, 32)
    const baseRingMat = new THREE.MeshBasicMaterial({ color: card.hexColor })
    const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat)
    baseRing.rotation.x = Math.PI / 2
    baseRing.position.y = -2.4
    podGroup.add(baseRing)

    // Floating Cyber Tower Geometry
    const towerGeo = new THREE.BoxGeometry(1.6, 2.8, 1.6)
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0x14141c,
      roughness: 0.2,
      metalness: 0.9,
    })
    const towerMesh = new THREE.Mesh(towerGeo, towerMat)
    towerMesh.position.y = -0.6
    podGroup.add(towerMesh)

    // Glowing Wireframe Outer Cage
    const cageGeo = new THREE.BoxGeometry(1.8, 3.0, 1.8)
    const cageMat = new THREE.MeshBasicMaterial({
      color: card.hexColor,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    })
    const cageMesh = new THREE.Mesh(cageGeo, cageMat)
    cageMesh.position.y = -0.6
    podGroup.add(cageMesh)

    // Floating Glowing Orb on Top
    const orbGeo = new THREE.SphereGeometry(0.7, 16, 16)
    const orbMat = new THREE.MeshBasicMaterial({
      color: card.hexColor,
      transparent: true,
      opacity: 0.9,
    })
    const orbMesh = new THREE.Mesh(orbGeo, orbMat)
    orbMesh.position.y = 1.6
    podGroup.add(orbMesh)

    // Floating Holographic Ring around Orb
    const haloGeo = new THREE.RingGeometry(0.9, 1.1, 32)
    const haloMat = new THREE.MeshBasicMaterial({
      color: card.hexColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    })
    const haloMesh = new THREE.Mesh(haloGeo, haloMat)
    haloMesh.rotation.x = Math.PI / 2
    haloMesh.position.y = 1.6
    podGroup.add(haloMesh)

    // Energy Laser Line connecting to Core
    const laserPoints = [
      new THREE.Vector3(pos.x, -1.0, pos.z),
      new THREE.Vector3(0, 1.5, -4),
    ]
    const laserGeo = new THREE.BufferGeometry().setFromPoints(laserPoints)
    const laserMat = new THREE.LineBasicMaterial({
      color: card.hexColor,
      transparent: true,
      opacity: 0.35,
    })
    const laserLine = new THREE.Line(laserGeo, laserMat)
    stageGroup.add(laserLine)

    stageGroup.add(podGroup)
    podMeshes.push(podGroup)

    // Register 2D label object
    podLabels.value.push({
      id: idx,
      name: card.metricTitle,
      bigNumber: card.bigNumber,
      color: card.color,
      screenX: 0,
      screenY: 0,
      visible: true,
    })
  })

  // 5. Floating Ambient Particle Matrix
  const particleCount = 200
  const pPositions = new Float32Array(particleCount * 3)
  const pColors = new Float32Array(particleCount * 3)
  const pColorList = [
    new THREE.Color(0xf59e0b),
    new THREE.Color(0x10b981),
    new THREE.Color(0x3b82f6),
    new THREE.Color(0xe02870),
  ]

  for (let i = 0; i < particleCount; i++) {
    pPositions[i * 3] = (Math.random() - 0.5) * 40
    pPositions[i * 3 + 1] = (Math.random() - 0.5) * 18 + 2
    pPositions[i * 3 + 2] = (Math.random() - 0.5) * 30

    const c = pColorList[i % pColorList.length] ?? new THREE.Color(0xffffff)
    pColors[i * 3] = c.r
    pColors[i * 3 + 1] = c.g
    pColors[i * 3 + 2] = c.b
  }

  const pGeo = new THREE.BufferGeometry()
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))
  pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3))

  const pMat = new THREE.PointsMaterial({
    size: 0.28,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
  })
  particleSystem = new THREE.Points(pGeo, pMat)
  stageGroup.add(particleSystem)

  // Ambient & Directional Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5)
  dirLight.position.set(10, 20, 15)
  scene.add(dirLight)

  updateCameraForActiveCard()
  startAutoPlayTimer()
  animate()
}

function updateCameraForActiveCard() {
  if (isGridView.value) {
    // Overview perspective
    targetCameraPos.set(0, 16, 32)
    targetLookAt.set(0, 0, -2)
    return
  }

  const pod = podMeshes[activeIndex.value]
  if (pod) {
    const pos = pod.position
    // Orbit camera to focus towards active pod with slight offset
    targetCameraPos.set(pos.x * 0.75, 7.5, pos.z + 18)
    targetLookAt.set(pos.x, 0, pos.z)
  }
}

function updateScreenLabels() {
  if (!camera || !renderer) return

  podLabels.value.forEach((lbl, idx) => {
    const pod = podMeshes[idx]
    if (!pod) return

    const worldPos = new THREE.Vector3()
    pod.getWorldPosition(worldPos)
    worldPos.y += 3.2 // Position above orb

    const dist = camera.position.distanceTo(worldPos)
    lbl.zIndex = Math.max(1, Math.round(2000 - dist * 10))

    const proj = worldPos.clone().project(camera)
    const isBehind = proj.z > 1

    if (isBehind) {
      lbl.visible = false
      return
    }

    const rect = renderer.domElement.getBoundingClientRect()
    lbl.screenX = ((proj.x + 1) * 0.5) * rect.width
    lbl.screenY = ((-proj.y + 1) * 0.5) * rect.height
    lbl.visible = true
  })
}

function animate() {
  animId = requestAnimationFrame(animate)

  const time = performance.now() * 0.001

  // 1. Core reactor rotation & pulse
  if (coreReactor) {
    coreReactor.rotation.y = time * 0.8
    coreReactor.rotation.x = Math.sin(time * 0.5) * 0.3
    const scale = 1 + Math.sin(time * 3.0) * 0.06
    coreReactor.scale.set(scale, scale, scale)
  }

  // 2. Pulse rings expanding
  pulseRings.forEach((ring, i) => {
    ring.rotation.z = time * (0.2 + i * 0.1)
  })

  // 3. Pod animations
  podMeshes.forEach((pod, idx) => {
    const isCurrent = activeIndex.value === idx && !isGridView.value

    // Floating orb bobbing
    const orb = pod.children[4]
    const halo = pod.children[5]
    if (orb && halo) {
      orb.position.y = 1.6 + Math.sin(time * 2.5 + idx) * 0.18
      halo.position.y = orb.position.y
      halo.rotation.z = time * (isCurrent ? 2.5 : 1.0)
    }

    // Cage wireframe rotation
    const cage = pod.children[3]
    if (cage) {
      cage.rotation.y = time * (isCurrent ? 1.2 : 0.4)
    }

    // Highlight active pod with scale pulse
    if (isCurrent) {
      const activeScale = 1.08 + Math.sin(time * 4) * 0.04
      pod.scale.lerp(new THREE.Vector3(activeScale, activeScale, activeScale), 0.1)
    } else {
      pod.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
    }
  })

  // 4. Particle float
  if (particleSystem) {
    particleSystem.rotation.y = time * 0.05
  }

  // 5. Smooth camera lerp
  if (camera) {
    camera.position.lerp(targetCameraPos, 0.06)
    currentLookAt.lerp(targetLookAt, 0.06)
    camera.lookAt(currentLookAt)
  }

  updateScreenLabels()

  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

// Sequencing Controls
function selectCard(idx: number) {
  activeIndex.value = idx
  isGridView.value = false
  updateCameraForActiveCard()
  resetAutoPlayProgress()
}

function setGridView() {
  isGridView.value = true
  updateCameraForActiveCard()
}

function nextCard() {
  if (isGridView.value) {
    isGridView.value = false
    activeIndex.value = 0
  } else {
    activeIndex.value = (activeIndex.value + 1) % cards.length
  }
  updateCameraForActiveCard()
  resetAutoPlayProgress()
}

function prevCard() {
  if (isGridView.value) {
    isGridView.value = false
    activeIndex.value = cards.length - 1
  } else {
    activeIndex.value = (activeIndex.value - 1 + cards.length) % cards.length
  }
  updateCameraForActiveCard()
  resetAutoPlayProgress()
}

function toggleAutoPlay() {
  autoPlay.value = !autoPlay.value
  if (autoPlay.value) {
    startAutoPlayTimer()
  } else {
    stopAutoPlayTimer()
  }
}

function startAutoPlayTimer() {
  stopAutoPlayTimer()
  if (!autoPlay.value) return

  const stepMs = 50
  const increment = (stepMs / autoPlayDuration) * 100

  autoPlayInterval = setInterval(() => {
    if (autoPlayProgress.value < 100) {
      autoPlayProgress.value += increment
    } else {
      autoPlayProgress.value = 0
      nextCard()
    }
  }, stepMs)
}

function resetAutoPlayProgress() {
  autoPlayProgress.value = 0
}

function stopAutoPlayTimer() {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

// Pointer & Click Raycasting
function onPointerDown(event: PointerEvent) {
  if (!mountRef.value || !camera) return

  const rect = mountRef.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(stageGroup.children, true)

  for (const hit of intersects) {
    let obj: THREE.Object3D | null = hit.object
    while (obj && obj !== stageGroup) {
      if (obj.userData && obj.userData.id !== undefined) {
        selectCard(obj.userData.id)
        return
      }
      obj = obj.parent
    }
  }

  isDragging = true
  previousMouse = { x: event.clientX, y: event.clientY }
}

function onPointerMove(event: PointerEvent) {
  if (!isDragging || !stageGroup) return

  const deltaX = event.clientX - previousMouse.x
  const deltaY = event.clientY - previousMouse.y

  stageGroup.rotation.y += deltaX * 0.005
  stageGroup.rotation.x = Math.max(-0.2, Math.min(0.4, stageGroup.rotation.x + deltaY * 0.003))

  previousMouse = { x: event.clientX, y: event.clientY }
}

function onPointerUp() {
  isDragging = false
}

function onWheel(event: WheelEvent) {
  if (!camera) return
  event.preventDefault()
  const dir = new THREE.Vector3()
  camera.getWorldDirection(dir)
  const delta = event.deltaY > 0 ? -2.5 : 2.5
  targetCameraPos.addScaledVector(dir, delta)
}

function reset3DView() {
  if (stageGroup) {
    stageGroup.rotation.set(0, 0, 0)
  }
  updateCameraForActiveCard()
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
  setTimeout(() => onResize(), 100)
}

function onResize() {
  if (!mountRef.value || !camera || !renderer) return
  const width = mountRef.value.clientWidth
  const height = mountRef.value.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  initThree()
  if (mountRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      onResize()
    })
    resizeObserver.observe(mountRef.value)
  }
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  stopAutoPlayTimer()
  if (animId) cancelAnimationFrame(animId)
  window.removeEventListener('resize', onResize)
  if (renderer && renderer.domElement) {
    renderer.domElement.remove()
  }
})

watch(activeIndex, () => {
  updateCameraForActiveCard()
})
</script>

<template>
  <div
    ref="containerRef"
    class="w-full flex-1 flex flex-col justify-between relative select-none"
    :class="props.minimal ? 'w-full h-full relative overflow-hidden bg-transparent' : (isFullscreen ? 'fixed inset-0 z-50 bg-[#09090b] p-4' : 'h-full')"
  >
    <!-- TOP INTERACTIVE SEQUENCER BAR -->
    <div v-if="!props.minimal" class="flex flex-wrap items-center justify-between gap-2 bg-[#121216] border border-[#27272a] px-3 py-2 z-20 shrink-0 shadow-lg">
      
      <!-- STEP TABS -->
      <div class="flex items-center gap-1 sm:gap-1.5 flex-wrap">
        <button
          v-for="(c, idx) in cards"
          :key="c.id"
          @click="selectCard(idx)"
          class="px-2.5 sm:px-3 py-1 font-mono text-[11px] sm:text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 border"
          :class="activeIndex === idx && !isGridView ? 'bg-[#750d37] border-[#e02870] text-white' : 'bg-[#16161d] border-[#27272a] text-zinc-300 hover:border-zinc-500 hover:text-white'"
        >
          <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: c.color }"></span>
          <span>0{{ idx + 1 }}. {{ c.bigNumber }}</span>
          <span class="hidden md:inline text-[10px] text-zinc-400">({{ c.metricTitle }})</span>
        </button>

        <!-- ALL CARDS GRID VIEW BUTTON -->
        <button
          @click="setGridView"
          class="px-2.5 py-1 font-mono text-[11px] sm:text-xs font-black transition-all cursor-pointer flex items-center gap-1 border"
          :class="isGridView ? 'bg-blue-600 border-blue-400 text-white' : 'bg-[#16161d] border-[#27272a] text-zinc-300 hover:border-blue-400 hover:text-white'"
        >
          <span class="material-symbols-outlined text-xs">grid_view</span>
          <span>GRID VIEW</span>
        </button>
      </div>

      <!-- SEQUENCE PLAYBACK & 3D CONTROLS -->
      <div class="flex items-center gap-1.5 sm:gap-2">
        
        <!-- AUTO-PLAY TOGGLE -->
        <button
          @click="toggleAutoPlay"
          class="px-2.5 py-1 text-[11px] font-mono font-bold uppercase border transition-all flex items-center gap-1 cursor-pointer shadow-md"
          :class="autoPlay ? 'bg-[#750d37] border-[#e02870] text-white' : 'bg-[#16161d] border-[#27272a] text-zinc-300 hover:border-zinc-500'"
          :title="autoPlay ? 'Pause auto-cycling' : 'Play card sequence'"
        >
          <span class="material-symbols-outlined text-xs" :class="{ 'animate-spin': autoPlay }">{{ autoPlay ? 'pause' : 'play_arrow' }}</span>
          <span class="hidden sm:inline">{{ autoPlay ? 'AUTO' : 'MANUAL' }}</span>
        </button>

        <!-- PREV / NEXT CARD STEPPERS -->
        <button
          @click="prevCard"
          class="px-2 py-1 text-[11px] font-mono font-black border bg-[#16161d] border-[#27272a] text-white hover:border-[#e02870] transition-colors cursor-pointer"
          title="Previous Card"
        >
          ◀
        </button>
        <button
          @click="nextCard"
          class="px-2 py-1 text-[11px] font-mono font-black border bg-[#16161d] border-[#27272a] text-white hover:border-[#e02870] transition-colors cursor-pointer"
          title="Next Card"
        >
          ▶
        </button>

        <!-- RESET 3D ORIENTATION -->
        <button
          @click="reset3DView"
          class="px-2 py-1 text-[10px] font-mono font-bold uppercase border bg-[#16161d] border-[#27272a] text-zinc-300 hover:border-white transition-colors cursor-pointer hidden md:inline"
          title="Reset 3D Camera"
        >
          RESET 3D
        </button>

        <!-- FULLSCREEN -->
        <button
          @click="toggleFullscreen"
          class="px-2 py-1 text-[10px] font-mono font-bold uppercase border bg-[#16161d] border-[#27272a] text-white hover:border-[#e02870] transition-colors cursor-pointer flex items-center gap-1"
        >
          <span class="material-symbols-outlined text-xs">{{ isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}</span>
        </button>
      </div>

    </div>

    <!-- AUTO-PLAY SEQUENCE PROGRESS BAR -->
    <div v-if="!props.minimal && autoPlay && !isGridView" class="w-full h-0.5 bg-[#1f1f26] shrink-0">
      <div
        class="h-full bg-[#e02870] transition-all duration-75"
        :style="{ width: `${autoPlayProgress}%` }"
      ></div>
    </div>

    <!-- 3D WEBGL STAGE & CARD OVERLAY VIEWPORT -->
    <div
      ref="mountRef"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @wheel="onWheel"
      class="w-full flex-1 relative overflow-hidden touch-none select-none cursor-grab active:cursor-grabbing"
      :class="props.minimal ? 'h-full w-full' : 'min-h-[320px] sm:min-h-[420px]'"
    >
      <!-- 3D Projected Screen Labels -->
      <div
        v-for="lbl in podLabels"
        :key="lbl.id"
        v-show="lbl.visible && (isGridView || activeIndex !== lbl.id)"
        @click.stop="selectCard(lbl.id)"
        class="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110"
        :style="{ left: `${lbl.screenX}px`, top: `${lbl.screenY}px`, zIndex: lbl.zIndex || 10 }"
      >
        <div
          class="px-3.5 py-1.5 bg-[#0a0a0e] border-2 font-mono shadow-2xl tracking-wider uppercase text-center"
          :style="{ borderColor: lbl.color, color: lbl.color }"
        >
          <div class="text-sm sm:text-base font-black leading-tight text-white">{{ lbl.bigNumber }}</div>
          <div class="text-[10px] sm:text-xs text-zinc-200 font-bold mt-0.5">{{ lbl.name }}</div>
        </div>
      </div>

      <!-- SPOTLIGHT CARD OVERLAY (SINGLE-CARD SEQUENTIAL VIEW) -->
      <Transition name="fade-card" mode="out-in">
        <div
          v-if="!isGridView"
          :key="activeIndex"
          class="absolute bottom-3 left-3 right-3 sm:left-6 sm:bottom-6 sm:max-w-xl md:max-w-2xl z-30 pointer-events-auto"
        >
          <div
            class="p-4 sm:p-5 shadow-2xl bg-[#111113] border-2 transition-all animate-fade-in"
            :class="activeCard.cardClass"
          >
            <!-- CARD HEADER & BIG NUMBER -->
            <div class="flex items-start justify-between border-b border-[#27272a] pb-3 mb-3 gap-2">
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-mono text-xs font-black text-white px-2 py-0.5 bg-black/60 border border-zinc-700 flex items-center gap-1">
                    <span class="material-symbols-outlined text-xs">{{ activeCard.icon }}</span>
                    <span>POD 0{{ activeIndex + 1 }}</span>
                  </span>
                  <span class="font-mono text-xs font-extrabold uppercase tracking-wider" :style="{ color: activeCard.color }">
                    {{ activeCard.badge }}
                  </span>
                </div>
                <h3 class="text-base sm:text-xl font-black text-white font-mono mt-1 flex items-center gap-2">
                  <span class="material-symbols-outlined text-lg sm:text-xl" :style="{ color: activeCard.color }">{{ activeCard.icon }}</span>
                  <span>{{ activeCard.metricTitle }}</span>
                </h3>
                <p class="text-xs text-zinc-300 mt-0.5">
                  {{ activeCard.subHeading }}
                </p>
              </div>

              <div class="text-right shrink-0">
                <div class="text-4xl sm:text-5xl md:text-6xl font-black font-mono tracking-tight leading-none" :style="{ color: activeCard.color }">
                  {{ activeCard.bigNumber }}
                </div>
              </div>
            </div>

            <!-- PROBLEM & SOLUTION SPLIT GRID -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
              
              <!-- PROBLEM BOX -->
              <div class="bg-rose-950/40 border border-rose-800/60 p-3 flex flex-col justify-between shadow-sm">
                <div>
                  <div class="font-mono text-[11px] text-rose-400 font-extrabold uppercase flex items-center gap-1.5 mb-1">
                    <span class="material-symbols-outlined text-sm">error_outline</span>
                    <span>LEGACY PROBLEM</span>
                  </div>
                  <p class="text-rose-200/90 leading-relaxed font-sans">
                    {{ activeCard.problem }}
                  </p>
                </div>
              </div>

              <!-- SOLUTION BOX -->
              <div class="bg-emerald-950/40 border border-emerald-600/60 p-3 flex flex-col justify-between shadow-sm">
                <div>
                  <div class="font-mono text-[11px] text-emerald-400 font-extrabold uppercase flex items-center gap-1.5 mb-1">
                    <span class="material-symbols-outlined text-sm">verified_user</span>
                    <span>SHADOWVERSE SOLUTION</span>
                  </div>
                  <p class="text-emerald-200/90 leading-relaxed font-sans">
                    {{ activeCard.solution }}
                  </p>
                </div>
              </div>

            </div>

            <!-- FOOTER OPERATIONAL TAKEAWAY -->
            <div class="mt-3 pt-2 border-t border-[#27272a] flex items-center justify-between font-mono text-[11px]">
              <span class="text-zinc-400">Impact Metric:</span>
              <strong class="text-white font-bold">{{ activeCard.takeaway }}</strong>
            </div>

          </div>
        </div>
      </Transition>

      <!-- ALL 4 CARDS GRID OVERLAY (WHEN IN GRID VIEW) -->
      <div
        v-if="isGridView"
        class="absolute inset-3 sm:inset-6 z-30 overflow-y-auto pr-1 pointer-events-auto animate-fade-in"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 h-full items-stretch">
          <div
            v-for="(card, idx) in cards"
            :key="card.id"
            @click="selectCard(idx)"
            class="p-3.5 flex flex-col justify-between shadow-2xl cursor-pointer transition-all hover:scale-[1.02]"
            :class="card.cardClass"
          >
            <div>
              <div class="flex items-start justify-between mb-2 border-b border-[#27272a] pb-2">
                <div>
                  <div class="text-3xl sm:text-4xl font-black font-mono tracking-tight leading-none flex items-center gap-1" :style="{ color: card.color }">
                    <span>{{ card.bigNumber }}</span>
                  </div>
                  <div class="font-mono text-xs font-bold uppercase tracking-wider mt-1 text-white flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm" :style="{ color: card.color }">{{ card.icon }}</span>
                    <span>{{ card.metricTitle }}</span>
                  </div>
                </div>
                <span class="font-mono text-[9px] px-1.5 py-0.5 bg-black/60 border border-zinc-700 text-zinc-300 font-bold">
                  0{{ idx + 1 }}
                </span>
              </div>

              <!-- Problem snippet -->
              <div class="bg-rose-950/30 border border-rose-800/40 p-2 mb-2">
                <div class="font-mono text-[10px] text-rose-400 font-bold uppercase flex items-center gap-1 mb-0.5">
                  <span class="material-symbols-outlined text-xs">error_outline</span> Problem
                </div>
                <p class="text-[11px] text-rose-200/90 leading-snug">{{ card.problem }}</p>
              </div>

              <!-- Solution snippet -->
              <div class="bg-emerald-950/30 border border-emerald-600/50 p-2">
                <div class="font-mono text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1 mb-0.5">
                  <span class="material-symbols-outlined text-xs">verified_user</span> Solution
                </div>
                <p class="text-[11px] text-emerald-200/90 leading-snug">{{ card.solution }}</p>
              </div>
            </div>

            <div class="mt-2 pt-1 border-t border-[#27272a] text-center font-mono text-[10px] text-zinc-300 font-bold flex items-center justify-center gap-1">
              <span>FOCUS POD</span>
              <span class="material-symbols-outlined text-xs">arrow_forward</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- BOTTOM CONTROL FOOTER CAPTION -->
    <div v-if="!props.minimal" class="flex flex-wrap items-center justify-between border-t border-[#27272a] pt-2 font-mono text-[10px] text-zinc-400 z-10 shrink-0 gap-2">
      <div class="flex items-center gap-3">
        <span class="flex items-center gap-1 text-amber-400 font-bold">
          <span class="w-2 h-2 bg-amber-400"></span>
          <span>FLOCK AI EDGE</span>
        </span>
        <span class="flex items-center gap-1 text-emerald-400 font-bold">
          <span class="w-2 h-2 bg-emerald-400"></span>
          <span>UNIVERSAL INGEST</span>
        </span>
        <span class="flex items-center gap-1 text-blue-400 font-bold">
          <span class="w-2 h-2 bg-blue-400"></span>
          <span>PALANTIR SWARM</span>
        </span>
        <span class="flex items-center gap-1 text-[#e02870] font-bold">
          <span class="w-2 h-2 bg-[#e02870]"></span>
          <span>SOVEREIGN CORE</span>
        </span>
      </div>
      <span class="text-[#e02870] font-bold">CLICK PODS / TABS TO FOCUS · DRAG TO ROTATE 3D STAGE</span>
    </div>
  </div>
</template>

<style scoped>
.fade-card-enter-active,
.fade-card-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-card-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}

.fade-card-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.97);
}
</style>
