<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 lg:p-8 transition-colors">
    <!-- En-tête avec Breadcrumb et bouton -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <!-- Breadcrumb -->
      <Breadcrumb
        :items="[
          { label: 'Tableau de bord', to: '/admin/dashboard' },
          { label: 'Negociation des paiements', to: '/admin/negociations' },
          { label: 'Gestion des negociations', to: null }
        ]"
        title="Gestion des négociations de paiement"
        title-class="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        spacing="mb-0"
      />

      <!-- Bouton pour créer un échéancier -->
      <NuxtLink
        to="/admin/negociations/creer-une-negociation"
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span class="hidden sm:inline">Nouveau</span>
        <span class="sm:hidden">Nouveau</span>
      </NuxtLink>
    </div>

    <!-- Cartes de statistiques -->
    <div v-if="!isPageLoading" class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <!-- Total Étudiants -->
      <div class="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Total étudiants</span>
            <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stats?.total_etudiants || 0 }}</p>
          </div>
          <div class="p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span class="text-green-600 dark:text-green-400">{{ stats?.en_cours || 0 }}</span> en cours,
          <span class="text-red-600 dark:text-red-400">{{ stats?.en_retard || 0 }}</span> en retard
        </div>
      </div>

      <!-- En cours -->
      <div class="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">En cours</span>
            <p class="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{{ stats?.en_cours || 0 }}</p>
          </div>
          <div class="p-2 sm:p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {{ stats?.en_retard || 0 }} en retard
        </div>
      </div>

      <!-- En retard -->
      <div class="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">En retard</span>
            <p class="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{{ stats?.en_retard || 0 }}</p>
          </div>
          <div class="p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 rounded-xl group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Montant: {{ formatMontant(stats?.montant_en_retard) }}
        </div>
      </div>

      <!-- Total payé global -->
      <div class="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Total payé</span>
            <p class="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400 mt-1 truncate max-w-[120px] sm:max-w-none">
              {{ formatMontant(stats?.montant_paye) }}
            </p>
          </div>
          <div class="p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-xl group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Total dû: {{ formatMontant(stats?.montant_total) }}
        </div>
      </div>

      <!-- Nouvelle carte: Paiements du mois -->
      <div class="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 border border-gray-100 dark:border-gray-700 col-span-2 lg:col-span-4">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="p-2 sm:p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Paiements {{ moisEnCours }}</span>
              <div class="flex flex-wrap items-baseline gap-3 mt-1">
                <p class="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400">
                  {{ formatMontant(stats?.montant_paye_mois) }}
                </p>
                <span class="text-sm text-gray-400 dark:text-gray-500">payés</span>
                <p class="text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400">
                  {{ formatMontant(stats?.montant_restant_mois) }}
                </p>
                <span class="text-sm text-gray-400 dark:text-gray-500">restants</span>
              </div>
            </div>
          </div>
          <div class="w-full sm:w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
              :style="{ width: `${Math.min(100, (stats?.montant_paye_mois / (stats?.montant_restant_mois + stats?.montant_paye_mois || 1)) * 100)}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Skeleton loading pour les statistiques -->
    <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <div v-for="i in 4" :key="i" class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5">
        <div class="flex items-center justify-between">
          <div class="space-y-2">
            <div class="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div class="p-2 sm:p-3 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse h-8 w-8 sm:h-10 sm:w-10"></div>
        </div>
        <div class="mt-2 h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>

    <!-- Carte principale avec onglets -->
    <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
      <!-- En-tête avec onglets -->
      <div class="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50">
        <div class="px-4 sm:px-6">
          <nav class="flex -mb-px space-x-6 sm:space-x-8 overflow-x-auto scrollbar-hide" role="tablist">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-3 sm:py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm sm:text-base transition-all duration-200 whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
              ]"
            >
              <span v-html="tab.icon" class="w-4 h-4 sm:w-5 sm:h-5"></span>
              <span>{{ tab.label }}</span>
              <span v-if="tab.badge" class="ml-1 sm:ml-2 px-1.5 py-0.5 text-xs rounded-full" :class="tab.badgeClass">
                {{ tab.badge }}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Barre de filtres -->
      <div class="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <div class="flex flex-col lg:flex-row gap-3 sm:gap-4">
          <!-- Recherche -->
          <div class="relative flex-1">
            <input
              v-model="searchQuery"
              type="search"
              :placeholder="getSearchPlaceholder()"
              class="w-full px-4 py-2.5 pl-10 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
            <svg class="w-4 h-4 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Filtre année -->
            <select
              v-model="filtreAnnee"
              class="px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 w-full sm:w-40"
            >
              <option value="">Toutes années</option>
              <option v-for="a in annees" :key="a.id" :value="a.id">{{ a.nom }}</option>
            </select>

            <!-- Filtre statut -->
            <select
              v-if="activeTab === 'frais'"
              v-model="filtreStatut"
              class="px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 w-full sm:w-36"
            >
              <option value="">Tous statuts</option>
              <option value="en_cours">En cours</option>
              <option value="solde">Soldé</option>
              <option value="en_retard">En retard</option>
            </select>

            <!-- Sélecteur de colonnes -->
            <VDropdown placement="bottom-end">
              <button
                class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all w-full sm:w-auto"
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
                <div class="w-56 p-3 rounded-xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">Colonnes affichées</p>
                  <div v-for="col in currentColumns" :key="col.field" class="flex items-center gap-2 py-1.5 px-1 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
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
          </div>
        </div>

        <!-- Filtres actifs -->
        <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mt-3">
          <span class="text-xs text-gray-500 dark:text-gray-400 self-center">Filtres actifs:</span>
          <span v-if="filtreAnnee" class="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs">
            {{ getAnneeLabel(filtreAnnee) }}
            <button @click="filtreAnnee = ''" class="hover:text-indigo-900 dark:hover:text-indigo-100">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
          <span v-if="filtreStatut" class="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs">
            {{ getStatutLabel(filtreStatut) }}
            <button @click="filtreStatut = ''" class="hover:text-indigo-900 dark:hover:text-indigo-100">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isPageLoading" class="p-6">
        <div class="space-y-3">
          <div v-for="i in 5" :key="i" class="flex gap-4 animate-pulse">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
        </div>
      </div>

      <!-- Tableau -->
      <div v-else class="p-4 sm:p-6">
        <div v-if="isLoading" class="flex justify-center py-10">
          <div class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
        </div>

        <div v-else>
          <!-- Message si aucun résultat -->
          <div v-if="filteredData.length === 0" class="text-center py-12">
            <div class="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-gray-600 dark:text-gray-400 font-medium">Aucun résultat trouvé</p>
            <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">Essayez de modifier vos filtres de recherche</p>
          </div>

          <Vue3Datatable
            v-else
            :columns="visibleColumns"
            :rows="filteredData"
            :search="searchQuery"
            :per-page="itemsPerPage"
            :page="currentPage"
            @update:page="currentPage = $event"
            skin="bh-table-striped bh-table-hover"
            class="w-full"
            sortable
            :loading="isLoading"
          >
            <!-- Templates personnalisés -->
            <template #etudiant="data">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                  {{ getInitials(data.value.etudiant) }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ data.value.etudiant?.nom }} {{ data.value.etudiant?.prenom }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ data.value.etudiant?.matricule }}
                  </p>
                </div>
              </div>
            </template>

            <template #niveau="data">
              <div class="space-y-0.5">
                <span class="text-xs font-medium text-gray-900 dark:text-white block">
                  {{ data.value.frais_scolarite?.niveau?.libelle }}
                </span>
                <span v-if="data.value.frais_scolarite?.filiere" class="text-xs text-gray-500 dark:text-gray-400 block">
                  {{ data.value.frais_scolarite.filiere.nom }}
                </span>
              </div>
            </template>

            <template #type_paiement="data">
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full" :class="{
                  'bg-amber-500': data.value.type_paiement === 'tranches_globales',
                  'bg-green-500': data.value.type_paiement === 'negociation'
                }"></span>
                <span class="text-xs font-medium" :class="{
                  'text-amber-700 dark:text-amber-300': data.value.type_paiement === 'tranches_globales',
                  'text-green-700 dark:text-green-300': data.value.type_paiement === 'negociation'
                }">
                  {{ data.value.type_paiement === 'tranches_globales' ? 'Global' : 'Négocié' }}
                </span>
              </div>
            </template>

            <template #frequence="data">
              <div class="flex flex-col">
                <span class="text-xs font-medium text-gray-900 dark:text-white capitalize">
                  {{ data.value.frequence_paiement || 'Annuel' }}
                </span>
                <span class="text-[10px] text-gray-500 dark:text-gray-400">
                  {{ getNbEcheancesLabel(data.value.frequence_paiement) }}
                </span>
              </div>
            </template>

            <template #montants="data">
              <div class="text-right space-y-0.5">
                <p class="text-sm font-semibold text-green-600 dark:text-green-400">
                  {{ formatMontant(data.value.montant_apres_bourse) }}
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500 line-through">
                  {{ formatMontant(data.value.montant_initial) }}
                </p>
              </div>
            </template>

            <template #paye="data">
              <div class="text-right space-y-0.5">
                <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {{ formatMontant(calculerTotalPaye(data.value)) }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ pourcentage(data.value) }}%
                </p>
              </div>
            </template>

            <!-- Template statut corrigé -->
            <template #statut="data">
              <span class="inline-flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full" :class="{
                  'bg-green-500': getStatutActuel(data.value) === 'solde',
                  'bg-yellow-500': getStatutActuel(data.value) === 'en_cours',
                  'bg-red-500': getStatutActuel(data.value) === 'en_retard'
                }"></span>
                <span class="text-xs font-medium" :class="{
                  'text-green-700 dark:text-green-300': getStatutActuel(data.value) === 'solde',
                  'text-yellow-700 dark:text-yellow-300': getStatutActuel(data.value) === 'en_cours',
                  'text-red-700 dark:text-red-300': getStatutActuel(data.value) === 'en_retard'
                }">
                  {{ getStatutActuelLabel(data.value) }}
                </span>
              </span>
            </template>

            <template #date_limite="data">
              <span class="text-xs sm:text-sm" :class="{
                'text-amber-600 dark:text-amber-400': new Date(data.value.date_limite) > new Date(),
                'text-red-600 dark:text-red-400': new Date(data.value.date_limite) <= new Date()
              }">
                {{ formatDate(data.value.date_limite) }}
              </span>
            </template>

            <template #etudiant_echeance="data">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-medium">
                  {{ getInitials(data.value.frais_etudiant?.etudiant) }}
                </div>
                <p class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                  {{ data.value.frais_etudiant?.etudiant?.nom }} {{ data.value.frais_etudiant?.etudiant?.prenom }}
                </p>
              </div>
            </template>

            <template #montant_echeance="data">
              <div class="text-right space-y-0.5">
                <p class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                  {{ formatMontant(data.value.montant) }}
                </p>
                <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  Reste: {{ formatMontant(data.value.montant - (data.value.montant_paye || 0)) }}
                </p>
              </div>
            </template>

            <template #libelle="data">
              <p class="text-xs sm:text-sm text-gray-900 dark:text-white truncate max-w-[200px]" :title="data.value.libelle">
                {{ data.value.libelle }}
              </p>
            </template>

            <!-- Template actions avec bouton de reçu -->
            <template #actions="data">
              <div class="flex items-center gap-2">
                <NuxtLink
                title="détail"
                  :to="`/admin/negociations/detail-de-la-negociation-${getDetailId(data.value)}-information`"
                  class="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 text-indigo-700 dark:text-indigo-300 rounded-lg hover:from-indigo-100 hover:to-indigo-200 dark:hover:from-indigo-900/30 dark:hover:to-indigo-800/30 transition-all text-xs sm:text-sm font-medium group"
                >
                  <svg class="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span class="hidden sm:inline"></span>
                </NuxtLink>

                <button
                  @click="openRecuModal(data.value)"
                  title="recu"
                  class="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 text-emerald-700 dark:text-emerald-300 rounded-lg hover:from-emerald-100 hover:to-emerald-200 dark:hover:from-emerald-900/30 dark:hover:to-emerald-800/30 transition-all text-xs sm:text-sm font-medium group"
                >
                  <svg class="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span class="hidden sm:inline"></span>
                </button>
              </div>
            </template>
          </Vue3Datatable>

          <!-- Pied du tableau -->
          <div class="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Affichage de <span class="font-medium">{{ filteredData.length }}</span> résultat{{ filteredData.length > 1 ? 's' : '' }}
            </div>
            
            <!-- Pagination personnalisée -->
            <div class="flex items-center gap-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span class="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                Page {{ currentPage }}
              </span>
              <button
                @click="currentPage++"
                :disabled="currentPage * itemsPerPage >= filteredData.length"
                class="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de reçu -->
    <TransitionRoot appear :show="showRecuModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeRecuModal">
        <div class="fixed inset-0 bg-black/60" />

        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel class="w-full max-w-4xl rounded-xl bg-white dark:bg-gray-800 p-5 max-h-[90vh] overflow-y-auto">
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

            <div v-if="selectedItem" class="space-y-4">
              <!-- Contenu du reçu - avec classes CSS définies dans le style global -->
              <div ref="recuContent" class="recu-pdf-container">
                <div class="recu-pdf">
                  <div class="recu-header">
                    <h1>{{appName}}</h1>
                    <p class="recu-subtitle">Reçu de paiement officiel</p>
                    <div class="recu-matricule">N° REC-{{ selectedItem.id }}-{{ formatDateForRef(new Date()) }}</div>
                  </div>

                  <div class="recu-content">
                    <!-- Informations étudiant -->
                    <div class="recu-grid">
                      <div class="recu-card">
                        <h3>Étudiant</h3>
                        <div class="recu-row">
                          <span class="recu-label">Nom complet</span>
                          <span class="recu-value">{{ selectedItem.etudiant?.nom }} {{ selectedItem.etudiant?.prenom }}</span>
                        </div>
                        <div class="recu-row">
                          <span class="recu-label">Matricule</span>
                          <span class="recu-value">{{ selectedItem.etudiant?.matricule || 'N/A' }}</span>
                        </div>
                       
                      </div>

                      <div class="recu-card">
                        <h3>Scolarité</h3>
                        <div class="recu-row">
                          <span class="recu-label">Niveau</span>
                          <span class="recu-value">{{ selectedItem.frais_scolarite?.niveau?.libelle || 'N/A' }}</span>
                        </div>
                        <div class="recu-row">
                          <span class="recu-label">Année scolaire</span>
                          <span class="recu-value">{{ selectedItem.annee_scolaire?.nom || 'N/A' }}</span>
                        </div>
                        
                      </div>
                    </div>

                    <!-- Tableau des paiements -->
                    <h3 class="recu-section-title">Détail des paiements</h3>
                    <table class="recu-table">
                      <thead>
                        <tr>
                          <th>Échéance</th>
                          <th>Date</th>
                          <th>Mode</th>
                          <th class="recu-text-right">Montant</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="paiement in paiementsDeLaNegociation" :key="paiement.id">
                          <td>{{ getEcheanceLabel(paiement.payable_id) }}</td>
                          <td>{{ formatDate(paiement.date_paiement) }}</td>
                          <td>{{ getModePaiementLabel(paiement.mode_paiement) }}</td>
                          <td class="recu-text-right recu-font-bold">{{ formatMontant(paiement.montant) }}</td>
                        </tr>
                        <tr v-if="paiementsDeLaNegociation.length === 0">
                          <td colspan="4" class="recu-text-center recu-empty">
                            Aucun paiement enregistré
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <!-- Récapitulatif -->
                    <div class="recu-total">
                      <div class="recu-total-item">
                        <div class="recu-total-label">Total payé</div>
                        <div class="recu-total-value recu-paye">{{ formatMontant(calculerTotalPaye(selectedItem)) }}</div>
                      </div>
                      <div class="recu-total-item">
                        <div class="recu-total-label">Reste à payer</div>
                        <div class="recu-total-value recu-reste">{{ formatMontant(resteAPayer(selectedItem)) }}</div>
                      </div>
                    </div>

                    <!-- Date et signature -->
                    <div class="recu-footer">
                      <div>
                        <p class="recu-footer-label">Date d'émission</p>
                        <p class="recu-footer-value">{{ formatDate(new Date()) }}</p>
                      </div>
                      <div class="recu-signature">
                        <p class="recu-footer-label">Cachet et signature</p>
                        <div class="recu-signature-line"></div>
                      </div>
                    </div>
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

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
} from '@headlessui/vue'
import Vue3Datatable from "@bhplugin/vue3-datatable"
import "@bhplugin/vue3-datatable/dist/style.css"
import Breadcrumb from "~/components/Breadcrumb.vue"
import { useNegociationStore } from '~~/stores/negociation'
import { useAnneScolaireStore } from '~~/stores/annee-scolaire'
import { useParametreStore } from '~~/stores/parametre'

