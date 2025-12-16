<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Concours</span>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Contrôle de présence</span>
    </div>

    <!-- Titre -->
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Contrôle de présence au concours</h1>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <!-- Total candidats -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total candidats</p>
            <p class="text-2xl font-semibold text-gray-900 mt-2">{{ totalCandidates }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Présents -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Présents</p>
            <p class="text-2xl font-semibold text-emerald-600 mt-2">{{ presentCount }}</p>
          </div>
          <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Absents -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Absents</p>
            <p class="text-2xl font-semibold text-rose-600 mt-2">{{ absentCount }}</p>
          </div>
          <div class="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Taux de présence -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Taux de présence</p>
            <p class="text-2xl font-semibold text-indigo-600 mt-2">{{ presenceRate }}%</p>
          </div>
          <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Barre de contrôle -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <!-- Sélecteur de session -->
      <div class="flex items-center gap-2">
        <span class="text-gray-600 whitespace-nowrap">Session :</span>
        <select 
          v-model="selectedSession" 
          class="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="session1">Session du 15 Janvier 2024</option>
          <option value="session2">Session du 22 Février 2024</option>
          <option value="session3">Session du 15 Mars 2024</option>
        </select>
      </div>

      <!-- Sélecteur d'éléments -->
      <div class="flex items-center gap-2">
        <span class="text-gray-600 whitespace-nowrap">Afficher</span>
        <select 
          v-model="itemsPerPage" 
          class="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span class="text-gray-600 whitespace-nowrap">éléments</span>
      </div>

      <!-- Recherche -->
      <div class="relative w-full md:w-64">
        <input
          v-model="searchQuery"
          type="search"
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder="Rechercher un candidat..."
        />
        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Actions rapides -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div class="flex flex-wrap gap-3">
        <button 
          @click="markAllPresent"
          class="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Marquer tous présents
        </button>
        <button 
          @click="markAllAbsent"
          class="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium text-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          Marquer tous absents
        </button>
        <button 
          @click="generateReport"
          class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Générer rapport
        </button>
        <button 
          @click="exportToExcel"
          class="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium text-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Exporter Excel
        </button>
      </div>
    </div>

    <!-- Tableau des candidats -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                #
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Candidat
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Code
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Filière
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Heure d'arrivée
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Statut
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <!-- Message vide -->
            <tr v-if="filteredCandidates.length === 0">
              <td colspan="7" class="px-6 py-12 text-center">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun candidat trouvé</h3>
                <p class="text-gray-500">
                  {{ searchQuery ? 'Aucun résultat pour votre recherche' : 'Aucun candidat inscrit pour cette session' }}
                </p>
              </td>
            </tr>

            <!-- Liste des candidats -->
            <tr 
              v-for="(candidate, index) in paginatedCandidates" 
              :key="candidate.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- Numéro -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900 font-medium">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </span>
              </td>

              <!-- Candidat -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <!-- Avatar -->
                  <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span class="text-indigo-600 font-semibold">
                      {{ getInitials(candidate.nom) }}
                    </span>
                  </div>
                  
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">
                      {{ candidate.nom }}
                    </h4>
                    <p class="text-xs text-gray-500">
                      {{ candidate.email }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Code -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {{ candidate.code }}
                </span>
              </td>

              <!-- Filière -->
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">
                  {{ candidate.filiere }}
                </span>
              </td>

              <!-- Heure d'arrivée -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="candidate.heureArrivee" class="text-sm text-gray-900">
                  {{ formatTime(candidate.heureArrivee) }}
                </div>
                <span v-else class="text-sm text-gray-400 italic">-</span>
              </td>

              <!-- Statut -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                  candidate.statut === 'Présent'
                    ? 'bg-emerald-100 text-emerald-800'
                    : candidate.statut === 'Absent'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-gray-100 text-gray-800'
                ]">
                  {{ candidate.statut || 'En attente' }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <!-- Marquer Présent -->
                  <button 
                    @click="markPresent(candidate)"
                    :class="[
                      'flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors',
                      candidate.statut === 'Présent'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-default'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                    ]"
                    :disabled="candidate.statut === 'Présent'"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Présent
                  </button>

                  <!-- Marquer Absent -->
                  <button 
                    @click="markAbsent(candidate)"
                    :class="[
                      'flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors',
                      candidate.statut === 'Absent'
                        ? 'bg-rose-100 text-rose-700 border border-rose-200 cursor-default'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                    ]"
                    :disabled="candidate.statut === 'Absent'"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    Absent
                  </button>

                  <!-- Scanner QR Code -->
                  <button 
                    @click="scanQRCode(candidate)"
                    class="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                    title="Scanner QR Code"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="filteredCandidates.length > 0" class="border-t border-gray-200 px-6 py-4">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <!-- Info de pagination -->
          <div class="text-sm text-gray-700">
            Affichage de 
            <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
            à
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredCandidates.length) }}</span>
            sur
            <span class="font-medium">{{ filteredCandidates.length }}</span>
            candidats
          </div>

          <!-- Contrôles de pagination -->
          <div class="flex items-center gap-2">
            <!-- Bouton Précédent -->
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              :class="[
                'px-3 py-1 border border-gray-300 rounded-lg text-sm',
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                  : 'text-gray-700 hover:bg-gray-50'
              ]"
            >
              Précédent
            </button>

            <!-- Numéros de page -->
            <div class="flex items-center gap-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium',
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                {{ page }}
              </button>
              
              <!-- Ellipsis -->
              <span v-if="hasMorePages" class="px-2 text-gray-400">...</span>
            </div>

            <!-- Bouton Suivant -->
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              :class="[
                'px-3 py-1 border border-gray-300 rounded-lg text-sm',
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                  : 'text-gray-700 hover:bg-gray-50'
              ]"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Section des rapports -->
    <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Résumé par filière -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Présence par filière</h3>
        <div class="space-y-4">
          <div 
            v-for="filiere in presenceByFiliere" 
            :key="filiere.nom"
            class="space-y-2"
          >
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700">{{ filiere.nom }}</span>
              <span class="text-sm text-gray-900">{{ filiere.presents }}/{{ filiere.total }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                :class="[
                  'h-2 rounded-full',
                  filiere.taux >= 75 ? 'bg-emerald-500' :
                  filiere.taux >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                ]"
                :style="{ width: filiere.taux + '%' }"
              ></div>
            </div>
            <div class="flex justify-between text-xs text-gray-500">
              <span>{{ filiere.taux }}%</span>
              <span>{{ filiere.presents }} présents</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Horaires d'arrivée -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Horaires d'arrivée</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">À l'heure (08:00-09:00)</p>
                <p class="text-xs text-gray-500">Candidats arrivés dans l'horaire</p>
              </div>
            </div>
            <span class="text-lg font-semibold text-emerald-600">{{ onTimeCount }}</span>
          </div>
          
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">En retard (après 09:00)</p>
                <p class="text-xs text-gray-500">Candidats arrivés en retard</p>
              </div>
            </div>
            <span class="text-lg font-semibold text-amber-600">{{ lateCount }}</span>
          </div>
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div class="space-y-3">
          <button 
            @click="sendReminder"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Envoyer rappel aux absents
          </button>
          
          <button 
            @click="printAttendanceList"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
            </svg>
            Imprimer liste de présence
          </button>
          
          <button 
            @click="closeSession"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Clôturer la session
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Scanner QR Code -->
    <div v-if="showScannerModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="modal-content">
          <div class="modal-header border-b border-gray-200 p-6">
            <h5 class="modal-title text-lg font-semibold text-gray-900">
              Scanner QR Code
            </h5>
            <button type="button" @click="closeScannerModal" class="btn-close text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body p-6">
            <div class="text-center">
              <!-- Zone de scan simulée -->
              <div class="w-64 h-64 mx-auto mb-6 border-4 border-dashed border-indigo-300 rounded-lg flex items-center justify-center bg-gray-50">
                <div class="text-center">
                  <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                  </svg>
                  <p class="text-sm text-gray-600">Placez le QR Code dans le cadre</p>
                </div>
              </div>
              
              <!-- Candidat sélectionné -->
              <div v-if="selectedCandidate" class="bg-gray-50 rounded-lg p-4 mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span class="text-indigo-600 font-semibold">
                      {{ getInitials(selectedCandidate.nom) }}
                    </span>
                  </div>
                  <div class="text-left">
                    <h4 class="text-sm font-medium text-gray-900">{{ selectedCandidate.nom }}</h4>
                    <p class="text-xs text-gray-500">Code: {{ selectedCandidate.code }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Scanner manuel -->
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Ou saisir manuellement le code :
                </label>
                <div class="flex gap-2">
                  <input
                    v-model="manualCode"
                    type="text"
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Saisir le code candidat"
                  />
                  <button 
                    @click="validateManualCode"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Valider
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-t border-gray-200 p-6 flex justify-end gap-3">
            <button 
              type="button" 
              @click="closeScannerModal"
              class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button 
              type="button" 
              @click="confirmScan"
              :disabled="!selectedCandidate"
              :class="[
                'btn btn-primary px-4 py-2 rounded-lg font-medium',
                selectedCandidate
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              ]"
            >
              Confirmer présence
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Données réactives
const searchQuery = ref('');
const itemsPerPage = ref(50);
const currentPage = ref(1);
const selectedSession = ref('session1');
const showScannerModal = ref(false);
const selectedCandidate = ref(null);
const manualCode = ref('');

