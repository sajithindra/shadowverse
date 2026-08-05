<script setup lang="ts">
import { useToast } from '../composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none select-none">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="pointer-events-auto p-3 bg-[#0a0a0c] border border-[#1e1e20] shadow-2xl font-mono text-xs space-y-1 animate-fade-in"
      :class="{
        'border-l-4 border-l-[#3d8b5e]': t.type === 'SUCCESS',
        'border-l-4 border-l-[#750d37]': t.type === 'ALERT',
        'border-l-4 border-l-[#c49a3c]': t.type === 'WARNING',
        'border-l-4 border-l-[#4a7ebb]': t.type === 'INFO',
      }"
    >
      <div class="flex items-center justify-between">
        <span
          class="font-bold tracking-widest uppercase text-[10px]"
          :class="{
            'text-[#3d8b5e]': t.type === 'SUCCESS',
            'text-[#750d37]': t.type === 'ALERT',
            'text-[#c49a3c]': t.type === 'WARNING',
            'text-[#4a7ebb]': t.type === 'INFO',
          }"
        >
          // {{ t.title }}
        </span>
        <button
          @click="removeToast(t.id)"
          class="text-[#555558] hover:text-white text-[10px] uppercase font-bold"
        >
          [X]
        </button>
      </div>
      <p class="text-[#e8e8ea] text-[11px] leading-snug">{{ t.message }}</p>
    </div>
  </div>
</template>
