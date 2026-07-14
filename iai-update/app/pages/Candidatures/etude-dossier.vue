<template>
  <div class="min-h-screen bg-[#f3f3f8] dark:bg-[#08080f] font-sans transition-colors duration-500 relative">
    
    <!-- Fond d'ambiance violet -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#7F45FD]/15 dark:bg-[#7F45FD]/25 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
      <div class="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#7F45FD]/15 dark:bg-[#7F45FD]/25 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjN0Y0NUZEIiBmaWxsLW9wYWNpdHk9IjAuMDgiPjxwYXRoIGQ9Ik0zNiAzNHYtNGgxdjRoLTF6bTAgM3YtMWgxdjFoLTF6bTAgNHYtMWgxdjFoLTF6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      
      <!-- Header Intégré & Professionnel -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <div class="w-1.5 h-8 bg-[#7F45FD] rounded-full"></div>
            <h1 class="text-3xl font-black text-[#1a1a2a] dark:text-[#fafafe] tracking-tight">Étude des Dossiers</h1>
          </div>
          <p class="text-sm text-[#8a8a9a] font-medium ml-4">Gestion centralisée et validation des candidatures entrantes</p>
        </div>

        <button
          @click="exportExcel"
          :disabled="candidatureStore.exportEnCours"
          class="inline-flex items-center gap-2 px-5 py-3 bg-[#7F45FD] hover:bg-[#6a35e8] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 hover:shadow-[0_8px_25px_rgba(127,69,253,0.3)] disabled:opacity-60"
        >
          <svg v-if="!candidatureStore.exportEnCours" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2-8H8a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2z" /></svg>
          <span v-else class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {{ candidatureStore.exportEnCours ? 'Export en cours...' : 'Exporter en Excel' }}
        </button>
      </div>

      <!-- Onglets Filtres (Segmented Control Premium) -->
      <div class="bg-[#ededf4] dark:bg-[#151525] p-1.5 rounded-2xl flex flex-wrap lg:flex-nowrap gap-1 border border-[#e8e8f0]/40 dark:border-[#1a1a2a]/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
        <button 
          @click="filterStatut = ''"
          :class="[
            filterStatut === '' 
              ? 'bg-white dark:bg-[#202035] text-[#7F45FD] dark:text-[#a882ff] shadow-md border-transparent scale-[1.02]' 
              : 'text-[#8a8a9a] dark:text-[#888] hover:text-[#1a1a2a] dark:hover:text-[#fafafe] border-transparent'
          ]"
          class="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 transform active:scale-95"
        >
          <span class="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shrink-0"></span>
          <span>Total ({{ candidaturesVisibles.length }})</span>
        </button>

        <button 
          @click="filterStatut = 'valide'"
          :class="[
            filterStatut === 'valide' 
              ? 'bg-white dark:bg-[#202035] text-[#7F45FD] dark:text-[#a882ff] shadow-md border-transparent scale-[1.02]' 
              : 'text-[#8a8a9a] dark:text-[#888] hover:text-[#1a1a2a] dark:hover:text-[#fafafe] border-transparent'
          ]"
          class="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 transform active:scale-95"
        >
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
          <span>Validés ({{ candidaturesVisibles.filter(c => c.dossier_valide).length }})</span>
        </button>

        <button
          v-if="afficherOngletEnEtude"
          @click="filterStatut = 'en_attente'"
          :class="[
            filterStatut === 'en_attente'
              ? 'bg-white dark:bg-[#202035] text-[#7F45FD] dark:text-[#a882ff] shadow-md border-transparent scale-[1.02]'
              : 'text-[#8a8a9a] dark:text-[#888] hover:text-[#1a1a2a] dark:hover:text-[#fafafe] border-transparent'
          ]"
          class="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 transform active:scale-95"
        >
          <span class="w-2.5 h-2.5 rounded-full bg-[#7F45FD] shrink-0"></span>
          <span>En étude ({{ candidaturesVisibles.filter(c => !c.dossier_valide && !c.motif && !c.rectification_expected && !c.transmis_academie).length }})</span>
        </button>

        <button
          v-if="afficherOngletAcademie"
          @click="filterStatut = 'academie'"
          :class="[
            filterStatut === 'academie'
              ? 'bg-white dark:bg-[#202035] text-[#7F45FD] dark:text-[#a882ff] shadow-md border-transparent scale-[1.02]'
              : 'text-[#8a8a9a] dark:text-[#888] hover:text-[#1a1a2a] dark:hover:text-[#fafafe] border-transparent'
          ]"
          class="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 transform active:scale-95"
        >
          <span class="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
          <span>À l'académie ({{ candidaturesVisibles.filter(c => !c.dossier_valide && !c.motif && !c.rectification_expected && c.transmis_academie).length }})</span>
        </button>

        <button
          @click="filterStatut = 'rectification'"
          :class="[
            filterStatut === 'rectification' 
              ? 'bg-white dark:bg-[#202035] text-[#7F45FD] dark:text-[#a882ff] shadow-md border-transparent scale-[1.02]' 
              : 'text-[#8a8a9a] dark:text-[#888] hover:text-[#1a1a2a] dark:hover:text-[#fafafe] border-transparent'
          ]"
          class="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 transform active:scale-95"
        >
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
          <span>A corriger ({{ candidaturesVisibles.filter(c => c.rectification_expected).length }})</span>
        </button>

        <button 
          @click="filterStatut = 'rejete'"
          :class="[
            filterStatut === 'rejete' 
              ? 'bg-white dark:bg-[#202035] text-[#7F45FD] dark:text-[#a882ff] shadow-md border-transparent scale-[1.02]' 
              : 'text-[#8a8a9a] dark:text-[#888] hover:text-[#1a1a2a] dark:hover:text-[#fafafe] border-transparent'
          ]"
          class="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 transform active:scale-95"
        >
          <span class="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
          <span>Rejetés ({{ candidaturesVisibles.filter(c => c.motif && !c.rectification_expected).length }})</span>
        </button>
      </div>

      <!-- Barre d'outils flottante -->
      <div class="bg-white dark:bg-[#11111e] border border-[#e8e8f0] dark:border-[#1a1a2a] rounded-2xl p-4 lg:p-5 shadow-[0_8px_30px_rgba(127,69,253,0.04)]">
        
        <div class="flex flex-col xl:flex-row gap-4">
          <!-- Recherche et Colonnes -->
          <div class="flex gap-3 flex-1">
            <div class="relative flex-1">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher un candidat..."
                class="w-full pl-11 pr-4 py-3 text-sm bg-[#fafafe] dark:bg-[#0a0a12] border border-[#e8e8f0] dark:border-[#1a1a2a] rounded-xl focus:ring-2 focus:ring-[#7F45FD]/20 focus:border-[#7F45FD] outline-none transition-all text-[#1a1a2a] dark:text-white placeholder-[#8a8a9a]"
              />
              <svg class="w-5 h-5 absolute left-4 top-3 text-[#8a8a9a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- Sélecteur de colonnes -->
            <Menu as="div" class="relative shrink-0 hidden sm:block">
              <MenuButton class="flex items-center justify-center gap-2 h-full px-4 py-3 bg-[#fafafe] dark:bg-[#0a0a12] border border-[#e8e8f0] dark:border-[#1a1a2a] rounded-xl hover:bg-[#e8e8f0] dark:hover:bg-[#1a1a2a] transition-all text-[#1a1a2a] dark:text-[#fafafe] focus:outline-none">
                <svg class="w-4 h-4 text-[#8a8a9a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                <span class="text-sm font-medium">Colonnes</span>
              </MenuButton>
              <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
                <MenuItems class="absolute right-0 mt-2 w-56 p-3 rounded-xl bg-white dark:bg-[#11111e] border border-[#e8e8f0] dark:border-[#1a1a2a] z-30 shadow-[0_8px_30px_rgba(0,0,0,0.1)] focus:outline-none">
                  <p class="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a8a9a] mb-3 px-1">Colonnes affichées</p>
                  <div v-for="col in cols" :key="col.field" class="flex items-center gap-3 py-2 px-2 hover:bg-[#fafafe] dark:hover:bg-[#1a1a2a] rounded-lg cursor-pointer">
                    <input type="checkbox" :id="col.field" v-model="col.hide" :true-value="false" :false-value="true" class="rounded border-[#e8e8f0] text-[#7F45FD] focus:ring-[#7F45FD] cursor-pointer" />
                    <label :for="col.field" class="text-sm text-[#1a1a2a] dark:text-[#fafafe] font-medium cursor-pointer select-none flex-1">{{ col.title }}</label>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>

          <!-- Filtres (Filières, Niveaux et Actualiser) -->
          <div class="grid grid-cols-2 sm:grid-cols-3 xl:flex xl:flex-nowrap gap-3 shrink-0">
            <select v-model="filterFiliere" class="w-full px-4 py-3 text-sm bg-[#fafafe] dark:bg-[#0a0a12] border border-[#e8e8f0] dark:border-[#1a1a2a] rounded-xl outline-none focus:border-[#7F45FD] text-[#1a1a2a] dark:text-white">
              <option value="">Filières</option>
              <option v-for="f in filiereStore.filieres" :key="f.id" :value="f.id">{{ f.nom }}</option>
            </select>

            <select v-model="filterNiveau" class="w-full px-4 py-3 text-sm bg-[#fafafe] dark:bg-[#0a0a12] border border-[#e8e8f0] dark:border-[#1a1a2a] rounded-xl outline-none focus:border-[#7F45FD] text-[#1a1a2a] dark:text-white">
              <option value="">Niveaux</option>
              <option v-for="n in niveauStore.niveaux" :key="n.id" :value="n.id">{{ n.nom || n.libelle }}</option>
            </select>

            <button @click="refreshData" class="w-full sm:w-auto flex items-center justify-center p-3 bg-[#fafafe] dark:bg-[#0a0a12] border border-[#e8e8f0] dark:border-[#1a1a2a] text-[#8a8a9a] hover:text-[#7F45FD] rounded-xl shadow-sm transition-all">
              <svg class="w-5 h-5" :class="{ 'animate-spin': isRefreshing }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- SKELETON LOADER -->
      <div v-if="isLoading" class="space-y-4">
        <div v-for="i in 5" :key="i" class="bg-white dark:bg-[#11111e] border border-[#e8e8f0] dark:border-[#1a1a2a] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-pulse shadow-sm">
          <div class="flex items-center gap-4 flex-1">
            <div class="w-12 h-12 bg-gray-200 dark:bg-gray-800/50 rounded-xl"></div>
            <div class="space-y-3">
              <div class="h-4 bg-gray-200 dark:bg-gray-800/50 rounded w-48"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-800/50 rounded w-32"></div>
            </div>
          </div>
          <div class="hidden lg:flex flex-col gap-3 flex-1">
            <div class="h-3 bg-gray-200 dark:bg-gray-800/50 rounded w-32"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-800/50 rounded w-16"></div>
          </div>
          <div class="w-24 h-6 bg-gray-200 dark:bg-gray-800/50 rounded-xl"></div>
          <div class="flex gap-2 shrink-0">
            <div class="w-20 h-10 bg-gray-200 dark:bg-gray-800/50 rounded-xl"></div>
            <div class="w-24 h-10 bg-gray-200 dark:bg-gray-800/50 rounded-xl"></div>
          </div>
        </div>
      </div>

      <!-- VUE DATATABLE (Visible sur grands écrans) -->
      <div v-else-if="filteredCandidatures.length > 0" class="bg-white dark:bg-[#11111e] rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a] shadow-[0_8px_30px_rgba(127,69,253,0.04)] overflow-hidden p-2 sm:p-4 lg:p-6">
        <vue3-datatable
          :rows="filteredCandidatures"
          :columns="visibleColumns"
          :loading="isLoading"
          :hasCheckbox="false"
          skin="bh-table-hover"
          class="elite-table-v2"
          :pageSize="10"
        >
          <!-- Slot Candidat -->
          <template #candidat="data">
              <div class="flex items-center gap-4 py-1">
                <div class="w-10 h-10 rounded-xl bg-[#7F45FD]/10 flex items-center justify-center text-[#7F45FD] font-black text-xs shrink-0 relative overflow-hidden">
                    {{ data.value.nom?.charAt(0) }}{{ data.value.prenom?.charAt(0) }}
                    <img v-if="data.value.album?.photo" :src="getFullUrl(data.value.album.photo)" class="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div class="flex flex-col min-w-0">
                    <span class="text-sm font-bold text-[#1a1a2a] dark:text-[#fafafe] truncate uppercase leading-tight">{{ data.value.nom }} <span class="text-[#7F45FD]">{{ data.value.prenom }}</span></span>
                    <span class="text-xs text-[#8a8a9a] truncate font-medium mt-0.5">{{ data.value.email }}</span>
                </div>
              </div>
          </template>

          <!-- Slot Filière -->
          <template #filiere.nom="data">
              <span class="text-xs font-bold text-[#1a1a2a] dark:text-[#fafafe] truncate">
                  {{ data.value.filiere?.nom || '—' }}
              </span>
          </template>

          <!-- Slot Niveau -->
          <template #niveau.libelle="data">
              <span class="text-xs font-bold text-[#7F45FD] whitespace-nowrap">
                  {{ data.value.niveau?.nom || data.value.niveau?.libelle || '—' }}
              </span>
          </template>

          <!-- Slot Statut -->
          <template #statut="data">
              <span :class="getStatutBadgeClass(data.value)" class="px-3 py-1.5 rounded-xl border text-[9px] font-bold uppercase tracking-[0.1em]">
                {{ getStatutLabel(data.value) }}
              </span>
          </template>

          <!-- Slot Actions -->
          <template #actions="data">
              <div class="flex items-center justify-end gap-2">
                <NuxtLink 
                  :to="`/candidatures/modifier-${data.value.slug || data.value.id}`"
                  class="px-3 py-2 bg-[#fafafe] dark:bg-[#0a0a12] text-[#1a1a2a] dark:text-[#fafafe] text-[10px] font-bold rounded-lg hover:bg-[#e8e8f0] dark:hover:bg-[#1a1a2a] transition-all uppercase tracking-widest border border-[#e8e8f0] dark:border-[#1a1a2a]"
                >
                  Éditer
                </NuxtLink>
                <NuxtLink 
                  :to="`/candidatures/${data.value.slug || data.value.id}`"
                  class="px-4 py-2 bg-[#7F45FD] text-white text-[10px] font-bold rounded-lg hover:bg-[#6a35e8] transition-all uppercase tracking-widest flex items-center justify-center gap-1.5"
                >
                  Ouvrir
                </NuxtLink>
              </div>
          </template>
        </vue3-datatable>
      </div>

      <!-- Vide -->
      <div v-else class="py-20 text-center bg-white dark:bg-[#11111e] rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a]">
          <div class="w-16 h-16 bg-[#7F45FD]/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-[#7F45FD]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-[#1a1a2a] dark:text-[#fafafe] mb-2">Aucun dossier</h3>
          <p class="text-sm font-medium text-[#8a8a9a]">Aucun résultat trouvé pour votre recherche.</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCandidatureStore } from '~~/stores/candidature'
