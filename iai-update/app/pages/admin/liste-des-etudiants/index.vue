<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Groupes', to: '/' },
        { label: 'Étudiants', to: null },
      ]"
      title="Liste des étudiants"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Toolbar modifié -->
    <div class="flex flex-col gap-4 mb-5">
      <!-- Première ligne : recherche et actions -->
      <div
        class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between"
      >
        <!-- Recherche -->
        <!-- Recherche masquée (déplacée en bas) -->
        <div class="hidden relative w-full lg:w-80">
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Rechercher par nom, prénom ou matricule..."
            class="w-full px-4 py-2 pl-10 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <svg
            class="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Colonnes -->
          <client-only>
            <VDropdown placement="bottom-end">
              <button
                class="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                Colonnes
                <svg
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </button>

              <template #popper>
                <div
                  class="w-56 p-3 rounded-lg shadow-lg bg-white dark:bg-gray-800"
                >
                  <div
                    v-for="col in columns"
                    :key="col.field"
                    class="flex items-center gap-2 py-1"
                  >
                    <input
                      type="checkbox"
                      v-model="col.visible"
                      :disabled="col.field === 'action'"
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

          <!-- Boutons d'action -->
          <div class="flex gap-2">
            <!-- Export -->
            <button
              @click="processExport"
              :disabled="exportLoading"
              class="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Exporter les étudiants"
            >
              <svg
                v-if="exportLoading"
                class="w-5 h-5 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <svg
                v-else
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Exporter
            </button>

            <!-- Format Requis -->
            <button
              @click="showFormatRequisModal = true"
              class="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors whitespace-nowrap"
              title="Voir le format Excel requis"
            >
              <svg
                class="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Format Requis
            </button>
            
            <!--
            <Can action="create-etudiant">
              <button
                @click="openImportModal"
                class="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-colors"
                title="Importer des étudiants"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <svg
                v-else
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Exporter
            </button>

            Format Requis
            <button
              @click="showFormatRequisModal = true"
              class="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors whitespace-nowrap"
              title="Voir le format Excel requis"
            >
              <svg
                class="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Format Requis
            </button>
            
            -->
            <!-- Import -->
            <Can action="create-etudiant">
              <button
                @click="openImportModal"
                class="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-colors"
                title="Importer des étudiants"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Importer
              </button>
            </Can>

            <!-- Nouveau -->
            <Can action="create-etudiant">
              <NuxtLink
                to="/admin/liste-des-etudiants/ajouter"
                class="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-colors whitespace-nowrap"
                title="Inscrire un étudiant"
              >
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nouveau
              </NuxtLink>
            </Can>
          </div>
        </div>
      </div>

      <!-- Zone de Recherche et Filtres -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 mb-2 mt-4">
        <div class="flex flex-col xl:flex-row gap-4 xl:items-end">
          
          <!-- Nouvelle Recherche -->
          <div class="w-full xl:w-1/3">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recherche
            </label>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Rechercher par nom, prénom ou matricule..."
                class="w-full px-4 py-2 pl-10 rounded-lg border bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <svg
                class="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Filtres avancés avec PrimeVue -->
          <div class="w-full xl:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

        <!-- Filtre par Niveau -->
        <div class="relative">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Niveau
          </label>
          <Dropdown
            v-model="filters.niveau"
            :options="niveauOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Tous les niveaux"
            class="w-full"
            :showClear="true"
            @change="onNiveauChange"
          />
        </div>

        <!-- Filtre par Filière -->
        <div class="relative">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Filière
          </label>
          <Dropdown
            v-model="filters.filiere"
            :options="filiereOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Toutes les filières"
            class="w-full"
            :showClear="true"
            :disabled="!filters.niveau"
            @change="onFiliereChange"
          />
        </div>

        <!-- Filtre par Groupe -->
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Groupe</label>
          <Dropdown
            v-model="filters.groupe"
            :options="groupeOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Tous les groupes"
            class="w-full"
            :showClear="true"
            :disabled="!filters.filiere"
          />
        </div>

        <!-- Réinitialiser les filtres -->
        <div class="flex items-end">
          <button
            @click="resetFilters"
            :disabled="!hasActiveFilters"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Réinitialiser
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>

    <!-- Résumé des filtres actifs -->
    <div v-if="hasActiveFilters" class="flex items-center flex-wrap gap-2 text-sm mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
      <span class="text-gray-500 dark:text-gray-400 font-medium">Filtres actifs:</span>
      <span v-if="filters.niveau" class="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
        Niveau: {{ getNiveauLabel(filters.niveau) }}
        <button @click="filters.niveau = null" class="ml-1 hover:text-blue-900 dark:hover:text-blue-100">×</button>
      </span>
      <span v-if="filters.filiere" class="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full border border-green-200 dark:border-green-800">
        Filière: {{ getFiliereLabel(filters.filiere) }}
        <button @click="filters.filiere = null" class="ml-1 hover:text-green-900 dark:hover:text-green-100">×</button>
      </span>
      <span v-if="filters.groupe" class="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full border border-purple-200 dark:border-purple-800">
        Groupe: {{ getGroupeLabel(filters.groupe) }}
        <button @click="filters.groupe = null" class="ml-1 hover:text-purple-900 dark:hover:text-purple-100">×</button>
      </span>
    </div>

    <!-- Résumé des effectifs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total étudiants</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalEtudiants }}</p>
          </div>
          <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Hommes</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.hommes }}</p>
          </div>
          <div class="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Femmes</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.femmes }}</p>
          </div>
          <div class="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
            <svg class="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Groupes</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalGroupes }}</p>
          </div>
          <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Table avec Vue3Datatable -->
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-3 sm:p-4">
    <div v-if="etdudiantStore.isLoading" class="flex justify-center py-10">
      <div class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
    </div>

    <div v-else class="overflow-x-auto">
      <Vue3Datatable
        :columns="visibleColumns"
        :rows="filteredRows"
        :search="searchQuery"
        :per-page="itemsPerPage"
        skin="bh-table-striped bh-table-hover"
      >
        <template #action="data">
          <div class="flex justify-center gap-3">
            <NuxtLink
              :to="`/admin/liste-des-etudiants/${data.value.raw.slug}/detail`"
              class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
              title="Voir les détails"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </NuxtLink>

            <Can action="update-etudiant">
              <NuxtLink
                :to="`/admin/liste-des-etudiants/${data.value.raw.slug}/modifier`"
                class="p-2 rounded-lg text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors duration-200"
                title="Modifier les informations"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </NuxtLink>
            </Can>

            <Can action="delete-etudiant">
              <button
                @click="toggleEtudiantStatus(data.value)"
                class="p-2 rounded-lg transition-colors duration-200"
                :class="data.value.statut === 'actif' ? 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30' : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30'"
                :title="data.value.statut === 'actif' ? 'Désactiver l\'étudiant' : 'Réactiver l\'étudiant'"
              >
                <svg v-if="data.value.statut === 'actif'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </Can>
          </div>
        </template>

          <!--

                  :class="data.value.statut === 'actif' ? 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30' : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30'"
                  :title="data.value.statut === 'actif' ? 'Désactiver l\'étudiant' : 'Réactiver l\'étudiant'"
                >
                  <svg
                    v-if="data.value.statut === 'actif'"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                  <svg
                    v-else
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </Can>
            </div>
          </template>

          <!-- Template personnalisé pour le genre -->
          <template #genre="data">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="{
                'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300':
                  data.value.genre === 'Masculin',
                'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300':
                  data.value.genre === 'Féminin',
              }"
            >
              {{ data.value.genre }}
            </span>
          </template>

          <!-- Template pour le groupe -->
          <template #groupe="data">
            <span
              v-if="data.value.groupe"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
            >
              {{ data.value.groupe }}
            </span>
            <span v-else class="text-gray-400">-</span>
          </template>

          <!-- Template pour le statut -->
          <template #statut="data">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="{
                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300':
                  data.value.statut === 'actif',
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300':
                  data.value.statut === 'inactif',
              }"
            >
              {{ data.value.statut === 'actif' ? 'Actif' : 'Inactif' }}
            </span>
          </template>
        </Vue3Datatable>
      </div>
    </div>

    <!-- Modal de détail étudiant (design inchangé) -->
    <TransitionRoot appear :show="showDetailModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeDetailModal">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/60" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
              >
                <!-- En-tête de la modale -->
                <div class="flex items-start justify-between mb-6">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-3">
                      <div
                        class="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md"
                      >
                        <svg
                          class="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <DialogTitle
                          class="text-2xl font-bold text-gray-900 dark:text-white"
                        >
                          {{ selectedEtudiant?.prenom }}
                          {{ selectedEtudiant?.nom }}
                        </DialogTitle>
                        <p
                          class="text-gray-600 dark:text-gray-400 text-sm mt-1"
                        >
                          {{ selectedEtudiant?.matricule }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    @click="closeDetailModal"
                    class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Fermer"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <!-- Contenu principal -->
                <div class="space-y-6">
                  <!-- Informations personnelles -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                      <div class="flex items-center gap-3 mb-2">
                        <div
                          class="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-lg"
                        >
                          <svg
                            class="w-5 h-5 text-blue-600 dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 8l7.89-5.26a2 2 0 012.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <h3
                          class="font-semibold text-gray-700 dark:text-gray-300"
                        >
                          Email
                        </h3>
                      </div>
                      <div class="ml-11">
                        <p
                          class="text-lg font-medium text-gray-900 dark:text-white"
                        >
                          {{ selectedEtudiant?.email || "Non renseigné" }}
                        </p>
                      </div>
                    </div>

                    <div
                      class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4"
                    >
                      <div class="flex items-center gap-3 mb-2">
                        <div
                          class="p-2 bg-purple-100 dark:bg-purple-800/30 rounded-lg"
                        >
                          <svg
                            class="w-5 h-5 text-purple-600 dark:text-purple-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <h3
                          class="font-semibold text-gray-700 dark:text-gray-300"
                        >
                          Téléphone
                        </h3>
                      </div>
                      <div class="ml-11">
                        <p
                          class="text-lg font-medium text-gray-900 dark:text-white"
                        >
                          {{ selectedEtudiant?.tel || "Non renseigné" }}
                        </p>
                      </div>
                    </div>

                    <div
                      class="bg-green-50 dark:bg-green-900/20 rounded-xl p-4"
                    >
                      <div class="flex items-center gap-3 mb-2">
                        <div
                          class="p-2 bg-green-100 dark:bg-green-800/30 rounded-lg"
                        >
                          <svg
                            class="w-5 h-5 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3"
                            />
                          </svg>
                        </div>
                        <h3
                          class="font-semibold text-gray-700 dark:text-gray-300"
                        >
                          Genre
                        </h3>
                      </div>
                      <div class="ml-11">
                        <span
                          class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                          :class="
                            selectedEtudiant?.genre === 'Masculin'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300'
                              : 'bg-pink-100 text-pink-800 dark:bg-pink-800/30 dark:text-pink-300'
                          "
                        >
                          {{ selectedEtudiant?.genre || "Non spécifié" }}
                        </span>
                      </div>
                    </div>

                    <div
                      class="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4"
                    >
                      <div class="flex items-center gap-3 mb-2">
                        <div
                          class="p-2 bg-amber-100 dark:bg-amber-800/30 rounded-lg"
                        >
                          <svg
                            class="w-5 h-5 text-amber-600 dark:text-amber-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h3
                          class="font-semibold text-gray-700 dark:text-gray-300"
                        >
                          Nationalité
                        </h3>
                      </div>
                      <div class="ml-11">
                        <p
                          class="text-lg font-medium text-gray-900 dark:text-white"
                        >
                          {{ selectedEtudiant?.nationalite || "Non renseigné" }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Informations académiques -->
                  <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <div class="flex items-center gap-3 mb-4">
                      <div
                        class="p-2 bg-indigo-100 dark:bg-indigo-800/30 rounded-lg"
                      >
                        <svg
                          class="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <h3
                        class="font-semibold text-gray-700 dark:text-gray-300"
                      >
                        Informations académiques
                      </h3>
                    </div>
                    <div class="grid grid-cols-2 gap-3 ml-11">
                      <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          Année d'admission
                        </p>
                        <p class="font-medium text-gray-900 dark:text-white">
                          {{
                            selectedEtudiant?.annee_admission || "Non renseigné"
                          }}
                        </p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          Date de naissance
                        </p>
                        <p class="font-medium text-gray-900 dark:text-white">
                          {{ formatDate(selectedEtudiant?.date_naissance) }}
                        </p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          Groupe
                        </p>
                        <p class="font-medium text-gray-900 dark:text-white">
                          {{ selectedEtudiant?.groupe_nom || "Non assigné" }}
                        </p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          Filière
                        </p>
                        <p class="font-medium text-gray-900 dark:text-white">
                          {{ selectedEtudiant?.filiere_nom || "Non assignée" }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer de la modale -->
                <div
                  class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4"
                >
                  <button
                    type="button"
                    @click="closeDetailModal"
                    class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Fermer
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal d'importation (design inchangé) -->
    <TransitionRoot appear :show="showImportModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeImportModal">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/60" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
              >
                <!-- En-tête de la modale -->
                <div class="flex items-start justify-between mb-6">
                  <DialogTitle
                    class="text-xl font-bold text-gray-900 dark:text-white"
                  >
                    Importer des étudiants
                  </DialogTitle>
                  <button
                    @click="closeImportModal"
                    class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Fermer"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <!-- Contenu de la modale -->
                <div class="space-y-4">
                  <div class="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 flex items-center justify-between border border-indigo-100 dark:border-indigo-800/30">
                    <p class="text-sm text-gray-600 dark:text-gray-400">Besoin d'aide sur le format ?</p>
                    <button @click="showFormatRequisModal = true" class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Format requis</button>
                  </div>
                  <!-- Zone de dépôt de fichier -->
                  <div
                    @dragover.prevent="dragOver = true"
                    @dragleave.prevent="dragOver = false"
                    @drop.prevent="handleFileDrop"
                    :class="[
                      'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                      dragOver
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400',
                    ]"
                  >
                    <input
                      type="file"
                      ref="fileInput"
                      @change="handleFileSelect"
                      accept=".xlsx,.xls"
                      class="hidden"
                    />

                    <div class="space-y-3">
                      <div
                        class="mx-auto w-16 h-16 bg-indigo-100 dark:bg-indigo-800/30 rounded-full flex items-center justify-center"
                      >
                        <svg
                          class="w-8 h-8 text-indigo-600 dark:text-indigo-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>

                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">
                          Glissez-déposez votre fichier ici
                        </p>
                        <p
                          class="text-sm text-gray-500 dark:text-gray-400 mt-1"
                        >
                          ou
                        </p>
                        <button
                          type="button"
                          @click="$refs.fileInput.click()"
                          class="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Parcourir les fichiers
                        </button>
                      </div>

                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Formats supportés : .xlsx, .xls
                      </p>
                    </div>
                  </div>

                  <!-- Fichier sélectionné -->
                  <div
                    v-if="selectedFile"
                    class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <svg
                          class="w-5 h-5 text-green-600 dark:text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <p class="font-medium text-gray-900 dark:text-white">
                            {{ selectedFile.name }}
                          </p>
                          <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ (selectedFile.size / 1024).toFixed(2) }} KB
                          </p>
                        </div>
                      </div>
                      <button
                        @click="removeFile"
                        class="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Message d'erreur -->
                  <div
                    v-if="importError"
                    class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mt-4"
                  >
                    <div class="flex items-center gap-2">
                      <svg
                        class="w-5 h-5 text-red-500 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p class="text-red-700 dark:text-red-300 text-sm">
                        {{ importError }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Footer de la modale -->
                <div
                  class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4"
                >
                  <button
                    type="button"
                    @click="closeImportModal"
                    class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    @click="processImport"
                    :disabled="!selectedFile || importLoading"
                    :class="[
                      'px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-all duration-200 flex items-center gap-2',
                      selectedFile && !importLoading
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                        : 'bg-gray-400 cursor-not-allowed',
                    ]"
                  >
                    <svg
                      v-if="importLoading"
                      class="w-4 h-4 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      />
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {{ importLoading ? "Importation..." : "Importer" }}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal Format Requis -->
    <TransitionRoot appear :show="showFormatRequisModal" as="template">
      <Dialog as="div" @close="showFormatRequisModal = false" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 sm:p-8 text-left align-middle shadow-2xl transition-all">
                <div class="flex justify-between items-center mb-6">
                  <DialogTitle as="h3" class="text-xl font-bold leading-6 text-gray-900 dark:text-white flex items-center gap-3">
                    <div class="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                      <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    Format Requis pour l'Importation
                  </DialogTitle>
                  <button @click="showFormatRequisModal = false" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <div class="space-y-6">
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Votre fichier Excel <span class="font-semibold text-gray-800 dark:text-gray-200">(.xlsx)</span> doit impérativement contenir une première ligne d'en-tête. Les colonnes obligatoires sont marquées d'un label <span class="px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-bold uppercase tracking-wide">Requis</span>. L'ordre des colonnes n'a pas d'importance.
                  </p>
                  
                  <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <table class="min-w-full text-left text-sm whitespace-nowrap">
                      <thead class="bg-gray-50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-700">
                        <tr>
                          <th class="px-4 py-3.5 border-r border-gray-200 dark:border-gray-700 w-1/4">En-tête (Nom exact)</th>
                          <th class="px-4 py-3.5 border-r border-gray-200 dark:border-gray-700 w-24 text-center">Statut</th>
                          <th class="px-4 py-3.5 border-r border-gray-200 dark:border-gray-700">Description</th>
                          <th class="px-4 py-3.5 w-1/4">Exemple</th>
                        </tr>
                      </thead>
                      <tbody class="text-gray-600 dark:text-gray-400 divide-y divide-gray-200 dark:border-gray-700">
                        <tr class="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors">
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 font-mono text-indigo-600 dark:text-indigo-400 font-medium">nom</td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-center"><span class="px-2 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-bold uppercase tracking-wide">Requis</span></td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-xs">Nom de famille de l'étudiant</td>
                          <td class="px-4 py-3 text-xs italic">Dupont</td>
                        </tr>
                        <tr class="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors">
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 font-mono text-indigo-600 dark:text-indigo-400 font-medium">prenoms</td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-center"><span class="px-2 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-bold uppercase tracking-wide">Requis</span></td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-xs">Prénom(s) de l'étudiant</td>
                          <td class="px-4 py-3 text-xs italic">Jean Marc</td>
                        </tr>
                        <tr class="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors bg-gray-50/50 dark:bg-gray-800/30">
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 font-mono text-indigo-600 dark:text-indigo-400 font-medium flex flex-col gap-1">numero_matricule <span class="text-[10px] text-gray-400">ou "numero matricule"</span></td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-center"><span class="px-2 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-bold uppercase tracking-wide">Requis</span></td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-xs">Identifiant unique de l'étudiant</td>
                          <td class="px-4 py-3 text-xs italic">2024001</td>
                        </tr>
                        <tr class="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors">
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 font-mono text-indigo-600 dark:text-indigo-400 font-medium flex flex-col gap-1">nom_de_la_filiere <span class="text-[10px] text-gray-400">ou "nom de la filiere"</span></td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-center"><span class="px-2 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-bold uppercase tracking-wide">Requis</span></td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-xs">Nom exact de la filière (Créée si inexistante)</td>
                          <td class="px-4 py-3 text-xs italic">Informatique</td>
                        </tr>
                        <tr class="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors bg-gray-50/50 dark:bg-gray-800/30">
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 font-mono text-indigo-600 dark:text-indigo-400 font-medium">niveau</td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-center"><span class="px-2 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-bold uppercase tracking-wide">Requis</span></td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-xs">Niveau exact (Créé si inexistant)</td>
                          <td class="px-4 py-3 text-xs italic">Licence 1</td>
                        </tr>
                        <tr class="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors">
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 font-mono text-gray-700 dark:text-gray-300 font-medium">sexe</td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-center"><span class="px-2 py-1 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wide">Optionnel</span></td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-xs">"Masculin" (M/Homme) ou "Féminin" (F/Femme)</td>
                          <td class="px-4 py-3 text-xs italic">Masculin</td>
                        </tr>
                        <tr class="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors bg-gray-50/50 dark:bg-gray-800/30">
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 font-mono text-gray-700 dark:text-gray-300 font-medium flex flex-col gap-1">mode_formation <span class="text-[10px] text-gray-400">ou "mode de formation"</span></td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-center"><span class="px-2 py-1 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wide">Optionnel</span></td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-xs">"Présentiel" (par défaut) ou "En ligne"</td>
                          <td class="px-4 py-3 text-xs italic">Présentiel</td>
                        </tr>
                        <tr class="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors">
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 font-mono text-gray-700 dark:text-gray-300 font-medium flex flex-col gap-1">date_de_naissance <span class="text-[10px] text-gray-400">ou "date de naissance"</span></td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-center"><span class="px-2 py-1 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wide">Optionnel</span></td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-xs">Format date standard Excel ou AAAA-MM-JJ</td>
                          <td class="px-4 py-3 text-xs italic">2001-05-15</td>
                        </tr>
                        <tr class="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors bg-gray-50/50 dark:bg-gray-800/30">
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 font-mono text-gray-700 dark:text-gray-300 font-medium">contact</td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-center"><span class="px-2 py-1 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wide">Optionnel</span></td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-xs">Numéro de téléphone</td>
                          <td class="px-4 py-3 text-xs italic">+241 01 02 03 04</td>
                        </tr>
                        <tr class="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors">
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 font-mono text-gray-700 dark:text-gray-300 font-medium">nationalite</td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-center"><span class="px-2 py-1 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wide">Optionnel</span></td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-xs">Pays d'origine</td>
                          <td class="px-4 py-3 text-xs italic">Gabonaise</td>
                        </tr>
                        <tr class="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors bg-gray-50/50 dark:bg-gray-800/30">
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 font-mono text-gray-700 dark:text-gray-300 font-medium flex flex-col gap-1">numero_de_cni <span class="text-[10px] text-gray-400">ou "numero de cni"</span></td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-center"><span class="px-2 py-1 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wide">Optionnel</span></td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-xs">Numéro de pièce d'identité</td>
                          <td class="px-4 py-3 text-xs italic">123456789</td>
                        </tr>
                        <tr class="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors">
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 font-mono text-gray-700 dark:text-gray-300 font-medium">email</td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-center"><span class="px-2 py-1 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wide">Optionnel</span></td>
                          <td class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-xs">Généré automatiquement si laissé vide</td>
                          <td class="px-4 py-3 text-xs italic">jean.dupont@email.com</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 p-4 rounded-r-lg">
                    <div class="flex items-start">
                      <div class="flex-shrink-0 mt-0.5">
                        <svg class="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm text-indigo-800 dark:text-indigo-300">
                          <strong>Note de traitement :</strong> Lors de l'import, le système vérifie le <span class="font-bold">numéro matricule</span>. Si un matricule correspond à un étudiant existant, ses données seront <strong>mises à jour</strong>. Sinon, un <strong>nouvel étudiant sera créé</strong>. Les frais d'inscription et de scolarité associés à l'année en cours seront générés automatiquement.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      @click="showFormatRequisModal = false"
                      class="px-5 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
                    >
                      J'ai compris
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import { useRoute } from "vue-router";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";
import Dropdown from "primevue/dropdown";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useGroupeStore } from "~~/stores/group";
import { useEtudiantStore } from "~~/stores/etudiant";
import { useNiveauStore } from "~~/stores/niveau";
import { useFiliereStore } from "~~/stores/filiere";

