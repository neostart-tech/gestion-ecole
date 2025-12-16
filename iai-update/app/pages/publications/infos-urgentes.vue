<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <NuxtLink to="/publications/liste" class="cursor-pointer hover:text-indigo-600 transition-colors">
        Publications
      </NuxtLink>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Informations urgentes</span>
    </div>

    <!-- Titre et bouton -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-900">Informations urgentes</h1>
      
      <button 
        @click="openAddModal"
        class="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Ajouter une info urgente
      </button>
    </div>

    <!-- Tableau des informations urgentes -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <!-- En-tête du tableau -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Titre
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Publié
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Document
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <!-- Message vide -->
            <tr v-if="urgentInfos.length === 0">
              <td colspan="4" class="px-6 py-12 text-center">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune information urgente pour le moment</h3>
                <p class="text-gray-500 mb-6">Commencez par ajouter votre première information urgente</p>
                <button 
                  @click="openAddModal"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  Ajouter une info urgente
                </button>
              </td>
            </tr>

            <!-- Liste des informations urgentes -->
            <tr 
              v-for="info in urgentInfos" 
              :key="info.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- Titre -->
              <td class="px-6 py-4">
                <div class="flex items-start gap-3">
                  <!-- Badge urgent -->
                  <span class="inline-flex items-center px-2 py-1 bg-rose-100 text-rose-800 text-xs font-semibold rounded">
                    URGENT
                  </span>
                  
                  <div>
                    <h4 class="text-sm font-medium text-gray-900 mb-1">
                      {{ info.title }}
                    </h4>
                    <p v-if="info.description" class="text-sm text-gray-500 line-clamp-2">
                      {{ info.description }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Date de publication -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ formatDate(info.publishedAt) }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ formatTime(info.publishedAt) }}
                </div>
              </td>

              <!-- Document -->
              <td class="px-6 py-4">
                <div v-if="info.document" class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <div>
                    <span class="text-sm text-gray-900 block">{{ info.document.name }}</span>
                    <span class="text-xs text-gray-500">{{ formatFileSize(info.document.size) }}</span>
                  </div>
                  <a 
                    :href="info.document.url" 
                    target="_blank"
                    class="ml-2 p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded"
                    title="Télécharger"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                  </a>
                </div>
                <span v-else class="text-sm text-gray-400 italic">Aucun document</span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <!-- Modifier -->
                  <button 
                    @click="openEditModal(info)"
                    class="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                    title="Modifier"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>

                  <!-- Télécharger -->
                  <a 
                    v-if="info.document"
                    :href="info.document.url" 
                    download
                    class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Télécharger"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                  </a>

                  <!-- Supprimer -->
                  <button 
                    @click="openDeleteModal(info)"
                    class="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    title="Supprimer"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal d'ajout/modification -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
        <form @submit.prevent="saveUrgentInfo" class="modal-content">
          <div class="modal-header border-b border-gray-200 p-6">
            <h5 class="modal-title text-lg font-semibold text-gray-900">
              {{ modalTitle }}
            </h5>
            <button type="button" @click="closeModal" class="btn-close text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <div class="modal-body p-6 space-y-6">
            <!-- Titre -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Titre <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Titre de l'information urgente"
              />
            </div>

            <!-- Description -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Description détaillée de l'information urgente"
              ></textarea>
            </div>

            <!-- Date de publication -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Date de publication <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.publishedAt"
                type="datetime-local"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <!-- Document -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Document
                <span class="text-xs text-gray-500 ml-1">(optionnel)</span>
              </label>
              
              <!-- Zone de téléchargement -->
              <div 
                @click="triggerFileInput"
                @dragover.prevent="dragover = true"
                @dragleave="dragover = false"
                @drop.prevent="handleDrop"
                :class="[
                  'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all',
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
                    <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
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
                    PDF, DOC, DOCX jusqu'à 20MB
                  </p>
                </div>
              </div>
              
              <!-- Input fichier caché -->
              <input
                ref="fileInput"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                @change="handleFileUpload"
                class="hidden"
              />
              
              <!-- Aide -->
              <p class="text-xs text-gray-500">
                Formats acceptés : PDF, DOC, DOCX, TXT (max 20MB)
              </p>
            </div>

            <!-- Lien externe -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Lien externe
                <span class="text-xs text-gray-500 ml-1">(optionnel)</span>
              </label>
              <input
                v-model="form.externalLink"
                type="url"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="https://example.com"
              />
            </div>

            <!-- Priorité -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Priorité
              </label>
              <select
                v-model="form.priority"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              >
                <option value="high">Élevée</option>
                <option value="medium">Moyenne</option>
                <option value="low">Basse</option>
              </select>
            </div>

            <!-- Notification -->
            <div class="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div class="space-y-1">
                <label class="block text-sm font-medium text-amber-800">
                  Envoyer une notification
                </label>
                <p class="text-sm text-amber-700">
                  Les utilisateurs recevront une alerte pour cette information urgente
                </p>
              </div>
              <div class="flex items-center">
                <button
                  type="button"
                  @click="form.sendNotification = !form.sendNotification"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    form.sendNotification ? 'bg-amber-600' : 'bg-gray-300'
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      form.sendNotification ? 'translate-x-6' : 'translate-x-1'
                    ]"
                  />
                </button>
              </div>
            </div>
          </div>
          
          <div class="modal-footer border-t border-gray-200 p-6 flex justify-end gap-3">
            <button 
              type="button" 
              @click="closeModal"
              class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              class="btn btn-primary px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
            >
              {{ form.id ? 'Mettre à jour' : 'Publier' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="modal-content">
          <div class="modal-header border-b border-gray-200 p-6">
            <h5 class="modal-title text-lg font-semibold text-gray-900">Supprimer l'information urgente</h5>
            <button type="button" @click="closeDeleteModal" class="btn-close text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body p-6">
            <div class="text-center">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-100 mb-4">
                <svg class="h-6 w-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.698-.833-2.464 0L4.288 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                Confirmer la suppression
              </h3>
              <p class="text-gray-600 mb-6">
                Voulez-vous vraiment supprimer "{{ infoToDelete?.title }}" ? Cette action est irréversible.
              </p>
            </div>
          </div>
          <div class="modal-footer border-t border-gray-200 p-6 flex justify-end gap-3">
            <button 
              type="button" 
              @click="closeDeleteModal"
              class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button 
              type="button" 
              @click="confirmDelete"
              class="btn btn-warning px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
            >
              Supprimer définitivement
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Données réactives
const showModal = ref(false);
const showDeleteModal = ref(false);
const modalTitle = ref('');
const dragover = ref(false);
const fileInput = ref(null);
const infoToDelete = ref(null);

// Données initiales
const initialUrgentInfos = [
  {
    id: 1,
    title: "Maintenance système ce week-end",
    description: "Une maintenance système est prévue du 15 au 16 juillet. Le service sera interrompu.",
    publishedAt: "2024-07-14T18:30:00",
    document: {
      name: "plan-maintenance.pdf",
      size: 2457600,
      url: "#"
    },
    externalLink: "",
    priority: "high",
    sendNotification: true
  },
  {
    id: 2,
    title: "Changement d'horaire d'été",
    description: "Nouveaux horaires à partir du 1er juillet pour tous les départements.",
    publishedAt: "2024-06-28T09:00:00",
    document: null,
    externalLink: "https://intranet.example.com/horaires",
    priority: "medium",
    sendNotification: true
  }
];

const urgentInfos = ref([]);

// Formulaire
const form = ref({
  id: null,
  title: '',
  description: '',
  publishedAt: '',
  document: null,
  externalLink: '',
  priority: 'high',
  sendNotification: true
});

// Charger les données
onMounted(() => {
  loadUrgentInfos();
});

const loadUrgentInfos = () => {
  if (process.client) {
    const stored = localStorage.getItem('urgentInfos');
    if (stored) {
      urgentInfos.value = JSON.parse(stored);
    } else {
      urgentInfos.value = initialUrgentInfos;
      localStorage.setItem('urgentInfos', JSON.stringify(initialUrgentInfos));
    }
  }
};

// Formater la date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Formater la taille du fichier
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Gestion des fichiers
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
    
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      alert('Format de fichier non supporté. Utilisez PDF, DOC, DOCX ou TXT');
      return;
    }
    
    const fileUrl = URL.createObjectURL(file);
    form.value.document = {
      name: file.name,
      size: file.size,
      url: fileUrl,
      file: file
    };
  }
};

