<template>
  <div class="min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div class="max-w-7xl mx-auto">
      <!-- En-tête amélioré -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
            <svg class="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Mon emploi du temps
          </h1>
          <p class="text-gray-600 dark:text-gray-300">
            Consultez vos cours et évaluations en un clin d'œil
          </p>
        </div>
        
        <!-- Indicateur de chargement -->
        <div v-if="calendarStore.isLoading" class="flex items-center space-x-2 mt-4 md:mt-0">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          <span class="text-gray-600 dark:text-gray-300">Chargement...</span>
        </div>
      </div>

      <!-- Calendrier -->
      <ClientOnly>
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
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
                <DialogTitle class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <svg v-if="selectedEvent?.type === 'Évaluation'" class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg v-else class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {{ selectedEvent?.title || "Détails de l'événement" }}
                </DialogTitle>
                
                <!-- Badge type -->
                <span 
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    selectedEvent?.type === 'Évaluation' 
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
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
                    <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">UV / Matière</p>
                    <p class="font-medium text-gray-900 dark:text-white">{{ selectedEvent?.uv }}</p>
                  </div>
                </div>

                <!-- Date et heure -->
                <div class="flex items-start">
                  <div class="w-8 flex-shrink-0">
                    <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Date et heure</p>
                    <p class="font-medium text-gray-900 dark:text-white">{{ selectedEvent?.plageHoraire }}</p>
                  </div>
                </div>

                <!-- Salle -->
                <div class="flex items-start">
                  <div class="w-8 flex-shrink-0">
                    <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Salle</p>
                    <p class="font-medium text-gray-900 dark:text-white">{{ selectedEvent?.salle }}</p>
                  </div>
                </div>

                <!-- Enseignant -->
                <div class="flex items-start">
                  <div class="w-8 flex-shrink-0">
                    <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Enseignant</p>
                    <p class="font-medium text-gray-900 dark:text-white">{{ selectedEvent?.teacher }}</p>
                  </div>
                </div>

                <!-- Groupe -->
                <div class="flex items-start">
                  <div class="w-8 flex-shrink-0">
                    <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Groupe</p>
                    <p class="font-medium text-gray-900 dark:text-white">{{ selectedEvent?.group }}</p>
                  </div>
                </div>

                <!-- Récurrence -->
                <div v-if="selectedEvent?.recurrence_type && selectedEvent?.recurrence_type !== 'aucune'" class="flex items-start">
                  <div class="w-8 flex-shrink-0">
                    <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Récurrence</p>
                    <p class="font-medium text-gray-900 dark:text-white">{{ getRecurrenceText(selectedEvent) }}</p>
                  </div>
                </div>

                <!-- Détails supplémentaires -->
                <div v-if="selectedEvent?.details" class="flex items-start">
                  <div class="w-8 flex-shrink-0">
                    <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Description</p>
                    <p class="text-gray-700 dark:text-gray-300">{{ selectedEvent?.details }}</p>
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
import { RRule } from 'rrule';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import { Dialog, DialogPanel, DialogTitle, TransitionRoot } from "@headlessui/vue";

import { useCalendarStore } from "../../stores/calendar";

const calendarStore = useCalendarStore();
const calendarRef = ref();
const showCalendar = ref(false);
const showEventModal = ref(false);
const selectedEvent = ref<any>(null);

/**
 * 📅 Convertit les jours de récurrence en format RRule
 */
const convertRecurrenceDays = (daysString: string | null): number[] => {
  if (!daysString) return [];
  
  const dayMap: { [key: string]: number } = {
    'lundi': RRule.MO,
    'mardi': RRule.TU,
    'mercredi': RRule.WE,
    'jeudi': RRule.TH,
    'vendredi': RRule.FR,
    'samedi': RRule.SA,
    'dimanche': RRule.SU
  };
  
  return daysString
    .split(',')
    .map(day => dayMap[day.trim().toLowerCase()])
    .filter(day => day !== undefined);
};

/**
 * 🔄 Génère les dates récurrentes pour un événement
 */
