<template>
  <div class="page-wrapper">
    <!-- Breadcrumb -->
            <Breadcrumb
                :items="[
                    { label: 'Rôle', to: '/' },
                    { label: 'Liste', to: null },
                ]"
                title="Liste des rôles"
                :title-class="'text-xl md:text-2xl text-gray-800'"
                :spacing="'mb-2'"
                :link-color="'text-blue-600 hover:text-blue-800'"
                :active-color="'text-gray-900 font-medium'"
                :text-size="'text-base'"
                align="left"
            />
    <!-- Zone de recherche -->
    <div class="search-filter-area">
      <!-- Recherche -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="search"
          class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Rechercher un rôle..."
        />
      </div>
      <!-- Bouton Ajouter un rôle -->
      <button
        class="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        @click="addRole"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Ajouter un rôle
      </button>
    </div>
    
    <!-- Tableau simplifié sans Vue3Datatable -->
    <div class="table-card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="role in filteredRoles" :key="role.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ role.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ role.nom }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="showRoleDetails(role.id)"
                  class="action-btn"
                  title="Voir les permissions"
                >
                  <!-- Icône cercle avec "i" au milieu -->
                  <svg class="w-5 h-5" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" stroke="#3B82F6" stroke-width="2" fill="white"/>
                    <text x="10" y="14" text-anchor="middle" font-size="12" font-weight="bold" fill="#3B82F6">i</text>
                  </svg>
                </button>
              </td>
            </tr>
            <tr v-if="filteredRoles.length === 0">
              <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">
                Aucun rôle trouvé
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination simple -->
      <div v-if="filteredRoles.length > 0" class="px-6 py-3 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Affichage de {{ filteredRoles.length }} rôle(s)
          </div>
        </div>
      </div>
    </div>
    
    <!-- MODAL QUI S'OUVRE QUAND ON CLIQUE SUR L'ICONE D'ACTION -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header border-0 pb-0">
          <h5 class="mb-0">{{ selectedRole ? selectedRole.nom : '' }}</h5>
          <button @click="closeModal" class="close-btn">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="row align-items-center">
            <div class="col-12">
              <h5 class="text-center">Liste des permissions</h5>
              <p class="text-muted text-justify" id="role-desc">{{ selectedRole?.description || '' }}</p>
              <div class="table-responsive">
                <table class="table table-hover">
                  <tbody id="permissions-table">
                    <tr v-for="permission in selectedRole?.permissions" :key="permission.id">
                      <td class="permission-item">
                        {{ permission.nom }}
                      </td>
                    </tr>
                    <tr v-if="!selectedRole?.permissions || selectedRole.permissions.length === 0">
                      <td class="text-center text-gray-500 py-4">
                        Aucune permission attribuée
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- FIN DU MODAL -->
    
    <!-- Modal d'ajout de rôle -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeAddModal">
      <div class="modal add-modal">
        <div class="modal-header">
          <h3>Ajouter un nouveau rôle</h3>
          <button @click="closeAddModal" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitRoleForm">
            <div class="form-group">
              <label for="role-nom-input" class="form-label">
                Nom du rôle *
              </label>
              <input
                type="text"
                id="role-nom-input"
                v-model="newRole.nom"
                class="form-input"
                placeholder="Ex: Administrateur"
                required
              />
            </div>
            <div class="form-group">
              <label for="role-description" class="form-label">
                Description
              </label>
              <textarea
                id="role-description"
                v-model="newRole.description"
                class="form-input"
                rows="3"
                placeholder="Description du rôle..."
              ></textarea>
            </div>
            <div class="form-actions">
              <button type="button" class="btn-cancel" @click="closeAddModal">
                Annuler
              </button>
              <button type="submit" class="btn-submit">
                Créer le rôle
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const searchQuery = ref("");
const showModal = ref(false);
const showAddModal = ref(false);
const selectedRole = ref(null);

// Données des rôles
const roles = ref([
  {
    id: 1,
    nom: "Administrateur",
    description: "Accès complet à toutes les fonctionnalités du système",
    permissions: [
      { id: 1, nom: "Gérer les utilisateurs" },
      { id: 2, nom: "Gérer les rôles" },
      { id: 3, nom: "Gérer les permissions" },
      { id: 4, nom: "Voir les statistiques" },
      { id: 5, nom: "Gérer les paramètres système" },
      { id: 6, nom: "Exporter les rapports" }
    ]
  },
  {
    id: 2,
    nom: "Enseignant",
    description: "Gestion des cours, évaluations et suivi des étudiants",
    permissions: [
      { id: 7, nom: "Gérer ses cours" },
      { id: 8, nom: "Noter les étudiants" },
      { id: 9, nom: "Voir les emplois du temps" },
      { id: 10, nom: "Gérer les ressources pédagogiques" },
      { id: 11, nom: "Communiquer avec les étudiants" }
    ]
  },
  {
    id: 3,
    nom: "Étudiant",
    description: "Accès aux informations académiques et personnelles",
    permissions: [
      { id: 12, nom: "Voir les emploi du temps de sa salle" },
      { id: 13, nom: "Voir un emploi du temps" },
      { id: 14, nom: "Voir une note d'un étudiant" },
      { id: 15, nom: "Voir les évènements de sa salle" },
      { id: 16, nom: "Voir un évènement" },
      { id: 17, nom: "Voir ses enregistrements de payement de frais de scolarité" }
    ]
  },
  {
    id: 4,
    nom: "Secrétaire",
    description: "Gestion administrative des inscriptions et documents",
    permissions: [
      { id: 18, nom: "Gérer les inscriptions" },
      { id: 19, nom: "Éditer les documents" },
      { id: 20, nom: "Gérer les plannings" },
      { id: 21, nom: "Imprimer les attestations" },
      { id: 22, nom: "Gérer les dossiers étudiants" }
    ]
  },
  {
    id: 5,
    nom: "Directeur d'études",
    description: "Supervision des programmes et validation académique",
    permissions: [
      { id: 23, nom: "Valider les plannings" },
      { id: 24, nom: "Superviser les enseignants" },
      { id: 25, nom: "Approuver les programmes" },
      { id: 26, nom: "Gérer les départements" }
    ]
  }
]);

