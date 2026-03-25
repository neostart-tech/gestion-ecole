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
      title="Mes examens"
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
        placeholder="Rechercher par matière, groupe, salle..."
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

      <div v-else-if="!filteredRows.length" class="text-center py-10">
        <svg
          class="w-16 h-16 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p class="text-gray-500 dark:text-gray-400">
          Aucune évaluation trouvée
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="visibleColumns"
          :rows="filteredRows"
          :search="searchQuery"
          :per-page="itemsPerPage"
          skin="bh-table-striped bh-table-hover"
        >
          <!-- Template pour la colonne Matière -->
          <template #matiere="data">
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ data.value?.nom || "Non spécifiée" }}
            </span>
          </template>

          <!-- Template pour la colonne Groupe -->
          <template #group.nom="data">
            <span class="text-sm font-medium text-gray-900 dark:text-white">
             {{ data.value?.group?.niveau?.libelle || "Non spécifiée" }} {{ data.value?.group?.nom || "Non spécifiée" }}
            </span>
          </template>

          <!-- Template pour la colonne Salle -->
          <template #salle.nom="data">
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ data.value?.salle?.nom || "Non spécifiée" }}
            </span>
          </template>

          <!-- Template pour la colonne Date -->
          <template #date="data">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ formatDate(data.value.date) }}
            </span>
          </template>

          <!-- Template pour la colonne Durée -->
          <template #duration_minutes="data">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ formatDuration(data.value.duration_minutes) }}
            </span>
          </template>

          <!-- Template pour la colonne Actions -->
          <template #action="{ value }">
            <div class="flex justify-center gap-2">
              <!-- Voir détails -->
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

              <!-- Questions (si en ligne) -->
              <NuxtLink
                v-if="value.is_online === 1"
                :to="`/evaluations/examen-en-ligne/${value.slug}/questions`"
                class="p-2 rounded-lg text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200"
                title="Gérer les questions"
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
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </NuxtLink>

                <NuxtLink
                v-if="value.is_online === 1"
                :to="`/evaluations/examen-en-ligne/${value.slug}/soumission-des-etudiants`"
                class="p-2 rounded-lg text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200"
                title="Voir les soummissions des étudiants"
              >
         <svg
  class="w-4 h-4"
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
>
  <!-- Document avec personnes -->
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M9 12h6m-6 4h6m2-10H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"
  />
  <circle cx="12" cy="8" r="2" stroke="currentColor" />
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M8 18c.5-1 2-2 4-2s3.5 1 4 2"
  />
