<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Années scolaires', to: '/' },
        { label: 'Liste', to: null },
      ]"
      title="Liste des années scolaire"
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
        <Can action="create-annee-scolaire">
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
        </Can>
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
          <template #status="{ value }">
            <div v-if="value.status === true" class="flex items-center">
              <Can action="update-annee-scolaire">
                <button
                  @click="togglePublish(value)"
                  class="relative inline-flex items-center h-7 rounded-full w-14 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-green-100 dark:bg-green-900/30 focus:ring-green-300 cursor-default"
                  title="Déja publié"
                >
                  <span
                    class="translate-x-8 bg-green-500 dark:bg-green-600 inline-block w-5 h-5 transform rounded-full shadow-sm transition-all duration-200"
                  ></span>
                </button>
              </Can>
              <span
                class="ml-3 text-sm font-medium text-green-700 dark:text-green-300"
              >
              </span>
            </div>

            <!-- Si non publié -->
            <div v-else class="flex items-center">
              <Can action="update-annee-scolaire">
                <button
                  @click="togglePublish(value)"
                  class="relative inline-flex items-center h-7 rounded-full w-14 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-100 dark:bg-gray-800/40 focus:ring-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Cliquer pour publier"
                >
                  <span
                    class="translate-x-1 bg-gray-500 dark:bg-gray-600 inline-block w-5 h-5 transform rounded-full shadow-sm transition-all duration-200"
                  ></span>
                </button>
              </Can>
              <span
                class="ml-3 text-sm font-medium text-red-700 dark:text-red-300"
              >
              </span>
            </div>
          </template>
          <template #action="{ value }">
            <div class="flex justify-center gap-3">
              <!-- Edit -->
              <Can action="update-annee-scolaire">
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
              </Can>
              <!-- Calendrier des rentrées -->
              <Can action="update-annee-scolaire">
                <button
                  @click="openCalendrierModal(value)"
                  class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors duration-200 text-xs font-semibold border border-indigo-200 dark:border-indigo-800"
                  title="Gérer le calendrier des rentrées par promotion"
                >
                  <svg
                    class="w-4 h-4 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Calendrier</span>
                </button>
              </Can>

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

            <form @submit.prevent="saveAnneeScolaire" class="space-y-4">
              <FloatLabel variant="on">
                <InputText
                  id="nom"
                  v-model="form.nom"
                  autocomplete="off"
                  class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                />
                <label for="nom">Nom de l'année</label>
              </FloatLabel>

              <label for="nom">Date début</label>
              <FloatLabel variant="on">
                <input
                  id="nom"
                  v-model="form.date_debut"
                  type="date"
                  autocomplete="off"
                  class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                />
                <!-- <label for="nom">Date début</label> -->
              </FloatLabel>

              <label for="nom">Date fin</label>
              <FloatLabel variant="on">
                <input
                  id="nom"
                  v-model="form.date_fin"
                  type="date"
                  autocomplete="off"
                  class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                />
              </FloatLabel>

              <!-- Filières -->

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
                  {{
                    anneescolaireStore.isLoading ? "Enrégistrement..." : "Enregistrer"
                  }}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </TransitionRoot>
  

    <!-- Modale Calendrier des rentrées -->
    <TransitionRoot appear :show="showCalendrierModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeCalendrierModal">
        <div class="fixed inset-0 bg-black/60" />

        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            class="w-full max-w-4xl rounded-2xl bg-white dark:bg-gray-800 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <!-- Header -->
            <div class="flex items-start justify-between pb-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div class="flex items-center gap-3">
                <div class="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <DialogTitle class="text-xl font-bold text-gray-900 dark:text-white">
                    Calendrier académique des rentrées
                  </DialogTitle>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Année : <span class="font-semibold text-indigo-600 dark:text-indigo-400">{{ calendrierData?.annee?.nom }}</span>
                    (Période générale : {{ calendrierData?.annee?.date_debut || 'Non définie' }} au {{ calendrierData?.annee?.date_fin || 'Non définie' }})
                  </p>
                </div>
              </div>

              <button
                @click="closeCalendrierModal"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="overflow-y-auto py-5 pr-1 flex-1 space-y-4">
              <div v-if="loadingCalendrier" class="flex justify-center py-12">
                <div class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
              </div>

              <div v-else class="space-y-4">
                <div class="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl p-3.5 flex items-start gap-3">
                  <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                    Définissez ici la date de rentrée officielle de chaque niveau (L1, L2, etc.). Tous les modules (scolarité, plannings, présences, tranches de paiement) se basent sur ce calendrier unique. Si une filière a une rentrée spécifique au sein d'un niveau, vous pouvez ajouter une dérogation.
                  </p>
                </div>

                <!-- Liste des niveaux -->
                <div class="space-y-4">
                  <div
                    v-for="niveau in calendrierNiveaux"
                    :key="niveau.niveau_id"
                    class="p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow transition-shadow space-y-4"
                  >
                    <!-- En-tête : Badge niveau, Statut et Bouton filière -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-700/60">
                      <div class="flex items-center gap-2.5 flex-wrap">
                        <span class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow-sm whitespace-nowrap flex-shrink-0 tracking-wide min-w-max">
                          {{ niveau.niveau_libelle }}
                        </span>
                        
                        <span
                          v-if="niveau.is_custom"
                          class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 min-w-max"
                        >
                          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                          Date personnalisée
                        </span>
                        <span
                          v-else
                          class="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 min-w-max"
                        >
                          <span class="w-2 h-2 rounded-full bg-gray-400"></span>
                          Date par défaut de l'année
                        </span>
                      </div>

                      <button
                        type="button"
                        @click="toggleAddException(niveau)"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors font-semibold whitespace-nowrap self-start sm:self-auto"
                        title="Ajouter une dérogation pour une filière particulière"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>+ Filière spécifique</span>
                      </button>
                    </div>

                    <!-- Ligne Date de rentrée et Bouton Rétablir rentrée générale -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/90 dark:bg-gray-900/50 p-3.5 sm:p-4 rounded-xl border border-gray-100 dark:border-gray-700/60">
                      <div class="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4">
                        <div class="flex items-center gap-2">
                          <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            Date de rentrée officielle :
                          </label>
                        </div>
                        <input
                          v-model="niveau.date_rentree"
                          type="date"
                          @change="handleDateChange(niveau)"
                          class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-sm w-full sm:w-auto"
                        />
                      </div>

                      <div v-if="niveau.is_custom" class="flex items-center self-start sm:self-auto">
                        <button
                          type="button"
                          @click="resetToGeneralDate(niveau)"
                          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 rounded-lg border border-amber-200 dark:border-amber-800 transition-colors font-semibold whitespace-nowrap shadow-sm"
                          title="Rétablir ce niveau sur la date générale de rentrée de l'année"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Rétablir rentrée générale</span>
                        </button>
                      </div>
                    </div>

                    <!-- Bloc ajout dérogation pour filière -->
                    <div v-if="niveau.showExceptionForm" class="p-3.5 sm:p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200 dark:border-indigo-800/60 space-y-3">
                      <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                        <p class="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                          Dérogation pour une filière de {{ niveau.niveau_libelle }} :
                        </p>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                        <div class="sm:col-span-6">
                          <Dropdown
                            v-model="niveau.newExceptionFiliereId"
                            :options="filiereOptions"
                            optionLabel="label"
                            optionValue="value"
                            filter
                            placeholder="Sélectionner la filière..."
                            class="w-full text-xs shadow-sm"
                          />
                        </div>
                        <div class="sm:col-span-3">
                          <input
                            v-model="niveau.newExceptionDate"
                            type="date"
                            class="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-sm"
                          />
                        </div>
                        <div class="sm:col-span-3 flex items-center gap-2">
                          <button
                            type="button"
                            @click="addExceptionToNiveau(niveau)"
                            class="flex-1 px-3 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-sm transition-colors text-center whitespace-nowrap"
                          >
                            Ajouter
                          </button>
                          <button
                            type="button"
                            @click="niveau.showExceptionForm = false"
                            class="px-3 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors whitespace-nowrap"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Liste des dérogations filières existantes pour ce niveau -->
                    <div v-if="niveau.filiere_exceptions && niveau.filiere_exceptions.length > 0" class="pl-3 sm:pl-4 space-y-2 border-l-2 border-indigo-400 dark:border-indigo-600 mt-2">
                      <div
                        v-for="(exc, excIdx) in niveau.filiere_exceptions"
                        :key="exc.id || 'new-'+excIdx"
                        class="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs shadow-sm gap-2.5"
                      >
                        <div class="flex items-center gap-2.5 flex-wrap min-w-0">
                          <span class="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0"></span>
                          <span class="font-bold text-gray-900 dark:text-gray-100 truncate">
                            {{ exc.filiere_nom }}
                          </span>
                          <span v-if="exc.filiere_code" class="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-mono whitespace-nowrap flex-shrink-0">
                            {{ exc.filiere_code }}
                          </span>
                        </div>
                        <div class="flex items-center gap-2.5 self-end sm:self-auto flex-shrink-0">
                          <span class="text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">Rentrée :</span>
                          <input
                            v-model="exc.date_rentree"
                            type="date"
                            class="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-sm"
                          />
                          <button
                            type="button"
                            @click="removeException(niveau, excIdx)"
                            class="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900/50"
                            title="Supprimer cette dérogation"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Option de synchronisation automatique -->
                <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <label class="flex items-start gap-2.5 cursor-pointer">
                    <input
                      v-model="syncEcheancesOption"
                      type="checkbox"
                      class="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span class="text-xs font-bold text-gray-900 dark:text-white block">
                        Synchroniser automatiquement les échéances financières des étudiants
                      </span>
                      <span class="text-[11px] text-gray-500 dark:text-gray-400 block">
                        Recalcule et réaligne immédiatement les tranches de scolarité des contrats étudiants sans altérer les montants déjà payés.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                type="button"
                @click="closeCalendrierModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
              >
                Fermer
              </button>
              <button
                type="button"
                @click="saveCalendrier"
                :disabled="savingCalendrier || loadingCalendrier"
                class="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition-all flex items-center gap-2"
              >
                <span v-if="savingCalendrier" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Enregistrer le calendrier
              </button>
            </div>
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

