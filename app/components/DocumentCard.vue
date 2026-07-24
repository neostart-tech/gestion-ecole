<template>
  <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-all duration-200 group">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-3">
        <div :class="['p-2 rounded-lg', iconBgClass]">
          <svg class="w-5 h-5" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="icon === 'identity'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-4 0h4" />
            <path v-else-if="icon === 'nif'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            <path v-else-if="icon === 'diploma'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h4 class="font-medium text-gray-900 dark:text-white">{{ title }}</h4>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            <span v-if="required">Obligatoire</span>
            <span v-if="requiredFor"> pour les professeurs {{ requiredFor }}</span>
          </p>
        </div>
      </div>
      <div v-if="url" class="flex items-center gap-2">
        <a :href="url" target="_blank" class="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors group-hover:scale-110 transform duration-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </a>
      </div>
    </div>
    <div v-if="!url" class="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 text-center">
      Aucun document disponible
    </div>
    <div v-else class="text-sm text-gray-600 dark:text-gray-300 truncate bg-gray-50 dark:bg-gray-700/30 rounded-lg p-2">
      <span class="font-mono text-xs">{{ getFileName(url) }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  url: String,
  icon: {
    type: String,
    default: 'default'
  },
  required: {
    type: Boolean,
    default: false
  },
  requiredFor: {
    type: String,
    default: ''
  }
})

const iconBgClass = computed(() => {
  const classes = {
    identity: 'bg-blue-100 dark:bg-blue-900/30',
    nif: 'bg-amber-100 dark:bg-amber-900/30',
    diploma: 'bg-purple-100 dark:bg-purple-900/30',
    cv: 'bg-cyan-100 dark:bg-cyan-900/30',
    default: 'bg-gray-100 dark:bg-gray-700'
  }
  return classes[props.icon] || classes.default
})

const iconColorClass = computed(() => {
  const classes = {
    identity: 'text-blue-600 dark:text-blue-400',
    nif: 'text-amber-600 dark:text-amber-400',
    diploma: 'text-purple-600 dark:text-purple-400',
    cv: 'text-cyan-600 dark:text-cyan-400',
    default: 'text-gray-600 dark:text-gray-400'
  }
  return classes[props.icon] || classes.default
})

const getFileName = (url) => {
  if (!url) return ''
  const parts = url.split('/')
  return parts[parts.length - 1]
}
</script>