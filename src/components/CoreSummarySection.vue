<script setup lang="ts">
const emit = defineEmits(['openVideoSearch', 'openImpactModal'])
</script>

<template>
  <section id="at-a-glance" class="py-8 md:py-14 px-4 md:px-12 lg:px-20 border-b border-[#1e1e20] bg-[#111113] relative">
    <div class="max-w-7xl mx-auto space-y-6 md:space-y-8">
      
      <!-- Section Header (Ultra Minimal Text) -->
      <div class="text-center max-w-2xl mx-auto space-y-1">
        <div class="section-tag justify-center">// SAFETY, COMPLIANCE & SECURITY — AT A GLANCE</div>
        <h2 class="text-xl md:text-3xl font-black uppercase tracking-tight text-white">
          THE RISK, THE SOLUTION & <span style="color: #750d37">YOUR ADVANTAGE</span>
        </h2>
      </div>

      <!-- 3-Column Split: Minimal Text + Google Icons -->
      <div class="grid lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
        
        <!-- 01. Problem Statement -->
        <div class="industrial-card p-4 md:p-5 border-l-4 border-l-[#c44a4a] bg-[#0a0a0c] flex flex-col justify-between space-y-3">
          <div>
            <div class="flex items-center justify-between pb-2 border-b border-[#1e1e20]">
              <span class="font-mono text-xs text-[#c44a4a] font-bold tracking-widest flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm text-[#c44a4a]">warning</span>
                <span>// 01. THE PROBLEM</span>
              </span>
              <span class="text-[9px] font-mono text-[#c44a4a] bg-[#c44a4a]/10 px-2 py-0.5 border border-[#c44a4a]/30">SAFETY & COMPLIANCE RISK</span>
            </div>
            
            <h3 class="text-base font-black uppercase text-white mt-2 mb-1">Security Gaps & Compliance Liability</h3>
            <p class="text-xs text-[#c8c8cc] leading-normal">
              Traditional CCTV systems create compliance blind spots — no audit trails, no incident documentation, and data stored on third-party cloud servers violating data protection regulations.
            </p>
          </div>

          <div class="p-2.5 bg-[#111113] border border-[#1e1e20] font-mono text-[10px] text-[#88888c] space-y-0.5">
            <div>• No tamper-proof incident audit trail</div>
            <div>• Video data exposed to third-party cloud risk</div>
            <div>• Zero automated safety protocol enforcement</div>
          </div>
        </div>

        <!-- 02. Our Solution -->
        <div class="industrial-card p-4 md:p-5 border-l-4 border-l-[#3d8b5e] bg-[#0a0a0c] flex flex-col justify-between space-y-3">
          <div>
            <div class="flex items-center justify-between pb-2 border-b border-[#1e1e20]">
              <span class="font-mono text-xs text-[#3d8b5e] font-bold tracking-widest flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm text-[#3d8b5e]">visibility</span>
                <span>// 02. OUR SOLUTION</span>
              </span>
              <span class="text-[9px] font-mono text-[#3d8b5e] bg-[#3d8b5e]/10 px-2 py-0.5 border border-[#3d8b5e]/30">SHADOWVISION AI AGENTS</span>
            </div>
            
            <h3 class="text-base font-black uppercase text-white mt-2 mb-1">Detect, Enforce & Document — Automatically</h3>
            <p class="text-xs text-[#c8c8cc] leading-normal">
              ShadowVision AI agents enforce safety and security protocols in real-time — generating tamper-proof incident logs, dispatching emergency responders, and keeping your organisation audit-ready 24×7.
            </p>
          </div>

          <div class="p-2.5 bg-[#111113] border border-[#1e1e20] font-mono text-[10px] text-[#e8e8ea] space-y-0.5">
            <div class="text-[#3d8b5e] flex items-center gap-1">
              <span class="material-symbols-outlined text-xs text-[#3d8b5e]">assignment</span>
              <span>Tamper-Proof Incident Audit Logs</span>
            </div>
            <div class="text-[#3d8b5e] flex items-center gap-1">
              <span class="material-symbols-outlined text-xs text-[#3d8b5e]">phone_in_talk</span>
              <span>Automated Police & Emergency Dispatch</span>
            </div>
            <div class="text-[#3d8b5e] flex items-center gap-1">
              <span class="material-symbols-outlined text-xs text-[#3d8b5e]">verified_user</span>
              <span>DPDP Act 2023 & Data Sovereignty</span>
            </div>
          </div>
        </div>

        <!-- 03. Core USPs (Prominent & High-Noticeability Card) -->
        <div class="industrial-card p-4 md:p-5 border-l-4 border-l-[#750d37] border-t-2 border-t-[#750d37]/80 bg-[#0a0a0c] flex flex-col justify-between space-y-3 shadow-xl">
          <div>
            <div class="flex items-center justify-between pb-2 border-b border-[#1e1e20]">
              <span class="font-mono text-xs text-[#9a1a4e] font-black tracking-widest flex items-center gap-1.5 uppercase">
                <span class="material-symbols-outlined text-sm text-[#750d37]">verified_user</span>
                <span>// 03. CORE USPs</span>
              </span>
              <span class="text-[9px] font-mono text-white bg-[#750d37] px-2 py-0.5 font-black uppercase tracking-wider rounded-xs shadow">KEY ADVANTAGES</span>
            </div>

            <div class="space-y-2.5 font-mono text-xs text-[#e8e8ea] mt-3">
              <div class="p-2.5 bg-[#111113] border border-[#750d37]/40 hover:border-[#750d37] transition-[border-color,background-color] duration-200 ease-out flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-[#750d37]/15 border border-[#750d37]/40 flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-lg text-[#750d37]">cloud_off</span>
                </div>
                <div>
                  <strong class="text-white font-black block text-xs tracking-tight">SHADOWVERSE PRIVATE AI CLOUD</strong>
                  <span class="text-[11px] text-[#c8c8cc] font-sans">Sovereign on-premise compute. Zero public AWS/Azure leaks.</span>
                </div>
              </div>

              <div class="p-2.5 bg-[#111113] border border-[#4a7ebb]/40 hover:border-[#4a7ebb] transition-[border-color,background-color] duration-200 ease-out flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-[#4a7ebb]/15 border border-[#4a7ebb]/40 flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-lg text-[#4a7ebb]">dns</span>
                </div>
                <div>
                  <strong class="text-white font-black block text-xs tracking-tight">SHADOWWATCH 12,000+ CAMERAS</strong>
                  <span class="text-[11px] text-[#c8c8cc] font-sans">Centralized streaming, playback & analytical reports.</span>
                </div>
              </div>

              <div class="p-2.5 bg-[#111113] border border-[#3d8b5e]/40 hover:border-[#3d8b5e] transition-[border-color,background-color] duration-200 ease-out flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-[#3d8b5e]/15 border border-[#3d8b5e]/40 flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-lg text-[#3d8b5e]">smart_toy</span>
                </div>
                <div>
                  <strong class="text-white font-black block text-xs tracking-tight">SHADOWVISION ACTION AGENTS</strong>
                  <span class="text-[11px] text-[#c8c8cc] font-sans">Observe, analyze, and take automated action 24×7.</span>
                </div>
              </div>

              <div class="p-2.5 bg-[#111113] border border-[#3d8b5e]/40 hover:border-[#3d8b5e] transition-[border-color,background-color] duration-200 ease-out flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-[#3d8b5e]/15 border border-[#3d8b5e]/40 flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-lg text-[#3d8b5e]">videocam</span>
                </div>
                <div>
                  <strong class="text-white font-black block text-xs tracking-tight">ANY CAMERA BRAND INTEGRATED</strong>
                  <span class="text-[11px] text-[#c8c8cc] font-sans">Hikvision, Dahua, CP Plus, Axis, ONVIF.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>

