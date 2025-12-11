<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
      <NuxtLink to="/" class="cursor-pointer hover:text-green-600 transition-colors">
        Accueil
      </NuxtLink>
      <span>/</span>
      <NuxtLink to="/" class="cursor-pointer hover:text-green-600 transition-colors">
        Utilisateurs
      </NuxtLink>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Ajouter un utilisateur</span>
    </div>

    <!-- En-tête avec bouton retour -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
          Ajouter un nouvel utilisateur
        </h1>
        <p class="text-gray-600">
          Remplissez le formulaire pour créer un nouvel utilisateur
        </p>
      </div>
      
      <NuxtLink
        to="/"
        class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Retour à la liste
      </NuxtLink>
    </div>

    <!-- Formulaire avec largeur augmentée -->
    <div class="mx-auto">
      <form @submit.prevent="submitUserForm" class="bg-white rounded-xl shadow-sm p-6 md:p-8">
        
        <!-- Upload de photo -->
        <div class="mb-10">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Photo de profil</h2>
          <div 
            @click="triggerFileInput"
            class="w-full min-h-56 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:border-green-400 hover:bg-green-50 cursor-pointer transition-all overflow-hidden relative group"
          >
            <!-- Aperçu de la photo -->
            <template v-if="newUser.photoUrl">
              <img 
                :src="newUser.photoUrl" 
                alt="Photo de profil" 
                class="w-full h-56 object-cover"
              />
              <div class="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                <svg class="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span class="text-sm font-medium">Remplacer la photo</span>
              </div>
            </template>

            <!-- Placeholder sans photo -->
            <template v-else>
              <div class="flex flex-col items-center justify-center p-10 text-center h-56">
                <svg class="w-16 h-16 text-gray-400 mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                <div class="mb-5">
                  <h3 class="text-xl font-semibold text-gray-900 mb-2">Ajouter une photo de profil</h3>
                  <p class="text-gray-500">Cliquez pour sélectionner une image</p>
                </div>
                <div class="text-sm text-gray-400 space-y-1">
                  <p>Formats supportés: JPG, PNG, GIF</p>
                  <p>Taille maximale: 2MB</p>
                </div>
              </div>
            </template>
          </div>
          <input
            type="file"
            ref="fileInput"
            @change="handleFileUpload"
            accept="image/*"
            class="hidden"
          />
          <p v-if="photoError" class="mt-2 text-sm text-red-600">{{ photoError }}</p>
        </div>

        <!-- Informations personnelles -->
        <div class="mb-10">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Informations personnelles</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Nom complet -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-3">
                Nom complet *
              </label>
              <input
                type="text"
                id="name"
                v-model="newUser.name"
                required
                placeholder="Ex: Akakpo"
                :class="[
                  'w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all',
                  formErrors.name ? 'border-red-300' : 'border-gray-300'
                ]"
              />
              <p v-if="formErrors.name" class="mt-2 text-sm text-red-600">{{ formErrors.name }}</p>
            </div>

            <!-- Pseudo -->
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-3">
                Pseudo *
              </label>
              <input
                type="text"
                id="username"
                v-model="newUser.username"
                required
                placeholder="Ex: Ali"
                :class="[
                  'w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all',
                  formErrors.username ? 'border-red-300' : 'border-gray-300'
                ]"
              />
              <p v-if="formErrors.username" class="mt-2 text-sm text-red-600">{{ formErrors.username }}</p>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-3">
                Email *
              </label>
              <input
                type="email"
                id="email"
                v-model="newUser.email"
                required
                placeholder="exemple@gmail.com"
                :class="[
                  'w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all',
                  formErrors.email ? 'border-red-300' : 'border-gray-300'
                ]"
              />
              <p v-if="formErrors.email" class="mt-2 text-sm text-red-600">{{ formErrors.email }}</p>
            </div>

            <!-- Téléphone -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-3">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                v-model="newUser.phone"
                placeholder="+228 00 00 00 00"
                class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <!-- Âge -->
            <div>
              <label for="age" class="block text-sm font-medium text-gray-700 mb-3">
                Âge
              </label>
              <input
                type="number"
                id="age"
                v-model="newUser.age"
                min="1"
                max="120"
                placeholder="25"
                class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <!-- Date d'inscription -->
            <div>
              <label for="date" class="block text-sm font-medium text-gray-700 mb-3">
                Date d'inscription
              </label>
              <input
                type="date"
                id="date"
                v-model="newUser.date"
                class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <!-- Statut avec Vue Multiselect -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Statut *
              </label>
              <Multiselect
                v-model="newUser.active"
                :options="statusOptions"
                :searchable="false"
                placeholder="Sélectionner un statut"
                class="multiselect-status"
                :class="{ 'border-red-300': formErrors.active }"
              />
              <p v-if="formErrors.active" class="mt-2 text-sm text-red-600">{{ formErrors.active }}</p>
            </div>

            <!-- Rôle utilisateur (optionnel) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Rôle
              </label>
              <Multiselect
                v-model="newUser.role"
                :options="roleOptions"
                :searchable="true"
                placeholder="Sélectionner un rôle"
                class="multiselect-role"
              />
            </div>
          </div>
        </div>

        <!-- Notes supplémentaires avec TinyMCE -->
        <div class="mb-10">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Notes supplémentaires</h2>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Description détaillée
            </label>
            <EditorTinyMCE
              v-model="newUser.notes"
              :disabled="isSubmitting"
            />
            <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div class="text-sm text-blue-700">
                  <p class="font-medium mb-1">🚀 Configuration requise pour TinyMCE</p>
                  <ol class="list-decimal pl-4 space-y-1">
                    <li>Ajoutez votre clé API dans le composant EditorTinyMCE</li>
                    <li>Configurez votre domaine dans le tableau de bord TinyMCE</li>
                    <li>Profitez de l'éditeur de texte riche avec toutes les fonctionnalités</li>
                  </ol>
                  <div class="mt-3">
                    <a href="https://www.tiny.cloud/docs/tinymce/6/react-cloud/#create-an-api-key" 
                       target="_blank" 
                       class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm">
                      Voir la documentation
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="flex justify-end gap-4 pt-8 border-t border-gray-200">
          <NuxtLink
            to="/"
            class="px-8 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-base"
          >
            Annuler
          </NuxtLink>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex items-center gap-2 px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-base"
          >
            <svg v-if="isSubmitting" class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            {{ isSubmitting ? 'Création en cours...' : 'Créer l\'utilisateur' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// Utilisation correcte du router dans Nuxt 3
const router = useRouter()
import Multiselect from '@vueform/multiselect'

// Vérifiez que ce composant existe bien à cet emplacement
import EditorTinyMCE from '~/components/EditorTinyMCE.vue'

// Import du CSS pour Multiselect
import '@vueform/multiselect/themes/default.css'

const fileInput = ref(null)
const isSubmitting = ref(false)

// Options pour le multiselect Statut
const statusOptions = [
  { value: true, label: 'Actif' },
  { value: false, label: 'Inactif' }
]

// Options pour le multiselect Rôle
const roleOptions = [
  'Administrateur',
  'Éditeur',
  'Utilisateur',
  'Modérateur',
  'Visiteur'
]

// Gestion des erreurs
const formErrors = ref({
  name: '',
  username: '',
  email: '',
  active: ''
})
const photoError = ref('')

// Données du nouvel utilisateur
const newUser = ref({
  name: "",
  username: "",
  email: "",
  phone: "",
  age: "",
  date: new Date().toISOString().split('T')[0],
  active: null, // Utilisera Multiselect
  role: null, // Nouveau champ rôle
  notes: "",
  photoUrl: ""
})

// Gestion de l'upload de photo
const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  photoError.value = '';
  
  if (file) {
    // Vérifier la taille (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      photoError.value = "Le fichier est trop volumineux. Taille maximale: 2MB";
      return;
    }

    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      photoError.value = "Veuillez sélectionner une image valide (JPG, PNG, GIF)";
      return;
    }

    // Créer une URL pour l'aperçu
    const reader = new FileReader();
    reader.onload = (e) => {
      newUser.value.photoUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Validation du formulaire
const validateForm = () => {
  let isValid = true;
  formErrors.value = {
    name: '',
    username: '',
    email: '',
    active: ''
  };

  if (!newUser.value.name?.trim()) {
    formErrors.value.name = "Le nom complet est obligatoire";
    isValid = false;
  }

  if (!newUser.value.username?.trim()) {
    formErrors.value.username = "Le pseudo est obligatoire";
    isValid = false;
  }

  if (!newUser.value.email?.trim()) {
    formErrors.value.email = "L'email est obligatoire";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.value.email)) {
    formErrors.value.email = "Veuillez entrer un email valide";
    isValid = false;
  }

  if (newUser.value.active === null || newUser.value.active === undefined) {
    formErrors.value.active = "Le statut est obligatoire";
    isValid = false;
  }

  return isValid;
};

// Soumettre le formulaire
const submitUserForm = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Récupérer les utilisateurs existants depuis le localStorage
    let users = [];
    if (process.client) {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        users = JSON.parse(storedUsers);
      }
    }

    // Générer un ID unique
    const newUserId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    const userToAdd = {
      id: newUserId,
      name: newUser.value.name,
      username: newUser.value.username,
      email: newUser.value.email,
      phone: newUser.value.phone || "Non spécifié",
      date: newUser.value.date,
      active: newUser.value.active,
      role: newUser.value.role || "Utilisateur",
      age: newUser.value.age ? parseInt(newUser.value.age) : 0,
      photoUrl: newUser.value.photoUrl,
      notes: newUser.value.notes
    };

    // Ajouter le nouvel utilisateur
    users.push(userToAdd);

    // Sauvegarder dans le localStorage
    if (process.client) {
      localStorage.setItem('users', JSON.stringify(users));
    }

    // Afficher un message de succès
    alert(`Utilisateur "${newUser.value.name}" ajouté avec succès!`);

    // Rediriger vers la liste des utilisateurs
    router.push('/');

  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    alert('Une erreur est survenue lors de la création de l\'utilisateur');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Styles spécifiques pour les composants */