import { useAnneScolaireStore } from "~~/stores/annee-scolaire";

const { $toastr, $swal } = useNuxtApp();

const anneescolaireStore = useAnneScolaireStore();

const searchQuery = ref("");
const loading = ref(true);
const showModal = ref(false);
const modalTitle = ref("");
const itemsPerPage = ref(5);
const showDetailModal = ref(false);
const selectedEvent = ref(null);

const form = ref({
  id: null,
  slug: null,
  nom: "",
  date_debut: null,
  date_fin: [],
});

const columns = ref([
  { field: "nom", title: "Nom ", visible: true },
  { field: "date_debut_detail", title: "Date début ", visible: true },
  { field: "date_fin_detail", title: "Date fin ", visible: true },
  { field: "status", title: "Status ", visible: true },
  { field: "action", title: "Actions", visible: true },
]);

const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

const rows = computed(() =>
  anneescolaireStore.annneescolaires.map((a) => ({
    id: a.id,
    slug: a.slug,
    nom: a.nom,
    status: a.active,
    date_debut: a.date_debut ?? "--",
    date_fin: a.date_fin,
    date_debut_detail: a.date_debut_detail || "--",
    date_fin_detail: a.date_fin_detail,
  })),
);

const openDetailModal = (item) => {
  selectedEvent.value = item;
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedEvent.value = null;
};

