<template>
  <!-- LOADING GLOBAL PREMIUM -->
  <Transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isPageLoading"
      class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
    >
      <div class="relative flex items-center justify-center">
        <!-- Cercles pulsants -->
        <div class="absolute w-32 h-32 bg-indigo-500/20 rounded-full animate-ping"></div>
        <div class="absolute w-24 h-24 bg-indigo-600/30 rounded-full animate-pulse delay-75"></div>
        
        <!-- Icône centrale -->
        <div class="relative w-16 h-16 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-500">
          <svg class="w-8 h-8 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      
      <!-- Texte de chargement -->
      <div class="mt-12 text-center">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          Préparation de l'emploi du temps
        </h2>
        <p class="text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center gap-1">
          Synchronisation de vos cours
          <span class="flex gap-1 ml-1">
            <span class="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span class="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span class="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></span>
          </span>
        </p>
      </div>
    </div>
  </Transition>
  <div
    class="min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
  >
    <div class="max-w-7xl mx-auto">
      <!-- En-tête amélioré -->
      <div
        class="flex flex-col md:flex-row md:items-center justify-between mb-8"
      >
        <div>
          <h1
            class="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2"
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Emploi du temps - {{ salleStore.salle?.nom || "Salle" }}
          </h1>
          <p class="text-gray-600 dark:text-gray-300">
            Programme des cours et évaluations pour cette salle
          </p>
        </div>

        <!-- Boutons d'action -->
        <div class="flex items-center space-x-4 mt-4 md:mt-0">
          <button
            @click="() => { resetForm(); openCreateModal(); }"
            class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nouveau cours
          </button>

          <!-- Indicateur de chargement -->
          <div v-if="salleStore.isLoading" class="flex items-center space-x-2">
            <div
              class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"
            ></div>
            <span class="text-gray-600 dark:text-gray-300">Chargement...</span>
          </div>
        </div>
      </div>

      <!-- Carte d'information de la salle (physique ou virtuelle) -->
      <div v-if="salleStore.salle" class="mb-6">
        <!-- Bandeau principal -->
        <div
          class="rounded-xl overflow-hidden border"
          :class="
            salleStore.salle.est_virtuelle
              ? 'border-purple-200 dark:border-purple-800'
              : 'border-green-200 dark:border-green-800'
          "
        >
          <!-- En-tête avec couleur selon le type -->
          <div
            class="px-6 py-4 flex items-center gap-3"
            :class="
              salleStore.salle.est_virtuelle
                ? 'bg-purple-50 dark:bg-purple-900/20'
                : 'bg-green-50 dark:bg-green-900/20'
            "
          >
            <!-- Icône -->
            <div
              class="p-2 rounded-lg"
              :class="
                salleStore.salle.est_virtuelle
                  ? 'bg-purple-100 dark:bg-purple-800'
                  : 'bg-green-100 dark:bg-green-800'
              "
            >
              <svg
                v-if="salleStore.salle.est_virtuelle"
                class="w-6 h-6 text-purple-600 dark:text-purple-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <svg
                v-else
                class="w-6 h-6 text-green-600 dark:text-green-300"
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

            <!-- Titre et type -->
            <div class="flex-1">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ salleStore.salle.nom }}
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{
                  salleStore.salle.est_virtuelle
                    ? "Salle virtuelle · Cours en ligne"
                    : "Salle physique"
                }}
              </p>
            </div>

            <!-- Badge capacité -->
            <div class="text-right">
              <span class="text-sm text-gray-500 dark:text-gray-400"
                >Capacité</span
              >
              <p class="text-lg font-bold text-gray-900 dark:text-white">
                {{
                  salleStore.salle.effectif ||
                  (salleStore.salle.est_virtuelle ? "∞" : "—")
                }}
                <span class="text-sm font-normal text-gray-500">personnes</span>
              </p>
            </div>
          </div>

          <!-- Informations spécifiques pour les salles virtuelles -->
          <div
            v-if="salleStore.salle.est_virtuelle"
            class="px-6 py-4 bg-white dark:bg-gray-800 border-t border-purple-200 dark:border-purple-800"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Plateforme -->
              <div class="flex items-center gap-3">
                <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
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
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Plateforme
                  </p>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ getPlateformeLabel(salleStore.salle.plateforme) }}
                  </p>
                </div>
              </div>

              <!-- Lien permanent -->
              <div
                class="flex items-center gap-3 md:col-span-2"
                v-if="salleStore.salle.lien_reunion_formate"
              >
                <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
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
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Lien de réunion permanent
                  </p>
                  <div class="flex items-center gap-2 mt-1">
                    <a
                      :href="salleStore.salle.lien_reunion_formate"
                      target="_blank"
                      class="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium truncate max-w-md"
                    >
                      {{ salleStore.salle.lien_reunion_formate }}
                    </a>
                    <button
                      @click="copyLienReunion"
                      class="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Copier le lien"
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
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Instructions (si présentes) -->
              <div
                v-if="salleStore.salle.instructions"
                class="md:col-span-2 mt-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
              >
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Instructions :</span>
                  {{ salleStore.salle.instructions }}
                </p>
              </div>
            </div>
          </div>

          <!-- Informations pour les salles physiques -->
          <div
            v-else
            class="px-6 py-4 bg-white dark:bg-gray-800 border-t border-green-200 dark:border-green-800"
          >
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <svg
                  class="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span class="text-gray-700 dark:text-gray-300"
                  >Salle physique</span
                >
              </div>
              <div class="flex items-center gap-2">
                <svg
                  class="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span class="text-gray-700 dark:text-gray-300"
                  >Capacité:
                  {{
                    salleStore.salle.effectif || "Non définie"
                  }}
                  personnes</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Calendrier -->
      <ClientOnly>
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-8"
        >
          <FullCalendar
            v-if="showCalendar"
            ref="calendarRef"
            :options="calendarOptions"
          />
        </div>
      </ClientOnly>

      <!-- Vue liste pour mobile -->
      <div
        class="md:hidden bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
            Événements à venir
          </h2>
        </div>
        <div v-if="salleStore.isLoading" class="p-8 text-center">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"
          ></div>
        </div>
        <div v-else-if="filteredEvents.length === 0" class="p-8 text-center">
          <p class="text-gray-500 dark:text-gray-400">
            Aucun événement programmé
          </p>
        </div>
        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
      <div
  v-for="event in filteredEvents"
  :key="event.id"
  class="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
  @click="openEventModal(event)"
