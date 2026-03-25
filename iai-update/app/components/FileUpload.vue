<template>
  <div class="file-upload-container">
    <div
      class="upload-dropzone"
      :class="{
        'has-file': modelValue,
        'is-dragging': isDragging,
        'is-error': hasError
      }"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <input
        :id="id"
        type="file"
        :accept="accept"
        :required="required"
        @change="handleFileChange"
        class="hidden-input"
      />
      
      <label :for="id" class="upload-label">
        <div class="upload-content">
          <!-- Icône animée -->
          <div class="icon-wrapper" :class="{ 'icon-active': modelValue }">
            <svg
              v-if="!modelValue"
              class="upload-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <svg
              v-else
              class="upload-icon success-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <div class="text-content">
            <p v-if="!modelValue" class="title">
              {{ isDragging ? 'Déposez votre fichier' : 'Déposez votre fichier ici' }}
            </p>
            <p v-else class="title file-name">
              {{ modelValue.name }}
            </p>
            <p class="subtitle">
              {{ !modelValue ? 'ou' : '' }}
              <span class="browse-link">cliquez pour parcourir</span>
            </p>
            <div class="file-info" v-if="modelValue">
              <span class="file-size">{{ formatFileSize(modelValue.size) }}</span>
              <span class="file-type">{{ getFileType(modelValue.name) }}</span>
            </div>
            <div class="upload-hint" v-else>
              <span>Formats: {{ getFormats() }}</span>
              <span class="separator">•</span>
              <span>Max: {{ maxSize }} Mo</span>
            </div>
          </div>

          <!-- Bouton de suppression -->
          <button
            v-if="modelValue"
            type="button"
            class="remove-button"
            @click.stop="removeFile"
            title="Supprimer"
          >
            <svg class="remove-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </label>
    </div>

    <!-- Message d'erreur -->
    <transition name="slide-fade">
      <div v-if="errorMessage" class="error-message">
        <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {{ errorMessage }}
      </div>
    </transition>

    <!-- Barre de progression (optionnelle) -->
    <transition name="slide-fade">
      <div v-if="isUploading" class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  modelValue: {
    type: File,
    default: null
  },
  accept: {
    type: String,
    default: '.pdf,.jpg,.jpeg,.png'
  },
  required: {
    type: Boolean,
    default: false
  },
  maxSize: {
    type: Number,
    default: 5
  },
  showProgress: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'error', 'uploading'])

const isDragging = ref(false)
const hasError = ref(false)
const errorMessage = ref('')
const isUploading = ref(false)
const progress = ref(0)

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  validateAndUpload(file)
}

const onDragOver = () => {
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const onDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) validateAndUpload(file)
}

const validateAndUpload = async (file) => {
  // Réinitialiser les erreurs
  clearError()

  // Vérifier le type de fichier
  if (!isValidFileType(file)) {
    showError(`Format non supporté. Formats acceptés: ${getFormats()}`)
    return
  }

  // Vérifier la taille
  if (file.size > props.maxSize * 1024 * 1024) {
    showError(`Le fichier ne doit pas dépasser ${props.maxSize} Mo`)
    return
  }

  // Simulation d'upload (à remplacer par votre logique d'upload)
  if (props.showProgress) {
    await simulateUpload(file)
  }

  emit('update:modelValue', file)
}

const simulateUpload = (file) => {
  return new Promise((resolve) => {
    isUploading.value = true
    progress.value = 0
    const interval = setInterval(() => {
      if (progress.value >= 100) {
        clearInterval(interval)
        isUploading.value = false
        resolve()
      } else {
        progress.value += 10
        emit('uploading', progress.value)
      }
    }, 100)
  })
}

const removeFile = () => {
  emit('update:modelValue', null)
  const input = document.getElementById(props.id)
  if (input) input.value = ''
  clearError()
}

const isValidFileType = (file) => {
  const acceptedTypes = props.accept.split(',').map(type => type.trim())
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
  const fileType = file.type
  
  return acceptedTypes.some(type => {
    if (type.startsWith('.')) {
      return fileExtension === type.toLowerCase()
    }
    if (type.includes('/')) {
      return fileType === type
    }
    return false
  })
}

