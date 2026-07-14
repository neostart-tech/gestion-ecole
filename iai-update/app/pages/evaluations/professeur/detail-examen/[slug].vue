<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Evaluations', to: '/' },
        { label: 'Mes examens', to: '/evaluations/professeur/mes-examens' },
        { label: 'Détails', to: null },
      ]"
      title="Détails de l'évaluation"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-6"
    />

    <div v-if="loading" class="flex justify-center py-10">
      <div class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
    </div>

    <div v-else-if="!selectedEvent" class="text-center py-10">
      <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-gray-500 dark:text-gray-400">Évaluation introuvable</p>
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sm:p-8">
      <!-- En-tête -->
      <div class="flex items-start justify-between mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {{ selectedEvent?.type || "Évaluation" }}
            </h1>
            <p class="text-sm font-medium">
              <span :class="getStatusClass(selectedEvent?.status)">
                {{ selectedEvent?.status || "Non défini" }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="space-y-6">
        <!-- Section Informations principales -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Type -->
          <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-purple-100 dark:bg-purple-800/30 rounded-lg">
                <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-700 dark:text-gray-300">Type</h3>
            </div>
            <div class="ml-11">
              <span
                :class="[
                  selectedEvent.type === 'Examen'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
                  'px-3 py-1 rounded-full text-sm font-medium',
                ]"
              >
                {{ selectedEvent.type }}
              </span>
            </div>
          </div>

          <!-- Groupe -->
          <div class="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-emerald-100 dark:bg-emerald-800/30 rounded-lg">
                <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-700 dark:text-gray-300">Groupe</h3>
            </div>
            <div class="ml-11">
              <p class="text-lg font-medium text-gray-900 dark:text-white">
                {{ selectedEvent.group?.nom || "Non spécifié" }}
              </p>
              <p v-if="selectedEvent.group?.niveau" class="text-sm text-gray-500 dark:text-gray-400">
                Niveau: {{ selectedEvent.group.niveau.libelle }}
              </p>
            </div>
          </div>

          <!-- Salle -->
          <div class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-amber-100 dark:bg-amber-800/30 rounded-lg">
                <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-700 dark:text-gray-300">Salle</h3>
            </div>
            <div class="ml-11">
              <p class="text-lg font-medium text-gray-900 dark:text-white">
                {{ selectedEvent.salle?.nom || "Non spécifiée" }}
              </p>
              <p v-if="selectedEvent.salle?.effectif" class="text-sm text-gray-500 dark:text-gray-400">
                Capacité: {{ selectedEvent.salle.effectif }} places
              </p>
            </div>
          </div>

          <!-- Durée -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-700 dark:text-gray-300">Durée</h3>
            </div>
            <div class="ml-11">
              <p class="text-lg font-medium text-gray-900 dark:text-white">
                {{ formatDuration(selectedEvent.duration_minutes) }}
              </p>
            </div>
          </div>

          <!-- Professeur(s) -->
          <div class="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-indigo-100 dark:bg-indigo-800/30 rounded-lg">
                <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-700 dark:text-gray-300">Professeur(s)</h3>
            </div>
            <div class="ml-11">
              <div v-if="selectedEvent.matiere?.user && selectedEvent.matiere.user.length > 0">
                <p v-for="prof in selectedEvent.matiere.user" :key="prof.id" class="text-base font-medium text-gray-900 dark:text-white mb-1">
                  {{ prof.nom }} {{ prof.prenoms || prof.prenom }}
                </p>
              </div>
              <p v-else class="text-base text-gray-500 dark:text-gray-400">
                Non assigné
              </p>
            </div>
          </div>
        </div>

        <!-- Section Matière et Filières -->
        <div class="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-4">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-indigo-100 dark:bg-indigo-800/30 rounded-lg">
              <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-700 dark:text-gray-300">Matière et filières</h3>
          </div>

          <div class="ml-11 space-y-3">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Matière</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ selectedEvent.matiere?.nom || "Non spécifiée" }}
                <span class="text-sm text-gray-500 ml-2">({{ selectedEvent.matiere?.code }})</span>
              </p>
            </div>
            
            <div v-if="selectedEvent.matiere?.ue">
              <p class="text-sm text-gray-500 dark:text-gray-400">Unité d'enseignement</p>
              <p class="text-base text-gray-900 dark:text-white">
                {{ selectedEvent.matiere.ue.nom }} ({{ selectedEvent.matiere.ue.code }})
              </p>
            </div>

            <div v-if="selectedEvent.group?.filieres?.length">
              <p class="text-sm text-gray-500 dark:text-gray-400">Filières concernées</p>
              <div class="flex flex-wrap gap-2 mt-1">
                <span
                  v-for="filiere in selectedEvent.group.filieres"
                  :key="filiere.id"
                  class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs"
                >
                  {{ filiere.code }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section Horaires -->
        <div class="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl p-4">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-rose-100 dark:bg-rose-800/30 rounded-lg">
              <svg class="w-5 h-5 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-700 dark:text-gray-300">Date et heure</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-rose-100 dark:border-rose-700/30">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Date</p>
              <p class="text-lg font-bold text-rose-600 dark:text-rose-400 mt-1">
                {{ formatDate(selectedEvent.date) }}
              </p>
            </div>
            <div class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-rose-100 dark:border-rose-700/30">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Début</p>
              <p class="text-lg font-bold text-rose-600 dark:text-rose-400 mt-1">
                {{ formatTime(selectedEvent.debut) }}
              </p>
            </div>
            <div class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-rose-100 dark:border-rose-700/30">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Fin</p>
              <p class="text-lg font-bold text-rose-600 dark:text-rose-400 mt-1">
                {{ formatTime(selectedEvent.fin) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Section Statut -->
        <div class="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-violet-100 dark:bg-violet-800/30 rounded-lg">
              <svg class="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-700 dark:text-gray-300">Statut</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-violet-100 dark:border-violet-700/30">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Publication</p>
              <div class="mt-1">
                <span
                  :class="[
                    selectedEvent.published === 1
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
                    'px-3 py-1 rounded-full text-sm font-medium',
                  ]"
                >
                  {{ selectedEvent.published === 1 ? "Publiée" : "Non publiée" }}
                </span>
              </div>
            </div>

            <div class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-violet-100 dark:border-violet-700/30">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">En ligne</p>
              <div class="mt-1">
                <span
                  :class="[
                    selectedEvent.is_online === 1
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
                      : 'bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-300',
                    'px-3 py-1 rounded-full text-sm font-medium',
                  ]"
                >
                  {{ selectedEvent.is_online === 1 ? "Oui" : "Non" }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Dates de correction -->
        <div v-if="selectedEvent.correction_end_date" class="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-cyan-100 dark:bg-cyan-800/30 rounded-lg">
              <svg class="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-700 dark:text-gray-300">Correction</h3>
          </div>
          <div class="ml-11 space-y-2">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              <span class="font-medium">Date limite:</span>
              {{ formatDate(selectedEvent.correction_end_date) }}
            </p>
            <p v-if="selectedEvent.correction_submission_date" class="text-sm text-gray-600 dark:text-gray-400">
              <span class="font-medium">Soumise le:</span>
              {{ formatDate(selectedEvent.correction_submission_date) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useEvaluationStore } from "~~/stores/evaluations";

const route = useRoute();
const evaluationStore = useEvaluationStore();
const loading = ref(true);

const selectedEvent = computed(() => evaluationStore.evaluation);

// Helpers
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTime = (timeString) => {
  if (!timeString) return "";
  const date = new Date(timeString);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDuration = (minutes) => {
  if (!minutes) return "Non défini";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h${mins > 0 ? mins : ""}` : `${mins}min`;
};

const getStatusClass = (status) => {
  switch (status) {
    case "Terminée":
      return "text-red-600 dark:text-red-400";
    case "En attente":
      return "text-yellow-600 dark:text-yellow-400";
    case "En cours":
      return "text-green-600 dark:text-green-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    const slug = route.params.slug;
    
    if (!evaluationStore.evaluations || evaluationStore.evaluations.length === 0) {
      await evaluationStore.fetchEvaluationsForTeacher();
    }
    
    // Find from store first (to avoid admin permission errors on checkEvaluation endpoint for teachers)
    let found = evaluationStore.evaluations.find(e => e.slug === slug);
    
    if (found) {
      evaluationStore.evaluation = found;
    } else {
      // Fallback
      await evaluationStore.checkEvaluation(slug);
    }
  } catch (error) {
    console.error("Erreur lors du chargement des détails:", error);
  } finally {
    loading.value = false;
  }
});
</script>
