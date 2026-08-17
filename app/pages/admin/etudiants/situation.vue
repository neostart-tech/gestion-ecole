<!-- pages/admin/etudiants/situation.vue -->

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 lg:p-8 transition-colors">
    <!-- En-tête avec Breadcrumb et actions -->
    <div class="flex flex-col gap-4 mb-6">
      <Breadcrumb
        :items="[
          { label: 'Tableau de bord', to: '/admin/dashboard' },
          { label: 'Gestion des étudiants', to: '/admin/etudiants' },
          { label: 'Situation des étudiants', to: null }
        ]"
        title="Situation des étudiants"
        title-class="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        spacing="mb-0"
      />

      <!-- Boutons d'action -->
      <div class="flex flex-row flex-wrap items-center gap-3 w-full justify-start mt-1">
        <button
          @click="rafraichir"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50"
          :disabled="store.isPageLoading"
        >
          <svg class="w-5 h-5" :class="{ 'animate-spin': store.isPageLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span class="hidden sm:inline">{{ store.isPageLoading ? 'Chargement...' : 'Rafraîchir' }}</span>
        </button>
        
        <Can action="create-negociation">
          <NuxtLink
            to="/admin/negociations/creer-une-negociation"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span class="hidden sm:inline whitespace-nowrap">Créer Échéancier</span>
          </NuxtLink>
        </Can>
        
        <button
          @click="exporterExcel"
          :disabled="store.isExporting"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
        >
          <svg v-if="store.isExporting" class="w-5 h-5 animate-spin" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span class="hidden sm:inline">Exporter</span>
        </button>
      </div>
    </div>

    <!-- Loading initial -->
    <div v-if="store.isPageLoading" class="space-y-6">
      <!-- Skeleton pour le tableau -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div class="space-y-4">
          <div v-for="i in 5" :key="i" class="flex gap-4">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <template v-else>
      <!-- KPIs Grid (Commenté pour le déplacer vers le dashboard financier) -->
      <!-- 
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4 mb-6">
        <div v-for="(kpi, index) in kpis" :key="index"
          class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-300 min-h-[160px]">
          <div class="flex items-center justify-between">
            <div :class="[kpi.bgColor, kpi.iconColor]" class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="kpi.icon" />
              </svg>
            </div>
          </div>
          <div>
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">{{ kpi.label }}</h3>
            <p class="text-xl font-black text-gray-800 dark:text-white mt-1">{{ kpi.value }}</p>
          </div>
          <div class="mt-auto space-y-1.5 pt-3 border-t border-gray-50 dark:border-gray-700">
            <div v-for="(detail, dIdx) in kpi.details" :key="dIdx" class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-xs">
              <span class="text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">{{ detail.label }}</span>
              <span class="font-bold sm:text-right" :class="detail.color">{{ detail.value }}</span>
            </div>
          </div>
        </div>
      </div>
      -->

      <!-- Carte principale avec tableau -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <!-- Barre de filtres et recherche -->
        <div class="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 space-y-4">
          <!-- Ligne 1: Recherche et actions -->
          <div class="flex flex-col md:flex-row gap-3">
            <!-- Recherche -->
            <div class="relative flex-1">
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Rechercher par nom, prénom, matricule, email..."
                class="w-full px-4 py-2 pl-10 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
              />
              <svg class="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Actions groupées -->
            <div class="flex items-center gap-3 shrink-0">
              <!-- Compteur de résultats -->
              <div class="px-3.5 py-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/40 rounded-xl text-sm whitespace-nowrap">
                <span class="font-bold text-indigo-600 dark:text-indigo-400">{{ filteredData.length }}</span>
                <span class="text-gray-600 dark:text-gray-400 ml-1">étudiant(s)</span>
              </div>

              <!-- Sélecteur de colonnes -->
              <client-only>
                <VDropdown placement="bottom-end">
                  <button
                    class="flex items-center gap-2 px-4 py-2 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition-all"
                  >
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span>Colonnes</span>
                    <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M6 9l6 6 6-6" stroke-width="2" stroke-linecap="round" />
                    </svg>
                  </button>

                  <template #popper>
                    <div class="w-56 p-3 rounded-xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1 uppercase tracking-wider">Colonnes affichées</p>
                      <div
                        v-for="col in columns"
                        :key="col.field"
                        class="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          v-model="col.visible"
                          :disabled="col.field === 'actions'"
                          class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span class="text-sm text-gray-700 dark:text-gray-300">
                          {{ col.title }}
                        </span>
                      </div>
                    </div>
                  </template>
                </VDropdown>
              </client-only>
            </div>
          </div>

          <!-- Ligne 2: Grille de 5 filtres déroulants -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <!-- Filtre Filière -->
            <div class="w-full">
              <select
                v-model="store.filtres.filiere_id"
                @change="appliquerFiltres"
                class="w-full px-3.5 py-2 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all truncate"
              >
                <option v-for="opt in store.filtreOptions.filieres" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>

            <!-- Filtre Niveau -->
            <div class="w-full">
              <select
                v-model="store.filtres.niveau_id"
                @change="appliquerFiltres"
                class="w-full px-3.5 py-2 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all truncate"
              >
                <option v-for="opt in store.filtreOptions.niveaux" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>

            <!-- Filtre Mode de Formation -->
            <div class="w-full">
              <select
                v-model="store.filtres.mode_formation"
                @change="appliquerFiltres"
                class="w-full px-3.5 py-2 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all truncate"
              >
                <option v-for="opt in store.filtreOptions.modes" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>

            <!-- Filtre Statut de Paiement -->
            <div class="w-full">
              <select
                v-model="store.filtres.statut"
                @change="appliquerFiltres"
                class="w-full px-3.5 py-2 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all truncate"
              >
                <option v-for="opt in store.filtreOptions.statuts" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>

            <!-- Filtre Statut d'Accès -->
            <div class="w-full">
              <select
                v-model="store.filtres.statut_acces"
                @change="appliquerFiltres"
                class="w-full px-3.5 py-2 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all truncate"
              >
                <option :value="null">Tous les accès</option>
                <option value="actif">Accès actifs</option>
                <option value="bloque">Accès bloqués</option>
                <option value="abandon">Abandons</option>
              </select>
            </div>
          </div>

          <!-- Ligne 3: Filtres actifs (tags) et Bouton de réinitialiser sur sa propre ligne séparée -->
          <div v-if="hasActiveFilters || searchQuery" class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Filtres actifs:</span>
              
              <span v-if="searchQuery" class="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                "{{ searchQuery }}"
                <button @click="searchQuery = ''" class="ml-1 hover:text-indigo-900 dark:hover:text-indigo-100">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
              
              <span v-if="store.filtres.filiere_id" class="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
                <span>Filière: {{ getFiliereLabel(store.filtres.filiere_id) }}</span>
                <button @click="store.filtres.filiere_id = null; appliquerFiltres()" class="hover:text-indigo-900 dark:hover:text-indigo-100">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>

              <span v-if="store.filtres.niveau_id" class="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
                <span>Niveau: {{ getNiveauLabel(store.filtres.niveau_id) }}</span>
                <button @click="store.filtres.niveau_id = null; appliquerFiltres()" class="hover:text-indigo-900 dark:hover:text-indigo-100">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>

              <span v-if="store.filtres.mode_formation" class="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
                <span>Mode: {{ store.filtres.mode_formation === 'en_ligne' ? 'En ligne' : 'Présentiel' }}</span>
                <button @click="store.filtres.mode_formation = null; appliquerFiltres()" class="hover:text-indigo-900 dark:hover:text-indigo-100">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>

              <span v-if="store.filtres.statut" class="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
                <span>Statut: {{ getStatutLabel(store.filtres.statut) }}</span>
                <button @click="store.filtres.statut = null; appliquerFiltres()" class="hover:text-indigo-900 dark:hover:text-indigo-100">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>

              <span v-if="store.filtres.statut_acces" class="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
                <span>Accès: {{ store.filtres.statut_acces === 'bloque' ? 'Accès bloqués' : (store.filtres.statut_acces === 'abandon' ? 'Abandons' : 'Accès actifs') }}</span>
                <button @click="store.filtres.statut_acces = null; appliquerFiltres()" class="hover:text-indigo-900 dark:hover:text-indigo-100">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            </div>

            <!-- Bouton réinitialiser -->
            <button
              @click="reinitialiserFiltres"
              class="px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-medium transition-all inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-2xs"
            >
              <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Réinitialiser les filtres</span>
            </button>
          </div>
        </div>

        <!-- Tableau avec Vue3Datatable -->
        <div class="p-4 sm:p-6">
          <!-- Barre d'actions groupées (Dock Intégré) -->
          <!-- Indicateur de sélection externe -->
          <div v-if="selectedIds.length > 0" class="mb-2 flex items-center gap-2 pl-2 animate-pulse-slow">
            <span class="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              {{ selectedIds.length }} Étudiant(s) sélectionné(s)
            </span>
          </div>

          <Transition
            enter-active-class="transition duration-500 ease-out"
            enter-from-class="opacity-0 -translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-300 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-4"
          >
            <div v-if="selectedIds.length > 0" class="mb-6 flex flex-col md:flex-row items-center gap-4 px-4 py-3 md:px-6 md:py-4 rounded-3xl border border-indigo-100 bg-indigo-50/40 dark:bg-indigo-900/20 dark:border-indigo-800/50 backdrop-blur-md shadow-sm transition-all duration-300">
              <div class="flex items-center justify-between w-full md:w-auto md:gap-8">
                <!-- 
                <div class="flex items-center">
                  <div class="flex-shrink-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full font-black text-lg md:text-xl shadow-lg shadow-indigo-600/30 ring-4 ring-white/30">
                    {{ selectedIds.length }}
                  </div>
                  <div class="ml-3 md:ml-5 flex flex-col justify-center whitespace-nowrap">
                    <span class="text-[10px] leading-none uppercase tracking-[0.25em] font-black text-indigo-600 dark:text-indigo-400 mb-2">Actions Collective</span>
                    <span class="text-sm md:text-lg leading-none font-black text-gray-900 dark:text-white">{{ selectedIds.length }} étudiant(s) sélectionnés</span>
                  </div>
                </div>
                
                <div class="hidden md:block h-10 w-px bg-indigo-200/50 dark:bg-indigo-800/50"></div>
                -->
                
                <div class="md:hidden">
                  <button
                    @click="selectedIds = []"
                    class="p-2 text-gray-400 hover:text-red-500"
                    title="Annuler"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="flex items-center gap-2 w-full md:w-auto justify-center md:justify-start">
                <Can action="update-situation-etudiant">
                  <button
                    @click="bulkAction('actif')"
                    class="flex-1 md:flex-none flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-2.5 rounded-2xl transition-all duration-300 text-[10px] md:text-xs font-black group bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95"
                  >
                    <div class="w-1.5 h-1.5 md:w-2 md:h-2 flex-shrink-0 rounded-full bg-white shadow-[0_0_8px_white] animate-pulse"></div>
                    <span class="tracking-widest">ACTIVER</span>
                  </button>
                </Can>

                <Can action="update-situation-etudiant">
                  <button
                    @click="bulkAction('bloque')"
                    class="flex-1 md:flex-none flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-2.5 rounded-2xl transition-all duration-300 text-[10px] md:text-xs font-black group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-600 active:scale-95 transition-all text-center"
                  >
                    <div class="w-1.5 h-1.5 md:w-2 md:h-2 flex-shrink-0 rounded-full bg-gray-400 group-hover:bg-red-500 transition-colors"></div>
                    <span class="tracking-widest">BLOQUER</span>
                  </button>
                </Can>

                <Can action="create-echeancier">
                  <button
                    @click="bulkCreateEcheanciers"
                    class="flex-1 md:flex-none flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-2.5 rounded-2xl transition-all duration-300 text-[10px] md:text-xs font-black group bg-orange-500 hover:bg-orange-600 text-white shadow-md active:scale-95 text-center"
                    title="Générer les échéanciers pour la sélection"
                  >
                    <Icon name="heroicons:calendar-days" class="w-4 h-4 md:w-5 md:h-5 text-white" />
                    <span class="tracking-widest">GÉNÉRER ÉCHÉANCIERS</span>
                  </button>
                </Can>

                <button
                  @click="openBulkChangeModeModal"
                  class="flex-1 md:flex-none flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-2.5 rounded-2xl transition-all duration-300 text-[10px] md:text-xs font-black group bg-amber-500 hover:bg-amber-600 text-white shadow-md active:scale-95 text-center"
                  title="Changer le mode de formation pour tous les sélectionnés"
                >
                  <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                  <span class="tracking-widest">MODE FORMATION</span>
                </button>
              </div>
              
              <div class="hidden md:flex flex-1"></div>

              <button
                @click="selectedIds = []"
                class="hidden md:flex items-center gap-2 group px-4 py-2 text-gray-400 hover:text-red-500 transition-all font-black text-[10px] uppercase tracking-widest"
              >
                <svg class="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Annuler la sélection</span>
              </button>
            </div>
          </Transition>
          <Vue3Datatable
            :columns="visibleColumns"
            :rows="filteredData"
            :total="filteredData.length"
            :page-size="pageSize"
            :page="currentPage"
            @update:page="currentPage = $event"
            skin="bh-table-striped bh-table-hover"
            class="w-full"
            sortable
            :search="searchQuery"
            @update:search="searchQuery = $event"
            :hasCheckbox="true"
            @rowSelect="onRowSelect"
            :rowClass="getRowClass"
          >
            <!-- Template pour la colonne étudiant -->
            <template #nom_complet="data">
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                  <span>{{ data.value.nom }} {{ data.value.prenom }}</span>
                    <span v-if="data.value.est_bloque || data.value.statut_global === 'bloque'" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100/80 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800/60 shadow-2xs">
                      <svg class="w-3 h-3 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Bloqué</span>
                    </span>
                    <span v-else-if="data.value.est_en_abandon || data.value.statut_global === 'abandon'" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100/80 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 shadow-2xs">
                      <svg class="w-3 h-3 text-purple-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      <span>Abandon</span>
                    </span>
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ data.value.matricule }}
                  </p>
                </div>
            </template>

            <!-- Template pour la colonne filière/niveau -->
            <template #filiere_nom="data">
              <div class="flex flex-col gap-0.5">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ data.value.filiere }}</p>
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ data.value.niveau }}</span>
                  <span
                    :class="[
                      'px-1.5 py-0.5 text-[10px] font-medium rounded-full border',
                      String(data.value.mode_formation).toLowerCase().includes('ligne')
                        ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800'
                        : 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800'
                    ]"
                  >
                    {{ String(data.value.mode_formation).toLowerCase().includes('ligne') ? 'En ligne' : 'Présentiel' }}
                  </span>
                </div>
              </div>
            </template>

            <!-- Template pour les montants -->
            <template #montant_total_formatted="data">
              <div class="flex flex-col justify-center">
                <p class="text-sm font-mono font-bold text-gray-900 dark:text-white">{{ data.value.montant_total_formatted }}</p>
                <div v-if="data.value.frais_negocies && data.value.frais_negocies.bourse" class="flex flex-col gap-0.5 mt-0.5">
                  <span class="text-[10px] text-gray-400 line-through">{{ formatMontant(data.value.frais_negocies.montant_initial) }}</span>
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 w-fit border border-indigo-200 dark:border-indigo-800">
                    Bourse : {{ data.value.frais_negocies.bourse }}{{ data.value.frais_negocies.type_bourse === 'pourcentage' ? '%' : (data.value.frais_negocies.type_bourse === 'montant' || !data.value.frais_negocies.type_bourse ? ' FCFA' : '') }}
                  </span>
                </div>
              </div>
            </template>

            <template #montant_paye_formatted="data">
              <p class="text-sm font-mono text-emerald-600 dark:text-emerald-400">{{ data.value.montant_paye_formatted }}</p>
            </template>

            <template #montant_restant_formatted="data">
              <p class="text-sm font-mono" :class="data.value.montant_restant > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500'">
                {{ data.value.montant_restant_formatted }}
              </p>
            </template>

            <!-- Template pour la progression -->
            <template #progression="data">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium min-w-[40px]" :class="getTauxColor(data.value.progression)">
                  {{ data.value.progression }}%
                </span>
                <div class="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-300"
                    :class="getProgressBarColor(data.value.progression)"
                    :style="{ width: data.value.progression + '%' }"
                  ></div>
                </div>
              </div>
            </template>

            <!-- Template pour le statut -->
            <template #statut_libelle="data">
              <span class="inline-flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full" :class="getStatutDotClass(data.value.statut)"></span>
                <span class="text-xs font-medium" :class="getStatutTextClass(data.value.statut)">
                  {{ data.value.statut_libelle }}
                  <span v-if="data.value.en_retard" class="ml-1 text-red-600 dark:text-red-400">
                    ({{ formatRetard(data.value.jours_retard_max) }})
                  </span>
                </span>
              </span>
            </template>

            <!-- Template pour les actions -->
            <template #actions="data">
              <div class="flex items-center justify-center gap-1">
                <button
                  @click="voirDetails(data.value)"
                  class="flex items-center justify-center w-9 h-9 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-600 hover:text-white rounded-xl transition-all duration-300 group"
                  title="Voir détails"
                >
                  <svg class="w-5 h-5 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>

                <div class="w-px h-6 bg-gray-100 dark:bg-gray-700/50 mx-1"></div>

                <div class="flex items-center gap-0.5">
                  <button
                    @click="ouvrirDossier(data.value)"
                    class="flex items-center justify-center w-8 h-8 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                    title="Ouvrir le dossier (Recouvrement)"
                  >
                    <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                  <button
                    @click="voirEcheances(data.value)"
                    class="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all"
                    title="Détails des Échéances"
                  >
                    <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    @click="openChangeModeModal(data.value)"
                    class="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all"
                    title="Changer le mode de formation"
                  >
                    <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                    </svg>
                  </button>





                  <div class="flex items-center ml-1">
                    <Can action="update-situation-etudiant">
                      <button
                        v-if="data.value.statut_global === 'actif'"
                        @click="toggleBlocage(data.value)"
                        class="flex items-center justify-center w-8 h-8 text-red-500 hover:text-white hover:bg-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg transition-all"
                        title="Bloquer l'accès"
                      >
                        <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </button>
                      <button
                        v-else
                        @click="toggleBlocage(data.value)"
                        class="flex items-center justify-center w-8 h-8 text-emerald-500 hover:text-white hover:bg-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg transition-all"
                        title="Débloquer l'accès"
                      >
                        <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </Can>
                  </div>
                </div>
              </div>
            </template>
          </Vue3Datatable>

          <!-- Pied du tableau avec infos -->
          <div class="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <div>
              Affichage de 
              <span class="font-medium">{{ ((currentPage - 1) * pageSize) + 1 }}</span>
              à
              <span class="font-medium">{{ Math.min(currentPage * pageSize, filteredData.length) }}</span>
              sur
              <span class="font-medium">{{ filteredData.length }}</span>
              étudiants
            </div>

            <!-- Sélecteur de nombre d'éléments par page -->
            <div class="flex items-center gap-2">
              <span>Afficher</span>
              <select
                v-model="pageSize"
                @change="currentPage = 1"
                class="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span>lignes</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal des détails étudiant -->
    <TransitionRoot appear :show="showDetailsModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeDetailsModal">
        <div class="fixed inset-0 bg-black/60" />

        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel class="w-full max-w-4xl rounded-xl bg-white dark:bg-gray-800 p-6 max-h-[90vh] overflow-y-auto">
            <DialogTitle class="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center justify-between">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Détails de l'étudiant</span>
              </div>
              <button @click="closeDetailsModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </DialogTitle>

            <div v-if="selectedEtudiant" class="space-y-6">
              <!-- Informations personnelles -->
              <div>
                <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Informations personnelles</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex items-start gap-2">
                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-[100px]">Matricule:</span>
                    <span class="text-sm text-gray-900 dark:text-white font-mono">{{ selectedEtudiant.matricule }}</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-[100px]">Nom complet:</span>
                    <span class="text-sm text-gray-900 dark:text-white">{{ selectedEtudiant.nom }} {{ selectedEtudiant.prenom }}</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-[100px]">Email:</span>
                    <span class="text-sm text-gray-900 dark:text-white">{{ selectedEtudiant.email || 'Non renseigné' }}</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-[100px]">Téléphone:</span>
                    <span class="text-sm text-gray-900 dark:text-white">{{ selectedEtudiant.telephone || 'Non renseigné' }}</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-[100px]">Date naissance:</span>
                    <span class="text-sm text-gray-900 dark:text-white">{{ selectedEtudiant.date_naissance ? formatDate(selectedEtudiant.date_naissance) : 'Non renseigné' }}</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-[100px]">Lieu naissance:</span>
                    <span class="text-sm text-gray-900 dark:text-white">{{ selectedEtudiant.lieu_naissance || 'Non renseigné' }}</span>
                  </div>
                </div>
              </div>

              <!-- Informations académiques -->
              <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Informations académiques</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex items-start gap-2">
                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-[100px]">Filière:</span>
                    <span class="text-sm text-gray-900 dark:text-white">{{ selectedEtudiant.filiere }}</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-[100px]">Niveau:</span>
                    <span class="text-sm text-gray-900 dark:text-white">{{ selectedEtudiant.niveau }}</span>
                  </div>
                </div>
              </div>

              <!-- Résumé financier -->
              <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Situation financière</h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <p class="text-xs text-gray-500 dark:text-gray-400">À payer</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">{{ selectedEtudiant.montant_total_a_payer_formatted }}</p>
                  </div>
                  <div class="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
                    <p class="text-xs text-emerald-600 dark:text-emerald-400">Payé</p>
                    <p class="text-lg font-bold text-emerald-600 dark:text-emerald-400">{{ selectedEtudiant.montant_paye_formatted }}</p>
                  </div>
                  <div class="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                    <p class="text-xs text-amber-600 dark:text-amber-400">Restant</p>
                    <p class="text-lg font-bold text-amber-600 dark:text-amber-400">{{ selectedEtudiant.montant_restant_formatted }}</p>
                  </div>
                </div>
              </div>

              <!-- Statut -->
             <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
  <div class="flex items-center gap-4 flex-wrap">
    <span class="px-3 py-1.5 text-sm font-medium rounded-full" :class="getStatutClass(selectedEtudiant.statut)">
      {{ selectedEtudiant.statut_libelle }}
    </span>
    <span v-if="selectedEtudiant.est_bloque || selectedEtudiant.statut_global === 'bloque'" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100/80 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800/60 shadow-2xs">
      <svg class="w-3.5 h-3.5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      <span>Bloqué</span>
    </span>
    <span v-else-if="selectedEtudiant.est_en_abandon || selectedEtudiant.statut_global === 'abandon'" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100/80 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 shadow-2xs">
      <svg class="w-3.5 h-3.5 text-purple-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
      <span>Abandon</span>
    </span>
    <span v-if="selectedEtudiant.en_retard" class="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ formatRetard(selectedEtudiant.jours_retard_max) }} de retard
    </span>
    <span v-if="selectedEtudiant.prochaine_echeance" class="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      Prochaine échéance: {{ selectedEtudiant.prochaine_echeance_formatted }}
    </span>
  </div>
