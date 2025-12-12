<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Accueil</span>
      <span>/</span>
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Administration</span>
      <span>/</span>
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Évaluations</span>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Liste</span>
    </div>

    <!-- Titre -->
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Liste des Évaluations</h1>

    <!-- Zone de recherche et filtres -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <!-- Recherche -->
      <input
        v-model="searchQuery"
        type="search"
        class="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        placeholder="Rechercher..."
      />

      <!-- Filtre par type -->
      <div class="relative">
        <select 
          v-model="filterType"
          class="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="">Tous les types</option>
          <option value="Examen">Examen</option>
          <option value="Devoir">Devoir</option>
          <option value="Quiz">Quiz</option>
          <option value="Projet">Projet</option>
        </select>
      </div>

      <!-- Filtre par statut -->
      <div class="relative">
        <select 
          v-model="filterPublier"
          class="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="">Tous les statuts</option>
          <option value="Publié">Publié</option>
          <option value="Brouillon">Brouillon</option>
          <option value="Archivé">Archivé</option>
        </select>
      </div>

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

      <!-- Bouton Ajouter évaluation -->
      <button 
        @click="openAddModal"
        class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium whitespace-nowrap"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Ajouter une évaluation
      </button>
    </div>

    <!-- Tableau -->
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
        <!-- Slot pour le type -->
        <template #type="data">
          <span 
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium',
              getTypeClass(data.value)
            ]"
          >
            {{ data.value }}
          </span>
        </template>

        <!-- Slot pour publier -->
        <template #publier="data">
          <span 
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium',
              data.value === 'Publié' 
                ? 'bg-emerald-100 text-emerald-800' 
                : data.value === 'Brouillon'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-gray-100 text-gray-800'
            ]"
          >
            {{ data.value }}
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
            
            <!-- Bouton Publier/Dépublier -->
            <button 
              @click="togglePublier(data.value)"
              class="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded transition-colors duration-200"
              :title="data.value.publier === 'Publié' ? 'Dépublier' : 'Publier'"
            >
              <svg v-if="data.value.publier === 'Publié'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
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
          <form @submit.prevent="saveEvaluation">
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
                <!-- Type -->
                <div class="form-group text-start">
                  <label for="type" class="block text-sm font-medium text-gray-700 mb-2">
                    Type <span class="text-rose-500">*</span>
                  </label>
                  <select 
                    id="type" 
                    v-model="form.type" 
                    required
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Sélectionner un type</option>
                    <option value="Examen">Examen</option>
                    <option value="Devoir">Devoir</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Projet">Projet</option>
                  </select>
                </div>

                <!-- Matière -->
                <div class="form-group text-start">
                  <label for="matiere" class="block text-sm font-medium text-gray-700 mb-2">
                    Matière <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="matiere" 
                    v-model="form.matiere" 
                    required
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Nom de la matière"
                  />
                </div>
              </div>

              <!-- Description -->
              <div class="form-group text-start">
                <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea 
                  id="description" 
                  v-model="form.description" 
                  rows="3"
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Description de l'évaluation..."
                ></textarea>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Date -->
                <div class="form-group text-start">
                  <label for="date" class="block text-sm font-medium text-gray-700 mb-2">
                    Jour <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    id="date" 
                    v-model="form.date" 
                    required
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>

                <!-- Heure -->
                <div class="form-group text-start">
                  <label for="heure" class="block text-sm font-medium text-gray-700 mb-2">
                    Heure
                  </label>
                  <input 
                    type="time" 
                    id="heure" 
                    v-model="form.heure" 
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Durée -->
                <div class="form-group text-start">
                  <label for="duree" class="block text-sm font-medium text-gray-700 mb-2">
                    Durée (minutes)
                  </label>
                  <input 
                    type="number" 
                    id="duree" 
                    v-model="form.duree" 
                    min="0"
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Durée en minutes"
                  />
                </div>

                <!-- Coefficient -->
                <div class="form-group text-start">
                  <label for="coefficient" class="block text-sm font-medium text-gray-700 mb-2">
                    Coefficient
                  </label>
                  <input 
                    type="number" 
                    id="coefficient" 
                    v-model="form.coefficient" 
                    min="0"
                    step="0.5"
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Coefficient"
                  />
                </div>
              </div>

              <!-- Filière -->
              <div class="form-group text-start">
                <label for="filiere" class="block text-sm font-medium text-gray-700 mb-2">
                  Filière
                </label>
                <select 
                  id="filiere" 
                  v-model="form.filiere" 
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Sélectionner une filière</option>
                  <option value="GLSI">Génie Logiciel & Systèmes d'Informations</option>
                  <option value="ASR">Administration Systèmes & Réseaux</option>
                  <option value="MTWI">Multimédia, Technologies Web & Infographie</option>
                  <option value="TC_1">Tronc Commun Première année</option>
                  <option value="TC_2">Tronc Commun Deuxième année</option>
                </select>
              </div>

              <!-- Statut -->
              <div class="form-group text-start">
                <label for="publier" class="block text-sm font-medium text-gray-700 mb-2">
                  Statut de publication
                </label>
                <select 
                  id="publier" 
                  v-model="form.publier" 
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Brouillon">Brouillon</option>
                  <option value="Publié">Publié</option>
                  <option value="Archivé">Archivé</option>
                </select>
              </div>

              <!-- Fichier joint -->
              <div class="form-group text-start">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Fichier joint (optionnel)
                </label>
                <div class="flex items-center gap-3">
                  <input 
                    type="file" 
                    id="fichier" 
                    ref="fileInput"
                    @change="handleFileSelect"
                    class="hidden"
                  />
                  <button 
                    type="button"
                    @click="triggerFileInput"
                    class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Choisir un fichier
                  </button>
                  <span class="text-sm text-gray-500" v-if="form.fichierNom">
                    {{ form.fichierNom }}
                  </span>
                  <button 
                    v-if="form.fichierNom"
                    type="button"
                    @click="removeFile"
                    class="text-rose-600 hover:text-rose-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
                <p class="mt-1 text-xs text-gray-500">PDF, DOC, DOCX (max 10MB)</p>
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
            <h5 class="modal-title text-lg font-semibold text-gray-900">Détails de l'évaluation</h5>
            <button type="button" @click="closeViewModal" class="btn-close text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="modal-body p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <h6 class="text-sm font-medium text-gray-500 mb-1">Type</h6>
                <span :class="getTypeClass(viewedEvaluation.type) + ' px-3 py-1 rounded-full text-xs font-medium'">
                  {{ viewedEvaluation.type }}
                </span>
              </div>
              <div>
                <h6 class="text-sm font-medium text-gray-500 mb-1">Date</h6>
                <p class="text-gray-900">{{ formatDate(viewedEvaluation.date) }}</p>
              </div>
              <div>
                <h6 class="text-sm font-medium text-gray-500 mb-1">Matière</h6>
                <p class="text-gray-900">{{ viewedEvaluation.matiere }}</p>
              </div>
              <div>
                <h6 class="text-sm font-medium text-gray-500 mb-1">Statut</h6>
                <span 
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    viewedEvaluation.publier === 'Publié' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : viewedEvaluation.publier === 'Brouillon'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ viewedEvaluation.publier }}
                </span>
              </div>
            </div>

            <div v-if="viewedEvaluation.description">
              <h6 class="text-sm font-medium text-gray-500 mb-1">Description</h6>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-gray-700">{{ viewedEvaluation.description }}</p>
              </div>
            </div>

            <div v-if="viewedEvaluation.duree || viewedEvaluation.coefficient" class="grid grid-cols-2 gap-4">
              <div v-if="viewedEvaluation.duree">
                <h6 class="text-sm font-medium text-gray-500 mb-1">Durée</h6>
                <p class="text-gray-900">{{ viewedEvaluation.duree }} minutes</p>
              </div>
              <div v-if="viewedEvaluation.coefficient">
                <h6 class="text-sm font-medium text-gray-500 mb-1">Coefficient</h6>
                <p class="text-gray-900">{{ viewedEvaluation.coefficient }}</p>
              </div>
            </div>

            <div v-if="viewedEvaluation.fichierNom">
              <h6 class="text-sm font-medium text-gray-500 mb-1">Fichier joint</h6>
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="text-gray-700">{{ viewedEvaluation.fichierNom }}</span>
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
              Voulez-vous vraiment supprimer cette évaluation ? Cette action est irréversible. Continuer ?
            </p>
          </div>
          <div class="modal-footer border-t border-gray-200 p-6 flex justify-end gap-3">
            <form @submit.prevent="deleteEvaluation" class="flex items-center gap-3">
              <input type="hidden" id="deleteEvaluationForm" :value="selectedEvaluation?.id" />
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
const filterPublier = ref("");
const showSelector = ref(false);
const selectedColumns = ref([]);
const showModal = ref(false);
const showViewModal = ref(false);
const showDeleteModal = ref(false);
const modalTitle = ref('');
const selectedEvaluation = ref(null);
const viewedEvaluation = ref({});
const itemsPerPage = ref(50);
const loading = ref(false);
const fileInput = ref(null);

