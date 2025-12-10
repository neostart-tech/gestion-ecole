<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Calendrier Professionnel
        </h1>
        <p class="text-gray-600">
          Gérez vos événements et réunions en toute simplicité
        </p>
      </div>

      <!-- Calendar Container -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300">
        <!-- Calendar Toolbar -->
        <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
          <div class="flex flex-col md:flex-row md:items-center justify-between">
            <div class="mb-4 md:mb-0">
              <h2 class="text-xl font-semibold text-gray-800">Calendrier</h2>
              <p class="text-sm text-gray-500">{{ currentMonth }}</p>
            </div>
            
            <div class="flex flex-wrap gap-3">
              <button @click="handleCreateEvent" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Nouvel événement
              </button>
              
              <div class="flex bg-gray-50 rounded-lg p-1">
                <button 
                  v-for="view in viewTypes" 
                  :key="view.value"
                  @click="changeView(view.value)"
                  :class="[
                    'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
                    calendarView === view.value 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  ]"
                >
                  {{ view.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Calendar -->
        <div class="p-4 md:p-6">
          <ClientOnly>
            <div v-if="showCalendar">
              <FullCalendar
                ref="calendarRef"
                :options="calendarOptions"
                class="custom-calendar"
              />
            </div>
            <div v-else class="space-y-4 animate-pulse">
              <div class="h-8 bg-gray-200 rounded w-1/4"></div>
              <div class="grid grid-cols-7 gap-2">
                <div v-for="i in 7" :key="i" class="h-8 bg-gray-100 rounded"></div>
              </div>
              <div class="grid grid-cols-7 gap-2">
                <div v-for="i in 42" :key="i" class="h-20 bg-gray-50 rounded"></div>
              </div>
            </div>
          </ClientOnly>
        </div>
      </div>

      <!-- Upcoming Events -->
      <div class="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Événements à venir</h3>
        <div class="space-y-4">
          <div v-for="event in upcomingEvents" :key="event.id" class="flex items-center p-4 rounded-lg border border-gray-100 hover:bg-blue-50 transition-colors duration-200">
            <div :class="['w-3 h-12 rounded-full', event.color]"></div>
            <div class="ml-4 flex-1">
              <h4 class="font-medium text-gray-800">{{ event.title }}</h4>
              <div class="flex items-center text-sm text-gray-500 mt-1">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ event.date }}
                <span class="mx-2">•</span>
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ event.time }}
              </div>
            </div>
            <div class="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
              {{ event.type }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// VERSION SIMPLIFIÉE - Import direct des plugins
let FullCalendar: any = null
let dayGridPlugin: any = null
let timeGridPlugin: any = null
let listPlugin: any = null
let interactionPlugin: any = null
let frLocale: any = null

const showCalendar = ref(false)
const calendarRef = ref()
const calendarView = ref("dayGridMonth")

const currentMonth = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
})

const viewTypes = [
  { label: "Jour", value: "timeGridDay" },
  { label: "Semaine", value: "timeGridWeek" },
  { label: "Mois", value: "dayGridMonth" },
  { label: "Liste", value: "listWeek" },
]

const upcomingEvents = [
  {
    id: 1,
    title: "Réunion d'équipe marketing",
    date: "15 Jan 2025",
    time: "09:00 - 10:30",
    type: "Réunion",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Présentation client",
    date: "16 Jan 2025",
    time: "14:00 - 15:30",
    type: "Présentation",
    color: "bg-green-500",
  },
  {
    id: 3,
    title: "Revue trimestrielle",
    date: "18 Jan 2025",
    time: "11:00 - 12:30",
    type: "Revue",
    color: "bg-purple-500",
  },
]

// Charger FullCalendar côté client seulement
onMounted(async () => {
  if (process.client) {
    try {
      // Importer FullCalendar et ses plugins
      const fullCalendarModule = await import('@fullcalendar/vue3')
      FullCalendar = fullCalendarModule.FullCalendar
      
      const dayGridModule = await import('@fullcalendar/daygrid')
      dayGridPlugin = dayGridModule.default
      
      const timeGridModule = await import('@fullcalendar/timegrid')
      timeGridPlugin = timeGridModule.default
      
      const listModule = await import('@fullcalendar/list')
      listPlugin = listModule.default
      
      const interactionModule = await import('@fullcalendar/interaction')
      interactionPlugin = interactionModule.default
      
      const localeModule = await import('@fullcalendar/core/locales/fr')
      frLocale = localeModule.default
      
      showCalendar.value = true
    } catch (error) {
      console.error('Erreur lors du chargement de FullCalendar:', error)
    }
  }
})

