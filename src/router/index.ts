import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { trackPageView } from '../utils/analytics'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/LandingView.vue'),
      meta: { guestOnly: true, title: 'Shadowverse — Sovereign Private AI Video Security' }, // redirect to /dashboard if already logged in
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/UserDashboardView.vue'),
      meta: { requiresAuth: true, title: 'Shadowverse — Security Control Console' },
    },
    {
      path: '/dpdp-portal',
      name: 'dpdp-portal',
      component: () => import('../views/DpdpPortalView.vue'),
      meta: { title: 'Shadowverse — DPDP Privacy & Grievance Redressal Portal' },
    },
    {
      path: '/cctv-presentation/:slide?',
      name: 'cctv-presentation',
      component: () => import('../views/LandingView.vue'),
      meta: { title: 'Shadowverse — CCTV VisionScan Presentation' },
    },
    {
      // Catch-all 404 → home
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      const el = document.querySelector(to.hash)
      if (el) return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth) await authStore.authReady
  const authed = authStore.isAuthenticated

  // Only protect dashboard route requiring auth
  if (to.meta.requiresAuth && !authed) {
    return { name: 'landing' }
  }
})

router.afterEach((to) => {
  const title = (to.meta.title as string) || 'Shadowverse — The Eye That Never Blinks'
  document.title = title
  trackPageView(to.fullPath, title)
})

export default router
