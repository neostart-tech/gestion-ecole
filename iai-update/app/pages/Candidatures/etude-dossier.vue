<template>
  <div class="min-h-screen bg-white dark:bg-gray-950 p-4 sm:p-8 transition-colors">
    <!-- Header Intégré & Professionnel -->
    <div class="mb-10">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <!-- Titre & Info -->
        <div>
          <div class="flex items-center gap-3 mb-1">
            <div class="w-2 h-8 bg-purple-600 rounded-full"></div>
            <h1 class="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Étude des Dossiers</h1>
          </div>
          <p class="text-sm text-gray-500 font-medium ml-5">Gestion centralisée et validation des candidatures entrantes</p>
        </div>

        <!-- Statistiques discrètes -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
           <div class="px-3 py-1.5 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center gap-2 whitespace-nowrap">
              <span class="w-2 h-2 rounded-full bg-blue-500"></span>
              <span class="text-[11px] font-black uppercase text-gray-500">{{ candidatureStore.candidatures.length }} TOTAL</span>
           </div>
           <div class="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800 flex items-center gap-2 whitespace-nowrap">
              <span class="w-2 h-2 rounded-full bg-green-500"></span>
              <span class="text-[11px] font-black uppercase text-green-700 dark:text-green-400">{{ candidatureStore.candidatures.filter(c => c.dossier_valide).length }} VALIDÉS</span>
           </div>
           <div class="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800 flex items-center gap-2 whitespace-nowrap">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              <span class="text-[11px] font-black uppercase text-amber-700 dark:text-amber-400">{{ candidatureStore.candidatures.filter(c => c.rectification_expected).length }} ATTENTE</span>
           </div>
        </div>
      </div>

      <!-- Barre d'outils flottante -->
      <div class="mt-8 p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl flex flex-col md:flex-row items-center gap-3">
        <div class="relative flex-1 w-full">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un candidat..."
            class="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
          />
          <svg class="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto">
          <select v-model="filterFiliere" class="flex-1 md:w-48 px-3 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-purple-500">
            <option value="">Toutes les filières</option>
            <option v-for="f in filiereStore.filieres" :key="f.id" :value="f.id">{{ f.nom }}</option>
          </select>

          <select v-model="filterStatut" class="flex-1 md:w-48 px-3 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-purple-500">
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="valide">Validés</option>
            <option value="rejete">Rejetés</option>
            <option value="rectification">Rectification</option>
          </select>

          <button @click="refreshData" class="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-purple-600 rounded-xl shadow-sm transition-all">
            <svg class="w-5 h-5" :class="{ 'animate-spin': isRefreshing }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Table Épurée (Visible sur Desktop) -->
    <div class="hidden md:block bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-800">
              <th class="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.1em]">Candidat</th>
              <th class="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] hidden lg:table-cell">Choix Académique</th>
              <th class="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.1em]">Statut Dossier</th>
              <th class="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] hidden xl:table-cell">Date</th>
              <th class="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="c in filteredCandidatures" :key="c.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-700 dark:text-purple-400 font-black text-xs">
                    {{ c.nom?.charAt(0) }}{{ c.prenom?.charAt(0) }}
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-gray-900 dark:text-white leading-tight">{{ c.nom }} {{ c.prenom }}</h4>
                    <p class="text-[11px] text-gray-500 font-medium">{{ c.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 hidden lg:table-cell">
                <p class="text-sm text-gray-700 dark:text-gray-300 font-semibold">{{ c.filiere?.nom }}</p>
                <p class="text-[10px] text-gray-400 uppercase font-black tracking-wider">{{ c.niveau?.nom || c.niveau?.libelle }}</p>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full" :class="getStatutDotClass(c)"></div>
                  <span class="text-xs font-bold text-gray-700 dark:text-gray-300">{{ getStatutLabel(c) }}</span>
                </div>
              </td>
              <td class="px-6 py-4 hidden xl:table-cell">
                <p class="text-xs text-gray-400 font-medium whitespace-nowrap">{{ formatDate(c.created_at) }}</p>
              </td>
              <td class="px-6 py-4 text-right">
                <NuxtLink 
                  :to="`/candidatures/${c.slug || c.id}`"
                  class="inline-flex items-center px-4 py-1.5 text-[11px] font-black text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50 rounded-lg hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all uppercase tracking-tighter"
                >
                  Ouvrir
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Vue en Cartes (Visible sur Mobile) -->
    <div class="md:hidden space-y-4">
      <div v-for="c in filteredCandidatures" :key="c.id" 
        class="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-700 dark:text-purple-400 font-black text-sm">
            {{ c.nom?.charAt(0) }}{{ c.prenom?.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-bold text-gray-900 dark:text-white truncate uppercase">{{ c.nom }} {{ c.prenom }}</h4>
            <p class="text-xs text-gray-500 truncate">{{ c.email }}</p>
          </div>
          <span :class="getStatutBadgeClass(c)" class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase">
            {{ getStatutLabel(c) }}
          </span>
        </div>
        
        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50 dark:border-gray-800 mb-4">
          <div>
            <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Filière</p>
            <p class="text-xs font-bold text-gray-700 dark:text-gray-300 leading-tight line-clamp-1">{{ c.filiere?.nom }}</p>
          </div>
          <div>
            <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Niveau</p>
            <p class="text-xs font-bold text-purple-600 dark:text-purple-400">{{ c.niveau?.nom || c.niveau?.libelle }}</p>
          </div>
        </div>

        <NuxtLink 
          :to="`/candidatures/${c.slug || c.id}`"
          class="block w-full text-center py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-black rounded-xl hover:bg-purple-600 hover:text-white transition-all uppercase tracking-widest border border-gray-100 dark:border-gray-700"
        >
          Étudier le dossier
        </NuxtLink>
      </div>
    </div>

    <!-- Vide -->
    <div v-if="filteredCandidatures.length === 0" class="p-16 text-center text-gray-400">
        <p class="text-sm font-medium">Aucun résultat trouvé pour votre recherche.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCandidatureStore } from '~~/stores/candidature'
import { useFiliereStore } from '~~/stores/filiere'
import { useNiveauStore } from '~~/stores/niveau'

const candidatureStore = useCandidatureStore()
const filiereStore = useFiliereStore()
const niveauStore = useNiveauStore()

const searchQuery = ref('')
const filterFiliere = ref('')
const filterStatut = ref('')
const isRefreshing = ref(false)

const filteredCandidatures = computed(() => {
  let list = candidatureStore.candidatures || []
  if (filterFiliere.value) list = list.filter(c => c.filiere_id == filterFiliere.value)
  if (filterStatut.value) {
    switch (filterStatut.value) {
      case 'en_attente': list = list.filter(c => !c.dossier_valide && !c.motif && !c.rectification_expected); break
      case 'valide': list = list.filter(c => c.dossier_valide); break
      case 'rejete': list = list.filter(c => c.motif && !c.rectification_expected); break
      case 'rectification': list = list.filter(c => c.rectification_expected); break
    }
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(c => c.nom?.toLowerCase().includes(q) || c.prenom?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.tel?.includes(q))
  }
  return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const getStatutLabel = (c) => {
  if (c.dossier_valide) return 'Validé'
  if (c.rectification_expected) return 'Rectification'
  if (c.motif) return 'Rejeté'
  return 'En attente'
}

const getStatutDotClass = (c) => {
  if (c.dossier_valide) return 'bg-green-500'
  if (c.rectification_expected) return 'bg-amber-500'
  if (c.motif) return 'bg-red-500'
  return 'bg-blue-500'
}

const getStatutBadgeClass = (c) => {
  if (c.dossier_valide) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  if (c.rectification_expected) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
  if (c.motif) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
}

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

const refreshData = async () => {
  isRefreshing.value = true
  try { await candidatureStore.fetchCandidatures() } 
  finally { isRefreshing.value = false }
}

onMounted(() => {
  refreshData()
  filiereStore.fetchFilieres()
  niveauStore.fetchNiveaux()
})
</script>