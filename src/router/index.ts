import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/LandingView.vue'),
      meta: { guestOnly: true }, // redirect to /dashboard if already logged in
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/UserDashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/dpdp-portal',
      name: 'dpdp-portal',
      component: () => import('../views/DpdpPortalView.vue'),
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

// Single source of truth for all auth-based routing
router.beforeEach((to) => {
  const authStore = useAuthStore()
  const authed = authStore.isAuthenticated

  // Protected route — must be logged in
  if (to.meta.requiresAuth && !authed) {
    return { name: 'landing', query: { showLogin: 'true' } }
  }

  // Guest-only route — already logged in → go to dashboard
  if (to.meta.guestOnly && authed) {
    return { name: 'dashboard' }
  }
})

export default router
