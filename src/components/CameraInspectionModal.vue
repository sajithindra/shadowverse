<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits(['close'])

defineProps<{
  camera: any
}>()

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    v-if="camera"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 select-none animate-fade-in"
  >
    <div class="industrial-card max-w-4xl w-full p-4 md:p-8 border-[#750d37] space-y-4 md:space-y-6 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between pb-3 border-b border-[#1e1e20]">
        <div>
          <span class="font-mono text-[10px] md:text-xs text-[#750d37] font-bold tracking-widest">// FULL-SCREEN CAMERA INSPECTION</span>
          <h3 class="text-base md:text-2xl font-black uppercase text-white">{{ camera.id }} — {{ camera.place }}</h3>
        </div>
        <button @click="emit('close')" class="industrial-btn industrial-btn-outline text-[10px] md:text-xs">
          CLOSE [ESC]
        </button>
      </div>

      <div class="relative aspect-video bg-black border border-[#750d37] overflow-hidden flex items-center justify-center">
        <div class="absolute inset-0 opacity-30" style="background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 20px 20px;"></div>
        <div class="absolute left-0 right-0 h-1 bg-[#750d37] scan-line"></div>

        <div class="absolute inset-3 md:inset-8 border-2 border-[#3d8b5e] bg-[#3d8b5e]/10 p-2 md:p-4 flex flex-col justify-between">
          <div class="flex justify-between font-mono text-[8px] md:text-xs bg-black/80 px-1.5 md:px-3 py-0.5 md:py-1 text-white border border-[#3d8b5e]">
            <span>ACTIVE_AGENT: {{ camera.agent }}</span>
            <span>CONFIDENCE: 99.2%</span>
          </div>
          <div class="font-mono text-[8px] md:text-xs text-[#3d8b5e] bg-black/80 px-1.5 md:px-3 py-0.5 md:py-1 self-start border border-[#3d8b5e]">
            FACE_VECTORS_MATCHED: 100% · BOUNDARY_SECURE
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4 font-mono text-[11px] md:text-xs">
        <div class="p-2.5 md:p-3 bg-[#0a0a0c] border border-[#1e1e20]">
          <span class="text-[#555558] uppercase block text-[8px] md:text-[10px]">MONITOR PURPOSE</span>
          <span class="text-white font-bold">{{ camera.purpose }}</span>
        </div>
        <div class="p-2.5 md:p-3 bg-[#0a0a0c] border border-[#1e1e20]">
          <span class="text-[#555558] uppercase block text-[8px] md:text-[10px]">STREAM TECH</span>
          <span class="text-[#a0a0a4]">{{ camera.manufacturer }}</span>
        </div>
        <div class="p-2.5 md:p-3 bg-[#0a0a0c] border border-[#1e1e20]">
          <span class="text-[#555558] uppercase block text-[8px] md:text-[10px]">RESOLUTION / FPS</span>
          <span class="text-white font-bold">{{ camera.resolution }} @ {{ camera.fps }}FPS</span>
        </div>
        <div class="p-2.5 md:p-3 bg-[#0a0a0c] border border-[#1e1e20]">
          <span class="text-[#555558] uppercase block text-[8px] md:text-[10px]">RTSP LATENCY</span>
          <span class="text-[#3d8b5e] font-bold">{{ camera.latency }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
