<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Breadcrumb -->
      <nav class="mb-6">
        <ol class="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <a href="#" class="hover:text-blue-600">Mon dossier</a>
          </li>
          <li class="flex items-center">
            <svg class="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
            <span class="text-gray-900 font-medium">Mes dépôts</span>
          </li>
        </ol>
      </nav>

      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Mes dépôts</h1>
      </div>

      <!-- Content -->
      <div class="grid grid-cols-1 gap-6">
        <!-- Job Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-6">
            <div class="space-y-4">
              <!-- Job Header -->
              <div>
                <h2 class="text-lg font-semibold text-gray-900">TechSol</h2>
                <p class="text-sm text-gray-500 mt-1">
                  (Télétravail, Contrat à Durée Déterminée)
                </p>
              </div>

              <!-- Job Description -->
              <p class="text-gray-600">
                Opportunité d'Alternance pour les Étudiants de Troisième Année de l'IAI-Togo chez SolTech pour cette année
              </p>

              <!-- Footer -->
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100">
                <div class="flex items-center text-gray-500 mb-4 sm:mb-0">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span class="text-sm">Rue de l'Innovation, Paris, France</span>
                </div>
                
                <button class="inline-flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium">
                  Dépôt en cours &hellip;
                </button>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup>
// Pas de logique particulière nécessaire pour cette vue statique
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>