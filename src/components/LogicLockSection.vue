<script setup lang="ts">
/**
 * Integrations.
 *
 * This slot used to hold a Logic Lock heading with no content beneath it while
 * still carrying a nav link. Integrations are what most buyers ask about second
 * — whether it fits the systems they already run — so the space is used for
 * that, with keyless login kept as one of the entries.
 */
const integrations = [
  {
    id: 'hrms',
    icon: 'badge',
    name: 'HR & attendance',
    detail: 'Staff are recognised at the door, so attendance is marked without anyone queuing at a machine. Hours flow into your existing HR system.',
    accent: '#3d8b5e',
  },
  {
    id: 'pos',
    icon: 'point_of_sale',
    name: 'Billing & sales software',
    detail: 'A recognised customer arrives and their purchase history is on the counter screen before they reach it. Till events are matched to what the camera saw.',
    accent: '#4a7ebb',
  },
  {
    id: 'locks',
    icon: 'lock',
    name: 'Face recognition door locks',
    detail: 'Doors open for staff who belong there and stay shut for everyone else. Every entry and refusal is logged with the clip.',
    accent: '#750d37',
  },
  {
    id: 'biometric',
    icon: 'fingerprint',
    name: 'Fingerprint scanners',
    detail: 'Pair a fingerprint with the face at the reader for two checks instead of one, so a borrowed card or a held-open door does not get anyone in.',
    accent: '#3d8b5e',
  },
  {
    id: 'alerts',
    icon: 'chat',
    name: 'WhatsApp & SMS',
    detail: 'Alerts reach the right manager where they already look — no new app to install, no dashboard anyone has to sit in front of.',
    accent: '#4a7ebb',
  },
  {
    id: 'logiclock',
    icon: 'grid_on',
    name: 'Keyless login',
    detail: 'Staff sign in with a position on a grid that changes every time, instead of a password. Nothing to steal, nothing to reset, no hardware token to buy.',
    accent: '#750d37',
  },
]
</script>

<template>
  <section
    id="logiclock"
    class="py-10 md:py-20 px-4 md:px-12 lg:px-20 border-t border-[#1e1e20] bg-[#111113] relative overflow-hidden"
  >
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col items-start mb-8 md:mb-10">
        <div class="section-tag mb-3 text-xs sm:text-sm font-bold">// WORKS WITH WHAT YOU ALREADY RUN</div>
        <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.15] text-white">
          IT PLUGS INTO YOUR<br />
          <span style="color: #750d37">EXISTING SYSTEMS.</span>
        </h2>
        <p class="text-[#c8c8cc] text-sm sm:text-base mt-2 leading-relaxed max-w-2xl">
          Cameras, recorders, door locks, HR and billing — it connects to what is already in the building
          rather than replacing it.
        </p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        <div
          v-for="item in integrations"
          :key="item.id"
          class="industrial-card bg-[#0a0a0c] p-5 border-l-4 shadow-lg"
          :style="{ borderLeftColor: item.accent }"
        >
          <div class="flex items-center gap-3 mb-2.5">
            <span
              class="w-9 h-9 shrink-0 flex items-center justify-center border"
              :style="{ backgroundColor: `${item.accent}18`, borderColor: `${item.accent}60` }"
            >
              <span class="material-symbols-outlined text-lg" :style="{ color: item.accent }">{{ item.icon }}</span>
            </span>
            <h3 class="text-white font-black text-base tracking-tight">{{ item.name }}</h3>
          </div>
          <p class="text-[#c8c8cc] text-xs sm:text-sm leading-relaxed">{{ item.detail }}</p>
        </div>
      </div>

      <p class="text-[#88888c] text-xs sm:text-sm mt-6 font-mono">
        Using something not listed here? Ask — most systems with an API can be connected.
      </p>
    </div>
  </section>
</template>
