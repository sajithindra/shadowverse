<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useToast } from '../composables/useToast'

const emit = defineEmits(['close'])
const { showToast } = useToast()

interface VideoEvent {
  id: string
  timestampSec: number
  timeFormatted: string
  title: string
  person: string
  gender: 'Male' | 'Female' | 'Unknown'
  dressColor: string
  action: string
  location: string
  confidence: number
  bbox: { x: number; y: number; w: number; h: number }
  tags: string[]
}

// Sample Video Feed Metadata
const sampleVideos = [
  { id: 'v1', name: 'Main Lobby Entrance Feed', duration: 165 },
  { id: 'v2', name: 'Restricted Vault & Safe Room', duration: 180 },
  { id: 'v3', name: 'North Perimeter & Parking Lot', duration: 120 }
]

const selectedVideoId = ref('v1')
const uploadedFileName = ref<string | null>(null)
const isAnalyzing = ref(false)
const analyzeProgress = ref(100)

// Search & Filter State
const searchQuery = ref('male with white shirt')
const activeFilter = ref<string>('male with white shirt')

// Video Player State
const videoRef = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)
const currentTimeSec = ref(14)
const totalDurationSec = ref(165)
const activeEventId = ref<string | null>('evt-1')

let playbackInterval: any = null

// Mock AI Event Dataset
const allEvents: VideoEvent[] = [
  {
    id: 'evt-1',
    timestampSec: 14,
    timeFormatted: '00:14',
    title: 'Male in White Shirt Detected',
    person: 'Subject #014 (Male)',
    gender: 'Male',
    dressColor: 'White Shirt & Black Trousers',
    action: 'Walking towards main lobby desk',
    location: 'LOBBY ENTRANCE',
    confidence: 99.2,
    bbox: { x: 35, y: 25, w: 22, h: 55 },
    tags: ['male with white shirt', 'male', 'white shirt', 'lobby']
  },
  {
    id: 'evt-2',
    timestampSec: 38,
    timeFormatted: '00:38',
    title: 'Female with Red Bag Detected',
    person: 'Subject #018 (Female)',
    gender: 'Female',
    dressColor: 'Red Jacket & Black Bag',
    action: 'Entering elevator hall',
    location: 'ELEVATOR HALLWAY',
    confidence: 97.8,
    bbox: { x: 55, y: 30, w: 20, h: 50 },
    tags: ['female', 'red bag', 'red jacket', 'elevator']
  },
  {
    id: 'evt-3',
    timestampSec: 62,
    timeFormatted: '01:02',
    title: 'Male in White Shirt Approaching Vault',
    person: 'Subject #022 (Male)',
    gender: 'Male',
    dressColor: 'White Shirt & Blue Jeans',
    action: 'Inspecting restricted safe door',
    location: 'RESTRICTED VAULT',
    confidence: 98.6,
    bbox: { x: 40, y: 20, w: 25, h: 60 },
    tags: ['male with white shirt', 'male', 'white shirt', 'vault']
  },
  {
    id: 'evt-4',
    timestampSec: 85,
    timeFormatted: '01:25',
    title: 'Delivery Person in Blue Uniform',
    person: 'Subject #029 (Male)',
    gender: 'Male',
    dressColor: 'Blue Jacket & Cap',
    action: 'Carrying package to reception',
    location: 'RECEPTION CORRIDOR',
    confidence: 96.4,
    bbox: { x: 28, y: 35, w: 22, h: 48 },
    tags: ['delivery', 'blue jacket', 'male', 'package']
  },
  {
    id: 'evt-5',
    timestampSec: 112,
    timeFormatted: '01:52',
    title: 'Male in White Shirt Exiting Rear Gate',
    person: 'Subject #035 (Male)',
    gender: 'Male',
    dressColor: 'White Shirt & Dark Pants',
    action: 'Walking out towards parking B',
    location: 'REAR EXIT GATE',
    confidence: 99.0,
    bbox: { x: 60, y: 22, w: 20, h: 58 },
    tags: ['male with white shirt', 'male', 'white shirt', 'exit']
  },
  {
    id: 'evt-6',
    timestampSec: 145,
    timeFormatted: '02:25',
    title: 'Male in White Shirt at Parking Bay 4',
    person: 'Subject #041 (Male)',
    gender: 'Male',
    dressColor: 'White Shirt & Black Belt',
    action: 'Opening sedan car door',
    location: 'PARKING BAY 04',
    confidence: 98.4,
    bbox: { x: 45, y: 28, w: 24, h: 52 },
    tags: ['male with white shirt', 'male', 'white shirt', 'parking']
  }
]

