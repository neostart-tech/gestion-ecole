<!-- pages/admin/etudiants/situation.vue -->

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 lg:p-8 transition-colors">
    <!-- En-tête avec Breadcrumb -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
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
      <div class="flex items-center gap-3">
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
      <!-- Carte principale avec tableau -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <!-- Barre de filtres et recherche -->
        <div class="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <!-- Ligne 1: Recherche et actions -->
          <div class="flex flex-col md:flex-row gap-4 mb-4">
            <!-- Recherche -->
            <div class="relative flex-1">
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Rechercher par nom, prénom, matricule, email..."
                class="w-full px-4 py-2.5 pl-10 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
              <svg class="w-4 h-4 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Actions groupées -->
            <div class="flex items-center gap-3">
              <!-- Compteur de résultats -->
              <div class="px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-sm whitespace-nowrap">
                <span class="font-bold text-indigo-600 dark:text-indigo-400">{{ filteredData.length }}</span>
                <span class="text-gray-600 dark:text-gray-400 ml-1">étudiant(s)</span>
              </div>

              <!-- Sélecteur de colonnes -->
              <client-only>
                <VDropdown placement="bottom-end">
                  <button
                    class="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span class="hidden sm:inline">Colonnes</span>
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M6 9l6 6 6-6" stroke-width="2" stroke-linecap="round" />
                    </svg>
                  </button>

                  <template #popper>
                    <div class="w-56 p-3 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">Colonnes affichées</p>
                      <div
                        v-for="col in columns"
                        :key="col.field"
                        class="flex items-center gap-2 py-1.5 px-1 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg"
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

          <!-- Ligne 2: Filtres groupés -->
          <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div class="flex flex-wrap gap-3 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Filtrer par:</span>
                
                <!-- Filtre Filière -->
                <select
                  v-model="store.filtres.filiere_id"
                  @change="appliquerFiltres"
                  class="px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 min-w-[180px]"
                >
                  <option v-for="opt in store.filtreOptions.filieres" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>

                <!-- Filtre Niveau -->
                <select
                  v-model="store.filtres.niveau_id"
                  @change="appliquerFiltres"
                  class="px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 min-w-[180px]"
                >
                  <option v-for="opt in store.filtreOptions.niveaux" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>

                <!-- Filtre Statut de Paiement -->
                <select
                  v-model="store.filtres.statut"
                  @change="appliquerFiltres"
                  class="px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 min-w-[150px]"
                >
                  <option v-for="opt in store.filtreOptions.statuts" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>

                <!-- Filtre Statut d'Accès -->
                <select
                  v-model="store.filtres.statut_acces"
                  @change="appliquerFiltres"
                  class="px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 min-w-[150px]"
                >
                  <option :value="null">Tous les accès</option>
                  <option value="actif">Accès actifs</option>
                  <option value="bloque">Accès bloqués</option>
                </select>
              </div>
            </div>

            <!-- Bouton réinitialiser -->
            <button
              v-if="hasActiveFilters || searchQuery"
              @click="reinitialiserFiltres"
              class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all inline-flex items-center gap-2 whitespace-nowrap"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span class="hidden sm:inline">Réinitialiser tous les filtres</span>
              <span class="sm:hidden">Réinitialiser</span>
            </button>
          </div>

          <!-- Filtres actifs (tags) -->
          <div v-if="hasActiveFilters || searchQuery" class="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Filtres actifs:</span>
            
            <div class="flex flex-wrap gap-2">
              <span v-if="searchQuery" class="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
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
              
              <span v-if="store.filtres.filiere_id" class="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
                <span>Filière: {{ getFiliereLabel(store.filtres.filiere_id) }}</span>
                <button @click="store.filtres.filiere_id = null; appliquerFiltres()" class="hover:text-indigo-900 dark:hover:text-indigo-100">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>

              <span v-if="store.filtres.niveau_id" class="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
                <span>Niveau: {{ getNiveauLabel(store.filtres.niveau_id) }}</span>
                <button @click="store.filtres.niveau_id = null; appliquerFiltres()" class="hover:text-indigo-900 dark:hover:text-indigo-100">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>

              <span v-if="store.filtres.statut" class="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
                <span>Statut: {{ getStatutLabel(store.filtres.statut) }}</span>
                <button @click="store.filtres.statut = null; appliquerFiltres()" class="hover:text-indigo-900 dark:hover:text-indigo-100">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            </div>
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
                <button
                  @click="bulkAction('actif')"
                  class="flex-1 md:flex-none flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-2.5 rounded-2xl transition-all duration-300 text-[10px] md:text-xs font-black group bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95"
                >
                  <div class="w-1.5 h-1.5 md:w-2 md:h-2 flex-shrink-0 rounded-full bg-white shadow-[0_0_8px_white] animate-pulse"></div>
                  <span class="tracking-widest">ACTIVER</span>
                </button>

                <button
                  @click="bulkAction('bloque')"
                  class="flex-1 md:flex-none flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-2.5 rounded-2xl transition-all duration-300 text-[10px] md:text-xs font-black group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-600 active:scale-95 transition-all text-center"
                >
                  <div class="w-1.5 h-1.5 md:w-2 md:h-2 flex-shrink-0 rounded-full bg-gray-400 group-hover:bg-red-500 transition-colors"></div>
                  <span class="tracking-widest">BLOQUER</span>
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
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                  {{ getInitials(data.value) }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ data.value.nom }} {{ data.value.prenom }}
                    <span v-if="data.value.statut_global === 'bloque'" class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase tracking-wider">Bloqué</span>
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ data.value.matricule }}
                  </p>
                </div>
              </div>
            </template>

            <!-- Template pour la colonne filière/niveau -->
            <template #filiere_nom="data">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ data.value.filiere }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ data.value.niveau }}</p>
              </div>
            </template>

            <!-- Template pour les montants -->
            <template #montant_total_formatted="data">
              <p class="text-sm font-mono text-gray-900 dark:text-white">{{ data.value.montant_total_formatted }}</p>
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
                    @click="voirEcheances(data.value)"
                    class="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all"
                    title="Échéances"
                  >
                    <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>

                  <button
                    @click="openRecuModal(data.value)"
                    class="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg transition-all"
                    title="Imprimer reçu"
                  >
                    <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </button>

                  <div class="flex items-center ml-1" title="Statut d'accès (On: Actif / Off: Bloqué)">
                    <button 
                      @click="toggleBlocage(data.value)"
                      class="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                      :class="data.value.statut_global === 'actif' ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'"
                    >
                      <span 
                        aria-hidden="true" 
                        class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                        :class="data.value.statut_global === 'actif' ? 'translate-x-4' : 'translate-x-0'"
                      ></span>
                    </button>
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
  <div class="flex items-center gap-4">
    <span class="px-3 py-1.5 text-sm font-medium rounded-full" :class="getStatutClass(selectedEtudiant.statut)">
      {{ selectedEtudiant.statut_libelle }}
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
                <button
                  @click="openRecuModal(selectedEtudiant)"
                  class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Voir le reçu
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

    <!-- Modal de reçu -->
    <TransitionRoot appear :show="showRecuModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeRecuModal">
        <div class="fixed inset-0 bg-black/60" />

        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel class="w-full max-w-4xl rounded-xl bg-white dark:bg-gray-800 p-6 max-h-[90vh] overflow-y-auto">
            <DialogTitle class="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center justify-between">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Reçu de paiement</span>
              </div>
              <button @click="closeRecuModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </DialogTitle>

            <div v-if="selectedEtudiant" class="space-y-4">
              <!-- Contenu du reçu -->
              <div ref="recuContent" class="bg-white p-8" style="font-family: Arial, Helvetica, sans-serif; color: #333; line-height: 1.5;">
                <!-- En-tête -->
                <div style="text-align: center; margin-bottom: 2rem; border-bottom: 2px solid #4f46e5; padding-bottom: 1rem;">
                  <h1 style="font-size: 24px; font-weight: bold; color: #1e293b; margin: 0 0 0.5rem 0;">{{ appName }}</h1>
                  <p style="font-size: 14px; color: #64748b; margin: 0;">Reçu de paiement officiel</p>
                  <p style="font-size: 12px; color: #94a3b8; margin-top: 0.5rem;">N° REC-{{ selectedEtudiant.matricule }}-{{ new Date().toISOString().split('T')[0].replace(/-/g, '') }}</p>
                </div>

                <!-- Informations étudiant -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                  <div>
                    <p style="font-size: 12px; color: #64748b; margin: 0 0 0.25rem 0;">Étudiant</p>
                    <p style="font-weight: 600; color: #1e293b; margin: 0;">{{ selectedEtudiant.nom }} {{ selectedEtudiant.prenom }}</p>
                    <p style="font-size: 12px; color: #64748b; margin: 0;">Matricule: {{ selectedEtudiant.matricule }}</p>
                  </div>
                  <div>
                    <p style="font-size: 12px; color: #64748b; margin: 0 0 0.25rem 0;">Filière / Niveau</p>
                    <p style="font-weight: 600; color: #1e293b; margin: 0;">{{ selectedEtudiant.filiere }}</p>
                    <p style="font-size: 12px; color: #64748b; margin: 0;">{{ selectedEtudiant.niveau }}</p>
                  </div>
                </div>

                <!-- Tableau des paiements -->
                <h3 style="font-size: 16px; font-weight: 600; color: #1e293b; margin: 1.5rem 0 1rem 0;">Détail des paiements</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; border: 1px solid #e2e8f0;">
                  <thead>
                    <tr style="background-color: #f8fafc;">
                      <th style="padding: 0.75rem; text-align: left; font-size: 12px; font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0;">Échéance</th>
                      <th style="padding: 0.75rem; text-align: left; font-size: 12px; font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0;">Date</th>
                      <th style="padding: 0.75rem; text-align: right; font-size: 12px; font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0;">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="paiement in paiementsDeLEtudiant" :key="paiement.id" style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 0.75rem; font-size: 13px;">{{ paiement.libelle }}</td>
                      <td style="padding: 0.75rem; font-size: 13px;">{{ formatDate(paiement.date) }}</td>
                      <td style="padding: 0.75rem; text-align: right; font-size: 13px; font-family: monospace;">{{ formatMontant(paiement.montant) }}</td>
                    </tr>
                    <tr v-if="paiementsDeLEtudiant.length === 0">
                      <td colspan="3" style="padding: 1rem; text-align: center; font-size: 13px; color: #94a3b8;">Aucun paiement enregistré</td>
                    </tr>
                  </tbody>
                </table>

                <!-- Récapitulatif -->
                <div style="display: flex; justify-content: flex-end; gap: 2rem; padding-top: 1rem; border-top: 2px solid #e2e8f0;">
                  <div>
                    <p style="font-size: 12px; color: #64748b; margin: 0 0 0.25rem 0;">Total payé</p>
                    <p style="font-size: 18px; font-weight: bold; color: #059669; margin: 0;">{{ selectedEtudiant.montant_paye_formatted }}</p>
                  </div>
                  <div>
                    <p style="font-size: 12px; color: #64748b; margin: 0 0 0.25rem 0;">Reste à payer</p>
                    <p style="font-size: 18px; font-weight: bold; color: #d97706; margin: 0;">{{ selectedEtudiant.montant_restant_formatted }}</p>
                  </div>
                </div>

                <!-- Signature -->
                <div style="display: flex; justify-content: space-between; margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
                  <div>
                    <p style="font-size: 12px; color: #64748b; margin: 0 0 0.25rem 0;">Date d'émission</p>
                    <p style="font-weight: 500; color: #1e293b; margin: 0;">{{ formatDate(new Date()) }}</p>
                  </div>
                  <div style="text-align: right;">
                    <p style="font-size: 12px; color: #64748b; margin: 0 0 0.25rem 0;">Cachet et signature</p>
                    <div style="width: 200px; height: 50px; border-bottom: 2px dashed #cbd5e1; margin-top: 0.5rem;"></div>
                  </div>
                </div>
              </div>

              <!-- Boutons d'action -->
              <div class="flex justify-end gap-3 pt-4">
                <button
                  @click="closeRecuModal"
                  class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Fermer
                </button>
                <button
                  @click="downloadRecu"
                  :disabled="isDownloadingRecu"
                  class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <svg v-if="isDownloadingRecu" class="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {{ isDownloadingRecu ? 'Téléchargement...' : 'Télécharger le reçu' }}
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </TransitionRoot>
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
import { useEtudiantSituationStore } from '~~/stores/etudiant-situation'
import { useParametreStore } from '~~/stores/parametre'
import { useDebounce } from '@vueuse/core'
import Swal from 'sweetalert2'
import config from '~~/config'

// Stores
const store = useEtudiantSituationStore()
const parametreStore = useParametreStore()

// États locaux
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
const showDetailsModal = ref(false)
const showEcheancesModal = ref(false)
const showRecuModal = ref(false)
const selectedEtudiant = ref(null)
const recuContent = ref(null)
const isDownloadingRecu = ref(false)
const selectedIds = ref([]) // IDs des étudiants sélectionnés

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
  return store.filtres.filiere_id || store.filtres.niveau_id || store.filtres.statut
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

const downloadRecu = async () => {
  if (!recuContent.value) return
  
  isDownloadingRecu.value = true
  
  try {
    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default
    
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `recu_${selectedEtudiant.value?.matricule || 'etudiant'}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        logging: false, 
        backgroundColor: '#ffffff',
        useCORS: true
      },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }
    
    await html2pdf().set(opt).from(recuContent.value).save()
  } catch (error) {
    console.error('Erreur téléchargement reçu:', error)
  } finally {
    isDownloadingRecu.value = false
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
</script>
