<script setup lang="ts">
import { computed, ref } from 'vue'

/**
 * What the current setup costs, using the buyer's own numbers.
 *
 * Asserting "you are losing ₹X" would be a guess about someone else's business.
 * The inputs are theirs and every assumption is on screen and adjustable, so the
 * figure is arguable rather than claimed. The bars share one scale and one unit,
 * which is the only case a direct comparison is honest.
 */

const guards = ref(6)
const wage = ref(18000)
const turnover = ref(50)
const branches = ref(3)

/** Editable assumptions, stated rather than buried. */
const shrinkRate = ref(1.5)
const guardsAfter = ref(2)
const shrinkCut = ref(40)

const inr = (n: number) =>
  n >= 10000000
    ? `₹${(n / 10000000).toFixed(2)} Cr`
    : n >= 100000
      ? `₹${(n / 100000).toFixed(1)} L`
      : `₹${Math.round(n).toLocaleString('en-IN')}`

const guardCostNow = computed(() => guards.value * wage.value * 12)
const guardCostAfter = computed(() => guardsAfter.value * wage.value * 12)
const shrinkNow = computed(() => (turnover.value * 10000000 * shrinkRate.value) / 100)
const shrinkAfter = computed(() => shrinkNow.value * (1 - shrinkCut.value / 100))

const totalNow = computed(() => guardCostNow.value + shrinkNow.value)
const totalAfter = computed(() => guardCostAfter.value + shrinkAfter.value)
const saving = computed(() => totalNow.value - totalAfter.value)
const pct = computed(() => (totalNow.value ? Math.round((saving.value / totalNow.value) * 100) : 0))

/** Bars are drawn against the larger of the two, so the ratio is not distorted. */
const barNow = computed(() => 100)
const barAfter = computed(() => (totalNow.value ? (totalAfter.value / totalNow.value) * 100 : 0))
</script>

