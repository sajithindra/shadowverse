<script setup lang="ts">
import AttentionChart from './AttentionChart.vue'
import ImpactVisuals from './ImpactVisuals.vue'
const comparisons = [
  {
    icon: 'videocam',
    feature: 'YOUR CAMERAS',
    traditional: 'Most systems want you to replace the cameras first.',
    shadowvision: 'Works with the cameras and recorders you already own — Hikvision, Dahua, CP Plus, Axis and anything ONVIF.',
    metric: 'NOTHING TO REPLACE',
  },
  {
    icon: 'lock',
    feature: 'WHERE FOOTAGE GOES',
    traditional: 'Video is uploaded to someone else\'s cloud.',
    shadowvision: 'Stays on a server in your building. Nothing is uploaded, so there is no monthly cloud bill and no outside access.',
    metric: 'STAYS ON SITE',
  },
  {
    icon: 'speed',
    feature: 'HOW FAST YOU KNOW',
    traditional: 'Someone notices later, or finds it on playback the next day.',
    shadowvision: 'The right manager is alerted within seconds, with the clip attached.',
    metric: 'SECONDS, NOT DAYS',
  },
  {
    icon: 'visibility',
    feature: 'WHAT GETS MISSED',
    traditional: 'Attention drops sharply after about twenty minutes of watching screens.',
    shadowvision: 'Watches every camera at the same rate at 3am as at 9am.',
    metric: 'NOTHING SLIPS PAST',
  },
  {
    icon: 'dns',
    feature: 'HOW MANY CAMERAS',
    traditional: 'One person can realistically follow four to eight screens.',
    shadowvision: 'Up to 12,000 cameras across every branch on one system.',
    metric: 'ALL OF THEM',
  },
  {
    icon: 'savings',
    feature: 'WHAT IT COSTS TO RUN',
    traditional: 'Three guard shifts plus relief cover, every month.',
    shadowvision: 'Guards respond to alerts instead of watching feeds, so the same team covers far more.',
    metric: 'UP TO 78% LESS',
  },
]

</script>

<template>
  <section id="facts" class="py-12 md:py-24 px-4 md:px-12 lg:px-20 border-t border-[#1e1e20] bg-[#111113]">
    <div class="max-w-7xl mx-auto space-y-8 md:space-y-12">
      <div class="flex flex-col items-start">
        <div class="section-tag mb-3 md:mb-4 text-xs sm:text-sm font-bold">// SIDE BY SIDE</div>
        <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.15]">
          WHAT YOU HAVE NOW<br/>
          <span style="color: #750d37">VERSUS WHAT YOU COULD HAVE..</span>
        </h2>
        <p class="text-[#c8c8cc] text-sm sm:text-base md:text-lg max-w-3xl mt-3 leading-relaxed">
          The same cameras, the same building. The difference is whether anything is actually watching them.
        </p>

      <!-- Figures first: they carry what the rows below spell out -->
      <div class="mt-8 md:mt-10 space-y-4 md:space-y-6">
        <AttentionChart />
        <ImpactVisuals />
      </div>
      </div>

      <!-- Feature-by-Feature Comparison Grid -->
      <div class="space-y-4">
        <!-- Comparison Header Banners (Desktop) -->
        <div class="hidden md:grid md:grid-cols-12 gap-4 font-mono text-xs font-bold uppercase tracking-wider px-2">
          <div class="md:col-span-3 text-[#88888c]">// </div>
          <div class="md:col-span-4 text-[#c44a4a] flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-[#c44a4a]"></span>
            <span>ORDINARY CCTV</span>
          </div>
          <div class="md:col-span-5 text-[#3d8b5e] flex items-center gap-1.5 justify-between">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-[#3d8b5e] animate-pulse"></span>
              <span>WITH SHADOWVERSE</span>
            </div>
            <span class="text-[10px] text-[#3d8b5e] bg-[#3d8b5e]/10 px-2 py-0.5 border border-[#3d8b5e]/30">BENCHMARK</span>
          </div>
        </div>

        <!-- Comparison Feature Cards -->
        <div
          v-for="c in comparisons"
          :key="c.feature"
          class="industrial-card p-4 md:p-5 transition-[transform,border-color,box-shadow] duration-300 ease-out hover:border-[#750d37]"
        >
          <div class="grid md:grid-cols-12 gap-3 md:gap-4 items-center">
            <!-- Feature Label & Metric Tag -->
            <div class="md:col-span-3 flex flex-row md:flex-col items-center md:items-start justify-between gap-2 border-b md:border-b-0 border-[#1e1e20] pb-2 md:pb-0">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-base text-[#750d37]">{{ c.icon }}</span>
                <span class="font-mono text-xs font-bold text-white uppercase tracking-wide">{{ c.feature }}</span>
              </div>
              <span class="px-2 py-0.5 bg-[#750d37]/20 border border-[#750d37]/60 text-[9px] font-mono text-[#9a1a4e] font-bold tracking-widest uppercase shrink-0">
                {{ c.metric }}
              </span>
            </div>

            <!-- Current System Box -->
            <div class="md:col-span-4 p-3 bg-[#0a0a0c] border-l-2 border-l-[#c44a4a] border border-[#1e1e20] space-y-1">
              <div class="text-[9px] font-mono text-[#c44a4a] font-bold uppercase tracking-wider md:hidden">// ORDINARY CCTV</div>
              <p class="text-xs text-[#c8c8cc] leading-relaxed font-mono">
                {{ c.traditional }}
              </p>
            </div>

            <!-- ShadowVision AI System Box -->
            <div class="md:col-span-5 p-3 bg-[#0a0a0c] border-l-2 border-l-[#3d8b5e] border border-[#1e1e20] space-y-1">
              <div class="text-[9px] font-mono text-[#3d8b5e] font-bold uppercase tracking-wider md:hidden">// SHADOWVISION AI SYSTEM</div>
              <div class="flex items-start gap-2">
                <svg class="w-4 h-4 text-[#3d8b5e] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
                </svg>
                <p class="text-xs text-white leading-relaxed font-mono font-semibold">
                  {{ c.shadowvision }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="industrial-card p-4 md:p-6 bg-[#0a0a0c] flex flex-col md:flex-row items-center justify-between gap-4 border-t-2 border-t-[#750d37]">
        <div class="flex items-center gap-3">
          <div class="text-[11px] md:text-sm font-mono text-[#e8e8ea] leading-relaxed">
            Want the numbers for your own site? Tell us how many cameras and branches you have.
          </div>
        </div>
        <a href="#contact" class="industrial-btn industrial-btn-primary shrink-0 w-full sm:w-auto text-center">
          GET A COSTING
        </a>
      </div>
    </div>
  </section>
</template>
