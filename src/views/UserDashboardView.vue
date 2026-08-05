<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useLeadStore, type Lead } from '../stores/leadStore'
import { useToast } from '../composables/useToast'
import IndustrialToast from '../components/IndustrialToast.vue'
import LeadModal from '../components/LeadModal.vue'

const DpdpPortalModal = defineAsyncComponent(() => import('../components/DpdpPortalModal.vue'))

const router = useRouter()
const authStore = useAuthStore()
const leadStore = useLeadStore()
const { showToast } = useToast()

const activeTab = ref<'DIRECTORY' | 'PIPELINE' | 'AUDIT'>('DIRECTORY')
const showDpdpPortalModal = ref(false)
const showLeadModal = ref(false)
const selectedLead = ref<Lead | null>(null)

// Search & Status Filter State
const searchQuery = ref('')
const selectedStatusFilter = ref<string>('ALL')

const filteredLeads = computed(() => {
  return leadStore.leads.filter(lead => {
    const query = searchQuery.value.toLowerCase()
    const matchesSearch = lead.name.toLowerCase().includes(query) ||
                          lead.company.toLowerCase().includes(query) ||
                          lead.email.toLowerCase().includes(query) ||
                          lead.domain.toLowerCase().includes(query) ||
                          lead.id.toLowerCase().includes(query)
    if (!matchesSearch) return false
    if (selectedStatusFilter.value !== 'ALL') {
      return lead.status === selectedStatusFilter.value
    }
    return true
  })
})

function openNewLeadModal() {
  selectedLead.value = null
  showLeadModal.value = true
}

function openInspectLeadModal(lead: Lead) {
  selectedLead.value = lead
  showLeadModal.value = true
}

function handleLogout() {
  authStore.logout()
  showToast({ title: 'LOGGED OUT', message: 'Operator session terminated cleanly.', type: 'INFO' })
  router.push('/')
}