>
  <div class="flex items-start justify-between">
    <!-- Colonne de gauche : Infos de l'événement -->
    <div class="flex-1 pr-4">
      <h3 class="font-medium text-gray-900 dark:text-white">
        {{ event.title }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {{ formatEventTime(event.start, event.end) }}
      </p>
      <div class="flex items-center gap-2 mt-2">
        <span
          class="text-xs px-2 py-1 rounded-full"
          :class="getEventTypeClass(event.extendedProps.type)"
        >
          {{ event.extendedProps.type }}
        </span>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ event.extendedProps.group }}
        </span>
      </div>

      <!--  Lien de réunion pour mobile (À AJOUTER ICI) -->
      <div v-if="event.extendedProps.lien_reunion" class="mt-3">
        <a
          :href="event.extendedProps.lien_reunion"
          target="_blank"
          class="inline-flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-lg"
          @click.stop
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Rejoindre le cours en ligne</span>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      <div v-else-if="event.extendedProps.est_virtuelle" class="mt-2">
        <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Cours en ligne
        </span>
      </div>
    </div>

    <!-- Colonne de droite : Boutons d'action -->
    <div class="flex gap-2">
      <button
        @click.stop="openEditModal(event)"
        class="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
        title="Modifier"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button
        @click.stop="confirmDelete(event)"
        class="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
        title="Supprimer"
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
    </div>

    <!-- Modal de création/édition -->
    <TransitionRoot appear :show="showFormModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeFormModal">
        <div class="fixed inset-0 bg-black/60" />

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
            >
              <!-- En-tête -->
              <div class="flex items-center justify-between mb-6">
                <DialogTitle
                  class="text-xl font-bold text-gray-900 dark:text-white"
                >
                  {{ isEditing ? "Modifier le cours" : "Nouveau cours" }}
                </DialogTitle>
                <button
                  @click="closeFormModal"
                  class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
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

              <!-- Formulaire -->
              <form @submit.prevent="submitForm">
                <div class="space-y-4">
                  <!-- Date et heure -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label for="">Date début</label>
                      <FloatLabel variant="on">
                        <DatePicker
                          v-model="form.date"
                          dateFormat="yy-mm-dd"
                          showIcon
                          fluid
                          iconDisplay="input"
                          :disabledDates="disabledDates"
                        />
                        <label for="on_label">Date</label>
                      </FloatLabel>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Heure début
                        </label>
                        <input
                          type="time"
                          v-model="form.debut"
                          required
                          class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Heure fin
                        </label>
                        <input
                          type="time"
                          v-model="form.fin"
                          required
                          class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Bouton vérification -->
                  <button
                    type="button"
                    @click="checkAvailability"
                    :disabled="!canCheckAvailability"
                    class="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    :class="{
                      'opacity-50 cursor-not-allowed': !canCheckAvailability,
                    }"
                  >
                    Vérifier disponibilité
                  </button>

                  <!-- UV -->
                  <div>
                    <FloatLabel variant="on">
                      <Dropdown
                        id="uv_s_id"
                        v-model="form.uv_id"
                        :options="MatieresOptions"
                        optionLabel="label"
                        optionValue="value"
                        filter
                        showClear
                        placeholder=""
                        class="w-full"
                      />
                      <label for="uv_s_id">Sélectionner une matière</label>
                    </FloatLabel>
                  </div>

                  <!-- Groupe -->
                  <div>
                    <FloatLabel variant="on">
                      <Dropdown
                        id="grade_s_id"
                        v-model="form.grade"
                        :options="GroupesOptions"
                        optionLabel="label"
                        optionValue="value"
                        filter
                        showClear
                        placeholder=""
                        class="w-full"
                      />
                      <label for="grade_s_id">Sélectionnez un groupe</label>
                    </FloatLabel>
                  </div>

                  <!-- Enseignant -->
                  <div>
                    <FloatLabel variant="on">
                      <Dropdown
                        id="teacher_s_id"
                        v-model="form.teacher"
                        :options="EnseignantsOptions"
                        optionLabel="label"
                        optionValue="value"
                        filter
                        showClear
                        :disabled="!form.uv_id"
                        placeholder=""
                        class="w-full"
                      />
                      <label for="teacher_s_id">Sélectionnez un enseignant</label>
                    </FloatLabel>
                  </div>

                  <!-- Type -->
                  <div>
                    <FloatLabel variant="on">
                      <Dropdown
                        id="type_s_id"
                        v-model="form.type"
                        :options="TypeOptions"
                        optionLabel="label"
                        optionValue="value"
                        filter
                        showClear
                        placeholder=""
                        class="w-full"
                      />
                      <label for="type_s_id"
                        >Sélectionnez un type de programme</label
                      >
                    </FloatLabel>
                  </div>

                  <!-- Récurrence -->
                  <div
                    class="border-t border-gray-200 dark:border-gray-700 pt-4"
                  >
                    <div class="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        id="enableRecurrence"
                        v-model="enableRecurrence"
                        class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        for="enableRecurrence"
                        class="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Activer la récurrence
                      </label>
                    </div>

                    <div v-if="enableRecurrence" class="space-y-4 pl-6">
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Type de récurrence
                        </label>
                        <select
                          v-model="form.recurrence_type"
                          class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="aucune">Aucune</option>
                          <option value="quotidienne">Quotidienne</option>
                          <option value="hebdomadaire">Hebdomadaire</option>
                        </select>
                      </div>

                      <div v-if="form.recurrence_type === 'hebdomadaire'">
                        <label
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Jours de la semaine
                        </label>
                        <div class="grid grid-cols-4 gap-2">
                          <label
                            v-for="day in daysOfWeek"
                            :key="day.value"
                            :for="'day-' + day.value"
                            class="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              :id="'day-' + day.value"
                              :value="day.value"
                              v-model="form.recurrence_days"
                              class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <span
                              class="text-sm text-gray-700 dark:text-gray-300"
                              >{{ day.label }}</span
                            >
                          </label>
                        </div>
                      </div>

                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Date de fin (optionnel)
                        </label>
                        <DatePicker
                          v-model="form.recurrence_end_date"
                          dateFormat="yy-mm-dd"
                          showIcon
                          fluid
                          iconDisplay="input"
                          :minDate="form.date ? new Date(form.date) : null"
                          :disabledDates="disabledDates"
                          placeholder="Date de fin"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Détails -->
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Détails (optionnel)
                    </label>
                    <textarea
                      v-model="form.details"
                      rows="3"
                      class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Notes ou informations supplémentaires..."
                    ></textarea>
                  </div>
                </div>

                <!-- Boutons d'action -->
                <div class="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    @click="closeFormModal"
                    class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    :disabled="formLoading"
                    class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    :class="{ 'opacity-50 cursor-not-allowed': formLoading }"
                  >
                    <svg
                      v-if="formLoading"
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
                    {{ isEditing ? "Modifier" : "Créer" }}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal de détails d'événement -->
    <TransitionRoot appear :show="showEventModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeEventModal">
        <div class="fixed inset-0 bg-black/60" />
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
            >
              <!-- En-tête avec icône -->
              <div class="flex items-center justify-between mb-6">
                <DialogTitle
                  class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
                >
                  <svg
                    v-if="selectedEvent?.extendedProps?.type === 'Évaluation'"
                    class="w-6 h-6 text-orange-500"
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
                  <svg
                    v-else-if="selectedEvent?.extendedProps?.type === 'Jour Férié'"
                    class="w-6 h-6 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-7h.01" />
                  </svg>
                  <svg
                    v-else
                    class="w-6 h-6 text-blue-500"
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
                  {{ selectedEvent?.title || "Détails de l'événement" }}
                </DialogTitle>

                <!-- Badge type -->
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    selectedEvent?.extendedProps?.type === 'Évaluation'
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                      : selectedEvent?.extendedProps?.type === 'Jour Férié'
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
                  ]"
                >
                  {{ selectedEvent?.extendedProps?.type }}
                </span>
              </div>

              <!-- Contenu de la modale -->
              <div
                v-if="selectedEvent?.extendedProps?.type === 'Jour Férié'"
                class="py-6 flex flex-col items-center text-center"
              >
                <div
                  class="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 shadow-inner"
                >
                  <svg
                    class="w-10 h-10 text-indigo-600 dark:text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-7h.01"
                    />
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-tight">
                  {{ selectedEvent?.title.replace("🚩 ", "") }}
                </h3>
                <div
                  class="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-bold mb-4 border border-indigo-100 dark:border-indigo-800"
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
                  {{
                    selectedEvent?.start ? format(new Date(selectedEvent.start), "eeee d MMMM yyyy", {
                      locale: fr,
                    }) : ''
                  }}
                </div>
                <p
                  v-if="selectedEvent?.extendedProps?.details"
                  class="text-gray-600 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 max-w-sm"
                >
                  "{{ selectedEvent?.extendedProps?.details }}"
                </p>
                <div
                  class="mt-8 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-xl w-full"
                >
                  <p
                    class="text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2 justify-center font-medium"
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
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Aucun cours ou évaluation n'est prévu ce jour (Férié).
                  </p>
                </div>
              </div>

              <div v-else class="space-y-4">
                <!-- UV -->
                <div class="flex items-start">
                  <div class="w-8 flex-shrink-0">
                    <svg
                      class="w-5 h-5 text-gray-500 dark:text-gray-400"
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
                  <div class="flex-1">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Matière
                    </p>
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{ selectedEvent?.extendedProps?.uv || "Non spécifié" }}
                    </p>
                  </div>
                </div>

                <!-- Date et heure -->
                <div class="flex items-start">
                  <div class="w-8 flex-shrink-0">
                    <svg
                      class="w-5 h-5 text-gray-500 dark:text-gray-400"
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
                  <div class="flex-1">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Date et heure
                    </p>
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{
                        selectedEvent
                          ? formatEventTime(
                              selectedEvent.start,
                              selectedEvent.end,
                            )
                          : "Non spécifié"
                      }}
                    </p>
                  </div>
                </div>

                <!-- Salle -->
                <!-- Salle avec lien de réunion si virtuelle -->
                <div class="flex items-start">
                  <div class="w-8 flex-shrink-0">
                    <svg
                      class="w-5 h-5 text-gray-500 dark:text-gray-400"
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
                  <div class="flex-1">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Salle
                    </p>
                    <div class="flex flex-col gap-2">
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{
                          selectedEvent?.extendedProps?.salle || "Non spécifié"
                        }}
                      </p>

                      <!-- Lien de réunion pour les salles virtuelles -->
                      <div
                        v-if="selectedEvent?.extendedProps?.lien_reunion"
                        class="mt-1"
                      >
                        <a
                          :href="selectedEvent.extendedProps.lien_reunion"
                          target="_blank"
                          class="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-800/40 transition-colors"
                          @click.stop
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
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          <span>Rejoindre le cours en ligne</span>
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
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      </div>

                      <!-- Badge virtuelle si pas de lien -->
                      <div
                        v-else-if="selectedEvent?.extendedProps?.est_virtuelle"
                        class="mt-1"
                      >
                        <span
                          class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
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
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Cours en ligne
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Enseignant -->
                <div class="flex items-start">
                  <div class="w-8 flex-shrink-0">
                    <svg
                      class="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Enseignant
                    </p>
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{
                        selectedEvent?.extendedProps?.teacher || "Non spécifié"
                      }}
                    </p>
                  </div>
                </div>

                <!-- Groupe -->
                <div class="flex items-start">
                  <div class="w-8 flex-shrink-0">
                    <svg
                      class="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Groupe 
                    </p>
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{
                        selectedEvent?.extendedProps?.group || "Non spécifié"
                      }}
                    </p>
                  </div>
                </div>

                

                <!-- Récurrence -->
                <div
                  v-if="
                    selectedEvent?.extendedProps?.recurrence_type &&
                    selectedEvent?.extendedProps?.recurrence_type !== 'aucune'
                  "
                  class="flex items-start"
                >
                  <div class="w-8 flex-shrink-0">
                    <svg
                      class="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Récurrence
                    </p>
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{ getRecurrenceText(selectedEvent?.extendedProps) }}
                    </p>
                  </div>
                </div>

                <!-- Détails supplémentaires -->
                <div
                  v-if="selectedEvent?.extendedProps?.details"
                  class="flex items-start"
                >
                  <div class="w-8 flex-shrink-0">
                    <svg
                      class="w-5 h-5 text-gray-500 dark:text-gray-400"
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
                  <div class="flex-1">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Description
                    </p>
                    <p class="text-gray-700 dark:text-gray-300">
                      {{ selectedEvent?.extendedProps?.details }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Boutons d'action -->
              <div class="mt-8 flex justify-end gap-3">
                <template v-if="selectedEvent?.extendedProps?.type !== 'Jour Férié'">
                <button
                  type="button"
                  @click="openEditModalFromDetail(selectedEvent)"
                  class="px-4 py-2 rounded-lg border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors flex items-center gap-2"
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
                <button
                  type="button"
                  @click="confirmDelete(selectedEvent)"
                  class="px-4 py-2 rounded-lg border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Supprimer
                </button>
                </template>
                <button
                  type="button"
                  @click="closeEventModal"
                  class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import type { CalendarOptions } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/vue3";
import { RRule } from "rrule";
import { format, parse, isSameDay, isBefore, addDays } from "date-fns";
import { fr } from "date-fns/locale";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
} from "@headlessui/vue";

