<script setup lang="ts">
import { useCameraStore } from '../stores/cameraStore'

const emit = defineEmits(['triggerFallTest'])
const cameraStore = useCameraStore()
</script>

<template>
  <section class="relative pt-20 pb-12 md:pt-36 md:pb-24 px-4 md:px-12 lg:px-20 overflow-hidden">
    <!-- Hero Background Radial Glow -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] pointer-events-none"
      style="background: radial-gradient(ellipse at 50% 0%, rgba(117,13,55,0.22) 0%, transparent 70%)">
    </div>

    <div class="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch relative z-10">
      <!-- Hero Content -->
      <div class="lg:col-span-7 flex flex-col justify-between items-start">
        <div>
          <div class="section-tag mb-3 md:mb-6">// SOVEREIGN PRIVATE CLOUD & VISION AI</div>

          <h1 class="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-[1.1] md:leading-[0.95] mb-4 md:mb-6">
            <!-- STATIC TEXT WITHOUT ANY EFFECTS -->
            THE EYE THAT<br/>
            <!-- IMPROVED REALISTIC EYE BLINKING ANIMATION -->
            <span class="eye-blink-text inline-block" style="color: #750d37">NEVER BLINKS.</span>
          </h1>

          <p class="text-[#c8c8cc] text-xs sm:text-base md:text-xl font-normal leading-relaxed max-w-2xl mb-6 md:mb-8">
            While you sleep. While you work. While you're away —<br/>
            <span class="text-white font-semibold">ShadowVision AI agents watch 24×7×365 without rest, without error.</span>
            Deployed on-premise on your own private cloud.
          </p>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 mb-8 md:mb-10 w-full">
            <a href="#shadowwatch" class="industrial-btn industrial-btn-primary industrial-btn-lg text-center w-full sm:w-auto">
              EXPLORE SHADOWWATCH (12,000+ STREAMS)
            </a>
            <button @click="emit('triggerFallTest')" class="industrial-btn industrial-btn-outline industrial-btn-lg border-[#750d37] text-white w-full sm:w-auto">
              TEST ELDER FALL SIMULATION
            </button>
          </div>
        </div>

        <!-- Tailored 4x Metrics Grid Leveled with Right Box -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 w-full pt-6 border-t border-[#1e1e20] mt-auto">
          <div class="industrial-card p-3 text-center">
            <div class="text-lg md:text-2xl font-black text-white">12,000+</div>
            <div class="text-[8px] md:text-[9px] font-mono text-[#88888c] uppercase tracking-wider mt-0.5">STREAMS / SERVER</div>
          </div>
          <div class="industrial-card p-3 text-center">
            <div class="text-lg md:text-2xl font-black text-[#3d8b5e]">100%</div>
            <div class="text-[8px] md:text-[9px] font-mono text-[#88888c] uppercase tracking-wider mt-0.5">ON-PREMISE SOVEREIGN</div>
          </div>
          <div class="industrial-card p-3 text-center">
            <div class="text-lg md:text-2xl font-black text-white">&lt;3 MIN</div>
            <div class="text-[8px] md:text-[9px] font-mono text-[#88888c] uppercase tracking-wider mt-0.5">FALL & ALERT</div>
          </div>
          <div class="industrial-card p-3 text-center">
            <div class="text-lg md:text-2xl font-black text-[#750d37]">&lt;50ms</div>
            <div class="text-[8px] md:text-[9px] font-mono text-[#88888c] uppercase tracking-wider mt-0.5">INFERENCE LATENCY</div>
          </div>
        </div>
      </div>

      <!-- Hero Terminal Console (Height Leveled with Left Column) -->
      <div class="lg:col-span-5 w-full flex flex-col">
        <div class="industrial-card p-0 overflow-hidden shadow-2xl flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between px-3.5 md:px-5 py-3 border-b border-[#1e1e20] bg-[#0a0a0c]">
              <div class="flex items-center gap-2.5">
                <div class="live-dot"></div>
                <span class="font-mono text-[10px] md:text-xs text-white font-bold tracking-widest uppercase">SHADOWVISION_AI // LOG_STREAM</span>
              </div>
              <span class="font-mono text-[9px] md:text-[10px] text-[#9a1a4e] font-bold tracking-widest">REALTIME</span>
            </div>

            <div class="h-24 md:h-28 bg-[#0a0a0c] border-b border-[#1e1e20] relative flex items-center justify-center overflow-hidden">
              <div class="w-20 h-20 md:w-24 md:h-24 rounded-full border border-[#750d37]/40 relative flex items-center justify-center">
                <div class="w-12 h-12 md:w-16 md:h-16 rounded-full border border-[#750d37]/30"></div>
                <div class="w-6 h-6 md:w-8 md:h-8 rounded-full border border-[#750d37]/20"></div>
                <div class="absolute w-full h-px bg-[#750d37]/30"></div>
                <div class="absolute h-full w-px bg-[#750d37]/30"></div>
                <div class="absolute top-0 left-1/2 w-1/2 h-1/2 bg-gradient-to-br from-[#750d37]/60 to-transparent origin-bottom-left radar-sweep"></div>
              </div>
              <div class="absolute bottom-2 left-3 md:left-4 font-mono text-[8px] md:text-[9px] text-[#88888c]">RADAR_ACTIVE: 12,000 STREAMS</div>
              <div class="absolute bottom-2 right-3 md:right-4 font-mono text-[8px] md:text-[9px] text-[#3d8b5e]">ZERO_FRAME_LOSS</div>
            </div>

            <div class="p-3 md:p-4 bg-[#0a0a0c] space-y-2 font-mono text-xs max-h-[280px] md:max-h-[330px] overflow-y-auto">
              <div
                v-for="(ev, idx) in cameraStore.eventLogs"
                :key="idx"
                class="p-2 md:p-2.5 bg-[#111113] border border-[#1e1e20] flex flex-col gap-1 transition-all hover:border-[#750d37]"
              >
                <div class="flex items-center justify-between">
                  <span class="text-[#88888c] text-[9px] md:text-[10px]">{{ ev.time }}</span>
                  <span
                    class="px-1.5 py-0.5 text-[8px] md:text-[9px] font-bold tracking-wider uppercase"
                    :class="{
                      'bg-[#c44a4a]/20 text-[#c44a4a] border border-[#c44a4a]/40': ev.tag === 'CRITICAL' || ev.tag === 'ALERT',
                      'bg-[#c49a3c]/20 text-[#c49a3c] border border-[#c49a3c]/40': ev.tag === 'WARNING',
                      'bg-[#3d8b5e]/20 text-[#3d8b5e] border border-[#3d8b5e]/40': ev.tag === 'INFO',
                    }"
                  >
                    {{ ev.tag }}
                  </span>
                </div>
                <div class="text-[10px] md:text-[11px] font-semibold text-[#9a1a4e] mt-0.5">AGENT: {{ ev.agent }}</div>
                <div class="text-[11px] md:text-xs text-[#e8e8ea] leading-snug">{{ ev.msg }}</div>
              </div>
            </div>
          </div>

          <div>
            <div class="px-3.5 md:px-5 py-2.5 border-t border-[#1e1e20] bg-[#0a0a0c] flex flex-col sm:flex-row items-center justify-between gap-1 font-mono text-[9px] md:text-[10px] text-[#88888c]">
              <span>WORKLOAD: 12,000 FEEDS</span>
              <span class="text-[#3d8b5e]">GPU ACCELERATED (NVDEC)</span>
            </div>
            <div class="px-3.5 md:px-5 py-1.5 border-t border-[#1e1e20]/60 bg-[#0a0a0c] flex items-center justify-between font-mono text-[8px] md:text-[9px] text-[#555558]">
              <span>IMAGINED BY <strong class="text-white font-bold">SAJITHINDRA</strong></span>
              <span>PROGRAMMED BY <strong class="text-[#9a1a4e] font-bold">SUVRMONX LLP</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
