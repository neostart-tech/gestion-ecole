<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {{ label }}
    </label>
    
    <!-- Zone de drag & drop -->
    <div
      @click="triggerFileInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="[
        'relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer',
        isDragging 
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
          : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500',
        error ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''
      ]"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        class="hidden"
        @change="handleFileSelect"
      />

      <!-- Aperçu de l'image -->
      <div v-if="previewUrl" class="relative">
        <img
          :src="previewUrl"
          :alt="alt || 'Aperçu'"
          class="max-h-48 mx-auto rounded-lg object-cover"
        />
        <div class="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            type="button"
            @click.stop="triggerFileInput"
            class="p-2 bg-white rounded-full text-gray-700 hover:text-indigo-600"
            title="Changer l'image"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            type="button"
            @click.stop="removeImage"
            class="p-2 bg-white rounded-full text-gray-700 hover:text-red-600"
            title="Supprimer l'image"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- État vide (pas d'image) -->
      <div v-else class="text-center">
        <svg
          class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div class="mt-4 flex text-sm text-gray-600 dark:text-gray-400">
          <span class="relative rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none">
            <span>Cliquez pour uploader</span>
          </span>
          <p class="pl-1">ou glissez-déposez</p>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          PNG, JPG, GIF jusqu'à 2MB
        </p>
      </div>
    </div>

    <!-- Message d'erreur -->
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>

    <!-- Nom du fichier sélectionné -->
    <p v-if="fileName && !previewUrl" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      Fichier sélectionné : {{ fileName }}
    </p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: [File, String, null],
    default: null
  },
  label: {
    type: String,
    default: ''
  },
  accept: {
    type: String,
    default: 'image/*'
  },
  error: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  maxSize: {
    type: Number,
    default: 2 // MB
  }
});

const emit = defineEmits(['update:modelValue', 'error']);

const fileInput = ref(null);
const isDragging = ref(false);
const previewUrl = ref(null);
const fileName = ref('');

// Initialiser l'aperçu si une URL est fournie
watch(() => props.modelValue, (newValue) => {
  if (typeof newValue === 'string' && newValue) {
    previewUrl.value = newValue;
    fileName.value = newValue.split('/').pop();
  } else if (newValue instanceof File) {
    createPreview(newValue);
  } else {
    previewUrl.value = null;
    fileName.value = '';
  }
}, { immediate: true });

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    validateAndSetFile(file);
  }
};

const handleDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file) {
    validateAndSetFile(file);
  }
};

const validateAndSetFile = (file) => {
  // Validation du type
  if (!file.type.startsWith('image/')) {
    emit('error', 'Le fichier doit être une image');
    return;
  }

  // Validation de la taille
  const maxSizeBytes = props.maxSize * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    emit('error', `L'image ne doit pas dépasser ${props.maxSize}MB`);
    return;
  }

  emit('error', '');
  createPreview(file);
  emit('update:modelValue', file);
};

const createPreview = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target.result;
    fileName.value = file.name;
  };
  reader.readAsDataURL(file);
};

const removeImage = () => {
  previewUrl.value = null;
  fileName.value = '';
  fileInput.value.value = '';
  emit('update:modelValue', null);
  emit('error', '');
};
</script>