<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 sm:py-8 px-3 sm:px-6 lg:px-8"
  >
  
    <!-- En-tête -->
    <div class="max-w-7xl mx-auto mb-6 sm:mb-8">
      
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700"
      >
      
        <div class="flex items-center gap-3 sm:gap-4">
          <div
            class="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transform transition-transform hover:scale-105"
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
                stroke-width="1.5"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h1
              class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight"
            >
              Emplois du temps
            </h1>
            <p
              class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"
            >
              <svg
                class="w-3 h-3"
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
              Gestion des exports Excel et PDF
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 self-start sm:self-center">
          
          <div class="group relative">
            
            <div
              class="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
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
                  stroke-width="1.5"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span class="font-medium">{{ groupes.length }}</span>
              <span class="hidden sm:inline">groupes</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Carte principale -->
    <div class="max-w-4xl mx-auto">
      <!-- Prévisualisation PDF (cachée) -->
    <div id="emploi-du-temps-pdf" v-if="pdfData">
      <EmploiDuTempsPDF
        :cours-organises="pdfData.coursOrganises"
        :groupe-info="pdfData.groupeInfo"
        :date-debut="pdfData.dateDebut"
        :date-fin="pdfData.dateFin"
        :type-export="pdfData.typeExport"
      />
    </div>
      <div
        class="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-2xl"
      >
        <div
          class="bg-gradient-to-r from-indigo-50 to-white dark:from-gray-800 dark:to-gray-800 px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700"
        >

          <div class="flex items-center justify-between">
            <h2
              class="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2"
            >
              <span class="w-1 h-4 bg-indigo-500 rounded-full"></span>
              <svg
                class="w-4 h-4 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Nouvel export
            </h2>

            <div class="flex items-center gap-1">
              <div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <div
                class="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"
              ></div>
              <div
                class="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"
              ></div>
            </div>
          </div>
        </div>

        <div class="p-4 sm:p-6 lg:p-8">
          <div class="space-y-6 sm:space-y-7">
            <!-- Groupe -->
            <div class="transform transition-all hover:translate-x-1">
              <label
                class="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                <span class="flex items-center gap-1">
                  <svg
                    class="w-4 h-4 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  Groupe
                </span>
                <span class="text-gray-400 text-xs ml-5">(obligatoire)</span>
              </label>
              <Dropdown
                v-model="form.group_id"
                :options="groupes"
                optionLabel="nom"
                optionValue="id"
                placeholder="Rechercher un groupe..."
                class="w-full"
                :class="{
                  'p-invalid border-red-300': !form.group_id && submitted,
                }"
                :showClear="true"
                filter
                filterPlaceholder="Tapez le nom du groupe..."
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex items-center gap-3">
                    <div
                      class="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center"
                    >
                      <svg
                        class="w-3 h-3 text-indigo-600 dark:text-indigo-400"
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
                    <span class="font-medium">{{
                      getGroupeNom(slotProps.value)
                    }}</span>
                  </div>
                  <span v-else class="text-gray-400 flex items-center gap-2">
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    {{ slotProps.placeholder }}
                  </span>
                </template>

                <template #option="slotProps">
                  <div
                    class="flex items-center gap-3 px-3 py-2.5 hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer rounded-lg transition-colors"
                  >
                    <div>
                      <div
                        class="text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        {{ slotProps.option.nom }}
                      </div>
                      <div
                        v-if="slotProps.option.niveau"
                        class="text-xs text-gray-500 flex items-center gap-1"
                      >
                        <svg
                          class="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l14-4"
                          />
                        </svg>
                        {{ slotProps.option.niveau?.libelle || "" }}
                      </div>
                    </div>
                  </div>
                </template>
              </Dropdown>
            </div>

            <!-- Type d'export -->
            <div>
              <label
                class="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                <span class="flex items-center gap-1">
                  <svg
                    class="w-4 h-4 text-indigo-500"
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
                  Type d'export
                </span>
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  v-for="option in exportOptions"
                  :key="option.value"
                  @click="form.type_export = option.value"
                  :class="[
                    'relative p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105',
                    form.type_export === option.value
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800',
                  ]"
                >
                  <div class="flex items-start gap-3">
                    <div
                      :class="[
                        'p-2 rounded-lg',
                        form.type_export === option.value
                          ? 'bg-indigo-500'
                          : 'bg-gray-100 dark:bg-gray-700',
                      ]"
                    >
                      <svg
                        class="w-4 h-4"
                        :class="
                          form.type_export === option.value
                            ? 'text-white'
                            : 'text-gray-500'
                        "
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          :d="option.icon"
                        />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p
                        class="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {{ option.label }}
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ option.description }}
                      </p>
                    </div>
                    <input
                      type="radio"
                      :value="option.value"
                      v-model="form.type_export"
                      class="hidden"
                    />
                  </div>
                  <div
                    v-if="form.type_export === option.value"
                    class="absolute -top-2 -right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center"
                  >
                    <svg
                      class="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Période -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div class="space-y-2">
                <label
                  class="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  <span class="flex items-center gap-1">
                    <svg
                      class="w-4 h-4 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Date de début
                  </span>
                </label>
                <div class="relative">
                  <Calendar
                    v-model="form.date_debut"
                    :showIcon="true"
                    :showButtonBar="true"
                    placeholder="Choisir une date"
                    class="w-full"
                    dateFormat="yy/mm/dd"
                    :manualInput="false"
                    :class="{ 'p-invalid': !form.date_debut && submitted }"
                    inputClass="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label
                  class="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  <span class="flex items-center gap-1">
                    <svg
                      class="w-4 h-4 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Date de fin
                  </span>
                </label>
                <div class="relative">
                  <Calendar
                    v-model="form.date_fin"
                    :showIcon="true"
                    :showButtonBar="true"
                    placeholder="Choisir une date"
                    class="w-full"
                    dateFormat="yy/mm/dd"
                    :manualInput="false"
                    :minDate="form.date_debut"
                    inputClass="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <p class="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <svg
                    class="w-3 h-3"
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
                  Optionnel - laisser vide pour une journée
                </p>
              </div>
            </div>

            <!-- Affichage période -->
            <transition name="slide-fade">
              <div
                v-if="form.date_debut"
                class="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800"
              >
                <div class="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <svg
                    class="w-5 h-5 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div class="flex-1">
                  <p
                    class="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Période sélectionnée
                  </p>
                  <p class="text-sm text-indigo-600 dark:text-indigo-400">
                    du {{ formatDate(form.date_debut) }}
                    <span v-if="form.date_fin">
                      au {{ formatDate(form.date_fin) }}</span
                    >
                    <span v-else class="text-gray-400"> (journée unique)</span>
                  </p>
                </div>
                <button
                  @click="clearDates"
                  class="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all group"
                  title="Effacer les dates"
                >
                  <svg
                    class="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors"
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
            </transition>
          </div>

          <!-- Messages d'erreur -->
          <transition name="fade">
            <div
              v-if="submitted && !form.group_id"
              class="mt-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div
                class="flex items-center gap-2 text-xs text-red-600 dark:text-red-400"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="font-medium">Veuillez sélectionner un groupe</span>
              </div>
            </div>
            <div
              v-else-if="submitted && !form.date_debut"
              class="mt-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div
                class="flex items-center gap-2 text-xs text-red-600 dark:text-red-400"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="font-medium"
                  >Veuillez sélectionner une date de début</span
                >
              </div>
            </div>
          </transition>

          <!-- Boutons d'action -->
          <div class="mt-8 flex flex-col sm:flex-row justify-end gap-3">
            <button
              @click="resetForm"
              class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
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
                  stroke-width="1.5"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Réinitialiser
            </button>

            <!-- Bouton Excel -->
            <button
              @click="exporterEmploiDuTemps"
              :disabled="
                !form.group_id ||
                !form.date_debut ||
                !form.type_export ||
                calendarStore.isLoading
              "
              class="relative group px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 min-w-[220px] transform hover:scale-105 active:scale-95"
            >
              <div
                v-if="calendarStore.isLoading"
                class="flex items-center gap-2"
              >
                <svg
                  class="w-5 h-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    class="opacity-20"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    class="opacity-80"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Export en cours...</span>
              </div>
              <div v-else class="flex items-center gap-3">
                <svg
                  class="w-5 h-5 transition-transform group-hover:rotate-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span class="font-medium">Excel</span>
              </div>
            </button>

            <!-- Bouton PDF -->
            <button
              @click="exporterEnPDF"
              :disabled="
                !form.group_id ||
                !form.date_debut ||
                !form.type_export ||
                calendarStore.isLoading
              "
              class="relative group px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 min-w-[220px] transform hover:scale-105 active:scale-95"
            >
              <div
                v-if="calendarStore.isLoading"
                class="flex items-center gap-2"
              >
                <svg
                  class="w-5 h-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    class="opacity-20"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    class="opacity-80"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Génération PDF...</span>
              </div>
              <div v-else class="flex items-center gap-3">
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
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span class="font-medium">PDF</span>
              </div>
            </button>
          </div>

          <!-- Barre de progression -->
          <div v-if="calendarStore.isLoading" class="mt-4">
            <div
              class="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"
                style="width: 60%"
              ></div>
            </div>
            <p class="text-xs text-gray-400 text-center mt-2">
              Préparation du fichier...
            </p>
          </div>
        </div>
      </div>

      <!-- Pied de page -->
    </div>

    
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, watch, nextTick } from "vue";
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";
import { useCalendarStore } from "~~/stores/calendar";
import { useGroupeStore } from "~~/stores/group";
import EmploiDuTempsPDF from "~/components/EmploiDuTempsPDF.vue";
import html2pdf from "html2pdf.js";

