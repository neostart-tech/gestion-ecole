<template>
  <div class="page-wrapper">

    <!-- Breadcrumb -->
            <Breadcrumb
                :items="[
                    { label: 'UEs', to: '/' },
                    { label: 'Ajouter', to: null },
                ]"
                title="Ajouter une ue"
                :title-class="'text-xl md:text-2xl text-gray-800'"
                :spacing="'mb-2'"
                :link-color="'text-blue-600 hover:text-blue-800'"
                :active-color="'text-gray-900 font-medium'"
                :text-size="'text-base'"
                align="left"
            />

    <!-- Formulaire -->
    <div class="form-card">
      <form @submit.prevent="submitForm">
        
        <!-- Champ Nom -->
        <div class="form-group">
          <label for="nom" class="form-label">
            Nom de l'UE
            <span class="required-field">*</span>
          </label>
          <input
            type="text"
            id="nom"
            v-model="formData.nom"
            class="form-input"
            placeholder="Ex: Algorithme et Programmation"
            required
          />
          <div v-if="errors.nom" class="error-message">
            {{ errors.nom }}
          </div>
        </div>

        <!-- Champ Code -->
        <div class="form-group">
          <label for="code" class="form-label">
            Code de l'UE
            <span class="required-field">*</span>
          </label>
          <input
            type="text"
            id="code"
            v-model="formData.code"
            class="form-input"
            placeholder="Ex: APR_S1"
            required
          />
          <div v-if="errors.code" class="error-message">
            {{ errors.code }}
          </div>
        </div>

        <!-- Champ Période -->
        <div class="form-group">
          <label for="periode_id" class="form-label">
            Période
            <span class="required-field">*</span>
          </label>
          <select
            id="periode_id"
            v-model="formData.periode_id"
            class="form-select"
            required
          >
            <option value="">Sélectionner une période</option>
            <option 
              v-for="periode in periodes" 
              :key="periode.id" 
              :value="periode.id"
            >
              {{ periode.nom }} - {{ periode.anneeScolaire?.nom }}
            </option>
          </select>
          <div v-if="errors.periode_id" class="error-message">
            {{ errors.periode_id }}
          </div>
        </div>

        <!-- Champ Filière -->
        <div class="form-group">
          <label for="filiere_id" class="form-label">
            Filière
            <span class="required-field">*</span>
          </label>
          <select
            id="filiere_id"
            v-model="formData.filiere_id"
            class="form-select"
            required
          >
            <option value="">Sélectionner une filière</option>
            <option 
              v-for="filiere in filieres" 
              :key="filiere.id" 
              :value="filiere.id"
            >
              {{ filiere.nom }}
            </option>
          </select>
          <div v-if="errors.filiere_id" class="error-message">
            {{ errors.filiere_id }}
          </div>
        </div>

        <!-- Champ Crédits -->
        <div class="form-group">
          <label for="credit" class="form-label">
            Nombre de crédits
            <span class="required-field">*</span>
          </label>
          <input
            type="number"
            id="credit"
            v-model="formData.credit"
            class="form-input"
            placeholder="Ex: 9"
            min="1"
            max="30"
            required
          />
          <div v-if="errors.credit" class="error-message">
            {{ errors.credit }}
          </div>
        </div>

        <!-- Actions du formulaire -->
        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="cancel">
            Annuler
          </button>
          <button type="submit" class="btn-submit">
            {{ isEditMode ? 'Mettre à jour' : 'Créer' }}
          </button>
        </div>

      </form>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "#imports";

const router = useRouter();
const route = useRoute();

const isEditMode = ref(false);
const ueId = ref(null);

// Données du formulaire
const formData = ref({
  nom: "",
  code: "",
  periode_id: "",
  filiere_id: "",
  credit: ""
});

// Erreurs
const errors = ref({
  nom: "",
  code: "",
  periode_id: "",
  filiere_id: "",
  credit: ""
});

// Données des listes déroulantes
const periodes = ref([
  { id: 1, nom: "Semestre 1", anneeScolaire: { id: 1, nom: "2023-2024" } },
  { id: 2, nom: "Semestre 2", anneeScolaire: { id: 1, nom: "2023-2024" } },
  { id: 3, nom: "Semestre 3", anneeScolaire: { id: 1, nom: "2023-2024" } },
  { id: 4, nom: "Semestre 4", anneeScolaire: { id: 1, nom: "2023-2024" } }
]);

