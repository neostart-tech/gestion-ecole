<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <NuxtLink to="/opportunites/liste" class="cursor-pointer hover:text-indigo-600 transition-colors">
        Opportunités
      </NuxtLink>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Ajouter une opportunité</span>
    </div>

    <!-- Titre -->
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Ajouter une opportunité</h1>

    <!-- Formulaire simplifié -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <form @submit.prevent="saveOpportunity" class="space-y-6">
        <!-- Annonceur -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Annonceur <span class="text-rose-500">*</span>
          </label>
          <input
            v-model="form.annonceur"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="TechSol"
          />
        </div>

        <!-- Type d'opportunité -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Type d'opportunité <span class="text-rose-500">*</span>
          </label>
          <select
            v-model="form.typeOpportunite"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
          >
            <option value="Plein temps">Plein temps</option>
            <option value="Temps partiel">Temps partiel</option>
            <option value="Alternance">Alternance</option>
            <option value="Stage">Stage</option>
          </select>
        </div>

        <!-- Type de contrat -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Type de contrat <span class="text-rose-500">*</span>
          </label>
          <select
            v-model="form.typeContrat"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
          >
            <option value="Contrat à Durée Déterminée">Contrat à Durée Déterminée</option>
            <option value="Contrat à Durée Indéterminée">Contrat à Durée Indéterminée</option>
            <option value="Contrat d'Apprentissage">Contrat d'Apprentissage</option>
            <option value="Contrat de Stage">Contrat de Stage</option>
          </select>
        </div>

        <!-- Localisation -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Quartier, Ville, Pays
          </label>
          <input
            v-model="form.localisation"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Rue de l'Innovation, Paris, France"
          />
        </div>

        <!-- Durée -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Durée (6 mois / 90 jours)
          </label>
          <input
            v-model="form.duree"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="6 mois / 90 jours"
          />
        </div>

        <!-- Titre -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Titre <span class="text-rose-500">*</span>
          </label>
          <input
            v-model="form.titre"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Titre de l'opportunité"
          />
        </div>

        <!-- Document officiel -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Document officiel (en .PDF)
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
                : form.document 
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
            ]"
          >
            <!-- Document existant -->
            <div v-if="form.document" class="text-left">
              <div class="flex items-center gap-3 mb-3">
                <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                <div class="flex-1">
                  <h4 class="text-sm font-medium text-gray-900">{{ form.document.name }}</h4>
                  <p class="text-xs text-gray-500">{{ formatFileSize(form.document.size) }}</p>
                </div>
                <button 
                  type="button"
                  @click.stop="removeDocument"
                  class="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <button 
                type="button"
                @click.stop="triggerFileInput"
                class="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Changer de document
              </button>
            </div>
            
            <!-- Zone vide -->
            <div v-else>
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
                Format PDF uniquement (max 20MB)
              </p>
            </div>
          </div>
          
          <!-- Input fichier caché -->
          <input
            ref="fileInput"
            type="file"
            accept=".pdf"
            @change="handleFileUpload"
            class="hidden"
          />
          
          <!-- Message par défaut -->
          <p class="text-xs text-gray-500 mt-2">
            Aucun fichier n'a été sélectionné
          </p>
        </div>

        <!-- Contenu de l'annonce -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Contenu de l'annonce <span class="text-rose-500">*</span>
          </label>
          
          <!-- Éditeur TinyMCE -->
          <div class="border border-gray-300 rounded-lg overflow-hidden">
            <ClientOnly>
              <Editor
                v-model="form.contenu"
                :init="editorConfig"
                :key="editorKey"
              />
            </ClientOnly>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6">
          <NuxtLink
            to="/opportunites/liste"
            class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Annuler
          </NuxtLink>
          
          <button
            type="submit"
            class="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            Enregistrer
          </button>
        </div>
      </form>
    </div>

    <!-- Modal de succès -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="modal-content">
          <div class="modal-header border-b border-gray-200 p-6">
            <h5 class="modal-title text-lg font-semibold text-gray-900">
              Opportunité ajoutée
            </h5>
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
                Succès !
              </h3>
              <p class="text-gray-600 mb-6">
                L'opportunité a été ajoutée avec succès.
              </p>
            </div>
          </div>
          <div class="modal-footer border-t border-gray-200 p-6 flex justify-end gap-3">
            <button 
              type="button" 
              @click="closeSuccessModal"
              class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Ajouter une autre
            </button>
            <NuxtLink
              to="/opportunites/liste"
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
import { ref, nextTick } from 'vue';
import Editor from '@tinymce/tinymce-vue';