import { useCalendarStore } from "~~/stores/calendar";
import { useSalleStore } from "~~/stores/salle";
import { useUserStore } from "~~/stores/user";
import { useUvStore } from "~~/stores/unite-valeur";
import { useGroupeStore } from "~~/stores/group";
import { useUeStore } from "~~/stores/unite-enseignement";

const route = useRoute();
const salleStore = useSalleStore();
const calendarStore = useCalendarStore();
const UeStore = useUeStore();
const userStore = useUserStore();
const UvStore = useUvStore();
const groupStore = useGroupeStore();

const { $toastr, $swal } = useNuxtApp();

// Références
const calendarRef = ref();
const showCalendar = ref(false);
const showFormModal = ref(false);
const showEventModal = ref(false);
const isEditing = ref(false);
const enableRecurrence = ref(false);
const formLoading = ref(false);
const availabilityChecked = ref(false);
const deleteValue = ref();
const isPageLoading = ref(true);

// Jours fériés désactivés pour le DatePicker
const disabledDates = computed(() => {
  if (!calendarStore.holidays) return [];
  // Créer des objets Date à minuit local pour le DatePicker
  return calendarStore.holidays.map(h => {
    const d = new Date(h.date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  });
});

// Données
const selectedEvent = ref<any>(null);
const slug = computed(() => route.params.slug as string);

// Jours de la semaine avec traduction
const daysOfWeek = [
  { value: "MO", label: "Lundi" },
  { value: "TU", label: "Mardi" },
  { value: "WE", label: "Mercredi" },
  { value: "TH", label: "Jeudi" },
  { value: "FR", label: "Vendredi" },
  { value: "SA", label: "Samedi" },
  { value: "SU", label: "Dimanche" },
];

// Mappage des jours abrégés aux jours complets
const dayMapping: Record<string, string> = {
  MO: "Lundi",
  TU: "Mardi",
  WE: "Mercredi",
  TH: "Jeudi",
  FR: "Vendredi",
  SA: "Samedi",
  SU: "Dimanche",
};

// Formulaire
const form = ref({
  id: "",
  date: "",
  debut: "",
  fin: "",
  uv_id: "",
  type: "",
  grade: "",
  teacher: "",
  details: "",
  recurrence_type: "aucune",
  recurrence_days: [] as string[],
  recurrence_end_date: "",
});

// Date d'aujourd'hui
const today = computed(() => {
  return new Date().toISOString().split("T")[0];
});

// Peut vérifier la disponibilité
const canCheckAvailability = computed(() => {
  return form.value.date && form.value.debut && form.value.fin;
});

// CORRECTION : S'assurer que programmes est un tableau
const programmesArray = computed(() => {
  if (Array.isArray(salleStore.programmes)) {
    return salleStore.programmes;
  }

  if (salleStore.programmes && typeof salleStore.programmes === "object") {
    const possibleArrayKeys = [
      "data",
      "programmes",
      "emplois",
      "events",
      "items",
    ];

    for (const key of possibleArrayKeys) {
      if (Array.isArray(salleStore.programmes[key])) {
        return salleStore.programmes[key];
      }
    }

    for (const key in salleStore.programmes) {
      if (Array.isArray(salleStore.programmes[key])) {
        return salleStore.programmes[key];
      }
    }
  }

  return [];
});

/**
 * Parse une date au format "YYYY-MM-DD HH:mm"
 */
// const parseDateTime = (dateTimeStr: string): Date => {
//   if (!dateTimeStr) return new Date();

//   try {
//     if (dateTimeStr.includes(" ")) {
//       return parse(dateTimeStr, "yyyy-MM-dd HH:mm", new Date());
//     }
//     return parse(dateTimeStr + " 00:00", "yyyy-MM-dd HH:mm", new Date());
//   } catch (error) {
//     console.error("Erreur parsing date:", dateTimeStr, error);
//     return new Date();
//   }
// };
const parseDateTime = (dateTimeStr: string): Date => {
  if (!dateTimeStr) return new Date();

  try {
    // Normaliser le format pour le constructeur Date (remplacer espace par T)
    const normalized = dateTimeStr.replace(" ", "T");
    const d = new Date(normalized);
    
    if (!isNaN(d.getTime())) {
      return d;
    }

    // Fallback manuel si nécessaire
    if (dateTimeStr.includes(" ")) {
      const [datePart, timePart] = dateTimeStr.split(" ");
      const [year, month, day] = datePart.split("-").map(Number);
      const [hour, minute] = timePart.split(":").map(Number);
      return new Date(year, month - 1, day, hour, minute);
    }

    return new Date();
  } catch (error) {
    console.error("Erreur parsing date:", dateTimeStr, error);
    return new Date();
  }
};

/**
 * Convertit les jours de récurrence en format RRule
 */
const convertRecurrenceDays = (daysString: string | string[] | null): number[] => {
  if (!daysString) return [];

  const dayMap: { [key: string]: number } = {
    mo: RRule.MO, // Lundi
    tu: RRule.TU, // Mardi
    we: RRule.WE, // Mercredi
    th: RRule.TH, // Jeudi
    fr: RRule.FR, // Vendredi
    sa: RRule.SA, // Samedi
    su: RRule.SU, // Dimanche
    lundi: RRule.MO,
    mardi: RRule.TU,
    mercredi: RRule.WE,
    jeudi: RRule.TH,
    vendredi: RRule.FR,
    samedi: RRule.SA,
    dimanche: RRule.SU,
  };

  let daysArray: string[] = [];
  if (Array.isArray(daysString)) {
    daysArray = daysString;
  } else {
    daysArray = daysString.split(",");
  }

  return daysArray
    .map((day) => {
      const dayLower = day.trim().toLowerCase();
      if (dayLower.length === 2) {
        const dayCode = dayLower.toUpperCase();
        if (dayCode === "MO") return RRule.MO;
        if (dayCode === "TU") return RRule.TU;
        if (dayCode === "WE") return RRule.WE;
        if (dayCode === "TH") return RRule.TH;
        if (dayCode === "FR") return RRule.FR;
        if (dayCode === "SA") return RRule.SA;
        if (dayCode === "SU") return RRule.SU;
      }
      return dayMap[dayLower];
    })
    .filter((day) => day !== undefined);
};

/**
 * Vérifie si la récurrence doit utiliser la date_fin comme date de fin
 */
const shouldUseDateFin = (event: any): boolean => {
  // Utiliser date_fin si recurrence_end_date n'est pas défini
  return (
    event.date_fin &&
    (!event.recurrence_end_date || event.recurrence_end_date === "") &&
    event.recurrence_type &&
    event.recurrence_type !== "aucune"
  );
};



/**
 * Génère les dates récurrentes pour un événement avec date de fin correcte
 */
const generateRecurringEvents = (
  event: any,
  startDate: Date,
  endDate: Date,
  holidayDates: Set<string> = new Set()
): any[] => {
  if (!event.recurrence_type || event.recurrence_type === "aucune") {
    return [
      {
        ...event,
        start: startDate,
        end: endDate,
        isRecurring: false,
        isInitialEvent: true,
      },
    ];
  }

  const events = [];
  const duration = endDate.getTime() - startDate.getTime();

  // 1. AJOUTER L'ÉVÉNEMENT INITIAL TOUJOURS
  events.push({
    ...event,
    start: startDate,
    end: endDate,
    originalSlug: event.slug,
    slug: `${event.slug}`,
    isRecurring: false,
    isInitialEvent: true,
  });

  console.log("Génération récurrence pour:", {
    titre: event.title,
    date_debut: format(startDate, "dd/MM/yyyy"),
    recurrence_type: event.recurrence_type,
    recurrence_days: event.recurrence_days,
    date_fin: event.date_fin,
    recurrence_end_date: event.recurrence_end_date,
  });

  // 2. GÉNÉRER LES RÉCURRENCES
  let recurrenceEndDate: Date | null = null;

  // PRIORITÉ 1: recurrence_end_date du formulaire
  if (event.recurrence_end_date && event.recurrence_end_date !== "") {
    try {
      recurrenceEndDate = parse(
        event.recurrence_end_date + " 23:59:59",
        "yyyy-MM-dd HH:mm:ss",
        new Date(),
      );
      console.log(
        "Utilisation recurrence_end_date:",
        format(recurrenceEndDate, "dd/MM/yyyy"),
      );
    } catch (error) {
      console.error("Erreur parsing recurrence_end_date:", error);
    }
  }

  // PRIORITÉ 2: date_fin de l'événement original
  if (!recurrenceEndDate && shouldUseDateFin(event)) {
    try {
      recurrenceEndDate = parse(
        event.date_fin + " 23:59:59",
        "yyyy-MM-dd HH:mm:ss",
        new Date(),
      );
      console.log(
        "Utilisation date_fin comme fin de récurrence:",
        format(recurrenceEndDate, "dd/MM/yyyy"),
      );
    } catch (error) {
      console.error("Erreur parsing date_fin:", error);
    }
  }

  const ruleOptions: any = {
    dtstart: startDate,
    freq: RRule.WEEKLY,
  };

  if (event.recurrence_days) {
    const byweekday = convertRecurrenceDays(event.recurrence_days);
    if (byweekday.length > 0) {
      ruleOptions.byweekday = byweekday;
    }
  }

  if (recurrenceEndDate) {
    ruleOptions.until = recurrenceEndDate;
    console.log(
      "Règle de récurrence avec until:",
      format(recurrenceEndDate, "dd/MM/yyyy"),
    );
  } else {
    // Si aucune date de fin n'est définie, limiter à 12 semaines (3 mois) au lieu de 52
    ruleOptions.count = 12;
    console.log("Règle de récurrence sans until, limitée à 12 occurrences");
  }

  try {
    const rule = new RRule(ruleOptions);
    const dates = rule.all();

    console.log("Dates générées par RRule:", dates.length, "occurrences");

    // Ajouter les récurrences en évitant les doublons avec la date initiale
    for (const date of dates) {
      const eventStart = new Date(date);

      // Vérifier si c'est le même jour que l'événement initial
      if (isSameDay(eventStart, startDate)) {
        continue;
      }

      // Vérifier si c'est un jour férié
      const occDateStr = format(eventStart, "yyyy-MM-dd");
      if (holidayDates.has(occDateStr)) continue;

      // Vérifier si la date générée est avant la date de fin
      if (recurrenceEndDate && eventStart > recurrenceEndDate) {
        continue;
      }

      const eventEnd = new Date(eventStart);
      eventEnd.setHours(endDate.getHours(), endDate.getMinutes(), endDate.getSeconds());

      events.push({
        ...event,
        start: eventStart,
        end: eventEnd,
        type: event.type || event.type_programme || "Cours",
        originalSlug: event.slug,
        slug: `${event.slug}`,
        isRecurring: true,
        recurrenceDate: eventStart,
        isInitialEvent: false,
      });
    }
  } catch (error) {
    console.error("Erreur lors de la génération des récurrences:", error);
    // On garde au moins l'événement initial
  }

  // Trier les événements par date
  events.sort((a, b) => a.start.getTime() - b.start.getTime());

  console.log("Événements générés au total:", events.length);
  if (events.length > 0) {
    console.log("Première occurrence:", format(events[0].start, "dd/MM/yyyy"));
    console.log(
      "Dernière occurrence:",
      format(events[events.length - 1].start, "dd/MM/yyyy"),
    );
  }

  return events;
};

/**
 *  Conversion des données du store vers le format FullCalendar
 */
const calendarEvents = computed(() => {
  const events: any[] = [];

  // Ajouter les jours fériés du store
  if (calendarStore.holidays && calendarStore.holidays.length > 0) {
    calendarStore.holidays.forEach((holiday: any) => {
      // Événement visible avec le titre
      events.push({
        id: `holiday-${holiday.id}`,
        title: `🚩 ${holiday.titre || holiday.nom}`,
        start: holiday.date,
        allDay: true,
        classNames: ["premium-holiday-pill"],
        extendedProps: {
          type: "Jour Férié",
          details: holiday.description,
          titre: holiday.titre,
          title: holiday.titre,
          start: holiday.date,
          isHoliday: true,
        },
      });
    });
  }

  console.log(
    "Début génération calendarEvents, nombre d'événements:",
    programmesArray.value.length,
  );

  const holidayDates = new Set(calendarStore.holidays.map((h: any) => h.date.split("T")[0]));

  programmesArray.value.forEach((event: any, index: number) => {
    try {
      const eventDate = event.debut.split(" ")[0];
      if (holidayDates.has(eventDate)) return;

      const startDate = parseDateTime(event.debut || event.date_debut);
      const endDate = parseDateTime(event.fin || event.date_fin);

      if (!startDate || !endDate) {
        console.warn("Dates manquantes pour:", event.title);
        return;
      }

      const recurringEvents = generateRecurringEvents(
        event,
        startDate,
        endDate,
        holidayDates
      );

      console.log(`  → ${recurringEvents.length} occurrence(s) générée(s)`);

      recurringEvents.forEach((evt: any) => {
        const backgroundColor = getEventColor(evt.type || evt.type_programme || "Cours");
        const uvName = evt.uv?.nom || evt.uv || "";
        const typeLabel = evt.type || evt.type_programme || "Cours";
        const title = uvName ? `${typeLabel}: ${uvName}` : typeLabel;

        events.push({
          id: evt.slug,
          title: title,
          start: evt.start,
          end: evt.end,
          allDay: false,
          backgroundColor: backgroundColor,
          borderColor: "transparent",
          classNames: [
            "calendar-event",
            evt.type === "Évaluation" ? "event-evaluation" : "event-cours",
            evt.isRecurring ? "event-recurring" : "event-initial",
          ],
          extendedProps: {
            ...evt,
            displayType: evt.type || "Cours",
            displayGroup: evt.grade?.nom || evt.group || "",
            displayTeacher: evt.teacher?.nom || evt.enseignant?.nom || evt.teacher || evt.enseignant || "",
            displayUv: uvName,
            uv: uvName,
            uv_id: evt.uv?.id || evt.uv_id || evt.matiere_id || evt.id_uv || evt.uv || "",
            uv_slug: evt.uv?.slug || evt.uv_slug || "",
            salle: evt.salle?.nom || evt.salle || "",
            salle_id: evt.salle?.id || evt.salle_id || evt.id_salle || evt.salle || "",
            teacher: evt.teacher?.nom || evt.enseignant?.nom || evt.teacher || evt.enseignant || "",
            lien_reunion: evt?.lien_reunion_formate || evt?.lien_reunion || null,
            est_virtuelle: evt.est_virtuelle || false,
            plateforme: evt.plateforme || null,
            teacher_id: evt.teacher?.id || evt.enseignant?.id || evt.teacher_id || evt.enseignant_id || evt.id_enseignant || evt.teacher || evt.enseignant || "",
            teacher_slug: evt.teacher?.slug || evt.teacher_slug || "",
            group: evt.group?.nom || evt.grade?.nom || evt.group || evt.grade || "",
            group_id: evt.group?.id || evt.grade?.id || evt.group_id || evt.grade_id || evt.id_groupe || evt.group || evt.grade || "",
            grade_id: evt.grade?.id || evt.group?.id || evt.grade_id || evt.group_id || evt.id_groupe || evt.grade || evt.group || "",
            grade_slug: evt.grade?.slug || evt.grade_slug || "",
            details: evt.details || "",
            type: evt.type || evt.type_programme || "Cours",
            slug: evt.slug || evt.id || "",
            recurrence_type: evt.recurrence_type || "aucune",
            recurrence_days: evt.recurrence_days || "",
            recurrence_end_date: evt.recurrence_end_date || evt.date_fin || "",
            isRecurring: evt.isRecurring || false,
            isInitialEvent: evt.isInitialEvent || false,
          },
        });
      });
    } catch (error) {
      console.error("Erreur lors du traitement de l'événement:", event, error);
    }
  });

  console.log(
    "Génération calendarEvents terminée, total:",
    events.length,
    "événements",
  );
  return events;
});

// Configuration FullCalendar
const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  locale: frLocale,
  initialView: "dayGridMonth",
  height: 800,
  contentHeight: 750,

  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
  },

  buttonText: {
    today: "Aujourd'hui",
    month: "Mois",
    week: "Semaine",
    day: "Jour",
    list: "Liste",
  },

  // Appliquer une classe à toute la cellule du jour pour les jours fériés
  dayCellClassNames: (arg: any) => {
    const dateStr = arg.date.toISOString().split('T')[0];
    const isHoliday = calendarStore.holidays.some((h: any) => h.date.split('T')[0] === dateStr);
    return isHoliday ? ['holiday-cell'] : [];
  },

  // Événements depuis la fonction générée
  events: (info, successCallback) => {
    const events = calendarEvents.value;
    successCallback(events);
  },

  // Gestion de l'affichage des événements
  eventContent: (arg: any) => {
    const type = arg.event.extendedProps?.type || "Cours";
    const title = arg.event.title || "";
    const viewType = arg.view.type;
    const isEval = type === "Évaluation";

    // Vue Liste
    if (viewType.startsWith("list")) {
      return {
        html: `
          <div style="display:flex;align-items:center;gap:6px;padding:2px 4px;">
            <span style="width:8px;height:8px;border-radius:50%;flex-shrink:0;background:${isEval ? '#f97316' : '#2563eb'}"></span>
            <span style="font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${title}</span>
            <span style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;background:${isEval ? 'rgba(249,115,22,0.15)' : 'rgba(37,99,235,0.15)'};color:${isEval ? '#c2410c' : '#1d4ed8'};padding:1px 5px;border-radius:3px;flex-shrink:0;">${type}</span>
          </div>
        `
      };
    }

    // Vue Mois — Design en "pilule" colorée
    if (viewType.startsWith("dayGrid")) {
      const isHoliday = type === "Jour Férié";
      const pillBg = isHoliday ? "#dc2626" : (isEval ? "#f97316" : "#3b82f6");

      return {
        html: `
          <div style="display:flex;align-items:center;padding:2px 8px;width:100%;background:${pillBg};border-radius:4px;overflow:hidden;margin:1px 0;">
            <span style="font-size:11px;font-weight:700;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;">${title}</span>
          </div>
        `
      };
    }

    // Jours fériés (vues TimeGrid)
    if (type === "Jour Férié") {
      return {
        html: `
          <div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;padding:4px;">
            <div style="display:flex;align-items:center;gap:6px;padding:4px 10px;background:linear-gradient(to right,#dc2626,#b91c1c);border-radius:20px;border:1px solid rgba(248,113,113,0.3);">
              <span style="font-size:8px;background:rgba(255,255,255,0.2);padding:1px 5px;border-radius:3px;font-weight:900;letter-spacing:0.1em;color:#fff;">FÉRIÉ</span>
              <span style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${title.replace("🚩 ", "")}</span>
            </div>
          </div>
        `,
      };
    }

    // Vue Semaine / Jour — design premium
    const gradient = isEval ? "linear-gradient(135deg,#f97316,#ea580c)" : "linear-gradient(135deg,#2563eb,#1d4ed8)";
    const accent = isEval ? "rgba(251,146,60,0.4)" : "rgba(96,165,250,0.4)";

    return {
      html: `
        <div style="display:flex;flex-direction:column;padding:6px 8px;width:100%;height:100%;min-height:100%;background:${gradient};border-radius:6px;border:1px solid ${accent};box-shadow:0 1px 3px rgba(0,0,0,0.2);overflow:hidden;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;padding-bottom:3px;border-bottom:1px solid rgba(255,255,255,0.2);">
            <span style="font-size:9px;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.9);">${arg.timeText || ""}</span>
            <span style="font-size:7px;font-weight:900;text-transform:uppercase;letter-spacing:0.12em;background:rgba(255,255,255,0.2);padding:1px 5px;border-radius:3px;color:#fff;">${type}</span>
          </div>
          <div style="font-size:11px;font-weight:700;color:#fff;line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;">${title}</div>
        </div>
      `,
    };
  },

  dateClick: (info: any) => {
    const holiday = (calendarStore.holidays || []).find((h: any) => h.date.split("T")[0] === info.dateStr);
    if (holiday) {
      const calendarApi = info.view.calendar;
      const holidayEvent = calendarApi.getEvents().find((e: any) => 
        e.extendedProps.type === 'Jour Férié' && e.startStr.split('T')[0] === info.dateStr
      );
      if (holidayEvent) {
        selectedEvent.value = holidayEvent;
        openEventModal(holidayEvent);
      }
      return;
    }
    resetForm();
    form.value.date = new Date(info.dateStr);
    openCreateModal();
  },
  eventClick: (info: any) => {
    selectedEvent.value = info.event;
    openEventModal(info.event);
  },
  eventAllow: (dropInfo: any) => {
    const holidayDates = new Set(calendarStore.holidays.map((h: any) => h.date.split("T")[0]));
    const dropDate = dropInfo.startStr.split("T")[0];
    return !holidayDates.has(dropDate);
  },

  eventDrop: async (info: any) => {
    try {
      const payload = {
        slug: info.event.extendedProps.originalSlug || info.event.extendedProps.slug,
        debut: info.event.start.toISOString().slice(0, 19),
        fin: info.event.end.toISOString().slice(0, 19),
      };

      await salleStore.updateDate(payload);

      await salleStore.salleDisplayCalendar(slug.value);
      $toastr.success("Modification effectué avec succes");
    } catch (error) {
      $toastr.error(
        "Impossible de déplacer une programmation récurrente. Modifiez-la globalement.",
      );

      console.error("Erreur lors du déplacement:", error);
      info.revert();
    }
  },

  eventResize: async (info: any) => {
    try {
      const payload = {
        slug: info.event.extendedProps.originalSlug || info.event.extendedProps.slug,
        debut: info.event.start.toISOString().slice(0, 19),
        fin: info.event.end.toISOString().slice(0, 19),
      };

      await salleStore.updateDate(payload);

      await salleStore.salleDisplayCalendar(slug.value);
      $toastr.success("Modification effectué avec succes");
    } catch (error) {
      $toastr.error(
        "Impossible de déplacer une programmation récurrente. Modifiez-la globalement.",
      );

      console.error("Erreur lors du déplacement:", error);
      info.revert();
    }
  },

  nowIndicator: true,
  navLinks: true,
  editable: true,
  selectable: true,
  select: (info: any) => {
    const holidayDates = new Set(calendarStore.holidays.map((h: any) => h.date.split("T")[0]));
    const startStr = info.startStr.split("T")[0];
    if (holidayDates.has(startStr)) {
      $toastr.error("Impossible de programmer un cours un jour férié");
      return;
    }
    resetForm();
    const start = new Date(info.start);
    const end = new Date(info.end);
    
    // Pour PrimeVue DatePicker, il faut des objets Date
    form.value.date = start;

    if (info.allDay) {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      form.value.debut = "08:00";
      form.value.fin = "10:00";

      if (diffDays > 1) {
        form.value.recurrence_type = "hebdomadaire";
        const lastDay = new Date(end);
        lastDay.setDate(lastDay.getDate() - 1);
        form.value.recurrence_end_date = lastDay;
        
        const days = [];
        let current = new Date(start);
        const dayCodes = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
        for (let i = 0; i < diffDays; i++) {
          const code = dayCodes[current.getDay()];
          if (!days.includes(code)) days.push(code);
          current.setDate(current.getDate() + 1);
        }
        form.value.recurrence_days = days;
      }
      
      openCreateModal();
      if (diffDays > 1) {
        enableRecurrence.value = true;
      }
    } else {
      form.value.debut = format(start, "HH:mm");
      form.value.fin = format(end, "HH:mm");
      openCreateModal();
    }
  },
  selectAllow: (selectInfo) => {
    let current = new Date(selectInfo.start);
    const end = new Date(selectInfo.end);
    while (current < end) {
      const dateStr = format(current, 'yyyy-MM-dd');
      const isHoliday = calendarStore.holidays.some(h => h.date.split('T')[0] === dateStr);
      if (isHoliday) return false;
      current.setDate(current.getDate() + 1);
    }
    return true;
  },
  selectMirror: true,
  dayMaxEvents: true,
  slotDuration: "01:00:00",
  slotLabelInterval: "01:00:00",
  defaultTimedEventDuration: "02:00:00",
  forceEventDuration: true,
  slotMinTime: "07:00:00",
  slotMaxTime: "21:00:00",
  allDaySlot: true,
  expandRows: true,
}));

