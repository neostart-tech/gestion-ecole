<template>
  <div class="w-full space-y-10">
    <!-- En-tête Premium -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-100 dark:border-[#1a1a2a]">
      <div class="flex items-center gap-5">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#4338ca] text-white flex items-center justify-center shadow-lg shadow-[#4f46e5]/30">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Mes Documents</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Gérez et sécurisez les pièces jointes de votre candidature.</p>
        </div>
      </div>
      
      <!-- Progress Indicator -->
      <div v-if="!isLoading && documents.length > 0" class="flex flex-col gap-2 min-w-[200px]">
        <div class="flex justify-between text-xs font-bold text-gray-600 dark:text-gray-300">
          <span>Progression du dossier</span>
          <span :class="progressColor">{{ submittedCount }} / {{ documents.length }}</span>
        </div>
        <div class="h-2 w-full bg-gray-100 dark:bg-[#1a1a2a] rounded-full overflow-hidden">
          <div class="h-full transition-all duration-1000 ease-out rounded-full"
               :class="progressBgColor"
               :style="{ width: `${progressPercentage}%` }"></div>
        </div>
      </div>
    </div>

    <!-- Message de Rectification -->
    <div v-if="isRectification" class="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 rounded-2xl border border-orange-200/50 dark:border-orange-800/50 shadow-xl shadow-orange-500/5 relative overflow-hidden mb-10">
      <div class="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-orange-500 to-amber-500"></div>

      <div class="p-8">
        <div class="flex flex-col md:flex-row gap-8 items-start">
          <div class="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0 border border-orange-200 dark:border-orange-800/60 shadow-inner">
            <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-extrabold text-orange-900 dark:text-orange-400 mb-2">Documents à rectifier</h3>
            <p class="text-orange-800/80 dark:text-orange-300/80 text-sm mb-6 max-w-3xl leading-relaxed">
              L'administration a examiné votre dossier et demande la modification de certains documents.
            </p>

            <div v-if="candidatureState?.motif" class="bg-white/60 dark:bg-[#0a0a12]/60 backdrop-blur-sm rounded-xl p-5 border border-orange-100 dark:border-orange-900/30">
              <div class="flex gap-4">
                <svg class="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                <div>
                  <h4 class="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">Message de l'administration</h4>
                  <p class="text-orange-900 dark:text-orange-200 text-sm font-medium">"{{ candidatureState.motif }}"</p>
                </div>
              </div>
            </div>

            <div class="mt-8 pt-6 border-t border-orange-200/50 dark:border-orange-800/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p class="text-sm font-medium text-orange-800 dark:text-orange-300">Une fois les fichiers corrigés, validez les modifications :</p>
              <button @click="submitRectifications" :disabled="isSubmitting" class="h-11 px-8 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] hover:-translate-y-0.5 transition-all flex items-center gap-2.5 disabled:opacity-70 disabled:pointer-events-none whitespace-nowrap">
                <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                <span>{{ isSubmitting ? 'Soumission...' : 'Terminer & Soumettre' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Zone de chargement -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       <div v-for="i in 6" :key="i" class="h-[200px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl"></div>
    </div>

    <!-- Liste des documents -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      <!-- Carte Document Premium -->
      <div v-for="doc in documents" :key="doc.id"
           class="group relative flex flex-col justify-between bg-white dark:bg-[#11111e] rounded-2xl p-6 transition-all duration-500 overflow-hidden"
           :class="[
             doc.fourni 
               ? 'border border-gray-100 dark:border-[#1a1a2a] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1.5' 
               : 'border-2 border-dashed border-gray-200 dark:border-[#242438] bg-gray-50/30 dark:bg-[#0a0a12]/30 hover:bg-gray-50 dark:hover:bg-[#0a0a12] hover:border-gray-300 dark:hover:border-[#38384d]',
             !doc.fourni && !doc.is_obligatoire ? 'opacity-80 hover:opacity-100' : ''
           ]">
           
        <!-- Decorative Background Gradient for Submitted Docs -->
        <div v-if="doc.fourni" class="absolute -right-20 -top-20 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-40" :class="getBgGradientColor(doc.extension)"></div>

        <div class="relative z-10 flex items-start gap-4 mb-6">
          <!-- Icône Premium -->
          <div class="relative w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
               :class="doc.fourni ? getFileIconColor(doc.extension) : 'bg-gray-100 dark:bg-[#1a1a2a] text-gray-400'">
            <div v-if="doc.fourni" class="absolute inset-0 rounded-2xl border-2 border-white/20 dark:border-white/10"></div>
            <span v-if="doc.fourni" class="text-sm font-black tracking-widest drop-shadow-sm">{{ doc.extension.toUpperCase() }}</span>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
          </div>

          <div class="flex-1 min-w-0 pt-1">
            <h4 class="font-extrabold text-gray-900 dark:text-white text-[15px] leading-tight line-clamp-2 mb-2 group-hover:text-[#4f46e5] transition-colors" :title="doc.nom">{{ doc.nom }}</h4>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest" :class="getStatusBadgeClass(doc.statut)">
                <span class="w-1.5 h-1.5 rounded-full animate-pulse" :class="getStatusDotClass(doc.statut)"></span>
                {{ doc.statut }}
              </span>
            </div>
          </div>
        </div>

        <div class="relative z-10 mt-auto pt-5 border-t border-gray-100 dark:border-[#1a1a2a] flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-[10px] uppercase tracking-widest font-bold mb-1" :class="doc.fourni ? 'text-gray-400' : 'text-gray-400'">
                {{ doc.fourni ? 'Détails du fichier' : 'Statut' }}
              </span>
              <p class="text-xs font-medium text-gray-600 dark:text-gray-300">
                <template v-if="doc.fourni">
                  <span v-if="doc.is_multiple" class="text-[#4f46e5] mr-1">{{ doc.multiple_urls.length }} fichiers</span>
                  <span v-if="doc.is_multiple && (doc.taille || doc.date_ajout)" class="px-1.5 text-gray-300">•</span>
                  
                  <template v-if="doc.taille">
                    {{ formatSize(doc.taille) }}
                    <span v-if="doc.date_ajout" class="px-1.5 text-gray-300">•</span>
                  </template>
                  
                  <span v-if="doc.date_ajout">{{ formatDate(doc.date_ajout) }}</span>
                </template>
                <template v-else>
                  <span v-if="doc.is_obligatoire" class="text-rose-500 flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Requis
                  </span>
                  <span v-else class="text-gray-400">Facultatif</span>
                </template>
              </p>
            </div>

           <div class="flex items-center gap-2">
             <!-- Bouton Télécharger unique -->
             <button v-if="doc.fourni && !doc.is_multiple" @click="downloadSingle(doc.url)"
                     class="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white bg-gray-50 hover:bg-[#4f46e5] dark:bg-[#1a1a2a] rounded-xl transition-all duration-300 focus:ring-4 focus:ring-[#4f46e5]/30 focus:outline-none shadow-sm hover:shadow-[#4f46e5]/40 hover:-translate-y-0.5"
                     title="Ouvrir le fichier">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
             </button>

             <!-- Menu Télécharger multiple (Dropdown) -->
             <div v-else-if="doc.fourni && doc.is_multiple" class="relative group">
               <button class="h-9 px-3 flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-white bg-gray-50 hover:bg-[#4f46e5] dark:bg-[#1a1a2a] rounded-xl transition-all duration-300 focus:ring-2 focus:ring-[#4f46e5]/30 focus:outline-none shadow-sm hover:shadow-[#4f46e5]/40">
                 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/></svg>
                 <span>{{ doc.multiple_urls.length }} Fichiers</span>
                 <svg class="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
               </button>
               
               <!-- Dropdown Menu -->
               <div class="absolute right-0 bottom-full mb-2 w-40 bg-white dark:bg-[#1a1a2a] border border-gray-100 dark:border-[#242438] rounded-xl shadow-xl shadow-gray-200/50 dark:shadow-[#0a0a12]/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-bottom translate-y-2 group-hover:translate-y-0 z-50">
                 <div class="p-1.5 space-y-1">
                   <button v-for="(url, index) in doc.multiple_urls" :key="index" @click="downloadSingle(url)"
                           class="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-[#4f46e5] dark:hover:text-white hover:bg-indigo-50 dark:hover:bg-[#4f46e5] rounded-lg transition-colors">
                     <span>Fichier {{ index + 1 }}</span>
                     <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                   </button>
                 </div>
               </div>
             </div>

             <div v-if="isRectification">
               <input type="file" :ref="'fileInput_' + doc.id" class="hidden" @change="handleFileSelect($event, doc.id)" />
               <button @click="$refs['fileInput_' + doc.id][0].click()"
                       class="h-9 px-4 rounded-xl transition-all duration-300 flex items-center gap-2 text-[11px] font-black uppercase tracking-wider focus:ring-4 focus:outline-none hover:-translate-y-0.5"
                       :class="selectedFiles[doc.id] ? 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500/30 shadow-md shadow-indigo-500/20' : (doc.fourni ? 'text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-[#242438] hover:bg-gray-200 dark:hover:bg-[#38384d] focus:ring-gray-200 shadow-sm' : 'text-white bg-[#4f46e5] hover:bg-[#4338ca] focus:ring-[#4f46e5]/30 shadow-md shadow-[#4f46e5]/30')">
                 <svg v-if="selectedFiles[doc.id]" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                 <svg v-else-if="doc.fourni" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                 <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                 <span>{{ selectedFiles[doc.id] ? 'Sélectionné' : (doc.fourni ? 'Remplacer' : 'Charger') }}</span>
               </button>
             </div>
           </div>
        </div>
        <!-- Filename overlay for newly selected file -->
        <div v-if="selectedFiles[doc.id]" class="absolute bottom-0 left-0 right-0 p-2 bg-indigo-500 text-white text-[10px] font-bold text-center truncate translate-y-0 transition-transform rounded-b-2xl">
          Nouveau : {{ selectedFiles[doc.id].name }}
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useNuxtApp } from '#app'
import { useCandidatAuthStore } from '~~/stores/candidatAuth'
import { getStorageBaseUrl } from '~/utils/storageUrl'

definePageMeta({
  layout: 'candidat'
})

const { $toastr, $swal } = useNuxtApp()
const candidatAuthStore = useCandidatAuthStore()

const isLoading = ref(true)
const isSubmitting = ref(false)
const documents = ref([])
const candidatureState = ref(null)
const selectedFiles = ref({})

const isRectification = computed(() => {
  if (!candidatureState.value) return false
  if (candidatureState.value.rectification_expected) return true
  const statut = (candidatureState.value.statut || candidatureState.value.etat_dossier || '').toLowerCase()
  return statut.includes('rectification') || statut.includes('rejet')
})

const submittedCount = computed(() => documents.value.filter(d => d.fourni).length)
const progressPercentage = computed(() => documents.value.length ? (submittedCount.value / documents.value.length) * 100 : 0)

const progressColor = computed(() => {
  if (progressPercentage.value === 100) return 'text-emerald-500'
  if (progressPercentage.value > 50) return 'text-[#4f46e5]'
  return 'text-orange-500'
})

const progressBgColor = computed(() => {
  if (progressPercentage.value === 100) return 'bg-emerald-500'
  if (progressPercentage.value > 50) return 'bg-[#4f46e5]'
  return 'bg-orange-500'
})

const formatSize = (bytes) => {
  if (!bytes || bytes === 0) return ''
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const formatDate = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

const getBgGradientColor = (ext) => {
  if (!ext) return 'bg-gray-500'
  const e = ext.toLowerCase()
  if (['pdf'].includes(e)) return 'bg-red-500'
  if (['doc', 'docx'].includes(e)) return 'bg-blue-500'
  if (['xls', 'xlsx'].includes(e)) return 'bg-emerald-500'
  if (['jpg', 'jpeg', 'png', 'webp'].includes(e)) return 'bg-purple-500'
  return 'bg-indigo-500'
}

const getFileIconColor = (ext) => {
  if (!ext) return 'bg-gray-100 text-gray-500'
  const e = ext.toLowerCase()
  
  if (['pdf'].includes(e)) return 'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30'
  if (['doc', 'docx'].includes(e)) return 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
  if (['xls', 'xlsx'].includes(e)) return 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
  if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(e)) return 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-lg shadow-fuchsia-500/30'
  
  return 'bg-gradient-to-br from-gray-600 to-gray-800 text-white shadow-lg shadow-gray-500/30'
}

const getStatusBadgeClass = (statut) => {
  if (!statut) return 'bg-gray-50 text-gray-500'
  const s = statut.toLowerCase()
  if (s.includes('soumis') || s.includes('fourni')) return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 border border-emerald-200/50 dark:border-emerald-800/50'
  if (s.includes('manquant') || s.includes('non fourni')) return 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 border border-rose-200/50 dark:border-rose-800/50'
  if (s.includes('rectification')) return 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 border border-orange-200/50 dark:border-orange-800/50'
  return 'bg-gray-50 dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700'
}

const getStatusDotClass = (statut) => {
  if (!statut) return 'bg-gray-400'
  const s = statut.toLowerCase()
  if (s.includes('soumis') || s.includes('fourni')) return 'bg-emerald-500'
  if (s.includes('manquant') || s.includes('non fourni')) return 'bg-rose-500'
  if (s.includes('rectification')) return 'bg-orange-500'
  return 'bg-gray-400'
}

const fetchDocuments = async () => {
  isLoading.value = true
  try {
    const res = await candidatAuthStore.fetchMesFichiers()
    const rawAlbum = res.documents || res.album || {}
    candidatureState.value = res.candidature || {}
    const expectedDocsList = res.expected_docs || []
    const docMetadata = res.documents_metadata || {}

    const docArray = []

    if (expectedDocsList.length > 0) {
       for (const docReq of expectedDocsList) {
          const key = docReq.document_key || (docReq.document_type && docReq.document_type.document_key) || docReq.documentType?.document_key
          const name = docReq.nom_affichage || (docReq.document_type && docReq.document_type.nom_affichage) || docReq.documentType?.nom_affichage
          const path = rawAlbum[key]

          const fourni = !!path && typeof path === 'string'
          let ext = ''
          let actualPath = path
          let isMultiple = false
          let multiplePaths = []
          let totalSize = null
          let addedDate = null

          if (fourni) {
             let cleanPath = path
             if (cleanPath.startsWith('[')) {
                 try {
                     const parsed = JSON.parse(cleanPath)
                     if (Array.isArray(parsed) && parsed.length > 0) {
                         cleanPath = parsed[0]
                         actualPath = parsed[0]
                         if (parsed.length > 1) {
                             isMultiple = true
                             multiplePaths = parsed
                         }
                     }
                 } catch(e) {}
             }
             ext = cleanPath.split('.').pop() || 'file'
          }
          
          let meta = docMetadata[key]
          if (meta) {
              if (typeof meta === 'string' && meta.startsWith('[')) {
                  try { meta = JSON.parse(meta) } catch(e) {}
              }
              if (Array.isArray(meta)) {
                  let sum = 0
                  for(const m of meta) { if(m && m.size) sum += Number(m.size) }
                  totalSize = sum > 0 ? sum : null
                  addedDate = meta[0]?.date || null
              } else {
                  totalSize = meta.size ? Number(meta.size) : null
                  addedDate = meta.date || null
              }
          }

          docArray.push({
             id: key,
             nom: name,
             fourni: fourni,
             is_obligatoire: docReq.is_obligatoire,
             extension: ext.toLowerCase(),
             taille: totalSize,
             date_ajout: addedDate,
             statut: fourni ? 'Soumis' : (docReq.is_obligatoire ? 'Requis (Manquant)' : 'Facultatif'),
             url: fourni ? (actualPath.startsWith('http') ? actualPath : `${getStorageBaseUrl()}/storage/${actualPath}`) : null,
             is_multiple: isMultiple,
             multiple_urls: multiplePaths.map(p => p.startsWith('http') ? p : `${getStorageBaseUrl()}/storage/${p}`)
          })
       }
    } else {
       const expectedDocs = {
          lettre: 'Lettre de recommandation',
          naissance: 'Acte de naissance',
          diplome: 'Diplôme',
          nationalite: 'Certificat de nationalité',
          photo: "Photo d'identité",
          certificat_medical: 'Certificat médical',
          coupon: 'Coupon',
          cv: 'Curriculum Vitae',
          lettre_motivation: 'Lettre de motivation',
          releve_bac1_path: 'Relevé de notes BAC 1',
          releve_bac2_path: 'Relevé de notes BAC 2',
       }

       for (const [key, name] of Object.entries(expectedDocs)) {
          const path = rawAlbum[key]
          const fourni = !!path && typeof path === 'string'
          let ext = ''
          let actualPath = path
          let isMultiple = false
          let multiplePaths = []
          let totalSize = null
          let addedDate = null

          if (fourni) {
             let cleanPath = path
             if (cleanPath.startsWith('[')) {
                 try {
                     const parsed = JSON.parse(cleanPath)
                     if (Array.isArray(parsed) && parsed.length > 0) {
                         cleanPath = parsed[0]
                         actualPath = parsed[0]
                         if (parsed.length > 1) {
                             isMultiple = true
                             multiplePaths = parsed
                         }
                     }
                 } catch(e) {}
             }
             ext = cleanPath.split('.').pop() || 'file'
          }
          
          let meta = docMetadata[key]
          if (meta) {
              if (typeof meta === 'string' && meta.startsWith('[')) {
                  try { meta = JSON.parse(meta) } catch(e) {}
              }
              if (Array.isArray(meta)) {
                  let sum = 0
                  for(const m of meta) { if(m && m.size) sum += Number(m.size) }
                  totalSize = sum > 0 ? sum : null
                  addedDate = meta[0]?.date || null
              } else {
                  totalSize = meta.size ? Number(meta.size) : null
                  addedDate = meta.date || null
              }
          }

          docArray.push({
             id: key,
             nom: name,
             fourni: fourni,
             is_obligatoire: true,
             extension: ext.toLowerCase(),
             taille: totalSize,
             date_ajout: addedDate,
             statut: fourni ? 'Soumis' : 'Non fourni',
             url: fourni ? (actualPath.startsWith('http') ? actualPath : `${getStorageBaseUrl()}/storage/${actualPath}`) : null,
             is_multiple: isMultiple,
             multiple_urls: multiplePaths.map(p => p.startsWith('http') ? p : `${getStorageBaseUrl()}/storage/${p}`)
          })
       }
    }

    documents.value = docArray
  } catch (error) {
    console.error('Erreur récupération documents:', error)
    $toastr.error('Impossible de charger vos documents.')
  } finally {
    isLoading.value = false
  }
}

const downloadSingle = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}

