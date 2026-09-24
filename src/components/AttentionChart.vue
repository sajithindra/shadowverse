<script setup lang="ts">
import { ref, computed } from 'vue'

/**
 * Share of incidents still being caught as a shift wears on.
 *
 * Two series, one unit, one axis — the case a line chart is actually for.
 * Colours are the deck's existing #e02870 and #4a7ebb, which pass the six
 * palette checks together (CVD ΔE 13.6 protan, 27.8 normal); the red/green
 * pairing this replaced failed deuteranopia separation at ΔE 4.0.
 */

const HOURS = [0, 1, 2, 4, 6, 8]
const guard = [100, 85, 55, 30, 18, 12]
const system = [98, 98, 98, 98, 98, 98]

const GUARD = '#4a7ebb'
const SYSTEM = '#e02870'

// Plot geometry
const W = 640
const H = 260
const PAD = { top: 18, right: 92, bottom: 34, left: 40 }

const x = (h: number) => PAD.left + (h / 8) * (W - PAD.left - PAD.right)
const y = (v: number) => PAD.top + (1 - v / 100) * (H - PAD.top - PAD.bottom)

const path = (vals: number[]) =>
  vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(HOURS[i]!)} ${y(v)}`).join(' ')

const guardPath = computed(() => path(guard))
const systemPath = computed(() => path(system))

/** Area under the guard line, to show the widening gap rather than state it. */
const gapPath = computed(() => {
  const top = HOURS.map((h, i) => `${i === 0 ? 'M' : 'L'} ${x(h)} ${y(system[i]!)}`).join(' ')
  const back = [...HOURS].reverse().map((h, i) => `L ${x(h)} ${y([...guard].reverse()[i]!)}`).join(' ')
  return `${top} ${back} Z`
})

const hover = ref<number | null>(null)
const active = computed(() => (hover.value === null ? null : {
  hour: HOURS[hover.value]!,
  guard: guard[hover.value]!,
  system: system[hover.value]!,
}))
</script>

<template>
  <figure class="industrial-card bg-[#0a0a0c] p-4 sm:p-6 shadow-xl m-0">
    <figcaption class="mb-4">
      <h3 class="text-white font-black text-base sm:text-lg tracking-tight">
        What still gets noticed, hour by hour
      </h3>
      <p class="text-[#88888c] text-xs mt-1">
        Share of incidents caught across one eight-hour shift.
      </p>
    </figcaption>

    <!-- Legend: always present for two series, and both are directly labelled -->
    <div class="flex flex-wrap items-center gap-4 mb-2 font-mono text-[11px]">
      <span class="flex items-center gap-1.5 text-[#c8c8cc]">
        <span class="w-3 h-0.5 inline-block" :style="{ background: SYSTEM }"></span>
        Shadowverse
      </span>
      <span class="flex items-center gap-1.5 text-[#c8c8cc]">
        <span class="w-3 h-0.5 inline-block" :style="{ background: GUARD }"></span>
        Person watching screens
      </span>
    </div>

    <svg :viewBox="`0 0 ${W} ${H}`" class="w-full h-auto" role="img"
         aria-label="Incidents caught over an eight hour shift: a person watching screens falls from 100 percent to 12 percent, while Shadowverse holds at 98 percent.">
      <!-- Recessive grid -->
      <g stroke="#1e1e20" stroke-width="1">
        <line v-for="v in [0, 25, 50, 75, 100]" :key="v"
              :x1="PAD.left" :x2="W - PAD.right" :y1="y(v)" :y2="y(v)" />
      </g>
      <g fill="#88888c" font-size="10" font-family="monospace">
        <text v-for="v in [0, 50, 100]" :key="v" :x="PAD.left - 8" :y="y(v) + 3" text-anchor="end">{{ v }}%</text>
        <text v-for="h in HOURS" :key="h" :x="x(h)" :y="H - 14" text-anchor="middle">{{ h }}h</text>
      </g>

      <!-- The gap between the two, so the divergence is visible not just stated -->
      <path :d="gapPath" :fill="SYSTEM" opacity="0.07" />

      <path :d="systemPath" fill="none" :stroke="SYSTEM" stroke-width="2" />
      <path :d="guardPath" fill="none" :stroke="GUARD" stroke-width="2" />

      <g>
        <circle v-for="(v, i) in system" :key="`s${i}`" :cx="x(HOURS[i]!)" :cy="y(v)" r="4"
                :fill="SYSTEM" stroke="#0a0a0c" stroke-width="2" />
        <circle v-for="(v, i) in guard" :key="`g${i}`" :cx="x(HOURS[i]!)" :cy="y(v)" r="4"
                :fill="GUARD" stroke="#0a0a0c" stroke-width="2" />
      </g>

      <!-- Direct labels at the line ends -->
      <g font-family="monospace" font-size="11" font-weight="bold">
        <text :x="x(8) + 10" :y="y(98) + 4" :fill="SYSTEM">98%</text>
        <text :x="x(8) + 10" :y="y(12) + 4" :fill="GUARD">12%</text>
      </g>

      <!-- Hover targets, wider than the marks -->
      <g>
        <rect v-for="(h, i) in HOURS" :key="`h${i}`"
              :x="x(h) - 22" :y="PAD.top - 10" width="44" :height="H - PAD.top - PAD.bottom + 20"
              fill="transparent" @mouseenter="hover = i" @mouseleave="hover = null" />
      </g>
      <line v-if="hover !== null" :x1="x(HOURS[hover]!)" :x2="x(HOURS[hover]!)"
            :y1="PAD.top" :y2="H - PAD.bottom" stroke="#88888c" stroke-width="1" stroke-dasharray="3 3" />
    </svg>

    <p v-if="active" class="font-mono text-[11px] text-[#c8c8cc] mt-1" aria-live="polite">
      At {{ active.hour }}h — Shadowverse <strong :style="{ color: SYSTEM }">{{ active.system }}%</strong>,
      person watching <strong :style="{ color: GUARD }">{{ active.guard }}%</strong>
    </p>
    <p v-else class="font-mono text-[11px] text-[#88888c] mt-1">
      By hour six, roughly four in five incidents are going unnoticed.
    </p>

    <!-- Table view, so the figures are available without reading the chart -->
    <details class="mt-3">
      <summary class="font-mono text-[11px] text-[#88888c] cursor-pointer hover:text-white">
        See the numbers
      </summary>
      <table class="w-full mt-2 font-mono text-[11px] text-[#c8c8cc]">
        <thead>
          <tr class="text-[#88888c] text-left">
            <th class="font-normal py-1">Hour</th>
            <th class="font-normal py-1">Person watching</th>
            <th class="font-normal py-1">Shadowverse</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(h, i) in HOURS" :key="h" class="border-t border-[#1e1e20]">
            <td class="py-1">{{ h }}h</td>
            <td class="py-1">{{ guard[i] }}%</td>
            <td class="py-1">{{ system[i] }}%</td>
          </tr>
        </tbody>
      </table>
    </details>
  </figure>
</template>
