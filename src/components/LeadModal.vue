<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useLeadStore, type Lead } from '../stores/leadStore'
import { useToast } from '../composables/useToast'

const props = defineProps<{
  lead?: Lead | null
}>()

const emit = defineEmits(['close'])
const leadStore = useLeadStore()
const { showToast } = useToast()

const name = ref(props.lead?.name || '')
const company = ref(props.lead?.company || '')
const email = ref(props.lead?.email || '')
const phone = ref(props.lead?.phone || '')
const domain = ref(props.lead?.domain || 'Enterprise Defense & Security')
const budget = ref(props.lead?.budget || '₹35,00,000')
const status = ref<Lead['status']>(props.lead?.status || 'NEW')
const intentScore = ref(props.lead?.intentScore || 85)
const notes = ref(props.lead?.notes || '')
const assignedAgent = ref(props.lead?.assignedAgent || 'SAJITHINDRA')

const formErrors = ref<Record<string, string>>({})

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))

function handleSave() {
  formErrors.value = {}
  if (!name.value.trim()) formErrors.value.name = 'Lead contact name is required.'
  if (!company.value.trim()) formErrors.value.company = 'Company name is required.'
  if (!email.value.trim() || !email.value.includes('@')) formErrors.value.email = 'Valid email is required.'
  
  if (Object.keys(formErrors.value).length > 0) return

  if (props.lead) {
    // Update existing lead
    leadStore.updateLeadStatus(props.lead.id, status.value)
    props.lead.name = name.value
    props.lead.company = company.value
    props.lead.email = email.value
    props.lead.phone = phone.value
    props.lead.domain = domain.value
    props.lead.budget = budget.value
    props.lead.notes = notes.value
    props.lead.assignedAgent = assignedAgent.value
    showToast({ title: 'LEAD UPDATED', message: `Updated ${props.lead.id} successfully.`, type: 'SUCCESS' })
  } else {
    // Create new lead
    leadStore.addLead({
      name: name.value,
      company: company.value,
      email: email.value,
      phone: phone.value,
      domain: domain.value,
      source: 'Direct Commander Console',
      budget: budget.value,
      status: status.value,
      intentScore: intentScore.value,
      notes: notes.value,
      assignedAgent: assignedAgent.value,
    })
    showToast({ title: 'LEAD CREATED', message: `New lead registered for ${company.value}.`, type: 'SUCCESS' })
  }

  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 select-none animate-fade-in">
    <div class="industrial-card max-w-xl w-full p-6 border-[#750d37] space-y-5 max-h-[90vh] overflow-y-auto font-mono text-xs">
      
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-3 border-b border-[#1e1e20]">
        <div>
          <span class="text-[10px] text-[#750d37] font-bold tracking-widest uppercase">// LEAD MANAGEMENT CONSOLE</span>
          <h3 class="text-lg font-black uppercase text-white">
            {{ props.lead ? `INSPECT & UPDATE: ${props.lead.id}` : 'REGISTER NEW LEAD' }}
          </h3>
        </div>
        <button @click="emit('close')" class="industrial-btn industrial-btn-outline text-[10px] px-2 py-1">
          CLOSE [ESC]
        </button>
      </div>

      <!-- Form Grid -->
      <div class="space-y-4">
        
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="text-[#88888c] block mb-1 uppercase text-[10px]">CONTACT NAME</label>
            <input
              v-model="name"
              type="text"
              placeholder="e.g. Vikramaditya Sharma"
              class="w-full bg-[#0a0a0c] border px-3 py-2 text-white font-mono text-xs focus:border-[#750d37] outline-none"
              :class="formErrors.name ? 'border-[#c44a4a]' : 'border-[#1e1e20]'"
            />
            <span v-if="formErrors.name" class="text-[#c44a4a] text-[10px] block mt-1">{{ formErrors.name }}</span>
          </div>

          <div>
            <label class="text-[#88888c] block mb-1 uppercase text-[10px]">COMPANY / ORGANIZATION</label>
            <input
              v-model="company"
              type="text"
              placeholder="e.g. Reliance Defense"
              class="w-full bg-[#0a0a0c] border px-3 py-2 text-white font-mono text-xs focus:border-[#750d37] outline-none"
              :class="formErrors.company ? 'border-[#c44a4a]' : 'border-[#1e1e20]'"
            />
            <span v-if="formErrors.company" class="text-[#c44a4a] text-[10px] block mt-1">{{ formErrors.company }}</span>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="text-[#88888c] block mb-1 uppercase text-[10px]">EMAIL ADDRESS</label>
            <input
              v-model="email"
              type="email"
              placeholder="operator@domain.com"
              class="w-full bg-[#0a0a0c] border px-3 py-2 text-white font-mono text-xs focus:border-[#750d37] outline-none"
              :class="formErrors.email ? 'border-[#c44a4a]' : 'border-[#1e1e20]'"
            />
            <span v-if="formErrors.email" class="text-[#c44a4a] text-[10px] block mt-1">{{ formErrors.email }}</span>
          </div>

          <div>
            <label class="text-[#88888c] block mb-1 uppercase text-[10px]">PHONE NUMBER</label>
            <input
              v-model="phone"
              type="text"
              placeholder="+91 98765 43210"
              class="w-full bg-[#0a0a0c] border px-3 py-2 text-white font-mono text-xs focus:border-[#750d37] outline-none border-[#1e1e20]"
            />
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="text-[#88888c] block mb-1 uppercase text-[10px]">INDUSTRY / DOMAIN</label>
            <input
              v-model="domain"
              type="text"
              placeholder="e.g. Defense / Banking / Healthcare"
              class="w-full bg-[#0a0a0c] border border-[#1e1e20] px-3 py-2 text-white font-mono text-xs focus:border-[#750d37] outline-none"
            />
          </div>

          <div>
            <label class="text-[#88888c] block mb-1 uppercase text-[10px]">ESTIMATED BUDGET</label>
            <input
              v-model="budget"
              type="text"
              placeholder="e.g. ₹50,00,000"
              class="w-full bg-[#0a0a0c] border border-[#1e1e20] px-3 py-2 text-white font-mono text-xs focus:border-[#750d37] outline-none"
            />
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="text-[#88888c] block mb-1 uppercase text-[10px]">PIPELINE STAGE / STATUS</label>
            <select
              v-model="status"
              class="w-full bg-[#0a0a0c] border border-[#1e1e20] px-3 py-2 text-white font-mono text-xs focus:border-[#750d37] outline-none"
            >
              <option value="NEW">NEW LEAD</option>
              <option value="QUALIFIED">QUALIFIED (MQL/SQL)</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="PROPOSAL_SENT">PROPOSAL SENT</option>
              <option value="DEPLOYED">DEPLOYED (WON)</option>
              <option value="REJECTED">REJECTED (LOST)</option>
            </select>
          </div>

          <div>
            <label class="text-[#88888c] block mb-1 uppercase text-[10px]">ASSIGNED EXECUTIVE</label>
            <input
              v-model="assignedAgent"
              type="text"
              class="w-full bg-[#0a0a0c] border border-[#1e1e20] px-3 py-2 text-white font-mono text-xs focus:border-[#750d37] outline-none"
            />
          </div>
        </div>

        <div>
          <label class="text-[#88888c] block mb-1 uppercase text-[10px]">LEAD NOTES & REQUIREMENTS</label>
          <textarea
            v-model="notes"
            rows="3"
            placeholder="Enter lead requirements, campus stream counts, or deployment notes..."
            class="w-full bg-[#0a0a0c] border border-[#1e1e20] p-3 text-white font-mono text-xs focus:border-[#750d37] outline-none"
          ></textarea>
        </div>

      </div>

      <!-- Footer Buttons -->
      <div class="pt-3 border-t border-[#1e1e20] flex gap-3">
        <button
          @click="handleSave"
          class="industrial-btn industrial-btn-primary flex-1 py-3 text-xs font-bold"
        >
          {{ props.lead ? 'SAVE LEAD UPDATES' : 'CREATE LEAD RECORD' }}
        </button>
        <button
          @click="emit('close')"
          class="industrial-btn industrial-btn-outline px-4 py-3 text-xs"
        >
          CANCEL
        </button>
      </div>

    </div>
  </div>
</template>