// Données initiales des candidats
const initialCandidates = [
  {
    id: 1,
    nom: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    code: 'CONC001',
    filiere: 'GLSI',
    statut: 'Présent',
    heureArrivee: '2024-01-15T08:30:00'
  },
  {
    id: 2,
    nom: 'Marie Martin',
    email: 'marie.martin@example.com',
    code: 'CONC002',
    filiere: 'ASR',
    statut: 'Absent',
    heureArrivee: null
  },
  {
    id: 3,
    nom: 'Pierre Bernard',
    email: 'pierre.bernard@example.com',
    code: 'CONC003',
    filiere: 'GLSI',
    statut: 'Présent',
    heureArrivee: '2024-01-15T09:15:00'
  },
  {
    id: 4,
    nom: 'Sophie Petit',
    email: 'sophie.petit@example.com',
    code: 'CONC004',
    filiere: 'MTWI',
    statut: 'Présent',
    heureArrivee: '2024-01-15T08:45:00'
  },
  {
    id: 5,
    nom: 'Thomas Leroy',
    email: 'thomas.leroy@example.com',
    code: 'CONC005',
    filiere: 'TC_1',
    statut: 'En attente',
    heureArrivee: null
  },
  {
    id: 6,
    nom: 'Julie Moreau',
    email: 'julie.moreau@example.com',
    code: 'CONC006',
    filiere: 'ASR',
    statut: 'Présent',
    heureArrivee: '2024-01-15T08:20:00'
  },
  {
    id: 7,
    nom: 'David Robert',
    email: 'david.robert@example.com',
    code: 'CONC007',
    filiere: 'GLSI',
    statut: 'Absent',
    heureArrivee: null
  },
  {
    id: 8,
    nom: 'Catherine Blanc',
    email: 'catherine.blanc@example.com',
    code: 'CONC008',
    filiere: 'MTWI',
    statut: 'Présent',
    heureArrivee: '2024-01-15T09:05:00'
  },
  {
    id: 9,
    nom: 'Pauline Dubois',
    email: 'pauline.dubois@example.com',
    code: 'CONC009',
    filiere: 'TC_1',
    statut: 'Présent',
    heureArrivee: '2024-01-15T08:50:00'
  },
  {
    id: 10,
    nom: 'Marc Laurent',
    email: 'marc.laurent@example.com',
    code: 'CONC010',
    filiere: 'GLSI',
    statut: 'En attente',
    heureArrivee: null
  }
];

