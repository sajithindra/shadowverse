import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/**
 * Shared render setup for the presentation's 3D planes.
 *
 * The scenes used to light everything with a single ambient light at 0.9, which
 * adds a flat constant to every surface regardless of its normal and erases the
 * shading gradient that makes a shape read as solid. Here ambient stays low and
 * an image-based environment does the indirect lighting, so metal has something
 * to reflect and edges catch a highlight.
 */

export interface Stage {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  /** Call on container resize. */
  resize: () => void
  /** Releases the GPU context, the environment map and the render target. */
  dispose: () => void
}

export interface StageOptions {
  /** Half-extent the shadow frustum must cover. Keep it tight: the shadow map
   *  is spread across this area, so an oversized frustum wastes resolution. */
  shadowExtent?: number
  /** Vertical field of view in degrees. */
  fov?: number
  /** Exponential fog density; 0 disables fog. */
  fogDensity?: number
  /** Overall exposure of the tone-mapped image. */
  exposure?: number
  /** Enables shadow casting. Costs a second depth pass. */
  shadows?: boolean
}

const BACKDROP = 0x08080b

/** Aspect the planes were framed for. */
const DESIGN_ASPECT = 16 / 9
/** Past this the perspective distortion costs more than the extra framing wins. */
const MAX_FOV = 78

/**
 * A perspective camera's fov is vertical, so a portrait viewport keeps the full
 * height and loses the width — a phone showed a narrow strip through the middle
 * of every plane with the outer racks cut off. This widens the vertical fov on
 * narrow viewports to hold the horizontal coverage the scene was framed with.
 */
export function fitFov(designFov: number, aspect: number): number {
  if (aspect >= DESIGN_ASPECT) return designFov
  const halfHorizontal = Math.atan(
    Math.tan(THREE.MathUtils.degToRad(designFov) / 2) * DESIGN_ASPECT,
  )
  const fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(halfHorizontal) / aspect))
  return Math.min(fov, MAX_FOV)
}

export function createStage(mount: HTMLElement, options: StageOptions = {}): Stage {
  const {
    fov = 42,
    fogDensity = 0.012,
    exposure = 1.05,
    shadows = true,
    shadowExtent = 50,
  } = options

  const width = mount.clientWidth || 1
  const height = mount.clientHeight || 1

  const scene = new THREE.Scene()
  if (fogDensity > 0) scene.fog = new THREE.FogExp2(BACKDROP, fogDensity)

  const camera = new THREE.PerspectiveCamera(fitFov(fov, width / height), width / height, 0.1, 500)

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setSize(width, height)
  // Cap at 2: beyond that the extra fragments cost more than they show.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = exposure
  renderer.outputColorSpace = THREE.SRGBColorSpace

  if (shadows) {
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
  }

  mount.appendChild(renderer.domElement)

  // Image-based lighting. Without this, `metalness: 0.9` surfaces have nothing
  // to reflect and read as flat cardboard.
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04)
  scene.environment = envRT.texture
  pmrem.dispose()

  // Three-point rig. The environment supplies the bounce, so these only need to
  // shape the form rather than light it outright.
  const key = new THREE.DirectionalLight(0xffffff, 3.0)
  key.position.set(18, 26, 14)
  if (shadows) {
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.near = 1
    key.shadow.camera.far = 120
    key.shadow.camera.left = -shadowExtent
    key.shadow.camera.right = shadowExtent
    key.shadow.camera.top = shadowExtent
    key.shadow.camera.bottom = -shadowExtent
    // Pulls the shadow off the caster so flat panels don't self-stripe.
    key.shadow.bias = -0.0008
    key.shadow.normalBias = 0.02
  }
  scene.add(key)

  const fill = new THREE.DirectionalLight(0x8fb4d9, 0.75)
  fill.position.set(-20, 10, -12)
  scene.add(fill)

  // Rim in the brand magenta, behind the subject, to separate silhouettes from
  // the near-black backdrop.
  const rim = new THREE.DirectionalLight(0xe02870, 0.55)
  rim.position.set(-6, 16, -30)
  scene.add(rim)

  scene.add(new THREE.AmbientLight(0xffffff, 0.2))

  const resize = () => {
    const w = mount.clientWidth || 1
    const h = mount.clientHeight || 1
    camera.aspect = w / h
    camera.fov = fitFov(fov, camera.aspect)
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }

  const dispose = () => {
    envRT.dispose()
    renderer.dispose()
    if (renderer.domElement.parentNode === mount) {
      mount.removeChild(renderer.domElement)
    }
  }

  return { scene, camera, renderer, resize, dispose }
}

/**
 * Turns a two-finger pinch into a wheel-equivalent `deltaY`, so a plane's
 * existing zoom handler serves touch without a second code path. Touch is the
 * only way to zoom these scenes on a phone — the planes render without their
 * zoom buttons in the deck's minimal mode.
 *
 * Returns a detach function.
 */
export function attachPinchZoom(el: HTMLElement, onZoom: (deltaY: number) => void): () => void {
  let previous = 0

  const spread = (touches: TouchList) => {
    const a = touches[0]
    const b = touches[1]
    if (!a || !b) return 0
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
  }

  const onStart = (e: TouchEvent) => {
    if (e.touches.length === 2) previous = spread(e.touches)
  }

  const onMove = (e: TouchEvent) => {
    if (e.touches.length !== 2 || !previous) return
    e.preventDefault()
    const current = spread(e.touches)
    if (!current) return
    // Pinching in shrinks the spread, which reads as a positive wheel delta —
    // the same sign a scroll-down gives, so both gestures zoom out.
    onZoom(previous - current)
    previous = current
  }

  const onEnd = () => {
    previous = 0
  }

  el.addEventListener('touchstart', onStart, { passive: true })
  el.addEventListener('touchmove', onMove, { passive: false })
  el.addEventListener('touchend', onEnd, { passive: true })
  el.addEventListener('touchcancel', onEnd, { passive: true })

  return () => {
    el.removeEventListener('touchstart', onStart)
    el.removeEventListener('touchmove', onMove)
    el.removeEventListener('touchend', onEnd)
    el.removeEventListener('touchcancel', onEnd)
  }
}

/**
 * Frees geometry and materials under `root`. Three does not do this on removal,
 * so a plane that remounts without it leaks a full scene's worth of buffers.
 */
export function disposeTree(root: THREE.Object3D): void {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh
    if (mesh.geometry) mesh.geometry.dispose()
    const material = mesh.material
    if (Array.isArray(material)) {
      material.forEach((m) => m.dispose())
    } else if (material) {
      material.dispose()
    }
  })
}
