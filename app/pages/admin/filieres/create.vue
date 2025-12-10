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
              <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Ajouter une filière</span>
            </div>
          </li>
        </ol>
      </nav>
    </div>

    <!-- En-tête de page -->
    <h1 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Ajouter une filière</h1>

    <!-- Formulaire -->
    <UCard>
      <FormFiliere
        submit-text="Ajouter la filière"
        @submit="createFiliere"
      />
    </UCard>
  </div>
</template>

<script setup>
import FormFiliere from '~/components/admin/filieres/FormFiliere.vue'

const createFiliere = async (formData) => {
  const toast = useToast()
  
  try {
    // Appel API pour créer la filière
    // const response = await $fetch('/api/filieres', {
    //   method: 'POST',
    //   body: formData
    // })
    
    console.log('Données à envoyer:', formData)
    
    // Notification de succès
    toast.add({
      title: 'Succès',
      description: 'Filière créée avec succès',
      color: 'green',
      icon: 'i-heroicons-check-circle'
    })
    
    // Redirection vers la liste
    navigateTo('/admin/filieres')
  } catch (error) {
    console.error('Erreur:', error)
    toast.add({
      title: 'Erreur',
      description: 'Erreur lors de la création',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle'
    })
  }
}
</script>