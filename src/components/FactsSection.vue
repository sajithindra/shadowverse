<script setup lang="ts">
const comparisons = [
  {
    icon: 'videocam',
    feature: 'CAMERA COMPATIBILITY',
    traditional: 'Proprietary vendor lock-in. Forces buying expensive new camera hardware.',
    shadowvision: 'Works with ANY camera brand (Hikvision, Dahua, CP Plus, Axis, ONVIF). Zero replacements needed.',
    metric: 'ANY BRAND COMPATIBLE'
  },
  {
    icon: 'lock',
    feature: 'DATA PRIVACY & SECURITY',
    traditional: 'Uploads video to third-party cloud servers; vulnerable to leaks & outages.',
    shadowvision: '100% Sovereign Private AI Cloud. Runs on Shadowverse on-premise infrastructure — zero public cloud, zero data leakage.',
    metric: '100% PRIVATE'
  },
  {
    icon: 'speed',
    feature: 'EMERGENCY RESPONSE SPEED',
    traditional: '15 to 45 mins delay. Relies on manual guard reviews and phone calls.',
    shadowvision: 'Under 3 mins automated fall/intrusion emergency dispatch with sub-50ms AI checks.',
    metric: '< 50ms LATENCY'
  },
  {
    icon: 'precision_manufacturing',
    feature: 'ALERTNESS & ACCURACY',
    traditional: 'Human focus drops 60% after 20 mins. 95% of events missed after 2 hours.',
    shadowvision: 'Constant 98.4% precision. Evaluates 30 frames per second 24×7 without fatigue.',
    metric: '98.4% PRECISION'
  },
  {
    icon: 'dns',
    feature: 'CAMERA SCALE CAPACITY',
    traditional: 'Guards can only monitor 4 to 8 camera screens effectively at once.',
    shadowvision: 'ShadowWatch manages 12,000+ live camera feeds in a single platform — zero software caps, hardware-scaled.',
    metric: '12,000+ CAMERAS'
  },
  {
    icon: 'pin',
    feature: 'LOGIN PROTECTION',
    traditional: 'Static passwords stored in databases; vulnerable to keyloggers and leaks.',
    shadowvision: 'Keyless Logic Lock 9×9 Grid. Dynamic coordinates with zero passwords saved.',
    metric: 'ZERO DB PASSWORDS'
  },
  {
    icon: 'savings',
    feature: 'OPERATIONAL COST',
    traditional: 'Requires hiring 3 guard shifts + relief staff + continuous payroll expenses.',
    shadowvision: 'Runs locally on your server. Cuts operational security costs by up to 78%.',
    metric: '78% SAVINGS'
  }
]
</script>

<template>
  <section id="facts" class="py-12 md:py-24 px-4 md:px-12 lg:px-20 border-t border-[#1e1e20] bg-[#111113]">
    <div class="max-w-7xl mx-auto space-y-8 md:space-y-12">
      <div class="flex flex-col items-start">
        <div class="section-tag mb-3 md:mb-4 text-xs sm:text-sm font-bold">// SAFETY & SECURITY — EMPIRICAL COMPARISON</div>
        <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.15]">
          TRADITIONAL SYSTEMS FAIL<br/>
          <span style="color: #750d37">SAFETY & COMPLIANCE STANDARDS.</span>
        </h2>
        <p class="text-[#c8c8cc] text-sm sm:text-base md:text-lg max-w-3xl mt-3 leading-relaxed">
          Side-by-side comparison between legacy CCTV setups and the Shadowverse AI platform — across safety enforcement, compliance readiness, and operational security.
        </p>
      </div>

      <!-- Feature-by-Feature Comparison Grid -->
      <div class="space-y-4">
        <!-- Comparison Header Banners (Desktop) -->
        <div class="hidden md:grid md:grid-cols-12 gap-4 font-mono text-xs font-bold uppercase tracking-wider px-2">
          <div class="md:col-span-3 text-[#88888c]">// CAPABILITY DIMENSION</div>
          <div class="md:col-span-4 text-[#c44a4a] flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-[#c44a4a]"></span>
            <span>CURRENT TRADITIONAL SYSTEM</span>
          </div>
          <div class="md:col-span-5 text-[#3d8b5e] flex items-center gap-1.5 justify-between">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-[#3d8b5e] animate-pulse"></span>
              <span>SHADOWVISION SOVEREIGN AI</span>
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
              <div class="text-[9px] font-mono text-[#c44a4a] font-bold uppercase tracking-wider md:hidden">// CURRENT TRADITIONAL SYSTEM</div>
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

      <!-- Quick Summary Metric Highlights Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div class="industrial-card p-3.5 text-center border-l-2 border-l-[#c44a4a]">
          <div class="text-xs font-mono text-[#88888c]">HUMAN ATTENTION DROP</div>
          <div class="text-lg md:text-2xl font-black text-[#c44a4a] mt-1">60% IN 20 MINS</div>
          <div class="text-[9px] font-mono text-[#88888c] mt-0.5">TRADITIONAL GUARD LIMIT</div>
        </div>

        <div class="industrial-card p-3.5 text-center border-l-2 border-l-[#3d8b5e]">
          <div class="text-xs font-mono text-[#88888c]">VISION AI PRECISION</div>
          <div class="text-lg md:text-2xl font-black text-[#3d8b5e] mt-1">98.4% CONSTANT</div>
          <div class="text-[9px] font-mono text-[#88888c] mt-0.5">30 FPS SUB-50MS LATENCY</div>
        </div>

        <div class="industrial-card p-3.5 text-center border-l-2 border-l-[#4a7ebb]">
          <div class="text-xs font-mono text-[#88888c]">STREAM SCALE PER SERVER</div>
          <div class="text-lg md:text-2xl font-black text-[#4a7ebb] mt-1">12,000 RTSP</div>
          <div class="text-[9px] font-mono text-[#88888c] mt-0.5">NVDEC GPU ACCELERATED</div>
        </div>

        <div class="industrial-card p-3.5 text-center border-l-2 border-l-[#750d37]">
          <div class="text-xs font-mono text-[#88888c]">OPEX SAVINGS</div>
          <div class="text-lg md:text-2xl font-black text-white mt-1">UP TO 78%</div>
          <div class="text-[9px] font-mono text-[#88888c] mt-0.5">ZERO SHIFT PAYROLL</div>
        </div>
      </div>

      <div class="industrial-card p-4 md:p-6 bg-[#0a0a0c] flex flex-col md:flex-row items-center justify-between gap-4 border-t-2 border-t-[#750d37]">
        <div class="flex items-center gap-3">
          <div class="text-xl md:text-3xl font-black text-[#750d37] font-mono shrink-0">FACT:</div>
          <div class="text-[11px] md:text-xs font-mono text-[#e8e8ea] leading-relaxed">
            Replacing 3 human operator shifts with 1 ShadowVision GPU Agent cuts operational surveillance costs by up to <span class="text-white font-bold">78%</span> while increasing anomaly detection accuracy from <span class="text-[#c44a4a]">5%</span> to <span class="text-[#3d8b5e]">98.4%</span>.
          </div>
        </div>
        <a href="#contact" class="industrial-btn industrial-btn-primary shrink-0 w-full sm:w-auto text-center">
          CALCULATE ENTERPRISE SAVINGS
        </a>
      </div>
    </div>
  </section>
</template>