</div>

              <!-- Frais négociés -->
              <div v-if="selectedEtudiant.frais_negocies" class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Frais négociés</h3>
                <div class="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p class="text-xs text-indigo-600 dark:text-indigo-400">Montant initial</p>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatMontant(selectedEtudiant.frais_negocies.montant_initial) }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-indigo-600 dark:text-indigo-400">Bourse</p>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedEtudiant.frais_negocies.bourse || 0 }}% ({{ selectedEtudiant.frais_negocies.type_bourse || 'Standard' }})</p>
                    </div>
                    <div>
                      <p class="text-xs text-indigo-600 dark:text-indigo-400">Montant après bourse</p>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatMontant(selectedEtudiant.frais_negocies.montant_apres_bourse) }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Boutons d'action -->
              <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  @click="voirEcheances(selectedEtudiant)"
                  class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Voir les échéances
                </button>

              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal des échéances -->
    <TransitionRoot appear :show="showEcheancesModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeEcheancesModal">
        <div class="fixed inset-0 bg-black/60" />

        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel class="w-full max-w-4xl rounded-xl bg-white dark:bg-gray-800 p-6 max-h-[80vh] overflow-y-auto">
            <DialogTitle class="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center justify-between">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Échéances de {{ selectedEtudiant?.nom }} {{ selectedEtudiant?.prenom }}</span>
              </div>
              <button @click="closeEcheancesModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </DialogTitle>

            <div v-if="selectedEtudiant" class="space-y-4">
              <!-- Tableau des échéances -->
              <table class="w-full">
                <thead class="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Libellé</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Date limite</th>
                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Montant</th>
                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Payé</th>
                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Reste</th>
                    <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">Statut</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                  <tr v-for="echeance in selectedEtudiant.echeances" :key="echeance.libelle" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ echeance.libelle }}</td>
                    <td class="px-4 py-3 text-sm" :class="isDateDepassee(echeance.date_limite) ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'">
                      {{ echeance.date_limite_formatted }}
                    </td>
                    <td class="px-4 py-3 text-sm text-right font-mono text-gray-900 dark:text-white">{{ echeance.montant_formatted }}</td>
                    <td class="px-4 py-3 text-sm text-right font-mono text-emerald-600">{{ echeance.paye_formatted }}</td>
                    <td class="px-4 py-3 text-sm text-right font-mono" :class="echeance.reste > 0 ? 'text-amber-600' : 'text-gray-500'">
                      {{ echeance.reste_formatted }}
                    </td>
                    <td class="px-4 py-3 text-sm text-center">
                      <span class="inline-flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full" :class="getEcheanceStatutClass(echeance)"></span>
                        <span class="text-xs" :class="getEcheanceTextClass(echeance)">
                          {{ getEcheanceStatutLabel(echeance) }}
                        </span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Détails des retards -->
              <div v-if="selectedEtudiant.details_retards && selectedEtudiant.details_retards.length > 0" class="mt-4">
                <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Détails des retards</h4>
                <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <div v-for="retard in selectedEtudiant.details_retards" :key="retard.libelle" class="flex justify-between items-center py-2 border-b border-red-100 dark:border-red-800 last:border-0">
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ retard.libelle }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Date limite: {{ retard.date_limite }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-bold text-red-600 dark:text-red-400">{{ retard.montant_restant_formatted }}</p>
                      <p class="text-xs text-red-500">{{ retard.jours_retard }} jours de retard</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Récapitulatif -->
              <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div class="flex justify-end gap-6">
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Total à payer</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">{{ selectedEtudiant.montant_total_a_payer_formatted }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Total payé</p>
                    <p class="text-lg font-bold text-emerald-600">{{ selectedEtudiant.montant_paye_formatted }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Reste à payer</p>
                    <p class="text-lg font-bold text-amber-600">{{ selectedEtudiant.montant_restant_formatted }}</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal de reçu réutilisable -->
    <RecuPaiement
      v-if="showRecuModal && selectedEtudiant"
      :is-open="showRecuModal"
      :etudiant="selectedEtudiant"
      :operation="{ 
        montant: selectedEtudiant.montant_paye, 
        description: 'Scolarité totale payée', 
        reference: 'SIT-' + selectedEtudiant.matricule,
        date: new Date(),
        mode_paiement: 'Espèce/Banque'
      }"
      :app-name="appName"
      @close="closeRecuModal"
    />

    <!-- Modal Changement de Mode de Formation (Individuel) -->
    <div v-if="showChangeModeModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 dark:border-gray-700 space-y-5">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-gray-700 pb-4">
          <div>
            <h3 class="text-lg font-black text-slate-800 dark:text-white">Changer le Mode de Formation</h3>
            <p class="text-xs text-slate-500 dark:text-gray-400 font-medium mt-0.5">
              {{ changeModeEtudiant?.nom }} {{ changeModeEtudiant?.prenom }}
              <span class="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300">
                {{ changeModeEtudiant?.matricule }}
              </span>
            </p>
          </div>
          <button @click="showChangeModeModal = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <p class="text-sm text-slate-600 dark:text-gray-300">
          Le changement de mode de formation déclenchera un <span class="font-bold text-amber-600 dark:text-amber-400">recalcul automatique</span> des tarifs de scolarité applicables.
        </p>
        <div class="space-y-2">
          <label
            v-for="mode in modesFormation"
            :key="mode.value"
            class="flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all"
            :class="changeModeSelected === mode.value
              ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-900/20 ring-2 ring-amber-500/20'
              : 'border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700/50'"
          >
            <div class="flex items-center gap-3">
              <input type="radio" v-model="changeModeSelected" :value="mode.value" class="w-4 h-4 text-amber-600 focus:ring-amber-500" />
              <div>
                <span class="font-bold text-sm text-slate-800 dark:text-white">{{ mode.label }}</span>
                <p class="text-xs text-slate-400">{{ mode.desc }}</p>
              </div>
            </div>
            <span v-if="changeModeEtudiant?.mode_formation === mode.value" class="text-xs font-semibold px-2 py-0.5 bg-slate-200 dark:bg-gray-700 text-slate-600 dark:text-gray-300 rounded-md">Actuel</span>
          </label>
        </div>
        <div class="flex items-center justify-end gap-3 pt-2">
          <button @click="showChangeModeModal = false" class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 text-sm font-bold hover:bg-slate-100 dark:hover:bg-gray-700 transition-all">Annuler</button>
          <button
            @click="submitChangeMode"
            :disabled="savingChangeMode || changeModeSelected === changeModeEtudiant?.mode_formation"
            class="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="savingChangeMode" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Enregistrer & Recalculer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Changement Groupe (Mode Formation Groupé) -->
    <div v-if="showBulkChangeModeModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 dark:border-gray-700 space-y-5">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-gray-700 pb-4">
          <div>
            <h3 class="text-lg font-black text-slate-800 dark:text-white">Changement Groupé du Mode</h3>
            <p class="text-xs text-slate-500 dark:text-gray-400 font-medium mt-0.5">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold">
                {{ selectedIds.length }} étudiant(s) sélectionné(s)
              </span>
            </p>
          </div>
          <button @click="showBulkChangeModeModal = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <p class="text-sm text-slate-600 dark:text-gray-300">
          Tous les <strong>{{ selectedIds.length }} étudiants</strong> sélectionnés seront mis à jour avec le mode choisi. Les tarifs seront <span class="font-bold text-amber-600 dark:text-amber-400">recalculés automatiquement</span> pour chacun.
        </p>

        <div class="space-y-2">
          <label
            v-for="mode in modesFormation"
            :key="mode.value"
            class="flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all"
            :class="bulkModeSelected === mode.value
              ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-900/20 ring-2 ring-amber-500/20'
              : 'border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700/50'"
          >
            <input type="radio" v-model="bulkModeSelected" :value="mode.value" class="w-4 h-4 text-amber-600 focus:ring-amber-500" />
            <div>
              <span class="font-bold text-sm text-slate-800 dark:text-white">{{ mode.label }}</span>
              <p class="text-xs text-slate-400">{{ mode.desc }}</p>
            </div>
          </label>
        </div>

        <!-- Progress bar pendant le traitement -->
        <div v-if="savingBulkMode" class="space-y-2">
          <div class="flex justify-between text-xs text-slate-500">
            <span>Traitement en cours...</span>
            <span>{{ bulkProgress }}/{{ selectedIds.length }}</span>
          </div>
          <div class="w-full h-2 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              class="h-full bg-amber-500 rounded-full transition-all duration-300"
              :style="{ width: selectedIds.length > 0 ? (bulkProgress / selectedIds.length * 100) + '%' : '0%' }"
            ></div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <button @click="showBulkChangeModeModal = false" :disabled="savingBulkMode" class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 text-sm font-bold hover:bg-slate-100 dark:hover:bg-gray-700 transition-all disabled:opacity-50">Annuler</button>
          <button
            @click="submitBulkChangeMode"
            :disabled="savingBulkMode || !bulkModeSelected"
            class="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="savingBulkMode" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Appliquer à tous ({{ selectedIds.length }})
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Style pour forcer la mise en évidence des lignes sélectionnées */
.bh-table-hover tr.row-selected {
  background-color: rgba(79, 70, 229, 0.05) !important;
}
.dark .bh-table-hover tr.row-selected {
  background-color: rgba(79, 70, 229, 0.1) !important;
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
} from '@headlessui/vue'
import Vue3Datatable from "@bhplugin/vue3-datatable"
import "@bhplugin/vue3-datatable/dist/style.css"
import Breadcrumb from "~/components/Breadcrumb.vue"
import RecuPaiement from "~/components/finance/RecuPaiement.vue"
import { useEtudiantSituationStore } from '~~/stores/etudiant-situation'
import { useParametreStore } from '~~/stores/parametre'
import { useDiagnosticFinancierStore } from '~~/stores/diagnosticFinancier'
import { useDebounce } from '@vueuse/core'
import Swal from 'sweetalert2'
import config from '~~/config'

// Stores
const store = useEtudiantSituationStore()
const parametreStore = useParametreStore()
const diagnosticStore = useDiagnosticFinancierStore()

// États locaux
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
const showDetailsModal = ref(false)
const showEcheancesModal = ref(false)
const showRecuModal = ref(false)
const selectedEtudiant = ref(null)
const selectedIds = ref([]) // IDs des étudiants sélectionnés

// État du modal de changement de mode de formation (individuel)
const showChangeModeModal = ref(false)
const changeModeEtudiant = ref(null)
const changeModeSelected = ref('Présentiel')
const savingChangeMode = ref(false)

// État du modal de changement de mode de formation (groupé)
const showBulkChangeModeModal = ref(false)
const bulkModeSelected = ref('Présentiel')
const savingBulkMode = ref(false)
const bulkProgress = ref(0)
const modesFormation = [
  { value: 'Présentiel', label: 'Présentiel', desc: 'Cours en salle, présence physique requise' },
  { value: 'En ligne',   label: 'En ligne',   desc: 'Cours à distance, 100% online' },
]

// Debounce pour la recherche
const debouncedSearch = useDebounce(searchQuery, 300)

// Configuration des colonnes du tableau avec propriété visible
const columns = ref([
  { field: "nom_complet", title: "Étudiant", width: "200px", sortable: true, visible: true },
  { field: "filiere_nom", title: "Filière / Niveau", width: "180px", sortable: true, visible: true },
  { field: "montant_total_formatted", title: "À payer", width: "120px", class: "text-right", sortable: true, visible: true },
  { field: "montant_paye_formatted", title: "Payé", width: "120px", class: "text-right", sortable: true, visible: true },
  { field: "montant_restant_formatted", title: "Restant", width: "120px", class: "text-right", sortable: true, visible: true },
  { field: "progression", title: "Progression", width: "120px", class: "text-center", sortable: true, visible: true },
  { field: "statut_libelle", title: "Statut", width: "120px", class: "text-center", sortable: true, visible: true },
  { field: "actions", title: "Actions", width: "120px", class: "text-center", sortable: false, visible: true },
])

// Colonnes visibles uniquement
const visibleColumns = computed(() => {
  return columns.value.filter(col => col.visible)
})

// Données filtrées
const filteredData = computed(() => {
  let result = store.etudiantsFiltres

  if (debouncedSearch.value) {
    const search = debouncedSearch.value.toLowerCase().trim()
    result = result.filter(e => 
      e.nom?.toLowerCase().includes(search) ||
      e.prenom?.toLowerCase().includes(search) ||
      e.matricule?.toLowerCase().includes(search) ||
      e.email?.toLowerCase().includes(search)
    )
  }

  return result
})

// Computed - KPIs calculés à partir des données du store
const kpis = computed(() => {
  const stats = store.statistiquesFiltrees
  
  return [
    {
      label: 'Total étudiants',
      value: stats.total,
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      details: [
        { label: 'Soldé', value: stats.par_statut.solde, color: 'text-emerald-600' },
        { label: 'À jour', value: stats.par_statut.en_cours, color: 'text-amber-600' },
        { label: 'En retard', value: stats.par_statut.en_retard, color: 'text-red-600' }
      ]
    },
    {
      label: 'Chiffre d\'Affaires Actifs',
      value: stats.ca_actifs_detail?.total_formatted || formatMontant(stats.montants?.total_paye || 0),
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      details: [
        { label: 'Inscriptions', value: stats.ca_actifs_detail?.inscription_formatted || '0 FCFA', color: 'text-indigo-600' },
        { label: 'Scolarités', value: stats.ca_actifs_detail?.scolarite_formatted || '0 FCFA', color: 'text-emerald-600' }
      ]
    },
    {
      label: 'CA Récupéré (Abandons)',
      value: stats.ca_abandons?.total_formatted || '0 FCFA',
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      bgColor: 'bg-slate-100 dark:bg-slate-700/30',
      iconColor: 'text-slate-600 dark:text-gray-400',
      details: [
        { label: 'Inscriptions', value: stats.ca_abandons?.inscription_formatted || '0 FCFA', color: 'text-indigo-500' },
        { label: 'Scolarités', value: stats.ca_abandons?.scolarite_formatted || '0 FCFA', color: 'text-slate-500' },
        { label: 'Total Non Récupéré', value: stats.ca_abandons?.total_perdu_formatted || '0 FCFA', color: 'text-rose-500' }
      ]
    },
    {
      label: 'Étudiants en retard',
      value: stats.retards.total_etudiants_retard,
      icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
      details: [
        { label: 'Montant impayé', value: formatMontant(stats.retards.montant_total_impaye), color: 'text-red-600' },
        { label: 'Jours retard moy.', value: stats.retards.jours_retard_moyen + 'j', color: 'text-amber-600' }
      ]
    },
    {
      label: 'Accès bloqués',
      value: stats.par_statut?.bloques || 0,
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-500 dark:text-red-400',
      details: [
        { label: 'Restant Actifs', value: formatMontant(stats.montants?.total_restant || 0), color: 'text-amber-600' },
        { label: '% Bloqués', value: stats.total > 0 ? Math.round(((stats.par_statut?.bloques || 0) / stats.total) * 100) + '%' : '0%', color: 'text-red-600' }
      ]
    },
    {
      label: 'Taux de collecte',
      value: stats.montants.total_a_payer > 0 
        ? Math.round((stats.montants.total_paye / stats.montants.total_a_payer) * 100) + '%'
        : '0%',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      progress: stats.montants.total_a_payer > 0 
        ? Math.round((stats.montants.total_paye / stats.montants.total_a_payer) * 100)
        : 0
    }
  ]
})

const hasActiveFilters = computed(() => {
  return store.filtres.filiere_id || store.filtres.niveau_id || store.filtres.statut || store.filtres.mode_formation || store.filtres.statut_acces
})

const appName = computed(() => parametreStore.getAppName || 'Établissement')

const paiementsDeLEtudiant = computed(() => {
  if (!selectedEtudiant.value || !selectedEtudiant.value.paiements) return []
  
  return selectedEtudiant.value.paiements.sort((a, b) => new Date(b.date) - new Date(a.date))
})

// Méthodes
onMounted(async () => {
  await store.loadInitialData()
  await parametreStore.fetchParametres()
})

const appliquerFiltres = () => {
  currentPage.value = 1
}

const reinitialiserFiltres = () => {
  store.resetFiltres()
  searchQuery.value = ''
  currentPage.value = 1
}

const rafraichir = async () => {
  await store.refreshData()
}

const exporterExcel = async () => {
  await store.exporterCSV()
}

const getFiliereLabel = (id) => {
  const filiere = store.filieres.find(f => f.id == id)
  return filiere?.nom || id
}

const getNiveauLabel = (id) => {
  const niveau = store.niveaux.find(n => n.id == id)
  return niveau?.libelle || id
}

const getStatutLabel = (statut) => {
  const labels = {
    solde: 'Soldé',
    en_cours: 'À jour',
    en_retard: 'En retard'
  }
  return labels[statut] || statut
}

const getStatutClass = (statut) => {
  const classes = {
    solde: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    en_cours: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    en_retard: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  }
  return classes[statut] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
}

const getInitials = (etudiant) => {
  if (!etudiant) return '?'
  return ((etudiant.nom?.[0] || '') + (etudiant.prenom?.[0] || '')).toUpperCase()
}

const getTauxColor = (taux) => {
  if (taux >= 80) return 'text-emerald-600 dark:text-emerald-400'
  if (taux >= 50) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

const getProgressBarColor = (taux) => {
  if (taux >= 80) return 'bg-emerald-500'
  if (taux >= 50) return 'bg-amber-500'
  return 'bg-red-500'
}

const getStatutDotClass = (statut) => {
  const classes = {
    solde: 'bg-emerald-500',
    en_cours: 'bg-amber-500',
    en_retard: 'bg-red-500',
    aucun_frais: 'bg-gray-500'
  }
  return classes[statut] || 'bg-gray-500'
}

const getStatutTextClass = (statut) => {
  const classes = {
    solde: 'text-emerald-700 dark:text-emerald-300',
    en_cours: 'text-amber-700 dark:text-amber-300',
    en_retard: 'text-red-700 dark:text-red-300',
    aucun_frais: 'text-gray-700 dark:text-gray-300'
  }
  return classes[statut] || 'text-gray-700 dark:text-gray-300'
}

const formatRetard = (jours) => {
  if (!jours || jours <= 0) return ''
  
  if (jours >= 365) {
    const ans = Math.floor(jours / 365)
    const reste = jours % 365
    const mois = Math.floor(reste / 30)
    if (ans >= 1 && mois > 0) return `${ans} an${ans > 1 ? 's' : ''} ${mois} mois`
    return `${ans} an${ans > 1 ? 's' : ''}`
  }
  
  if (jours >= 30) {
    const mois = Math.floor(jours / 30)
    const reste = jours % 30
    if (mois >= 1 && reste > 0) return `${mois} mois ${reste} j`
    return `${mois} mois`
  }
  
  return `${jours} j`
}

const formatMontant = (montant) => {
  if (montant === undefined || montant === null) return '0 FCFA'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(montant).replace('XOF', 'FCFA')
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const isDateDepassee = (date) => {
  return new Date(date) < new Date()
}

const getEcheanceStatutClass = (echeance) => {
  if (echeance.statut === 'paye') return 'bg-emerald-500'
  if (echeance.statut === 'en_retard') return 'bg-red-500'
  return 'bg-amber-500'
}

const getEcheanceTextClass = (echeance) => {
  if (echeance.statut === 'paye') return 'text-emerald-700 dark:text-emerald-300'
  if (echeance.statut === 'en_retard') return 'text-red-700 dark:text-red-300'
  return 'text-amber-700 dark:text-amber-300'
}

const getEcheanceStatutLabel = (echeance) => {
  if (echeance.statut === 'paye') return 'Payé'
  if (echeance.statut === 'en_retard') return 'En retard'
  if (echeance.statut === 'en_attente') return 'En attente'
  return echeance.statut || 'À jour'
}

const voirDetails = (etudiant) => {
  selectedEtudiant.value = etudiant
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedEtudiant.value = null
}

const voirEcheances = (etudiant) => {
  selectedEtudiant.value = etudiant
  showEcheancesModal.value = true
}

const closeEcheancesModal = () => {
  showEcheancesModal.value = false
  selectedEtudiant.value = null
}

const openRecuModal = (etudiant) => {
  selectedEtudiant.value = etudiant
  showRecuModal.value = true
}

const closeRecuModal = () => {
  showRecuModal.value = false
  selectedEtudiant.value = null
}

const ouvrirDossier = (etudiant) => {
  if (etudiant.statut === 'aucun_frais') {
    useNuxtApp().$toastr.warning("Cet étudiant n'a pas de frais configurés.")
    return
  }

  if (etudiant.slug) {
    navigateTo(`/finance/recouvrement/${etudiant.slug}`)
  } else {
    useNuxtApp().$toastr.error("Identifiant de recouvrement introuvable pour cet étudiant")
  }
}


const toggleBlocage = async (etudiant) => {
  const isCurrentlyBlocked = etudiant.statut_global === 'bloque'
  const nouveauStatut = isCurrentlyBlocked ? 'actif' : 'bloque'
  const actionText = isCurrentlyBlocked ? 'débloquer' : 'bloquer'
  const confirmText = isCurrentlyBlocked ? 'Oui, débloquer' : 'Oui, bloquer'
  
  const result = await Swal.fire({
    title: 'Confirmer l\'action',
    text: `Voulez-vous vraiment ${actionText} cet étudiant ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Annuler',
    confirmButtonColor: isCurrentlyBlocked ? '#10b981' : '#ef4444'
  })

  if (result.isConfirmed) {
    try {
      const response = await axios.put(`/etudiants/situation/${etudiant.id}/statut`, { 
        statut: nouveauStatut 
      }, store.authHeaders())

      if (response.data.success) {
        etudiant.statut_global = nouveauStatut
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: response.data.message,
          timer: 2000,
          showConfirmButton: false
        })
        rafraichir()
      }
    } catch (error) {
      console.error('Erreur mise à jour statut:', error)
      Swal.fire('Erreur', 'Impossible de mettre à jour le statut', 'error')
    }
  }
}

const onRowSelect = (rows) => {
  selectedIds.value = rows.map((r) => r.id)
}

const getRowClass = (row) => {
  if (selectedIds.value.includes(row.id)) {
    return '!bg-indigo-50/50 dark:!bg-indigo-900/10'
  }
  return ''
}

const bulkAction = async (nouveauStatut) => {
  const isBlocking = nouveauStatut === 'bloque'
  const actionText = isBlocking ? 'bloquer' : 'activer/débloquer'
  const count = selectedIds.value.length

  const result = await Swal.fire({
    title: 'Action groupée',
    text: `Voulez-vous vraiment ${actionText} les ${count} étudiants sélectionnés ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, confirmer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: isBlocking ? '#ef4444' : '#10b981'
  })

  if (result.isConfirmed) {
    store.isPageLoading = true
    try {
      const response = await store.bulkUpdateStatut(selectedIds.value, nouveauStatut)

      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Action réussie',
          text: response.message,
          timer: 2000,
          showConfirmButton: false
        })
        selectedIds.value = []
        await rafraichir()
      }
    } catch (error) {
      console.error('Erreur action groupée:', error)
      Swal.fire('Erreur', 'Une erreur est survenue lors de l\'action groupée', 'error')
    } finally {
      store.isPageLoading = false
    }
  }
}

