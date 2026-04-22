<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 lg:p-8 transition-colors">
    <!-- En-tête avec Breadcrumb -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <Breadcrumb
        :items="[
          { label: 'Tableau de bord', to: '/admin/dashboard' },
          { label: 'Candidatures', to: '/candidatures' },
          { label: 'Admis', to: null }
        ]"
        title="Candidats Admis"
        title-class="text-xl sm:text-2xl md:text-3xl font-medium text-gray-800 dark:text-white"
        spacing="mb-0"
      />

      <!-- Boutons d'action -->
      <div class="flex items-center gap-3">
        <button
          @click="refreshData"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 font-medium transition-all disabled:opacity-50"
          :disabled="isLoading"
        >
          <svg class="w-5 h-5 text-indigo-600" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span class="hidden sm:inline">{{ isLoading ? 'Chargement...' : 'Rafraîchir' }}</span>
        </button>
        
      </div>
    </div>

    <!-- Contenu Principal -->
    <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <!-- Barre de filtres et recherche -->
      <div class="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <div class="flex flex-col md:flex-row gap-4 mb-4">
          <!-- Recherche -->
          <div class="relative flex-1 w-full">
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Rechercher par nom, prénom, email..."
              class="w-full px-4 py-2.5 pl-10 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
            />
            <svg class="w-4 h-4 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>

          <div class="flex items-center gap-3">
             <!-- Compteur -->
             <div class="px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-sm whitespace-nowrap">
                <span class="font-medium text-indigo-600 dark:text-indigo-400">{{ filteredAdmis.length }}</span>
                <span class="text-gray-600 dark:text-gray-400 ml-1">admis</span>
             </div>

             <!-- Sélecteur de colonnes -->
             <Menu as="div" class="relative">
               <MenuButton class="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                 <span class="hidden sm:inline font-medium">Colonnes</span>
               </MenuButton>
               <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
                 <MenuItems class="absolute right-0 mt-2 w-56 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-30 focus:outline-none">
                   <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">Colonnes affichées</p>
                   <div v-for="col in cols" :key="col.field" class="flex items-center gap-2 py-1.5 px-1 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                     <input type="checkbox" :id="col.field" v-model="col.hide" :true-value="false" :false-value="true" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                     <label :for="col.field" class="text-sm text-gray-700 dark:text-gray-300 font-medium cursor-pointer select-none">{{ col.title }}</label>
                   </div>
                 </MenuItems>
               </transition>
             </Menu>
          </div>
        </div>

        <!-- Deuxième ligne de filtres -->
        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
           <div class="flex flex-wrap gap-3 flex-1 items-center">
               <span class="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Filtrer par:</span>
               <Select v-model="filterFiliere" :options="[ {id: '', nom: 'Toutes les filières'}, ...filieres ]" optionLabel="nom" optionValue="id" placeholder="Filière" filter class="w-full sm:w-64 prime-select-dashboard" />
               <Select v-model="filterNiveau" :options="[ {id: '', libelle: 'Tous les niveaux'}, ...niveaux ]" optionLabel="libelle" optionValue="id" placeholder="Niveau" filter class="w-full sm:w-48 prime-select-dashboard" />
            </div>

            <button
              v-if="filterFiliere || filterNiveau || searchQuery"
              @click="filterFiliere = ''; filterNiveau = ''; searchQuery = ''"
              class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium"
            >
             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
             <span>Réinitialiser les filtres</span>
           </button>
        </div>

         <!-- Tags de filtres actifs -->
         <div v-if="filterFiliere || filterNiveau || searchQuery" class="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
           <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Filtres actifs:</span>
           <div class="flex flex-wrap gap-2">
              <span v-if="searchQuery" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
                 <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                 "{{ searchQuery }}"
                 <button @click="searchQuery = ''" class="ml-1 hover:text-indigo-900">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </span>
               <span v-if="filterFiliere" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
                  Filière: {{ filieres.find(f => f.id === filterFiliere)?.nom }}
                  <button @click="filterFiliere = ''" class="ml-1 hover:text-indigo-900">
                     <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
               </span>
               <span v-if="filterNiveau" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                  Niveau: {{ niveaux.find(n => n.id === filterNiveau)?.libelle }}
                  <button @click="filterNiveau = ''" class="ml-1 hover:text-purple-900">
                     <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
               </span>
            </div>
         </div>
      </div>

      <!-- Datatable Area -->
      <div class="p-4 sm:p-6 text-gray-900 dark:text-white">
        <!-- Collection Dock -->
        <Transition enter-active-class="transition duration-500 ease-out" enter-from-class="opacity-0 -translate-y-4" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-300 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-4">
          <div v-if="selectedIds.length > 0" class="mb-6 flex flex-col md:flex-row items-center gap-4 px-6 py-4 rounded-2xl border border-indigo-100 bg-indigo-50/40 dark:bg-indigo-900/20 dark:border-indigo-800/50 backdrop-blur-md transition-all duration-300">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-medium">
                {{ selectedIds.length }}
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] font-medium uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Actions Collective</span>
                <span class="text-sm font-medium">{{ selectedIds.length }} candidat{{ selectedIds.length > 1 ? 's' : '' }} sélectionné{{ selectedIds.length > 1 ? 's' : '' }}</span>
              </div>
            </div>
            <div class="flex-1"></div>
            <div class="flex items-center gap-2">
              <button @click="bulkReject" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium transition-all">
                REJETER
              </button>
              <button @click="selectedIds = []" class="px-4 py-2 text-gray-400 hover:text-red-500 transition-all font-medium text-xs uppercase tracking-widest">
                Annuler
              </button>
            </div>
          </div>
        </Transition>

        <div v-if="isLoading" class="py-32 flex flex-col items-center justify-center gap-6">
          <div class="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-[10px] font-medium text-violet-500 uppercase tracking-widest animate-pulse">Initialisation du Portail...</p>
        </div>

        <template v-else-if="filteredAdmis.length > 0">
           <vue3-datatable
              :rows="filteredAdmis"
              :columns="visibleColumns"
              :loading="isLoading"
              :hasCheckbox="true"
              @rowSelect="onRowSelect"
              skin="bh-table-hover"
              class="elite-table-v2"
              :pageSize="10"
           >
              <!-- Slot Candidat -->
              <template #candidat="data">
                 <div class="flex items-center gap-3.5 py-1">
                    <div class="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center relative overflow-hidden text-white font-medium text-xs uppercase">
                       {{ data.value.nom?.charAt(0) }}{{ data.value.prenom?.charAt(0) }}
                       <img v-if="data.value.album?.photo" :src="getFullUrl(data.value.album.photo)" class="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div class="flex flex-col min-w-0">
                       <span class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ data.value.nom }} {{ data.value.prenom }}</span>
                       <span class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ data.value.email }}</span>
                    </div>
                 </div>
              </template>

              <!-- Slot Filière -->
               <template #filiere.nom="data">
                  <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-[9px] font-medium uppercase tracking-wider">
                     {{ data.value.filiere?.nom }}
                  </span>
               </template>

              <!-- Slot Niveau -->
               <template #niveau.libelle="data">
                  <span class="px-3 py-1 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900/50 rounded-lg text-[9px] font-medium uppercase tracking-wider whitespace-nowrap">
                     {{ data.value.niveau?.libelle || data.value.niveau_nom || 'N/A' }}
                  </span>
               </template>

              <!-- Slot Date Admission -->
              <template #admission_date="data">
                 <span class="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {{ formatDate(data.value.admission_date || data.value.updated_at) }}
                 </span>
              </template>

              <!-- Slot Actions -->
              <template #actions="data">
                 <div class="flex items-center justify-center gap-2">
                    <button @click="navigateToEnroll(data.value)" class="w-9 h-9 bg-violet-600 text-white rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all" title="Inscrire le candidat">
                       <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                    </button>
                    <button @click="rejectCandidate(data.value)" class="w-9 h-9 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all" title="Rejeter">
                       <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                 </div>
              </template>
           </vue3-datatable>
        </template>

        <!-- Empty State -->
        <div v-else class="py-24 text-center">
           <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gray-50 dark:bg-gray-900 mb-6 border border-gray-100 dark:border-gray-800">
              <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
           </div>
            <h3 class="text-lg font-medium text-gray-400 uppercase tracking-tighter">File d'attente vide</h3>
            <p class="text-[11px] font-medium text-gray-400 uppercase tracking-widest mt-2">Aucun candidat prêt pour l'admission finale.</p>
         </div>
    </div>
    </div>

    <!-- Modale de Rejet (Headless UI) -->
    <TransitionRoot appear :show="isRejectionModalOpen" as="template">
      <Dialog as="div" @close="isRejectionModalOpen = false" class="relative z-50">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle border border-gray-200 dark:border-gray-700 transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                  {{ rejectionTarget.isBulk ? 'Rejet Groupé' : 'Rejeter le dossier' }}
                </DialogTitle>
                
                <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <p v-if="rejectionTarget.isBulk">
                    Voulez-vous rejeter les {{ selectedIds.length }} dossiers sélectionnés ?
                  </p>
                  <p v-else>
                    Voulez-vous annuler la validation de {{ rejectionTarget.candidate?.nom }} ?
                  </p>
                  
                  <textarea
                    v-model="rejectionMotif"
                    class="mt-4 w-full h-24 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all text-sm text-gray-900 dark:text-white"
                    placeholder="Saisissez le motif du rejet..."
                  ></textarea>
                </div>

                <div class="mt-6 flex justify-end gap-3">
                  <button
                    @click="isRejectionModalOpen = false"
                    class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    @click="confirmRejection"
                    :disabled="!rejectionMotif || isLoading"
                    class="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-all"
                  >
                    Confirmer le rejet
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import Vue3Datatable from '@bhplugin/vue3-datatable'
import { ref, computed, onMounted } from 'vue'
import { useCandidatureStore } from '~~/stores/candidature'
import { useFiliereStore } from '~~/stores/filiere'
import { useNiveauStore } from '~~/stores/niveau'
import {
  Menu, MenuButton, MenuItems,
  TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle
} from '@headlessui/vue'