const generateRecurringEvents = (event: any, startDate: Date, endDate: Date): any[] => {
  if (!event.recurrence_type || event.recurrence_type === 'aucune') {
    return [{
      ...event,
      start: startDate,
      end: endDate
    }];
  }

  const events = [];
  const duration = endDate.getTime() - startDate.getTime();
  
  // Configuration de la règle de récurrence
  const ruleOptions: any = {
    dtstart: startDate,
    freq: RRule.WEEKLY
  };

  // Définir les jours spécifiques pour la récurrence
  if (event.recurrence_days) {
    const byweekday = convertRecurrenceDays(event.recurrence_days);
    if (byweekday.length > 0) {
      ruleOptions.byweekday = byweekday;
    }
  }

  // Limiter à 52 occurrences maximum pour éviter les performances
  ruleOptions.count = 52;

  const rule = new RRule(ruleOptions);
  const dates = rule.all();

  // Créer un événement pour chaque date de récurrence
  for (const date of dates) {
    const eventStart = new Date(date);
    const eventEnd = new Date(eventStart.getTime() + duration);
    
    events.push({
      ...event,
      start: eventStart,
      end: eventEnd,
      originalSlug: event.slug,
      slug: `${event.slug}-${format(eventStart, 'yyyy-MM-dd')}`,
      isRecurring: true,
      recurrenceDate: eventStart
    });
  }

  return events;
};

/**
 * 🔁 Conversion des données du store vers le format FullCalendar
 */
const calendarEvents = computed(() => {
  const events: any[] = [];
  
  calendarStore.calendarData.forEach((event: any) => {
    try {
      const startDate = event.debut ? new Date(event.debut.replace(" ", "T")) : null;
      const endDate = event.fin ? new Date(event.fin.replace(" ", "T")) : null;
      
      if (!startDate || !endDate) return;
      
      // Gérer les événements récurrents
      const recurringEvents = generateRecurringEvents(event, startDate, endDate);
      
      recurringEvents.forEach((evt: any) => {
        events.push({
          id: evt.slug,
          title: evt.title,
          start: evt.start,
          end: evt.end,
          
          // Amélioration des couleurs avec styles conditionnels
          backgroundColor: getEventColor(evt.type, evt.color),
          borderColor: 'transparent',
          
          // Styles CSS personnalisés
          classNames: [
            'calendar-event',
            evt.type === "Évaluation" ? 'event-evaluation' : 'event-cours',
            evt.isRecurring ? 'event-recurring' : '',
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
            isRecurring: evt.isRecurring || false,
            originalSlug: evt.originalSlug || evt.slug
          },
        });
      });
    } catch (error) {
      console.error('Erreur lors du traitement de l\'événement:', event, error);
    }
  });
  
  return events;
});

/**
 * 🎨 Obtient la couleur de l'événement
 */
const getEventColor = (type: string, color: string | undefined) => {
  if (color) return color;
  
  return type === "Évaluation" 
    ? "#f97316" // Orange
    : "#3b82f6"; // Bleu
};

/**
 * ⏰ Formate l'heure de l'événement
 */
const formatEventTime = (start: Date, end: Date): string => {
  try {
    return `${format(start, 'dd MMMM yyyy HH:mm', { locale: fr })} à ${format(end, 'HH:mm', { locale: fr })}`;
  } catch {
    return `${start.toLocaleDateString('fr-FR')} ${start.toLocaleTimeString('fr-FR')}`;
  }
};

/**
 * 🔄 Texte de récurrence
 */
const getRecurrenceText = (event: any): string => {
  if (!event.recurrence_type || event.recurrence_type === 'aucune') {
    return 'Pas de récurrence';
  }
  
  const typeMap: { [key: string]: string } = {
    'quotidien': 'Tous les jours',
    'hebdomadaire': 'Toutes les semaines',
    'mensuel': 'Tous les mois',
    'annuel': 'Tous les ans'
  };
  
  let text = typeMap[event.recurrence_type] || event.recurrence_type;
  
  if (event.recurrence_days) {
    const days = event.recurrence_days.split(',').map((d: string) => d.trim());
    text += ` (${days.join(', ')})`;
  }
  
  return text;
};

/**
 * ⚙️ Configuration FullCalendar améliorée
 */
