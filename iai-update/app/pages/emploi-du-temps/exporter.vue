<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
    <!-- En-tête avec séparateur -->
    <div class="max-w-7xl mx-auto mb-8">
      <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-4">
          <div class="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-light text-gray-900 dark:text-white tracking-tight">Emplois du temps</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">Gestion des exports Excel</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{{ groupes.length }} groupes</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Carte principale -->
    <div class="max-w-4xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- En-tête carte avec gradient subtil -->
        <div class="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exporter un emploi du temps
          </h2>
        </div>

        <!-- Corps -->
        <div class="p-6">
          <!-- Formulaire -->
          <div class="space-y-5">
            <!-- Groupe avec Dropdown PrimeVue -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Groupe <span class="text-gray-400 text-xs">(obligatoire)</span>
              </label>
              <Dropdown
                v-model="form.group_id"
                :options="groupes"
                optionLabel="nom"
                optionValue="id"
                placeholder="Sélectionner un groupe"
                class="w-full md:w-96"
                :class="{ 'p-invalid': !form.group_id && submitted }"
                :showClear="true"
                filter
                filterPlaceholder="Rechercher un groupe..."
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{{ getGroupeNom(slotProps.value) }}</span>
                  </div>
                  <span v-else class="text-gray-400">{{ slotProps.placeholder }}</span>
                </template>

                <template #option="slotProps">
                  <div class="flex items-center gap-3 px-3 py-2">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ slotProps.option.nom }}</div>
                      <div v-if="slotProps.option.niveau" class="text-xs text-gray-500">
                        {{ slotProps.option.niveau?.libelle || '' }}
                      </div>
                    </div>
                  </div>
                </template>
              </Dropdown>
            </div>

            <!-- Semaine avec Calendar PrimeVue amélioré -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Semaine <span class="text-gray-400 text-xs">(optionnelle)</span>
              </label>
              <div class="flex flex-col sm:flex-row gap-3 items-start">
                <div class="relative w-full md:w-96">
                  <Calendar
                    v-model="form.semaineDate"
                    selectionMode="week"
                    :showIcon="true"
                    :showButtonBar="true"
                    placeholder="Choisir une semaine"
                    class="w-full"
                    dateFormat="yy/mm/dd"
                    :manualInput="false"
                    @date-select="onWeekSelect"
                  >
                    <template #header>
                      <div class="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Sélectionner une semaine</span>
                      </div>
                    </template>
                  </Calendar>
                </div>
                
                <!-- Affichage de la semaine sélectionnée -->
                <div v-if="form.semaineDisplay" class="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ form.semaineDisplay }}</span>
                  <button 
                    @click="clearWeek" 
                    class="ml-1 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                    title="Effacer"
                  >
                    <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <p class="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Laissez vide pour la semaine en cours
              </p>
            </div>
          </div>

          <!-- Message d'erreur -->
          <transition name="fade">
            <p v-if="!form.group_id && submitted" class="text-xs text-red-400 mt-4 flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              Veuillez sélectionner un groupe
            </p>
          </transition>

          <!-- Bouton d'export amélioré -->
          <div class="mt-8 flex justify-end">
            <button 
              @click="exporterEmploiDuTemps"
              :disabled="!form.group_id || calendarStore.isLoading"
              class="relative group px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white rounded-xl hover:from-gray-900 hover:to-gray-950 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow flex items-center gap-3 min-w-[200px] justify-center"
            >
              <!-- État de chargement -->
              <div v-if="calendarStore.isLoading" class="flex items-center gap-2">
                <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                  <path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Export en cours...</span>
              </div>

              <!-- État normal -->
              <div v-else class="flex items-center gap-3">
                <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span class="font-medium">Exporter le fichier</span>
                <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full">XLSX</span>
              </div>
            </button>
          </div>

          <!-- Séparateur -->
          <div class="my-6 border-t border-gray-100 dark:border-gray-800"></div>

          <!-- Format - version épurée -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-500 dark:text-gray-400">
            <div class="flex items-center gap-2">
              <div class="p-1 bg-gray-100 dark:bg-gray-800 rounded">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <span>Matrice hebdomadaire (lun-sam)</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="p-1 bg-gray-100 dark:bg-gray-800 rounded">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Créneaux de 2h (08h-23h)</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="p-1 bg-gray-100 dark:bg-gray-800 rounded">
                <div class="flex gap-1">
                  <span class="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></span>
                  <span class="w-3 h-3 bg-red-100 border border-red-200 rounded"></span>
                  <span class="w-3 h-3 bg-green-100 border border-green-200 rounded"></span>
                </div>
              </div>
              <span>Cours / Évaluation / Événement</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="p-1 bg-gray-100 dark:bg-gray-800 rounded">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <span>Cours multiples séparés par " / "</span>
            </div>
          </div>
        </div>

        <!-- Pied de carte -->
        <div class="bg-gray-50 dark:bg-gray-900/30 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between text-xs text-gray-400">
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                8 créneaux
              </span>
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Lundi - Samedi
              </span>
            </div>
            <span>© {{ new Date().getFullYear() }} · Gestion scolaire</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import { useCalendarStore } from '~~/stores/calendar'
