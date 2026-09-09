<script setup lang="ts">
import { FOUNDER_EMAIL, MAIL_HREF, WHATSAPP_DISPLAY, WHATSAPP_HREF } from '../utils/contact'
</script>

<template>
  <section id="contact" class="py-12 md:py-24 px-4 md:px-12 lg:px-20 border-t border-[#1e1e20] bg-[#111113] relative overflow-hidden">
    <div class="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 relative z-10">
      <div class="section-tag justify-center text-xs sm:text-sm font-bold">// DEPLOYMENT READY</div>
      <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.1]">
        READY TO DEPLOY YOUR<br/>
        <span style="color: #750d37">SOVEREIGN PRIVATE CLOUD?</span>
      </h2>
      <p class="text-[#c8c8cc] text-sm sm:text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
        Own your data. Protect your premises. Eliminate human surveillance errors with 24×7×365 vision AI agents.
      </p>

      <!-- Two direct lines to the founder: WhatsApp and email. Each shows exactly where it goes. -->
      <div class="grid sm:grid-cols-2 gap-3 md:gap-4 max-w-2xl mx-auto pt-2 md:pt-4 text-left">
        <a
          :href="WHATSAPP_HREF"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-action group border-[#3d8b5e] hover:bg-[#3d8b5e]/10 focus-visible:ring-[#3d8b5e]"
        >
          <svg class="w-7 h-7 shrink-0 text-[#3d8b5e]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-1 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 2.5 1 3 .8 3.6.8.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/>
          </svg>
          <span class="min-w-0">
            <span class="block text-sm sm:text-base font-black uppercase tracking-wide text-white">Chat on WhatsApp</span>
            <span class="block text-xs sm:text-sm font-mono text-[#c8c8cc] group-hover:text-white transition-colors">{{ WHATSAPP_DISPLAY }}</span>
          </span>
        </a>

        <a
          :href="MAIL_HREF"
          class="contact-action group border-[#750d37] hover:bg-[#750d37]/15 focus-visible:ring-[#750d37]"
        >
          <svg class="w-7 h-7 shrink-0 text-[#9a1a4e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="0"/>
            <path d="M3 7l9 6 9-6"/>
          </svg>
          <span class="min-w-0">
            <span class="block text-sm sm:text-base font-black uppercase tracking-wide text-white">Email the founder</span>
            <span class="block text-xs sm:text-sm font-mono text-[#c8c8cc] group-hover:text-white transition-colors truncate">{{ FOUNDER_EMAIL }}</span>
          </span>
        </a>
      </div>

      <p class="text-[#88888c] text-xs sm:text-sm">
        No forms, no sales queue. You reach the founder directly and hear back within one business day.
      </p>
    </div>
  </section>
</template>

<style scoped>
.contact-action {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-width: 1px;
  background-color: #0a0a0b;
  transition: background-color 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  outline: none;
}
.contact-action:hover { transform: translateY(-2px); }
.contact-action:active { transform: scale(0.98); }
.contact-action:focus-visible { box-shadow: 0 0 0 2px #111113, 0 0 0 4px currentColor; }
@media (prefers-reduced-motion: reduce) {
  .contact-action { transition: background-color 0.2s ease; }
  .contact-action:hover, .contact-action:active { transform: none; }
}
</style>
