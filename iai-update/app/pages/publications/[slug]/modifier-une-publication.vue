

<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb dynamique -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
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
      <span class="text-gray-900 font-medium cursor-default">
        {{ pageTitle }}
      </span>
    </div>

    <!-- Titre dynamique -->
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
      {{ pageTitle }}
    </h1>

    <!-- Indicateur de chargement -->
    <div v-if="isLoading" class="text-center py-12">
    <loading/>
    </div>

    <!-- Formulaire (affiché seulement quand le chargement est fini) -->
    <div v-else class="bg-white rounded-xl shadow-sm p-6">
      <form @submit.prevent="savePublication" class="space-y-6">
        <!-- Indicateur d'image existante (info) -->
        <div v-if="form.existingImage && !form.imageFile" class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
          <span class="font-medium">Image actuelle :</span> Vous pouvez la conserver ou la remplacer.
        </div>

        <!-- Reste du formulaire identique... -->
        <!-- Ligne 1: Titre -->
        <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
          <!-- Titre -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Titre de la publication <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Titre de votre publication"
            />
          </div>
        </div>

        <!-- Ligne 2: Statut -->
        <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Statut <span class="text-rose-500">*</span>
            </label>
            <select
              v-model="form.status"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </div>
        </div>

        <!-- Image du blog (section inchangée) -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
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
                ? 'border-indigo-500 bg-indigo-50'
                : imagePreview
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400',
            ]"
          >
            <!-- Image prévisualisée -->
            <div v-if="imagePreview" class="mb-4">
              <img
                :src="imagePreview"
                class="max-h-48 mx-auto rounded-lg object-cover"
                alt="Image prévisualisée"
              />
            </div>

            <!-- Icone et texte -->
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
              <p class="text-sm text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
            </div>

            <!-- Bouton changer -->
            <div v-if="imagePreview" class="mt-4">
              <button
                type="button"
                @click.stop="triggerFileInput"
                class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
          <p class="text-xs text-gray-500">
            L'image sera utilisée comme couverture de la publication. Format
            recommandé : 1200×630px
          </p>
        </div>

        <!-- Contenu (inchangé) -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700">
              Contenu de la publication <span class="text-rose-500">*</span>
            </label>
            <div class="text-sm text-gray-500">
              {{ contentLength }}/{{ contentLimit }} caractères
            </div>
          </div>

          <!-- Éditeur TinyMCE -->
          <div class="border border-gray-300 rounded-lg overflow-hidden">
            <ClientOnly>
              <Editor
                api-key="ktf8z0z55enm2wd9xyeoo6qzzoy7w9b629e51wii9y8lw4dx"
                v-model="form.content"
                :init="{
                  height: 250,
                  menubar: false,
                  plugins: 'lists link image media table wordcount',
                  toolbar:
                    'undo redo | bold italic underline | bullist numlist | link image media | removeformat',
                  content_style:
                    'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }"
              />
            </ClientOnly>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div
          class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200"
        >
          <NuxtLink
            to="/publications/liste"
            class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Annuler
          </NuxtLink>

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
            <span v-else>{{ form.id ? "Mettre à jour" : "Enregistrer" }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Editor from "@tinymce/tinymce-vue";
import { useBlogStore } from "~~/stores/blog";
import loading from "~/components/loading.vue";
import { useRoute } from "vue-router";

// Données du formulaire
const form = ref({
  title: "",
  imageFile: null, // Stocke le fichier image (nouvelle image)
  content: "",
  status: "draft",
  id: null, // Pour la modification
  existingImage: null, // URL de l'image existante
});

// Pour la prévisualisation
const imagePreview = ref(null);
const blogStore = useBlogStore();
const { $toastr } = useNuxtApp();

const dragover = ref(false);
const fileInput = ref(null);
const isSubmitting = ref(false);
const isLoading = ref(false);
const contentLimit = 10000;

const route = useRoute();

// Longueur du contenu
const contentLength = computed(() => {
  return form.value.content ? form.value.content.length : 0;
});

// Titre dynamique selon le mode
const pageTitle = computed(() => {
  return form.value.id ? "Modifier la publication" : "Ajouter une publication";
});

// Charger les données au montage du composant
onMounted(async () => {
  // Vérifier si on a un slug dans l'URL (pour l'édition)
  if (route.params.slug) {
    await loadBlogForEdit(route.params.slug);
  } else if (route.query.id) {
    // Fallback si l'ID est dans query
    await loadBlogForEdit(route.query.id);
  }
});

// Fonction pour charger un blog
async function loadBlogForEdit(slug) {
  try {
    isLoading.value = true;
    
    // Récupérer le blog depuis le store
    const blog = await blogStore.fetchBlog(slug);
    
    if (blog) {
      console.log("Blog chargé:", blog);
      
      // Remplir le formulaire avec les données existantes
      form.value.id = blog.slug;
      form.value.title = blog.title || "";
      form.value.content = blog.content || "";
      form.value.status = blog.status || "draft";
      
      // Stocker l'image existante
      if (blog.image) {
        form.value.existingImage = blog.image;
        // Afficher la prévisualisation avec l'image existante
        imagePreview.value = blog.image;
      }
    }
  } catch (error) {
    console.error("Erreur chargement:", error);
    $toastr.error("Erreur lors du chargement de la publication");
  } finally {
    isLoading.value = false;
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
  
  // Effacer l'image existante car on en met une nouvelle
  form.value.existingImage = null;

  // Créer une prévisualisation
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
}

const removeImage = () => {
  form.value.imageFile = null;
  form.value.existingImage = null;
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

    // Créer le FormData
    const formData = new FormData();
    
    formData.append("title", form.value.title.trim());
    formData.append("content", form.value.content);
    formData.append("status", form.value.status);
    
    // Gestion de l'image
    if (form.value.imageFile) {
      formData.append("image", form.value.imageFile);
    } else if (form.value.existingImage && !form.value.imageFile) {
   
      formData.append("keep_existing_image", "1");
    }

    let response;
    
    if (form.value.id) {
      // MISE À JOUR - Ajouter _method pour Laravel
      formData.append("_method", "PUT");
      response = await blogStore.updateBlog(form.value.id, formData);
      $toastr.success("Publication modifiée avec succès");
    } else {
      response = await blogStore.createBlog(formData);
      $toastr.success("Publication créée avec succès");
    }

      navigateTo("/publications/liste");

    
  } catch (error) {
    console.error("Erreur détaillée:", error);
    
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      let errorMessage = "";
      
      if (errors.image) errorMessage += errors.image.join("\n");
      if (errors.content) errorMessage += (errorMessage ? "\n" : "") + (errors.content?.join("\n") || "");
      if (errors.title) errorMessage += (errorMessage ? "\n" : "") + (errors.title?.join("\n") || "");
      
      $toastr.error(errorMessage || "Erreur de validation");
    } else {
      $toastr.error(error?.message || "Erreur lors de l'opération");
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Watcher pour surveiller les changements (optionnel)
watch(() => route.params.slug, (newSlug) => {
  if (newSlug && newSlug !== form.value.id) {
    loadBlogForEdit(newSlug);
  }
});
</script>