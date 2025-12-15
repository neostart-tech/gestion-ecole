<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <NuxtLink to="/admin/evenements" class="cursor-pointer hover:text-indigo-600 transition-colors">
        Évènements
      </NuxtLink>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Ajouter un évènement</span>
    </div>

    <!-- Titre -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-900">Ajouter un évènement</h1>
      <button 
        @click="goBack"
        class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Retour
      </button>
    </div>

    <!-- Formulaire d'ajout -->
    <div class="bg-white rounded-xl shadow-sm p-4 md:p-6">
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Titre de la publication -->
        <div>
          <label for="titre" class="block text-sm font-medium text-gray-700 mb-2">
            Titre de la publication <span class="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="titre"
            v-model="form.titre"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Entrez le titre de l'évènement"
            :class="{ 'border-rose-500': errors.titre }"
          />
          <p v-if="errors.titre" class="mt-1 text-sm text-rose-600">{{ errors.titre }}</p>
        </div>

        <!-- Dates de l'évènement -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Date de début -->
          <div>
            <label for="date_debut" class="block text-sm font-medium text-gray-700 mb-2">
              Date de début de l'évènement <span class="text-rose-500">*</span>
            </label>
            <div class="relative">
              <input
                type="date"
                id="date_debut"
                v-model="form.date_debut"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                :class="{ 'border-rose-500': errors.date_debut }"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
            <p v-if="errors.date_debut" class="mt-1 text-sm text-rose-600">{{ errors.date_debut }}</p>
          </div>

          <!-- Date de fin -->
          <div>
            <label for="date_fin" class="block text-sm font-medium text-gray-700 mb-2">
              Date de fin de l'évènement
            </label>
            <div class="relative">
              <input
                type="date"
                id="date_fin"
                v-model="form.date_fin"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                :class="{ 'border-rose-500': errors.date_fin }"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
            <p v-if="errors.date_fin" class="mt-1 text-sm text-rose-600">{{ errors.date_fin }}</p>
            <p class="mt-1 text-xs text-gray-500">Laisser vide si l'évènement dure un seul jour</p>
          </div>
        </div>

        

        <!-- Contenu de la publication avec TinyMCE -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700">
              Contenu de la publication <span class="text-rose-500">*</span>
            </label>
            <button 
              type="button"
              @click="showEmojiPicker = !showEmojiPicker"
              class="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              <span>⚡️</span>
              Emojis
            </button>
          </div>
          
          <!-- Sélecteur d'emojis -->
          <div v-if="showEmojiPicker" class="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div class="grid grid-cols-6 gap-2">
              <button 
                v-for="emoji in popularEmojis" 
                :key="emoji"
                type="button"
                @click="insertEmoji(emoji)"
                class="text-xl p-2 hover:bg-white rounded-md transition-colors"
                :title="emoji"
              >
                {{ emoji }}
              </button>
            </div>
          </div>

          <!-- TinyMCE Editor -->
          <div :class="{ 'border-rose-500 rounded-lg': errors.contenu }">
            <Editor
              v-model="form.contenu"
              :api-key="tinymceApiKey"
              :init="editorConfig"
              class="tinymce-editor"
            />
          </div>
          <p v-if="errors.contenu" class="mt-1 text-sm text-rose-600">{{ errors.contenu }}</p>
          <p class="mt-1 text-xs text-gray-500">Utilisez l'éditeur pour formater votre contenu avec des images, des liens, etc.</p>
        </div>

        <!-- Statut de publication -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Statut de publication
          </label>
          <div class="flex flex-wrap gap-4">
            <label class="inline-flex items-center">
              <input
                type="radio"
                v-model="form.statut"
                value="published"
                class="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2 text-gray-700">Publié immédiatement</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                v-model="form.statut"
                value="scheduled"
                class="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2 text-gray-700">Planifié</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                v-model="form.statut"
                value="draft"
                class="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2 text-gray-700">Brouillon</span>
            </label>
          </div>
        </div>

        <!-- Information additionnelle (optionnelle) -->
       

        <!-- Boutons d'action -->
        <div class="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="goBack"
            class="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            {{ isSubmitting ? 'Publication en cours...' : 'Publier l\'évènement' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Aperçu en temps réel (optionnel) -->
    <div v-if="form.titre" class="mt-8 bg-white rounded-xl shadow-sm p-4 md:p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Aperçu de l'évènement</h3>
      <div class="border border-gray-200 rounded-lg p-6">
        <h4 class="text-xl font-semibold text-gray-900 mb-2">{{ form.titre }}</h4>
        <div class="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {{ formatDate(form.date_debut) }}
            <span v-if="form.date_fin"> - {{ formatDate(form.date_fin) }}</span>
          </span>
          <span v-if="form.location" class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            {{ form.location }}
          </span>
        </div>
        <div class="prose max-w-none" v-html="form.contenu"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Editor from '@tinymce/tinymce-vue';

// Clé API TinyMCE
const tinymceApiKey = 'zg2zugks07aopv32g7tny5709pnqww29mxbvn1oa8x7d78c7';