// Événements filtrés pour la vue mobile
const filteredEvents = computed(() => {
  return calendarEvents.value
    .filter((event: any) => new Date(event.start) >= new Date())
    .sort(
      (a: any, b: any) =>
        new Date(a.start).getTime() - new Date(b.start).getTime(),
    )
    .slice(0, 10);
});

// Rafraîchir le calendrier quand les événements changent
watch(calendarEvents, () => {
  if (calendarRef.value) {
    const calendarApi = calendarRef.value.getApi();
    if (calendarApi) {
      calendarApi.refetchEvents();
    }
  }
});

// Fonctions utilitaires
const getEventColor = (type: string) => {
  return type === "Évaluation" ? "#f97316" : "#3b82f6";
};

const getEventTypeClass = (type: string) => {
  const base = "px-2 py-1 rounded-full text-xs font-semibold";
  return type === "Évaluation"
    ? `${base} bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300`
    : `${base} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`;
};

const formatEventTime = (start: any, end: any): string => {
  try {
    if (!start || !end) return "";
    const startDate = start instanceof Date ? start : new Date(start);
    const endDate = end instanceof Date ? end : new Date(end);
    
    // Vérifier si la date est valide
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return "";
    
    return `${format(startDate, "dd MMMM yyyy HH:mm", { locale: fr })} à ${format(endDate, "HH:mm", { locale: fr })}`;
  } catch (error) {
    console.error("Erreur formatage date:", error);
    return "";
  }
};

