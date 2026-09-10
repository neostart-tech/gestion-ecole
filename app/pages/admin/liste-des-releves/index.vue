<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Relevés', to: '#' },
        { label: 'Liste globale', to: null },
      ]"
      title="Consultation des relevés"
      spacing="mb-6"
    />

    <div v-if="!isAuthorized" class="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl text-center border border-red-200 dark:border-red-800">
      <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 14c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h2 class="text-xl font-bold text-red-800 dark:text-red-400 mb-2">Accès restreint</h2>
      <p class="text-red-600 dark:text-red-300">Vous n'avez pas les autorisations nécessaires pour accéder à cette interface.</p>
    </div>

    <div v-else class="space-y-8">
      <!-- Filtres Modernes -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 transition-all">
        <div class="flex flex-col lg:flex-row gap-4 lg:items-end">
          <div class="space-y-2 flex-1">
            <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Année Scolaire</label>
            <Dropdown
              v-model="filters.annee_scolaire_id"
              :options="annees"
              optionLabel="nom"
              optionValue="id"
              placeholder="Sélectionner l'année"
              class="w-full custom-dropdown"
              :showClear="true"
              @change="fetchReleves(1)"
            />
          </div>
          <div class="space-y-2 flex-1">
            <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Période Académique</label>
            <Dropdown
              v-model="filters.periode_id"
              :options="periodes"
              optionLabel="nom"
              optionValue="id"
              placeholder="Toutes les périodes"
              class="w-full custom-dropdown"
              :showClear="true"
              @change="fetchReleves(1)"
            />
          </div>
          <div class="space-y-2 flex-1">
            <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Groupe / Promotion</label>
            <Dropdown
              v-model="filters.group_id"
              :options="formattedGroupes"
              optionLabel="displayName"
              optionValue="id"
              placeholder="Tous les groupes"
              class="w-full custom-dropdown"
              :showClear="true"
              @change="fetchReleves(1)"
            />
          </div>
          <div class="flex items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0">
             <button
              @click="fetchReleves(1)"
              class="flex-1 lg:flex-none px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-black text-[10px] uppercase tracking-[0.1em] rounded-xl transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
              :disabled="loading"
            >
              <svg v-if="loading" class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Filtrer
            </button>
            <Can action="create-releve">
              <NuxtLink
                to="/admin/releves-globaux"
                class="flex-1 lg:flex-none px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Générer
              </NuxtLink>
            </Can>
          </div>
        </div>
      </div>

      <!-- Liste Elite -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden relative">
        <!-- Overlay Loading -->
        <div v-if="loading" class="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm z-10 flex items-center justify-center">
          <div class="flex flex-col items-center gap-3">
            <svg class="w-8 h-8 text-violet-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-[10px] font-black uppercase tracking-widest text-violet-600">Chargement...</span>
          </div>
        </div>

        <div class="px-8 py-6 border-b border-slate-50 dark:border-slate-800/60 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/10">
          <div>
            <h3 class="text-sm font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">Répertoire des Relevés</h3>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Gestion académique centralisée</p>
          </div>
          <div class="px-4 py-1.5 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-violet-100 dark:border-violet-800">
            {{ pagination.total }} document(s) trouvé(s)
          </div>
        </div>

        <div class="overflow-x-auto">
          <DataTable
            :value="releves"
            dataKey="id"
            lazy
            :loading="loading"
            :paginator="true"
            :rows="15"
            :totalRecords="pagination.total"
            :first="(pagination.current_page - 1) * 15"
            @page="onPage"
            class="w-full text-sm custom-datatable"
            emptyMessage="Aucun relevé archivé pour cette sélection"
            responsiveLayout="scroll"
          >
            <Column header="Étudiant">
              <template #body="{ data }">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 text-xs font-black ring-4 ring-violet-50 dark:ring-violet-900/10">
                      {{ data.etudiant?.nom?.charAt(0) }}{{ data.etudiant?.prenom?.charAt(0) }}
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{{ data.etudiant?.nom }} {{ data.etudiant?.prenom }}</span>
                      <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{{ data.etudiant?.matricule }}</span>
                    </div>
                  </div>
              </template>
            </Column>
            <Column header="Période">
              <template #body="{ data }">
                   <div class="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg inline-flex">
                      <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">{{ data.periode }}</span>
                   </div>
              </template>
            </Column>
            <Column header="Résultat">
              <template #body="{ data }">
                   <div class="flex items-center gap-3">
                      <div class="w-1.5 h-1.5 rounded-full" :class="data.moyenne_generale >= 10 ? 'bg-emerald-500' : 'bg-rose-500'"></div>
                      <span class="text-xs font-black text-slate-900 dark:text-white">
                        {{ data.moyenne_generale || '0.00' }}<span class="text-[10px] text-slate-400">/20</span>
                      </span>
                   </div>
              </template>
            </Column>
            <Column header="Crédits">
              <template #body="{ data }">
                   <div class="flex flex-col">
                      <span class="text-xs font-black text-indigo-600 dark:text-indigo-400">
                        {{ data.total_credits_valides || 0 }} <span class="text-[10px] text-slate-400">Crédits</span>
                      </span>
                   </div>
              </template>
            </Column>
            <Column header="Émis le">
              <template #body="{ data }">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ formatDate(data.created_at) }}</span>
              </template>
            </Column>
            <Column header="Actions" alignFrozen="right">
              <template #body="{ data }">
                  <div class="flex items-center justify-end gap-2">
                    <button 
                      @click="previewReleve(data)" 
                      class="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-violet-600 dark:text-violet-400 font-black text-[9px] uppercase tracking-widest rounded-lg hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all group-hover:-translate-x-0.5"
                      title="Consulter ce relevé"
                    >
                      Consulter
                    </button>
                    <button 
                      @click="generateSynthese(data)" 
                      class="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-teal-600 dark:text-teal-400 font-black text-[9px] uppercase tracking-widest rounded-lg hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all group-hover:-translate-x-0.5"
                      title="Générer la Synthèse Annuelle"
                    >
                      Synthèse
                    </button>
                    <Can action="delete-releve">
                      <button 
                        @click="deleteReleve(data.id)" 
                        class="px-2 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-rose-600 dark:text-rose-400 font-black text-[9px] uppercase rounded-lg hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all"
                        title="Supprimer"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </Can>
                  </div>
              </template>
            </Column>
          </DataTable>
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
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Swal from 'sweetalert2'
import axios from 'axios'