function statusBadgeClass(status: Lead['status']) {
  switch (status) {
    case 'NEW':
      return 'bg-[#4a7ebb]/20 text-[#4a7ebb] border border-[#4a7ebb]/40'
    case 'QUALIFIED':
      return 'bg-[#3d8b5e]/20 text-[#3d8b5e] border border-[#3d8b5e]/40'
    case 'CONTACTED':
      return 'bg-[#c49a3c]/20 text-[#c49a3c] border border-[#c49a3c]/40'
    case 'PROPOSAL_SENT':
      return 'bg-[#9a1a4e]/20 text-[#9a1a4e] border border-[#9a1a4e]/40'
    case 'DEPLOYED':
      return 'bg-[#750d37] text-white border border-[#750d37]'
    case 'REJECTED':
      return 'bg-[#c44a4a]/20 text-[#c44a4a] border border-[#c44a4a]/40'
    default:
      return 'bg-[#0a0a0c] text-[#c8c8cc] border border-[#1e1e20]'
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0c] text-[#f0f0f4] font-sans antialiased selection:bg-[#750d37] selection:text-white flex flex-col">
    
    <!-- DEDICATED DASHBOARD HEADER APP BAR -->
    <header class="bg-[#111113] border-b border-[#1e1e20] px-4 md:px-10 h-16 flex items-center justify-between sticky top-0 z-40">
      <!-- Brand Logo & Lead Management Title -->
      <div class="flex items-center gap-3 cursor-pointer" @click="router.push('/dashboard')">
        <div class="w-8 h-8 bg-[#750d37] flex items-center justify-center font-mono font-black text-white text-xs tracking-tighter">
          SV
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <span class="font-black tracking-[3px] text-sm text-white uppercase leading-none">SHADOWVERSE</span>
            <span class="px-1.5 py-0.5 bg-[#750d37]/20 border border-[#750d37] text-[8px] font-mono text-[#9a1a4e] font-bold">LEAD MANAGEMENT</span>
          </div>
          <span class="text-[8px] font-mono text-[#88888c] tracking-widest uppercase mt-0.5">SOVEREIGN PRIVATE CLOUD DASHBOARD</span>
        </div>
      </div>

      <!-- Dashboard Navigation Tabs -->
      <nav class="hidden md:flex items-center gap-2 font-mono text-xs">
        <button
          @click="activeTab = 'DIRECTORY'"
          class="px-3 py-1.5 border transition-all uppercase font-bold cursor-pointer"
          :class="activeTab === 'DIRECTORY' ? 'bg-[#750d37] border-[#750d37] text-white' : 'bg-[#0a0a0c] border-[#1e1e20] text-[#c8c8cc] hover:text-white'"
        >
          // LEADS DIRECTORY ({{ leadStore.leads.length }})
        </button>
        <button
          @click="activeTab = 'PIPELINE'"
          class="px-3 py-1.5 border transition-all uppercase font-bold cursor-pointer"
          :class="activeTab === 'PIPELINE' ? 'bg-[#750d37] border-[#750d37] text-white' : 'bg-[#0a0a0c] border-[#1e1e20] text-[#c8c8cc] hover:text-white'"
        >
          // PIPELINE STAGES
        </button>
        <button
          @click="activeTab = 'AUDIT'"
          class="px-3 py-1.5 border transition-all uppercase font-bold cursor-pointer"
          :class="activeTab === 'AUDIT' ? 'bg-[#750d37] border-[#750d37] text-white' : 'bg-[#0a0a0c] border-[#1e1e20] text-[#c8c8cc] hover:text-white'"
        >
          // ACTIVITY AUDIT LOGS
        </button>
      </nav>

      <!-- Operator Info & Actions -->
      <div class="flex items-center gap-3">
        <div class="hidden sm:flex flex-col text-right font-mono text-[10px]">
          <span class="text-white font-bold">{{ authStore.userProfile?.fullName || authStore.operatorId }}</span>
          <span class="text-[#3d8b5e] font-bold">{{ authStore.userProfile?.email }}</span>
        </div>
        <button
          @click="handleLogout"
          class="px-3 py-1.5 bg-[#c44a4a]/20 border border-[#c44a4a] hover:bg-[#c44a4a] text-white font-mono text-xs font-bold uppercase transition-all cursor-pointer"
        >
          LOGOUT
        </button>
      </div>
    </header>

    <!-- MAIN DASHBOARD CONTENT: LEAD MANAGEMENT CENTER -->
    <main class="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
      
      <!-- PROMINENT DASHBOARD TITLE & METRICS HEADER -->
      <div class="p-6 bg-[#111113] border border-[#1e1e20] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="font-mono text-[10px] text-[#750d37] font-bold tracking-widest uppercase mb-1">// COMMANDER LEAD CONSOLE</div>
          <h1 class="text-2xl md:text-5xl font-black uppercase text-white tracking-tight">
            LEAD MANAGEMENT DASHBOARD
          </h1>
          <p class="text-xs md:text-sm font-mono text-[#c8c8cc] mt-1">
            OPERATOR: <strong class="text-white">{{ authStore.userProfile?.fullName || 'SOVEREIGN OPERATOR' }}</strong>
            ({{ authStore.userProfile?.email }})
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3 font-mono text-xs">
          <button
            @click="openNewLeadModal"
            class="industrial-btn industrial-btn-primary py-2.5 px-4 text-xs font-bold"
          >
            + REGISTER NEW LEAD
          </button>

          <button @click="showDpdpPortalModal = true" class="industrial-btn industrial-btn-outline text-xs border-[#3d8b5e] text-white py-2.5">
            DPDP RIGHTS PORTAL
          </button>
        </div>
      </div>

      <!-- LEAD MANAGEMENT KEY METRICS CARDS -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div class="industrial-card p-4 space-y-1">
          <span class="text-[10px] text-[#88888c] uppercase block">TOTAL PIPELINE LEADS</span>
          <div class="text-2xl md:text-3xl font-black text-white">{{ leadStore.totalLeads }}</div>
          <span class="text-[9px] text-[#3d8b5e] font-bold block">+12% NEW THIS WEEK</span>
        </div>

        <div class="industrial-card p-4 space-y-1">
          <span class="text-[10px] text-[#88888c] uppercase block">QUALIFIED LEADS (MQL/SQL)</span>
          <div class="text-2xl md:text-3xl font-black text-[#3d8b5e]">{{ leadStore.qualifiedLeads }}</div>
          <span class="text-[9px] text-[#3d8b5e] font-bold block">78% CONVERSION RATE</span>
        </div>

        <div class="industrial-card p-4 space-y-1">
          <span class="text-[10px] text-[#88888c] uppercase block">EST. PIPELINE REVENUE</span>
          <div class="text-2xl md:text-3xl font-black text-white">{{ leadStore.totalPipelineValue }}</div>
          <span class="text-[9px] text-[#750d37] font-bold block">ENTERPRISE CLOUD</span>
        </div>

        <div class="industrial-card p-4 space-y-1">
          <span class="text-[10px] text-[#88888c] uppercase block">DPDP COMPLIANT CONSENT</span>
          <div class="text-2xl md:text-3xl font-black text-[#3d8b5e]">100%</div>
          <span class="text-[9px] text-[#c8c8cc] block">VERIFIED DOMAIN LEADS</span>
        </div>
      </div>

      <!-- TAB 1: LEADS DIRECTORY (TABLE, SEARCH & FILTERS) -->
      <div v-if="activeTab === 'DIRECTORY'" class="space-y-6">
        
        <!-- Search Bar & Status Filter Bar -->
        <div class="p-4 bg-[#111113] border border-[#1e1e20] font-mono text-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div class="flex items-center gap-2 flex-1">
            <span class="text-[#750d37] font-bold uppercase">// SEARCH LEADS:</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by contact name, company, domain, or Lead ID..."
              class="w-full bg-[#0a0a0c] border border-[#1e1e20] px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#750d37]"
            />
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <span class="text-[#88888c] text-[10px] uppercase">// FILTER STATUS:</span>
            <button
              @click="selectedStatusFilter = 'ALL'"
              class="px-2.5 py-1 border text-[10px] font-bold uppercase cursor-pointer"
              :class="selectedStatusFilter === 'ALL' ? 'bg-[#750d37] border-[#750d37] text-white' : 'bg-[#0a0a0c] border-[#1e1e20] text-[#88888c]'"
            >
              ALL ({{ leadStore.leads.length }})
            </button>
            <button
              @click="selectedStatusFilter = 'QUALIFIED'"
              class="px-2.5 py-1 border text-[10px] font-bold uppercase cursor-pointer"
              :class="selectedStatusFilter === 'QUALIFIED' ? 'bg-[#3d8b5e] border-[#3d8b5e] text-white' : 'bg-[#0a0a0c] border-[#1e1e20] text-[#88888c]'"
            >
              QUALIFIED
            </button>
            <button
              @click="selectedStatusFilter = 'NEW'"
              class="px-2.5 py-1 border text-[10px] font-bold uppercase cursor-pointer"
              :class="selectedStatusFilter === 'NEW' ? 'bg-[#4a7ebb] border-[#4a7ebb] text-white' : 'bg-[#0a0a0c] border-[#1e1e20] text-[#88888c]'"
            >
              NEW
            </button>
          </div>
        </div>

        <!-- LEADS DIRECTORY TABLE -->
        <div class="industrial-card p-0 overflow-hidden font-mono text-xs">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#0a0a0c] border-b border-[#1e1e20] text-[#750d37] font-bold text-[10px] uppercase tracking-wider">
                  <th class="p-3.5">LEAD ID</th>
                  <th class="p-3.5">CONTACT & COMPANY</th>
                  <th class="p-3.5">INDUSTRY DOMAIN</th>
                  <th class="p-3.5">EST. BUDGET</th>
                  <th class="p-3.5">INTENT</th>
                  <th class="p-3.5">STATUS</th>
                  <th class="p-3.5">ASSIGNED EXEC</th>
                  <th class="p-3.5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1e1e20]">
                <tr
                  v-for="lead in filteredLeads"
                  :key="lead.id"
                  @click="openInspectLeadModal(lead)"
                  class="hover:bg-[#161619] transition-colors cursor-pointer group"
                >
                  <td class="p-3.5 text-[#750d37] font-bold">{{ lead.id }}</td>
                  <td class="p-3.5 space-y-0.5">
                    <div class="text-white font-bold group-hover:text-[#9a1a4e] transition-colors">{{ lead.name }}</div>
                    <div class="text-[#88888c] text-[11px]">{{ lead.company }}</div>
                  </td>
                  <td class="p-3.5 text-[#c8c8cc]">{{ lead.domain }}</td>
                  <td class="p-3.5 font-bold text-[#3d8b5e]">{{ lead.budget }}</td>
                  <td class="p-3.5">
                    <span class="px-2 py-0.5 bg-[#750d37]/20 border border-[#750d37] text-[10px] font-bold text-white">
                      {{ lead.intentScore }}/100
                    </span>
                  </td>
                  <td class="p-3.5">
                    <span class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider" :class="statusBadgeClass(lead.status)">
                      {{ lead.status }}
                    </span>
                  </td>
                  <td class="p-3.5 text-[#88888c] text-[11px]">{{ lead.assignedAgent }}</td>
                  <td class="p-3.5 text-right">
                    <button
                      @click.stop="openInspectLeadModal(lead)"
                      class="industrial-btn industrial-btn-outline text-[10px] px-2.5 py-1"
                    >
                      INSPECT →
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredLeads.length === 0">
                  <td colspan="8" class="p-8 text-center text-[#88888c]">
                    NO LEADS MATCHING SEARCH CRITERIA
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- TAB 2: PIPELINE & STAGES BREAKDOWN -->
      <div v-else-if="activeTab === 'PIPELINE'" class="space-y-6 font-mono text-xs">
        <div class="p-4 bg-[#111113] border border-[#1e1e20] flex justify-between items-center">
          <span class="text-white font-bold">// PIPELINE STAGES BREAKDOWN</span>
          <span class="text-[#3d8b5e]">EST. TOTAL REVENUE: {{ leadStore.totalPipelineValue }}</span>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="lead in leadStore.leads"
            :key="lead.id"
            @click="openInspectLeadModal(lead)"
            class="industrial-card p-4 space-y-3 cursor-pointer hover:border-[#750d37] transition-all"
          >
            <div class="flex justify-between items-center pb-2 border-b border-[#1e1e20]">
              <span class="text-[#750d37] font-bold">{{ lead.id }}</span>
              <span class="px-2 py-0.5 text-[9px] font-bold uppercase" :class="statusBadgeClass(lead.status)">
                {{ lead.status }}
              </span>
            </div>

            <div class="space-y-1">
              <div class="text-white font-bold text-sm">{{ lead.name }}</div>
              <div class="text-[#3d8b5e] font-bold">{{ lead.company }}</div>
              <div class="text-[#88888c] text-[11px]">{{ lead.domain }}</div>
            </div>

            <div class="p-2 bg-[#0a0a0c] border border-[#1e1e20] text-[11px] text-[#c8c8cc]">
              "{{ lead.notes }}"
            </div>

            <div class="flex justify-between items-center pt-2 border-t border-[#1e1e20] text-[10px] text-[#88888c]">
              <span>BUDGET: <strong class="text-white">{{ lead.budget }}</strong></span>
              <span>EXEC: <strong class="text-white">{{ lead.assignedAgent }}</strong></span>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: ACTIVITY AUDIT LOGS -->
      <div v-else-if="activeTab === 'AUDIT'" class="space-y-4 font-mono text-xs">
        <div class="industrial-card p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-[#1e1e20]">
            <span class="text-xs text-[#750d37] font-bold tracking-widest uppercase">// LEAD MANAGEMENT ACTIVITY LOGS</span>
            <span class="text-[10px] text-[#c8c8cc]">REALTIME COMPLIANCE AUDIT</span>
          </div>

          <div class="space-y-2.5">
            <div
              v-for="lead in leadStore.leads"
              :key="'audit-' + lead.id"
              class="p-3 bg-[#0a0a0c] border border-[#1e1e20] flex flex-col md:flex-row md:items-center justify-between gap-2"
            >
              <div class="flex items-center gap-3">
                <span class="px-2 py-0.5 text-[9px] font-bold uppercase bg-[#3d8b5e]/20 text-[#3d8b5e] border border-[#3d8b5e]/40">
                  LEAD_LOG
                </span>
                <span class="text-white font-bold text-xs">{{ lead.company }} — {{ lead.name }}</span>
              </div>
              <div class="flex items-center gap-3 text-[10px] text-[#88888c]">
                <span>STATUS: {{ lead.status }}</span>
                <span>EXEC: {{ lead.assignedAgent }}</span>
                <span>ADDED: {{ lead.dateAdded }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- DEDICATED DASHBOARD FOOTER -->
    <footer class="bg-[#111113] border-t border-[#1e1e20] py-6 px-4 md:px-10 font-mono text-[10px] text-[#88888c] flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto">
      <div>
        <span>SHADOWVERSE SOVEREIGN PRIVATE CLOUD // LEAD MANAGEMENT DASHBOARD</span>
      </div>
      <div>
        <span>IMAGINED BY <strong class="text-white">SAJITHINDRA</strong> · PROGRAMMED BY <strong class="text-[#9a1a4e]">SUVRMONX LLP</strong></span>
      </div>
    </footer>

    <!-- Lead Modal (Create / Inspect / Update) -->
    <LeadModal
      v-if="showLeadModal"
      :lead="selectedLead"
      @close="showLeadModal = false"
    />

    <!-- DPDP Modal -->
    <DpdpPortalModal
      v-if="showDpdpPortalModal"
      @close="showDpdpPortalModal = false"
    />

    <!-- Toast Layer -->
    <IndustrialToast />
  </div>
</template>
