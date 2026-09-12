<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Relevés', to: '#' },
        { label: 'Liste globale', to: null },
      ]"
      title="Consultation des relevés"
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
        <!-- Recherche globale -->
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher..."
          class="w-full lg:w-64 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="fetchReleves(1)"
            class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Rafraîchir
          </button>

          <Can action="create-releve">
            <NuxtLink
              to="/admin/releves-globaux"
              class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Générer des relevés
            </NuxtLink>
          </Can>
        </div>
      </div>

      <!-- Filters Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Année Scolaire</label>
          <Dropdown
            v-model="filters.annee_scolaire_id"
            :options="annees"
            optionLabel="nom"
            optionValue="id"
            placeholder="Sélectionner l'année"
            class="w-full"
            :showClear="true"
            @change="fetchReleves(1)"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Période Académique</label>
          <Dropdown
            v-model="filters.periode_id"
            :options="periodes"
            optionLabel="nom"
            optionValue="id"
            placeholder="Toutes les périodes"
            class="w-full"
            :showClear="true"
            @change="fetchReleves(1)"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Groupe / Promotion</label>
          <Dropdown
            v-model="filters.group_id"
            :options="formattedGroupes"
            optionLabel="displayName"
            optionValue="id"
            placeholder="Tous les groupes"
            class="w-full"
            :showClear="true"
            @change="fetchReleves(1)"
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
                <h4 class="text-base font-semibold text-gray-700 dark:text-gray-200 mb-1">Aucun relevé trouvé</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 max-w-sm">Aucun relevé de notes n'a été trouvé pour la sélection ou la recherche actuelle.</p>
              </div>
            </template>

            <!-- Column slots -->
            <template #etudiant="{ value }">
              <div class="flex items-center gap-3 py-1">
                <div class="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold shrink-0">
                  {{ value.etudiant_initials }}
                </div>
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-gray-900 dark:text-white uppercase">{{ value.etudiant_nom }}</span>
                  <span class="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{{ value.etudiant_matricule }}</span>
                </div>
              </div>
            </template>

            <template #periode="{ value }">
              <span class="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                {{ value.periode }}
              </span>
            </template>

            <template #resultat="{ value }">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full shrink-0" :class="value.moyenne_generale >= 10 ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                <span class="text-xs font-bold text-gray-900 dark:text-white">
                  {{ value.moyenne_generale }}<span class="text-[10px] text-gray-400">/20</span>
                </span>
              </div>
            </template>

            <template #credits="{ value }">
              <span class="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {{ value.total_credits_valides }} <span class="text-[10px] text-gray-400 font-normal">Crédits</span>
              </span>
            </template>

            <template #emis_le="{ value }">
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ value.created_at_formatted }}</span>
            </template>

            <template #action="{ value }">
              <div class="flex items-center justify-center gap-2">
                <button 
                  @click="previewReleve(value.raw)" 
                  class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  title="Consulter ce relevé"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>

                <button 
                  @click="generateSynthese(value.raw)" 
                  class="p-2 rounded-lg text-teal-600 hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors"
                  title="Générer la Synthèse Annuelle"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>

                <Can action="delete-releve">
                  <button 
                    @click="deleteReleve(value.id)" 
                    class="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    title="Supprimer"
                  >
                    <ButtonDelete />
                  </button>
                </Can>
              </div>
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
            <DialogPanel class="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 transition-all border border-gray-100 dark:border-gray-700">
              <div class="flex justify-between items-center mb-6">
                <DialogTitle class="text-xl font-bold text-gray-900 dark:text-white">Prévisualisation du relevé</DialogTitle>
                <div class="flex items-center gap-4">
                  <button @click="showPreview = false" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              
              <div class="max-h-[80vh] overflow-y-auto custom-scrollbar">
                <ReleveNotePreview v-if="activeReleveData" :releve="activeReleveData" @close="showPreview = false" />
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal de Synthèse Annuelle -->
    <TransitionRoot appear :show="showSynthesePreview" as="template">
      <Dialog as="div" class="relative z-50" @close="showSynthesePreview = false">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <DialogPanel class="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 transition-all border border-gray-100 dark:border-gray-700">
              <div class="flex justify-between items-center mb-6">
                <DialogTitle class="text-xl font-bold text-gray-900 dark:text-white">Synthèse Annuelle de l'étudiant</DialogTitle>
                <div class="flex items-center gap-4">
                  <button @click="showSynthesePreview = false" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              
              <div class="max-h-[80vh] overflow-y-auto custom-scrollbar">
                <ReleveSynthesePreview v-if="syntheseReleves.length > 0" :releves="syntheseReleves" @close="showSynthesePreview = false" />
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
import { useAnneScolaireStore } from '~~/stores/annee-scolaire'
import Dropdown from 'primevue/dropdown'
import Vue3Datatable from '@bhplugin/vue3-datatable'
import Swal from 'sweetalert2'
import ButtonDelete from "~/components/ui/buttonDelete.vue"

const { $api, $toastr } = useNuxtApp()
const user = useState('user')
const periodeStore = usePeriodeStore()
const groupeStore = useGroupeStore()
const relevenoteStore = useReleveNoteStore()
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

