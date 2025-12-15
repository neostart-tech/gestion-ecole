<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Évènements</span>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Liste</span>
    </div>

    <!-- Titre -->
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Liste des évènements</h1>

    <!-- Zone de recherche et filtres -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <!-- Recherche -->
      <input
        v-model="searchQuery"
        type="search"
        class="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        placeholder="Rechercher un évènement..."
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
          <option value="50" selected>50</option>
          <option value="100">100</option>
        </select>
        <span class="text-gray-600 whitespace-nowrap">éléments</span>
      </div>

      <!-- Bouton Ajouter évènement -->
      <button 
        @click="openAddModal"
        class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium whitespace-nowrap"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Ajouter un évènement
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
        <!-- Slot pour les dates -->
        <template #dates="data">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {{ data.value }}
          </span>
        </template>

        <!-- Slot pour la description -->
        <template #description="data">
          <div class="max-w-xs truncate" :title="data.value">
            {{ data.value || 'Aucune description...' }}
          </div>
        </template>

        <!-- Slot pour le statut -->
        <template #statut="data">
          <span :class="`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(data.value)}`">
            {{ getStatusText(data.value) }}
          </span>
        </template>

        <!-- Slot pour les actions -->
        <template #action="data">
          <div class="flex items-center justify-center gap-2">
            <!-- Bouton Détail -->
            <button 
              @click="openDetailModal(data.value)"
              class="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200"
              title="Détails"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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

    <!-- Modal de détail -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div class="modal-content">
          <div class="modal-header border-b border-gray-200 p-6">
            <h5 class="modal-title text-lg font-semibold text-gray-900">Détails de l'évènement</h5>
            <button type="button" @click="closeDetailModal" class="btn-close text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="modal-body p-6 overflow-y-auto">
            <div class="space-y-6">
              <div v-if="selectedEvent">
                <!-- Informations principales -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 class="text-sm font-medium text-gray-500 mb-1">Titre</h3>
                    <p class="text-lg font-semibold text-gray-900">{{ selectedEvent.titre }}</p>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-gray-500 mb-1">Statut</h3>
                    <span :class="`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(selectedEvent.statut)}`">
                      {{ getStatusText(selectedEvent.statut) }}
                    </span>
                  </div>
                </div>

                <!-- Dates -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 class="text-sm font-medium text-gray-500 mb-1">Date de publication</h3>
                    <p class="text-gray-900">{{ selectedEvent.publicationDate }}</p>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-gray-500 mb-1">Dates de l'évènement</h3>
                    <p class="text-gray-900">{{ selectedEvent.dates }}</p>
                  </div>
                </div>

                <!-- Localisation -->
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-1">Lieu</h3>
                  <p class="text-gray-900">{{ selectedEvent.location || 'Non spécifié' }}</p>
                </div>

                <!-- Organisateur -->
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-1">Organisateur</h3>
                  <p class="text-gray-900">{{ selectedEvent.organizer || 'Non spécifié' }}</p>
                </div>

                <!-- Description -->
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-1">Description</h3>
                  <p class="text-gray-900 whitespace-pre-line">{{ selectedEvent.description || 'Aucune description disponible' }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-t border-gray-200 p-6 flex justify-end">
            <button 
              type="button" 
              @click="closeDetailModal"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout/modification -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div class="modal-content">
          <form @submit.prevent="saveEvent">
            <div class="modal-header border-b border-gray-200 p-6">
              <h5 class="modal-title text-lg font-semibold text-gray-900">{{ modalTitle }}</h5>
              <button type="button" @click="closeModal" class="btn-close text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="modal-body p-6 space-y-4 overflow-y-auto">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="Titre de l'évènement"
                  />
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
                    <option value="published">Publié</option>
                    <option value="scheduled">Planifié</option>
                    <option value="draft">Brouillon</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>

                <div class="form-group text-start">
                  <label for="publicationDate" class="block text-sm font-medium text-gray-700 mb-2">
                    Date de publication <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    id="publicationDate" 
                    v-model="form.publicationDate" 
                    required
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>

                <div class="form-group text-start">
                  <label for="dates" class="block text-sm font-medium text-gray-700 mb-2">
                    Dates de l'évènement <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="dates" 
                    v-model="form.dates" 
                    required
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Ex: 12 septembre 2024 ou 18-25 novembre 2024"
                  />
                </div>

                <div class="form-group text-start">
                  <label for="location" class="block text-sm font-medium text-gray-700 mb-2">
                    Lieu
                  </label>
                  <input 
                    type="text" 
                    id="location" 
                    v-model="form.location" 
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Lieu de l'évènement"
                  />
                </div>

                <div class="form-group text-start">
                  <label for="organizer" class="block text-sm font-medium text-gray-700 mb-2">
                    Organisateur
                  </label>
                  <input 
                    type="text" 
                    id="organizer" 
                    v-model="form.organizer" 
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Organisateur de l'évènement"
                  />
                </div>
              </div>

              <div class="form-group text-start">
                <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea 
                  id="description" 
                  v-model="form.description" 
                  rows="4"
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Description détaillée de l'évènement..."
                ></textarea>
              </div>
            </div>
            <div class="modal-footer border-t border-gray-200 p-6 flex justify-end gap-3">
              <button type="button" @click="closeModal" class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Annuler
              </button>
              <button type="submit" class="btn btn-primary px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                {{ form.id ? 'Mettre à jour' : 'Créer' }}
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
            <h5 class="modal-title text-lg font-semibold text-gray-900">Suppression d'évènement</h5>
            <button type="button" @click="closeDeleteModal" class="btn-close text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="modal-body p-6">
            <div class="text-center mb-6">
              <svg class="w-16 h-16 text-rose-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p class="text-gray-700 mb-2 font-medium">Êtes-vous sûr de vouloir supprimer cet évènement ?</p>
              <p class="text-gray-600 text-sm">Cette action est irréversible. L'évènement sera définitivement supprimé.</p>
            </div>
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
              @click="deleteEvent"
              class="btn btn-warning px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
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
const showDetailModal = ref(false);
const showDeleteModal = ref(false);
const modalTitle = ref('');
const selectedEvent = ref(null);
const itemsPerPage = ref(50);
const loading = ref(false);

// Formulaire
const form = ref({
  id: null,
  titre: '',
  publicationDate: '',
  dates: '',
  description: '',
  location: '',
  organizer: '',
  statut: 'published'
});

// Données initiales des évènements
const initialEvents = [
  { 
    id: 1, 
    titre: "Test to update", 
    publicationDate: "05 juillet 2024", 
    dates: "05 juillet 2024",
    description: "Cet évènement est un test pour vérifier les fonctionnalités de mise à jour.",
    location: "Salle de conférence principale",
    organizer: "Administration IAI Togo",
    statut: "published"
  },
  { 
    id: 2, 
    titre: "Journée Portes Ouvertes : Découvrez l'IAI-Togo", 
    publicationDate: "04 juillet 2024", 
    dates: "18 novembre 2024 - 25 novembre 2024",
    description: "Venez découvrir les formations et opportunités offertes par l'IAI Togo.",
    location: "Campus IAI Togo, Lomé",
    organizer: "Service des admissions",
    statut: "scheduled"
  },
  { 
    id: 3, 
    titre: "Conférence Annuelle sur l'Intelligence Artificielle", 
    publicationDate: "04 juillet 2024", 
    dates: "12 septembre 2024",
    description: "Conférence réunissant les experts en IA du Togo et de la sous-région.",
    location: "Hôtel Sarakawa, Lomé",
    organizer: "Département de Recherche IAI Togo",
    statut: "published"
  },
  { 
    id: 4, 
    titre: "Atelier de programmation Python", 
    publicationDate: "03 juillet 2024", 
    dates: "20 août 2024 - 22 août 2024",
    description: "Atelier intensif de 3 jours pour maîtriser les bases de Python et ses librairies scientifiques.",
    location: "Laboratoire informatique B",
    organizer: "Club Python IAI",
    statut: "scheduled"
  },
  { 
    id: 5, 
    titre: "Séminaire sur la Cybersécurité", 
    publicationDate: "02 juillet 2024", 
    dates: "30 septembre 2024",
    description: "Séminaire sur les dernières menaces en cybersécurité et les bonnes pratiques de protection des données.",
    location: "Amphithéâtre 300 places",
    organizer: "Département Cybersécurité",
    statut: "draft"
  }
];

const rows = ref([]);

// Initialiser les données
onMounted(() => {
  let events = loadEvents();
  if (events.length === 0) {
    events = initialEvents;
    saveToLocalStorage();
  }
  rows.value = events;
  selectedColumns.value = availableColumns.value.map(col => col.field);
});

// Charger les évènements depuis localStorage
const loadEvents = () => {
  if (process.client) {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      return JSON.parse(storedEvents);
    }
  }
  return [];
};

