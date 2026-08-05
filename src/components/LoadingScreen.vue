<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import lottie from 'lottie-web'
import logoData from '../assets/logo.json'

const emit = defineEmits(['loaded'])
const lottieContainer = ref<HTMLElement | null>(null)
const progress = ref(0)
const statusIndex = ref(0)
const showBranding = ref(false)

const statusMessages = [
  'INITIALIZING SHADOWVERSE CLOUD',
  'ORCHESTRATING MICROK8S & CEPH',
  'INGESTING SHADOWWATCH RTSP FEEDS',
  'DEPLOYING SHADOWVISION AI AGENTS',
  'ENFORCING LOGIC LOCK ZERO-TRUST',
]

let animation: any = null
let timer: any = null
let progressInterval: any = null
let statusInterval: any = null

onMounted(() => {
  if (lottieContainer.value) {
    animation = lottie.loadAnimation({
      container: lottieContainer.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: logoData,
      rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
    })
  }

  setTimeout(() => { showBranding.value = true }, 200)

  const startTime = Date.now()
  const progressDuration = 3200
  progressInterval = setInterval(() => {
    const pct = Math.min((Date.now() - startTime) / progressDuration, 1)
    progress.value = Math.round(pct * 98)
    if (pct >= 1) clearInterval(progressInterval)
  }, 35)

  statusInterval = setInterval(() => {
    statusIndex.value = (statusIndex.value + 1) % statusMessages.length
  }, 600)

  timer = setTimeout(() => {
    progress.value = 100
    setTimeout(() => emit('loaded'), 200)
  }, 3300)
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
  if (progressInterval) clearInterval(progressInterval)
  if (statusInterval) clearInterval(statusInterval)
  if (animation) animation.destroy()
})
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#050508] select-none p-4 overflow-hidden">
    <!-- Corner industrial brackets -->
    <div class="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#750d37]"></div>
    <div class="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#750d37]"></div>
    <div class="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#750d37]"></div>
    <div class="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[#750d37]"></div>

    <!-- Background cyber grid & central glow -->
    <div
      class="absolute inset-0 pointer-events-none opacity-50"
      style="background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 32px 32px;"
    ></div>
    <div
      class="absolute w-[600px] h-[600px] rounded-full pointer-events-none opacity-20"
      style="background: radial-gradient(circle, rgba(117,13,55,0.4) 0%, transparent 70%);"
    ></div>

    <!-- Main Container: Expanded max-width on desktop to guarantee no line wrap on second line -->
    <div class="flex flex-col items-center gap-6 sm:gap-8 relative z-10 w-full max-w-sm sm:max-w-xl md:max-w-2xl text-center">
      
      <!-- Animated Lottie Logo with Radar Orbit HUD -->
      <div class="relative anim-float flex items-center justify-center">
        <div class="relative anim-scale">
          <!-- Outer HUD Orbit Ring -->
          <div class="absolute -inset-4 rounded-full border border-[#750d37]/30 border-dashed animate-spin" style="animation-duration: 18s;"></div>
          
          <div class="w-36 h-36 sm:w-48 sm:h-48 relative opacity-0 anim-rotate">
            <div ref="lottieContainer" class="w-full h-full logo-lottie"></div>
          </div>
        </div>
      </div>

      <!-- Branding and Title -->
      <div
        class="flex flex-col items-center gap-3 sm:gap-4 transition-all duration-700 w-full"
        :class="showBranding ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
      >
        <div class="flex flex-col items-center gap-2 w-full">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-black tracking-[6px] sm:tracking-[12px] text-white uppercase font-sans">
            SHADOWVERSE
          </h1>
          
          <div class="flex items-center gap-3">
            <span class="w-12 sm:w-16 h-px bg-[#750d37]"></span>
            <span class="w-1.5 h-1.5 rotate-45 bg-[#9a1a4e]"></span>
            <span class="w-12 sm:w-16 h-px bg-[#750d37]"></span>
          </div>

          <!-- SECOND LINE: Single line on Web/Desktop (sm:whitespace-nowrap), allowed to wrap on Mobile -->
          <p class="expand-effect inline-block text-[10px] sm:text-xs md:text-sm font-mono font-bold tracking-[2px] sm:tracking-[3px] md:tracking-[4px] text-[#9a1a4e] uppercase whitespace-normal sm:whitespace-nowrap px-2">
            [ SOVEREIGN PRIVATE AI CLOUD & SURVEILLANCE ECOSYSTEM ]
          </p>
        </div>

        <!-- Progress Bar & Realtime Telemetry -->
        <div class="flex flex-col items-center gap-2.5 w-full max-w-xs sm:max-w-md mt-2">
          <div class="flex justify-between items-center w-full font-mono text-[10px] sm:text-xs">
            <span class="text-[#a0a0a4] font-bold tracking-wider">// SYSTEM INITIALIZATION</span>
            <span class="text-[#3d8b5e] font-bold">{{ progress }}%</span>
          </div>

          <!-- Industrial Progress Bar -->
          <div class="w-full h-1.5 bg-[#111113] border border-[#1e1e20] overflow-hidden p-0.5">
            <div
              class="h-full bg-gradient-to-r from-[#750d37] via-[#9a1a4e] to-[#3d8b5e] transition-all duration-100 ease-out"
              :style="{ width: progress + '%' }"
            ></div>
          </div>

          <!-- Rotating Status Messages -->
          <p class="text-[10px] sm:text-xs font-mono font-bold tracking-[1.5px] sm:tracking-[2px] text-[#e8e8ea] h-5 flex items-center justify-center">
            {{ statusMessages[statusIndex] }}
          </p>

          <!-- Centered System Boot Indicator Badge -->
          <div class="mt-1 text-[9px] sm:text-[10px] font-mono tracking-[2px] text-[#555558] flex items-center justify-center gap-2 bg-[#111113] px-3 py-1 border border-[#1e1e20]">
            <span class="w-2 h-2 rounded-full bg-[#3d8b5e] animate-pulse"></span>
            <span>SOVEREIGN CLOUD ENGINE v2.4 // READY</span>
          </div>
        </div>
      </div>

    </div>

    <svg class="absolute w-0 h-0 pointer-events-none opacity-0" aria-hidden="true">
      <defs>
        <filter id="remove-black-loading" color-interpolation-filters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 1 0 0 0 0" />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<style scoped>
.logo-lottie {
  filter: url(#remove-black-loading) drop-shadow(0 0 20px rgba(117, 13, 55, 0.6));
}
@keyframes entranceAnim {
  0% { transform: scale(0.15) rotate(-270deg); opacity: 0; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
@keyframes rotateAnim {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes scaleAnim {
  from { transform: scale(1); }
  to { transform: scale(1.05); }
}
@keyframes floatAnim {
  from { transform: translateY(0); }
  to { transform: translateY(-6px); }
}
.anim-rotate {
  animation: entranceAnim 1.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
    rotateAnim 20s linear infinite 1.4s;
}
.anim-scale { animation: scaleAnim 3.2s ease-in-out infinite alternate 1.4s; }
.anim-float { animation: floatAnim 2.6s ease-in-out infinite alternate 1.4s; }
</style>
