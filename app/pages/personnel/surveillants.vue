<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Accueil</span>
      <span>/</span>
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Administration</span>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Gestion des Surveillants</span>
    </div>

    <!-- Titre -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-900">Gestion des Surveillants</h1>
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

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <!-- Carte Surveillants Internes -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Surveillants Internes</p>
            <p class="text-3xl font-bold text-indigo-600">{{ stats.surveillantsInternes }}</p>
          </div>
          <div class="p-3 bg-indigo-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">Personnel interne de l'établissement</p>
      </div>

      <!-- Carte Surveillants Externes -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Surveillants Externes</p>
            <p class="text-3xl font-bold text-emerald-600">{{ stats.surveillantsExternes }}</p>
          </div>
          <div class="p-3 bg-emerald-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">Personnel externe recruté</p>
      </div>

      <!-- Carte Total Surveillants -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Total Surveillants</p>
            <p class="text-3xl font-bold text-purple-600">{{ stats.totalSurveillants }}</p>
          </div>
          <div class="p-3 bg-purple-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">Tous les surveillants actifs</p>
      </div>
    </div>

    <!-- Zone de recherche et filtres -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <!-- Recherche -->
      <input
        v-model="searchQuery"
        type="search"
        class="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        placeholder="Rechercher un surveillant..."
      />

      <!-- Filtre par type -->
      <div class="relative">
        <select 
          v-model="filterType"
          class="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="">Tous les types</option>
          <option value="Interne">Interne</option>
          <option value="Externe">Externe</option>
        </select>
      </div>

      <!-- Filtre par statut -->
      <div class="relative">
        <select 
          v-model="filterStatut"
          class="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="">Tous les statuts</option>
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>
      </div>

      <!-- Filtre par disponibilité -->
      <div class="relative">
        <select 
          v-model="filterDisponibilite"
          class="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="">Toutes disponibilités</option>
          <option value="disponible">Disponible</option>
          <option value="indisponible">Indisponible</option>
        </select>
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

      <!-- Bouton Ajouter surveillant -->
      <button 
        @click="openAddModal"
        class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium whitespace-nowrap"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Ajouter un surveillant
      </button>
    </div>

    <!-- Tableau des surveillants -->
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
        <!-- Slot pour le nom complet -->
        <template #nomComplet="data">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-8 w-8">
              <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <span class="text-indigo-800 font-semibold text-xs">
                  {{ getInitials(data.value.nom, data.value.prenoms) }}
                </span>
              </div>
            </div>
            <div class="ml-3">
              <div class="text-sm font-medium text-gray-900">{{ data.value.nom }} {{ data.value.prenoms }}</div>
              <div class="text-xs text-gray-500">{{ data.value.email }}</div>
            </div>
          </div>
        </template>

        <!-- Slot pour le type -->
        <template #type="data">
          <span 
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium',
              data.value === 'Interne' 
                ? 'bg-indigo-100 text-indigo-800' 
                : 'bg-emerald-100 text-emerald-800'
            ]"
          >
            {{ data.value }}
          </span>
        </template>

        <!-- Slot pour la disponibilité -->
        <template #disponible="data">
          <div class="flex items-center">
            <span 
              :class="[
                'h-2.5 w-2.5 rounded-full mr-2',
                data.value ? 'bg-emerald-400' : 'bg-rose-400'
              ]"
            ></span>
            <span class="text-sm text-gray-700">
              {{ data.value ? 'Disponible' : 'Indisponible' }}
            </span>
          </div>
        </template>

        <!-- Slot pour le statut -->
        <template #actif="data">
          <span 
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium',
              data.value 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-gray-100 text-gray-800'
            ]"
          >
            {{ data.value ? 'Actif' : 'Inactif' }}
          </span>
        </template>

        <!-- Slot pour les actions -->
        <template #action="data">
          <div class="flex items-center justify-center gap-2">
            <!-- Bouton Voir -->
            <button 
              @click="openViewModal(data.value)"
              class="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200"
              title="Voir détails"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <!-- Bouton Modifier -->
            <button 
              @click="openEditModal(data.value)"
              class="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded transition-colors duration-200"
              title="Modifier"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            
            <!-- Bouton Toggle Disponibilité -->
            <button 
              @click="toggleDisponibilite(data.value)"
              class="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded transition-colors duration-200"
              :title="data.value.disponible ? 'Rendre indisponible' : 'Rendre disponible'"
            >
              <svg v-if="data.value.disponible" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <!-- Bouton Supprimer -->
            <button 
              @click="openDeleteModal(data.value)"
              class="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors duration-200"
              title="Supprimer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </template>
      </Vue3Datatable>
    </div>

    <!-- Modal d'ajout/modification -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="modal-content">
          <form @submit.prevent="saveSurveillant">
            <div class="modal-header border-b border-gray-200 p-6">
              <h5 class="modal-title text-lg font-semibold text-gray-900">{{ modalTitle }}</h5>
              <button type="button" @click="closeModal" class="btn-close text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="modal-body p-6 space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Nom -->
                <div class="form-group text-start">
                  <label for="nom" class="block text-sm font-medium text-gray-700 mb-2">
                    Nom <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="nom" 
                    v-model="form.nom" 
                    required
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase" 
                    placeholder="Nom de famille"
                  />
                </div>

                <!-- Prénoms -->
                <div class="form-group text-start">
                  <label for="prenoms" class="block text-sm font-medium text-gray-700 mb-2">
                    Prénoms <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="prenoms" 
                    v-model="form.prenoms" 
                    required
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Prénoms"
                  />
                </div>
              </div>

              <!-- Email -->
              <div class="form-group text-start">
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Email <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="form.email" 
                  required
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="email@iai-togo.tg"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Type de surveillant -->
                <div class="form-group text-start">
                  <label for="type" class="block text-sm font-medium text-gray-700 mb-2">
                    Type de surveillant <span class="text-rose-500">*</span>
                  </label>
                  <select 
                    id="type" 
                    v-model="form.type" 
                    required
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Interne">Interne</option>
                    <option value="Externe">Externe</option>
                  </select>
                </div>

                <!-- Disponibilité -->
                <div class="form-group text-start">
                  <label for="disponible" class="block text-sm font-medium text-gray-700 mb-2">
                    Disponibilité
                  </label>
                  <select 
                    id="disponible" 
                    v-model="form.disponible" 
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option :value="true">Disponible</option>
                    <option :value="false">Indisponible</option>
                  </select>
                </div>
              </div>

              <!-- Téléphone -->
              <div class="form-group text-start">
                <label for="telephone" class="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="tel" 
                  id="telephone" 
                  v-model="form.telephone" 
                  required
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="+228 XX XX XX XX"
                />
              </div>

              <!-- Spécialité -->
              <div class="form-group text-start">
                <label for="specialite" class="block text-sm font-medium text-gray-700 mb-2">
                  Spécialité
                </label>
                <input 
                  type="text" 
                  id="specialite" 
                  v-model="form.specialite" 
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Domaine d'expertise"
                />
              </div>

              <!-- Notes -->
              <div class="form-group text-start">
                <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea 
                  id="notes" 
                  v-model="form.notes" 
                  rows="3"
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Informations complémentaires..."
                ></textarea>
              </div>

              <!-- Statut -->
              <div class="form-group text-start">
                <label for="actif" class="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select 
                  id="actif" 
                  v-model="form.actif" 
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option :value="true">Actif</option>
                  <option :value="false">Inactif</option>
                </select>
              </div>
            </div>
            <div class="modal-footer border-t border-gray-200 p-6 flex justify-end gap-3">
              <button type="button" @click="closeModal" class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
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

    <!-- Modal de visualisation -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div class="modal-content">
          <div class="modal-header border-b border-gray-200 p-6">
            <h5 class="modal-title text-lg font-semibold text-gray-900">Détails du surveillant</h5>
            <button type="button" @click="closeViewModal" class="btn-close text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="modal-body p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h6 class="text-sm font-medium text-gray-500 mb-1">Nom</h6>
                <p class="text-gray-900 font-medium">{{ viewedSurveillant.nom }}</p>
              </div>
              <div>
                <h6 class="text-sm font-medium text-gray-500 mb-1">Prénoms</h6>
                <p class="text-gray-900">{{ viewedSurveillant.prenoms }}</p>
              </div>
              <div>
                <h6 class="text-sm font-medium text-gray-500 mb-1">Email</h6>
                <p class="text-gray-900">{{ viewedSurveillant.email }}</p>
              </div>
              <div>
                <h6 class="text-sm font-medium text-gray-500 mb-1">Téléphone</h6>
                <p class="text-gray-900">{{ viewedSurveillant.telephone || 'Non renseigné' }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <h6 class="text-sm font-medium text-gray-500 mb-1">Type</h6>
                <span 
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    viewedSurveillant.type === 'Interne' 
                      ? 'bg-indigo-100 text-indigo-800' 
                      : 'bg-emerald-100 text-emerald-800'
                  ]"
                >
                  {{ viewedSurveillant.type || 'Non spécifié' }}
                </span>
              </div>
              <div>
                <h6 class="text-sm font-medium text-gray-500 mb-1">Disponibilité</h6>
                <div class="flex items-center">
                  <span 
                    :class="[
                      'h-2.5 w-2.5 rounded-full mr-2',
                      viewedSurveillant.disponible ? 'bg-emerald-400' : 'bg-rose-400'
                    ]"
                  ></span>
                  <span class="text-sm text-gray-700">
                    {{ viewedSurveillant.disponible ? 'Disponible' : 'Indisponible' }}
                  </span>
                </div>
              </div>
              <div>
                <h6 class="text-sm font-medium text-gray-500 mb-1">Statut</h6>
                <span 
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    viewedSurveillant.actif 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ viewedSurveillant.actif ? 'Actif' : 'Inactif' }}
                </span>
              </div>
              <div v-if="viewedSurveillant.specialite">
                <h6 class="text-sm font-medium text-gray-500 mb-1">Spécialité</h6>
                <p class="text-gray-900">{{ viewedSurveillant.specialite }}</p>
              </div>
            </div>

            <div v-if="viewedSurveillant.notes">
              <h6 class="text-sm font-medium text-gray-500 mb-1">Notes</h6>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-gray-700">{{ viewedSurveillant.notes }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer border-t border-gray-200 p-6 flex justify-end">
            <button type="button" @click="closeViewModal" class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="modal-content">
          <div class="modal-header border-b border-gray-200 p-6">
            <h5 class="modal-title text-lg font-semibold text-gray-900">Suppression</h5>
            <button type="button" @click="closeDeleteModal" class="btn-close text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="modal-body p-6">
            <p class="text-gray-600 mb-6">
              Voulez-vous vraiment supprimer ce surveillant ? Cette action est irréversible. Continuer ?
            </p>
          </div>
          <div class="modal-footer border-t border-gray-200 p-6 flex justify-end gap-3">
            <form @submit.prevent="deleteSurveillant" class="flex items-center gap-3">
              <input type="hidden" id="deleteSurveillantForm" :value="selectedSurveillant?.id" />
              <button 
                type="button" 
                @click="closeDeleteModal"
                class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Retour
              </button>
              <button 
                type="submit" 
                class="btn btn-warning px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
              >
                Continuer la suppression
              </button>
            </form>
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
const filterType = ref("");
const filterStatut = ref("");
const filterDisponibilite = ref("");
const showModal = ref(false);
const showViewModal = ref(false);
const showDeleteModal = ref(false);
const modalTitle = ref('');
const selectedSurveillant = ref(null);
const viewedSurveillant = ref({});
const itemsPerPage = ref(50);
const loading = ref(false);

