<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses,
      variantClasses,
      rounded ? 'rounded-full' : 'rounded-lg',
      fullWidth ? 'w-full' : '',
      className,
    ]"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    <!-- Icon avant le texte -->
    <component
      v-if="icon && !loading"
      :is="icon"
      :class="['mr-2', iconClass]"
    />

    <!-- Texte du bouton -->
    <span>{{ label }}</span>

    <!-- Icon après le texte -->
    <component
      v-if="trailingIcon && !loading"
      :is="trailingIcon"
      :class="['ml-2', iconClass]"
    />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Variantes
  variant: {
    type: String,
    default: 'primary', // primary, secondary, outline, ghost, danger
    validator: (value) => ['primary', 'secondary', 'outline', 'ghost', 'danger'].includes(value)
  },
  
  // Tailles
  size: {
    type: String,
    default: 'medium', // small, medium, large
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  
  // Contenu
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'button'
  },
  
  // État
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  
  // Icons
  icon: {
    type: Object,
    default: null
  },
  trailingIcon: {
    type: Object,
    default: null
  },
  iconClass: {
    type: String,
    default: 'h-4 w-4'
  },
  
  // Style
  rounded: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

// Classes de taille
const sizeClasses = computed(() => {
  const classes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-5 py-2.5 text-base',
    large: 'px-7 py-3.5 text-lg'
  }
  return classes[props.size]
})

// Classes de variante
const variantClasses = computed(() => {
  const classes = {
    primary: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 active:bg-green-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 active:bg-gray-400',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 active:bg-gray-100',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 active:bg-gray-200',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 active:bg-red-700'
  }
  return classes[props.variant]
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>