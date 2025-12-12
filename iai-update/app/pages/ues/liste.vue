 <template>
  <div class="page-wrapper">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <span class="breadcrumb-item">Administration</span>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-item">Rôles</span>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-item active">Liste</span>
    </div>
    <!-- Titre -->
    <h1 class="page-title">Liste des rôles</h1>
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
      <!-- Sélecteur de colonnes -->
      <div class="relative">
        <button
          class="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          @click="toggleSelector"
        >
          <span>Colonnes visibles</span>
          <svg
            class="w-5 h-5 transition-transform duration-200"
            :class="{ 'rotate-180': showSelector }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        <div
          v-if="showSelector"
          class="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[200px]"
        >
          <div class="p-3 space-y-2 max-h-60 overflow-y-auto">
            <div
              v-for="col in availableColumns"
              :key="col.field"
              class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
            >
              <input
                type="checkbox"
                :id="col.field"
                v-model="selectedColumns"
                :value="col.field"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label
                :for="col.field"
                class="text-sm text-gray-700 cursor-pointer select-none"
              >{{ col.title }}</label>
            </div>
          </div>
        </div>
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
    <!-- Tableau -->
    <div class="table-card">
      <Vue3Datatable
        :columns="filteredCols"
        :rows="filteredRoles"
        :per-page="10"
        :search="searchQuery"
        :pagination-options="{ dropdown: true, edge: true }"
        :searchable="true"
        :sortable="true"
        :filterable="true"
        :skin="'bh-table-hover bh-table-striped'"
        class="role-datatable"
      >
        <!-- Template pour les actions -->
        <template #actions="data">
          <div class="flex space-x-3">
            <button
              @click="showRoleDetails(data.value)"
              class="text-blue-600 hover:text-blue-900 transition-colors"
              title="Voir les permissions"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </button>
          </div>
        </template>
      </Vue3Datatable>
    </div>
    <!-- Modal pour afficher les permissions -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">
            <h5 id="role-nom">{{ selectedRole ? `Rôle: ${selectedRole.nom}` : '' }}</h5>
          </div>
          <button @click="closeModal" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <h5 class="text-center mb-6 text-lg font-semibold text-gray-700">Liste des permissions</h5>
          <div class="table-responsive">
            <table class="permissions-table">
              <thead class="bg-gray-50">
                <tr>
                  <th class="text-left p-3 text-sm font-medium text-gray-500 uppercase">Permissions</th>
                  <th class="text-left p-3 text-sm font-medium text-gray-500 uppercase">Description</th>
                </tr>
              </thead>
              <tbody id="permissions-table">
                <tr v-for="permission in selectedRole?.permissions" :key="permission.id">
                  <td class="p-3 border-b border-gray-200">
                    <div class="flex items-center">
                      <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                      <span class="text-sm text-gray-700">{{ permission.nom }}</span>
                    </div>
                  </td>
                  <td class="p-3 border-b border-gray-200 text-sm text-gray-500">
                    {{ getPermissionDescription(permission.nom) }}
                  </td>
                </tr>
                <tr v-if="!selectedRole?.permissions || selectedRole.permissions.length === 0">
                  <td colspan="2" class="text-center text-gray-500 py-4">
                    Aucune permission attribuée
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="selectedRole?.description" class="mt-6 p-4 bg-blue-50 rounded-lg">
            <h6 class="text-sm font-medium text-blue-800 mb-2">Description du rôle:</h6>
            <p class="text-sm text-blue-700">{{ selectedRole.description }}</p>
          </div>
          <div class="mt-6 pt-4 border-t border-gray-200">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">
                Total: <strong>{{ selectedRole?.permissions?.length || 0 }}</strong> permissions
              </span>
              <button 
                @click="closeModal" 
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
import { ref, computed, onMounted } from "vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";

const searchQuery = ref("");
const showSelector = ref(false);
const showModal = ref(false);
const showAddModal = ref(false);
const selectedRole = ref(null);

// Configuration des colonnes
const availableColumns = ref([
  { field: "id", title: "#", width: "70px", isUnique: true },
  { field: "nom", title: "Nom", width: "300px" },
  { field: "permissionsCount", title: "Permissions", width: "120px" },
  { field: "actions", title: "Actions", width: "100px", sort: false },
]);

const selectedColumns = ref([]);

// Initialiser avec toutes les colonnes sélectionnées
onMounted(() => {
  selectedColumns.value = availableColumns.value.map(col => col.field);
});

