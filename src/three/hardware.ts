import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

/**
 * Data-centre hardware built to read as manufactured equipment rather than
 * primitives: bevelled edges so they catch a highlight, physically plausible
 * metal, and geometry shared between instances to keep the draw count sane.
 */

// Deck palette, taken from the blade cabinet so every plane's hardware matches:
// near-black bodies, 0x27272a faceplates, 0x94a3b8 brightwork, and a coloured
// wireframe outline as the signature.
const GRAPHITE = new THREE.MeshStandardMaterial({
  color: 0x09090b,
  metalness: 0.9,
  roughness: 0.15,
})

const BODY = new THREE.MeshStandardMaterial({
  color: 0x18181b,
  metalness: 0.85,
  roughness: 0.25,
})

const BASE_PLATE = new THREE.MeshStandardMaterial({
  color: 0x0f172a,
  metalness: 0.85,
})

const PCB = new THREE.MeshStandardMaterial({
  color: 0x020617,
  metalness: 0.35,
  roughness: 0.68,
})

const HEATSINK = new THREE.MeshStandardMaterial({
  color: 0x94a3b8,
  metalness: 0.95,
  roughness: 0.2,
})

// Geometry is created once and shared; five racks of cards would otherwise
// allocate thousands of near-identical buffers.
const finGeo = new THREE.BoxGeometry(0.04, 0.34, 1.15)
const cardShroudGeo = new RoundedBoxGeometry(3.3, 0.34, 1.5, 2, 0.06)
const cardPcbGeo = new THREE.BoxGeometry(3.2, 0.06, 1.42)
const fanRingGeo = new THREE.TorusGeometry(0.3, 0.05, 10, 24)
const ledGeo = new THREE.BoxGeometry(0.07, 0.07, 0.03)

export interface GpuCard {
  group: THREE.Group
  /** Drives the activity LED and heatsink glow. 0 = idle, 1 = saturated. */
  setLoad: (load: number) => void
}

/**
 * A single accelerator card: PCB, finned heatsink, twin fans and a status LED.
 * `accent` tints the LED and fan rings so a rack's workload reads at a glance.
 */
function createGpuCard(accent: number): GpuCard {
  const group = new THREE.Group()

  const shroud = new THREE.Mesh(cardShroudGeo, BODY)
  shroud.castShadow = true
  shroud.receiveShadow = true
  group.add(shroud)

  const pcb = new THREE.Mesh(cardPcbGeo, PCB)
  pcb.position.y = -0.19
  group.add(pcb)

  // Fins as one instanced mesh: a single draw call instead of forty.
  const finCount = 26
  const fins = new THREE.InstancedMesh(finGeo, HEATSINK, finCount)
  const m = new THREE.Matrix4()
  for (let i = 0; i < finCount; i++) {
    m.makeTranslation(-1.35 + i * 0.105, 0.02, 0)
    fins.setMatrixAt(i, m)
  }
  fins.instanceMatrix.needsUpdate = true
  fins.castShadow = true
  group.add(fins)

  const accentColor = new THREE.Color(accent)

  const fanMat = new THREE.MeshStandardMaterial({
    color: accentColor,
    emissive: accentColor,
    emissiveIntensity: 0.4,
    metalness: 0.6,
    roughness: 0.4,
  })
  for (const x of [-0.78, 0.78]) {
    const fan = new THREE.Mesh(fanRingGeo, fanMat)
    fan.rotation.x = Math.PI / 2
    fan.position.set(x, 0.2, 0)
    group.add(fan)
  }

  const ledMat = new THREE.MeshStandardMaterial({
    color: accentColor,
    emissive: accentColor,
    emissiveIntensity: 1.2,
  })
  const led = new THREE.Mesh(ledGeo, ledMat)
  led.position.set(1.68, 0.05, 0.5)
  group.add(led)

  return {
    group,
    setLoad: (load: number) => {
      const l = Math.min(1, Math.max(0, load))
      // An idle card is visibly dark; a saturated one drives its LED hot.
      ledMat.emissiveIntensity = 0.08 + l * 2.6
      fanMat.emissiveIntensity = 0.04 + l * 0.9
    },
  }
}

/**
 * Floor plate. Receives the racks' shadows, which is what anchors them in
 * space — without it they read as floating.
 */
