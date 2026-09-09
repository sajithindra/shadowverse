<script setup lang="ts">
const emit = defineEmits(['openVideoSearch', 'openImpactModal'])

const useCases = [
  {
    id: 'uc-1',
    icon: 'groups',
    title: 'EMPLOYEE SAFETY',
    desc: 'Guards miss incidents. ShadowVision AI agents enforce workplace safety protocols and trigger emergency response the moment an incident occurs.',
    tag: 'SAFETY COMPLIANCE ENFORCED',
    accentColor: '#750d37',
    socialImpact: {
      headline: 'Enforce Workplace Safety Standards — Automatically',
      metrics: [
        { value: '24×7', label: 'AI Safety Watch' },
        { value: '< 3 MIN', label: 'Emergency Response' },
        { value: '100%', label: 'Incident Documented' }
      ],
      benefits: [
        'ShadowVision AI detects safety incidents (falls, collapses, altercations) in real-time across all monitored zones.',
        'Triggers automated emergency dispatch to internal security teams and external responders.',
        'Every incident is auto-logged with video evidence — fully audit-ready for regulatory review.'
      ]
    }
  },
  {
    id: 'uc-2',
    icon: 'domain',
    title: 'OPERATIONAL SECURITY',
    desc: 'No more manual CCTV reviews. ShadowVision AI monitors every access point, server room, and perimeter — and acts the moment a breach occurs.',
    tag: 'REAL-TIME BREACH RESPONSE',
    accentColor: '#3d8b5e',
    socialImpact: {
      headline: 'Secure Operations — Zero Human Oversight Gaps',
      metrics: [
        { value: '< 50ms', label: 'Threat Detection' },
        { value: '12,000+', label: 'Cameras Monitored' },
        { value: '78%', label: 'Guard Cost Reduced' }
      ],
      benefits: [
        'Monitors every entry gate, server room, and restricted zone without fatigue or shift changes.',
        'On detecting unauthorised access, it locks doors, notifies security, and dispatches responders automatically.',
        'ShadowWatch generates timestamped incident reports and forensic clips for compliance and legal purposes.'
      ]
    }
  },
  {
    id: 'uc-3',
    icon: 'inventory_2',
    title: 'ASSET & PERIMETER CONTROL',
    desc: 'Protect critical assets and enforce perimeter boundaries. ShadowVision AI distinguishes authorised personnel from intruders and takes immediate action.',
    tag: 'PERIMETER COMPLIANCE AI',
    accentColor: '#4a7ebb',
    socialImpact: {
      headline: 'Asset Protection & Perimeter Compliance — AI-Enforced',
      metrics: [
        { value: '99.4%', label: 'Detection Accuracy' },
        { value: '< 50ms', label: 'Match Latency' },
        { value: '100%', label: 'Sovereign On-Premise' }
      ],
      benefits: [
        'Identifies blacklisted personnel and enforces no-entry zones across all camera feeds in real-time.',
        'All processing runs on Shadowverse Private AI Cloud — zero data leaves your premises.',
        'Tamper-proof perimeter logs provide defensible audit trails for insurance, legal, and compliance teams.'
      ]
    }
  }
]
</script>

<template>
  <section id="problem" class="py-10 md:py-20 px-4 md:px-12 lg:px-20 border-t border-[#1e1e20] bg-[#0a0a0c] relative">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col items-start mb-8 md:mb-10">
        <div class="section-tag mb-3 text-xs sm:text-sm font-bold">// ENTERPRISE SAFETY & SECURITY USE CASES</div>
        <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.15]">
          HUMAN GUARDS BLINK 15,000 TIMES A DAY.<br/>
          <span style="color: #750d37">SHADOWVISION AI AGENTS NEVER DO.</span>
        </h2>
        <p class="text-[#c8c8cc] text-sm sm:text-base mt-2 leading-relaxed">
          Deploy ShadowVision AI agents to enforce safety protocols, maintain compliance records, and secure your facilities — 24×7 without fatigue or oversight gaps.
        </p>
      </div>

      <!-- Ultra-Minimal, Emotional Redesigned Cards -->
      <div class="grid md:grid-cols-3 gap-5 md:gap-6">
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
