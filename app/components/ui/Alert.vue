<template>
  <div
    :class="[
      'rounded-lg border p-4',
      variantClasses,
      className
    ]"
    role="alert"
  >
    <div class="flex items-start">
      <!-- Icon -->
      <div class="flex-shrink-0">
        <component
          :is="icon"
          :class="['h-5 w-5', iconClasses]"
        />
      </div>

      <!-- Contenu -->
      <div class="ml-3 flex-1">
        <h3
          v-if="title"
          :class="['font-medium', titleClasses]"
        >
          {{ title }}
        </h3>
        <div :class="['mt-2 text-sm', messageClasses]">
          <slot>
            {{ message }}
          </slot>
        </div>
      </div>

      <!-- Bouton de fermeture -->
      <button
        v-if="dismissible"
        type="button"
        :class="[
          'ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 focus:ring-2 focus:ring-offset-2 transition-colors',
          closeButtonClasses
        ]"
        @click="$emit('dismiss')"
      >
        <span class="sr-only">Fermer</span>
        <svg
          class="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Contenu
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'info', // info, success, warning, error
    validator: (value) => ['info', 'success', 'warning', 'error'].includes(value)
  },
  dismissible: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['dismiss'])

// Icon par variante
const icon = computed(() => {
  const icons = {
    info: {
      render() {
        return h('svg', { 
          class: 'h-5 w-5', 
          fill: 'currentColor', 
          viewBox: '0 0 20 20' 
        }, [
          h('path', {
            'fill-rule': 'evenodd',
            d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
            'clip-rule': 'evenodd'
          })
        ])
      }
    },
    success: {
      render() {
        return h('svg', { 
          class: 'h-5 w-5', 
          fill: 'currentColor', 
          viewBox: '0 0 20 20' 
        }, [
          h('path', {
            'fill-rule': 'evenodd',
            d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
            'clip-rule': 'evenodd'
          })
        ])
      }
    },
    warning: {
      render() {
        return h('svg', { 
          class: 'h-5 w-5', 
          fill: 'currentColor', 
          viewBox: '0 0 20 20' 
        }, [
          h('path', {
            'fill-rule': 'evenodd',
            d: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z',
            'clip-rule': 'evenodd'
          })
        ])
      }
    },
    error: {
      render() {
        return h('svg', { 
          class: 'h-5 w-5', 
          fill: 'currentColor', 
          viewBox: '0 0 20 20' 
        }, [
          h('path', {
            'fill-rule': 'evenodd',
            d: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z',
            'clip-rule': 'evenodd'
          })
        ])
      }
    }
  }
  return icons[props.variant]
})

// Classes par variante
const variantClasses = computed(() => {
  const classes = {
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200'
  }
  return classes[props.variant]
})

const iconClasses = computed(() => {
  const classes = {
    info: 'text-blue-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400'
  }
  return classes[props.variant]
})

const titleClasses = computed(() => {
  const classes = {
    info: 'text-blue-800',
    success: 'text-green-800',
    warning: 'text-yellow-800',
    error: 'text-red-800'
  }
  return classes[props.variant]
})

const messageClasses = computed(() => {
  const classes = {
    info: 'text-blue-700',
    success: 'text-green-700',
    warning: 'text-yellow-700',
    error: 'text-red-700'
  }
  return classes[props.variant]
})

const closeButtonClasses = computed(() => {
  const classes = {
    info: 'bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-blue-400',
    success: 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-400',
    warning: 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-400',
    error: 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-400'
  }
  return classes[props.variant]
})
</script>