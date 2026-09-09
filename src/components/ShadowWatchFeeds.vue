<script setup lang="ts">
import { ref, computed } from 'vue'

// GPU Hardware Specifications Database
const gpuModels = [
  { id: 't400', model: '2GB GPU (T400 / GTX 1050)', vramGb: 2, cost: '₹12,000', tag: 'Edge AI Node', category: 'Entry' },
  { id: 't600', model: '4GB GPU (T600 / GTX 1650)', vramGb: 4, cost: '₹22,000', tag: 'Small Facility', category: 'Entry' },
  { id: 'rtx4060', model: '8GB GPU (RTX 4060)', vramGb: 8, cost: '₹32,000', tag: 'Branch Standard', category: 'Mid' },
  { id: 'rtx3070', model: 'NVIDIA RTX 3070 (8GB)', vramGb: 8, cost: '₹45,000', tag: 'High-Throughput', category: 'Mid' },
  { id: 'rtx4070', model: 'NVIDIA RTX 4070 (12GB)', vramGb: 12, cost: '₹62,000', tag: 'Pro Surveillance', category: 'Pro' },
  { id: 'rtx5070', model: 'NVIDIA RTX 5070 (16GB)', vramGb: 16, cost: '₹85,000', tag: 'Next-Gen Edge Server', category: 'Pro' },
  { id: 'l4', model: 'NVIDIA L4 (24GB)', vramGb: 24, cost: '₹2,40,000', tag: 'Enterprise Rack Server', category: 'Server' },
  { id: 'l40s', model: 'NVIDIA L40S (48GB)', vramGb: 48, cost: '₹6,80,000', tag: 'Data Center AI Engine', category: 'Server' },
  { id: 'a100', model: 'NVIDIA A100 (80GB)', vramGb: 80, cost: '₹14,50,000', tag: 'Hyperscale Cluster', category: 'Hyperscale' }
]

// Feature-Based Vision AI Model Database
interface AiFeature {
  id: string
  name: string
  weightMb: number
  icon: string
  badge?: string
  description: string
}

const aiFeaturesList: AiFeature[] = [
  { id: 'intruder', name: 'Intruder Detection', weightMb: 150, icon: 'shield', description: 'Perimeter breach & virtual tripwire' },
  { id: 'tracking', name: 'Object & Vehicle Tracking', weightMb: 100, icon: 'route', description: 'Multi-camera spatial trajectory tracking' },
  { id: 'theft', name: 'Theft & Anomaly Detection', weightMb: 200, icon: 'lock', description: 'Behavior analysis & missing asset alerts' },
  { id: 'action', name: 'Action Monitoring (Pose)', weightMb: 350, icon: 'accessibility_new', badge: 'POSE MODEL', description: 'Human pose keypoint & fall estimation' },
  { id: 'counting', name: 'Counting & Density Analysis', weightMb: 100, icon: 'groups', description: 'People, vehicles & crowd density counting' },
  { id: 'blacklist', name: 'Blacklist & Face Match', weightMb: 250, icon: 'person_search', badge: 'THREAT AI', description: 'Real-time blacklist & identity match alerts' }
]

// Selected GPU State (Defaults to RTX 4060 8GB)
const selectedGpuId = ref<string>('rtx4060')

// Selected AI Features (Defaults to Intruder + Tracking + People Counting)
const selectedFeatureIds = ref<string[]>(['intruder', 'tracking', 'counting'])

// Configurator States (Defaults: 720p, 30 FPS)
const selectedResolution = ref<'480p' | '640p' | '720p' | '1080p' | '4k'>('720p')
const selectedFps = ref<number>(30)

// Active Deployment View Mode ('ai' | 'mix' | 'stream')
const activeViewMode = ref<'ai' | 'mix' | 'stream'>('ai')

// Resolution VRAM Multipliers
const resolutionMultipliers: Record<string, number> = {
  '480p': 0.6,
  '640p': 0.8,
  '720p': 1.0,
  '1080p': 1.5,
  '4k': 3.5
}