// Statistiques
const stats = ref({
  surveillantsInternes: 0,
  surveillantsExternes: 0,
  totalSurveillants: 0
});

// Formulaire
const form = ref({
  id: null,
  nom: '',
  prenoms: '',
  email: '',
  type: 'Interne',
  disponible: true,
  telephone: '',
  specialite: '',
  notes: '',
  actif: true
});

// Obtenir les initiales
const getInitials = (nom, prenoms) => {
  const first = nom ? nom.charAt(0).toUpperCase() : '';
  const second = prenoms ? prenoms.charAt(0).toUpperCase() : '';
  return first + second;
};

// Charger les surveillants depuis localStorage
const loadSurveillants = () => {
  if (typeof window !== 'undefined') {
    const storedSurveillants = localStorage.getItem('surveillants');
    if (storedSurveillants) {
      return JSON.parse(storedSurveillants);
    }
  }
  return [];
};

// Données initiales
const initialSurveillants = [
  // Vous pouvez ajouter des données initiales ici si nécessaire
];

const rows = ref([]);

// Initialiser les données
onMounted(() => {
  let surveillants = loadSurveillants();
  if (surveillants.length === 0) {
    surveillants = initialSurveillants;
    if (typeof window !== 'undefined') {
      localStorage.setItem('surveillants', JSON.stringify(surveillants));
    }
  }
  rows.value = surveillants;
  updateStats();
});

