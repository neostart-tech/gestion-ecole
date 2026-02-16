<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Espace Étudiant', to: '/' },
        { label: 'Mes notes', to: '/etudiant/mes-notes' },
        { label: 'Réclamer une note', to: null },
      ]"
      title="Réclamer une note"
      title-class="text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-6"
    />

    <!-- Alert info -->
    <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-blue-700 dark:text-blue-300">
            Vous êtes sur le point de faire une réclamation sur une note. Veuillez fournir des justificatifs clairs et un motif détaillé.
          </p>
        </div>
      </div>
    </div>

    <!-- Formulaire -->
    <form
      @submit.prevent="submitReclamation"
      class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-6"
    >
      <!-- Évaluation concernée -->
      <div>
        <label class="block text-gray-700 dark:text-gray-300 font-medium mb-2"
          >Évaluation concernée *</label
        >
        <select
          v-model="form.evaluation_id"
          required
          class="w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        >
          <option value="" disabled>Sélectionner une évaluation</option>
          <option 
            v-for="evaluation in evaluations" 
            :key="evaluation.id" 
            :value="evaluation.id"
          >
            {{ evaluation.matiere }} - {{ evaluation.titre }} (Note: {{ evaluation.note }}/20)
          </option>
        </select>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Sélectionnez l'évaluation pour laquelle vous voulez réclamer
        </p>
      </div>

      <!-- Note actuelle (affichage info) -->
      <div v-if="selectedEvaluation" class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
        <div class="flex items-center justify-between">
          <span class="text-gray-600 dark:text-gray-400">Note actuelle :</span>
          <span class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {{ selectedEvaluation.note }}/20
          </span>
        </div>
        <div class="flex items-center justify-between mt-2">
          <span class="text-gray-600 dark:text-gray-400">Matière :</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ selectedEvaluation.matiere }}</span>
        </div>
        <div class="flex items-center justify-between mt-2">
          <span class="text-gray-600 dark:text-gray-400">Enseignant :</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ selectedEvaluation.enseignant }}</span>
        </div>
      </div>

      <!-- Nouvelle note proposée -->
      <div>
        <label class="block text-gray-700 dark:text-gray-300 font-medium mb-2"
          >Note proposée (optionnel)</label
        >
        <div class="relative">
          <input
            v-model="form.nouvelle_note"
            type="number"
            step="0.01"
            min="0"
            max="20"
            placeholder="Ex: 15.5"
            class="w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 pr-12"
          />
          <span class="absolute right-3 top-3 text-gray-500 dark:text-gray-400">/20</span>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Laissez vide si vous ne proposez pas de note spécifique
        </p>
      </div>

      <!-- Motif de la réclamation -->
      <div>
        <label class="block text-gray-700 dark:text-gray-300 font-medium mb-2"
          >Motif de la réclamation *</label
        >
        <Editor
          api-key="ktf8z0z55enm2wd9xyeoo6qzzoy7w9b629e51wii9y8lw4dx"
          v-model="form.motif"
          :init="{
            height: 250,
            menubar: false,
            plugins: 'lists link wordcount',
            toolbar: 'undo redo | bold italic underline | bullist numlist | removeformat',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            placeholder: 'Expliquez clairement les raisons de votre réclamation...'
          }"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Minimum 10 caractères - Soyez précis dans votre explication
        </p>
      </div>

      <!-- Fichier justificatif -->
      <div>
        <label class="block text-gray-700 dark:text-gray-300 font-medium mb-2"
          >Fichier justificatif (optionnel)</label
        >
        
        <!-- Zone de drop -->
        <div 
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleFileDrop"
          :class="[
            'border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer',
            isDragging 
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-400'
          ]"
        >
          <input
            ref="fileInput"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            @change="handleFileSelect"
            class="hidden"
          />
          
          <div v-if="!form.fichier_justificatif" class="text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H8a4 4 0 01-4-4V12a4 4 0 014-4h12m20 0v4a4 4 0 01-4 4h-4m-6 0h-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span class="font-medium text-indigo-600 dark:text-indigo-400">Cliquez pour uploader</span> ou glissez-déposez
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              PDF, JPG, PNG (max. 5MB)
            </p>
          </div>

          <!-- Preview du fichier -->
          <div v-else class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="text-sm">
                <p class="font-medium text-gray-900 dark:text-white">{{ form.fichier_justificatif.name }}</p>
                <p class="text-gray-500 dark:text-gray-400">{{ formatFileSize(form.fichier_justificatif.size) }}</p>
              </div>
            </div>
            <button 
              type="button"
              @click="removeFile"
              class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Récapitulatif avant envoi -->
      <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-2 flex items-center">
          <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          Avant de soumettre
        </h4>
        <ul class="text-xs text-yellow-700 dark:text-yellow-400 list-disc list-inside space-y-1">
          <li>Vérifiez que vous avez sélectionné la bonne évaluation</li>
          <li>Assurez-vous que votre motif est clair et détaillé</li>
          <li>Les justificatifs doivent être lisibles et pertinents</li>
          <li>Une fois soumise, la réclamation ne peut pas être modifiée</li>
        </ul>
      </div>

      <!-- Boutons d'action -->
      <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          @click="cancelReclamation"
          class="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          :disabled="isSubmitting || !isFormValid"
          class="px-6 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isSubmitting ? 'Envoi en cours...' : 'Soumettre la réclamation' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useNuxtApp } from "#app";
