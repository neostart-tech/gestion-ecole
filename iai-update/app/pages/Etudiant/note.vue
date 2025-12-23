<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loader -->
    <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
      <div class="w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div class="h-full bg-blue-600 animate-loader"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col">
      <!-- Main Content Area -->
      <main class="flex-1 p-4 md:p-6">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span>Notes</span>
          <span>/</span>
          <span class="text-gray-900 dark:text-white font-medium">Mes notes</span>
        </div>

        <!-- Page Header -->
        <div class="mb-6">
          <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
            Mes notes
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            Consultez vos notes et faites des réclamations si nécessaire
          </p>
        </div>

        <!-- Tableau des notes -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th>#</th>
                  <th>UE</th>
                  <th>UV</th>
                  <th>Type</th>
                  <th>Note</th>
                  <th>Réclamer</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(note, index) in notes" :key="note.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ note.ue }}</td>
                  <td>{{ note.uv }}</td>
                  <td>{{ note.type }}</td>
                  <td :class="getNoteClass(note.note)">
                    {{ note.note }}/20
                  </td>
                  <td>
                    <button
                        @click="openReclamationModal(note.id)"
                        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Réclamer
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="notes.length === 0" class="text-center py-12 text-gray-500">
            Aucune note disponible pour le moment.
          </div>
        </div>

        <!-- Informations -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
            <h3 class="font-medium mb-2">Comment réclamer une note ?</h3>
            <p class="text-sm">
              Cliquez sur “Réclamer” et fournissez un motif.
            </p>
          </div>
          <div class="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
            <h3 class="font-medium mb-2">Délai</h3>
            <p class="text-sm">
              7 jours après publication des notes.
            </p>
          </div>
          <div class="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4">
            <h3 class="font-medium mb-2">Statut</h3>
            <p class="text-sm">
              Suivez vos réclamations dans votre espace étudiant.
            </p>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8">
        <div class="px-4 py-4 text-center text-sm text-gray-500">
          © Neo Start Technology
        </div>
      </footer>
    </div>

    <!-- Modal Réclamation (inchangé) -->
    <div v-if="showReclamationModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
        <h3 class="text-lg font-semibold mb-4">Réclamation de note</h3>

        <textarea
          v-model="reclamationForm.motif"
          rows="4"
          class="w-full border rounded p-2 mb-4"
          placeholder="Expliquez votre réclamation..."
        />

        <div class="flex justify-end gap-3">
          <button @click="closeReclamationModal" class="px-4 py-2 border rounded">
            Annuler
          </button>
          <button
            @click="submitReclamation"
            class="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// États
const loading = ref(false)
const isDark = ref(false)
const sidebarCollapsed = ref(false)
const showReclamationModal = ref(false)
const showNotifications = ref(false)
const showProfileMenu = ref(false)
const selectedNoteId = ref(null)
const submitting = ref(false)

// Données des notes
const notes = ref([
  {
    id: 110,
    ue: 'Algorithme et Programmation',
    uv: 'Algo Fichier',
    type: 'Examen',
    note: 20
  }
])

// Formulaire de réclamation
const reclamationForm = ref({
  motif: '',
  justificatif: null
})

// Fonctions
const getNoteClass = (note) => {
  if (note >= 16) return 'text-green-600 dark:text-green-400'
  if (note >= 12) return 'text-blue-600 dark:text-blue-400'
  if (note >= 10) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

const openReclamationModal = (noteId) => {
  selectedNoteId.value = noteId
  reclamationForm.value = { motif: '', justificatif: null }
  showReclamationModal.value = true
}

const closeReclamationModal = () => {
  showReclamationModal.value = false
  selectedNoteId.value = null
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    reclamationForm.value.justificatif = file
  }
}

const submitReclamation = async () => {
  if (!reclamationForm.value.motif.trim()) {
    alert('Veuillez saisir un motif pour votre réclamation.')
    return
  }

  submitting.value = true
  
  try {
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Réinitialiser le formulaire
    reclamationForm.value = { motif: '', justificatif: null }
    
    // Fermer le modal
    closeReclamationModal()
    
    // Afficher un message de succès
    alert('Votre réclamation a été envoyée avec succès !')
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la réclamation:', error)
    alert('Une erreur est survenue lors de l\'envoi de votre réclamation.')
  } finally {
    submitting.value = false
  }
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const logout = () => {
  if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
    // Ici, vous implémenteriez la logique de déconnexion
    window.location.href = '/login'
  }
}

// Fermer les dropdowns quand on clique ailleurs
const closeDropdowns = (event) => {
  if (!event.target.closest('.relative')) {
    showNotifications.value = false
    showProfileMenu.value = false
  }
}

// Initialisation
onMounted(() => {
  // Simulation de chargement
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)

  // Écouter les clics pour fermer les dropdowns
  document.addEventListener('click', closeDropdowns)

  // Vérifier le thème système
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})
</script>

<style scoped>
.animate-loader {
  animation: loader 2s ease-in-out infinite;
}

@keyframes loader {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Styles pour les tableaux */
table {
  border-collapse: collapse;
  width: 100%;
}

th {
  padding: 12px 16px;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

td {
  padding: 16px;
  white-space: nowrap;
  font-size: 0.875rem;
  border-bottom: 1px solid #e5e7eb;
}

tr:hover {
  background-color: #f9fafb;
}

/* Dark mode styles */
.dark th {
  background-color: #374151;
  border-color: #4b5563;
}

.dark td {
  border-color: #4b5563;
}

.dark tr:hover {
  background-color: #374151;
}
</style>