<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <Breadcrumb
      :items="[
        { label: 'Bulletins', to: '/' },
        { label: 'Modèles', to: null },
      ]"
      title="Modèles de Bulletins"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <div class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5">
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Gérez les modèles de présentation pour les bulletins de l'école.
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <NuxtLink
          to="/bulletins-templates/builder"
          class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Créer un nouveau modèle
        </NuxtLink>
      </div>
    </div>

    <!-- Contenu Principal -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 min-h-[400px]">
      
      <!-- Chargement -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
      </div>

      <!-- État Vide -->
      <div v-else-if="templates.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-16 h-16 mb-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun modèle disponible</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">Vous n'avez pas encore configuré de modèle de bulletin. Créez-en un pour commencer.</p>
        <NuxtLink to="/bulletins-templates/builder" class="px-5 py-2.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60 font-medium transition-colors">
          Créer mon premier modèle
        </NuxtLink>
      </div>

      <!-- Grille des Modèles -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="template in templates" :key="template.slug" class="flex flex-col bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors">
          
          <div class="p-5 flex-1">
            <div class="flex justify-between items-start mb-3">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white truncate" :title="template.nom">{{ template.nom }}</h2>
              <div v-if="template.is_default" class="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                Par défaut
              </div>
            </div>
            
            <div class="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                Période: <span class="font-medium text-gray-900 dark:text-white">{{ formatTypePeriode(template.type_periode) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                Blocs: <span class="font-medium text-gray-900 dark:text-white">{{ template.layout_json?.length || 0 }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
            <button v-if="!template.is_default" @click="markAsDefault(template)" class="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
              Définir par défaut
            </button>
            <span v-else class="text-xs text-gray-400 italic">Modèle actif</span>

            <div class="flex gap-2">
              <NuxtLink :to="`/bulletins-templates/builder?slug=${template.slug}`" class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Modifier">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </NuxtLink>
              <button @click="deleteTemplate(template.slug)" class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Supprimer">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Breadcrumb from "~/components/Breadcrumb.vue"
import ButtonDelete from "~/components/ui/buttonDelete.vue"

const { $api, $swal } = useNuxtApp()

const templates = ref([])
const loading = ref(true)

const formatTypePeriode = (type) => {
  const map = {
    'trimestre_1': 'Trimestre 1',
    'trimestre_2': 'Trimestre 2',
    'trimestre_3': 'Trimestre 3',
    'semestre_1': 'Semestre 1',
    'semestre_2': 'Semestre 2',
    'annuel': 'Annuel / Bilan'
  }
  return map[type] || 'Non définie'
}

const fetchTemplates = async () => {
  try {
    loading.value = true
    const response = await $api.get('/bulletin-templates')
    templates.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement des templates', error)
  } finally {
    loading.value = false
  }
}

const deleteTemplate = async (slug) => {
  const result = await $swal.fire({
    title: 'Êtes-vous sûr ?',
    text: "La suppression de ce modèle est irréversible !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  })

  if (result.isConfirmed) {
    try {
      await $api.delete(`/bulletin-templates/${slug}`)
      await fetchTemplates()
      $swal.fire('Supprimé!', 'Le modèle a été supprimé.', 'success')
    } catch (error) {
      console.error('Erreur de suppression', error)
      $swal.fire('Erreur', 'Une erreur est survenue lors de la suppression.', 'error')
    }
  }
}

const markAsDefault = async (template) => {
  try {
    await $api.put(`/bulletin-templates/${template.slug}`, {
      ...template,
      is_default: true
    })
    await fetchTemplates()
  } catch (error) {
    console.error('Erreur de mise à jour', error)
  }
}

onMounted(() => {
  fetchTemplates()
})
</script>
