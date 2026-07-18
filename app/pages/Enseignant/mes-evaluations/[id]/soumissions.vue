<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-6xl mx-auto">
      
      <!-- Titre -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">
          Soumissions des étudiants
        </h1>
        <p class="text-gray-600 mt-1">
          Liste des réponses soumises pour cette évaluation
        </p>
      </div>

      <!-- Barre de recherche -->
      <div class="bg-white p-4 rounded-lg shadow mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Rechercher par nom ou matricule"
          class="w-full sm:w-1/2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <span class="text-sm text-gray-600">
          {{ filteredSubmissions.length }} soumission(s)
        </span>
      </div>

      <!-- Chargement -->
      <div v-if="loading" class="text-center py-10">
        <p class="text-gray-600">Chargement des soumissions...</p>
      </div>

      <!-- Aucun résultat -->
      <div
        v-else-if="filteredSubmissions.length === 0"
        class="bg-white p-6 rounded-lg shadow text-center text-gray-600"
      >
        Aucune soumission trouvée
      </div>

      <!-- Tableau -->
      <div v-else class="bg-white rounded-lg shadow overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-200 text-gray-700">
            <tr>
              <th class="px-4 py-3">Étudiant</th>
              <th class="px-4 py-3">Matricule</th>
              <th class="px-4 py-3">Date</th>
              <th class="px-4 py-3">Note</th>
              <th class="px-4 py-3">Statut</th>
              <th class="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="submission in paginatedSubmissions"
              :key="submission.id"
              class="border-t hover:bg-gray-50"
            >
              <td class="px-4 py-3 font-medium text-gray-800">
                {{ submission.student_name }}
              </td>

              <td class="px-4 py-3 text-gray-600">
                {{ submission.matricule }}
              </td>

              <td class="px-4 py-3 text-gray-600">
                {{ formatDate(submission.submitted_at) }}
              </td>

              <td class="px-4 py-3">
                <span v-if="submission.score !== null">
                  {{ submission.score }}/{{ submission.total_points }}
                </span>
                <span v-else class="text-gray-500">Non noté</span>
              </td>

              <td class="px-4 py-3">
                <span
                  class="px-2 py-1 rounded text-xs"
                  :class="statusClass(submission.status)"
                >
                  {{ statusLabel(submission.status) }}
                </span>
              </td>

              <td class="px-4 py-3 text-center space-x-2">
                <button
                  @click="viewSubmission(submission)"
                  class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Voir
                </button>

                <button
                  v-if="!submission.corrected"
                  @click="correctSubmission(submission.id)"
                  class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Corriger
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex justify-between items-center mt-6"
      >
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 border rounded disabled:opacity-50"
        >
          Précédent
        </button>

        <span class="text-sm text-gray-600">
          Page {{ currentPage }} / {{ totalPages }}
        </span>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border rounded disabled:opacity-50"
        >
          Suivant
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const loading = ref(false)
const searchTerm = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

const submissions = ref([
  {
    id: 1,
    student_name: 'John Doe',
    matricule: 'ETU001',
    submitted_at: '2026-01-05T10:30:00',
    score: 15,
    total_points: 20,
    status: 'corrige',
    corrected: true
  },
  {
    id: 2,
    student_name: 'Jane Smith',
    matricule: 'ETU002',
    submitted_at: '2026-01-05T11:00:00',
    score: null,
    total_points: 20,
    status: 'soumis',
    corrected: false
  }
])

const filteredSubmissions = computed(() => {
  if (!searchTerm.value) return submissions.value
  return submissions.value.filter(s =>
    s.student_name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    s.matricule.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const totalPages = computed(() =>
  Math.ceil(filteredSubmissions.value.length / itemsPerPage)
)

const paginatedSubmissions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredSubmissions.value.slice(start, start + itemsPerPage)
})

const formatDate = (date) =>
  new Date(date).toLocaleDateString('fr-FR')

const statusLabel = (status) => {
  if (status === 'corrige') return 'Corrigé'
  if (status === 'soumis') return 'Soumis'
  return status
}

const statusClass = (status) => {
  if (status === 'corrige') return 'bg-green-100 text-green-700'
  if (status === 'soumis') return 'bg-blue-100 text-blue-700'
  return 'bg-gray-100 text-gray-700'
}

const viewSubmission = (submission) => {
  console.log('Voir soumission', submission)
}

const correctSubmission = (id) => {
  console.log('Corriger soumission', id)
}

const prevPage = () => currentPage.value--
const nextPage = () => currentPage.value++

onMounted(() => {
  loading.value = false
})
</script>
