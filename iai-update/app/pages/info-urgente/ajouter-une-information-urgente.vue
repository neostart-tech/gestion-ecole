<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Administration', to: '/' },
        { label: 'Ajouter une informations urgente', to: null },
      ]"
      title="Ajouter une information urgente"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Titre -->
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
      Ajouter une information urgente
    </h1>

    <!-- Formulaire -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <form @submit.prevent="savePublication" class="space-y-6">
        <!-- Titre -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Titre de l'info urgente <span class="text-rose-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Titre de l'information urgente"
          />
        </div>

        <!-- Résumé -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Résumé de l'info urgente <span class="text-rose-500">*</span>
          </label>
          <textarea
            v-model="form.summary"
            required
            rows="4"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Résumé de l'information urgente"
          ></textarea>
        </div>

        <!-- Lien (optionnel) -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Lien de l'info urgente
          </label>
          <input
            v-model="form.file_url"
            type="url"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="https://example.com/document.pdf"
          />
          <p class="text-xs text-gray-500">
            Laissez vide si vous joignez un fichier
          </p>
        </div>

        <!-- Statut -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Statut <span class="text-rose-500">*</span>
          </label>
          <select
            v-model="form.status"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
          >
            <option value="0">Non publié</option>
            <option value="1">Publié</option>
          </select>
        </div>

        <!-- Upload de fichier (PDF, Word, Images) -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Fichier joint (PDF, Word, Image) <span class="text-rose-500">*</span>
          </label>

          <!-- Zone de téléchargement -->
          <div
            @click="triggerFileInput"
            @dragover.prevent="dragover = true"
            @dragleave="dragover = false"
            @drop.prevent="handleDrop"
            :class="[
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all',
              dragover
                ? 'border-indigo-500 bg-indigo-50'
                : form.uploadedFile
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400',
            ]"
          >
            <!-- Prévisualisation selon le type de fichier -->
            <div v-if="form.uploadedFile" class="mb-4">
              <!-- Image preview -->
              <div v-if="isImageFile(form.uploadedFile)" class="relative">
                <img
                  :src="filePreview"
                  class="max-h-48 mx-auto rounded-lg object-cover"
                  alt="Aperçu"
                />
              </div>
              
              <!-- PDF preview -->
              <div v-else-if="isPdfFile(form.uploadedFile)" class="py-4">
                <svg class="w-16 h-16 mx-auto text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .8-.7 1.5-1.5 1.5H8v1.5h2v.5H8v1.5h2.5c.8 0 1.5-.7 1.5-1.5v-1c0-.8-.7-1.5-1.5-1.5h-1v-1h2.5V9.5zM13.5 9h1v5h-1V9zm4 3h-2v1.5h2v.5h-2v1.5h2.5c.8 0 1.5-.7 1.5-1.5v-1c0-.8-.7-1.5-1.5-1.5H16v-1h2V9h-2.5c-.8 0-1.5.7-1.5 1.5v1c0 .8.7 1.5 1.5 1.5h1v1h-2v1.5h2.5c.8 0 1.5-.7 1.5-1.5v-1c0-.8-.7-1.5-1.5-1.5H16v-1h2V9z"/>
                </svg>
                <p class="mt-2 font-medium text-gray-700">{{ form.uploadedFile.name }}</p>
                <p class="text-sm text-gray-500">{{ formatFileSize(form.uploadedFile.size) }}</p>
              </div>

              <!-- Word preview -->
              <div v-else-if="isWordFile(form.uploadedFile)" class="py-4">
                <svg class="w-16 h-16 mx-auto text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm1.5 14h-5v-1.5h5V16zm0-3h-5v-1.5h5V13zm0-3h-5V8.5h5V10zM13 9V3.5L18.5 9H13z"/>
                </svg>
                <p class="mt-2 font-medium text-gray-700">{{ form.uploadedFile.name }}</p>
                <p class="text-sm text-gray-500">{{ formatFileSize(form.uploadedFile.size) }}</p>
              </div>
            </div>

            <!-- Icone et texte par défaut -->
            <div v-else class="py-4">
              <svg
                :class="[
                  'w-12 h-12 mx-auto mb-4',
                  dragover ? 'text-indigo-500' : 'text-gray-400',
                ]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p class="text-gray-600 mb-2">
                <span class="font-medium text-indigo-600"
                  >Cliquez pour télécharger</span
                >
                ou glissez-déposez
              </p>
              <p class="text-sm text-gray-500">
                PDF, Word, Excel, PowerPoint, Images jusqu'à 10MB
              </p>
              <p class="text-xs text-gray-400 mt-2">
                Formats acceptés : .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .jpg, .jpeg, .png, .gif
              </p>
            </div>

            <!-- Boutons d'action -->
            <div v-if="form.uploadedFile" class="mt-4 flex justify-center gap-2">
              <button
                type="button"
                @click.stop="triggerFileInput"
                class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Changer le fichier
              </button>
              <button
                type="button"
                @click.stop="removeFile"
                class="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>

          <!-- Input fichier caché -->
          <input
            ref="fileInput"
            type="file"
            :accept="acceptedFileTypes"
            @change="handleFileUpload"
            class="hidden"
          />

          <!-- Aide -->
          <p class="text-xs text-gray-500">
            * Le fichier est obligatoire si aucun lien n'est fourni
          </p>
        </div>

        <!-- Boutons d'action -->
        <div
          class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200"
        >
          <NuxtLink
            to="/info-urgente/liste"
            class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Annuler
          </NuxtLink>

          <button
            type="submit"
            :disabled="isSubmitting || !canSubmit"
            class="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              v-if="!isSubmitting"
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span v-if="isSubmitting">Enregistrement...</span>
            <span v-else>Enregistrer</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUrgentInfoStore } from "~~/stores/urgent-info";
