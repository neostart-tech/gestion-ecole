<template>
  <div>
    <!-- Breadcrumbs -->
    <div class="mb-6">
      <nav class="flex" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li class="inline-flex items-center">
            <NuxtLink to="/admin" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
              Administration
            </NuxtLink>
          </li>
          <li>
            <div class="flex items-center">
              <Icon name="heroicons:chevron-right" class="w-4 h-4 text-gray-400 mx-1" />
              <NuxtLink to="/admin/filieres" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
                Filières
              </NuxtLink>
            </div>
          </li>
          <li aria-current="page">
            <div class="flex items-center">
              <Icon name="heroicons:chevron-right" class="w-4 h-4 text-gray-400 mx-1" />
              <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                {{ filiere?.nom || 'Modifier' }}
              </span>
            </div>
          </li>
        </ol>
      </nav>
    </div>

    <!-- En-tête de page -->
    <h1 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Modifier une filière</h1>

    <!-- Formulaire -->
    <UCard>
      <div v-if="loading">
        <div class="flex justify-center py-8">
          <UButton loading />
        </div>
      </div>
      <div v-else-if="filiere">
        <FormFiliere
          :filiere="filiere"
          :edit-mode="true"
          submit-text="Modifier la filière"
          @submit="updateFiliere"
        />
      </div>
      <div v-else class="text-center py-8">
        <p class="text-gray-500">Filière non trouvée</p>
        <NuxtLink to="/admin/filieres" class="mt-4 inline-block">
          <UButton color="primary">
            Retour à la liste
          </UButton>
        </NuxtLink>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const route = useRoute()
const filiere = ref(null)
const loading = ref(true)

// Données mockées
const mockFilieres = [
  {
    id: 1,
    nom: "Informatique",
    code: "INFO",
    description: "Formation en développement et réseaux informatiques",
    etudiants_count: 150,
    image: "/images/informatique.jpg"
  },
  {
    id: 2,
    nom: "Gestion",
    code: "GEST",
    description: "Formation en gestion d'entreprise et comptabilité",
    etudiants_count: 120,
    image: "/images/gestion.jpg"
  }
]

onMounted(async () => {
  loading.value = true
  try {
    // Récupérer la filière par ID depuis l'API
    const id = parseInt(route.params.id)
    
    // Simuler un appel API
    // const response = await $fetch(`/api/filieres/${id}`)
    // filiere.value = response.data
    
    // Pour démo, utiliser les données mockées
    filiere.value = mockFilieres.find(f => f.id === id)
  } catch (error) {
    console.error('Erreur:', error)
    useToast().add({
      title: 'Erreur',
      description: 'Impossible de charger la filière',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
})

const updateFiliere = async (formData) => {
  const toast = useToast()
  
  try {
    // Appel API pour mettre à jour
    // const response = await $fetch(`/api/filieres/${filiere.value.id}`, {
    //   method: 'PUT',
    //   body: formData
    // })
    
    console.log('Données à mettre à jour:', formData)
    
    // Notification de succès
    toast.add({
      title: 'Succès',
      description: 'Filière modifiée avec succès',
      color: 'green'
    })
    
    // Redirection vers la liste
    navigateTo('/admin/filieres')
  } catch (error) {
    console.error('Erreur:', error)
    toast.add({
      title: 'Erreur',
      description: 'Erreur lors de la modification',
      color: 'red'
    })
  }
}
</script>