const { $toastr } = useNuxtApp()

// Stores
const negociationStore = useNegociationStore()
const anneeStore = useAnneScolaireStore()
const parametreStore=useParametreStore()


// États
const activeTab = ref('frais')
const searchQuery = ref('')
const filtreAnnee = ref('')
const filtreStatut = ref('')
const isLoading = ref(false)
const isPageLoading = ref(true)
const itemsPerPage = ref(10)
const currentPage = ref(1)

// États pour le modal de reçu
const showRecuModal = ref(false)
const selectedItem = ref(null)
const isDownloadingRecu = ref(false)
const recuContent = ref(null)

// Données
const annees = ref([])

// Statistiques calculées dynamiquement
const stats = computed(() => {
  const negociations = negociationStore.negociations || []
  const maintenant = new Date()
  const debutDuMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1)
  const finDuMois = new Date(maintenant.getFullYear(), maintenant.getMonth() + 1, 0)
  
  let totalEtudiants = new Set()
  let enCours = 0
  let enRetard = 0
  let montantTotal = 0
  let montantPayeTotal = 0
  let montantEnRetard = 0
  let montantPayeMois = 0
  let montantRestantMois = 0
  
  // Analyser chaque négociation
  negociations.forEach(neg => {
    if (neg.etudiant?.id) {
      totalEtudiants.add(neg.etudiant.id)
    }
    
    const montantDu = Number(neg.montant_apres_bourse) || 0
    montantTotal += montantDu
    
    const totalPayeNeg = neg.echeances?.reduce((sum, e) => {
      return sum + (Number(e.montant_paye) || 0)
    }, 0) || 0
    montantPayeTotal += totalPayeNeg
    
    let aEcheancesEnRetard = false
    let montantRetardNeg = 0
    
    if (neg.echeances && neg.echeances.length > 0) {
      neg.echeances.forEach(echeance => {
        const dateLimite = new Date(echeance.date_limite)
        const montantEcheance = Number(echeance.montant) || 0
        const montantPayeEcheance = Number(echeance.montant_paye) || 0
        const resteAPayer = montantEcheance - montantPayeEcheance
        
        if (dateLimite < maintenant && resteAPayer > 0) {
          aEcheancesEnRetard = true
          montantRetardNeg += resteAPayer
        }
        
        if (echeance.paiements && Array.isArray(echeance.paiements)) {
          echeance.paiements.forEach(paiement => {
            const datePaiement = new Date(paiement.date_paiement)
            if (datePaiement >= debutDuMois && datePaiement <= finDuMois) {
              montantPayeMois += Number(paiement.montant) || 0
            }
          })
        }
      })
    }
    
    if (montantRetardNeg > 0) {
      montantEnRetard += montantRetardNeg
    }
    
    const statutActuel = getStatutActuel(neg)
    if (statutActuel === 'en_retard') {
      enRetard++
    } else if (statutActuel === 'en_cours') {
      enCours++
    }
  })
  
  // Calculer le montant restant à payer pour le mois en cours
  negociations.forEach(neg => {
    if (neg.echeances) {
      neg.echeances.forEach(echeance => {
        const dateLimite = new Date(echeance.date_limite)
        if (dateLimite >= debutDuMois && dateLimite <= finDuMois) {
          const montantEcheance = Number(echeance.montant) || 0
          const montantPayeEcheance = Number(echeance.montant_paye) || 0
          const resteAPayer = montantEcheance - montantPayeEcheance
          if (resteAPayer > 0) {
            montantRestantMois += resteAPayer
          }
        }
      })
    }
  })
  
  return {
    total_etudiants: totalEtudiants.size,
    en_cours: enCours,
    en_retard: enRetard,
    montant_total: montantTotal,
    montant_paye: montantPayeTotal,
    montant_en_retard: montantEnRetard,
    montant_paye_mois: montantPayeMois,
    montant_restant_mois: montantRestantMois
  }
})

