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
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 p-8 transition-all">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
          <div class="space-y-2">
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
          <div class="space-y-2">
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
          <div class="md:col-span-2 flex items-center gap-4">
             <button
              @click="fetchReleves(1)"
              class="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-violet-600/20 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3"
              :disabled="loading"
            >
              <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Filtrer la recherche
            </button>
            <NuxtLink
              to="/admin/releves-globaux"
              class="px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Générer
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Liste Elite -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 overflow-hidden">
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
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50 dark:bg-slate-800/30">
                <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Étudiant</th>
                <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Période</th>
                <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Résultat</th>
                <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Crédits</th>
                <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Émis le</th>
                <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-800/60">
              <tr v-if="releves.length === 0" class="text-center">
                <td colspan="6" class="px-8 py-20">
                   <div class="flex flex-col items-center gap-4">
                     <div class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                     </div>
                     <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aucun relevé archivé pour cette sélection</p>
                   </div>
                </td>
              </tr>
              <tr v-for="releve in releves" :key="releve.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all group">
                <td class="px-8 py-5">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 text-xs font-black ring-4 ring-violet-50 dark:ring-violet-900/10">
                      {{ releve.etudiant?.nom?.charAt(0) }}{{ releve.etudiant?.prenom?.charAt(0) }}
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{{ releve.etudiant?.nom }} {{ releve.etudiant?.prenom }}</span>
                      <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{{ releve.etudiant?.matricule }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-5">
                   <div class="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg inline-flex">
                      <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">{{ releve.periode?.nom }}</span>
                   </div>
                </td>
                <td class="px-8 py-5">
                   <div class="flex items-center gap-3">
                      <div class="w-1.5 h-1.5 rounded-full" :class="releve.moyenne_generale >= 10 ? 'bg-emerald-500' : 'bg-rose-500'"></div>
                      <span class="text-xs font-black text-slate-900 dark:text-white">
                        {{ releve.moyenne_generale || '0.00' }}<span class="text-[10px] text-slate-400">/20</span>
                      </span>
                   </div>
                </td>
                <td class="px-8 py-5">
                   <div class="flex flex-col">
                      <span class="text-xs font-black text-indigo-600 dark:text-indigo-400">
                        {{ releve.total_credits_valides || 0 }} <span class="text-[10px] text-slate-400">Crédits</span>
                      </span>
                   </div>
                </td>
                <td class="px-8 py-5">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ formatDate(releve.created_at) }}</span>
                </td>
                <td class="px-8 py-5 text-right">
                  <button 
                    @click="previewReleve(releve)" 
                    class="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-violet-600 dark:text-violet-400 font-black text-[9px] uppercase tracking-widest rounded-lg hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all shadow-sm group-hover:-translate-x-1"
                  >
                    Consulter
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination Elite -->
        <div v-if="pagination.last_page > 1" class="px-8 py-6 border-t border-slate-50 dark:border-slate-800/60 bg-slate-50/20 dark:bg-slate-800/5 flex justify-center gap-3">
           <button 
            v-for="page in pagination.last_page" 
            :key="page"
            @click="fetchReleves(page)"
            :class="[
              'w-8 h-8 flex items-center justify-center rounded-lg text-[10px] font-black transition-all',
              pagination.current_page === page 
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' 
                : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-violet-600 border border-slate-100 dark:border-slate-700 hover:border-violet-100 dark:hover:border-violet-900/50'
            ]"
          >
            {{ page }}
          </button>
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
                <div v-if="activeReleveData" class="mb-4 p-2 bg-gray-100 dark:bg-gray-700 text-[10px] overflow-auto max-h-32 text-gray-800 dark:text-gray-200">
                  DEBUG: {{ JSON.stringify(activeReleveData).substring(0, 500) }}...
                </div>
                <ReleveNotePreview v-if="activeReleveData" :releve="activeReleveData" />
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

const { $api, $toastr } = useNuxtApp()
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

const releves = ref([])
const filters = ref({
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

onMounted(async () => {
  if (!isAuthorized.value) return
  
  await Promise.all([
    periodeStore.fetchPeriode(),
    groupeStore.fetchGroupes()
  ])
  
  // Sélectionner la période active par défaut
  const active = periodes.value.find(p => p.status === 1 || p.is_active)
  if (active) filters.value.periode_id = active.id
  
  fetchReleves()
})

const fetchReleves = async (page = 1) => {
  loading.value = true
  try {
    const data = await relevenoteStore.fetchGlobalReleves({
        page,
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

const previewReleve = async (releve) => {
  loading.value = true
  try {
    // Utiliser le store pour récupérer les relevés de l'étudiant
    const data = await relevenoteStore.getReleveNotes(releve.etudiant.slug)
    // On cherche le relevé spécifique dans la liste (le store met à jour relevenoteStore.releves)
    const found = relevenoteStore.releves.find(r => String(r.id) === String(releve.id))
    console.log('[LISTE-RELEVES] Releve selectionne:', releve.id)
    console.log('[LISTE-RELEVES] Données trouvées dans le store:', found)
    
    if (found) {
      activeReleveData.value = found
      showPreview.value = true
    } else {
      console.warn('[LISTE-RELEVES] Releve non trouve dans le store après fetch')
      $toastr.error('Erreur: Les détails du relevé sont introuvables.')
    }
  } catch (error) {
    console.error('[LISTE-RELEVES] Erreur preview:', error)
    $toastr.error('Erreur lors du chargement des détails du relevé')
  } finally {
    loading.value = false
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
