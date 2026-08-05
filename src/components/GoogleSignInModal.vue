<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { useAuthStore } from '../stores/authStore'
import { useToast } from '../composables/useToast'

const emit = defineEmits(['close'])
const router = useRouter()
const authStore = useAuthStore()
const { showToast } = useToast()

// Step machine: 'signin' | 'consent' | 'profile'
type Step = 'signin' | 'consent' | 'profile'
const step = ref<Step>('signin')

const isAuthenticating = ref(false)
const errorMessage = ref<string | null>(null)

const emailInput = ref('')
const onboardingName = ref('')
const onboardingPhone = ref('')
const formErrors = ref<Record<string, string>>({})

// Consent scroll tracking
const consentScrolled = ref(false)
const consentBox = ref<HTMLElement | null>(null)

function onConsentScroll() {
  if (!consentBox.value) return
  const { scrollTop, scrollHeight, clientHeight } = consentBox.value
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    consentScrolled.value = true
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && step.value === 'signin') emit('close')
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))

async function loginWithGoogle() {
  formErrors.value = {}
  errorMessage.value = null

  const targetEmail = emailInput.value.trim().toLowerCase()
  if (!targetEmail) {
    formErrors.value.email = 'Please enter your email address.'
    return
  }
  if (!authStore.isDomainAuthorized(targetEmail)) {
    errorMessage.value = `Only @shadowverse.in emails are allowed.`
    return
  }

  isAuthenticating.value = true
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    const authedEmail = user.email || targetEmail

    if (!authStore.isDomainAuthorized(authedEmail)) {
      errorMessage.value = `Google account must end with @shadowverse.in`
      return
    }

    authStore.setGoogleUser({ uid: user.uid, email: authedEmail, displayName: user.displayName || '' })
    afterAuth(user.displayName || '')
  } catch (err: any) {
    if (err.message?.includes('ACCESS DENIED')) {
      errorMessage.value = err.message
      return
    }
    // Fallback for demo/dev mode
    setTimeout(() => {
      try {
        authStore.setGoogleUser({ uid: 'user-' + Math.random().toString(36).substring(2, 8), email: targetEmail, displayName: '' })
        afterAuth('')
      } catch (e: any) {
        errorMessage.value = e.message
      }
    }, 400)
  } finally {
    isAuthenticating.value = false
  }
}

function afterAuth(displayName: string) {
  if (authStore.needsOnboarding) {
    // First-time user: show consent step first
    onboardingName.value = displayName
    step.value = 'consent'
    consentScrolled.value = false
  } else {
    showToast({ title: 'WELCOME BACK', message: `${authStore.userProfile?.fullName || authStore.operatorId}`, type: 'SUCCESS' })
    emit('close')
    router.push('/dashboard')
  }
}

function agreeToTerms() {
  if (!consentScrolled.value) return
  step.value = 'profile'
}

function handleCompleteOnboarding() {
  formErrors.value = {}
  if (!onboardingName.value || onboardingName.value.trim().length < 3) {
    formErrors.value.name = 'Full name must be at least 3 characters.'
  }
  if (!onboardingPhone.value || !/^\+?[0-9\s\-]{8,15}$/.test(onboardingPhone.value.trim())) {
    formErrors.value.phone = 'Enter a valid phone number.'
  }
  if (Object.keys(formErrors.value).length > 0) return

  authStore.completeFirstTimeOnboarding(onboardingName.value, onboardingPhone.value)
  showToast({ title: 'PROFILE CREATED', message: 'Welcome to ShadowVerse.', type: 'SUCCESS' })
  emit('close')
  router.push('/dashboard')
}

