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

    <div v-if="!isAuthorized" class="bg-red-50 dark:bg-red-900/20 p-6 rounded-[5px] text-center border border-red-200 dark:border-red-800">
      <h2 class="text-xl font-bold text-red-800 dark:text-red-400 mb-2">Accès restreint</h2>
      <p class="text-red-600 dark:text-red-300">Vous n'avez pas les autorisations nécessaires.</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Filtres et Sélection de Période (Refonte Sobre) -->
      <div class="bg-white dark:bg-gray-800 rounded-[5px] shadow-sm border border-gray-200 dark:border-gray-700 p-5">
        <div class="flex flex-col lg:flex-row gap-4 lg:items-end">
          <div class="space-y-1.5 flex-1">
            <label class="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-tight">Année Scolaire</label>
            <Dropdown
              v-model="selectedAnneeId"
              :options="annees"
              optionLabel="nom"
              optionValue="id"
              placeholder="Sélectionner l'année"
              class="w-full custom-dropdown-sober"
              @change="fetchEtudiants"
            />
          </div>
          <div class="space-y-1.5 flex-1">
            <label class="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-tight">Groupe (Promotion)</label>
            <Dropdown
              v-model="selectedGroupId"
              :options="formattedGroupes"
              optionLabel="displayName"
              optionValue="slug"
              placeholder="Sélectionner un groupe"
              class="w-full custom-dropdown-sober"
              @change="fetchEtudiants"
            />
          </div>
          <div class="space-y-1.5 flex-1">
            <label class="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-tight">Période (Semestre)</label>
            <Dropdown
              v-model="selectedPeriodeId"
              :options="filteredPeriodes"
              optionLabel="nom"
              optionValue="id"
              placeholder="Sélectionner un semestre"
              class="w-full custom-dropdown-sober"
            />
          </div>
          <div class="flex gap-2 w-full lg:w-auto mt-4 lg:mt-0">
            <button
              @click="fetchEtudiants"
              class="flex-1 lg:flex-none px-6 py-2 bg-blue-600 text-white rounded-[5px] font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loading"
            >
              <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Afficher les étudiants
            </button>
            <Can action="create-releve">
              <button
                @click="bulkGenerate"
                class="flex-1 lg:flex-none px-6 py-2 bg-green-600 text-white rounded-[5px] font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                :disabled="selectedStudents.length === 0 || bulkLoading || !selectedPeriodeId"
              >
                Générer ({{ selectedStudents.length }})
              </button>
            </Can>
            <button
              @click="checkAllStatuses"
              class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-[5px] hover:bg-gray-200 transition-colors border border-gray-200 dark:border-gray-600 flex-1 lg:flex-none flex items-center justify-center"
              :disabled="loading || etudiants.length === 0"
              title="Rafraîchir"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Liste des étudiants -->
      <div class="bg-white dark:bg-gray-800 rounded-[5px] shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h3 class="font-bold text-gray-800 dark:text-white text-sm">Liste des étudiants</h3>
          <div class="flex gap-4 items-center">
            <span class="text-xs text-gray-500">{{ filteredEtudiants.length }} étudiant(s)</span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <DataTable
            :value="filteredEtudiants"
            v-model:selection="selectedStudents"
            dataKey="id"
            :loading="loading"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[10, 20, 50, 100]"
            class="w-full text-sm custom-datatable"
            emptyMessage="Aucun étudiant trouvé."
            responsiveLayout="scroll"
          >
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="matricule" header="Matricule" sortable></Column>
            <Column header="Nom & Prénoms" sortable>
              <template #body="{ data }">
                <span class="uppercase">{{ data.nom }} {{ data.prenom }}</span>
              </template>
            </Column>
            <Column field="groupe_nom" header="Groupe" sortable></Column>
            <Column header="Status" alignFrozen="right">
              <template #body="{ data }">
                   <div v-if="releveStatuses[data.id]?.exists" class="flex items-center gap-2">
                     <span class="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-[3px] text-[10px] font-bold uppercase">Généré</span>
                     <button @click="previewReleve(data.id)" class="text-[10px] text-blue-600 hover:underline font-bold">Voir</button>
                   </div>
                   <span v-else class="px-2 py-0.5 bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 rounded-[3px] text-[10px] font-bold uppercase">Attente</span>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>

    <!-- Modal de prévisualisation -->
    <TransitionRoot appear :show="showPreview" as="template">
      <Dialog as="div" class="relative z-50" @close="showPreview = false">
        <div class="fixed inset-0 bg-black/50" />
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <DialogPanel class="w-full max-w-5xl transform overflow-hidden rounded-[5px] bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-200 dark:border-gray-700">
              <div class="flex justify-between items-center mb-4">
                <DialogTitle class="text-lg font-bold text-gray-900 dark:text-white">Prévisualisation</DialogTitle>
                <button @click="showPreview = false" class="p-1 hover:bg-gray-100 rounded">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div class="max-h-[80vh] overflow-y-auto bg-gray-100 p-4 rounded-[5px]">
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
        <div class="fixed inset-0 bg-black/50" />
        <div class="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel class="w-full max-w-sm bg-white dark:bg-gray-800 rounded-[5px] p-6 text-center shadow-xl">
              <div class="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 class="text-lg font-bold mb-2">Génération en cours</h3>
              <p class="text-sm text-gray-500">Veuillez patienter...</p>
            </DialogPanel>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { TransitionRoot, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { usePeriodeStore } from '~~/stores/periode'
import { useGroupeStore } from '~~/stores/group'
import { useReleveNoteStore } from '~~/stores/relevenote'
import { useEtudiantStore } from '~~/stores/etudiant'
import { useAnneScolaireStore } from '~~/stores/annee-scolaire'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Breadcrumb from '~/components/Breadcrumb.vue'

const { $api, $toastr, $swal } = useNuxtApp()
const user = useState('user')
const periodeStore = usePeriodeStore()
const groupeStore = useGroupeStore()
const relevenoteStore = useReleveNoteStore()
const etudiantStore = useEtudiantStore()
const anneeScolaireStore = useAnneScolaireStore()

// Autorisation
const authorizedRoles = ['informaticien', 'directeur-general', 'directeur-general-adjoint', 'directeur-academique', 'logiticien-academique', 'admin']
const isAuthorized = computed(() => {
  if (!user.value || !user.value.roles) return false
  return user.value.roles.some(r => authorizedRoles.includes(r.slug))
})

// Données
const annees = computed(() => anneeScolaireStore.annneescolaires)
const periodes = computed(() => periodeStore.periodes)
const groupes = computed(() => groupeStore.groupes)
const formattedGroupes = computed(() => {
  return groupes.value.map(g => ({
    ...g,
    displayName: `${g.niveau?.libelle || ''} ${g.nom || ''}`.trim()
  }))
})
const etudiants = ref([])
const releveStatuses = ref({})
const showPreview = ref(false)
const activeReleve = ref(null)
const selectedAnneeId = ref(null)
const selectedPeriodeId = ref(null)
const selectedGroupId = ref(null)
const selectedStudents = ref([])
const loading = ref(false)
const bulkLoading = ref(false)

// Filtrage intelligent des semestres selon le niveau
const filteredPeriodes = computed(() => {
  const allPeriodes = periodes.value || [];
  if (!selectedGroupId.value) return allPeriodes;

  const selectedGroup = formattedGroupes.value.find(g => g.slug === selectedGroupId.value);
  if (!selectedGroup || !selectedGroup.niveau) return allPeriodes;

  // Utiliser la relation en base de données si elle existe
  if (selectedGroup.niveau.periodes && selectedGroup.niveau.periodes.length > 0) {
    const periodeIds = selectedGroup.niveau.periodes.map(p => p.id);
    return allPeriodes.filter(p => periodeIds.includes(p.id));
  }

  return allPeriodes;
});

// Réinitialiser la période si elle n'est plus dans la liste filtrée
watch(filteredPeriodes, (newPeriodes) => {
  if (selectedPeriodeId.value) {
    const stillExists = newPeriodes.some(p => p.id === selectedPeriodeId.value);
    if (!stillExists) {
      selectedPeriodeId.value = null;
    }
  }
});

// Sélectionner le premier groupe par défaut si les groupes sont chargés
watch(formattedGroupes, (newGroupes) => {
  if (newGroupes.length > 0 && !selectedGroupId.value) {
    selectedGroupId.value = newGroupes[0].slug;
  }
});

onMounted(async () => {
  if (!isAuthorized.value) return
  try {
    loading.value = true
    await Promise.all([
      periodeStore.fetchPeriode(), 
      groupeStore.fetchGroupes(),
      anneeScolaireStore.fetchAnneeScolaire()
    ])
    
    if (formattedGroupes.value.length > 0) {
      selectedGroupId.value = formattedGroupes.value[0].slug;
    }
    
    const activePeriode = periodes.value.find(p => p.status === 1 || p.status === true || p.is_active)
    if (activePeriode) selectedPeriodeId.value = activePeriode.id
    
    const activeAnnee = annees.value.find(a => a.active === 1 || a.active === true)
    if (activeAnnee) selectedAnneeId.value = activeAnnee.id

    // Fetch initial list of all students of the active year
    if (selectedAnneeId.value) {
      await fetchEtudiants()
    }
  } catch (error) {
    $toastr.error('Erreur de chargement')
  } finally {
    loading.value = false
  }
})

const fetchEtudiants = async () => {
  loading.value = true
  try {
    if (!selectedGroupId.value) {
      await etudiantStore.fetchEtudiants(selectedAnneeId.value)
      etudiants.value = etudiantStore.etudiants.map(e => ({
        id: e.id,
        matricule: e.matricule,
        nom: e.nom,
        prenom: e.prenom,
        groupe_nom: e.dernier_groupe?.group?.nom || 'N/A' // Adjusted to use the correct resource key
      }))
    } else {
      await groupeStore.fetchGroupEtudiants(selectedGroupId.value, selectedAnneeId.value)
      const selectedGroup = formattedGroupes.value.find(g => g.slug === selectedGroupId.value)
      const displayGroupName = selectedGroup ? selectedGroup.displayName : 'N/A'

      etudiants.value = groupeStore.etudiants.map(e => ({
        id: e.id,
        matricule: e.matricule,
        nom: e.nom,
        prenom: e.prenom,
        groupe_nom: displayGroupName
      }))
    }
    
    selectedStudents.value = []
    await checkAllStatuses() 
  } catch (error) {
    $toastr.error('Erreur chargement étudiants')
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
  } catch (error) {}
}

const previewReleve = (studentId) => {
  const status = releveStatuses.value[studentId]
  if (status && status.exists) {
    activeReleve.value = status.data
    showPreview.value = true
  }
}

const filteredEtudiants = computed(() => etudiants.value)

const bulkGenerate = async () => {
  if (!selectedPeriodeId.value || selectedStudents.value.length === 0) return
  const confirm = await $swal.fire({
    title: 'Générer ?',
    text: `${selectedStudents.value.length} relevés seront générés.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#2563eb'
  })
  if (!confirm.isConfirmed) return
  bulkLoading.value = true
  try {
    const res = await relevenoteStore.BulkGenerateReleveNotes({
      student_ids: selectedStudents.value.map(s => s.id),
      periode_id: selectedPeriodeId.value
    })
    if (res.success) {
      $swal.fire('Succès', res.message, 'success')
      if (res.updated_statuses) releveStatuses.value = { ...releveStatuses.value, ...res.updated_statuses }
      selectedStudents.value = []
    } else {
      $toastr.error(res.message)
    }
  } catch (error) {
    $toastr.error('Erreur génération')
  } finally {
    bulkLoading.value = false
  }
}
</script>

<style>
.custom-dropdown-sober .p-dropdown {
    border-radius: 5px !important;
    border: 1px solid #d1d5db !important;
}
.dark .custom-dropdown-sober .p-dropdown {
    background-color: #1f2937 !important;
    border-color: #374151 !important;
}
</style>