export function createFloor(size = 140, gridA = 0x750d37, gridB = 0x27272a): THREE.Group {
  const group = new THREE.Group()

  const plate = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshStandardMaterial({
      color: 0x0a0b0e,
      metalness: 0.15,
      roughness: 0.9,
    }),
  )
  plate.rotation.x = -Math.PI / 2
  plate.receiveShadow = true
  group.add(plate)

  const grid = new THREE.GridHelper(size, size / 2, gridA, gridB)
  grid.position.y = 0.01
  const gridMat = grid.material as THREE.Material
  gridMat.transparent = true
  gridMat.opacity = 0.5
  group.add(grid)

  return group
}

/**
 * An open waste bin. Frames the detector rejects fall into it, which is the
 * plainest way to show that the work is thrown away rather than processed.
 */
export function createDiscardBin(accent = 0x4a4f57): THREE.Group {
  const group = new THREE.Group()

  const shell = new THREE.MeshStandardMaterial({
    color: 0x09090b,
    metalness: 0.9,
    roughness: 0.15,
    side: THREE.DoubleSide,
  })

  // Open-topped, so discarded units are visibly falling in rather than
  // vanishing against a lid.
  const body = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.15, 2.6, 24, 1, true), shell)
  body.position.y = 1.3
  body.castShadow = true
  group.add(body)

  // Wireframe outline: the deck's signature, carried by every cabinet.
  const wire = new THREE.Mesh(
    new THREE.CylinderGeometry(1.53, 1.18, 2.64, 12, 3, true),
    new THREE.MeshBasicMaterial({ color: accent, wireframe: true }),
  )
  wire.position.y = 1.3
  group.add(wire)

  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.08, 10, 32), BODY)
  rim.rotation.x = Math.PI / 2
  rim.position.y = 2.6
  rim.castShadow = true
  group.add(rim)

  // Base plate, matching the cabinets' footing.
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.16, 24), BASE_PLATE)
  base.position.y = 0.08
  base.receiveShadow = true
  group.add(base)

  return group
}


/* ────────────────────────────────────────────────────────────────────────────
 * Shared deck hardware.
 *
 * These were duplicated in the topology and pipeline planes and had drifted
 * apart. The topology copies were the more detailed of the two and are the
 * canonical versions here, so all three planes now build from one source and
 * read as the same equipment.
 * ──────────────────────────────────────────────────────────────────────────── */

export interface BladeTower {
  group: THREE.Group
  /** Drive and activity LEDs, for the caller's animation loop. */
  leds: THREE.Mesh[]
  /** Accelerator cards, present only when `cards` was requested. */
  cards: GpuCard[]
}

