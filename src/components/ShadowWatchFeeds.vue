<script setup lang="ts">
import { useCameraStore } from '../stores/cameraStore'

const emit = defineEmits(['inspectCamera'])
const cameraStore = useCameraStore()
</script>

<template>
  <section id="shadowwatch" class="py-12 md:py-24 px-4 md:px-12 lg:px-20 border-t border-[#1e1e20] bg-[#0a0a0c]">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row items-start md:items-end justify-between mb-6 md:mb-12 gap-4">
        <div>
          <div class="section-tag mb-3 md:mb-4">// SHADOWWATCH SURVEILLANCE HUB</div>
          <h2 class="text-xl md:text-5xl font-black uppercase tracking-tight">
            12,000+ STREAM CAPACITY.<br/>
            <span style="color: #750d37">CLICK ANY CAMERA FOR FULL-SCREEN INSPECTION.</span>
          </h2>
        </div>
        <div class="flex flex-wrap gap-1.5 font-mono text-[10px] md:text-xs w-full md:w-auto">
          <button
            v-for="flt in ['ALL', 'INTRUDER', 'FALL', 'WASHROOM', 'PET', 'VISITOR']"
            :key="flt"
            @click="cameraStore.setFilter(flt)"
            class="px-2 py-1 md:px-3 md:py-1.5 border transition-all uppercase"
            :class="cameraStore.cameraFilter === flt ? 'bg-[#750d37] border-[#750d37] text-white font-bold' : 'bg-[#111113] border-[#1e1e20] text-[#a0a0a4] hover:text-white'"
          >
            {{ flt }}
          </button>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div
          v-for="cam in cameraStore.filteredCameras"
          :key="cam.id"
          @click="emit('inspectCamera', cam)"
          class="industrial-card p-4 md:p-6 flex flex-col justify-between cursor-pointer group"
        >
          <div>
            <div class="flex items-center justify-between mb-2.5 pb-2 border-b border-[#1e1e20]">
              <span class="font-mono text-xs text-[#750d37] font-bold tracking-widest group-hover:text-white transition-colors">{{ cam.id }}</span>
              <div class="flex items-center gap-2">
                <span class="live-dot"></span>
                <span class="font-mono text-[10px] text-[#3d8b5e] font-bold">{{ cam.status }}</span>
              </div>
            </div>

            <div class="relative aspect-video bg-[#0a0a0c] border border-[#1e1e20] mb-3 overflow-hidden flex items-center justify-center group-hover:border-[#750d37] transition-all">
              <div class="absolute inset-0 opacity-20" style="background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 20px 20px;"></div>
              <div class="absolute left-0 right-0 h-0.5 bg-[#750d37] opacity-60 scan-line"></div>

              <div class="absolute inset-2.5 md:inset-4 border border-[#4a7ebb]/60 bg-[#4a7ebb]/5 p-1.5 flex flex-col justify-between">
                <div class="flex justify-between items-start font-mono text-[8px] md:text-[9px] text-white bg-[#0a0a0c]/80 px-1 py-0.5 border border-[#4a7ebb]">
                  <span>AI_AGENT: {{ cam.agent }}</span>
                  <span>CONF: 98.4%</span>
                </div>
                <div class="font-mono text-[8px] md:text-[9px] text-[#3d8b5e] bg-[#0a0a0c]/80 px-1 py-0.5 self-start border border-[#3d8b5e]">
                  TRACK_ID #104 [ACTIVE]
                </div>
              </div>

              <div class="absolute inset-0 bg-[#750d37]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-mono text-[10px] md:text-xs text-white font-bold tracking-widest bg-black/60 backdrop-blur-xs">
                [ CLICK TO INSPECT FEED ]
              </div>
            </div>

            <div class="space-y-1.5 text-[11px] md:text-xs font-mono">
              <div class="flex justify-between items-center py-0.5 border-b border-[#1e1e20]/60">
                <span class="text-[#555558] uppercase">LOCATION / PLACE:</span>
                <span class="text-white font-bold">{{ cam.place }}</span>
              </div>
              <div class="flex justify-between items-center py-0.5 border-b border-[#1e1e20]/60">
                <span class="text-[#555558] uppercase">MONITOR PURPOSE:</span>
                <span class="text-[#e8e8ea]">{{ cam.purpose }}</span>
              </div>
              <div class="flex justify-between items-center py-0.5 border-b border-[#1e1e20]/60">
                <span class="text-[#555558] uppercase">VISION AGENT:</span>
                <span class="text-[#9a1a4e] font-bold">{{ cam.agent }}</span>
              </div>
              <div class="flex justify-between items-center py-0.5">
                <span class="text-[#555558] uppercase">STREAM TECH:</span>
                <span class="text-[#a0a0a4]">{{ cam.manufacturer }} · {{ cam.resolution }} @ {{ cam.fps }}FPS</span>
              </div>
            </div>
          </div>

          <div class="mt-3 pt-2 border-t border-[#1e1e20] flex items-center justify-between font-mono text-[9px] md:text-[10px] text-[#555558]">
            <span>RTSP LATENCY: {{ cam.latency }}</span>
            <span class="text-[#3d8b5e]">NVDEC_GPU_ACCEL</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