const availableColumns = ref([
  { field: "id", title: "#", width: "80px", isUnique: true },
  { field: "nomComplet", title: "Nom & Prénoms", type: "click" },
  { field: "type", title: "Type" },
  { field: "telephone", title: "Téléphone" },
  { field: "disponible", title: "Disponibilité" },
  { field: "specialite", title: "Spécialité" },
  { field: "actif", title: "Statut" },
  { field: "action", title: "Actions", sort: false, width: "180px", type: "click" }
]);

// Colonnes filtrées selon la sélection
const filteredCols = computed(() => {
  return availableColumns.value;
});

// Rows filtrées selon la recherche et filtres
const filteredRows = computed(() => {
  let filtered = rows.value;
  
  // Filtre par type
  if (filterType.value) {
    filtered = filtered.filter(surveillant => 
      surveillant.type === filterType.value
    );
  }
  
  // Filtre par statut
  if (filterStatut.value) {
    filtered = filtered.filter(surveillant => {
      if (filterStatut.value === 'actif') return surveillant.actif;
      if (filterStatut.value === 'inactif') return !surveillant.actif;
      return true;
    });
  }
  
  // Filtre par disponibilité
  if (filterDisponibilite.value) {
    filtered = filtered.filter(surveillant => {
      if (filterDisponibilite.value === 'disponible') return surveillant.disponible;
      if (filterDisponibilite.value === 'indisponible') return !surveillant.disponible;
      return true;
    });
  }
  
  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(surveillant => 
      (surveillant.nom && surveillant.nom.toLowerCase().includes(query)) ||
      (surveillant.prenoms && surveillant.prenoms.toLowerCase().includes(query)) ||
      (surveillant.email && surveillant.email.toLowerCase().includes(query)) ||
      (surveillant.telephone && surveillant.telephone.toLowerCase().includes(query)) ||
      (surveillant.specialite && surveillant.specialite.toLowerCase().includes(query))
    );
  }
  
  return filtered;
});