const candidates = ref([]);

// Charger les données
onMounted(() => {
  loadCandidates();
});

const loadCandidates = () => {
  if (process.client) {
    const stored = localStorage.getItem('presenceCandidates');
    if (stored) {
      candidates.value = JSON.parse(stored);
    } else {
      candidates.value = initialCandidates;
      localStorage.setItem('presenceCandidates', JSON.stringify(initialCandidates));
    }
  }
};

// Formater les initiales
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Formater l'heure
const formatTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Filtrer les candidats
const filteredCandidates = computed(() => {
  if (!searchQuery.value) return candidates.value;
  
  const query = searchQuery.value.toLowerCase();
  return candidates.value.filter(candidate =>
    candidate.nom.toLowerCase().includes(query) ||
    candidate.email.toLowerCase().includes(query) ||
    candidate.code.toLowerCase().includes(query) ||
    candidate.filiere.toLowerCase().includes(query)
  );
});

// Statistiques
const totalCandidates = computed(() => candidates.value.length);
const presentCount = computed(() => candidates.value.filter(c => c.statut === 'Présent').length);
const absentCount = computed(() => candidates.value.filter(c => c.statut === 'Absent').length);
const presenceRate = computed(() => {
  if (totalCandidates.value === 0) return 0;
  return Math.round((presentCount.value / totalCandidates.value) * 100);
});

// Présence par filière
const presenceByFiliere = computed(() => {
  const filieres = {};
  
  candidates.value.forEach(candidate => {
    if (!filieres[candidate.filiere]) {
      filieres[candidate.filiere] = {
        nom: candidate.filiere,
        total: 0,
        presents: 0
      };
    }
    
    filieres[candidate.filiere].total++;
    if (candidate.statut === 'Présent') {
      filieres[candidate.filiere].presents++;
    }
  });
  
  return Object.values(filieres).map(filiere => ({
    ...filiere,
    taux: Math.round((filiere.presents / filiere.total) * 100)
  }));
});

