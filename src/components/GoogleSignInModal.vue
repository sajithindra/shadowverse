<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { useAuthStore } from '../stores/authStore'
import { useToast } from '../composables/useToast'

const props = withDefaults(defineProps<{
  isPresentationOnly?: boolean
}>(), {
  isPresentationOnly: false
})

const emit = defineEmits(['close'])
const router = useRouter()
const authStore = useAuthStore()
const { showToast } = useToast()

type Step = 'signin' | 'consent' | 'profile'
const step = ref<Step>('signin')

const isAuthenticating = ref(false)
const errorMessage = ref<string | null>(null)

const onboardingName = ref('')
const onboardingPhone = ref('')
const formErrors = ref<Record<string, string>>({})

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

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
  }

  // Check if returning from a signInWithRedirect flow
  try {
    const redirectResult = await getRedirectResult(auth)
    if (redirectResult && redirectResult.user) {
      isAuthenticating.value = true
      await processAuthedUser(redirectResult.user)
      isAuthenticating.value = false
    }
  } catch (err: any) {
    console.warn('Redirect auth result error:', err)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})

async function processAuthedUser(user: any) {
  const authedEmail = (user.email || '').trim().toLowerCase()

  if (!authStore.isDomainAuthorized(authedEmail)) {
    await authStore.logUnauthorizedLogin({
      email: authedEmail,
      uid: user.uid,
      displayName: user.displayName || 'External Google User',
      reason: `Unauthorized domain login attempt using email: ${authedEmail}`
    })

    errorMessage.value = `ACCESS DENIED: Account "${authedEmail}" is not authorized. Attempt logged to sovereign security audit.`
    showToast({
      title: 'UNAUTHORIZED ACCESS AUDITED',
      message: `Recorded unauthorized login attempt from ${authedEmail}.`,
      type: 'ALERT'
    })
    return
  }

  // If presentation mode -> skip onboarding & grant immediate access
  authStore.setGoogleUser(
    {
      uid: user.uid,
      email: authedEmail,
      displayName: user.displayName || '',
      photoURL: user.photoURL || ''
    },
    props.isPresentationOnly
  )

  afterAuth(user.displayName || '')
}

async function loginWithGoogle() {
  formErrors.value = {}
  errorMessage.value = null
  isAuthenticating.value = true

  try {
    const result = await signInWithPopup(auth, googleProvider)
    await processAuthedUser(result.user)
  } catch (err: any) {
    if (err.message?.includes('ACCESS DENIED') || err.message?.includes('@shadowverse.in')) {
      errorMessage.value = err.message
      return
    }
    // Popup blocked -> fallback to redirect sign-in
    try {
      showToast({ title: 'REDIRECTING TO GOOGLE...', message: 'Switching to secure browser redirect login...', type: 'INFO' })
      await signInWithRedirect(auth, googleProvider)
      return
    } catch (redirectErr: any) {
      errorMessage.value = `Google Sign-In error: ${redirectErr.message || 'Browser blocked sign-in popup.'}`
    }
  } finally {
    isAuthenticating.value = false
  }
}

async function loginWithRedirectMode() {
  formErrors.value = {}
  errorMessage.value = null
  isAuthenticating.value = true

  try {
    await signInWithRedirect(auth, googleProvider)
  } catch (err: any) {
    errorMessage.value = `Google Redirect error: ${err.message}`
    isAuthenticating.value = false
  }
}

