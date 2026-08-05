<script setup lang="ts">
</script>

<template>
  <section id="facts" class="py-12 md:py-24 px-4 md:px-12 lg:px-20 border-t border-[#1e1e20] bg-[#111113]">
    <div class="max-w-7xl mx-auto space-y-8 md:space-y-12">
      <div class="flex flex-col items-start">
        <div class="section-tag mb-3 md:mb-4">// EMPIRICAL COMPARISON & FACTS</div>
        <h2 class="text-xl md:text-5xl font-black uppercase tracking-tight leading-tight">
          HUMAN SURVEILLANCE VS SHADOWVISION AI:<br/>
          <span style="color: #750d37">3 HUMANS SHIFTS VS PURE ELECTRICITY.</span>
        </h2>
        <p class="text-[#a0a0a4] text-xs md:text-lg max-w-3xl mt-3 md:mt-4">
          Humans are biologically prone to fatigue, distraction, and shift turnover.
          To achieve true 24×7×365 monitoring, traditional operations require 3 human security guards per station plus relief staff. Vision AI agents require only GPU compute and electricity.
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-5 md:gap-8">
        <div class="industrial-card p-4 md:p-8 border-l-4 border-l-[#c44a4a] space-y-4 md:space-y-6">
          <div class="flex items-center justify-between pb-3 border-b border-[#1e1e20]">
            <span class="font-mono text-xs text-[#c44a4a] font-bold tracking-widest uppercase">// TRADITIONAL SURVEILLANCE</span>
            <span class="text-[9px] font-mono text-[#c44a4a] bg-[#c44a4a]/10 px-2 py-0.5 border border-[#c44a4a]/30">HIGH ERROR RATE</span>
          </div>
          <h3 class="text-base md:text-2xl font-black uppercase text-white">HUMAN OVERSIGHT LIMITATIONS</h3>

          <div class="space-y-3 font-mono text-[11px] md:text-xs text-[#a0a0a4]">
            <div class="p-2.5 md:p-3.5 bg-[#0a0a0c] border border-[#1e1e20]">
              <span class="text-white font-bold block mb-1">01. 3 SHIFTS REQUIRED FOR 24x7</span>
              <span>To cover 24 hours continuously, you must employ at least 3 human operators working 8-hour shifts plus weekend relief staff. High payroll overhead.</span>
            </div>

            <div class="p-2.5 md:p-3.5 bg-[#0a0a0c] border border-[#1e1e20]">
              <span class="text-white font-bold block mb-1">02. 60% ATTENTION DROP IN 20 MINUTES</span>
              <span>Peer-reviewed security studies show human visual attention degrades by 60% after 20 minutes of watching video monitors. After 2 hours, 95% of subtle anomalies are completely missed.</span>
            </div>

            <div class="p-2.5 md:p-3.5 bg-[#0a0a0c] border border-[#1e1e20]">
              <span class="text-white font-bold block mb-1">03. FATIGUE, BLINKING & DISTRACTIONS</span>
              <span>Humans blink 15,000 times a day, check phones, talk to coworkers, and fall asleep on night shifts. Emergency occurrences pass undetected in seconds.</span>
            </div>

            <div class="p-2.5 md:p-3.5 bg-[#0a0a0c] border border-[#1e1e20]">
              <span class="text-white font-bold block mb-1">04. CANNOT SCALE TO 12,000 CAMERAS</span>
              <span>A human operator cannot simultaneously watch more than 4 to 8 camera streams. Monitoring 12,000 cameras requires 1,500+ human guards per shift.</span>
            </div>
          </div>
        </div>

        <div class="industrial-card p-4 md:p-8 border-l-4 border-l-[#3d8b5e] space-y-4 md:space-y-6">
          <div class="flex items-center justify-between pb-3 border-b border-[#1e1e20]">
            <span class="font-mono text-xs text-[#3d8b5e] font-bold tracking-widest uppercase">// SHADOWVISION AI ECOSYSTEM</span>
            <span class="text-[9px] font-mono text-[#3d8b5e] bg-[#3d8b5e]/10 px-2 py-0.5 border border-[#3d8b5e]/30">98.4% PRECISION</span>
          </div>
          <div class="flex items-center justify-between">
            <h3 class="text-base md:text-2xl font-black uppercase text-white">VISION AI AGENT ADVANTAGE</h3>
            <span class="text-[10px] font-mono text-[#3d8b5e] font-bold">[ PURE ELECTRICITY ]</span>
          </div>

          <div class="space-y-3 font-mono text-[11px] md:text-xs text-[#e8e8ea]">
            <div class="p-2.5 md:p-3.5 bg-[#0a0a0c] border border-[#1e1e20]">
              <span class="text-[#3d8b5e] font-bold block mb-1">01. ZERO HUMAN SHIFTS — PURE COMPUTATIONAL POWER</span>
              <span>No shift changes, no sick leave, no salaries. Runs on hardware-accelerated GPU graphics cards and electricity 24×7×365 without stopping.</span>
            </div>

            <div class="p-2.5 md:p-3.5 bg-[#0a0a0c] border border-[#1e1e20]">
              <span class="text-[#3d8b5e] font-bold block mb-1">02. ZERO FATIGUE DROP — 98.4% CONSTANT PRECISION</span>
              <span>Evaluates every single frame 30 times per second with sub-50ms inference latency. Maintains 100% alertness on hour 8,760 as on minute 1.</span>
            </div>

            <div class="p-2.5 md:p-3.5 bg-[#0a0a0c] border border-[#1e1e20]">
              <span class="text-[#3d8b5e] font-bold block mb-1">03. INSTANT ACTION IN &lt; 3 MINUTES / &lt; 1 SECOND</span>
              <span>Automatically initiates phone calls, dispatches emergency SMS with GPS coordinates, and triggers ambulance alerts if a fall or unauthorized entry occurs.</span>
            </div>

            <div class="p-2.5 md:p-3.5 bg-[#0a0a0c] border border-[#1e1e20]">
              <span class="text-[#3d8b5e] font-bold block mb-1">04. 12,000 STREAMS DECODED ON ONE SERVER CLUSTER</span>
              <span>NVDEC hardware acceleration handles 12,000 RTSP video streams per server, deploying dedicated vision AI agents to every single camera feed.</span>
            </div>
          </div>
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
