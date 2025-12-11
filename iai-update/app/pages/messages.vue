<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Accueil</span>
      <span>/</span>
      
      <span class="text-gray-900 font-medium cursor-default">Liste</span>
    </div>

    <!-- Titre -->
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Liste des Messages</h1>

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

      
      <!-- Bouton Ajouter message -->
      <button 
        @click="openAddModal"
        class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium whitespace-nowrap"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Ajouter un message
      </button>

      <!-- Bouton Marquer tous comme lu -->
     
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
              data.value === 'Lu' 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-amber-100 text-amber-800'
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
              title="Voir le message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <!-- Bouton Marquer comme lu/non lu -->
            <button 
              @click="toggleReadStatus(data.value)"
              class="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors duration-200"
              :title="data.value.statut === 'Lu' ? 'Marquer comme non lu' : 'Marquer comme lu'"
            >
              <svg v-if="data.value.statut === 'Non lu'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div class="modal-content">
          <form @submit.prevent="saveMessage">
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
                <label for="titre" class="block text-sm font-medium text-gray-700 mb-2">
                  Titre <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="titre" 
                  v-model="form.titre" 
                  required
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Titre du message"
                />
              </div>

              <div class="form-group text-start">
                <label for="auteur" class="block text-sm font-medium text-gray-700 mb-2">
                  Auteur <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="auteur" 
                  v-model="form.auteur" 
                  required
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Nom de l'auteur"
                />
              </div>

              <div class="form-group text-start">
                <label for="contenu" class="block text-sm font-medium text-gray-700 mb-2">
                  Contenu <span class="text-rose-500">*</span>
                </label>
                <textarea 
                  id="contenu" 
                  v-model="form.contenu" 
                  rows="6"
                  required
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Contenu du message"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <option value="Non lu">Non lu</option>
                    <option value="Lu">Lu</option>
                  </select>
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

        </div>
      </div>
    </div>
    

    <!-- Modal de visualisation -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div class="modal-content">
          <div class="modal-header border-b border-gray-200 p-6">
            <h5 class="modal-title text-lg font-semibold text-gray-900">Détails du message</h5>
            <button type="button" @click="closeViewModal" class="btn-close text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="modal-body p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h6 class="text-sm font-medium text-gray-500 mb-1">Auteur</h6>
                <p class="text-gray-900">{{ viewedMessage.auteur }}</p>
              </div>
              <div>
                <h6 class="text-sm font-medium text-gray-500 mb-1">Date</h6>
                <p class="text-gray-900">{{ formatDate(viewedMessage.date) }}</p>
              </div>
            </div>
            
            <div class="mb-4">
              <h6 class="text-sm font-medium text-gray-500 mb-1">Titre</h6>
              <p class="text-gray-900 text-lg font-semibold">{{ viewedMessage.titre }}</p>
            </div>
            
            <div>
              <h6 class="text-sm font-medium text-gray-500 mb-1">Contenu</h6>
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p class="text-gray-700 whitespace-pre-line">{{ viewedMessage.contenu }}</p>
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
              Voulez-vous vraiment supprimer ce message ? Veuillez noter que cette action est irréversible. Continuer ?
            </p>
          </div>
          <div class="modal-footer border-t border-gray-200 p-6 flex justify-end gap-3">
            <form @submit.prevent="deleteMessage" class="flex items-center gap-3">
              <input type="hidden" id="deleteMessageForm" :value="selectedMessage?.id" />
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
const showSelector = ref(false);
const selectedColumns = ref([]);
const showModal = ref(false);
const showViewModal = ref(false);
const showDeleteModal = ref(false);
const modalTitle = ref('');
const selectedMessage = ref(null);
const viewedMessage = ref({});
const itemsPerPage = ref(50);
const loading = ref(false);

// Formulaire
const form = ref({
  id: null,
  titre: '',
  auteur: '',
  contenu: '',
  date: '',
  statut: 'Non lu'
});

// Charger les messages depuis localStorage
const loadMessages = () => {
  if (process.client) {
    const storedMessages = localStorage.getItem('messages');
    if (storedMessages) {
      return JSON.parse(storedMessages);
    }
  }
  return [];
};