</style>

<style>
/* Styles globaux pour Multiselect */
.multiselect-status .multiselect-options,
.multiselect-role .multiselect-options {
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.multiselect-status .multiselect-single,
.multiselect-role .multiselect-single {
  min-height: 48px;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  font-size: 1rem;
}

.multiselect-status .multiselect-single:focus,
.multiselect-role .multiselect-single:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.multiselect-status.border-red-300 .multiselect-single,
.multiselect-role.border-red-300 .multiselect-single {
  border-color: #fca5a5;
}

.multiselect-status .multiselect-option,
.multiselect-role .multiselect-option {
  padding: 0.75rem 1rem;
  font-size: 1rem;
}

.multiselect-status .multiselect-option.is-selected,
.multiselect-role .multiselect-option.is-selected {
  background-color: #f0fdf4;
  color: #065f46;
}

.multiselect-status .multiselect-option.is-selected.is-pointed,
.multiselect-role .multiselect-option.is-selected.is-pointed {
  background-color: #dcfce7;
}

.multiselect-status .multiselect-option.is-pointed,
.multiselect-role .multiselect-option.is-pointed {
  background-color: #f9fafb;
}

/* Styles pour rendre le formulaire plus large */
@media (min-width: 1024px) {
  .mx-auto {
    max-width: 90%;
  }
}

@media (min-width: 1280px) {
  .mx-auto {
    max-width: 1200px;
  }
}

/* Styles pour l'éditeur TinyMCE */
:deep(.tox-tinymce) {
  border-radius: 0.5rem !important;
  border: 1px solid #d1d5db !important;
}

:deep(.tox-tinymce:focus-within) {
  border-color: #10b981 !important;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
}
</style>