<template>
  <!-- Page principale Liste des Cours -->
  <div v-if="!showPresencePage" class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <main class="p-4 md:p-6">
      <!-- Page Header -->
      <div class="mb-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Liste des cours</h1>
            <nav class="flex mt-2" aria-label="Breadcrumb">
              <ol class="inline-flex items-center space-x-1 md:space-x-3">
                <li class="inline-flex items-center">
                  <span class="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-400">
                    Liste des cours
                  </span>
                </li>
                <li aria-current="page">
                  <div class="flex items-center">
                    <svg class="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <span class="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:ml-2">Mes cours</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
         
          <!-- Bouton pour retour à l'accueil ou actions -->
          <div class="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              @click="refreshData"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser
            </button>
          </div>
        </div>
      </div>
      <!-- Card de la liste des cours -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Liste de vos cours</h2>
        </div>
        <div class="p-6">
          <!-- Tableau -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr class="bg-gray-50 dark:bg-gray-700">
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">#</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Matière</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Salle</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Jour</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Heure</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(cours, index) in coursList" :key="cours.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{{ index + 1 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{{ cours.matiere }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{{ cours.salle }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{{ cours.jour }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{{ cours.heure }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <button
                      @click="voirPresence(cours)"
                      class="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Voir présence
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Message si pas de cours -->
          <div v-if="coursList.length === 0" class="text-center py-8">
            <div class="inline-flex flex-col items-center justify-center space-y-3">
              <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p class="text-gray-500 dark:text-gray-400">Aucun cours disponible</p>
              <button
                @click="fetchCours"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualiser la liste
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Stats ou informations supplémentaires -->
      <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Card stat 1 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total heures cette semaine</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ totalHeures }}h</p>
            </div>
          </div>
        </div>
        <!-- Card stat 2 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Cours aujourd'hui</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ coursAujourdhui }}</p>
            </div>
          </div>
        </div>
        <!-- Card stat 3 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Étudiants totaux</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ totalEtudiants }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <!-- Page de Gestion des Présences -->
  <div v-else class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <main class="p-4 md:p-6">
      <!-- Header de la page présence -->
      <div class="mb-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between">
          <div class="flex items-center">
            <button
              @click="retourListeCours"
              class="inline-flex items-center mr-4 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Gestion des présences</h1>
              <nav class="flex mt-2" aria-label="Breadcrumb">
                <ol class="inline-flex items-center space-x-1 md:space-x-3">
                  <li class="inline-flex items-center">
                    <button @click="retourListeCours" class="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                      Liste des cours
                    </button>
                  </li>
                  <li aria-current="page">
                    <div class="flex items-center">
                      <svg class="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                      </svg>
                      <span class="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:ml-2">Présence - {{ selectedCours.matiere }}</span>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
         
          <!-- Actions principales -->
          <div class="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              @click="exporterPresence"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/30"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exporter
            </button>
            <button
              @click="enregistrerPresences"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Enregistrer
            </button>
          </div>
        </div>
      </div>

      <!-- Informations du cours -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Matière</p>
              <p class="text-lg font-semibold text-gray-800 dark:text-white">{{ selectedCours.matiere }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Salle</p>
              <p class="text-lg font-semibold text-gray-800 dark:text-white">{{ selectedCours.salle }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Date</p>
              <p class="text-lg font-semibold text-gray-800 dark:text-white">{{ selectedCours.jour }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-3">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Horaire</p>
              <p class="text-lg font-semibold text-gray-800 dark:text-white">{{ selectedCours.heure }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistiques rapides -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total étudiants</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ presenceStats.total }}</p>
            </div>
            <div class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Présents</p>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ presenceStats.presents }}</p>
            </div>
            <div class="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Absents</p>
              <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ presenceStats.absents }}</p>
            </div>
            <div class="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">En retard</p>
              <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ presenceStats.retards }}</p>
            </div>
            <div class="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Contrôles rapides -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Statut :</span>
              <div class="flex space-x-2">
                <button
                  @click="filtrerParStatut('tous')"
                  :class="[
                    'px-3 py-1.5 text-xs font-medium rounded-full transition-colors',
                    filtreStatut === 'tous'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  ]"
                >
                  Tous
                </button>
                <button
                  @click="filtrerParStatut('présent')"
                  :class="[
                    'px-3 py-1.5 text-xs font-medium rounded-full transition-colors',
                    filtreStatut === 'présent'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  ]"
                >
                  Présents
                </button>
                <button
                  @click="filtrerParStatut('absent')"
                  :class="[
                    'px-3 py-1.5 text-xs font-medium rounded-full transition-colors',
                    filtreStatut === 'absent'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  ]"
                >
                  Absents
                </button>
                <button
                  @click="filtrerParStatut('retard')"
                  :class="[
                    'px-3 py-1.5 text-xs font-medium rounded-full transition-colors',
                    filtreStatut === 'retard'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  ]"
                >
                  Retards
                </button>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="relative">
              <input
                type="text"
                v-model="rechercheEtudiant"
                placeholder="Rechercher un étudiant..."
                class="pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400"
              >
              <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              @click="appliquerMarquageRapide('présent')"
              class="inline-flex items-center px-3 py-2 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
            >
              Tout marquer présent
            </button>
          </div>
        </div>
      </div>

      <!-- Liste des étudiants -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Liste des étudiants</h2>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ etudiantsFiltres.length }} étudiants</span>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-700">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">#</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nom & Prénom</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Matricule</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Groupe</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Statut présence</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Heure d'arrivée</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Commentaire</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="(etudiant, index) in etudiantsFiltres" :key="etudiant.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{{ index + 1 }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ getInitiales(etudiant.nom) }}</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ etudiant.nom }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ etudiant.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{{ etudiant.matricule }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {{ etudiant.groupe }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <select
                      v-model="etudiant.presence"
                      @change="mettreAJourStatistiques"
                      :class="[
                        'px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-colors',
                        getCouleurStatut(etudiant.presence)
                      ]"
                    >
                      <option value="présent" class="text-green-700 dark:text-green-400">Présent</option>
                      <option value="absent" class="text-red-700 dark:text-red-400">Absent</option>
                      <option value="retard" class="text-yellow-700 dark:text-yellow-400">En retard</option>
                      <option value="excusé" class="text-blue-700 dark:text-blue-400">Excusé</option>
                      <option value="maladie" class="text-purple-700 dark:text-purple-400">Maladie</option>
                    </select>
                    <span v-if="etudiant.presence === 'présent'" class="text-green-600 dark:text-green-400">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">
                  <input
                    v-if="etudiant.presence === 'retard'"
                    type="time"
                    v-model="etudiant.heureArrivee"
                    class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                  <span v-else class="text-gray-500 dark:text-gray-400">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    v-model="etudiant.commentaire"
                    placeholder="Ajouter un commentaire..."
                    class="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="basculerStatut(etudiant, 'présent')"
                      :class="[
                        'p-1.5 rounded transition-colors',
                        etudiant.presence === 'présent'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20'
                      ]"
                      title="Marquer présent"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      @click="basculerStatut(etudiant, 'absent')"
                      :class="[
                        'p-1.5 rounded transition-colors',
                        etudiant.presence === 'absent'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20'
                      ]"
                      title="Marquer absent"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <button
                      @click="basculerStatut(etudiant, 'retard')"
                      :class="[
                        'p-1.5 rounded transition-colors',
                        etudiant.presence === 'retard'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-yellow-50 hover:text-yellow-600 dark:hover:bg-yellow-900/20'
                      ]"
                      title="Marquer en retard"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Message si aucun étudiant -->
        <div v-if="etudiantsFiltres.length === 0" class="text-center py-12">
          <div class="inline-flex flex-col items-center justify-center space-y-4">
            <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <div>
              <p class="text-gray-500 dark:text-gray-400 mb-2">Aucun étudiant trouvé</p>
              <p class="text-sm text-gray-400 dark:text-gray-500">Essayez de modifier vos filtres de recherche</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Section pour ajouter une absence justifiée -->
      <div class="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Ajouter une absence justifiée</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Étudiant</label>
            <select v-model="nouvelleAbsence.etudiantId" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option value="">Sélectionner un étudiant</option>
              <option v-for="etudiant in listeEtudiants" :key="etudiant.id" :value="etudiant.id">{{ etudiant.nom }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type d'absence</label>
            <select v-model="nouvelleAbsence.type" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option value="excusé">Excusé</option>
              <option value="maladie">Maladie</option>
              <option value="sport">Compétition sportive</option>
              <option value="familial">Raison familiale</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="ajouterAbsenceJustifiee"
              class="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
            >
              Ajouter l'absence justifiée
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast de notification -->
    <div v-if="showToast" class="fixed bottom-4 right-4 z-50">
      <div :class="[
        'flex items-center p-4 rounded-lg shadow-lg transform transition-all duration-300',
        toastType === 'success' 
          ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
          : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      ]">
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="toastType === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span class="text-sm font-medium">{{ toastMessage }}</span>
        <button @click="showToast = false" class="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// États pour la navigation
