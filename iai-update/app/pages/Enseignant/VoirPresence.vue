<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- En-tête -->
    <div class="p-4 md:p-6">
      <!-- Navigation retour -->
      <div class="mb-6">
        <button
          @click="$router.back()"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour
        </button>
      </div>

      <!-- Détails du cours -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Fiche de présence</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Détails du cours et liste des étudiants</p>
        </div>
        
        <div class="p-6">
          <!-- Informations du cours -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Matière</p>
              <p class="text-lg font-semibold text-gray-800 dark:text-white">{{ coursDetails.matiere }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Salle</p>
              <p class="text-lg font-semibold text-gray-800 dark:text-white">{{ coursDetails.salle }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Date & Heure</p>
              <p class="text-lg font-semibold text-gray-800 dark:text-white">{{ coursDetails.jour }} • {{ coursDetails.heure }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Effectif total</p>
              <p class="text-lg font-semibold text-gray-800 dark:text-white">{{ coursDetails.effectif }} étudiants</p>
            </div>
          </div>

          <!-- Statistiques de présence -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-green-600 dark:text-green-400">Présents</p>
                  <p class="text-3xl font-bold text-gray-800 dark:text-white mt-2">{{ etudiantsPresents.length }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ ((etudiantsPresents.length / etudiantsList.length) * 100).toFixed(1) }}%</p>
                </div>
                <div class="bg-green-100 dark:bg-green-800/30 rounded-full p-3">
                  <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-red-600 dark:text-red-400">Absents</p>
                  <p class="text-3xl font-bold text-gray-800 dark:text-white mt-2">{{ etudiantsAbsents.length }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ ((etudiantsAbsents.length / etudiantsList.length) * 100).toFixed(1) }}%</p>
                </div>
                <div class="bg-red-100 dark:bg-red-800/30 rounded-full p-3">
                  <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-blue-600 dark:text-blue-400">Taux de présence</p>
                  <p class="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                    {{ ((etudiantsPresents.length / etudiantsList.length) * 100).toFixed(1) }}%
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Total: {{ etudiantsList.length }} étudiants</p>
                </div>
                <div class="bg-blue-100 dark:bg-blue-800/30 rounded-full p-3">
                  <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Onglets Présents/Absents -->
          <div class="mb-6">
            <div class="border-b border-gray-200 dark:border-gray-700">
              <nav class="-mb-px flex space-x-8">
                <button
                  @click="activeTab = 'presents'"
                  :class="[ activeTab === 'presents' ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm' ]"
                >
                  Présents ({{ etudiantsPresents.length }})
                </button>
                <button
                  @click="activeTab = 'absents'"
                  :class="[ activeTab === 'absents' ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm' ]"
                >
                  Absents ({{ etudiantsAbsents.length }})
                </button>
                <button
                  @click="activeTab = 'tous'"
                  :class="[ activeTab === 'tous' ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm' ]"
                >
                  Tous les étudiants ({{ etudiantsList.length }})
                </button>
              </nav>
            </div>
          </div>

          <!-- Liste des étudiants -->
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">#</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Étudiant</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Matricule</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Groupe</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Statut</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="etudiant in filteredEtudiants" :key="etudiant.id"
                      :class="{ 'bg-green-50 dark:bg-green-900/10': etudiant.present, 'bg-red-50 dark:bg-red-900/10': !etudiant.present }">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{{ etudiant.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ etudiant.nom }} {{ etudiant.prenom }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{{ etudiant.matricule }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {{ etudiant.groupe }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      <span 
                        @click="togglePresence(etudiant)"
                        class="cursor-pointer px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="etudiant.present ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'"
                      >
                        {{ etudiant.present ? 'Présent' : 'Absent' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Aucun étudiant -->
            <div v-if="filteredEtudiants.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 3.75l-5.5 5.5-2.5-2.5" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun étudiant</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Aucun étudiant trouvé pour ce filtre.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeTab = ref('tous')

const coursDetails = ref({
  id: 0,
  matiere: '',
  salle: '',
  jour: '',
  heure: '',
  effectif: 0
})

const etudiantsList = ref([
  { id: 1, nom: 'Dupont', prenom: 'Jean', matricule: 'ETU001', groupe: 'A', present: true },
  { id: 2, nom: 'Martin', prenom: 'Marie', matricule: 'ETU002', groupe: 'B', present: true },
  { id: 3, nom: 'Bernard', prenom: 'Pierre', matricule: 'ETU003', groupe: 'A', present: false },
  { id: 4, nom: 'Dubois', prenom: 'Sophie', matricule: 'ETU004', groupe: 'B', present: true },
  { id: 5, nom: 'Leroy', prenom: 'Thomas', matricule: 'ETU005', groupe: 'A', present: true },
  { id: 6, nom: 'Moreau', prenom: 'Julie', matricule: 'ETU006', groupe: 'B', present: false },
  { id: 7, nom: 'Petit', prenom: 'Lucas', matricule: 'ETU007', groupe: 'A', present: true },
  { id: 8, nom: 'Roux', prenom: 'Emma', matricule: 'ETU008', groupe: 'B', present: true },
])

const etudiantsPresents = computed(() => etudiantsList.value.filter(e => e.present))
const etudiantsAbsents = computed(() => etudiantsList.value.filter(e => !e.present))
const filteredEtudiants = computed(() => {
  if (activeTab.value === 'presents') return etudiantsPresents.value
  if (activeTab.value === 'absents') return etudiantsAbsents.value
  return etudiantsList.value
})

const lastUpdated = computed(() => new Date().toLocaleString('fr-FR'))

// 🔥 Fonction pour basculer le statut
const togglePresence = (etudiant) => {
  etudiant.present = !etudiant.present
}

onMounted(() => {
  const coursId = route.params.id
  const coursData = route.query.cours ? JSON.parse(route.query.cours) : null
  if (coursData) {
    coursDetails.value = coursData
  } else {
    coursDetails.value = {
      id: coursId,
      matiere: 'Matière inconnue',
      salle: 'Salle inconnue',
      jour: 'Date inconnue',
      heure: 'Heure inconnue',
      effectif: etudiantsList.value.length
    }
  }
})
</script>