// Mettre à jour les statistiques
const updateStats = () => {
  const internes = rows.value.filter(s => s.type === 'Interne' && s.actif).length;
  const externes = rows.value.filter(s => s.type === 'Externe' && s.actif).length;
  
  stats.value = {
    surveillantsInternes: internes,
    surveillantsExternes: externes,
    totalSurveillants: internes + externes
  };
};

// Sauvegarder dans localStorage
const saveToLocalStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('surveillants', JSON.stringify(rows.value));
  }
  updateStats();
};

// Gestion des modales
const openAddModal = () => {
  modalTitle.value = "Formulaire de création d'un surveillant";
  form.value = { 
    id: null,
    nom: '',
    prenoms: '',
    email: '',
    type: 'Interne',
    disponible: true,
    telephone: '',
    specialite: '',
    notes: '',
    actif: true
  };
  showModal.value = true;
};

const openEditModal = (surveillant) => {
  modalTitle.value = "Formulaire de modification d'un surveillant";
  form.value = { 
    id: surveillant.id,
    nom: surveillant.nom,
    prenoms: surveillant.prenoms,
    email: surveillant.email,
    type: surveillant.type,
    disponible: surveillant.disponible,
    telephone: surveillant.telephone || '',
    specialite: surveillant.specialite || '',
    notes: surveillant.notes || '',
    actif: surveillant.actif
  };
  showModal.value = true;
};

const openViewModal = (surveillant) => {
  viewedSurveillant.value = surveillant;
  showViewModal.value = true;
};

const openDeleteModal = (surveillant) => {
  selectedSurveillant.value = surveillant;
  showDeleteModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const closeViewModal = () => {
  showViewModal.value = false;
  viewedSurveillant.value = {};
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedSurveillant.value = null;
};

// Gestion des surveillants
const saveSurveillant = () => {
  if (form.value.id) {
    // Mise à jour
    const index = rows.value.findIndex(s => s.id === form.value.id);
    if (index !== -1) {
      rows.value[index] = {
        ...rows.value[index],
        nom: form.value.nom.toUpperCase(),
        prenoms: form.value.prenoms,
        email: form.value.email,
        type: form.value.type,
        disponible: form.value.disponible,
        telephone: form.value.telephone,
        specialite: form.value.specialite,
        notes: form.value.notes,
        actif: form.value.actif
      };
    }
  } else {
    // Création
    const newId = rows.value.length > 0 
      ? Math.max(...rows.value.map(s => s.id)) + 1 
      : 1;
    
    const newSurveillant = {
      id: newId,
      nom: form.value.nom.toUpperCase(),
      prenoms: form.value.prenoms,
      email: form.value.email,
      type: form.value.type,
      disponible: form.value.disponible,
      telephone: form.value.telephone,
      specialite: form.value.specialite,
      notes: form.value.notes,
      actif: form.value.actif,
      dateCreation: new Date().toISOString().split('T')[0]
    };
    
    rows.value.push(newSurveillant);
  }
  
  saveToLocalStorage();
  closeModal();
};

const toggleDisponibilite = (surveillant) => {
  const index = rows.value.findIndex(s => s.id === surveillant.id);
  if (index !== -1) {
    rows.value[index].disponible = !rows.value[index].disponible;
    saveToLocalStorage();
  }
};

const deleteSurveillant = () => {
  if (selectedSurveillant.value) {
    const index = rows.value.findIndex(s => s.id === selectedSurveillant.value.id);
    if (index !== -1) {
      rows.value.splice(index, 1);
    }
    saveToLocalStorage();
    closeDeleteModal();
  }
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
</style>