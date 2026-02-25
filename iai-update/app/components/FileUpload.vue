<template>
  <div class="file-upload-wrapper" :class="{ 'has-file': modelValue }">
    <input
      :id="id"
      type="file"
      :accept="accept"
      :required="required"
      @change="handleFileChange"
      class="file-input"
    />
    <div class="file-upload-area">
      <i class="fas fa-cloud-upload-alt upload-icon"></i>
      <p class="upload-text">Cliquez ou glissez pour télécharger</p>
      <small class="upload-hint">Max. {{ maxSize }}MB</small>
    </div>
    <div v-if="modelValue" class="file-preview">
      <div class="file-info">
        <div class="d-flex align-items-center gap-2">
          <i class="fas fa-file-pdf text-danger fs-4"></i>
          <div>
            <div class="fw-medium">{{ modelValue.name }}</div>
            <small class="text-muted">{{ formatFileSize(modelValue.size) }}</small>
          </div>
        </div>
        <button type="button" class="btn-remove" @click="removeFile">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  id: String,
  modelValue: File,
  accept: String,
  required: Boolean,
  maxSize: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['update:modelValue', 'error'])

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Vérifier la taille
  if (file.size > props.maxSize * 1024 * 1024) {
    emit('error', `Le fichier ne doit pas dépasser ${props.maxSize}MB`)
    event.target.value = ''
    return
  }

  emit('update:modelValue', file)
}

const removeFile = () => {
  emit('update:modelValue', null)
  // Réinitialiser l'input
  const input = document.getElementById(props.id)
  if (input) input.value = ''
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
.file-upload-wrapper {
  position: relative;
}

.file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.file-upload-area {
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  background: white;
  position: relative;
  z-index: 1;
}

.file-upload-area:hover {
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

.file-preview {
  margin-top: 1rem;
}

.file-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--primary-light);
  border-radius: 8px;
  border: 1px solid var(--primary-color);
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
</style>