// Filtered Events based on Search Query
const filteredEvents = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return allEvents
  return allEvents.filter(ev => {
    const textStr = `${ev.title} ${ev.person} ${ev.gender} ${ev.dressColor} ${ev.action} ${ev.location} ${ev.tags.join(' ')}`.toLowerCase()
    return q.split(' ').every(word => textStr.includes(word))
  })
})

// Current Active Event
const activeEvent = computed(() => {
  return allEvents.find(e => e.id === activeEventId.value) || filteredEvents.value[0] || allEvents[0]
})

function applyFilterChip(tag: string) {
  activeFilter.value = tag
  if (tag === 'all') {
    searchQuery.value = ''
  } else {
    searchQuery.value = tag
  }
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    uploadedFileName.value = file.name
    triggerVideoAnalysis(file.name)
  }
}

function triggerVideoAnalysis(name: string) {
  isAnalyzing.value = true
  analyzeProgress.value = 0
  showToast({
    title: 'AI VIDEO ANALYSIS STARTED',
    message: `Extracting visual events & person attributes from ${name}...`,
    type: 'INFO'
  })

  const interval = setInterval(() => {
    analyzeProgress.value += 20
    if (analyzeProgress.value >= 100) {
      clearInterval(interval)
      isAnalyzing.value = false
      showToast({
        title: 'ANALYSIS COMPLETE',
        message: 'Extracted 14 searchable person & attribute timeline events.',
        type: 'SUCCESS'
      })
    }
  }, 250)
}

function selectSampleVideo(vId: string) {
  selectedVideoId.value = vId
  const sample = sampleVideos.find(s => s.id === vId)
  if (sample) {
    uploadedFileName.value = null
    totalDurationSec.value = sample.duration
    triggerVideoAnalysis(sample.name)
  }
}

function jumpToTimestamp(ev: VideoEvent) {
  activeEventId.value = ev.id
  currentTimeSec.value = ev.timestampSec
  if (videoRef.value) {
    videoRef.value.currentTime = ev.timestampSec
  }
  showToast({
    title: `JUMPED TO ${ev.timeFormatted}`,
    message: `Playing moment: ${ev.title} (${ev.dressColor})`,
    type: 'INFO'
  })
}

function togglePlayback() {
  isPlaying.value = !isPlaying.value
}