// Données du nouveau rôle
const newRole = ref({
  nom: "",
  description: ""
});

// Rôles filtrés avec recherche
const filteredRoles = computed(() => {
  if (!searchQuery.value) return roles.value;
 
  const query = searchQuery.value.toLowerCase();
  return roles.value.filter(role =>
    role.nom.toLowerCase().includes(query) ||
    (role.description && role.description.toLowerCase().includes(query))
  );
});

// Afficher les détails d'un rôle - OUVRE LE MODAL
const showRoleDetails = (roleId) => {
  console.log("Cliqué sur rôle ID:", roleId);
  const role = roles.value.find(r => r.id === roleId);
  if (role) {
    selectedRole.value = role;
    showModal.value = true;
    console.log("Modal ouvert pour:", role.nom);
  }
};

// Fermer le modal de détails
const closeModal = () => {
  showModal.value = false;
  selectedRole.value = null;
};

// Ouvrir le modal d'ajout
const addRole = () => {
  showAddModal.value = true;
};

// Fermer le modal d'ajout
const closeAddModal = () => {
  showAddModal.value = false;
  resetRoleForm();
};

// Réinitialiser le formulaire
const resetRoleForm = () => {
  newRole.value = {
    nom: "",
    description: ""
  };
};

// Soumettre le formulaire d'ajout
const submitRoleForm = () => {
  if (!newRole.value.nom.trim()) {
    alert("Veuillez saisir un nom de rôle");
    return;
  }
  
  const newId = roles.value.length > 0 ? Math.max(...roles.value.map(r => r.id)) + 1 : 1;
  roles.value.push({
    id: newId,
    nom: newRole.value.nom,
    description: newRole.value.description,
    permissions: []
  });
  
  alert(`Rôle "${newRole.value.nom}" ajouté avec succès!`);
  closeAddModal();
};
</script>

<style scoped>
.page-wrapper {
  max-width: 1200px;
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
/* Zone de recherche et boutons */
.search-filter-area {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
  flex-wrap: wrap;
}
/* Carte contenant le tableau */
.table-card {
  background: white;
  padding: 22px;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}
/* Bouton d'action dans le tableau */
.action-btn {
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  width: 32px;
  height: 32px;
  padding: 4px;
}

.action-btn:hover {
  background-color: rgba(59, 130, 246, 0.1);
  transform: scale(1.1);
}

.action-btn svg {
  width: 24px;
  height: 24px;
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
}
.modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: modalSlideIn 0.3s ease-out;
}
.add-modal {
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
/* Header du modal des permissions */
.modal-header.border-0.pb-0 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  border-bottom: none;
}
.modal-header.border-0.pb-0 h5 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}
.close-btn {
  background: #f3f4f6;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
}
/* Header du modal d'ajout */
.add-modal .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-radius: 12px 12px 0 0;
}
.add-modal .modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
.add-modal .modal-close {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}
.add-modal .modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
}
/* Body des modals */
.modal-body {
  padding: 24px;
}
.text-center {
  text-align: center;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
}
.text-muted {
  color: #6b7280 !important;
  font-size: 14px;
  margin-bottom: 20px;
}
.text-justify {
  text-align: justify;
}
/* Table des permissions dans le modal */
.table {
  width: 100%;
  border-collapse: collapse;
}
.table-hover tbody tr:hover {
  background-color: #f9fafb;
}
.table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  color: #374151;
}
.permission-item {
  padding-left: 8px;
}
.table-responsive {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}
.row.align-items-center {
  margin: 0;
}
.col-12 {
  padding: 0;
}
/* Formulaire dans modal */
.form-group {
  margin-bottom: 20px;
}
.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}
.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  background-color: white;
  transition: all 0.2s;
}
.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}
.form-input::placeholder {
  color: #9ca3af;
}
textarea.form-input {
  resize: vertical;
  min-height: 100px;
}
/* Actions du formulaire */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
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
  background: #f9fafb;
  border-color: #9ca3af;
}
.btn-submit {
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
/* Responsive */
@media (max-width: 768px) {
  .page-wrapper {
    padding: 15px;
  }
 
  .search-filter-area {
    flex-direction: column;
    align-items: stretch;
  }
 
  .form-actions {
    flex-direction: column;
  }
 
  .btn-cancel,
  .btn-submit {
    width: 100%;
  }
 
  .modal {
    margin: 10px;
    max-height: 90vh;
  }
 
  .modal-header.border-0.pb-0,
  .add-modal .modal-header {
    padding: 16px 16px 0 16px;
  }
 
  .modal-body {
    padding: 16px;
  }
}
@media (max-width: 480px) {
  .page-title {
    font-size: 24px;
  }
 
  .table-card {
    padding: 16px;
  }
  
  .modal-header.border-0.pb-0 h5 {
    font-size: 18px;
  }
}
</style>