<script setup lang="ts">
import { ref, computed } from 'vue'

const activeFilter = ref<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL')
const visitors = ref([
  { id: 'VIS-9021', name: 'ARJUN MEHTA', time: '09:14 AM', category: 'CONTRACTOR', visits: 12, risk: 'LOW', status: 'CLEARED', action: 'LOGGED' },
  { id: 'VIS-9022', name: 'UNREGISTERED VISITOR', time: '10:47 PM', category: 'UNAUTHORIZED', visits: 1, risk: 'HIGH', status: 'ALERT_DISPATCHED', action: 'OWNER_CALLED' },
  { id: 'VIS-9023', name: 'PRIYA SHARMA', time: '02:30 PM', category: 'SERVICE STAFF', visits: 4, risk: 'MEDIUM', status: 'MONITORING', action: 'ZONE_TRACKED' },
  { id: 'VIS-9024', name: 'DELIVERY AGENT #4421', time: '11:05 AM', category: 'COURIER', visits: 2, risk: 'LOW', status: 'CLEARED', action: 'LOGGED' },
  { id: 'VIS-9025', name: 'HOUSEKEEPER (SIDE GATE)', time: '07:15 AM', category: 'STAFF', visits: 148, risk: 'LOW', status: 'CLEARED', action: 'ZONE_LIMITED' },
])

const filteredVisitors = computed(() => {
  if (activeFilter.value === 'ALL') return visitors.value
  return visitors.value.filter(v => v.risk === activeFilter.value)
})
</script>

<template>
  <section id="scenarios" class="py-12 md:py-24 px-4 md:px-12 lg:px-20 border-t border-[#1e1e20] bg-[#0a0a0c]">
    <div class="max-w-7xl mx-auto space-y-8 md:space-y-16">
      <div class="flex flex-col items-start">
        <div class="section-tag mb-3 md:mb-4">// VISITOR RISK & AGENT MATRIX</div>
        <h2 class="text-xl md:text-5xl font-black uppercase tracking-tight">
          REAL-TIME VISITOR PROFILING<br/>
          <span style="color: #750d37">& REPEATED VISIT TRACKING.</span>
        </h2>
      </div>

      <div class="industrial-card p-4 md:p-8 space-y-4 md:space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1e1e20]">
          <div>
            <h3 class="text-sm md:text-lg font-black uppercase text-white">VISITOR RISK PROFILING WATCHLIST</h3>
            <p class="text-[10px] md:text-xs font-mono text-[#a0a0a4]">AUTOMATICALLY SCORED BY SHADOWVISION VISITOR AI AGENT</p>
          </div>
          <div class="flex flex-wrap gap-1.5 font-mono text-[10px] md:text-xs">
            <button
              v-for="cat in ['ALL', 'HIGH', 'MEDIUM', 'LOW']"
              :key="cat"
              @click="activeFilter = cat as any"
              class="px-2.5 py-1 border transition-all uppercase"
              :class="activeFilter === cat ? 'bg-[#750d37] border-[#750d37] text-white font-bold' : 'bg-[#0a0a0c] border-[#1e1e20] text-[#a0a0a4] hover:text-white'"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left font-mono text-[11px] md:text-xs min-w-[550px]">
            <thead>
              <tr class="border-b border-[#1e1e20] text-[#555558] uppercase">
                <th class="py-2.5 px-3">VISITOR ID</th>
                <th class="py-2.5 px-3">NAME / IDENTITY</th>
                <th class="py-2.5 px-3">TIME RECORDED</th>
                <th class="py-2.5 px-3">REPEATED VISIT COUNT</th>
                <th class="py-2.5 px-3">RISK LEVEL</th>
                <th class="py-2.5 px-3">AI ACTION TAKEN</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#1e1e20]">
              <tr v-for="v in filteredVisitors" :key="v.id" class="hover:bg-[#111113] transition-colors">
                <td class="py-2.5 px-3 text-[#750d37] font-bold">{{ v.id }}</td>
                <td class="py-2.5 px-3 text-white font-semibold">{{ v.name }}</td>
                <td class="py-2.5 px-3 text-[#a0a0a4]">{{ v.time }}</td>
                <td class="py-2.5 px-3 text-white font-bold">{{ v.visits }} Visits</td>
                <td class="py-2.5 px-3">
                  <span
                    class="px-2 py-0.5 font-bold tracking-wider text-[9px] uppercase"
                    :class="{
                      'bg-[#c44a4a]/20 text-[#c44a4a] border border-[#c44a4a]/40': v.risk === 'HIGH',
                      'bg-[#c49a3c]/20 text-[#c49a3c] border border-[#c49a3c]/40': v.risk === 'MEDIUM',
                      'bg-[#3d8b5e]/20 text-[#3d8b5e] border border-[#3d8b5e]/40': v.risk === 'LOW',
                    }"
                  >
                    {{ v.risk }} RISK
                  </span>
                </td>
                <td class="py-2.5 px-3 text-[#e8e8ea] font-semibold">{{ v.action }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div
          v-for="agent in [
            { name: 'FALL DETECTION AGENT', desc: 'Monitors movement & posture. If fall detected and no movement in 3 mins, triggers emergency call & ambulance dispatch.' },
            { name: 'WASHROOM TIMEOUT AGENT', desc: 'Calculates customary duration per individual. Sends emergency alerts if stay exceeds custom threshold.' },
            { name: 'AFTER-HOURS VISITOR AGENT', desc: 'Flags any unverified visitor arriving after 9:30 PM. Instantly notifies phone with facial snapshot.' },
            { name: 'UNAUTHORIZED ROOM AGENT', desc: 'Monitors restricted areas like master rooms, safes, or server vaults. Alerts when accessed by unauthorized staff.' },
            { name: 'PET & BEHAVIOUR AGENT', desc: 'Tracks pet movement across zones. Logs who talked to who, waiting times, and phone usage in restricted areas.' },
            { name: 'VISITOR RISK PROFILER', desc: 'Profiles incoming visitors. Scores risk LOW/MEDIUM/HIGH based on visit frequency, timing, and watchlist.' },
          ]"
          :key="agent.name"
          class="industrial-card p-4 md:p-6 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="w-2 h-2 bg-[#750d37]"></span>
              <span class="font-mono text-xs text-[#750d37] font-bold tracking-wider">// AGENT SPECIFICATION</span>
            </div>
            <h3 class="text-sm md:text-lg font-black uppercase text-white mb-2">{{ agent.name }}</h3>
            <p class="text-[11px] md:text-xs text-[#a0a0a4] leading-relaxed">{{ agent.desc }}</p>
          </div>
          <div class="mt-4 pt-2.5 border-t border-[#1e1e20] flex items-center justify-between font-mono text-[9px] md:text-[10px] text-[#555558]">
            <span>DEPLOYED ON SHADOWVERSE</span>
            <span class="text-[#3d8b5e]">24x7 ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