// Données des rôles avec permissions détaillées
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
      { id: 6, nom: "Exporter les rapports" },
      { id: 7, nom: "Gérer les cours" },
      { id: 8, nom: "Gérer les inscriptions" },
      { id: 9, nom: "Gérer les paiements" },
      { id: 10, nom: "Gérer les emplois du temps" }
    ]
  },
  {
    id: 2,
    nom: "Enseignant",
    description: "Gestion des cours, évaluations et suivi des étudiants",
    permissions: [
      { id: 11, nom: "Gérer ses cours" },
      { id: 12, nom: "Noter les étudiants" },
      { id: 13, nom: "Voir les emplois du temps" },
      { id: 14, nom: "Gérer les ressources pédagogiques" },
      { id: 15, nom: "Communiquer avec les étudiants" },
      { id: 16, nom: "Voir les présences" },
      { id: 17, nom: "Publier des annonces" },
      { id: 18, nom: "Créer des évaluations" }
    ]
  },
  {
    id: 3,
    nom: "Étudiant",
    description: "Accès aux informations académiques et personnelles",
    permissions: [
      { id: 19, nom: "Voir les emploi du temps de sa salle" },
      { id: 20, nom: "Voir un emploi du temps" },
      { id: 21, nom: "Voir une note d'un étudiant" },
      { id: 22, nom: "Voir les évènements de sa salle" },
      { id: 23, nom: "Voir un évènement" },
      { id: 24, nom: "Voir ses enregistrements de payement de frais de scolarité" },
      { id: 25, nom: "Voir ses notes" },
      { id: 26, nom: "Consulter les ressources" },
      { id: 27, nom: "S'inscrire aux cours" },
      { id: 28, nom: "Consulter les résultats" }
    ]
  },
  {
    id: 4,
    nom: "Secrétaire",
    description: "Gestion administrative des inscriptions et documents",
    permissions: [
      { id: 29, nom: "Gérer les inscriptions" },
      { id: 30, nom: "Éditer les documents" },
      { id: 31, nom: "Gérer les plannings" },
      { id: 32, nom: "Imprimer les attestations" },
      { id: 33, nom: "Gérer les dossiers étudiants" },
      { id: 34, nom: "Enregistrer les paiements" },
      { id: 35, nom: "Gérer les demandes" },
      { id: 36, nom: "Mettre à jour les informations" }
    ]
  },
  {
    id: 5,
    nom: "Directeur d'études",
    description: "Supervision des programmes et validation académique",
    permissions: [
      { id: 37, nom: "Valider les plannings" },
      { id: 38, nom: "Superviser les enseignants" },
      { id: 39, nom: "Approuver les programmes" },
      { id: 40, nom: "Gérer les départements" },
      { id: 41, nom: "Voir les rapports académiques" },
      { id: 42, nom: "Valider les diplômes" },
      { id: 43, nom: "Gérer les commissions" },
      { id: 44, nom: "Approuver les budgets" }
    ]
  }
]);

// Données du nouveau rôle
const newRole = ref({
  nom: "",
  description: ""
});

// Fonction pour obtenir la description d'une permission
const getPermissionDescription = (permissionName) => {
  const descriptions = {
    "Voir les emploi du temps de sa salle": "Permet de consulter l'emploi du temps de sa classe/section",
    "Voir un emploi du temps": "Accès à la visualisation des emplois du temps",
    "Voir une note d'un étudiant": "Consulter les notes académiques",
    "Voir les évènements de sa salle": "Voir les événements spécifiques à sa classe",
    "Voir un évènement": "Visualiser les détails d'un événement",
    "Voir ses enregistrements de payement de frais de scolarité": "Accès à l'historique des paiements de scolarité",
    "Gérer les utilisateurs": "Créer, modifier et supprimer des comptes utilisateurs",
    "Gérer les rôles": "Définir et attribuer les rôles du système",
    "Gérer les permissions": "Configurer les autorisations d'accès",
    "Gérer les cours": "Administrer les cours et programmes",
    "Noter les étudiants": "Saisir et modifier les notes des étudiants",
    "Gérer les inscriptions": "Traiter les inscriptions et réinscriptions",
    "Valider les plannings": "Approuver les emplois du temps",
    "Superviser les enseignants": "Suivre et évaluer les enseignants",
    "Gérer ses cours": "Gérer le contenu et les activités de ses cours",
    "Gérer les ressources pédagogiques": "Ajouter et organiser les ressources d'apprentissage",
    "Communiquer avec les étudiants": "Envoyer des messages et notifications aux étudiants",
    "Voir les présences": "Consulter les registres de présence",
    "Publier des annonces": "Diffuser des informations aux étudiants",
    "Créer des évaluations": "Créer des examens et travaux",
    "Voir ses notes": "Consulter ses propres résultats académiques",
    "Consulter les ressources": "Accéder aux documents pédagogiques",
    "S'inscrire aux cours": "Sélectionner les cours à suivre",
    "Consulter les résultats": "Voir les résultats d'évaluations",
    "Éditer les documents": "Créer et modifier des documents administratifs",
    "Imprimer les attestations": "Générer des attestations officielles",
    "Enregistrer les paiements": "Saisir les paiements des étudiants",
    "Gérer les demandes": "Traiter les requêtes administratives",
    "Approuver les programmes": "Valider les programmes académiques",
    "Voir les rapports académiques": "Consulter les statistiques et rapports",
    "Valider les diplômes": "Approuver l'attribution des diplômes",
    "Gérer les commissions": "Organiser les commissions pédagogiques",
    "Approuver les budgets": "Valider les budgets départementaux"
  };
  
  return descriptions[permissionName] || "Permission d'accès système";
};

