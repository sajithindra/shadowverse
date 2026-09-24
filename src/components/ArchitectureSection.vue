<script setup lang="ts">
/**
 * How it works, in four steps.
 *
 * This used to describe the four internal layers in engineering terms — private
 * AI cloud, agent armies, inference stack. That detail now lives in the
 * Scalability Architecture deck, where someone technical can go looking for it.
 * A buyer reading the landing page needs to know what happens, in order.
 */
/** The three product names, in the plainest terms they can be put. */
const names = [
  {
    name: 'Shadowverse',
    role: 'The server',
    detail: 'The box in your building that everything runs on. Buy it once; nothing goes to the cloud.',
    accent: '#750d37',
    icon: 'dns',
  },
  {
    name: 'ShadowWatch',
    role: 'The screen you look at',
    detail: 'Every camera from every branch in one place — live view, playback and reports.',
    accent: '#4a7ebb',
    icon: 'grid_view',
  },
  {
    name: 'ShadowVision',
    role: 'The part that watches',
    detail: 'The AI that actually looks at the feeds, spots what matters and raises the alert.',
    accent: '#3d8b5e',
    icon: 'visibility',
  },
]

const steps = [
  {
    n: '01',
    icon: 'videocam',
    title: 'Your cameras stay',
    detail:
      'Whatever you already have — Hikvision, Dahua, CP Plus, Axis, anything ONVIF. Nothing gets replaced and no new wiring is needed.',
    accent: '#750d37',
  },
  {
    n: '02',
    icon: 'dns',
    title: 'One server in your building',
    detail:
      'The feeds come into a server on your own premises. Footage is never uploaded anywhere, so there is no monthly cloud bill and no outside access.',
    accent: '#4a7ebb',
  },
  {
    n: '03',
    icon: 'visibility',
    title: 'It watches everything',
    detail:
      'Every camera, every hour, at the same level of attention. It looks for the specific things you told it to care about and ignores the rest.',
    accent: '#3d8b5e',
  },
  {
    n: '04',
    icon: 'notifications_active',
    title: 'The right person is told',
    detail:
      'An alert goes to the manager who can act on it, on WhatsApp or the screen in front of them, with the video clip already attached.',
    accent: '#750d37',
  },
]
</script>

<template>
  <section
    id="architecture"
    class="py-12 md:py-24 px-4 md:px-12 lg:px-20 border-t border-[#1e1e20] bg-[#0a0a0c]"
  >
    <div class="max-w-7xl mx-auto">
      <div class="section-tag mb-3 md:mb-4 text-xs sm:text-sm font-bold">// HOW IT WORKS</div>
      <h2
        class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-3 leading-[1.15]"
      >
        FOUR STEPS.<br />
        <span style="color: #750d37">NO NEW CAMERAS.</span>
      </h2>
      <p class="text-[#c8c8cc] text-sm sm:text-base mb-8 md:mb-12 leading-relaxed max-w-2xl">
        Three names, one system. Here is what each one is, and what happens between the camera
        on your wall and an alert on someone's phone.
      </p>

      <!-- Three names, explained before anything else uses them -->
      <div class="grid sm:grid-cols-3 gap-4 md:gap-5 mb-10 md:mb-14">
        <div
          v-for="item in names"
          :key="item.name"
          class="industrial-card bg-[#111113] p-5 border-l-4 shadow-lg"
          :style="{ borderLeftColor: item.accent }"
        >
          <div class="flex items-center gap-2.5 mb-2">
            <span class="material-symbols-outlined text-lg" :style="{ color: item.accent }">{{ item.icon }}</span>
            <h3 class="text-white font-black text-base tracking-tight">{{ item.name }}</h3>
          </div>
          <div class="font-mono text-[11px] font-bold uppercase tracking-wider mb-1.5" :style="{ color: item.accent }">
            {{ item.role }}
          </div>
          <p class="text-[#c8c8cc] text-xs sm:text-sm leading-relaxed">{{ item.detail }}</p>
        </div>
      </div>

      <div class="section-tag mb-3 text-xs sm:text-sm font-bold">// AND HOW THEY FIT TOGETHER</div>

      <ol class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <li
          v-for="step in steps"
          :key="step.n"
          class="industrial-card bg-[#111113] p-5 border-t-4 shadow-lg flex flex-col"
          :style="{ borderTopColor: step.accent }"
        >
          <div class="flex items-center gap-3 mb-3">
            <span class="font-mono text-2xl font-black" :style="{ color: step.accent }">{{ step.n }}</span>
            <span
              class="w-9 h-9 shrink-0 flex items-center justify-center border ml-auto"
              :style="{ backgroundColor: `${step.accent}18`, borderColor: `${step.accent}60` }"
            >
              <span class="material-symbols-outlined text-lg" :style="{ color: step.accent }">{{ step.icon }}</span>
            </span>
          </div>
          <h3 class="text-white font-black text-base tracking-tight mb-1.5">{{ step.title }}</h3>
          <p class="text-[#c8c8cc] text-xs sm:text-sm leading-relaxed">{{ step.detail }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>
