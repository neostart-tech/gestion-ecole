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
        class="flex flex-col md:flex-row md:items-start lg:items-center justify-between gap-6 mb-8"
      >
        <div class="flex-1 min-w-0">
          <h1
            class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-start sm:items-center gap-2 sm:gap-3"
          >
            <svg
              class="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1 sm:mt-0"
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
            <span class="leading-tight">Emploi du temps - {{ groupTitle }}</span>
          </h1>
          <p class="text-gray-600 dark:text-gray-300 ml-9 sm:ml-11">
            Programme des cours et évaluations pour ce groupe
          </p>
        </div>

        <!-- Boutons d'action -->
        <div class="flex items-center space-x-4 mt-2 md:mt-0 flex-shrink-0">
          <Can action="create-cours">
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
          </Can>

          <!-- Indicateur de chargement -->
          <div v-if="groupStore.isLoading" class="flex items-center space-x-2">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
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
        <div v-if="groupStore.isLoading" class="p-8 text-center">
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
                    :class="getEventTypeClass(event.extendedProps?.type || 'Cours')"
                  >
                    {{ event.extendedProps?.type || 'Cours' }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ event.extendedProps?.teacher || '' }}
                  </span>
                </div>
              </div>

              <!-- Boutons d'action rapides -->
              <div v-if="event.extendedProps?.type !== 'Jour Férié'" class="flex gap-2">
                <button
                  @click.stop="openEditModal(event)"
                  class="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click.stop="confirmDelete(event)"
                  class="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
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
              <div class="flex items-center justify-between mb-6">
                <DialogTitle class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ isEditing ? "Modifier le cours" : "Nouveau cours" }}
                </DialogTitle>
                <button @click="closeFormModal" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form @submit.prevent="submitForm">
                <div class="space-y-4">
                  <!-- Date et heure -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                      <FloatLabel variant="on">
                        <DatePicker
                          v-model="form.date"
                          dateFormat="yy-mm-dd"
                          showIcon
                          fluid
                          iconDisplay="input"
                          :disabledDates="disabledDates"
                        />
                        <label>Sélectionner une date</label>
                      </FloatLabel>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Début</label>
                        <input
                          type="time"
                          v-model="form.debut"
                          required
                          class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fin</label>
                        <input
                          type="time"
                          v-model="form.fin"
                          required
                          class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Semestre -->
                  <div>
                    <FloatLabel variant="on">
                      <Dropdown
                        v-model="form.periode_id"
                        :options="SemestresOptions"
                        optionLabel="label"
                        optionValue="value"
                        class="w-full"
                        @change="form.uv_id = ''"
                      />
                      <label>Semestre</label>
                    </FloatLabel>
                  </div>

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
                        class="w-full"
                        :disabled="!form.periode_id"
                      />
                      <label>Matière</label>
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
                        :disabled="!form.uv_id"
                        class="w-full"
                      />
                      <label>Enseignant</label>
                    </FloatLabel>
                  </div>

                  <!-- Salle -->
                  <div>
                    <FloatLabel variant="on">
                      <Dropdown
                        v-model="form.salle"
                        :options="sallesOptions"
                        optionLabel="label"
                        optionValue="value"
                        filter
                        showClear
                        class="w-full"
                      />
                      <label>Salle</label>
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
                        class="w-full"
                      />
                      <label>Type de programme</label>
                    </FloatLabel>
                  </div>

                  <!-- Récurrence -->
                  <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div class="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        id="enableRecurrenceGroup"
                        v-model="enableRecurrence"
                        class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label for="enableRecurrenceGroup" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Activer la récurrence
                      </label>
                    </div>

                    <div v-if="enableRecurrence" class="space-y-4 pl-6">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fréquence</label>
                        <select
                          v-model="form.recurrence_type"
                          class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="aucune">Aucune</option>
                          <option value="quotidienne">Quotidienne</option>
                          <option value="hebdomadaire">Hebdomadaire</option>
                        </select>
                      </div>

                      <div v-if="form.recurrence_type === 'hebdomadaire'">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jours</label>
                        <div class="grid grid-cols-4 gap-2">
                          <label
                            v-for="day in daysOfWeek"
                            :key="day.value"
                            class="flex items-center gap-2 cursor-pointer"
                            :for="'day-g-' + day.value"
                          >
                            <input
                              type="checkbox"
                              :id="'day-g-' + day.value"
                              :value="day.value"
                              v-model="form.recurrence_days"
                              class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span class="text-sm text-gray-700 dark:text-gray-300">{{ day.label }}</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date de fin</label>
                        <DatePicker
                          v-model="form.recurrence_end_date"
                          dateFormat="yy-mm-dd"
                          showIcon
                          fluid
                          iconDisplay="input"
                          :minDate="form.date ? new Date(form.date) : null"
                          :disabledDates="disabledDates"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Détails -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Détails (optionnel)</label>
                    <textarea
                      v-model="form.details"
                      rows="3"
                      class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                      placeholder="Notes supplémentaires..."
                    ></textarea>
                  </div>
                </div>

                <div class="mt-8 flex justify-end gap-3">
                  <button type="button" @click="closeFormModal" class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 dark:text-gray-300">Annuler</button>
                  <button type="submit" :disabled="formLoading" class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2">
                    <svg v-if="formLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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

    <!-- Modal de détails -->
    <TransitionRoot appear :show="showEventModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeEventModal">
        <div class="fixed inset-0 bg-black/60" />
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <DialogPanel class="w-full max-w-lg bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl transition-all">
              <div class="flex items-center justify-between mb-6">
                <DialogTitle class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <svg v-if="selectedEvent?.extendedProps?.type === 'Évaluation'" class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg v-else class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {{ selectedEvent?.title }}
                </DialogTitle>
                <span :class="['px-3 py-1 rounded-full text-xs font-semibold', selectedEvent?.extendedProps?.type === 'Évaluation' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800']">
                  {{ selectedEvent?.extendedProps?.type }}
                </span>
              </div>

              <!-- Contenu de la modale -->
              <div v-if="selectedEvent?.extendedProps?.type === 'Jour Férié'" class="py-6 flex flex-col items-center text-center">
                <div class="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <svg class="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-7h.01" />
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-tight">
                  {{ selectedEvent?.title.replace("🚩 ", "") }}
                </h3>
                <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-bold mb-4 border border-indigo-100 dark:border-indigo-800">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ selectedEvent?.start ? format(new Date(selectedEvent.start), "eeee d MMMM yyyy", { locale: fr }) : '' }}
                </div>
                <p class="text-gray-600 dark:text-gray-400 max-w-sm mx-auto leading-relaxed italic">
                  {{ selectedEvent?.extendedProps?.details || "Aujourd'hui est un jour férié. Aucun cours n'est programmé à cette date." }}
                </p>
              </div>

              <div v-else class="space-y-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p class="text-sm text-gray-500">Date et heure</p>
                    <p class="font-medium text-gray-900 dark:text-white">{{ formatEventTime(selectedEvent?.start, selectedEvent?.end) }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <div>
                    <p class="text-sm text-gray-500">Salle</p>
                    <p class="font-medium text-gray-900 dark:text-white">{{ selectedEvent?.extendedProps?.salle || "Non spécifiée" }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p class="text-sm text-gray-500">Enseignant</p>
                    <p class="font-medium text-gray-900 dark:text-white">{{ selectedEvent?.extendedProps?.teacher || "Non spécifié" }}</p>
                  </div>
                </div>

                <div v-if="selectedEvent?.extendedProps?.recurrence_type !== 'aucune'" class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <div>
                    <p class="text-sm text-gray-500">Récurrence</p>
                    <p class="font-medium text-gray-900 dark:text-white">{{ getRecurrenceText(selectedEvent?.extendedProps) }}</p>
                  </div>
                </div>

                <div v-if="selectedEvent?.extendedProps?.details" class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p class="text-sm text-gray-500">Description</p>
                    <p class="text-gray-700 dark:text-gray-300">{{ selectedEvent?.extendedProps?.details }}</p>
                  </div>
                </div>
              </div>

              <div class="mt-8 flex justify-end gap-3">
                <template v-if="selectedEvent?.extendedProps?.type !== 'Jour Férié'">
                  <Can action="update-cours">
                    <button @click="openEditModalFromDetail(selectedEvent)" class="px-4 py-2 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Modifier
                    </button>
                  </Can>
                  <Can action="delete-cours">
                    <button @click="confirmDelete(selectedEvent)" class="px-4 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Supprimer
                    </button>
                  </Can>
                </template>
                <button @click="closeEventModal" class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700">Fermer</button>
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
import { format, addDays } from "date-fns";
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
import { useGroupeStore } from "~~/stores/group";
import { useUserStore } from "~~/stores/user";
import { useCalendarStore } from "~~/stores/calendar";
import { useNiveauStore } from "~~/stores/niveau";
import { useRoute } from "vue-router";

const route = useRoute();
const groupStore = useGroupeStore();
const salleStore = useSalleStore();
const UvStore = useUvStore();
const userStore = useUserStore();
const calendarStore = useCalendarStore();
const niveauStore = useNiveauStore();
const { $toastr, $swal } = useNuxtApp();

// Références
const calendarRef = ref();
const showCalendar = ref(false);
const showFormModal = ref(false);
const showEventModal = ref(false);
const isEditing = ref(false);
const enableRecurrence = ref(false);
const formLoading = ref(false);
const isPageLoading = ref(true);

const slug = computed(() => route.params.slug as string);

const groupTitle = computed(() => {
  const g = groupStore.groupes.find(g => g.slug === slug.value || g.id == slug.value);
  return g ? `${g.niveau?.libelle || ''} ${g.nom || ''}`.trim() : "Groupe";
});

const selectedEvent = ref<any>(null);

// Formulaire
const form = ref({
  id: "",
  slug: "",
  date: "",
  debut: "",
  fin: "",
  periode_id: "",
  uv_id: "",
  type: "Cours",
  grade: "",
  teacher: "",
  salle: "",
  details: "",
  recurrence_type: "aucune",
  recurrence_days: [] as string[],
  recurrence_end_date: "",
});

const daysOfWeek = [
  { value: "MO", label: "Lundi" },
  { value: "TU", label: "Mardi" },
  { value: "WE", label: "Mercredi" },
  { value: "TH", label: "Jeudi" },
  { value: "FR", label: "Vendredi" },
  { value: "SA", label: "Samedi" },
  { value: "SU", label: "Dimanche" },
];

const dayMapping: Record<string, string> = {
  MO: "Lundi", TU: "Mardi", WE: "Mercredi", TH: "Jeudi", FR: "Vendredi", SA: "Samedi", SU: "Dimanche",
};

const disabledDates = computed(() => {
  if (!calendarStore.holidays) return [];
  // Créer des objets Date à minuit local pour le DatePicker
  return calendarStore.holidays.map(h => {
    const d = new Date(h.date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  });
});

// Transformer les programmes en événements FullCalendar
const programmesArray = computed(() => {
  return Array.isArray(groupStore.programmes) ? groupStore.programmes : [];
});

const calendarEvents = computed(() => {
  const events: any[] = [];
  const programmes = programmesArray.value;

  // Ajouter les jours fériés
  calendarStore.holidays.forEach((holiday: any) => {
    events.push({
      title: `🚩 ${holiday.titre || holiday.nom}`,
      start: holiday.date,
      allDay: true,
      classNames: ['premium-holiday-pill'],
      extendedProps: { type: 'Jour Férié', details: holiday.description }
    });
  });

  const holidayDates = new Set(calendarStore.holidays.map((h: any) => h.date.split("T")[0]));

  programmes.forEach((prog: any) => {
    const eventDate = prog.debut.split(" ")[0];
    if (holidayDates.has(eventDate)) return;

    const startDate = new Date(prog.debut);
    const endDate = new Date(prog.fin);
    
    if (prog.recurrence_type && prog.recurrence_type !== "aucune") {
      const recurring = generateRecurringEvents(prog, startDate, endDate, holidayDates);
      recurring.forEach(evt => events.push(formatEventForCalendar(evt)));
    } else {
      events.push(formatEventForCalendar(prog));
    }
  });

  return events;
});

const formatEventForCalendar = (evt: any) => {
  const type = evt.type || evt.type_programme || "Cours";
  const color = type === "Évaluation" ? "#f97316" : "#3b82f6";
  const uvName = evt.uv?.nom || evt.uv || "";
  
  return {
    id: evt.slug || evt.id,
    title: uvName || evt.titre || type,
    start: evt.debut || evt.start,
    end: evt.fin || evt.end,
    backgroundColor: color,
    borderColor: "transparent",
    extendedProps: {
      ...evt,
      displayType: type,
      displaySalle: evt.salle?.nom || evt.salle || "",
      displayTeacher: evt.teacher?.nom || evt.teacher || "",
      displayUv: uvName,
      // Forcer les IDs pour le pré-remplissage
      uv_id: evt.uv_id || evt.matiere_id || evt.uv?.id || evt.id_uv || evt.uv,
      teacher_id: evt.teacher_id || evt.enseignant_id || evt.teacher?.id || evt.id_enseignant || evt.teacher,
      salle_id: evt.salle_id || evt.salle?.id || evt.id_salle || evt.salle
    }
  };
};

const generateRecurringEvents = (event: any, startDate: Date, endDate: Date, holidayDates: Set<string> = new Set()) => {
  const events = [];
  let recurrenceEndDate = event.recurrence_end_date ? new Date(event.recurrence_end_date) : addDays(startDate, 30);
  recurrenceEndDate.setHours(23, 59, 59);

  const duration = endDate.getTime() - startDate.getTime();
  const rule = new RRule({
    freq: event.recurrence_type === "quotidienne" ? RRule.DAILY : RRule.WEEKLY,
    byweekday: event.recurrence_type === "hebdomadaire" ? parseDays(event.recurrence_days) : null,
    dtstart: startDate,
    until: recurrenceEndDate,
  });

  const occurrences = rule.all();
  occurrences.forEach((date, index) => {
    if (index === 0) return; // Sauter le premier car déjà ajouté par l'événement d'origine
    
    const occDateStr = format(date, "yyyy-MM-dd");
    if (holidayDates.has(occDateStr)) return;

    events.push({
      ...event,
      debut: date,
      fin: new Date(date.getTime() + duration),
      isRecurring: true
    });
  });

  return events;
};

const parseDays = (daysStr: string | string[]) => {
  if (!daysStr) return null;
  const days = Array.isArray(daysStr) ? daysStr : daysStr.split(",");
  return days.map(d => {
    const code = d.trim().toUpperCase();
    return RRule[code as keyof typeof RRule] || null;
  }).filter(d => d !== null);
};

const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  locale: frLocale,
  initialView: "dayGridMonth",
  height: 800,
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
  },
  buttonText: { today: "Aujourd'hui", month: "Mois", week: "Semaine", day: "Jour", list: "Liste" },
  dayCellClassNames: (arg) => {
    const dateStr = format(arg.date, "yyyy-MM-dd");
    return calendarStore.holidays.some(h => h.date.split('T')[0] === dateStr) ? ['holiday-cell'] : [];
  },
  events: (info, successCallback) => successCallback(calendarEvents.value),
  eventContent: (arg: any) => {
    const type = arg.event.extendedProps?.type || "Cours";
    const title = arg.event.title || "";
    const isEval = type === "Évaluation";
    const pillBg = type === "Jour Férié" ? "#dc2626" : (isEval ? "#f97316" : "#3b82f6");

    if (arg.view.type.startsWith("dayGrid")) {
      return { html: `<div style="display:flex;align-items:center;padding:2px 8px;width:100%;background:${pillBg};border-radius:4px;color:#fff;font-size:11px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${title}</div>` };
    }
    
    const gradient = isEval ? "linear-gradient(135deg,#f97316,#ea580c)" : "linear-gradient(135deg,#2563eb,#1d4ed8)";
    return {
      html: `
        <div style="display:flex;flex-direction:column;padding:6px;width:100%;height:100%;background:${type === 'Jour Férié' ? '#dc2626' : gradient};border-radius:6px;color:#fff;overflow:hidden;">
          <div style="font-size:8px;font-weight:900;text-transform:uppercase;opacity:0.9;margin-bottom:2px;">${arg.timeText}</div>
          <div style="font-size:11px;font-weight:700;line-height:1.2;">${title}</div>
        </div>
      `
    };
  },
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
  eventAllow: (dropInfo: any) => {
    const holidayDates = new Set(calendarStore.holidays.map((h: any) => h.date.split("T")[0]));
    const dropDate = dropInfo.startStr.split("T")[0];
    return !holidayDates.has(dropDate);
  },
  selectAllow: (selectInfo: any) => {
    const holidayDates = new Set(calendarStore.holidays.map((h: any) => h.date.split("T")[0]));
    const startDate = selectInfo.startStr.split("T")[0];
    return !holidayDates.has(startDate);
  },
  eventClick: (info) => openEventModal(info.event),
}));

