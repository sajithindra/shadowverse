<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

import HeaderNav from '../components/HeaderNav.vue'
import HeroSection from '../components/HeroSection.vue'
import ProblemSection from '../components/ProblemSection.vue'
import FactsSection from '../components/FactsSection.vue'
import ArchitectureSection from '../components/ArchitectureSection.vue'
import ShadowWatchFeeds from '../components/ShadowWatchFeeds.vue'
import LogicLockSection from '../components/LogicLockSection.vue'
import ScenariosSection from '../components/ScenariosSection.vue'
import ContactCtaSection from '../components/ContactCtaSection.vue'
import FooterSection from '../components/FooterSection.vue'
import IndustrialToast from '../components/IndustrialToast.vue'

import { useCameraStore } from '../stores/cameraStore'

// Lazy-loaded Async Modals for Code Splitting & Performance
const CameraInspectionModal = defineAsyncComponent(() => import('../components/CameraInspectionModal.vue'))
const FallEmergencyModal = defineAsyncComponent(() => import('../components/FallEmergencyModal.vue'))
const PrivacyPolicyModal = defineAsyncComponent(() => import('../components/PrivacyPolicyModal.vue'))
const TermsModal = defineAsyncComponent(() => import('../components/TermsModal.vue'))
const DpdpPortalModal = defineAsyncComponent(() => import('../components/DpdpPortalModal.vue'))
const GoogleSignInModal = defineAsyncComponent(() => import('../components/GoogleSignInModal.vue'))

const route = useRoute()
const cameraStore = useCameraStore()

// Modal Active States
const showSignInModal = ref(false)
const showFallModal = ref(false)
const showPrivacyModal = ref(false)
const showTermsModal = ref(false)
const showDpdpPortalModal = ref(false)

onMounted(() => {
  if (route.query.showLogin === 'true') {
    showSignInModal.value = true
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0c] text-[#e8e8ea] font-sans antialiased selection:bg-[#750d37] selection:text-white overflow-x-hidden">
    <!-- Top Header App Bar -->
    <HeaderNav
      @openDpdpPortal="showDpdpPortalModal = true"
      @openSignIn="showSignInModal = true"
    />

    <!-- Hero Section with Realtime Terminal -->
    <HeroSection
      @triggerFallTest="showFallModal = true"
    />

    <!-- Problem & Critical Scenarios -->
    <ProblemSection
      @triggerFallTest="showFallModal = true"
    />

    <!-- Human vs Vision AI Facts & Metrics -->
    <FactsSection />

    <!-- 3-Layer Ecosystem Architecture -->
    <ArchitectureSection />

    <!-- ShadowWatch Live Feed Inspection Grid -->
    <ShadowWatchFeeds
      @inspectCamera="cam => cameraStore.selectCameraForInspection(cam)"
    />

    <!-- Logic Lock 9x9 ASCII Matrix Authentication -->
    <LogicLockSection />

    <!-- Visitor Risk Watchlist & Vision AI Agent Specifications -->
    <ScenariosSection />

    <!-- Enterprise Deployment Call to Action -->
    <ContactCtaSection />

    <!-- Footer with Credits & Legal Links -->
    <FooterSection
      @openPrivacy="showPrivacyModal = true"
      @openTerms="showTermsModal = true"
      @openDpdpPortal="showDpdpPortalModal = true"
    />

    <!-- Modals (Async Lazy Loaded) -->
    <GoogleSignInModal
      v-if="showSignInModal"
      @close="showSignInModal = false"
    />

    <CameraInspectionModal
      v-if="cameraStore.activeModalCam"
      :camera="cameraStore.activeModalCam"
      @close="cameraStore.selectCameraForInspection(null)"
    />

    <FallEmergencyModal
      v-if="showFallModal"
      @close="showFallModal = false"
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

    <!-- Global Toast Notification Layer -->
    <IndustrialToast />
  </div>
</template>
