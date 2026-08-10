<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 lg:p-8 transition-colors">
    <div class="w-full space-y-6">
      
      <!-- En-tête avec Breadcrumb -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Breadcrumb
          :items="[
            { label: 'Tableau de bord', to: '/admin/dashboard' },
            { label: 'Gestion des étudiants', to: '/admin/etudiants' },
            { label: 'Liste des abandons', to: null }
          ]"
          title="Liste des abandons"
          title-class="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent"
          spacing="mb-0"
        />

        <!-- Boutons d'action -->
        <div class="flex items-center gap-3">
          <button
            @click="openDeclarationModal"
            class="inline-flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 hover:shadow-[0_8px_25px_rgba(220,38,38,0.3)] disabled:opacity-60 whitespace-nowrap border-none"
          >
            <i class="pi pi-user-minus text-sm"></i>
            Déclarer un abandon
          </button>
        </div>
      </div>

      <!-- Contenu de la liste -->
      <div class="bg-white dark:bg-[#11111e] rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a] shadow-[0_8px_30px_rgba(127,69,253,0.04)] overflow-hidden p-2 sm:p-4 lg:p-6">
        
        <!-- Barre de recherche et sélecteur de colonnes -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <!-- Recherche -->
          <div class="relative w-full sm:w-80">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher un étudiant..."
              class="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 text-gray-900 dark:text-white"
            />
            <i class="pi pi-search absolute left-3 top-3 text-gray-400 text-xs"></i>
          </div>

          <!-- Sélecteur de colonnes -->
          <client-only>
            <VDropdown placement="bottom-end">
              <button
                class="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
              >
                <i class="pi pi-bars text-xs"></i>
                <span>Colonnes</span>
                <i class="pi pi-chevron-down text-[10px]"></i>
              </button>

              <template #popper>
                <div class="w-56 p-3 rounded-xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <p class="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 px-1 uppercase tracking-wider">Colonnes affichées</p>
                  <div
                    v-for="col in cols"
                    :key="col.field"
                    class="flex items-center gap-2.5 py-1.5 px-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      v-model="col.visible"
                      :disabled="col.field === 'actions'"
                      class="rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                    <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {{ col.title }}
                    </span>
                  </div>
                </div>
              </template>
            </VDropdown>
          </client-only>
        </div>

        <!-- État de chargement -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-3">
          <div class="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">Chargement de la liste des abandons...</p>
        </div>

        <!-- Message si vide -->
        <div v-else-if="abandons.length === 0" class="py-12 text-center">
          <div class="w-16 h-16 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-300 dark:text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-[#1a1a2a] dark:text-[#fafafe] mb-2">Aucun abandon</h3>
          <p class="text-sm font-medium text-[#8a8a9a]">Aucun étudiant n'est actuellement déclaré en abandon.</p>
        </div>

        <!-- Tableau des abandons avec défilement fluide et personnalisé -->
        <div v-else class="overflow-x-auto custom-scrollbar rounded-xl">
          <vue3-datatable
            :rows="abandons"
            :columns="visibleCols"
            :search="searchQuery"
            :hasCheckbox="false"
            skin="bh-table-hover"
            class="elite-table-v2 w-full min-w-full"
            :pageSize="10"
          >
            <!-- Slot Étudiant -->
            <template #candidat="data">
              <div class="flex items-center gap-3 py-1">
                <div class="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold flex items-center justify-center shrink-0 text-sm">
                  {{ data.value.nom ? data.value.nom.charAt(0) : '?' }}
                </div>
                <div class="flex flex-col min-w-0">
                  <span class="text-sm font-bold text-[#1a1a2a] dark:text-[#fafafe] truncate">{{ data.value.nom }}</span>
                  <span class="text-xs text-[#8a8a9a] truncate font-mono mt-0.5">{{ data.value.matricule }}</span>
                </div>
              </div>
            </template>

            <!-- Slot Niveau / Filière -->
            <template #niveau_filiere="data">
              <div class="flex flex-col py-1">
                <span class="text-sm font-bold text-[#1a1a2a] dark:text-[#fafafe]">{{ data.value.niveau }}</span>
                <span class="text-xs text-[#8a8a9a] mt-0.5">{{ data.value.filiere }}</span>
              </div>
            </template>

            <!-- Slot Date d'abandon -->
            <template #date_abandon="data">
              <div class="flex items-center gap-2 text-sm font-medium text-[#1a1a2a] dark:text-[#fafafe] py-1 whitespace-nowrap">
                <i class="pi pi-calendar text-[#8a8a9a]"></i>
                <span>{{ formatDate(data.value.date_abandon) || 'Non spécifiée' }}</span>
              </div>
            </template>

            <!-- Slot Situation financière -->
            <template #situation="data">
              <div class="flex flex-col py-1">
                <span class="text-sm font-bold text-[#1a1a2a] dark:text-[#fafafe] whitespace-nowrap">
                  Reste dû : <strong class="text-red-500">{{ formatMontant(data.value.reste) }}</strong>
                </span>
                <span class="text-xs text-[#8a8a9a] mt-0.5 whitespace-nowrap">Payé : {{ formatMontant(data.value.montant_paye) }}</span>
              </div>
            </template>

            <!-- Slot Actions -->
            <template #actions="data">
              <div class="flex items-center gap-2 py-1">
                <button
                  @click="confirmAnnulerAbandon(data.value)"
                  class="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:text-emerald-400 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap"
                  title="Annuler l'abandon (Rétablir l'étudiant)"
                >
                  <i class="pi pi-undo text-xs"></i>
                  <span>Rétablir</span>
                </button>
              </div>
            </template>
          </vue3-datatable>
        </div>

      </div>
    </div>

    <!-- Modal pour déclarer un abandon avec Dialog de PrimeVue -->
    <Dialog 
      v-model:visible="isModalOpen" 
      modal 
      header="Déclarer un abandon" 
      :style="{ width: '450px' }"
      class="p-fluid"
      :closable="!isSubmitting"
    >
      <div class="mt-4 space-y-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Saisissez le matricule ou le nom de l'étudiant à déclarer en abandon.
        </p>
        
        <div class="field">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Étudiant (Recherche)</label>
          <Dropdown
            v-model="selectedStudentToAbandon"
            :options="studentsList"
            filter
            optionLabel="nomComplet"
            placeholder="Sélectionner un étudiant..."
            class="w-full"
            :loading="etudiantStore.isLoading"
          >
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <div class="font-medium text-sm">{{ slotProps.option.nom }} {{ slotProps.option.prenom }}</div>
                <div class="text-xs text-gray-400">({{ slotProps.option.matricule }})</div>
              </div>
            </template>
          </Dropdown>
        </div>
      </div>

      <template #footer>
        <Button label="Annuler" icon="pi pi-times" text severity="secondary" @click="closeDeclarationModal" :disabled="isSubmitting" />
        <Button 
          label="Confirmer l'abandon" 
          icon="pi pi-check" 
          severity="danger" 
          @click="confirmDeclaration" 
          :loading="isSubmitting" 
          :disabled="!selectedStudentToAbandon" 
        />
      </template>
    </Dialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRecouvrementStore } from '~~/stores/recouvrement'
