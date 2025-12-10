<template>
  <UForm :state="formState" @submit="submitForm" class="space-y-4">
    <UFormGroup label="Nom de la filière" name="nom" required>
      <UInput 
        v-model="formState.nom" 
        placeholder="Nom de la filière"
        :disabled="loading"
      />
    </UFormGroup>

    <UFormGroup label="Code de la filière" name="code" required>
      <UInput 
        v-model="formState.code" 
        placeholder="Code de la filière"
        :disabled="loading"
      />
    </UFormGroup>

    <UFormGroup label="Description de la filière" name="description">
      <UTextarea 
        v-model="formState.description" 
        placeholder="Description de la filière"
        :rows="3"
        :disabled="loading"
      />
    </UFormGroup>

    <UFormGroup label="Image d'illustration" name="image">
      <UInput 
        type="file" 
        accept="image/*" 
        @change="handleImageUpload"
        :disabled="loading"
      />
      
      <!-- Aperçu de l'image -->
      <div v-if="imagePreview" class="mt-2">
        <img :src="imagePreview" alt="Preview" class="w-32 h-32 object-cover rounded-lg">
      </div>
      
      <!-- Image actuelle -->
      <div v-if="editMode && formState.existingImage && !imagePreview" class="mt-2">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Image actuelle : {{ formState.existingImage }}
        </p>
      </div>
    </UFormGroup>

    <div class="flex space-x-3 pt-4">
      <UButton 
        type="submit" 
        :loading="loading"
        :disabled="loading"
        color="primary"
      >
        {{ submitText }}
      </UButton>
      
      <NuxtLink to="/admin/filieres">
        <UButton color="gray" variant="outline">
          Annuler
        </UButton>
      </NuxtLink>
    </div>
  </UForm>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  filiere: {
    type: Object,
    default: () => ({})
  },
  editMode: {
    type: Boolean,
    default: false
  },
  submitText: {
    type: String,
    default: 'Soumettre'
  }
})

const emit = defineEmits(['submit'])

const loading = ref(false)
const imagePreview = ref(null)

// État du formulaire réactif
const formState = ref({
  nom: '',
  code: '',
  description: '',
  image: null,
  existingImage: ''
})

// Initialiser le formulaire avec les données existantes
onMounted(() => {
  if (props.editMode && props.filiere) {
    formState.value = {
      nom: props.filiere.nom || '',
      code: props.filiere.code || '',
      description: props.filiere.description || '',
      image: null,
      existingImage: props.filiere.image || ''
    }
  }
})

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    formState.value.image = file
    
    // Créer un aperçu
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const submitForm = async () => {
  loading.value = true
  
  // Validation simple
  if (!formState.value.nom || !formState.value.code) {
    useToast().add({
      title: 'Validation',
      description: 'Le nom et le code sont obligatoires',
      color: 'red'
    })
    loading.value = false
    return
  }
  
  // Préparer les données pour l'envoi
  const formData = new FormData()
  formData.append('nom', formState.value.nom)
  formData.append('code', formState.value.code)
  formData.append('description', formState.value.description || '')
  
  if (formState.value.image instanceof File) {
    formData.append('image', formState.value.image)
  }
  
  try {
    // Envoyer les données au parent
    emit('submit', formData)
  } catch (error) {
    console.error('Erreur:', error)
    useToast().add({
      title: 'Erreur',
      description: 'Une erreur est survenue',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}
</script>