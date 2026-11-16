<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Frais de scolarité', to: '/' },
        { label: 'Liste', to: null },
      ]"
      title="Gestion des frais de scolarité"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Ligne 1 (Haut) : Boutons d'action principaux -->
    <div class="flex items-center justify-start gap-2.5 flex-wrap mb-4">
      <!-- Synchroniser les échéances -->
      <Can action="update-frais-scolarite">
        <button
          @click="handleSyncAllEcheances"
          :disabled="loadingSync"
          class="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm text-sm font-medium whitespace-nowrap transition-colors"
          title="Recalculer et synchroniser les échéances de tous les étudiants de l'année"
        >
          <svg
            v-if="!loadingSync"
            class="w-4 h-4 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span
            v-else
            class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0"
          ></span>
          <span>Synchroniser les échéances</span>
        </button>
      </Can>

      <!-- Dupliquer -->
      <Can action="duplicate-frais-scolarite">
        <button
          @click="openDuplicateModal"
          class="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm text-sm font-medium whitespace-nowrap transition-colors"
        >
          <svg
            class="w-4 h-4 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          <span>Dupliquer l'année</span>
        </button>
      </Can>

      <!-- Ajouter -->
      <Can action="create-frais-scolarite">
        <button
          @click="openAddModal"
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm text-sm font-semibold whitespace-nowrap transition-colors"
        >
          <svg
            class="w-4 h-4 flex-shrink-0"
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
          <span>Ajouter</span>
        </button>
      </Can>
    </div>

    <!-- Ligne 2 (Bas) : Zone de filtres et recherche juste au-dessus du tableau -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <!-- Recherche avec icône -->
      <div class="relative w-full sm:w-80">
        <svg
          class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
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
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher des frais..."
          class="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-xs transition-colors"
        />
      </div>

      <!-- Colonnes -->
      <client-only>
        <VDropdown placement="bottom-end">
          <button
            class="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium whitespace-nowrap shadow-xs transition-colors"
          >
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
              />
            </svg>
            <span>Colonnes</span>
            <svg
              class="w-3.5 h-3.5 text-gray-400"
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
              class="w-56 p-3 rounded-xl shadow-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
            >
              <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                Colonnes visibles
              </div>
              <div
                v-for="col in columns"
                :key="col.field"
                class="flex items-center gap-2 py-1.5 px-1 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md cursor-pointer"
              >
                <input
                  type="checkbox"
                  :id="'col-'+col.field"
                  v-model="col.visible"
                  :disabled="col.field === 'action'"
                  class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label :for="'col-'+col.field" class="text-sm text-gray-700 dark:text-gray-300 cursor-pointer flex-1">
                  {{ col.title }}
                </label>
              </div>
            </div>
          </template>
        </VDropdown>
      </client-only>
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
              <button
                @click="togglePublish(value)"
                class="relative inline-flex items-center h-7 rounded-full w-14 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-green-100 dark:bg-green-900/30 focus:ring-green-300 cursor-default"
                title="Déja publié"
              >
                <span
                  class="translate-x-8 bg-green-500 dark:bg-green-600 inline-block w-5 h-5 transform rounded-full shadow-sm transition-all duration-200"
                ></span>
              </button>
              <span
                class="ml-3 text-sm font-medium text-green-700 dark:text-green-300"
              >
              </span>
            </div>

            <!-- Si non publié -->
            <div v-else class="flex items-center">
              <button
                @click="togglePublish(value)"
                class="relative inline-flex items-center h-7 rounded-full w-14 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-100 dark:bg-gray-800/40 focus:ring-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Cliquer pour publier"
              >
                <span
                  class="translate-x-1 bg-gray-500 dark:bg-gray-600 inline-block w-5 h-5 transform rounded-full shadow-sm transition-all duration-200"
                ></span>
              </button>
              <span
                class="ml-3 text-sm font-medium text-red-700 dark:text-red-300"
              >
              </span>
            </div>
          </template>
          <template #date_debut="{ value }">
            <span
              v-if="value.raw_date_debut"
              class="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
            >
              {{ value.date_debut }}
            </span>
            <span
              v-else
              class="text-xs text-gray-400 dark:text-gray-500 italic"
            >
              Année scolaire
            </span>
          </template>
          <template #action="{ value }">
            <div class="flex justify-center gap-3">
              <!-- Edit -->
              <Can action="update-frais-scolarite">
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
              <!-- Synchroniser cette configuration -->
              <Can action="update-frais-scolarite">
                <button
                  @click="handleSyncSingleEcheances(value)"
                  class="p-2 rounded-lg text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors duration-200"
                  title="Recalculer les échéances des étudiants de ce tarif"
                >
                  <svg
                    class="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </Can>

              <!-- <NuxtLink
                :to="`/frais-de-scolarite/${value.id}/tranche-de-paiement`"
                class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50 transition-colors duration-200"
                title="Gérer les tranches"
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
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                <span class="text-xs font-medium">Tranches</span>
              </NuxtLink> -->
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

    <!-- Modale de duplication -->
    <TransitionRoot appear :show="showDuplicateModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeDuplicateModal">
        <div class="fixed inset-0 bg-black/60" />
        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel class="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-6 shadow-2xl">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <svg class="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <DialogTitle class="text-xl font-bold text-gray-900 dark:text-white">
                Dupliquer l'année
              </DialogTitle>
            </div>

            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Cette action copiera tous les tarifs et les tranches de l'année source vers l'année cible.
            </p>

            <div class="space-y-5">
              <FloatLabel variant="on">
                <Dropdown
                  v-model="duplicateForm.source_year_id"
                  :options="anneeOptions"
                  optionLabel="label"
                  optionValue="value"
                  filter
                  class="w-full"
                />
                <label>Année source (Référence)</label>
              </FloatLabel>

              <div class="flex justify-center py-2">
                <svg class="w-6 h-6 text-gray-300 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>

              <FloatLabel variant="on">
                <Dropdown
                  v-model="duplicateForm.target_year_id"
                  :options="anneeOptions"
                  optionLabel="label"
                  optionValue="value"
                  filter
                  class="w-full"
                />
                <label>Année cible (Nouvelle année)</label>
              </FloatLabel>

              <div class="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  @click="closeDuplicateModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                >
                  Annuler
                </button>
                <button
                  @click="handleDuplicate"
                  :disabled="loadingDuplicate"
                  class="px-6 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-md transition-all flex items-center gap-2"
                >
                  <span v-if="loadingDuplicate" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Lancer la duplication
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modale d'ajout/édition -->
    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeModal">
        <div class="fixed inset-0 bg-black/60" />

        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            class="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <DialogTitle
              class="text-xl font-bold mb-6 text-gray-900 dark:text-white flex-shrink-0"
            >
              {{ modalTitle }}
            </DialogTitle>

            <div class="overflow-y-auto pr-2 custom-scrollbar">

            <form @submit.prevent="saveFrais" class="space-y-6">
              <!-- Grid pour les informations principales -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <!-- Niveau -->
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 ml-1">
                    <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Niveau scolaire
                  </label>
                  <Dropdown
                    v-model="form.niveau_id"
                    :options="niveauOptions"
                    optionLabel="label"
                    optionValue="value"
                    filter
                    placeholder="Choisir le niveau"
                    class="w-full shadow-sm border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-lg h-10 flex items-center px-2"
                  />
                </div>

                <!-- Filière -->
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 ml-1">
                    <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Filière
                  </label>
                  <Dropdown
                    v-model="form.filiere_id"
                    :options="filiereOptions"
                    optionLabel="label"
                    optionValue="value"
                    filter
                    showClear
                    placeholder="Toutes les filières"
                    class="w-full shadow-sm border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-lg h-10 flex items-center px-2"
                  />
                </div>

                <!-- Genre -->
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 ml-1">
                    <svg class="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Genre (Optionnel)
                  </label>
                  <Dropdown
                    v-model="form.genre"
                    :options="genreOptions"
                    optionLabel="label"
                    optionValue="value"
                    showClear
                    placeholder="Tous les genres"
                    class="w-full shadow-sm border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-lg h-10 flex items-center px-2"
                  />
                </div>

                <!-- Mode de formation -->
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 ml-1">
                    <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Mode de formation
                  </label>
                  <Dropdown
                    v-model="form.mode_formation"
                    :options="modeFormationOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Tous les modes"
                    class="w-full shadow-sm border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-lg h-10 flex items-center px-2"
                  />
                </div>

                <!-- Montant -->
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 ml-1">
                    <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Montant total (FCFA)
                  </label>
                  <InputNumber
                    v-model="form.montant"
                    inputId="integeronly"
                    fluid
                    placeholder="Ex: 900000"
                    class="w-full shadow-sm border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-lg"
                  />
                </div>
              </div>

              <!-- Description -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 ml-1">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Description / Note
                </label>
                <Textarea
                  v-model="form.description"
                  rows="2"
                  class="w-full shadow-sm border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-lg p-3 text-sm"
                  style="resize: none"
                  placeholder="Informations complémentaires..."
                />
              </div>

              <!-- Carte Automatisation -->
              <div class="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 p-5 rounded-2xl border-2 border-indigo-100/50 dark:border-indigo-800/30 relative overflow-hidden group">
                <!-- Déco background -->
                <div class="absolute -right-4 -top-4 w-24 h-24 bg-indigo-200/20 dark:bg-indigo-700/10 rounded-full blur-2xl group-hover:bg-indigo-300/30 transition-all duration-700"></div>
                
                <div class="relative z-10">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200 dark:shadow-none">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="text-sm font-bold text-indigo-900 dark:text-indigo-100">Plan de paiement automatique</h4>
                      <p class="text-[10px] text-indigo-600/70 dark:text-indigo-400">Générer les tranches en un clin d'œil</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="space-y-1.5">
                      <label class="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider ml-1">
                        Type de répartition
                      </label>
                      <Dropdown
                        v-model="form.frequence"
                        :options="frequenceOptions"
                        optionLabel="label"
                        optionValue="value"
                        showClear
                        placeholder="Choisir une fréquence pour générer"
                        class="w-full shadow-sm border-indigo-200 dark:border-indigo-800 dark:bg-gray-900 rounded-xl h-11 flex items-center px-2"
                      />
                    </div>

                    <div class="space-y-1.5">
                      <label class="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider ml-1">
                        Date de rentrée académique
                      </label>
                      <div class="h-11 px-3.5 bg-white/70 dark:bg-gray-900/60 border border-indigo-200 dark:border-indigo-800 rounded-xl flex items-center justify-between text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                        <div class="flex items-center gap-2">
                          <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{{ new Date(resolvedDateRentree).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
                        </div>
                        <span class="text-[10px] text-indigo-600 dark:text-indigo-400 font-normal">Calendrier officiel</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Preview ou Tranches Existantes -->
                  <div v-if="previewTranches.length > 0 || (form.id && form.existingTranches.length > 0 && !form.frequence)" 
                       class="mt-4 space-y-2 border-t border-indigo-200/50 dark:border-indigo-800/30 pt-4">
                    
                    <div class="flex items-center justify-between mb-2">
                       <p class="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">
                         {{ form.frequence ? 'Nouvel aperçu (Sera régénéré)' : 'Tranches actuellement définies' }}
                       </p>
                       <span v-if="!form.frequence && form.id" class="text-[9px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold">Actuel</span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                       <!-- Cas Simulation -->
                       <template v-if="form.frequence">
                         <div v-for="(tranche, index) in previewTranches" :key="'preview-'+index" 
                              class="flex items-center justify-between p-2 bg-white/60 dark:bg-gray-900/40 rounded-lg border border-indigo-100 dark:border-indigo-800/50 shadow-sm border-l-4 border-l-amber-400">
                           <div class="flex flex-col">
                             <span class="text-[9px] font-bold text-indigo-500 uppercase">{{ tranche.libelle }}</span>
                             <span class="text-[11px] font-semibold text-gray-700 dark:text-gray-300">{{ tranche.date }}</span>
                           </div>
                           <div class="text-right">
                             <span class="text-xs font-bold text-indigo-700 dark:text-indigo-200">{{ tranche.montant }} FCFA</span>
                           </div>
                         </div>
                       </template>

                       <!-- Cas Existantes -->
                       <template v-else>
                         <div v-for="(tranche, index) in form.existingTranches" :key="'existing-'+tranche.id" 
                              class="flex items-center justify-between p-2 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-800/50 shadow-sm border-l-4 border-l-emerald-400">
                           <div class="flex flex-col">
                             <span class="text-[9px] font-bold text-emerald-600 uppercase">{{ tranche.libelle }}</span>
                             <span class="text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                               {{ new Date(tranche.date_limite).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) }}
                             </span>
                           </div>
                           <div class="text-right">
                             <span class="text-xs font-bold text-emerald-700 dark:text-emerald-200">{{ Number(tranche.montant).toLocaleString() }} FCFA</span>
                           </div>
                         </div>
                       </template>
                    </div>
                  </div>

                  <div class="mt-3 flex items-start gap-2 px-1">
                    <svg class="w-3.5 h-3.5 text-indigo-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-[10px] text-indigo-600/80 dark:text-indigo-400 leading-relaxed italic">
                      Les montants et dates des tranches sont calculés automatiquement à partir du calendrier académique officiel de l'année scolaire.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  :disabled="fraisScolariteStore.isLoading"
                  class="px-8 py-2.5 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm flex items-center gap-2"
                >
                  <span v-if="fraisScolariteStore.isLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  {{ form.id ? 'Mettre à jour' : 'Enregistrer les frais' }}
                </button>
              </div>
            </form>
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
import { useFiliereStore } from "~~/stores/filiere";
import { useNiveauStore } from "~~/stores/niveau";
import { useFraisStore } from "~~/stores/frais-de-scolarite";

import { useAnneScolaireStore } from "~~/stores/annee-scolaire";

const { $toastr, $swal } = useNuxtApp();

const anneescolaireStore = useAnneScolaireStore();
const filiereStore = useFiliereStore();
const niveauStore = useNiveauStore();
const fraisScolariteStore = useFraisStore();

const searchQuery = ref("");
const loading = ref(true);
const showModal = ref(false);
const modalTitle = ref("");
const itemsPerPage = ref(5);
const showDetailModal = ref(false);
const selectedEvent = ref(null);

const showDuplicateModal = ref(false);
const loadingDuplicate = ref(false);
const loadingSync = ref(false);

const form = ref({
  id: null,
  filiere_id: null,
  niveau_id: "",
  montant: null,
  description: null,
  genre: null,
  mode_formation: 'Présentiel',
  frequence: 'bimestriel',
  existingTranches: [],
});

const duplicateForm = ref({
  source_year_id: null,
  target_year_id: null,
});

const columns = ref([
  { field: "annee", title: "Année scolaire ", visible: true },
  { field: "genre", title: "Genre", visible: false },
  { field: "mode_formation", title: "Mode", visible: true },
  { field: "niveau", title: "Niveau", visible: true },
  { field: "filiere", title: "Filiere ", visible: true },
  { field: "date_debut", title: "Date de rentrée", visible: true },
  { field: "montant", title: "Montant ", visible: true },
  { field: "description", title: "Description ", visible: false },
  { field: "action", title: "Actions", visible: true },
]);

const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

const rows = computed(() =>
  fraisScolariteStore.frais.map((f) => ({
    id: f.id,
    annee: f.annee_scolaire.nom || "--",
    genre: f.genre ?? "",
    mode_formation: (f.mode_formation === 'Tous' || !f.mode_formation) ? "Présentiel" : f.mode_formation,
    niveau: f.niveau.libelle,
    niveau_id: f.niveau.id,
    filiere: f?.filiere?.code || "--",
    filiere_id: f?.filiere?.id,
    date_debut: f.date_debut
      ? new Date(f.date_debut).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : "Par défaut",
    raw_date_debut: f.date_debut,
    montant: f.montant || "--",
    description: f.description || "--",
    frequence: f.frequence,
    tranches: f.tranches || [],
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
  modalTitle.value = "Définir une frais de scolarité";
  form.value = {
    id: null,
    filiere_id: null,
    niveau_id: "",
    montant: null,
    description: null,
    genre: null,
    mode_formation: 'Présentiel',
    frequence: 'bimestriel',
    date_debut: null,
    existingTranches: [],
  };
  showModal.value = true;
};

const openEditModal = (item) => {
  const f = fraisScolariteStore.frais.find((x) => x.id === item.id) || item;
  modalTitle.value = "Modifier des frais de scolarité";
  form.value = {
    id: f.id,
    filiere_id: f.filiere_id ?? f.filiere?.id,
    niveau_id: f.niveau_id ?? f.niveau?.id,
    montant: f.montant,
    description: f.description,
    genre: f.genre,
    mode_formation: f.mode_formation,
    frequence: f.frequence,
    date_debut: f.date_debut ? f.date_debut.split('T')[0] : null,
    existingTranches: f.tranches?.data || f.tranches || [],
  };

  showModal.value = true;
};

const openDuplicateModal = () => {
  showDuplicateModal.value = true;
};

const closeDuplicateModal = () => {
  showDuplicateModal.value = false;
  duplicateForm.value = { source_year_id: null, target_year_id: null };
};

const handleDuplicate = async () => {
  if (!duplicateForm.value.source_year_id || !duplicateForm.value.target_year_id) {
    await $swal.fire({
      title: "Champs requis",
      text: "Veuillez sélectionner l'année source et l'année cible.",
      icon: "info",
      confirmButtonColor: "#4F46E5",
    });
    return;
  }

  if (duplicateForm.value.source_year_id === duplicateForm.value.target_year_id) {
    await $swal.fire({
      title: "Sélection invalide",
      text: "L'année source et l'année cible doivent être différentes.",
      icon: "warning",
      confirmButtonColor: "#D97706",
    });
    return;
  }

  // Contrôle : L'année source doit contenir des frais à copier
  const sourceYearHasFees = fraisScolariteStore.frais.some(
    (f) => Number(f.annee_scolaire_id ?? f.annee_scolaire?.id) === Number(duplicateForm.value.source_year_id)
  );
  if (!sourceYearHasFees) {
    await $swal.fire({
      title: "Année source vide",
      text: "L'année source sélectionnée ne contient aucun tarif de scolarité à dupliquer.",
      icon: "warning",
      confirmButtonColor: "#D97706",
    });
    return;
  }

  // Contrôle anti-doublons : L'année cible ne doit pas avoir DEJA des frais configurés
  const targetYearHasFees = fraisScolariteStore.frais.some(
    (f) => Number(f.annee_scolaire_id ?? f.annee_scolaire?.id) === Number(duplicateForm.value.target_year_id)
  );
  if (targetYearHasFees) {
    await $swal.fire({
      title: "Duplication bloquée",
      text: "L'année cible sélectionnée possède DÉJÀ des frais de scolarité paramétrés. Pour éviter d'engendrer des doublons de tarifs, la duplication est refusée.",
      icon: "error",
      confirmButtonColor: "#EF4444",
    });
    return;
  }

  const res = await $swal.fire({
    title: "Confirmer la duplication ?",
    text: "Tous les tarifs et tranches de l'année source seront copiés vers la nouvelle année scolaire.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Oui, dupliquer",
    cancelButtonText: "Annuler",
    confirmButtonColor: "#10B981",
    cancelButtonColor: "#6B7280",
  });

  if (res.isConfirmed) {
    loadingDuplicate.value = true;
    try {
      const response = await fraisScolariteStore.duplicateAnnee(duplicateForm.value);
      await $swal.fire({
        title: "Duplication terminée !",
        text: response?.message || "Tous les tarifs ont été dupliqués avec succès.",
        icon: "success",
        confirmButtonColor: "#10B981",
      });
      closeDuplicateModal();
    } catch (error) {
      console.error(error);
      await $swal.fire({
        title: "Erreur de duplication",
        text: error.response?.data?.message || "Erreur lors de la duplication.",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      loadingDuplicate.value = false;
    }
  }
};

const closeModal = () => (showModal.value = false);

const editEvent = () => {
  if (selectedEvent.value) {
    openEditModal(selectedEvent.value);
    closeDetailModal();
  }
};

// Synchronisation globale de toutes les échéances
const handleSyncAllEcheances = async () => {
  const res = await $swal.fire({
    title: "Synchroniser toutes les échéances ?",
    text: "Cette opération va recalculer et réaligner les échéances financières de tous les contrats étudiants de l'année scolaire active selon le calendrier officiel. Les montants déjà versés ne seront pas modifiés.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, synchroniser",
    cancelButtonText: "Annuler",
    confirmButtonColor: "#D97706",
    cancelButtonColor: "#6B7280",
  });

  if (res.isConfirmed) {
    loadingSync.value = true;
    try {
      const response = await fraisScolariteStore.synchroniserToutesEcheances();
      await $swal.fire({
        title: "Synchronisation terminée",
        text: response?.message || "Toutes les échéances financières ont été synchronisées avec succès.",
        icon: "success",
        confirmButtonColor: "#4F46E5",
      });
      await fraisScolariteStore.fetchFrais();
    } catch (error) {
      console.error(error);
      await $swal.fire({
        title: "Erreur de synchronisation",
        text: error.response?.data?.message || "Impossible de synchroniser les échéances.",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      loadingSync.value = false;
    }
  }
};

// Synchronisation ciblée d'un tarif spécifique
const handleSyncSingleEcheances = async (item) => {
  const filiereLabel = item.filiere && item.filiere !== '--' ? item.filiere : 'Toutes les filières';
  const niveauLabel = item.niveau || 'Niveau';

  const res = await $swal.fire({
    title: "Synchroniser ce tarif ?",
    text: `Voulez-vous recalculer les échéances des étudiants inscrits sous cette configuration (${filiereLabel} - ${niveauLabel}) selon le calendrier officiel ?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Oui, synchroniser",
    cancelButtonText: "Annuler",
    confirmButtonColor: "#D97706",
    cancelButtonColor: "#6B7280",
  });

  if (res.isConfirmed) {
    try {
      const response = await fraisScolariteStore.synchroniserEcheances(item.id);
      await $swal.fire({
        title: "Tarif synchronisé",
        text: response?.message || "Les échéances des étudiants associés ont été mises à jour.",
        icon: "success",
        confirmButtonColor: "#4F46E5",
      });
      await fraisScolariteStore.fetchFrais();
    } catch (error) {
      console.error(error);
      await $swal.fire({
        title: "Erreur",
        text: error.response?.data?.message || "Impossible de synchroniser ce tarif.",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    }
  }
};

// Suppression d'un tarif
const handleDeleteFrais = async (item) => {
  const filiereLabel = item.filiere && item.filiere !== '--' ? item.filiere : 'Toutes filières';
  const niveauLabel = item.niveau || 'Niveau';
  const montantStr = Number(item.montant || 0).toLocaleString();

  const res = await $swal.fire({
    title: "Supprimer ce tarif ?",
    text: `Êtes-vous sûr de vouloir supprimer la configuration de frais pour ${filiereLabel} - ${niveauLabel} (${montantStr} FCFA) ? Cette action est irréversible.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
    confirmButtonColor: "#EF4444",
    cancelButtonColor: "#6B7280",
  });

  if (res.isConfirmed) {
    try {
      await fraisScolariteStore.deleteFrais(item.id);
      await $swal.fire({
        title: "Supprimé !",
        text: "La configuration des frais a été supprimée avec succès.",
        icon: "success",
        confirmButtonColor: "#4F46E5",
      });
      await fraisScolariteStore.fetchFrais();
    } catch (error) {
      console.error(error);
      await $swal.fire({
        title: "Erreur de suppression",
        text: error.response?.data?.message || "Impossible de supprimer ce tarif.",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    }
  }
};

// Enregistrement / Modification avec confirmation Swal
const saveFrais = async () => {
  const isEditing = !!form.value.id;
  const res = await $swal.fire({
    title: isEditing ? "Confirmer la modification ?" : "Confirmer la création ?",
    text: isEditing
      ? "Les modifications apportées à ce tarif et son plan de paiement vont être enregistrées."
      : "Un nouveau tarif de frais de scolarité va être créé.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: isEditing ? "Oui, modifier" : "Oui, créer",
    cancelButtonText: "Annuler",
    confirmButtonColor: "#4F46E5",
    cancelButtonColor: "#6B7280",
  });

  if (res.isConfirmed) {
    try {
      if (form.value.id) {
        await fraisScolariteStore.updateFrais(form.value.id, form.value);
      } else {
        await fraisScolariteStore.addFrais(form.value);
      }
      await $swal.fire({
        title: "Succès !",
        text: isEditing ? "Frais de scolarité modifiés avec succès." : "Frais de scolarité créés avec succès.",
        icon: "success",
        confirmButtonColor: "#4F46E5",
      });
      await fraisScolariteStore.fetchFrais();
      closeModal();
    } catch (error) {
      console.error(error);
      await $swal.fire({
        title: "Erreur",
        text: error.response?.data?.message || "Une erreur est survenue lors de l'enregistrement.",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    }
  }
};

const filiereOptions = computed(() =>
  (filiereStore.filieres || []).map((f) => ({
    label: f.nom,
    value: f.id,
  })),
);
const genreOptions = computed(() => {
  return [
    {
      label: "Masculin",
      value: "Masculin",
    },
    {
      label: "Féminin",
      value: "Féminin",
    },
  ];
});

const modeFormationOptions = computed(() => {
  return [
    { label: "Présentiel", value: "Présentiel" },
    { label: "En ligne", value: "En ligne" },
  ];
});

const niveauOptions = computed(() =>
  (niveauStore.niveaux || []).map((n) => ({
    label: n.libelle,
    value: n.id,
  })),
);

const frequenceOptions = ref([
  { label: "Annuel (1 tranche)", value: "annuel" },
  { label: "Trimestriel (3 tranches)", value: "trimestriel" },
  { label: "Bimestriel (4 tranches)", value: "bimestriel" },
]);

const anneeOptions = computed(() =>
  (anneescolaireStore.annneescolaires || []).map((a) => ({
    label: a.nom,
    value: a.id,
  })),
);

const calendrierList = ref([]);

const resolvedDateRentree = computed(() => {
  const activeAnnee = anneescolaireStore.activeAnnee;
  if (!activeAnnee) return new Date().toISOString().split('T')[0];

  if (calendrierList.value && calendrierList.value.length > 0 && form.value.niveau_id) {
    const niv = calendrierList.value.find((n) => Number(n.niveau_id) === Number(form.value.niveau_id));
    if (niv) {
      if (form.value.filiere_id && niv.filiere_exceptions && niv.filiere_exceptions.length > 0) {
        const exc = niv.filiere_exceptions.find((e) => Number(e.filiere_id) === Number(form.value.filiere_id));
        if (exc && exc.date_rentree) return exc.date_rentree;
      }
      if (niv.date_rentree) return niv.date_rentree;
    }
  }

  return activeAnnee.date_debut || new Date().toISOString().split('T')[0];
});

const previewTranches = computed(() => {
  if (!form.value.frequence || !form.value.montant) return [];

  const dateStr = resolvedDateRentree.value;
  let currentDate = new Date(dateStr);

  const configs = {
    annuel: { count: 1, interval: 12 },
    trimestriel: { count: 3, interval: 3 },
    bimestriel: { count: 4, interval: 2 }
  };

  const config = configs[form.value.frequence];
  const montantBase = Math.floor(form.value.montant / config.count);
  const reliquat = form.value.montant % config.count;

  return Array.from({ length: config.count }, (_, i) => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + (i * config.interval));
    
    return {
      libelle: `Tranche ${i + 1}`,
      date: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      montant: (i === 0 ? montantBase + reliquat : montantBase).toLocaleString()
    };
  });
});

onMounted(async () => {
  try {
    await Promise.all([anneescolaireStore.fetchAnneeScolaire()]);
    await niveauStore.fetchNiveaux();
    await filiereStore.fetchFilieres();
    await fraisScolariteStore.fetchFrais();
    const active = anneescolaireStore.activeAnnee;
    if (active && active.id) {
      try {
        const cal = await anneescolaireStore.fetchCalendrier(active.id);
        calendrierList.value = cal.niveaux || [];
      } catch (e) {
        console.error("Calendrier load error:", e);
      }
    }
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

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>