import { useEtudiantStore } from '~~/stores/etudiant'
import { useNuxtApp } from '#app'
import Breadcrumb from '~/components/Breadcrumb.vue'
import Vue3Datatable from '@bhplugin/vue3-datatable'
import '@bhplugin/vue3-datatable/dist/style.css'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'

const recouvrementStore = useRecouvrementStore()
const etudiantStore = useEtudiantStore()
const { $toastr, $swal } = useNuxtApp()

const loading = ref(true)
const isModalOpen = ref(false)
const selectedStudentToAbandon = ref(null)
const isSubmitting = ref(false)
const searchQuery = ref('')

const cols = ref([
  { field: 'candidat', title: 'Étudiant', minWidth: '220px', visible: true },
  { field: 'niveau_filiere', title: 'Niveau / Filière', minWidth: '180px', visible: true },
  { field: 'date_abandon', title: 'Date d\'abandon', minWidth: '160px', visible: true },
  { field: 'situation', title: 'Situation financière', minWidth: '200px', visible: true },
  { field: 'actions', title: 'Actions', minWidth: '120px', sort: false, visible: true },
])

const visibleCols = computed(() => {
  return cols.value.filter(col => col.visible !== false)
})

const abandons = computed(() => recouvrementStore.abandons || [])

const studentsList = computed(() => {
  return etudiantStore.etudiants.map(e => ({
    ...e,
    nomComplet: `${e.nom} ${e.prenom} (${e.matricule || 'Sans matricule'})`
  }))
})