export function createRealisticCctvCamera(colorHex = 0x3d8b5e): THREE.Group {
  const group = new THREE.Group()

  // 1. Weatherproof Cylindrical Metal Camera Body
  const bodyGeo = new THREE.CylinderGeometry(0.36, 0.32, 1.2, 24)
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    metalness: 0.85,
    roughness: 0.2,
  })
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat)
  bodyMesh.rotation.z = Math.PI / 2
  group.add(bodyMesh)

  // Body Accent Metallic Ring
  const ringGeo = new THREE.TorusGeometry(0.365, 0.02, 16, 32)
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.1 })
  const ringMesh = new THREE.Mesh(ringGeo, ringMat)
  ringMesh.rotation.y = Math.PI / 2
  ringMesh.position.x = 0.1
  group.add(ringMesh)

  // 2. Protective Dual Top Sun Shield Visor
  const hoodGeo = new THREE.CylinderGeometry(0.40, 0.40, 1.0, 24, 1, false, 0, Math.PI)
  const hoodMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    metalness: 0.75,
    roughness: 0.25,
    side: THREE.DoubleSide,
  })
  const hoodMesh = new THREE.Mesh(hoodGeo, hoodMat)
  hoodMesh.rotation.z = Math.PI / 2
  hoodMesh.rotation.x = Math.PI / 2
  hoodMesh.position.set(0.14, 0.09, 0)
  group.add(hoodMesh)

  // 3. Dark Front Optical Faceplate Assembly
  const faceGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.08, 24)
  const faceMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.1 })
  const faceMesh = new THREE.Mesh(faceGeo, faceMat)
  faceMesh.rotation.z = Math.PI / 2
  faceMesh.position.x = 0.6
  group.add(faceMesh)

  // 4. Optical Dual-Glass Lens Element & Rim
  const lensRimGeo = new THREE.TorusGeometry(0.18, 0.035, 16, 32)
  const lensRimMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.95, roughness: 0.1 })
  const lensRimMesh = new THREE.Mesh(lensRimGeo, lensRimMat)
  lensRimMesh.rotation.y = Math.PI / 2
  lensRimMesh.position.x = 0.64
  group.add(lensRimMesh)

  const lensGlassGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 24)
  const lensGlassMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.02, metalness: 1.0 })
  const lensGlassMesh = new THREE.Mesh(lensGlassGeo, lensGlassMat)
  lensGlassMesh.rotation.z = Math.PI / 2
  lensGlassMesh.position.x = 0.65
  group.add(lensGlassMesh)

  // 5. Infrared (IR) Night-Vision LED Ring (12 LEDs)
  const irRadius = 0.25
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2
    const irY = Math.cos(angle) * irRadius
    const irZ = Math.sin(angle) * irRadius
    const irGeo = new THREE.SphereGeometry(0.028, 8, 8)
    const irMat = new THREE.MeshStandardMaterial({
      color: 0xe02870,
      emissive: 0xe02870,
      emissiveIntensity: 0.9,
    })
    const irMesh = new THREE.Mesh(irGeo, irMat)
    irMesh.position.set(0.64, irY, irZ)
    group.add(irMesh)
  }

  // 6. Active Power & Status LED
  const statusLedGeo = new THREE.SphereGeometry(0.04, 8, 8)
  const statusLedMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x10b981,
    emissiveIntensity: 1.0,
  })
  const statusLedMesh = new THREE.Mesh(statusLedGeo, statusLedMat)
  statusLedMesh.position.set(0.64, 0.27, 0)
  group.add(statusLedMesh)

  // 7. Swivel Mounting Arm, Elbow Joint & Wall Plate
  const jointGeo = new THREE.SphereGeometry(0.13, 16, 16)
  const jointMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85 })
  const jointMesh = new THREE.Mesh(jointGeo, jointMat)
  jointMesh.position.set(-0.28, -0.2, 0)
  group.add(jointMesh)

  const armGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.65, 12)
  const armMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
  const armMesh = new THREE.Mesh(armGeo, armMat)
  armMesh.position.set(-0.38, -0.48, 0)
  armMesh.rotation.z = 0.4
  group.add(armMesh)

  const wallPlateGeo = new THREE.BoxGeometry(0.14, 0.48, 0.48)
  const wallPlateMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85 })
  const wallPlateMesh = new THREE.Mesh(wallPlateGeo, wallPlateMat)
  wallPlateMesh.position.set(-0.52, -0.75, 0)
  group.add(wallPlateMesh)

  // Cable Conduit Tail
  const cableGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8)
  const cableMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.8 })
  const cableMesh = new THREE.Mesh(cableGeo, cableMat)
  cableMesh.position.set(-0.54, -0.9, 0)
  group.add(cableMesh)

  return group
}

export function createNvrStorageUnit(colorHex = 0x3d8b5e): THREE.Group {
  const group = new THREE.Group()

  // 1. 2U Rackmount Heavy Metal Chassis Body
  const bodyGeo = new THREE.BoxGeometry(1.4, 0.55, 1.1)
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 })
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat)
  group.add(bodyMesh)

  // 2. 19-Inch Side Rack Mounting Ears
  const earGeo = new THREE.BoxGeometry(0.12, 0.5, 0.15)
  const earMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 })

  const earLeft = new THREE.Mesh(earGeo, earMat)
  earLeft.position.set(-0.76, 0, 0.48)
  group.add(earLeft)

  const earRight = new THREE.Mesh(earGeo, earMat)
  earRight.position.set(0.76, 0, 0.48)
  group.add(earRight)

  // 3. Hot-Swappable Hard Drive Bay Trays (8 HDD Slots)
  for (let i = 0; i < 4; i++) {
    for (let row = 0; row < 2; row++) {
      const hddGeo = new THREE.BoxGeometry(0.28, 0.2, 0.05)
      const hddMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.3 })
      const hddMesh = new THREE.Mesh(hddGeo, hddMat)
      hddMesh.position.set(-0.45 + i * 0.3, -0.12 + row * 0.24, 0.56)
      group.add(hddMesh)

      // HDD Activity LED
      const ledGeo = new THREE.SphereGeometry(0.025, 6, 6)
      const ledMat = new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex, emissiveIntensity: 1.0 })
      const ledMesh = new THREE.Mesh(ledGeo, ledMat)
      ledMesh.position.set(-0.45 + i * 0.3, -0.12 + row * 0.24, 0.59)
      group.add(ledMesh)
    }
  }

  // Front Power Switch LED
  const pwrGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.04, 12)
  const pwrMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 1.0 })
  const pwrMesh = new THREE.Mesh(pwrGeo, pwrMat)
  pwrMesh.rotation.x = Math.PI / 2
  pwrMesh.position.set(0.6, 0.15, 0.57)
  group.add(pwrMesh)

  return group
}