const getRecurrenceText = (extendedProps: any): string => {
  if (
    !extendedProps?.recurrence_type ||
    extendedProps.recurrence_type === "aucune"
  ) {
    return "Pas de récurrence";
  }

  const typeMap: { [key: string]: string } = {
    quotidienne: "Tous les jours",
    hebdomadaire: "Toutes les semaines",
    mensuel: "Tous les mois",
    annuel: "Tous les ans",
  };

  let text =
    typeMap[extendedProps.recurrence_type] || extendedProps.recurrence_type;

  if (extendedProps.recurrence_type === "hebdomadaire" && extendedProps.recurrence_days) {
    // Ordre de la semaine pour le tri
    const dayOrder = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
    
    // Convertir les jours abrégés en jours complets et les trier
    const days = extendedProps.recurrence_days
      .split(",")
      .map((d: string) => d.trim().toUpperCase())
      .filter((d: string) => d)
      .sort((a: string, b: string) => dayOrder.indexOf(a) - dayOrder.indexOf(b))
      .map((d: string) => dayMapping[d] || d);

    if (days.length > 0) {
      text += ` (${days.join(", ")})`;
    }
  }

  // Ajouter la date de fin si elle existe
  const endDateRaw = extendedProps.recurrence_end_date || extendedProps.date_fin;
  if (endDateRaw && extendedProps.recurrence_type !== "aucune") {
    try {
      // Nettoyer la date (garder seulement YYYY-MM-DD)
      const cleanEndDate = String(endDateRaw).split(' ')[0].split('T')[0];
      const endDate = parse(cleanEndDate, "yyyy-MM-dd", new Date());
      
      if (!isNaN(endDate.getTime())) {
        text += ` jusqu'au ${format(endDate, "dd MMMM yyyy", { locale: fr })}`;
      }
    } catch (error) {
      console.warn("Erreur parsing date fin récurrence:", error);
    }
  }

  return text;
};

