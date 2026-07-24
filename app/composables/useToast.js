// composables/useToast.js
import { ref } from 'vue'

const toasts = ref([])

export const useToast = () => {
  const show = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, message, type, duration })
    
    // Auto-supprimer après la durée
    setTimeout(() => {
      remove(id)
    }, duration + 300)
    
    return id
  }

  const remove = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message, duration) => show(message, 'success', duration)
  const error = (message, duration) => show(message, 'error', duration)
  const info = (message, duration) => show(message, 'info', duration)
  const warning = (message, duration) => show(message, 'warning', duration)

  return {
    toasts,
    show,
    remove,
    success,
    error,
    info,
    warning
  }
}