const getFileType = (fileName) => {
  const extension = fileName.split('.').pop().toUpperCase()
  const types = {
    PDF: 'Document PDF',
    JPG: 'Image JPEG',
    JPEG: 'Image JPEG',
    PNG: 'Image PNG',
    DOC: 'Document Word',
    DOCX: 'Document Word'
  }
  return types[extension] || `${extension}`
}

const getFormats = () => {
  return props.accept
    .split(',')
    .map(format => format.trim().toUpperCase())
    .join(', ')
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'Ko', 'Mo', 'Go']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const showError = (message) => {
  hasError.value = true
  errorMessage.value = message
  emit('error', message)
  
  // Auto-cacher après 3 secondes
  setTimeout(() => {
    clearError()
  }, 3000)
}

const clearError = () => {
  hasError.value = false
  errorMessage.value = ''
}
</script>

<style scoped>
.file-upload-container {
  width: 100%;
}

.upload-dropzone {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hidden-input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.upload-label {
  display: block;
  cursor: pointer;
}

.upload-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px dashed #e2e8f0;
  border-radius: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  transition: all 0.3s ease;
}

.dark .upload-content {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-color: #334155;
}

.upload-dropzone:not(.has-file):hover .upload-content {
  border-color: #6366f1;
  background: linear-gradient(135deg, #eef2ff 0%, #ffffff 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.dark .upload-dropzone:not(.has-file):hover .upload-content {
  background: linear-gradient(135deg, #1e293b 0%, #1e1b4b 100%);
  border-color: #818cf8;
}

.upload-dropzone.is-dragging .upload-content {
  border-color: #6366f1;
  background: linear-gradient(135deg, #eef2ff 0%, #ffffff 100%);
  transform: scale(1.02);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.dark .upload-dropzone.is-dragging .upload-content {
  background: linear-gradient(135deg, #1e293b 0%, #1e1b4b 100%);
  border-color: #818cf8;
}

.upload-dropzone.has-file .upload-content {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%);
}

.dark .upload-dropzone.has-file .upload-content {
  background: linear-gradient(135deg, #064e3b 0%, #0f172a 100%);
  border-color: #10b981;
}

.upload-dropzone.is-error .upload-content {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.icon-wrapper {
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  background: rgba(99, 102, 241, 0.1);
  transition: all 0.3s ease;
}

.icon-wrapper.icon-active {
  background: rgba(16, 185, 129, 0.1);
}

.upload-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: #6366f1;
  transition: all 0.3s ease;
}

.success-icon {
  color: #10b981;
}

.text-content {
  flex: 1;
}

.title {
  font-weight: 600;
  font-size: 0.95rem;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.dark .title {
  color: #f1f5f9;
}

.file-name {
  color: #10b981;
  word-break: break-all;
}

.subtitle {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.dark .subtitle {
  color: #94a3b8;
}

.browse-link {
  color: #6366f1;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
}

.browse-link:hover {
  color: #4f46e5;
  text-decoration: underline;
}

.file-info {
  display: flex;
  gap: 1rem;
  margin-top: 0.25rem;
}

.file-size {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.dark .file-size {
  color: #94a3b8;
}

.file-type {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  border-radius: 0.25rem;
  font-weight: 500;
}

.upload-hint {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.7rem;
  color: #94a3b8;
}

.dark .upload-hint {
  color: #64748b;
}

.separator {
  color: #cbd5e1;
}

.remove-button {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-button:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.05);
}

.remove-icon {
  width: 1rem;
  height: 1rem;
  color: #ef4444;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #fef2f2;
  border-left: 3px solid #ef4444;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  color: #dc2626;
}

.dark .error-message {
  background: #7f1a1a;
  color: #fecaca;
}

.error-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.progress-bar {
  margin-top: 0.75rem;
  height: 0.25rem;
  background: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
}

.dark .progress-bar {
  background: #334155;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 9999px;
  transition: width 0.3s ease;
}

/* Animations */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .upload-content {
    flex-direction: column;
    text-align: center;
    padding: 1.25rem;
  }
  
  .file-info {
    justify-content: center;
  }
  
  .upload-hint {
    justify-content: center;
  }
  
  .remove-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }
}
</style>