// Stream capacity — optimized codebase (multiprocessing + CuPy + ROI-triggered inference)
// RTX 5070 Ti 16GB reference @ 70% max load: 720p=60–75, 640p=100–125, 480p=120–150
// All other GPUs scaled proportionally from that baseline
const streamCapacityTable: Record<string, Record<string, [number, number]>> = {
  t400:    { '480p': [12, 16],  '640p': [10, 13],  '720p': [7, 10],   '1080p': [4, 6],   '4k': [1, 2]   },
  t600:    { '480p': [22, 28],  '640p': [18, 23],  '720p': [13, 17],  '1080p': [7, 10],  '4k': [2, 4]   },
  rtx4060: { '480p': [42, 52],  '640p': [33, 42],  '720p': [24, 30],  '1080p': [13, 17], '4k': [4, 6]   },
  rtx3070: { '480p': [50, 62],  '640p': [40, 50],  '720p': [28, 36],  '1080p': [15, 20], '4k': [5, 7]   },
  rtx4070: { '480p': [80, 100], '640p': [63, 80],  '720p': [45, 58],  '1080p': [24, 32], '4k': [8, 11]  },
  rtx5070: { '480p': [120, 150],'640p': [100, 125],'720p': [60, 75],  '1080p': [32, 42], '4k': [11, 15] },
  l4:      { '480p': [280, 350],'640p': [220, 280],'720p': [140, 180],'1080p': [75, 95], '4k': [25, 35] },
  l40s:    { '480p': [600, 750],'640p': [470, 600],'720p': [300, 380],'1080p': [160, 200],'4k': [55, 70] },
  a100:    { '480p': [1000,1200],'640p': [800,1000],'720p': [500, 650],'1080p': [270, 340],'4k': [90, 115]}
}

// AI feature penalty — more features = fewer concurrent AI streams
const aiPenaltyFactor = computed(() => {
  const n = selectedFeatureIds.value.length
  if (n === 0) return 1.0
  if (n === 1) return 0.85
  if (n === 2) return 0.72
  if (n === 3) return 0.60
  if (n === 4) return 0.50
  if (n === 5) return 0.42
  return 0.35
})

// FPS penalty
const fpsPenalty = computed(() => {
  if (selectedFps.value <= 10) return 1.5
  if (selectedFps.value <= 15) return 1.25
  if (selectedFps.value <= 30) return 1.0
  return 0.7
})

// Toggle feature selection
function toggleFeature(id: string) {
  const idx = selectedFeatureIds.value.indexOf(id)
  if (idx > -1) selectedFeatureIds.value.splice(idx, 1)
  else selectedFeatureIds.value.push(id)
}

const activeGpu = computed(() => gpuModels.find((g) => g.id === selectedGpuId.value) || gpuModels[2]!)

const capacityMetrics = computed(() => {
  const raw = streamCapacityTable[selectedGpuId.value]?.[selectedResolution.value] ?? [0, 0]
  const penalty = aiPenaltyFactor.value * fpsPenalty.value

  const minAiStreams = Math.max(1, Math.round(raw[0] * penalty))
  const maxAiStreams = Math.max(1, Math.round(raw[1] * penalty))

  // Streaming-only: no AI penalty, only FPS penalty
  const minStreamOnly = Math.max(1, Math.round(raw[0] / fpsPenalty.value))
  const maxStreamOnly = Math.max(1, Math.round(raw[1] / fpsPenalty.value))

  // Mix: ~50% each
  const minMixAi     = Math.max(1, Math.round(minAiStreams * 0.5))
  const maxMixAi     = Math.max(1, Math.round(maxAiStreams * 0.5))
  const minMixStream = Math.max(1, Math.round(minStreamOnly * 0.5))
  const maxMixStream = Math.max(1, Math.round(maxStreamOnly * 0.5))

  // VRAM gauge (approximate display only)
  const gpu = activeGpu.value
  const totalVramMb = gpu.vramGb * 1024
  const usedVramMb  = Math.round(totalVramMb * 0.68)
  const bufferMb    = Math.round(totalVramMb * 0.30)
  const freeMb      = Math.max(0, totalVramMb - usedVramMb - bufferMb)
  const aiVramMb    = Math.round(usedVramMb * 0.55)
  const streamVramMb = usedVramMb - aiVramMb

  return {
    minAiStreams, maxAiStreams,
    minStreamOnly, maxStreamOnly,
    minMixAi, maxMixAi, minMixStream, maxMixStream,
    aiVramMb, streamVramMb, bufferMb, freeMb, totalVramMb,
    usedPercent: Math.min(100, Math.round((usedVramMb / totalVramMb) * 100)),
    aiPercent:    (aiVramMb    / totalVramMb) * 100,
    streamPercent:(streamVramMb / totalVramMb) * 100,
    bufferPercent: 30,
    freePercent:  (freeMb / totalVramMb) * 100
  }
})

