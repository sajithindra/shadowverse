<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits(['close'])

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
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 select-none animate-fade-in">
    <div class="industrial-card max-w-3xl w-full p-4 md:p-8 border-[#750d37] space-y-4 md:space-y-6 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between pb-3 border-b border-[#1e1e20]">
        <div>
          <span class="font-mono text-[10px] md:text-xs text-[#750d37] font-bold tracking-widest">// LEGAL & SOVEREIGN TERMS</span>
          <h3 class="text-base md:text-2xl font-black uppercase text-white">TERMS & CONDITIONS OF SERVICE</h3>
        </div>
        <button @click="emit('close')" class="industrial-btn industrial-btn-outline text-[10px] md:text-xs">
          CLOSE [ESC]
        </button>
      </div>

      <div class="space-y-4 text-xs md:text-sm text-[#e8e8ea] font-sans leading-relaxed">
        <div class="p-3.5 bg-[#0a0a0c] border border-[#1e1e20] space-y-1.5">
          <div class="font-mono text-xs font-bold text-white uppercase">1. SOVEREIGN DEPLOYMENT & HARDWARE LICENSE</div>
          <p class="text-[#a0a0a4] text-xs leading-relaxed">
            ShadowVerse private cloud software is licensed exclusively for on-premise installation on approved Ubuntu / Ceph hardware clusters. The licensee maintains absolute control over server physical security and stream credentials.
          </p>
        </div>

        <div class="p-3.5 bg-[#0a0a0c] border border-[#1e1e20] space-y-1.5">
          <div class="font-mono text-xs font-bold text-white uppercase">2. SHADOWWATCH 12,000 STREAM CAPACITY</div>
          <p class="text-[#a0a0a4] text-xs leading-relaxed">
            ShadowWatch video ingestion performance relies on dedicated NVDEC hardware decoding. System Commanders are responsible for maintaining bandwidth headroom on internal local networks (LAN/VLAN).
          </p>
        </div>

        <div class="p-3.5 bg-[#0a0a0c] border border-[#1e1e20] space-y-1.5">
          <div class="font-mono text-xs font-bold text-white uppercase">3. EMERGENCY ALERT DISCLAIMER</div>
          <p class="text-[#a0a0a4] text-xs leading-relaxed">
            ShadowVision AI emergency alerts (elder fall detection, washroom timeout monitoring, unauthorized entry) are designed as supplementary vision AI assistance tools. They are configured to trigger automated telephony and SMS dispatches as set by the System Commander.
          </p>
        </div>

        <div class="p-3.5 bg-[#0a0a0c] border border-[#1e1e20] space-y-1.5">
          <div class="font-mono text-xs font-bold text-white uppercase">4. INTELLECTUAL PROPERTY & ATTRIBUTION</div>
          <p class="text-[#a0a0a4] text-xs leading-relaxed">
            Architecture Vision imagined by Sajithindra. Engineering & Agentic Vision Systems programmed by Suvrmonx LLP. All rights reserved.
          </p>
        </div>
      </div>

      <div class="pt-3 border-t border-[#1e1e20] flex items-center justify-between font-mono text-[10px] text-[#555558]">
        <span>TERMS VERSION: 2026.1 SOVEREIGN</span>
        <span class="text-[#3d8b5e]">SUVRMONX LLP LICENSED</span>
      </div>
    </div>
  </div>
</template>
