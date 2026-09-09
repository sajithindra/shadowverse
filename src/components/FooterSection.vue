<script setup lang="ts">
const emit = defineEmits(['openPrivacy', 'openTerms', 'openDpdpPortal', 'openCctvPresentation'])
</script>

<template>
  <footer class="relative border-t border-[#1e1e20] bg-[#0a0a0c] font-mono text-xs text-[#c8c8cc] overflow-hidden select-none">
    <!-- Top 2px Sovereign Brand Accent Line -->
    <div class="h-[2px] w-full bg-[#750d37]"></div>

    <div class="max-w-7xl mx-auto px-4 md:px-12 py-10 md:py-14 space-y-10">
      
      <!-- Main 4-Column Industrial Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 pb-8 border-b border-[#1e1e20]">
        
        <!-- COL 1: Brand & Sovereign Identity (lg:col-span-4) -->
        <div class="lg:col-span-4 space-y-4">
          <div class="flex items-center gap-2.5">
            <span class="font-black tracking-[4px] text-lg md:text-xl text-white uppercase leading-none">
              SHADOWVERSE
            </span>
            <span class="px-2 py-0.5 bg-[#750d37]/20 border border-[#750d37] text-[10px] text-[#9a1a4e] font-bold uppercase tracking-wider">
              SOVEREIGN CLOUD
            </span>
          </div>

          <p class="text-xs text-[#a0a0a4] leading-relaxed font-sans">
            Shadowverse is the Sovereign Private AI Cloud powering ShadowWatch (12,000+ camera management) and ShadowVision AI (autonomous action agents) — 100% on-premise, zero public cloud dependency.
          </p>

          <!-- Live Status Telemetry Pill -->
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-[#111113] border border-[#1e1e20] text-[10px] font-bold text-[#3d8b5e]">
            <span class="w-2 h-2 rounded-full bg-[#3d8b5e] animate-pulse"></span>
            <span>SYSTEM STATUS: 100% PRIVATE LOCAL SERVER ACTIVE</span>
          </div>
        </div>

        <!-- COL 2: Ecosystem Navigation (lg:col-span-3) -->
        <div class="lg:col-span-3 space-y-3">
          <div class="text-xs text-[#750d37] font-bold uppercase tracking-widest pb-1 border-b border-[#1e1e20]">
            // ECOSYSTEM NAVIGATION
          </div>
          <ul class="space-y-2 text-xs font-semibold">
            <li>
              <a href="/#problem" class="text-[#a0a0a4] hover:text-white transition-colors flex items-center gap-1.5">
                <span class="text-[#750d37] font-bold">01.</span>
                <span>PROBLEM & BLINDSPOTS</span>
              </a>
            </li>
            <li>
              <a href="/#facts" class="text-[#a0a0a4] hover:text-white transition-colors flex items-center gap-1.5">
                <span class="text-[#3d8b5e] font-bold">02.</span>
                <span>HUMAN VS VISION AI</span>
              </a>
            </li>
            <li>
              <a href="/#architecture" class="text-[#a0a0a4] hover:text-white transition-colors flex items-center gap-1.5">
                <span class="text-[#4a7ebb] font-bold">03.</span>
                <span>4-LAYER ECOSYSTEM</span>
              </a>
            </li>
            <li>
              <a href="/#shadowwatch" class="text-[#a0a0a4] hover:text-white transition-colors flex items-center gap-1.5">
                <span class="text-[#750d37] font-bold">04.</span>
                <span>SHADOWWATCH FEEDS</span>
              </a>
            </li>
            <li>
              <a href="/#logiclock" class="text-[#a0a0a4] hover:text-white transition-colors flex items-center gap-1.5">
                <span class="text-[#4a7ebb] font-bold">05.</span>
                <span>LOGIC LOCK AUTHENTICATION</span>
              </a>
            </li>
            <li>
              <a href="/#scenarios" class="text-[#a0a0a4] hover:text-white transition-colors flex items-center gap-1.5">
                <span class="text-[#3d8b5e] font-bold">06.</span>
                <span>SHADOWVISION AI AGENTS</span>
              </a>
            </li>
            <li>
              <a
                href="/cctv-presentation/1"
                @click.prevent="emit('openCctvPresentation')"
                class="text-[#e02870] hover:text-white transition-colors flex items-center gap-1.5 font-bold"
              >
                <span class="text-[#e02870] font-bold">07.</span>
                <span>VISIONSCAN CCTV PRESENTATION</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- COL 3: Statutory Framework & Legal (lg:col-span-3) -->
        <div class="lg:col-span-3 space-y-3">
          <div class="text-xs text-[#3d8b5e] font-bold uppercase tracking-widest pb-1 border-b border-[#1e1e20]">
            // COMPLIANCE & PRESENTATIONS
          </div>
          <div class="space-y-2.5 text-xs">
            <a
              href="/cctv-presentation/1"
              @click.prevent="emit('openCctvPresentation')"
              class="w-full text-left p-2.5 bg-[#9a1a4e]/20 border border-[#e02870] text-white hover:bg-[#9a1a4e]/40 transition-[background-color,border-color] duration-200 ease-out block font-mono text-[11px] cursor-pointer shadow-md"
            >
              <div class="font-black text-[#e02870] uppercase flex items-center gap-1.5">
                <span class="material-symbols-outlined text-base text-[#e02870]">visibility</span>
                <span>CCTV PRESENTATION</span>
              </div>
              <div class="text-[9px] text-[#c8c8cc] mt-0.5 font-sans">VISIONSCAN KANAD SHIELD 2026</div>
            </a>

            <button
              @click="emit('openPrivacy')"
              class="w-full text-left p-2 bg-[#111113] border border-[#1e1e20] hover:border-[#750d37] text-[#c8c8cc] hover:text-white transition-[border-color,color] duration-200 ease-out block font-mono text-[11px] cursor-pointer"
            >
              <div class="font-bold text-white uppercase">PRIVACY POLICY</div>
              <div class="text-[9px] text-[#88888c] mt-0.5">DPDP ACT 2023 (ACT 22 OF 2023)</div>
            </button>

            <button
              @click="emit('openTerms')"
              class="w-full text-left p-2 bg-[#111113] border border-[#1e1e20] hover:border-[#4a7ebb] text-[#c8c8cc] hover:text-white transition-[border-color,color] duration-200 ease-out block font-mono text-[11px] cursor-pointer"
            >
              <div class="font-bold text-white uppercase">TERMS & CONDITIONS</div>
              <div class="text-[9px] text-[#88888c] mt-0.5">OPERATOR SYSTEM LICENSE</div>
            </button>

            <button
              @click="emit('openDpdpPortal')"
              class="w-full text-left p-2 bg-[#750d37]/15 border border-[#750d37] text-white hover:bg-[#750d37]/30 transition-[background-color,border-color] duration-200 ease-out block font-mono text-[11px] cursor-pointer"
            >
              <div class="font-bold text-[#3d8b5e] uppercase">DATA PROTECTION PORTAL</div>
              <div class="text-[9px] text-[#c8c8cc] mt-0.5">DATA PRINCIPAL RIGHTS HANDLER</div>
            </button>
          </div>
        </div>

        <!-- COL 4: Direct Support & Contact (lg:col-span-2) -->
        <div class="lg:col-span-2 space-y-3">
          <div class="text-xs text-[#4a7ebb] font-bold uppercase tracking-widest pb-1 border-b border-[#1e1e20]">
            // CONTACT
          </div>
          <div class="space-y-2 text-xs">
            <div>
              <span class="text-[9px] text-[#88888c] block uppercase">WHATSAPP:</span>
              <a
                href="https://wa.me/918921897800"
                target="_blank"
                rel="noopener noreferrer"
                class="text-[#3d8b5e] hover:text-white font-bold transition-colors block text-[11px] truncate"
              >
                +91 89218 97800
              </a>
            </div>
            <div>
              <span class="text-[9px] text-[#88888c] block uppercase">EMAIL:</span>
              <a
                href="mailto:founder@shadowverse.in"
                class="text-[#4a7ebb] hover:text-white font-bold transition-colors block text-[11px] truncate"
              >
                founder@shadowverse.in
              </a>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom Credits & Copyright Row -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#88888c] font-mono pt-2">
        <div class="text-center sm:text-left text-[11px]">
          © 2026 <strong class="text-white font-bold">SHADOWVERSE CLOUD</strong>. ALL RIGHTS RESERVED.
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3 text-[11px]">
          <span class="px-2.5 py-1 bg-[#111113] border border-[#1e1e20]">
            IMAGINED BY <strong class="text-white font-black">SAJITHINDRA</strong>
          </span>
          <span class="px-2.5 py-1 bg-[#111113] border border-[#1e1e20]">
            PROGRAMMED BY <strong class="text-[#9a1a4e] font-black">SURVMONX LLP</strong>
          </span>
        </div>
      </div>

    </div>
  </footer>
</template>
