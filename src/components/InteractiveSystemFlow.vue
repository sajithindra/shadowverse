<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['openVideoSearch'])

// Brand Selector State
const selectedBrand = ref('Hikvision')
const cameraBrands = [
  { id: 'Hikvision', name: 'Hikvision IP', protocol: 'RTSP / ONVIF Profile S', status: 'COMPATIBLE' },
  { id: 'Dahua', name: 'Dahua Technology', protocol: 'Dahua IP / ONVIF', status: 'COMPATIBLE' },
  { id: 'CPPlus', name: 'CP Plus Orange', protocol: 'CP Plus NVR Stream', status: 'COMPATIBLE' },
  { id: 'Axis', name: 'Axis Communications', protocol: 'Vapix / RTSP Stream', status: 'COMPATIBLE' },
  { id: 'Honeywell', name: 'Honeywell Security', protocol: 'Honeywell IP Stream', status: 'COMPATIBLE' },
  { id: 'AnyONVIF', name: 'Generic ONVIF / RTSP', protocol: 'Universal RTSP Stream', status: 'COMPATIBLE' }
]

// AI Watchdog Interactive Flow State
const activeWatchdog = ref('fall')
const watchdogs = [
  {
    id: 'fall',
    name: 'Safety Incident Response',
    icon: 'personal_injury',
    color: '#c44a4a',
    alert: 'SAFETY INCIDENT — EMPLOYEE DOWN, ZONE B',
    desc: 'Emergency protocol triggered. Responders notified in < 3 minutes. Incident log auto-generated.'
  },
  {
    id: 'pet',
    name: 'Compliance Audit Trail',
    icon: 'assignment',
    color: '#3d8b5e',
    alert: 'AUDIT LOG GENERATED — SHIFT 02 ACCESS',
    desc: 'Timestamped entry/exit record auto-filed. Zero manual documentation needed.'
  },
  {
    id: 'room',
    name: 'Restricted Zone Breach',
    icon: 'lock',
    color: '#750d37',
    alert: 'UNAUTHORISED ENTRY — DATA CENTRE, FLOOR 3',
    desc: 'Real-time perimeter breach alert. Security dispatched, door locked, incident logged.'
  },
  {
    id: 'search',
    name: 'Forensic Evidence Retrieval',
    icon: 'search',
    color: '#4a7ebb',
    alert: 'EVIDENCE RETRIEVED — INCIDENT REF #A4412',
    desc: 'Pulled exact footage clip in 2 seconds from 500+ hours of recordings.'
  }
]
</script>

