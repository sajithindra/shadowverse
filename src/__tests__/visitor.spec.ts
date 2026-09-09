import { describe, it, expect } from 'vitest'
import { campaignFrom, clip } from '../utils/visitor'

describe('visitor capture helpers', () => {
  it('keeps only the campaign params that are present', () => {
    expect(campaignFrom('?utm_source=google&utm_campaign=cctv&page=2')).toEqual({
      utm_source: 'google',
      utm_campaign: 'cctv',
    })
    expect(campaignFrom('')).toEqual({})
  })

  it('clips oversized values so a crafted URL cannot bloat a document', () => {
    expect(campaignFrom(`?gclid=${'x'.repeat(5000)}`).gclid).toHaveLength(200)
    expect(clip(undefined, 10)).toBe('')
  })
})