const { $toastr } = useNuxtApp();

const calendarStore = useCalendarStore();
const groupStore = useGroupeStore();
const groupes = ref([]);
const submitted = ref(false);
const pdfData = ref(null);
const showPDFPreview = ref(false);

// Options d'export
const exportOptions = [
  {
    value: "tous",
    label: "Tous",
    description: "Cours + Évaluations",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    value: "cours",
    label: "Cours",
    description: "Séances de cours",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    value: "evaluations",
    label: "Évaluations",
    description: "Examens et tests",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  },
];

const form = reactive({
  group_id: "",
  type_export: "tous",
  date_debut: null,
  date_fin: null,
});

// Formater la date pour l'affichage
const formatDate = (date) => {
  if (!date) return "";
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Formater les dates pour l'API (YYYY-MM-DD)
const formatDateForAPI = (date) => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Charger les groupes
const chargerGroupes = async () => {
  try {
    await groupStore.fetchGroupes();
    groupes.value = groupStore.groupes;
  } catch (error) {
    console.error("Erreur chargement groupes:", error);
  }
};

// Obtenir le nom du groupe
const getGroupeNom = (id) => {
  const groupe = groupes.value.find((g) => g.id === id);
  return groupe ? groupe.nom : "";
};

// Effacer les dates
const clearDates = () => {
  form.date_debut = null;
  form.date_fin = null;
};

// Réinitialiser le formulaire
const resetForm = () => {
  form.group_id = "";
  form.type_export = "tous";
  form.date_debut = null;
  form.date_fin = null;
  submitted.value = false;
};

// Exporter en Excel
const exporterEmploiDuTemps = async () => {
  submitted.value = true;

  if (!form.group_id) {
    $toastr?.warning("Veuillez sélectionner un groupe");
    return;
  }

  if (!form.date_debut) {
    $toastr?.warning("Veuillez sélectionner une date de début");
    return;
  }

  try {
    const params = {
      group_id: form.group_id,
      type_export: form.type_export,
      date_debut: formatDateForAPI(form.date_debut),
    };

    if (form.date_fin) {
      params.date_fin = formatDateForAPI(form.date_fin);
    }

    const response = await calendarStore.exportCalendar(params);

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    const contentDisposition = response.headers["content-disposition"];
    let filename = "emploi_du_temps.xlsx";

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) filename = match[1];
    }

    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    $toastr?.success("Export Excel terminé avec succès");
    submitted.value = false;
  } catch (error) {
    console.error("Erreur export:", error);
    $toastr?.error("Erreur lors de l'export Excel");
  }
};