import Breadcrumb from "~/components/Breadcrumb.vue";
import Editor from "@tinymce/tinymce-vue";

const router = useRouter();
const { $swal } = useNuxtApp();

// État du formulaire
const form = ref({
  evaluation_id: "",
  motif: "",
  nouvelle_note: "",
  fichier_justificatif: null
});

// État UI
const isSubmitting = ref(false);
const isDragging = ref(false);
const fileInput = ref(null);

// Données mockées pour les évaluations (à remplacer par appel API)
const evaluations = ref([
  {
    id: 1,
    matiere: "Mathématiques",
    titre: "Examen final S1",
    note: 12.5,
    enseignant: "M. Koné",
    date: "2024-12-15"
  },
  {
    id: 2,
    matiere: "Programmation Web",
    titre: "Projet Laravel",
    note: 8.0,
    enseignant: "Mme. Diallo",
    date: "2024-12-20"
  },
  {
    id: 3,
    matiere: "Base de données",
    titre: "Contrôle continu",
    note: 15.0,
    enseignant: "M. Traoré",
    date: "2024-12-10"
  }
]);

// Évaluation sélectionnée
const selectedEvaluation = computed(() => {
  return evaluations.value.find(e => e.id === form.value.evaluation_id);
});

// Validation du formulaire
const isFormValid = computed(() => {
  return form.value.evaluation_id && 
         form.value.motif && 
         form.value.motif.length >= 10;
});

// Gestionnaires de fichiers
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    validateAndSetFile(file);
  }
};

const handleFileDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file) {
    validateAndSetFile(file);
  }
};

const validateAndSetFile = (file) => {
  // Validation du type
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    $swal.fire({
      icon: 'error',
      title: 'Type de fichier non supporté',
      text: 'Veuillez uploader un fichier PDF, JPG ou PNG.'
    });
    return;
  }

  // Validation de la taille (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB en bytes
  if (file.size > maxSize) {
    $swal.fire({
      icon: 'error',
      title: 'Fichier trop volumineux',
      text: 'La taille maximum est de 5MB.'
    });
    return;
  }

  form.value.fichier_justificatif = file;
};

const removeFile = () => {
  form.value.fichier_justificatif = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Actions
const submitReclamation = async () => {
  if (!isFormValid.value) return;

  try {
    isSubmitting.value = true;

    // Créer un FormData pour l'envoi
    const formData = new FormData();
    formData.append('evaluation_id', form.value.evaluation_id);
    formData.append('motif', form.value.motif);
    if (form.value.nouvelle_note) {
      formData.append('nouvelle_note', form.value.nouvelle_note);
    }
    if (form.value.fichier_justificatif) {
      formData.append('fichier_justificatif', form.value.fichier_justificatif);
    }

    // Simulation d'appel API (à remplacer par votre vraie API)
    console.log('Données à envoyer:', Object.fromEntries(formData));
    
    // Simuler un délai d'envoi
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Success
    await $swal.fire({
      icon: 'success',
      title: 'Réclamation envoyée !',
      text: 'Votre réclamation a été soumise avec succès. Vous serez notifié du traitement.',
      timer: 2000,
      showConfirmButton: false
    });

    // Redirection vers la liste des réclamations
    router.push('/etudiant/mes-reclamations');

  } catch (error) {
    console.error('Erreur:', error);
    
    // Gestion des erreurs de validation
    if (error.response?.status === 422) {
      const messages = Object.entries(error.response.data.errors)
        .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
        .join('<br>');
      
      $swal.fire({
        icon: 'error',
        title: 'Erreur de validation',
        html: messages
      });
    } else {
      $swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible d\'envoyer la réclamation. Veuillez réessayer.'
      });
    }
  } finally {
    isSubmitting.value = false;
  }
};

const cancelReclamation = () => {
  // Demander confirmation si le formulaire est rempli
  if (form.value.evaluation_id || form.value.motif || form.value.fichier_justificatif) {
    $swal.fire({
      icon: 'question',
      title: 'Annuler ?',
      text: 'Voulez-vous vraiment annuler ? Les données saisies seront perdues.',
      showCancelButton: true,
      confirmButtonText: 'Oui, annuler',
      cancelButtonText: 'Non, continuer'
    }).then((result) => {
      if (result.isConfirmed) {
        router.back();
      }
    });
  } else {
    router.back();
  }
};

// Initialisation
onMounted(() => {
  // Vous pourrez plus tard charger les vraies évaluations depuis l'API
  // await evaluationStore.fetchMesEvaluationsAvecNotes();
});
</script>

<style scoped>
/* Animation pour le drag & drop */
.border-dashed {
  transition: all 0.2s ease;
}
</style>