function formatSec(sec: number) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

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
  playbackInterval = setInterval(() => {
    if (isPlaying.value) {
      currentTimeSec.value += 1
      if (currentTimeSec.value >= totalDurationSec.value) {
        currentTimeSec.value = 0
      }
    }
  }, 1000)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (playbackInterval) clearInterval(playbackInterval)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-2.5 sm:p-4 select-none animate-fade-in overflow-y-auto"
    @click.self="emit('close')"
    role="dialog"
    aria-modal="true"
    aria-labelledby="video-search-modal-title"
  >
    <div class="industrial-card max-w-5xl w-full border-[#750d37]/60 space-y-4 my-auto max-h-[92vh] sm:max-h-[88vh] flex flex-col p-3.5 sm:p-6 overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-[#111113]">
      <!-- 2px Brand Top Accent Line -->
      <div class="absolute top-0 left-0 right-0 h-[2px] bg-[#750d37]"></div>

      <!-- Top Header & Title -->
      <div class="flex items-center justify-between pb-3 border-b border-[#1e1e20] shrink-0 pt-1">
        <div>
          <div class="flex items-center gap-2">
            <span class="live-dot"></span>
            <span class="font-mono text-[10px] sm:text-xs text-[#750d37] font-bold tracking-widest uppercase">// VIDEO ATTRIBUTE SEARCH ENGINE</span>
          </div>
          <h3 id="video-search-modal-title" class="text-base sm:text-xl md:text-2xl font-black uppercase text-white mt-0.5">
            AI VIDEO EVENT CONVERSION & PERSON TRACKING
          </h3>
        </div>
        <button @click="emit('close')" class="industrial-btn industrial-btn-outline text-[10px] sm:text-xs py-1.5 px-3 shrink-0">
          CLOSE [ESC]
        </button>
      </div>
      <!-- Vector Engine Technical Specs Bar -->
      <div class="p-2.5 bg-[#0a0a0c] border border-[#1e1e20] grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px] shrink-0">
        <div>
          <span class="text-[#88888c] block uppercase text-[9px]">VECTOR SEARCH ENGINE</span>
          <span class="text-white font-bold">Sovereign Embed 512d</span>
        </div>
        <div>
          <span class="text-[#88888c] block uppercase text-[9px]">KEYFRAME INGESTION</span>
          <span class="text-white font-bold">30 FPS Real-time</span>
        </div>
        <div>
          <span class="text-[#88888c] block uppercase text-[9px]">BOUNDING BOX SPEC</span>
          <span class="text-[#3d8b5e] font-bold">99.2% IOU Accuracy</span>
        </div>
        <div>
          <span class="text-[#88888c] block uppercase text-[9px]">DPDP SURVEILLANCE</span>
          <span class="text-[#750d37] font-bold">Encrypted Local Cluster</span>
        </div>
      </div>

      <div class="overflow-y-auto space-y-4 pr-1 flex-1">
        <!-- Upload Video & Sample Selector Bar -->
        <div class="p-3 md:p-4 bg-[#0a0a0c] border border-[#1e1e20] space-y-3">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <label class="industrial-btn industrial-btn-primary text-xs cursor-pointer flex items-center gap-2 py-2 px-3">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
                <span>UPLOAD VIDEO CLIP</span>
                <input type="file" accept="video/*" class="hidden" @change="handleFileUpload" />
              </label>

              <span class="text-xs text-[#88888c] font-mono hidden sm:inline">or pick sample:</span>
            </div>

            <div class="flex overflow-x-auto gap-1.5 font-mono text-[10px] w-full sm:w-auto scrollbar-none whitespace-nowrap pb-1 sm:pb-0">
              <button
                v-for="s in sampleVideos"
                :key="s.id"
                @click="selectSampleVideo(s.id)"
                class="px-2.5 py-1 border transition-all cursor-pointer shrink-0"
                :class="selectedVideoId === s.id && !uploadedFileName ? 'bg-[#750d37]/20 border-[#750d37] text-white font-bold' : 'bg-[#111113] border-[#1e1e20] text-[#a0a0a4] hover:text-white'"
              >
                {{ s.name }}
              </button>
            </div>
          </div>

        <!-- AI Progress Bar when Uploading -->
        <div v-if="isAnalyzing" class="space-y-1 pt-1">
          <div class="flex justify-between font-mono text-[10px] text-[#3d8b5e]">
            <span>EXTRACTING EVENT TIMELINES & CLOTHING ATTRIBUTES...</span>
            <span>{{ analyzeProgress }}%</span>
          </div>
          <div class="w-full bg-[#111113] h-1.5 border border-[#1e1e20]">
            <div class="bg-[#3d8b5e] h-full transition-all duration-200" :style="{ width: analyzeProgress + '%' }"></div>
          </div>
        </div>

        <div v-else class="text-[11px] font-mono text-[#a0a0a4] flex items-center justify-between">
          <span>ACTIVE CLIP: <strong class="text-white font-bold">{{ uploadedFileName || sampleVideos.find(s => s.id === selectedVideoId)?.name }}</strong></span>
          <span class="text-[#3d8b5e]">14 EVENTS EXTRACTED · DRESS COLOR INDEXED</span>
        </div>
      </div>

      <!-- Natural Language Attribute Search Input & Quick Filter Chips -->
      <div class="space-y-2">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#750d37] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search attributes, e.g. 'male with white shirt', 'red bag', 'blue jacket'..."
            class="industrial-input pl-9 pr-9 py-2.5 text-xs placeholder-[#555558]"
            aria-label="Search video attributes"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-[#88888c] hover:text-white text-xs font-mono font-bold cursor-pointer"
            aria-label="Clear search query"
          >
            ✕
          </button>
        </div>

        <!-- Quick Filter Chips -->
        <div class="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
          <span class="text-[#88888c] mr-1">QUICK ATTRIBUTE SEARCH:</span>
          <button
            @click="applyFilterChip('male with white shirt')"
            class="px-2 py-0.5 border cursor-pointer transition-all"
            :class="searchQuery.toLowerCase() === 'male with white shirt' ? 'bg-[#750d37] border-[#750d37] text-white font-bold' : 'bg-[#111113] border-[#1e1e20] text-[#a0a0a4] hover:text-white'"
          >
            MALE WITH WHITE SHIRT (4)
          </button>
          <button
            @click="applyFilterChip('blue jacket')"
            class="px-2 py-0.5 border cursor-pointer transition-all"
            :class="searchQuery.toLowerCase() === 'blue jacket' ? 'bg-[#750d37] border-[#750d37] text-white font-bold' : 'bg-[#111113] border-[#1e1e20] text-[#a0a0a4] hover:text-white'"
          >
            BLUE JACKET (1)
          </button>
          <button
            @click="applyFilterChip('red bag')"
            class="px-2 py-0.5 border cursor-pointer transition-all"
            :class="searchQuery.toLowerCase() === 'red bag' ? 'bg-[#750d37] border-[#750d37] text-white font-bold' : 'bg-[#111113] border-[#1e1e20] text-[#a0a0a4] hover:text-white'"
          >
            RED BAG (1)
          </button>
          <button
            @click="applyFilterChip('all')"
            class="px-2 py-0.5 border cursor-pointer transition-all"
            :class="!searchQuery ? 'bg-[#3d8b5e] border-[#3d8b5e] text-white font-bold' : 'bg-[#111113] border-[#1e1e20] text-[#a0a0a4] hover:text-white'"
          >
            SHOW ALL EVENTS (6)
          </button>
        </div>
      </div>

      <!-- Main Split View: Video Player on Left, Search Results on Right -->
      <div class="grid lg:grid-cols-12 gap-4">
        
        <!-- Left: Interactive Video Canvas / Player -->
        <div class="lg:col-span-7 space-y-2">
          <div class="relative bg-[#000000] border border-[#1e1e20] aspect-video flex flex-col justify-between p-3 overflow-hidden group">
            
            <!-- Top Camera Header Info -->
            <div class="relative z-10 flex items-center justify-between font-mono text-[10px]">
              <div class="flex items-center gap-2">
                <span class="live-dot"></span>
                <span class="text-white font-bold">LIVE AI TRACKING</span>
              </div>
              <span class="text-[#3d8b5e] bg-[#3d8b5e]/10 px-2 py-0.5 border border-[#3d8b5e]/30 font-bold">
                FRAME TIME: {{ formatSec(currentTimeSec) }}
              </span>
            </div>

            <!-- Simulated Dynamic AI Bounding Box Overlay -->
            <div
              v-if="activeEvent"
              class="absolute border-2 border-[#750d37] bg-[#750d37]/15 transition-all duration-300 pointer-events-none flex flex-col justify-between p-1.5"
              :style="{
                left: activeEvent.bbox.x + '%',
                top: activeEvent.bbox.y + '%',
                width: activeEvent.bbox.w + '%',
                height: activeEvent.bbox.h + '%'
              }"
            >
              <!-- Bounding Box Header Label -->
              <div class="bg-[#750d37] text-white text-[8px] font-mono font-bold px-1 py-0.5 leading-none self-start">
                {{ activeEvent.gender.toUpperCase() }} · {{ activeEvent.dressColor }} ({{ activeEvent.confidence }}%)
              </div>

              <!-- Corner Brackets -->
              <div class="flex justify-between text-[8px] text-[#750d37] font-mono">
                <span>+</span>
                <span>+</span>
              </div>
            </div>

            <!-- Center Play Indicator Icon if Paused -->
            <div
              @click="togglePlayback"
              class="relative z-10 self-center my-auto cursor-pointer p-3 bg-black/60 border border-[#750d37] rounded-full hover:scale-110 transition-all text-white"
            >
              <svg v-if="!isPlaying" class="w-8 h-8 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"></path>
              </svg>
              <svg v-else class="w-8 h-8 text-[#750d37]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
              </svg>
            </div>

            <!-- Bottom Video Player Scrubber Controls -->
            <div class="relative z-10 space-y-1 bg-[#0a0a0c]/90 p-2 border border-[#1e1e20]">
              <div class="flex items-center justify-between text-[10px] font-mono text-[#a0a0a4]">
                <button @click="togglePlayback" class="text-white font-bold hover:text-[#750d37] cursor-pointer">
                  {{ isPlaying ? 'PAUSE' : 'PLAY' }}
                </button>
                <span>{{ formatSec(currentTimeSec) }} / {{ formatSec(totalDurationSec) }}</span>
              </div>

              <!-- Scrubber Track with Event Markers -->
              <div class="relative w-full h-2 bg-[#111113] border border-[#1e1e20] cursor-pointer" @click="e => {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                const clickX = e.clientX - rect.left
                const pct = clickX / rect.width
                currentTimeSec = Math.floor(pct * totalDurationSec)
              }">
                <div class="bg-[#750d37] h-full" :style="{ width: (currentTimeSec / totalDurationSec * 100) + '%' }"></div>
                
                <!-- Event Timestamp Markers along Scrubber -->
                <div
                  v-for="ev in filteredEvents"
                  :key="ev.id"
                  @click.stop="jumpToTimestamp(ev)"
                  class="absolute top-0 w-2 h-full bg-[#3d8b5e] hover:bg-white transition-all cursor-pointer"
                  :style="{ left: (ev.timestampSec / totalDurationSec * 100) + '%' }"
                  :title="`Jump to ${ev.timeFormatted} (${ev.title})`"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Filtered Video Events List -->
        <div class="lg:col-span-5 flex flex-col justify-between space-y-2 max-h-[360px] overflow-y-auto pr-1">
          <div class="flex items-center justify-between pb-2 border-b border-[#1e1e20] font-mono text-xs">
            <span class="text-white font-bold">// MATCHING EVENTS ({{ filteredEvents.length }})</span>
            <span class="text-[10px] text-[#3d8b5e]">CLICK TO JUMP</span>
          </div>

          <div v-if="filteredEvents.length === 0" class="p-6 text-center text-xs font-mono text-[#88888c] bg-[#0a0a0c] border border-[#1e1e20]">
            No matching events found for "{{ searchQuery }}". Try searching "male", "white shirt", or "blue jacket".
          </div>

          <div
            v-for="ev in filteredEvents"
            :key="ev.id"
            @click="jumpToTimestamp(ev)"
            class="p-3 bg-[#0a0a0c] border transition-all cursor-pointer space-y-1.5 hover:border-[#750d37]"
            :class="activeEventId === ev.id ? 'border-[#750d37] bg-[#750d37]/10' : 'border-[#1e1e20]'"
          >
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 bg-[#750d37]/20 border border-[#750d37]/60 text-[10px] font-mono text-white font-bold">
                ⏱ {{ ev.timeFormatted }}
              </span>
              <span class="text-[9px] font-mono text-[#3d8b5e] font-bold">
                {{ ev.confidence }}% CONFIDENCE
              </span>
            </div>

            <div class="text-xs font-bold text-white uppercase">{{ ev.title }}</div>

            <div class="p-2 bg-[#111113] border border-[#1e1e20] font-mono text-[10px] text-[#c8c8cc] space-y-0.5">
              <div><strong class="text-[#9a1a4e]">DRESS COLOR:</strong> {{ ev.dressColor }}</div>
              <div><strong class="text-[#88888c]">LOCATION:</strong> {{ ev.location }}</div>
              <div><strong class="text-[#88888c]">ACTION:</strong> {{ ev.action }}</div>
            </div>

            <button
              class="w-full py-1 bg-[#111113] hover:bg-[#750d37] text-white font-mono text-[10px] font-bold tracking-wider transition-all border border-[#1e1e20] flex items-center justify-center gap-1 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5 text-[#3d8b5e]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"></path>
              </svg>
              <span>JUMP TO {{ ev.timeFormatted }} MOMENT IN VIDEO</span>
            </button>
          </div>
        </div>
      </div>
      </div>

    </div>
  </div>
</template>
