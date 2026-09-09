<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

export interface UseCaseData {
  title: string
  subtitle: string
  badge: string
  helpfulApplication: string
  socialImpact: {
    headline: string
    metrics: { value: string; label: string }[]
    benefits: string[]
  }
  iconType?: string
}

const props = defineProps<{
  useCase: UseCaseData
}>()

const emit = defineEmits(['close', 'openVideoSearch'])

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
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
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 sm:p-6 select-none animate-fade-in overflow-y-auto"
    @click.self="emit('close')"
    role="dialog"
    aria-modal="true"
    aria-labelledby="usecase-impact-modal-title"
  >
    <div class="industrial-card max-w-2xl w-full p-4 md:p-8 border-[#750d37]/60 space-y-6 my-auto relative shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-[#111113]">
      <!-- 2px Brand Top Accent Line -->
      <div class="absolute top-0 left-0 right-0 h-[2px] bg-[#750d37]"></div>

      <!-- Top Header & Badge -->
      <div class="flex items-center justify-between pb-3 border-b border-[#1e1e20] pt-1">
        <div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-[#3d8b5e]"></span>
            <span class="font-mono text-[10px] md:text-xs text-[#750d37] font-bold tracking-widest uppercase">// USE CASE & SOCIAL IMPACT</span>
          </div>
          <h3 id="usecase-impact-modal-title" class="text-lg md:text-2xl font-black uppercase text-white mt-1">
            {{ useCase.title }}
          </h3>
        </div>
        <button @click="emit('close')" class="industrial-btn industrial-btn-outline text-[10px] md:text-xs cursor-pointer">
          CLOSE [ESC]
        </button>
      </div>

      <!-- Helpful Application Box -->
      <div class="p-4 bg-[#0a0a0c] border border-[#1e1e20] space-y-2">
        <div class="text-xs font-mono text-[#3d8b5e] font-bold uppercase tracking-wider flex items-center gap-1.5">
          <svg class="w-4 h-4 text-[#3d8b5e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>HOW THIS HELPS EVERYDAY PEOPLE:</span>
        </div>
        <p class="text-xs md:text-sm text-[#e8e8ea] leading-relaxed">
          {{ useCase.helpfulApplication }}
        </p>
      </div>

      <!-- Social Impact Highlights Card -->
      <div class="industrial-card p-4 md:p-6 bg-[#111113] border-l-4 border-l-[#750d37] space-y-4">
        <div>
          <span class="text-[10px] font-mono text-[#9a1a4e] font-bold tracking-widest uppercase">// MEASURABLE SOCIAL IMPACT</span>
          <h4 class="text-base md:text-lg font-black uppercase text-white mt-0.5">
            {{ useCase.socialImpact.headline }}
          </h4>
        </div>

        <!-- Social Metrics Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div
            v-for="m in useCase.socialImpact.metrics"
            :key="m.label"
            class="p-3 bg-[#0a0a0c] border border-[#1e1e20] text-center"
          >
            <div class="text-lg md:text-xl font-black text-[#3d8b5e] font-mono">{{ m.value }}</div>
            <div class="text-[9px] md:text-[10px] font-mono text-[#88888c] uppercase mt-0.5">{{ m.label }}</div>
          </div>
        </div>

        <!-- Community & Life Benefits Bullet List -->
        <div class="space-y-2 pt-2 border-t border-[#1e1e20]">
          <div class="text-xs font-mono text-white font-bold uppercase">// COMMUNITY & HUMAN BENEFITS:</div>
          <ul class="space-y-1.5 font-mono text-xs text-[#c8c8cc]">
            <li
              v-for="(b, idx) in useCase.socialImpact.benefits"
              :key="idx"
              class="flex items-start gap-2"
            >
              <span class="text-[#3d8b5e] font-bold">✓</span>
              <span>{{ b }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          @click="emit('openVideoSearch'); emit('close')"
          class="industrial-btn industrial-btn-primary w-full text-xs py-2.5 text-center flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <span>TRY AI VIDEO ATTRIBUTE SEARCH DEMO</span>
        </button>
        <button
          @click="emit('close')"
          class="industrial-btn industrial-btn-outline w-full sm:w-auto text-xs py-2.5"
        >
          CLOSE
        </button>
      </div>

    </div>
  </div>
</template>
