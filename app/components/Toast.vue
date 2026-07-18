<!-- components/Toast.vue -->
<template>
  <div v-if="visible" class="fixed top-4 right-4 z-50 animate-slide-in">
    <div
      class="rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[300px] max-w-md"
      :class="{
        'bg-green-50 border-l-4 border-green-500': type === 'success',
        'bg-red-50 border-l-4 border-red-500': type === 'error',
        'bg-blue-50 border-l-4 border-blue-500': type === 'info',
        'bg-yellow-50 border-l-4 border-yellow-500': type === 'warning',
      }"
    >
      <!-- Icône -->
      <div
        class="flex-shrink-0"
        :class="{
          'text-green-500': type === 'success',
          'text-red-500': type === 'error',
          'text-blue-500': type === 'info',
          'text-yellow-500': type === 'warning',
        }"
      >
        <svg v-if="type === 'success'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else-if="type === 'error'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <svg v-else-if="type === 'info'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <!-- Message -->
      <div class="flex-1">
        <p class="text-sm font-medium" :class="{
          'text-green-800': type === 'success',
          'text-red-800': type === 'error',
          'text-blue-800': type === 'info',
          'text-yellow-800': type === 'warning',
        }">
          {{ message }}
        </p>
      </div>

      <!-- Bouton fermer -->
      <button @click="close" class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'info'
  },
  duration: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits(['close'])
const visible = ref(true)

const close = () => {
  visible.value = false
  setTimeout(() => emit('close'), 300)
}

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(close, props.duration)
  }
})
</script>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
</style>