watch(calendarEvents, () => {
  if (calendarRef.value) {
    const calendarApi = calendarRef.value.getApi();
    if (calendarApi) {
      calendarApi.refetchEvents();
    }
  }
});

const filteredEvents = computed(() => {
  return calendarEvents.value
    .filter(e => new Date(e.start) >= new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 10);
});

const formatEventTime = (start: any, end: any) => {
  if (!start || !end) return "";
  return `${format(new Date(start), "dd MMMM yyyy HH:mm", { locale: fr })} - ${format(new Date(end), "HH:mm")}`;
};

const getRecurrenceText = (props: any): string => {
  if (!props?.recurrence_type || props.recurrence_type === "aucune") {
    return "Pas de récurrence";
  }

  const typeMap: { [key: string]: string } = {
    quotidienne: "Tous les jours",
    hebdomadaire: "Toutes les semaines",
  };

  let text = typeMap[props.recurrence_type] || props.recurrence_type;

  if (props.recurrence_type === "hebdomadaire" && props.recurrence_days) {
    // Ordre de la semaine pour le tri
    const dayOrder = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
    
    let daysArray: string[] = [];
    if (Array.isArray(props.recurrence_days)) {
      daysArray = props.recurrence_days;
    } else {
      daysArray = String(props.recurrence_days).split(",").map(d => d.trim());
    }

    const days = daysArray
      .map(d => d.toUpperCase())
      .filter(d => d)
      .sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b))
      .map(d => dayMapping[d] || d);

    if (days.length > 0) {
      text += ` (${days.join(", ")})`;
    }
  }

  // Ajouter la date de fin si elle existe
  const endDateRaw = props.recurrence_end_date || props.date_fin;
  if (endDateRaw && props.recurrence_type !== "aucune") {
    try {
      // Nettoyer la date (garder seulement YYYY-MM-DD)
      const cleanEndDate = String(endDateRaw).split(' ')[0].split('T')[0];
      const endDate = new Date(cleanEndDate);
      
      if (!isNaN(endDate.getTime())) {
        text += ` jusqu'au ${format(endDate, "dd MMMM yyyy", { locale: fr })}`;
      }
    } catch (error) {
      console.warn("Erreur parsing date fin récurrence:", error);
    }
  }

  return text;
};

