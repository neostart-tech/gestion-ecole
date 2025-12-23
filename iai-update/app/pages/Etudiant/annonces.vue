<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Breadcrumb -->
      <div class="mb-6">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li class="inline-flex items-center">
              <a href="#" class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                Annonces
              </a>
            </li>
            <li aria-current="page">
              <div class="flex items-center">
                <svg class="w-3 h-3 mx-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">Liste</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 class="text-xl md:text-2xl font-semibold text-gray-800 mt-2">Liste des annonces</h1>
      </div>

      <!-- Liste des annonces -->
      <div class="space-y-6">
        <!-- Annonce Card -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div class="p-6">
            <div class="space-y-4">
              <!-- En-tête de l'annonce -->
              <div>
                <h2 class="text-xl font-semibold text-gray-800 mb-1">TechSol</h2>
                <p class="text-gray-500 text-sm mb-3">
                  (Télétravail, Contrat à Durée Déterminée)
                </p>
                <p class="text-gray-600">
                  Opportunité d'Alternance pour les Étudiants de Troisième Année de l'IAI-Togo chez SolTech pour cette année
                </p>
              </div>

              <!-- Métadonnées -->
              <div class="flex items-center text-gray-500 space-x-4">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span class="text-sm">Rue de l'Innovation, Paris, France</span>
                </div>
              </div>

              <!-- Bouton d'action -->
              <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                <div class="flex space-x-4">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    En cours
                  </span>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Nouveau
                  </span>
                </div>
                <a 
                  href="/espace-etudiant/annonces/666738ec390e5/details"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                >
                  Lire l'annonce
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Autres annonces (exemple) -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div class="p-6">
            <div class="space-y-4">
              <div>
                <h2 class="text-xl font-semibold text-gray-800 mb-1">DigitalCorp</h2>
                <p class="text-gray-500 text-sm mb-3">
                  (Hybride, Stage)
                </p>
                <p class="text-gray-600">
                  Stage de fin d'études en développement full-stack pour étudiants en informatique
                </p>
              </div>
              
              <div class="flex items-center text-gray-500 space-x-4">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span class="text-sm">Lyon, France</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-sm">6 mois</span>
                </div>
              </div>

              <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                <div class="flex space-x-4">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Bientôt
                  </span>
                </div>
                <a 
                  href="#"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                >
                  Lire l'annonce
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-8 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button class="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button class="px-4 py-2 rounded-lg bg-blue-600 text-white">1</button>
          <button class="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">2</button>
          <button class="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">3</button>
          <button class="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Vous pouvez ajouter ici la logique pour récupérer les annonces
import { ref } from 'vue'

const announcements = ref([
  {
    id: 1,
    title: 'TechSol',
    type: 'Télétravail, Contrat à Durée Déterminée',
    description: 'Opportunité d\'Alternance pour les Étudiants de Troisième Année de l\'IAI-Togo chez SolTech pour cette année',
    location: 'Rue de l\'Innovation, Paris, France',
    status: 'active'
  },
  {
    id: 2,
    title: 'DigitalCorp',
    type: 'Hybride, Stage',
    description: 'Stage de fin d\'études en développement full-stack pour étudiants en informatique',
    location: 'Lyon, France',
    status: 'upcoming'
  }
])

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
</script>

<style scoped>
/* Styles spécifiques pour les annonces */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.hover\:shadow-2xl:hover {
  --tw-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --tw-shadow-colored: 0 25px 50px -12px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
</style>