const route = useRoute();
const { $toastr, $swal } = useNuxtApp();
const groupeStore = useGroupeStore();
const niveauStore = useNiveauStore();
const filiereStore = useFiliereStore();
const etdudiantStore = useEtudiantStore();

// Références
const searchQuery = ref("");
const showDetailModal = ref(false);
const showImportModal = ref(false);
const showFormatRequisModal = ref(false);
const showAddModal = ref(false);
const showEditModal = ref(false);
const selectedEtudiant = ref(null);
const selectedFile = ref(null);
const dragOver = ref(false);
const importLoading = ref(false);
const addLoading = ref(false);
const importError = ref("");
const exportLoading = ref(false);
const itemsPerPage = ref(10);
const fileInput = ref(null);

const editForm = ref({
  nom: "",
  prenom: "",
  email: "",
  tel: "",
  genre: "",
  nationalite: "",
  date_naissance: "",
  lieu_naissance: "",
  group_id: null,
});

const addForm = ref({
  nom: "",
  prenom: "",
  matricule: "",
  genre: "Masculin",
  date_naissance: "",
  email: "",
  tel: "",
  nationalite: "",
  lieu_naissance: "",
  filiere_id: null,
  niveau_id: null,
  group_id: null,
  mode_formation: "Présentiel",
});

