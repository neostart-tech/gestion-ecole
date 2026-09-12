<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Relevés', to: '#' },
        { label: 'Génération globale', to: null },
      ]"
      title="Génération globale des relevés"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <div v-if="!isAuthorized" class="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl text-center border border-red-200 dark:border-red-800">
      <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 14c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h2 class="text-xl font-bold text-red-800 dark:text-red-400 mb-2">Accès restreint</h2>
      <p class="text-red-600 dark:text-red-300">Vous n'avez pas les autorisations nécessaires pour accéder à cette interface.</p>
    </div>

    <div v-else class="space-y-5">
      <!-- Toolbar Top -->
      <div class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <!-- Recherche -->
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher..."
          class="w-full lg:w-64 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="fetchEtudiants"
            class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            :disabled="loading"
            title="Rafraîchir la liste"
          >
            <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Rafraîchir
          </button>

          <Can action="create-releve">
            <button
              @click="bulkGenerate"
              class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="selectedStudents.length === 0 || bulkLoading || !selectedPeriodeId"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Générer ({{ selectedStudents.length }})
            </button>
          </Can>
        </div>
      </div>

      <!-- Filters Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Année Scolaire</label>
          <Dropdown
            v-model="selectedAnneeId"
            :options="annees"
            optionLabel="nom"
            optionValue="id"
            placeholder="Sélectionner l'année"
            class="w-full"
            @change="fetchEtudiants"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Groupe (Promotion)</label>
          <Dropdown
            v-model="selectedGroupId"
            :options="formattedGroupes"
            optionLabel="displayName"
            optionValue="slug"
            placeholder="Sélectionner un groupe"
            class="w-full"
            @change="fetchEtudiants"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Période (Semestre)</label>
          <Dropdown
            v-model="selectedPeriodeId"
            :options="filteredPeriodes"
            optionLabel="nom"
            optionValue="id"
            placeholder="Sélectionner un semestre"
            class="w-full"
            @change="checkAllStatuses"
          />
        </div>
      </div>

      <!-- Main Data Table Container using Vue3Datatable -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-3 sm:p-4">
        <div v-if="loading" class="flex justify-center py-10">
          <div class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
        </div>

        <div v-else class="overflow-x-auto">
          <Vue3Datatable
            :columns="columns"
            :rows="rows"
            :search="searchQuery"
            :per-page="10"
            :hasCheckbox="true"
            @rowSelect="onRowSelect"
            skin="bh-table-striped bh-table-hover"
            class="w-full"
          >
            <!-- Slot vide stylisé avec icône -->
            <template #no-data>
              <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mb-4 text-gray-400 dark:text-gray-500 shadow-inner">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 class="text-base font-semibold text-gray-700 dark:text-gray-200 mb-1">Aucun étudiant trouvé</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 max-w-sm">Aucun étudiant n'a été trouvé pour la sélection ou la recherche actuelle.</p>
              </div>
            </template>

            <template #matricule="{ value }">
              <span class="text-xs font-mono font-medium text-gray-600 dark:text-gray-300">{{ value.matricule }}</span>
            </template>

            <template #nom_prenom="{ value }">
              <span class="text-xs font-bold text-gray-900 dark:text-white uppercase">{{ value.nom_prenom }}</span>
            </template>

            <template #groupe_nom="{ value }">
              <span class="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                {{ value.groupe_nom }}
              </span>
            </template>

            <template #status="{ value }">
              <div v-if="releveStatuses[value.id]?.exists" class="flex items-center justify-center gap-2">
                <span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded text-xs font-bold uppercase">Généré</span>
                <button 
                  @click="previewReleve(value.id)" 
                  class="p-1 rounded text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 font-semibold text-xs transition-colors"
                  title="Voir le relevé"
                >
                  Voir
                </button>
              </div>
              <span v-else class="px-2.5 py-1 bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 rounded text-xs font-semibold uppercase">En attente</span>
            </template>
          </Vue3Datatable>
        </div>
      </div>
    </div>

    <!-- Modal de prévisualisation -->
    <TransitionRoot appear :show="showPreview" as="template">
      <Dialog as="div" class="relative z-50" @close="showPreview = false">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <DialogPanel class="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-200 dark:border-gray-700">
              <div class="flex justify-between items-center mb-4">
                <DialogTitle class="text-lg font-bold text-gray-900 dark:text-white">Prévisualisation du relevé</DialogTitle>
                <button @click="showPreview = false" class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div class="max-h-[80vh] overflow-y-auto bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
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
        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel class="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-xl border border-gray-100 dark:border-gray-700">
            <div class="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 class="text-lg font-bold mb-2 text-gray-900 dark:text-white">Génération en cours</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Veuillez patienter pendant la création des relevés...</p>
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
import Vue3Datatable from '@bhplugin/vue3-datatable'

const { $api, $toastr, $swal } = useNuxtApp()
const user = useState('user')
const periodeStore = usePeriodeStore()
const groupeStore = useGroupeStore()
const relevenoteStore = useReleveNoteStore()
const etudiantStore = useEtudiantStore()
const anneeScolaireStore = useAnneScolaireStore()

const searchQuery = ref("")

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

const columns = ref([
  { field: "matricule", title: "Matricule", sortable: true },
  { field: "nom_prenom", title: "Nom & Prénoms", sortable: true },
  { field: "groupe_nom", title: "Groupe", sortable: true },
  { field: "status", title: "Statut", sortable: false, headerClass: "text-center" },
])

const rows = computed(() => {
  return etudiants.value.map((e) => ({
    id: e.id,
    matricule: e.matricule || '',
    nom_prenom: `${e.nom || ''} ${e.prenom || ''}`.trim().toUpperCase(),
    groupe_nom: e.groupe_nom || 'N/A',
  }))
})

const onRowSelect = (selectedRows) => {
  selectedStudents.value = selectedRows || []
}

const filteredPeriodes = computed(() => {
  const allPeriodes = periodes.value || [];
  if (!selectedGroupId.value) return allPeriodes;

  const selectedGroup = formattedGroupes.value.find(g => g.slug === selectedGroupId.value);
  if (!selectedGroup || !selectedGroup.niveau) return allPeriodes;

  if (selectedGroup.niveau.periodes && selectedGroup.niveau.periodes.length > 0) {
    const periodeIds = selectedGroup.niveau.periodes.map(p => p.id);
    return allPeriodes.filter(p => periodeIds.includes(p.id));
  }

  return allPeriodes;
});

watch(filteredPeriodes, (newPeriodes) => {
  if (selectedPeriodeId.value) {
    const stillExists = newPeriodes.some(p => p.id === selectedPeriodeId.value);
    if (!stillExists) {
      selectedPeriodeId.value = null;
    }
  }
});

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
        groupe_nom: e.dernier_groupe?.group?.nom || 'N/A'
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

const bulkGenerate = async () => {
  if (!selectedPeriodeId.value || selectedStudents.value.length === 0) return
  const confirm = await $swal.fire({
    title: 'Générer ?',
    text: `${selectedStudents.value.length} relevés seront générés.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#4f46e5'
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
