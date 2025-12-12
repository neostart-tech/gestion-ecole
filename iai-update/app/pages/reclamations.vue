<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Accueil</span>
      <span>/</span>
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Administration</span>
      <span>/</span>
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Réclamations</span>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Liste</span>
    </div>

    <!-- Titre -->
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Réclamations</h1>

    <!-- Zone de recherche et filtres -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <!-- Recherche -->
      <input
        v-model="searchQuery"
        type="search"
        class="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        placeholder="Rechercher..."
      />

      <!-- Filtre par statut -->
      <div class="relative">
        <select 
          v-model="filterStatut"
          class="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="">Tous les statuts</option>
          <option value="En attente">En attente</option>
          <option value="En cours">En cours</option>
          <option value="Résolue">Résolue</option>
          <option value="Rejetée">Rejetée</option>
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

      <!-- Bouton Ajouter réclamation -->
      <button 
        @click="openAddModal"
        class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium whitespace-nowrap"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Nouvelle réclamation
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
        <!-- Slot pour le statut -->
        <template #statut="data">
          <span 
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium',
              getStatusClass(data.value)
            ]"
          >
            {{ data.value }}
          </span>
        </template>

        <!-- Slot pour l'évaluation -->
        <template #evaluation="data">
          <div class="flex items-center">
            <span class="text-yellow-500 mr-1">★</span>
            <span class="font-medium">{{ data.value }}/5</span>
          </div>
        </template>

        <!-- Slot pour le justificatif -->
        <template #justificatif="data">
          <button 
            v-if="data.value"
            @click="openJustificatif(data.row)"
            class="text-indigo-600 hover:text-indigo-800 hover:underline text-sm font-medium"
          >
            Voir justificatif
          </button>
          <span v-else class="text-gray-400 text-sm">Aucun</span>
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
            
            <!-- Bouton Traiter -->
            <button 
              v-if="data.value.statut === 'En attente' || data.value.statut === 'En cours'"
              @click="openTraiterModal(data.value)"
              class="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded transition-colors duration-200"
              title="Traiter la réclamation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
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
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div class="modal-content">
          <form @submit.prevent="saveReclamation">
            <div class="modal-header border-b border-gray-200 p-6">
              <h5 class="modal-title text-lg font-semibold text-gray-900">{{ modalTitle }}</h5>
              <button type="button" @click="closeModal" class="btn-close text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="modal-body p-6 space-y-4">
              <div class="form-group text-start">
                <label for="etudiant" class="block text-sm font-medium text-gray-700 mb-2">
                  Étudiant <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="etudiant" 
                  v-model="form.etudiant" 
                  required
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Nom de l'étudiant"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group text-start">
                  <label for="evaluation" class="block text-sm font-medium text-gray-700 mb-2">
                    Évaluation <span class="text-rose-500">*</span>
                  </label>
                  <div class="flex items-center gap-2">
                    <input 
                      type="range" 
                      id="evaluation" 
                      v-model="form.evaluation" 
                      min="1" 
                      max="5" 
                      step="1"
                      required
                      class="w-full"
                    />
                    <span class="text-lg font-bold text-amber-600 min-w-[40px]">{{ form.evaluation }}/5</span>
                  </div>
                  <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>
                </div>

                <div class="form-group text-start">
                  <label for="statut" class="block text-sm font-medium text-gray-700 mb-2">
                    Statut <span class="text-rose-500">*</span>
                  </label>
                  <select 
                    id="statut" 
                    v-model="form.statut" 
                    required
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="En attente">En attente</option>
                    <option value="En cours">En cours</option>
                    <option value="Résolue">Résolue</option>
                    <option value="Rejetée">Rejetée</option>
                  </select>
                </div>
              </div>

              <div class="form-group text-start">
                <label for="motif" class="block text-sm font-medium text-gray-700 mb-2">
                  Motif de la réclamation <span class="text-rose-500">*</span>
                </label>
                <textarea 
                  id="motif" 
                  v-model="form.motif" 
                  rows="4"
                  required
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Décrivez le motif de la réclamation..."
                ></textarea>
              </div>

              <div class="form-group text-start">
                <label for="justificatif" class="block text-sm font-medium text-gray-700 mb-2">
                  Justificatif (URL ou texte)
                </label>
                <input 
                  type="text" 
                  id="justificatif" 
                  v-model="form.justificatif" 
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Lien vers le justificatif ou référence"
                />
              </div>

              <div v-if="form.id" class="form-group text-start">
                <label for="reponse" class="block text-sm font-medium text-gray-700 mb-2">
                  Réponse de l'administration
                </label>
                <textarea 
                  id="reponse" 
                  v-model="form.reponse" 
                  rows="3"
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Réponse apportée à la réclamation..."
                ></textarea>
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
            <h5 class="modal-title text-lg font-semibold text-gray-900">Détails de la réclamation</h5>
            <button type="button" @click="closeViewModal" class="btn-close text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="modal-body p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h6 class="text-sm font-medium text-gray-500 mb-1">Étudiant</h6>
                <p class="text-gray-900 font-medium">{{ viewedReclamation.etudiant }}</p>
              </div>
              <div>
                <h6 class="text-sm font-medium text-gray-500 mb-1">Date</h6>
                <p class="text-gray-900">{{ formatDate(viewedReclamation.date) }}</p>
              </div>
              <div>
                <h6 class="text-sm font-medium text-gray-500 mb-1">Évaluation</h6>
                <div class="flex items-center">
                  <span class="text-yellow-500 mr-1">★</span>
                  <span class="font-medium">{{ viewedReclamation.evaluation }}/5</span>
                </div>
              </div>
              <div>
                <h6 class="text-sm font-medium text-gray-500 mb-1">Statut</h6>
                <span 
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    getStatusClass(viewedReclamation.statut)
                  ]"
                >
                  {{ viewedReclamation.statut }}
                </span>
              </div>
            </div>
            
            <div class="mb-4">
              <h6 class="text-sm font-medium text-gray-500 mb-1">Motif</h6>
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p class="text-gray-700 whitespace-pre-line">{{ viewedReclamation.motif }}</p>
              </div>
            </div>

            <div v-if="viewedReclamation.justificatif" class="mb-4">
              <h6 class="text-sm font-medium text-gray-500 mb-1">Justificatif</h6>
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p class="text-gray-700">{{ viewedReclamation.justificatif }}</p>
              </div>
            </div>

            <div v-if="viewedReclamation.reponse" class="mb-4">
              <h6 class="text-sm font-medium text-gray-500 mb-1">Réponse de l'administration</h6>
              <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p class="text-gray-700 whitespace-pre-line">{{ viewedReclamation.reponse }}</p>
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

    <!-- Modal de traitement -->
    <div v-if="showTraiterModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="modal-content">
          <form @submit.prevent="traiterReclamation">
            <div class="modal-header border-b border-gray-200 p-6">
              <h5 class="modal-title text-lg font-semibold text-gray-900">Traiter la réclamation</h5>
              <button type="button" @click="closeTraiterModal" class="btn-close text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="modal-body p-6 space-y-4">
              <div class="form-group text-start">
                <label for="nouveauStatut" class="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau statut <span class="text-rose-500">*</span>
                </label>
                <select 
                  id="nouveauStatut" 
                  v-model="traiterForm.nouveauStatut" 
                  required
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="En cours">En cours</option>
                  <option value="Résolue">Résolue</option>
                  <option value="Rejetée">Rejetée</option>
                </select>
              </div>

              <div class="form-group text-start">
                <label for="reponseAdmin" class="block text-sm font-medium text-gray-700 mb-2">
                  Réponse <span class="text-rose-500">*</span>
                </label>
                <textarea 
                  id="reponseAdmin" 
                  v-model="traiterForm.reponse" 
                  rows="4"
                  required
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Votre réponse à l'étudiant..."
                ></textarea>
              </div>
            </div>
            <div class="modal-footer border-t border-gray-200 p-6 flex justify-end gap-3">
              <button type="button" @click="closeTraiterModal" class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
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
              Voulez-vous vraiment supprimer cette réclamation ? Veuillez noter que cette action est irréversible. Continuer ?
            </p>
          </div>
          <div class="modal-footer border-t border-gray-200 p-6 flex justify-end gap-3">
            <form @submit.prevent="deleteReclamation" class="flex items-center gap-3">
              <input type="hidden" id="deleteReclamationForm" :value="selectedReclamation?.id" />
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
const filterStatut = ref("");
const showSelector = ref(false);
const selectedColumns = ref([]);
const showModal = ref(false);
const showViewModal = ref(false);
const showTraiterModal = ref(false);
const showDeleteModal = ref(false);
const modalTitle = ref('');
const selectedReclamation = ref(null);
const viewedReclamation = ref({});
const itemsPerPage = ref(50);
const loading = ref(false);