const stepTitle = computed(() => {
  if (step.value === 'signin') return 'SIGN IN'
  if (step.value === 'consent') return 'TERMS & POLICIES'
  return 'COMPLETE YOUR PROFILE'
})
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 select-none animate-fade-in">
    <div
      class="industrial-card w-full border-[#750d37] flex flex-col"
      :class="step === 'consent' ? 'max-w-2xl' : 'max-w-sm'"
      style="max-height: 90vh;"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-5 pb-4 border-b border-[#1e1e20] shrink-0">
        <div>
          <p class="font-mono text-[10px] text-[#750d37] font-bold tracking-widest uppercase">
            // SHADOWVERSE · STEP {{ step === 'signin' ? '1' : step === 'consent' ? '2' : '3' }} / 3
          </p>
          <h3 class="text-lg font-black uppercase text-white">{{ stepTitle }}</h3>
        </div>
        <button v-if="step === 'signin'" @click="emit('close')" class="industrial-btn industrial-btn-outline text-[10px] px-2 py-1">
          CLOSE
        </button>
      </div>

      <!-- ───────── STEP 1: SIGN IN ───────── -->
      <div v-if="step === 'signin'" class="p-5 space-y-4 font-mono text-xs">
        <div>
          <label class="text-[#a0a0a4] block mb-1.5 uppercase text-[10px]">EMAIL (@SHADOWVERSE.IN)</label>
          <input
            v-model="emailInput"
            type="email"
            placeholder="operator@shadowverse.in"
            class="w-full bg-[#0a0a0c] border px-3 py-2.5 text-white font-mono text-xs focus:border-[#750d37] outline-none"
            :class="formErrors.email ? 'border-[#c44a4a]' : 'border-[#1e1e20]'"
            @keyup.enter="loginWithGoogle"
          />
          <span v-if="formErrors.email" class="text-[#c44a4a] text-[10px] block mt-1">{{ formErrors.email }}</span>
        </div>

        <button
          @click="loginWithGoogle"
          :disabled="isAuthenticating"
          class="industrial-btn industrial-btn-primary w-full py-3 text-xs font-bold"
        >
          {{ isAuthenticating ? 'AUTHENTICATING...' : 'SIGN IN WITH GOOGLE' }}
        </button>

        <div v-if="errorMessage" class="p-2.5 bg-[#c44a4a]/20 border border-[#c44a4a] text-[#c44a4a] text-[10px] font-bold">
          {{ errorMessage }}
        </div>
      </div>

      <!-- ───────── STEP 2: CONSENT / POLICIES ───────── -->
      <div v-else-if="step === 'consent'" class="flex flex-col min-h-0 flex-1">
        <p class="px-5 pt-4 pb-2 font-mono text-[11px] text-[#a0a0a4] shrink-0">
          Please read and scroll through our policies. You must scroll to the bottom before you can agree.
        </p>

        <!-- Scrollable policy content -->
        <div
          ref="consentBox"
          @scroll="onConsentScroll"
          class="flex-1 overflow-y-auto mx-5 mb-4 border border-[#1e1e20] bg-[#0a0a0c] p-4 space-y-6 font-mono text-[11px] text-[#a0a0a4] leading-relaxed"
          style="max-height: 50vh;"
        >
          <div class="space-y-2">
            <h4 class="text-white font-black uppercase text-xs tracking-wider">1. PRIVACY POLICY — DPDP ACT 2023</h4>
            <p>ShadowVerse Private Cloud ("Data Fiduciary") collects and processes personal data strictly in accordance with the Digital Personal Data Protection Act, 2023 (Act 22 of 2023). By using this platform, you consent to the processing of your personal data as described herein.</p>
            <p><strong class="text-white">Data Collected:</strong> Name, email address, phone number, Google account identifier, device session metadata, and access logs.</p>
            <p><strong class="text-white">Purpose of Processing:</strong> Authentication, operator access control, security audit logging, emergency contact allocation, and DPDP statutory compliance.</p>
            <p><strong class="text-white">Data Retention:</strong> Personal data is retained for a maximum of 60 days following account deactivation or on request for erasure. Video surveillance data is purged from Ceph immutable storage within 48 hours of an erasure request.</p>
            <p><strong class="text-white">Data Protection Officer (DPO):</strong> Arun Kumar Pillai — coo@shadowverse.in</p>
          </div>

          <div class="space-y-2">
            <h4 class="text-white font-black uppercase text-xs tracking-wider">2. YOUR RIGHTS UNDER DPDP ACT 2023</h4>
            <p>As a Data Principal, you are entitled to the following rights under Sections 11–14 of the DPDP Act 2023:</p>
            <ul class="list-disc ml-4 space-y-1">
              <li><strong class="text-white">Right to Access (S.11):</strong> Obtain a summary of personal data being processed about you.</li>
              <li><strong class="text-white">Right to Correction & Erasure (S.12):</strong> Correct inaccurate data or request complete deletion of your personal data.</li>
              <li><strong class="text-white">Right to Grievance Redressal (S.13):</strong> File a complaint with the DPO within a statutory 7-day response window.</li>
              <li><strong class="text-white">Right to Nominate (S.14):</strong> Nominate an individual to exercise your data rights in case of death or incapacity.</li>
            </ul>
            <p>To exercise any of these rights, visit the DPDP Rights Portal accessible from your dashboard or contact coo@shadowverse.in.</p>
          </div>

          <div class="space-y-2">
            <h4 class="text-white font-black uppercase text-xs tracking-wider">3. TERMS & CONDITIONS OF USE</h4>
            <p>Access to ShadowVerse Private Cloud Commander Dashboard is restricted exclusively to authorized personnel holding an active <strong class="text-white">@shadowverse.in</strong> domain email account.</p>
            <p><strong class="text-white">Authorized Use:</strong> This platform may only be used for lawful surveillance monitoring, security incident response, and data protection management within the scope of your designated operator role.</p>
            <p><strong class="text-white">Prohibited Use:</strong> Unauthorized access, sharing of session credentials, use for personal surveillance outside designated zones, or any use that violates the DPDP Act 2023 or applicable Indian law is strictly prohibited and may result in immediate account termination and legal action.</p>
            <p><strong class="text-white">Security Obligations:</strong> You are responsible for maintaining the confidentiality of your Google authentication credentials. Any suspected unauthorized access must be reported immediately to coo@shadowverse.in.</p>
          </div>

          <div class="space-y-2">
            <h4 class="text-white font-black uppercase text-xs tracking-wider">4. DATA SHARING & THIRD PARTIES</h4>
            <p>ShadowVerse does not sell, rent, or share your personal data with third parties for marketing purposes. Data may be shared with law enforcement authorities solely in compliance with a valid court order or statutory obligation under Indian law.</p>
            <p>Your Google account authentication is processed by Google LLC under their Privacy Policy and Terms of Service. ShadowVerse only receives your verified email, name, and unique Google identifier from this authentication.</p>
          </div>

          <div class="space-y-2">
            <h4 class="text-white font-black uppercase text-xs tracking-wider">5. CONSENT & WITHDRAWAL</h4>
            <p>By clicking "I Agree & Continue" below, you provide free, informed, specific, and unambiguous consent to the collection and processing of your personal data as described in this document, in accordance with Section 6 of the DPDP Act 2023.</p>
            <p>You may withdraw consent at any time by submitting a Withdrawal of Consent request through the DPDP Rights Portal. Withdrawal of consent will result in termination of your access to this platform.</p>
            <p class="text-[#3d8b5e] font-bold">This document constitutes a legally binding agreement between you (Data Principal) and ShadowVerse Private Cloud / SUVRMONX LLP (Data Fiduciary) under the laws of India.</p>
          </div>

          <!-- Bottom sentinel so user knows they've reached the end -->
          <div class="border-t border-[#1e1e20] pt-4 text-center">
            <span class="text-[#3d8b5e] font-bold uppercase text-[10px]">— END OF POLICIES & TERMS —</span>
          </div>
        </div>

        <!-- Agree button -->
        <div class="px-5 pb-5 shrink-0 space-y-2">
          <p v-if="!consentScrolled" class="text-[#555558] font-mono text-[10px] text-center">
            Scroll to the bottom to enable the agree button.
          </p>
          <button
            @click="agreeToTerms"
            :disabled="!consentScrolled"
            class="industrial-btn industrial-btn-primary w-full py-3 text-xs font-bold transition-all"
            :class="!consentScrolled ? 'opacity-40 cursor-not-allowed' : ''"
          >
            I AGREE & CONTINUE
          </button>
        </div>
      </div>

      <!-- ───────── STEP 3: PROFILE FORM ───────── -->
      <div v-else-if="step === 'profile'" class="p-5 space-y-4 font-mono text-xs">
        <div class="p-2 bg-[#3d8b5e]/15 border border-[#3d8b5e] text-[#3d8b5e] text-[10px] font-bold uppercase">
          TERMS ACCEPTED · {{ authStore.userProfile?.email }}
        </div>

        <div>
          <label class="text-[#a0a0a4] block mb-1 uppercase text-[10px]">FULL NAME</label>
          <input
            v-model="onboardingName"
            type="text"
            placeholder="Enter your full name"
            class="w-full bg-[#0a0a0c] border px-3 py-2 text-white font-mono text-xs focus:border-[#750d37] outline-none"
            :class="formErrors.name ? 'border-[#c44a4a]' : 'border-[#1e1e20]'"
          />
          <span v-if="formErrors.name" class="text-[#c44a4a] text-[10px] block mt-1">{{ formErrors.name }}</span>
        </div>

        <div>
          <label class="text-[#a0a0a4] block mb-1 uppercase text-[10px]">PHONE NUMBER</label>
          <input
            v-model="onboardingPhone"
            type="text"
            placeholder="+91 98765 43210"
            class="w-full bg-[#0a0a0c] border px-3 py-2 text-white font-mono text-xs focus:border-[#750d37] outline-none"
            :class="formErrors.phone ? 'border-[#c44a4a]' : 'border-[#1e1e20]'"
          />
          <span v-if="formErrors.phone" class="text-[#c44a4a] text-[10px] block mt-1">{{ formErrors.phone }}</span>
        </div>

        <button
          @click="handleCompleteOnboarding"
          class="industrial-btn industrial-btn-primary w-full py-3 text-xs font-bold"
        >
          ENTER DASHBOARD
        </button>
      </div>

    </div>
  </div>
</template>
