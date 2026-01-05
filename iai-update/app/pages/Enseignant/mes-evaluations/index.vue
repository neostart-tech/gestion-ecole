<template>
  <!-- ... (header et sidebar restent les mêmes) ... -->

  <!-- Main Content Area -->
  <main class="flex-1 p-6">
    <!-- Breadcrumb -->
    <nav class="mb-6">
      <ol class="flex items-center space-x-2 text-sm text-gray-600">
        <li>
          <a href="#" class="hover:text-gray-900">Mon emploi de temps</a>
        </li>
        <li class="flex items-center">
          <svg class="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
          </svg>
          <span class="text-gray-900 font-medium">Mes cours</span>
        </li>
      </ol>
    </nav>

    <!-- Page Title -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Emploi de temps</h1>
    </div>

    <!-- Evaluations Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-6 border-b">
        <h2 class="text-lg font-semibold text-gray-900">Évaluations / Examens / Devoirs</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MATIÈRE</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SALLE</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">JOUR</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HEURE</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Exemple de ligne avec les données que vous avez fournies -->
            <tr v-for="(evaluation, index) in evaluations" :key="evaluation.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ evaluation.matiere }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ evaluation.type }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ evaluation.salle }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ evaluation.jour }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ evaluation.heure }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                <div class="flex justify-center space-x-2">
                  <!-- Premier icône - Voir les soumissions -->
                  <NuxtLink 
                    :to="`/Enseignant/mes-evaluations/${evaluation.id}/soumissions`"
                    class="group relative inline-flex items-center justify-center p-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors duration-200"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <!-- Tooltip pour "Voir les soumissions" -->
                    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                      <div class="relative">
                        <div class="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                          Voir les soumissions
                        </div>
                        <div class="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </NuxtLink>
                  
                  <!-- Deuxième icône - Créer les questions -->
                  <NuxtLink 
                    :to="`/Enseignant/mes-evaluations/${evaluation.id}/questionnaire`"
                    class="group relative inline-flex items-center justify-center p-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                    <!-- Tooltip pour "Créer les questions" -->
                    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                      <div class="relative">
                        <div class="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                          Créer les questions
                        </div>
                        <div class="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </NuxtLink>
                </div>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  </main>

  <!-- ... (footer reste le même) ... -->
</template>

<script setup>
import { ref } from 'vue'

// Données d'exemple pour les évaluations
const evaluations = ref([
  {
    id: 1,
    matiere: "Langage C",
    type: "Évaluation",
    salle: "SALLE B",
    jour: "5 janvier 2026",
    heure: "08:00 - 10:00"
  },
  
  {
    id: 2,
    matiere: "Algo Fichier",
    type: "Évaluation",
    salle: "SALLE A",
    jour: "5 janvier 2026",
    heure: "08:00 - 10:00"
  },
])

// Fonction pour formater la date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style>
/* Styles pour les tooltips */
.group:hover .group-hover\:block {
  display: block;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>