// Rôles avec compteur de permissions
const rolesWithCount = computed(() => {
  return roles.value.map(role => ({
    ...role,
    permissionsCount: role.permissions.length
  }));
});

// Colonnes filtrées selon la sélection
const filteredCols = computed(() => {
  return availableColumns.value.filter(col =>
    selectedColumns.value.includes(col.field) || col.isUnique
  ).map(col => ({
    ...col,
    cellRenderer: col.field === 'actions' ? 'actions' : null
  }));
});

// Rôles filtrés avec recherche
const filteredRoles = computed(() => {
  if (!searchQuery.value) return rolesWithCount.value;
 
  const query = searchQuery.value.toLowerCase();
  return rolesWithCount.value.filter(role =>
    role.nom.toLowerCase().includes(query) ||
    (role.description && role.description.toLowerCase().includes(query))
  );
});

const toggleSelector = () => {
  showSelector.value = !showSelector.value;
};

// Afficher les détails d'un rôle
const showRoleDetails = (roleId) => {
  const role = roles.value.find(r => r.id === roleId);
  if (role) {
    selectedRole.value = role;
    showModal.value = true;
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
/* Personnalisation du datatable */
.role-datatable {
  --bh-table-border-color: #e5e7eb;
  --bh-table-head-bg: #f9fafb;
  --bh-table-head-color: #374151;
  --bh-table-row-hover-bg: #f9fafb;
}
:deep(.bh-pagination-dropdown) {
  border: 1px solid #d1d5db;
  border-radius: 6px;
}
:deep(.bh-pagination-btn) {
  border: 1px solid #d1d5db;
  color: #374151;
  transition: all 0.2s;
}
:deep(.bh-pagination-btn:hover) {
  background-color: #f3f4f6;
}
:deep(.bh-pagination-btn.active) {
  background-color: #4f46e5;
  color: white;
  border-color: #4f46e5;
}
:deep(.bh-table thead th) {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}
:deep(.bh-table tbody tr) {
  border-bottom: 1px solid #e5e7eb;
}
:deep(.bh-table tbody tr:hover) {
  background-color: #f9fafb;
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
  border-radius: 16px;
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
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-radius: 16px 16px 0 0;
}
.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
.modal-title h5 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
.modal-close {
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
.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
}
.modal-body {
  padding: 24px;
}
.text-center {
  text-align: center;
}
.mb-4 {
  margin-bottom: 16px;
}
/* Améliorations pour le modal des permissions */
.permissions-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.permissions-table thead {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
}

.permissions-table th {
  padding: 12px 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.permissions-table tbody tr {
  transition: background-color 0.2s;
  border-bottom: 1px solid #e5e7eb;
}

.permissions-table tbody tr:hover {
  background-color: #f8fafc;
}

.permissions-table td {
  padding: 12px 16px;
  vertical-align: middle;
}
/* Table des permissions */
.table-responsive {
  overflow-x: auto;
}
.permissions-table tbody tr {
  border-bottom: 1px solid #e5e7eb;
}
.permissions-table td {
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  color: #374151;
}
.permissions-table tbody tr:hover {
  background-color: #f9fafb;
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
/* Responsive pour les permissions */
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
 
  .modal-header {
    padding: 16px;
  }
 
  .modal-body {
    padding: 16px;
  }
  
  .permissions-table {
    display: block;
    overflow-x: auto;
  }
  
  .permissions-table th,
  .permissions-table td {
    white-space: nowrap;
    min-width: 150px;
  }
}
@media (max-width: 480px) {
  .page-title {
    font-size: 24px;
  }
 
  .table-card {
    padding: 16px;
  }
}
</style>


