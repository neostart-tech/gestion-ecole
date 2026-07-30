<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Administration', to: '/' },
        { label: 'Candidatures', to: '/candidatures' },
      ]"
      :title="`Admission à ${appName}`"
      title-class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
    />

    <!-- Barre d'outils -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
      <div class="relative w-full md:w-96">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher un candidat..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
        />
        <svg class="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <select v-model="filterFiliere" class="flex-1 md:w-48 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm outline-none">
          <option value="">Toutes les filières</option>
          <option v-for="f in filiereStore.filieres" :key="f.id" :value="f.id">{{ f.nom }}</option>
        </select>
        
        <button @click="refreshData" class="p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
          <svg class="w-5 h-5" :class="{ 'animate-spin': isRefreshing }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Tableau -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
      <div v-if="isLoading" class="p-12 flex justify-center">
        <div class="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-900/50 text-left border-b border-gray-100 dark:border-gray-700">
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidat</th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Numéro de dossier</th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Choix</th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Moyenne concours</th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admission</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
            <tr v-if="filteredCandidatures.length === 0">
              <td colspan="5" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center justify-center">
                  <div class="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">Aucune admission trouvée</h3>
                  <p class="text-sm text-gray-500 max-w-sm mx-auto">Aucun dossier ne correspond à votre recherche ou il n'y a pas de candidats à traiter pour le moment.</p>
                </div>
              </td>
            </tr>
            <tr v-else v-for="c in filteredCandidatures" :key="c.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold">
                    {{ c.nom?.charAt(0) }}
                  </div>
                  <div>
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-white">{{ c.nom }} {{ c.prenom }}</h4>
                    <p class="text-xs text-gray-500">{{ c.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm font-mono text-gray-700 dark:text-gray-300 whitespace-nowrap">{{ c.numero_dossier_affiche || '—' }}</td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-gray-200">{{ c.filiere?.nom }}</div>
                <div class="text-xs text-gray-500">{{ c.niveau?.nom }}</div>
              </td>
              <td class="px-6 py-4">
                <span v-if="c.moyenne_concours !== null && c.moyenne_concours !== undefined" class="text-sm font-bold" :class="c.moyenne_concours >= 10 ? 'text-green-600' : 'text-rose-600'">
                  {{ c.moyenne_concours }}/20
                </span>
                <span v-else class="text-xs text-gray-400 italic">Dossier uniquement</span>
              </td>
              <td class="px-6 py-4">
                 <div class="flex items-center gap-2">
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="decisionMap[c.id]" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                      <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap">
                        {{ decisionMap[c.id] ? 'Admis' : 'Non Admis' }}
                      </span>
                    </label>
                 </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Soumission Globale -->
    <div class="fixed bottom-6 right-6 z-50">
      <Can action="controler-admission-candidature">
        <button
          @click="finalSubmit"
          :disabled="isSubmitting || filteredCandidatures.length === 0"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 hover:scale-105 active:scale-95"
        >
          <span v-if="isSubmitting" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-bold text-lg">Enregistrer les Admissions</span>
        </button>
      </Can>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useCandidatureStore } from '~~/stores/candidature'
import { useFiliereStore } from '~~/stores/filiere'
import { useParametreStore } from '~~/stores/parametre'
import Breadcrumb from '~/components/Breadcrumb.vue'

const candidatureStore = useCandidatureStore()
const filiereStore = useFiliereStore()
const parametreStore = useParametreStore()
const { $toastr, $swal } = useNuxtApp()

const appName = computed(() => parametreStore.getAppName || "l'établissement")

const searchQuery = ref('')
const filterFiliere = ref('')
const isRefreshing = ref(false)
const isSubmitting = ref(false)
const isLoading = ref(true)

const decisionMap = reactive({})

const filteredCandidatures = computed(() => {
  let list = candidatureStore.candidatures.filter(c => c.dossier_valide && c.admission !== true && c.admission !== 1)
  
  if (filterFiliere.value) {
    list = list.filter(c => c.filiere_id == filterFiliere.value)
  }
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(c => 
      c.nom?.toLowerCase().includes(q) || 
      c.prenom?.toLowerCase().includes(q)
    )
  }
  
  return list
})

const refreshData = async () => {
  isRefreshing.value = true
  isLoading.value = true
  try {
    await candidatureStore.fetchCandidatures()
    // Initialiser le map des décisions locales
    candidatureStore.candidatures.forEach(c => {
      decisionMap[c.id] = c.admission === true || c.admission === 1
    })
  } finally {
    isRefreshing.value = false
    isLoading.value = false
  }
}

const finalSubmit = async () => {
    isSubmitting.value = true
    try {
        const admisIds = []
        const recalesIds = []
        
        filteredCandidatures.value.forEach(c => {
            if (decisionMap[c.id]) admisIds.push(c.slug)
            else recalesIds.push(c.slug)
        })

        if (admisIds.length === 0 && recalesIds.length === 0) {
            $toastr.warning('Aucun candidat à enregistrer.')
            isSubmitting.value = false
            return
        }

        const payload = {
            admis: admisIds.join(','),
            recales: recalesIds.join(',')
        }
        await candidatureStore.soumettreAdmission(payload)
        $toastr.success('Les admissions ont été mises à jour avec succès.')
        refreshData()
    } catch (e) {
        $toastr.error('Erreur lors de la mise à jour des admissions.')
    } finally {
        isSubmitting.value = false
    }
}

onMounted(() => {
  refreshData()
  filiereStore.fetchFilieres()
  if (!parametreStore.parametres?.length) {
    parametreStore.fetchParametres()
  }
})
</script>