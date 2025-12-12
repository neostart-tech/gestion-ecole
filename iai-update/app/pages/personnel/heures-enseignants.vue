<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Accueil</span>
      <span>/</span>
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Administration</span>
      <span>/</span>
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Rapports</span>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Récapitulatif des heures d'enseignement</span>
    </div>

    <!-- Titre -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-900">Récapitulatif des heures d'enseignement</h1>
      <div class="mt-2 md:mt-0">
        <button 
          @click="$router.back()"
          class="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Retour
        </button>
      </div>
    </div>

    <!-- Filtres de période -->
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Filtrer par période</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Date début -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Date début
          </label>
          <div class="relative">
            <input
              v-model="dateDebut"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Date fin -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Date fin
          </label>
          <div class="relative">
            <input
              v-model="dateFin"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Bouton Appliquer -->
        <div class="flex items-end">
          <button 
            @click="appliquerFiltres"
            class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Appliquer les filtres
          </button>
        </div>
      </div>
    </div>

    <!-- Statistiques globales -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <!-- Total heures -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Total heures enseignées</p>
            <p class="text-3xl font-bold text-indigo-600">{{ stats.totalHeures.toFixed(2) }}h</p>
          </div>
          <div class="p-3 bg-indigo-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">Période sélectionnée</p>
      </div>

      <!-- Nombre d'enseignants -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Nombre d'enseignants</p>
            <p class="text-3xl font-bold text-emerald-600">{{ stats.nombreEnseignants }}</p>
          </div>
          <div class="p-3 bg-emerald-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">Enseignants actifs</p>
      </div>

      <!-- Moyenne heures -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Moyenne par enseignant</p>
            <p class="text-3xl font-bold text-purple-600">{{ stats.moyenneHeures.toFixed(2) }}h</p>
          </div>
          <div class="p-3 bg-purple-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">Moyenne des heures</p>
      </div>
    </div>

    <!-- Zone de recherche et contrôles -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <!-- Recherche -->
      <input
        v-model="searchQuery"
        type="search"
        class="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        placeholder="Rechercher un enseignant..."
      />

      <!-- Sélecteur de colonnes -->
      <div class="relative">
        <button 
          @click="toggleSelector"
          class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span class="text-gray-700 font-medium">Toutes les colonnes</span>
          <svg 
            :class="{ 'rotate-180': showSelector }" 
            class="w-4 h-4 text-gray-500 transition-transform"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        <!-- Dropdown des colonnes -->
        <div 
          v-if="showSelector"
          class="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        >
          <div class="p-3 space-y-2 max-h-64 overflow-y-auto">
            <div 
              v-for="col in availableColumns" 
              :key="col.field"
              class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                :id="col.field"
                v-model="selectedColumns"
                :value="col.field"
                class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <label 
                :for="col.field"
                class="text-sm text-gray-700 cursor-pointer select-none"
              >
                {{ col.title }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Contrôles d'affichage -->
      <div class="flex items-center gap-2">
        <span class="text-gray-600 whitespace-nowrap">Afficher</span>
        <select 
          v-model="itemsPerPage" 
          class="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span class="text-gray-600 whitespace-nowrap">éléments</span>
      </div>

      <!-- Boutons d'export -->
      <div class="flex items-center gap-2">
        <button 
          @click="exporterPDF"
          class="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium whitespace-nowrap"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exporter PDF
        </button>
        
        <button 
          @click="exporterExcel"
          class="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium whitespace-nowrap"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exporter Excel
        </button>
      </div>
    </div>

    <!-- Tableau des heures -->
    <div class="bg-white rounded-xl shadow-sm p-4 md:p-6">
      <Vue3Datatable
        :columns="filteredCols"
        :rows="filteredRows"
        :per-page="itemsPerPage"
        :search="searchQuery"
        :pagination-options="{ 
          dropdown: true, 
          edge: true,
          nav: 'scroll',
          position: 'bottom'
        }"
        :searchable="true"
        :sortable="true"
        :filterable="true"
        :loading="loading"
        :totalRows="filteredRows.length"
        skin="bh-table-striped bh-table-hover"
      >
        <!-- Slot pour le nom enseignant - CORRECTION ICI -->
        <!-- Slot pour le nom enseignant -->
        <template #enseignant="data">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-8 w-8">
              <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <span class="text-indigo-800 font-semibold text-xs">
                  {{ getInitials(data.value) }}
                </span>
              </div>
            </div>
            <div class="ml-3">
              <div class="text-sm font-medium text-gray-900">{{ data.value }}</div>
            </div>
          </div>
        </template>

        <!-- Slot pour les heures totales -->
        <template #heuresTotales="data">
          <div class="flex items-center justify-between">
            <span class="font-medium text-gray-900">{{ data.value }}h</span>
            <div class="relative w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                :class="[
                  'h-full rounded-full',
                  getHeuresClass(data.value)
                ]"
                :style="{ width: getProgressWidth(data.value) }"
              ></div>
            </div>
          </div>
        </template>

        <!-- Slot pour les secondes -->
        <template #secondes="data">
          <span class="text-sm text-gray-600">{{ formatSecondes(data.value) }}</span>
        </template>

        <!-- Slot pour le statut -->
        <template #statut="data">
          <span 
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium',
              data.value === 'Actif' 
                ? 'bg-emerald-100 text-emerald-800' 
                : data.value === 'Inactif'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-amber-100 text-amber-800'
            ]"
          >
            {{ data.value }}
          </span>
        </template>

        <!-- Slot pour les actions -->
        <template #action="data">
          <div class="flex items-center justify-center gap-2">
            <!-- Bouton Voir détails -->
            <button 
              @click="openDetailsModal(data.value)"
              class="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200"
              title="Voir détails"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <!-- Bouton Modifier heures -->
            <button 
              @click="openEditModal(data.value)"
              class="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded transition-colors duration-200"
              title="Modifier heures"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            
            <!-- Bouton Cocher/Décocher -->
            <button 
              @click="toggleCoche(data.value)"
              class="p-1.5 rounded transition-colors duration-200"
              :class="data.value.coche 
                ? 'text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'"
              :title="data.value.coche ? 'Décocher' : 'Cocher'"
            >
              <svg v-if="data.value.coche" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <!-- Bouton Historique -->
            <button 
              @click="openHistoriqueModal(data.value)"
              class="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded transition-colors duration-200"
              title="Voir historique"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </template>
      </Vue3Datatable>
    </div>

    <!-- Modal de détails -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="modal-content">
          <div class="modal-header border-b border-gray-200 p-6">
            <h5 class="modal-title text-lg font-semibold text-gray-900">Détails des heures d'enseignement</h5>
            <button type="button" @click="closeDetailsModal" class="btn-close text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="modal-body p-6">
            <!-- En-tête avec informations -->
            <div class="bg-gray-50 p-4 rounded-lg mb-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p class="text-sm font-medium text-gray-600">Enseignant</p>
                  <p class="text-lg font-semibold text-gray-900">{{ selectedEnseignant?.enseignant }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600">Heures totales</p>
                  <p class="text-lg font-semibold text-indigo-600">{{ selectedEnseignant?.heuresTotales }} heures</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600">Période</p>
                  <p class="text-lg font-semibold text-gray-900">{{ formatDate(dateDebut) }} - {{ formatDate(dateFin) }}</p>
                </div>
              </div>
            </div>

            <!-- Détails par cours -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Détail par cours</h3>
              
              <div v-for="cours in selectedEnseignant?.cours || []" :key="cours.id" 
                   class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium text-gray-900">{{ cours.nom }}</h4>
                    <p class="text-sm text-gray-600 mt-1">Code: {{ cours.code }} | Groupe: {{ cours.groupe }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-semibold text-indigo-600">{{ cours.heures }}h</p>
                    <p class="text-sm text-gray-600">{{ cours.nombreSeances }} séances</p>
                  </div>
                </div>
                
                <!-- Dates des séances -->
                <div class="mt-3 pt-3 border-t border-gray-100">
                  <p class="text-sm font-medium text-gray-700 mb-2">Dates des séances :</p>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="date in cours.dates" :key="date" 
                          class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {{ formatDate(date) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Résumé -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Résumé</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm font-medium text-gray-600">Total heures</p>
                  <p class="text-2xl font-bold text-indigo-600">{{ selectedEnseignant?.heuresTotales }}h</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm font-medium text-gray-600">Nombre de cours</p>
                  <p class="text-2xl font-bold text-emerald-600">{{ selectedEnseignant?.cours?.length || 0 }}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm font-medium text-gray-600">Séances totales</p>
                  <p class="text-2xl font-bold text-purple-600">{{ selectedEnseignant?.totalSeances || 0 }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-t border-gray-200 p-6 flex justify-end">
            <button type="button" @click="closeDetailsModal" class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de modification d'heures -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div class="modal-content">
          <form @submit.prevent="saveHeures">
            <div class="modal-header border-b border-gray-200 p-6">
              <h5 class="modal-title text-lg font-semibold text-gray-900">Modifier les heures d'enseignement</h5>
              <button type="button" @click="closeEditModal" class="btn-close text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="modal-body p-6 space-y-4">
              <!-- Informations enseignant -->
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm font-medium text-gray-600 mb-1">Enseignant</p>
                <p class="text-lg font-semibold text-gray-900">{{ form.enseignant }}</p>
                <p class="text-sm text-gray-600 mt-1">Heures actuelles: {{ form.heuresTotales }}h</p>
              </div>

              <!-- Nouvelle valeur d'heures -->
              <div class="form-group text-start">
                <label for="nouvellesHeures" class="block text-sm font-medium text-gray-700 mb-2">
                  Nouvelles heures <span class="text-rose-500">*</span>
                </label>
                <div class="relative">
                  <input 
                    type="number" 
                    id="nouvellesHeures" 
                    v-model="form.nouvellesHeures" 
                    required
                    step="0.5"
                    min="0"
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Entrez le nombre d'heures"
                  />
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span class="text-gray-500">heures</span>
                  </div>
                </div>
                <p class="mt-1 text-xs text-gray-500">Valeur décimale autorisée (ex: 1.5 pour 1h30)</p>
              </div>

              <!-- Justificatif -->
              <div class="form-group text-start">
                <label for="justificatif" class="block text-sm font-medium text-gray-700 mb-2">
                  Justificatif
                </label>
                <textarea 
                  id="justificatif" 
                  v-model="form.justificatif" 
                  rows="3"
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Expliquez la raison de cette modification..."
                ></textarea>
              </div>

              <!-- Date d'effet -->
              <div class="form-group text-start">
                <label for="dateEffet" class="block text-sm font-medium text-gray-700 mb-2">
                  Date d'effet <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="date" 
                  id="dateEffet" 
                  v-model="form.dateEffet" 
                  required
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
            </div>
            <div class="modal-footer border-t border-gray-200 p-6 flex justify-end gap-3">
              <button type="button" @click="closeEditModal" class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Annuler
              </button>
              <button type="submit" class="btn btn-primary px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal d'historique -->
    <div v-if="showHistoriqueModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="modal-content">
          <div class="modal-header border-b border-gray-200 p-6">
            <h5 class="modal-title text-lg font-semibold text-gray-900">Historique des modifications</h5>
            <button type="button" @click="closeHistoriqueModal" class="btn-close text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="modal-body p-6">
            <!-- En-tête -->
            <div class="bg-gray-50 p-4 rounded-lg mb-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Enseignant</p>
                  <p class="text-lg font-semibold text-gray-900">{{ selectedEnseignant?.enseignant }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-600">Heures actuelles</p>
                  <p class="text-lg font-semibold text-indigo-600">{{ selectedEnseignant?.heuresTotales }}h</p>
                </div>
              </div>
            </div>

            <!-- Liste des modifications -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Historique des modifications</h3>
              
              <div v-if="historique.length === 0" class="text-center py-8">
                <p class="text-gray-500">Aucune modification enregistrée</p>
              </div>

              <div v-for="modif in historique" :key="modif.id" 
                   class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {{ modif.type }}
                      </span>
                      <span class="text-sm text-gray-600">{{ formatDateTime(modif.date) }}</span>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p class="text-sm font-medium text-gray-600">Anciennes heures</p>
                        <p class="text-lg font-semibold text-gray-700">{{ modif.anciennesHeures }}h</p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-600">Nouvelles heures</p>
                        <p class="text-lg font-semibold text-indigo-600">{{ modif.nouvellesHeures }}h</p>
                      </div>
                    </div>

                    <div v-if="modif.justificatif">
                      <p class="text-sm font-medium text-gray-600 mb-1">Justificatif</p>
                      <p class="text-sm text-gray-700 bg-gray-50 p-3 rounded">{{ modif.justificatif }}</p>
                    </div>
                  </div>
                  
                  <div class="ml-4">
                    <span :class="[
                      'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      modif.statut === 'Validé' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : modif.statut === 'En attente'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    ]">
                      {{ modif.statut }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-t border-gray-200 p-6 flex justify-end">
            <button type="button" @click="closeHistoriqueModal" class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";

const searchQuery = ref("");
const showSelector = ref(false);
const selectedColumns = ref([]);
const showDetailsModal = ref(false);
const showEditModal = ref(false);
const showHistoriqueModal = ref(false);
const loading = ref(false);
const itemsPerPage = ref(50);

// Dates
const dateDebut = ref("");
const dateFin = ref("");

// Données sélectionnées
const selectedEnseignant = ref(null);
const historique = ref([]);

// Statistiques
const stats = ref({
  totalHeures: 0,
  nombreEnseignants: 0,
  moyenneHeures: 0
});

// Formulaire
const form = ref({
  id: null,
  enseignant: '',
  heuresTotales: 0,
  nouvellesHeures: 0,
  justificatif: '',
  dateEffet: ''
});

// Données initiales selon votre exemple
const initialEnseignants = [
  { 
    id: 1, 
    enseignant: "APÉKÉ Séna", 
    heuresTotales: 6, 
    secondes: 21600,
    statut: "Actif",
    coche: false
  },
  { 
    id: 2, 
    enseignant: "Alford Scarlet", 
    heuresTotales: 4, 
    secondes: 14400,
    statut: "Actif",
    coche: false
  },
  { 
    id: 3, 
    enseignant: "Holman Kamal", 
    heuresTotales: 10, 
    secondes: 36000,
    statut: "Actif",
    coche: false
  },
  { 
    id: 4, 
    enseignant: "GBODUI Roland Jospeh", 
    heuresTotales: 8, 
    secondes: 28800,
    statut: "Actif",
    coche: false
  },
  { 
    id: 5, 
    enseignant: "AMEVOR Kossi", 
    heuresTotales: 8, 
    secondes: 28800,
    statut: "Actif",
    coche: false
  },
  { 
    id: 6, 
    enseignant: "HANTZ Hantz", 
    heuresTotales: 0, 
    secondes: 0,
    statut: "Inactif",
    coche: false
  },
  { 
    id: 7, 
    enseignant: "KEOULA Edem Lonlon", 
    heuresTotales: 0, 
    secondes: 0,
    statut: "Inactif",
    coche: false
  },
  { 
    id: 8, 
    enseignant: "DAVON Essè Nicolas", 
    heuresTotales: 0, 
    secondes: 0,
    statut: "Inactif",
    coche: false
  },
  { 
    id: 9, 
    enseignant: "AMEYIKPO Nicolas", 
    heuresTotales: 0, 
    secondes: 0,
    statut: "Inactif",
    coche: false
  },
  { 
    id: 10, 
    enseignant: "AMOUZOU Kevin", 
    heuresTotales: 0, 
    secondes: 0,
    statut: "Inactif",
    coche: false
  },
  { 
    id: 11, 
    enseignant: "AMOUZOU Kevin", 
    heuresTotales: 0, 
    secondes: 0,
    statut: "Inactif",
    coche: false
  },
  { 
    id: 12, 
    enseignant: "ASSIBI Jordan", 
    heuresTotales: 14.87, 
    secondes: 53520,
    statut: "Actif",
    coche: false
  }
];

const rows = ref([]);

// Initialiser les dates
onMounted(() => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  dateDebut.value = formatDateForInput(firstDay);
  dateFin.value = formatDateForInput(lastDay);
  
  rows.value = initialEnseignants;
  selectedColumns.value = availableColumns.value.map(col => col.field);
  updateStats();
});

const availableColumns = ref([
  { field: "id", title: "#", width: "80px", isUnique: true },
  { field: "enseignant", title: "Enseignant", type: "click" },
  { field: "heuresTotales", title: "Heures totales" },
  { field: "secondes", title: "Secondes" },
  { field: "statut", title: "Statut" },
  { field: "action", title: "Actions", sort: false, width: "200px", type: "click" }
]);

// Colonnes filtrées selon la sélection
const filteredCols = computed(() => {
  return availableColumns.value.filter(col => 
    selectedColumns.value.includes(col.field)
  );
});

// Rows filtrées selon la recherche
const filteredRows = computed(() => {
  let filtered = rows.value;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(enseignant => 
      enseignant.enseignant.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

// Formatage des dates
const formatDateForInput = (date) => {
  return date.toISOString().split('T')[0];
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
};

const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR');
};

// CORRECTION ICI : Fonction améliorée pour obtenir les initiales
const getInitials = (nomComplet) => {
  if (!nomComplet) return '';
  if (typeof nomComplet !== 'string') return '';
  
// Obtenir les initiales
const getInitials = (nomComplet) => {
  if (!nomComplet) return '';
  const parts = nomComplet.split(' ');
  const first = parts[0] ? parts[0].charAt(0).toUpperCase() : '';
  const last = parts[1] ? parts[1].charAt(0).toUpperCase() : '';
  return first + last;
};

// Formatage des secondes
const formatSecondes = (secondes) => {
  const heures = Math.floor(secondes / 3600);
  const minutes = Math.floor((secondes % 3600) / 60);
  const secs = secondes % 60;
  return `${heures}h ${minutes}m ${secs}s`;
};

// Classe CSS pour les heures
const getHeuresClass = (heures) => {
  if (heures >= 10) return 'bg-emerald-500';
  if (heures >= 5) return 'bg-amber-500';
  return 'bg-rose-500';
};

// Largeur de la barre de progression
const getProgressWidth = (heures) => {
  const max = Math.max(...rows.value.map(e => e.heuresTotales));
  return max > 0 ? `${(heures / max) * 100}%` : '0%';
};

// Mettre à jour les statistiques
const updateStats = () => {
  const total = rows.value.reduce((sum, e) => sum + e.heuresTotales, 0);
  const count = rows.value.filter(e => e.heuresTotales > 0).length;
  const moyenne = count > 0 ? total / count : 0;
  
  stats.value = {
    totalHeures: total,
    nombreEnseignants: count,
    moyenneHeures: moyenne
  };
};

const toggleSelector = () => {
  showSelector.value = !showSelector.value;
};

// Appliquer les filtres de date
const appliquerFiltres = () => {
  loading.value = true;
  // Simuler un chargement
  setTimeout(() => {
    loading.value = false;
    updateStats();
  }, 500);
};

// Exporter PDF
const exporterPDF = () => {
  alert("Export PDF en cours...");
  // Implémentez l'export PDF ici
};

// Exporter Excel
const exporterExcel = () => {
  alert("Export Excel en cours...");
  // Implémentez l'export Excel ici
};

// Gestion des modales
const openDetailsModal = (enseignant) => {
  selectedEnseignant.value = enseignant;
  
  // Simuler des données de cours
  selectedEnseignant.value.cours = [
    {
      id: 1,
      nom: "Mathématiques Appliquées",
      code: "MAT101",
      groupe: "Groupe A",
      heures: enseignant.heuresTotales * 0.6,
      nombreSeances: 12,
      dates: [
        new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        new Date()
      ]
    },
    {
      id: 2,
      nom: "Informatique",
      code: "INF102",
      groupe: "Groupe B",
      heures: enseignant.heuresTotales * 0.4,
      nombreSeances: 8,
      dates: [
        new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      ]
    }
  ];
  
  selectedEnseignant.value.totalSeances = selectedEnseignant.value.cours.reduce(
    (sum, cours) => sum + cours.nombreSeances, 0
  );
  
  showDetailsModal.value = true;
};

const openEditModal = (enseignant) => {
  selectedEnseignant.value = enseignant;
  form.value = {
    id: enseignant.id,
    enseignant: enseignant.enseignant,
    heuresTotales: enseignant.heuresTotales,
    nouvellesHeures: enseignant.heuresTotales,
    justificatif: '',
    dateEffet: formatDateForInput(new Date())
  };
  showEditModal.value = true;
};

const openHistoriqueModal = (enseignant) => {
  selectedEnseignant.value = enseignant;
  
  // Simuler des données d'historique
  historique.value = [
    {
      id: 1,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      type: "Modification",
      anciennesHeures: 5,
      nouvellesHeures: enseignant.heuresTotales,
      justificatif: "Ajout de séances supplémentaires",
      statut: "Validé"
    },
    {
      id: 2,
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      type: "Initial",
      anciennesHeures: 0,
      nouvellesHeures: 5,
      justificatif: "Création initiale",
      statut: "Validé"
    }
  ];
  
  showHistoriqueModal.value = true;
};

const toggleCoche = (enseignant) => {
  const index = rows.value.findIndex(e => e.id === enseignant.id);
  if (index !== -1) {
    rows.value[index].coche = !rows.value[index].coche;
  }
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedEnseignant.value = null;
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedEnseignant.value = null;
};

const closeHistoriqueModal = () => {
  showHistoriqueModal.value = false;
  selectedEnseignant.value = null;
  historique.value = [];
};

// Sauvegarder les modifications d'heures
const saveHeures = () => {
  const index = rows.value.findIndex(e => e.id === form.value.id);
  if (index !== -1) {
    const anciennesHeures = rows.value[index].heuresTotales;
    rows.value[index].heuresTotales = form.value.nouvellesHeures;
    rows.value[index].secondes = form.value.nouvellesHeures * 3600;
    
    // Ajouter à l'historique
    historique.value.unshift({
      id: historique.value.length + 1,
      date: new Date(),
      type: "Modification manuelle",
      anciennesHeures: anciennesHeures,
      nouvellesHeures: form.value.nouvellesHeures,
      justificatif: form.value.justificatif,
      statut: "Validé"
    });
    
    updateStats();
  }
  
  closeEditModal();
};
</script>

<style scoped>
/* Styles pour le tableau */
:deep(.bh-table-wrapper) {
  overflow-x: auto;
}

:deep(.bh-table) {
  min-width: 100%;
  width: 100%;
  border-collapse: collapse;
}

:deep(.bh-table th) {
  padding: 12px 16px;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.bh-table td) {
  padding: 16px;
  white-space: nowrap;
  font-size: 0.875rem;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.bh-table tr:hover) {
  background-color: #f9fafb;
}

:deep(.bh-pagination) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

:deep(.bh-table-striped tbody tr:nth-child(odd)) {
  background-color: #f9fafb;
}

:deep(.bh-table-hover tbody tr:hover) {
  background-color: #f3f4f6;
}

/* Styles pour les barres de progression */
.progress-bar {
  height: 4px;
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* Styles pour les modales */
.modal-content {
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Styles pour les badges */
.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Styles pour les cartes de statistiques */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>