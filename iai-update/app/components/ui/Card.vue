<template>
  <div
    :class="[
      'bg-white border overflow-hidden transition-all duration-200',
      shadowClasses,
      roundedClasses,
      paddingClasses,
      borderClasses,
      hoverClasses,
      className
    ]"
  >
    <!-- En-tête de la carte -->
    <div
      v-if="$slots.header || title"
      class="px-6 py-4 border-b border-gray-200"
    >
      <slot name="header">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ title }}
          </h3>
          <slot name="header-action" />
        </div>
      </slot>
    </div>

    <!-- Contenu de la carte -->
    <div :class="contentClasses">
      <slot />
    </div>

    <!-- Pied de la carte -->
    <div
      v-if="$slots.footer"
      class="px-6 py-4 border-t border-gray-200 bg-gray-50"
    >
      <slot name="footer" />
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
  
  // Style
  shadow: {
    type: String,
    default: 'medium', // none, soft, medium, hard
    validator: (value) => ['none', 'soft', 'medium', 'hard'].includes(value)
  },
  rounded: {
    type: String,
    default: 'xl', // none, sm, md, lg, xl, 2xl, full
    validator: (value) => ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full'].includes(value)
  },
  padding: {
    type: String,
    default: 'normal', // none, compact, normal, spacious
    validator: (value) => ['none', 'compact', 'normal', 'spacious'].includes(value)
  },
  border: {
    type: Boolean,
    default: true
  },
  hover: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  }
})

// Classes d'ombre
const shadowClasses = computed(() => {
  const classes = {
    none: '',
    soft: 'shadow-soft',
    medium: 'shadow-medium',
    hard: 'shadow-hard'
  }
  return classes[props.shadow]
})

// Classes de bordure arrondie
const roundedClasses = computed(() => {
  const classes = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full'
  }
  return classes[props.rounded]
})

// Classes de padding
const paddingClasses = computed(() => {
  const classes = {
    none: '',
    compact: 'p-4',
    normal: 'p-6',
    spacious: 'p-8'
  }
  return classes[props.padding]
})

// Classes de contenu
const contentClasses = computed(() => {
  return props.padding === 'none' ? 'p-0' : ''
})

// Classes de bordure
const borderClasses = computed(() => {
  return props.border ? 'border-gray-200' : 'border-transparent'
})

// Classes de hover
const hoverClasses = computed(() => {
  return props.hover ? 'hover:shadow-hard hover:-translate-y-1 cursor-pointer' : ''
})
</script>