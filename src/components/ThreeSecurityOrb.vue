<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const mountRef = ref<HTMLDivElement | null>(null)
const hoveredNodeInfo = ref<{ id: string; zone: string; status: string; fps: number } | null>(null)
const autoRotate = ref(true)
const scanSpeed = ref(1)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animId: number | null = null

let coreSphere: THREE.Mesh
let outerWireframe: THREE.LineSegments
let scanRing: THREE.Mesh
let nodeGroup: THREE.Group
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2(-1000, -1000)

let isDragging = false
let previousMousePosition = { x: 0, y: 0 }

function onPointerMove(event: MouseEvent) {
  if (!mountRef.value) return
  const rect = mountRef.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  if (isDragging) {
    const deltaX = event.clientX - previousMousePosition.x
    const deltaY = event.clientY - previousMousePosition.y

    if (nodeGroup) {
      nodeGroup.rotation.y += deltaX * 0.005
      nodeGroup.rotation.x += deltaY * 0.005
    }

    previousMousePosition = { x: event.clientX, y: event.clientY }
  }
}

function onMouseDown(event: MouseEvent) {
  isDragging = true
  previousMousePosition = { x: event.clientX, y: event.clientY }
}

function onMouseUp() {
  isDragging = false
}

function handleResize() {
  if (!mountRef.value || !renderer || !camera) return
  const width = mountRef.value.clientWidth
  const height = mountRef.value.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onMounted(() => {
  const container = mountRef.value
  if (!container) return

  const width = container.clientWidth
  const height = container.clientHeight || 340

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.z = 18

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.appendChild(renderer.domElement)

  // 1. Group container for orb objects
  nodeGroup = new THREE.Group()
  scene.add(nodeGroup)

  // 2. Inner Glowing Core Sphere
  const coreGeo = new THREE.IcosahedronGeometry(4.8, 2)
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x750d37,
    wireframe: true,
    transparent: true,
    opacity: 0.45,
  })
  coreSphere = new THREE.Mesh(coreGeo, coreMat)
  nodeGroup.add(coreSphere)

  // 3. Outer Wireframe Cage
  const outerGeo = new THREE.IcosahedronGeometry(6.2, 1)
  const wireframeGeo = new THREE.WireframeGeometry(outerGeo)
  const outerMat = new THREE.LineBasicMaterial({
    color: 0x9a1a4e,
    transparent: true,
    opacity: 0.25,
  })
  outerWireframe = new THREE.LineSegments(wireframeGeo, outerMat)
  nodeGroup.add(outerWireframe)

  // 4. Scanning Laser Ring
  const ringGeo = new THREE.RingGeometry(5.2, 5.5, 64)
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x3d8b5e,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6,
  })
  scanRing = new THREE.Mesh(ringGeo, ringMat)
  scanRing.rotation.x = Math.PI / 2
  nodeGroup.add(scanRing)

  // 5. Create Camera Nodes positioned around the 3D Sphere
  const nodeCount = 24
  const sphereRadius = 5.6

  const nodeGeo = new THREE.SphereGeometry(0.28, 16, 16)
  const emeraldMat = new THREE.MeshBasicMaterial({ color: 0x3d8b5e })
  const crimsonMat = new THREE.MeshBasicMaterial({ color: 0x750d37 })
  const blueMat = new THREE.MeshBasicMaterial({ color: 0x4a7ebb })

  for (let i = 0; i < nodeCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / nodeCount)
    const theta = Math.sqrt(nodeCount * Math.PI) * phi

    const x = sphereRadius * Math.cos(theta) * Math.sin(phi)
    const y = sphereRadius * Math.sin(theta) * Math.sin(phi)
    const z = sphereRadius * Math.cos(phi)

    let mat = emeraldMat
    let status = 'ONLINE'
    if (i % 7 === 0) {
      mat = crimsonMat
      status = 'ALERT'
    } else if (i % 5 === 0) {
      mat = blueMat
      status = 'AUDITING'
    }

    const nodeMesh = new THREE.Mesh(nodeGeo, mat)
    nodeMesh.position.set(x, y, z)
    nodeMesh.userData = {
      id: `CAM-3D-${100 + i}`,
      zone: `ZONE ${String.fromCharCode(65 + (i % 5))}-${(i % 4) + 1}`,
      status,
      fps: 60 - (i % 3),
    }

    nodeGroup.add(nodeMesh)
  }

  // 6. Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0x750d37, 2, 50)
  pointLight.position.set(10, 10, 10)
  scene.add(pointLight)

  // Animation Loop
  function animate() {
    if (autoRotate.value && !isDragging) {
      nodeGroup.rotation.y += 0.005 * scanSpeed.value
      nodeGroup.rotation.x += 0.002 * scanSpeed.value
    }

    scanRing.position.y = Math.sin(Date.now() * 0.002 * scanSpeed.value) * 3.5

    // Raycasting detection for interactive 3D nodes
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(nodeGroup.children)

    let foundNode = false
    for (let i = 0; i < intersects.length; i++) {
      const intersect = intersects[i]
      if (intersect && intersect.object && intersect.object.userData && intersect.object.userData.id) {
        hoveredNodeInfo.value = intersect.object.userData as any
        foundNode = true
        break
      }
    }

    if (!foundNode) {
      hoveredNodeInfo.value = null
    }

    renderer.render(scene, camera)
    animId = requestAnimationFrame(animate)
  }

  window.addEventListener('resize', handleResize)
  animate()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (animId) cancelAnimationFrame(animId)
  if (renderer && mountRef.value && renderer.domElement) {
    mountRef.value.removeChild(renderer.domElement)
    renderer.dispose()
  }
})
</script>