</svg>
              </NuxtLink>
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>

    <!-- Modal de configuration -->
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
              Configurer l'évaluation
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
                          {{ selectedEvent?.type || "Évaluation" }} - 
                          <span :class="getStatusClass(selectedEvent?.status)">
                            {{ selectedEvent?.status || "Non défini" }}
                          </span>
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
                <div class="space-y-6" v-if="selectedEvent">
                  <!-- Section Informations principales -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Type -->
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
                          Type
                        </h3>
                      </div>
                      <div class="ml-11">
                        <span
                          :class="[
                            selectedEvent.type === 'Examen'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
                            'px-3 py-1 rounded-full text-sm font-medium',
                          ]"
                        >
                          {{ selectedEvent.type }}
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
                          {{ selectedEvent.group?.nom || "Non spécifié" }}
                        </p>
                        <p v-if="selectedEvent.group?.niveau" class="text-sm text-gray-500 dark:text-gray-400">
                          Niveau: {{ selectedEvent.group.niveau.libelle }}
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
                          {{ selectedEvent.salle?.nom || "Non spécifiée" }}
                        </p>
                        <p
                          v-if="selectedEvent.salle?.effectif"
                          class="text-sm text-gray-500 dark:text-gray-400"
                        >
                          Capacité: {{ selectedEvent.salle.effectif }} places
                        </p>
                      </div>
                    </div>

                    <!-- Durée -->
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h3
                          class="font-semibold text-gray-700 dark:text-gray-300"
                        >
                          Durée
                        </h3>
                      </div>
                      <div class="ml-11">
                        <p
                          class="text-lg font-medium text-gray-900 dark:text-white"
                        >
                          {{ formatDuration(selectedEvent.duration_minutes) }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Section Matière et Filières -->
                  <div
                    class="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-4"
                  >
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
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <h3 class="font-semibold text-gray-700 dark:text-gray-300">
                        Matière et filières
                      </h3>
                    </div>

                    <div class="ml-11 space-y-3">
                      <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Matière</p>
                        <p class="text-base font-medium text-gray-900 dark:text-white">
                          {{ selectedEvent.matiere?.nom || "Non spécifiée" }}
                          <span class="text-sm text-gray-500 ml-2">({{ selectedEvent.matiere?.code }})</span>
                        </p>
                      </div>
                      
                      <div v-if="selectedEvent.matiere?.ue">
                        <p class="text-sm text-gray-500 dark:text-gray-400">Unité d'enseignement</p>
                        <p class="text-base text-gray-900 dark:text-white">
                          {{ selectedEvent.matiere.ue.nom }} ({{ selectedEvent.matiere.ue.code }})
                        </p>
                      </div>

                      <div v-if="selectedEvent.group?.filieres?.length">
                        <p class="text-sm text-gray-500 dark:text-gray-400">Filières concernées</p>
                        <div class="flex flex-wrap gap-2 mt-1">
                          <span
                            v-for="filiere in selectedEvent.group.filieres"
                            :key="filiere.id"
                            class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs"
                          >
                            {{ filiere.code }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Section Horaires -->
                  <div
                    class="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl p-4"
                  >
                    <div class="flex items-center gap-3 mb-4">
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h3
                        class="font-semibold text-gray-700 dark:text-gray-300"
                      >
                        Date et heure
                      </h3>
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
                          {{ formatDate(selectedEvent.date) }}
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
                          {{ formatTime(selectedEvent.debut) }}
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
                          {{ formatTime(selectedEvent.fin) }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Section Statut -->
                  <div
                    class="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4"
                  >
                    <div class="flex items-center gap-3 mb-4">
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
                      <h3
                        class="font-semibold text-gray-700 dark:text-gray-300"
                      >
                        Statut
                      </h3>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                              selectedEvent.published === 1
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
                              'px-3 py-1 rounded-full text-sm font-medium',
                            ]"
                          >
                            {{
                              selectedEvent.published === 1
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
                          En ligne
                        </p>
                        <div class="mt-1">
                          <span
                            :class="[
                              selectedEvent.is_online === 1
                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
                                : 'bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-300',
                              'px-3 py-1 rounded-full text-sm font-medium',
                            ]"
                          >
                            {{ selectedEvent.is_online === 1 ? "Oui" : "Non" }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Dates de correction -->
                  <div
                    v-if="selectedEvent.correction_end_date"
                    class="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-4"
                  >
                    <div class="flex items-center gap-3 mb-2">
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </div>
                      <h3
                        class="font-semibold text-gray-700 dark:text-gray-300"
                      >
                        Correction
                      </h3>
                    </div>
                    <div class="ml-11 space-y-2">
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        <span class="font-medium">Date limite:</span>
                        {{ formatDate(selectedEvent.correction_end_date) }}
                      </p>
                      <p
                        v-if="selectedEvent.correction_submission_date"
                        class="text-sm text-gray-600 dark:text-gray-400"
                      >
                        <span class="font-medium">Soumise le:</span>
                        {{
                          formatDate(selectedEvent.correction_submission_date)
                        }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Footer -->
                <div
                  class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end"
                >
                  <button
                    type="button"
                    @click="closeDetailModal"
                    class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
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
const router = useRouter();
const searchQuery = ref("");
const loading = ref(true);
const itemsPerPage = ref(10);
const showDetailModal = ref(false);
const selectedEvent = ref(null);
const showConfigModal = ref(false);
const selectedEvaluation = ref(null);
const isUpdating = ref(false);

const configForm = ref({
  surveillant_1_id: "",
  surveillant_2_id: "",
});

// Configuration des colonnes
const columns = ref([
  { field: "matiere.nom", title: "Matière", visible: true },
  { field: "group.nom", title: "Groupe", visible: true },
  { field: "salle.nom", title: "Salle", visible: true },
  { field: "date", title: "Date", visible: true },
  { field: "duration_minutes", title: "Durée", visible: true },
  { field: "status", title: "Statut", visible: true },
  { field: "action", title: "Actions", visible: true },
]);

const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

// Utiliser les données du store
const rows = computed(() => evaluationStore.evaluations || []);

// Filtre de recherche personnalisé
const filteredRows = computed(() => {
  if (!searchQuery.value) return rows.value;

  const query = searchQuery.value.toLowerCase();
  return rows.value.filter(
    (item) =>
      item.type?.toLowerCase().includes(query) ||
      item.matiere?.nom?.toLowerCase().includes(query) ||
      item.group?.nom?.toLowerCase().includes(query) ||
      item.salle?.nom?.toLowerCase().includes(query) ||
      item.status?.toLowerCase().includes(query),
  );
});

const surveillantsOptions = computed(() => {
  return (
    userStore.enseignants?.map((e) => ({
      label: `${e.nom} ${e.prenom} (${e.supervisor_type || "Non défini"})`,
      value: e.slug,
    })) || []
  );
});

// ========== MÉTHODES ==========
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
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

const formatDuration = (minutes) => {
  if (!minutes) return "Non défini";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h${mins > 0 ? mins : ""}` : `${mins}min`;
};

const getStatusClass = (status) => {
  switch (status) {
    case "Terminée":
      return "text-red-600 dark:text-red-400";
    case "En attente":
      return "text-yellow-600 dark:text-yellow-400";
    case "En cours":
      return "text-green-600 dark:text-green-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

const openDetailModal = (event) => {
  selectedEvent.value = event;
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedEvent.value = null;
};

const openConfigModal = (evaluation) => {
  selectedEvaluation.value = evaluation;
  configForm.value = {
    surveillant_1_id: evaluation.surveillant_1_id || "",
    surveillant_2_id: evaluation.surveillant_2_id || "",
  };
  isUpdating.value = false;
  showConfigModal.value = true;
};

const closeConfigModal = () => {
  showConfigModal.value = false;
  selectedEvaluation.value = null;
  configForm.value = {
    surveillant_1_id: "",
    surveillant_2_id: "",
  };
};

const saveConfig = async () => {
  if (!selectedEvaluation.value) return;

  try {
    // Logique de sauvegarde à implémenter
    $toastr.success("Configuration enregistrée avec succès");
    closeConfigModal();
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error);
    $toastr.error("Erreur lors de la sauvegarde");
  }
};

onMounted(async () => {
  try {
    await Promise.all([
      evaluationStore.fetchEvaluationsForTeacher(),
      userStore.fetchUsersSurveillant(),
    ]);
  } catch (error) {
    console.error("Erreur lors du chargement:", error);
    $toastr.error("Erreur lors du chargement des données");
  } finally {
    loading.value = false;
  }
});
</script>