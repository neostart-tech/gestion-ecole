<template>
  <div class="space-y-4">
    <!-- Zone de dépôt / upload -->
    <div
      class="upload-zone"
      :class="{
        'drag-active': isDragging,
        'border-amber-500 bg-amber-50': hasFile || hasExistingFile
      }"
      @click="triggerFileInput"
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <div class="upload-content">
        <template v-if="isLoading">
          <div class="flex flex-col items-center">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
            <p class="mt-2 text-sm text-gray-600">Chargement en cours...</p>
          </div>
        </template>

        <template v-else-if="previewUrl || hasExistingFile">
          <img
            :src="previewUrl || existingFileUrl"
            :alt="label"
            class="max-h-40 mx-auto object-contain rounded-lg"
          />
          <p class="mt-2 text-sm text-gray-600">{{ fileName || 'Image sélectionnée' }}</p>
        </template>

        <template v-else>
          <svg class="w-16 h-16 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="mb-1 font-semibold">{{ label }}</p>
          <p class="text-sm text-gray-500">Cliquez ou glissez une image</p>
          <p class="text-xs text-gray-400 mt-1">PNG, JPG, GIF, SVG (max 2MB)</p>
        </template>
      </div>

      <!-- Input file caché -->
      <input
        ref="fileInput"
        type="file"
        :accept="acceptedTypes"
        class="hidden"
        @change="onFileChange"
      />
    </div>

    <!-- Barre d'actions -->
    <div v-if="hasFile || hasExistingFile" class="flex justify-center space-x-2">
      <button
        v-if="hasFile"
        type="button"
        class="btn-action btn-success"
        @click="confirmFile"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Conserver
      </button>

      <button
        type="button"
        class="btn-action btn-danger"
        @click="removeFile"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        {{ hasExistingFile ? 'Supprimer' : 'Annuler' }}
      </button>
    </div>

    <!-- Message d'erreur -->
    <div v-if="error" class="text-sm text-red-600 text-center">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';


const props = defineProps({
  modelValue: {
    type: [File, String, null],
    default: null
  },
  label: {
    type: String,
    required: true
  },
  existingFile: {
    type: String,
    default: null
  },
  acceptedTypes: {
    type: String,
    default: 'image/*'
  },
  maxSize: {
    type: Number,
    default: 2 * 1024 * 1024 // 2MB
  }
});

const emit = defineEmits(['update:modelValue', 'delete', 'error']);

// État local
const fileInput = ref(null);
const isDragging = ref(false);
const isLoading = ref(false);
const error = ref('');
const localFile = ref(null);
const previewUrl = ref(null);

// Computed
const hasFile = computed(() => !!localFile.value);
const hasExistingFile = computed(() => !!props.existingFile);
const fileName = computed(() => localFile.value?.name);

const existingFileUrl = computed(() => {
  if (!props.existingFile) return null;
  // Adapter selon votre configuration
  const existingFileUrl = computed(() => {
  if (!props.existingFile) return null;
  return $fileUrl(props.existingFile);
});

});

// Méthodes
const triggerFileInput = () => {
  fileInput.value?.click();
};

const onDragEnter = (e) => {
  e.preventDefault();
  isDragging.value = true;
};

const onDragOver = (e) => {
  e.preventDefault();
  isDragging.value = true;
};

const onDragLeave = (e) => {
  e.preventDefault();
  isDragging.value = false;
};

const onDrop = (e) => {
  e.preventDefault();
  isDragging.value = false;
  
  const file = e.dataTransfer.files[0];
  if (file) {
    validateAndSetFile(file);
  }
};

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    validateAndSetFile(file);
  }
};

const validateAndSetFile = (file) => {
  // Réinitialiser les erreurs
  error.value = '';

  // Valider le type
  if (!file.type.startsWith('image/')) {
    error.value = 'Le fichier doit être une image';
    emit('error', error.value);
    return;
  }

  // Valider la taille
  if (file.size > props.maxSize) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    error.value = `L'image est trop volumineuse (${sizeMB}MB). Maximum 2MB.`;
    emit('error', error.value);
    return;
  }

  // Valider les extensions spécifiques si nécessaire
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
  const extension = file.name.split('.').pop().toLowerCase();
  if (!validExtensions.includes(extension)) {
    error.value = 'Format non supporté. Utilisez JPG, PNG, GIF ou SVG.';
    emit('error', error.value);
    return;
  }

  // Tout est bon, on garde le fichier
  localFile.value = file;
  
  // Créer la prévisualisation
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
  previewUrl.value = URL.createObjectURL(file);
  
  // Émettre la valeur
  emit('update:modelValue', file);
};

const confirmFile = () => {
  // Le fichier est déjà validé, on peut fermer la prévisualisation
  // Mais on garde le fichier sélectionné
};

const removeFile = () => {
  // Nettoyer la prévisualisation
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }
  
  // Réinitialiser l'input
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  
  // Réinitialiser l'état
  localFile.value = null;
  
  // Émettre la suppression
  emit('update:modelValue', null);
  if (props.existingFile) {
    emit('delete', true);
  }
  
  error.value = '';
};

// Nettoyage
watch(previewUrl, (newUrl, oldUrl) => {
  if (oldUrl && oldUrl.startsWith('blob:')) {
    URL.revokeObjectURL(oldUrl);
  }
});
</script>

<style scoped>
.upload-zone {
  border: 2px dashed #e5e7eb;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f9fafb;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-zone:hover {
  border-color: #f59e0b;
  background: #fffbeb;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.1);
}

.upload-zone.drag-active {
  background: #fef3c7;
  border-color: #d97706;
  border-style: solid;
}

.upload-content {
  color: #6b7280;
  transition: color 0.3s ease;
}

.upload-zone:hover .upload-content {
  color: #f59e0b;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}
</style>