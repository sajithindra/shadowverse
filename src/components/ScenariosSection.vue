<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits(['openImpactModal', 'openVideoSearch'])

const safetyFeatures = [
  {
    icon: 'person_search',
    title: 'THREAT & BLACKLIST IDENTIFICATION',
    desc: 'Real-time facial & attribute matching identifies blacklisted individuals or flagged intruders approaching your perimeter.',
    helpfulApplication: 'Instantly alerts security teams when blacklisted individuals step onto private property or restricted zones.',
    socialImpact: {
      headline: 'Preventing Threats Before Incident Escalation',
      metrics: [
        { value: '< 50ms', label: 'Match Latency' },
        { value: '99.4%', label: 'Identification Accuracy' },
        { value: '100%', label: 'Local On-Premise' }
      ],
      benefits: [
        'Flags known intruders and blacklisted suspects before entry.',
        'Runs matching locally on Shadowverse Private AI Cloud without third-party data leaks.',
        'Logs visual evidence and timestamped camera clips directly into ShadowWatch reports.'
      ]
    }
  },
  {
    icon: 'phone_in_talk',
    title: 'AUTOMATED POLICE & VOICE CALLING',
    desc: 'ShadowVision AI agents trigger immediate phone calls to property owners, security guards, or local police stations.',
    helpfulApplication: 'Ensures critical high-risk incidents get verbal voice escalation even if phone notifications are muted.',
    socialImpact: {
      headline: 'Instant Automated Emergency Dispatch & Response',
      metrics: [
        { value: '< 3 SECS', label: 'Call Connect Time' },
        { value: '24×7', label: 'Active Dispatcher' },
        { value: '0', label: 'Delayed Response' }
      ],
      benefits: [
        'Dials emergency phone contacts automatically during unverified perimeter breaches.',
        'Provides synthesized audio status reports to responding guard personnel.',
        'Prevents break-ins from escalating by alarming intruders with active voice warnings.'
      ]
    }
  },
  {
    icon: 'sms',
    title: 'AUTOMATED SMS & EMERGENCY ALERTS',
    desc: 'Sends high-priority SMS notifications with instant video snapshot links directly to designated cell phones.',
    helpfulApplication: 'Keeps family members and security leads updated on emergency status anywhere in the world.',
    socialImpact: {
      headline: 'Fail-Safe Multi-Channel Emergency Notification',
      metrics: [
        { value: '< 1 SEC', label: 'SMS Delivery' },
        { value: '100%', label: 'Delivery Rate' },
        { value: 'Direct', label: 'Snapshot Link' }
      ],
      benefits: [
        'Delivers SMS alerts even in areas with low mobile data coverage.',
        'Includes verifiable image snapshots and camera IDs in every message.',
        'Allows one-tap emergency action buttons directly from the SMS link.'
      ]
    }
  },
  {
    icon: 'power_settings_new',
    title: 'AMBIENT IOT, AC & LIGHTING CUTOFF',
    desc: 'Executes automated physical actions — switching off AC/HVAC units, turning off lights to isolate intruder zones, or locking access doors.',
    helpfulApplication: 'Contains hazardous perimeter events and cuts energy waste when rooms are vacant or breached.',
    socialImpact: {
      headline: 'Active Physical Threat Isolation & Energy Control',
      metrics: [
        { value: 'Sub-second', label: 'IoT Action Speed' },
        { value: 'Smart', label: 'Zone Isolation' },
        { value: 'Auto', label: 'HVAC Cutoff' }
      ],
      benefits: [
        'Switches off AC units automatically during fire or intruder alerts to stop smoke/movement.',
        'Controls security lighting to disorient intruders or illuminate guard patrol routes.',
        'Locks down smart access gates and doors during verified threat alerts.'
      ]
    }
  },
  {
    icon: 'search',
    title: 'AI VIDEO ATTRIBUTE SEARCH',
    desc: 'Search 12,000+ camera archives by clothing color, vehicle type, or physical traits in seconds.',
    helpfulApplication: 'Instantly locate missing persons, children, or specific intruders across massive campus video feeds.',
    socialImpact: {
      headline: 'Rapid Intelligence Retrieval Across 12,000+ Streams',
      metrics: [
        { value: '< 2 MINS', label: 'Search Time' },
        { value: '98.8%', label: 'Attribute Precision' },
        { value: '12,000+', label: 'Streams Searched' }
      ],
      benefits: [
        'Finds missing elders or children by dress color in seconds.',
        'Saves hundreds of manual review hours across multi-building camera networks.',
        'Keeps video processing 100% private on Shadowverse Private AI Cloud.'
      ]
    }
  }
]

