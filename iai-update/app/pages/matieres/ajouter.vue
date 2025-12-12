<template>
  <div class="page-wrapper">

    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <span class="breadcrumb-item">Administration</span>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-item">Unité de valeur</span>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-item active">{{ isEditMode ? 'Modifier' : 'Ajouter' }} une unité de valeur</span>
    </div>

    <!-- Titre -->
    <h1 class="page-title">{{ isEditMode ? 'Modifier une unité de valeur' : 'Ajouter une unité de valeur' }}</h1>

    <!-- Formulaire -->
    <div class="form-card">
      <form @submit.prevent="submitForm">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

          <!-- Unité d'enseignement -->
          <div class="form-group">
            <label for="ue_id" class="form-label">
              Unité d'enseignement *
            </label>
            <select
              id="ue_id"
              v-model="formData.ue_id"
              class="form-select"
              required
            >
              <option value="">Attribuez une unité d'enseignement à la matière</option>
              <option 
                v-for="ue in ues" 
                :key="ue.id" 
                :value="ue.id"
                :selected="isEditMode && formData.ue_id === ue.id"
              >
                {{ ue.nom }} ({{ ue.code }})
              </option>
            </select>
            <div v-if="errors.ue_id" class="error-message">
              {{ errors.ue_id }}
            </div>
          </div>

          <!-- Nom de la matière -->
          <div class="form-group">
            <label for="nom" class="form-label">
              Nom de la matière *
            </label>
            <input
              type="text"
              id="nom"
              v-model="formData.nom"
              class="form-input"
              placeholder="Nom de la matière"
              required
            />
            <div v-if="errors.nom" class="error-message">
              {{ errors.nom }}
            </div>
          </div>

          <!-- Code de la matière -->
          <div class="form-group">
            <label for="code" class="form-label">
              Code de la matière *
            </label>
            <input
              type="text"
              id="code"
              v-model="formData.code"
              class="form-input"
              placeholder="Code de l'UE"
              required
            />
            <div v-if="errors.code" class="error-message">
              {{ errors.code }}
            </div>
          </div>

          <!-- Coefficient de la matière -->
          <div class="form-group">
            <label for="coefficient" class="form-label">
              Coefficient de la matière *
            </label>
            <input
              type="number"
              id="coefficient"
              v-model="formData.coefficient"
              class="form-input"
              placeholder="Coefficient de la matière"
              min="1"
              step="1"
              required
            />
            <div v-if="errors.coefficient" class="error-message">
              {{ errors.coefficient }}
            </div>
          </div>

          <!-- CM de la matière -->
          <div class="form-group">
            <label for="cm" class="form-label">
              CM de la matière *
            </label>
            <input
              type="number"
              id="cm"
              v-model="formData.cm"
              class="form-input"
              placeholder="cm de la matière"
              min="1"
              step="1"
              required
            />
            <div v-if="errors.cm" class="error-message">
              {{ errors.cm }}
            </div>
          </div>

          <!-- Volume horaire des Travaux Dirigés -->
          <div class="form-group">
            <label for="td" class="form-label">
              Volume horaire des Travaux Dirigés de l'UE *
            </label>
            <input
              type="number"
              id="td"
              v-model="formData.td"
              class="form-input"
              placeholder="td de la matière"
              min="1"
              step="1"
              required
            />
            <div v-if="errors.td" class="error-message">
              {{ errors.td }}
            </div>
          </div>

          <!-- Volume horaire des Travaux Pratiques -->
          <div class="form-group">
            <label for="tp" class="form-label">
              Volume horaire des Travaux Pratiques de l'UE *
            </label>
            <input
              type="number"
              id="tp"
              v-model="formData.tp"
              class="form-input"
              placeholder="tp de la matière"
              min="1"
              step="1"
              required
            />
            <div v-if="errors.tp" class="error-message">
              {{ errors.tp }}
            </div>
          </div>

          <!-- EC de l'UE -->
          <div class="form-group">
            <label for="ec" class="form-label">
              EC de l'UE *
            </label>
            <input
              type="number"
              id="ec"
              v-model="formData.ec"
              class="form-input"
              placeholder="ec de la matière"
              min="1"
              step="1"
              required
            />
            <div v-if="errors.ec" class="error-message">
              {{ errors.ec }}
            </div>
          </div>

          <!-- Enseignant(s) de la matière -->
          <div class="form-group">
            <label for="enseignant_id" class="form-label">
              Enseignant(s) de la matière *
            </label>
            <select
              id="enseignant_id"
              v-model="formData.enseignant_id"
              class="form-select"
              multiple
              size="4"
              required
            >
              <option 
                v-for="enseignant in enseignants" 
                :key="enseignant.id" 
                :value="enseignant.id"
              >
                {{ enseignant.nom }} {{ enseignant.prenom }}
              </option>
            </select>
            <div v-if="errors.enseignant_id" class="error-message">
              {{ errors.enseignant_id }}
            </div>
            <small class="text-muted">Maintenez Ctrl/Cmd pour sélectionner plusieurs enseignants.</small>
          </div>

        </div>

        <!-- Types d'évaluations et pourcentages -->
        <div class="mb-6">
          <h3 class="section-title mb-4">
            Types d'évaluations et pourcentages (cochez les types utilisés, somme = 100)
          </h3>

          <!-- Cases à cocher en ligne -->
          <div class="flex flex-wrap gap-4 mb-4">
            <div class="checkbox-inline">
              <input
                type="checkbox"
                id="enable_devoir"
                v-model="evaluations.devoir.enabled"
                @change="toggleWeight('devoir')"
                class="checkbox-input"
                checked
              />
              <label for="enable_devoir" class="checkbox-label">
                Devoir
              </label>
            </div>
            <div class="checkbox-inline">
              <input
                type="checkbox"
                id="enable_interrogation"
                v-model="evaluations.interrogation.enabled"
                @change="toggleWeight('interrogation')"
                class="checkbox-input"
                checked
              />
              <label for="enable_interrogation" class="checkbox-label">
                Interrogation
              </label>
            </div>
            <div class="checkbox-inline">
              <input
                type="checkbox"
                id="enable_examen"
                v-model="evaluations.examen.enabled"
                @change="toggleWeight('examen')"
                class="checkbox-input"
                checked
              />
              <label for="enable_examen" class="checkbox-label">
                Examen
              </label>
            </div>
            <div class="checkbox-inline">
              <input
                type="checkbox"
                id="enable_tp"
                v-model="evaluations.tp.enabled"
                @change="toggleWeight('tp')"
                class="checkbox-input"
              />
              <label for="enable_tp" class="checkbox-label">
                TP
              </label>
            </div>
            <div class="checkbox-inline">
              <input
                type="checkbox"
                id="enable_expose"
                v-model="evaluations.expose.enabled"
                @change="toggleWeight('expose')"
                class="checkbox-input"
              />
              <label for="enable_expose" class="checkbox-label">
                Exposé
              </label>
            </div>
          </div>

          <!-- Pourcentages en grille -->
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <!-- Devoir -->
            <div class="form-group">
              <label for="poids_devoir" class="form-label">
                Devoir %
              </label>
              <input
                type="number"
                id="poids_devoir"
                v-model="evaluations.devoir.pourcentage"
                :disabled="!evaluations.devoir.enabled"
                class="form-input"
                min="0"
                max="100"
                placeholder="30"
              />
            </div>

            <!-- Interrogation -->
            <div class="form-group">
              <label for="poids_interrogation" class="form-label">
                Interrogation %
              </label>
              <input
                type="number"
                id="poids_interrogation"
                v-model="evaluations.interrogation.pourcentage"
                :disabled="!evaluations.interrogation.enabled"
                class="form-input"
                min="0"
                max="100"
                placeholder="10"
              />
            </div>

            <!-- Examen -->
            <div class="form-group">
              <label for="poids_examen" class="form-label">
                Examen %
              </label>
              <input
                type="number"
                id="poids_examen"
                v-model="evaluations.examen.pourcentage"
                :disabled="!evaluations.examen.enabled"
                class="form-input"
                min="0"
                max="100"
                placeholder="60"
              />
            </div>

            <!-- TP -->
            <div class="form-group">
              <label for="poids_tp" class="form-label">
                TP %
              </label>
              <input
                type="number"
                id="poids_tp"
                v-model="evaluations.tp.pourcentage"
                :disabled="!evaluations.tp.enabled"
                class="form-input"
                min="0"
                max="100"
                placeholder="0"
              />
            </div>

            <!-- Exposé -->
            <div class="form-group">
              <label for="poids_expose" class="form-label">
                Exposé %
              </label>
              <input
                type="number"
                id="poids_expose"
                v-model="evaluations.expose.pourcentage"
                :disabled="!evaluations.expose.enabled"
                class="form-input"
                min="0"
                max="100"
                placeholder="0"
              />
            </div>
          </div>

          <!-- Message d'information -->
          <div class="mt-3">
            <small class="text-muted">
              Si aucun pourcentage n'est indiqué, les valeurs par défaut seront utilisées (Devoir 30, Interrogation 10, Examen 60).
            </small>
          </div>

          <!-- Validation de la somme -->
          <div v-if="showSumError" class="validation-error">
            La somme des pourcentages doit être égale à 100 (actuellement {{ totalPourcentage }}).
          </div>
        </div>

        <!-- Bouton de soumission -->
        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="cancel">
            Annuler
          </button>
          <button type="submit" class="btn-submit">
            {{ isEditMode ? 'Mettre à jour' : 'Soumettre' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "#imports";

const router = useRouter();
const route = useRoute();

const isEditMode = ref(false);
const showSumError = ref(false);

// Données du formulaire
const formData = ref({
  ue_id: "",
  nom: "",
  code: "",
  coefficient: "",
  cm: "",
  td: "",
  tp: "",
  ec: "",
  enseignant_id: []
});

// Évaluations avec valeurs par défaut
const evaluations = ref({
  devoir: { enabled: true, pourcentage: "30" },
  interrogation: { enabled: true, pourcentage: "10" },
  examen: { enabled: true, pourcentage: "60" },
  tp: { enabled: false, pourcentage: "0" },
  expose: { enabled: false, pourcentage: "0" }
});

// Erreurs
const errors = ref({});

// Données des listes déroulantes
const ues = ref([
  { id: 1, nom: "Algorithme et Programmation", code: "APR_S1" },
  { id: 2, nom: "Bases de Données", code: "BDO_S2" },
  { id: 3, nom: "Architecture des ordinateurs", code: "ARC_S1" },
  { id: 4, nom: "Mathématiques Appliquées", code: "MAT_S1" },
  { id: 5, nom: "Réseaux Informatiques", code: "RES_S2" }
]);

const enseignants = ref([
  { id: 1, nom: "DUPONT", prenom: "Jean" },
  { id: 2, nom: "MARTIN", prenom: "Marie" },
  { id: 3, nom: "DURAND", prenom: "Pierre" },
  { id: 4, nom: "LEFEVRE", prenom: "Sophie" },
  { id: 5, nom: "ROBERT", prenom: "Luc" }
]);

// Calcul du total des pourcentages
const totalPourcentage = computed(() => {
  return Object.values(evaluations.value).reduce((total, evalItem) => {
    return total + (evalItem.enabled ? parseInt(evalItem.pourcentage) || 0 : 0);
  }, 0);
});

// Fonction pour activer/désactiver les champs de pourcentage
const toggleWeight = (type) => {
  if (!evaluations.value[type].enabled) {
    evaluations.value[type].pourcentage = "0";
  } else {
    // Valeurs par défaut si cochées
    const defaults = {
      devoir: "30",
      interrogation: "10",
      examen: "60",
      tp: "0",
      expose: "0"
    };
    evaluations.value[type].pourcentage = defaults[type];
  }
};

// Validation de la somme des pourcentages
const validateWeightsSum = () => {
  const sum = totalPourcentage.value;
  showSumError.value = sum !== 0 && sum !== 100;
  return !showSumError.value;
};

// Initialisation pour l'édition
onMounted(() => {
  const { id } = route.params;
  
  if (id) {
    isEditMode.value = true;
    loadUvData(id);
  }
});

// Charger les données de l'UV pour l'édition
const loadUvData = async (id) => {
  try {
    // Simuler un chargement depuis l'API
    const mockUvData = {
      id: id,
      ue_id: 1,
      nom: "Algorithmique Avancée",
      code: "ALG_AV",
      coefficient: "3",
      cm: "30",
      td: "15",
      tp: "15",
      ec: "2",
      enseignant_id: [1, 3]
    };
    
    formData.value = { ...mockUvData };
    
    // Simuler des évaluations existantes
    evaluations.value = {
      devoir: { enabled: true, pourcentage: "30" },
      interrogation: { enabled: true, pourcentage: "10" },
      examen: { enabled: true, pourcentage: "60" },
      tp: { enabled: false, pourcentage: "0" },
      expose: { enabled: false, pourcentage: "0" }
    };
    
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    alert('Impossible de charger les données de l\'unité de valeur');
  }
};

// Validation du formulaire
const validateForm = () => {
  let isValid = true;
  errors.value = {};

  // Validation des champs obligatoires
  const requiredFields = ['ue_id', 'nom', 'code', 'coefficient', 'cm', 'td', 'tp', 'ec'];
  requiredFields.forEach(field => {
    if (!formData.value[field]) {
      errors.value[field] = "Ce champ est obligatoire";
      isValid = false;
    }
  });

  // Validation des enseignants
  if (!formData.value.enseignant_id.length) {
    errors.value.enseignant_id = "Sélectionnez au moins un enseignant";
    isValid = false;
  }

  // Validation des nombres positifs
  const numberFields = ['coefficient', 'cm', 'td', 'tp', 'ec'];
  numberFields.forEach(field => {
    if (formData.value[field] && parseFloat(formData.value[field]) < 1) {
      errors.value[field] = "La valeur doit être au moins 1";
      isValid = false;
    }
  });

  // Validation des pourcentages
  if (!validateWeightsSum()) {
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
    // Préparer les données
    const data = {
      ...formData.value,
      poids_devoir: evaluations.value.devoir.enabled ? evaluations.value.devoir.pourcentage : "0",
      poids_interrogation: evaluations.value.interrogation.enabled ? evaluations.value.interrogation.pourcentage : "0",
      poids_examen: evaluations.value.examen.enabled ? evaluations.value.examen.pourcentage : "0",
      poids_tp: evaluations.value.tp.enabled ? evaluations.value.tp.pourcentage : "0",
      poids_expose: evaluations.value.expose.enabled ? evaluations.value.expose.pourcentage : "0"
    };

    console.log('Données soumises:', data);
    
    // Ici, vous feriez votre appel API réel
    // const url = isEditMode.value 
    //   ? `/api/unites-valeur/${route.params.id}`
    //   : '/api/unites-valeur';
    // const method = isEditMode.value ? 'PUT' : 'POST';
    
    // const response = await fetch(url, {
    //   method: method,
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    
    alert(isEditMode.value 
      ? 'Unité de valeur mise à jour avec succès!' 
      : 'Unité de valeur créée avec succès!');
    
    router.push('/admin/unites-valeur');
    
  } catch (error) {
    console.error('Erreur:', error);
    alert('Une erreur est survenue lors de la soumission du formulaire');
  }
};

// Annuler
const cancel = () => {
  router.push('/admin/unites-valeur');
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

/* Carte du formulaire */
.form-card {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Groupes de formulaire */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
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

.form-input:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

/* Styles spécifiques pour le select multiple */
.form-select[multiple] {
  min-height: 120px;
  padding: 8px;
}

.form-select[multiple] option {
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 2px;
  cursor: pointer;
}

.form-select[multiple] option:hover {
  background-color: #f3f4f6;
}

.form-select[multiple] option:checked {
  background-color: #10b981;
  color: white;
}

/* Cases à cocher en ligne */
.checkbox-inline {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #10b981;
}

.checkbox-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  user-select: none;
}

/* Section titre */
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

/* Message texte */
.text-muted {
  color: #6b7280;
  font-size: 13px;
}

/* Validation d'erreur */
.validation-error {
  margin-top: 10px;
  padding: 10px 16px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
  font-size: 14px;
  font-weight: 500;
}

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
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover {
  background-color: #2563eb;
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
    margin-bottom: 16px;
  }
}
</style>