<template>
  <div class="industrial-card p-4 md:p-8 bg-[#0a0a0c] border-[#750d37] space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-[#1e1e20]">
      <div>
        <div class="font-mono text-xs text-[#3d8b5e] font-bold uppercase tracking-widest flex items-center gap-1.5">
          <span class="material-symbols-outlined text-sm">schema</span>
          <span>// INTERACTIVE VISUAL PIPELINE FLOW</span>
        </div>
        <h3 class="text-lg md:text-2xl font-black uppercase text-white mt-1">HOW YOUR SECURITY FEEDS FLOW INTO SHADOWVERSE</h3>
      </div>
      <span class="px-2.5 py-1 bg-[#3d8b5e]/10 border border-[#3d8b5e]/40 text-[10px] font-mono text-[#3d8b5e] font-bold uppercase tracking-wider">
        INTERACTIVE SANDBOX
      </span>
    </div>

    <!-- Visual Step-by-Step Flow Pipeline Diagram -->
    <div class="grid lg:grid-cols-3 gap-6 relative">
      
      <!-- STEP 1: ANY CAMERA BRAND INPUT -->
      <div class="industrial-card card-3d-tilt p-4 bg-[#111113] border-[#1e1e20] space-y-4 flex flex-col justify-between relative">
        <div class="space-y-3">
          <div class="flex items-center justify-between font-mono text-xs">
            <span class="text-[#4a7ebb] font-bold">STEP 01</span>
            <span class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-[#4a7ebb] animate-ping"></span>
              <span class="text-[10px] text-[#88888c]">CAMERA INPUT</span>
            </span>
          </div>
          <h4 class="text-sm font-black uppercase text-white flex items-center justify-between">
            <span class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[#4a7ebb]">videocam</span>
              <span>YOUR EXISTING CAMERAS</span>
            </span>
            <span class="material-symbols-outlined text-sm text-[#4a7ebb] animate-pulse">touch_app</span>
          </h4>

          <!-- Interactive Brand Selector Grid -->
          <div class="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
            <button
              v-for="b in cameraBrands"
              :key="b.id"
              @click="selectedBrand = b.id"
              class="p-2 border text-left transition-all cursor-pointer flex flex-col justify-between hover:scale-105"
              :class="selectedBrand === b.id ? 'bg-[#750d37] border-[#750d37] text-white font-bold shadow-lg' : 'bg-[#0a0a0c] border-[#1e1e20] text-[#a0a0a4] hover:text-white'"
            >
              <div class="font-bold text-[11px] flex items-center justify-between">
                <span>{{ b.name }}</span>
                <span v-if="selectedBrand === b.id" class="material-symbols-outlined text-xs">check_circle</span>
              </div>
              <div class="text-[9px] font-semibold mt-1 flex items-center gap-1" :class="selectedBrand === b.id ? 'text-white' : 'text-[#3d8b5e]'">
                <span class="material-symbols-outlined text-[10px]">check_circle</span>
                <span>{{ selectedBrand === b.id ? 'ACTIVE' : 'COMPATIBLE' }}</span>
              </div>
            </button>
          </div>
        </div>

        <div class="p-2.5 bg-[#0a0a0c] border border-[#1e1e20] font-mono text-[10px] text-[#e8e8ea] space-y-1">
          <div class="text-[#4a7ebb] font-bold uppercase">// SELECTED PROTOCOL:</div>
          <div class="text-white">{{ cameraBrands.find(b => b.id === selectedBrand)?.protocol }}</div>
          <div class="text-[#3d8b5e] text-[9px]">Zero Hardware Upgrade Needed</div>
        </div>
      </div>

      <!-- STEP 2: 100% LOCAL GPU PRIVATE SERVER -->
      <div class="industrial-card card-3d-tilt p-4 bg-[#111113] border-[#1e1e20] space-y-4 flex flex-col justify-between">
        <div class="space-y-3">
          <div class="flex items-center justify-between font-mono text-xs">
            <span class="text-[#3d8b5e] font-bold">STEP 02</span>
            <span class="text-[10px] text-[#3d8b5e] font-bold">100% PRIVATE</span>
          </div>
          <h4 class="text-sm font-black uppercase text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-[#3d8b5e]">dns</span>
            <span>SOVEREIGN LOCAL SERVER</span>
          </h4>

          <!-- Visual GPU Ingestion Meter -->
          <div class="p-3 bg-[#0a0a0c] border border-[#1e1e20] space-y-2 font-mono text-xs">
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-[#a0a0a4]">STREAM INGESTION:</span>
              <span class="text-white font-bold">120 FEEDS/SVR (12k+ CAPACITY)</span>
            </div>
            <div class="w-full bg-[#111113] h-2 border border-[#1e1e20] overflow-hidden">
              <div class="bg-[#3d8b5e] h-full w-[85%]"></div>
            </div>
            <div class="flex items-center justify-between text-[10px] pt-1">
              <span class="text-[#3d8b5e] font-bold flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">verified_user</span>
                <span>0 KB CLOUD UPLOAD</span>
              </span>
              <span class="text-[#88888c]">SUB-50ms LATENCY</span>
            </div>
          </div>
        </div>

        <div class="p-2.5 bg-[#0a0a0c] border border-[#3d8b5e] font-mono text-[10px] space-y-1">
          <div class="text-[#3d8b5e] font-bold flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-[#3d8b5e] animate-ping"></span>
            <span>DATA PRIVACY GUARANTEE:</span>
          </div>
          <p class="text-[#a0a0a4]">Video feeds are decoded on your GPU box locally. No third-party servers.</p>
        </div>
      </div>

      <!-- STEP 3: INSTANT AI WATCHDOG DETECTION -->
      <div class="industrial-card card-3d-tilt p-4 bg-[#111113] border-[#1e1e20] space-y-4 flex flex-col justify-between">
        <div class="space-y-3">
          <div class="flex items-center justify-between font-mono text-xs">
            <span class="text-[#750d37] font-bold">STEP 03</span>
            <span class="text-[10px] text-[#750d37] font-bold">REAL-TIME ACTION</span>
          </div>
          <h4 class="text-sm font-black uppercase text-white flex items-center justify-between">
            <span class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[#750d37]">psychology</span>
              <span>VISION AI WATCHDOG</span>
            </span>
            <span class="material-symbols-outlined text-sm text-[#750d37] animate-pulse">touch_app</span>
          </h4>

          <!-- Interactive Scenario Buttons -->
          <div class="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
            <button
              v-for="w in watchdogs"
              :key="w.id"
              @click="activeWatchdog = w.id"
              class="p-2 border text-left cursor-pointer transition-all flex items-center gap-1.5 hover:scale-105"
              :class="activeWatchdog === w.id ? 'bg-[#750d37] border-[#750d37] text-white font-bold shadow-lg' : 'bg-[#0a0a0c] border-[#1e1e20] text-[#a0a0a4] hover:text-white'"
            >
              <span class="material-symbols-outlined text-xs">{{ w.icon }}</span>
              <span class="truncate">{{ w.name }}</span>
            </button>
          </div>
        </div>

        <!-- Simulated Detection Output Card -->
        <div class="p-3 bg-[#0a0a0c] border border-[#750d37] space-y-1 font-mono">
          <div class="text-[10px] text-[#750d37] font-bold uppercase flex items-center justify-between">
            <span>// DETECTED EVENT PREVIEW:</span>
            <span class="text-[#3d8b5e]">LIVE SIMULATION</span>
          </div>
          <div class="text-xs font-black text-white">
            {{ watchdogs.find(w => w.id === activeWatchdog)?.alert }}
          </div>
          <div class="text-[10px] text-[#a0a0a4]">
            {{ watchdogs.find(w => w.id === activeWatchdog)?.desc }}
          </div>
        </div>
      </div>

    </div>

    <!-- Bottom Interactive Trigger Bar -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#1e1e20] font-mono text-xs">
      <div class="text-[#a0a0a4] text-center sm:text-left">
        <strong>RESULT:</strong> Seamless compatibility with {{ selectedBrand }} + 100% private local storage.
      </div>
      <button @click="emit('openVideoSearch')" class="industrial-btn industrial-btn-primary py-2 px-4 text-xs font-bold uppercase cursor-pointer">
        TEST LIVE VIDEO SEARCH DEMO
      </button>
    </div>
  </div>
</template>
