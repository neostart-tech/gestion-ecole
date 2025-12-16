<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Opportunités</span>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Liste</span>
    </div>

    <!-- Titre -->
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Liste des opportunités</h1>

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

      <!-- Bouton Ajouter opportunité -->
      <button 
        @click="openAddModal"
        class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium whitespace-nowrap"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Ajouter une annonce
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
        <!-- Slot pour le status -->
        <template #status="data">
          <span :class="[
            'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
            data.value === 'Publiée' 
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-rose-100 text-rose-800'
          ]">
            {{ data.value }}
          </span>
        </template>

        <!-- Slot pour le titre -->
        <template #titre="data">
          <div class="max-w-xs truncate font-medium text-gray-900" :title="data.value">
            {{ data.value }}
          </div>
        </template>

        <!-- Slot pour la description -->
        <template #description="data">
          <div class="max-w-xs truncate text-sm text-gray-600" :title="data.value">
            {{ data.value || 'Aucune description' }}
          </div>
        </template>

        <!-- Slot pour la date -->
        <template #date="data">
          <div class="text-sm text-gray-600 whitespace-nowrap">
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
            
            <!-- Bouton Publier/Dépublier -->
            <button 
              @click="togglePublishStatus(data.value)"
              :class="[
                'p-1.5 rounded transition-colors duration-200',
                data.value.status === 'Publiée'
                  ? 'text-amber-600 hover:text-amber-800 hover:bg-amber-50'
                  : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
              ]"
              :title="data.value.status === 'Publiée' ? 'Dépublier' : 'Publier'"
            >
              <svg v-if="data.value.status === 'Publiée'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <form @submit.prevent="saveOpportunity">
            <div class="modal-header border-b border-gray-200 p-6">
              <h5 class="modal-title text-lg font-semibold text-gray-900">{{ modalTitle }}</h5>
              <button type="button" @click="closeModal" class="btn-close text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="modal-body p-6 space-y-4">
              <!-- Titre -->
              <div class="form-group text-start">
                <label for="titre" class="block text-sm font-medium text-gray-700 mb-2">
                  Titre <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="titre" 
                  v-model="form.titre" 
                  required
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Titre de l'opportunité"
                />
              </div>

              <!-- Annonceur -->
              <div class="form-group text-start">
                <label for="annonceur" class="block text-sm font-medium text-gray-700 mb-2">
                  Annonceur <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="annonceur" 
                  v-model="form.annonceur" 
                  required
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Nom de l'annonceur"
                />
              </div>

              <!-- Date -->
              <div class="form-group text-start">
                <label for="date" class="block text-sm font-medium text-gray-700 mb-2">
                  Date <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="date" 
                  id="date" 
                  v-model="form.date" 
                  required
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
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
                  rows="4"
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Description détaillée de l'opportunité..."
                ></textarea>
              </div>

              <!-- Type d'opportunité -->
              <div class="form-group text-start">
                <label for="type" class="block text-sm font-medium text-gray-700 mb-2">
                  Type d'opportunité
                </label>
                <select 
                  id="type" 
                  v-model="form.type" 
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Alternance">Alternance</option>
                  <option value="Stage">Stage</option>
                  <option value="Emploi">Emploi</option>
                  <option value="Formation">Formation</option>
                  <option value="Bourse">Bourse</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <!-- Statut -->
              <div class="form-group text-start">
                <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select 
                  id="status" 
                  v-model="form.status" 
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Publiée">Publiée</option>
                  <option value="Non publiée">Non publiée</option>
                </select>
              </div>

              <!-- Lien -->
              <div class="form-group text-start">
                <label for="lien" class="block text-sm font-medium text-gray-700 mb-2">
                  Lien (URL)
                </label>
                <input 
                  type="url" 
                  id="lien" 
                  v-model="form.lien" 
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="https://example.com/opportunite"
                />
              </div>

              <!-- Filières concernées -->
              <div class="form-group text-start">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Filières concernées
                </label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <label v-for="filiere in filieresOptions" :key="filiere.id" class="flex items-center gap-2">
                    <input
                      type="checkbox"
                      :value="filiere.id"
                      v-model="form.filieres"
                      class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span class="text-sm text-gray-700">{{ filiere.nom }}</span>
                  </label>
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
              Voulez-vous vraiment supprimer l'opportunité "{{ selectedOpportunity?.titre }}" ? Cette action est irréversible.
            </p>
          </div>
          <div class="modal-footer border-t border-gray-200 p-6 flex justify-end gap-3">
            <button 
              type="button" 
              @click="closeDeleteModal"
              class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Retour
            </button>
            <button 
              type="button" 
              @click="deleteOpportunity"
              class="btn btn-warning px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
            >
              Continuer la suppression
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
const selectedOpportunity = ref(null);
const itemsPerPage = ref(50);
const loading = ref(false);

// Formulaire
const form = ref({
  id: null,
  titre: '',
  annonceur: '',
  date: new Date().toISOString().split('T')[0],
  description: '',
  type: 'Alternance',
  status: 'Non publiée',
  lien: '',
  filieres: []
});

// Options des filières
const filieresOptions = ref([
  { id: 1, nom: 'GLSI' },
  { id: 2, nom: 'ASR' },
  { id: 3, nom: 'MTWI' },
  { id: 4, nom: 'TC_1' },
  { id: 5, nom: 'TC_2' }
]);

// Charger les opportunités depuis localStorage
const loadOpportunities = () => {
  if (process.client) {
    const storedOpportunities = localStorage.getItem('opportunities');
    if (storedOpportunities) {
      return JSON.parse(storedOpportunities);
    }
  }
  return [];
};

