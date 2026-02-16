<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Évaluations', to: '/evaluations' },
        { label: 'Notes', to: null },
      ]"
      title="Gestion des notes"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />
    <div
      v-if="!loading && notes.length > 0"
      class="mt-6 mb-10 pt-6 border-t border-gray-200 dark:border-gray-700"
    >
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div
            class="text-sm text-blue-700 dark:text-blue-300 font-medium mb-1"
          >
            Notes saisies
          </div>
          <div class="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {{ notesSaisies }} / {{ notes.length }}
          </div>
        </div>
        <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div
            class="text-sm text-green-700 dark:text-green-300 font-medium mb-1"
          >
            Moyenne
          </div>
          <div class="text-2xl font-bold text-green-900 dark:text-green-100">
            {{ moyenneNotes.toFixed(2) }}/20
          </div>
        </div>
        <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <div
            class="text-sm text-yellow-700 dark:text-yellow-300 font-medium mb-1"
          >
            Plus haute note
          </div>
          <div class="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
            {{ plusHauteNote.toFixed(2) }}/20
          </div>
        </div>
        <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
          <div class="text-sm text-red-700 dark:text-red-300 font-medium mb-1">
            Plus basse note
          </div>
          <div class="text-2xl font-bold text-red-900 dark:text-red-100">
            {{ plusBasseNote.toFixed(2) }}/20
          </div>
        </div>
      </div>
    </div>

    <!-- Informations sur l'évaluation -->
    <div
      v-if="evaluationDetails"
      class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6"
    >
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {{ evaluationDetails.matiere?.nom || "Électronique Numérique" }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div class="flex items-center gap-2">
              <svg
                class="w-4 h-4 text-gray-500"
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
              <span class="text-gray-700 dark:text-gray-300">
                Date: {{ formatDate(evaluationDetails.date) }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <svg
                class="w-4 h-4 text-gray-500"
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
              <span class="text-gray-700 dark:text-gray-gray-300">
                Heure: {{ formatTime(evaluationDetails.debut) }} -
                {{ formatTime(evaluationDetails.fin) }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <svg
                class="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span class="text-gray-700 dark:text-gray-300">
                {{ notes.length }} étudiants
              </span>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-2">
            <span
              :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                evaluationDetails.status === 'Terminée'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : evaluationDetails.status === 'En cours'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
              ]"
            >
              {{ evaluationDetails.status }}
            </span>
            <span
              v-if="evaluationDetails.type"
              class="text-sm text-gray-600 dark:text-gray-400"
            >
              • {{ evaluationDetails.type }}
            </span>
          </div>
        </div>

        <!-- Boutons d'action pour l'évaluation -->
        <div class="flex flex-wrap gap-2">
          <button
            @click="saveAllNotes"
            :disabled="savingAll || !correctionEnable"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              v-if="savingAll"
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
            <svg
              v-else
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {{ savingAll ? "Sauvegarde..." : (!correctionEnable ? "Correction désactivée" : `Sauvegarder (${notesSaisies})`) }}
          </button>

          <button
            @click="publishNotes"
            :disabled="!correctionEnable || publishing"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              v-if="publishing"
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
            <svg
              v-else
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
              />
            </svg>
            {{ !correctionEnable ? "Correction désactivée" : (publishing ? "Publication..." : "Publier les notes") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div
      class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5"
    >
      <!-- Recherche -->
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Rechercher par nom, prénom ou anonymat..."
        class="w-full lg:w-64 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
      />

      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Colonnes -->
        <client-only>
          <VDropdown placement="bottom-end">
            <button
              class="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
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
            :disabled="exportLoading"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
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
            {{ exportLoading ? "Exportation..." : "Exporter" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-3 sm:p-4">
      <div v-if="loading" class="flex justify-center py-10">
        <div
          class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"
        ></div>
      </div>

      <div v-else-if="notes.length === 0" class="text-center py-10">
        <div
          class="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4"
        >
          <svg
            class="w-8 h-8 text-gray-400"
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
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Aucune note disponible
        </h3>
        <p class="text-gray-500 dark:text-gray-400">
          Aucun étudiant n'a encore été noté pour cette évaluation.
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
          <template #notation="data">
            <div class="flex items-center gap-2">
              <InputNumber
                v-model="data.value.notation"
                inputId="minmax-buttons"
                mode="decimal"
                showButtons
                :min="0"
                :max="20"
                fluid
              />
              <!-- <span v-if="row.note" class="text-gray-500 text-sm">/20</span> -->
            </div>
          </template>
          <!-- Actions -->
          <template #action="row">
            <div class="flex justify-center gap-2">
              <!-- Modifier la note -->
              <button
                @click="openEditModal(row.value)"
                class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                title="Modifier la note"
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>

              <!-- Voir détails étudiant -->
              <button
                @click="openDetailModal(row.value)"
                class="p-2 rounded-lg text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200"
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </template>
        </Vue3Datatable>
      </div>

      <!-- Résumé des notes -->
    </div>

    <!-- Modal de modification de note -->
    <TransitionRoot appear :show="showEditModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeEditModal">
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
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
              >
                <!-- En-tête -->
                <div class="flex items-start justify-between mb-6">
                  <DialogTitle
                    class="text-xl font-bold text-gray-900 dark:text-white"
                  >
                    Modifier la note
                  </DialogTitle>
                  <button
                    @click="closeEditModal"
                    class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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

                <!-- Contenu -->
                <div class="space-y-6">
                  <!-- Informations étudiant -->
                  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div class="flex items-center gap-3 mb-3">
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p class="font-semibold text-gray-900 dark:text-white">
                          {{ selectedNote?.etudiant?.prenom }}
                          {{ selectedNote?.etudiant?.nom }}
                        </p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                          Anonymat: {{ selectedNote?.anonymat }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Note actuelle -->
                  <div
                    class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4"
                  >
                    <div class="flex items-center justify-between">
                      <div>
                        <p
                          class="text-sm text-yellow-700 dark:text-yellow-300 font-medium mb-1"
                        >
                          Note actuelle
                        </p>
                        <p
                          class="text-2xl font-bold text-yellow-900 dark:text-yellow-100"
                        >
                          {{ selectedNote?.notation || "Non noté" }}
                          <span
                            v-if="selectedNote?.notation?.note"
                            class="text-lg"
                            >/20</span
                          >
                        </p>
                      </div>
                      <div class="text-3xl text-yellow-500">→</div>
                    </div>
                  </div>

                  <!-- Nouvelle note -->
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Nouvelle note
                    </label>
                    <div class="relative">
                      <input
                        v-model="newNoteValue"
                        type="number"
                        min="0"
                        max="20"
                        step="0.25"
                        placeholder="Saisir la nouvelle note"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        @input="validateNewNote"
                      />
                      <div
                        class="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        <span class="text-gray-500">/20</span>
                      </div>
                    </div>

                    <div v-if="noteDifference !== null" class="text-sm mt-1">
                      Variation:
                      <span
                        :class="
                          noteDifference >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-500 dark:text-red-400'
                        "
                      >
                        {{ noteDifference >= 0 ? "+" : ""
                        }}{{ noteDifference.toFixed(2) }} points
                      </span>
                    </div>
                  </div>

                  <!-- Commentaire -->
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Commentaire (optionnel)
                    </label>
                    <textarea
                      v-model="newNoteComment"
                      rows="3"
                      placeholder="Ajouter un commentaire..."
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    ></textarea>
                  </div>
                </div>

                <!-- Footer -->
                <div
                  class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4"
                >
                  <button
                    type="button"
                    @click="closeEditModal"
                    class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    @click="updateNote"
                    :disabled="updatingNote || !newNoteValue"
                    class="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <svg
                      v-if="updatingNote"
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
                    {{ updatingNote ? "Mise à jour..." : "Mettre à jour" }}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

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
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
              >
                <!-- En-tête -->
                <div class="flex items-start justify-between mb-6">
                  <DialogTitle
                    class="text-xl font-bold text-gray-900 dark:text-white"
                  >
                    Détails de l'étudiant
                  </DialogTitle>
                  <button
                    @click="closeDetailModal"
                    class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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

                <!-- Contenu -->
                <div class="space-y-6" v-if="selectedNote">
                  <!-- Informations étudiant -->
                  <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div class="flex items-center gap-3 mb-4">
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p
                          class="font-bold text-gray-900 dark:text-white text-lg"
                        >
                          {{ selectedNote.etudiant?.prenom }}
                          {{ selectedNote.etudiant?.nom }}
                        </p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                          Anonymat: {{ selectedNote.anonymat }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Information de note -->
                  <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                      <div
                        class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4"
                      >
                        <div
                          class="text-sm text-green-700 dark:text-green-300 font-medium mb-1"
                        >
                          Note actuelle
                        </div>
                        <div
                          class="text-2xl font-bold text-green-900 dark:text-green-100"
                        >
                          {{ selectedNote.notation || "Non noté" }}
                          <span
                            v-if="selectedNote.notation"
                            class="text-lg"
                            >/20</span
                          >
                        </div>
                      </div>

                      <div
                        class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4"
                      >
                        <div
                          class="text-sm text-blue-700 dark:text-blue-300 font-medium mb-1"
                        >
                          Nouvelle note
                        </div>
                        <div
                          class="text-2xl font-bold text-blue-900 dark:text-blue-100"
                        >
                          {{ selectedNote.note || "Non saisie" }}
                          <span v-if="selectedNote.note" class="text-lg"
                            >/20</span
                          >
                        </div>
                      </div>
                    </div>

                    <div
                      v-if="selectedNote.notation?.commentaire"
                      class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                    >
                      <div
                        class="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2"
                      >
                        Commentaire
                      </div>
                      <p class="text-gray-900 dark:text-white">
                        {{ selectedNote.notation.commentaire }}
                      </p>
                    </div>
                  </div>

                  <!-- Information de l'évaluation -->
                  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div
                      class="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2"
                    >
                      Informations évaluation
                    </div>
                    <div class="space-y-2 text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-600 dark:text-gray-400"
                          >Date:</span
                        >
                        <span class="text-gray-900 dark:text-white">{{
                          formatDate(selectedNote.evaluation?.date)
                        }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600 dark:text-gray-400"
                          >Type:</span
                        >
                        <span class="text-gray-900 dark:text-white">{{
                          selectedNote.evaluation?.type
                        }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600 dark:text-gray-400"
                          >Statut:</span
                        >
                        <span
                          :class="[
                            'px-2 py-1 rounded-full text-xs',
                            selectedNote.evaluation?.status === 'Terminée'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
                          ]"
                        >
                          {{ selectedNote.evaluation?.status }}
                        </span>
                      </div>
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
                    class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
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
import { useRoute } from "vue-router";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useFicheDeNoteStore } from "~~/stores/fiche-de-note";

const route = useRoute();
const { $toastr, $swal } = useNuxtApp();
const ficheDeNoteStore = useFicheDeNoteStore();

// Données de l'évaluation (première note pour les détails)
const evaluationDetails = computed(() => {
  if (notes.value.length > 0) {
    return notes.value[0].raw;
  }
  return null;
});

// Références
const searchQuery = ref("");
const showEditModal = ref(false);
const showDetailModal = ref(false);
const selectedNote = ref(null);
const itemsPerPage = ref(5);
const loading = ref(false);
const savingAll = ref(false);
const publishing = ref(false);
const exportLoading = ref(false);
const evaluation_slug = ref(route.params.slug);
const correctionEnable = ref(true);

// Pour la modal d'édition
const newNoteValue = ref("");
const newNoteComment = ref("");
const newNoteError = ref("");
const updatingNote = ref(false);

// Colonnes de la table
const columns = ref([
  { field: "nom_complet", title: "Nom & Prénom", visible: true },
  { field: "anonymat", title: "Anonymat", visible: true },
  { field: "notation", title: "Note", visible: true },
  { field: "action", title: "Actions", visible: true },
]);

const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

// Traiter les données des notes à partir du store ficheDeNote
const notes = computed(() => {
  return ficheDeNoteStore.fiches.map((note) => ({
    ...note,
    note: note.notation || "",
    noteError: "",
    nom_complet: `${note.etudiant?.prenom} ${note.etudiant?.nom}`,
    raw: note,
  }));
});

// Rows filtrées
const filteredRows = computed(() => {
  return notes.value.map((note) => note);
});

const extractNoteValue = (n) => {
  const rawVal = n.tempNote ?? n.notation ?? n.note;
  if (rawVal === undefined || rawVal === null || rawVal === "") return null;
  const s = String(rawVal).trim();
  if (s.toUpperCase() === "R") return "R";
  const num = parseFloat(s);
  return !isNaN(num) ? num : null;
};

const notesSaisies = computed(() => {
  return notes.value.filter((n) => {
    const v = extractNoteValue(n);
    return v !== null;
  }).length;
});

const moyenneNotes = computed(() => {
  const notesValides = notes.value
    .map((n) => extractNoteValue(n))
    .filter((v) => v !== null && v !== "R");

  if (notesValides.length === 0) return 0;
  return notesValides.reduce((a, b) => a + b, 0) / notesValides.length;
});

const plusHauteNote = computed(() => {
  const notesValides = notes.value
    .map((n) => extractNoteValue(n))
    .filter((v) => v !== null && v !== "R");

  return notesValides.length > 0 ? Math.max(...notesValides) : 0;
});

const plusBasseNote = computed(() => {
  const notesValides = notes.value
    .map((n) => extractNoteValue(n))
    .filter((v) => v !== null && v !== "R");

  return notesValides.length > 0 ? Math.min(...notesValides) : 0;
});

const evaluationIsPublished = computed(() => {
  return !correctionEnable.value;
});

const canPublish = computed(() => {
  return notesSaisies.value > 0 && !evaluationIsPublished.value;
});

const noteDifference = computed(() => {
  if (!selectedNote.value || !newNoteValue.value) return null;
  const oldNote = selectedNote.value.notation?.note
    ? parseFloat(selectedNote.value.notation.note)
    : 0;
  return parseFloat(newNoteValue.value) - oldNote;
});

// Fonctions utilitaires
const formatDate = (dateString) => {
  if (!dateString) return "--";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  } catch {
    return dateString;
  }
};

const formatTime = (timeString) => {
  if (!timeString) return "--";
  try {
    const date = new Date(timeString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return timeString;
  }
};

// Validation des notes
const validateNote = (row) => {
  if (!row.note || row.note === "") {
    return true;
  }

  const note = parseFloat(row.note);
  if (isNaN(note) || note < 0 || note > 20) {
    return false;
  }

  row.noteError = null;
  return true;
};

const validateNewNote = () => {
  if (!newNoteValue.value || newNoteValue.value === "") {
    return false;
  }

  const note = parseFloat(newNoteValue.value);
  if (isNaN(note) || note < 0 || note > 20) {
    return false;
  }

  newNoteError.value = "";
  return true;
};


const saveAllNotes = async () => {
  if (!correctionEnable.value) {
    $toastr.warning("La correction est désactivée. Sauvegarde impossible.");
    return;
  }

  savingAll.value = true;
  const etudiants = notes.value.map((note) =>
    note.etudiant?.slug
  );
  
  const notesData = notes.value.map((note) => {
    const rawVal = note.tempNote ?? note.notation ?? note.note;
    if (rawVal === undefined || rawVal === null || rawVal === "") {
      return null;
    }
    const noteStr = String(rawVal).trim();
    if (noteStr.toUpperCase() === "R") return "R";
    const numericNote = parseFloat(noteStr);
    if (!isNaN(numericNote) && numericNote >= 0 && numericNote <= 20) {
      return numericNote;
    }
    return null;
  });
  const notesSaisiesCount = notesData.filter(note => note !== null).length;
  console.log("Notes réellement saisies:", notesSaisiesCount);

  if (notesSaisiesCount === 0) {
    $toastr.warning("Aucune note valide à sauvegarder");
    savingAll.value = false;
    return;
  }

  try {
    const payload = {
      etudiants: etudiants,
      notes: notesData,
    };

    console.log("Envoi du payload à l'API...");
    await ficheDeNoteStore.addFicheNote(evaluation_slug.value, payload);
        notes.value.forEach((note, index) => {
      if (notesData[index] !== null) {
        const noteIndex = notes.value.findIndex((n) => n.id === note.id);
        if (noteIndex !== -1) {
          const noteValue = notesData[index];
          const val = noteValue === 'R' ? 'R' : noteValue;
          notes.value[noteIndex].notation = val;
          notes.value[noteIndex].note = val;
          notes.value[noteIndex].tempNote = val;
          if (!notes.value[noteIndex].raw) notes.value[noteIndex].raw = {};
          notes.value[noteIndex].raw.notation = { note: val };
        }
      }
    });
    $toastr.success(`${notesSaisiesCount} notes sauvegardées avec succès (sur ${notes.value.length} étudiants)`);
  } catch (error) {
    console.error("Erreur sauvegarde des notes:", error);
        if (error.response?.status === 403) {
      console.error("Erreur 403 - Détails:", error.response.data);
            if (error.response.data?.exception) {
        $toastr.error("Erreur serveur: " + (error.response.data.message || "Accès refusé"));
      } else {
        $toastr.error("Accès refusé. Vérifiez vos permissions ou si l'évaluation est publiée.");
      }
    } else if (error.response?.status === 422) {
      $toastr.error("Données invalides: " + (error.response?.data?.message || "Vérifiez le format des notes"));
    } else {
      $toastr.error(error.response?.data?.message || "Erreur lors de la sauvegarde des notes");
    }
  } finally {
    savingAll.value = false;
  }
};

const publishNotes = async () => {
  if (!correctionEnable.value) {
    $toastr.warning("La correction est désactivée. Publication impossible.");
    return;
  }
  const res = await $swal.fire({
    title: "Publier les notes ?",
    text: "Les notes seront visibles par les étudiants. Cette action est irréversible.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, publier",
    cancelButtonText: "Annuler",
    confirmButtonColor: "#3b82f6",
    cancelButtonColor: "#6b7280",
  });

  if (res.isConfirmed) {
    publishing.value = true;
    try {
      await ficheDeNoteStore.PublishNote(evaluation_slug.value);
      $toastr.success("Notes publiées avec succès");
      await loadNotes(); 
    } catch (error) {
      console.error("Erreur publication notes:", error);
      $toastr.error(error.response?.data?.message || "Erreur lors de la publication des notes" );
    } finally {
      publishing.value = false;
    }
  }
};

// Modal d'édition
const openEditModal = (row) => {
  selectedNote.value = row.raw;
  newNoteValue.value = row.raw.tempNote ?? (row.raw.notation?.note ?? row.raw.notation) ?? "";
  newNoteComment.value = row.raw.notation?.commentaire || "";
  newNoteError.value = "";
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedNote.value = null;
  newNoteValue.value = "";
  newNoteComment.value = "";
  newNoteError.value = "";
  updatingNote.value = false;
};

const updateNote = async () => {
  if (!validateNewNote()) return;

  updatingNote.value = true;
  try {
    await ficheDeNoteStore.saveNote({
      id: selectedNote.value.id,
      note: parseFloat(newNoteValue.value),
      commentaire: newNoteComment.value,
    });

    // Mettre à jour la note dans le tableau
    const noteIndex = notes.value.findIndex(
      (n) => n.id === selectedNote.value.id,
    );
    if (noteIndex !== -1) {
      const val = parseFloat(newNoteValue.value);
      notes.value[noteIndex].tempNote = newNoteValue.value;
      notes.value[noteIndex].notation = val;
      notes.value[noteIndex].note = val;
      if (!notes.value[noteIndex].raw) notes.value[noteIndex].raw = {};
      notes.value[noteIndex].raw.notation = { note: val, commentaire: newNoteComment.value };
    }

    $toastr.success("Note mise à jour avec succès");
    closeEditModal();
  } catch (error) {
    console.error("Erreur mise à jour note:", error);
    $toastr.error("Erreur lors de la mise à jour de la note");
  } finally {
    updatingNote.value = false;
  }
};

// Modal détail étudiant
const openDetailModal = (row) => {
    console.log("Détails de la note sélectionnée:", row.raw);
  selectedNote.value = row.raw;
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedNote.value = null;
};

// Exportation
const processExport = async () => {
  exportLoading.value = true;

  try {
    const response = await ficheDeNoteStore.exportNotes(evaluation_slug.value);

    if (response && response.data) {
      const blob = response.data;
      if (blob instanceof Blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        let filename = "notes.xlsx";
        const contentDisposition = response.headers?.["content-disposition"];

        if (contentDisposition) {
          const filenameMatch =
            contentDisposition.match(/filename="?([^"]+)"?/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        }

        if (filename === "notes.xlsx") {
          const date = new Date().toISOString().split("T")[0];
          const matiere = evaluationDetails.value?.matiere?.nom || "notes";
          filename = `${matiere}_${date}.xlsx`;
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
    }
  } catch (error) {
    console.error("Erreur lors de l'exportation:", error);

    let errorMessage = "Erreur lors de l'exportation.";

    if (error.response) {
      const { data, status } = error.response;

      if (status === 404) {
        errorMessage = "Aucune note à exporter.";
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

// Chargement des notes
const loadNotes = async () => {
  loading.value = true;
  try {
    const response = await ficheDeNoteStore.fetchFiche(evaluation_slug.value);
    // Récupérer le flag correctionEnable depuis la réponse
    if (response && response.correctionEnable !== undefined) {
      correctionEnable.value = response.correctionEnable;
      console.log("correctionEnable:", correctionEnable.value);
    }
  } catch (error) {
    console.error("Erreur chargement notes:", error);
    $toastr.error("Erreur lors du chargement des notes");
  } finally {
    loading.value = false;
  }
};



onMounted(async () => {
  await loadNotes();
});
</script>
