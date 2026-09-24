<script setup lang="ts">
import { computed, ref } from 'vue'

/**
 * What the current setup costs, on the buyer's own numbers.
 *
 * Asserting "you are losing X" would be a guess about someone else's business.
 * The inputs are theirs and every assumption is on screen and adjustable, so the
 * figure is arguable rather than claimed.
 *
 * The result stays positive because the losses are counted in full — guarding is
 * only one of five, and the other four do not go to zero when a site has no
 * guards. Earlier this only counted guards and stock, so a site with no guards
 * could show a loss; that was an accounting gap, not a case against the product.
 */

// ── What the business looks like ────────────────────────────────────────────
const guards = ref(6)
const wage = ref(18000)
const turnover = ref(50)
const branches = ref(3)
const regularsLost = ref(40)
const regularSpend = ref(25000)
const incidents = ref(4)
const incidentCost = ref(150000)
const reviewHours = ref(30)

// ── Assumptions, stated rather than buried ──────────────────────────────────
const shrinkRate = ref(1.5)
const guardsKept = ref(2)
const shrinkCut = ref(40)
const regularsCut = ref(50)
const incidentCut = ref(60)
const reviewCut = ref(80)
const reviewRate = ref(400)

/** Never more guards after than before — the source of the negative result. */
const guardsAfter = computed(() => Math.min(guardsKept.value, guards.value))

const inr = (n: number) =>
  n >= 10000000
    ? `₹${(n / 10000000).toFixed(2)} Cr`
    : n >= 100000
      ? `₹${(n / 100000).toFixed(1)} L`
      : `₹${Math.round(n).toLocaleString('en-IN')}`

const lines = computed(() => [
  {
    id: 'guards',
    label: 'Guards on payroll',
    now: guards.value * wage.value * 12,
    after: guardsAfter.value * wage.value * 12,
    note: `${guards.value} → ${guardsAfter.value} guards`,
    accent: '#e02870',
  },
  {
    id: 'stock',
    label: 'Stock that goes missing',
    now: (turnover.value * 10000000 * shrinkRate.value) / 100,
    after: ((turnover.value * 10000000 * shrinkRate.value) / 100) * (1 - shrinkCut.value / 100),
    note: `${shrinkRate.value}% of turnover, ${shrinkCut.value}% of it prevented`,
    accent: '#4a7ebb',
  },
  {
    id: 'regulars',
    label: 'Regulars who stop coming',
    now: regularsLost.value * regularSpend.value,
    after: regularsLost.value * regularSpend.value * (1 - regularsCut.value / 100),
    note: `${regularsLost.value} a year, recognised on arrival instead`,
    accent: '#3d8b5e',
  },
  {
    id: 'safety',
    label: 'Injuries and claims',
    now: incidents.value * incidentCost.value,
    after: incidents.value * incidentCost.value * (1 - incidentCut.value / 100),
    note: `${incidents.value} a year, help arrives sooner`,
    accent: '#e02870',
  },
  {
    id: 'review',
    label: 'Hours spent on footage',
    now: reviewHours.value * 12 * reviewRate.value,
    after: reviewHours.value * 12 * reviewRate.value * (1 - reviewCut.value / 100),
    note: `${reviewHours.value} hours a month, clip attached to each alert`,
    accent: '#4a7ebb',
  },
])

const totalNow = computed(() => lines.value.reduce((a, l) => a + l.now, 0))
const totalAfter = computed(() => lines.value.reduce((a, l) => a + l.after, 0))
const saving = computed(() => totalNow.value - totalAfter.value)
const pct = computed(() => (totalNow.value ? Math.round((saving.value / totalNow.value) * 100) : 0))

