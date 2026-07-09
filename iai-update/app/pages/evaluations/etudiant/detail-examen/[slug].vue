<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <Breadcrumb
      :items="[
        { label: 'Examens', to: '/' },
        { label: 'Mes examens', to: '/evaluations/etudiant/mes-examens' },
        { label: 'Détail', to: null },
      ]"
      title="Détail de l'examen"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="h-12 w-12 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
    </div>

    <!-- Not found -->
    <div v-else-if="!exam" class="text-center py-20">
      <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-gray-500 dark:text-gray-400 text-lg">Examen introuvable</p>
      <NuxtLink to="/evaluations/etudiant/mes-examens" class="mt-4 inline-block text-indigo-600 hover:underline">
        Retour à la liste
      </NuxtLink>
    </div>

    <template v-else>
      <!-- Hero header -->
      <div class="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl shadow-xl mb-6 p-6 sm:p-8">
        <!-- Background pattern -->
        <div class="absolute inset-0 opacity-10">
          <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="80" cy="20" r="40" fill="white" />
            <circle cx="10" cy="80" r="30" fill="white" />
          </svg>
        </div>

        <div class="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span class="text-white/70 text-sm font-medium uppercase tracking-wide">{{ exam.type }}</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-bold text-white mb-1">
              {{ exam.matiere?.nom || 'Examen' }}
            </h1>
            <p class="text-indigo-200 text-sm">
              Code : {{ exam.matiere?.code || '—' }}
            </p>
          </div>

          <div class="flex flex-col items-start sm:items-end gap-3">
            <span
              class="px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm"
              :class="getStatusBadgeClass(exam.status)"
            >
              {{ exam.status }}
            </span>
            <NuxtLink
              to="/evaluations/etudiant/mes-examens"
              class="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg transition-colors backdrop-blur-sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Retour
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Info grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <!-- Groupe -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Groupe</p>
          </div>
          <p class="text-lg font-bold text-gray-900 dark:text-white">
            {{ exam.group?.niveau?.libelle || '' }} {{ exam.group?.nom || 'Non spécifié' }}
          </p>
        </div>

        <!-- Salle -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Salle</p>
          </div>
          <p class="text-lg font-bold text-gray-900 dark:text-white">
            {{ exam.salle?.nom || 'Non spécifiée' }}
          </p>
        </div>

        <!-- Durée -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Durée</p>
          </div>
          <p class="text-lg font-bold text-gray-900 dark:text-white">
            {{ formatDuration(exam.duration_minutes) }}
          </p>
        </div>

        <!-- Professeur(s) -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sm:col-span-2 lg:col-span-3">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Professeur(s)</p>
          </div>
          <div v-if="profs.length" class="flex flex-wrap gap-3">
            <div
              v-for="prof in profs"
              :key="prof.id"
              class="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30"
            >
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {{ (prof.nom || '?')[0] }}{{ (prof.prenom || prof.prenoms || '')[0] }}
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ prof.nom }} {{ prof.prenoms || prof.prenom }}
              </span>
            </div>
          </div>
          <p v-else class="text-sm text-gray-500 dark:text-gray-400">Non assigné</p>
        </div>
      </div>

      <!-- Date & Heure -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 mb-6">
        <div class="flex items-center gap-3 mb-5">
          <div class="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
            <svg class="w-5 h-5 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Date et horaire</h3>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="text-center p-4 bg-rose-50 dark:bg-rose-900/10 rounded-xl border border-rose-100 dark:border-rose-800/30">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Date</p>
            <p class="text-xl font-bold text-rose-600 dark:text-rose-400">{{ formatDate(exam.date) }}</p>
          </div>
          <div class="text-center p-4 bg-rose-50 dark:bg-rose-900/10 rounded-xl border border-rose-100 dark:border-rose-800/30">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Début</p>
            <p class="text-xl font-bold text-rose-600 dark:text-rose-400">{{ formatTime(exam.debut) }}</p>
          </div>
          <div class="text-center p-4 bg-rose-50 dark:bg-rose-900/10 rounded-xl border border-rose-100 dark:border-rose-800/30">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Fin</p>
            <p class="text-xl font-bold text-rose-600 dark:text-rose-400">{{ formatTime(exam.fin) }}</p>
          </div>
        </div>
      </div>

      <!-- Action button -->
      <div class="flex justify-end gap-3">
        <NuxtLink
          to="/evaluations/etudiant/mes-examens"
          class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Retour à la liste
        </NuxtLink>

        <NuxtLink
          v-if="exam.is_online === 1 && exam.status === 'En cours'"
          :to="`/evaluations/examen-en-ligne/${exam.slug}/passer-un-examen`"
          class="px-6 py-2.5 text-sm font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 shadow-md shadow-green-200 dark:shadow-none"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Composer l'examen
        </NuxtLink>

        <span
          v-else-if="exam.is_online === 1 && exam.status === 'En attente'"
          class="px-6 py-2.5 text-sm font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-xl flex items-center gap-2 cursor-not-allowed"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pas encore commencé
        </span>

        <span
          v-else-if="exam.is_online === 1 && exam.status === 'Terminée'"
          class="px-6 py-2.5 text-sm font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Examen terminé
        </span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumb from '~/components/Breadcrumb.vue'
import { useEvaluationStore } from '~~/stores/evaluations'

const route = useRoute()
const evaluationStore = useEvaluationStore()
const loading = ref(true)

const exam = computed(() =>
  evaluationStore.evaluations.find(e => e.slug === route.params.slug) ?? null
)

const profs = computed(() => {
  if (!exam.value) return []
  // Les profs peuvent être sur matiere.user ou directement sur user
  const fromMatiere = exam.value.matiere?.user
  const fromExam = exam.value.user
  const list = (fromMatiere?.length ? fromMatiere : fromExam) ?? []
  return list
})

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

const formatTime = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const formatDuration = (minutes) => {
  if (!minutes) return 'Non défini'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h${m > 0 ? m + 'min' : ''}` : `${m}min`
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'En attente': return 'bg-amber-100 text-amber-800'
    case 'En cours':   return 'bg-green-100 text-green-800'
    case 'Terminée':   return 'bg-blue-100 text-blue-800'
    default:           return 'bg-gray-100 text-gray-800'
  }
}

onMounted(async () => {
  if (!evaluationStore.evaluations.length) {
    await evaluationStore.fetchEvaluationsForStudent()
  }
  loading.value = false
})
</script>