// Horaires d'arrivée
const onTimeCount = computed(() => {
  return candidates.value.filter(candidate => {
    if (!candidate.heureArrivee || candidate.statut !== 'Présent') return false;
    const hour = new Date(candidate.heureArrivee).getHours();
    return hour >= 8 && hour < 9; // Entre 8h et 9h
  }).length;
});

const lateCount = computed(() => {
  return candidates.value.filter(candidate => {
    if (!candidate.heureArrivee || candidate.statut !== 'Présent') return false;
    const hour = new Date(candidate.heureArrivee).getHours();
    return hour >= 9; // Après 9h
  }).length;
});

// Pagination
const totalPages = computed(() => {
  return Math.ceil(filteredCandidates.value.length / itemsPerPage.value);
});

const paginatedCandidates = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredCandidates.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  
  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    let start = Math.max(1, currentPage.value - 2);
    let end = Math.min(totalPages.value, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }
  
  return pages;
});

const hasMorePages = computed(() => {
  return totalPages.value > 5 && currentPage.value < totalPages.value - 2;
});

// Navigation des pages
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPage = (page) => {
  currentPage.value = page;
};

// Actions sur les candidats
const markPresent = (candidate) => {
  candidate.statut = 'Présent';
  candidate.heureArrivee = new Date().toISOString();
  saveToLocalStorage();
};

const markAbsent = (candidate) => {
  candidate.statut = 'Absent';
  candidate.heureArrivee = null;
  saveToLocalStorage();
};

const markAllPresent = () => {
  if (confirm('Marquer tous les candidats comme présents ?')) {
    candidates.value.forEach(candidate => {
      if (candidate.statut !== 'Présent') {
        candidate.statut = 'Présent';
        candidate.heureArrivee = new Date().toISOString();
      }
    });
    saveToLocalStorage();
  }
};

const markAllAbsent = () => {
  if (confirm('Marquer tous les candidats comme absents ?')) {
    candidates.value.forEach(candidate => {
      if (candidate.statut !== 'Absent') {
        candidate.statut = 'Absent';
        candidate.heureArrivee = null;
      }
    });
    saveToLocalStorage();
  }
};

// Scanner QR Code
const scanQRCode = (candidate) => {
  selectedCandidate.value = candidate;
  showScannerModal.value = true;
};

const closeScannerModal = () => {
  showScannerModal.value = false;
  selectedCandidate.value = null;
  manualCode.value = '';
};

const validateManualCode = () => {
  if (!manualCode.value.trim()) {
    alert('Veuillez saisir un code');
    return;
  }
  
  const candidate = candidates.value.find(c => c.code === manualCode.value);
  if (candidate) {
    selectedCandidate.value = candidate;
  } else {
    alert('Code candidat non trouvé');
  }
};

const confirmScan = () => {
  if (selectedCandidate.value) {
    markPresent(selectedCandidate.value);
    alert(`${selectedCandidate.value.nom} marqué comme présent`);
    closeScannerModal();
  }
};

// Actions globales
const generateReport = () => {
  alert('Génération du rapport de présence...');
};

const exportToExcel = () => {
  alert('Export Excel en cours...');
};

const sendReminder = () => {
  const absentCandidates = candidates.value.filter(c => c.statut === 'Absent');
  if (absentCandidates.length === 0) {
    alert('Aucun candidat absent à notifier');
    return;
  }
  
  if (confirm(`Envoyer un rappel par email à ${absentCandidates.length} candidat(s) absent(s) ?`)) {
    alert(`Rappel envoyé à ${absentCandidates.length} candidat(s)`);
  }
};

const printAttendanceList = () => {
  alert('Impression de la liste de présence...');
};

const closeSession = () => {
  if (confirm('Clôturer la session de concours ? Cette action est définitive.')) {
    alert('Session clôturée avec succès');
  }
};

// Sauvegarder dans localStorage
const saveToLocalStorage = () => {
  if (process.client) {
    localStorage.setItem('presenceCandidates', JSON.stringify(candidates.value));
  }
};
</script>

<style scoped>
/* Styles pour le tableau */
table {
  min-width: 100%;
}

th {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td, th {
  padding: 1rem 1.5rem;
  text-align: left;
}

tbody tr {
  border-bottom: 1px solid #e5e7eb;
}

tbody tr:last-child {
  border-bottom: none;
}

/* Animation pour les transitions */
button {
  transition: all 0.2s ease;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}

/* Styles pour les badges de statut */
.statut-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .table-container {
    overflow-x: auto;
  }
  
  .pagination-controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>