const releves = ref([])
const filters = ref({
  annee_scolaire_id: null,
  periode_id: null,
  group_id: null
})
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0
})
const loading = ref(false)
const showPreview = ref(false)
const activeReleveData = ref(null)

const showSynthesePreview = ref(false)
const syntheseReleves = ref([])

const columns = ref([
  { field: "etudiant", title: "Étudiant", sortable: true },
  { field: "periode", title: "Période", sortable: true },
  { field: "resultat", title: "Résultat", sortable: true },
  { field: "credits", title: "Crédits", sortable: true },
  { field: "emis_le", title: "Émis le", sortable: true },
  { field: "action", title: "Actions", sortable: false, headerClass: "text-center" },
])

const rows = computed(() => {
  return releves.value.map((r) => ({
    id: r.id,
    raw: r,
    etudiant_nom: `${r.etudiant?.nom || ''} ${r.etudiant?.prenom || ''}`.trim(),
    etudiant_matricule: r.etudiant?.matricule || '',
    etudiant_initials: `${r.etudiant?.nom?.charAt(0) || ''}${r.etudiant?.prenom?.charAt(0) || ''}`,
    periode: r.periode || 'N/A',
    moyenne_generale: r.moyenne_generale || '0.00',
    total_credits_valides: r.total_credits_valides || 0,
    created_at: r.created_at,
    created_at_formatted: formatDate(r.created_at),
  }))
})

onMounted(async () => {
  if (!isAuthorized.value) return
  
  loading.value = true
  
  await Promise.all([
    periodeStore.fetchPeriode(),
    groupeStore.fetchGroupes(),
    anneeScolaireStore.fetchAnneeScolaire()
  ])
  
  const activeAnnee = annees.value.find(a => a.active === 1 || a.active === true)
  if (activeAnnee) filters.value.annee_scolaire_id = activeAnnee.id

  fetchReleves()
})

const fetchReleves = async (page = 1) => {
  loading.value = true
  try {
    const data = await relevenoteStore.fetchGlobalReleves({
        page,
        annee_scolaire_id: filters.value.annee_scolaire_id,
        periode_id: filters.value.periode_id,
        group_id: filters.value.group_id
    })
    releves.value = data.data
    pagination.value = {
      current_page: data.current_page,
      last_page: data.last_page,
      total: data.total
    }
  } catch (error) {
    console.error('[LISTE-RELEVES] Erreur fetch:', error)
    $toastr.error('Erreur lors du chargement des relevés')
  } finally {
    loading.value = false
  }
}

const previewReleve = (releve) => {
  const found = releves.value.find(r => String(r.id) === String(releve.id))
  
  if (found) {
    activeReleveData.value = found
    showPreview.value = true
  } else {
    $toastr.error('Erreur: Les détails du relevé sont introuvables.')
  }
}

const generateSynthese = async (releveData) => {
  const etudiantId = releveData.etudiant?.slug || releveData.etudiant?.matricule || releveData.etudiant?.id || releveData.etudiant_id;
  if (!etudiantId) {
    $toastr.error('Identifiant de l\'étudiant manquant.');
    return;
  }

  loading.value = true;
  try {
    const anneeScId = releveData.annee_scolaire_id;
    const etudId = releveData.etudiant_id || releveData.etudiant?.id;
    
    let studentReleves = releves.value.filter(r => 
      (r.etudiant_id === etudId || r.etudiant?.id === etudId) && 
      (r.annee_scolaire_id === anneeScId || r.annee_scolaire === releveData.annee_scolaire)
    );

    studentReleves = studentReleves.map(r => {
      let parsedUes = r.ues || r.unites_enseignements || r.matieres || r.details;
      if (typeof parsedUes === 'string') {
        try { parsedUes = JSON.parse(parsedUes); } catch (e) { console.error(e); }
      }
      return {
        ...r,
        logo_url: r.logo_url || releveData.logo_url,
        configurations: r.configurations || releveData.configurations,
        etudiant: r.etudiant || releveData.etudiant,
        ues: parsedUes
      };
    });
    
    if (studentReleves.length === 0) {
      $toastr.warning('Aucun relevé trouvé pour cet étudiant sur cette année scolaire.');
      return;
    }

    studentReleves.sort((a, b) => {
      const pA = a.periode || '';
      const pB = b.periode || '';
      return pA.localeCompare(pB);
    });

    syntheseReleves.value = studentReleves;
    showSynthesePreview.value = true;
  } catch (error) {
    console.error('[LISTE-RELEVES] Erreur génération synthèse:', error);
    $toastr.error('Une erreur est survenue lors de la récupération des données de synthèse.');
  } finally {
    loading.value = false;
  }
}

const deleteReleve = async (id) => {
  const result = await Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: "Cette action supprimera définitivement le relevé.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#4f46e5',
    cancelButtonColor: '#ef4444',
    confirmButtonText: 'Oui, supprimer !',
    cancelButtonText: 'Annuler'
  })

  if (result.isConfirmed) {
    try {
      await relevenoteStore.deleteReleveNote(id)
      releves.value = releves.value.filter((r) => r.id !== id)
      $toastr.success('Relevé supprimé avec succès.')
      fetchReleves(pagination.value.current_page)
    } catch (error) {
      console.error('Erreur suppression:', error)
      $toastr.error('Une erreur est survenue lors de la suppression.')
    }
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>
