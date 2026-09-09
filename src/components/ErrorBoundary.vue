<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const errorMessage = ref<string>('')
const errorDetails = ref<string>('')

onErrorCaptured((err, instance, info) => {
  console.error('[ERROR BOUNDARY] Caught component error:', err, info)
  hasError.value = true
  errorMessage.value = err instanceof Error ? err.message : String(err)
  errorDetails.value = info || 'Vue Component Lifecycle Failure'
  return false // Prevent error propagation
})

function retry() {
  hasError.value = false
  errorMessage.value = ''
  errorDetails.value = ''
  window.location.reload()
}
</script>

<template>
  <div v-if="hasError" class="p-6 my-6 bg-[#0a0a0c] border-2 border-[#c44a4a] industrial-card space-y-4 max-w-2xl mx-auto font-mono">
    <div class="flex items-center gap-2 pb-3 border-b border-[#c44a4a]">
      <span class="w-3 h-3 rounded-full bg-[#c44a4a] animate-ping"></span>
      <span class="text-xs text-[#c44a4a] font-bold tracking-widest uppercase">// SYSTEM EXCEPTION CAUGHT</span>
    </div>

    <div class="space-y-2">
      <h3 class="text-base font-black text-white uppercase">RECOVERABLE APPLICATION ERROR</h3>
      <p class="text-xs text-[#e8e8ea] leading-relaxed">
        {{ errorMessage || 'A runtime component rendering error occurred.' }}
      </p>
      <div class="p-2.5 bg-[#111113] border border-[#1e1e20] text-[10px] text-[#88888c]">
        CONTEXT: {{ errorDetails }}
      </div>
    </div>

    <div class="flex items-center gap-3 pt-2">
      <button @click="retry" class="industrial-btn industrial-btn-primary text-xs py-2 px-4 cursor-pointer">
        RELOAD & RECOVER SESSION
      </button>
    </div>
  </div>

  <slot v-else></slot>
</template>
