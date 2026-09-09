<script setup lang="ts">
const flywheelSteps = [
  {
    step: '01',
    title: 'City CCTV Ingest',
    metric: '120k+ FPS',
    icon: 'videocam',
    desc: 'High-density Ahmedabad junctions, dust storms, rain & night headlight glare.',
    color: '#e02870',
  },
  {
    step: '02',
    title: 'Hard-Negative Miner',
    metric: '<15ms Auto-Filter',
    icon: 'filter_alt',
    desc: 'Auto-captures occluded plates & ambiguous frames (<75% confidence score).',
    color: '#fbbf24',
  },
  {
    step: '03',
    title: 'Officer Validation',
    metric: '100% Ground Truth',
    icon: 'verified_user',
    desc: 'Police investigator query confirmations feed verified ground-truth labels.',
    color: '#60a5fa',
  },
  {
    step: '04',
    title: 'On-Prem LoRA GPUs',
    metric: '24h Retrain Cycle',
    icon: 'model_training',
    desc: 'Lightweight delta weights (<15MB) fine-tuned on district GPU clusters.',
    color: '#34d399',
  },
  {
    step: '05',
    title: 'Edge Fleet Push',
    metric: '<4h Over-The-Air',
    icon: 'cloud_sync',
    desc: 'Zero-downtime hot-swap delta deployment to all 8 district Edge DCs.',
    color: '#a78bfa',
  },
]

const corePillars = [
  {
    title: 'Indian Traffic Adaptation',
    tag: 'LOCAL GROUND TRUTH',
    icon: 'two_wheeler',
    color: '#e02870',
    desc: 'Trained directly on non-standard number plates, triple riding, and high vehicle density. Eliminates generic off-the-shelf blindspots.',
  },
  {
    title: '70% ➔ 96.4% Accuracy Ramp',
    tag: '+26.4% ACCURACY',
    icon: 'trending_up',
    color: '#34d399',
    desc: 'Generic Day 1 models start at 70%. Continuous city fine-tuning elevates detection precision to 96.4% within 90 days.',
  },
  {
    title: '<4h Zero-Downtime Push',
    tag: 'RAPID OTA UPDATE',
    icon: 'bolt',
    color: '#60a5fa',
    desc: 'Daily delta model weights deployed seamlessly across all 8 district Edge DCs without interrupting active video surveillance.',
  },
  {
    title: '100% On-Premise Sovereignty',
    tag: 'ZERO CLOUD LEAKS',
    icon: 'shield_lock',
    color: '#fbbf24',
    desc: '100% local GPU execution. Police footage never leaves district servers, ensuring total DPDP and national sovereignty compliance.',
  },
]
</script>

