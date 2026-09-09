<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const containerRef = ref<HTMLDivElement | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animId: number | null = null

let particlesMesh: THREE.Points
let linesMesh: THREE.LineSegments
let particlePositions: Float32Array
let velocities: { x: number; y: number; z: number }[] = []

const PARTICLE_COUNT = 90
const MAX_DISTANCE = 160

// Mouse parallax tracking
let mouseX = 0
let mouseY = 0
let targetMouseX = 0
let targetMouseY = 0

function handleMouseMove(e: MouseEvent) {
  targetMouseX = (e.clientX - window.innerWidth / 2) * 0.12
  targetMouseY = (e.clientY - window.innerHeight / 2) * 0.12
}

function handleResize() {
  if (!containerRef.value || !renderer || !camera) return
  const width = window.innerWidth
  const height = window.innerHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

onMounted(() => {
  const container = containerRef.value
  if (!container) return

  const width = window.innerWidth
  const height = window.innerHeight

  // 1. Scene setup
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x0a0a0c, 0.0015)

  // 2. Camera setup
  camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000)
  camera.position.z = 400

  // 3. Renderer setup
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.appendChild(renderer.domElement)

  // 4. Create 3D Particles
  particlePositions = new Float32Array(PARTICLE_COUNT * 3)
  const particleColors = new Float32Array(PARTICLE_COUNT * 3)

  const crimson = new THREE.Color('#750d37')
  const emerald = new THREE.Color('#3d8b5e')
  const blue = new THREE.Color('#4a7ebb')

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const x = (Math.random() - 0.5) * 800
    const y = (Math.random() - 0.5) * 600
    const z = (Math.random() - 0.5) * 400

    particlePositions[i * 3] = x
    particlePositions[i * 3 + 1] = y
    particlePositions[i * 3 + 2] = z

    velocities.push({
      x: (Math.random() - 0.5) * 0.6,
      y: (Math.random() - 0.5) * 0.6,
      z: (Math.random() - 0.5) * 0.4,
    })

    // Assign Brand Palette Colors
    const randColor = Math.random()
    let chosenColor = crimson
    if (randColor > 0.85) chosenColor = emerald
    else if (randColor > 0.70) chosenColor = blue

    particleColors[i * 3] = chosenColor.r
    particleColors[i * 3 + 1] = chosenColor.g
    particleColors[i * 3 + 2] = chosenColor.b
  }

  const particleGeometry = new THREE.BufferGeometry()
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))

  // Custom particle point texture using canvas
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(16, 16, 12, 0, Math.PI * 2)
    ctx.fill()
  }
  const texture = new THREE.CanvasTexture(canvas)

  const particleMaterial = new THREE.PointsMaterial({
    size: 6,
    map: texture,
    transparent: true,
    vertexColors: true,
    depthWrite: false,
    opacity: 0.75,
  })

  particlesMesh = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particlesMesh)

  // 5. Line segments geometry for connections
  const linePositions = new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 6)
  const lineColors = new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 6)

  const linesGeometry = new THREE.BufferGeometry()
  linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
  linesGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3))

  const linesMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0.6,
  })

  linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial)
  scene.add(linesMesh)

  // 6. Animation loop
  function animate() {
    // Parallax interpolation
    mouseX += (targetMouseX - mouseX) * 0.05
    mouseY += (targetMouseY - mouseY) * 0.05

    camera.position.x = mouseX
    camera.position.y = -mouseY
    camera.lookAt(scene.position)

    const posAttr = particlesMesh.geometry.attributes['position'] as THREE.BufferAttribute
    if (!posAttr) return
    const pos = posAttr.array as Float32Array

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const v = velocities[i]
      if (!v) continue

      const xIdx = i * 3
      const yIdx = i * 3 + 1
      const zIdx = i * 3 + 2

      const posX = pos[xIdx]
      const posY = pos[yIdx]
      const posZ = pos[zIdx]

      if (posX !== undefined && posY !== undefined && posZ !== undefined) {
        pos[xIdx] = posX + v.x
        pos[yIdx] = posY + v.y
        pos[zIdx] = posZ + v.z

        if (Math.abs(pos[xIdx]!) > 450) v.x *= -1
        if (Math.abs(pos[yIdx]!) > 350) v.y *= -1
        if (Math.abs(pos[zIdx]!) > 250) v.z *= -1
      }
    }
    posAttr.needsUpdate = true

    // Recompute lines
    let vertexIdx = 0
    let colorIdx = 0

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p1x = pos[i * 3]
      const p1y = pos[i * 3 + 1]
      const p1z = pos[i * 3 + 2]

      if (p1x === undefined || p1y === undefined || p1z === undefined) continue

      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const p2x = pos[j * 3]
        const p2y = pos[j * 3 + 1]
        const p2z = pos[j * 3 + 2]

        if (p2x === undefined || p2y === undefined || p2z === undefined) continue

        const dx = p1x - p2x
        const dy = p1y - p2y
        const dz = p1z - p2z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < MAX_DISTANCE) {
          const alpha = 1 - dist / MAX_DISTANCE

          // Segment start point
          linePositions[vertexIdx++] = p1x
          linePositions[vertexIdx++] = p1y
          linePositions[vertexIdx++] = p1z

          // Segment end point
          linePositions[vertexIdx++] = p2x
          linePositions[vertexIdx++] = p2y
          linePositions[vertexIdx++] = p2z

          // Color fade based on distance
          const r = 0.46 * alpha
          const g = 0.05 * alpha
          const b = 0.21 * alpha

          lineColors[colorIdx++] = r
          lineColors[colorIdx++] = g
          lineColors[colorIdx++] = b

          lineColors[colorIdx++] = r
          lineColors[colorIdx++] = g
          lineColors[colorIdx++] = b
        }
      }
    }

    linesMesh.geometry.setDrawRange(0, vertexIdx / 3)
    const linePosAttr = linesMesh.geometry.attributes['position']
    const lineColAttr = linesMesh.geometry.attributes['color']
    if (linePosAttr) linePosAttr.needsUpdate = true
    if (lineColAttr) lineColAttr.needsUpdate = true

    // Rotate particle cloud gently
    particlesMesh.rotation.y += 0.0008
    linesMesh.rotation.y += 0.0008

    renderer.render(scene, camera)
    animId = requestAnimationFrame(animate)
  }

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('resize', handleResize)

  animate()
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', handleResize)

  if (animId) cancelAnimationFrame(animId)

  if (renderer) {
    renderer.dispose()
    if (containerRef.value && renderer.domElement) {
      containerRef.value.removeChild(renderer.domElement)
    }
  }
})
</script>

<template>
  <div
    ref="containerRef"
    class="fixed inset-0 pointer-events-none z-0 opacity-80 transition-opacity duration-1000 overflow-hidden"
  ></div>
</template>