import Breadcrumb from "~/components/Breadcrumb.vue";

// Données du formulaire
const form = ref({
  title: "",
  summary: "",
  file_url: "",
  uploadedFile: null,
  status: "0",
  id: null,
});

// Pour la prévisualisation des images
const filePreview = ref(null);
const dragover = ref(false);
const fileInput = ref(null);
const isSubmitting = ref(false);

const urgentinfoStore = useUrgentInfoStore();
const { $toastr } = useNuxtApp();
const route = useRoute();

// Types de fichiers acceptés
const acceptedFileTypes = computed(() => {
  return [
    'image/*',
    '.pdf',
    '.doc', '.docx',
    '.xls', '.xlsx',
    '.ppt', '.pptx',
    '.txt'
  ].join(',');
});

// Vérification du type de fichier
const isImageFile = (file) => {
  return file && file.type.startsWith('image/');
};

const isPdfFile = (file) => {
  return file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));
};

const isWordFile = (file) => {
  return file && (
    file.type === 'application/msword' ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.name.toLowerCase().endsWith('.doc') ||
    file.name.toLowerCase().endsWith('.docx')
  );
};

// Vérification si on peut soumettre
const canSubmit = computed(() => {
  // Soit un fichier uploadé, soit un lien valide
  return form.value.uploadedFile || (form.value.file_url && form.value.file_url.trim() !== '');
});

// Formatage de la taille du fichier
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Gestion de l'upload de fichier
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  processFile(file);
};

const handleDrop = (event) => {
  dragover.value = false;
  const file = event.dataTransfer.files[0];
  processFile(file);
};

function processFile(file) {
  if (!file) return;

  // Vérifications de taille (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    $toastr.warning("Le fichier est trop volumineux. Maximum 10MB");
    return;
  }

  // Vérification du type de fichier
  const fileName = file.name.toLowerCase();
  const isAllowed = 
    file.type.startsWith('image/') ||
    fileName.endsWith('.pdf') ||
    fileName.endsWith('.doc') || fileName.endsWith('.docx') ||
    fileName.endsWith('.xls') || fileName.endsWith('.xlsx') ||
    fileName.endsWith('.ppt') || fileName.endsWith('.pptx') ||
    fileName.endsWith('.txt');

  if (!isAllowed) {
    $toastr.warning("Type de fichier non autorisé");
    return;
  }

  // Stocker le fichier
  form.value.uploadedFile = file;

  // Si c'est une image, créer une prévisualisation
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      filePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    filePreview.value = null;
  }

  // Effacer le lien si un fichier est uploadé
  form.value.file_url = "";
}

const removeFile = () => {
  form.value.uploadedFile = null;
  filePreview.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// Sauvegarder l'information urgente
const savePublication = async () => {
  try {
    // Validations
    if (!form.value.title?.trim()) {
      $toastr.warning("Le titre est obligatoire");
      return;
    }

    if (!form.value.summary?.trim()) {
      $toastr.warning("Le résumé est obligatoire");
      return;
    }

    if (!form.value.uploadedFile && !form.value.file_url?.trim()) {
      $toastr.warning("Vous devez fournir soit un fichier, soit un lien");
      return;
    }

    isSubmitting.value = true;

    // Créer le FormData
    const formData = new FormData();

    formData.append("title", form.value.title.trim());
    formData.append("summary", form.value.summary.trim());
    formData.append("is_published", form.value.status);

    // Ajouter le lien si présent
    if (form.value.file_url?.trim()) {
      formData.append("file_url", form.value.file_url.trim());
    }

    // Ajouter le fichier si présent
    if (form.value.uploadedFile) {
      formData.append("file", form.value.uploadedFile);
    }

    // Envoyer au store
    await urgentinfoStore.createUrgentInfo(formData);
    
    $toastr.success("Information urgente créée avec succès");
    navigateTo("/info-urgente/liste");

  } catch (error) {
    console.error("Erreur détaillée:", error);

    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      let errorMessage = "";

      if (errors.file) errorMessage += errors.file.join("\n");
      if (errors.title) errorMessage += (errorMessage ? "\n" : "") + (errors.title?.join("\n") || "");
      if (errors.summary) errorMessage += (errorMessage ? "\n" : "") + (errors.summary?.join("\n") || "");

      $toastr.error(errorMessage || "Erreur de validation");
    } else {
      $toastr.error(error?.message || "Erreur lors de l'opération");
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Charger les données en mode édition (si ID présent)
onMounted(() => {
  if (route.query.id) {
    loadUrgentInfoForEdit(route.query.id);
  }
});

async function loadUrgentInfoForEdit(id) {
  try {
    const info = await urgentinfoStore.fetchUrgentInfo(id);
    if (info) {
      form.value.id = info.id;
      form.value.title = info.title || "";
      form.value.summary = info.summary || "";
      form.value.file_url = info.file_url || "";
      form.value.status = info.status?.toString() || "0";
      
      // Si l'info a un fichier existant, on pourrait l'afficher
      if (info.file) {
        // Logique pour afficher le fichier existant
      }
    }
  } catch (error) {
    $toastr.error("Erreur lors du chargement de l'information");
  }
}
</script>