const candidatureStore = useCandidatureStore()
const filiereStore = useFiliereStore()
const niveauStore = useNiveauStore()
const { $toastr, $swal } = useNuxtApp()

// États
const searchQuery = ref('')
const filterFiliere = ref('')
const filterNiveau = ref('')
const isLoading = ref(false)
const selectedIds = ref([]) // Pour les actions groupées

// Modale de Rejet
const isRejectionModalOpen = ref(false)
const rejectionMotif = ref('')
const rejectionTarget = ref({ isBulk: false, candidate: null })

// Datatable Columns Configuration
const cols = ref([
  { field: 'candidat', title: 'Candidat', isUnique: true, hide: false },
  { field: 'filiere.nom', title: 'Filière', hide: false },
  { field: 'niveau.libelle', title: 'Niveau', hide: false },
  { field: 'admission_date', title: 'Admis le', hide: false },
  { field: 'actions', title: 'Actions', hide: false, sort: false, headerClass: 'justify-end', cellClass: 'justify-end' },
])

const visibleColumns = computed(() => cols.value.filter(col => !col.hide))

// Data
const filieres = computed(() => filiereStore.filieres || [])
const niveaux = computed(() => niveauStore.niveaux || [])

const filteredAdmis = computed(() => {
  let list = candidatureStore.candidatures.filter(c => (c.admission || c.dossier_valide) && !c.etudiant_id)
  
  if (filterFiliere.value) {
    list = list.filter(c => c.filiere?.id == filterFiliere.value)
  }

  if (filterNiveau.value) {
    list = list.filter(c => c.niveau?.id == filterNiveau.value)
  }
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(c => 
      c.nom?.toLowerCase().includes(q) || 
      c.prenom?.toLowerCase().includes(q) || 
      c.email?.toLowerCase().includes(q)
    )
  }
  
  return list
})