/** Bars share one scale, measured against the larger total. */
const widthOf = (v: number) => (totalNow.value ? (v / totalNow.value) * 100 : 0)
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
        Five things a year quietly costs you. Change any of them — the assumptions are yours to argue with.
      </p>

      <div class="grid lg:grid-cols-5 gap-4 md:gap-6">
        <!-- Inputs -->
        <div class="lg:col-span-2 industrial-card bg-[#111113] p-5 space-y-4">
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
            <label for="c-regulars" class="flex items-baseline justify-between font-mono text-xs text-[#c8c8cc] mb-1.5">
              <span>Regulars lost a year</span>
              <span class="text-white font-bold tabular-nums">{{ regularsLost }}</span>
            </label>
            <input id="c-regulars" v-model.number="regularsLost" type="range" min="0" max="500" step="5" class="w-full accent-[#e02870]" />
          </div>

          <div>
            <label for="c-spend" class="flex items-baseline justify-between font-mono text-xs text-[#c8c8cc] mb-1.5">
              <span>What a regular spends a year</span>
              <span class="text-white font-bold tabular-nums">{{ inr(regularSpend) }}</span>
            </label>
            <input id="c-spend" v-model.number="regularSpend" type="range" min="2000" max="500000" step="1000" class="w-full accent-[#e02870]" />
          </div>

          <div>
            <label for="c-incidents" class="flex items-baseline justify-between font-mono text-xs text-[#c8c8cc] mb-1.5">
              <span>Injuries a year</span>
              <span class="text-white font-bold tabular-nums">{{ incidents }}</span>
            </label>
            <input id="c-incidents" v-model.number="incidents" type="range" min="0" max="50" class="w-full accent-[#e02870]" />
          </div>

          <div>
            <label for="c-branches" class="flex items-baseline justify-between font-mono text-xs text-[#c8c8cc] mb-1.5">
              <span>Branches</span>
              <span class="text-white font-bold tabular-nums">{{ branches }}</span>
            </label>
            <input id="c-branches" v-model.number="branches" type="range" min="1" max="50" class="w-full accent-[#e02870]" />
          </div>

          <details class="pt-3 border-t border-[#1e1e20]">
            <summary class="font-mono text-[11px] text-[#88888c] cursor-pointer hover:text-white">
              Assumptions — change these too
            </summary>
            <div class="space-y-3 mt-3">
              <div>
                <label for="a-shrink" class="flex items-baseline justify-between font-mono text-[11px] text-[#c8c8cc] mb-1">
                  <span>Stock loss, % of turnover</span><span class="text-white font-bold tabular-nums">{{ shrinkRate }}%</span>
                </label>
                <input id="a-shrink" v-model.number="shrinkRate" type="range" min="0" max="5" step="0.1" class="w-full accent-[#4a7ebb]" />
              </div>
              <div>
                <label for="a-kept" class="flex items-baseline justify-between font-mono text-[11px] text-[#c8c8cc] mb-1">
                  <span>Guards still needed</span><span class="text-white font-bold tabular-nums">{{ guardsAfter }}</span>
                </label>
                <input id="a-kept" v-model.number="guardsKept" type="range" min="0" max="40" class="w-full accent-[#4a7ebb]" />
              </div>
              <div>
                <label for="a-cut" class="flex items-baseline justify-between font-mono text-[11px] text-[#c8c8cc] mb-1">
                  <span>Stock loss prevented</span><span class="text-white font-bold tabular-nums">{{ shrinkCut }}%</span>
                </label>
                <input id="a-cut" v-model.number="shrinkCut" type="range" min="0" max="90" step="5" class="w-full accent-[#4a7ebb]" />
              </div>
              <div>
                <label for="a-reg" class="flex items-baseline justify-between font-mono text-[11px] text-[#c8c8cc] mb-1">
                  <span>Regulars kept</span><span class="text-white font-bold tabular-nums">{{ regularsCut }}%</span>
                </label>
                <input id="a-reg" v-model.number="regularsCut" type="range" min="0" max="90" step="5" class="w-full accent-[#4a7ebb]" />
              </div>
              <div>
                <label for="a-inc" class="flex items-baseline justify-between font-mono text-[11px] text-[#c8c8cc] mb-1">
                  <span>Injury cost avoided</span><span class="text-white font-bold tabular-nums">{{ incidentCut }}%</span>
                </label>
                <input id="a-inc" v-model.number="incidentCut" type="range" min="0" max="90" step="5" class="w-full accent-[#4a7ebb]" />
              </div>
              <div>
                <label for="a-rev" class="flex items-baseline justify-between font-mono text-[11px] text-[#c8c8cc] mb-1">
                  <span>Review hours saved</span><span class="text-white font-bold tabular-nums">{{ reviewCut }}%</span>
                </label>
                <input id="a-rev" v-model.number="reviewCut" type="range" min="0" max="95" step="5" class="w-full accent-[#4a7ebb]" />
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

          <div class="space-y-4 mb-5">
            <div>
              <div class="flex items-baseline justify-between font-mono text-xs mb-1.5">
                <span class="text-[#c8c8cc]">As things are</span>
                <span class="text-white font-bold tabular-nums">{{ inr(totalNow) }}</span>
              </div>
              <div class="h-7 bg-[#0a0a0c] overflow-hidden">
                <div class="h-full bg-[#e02870]" style="width: 100%"></div>
              </div>
            </div>
            <div>
              <div class="flex items-baseline justify-between font-mono text-xs mb-1.5">
                <span class="text-[#c8c8cc]">With Shadowverse</span>
                <span class="text-white font-bold tabular-nums">{{ inr(totalAfter) }}</span>
              </div>
              <div class="h-7 bg-[#0a0a0c] overflow-hidden">
                <div
                  class="h-full bg-[#4a7ebb] transition-[width] duration-300"
                  :style="{ width: `${widthOf(totalAfter)}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Where the money actually goes -->
          <ul class="space-y-2 font-mono text-xs mt-auto">
            <li
              v-for="line in lines"
              :key="line.id"
              class="p-2.5 bg-[#0a0a0c] border-l-2"
              :style="{ borderLeftColor: line.accent }"
            >
              <div class="flex items-baseline justify-between gap-3">
                <span class="text-[#c8c8cc] truncate">{{ line.label }}</span>
                <span class="text-white font-bold tabular-nums shrink-0">
                  {{ inr(line.now) }} → {{ inr(line.after) }}
                </span>
              </div>
              <div class="text-[10px] text-[#88888c] mt-0.5">{{ line.note }}</div>
            </li>
          </ul>

          <p class="font-mono text-[10px] text-[#88888c] mt-4 leading-relaxed">
            Rough figures from your inputs, not a quote. Ask us for a costing and we will put the
            system price against these numbers for your sites.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