function afterAuth(displayName: string) {
  if (!props.isPresentationOnly && authStore.needsOnboarding) {
    onboardingName.value = displayName
    step.value = 'consent'
    consentScrolled.value = false
  } else {
    showToast({ title: 'ACCESS GRANTED', message: `${authStore.userProfile?.fullName || authStore.operatorId}`, type: 'SUCCESS' })
    emit('close')
    if (props.isPresentationOnly) {
      router.push('/cctv-presentation/1')
    } else {
      router.push('/dashboard')
    }
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
  showToast({ title: 'PROFILE CREATED', message: 'Welcome to ShadowVerse Commander Console.', type: 'SUCCESS' })
  emit('close')
  router.push('/dashboard')
}

const stepTitle = computed(() => {
  if (props.isPresentationOnly) return 'PRESENTATION ACCESS SIGN-IN'
  if (step.value === 'signin') return 'SIGN IN'
  if (step.value === 'consent') return 'TERMS & POLICIES'
  return 'CREATE OPERATOR PROFILE'
})
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2.5 sm:p-4 select-none animate-fade-in overflow-y-auto"
    @click.self="step === 'signin' ? emit('close') : null"
    role="dialog"
    aria-modal="true"
    aria-labelledby="google-signin-modal-title"
  >
    <div
      class="industrial-card w-full border-[#750d37]/60 flex flex-col my-auto max-h-[92vh] sm:max-h-[88vh] overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-[#111113] transition-all"
      :class="step === 'consent' ? 'max-w-2xl' : 'max-w-md'"
    >
      <!-- Top Brand Accent Line -->
      <div class="absolute top-0 left-0 right-0 h-[2px] bg-[#750d37]"></div>

      <!-- Step Progress Bar (Only shown for site onboarding flow) -->
      <div v-if="!props.isPresentationOnly" class="px-5 pt-4 pb-2 border-b border-[#1e1e20] flex items-center justify-between font-mono text-[9px] uppercase tracking-wider shrink-0 bg-[#0a0a0c]">
        <div class="flex items-center gap-1.5" :class="step === 'signin' ? 'text-white font-bold' : 'text-[#3d8b5e]'">
          <span class="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black" :class="step === 'signin' ? 'bg-[#750d37] text-white' : 'bg-[#3d8b5e] text-white'">1</span>
          <span>1. AUTHENTICATE</span>
        </div>
        <span class="text-[#555558]">//</span>
        <div class="flex items-center gap-1.5" :class="step === 'consent' ? 'text-white font-bold' : (step === 'profile' ? 'text-[#3d8b5e]' : 'text-[#555558]')">
          <span class="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black" :class="step === 'consent' ? 'bg-[#750d37] text-white' : (step === 'profile' ? 'bg-[#3d8b5e] text-white' : 'bg-[#1e1e20] text-[#88888c]')">2</span>
          <span>2. DPDP TERMS</span>
        </div>
        <span class="text-[#555558]">//</span>
        <div class="flex items-center gap-1.5" :class="step === 'profile' ? 'text-white font-bold' : 'text-[#555558]'">
          <span class="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black" :class="step === 'profile' ? 'bg-[#750d37] text-white' : 'bg-[#1e1e20] text-[#88888c]'">3</span>
          <span>3. CREATE PROFILE</span>
        </div>
      </div>

      <!-- Header -->
      <div class="flex items-center justify-between p-4 sm:p-5 border-b border-[#1e1e20] shrink-0">
        <div>
          <p class="font-mono text-[10px] sm:text-xs text-[#e02870] font-bold tracking-widest uppercase">
            // SHADOWVERSE SURVEILLANCE CLOUD
          </p>
          <h3 id="google-signin-modal-title" class="text-base sm:text-lg font-black uppercase text-white">{{ stepTitle }}</h3>
        </div>
        <button v-if="step === 'signin'" @click="emit('close')" class="industrial-btn industrial-btn-outline text-[10px] sm:text-xs px-2.5 py-1.5 shrink-0">
          CLOSE [ESC]
        </button>
      </div>

      <!-- ───────── STEP 1: SIGN IN ───────── -->
      <div v-if="step === 'signin'" class="p-4 sm:p-6 space-y-5 font-mono text-xs sm:text-sm overflow-y-auto">
        <!-- Notice Box -->
        <div class="p-3.5 bg-[#0a0a0c] border border-[#1e1e20] space-y-1.5 text-[11px] text-[#c8c8cc]">
          <div class="text-[#3d8b5e] font-bold uppercase text-[10px] flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-[#3d8b5e] animate-pulse"></span>
            <span>SOVEREIGN GOOGLE AUTHENTICATION:</span>
          </div>
          <p v-if="props.isPresentationOnly">
            Sign in with your Google account to view the CCTV presentation. Your profile details are retrieved automatically without manual form entry.
          </p>
          <p v-else>
            Sign in with your Google account. Accounts ending with <strong class="text-white">@shadowverse.in</strong> are granted commander privileges.
          </p>
        </div>

        <!-- Google Sign-In Button -->
        <button
          @click="loginWithGoogle"
          :disabled="isAuthenticating"
          class="industrial-btn industrial-btn-primary w-full py-3.5 text-xs font-bold transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <svg class="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span>{{ isAuthenticating ? 'AUTHENTICATING WITH GOOGLE...' : 'CONTINUE WITH GOOGLE' }}</span>
        </button>

        <!-- Secondary Browser Redirect Option -->
        <div class="pt-2 border-t border-[#1e1e20] text-center space-y-2">
          <span class="text-[10px] text-[#88888c] uppercase font-bold">POPUP BLOCKED IN YOUR BROWSER?</span>
          <button
            type="button"
            @click="loginWithRedirectMode"
            :disabled="isAuthenticating"
            class="industrial-btn industrial-btn-outline w-full py-2.5 text-xs text-[#3d8b5e] border-[#3d8b5e] font-bold hover:bg-[#3d8b5e]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>SIGN IN VIA BROWSER REDIRECT →</span>
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="p-3.5 bg-[#c44a4a]/20 border border-[#c44a4a] text-[#c44a4a] text-[11px] font-bold flex items-start gap-2">
          <span class="text-base leading-none shrink-0">⚠️</span>
          <span>{{ errorMessage }}</span>
        </div>
      </div>

      <!-- ───────── STEP 2: CONSENT / POLICIES (For Site Onboarding Flow) ───────── -->
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
            <p>ShadowVerse Private Cloud ("Data Fiduciary") collects and processes personal data strictly in accordance with the Digital Personal Data Protection Act, 2023. By using this platform, you consent to the processing of your personal data.</p>
            <p><strong class="text-white">Data Collected:</strong> Name, email address, phone number, Google account identifier, device session metadata.</p>
            <p><strong class="text-white">Data Protection Officer (DPO):</strong> Arun Kumar Pillai — coo@shadowverse.in</p>
          </div>

          <div class="space-y-2">
            <h4 class="text-white font-black uppercase text-xs tracking-wider">2. YOUR RIGHTS UNDER DPDP ACT 2023</h4>
            <p>As a Data Principal, you are entitled to access, correction, erasure, nomination, and grievance redressal under Sections 11–14 of the DPDP Act 2023.</p>
          </div>

          <div class="space-y-2">
            <h4 class="text-white font-black uppercase text-xs tracking-wider">3. TERMS & CONDITIONS OF USE</h4>
            <p>Access is restricted to authorized personnel holding an active <strong class="text-white">@shadowverse.in</strong> domain email account.</p>
          </div>

          <div class="border-t border-[#1e1e20] pt-4 text-center">
            <span class="text-[#3d8b5e] font-bold uppercase text-[10px]">— END OF POLICIES & TERMS —</span>
          </div>
        </div>

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

      <!-- ───────── STEP 3: PROFILE FORM (For Site Onboarding Flow) ───────── -->
      <div v-else-if="step === 'profile'" class="p-5 space-y-4 font-mono text-xs">
        <div class="p-2 bg-[#3d8b5e]/15 border border-[#3d8b5e] text-[#3d8b5e] text-[10px] font-bold uppercase">
          TERMS ACCEPTED · {{ authStore.userProfile?.email }}
        </div>

        <div>
          <label for="onboarding-name-input" class="text-[#a0a0a4] block mb-1 uppercase text-[10px]">FULL NAME *</label>
          <input
            id="onboarding-name-input"
            v-model="onboardingName"
            @input="formErrors.name = ''"
            type="text"
            placeholder="Enter your full name"
            class="industrial-input"
            :aria-invalid="!!formErrors.name"
            aria-describedby="onboarding-name-err"
          />
          <span id="onboarding-name-err" v-if="formErrors.name" class="text-[#c44a4a] text-[10px] block mt-1">{{ formErrors.name }}</span>
        </div>

        <div>
          <label for="onboarding-phone-input" class="text-[#a0a0a4] block mb-1 uppercase text-[10px]">PHONE NUMBER *</label>
          <input
            id="onboarding-phone-input"
            v-model="onboardingPhone"
            @input="formErrors.phone = ''"
            type="text"
            placeholder="+91 98765 43210"
            class="industrial-input"
            :aria-invalid="!!formErrors.phone"
            aria-describedby="onboarding-phone-err"
          />
          <span id="onboarding-phone-err" v-if="formErrors.phone" class="text-[#c44a4a] text-[10px] block mt-1">{{ formErrors.phone }}</span>
        </div>

        <button
          @click="handleCompleteOnboarding"
          class="industrial-btn industrial-btn-primary w-full py-3 text-xs font-bold cursor-pointer"
        >
          CREATE PROFILE & ENTER DASHBOARD
        </button>
      </div>

    </div>
  </div>
</template>