const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    listPlugin,
    interactionPlugin,
  ],

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
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    meridiem: false
  },

  // Événements dynamiques
  events: (info, successCallback) => {
    successCallback(calendarEvents.value);
  },

  nowIndicator: true,
  dayMaxEvents: true,
  dayMaxEventRows: 3,
  navLinks: true,
  navLinkDayClick: 'timeGridDay',
  
  // Amélioration de l'apparence
  dayHeaderClassNames: 'font-semibold text-sm',
  dayCellClassNames: 'hover:bg-gray-50 dark:hover:bg-gray-800',
  
  // Gestion des clics sur événements
  eventClick: (info: any) => {
    selectedEvent.value = info.event.extendedProps;
    showEventModal.value = true;
  },
  
  // Formatage des événements
  eventTimeFormat: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    meridiem: false
  },
  
  // Gestion de l'affichage des événements
  eventDisplay: 'block',
  eventContent: (arg) => {
    // Personnalisation du contenu pour éviter le débordement
    const title = arg.event.title || '';
    const truncatedTitle = title.length > 20 ? title.substring(0, 20) + '...' : title;
    
    return {
      html: `
        <div class="fc-event-main-frame">
          <div class="fc-event-time">${arg.timeText || ''}</div>
          <div class="fc-event-title">${truncatedTitle}</div>
        </div>
      `
    };
  },
  
  // Configuration des vues
  views: {
    timeGridWeek: {
      dayHeaderFormat: { weekday: 'long', day: 'numeric', month: 'short' },
      slotMinTime: '07:00:00',
      slotMaxTime: '22:00:00'
    },
    timeGridDay: {
      dayHeaderFormat: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
      slotMinTime: '07:00:00',
      slotMaxTime: '22:00:00'
    },
    dayGridMonth: {
      dayMaxEvents: 3,
      dayMaxEventRows: 3
    },
    listWeek: {
      listDayFormat: { 
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      },
      listDaySideFormat: false,
      noEventsContent: 'Aucun événement cette semaine',
      eventContent: (arg) => {
        const eventType = arg.event.extendedProps.type || 'Cours';
        return {
          html: `
            <div class="flex items-center">
              <div class="fc-list-event-dot" style="background: ${arg.event.backgroundColor}"></div>
              <div class="fc-list-event-title" data-event-type="${eventType}">
                ${arg.event.title}
              </div>
            </div>
          `
        };
      }
    }
  },
  
  // Affichage du jour actuel
  nowIndicator: true,
  
  // Gestion de la hauteur
  contentHeight: 'auto',
  
  // Configuration responsive
  windowResize: (view: any) => {
    if (window.innerWidth < 768) {
      view.calendar.changeView('timeGridDay');
    }
  },
}));

/**
 * 🚀 Chargement des données
 */
onMounted(async () => {
  console.log("🔄 Chargement du calendrier...");
  await calendarStore.loadAuthCalendar();
  showCalendar.value = true;
  console.log("✅ Calendrier chargé:", calendarStore.calendarData.length, "événements");
});

/**
 * 🔍 Watch pour suivre les changements
 */
watch(
  () => calendarStore.calendarData,
  (newData) => {
    console.log("📅 Données mises à jour:", newData.length, "événements");
    
    if (calendarRef.value?.getApi) {
      const calendarApi = calendarRef.value.getApi();
      calendarApi.refetchEvents();
    }
  },
  { deep: true }
);

/**
 * 🎯 Fonctions pour la modale
 */
const closeEventModal = () => {
  showEventModal.value = false;
  selectedEvent.value = null;
};
</script>

<style>
/* Styles personnalisés pour FullCalendar */
.fc {
  --fc-border-color: #e5e7eb;
  --fc-button-bg-color: transparent;
  --fc-button-border-color: #d1d5db;
  --fc-button-text-color: #4b5563;
  --fc-button-hover-bg-color: #f3f4f6;
  --fc-button-hover-border-color: #d1d5db;
  --fc-button-active-bg-color: #4680FF;
  --fc-button-active-border-color:  #4680FF;
  --fc-button-active-text-color:  #ECF2FF;
  --fc-today-bg-color:  #ECF2FF;
  --fc-event-border-color: transparent;
  --fc-event-text-color: #ffffff;
  --fc-page-bg-color: transparent;
  --fc-neutral-bg-color: transparent;
  --fc-neutral-text-color:  #ECF2FF;
  --fc-list-event-hover-bg-color:  #ECF2FF;
  --fc-more-link-bg-color:  #ECF2FF;
  --fc-more-link-text-color:  #ECF2FF;
}

.dark .fc {
  --fc-border-color:  #ECF2FF;
  --fc-button-border-color:  #ECF2FF;
  --fc-button-text-color:  #ECF2FF;
  --fc-button-hover-bg-color:  #ECF2FF;
  --fc-button-hover-border-color:  #ECF2FF;
  --fc-button-active-bg-color: #3b82f6;
  --fc-button-active-border-color: #3b82f6;
  --fc-today-bg-color:  #ECF2FF;
  --fc-page-bg-color: transparent;
  --fc-neutral-bg-color: transparent;
  --fc-neutral-text-color:  #ECF2FF;
  --fc-list-event-hover-bg-color:  #ECF2FF;
  --fc-more-link-bg-color:  #ECF2FF;
  --fc-more-link-text-color:  #ECF2FF;
}

/* Header du calendrier */
.fc .fc-toolbar {
  padding: 1.5rem;
  margin-bottom: 0;
  border-bottom: 1px solid var(--fc-border-color);
}