// Réinitialiser l'éditeur
const editorKey = ref(0);
const forceEditorRerender = () => {
  editorKey.value += 1;
};

// Configuration de TinyMCE
const editorConfig = {
  apiKey: 'zg2zugks07aopv32g7tny5709pnqww29mxbvn1oa8x7d78c7',
  height: 400,
  menubar: false,
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
  ],
  toolbar: 'undo redo | blocks | ' +
    'bold italic forecolor | alignleft aligncenter ' +
    'alignright alignjustify | bullist numlist outdent indent | ' +
    'removeformat | help | link image',
  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
  language: 'fr_FR',
  branding: false,
  statusbar: false
};

// Données réactives
const dragover = ref(false);
const fileInput = ref(null);
const showSuccessModal = ref(false);

// Formulaire simplifié
const form = ref({
  annonceur: '',
  typeOpportunite: 'Plein temps',
  typeContrat: 'Contrat à Durée Déterminée',
  localisation: '',
  duree: '',
  titre: '',
  document: null,
  contenu: ''
});

// Gestion de l'upload de document
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 20 * 1024 * 1024) {
      alert('Le fichier est trop volumineux. Maximum 20MB');
      return;
    }
    
    if (file.type !== 'application/pdf') {
      alert('Veuillez sélectionner un fichier PDF');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.document = {
        name: file.name,
        size: file.size,
        url: e.target.result,
        file: file
      };
    };
    reader.readAsDataURL(file);
  }
};

const handleDrop = (event) => {
  dragover.value = false;
  const file = event.dataTransfer.files[0];
  if (file && file.type === 'application/pdf') {
    if (file.size > 20 * 1024 * 1024) {
      alert('Le fichier est trop volumineux. Maximum 20MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.document = {
        name: file.name,
        size: file.size,
        url: e.target.result,
        file: file
      };
    };
    reader.readAsDataURL(file);
  }
};

const removeDocument = () => {
  if (form.value.document?.url) {
    URL.revokeObjectURL(form.value.document.url);
  }
  form.value.document = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Formater la taille du fichier
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Sauvegarder l'opportunité
const saveOpportunity = () => {
  // Validation
  if (!form.value.annonceur.trim()) {
    alert("L'annonceur est obligatoire");
    return;
  }
  
  if (!form.value.typeOpportunite) {
    alert('Le type d\'opportunité est obligatoire');
    return;
  }
  
  if (!form.value.typeContrat) {
    alert('Le type de contrat est obligatoire');
    return;
  }
  
  if (!form.value.titre.trim()) {
    alert('Le titre est obligatoire');
    return;
  }
  
  if (!form.value.contenu.trim()) {
    alert('Le contenu de l\'annonce est obligatoire');
    return;
  }
  
  // Charger les opportunités existantes
  let opportunities = [];
  if (process.client) {
    const stored = localStorage.getItem('opportunities');
    opportunities = stored ? JSON.parse(stored) : [];
  }
  
  // Créer la nouvelle opportunité
  const newOpportunity = {
    id: opportunities.length > 0 ? Math.max(...opportunities.map(o => o.id)) + 1 : 1,
    titre: form.value.titre,
    annonceur: form.value.annonceur,
    date: new Date().toISOString().split('T')[0],
    typeOpportunite: form.value.typeOpportunite,
    typeContrat: form.value.typeContrat,
    localisation: form.value.localisation,
    duree: form.value.duree,
    description: form.value.contenu.substring(0, 150) + '...',
    contenu: form.value.contenu,
    document: form.value.document,
    status: 'Non publiée'
  };
  
  // Ajouter à la liste
  opportunities.push(newOpportunity);
  
  // Sauvegarder dans localStorage
  if (process.client) {
    localStorage.setItem('opportunities', JSON.stringify(opportunities));
  }
  
  // Afficher le modal de succès
  showSuccessModal.value = true;
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
  // Réinitialiser le formulaire si l'utilisateur veut ajouter une autre opportunité
  form.value = {
    annonceur: '',
    typeOpportunite: 'Plein temps',
    typeContrat: 'Contrat à Durée Déterminée',
    localisation: '',
    duree: '',
    titre: '',
    document: null,
    contenu: ''
  };
  
  // Réinitialiser l'éditeur
  forceEditorRerender();
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

/* Animation pour le drag & drop */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.dragover-animation {
  animation: pulse 2s infinite;
}
</style>