function buildBladeTower(colorHex: number, leds: THREE.Mesh[]): THREE.Group {
  const group = new THREE.Group()

  // 1. Dark Steel Cabinet Outer Frame
  const frameGeo = new THREE.BoxGeometry(2.0, 4.2, 2.0)
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x09090b,
    metalness: 0.9,
    roughness: 0.15,
  })
  const frameMesh = new THREE.Mesh(frameGeo, frameMat)
  frameMesh.position.y = 2.1
  group.add(frameMesh)

  // Illuminated Corner Edge Glow Pillars
  const wireGeo = new THREE.BoxGeometry(2.04, 4.24, 2.04)
  const wireMat = new THREE.MeshBasicMaterial({ color: colorHex, wireframe: true })
  const wireMesh = new THREE.Mesh(wireGeo, wireMat)
  wireMesh.position.y = 2.1
  group.add(wireMesh)

  // 2. 6 Individual Server Blade Chassis Drawers
  for (let b = 0; b < 6; b++) {
    const bladeY = 0.5 + b * 0.62
    const bladeGeo = new THREE.BoxGeometry(1.88, 0.52, 1.88)
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.85,
      roughness: 0.25,
    })
    const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat)
    bladeMesh.position.y = bladeY
    group.add(bladeMesh)

    // Brushed Aluminum Front Faceplate
    const frontGeo = new THREE.PlaneGeometry(1.84, 0.48)
    const frontMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.95, roughness: 0.1 })
    const frontMesh = new THREE.Mesh(frontGeo, frontMat)
    frontMesh.position.set(0, bladeY, 0.95)
    group.add(frontMesh)

    // Chrome Release Latches
    const handleGeo = new THREE.BoxGeometry(0.14, 0.36, 0.08)
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95 })

    const handleLeft = new THREE.Mesh(handleGeo, handleMat)
    handleLeft.position.set(-0.8, bladeY, 0.99)
    group.add(handleLeft)

    const handleRight = new THREE.Mesh(handleGeo, handleMat)
    handleRight.position.set(0.8, bladeY, 0.99)
    group.add(handleRight)

    // Blinking Hard Drive & Network Activity LEDs
    for (let ledIdx = 0; ledIdx < 5; ledIdx++) {
      const ledGeo = new THREE.SphereGeometry(0.045, 8, 8)
      const ledColor = ledIdx === 0 ? 0x10b981 : ledIdx === 1 ? 0x06b6d4 : ledIdx === 2 ? 0xe02870 : 0x3b82f6
      const ledMat = new THREE.MeshStandardMaterial({
        color: ledColor,
        emissive: ledColor,
        emissiveIntensity: 0.95,
      })
      const ledMesh = new THREE.Mesh(ledGeo, ledMat)
      ledMesh.name = 'serverLed'
      leds.push(ledMesh)
      ledMesh.position.set(-0.5 + ledIdx * 0.24, bladeY, 1.0)
      group.add(ledMesh)
    }
  }

  // 3. Front Transparent Glass Door
  const glassGeo = new THREE.PlaneGeometry(1.92, 4.0)
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x020617,
    transparent: true,
    opacity: 0.5,
    roughness: 0.02,
    metalness: 0.95,
    side: THREE.DoubleSide,
  })
  const glassMesh = new THREE.Mesh(glassGeo, glassMat)
  glassMesh.position.set(0, 2.1, 1.02)
  group.add(glassMesh)

  // 4. Industrial Base Pedestal Plate
  const baseGeo = new THREE.CylinderGeometry(1.8, 2.0, 0.35, 8)
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85 })
  const baseMesh = new THREE.Mesh(baseGeo, baseMat)
  baseMesh.position.y = 0.17
  group.add(baseMesh)

  return group
}

/**
 * Blade server cabinet. Pass `cards` to seat visible accelerator cards in the
 * front of the chassis, for planes that need to show the silicon rather than
 * just the box.
 */
export function createBladeServerTower(colorHex = 0xe02870, cardCount = 0): BladeTower {
  const leds: THREE.Mesh[] = []
  const group = buildBladeTower(colorHex, leds)
  const cards: GpuCard[] = []

  for (let i = 0; i < cardCount; i++) {
    const card = createGpuCard(colorHex)
    // Authored at rack scale; the blade cabinet is narrower, so bring it down
    // to the width of a drawer and sit it proud of the cabinet face.
    card.group.scale.setScalar(0.52)
    card.group.position.set(0, 0.5 + i * 0.62, 0.62)
    group.add(card.group)
    cards.push(card)
  }

  return { group, leds, cards }
}