// Configuration de l'éditeur TinyMCE
const editorConfig = {
  height: 400,
  menubar: true,
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'emoticons'
  ],
  toolbar: 'undo redo | blocks | ' +
    'bold italic forecolor | alignleft aligncenter ' +
    'alignright alignjustify | bullist numlist outdent indent | ' +
    'removeformat | link image | emoticons | help',
  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
  images_upload_url: '/api/upload', // URL d'upload d'images
  automatic_uploads: true,
  file_picker_types: 'image',
  promotion: false,
  branding: false,
  emoticons_database: 'emojis',
  emoticons_append: {
    custom_mind_explode: {
      keywords: ['brain', 'mind', 'explode', 'blown'],
      char: '🤯'
    }
  }
};

// Émojis populaires
const popularEmojis = [
  '⚡️', '🔥', '🎉', '🚀', '✨', '🌟', '💡', '🎯', '📢', '📅',
  '👥', '🎓', '💼', '💻', '📱', '🌐', '🤝', '💬', '📊', '🎨',
  '🏆', '🎪', '📈', '🔧', '🔄', '🎭', '📚', '🏢', '🌍', '⭐'
];

// Référence au champ fichier
const fileInput = ref(null);

// État du formulaire
const form = ref({
  titre: '',
  date_debut: '',
  date_fin: '',
  contenu: '',
  statut: 'published',
  location: '',
  organizer: '',
  image: null,
  imagePreview: null
});

// Gestion des erreurs
const errors = ref({});
const isSubmitting = ref(false);
const showEmojiPicker = ref(false);

// Formater la date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Insérer un emoji dans l'éditeur
const insertEmoji = (emoji) => {
  const editor = window.tinymce?.editors[0];
  if (editor) {
    editor.insertContent(emoji + ' ');
  } else {
    // Fallback si l'éditeur n'est pas encore chargé
    form.value.contenu += emoji + ' ';
  }
  showEmojiPicker.value = false;
};

// Déclencher le sélecteur de fichier
const triggerFileInput = () => {
  fileInput.value.click();
};

// Gérer l'upload d'image
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Vérifier la taille du fichier (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Le fichier est trop volumineux. Taille maximale: 10MB');
      return;
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    form.value.image = file;
    
    // Créer un aperçu
    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Validation du formulaire
const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!form.value.titre.trim()) {
    errors.value.titre = 'Le titre est requis';
    isValid = false;
  }

  if (!form.value.date_debut) {
    errors.value.date_debut = 'La date de début est requise';
    isValid = false;
  }

  if (form.value.date_fin && form.value.date_fin < form.value.date_debut) {
    errors.value.date_fin = 'La date de fin doit être après la date de début';
    isValid = false;
  }

  if (!form.value.contenu.trim()) {
    errors.value.contenu = 'Le contenu est requis';
    isValid = false;
  }

  return isValid;
};

// Soumettre le formulaire
const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    // Préparer les données
    const eventData = {
      id: Date.now(), // ID temporaire
      titre: form.value.titre,
      date_debut: form.value.date_debut,
      date_fin: form.value.date_fin || form.value.date_debut,
      contenu: form.value.contenu,
      statut: form.value.statut,
      location: form.value.location,
      organizer: form.value.organizer,
      publicationDate: new Date().toISOString().split('T')[0],
      // Convertir les dates pour l'affichage
      dates: form.value.date_fin 
        ? `${formatDate(form.value.date_debut)} - ${formatDate(form.value.date_fin)}`
        : formatDate(form.value.date_debut)
    };

    // Dans un cas réel, on enverrait à l'API
    // const response = await fetch('/api/events', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(eventData)
    // });

    // Pour cette démo, on utilise localStorage
    const existingEvents = JSON.parse(localStorage.getItem('events') || '[]');
    existingEvents.unshift(eventData);
    localStorage.setItem('events', JSON.stringify(existingEvents));

    // Simuler un délai pour l'upload
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Notification de succès
    alert('Évènement publié avec succès !');
    
    // Rediriger vers la liste
    navigateTo('/admin/evenements');

  } catch (error) {
    console.error('Erreur:', error);
    alert('Une erreur est survenue lors de la publication.');
  } finally {
    isSubmitting.value = false;
  }
};

// Navigation
const goBack = () => {
  navigateTo('/admin/evenements');
};

// Initialiser la date d'aujourd'hui par défaut
onMounted(() => {
  const today = new Date();
  form.value.date_debut = today.toISOString().split('T')[0];
  
  // Ajouter un contenu par défaut
  form.value.contenu = '<p>⚡️ <strong>Upgrade</strong></p><p>Description détaillée de l\'évènement...</p>';
});
</script>

<style scoped>
/* Styles pour l'éditeur TinyMCE */
:deep(.tox-tinymce) {
  border-radius: 0.5rem !important;
  border: 1px solid #d1d5db !important;
}

:deep(.tox-tinymce:hover) {
  border-color: #9ca3af !important;
}

:deep(.tox-tinymce:focus-within) {
  border-color: #6366f1 !important;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
}

/* Style pour les erreurs */
.border-rose-500 {
  border-color: #f43f5e !important;
}

/* Style pour l'aperçu */
.prose :deep(h1) {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.prose :deep(h2) {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
}

.prose :deep(p) {
  margin-bottom: 1rem;
}

.prose :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.prose :deep(ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.prose :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.prose :deep(a) {
  color: #6366f1;
  text-decoration: underline;
}

.prose :deep(blockquote) {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  font-style: italic;
  margin: 1rem 0;
}

/* Animation pour le chargement */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>