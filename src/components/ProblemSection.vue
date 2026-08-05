<script setup lang="ts">
const emit = defineEmits(['triggerFallTest'])
</script>

<template>
  <section id="problem" class="py-12 md:py-24 px-4 md:px-12 lg:px-20 border-t border-[#1e1e20] bg-[#0a0a0c] relative">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col items-start mb-8 md:mb-16">
        <div class="section-tag mb-3 md:mb-4">// THE CRITICAL PROBLEM</div>
        <h2 class="text-xl md:text-5xl font-black uppercase tracking-tight leading-tight">
          HUMAN GUARDS BLINK 15,000 TIMES A DAY.<br/>
          <span style="color: #750d37">OUR VISION AI AGENTS NEVER DO.</span>
        </h2>
        <p class="text-[#a0a0a4] text-xs md:text-lg max-w-3xl mt-3 md:mt-4">
          Traditional video surveillance relies on exhausted human monitors or passive recording.
          When critical emergencies occur in silence, human oversight fails.
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-4 md:gap-8">
        <div class="industrial-card p-4 md:p-8 flex flex-col justify-between h-full pulse-alert-card">
          <div>
            <div class="flex items-center justify-between mb-3 pb-2 border-b border-[#1e1e20]">
              <span class="font-mono text-xs text-[#750d37] font-bold tracking-widest">// SCENARIO 01</span>
              <span class="text-[9px] font-mono text-[#c44a4a] bg-[#c44a4a]/10 px-2 py-0.5 border border-[#c44a4a]/30">HIGH RISK</span>
            </div>
            <h3 class="text-base md:text-xl font-black uppercase text-white mb-3 md:mb-4">The Stubborn Parent & Alone at Home</h3>
            <p class="text-[#a0a0a4] text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
              Your elderly parent refuses to wear a smartwatch and stays home alone.
              They suffer a fall in the living room or washroom when nobody is around.
            </p>
            <div class="p-3 md:p-4 bg-[#0a0a0c] border border-[#1e1e20] mb-4 md:mb-6 space-y-1.5 md:space-y-2">
              <div class="text-[11px] md:text-xs font-mono text-[#750d37] font-bold">SHADOWVISION AI INTERVENTION:</div>
              <p class="text-[11px] md:text-xs text-[#e8e8ea] leading-relaxed">
                If they fall and cannot rise within 3 minutes, or remain in the washroom past calculated thresholds,
                the AI agent automatically triggers emergency voice calls, SMS, and notifies ambulance services wherever you are.
              </p>
            </div>
          </div>
          <button @click="emit('triggerFallTest')" class="industrial-btn industrial-btn-primary w-full text-xs">
            TRIGGER EMERGENCY FALL TEST
          </button>
        </div>

        <div class="industrial-card p-4 md:p-8 flex flex-col justify-between h-full">
          <div>
            <div class="flex items-center justify-between mb-3 pb-2 border-b border-[#1e1e20]">
              <span class="font-mono text-xs text-[#750d37] font-bold tracking-widest">// SCENARIO 02</span>
              <span class="text-[9px] font-mono text-[#c49a3c] bg-[#c49a3c]/10 px-2 py-0.5 border border-[#c49a3c]/30">UNAUTHORIZED</span>
            </div>
            <h3 class="text-base md:text-xl font-black uppercase text-white mb-3 md:mb-4">After-Hours Intruders & Domestic Breaches</h3>
            <p class="text-[#a0a0a4] text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
              An unknown visitor approaches your home after 9:30 PM, or your staff/driver enters the master living room and opens the safe.
            </p>
            <div class="p-3 md:p-4 bg-[#0a0a0c] border border-[#1e1e20] mb-4 md:mb-6 space-y-1.5 md:space-y-2">
              <div class="text-[11px] md:text-xs font-mono text-[#750d37] font-bold">SHADOWVISION AI INTERVENTION:</div>
              <p class="text-[11px] md:text-xs text-[#e8e8ea] leading-relaxed">
                Real-time facial vector profiling and spatial boundary monitoring detect unauthorized room access and locker opening instantly.
                You receive an emergency alert on your phone then and there.
              </p>
            </div>
          </div>
          <div class="pt-3 border-t border-[#1e1e20] flex items-center justify-between font-mono text-[9px] md:text-[10px] text-[#555558]">
            <span>AGENT: INTRUDER_&_LOCKER_AI</span>
            <span class="text-[#3d8b5e]">24x7 ACTIVE</span>
          </div>
        </div>

        <div class="industrial-card p-4 md:p-8 flex flex-col justify-between h-full">
          <div>
            <div class="flex items-center justify-between mb-3 pb-2 border-b border-[#1e1e20]">
              <span class="font-mono text-xs text-[#750d37] font-bold tracking-widest">// SCENARIO 03</span>
              <span class="text-[9px] font-mono text-[#4a7ebb] bg-[#4a7ebb]/10 px-2 py-0.5 border border-[#4a7ebb]/30">MASS SCALE</span>
            </div>
            <h3 class="text-base md:text-xl font-black uppercase text-white mb-3 md:mb-4">12,000+ Camera Enterprise Blindspots</h3>
            <p class="text-[#a0a0a4] text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
              Space centers, industrial complexes, and corporate campuses run thousands of feeds across multiple vendors, overwhelming control rooms.
            </p>
            <div class="p-3 md:p-4 bg-[#0a0a0c] border border-[#1e1e20] mb-4 md:mb-6 space-y-1.5 md:space-y-2">
              <div class="text-[11px] md:text-xs font-mono text-[#750d37] font-bold">SHADOWVISION AI INTERVENTION:</div>
              <p class="text-[11px] md:text-xs text-[#e8e8ea] leading-relaxed">
                ShadowWatch decodes up to 12,000 live RTSP streams per server with GPU acceleration, assigning dedicated vision AI agents to every single camera feed.
              </p>
            </div>
          </div>
          <div class="pt-3 border-t border-[#1e1e20] flex items-center justify-between font-mono text-[9px] md:text-[10px] text-[#555558]">
            <span>AGENT: SHADOWWATCH_CORE</span>
            <span class="text-[#3d8b5e]">24x7 ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