// Exporter en PDF
const exporterEnPDF = async () => {
  submitted.value = true;

  if (!form.group_id) {
    $toastr?.warning("Veuillez sélectionner un groupe");
    return;
  }

  if (!form.date_debut) {
    $toastr?.warning("Veuillez sélectionner une date de début");
    return;
  }

  try {
    calendarStore.isLoading = true;

    // Récupérer les données de l'emploi du temps
    const params = {
      group_id: form.group_id,
      type_export: form.type_export,
      date_debut: formatDateForAPI(form.date_debut),
    };

    if (form.date_fin) {
      params.date_fin = formatDateForAPI(form.date_fin);
    }

    // Appel API pour récupérer les données
    const response = await calendarStore.getEmploiDuTempsData(params);

    // Stocker les données pour le PDF
    pdfData.value = {
      coursOrganises: response.data.cours,
      groupeInfo: response.data.groupe,
      dateDebut: form.date_debut,
      dateFin: form.date_fin,
      typeExport: form.type_export,
    };

    // Afficher la prévisualisation
    showPDFPreview.value = true;

    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Générer le PDF
    const element = document.querySelector("#emploi-du-temps-pdf");
    if (!element) {
      throw new Error("Élément PDF non trouvé");
    }

    // Options de configuration
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `emploi_du_temps_${formatDateForAPI(form.date_debut)}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 3,
        letterRendering: true,
        useCORS: true,
        allowTaint: true,
        logging: false,
        dpi: 192,
        windowWidth: 1200,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "landscape",
      },
      pagebreak: { mode: ["css", "legacy"] },
    };

    // Générer et télécharger le PDF
    await html2pdf().set(opt).from(element).save();

    // Nettoyer
    showPDFPreview.value = false;
    calendarStore.isLoading = false;
    $toastr?.success("Export PDF terminé avec succès");
    submitted.value = false;
  } catch (error) {
    console.error("Erreur génération PDF:", error);
    $toastr?.error("Erreur lors de la génération du PDF");
    calendarStore.isLoading = false;
    showPDFPreview.value = false;
  }
};

watch(
  () => form.group_id,
  () => {
    if (form.group_id) submitted.value = false;
  },
);

watch(
  () => form.date_debut,
  () => {
    if (form.date_debut) submitted.value = false;
  },
);

onMounted(() => {
  chargerGroupes();
});
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
