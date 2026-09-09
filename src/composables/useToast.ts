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
      duration: 4000,
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

  function showError(err: unknown, customTitle: string = 'SYSTEM ERROR') {
    let msg = 'An unexpected error occurred.'
    if (err instanceof Error) {
      msg = err.message
    } else if (typeof err === 'string') {
      msg = err
    }
    showToast({
      title: customTitle,
      message: msg,
      type: 'ALERT',
      duration: 5000
    })
  }

  function showSuccess(message: string, title: string = 'SUCCESS') {
    showToast({
      title,
      message,
      type: 'SUCCESS',
      duration: 3500
    })
  }

  function showWarning(message: string, title: string = 'ATTENTION REQUIRED') {
    showToast({
      title,
      message,
      type: 'WARNING',
      duration: 4000
    })
  }

  return {
    toasts,
    showToast,
    showError,
    showSuccess,
    showWarning,
    removeToast,
  }
}
