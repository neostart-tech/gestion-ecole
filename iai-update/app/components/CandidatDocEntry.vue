<template>
  <div class="group relative bg-white dark:bg-slate-900/40 rounded-[1.25rem] p-5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 shadow-sm hover:shadow-xl flex items-center gap-6">
    <!-- Static Icon (Clean) -->
    <div class="w-12 h-12 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
    </div>

    <!-- Info Column -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight mb-2 truncate">
        {{ label }}
      </p>
      
      <!-- Status Badge -->
      <div v-if="path" class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-md">
        <div class="w-1 h-1 rounded-full bg-emerald-500"></div>
        <span class="text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Certifié</span>
      </div>
      <div v-else class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
        <div class="w-1 h-1 rounded-full bg-slate-400"></div>
        <span class="text-[10px] font-bold uppercase tracking-wide text-slate-400">Absent</span>
      </div>
    </div>

    <!-- Action Bar (Integrated) -->
    <div v-if="path" class="shrink-0">
       <a :href="fullUrl" target="_blank" 
          class="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-violet-900/30 transition-all">
         <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
       </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  path: { type: String, default: null }
})

const fullUrl = computed(() => {
  if (!props.path) return null
  if (props.path.startsWith('http')) return props.path
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  return `${apiBase}/storage/${props.path}`
})
</script>