<template>
  <div class="industrial-card p-4 bg-[#0a0a0c] border-[#750d37] relative overflow-hidden group">
    <!-- Card Header Controls -->
    <div class="flex items-center justify-between border-b border-[#1e1e20] pb-3 mb-2 font-mono text-xs z-10 relative">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-[#3d8b5e] animate-ping"></span>
        <span class="text-[#3d8b5e] font-bold uppercase tracking-widest">// 3D SURVEILLANCE NODE ORB</span>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="autoRotate = !autoRotate"
          class="px-2 py-1 text-[10px] uppercase font-bold border transition-colors cursor-pointer"
          :class="autoRotate ? 'bg-[#750d37] border-[#750d37] text-white' : 'bg-[#111113] border-[#1e1e20] text-[#a0a0a4]'"
        >
          {{ autoRotate ? 'ORBIT: ON' : 'PAUSED' }}
        </button>
      </div>
    </div>

    <!-- 3D Canvas Mounting Container -->
    <div
      ref="mountRef"
      @mousemove="onPointerMove"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
      class="w-full h-64 sm:h-72 cursor-grab active:cursor-grabbing relative"
    >
      <!-- Hovered 3D Node Tooltip Overlay -->
      <div
        v-if="hoveredNodeInfo"
        class="absolute top-3 left-3 p-2.5 bg-[#111113] border border-[#750d37] font-mono text-[11px] text-white shadow-xl pointer-events-none z-20 space-y-1"
      >
        <div class="text-[#3d8b5e] font-bold flex items-center justify-between gap-3">
          <span>{{ hoveredNodeInfo.id }}</span>
          <span class="px-1.5 py-0.5 text-[9px] bg-[#3d8b5e]/20 text-[#3d8b5e] border border-[#3d8b5e]/40">
            {{ hoveredNodeInfo.status }}
          </span>
        </div>
        <div class="text-[#c8c8cc] text-[10px]">{{ hoveredNodeInfo.zone }}</div>
        <div class="text-[#88888c] text-[9px]">STREAM: {{ hoveredNodeInfo.fps }} FPS | RTSP STREAM ACTIVE</div>
      </div>
    </div>

    <!-- Card Footer Status -->
    <div class="flex items-center justify-between border-t border-[#1e1e20] pt-2.5 font-mono text-[10px] text-[#88888c] z-10 relative">
      <span class="flex items-center gap-1.5">
        <span class="material-symbols-outlined text-xs text-[#3d8b5e]">3d_rotation</span>
        <span>DRAG TO ROTATE 3D MESH</span>
      </span>
      <span class="text-[#3d8b5e] font-bold">24 CAMERA NODES ACTIVE</span>
    </div>
  </div>
</template>
