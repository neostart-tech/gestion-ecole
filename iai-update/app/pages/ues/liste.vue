<template>
  <div class="page-wrapper">

    <!-- Breadcrumb -->
            <Breadcrumb
                :items="[
                    { label: 'UEs', to: '/' },
                    { label: 'Liste', to: null },
                ]"
                title="Liste des ues"
                :title-class="'text-xl md:text-2xl text-gray-800'"
                :spacing="'mb-2'"
                :link-color="'text-blue-600 hover:text-blue-800'"
                :active-color="'text-gray-900 font-medium'"
                :text-size="'text-base'"
                align="left"
            />

    <div class="search-filter-area">

      <!-- 1️⃣ Recherche -->
      <input
        v-model="searchQuery"
        type="search"
        class="search-input compact"
        placeholder="Rechercher une UE..."
      />

      <!-- 2️⃣ Sélecteur de colonnes -->
      <div class="column-selector-wrapper">
        <button class="toggle-btn" @click="toggleSelector">
          <span>Colonnes visibles</span>
          <svg class="chevron-icon" :class="{ 'rotated': showSelector }" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        
        <div v-if="showSelector" class="checkbox-dropdown">
          <div class="checkbox-group-vertical">
            <div v-for="col in availableColumns" :key="col.field" class="checkbox-item">
              <input
                type="checkbox"
                :id="col.field"
                v-model="selectedColumns"
                :value="col.field"
              />
              <label :for="col.field">{{ col.title }}</label>
            </div>
          </div>
        </div>
      </div>

      <!-- 3️⃣ Ajouter une UE -->
      <button class="add-user-btn" @click="showAddModal = true">
        <svg class="add-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Ajouter une UE
      </button>

    </div>

    <!-- Tableau -->
    <div class="table-card">
      <div v-if="ues.length > 0">
        <Vue3Datatable
          :columns="filteredCols"
          :rows="filteredUes"
          :per-page="10"
          :search="searchQuery"
          :searchable="true"
          :sortable="true"
          :filterable="true"
          :pagination-options="{ 
            dropdown: true, 
            edge: true,
            perPage: 10
          }"
          skin="bh-table-compact"
          class="custom-datatable"
        >
          <!-- Template personnalisé pour la colonne Actions -->
          <template #actions="data">
            <div class="flex space-x-2">
              <!-- Bouton Modifier -->
              <button 
                @click="editUe(data.value)" 
                class="text-green-600 hover:text-green-800"
                title="Modifier"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>

              <!-- Bouton Voir -->
              <button 
                @click="showUeDetails(data.value)" 
                class="text-blue-600 hover:text-blue-800"
                title="Planifications"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>

              <!-- Bouton Supprimer -->
              <button 
                @click="deleteUe(data.value)" 
                class="text-red-600 hover:text-red-800"
                title="Supprimer"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </template>

          <!-- Template pour le statut actif/inactif -->
          <template #status="data">
            <span :class="data.value ? 'status-active' : 'status-inactive'">
              {{ data.value ? 'Actif' : 'Inactif' }}
            </span>
          </template>
        </Vue3Datatable>
      </div>
      <div v-else class="no-data-message">
        <div class="flex items-center p-4">
          <svg class="w-6 h-6 text-yellow-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <span>Aucune donnée à afficher</span>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout d'UE -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Ajouter une nouvelle UE</h2>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitUeForm">
            <!-- Informations de l'UE -->
            <div class="form-grid">
              <div class="form-group">
                <label for="nom">Nom de l'UE *</label>
                <input
                  type="text"
                  id="nom"
                  v-model="newUe.nom"
                  required
                  placeholder="Ex: Mathématiques Appliquées"
                />
              </div>

              <div class="form-group">
                <label for="code">Code *</label>
                <input
                  type="text"
                  id="code"
                  v-model="newUe.code"
                  required
                  placeholder="Ex: MAT201"
                />
              </div>

              <div class="form-group">
                <label for="credit">Crédits *</label>
                <input
                  type="number"
                  id="credit"
                  v-model="newUe.credit"
                  required
                  min="1"
                  max="10"
                  placeholder="Ex: 6"
                />
              </div>

              <div class="form-group">
                <label for="filiere_id">Filière *</label>
                <select
                  id="filiere_id"
                  v-model="newUe.filiere_id"
                  required
                  class="select-input"
                >
                  <option value="">Sélectionner une filière</option>
                  <option v-for="filiere in filieres" :key="filiere.id" :value="filiere.id">
                    {{ filiere.code }} - {{ filiere.nom }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="periode_id">Période</label>
                <select
                  id="periode_id"
                  v-model="newUe.periode_id"
                  class="select-input"
                >
                  <option value="">Sélectionner une période</option>
                  <option v-for="periode in periodes" :key="periode.id" :value="periode.id">
                    {{ periode.nom }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="description">Description</label>
                <textarea
                  id="description"
                  v-model="newUe.description"
                  rows="3"
                  placeholder="Description de l'UE..."
                ></textarea>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-cancel" @click="closeModal">
                Annuler
              </button>
              <button type="submit" class="btn-submit">
                <svg class="submit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Créer l'UE
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de détails de l'UE -->
    <div v-if="showDetailModal" class="modal-overlay" @click.self="closeDetailModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Détails de l'UE</h2>
          <button class="close-btn" @click="closeDetailModal">&times;</button>
        </div>

        <div class="modal-body">
          <div class="details-grid">
            <div class="detail-item">
              <label>Nom:</label>
              <span>{{ selectedUe?.nom }}</span>
            </div>
            <div class="detail-item">
              <label>Code:</label>
              <span>{{ selectedUe?.code }}</span>
            </div>
            <div class="detail-item">
              <label>Crédits:</label>
              <span>{{ selectedUe?.credit }}</span>
            </div>
            <div class="detail-item">
              <label>Filière:</label>
              <span>{{ selectedUe?.filiere?.code }} - {{ selectedUe?.filiere?.nom }}</span>
            </div>
            <div class="detail-item">
              <label>Période:</label>
              <span>{{ selectedUe?.periode?.nom || 'Non spécifiée' }}</span>
            </div>
            <div v-if="selectedUe?.description" class="detail-item full-width">
              <label>Description:</label>
              <p class="description-text">{{ selectedUe.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="modal-content delete-modal">
        <div class="modal-header">
          <h2>Confirmer la suppression</h2>
          <button class="close-btn" @click="closeDeleteModal">&times;</button>
        </div>

        <div class="modal-body">
          <div class="warning-message">
            <svg class="warning-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <p>Êtes-vous sûr de vouloir supprimer l'UE <strong>"{{ ueToDelete?.nom }}"</strong> ?</p>
            <p class="text-sm text-gray-600 mt-2">Cette action est irréversible.</p>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click="closeDeleteModal">
            Annuler
          </button>
          <button type="button" class="btn-delete" @click="confirmDelete">
            Supprimer
          </button>
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
const showAddModal = ref(false);
const showDetailModal = ref(false);
const showDeleteModal = ref(false);
const selectedColumns = ref([]);
const selectedUe = ref(null);
const ueToDelete = ref(null);

// Données de l'UE à ajouter
const newUe = ref({
  nom: "",
  code: "",
  credit: "",
  filiere_id: "",
  periode_id: "",
  description: ""
});

// Données de test
const ues = ref([
  {
    id: 1,
    nom: "Mathématiques Appliquées",
    code: "MAT201",
    credit: 6,
    filiere: { id: 1, code: "INFO", nom: "Informatique" },
    periode: { id: 1, nom: "Semestre 1" },
    description: "Cours de mathématiques appliquées à l'informatique"
  },
  {
    id: 2,
    nom: "Algorithmique",
    code: "ALG101",
    credit: 5,
    filiere: { id: 1, code: "INFO", nom: "Informatique" },
    periode: { id: 1, nom: "Semestre 1" },
    description: "Introduction aux algorithmes"
  },
  {
    id: 3,
    nom: "Base de données",
    code: "BD201",
    credit: 4,
    filiere: { id: 2, code: "MATH", nom: "Mathématiques" },
    periode: { id: 2, nom: "Semestre 2" },
    description: "Gestion des bases de données relationnelles"
  }
]);

const filieres = ref([
  { id: 1, code: "INFO", nom: "Informatique" },
  { id: 2, code: "MATH", nom: "Mathématiques" },
  { id: 3, code: "PHYS", nom: "Physique" }
]);

const periodes = ref([
  { id: 1, nom: "Semestre 1" },
  { id: 2, nom: "Semestre 2" },
  { id: 3, nom: "Semestre 3" },
  { id: 4, nom: "Semestre 4" }
]);

const availableColumns = ref([
  { field: "id", title: "ID", width: "80px", isUnique: true },
  { field: "nom", title: "Nom", width: "250px" },
  { field: "code", title: "Code", width: "100px" },
  { field: "credit", title: "Crédits", width: "100px" },
  { field: "filiere", title: "Filière", width: "150px", type: "object", fieldKey: "code" },
  { field: "periode", title: "Période", width: "150px", type: "object", fieldKey: "nom" },
  { field: "actions", title: "Actions", width: "120px", sort: false }
]);

// Initialiser avec toutes les colonnes sélectionnées sauf ID
onMounted(() => {
  selectedColumns.value = availableColumns.value
    .filter(col => col.field !== 'id')
    .map(col => col.field);
});

// Colonnes filtrées selon la sélection
const filteredCols = computed(() => {
  return availableColumns.value.filter(col => 
    selectedColumns.value.includes(col.field) || col.isUnique
  ).map(col => ({
    ...col,
    cellRenderer: col.field === 'actions' ? 'actions' : 
                  col.field === 'status' ? 'status' : null
  }));
});

// UEs filtrées avec recherche
const filteredUes = computed(() => {
  if (!searchQuery.value) return ues.value;
  
  const query = searchQuery.value.toLowerCase();
  return ues.value.filter(ue => 
    ue.nom.toLowerCase().includes(query) ||
    ue.code.toLowerCase().includes(query) ||
    ue.filiere.code.toLowerCase().includes(query) ||
    ue.credit.toString().includes(query)
  );
});

const toggleSelector = () => {
  showSelector.value = !showSelector.value;
};

// Fonctions pour les actions
const editUe = (ue) => {
  // Redirection vers la page d'édition
  console.log('Éditer UE:', ue);
  // À remplacer par : navigateTo(`/admin/ues/edit/${ue.id}`)
};

const showUeDetails = (ue) => {
  selectedUe.value = ue;
  showDetailModal.value = true;
};

const deleteUe = (ue) => {
  ueToDelete.value = ue;
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  if (ueToDelete.value) {
    ues.value = ues.value.filter(ue => ue.id !== ueToDelete.value.id);
    showDeleteModal.value = false;
    ueToDelete.value = null;
    
    // Message de succès
    alert('UE supprimée avec succès!');
  }
};

// Fermer les modales
const closeModal = () => {
  showAddModal.value = false;
  resetForm();
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedUe.value = null;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  ueToDelete.value = null;
};

// Réinitialiser le formulaire
const resetForm = () => {
  newUe.value = {
    nom: "",
    code: "",
    credit: "",
    filiere_id: "",
    periode_id: "",
    description: ""
  };
};

// Soumettre le formulaire
const submitUeForm = () => {
  // Validation
  if (!newUe.value.nom || !newUe.value.code || !newUe.value.credit || !newUe.value.filiere_id) {
    alert("Veuillez remplir les champs obligatoires (*)");
    return;
  }

  // Trouver la filière sélectionnée
  const filiere = filieres.value.find(f => f.id == newUe.value.filiere_id);
  const periode = periodes.value.find(p => p.id == newUe.value.periode_id);

  // Créer la nouvelle UE
  const newUeId = ues.value.length > 0 ? Math.max(...ues.value.map(u => u.id)) + 1 : 1;
  const ueToAdd = {
    id: newUeId,
    nom: newUe.value.nom,
    code: newUe.value.code,
    credit: parseInt(newUe.value.credit),
    filiere: filiere,
    periode: periode || null,
    description: newUe.value.description
  };

  ues.value.push(ueToAdd);
  
  alert(`UE "${newUe.value.nom}" ajoutée avec succès!`);
  closeModal();
};
</script>

<style scoped>
/* Page structurée et centrée */
.page-wrapper {
  max-width: 1400px;
  margin: 30px auto;
  padding: 20px;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #6b7280;
}

.breadcrumb-item {
  cursor: pointer;
  transition: color 0.2s;
}

.breadcrumb-item:hover {
  color: #4f46e5;
}

.breadcrumb-item.active {
  color: #111827;
  font-weight: 500;
  cursor: default;
}

.breadcrumb-item.active:hover {
  color: #111827;
}

.breadcrumb-separator {
  color: #9ca3af;
}

/* Titre */
.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;
}

/* Zone recherche et boutons d'action */
.search-filter-area {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  transition: 0.2s;
  background: #fff;
  flex: 1;
  min-width: 250px;
}

.search-input.compact {
  width: 300px;
  flex: 0 0 auto;
}

.search-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

/* Bouton Ajouter UE */
.add-user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.add-user-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.add-icon {
  width: 18px;
  height: 18px;
}

/* Sélecteur de colonnes */
.column-selector-wrapper {
  position: relative;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.toggle-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.chevron-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s;
}

.chevron-icon.rotated {
  transform: rotate(180deg);
}

/* Dropdown des colonnes */
.checkbox-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 100;
  min-width: 220px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.checkbox-group-vertical {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  max-height: 300px;
  overflow-y: auto;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.checkbox-item:hover {
  background-color: #f3f4f6;
}

.checkbox-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #4f46e5;
}

.checkbox-item label {
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  user-select: none;
  flex: 1;
}

/* Carte contenant le tableau */
.table-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* Personnalisation du datatable */
:deep(.bh-table-striped) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.bh-table-head) {
  background: #4f46e5;
  color: white;
}

:deep(.bh-table-head th) {
  font-weight: 600;
  padding: 16px 12px;
}

:deep(.bh-table-body tr) {
  transition: background-color 0.2s;
}

:deep(.bh-table-body tr:hover) {
  background-color: #f9fafb;
}

:deep(.bh-table-body td) {
  padding: 14px 12px;
  border-color: #e5e7eb;
}

/* Statuts */
.status-active {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: #dcfce7;
  color: #166534;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-inactive {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

/* Message pas de données */
.no-data-message {
  padding: 48px;
  text-align: center;
  color: #6b7280;
  font-size: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: modalSlideIn 0.3s ease-out;
}

.delete-modal {
  max-width: 500px;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px 16px 0 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  font-size: 28px;
  color: white;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 24px;
}

/* Formulaire */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-group label {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-group label::after {
  content: " *";
  color: #ef4444;
  visibility: hidden;
}

.form-group input[required] + label::after,
.form-group select[required] + label::after,
.form-group textarea[required] + label::after {
  visibility: visible;
}

.form-group input:not([type="radio"]),
.form-group textarea,
.select-input {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
}

.select-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.form-group input:focus,
.form-group textarea:focus,
.select-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

/* Grille de détails */
.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item.full-width {
  grid-column: span 2;
}

.detail-item label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-item span {
  font-size: 16px;
  color: #1f2937;
  font-weight: 500;
}

.description-text {
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  margin-top: 8px;
  line-height: 1.6;
  color: #4b5563;
}

/* Message d'avertissement */
.warning-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px;
}

.warning-icon {
  width: 64px;
  height: 64px;
  color: #ef4444;
  margin-bottom: 20px;
}

/* Footer modal */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0 0 16px 16px;
}

.btn-cancel {
  padding: 12px 24px;
  background: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.btn-submit {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-delete {
  padding: 12px 24px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-delete:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.submit-icon {
  width: 18px;
  height: 18px;
}

/* Responsive */
@media (max-width: 1024px) {
  .page-wrapper {
    padding: 15px;
  }
  
  .search-filter-area {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input.compact {
    width: 100%;
  }
  
  .column-selector-wrapper {
    align-self: flex-start;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-group.full-width {
    grid-column: span 1;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-item.full-width {
    grid-column: span 1;
  }
  
  .modal-content {
    max-height: 95vh;
    margin: 10px;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-submit,
  .btn-delete {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .table-card {
    padding: 16px;
  }
  
  .modal-header {
    padding: 16px;
  }
  
  .modal-body {
    padding: 16px;
  }
  
  .modal-footer {
    padding: 16px;
  }
}
</style>