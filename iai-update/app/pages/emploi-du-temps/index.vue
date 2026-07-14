<template>
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
      <div class="mt-8 flex flex-col items-center">
        <h2 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 animate-pulse">
          Préparation de votre emploi du temps...
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium tracking-widest uppercase">
          Optimisation de l'affichage
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
            Mon emploi du temps
          </h1>
          <p class="text-gray-600 dark:text-gray-300">
            Consultez vos cours et évaluations en un clin d'œil
          </p>
        </div>

        <!-- Indicateur de chargement -->
        <div
          v-if="calendarStore.isLoading"
          class="flex items-center space-x-2 mt-4 md:mt-0"
        >
          <div
            class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"
          ></div>
          <span class="text-gray-600 dark:text-gray-300">Chargement...</span>
        </div>
      </div>

      <!-- Calendrier -->
      <ClientOnly>
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <FullCalendar
            v-if="showCalendar"
            ref="calendarRef"
            :options="calendarOptions"
          />
        </div>
      </ClientOnly>
    </div>

    <!-- Modale pour afficher les détails de l'événement -->
    <TransitionRoot appear :show="showEventModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeEventModal">
        <div class="fixed inset-0 bg-black/60" />

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
            >
              <!-- En-tête de la modale avec icône -->
              <div class="flex items-center justify-between mb-6">
                <DialogTitle
                  class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
                >
                  <svg
                    v-if="selectedEvent?.type === 'Évaluation'"
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
                    v-else-if="selectedEvent?.type === 'Jour Férié'"
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
                  {{ selectedEvent?.title || "Détails" }}
                </DialogTitle>

                <!-- Badge type -->
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    selectedEvent?.type === 'Évaluation'
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                      : selectedEvent?.type === 'Jour Férié'
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
                  ]"
                >
                  {{ selectedEvent?.type }}
                </span>
              </div>

              <!-- Contenu spécifique pour les jours fériés -->
              <div
                v-if="selectedEvent?.type === 'Jour Férié'"
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
                    format(new Date(selectedEvent?.start), "eeee d MMMM yyyy", {
                      locale: fr,
                    })
                  }}
                </div>
                <p
                  v-if="selectedEvent?.extendedProps?.description"
                  class="text-gray-600 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 max-w-sm"
                >
                  "{{ selectedEvent?.extendedProps?.description }}"
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

              <!-- Contenu de la modale pour les cours -->
              <div v-else class="space-y-4">
                <!-- UV (Masqué si férié) -->
                <div v-if="selectedEvent?.type !== 'Jour Férié'" class="flex items-start">
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
                      Matières
                    </p>
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{ selectedEvent?.uv }}
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
                      {{ selectedEvent?.plageHoraire }}
                    </p>
                  </div>
                </div>

                <!-- Salle (Masqué si férié) -->
                <div v-if="selectedEvent?.type !== 'Jour Férié'" class="flex items-start">
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
                        {{ selectedEvent?.salle }}
                      </p>

                      <!-- Lien de réunion pour les salles virtuelles -->
                      <div v-if="selectedEvent?.lien_reunion" class="mt-1">
                        <a
                          :href="selectedEvent.lien_reunion"
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
                        v-else-if="selectedEvent?.est_virtuelle"
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

                <!-- Enseignant (Masqué si férié) -->
                <div v-if="selectedEvent?.type !== 'Jour Férié'" class="flex items-start">
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
                      {{ selectedEvent?.teacher }}
                    </p>
                  </div>
                </div>

                <!-- Groupe (Masqué si férié) -->
                <div v-if="selectedEvent?.type !== 'Jour Férié'" class="flex items-start">
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
                      {{ selectedEvent?.group }}
                    </p>
                  </div>
                </div>

                <!-- Récurrence -->
                <div
                  v-if="
                    selectedEvent?.recurrence_type &&
                    selectedEvent?.recurrence_type !== 'aucune'
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
                      {{ getRecurrenceText(selectedEvent) }}
                    </p>
                  </div>
                </div>

                <!-- Détails supplémentaires -->
                <div v-if="selectedEvent?.details" class="flex items-start">
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
                      {{ selectedEvent?.details }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Boutons d'action -->
              <div class="mt-8 flex justify-end gap-3">
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
import { RRule, Weekday } from "rrule";
import { format, parse } from "date-fns";
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

const calendarStore = useCalendarStore();
const calendarRef = ref();
const showCalendar = ref(false);
const showEventModal = ref(false);
const selectedEvent = ref<any>(null);
const isPageLoading = ref(true);
const { $toastr } = useNuxtApp();
/**
 * Convertit les jours de récurrence en format RRule
 */
const convertRecurrenceDays = (daysString: string | null): number[] => {
  if (!daysString) return [];

  // Correction : Utiliser les codes corrects pour les jours
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
      // Si c'est un code anglais (MO, TU, etc.)
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

const parseDateTime = (dateTimeStr: string): Date | null => {
  if (!dateTimeStr) return null;

  try {
    // Essayer le constructeur natif (gère bien les dates ISO comme 2026-04-15T08:00:00Z)
    const dateObj = new Date(dateTimeStr);
    if (!isNaN(dateObj.getTime())) {
      return dateObj;
    }

    // Si la chaîne contient un espace, c'est peut-être au format YYYY-MM-DD HH:mm
    if (dateTimeStr.includes(" ")) {
      return parse(dateTimeStr, "yyyy-MM-dd HH:mm", new Date());
    }
    // Sinon, ajouter un temps par défaut
    return parse(dateTimeStr + " 00:00", "yyyy-MM-dd HH:mm", new Date());
  } catch (error) {
    console.error("Erreur parsing date:", dateTimeStr, error);
    return null;
  }
};

/**
 * Génère les dates récurrentes pour un événement AVEC DATE DE FIN
 */
const generateRecurringEvents = (
  event: any,
  startDate: Date,
  endDate: Date,
): any[] => {
  const duration = endDate.getTime() - startDate.getTime();
  
  // Toujours inclure l'événement initial (même si la récurrence est mal configurée)
  const initialEvent = {
    ...event,
    start: startDate,
    end: endDate,
    originalSlug: event.slug || event.id,
    slug: `${event.slug || event.id}-initial`,
    isRecurring: event.recurrence_type && event.recurrence_type !== "aucune",
    isInitialEvent: true,
  };

  if (!event.recurrence_type || event.recurrence_type === "aucune") {
    return [initialEvent];
  }

  const events = [initialEvent];

  // Récupérer la date de fin de récurrence
  let recurrenceEndDate: Date | null = null;
  const endRecurrenceStr = event.date_fin || event.recurrence_end_date;
  
  if (endRecurrenceStr) {
    try {
      const parsedEnd = new Date(endRecurrenceStr);
      if (!isNaN(parsedEnd.getTime())) {
        recurrenceEndDate = parsedEnd;
        recurrenceEndDate.setHours(23, 59, 59);
      } else {
        recurrenceEndDate = parse(
          endRecurrenceStr + " 23:59:59",
          "yyyy-MM-dd HH:mm:ss",
          new Date(),
        );
      }
    } catch (error) {
      console.error("Erreur parsing fin de récurrence:", error);
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
  } else {
    ruleOptions.count = 52;
  }

  try {
    const rule = new RRule(ruleOptions);
    const dates = rule.all();

    for (const date of dates) {
      // Ignorer l'occurrence si elle tombe exactement sur le jour de l'événement initial
      if (format(date, "yyyy-MM-dd") === format(startDate, "yyyy-MM-dd")) {
        continue;
      }

      const eventStart = new Date(date);
      const eventEnd = new Date(eventStart.getTime() + duration);

      events.push({
        ...event,
        start: eventStart,
        end: eventEnd,
        originalSlug: event.slug || event.id,
        slug: `${event.slug || event.id}-${format(eventStart, "yyyy-MM-dd")}`,
        isRecurring: true,
        recurrenceDate: eventStart,
      });
    }
  } catch (error) {
    console.error("Erreur génération occurrences:", error);
  }

  return events;
};

/**
 * Conversion des données du store vers le format FullCalendar
 */
const calendarEvents = computed(() => {
  const events: any[] = [];

  const holidayDates = new Set(
    (calendarStore.holidays || []).map((h: any) => h.date.split("T")[0])
  );

  // Ajouter les jours fériés du store
  if (calendarStore.holidays && calendarStore.holidays.length > 0) {
    calendarStore.holidays.forEach((holiday: any) => {
      const hDate = holiday.date.split("T")[0];
      // 1. Fond coloré pour toute la journée
      events.push({
        id: `holiday-bg-${holiday.id}`,
        start: hDate,
        allDay: true,
        display: "background",
        backgroundColor: "#fee2e2",
        classNames: ["holiday-background"],
      });

      // 2. Événement visible avec le titre
      events.push({
        id: `holiday-${holiday.id}`,
        title: holiday.titre,
        start: hDate,
        allDay: true,
        backgroundColor: "#dc2626", // Rouge plus vif pour les jours fériés
        textColor: "#ffffff",
        borderColor: "transparent",
        classNames: ["holiday-event", "premium-holiday-pill"],
        extendedProps: {
          type: "Jour Férié",
          details: holiday.description,
          titre: holiday.titre,
          title: holiday.titre,
          start: hDate,
          isHoliday: true,
        },
      });
    });
  }

  calendarStore.calendarData.forEach((event: any, index: number) => {
    try {
      const startDate = parseDateTime(event.debut || event.start);
      const endDate = parseDateTime(event.fin || event.end);
      
      if (!startDate || !endDate) {
        console.warn("Dates manquantes ou invalides pour:", event.title || event.titre);
        return;
      }

      const eventDateStr = format(startDate, "yyyy-MM-dd");
      if (holidayDates.has(eventDateStr)) {
        console.log(`Événement ignoré car c'est un jour férié.`);
        return;
      }

      console.log(`Événement ${index + 1}:`, {
        titre: event.title,
        début: format(startDate, "dd/MM/yyyy HH:mm"),
        fin: format(endDate, "dd/MM/yyyy HH:mm"),
        date_fin: event.date_fin,
        recurrence: event.recurrence_type,
        jours: event.recurrence_days,
      });

      // Gérer les événements récurrents
      const recurringEvents = generateRecurringEvents(
        event,
        startDate,
        endDate,
      );

      console.log(`  → ${recurringEvents.length} occurrence(s) générée(s)`);

      recurringEvents.forEach((evt: any) => {
        events.push({
          id: evt.slug,
          title: evt.title,
          start: evt.start,
          end: evt.end,

          // Amélioration des couleurs avec styles conditionnels
          backgroundColor: getEventColor(evt.type, evt.color),
          borderColor: "transparent",

          // Styles CSS personnalisés
          classNames: [
            "calendar-event",
            evt.type === "Évaluation" ? "event-evaluation" : "event-cours",
            evt.isRecurring ? "event-recurring" : "",
          ],

          extendedProps: {
            uv: evt.uv,
            salle: evt.salle,
            teacher: evt.teacher,
            group: evt.group,
            details: evt.details,
            type: evt.type,
            plageHoraire: formatEventTime(evt.start, evt.end),
            lien_reunion:
              evt?.lien_reunion_formate || evt?.lien_reunion || null,
            est_virtuelle:
              evt?.type === "virtuelle" || evt?.est_virtuelle || false,
            plateforme: evt?.plateforme || null,
            title: event.title || event.titre || "Cours",
            recurrence_type: event.recurrence_type || "aucune",
            recurrence_days: event.recurrence_days || "",
            recurrence_end: event.date_fin || event.recurrence_end_date || "",
            isRecurring: evt.isRecurring || false,
            originalSlug: event.slug || event.id,
          },
        });
      });
    } catch (error) {
      console.error("Erreur lors du traitement de l'événement:", event, error);
    }
  });

  console.log("Total des événements générés:", events.length);
  return events;
});

/**
 * Obtient la couleur de l'événement
 */
const getEventColor = (type: string, color: string | undefined) => {
  if (color) {
    // Mapper les couleurs textuelles vers des codes hex
    const colorMap: { [key: string]: string } = {
      info: "#3b82f6",
      warning: "#f59e0b",
      success: "#10b981",
      danger: "#ef4444",
      primary: "#8b5cf6",
    };
    return colorMap[color] || color;
  }

  return type === "Évaluation"
    ? "#f97316" // Orange
    : "#3b82f6"; // Bleu
};

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

const copyLienReunion = async (lien: string) => {
  if (!lien) return;
  try {
    await navigator.clipboard.writeText(lien);
    $toastr.success("Lien copié dans le presse-papier");
  } catch (error) {
    console.error("Erreur de copie:", error);
    $toastr.error("Impossible de copier le lien");
  }
};

/**
 * Formate l'heure de l'événement
 */
const formatEventTime = (start: Date, end: Date): string => {
  try {
    return `${format(start, "dd MMMM yyyy HH:mm", { locale: fr })} à ${format(end, "HH:mm", { locale: fr })}`;
  } catch {
    return `${start.toLocaleDateString("fr-FR")} ${start.toLocaleTimeString("fr-FR")}`;
  }
};

/**
 * Texte de récurrence
 */
const getRecurrenceText = (event: any): string => {
  if (!event.recurrence_type || event.recurrence_type === "aucune") {
    return "Pas de récurrence";
  }

  const typeMap: { [key: string]: string } = {
    quotidien: "Tous les jours",
    hebdomadaire: "Toutes les semaines",
    mensuel: "Tous les mois",
    annuel: "Tous les ans",
  };

  let text = typeMap[event.recurrence_type] || event.recurrence_type;

  if (event.recurrence_days) {
    // Convertir les codes de jours en noms français
    const dayMap: { [key: string]: string } = {
      mo: "Lundi",
      tu: "Mardi",
      we: "Mercredi",
      th: "Jeudi",
      fr: "Vendredi",
      sa: "Samedi",
      su: "Dimanche",
      lundi: "Lundi",
      mardi: "Mardi",
      mercredi: "Mercredi",
      jeudi: "Jeudi",
      vendredi: "Vendredi",
      samedi: "Samedi",
      dimanche: "Dimanche",
    };

    const days = event.recurrence_days.split(",").map((d: string) => {
      const dayCode = d.trim().toLowerCase();
      return dayMap[dayCode] || d.trim();
    });

    text += ` (${days.join(", ")})`;
  }

  // Ajouter la date de fin si elle existe
  if (event.recurrence_end) {
    try {
      const endDate = parse(event.recurrence_end, "yyyy-MM-dd", new Date());
      text += ` jusqu'au ${format(endDate, "dd/MM/yyyy")}`;
    } catch (error) {
      text += ` jusqu'au ${event.recurrence_end}`;
    }
  }

  return text;
};

/**
 * Configuration FullCalendar améliorée
 */
const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],

  locale: frLocale,
  initialView: "dayGridMonth",
  height: "auto",

  // Toolbar personnalisée
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

  // Formattage des dates
  slotLabelFormat: {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    meridiem: false,
  },

  // Événements dynamiques
  events: (info, successCallback) => {
    successCallback(calendarEvents.value);
  },

  nowIndicator: true,
  dayMaxEvents: true,
  dayMaxEventRows: 3,
  navLinks: true,
  navLinkDayClick: "timeGridDay",

  // Gestion des clics sur les cellules (pour les jours fériés)
  dateClick: (info: any) => {
    const holiday = (calendarStore.holidays || []).find((h: any) => h.date.split("T")[0] === info.dateStr);
    if (holiday) {
      const calendarApi = info.view.calendar;
      const holidayEvent = calendarApi.getEvents().find((e: any) => 
        e.extendedProps.type === 'Jour Férié' && e.startStr.split('T')[0] === info.dateStr
      );
      if (holidayEvent) {
        selectedEvent.value = holidayEvent.extendedProps;
        showEventModal.value = true;
      }
    }
  },

  // Amélioration de l'apparence
  dayHeaderClassNames: "font-semibold text-sm",
  dayCellClassNames: (arg: any) => {
    const dateStr = arg.date.toISOString().split('T')[0];
    const isHoliday = (calendarStore.holidays || []).some((h: any) => h.date.split('T')[0] === dateStr);
    return isHoliday ? ['holiday-cell'] : [];
  },

  // Gestion des clics sur événements
  eventClick: (info: any) => {
    selectedEvent.value = info.event.extendedProps;
    showEventModal.value = true;
  },

  // Formatage des événements
  eventTimeFormat: {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    meridiem: false,
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

  // Configuration des vues
  views: {
    timeGridWeek: {
      dayHeaderFormat: { weekday: "long", day: "numeric", month: "short" },
      slotMinTime: "07:00:00",
      slotMaxTime: "22:00:00",
    },
    timeGridDay: {
      dayHeaderFormat: {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      },
      slotMinTime: "07:00:00",
      slotMaxTime: "22:00:00",
    },
    dayGridMonth: {
      dayMaxEvents: 3,
      dayMaxEventRows: 3,
    },
    listWeek: {
      listDayFormat: {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      },
      listDaySideFormat: false,
      noEventsContent: "Aucun événement cette semaine",
      eventContent: (arg) => {
        const eventType = arg.event.extendedProps.type || "Cours";
        return {
          html: `
            <div class="flex items-center">
              <div class="fc-list-event-dot" style="background: ${arg.event.backgroundColor}"></div>
              <div class="fc-list-event-title" data-event-type="${eventType}">
                ${arg.event.title}
              </div>
            </div>
          `,
        };
      },
    },
  },

  // Affichage du jour actuel

  // Gestion de la hauteur
  contentHeight: "auto",

  // Configuration responsive
  windowResize: (view: any) => {
    if (window.innerWidth < 768) {
      view.calendar.changeView("timeGridDay");
    }
  },
}));

/**

 */
onMounted(async () => {
  try {
    isPageLoading.value = true;
    await calendarStore.loadAuthCalendar();
    showCalendar.value = true;
    $toastr.success('Donnée chargé avec succes');
  } catch (error: any) {
    $toastr.error(error.response.data.message);
  } finally {
    isPageLoading.value = false;
  }
});

/**
 * Watch pour suivre les changements
 */
watch(
  () => calendarStore.calendarData,
  (newData) => {
    if (calendarRef.value?.getApi) {
      const calendarApi = calendarRef.value.getApi();
      calendarApi.refetchEvents();
    }
  },
  { deep: true },
);

const closeEventModal = () => {
  showEventModal.value = false;
  selectedEvent.value = null;
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
  opacity: 0.3 !important;
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