// Classes CSS pour les types
const getTypeClass = (type) => {
  switch(type) {
    case 'Examen':
      return 'bg-red-100 text-red-800';
    case 'Devoir':
      return 'bg-blue-100 text-blue-800';
    case 'Quiz':
      return 'bg-green-100 text-green-800';
    case 'Projet':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Formulaire
const form = ref({
  id: null,
  type: '',
  matiere: '',
  description: '',
  date: '',
  heure: '',
  duree: '',
  coefficient: '',
  filiere: '',
  publier: 'Brouillon',
  fichierNom: '',
  fichier: null
});

// Charger les évaluations depuis localStorage
const loadEvaluations = () => {
  if (process.client) {
    const storedEvaluations = localStorage.getItem('evaluations');
    if (storedEvaluations) {
      return JSON.parse(storedEvaluations);
    }
  }
  return [];
};

// Données initiales selon votre exemple
const initialEvaluations = [
  { 
    id: 1, 
    type: 'Examen', 
    matiere: 'Algo Fichier', 
    date: '2025-08-13', 
    publier: 'Publié',
    description: 'Examen sur les algorithmes de fichiers',
    duree: 120,
    coefficient: 2
  },
  { 
    id: 2, 
    type: 'Devoir', 
    matiere: 'Initiation à la Programmation Objet', 
    date: '2025-08-04', 
    publier: 'Publié',
    description: 'Devoir sur les concepts de POO',
    duree: 60,
    coefficient: 1
  },
  { 
    id: 3, 
    type: 'Examen', 
    matiere: 'Initiation à la Programmation Objet', 
    date: '2025-08-04', 
    publier: 'Publié',
    description: 'Examen final de programmation objet',
    duree: 180,
    coefficient: 3
  },
  { 
    id: 4, 
    type: 'Examen', 
    matiere: 'Pratiques de SQL', 
    date: '2024-06-19', 
    publier: 'Publié',
    description: 'Examen sur les requêtes SQL avancées',
    duree: 90,
    coefficient: 2
  },
  { 
    id: 5, 
    type: 'Examen', 
    matiere: 'Initiation à la Programmation Objet', 
    date: '2024-05-13', 
    publier: 'Publié',
    description: 'Examen intermédiaire',
    duree: 120,
    coefficient: 2
  },
  { 
    id: 6, 
    type: 'Devoir', 
    matiere: 'Initiation à l\'algorithme', 
    date: '2024-05-07', 
    publier: 'Publié',
    description: 'Devoir sur les structures de contrôle',
    duree: 45,
    coefficient: 1
  },
  { 
    id: 7, 
    type: 'Examen', 
    matiere: 'Électronique Numérique', 
    date: '2024-05-06', 
    publier: 'Publié',
    description: 'Examen sur les circuits logiques',
    duree: 150,
    coefficient: 2
  },
  { 
    id: 8, 
    type: 'Devoir', 
    matiere: 'Initiation à l\'algorithme', 
    date: '2024-05-02', 
    publier: 'Publié',
    description: 'Devoir sur les algorithmes de tri',
    duree: 60,
    coefficient: 1
  },
  { 
    id: 9, 
    type: 'Devoir', 
    matiere: 'Initiation à l\'algorithme', 
    date: '2024-05-02', 
    publier: 'Publié',
    description: 'Devoir supplémentaire',
    duree: 30,
    coefficient: 0.5
  }
];

const rows = ref([]);

// Formatage de la date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Initialiser les données
onMounted(() => {
  let evaluations = loadEvaluations();
  if (evaluations.length === 0) {
    // CORRECTION ICI : remplacé 'eval' par 'evaluation'
    evaluations = initialEvaluations.map(evaluation => ({
      ...evaluation,
      formattedDate: formatDate(evaluation.date)
    }));
    if (process.client) {
      localStorage.setItem('evaluations', JSON.stringify(evaluations));
    }
  }
  rows.value = evaluations;
  selectedColumns.value = availableColumns.value.map(col => col.field);
});

const availableColumns = ref([
  { field: "id", title: "#", width: "80px", isUnique: true },
  { field: "type", title: "Type" },
  { field: "matiere", title: "Matière" },
  { field: "date", title: "Jour" },
  { field: "publier", title: "Publier" },
  { field: "action", title: "Action", sort: false, width: "180px", type: "click" }
]);

// Colonnes filtrées selon la sélection
const filteredCols = computed(() => {
  return availableColumns.value.filter(col => 
    selectedColumns.value.includes(col.field)
  );
});

// Rows filtrées selon la recherche et filtres
const filteredRows = computed(() => {
  let filtered = rows.value.map(evaluation => ({
    ...evaluation,
    formattedDate: formatDate(evaluation.date)
  }));
  
  // Filtre par type
  if (filterType.value) {
    filtered = filtered.filter(evaluation => 
      evaluation.type === filterType.value
    );
  }
  
  // Filtre par statut
  if (filterPublier.value) {
    filtered = filtered.filter(evaluation => 
      evaluation.publier === filterPublier.value
    );
  }
  
  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(evaluation => 
      evaluation.type.toLowerCase().includes(query) ||
      evaluation.matiere.toLowerCase().includes(query) ||
      evaluation.formattedDate.toLowerCase().includes(query) ||
      evaluation.publier.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

const toggleSelector = () => {
  showSelector.value = !showSelector.value;
};

// Gestion des fichiers
const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      alert('Le fichier est trop volumineux (max 10MB)');
      return;
    }
    form.value.fichier = file;
    form.value.fichierNom = file.name;
  }
};

const removeFile = () => {
  form.value.fichier = null;
  form.value.fichierNom = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Sauvegarder dans localStorage
const saveToLocalStorage = () => {
  if (process.client) {
    localStorage.setItem('evaluations', JSON.stringify(rows.value));
  }
};

// Gestion des modales
const openAddModal = () => {
  modalTitle.value = "Formulaire de création d'une évaluation";
  form.value = { 
    id: null, 
    type: '', 
    matiere: '', 
    description: '', 
    date: new Date().toISOString().split('T')[0],
    heure: '',
    duree: '',
    coefficient: '',
    filiere: '',
    publier: 'Brouillon',
    fichierNom: '',
    fichier: null
  };
  showModal.value = true;
};

const openEditModal = (evaluation) => {
  modalTitle.value = "Formulaire de modification d'une évaluation";
  form.value = { 
    id: evaluation.id,
    type: evaluation.type, 
    matiere: evaluation.matiere,
    description: evaluation.description,
    date: evaluation.date,
    heure: evaluation.heure || '',
    duree: evaluation.duree || '',
    coefficient: evaluation.coefficient || '',
    filiere: evaluation.filiere || '',
    publier: evaluation.publier,
    fichierNom: evaluation.fichierNom || '',
    fichier: null
  };
  showModal.value = true;
};

const openViewModal = (evaluation) => {
  viewedEvaluation.value = {
    ...evaluation,
    formattedDate: formatDate(evaluation.date)
  };
  showViewModal.value = true;
};

const openDeleteModal = (evaluation) => {
  selectedEvaluation.value = evaluation;
  showDeleteModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  removeFile();
};

const closeViewModal = () => {
  showViewModal.value = false;
  viewedEvaluation.value = {};
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedEvaluation.value = null;
};

// Gestion des évaluations
const saveEvaluation = () => {
  if (form.value.id) {
    // Mise à jour
    const index = rows.value.findIndex(e => e.id === form.value.id);
    if (index !== -1) {
      rows.value[index] = {
        ...rows.value[index],
        type: form.value.type,
        matiere: form.value.matiere,
        description: form.value.description,
        date: form.value.date,
        heure: form.value.heure,
        duree: parseInt(form.value.duree) || 0,
        coefficient: parseFloat(form.value.coefficient) || 0,
        filiere: form.value.filiere,
        publier: form.value.publier,
        fichierNom: form.value.fichierNom,
        // Note: En production, vous devriez gérer l'upload du fichier
      };
    }
  } else {
    // Création
    const newId = rows.value.length > 0 
      ? Math.max(...rows.value.map(e => e.id)) + 1 
      : 1;
    
    const newEvaluation = {
      id: newId,
      type: form.value.type,
      matiere: form.value.matiere,
      description: form.value.description,
      date: form.value.date,
      heure: form.value.heure,
      duree: parseInt(form.value.duree) || 0,
      coefficient: parseFloat(form.value.coefficient) || 0,
      filiere: form.value.filiere,
      publier: form.value.publier,
      fichierNom: form.value.fichierNom,
      dateCreation: new Date().toISOString().split('T')[0]
    };
    
    rows.value.push(newEvaluation);
  }
  
  saveToLocalStorage();
  closeModal();
};

const togglePublier = (evaluation) => {
  const index = rows.value.findIndex(e => e.id === evaluation.id);
  if (index !== -1) {
    rows.value[index].publier = rows.value[index].publier === 'Publié' ? 'Brouillon' : 'Publié';
    saveToLocalStorage();
  }
};

const deleteEvaluation = () => {
  if (selectedEvaluation.value) {
    const index = rows.value.findIndex(e => e.id === selectedEvaluation.value.id);
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

/* Style pour le modal scrollable */
.modal-content {
  max-height: calc(90vh - 120px);
}
</style>