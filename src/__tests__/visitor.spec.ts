import { beforeEach, describe, it, expect } from 'vitest'
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

describe('ad click attribution', () => {
  beforeEach(() => localStorage.clear())

  it('remembers a gclid so a later conversion is still credited to the ad', async () => {
    const { rememberAttribution } = await import('../utils/analytics')
    rememberAttribution('?gclid=Cj0abc&utm_source=google')
    // A later page with no query string still resolves the original click.
    expect(rememberAttribution('')?.gclid).toBe('Cj0abc')
    expect(rememberAttribution('')?.utm_source).toBe('google')
  })

  it('drops attribution past the 90-day click window', async () => {
    const { rememberAttribution } = await import('../utils/analytics')
    localStorage.setItem(
      'sv_attribution',
      JSON.stringify({ gclid: 'stale', savedAt: Date.now() - 91 * 86400000 })
    )
    expect(rememberAttribution('')).toBeNull()
    expect(localStorage.getItem('sv_attribution')).toBeNull()
  })
})
