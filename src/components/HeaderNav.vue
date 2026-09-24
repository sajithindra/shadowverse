<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import lottie from 'lottie-web/build/player/lottie_light'
import logoData from '../assets/logo.json'
import { useAuthStore } from '../stores/authStore'

const emit = defineEmits(['openSignIn', 'openDpdpPortal'])
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const scrolled = ref(false)

/** Nav destinations. The accent is the existing per-section colour. */
const navLinks = [
  { id: 'problem', label: '// PROBLEM', accent: '#750d37' },
  { id: 'facts', label: '// HUMAN VS AI', accent: '#3d8b5e' },
  { id: 'architecture', label: '// ECOSYSTEM', accent: '#4a7ebb' },
  { id: 'shadowwatch', label: '// SHADOWWATCH', accent: '#750d37' },
  { id: 'logiclock', label: '// LOGIC LOCK', accent: '#4a7ebb' },
  { id: 'scenarios', label: '// AI SAFETY', accent: '#3d8b5e' },
]

/** Section currently under the header, for the nav's you-are-here state. */
const activeSection = ref<string>('')
let sectionObserver: IntersectionObserver | null = null

/** How far the page has been scrolled, 0-100, for the progress rule. */
const scrollProgress = ref(0)
const showBackToTop = ref(false)
const mobileMenuOpen = ref(false)
const navLogoRef = ref<HTMLElement | null>(null)
let navLogoAnim: any = null

function onScroll() {
  scrolled.value = window.scrollY > 15

  const doc = document.documentElement
  const scrollable = doc.scrollHeight - doc.clientHeight
  scrollProgress.value = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0
  showBackToTop.value = window.scrollY > window.innerHeight
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

// Lock body scroll when mobile menu is open to prevent background scrolling
watch(mobileMenuOpen, (isOpen) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }
})

function handleNav(hash: string) {
  closeMobileMenu()
  const sectionId = hash.replace('/#', '').replace('#', '')
  if (route.path === '/' || route.path === '') {
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      return
    }
  }
  router.push(hash)
}

function handleSignIn() {
  closeMobileMenu()
  emit('openSignIn')
}

function handleDashboard() {
  closeMobileMenu()
  router.push('/dashboard')
}

