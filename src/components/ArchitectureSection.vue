<script setup lang="ts">
</script>

<template>
  <section id="architecture" class="py-12 md:py-24 px-4 md:px-12 lg:px-20 border-t border-[#1e1e20] bg-[#0a0a0c]">
    <div class="max-w-7xl mx-auto">
      <div class="section-tag mb-3 md:mb-4">// ECOSYSTEM ARCHITECTURE</div>
      <h2 class="text-xl md:text-5xl font-black uppercase tracking-tight mb-8 md:mb-16">
        THREE LAYERS OF<br/>
        <span style="color: #750d37">SOVEREIGN AI INTELLIGENCE.</span>
      </h2>

      <div class="space-y-4 md:space-y-8">
        <div class="industrial-card p-4 md:p-8 border-l-4 border-l-[#750d37]">
          <div class="grid lg:grid-cols-12 gap-4 md:gap-8 items-center">
            <div class="lg:col-span-4">
              <span class="font-mono text-xs text-[#9a1a4e] font-bold tracking-widest uppercase">// LAYER 01 — INFRASTRUCTURE</span>
              <h3 class="text-lg md:text-3xl font-black uppercase text-white mt-1 mb-1.5">SHADOWVERSE</h3>
              <p class="text-[10px] font-mono text-[#a0a0a4] uppercase">UBUNTU PRIVATE CLOUD + CEPH + MICROK8S</p>
            </div>
            <div class="lg:col-span-8 space-y-3">
              <p class="text-xs md:text-sm text-[#e8e8ea] leading-relaxed">
                A high-performance private cloud framework built on Ubuntu Enterprise, Ceph distributed storage, and MicroK8s container orchestration.
                Designed to run completely on-premise without external cloud connections.
              </p>
              <div class="flex flex-wrap gap-2 font-mono text-[9px] md:text-xs">
                <span class="px-2 py-0.5 bg-[#0a0a0c] border border-[#1e1e20] text-[#a0a0a4]">100% On-Premise Deployment</span>
                <span class="px-2 py-0.5 bg-[#0a0a0c] border border-[#1e1e20] text-[#a0a0a4]">Zero Cloud Data Exposure</span>
                <span class="px-2 py-0.5 bg-[#0a0a0c] border border-[#1e1e20] text-[#a0a0a4]">Ceph Storage Fault-Tolerance</span>
              </div>
            </div>
          </div>
        </div>

        <div class="industrial-card p-4 md:p-8 border-l-4 border-l-[#4a7ebb]">
          <div class="grid lg:grid-cols-12 gap-4 md:gap-8 items-center">
            <div class="lg:col-span-4">
              <span class="font-mono text-xs text-[#4a7ebb] font-bold tracking-widest uppercase">// LAYER 02 — SURVEILLANCE PLATFORM</span>
              <h3 class="text-lg md:text-3xl font-black uppercase text-white mt-1 mb-1.5">SHADOWWATCH</h3>
              <p class="text-[10px] font-mono text-[#a0a0a4] uppercase">UNIVERSAL RTSP INGESTION ENGINE</p>
            </div>
            <div class="lg:col-span-8 space-y-3">
              <p class="text-xs md:text-sm text-[#e8e8ea] leading-relaxed">
                Handles up to 12,000 video streams per server using hardware-accelerated NVDEC decoding.
                Compatible with any camera manufacturer (Hikvision, Dahua, Axis, CP Plus, ONVIF/RTSP feeds).
                Enforces organizational hierarchy access control.
              </p>
              <div class="flex flex-wrap gap-2 font-mono text-[9px] md:text-xs">
                <span class="px-2 py-0.5 bg-[#0a0a0c] border border-[#1e1e20] text-[#a0a0a4]">12,000+ Streams / Server</span>
                <span class="px-2 py-0.5 bg-[#0a0a0c] border border-[#1e1e20] text-[#a0a0a4]">Manufacturer Agnostic</span>
                <span class="px-2 py-0.5 bg-[#0a0a0c] border border-[#1e1e20] text-[#a0a0a4]">Hierarchy Stream Gating</span>
              </div>
            </div>
          </div>
        </div>

        <div class="industrial-card p-4 md:p-8 border-l-4 border-l-[#3d8b5e]">
          <div class="grid lg:grid-cols-12 gap-4 md:gap-8 items-center">
            <div class="lg:col-span-4">
              <span class="font-mono text-xs text-[#3d8b5e] font-bold tracking-widest uppercase">// LAYER 03 — VISION AI ENGINE</span>
              <h3 class="text-lg md:text-3xl font-black uppercase text-white mt-1 mb-1.5">SHADOWVISION AI</h3>
              <p class="text-[10px] font-mono text-[#a0a0a4] uppercase">IN-HOUSE AGENTIC VISION ALGORITHMS</p>
            </div>
            <div class="lg:col-span-8 space-y-3">
              <p class="text-xs md:text-sm text-[#e8e8ea] leading-relaxed">
                An army of specialized vision AI agents built using in-house cutting-edge algorithms rather than slow generic models.
                Tracks posture, movement, behavioral patterns, loitering, and room access 24×7×365.
              </p>
              <div class="flex flex-wrap gap-2 font-mono text-[9px] md:text-xs">
                <span class="px-2 py-0.5 bg-[#0a0a0c] border border-[#1e1e20] text-[#a0a0a4]">Custom Vision Algorithms</span>
                <span class="px-2 py-0.5 bg-[#0a0a0c] border border-[#1e1e20] text-[#a0a0a4]">Multi-Scenario Agents</span>
                <span class="px-2 py-0.5 bg-[#0a0a0c] border border-[#1e1e20] text-[#a0a0a4]">Sub-50ms Inference</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
