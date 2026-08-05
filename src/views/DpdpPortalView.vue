<script setup lang="ts">
import { useRouter } from 'vue-router'
import DpdpPortalModal from '../components/DpdpPortalModal.vue'
import IndustrialToast from '../components/IndustrialToast.vue'

const router = useRouter()

function handleClose() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0c] text-[#e8e8ea] font-sans flex items-center justify-center p-4">
    <DpdpPortalModal @close="handleClose" />
    <IndustrialToast />
  </div>
</template>
