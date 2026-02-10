<template>
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
            @click="openCreateModal"
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
              <div>
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
              </div>
              <div class="flex gap-2">
                <button
                  @click.stop="openEditModal(event)"
                  class="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
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
                </button>
                <button
                  @click.stop="confirmDelete(event)"
                  class="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
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
                        v-model="form.uv_id"
                        :options="MatieresOptions"
                        optionLabel="label"
                        optionValue="value"
                        filter
                        showClear
                        placeholder=""
                        class="w-full"
                      />
                      <label for="on_label">Sélectionner une matière</label>
                    </FloatLabel>
                  </div>

                  <!-- Groupe -->
                  <div>
                    <FloatLabel variant="on">
                      <Dropdown
                        v-model="form.grade"
                        :options="GroupesOptions"
                        optionLabel="label"
                        optionValue="value"
                        filter
                        showClear
                        placeholder=""
                        class="w-full"
                      />
                      <label for="on_label">Sélectionnez un groupe</label>
                    </FloatLabel>
                  </div>

                  <!-- Enseignant -->
                  <div>
                    <FloatLabel variant="on">
                      <Dropdown
                        v-model="form.teacher"
                        :options="EnseignantsOptions"
                        optionLabel="label"
                        optionValue="value"
                        filter
                        showClear
                        placeholder=""
                        class="w-full"
                      />
                      <label for="on_label">Sélectionnez un enseignant</label>
                    </FloatLabel>
                  </div>

                  <!-- Type -->
                  <div>
                    <FloatLabel variant="on">
                      <Dropdown
                        v-model="form.type"
                        :options="TypeOptions"
                        optionLabel="label"
                        optionValue="value"
                        filter
                        showClear
                        placeholder=""
                        class="w-full"
                      />
                      <label for="on_label"
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
                            class="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              :value="day.value"
                              v-model="form.recurrence_days"
                              class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
                        <input
                          type="date"
                          v-model="form.recurrence_end_date"
                          :min="form.date"
                          class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
                  ]"
                >
                  {{ selectedEvent?.extendedProps?.type }}
                </span>
              </div>

              <!-- Contenu de la modale -->
              <div class="space-y-4">
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
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{
                        selectedEvent?.extendedProps?.salle || "Non spécifié"
                      }}
                    </p>
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

import { useSalleStore } from "~~/stores/salle";
import { useUvStore } from "~~/stores/unite-valeur";
import { useUeStore } from "~~/stores/unite-enseignement";
import { useGroupeStore } from "~~/stores/group";
import { useUserStore } from "~~/stores/user";

import { useRoute } from "vue-router";

const route = useRoute();
const salleStore = useSalleStore();
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
    // Si la chaîne contient déjà un espace, c'est probablement "YYYY-MM-DD HH:mm"
    if (dateTimeStr.includes(" ")) {
      const [datePart, timePart] = dateTimeStr.split(" ");
      const [year, month, day] = datePart.split("-").map(Number);
      const [hour, minute] = timePart.split(":").map(Number);

      return new Date(year, month - 1, day, hour, minute);
    }

    // Si c'est juste une date "YYYY-MM-DD"
    if (dateTimeStr.includes("-")) {
      const [year, month, day] = dateTimeStr.split("-").map(Number);
      return new Date(year, month - 1, day, 0, 0);
    }

    // Fallback
    return new Date(dateTimeStr);
  } catch (error) {
    console.error("Erreur parsing date:", dateTimeStr, error);
    return new Date();
  }
};

/**
 * Convertit les jours de récurrence en format RRule
 */
