<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import ThreeSlide2Topology from './ThreeSlide2Topology.vue'
import ThreeSlide3Pipeline from './ThreeSlide3Pipeline.vue'
import ThreeSlide5Savings from './ThreeSlide5Savings.vue'
import ThreeSlide6Cascade from './ThreeSlide6Cascade.vue'
import Slide4Retraining from './Slide4Retraining.vue'

const props = withDefaults(
  defineProps<{
    initialSlide?: number
  }>(),
  {
    initialSlide: 0, // Default to 0 (Grid Plane Overview)
  }
)

const emit = defineEmits(['close'])
const router = useRouter()

// Current slide: 0 = Overview Grid Plane, 1..5 = Specific Stations
const currentSlide = ref(props.initialSlide >= 0 && props.initialSlide <= 6 ? props.initialSlide : 0)
const totalSlides = 6

// 2D/2.5D X-Y Zigzag Coordinates across the Spatial Grid Plane
const OVERVIEW_SCALE = 0.5
const defaultCoord = { x: 0, y: 0, scale: OVERVIEW_SCALE }
const slideCoordinates: Record<number, { x: number; y: number; scale: number }> = {
  0: { x: 0, y: 0, scale: OVERVIEW_SCALE }, // Overview frames all six waypoints
  1: { x: -1000, y: -560, scale: 1 }, // Top-left
  2: { x: 0, y: -560, scale: 1 },     // Top-centre
  3: { x: 1000, y: -560, scale: 1 },  // Top-right
  4: { x: 1000, y: 560, scale: 1 },   // Bottom-right
  5: { x: 0, y: 560, scale: 1 },      // Bottom-centre
  6: { x: -1000, y: 560, scale: 1 },  // Bottom-left
}

// Waypoint badges live inside the scaled world, so in overview they are scaled
// back up to render at their natural, readable size.
const overviewBadgeStyle = { transform: `scale(${1 / OVERVIEW_SCALE})` }

const stationMeta = [
  { id: 1, icon: 'hub', title: 'Distributed Data Center Topology', subtitle: 'Edge Data Centers & Macro Swarm Network' },
  { id: 2, icon: 'memory', title: 'Edge Data Center Internal Pipeline', subtitle: 'L1-L3 Inference Stack & 20-GPU Clusters' },
  { id: 3, icon: 'account_tree', title: 'Cascaded Inference Topology', subtitle: 'Five GPU Tiers & Early-Exit Routing' },
  { id: 4, icon: 'local_police', title: 'SHADOWWATCH "Palantir for Policing"', subtitle: 'Police Control Console & AI Agent Stream' },
  { id: 5, icon: 'model_training', title: 'Continuous Ground-Truth Retraining', subtitle: 'Ahmedabad City Fine-Tuning & 95%+ Accuracy' },
  { id: 6, icon: 'insights', title: 'ShadowVerse = Flock AI + Palantir', subtitle: '3D Holographic Savings Matrix Pods' },
]

/** Station currently in view, for the control bar and the accessible name. */
const currentStation = computed(() => stationMeta[currentSlide.value - 1])

// Smooth X-Y translation & scaling matrix
const worldTransformStyle = computed(() => {
  const coord = slideCoordinates[currentSlide.value] ?? defaultCoord
  return {
    transform: `scale(${coord.scale}) translate(${-coord.x}px, ${-coord.y}px)`,
    transition: 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
    transformOrigin: 'center center',
  }
})

// Auto-Play State
const autoPlay = ref(false)
const autoPlaySpeed = 6500
const autoPlayProgress = ref(0)
let autoPlayTimer: ReturnType<typeof setInterval> | null = null

const isFullscreen = ref(false)
const touchStartX = ref(0)
const touchStartY = ref(0)

watch(
  () => props.initialSlide,
  (newVal) => {
    if (newVal >= 0 && newVal <= totalSlides) {
      currentSlide.value = newVal
    }
  }
)

watch(
  currentSlide,
  (newVal) => {
    if (newVal > 0) {
      router.replace({ name: 'scalability', params: { slide: newVal.toString() } })
    }
    resetAutoPlayTimer()
  },
  { immediate: true }
)

function nextSlide() {
  if (currentSlide.value < totalSlides) {
    currentSlide.value++
  } else if (autoPlay.value) {
    currentSlide.value = 1
  }
}

function prevSlide() {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}

function goToSlide(num: number) {
  if (num >= 0 && num <= totalSlides) {
    currentSlide.value = num
  }
}