// Actions
const onRowSelect = (rows) => {
  selectedIds.value = rows.map(r => r.id)
}

const exportExcel = () => {
  window.open('/api/candidature/export/excel', '_blank')
}

const bulkReject = () => {
  rejectionTarget.value = { isBulk: true, candidate: null }
  rejectionMotif.value = ''
  isRejectionModalOpen.value = true
}

const confirmRejection = async () => {
  if (!rejectionMotif.value) return
  
  isLoading.value = true
  try {
    if (rejectionTarget.value.isBulk) {
      for (const id of selectedIds.value) {
        const candidate = filteredAdmis.value.find(c => c.id === id)
        if (candidate) await candidatureStore.rejeterDossier(candidate.slug, rejectionMotif.value)
      }
      $toastr.success(`${selectedIds.value.length} candidats rejetés`)
      selectedIds.value = []
    } else {
      const candidate = rejectionTarget.value.candidate
      await candidatureStore.rejeterDossier(candidate.slug, rejectionMotif.value)
      $toastr.success('Candidat rejeté avec succès')
    }
    isRejectionModalOpen.value = false
    refreshData()
  } catch (error) {
    $toastr.error('Erreur lors du rejet.')
  } finally {
    isLoading.value = false
  }
}

const refreshData = async () => {
  isLoading.value = true
  try {
    await Promise.all([
      candidatureStore.fetchCandidaturesAdmis(),
      filiereStore.fetchFilieres(),
      niveauStore.fetchNiveaux()
    ])
  } finally {
    isLoading.value = false
  }
}