// Sauvegarder dans localStorage
const saveToLocalStorage = () => {
  if (process.client) {
    localStorage.setItem('events', JSON.stringify(rows.value));
  }
};

// Colonnes disponibles
const availableColumns = ref([
  { field: "id", title: "#", width: "80px", isUnique: true },
  { field: "titre", title: "Titre" },
  { field: "publicationDate", title: "Date de publication" },
  { field: "dates", title: "Dates" },
  { field: "statut", title: "Statut" },
  { field: "description", title: "Description" },
  { field: "action", title: "Actions", sort: false, width: "180px", type: "click" }
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
  return rows.value.filter(event => 
    event.titre.toLowerCase().includes(query) ||
    event.publicationDate.toLowerCase().includes(query) ||
    event.dates.toLowerCase().includes(query) ||
    event.description.toLowerCase().includes(query) ||
    event.location?.toLowerCase().includes(query) ||
    event.organizer?.toLowerCase().includes(query) ||
    getStatusText(event.statut).toLowerCase().includes(query)
  );
});

// Classes CSS pour les statuts
const getStatusClass = (statut) => {
  switch (statut) {
    case 'published': return 'bg-green-100 text-green-800';
    case 'scheduled': return 'bg-blue-100 text-blue-800';
    case 'draft': return 'bg-yellow-100 text-yellow-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Texte pour les statuts
const getStatusText = (statut) => {
  switch (statut) {
    case 'published': return 'Publié';
    case 'scheduled': return 'Planifié';
    case 'draft': return 'Brouillon';
    case 'cancelled': return 'Annulé';
    default: return 'Inconnu';
  }
};

const toggleSelector = () => {
  showSelector.value = !showSelector.value;
};

// Gestion des modales
const openAddModal = () => {
  modalTitle.value = "Créer un nouvel évènement";
  const today = new Date().toISOString().split('T')[0];
  form.value = { 
    id: null, 
    titre: '', 
    publicationDate: today,
    dates: '',
    description: '',
    location: '',
    organizer: '',
    statut: 'published'
  };
  showModal.value = true;
};

const openDetailModal = (event) => {
  selectedEvent.value = event;
  showDetailModal.value = true;
};

const openEditModal = (event) => {
  modalTitle.value = "Modifier l'évènement";
  form.value = { 
    id: event.id,
    titre: event.titre,
    publicationDate: event.publicationDate,
    dates: event.dates,
    description: event.description,
    location: event.location || '',
    organizer: event.organizer || '',
    statut: event.statut
  };
  showModal.value = true;
};

const openDeleteModal = (event) => {
  selectedEvent.value = event;
  showDeleteModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedEvent.value = null;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedEvent.value = null;
};

// Gestion des évènements
const saveEvent = () => {
  if (form.value.id) {
    // Mise à jour
    const index = rows.value.findIndex(e => e.id === form.value.id);
    if (index !== -1) {
      rows.value[index] = {
        ...rows.value[index],
        ...form.value
      };
    }
  } else {
    // Création
    const newId = rows.value.length > 0 
      ? Math.max(...rows.value.map(e => e.id)) + 1 
      : 1;
    
    const newEvent = {
      id: newId,
      ...form.value
    };
    
    rows.value.push(newEvent);
  }
  
  saveToLocalStorage();
  closeModal();
};

const deleteEvent = () => {
  if (selectedEvent.value) {
    const index = rows.value.findIndex(e => e.id === selectedEvent.value.id);
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

/* Style pour la colonne dates */
:deep(.bh-table td:nth-child(4)) {
  white-space: nowrap;
}
</style>