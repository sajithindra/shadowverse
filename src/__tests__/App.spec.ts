import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'

vi.mock('lottie-web/build/player/lottie_light', () => ({
  default: {
    loadAnimation: () => ({
      destroy: vi.fn(),
    }),
  },
}))

describe('App', () => {
  it('mounts and renders initial loading screen properly', () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: { template: '<div>Landing</div>' } }],
    })
    const pinia = createPinia()

    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router],
      },
    })

    expect(wrapper.text()).toContain('SHADOWVERSE')
    expect(wrapper.text()).toContain('SYSTEM INITIALIZATION')
  })
})

