<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Evaluations', to: '/' },
        { label: 'Liste', to: null },
      ]"
      title="Liste des évaluations"
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
        <NuxtLink
        to="/evaluations/ajouter-une-evaluation"
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
        </NuxtLink>
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
          <template #published="{ value }">
            <div class="flex items-center justify-center">
              <!-- Si déjà publié -->
              <div
                v-if="value === 1 || value === true"
                class="flex items-center"
              >
                <!-- ... badge vert existant ... -->
              </div>

              <!-- Si non publié -->
              <div v-else class="flex items-center">
                <button
                  @click="
                    value.published === 1 || value.published === true
                      ? null
                      : togglePublish(value)
                  "
                  :disabled="value.published === 1 || value.published === true"
                  class="relative inline-flex items-center h-7 rounded-full w-14 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  :class="{
                    'bg-green-100 dark:bg-green-900/30 focus:ring-green-300 cursor-default':
                      value.published === 1 || value.published === true,
                    'bg-gray-100 dark:bg-gray-800/40 focus:ring-gray-300 cursor-pointer':
                      !(value.published === 1 || value.published === true),
                  }"
                  :title="
                    value.published === 1 || value.published === true
                      ? 'Déjà publié (irréversible)'
                      : 'Cliquer pour publier'
                  "
                >
                  <span
                    :class="{
                      'translate-x-8 bg-green-500 dark:bg-green-600':
                        value.published === 1 || value.published === true,
                      'translate-x-1 bg-gray-500 dark:bg-gray-600': !(
                        value.published === 1 || value.published === true
                      ),
                    }"
                    class="inline-block w-5 h-5 transform rounded-full shadow-sm transition-all duration-200"
                  ></span>
                </button>
                <span
                  class="ml-3 text-sm font-medium text-red-700 dark:text-red-300"
                >
                </span>
              </div>
            </div>
          </template>
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
                class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                title="Fiche d'anpnymat"
                :to="`/evaluations/fiche-de-note/${value.slug}`"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-4 h-4"
                >
                  <path
                    d="M6 2h8l4 4v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
                  />
                  <path d="M14 2v6h6" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="8" y1="16" x2="16" y2="16" />
                </svg>
              </NuxtLink>

              <button
                @click="openConfigModal(value)"
                class="p-2 rounded-lg text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200"
                title="Configurer"
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>

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

    <TransitionRoot appear :show="showConfigModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeConfigModal">
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

        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            class="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-5"
          >
            <DialogTitle
              class="text-lg font-semibold mb-4 text-gray-900 dark:text-white"
            >
              Configurer l'évaluation -
              {{ selectedEvaluation?.matiere?.nom || "" }}
            </DialogTitle>

            <form @submit.prevent="saveConfig" class="space-y-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Surveillant 1
                </label>
                <Dropdown
                  v-model="configForm.surveillant_1_id"
                  :options="surveillantsOptions"
                  optionLabel="label"
                  optionValue="value"
                  filter
                  showClear
                  placeholder="Sélectionner un surveillant"
                  class="w-full"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Surveillant 2
                </label>
                <Dropdown
                  v-model="configForm.surveillant_2_id"
                  :options="surveillantsOptions"
                  optionLabel="label"
                  optionValue="value"
                  filter
                  showClear
                  placeholder="Sélectionner un surveillant"
                  class="w-full"
                />
              </div>

              <div class="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  @click="closeConfigModal"
                  class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  {{ isUpdating ? "Mettre à jour" : "Enregistrer" }}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </TransitionRoot>

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
                class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <DialogTitle
                          class="text-2xl font-bold text-gray-900 dark:text-white"
                        >
                          Détails de l'évaluation
                        </DialogTitle>
                        <p class="text-gray-600 dark:text-gray-300">
                          {{ selectedEvent?.matiere?.nom || "Évaluation" }}
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
                  <!-- Section Informations principales -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Matière -->
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
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                        </div>
                        <h3
                          class="font-semibold text-gray-700 dark:text-gray-300"
                        >
                          Matière
                        </h3>
                      </div>
                      <div class="ml-11">
                        <p
                          class="text-lg font-medium text-gray-900 dark:text-white"
                        >
                          {{ selectedEvent?.matiere?.nom || "Non spécifiée" }}
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          Code: {{ selectedEvent?.matiere?.code || "N/A" }}
                        </p>
                      </div>
                    </div>

                    <!-- Type d'évaluation -->
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
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h3
                          class="font-semibold text-gray-700 dark:text-gray-300"
                        >
                          Type d'évaluation
                        </h3>
                      </div>
                      <div class="ml-11">
                        <span
                          :class="[
                            selectedEvent?.type === 'Examen'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
                            'px-3 py-1 rounded-full text-sm font-medium',
                          ]"
                        >
                          {{ selectedEvent?.type || "Non spécifié" }}
                        </span>
                      </div>
                    </div>

                    <!-- Groupe -->
                    <div
                      class="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4"
                    >
                      <div class="flex items-center gap-3 mb-2">
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
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                        <h3
                          class="font-semibold text-gray-700 dark:text-gray-300"
                        >
                          Groupe
                        </h3>
                      </div>
                      <div class="ml-11">
                        <p
                          class="text-lg font-medium text-gray-900 dark:text-white"
                        >
                          {{ selectedEvent?.group?.nom || "Aucun groupe" }}
                        </p>
                        <p
                          v-if="selectedEvent?.group?.filieres?.length"
                          class="text-sm text-gray-500 dark:text-gray-400 mt-1"
                        >
                          {{ selectedEvent.group.filieres.length }} filière(s)
                        </p>
                      </div>
                    </div>

                    <!-- Salle -->
                    <div
                      class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4"
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
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                        <h3
                          class="font-semibold text-gray-700 dark:text-gray-300"
                        >
                          Salle
                        </h3>
                      </div>
                      <div class="ml-11">
                        <p
                          class="text-lg font-medium text-gray-900 dark:text-white"
                        >
                          {{ selectedEvent?.salle?.nom || "Non spécifiée" }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Section Horaires et dates -->
                  <div
                    class="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl p-4"
                  >
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center gap-3">
                        <div
                          class="p-2 bg-rose-100 dark:bg-rose-800/30 rounded-lg"
                        >
                          <svg
                            class="w-5 h-5 text-rose-600 dark:text-rose-400"
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
                        </div>
                        <div>
                          <h3
                            class="font-semibold text-gray-700 dark:text-gray-300"
                          >
                            Horaires
                          </h3>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            Date et heures de l'évaluation
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div
                        class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-rose-100 dark:border-rose-700/30"
                      >
                        <p
                          class="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Date
                        </p>
                        <p
                          class="text-lg font-bold text-rose-600 dark:text-rose-400 mt-1"
                        >
                          {{ formatDate(selectedEvent?.date) || "Non définie" }}
                        </p>
                      </div>

                      <div
                        class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-rose-100 dark:border-rose-700/30"
                      >
                        <p
                          class="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Début
                        </p>
                        <p
                          class="text-lg font-bold text-rose-600 dark:text-rose-400 mt-1"
                        >
                          {{ formatTime(selectedEvent?.debut) || "Non défini" }}
                        </p>
                      </div>

                      <div
                        class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-rose-100 dark:border-rose-700/30"
                      >
                        <p
                          class="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Fin
                        </p>
                        <p
                          class="text-lg font-bold text-rose-600 dark:text-rose-400 mt-1"
                        >
                          {{ formatTime(selectedEvent?.fin) || "Non défini" }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Section Statut et publication -->
                  <div
                    class="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4"
                  >
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center gap-3">
                        <div
                          class="p-2 bg-violet-100 dark:bg-violet-800/30 rounded-lg"
                        >
                          <svg
                            class="w-5 h-5 text-violet-600 dark:text-violet-400"
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
                        </div>
                        <div>
                          <h3
                            class="font-semibold text-gray-700 dark:text-gray-300"
                          >
                            Statut
                          </h3>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            État de l'évaluation
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div
                        class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-violet-100 dark:border-violet-700/30"
                      >
                        <p
                          class="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Publication
                        </p>
                        <div class="mt-1">
                          <span
                            :class="[
                              selectedEvent?.published === 1
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
                              'px-3 py-1 rounded-full text-sm font-medium',
                            ]"
                          >
                            {{
                              selectedEvent?.published === 1
                                ? "Publiée"
                                : "Non publiée"
                            }}
                          </span>
                        </div>
                      </div>

                      <div
                        class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-violet-100 dark:border-violet-700/30"
                      >
                        <p
                          class="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Statut
                        </p>
                        <div class="mt-1">
                          <span
                            :class="[
                              selectedEvent?.status === 'Terminée'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                : selectedEvent?.status === 'En cours'
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                                  : 'bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-300',
                              'px-3 py-1 rounded-full text-sm font-medium',
                            ]"
                          >
                            {{ selectedEvent?.status || "En attente" }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Section Filières du groupe -->
                  <div
                    v-if="selectedEvent?.group?.filieres?.length"
                    class="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-4"
                  >
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center gap-3">
                        <div
                          class="p-2 bg-cyan-100 dark:bg-cyan-800/30 rounded-lg"
                        >
                          <svg
                            class="w-5 h-5 text-cyan-600 dark:text-cyan-400"
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
                            Filières concernées
                          </h3>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            {{ selectedEvent.group.filieres.length }} filière(s)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="filiere in selectedEvent.group.filieres"
                        :key="filiere.id"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-800/30 dark:to-blue-800/30 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-700/30"
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Évaluation créée</span>
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
import { useRouter } from "vue-router";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";
import Breadcrumb from "~/components/Breadcrumb.vue";

import { useEvaluationStore } from "~~/stores/evaluations";
import { useUserStore } from "~~/stores/user";


const { $toastr, $swal } = useNuxtApp();

const userStore = useUserStore();
const evaluationStore = useEvaluationStore();
const router=useRouter();
const searchQuery = ref("");
const loading = ref(true);
const showModal = ref(false);
const modalTitle = ref("");
const itemsPerPage = ref(5);
const showDetailModal = ref(false);
const selectedEvent = ref(null);
const showConfigModal = ref(false);
const evaluation_id = ref("");
const selectedEvaluation = ref(null);
const isUpdating = ref(false);

const configForm = ref({
  surveillant_1_id: "",
  surveillant_2_id: "",
});

const form = ref({
  id: null,
  type: "", // 'Examen' ou 'Devoir'
  niveau_id: null,
  filieres: [],
  group_id: null,
  unite_valeur_id: null,
  salle_id: null,
  semestre: null,
  date: null,
  debut: null,
  fin: null,
  duration_minutes: null,
  correction_end_date: null,
  is_online: false,
  published: false,
});


const columns = ref([
  { field: "type", title: "Type", visible: true },
  { field: "matiere.nom", title: "Matiere", visible: true },
  { field: "published", title: "Publier", visible: true },
  { field: "action", title: "Actions", visible: true },
]);

const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

const existingSurveillants = computed(() => {
  if (!selectedEvaluation.value?.fiche?.surveillants) return [];
  return selectedEvaluation.value.fiche.surveillants;
});

const rows = computed(() => evaluationStore.evaluations);

const openConfigModal = (evaluation) => {
  selectedEvaluation.value = evaluation;
  isUpdating.value = !!evaluation?.fiche;
  configForm.value = {
    surveillant_1_id: "",
    surveillant_2_id: "",
  };
  if (
    evaluation?.fiche?.surveillants &&
    evaluation.fiche.surveillants.length > 0
  ) {
    if (evaluation.fiche.surveillants[0]) {
      configForm.value.surveillant_1_id = evaluation.fiche.surveillants[0].slug;
    }
    if (evaluation.fiche.surveillants[1]) {
      configForm.value.surveillant_2_id = evaluation.fiche.surveillants[1].slug;
    }
  }
  showConfigModal.value = true;
};

const closeConfigModal = () => {
  showConfigModal.value = false;
  selectedEvaluation.value = null;
  isUpdating.value = false;
  configForm.value = {
    surveillant_1_id: "",
    surveillant_2_id: "",
  };
};

const saveConfig = async () => {
  try {
    const payload = {
      evaluation_id: selectedEvaluation.value.slug,
      ...configForm.value,
    };

    if (isUpdating.value && selectedEvaluation.value?.fiche?.slug) {
      await evaluationStore.updateFicheDePresence(
        selectedEvaluation.value.fiche.slug,
        payload,
      );
      $toastr.success("Configuration mise à jour avec succès");
    } else {
      await evaluationStore.addFicheDePresence(payload);
      $toastr.success("Configuration enregistrée avec succès");
    }
    await evaluationStore.fetchEvaluations();
    closeConfigModal();
  } catch (error) {
    console.error("Erreur lors de la configuration:", error);
    $toastr.error(error.response?.data?.message || "Une erreur est survenue");
  }
};

const togglePublish = async (evaluation) => {
  try {
    const res = await $swal.fire({
      title: "Publier cette évaluation ?",
      text: "Une fois publiée, l'évaluation ne pourra plus être modifiée ou supprimée.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Publier",
      cancelButtonText: "Annuler",
    });

    if (res.isConfirmed) {
      await evaluationStore.publishedEvaluation(evaluation.slug);
      await evaluationStore.fetchEvaluations();
      $toastr.success("Évaluation publiée avec succès");
    }
  } catch (error) {
    console.error("Erreur lors de la publication:", error);
    $toastr.error(error.response?.data?.message || "Une erreur est survenue");
  }
};


const surveillantsOptions = computed(() => {
  return userStore.enseignants.map((e) => ({
    label: `${e.nom} ${e.prenom} (${e.supervisor_type || "Non défini"})`,
    value: e.slug,
  }));
});



const openDetailModal = (evaluation) => {
  selectedEvent.value = evaluation;
  showDetailModal.value = true;
};

const openEditModal= async(evaluation)=>{
  try{
  await evaluationStore.checkEvaluation(evaluation.slug);
  navigateTo(`/evaluations/${evaluation.slug}/modifier-une-evaluation`)
  }catch(error){
    console.error("Erreur lors de l'ouverture du modal d'ajout:", error);
    $toastr.error(error.response?.data?.message || "Une erreur est survenue");
  }

}

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedEvent.value = null;
};





