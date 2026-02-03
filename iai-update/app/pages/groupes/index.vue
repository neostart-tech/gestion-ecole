<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Groupes', to: '/' },
        { label: 'Liste', to: null },
      ]"
      title="Liste des groupes"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Toolbar -->
    <div
      class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5"
    >
      <!-- Recherche -->
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Rechercher..."
        class="w-full lg:w-64 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Colonnes -->
        <client-only>
          <VDropdown placement="bottom-end">
            <button
              class="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
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

        <!-- Ajouter -->
        <button
          @click="openAddModal"
          class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M12 5v14M5 12h14"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          Ajouter
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-3 sm:p-4">
      <div v-if="loading" class="flex justify-center py-10">
        <div
          class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"
        ></div>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="visibleColumns"
          :rows="rows"
          :search="searchQuery"
          :per-page="itemsPerPage"
          skin="bh-table-striped bh-table-hover"
        >
          <template #action="{ value }">
            <div class="flex justify-center gap-3">
              <button
                @click="openDetailModal(value)"
                class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                title="Voir les détails"
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            

              <!-- Edit -->
              <button
                @click="openEditModal(value)"
                class="p-2 rounded-lg text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
                title="Modifier"
              >
                <svg
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M4 20h4l10-10-4-4L4 16v4z"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
                <NuxtLink
               :to="`/groupes/etudiants/${value.slug}`"
                class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                title="Voir les détails"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <!-- Silhouette principale -->
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <!-- + overlay pour indiquer "voir" -->
                  <circle
                    cx="18"
                    cy="6"
                    r="1.5"
                    stroke-width="1"
                    class="opacity-70"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="M18 4v4M16 6h4"
                    class="opacity-70"
                  />
                </svg>
              </NuxtLink>

              <!-- Delete -->
              <button
                @click="deleteItem(value)"
                class="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
                title="Supprimer"
              >
                <svg
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M3 6h18M8 6v14m8-14v14M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>

    <!-- Modal de détail -->
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
                          {{ selectedEvent?.nom }}
                        </DialogTitle>
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
                  <!-- Section Informations principales -->
                  <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div
                      class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4"
                    >
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
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h3
                          class="font-semibold text-gray-700 dark:text-gray-300"
                        >
                          Niveau
                        </h3>
                      </div>
                      <div class="ml-11">
                        <p
                          class="text-lg font-medium text-gray-900 dark:text-white"
                        >
                          {{
                            selectedEvent?.niveau_obj?.libelle || "Non spécifié"
                          }}
                        </p>
                      </div>
                    </div>

                    <div
                      class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4"
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
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                        </div>
                        <h3
                          class="font-semibold text-gray-700 dark:text-gray-300"
                        >
                          Filières
                        </h3>
                        <span
                          class="ml-auto px-2 py-1 bg-purple-100 dark:bg-purple-800/30 text-purple-800 dark:text-purple-300 text-xs font-medium rounded-full"
                        >
                          {{ selectedEvent?.filieres_obj?.length || 0 }}
                        </span>
                      </div>
                      <div
                        v-if="selectedEvent?.filieres_obj?.length"
                        class="flex flex-wrap gap-2 mt-2 ml-11"
                      >
                        <span
                          v-for="filiere in selectedEvent.filieres_obj"
                          :key="filiere.id"
                          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-800/30 dark:to-pink-800/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-700/30"
                        >
                          <svg
                            class="w-3.5 h-3.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          {{ filiere.nom }}
                          <span class="text-xs opacity-75"
                            >({{ filiere.code }})</span
                          >
                        </span>
                      </div>
                      <p
                        v-else
                        class="text-gray-500 dark:text-gray-400 text-sm ml-11"
                      >
                        Aucune filière assignée
                      </p>
                    </div>
                  </div>

                  <!-- Section Détails des filières -->
                  <div
                    class="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4"
                  >
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center gap-3">
                        <div
                          class="p-2 bg-emerald-100 dark:bg-emerald-800/30 rounded-lg"
                        >
                          <svg
                            class="w-5 h-5 text-emerald-600 dark:text-emerald-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3
                            class="font-semibold text-gray-700 dark:text-gray-300"
                          >
                            Détails des filières
                          </h3>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            Informations complémentaires
                          </p>
                        </div>
                      </div>
                      <span
                        class="px-3 py-1 bg-emerald-100 dark:bg-emerald-800/30 text-emerald-800 dark:text-emerald-300 text-sm font-medium rounded-full"
                      >
                        {{ selectedEvent?.filieres_obj?.length || 0 }}
                        filière(s)
                      </span>
                    </div>

                    <div
                      v-if="selectedEvent?.filieres_obj?.length"
                      class="space-y-3"
                    >
                      <div
                        v-for="filiere in selectedEvent.filieres_obj"
                        :key="filiere.id"
                        class="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-emerald-100 dark:border-emerald-700/30"
                      >
                        <div class="flex-shrink-0"></div>
                        <div class="flex-1 min-w-0">
                          <p
                            class="font-medium text-gray-900 dark:text-white truncate"
                          >
                            {{ filiere.nom }}
                          </p>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            {{ filiere.code }}
                          </p>
                          <p
                            v-if="
                              filiere.description &&
                              filiere.description !== 'À fournir' &&
                              filiere.description !== 'A fournir'
                            "
                            class="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2"
                          >
                            {{ filiere.description }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div v-else class="text-center py-6">
                      <div
                        class="w-16 h-16 mx-auto mb-3 bg-emerald-100 dark:bg-emerald-800/30 rounded-full flex items-center justify-center"
                      >
                        <svg
                          class="w-8 h-8 text-emerald-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>
                      <p class="text-gray-500 dark:text-gray-400 mb-2">
                        Aucune filière assignée à ce groupe
                      </p>
                    </div>
                  </div>

                  <!-- Section Statistiques -->
                  <div
                    class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4"
                  >
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center gap-3">
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
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3
                            class="font-semibold text-gray-700 dark:text-gray-300"
                          >
                            Statistiques
                          </h3>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            Résumé du groupe
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div
                        class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-amber-100 dark:border-amber-700/30"
                      >
                        <p
                          class="text-2xl font-bold text-blue-600 dark:text-blue-400"
                        >
                          {{ selectedEvent?.filieres_obj?.length || 0 }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          Filières
                        </p>
                      </div>

                      <div
                        class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-amber-100 dark:border-amber-700/30"
                      >
                        <p
                          class="text-2xl font-bold text-amber-600 dark:text-amber-400"
                        >
                          {{ selectedEvent?.niveau_obj?.ordre || 0 }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          Niveau ordre
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer de la modale -->
                <div
                  class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4"
                >
                  <div
                    class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400"
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Groupe créé</span>
                  </div>

                  <div class="flex gap-3">
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
                    <button
                      type="button"
                      @click="editEvent"
                      class="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Modifier
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modale d'ajout/édition -->
    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeModal">
        <div class="fixed inset-0 bg-black/60" />

        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            class="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-5"
          >
            <DialogTitle
              class="text-lg font-semibold mb-4 text-gray-900 dark:text-white"
            >
              {{ modalTitle }}
            </DialogTitle>

            <form @submit.prevent="saveGroupe" class="space-y-4">
              <FloatLabel variant="on">
                <InputText
                  id="nom"
                  v-model="form.nom"
                  autocomplete="off"
                  class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                />
                <label for="nom">Nom du groupe</label>
              </FloatLabel>

              <!-- Niveau -->
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Niveau
                </label>
                <Dropdown
                  v-model="form.niveau_id"
                  :options="niveauxOptions"
                  optionLabel="label"
                  optionValue="value"
                  filter
                  showClear
                  placeholder="Sélectionner un niveau"
                  class="w-full"
                />
              </div>

              <!-- Filières -->
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Filières
                </label>
                <MultiSelect
                  v-model="form.filieres"
                  display="chip"
                  :options="filieresOptions"
                  optionLabel="label"
                  optionValue="value"
                  multiple
                  filter
                  placeholder="Sélectionner les filières"
                  class="w-full"
                />
              </div>
              <div class="flex justify-end gap-3">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useFiliereStore } from "~~/stores/filiere";
import { useGroupeStore } from "~~/stores/group";
import { useNiveauStore } from "~~/stores/niveau";

const { $toastr, $swal } = useNuxtApp();
const filiereStore = useFiliereStore();
const groupeStore = useGroupeStore();
const niveauStore = useNiveauStore();

const searchQuery = ref("");
const loading = ref(true);
const showModal = ref(false);
const modalTitle = ref("");
const itemsPerPage = ref(5);
const showDetailModal = ref(false);
const selectedEvent = ref(null);

const form = ref({
  id: null,
  nom: "",
  niveau_id: null,
  filieres: [],
  groupId: null,
});

const columns = ref([
  { field: "nom", title: "Nom du groupe", visible: true },
  { field: "niveau", title: "Niveau", visible: true },
  { field: "inscrit", title: "Effectif", visible: true },
  { field: "action", title: "Actions", visible: true },
]);

const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

const rows = computed(() =>
  groupeStore.groupes.map((g) => ({
    id: g.id,
    slug: g.slug,
    nom: g.nom,
    niveau: g.niveau?.libelle ?? "--",
    niveau_id: g.niveau.id,
    filieres: g.filieres || [],
    niveau_obj: g.niveau,
    filieres_obj: g.filieres || [],
    inscrit: g.inscrits,
  })),
);

const filieresOptions = computed(() => {
  return filiereStore.filieres.map((f) => ({
    label: `${f.nom} (${f.code})`,
    value: f.id,
  }));
});

const niveauxOptions = computed(() => {
  return niveauStore.niveaux.map((n) => ({
    label: n.libelle,
    value: n.id,
  }));
});

const openDetailModal = (item) => {
  selectedEvent.value = item;
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedEvent.value = null;
};

const openAddModal = () => {
  modalTitle.value = "Créer un groupe";
  form.value = {
    id: null,
    nom: "",
    niveau_id: null,
    filieres: [],
  };
  showModal.value = true;
};

const openEditModal = (g) => {
  modalTitle.value = "Modifier le groupe";

  form.value = {
    id: g.id,
    slug: g.slug,
    nom: g.nom,
    niveau_id: g.niveau_id,
    filieres: g.filieres?.map((f) => f.id) || [],
    groupId: g.id,
  };

  showModal.value = true;
};

const closeModal = () => (showModal.value = false);

const editEvent = () => {
  if (selectedEvent.value) {
    openEditModal(selectedEvent.value);
    closeDetailModal();
  }
};

const saveGroupe = async () => {
  try {
    if (form.value.id) {
      await groupeStore.updateGroupe(form.value);
      $toastr.success("Groupe modifié avec succès");
    } else {
      await groupeStore.addGroupe(form.value);
      $toastr.success("Groupe créé avec succès");
    }

    await groupeStore.fetchGroupes();
    closeModal();
  } catch (error) {
    console.log(error);
    $toastr.error(error.response?.data?.message || "Une erreur est survenue");
  }
};

const deleteItem = async (groupe) => {
  const res = await $swal.fire({
    title: "Supprimer ce groupe ?",
    text: "Cette action est irréversible",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Supprimer",
    cancelButtonText: "Annuler",
  });

  if (res.isConfirmed) {
    try {
      await groupeStore.deleteGroupe(groupe.slug);
      await groupeStore.fetchGroupes();
      $toastr.success("Groupe supprimé avec succès");
    } catch (error) {
      console.log(error);
      $toastr.error(error.response?.data?.message || "Une erreur est survenue");
    }
  }
};

onMounted(async () => {
  try {
    await Promise.all([
      filiereStore.fetchFilieres(),
      niveauStore.fetchNiveaux(),
      groupeStore.fetchGroupes(),
    ]);
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
    $toastr.error("Erreur lors du chargement des données");
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* Animation pour les badges */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.inline-flex.items-center {
  animation: fadeIn 0.3s ease-out;
}

/* Effet de hover sur les badges */
.inline-flex.items-center:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}

/* Gradient pour les sections */
.bg-gradient-to-br {
  background-size: 200% 200%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Pour le line-clamp */
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
