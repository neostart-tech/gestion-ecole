<template>
  <div class="w-full space-y-10">
    <!-- En-tête Premium -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-100 dark:border-[#1a1a2a]">
      <div class="flex items-center gap-5">
        <div class="w-14 h-14 rounded-[10px] bg-[#01b4d5]/10 text-[#01b4d5] flex items-center justify-center ring-4 ring-[#01b4d5]/5">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1A2238] dark:text-white tracking-tight">Mes Documents</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Gérez et sécurisez les pièces jointes de votre candidature.</p>
        </div>
      </div>
    </div>

    <!-- Message de Rectification -->
    <div v-if="isRectification" class="bg-white dark:bg-[#11111e] rounded-[10px] border border-[#01b4d5]/20 shadow-xl shadow-[#01b4d5]/10 relative overflow-hidden mb-10">
      <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#01b4d5] to-[#009ab5]"></div>

      <div class="p-8 md:p-10">
        <div class="flex flex-col md:flex-row gap-8 items-start">

          <!-- Icon -->
          <div class="w-16 h-16 rounded-[10px] bg-[#01b4d5]/10 flex items-center justify-center flex-shrink-0 border border-[#01b4d5]/20 shadow-inner">
            <svg class="w-8 h-8 text-[#01b4d5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>

          <!-- Content -->
          <div class="flex-1">
            <h3 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Fichiers à modifier</h3>
            <p class="text-gray-500 dark:text-gray-400 text-base mb-6 leading-relaxed max-w-3xl">
              L'administration a examiné votre dossier et demande la modification ou l'ajout de certains documents. Vous avez exceptionnellement la possibilité de charger les fichiers manquants ci-dessous.
            </p>

            <!-- Motif Box -->
            <div v-if="candidatureState?.motif" class="bg-gray-50/50 dark:bg-[#0a0a12]/50 rounded-[10px] p-6 border border-gray-200 dark:border-[#1a1a2a] relative max-w-3xl">
              <div class="flex gap-4">
                <svg class="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                <div>
                  <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Message de l'administration</h4>
                  <p class="text-gray-800 dark:text-gray-200 text-base italic font-medium leading-relaxed">"{{ candidatureState.motif }}"</p>
                </div>
              </div>
            </div>

            <!-- Bouton de soumission globale -->
            <div class="mt-8 pt-6 border-t border-gray-100 dark:border-[#1a1a2a] flex flex-col sm:flex-row items-center gap-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Une fois tous les fichiers modifiés ou ajoutés, validez ici :</p>
              <button @click="submitRectifications" :disabled="isSubmitting" class="h-11 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-[10px] shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 transition-all flex items-center gap-2.5 disabled:opacity-70 disabled:pointer-events-none w-full sm:w-auto justify-center whitespace-nowrap">
                <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <svg v-else class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                <span>{{ isSubmitting ? 'Soumission...' : 'Terminer & Soumettre' }}</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Zone de chargement si appel API -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-32">
       <svg class="animate-spin h-10 w-10 text-[#01b4d5] mb-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
       <p class="text-gray-500 dark:text-gray-400 font-medium">Récupération sécurisée de vos fichiers...</p>
    </div>

    <!-- Liste des documents -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      <!-- Carte Document Premium -->
      <div v-for="doc in documents" :key="doc.id"
           class="group relative bg-white dark:bg-[#11111e] rounded-[10px] p-6 transition-all duration-300"
           :class="doc.fourni ? 'border border-gray-100 dark:border-[#1a1a2a] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1' : 'border border-dashed border-gray-300 dark:border-[#242438] bg-gray-50/50 dark:bg-[#0a0a12]/50 hover:bg-gray-50 dark:hover:bg-[#0a0a12]'">

        <div class="flex items-start gap-5 mb-5">
          <!-- Icône dynamique selon l'extension ou état -->
          <div class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
               :class="doc.fourni ? getFileIconColor(doc.extension) : 'bg-gray-200/50 dark:bg-[#1a1a2a] text-gray-400'">
            <span v-if="doc.fourni" class="text-sm font-black tracking-widest">{{ doc.extension.toUpperCase() }}</span>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
          </div>

          <div class="flex-1 min-w-0 pt-1">
            <h4 class="font-extrabold text-[#1A2238] dark:text-white text-sm leading-tight truncate mb-1.5" :title="doc.nom">{{ doc.nom }}</h4>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest" :class="getStatusBadgeClass(doc.statut)">
                <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(doc.statut)"></span>
                {{ doc.statut }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between mt-auto pt-4 border-t" :class="doc.fourni ? 'border-gray-50 dark:border-[#1a1a2a]' : 'border-gray-200 dark:border-[#242438] border-dashed'">
            <p class="text-xs font-medium" :class="doc.fourni ? 'text-gray-400' : 'text-rose-500/80'">
              <template v-if="doc.fourni">
                {{ formatSize(doc.taille) }}
                <span v-if="doc.date_ajout" class="px-1 text-gray-300">•</span>
                <span v-if="doc.date_ajout">{{ formatDate(doc.date_ajout) }}</span>
              </template>
              <template v-else>En attente de soumission</template>
            </p>

           <div class="flex items-center gap-2">
             <!-- Bouton Télécharger -->
             <button v-if="doc.fourni" @click="downloadDoc(doc)"
                     class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#01b4d5] bg-gray-50 dark:bg-[#1a1a2a] hover:bg-[#01b4d5]/10 rounded-lg transition-colors focus:ring-2 focus:ring-[#01b4d5]/30 focus:outline-none"
                     title="Télécharger le fichier">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
             </button>

             <div v-if="isRectification">
               <input type="file" :ref="'fileInput_' + doc.id" class="hidden" @change="handleFileSelect($event, doc.id)" />
               <button @click="$refs['fileInput_' + doc.id][0].click()"
                       class="h-8 px-3 rounded-lg transition-all flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider focus:ring-2 focus:outline-none"
                       :class="selectedFiles[doc.id] ? 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500/30 shadow-sm' : (doc.fourni ? 'text-[#01b4d5] bg-[#01b4d5]/10 hover:bg-[#01b4d5]/20 focus:ring-[#01b4d5]/30' : 'text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:ring-emerald-500/30 shadow-sm')">
                 <svg v-if="selectedFiles[doc.id]" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                 <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                 <span>{{ selectedFiles[doc.id] ? 'Sélectionné' : (doc.fourni ? 'Remplacer' : 'Charger') }}</span>
               </button>
               <p v-if="selectedFiles[doc.id]" class="text-[10px] text-indigo-600 font-bold mt-1 truncate max-w-[120px]" :title="selectedFiles[doc.id].name">{{ selectedFiles[doc.id].name }}</p>
             </div>
           </div>
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

const formatSize = (bytes) => {
  if (!bytes || bytes === 0) return 'Taille inconnue'
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

const getFileIconColor = (ext) => {
  if (!ext) return 'bg-gray-100 text-gray-500'
  const map = {
    pdf: 'bg-red-50 text-red-500',
    jpg: 'bg-blue-50 text-blue-500',
    png: 'bg-blue-50 text-blue-500',
    doc: 'bg-indigo-50 text-indigo-500',
    docx: 'bg-indigo-50 text-indigo-500',
  }
  return map[ext?.toLowerCase()] || 'bg-gray-100 text-gray-500'
}

const getStatusBadgeClass = (statut) => {
  if (!statut) return 'bg-gray-50 text-gray-500'
  const s = statut.toLowerCase()
  if (s.includes('soumis') || s.includes('fourni')) return 'bg-emerald-50 text-emerald-700'
  if (s.includes('manquant') || s.includes('non fourni')) return 'bg-rose-50 text-rose-700'
  if (s.includes('rectification')) return 'bg-amber-50 text-amber-700'
  return 'bg-gray-50 text-gray-500'
}

const getStatusDotClass = (statut) => {
  if (!statut) return 'bg-gray-400'
  const s = statut.toLowerCase()
  if (s.includes('soumis') || s.includes('fourni')) return 'bg-emerald-500'
  if (s.includes('manquant') || s.includes('non fourni')) return 'bg-rose-500'
  if (s.includes('rectification')) return 'bg-amber-500'
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
          if (fourni) {
             let cleanPath = path
             if (cleanPath.startsWith('[')) {
                 try {
                     const parsed = JSON.parse(cleanPath)
                     if (Array.isArray(parsed) && parsed.length > 0) cleanPath = parsed[0]
                 } catch(e) {}
             }
             ext = cleanPath.split('.').pop() || 'file'
          }

          docArray.push({
             id: key,
             nom: name,
             fourni: fourni,
             is_obligatoire: docReq.is_obligatoire,
             extension: ext.toLowerCase(),
             taille: docMetadata[key] ? docMetadata[key].size : null,
             date_ajout: docMetadata[key] ? docMetadata[key].date : null,
             statut: fourni ? 'Soumis' : (docReq.is_obligatoire ? 'Requis (Manquant)' : 'Facultatif'),
             url: fourni ? (path.startsWith('http') ? path : `${getStorageBaseUrl()}/storage/${path}`) : null
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
          if (fourni) {
             let cleanPath = path
             if (cleanPath.startsWith('[')) {
                 try {
                     const parsed = JSON.parse(cleanPath)
                     if (Array.isArray(parsed) && parsed.length > 0) cleanPath = parsed[0]
                 } catch(e) {}
             }
             ext = cleanPath.split('.').pop() || 'file'
          }

          docArray.push({
             id: key,
             nom: name,
             fourni: fourni,
             is_obligatoire: true,
             extension: ext.toLowerCase(),
             taille: docMetadata[key] ? docMetadata[key].size : null,
             date_ajout: docMetadata[key] ? docMetadata[key].date : null,
             statut: fourni ? 'Soumis' : 'Non fourni',
             url: fourni ? (path.startsWith('http') ? path : `${getStorageBaseUrl()}/storage/${path}`) : null
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

const downloadDoc = (doc) => {
  if (doc.url) {
    window.open(doc.url, '_blank')
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
    confirmButtonColor: '#01b4d5',
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
