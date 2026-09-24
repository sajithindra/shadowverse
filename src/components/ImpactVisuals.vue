<script setup lang="ts">
import { computed, ref } from 'vue'

/**
 * Two figures that carry what the copy used to spell out.
 *
 * Left: what the alerts actually are in a month — part-to-whole, four segments,
 * which is what a donut is for. A two-slice pie would have been a stat tile
 * instead.
 *
 * Right: how much one person can really keep an eye on. The honest form for a
 * ratio this lopsided is a dot grid, not a bar — at 6 against 200 a bar chart
 * renders one mark as a hairline and reads as a mistake.
 *
 * Colours are the deck's own #e02870 / #4a7ebb / #3d8b5e, which pass all six
 * palette checks together; a neutral carries "everything else".
 */

const segments = [
  { label: 'Theft & stock loss', value: 42, color: '#e02870' },
  { label: 'People in restricted areas', value: 27, color: '#4a7ebb' },
  { label: 'Safety incidents', value: 19, color: '#3d8b5e' },
  { label: 'Everything else', value: 12, color: '#5a5a60' },
]

const R = 70
const STROKE = 26
const C = 2 * Math.PI * R
const hover = ref<number | null>(null)

/** Each arc gets a 2px surface gap, so adjacent fills never touch. */
const arcs = computed(() => {
  let offset = 0
  return segments.map((s) => {
    const len = (s.value / 100) * C
    const arc = { ...s, dash: `${Math.max(len - 2, 1)} ${C - Math.max(len - 2, 1)}`, offset: -offset }
    offset += len
    return arc
  })
})

// Dot grid: 200 cameras, of which one person realistically follows about six.
const TOTAL = 200
const WATCHED = 6
const dots = Array.from({ length: TOTAL }, (_, i) => i)
</script>

<template>
  <div class="grid lg:grid-cols-2 gap-4 md:gap-6">
    <!-- Part-to-whole: what the alerts are -->
    <figure class="industrial-card bg-[#0a0a0c] p-4 sm:p-6 shadow-xl m-0">
      <figcaption class="mb-4">
        <h3 class="text-white font-black text-base sm:text-lg tracking-tight">What the alerts turn out to be</h3>
        <p class="text-[#88888c] text-xs mt-1">A typical month across a retail group.</p>
      </figcaption>

      <div class="flex flex-col sm:flex-row items-center gap-5">
        <svg viewBox="0 0 200 200" class="w-40 h-40 shrink-0 -rotate-90" role="img"
             aria-label="Alert breakdown: theft and stock loss 42 percent, people in restricted areas 27 percent, safety incidents 19 percent, everything else 12 percent.">
          <circle
            v-for="(a, i) in arcs"
            :key="a.label"
            cx="100" cy="100" :r="R"
            fill="none"
            :stroke="a.color"
            :stroke-width="hover === i ? STROKE + 6 : STROKE"
            :stroke-dasharray="a.dash"
            :stroke-dashoffset="a.offset"
            class="transition-[stroke-width] duration-150"
            @mouseenter="hover = i"
            @mouseleave="hover = null"
          />
        </svg>

        <!-- Legend, always present, each value direct-labelled -->
        <ul class="w-full space-y-2 font-mono text-xs">
          <li
            v-for="(s, i) in segments"
            :key="s.label"
            class="flex items-center gap-2.5"
            @mouseenter="hover = i"
            @mouseleave="hover = null"
          >
            <span class="w-2.5 h-2.5 shrink-0" :style="{ background: s.color }"></span>
            <span class="text-[#c8c8cc] flex-1 min-w-0 truncate">{{ s.label }}</span>
            <span class="text-white font-bold tabular-nums">{{ s.value }}%</span>
          </li>
        </ul>
      </div>
    </figure>

    <!-- Ratio: what one person can actually cover -->
    <figure class="industrial-card bg-[#0a0a0c] p-4 sm:p-6 shadow-xl m-0">
      <figcaption class="mb-4">
        <h3 class="text-white font-black text-base sm:text-lg tracking-tight">
          One person, two hundred cameras
        </h3>
        <p class="text-[#88888c] text-xs mt-1">
          Each square is a camera. The lit ones are what a person can realistically follow at once.
        </p>
      </figcaption>

      <div class="grid grid-cols-20 gap-[3px] mb-4" style="grid-template-columns: repeat(20, minmax(0, 1fr))"
           role="img" aria-label="Of two hundred cameras, about six can be followed by one person at a time.">
        <span
          v-for="d in dots"
          :key="d"
          class="aspect-square"
          :style="{ background: d < WATCHED ? '#e02870' : '#1e1e20' }"
        ></span>
      </div>

      <div class="flex items-baseline gap-5 font-mono">
        <div>
          <div class="text-2xl font-black text-[#e02870] tabular-nums">{{ WATCHED }}</div>
          <div class="text-[10px] text-[#88888c] uppercase tracking-wider">Watched by a person</div>
        </div>
        <div>
          <div class="text-2xl font-black text-white tabular-nums">{{ TOTAL }}</div>
          <div class="text-[10px] text-[#88888c] uppercase tracking-wider">Watched by Shadowverse</div>
        </div>
      </div>
    </figure>
  </div>
</template>