// Fonction pour obtenir le statut réel d'une négociation
const getStatutActuel = (negociation) => {
  if (!negociation) return 'en_cours'
  
  const totalPaye = calculerTotalPaye(negociation)
  const montantDu = Number(negociation.montant_apres_bourse) || 0
  
  // Si tout est payé
  if (totalPaye >= montantDu) return 'solde'
  
  // Vérifier s'il y a des échéances en retard
  const maintenant = new Date()
  const aDesEcheancesEnRetard = negociation.echeances?.some(e => {
    const dateLimite = new Date(e.date_limite)
    const resteAPayer = (Number(e.montant) || 0) - (Number(e.montant_paye) || 0)
    return dateLimite < maintenant && resteAPayer > 0
  }) || false
  
  if (aDesEcheancesEnRetard) return 'en_retard'
  
  return 'en_cours'
}

const logoUrl = computed(() => {
  const url = parametreStore.getAppLogo
  return url
})

const appName = computed(() => parametreStore.getAppName)


const getStatutActuelLabel = (negociation) => {
  const labels = {
    en_cours: 'En cours',
    solde: 'Soldé',
    en_retard: 'En retard'
  }
  return labels[getStatutActuel(negociation)] || 'En cours'
}

// Configuration des tabs
const tabs = [
  {
    id: 'frais',
    label: 'Tous les frais',
    icon: '<svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>',
    badge: computed(() => negociationStore.negociations?.length || 0),
    badgeClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
  },
  {
    id: 'echeances',
    label: 'Échéances à venir',
    icon: '<svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>',
    badge: computed(() => {
      const maintenant = new Date()
      let count = 0
      negociationStore.negociations?.forEach(neg => {
        if (neg.echeances) {
          neg.echeances.forEach(e => {
            const dateLimite = new Date(e.date_limite)
            const resteAPayer = (Number(e.montant) || 0) - (Number(e.montant_paye) || 0)
            if (dateLimite >= maintenant && resteAPayer > 0) {
              count++
            }
          })
        }
      })
      return count
    }),
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
  },
  {
    id: 'retard',
    label: 'En retard',
    icon: '<svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>',
    badge: computed(() => {
      const maintenant = new Date()
      let count = 0
      negociationStore.negociations?.forEach(neg => {
        if (neg.echeances) {
          neg.echeances.forEach(e => {
            const dateLimite = new Date(e.date_limite)
            const resteAPayer = (Number(e.montant) || 0) - (Number(e.montant_paye) || 0)
            if (dateLimite < maintenant && resteAPayer > 0) {
              count++
            }
          })
        }
      })
      return count
    }),
    badgeClass: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  }
]

