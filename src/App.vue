<script setup lang="ts">
import { ref } from 'vue'
import LoadingScreen from './components/LoadingScreen.vue'
import { RouterView } from 'vue-router'

const loaded = ref(false)
</script>

<template>
  <LoadingScreen v-if="!loaded" @loaded="loaded = true" />
  <RouterView v-else v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
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