const handleDrop = (event) => {
  dragover.value = false;
  const file = event.dataTransfer.files[0];
  if (file) {
    handleFileUpload({ target: { files: [file] } });
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

// Modals
const openAddModal = () => {
  modalTitle.value = "Ajouter une information urgente";
  form.value = {
    id: null,
    title: '',
    description: '',
    publishedAt: new Date().toISOString().slice(0, 16),
    document: null,
    externalLink: '',
    priority: 'high',
    sendNotification: true
  };
  showModal.value = true;
};

const openEditModal = (info) => {
  modalTitle.value = "Modifier l'information urgente";
  form.value = {
    id: info.id,
    title: info.title,
    description: info.description,
    publishedAt: new Date(info.publishedAt).toISOString().slice(0, 16),
    document: info.document,
    externalLink: info.externalLink || '',
    priority: info.priority || 'high',
    sendNotification: info.sendNotification || false
  };
  showModal.value = true;
};

const openDeleteModal = (info) => {
  infoToDelete.value = info;
  showDeleteModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  if (form.value.document?.url && !form.value.id) {
    URL.revokeObjectURL(form.value.document.url);
  }
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  infoToDelete.value = null;
};

// Sauvegarder
const saveUrgentInfo = () => {
  if (!form.value.title.trim()) {
    alert('Le titre est obligatoire');
    return;
  }
  
  if (!form.value.publishedAt) {
    alert('La date de publication est obligatoire');
    return;
  }
  
  if (form.value.id) {
    // Mise à jour
    const index = urgentInfos.value.findIndex(info => info.id === form.value.id);
    if (index !== -1) {
      urgentInfos.value[index] = {
        ...urgentInfos.value[index],
        title: form.value.title,
        description: form.value.description,
        publishedAt: form.value.publishedAt,
        document: form.value.document,
        externalLink: form.value.externalLink,
        priority: form.value.priority,
        sendNotification: form.value.sendNotification
      };
    }
  } else {
    // Création
    const newId = urgentInfos.value.length > 0 
      ? Math.max(...urgentInfos.value.map(info => info.id)) + 1 
      : 1;
    
    const newInfo = {
      id: newId,
      title: form.value.title,
      description: form.value.description,
      publishedAt: form.value.publishedAt,
      document: form.value.document,
      externalLink: form.value.externalLink,
      priority: form.value.priority,
      sendNotification: form.value.sendNotification
    };
    
    urgentInfos.value.push(newInfo);
  }
  
  // Sauvegarder
  if (process.client) {
    localStorage.setItem('urgentInfos', JSON.stringify(urgentInfos.value));
  }
  
  // Fermer le modal
  closeModal();
  
  // Afficher notification
  alert(form.value.id ? 'Information mise à jour avec succès' : 'Information publiée avec succès');
};

// Supprimer
const confirmDelete = () => {
  if (infoToDelete.value) {
    const index = urgentInfos.value.findIndex(info => info.id === infoToDelete.value.id);
    if (index !== -1) {
      // Libérer l'URL du document si existe
      if (urgentInfos.value[index].document?.url) {
        URL.revokeObjectURL(urgentInfos.value[index].document.url);
      }
      
      urgentInfos.value.splice(index, 1);
      
      // Sauvegarder
      if (process.client) {
        localStorage.setItem('urgentInfos', JSON.stringify(urgentInfos.value));
      }
    }
    closeDeleteModal();
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Styles pour le tableau */
table {
  min-width: 100%;
}

th {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td, th {
  padding: 1rem 1.5rem;
  text-align: left;
}

tbody tr {
  border-bottom: 1px solid #e5e7eb;
}

tbody tr:last-child {
  border-bottom: none;
}

/* Animation pour le drag & drop */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.dragover-animation {
  animation: pulse 2s infinite;
}

/* Styles pour les boutons d'action */
button {
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
}
</style>