// Colonnes pour les frais
const fraisColumns = ref([
  { field: "etudiant", title: "Étudiant", visible: true },
  { field: "frequence", title: "Fréquence", visible: true },
  { field: "niveau", title: "Niveau/Filière", visible: false },
  { field: "type_paiement", title: "Type", visible: false },
  { field: "montants", title: "Montant", visible: true },
  { field: "paye", title: "Payé", visible: true },
  { field: "statut", title: "Statut", visible: true },
  { field: "actions", title: "Actions", visible: true },
])

// Colonnes pour les échéances
const echeancesColumns = ref([
  { field: "etudiant_echeance", title: "Étudiant", visible: true },
  { field: "libelle", title: "Libellé", visible: true },
  { field: "montant_echeance", title: "Montant", visible: true },
  { field: "date_limite", title: "Date limite", visible: true },
  { field: "statut", title: "Statut", visible: true },
  { field: "actions", title: "Actions", visible: true },
])

// Colonnes courantes selon l'onglet
const currentColumns = computed(() => {
  return activeTab.value === 'frais' ? fraisColumns.value : echeancesColumns.value
})

// Colonnes visibles
const visibleColumns = computed(() => {
  return currentColumns.value.filter(c => c.visible)
})

// Données filtrées
const filteredData = computed(() => {
  if (activeTab.value === 'frais') {
    let liste = negociationStore.negociations || []
    
    if (filtreAnnee.value) {
      liste = liste.filter(f => f.annee_scolaire_id == filtreAnnee.value)
    }
    
    if (filtreStatut.value) {
      liste = liste.filter(f => getStatutActuel(f) === filtreStatut.value)
    }
    
    return liste
  } else if (activeTab.value === 'echeances') {
    // Échéances à venir
    const maintenant = new Date()
    const echeances = []
    negociationStore.negociations?.forEach(neg => {
      if (neg.echeances) {
        neg.echeances.forEach(e => {
          const dateLimite = new Date(e.date_limite)
          const resteAPayer = (Number(e.montant) || 0) - (Number(e.montant_paye) || 0)
          if (dateLimite >= maintenant && resteAPayer > 0) {
            echeances.push({
              ...e,
              frais_etudiant: neg
            })
          }
        })
      }
    })
    return echeances
  } else {
    // Échéances en retard
    const maintenant = new Date()
    const echeancesEnRetard = []
    negociationStore.negociations?.forEach(neg => {
      if (neg.echeances) {
        neg.echeances.forEach(e => {
          const dateLimite = new Date(e.date_limite)
          const resteAPayer = (Number(e.montant) || 0) - (Number(e.montant_paye) || 0)
          if (dateLimite < maintenant && resteAPayer > 0) {
            echeancesEnRetard.push({
              ...e,
              frais_etudiant: neg
            })
          }
        })
      }
    })
    return echeancesEnRetard
  }
})