import { useFiliereStore } from '~~/stores/filiere'
import { useNiveauStore } from '~~/stores/niveau'
import { getStorageBaseUrl } from '~/utils/storageUrl'
import Vue3Datatable from '@bhplugin/vue3-datatable'
import { Menu, MenuButton, MenuItems } from '@headlessui/vue'

const candidatureStore = useCandidatureStore()
const filiereStore = useFiliereStore()
const niveauStore = useNiveauStore()
const { $toastr } = useNuxtApp()

// Chacun ne doit voir/compter que les dossiers relevant de son rôle : le chargé
// de la clientèle ne doit plus voir les dossiers déjà transmis à l'académie (ce
// n'est plus son ressort), et l'académie ne doit voir que les dossiers qui lui
// ont été transmis (pas ceux encore à l'étude côté chargé de la clientèle). Les
// comptes à accès total (admin, direction, informaticien) voient tout.
const rolesAcademie = ['directeur-academique', 'logiticien-academique']
const rolesChargeClientele = ['charge-de-la-clientele']
const rolesAccesTotal = ['admin', 'directeur-general', 'directeur-general-adjoint', 'informaticien']

const userRoleSlugs = computed(() => {
  if (!process.client) return []
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const roles = user?.roles || []
  return roles.map((role) => role.slug)
})

