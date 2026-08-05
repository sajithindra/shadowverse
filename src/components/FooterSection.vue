<script setup lang="ts">
const emit = defineEmits(['openPrivacy', 'openTerms', 'openDpdpPortal'])
</script>

<template>
  <footer class="py-8 md:py-12 px-4 md:px-12 border-t border-[#1e1e20] bg-[#0a0a0c] font-mono text-xs text-[#c8c8cc]">
    <div class="max-w-7xl mx-auto space-y-6">
      
      <!-- Top Row: Brand & Policy Navigation Links -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-[#1e1e20]">
        <!-- Brand Badge -->
        <div class="flex items-center gap-2.5">
          <span class="font-black tracking-[4px] text-sm text-white uppercase leading-none">SHADOWVERSE</span>
          <span class="px-2 py-0.5 bg-[#750d37]/20 border border-[#750d37] text-[9px] text-[#9a1a4e] font-bold uppercase tracking-wider">
            PRIVATE CLOUD
          </span>
        </div>

        <!-- Policy Navigation Links -->
        <div class="flex flex-wrap items-center justify-center gap-4 text-[11px] md:text-xs">
          <button @click="emit('openPrivacy')" class="hover:text-white transition-colors cursor-pointer">
            PRIVACY POLICY (DPDP ACT 2023)
          </button>
          <span class="text-[#3a3a40]">|</span>
          <button @click="emit('openTerms')" class="hover:text-white transition-colors cursor-pointer">
            TERMS & CONDITIONS
          </button>
          <span class="text-[#3a3a40]">|</span>
          <button @click="emit('openDpdpPortal')" class="text-[#3d8b5e] hover:text-white transition-colors cursor-pointer font-bold">
            DATA PRINCIPAL RIGHTS PORTAL
          </button>
        </div>
      </div>

      <!-- Single Unified Bottom Row: Copyright & Credits -->
      <div class="flex flex-col lg:flex-row items-center justify-between gap-3 text-[10px] md:text-[11px] text-[#88888c]">
        <div>
          © 2026 SHADOWVERSE CLOUD. ALL RIGHTS RESERVED. 100% ON-PREMISE SOVEREIGN SECURITY.
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3">
          <span>IMAGINED BY <strong class="text-white font-bold">SAJITHINDRA</strong></span>
          <span class="text-[#3a3a40]">·</span>
          <span>PROGRAMMED BY <strong class="text-[#9a1a4e] font-bold">SUVRMONX LLP</strong></span>
        </div>
      </div>

    </div>
  </footer>
</template>