const handleFileSelect = (event, documentKey) => {
  const files = event.target.files
  if (files.length === 0) return
  selectedFiles.value[documentKey] = files[0]
}

const submitRectifications = async () => {
  const hasFiles = Object.keys(selectedFiles.value).length > 0

  const res = await $swal.fire({
    title: hasFiles ? 'Soumettre les fichiers ?' : 'Soumettre définitivement ?',
    text: hasFiles
      ? `Vous êtes sur le point d'envoyer ${Object.keys(selectedFiles.value).length} fichier(s) et de soumettre votre dossier rectifié. L'administration en sera notifiée.`
      : "Aucun nouveau fichier n'a été sélectionné. Voulez-vous tout de même soumettre votre dossier rectifié à l'administration ?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, soumettre',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#4f46e5',
  })

  if (!res.isConfirmed) return

  isSubmitting.value = true
  try {
    if (hasFiles) {
      $toastr.info('Envoi des fichiers en cours...')
      for (const [key, file] of Object.entries(selectedFiles.value)) {
        const formData = new FormData()
        formData.append('document', file)
        formData.append('type', key)
        await candidatAuthStore.uploadFile(formData)
      }
    }

    const data = await candidatAuthStore.submitRectification()

    candidatureState.value = data.candidature
    selectedFiles.value = {}
    fetchDocuments()

    await $swal.fire({
      title: 'Dossier soumis !',
      text: 'Vos fichiers ont été envoyés et l\'administration a été notifiée avec succès.',
      icon: 'success',
      confirmButtonText: 'OK',
    })
  } catch (error) {
    console.error('Erreur soumission rectifications:', error)
    $toastr.error('Une erreur est survenue lors de la soumission de votre dossier.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchDocuments()
})
</script>
