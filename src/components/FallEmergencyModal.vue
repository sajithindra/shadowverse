<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useToast } from '../composables/useToast'

const emit = defineEmits(['close'])
const { showToast } = useToast()

const fallTimerSeconds = ref(180)
const fallStatus = ref<'DETECTED' | 'MONITORING_3MIN' | 'AMBULANCE_DISPATCHED'>('MONITORING_3MIN')
let fallInterval: any = null

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  showToast({ title: 'ELDER FALL SIMULATION ACTIVE', message: '3-minute emergency countdown initiated.', type: 'ALERT' })
  fallTimerSeconds.value = 180
  fallInterval = setInterval(() => {
    if (fallTimerSeconds.value > 0) {
      fallTimerSeconds.value -= 1
      if (fallTimerSeconds.value === 0) {
        fallStatus.value = 'AMBULANCE_DISPATCHED'
        showToast({ title: 'AMBULANCE DISPATCHED', message: 'Emergency medical services notified.', type: 'ALERT' })
      }
    }
  }, 1000)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (fallInterval) clearInterval(fallInterval)
})
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-6 select-none animate-fade-in">
    <div class="industrial-card max-w-xl w-full p-4 md:p-8 border-[#c44a4a] space-y-4 md:space-y-6">
      <div class="flex items-center justify-between pb-3 border-b border-[#c44a4a]">
        <div>
          <span class="font-mono text-[10px] md:text-xs text-[#c44a4a] font-bold tracking-widest">// EMERGENCY AI SIMULATION</span>
          <h3 class="text-base md:text-2xl font-black uppercase text-white">ELDER FALL EMERGENCY DETECTED</h3>
        </div>
        <button @click="emit('close')" class="industrial-btn industrial-btn-outline text-[10px] md:text-xs">
          CLOSE [ESC]
        </button>
      </div>

      <div class="p-4 md:p-6 bg-[#c44a4a]/10 border border-[#c44a4a] space-y-3 md:space-y-4 text-center">
        <div class="font-mono text-xs md:text-sm text-[#c44a4a] font-bold uppercase">CAM-014 (LIVING ROOM) · SHADOWVISION FALL AGENT</div>
        <div class="text-2xl md:text-4xl font-mono font-black text-white">
          00:0{{ Math.floor(fallTimerSeconds / 60) }}:{{ (fallTimerSeconds % 60).toString().padStart(2, '0') }}
        </div>
        <p class="text-[9px] md:text-xs text-[#a0a0a4] font-mono">
          COUNTDOWN TIMER: IF RESIDENT DOES NOT STAND UP BEFORE 00:00:00, AUTOMATIC AMBULANCE & DISPATCH CALLS ARE INITIATED.
        </p>

        <div class="p-2.5 md:p-3 bg-[#0a0a0c] border border-[#1e1e20] text-left font-mono text-[9px] md:text-xs space-y-1.5 md:space-y-2">
          <div class="flex items-center gap-2">
            <span class="live-dot"></span>
            <span class="text-white">STATUS: {{ fallStatus }}</span>
          </div>
          <div class="text-[#3d8b5e]">STATUS: VOICE CALL SENT TO PRIMARY FAMILY MEMBER</div>
          <div class="text-[#3d8b5e]">STATUS: EMERGENCY SMS DISPATCHED WITH GPS COORDINATES</div>
          <div class="text-[#c49a3c]">STATUS: AMBULANCE SERVICES PRE-NOTIFICATION QUEUED</div>
        </div>
      </div>

      <button @click="emit('close')" class="industrial-btn industrial-btn-primary w-full">
        DISMISS SIMULATION & RETURN
      </button>
    </div>
  </div>
</template>
