<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Examens', to: '/' },
        { label: 'Mes examens', to: null },
      ]"
      title="Mes examens en ligne"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Message de blocage -->
    <div v-if="isBlocked" class="bg-white dark:bg-gray-800 border-l-4 border-red-500 p-6 rounded-xl shadow-lg mt-10 animate-fade-in">
      <div class="flex items-center gap-5">
        <div class="p-4 bg-red-100 dark:bg-red-900/30 rounded-full flex-shrink-0">
          <svg class="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Accès aux examens suspendu</h3>
          <p class="text-gray-600 dark:text-gray-400 text-lg">Votre accès aux examens en ligne a été restreint par l'administration. Veuillez contacter le service administratif ou financier pour régulariser votre situation.</p>
        </div>
      </div>
    </div>

    <!-- Contenu normal -->
    <template v-else>
      <!-- Toolbar -->
    <div
      class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5"
    >
      <!-- Recherche -->
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Rechercher par matière, code, groupe..."
        class="w-full lg:w-64 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <!-- Filtre par statut -->
      <div class="flex flex-col sm:flex-row gap-3">
        <select
          v-model="statusFilter"
          class="px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Tous les statuts</option>
          <option value="En attente">En attente</option>
          <option value="En cours">En cours</option>
          <option value="Terminée">Terminée</option>
        </select>
      </div>
    </div>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">À venir</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-white">
              {{ stats.enAttente }}
            </p>
          </div>
          <div class="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <svg
              class="w-6 h-6 text-amber-600 dark:text-amber-400"
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
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">En cours</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-white">
              {{ stats.enCours }}
            </p>
          </div>
          <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <svg
              class="w-6 h-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Terminés</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-white">
              {{ stats.termines }}
            </p>
          </div>
          <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <svg
              class="w-6 h-6 text-blue-600 dark:text-blue-400"
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
        <p class="text-gray-500 dark:text-gray-400">Aucun examen trouvé</p>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="visibleColumns"
          :rows="filteredRows"
          :search="searchQuery"
          :per-page="itemsPerPage"
          skin="bh-table-striped bh-table-hover"
        >
          <!-- Template pour la colonne Type -->

          <!-- Template pour la colonne Matière -->
          <template #matiere.nom="data">
            <div>
              <span
                class="text-sm font-medium text-gray-900 dark:text-white block"
              >
                {{ data.value?.matiere.nom || "Non spécifiée" }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ data.value.matiere?.code || "" }}
              </span>
            </div>
          </template>

          

          <!-- Template pour la colonne Salle -->
          <template #salle.nom="data">
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ data.value?.salle?.nom || "Non spécifiée" }}
            </span>
          </template>

          <!-- Template pour la colonne Date -->
          <template #date="data">
            <div>
              <span class="text-sm text-gray-600 dark:text-gray-400 block">
                {{ formatDate(data.value.debut) }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-500">
                {{ data.value?.debut ? formatTime(data.value.debut) : "" }} -
                {{ data.value?.fin ? formatTime(data.value.fin) : "" }}
              </span>
            </div>
          </template>

          <!-- Template pour la colonne Durée -->
          <template #duration_minutes="data">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ formatDuration(data.value.duration_minutes) }}
            </span>
          </template>

          <!-- Template pour la colonne Statut -->
          <template #status="data">
            <span
              class="px-3 py-1 rounded-full text-xs font-medium"
              :class="getStatusBadgeClass(data.value.status)"
            >
              {{ data.value.status }}
            </span>
          </template>

          <!-- Template pour la colonne Actions -->
          <template #action="data">
            <div class="flex justify-center gap-2">
              <!-- LIEN UNIQUE POUR TOUS LES EXAMENS - VERSION TEST -->
              <NuxtLink
                :to="`/evaluations/examen-en-ligne/${data.value?.slug}/passer-un-examen`"
                class="p-2 rounded-lg text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
                title="Composer l'examen (mode test)"
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
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </NuxtLink>

              <!-- Voir détails (gardé pour référence) -->
              <button
                @click="openDetailModal(data.value)"
                class="p-2 rounded-lg text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors duration-200"
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
                          Détails de l'examen
                        </DialogTitle>
                        <p class="text-gray-600 dark:text-gray-300">
                          {{ selectedEvent?.matiere?.nom || "Non spécifié" }}
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
                  <!-- Informations principales -->
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
                          class="px-3 py-1 rounded-full text-sm font-medium"
                          :class="
                            selectedEvent.type === 'Examen'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          "
                        >
                          {{ selectedEvent.type }}
                        </span>
                      </div>
                    </div>

                    <!-- Statut -->
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
                      <div class="ml-11">
                        <span
                          class="px-3 py-1 rounded-full text-sm font-medium"
                          :class="getStatusBadgeClass(selectedEvent.status)"
                        >
                          {{ selectedEvent.status }}
                        </span>
                      </div>
                    </div>

                    <!-- Groupe -->
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
                          class="text-base font-medium text-gray-900 dark:text-white"
                        >
                          {{ selectedEvent.group?.nom || "Non spécifié" }}
                        </p>
                      </div>
                    </div>

                    <!-- Salle -->
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
                          class="text-base font-medium text-gray-900 dark:text-white"
                        >
                          {{ selectedEvent.salle?.nom || "Non spécifiée" }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Horaires -->
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

                  <!-- Durée et publication -->
                 
                </div>

                <!-- Footer avec bouton d'action -->
                <div
                  class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3"
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

                  <NuxtLink
                    v-if="
                      selectedEvent?.status === 'En attente' &&
                      selectedEvent?.is_online === 1
                    "
                    :to="`/examens/en-ligne/${selectedEvent?.slug}/apercu`"
                    class="px-5 py-2.5 text-sm font-medium bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
                    @click="closeDetailModal"
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
                    Voir l'aperçu
                  </NuxtLink>

                  <NuxtLink
                    v-else-if="
                      selectedEvent?.status === 'En cours' &&
                      selectedEvent?.is_online === 1
                    "
                    :to="`/examens/en-ligne/${selectedEvent?.slug}/composer`"
                    class="px-5 py-2.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    @click="closeDetailModal"
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
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Composer
                  </NuxtLink>

                  <!-- <NuxtLink
                    v-else-if="selectedEvent?.status === 'Terminée'"
                    :to="`/examens/en-ligne/${selectedEvent?.slug}/resultats`"
                    class="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    @click="closeDetailModal"
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Voir les résultats
                  </NuxtLink> -->
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
    </template>
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
import { useEvaluationStore } from "~~/stores/evaluations";
import { useLoginStore } from "~~/stores/login";

const { $toastr } = useNuxtApp();

const evaluationStore = useEvaluationStore();
const loginStore = useLoginStore();
const searchQuery = ref("");
const statusFilter = ref("");
const loading = ref(true);
const itemsPerPage = ref(10);
const showDetailModal = ref(false);
const selectedEvent = ref(null);

const isBlocked = computed(() => {
  try {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    return userData?.statut === 'bloque';
  } catch {
    return false;
  }
});

// Configuration des colonnes
const columns = ref([
  { field: "matiere.nom", title: "Matière", visible: true },
  { field: "salle.nom", title: "Salle", visible: true },
  { field: "date", title: "Date", visible: true },
  { field: "duration_minutes", title: "Durée", visible: true },
  { field: "status", title: "Statut", visible: true },
  { field: "action", title: "Actions", visible: true },
]);

const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

// Données du store
const rows = computed(() => evaluationStore.evaluations || []);

// Statistiques
const stats = computed(() => {
  const all = rows.value.filter((e) => e.published === 1 && e.is_online === 1);
  return {
    enAttente: all.filter((e) => e.status === "En attente").length,
    enCours: all.filter((e) => e.status === "En cours").length,
    termines: all.filter((e) => e.status === "Terminée").length,
    total: all.length,
  };
});

// Filtrage
const filteredRows = computed(() => {
  let filtered = rows.value.filter(
    (e) => e.published === 1 && e.is_online === 1,
  );

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.matiere?.nom?.toLowerCase().includes(query) ||
        item.matiere?.code?.toLowerCase().includes(query) ||
        item.group?.nom?.toLowerCase().includes(query) ||
        item.salle?.nom?.toLowerCase().includes(query),
    );
  }

  if (statusFilter.value) {
    filtered = filtered.filter((item) => item.status === statusFilter.value);
  }

  return filtered;
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

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "En attente":
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300";
    case "En cours":
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
    case "Terminée":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
    default:
      return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
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

onMounted(async () => {
  try {
    // On rafraîchit les infos utilisateur pour être sûr d'avoir le dernier statut (actif/bloqué)
    await loginStore.fetchUser();
    
    if (!isBlocked.value) {
      await evaluationStore.fetchEvaluationsForStudent();
    }
  } catch (error) {
    console.error("Erreur lors du chargement:", error);
    $toastr.error("Erreur lors du chargement des données");
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* Animation pour le point rouge */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