const openAddModal = () => {
  modalTitle.value = "Créer une année scolaire";
  form.value = {
    id: null,
    nom: "",
    date_debut: null,
    date_fin: null,
  };
  showModal.value = true;
};

const openEditModal = (g) => {
  modalTitle.value = "Modifier l'année scolaire";

  form.value = {
    id: g.slug,
    nom: g.nom,
    date_debut: g.date_debut,
    date_fin: g.date_fin,
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

const saveAnneeScolaire = async () => {
  try {
    if (form.value.id) {
      await anneescolaireStore.updateAnneeScolaire(form.value, form.value.id);
      $toastr.success("Année scolaire modifiée avec succès");
    } else {
      await anneescolaireStore.addAnneeScolaire(form.value);
      $toastr.success("Année scolaire créée avec succès");
    }
    await anneescolaireStore.fetchAnneeScolaire();
    closeModal();
  } catch (error) {
    console.log(error);
    $toastr.error(error.response?.data?.message || "Une erreur est survenue");
  }
};
const togglePublish = async (value) => {
  const res = await $swal.fire({
    title:
      value.status === true
        ? "Voulez-vous désactiver cette année scolaire?"
        : "Voulez-vous activer cette année scolaire?",
    text: "Cette action est irréversible",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: value.status === true ? "Oui désactiver" : "Oui,activer",
    cancelButtonText: "Annuler",
  });

  if (res.isConfirmed) {
    try {
      if (value.status === true) {
        await anneescolaireStore.desactiverAnneeScolaire(value.id);
        await anneescolaireStore.fetchAnneeScolaire();

        $toastr.success("Année désactivée avec succès");
      } else {
        await anneescolaireStore.activerAnneeScolaire(value.id);
        await anneescolaireStore.fetchAnneeScolaire();

        $toastr.success("Année activée avec succès");
      }
    } catch (error) {
      console.log(error);
      $toastr.error(error.response?.data?.message || "Une erreur est survenue");
    }
  }
};


const showCalendrierModal = ref(false);
const loadingCalendrier = ref(false);
const savingCalendrier = ref(false);
const selectedAnneeForCalendrier = ref(null);
const calendrierData = ref(null);
const calendrierNiveaux = ref([]);
const calendrierFilieres = ref([]);

const filiereOptions = computed(() =>
  (calendrierFilieres.value || []).map((f) => ({
    label: `${f.nom} (${f.code})`,
    value: f.id,
  }))
);
const syncEcheancesOption = ref(true);

const openCalendrierModal = async (annee) => {
  selectedAnneeForCalendrier.value = annee;
  showCalendrierModal.value = true;
  loadingCalendrier.value = true;
  try {
    const data = await anneescolaireStore.fetchCalendrier(annee.id);
    calendrierData.value = data;
    calendrierNiveaux.value = (data.niveaux || []).map((n) => ({
      ...n,
      showExceptionForm: false,
      newExceptionFiliereId: null,
      newExceptionDate: n.date_rentree,
    }));
    calendrierFilieres.value = data.filieres || [];
  } catch (error) {
    console.error("Erreur chargement calendrier:", error);
    $toastr.error("Impossible de charger le calendrier académique");
    showCalendrierModal.value = false;
  } finally {
    loadingCalendrier.value = false;
  }
};

const closeCalendrierModal = () => {
  showCalendrierModal.value = false;
  selectedAnneeForCalendrier.value = null;
  calendrierData.value = null;
  calendrierNiveaux.value = [];
};

const toggleAddException = (niveau) => {
  niveau.showExceptionForm = !niveau.showExceptionForm;
  if (niveau.showExceptionForm) {
    niveau.newExceptionFiliereId = null;
    niveau.newExceptionDate = niveau.date_rentree;
  }
};

const addExceptionToNiveau = (niveau) => {
  if (!niveau.newExceptionFiliereId) {
    $toastr.error("Veuillez sélectionner une filière");
    return;
  }
  if (!niveau.newExceptionDate) {
    $toastr.error("Veuillez choisir une date de rentrée");
    return;
  }

  const filiere = calendrierFilieres.value.find((f) => f.id === niveau.newExceptionFiliereId);
  if (!niveau.filiere_exceptions) {
    niveau.filiere_exceptions = [];
  }

  const exists = niveau.filiere_exceptions.find((e) => e.filiere_id === niveau.newExceptionFiliereId);
  if (exists) {
    exists.date_rentree = niveau.newExceptionDate;
  } else {
    niveau.filiere_exceptions.push({
      filiere_id: niveau.newExceptionFiliereId,
      filiere_nom: filiere?.nom || "Filière",
      filiere_code: filiere?.code || "",
      date_rentree: niveau.newExceptionDate,
    });
  }

  niveau.showExceptionForm = false;
};

const removeException = async (niveau, index) => {
  const exc = niveau.filiere_exceptions[index];
  if (exc && exc.id) {
    try {
      await anneescolaireStore.deleteCalendrierEntry(selectedAnneeForCalendrier.value.id, exc.id);
    } catch (e) {
      console.error(e);
    }
  }
  niveau.filiere_exceptions.splice(index, 1);
};

const handleDateChange = (niveau) => {
  const generalDate = calendrierData.value?.annee?.date_debut;
  if (generalDate && niveau.date_rentree === generalDate) {
    niveau.is_custom = false;
  } else {
    niveau.is_custom = true;
  }
};

const resetToGeneralDate = (niveau) => {
  niveau.is_custom = false;
  if (calendrierData.value?.annee?.date_debut) {
    niveau.date_rentree = calendrierData.value.annee.date_debut;
  }
  $toastr.info(`${niveau.niveau_libelle} rétabli sur la rentrée générale`);
};

const saveCalendrier = async () => {
  if (!selectedAnneeForCalendrier.value) return;

  const entries = [];
  const reset_niveaux = [];

  calendrierNiveaux.value.forEach((niveau) => {
    if (niveau.is_custom && niveau.date_rentree) {
      entries.push({
        niveau_id: niveau.niveau_id,
        filiere_id: null,
        date_rentree: niveau.date_rentree,
        date_fin: niveau.date_fin || null,
      });
    } else if (!niveau.is_custom) {
      reset_niveaux.push(niveau.niveau_id);
    }

    if (niveau.filiere_exceptions && niveau.filiere_exceptions.length > 0) {
      niveau.filiere_exceptions.forEach((exc) => {
        if (exc.date_rentree && exc.filiere_id) {
          entries.push({
            niveau_id: niveau.niveau_id,
            filiere_id: exc.filiere_id,
            date_rentree: exc.date_rentree,
            date_fin: exc.date_fin || null,
          });
        }
      });
    }
  });

  savingCalendrier.value = true;
  try {
    const res = await anneescolaireStore.saveCalendrier(selectedAnneeForCalendrier.value.id, {
      entries,
      reset_niveaux,
      sync_echeances: syncEcheancesOption.value,
    });

    await $swal.fire({
      title: "Calendrier enregistré",
      text: res.message || "Le calendrier académique a été mis à jour avec succès.",
      icon: "success",
      confirmButtonColor: "#4F46E5",
    });

    closeCalendrierModal();
  } catch (error) {
    console.error("Erreur enregistrement calendrier:", error);
    $toastr.error(error.response?.data?.message || "Erreur lors de l'enregistrement du calendrier");
  } finally {
    savingCalendrier.value = false;
  }
};

onMounted(async () => {
  try {
    await Promise.all([anneescolaireStore.fetchAnneeScolaire()]);
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
