<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useLeadStore, type Lead } from '../stores/leadStore'
import { useToast } from '../composables/useToast'
import { isValidEmail, isValidPhone, isValidName } from '../utils/validators'

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
const isSaving = ref(false)

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})

function clearError(field: string) {
  if (formErrors.value[field]) {
    delete formErrors.value[field]
  }
}

function handleSave() {
  formErrors.value = {}
  if (!isValidName(name.value)) formErrors.value.name = 'Lead contact name is required (min 2 chars).'
  if (!company.value.trim()) formErrors.value.company = 'Company name is required.'
  if (!isValidEmail(email.value)) {
    formErrors.value.email = 'Enter a valid email address (e.g. name@domain.com).'
  }
  if (phone.value.trim() && !isValidPhone(phone.value)) {
    formErrors.value.phone = 'Enter a valid phone number format.'
  }
  if (!domain.value.trim()) {
    formErrors.value.domain = 'Industry domain specification is required.'
  }

  if (Object.keys(formErrors.value).length > 0) {
    showToast({ title: 'VALIDATION ERROR', message: 'Please correct highlighted form errors.', type: 'WARNING' })
    return
  }

  isSaving.value = true
  setTimeout(() => {
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
    isSaving.value = false
    emit('close')
  }, 200)
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2.5 sm:p-4 select-none animate-fade-in overflow-y-auto"
    @click.self="emit('close')"
    role="dialog"
    aria-modal="true"
    aria-labelledby="lead-modal-title"
  >
    <div class="industrial-card max-w-xl w-full border-[#750d37]/60 space-y-4 my-auto max-h-[92vh] sm:max-h-[88vh] flex flex-col p-3.5 sm:p-6 overflow-hidden font-mono text-xs sm:text-sm relative shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-[#111113]">
      <!-- 2px Brand Top Accent Line -->
      <div class="absolute top-0 left-0 right-0 h-[2px] bg-[#750d37]"></div>

      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-3 border-b border-[#1e1e20] shrink-0 pt-1">
        <div>
          <span class="text-[10px] sm:text-xs text-[#750d37] font-bold tracking-widest uppercase">// LEAD MANAGEMENT CONSOLE</span>
          <h3 id="lead-modal-title" class="text-base sm:text-xl font-black uppercase text-white">
            {{ props.lead ? `INSPECT & UPDATE: ${props.lead.id}` : 'REGISTER NEW LEAD' }}
          </h3>
        </div>
        <button @click="emit('close')" class="industrial-btn industrial-btn-outline text-[10px] sm:text-xs py-1.5 px-3 shrink-0" aria-label="Close modal">
          CLOSE [ESC]
        </button>
      </div>

      <!-- Form Grid with smooth vertical scroll -->
      <div class="space-y-4 overflow-y-auto pr-1 flex-1">
        
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label for="lead-name-input" class="text-[#88888c] block mb-1 uppercase text-[10px]">CONTACT NAME *</label>
            <input
              id="lead-name-input"
              v-model="name"
              @input="clearError('name')"
              type="text"
              placeholder="e.g. Vikramaditya Sharma"
              class="industrial-input"
              :aria-invalid="!!formErrors.name"
              aria-describedby="name-err"
            />
            <span id="name-err" v-if="formErrors.name" class="text-[#c44a4a] text-[10px] block mt-1">{{ formErrors.name }}</span>
          </div>

          <div>
            <label for="lead-company-input" class="text-[#88888c] block mb-1 uppercase text-[10px]">COMPANY / ORGANIZATION *</label>
            <input
              id="lead-company-input"
              v-model="company"
              @input="clearError('company')"
              type="text"
              placeholder="e.g. Reliance Defense"
              class="industrial-input"
              :aria-invalid="!!formErrors.company"
              aria-describedby="company-err"
            />
            <span id="company-err" v-if="formErrors.company" class="text-[#c44a4a] text-[10px] block mt-1">{{ formErrors.company }}</span>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label for="lead-email-input" class="text-[#88888c] block mb-1 uppercase text-[10px]">EMAIL ADDRESS *</label>
            <input
              id="lead-email-input"
              v-model="email"
              @input="clearError('email')"
              type="email"
              placeholder="operator@domain.com"
              class="industrial-input"
              :aria-invalid="!!formErrors.email"
              aria-describedby="email-err"
            />
            <span id="email-err" v-if="formErrors.email" class="text-[#c44a4a] text-[10px] block mt-1">{{ formErrors.email }}</span>
          </div>

          <div>
            <label for="lead-phone-input" class="text-[#88888c] block mb-1 uppercase text-[10px]">PHONE NUMBER</label>
            <input
              id="lead-phone-input"
              v-model="phone"
              @input="clearError('phone')"
              type="text"
              placeholder="+91 98765 43210"
              class="industrial-input"
              :aria-invalid="!!formErrors.phone"
              aria-describedby="phone-err"
            />
            <span id="phone-err" v-if="formErrors.phone" class="text-[#c44a4a] text-[10px] block mt-1">{{ formErrors.phone }}</span>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label for="lead-domain-input" class="text-[#88888c] block mb-1 uppercase text-[10px]">INDUSTRY / DOMAIN *</label>
            <input
              id="lead-domain-input"
              v-model="domain"
              @input="clearError('domain')"
              type="text"
              placeholder="e.g. Defense / Banking / Healthcare"
              class="industrial-input"
              :aria-invalid="!!formErrors.domain"
              aria-describedby="domain-err"
            />
            <span id="domain-err" v-if="formErrors.domain" class="text-[#c44a4a] text-[10px] block mt-1">{{ formErrors.domain }}</span>
          </div>

          <div>
            <label for="lead-budget-input" class="text-[#88888c] block mb-1 uppercase text-[10px]">ESTIMATED BUDGET</label>
            <input
              id="lead-budget-input"
              v-model="budget"
              type="text"
              placeholder="e.g. ₹50,00,000"
              class="industrial-input"
            />
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label for="lead-status-select" class="text-[#88888c] block mb-1 uppercase text-[10px]">PIPELINE STAGE / STATUS</label>
            <select
              id="lead-status-select"
              v-model="status"
              class="industrial-input cursor-pointer"
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
            <label for="lead-exec-input" class="text-[#88888c] block mb-1 uppercase text-[10px]">ASSIGNED EXECUTIVE</label>
            <input
              id="lead-exec-input"
              v-model="assignedAgent"
              type="text"
              class="industrial-input"
            />
          </div>
        </div>

        <div>
          <label for="lead-notes-input" class="text-[#88888c] block mb-1 uppercase text-[10px]">LEAD NOTES & REQUIREMENTS</label>
          <textarea
            id="lead-notes-input"
            v-model="notes"
            rows="3"
            placeholder="Enter lead requirements, campus stream counts, or deployment notes..."
            class="industrial-input"
          ></textarea>
        </div>

        <!-- Statutory Compliance & Data Governance Panel -->
        <div class="p-3 bg-[#0a0a0c] border border-[#1e1e20] font-mono text-[10px] space-y-1.5">
          <div class="flex items-center justify-between text-[#3d8b5e] font-bold uppercase">
            <span>// DPDP ACT 2023 GOVERNANCE</span>
            <span>VERIFIED DATA PRINCIPAL</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-[#88888c]">
            <div>STATUTORY CONSENT: <strong class="text-white">SECTION 6 COMPLIANT</strong></div>
            <div>RETENTION SLA: <strong class="text-white">60 DAYS AUTO-PURGE</strong></div>
            <div>ASSIGNED DPO: <strong class="text-[#9a1a4e]">coo@shadowverse.in</strong></div>
            <div>SURVEILLANCE REGION: <strong class="text-white">INDIA PRIVATE CLOUD</strong></div>
          </div>
        </div>

      </div>

      <!-- Footer Buttons -->
      <div class="pt-3 border-t border-[#1e1e20] flex gap-3">
        <button
          @click="handleSave"
          :disabled="isSaving"
          class="industrial-btn industrial-btn-primary flex-1 py-3 text-xs font-bold transition-all"
          :class="isSaving ? 'opacity-50 cursor-not-allowed' : ''"
        >
          {{ isSaving ? 'SAVING...' : (props.lead ? 'SAVE LEAD UPDATES' : 'CREATE LEAD RECORD') }}
        </button>
        <button
          @click="emit('close')"
          :disabled="isSaving"
          class="industrial-btn industrial-btn-outline px-4 py-3 text-xs"
        >
          CANCEL
        </button>
      </div>

    </div>
  </div>
</template>
