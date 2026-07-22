<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Commentaires du Blog</h1>
        <p class="text-sm text-gray-500 mt-1">Gérez les commentaires laissés par les internautes sur vos articles.</p>
      </div>
    </div>

    <!-- Filtres -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6 flex gap-4">
      <select v-model="filterStatus" class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
        <option value="all">Tous les statuts</option>
        <option value="pending">En attente</option>
        <option value="approved">Approuvés</option>
        <option value="rejected">Rejetés</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-gray-500">
        Chargement des commentaires...
      </div>
      <div v-else-if="filteredComments.length === 0" class="p-8 text-center text-gray-500">
        Aucun commentaire trouvé.
      </div>
      <table v-else class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <th class="p-4 font-semibold text-sm text-gray-900 dark:text-white">Auteur</th>
            <th class="p-4 font-semibold text-sm text-gray-900 dark:text-white">Article</th>
            <th class="p-4 font-semibold text-sm text-gray-900 dark:text-white">Commentaire</th>
            <th class="p-4 font-semibold text-sm text-gray-900 dark:text-white">Date</th>
            <th class="p-4 font-semibold text-sm text-gray-900 dark:text-white">Statut</th>
            <th class="p-4 font-semibold text-sm text-gray-900 dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="comment in filteredComments" :key="comment.id" class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
            <td class="p-4">
              <div class="font-medium text-gray-900 dark:text-white">{{ comment.author_name }}</div>
              <div class="text-xs text-gray-500">{{ comment.author_email }}</div>
            </td>
            <td class="p-4 text-sm text-gray-600 dark:text-gray-300 max-w-[200px] truncate">
              {{ comment.blog?.title || 'Article inconnu' }}
            </td>
            <td class="p-4 text-sm text-gray-600 dark:text-gray-300">
              <div class="max-w-[300px] truncate" :title="comment.content">{{ comment.content }}</div>
            </td>
            <td class="p-4 text-sm text-gray-500">
              {{ new Date(comment.created_at).toLocaleDateString('fr-FR') }}
            </td>
            <td class="p-4">
              <span v-if="comment.status === 'pending'" class="px-2.5 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">En attente</span>
              <span v-else-if="comment.status === 'approved'" class="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Approuvé</span>
              <span v-else class="px-2.5 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Rejeté</span>
            </td>
            <td class="p-4 flex gap-2">
              <Can action="moderate-commentaire-web">
                <button v-if="comment.status !== 'approved'" @click="updateStatus(comment.id, 'approved')" class="text-green-600 hover:bg-green-50 p-1.5 rounded-lg" title="Approuver">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
                <button v-if="comment.status !== 'rejected'" @click="updateStatus(comment.id, 'rejected')" class="text-yellow-600 hover:bg-yellow-50 p-1.5 rounded-lg" title="Rejeter">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </Can>
              <Can action="moderate-commentaire-web">
                <button @click="deleteComment(comment.id)" class="text-red-600 hover:bg-red-50 p-1.5 rounded-lg" title="Supprimer">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </Can>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNuxtApp } from '#app'

const { $axios } = useNuxtApp()
const comments = ref([])
const loading = ref(true)
const filterStatus = ref('all')

const fetchComments = async () => {
  loading.value = true
  try {
    const res = await $axios.get('/admin/web-communications/comments')
    comments.value = res.data
  } catch (error) {
    console.error('Erreur de chargement des commentaires', error)
  } finally {
    loading.value = false
  }
}

const filteredComments = computed(() => {
  if (filterStatus.value === 'all') return comments.value
  return comments.value.filter(c => c.status === filterStatus.value)
})

const updateStatus = async (id, status) => {
  try {
    await $axios.put(`/admin/web-communications/comments/${id}/status`, { status })
    fetchComments()
  } catch (error) {
    console.error('Erreur mise à jour statut', error)
  }
}

const deleteComment = async (id) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) return
  try {
    await $axios.delete(`/admin/web-communications/comments/${id}`)
    fetchComments()
  } catch (error) {
    console.error('Erreur suppression', error)
  }
}

onMounted(() => {
  fetchComments()
})
</script>
