<script setup lang="ts">
import ThreeSecurityOrb from './ThreeSecurityOrb.vue'

const emit = defineEmits(['triggerFallTest', 'openVideoSearch'])

import { MAIL_HREF, WHATSAPP_HREF } from '../utils/contact'
</script>

<template>
  <section class="pt-20 pb-12 sm:pt-28 md:pt-32 md:pb-24 px-4 md:px-12 lg:px-20 border-b border-[#1e1e20] bg-transparent relative overflow-hidden">
    <div class="max-w-7xl mx-auto relative z-10">
      <!-- Hero Content Layout with 3D WebGL Orb -->
      <div class="grid lg:grid-cols-12 gap-8 items-center">
        <div class="lg:col-span-7">
          <div class="section-tag mb-3 md:mb-6 text-xs sm:text-sm font-bold">// SOVEREIGN VISION AI FOR ENTERPRISE SECURITY</div>

          <h1 class="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-[1.08] md:leading-[0.95] mb-4 md:mb-6">
            THE <span class="eye-blink-text inline-block" style="color: #750d37">EYE</span> THAT<br/>
            NEVER BLINKS.
          </h1>

          <p class="text-[#c8c8cc] text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-xl mb-6 md:mb-8">
            Shadowverse watches every camera you already own, on servers you control. ShadowWatch centralises 12,000+ feeds; ShadowVision AI agents catch threats, enforce safety rules and write tamper-proof incident logs. Nothing leaves your premises.
          </p>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 mb-4 w-full">
            <a
              :href="WHATSAPP_HREF"
              target="_blank"
              rel="noopener noreferrer"
              class="industrial-btn industrial-btn-primary industrial-btn-lg !bg-[#3d8b5e] !border-[#3d8b5e] hover:!bg-[#2f6e4a] w-full sm:w-auto py-3.5 px-6 text-sm font-bold shadow-lg gap-2.5"
            >
              <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-1 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 2.5 1 3 .8 3.6.8.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/>
              </svg>
              WHATSAPP +91 89218 97800
            </a>
            <a
              :href="MAIL_HREF"
              class="industrial-btn industrial-btn-outline industrial-btn-lg border-[#750d37] text-white w-full sm:w-auto py-3.5 px-6 text-sm font-bold gap-2.5"
            >
              <svg class="w-5 h-5 shrink-0 text-[#9a1a4e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14"/>
                <path d="M3 7l9 6 9-6"/>
              </svg>
              EMAIL THE FOUNDER
            </a>
          </div>
          <p class="text-[#88888c] text-xs sm:text-sm mb-4 md:mb-6">
            You reach the founder directly. Replies within one business day.
            <button
              @click="emit('openVideoSearch')"
              class="text-[#c8c8cc] hover:text-white font-bold underline underline-offset-4 decoration-[#750d37] hover:decoration-white transition-colors cursor-pointer ml-1"
            >
              See capability overview
            </button>
          </p>
        </div>

        <!-- 3D WebGL Security Orb Visualizer -->
        <div class="lg:col-span-5 w-full">
          <ThreeSecurityOrb />
        </div>
      </div>
    </div>

    <!-- FULL WIDTH Key Metric Banner across full width of Hero Section -->
    <div class="max-w-7xl mx-auto pt-8 md:pt-12 relative z-10">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6 w-full">
        <div class="industrial-card p-4 md:p-6 text-center border-t-2 border-t-[#3d8b5e] hover:border-[#3d8b5e] transition-[transform,border-color,box-shadow] duration-300 ease-out bg-[#0a0a0c]">
          <div class="flex justify-center mb-1.5">
            <span class="material-symbols-outlined text-xl sm:text-2xl text-[#3d8b5e]">videocam</span>
          </div>
          <div class="text-xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight">ANY BRAND</div>
          <div class="text-xs sm:text-sm font-mono text-[#3d8b5e] font-bold uppercase tracking-wider mt-1.5">CAMERA COMPATIBLE</div>
        </div>
        <div class="industrial-card p-4 md:p-6 text-center border-t-2 border-t-[#3d8b5e] hover:border-[#3d8b5e] transition-[transform,border-color,box-shadow] duration-300 ease-out bg-[#0a0a0c]">
          <div class="flex justify-center mb-1.5">
            <span class="material-symbols-outlined text-xl sm:text-2xl text-[#3d8b5e]">security</span>
          </div>
          <div class="text-xl sm:text-3xl md:text-4xl font-black text-[#3d8b5e] tracking-tight">100%</div>
          <div class="text-xs sm:text-sm font-mono text-white font-bold uppercase tracking-wider mt-1.5">PRIVATE & LOCAL</div>
        </div>
        <div class="industrial-card p-4 md:p-6 text-center border-t-2 border-t-[#4a7ebb] hover:border-[#4a7ebb] transition-[transform,border-color,box-shadow] duration-300 ease-out bg-[#0a0a0c]">
          <div class="flex justify-center mb-1.5">
            <span class="material-symbols-outlined text-xl sm:text-2xl text-[#4a7ebb]">dns</span>
          </div>
          <div class="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">12,000+</div>
          <div class="text-xs sm:text-sm font-mono text-[#4a7ebb] font-bold uppercase tracking-wider mt-1.5">CAMERAS IN 1 PLATFORM</div>
        </div>
        <div class="industrial-card p-4 md:p-6 text-center border-t-2 border-t-[#750d37] hover:border-[#750d37] transition-[transform,border-color,box-shadow] duration-300 ease-out bg-[#0a0a0c]">
          <div class="flex justify-center mb-1.5">
            <span class="material-symbols-outlined text-xl sm:text-2xl text-[#750d37]">verified_user</span>
          </div>
          <div class="text-xl sm:text-3xl md:text-4xl font-black text-[#750d37] tracking-tight">DPDP</div>
          <div class="text-xs sm:text-sm font-mono text-white font-bold uppercase tracking-wider mt-1.5">ACT 2023 COMPLIANT</div>
        </div>
      </div>

      <!-- Pure Visual Scroll Indicator (Zero Text attached) -->
      <div class="flex items-center justify-center pt-6">
        <a href="#at-a-glance" aria-label="Scroll Down" class="flex flex-col items-center gap-1.5 cursor-pointer group">
          <div class="w-5 h-8 rounded-full border-2 border-[#3d8b5e] group-hover:border-white p-1 flex justify-center transition-colors">
            <div class="w-1 h-2 bg-[#3d8b5e] group-hover:bg-white rounded-full animate-bounce"></div>
          </div>
          <span class="material-symbols-outlined text-sm text-[#3d8b5e] group-hover:text-white animate-pulse">keyboard_arrow_down</span>
        </a>
      </div>
    </div>
  </section>
</template>