<template>
  <section
    id="cost"
    class="py-10 md:py-20 px-4 md:px-12 lg:px-20 border-t border-[#1e1e20] bg-[#0a0a0c]"
  >
    <div class="max-w-7xl mx-auto">
      <div class="section-tag mb-3 text-xs sm:text-sm font-bold">// WHAT IT COSTS TO CHANGE NOTHING</div>
      <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.15] mb-3">
        PUT YOUR OWN NUMBERS IN.<br />
        <span style="color: #750d37">SEE WHAT THIS YEAR COSTS.</span>
      </h2>
      <p class="text-[#c8c8cc] text-sm sm:text-base leading-relaxed max-w-2xl mb-8">
        Guards on payroll and stock going missing are the two you can put a figure on.
        Change anything below — the assumptions are yours to argue with.
      </p>

      <div class="grid lg:grid-cols-5 gap-4 md:gap-6">
        <!-- Inputs -->
        <div class="lg:col-span-2 industrial-card bg-[#111113] p-5 space-y-5">
          <div>
            <label for="c-guards" class="flex items-baseline justify-between font-mono text-xs text-[#c8c8cc] mb-1.5">
              <span>Guards on payroll</span>
              <span class="text-white font-bold tabular-nums">{{ guards }}</span>
            </label>
            <input id="c-guards" v-model.number="guards" type="range" min="0" max="40" class="w-full accent-[#e02870]" />
          </div>

          <div>
            <label for="c-wage" class="flex items-baseline justify-between font-mono text-xs text-[#c8c8cc] mb-1.5">
              <span>Cost per guard, per month</span>
              <span class="text-white font-bold tabular-nums">{{ inr(wage) }}</span>
            </label>
            <input id="c-wage" v-model.number="wage" type="range" min="8000" max="45000" step="1000" class="w-full accent-[#e02870]" />
          </div>

          <div>
            <label for="c-turnover" class="flex items-baseline justify-between font-mono text-xs text-[#c8c8cc] mb-1.5">
              <span>Annual turnover</span>
              <span class="text-white font-bold tabular-nums">₹{{ turnover }} Cr</span>
            </label>
            <input id="c-turnover" v-model.number="turnover" type="range" min="1" max="500" class="w-full accent-[#e02870]" />
          </div>

          <div>
            <label for="c-branches" class="flex items-baseline justify-between font-mono text-xs text-[#c8c8cc] mb-1.5">
              <span>Branches</span>
              <span class="text-white font-bold tabular-nums">{{ branches }}</span>
            </label>
            <input id="c-branches" v-model.number="branches" type="range" min="1" max="50" class="w-full accent-[#e02870]" />
          </div>

          <details class="pt-2 border-t border-[#1e1e20]">
            <summary class="font-mono text-[11px] text-[#88888c] cursor-pointer hover:text-white">
              Assumptions — change these too
            </summary>
            <div class="space-y-4 mt-3">
              <div>
                <label for="c-shrink" class="flex items-baseline justify-between font-mono text-[11px] text-[#c8c8cc] mb-1">
                  <span>Stock loss, as % of turnover</span>
                  <span class="text-white font-bold tabular-nums">{{ shrinkRate }}%</span>
                </label>
                <input id="c-shrink" v-model.number="shrinkRate" type="range" min="0" max="5" step="0.1" class="w-full accent-[#4a7ebb]" />
              </div>
              <div>
                <label for="c-after" class="flex items-baseline justify-between font-mono text-[11px] text-[#c8c8cc] mb-1">
                  <span>Guards still needed after</span>
                  <span class="text-white font-bold tabular-nums">{{ guardsAfter }}</span>
                </label>
                <input id="c-after" v-model.number="guardsAfter" type="range" min="0" :max="guards" class="w-full accent-[#4a7ebb]" />
              </div>
              <div>
                <label for="c-cut" class="flex items-baseline justify-between font-mono text-[11px] text-[#c8c8cc] mb-1">
                  <span>Stock loss prevented</span>
                  <span class="text-white font-bold tabular-nums">{{ shrinkCut }}%</span>
                </label>
                <input id="c-cut" v-model.number="shrinkCut" type="range" min="0" max="90" step="5" class="w-full accent-[#4a7ebb]" />
              </div>
            </div>
          </details>
        </div>

        <!-- Result -->
        <div class="lg:col-span-3 industrial-card bg-[#111113] p-5 flex flex-col">
          <div class="mb-5">
            <div class="font-mono text-[11px] text-[#88888c] uppercase tracking-wider">Saved in a year</div>
            <div class="text-4xl sm:text-5xl font-black text-[#3d8b5e] tabular-nums mt-1">{{ inr(saving) }}</div>
            <div class="font-mono text-xs text-[#c8c8cc] mt-1">
              {{ pct }}% less, across {{ branches }} {{ branches === 1 ? 'branch' : 'branches' }}
            </div>
          </div>

          <!-- Two bars, one scale, one unit -->
          <div class="space-y-4 mb-5">
            <div>
              <div class="flex items-baseline justify-between font-mono text-xs mb-1.5">
                <span class="text-[#c8c8cc]">As things are</span>
                <span class="text-white font-bold tabular-nums">{{ inr(totalNow) }}</span>
              </div>
              <div class="h-7 bg-[#0a0a0c] overflow-hidden">
                <div class="h-full bg-[#e02870] transition-[width] duration-300" :style="{ width: `${barNow}%` }"></div>
              </div>
            </div>
            <div>
              <div class="flex items-baseline justify-between font-mono text-xs mb-1.5">
                <span class="text-[#c8c8cc]">With Shadowverse</span>
                <span class="text-white font-bold tabular-nums">{{ inr(totalAfter) }}</span>
              </div>
              <div class="h-7 bg-[#0a0a0c] overflow-hidden">
                <div class="h-full bg-[#4a7ebb] transition-[width] duration-300" :style="{ width: `${barAfter}%` }"></div>
              </div>
            </div>
          </div>

          <!-- Where it comes from -->
          <div class="grid sm:grid-cols-2 gap-3 font-mono text-xs mt-auto">
            <div class="p-3 bg-[#0a0a0c] border-l-2 border-l-[#e02870]">
              <div class="text-[#88888c] text-[10px] uppercase tracking-wider">Guarding</div>
              <div class="text-white font-bold tabular-nums mt-0.5">{{ inr(guardCostNow) }} → {{ inr(guardCostAfter) }}</div>
            </div>
            <div class="p-3 bg-[#0a0a0c] border-l-2 border-l-[#4a7ebb]">
              <div class="text-[#88888c] text-[10px] uppercase tracking-wider">Stock loss</div>
              <div class="text-white font-bold tabular-nums mt-0.5">{{ inr(shrinkNow) }} → {{ inr(shrinkAfter) }}</div>
            </div>
          </div>

          <p class="font-mono text-[10px] text-[#88888c] mt-4 leading-relaxed">
            Rough figures from your inputs, not a quote. Not counted here: injury claims, insurance
            excess, or the hours spent scrubbing footage after something happens.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