const fetchAbandons = async () => {
  loading.value = true
  await recouvrementStore.fetchAbandons()
  loading.value = false
}

const openDeclarationModal = () => {
  if (etudiantStore.etudiants.length === 0) {
    etudiantStore.fetchEtudiants()
  }
  selectedStudentToAbandon.value = null
  isModalOpen.value = true
}

const closeDeclarationModal = () => {
  isModalOpen.value = false
  selectedStudentToAbandon.value = null
}

const confirmDeclaration = async () => {
  if (!selectedStudentToAbandon.value) return
  
  isSubmitting.value = true
  try {
    let targetSlug = null;
    if (recouvrementStore.students && recouvrementStore.students.length > 0) {
      const foundInRecouvrement = recouvrementStore.students.find(s => s.etudiant?.id === selectedStudentToAbandon.value.id || s.etudiant_id === selectedStudentToAbandon.value.id);
      if (foundInRecouvrement && foundInRecouvrement.slug) {
        targetSlug = foundInRecouvrement.slug;
      }
    }
    
    if (!targetSlug) {
      targetSlug = selectedStudentToAbandon.value.slug || selectedStudentToAbandon.value.id; 
    }

    await recouvrementStore.declarerAbandon(targetSlug)
    $toastr.success('Abandon déclaré avec succès.')
    closeDeclarationModal()
    fetchAbandons() 
  } catch (e) {
    $toastr.error('Erreur lors de la déclaration de l\'abandon.')
  } finally {
    isSubmitting.value = false
  }
}

const confirmAnnulerAbandon = async (item) => {
  if (!item) return
  
  const result = await $swal.fire({
    title: 'Rétablir l\'étudiant ?',
    text: `Voulez-vous vraiment annuler l'abandon de l'étudiant ${item.nom} et le rétablir dans les effectifs ?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, rétablir',
    cancelButtonText: 'Annuler'
  })

  if (result.isConfirmed) {
    loading.value = true
    try {
      const targetSlug = item.slug || item.id
      await recouvrementStore.annulerAbandon(targetSlug)
      $toastr.success('Abandon annulé. L\'étudiant a été rétabli avec succès.')
      await fetchAbandons()
    } catch (e) {
      $toastr.error('Erreur lors de l\'annulation de l\'abandon.')
    } finally {
      loading.value = false
    }
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return null
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

const formatMontant = (montant) => {
  if (montant === undefined || montant === null) return '0 FCFA'
  return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA'
}

onMounted(() => {
  fetchAbandons()
  if (etudiantStore.etudiants.length === 0) {
    etudiantStore.fetchEtudiants()
  }
})
</script>

<style scoped>
/* Scrollbar personnalisée moderne et discrète */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.4) transparent;
}
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.4);
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}
.dark .custom-scrollbar {
  scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(75, 85, 99, 0.5);
}

:deep(.elite-table-v2) {
   background: transparent !important;
}
:deep(.elite-table-v2 thead tr th) {
   font-size: 10px;
   font-weight: 800;
   color: #8a8a9a;
   text-transform: uppercase;
   letter-spacing: 0.1em;
   padding: 1.25rem 1.5rem;
   border-bottom: 1px solid #e8e8f0;
}
:deep(.elite-table-v2 tbody tr) {
   border: none;
   transition: all 0.3s;
}
:deep(.elite-table-v2 tbody tr:hover) {
   background-color: #fafafe !important;
}
:deep(.elite-table-v2 tbody tr td) {
   padding: 1.25rem 1.5rem;
   border-bottom: 1px solid #e8e8f0;
}
</style>

<style>
.dark .elite-table-v2 thead tr th {
   border-bottom-color: #1a1a2a;
   color: #888;
}
.dark .elite-table-v2 tbody tr:hover {
   background-color: #0a0a12 !important;
}
.dark .elite-table-v2 tbody tr td {
   border-bottom-color: #1a1a2a;
}
</style>