// Filtres actifs
const hasActiveFilters = computed(() => {
  return filtreAnnee.value || filtreStatut.value
})

// Paiements de la négociation sélectionnée
const paiementsDeLaNegociation = computed(() => {
  if (!selectedItem.value || !selectedItem.value.echeances) return []
  
  const tousLesPaiements = []
  selectedItem.value.echeances.forEach(echeance => {
    if (echeance.paiements && echeance.paiements.length > 0) {
      tousLesPaiements.push(...echeance.paiements)
    }
  })
  
  return tousLesPaiements.sort((a, b) => new Date(b.date_paiement) - new Date(a.date_paiement))
})

// Chargement initial
onMounted(async () => {
  isPageLoading.value = true
  try {
    await Promise.all([
      negociationStore.fetchNegociations(),
      anneeStore.fetchAnneeScolaire(),
      parametreStore.fetchParametres()
    ])
    annees.value = anneeStore.annneescolaires || []
  } catch (error) {
    console.error('Erreur:', error)
    $toastr.error('Erreur lors du chargement des données')
  } finally {
    isPageLoading.value = false
  }
})

// Watch pour changer de tab
watch(activeTab, () => {
  currentPage.value = 1
  searchQuery.value = ''
  filtreStatut.value = ''
})

// Placeholder de recherche
const getSearchPlaceholder = () => {
  if (activeTab.value === 'frais') {
    return 'Rechercher par étudiant, matricule...'
  }
  return 'Rechercher par étudiant...'
}

