 <template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- Main content seulement -->
    <main class="p-4 md:p-6">
      <!-- Page Header -->
      <div class="mb-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Liste des cours</h1>
            <nav class="flex mt-2" aria-label="Breadcrumb">
              <ol class="inline-flex items-center space-x-1 md:space-x-3">
                <li class="inline-flex items-center">
                  <span class="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-400">
                    Liste des cours
                  </span>
                </li>
                <li aria-current="page">
                  <div class="flex items-center">
                    <svg class="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <span class="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:ml-2">Mes cours</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
         
          <!-- Bouton pour retour à l'accueil ou actions -->
          <div class="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              @click="refreshData"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser
            </button>
          </div>
        </div>
      </div>

      <!-- Card de la liste des cours -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Liste de mes cours</h2>
        </div>
        <div class="p-6">
          <!-- Tableau -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr class="bg-gray-50 dark:bg-gray-700">
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">#</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Matière</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Salle</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Jour</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Heure</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(cours, index) in coursList" :key="cours.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{{ index + 1 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{{ cours.matiere }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{{ cours.salle }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{{ cours.jour }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{{ cours.heure }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <button
                      @click="voirPresence(cours.id)"
                      class="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Voir présence
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Message si pas de cours -->
          <div v-if="coursList.length === 0" class="text-center py-8">
            <div class="inline-flex flex-col items-center justify-center space-y-3">
              <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p class="text-gray-500 dark:text-gray-400">Aucun cours disponible</p>
              <button
                @click="fetchCours"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualiser la liste
              </button>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Données
const coursList = ref([])
const totalHeures = ref(12)
const coursAujourdhui = ref(2)
const totalEtudiants = ref(45)

// Fonctions
const fetchCours = async () => {
  // Simuler une requête API
  coursList.value = []
 
  setTimeout(() => {
    coursList.value = [
      {
        id: 1,
        matiere: 'Mathématiques',
        salle: 'Salle 101',
        jour: 'Lundi 29 Décembre 2025',
        heure: '08:00 - 10:00',
        professeur: 'Prof. Dupont',
        niveau: 'L1',
        effectif: 30
      },
      {
        id: 2,
        matiere: 'Physique',
        salle: 'Salle 102',
        jour: 'Lundi 29 Décembre 2025',
        heure: '10:30 - 12:30',
        professeur: 'Prof. Martin',
        niveau: 'L2',
        effectif: 25
      },
      {
        id: 3,
        matiere: 'Informatique',
        salle: 'Salle 103',
        jour: 'Mardi 30 Décembre 2025',
        heure: '08:00 - 10:00',
        professeur: 'Prof. Dubois',
        niveau: 'L1',
        effectif: 35
      },
      {
        id: 4,
        matiere: 'Chimie',
        salle: 'Salle 104',
        jour: 'Mercredi 31 Décembre 2025',
        heure: '14:00 - 16:00',
        professeur: 'Prof. Lambert',
        niveau: 'L3',
        effectif: 20
      },
      {
        id: 5,
        matiere: 'Biologie',
        salle: 'Salle 105',
        jour: 'Jeudi 1 Janvier 2026',
        heure: '09:00 - 11:00',
        professeur: 'Prof. Rousseau',
        niveau: 'L2',
        effectif: 28
      }
    ]
  }, 500)
}

const refreshData = () => {
  fetchCours()
  totalHeures.value = Math.floor(Math.random() * 10) + 8
  coursAujourdhui.value = Math.floor(Math.random() * 3) + 1
}

const voirPresence = (coursId) => {
  // Rediriger vers la page de présence avec l'ID du cours
  router.push({ 
    name: 'VoirPresence', 
    params: { id: coursId },
    query: { cours: JSON.stringify(coursList.value.find(c => c.id === coursId)) }
  })
}

// Cycle de vie
onMounted(() => {
  fetchCours()
})
</script>

<style scoped>
/* Styles pour la table responsive */
@media (max-width: 768px) {
  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}

/* Animation pour les transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Styles pour les cartes de stats */
.stat-card {
  transition: transform 0.2s ease-in-out;
}

.stat-card:hover {
  transform: translateY(-2px);
}

/* Loader animation pour le chargement */
.loader {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>