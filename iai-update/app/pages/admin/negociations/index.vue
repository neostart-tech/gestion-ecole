<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 lg:p-8 transition-colors">
    <!-- Breadcrumb personnalisé -->
    <Breadcrumb
      :items="[
        { label: 'Tableau de bord', to: '/admin/dashboard' },
        { label: 'Frais scolaires', to: '/admin/negociations' },
        { label: 'Gestion des frais', to: null }
      ]"
      title="Gestion des frais étudiants"
      title-class="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
      spacing="mb-6"
    />

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
          <span class="text-green-600 dark:text-green-400">+{{ stats?.en_cours || 0 }}</span> en cours
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

      <!-- Montant total -->
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
          Total: {{ formatMontant(stats?.montant_total) }}
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

            <template #statut="data">
              <span class="inline-flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full" :class="{
                  'bg-green-500': data.value.statut === 'solde',
                  'bg-yellow-500': data.value.statut === 'en_cours',
                  'bg-red-500': data.value.statut === 'en_retard'
                }"></span>
                <span class="text-xs font-medium" :class="{
                  'text-green-700 dark:text-green-300': data.value.statut === 'solde',
                  'text-yellow-700 dark:text-yellow-300': data.value.statut === 'en_cours',
                  'text-red-700 dark:text-red-300': data.value.statut === 'en_retard'
                }">
                  {{ getStatutLabel(data.value.statut) }}
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

            <template #actions="data">
              <NuxtLink
                :to="`/admin/negociations/${getDetailId(data.value)}`"
                class="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 text-indigo-700 dark:text-indigo-300 rounded-lg hover:from-indigo-100 hover:to-indigo-200 dark:hover:from-indigo-900/30 dark:hover:to-indigo-800/30 transition-all text-xs sm:text-sm font-medium group"
              >
                <svg class="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span class="hidden sm:inline">Détails</span>
              </NuxtLink>
            </template>
          </Vue3Datatable>

          <!-- Pied du tableau -->
          <div class="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Affichage de <span class="font-medium">{{ filteredData.length }}</span> résultat{{ filteredData.length > 1 ? 's' : '' }}
            </div>
            
            <!-- Pagination personnalisée si nécessaire -->
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Vue3Datatable from "@bhplugin/vue3-datatable"
import "@bhplugin/vue3-datatable/dist/style.css"
import Breadcrumb from "~/components/Breadcrumb.vue"
import { useNegociationStore } from '~~/stores/negociation'
import { useAnneScolaireStore } from '~~/stores/annee-scolaire'

const { $toastr } = useNuxtApp()

// Stores
const negociationStore = useNegociationStore()
const anneeStore = useAnneScolaireStore()

// États
const activeTab = ref('frais')
const searchQuery = ref('')
const filtreAnnee = ref('')
const filtreStatut = ref('')
const isLoading = ref(false)
const isPageLoading = ref(true)
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Données
const annees = ref([])

// Configuration des tabs
const tabs = [
  {
    id: 'frais',
    label: 'Tous les frais',
    icon: '<svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>',
    badge: computed(() => negociationStore.negociations?.length),
    badgeClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
  },
  {
    id: 'echeances',
    label: 'Échéances à venir',
    icon: '<svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>',
    badge: computed(() => negociationStore.echeancesAVenir?.length),
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
  },
  {
    id: 'retard',
    label: 'En retard',
    icon: '<svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>',
    badge: computed(() => negociationStore.echeancesEnRetard?.length),
    badgeClass: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  }
]

// Colonnes pour les frais
const fraisColumns = ref([
  { field: "etudiant", title: "Étudiant", visible: true },
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
      liste = liste.filter(f => f.statut === filtreStatut.value)
    }
    
    return liste
  } else if (activeTab.value === 'echeances') {
    return negociationStore.echeancesAVenir || []
  } else {
    return negociationStore.echeancesEnRetard || []
  }
})

// Statistiques
const stats = computed(() => negociationStore.stats)

// Filtres actifs
const hasActiveFilters = computed(() => {
  return filtreAnnee.value || filtreStatut.value
})

// Chargement initial
onMounted(async () => {
  isPageLoading.value = true
  try {
    await Promise.all([
      negociationStore.fetchNegociations(),
      negociationStore.fetchDashboard(),
      anneeStore.fetchAnneeScolaire()
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
  return item.frais_etudiant_id
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

const formatMontant = (montant) => {
  if (montant === undefined || montant === null) return '0 FCFA'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
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

const calculerTotalPaye = (frais) => {
  if (!frais.echeances) return 0
  return frais.echeances.reduce((sum, e) => sum + (e.montant_paye || 0), 0)
}

const pourcentage = (frais) => {
  const total = frais.montant_apres_bourse || 1
  const paye = calculerTotalPaye(frais)
  return Math.min(Math.round((paye / total) * 100), 100)
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

</style>