const showPresencePage = ref(false)
const selectedCours = ref({})

// Données des cours
const coursList = ref([])
const totalHeures = ref(12)
const coursAujourdhui = ref(2)
const totalEtudiants = ref(45)

// Données des étudiants
const listeEtudiants = ref([
  { id: 1, nom: 'Jean Dupont', matricule: 'ET2023001', groupe: 'Groupe A', email: 'jean.dupont@email.com', presence: 'présent', heureArrivee: '', commentaire: '' },
  { id: 2, nom: 'Marie Martin', matricule: 'ET2023002', groupe: 'Groupe A', email: 'marie.martin@email.com', presence: 'absent', heureArrivee: '', commentaire: 'Raison médicale' },
  { id: 3, nom: 'Pierre Bernard', matricule: 'ET2023003', groupe: 'Groupe B', email: 'pierre.bernard@email.com', presence: 'retard', heureArrivee: '08:15', commentaire: 'Problème transport' },
  { id: 4, nom: 'Sophie Leroy', matricule: 'ET2023004', groupe: 'Groupe B', email: 'sophie.leroy@email.com', presence: 'présent', heureArrivee: '', commentaire: '' },
  { id: 5, nom: 'Luc Moreau', matricule: 'ET2023005', groupe: 'Groupe A', email: 'luc.moreau@email.com', presence: 'présent', heureArrivee: '', commentaire: '' },
  { id: 6, nom: 'Julie Petit', matricule: 'ET2023006', groupe: 'Groupe C', email: 'julie.petit@email.com', presence: 'excusé', heureArrivee: '', commentaire: 'Compétition sportive' },
  { id: 7, nom: 'Thomas Dubois', matricule: 'ET2023007', groupe: 'Groupe C', email: 'thomas.dubois@email.com', presence: 'présent', heureArrivee: '', commentaire: '' },
  { id: 8, nom: 'Camille Richard', matricule: 'ET2023008', groupe: 'Groupe B', email: 'camille.richard@email.com', presence: 'maladie', heureArrivee: '', commentaire: 'Certificat médical fourni' },
])