function toggleAutoPlay() {
  autoPlay.value = !autoPlay.value
  if (autoPlay.value) {
    if (currentSlide.value === 0) currentSlide.value = 1
    startAutoPlayTimer()
  } else {
    stopAutoPlayTimer()
  }
}

function startAutoPlayTimer() {
  stopAutoPlayTimer()
  autoPlayProgress.value = 0
  const intervalTime = 100
  const step = (intervalTime / autoPlaySpeed) * 100

  autoPlayTimer = setInterval(() => {
    autoPlayProgress.value += step
    if (autoPlayProgress.value >= 100) {
      autoPlayProgress.value = 0
      nextSlide()
    }
  }, intervalTime)
}

function stopAutoPlayTimer() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
  autoPlayProgress.value = 0
}

function resetAutoPlayTimer() {
  if (autoPlay.value) {
    startAutoPlayTimer()
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      isFullscreen.value = true
    }).catch(() => {})
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        isFullscreen.value = false
      }).catch(() => {})
    }
  }
}

function handleTouchStart(e: TouchEvent) {
  if (e.touches && e.touches.length > 0 && e.touches[0]) {
    touchStartX.value = e.touches[0].clientX
    touchStartY.value = e.touches[0].clientY
  }
}

function handleTouchEnd(e: TouchEvent) {
  if (e.changedTouches && e.changedTouches.length > 0 && e.changedTouches[0]) {
    const deltaX = e.changedTouches[0].clientX - touchStartX.value
    const deltaY = e.changedTouches[0].clientY - touchStartY.value

    if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 80) {
      if (deltaX < 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
  } else if (e.key === 'ArrowRight' || e.key === 'Space' || e.key === 'PageDown') {
    if (e.key === 'Space') e.preventDefault()
    nextSlide()
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    prevSlide()
  } else if (e.key === '0' || e.key === 'm' || e.key === 'M') {
    goToSlide(0)
  } else if (e.key >= '1' && e.key <= '6') {
    goToSlide(parseInt(e.key, 10))
  } else if (e.key === 'Home') {
    goToSlide(1)
  } else if (e.key === 'End') {
    goToSlide(totalSlides)
  } else if (e.key === 'p' || e.key === 'P') {
    toggleAutoPlay()
  } else if (e.key === 'f' || e.key === 'F') {
    toggleFullscreen()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  stopAutoPlayTimer()
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div
    class="fixed inset-0 z-50 bg-[#050508] text-white select-none overflow-hidden"
    @click.self="emit('close')"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    role="dialog"
    aria-modal="true"
    aria-labelledby="scalability-title"
  >
    <h2 id="scalability-title" class="sr-only">
      Shadowverse scalability architecture{{ currentStation ? `: ${currentStation.title}` : '' }}
    </h2>

    <!-- MINIMAL CORNER CONTROLS (ONLY CLOSE & FULLSCREEN, NO TOP BARS) -->
    <div class="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 z-50 pointer-events-auto">
      <button
        v-if="currentSlide !== 0"
        @click="goToSlide(0)"
        class="px-2.5 py-1 bg-[#0e0e12] border border-[#27272a] hover:border-zinc-400 text-zinc-400 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg"
        title="Return to Grid Overview [0]"
      >
        <span class="material-symbols-outlined text-xs">grid_view</span>
        <span class="hidden sm:inline">OVERVIEW</span>
      </button>

      <button
        @click="toggleFullscreen"
        class="w-7 h-7 bg-[#0e0e12] border border-[#27272a] hover:border-zinc-400 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-lg"
        :title="isFullscreen ? 'Exit Fullscreen [F]' : 'Fullscreen [F]'"
      >
        <span class="material-symbols-outlined text-sm">{{ isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}</span>
      </button>

      <button
        @click="emit('close')"
        class="w-7 h-7 bg-[#0e0e12] border border-[#27272a] hover:border-[#e02870] hover:text-[#e02870] text-zinc-400 flex items-center justify-center transition-colors cursor-pointer shadow-lg"
        title="Close presentation [ESC]"
      >
        <span class="material-symbols-outlined text-sm">close</span>
      </button>
    </div>

    <!-- ════════════════ INFINITE GRIDLINE PLANE VIEWPORT ════════════════ -->
    <div class="w-full h-full relative overflow-hidden flex items-center justify-center grid-plane-bg">
      
      <!-- OVERVIEW TITLE, sitting in the centre of the station circuit -->
      <div
        v-if="currentSlide === 0"
        class="absolute inset-0 hidden lg:flex flex-col items-center justify-center pointer-events-none z-0 px-6 text-center"
      >
        <div class="font-mono text-[11px] tracking-[0.3em] text-[#e02870] uppercase">Shadowverse</div>
        <h1 class="mt-2 font-mono text-2xl sm:text-3xl font-black text-white tracking-tight">
          Scalability Architecture
        </h1>
        <p class="mt-3 max-w-md text-xs sm:text-sm text-zinc-400 leading-relaxed">
          How the platform scales, in six stations — from the national edge topology down to the GPU cost of running it.
          Pick one, or press <span class="text-zinc-200 font-bold">Space</span> to walk the circuit.
        </p>
      </div>

      <!-- MOBILE OVERVIEW — a list, because the spatial circuit needs width -->
      <div
        v-if="currentSlide === 0"
        class="lg:hidden absolute inset-0 z-30 overflow-y-auto px-4 pt-16 pb-16"
      >
        <div class="text-center mb-5">
          <div class="font-mono text-[10px] tracking-[0.3em] text-[#e02870] uppercase">Shadowverse</div>
          <h1 class="mt-1.5 font-mono text-2xl font-black text-white tracking-tight">Scalability Architecture</h1>
          <p class="mt-2 text-xs text-zinc-400 leading-relaxed">
            How the platform scales, in six stations — from the national edge topology down to the GPU cost of running it.
          </p>
        </div>

        <ul class="space-y-2">
          <li v-for="station in stationMeta" :key="station.id">
            <button
              @click="goToSlide(station.id)"
              class="w-full text-left px-3 py-3 bg-[#0a0a0e] border border-[#27272a] hover:border-[#e02870] transition-colors cursor-pointer flex items-center gap-3 font-mono"
            >
              <span class="w-9 h-9 shrink-0 bg-[#750d37] border border-[#e02870] flex items-center justify-center text-white">
                <span class="material-symbols-outlined text-lg">{{ station.icon }}</span>
              </span>
              <span class="min-w-0 flex-1">
                <span class="block text-[#e02870] font-black text-[10px] uppercase tracking-wider">
                  {{ String(station.id).padStart(2, '0') }} // {{ station.subtitle }}
                </span>
                <span class="block text-white font-bold text-sm mt-0.5">{{ station.title }}</span>
              </span>
              <span class="material-symbols-outlined text-zinc-500 text-base shrink-0">arrow_forward</span>
            </button>
          </li>
        </ul>
      </div>

      <!-- 2D/2.5D MOVING COORDINATE CANVAS -->
      <div
        class="absolute w-0 h-0 flex items-center justify-center"
        :style="worldTransformStyle"
      >
        <!-- ZIGZAG CONNECTING SVG PATH -->
        <svg class="absolute pointer-events-none overflow-visible z-0" style="left: 0; top: 0;">
          <!-- MAIN ZIGZAG LINE -->
          <path
            d="M -1000 -560 L 0 -560 L 1000 -560 L 1000 560 L 0 560 L -1000 560"
            fill="none"
            stroke="#750d37"
            stroke-width="6"
            stroke-dasharray="16 12"
            class="opacity-70"
          />
          <!-- PULSING TRAVEL HEAD -->
          <circle
            v-if="currentSlide >= 1 && currentSlide <= totalSlides && slideCoordinates[currentSlide]"
            :cx="slideCoordinates[currentSlide]?.x ?? 0"
            :cy="slideCoordinates[currentSlide]?.y ?? 0"
            r="16"
            fill="#e02870"
            class="animate-ping opacity-50"
          />
        </svg>

        <!-- ════════ STATION 1 (X: -1000, Y: -560) ════════ -->
        <div
          class="absolute transition-opacity duration-300 flex items-center justify-center"
          :class="currentSlide === 1 ? 'w-screen h-screen opacity-100 pointer-events-auto z-30' : (currentSlide === 0 ? 'w-auto h-auto opacity-100 pointer-events-auto z-20 cursor-pointer' : 'w-screen h-screen opacity-0 pointer-events-none z-0')"
          style="left: -1000px; top: -560px; transform: translate(-50%, -50%);"
          @click="currentSlide === 0 && goToSlide(1)"
        >
          <!-- OVERVIEW WAYPOINT BADGE (Only in mode 0) -->
          <div
            v-if="currentSlide === 0"
            class="px-4 py-2.5 bg-[#0a0a0e] border-2 border-[#e02870] font-mono shadow-2xl hidden lg:flex items-center gap-3.5 cursor-pointer transition-colors hover:bg-[#15151c]"
            :style="overviewBadgeStyle"
          >
            <div class="w-9 h-9 bg-[#750d37] border-2 border-[#e02870] flex items-center justify-center text-white font-black text-xl shadow-lg">
              <span class="material-symbols-outlined text-lg">hub</span>
            </div>
            <div>
              <div class="text-[#e02870] font-black text-xs uppercase flex items-center gap-1.5 whitespace-nowrap">
                <span class="w-2.5 h-2.5 rounded-full bg-[#e02870]"></span>
                <span>01 // TOPOLOGY</span>
              </div>
              <div class="text-white font-black text-sm whitespace-nowrap">Distributed Data Center Topology</div>
            </div>
            <span class="material-symbols-outlined text-zinc-300 text-base ml-2">arrow_forward</span>
          </div>

          <!-- FULL-SCREEN 3D TOPOLOGY CANVAS (NO CHROME / NO BOXES) -->
          <div v-else-if="currentSlide === 1" class="w-full h-full">
            <ThreeSlide2Topology :minimal="true" />
          </div>
        </div>

        <!-- ════════ STATION 2 (X: 0, Y: -560) ════════ -->
        <div
          class="absolute transition-opacity duration-300 flex items-center justify-center"
          :class="currentSlide === 2 ? 'w-screen h-screen opacity-100 pointer-events-auto z-30' : (currentSlide === 0 ? 'w-auto h-auto opacity-100 pointer-events-auto z-20 cursor-pointer' : 'w-screen h-screen opacity-0 pointer-events-none z-0')"
          style="left: 0px; top: -560px; transform: translate(-50%, -50%);"
          @click="currentSlide === 0 && goToSlide(2)"
        >
          <!-- OVERVIEW WAYPOINT BADGE (Only in mode 0) -->
          <div
            v-if="currentSlide === 0"
            class="px-4 py-2.5 bg-[#0a0a0e] border-2 border-[#e02870] font-mono shadow-2xl hidden lg:flex items-center gap-3.5 cursor-pointer transition-colors hover:bg-[#15151c]"
            :style="overviewBadgeStyle"
          >
            <div class="w-9 h-9 bg-[#750d37] border-2 border-[#e02870] flex items-center justify-center text-white font-black text-xl shadow-lg">
              <span class="material-symbols-outlined text-lg">memory</span>
            </div>
            <div>
              <div class="text-[#e02870] font-black text-xs uppercase flex items-center gap-1.5 whitespace-nowrap">
                <span class="w-2.5 h-2.5 rounded-full bg-[#e02870]"></span>
                <span>02 // PIPELINE</span>
              </div>
              <div class="text-white font-black text-sm whitespace-nowrap">Edge Data Center Internal Pipeline</div>
            </div>
            <span class="material-symbols-outlined text-zinc-300 text-base ml-2">arrow_forward</span>
          </div>

          <!-- FULL-SCREEN 3D PIPELINE CANVAS (NO CHROME / NO BOXES) -->
          <div v-else-if="currentSlide === 2" class="w-full h-full">
            <ThreeSlide3Pipeline :minimal="true" />
          </div>
        </div>

        <!-- ════════ STATION 3 (X: 1000, Y: -560) ════════ -->
        <div
          class="absolute transition-opacity duration-300 flex items-center justify-center"
          :class="currentSlide === 3 ? 'w-screen h-screen opacity-100 pointer-events-auto z-30' : (currentSlide === 0 ? 'w-auto h-auto opacity-100 pointer-events-auto z-20 cursor-pointer' : 'w-screen h-screen opacity-0 pointer-events-none z-0')"
          style="left: 1000px; top: -560px; transform: translate(-50%, -50%);"
          @click="currentSlide === 0 && goToSlide(3)"
        >
          <!-- OVERVIEW WAYPOINT BADGE (Only in mode 0) -->
          <div
            v-if="currentSlide === 0"
            class="px-4 py-2.5 bg-[#0a0a0e] border-2 border-[#4a90d9] font-mono shadow-2xl hidden lg:flex items-center gap-3.5 cursor-pointer transition-colors hover:bg-[#15151c]"
            :style="overviewBadgeStyle"
          >
            <div class="w-9 h-9 bg-[#1e4d78] border-2 border-[#4a90d9] flex items-center justify-center text-white font-black text-xl shadow-lg">
              <span class="material-symbols-outlined text-lg">account_tree</span>
            </div>
            <div>
              <div class="text-[#4a90d9] font-black text-xs uppercase flex items-center gap-1.5 whitespace-nowrap">
                <span class="w-2.5 h-2.5 rounded-full bg-[#4a90d9]"></span>
                <span>03 // CASCADE</span>
              </div>
              <div class="text-white font-black text-sm whitespace-nowrap">Cascaded Inference Topology</div>
            </div>
            <span class="material-symbols-outlined text-zinc-300 text-base ml-2">arrow_forward</span>
          </div>

          <!-- FULL-SCREEN 3D CASCADE CANVAS (NO CHROME / NO BOXES) -->
          <div v-else-if="currentSlide === 3" class="w-full h-full">
            <ThreeSlide6Cascade :minimal="true" />
          </div>
        </div>
        <!-- ════════ STATION 4 (X: 1000, Y: 560) ════════ -->
        <div
          class="absolute transition-opacity duration-300 flex items-center justify-center"
          :class="currentSlide === 4 ? 'w-[1300px] h-[620px] opacity-100 pointer-events-auto z-30' : (currentSlide === 0 ? 'w-auto h-auto opacity-100 pointer-events-auto z-20 cursor-pointer' : 'w-[1300px] h-[620px] opacity-0 pointer-events-none z-0')"
          style="left: 1000px; top: 560px; transform: translate(-50%, -50%);"
          @click="currentSlide === 0 && goToSlide(4)"
        >
          <!-- OVERVIEW WAYPOINT BADGE (Only in mode 0) -->
          <div
            v-if="currentSlide === 0"
            class="px-4 py-2.5 bg-[#0a0a0e] border-2 border-[#4a90d9] font-mono shadow-2xl hidden lg:flex items-center gap-3.5 cursor-pointer transition-colors hover:bg-[#15151c]"
            :style="overviewBadgeStyle"
          >
            <div class="w-9 h-9 bg-[#4a90d9] border-2 border-[#4a90d9] flex items-center justify-center text-white font-black text-xl shadow-lg">
              <span class="material-symbols-outlined text-lg">local_police</span>
            </div>
            <div>
              <div class="text-[#4a90d9] font-black text-xs uppercase flex items-center gap-1.5 whitespace-nowrap">
                <span class="w-2.5 h-2.5 rounded-full bg-[#4a90d9]"></span>
                <span>04 // ARCHITECTURE</span>
              </div>
              <div class="text-white font-black text-sm whitespace-nowrap">SHADOWWATCH Palantir Architecture</div>
            </div>
            <span class="material-symbols-outlined text-zinc-300 text-base ml-2">arrow_forward</span>
          </div>

          <!-- STATION 3 ARCHITECTURE DIAGRAM -->
          <div v-else-if="currentSlide === 4" class="w-full h-full flex flex-col justify-between p-4 sm:p-7 font-mono select-none overflow-hidden bg-[#09090c] border-2 border-[#27272a] shadow-2xl">
            <!-- IN-SPACE TITLE -->
            <div class="w-full flex items-center justify-between pb-3.5 border-b border-[#27272a] shrink-0">
              <div class="flex items-center gap-3.5">
                <div class="w-12 h-12 bg-[#4a90d9] border-2 border-[#4a90d9] flex items-center justify-center text-white font-black text-2xl shadow-xl">
                  <span class="material-symbols-outlined text-2xl">local_police</span>
                </div>
                <div>
                  <div class="text-[#4a90d9] font-black text-xs sm:text-sm uppercase flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-[#4a90d9]"></span>
                    <span>STATION 04 // FULL-STACK POLICING</span>
                  </div>
                  <h2 class="text-xl sm:text-3xl font-black text-white font-mono mt-0.5">SHADOWWATCH "Palantir for Policing" Architecture</h2>
                </div>
              </div>

              <div class="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-zinc-300 font-bold bg-[#121216] border border-[#27272a] px-3.5 py-1.5 shadow-md">
                <span class="w-2.5 h-2.5 rounded-full bg-[#4a90d9]"></span>
                <span>Decoupled UI · AI Swarm · Private Cloud</span>
              </div>
            </div>

            <div class="w-full flex-1 flex flex-col justify-center gap-3.5 my-3 min-h-0">
              <div class="grid grid-cols-12 gap-3.5 items-stretch flex-1">
                <!-- POLICE CONSOLE -->
                <div class="col-span-5 flex flex-col gap-2.5">
                  <div class="bg-[#121216] border-2 border-[#4a90d9] p-3.5 shadow-xl flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 bg-[#4a90d9] border border-[#4a90d9] flex items-center justify-center font-black">
                        <span class="material-symbols-outlined text-white text-xl">local_police</span>
                      </div>
                      <div>
                        <div class="font-mono text-xs sm:text-sm text-[#4a90d9] font-black uppercase">POLICE INVESTIGATORS</div>
                        <div class="text-white font-bold text-xs sm:text-sm">Natural Language & Photo Search</div>
                      </div>
                    </div>
                  </div>

                  <div class="bg-[#121216] border-2 border-[#4a90d9] p-4 flex-1 flex flex-col justify-between shadow-xl">
                    <div>
                      <div class="flex justify-between items-center mb-1.5">
                        <span class="font-mono text-xs sm:text-sm text-[#4a90d9] font-black uppercase">POLICE CONSOLE UI</span>
                        <span class="font-mono text-xs bg-[#4a90d9]/10 border border-[#4a90d9] text-[#4a90d9] px-2.5 py-0.5 font-bold">Primary Dashboard</span>
                      </div>
                      <h3 class="text-lg sm:text-xl font-black text-white font-mono mb-1.5">SHADOWWATCH</h3>
                      <p class="text-zinc-200 text-xs sm:text-sm leading-relaxed font-sans">
                        Officer query console, real-time alert dispatch maps, timeline trajectory inspection, and automated court evidence bundle generator.
                      </p>
                    </div>
                    <div class="mt-3 font-mono text-xs sm:text-sm text-[#4a90d9] font-bold bg-[#4a90d9]/10 border border-[#4a90d9] p-2 text-center">
                      User Dashboard · Case Graph · Court Evidence Export
                    </div>
                  </div>
                </div>

                <!-- 1-WAY ARROW CONNECTOR -->
                <div class="col-span-2 flex flex-col items-center justify-center font-mono text-xs text-[#e02870] font-black gap-2 bg-[#121216] border-2 border-[#27272a] p-3 self-center my-auto shadow-xl w-full">
                  <span class="text-[#e02870] uppercase text-xs font-black text-center tracking-wider">1-WAY STREAM</span>
                  <span class="material-symbols-outlined text-3xl text-[#e02870] font-black animate-pulse">west</span>
                  <span class="text-zinc-200 text-xs text-center font-bold">AI Swarm Results</span>
                </div>

                <!-- SHADOWVISION AI AGENTS -->
                <div class="col-span-5 flex flex-col justify-end">
                  <div class="bg-[#121216] border-2 border-[#e02870] p-4 flex flex-col justify-between shadow-xl h-full">
                    <div>
                      <div class="flex justify-between items-center mb-1.5">
                        <span class="font-mono text-xs sm:text-sm text-[#e02870] font-black uppercase">AUTONOMOUS AI SWARM</span>
                        <span class="font-mono text-xs bg-[#750d37] border border-[#e02870] text-white font-bold px-2.5 py-0.5">1 Agent / Task</span>
                      </div>
                      <h3 class="text-lg sm:text-xl font-black text-white font-mono mb-1.5">SHADOWVISION AI AGENTS</h3>
                      <p class="text-zinc-200 text-xs sm:text-sm leading-relaxed mb-3 font-sans">
                        Sits on top of ShadowVerse. Executes dedicated micro-agents per investigative task, streaming structured intelligence directly to ShadowWatch.
                      </p>
                      <div class="flex flex-wrap gap-2 font-mono text-xs text-zinc-200">
                        <span class="bg-[#750d37]/60 border border-[#e02870] px-2.5 py-1 font-bold">Watchlist Agent</span>
                        <span class="bg-[#750d37]/60 border border-[#e02870] px-2.5 py-1 font-bold">Incident Agent</span>
                        <span class="bg-[#750d37]/60 border border-[#e02870] px-2.5 py-1 font-bold">Photo Search Agent</span>
                        <span class="bg-[#750d37]/60 border border-[#e02870] px-2.5 py-1 font-bold">Court Evidence Agent</span>
                      </div>
                    </div>
                    <div class="mt-3 font-mono text-xs sm:text-sm text-[#e02870] font-bold bg-[#750d37]/40 border border-[#e02870] p-2 text-center">
                      Streams Structured Intelligence Directly to Police Console
                    </div>
                  </div>
                </div>
              </div>

              <!-- FOUNDATIONAL PRIVATE EDGE CLOUD -->
              <div class="bg-[#121216] border-2 border-[#3d8b5e] p-4 shadow-xl space-y-2 shrink-0">
                <div class="flex items-center justify-between border-b border-[#27272a] pb-1.5">
                  <span class="font-mono text-xs sm:text-sm text-[#3d8b5e] font-black uppercase">FOUNDATIONAL PRIVATE EDGE CLOUD: SHADOWVERSE</span>
                  <span class="font-mono text-xs sm:text-sm text-[#3d8b5e] font-black">20 GPU Servers / District Edge DC</span>
                </div>
                <div class="flex flex-wrap gap-2.5 font-mono text-xs sm:text-sm font-bold text-zinc-200">
                  <span class="bg-[#3d8b5e]/10 border border-[#3d8b5e] text-[#3d8b5e] px-3 py-1">MongoDB (Metadata)</span>
                  <span class="bg-[#3d8b5e]/10 border border-[#3d8b5e] text-[#3d8b5e] px-3 py-1">Neo4j Graph (Trajectories)</span>
                  <span class="bg-[#3d8b5e]/10 border border-[#3d8b5e] text-[#3d8b5e] px-3 py-1">CockroachDB (Global SQL)</span>
                  <span class="bg-[#4a90d9]/10 border border-[#4a90d9] text-[#4a90d9] px-3 py-1">Image Lake (Detections)</span>
                  <span class="bg-[#4a90d9]/10 border border-[#4a90d9] text-[#4a90d9] px-3 py-1">Video Lake (Raw Buffer)</span>
                  <span class="bg-[#c49a3c]/10 border border-[#c49a3c] text-[#c49a3c] px-3 py-1">Clustered GPUs (Inference)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ════════ STATION 5 (X: 0, Y: 560) ════════ -->
        <div
          class="absolute transition-opacity duration-300 flex items-center justify-center"
          :class="currentSlide === 5 ? 'w-[1300px] h-[820px] opacity-100 pointer-events-auto z-30' : (currentSlide === 0 ? 'w-auto h-auto opacity-100 pointer-events-auto z-20 cursor-pointer' : 'w-[1300px] h-[820px] opacity-0 pointer-events-none z-0')"
          style="left: 0px; top: 560px; transform: translate(-50%, -50%);"
          @click="currentSlide === 0 && goToSlide(5)"
        >
          <!-- OVERVIEW WAYPOINT BADGE (Only in mode 0) -->
          <div
            v-if="currentSlide === 0"
            class="px-4 py-2.5 bg-[#0a0a0e] border-2 border-[#e02870] font-mono shadow-2xl hidden lg:flex items-center gap-3.5 cursor-pointer transition-colors hover:bg-[#15151c]"
            :style="overviewBadgeStyle"
          >
            <div class="w-9 h-9 bg-[#750d37] border-2 border-[#e02870] flex items-center justify-center text-white font-black text-xl shadow-lg">
              <span class="material-symbols-outlined text-lg">model_training</span>
            </div>
            <div>
              <div class="text-[#e02870] font-black text-xs uppercase flex items-center gap-1.5 whitespace-nowrap">
                <span class="w-2.5 h-2.5 rounded-full bg-[#e02870]"></span>
                <span>05 // RETRAINING</span>
              </div>
              <div class="text-white font-black text-sm whitespace-nowrap">Continuous City Ground-Truth Retraining</div>
            </div>
            <span class="material-symbols-outlined text-zinc-300 text-base ml-2">arrow_forward</span>
          </div>

          <!-- STATION 4 INTERACTIVE RETRAINING FLYWHEEL & VISUALIZER -->
          <div v-else-if="currentSlide === 5" class="w-full h-full bg-[#09090c] border-2 border-[#27272a] shadow-2xl overflow-hidden">
            <Slide4Retraining />
          </div>
        </div>

        <!-- ════════ STATION 6 (X: -1000, Y: 560) ════════ -->
        <div
          class="absolute transition-opacity duration-300 flex items-center justify-center"
          :class="currentSlide === 6 ? 'w-screen h-screen opacity-100 pointer-events-auto z-30' : (currentSlide === 0 ? 'w-auto h-auto opacity-100 pointer-events-auto z-20 cursor-pointer' : 'w-screen h-screen opacity-0 pointer-events-none z-0')"
          style="left: -1000px; top: 560px; transform: translate(-50%, -50%);"
          @click="currentSlide === 0 && goToSlide(6)"
        >
          <!-- OVERVIEW WAYPOINT BADGE (Only in mode 0) -->
          <div
            v-if="currentSlide === 0"
            class="px-4 py-2.5 bg-[#0a0a0e] border-2 border-[#c49a3c] font-mono shadow-2xl hidden lg:flex items-center gap-3.5 cursor-pointer transition-colors hover:bg-[#15151c]"
            :style="overviewBadgeStyle"
          >
            <div class="w-9 h-9 bg-[#c49a3c] border-2 border-[#c49a3c] flex items-center justify-center text-white font-black text-xl shadow-lg">
              <span class="material-symbols-outlined text-lg">insights</span>
            </div>
            <div>
              <div class="text-[#c49a3c] font-black text-xs uppercase flex items-center gap-1.5 whitespace-nowrap">
                <span class="w-2.5 h-2.5 rounded-full bg-[#c49a3c]"></span>
                <span>06 // SAVINGS</span>
              </div>
              <div class="text-white font-black text-sm whitespace-nowrap">Flock AI + Palantir 3D Savings Pods</div>
            </div>
            <span class="material-symbols-outlined text-zinc-300 text-base ml-2">arrow_forward</span>
          </div>

          <!-- FULL-SCREEN 3D SAVINGS PODS CANVAS (NO CHROME / NO BOXES) -->
          <div v-else-if="currentSlide === 6" class="w-full h-full">
            <ThreeSlide5Savings :minimal="true" />
          </div>
        </div>


      </div>
    </div>

    <!-- DECK CONTROL BAR — position, direct jumps and step controls. The deck
         previously offered keyboard only, with no indication of where you were. -->
    <div class="absolute bottom-0 inset-x-0 z-40 border-t border-[#1e1e20] bg-[#0a0a0e]/92 backdrop-blur-sm">
      <div class="flex items-center justify-between gap-3 px-3 sm:px-5 h-11 font-mono">
        <!-- Where you are -->
        <div class="flex items-center gap-2.5 min-w-0">
          <span class="text-[#e02870] font-black text-[11px] tabular-nums shrink-0">
            {{ currentSlide === 0 ? 'OVERVIEW' : `${String(currentSlide).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}` }}
          </span>
          <span v-if="currentStation" class="hidden md:block text-white font-bold text-[11px] truncate">
            {{ currentStation.title }}
          </span>
        </div>

        <!-- Direct jumps -->
        <div class="flex items-center gap-1">
          <button
            v-for="n in totalSlides"
            :key="n"
            @click="goToSlide(n)"
            class="w-7 h-7 flex items-center justify-center text-[10px] font-bold border transition-colors cursor-pointer"
            :class="currentSlide === n
              ? 'bg-[#750d37] border-[#e02870] text-white'
              : 'bg-transparent border-[#27272a] text-zinc-500 hover:text-white hover:border-zinc-500'"
            :title="stationMeta[n - 1]?.title"
            :aria-label="`Go to station ${n}: ${stationMeta[n - 1]?.title}`"
            :aria-current="currentSlide === n ? 'true' : undefined"
          >{{ n }}</button>
        </div>

        <!-- Step through -->
        <div class="flex items-center gap-1.5 shrink-0">
          <button
            @click="prevSlide"
            :disabled="currentSlide === 0"
            class="w-7 h-7 flex items-center justify-center border border-[#27272a] text-zinc-400 enabled:hover:text-white enabled:hover:border-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Previous [←]"
            aria-label="Previous station"
          >
            <span class="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button
            @click="nextSlide"
            :disabled="currentSlide === totalSlides"
            class="w-7 h-7 flex items-center justify-center border border-[#27272a] text-zinc-400 enabled:hover:text-white enabled:hover:border-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Next [→ / Space]"
            aria-label="Next station"
          >
            <span class="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Fira+Code:wght@400;500;600;700&display=swap');

/* Infinite Coordinate Gridline Plane */
.grid-plane-bg {
  background-color: #050508;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to right, rgba(117, 13, 55, 0.25) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(117, 13, 55, 0.25) 1px, transparent 1px);
  background-size: 60px 60px, 60px 60px, 300px 300px, 300px 300px;
}
</style>
