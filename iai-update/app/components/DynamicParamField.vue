<!-- components/DynamicParamField.vue -->
<script setup>
import { computed } from 'vue';
import appConfig from '~~/config';

const props = defineProps({
  param: {
    type: Object,
    required: true
  },
  modelValue: {
    type: [String, Number, Boolean, File, null],
    default: null
  },
  fieldClass: {
    type: String,
    default: ''
  },
  errors: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue', 'delete']);

// États locaux
const previewUrl = ref(null);
const previewType = ref(null);
const showComparison = ref(false);

// Vérification du type File
const isFile = (value) => {
  return value && typeof value === 'object' && value instanceof File;
};

// URL de base du storage
const storageBaseUrl = computed(() => {
  return appConfig.app_local 
    ? appConfig.app_dev_storage_url 
    : appConfig.app_prod_storage_url;
});

// URL complète du fichier existant
const existingFileUrl = computed(() => {
  if (props.param.type === 'file' && props.param.value) {
    const path = props.param.value;
    let cleanPath = path.replace(/^\/+/, '');
    
    if (cleanPath.startsWith('http')) return cleanPath;
    if (cleanPath.startsWith('storage/')) {
      return `${storageBaseUrl.value}/${cleanPath}`;
    }
    return `${storageBaseUrl.value}/storage/${cleanPath}`;
  }
  return null;
});

// Formater le label
const formatLabel = (key) => {
  return key.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Options du select
const selectOptions = computed(() => {
  if (!props.param.options) return [];
  
  return props.param.options.split(',').map(option => {
    const [value, label] = option.split('|');
    return {
      value: value.trim(),
      label: label ? label.trim() : value.trim()
    };
  }).filter(opt => opt.value);
});

// Description
const description = computed(() => {
  if (!props.param.options) return '';
  const parts = props.param.options.split(',');
  const descPart = parts.find(p => p.includes('description'));
  if (descPart) {
    return descPart.split('|')[1] || '';
  }
  return '';
});

// Nom du fichier
const fileName = computed(() => {
  if (isFile(props.modelValue)) {
    return props.modelValue.name;
  }
  if (props.param.value && !props.modelValue) {
    const path = props.param.value;
    const parts = path.split('/');
    return parts[parts.length - 1];
  }
  return null;
});

// Nom du fichier existant
const existingFileName = computed(() => {
  if (props.param.value) {
    const path = props.param.value;
    const parts = path.split('/');
    return parts[parts.length - 1];
  }
  return null;
});

// Type de fichier
const fileType = computed(() => {
  const name = fileName.value;
  if (!name) return 'unknown';
  
  const ext = name.split('.').pop().toLowerCase();
  const types = {
    'pdf': 'pdf',
    'doc': 'word',
    'docx': 'word',
    'xls': 'excel',
    'xlsx': 'excel',
    'jpg': 'image',
    'jpeg': 'image',
    'png': 'image',
    'gif': 'image',
    'svg': 'image',
    'webp': 'image',
    'mp4': 'video',
    'mp3': 'audio'
  };
  
  return types[ext] || 'document';
});

// Vérifier si c'est une image
const isImageFile = (filePath) => {
  if (!filePath) return false;
  return filePath.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
};

// Icône selon le type de fichier
const fileIcon = computed(() => {
  const icons = {
    pdf: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z M9 13h6 M9 17h6 M9 9h1',
    word: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z M12 11v6 M9 14h6',
    excel: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z M9 11h6 M9 15h6 M9 13h6',
    image: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    video: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    audio: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
    document: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
  };
  
  return icons[fileType.value] || icons.document;
});

// Couleur selon le type
const fileColor = computed(() => {
  const colors = {
    pdf: 'red',
    word: 'blue',
    excel: 'green',
    image: 'purple',
    video: 'pink',
    audio: 'yellow',
    document: 'gray'
  };
  return colors[fileType.value] || 'gray';
});

// Gestionnaire d'erreur d'image
const handleImageError = (e) => {
  e.target.src = `${storageBaseUrl.value}/images/placeholder-image.png`;
  e.target.alt = 'Image non disponible';
};

// Gestionnaire de changement de fichier
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Créer un aperçu
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewUrl.value = e.target.result;
        previewType.value = 'image';
        showComparison.value = true;
      };
      reader.readAsDataURL(file);
    } else {
      previewUrl.value = null;
      previewType.value = file.type;
      showComparison.value = true;
    }
    emit('update:modelValue', file);
  }
};

// Gestionnaire de suppression
const handleDelete = () => {
  previewUrl.value = null;
  previewType.value = null;
  showComparison.value = false;
  emit('delete');
  emit('update:modelValue', null);
};

// Annuler la sélection
const handleCancelNewFile = () => {
  previewUrl.value = null;
  previewType.value = null;
  showComparison.value = false;
  emit('update:modelValue', null);
};

