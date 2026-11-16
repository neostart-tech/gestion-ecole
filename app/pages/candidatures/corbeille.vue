<template>
  <div class="min-h-screen bg-[#f3f3f8] dark:bg-[#08080f] font-sans transition-colors duration-500 relative">
    
    <!-- Fond d'ambiance violet -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#7F45FD]/15 dark:bg-[#7F45FD]/25 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
      <div class="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-rose-500/10 dark:bg-rose-500/20 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjN0Y0NUZEIiBmaWxsLW9wYWNpdHk9IjAuMDgiPjxwYXRoIGQ9Ik0zNiAzNHYtNGgxdjRoLTF6bTAgM3YtMWgxdjFoLTF6bTAgNHYtMWgxdjFoLTF6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
    </div>

    <div class="relative z-10 w-full p-3 sm:p-5 lg:p-8 space-y-5 sm:space-y-8">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-3 mb-1 sm:mb-2">
            <NuxtLink
              to="/candidatures/etude-dossier"
              class="p-2 -ml-2 rounded-xl text-gray-500 hover:text-[#7F45FD] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Retour aux candidatures"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
            </NuxtLink>
            <div class="w-1.5 h-6 sm:h-8 bg-rose-500 rounded-full"></div>
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-black text-[#1a1a2a] dark:text-[#fafafe] tracking-tight">
              Corbeille des Candidatures
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-[#8a8a9a] font-medium ml-4">
            Dossiers supprimés (soft-delete). Vous pouvez les restaurer ou les supprimer définitivement.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <NuxtLink
            to="/candidatures/etude-dossier"
            class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-[#151525] hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Retour aux dossiers
          </NuxtLink>
          <button
            @click="chargerCorbeille"
            :disabled="isLoading"
            class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#7F45FD] hover:bg-[#6a35e8] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm disabled:opacity-60"
          >
            <svg :class="{ 'animate-spin': isLoading }" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>
        </div>
      </div>

      <!-- Barre de recherche & Filtre -->
      <div class="bg-white dark:bg-[#11111e] border border-[#e8e8f0] dark:border-[#1a1a2a] rounded-2xl p-4 shadow-[0_8px_30px_rgba(127,69,253,0.04)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="relative w-full sm:w-96">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher par nom, email, numéro..."
            class="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#fafafe] dark:bg-[#0a0a12] border border-[#e8e8f0] dark:border-[#1a1a2a] rounded-xl focus:ring-2 focus:ring-[#7F45FD]/20 focus:border-[#7F45FD] outline-none transition-all text-[#1a1a2a] dark:text-white placeholder-[#8a8a9a]"
          />
          <svg class="w-4 h-4 absolute left-3.5 top-3 text-[#8a8a9a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div class="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Total corbeille : <span class="text-rose-500 font-black">{{ candidaturesFiltrees.length }}</span> dossier(s)
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="py-16 text-center">
        <div class="w-12 h-12 border-4 border-[#7F45FD] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-sm font-semibold text-gray-500">Chargement de la corbeille...</p>
      </div>

      <!-- Liste des candidatures supprimées -->
      <div v-else-if="candidaturesFiltrees.length > 0" class="space-y-4">
        
        <!-- Barre d'actions groupées Corbeille -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="selectedCorbeille.length > 0 && can('restore-candidature')"
            class="px-5 py-3.5 rounded-2xl bg-white dark:bg-[#11111e] border-2 border-emerald-500/40 shadow-[0_8px_30px_rgba(16,185,129,0.12)] flex flex-wrap items-center justify-between gap-3"
          >
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-emerald-600/30">
                {{ selectedCorbeille.length }}
              </div>
              <div>
                <p class="text-xs sm:text-sm font-bold text-[#1a1a2a] dark:text-[#fafafe]">
                  {{ selectedCorbeille.length }} dossier(s) sélectionné(s)
                </p>
                <p class="text-[11px] text-[#8a8a9a] font-medium">
                  Restauration groupée vers les candidatures actives
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2.5">
              <button
                type="button"
                @click="selectedCorbeille = []"
                class="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                Annuler
              </button>
              <button
                type="button"
                @click="restaurerSelectionGroupee"
                :disabled="isRestoringBulk"
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/30 disabled:opacity-50"
              >
                <svg v-if="!isRestoringBulk" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Restaurer la sélection ({{ selectedCorbeille.length }})</span>
              </button>
            </div>
          </div>
        </Transition>

        <!-- Vue Mobile (Cartes) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
          <div
            v-for="c in candidaturesFiltrees"
            :key="c.id"
            class="bg-white dark:bg-[#11111e] rounded-2xl border border-rose-100 dark:border-rose-950/40 p-4 shadow-sm space-y-3"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <input
                  v-if="can('restore-candidature')"
                  type="checkbox"
                  :checked="isCorbeilleItemSelected(c)"
                  @change="toggleCorbeilleItem(c)"
                  class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer w-4 h-4 shrink-0"
                />
                <div class="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 font-black text-xs flex items-center justify-center shrink-0 overflow-hidden relative">
                  {{ c.nom?.charAt(0) }}{{ c.prenom?.charAt(0) }}
                  <img v-if="c.album?.photo" :src="getFullUrl(c.album.photo)" class="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div>
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase leading-tight">
                    {{ c.nom }} <span class="text-[#7F45FD]">{{ c.prenom }}</span>
                  </h3>
                  <p class="text-xs text-gray-500">{{ c.email }}</p>
                </div>
              </div>
              <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600">
                Supprimé
              </span>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100 dark:border-gray-800">
              <div>
                <span class="text-[10px] font-bold text-gray-400 uppercase">Dossier N°</span>
                <p class="font-mono font-semibold">{{ c.numero_dossier_affiche || '—' }}</p>
              </div>
              <div>
                <span class="text-[10px] font-bold text-gray-400 uppercase">Supprimé le</span>
                <p class="font-medium text-gray-600 dark:text-gray-300">{{ formatDate(c.deleted_at) }}</p>
              </div>
              <div class="col-span-2">
                <span class="text-[10px] font-bold text-gray-400 uppercase">Filière / Niveau</span>
                <p class="font-medium text-gray-800 dark:text-gray-200">
                  {{ c.filiere?.nom || '—' }} • <span class="text-[#7F45FD]">{{ c.niveau?.libelle || c.niveau?.nom || '—' }}</span>
                </p>
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <button
                v-if="can('restore-candidature')"
                @click="restaurer(c)"
                class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all uppercase tracking-wider"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Restaurer
              </button>
              <button
                v-if="can('delete-candidature')"
                @click="supprimerDefinitivement(c)"
                class="px-3 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 hover:bg-rose-600 hover:text-white text-xs font-bold rounded-xl transition-all uppercase tracking-wider border border-rose-200 dark:border-rose-900/40"
                title="Supprimer définitivement"
              >
                Supprimer déf.
              </button>
            </div>
          </div>
        </div>

        <!-- Vue Tableau Desktop -->
        <div class="hidden lg:block bg-white dark:bg-[#11111e] rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a] shadow-sm overflow-hidden">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-[#e8e8f0] dark:border-[#1a1a2a] text-[10px] font-black uppercase tracking-wider text-[#8a8a9a] bg-gray-50/50 dark:bg-[#0d0d18]">
                <th v-if="can('restore-candidature')" class="py-4 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    :checked="isAllCorbeilleSelected"
                    @change="toggleSelectAllCorbeille"
                    class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer w-4 h-4"
                  />
                </th>
                <th class="py-4 px-6">Candidat</th>
                <th class="py-4 px-6">Dossier N°</th>
                <th class="py-4 px-6">Filière & Niveau</th>
                <th class="py-4 px-6">Supprimé le</th>
                <th class="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#e8e8f0] dark:divide-[#1a1a2a] text-xs">
              <tr
                v-for="c in candidaturesFiltrees"
                :key="c.id"
                class="hover:bg-gray-50/70 dark:hover:bg-[#151525] transition-colors"
              >
                <td v-if="can('restore-candidature')" class="py-4 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    :checked="isCorbeilleItemSelected(c)"
                    @change="toggleCorbeilleItem(c)"
                    class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer w-4 h-4"
                  />
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 font-black text-xs flex items-center justify-center shrink-0 overflow-hidden relative">
                      {{ c.nom?.charAt(0) }}{{ c.prenom?.charAt(0) }}
                      <img v-if="c.album?.photo" :src="getFullUrl(c.album.photo)" class="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div>
                      <div class="font-bold text-gray-900 dark:text-white uppercase leading-tight">
                        {{ c.nom }} <span class="text-[#7F45FD]">{{ c.prenom }}</span>
                      </div>
                      <div class="text-gray-500 text-[11px] font-medium">{{ c.email }} • {{ c.tel }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6 font-mono font-semibold text-gray-700 dark:text-gray-300">
                  {{ c.numero_dossier_affiche || '—' }}
                </td>
                <td class="py-4 px-6">
                  <div class="font-bold text-gray-800 dark:text-gray-200">{{ c.filiere?.nom || '—' }}</div>
                  <div class="text-[11px] font-bold text-[#7F45FD]">{{ c.niveau?.libelle || c.niveau?.nom || '—' }}</div>
                </td>
                <td class="py-4 px-6 text-gray-500 font-medium">
                  {{ formatDate(c.deleted_at) }}
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      v-if="can('restore-candidature')"
                      @click="restaurer(c)"
                      class="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Restaurer
                    </button>
                    <button
                      v-if="can('delete-candidature')"
                      @click="supprimerDefinitivement(c)"
                      title="Suppression définitive"
                      class="p-2 text-rose-500 hover:text-white bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-600 dark:hover:bg-rose-600 rounded-xl transition-colors border border-rose-200 dark:border-rose-900/40"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="py-20 text-center bg-white dark:bg-[#11111e] rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a] p-8">
        <div class="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">
          La corbeille est vide
        </h3>
        <p class="text-xs sm:text-sm text-gray-500 mb-6">
          Aucun dossier de candidature n'a été mis en corbeille pour le moment.
        </p>
        <NuxtLink
          to="/candidatures/etude-dossier"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7F45FD] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#6a35e8] transition-all shadow-md"
        >
          Retourner aux candidatures actives
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCandidatureStore } from '~~/stores/candidature'
import { useAccess } from '~/composables/useAccess'
import { getStorageBaseUrl } from '~/utils/storageUrl'
import Swal from 'sweetalert2'

const candidatureStore = useCandidatureStore()
const { can } = useAccess()

const isLoading = ref(true)
const searchQuery = ref('')

const candidaturesFiltrees = computed(() => {
  const list = candidatureStore.corbeilleCandidatures || []
  if (!searchQuery.value) return list
  const q = searchQuery.value.toLowerCase().trim()
  return list.filter((c) => {
    return (
      c.nom?.toLowerCase().includes(q) ||
      c.prenom?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.tel?.includes(q) ||
      c.numero_dossier_affiche?.toLowerCase().includes(q)
    )
  })
})

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getFullUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${getStorageBaseUrl()}/storage/${path}`
}

const chargerCorbeille = async () => {
  isLoading.value = true
  try {
    await candidatureStore.fetchCorbeille()
  } catch (error) {
    Swal.fire({
      title: 'Erreur',
      text: candidatureStore.error || 'Impossible de charger la corbeille.',
      icon: 'error',
    })
  } finally {
    isLoading.value = false
  }
}

const restaurer = async (candidat) => {
  const nom = `${candidat.nom || ''} ${candidat.prenom || ''}`.trim()
  const result = await Swal.fire({
    title: 'Restaurer la candidature ?',
    text: `Le dossier de candidature de ${nom} sera restauré et réapparaîtra parmi les candidatures actives.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, restaurer',
    cancelButtonText: 'Annuler',
    customClass: {
      popup: 'rounded-2xl dark:bg-[#11111e] dark:text-white',
    },
  })

  if (result.isConfirmed) {
    try {
      await candidatureStore.restoreCandidature(candidat.slug || candidat.id)
      Swal.fire({
        title: 'Candidature restaurée',
        text: `Le dossier de ${nom} a été restauré avec succès.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-2xl dark:bg-[#11111e] dark:text-white',
        },
      })
    } catch (err) {
      Swal.fire({
        title: 'Erreur',
        text: err?.response?.data?.message || 'Impossible de restaurer ce dossier.',
        icon: 'error',
        customClass: {
          popup: 'rounded-2xl dark:bg-[#11111e] dark:text-white',
        },
      })
    }
  }
}

const supprimerDefinitivement = async (candidat) => {
  const nom = `${candidat.nom || ''} ${candidat.prenom || ''}`.trim()
  const result = await Swal.fire({
    title: 'Suppression définitive ?',
    text: `Attention : la suppression définitive de la candidature de ${nom} est irréversible. Les données seront définitivement purgées.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, purger définitivement',
    cancelButtonText: 'Annuler',
    customClass: {
      popup: 'rounded-2xl dark:bg-[#11111e] dark:text-white',
    },
  })

  if (result.isConfirmed) {
    try {
      await candidatureStore.forceDeleteCandidature(candidat.slug || candidat.id)
      Swal.fire({
        title: 'Candidature purgée',
        text: `Le dossier de ${nom} a été supprimé définitivement.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-2xl dark:bg-[#11111e] dark:text-white',
        },
      })
    } catch (err) {
      Swal.fire({
        title: 'Erreur',
        text: err?.response?.data?.message || 'Impossible de purger ce dossier.',
        icon: 'error',
        customClass: {
          popup: 'rounded-2xl dark:bg-[#11111e] dark:text-white',
        },
      })
    }
  }
}

const selectedCorbeille = ref([])
const isRestoringBulk = ref(false)

const isCorbeilleItemSelected = (candidat) => {
  return selectedCorbeille.value.some(
    (c) => (c.id && c.id === candidat.id) || (c.slug && c.slug === candidat.slug)
  )
}

const toggleCorbeilleItem = (candidat) => {
  if (isCorbeilleItemSelected(candidat)) {
    selectedCorbeille.value = selectedCorbeille.value.filter(
      (c) => !((c.id && c.id === candidat.id) || (c.slug && c.slug === candidat.slug))
    )
  } else {
    selectedCorbeille.value.push(candidat)
  }
}

const isAllCorbeilleSelected = computed(() => {
  const list = candidaturesFiltrees.value
  return list.length > 0 && selectedCorbeille.value.length === list.length
})

const toggleSelectAllCorbeille = () => {
  if (isAllCorbeilleSelected.value) {
    selectedCorbeille.value = []
  } else {
    selectedCorbeille.value = [...candidaturesFiltrees.value]
  }
}

const restaurerSelectionGroupee = async () => {
  if (selectedCorbeille.value.length === 0) return
  const count = selectedCorbeille.value.length
  const result = await Swal.fire({
    title: `Restaurer ${count} candidature(s) ?`,
    text: `Les ${count} dossiers sélectionnés seront réintégrés parmi les candidatures actives.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText: `Oui, restaurer (${count})`,
    cancelButtonText: 'Annuler',
    customClass: {
      popup: 'rounded-2xl dark:bg-[#11111e] dark:text-white',
    },
  })

  if (result.isConfirmed) {
    isRestoringBulk.value = true
    try {
      const ids = selectedCorbeille.value.map((c) => c.slug || c.id)
      const res = await candidatureStore.bulkRestoreCandidatures(ids)
      Swal.fire({
        title: 'Candidatures restaurées',
        text: res?.message || `${count} candidature(s) ont été restaurées avec succès.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-2xl dark:bg-[#11111e] dark:text-white',
        },
      })
      selectedCorbeille.value = []
      await chargerCorbeille()
    } catch (err) {
      Swal.fire({
        title: 'Erreur',
        text: err?.response?.data?.message || 'Impossible d\'effectuer la restauration groupée.',
        icon: 'error',
        customClass: {
          popup: 'rounded-2xl dark:bg-[#11111e] dark:text-white',
        },
      })
    } finally {
      isRestoringBulk.value = false
    }
  }
}

onMounted(() => {
  chargerCorbeille()
})
</script>