// Formulaire principal
const form = ref({
  id: null,
  etudiant: '',
  evaluation: 3,
  motif: '',
  justificatif: '',
  statut: 'En attente',
  reponse: ''
});

// Formulaire de traitement
const traiterForm = ref({
  id: null,
  nouveauStatut: 'En cours',
  reponse: ''
});

// Classes CSS pour les statuts
const getStatusClass = (statut) => {
  switch(statut) {
    case 'En attente':
      return 'bg-amber-100 text-amber-800';
    case 'En cours':
      return 'bg-blue-100 text-blue-800';
    case 'Résolue':
      return 'bg-emerald-100 text-emerald-800';
    case 'Rejetée':
      return 'bg-rose-100 text-rose-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Charger les réclamations depuis localStorage
const loadReclamations = () => {
  if (process.client) {
    const storedReclamations = localStorage.getItem('reclamations');
    if (storedReclamations) {
      return JSON.parse(storedReclamations);
    }
  }
  return [];
};

// Données initiales
const initialReclamations = [
  { 
    id: 1, 
    etudiant: "Jean Dupont", 
    evaluation: 2, 
    motif: "Note injuste en mathématiques", 
    justificatif: "https://example.com/justificatif1.pdf",
    statut: "En attente",
    date: "2024-12-10",
    reponse: ""
  },
  { 
    id: 2, 
    etudiant: "Marie Curie", 
    evaluation: 1, 
    motif: "Absence injustifiée lors de l'examen", 
    justificatif: "",
    statut: "En cours",
    date: "2024-12-09",
    reponse: "En investigation avec le professeur concerné"
  },
  { 
    id: 3, 
    etudiant: "Pierre Martin", 
    evaluation: 3, 
    motif: "Problème avec la salle d'examen", 
    justificatif: "Salle 205",
    statut: "Résolue",
    date: "2024-12-08",
    reponse: "Salle changée pour la prochaine session"
  },
  { 
    id: 4, 
    etudiant: "Sophie Bernard", 
    evaluation: 4, 
    motif: "Retard de publication des notes", 
    justificatif: "",
    statut: "Rejetée",
    date: "2024-12-07",
    reponse: "Délai normal de traitement respecté"
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
  let reclamations = loadReclamations();
  if (reclamations.length === 0) {
    reclamations = initialReclamations.map(rec => ({
      ...rec,
      formattedDate: formatDate(rec.date)
    }));
    if (process.client) {
      localStorage.setItem('reclamations', JSON.stringify(reclamations));
    }
  }
  rows.value = reclamations;
  selectedColumns.value = availableColumns.value.map(col => col.field);
});

const availableColumns = ref([
  { field: "id", title: "#", width: "80px", isUnique: true },
  { field: "etudiant", title: "Étudiant" },
  { field: "evaluation", title: "Évaluation" },
  { field: "motif", title: "Motif" },
  { field: "justificatif", title: "Justificatif" },
  { field: "statut", title: "Statut" },
  { field: "action", title: "Action", sort: false, width: "180px", type: "click" }
]);

// Colonnes filtrées selon la sélection
const filteredCols = computed(() => {
  return availableColumns.value.filter(col => 
    selectedColumns.value.includes(col.field)
  );
});

// Rows filtrées selon la recherche et le filtre de statut
const filteredRows = computed(() => {
  let filtered = rows.value;
  
  // Filtre par statut
  if (filterStatut.value) {
    filtered = filtered.filter(reclamation => 
      reclamation.statut === filterStatut.value
    );
  }
  
  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(reclamation => 
      reclamation.etudiant.toLowerCase().includes(query) ||
      reclamation.motif.toLowerCase().includes(query) ||
      reclamation.statut.toLowerCase().includes(query) ||
      reclamation.evaluation.toString().includes(query)
    );
  }
  
  return filtered.map(rec => ({
    ...rec,
    formattedDate: formatDate(rec.date)
  }));
});

const toggleSelector = () => {
  showSelector.value = !showSelector.value;
};

// Sauvegarder dans localStorage
const saveToLocalStorage = () => {
  if (process.client) {
    localStorage.setItem('reclamations', JSON.stringify(rows.value));
  }
};

// Gestion des modales
const openAddModal = () => {
  modalTitle.value = "Formulaire de création d'une réclamation";
  form.value = { 
    id: null, 
    etudiant: '', 
    evaluation: 3, 
    motif: '', 
    justificatif: '', 
    statut: 'En attente',
    date: new Date().toISOString().split('T')[0],
    reponse: ''
  };
  showModal.value = true;
};

const openEditModal = (reclamation) => {
  modalTitle.value = "Formulaire de modification d'une réclamation";
  form.value = { 
    id: reclamation.id,
    etudiant: reclamation.etudiant, 
    evaluation: reclamation.evaluation,
    motif: reclamation.motif,
    justificatif: reclamation.justificatif,
    statut: reclamation.statut,
    date: reclamation.date,
    reponse: reclamation.reponse || ''
  };
  showModal.value = true;
};

const openViewModal = (reclamation) => {
  viewedReclamation.value = {
    ...reclamation,
    formattedDate: formatDate(reclamation.date)
  };
  showViewModal.value = true;
};

const openTraiterModal = (reclamation) => {
  selectedReclamation.value = reclamation;
  traiterForm.value = {
    id: reclamation.id,
    nouveauStatut: reclamation.statut === 'En attente' ? 'En cours' : reclamation.statut,
    reponse: reclamation.reponse || ''
  };
  showTraiterModal.value = true;
};

const openDeleteModal = (reclamation) => {
  selectedReclamation.value = reclamation;
  showDeleteModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const closeViewModal = () => {
  showViewModal.value = false;
  viewedReclamation.value = {};
};

const closeTraiterModal = () => {
  showTraiterModal.value = false;
  traiterForm.value = { id: null, nouveauStatut: 'En cours', reponse: '' };
  selectedReclamation.value = null;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedReclamation.value = null;
};

// Ouvrir justificatif
const openJustificatif = (reclamation) => {
  if (reclamation.justificatif.startsWith('http')) {
    window.open(reclamation.justificatif, '_blank');
  } else {
    openViewModal(reclamation);
  }
};

// Gestion des réclamations
const saveReclamation = () => {
  if (form.value.id) {
    // Mise à jour
    const index = rows.value.findIndex(r => r.id === form.value.id);
    if (index !== -1) {
      rows.value[index] = {
        ...rows.value[index],
        etudiant: form.value.etudiant,
        evaluation: parseInt(form.value.evaluation),
        motif: form.value.motif,
        justificatif: form.value.justificatif,
        statut: form.value.statut,
        reponse: form.value.reponse,
        date: form.value.date
      };
    }
  } else {
    // Création
    const newId = rows.value.length > 0 
      ? Math.max(...rows.value.map(r => r.id)) + 1 
      : 1;
    
    const newReclamation = {
      id: newId,
      etudiant: form.value.etudiant,
      evaluation: parseInt(form.value.evaluation),
      motif: form.value.motif,
      justificatif: form.value.justificatif,
      statut: form.value.statut,
      reponse: form.value.reponse,
      date: form.value.date
    };
    
    rows.value.push(newReclamation);
  }
  
  saveToLocalStorage();
  closeModal();
};

const traiterReclamation = () => {
  if (traiterForm.value.id) {
    const index = rows.value.findIndex(r => r.id === traiterForm.value.id);
    if (index !== -1) {
      rows.value[index] = {
        ...rows.value[index],
        statut: traiterForm.value.nouveauStatut,
        reponse: traiterForm.value.reponse
      };
    }
    saveToLocalStorage();
    closeTraiterModal();
  }
};

const deleteReclamation = () => {
  if (selectedReclamation.value) {
    const index = rows.value.findIndex(r => r.id === selectedReclamation.value.id);
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

/* Style pour le range input */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  border-radius: 4px;
  background: #e5e7eb;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  border: none;
}
</style>