// Obtenir l'ID du détail
const getDetailId = (item) => {
  if (activeTab.value === 'frais') {
    return item.id
  }
  return item.frais_etudiant?.id || item.frais_etudiant_id
}

// Obtenir le label de l'année
const getAnneeLabel = (id) => {
  const annee = annees.value.find(a => a.id == id)
  return annee?.nom || id
}

// Utilitaires
const getInitials = (etudiant) => {
  if (!etudiant) return '?'
  return ((etudiant.nom?.[0] || '') + (etudiant.prenom?.[0] || '')).toUpperCase()
}

const getStatutLabel = (statut) => {
  const labels = {
    en_cours: 'En cours',
    solde: 'Soldé',
    en_retard: 'En retard',
    en_attente: 'En attente',
    paye: 'Payé'
  }
  return labels[statut] || statut
}

const getNbEcheancesLabel = (frequence) => {
  const labels = {
    mensuel: '10 échéances',
    bimestriel: '4 échéances',
    trimestriel: '3 échéances',
    annuel: '1 échéance'
  }
  return labels[frequence] || '1 échéance'
}

const formatMontant = (montant) => {
  if (montant === undefined || montant === null || isNaN(montant)) return '0 FCFA'
  
  const nombre = Number(montant)
  if (isNaN(nombre)) return '0 FCFA'
  
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(nombre).replace('XOF', 'FCFA')
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatDateForRef = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}${(d.getMonth()+1).toString().padStart(2,'0')}${d.getDate().toString().padStart(2,'0')}`
}

const calculerTotalPaye = (frais) => {
  if (!frais || !frais.echeances) return 0
  return frais.echeances.reduce((sum, e) => sum + (Number(e.montant_paye) || 0), 0)
}

const resteAPayer = (frais) => {
  if (!frais) return 0
  return (Number(frais.montant_apres_bourse) || 0) - calculerTotalPaye(frais)
}

const pourcentage = (frais) => {
  const total = Number(frais.montant_apres_bourse) || 1
  const paye = calculerTotalPaye(frais)
  return Math.min(Math.round((paye / total) * 100), 100)
}

// Nom du mois en cours
const moisEnCours = computed(() => {
  return new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
})

// Gestion du modal de reçu
const openRecuModal = (item) => {
  selectedItem.value = item
  showRecuModal.value = true
}

const closeRecuModal = () => {
  showRecuModal.value = false
  selectedItem.value = null
}

const getEcheanceLabel = (echeanceId) => {
  if (!selectedItem.value || !selectedItem.value.echeances) return 'N/A'
  const echeance = selectedItem.value.echeances.find(e => e.id === echeanceId)
  return echeance?.libelle || 'N/A'
}

const getModePaiementLabel = (mode) => {
  const labels = {
    especes: 'Espèces',
    banque: 'Banque',
    semoa: 'SEMOA',
    caisse: 'Espèces',
    carte: 'Carte',
    virement: 'Virement',
    cheque: 'Chèque'
  }
  return labels[mode] || mode
}

const downloadRecu = async () => {
  if (!recuContent.value) return
  
  isDownloadingRecu.value = true
  
  try {
    // Charger html2pdf dynamiquement
    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default
    
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `recu_${selectedItem.value?.etudiant?.matricule || 'etudiant'}_${formatDateForRef(new Date())}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        logging: false, 
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: false
      },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }
    
    await html2pdf().set(opt).from(recuContent.value).save()
    $toastr.success('Reçu téléchargé avec succès')
  } catch (error) {
    console.error('Erreur téléchargement reçu:', error)
    $toastr.error('Erreur lors du téléchargement du reçu')
  } finally {
    isDownloadingRecu.value = false
  }
}
</script>