.fc .fc-toolbar-title {
  font-size:1.2rem;
  font-weight: 700;
  color: #111827;
  text-transform: capitalize;
}

.dark .fc .fc-toolbar-title {
  color: #f9fafb;
}

/* Boutons */
.fc .fc-button {
  padding: 0.5rem 1rem;
  font-weight: 500;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  color:#4680FF;
  background: #ECF2FF;
}

.fc .fc-button-primary:not(:disabled).fc-button-active,
.fc .fc-button-primary:not(:disabled):active {
  color:#ECF2FF;
  background: #4680FF;
}

/* Header des jours */
.fc .fc-col-header-cell {
  padding: 0.75rem 0;
  background-color: #f9fafb;
  border-color: var(--fc-border-color);
}

.dark .fc .fc-col-header-cell {
  background-color: #1f2937;
}

.fc .fc-col-header-cell-cushion {
  font-weight: 600;
  color: #4b5563;
  font-size: 0.875rem;
}

.dark .fc .fc-col-header-cell-cushion {
  color: #d1d5db;
}

/* Cellules des jours */
.fc .fc-daygrid-day {
  padding: 0.1rem;
  transition: background-color 0.2s ease;
  min-height: 100px;
}

.fc .fc-daygrid-day.fc-day-today {
  background:#E6FEFE ;
}

/* Événements - CORRECTION DE L'AFFICHAGE */
.calendar-event {
  border-radius: 0.5rem !important;
  padding: 0.4rem 0.5rem !important;
  margin: 0.125rem 0.25rem !important;
  font-weight: 500;
  font-size: 0.8rem !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
  border: none !important;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  max-height: 50px !important;
  display: flex !important;
  align-items: center !important;
}

.calendar-event:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
  opacity: 0.95;
}

.event-evaluation {
  background: #EAF6F2 !important;
  border:1.2px solid #2DA980 !important;
  color:#2DA980 !important;
}

.event-cours {
  background: #ECFAFB !important;
  border:1px solid #3EC9D6 !important;
}

.event-recurring::after {
  content: "↻";
  margin-left: 4px;
  font-size: 0.7em;
  opacity: 0.8;
}

/* Contenu des événements */
.fc-event-main-frame {
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
  overflow: hidden !important;
  width: 100% !important;
}

.fc-event-time {
  font-weight: bold !important;
  font-size: 0.7em !important;
  flex-shrink: 0 !important;
  color:#2DA980 !important;
}

.fc-event-title {
  flex: 1 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  font-size: 0.8em !important;
  color:#2DA980 !important;
}

/* Indicateur "maintenant" */
.fc-now-indicator-line {
  background-color: #3b82f6;
  height: 2px;
}

/* Indicateur "+X plus" */
.fc-daygrid-more-link {
  font-size: 0.75rem !important;
  padding: 0.125rem 0.25rem !important;
  border-radius: 0.25rem !important;
  background-color: var(--fc-more-link-bg-color) !important;
  color: var(--fc-more-link-text-color) !important;
  margin-top: 0.25rem !important;
}

/* 📝 STYLES POUR LA VUE LISTE - AMÉLIORATIONS */

/* Conteneur principal de la vue liste */
.fc-list-view {
  border: none !important;
  background: transparent !important;
  border-radius: 12px !important;
}

/* En-tête de la vue liste */
.fc-list-table {
  width: 100% !important;
  border-collapse: separate !important;
  border-spacing: 0 8px !important;
}

/* En-têtes de colonnes */
.fc-list-table th {
  padding: 12px 16px !important;
  background: #f8fafc !important;
  border: none !important;
  font-weight: 600 !important;
  color: #475569 !important;
  font-size: 0.875rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
}

.dark .fc-list-table th {
  background: #1e293b !important;
  color: #cbd5e1 !important;
}

/* Ligne d'événement */
.fc-list-event {
  background: white !important;
  border: none !important;
  border-radius: 10px !important;
  margin-bottom: 8px !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.2s ease !important;
  cursor: pointer !important;
}

.dark .fc-list-event {
  background: #1f2937 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
}

.fc-list-event:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
}

.dark .fc-list-event:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3) !important;
}

/* Cellules des événements */
.fc-list-event td {
  padding: 16px !important;
  border: none !important;
  vertical-align: middle !important;
}

/* Colonne DATE (la première) */
.fc-list-event-time {
  font-weight: 600 !important;
  color: #2DA980 !important;
  font-size: 0.9rem !important;
  min-width: 120px !important;
  background: #EAF6F2 !important;
  border-radius: 8px 0 0 8px !important;
  border-right: 2px solid #2DA980 !important;
}

