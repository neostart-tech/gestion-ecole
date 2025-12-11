<template>
  <div class="tinymce-editor">
    <Editor
      v-model="content"
      :init="initOptions"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event)"
      @onInit="handleInit"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Editor from '@tinymce/tinymce-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'Saisissez votre texte ici...'
  }
})

const emit = defineEmits(['update:modelValue'])

const content = ref(props.modelValue)

// Votre clé API TinyMCE
const TINYMCE_API_KEY = 'zg2zugks07aopv32g7tny5709pnqww29mxbvn1oa8x7d78c7'

watch(() => props.modelValue, (newValue) => {
  content.value = newValue
})

const initOptions = ref({
  apiKey: TINYMCE_API_KEY,
  height: 300,
  menubar: true,
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons'
  ],
  toolbar: 'undo redo | blocks fontfamily fontsize | ' +
    'bold italic underline strikethrough | forecolor backcolor | ' +
    'alignleft aligncenter alignright alignjustify | ' +
    'bullist numlist outdent indent | link image | ' +
    'removeformat | emoticons | help',
  content_style: `
    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; 
      font-size: 14px; 
      line-height: 1.6;
      color: #374151;
    }
    p { margin: 0 0 1rem 0; }
    h1, h2, h3, h4, h5, h6 { 
      font-weight: 600;
      margin: 1.5rem 0 0.75rem 0;
    }
    ul, ol { padding-left: 1.5rem; }
    blockquote { 
      border-left: 4px solid rgb(var(--color-primary-300));
      padding-left: 1rem;
      font-style: italic;
      color: #6b7280;
    }
  `,
  language: 'fr_FR',
  branding: false,
  skin: 'oxide',
  content_css: 'default',
  placeholder: props.placeholder,
  // Configuration pour l'upload d'images
  images_upload_handler: async (blobInfo, progress) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', blobInfo.blob(), blobInfo.filename());
      
      // Ici vous pouvez ajouter votre propre endpoint d'upload
      fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        if (data.location) {
          resolve(data.location);
        } else {
          reject('Upload failed');
        }
      })
      .catch(() => {
        reject('Upload failed');
      });
    });
  },
  // Configuration de la police
  font_family_formats: 'Arial=arial,helvetica,sans-serif; Times New Roman=times new roman,times; Courier New=courier new,courier; Georgia=georgia,palatino; Verdana=verdana,geneva',
  font_size_formats: '8px 9px 10px 11px 12px 14px 16px 18px 24px 30px 36px 48px',
  // Configuration pour les émoticônes
  emoticons_database: 'emojis',
  // Configuration pour les couleurs
  color_map: [
    '#000000', 'Noir',
    '#ffffff', 'Blanc',
    '#ef4444', 'Rouge',
    '#f59e0b', 'Orange',
    '#10b981', 'Vert',
    '#3b82f6', 'Bleu',
    '#8b5cf6', 'Violet',
    'rgb(var(--color-primary-500))', 'Primaire'
  ]
})

const handleInit = (editor) => {
  console.log('TinyMCE initialisé avec succès')
  // Vous pouvez accéder à l'instance editor ici si besoin
}

// Charger TinyMCE si nécessaire
onMounted(() => {
  if (typeof window !== 'undefined' && !window.tinymce) {
    import('tinymce').then(tinymce => {
      // Les skins et thèmes seront chargés automatiquement avec la clé API
    })
  }
})
</script>

<style scoped>
.tinymce-editor {
  width: 100%;
}

:deep(.tox-tinymce) {
  border-radius: 0.5rem;
  border-color: #d1d5db !important;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

:deep(.tox-tinymce:focus-within) {
  border-color: rgb(var(--color-primary-500)) !important;
  box-shadow: 0 0 0 3px rgba(var(--color-primary-500), 0.1);
}

:deep(.tox-toolbar__primary) {
  background: #f9fafb !important;
  border-bottom: 1px solid #e5e7eb !important;
}

:deep(.tox-tbtn) {
  border-radius: 0.25rem !important;
  transition: background-color 0.2s ease-in-out !important;
}

:deep(.tox-tbtn:hover) {
  background-color: #e5e7eb !important;
}

:deep(.tox-tbtn--enabled) {
  background-color: rgb(var(--color-primary-100)) !important;
  color: rgb(var(--color-primary-700)) !important;
}
</style>