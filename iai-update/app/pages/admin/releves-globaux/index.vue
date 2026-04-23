<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Relevés', to: '#' },
        { label: 'Génération globale', to: null },
      ]"
      title="Génération globale des relevés"
      spacing="mb-6"
    />

    <div v-if="!isAuthorized" class="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl text-center border border-red-200 dark:border-red-800">
      <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 14c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h2 class="text-xl font-bold text-red-800 dark:text-red-400 mb-2">Accès restreint</h2>
      <p class="text-red-600 dark:text-red-300">Vous n'avez pas les autorisations nécessaires pour accéder à cette interface de génération globale.</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Filtres et Sélection de Période -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Période (Semestre)</label>
            <Dropdown
              v-model="selectedPeriodeId"
              :options="periodes"
              optionLabel="nom"
              optionValue="id"
              placeholder="Sélectionner un semestre"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Groupe (Promotion)</label>
            <Dropdown
              v-model="selectedGroupId"
              :options="formattedGroupes"
              optionLabel="displayName"
              optionValue="slug"
              placeholder="Tous les groupes"
              class="w-full"
              :showClear="true"
              @change="fetchEtudiants"
            />
          </div>
          <div class="flex gap-3">
            <button
              @click="fetchEtudiants"
              class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              :disabled="loading"
            >
              <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Afficher les étudiants
            </button>
            <button
              @click="bulkGenerate"
              class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              :disabled="selectedStudentIds.length === 0 || bulkLoading || !selectedPeriodeId"
            >
              <svg v-if="bulkLoading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Générer ({{ selectedStudentIds.length }})
            </button>
            <button
              @click="checkAllStatuses"
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              :disabled="loading || etudiants.length === 0"
              title="Rafraîchir les statuts"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Liste des étudiants -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 class="font-bold text-gray-800 dark:text-white">Liste des étudiants</h3>
          <div class="flex gap-4 items-center">
            <div class="flex items-center gap-2">
              <input type="checkbox" id="selectAll" :checked="isAllSelected" @change="toggleSelectAll" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
              <label for="selectAll" class="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">Tout sélectionner</label>
            </div>
            <span class="text-sm text-gray-500">{{ filteredEtudiants.length }} étudiant(s) trouvé(s)</span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th class="px-6 py-3 w-10"></th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Matricule</th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom & Prénoms</th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Groupe</th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-if="filteredEtudiants.length === 0" class="text-center py-10">
                <td colspan="5" class="px-6 py-10 text-gray-500">Aucun étudiant à afficher. Veuillez filtrer par groupe.</td>
              </tr>
              <tr v-for="etudiant in filteredEtudiants" :key="etudiant.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td class="px-6 py-4">
                  <input type="checkbox" :value="etudiant.id" v-model="selectedStudentIds" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                </td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{{ etudiant.matricule }}</td>
                <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{{ etudiant.nom }} {{ etudiant.prenom }}</td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ etudiant.groupe_nom }}</td>
                <td class="px-6 py-4 text-center">
                   <div v-if="releveStatuses[etudiant.id]?.exists" class="flex flex-col items-center gap-1">
                     <span class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs font-bold">Généré</span>
                     <button @click="previewReleve(etudiant.id)" class="text-[10px] text-indigo-600 hover:underline">Consulter</button>
                   </div>
                   <span v-else class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">En attente</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de prévisualisation -->
    <TransitionRoot appear :show="showPreview" as="template">
      <Dialog as="div" class="relative z-50" @close="showPreview = false">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <DialogPanel class="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all border border-gray-100 dark:border-gray-700">
              <div class="flex justify-between items-center mb-6">
                <DialogTitle class="text-xl font-bold text-gray-900 dark:text-white">Prévisualisation du relevé</DialogTitle>
                <button @click="showPreview = false" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <div class="max-h-[80vh] overflow-y-auto custom-scrollbar">
                <ReleveNotePreview v-if="activeReleve" :releve="activeReleve" />
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal de progression -->
    <TransitionRoot appear :show="bulkLoading" as="template">
      <Dialog as="div" class="relative z-50">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 text-center shadow-xl transition-all border border-gray-100 dark:border-gray-700">
              <div class="mb-6">
                <div class="relative w-24 h-24 mx-auto mb-4">
                  <svg class="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                    <circle class="text-gray-200 dark:text-gray-700 stroke-current" stroke-width="8" fill="transparent" r="40" cx="50" cy="50"/>
                    <circle class="text-indigo-600 stroke-current" stroke-width="8" stroke-linecap="round" fill="transparent" r="40" cx="50" cy="50" stroke-dasharray="251.2" :stroke-dashoffset="251.2 * (1 - 0.5)"/>
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-xl font-bold text-indigo-600">...</span>
                  </div>
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Génération en cours</h3>
                <p class="text-gray-500 dark:text-gray-400">Veuillez patienter pendant que le système génère les relevés sélectionnés.</p>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { TransitionRoot, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { usePeriodeStore } from '~~/stores/periode'
import { useGroupeStore } from '~~/stores/group'

import { useReleveNoteStore } from '~~/stores/relevenote'

const { $api, $toastr, $swal } = useNuxtApp()
const user = useState('user')
const periodeStore = usePeriodeStore()
const groupeStore = useGroupeStore()
const relevenoteStore = useReleveNoteStore()

// Autorisation
const authorizedRoles = ['informaticien', 'directeur-general', 'directeur-general-adjoint', 'directeur-academique', 'logiticien-academique', 'admin']
const isAuthorized = computed(() => {
  if (!user.value || !user.value.roles) return false
  return user.value.roles.some(r => authorizedRoles.includes(r.slug))
})

// Données
const periodes = computed(() => periodeStore.periodes)
const groupes = computed(() => groupeStore.groupes)
const formattedGroupes = computed(() => {
  return groupes.value.map(g => ({
    ...g,
    displayName: `${g.niveau?.libelle || ''} ${g.nom || ''}`.trim()
  }))
})
const etudiants = ref([])
const releveStatuses = ref({}) // { student_id: { exists: bool, releve_id: int, data: obj } }
const showPreview = ref(false)
const activeReleve = ref(null)
const selectedPeriodeId = ref(null)
const selectedGroupId = ref(null)
const selectedStudentIds = ref([])
const loading = ref(false)
const bulkLoading = ref(false)

// Fetch Initial Data
onMounted(async () => {
  if (!isAuthorized.value) {
    console.warn('[RELEVES-GLOBAUX] Utilisateur non autorisé ou non chargé')
    return
  }
  
  try {
    loading.value = true
    await Promise.all([
      periodeStore.fetchPeriode(),
      groupeStore.fetchGroupes()
    ])
    
    console.log('[RELEVES-GLOBAUX] Données chargées:', {
      periodes: periodes.value.length,
      groupes: groupes.value.length
    })

    // Sélectionner la période active par défaut
    const active = periodes.value.find(p => p.status === 1 || p.status === true || p.is_active)
    if (active) selectedPeriodeId.value = active.id
  } catch (error) {
    console.error('[RELEVES-GLOBAUX] Erreur chargement initial:', error)
    $toastr.error('Erreur lors du chargement des données initiales')
  } finally {
    loading.value = false
  }
})

const fetchEtudiants = async () => {
  if (!selectedGroupId.value) {
    etudiants.value = []
    return
  }
  
  loading.value = true
  try {
    // Utiliser le store qui gère déjà les headers
    await groupeStore.fetchGroupEtudiants(selectedGroupId.value)
    // Mapper les données pour correspondre à notre tableau (certains champs peuvent varier)
    etudiants.value = groupeStore.etudiants.map(e => ({
      id: e.id,
      matricule: e.matricule,
      nom: e.nom,
      prenom: e.prenom,
      groupe_nom: e.dernier_groupe?.group?.nom || 'N/A'
    }))
    selectedStudentIds.value = [] // Reset selection
    await checkAllStatuses() // Charger les statuts après avoir chargé les étudiants
  } catch (error) {
    console.error('[RELEVES-GLOBAUX] Erreur fetch etudiants:', error)
    $toastr.error('Erreur lors du chargement des étudiants')
  } finally {
    loading.value = false
  }
}

const checkAllStatuses = async () => {
  if (!selectedPeriodeId.value || etudiants.value.length === 0) return
  
  try {
    const res = await relevenoteStore.checkRelevesStatus({
      student_ids: etudiants.value.map(e => e.id),
      periode_id: selectedPeriodeId.value
    })
    releveStatuses.value = res.statuses || {}
  } catch (error) {
    console.error('[RELEVES-GLOBAUX] Erreur check statuses:', error)
  }
}

const previewReleve = (studentId) => {
  const status = releveStatuses.value[studentId]
  if (status && status.exists) {
    activeReleve.value = status.data
    showPreview.value = true
  }
}

const filteredEtudiants = computed(() => etudiants.value)

// Sélection
const isAllSelected = computed(() => {
  return filteredEtudiants.value.length > 0 && selectedStudentIds.value.length === filteredEtudiants.value.length
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedStudentIds.value = []
  } else {
    selectedStudentIds.value = filteredEtudiants.value.map(e => e.id)
  }
}

// Bulk Generation
const bulkGenerate = async () => {
  if (!selectedPeriodeId.value || selectedStudentIds.value.length === 0) return

  const confirm = await $swal.fire({
    title: 'Confirmer la génération ?',
    text: `Vous allez générer les relevés pour ${selectedStudentIds.value.length} étudiants.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui, générer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#4f46e5'
  })

  if (!confirm.isConfirmed) return

  bulkLoading.value = true
  try {
    const res = await relevenoteStore.BulkGenerateReleveNotes({
      student_ids: selectedStudentIds.value,
      periode_id: selectedPeriodeId.value
    })
    
    if (res.success) {
      $swal.fire({
        title: 'Succès !',
        text: res.message,
        icon: 'success'
      })
      // Mettre à jour les statuts avec les données renvoyées par le serveur
      if (res.updated_statuses) {
        releveStatuses.value = { ...releveStatuses.value, ...res.updated_statuses }
      }
      selectedStudentIds.value = []
    } else {
      $toastr.error(res.message || 'Une erreur est survenue')
    }
  } catch (error) {
    console.error('[RELEVES-GLOBAUX] Erreur bulk generate:', error)
    $toastr.error('Erreur lors de la génération groupée')
  } finally {
    bulkLoading.value = false
  }
}
</script>

<style scoped>
.animate-spin-slow {
  animation: spin 3s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