const bulkCreateEcheanciers = () => {
  if (selectedIds.value.length === 0) return
  const ids = selectedIds.value.join(',')
  // On redirige vers la page de création en passant les IDs sélectionnés
  navigateTo(`/admin/negociations/creer-une-negociation?etudiants=${ids}`)
}

// ---- Changement rapide du mode de formation (individuel) ----
const openChangeModeModal = (etudiant) => {
  changeModeEtudiant.value = etudiant
  changeModeSelected.value = etudiant.mode_formation || 'Présentiel'
  showChangeModeModal.value = true
}

const submitChangeMode = async () => {
  if (!changeModeEtudiant.value) return
  savingChangeMode.value = true
  try {
    await diagnosticStore.changerModeFormation(
      changeModeEtudiant.value.id,
      changeModeSelected.value
    )
    Swal.fire({
      icon: 'success',
      title: 'Mode mis à jour',
      text: `Mode de formation changé en "${changeModeSelected.value}" et frais recalculés.`,
      timer: 2500,
      showConfirmButton: false
    })
    showChangeModeModal.value = false
    await store.refreshData()
  } catch (error) {
    const msg = error.response?.data?.message || 'Échec de la modification du mode de formation.'
    Swal.fire('Erreur', msg, 'error')
  } finally {
    savingChangeMode.value = false
  }
}

