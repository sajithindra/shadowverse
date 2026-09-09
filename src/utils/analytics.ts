import { logEvent } from 'firebase/analytics'
import { analytics } from '../firebase'

const ADS_ID = import.meta.env.VITE_GOOGLE_ADS_ID as string | undefined

/**
 * Google Ads conversion labels, one per action worth bidding on.
 * Each comes from Ads > Goals > Conversions > the action's tag setup ("AW-123/LABEL" -> LABEL).
 * A missing label just means that action stays a GA4 event and never reaches Ads.
 */
const ADS_LABELS: Record<string, string | undefined> = {
  whatsapp_click: import.meta.env.VITE_ADS_LABEL_WHATSAPP,
  email_click: import.meta.env.VITE_ADS_LABEL_EMAIL,
  lead_submission: import.meta.env.VITE_ADS_LABEL_LEAD,
}

/**
 * Nominal value per conversion, in INR. Smart Bidding needs a number to optimise against;
 * this is a qualified-lead estimate, not deal size. Raise it when real close rates are known.
 */
const LEAD_VALUE_INR = 2500

const ATTRIBUTION_KEY = 'sv_attribution'
// Google's default click-through conversion window.
const ATTRIBUTION_DAYS = 90

export interface Attribution {
  gclid?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  savedAt: number
}

/**
 * Remember the ad click that brought this visitor. The gclid only exists on the landing
 * URL, but the conversion happens later on another page, so without this every WhatsApp
 * click looks organic to Google Ads.
 */
export function rememberAttribution(search: string = window.location.search): Attribution | null {
  try {
    const q = new URLSearchParams(search)
    const gclid = q.get('gclid')
    if (gclid) {
      const fresh: Attribution = {
        gclid: gclid.slice(0, 200),
        utm_source: q.get('utm_source')?.slice(0, 100) || undefined,
        utm_medium: q.get('utm_medium')?.slice(0, 100) || undefined,
        utm_campaign: q.get('utm_campaign')?.slice(0, 100) || undefined,
        savedAt: Date.now(),
      }
      localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(fresh))
      return fresh
    }

    const raw = localStorage.getItem(ATTRIBUTION_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw) as Attribution
    if (Date.now() - saved.savedAt > ATTRIBUTION_DAYS * 86400000) {
      localStorage.removeItem(ATTRIBUTION_KEY)
      return null
    }
    return saved
  } catch {
    // Private mode or a corrupt entry; attribution is best-effort, never block the click.
    return null
  }
}

/**
 * Point gtag at the Google Ads account as well as GA4. index.html only configures the
 * G- measurement ID; without an AW- config no conversion or remarketing tag ever fires.
 */
export function initAdsTag() {
  if (!ADS_ID || typeof window === 'undefined') return
  const gtag = (window as any).gtag
  if (typeof gtag !== 'function') return
  gtag('config', ADS_ID, { send_page_view: false })
}

/**
 * Universal tracking function for Google Analytics 4 & Google Ads activity monitoring.
 */
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  try {
    const payload = {
      timestamp: new Date().toISOString(),
      ...eventParams,
    }

    // 1. Firebase Analytics
    if (analytics) {
      logEvent(analytics, eventName, payload)
    }

    // 2. Google Tag (gtag.js)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', eventName, payload)
    }

    // 3. Google Tag Manager / Google Ads dataLayer
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      ;(window as any).dataLayer.push({
        event: eventName,
        ...payload,
      })
    }
  } catch (err) {
    console.debug('Analytics tracking failed:', err)
  }
}

/**
 * Track page view in Google Analytics
 */
export function trackPageView(pagePath: string, pageTitle: string) {
  trackEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  })
}

/**
 * Fire a Google Ads conversion. `send_to` must be "AW-<id>/<label>" — sending a GA4
 * measurement ID here (the previous behaviour) records nothing in Ads.
 */
export function trackConversion(conversionName: string, params?: Record<string, any>) {
  const attribution = rememberAttribution()

  // Always keep the GA4 side, so conversions stay visible even before Ads is configured.
  trackEvent('conversion', {
    event_category: 'conversion',
    event_label: conversionName,
    value: LEAD_VALUE_INR,
    currency: 'INR',
    ...attribution,
    ...params,
  })

  const label = ADS_LABELS[conversionName]
  const gtag = typeof window !== 'undefined' ? (window as any).gtag : undefined
  if (!ADS_ID || !label || typeof gtag !== 'function') return

  gtag('event', 'conversion', {
    send_to: `${ADS_ID}/${label}`,
    value: LEAD_VALUE_INR,
    currency: 'INR',
    transaction_id: `${conversionName}-${Date.now()}`,
    ...params,
  })
}

/**
 * Setup automated click and scroll depth tracking listeners for Google Ads activity monitoring
 */
export function initAutomatedActivityTracking() {
  if (typeof window === 'undefined') return

  initAdsTag()
  rememberAttribution()

  // Scroll Depth Tracking (25%, 50%, 75%, 90%)
  const trackedDepths = new Set<number>()

  window.addEventListener(
    'scroll',
    () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) return
      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100)

      const milestones = [25, 50, 75, 90]
      milestones.forEach((threshold) => {
        if (scrollPercent >= threshold && !trackedDepths.has(threshold)) {
          trackedDepths.add(threshold)
          trackEvent('scroll_depth', {
            depth_percentage: threshold,
            page_path: window.location.pathname,
          })
        }
      })
    },
    { passive: true }
  )

  // Automated Click Tracking for Buttons & CTA Links
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('button, a')
    if (!target) return

    const label = target.textContent?.trim() || target.getAttribute('aria-label') || 'unlabeled_element'
    const href = target.getAttribute('href')

    trackEvent('user_interaction_click', {
      element_text: label.substring(0, 50),
      target_url: href || 'none',
      page_path: window.location.pathname,
    })

    // The only two real conversions on the public site. Detected here rather than in
    // HeroSection/ContactBar/ContactCtaSection so any future CTA is counted automatically.
    if (href?.startsWith('mailto:')) {
      trackConversion('email_click', { page_path: window.location.pathname })
    } else if (href?.includes('wa.me')) {
      trackConversion('whatsapp_click', { page_path: window.location.pathname })
    }
  })
}