const calculateDuration = () => {
  if (form.value.debut && form.value.fin) {
    const [startH, startM] = form.value.debut.split(':').map(Number);
    const [endH, endM] = form.value.fin.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    form.value.duration_minutes = Math.max(0, endMinutes - startMinutes);
  }
};





// Méthodes pour formater les dates et heures
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (timeString) => {
  if (!timeString) return "";
  const date = new Date(timeString);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const deleteItem = async (evaluation) => {
  const res = await $swal.fire({
    title: "Supprimer cet évaluation ?",
    text: "Cette action est irréversible",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Supprimer",
    cancelButtonText: "Annuler",
  });

  if (res.isConfirmed) {
    try {
      await evaluationStore.deleteEvaluation(evaluation.slug);
      await evaluationStore.fetchEvaluations();
      $toastr.success("Évaluation supprimée avec succès");
    } catch (error) {
      console.log(error);
      $toastr.error(error.response?.data?.message || "Une erreur est survenue");
    }
  }
};



watch([() => form.value.debut, () => form.value.fin], () => {
  calculateDuration();
});

onMounted(async () => {
  try {
    await Promise.all([
      evaluationStore.fetchEvaluations(),
      userStore.fetchUsersSurveillant(),
    ]);
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
    $toastr.error("Erreur lors du chargement des données");
  } finally {
    loading.value = false;
  }
});
</script>