.dark .fc-list-event-time {
  background: rgba(45, 169, 128, 0.2) !important;
  color: #2DA980 !important;
}

/* Colonne TITRE */
.fc-list-event-title {
  font-weight: 600 !important;
  color: #1e293b !important;
  font-size: 1rem !important;
  padding-left: 24px !important;
}

.dark .fc-list-event-title {
  color: #f1f5f9 !important;
}

/* Indicateur d'événement (le point coloré) */
.fc-list-event-dot {
  width: 10px !important;
  height: 10px !important;
  border-radius: 50% !important;
  margin-right: 12px !important;
  margin-top: -2px !important;
}

/* Espacement entre les lignes */
.fc-list-table .fc-list-event:not(:last-child) {
  margin-bottom: 12px !important;
}

/* Badge de type dans la liste */
.fc-list-event-title[data-event-type="Évaluation"]::before {
  content: "Évaluation";
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 12px;
  vertical-align: middle;
  background: #EAF6F2;
  color: #2DA980;
  border: 1px solid #2DA980;
}

.fc-list-event-title[data-event-type="Cours"]::before {
  content: "Cours";
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 12px;
  vertical-align: middle;
  background: #ECFAFB;
  color: #3EC9D6;
  border: 1px solid #3EC9D6;
}

/* Liste d'événements */
.fc-list-event {
  border-radius: 0.5rem !important;
  margin-bottom: 0.5rem !important;
  transition: background-color 0.2s ease !important;
  padding: 0.5rem !important;
}

.fc-list-event:hover {
  background-color: var(--fc-list-event-hover-bg-color) !important;
}

/* Vue mois - ajustements */
.fc-daygrid-day-frame {
  min-height: 100px !important;
}

.fc-daygrid-day-events {
  margin: 0 !important;
  min-height: 24px !important;
}

/* Responsive */
@media (max-width: 768px) {
  .fc .fc-toolbar {
    flex-direction: column !important;
    gap: 1rem !important;
    padding: 1rem !important;
  }
  
  .fc .fc-toolbar-title {
    font-size: 1.25rem !important;
  }
  
  .fc .fc-button {
    padding: 0.375rem 0.75rem !important;
    font-size: 0.875rem !important;
  }
  
  .calendar-event {
    font-size: 0.7rem !important;
    padding: 0.125rem 0.25rem !important;
    max-height: 24px !important;
  }
  
  .fc-daygrid-day {
    min-height: 80px !important;
  }
  
  .fc-daygrid-day-frame {
    min-height: 80px !important;
  }
  
  /* Ajustements pour la vue liste sur mobile */
  .fc-list-table th {
    padding: 10px !important;
    font-size: 0.75rem !important;
  }
  
  .fc-list-event td {
    padding: 12px !important;
  }
  
  .fc-list-event-time {
    min-width: 100px !important;
    font-size: 0.8rem !important;
  }
  
  .fc-list-event-title {
    font-size: 0.9rem !important;
    padding-left: 16px !important;
  }
  
  /* Masquer certains éléments sur mobile pour gagner de l'espace */
  .fc-list-event-title[data-event-type]::before {
    display: block !important;
    margin-bottom: 4px !important;
    margin-right: 0 !important;
    width: fit-content !important;
  }
}

/* Pour les très petits écrans */
@media (max-width: 480px) {
  .fc .fc-view {
    font-size: 0.875rem !important;
  }
  
  .fc .fc-col-header-cell-cushion {
    font-size: 0.75rem !important;
    padding: 0.5rem 0.25rem !important;
  }
  
  .fc-daygrid-day {
    min-height: 70px !important;
  }
  
  .fc-daygrid-day-frame {
    min-height: 70px !important;
  }
  
  .calendar-event {
    font-size: 0.65rem !important;
    max-height: 22px !important;
  }
  
  /* Pour la vue liste sur très petits écrans */
  .fc-list-view {
    font-size: 0.875rem !important;
  }
  
  .fc-list-table th {
    padding: 8px !important;
  }
  
  .fc-list-event td {
    padding: 10px !important;
  }
  
  .fc-list-event-time {
    min-width: 90px !important;
    font-size: 0.75rem !important;
    padding: 10px 8px !important;
  }
  
  .fc-list-event-title {
    font-size: 0.85rem !important;
    padding-left: 12px !important;
  }
}

/* Animation de survol pour la vue liste */
@keyframes listEventHover {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-1px);
  }
}

.fc-list-event:hover {
  animation: listEventHover 0.2s ease forwards;
}
</style>