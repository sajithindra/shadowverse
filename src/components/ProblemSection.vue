<script setup lang="ts">
const emit = defineEmits(['openVideoSearch', 'openImpactModal'])

const useCases = [
  {
    id: 'uc-access',
    icon: 'door_open',
    title: 'PEOPLE WHERE THEY SHOULD NOT BE',
    desc: 'Someone walks into the stockroom, the server room or the yard after hours. You know within seconds, not on Monday.',
    tag: 'UNAUTHORISED ACCESS',
    accentColor: '#750d37',
    socialImpact: {
      headline: 'Know the moment someone enters a restricted area',
      metrics: [
        { value: 'Seconds', label: 'To first alert' },
        { value: '24/7', label: 'Every door, every shift' },
        { value: 'Clip', label: 'Attached to every alert' },
      ],
      benefits: [
        'Mark any area as staff-only, after-hours or no-entry. Anyone who walks in triggers an alert with the video clip attached.',
        'Staff faces are recognised, so your own team moving around normally does not set anything off.',
        'Every entry is logged with a timestamp, so you can answer "who was in there and when" without scrubbing footage.',
      ],
    },
  },
  {
    id: 'uc-vip',
    icon: 'person_pin',
    title: 'KNOW YOUR REGULARS BY SIGHT',
    desc: 'A customer who usually shops at your Kochi branch walks into Thrissur. Staff are told before they reach the counter.',
    tag: 'VIP & REPEAT CUSTOMERS',
    accentColor: '#3d8b5e',
    socialImpact: {
      headline: 'Recognise your best customers at any branch',
      metrics: [
        { value: 'All', label: 'Branches linked' },
        { value: 'On entry', label: 'Staff notified' },
        { value: 'Opt-in', label: 'You choose who is listed' },
      ],
      benefits: [
        'Your branches share one customer list. Someone recognised in Kochi is recognised in Thrissur the first time they visit.',
        'Staff get a quiet heads-up on their phone or the counter screen, so a regular is greeted properly instead of queuing unnoticed.',
        'You decide who goes on the list and can remove anyone at any time. Everything stays on your own server.',
      ],
    },
  },
  {
    id: 'uc-theft',
    icon: 'shopping_bag',
    title: 'STOCK THAT WALKS OUT',
    desc: 'Items leaving without being paid for, till irregularities, loading-bay losses. Flagged as it happens, with the footage ready.',
    tag: 'THEFT & SHRINKAGE',
    accentColor: '#4a7ebb',
    socialImpact: {
      headline: 'Catch losses while you can still do something about them',
      metrics: [
        { value: 'Live', label: 'Not next-day review' },
        { value: 'Clip', label: 'Evidence per incident' },
        { value: 'Repeat', label: 'Offenders recognised' },
      ],
      benefits: [
        'Watches tills, shelves, exits and loading bays for the patterns that mean stock is going missing.',
        'Someone who has been flagged before is recognised if they come back, at any of your branches.',
        'Each incident is saved as a short clip with a timestamp, so you have something usable for an insurance claim or a conversation.',
      ],
    },
  },
  {
    id: 'uc-safety',
    icon: 'health_and_safety',
    title: 'SOMEONE GETS HURT',
    desc: 'A fall, a slip, a forklift too close to someone on foot, helmets not worn. Somebody is told straight away.',
    tag: 'WORKPLACE SAFETY',
    accentColor: '#750d37',
    socialImpact: {
      headline: 'Help arrives in minutes, not whenever someone notices',
      metrics: [
        { value: 'Minutes', label: 'To someone responding' },
        { value: 'Logged', label: 'Every incident, with video' },
        { value: 'PPE', label: 'Checked continuously' },
      ],
      benefits: [
        'Spots falls and collapses and alerts your floor supervisor immediately, including in areas nobody is watching.',
        'Flags people without helmets or high-vis, and people walking through vehicle routes.',
        'Builds a proper incident record with video, which is what insurers and safety auditors ask for.',
      ],
    },
  },
  {
    id: 'uc-ops',
    icon: 'insights',
    title: 'WHERE THE DAY GOES',
    desc: 'How long queues get, how long a bay turnaround takes, which machines sit idle. Measured from the cameras you already have.',
    tag: 'STAFF & OPERATIONS',
    accentColor: '#3d8b5e',
    socialImpact: {
      headline: 'Numbers on how the floor actually runs',
      metrics: [
        { value: 'Queues', label: 'Measured by the minute' },
        { value: 'Bays', label: 'Turnaround timed' },
        { value: 'Idle', label: 'Equipment flagged' },
      ],
      benefits: [
        'See when queues build up during the week, so you can put staff where they are actually needed.',
        'Time how long deliveries take to unload and where the hold-ups are.',
        'Counts people, not faces, for this — it is about how the place runs, not about individuals.',
      ],
    },
  },
  {
    id: 'uc-guards',
    icon: 'savings',
    title: 'FEWER SCREENS TO WATCH',
    desc: 'One person can cover what used to take a room of monitors, because they are only shown the moments that matter.',
    tag: 'LOWER GUARDING COST',
    accentColor: '#4a7ebb',
    socialImpact: {
      headline: 'Same coverage, far fewer people staring at screens',
      metrics: [
        { value: '12,000+', label: 'Cameras on one system' },
        { value: 'Alerts', label: 'Instead of live feeds' },
        { value: 'Existing', label: 'Cameras reused' },
      ],
      benefits: [
        'Guards stop watching feeds and start responding to alerts, so one person covers far more ground.',
        'Nothing is missed during shift changes, night shifts or the twentieth hour of a screen.',
        'Works with the cameras and recorders you already own, so there is no replacement cost to justify.',
      ],
    },
  },
]