const { $api, $toastr } = useNuxtApp()
const user = useState('user')
const periodeStore = usePeriodeStore()
const groupeStore = useGroupeStore()
const relevenoteStore = useReleveNoteStore()
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

const onPage = (event) => {
  fetchReleves(event.page + 1)
}

const previewReleve = (releve) => {
  const found = releves.value.find(r => String(r.id) === String(releve.id))
  console.log('[LISTE-RELEVES] Releve selectionne:', releve.id)
  console.log('[LISTE-RELEVES] Données trouvées dans le store:', found)
  
  if (found) {
    activeReleveData.value = found
    showPreview.value = true
  } else {
    console.warn('[LISTE-RELEVES] Releve non trouve dans le store après fetch')
    $toastr.error('Erreur: Les détails du relevé sont introuvables.')
  }
}

const generateSynthese = async (releveData) => {
  const etudiantId = releveData.etudiant?.slug || releveData.etudiant?.matricule || releveData.etudiant?.id || releveData.etudiant_id;
  if (!etudiantId) {
    console.error('Relevé data:', releveData);
    $toastr.error('Identifiant de l\'étudiant manquant.');
    return;
  }

  loading.value = true;
  try {
    const anneeScId = releveData.annee_scolaire_id;
    const etudId = releveData.etudiant_id || releveData.etudiant?.id;
    
    // Filtrer dans la liste courante de la table (qui contient déjà 'ues' correctement)
    let studentReleves = releves.value.filter(r => 
      (r.etudiant_id === etudId || r.etudiant?.id === etudId) && 
      (r.annee_scolaire_id === anneeScId || r.annee_scolaire === releveData.annee_scolaire)
    );

    // S'assurer que le tableau ues est bien présent et au bon format
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
    
    console.log('[SYNTHESE] studentReleves depuis la table locale:', studentReleves);
    
    if (studentReleves.length === 0) {
      $toastr.warning('Aucun relevé trouvé pour cet étudiant sur cette année scolaire.');
      return;
    }

    // Trier les relevés par période (ex: Semestre 1 puis Semestre 2)
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
      // Optional: recalculer la pagination ou refetch
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
