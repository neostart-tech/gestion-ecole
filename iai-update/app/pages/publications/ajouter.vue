<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <NuxtLink to="/publications/liste" class="cursor-pointer hover:text-indigo-600 transition-colors">
        Publications
      </NuxtLink>
      <span>/</span>
      <NuxtLink to="/publications/liste" class="cursor-pointer hover:text-indigo-600 transition-colors">
        Liste des publications
      </NuxtLink>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Ajouter une publication</span>
    </div>

    <!-- Titre -->
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Ajouter une publication</h1>

    <!-- Formulaire -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <form @submit.prevent="savePublication" class="space-y-6">
        <!-- Ligne 1: Titre et Auteur -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <!-- Auteur -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Auteur de la publication <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.author"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Ex: Service Communication"
            />
          </div>
        </div>

        <!-- Ligne 2: Date et Statut -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Date de publication -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Date de publication <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.date"
              type="date"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
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
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </div>
        </div>

        <!-- Image du blog -->
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
                : form.image 
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
            ]"
          >
            <!-- Image prévisualisée -->
            <div v-if="form.image" class="mb-4">
              <img 
                :src="form.image" 
                class="max-h-48 mx-auto rounded-lg object-cover"
                alt="Image prévisualisée"
              />
            </div>
            
            <!-- Icone et texte -->
            <div v-else class="py-4">
              <svg 
                :class="['w-12 h-12 mx-auto mb-4', dragover ? 'text-indigo-500' : 'text-gray-400']" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <p class="text-gray-600 mb-2">
                <span class="font-medium text-indigo-600">Cliquez pour télécharger</span> ou glissez-déposez
              </p>
              <p class="text-sm text-gray-500">
                PNG, JPG, GIF jusqu'à 10MB
              </p>
            </div>
            
            <!-- Bouton changer -->
            <div v-if="form.image" class="mt-4">
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
            L'image sera utilisée comme couverture de la publication. Format recommandé : 1200×630px
          </p>
        </div>

        <!-- Contenu -->
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
                v-model="form.content"
                :init="editorConfig"
                :key="editorKey"
              />
            </ClientOnly>
          </div>
        </div>

        <!-- Options supplémentaires -->
        <div class="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Options supplémentaires</h3>
          
          <div class="space-y-4">
            <!-- Extrait -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Extrait
                <span class="text-xs text-gray-500 ml-1">(optionnel)</span>
              </label>
              <textarea
                v-model="form.excerpt"
                rows="3"
                maxlength="300"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Courte description qui s'affichera dans la liste des publications"
              ></textarea>
              <div class="text-xs text-gray-500 text-right">
                {{ form.excerpt?.length || 0 }}/300 caractères
              </div>
            </div>

            <!-- Publication urgente -->
            <div class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">
                  Marquer comme publication urgente
                </label>
                <p class="text-sm text-gray-500">
                  Cette publication sera mise en avant avec un badge "URGENT"
                </p>
              </div>
              <div class="flex items-center">
                <button
                  type="button"
                  @click="form.isUrgent = !form.isUrgent"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    form.isUrgent ? 'bg-rose-600' : 'bg-gray-300'
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      form.isUrgent ? 'translate-x-6' : 'translate-x-1'
                    ]"
                  />
                </button>
              </div>
            </div>

            <!-- Catégories -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Catégories
                <span class="text-xs text-gray-500 ml-1">(optionnel)</span>
              </label>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(category, index) in form.categories"
                  :key="index"
                  class="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                >
                  {{ category }}
                  <button
                    type="button"
                    @click="removeCategory(index)"
                    class="text-indigo-500 hover:text-indigo-700"
                  >
                    ×
                  </button>
                </span>
                <input
                  v-model="newCategory"
                  @keyup.enter="addCategory"
                  @blur="addCategory"
                  type="text"
                  class="flex-1 min-w-[200px] px-3 py-1 border-0 focus:outline-none focus:ring-0"
                  placeholder="Ajouter une catégorie (appuyez sur Entrée)"
                />
              </div>
            </div>

            <!-- Mots-clés -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Mots-clés
                <span class="text-xs text-gray-500 ml-1">(optionnel)</span>
              </label>
              <input
                v-model="form.keywords"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Séparés par des virgules (ex: tech, innovation, web)"
              />
            </div>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
          <NuxtLink
            to="/publications/liste"
            class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Annuler
          </NuxtLink>
          
          <button
            type="button"
            @click="saveDraft"
            class="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
            </svg>
            Sauvegarder comme brouillon
          </button>
          
          <button
            type="submit"
            class="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            Publier maintenant
          </button>
        </div>
      </form>
    </div>

    <!-- Modal de confirmation -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="modal-content">
          <div class="modal-header border-b border-gray-200 p-6">
            <h5 class="modal-title text-lg font-semibold text-gray-900">Publication créée</h5>
            <button type="button" @click="closeSuccessModal" class="btn-close text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body p-6">
            <div class="text-center">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                {{ form.status === 'published' ? 'Publication réussie !' : 'Brouillon sauvegardé !' }}
              </h3>
              <p class="text-gray-600 mb-6">
                {{ form.status === 'published' 
                  ? 'Votre publication a été publiée avec succès.' 
                  : 'Votre brouillon a été sauvegardé. Vous pourrez le publier plus tard.' 
                }}
              </p>
            </div>
          </div>
          <div class="modal-footer border-t border-gray-200 p-6 flex justify-end gap-3">
            <button 
              type="button" 
              @click="closeSuccessModal"
              class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Continuer l'édition
            </button>
            <NuxtLink
              to="/publications/liste"
              class="btn btn-primary px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Voir la liste
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import Editor from '@tinymce/tinymce-vue';

