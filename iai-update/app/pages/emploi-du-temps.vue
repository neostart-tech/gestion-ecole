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
                    selectedEvent?.type === 'Évaluation'
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
                  ]"
                >
                  {{ selectedEvent?.type }}
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
                      UV / Matière
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
                      {{ selectedEvent?.salle }}
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
                      {{ selectedEvent?.teacher }}
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

import { useCalendarStore } from "../../stores/calendar";

const calendarStore = useCalendarStore();
const calendarRef = ref();
const showCalendar = ref(false);
const showEventModal = ref(false);
const selectedEvent = ref<any>(null);

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

/**
 * Parse une date au format "YYYY-MM-DD HH:mm"
 */
const parseDateTime = (dateTimeStr: string): Date => {
  if (!dateTimeStr) return new Date();

  try {
    // Si la chaîne contient un espace, c'est déjà au format YYYY-MM-DD HH:mm
    if (dateTimeStr.includes(" ")) {
      return parse(dateTimeStr, "yyyy-MM-dd HH:mm", new Date());
    }
    // Sinon, ajouter un temps par défaut
    return parse(dateTimeStr + " 00:00", "yyyy-MM-dd HH:mm", new Date());
  } catch (error) {
    console.error("Erreur parsing date:", dateTimeStr, error);
    return new Date();
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
  if (!event.recurrence_type || event.recurrence_type === "aucune") {
    return [
      {
        ...event,
        start: startDate,
        end: endDate,
      },
    ];
  }

  const events = [];
  const duration = endDate.getTime() - startDate.getTime();

  // Récupérer la date de fin de récurrence
  let recurrenceEndDate: Date | null = null;
  if (event.date_fin) {
    try {
      // Parser la date de fin (format "YYYY-MM-DD")
      recurrenceEndDate = parse(
        event.date_fin + " 23:59:59",
        "yyyy-MM-dd HH:mm:ss",
        new Date(),
      );
    } catch (error) {
      console.error("Erreur parsing date_fin:", error);
    }
  }

  // Configuration de la règle de récurrence
  const ruleOptions: any = {
    dtstart: startDate,
    freq: RRule.WEEKLY,
  };

  // Définir les jours spécifiques pour la récurrence
  if (event.recurrence_days) {
    const byweekday = convertRecurrenceDays(event.recurrence_days);
    if (byweekday.length > 0) {
      ruleOptions.byweekday = byweekday;
    }
  }

  // Ajouter la date de fin si elle existe
  if (recurrenceEndDate) {
    ruleOptions.until = recurrenceEndDate;
    console.log("Récurrence jusqu'à:", format(recurrenceEndDate, "dd/MM/yyyy"));
  } else {
    ruleOptions.count = 52;
  }

  try {
    const rule = new RRule(ruleOptions);
    const dates = rule.all();

    // Log de débogage simplifié
    console.log("Règle de récurrence:", {
      dtstart: format(ruleOptions.dtstart, "dd/MM/yyyy"),
      freq: "WEEKLY",
      byweekday: ruleOptions.byweekday
        ? ruleOptions.byweekday.length + " jour(s)"
        : "tous",
      until: ruleOptions.until
        ? format(ruleOptions.until, "dd/MM/yyyy")
        : "sans limite",
    });

    console.log("Dates générées:", dates.length, "occurrences");

    // Créer un événement pour chaque date de récurrence
    for (const date of dates) {
      const eventStart = new Date(date);
      const eventEnd = new Date(eventStart.getTime() + duration);

      events.push({
        ...event,
        start: eventStart,
        end: eventEnd,
        originalSlug: event.slug,
        slug: `${event.slug}-${format(eventStart, "yyyy-MM-dd")}`,
        isRecurring: true,
        recurrenceDate: eventStart,
      });
    }
  } catch (error) {
    // Retourner au moins l'événement initial en cas d'erreur
    events.push({
      ...event,
      start: startDate,
      end: endDate,
      isRecurring: false,
    });
  }

  return events;
};

/**
 * Conversion des données du store vers le format FullCalendar
 */
const calendarEvents = computed(() => {
  const events: any[] = [];

  calendarStore.calendarData.forEach((event: any, index: number) => {
    try {
      // Utiliser le parsing correct des dates
      const startDate = parseDateTime(event.debut);
      const endDate = parseDateTime(event.fin);

      if (!startDate || !endDate) {
        console.warn("Dates manquantes pour:", event.title);
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
            title: evt.title,
            recurrence_type: evt.recurrence_type,
            recurrence_days: evt.recurrence_days,
            recurrence_end: evt.date_fin,
            isRecurring: evt.isRecurring || false,
            originalSlug: evt.originalSlug || evt.slug,
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

  // Amélioration de l'apparence
  dayHeaderClassNames: "font-semibold text-sm",
  dayCellClassNames: "hover:bg-gray-50 dark:hover:bg-gray-800",

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
  eventDisplay: "block",
  eventContent: (arg) => {
    // Personnalisation du contenu pour éviter le débordement
    const title = arg.event.title || "";
    const truncatedTitle =
      title.length > 20 ? title.substring(0, 20) + "..." : title;

    return {
      html: `
        <div class="fc-event-main-frame">
          <div class="fc-event-time">${arg.timeText || ""}</div>
          <div class="fc-event-title">${truncatedTitle}</div>
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
  nowIndicator: true,

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
  await calendarStore.loadAuthCalendar();
  showCalendar.value = true;
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
