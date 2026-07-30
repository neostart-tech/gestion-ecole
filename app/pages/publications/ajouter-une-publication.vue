<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
      <NuxtLink
        to="/publications/liste"
        class="cursor-pointer hover:text-indigo-600 transition-colors"
      >
        Publications
      </NuxtLink>
      <span>/</span>
      <NuxtLink
        to="/publications/liste"
        class="cursor-pointer hover:text-indigo-600 transition-colors"
      >
        Liste des publications
      </NuxtLink>
      <span>/</span>
      <span class="text-gray-900 dark:text-white font-medium cursor-default"
        >Ajouter une publication</span
      >
    </div>

    <!-- Titre -->
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-6">
      Ajouter une publication
    </h1>

    <!-- Formulaire -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <form @submit.prevent="savePublication" class="space-y-6">
        <!-- Ligne 1: Titre -->
        <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
          <!-- Titre -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Titre de la publication <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Titre de votre publication"
            />
          </div>
        </div>

        <!-- Ligne 2: Statut et Date -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Statut <span class="text-rose-500">*</span>
            </label>
            <select
              v-model="form.status"
              required
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date de publication
            </label>
            <input
              v-model="form.created_at"
              type="datetime-local"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
            />
            <p class="text-xs text-gray-500">Laissez vide pour la date d'aujourd'hui. Modifiez pour antidater.</p>
          </div>
        </div>

        <!-- Image du blog -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Image du blog
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
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : form.imageFile || form.imagePreview
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
            ]"
          >
            <div v-if="imagePreview" class="mb-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
              <img
                :src="imagePreview"
                class="max-h-64 mx-auto rounded-lg object-contain shadow-sm"
                alt="Image prévisualisée"
              />
            </div>

            <!-- Icone et texte -->
            <div v-else class="py-4">
              <svg
                :class="[
                  'w-12 h-12 mx-auto mb-4',
                  dragover ? 'text-indigo-500' : 'text-gray-400 dark:text-gray-500',
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
              <p class="text-gray-600 dark:text-gray-400 mb-2">
                <span class="font-medium text-indigo-600"
                  >Cliquez pour télécharger</span
                >
                ou glissez-déposez
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">PNG, JPG, GIF jusqu'à 10MB</p>
            </div>

            <!-- Bouton changer -->
            <div v-if="imagePreview" class="mt-4">
              <button
                type="button"
                @click.stop="triggerFileInput"
                class="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Changer l'image
              </button>
              <button
                type="button"
                @click.stop="removeImage"
                class="ml-3 px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>

          <!-- Input fichier caché -->
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleFileUpload"
            class="hidden"
          />

          <!-- Aide -->
          <p class="text-xs text-gray-500 dark:text-gray-400">
            L'image sera utilisée comme couverture de la publication. Format
            recommandé : 1200×630px
          </p>
        </div>

        <!-- Contenu -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contenu de la publication <span class="text-rose-500">*</span>
            </label>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ contentLength }}/{{ contentLimit }} caractères
            </div>
          </div>

          <CustomQuillEditor v-model="form.content" />

        </div>

        <!-- Boutons d'action -->
        <div
          class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700"
        >
          <NuxtLink
            to="/publications/liste"
            class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Annuler
          </NuxtLink>

          <Can action="create-blog">
            <button
              type="submit"
              :disabled="isSubmitting"
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
          </Can>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useBlogStore } from "~~/stores/blog";
import { useThemeStore } from "~~/stores/theme";

const themeStore = useThemeStore();

const contentLength = computed(() => {
  if (!form.value.content) return 0;
  return form.value.content.replace(/<[^>]*>?/gm, '').length;
});

// Données du formulaire
const form = ref({
  title: "",
  imageFile: null,
  content: "",
  status: "draft",
  created_at: "", // Pour antidater
  id: null,
});

// Pour la prévisualisation
const imagePreview = ref(null);

const blogStore = useBlogStore();
const { $toastr } = useNuxtApp();

const dragover = ref(false);
const fileInput = ref(null);
const isSubmitting = ref(false);
const contentLimit = 10000;

// Vérifier si on est en mode édition
const route = useRoute();
if (route.query.id) {
  // Mode édition - charger les données
  form.value.id = route.query.id;
  loadBlogForEdit(route.query.id);
}



// Charger un blog pour modification
async function loadBlogForEdit(id) {
  try {
    const blog = await blogStore.fetchBlog(id);
    if (blog) {
      form.value.title = blog.title || "";
      form.value.content = blog.content || "";
      form.value.status = blog.status || "draft";
      
      // Si le blog a une image existante
      if (blog.image) {
        imagePreview.value = blog.image; // URL de l'image existante
      }
    }
  } catch (error) {
    $toastr.error("Erreur lors du chargement de la publication");
  }
}

// Gestion de l'upload d'image
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  processImageFile(file);
};

const handleDrop = (event) => {
  dragover.value = false;
  const file = event.dataTransfer.files[0];
  processImageFile(file);
};

function processImageFile(file) {
  if (!file) return;
  
  // Vérifications
  if (file.size > 10 * 1024 * 1024) {
    $toastr.warning("Le fichier est trop volumineux. Maximum 10MB");
    return;
  }
  
  if (!file.type.startsWith("image/")) {
    $toastr.warning("Veuillez sélectionner une image");
    return;
  }

  // Stocker le fichier pour l'envoi
  form.value.imageFile = file;

  // Créer une prévisualisation
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
}

const removeImage = () => {
  form.value.imageFile = null;
  imagePreview.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// Sauvegarder la publication
const savePublication = async () => {
  try {
    // Validation
    if (!form.value.title?.trim()) {
      $toastr.warning("Le titre est obligatoire");
      return;
    }
    
    if (!form.value.content?.trim()) {
      $toastr.warning("Le contenu est obligatoire");
      return;
    }

    isSubmitting.value = true;

    // Créer le FormData correctement
    const formData = new FormData();
    
    formData.append("title", form.value.title.trim());
    formData.append("content", form.value.content);
    formData.append("status", form.value.status);
    
    if (form.value.created_at) {
      formData.append("created_at", form.value.created_at);
    }
    
    // IMPORTANT: Ajouter le fichier image si présent
    if (form.value.imageFile) {
      formData.append("image", form.value.imageFile);
    }

    let response;
    if (form.value.id) {
      response = await blogStore.updateBlog(form.value.id, formData);
      
      // Si la modification demande une publication mais que ce n'est pas pris en compte, on force :
      if (form.value.status === 'published' && response?.status !== 'published') {
         await blogStore.publishBlog(response.slug || response.id);
      }
      
      $toastr.success("Publication modifiée avec succès");
    } else {
      // CRÉATION
      response = await blogStore.createBlog(formData);
      
      // Correction : Forcer la publication immédiatement si c'est sélectionné
      if (form.value.status === 'published') {
         await blogStore.publishBlog(response.slug || response.id);
      }
      
      $toastr.success("Publication créée avec succès");
    }

      navigateTo("/publications/liste");
    
  } catch (error) {
    console.error("Erreur détaillée:", error);
    
    // Afficher les erreurs de validation du backend
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      let errorMessage = "";
      
      if (errors.image) {
        errorMessage += errors.image.join("\n");
      }
      if (errors.content) {
        errorMessage += (errorMessage ? "\n" : "") + errors.content.join("\n");
      }
      if (errors.title) {
        errorMessage += (errorMessage ? "\n" : "") + errors.title.join("\n");
      }
      
      $toastr.error(errorMessage || "Erreur de validation");
    } else {
      $toastr.error(error?.message || "Erreur lors de l'opération");
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>