const activeFeatureIndex = ref(0)
const currentFeature = computed(() => safetyFeatures[activeFeatureIndex.value] || safetyFeatures[0]!)
</script>

<template>
  <section id="scenarios" class="py-12 md:py-24 px-4 md:px-12 lg:px-20 border-t border-[#1e1e20] bg-[#0a0a0c]">
    <div class="max-w-7xl mx-auto space-y-8 md:space-y-12">
      <!-- Section Header (Plain English) -->
      <div class="flex flex-col items-start mb-4 md:mb-6">
        <div class="section-tag mb-3 md:mb-4 text-xs sm:text-sm font-bold">// SHADOWVISION AI — OBSERVE, ANALYZE, ACT</div>
        <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.15]">
          VISION AI AGENTS THAT<br/>
          <span style="color: #750d37">TAKE REAL-WORLD ACTION.</span>
        </h2>
        <p class="text-[#c8c8cc] text-sm sm:text-base md:text-lg max-w-2xl mt-3 leading-relaxed">
          ShadowVision AI doesn't just watch — it acts. Calling police, sending SMS alerts, switching off AC/lights, and identifying blacklisted threats across 12,000+ camera feeds.
        </p>
      </div>

      <!-- Interactive Safety Features Split Showcase Layout (Replaces basic 3x2 grid) -->
      <div class="industrial-card p-4 md:p-8 space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1e1e20]">
          <div>
            <div class="section-tag mb-1 text-xs font-bold">// INTERACTIVE ACTION AGENT EXPLORER</div>
            <h3 class="text-lg md:text-2xl font-black uppercase text-white tracking-tight">SHADOWVISION AI ACTION AGENTS</h3>
          </div>
          <div class="flex items-center gap-2 font-mono text-xs">
            <span class="text-[#88888c] hidden sm:inline">SELECT FEATURE:</span>
            <span class="px-2.5 py-1 bg-[#3d8b5e]/15 border border-[#3d8b5e] text-[#3d8b5e] font-bold text-[11px] uppercase">
              {{ activeFeatureIndex + 1 }} OF {{ safetyFeatures.length }} ACTIVE AGENTS
            </span>
          </div>
        </div>

        <div class="grid lg:grid-cols-12 gap-6 items-stretch">
          <!-- LEFT SIDE: Interactive Vertical Navigation Tabs -->
          <div class="lg:col-span-5 flex flex-col gap-2.5">
            <div
              v-for="(agent, idx) in safetyFeatures"
              :key="agent.title"
              @click="activeFeatureIndex = idx"
              class="p-3.5 bg-[#0a0a0c] border transition-all duration-200 cursor-pointer flex items-center justify-between group relative overflow-hidden"
              :class="[
                activeFeatureIndex === idx
                  ? 'border-[#750d37] bg-[#750d37]/10 shadow-lg ring-1 ring-[#750d37]'
                  : 'border-[#1e1e20] hover:border-[#750d37]/50 hover:bg-[#111113]'
              ]"
            >
              <!-- Active Left Border Accent -->
              <div
                v-if="activeFeatureIndex === idx"
                class="absolute left-0 top-0 bottom-0 w-1 bg-[#750d37]"
              ></div>

              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 border flex items-center justify-center font-mono text-xs shrink-0 transition-colors"
                  :class="activeFeatureIndex === idx ? 'bg-[#750d37] border-[#750d37] text-white font-bold' : 'bg-[#111113] border-[#1e1e20] text-[#88888c] group-hover:text-white'"
                >
                  <span class="material-symbols-outlined text-base">{{ agent.icon || 'shield' }}</span>
                </div>
                <div>
                  <h4
                    class="text-xs md:text-sm font-bold uppercase transition-colors"
                    :class="activeFeatureIndex === idx ? 'text-white' : 'text-[#c8c8cc] group-hover:text-white'"
                  >
                    {{ agent.title }}
                  </h4>
                  <p class="text-[10px] text-[#88888c] line-clamp-1 font-mono mt-0.5">{{ agent.desc }}</p>
                </div>
              </div>

              <span
                class="material-symbols-outlined text-sm transition-transform duration-200 shrink-0"
                :class="activeFeatureIndex === idx ? 'text-[#750d37] translate-x-1' : 'text-[#88888c] group-hover:text-white'"
              >
                chevron_right
              </span>
            </div>
          </div>

          <!-- RIGHT SIDE: Detailed Interactive Feature Console Panel -->
          <div class="lg:col-span-7 industrial-card p-5 md:p-6 bg-[#0a0a0c] border-[#750d37]/50 flex flex-col justify-between space-y-6 relative">
            <div class="space-y-4">
              <!-- Top Header Badge & Navigation Pill -->
              <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1e1e20] font-mono text-xs">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-lg text-[#750d37]">{{ currentFeature.icon || 'shield' }}</span>
                  <span class="text-[#750d37] font-bold tracking-wider text-xs">// FEATURE SPECIFICATION</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <button
                    @click="activeFeatureIndex = (activeFeatureIndex - 1 + safetyFeatures.length) % safetyFeatures.length"
                    class="p-1 border border-[#1e1e20] bg-[#111113] text-[#88888c] hover:text-white hover:border-[#750d37] transition-all cursor-pointer"
                    title="Previous Feature"
                  >
                    <span class="material-symbols-outlined text-sm block">chevron_left</span>
                  </button>
                  <span class="text-[10px] text-[#88888c] px-2 font-mono">{{ activeFeatureIndex + 1 }} / {{ safetyFeatures.length }}</span>
                  <button
                    @click="activeFeatureIndex = (activeFeatureIndex + 1) % safetyFeatures.length"
                    class="p-1 border border-[#1e1e20] bg-[#111113] text-[#88888c] hover:text-white hover:border-[#750d37] transition-all cursor-pointer"
                    title="Next Feature"
                  >
                    <span class="material-symbols-outlined text-sm block">chevron_right</span>
                  </button>
                </div>
              </div>

              <!-- Feature Title & Description -->
              <div>
                <h3 class="text-xl md:text-2xl font-black uppercase text-white tracking-tight mb-2">
                  {{ currentFeature.title }}
                </h3>
                <p class="text-xs md:text-sm text-[#c8c8cc] leading-relaxed">
                  {{ currentFeature.desc }}
                </p>
              </div>

              <!-- Helpful Application Highlight Box -->
              <div class="p-3.5 bg-[#111113] border border-[#1e1e20] space-y-1 font-mono">
                <div class="flex items-center gap-1.5 text-xs text-[#3d8b5e] font-bold uppercase">
                  <span class="material-symbols-outlined text-sm">verified_user</span>
                  <span>// REAL-WORLD HELPFUL APPLICATION</span>
                </div>
                <p class="text-xs text-[#e8e8ea] leading-relaxed">
                  {{ currentFeature.helpfulApplication }}
                </p>
              </div>

              <!-- Social Impact Metrics Box -->
              <div v-if="currentFeature.socialImpact" class="space-y-2 font-mono">
                <div class="text-[10px] text-[#88888c] uppercase font-bold tracking-wider">
                  // IMPACT METRICS & PERFORMANCE
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <div
                    v-for="m in currentFeature.socialImpact.metrics"
                    :key="m.label"
                    class="p-2 bg-[#111113] border border-[#1e1e20] text-center"
                  >
                    <div class="text-sm md:text-base font-black text-white">{{ m.value }}</div>
                    <div class="text-[9px] text-[#3d8b5e] font-bold uppercase mt-0.5">{{ m.label }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Bar -->
            <div class="pt-4 border-t border-[#1e1e20] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                @click="emit('openImpactModal', currentFeature)"
                class="industrial-btn industrial-btn-primary py-3 px-6 text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>EXPLORE SOCIAL IMPACT DEMO</span>
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
              <span class="text-[10px] font-mono text-[#88888c] text-center sm:text-right">
                100% PRIVATE LOCAL PROCESSING
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