// Filtres et recherche
const filtreStatut = ref('tous')
const rechercheEtudiant = ref('')

// Statistiques
const presenceStats = ref({
  total: 0,
  presents: 0,
  absents: 0,
  retards: 0,
  excusés: 0
})

// Nouvelle absence justifiée
const nouvelleAbsence = ref({
  etudiantId: '',
  type: 'excusé'
})

// Toast notifications
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// Computed properties
const etudiantsFiltres = computed(() => {
  let filtered = listeEtudiants.value
  
  // Filtre par statut
  if (filtreStatut.value !== 'tous') {
    filtered = filtered.filter(e => e.presence === filtreStatut.value)
  }
  
  // Filtre par recherche
  if (rechercheEtudiant.value) {
    const searchTerm = rechercheEtudiant.value.toLowerCase()
    filtered = filtered.filter(e => 
      e.nom.toLowerCase().includes(searchTerm) || 
      e.matricule.toLowerCase().includes(searchTerm)
    )
  }
  
  return filtered
})

// Fonctions
const fetchCours = async () => {
  coursList.value = []
  
  setTimeout(() => {
    coursList.value = [
      {
        id: 1,
        matiere: 'Mathématiques',
        salle: 'Salle 101',
        jour: 'Lundi 29 Décembre 2025',
        heure: '08:00 - 10:00'
      },
      {
        id: 2,
        matiere: 'Physique',
        salle: 'Salle 102',
        jour: 'Lundi 29 Décembre 2025',
        heure: '10:30 - 12:30'
      },
      {
        id: 3,
        matiere: 'Informatique',
        salle: 'Salle 103',
        jour: 'Mardi 30 Décembre 2025',
        heure: '08:00 - 10:00'
      },
      {
        id: 4,
        matiere: 'Chimie',
        salle: 'Salle 104',
        jour: 'Mercredi 31 Décembre 2025',
        heure: '14:00 - 16:00'
      },
      {
        id: 5,
        matiere: 'Biologie',
        salle: 'Salle 105',
        jour: 'Jeudi 1 Janvier 2026',
        heure: '09:00 - 11:00'
      }
    ]
  }, 500)
}