const formatDateForApi = (date: any) => {
  if (!(date instanceof Date)) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Vérifier la disponibilité
const checkAvailability = async () => {
  if (!canCheckAvailability.value) return;

  const formattedDate = formatDateForApi(new Date(form.value.date));

  try {
    const response = await salleStore.checkAvailability({
      salle: slug.value,
      date: formattedDate,
      debut: form.value.debut,
      fin: form.value.fin,
      ...(isEditing.value && form.value.id
        ? { exclude_id: form.value.id }
        : {}),
    });

    availabilityChecked.value = true;

    if (response.available) {
      $toastr.success("Salle disponible");
    } else {
      $toastr.error("Salle non disponible");
    }
  } catch (error: any) {
    $toastr.error(error.response?.data?.message || "Erreur de vérification");
  }
};

// Fonction utilitaire pour trouver la valeur correcte pour un dropdown
const findItemValue = (items: any[], searchValue: any, searchBy: string[] = ["id", "slug", "nom", "username", "email"]) => {
  if (!searchValue) return "";
  const s = String(searchValue).toLowerCase().trim();
  if (!s) return "";
  for (const field of searchBy) {
    const item = items.find((i) => {
      const val = String(i[field] || "").toLowerCase().trim();
      if (val === s) return true;
      if (i.nom && i.prenom) {
        const full1 = `${i.nom} ${i.prenom}`.toLowerCase().trim();
        const full2 = `${i.prenom} ${i.nom}`.toLowerCase().trim();
        if (full1 === s || full2 === s) return true;
        if (full1.includes(s) || full2.includes(s) || s.includes(full1)) return true;
      }
      return false;
    });
    if (item) return item.id || item.slug || "";
  }
  return "";
};

// Ouvrir modal de création
const openCreateModal = () => {
  // Vérifier si le jour sélectionné est férié
  const selectedDateStr = form.value.date ? format(new Date(form.value.date), 'yyyy-MM-dd') : null;
  if (selectedDateStr) {
    const isHoliday = calendarStore.holidays.some(h => h.date.split('T')[0] === selectedDateStr);
    if (isHoliday) {
      $swal.fire({
        icon: 'warning',
        title: 'Jour Férié',
        text: 'Vous ne pouvez pas programmer de cours sur un jour férié.',
        confirmButtonColor: '#6366f1'
      });
      return;
    }
  }

  isEditing.value = false;
  availabilityChecked.value = false;
  showFormModal.value = true;
};

// Ouvrir modal d'édition depuis le calendrier
const openEditModal = async (event: any) => {
  // S'assurer que les listes sont chargées
  if (userStore.enseignants.length === 0) await userStore.fetchUsersEnseignant();
  if (userStore.users.length === 0) await userStore.fetchUsers();
  if (UvStore.uvs.length === 0) await UvStore.fetchUv();
  if (groupStore.groupes.length === 0) await groupStore.fetchGroupes();

  selectedEvent.value = event;
  const p = event.extendedProps || {};

  // Remplir le formulaire avec un maximum de fallbacks pour les IDs
  form.value = {
    id: p.id || p.originalId || event.id || "",
    slug: event.id,
    date: format(new Date(event.start), "yyyy-MM-dd"),
    debut: format(new Date(event.start), "HH:mm"),
    fin: format(new Date(event.end), "HH:mm"),
    uv_id: findItemValue(UvStore.uvs, p.uv_id || p.matiere_id || p.id_uv || (typeof p.uv === 'object' ? p.uv?.id : p.uv) || p.uv_name || p.displayUv || p.matiere || p.titre),
    type: p.type || p.type_programme || "Cours",
    grade: findItemValue(groupStore.groupes, p.group_id || p.grade_id || p.id_groupe || (typeof p.grade === 'object' ? p.grade?.id : (typeof p.group === 'object' ? p.group?.id : (p.grade || p.group))) || p.grade_name || p.displayGroup || p.group),
    teacher: findItemValue([...userStore.enseignants, ...userStore.users], p.teacher_id || p.enseignant_id || p.id_enseignant || (typeof p.teacher === 'object' ? p.teacher?.id : (typeof p.enseignant === 'object' ? p.enseignant?.id : (p.teacher || p.enseignant))) || p.teacher_name || p.displayTeacher || p.enseignant),
    salle: slug.value,
    details: p.details || "",
    recurrence_type: p.recurrence_type || "aucune",
    recurrence_days: p.recurrence_days ? (Array.isArray(p.recurrence_days) ? p.recurrence_days : p.recurrence_days.split(",")) : [],
    recurrence_end_date: p.recurrence_end_date ? new Date(p.recurrence_end_date) : (p.date_fin ? new Date(p.date_fin) : null),
  };

  enableRecurrence.value = form.value.recurrence_type !== "aucune";
  isEditing.value = true;
  availabilityChecked.value = false;
  showFormModal.value = true;
};

// Ouvrir modal d'édition depuis la modale de détails
const openEditModalFromDetail = (event: any) => {
  openEditModal(event);
  closeEventModal();
};

// Ouvrir modal de détails
const openEventModal = (event: any) => {
  selectedEvent.value = event;
  showEventModal.value = true;
};

// Confirmer suppression
const confirmDelete = async (event: any) => {
  selectedEvent.value = event;

  const result = await $swal.fire({
    title: "Êtes-vous sûr ?",
    text: `Voulez-vous vraiment supprimer "${event.title}" ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Oui, supprimer !",
    cancelButtonText: "Annuler",
  });

  if (result.isConfirmed) {
    await deleteEvent(event.extendedProps.slug);
  }
};
const validateRecurrenceDays = (days: string[]): boolean => {
  const validDays = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
  return days.every((day) => validDays.includes(day.toUpperCase()));
};

// Soumettre le formulaire
const submitForm = async () => {
  formLoading.value = true;

  try {
    const holidayDates = new Set(calendarStore.holidays.map((h: any) => h.date.split("T")[0]));
    const holidayCheckedDate = format(new Date(form.value.date), "yyyy-MM-dd");
    
    if (holidayDates.has(holidayCheckedDate)) {
      $toastr.error("Impossible d'enregistrer un cours un jour férié");
      formLoading.value = false;
      return;
    }
    // Valider les jours de récurrence si activés
    if (
      enableRecurrence.value &&
      form.value.recurrence_type === "hebdomadaire"
    ) {
      if (form.value.recurrence_days.length === 0) {
        $toastr.error("Veuillez sélectionner au moins un jour de récurrence");
        formLoading.value = false;
        return;
      }

      // Valider chaque jour
      if (!validateRecurrenceDays(form.value.recurrence_days)) {
        $toastr.error("Un ou plusieurs jours de récurrence sont invalides");
        formLoading.value = false;
        return;
      }
    }

    // Formater la date pour l'API
    const apiDate = new Date(form.value.date);
    const year = apiDate.getFullYear();
    const month = String(apiDate.getMonth() + 1).padStart(2, "0");
    const day = String(apiDate.getDate()).padStart(2, "0");
    const formattedDateStr = `${year}-${month}-${day}`;

    // CORRECTION : Créer les dates début et fin au format attendu par l'API
    // Format "YYYY-MM-DD HH:MM:SS" au lieu de "YYYY-MM-DDTHH:MM:SS"
    const debut = `${formattedDateStr} ${form.value.debut}:00`;
    const fin = `${formattedDateStr} ${form.value.fin}:00`;

    // Pour le mode édition, il faut aussi envoyer l'ID
    const body: any = {
      ...form.value,
      salle: slug.value,
      debut,
      fin,
      recurrence_days: enableRecurrence.value && form.value.recurrence_type === "hebdomadaire" ? form.value.recurrence_days : []
    };

    // Si en mode édition, ajouter l'ID
    if (isEditing.value && form.value.id) {
      body.id = form.value.id;
    }

    if (enableRecurrence.value && form.value.recurrence_type !== "aucune") {
      body.recurrence_end_date = form.value.recurrence_end_date 
        ? format(new Date(form.value.recurrence_end_date), "yyyy-MM-dd")
        : formattedDateStr;
    } else {
      body.recurrence_end_date = null;
    }

    // === VÉRIFICATION API (Vérifie si le Prof ou le Groupe est occupé ailleurs) ===
    try {
      const checkPayload = {
        date: formattedDateStr,
        debut: body.debut,
        fin: body.fin,
        salle_id: slug.value,
        enseignant_id: body.teacher,
        groupe_id: body.grade,
        id: isEditing.value && form.value.id ? form.value.id : null,
      };
      
      const checkRes = await salleStore.checkAvailability(checkPayload);
      if (!checkRes.available) {
        $toastr.error(checkRes.message || "Conflit détecté : La salle, le professeur ou le groupe est déjà occupé sur ce créneau.");
        formLoading.value = false;
        return;
      }
    } catch (e: any) {
      if (e.response && e.response.status === 409) {
        $toastr.error(e.response.data.message || "Conflit d'horaire détecté.");
        formLoading.value = false;
        return;
      }
    }

    // === VÉRIFICATION FRONT-END (Anti-chevauchement strict pour la salle et ses répétitions) ===
    const newStartDate = new Date(`${formattedDateStr} ${form.value.debut}:00`);
    const newEndDate = new Date(`${formattedDateStr} ${form.value.fin}:00`);
    
    const tempEvent = {
       ...form.value,
       recurrence_type: enableRecurrence.value ? form.value.recurrence_type : "aucune",
       recurrence_days: form.value.recurrence_days,
       recurrence_end_date: form.value.recurrence_end_date ? format(new Date(form.value.recurrence_end_date), "yyyy-MM-dd") : null,
    };
    
    // On simule la génération pour vérifier TOUTES les répétitions
    let newOccurrences = [];
    if (enableRecurrence.value && form.value.recurrence_type !== "aucune") {
      newOccurrences = generateRecurringEvents(tempEvent, newStartDate, newEndDate, holidayDates);
    } else {
      newOccurrences = [{ start: newStartDate, end: newEndDate }];
    }
    
    let hasConflict = false;
    for (const newOcc of newOccurrences) {
      const nStart = new Date(newOcc.start).getTime();
      const nEnd = new Date(newOcc.end).getTime();
      
      for (const existingEvent of calendarEvents.value) {
        if (isEditing.value && (existingEvent.extendedProps?.originalSlug === form.value.id || existingEvent.id === form.value.id)) continue;
        if (existingEvent.extendedProps?.type === 'Jour Férié') continue;
        
        const eStart = new Date(existingEvent.start).getTime();
        const eEnd = new Date(existingEvent.end).getTime();
        
        if (nStart < eEnd && eStart < nEnd) {
          hasConflict = true;
          break;
        }
      }
      if (hasConflict) break;
    }

    if (hasConflict) {
      $toastr.error("Conflit d'horaire ! Ce créneau (ou l'une de ses répétitions) chevauche un événement existant dans ce calendrier.");
      formLoading.value = false;
      return;
    }

    if (isEditing.value) {
      await salleStore.updateProgramme(body);
      $toastr.success("Programme mis à jour avec succès");
    } else {
      await salleStore.addProgrammes(body);
      $toastr.success("Programme enregistré avec succès");
    }

    await salleStore.salleDisplayCalendar(slug.value);
    closeFormModal();
  } catch (error: any) {
    console.error("Erreur lors de l'enregistrement:", error?.response?.data);
    if (error?.response?.data?.message?.includes("recurrence_days")) {
      $toastr.error(
        "Les jours de récurrence sélectionnés sont invalides. Veuillez sélectionner des jours valides (Lundi à Dimanche).",
      );
    } else {
      $toastr.error(
        error?.response?.data?.message ??
          "Erreur lors de l'enregistrement du programme",
      );
    }
  } finally {
    formLoading.value = false;
  }
};

const deleteEvent = async (slugValue: string) => {
  try {
    if (!slugValue) return;

    $swal.fire({
      title: "Suppression en cours...",
      allowOutsideClick: false,
      didOpen: () => {
        $swal.showLoading();
      },
    });

    await salleStore.DeleteProgramme(slugValue);
    await salleStore.salleDisplayCalendar(slug.value);
    $swal.close();
    $toastr.success("Programme supprimé avec succès");
    closeEventModal();
  } catch (error: any) {
    console.error("Erreur lors de la suppression:", error);
    $toastr.error(
      error?.response?.data?.message ?? "Erreur lors de la suppression",
    );
  }
};

// Réinitialiser le formulaire
const resetForm = () => {
  form.value = {
    id: "",
    date: "",
    debut: "08:00",
    fin: "10:00",
    uv_id: "",
    type: "Cours",
    grade: "",
    teacher: "",
    details: "",
    recurrence_type: "aucune",
    recurrence_days: [],
    recurrence_end_date: "",
  };
};

// Fermer les modales
const closeFormModal = () => {
  showFormModal.value = false;
  resetForm();
};

const closeEventModal = () => {
  showEventModal.value = false;
  selectedEvent.value = null;
};

const MatieresOptions = computed(() => {
  return UvStore.uvs.map((u: any) => {
    return {
      label: u.nom,
      value: u.id || u.slug,
    };
  });
});

const GroupesOptions = computed(() => {
  return groupStore.groupes.map((g: any) => {
    return {
      label: `${g?.niveau?.libelle} ${g?.nom}`,
      value: g.id || g.slug,
    };
  });
});

const EnseignantsOptions = computed(() => {
  if (!form.value.uv_id) {
    const all = [...userStore.enseignants, ...userStore.users];
    const unique = Array.from(new Map(all.map(item => [item.id || item.slug, item])).values());
    return unique.map(e => ({ label: `${e.nom || ''} ${e.prenom || ''}`.trim() || e.username || e.email, value: e.id || e.slug }));
  }

  // Trouver l'UV sélectionnée dans le store
  const selectedUv = UvStore.uvs.find((u: any) => (u.id === form.value.uv_id || u.slug === form.value.uv_id));
  
  if (selectedUv && selectedUv.user && Array.isArray(selectedUv.user) && selectedUv.user.length > 0) {
    return selectedUv.user.map((e: any) => ({
      label: `${e.nom || ''} ${e.prenom || ''}`.trim() || e.username || e.email,
      value: e.id || e.slug
    }));
  }

  // Si l'UV n'a pas d'enseignants rattachés, on retourne une liste vide pour forcer le respect de la règle
  return [];
});

// Watch pour réinitialiser l'enseignant si l'UV change et que l'enseignant n'est plus valide
watch(() => form.value.uv_id, (newUvId) => {
  if (newUvId) {
    const selectedUv = UvStore.uvs.find((u: any) => (u.id === newUvId || u.slug === newUvId));
    if (selectedUv) {
      const teachers = selectedUv.user || [];
      const isValid = teachers.some((e: any) => (e.id === form.value.teacher || e.slug === form.value.teacher));
      if (!isValid) {
        form.value.teacher = "";
      }
    }
  }
});


const TypeOptions = computed(() => {
  return [
    {
      label: "Évaluation",
      value: "Évaluation",
    },
    {
      label: "Cours",
      value: "Cours",
    },
  ];
});

const getPlateformeLabel = (plateforme: string | null): string => {
  const plateformes: Record<string, string> = {
    zoom: "Zoom",
    teams: "Microsoft Teams",
    meet: "Google Meet",
    whatsapp: "WhatsApp",
    discord: "Discord",
    autres: "Autre",
  };

  return plateformes[plateforme || ""] || plateforme || "Non spécifiée";
};

const copyLienReunion = async () => {
  if (!salleStore.salle?.lien_reunion_formate) return;

  try {
    await navigator.clipboard.writeText(salleStore.salle.lien_reunion_formate);
    $toastr.success("Lien copié dans le presse-papier");
  } catch (error) {
    console.error("Erreur de copie:", error);
    $toastr.error("Impossible de copier le lien");
  }
};

// Chargement initial
onMounted(async () => {
  isPageLoading.value = true;
  try {
    showCalendar.value = false;
    await Promise.all([
      salleStore.getSalleBySlug(slug.value),
      salleStore.salleDisplayCalendar(slug.value),
      UeStore.fetchUe(),
      UvStore.fetchUv(),
      groupStore.fetchGroupes(),
      userStore.fetchUsers(),
      calendarStore.loadHolidays()
    ]);
    showCalendar.value = true;
  } catch (error) {
    console.error("Erreur initialisation:", error);
  } finally {
    isPageLoading.value = false;
  }
});

// Charger les données pour les select
const loadSelectData = async () => {
  try {
    await UvStore.fetchUv();
    await groupStore.fetchGroupes();
    await userStore.fetchUsersEnseignant();
    $toastr.success("Données chargées avec succes");
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
    $toastr.error("Erreur lors du chargement des données:", error);
  }
};

// CORRECTION du store pour s'assurer que programmes est un tableau
const fixSalleStore = () => {
  // Ajouter une méthode pour s'assurer que programmes est un tableau
  if (!salleStore.$state.programmes) {
    salleStore.$state.programmes = [];
  } else if (!Array.isArray(salleStore.$state.programmes)) {
    // Si c'est un objet, le convertir en tableau
    if (typeof salleStore.$state.programmes === "object") {
      // Essayer d'extraire un tableau
      const keys = Object.keys(salleStore.$state.programmes);
      for (const key of keys) {
        if (Array.isArray(salleStore.$state.programmes[key])) {
          salleStore.$state.programmes = salleStore.$state.programmes[key];
          break;
        }
      }
    }
  }
};
</script>

<style scoped>
:deep(.fc) {
  --fc-border-color: #e5e7eb;
  --fc-page-bg-color: #ffffff;
  --fc-list-event-hover-bg-color: #f3f4f6;
  --fc-today-bg-color: rgba(79, 70, 229, 0.05);
}

:deep(.dark .fc) {
  --fc-border-color: #374151;
  --fc-page-bg-color: #1f2937;
  --fc-list-event-hover-bg-color: #374151;
  --fc-neutral-bg-color: #111827;
  --fc-today-bg-color: rgba(79, 70, 229, 0.15);
}

:deep(.fc-header-toolbar) {
  padding: 1rem !important;
  margin-bottom: 0 !important;
}

:deep(.fc-toolbar-title) {
  font-size: 1.25rem !important;
  font-weight: 700 !important;
  color: #1f2937;
}

:deep(.dark .fc-toolbar-title) {
  color: #f9fafb;
}

:deep(.fc-button) {
  background-color: #ffffff !important;
  border-color: #d1d5db !important;
  color: #374151 !important;
  font-weight: 600 !important;
  text-transform: capitalize !important;
  padding: 0.5rem 1rem !important;
  border-radius: 0.5rem !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
}

:deep(.dark .fc-button) {
  background-color: #374151 !important;
  border-color: #4b5563 !important;
  color: #f3f4f6 !important;
}

:deep(.fc-button-active) {
  background-color: #4f46e5 !important;
  border-color: #4f46e5 !important;
  color: #ffffff !important;
}

:deep(.fc-col-header-cell) {
  padding: 0.75rem 0 !important;
  background-color: #f9fafb !important;
}

:deep(.dark .fc-col-header-cell) {
  background-color: #111827 !important;
}

:deep(.fc-col-header-cell-cushion) {
  color: #4b5563 !important;
  font-weight: 600 !important;
  text-decoration: none !important;
}

:deep(.dark .fc-col-header-cell-cushion) {
  color: #9ca3af !important;
}

:deep(.fc-timegrid-slot-label-cushion),
:deep(.fc-timegrid-axis-cushion) {
  color: #6b7280 !important;
  font-size: 0.75rem !important;
}

:deep(.dark .fc-timegrid-slot-label-cushion),
:deep(.dark .fc-timegrid-axis-cushion) {
  color: #9ca3af !important;
}

:deep(.fc-list-day-cushion) {
  background-color: #f3f4f6 !important;
}

:deep(.dark .fc-list-day-cushion) {
  background-color: #111827 !important;
}

:deep(.calendar-event) {
  cursor: pointer;
  border-radius: 4px;
  padding: 1px 4px;
}

:deep(.holiday-cell) { 
  background-color: #fee2e2 !important; 
  background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(220, 38, 38, 0.05) 10px, rgba(220, 38, 38, 0.05) 20px) !important;
  cursor: not-allowed !important; 
}
:deep(.dark .holiday-cell) { 
  background-color: rgba(220, 38, 38, 0.15) !important; 
  background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(220, 38, 38, 0.1) 10px, rgba(220, 38, 38, 0.1) 20px) !important;
}

:deep(.holiday-background) {
  background-color: #fee2e2 !important;
  opacity: 1 !important;
}

:deep(.premium-holiday-pill) {
  border-radius: 6px !important;
  padding: 2px 4px !important;
  font-weight: 600 !important;
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2) !important;
  border: none !important;
  font-size: 0.85em !important;
}

:deep(.fc-event) {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
}

:deep(.fc-v-event), :deep(.fc-h-event) {
  background-color: transparent !important;
  border: none !important;
}

:deep(.fc-event-main) {
  padding: 0 !important;
  color: white !important;
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
}

:deep(.fc-timegrid-event) {
  border: none !important;
  margin: 1px !important;
}
</style>