const aAccesTotal = computed(() => userRoleSlugs.value.some((slug) => rolesAccesTotal.includes(slug)))
const estAcademie = computed(() => userRoleSlugs.value.some((slug) => rolesAcademie.includes(slug)))
const estChargeClientele = computed(() => userRoleSlugs.value.some((slug) => rolesChargeClientele.includes(slug)))

const candidaturesVisibles = computed(() => {
  const toutes = candidatureStore.candidatures || []
  if (aAccesTotal.value || (estAcademie.value && estChargeClientele.value)) return toutes
  if (estAcademie.value) return toutes.filter((c) => c.transmis_academie)
  if (estChargeClientele.value) return toutes.filter((c) => !c.transmis_academie)
  return toutes
})

// L'onglet "En étude" (dossiers pas encore transmis) n'a de sens que pour le
// chargé de la clientèle ; "À l'académie" n'a de sens que pour l'académie.
// On les masque pour l'autre rôle plutôt que d'afficher un compteur à zéro.
const afficherOngletEnEtude = computed(() => aAccesTotal.value || estChargeClientele.value || !estAcademie.value)
const afficherOngletAcademie = computed(() => aAccesTotal.value || estAcademie.value || !estChargeClientele.value)

const exportExcel = async () => {
  try {
    await candidatureStore.exportEtudeDossierExcel()
  } catch (error) {
    $toastr.error(candidatureStore.error || "Erreur lors de l'export Excel.")
  }
}

