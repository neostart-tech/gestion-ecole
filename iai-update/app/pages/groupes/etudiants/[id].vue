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

        <!-- Boutons d'action -->
        <div class="flex gap-2">
          <!-- Export -->
          <button
            @click="processExport"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Exporter les étudiants"
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Exporter
          </button>

          <!-- Import -->
          <button
            @click="openImportModal"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-3 sm:p-4">
      <div v-if="groupeStore.isLoading" class="flex justify-center py-10">
        <div
          class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"
        ></div>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="visibleColumns"
          :rows="filteredRows"
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
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
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
              </button>

              <!-- Edit -->
              <!-- <NuxtLink
                :to="`/Groupes/etudiants/modifier-${value.id}`"
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
              </NuxtLink> -->

              <!-- Delete -->
              <!-- <button
                @click="deleteEtudiant(value)"
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
              </button> -->
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>

    <!-- Modal de détail étudiant -->
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
                  <!-- <button
                    type="button"
                    @click="editEtudiant"
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
                  </button> -->
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal d'importation -->
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
                  <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div class="flex items-center gap-3">
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">
                          Format requis
                        </p>
                        <p
                          class="text-sm text-gray-600 dark:text-gray-400 mt-1"
                        >
                          Le fichier doit être au format Excel (.xlsx) avec les
                          colonnes : Matricule, Nom, Prénom, Email, Genre,
                          Téléphone, Date de naissance, Nationalité
                        </p>
                      </div>
                    </div>
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
                </div>
                <!-- Dans la modale d'importation -->
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

                <!-- Bouton d'import avec loading -->
                <button
                  @click="processImport"
                  :disabled="!selectedFile || importLoading"
                  class="px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  :class="
                    !selectedFile || importLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  "
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
                  <span>{{
                    importLoading ? "Importation..." : "Importer"
                  }}</span>
                </button>

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
                    :disabled="!selectedFile"
                    :class="[
                      'px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-all duration-200',
                      selectedFile
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                        : 'bg-gray-400 cursor-not-allowed',
                    ]"
                  >
                    {{ importing ? "Importation..." : "Importer" }}
                  </button>
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
import { ref, computed, onMounted } from "vue";
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
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useGroupeStore } from "~~/stores/group";
import { useEtudiantStore } from "~~/stores/etudiant";

const route = useRoute();
const { $toastr, $swal } = useNuxtApp();
const groupeStore = useGroupeStore();
const etdudiantStore = useEtudiantStore();

// Références
const searchQuery = ref("");
const showDetailModal = ref(false);
const showImportModal = ref(false);
const selectedEtudiant = ref(null);
const selectedFile = ref(null);
const dragOver = ref(false);
const importing = ref(false);
const itemsPerPage = ref(10);
const fileInput = ref(null);

const importLoading = ref(false);
const importError = ref("");
const exportLoading=ref(false);

// Filtres
const filters = ref({
  niveau: "",
  filiere: "",
  groupe: "",
});

// Colonnes de la table
const columns = ref([
  { field: "matricule", title: "Matricule", visible: true },
  { field: "nom_complet", title: "Nom & Prénom", visible: true },
  { field: "email", title: "Email", visible: false },
  { field: "genre", title: "Genre", visible: true },
  { field: "tel", title: "Téléphone", visible: true },
  { field: "nationalite", title: "Nationalité", visible: false },
  { field: "annee_admission", title: "Année", visible: false },
  { field: "action", title: "Actions", visible: true },
]);

const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

// Rows filtrées
const filteredRows = computed(() => {
  let filtered = groupeStore.etudiants.map((e) => ({
    id: e.id,
    matricule: e.matricule,
    nom_complet: `${e.nom} ${e.prenom}`,
    email: formatEmail(e.email),
    genre: e.genre,
    tel: e.tel || "--",
    nationalite: e.nationalite || "--",
    annee_admission: e.annee_admission || "--",
    date_naissance: e.date_naissance,
    // pour la modale détail
    raw: e,
  }));

  // Appliquer les filtres
  if (filters.value.niveau) {
    filtered = filtered.filter((e) => {
      // Logique de filtrage par niveau (à adapter selon vos données)
      return true; // Temporaire
    });
  }

  if (filters.value.filiere) {
    filtered = filtered.filter((e) => {
      // Logique de filtrage par filière (à adapter selon vos données)
      return true; // Temporaire
    });
  }

  return filtered;
});

// Fonctions utilitaires
const formatEmail = (email) => {
  if (!email) return "--";
  return email.replace(/\./g, "").replace(/@etudiant\.exemple\.com/, "");
};

const formatDate = (dateString) => {
  if (!dateString) return "--";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
};

// Fonctions pour les modales
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

// Gestion des fichiers
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
    // Vérifier l'extension
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

// Édition d'un étudiant
const openEditModal = (item) => {

  
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
    await groupeStore.fetchGroupEtudiants(group_id.value);
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

// Dans le composant
const processExport = async () => {
  exportLoading.value = true;

  try {
    // Appeler le store avec l'ID du groupe si nécessaire
    const response = await etdudiantStore.exportEtudiants({ 
      group_id: group_id.value 
    });
    
    // La réponse devrait être un Blob
    const blob = response.data;
    
    // Vérifier que c'est bien un Blob
    if (blob instanceof Blob) {
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Essayer d'extraire le nom de fichier depuis les headers
      let filename = 'etudiants.xlsx';
      const contentDisposition = response.headers['content-disposition'];
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      // Sinon, créer un nom par défaut
      if (filename === 'etudiants.xlsx') {
        const date = new Date().toISOString().split('T')[0];
        filename = `etudiants_${date}.xlsx`;
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Libérer l'URL
      window.URL.revokeObjectURL(url);
      
      $toastr.success("Exportation terminée !");
    } else {
      // Si ce n'est pas un Blob, afficher un message d'erreur
      console.error("La réponse n'est pas un fichier blob:", response);
      $toastr.error("Format de réponse invalide pour l'exportation");
    }
    
  } catch (error) {
    console.error("Erreur lors de l'exportation:", error);
    
    let errorMessage = "Erreur lors de l'exportation.";
    
    if (error.response) {
      const { data, status } = error.response;
      
      if (status === 404) {
        errorMessage = "Aucun étudiant à exporter.";
      } else if (data && data.message) {
        errorMessage = data.message;
      } else if (status === 500) {
        errorMessage = "Erreur serveur lors de l'exportation.";
      }
    } else if (error.request) {
      errorMessage = "Impossible de contacter le serveur.";
    }
    
    $toastr.error(errorMessage);
  } finally {
    exportLoading.value = false;
  }
};
const editEtudiant = () => {
  if (selectedEtudiant.value) {
    openEditModal(selectedEtudiant.value);
    closeDetailModal();
  }
};

// Suppression d'un étudiant
const deleteEtudiant = async (item) => {
  const res = await $swal.fire({
    title: "Supprimer cet étudiant ?",
    text: "Cette action est irréversible",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Supprimer",
    cancelButtonText: "Annuler",
    confirmButtonColor: "#dc2626",
  });

  if (res.isConfirmed) {
    try {
      // Ici, vous intégrerez la logique de suppression
      // await groupeStore.deleteEtudiant(item.id);
      $toastr.success("Étudiant supprimé avec succès");
      // Recharger la liste
      await groupeStore.fetchGroupEtudiants(group_id.value);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      $toastr.error(error.response?.data?.message || "Une erreur est survenue");
    }
  }
};


// Chargement initial
const group_id = ref(route.params.id);

onMounted(async () => {
  await groupeStore.fetchGroupEtudiants(group_id.value);
});
</script>
