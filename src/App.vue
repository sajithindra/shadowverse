<script setup lang="ts">
import { ref } from 'vue'
import LoadingScreen from './components/LoadingScreen.vue'
import ThreeParticleBackground from './components/ThreeParticleBackground.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import { RouterView } from 'vue-router'

const loaded = ref(false)
</script>

<template>
  <ErrorBoundary>
    <LoadingScreen v-if="!loaded" @loaded="loaded = true" />
    <template v-else>
      <ThreeParticleBackground />
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </template>
  </ErrorBoundary>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
