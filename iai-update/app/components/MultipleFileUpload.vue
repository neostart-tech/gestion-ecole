<template>
  <div class="multiple-file-upload-container">
    <div
      class="upload-area"
      :class="{
        'is-dragging': isDragging,
        'has-files': modelValue.length > 0
      }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <input
        type="file"
        :accept="accept"
        multiple
        @change="handleFileChange"
        class="hidden-input"
        id="multiple-file-input"
      />
      
      <label for="multiple-file-input" class="upload-label">
        <div class="upload-content">
          <div class="icon-wrapper">
            <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div class="text-content">
            <p class="title">Ajouter des fichiers</p>
            <p class="subtitle">Glissez-déposez ou cliquez pour parcourir</p>
            <div class="upload-hint">
              <span>{{ acceptText }}</span>
              <span class="separator">•</span>
              <span>Max {{ maxSize }} Mo</span>
            </div>
          </div>
        </div>
      </label>
    </div>

    <!-- Liste des fichiers sélectionnés -->
    <div class="files-list" v-if="modelValue.length > 0 || existingFiles.length > 0">
      <!-- Fichiers existants -->
      <div v-for="(path, index) in existingFiles" :key="'existing-' + index" class="file-card existing">
        <div class="file-preview">
          <img v-if="isImage(path)" :src="path" class="preview-image" />
          <svg v-else class="file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div class="file-details">
          <p class="file-name">Fichier existant {{ index + 1 }}</p>
          <p class="file-meta">Déjà sur le serveur</p>
        </div>
        <div class="status-indicator">
          <span class="badge-existing">Actuel</span>
        </div>
      </div>

      <!-- Nouveaux fichiers -->
      <transition-group name="list">
        <div v-for="(file, index) in modelValue" :key="file.name + index" class="file-card">
          <div class="file-preview">
            <img v-if="file.type.startsWith('image/')" :src="getPreview(file)" class="preview-image" />
            <svg v-else class="file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="file-details">
            <p class="file-name">{{ file.name }}</p>
            <p class="file-meta">{{ formatFileSize(file.size) }}</p>
          </div>
          <button type="button" class="remove-btn" @click="removeFile(index)" title="Supprimer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </transition-group>
    </div>

    <div v-if="modelValue.length > 0 || existingFiles.length > 0" class="status-bar">
      <div class="badge">
        {{ modelValue.length + existingFiles.length }} / {{ maxFiles }} fichiers
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  accept: {
    type: String,
    default: '.pdf'
  },
  maxSize: {
    type: Number,
    default: 5
  },
  maxFiles: {
    type: Number,
    default: 10
  },
  existingFiles: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'error'])

const isDragging = ref(false)

const acceptText = computed(() => {
  if (props.accept.includes('image')) return 'Images uniquement'
  if (props.accept.includes('pdf')) return 'PDF uniquement'
  return 'Tous formats acceptés'
})

const handleFileChange = (event) => {
  const files = Array.from(event.target.files)
  processFiles(files)
  event.target.value = ''
}

const onDrop = (event) => {
  isDragging.value = false
  const files = Array.from(event.dataTransfer.files)
  processFiles(files)
}

const processFiles = (newFiles) => {
  // Vérifier le nombre maximum
  if (props.modelValue.length + newFiles.length > props.maxFiles) {
    emit('error', `Maximum ${props.maxFiles} fichiers autorisés`)
    return
  }

  // Vérifier la taille et le type
  const validFiles = newFiles.filter(file => {
    const isTypeOk = checkFileType(file)
    const isSizeOk = file.size <= props.maxSize * 1024 * 1024
    return isTypeOk && isSizeOk
  })

  if (validFiles.length < newFiles.length) {
    emit('error', 'Certains fichiers ont été ignorés (format invalide ou taille trop grande)')
  }

  emit('update:modelValue', [...props.modelValue, ...validFiles])
}

const checkFileType = (file) => {
  if (props.accept === '*') return true
  
  const acceptedTypes = props.accept.split(',').map(t => t.trim())
  return acceptedTypes.some(type => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase())
    }
    if (type.endsWith('/*')) {
      const baseType = type.split('/')[0]
      return file.type.startsWith(baseType + '/')
    }
    return file.type === type
  })
}

const isImage = (path) => {
  if (!path) return false
  const ext = path.split('.').pop().toLowerCase()
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)
}

const getPreview = (file) => {
  return URL.createObjectURL(file)
}

const removeFile = (index) => {
  const updatedFiles = [...props.modelValue]
  updatedFiles.splice(index, 1)
  emit('update:modelValue', updatedFiles)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'Ko', 'Mo', 'Go']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
</script>

<style scoped>
.multiple-file-upload-container {
  width: 100%;
}

.upload-area {
  position: relative;
  border: 2px dashed #e2e8f0;
  border-radius: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark .upload-area {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-color: #334155;
}

.upload-area:hover {
  border-color: #6366f1;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
}

.upload-area.is-dragging {
  border-color: #6366f1;
  background: #eef2ff;
  transform: scale(1.01);
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
  padding: 1.5rem;
  cursor: pointer;
}

.upload-content {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.icon-wrapper {
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 1rem;
  color: #6366f1;
}

.upload-icon {
  width: 2rem;
  height: 2rem;
}

.title {
  font-weight: 700;
  font-size: 0.95rem;
  color: #1e293b;
  margin: 0;
}

.dark .title {
  color: #f1f5f9;
}

.subtitle {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0.125rem 0 0.5rem 0;
}

.upload-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.7rem;
  color: #94a3b8;
  font-weight: 500;
}

.separator {
  color: #cbd5e1;
}

/* Files List */
.files-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.file-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.dark .file-card {
  background: #1e293b;
  border-color: #334155;
}

.file-card.existing {
  background: #f8fafc;
  border-style: solid;
  border-color: #e2e8f0;
  opacity: 0.8;
}

.dark .file-card.existing {
  background: #0f172a;
  border-color: #1e293b;
}

.badge-existing {
  font-size: 0.6rem;
  font-weight: 800;
  padding: 0.125rem 0.375rem;
  background: #e0f2fe;
  color: #0369a1;
  border-radius: 0.25rem;
  text-transform: uppercase;
}

.dark .badge-existing {
  background: #0c4a6e;
  color: #bae6fd;
}

.file-card:hover {
  border-color: #6366f1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.file-preview {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fef2f2;
  color: #ef4444;
  border-radius: 0.5rem;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.file-details {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .file-name {
  color: #f1f5f9;
}

.file-meta {
  font-size: 0.7rem;
  color: #94a3b8;
  margin: 0;
}

.remove-btn {
  padding: 0.5rem;
  color: #94a3b8;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #fef2f2;
  color: #ef4444;
}

.status-bar {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

.badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.dark .badge {
  background: #334155;
  color: #cbd5e1;
}

/* Animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>