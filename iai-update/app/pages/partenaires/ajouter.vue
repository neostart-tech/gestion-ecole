<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <NuxtLink to="/admin/partenaires" class="cursor-pointer hover:text-indigo-600 transition-colors">
        Partenaires
      </NuxtLink>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Ajouter un partenaire</span>
    </div>

    <!-- Titre -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-900">Ajouter un partenaire</h1>
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
        

        <!-- Informations principales -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Nom -->
          <div>
            <label for="nom" class="block text-sm font-medium text-gray-700 mb-2">
              Nom <span class="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="nom"
              v-model="form.nom"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Nom du partenaire"
              :class="{ 'border-rose-500': errors.nom }"
            />
            <p v-if="errors.nom" class="mt-1 text-sm text-rose-600">{{ errors.nom }}</p>
          </div>

          <!-- Code partenaire -->
          
        </div>

        <!-- Contact -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email <span class="text-rose-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="contact@entreprise.com"
              :class="{ 'border-rose-500': errors.email }"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-rose-600">{{ errors.email }}</p>
          </div>

          <!-- Téléphone -->
          <div>
            <label for="telephone" class="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <input
                type="tel"
                id="telephone"
                v-model="form.telephone"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="+228 XX XX XX XX"
              />
            </div>
          </div>
        </div>

        <!-- Site web -->
        <div>
          <label for="siteWeb" class="block text-sm font-medium text-gray-700 mb-2">
            Site web
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
              </svg>
            </div>
            <input
              type="url"
              id="siteWeb"
              v-model="form.siteWeb"
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="https://www.entreprise.com"
            />
          </div>
          <p class="mt-1 text-xs text-gray-500">Inclure https:// ou http://</p>
        </div>

        <!-- Localisation -->
        <div>
          <label for="localisation" class="block text-sm font-medium text-gray-700 mb-2">
            Quartier, Ville, Pays <span class="text-rose-500">*</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <input
              type="text"
              id="localisation"
              v-model="form.localisation"
              required
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Ex: Tokoin, Lomé, Togo"
              :class="{ 'border-rose-500': errors.localisation }"
            />
          </div>
          <p v-if="errors.localisation" class="mt-1 text-sm text-rose-600">{{ errors.localisation }}</p>
        </div>

        <!-- Type et Statut -->
      

          <!-- Statut -->
          

        <!-- Biographie avec TinyMCE -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700">
              Biographie <span class="text-rose-500">*</span>
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
            <div class="grid grid-cols-8 gap-2">
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
          <div :class="{ 'border-rose-500 rounded-lg': errors.biographie }">
            <Editor
              v-model="form.biographie"
              :api-key="tinymceApiKey"
              :init="editorConfig"
              class="tinymce-editor"
            />
          </div>
          <p v-if="errors.biographie" class="mt-1 text-sm text-rose-600">{{ errors.biographie }}</p>
          <p class="mt-1 text-xs text-gray-500">Décrivez votre partenaire, ses activités, ses valeurs et sa mission.</p>
        </div>

        <!-- Informations complémentaires -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Informations complémentaires</h3>
          
          <!-- Domaines d'activité -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Domaines d'activité
            </label>
            <div class="space-y-3">
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="(domaine, index) in form.domaines" 
                  :key="index"
                  class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-indigo-100 text-indigo-800"
                >
                  {{ domaine }}
                  <button 
                    type="button"
                    @click="removeDomaine(index)"
                    class="text-indigo-600 hover:text-indigo-800"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </span>
              </div>
              <div class="flex gap-2">
                <input
                  type="text"
                  v-model="newDomaine"
                  @keyup.enter="addDomaine"
                  class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ajouter un domaine (appuyez sur Entrée)"
                />
                <button 
                  type="button"
                  @click="addDomaine"
                  class="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          <!-- Contact principal -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="contactPrincipal" class="block text-sm font-medium text-gray-700 mb-2">
                Contact principal
              </label>
              <input
                type="text"
                id="contactPrincipal"
                v-model="form.contactPrincipal"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Nom du contact"
              />
            </div>

            <div>
              <label for="posteContact" class="block text-sm font-medium text-gray-700 mb-2">
                Poste du contact
              </label>
              <input
                type="text"
                id="posteContact"
                v-model="form.posteContact"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Ex: Directeur des partenariats"
              />
            </div>
          </div>
        </div>

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
            type="button"
            @click="saveAsDraft"
            :disabled="isSubmitting"
            class="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enregistrer comme brouillon
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            {{ isSubmitting ? 'Publication en cours...' : 'Publier le partenaire' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Aperçu en temps réel -->
    <div v-if="form.nom" class="mt-8 bg-white rounded-xl shadow-sm p-4 md:p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Aperçu du partenaire</h3>
      <div class="border border-gray-200 rounded-lg p-6">
        <div class="flex items-start gap-4 mb-4">
          <div v-if="form.logoPreview" class="w-16 h-16">
            <img 
              :src="form.logoPreview" 
              :alt="form.nom"
              class="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div v-else class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <div>
            <h4 class="text-xl font-semibold text-gray-900">{{ form.nom }}</h4>
            <div class="flex items-center gap-3 mt-1">
              <span :class="`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeClass(form.type)}`">
                {{ getTypeText(form.type) || 'Type non défini' }}
              </span>
              <span :class="`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(form.statut)}`">
                {{ getStatusText(form.statut) }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="space-y-3 text-sm text-gray-600">
          <div v-if="form.email" class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <span>{{ form.email }}</span>
          </div>
          <div v-if="form.localisation" class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>{{ form.localisation }}</span>
          </div>
          <div v-if="form.siteWeb" class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
            </svg>
            <a :href="form.siteWeb" target="_blank" class="text-blue-600 hover:underline">{{ form.siteWeb }}</a>
          </div>
          <div v-if="form.telephone" class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            <span>{{ form.telephone }}</span>
          </div>
        </div>
        
        <div v-if="form.biographie" class="mt-4 pt-4 border-t border-gray-200">
          <div class="prose max-w-none" v-html="form.biographie"></div>
        </div>
        
        <div v-if="form.domaines.length > 0" class="mt-4 pt-4 border-t border-gray-200">
          <h5 class="text-sm font-medium text-gray-700 mb-2">Domaines d'activité</h5>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="domaine in form.domaines" 
              :key="domaine"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
            >
              {{ domaine }}
            </span>
          </div>
        </div>

        <div v-if="form.contactPrincipal" class="mt-4 pt-4 border-t border-gray-200">
          <h5 class="text-sm font-medium text-gray-700 mb-2">Contact principal</h5>
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <div>
              <p class="text-gray-900">{{ form.contactPrincipal }}</p>
              <p v-if="form.posteContact" class="text-sm text-gray-500">{{ form.posteContact }}</p>
            </div>
          </div>
        </div>
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
  images_upload_url: '/api/upload',
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
  '⚡️', '🔥', '🎉', '🚀', '✨', '🌟', '💡', '🎯', '📢', '🏢',
  '👥', '🤝', '💼', '💻', '🌐', '📈', '🎓', '🔧', '🔄', '💬',
  '🏆', '🌍', '⭐', '📱', '💎', '🎨', '📊', '🔗', '🎪', '🏛️'
];

// Référence au champ fichier
const logoInput = ref(null);

// État du formulaire
const form = ref({
  // Informations principales
  nom: '',
  code: '',
  type: '',
  statut: 'actif',
  
  // Contact
  email: '',
  telephone: '',
  siteWeb: '',
  localisation: '',
  
  // Biographie
  biographie: '',
  
  // Logo
  logo: null,
  logoPreview: null,
  
  // Informations complémentaires
  contactPrincipal: '',
  posteContact: '',
  domaines: []
});

// Gestion des erreurs
const errors = ref({});
const isSubmitting = ref(false);
const showEmojiPicker = ref(false);
const newDomaine = ref('');

// Classes CSS pour les types
const getTypeClass = (type) => {
  switch (type) {
    case 'entreprise': return 'bg-blue-100 text-blue-800';
    case 'academique': return 'bg-purple-100 text-purple-800';
    case 'gouvernement': return 'bg-green-100 text-green-800';
    case 'ong': return 'bg-orange-100 text-orange-800';
    case 'association': return 'bg-pink-100 text-pink-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Texte pour les types
const getTypeText = (type) => {
  switch (type) {
    case 'entreprise': return 'Entreprise';
    case 'academique': return 'Académique';
    case 'gouvernement': return 'Gouvernement';
    case 'ong': return 'ONG';
    case 'association': return 'Association';
    default: return '';
  }
};

// Classes CSS pour les statuts
const getStatusClass = (statut) => {
  switch (statut) {
    case 'actif': return 'bg-green-100 text-green-800';
    case 'inactif': return 'bg-gray-100 text-gray-800';
    case 'suspendu': return 'bg-yellow-100 text-yellow-800';
    case 'en_attente': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Texte pour les statuts
const getStatusText = (statut) => {
  switch (statut) {
    case 'actif': return 'Actif';
    case 'inactif': return 'Inactif';
    case 'suspendu': return 'Suspendu';
    case 'en_attente': return 'En attente';
    default: return '';
  }
};

// Insérer un emoji dans l'éditeur
const insertEmoji = (emoji) => {
  const editor = window.tinymce?.editors[0];
  if (editor) {
    editor.insertContent(emoji + ' ');
  } else {
    // Fallback si l'éditeur n'est pas encore chargé
    form.value.biographie += emoji + ' ';
  }
  showEmojiPicker.value = false;
};

// Déclencher le sélecteur de fichier
const triggerLogoUpload = () => {
  logoInput.value.click();
};

// Gérer l'upload d'image
const handleLogoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Vérifier la taille du fichier (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Le fichier est trop volumineux. Taille maximale: 2MB');
      return;
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp'];
    if (!file.type.startsWith('image/') || !allowedTypes.includes(file.type)) {
      alert('Veuillez sélectionner une image valide (JPG, PNG, SVG, GIF, WEBP)');
      return;
    }

    form.value.logo = file;
    
    // Créer un aperçu
    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.logoPreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Supprimer le logo
const removeLogo = () => {
  form.value.logo = null;
  form.value.logoPreview = null;
  if (logoInput.value) {
    logoInput.value.value = '';
  }
};

// Gestion des domaines
const addDomaine = () => {
  if (newDomaine.value.trim() && !form.value.domaines.includes(newDomaine.value.trim())) {
    form.value.domaines.push(newDomaine.value.trim());
    newDomaine.value = '';
  }
};

const removeDomaine = (index) => {
  form.value.domaines.splice(index, 1);
};

// Validation du formulaire
const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!form.value.nom.trim()) {
    errors.value.nom = 'Le nom est requis';
    isValid = false;
  }

  if (!form.value.email.trim()) {
    errors.value.email = 'L\'email est requis';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Format d\'email invalide';
    isValid = false;
  }

  if (!form.value.localisation.trim()) {
    errors.value.localisation = 'La localisation est requise';
    isValid = false;
  }

  if (!form.value.type) {
    errors.value.type = 'Le type est requis';
    isValid = false;
  }

  if (!form.value.statut) {
    errors.value.statut = 'Le statut est requis';
    isValid = false;
  }

  if (!form.value.biographie.trim()) {
    errors.value.biographie = 'La biographie est requise';
    isValid = false;
  }

  // Validation du site web si rempli
  if (form.value.siteWeb && !/^https?:\/\/.+\..+/.test(form.value.siteWeb)) {
    errors.value.siteWeb = 'Format d\'URL invalide. Inclure http:// ou https://';
    isValid = false;
  }

  return isValid;
};

// Générer un code partenaire automatique
const generatePartnerCode = () => {
  if (form.value.code) return form.value.code;
  
  // Générer à partir du nom
  const nom = form.value.nom.toUpperCase().replace(/[^A-Z]/g, '');
  const prefix = nom.substring(0, 3) || 'PTN';
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${random}`;
};

// Sauvegarder comme brouillon
const saveAsDraft = async () => {
  form.value.statut = 'inactif';
  await submitForm('brouillon');
};

// Soumettre le formulaire
const submitForm = async (mode = 'publier') => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    // Générer le code partenaire si vide
    const code = generatePartnerCode();
    
    // Préparer les données
    const partnerData = {
      id: Date.now(), // ID temporaire
      nom: form.value.nom,
      code: code,
      email: form.value.email,
      siteWeb: form.value.siteWeb || '',
      telephone: form.value.telephone || '',
      type: form.value.type,
      statut: mode === 'publier' ? 'actif' : 'inactif',
      description: form.value.biographie,
      pays: form.value.localisation,
      logo: form.value.logoPreview || '',
      dateCreation: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      contactPrincipal: form.value.contactPrincipal || '',
      posteContact: form.value.posteContact || '',
      domaines: form.value.domaines,
      // Séparer localisation en quartier, ville, pays si possible
      localisation: form.value.localisation
    };

    // Dans un cas réel, on enverrait à l'API
    // const response = await fetch('/api/partners', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(partnerData)
    // });

    // Pour cette démo, on utilise localStorage
    const existingPartners = JSON.parse(localStorage.getItem('partners') || '[]');
    existingPartners.unshift(partnerData);
    localStorage.setItem('partners', JSON.stringify(existingPartners));

    // Simuler un délai pour l'upload
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Notification de succès
    alert(mode === 'publier' 
      ? 'Partenaire publié avec succès !' 
      : 'Partenaire enregistré comme brouillon !');
    
    // Rediriger vers la liste
    navigateTo('/admin/partenaires');

  } catch (error) {
    console.error('Erreur:', error);
    alert('Une erreur est survenue lors de la sauvegarde.');
  } finally {
    isSubmitting.value = false;
  }
};

// Navigation
const goBack = () => {
  navigateTo('/admin/partenaires');
};

// Initialiser le formulaire avec du contenu par défaut
onMounted(() => {
  // Contenu par défaut pour la biographie
  form.value.biographie = '<p>⚡️ <strong>Upgrade</strong></p><p>Description du partenaire...</p>';
  
  // Initialiser quelques domaines par défaut
  form.value.domaines = ['Technologie', 'Innovation'];
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

.prose :deep(h3) {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.prose :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
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

/* Styles pour les badges */
.badge-entreprise {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-academique {
  background-color: #f3e8ff;
  color: #6b21a8;
}

.badge-gouvernement {
  background-color: #dcfce7;
  color: #166534;
}

.badge-ong {
  background-color: #ffedd5;
  color: #9a3412;
}

.badge-association {
  background-color: #fce7f3;
  color: #9d174d;
}
</style>