<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Partenaires</span>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Liste</span>
    </div>

    <!-- Titre -->
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Liste des partenaires</h1>

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

      <!-- Bouton Ajouter partenaire -->
      <NuxtLink 
        to="/partenaires/ajouter"
        class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium whitespace-nowrap"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Ajouter un partenaire
      </NuxtLink>
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
        <!-- Slot pour l'email -->
        <template #email="data">
          <a 
            :href="`mailto:${data.value}`" 
            class="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
            title="Envoyer un email"
          >
            {{ data.value }}
          </a>
        </template>

        <!-- Slot pour le site web -->
        <template #siteWeb="data">
          <template v-if="data.value && typeof data.value === 'string' && data.value.trim()">
            <a 
              :href="formatUrlForHref(data.value)" 
              target="_blank" 
              class="text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center gap-1"
              title="Visiter le site web"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
              </svg>
              <span class="truncate max-w-[200px]">{{ formatUrlForDisplay(data.value) }}</span>
            </a>
          </template>
          <span v-else class="text-gray-400">-</span>
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

    <!-- Modal de modification -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="modal-content">
          <form @submit.prevent="savePartner">
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
                <label for="nom" class="block text-sm font-medium text-gray-700 mb-2">
                  Nom <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="nom" 
                  v-model="form.nom" 
                  required
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Nom du partenaire"
                />
              </div>

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
                  placeholder="contact@entreprise.com"
                />
              </div>

              <div class="form-group text-start">
                <label for="code" class="block text-sm font-medium text-gray-700 mb-2">
                  Code
                </label>
                <input 
                  type="text" 
                  id="code" 
                  v-model="form.code" 
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase" 
                  placeholder="Code partenaire"
                />
              </div>

              <div class="form-group text-start">
                <label for="siteWeb" class="block text-sm font-medium text-gray-700 mb-2">
                  Site web
                </label>
                <input 
                  type="url" 
                  id="siteWeb" 
                  v-model="form.siteWeb" 
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="https://www.entreprise.com"
                />
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
              Voulez-vous vraiment supprimer ce partenaire ? Cette action est irréversible.
            </p>
          </div>
          <div class="modal-footer border-t border-gray-200 p-6 flex justify-end gap-3">
            <form @submit.prevent="deletePartner" class="flex items-center gap-3">
              <input type="hidden" id="deletePartnerForm" :value="selectedPartner?.id" />
              <button 
                type="button" 
                @click="closeDeleteModal"
                class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Retour
              </button>
              <button 
                type="submit" 
                class="btn btn-warning px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
              >
                Supprimer
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
const showDeleteModal = ref(false);
const modalTitle = ref('');
const selectedPartner = ref(null);
const itemsPerPage = ref(50);
const loading = ref(false);

// Formulaire
const form = ref({
  id: null,
  nom: '',
  email: '',
  code: '',
  siteWeb: ''
});

// Charger les partenaires depuis localStorage
const loadPartners = () => {
  if (process.client) {
    const storedPartners = localStorage.getItem('partners');
    if (storedPartners) {
      return JSON.parse(storedPartners);
    }
  }
  return [];
};

// Données initiales selon votre exemple
const initialPartners = [
  { 
    id: 1, 
    nom: 'TechSol', 
    email: 'contact@techsol.fr', 
    code: 'TECH001',
    siteWeb: 'https://www.techsol.fr'
  },
  { 
    id: 2, 
    nom: 'Digital Solutions', 
    email: 'info@digitalsolutions.com', 
    code: 'DIG002',
    siteWeb: 'https://www.digitalsolutions.com'
  },
  { 
    id: 3, 
    nom: 'Innovatech', 
    email: 'contact@innovatech.io', 
    code: 'INN003',
    siteWeb: 'https://www.innovatech.io'
  }
];

const rows = ref([]);

// Initialiser les données
onMounted(() => {
  let partners = loadPartners();
  if (partners.length === 0) {
    partners = initialPartners;
    if (process.client) {
      localStorage.setItem('partners', JSON.stringify(partners));
    }
  }
  
  // S'assurer que tous les partenaires ont les champs requis
  rows.value = partners.map(partner => ({
    id: partner.id || 0,
    nom: partner.nom || '',
    email: partner.email || '',
    code: partner.code || '',
    siteWeb: partner.siteWeb || ''
  }));
  
  selectedColumns.value = availableColumns.value.map(col => col.field);
});

const availableColumns = ref([
  { field: "id", title: "#", width: "80px", isUnique: true },
  { field: "nom", title: "Nom" },
  { field: "email", title: "Email" },
  { field: "code", title: "Code" },
  { field: "siteWeb", title: "Lien du site" },
  { field: "action", title: "Actions", sort: false, width: "120px", type: "click" }
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
  return rows.value.filter(partner => 
    (partner.nom && partner.nom.toLowerCase().includes(query)) ||
    (partner.email && partner.email.toLowerCase().includes(query)) ||
    (partner.code && partner.code.toLowerCase().includes(query)) ||
    (partner.siteWeb && typeof partner.siteWeb === 'string' && partner.siteWeb.toLowerCase().includes(query))
  );
});

// Formater l'URL pour l'affichage (corrigé)
const formatUrlForDisplay = (url) => {
  if (!url || typeof url !== 'string') return '';
  try {
    // S'assurer que l'URL est valide
    const trimmed = url.trim();
    if (!trimmed) return '';
    
    // Retirer le protocole et www pour l'affichage
    return trimmed
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .replace(/\/$/, ''); // Retirer le slash final
  } catch (error) {
    console.error('Erreur de formatage URL:', error);
    return url || '';
  }
};

// Formater l'URL pour le href (ajouter https:// si manquant)
const formatUrlForHref = (url) => {
  if (!url || typeof url !== 'string') return '#';
  try {
    const trimmed = url.trim();
    if (!trimmed) return '#';
    
    // Si l'URL ne commence pas par http:// ou https://, ajouter https://
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return 'https://' + trimmed;
    }
    return trimmed;
  } catch (error) {
    console.error('Erreur de formatage href:', error);
    return '#';
  }
};

const toggleSelector = () => {
  showSelector.value = !showSelector.value;
};

// Sauvegarder dans localStorage
const saveToLocalStorage = () => {
  if (process.client) {
    localStorage.setItem('partners', JSON.stringify(rows.value));
  }
};

// Gestion des modales
const openEditModal = (partner) => {
  modalTitle.value = "Modifier le partenaire";
  form.value = { 
    id: partner.id,
    nom: partner.nom || '', 
    email: partner.email || '',
    code: partner.code || '',
    siteWeb: partner.siteWeb || ''
  };
  showModal.value = true;
};

const openDeleteModal = (partner) => {
  selectedPartner.value = partner;
  showDeleteModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedPartner.value = null;
};

// Gestion des partenaires
const savePartner = () => {
  if (form.value.id) {
    // Mise à jour
    const index = rows.value.findIndex(p => p.id === form.value.id);
    if (index !== -1) {
      rows.value[index] = {
        ...rows.value[index],
        nom: form.value.nom || '',
        email: form.value.email || '',
        code: form.value.code || '',
        siteWeb: form.value.siteWeb || ''
      };
    }
  }
  
  saveToLocalStorage();
  closeModal();
};

const deletePartner = () => {
  if (selectedPartner.value) {
    const index = rows.value.findIndex(p => p.id === selectedPartner.value.id);
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