const searchQuery = ref('')
const filterFiliere = ref('')
const filterNiveau = ref('')
const filterStatut = ref('')
const isRefreshing = ref(false)
const isLoading = ref(true)

// Config des colonnes pour Vue3Datatable
const cols = ref([
  { field: 'candidat', title: 'Candidat', hide: false },
  { field: 'filiere.nom', title: 'Filière', hide: false },
  { field: 'niveau.libelle', title: 'Niveau', hide: false },
  { field: 'statut', title: 'Statut Dossier', hide: false },
  { field: 'actions', title: 'Action', hide: false, sort: false, headerClass: 'justify-end', cellClass: 'justify-end' },
])

const visibleColumns = computed(() => cols.value.filter(col => !col.hide))

const filteredCandidatures = computed(() => {
  let list = candidaturesVisibles.value
  if (filterFiliere.value) list = list.filter(c => c.filiere_id == filterFiliere.value || c.filiere?.id == filterFiliere.value)
  if (filterNiveau.value) list = list.filter(c => c.niveau_id == filterNiveau.value || c.niveau?.id == filterNiveau.value)
  if (filterStatut.value) {
    switch (filterStatut.value) {
      case 'en_attente': list = list.filter(c => !c.dossier_valide && !c.motif && !c.rectification_expected && !c.transmis_academie); break
      case 'academie': list = list.filter(c => !c.dossier_valide && !c.motif && !c.rectification_expected && c.transmis_academie); break
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
  if (c.rectification_expected) return 'Correction'
  if (c.motif) return 'Rejeté'
  if (c.transmis_academie) return "À l'académie"
  return 'En étude'
}

const getStatutBadgeClass = (c) => {
  if (c.dossier_valide) return 'border-emerald-600/30 text-emerald-600 bg-emerald-600/5'
  if (c.rectification_expected) return 'border-amber-600/30 text-amber-600 bg-amber-600/5'
  if (c.motif) return 'border-rose-600/30 text-rose-600 bg-rose-600/5'
  if (c.transmis_academie) return 'border-blue-600/30 text-blue-600 bg-blue-600/5'
  return 'border-[#7F45FD]/30 text-[#7F45FD] bg-[#7F45FD]/10'
}

const getFullUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${getStorageBaseUrl()}/storage/${path}`
}

const refreshData = async () => {
  isRefreshing.value = true
  try { await candidatureStore.fetchCandidatures() } 
  finally { isRefreshing.value = false }
}

onMounted(async () => {
  isLoading.value = true
  await Promise.all([
    candidatureStore.fetchCandidatures(),
    filiereStore.fetchFilieres(),
    niveauStore.fetchNiveaux()
  ])
  isLoading.value = false
})
</script>

<style scoped>
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
/*
 * Ces règles ciblent .dark, qui est posé sur <html>, en dehors de l'arbre de
 * ce composant. Un <style scoped> compile ".dark :deep(.foo)" en
 * ".dark[data-v-xxxxx] .foo" (l'attribut de scope se colle sur .dark) — <html>
 * n'ayant jamais cet attribut, la règle ne matchait jamais et le hover
 * restait toujours clair, même en mode sombre. D'où ce bloc global, où .dark
 * n'a pas besoin d'être scopé puisqu'il n'y a pas de barrière de composant à
 * traverser ici.
 */
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