const navigateToEnroll = (candidate) => {
  navigateTo(`/candidatures/inscription/${candidate.slug}`)
}

const rejectCandidate = (candidate) => {
  rejectionTarget.value = { isBulk: false, candidate }
  rejectionMotif.value = ''
  isRejectionModalOpen.value = true
}

const getFullUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  return `${apiBase}/storage/${path}`
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(dateString))
}

onMounted(() => { refreshData() })
</script>

<style scoped>
:deep(.elite-table-v2) {
   background: transparent !important;
}
:deep(.elite-table-v2 thead tr th) {
   font-size: 10px;
   font-weight: 600;
   color: #94a3b8;
   text-transform: uppercase;
   letter-spacing: 0.1em;
   padding: 1.5rem 1rem;
   border-bottom: 1px solid #f1f5f9;
}
.dark :deep(.elite-table-v2 thead tr th) {
   border-bottom-color: #1e293b;
   color: #64748b;
}
:deep(.elite-table-v2 tbody tr) {
   border: none;
   transition: all 0.3s;
}
:deep(.elite-table-v2 tbody tr:hover) {
   background-color: #f8fafc !important;
}
.dark :deep(.elite-table-v2 tbody tr:hover) {
   background-color: #1e293b !important;
}
:deep(.elite-table-v2 tbody tr td) {
   padding: 1rem 1rem;
   border-bottom: 1px solid #f1f5f9;
}
.dark :deep(.elite-table-v2 tbody tr td) {
   border-bottom-color: #334155;
}

:deep(.prime-select-dashboard) {
  border-radius: 0.75rem !important;
  border: 1px solid #e2e8f0 !important;
  background: white !important;
  padding: 0 0.5rem !important;
  font-weight: 500 !important;
  font-size: 0.875rem !important;
  color: #1e293b !important;
}
.dark :deep(.prime-select-dashboard) {
  background: #1f2937 !important;
  border-color: #374151 !important;
  color: #f3f4f6 !important;
}
:deep(.prime-select-dashboard .p-select-label) {
  padding: 0.625rem 0.5rem !important;
}
:deep(.p-select-panel) {
  border-radius: 0.75rem !important;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
