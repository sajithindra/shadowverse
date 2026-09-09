<script setup lang="ts">
import { ref, watch, onMounted, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import HeaderNav from '../components/HeaderNav.vue'
import HeroSection from '../components/HeroSection.vue'
import CoreSummarySection from '../components/CoreSummarySection.vue'
import ProblemSection from '../components/ProblemSection.vue'
import FactsSection from '../components/FactsSection.vue'
import ArchitectureSection from '../components/ArchitectureSection.vue'
import ShadowWatchFeeds from '../components/ShadowWatchFeeds.vue'
import LogicLockSection from '../components/LogicLockSection.vue'
import ScenariosSection from '../components/ScenariosSection.vue'
import ContactCtaSection from '../components/ContactCtaSection.vue'
import ContactBar from '../components/ContactBar.vue'
import FooterSection from '../components/FooterSection.vue'
import IndustrialToast from '../components/IndustrialToast.vue'

import { useCameraStore } from '../stores/cameraStore'

import { useAuthStore } from '../stores/authStore'

// Lazy-loaded Async Modals for Code Splitting & Performance
const CameraInspectionModal = defineAsyncComponent(() => import('../components/CameraInspectionModal.vue'))
const VideoSearchModal = defineAsyncComponent(() => import('../components/VideoSearchModal.vue'))
const UseCaseImpactModal = defineAsyncComponent(() => import('../components/UseCaseImpactModal.vue'))
const PrivacyPolicyModal = defineAsyncComponent(() => import('../components/PrivacyPolicyModal.vue'))
const TermsModal = defineAsyncComponent(() => import('../components/TermsModal.vue'))
const DpdpPortalModal = defineAsyncComponent(() => import('../components/DpdpPortalModal.vue'))
const GoogleSignInModal = defineAsyncComponent(() => import('../components/GoogleSignInModal.vue'))
const CctvPresentationModal = defineAsyncComponent(() => import('../components/CctvPresentationModal.vue'))

const route = useRoute()
const router = useRouter()
const cameraStore = useCameraStore()
const authStore = useAuthStore()

// Modal Active States
const showSignInModal = ref(false)
const showVideoSearchModal = ref(false)
const showImpactModal = ref(false)
const activeUseCase = ref<any>(null)
const showPrivacyModal = ref(false)
const showTermsModal = ref(false)
const showDpdpPortalModal = ref(false)
const showCctvPresentationModal = ref(false)
const activeCctvSlide = ref(1)
const isPresentationAuthMode = ref(false)

function checkCctvRoute() {
  if (route.name === 'cctv-presentation' || route.path.startsWith('/cctv-presentation')) {
    const slideNum = parseInt(route.params.slide as string, 10)
    activeCctvSlide.value = isNaN(slideNum) || slideNum < 1 || slideNum > 5 ? 1 : slideNum
    showCctvPresentationModal.value = true
  } else {
    showCctvPresentationModal.value = false
  }
}

watch(
  [() => route.path],
  () => {
    checkCctvRoute()
  },
  { immediate: true }
)

function handleOpenCctvPresentation() {
  router.push('/cctv-presentation/1')
}

function handleOpenSiteSignIn() {
  isPresentationAuthMode.value = false
  showSignInModal.value = true
}

function handleCloseCctvPresentation() {
  showCctvPresentationModal.value = false
  if (route.name === 'cctv-presentation' || route.path.startsWith('/cctv-presentation')) {
    router.push('/')
  }
}

function handleOpenImpact(uc: any) {
  activeUseCase.value = uc
  showImpactModal.value = true
}

onMounted(() => {
  if (route.query.showLogin === 'true') {
    isPresentationAuthMode.value = false
    showSignInModal.value = true
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0c] text-[#e8e8ea] font-sans antialiased selection:bg-[#750d37] selection:text-white overflow-x-hidden">
    <!-- Top Header App Bar -->
    <HeaderNav
      @openDpdpPortal="showDpdpPortalModal = true"
      @openSignIn="handleOpenSiteSignIn"
    />

    <!-- Hero Section with Realtime Terminal -->
    <HeroSection
      @openVideoSearch="showVideoSearchModal = true"
    />

    <!-- Problem, Solution, & Core USPs Summary Section -->
    <CoreSummarySection
      @openVideoSearch="showVideoSearchModal = true"
      @openImpactModal="handleOpenImpact"
    />

    <!-- Problem & Critical Scenarios -->
    <ProblemSection
      @openVideoSearch="showVideoSearchModal = true"
      @openImpactModal="handleOpenImpact"
    />

    <!-- Human vs Vision AI Facts & Metrics -->
    <FactsSection />

    <!-- 3-Layer Ecosystem Architecture -->
    <ArchitectureSection />

    <!-- ShadowWatch Section -->
    <ShadowWatchFeeds />

    <!-- Logic Lock 9x9 ASCII Matrix Authentication -->
    <LogicLockSection />

    <!-- Visitor Risk Watchlist & Vision AI Agent Specifications -->
    <ScenariosSection
      @openImpactModal="handleOpenImpact"
      @openVideoSearch="showVideoSearchModal = true"
    />

    <!-- Enterprise Deployment Call to Action -->
    <ContactCtaSection />

    <ContactBar />

    <!-- Footer with Credits & Legal Links -->
    <FooterSection
      @openPrivacy="showPrivacyModal = true"
      @openTerms="showTermsModal = true"
      @openDpdpPortal="showDpdpPortalModal = true"
      @openCctvPresentation="handleOpenCctvPresentation"
    />

    <!-- Modals (Async Lazy Loaded) -->
    <GoogleSignInModal
      v-if="showSignInModal"
      :isPresentationOnly="isPresentationAuthMode"
      @close="showSignInModal = false"
    />

    <CameraInspectionModal
      v-if="cameraStore.activeModalCam"
      :camera="cameraStore.activeModalCam"
      @close="cameraStore.selectCameraForInspection(null)"
    />

    <VideoSearchModal
      v-if="showVideoSearchModal"
      @close="showVideoSearchModal = false"
    />

    <UseCaseImpactModal
      v-if="showImpactModal && activeUseCase"
      :useCase="activeUseCase"
      @close="showImpactModal = false"
      @openVideoSearch="showVideoSearchModal = true"
    />

    <PrivacyPolicyModal
      v-if="showPrivacyModal"
      @close="showPrivacyModal = false"
      @openDpdpPortal="showDpdpPortalModal = true"
    />

    <TermsModal
      v-if="showTermsModal"
      @close="showTermsModal = false"
    />

    <DpdpPortalModal
      v-if="showDpdpPortalModal"
      @close="showDpdpPortalModal = false"
    />

    <CctvPresentationModal
      v-if="showCctvPresentationModal"
      :initialSlide="activeCctvSlide"
      @close="handleCloseCctvPresentation"
    />

    <!-- Global Toast Notification Layer -->
    <IndustrialToast />
  </div>
</template>