// ---- Changement groupé du mode de formation ----
const openBulkChangeModeModal = () => {
  if (selectedIds.value.length === 0) return
  bulkModeSelected.value = 'Présentiel'
  bulkProgress.value = 0
  showBulkChangeModeModal.value = true
}

const submitBulkChangeMode = async () => {
  if (!bulkModeSelected.value || selectedIds.value.length === 0) return
  savingBulkMode.value = true
  bulkProgress.value = 0

  const ids = [...selectedIds.value]
  let errors = 0

  for (const id of ids) {
    try {
      await diagnosticStore.changerModeFormation(id, bulkModeSelected.value)
      bulkProgress.value++
    } catch {
      errors++
      bulkProgress.value++
    }
  }

  savingBulkMode.value = false
  showBulkChangeModeModal.value = false

  if (errors === 0) {
    Swal.fire({
      icon: 'success',
      title: 'Mise à jour groupée réussie',
      text: `${ids.length} étudiant(s) passé(s) en mode "${bulkModeSelected.value}" avec recalcul des frais.`,
      timer: 3000,
      showConfirmButton: false
    })
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Terminé avec des erreurs',
      text: `${ids.length - errors} succès, ${errors} échec(s). Veuillez relancer pour les échecs.`,
    })
  }

  selectedIds.value = []
  await store.refreshData()
}
</script>