const convertRecurrenceDays = (daysString: string | null): number[] => {
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

  return daysString
    .split(",")
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

      // Vérifier si la date générée est avant la date de fin
      if (recurrenceEndDate && eventStart > recurrenceEndDate) {
        continue;
      }

      const eventEnd = new Date(eventStart.getTime() + duration);

      events.push({
        ...event,
        start: eventStart,
        end: eventEnd,
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
 * 🔁 Conversion des données du store vers le format FullCalendar
 */
const calendarEvents = computed(() => {
  const events: any[] = [];

  console.log(
    "Début génération calendarEvents, nombre d'événements:",
    programmesArray.value.length,
  );

  programmesArray.value.forEach((event: any, index: number) => {
    try {
      const startDate = parseDateTime(event.debut);
      const endDate = parseDateTime(event.fin);

      if (!startDate || !endDate) {
        console.warn("Dates manquantes pour:", event.title);
        return;
      }

      const recurringEvents = generateRecurringEvents(
        event,
        startDate,
        endDate,
      );

      console.log(`  → ${recurringEvents.length} occurrence(s) générée(s)`);

      recurringEvents.forEach((evt: any) => {
        const backgroundColor = getEventColor(evt.type);
        const title =
          evt.title || `${evt.uv?.nom || ""} - ${evt.type || "Cours"}`;

        events.push({
          id: evt.slug,
          title: title,
          start: evt.start,
          end: evt.end,
          backgroundColor: backgroundColor,
          borderColor: "transparent",
          classNames: [
            "calendar-event",
            evt.type === "Évaluation" ? "event-evaluation" : "event-cours",
            evt.isRecurring ? "event-recurring" : "event-initial",
          ],
          extendedProps: {
            uv: evt.uv?.nom || evt.uv || "",
            uv_id: evt.uv?.id || evt.uv_id || "",
            uv_slug: evt.uv?.slug || evt.uv_slug || "",
            salle: evt.salle?.nom || evt.salle || "",
            teacher: evt.teacher?.nom || evt.teacher || "",
            teacher_id: evt.teacher?.id || evt.teacher_id || "",
            teacher_slug: evt.teacher?.slug || evt.teacher_slug || "",
            group: evt.group || evt.grade || "",
            group_id: evt.group_id,
            grade_id: evt.grade?.id || evt.group_id || "",
            grade_slug: evt.grade?.slug || evt.grade_slug || "",
            details: evt.details || "",
            type: evt.type || "Cours",
            slug: evt.slug || "",
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
  height: "auto",

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

  // Événements depuis la fonction générée
  events: (info, successCallback) => {
    const events = calendarEvents.value;
    console.log(
      "FullCalendar demande des événements, on envoie:",
      events.length,
    );
    successCallback(events);
  },

  eventClick: (info: any) => {
    selectedEvent.value = info.event;
    openEventModal(info.event);
  },

  eventDrop: async (info: any) => {
    try {
      const payload = {
        slug: info.event.extendedProps.slug,
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
        slug: info.event.extendedProps.slug,
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
  selectMirror: true,
  dayMaxEvents: true,
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

const formatEventTime = (start: Date, end: Date): string => {
  try {
    return `${format(start, "dd MMMM yyyy HH:mm", { locale: fr })} à ${format(end, "HH:mm", { locale: fr })}`;
  } catch {
    return `${start.toLocaleDateString("fr-FR")} ${start.toLocaleTimeString("fr-FR")}`;
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

  if (extendedProps.recurrence_days) {
    // Convertir les jours abrégés en jours complets
    const days = extendedProps.recurrence_days
      .split(",")
      .map((d: string) => dayMapping[d.trim()] || d.trim())
      .filter((d: string) => d);

    if (days.length > 0) {
      text += ` (${days.join(", ")})`;
    }
  }

  // Ajouter la date de fin si elle existe
  if (extendedProps.recurrence_end_date) {
    try {
      const endDate = parse(
        extendedProps.recurrence_end_date,
        "yyyy-MM-dd",
        new Date(),
      );
      text += ` jusqu'au ${format(endDate, "dd/MM/yyyy")}`;
    } catch (error) {
      text += ` jusqu'au ${extendedProps.recurrence_end_date}`;
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
const findItemValue = (
  items: any[],
  searchValue: string,
  searchBy: string[] = ["id", "slug", "nom"],
): string => {
  if (!searchValue) return "";

  for (const field of searchBy) {
    const item = items.find((i) => i[field] === searchValue);
    if (item) {
      return item.id || item.slug || "";
    }
  }

  return "";
};

// Ouvrir modal de création
const openCreateModal = () => {
  resetForm();
  isEditing.value = false;
  enableRecurrence.value = false;
  availabilityChecked.value = false;
  showFormModal.value = true;
};

// Ouvrir modal d'édition depuis le calendrier
const openEditModal = (event: any) => {
  selectedEvent.value = event;
  const extendedProps = event.extendedProps || {};

  const uvValue = findItemValue(
    UvStore.uvs,
    extendedProps.uv_id || extendedProps.uv_slug,
    ["id", "slug", "nom"],
  );
  const gradeValue = findItemValue(
    groupStore.groupes,
    extendedProps.group_id || extendedProps.grade_slug,
    ["id", "slug", "nom"],
  );
  const teacherValue = findItemValue(
    userStore.enseignants,
    extendedProps.teacher_id || extendedProps.teacher_slug,
    ["id", "slug", "nom"],
  );

  // Remplir le formulaire
  form.value = {
    slug: event.id,
    date: format(new Date(event.start), "yyyy-MM-dd"),
    debut: format(new Date(event.start), "HH:mm"),
    fin: format(new Date(event.end), "HH:mm"),
    uv_id: uvValue,
    type: extendedProps.type || "",
    grade: gradeValue,
    teacher: teacherValue,
    details: extendedProps.details || "",
    recurrence_type: extendedProps.recurrence_type || "aucune",
    recurrence_days: extendedProps.recurrence_days
      ? extendedProps.recurrence_days.split(",")
      : [],
    recurrence_end_date: extendedProps.recurrence_end_date || "",
  };

  console.log("Formulaire pré-rempli:", form.value);
  console.log(
    "UV trouvée:",
    uvValue,
    "sur",
    extendedProps.uv_id,
    "ou",
    extendedProps.uv_slug,
    "ou",
    event,
  );
  console.log(
    "Groupe trouvé:",
    gradeValue,
    "sur",
    extendedProps.grade_id,
    "ou",
    extendedProps.grade_slug,
  );
  console.log(
    "Enseignant trouvé:",
    teacherValue,
    "sur",
    extendedProps.teacher_id,
    "ou",
    extendedProps.teacher_slug,
  );

  enableRecurrence.value = form.value.recurrence_type !== "aucune";
  isEditing.value = true;
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
    const formattedDate = new Date(form.value.date);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
    const day = String(formattedDate.getDate()).padStart(2, "0");
    const formattedDateStr = `${year}-${month}-${day}`;

    // CORRECTION : Créer les dates début et fin au format attendu par l'API
    // Format "YYYY-MM-DD HH:MM:SS" au lieu de "YYYY-MM-DDTHH:MM:SS"
    const debut = `${formattedDateStr} ${form.value.debut}:00`;
    const fin = `${formattedDateStr} ${form.value.fin}:00`;

    // Pour le mode édition, il faut aussi envoyer l'ID
    const body = {
      ...form.value,
      salle: slug.value,
      debut,
      fin,
    };

    // Si en mode édition, ajouter l'ID
    if (isEditing.value && form.value.id) {
      body.id = form.value.id;
    }
    if (form.value.recurrence_type !== "hebdomadaire") {
      body.recurrence_days = [];
    }
    if (
      enableRecurrence.value &&
      form.value.recurrence_type !== "aucune" &&
      (!form.value.recurrence_end_date || form.value.recurrence_end_date === "")
    ) {
      body.recurrence_end_date = form.value.date;
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

    await salleStore.DeleteProgramme(slugValue);
    await salleStore.salleDisplayCalendar(slug.value);
    $toastr.success("Programme supprimé avec succès");
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
    debut: "",
    fin: "",
    uv_id: "",
    type: "",
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
  return userStore.enseignants.map((e: any) => {
    return {
      label: `${e?.nom} ${e?.prenom}`,
      value: e.id || e.slug,
    };
  });
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

// Chargement initial
onMounted(async () => {
  try {
    fixSalleStore();
    await salleStore.salleDisplayCalendar(slug.value);
    await salleStore.getSalleBySlug(slug.value);
    fixSalleStore();
    await loadSelectData();
    showCalendar.value = true;
    $toastr.succes('Donnée chargée avec succes')
  } catch (error) {
    console.error("Erreur lors du chargement:", error);
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