const getEventTypeClass = (type: string) => {
  const base = "px-2 py-1 rounded-full font-semibold";
  return type === "Évaluation" ? `${base} bg-orange-100 text-orange-800` : `${base} bg-blue-100 text-blue-800`;
};


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
        // Recherche partielle si le nom complet contient la recherche
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
  showFormModal.value = true;
};

// Ouvrir modal d'édition depuis le calendrier
const openEditModal = async (event: any) => {
  // S'assurer que les listes sont chargées
  if (userStore.enseignants.length === 0) await userStore.fetchUsersEnseignant();
  if (userStore.users.length === 0) await userStore.fetchUsers();
  if (UvStore.uvs.length === 0) await UvStore.fetchUv();
  if (salleStore.salles.length === 0) await salleStore.fetchSalles();

  selectedEvent.value = event;
  const p = event.extendedProps || {};

  form.value = {
    id: p.id || p.originalId || event.id || "",
    slug: event.id,
    date: format(new Date(event.start), "yyyy-MM-dd"),
    debut: format(new Date(event.start), "HH:mm"),
    fin: format(new Date(event.end), "HH:mm"),
    periode_id: p.periode_id || p.semestre_id || (p.uv && p.uv.periode_id) || "",
    uv_id: findItemValue(UvStore.uvs, p.uv_id || p.matiere_id || p.id_uv || (typeof p.uv === 'object' ? p.uv?.id : p.uv) || p.uv_name || p.displayUv || p.matiere || p.titre),
    type: p.type || p.type_programme || "Cours",
    grade: slug.value,
    teacher: findItemValue([...userStore.enseignants, ...userStore.users], p.teacher_id || p.enseignant_id || p.id_enseignant || (typeof p.teacher === 'object' ? p.teacher?.id : (typeof p.enseignant === 'object' ? p.enseignant?.id : (p.teacher || p.enseignant))) || p.teacher_name || p.displayTeacher || p.enseignant),
    salle: findItemValue(salleStore.salles, p.salle_id || p.id_salle || (typeof p.salle === 'object' ? p.salle?.id : p.salle) || p.salle_name || p.displaySalle),
    details: p.details || "",
    recurrence_type: p.recurrence_type || "aucune",
    recurrence_days: p.recurrence_days ? (Array.isArray(p.recurrence_days) ? p.recurrence_days : p.recurrence_days.split(",")) : [],
    recurrence_end_date: p.recurrence_end_date ? new Date(p.recurrence_end_date) : (p.date_fin ? new Date(p.date_fin) : null),
  };

  enableRecurrence.value = form.value.recurrence_type !== "aucune";
  isEditing.value = true;
  showFormModal.value = true;
};

