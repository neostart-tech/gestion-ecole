<template>
  <div class="space-y-6 pb-10">
    <Breadcrumb
      :crumbs="[
        { name: 'Évaluations', href: '/evaluations/liste' },
        { name: 'Détails de l\'évaluation', href: '#' },
      ]"
    />

    <div v-if="loading" class="flex justify-center py-10">
      <div
        class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"
      ></div>
    </div>

    <div v-else-if="!selectedEvent" class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center text-gray-500">
      Évaluation non trouvée.
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 w-full">
      <!-- En-tête -->
      <div class="flex items-start justify-between mb-6">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl shadow-sm">
              <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                Détails de l'évaluation
              </h1>
              <p class="text-gray-600 dark:text-gray-300">
                {{ selectedEvent?.matiere?.nom || "Évaluation" }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="space-y-6">
        <!-- Section Informations principales -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Matière -->
          <div class="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-700 dark:text-gray-300">Matière</h3>
            </div>
            <div class="ml-11">
              <p class="text-lg font-medium text-gray-900 dark:text-white">
                {{ selectedEvent?.matiere?.nom || "Non spécifiée" }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Code: {{ selectedEvent?.matiere?.code || "N/A" }}
              </p>
            </div>
          </div>

          <!-- Type d'évaluation -->
          <div class="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-700 dark:text-gray-300">Type d'évaluation</h3>
            </div>
            <div class="ml-11 flex flex-wrap gap-2">
              <span :class="[selectedEvent?.type === 'Examen' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300', 'px-3 py-1 rounded-full text-sm font-medium']">
                {{ selectedEvent?.type || "Non spécifié" }}
              </span>

              <span v-if="selectedEvent?.session_type === 'rattrapage'" class="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-sm font-medium border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Rattrapage
              </span>
              <span v-else-if="selectedEvent?.session_type === 'normale'" class="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800">
                Normale
              </span>
            </div>
          </div>

          <!-- Groupe -->
          <div class="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-700 dark:text-gray-300">Groupe</h3>
            </div>
            <div class="ml-11">
              <p class="text-lg font-medium text-gray-900 dark:text-white">
                {{ selectedEvent?.group?.nom || "Aucun groupe" }}
              </p>
              <p v-if="selectedEvent?.group?.filieres?.length" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ selectedEvent.group.filieres.length }} filière(s)
              </p>
            </div>
          </div>

          <!-- Salle -->
          <div class="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-700 dark:text-gray-300">Salle</h3>
            </div>
            <div class="ml-11">
              <p class="text-lg font-medium text-gray-900 dark:text-white">
                {{ selectedEvent?.salle?.nom || "Non spécifiée" }}
              </p>
            </div>
          </div>
        </div>

        <!-- Section Horaires et dates -->
        <div class="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-700 dark:text-gray-300">Horaires</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Date et heures de l'évaluation</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600/50">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Date</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white mt-1">
                {{ formatDate(selectedEvent?.date) || "Non définie" }}
              </p>
            </div>

            <div class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600/50">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Début</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white mt-1">
                {{ formatTime(selectedEvent?.debut) || "Non défini" }}
              </p>
            </div>

            <div class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600/50">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Fin</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white mt-1">
                {{ formatTime(selectedEvent?.fin) || "Non défini" }}
              </p>
            </div>
          </div>
        </div>

        <!-- Section Statut et publication -->
        <div class="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-700 dark:text-gray-300">Statut</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">État de l'évaluation</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600/50">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Publication</p>
              <div class="mt-1">
                <span :class="[selectedEvent?.published === 1 || selectedEvent?.published === true ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300', 'px-3 py-1 rounded-full text-sm font-medium']">
                  {{ selectedEvent?.published === 1 || selectedEvent?.published === true ? "Publiée" : "Non publiée" }}
                </span>
              </div>
            </div>

            <div class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600/50">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Statut</p>
              <div class="mt-1">
                <span :class="[selectedEvent?.status === 'Terminée' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : selectedEvent?.status === 'En cours' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-300', 'px-3 py-1 rounded-full text-sm font-medium']">
                  {{ selectedEvent?.status || "En attente" }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section Filières du groupe -->
        <div v-if="selectedEvent?.group?.filieres?.length" class="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-700 dark:text-gray-300">Filières concernées</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ selectedEvent.group.filieres.length }} filière(s)</p>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <span v-for="filiere in selectedEvent.group.filieres" :key="filiere.id" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700/50">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              {{ filiere.nom }}
              <span class="text-xs opacity-75">({{ filiere.code }})</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useEvaluationStore } from '~~/stores/evaluations';
import Breadcrumb from '~/components/Breadcrumb.vue';

const route = useRoute();
const evaluationStore = useEvaluationStore();
const selectedEvent = ref(null);
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  await evaluationStore.fetchEvaluations();
  selectedEvent.value = evaluationStore.evaluations?.find((e) => e.slug === route.params.slug) || null;
  loading.value = false;
});

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (timeString) => {
  if (!timeString) return "";
  const date = new Date(timeString);
  if (isNaN(date.getTime())) {
    return timeString.substring(0, 5);
  }
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
