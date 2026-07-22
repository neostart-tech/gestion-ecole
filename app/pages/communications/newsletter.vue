<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Abonnés Newsletter</h1>
        <p class="text-sm text-gray-500 mt-1">Gérez la liste de diffusion de votre newsletter.</p>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden p-4 sm:p-5">
      <div v-if="loading" class="py-8 text-center text-gray-500">
        Chargement des abonnés...
      </div>
      <div v-else-if="subscribers.length === 0" class="py-8 text-center text-gray-500">
        Aucun abonné trouvé.
      </div>
      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="columns"
          :rows="subscribers"
          skin="bh-table-striped bh-table-hover"
          sortable
          class="w-full"
        >
          <!-- Colonne Date -->
          <template #created_at="data">
            <span class="text-sm text-gray-500">
              {{ new Date(data.value.created_at).toLocaleDateString('fr-FR') }}
            </span>
          </template>

          <!-- Colonne Statut -->
          <template #status="data">
            <span v-if="data.value.status === 'active'" class="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Actif</span>
            <span v-else class="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Désabonné</span>
          </template>

          <!-- Colonne Actions -->
          <template #actions="data">
            <div class="flex justify-end gap-2">
              <Can action="delete-abonne-newsletter">
                <button @click="deleteSubscriber(data.value.id)" class="text-red-600 hover:bg-red-50 p-1.5 rounded-lg" title="Supprimer">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </Can>
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Vue3Datatable from '@bhplugin/vue3-datatable'
import '@bhplugin/vue3-datatable/dist/style.css'
import { useBlogStore } from '~~/stores/blog'

const blogStore = useBlogStore()
const subscribers = ref([])
const loading = ref(true)

const columns = ref([
  { field: 'email', title: 'Email' },
  { field: 'created_at', title: "Date d'inscription" },
  { field: 'status', title: 'Statut' },
  { field: 'actions', title: 'Actions', sort: false, headerClass: 'justify-end' }
])

const fetchSubscribers = async () => {
  loading.value = true
  try {
    subscribers.value = await blogStore.fetchNewsletterSubscribers()
  } catch (error) {
    console.error('Erreur de chargement des abonnés', error)
  } finally {
    loading.value = false
  }
}

const deleteSubscriber = async (id) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet abonné ?')) return
  try {
    await blogStore.deleteNewsletterSubscriber(id)
    fetchSubscribers()
  } catch (error) {
    console.error('Erreur suppression', error)
  }
}

onMounted(() => {
  fetchSubscribers()
})
</script>
