<template>
  <div class="multiple-file-upload" :class="{ 'has-files': modelValue.length > 0 }">
    <input
      type="file"
      :accept="accept"
      multiple
      @change="handleFileChange"
      class="multiple-file-input"
    />
    <div class="upload-area multiple">
      <i class="fas fa-cloud-upload-alt upload-icon"></i>
      <p class="upload-text">Glissez ou cliquez pour ajouter des fichiers</p>
      <small class="upload-hint">PDF uniquement • Max {{ maxSize }}MB par fichier • Max {{ maxFiles }} fichiers</small>
    </div>
    
    <div v-if="modelValue.length > 0" class="files-list">
      <div v-for="(file, index) in modelValue" :key="index" class="file-item">
        <div class="file-info">
          <i class="fas fa-file-pdf text-danger"></i>
          <div class="file-details">
            <span class="file-name">{{ file.name }}</span>
            <span class="file-size">{{ formatFileSize(file.size) }}</span>
          </div>
        </div>
        <button type="button" class="btn-remove" @click="removeFile(index)">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
    
    <div class="files-count">
      <span class="count-text">{{ modelValue.length }} fichier(s) sélectionné(s)</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  accept: String,
  maxSize: {
    type: Number,
    default: 5
  },
  maxFiles: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['update:modelValue', 'error'])

const handleFileChange = (event) => {
  const files = Array.from(event.target.files)
  
  // Vérifier le nombre maximum de fichiers
  if (props.modelValue.length + files.length > props.maxFiles) {
    emit('error', `Vous ne pouvez pas télécharger plus de ${props.maxFiles} fichiers`)
    event.target.value = ''
    return
  }

  // Vérifier la taille de chaque fichier
  const oversizedFiles = files.filter(f => f.size > props.maxSize * 1024 * 1024)
  if (oversizedFiles.length > 0) {
    emit('error', `Certains fichiers dépassent la taille maximale de ${props.maxSize}MB`)
    event.target.value = ''
    return
  }

  emit('update:modelValue', [...props.modelValue, ...files])
  event.target.value = ''
}

const removeFile = (index) => {
  const newFiles = [...props.modelValue]
  newFiles.splice(index, 1)
  emit('update:modelValue', newFiles)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.multiple-file-upload {
  position: relative;
}

.multiple-file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.upload-area.multiple {
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  background: white;
  position: relative;
  z-index: 1;
}

.upload-area.multiple:hover {
  border-color: var(--primary-color);
  background: var(--primary-light);
}

.upload-icon {
  font-size: 2rem;
  color: var(--secondary-color);
  margin-bottom: 1rem;
}

.upload-text {
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.upload-hint {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.files-list {
  margin-top: 1rem;
  max-height: 200px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: var(--background-color);
  border-radius: 6px;
  margin-bottom: 0.5rem;
  border: 1px solid var(--border-color);
}

.file-item:hover {
  background: var(--primary-light);
  border-color: var(--primary-color);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.file-details {
  display: flex;
  flex-direction: column;
}

.file-name {
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.9rem;
}

.file-size {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.btn-remove {
  background: none;
  border: none;
  color: var(--danger-color);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.btn-remove:hover {
  background: rgba(239, 68, 68, 0.1);
}

.files-count {
  margin-top: 1rem;
  text-align: center;
}

.count-text {
  font-size: 0.9rem;
  color: var(--text-muted);
  font-weight: 500;
}
</style>