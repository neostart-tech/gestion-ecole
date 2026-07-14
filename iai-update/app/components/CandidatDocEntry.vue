<template>
  <div 
    class="group relative overflow-hidden bg-white dark:bg-[#11111e] rounded-[1.25rem] p-5 transition-all duration-500 ease-out flex items-center gap-5 border"
    :class="path ? 'border-[#e8e8f0] dark:border-[#1a1a2a] hover:border-[#7F45FD]/30 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-4px_rgba(127,69,253,0.15)] hover:-translate-y-1' : 'border-dashed border-[#e8e8f0] dark:border-[#1a1a2a] opacity-80'"
  >
    <!-- Background Gradient for Certified -->
    <div v-if="path" class="absolute inset-0 bg-gradient-to-r from-[#7F45FD]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

    <!-- Document Icon Area -->
    <div 
      class="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10"
      :class="path ? 'bg-[#7F45FD]/10 text-[#7F45FD] group-hover:scale-110 group-hover:rotate-[-5deg] group-hover:shadow-lg group-hover:shadow-[#7F45FD]/20' : 'bg-[#fafafe] dark:bg-[#1a1a2a] text-[#8a8a9a]'"
    >
      <div v-if="path" class="absolute inset-0 border border-[#7F45FD]/20 rounded-2xl transition-transform duration-500 group-hover:scale-105"></div>
      
      <!-- Extension Text if present, else generic icon -->
      <span v-if="path && getExtension(path)" class="text-[11px] font-black uppercase tracking-wider">{{ getExtension(path) }}</span>
      <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
      </svg>
    </div>

    <!-- Info Column -->
    <div class="flex-1 min-w-0 py-1 relative z-10">
      <h4
        class="text-[13px] font-extrabold tracking-tight leading-snug mb-2 transition-colors duration-300 break-words"
        :class="path ? 'text-[#1a1a2a] dark:text-[#fafafe] group-hover:text-[#7F45FD]' : 'text-[#8a8a9a] dark:text-[#666]'"
        :title="label"
      >
        {{ label }}
      </h4>

      <!-- Status Badges -->
      <div class="flex items-center gap-2">
        <div v-if="path" class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <span class="relative flex h-1.5 w-1.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span class="text-[9px] font-black uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400">Reçu</span>
        </div>
        <div v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/5 border border-rose-500/10 rounded-lg">
          <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
          <span class="text-[9px] font-black uppercase tracking-[0.15em] text-rose-500">Manquant</span>
        </div>
      </div>

      <!-- Plusieurs fichiers soumis pour ce document : un lien par fichier -->
      <div v-if="allUrls.length > 1" class="flex flex-wrap gap-1.5 mt-2.5">
        <a v-for="(url, idx) in allUrls" :key="idx" :href="url" target="_blank"
           class="text-[10px] font-bold text-[#7F45FD] hover:underline px-2 py-1 bg-[#7F45FD]/10 rounded-lg transition-colors hover:bg-[#7F45FD]/20">
          Fichier {{ idx + 1 }}
        </a>
      </div>
    </div>

    <!-- Action Bar / Download Button (un seul fichier) -->
    <div v-if="allUrls.length <= 1" class="shrink-0 relative z-10">
      <a
        v-if="path"
        :href="fullUrl"
        target="_blank"
        class="group/btn w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-[#1a1a2a] border border-[#e8e8f0] dark:border-[#2a2a3a] text-[#8a8a9a] hover:bg-[#7F45FD] hover:border-[#7F45FD] hover:text-white hover:shadow-[0_4px_12px_rgba(127,69,253,0.3)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7F45FD]/50"
        title="Ouvrir le document"
      >
        <svg class="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
        </svg>
      </a>
      <div v-else class="w-10 h-10 flex items-center justify-center text-[#e8e8f0] dark:text-[#2a2a3a]">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getStorageBaseUrl } from '~/utils/storageUrl'

const props = defineProps({
  label: { type: String, required: true },
  path: { type: String, default: null }
})

// Un document "multiple" (bulletins, ...) stocke ses chemins sous forme de
// tableau encodé en JSON dans le path (ex: '["documents/a.png","documents/b.png"]').
// On le décode en une vraie liste, sinon on retombe sur une liste à un élément.
const getAllPaths = (p) => {
  if (!p) return []
  if (p.startsWith('[')) {
    try {
      const parsed = JSON.parse(p)
      if (Array.isArray(parsed)) return parsed.filter(Boolean)
    } catch (e) { /* pas du JSON valide, on traite comme un chemin unique */ }
  }
  return [p]
}

const getCleanPath = (p) => getAllPaths(p)[0] || ''

const getExtension = (p) => {
  const clean = getCleanPath(p)
  if (!clean) return ''
  return clean.split('.').pop().substring(0, 4)
}

const toUrl = (p) => (p.startsWith('http') ? p : `${getStorageBaseUrl()}/storage/${p}`)

const allUrls = computed(() => getAllPaths(props.path).map(toUrl))

const fullUrl = computed(() => {
  if (!props.path) return null
  const clean = getCleanPath(props.path)
  if (clean.startsWith('http')) return clean
  return `${getStorageBaseUrl()}/storage/${clean}`
})
</script>