import { useGroupeStore } from '~~/stores/group'

const { $toastr } = useNuxtApp()

const calendarStore = useCalendarStore()
const groupStore = useGroupeStore()
const groupes = ref([])
const submitted = ref(false)

const form = reactive({
  group_id: '',
  semaineDate: null,
  semaineDisplay: ''
})

// Obtenir le nom du groupe
const getGroupeNom = (id) => {
  const groupe = groupes.value.find(g => g.id === id)
  return groupe ? groupe.nom : ''
}

// Obtenir le numéro de semaine
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
}

// Formater la semaine pour l'affichage
const formatWeekDisplay = (date) => {
  const weekNum = getWeekNumber(date)
  const endOfWeek = new Date(date)
  endOfWeek.setDate(date.getDate() + 6)
  return `Semaine ${weekNum} · ${date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${endOfWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`
}

// Gérer la sélection de semaine
const onWeekSelect = (date) => {
  if (date) {
    form.semaineDisplay = formatWeekDisplay(date)
  } else {
    form.semaineDisplay = ''
  }
}

// Effacer la semaine sélectionnée
const clearWeek = () => {
  form.semaineDate = null
  form.semaineDisplay = ''
}

// Formater la semaine pour l'API
const getSemaineFormat = (date) => {
  if (!date) return ''
  const year = date.getFullYear()
  const week = getWeekNumber(date)
  return `${year}-W${week.toString().padStart(2, '0')}`
}

// Charger les groupes
const chargerGroupes = async () => {
  try {
    await groupStore.fetchGroupes()
    groupes.value = groupStore.groupes
  } catch (error) {
    console.error('Erreur chargement groupes:', error)
  }
}

// Exporter l'emploi du temps
const exporterEmploiDuTemps = async () => {
  submitted.value = true
  
  if (!form.group_id) {
    $toastr?.warning('Veuillez sélectionner un groupe')
    return
  }

  try {
    const params = { group_id: form.group_id }
    
    if (form.semaineDate) {
      params.semaine = getSemaineFormat(form.semaineDate)
    }

    const response = await calendarStore.exportCalendar(params)

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    
    const contentDisposition = response.headers['content-disposition']
    let filename = 'emploi_du_temps.xlsx'
    
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/)
      if (match && match[1]) filename = match[1]
    }
    
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    $toastr?.success('Export terminé')
    submitted.value = false
  } catch (error) {
    console.error('Erreur export:', error)
    $toastr?.error('Erreur lors de l\'export')
  }
}

watch(() => form.group_id, () => {
  if (form.group_id) submitted.value = false
})

onMounted(() => {
  chargerGroupes()
})
</script>

