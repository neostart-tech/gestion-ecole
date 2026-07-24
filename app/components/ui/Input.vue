<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="id"
      :class="[
        'block text-sm font-medium mb-2',
        labelClass,
        error ? 'text-red-600' : 'text-gray-700'
      ]"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div class="relative">
      <!-- Icon avant -->
      <div
        v-if="prefixIcon"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <component
          :is="prefixIcon"
          :class="['h-5 w-5', error ? 'text-red-400' : 'text-gray-400']"
        />
      </div>

      <!-- Champ de saisie -->
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="[
          'w-full border focus:outline-none focus:ring-2 transition-all duration-200',
          sizeClasses,
          paddingClasses,
          rounded ? 'rounded-full' : 'rounded-lg',
          error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200 text-red-900 placeholder-red-300' 
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200 text-gray-900 placeholder-gray-400',
          disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white',
          className
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />

      <!-- Icon après -->
      <div
        v-if="suffixIcon || error || success"
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <component
          v-if="suffixIcon && !error && !success"
          :is="suffixIcon"
          class="h-5 w-5 text-gray-400"
        />
        <svg
          v-else-if="error"
          class="h-5 w-5 text-red-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        <svg
          v-else-if="success"
          class="h-5 w-5 text-green-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>

    <!-- Message d'aide ou d'erreur -->
    <p
      v-if="helpText || error"
      :class="[
        'mt-2 text-sm',
        error ? 'text-red-600' : 'text-gray-500'
      ]"
    >
      {{ error || helpText }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Données
  modelValue: {
    type: [String, Number],
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  
  // Validation
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  success: {
    type: Boolean,
    default: false
  },
  helpText: {
    type: String,
    default: ''
  },
  
  // État
  disabled: {
    type: Boolean,
    default: false
  },
  
  // Icons
  prefixIcon: {
    type: Object,
    default: null
  },
  suffixIcon: {
    type: Object,
    default: null
  },
  
  // Style
  size: {
    type: String,
    default: 'medium', // small, medium, large
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  rounded: {
    type: Boolean,
    default: false
  },
  labelClass: {
    type: String,
    default: ''
  },
  className: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

// Classes de taille
const sizeClasses = computed(() => {
  const classes = {
    small: 'h-9 text-sm',
    medium: 'h-11 text-base',
    large: 'h-13 text-lg'
  }
  return classes[props.size]
})

// Classes de padding avec ou sans icon
const paddingClasses = computed(() => {
  let padding = 'px-4'
  if (props.prefixIcon) padding = 'pl-10 pr-4'
  if (props.suffixIcon) padding = 'pl-4 pr-10'
  if (props.prefixIcon && props.suffixIcon) padding = 'px-10'
  return padding
})
</script>