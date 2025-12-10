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
              <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Liste</span>
            </div>
          </li>
        </ol>
      </nav>
    </div>

    <!-- En-tête de page -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Liste des filières</h1>
      <NuxtLink to="/admin/filieres/create">
        <UButton icon="i-heroicons-plus" color="primary">
          Ajouter une filière
        </UButton>
      </NuxtLink>
    </div>

    <!-- Tableau des filières -->
    <UCard>
      <div v-if="filieres.length > 0">
        <UTable 
          :rows="filieres" 
          :columns="columns"
          :loading="loading"
        >
          <template #actions-data="{ row }">
            <div class="flex space-x-2">
              <!-- Voir -->
              <UButton 
                icon="i-heroicons-eye" 
                color="gray" 
                variant="ghost"
                @click="showFiliere(row)"
              />
              
              <!-- Éditer -->
              <NuxtLink :to="`/admin/filieres/edit/${row.id}`">
                <UButton 
                  icon="i-heroicons-pencil" 
                  color="green" 
                  variant="ghost"
                />
              </NuxtLink>
              
              <!-- Supprimer -->
              <UButton 
                icon="i-heroicons-trash" 
                color="red" 
                variant="ghost"
                @click="confirmDelete(row)"
              />
            </div>
          </template>

          <template #description-data="{ row }">
            <span v-if="row.description">
              {{ row.description.substring(0, 20) }}...
            </span>
            <span v-else class="text-gray-400">N/A</span>
          </template>
        </UTable>
      </div>
      
      <div v-else class="text-center py-8">
        <div class="mx-auto w-16 h-16 text-gray-400">
          <Icon name="heroicons-inbox" class="w-full h-full" />
        </div>
        <h3 class="mt-4 text-sm font-semibold text-gray-900 dark:text-white">Aucune filière</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Commencez par créer votre première filière.
        </p>
        <div class="mt-6">
          <NuxtLink to="/admin/filieres/create">
            <UButton icon="i-heroicons-plus" color="primary">
              Ajouter une filière
            </UButton>
          </NuxtLink>
        </div>
      </div>
    </UCard>

    <!-- Modal d'affichage -->
    <UModal v-model="showModal" :ui="{ width: 'sm:max-w-4xl' }">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">{{ selectedFiliere?.nom }}</h3>
            <UButton 
              color="gray" 
              variant="ghost" 
              icon="i-heroicons-x-mark-20-solid" 
              class="-my-1"
              @click="showModal = false"
            />
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-1">
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div class="flex justify-center">
                <div class="w-48 h-48">
                  <img 
                    v-if="selectedFiliere?.image" 
                    :src="getImageUrl(selectedFiliere.image)" 
                    class="w-full h-full object-cover rounded-lg"
                    alt="Image de la filière"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
                    <Icon name="heroicons-photo" class="w-16 h-16 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="md:col-span-2 space-y-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h4>
              <p class="mt-1 text-gray-900 dark:text-white">
                {{ selectedFiliere?.description || 'Aucune description' }}
              </p>
            </div>
            
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Code</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ selectedFiliere?.code }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre d'inscrits</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ selectedFiliere?.etudiants_count || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </UModal>

    <!-- Modal de suppression -->
    <UModal v-model="deleteModal">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Suppression</h3>
            <UButton 
              color="gray" 
              variant="ghost" 
              icon="i-heroicons-x-mark-20-solid" 
              class="-my-1"
              @click="deleteModal = false"
            />
          </div>
        </template>

        <p class="text-sm text-gray-600 dark:text-gray-300">
          Voulez-vous vraiment supprimer la filière "{{ filiereToDelete?.nom }}" ?
          Cette action est irréversible.
        </p>

        <template #footer>
          <div class="flex justify-end space-x-3">
            <UButton color="gray" @click="deleteModal = false">
              Annuler
            </UButton>
            <UButton color="red" @click="deleteFiliere">
              Supprimer
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Configuration des colonnes du tableau
const columns = [
  { key: 'id', label: '#' },
  { key: 'nom', label: 'Nom' },
  { key: 'code', label: 'Code' },
  { key: 'description', label: 'Description' },
  { key: 'etudiants_count', label: 'Inscrits' },
  { key: 'actions', label: 'Actions' }
]

// Données mockées
const filieres = ref([
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
])

const loading = ref(false)
const showModal = ref(false)
const deleteModal = ref(false)
const selectedFiliere = ref(null)
const filiereToDelete = ref(null)

const getImageUrl = (imagePath) => {
  if (imagePath instanceof File) {
    return URL.createObjectURL(imagePath)
  }
  return imagePath || '/images/default-filiere.jpg'
}

const showFiliere = (filiere) => {
  selectedFiliere.value = filiere
  showModal.value = true
}

const confirmDelete = (filiere) => {
  filiereToDelete.value = filiere
  deleteModal.value = true
}

const deleteFiliere = async () => {
  if (filiereToDelete.value) {
    loading.value = true
    try {
      // Appel API pour supprimer
      // await $fetch(`/api/filieres/${filiereToDelete.value.id}`, { method: 'DELETE' })
      
      // Suppression locale (pour démo)
      filieres.value = filieres.value.filter(f => f.id !== filiereToDelete.value.id)
      
      deleteModal.value = false
      filiereToDelete.value = null
      
      // Notification de succès
      useToast().add({
        title: 'Suppression réussie',
        description: 'La filière a été supprimée avec succès',
        color: 'green',
        icon: 'i-heroicons-check-circle'
      })
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      useToast().add({
        title: 'Erreur',
        description: 'Impossible de supprimer la filière',
        color: 'red',
        icon: 'i-heroicons-exclamation-circle'
      })
    } finally {
      loading.value = false
    }
  }
}
</script>