</script>

<template>
  <section id="problem" class="py-10 md:py-20 px-4 md:px-12 lg:px-20 border-t border-[#1e1e20] bg-[#0a0a0c] relative">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col items-start mb-8 md:mb-10">
        <div class="section-tag mb-3 text-xs sm:text-sm font-bold">// WHAT IT CATCHES</div>
        <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.15]">
          A GUARD BLINKS 15,000 TIMES A DAY.<br/>
          <span style="color: #750d37">THIS DOESN'T.</span>
        </h2>
        <p class="text-[#c8c8cc] text-sm sm:text-base mt-2 leading-relaxed">
          Six things it watches for, on the cameras you already have. Tap any one to see what you get.
        </p>
      </div>

      <!-- Ultra-Minimal, Emotional Redesigned Cards -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        <div
          v-for="uc in useCases"
          :key="uc.id"
          @click="emit('openImpactModal', uc)"
          class="industrial-card p-6 border-t-4 bg-[#111113] flex flex-col justify-between items-center text-center cursor-pointer hover:border-white transition-all group shadow-xl relative overflow-hidden"
          :style="{ borderTopColor: uc.accentColor }"
        >
          <div class="flex flex-col items-center">
            <!-- Icon Circle -->
            <div
              class="w-14 h-14 rounded-full border flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
              :style="{ backgroundColor: `${uc.accentColor}15`, borderColor: `${uc.accentColor}60` }"
            >
              <span class="material-symbols-outlined text-2xl" :style="{ color: uc.accentColor }">{{ uc.icon }}</span>
            </div>

            <!-- Title -->
            <h3 class="text-lg sm:text-xl font-black uppercase text-white tracking-tight mb-2 group-hover:text-[#9a1a4e] transition-colors">
              {{ uc.title }}
            </h3>

            <!-- 1-Sentence Emotional Description -->
            <p class="text-[#c8c8cc] text-xs sm:text-sm font-normal leading-relaxed max-w-xs mb-4">
              {{ uc.desc }}
            </p>
          </div>

          <!-- Bottom Status Pill -->
          <div
            class="px-3 py-1 border text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider rounded-xs w-full text-center"
            :style="{ backgroundColor: `${uc.accentColor}20`, borderColor: uc.accentColor, color: '#ffffff' }"
          >
            {{ uc.tag }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
