<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import lottie from 'lottie-web'
import logoData from '../assets/logo.json'
import { useAuthStore } from '../stores/authStore'

const emit = defineEmits(['openSignIn'])
const router = useRouter()
const authStore = useAuthStore()

const scrolled = ref(false)
const navLogoRef = ref<HTMLElement | null>(null)
let navLogoAnim: any = null

function onScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
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
  if (navLogoAnim) navLogoAnim.destroy()
})

function navigateToDashboard() {
  router.push('/dashboard')
}
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex items-center justify-between px-4 md:px-12 h-14 md:h-20"
    :class="scrolled ? 'bg-[#0a0a0c]/95 border-b border-[#1e1e20] backdrop-blur-md shadow-2xl' : 'bg-gradient-to-b from-[#0a0a0c]/90 via-[#0a0a0c]/40 to-transparent backdrop-blur-xs'"
  >
    <!-- Brand Logo & Title -->
    <div class="flex items-center gap-2.5 sm:gap-3 cursor-pointer" @click="router.push('/')">
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
          class="w-7 h-7 sm:w-10 sm:h-10"
          style="filter: url(#nav-logo-filter) drop-shadow(0 0 8px rgba(117,13,55,0.7))"
        ></div>
      </div>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <span class="font-black tracking-[3px] md:tracking-[6px] text-xs sm:text-base text-white uppercase leading-none">SHADOWVERSE</span>
          <span class="px-1.5 py-0.5 bg-[#750d37]/20 border border-[#750d37]/60 text-[8px] font-mono text-[#9a1a4e] tracking-widest font-bold hidden md:inline-block">PRIVATE CLOUD</span>
        </div>
        <span class="text-[8px] md:text-[9px] font-mono text-[#a0a0a4] tracking-[1.5px] md:tracking-[3px] uppercase mt-0.5 hidden md:block">SOVEREIGN AGENTIC AI SURVEILLANCE</span>
      </div>
    </div>

    <!-- Desktop Navigation Links -->
    <nav class="hidden lg:flex items-center gap-6 xl:gap-8 font-mono text-xs tracking-[2px] uppercase">
      <a href="/#problem" class="text-[#a0a0a4] hover:text-white transition-colors duration-200">// PROBLEM</a>
      <a href="/#facts" class="text-[#a0a0a4] hover:text-white transition-colors duration-200">// HUMAN VS AI</a>
      <a href="/#architecture" class="text-[#a0a0a4] hover:text-white transition-colors duration-200">// ECOSYSTEM</a>
      <a href="/#shadowwatch" class="text-[#a0a0a4] hover:text-white transition-colors duration-200">// SHADOWWATCH</a>
      <a href="/#logiclock" class="text-[#a0a0a4] hover:text-white transition-colors duration-200">// LOGIC LOCK</a>
      <a href="/#scenarios" class="text-[#a0a0a4] hover:text-white transition-colors duration-200">// AI AGENTS</a>
    </nav>

    <!-- Action Buttons & Session Indicator -->
    <div class="flex items-center gap-2">
      <!-- Session Badge if Logged In -->
      <button
        v-if="authStore.isAuthenticated"
        @click="navigateToDashboard"
        class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#3d8b5e]/15 border border-[#3d8b5e] font-mono text-[9px] text-[#3d8b5e] font-bold cursor-pointer hover:bg-[#3d8b5e] hover:text-white transition-all"
      >
        <span class="live-dot"></span>
        <span>DASHBOARD: {{ authStore.userProfile?.fullName || authStore.operatorId }}</span>
      </button>

      <button
        v-if="!authStore.isAuthenticated"
        @click="emit('openSignIn')"
        class="px-3 py-1.5 md:px-5 md:py-2 bg-[#750d37]/20 border border-[#750d37] hover:bg-[#750d37] text-white font-mono text-[10px] md:text-xs font-bold tracking-widest transition-all duration-200 shadow-md active:scale-95 cursor-pointer"
      >
        SIGN IN
      </button>

      <button
        v-else
        @click="navigateToDashboard"
        class="px-3 py-1.5 md:px-5 md:py-2 bg-[#3d8b5e]/20 border border-[#3d8b5e] hover:bg-[#3d8b5e] text-white font-mono text-[10px] md:text-xs font-bold tracking-widest transition-all duration-200 shadow-md active:scale-95 cursor-pointer"
      >
        DASHBOARD
      </button>

      <a href="/#contact" class="industrial-btn industrial-btn-primary hidden md:inline-flex text-xs">
        DEPLOY CLOUD
      </a>
    </div>
  </header>
</template>
