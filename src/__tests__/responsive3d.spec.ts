import { describe, it, expect } from 'vitest'
import { fitFov } from '../three/stage'
import { labelMetrics } from '../three/labels'

/** The two rules that keep the scalability deck's 3D planes usable on a phone. */

const horizontalHalfAngle = (fov: number, aspect: number) =>
  Math.atan(Math.tan((fov * Math.PI) / 360) * aspect)

describe('fitFov', () => {
  it('leaves a 16:9-or-wider viewport alone', () => {
    expect(fitFov(45, 16 / 9)).toBe(45)
    expect(fitFov(45, 2.4)).toBe(45)
  })

  it('holds the designed horizontal coverage on a mildly narrow viewport', () => {
    const designed = horizontalHalfAngle(45, 16 / 9)
    const widened = fitFov(45, 1.4)
    expect(widened).toBeGreaterThan(45)
    expect(horizontalHalfAngle(widened, 1.4)).toBeCloseTo(designed, 6)
  })

  it('caps the widening before the perspective distorts', () => {
    // A phone in portrait would otherwise ask for ~116 degrees.
    expect(fitFov(45, 375 / 812)).toBeLessThanOrEqual(78)
    // Still well wider than the unadjusted framing that cropped the scene.
    expect(fitFov(45, 375 / 812)).toBeGreaterThan(70)
  })
})

describe('labelMetrics', () => {
  it('keeps the desktop boxes on a desktop', () => {
    const m = labelMetrics(1440)
    expect(m.margin).toBe(118)
    expect(m.header).toEqual({ hw: 132, hh: 34 })
    expect(m.node).toEqual({ hw: 108, hh: 32 })
    expect(m.cullHeaders).toBe(false)
  })

  it('fits two badges across a phone, headers included', () => {
    const width = 375
    const m = labelMetrics(width)
    // A badge plus its margin has to leave room for a second one.
    expect(m.node.hw * 2).toBeLessThan(width / 2)
    expect(m.header.hw * 2).toBeLessThan(width / 2)
    // And a clamped badge cannot hang off the edge.
    expect(m.margin).toBeGreaterThanOrEqual(m.header.hw)
    expect(m.cullHeaders).toBe(true)
  })
})
