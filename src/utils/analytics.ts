import { logEvent } from 'firebase/analytics'
import { analytics } from '../firebase'

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
 * Track user conversion for Google Ads & Analytics
 */
export function trackConversion(conversionName: string, params?: Record<string, any>) {
  trackEvent('conversion', {
    send_to: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-4PNDP46L2M',
    event_category: 'conversion',
    event_label: conversionName,
    ...params,
  })
}

/**
 * Setup automated click and scroll depth tracking listeners for Google Ads activity monitoring
 */
export function initAutomatedActivityTracking() {
  if (typeof window === 'undefined') return

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
  })
}