// Réinitialiser l'éditeur
const editorKey = ref(0);
const forceEditorRerender = () => {
  editorKey.value += 1;
};

// Configuration de TinyMCE avec votre clé API
const editorConfig = {
  apiKey: 'zg2zugks07aopv32g7tny5709pnqww29mxbvn1oa8x7d78c7',
  height: 500,
  menubar: true,
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
  ],
  toolbar: 'undo redo | blocks | ' +
    'bold italic forecolor | alignleft aligncenter ' +
    'alignright alignjustify | bullist numlist outdent indent | ' +
    'removeformat | help | link image media',
  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
  language: 'fr_FR',
  images_upload_url: 'https://api.tiny.cloud/1/zg2zugks07aopv32g7tny5709pnqww29mxbvn1oa8x7d78c7/upload',
  automatic_uploads: true,
  file_picker_types: 'image',
  image_uploadtab: true,
  image_title: true,
  image_caption: true,
  quickbars_insert_toolbar: 'image media quicktable',
  branding: false
};

// Données du formulaire
const form = ref({
  title: '',
  author: '',
  date: new Date().toISOString().split('T')[0], // Date du jour
  image: null,
  content: '',
  excerpt: '',
  status: 'draft',
  isUrgent: false,
  categories: [],
  keywords: ''
});

const dragover = ref(false);
const fileInput = ref(null);
const newCategory = ref('');
const showSuccessModal = ref(false);
const contentLimit = 10000;

// Longueur du contenu
const contentLength = computed(() => {
  return form.value.content ? form.value.content.length : 0;
});

// Gestion de l'upload d'image
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      alert('Le fichier est trop volumineux. Maximum 10MB');
      return;
    }
    if (!file.type.match('image.*')) {
      alert('Veuillez sélectionner une image');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleDrop = (event) => {
  dragover.value = false;
  const file = event.dataTransfer.files[0];
  if (file && file.type.match('image.*')) {
    if (file.size > 10 * 1024 * 1024) {
      alert('Le fichier est trop volumineux. Maximum 10MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  form.value.image = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Gestion des catégories
const addCategory = () => {
  if (newCategory.value.trim() && !form.value.categories.includes(newCategory.value.trim())) {
    form.value.categories.push(newCategory.value.trim());
    newCategory.value = '';
  }
};

const removeCategory = (index) => {
  form.value.categories.splice(index, 1);
};

// Sauvegarder comme brouillon
const saveDraft = () => {
  form.value.status = 'draft';
  savePublication();
};

// Sauvegarder la publication
const savePublication = () => {
  // Validation
  if (!form.value.title.trim()) {
    alert('Le titre est obligatoire');
    return;
  }
  
  if (!form.value.author.trim()) {
    alert("L'auteur est obligatoire");
    return;
  }
  
  if (!form.value.content.trim()) {
    alert('Le contenu est obligatoire');
    return;
  }
  
  // Charger les publications existantes
  let publications = [];
  if (process.client) {
    const stored = localStorage.getItem('blogs');
    publications = stored ? JSON.parse(stored) : [];
  }
  
  // Créer la nouvelle publication
  const newPublication = {
    id: publications.length > 0 ? Math.max(...publications.map(p => p.id)) + 1 : 1,
    title: form.value.title,
    author: form.value.author,
    date: form.value.date,
    image: form.value.image,
    content: form.value.content,
    excerpt: form.value.excerpt || form.value.content.substring(0, 150) + '...',
    status: form.value.status,
    isUrgent: form.value.isUrgent,
    categories: form.value.categories,
    keywords: form.value.keywords.split(',').map(k => k.trim()).filter(k => k)
  };
  
  // Ajouter à la liste
  publications.push(newPublication);
  
  // Sauvegarder dans localStorage
  if (process.client) {
    localStorage.setItem('blogs', JSON.stringify(publications));
  }
  
  // Afficher le modal de succès
  showSuccessModal.value = true;
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
};

// Réinitialiser l'éditeur si nécessaire
onMounted(() => {
  nextTick(() => {
    forceEditorRerender();
  });
});
</script>

<style scoped>
/* Styles pour l'éditeur */
:deep(.tox-tinymce) {
  border: none !important;
  border-radius: 0.5rem !important;
}

:deep(.tox-editor-header) {
  border-bottom: 1px solid #e5e7eb !important;
}

:deep(.tox-statusbar) {
  border-top: 1px solid #e5e7eb !important;
}

/* Styles pour les catégories */
.category-tag {
  transition: all 0.2s ease;
}

.category-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Animation pour le drag & drop */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.dragover-animation {
  animation: pulse 2s infinite;
}
</style>