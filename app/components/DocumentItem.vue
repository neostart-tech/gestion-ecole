<template>
  <div class="group flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200 -mx-2 px-2">
    <div class="flex items-center gap-3">
      <div 
        class="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
        :class="[
          url 
            ? 'bg-indigo-50 dark:bg-indigo-900/30 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50' 
            : 'bg-gray-100 dark:bg-gray-700'
        ]"
      >
        <svg 
          class="w-4 h-4 transition-colors duration-200"
          :class="[
            url 
              ? 'text-indigo-600 dark:text-indigo-400' 
              : 'text-gray-400 dark:text-gray-500'
          ]" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div>
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ title }}</p>
        <div class="flex items-center gap-2 mt-0.5">
          <p v-if="required" class="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Obligatoire
          </p>
        </div>
      </div>
    </div>
    <div>
      <a
        v-if="url"
        :href="url"
        target="_blank"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group-hover:gap-2"
      >
        <span>Télécharger</span>
        <svg class="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </a>
      <span v-else class="text-sm text-gray-400 dark:text-gray-500 italic">Non disponible</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    default: null
  },
  required: {
    type: Boolean,
    default: false
  }
})
</script>