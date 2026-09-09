import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import './firebase'
import { initAutomatedActivityTracking, trackEvent } from './utils/analytics'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// Initialize automated scroll depth and click activity monitoring for Google Ads / Analytics
initAutomatedActivityTracking()

// Global Vue App Error Handler
app.config.errorHandler = (err, instance, info) => {
  console.error('[SHADOWVERSE GLOBAL ERROR]:', err, info)
  trackEvent('app_error', {
    error_type: 'vue_error_handler',
    message: String(err),
    info,
  })
}

// Global Window Unhandled Promise & Runtime Error Handlers
window.addEventListener('unhandledrejection', (event) => {
  console.warn('[SHADOWVERSE UNHANDLED REJECTION]:', event.reason)
  trackEvent('app_error', {
    error_type: 'unhandled_rejection',
    reason: String(event.reason),
  })
})

window.addEventListener('error', (event) => {
  console.warn('[SHADOWVERSE RUNTIME ERROR]:', event.error || event.message)
  trackEvent('app_error', {
    error_type: 'runtime_error',
    message: String(event.message),
  })
})

app.use(createPinia())
app.use(router)

app.mount('#app')

