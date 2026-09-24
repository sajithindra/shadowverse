import * as THREE from 'three'

/**
 * Screen-space labels for the 3D planes.
 *
 * Labels are DOM, not sprites, so they stay crisp at any zoom and can use the
 * deck's real typography. Each frame they are projected to screen space, faded
 * by depth, and decluttered so a distant badge never covers a nearer one.
 */

export interface SceneLabel {
  id: string
  text: string
  subtext: string
  /** Accent colour. Used for the border and stem, never for body text. */
  color: string
  worldPos: THREE.Vector3
  screenX: number
  screenY: number
  /** Headers are the structural read of a plane and are never decluttered away. */
  isHeader?: boolean
  zIndex?: number
  opacity?: number
  scale?: number
}

export interface Rect {
  x: number
  y: number
  hw: number
  hh: number
}

export interface ProjectOptions {
  /** Distance at which badges begin to recede. */
  fadeStart?: number
  /** Distance range over which they fade to their dimmest. */
  fadeRange?: number
  /** Screen areas already occupied by overlay UI. Labels keep clear of them. */
  reserved?: Rect[]
}

const HEADER_BOX = { hw: 132, hh: 34 }
const NODE_BOX = { hw: 108, hh: 32 }

/**
 * Projects every label to screen space, applies the depth cue, then hides any
 * badge that would overlap a nearer one. Call once per frame.
 */
export function projectLabels(
  labels: SceneLabel[],
  camera: THREE.Camera,
  group: THREE.Object3D,
  width: number,
  height: number,
  options: ProjectOptions = {},
): void {
  const { fadeStart = 24, fadeRange = 36, reserved } = options
  const v = new THREE.Vector3()

  for (const label of labels) {
    v.copy(label.worldPos)
    v.applyMatrix4(group.matrixWorld)

    const dist = camera.position.distanceTo(v)
    label.zIndex = Math.max(1, Math.round(2000 - dist * 10))

    v.project(camera)

    // Behind the camera, or far enough outside the frame that clamping it to
    // the edge would be a lie about where the object is.
    const onScreen = v.z < 1 && Math.abs(v.x) < 1.25 && Math.abs(v.y) < 1.3

    const fade = Math.min(1, Math.max(0, (dist - fadeStart) / fadeRange))
    label.opacity = onScreen ? 1 - fade * 0.55 : 0
    label.scale = 1 - fade * 0.26

    label.screenX = Math.max(118, Math.min(width - 118, (v.x * 0.5 + 0.5) * width))
    label.screenY = Math.max(48, Math.min(height - 24, (-(v.y * 0.5) + 0.5) * height))
  }

  declutter(labels, reserved)
}

/**
 * Front-to-back placement: each label claims a box, and a later (further)
 * label overlapping a claimed box is hidden. Headers claim first so a
 * secondary badge can never push one out.
 */
function declutter(labels: SceneLabel[], reserved?: Rect[]): void {
  // Overlay panels claim their space before any label does, so a badge can
  // never end up unreadable underneath one.
  const placed: Rect[] = reserved ? [...reserved] : []

  const ordered = labels
    .filter((l) => (l.opacity ?? 0) > 0)
    .sort((a, b) => {
      if (!!a.isHeader !== !!b.isHeader) return a.isHeader ? -1 : 1
      return (b.zIndex ?? 0) - (a.zIndex ?? 0)
    })

  for (const label of ordered) {
    const scale = label.scale ?? 1
    const box = label.isHeader ? HEADER_BOX : NODE_BOX
    const hw = box.hw * scale
    const hh = box.hh * scale
    // The badge renders above its anchor point, so collide the shifted box.
    const cy = label.screenY - hh - 16 * scale

    const clash = placed.some(
      (p) => Math.abs(p.x - label.screenX) < p.hw + hw && Math.abs(p.y - cy) < p.hh + hh,
    )

    // Hidden with opacity rather than display, so a badge fades instead of
    // blinking as the camera carries it across a collision boundary.
    if (clash && !label.isHeader) {
      label.opacity = 0
    } else {
      placed.push({ x: label.screenX, y: cy, hw, hh })
    }
  }
}

/** Inline style for a label's wrapper element. */
export function labelStyle(label: SceneLabel): Record<string, string | number> {
  return {
    transform: `translate3d(${label.screenX}px, ${label.screenY}px, 0) translate(-50%, -100%) scale(${label.scale ?? 1})`,
    opacity: label.opacity ?? 1,
    zIndex: label.zIndex ?? 10,
  }
}