<style scoped>
/* Masquer la scrollbar tout en gardant la fonctionnalité */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Animation pour les cartes */
.group:hover {
  transform: translateY(-2px);
}

/* Styles pour le reçu PDF */
.recu-pdf-container {
  font-family: Arial, Helvetica, sans-serif;
}

.recu-pdf {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.recu-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 35px 30px 25px;
  text-align: center;
  border-bottom: 1px solid #eef2f6;
  position: relative;
}

.recu-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 10%;
  width: 80%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
}


.recu-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.recu-header h1 {
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 8px 0;
}
.recu-subtitle {
  color: #64748b;
  font-size: 15px;
  font-weight: 500;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.recu-matricule {
  background: rgba(255,255,255,0.1);
  padding: 6px 15px;
  border-radius: 30px;
  display: inline-block;
  margin-top: 15px;
  font-size: 14px;
}

.recu-content {
  padding: 30px;
}

.recu-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 25px;
}

.recu-card {
  background: #f8fafc;
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.recu-card h3 {
  color: #4f46e5;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 15px 0;
  text-transform: uppercase;
}

.recu-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #e2e8f0;
}

.recu-row:last-child {
  border-bottom: none;
}

.recu-label {
  color: #64748b;
  font-size: 13px;
}

.recu-value {
  font-weight: 600;
  color: #1e293b;
  font-size: 13px;
}

