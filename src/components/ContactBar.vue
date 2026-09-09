<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { MAIL_HREF, WHATSAPP_HREF } from '../utils/contact'

// Mobile-only sticky contact bar. Shows once the hero CTAs have scrolled away,
// hides again once the contact section (or anything below it) is on screen.
const visible = ref(false)

function update() {
  const contact = document.getElementById('contact')
  const pastHero = window.scrollY > 640
  const contactOnScreen = contact ? contact.getBoundingClientRect().top < window.innerHeight : false
  visible.value = pastHero && !contactOnScreen
}

onMounted(() => {
  update()
  window.addEventListener('scroll', update, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', update))
</script>

<template>
  <Transition name="bar">
    <div
      v-if="visible"
      class="lg:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-2 gap-px bg-[#1e1e20] border-t border-[#1e1e20] pb-[env(safe-area-inset-bottom)]"
      role="region"
      aria-label="Contact the founder"
    >
      <a
        :href="WHATSAPP_HREF"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-center gap-2 py-3.5 bg-[#3d8b5e] text-white font-mono font-bold text-xs uppercase tracking-widest active:bg-[#2f6e4a]"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-1 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 2.5 1 3 .8 3.6.8.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/>
        </svg>
        WhatsApp
      </a>
      <a
        :href="MAIL_HREF"
        class="flex items-center justify-center gap-2 py-3.5 bg-[#111113] text-white font-mono font-bold text-xs uppercase tracking-widest active:bg-[#750d37]/30"
      >
        <svg class="w-5 h-5 text-[#9a1a4e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14"/>
          <path d="M3 7l9 6 9-6"/>
        </svg>
        Email
      </a>
    </div>
  </Transition>
</template>

<style scoped>
.bar-enter-active, .bar-leave-active { transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease; }
.bar-enter-from, .bar-leave-to { transform: translateY(100%); opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .bar-enter-active, .bar-leave-active { transition: opacity 0.2s ease; }
  .bar-enter-from, .bar-leave-to { transform: none; }
}
</style>