function handlePresentation() {
  closeMobileMenu()
  router.push('/scalability/1')
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // You-are-here state. The root margin discounts the fixed header at the top
  // and most of the viewport at the bottom, so a section becomes "current" as
  // it reaches the top of the readable area rather than when it first appears.
  sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeSection.value = entry.target.id
      }
    },
    { rootMargin: '-96px 0px -65% 0px', threshold: 0 },
  )
  for (const link of navLinks) {
    const el = document.getElementById(link.id)
    if (el) sectionObserver.observe(el)
  }
  if (navLogoRef.value) {
    navLogoAnim = lottie.loadAnimation({
      container: navLogoRef.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: logoData,
      rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
    })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  sectionObserver?.disconnect()
  if (navLogoAnim) navLogoAnim.destroy()
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex items-center justify-between px-3 sm:px-6 md:px-12 h-16 md:h-20 max-w-full bg-[#0a0a0c] border-b border-[#1e1e20]"
  >
    <!-- Top 2px Sovereign Brand Accent Line -->
    <div class="absolute top-0 left-0 right-0 h-[2px] bg-[#750d37]"></div>

    <!-- Brand Logo & Title -->
    <div class="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0" @click="router.push('/')" title="ShadowVerse Sovereign Cloud">
      <div class="relative flex items-center justify-center shrink-0">
        <svg class="absolute w-0 h-0 pointer-events-none opacity-0" aria-hidden="true">
          <defs>
            <filter id="nav-logo-filter" color-interpolation-filters="sRGB">
              <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 1 0 0 0 0"/>
            </filter>
          </defs>
        </svg>
        <div
          ref="navLogoRef"
          class="w-7 h-7 sm:w-9 sm:h-9 transition-transform duration-300 group-hover:scale-110"
          style="filter: url(#nav-logo-filter);"
        ></div>
      </div>

      <div class="flex flex-col shrink-0">
        <div class="flex items-center gap-1.5 sm:gap-2">
          <span class="font-black tracking-[2px] sm:tracking-[4px] text-sm sm:text-base text-white uppercase leading-none group-hover:text-[#e8e8ea] transition-colors whitespace-nowrap shrink-0">
            SHADOWVERSE
          </span>
          <span class="px-1.5 py-0.5 bg-[#750d37]/20 border border-[#750d37] text-[8px] font-mono text-[#9a1a4e] tracking-widest font-bold hidden md:inline-block shadow-sm shrink-0">
            SOVEREIGN CLOUD
          </span>
        </div>
        <span class="text-[8px] md:text-[9px] font-mono text-[#88888c] tracking-[1.5px] uppercase mt-0.5 hidden md:block">
          SMART PRIVATE VISION AI
        </span>
      </div>
    </div>

    <!-- Desktop Navigation Links -->
    <nav class="hidden xl:flex items-center gap-4 2xl:gap-7 whitespace-nowrap font-mono text-[11px] tracking-[1.5px] uppercase">
      <a
        v-for="link in navLinks"
        :key="link.id"
        :href="`/#${link.id}`"
        @click.prevent="handleNav(`/#${link.id}`)"
        class="pb-1 border-b-2 transition-[color,border-color] duration-200"
        :class="activeSection === link.id ? 'text-white' : 'text-[#a0a0a4] hover:text-white'"
        :style="{ borderBottomColor: activeSection === link.id ? link.accent : 'transparent' }"
        :aria-current="activeSection === link.id ? 'true' : undefined"
      >{{ link.label }}</a>
    </nav>

    <!-- Action Buttons & Mobile Hamburger Button -->
    <div class="flex items-center gap-2 sm:gap-3 shrink-0">
      <!-- Session Badge & Dashboard / Presentation Links if Logged In -->
      <template v-if="authStore.isAuthenticated">
        <button
          @click="handlePresentation"
          class="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#750d37]/15 border border-[#750d37] font-mono text-[9px] text-[#9a1a4e] font-bold cursor-pointer hover:bg-[#750d37] hover:text-white transition-[background-color,color] duration-200 shadow-sm"
        >
          <span class="material-symbols-outlined text-xs">visibility</span>
          <span>PRESENTATION</span>
        </button>

        <button
          @click="handleDashboard"
          class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-[#3d8b5e]/20 border border-[#3d8b5e] hover:bg-[#3d8b5e] text-white font-mono text-[10px] md:text-xs font-bold tracking-widest transition-[background-color,transform] duration-200 shadow-md active:scale-95 cursor-pointer min-h-[36px]"
        >
          <span class="live-dot"></span>
          <span>DASHBOARD</span>
        </button>
      </template>

      <button
        v-else
        @click="handleSignIn"
        class="hidden sm:flex px-3 py-1.5 md:px-5 md:py-2 bg-[#750d37]/20 border border-[#750d37] hover:bg-[#750d37] text-white font-mono text-[10px] md:text-xs font-bold tracking-widest transition-[background-color,transform] duration-200 shadow-md active:scale-95 cursor-pointer items-center justify-center min-h-[36px]"
      >
        SIGN IN
      </button>

      <!-- Touch-Friendly Mobile Menu Toggle Button -->
      <button
        @click="toggleMobileMenu"
        class="xl:hidden p-2 text-white border border-[#1e1e20] bg-[#111113] hover:border-[#750d37] transition-[border-color,transform] duration-200 cursor-pointer focus:outline-none flex items-center justify-center min-w-[38px] min-h-[38px] active:scale-95"
        aria-label="Toggle Navigation Menu"
      >
        <span v-if="!mobileMenuOpen" class="material-symbols-outlined text-xl text-white">menu</span>
        <span v-else class="material-symbols-outlined text-xl text-[#750d37]">close</span>
      </button>
    </div>

    <!-- Mobile Backdrop Overlay -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mobileMenuOpen"
        class="xl:hidden fixed inset-0 bg-black/80 z-40 top-16 md:top-20"
        @click="closeMobileMenu"
      ></div>
    </transition>

    <!-- Mobile Drawer Overlay Menu -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="mobileMenuOpen"
        class="xl:hidden absolute top-full left-0 right-0 z-50 bg-[#0a0a0c] border-b border-[#750d37]/40 shadow-2xl px-4 sm:px-6 py-5 flex flex-col gap-3.5 font-mono text-xs max-h-[calc(100vh-4.5rem)] overflow-y-auto"
      >
        <div class="flex items-center justify-between pb-2.5 border-b border-[#1e1e20]">
          <span class="text-[10px] text-[#750d37] font-bold tracking-widest">// NAVIGATION MENU</span>
          <span class="text-[9px] text-[#3d8b5e] bg-[#3d8b5e]/10 px-2 py-0.5 border border-[#3d8b5e]/30 font-bold">100% PRIVATE LOCAL SERVER</span>
        </div>

        <nav class="flex flex-col gap-2 uppercase tracking-wider">
          <a
            @click="handleNav('/#problem')"
            class="p-3 bg-[#111113] border border-[#1e1e20] text-[#c8c8cc] hover:text-white hover:border-[#750d37] transition-all flex items-center justify-between cursor-pointer active:bg-[#750d37]/10"
          >
            <span class="font-bold">// 01. PROBLEM</span>
            <span class="text-[10px] text-[#88888c]">BLINDSPOTS</span>
          </a>

          <a
            @click="handleNav('/#facts')"
            class="p-3 bg-[#111113] border border-[#1e1e20] text-[#c8c8cc] hover:text-white hover:border-[#3d8b5e] transition-all flex items-center justify-between cursor-pointer active:bg-[#3d8b5e]/10"
          >
            <span class="font-bold">// 02. HUMAN VS AI</span>
            <span class="text-[10px] text-[#3d8b5e]">98.4% ACCURACY</span>
          </a>

          <a
            @click="handleNav('/#architecture')"
            class="p-3 bg-[#111113] border border-[#1e1e20] text-[#c8c8cc] hover:text-white hover:border-[#4a7ebb] transition-all flex items-center justify-between cursor-pointer active:bg-[#4a7ebb]/10"
          >
            <span class="font-bold">// 03. ECOSYSTEM</span>
            <span class="text-[10px] text-[#88888c]">3 LAYERS</span>
          </a>

          <a
            @click="handleNav('/#shadowwatch')"
            class="p-3 bg-[#111113] border border-[#1e1e20] text-[#c8c8cc] hover:text-white hover:border-[#750d37] transition-all flex items-center justify-between cursor-pointer active:bg-[#750d37]/10"
          >
            <span class="font-bold">// 04. SHADOWWATCH</span>
            <span class="text-[10px] text-[#750d37]">12,000 CAMERAS</span>
          </a>

          <a
            @click="handleNav('/#logiclock')"
            class="p-3 bg-[#111113] border border-[#1e1e20] text-[#c8c8cc] hover:text-white hover:border-[#4a7ebb] transition-all flex items-center justify-between cursor-pointer active:bg-[#4a7ebb]/10"
          >
            <span class="font-bold">// 05. LOGIC LOCK</span>
            <span class="text-[10px] text-[#4a7ebb]">KEYLESS LOGIN</span>
          </a>

          <a
            @click="handleNav('/#scenarios')"
            class="p-3 bg-[#111113] border border-[#1e1e20] text-[#c8c8cc] hover:text-white hover:border-[#3d8b5e] transition-all flex items-center justify-between cursor-pointer active:bg-[#3d8b5e]/10"
          >
            <span class="font-bold">// 06. AI SAFETY</span>
            <span class="text-[10px] text-[#3d8b5e]">24x7 ACTIVE</span>
          </a>
        </nav>

        <div class="pt-3 border-t border-[#1e1e20] flex flex-col gap-2.5">
          <button
            v-if="!authStore.isAuthenticated"
            @click="handleSignIn"
            class="industrial-btn industrial-btn-primary w-full py-3 text-center text-xs font-bold shadow-lg cursor-pointer"
          >
            SIGN IN TO OPERATOR PORTAL
          </button>
          <template v-else>
            <button
              @click="handleDashboard"
              class="industrial-btn industrial-btn-primary w-full py-3 text-center text-xs font-bold shadow-lg cursor-pointer !bg-[#3d8b5e] !border-[#3d8b5e]"
            >
              GO TO DASHBOARD
            </button>
            <button
              @click="handlePresentation"
              class="industrial-btn industrial-btn-outline w-full py-2.5 text-center text-xs font-bold border-[#750d37] text-white cursor-pointer"
            >
              SCALABILITY
            </button>
          </template>

          <button
            @click="emit('openDpdpPortal'); closeMobileMenu()"
            class="industrial-btn industrial-btn-outline w-full py-2.5 text-center text-[10px] border-[#1e1e20] text-[#88888c] cursor-pointer"
          >
            DPDP DATA PROTECTION PORTAL
          </button>
        </div>
      </div>
    </transition>
    <!-- Reading progress. A long single-page site gives no other sense of how
         much is left; this is a 2px rule, not a decoration. -->
    <div class="absolute left-0 right-0 bottom-0 h-0.5 bg-transparent" aria-hidden="true">
      <div
        class="h-full bg-[#750d37] transition-[width] duration-150 ease-out"
        :style="{ width: `${scrollProgress}%` }"
      ></div>
    </div>
  </header>

  <!-- Back to top. The page runs to roughly nine screens. -->
  <button
    v-show="showBackToTop"
    @click="scrollToTop"
    class="fixed bottom-16 xl:bottom-5 right-4 xl:right-5 z-30 w-11 h-11 flex items-center justify-center bg-[#0e0e12] border border-[#27272a] text-[#a0a0a4] hover:text-white hover:border-[#750d37] transition-colors shadow-xl cursor-pointer"
    title="Back to top"
    aria-label="Back to top"
  >
    <span class="material-symbols-outlined text-xl">arrow_upward</span>
  </button>
</template>