.recu-section-title {
  font-size: 16px;
  margin: 20px 0 10px 0;
  font-weight: 600;
}

.recu-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.recu-table th {
  background: #f1f5f9;
  padding: 12px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.recu-table td {
  padding: 12px;
  border-top: 1px solid #e2e8f0;
  font-size: 13px;
}

.recu-text-right {
  text-align: right;
}

.recu-text-center {
  text-align: center;
}

.recu-font-bold {
  font-weight: 600;
}

.recu-empty {
  color: #94a3b8;
  padding: 30px;
}

.recu-total {
  display: flex;
  justify-content: flex-end;
  gap: 30px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 2px solid #e2e8f0;
}

.recu-total-item {
  text-align: right;
}

.recu-total-label {
  font-size: 12px;
  color: #64748b;
}

.recu-total-value {
  font-size: 18px;
  font-weight: bold;
  color: #1e293b;
}

.recu-paye {
  color: #059669;
}

.recu-reste {
  color: #d97706;
}

.recu-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.recu-footer-label {
  color: #64748b;
  font-size: 12px;
  margin-bottom: 5px;
}

.recu-footer-value {
  font-weight: 600;
}

.recu-signature {
  text-align: right;
}

.recu-signature-line {
  border-top: 2px dashed #cbd5e1;
  width: 200px;
  margin-top: 10px;
}
</style>