// Vérifications d'état
const hasNewFile = computed(() => isFile(props.modelValue));
const hasExistingFile = computed(() => {
  return props.param.type === 'file' && 
         props.param.value && 
         !isFile(props.modelValue);
});
const hasError = computed(() => props.errors?.length > 0);

// Formatage de la taille du fichier
const formatFileSize = (bytes) => {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};
</script>

<template>
  <div class="space-y-1.5 w-full" :class="fieldClass">
    <!-- Header avec label et badge -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ param.valueKey || formatLabel(param.key) }}
        <span v-if="param.required" class="ml-1 text-red-500">*</span>
      </label>
      
      <!-- Badge de type -->
      <span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full self-start sm:self-auto">
        {{ param.type }}
      </span>
    </div>

    <!-- Champ texte -->
    <template v-if="param.type === 'text'">
      <div class="relative group">
        <input
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          type="text"
          class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border rounded-lg transition-all duration-200
                 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white
                 hover:border-gray-400 dark:hover:border-gray-500
                 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          :class="[
            hasError 
              ? 'border-red-300 dark:border-red-700 focus:ring-red-500/20 focus:border-red-500'
              : 'border-gray-300 dark:border-gray-600'
          ]"
          :placeholder="'Saisir ' + (param.valueKey || param.key)"
          :disabled="param.readonly"
        />
        
        <!-- Icône de validation -->
        <div v-if="modelValue && !hasError && !param.readonly" 
             class="absolute right-3 top-1/2 -translate-y-1/2">
          <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    </template>

    <!-- Champ textarea -->
    <template v-else-if="param.type === 'textarea'">
      <textarea
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        rows="4"
        class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
               rounded-lg transition-all duration-200
               focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white
               hover:border-gray-400 dark:hover:border-gray-500
               resize-y min-h-[100px] text-sm sm:text-base"
        :placeholder="'Saisir ' + (param.valueKey || param.key)"
        :disabled="param.readonly"
      ></textarea>
    </template>

    <!-- Champ select -->
    <template v-else-if="param.type === 'select'">
      <div class="relative">
        <select
          :value="modelValue"
          @change="$emit('update:modelValue', $event.target.value)"
          class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                 rounded-lg appearance-none transition-all duration-200
                 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white
                 hover:border-gray-400 dark:hover:border-gray-500
                 pr-10 text-sm sm:text-base"
          :disabled="param.readonly"
        >
          <option value="" class="text-gray-400">Sélectionnez une option</option>
          <option
            v-for="option in selectOptions"
            :key="option.value"
            :value="option.value"
            class="text-gray-900 dark:text-gray-100"
          >
            {{ option.label }}
          </option>
        </select>
        
        <!-- Icône dropdown -->
        <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </template>

    <!-- Champ boolean (toggle élégant) -->
    <template v-else-if="param.type === 'boolean'">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 gap-3">
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {{ modelValue ? 'Activé' : 'Désactivé' }}
        </span>
        
        <button
          type="button"
          @click="$emit('update:modelValue', !modelValue)"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="modelValue ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'"
          :disabled="param.readonly"
        >
          <span
            class="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300"
            :class="modelValue ? 'translate-x-6' : 'translate-x-1'"
          />
        </button>
      </div>
    </template>

    <!-- Champ fichier avec design moderne et comparaison -->
    <template v-else-if="param.type === 'file'">
      <div class="space-y-4">
        <!-- Zone de preview avec comparaison -->
        <div v-if="hasExistingFile || hasNewFile" 
             class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <!-- Fichier existant -->
          <div v-if="hasExistingFile" 
               class="relative border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
            <div class="absolute top-2 left-2 z-10">
              <span class="text-xs px-2 py-1 bg-gray-900/50 text-white rounded-full backdrop-blur-sm">
                Actuel
              </span>
            </div>
            
            <!-- Image existante -->
            <div v-if="isImageFile(props.param.value)" class="aspect-video bg-gray-100 dark:bg-gray-900">
              <img 
                :src="existingFileUrl" 
                :alt="existingFileName"
                class="w-full h-full object-contain"
                @error="handleImageError"
              />
            </div>
            
            <!-- Icône fichier existant -->
            <div v-else class="p-4 flex flex-col items-center justify-center min-h-[120px]">
              <div class="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="fileIcon" />
                </svg>
              </div>
              <p class="mt-2 text-xs text-gray-600 dark:text-gray-400 truncate max-w-full px-2">
                {{ existingFileName }}
              </p>
            </div>
            
            <!-- Lien téléchargement -->
            <a 
              :href="existingFileUrl" 
              target="_blank"
              class="absolute bottom-2 right-2 p-1.5 bg-white/90 dark:bg-gray-800/90 rounded-lg 
                     text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400
                     backdrop-blur-sm transition-colors"
              title="Télécharger"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </div>
          
          <!-- Nouveau fichier sélectionné -->
          <div v-if="hasNewFile" 
               class="relative border-2 border-blue-300 dark:border-blue-700 rounded-lg overflow-hidden bg-blue-50/50 dark:bg-blue-900/10">
            <div class="absolute top-2 left-2 z-10">
              <span class="text-xs px-2 py-1 bg-blue-600 text-white rounded-full">
                Nouveau
              </span>
            </div>
            
            <!-- Nouvelle image preview -->
            <div v-if="previewType === 'image' && previewUrl" class="aspect-video bg-gray-100 dark:bg-gray-900">
              <img 
                :src="previewUrl" 
                :alt="fileName"
                class="w-full h-full object-contain"
              />
            </div>
            
            <!-- Nouveau fichier non-image -->
            <div v-else class="p-4 flex flex-col items-center justify-center min-h-[120px]">
              <div class="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="fileIcon" />
                </svg>
              </div>
              <div class="mt-2 text-center px-2">
                <p class="text-xs font-medium text-gray-900 dark:text-white truncate max-w-full">
                  {{ fileName }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatFileSize(modelValue?.size) }}
                </p>
              </div>
            </div>
            
            <!-- Bouton annuler -->
            <button
              v-if="!param.readonly"
              type="button"
              @click="handleCancelNewFile"
              class="absolute bottom-2 right-2 p-1.5 bg-white/90 dark:bg-gray-800/90 rounded-lg 
                     text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400
                     backdrop-blur-sm transition-colors"
              title="Annuler"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Zone d'upload -->
        <div class="relative border-2 border-dashed rounded-lg transition-all duration-200"
             :class="[
               hasNewFile || hasExistingFile
                 ? 'border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/10'
                 : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
             ]">
          
          <!-- Upload button -->
          <div class="p-4 sm:p-6">
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              
              <div class="text-center sm:text-left">
                <label class="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 
                             hover:text-blue-500 focus-within:outline-none focus-within:ring-2 
                             focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span class="text-sm sm:text-base">{{ hasNewFile ? 'Changer le fichier' : 'Télécharger un fichier' }}</span>
                  <input
                    type="file"
                    @change="handleFileChange"
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                    class="sr-only"
                    :disabled="param.readonly"
                  />
                </label>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  ou glisser-déposer
                </p>
              </div>
              
              <span class="text-xs text-gray-400 dark:text-gray-500 sm:ml-auto">
                Max 10MB
              </span>
            </div>
            
            <!-- Types acceptés -->
            <div class="flex flex-wrap justify-center gap-2 mt-3">
              <span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                PNG
              </span>
              <span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                JPG
              </span>
              <span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                PDF
              </span>
              <span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                DOC
              </span>
              <span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                XLS
              </span>
            </div>
          </div>
        </div>

        <!-- Bouton supprimer global -->
        <button
          v-if="(hasExistingFile || hasNewFile) && !param.readonly"
          type="button"
          @click="handleDelete"
          class="w-full sm:w-auto px-4 py-2 text-sm text-red-600 dark:text-red-400 
                 border border-red-200 dark:border-red-800 rounded-lg
                 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors
                 flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Supprimer le fichier
        </button>
      </div>
    </template>

    <!-- Champ par défaut -->
    <template v-else>
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="text"
        class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
               rounded-lg transition-all duration-200
               focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white
               hover:border-gray-400 dark:hover:border-gray-500 text-sm sm:text-base"
        :disabled="param.readonly"
      />
    </template>

    <!-- Messages d'erreur -->
    <div v-if="hasError" class="space-y-1">
      <p v-for="(error, index) in errors" :key="index" 
         class="text-xs text-red-600 dark:text-red-400 flex items-start">
        <svg class="w-3.5 h-3.5 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span class="flex-1">{{ error }}</span>
      </p>
    </div>

    <!-- Description -->
    <p v-else-if="description" class="text-xs text-gray-500 dark:text-gray-500 flex items-start">
      <svg class="w-3.5 h-3.5 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      </svg>
      <span class="flex-1">{{ description }}</span>
    </p>
  </div>
</template>

<style scoped>
/* Animations smooth */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Style pour le drag & drop */
.border-dashed {
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23CBD5E1' stroke-width='2' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
}

.dark .border-dashed {
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23374151' stroke-width='2' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
}

/* Animation pour le toggle */
.transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Responsive utilities */
@media (max-width: 640px) {
  .text-xs {
    font-size: 0.7rem;
  }
  
  .p-4 {
    padding: 0.75rem;
  }
}

/* Aspect ratio pour les images */
.aspect-video {
  aspect-ratio: 16/9;
}
</style>