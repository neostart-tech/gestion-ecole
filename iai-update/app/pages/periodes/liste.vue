<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Administration</span>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Périodes</span>
    </div>

    <!-- Titre -->
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Liste des périodes</h1>

    <!-- Zone de recherche et filtres -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <!-- Recherche -->
      <input
        v-model="searchQuery"
        type="search"
        class="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        placeholder="Rechercher..."
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

      <!-- Bouton Ajouter période -->
      <button 
        @click="openAddModal"
        class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium whitespace-nowrap"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Ajouter une période
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
        <!-- Slot pour le statut actif -->
        <template #isActive="data">
          <span :class="[
            'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
            data.value 
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-gray-100 text-gray-800'
          ]">
            {{ data.value ? 'Active' : 'Inactive' }}
          </span>
        </template>

        <!-- Slot pour la durée -->
        <template #duree="data">
          <span class="text-sm text-gray-600">
            {{ calculateDuration(data.value.debut, data.value.fin) }}
          </span>
        </template>

        <!-- Slot pour les dates -->
        <template #debut="data">
          <div class="text-sm text-gray-900">
            {{ formatDate(data.value) }}
          </div>
        </template>

        <template #fin="data">
          <div class="text-sm text-gray-900">
            {{ formatDate(data.value) }}
          </div>
        </template>

        <!-- Slot pour les actions -->
        <template #action="data">
          <div class="flex items-center justify-center gap-2">
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
            
            <!-- Bouton Activer/Désactiver -->
            <button 
              @click="toggleActiveStatus(data.value)"
              :class="[
                'p-1.5 rounded transition-colors duration-200',
                data.value.isActive
                  ? 'text-amber-600 hover:text-amber-800 hover:bg-amber-50'
                  : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
              ]"
              :title="data.value.isActive ? 'Désactiver' : 'Activer'"
            >
              <svg v-if="data.value.isActive" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
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
          <form @submit.prevent="savePeriod">
            <div class="modal-header border-b border-gray-200 p-6">
              <h5 class="modal-title text-lg font-semibold text-gray-900">{{ modalTitle }}</h5>
              <button type="button" @click="closeModal" class="btn-close text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="modal-body p-6 space-y-4">
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
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Nom de la période"
                />
              </div>

              <!-- Code -->
              <div class="form-group text-start">
                <label for="code" class="block text-sm font-medium text-gray-700 mb-2">
                  Code
                </label>
                <input 
                  type="text" 
                  id="code" 
                  v-model="form.code" 
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase" 
                  placeholder="Code (ex: S1-2024)"
                />
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
                  placeholder="Description de la période..."
                ></textarea>
              </div>

              <!-- Date de début -->
              <div class="form-group text-start">
                <label for="debut" class="block text-sm font-medium text-gray-700 mb-2">
                  Date de début <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="date" 
                  id="debut" 
                  v-model="form.debut" 
                  required
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>

              <!-- Date de fin -->
              <div class="form-group text-start">
                <label for="fin" class="block text-sm font-medium text-gray-700 mb-2">
                  Date de fin <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="date" 
                  id="fin" 
                  v-model="form.fin" 
                  required
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>

              <!-- Type de période -->
              <div class="form-group text-start">
                <label for="type" class="block text-sm font-medium text-gray-700 mb-2">
                  Type de période
                </label>
                <select 
                  id="type" 
                  v-model="form.type" 
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Semestre">Semestre</option>
                  <option value="Trimestre">Trimestre</option>
                  <option value="Année">Année académique</option>
                  <option value="Session">Session d'examen</option>
                  <option value="Vacances">Vacances</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <!-- Statut -->
              <div class="form-group text-start">
                <label for="isActive" class="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    @click="form.isActive = !form.isActive"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      form.isActive ? 'bg-emerald-600' : 'bg-gray-300'
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        form.isActive ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    />
                  </button>
                  <span class="text-sm text-gray-700">
                    {{ form.isActive ? 'Période active' : 'Période inactive' }}
                  </span>
                </div>
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
              Voulez-vous vraiment supprimer la période "{{ selectedPeriod?.nom }}" ? Cette action est irréversible.
            </p>
          </div>
          <div class="modal-footer border-t border-gray-200 p-6 flex justify-end gap-3">
            <button 
              type="button" 
              @click="closeDeleteModal"
              class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button 
              type="button" 
              @click="deletePeriod"
              class="btn btn-warning px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
            >
              Supprimer définitivement
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
const showModal = ref(false);
const showDeleteModal = ref(false);
const modalTitle = ref('');
const selectedPeriod = ref(null);
const itemsPerPage = ref(50);
const loading = ref(false);

// Formulaire
const form = ref({
  id: null,
  nom: '',
  code: '',
  description: '',
  debut: '',
  fin: '',
  type: 'Semestre',
  isActive: true
});

// Charger les périodes depuis localStorage
const loadPeriods = () => {
  if (process.client) {
    const storedPeriods = localStorage.getItem('periods');
    if (storedPeriods) {
      return JSON.parse(storedPeriods);
    }
  }
  return [];
};