const openEditModalFromDetail = (event: any) => { openEditModal(event); closeEventModal(); };
const openEventModal = (event: any) => { selectedEvent.value = event; showEventModal.value = true; };
const closeFormModal = () => { showFormModal.value = false; resetForm(); };
const closeEventModal = () => { showEventModal.value = false; selectedEvent.value = null; };

// Réinitialiser le formulaire
const resetForm = () => {
  form.value = {
    id: "",
    slug: "",
    date: "",
    debut: "08:00",
    fin: "10:00",
    periode_id: "",
    uv_id: "",
    type: "Cours",
    grade: slug.value,
    teacher: "",
    salle: "",
    details: "",
    recurrence_type: "aucune",
    recurrence_days: [],
    recurrence_end_date: "",
  };
  enableRecurrence.value = false;
};

const submitForm = async () => {
  formLoading.value = true;
  try {
    const holidayDates = new Set(calendarStore.holidays.map((h: any) => h.date.split("T")[0]));
    const formattedDate = format(new Date(form.value.date), "yyyy-MM-dd");
    
    if (holidayDates.has(formattedDate)) {
      $toastr.error("Impossible d'enregistrer un cours un jour férié");
      formLoading.value = false;
      return;
    }
    const payload = {
      ...form.value,
      date: formattedDate,
      debut: `${formattedDate} ${form.value.debut}:00`,
      fin: `${formattedDate} ${form.value.fin}:00`,
      recurrence_days: form.value.recurrence_days,
      recurrence_end_date: form.value.recurrence_end_date 
        ? format(new Date(form.value.recurrence_end_date), "yyyy-MM-dd")
        : ""
    };

    // === VÉRIFICATION API (Vérifie si la Salle ou le Prof est occupé ailleurs) ===
    try {
      const checkPayload = {
        date: payload.date,
        debut: payload.debut,
        fin: payload.fin,
        salle_id: payload.salle,
        enseignant_id: payload.teacher,
        groupe_id: payload.grade,
        id: isEditing.value ? payload.id : null,
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

    // === VÉRIFICATION FRONT-END (Anti-chevauchement strict pour le groupe et ses répétitions) ===
    const newStartDate = new Date(`${formattedDate} ${form.value.debut}:00`);
    const newEndDate = new Date(`${formattedDate} ${form.value.fin}:00`);
    
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
      newOccurrences.push({ debut: newStartDate, fin: newEndDate });
    } else {
      newOccurrences = [{ debut: newStartDate, fin: newEndDate }];
    }
    
    let hasConflict = false;
    for (const newOcc of newOccurrences) {
      const nStart = new Date(newOcc.debut).getTime();
      const nEnd = new Date(newOcc.fin).getTime();
      
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

    if (isEditing.value) await salleStore.updateProgramme(payload);
    else await salleStore.addProgrammes(payload);
    $toastr.success("Opération réussie");
    await groupStore.GroupDisplayCalendar(slug.value);
    closeFormModal();
  } catch (e: any) { 
    console.error("Erreur lors de l'enregistrement:", e);
    $toastr.error("Erreur lors de l'enregistrement"); 
  }
  finally { formLoading.value = false; }
};

const confirmDelete = async (event: any) => {
  const result = await $swal.fire({ title: "Supprimer ?", icon: "warning", showCancelButton: true });
  if (result.isConfirmed) {
    $swal.fire({
      title: "Suppression en cours...",
      allowOutsideClick: false,
      didOpen: () => {
        $swal.showLoading();
      },
    });
    try {
      await salleStore.DeleteProgramme(event.id);
      await groupStore.GroupDisplayCalendar(slug.value);
      $swal.close();
      $toastr.success("Supprimé");
      closeEventModal();
    } catch (e) {
      $swal.close();
      $toastr.error("Erreur lors de la suppression");
    }
  }
};

const periodesDuGroup = ref([]);

const fetchPeriodes = async () => {
  const currentGroup = groupStore.groupes.find(g => g.slug === slug.value || g.id == slug.value);
  const gNiveauId = currentGroup?.niveau_id || currentGroup?.niveau?.id;
  if (gNiveauId) {
    periodesDuGroup.value = await niveauStore.fetchNiveauPeriodes(gNiveauId);
  }
};

onMounted(() => {
  fetchPeriodes();
});

const SemestresOptions = computed(() => {
  const periodes = periodesDuGroup.value?.data || periodesDuGroup.value || [];
  if (!Array.isArray(periodes)) return [];
  return periodes.map((p: any) => ({ label: p.nom, value: p.id }));
});

const MatieresOptions = computed(() => {
  const currentGroup = groupStore.groupes.find(g => g.slug === slug.value || g.id == slug.value);
  let filtered = UvStore.uvs;

  if (currentGroup) {
    const gFiliereId = currentGroup.filiere_id || currentGroup.filiere?.id;
    const gNiveauId = currentGroup.niveau_id || currentGroup.niveau?.id;

    filtered = UvStore.uvs.filter(u => {
      const uFiliereId = u.filiere_id || u.filiere?.id;
      const uNiveauId = u.niveau_id || u.niveau?.id;

      // Filtre strict par niveau : l'UV DOIT avoir le même niveau que le groupe
      if (gNiveauId && uNiveauId != gNiveauId) return false;

      // Filtre optionnel par filière : si l'UV a une filière, elle doit correspondre à celle du groupe
      if (gFiliereId && uFiliereId && gFiliereId != uFiliereId) return false;
      
      // Filtre strict par semestre si sélectionné dans le formulaire
      if (form.value.periode_id) {
        const uPeriodeId = u.periode_id || u.periode?.id || u.semestre_id || u.semestre?.id;
        if (uPeriodeId != form.value.periode_id) return false;
      }
      
      return true;
    });
  }

  return filtered.map((u: any) => {
    const parts = [];
    if (u.periode?.nom) parts.push(u.periode.nom);
    
    const details = parts.length > 0 ? ` - ${parts.join(' / ')}` : '';
    const codeName = u.code ? ` (${u.code})` : '';
    return {
      label: `${u.nom}${details}${codeName}`,
      value: u.id || u.slug,
    };
  });
});
const EnseignantsOptions = computed(() => {
  if (!form.value.uv_id) {
    const all = [...userStore.enseignants, ...userStore.users];
    // Éviter les doublons par ID
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

const sallesOptions = computed(() => salleStore.salles.map(s => ({ label: s.nom, value: s.id || s.slug })));
const TypeOptions = [ { label: "Cours", value: "Cours" }, { label: "Évaluation", value: "Évaluation" } ];

onMounted(async () => {
  isPageLoading.value = true;
  try {
    await Promise.all([
      groupStore.fetchGroupes(),
      groupStore.GroupDisplayCalendar(slug.value),
      UvStore.fetchUv(),
      userStore.fetchUsersEnseignant(),
      salleStore.fetchSalles(),
      calendarStore.loadHolidays()
    ]);
    showCalendar.value = true;
  } finally { isPageLoading.value = false; }
});
</script>

<style scoped>
:deep(.fc) { --fc-border-color: #e5e7eb; --fc-today-bg-color: rgba(79, 70, 229, 0.05); }
:deep(.dark .fc) { --fc-border-color: #374151; }
:deep(.holiday-cell) { 
  background-color: #fee2e2 !important; 
  background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(220, 38, 38, 0.05) 10px, rgba(220, 38, 38, 0.05) 20px) !important;
  cursor: not-allowed !important; 
}
:deep(.dark .holiday-cell) { 
  background-color: rgba(220, 38, 38, 0.15) !important; 
  background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(220, 38, 38, 0.1) 10px, rgba(220, 38, 38, 0.1) 20px) !important;
}
:deep(.holiday-background) { background-color: #fee2e2 !important; opacity: 0.3; }
:deep(.premium-holiday-pill) { background: #dc2626 !important; color: white !important; border-radius: 4px !important; font-size: 0.8em !important; padding: 2px 4px !important; }
</style>