const refreshData = () => {
  fetchCours()
  totalHeures.value = Math.floor(Math.random() * 10) + 8
  coursAujourdhui.value = Math.floor(Math.random() * 3) + 1
}

const voirPresence = (cours) => {
  selectedCours.value = cours
  showPresencePage.value = true
  mettreAJourStatistiques()
}

const retourListeCours = () => {
  showPresencePage.value = false
}

const getCouleurStatut = (statut) => {
  switch(statut) {
    case 'présent': return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700'
    case 'absent': return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700'
    case 'retard': return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-700'
    case 'excusé': return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700'
    case 'maladie': return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-700'
    default: return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
  }
}

const getInitiales = (nom) => {
  return nom.split(' ').map(n => n[0]).join('').toUpperCase()
}

const basculerStatut = (etudiant, statut) => {
  etudiant.presence = statut
  if (statut !== 'retard') {
    etudiant.heureArrivee = ''
  }
  mettreAJourStatistiques()
}

const mettreAJourStatistiques = () => {
  presenceStats.value = {
    total: listeEtudiants.value.length,
    presents: listeEtudiants.value.filter(e => e.presence === 'présent').length,
    absents: listeEtudiants.value.filter(e => e.presence === 'absent').length,
    retards: listeEtudiants.value.filter(e => e.presence === 'retard').length,
    excusés: listeEtudiants.value.filter(e => e.presence === 'excusé' || e.presence === 'maladie').length
  }
}

const filtrerParStatut = (statut) => {
  filtreStatut.value = statut
}

const appliquerMarquageRapide = (statut) => {
  listeEtudiants.value.forEach(etudiant => {
    etudiant.presence = statut
    if (statut !== 'retard') {
      etudiant.heureArrivee = ''
    }
  })
  mettreAJourStatistiques()
  showNotification('Statuts mis à jour avec succès', 'success')
}

const ajouterAbsenceJustifiee = () => {
  if (!nouvelleAbsence.value.etudiantId) {
    showNotification('Veuillez sélectionner un étudiant', 'error')
    return
  }
  
  const etudiant = listeEtudiants.value.find(e => e.id === parseInt(nouvelleAbsence.value.etudiantId))
  if (etudiant) {
    etudiant.presence = nouvelleAbsence.value.type
    etudiant.commentaire = `Absence justifiée: ${nouvelleAbsence.value.type}`
    mettreAJourStatistiques()
    showNotification('Absence justifiée ajoutée avec succès', 'success')
    
    // Réinitialiser le formulaire
    nouvelleAbsence.value = {
      etudiantId: '',
      type: 'excusé'
    }
  }
}

const enregistrerPresences = () => {
  // Simuler l'enregistrement
  console.log('Présences enregistrées:', listeEtudiants.value)
  showNotification('Présences enregistrées avec succès', 'success')
}

const exporterPresence = () => {
  // Simuler l'exportation
  const data = {
    cours: selectedCours.value,
    dateExport: new Date().toISOString(),
    etudiants: listeEtudiants.value
  }
  console.log('Export des données:', data)
  showNotification('Données exportées avec succès', 'success')
}

const showNotification = (message, type) => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Cycle de vie
onMounted(() => {
  fetchCours()
  mettreAJourStatistiques()
})
</script>

<style scoped>
/* Styles pour les transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animation pour le toast */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.fixed.bottom-4.right-4 {
  animation: slideIn 0.3s ease-out;
}

/* Styles pour les cartes */
.stat-card {
  transition: transform 0.2s ease-in-out;
}
.stat-card:hover {
  transform: translateY(-2px);
}

/* Responsive table */
@media (max-width: 768px) {
  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>