// Configuration du calendrier
const calendarOptions = computed(() => {
  if (!showCalendar.value) return {}
  
  return {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    initialView: calendarView.value,
    locale: frLocale,
    initialDate: '2025-01-01',
    height: 'auto',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    
    events: [
      {
        title: "Réunion Marketing",
        date: "2025-01-10",
        backgroundColor: "#3b82f6",
        borderColor: "#2563eb",
      },
      {
        title: "Présentation Client",
        date: "2025-01-14",
        backgroundColor: "#10b981",
        borderColor: "#059669",
      },
      {
        title: "Formation Technique",
        start: "2025-01-20",
        end: "2025-01-21",
        backgroundColor: "#f59e0b",
        borderColor: "#d97706",
      },
      {
        title: "Réunion Produit",
        date: "2025-01-22",
        backgroundColor: "#06b6d4",
        borderColor: "#0891b2",
      },
      {
        title: "Conférence",
        start: "2025-01-25",
        end: "2025-01-26",
        backgroundColor: "#8b5cf6",
        borderColor: "#7c3aed",
      },
    ],
    
    selectable: true,
    editable: true,
    nowIndicator: true,
    dayMaxEvents: true,
    
    dateClick: (info: any) => {
      console.log('Date cliquée:', info.dateStr)
      alert(`Date cliquée: ${info.dateStr}`)
    },
    
    eventClick: (info: any) => {
      console.log('Événement cliqué:', info.event.title)
      alert(`Événement: ${info.event.title}`)
    },
    
    // Personnalisation
    eventColor: '#3b82f6',
    eventBackgroundColor: '#3b82f6',
    eventTextColor: '#ffffff',
  }
})

function changeView(view: string) {
  calendarView.value = view
  if (calendarRef.value?.getApi) {
    try {
      const calendarApi = calendarRef.value.getApi()
      calendarApi.changeView(view)
    } catch (error) {
      console.error('Erreur lors du changement de vue:', error)
    }
  }
}

function handleCreateEvent() {
  alert("Fonctionnalité: Créer un nouvel événement")
}
</script>

<style>
/* Styles globaux pour FullCalendar */
.custom-calendar {
  width: 100%;
  min-height: 600px;
}

.fc {
  --fc-border-color: #e5e7eb;
  --fc-button-bg-color: #3b82f6;
  --fc-button-border-color: #3b82f6;
  --fc-button-hover-bg-color: #2563eb;
  --fc-button-active-bg-color: #1d4ed8;
  --fc-button-text-color: white;
  --fc-today-bg-color: #eff6ff;
  --fc-page-bg-color: white;
}

.fc .fc-toolbar-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.fc .fc-button {
  border-radius: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-weight: 500;
  font-size: 0.875rem;
}

.fc .fc-daygrid-day-frame {
  min-height: 100px;
  padding: 4px;
}

.fc .fc-event {
  border-radius: 0.25rem;
  border: none;
  padding: 2px 6px;
  margin: 1px;
  font-size: 0.75rem;
  font-weight: 500;
}

.fc .fc-day-today {
  background-color: #eff6ff !important;
}

.fc .fc-daygrid-day-number {
  font-weight: 500;
  color: #374151;
  padding: 4px;
  font-size: 0.875rem;
}

.fc .fc-col-header-cell {
  background-color: #f9fafb;
  padding: 12px 4px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  font-size: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
}

.fc .fc-daygrid-day {
  border: 1px solid #e5e7eb;
}

.fc .fc-daygrid-day:hover {
  background-color: #f9fafb;
}

.fc .fc-daygrid-more-link {
  color: #3b82f6;
  font-weight: 500;
}

.fc .fc-timegrid-slot {
  height: 2.5em;
  border-color: #e5e7eb;
}

.fc .fc-list-event:hover td {
  background-color: #f3f4f6;
}
</style>