// Données initiales selon votre exemple
const initialMessages = [
  { 
    id: 1, 
    titre: "Demande d'information", 
    auteur: "Ezéchiel Godwill SOSSOU-GAH", 
    date: "2024-07-05", 
    statut: "Non lu",
    contenu: "Bonjour, je souhaiterais avoir plus d'informations sur les cours de programmation."
  },
  { 
    id: 2, 
    titre: "Problème technique", 
    auteur: "Battle", 
    date: "2024-07-05", 
    statut: "Lu",
    contenu: "Je rencontre des difficultés pour accéder à la plateforme en ligne."
  },
  { 
    id: 3, 
    titre: "Demande de rendez-vous", 
    auteur: "Ezéchiel Godwill SOSSOU-GAH", 
    date: "2024-07-05", 
    statut: "Non lu",
    contenu: "Je souhaiterais prendre rendez-vous pour discuter de mon projet."
  },
  { 
    id: 4, 
    titre: "Question administrative", 
    auteur: "Mullins", 
    date: "2024-07-05", 
    statut: "Lu",
    contenu: "Pouvez-vous m'indiquer les documents nécessaires pour l'inscription ?"
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
  let messages = loadMessages();
  if (messages.length === 0) {
    messages = initialMessages.map(msg => ({
      ...msg,
      formattedDate: formatDate(msg.date)
    }));
    if (process.client) {
      localStorage.setItem('messages', JSON.stringify(messages));
    }
  }
  rows.value = messages;
  selectedColumns.value = availableColumns.value.map(col => col.field);
});

const availableColumns = ref([
  { field: "id", title: "#", width: "80px", isUnique: true },
  { field: "titre", title: "Titre" },
  { field: "auteur", title: "Auteur" },
  { field: "date", title: "Date de réception" },
  { field: "statut", title: "Statut" },
  { field: "action", title: "Action", sort: false, width: "150px", type: "click" }
]);

// Colonnes filtrées selon la sélection
const filteredCols = computed(() => {
  return availableColumns.value.filter(col => 
    selectedColumns.value.includes(col.field)
  );
});

// Rows filtrées selon la recherche avec date formatée
const filteredRows = computed(() => {
  const rowsWithFormattedDate = rows.value.map(row => ({
    ...row,
    formattedDate: formatDate(row.date)
  }));

  if (!searchQuery.value) return rowsWithFormattedDate;
  
  const query = searchQuery.value.toLowerCase();
  return rowsWithFormattedDate.filter(message => 
    message.titre.toLowerCase().includes(query) ||
    message.auteur.toLowerCase().includes(query) ||
    message.formattedDate.toLowerCase().includes(query) ||
    message.statut.toLowerCase().includes(query)
  );
});

const toggleSelector = () => {
  showSelector.value = !showSelector.value;
};

// Sauvegarder dans localStorage
const saveToLocalStorage = () => {
  if (process.client) {
    localStorage.setItem('messages', JSON.stringify(rows.value));
  }
};

// Gestion des modales
const openAddModal = () => {
  modalTitle.value = "Formulaire de création d'un message";
  form.value = { 
    id: null, 
    titre: '', 
    auteur: '', 
    contenu: '', 
    date: new Date().toISOString().split('T')[0], 
    statut: 'Non lu' 
  };
  showModal.value = true;
};

const openEditModal = (message) => {
  modalTitle.value = "Formulaire de modification d'un message";
  form.value = { 
    id: message.id,
    titre: message.titre, 
    auteur: message.auteur,
    contenu: message.contenu,
    date: message.date,
    statut: message.statut
  };
  showModal.value = true;
};

const openViewModal = (message) => {
  viewedMessage.value = {
    ...message,
    formattedDate: formatDate(message.date)
  };
  showViewModal.value = true;
};

const openDeleteModal = (message) => {
  selectedMessage.value = message;
  showDeleteModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const closeViewModal = () => {
  showViewModal.value = false;
  viewedMessage.value = {};
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedMessage.value = null;
};

// Gestion des messages
const saveMessage = () => {
  if (form.value.id) {
    // Mise à jour
    const index = rows.value.findIndex(m => m.id === form.value.id);
    if (index !== -1) {
      rows.value[index] = {
        ...rows.value[index],
        titre: form.value.titre,
        auteur: form.value.auteur,
        contenu: form.value.contenu,
        date: form.value.date,
        statut: form.value.statut
      };
    }
  } else {
    // Création
    const newId = rows.value.length > 0 
      ? Math.max(...rows.value.map(m => m.id)) + 1 
      : 1;
    
    const newMessage = {
      id: newId,
      titre: form.value.titre,
      auteur: form.value.auteur,
      contenu: form.value.contenu,
      date: form.value.date,
      statut: form.value.statut
    };
    
    rows.value.push(newMessage);
  }
  
  saveToLocalStorage();
  closeModal();
};

const deleteMessage = () => {
  if (selectedMessage.value) {
    const index = rows.value.findIndex(m => m.id === selectedMessage.value.id);
    if (index !== -1) {
      rows.value.splice(index, 1);
    }
    saveToLocalStorage();
    closeDeleteModal();
  }
};

// Fonction pour basculer le statut lu/non lu
const toggleReadStatus = (message) => {
  const index = rows.value.findIndex(m => m.id === message.id);
  if (index !== -1) {
    rows.value[index].statut = rows.value[index].statut === 'Lu' ? 'Non lu' : 'Lu';
    saveToLocalStorage();
  }
};

// Fonction pour marquer tous les messages comme lus
const markAllAsRead = () => {
  rows.value.forEach(message => {
    message.statut = 'Lu';
  });
  saveToLocalStorage();
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