</script>

<template>
  <section id="shadowwatch" class="py-12 md:py-20 px-4 md:px-12 lg:px-20 border-t border-[#1e1e20] bg-[#0a0a0c]">
    <div class="max-w-6xl mx-auto space-y-8">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto space-y-3">
        <div class="section-tag text-xs font-bold font-mono text-[#3d8b5e]">// SHADOWWATCH — 12,000+ CAMERA MANAGEMENT PLATFORM</div>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
          SHADOWWATCH CAPACITY<br/>
          <span style="color: #750d37">SIMULATOR</span>
        </h2>
        <p class="text-[#c8c8cc] text-sm sm:text-base leading-relaxed">
          ShadowWatch manages 12,000+ camera streams in a single private platform. Configure your GPU hardware and ShadowVision AI agent features to calculate real-time streaming and AI analysis capacity.
        </p>
      </div>

      <!-- Main 2-Column Calculator Box -->
      <div class="industrial-card p-6 md:p-8 border border-[#1e1e20] bg-[#111113] shadow-2xl font-mono">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- LEFT COLUMN: Inputs & Controls (7 Cols) -->
          <div class="lg:col-span-7 space-y-6">
            
            <!-- 1. GPU Card Selector Dropdown -->
            <div class="space-y-2.5">
              <div class="flex items-center justify-between">
                <label for="gpu-model-select" class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span class="material-symbols-outlined text-[#750d37] text-base">developer_board</span>
                  <span>1. CHOOSE GRAPHICS CARD (GPU MODEL)</span>
                </label>
                <span class="text-[11px] text-[#3d8b5e] font-bold bg-[#3d8b5e]/10 px-2 py-0.5 border border-[#3d8b5e]/30">
                  {{ activeGpu.vramGb }} GB VRAM
                </span>
              </div>

              <select
                id="gpu-model-select"
                v-model="selectedGpuId"
                class="industrial-input text-xs font-bold py-2.5 px-3 cursor-pointer"
              >
                <option v-for="gpu in gpuModels" :key="gpu.id" :value="gpu.id">
                  {{ gpu.model }} — {{ gpu.tag }}
                </option>
              </select>
            </div>

            <!-- 2. Stream Quality Parameters -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label for="resolution-select" class="text-xs font-bold text-[#88888c] uppercase flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[#4a7ebb] text-sm">aspect_ratio</span>
                  <span>RESOLUTION</span>
                </label>
                <select
                  id="resolution-select"
                  v-model="selectedResolution"
                  class="industrial-input text-xs py-2 px-2.5 cursor-pointer"
                >
                  <option value="480p">480p SD (Low Load)</option>
                  <option value="640p">640p nHD</option>
                  <option value="720p">720p HD (Standard)</option>
                  <option value="1080p">1080p Full HD</option>
                  <option value="4k">4K Ultra HD (High VRAM)</option>
                </select>
              </div>

              <div class="space-y-2">
                <label for="framerate-select" class="text-xs font-bold text-[#88888c] uppercase flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[#3d8b5e] text-sm">speed</span>
                  <span>FRAME RATE</span>
                </label>
                <select
                  id="framerate-select"
                  v-model.number="selectedFps"
                  class="industrial-input text-xs py-2 px-2.5 cursor-pointer"
                >
                  <option :value="10">10 FPS (Eco Mode)</option>
                  <option :value="15">15 FPS (Surveillance)</option>
                  <option :value="30">30 FPS (Standard Smooth)</option>
                  <option :value="60">60 FPS (High Motion)</option>
                </select>
              </div>
            </div>

            <!-- 3. Feature-Based Vision AI Suite Checkboxes -->
            <div class="space-y-3 pt-3 border-t border-[#1e1e20]">
              <div class="flex items-center justify-between text-xs font-bold">
                <span class="text-white uppercase flex items-center gap-2">
                  <span class="material-symbols-outlined text-[#3d8b5e] text-base">psychology</span>
                  <span>2. VISION AI FEATURES</span>
                </span>
                <span class="text-[11px] text-[#750d37] font-bold bg-[#750d37]/10 px-2 py-0.5 border border-[#750d37]/30">
                  {{ selectedFeatureIds.length }} Agent{{ selectedFeatureIds.length !== 1 ? 's' : '' }} Active
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div
                  v-for="feat in aiFeaturesList"
                  :key="feat.id"
                  @click="toggleFeature(feat.id)"
                  class="p-3 text-left border transition-all flex flex-col justify-between text-xs cursor-pointer space-y-1.5"
                  :class="selectedFeatureIds.includes(feat.id) ? 'bg-[#180b12] border-[#750d37] text-white shadow-md ring-1 ring-[#750d37]' : 'bg-[#08080a] border-[#1e1e20] text-[#88888c] hover:border-[#444] hover:text-white'"
                >
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-sm" :class="selectedFeatureIds.includes(feat.id) ? 'text-[#750d37]' : 'text-[#88888c]'">
                        {{ feat.icon }}
                      </span>
                      <span class="font-bold text-white truncate">{{ feat.name }}</span>
                    </div>
                    <span
                      class="w-4 h-4 border flex items-center justify-center shrink-0 text-[10px]"
                      :class="selectedFeatureIds.includes(feat.id) ? 'bg-[#750d37] border-[#9a1a4e] text-white' : 'border-[#444]'"
                    >
                      ✓
                    </span>
                  </div>
                  <div class="text-[10px] text-[#88888c] leading-tight flex items-center justify-between">
                    <span>{{ feat.description }}</span>
                    <span v-if="feat.badge" class="text-[8px] bg-[#750d37] text-white px-1 py-0.2 uppercase font-bold shrink-0">
                      {{ feat.badge }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- RIGHT COLUMN: Output Dashboard & Capacity Cards (5 Cols) -->
          <div class="lg:col-span-5 p-5 md:p-6 bg-[#08080a] border border-[#1e1e20] space-y-6 flex flex-col justify-between h-full shadow-inner">
            
            <div class="space-y-5">
              <!-- Selected Hardware Info Header -->
              <div class="border-b border-[#1e1e20] pb-3.5 flex items-center justify-between">
                <div>
                  <span class="text-[10px] text-[#88888c] uppercase font-bold block">SELECTED HARDWARE</span>
                  <div class="text-lg font-black text-white mt-0.5">{{ activeGpu.model }}</div>
                  <div class="text-xs text-[#3d8b5e] font-bold mt-0.5">{{ activeGpu.tag }}</div>
                </div>
                <span class="text-[9px] font-bold px-2 py-1 bg-[#1e1e24] text-[#88888c] border border-[#1e1e20] uppercase">
                  {{ activeGpu.category }} Tier
                </span>
              </div>

              <!-- Interactive Deployment Mode Switcher -->
              <div class="space-y-2">
                <span class="text-[10px] text-[#88888c] uppercase font-bold block">// DISPLAY DEPLOYMENT MODE</span>
                <div class="grid grid-cols-3 gap-1 bg-[#111113] p-1 border border-[#1e1e20]">
                  <button
                    @click="activeViewMode = 'ai'"
                    class="py-1.5 text-[10px] font-bold transition-all text-center cursor-pointer"
                    :class="activeViewMode === 'ai' ? 'bg-[#750d37] text-white shadow' : 'text-[#88888c] hover:text-white'"
                  >
                    Full AI
                  </button>
                  <button
                    @click="activeViewMode = 'mix'"
                    class="py-1.5 text-[10px] font-bold transition-all text-center cursor-pointer"
                    :class="activeViewMode === 'mix' ? 'bg-[#4a7ebb] text-white shadow' : 'text-[#88888c] hover:text-white'"
                  >
                    50/50 Mix
                  </button>
                  <button
                    @click="activeViewMode = 'stream'"
                    class="py-1.5 text-[10px] font-bold transition-all text-center cursor-pointer"
                    :class="activeViewMode === 'stream' ? 'bg-[#3d8b5e] text-white shadow' : 'text-[#88888c] hover:text-white'"
                  >
                    Stream Only
                  </button>
                </div>
              </div>

              <!-- Output Capacity Metrics Cards -->
              <div class="space-y-3">
                <!-- Streaming Card -->
                <div class="p-4 bg-[#111113] border border-[#3d8b5e]/40 flex items-center justify-between transition-all hover:border-[#3d8b5e]">
                  <div>
                    <span class="text-[10px] text-[#88888c] uppercase font-bold block">SHADOWWATCH (STREAMING)</span>
                    <span class="text-xs text-[#3d8b5e] font-bold">Pure Video Stream Ingestion</span>
                  </div>
                  <div class="text-right">
                    <div class="text-2xl font-black text-[#3d8b5e] leading-none">
                      <template v-if="activeViewMode === 'stream'">
                        {{ capacityMetrics.minStreamOnly }} – {{ capacityMetrics.maxStreamOnly }}
                      </template>
                      <template v-else-if="activeViewMode === 'mix'">
                        {{ capacityMetrics.minMixStream }} – {{ capacityMetrics.maxMixStream }}
                      </template>
                      <template v-else>—</template>
                    </div>
                    <span class="text-[10px] text-[#88888c] font-normal">Streams</span>
                  </div>
                </div>

                <!-- AI Feeds Card -->
                <div class="p-4 bg-[#111113] border border-[#750d37]/40 flex items-center justify-between transition-all hover:border-[#750d37]">
                  <div>
                    <span class="text-[10px] text-[#88888c] uppercase font-bold block">SHADOWVISION (VISION AI)</span>
                    <span class="text-xs text-[#750d37] font-bold">Streaming + Active AI Features</span>
                  </div>
                  <div class="text-right">
                    <div class="text-2xl font-black text-[#9a1a4e] leading-none">
                      <template v-if="activeViewMode === 'stream'">—</template>
                      <template v-else-if="activeViewMode === 'mix'">
                        {{ capacityMetrics.minMixAi }} – {{ capacityMetrics.maxMixAi }}
                      </template>
                      <template v-else>
                        {{ capacityMetrics.minAiStreams }} – {{ capacityMetrics.maxAiStreams }}
                      </template>
                    </div>
                    <span class="text-[10px] text-[#88888c] font-normal">AI Streams</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Detailed Multi-Segment VRAM Utilization Meter Gauge -->
            <div class="space-y-3 pt-4 border-t border-[#1e1e20]">
              <div class="flex items-center justify-between text-xs font-bold">
                <span class="text-[#88888c] uppercase">// VRAM METRICS ({{ activeGpu.vramGb }} GB TOTAL)</span>
                <span class="text-[#3d8b5e]">{{ capacityMetrics.usedPercent }}% USED</span>
              </div>

              <!-- Multi-Segment Progress Bar -->
              <div class="h-4 w-full bg-[#111113] border border-[#1e1e20] overflow-hidden flex shadow-inner">
                <!-- AI VRAM Segment -->
                <div
                  class="h-full bg-[#750d37] transition-all duration-300 relative group"
                  :style="{ width: `${capacityMetrics.aiPercent}%` }"
                  :title="`Vision AI VRAM: ${capacityMetrics.aiVramMb} MB`"
                ></div>
                <!-- Streaming VRAM Segment -->
                <div
                  class="h-full bg-[#3d8b5e] transition-all duration-300 relative group"
                  :style="{ width: `${capacityMetrics.streamPercent}%` }"
                  :title="`Streaming VRAM: ${capacityMetrics.streamVramMb} MB`"
                ></div>
                <!-- Spike Buffer Segment -->
                <div
                  class="h-full bg-[#4a7ebb]/60 transition-all duration-300 relative group"
                  :style="{ width: `${capacityMetrics.bufferPercent}%` }"
                  :title="`Spike Buffer: ${capacityMetrics.bufferMb} MB`"
                ></div>
                <!-- Free VRAM Segment -->
                <div
                  class="h-full bg-[#1a1a20] transition-all duration-300"
                  :style="{ width: `${capacityMetrics.freePercent}%` }"
                  :title="`Free VRAM: ${capacityMetrics.freeMb} MB`"
                ></div>
              </div>

              <!-- VRAM Meter Color Legend -->
              <div class="grid grid-cols-2 gap-2 text-[10px] font-bold text-[#88888c] pt-1">
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 bg-[#750d37] shrink-0"></span>
                  <span class="truncate">Vision AI: {{ capacityMetrics.aiVramMb }} MB</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 bg-[#3d8b5e] shrink-0"></span>
                  <span class="truncate">Streaming: {{ capacityMetrics.streamVramMb }} MB</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 bg-[#4a7ebb]/60 shrink-0"></span>
                  <span class="truncate">Spike Buffer: {{ capacityMetrics.bufferMb }} MB</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 bg-[#1a1a20] shrink-0"></span>
                  <span class="truncate">Free: {{ capacityMetrics.freeMb }} MB</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  </section>
</template>
