<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits(['close'])

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-6 select-none animate-fade-in"
    @click.self="emit('close')"
    role="dialog"
    aria-modal="true"
    aria-labelledby="terms-modal-title"
  >
    <div class="industrial-card max-w-4xl w-full p-4 md:p-8 border-[#750d37]/60 space-y-4 md:space-y-6 max-h-[90vh] overflow-y-auto relative shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-[#111113]">
      <!-- 2px Brand Top Accent Line -->
      <div class="absolute top-0 left-0 right-0 h-[2px] bg-[#750d37]"></div>

      <div class="flex items-center justify-between pb-3 border-b border-[#1e1e20] sticky top-0 bg-[#0c0c0e] z-10 py-1 pt-2">
        <div>
          <span class="font-mono text-[10px] md:text-xs text-[#750d37] font-bold tracking-widest">// LEGAL & GOVERNING AGREEMENT</span>
          <h3 id="terms-modal-title" class="text-base md:text-2xl font-black uppercase text-white">TERMS & CONDITIONS OF SERVICE</h3>
        </div>
        <button @click="emit('close')" class="industrial-btn industrial-btn-outline text-[10px] md:text-xs">
          CLOSE [ESC]
        </button>
      </div>

      <div class="p-3 bg-[#12080d] border border-[#750d37]/40 rounded-none text-xs text-[#e8e8ea] leading-relaxed">
        <span class="font-mono font-bold text-[#c44a4a]">// LEGAL NOTICE:</span>
        By installing, configuring, deploying, or utilizing the ShadowVerse platform, ShadowWatch surveillance engine, or ShadowVision AI agents, you ("System Commander", "Licensee", or "User") agree to be legally bound by these Terms & Conditions. Read this document carefully before operating the system.
      </div>

      <div class="space-y-4 text-xs md:text-sm text-[#e8e8ea] font-sans leading-relaxed">
        
        <!-- Section 1 -->
        <div class="p-4 bg-[#0a0a0c] border border-[#1e1e20] space-y-2">
          <div class="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-[#750d37]"></span>
            1. BINDING AGREEMENT & SCOPE OF SERVICE
          </div>
          <p class="text-[#a0a0a4] text-xs leading-relaxed">
            This Terms and Conditions of Service Agreement ("Agreement") constitutes a legally binding contract between you (the "Licensee" or "System Commander") and Suvrmonx LLP ("Licensor", "Company"), governing the use, deployment, and operation of the ShadowVerse sovereign enterprise platform, inclusive of ShadowWatch video ingestion engines, ShadowVision AI agents, and associated telemetry software modules.
          </p>
          <p class="text-[#a0a0a4] text-xs leading-relaxed">
            Access to or operation of the software is strictly contingent upon your unreserved acceptance of all terms contained herein. If you do not agree to these terms, you must refrain from deploying, configuring, or operating the software.
          </p>
        </div>

        <!-- Section 2 -->
        <div class="p-4 bg-[#0a0a0c] border border-[#1e1e20] space-y-2">
          <div class="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-[#750d37]"></span>
            2. ON-PREMISE SOVEREIGN DEPLOYMENT & HARDWARE LICENSE
          </div>
          <p class="text-[#a0a0a4] text-xs leading-relaxed">
            <strong class="text-white">Grant of License:</strong> Licensor grants the System Commander a limited, non-exclusive, non-transferable, revocable license to install and execute the compiled binary components of ShadowVerse exclusively on enterprise on-premise hardware clusters (approved Ubuntu Server / Ceph storage node architecture).
          </p>
          <p class="text-[#a0a0a4] text-xs leading-relaxed">
            <strong class="text-white">Hardware & Local Infrastructure Sovereignty:</strong> The Licensee retains sole responsibility for maintaining physical server security, hardware decoding pipeline headroom (NVDEC / GPU acceleration), internal local area network (LAN/VLAN) isolation, firewalls, and credential management. The Licensor disclaims all liability for outages resulting from local power disruptions, hardware failures, or compromised local networks.
          </p>
        </div>

        <!-- Section 3 -->
        <div class="p-4 bg-[#0a0a0c] border border-[#1e1e20] space-y-2">
          <div class="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-[#750d37]"></span>
            3. SYSTEM COMMANDER RESPONSIBILITIES & ACCEPTABLE USE
          </div>
          <p class="text-[#a0a0a4] text-xs leading-relaxed">
            The System Commander agrees to comply with all applicable local, national, and international laws, including privacy and video surveillance regulations. Prohibited actions include:
          </p>
          <ul class="list-disc pl-5 text-[#a0a0a4] text-xs space-y-1">
            <li>Decompiling, reverse engineering, disassembling, or attempting to derive the source code of ShadowVision AI vision models or inference pipelines.</li>
            <li>Deploying video ingestion streams in designated private zones without legally compliant notice or consent as mandated under applicable law.</li>
            <li>Bypassing or modifying system telemetry logs, security verification hashes, or unauthorized access controls.</li>
          </ul>
        </div>

        <!-- Section 4 -->
        <div class="p-4 bg-[#0a0a0c] border border-[#1e1e20] space-y-2">
          <div class="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-[#750d37]"></span>
            4. SHADOWVISION AI & EMERGENCY ALERT DISCLAIMER
          </div>
          <p class="text-[#a0a0a4] text-xs leading-relaxed">
            <strong class="text-white">Supplementary Vision AI Assistance:</strong> ShadowVision AI features—including elder fall detection, after-hours visitor classification, and unauthorized zone alerts—are probabilistic computer vision tools engineered to assist human monitoring. They do NOT replace professional security personnel, medical practitioners, or emergency services.
          </p>
          <p class="text-[#a0a0a4] text-xs leading-relaxed">
            <strong class="text-white">Telephony & Dispatch Reliance:</strong> Automated voice call, SMS, and emergency dispatches rely on third-party telecommunications infrastructure, mobile networks, and SIP gateways. Licensor guarantees no 100% uptime for external telecommunication dispatches and shall not be held liable for delayed or unreceived alert notifications caused by network carrier failure.
          </p>
        </div>

        <!-- Section 5 -->
        <div class="p-4 bg-[#0a0a0c] border border-[#1e1e20] space-y-2">
          <div class="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-[#750d37]"></span>
            5. INTELLECTUAL PROPERTY & PROPRIETARY RIGHTS
          </div>
          <p class="text-[#a0a0a4] text-xs leading-relaxed">
            All rights, title, and interest in and to the ShadowVerse platform—including system architecture, user interface components, agentic neural vision algorithms, branding elements, and documentation—are the exclusive intellectual property of the Licensor and its original creators.
          </p>
          <p class="text-[#a0a0a4] text-xs leading-relaxed">
            <strong class="text-white">Attribution Notice:</strong> Architecture Vision imagined by <strong class="text-white">Sajithindra</strong>. Engineering & Agentic Vision Systems programmed and operated by <strong class="text-white">Suvrmonx LLP</strong>. All global rights reserved under international copyright and intellectual property treaties.
          </p>
        </div>

        <!-- Section 6 -->
        <div class="p-4 bg-[#0a0a0c] border border-[#1e1e20] space-y-2">
          <div class="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-[#750d37]"></span>
            6. LIMITATION OF LIABILITY & INDEMNIFICATION
          </div>
          <p class="text-[#a0a0a4] text-xs leading-relaxed">
            <strong class="text-white">Exclusion of Consequential Damages:</strong> To the maximum extent permitted by law, Suvrmonx LLP and Sajithindra shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, property damage, business interruption, or personal injury resulting from system use or alert delays.
          </p>
          <p class="text-[#a0a0a4] text-xs leading-relaxed">
            <strong class="text-white">Indemnification:</strong> Licensee agrees to defend, indemnify, and hold harmless Suvrmonx LLP, its officers, employees, and architects against any third-party claims, liabilities, or expenses arising from Licensee's deployment, configuration, or failure to maintain adequate monitoring protocols.
          </p>
        </div>

        <!-- Section 7 -->
        <div class="p-4 bg-[#0a0a0c] border border-[#1e1e20] space-y-2">
          <div class="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-[#750d37]"></span>
            7. DATA PRIVACY & SOVEREIGN COMPLIANCE
          </div>
          <p class="text-[#a0a0a4] text-xs leading-relaxed">
            ShadowVerse operates on a strict zero-telemetry, zero-cloud video storage model. Video streams, facial snapshots, and biometric telemetry remain exclusively on the Licensee's local hardware storage cluster. Processing of personal data complies with the Digital Personal Data Protection (DPDP) Act, 2023. For data principal requests, access our DPDP Privacy Portal.
          </p>
        </div>

        <!-- Section 8 -->
        <div class="p-4 bg-[#0a0a0c] border border-[#1e1e20] space-y-2">
          <div class="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-[#750d37]"></span>
            8. GOVERNING LAW & JURISDICTION
          </div>
          <p class="text-[#a0a0a4] text-xs leading-relaxed">
            This Agreement shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes or claims arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the competent courts in India.
          </p>
        </div>

      </div>

      <div class="pt-4 border-t border-[#1e1e20] flex flex-col sm:flex-row items-center justify-between font-mono text-[10px] text-[#555558] gap-2">
        <span>TERMS VERSION: 2026.1 SOVEREIGN LEGAL</span>
        <span class="text-[#3d8b5e]">OFFICIALLY LICENSED — SURVMONX LLP</span>
      </div>
    </div>
  </div>
</template>

