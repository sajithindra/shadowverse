import { ref } from 'vue'

export interface ToastMessage {
  id: string
  title: string
  message: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT'
  duration?: number
}

const toasts = ref<ToastMessage[]>([])

export function useToast() {
  function showToast(toast: Omit<ToastMessage, 'id'>) {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9)
    const newToast: ToastMessage = {
      id,
      duration: 3500,
      ...toast,
    }
    toasts.value.push(newToast)

    setTimeout(() => {
      removeToast(id)
    }, newToast.duration)
  }

  function removeToast(id: string) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts,
    showToast,
    removeToast,
  }
}