// Données initiales
const initialPeriods = [
  { 
    id: 1, 
    nom: 'Semestre 1', 
    code: 'S1-2024',
    description: 'Premier semestre académique 2024-2025',
    debut: '2024-09-15', 
    fin: '2025-04-11',
    type: 'Semestre',
    isActive: true
  },
  { 
    id: 2, 
    nom: 'Semestre Test', 
    code: 'ST-2024',
    description: 'Période de test pour les nouveaux étudiants',
    debut: '2024-05-15', 
    fin: '2024-05-19',
    type: 'Semestre',
    isActive: false
  },
  { 
    id: 3, 
    nom: 'Vacances d\'été', 
    code: 'VE-2024',
    description: 'Vacances estivales entre les années académiques',
    debut: '2024-07-01', 
    fin: '2024-08-31',
    type: 'Vacances',
    isActive: true
  },
  { 
    id: 4, 
    nom: 'Session d\'examen Juin', 
    code: 'SEJ-2024',
    description: 'Session d\'examen de juin pour toutes les filières',
    debut: '2024-06-10', 
    fin: '2024-06-30',
    type: 'Session',
    isActive: false
  },
  { 
    id: 5, 
    nom: 'Année académique 2024-2025', 
    code: 'AA-2025',
    description: 'Année académique complète 2024-2025',
    debut: '2024-09-01', 
    fin: '2025-06-30',
    type: 'Année',
    isActive: true
  }
];

const rows = ref([]);

// Initialiser les données
onMounted(() => {
  let periods = loadPeriods();
  if (periods.length === 0) {
    periods = initialPeriods;
    if (process.client) {
      localStorage.setItem('periods', JSON.stringify(periods));
    }
  }
  rows.value = periods;
  selectedColumns.value = availableColumns.value.map(col => col.field);
});

const availableColumns = ref([
  { field: "id", title: "#", width: "80px", isUnique: true },
  { field: "nom", title: "Nom", width: "200px" },
  { field: "code", title: "Code", width: "120px" },
  { field: "debut", title: "Début", width: "150px" },
  { field: "fin", title: "Fin", width: "150px" },
  { field: "duree", title: "Durée", width: "120px" },
  { field: "type", title: "Type", width: "120px" },
  { field: "isActive", title: "Statut", width: "100px" },
  { field: "description", title: "Description", width: "300px" },
  { field: "action", title: "Actions", sort: false, width: "150px", type: "click" }
]);

// Colonnes filtrées selon la sélection
const filteredCols = computed(() => {
  return availableColumns.value.filter(col => 
    selectedColumns.value.includes(col.field)
  );
});

// Rows filtrées selon la recherche
const filteredRows = computed(() => {
  if (!searchQuery.value) return rows.value;
  
  const query = searchQuery.value.toLowerCase();
  return rows.value.filter(period => 
    period.nom.toLowerCase().includes(query) ||
    period.code.toLowerCase().includes(query) ||
    period.description.toLowerCase().includes(query) ||
    period.type.toLowerCase().includes(query)
  );
});

// Formater la date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Calculer la durée
const calculateDuration = (debut, fin) => {
  const start = new Date(debut);
  const end = new Date(fin);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays} jour(s)`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    return `${months} mois${days > 0 ? ` ${days} jour(s)` : ''}`;
  } else {
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    return `${years} an(s)${months > 0 ? ` ${months} mois` : ''}`;
  }
};

const toggleSelector = () => {
  showSelector.value = !showSelector.value;
};

// Sauvegarder dans localStorage
const saveToLocalStorage = () => {
  if (process.client) {
    localStorage.setItem('periods', JSON.stringify(rows.value));
  }
};

// Gestion des modales
const openAddModal = () => {
  modalTitle.value = "Formulaire de création d'une période";
  const today = new Date().toISOString().split('T')[0];
  form.value = {
    id: null,
    nom: '',
    code: '',
    description: '',
    debut: today,
    fin: today,
    type: 'Semestre',
    isActive: true
  };
  showModal.value = true;
};

const openEditModal = (period) => {
  modalTitle.value = "Formulaire de modification d'une période";
  form.value = {
    id: period.id,
    nom: period.nom,
    code: period.code || '',
    description: period.description || '',
    debut: period.debut,
    fin: period.fin,
    type: period.type || 'Semestre',
    isActive: period.isActive
  };
  showModal.value = true;
};

const openDeleteModal = (period) => {
  selectedPeriod.value = period;
  showDeleteModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedPeriod.value = null;
};

// Gestion des périodes
const savePeriod = () => {
  // Validation
  if (!form.value.nom.trim()) {
    alert('Le nom est obligatoire');
    return;
  }
  
  if (!form.value.debut || !form.value.fin) {
    alert('Les dates de début et de fin sont obligatoires');
    return;
  }
  
  const debut = new Date(form.value.debut);
  const fin = new Date(form.value.fin);
  
  if (debut > fin) {
    alert('La date de début doit être antérieure à la date de fin');
    return;
  }
  
  if (form.value.id) {
    // Mise à jour
    const index = rows.value.findIndex(p => p.id === form.value.id);
    if (index !== -1) {
      rows.value[index] = {
        ...rows.value[index],
        nom: form.value.nom,
        code: form.value.code,
        description: form.value.description,
        debut: form.value.debut,
        fin: form.value.fin,
        type: form.value.type,
        isActive: form.value.isActive
      };
    }
  } else {
    // Création
    const newId = rows.value.length > 0 
      ? Math.max(...rows.value.map(p => p.id)) + 1 
      : 1;
    
    const newPeriod = {
      id: newId,
      nom: form.value.nom,
      code: form.value.code,
      description: form.value.description,
      debut: form.value.debut,
      fin: form.value.fin,
      type: form.value.type,
      isActive: form.value.isActive
    };
    
    rows.value.push(newPeriod);
  }
  
  saveToLocalStorage();
  closeModal();
};

const deletePeriod = () => {
  if (selectedPeriod.value) {
    const index = rows.value.findIndex(p => p.id === selectedPeriod.value.id);
    if (index !== -1) {
      rows.value.splice(index, 1);
    }
    saveToLocalStorage();
    closeDeleteModal();
  }
};

// Basculer le statut actif
const toggleActiveStatus = (period) => {
  const index = rows.value.findIndex(p => p.id === period.id);
  if (index !== -1) {
    rows.value[index].isActive = !rows.value[index].isActive;
    saveToLocalStorage();
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