// Filtres
const filters = ref({
  niveau: null,
  filiere: null,
  groupe: null,
});

// Options pour les dropdowns
const niveauOptions = computed(() => {
  return niveauStore.niveaux.map((n) => ({
    label: n.libelle,
    value: n.id,
  }));
});

const filiereOptions = computed(() => {
  if (!filters.value.niveau) return [];

  const groupesDansNiveau = groupeStore.groupes.filter(
    (g) => g.niveau.id === filters.value.niveau,
  );
  const filiereIds = [
    ...new Set(groupesDansNiveau.flatMap((g) => g.filieres.map((f) => f.id))),
  ];

  return filiereStore.filieres
    .filter((f) => filiereIds.includes(f.id))
    .map((f) => ({
      label: f.nom,
      value: f.id,
    }));
});

const addFiliereOptions = computed(() => {
  if (!addForm.value.niveau_id) return [];
  return filiereStore.filieres.map((f) => ({
    label: f.nom,
    value: f.id,
  }));
});

const onAddNiveauChange = () => {
  addForm.value.filiere_id = null;
};

const groupeOptions = computed(() => {
  if (!filters.value.filiere) return [];

  return groupeStore.groupes
    .filter((g) => {
      const matchNiveau =
        !filters.value.niveau || g.niveau.id === filters.value.niveau;
      const matchFiliere = g.filieres.some(
        (f) => f.id === filters.value.filiere,
      );
      return matchNiveau && matchFiliere;
    })
    .map((g) => ({
      label: `${g.nom} (${g.niveau.libelle})`,
      value: g.id,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
});

const editGroupOptions = computed(() => {
  if (!selectedEtudiant.value || !selectedEtudiant.value.dernier_groupe) return [];
  const levelId = selectedEtudiant.value.dernier_groupe.niveau.id;
  return groupeStore.groupes
    .filter((g) => g.niveau.id === levelId)
    .map((g) => ({
      label: g.nom,
      value: g.id,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
});

// Vérifier si des filtres sont actifs
const hasActiveFilters = computed(() => {
  return filters.value.niveau || filters.value.filiere || filters.value.groupe;
});

// Statistiques
const stats = computed(() => {
  const etudiants = filteredRows.value || [];
  const hommes = etudiants.filter((e) => e.genre === "Masculin").length;
  const femmes = etudiants.filter((e) => e.genre === "Féminin").length;

  return {
    hommes,
    femmes,
    totalGroupes: groupeStore.groupes.length,
  };
});

const totalEtudiants = computed(() => filteredRows.value.length);

// Colonnes de la table
const columns = ref([
  { field: "matricule", title: "Matricule", visible: true },
  { field: "nom_complet", title: "Nom & Prénom", visible: true },
  { field: "email", title: "Email", visible: false },
  { field: "genre", title: "Genre", visible: true },
  { field: "tel", title: "Téléphone", visible: true },
  { field: "nationalite", title: "Nationalité", visible: false },
  { field: "groupe", title: "Groupe", visible: false },
  { field: "statut", title: "Statut", visible: true },
  { field: "action", title: "Actions", visible: true },
]);

const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

// Rows filtrées
const filteredRows = computed(() => {
  let filtered = etdudiantStore.etudiants.map((e) => {
    const groupe = groupeStore.groupes.find(
      (g) => g.inscrits > 0 && e.groupe_id === g.id,
    );

    return {
      id: e.id,
      matricule: e.matricule,
      nom_complet: `${e.nom} ${e.prenom}`,
      email: e.email || "--",
      genre: e.genre,
      tel: e.tel || "--",
      nationalite: e.nationalite || "--",
      annee_admission: e.annee_admission || "--",
      date_naissance: e.date_naissance,
      groupe:  `${e?.dernier_groupe?.niveau?.nom} ${e?.dernier_groupe?.group?.nom}` || null,
      groupe_id: e?.dernier_groupe?.group?.id || null,
      filiere_nom: e?.dernier_groupe?.filiere?.nom || null,
      statut: e.statut || "actif",
      raw: e,
    };
  });

  if (filters.value.niveau) {
    filtered = filtered.filter((e) => {
      const groupe = groupeStore.groupes.find((g) => g.id === e.groupe_id);
      return groupe?.niveau.id === filters.value.niveau;
    });
  }

  if (filters.value.filiere) {
    filtered = filtered.filter((e) => {
      const groupe = groupeStore.groupes.find((g) => g.id === e.groupe_id);
      return groupe?.filieres.some((f) => f.id === filters.value.filiere);
    });
  }

  if (filters.value.groupe) {
    filtered = filtered.filter((e) => e.groupe_id === filters.value.groupe);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.matricule.toLowerCase().includes(query) ||
        e.nom_complet.toLowerCase().includes(query) ||
        (e.email && e.email.toLowerCase().includes(query)),
    );
  }

  return filtered;
});

// Fonctions utilitaires
const formatDate = (dateString) => {
  if (!dateString) return "--";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
};

const getNiveauLabel = (id) => {
  const niveau = niveauStore.niveaux.find((n) => n.id === id);
  return niveau?.libelle || "Niveau inconnu";
};

const getFiliereLabel = (id) => {
  const filiere = filiereStore.filieres.find((f) => f.id === id);
  return filiere?.nom || "Filière inconnue";
};

const getGroupeLabel = (id) => {
  const groupe = groupeStore.groupes.find((g) => g.id === id);
  return groupe ? `${groupe.nom} (${groupe.niveau.libelle})` : "Groupe inconnu";
};

const onNiveauChange = () => {
  filters.value.filiere = null;
  filters.value.groupe = null;
};

const onFiliereChange = () => {
  filters.value.groupe = null;
};

const resetFilters = () => {
  filters.value = {
    niveau: null,
    filiere: null,
    groupe: null,
  };
  searchQuery.value = "";
  $toastr.info("Filtres réinitialisés");
};

const openDetailModal = (item) => {
  selectedEtudiant.value = item.raw;
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedEtudiant.value = null;
};

const openImportModal = () => {
  showImportModal.value = true;
};

const closeImportModal = () => {
  showImportModal.value = false;
  selectedFile.value = null;
  importError.value = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const openEditModal = (item) => {
  selectedEtudiant.value = item.raw;
  editForm.value = {
    nom: item.raw.nom,
    prenom: item.raw.prenom,
    email: item.raw.email === "--" ? "" : item.raw.email,
    tel: item.raw.tel === "--" ? "" : item.raw.tel,
    genre: item.raw.genre,
    nationalite: item.raw.nationalite === "--" ? "" : item.raw.nationalite,
    date_naissance: item.raw.date_naissance ? item.raw.date_naissance.split("T")[0] : "",
    lieu_naissance: item.raw.lieu_naissance || "",
    group_id: item.raw.dernier_groupe?.group?.id,
  };
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedEtudiant.value = null;
};

const handleUpdateEtudiant = async () => {
  try {
    await etdudiantStore.updateEtudiant(selectedEtudiant.value.slug, editForm.value);
    $toastr.success("Informations mises à jour avec succès");
    await etdudiantStore.fetchEtudiants();
    closeEditModal();
  } catch (error) {
    console.error("Erreur mise à jour:", error);
    $toastr.error(error.response?.data?.message || "Erreur lors de la mise à jour");
  }
};

const handleFileDrop = (event) => {
  dragOver.value = false;
  const file = event.dataTransfer.files[0];
  if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
    selectedFile.value = file;
  } else {
    $toastr.error("Veuillez sélectionner un fichier Excel (.xlsx ou .xls)");
  }
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    const validExtensions = [".xlsx", ".xls"];
    const extension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (validExtensions.includes(extension)) {
      selectedFile.value = file;
      importError.value = "";
    } else {
      importError.value = "Format non supporté. Utilisez .xlsx ou .xls";
      $toastr.error("Format de fichier non supporté");
    }
  }
};

const removeFile = () => {
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const processImport = async () => {
  if (!selectedFile.value) {
    $toastr.error("Veuillez sélectionner un fichier.");
    return;
  }

  importLoading.value = true;
  importError.value = "";

  try {
    const formData = new FormData();
    formData.append("file", selectedFile.value);
    await etdudiantStore.importEtudiants(formData);
    $toastr.success("Importation réussie !");
    await etdudiantStore.fetchEtudiants();
    closeImportModal();
  } catch (error) {
    console.error("Erreur importation:", error);
    if (error.response?.data?.message) {
      importError.value = error.response.data.message;
    } else if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const errorMessages = [];
      Object.keys(errors).forEach((key) => {
        errorMessages.push(...errors[key]);
      });
      importError.value = errorMessages.join(". ");
    } else {
      importError.value =
        "Erreur lors de l'importation. Vérifiez le format du fichier.";
    }

    $toastr.error(importError.value);
  } finally {
    importLoading.value = false;
  }
};

const processExport = async () => {
  exportLoading.value = true;

  try {
    const response = await etdudiantStore.exportEtudiants({
      filters: filters.value,
    });

    const blob = response.data;

    if (blob instanceof Blob) {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      let filename = "etudiants.xlsx";
      const contentDisposition = response.headers["content-disposition"];

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      if (filename === "etudiants.xlsx") {
        const date = new Date().toISOString().split("T")[0];
        filename = `etudiants_${date}.xlsx`;
      }

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      $toastr.success("Exportation terminée !");
    } else {
      $toastr.error("Format de réponse invalide pour l'exportation");
    }
  } catch (error) {
    console.error("Erreur lors de l'exportation:", error);
    $toastr.error("Erreur lors de l'exportation.");
  } finally {
    exportLoading.value = false;
  }
};

const toggleEtudiantStatus = async (item) => {
  const isActif = item.statut === "actif";
  const action = isActif ? "désactiver" : "réactiver";

  const result = await $swal.fire({
    title: "Êtes-vous sûr ?",
    text: `Voulez-vous vraiment ${action} cet étudiant ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: isActif ? "#d33" : "#10b981",
    cancelButtonColor: "#3085d6",
    confirmButtonText: `Oui, ${action} !`,
    cancelButtonText: "Annuler",
  });

  if (result.isConfirmed) {
    try {
      await etdudiantStore.deleteEtudiant(item.raw.slug);
      $toastr.success(`Étudiant ${isActif ? "désactivé" : "réactivé"} avec succès`);
      await etdudiantStore.fetchEtudiants();
    } catch (error) {
      console.error(`Erreur lors du changement de statut:`, error);
      $toastr.error("Une erreur est survenue");
    }
  }
};

const submitAddForm = async () => {
  try {
    addLoading.value = true;
    const { $api } = useNuxtApp();
    const response = await $api.post('/admin/etudiants/store', addForm.value);
    $toastr.success(response.message || "Étudiant enregistré avec succès.");
    addForm.value = {
      nom: "",
      prenom: "",
      matricule: "",
      genre: "Masculin",
      date_naissance: "",
      email: "",
      tel: "",
      nationalite: "",
      filiere_id: null,
      niveau_id: null,
      mode_formation: "Présentiel",
    };
    showAddModal.value = false;
    await etdudiantStore.fetchEtudiants();
  } catch (error) {
    console.error("Erreur lors de l'ajout:", error);
    if (error.response?.data?.message) {
      $toastr.error(error.response.data.message);
    } else {
      $toastr.error("Erreur lors de l'enregistrement.");
    }
  } finally {
    addLoading.value = false;
  }
};

const loadData = async () => {
  await Promise.all([
    etdudiantStore.fetchEtudiants(),
    niveauStore.fetchNiveaux(),
    filiereStore.fetchFilieres(),
    groupeStore.fetchGroupes(),
  ]);
};

onMounted(async () => {
  await loadData();
});
</script>