// Données initiales selon votre exemple
const initialOpportunities = [
  { 
    id: 1, 
    titre: "Officia corrupti as", 
    annonceur: "TechSol", 
    date: "2024-06-14", 
    description: "Opportunité technique pour les développeurs",
    type: "Emploi",
    status: "Non publiée",
    lien: "",
    filieres: [1, 3]
  },
  { 
    id: 2, 
    titre: "Opportunité d'Alternance pour les Étudiants de Troisième Année", 
    annonceur: "TechSol", 
    date: "2024-06-10", 
    description: "Alternance d'un an pour les étudiants en dernière année",
    type: "Alternance",
    status: "Publiée",
    lien: "https://techsol.com/alternance",
    filieres: [1, 2, 3]
  },
  { 
    id: 3, 
    titre: "Stage Été 2024 - Développement Web", 
    annonceur: "WebCorp", 
    date: "2024-06-05", 
    description: "Stage de 3 mois en développement web fullstack",
    type: "Stage",
    status: "Publiée",
    lien: "https://webcorp.com/stages",
    filieres: [1, 3, 4]
  },
  { 
    id: 4, 
    titre: "Formation Certifiante en Cybersécurité", 
    annonceur: "SecurIT", 
    date: "2024-06-01", 
    description: "Formation intensive de 2 mois en cybersécurité",
    type: "Formation",
    status: "Non publiée",
    lien: "https://securit.com/formation",
    filieres: [2, 5]
  },
  { 
    id: 5, 
    titre: "Bourse d'Excellence pour Étudiants en Informatique", 
    annonceur: "Fondation TechEdu", 
    date: "2024-05-28", 
    description: "Bourse couvrant les frais de scolarité pour l'année académique",
    type: "Bourse",
    status: "Publiée",
    lien: "https://techedu.org/bourses",
    filieres: [1, 2, 3, 4, 5]
  }
];

const rows = ref([]);

// Initialiser les données
onMounted(() => {
  let opportunities = loadOpportunities();
  if (opportunities.length === 0) {
    opportunities = initialOpportunities;
    if (process.client) {
      localStorage.setItem('opportunities', JSON.stringify(opportunities));
    }
  }
  rows.value = opportunities;
  selectedColumns.value = availableColumns.value.map(col => col.field);
});

const availableColumns = ref([
  { field: "id", title: "#", width: "80px", isUnique: true },
  { field: "titre", title: "Titre", width: "300px" },
  { field: "annonceur", title: "Annonceur", width: "150px" },
  { field: "date", title: "Date", width: "150px" },
  { field: "description", title: "Description", width: "300px" },
  { field: "type", title: "Type", width: "120px" },
  { field: "status", title: "Status", width: "120px" },
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
  return rows.value.filter(opportunity => 
    opportunity.titre.toLowerCase().includes(query) ||
    opportunity.annonceur.toLowerCase().includes(query) ||
    opportunity.description.toLowerCase().includes(query) ||
    opportunity.type.toLowerCase().includes(query) ||
    opportunity.status.toLowerCase().includes(query)
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

const toggleSelector = () => {
  showSelector.value = !showSelector.value;
};

// Sauvegarder dans localStorage
const saveToLocalStorage = () => {
  if (process.client) {
    localStorage.setItem('opportunities', JSON.stringify(rows.value));
  }
};

// Gestion des modales
const openAddModal = () => {
  modalTitle.value = "Formulaire de création d'une opportunité";
  form.value = {
    id: null,
    titre: '',
    annonceur: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    type: 'Alternance',
    status: 'Non publiée',
    lien: '',
    filieres: []
  };
  showModal.value = true;
};

const openEditModal = (opportunity) => {
  modalTitle.value = "Formulaire de modification d'une opportunité";
  form.value = {
    id: opportunity.id,
    titre: opportunity.titre,
    annonceur: opportunity.annonceur,
    date: opportunity.date,
    description: opportunity.description || '',
    type: opportunity.type || 'Alternance',
    status: opportunity.status || 'Non publiée',
    lien: opportunity.lien || '',
    filieres: opportunity.filieres || []
  };
  showModal.value = true;
};

const openDeleteModal = (opportunity) => {
  selectedOpportunity.value = opportunity;
  showDeleteModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedOpportunity.value = null;
};

// Gestion des opportunités
const saveOpportunity = () => {
  if (form.value.id) {
    // Mise à jour
    const index = rows.value.findIndex(o => o.id === form.value.id);
    if (index !== -1) {
      rows.value[index] = {
        ...rows.value[index],
        titre: form.value.titre,
        annonceur: form.value.annonceur,
        date: form.value.date,
        description: form.value.description,
        type: form.value.type,
        status: form.value.status,
        lien: form.value.lien,
        filieres: form.value.filieres
      };
    }
  } else {
    // Création
    const newId = rows.value.length > 0 
      ? Math.max(...rows.value.map(o => o.id)) + 1 
      : 1;
    
    const newOpportunity = {
      id: newId,
      titre: form.value.titre,
      annonceur: form.value.annonceur,
      date: form.value.date,
      description: form.value.description,
      type: form.value.type,
      status: form.value.status,
      lien: form.value.lien,
      filieres: form.value.filieres
    };
    
    rows.value.push(newOpportunity);
  }
  
  saveToLocalStorage();
  closeModal();
};

const deleteOpportunity = () => {
  if (selectedOpportunity.value) {
    const index = rows.value.findIndex(o => o.id === selectedOpportunity.value.id);
    if (index !== -1) {
      rows.value.splice(index, 1);
    }
    saveToLocalStorage();
    closeDeleteModal();
  }
};

// Basculer le statut de publication
const togglePublishStatus = (opportunity) => {
  const index = rows.value.findIndex(o => o.id === opportunity.id);
  if (index !== -1) {
    rows.value[index].status = rows.value[index].status === 'Publiée' ? 'Non publiée' : 'Publiée';
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