<template>
  <div class="w-full h-full flex flex-col justify-between p-4 sm:p-7 font-mono select-none overflow-hidden bg-[#09090c]">
    
    <!-- HEADER TITLE BAR -->
    <div class="flex items-center justify-between pb-3.5 border-b border-[#27272a] shrink-0">
      <div class="flex items-center gap-3.5">
        <div class="w-12 h-12 bg-[#750d37] border-2 border-[#e02870] flex items-center justify-center text-white font-black text-2xl shadow-xl">
          <span class="material-symbols-outlined text-2xl">model_training</span>
        </div>
        <div>
          <div class="text-[#e02870] font-black text-xs sm:text-sm uppercase flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#e02870]"></span>
            <span>STATION 04 // CONTINUOUS FLYWHEEL</span>
          </div>
          <h2 class="text-xl sm:text-3xl font-black text-white font-mono mt-0.5">Continuous City Ground-Truth Retraining</h2>
        </div>
      </div>

      <div class="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-zinc-300 font-bold bg-[#121216] border border-[#27272a] px-3.5 py-1.5 shadow-md">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>24-Hour Autonomous Feedback Loop</span>
      </div>
    </div>

    <!-- 5-STEP CLOSED-LOOP FLYWHEEL STRIP -->
    <div class="bg-[#111116] border-2 border-[#27272a] p-4 my-3 shadow-2xl shrink-0">
      <div class="flex items-center justify-between border-b border-[#27272a] pb-2 mb-3">
        <span class="text-xs sm:text-sm text-[#e02870] font-black uppercase flex items-center gap-2">
          <span class="material-symbols-outlined text-base">sync</span>
          5-Stage Autonomous Adaptation Cycle
        </span>
        <span class="text-xs text-zinc-300 font-bold">Raw Video ➔ LoRA Weights ➔ Edge Deploy</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-stretch">
        <div
          v-for="(step, idx) in flywheelSteps"
          :key="step.step"
          class="bg-[#16161f] border-2 p-3 flex flex-col justify-between relative shadow-lg"
          :style="{ borderColor: step.color }"
        >
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-sm font-black" :style="{ color: step.color }">{{ step.step }}</span>
              <span class="material-symbols-outlined text-lg" :style="{ color: step.color }">{{ step.icon }}</span>
            </div>
            <div class="text-xs sm:text-sm font-black text-white leading-tight mb-1.5">{{ step.title }}</div>
            <p class="text-zinc-300 text-xs leading-relaxed font-sans">{{ step.desc }}</p>
          </div>

          <div class="mt-2.5 pt-2 border-t border-[#27272a] flex items-center justify-between text-xs">
            <span class="text-zinc-400">Metric:</span>
            <strong class="font-black text-white" :style="{ color: step.color }">{{ step.metric }}</strong>
          </div>

          <!-- ARROW CONNECTOR BETWEEN STEPS -->
          <div
            v-if="idx < flywheelSteps.length - 1"
            class="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-5 h-5 bg-[#111116] border-2 border-zinc-700 items-center justify-center text-xs text-zinc-300 font-bold"
          >
            ➔
          </div>
        </div>
      </div>
    </div>

    <!-- 4 PERFORMANCE PILLARS + ACCURACY PROGRESSION GRID -->
    <div class="grid grid-cols-12 gap-3.5 flex-1 min-h-0 items-stretch">
      
      <!-- 4 KEY PILLARS -->
      <div class="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          v-for="p in corePillars"
          :key="p.title"
          class="bg-[#121216] border-2 p-3.5 flex flex-col justify-between shadow-xl"
          :style="{ borderColor: p.color }"
        >
          <div>
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-xl" :style="{ color: p.color }">{{ p.icon }}</span>
                <h3 class="text-sm sm:text-base font-black text-white font-mono">{{ p.title }}</h3>
              </div>
              <span class="text-[10px] sm:text-xs px-2 py-0.5 bg-black/60 border font-black" :style="{ borderColor: p.color, color: p.color }">
                {{ p.tag }}
              </span>
            </div>
            <p class="text-zinc-200 text-xs sm:text-sm leading-relaxed font-sans">
              {{ p.desc }}
            </p>
          </div>
        </div>
      </div>

      <!-- ACCURACY TIMELINE COMPARISON -->
      <div class="col-span-12 lg:col-span-4 bg-[#121216] border-2 border-[#27272a] p-3.5 flex flex-col justify-between shadow-xl">
        <div>
          <div class="flex items-center justify-between border-b border-[#27272a] pb-2 mb-2.5">
            <span class="text-xs sm:text-sm font-black text-white uppercase">Ahmedabad Accuracy Timeline</span>
            <span class="text-sm font-black text-emerald-400">96.4% PEAK</span>
          </div>

          <div class="space-y-2.5 text-xs sm:text-sm">
            <div>
              <div class="flex justify-between mb-1 text-zinc-300 font-bold">
                <span>Day 01: Generic Baseline</span>
                <span class="text-amber-400 font-black">70.0%</span>
              </div>
              <div class="h-3 bg-[#1a1a22] border border-[#27272a] overflow-hidden">
                <div class="h-full bg-amber-500 w-[70%]"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between mb-1 text-zinc-300 font-bold">
                <span>Day 30: Local CCTV Ingest</span>
                <span class="text-blue-400 font-black">88.5%</span>
              </div>
              <div class="h-3 bg-[#1a1a22] border border-[#27272a] overflow-hidden">
                <div class="h-full bg-blue-500 w-[88.5%]"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between mb-1 text-zinc-300 font-bold">
                <span>Day 90+: Full Swarm Peak</span>
                <span class="text-emerald-400 font-black">96.4%</span>
              </div>
              <div class="h-3 bg-[#1a1a22] border border-[#27272a] overflow-hidden">
                <div class="h-full bg-emerald-500 w-[96.4%]"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-2 border-t border-[#27272a] text-xs text-zinc-300 font-bold text-center">
          +26.4% Accuracy Gain through Local Retraining
        </div>
      </div>

    </div>

    <!-- FOOTER SUMMARY STRIP -->
    <div class="flex flex-wrap items-center justify-between border-t border-[#27272a] pt-2.5 text-xs text-zinc-300 shrink-0 gap-2">
      <div class="flex items-center gap-4">
        <span class="text-emerald-400 font-black flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 bg-emerald-400"></span>
          <span>HARD-NEGATIVE MINING</span>
        </span>
        <span class="text-blue-400 font-black flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 bg-blue-400"></span>
          <span>OFFICER HUMAN-IN-THE-LOOP</span>
        </span>
        <span class="text-[#e02870] font-black flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 bg-[#e02870]"></span>
          <span>&lt;4H OVER-THE-AIR DEPLOYMENT</span>
        </span>
      </div>
      <span class="text-[#e02870] font-black">100% ON-PREMISE GPU CLUSTER TRAINING</span>
    </div>

  </div>
</template>
