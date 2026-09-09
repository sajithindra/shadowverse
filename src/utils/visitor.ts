import { setUserProperties } from 'firebase/analytics'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { analytics, db } from '../firebase'
import { rememberAttribution, trackEvent } from './analytics'

const CAMPAIGN_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
]

/** Trim anything heading for Firestore/GA4 so a hostile query string can't bloat a document. */
export function clip(value: unknown, max: number): string {
  return String(value ?? '').slice(0, max)
}

/** Pull the ad-campaign params off the landing URL — the part marketing actually spends money on. */
export function campaignFrom(search: string): Record<string, string> {
  const q = new URLSearchParams(search)
  const out: Record<string, string> = {}
  for (const key of CAMPAIGN_KEYS) {
    const v = q.get(key)
    if (v) out[key] = clip(v, 200)
  }
  return out
}

/**
 * One row per browser session: who the visitor's network says they are, how they arrived.
 * Raw IP goes to Firestore only — Google's terms forbid sending IPs (or any PII) to GA4,
 * so GA4 gets the derived firmographics instead.
 */
export async function captureVisitor() {
  if (typeof window === 'undefined') return
  if (sessionStorage.getItem('sv_visitor_logged')) return
  sessionStorage.setItem('sv_visitor_logged', '1')

  let net: Record<string, any> = {}
  try {
    const res = await fetch('https://ipwho.is/')
    const body = await res.json()
    if (body?.success) net = body
  } catch {
    // Offline, rate-limited, or killed by an ad blocker. Log what the browser knows anyway.
  }

  const network = clip(net.connection?.org || net.connection?.isp || 'unknown', 120)
  const city = clip(net.city || 'unknown', 80)
  const country = clip(net.country || 'unknown', 80)
  // Merge the remembered ad click in, so a visitor who landed on an ad days ago and
  // converts today still carries the gclid needed for offline conversion import.
  const remembered = rememberAttribution()
  const campaign = { ...campaignFrom(window.location.search) }
  if (remembered?.gclid && !campaign.gclid) campaign.gclid = remembered.gclid

  if (analytics) {
    // GA4 caps user-property values at 36 chars; longer values are dropped silently.
    setUserProperties(analytics, {
      visitor_org: clip(network, 36),
      visitor_city: clip(city, 36),
      visitor_country: clip(country, 36),
    })
  }
  trackEvent('visitor_profile', {
    visitor_org: network,
    visitor_city: city,
    visitor_region: clip(net.region || 'unknown', 80),
    visitor_country: country,
    visitor_asn: clip(net.connection?.asn || '', 20),
    ...campaign,
  })

  try {
    await addDoc(collection(db, 'visitor_sessions'), {
      ip: clip(net.ip, 45) || null,
      network,
      asn: clip(net.connection?.asn || '', 20),
      city,
      region: clip(net.region || '', 80),
      country,
      timezone: clip(net.timezone?.id || '', 60),
      connectionType: clip((navigator as any).connection?.effectiveType || '', 20),
      referrer: clip(document.referrer, 500),
      landingPage: clip(window.location.pathname + window.location.search, 500),
      userAgent: clip(navigator.userAgent, 500),
      language: clip(navigator.language, 20),
      screen: `${window.screen.width}x${window.screen.height}`,
      campaign,
      createdAt: serverTimestamp(),
      // Firestore TTL policy on this field enforces the 90-day retention the privacy notice promises.
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    })
  } catch (err) {
    console.debug('Visitor capture failed:', err)
  }
}