const filieres = ref([
  { id: 1, nom: "Technologie de l'Information (TC_1)" },
  { id: 2, nom: "Génie Logiciel et Systèmes d'Information (GLSI)" },
  { id: 3, nom: "Administration Systèmes et Réseaux (ASR)" }
]);

// Initialisation pour l'édition
onMounted(() => {
  const { id } = route.params;
  
  if (id) {
    isEditMode.value = true;
    ueId.value = id;
    loadUeData(id);
  }
});

// Charger les données de l'UE pour l'édition
const loadUeData = async (id) => {
  try {
    // Simuler un chargement depuis l'API
    // Remplacez par votre appel API réel
    const mockUeData = {
      id: id,
      nom: "Algorithme et Programmation",
      code: "APR_S1",
      periode_id: 1,
      filiere_id: 1,
      credit: 9
    };
    
    formData.value = { ...mockUeData };
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    alert('Impossible de charger les données de l\'UE');
  }
};

// Validation du formulaire
const validateForm = () => {
  let isValid = true;
  errors.value = {
    nom: "",
    code: "",
    periode_id: "",
    filiere_id: "",
    credit: ""
  };

  // Validation du nom
  if (!formData.value.nom.trim()) {
    errors.value.nom = "Le nom de l'UE est requis";
    isValid = false;
  }

  // Validation du code
  if (!formData.value.code.trim()) {
    errors.value.code = "Le code de l'UE est requis";
    isValid = false;
  }

  // Validation de la période
  if (!formData.value.periode_id) {
    errors.value.periode_id = "La période est requise";
    isValid = false;
  }

  // Validation de la filière
  if (!formData.value.filiere_id) {
    errors.value.filiere_id = "La filière est requise";
    isValid = false;
  }

  // Validation des crédits
  if (!formData.value.credit) {
    errors.value.credit = "Le nombre de crédits est requis";
    isValid = false;
  } else if (formData.value.credit < 1 || formData.value.credit > 30) {
    errors.value.credit = "Les crédits doivent être entre 1 et 30";
    isValid = false;
  }

  return isValid;
};

// Soumission du formulaire
const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    const url = isEditMode.value 
      ? `/api/ues/${ueId.value}`
      : '/api/ues';
    
    const method = isEditMode.value ? 'PUT' : 'POST';
    
    // Simuler un appel API
    console.log('Données soumises:', formData.value);
    
    // Ici, vous feriez votre appel API réel :
    // const response = await fetch(url, {
    //   method: method,
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(formData.value),
    // });
    
    // if (!response.ok) throw new Error('Erreur lors de la soumission');
    
    // Message de succès
    alert(isEditMode.value 
      ? 'UE mise à jour avec succès!' 
      : 'UE créée avec succès!');
    
    // Redirection vers la liste
    router.push('/admin/ues');
    
  } catch (error) {
    console.error('Erreur:', error);
    alert('Une erreur est survenue lors de la soumission du formulaire');
  }
};

// Annuler
const cancel = () => {
  router.push('/admin/ues');
};
</script>

<style scoped>
/* Page structurée et centrée */
.page-wrapper {
  max-width: 800px;
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

/* Carte du formulaire */
.form-card {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Groupes de formulaire */
.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.required-field {
  color: #ef4444;
  margin-left: 4px;
}

/* Champs de formulaire */
.form-input,
.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  background-color: white;
  transition: all 0.2s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

/* Styles spécifiques pour le select */
.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 16px center;
  background-repeat: no-repeat;
  background-size: 16px 16px;
  padding-right: 44px;
  cursor: pointer;
}

/* Messages d'erreur */
.error-message {
  margin-top: 6px;
  font-size: 13px;
  color: #ef4444;
  font-weight: 500;
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
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .page-wrapper {
    padding: 15px;
  }
  
  .form-card {
    padding: 24px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-submit {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 24px;
  }
  
  .form-card {
    padding: 20px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
}
</style>