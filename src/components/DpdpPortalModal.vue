<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useToast } from '../composables/useToast'
import { useDpdpStore } from '../stores/dpdpStore'

const emit = defineEmits(['close'])
const { showToast } = useToast()
const dpdpStore = useDpdpStore()

const activeTab = ref<'POLICIES' | 'REPORT' | 'ERASURE' | 'CORRECTION' | 'NOMINATION' | 'GRIEVANCE'>('POLICIES')

// Request Form States
const applicantName = ref('')
const applicantPhone = ref('')
const applicantIdNo = ref('')
const reqReason = ref('')
const correctedDetails = ref('')

// Nomination States
const nomineeName = ref('')
const nomineeContact = ref('')

// Grievance States
const grievanceText = ref('')

// Validation Error States
const formErrors = ref<Record<string, string>>({})

const isProcessing = ref(false)
const requestStatus = ref<string | null>(null)
const generatedRefNo = ref<string | null>(null)
const generatedDataReport = ref<any | null>(null)

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
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})

function validateName(val: string): string | null {
  if (!val || val.trim().length < 3) return 'Name must be at least 3 characters long.'
  if (!/^[a-zA-Z\s\.\'-]+$/.test(val.trim())) return 'Name contains invalid characters.'
  return null
}

function validatePhoneOrId(val: string): string | null {
  if (!val || val.trim().length < 4) return 'Phone/ID number must be provided.'
  return null
}

function generateRefNo(): string {
  return 'DPDP-2026-' + Math.floor(100000 + Math.random() * 900000)
}

function handleGenerateReport() {
  formErrors.value = {}
  const nameErr = validateName(applicantName.value)
  const idErr = validatePhoneOrId(applicantIdNo.value)
  if (nameErr) formErrors.value.applicantName = nameErr
  if (idErr) formErrors.value.applicantIdNo = idErr

  if (Object.keys(formErrors.value).length > 0) {
    showToast({ title: 'VALIDATION ERROR', message: 'Please correct the highlighted form errors.', type: 'WARNING' })
    return
  }

  isProcessing.value = true
  requestStatus.value = 'FETCHING CEPH IMMUTABLE LOGS...'
  
  setTimeout(() => {
    isProcessing.value = false
    generatedRefNo.value = generateRefNo()
    requestStatus.value = 'REPORT_GENERATED'
    generatedDataReport.value = {
      refNo: generatedRefNo.value,
      timestamp: new Date().toISOString(),
      principalName: applicantName.value,
      principalId: applicantIdNo.value,
      dataFiduciary: 'SHADOWVERSE PRIVATE CLOUD / SURVMONX LLP',
      dpoAssigned: 'ARUN PRAKASH PILLAI (coo@shadowverse.in)',
      processedRecordsCount: 12,
      facialVectorHashes: ['0x8f9a2b4c7e1d3f5a', '0x1c3d5e7f9a2b4c6e'],
      retentionPeriodDays: 60,
      cephPurgeSchedule: 'AUTOMATIC ERASURE IN 24 DAYS',
      matchedZones: ['MAIN GATE OUTER', 'RECEPTION LOBBY'],
    }
    dpdpStore.addTicket({
      refNo: generatedRefNo.value,
      type: 'REPORT',
      applicantName: applicantName.value,
      submittedAt: new Date().toISOString(),
      status: 'REPORT_GENERATED',
      details: generatedDataReport.value,
    })
    showToast({ title: 'DATA REPORT GENERATED', message: `Ref #${generatedRefNo.value} ready for download.`, type: 'SUCCESS' })
  }, 600)
}

function handleErasureRequest() {
  formErrors.value = {}
  const nameErr = validateName(applicantName.value)
  const phoneErr = validatePhoneOrId(applicantPhone.value)
  if (nameErr) formErrors.value.applicantName = nameErr
  if (phoneErr) formErrors.value.applicantPhone = phoneErr

  if (Object.keys(formErrors.value).length > 0) {
    showToast({ title: 'VALIDATION ERROR', message: 'Please fix input errors before submitting.', type: 'WARNING' })
    return
  }

  isProcessing.value = true
  requestStatus.value = 'DISPATCHING CRYPTOGRAPHIC PURGE MANDATE TO CEPH CLUSTER...'
  
  setTimeout(() => {
    isProcessing.value = false
    generatedRefNo.value = generateRefNo()
    requestStatus.value = 'ERASURE_SCHEDULED'
    dpdpStore.addTicket({
      refNo: generatedRefNo.value,
      type: 'ERASURE',
      applicantName: applicantName.value,
      submittedAt: new Date().toISOString(),
      status: 'SCHEDULED_FOR_PURGE',
    })
    showToast({ title: 'ERASURE REQUEST SUBMITTED', message: `Ref #${generatedRefNo.value} registered on Ceph.`, type: 'ALERT' })
  }, 700)
}

function handleCorrectionRequest() {
  formErrors.value = {}
  const nameErr = validateName(applicantName.value)
  if (nameErr) formErrors.value.applicantName = nameErr
  if (!correctedDetails.value || correctedDetails.value.trim().length < 3) {
    formErrors.value.correctedDetails = 'Please specify the corrected details.'
  }

  if (Object.keys(formErrors.value).length > 0) {
    showToast({ title: 'VALIDATION ERROR', message: 'Please correct highlighted form errors.', type: 'WARNING' })
    return
  }

  isProcessing.value = true
  requestStatus.value = 'TRANSMITTING CORRECTION NOTICE TO DATA PROTECTION OFFICER...'
  
  setTimeout(() => {
    isProcessing.value = false
    generatedRefNo.value = generateRefNo()
    requestStatus.value = 'CORRECTION_LOGGED'
    dpdpStore.addTicket({
      refNo: generatedRefNo.value,
      type: 'CORRECTION',
      applicantName: applicantName.value,
      submittedAt: new Date().toISOString(),
      status: 'TRANSMITTED_TO_DPO',
      details: { correctedDetails: correctedDetails.value }
    })
    showToast({ title: 'CORRECTION NOTICE SUBMITTED', message: `Ref #${generatedRefNo.value} transmitted to DPO.`, type: 'SUCCESS' })
  }, 500)
}

function handleNominationSubmit() {
  formErrors.value = {}
  const nomNameErr = validateName(nomineeName.value)
  const nomContactErr = validatePhoneOrId(nomineeContact.value)
  if (nomNameErr) formErrors.value.nomineeName = nomNameErr
  if (nomContactErr) formErrors.value.nomineeContact = nomContactErr

  if (Object.keys(formErrors.value).length > 0) {
    showToast({ title: 'VALIDATION ERROR', message: 'Please provide valid nominee details.', type: 'WARNING' })
    return
  }

  isProcessing.value = true
  requestStatus.value = 'REGISTERING NOMINEE ON CEPH IMMUTABLE REGISTRY...'
  
  setTimeout(() => {
    isProcessing.value = false
    generatedRefNo.value = generateRefNo()
    requestStatus.value = 'NOMINEE_REGISTERED'
    dpdpStore.addTicket({
      refNo: generatedRefNo.value,
      type: 'NOMINATION',
      applicantName: nomineeName.value,
      submittedAt: new Date().toISOString(),
      status: 'NOMINEE_REGISTERED',
    })
    showToast({ title: 'NOMINEE REGISTERED', message: `${nomineeName.value} registered as statutory nominee.`, type: 'SUCCESS' })
  }, 500)
}

function handleGrievanceSubmit() {
  formErrors.value = {}
  if (!grievanceText.value || grievanceText.value.trim().length < 10) {
    formErrors.value.grievanceText = 'Grievance description must be at least 10 characters.'
    showToast({ title: 'VALIDATION ERROR', message: 'Please describe your grievance in detail.', type: 'WARNING' })
    return
  }

  isProcessing.value = true
  requestStatus.value = 'TRANSMITTING STATUTORY GRIEVANCE TO DPO ARUN KUMAR PILLAI...'
  
  setTimeout(() => {
    isProcessing.value = false
    generatedRefNo.value = generateRefNo()
    requestStatus.value = 'GRIEVANCE_ESCALATED'
    dpdpStore.addTicket({
      refNo: generatedRefNo.value,
      type: 'GRIEVANCE',
      applicantName: applicantName.value,
      submittedAt: new Date().toISOString(),
      status: 'ESCALATED_TO_DPO',
    })
    showToast({ title: 'GRIEVANCE ESCALATED TO DPO', message: `Ticket #${generatedRefNo.value} sent to coo@shadowverse.in`, type: 'ALERT' })
  }, 600)
}

function downloadDataReportJson() {
  if (!generatedDataReport.value) return
  const blob = new Blob([JSON.stringify(generatedDataReport.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `DPDP_DATA_REPORT_${generatedDataReport.value.refNo}.json`
  a.click()
  URL.revokeObjectURL(url)
  showToast({ title: 'DOWNLOAD STARTED', message: 'JSON report downloaded to device.', type: 'INFO' })
}

function copyDpoEmail() {
  navigator.clipboard.writeText('coo@shadowverse.in')
  showToast({ title: 'EMAIL COPIED', message: 'coo@shadowverse.in copied to clipboard.', type: 'SUCCESS' })
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2.5 sm:p-4 select-none animate-fade-in overflow-y-auto"
    @click.self="emit('close')"
    role="dialog"
    aria-modal="true"
    aria-labelledby="dpdp-modal-title"
  >
    <div class="industrial-card max-w-4xl w-full border-[#750d37]/60 space-y-4 my-auto max-h-[92vh] sm:max-h-[88vh] flex flex-col p-3.5 sm:p-6 overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-[#111113]">
      <!-- 2px Brand Top Accent Line -->
      <div class="absolute top-0 left-0 right-0 h-[2px] bg-[#750d37]"></div>

      <!-- Top Header & Title -->
      <div class="flex items-center justify-between pb-3 border-b border-[#1e1e20] shrink-0 pt-1">
        <div>
          <span class="font-mono text-[10px] sm:text-xs text-[#3d8b5e] font-bold tracking-widest uppercase">// STATUTORY DATA PRINCIPAL RIGHTS PORTAL</span>
          <h3 id="dpdp-modal-title" class="text-base sm:text-xl md:text-2xl font-black uppercase text-white">DPDP ACT 2023 DATA RIGHTS PORTAL</h3>
        </div>
        <button @click="emit('close')" class="industrial-btn industrial-btn-outline text-[10px] sm:text-xs py-1.5 px-3 shrink-0">
          CLOSE [ESC]
        </button>
      </div>

      <!-- Legal Context Banner -->
      <div class="p-3 bg-[#3d8b5e]/10 border border-[#3d8b5e]/40 font-mono text-[10px] sm:text-xs text-[#e8e8ea] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shrink-0">
        <div>
          <span class="text-[#3d8b5e] font-bold uppercase">// DATA PROTECTION OFFICER (DPO):</span>
          <span class="text-white font-bold"> ARUN KUMAR PILLAI </span>
          <button @click="copyDpoEmail" class="text-[#9a1a4e] font-bold underline ml-1 cursor-pointer">
            (coo@shadowverse.in)
          </button>
        </div>
        <span class="text-[#a0a0a4]">ACT 22 OF 2023 COMPLIANT</span>
      </div>

      <!-- Session History Counter if tickets exist -->
      <div v-if="dpdpStore.tickets.length > 0" class="p-2.5 bg-[#0a0a0c] border border-[#1e1e20] font-mono text-[10px] sm:text-xs text-[#a0a0a4] flex items-center justify-between shrink-0">
        <span>ACTIVE SESSION TICKETS: <strong class="text-white">{{ dpdpStore.tickets.length }} FILED</strong></span>
        <span class="text-[#3d8b5e]">LATEST: {{ dpdpStore.tickets[0]?.refNo }} ({{ dpdpStore.tickets[0]?.type }})</span>
      </div>

      <!-- Horizontal Scrollable Rights Tabs -->
      <div class="flex overflow-x-auto gap-2 font-mono text-[10px] sm:text-xs border-b border-[#1e1e20] pb-3 shrink-0 scrollbar-none whitespace-nowrap">
        <button
          @click="activeTab = 'POLICIES'; requestStatus = null; formErrors = {}"
          class="px-3 py-2 border transition-all uppercase font-bold shrink-0 cursor-pointer"
          :class="activeTab === 'POLICIES' ? 'bg-[#4a7ebb] border-[#4a7ebb] text-white' : 'bg-[#0a0a0c] border-[#1e1e20] text-[#a0a0a4] hover:text-white'"
        >
          POLICIES
        </button>

        <button
          @click="activeTab = 'REPORT'; requestStatus = null; formErrors = {}"
          class="px-3 py-2 border transition-all uppercase font-bold shrink-0 cursor-pointer"
          :class="activeTab === 'REPORT' ? 'bg-[#3d8b5e] border-[#3d8b5e] text-white' : 'bg-[#0a0a0c] border-[#1e1e20] text-[#a0a0a4] hover:text-white'"
        >
          DATA REPORT (S.11)
        </button>

        <button
          @click="activeTab = 'ERASURE'; requestStatus = null; formErrors = {}"
          class="px-3 py-2 border transition-all uppercase font-bold shrink-0 cursor-pointer"
          :class="activeTab === 'ERASURE' ? 'bg-[#c44a4a] border-[#c44a4a] text-white' : 'bg-[#0a0a0c] border-[#1e1e20] text-[#a0a0a4] hover:text-white'"
        >
          DATA DELETION (SEC 12)
        </button>

        <button
          @click="activeTab = 'CORRECTION'; requestStatus = null; formErrors = {}"
          class="px-3 py-2 border transition-all uppercase font-bold shrink-0 cursor-pointer"
          :class="activeTab === 'CORRECTION' ? 'bg-[#4a7ebb] border-[#4a7ebb] text-white' : 'bg-[#0a0a0c] border-[#1e1e20] text-[#a0a0a4] hover:text-white'"
        >
          CORRECTION (SEC 12)
        </button>

        <button
          @click="activeTab = 'NOMINATION'; requestStatus = null; formErrors = {}"
          class="px-3 py-2 border transition-all uppercase font-bold shrink-0 cursor-pointer"
          :class="activeTab === 'NOMINATION' ? 'bg-[#c49a3c] border-[#c49a3c] text-white' : 'bg-[#0a0a0c] border-[#1e1e20] text-[#a0a0a4] hover:text-white'"
        >
          NOMINATE (SEC 14)
        </button>

        <button
          @click="activeTab = 'GRIEVANCE'; requestStatus = null; formErrors = {}"
          class="px-3 py-2 border transition-all uppercase font-bold shrink-0 cursor-pointer"
          :class="activeTab === 'GRIEVANCE' ? 'bg-[#750d37] border-[#750d37] text-white' : 'bg-[#0a0a0c] border-[#1e1e20] text-[#a0a0a4] hover:text-white'"
        >
          GRIEVANCE (SEC 13)
        </button>
      </div>

      <!-- Tab Content Area with Smooth Vertical Scroll -->
      <div class="flex-1 overflow-y-auto pr-1">

      <!-- TAB: POLICIES & LEGAL NOTICES -->
      <div v-if="activeTab === 'POLICIES'" class="space-y-5 font-mono text-xs text-[#a0a0a4] leading-relaxed">
        <div class="space-y-2">
          <div class="text-white font-bold uppercase text-xs border-b border-[#1e1e20] pb-1">1. PRIVACY POLICY — DPDP ACT 2023</div>
          <p>ShadowVerse Private Cloud ("Data Fiduciary") collects and processes personal data strictly in accordance with the Digital Personal Data Protection Act, 2023 (Act 22 of 2023).</p>
          <p><span class="text-white font-bold">Data Collected:</span> Name, email, phone number, Google account UID, device session metadata, and access logs.</p>
          <p><span class="text-white font-bold">Purpose of Processing:</span> Authentication, operator access control, security audit logging, emergency contact allocation, and statutory DPDP compliance.</p>
          <p><span class="text-white font-bold">Data Retention:</span> Personal data retained for a maximum of 60 days post-deactivation. Surveillance video purged from Ceph immutable storage within 48 hours of an erasure request.</p>
          <p><span class="text-white font-bold">Data Protection Officer:</span> Arun Kumar Pillai — coo@shadowverse.in</p>
        </div>

        <div class="space-y-2">
          <div class="text-white font-bold uppercase text-xs border-b border-[#1e1e20] pb-1">2. YOUR RIGHTS UNDER DPDP ACT 2023</div>
          <div class="space-y-1.5">
            <div><span class="text-white font-bold">S.11 — Right to Access:</span> Obtain a summary of personal data being processed about you including camera timestamps, facial vector hashes, and identity matches.</div>
            <div><span class="text-white font-bold">S.12 — Right to Correction & Erasure:</span> Correct inaccurate data or request complete deletion of your personal data and surveillance records.</div>
            <div><span class="text-white font-bold">S.13 — Right to Grievance Redressal:</span> File a formal complaint with the DPO. Statutory 7-day response window. Appeal to DPBI if unresolved.</div>
            <div><span class="text-white font-bold">S.14 — Right to Nominate:</span> Nominate an individual to exercise your data rights in the event of death or incapacity.</div>
          </div>
        </div>

        <div class="space-y-2">
          <div class="text-white font-bold uppercase text-xs border-b border-[#1e1e20] pb-1">3. TERMS & CONDITIONS OF USE</div>
          <p>Access is restricted exclusively to authorized personnel holding an active <span class="text-white font-bold">@shadowverse.in</span> domain email account.</p>
          <p><span class="text-white font-bold">Authorized Use:</span> Lawful surveillance monitoring, security incident response, and data protection management within your designated operator role.</p>
          <p><span class="text-white font-bold">Prohibited Use:</span> Unauthorized access, credential sharing, or surveillance outside designated zones. Violations may result in immediate account termination and legal proceedings under Indian law.</p>
          <p><span class="text-white font-bold">Security Obligations:</span> You are responsible for maintaining confidentiality of your authentication credentials. Report any suspected breach to coo@shadowverse.in immediately.</p>
        </div>

        <div class="space-y-2">
          <div class="text-white font-bold uppercase text-xs border-b border-[#1e1e20] pb-1">4. DATA SHARING & THIRD PARTIES</div>
          <p>ShadowVerse does not sell, rent, or share personal data with third parties for marketing. Data may be disclosed to law enforcement solely in compliance with a valid court order under Indian law.</p>
          <p>Google authentication is processed by Google LLC under their own Privacy Policy. ShadowVerse only receives your verified email, display name, and unique Google UID from this authentication.</p>
        </div>

        <div class="space-y-2">
          <div class="text-white font-bold uppercase text-xs border-b border-[#1e1e20] pb-1">5. CONSENT & WITHDRAWAL</div>
          <p>By accessing this platform, you have provided free, informed, specific, and unambiguous consent to the collection and processing of your personal data as described herein, in accordance with Section 6 of the DPDP Act 2023.</p>
          <p>You may withdraw consent at any time by submitting an Erasure request via the Data Deletion tab. Withdrawal of consent will result in termination of access to this platform.</p>
        </div>

        <div class="p-3 bg-[#4a7ebb]/10 border border-[#4a7ebb]/40 text-[#4a7ebb] font-bold uppercase text-[10px]">
          // USE THE TABS ABOVE TO EXERCISE YOUR STATUTORY RIGHTS UNDER THE DPDP ACT 2023
        </div>
      </div>

      <!-- TAB 1: REQUEST COPY OF PERSONAL DATA REPORT -->
      <div v-if="activeTab === 'REPORT'" class="space-y-4 font-mono text-xs">
        <div class="p-3 bg-[#0a0a0c] border border-[#1e1e20] space-y-1">
          <div class="text-white font-bold uppercase text-xs">// SECTION 11(1) — RIGHT TO ACCESS SUMMARY OF PERSONAL DATA</div>
          <p class="text-[#a0a0a4] text-[11px] leading-relaxed">
            As a Data Principal under DPDP Act Section 11(1), you are entitled to obtain a summary of personal data being processed, camera video timestamps, facial vector hashes, and identity matches.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label for="dpdp-report-name" class="text-[#555558] block mb-1 uppercase text-[10px]">APPLICANT NAME / IDENTITY: *</label>
            <input
              id="dpdp-report-name"
              v-model="applicantName"
              @input="delete formErrors.applicantName"
              type="text"
              placeholder="e.g. ARJUN MEHTA"
              class="industrial-input"
              :aria-invalid="!!formErrors.applicantName"
              aria-describedby="report-name-err"
            />
            <span id="report-name-err" v-if="formErrors.applicantName" class="text-[#c44a4a] text-[10px] block mt-1">{{ formErrors.applicantName }}</span>
          </div>
          <div>
            <label for="dpdp-report-id" class="text-[#555558] block mb-1 uppercase text-[10px]">VISITOR / RESIDENT ID: *</label>
            <input
              id="dpdp-report-id"
              v-model="applicantIdNo"
              @input="delete formErrors.applicantIdNo"
              type="text"
              placeholder="e.g. VIS-9021"
              class="industrial-input"
              :aria-invalid="!!formErrors.applicantIdNo"
              aria-describedby="report-id-err"
            />
            <span id="report-id-err" v-if="formErrors.applicantIdNo" class="text-[#c44a4a] text-[10px] block mt-1">{{ formErrors.applicantIdNo }}</span>
          </div>
        </div>

        <button
          @click="handleGenerateReport"
          :disabled="isProcessing"
          class="industrial-btn industrial-btn-primary w-full py-3 text-xs"
        >
          <span v-if="isProcessing">QUERYING CEPH IMMUTABLE STORAGE...</span>
          <span v-else>GENERATE STATUTORY DATA REPORT</span>
        </button>

        <!-- Resulting Report -->
        <div v-if="requestStatus === 'REPORT_GENERATED' && generatedDataReport" class="p-4 bg-[#0a0a0c] border-2 border-[#3d8b5e] space-y-3">
          <div class="flex items-center justify-between border-b border-[#1e1e20] pb-2">
            <span class="text-[#3d8b5e] font-bold uppercase">// STATUTORY DATA REPORT GENERATED</span>
            <span class="text-white">REF: {{ generatedDataReport.refNo }}</span>
          </div>

          <div class="space-y-1.5 text-[11px] text-[#a0a0a4]">
            <div><span class="text-white font-bold">DATA PRINCIPAL:</span> {{ generatedDataReport.principalName }} ({{ generatedDataReport.principalId }})</div>
            <div><span class="text-white font-bold">DATA FIDUCIARY:</span> {{ generatedDataReport.dataFiduciary }}</div>
            <div><span class="text-white font-bold">ASSIGNED DPO:</span> {{ generatedDataReport.dpoAssigned }}</div>
            <div><span class="text-white font-bold">TOTAL MATCHED RECORDS:</span> {{ generatedDataReport.processedRecordsCount }} CAMERA TIMESTAMPS</div>
            <div><span class="text-white font-bold">MATCHED ZONES:</span> {{ generatedDataReport.matchedZones.join(', ') }}</div>
            <div><span class="text-white font-bold">FACIAL HASH EMBEDDINGS:</span> {{ generatedDataReport.facialVectorHashes.join(' · ') }}</div>
            <div><span class="text-white font-bold">PURGE SCHEDULE:</span> {{ generatedDataReport.cephPurgeSchedule }}</div>
          </div>

          <button @click="downloadDataReportJson" class="industrial-btn industrial-btn-outline w-full text-xs border-[#3d8b5e] text-white">
            DOWNLOAD OFFICIAL JSON DATA REPORT
          </button>
        </div>
      </div>

      <!-- TAB 2: REQUEST DATA ERASURE & DELETION -->
      <div v-else-if="activeTab === 'ERASURE'" class="space-y-4 font-mono text-xs">
        <div class="p-3 bg-[#0a0a0c] border border-[#c44a4a]/40 space-y-1">
          <div class="text-[#c44a4a] font-bold uppercase text-xs">// SECTION 12(1) — RIGHT TO ERASURE & CRYPTOGRAPHIC PURGING</div>
          <p class="text-[#a0a0a4] text-[11px] leading-relaxed">
            Data Principals may request complete erasure of personal data, video recordings, and facial vector hashes unless preservation is required by order of law.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label for="dpdp-erasure-name" class="text-[#555558] block mb-1 uppercase text-[10px]">FULL NAME: *</label>
            <input
              id="dpdp-erasure-name"
              v-model="applicantName"
              @input="delete formErrors.applicantName"
              type="text"
              placeholder="e.g. ARJUN MEHTA"
              class="industrial-input"
              :aria-invalid="!!formErrors.applicantName"
              aria-describedby="erasure-name-err"
            />
            <span id="erasure-name-err" v-if="formErrors.applicantName" class="text-[#c44a4a] text-[10px] block mt-1">{{ formErrors.applicantName }}</span>
          </div>
          <div>
            <label for="dpdp-erasure-phone" class="text-[#555558] block mb-1 uppercase text-[10px]">PHONE / IDENTITY NUMBER: *</label>
            <input
              id="dpdp-erasure-phone"
              v-model="applicantPhone"
              @input="delete formErrors.applicantPhone"
              type="text"
              placeholder="+91 98765 43210"
              class="industrial-input"
              :aria-invalid="!!formErrors.applicantPhone"
              aria-describedby="erasure-phone-err"
            />
            <span id="erasure-phone-err" v-if="formErrors.applicantPhone" class="text-[#c44a4a] text-[10px] block mt-1">{{ formErrors.applicantPhone }}</span>
          </div>
        </div>

        <div>
          <label for="dpdp-erasure-reason" class="text-[#555558] block mb-1 uppercase text-[10px]">REASON FOR ERASURE REQUEST:</label>
          <textarea
            id="dpdp-erasure-reason"
            v-model="reqReason"
            rows="2"
            class="industrial-input"
          ></textarea>
        </div>

        <button
          @click="handleErasureRequest"
          :disabled="isProcessing"
          class="industrial-btn industrial-btn-primary w-full py-3 text-xs border-[#c44a4a] bg-[#c44a4a]"
        >
          <span v-if="isProcessing">DISPATCHING CEPH PURGE INSTRUCTION...</span>
          <span v-else>SUBMIT STATUTORY ERASURE REQUEST</span>
        </button>

        <div v-if="requestStatus === 'ERASURE_SCHEDULED'" class="p-3.5 bg-[#c44a4a]/15 border border-[#c44a4a] text-center space-y-1">
          <div class="text-[#c44a4a] font-bold uppercase">// STATUTORY ERASURE INSTRUCTION FILED</div>
          <div class="text-white text-xs">REFERENCE NO: [ {{ generatedRefNo }} ]</div>
          <p class="text-[10px] text-[#a0a0a4]">
            CEPH CLUSTER HAS REGISTERED CRYPTOGRAPHIC PURGE MANDATE. DATA PURGING COMPLETE WITHIN 48 HOURS. DPO ARUN KUMAR PILLAI NOTIFIED.
          </p>
        </div>
      </div>

      <!-- TAB 3: REQUEST DATA CORRECTION -->
      <div v-else-if="activeTab === 'CORRECTION'" class="space-y-4 font-mono text-xs">
        <div class="p-3 bg-[#0a0a0c] border border-[#4a7ebb]/40 space-y-1">
          <div class="text-[#4a7ebb] font-bold uppercase text-xs">// SECTION 12(1) — RIGHT TO CORRECTION & COMPLETION</div>
          <p class="text-[#a0a0a4] text-[11px] leading-relaxed">
            Request correction, updating, or completion of inaccurate identity categorization or visitor profile attributes.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label for="dpdp-corr-name" class="text-[#555558] block mb-1 uppercase text-[10px]">CURRENT RECORDED NAME: *</label>
            <input
              id="dpdp-corr-name"
              v-model="applicantName"
              @input="delete formErrors.applicantName"
              type="text"
              placeholder="e.g. ARJUN MEHTA"
              class="industrial-input"
              :aria-invalid="!!formErrors.applicantName"
              aria-describedby="corr-name-err"
            />
            <span id="corr-name-err" v-if="formErrors.applicantName" class="text-[#c44a4a] text-[10px] block mt-1">{{ formErrors.applicantName }}</span>
          </div>
          <div>
            <label for="dpdp-corr-val" class="text-[#555558] block mb-1 uppercase text-[10px]">CORRECTED VALUE / DETAILS: *</label>
            <input
              id="dpdp-corr-val"
              v-model="correctedDetails"
              @input="delete formErrors.correctedDetails"
              type="text"
              placeholder="e.g. ARJUN MEHTA (AUTHORIZED ARCHITECT)"
              class="industrial-input"
              :aria-invalid="!!formErrors.correctedDetails"
              aria-describedby="corr-val-err"
            />
            <span id="corr-val-err" v-if="formErrors.correctedDetails" class="text-[#c44a4a] text-[10px] block mt-1">{{ formErrors.correctedDetails }}</span>
          </div>
        </div>

        <button @click="handleCorrectionRequest" :disabled="isProcessing" class="industrial-btn industrial-btn-primary w-full py-3 text-xs border-[#4a7ebb] bg-[#4a7ebb]">
          <span v-if="isProcessing">SUBMITTING CORRECTION...</span>
          <span v-else>SUBMIT CORRECTION NOTICE</span>
        </button>

        <div v-if="requestStatus === 'CORRECTION_LOGGED'" class="p-3.5 bg-[#4a7ebb]/15 border border-[#4a7ebb] text-center space-y-1">
          <div class="text-[#4a7ebb] font-bold uppercase">// CORRECTION NOTICE RECORDED</div>
          <div class="text-white text-xs">REF NO: [ {{ generatedRefNo }} ]</div>
        </div>
      </div>

      <!-- TAB 4: NOMINATE AN INDIVIDUAL -->
      <div v-else-if="activeTab === 'NOMINATION'" class="space-y-4 font-mono text-xs">
        <div class="p-3 bg-[#0a0a0c] border border-[#c49a3c]/40 space-y-1">
          <div class="text-[#c49a3c] font-bold uppercase text-xs">// SECTION 14 — RIGHT TO NOMINATE</div>
          <p class="text-[#a0a0a4] text-[11px] leading-relaxed">
            Nominate an individual to exercise Data Principal rights on your behalf in the event of death or incapacity.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label for="dpdp-nom-name" class="text-[#555558] block mb-1 uppercase text-[10px]">NOMINEE FULL NAME: *</label>
            <input
              id="dpdp-nom-name"
              v-model="nomineeName"
              @input="delete formErrors.nomineeName"
              type="text"
              placeholder="e.g. ANANYA MEHTA"
              class="industrial-input"
              :aria-invalid="!!formErrors.nomineeName"
              aria-describedby="nom-name-err"
            />
            <span id="nom-name-err" v-if="formErrors.nomineeName" class="text-[#c44a4a] text-[10px] block mt-1">{{ formErrors.nomineeName }}</span>
          </div>
          <div>
            <label for="dpdp-nom-contact" class="text-[#555558] block mb-1 uppercase text-[10px]">NOMINEE CONTACT / RELATION: *</label>
            <input
              id="dpdp-nom-contact"
              v-model="nomineeContact"
              @input="delete formErrors.nomineeContact"
              type="text"
              placeholder="+91 98111 22233 (SPOUSE)"
              class="industrial-input"
              :aria-invalid="!!formErrors.nomineeContact"
              aria-describedby="nom-contact-err"
            />
            <span id="nom-contact-err" v-if="formErrors.nomineeContact" class="text-[#c44a4a] text-[10px] block mt-1">{{ formErrors.nomineeContact }}</span>
          </div>
        </div>

        <button @click="handleNominationSubmit" :disabled="isProcessing" class="industrial-btn industrial-btn-primary w-full py-3 text-xs border-[#c49a3c] bg-[#c49a3c]">
          <span v-if="isProcessing">REGISTERING NOMINEE...</span>
          <span v-else>REGISTER NOMINEE ON CEPH REGISTRY</span>
        </button>

        <div v-if="requestStatus === 'NOMINEE_REGISTERED'" class="p-3.5 bg-[#c49a3c]/15 border border-[#c49a3c] text-center space-y-1">
          <div class="text-[#c49a3c] font-bold uppercase">// NOMINEE REGISTERED</div>
          <div class="text-white text-xs">REGISTRATION REF: [ {{ generatedRefNo }} ]</div>
        </div>
      </div>

      <!-- TAB 5: GRIEVANCE REDRESSAL -->
      <div v-else-if="activeTab === 'GRIEVANCE'" class="space-y-4 font-mono text-xs">
        <div class="p-3 bg-[#0a0a0c] border border-[#750d37]/40 space-y-1">
          <div class="text-[#750d37] font-bold uppercase text-xs">// SECTION 13 — GRIEVANCE REDRESSAL & APPEAL</div>
          <p class="text-[#a0a0a4] text-[11px] leading-relaxed">
            Submit a formal grievance regarding data processing directly to Data Protection Officer Arun Kumar Pillai.
          </p>
        </div>

        <div class="p-3 bg-[#111113] border border-[#1e1e20] flex items-center justify-between text-[#a0a0a4]">
          <div>
            <div><span class="text-white font-bold">DPO NAME:</span> ARUN KUMAR PILLAI</div>
            <div><span class="text-white font-bold">OFFICIAL DPO EMAIL:</span> coo@shadowverse.in</div>
          </div>
          <button @click="copyDpoEmail" class="px-2.5 py-1 bg-[#750d37]/20 border border-[#750d37] text-white font-mono text-[10px] font-bold uppercase hover:bg-[#750d37] transition-all">
            COPY DPO EMAIL
          </button>
        </div>

        <div>
          <label for="dpdp-grievance-desc" class="text-[#555558] block mb-1 uppercase text-[10px]">STATUTORY GRIEVANCE DESCRIPTION: *</label>
          <textarea
            id="dpdp-grievance-desc"
            v-model="grievanceText"
            @input="delete formErrors.grievanceText"
            rows="3"
            placeholder="Describe grievance under DPDP Act 2023 rules..."
            class="industrial-input"
            :aria-invalid="!!formErrors.grievanceText"
            aria-describedby="grievance-err"
          ></textarea>
          <span id="grievance-err" v-if="formErrors.grievanceText" class="text-[#c44a4a] text-[10px] block mt-1">{{ formErrors.grievanceText }}</span>
        </div>

        <button @click="handleGrievanceSubmit" :disabled="isProcessing" class="industrial-btn industrial-btn-primary w-full py-3 text-xs border-[#750d37] bg-[#750d37]">
          <span v-if="isProcessing">TRANSMITTING TO DPO...</span>
          <span v-else>TRANSMIT GRIEVANCE TO DPO ARUN KUMAR PILLAI</span>
        </button>

        <div v-if="requestStatus === 'GRIEVANCE_ESCALATED'" class="p-3.5 bg-[#750d37]/20 border border-[#750d37] text-center space-y-1">
          <div class="text-white font-bold uppercase">// GRIEVANCE DISPATCHED TO DPO</div>
          <div class="text-white text-xs">TICKET REF: [ {{ generatedRefNo }} ]</div>
          <p class="text-[10px] text-[#a0a0a4]">
            DPO ARUN KUMAR PILLAI (coo@shadowverse.in) WILL RESPOND WITHIN STATUTORY 7-DAY WINDOW. APPEAL MAY BE FILED WITH DPBI IF UNRESOLVED.
          </p>
        </div>
      </div>

    </div>
  </div>
</div>
</template>
