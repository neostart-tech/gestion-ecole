<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- En-tête de la page -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Liste des salles</h1>
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600">
          <span class="font-medium">Administration</span> &gt; 
          <span class="font-medium">Salles</span> &gt; 
          <span>Liste</span>
        </div>
        
        <!-- Bouton Ajouter une salle -->
        <button 
          @click="openAddModal" 
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          Ajouter une salle
        </button>
      </div>
    </div>

    <!-- Contrôles d'affichage -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <span class="text-gray-600">Afficher</span>
        <select v-model="itemsPerPage" class="border border-gray-300 rounded px-3 py-1">
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="200">200</option>
        </select>
        <span class="text-gray-600">éléments</span>
      </div>
    </div>

    <!-- Tableau des salles -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NOM</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NOMBRE DE PLACE</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="salle in displayedSalles" :key="salle.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ salle.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ salle.nom }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ salle.nombrePlace }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div class="flex items-center gap-3">
                <!-- Bouton Modifier -->
                <button 
                  @click="openEditModal(salle)" 
                  class="text-green-600 hover:text-green-800"
                  title="Modifier"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                
                <!-- Bouton Planifications (Calendrier) -->
                <button 
                  @click="openCalendar(salle)" 
                  class="text-gray-600 hover:text-gray-800"
                  title="Planifications"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                  </svg>
                </button>
                
                <!-- Bouton Supprimer -->
                <button 
                  @click="openDeleteModal(salle)" 
                  class="text-red-600 hover:text-red-800"
                  title="Supprimer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4 text-sm text-gray-600">
      <p>Affichage de {{ startIndex + 1 }} à {{ endIndex }} sur {{ salles.length }} éléments</p>
    </div>

    <!-- Modal d'ajout/modification -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="px-6 py-4 border-b">
          <h3 class="text-lg font-medium text-gray-900">{{ modalTitle }}</h3>
        </div>
        
        <form @submit.prevent="saveSalle" class="px-6 py-4">
          <div class="space-y-4">
            <div>
              <label for="nom" class="block text-sm font-medium text-gray-700 mb-1">
                Nom de la salle <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nom"
                v-model="form.nom"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                placeholder="Nom de la salle"
                required
              />
            </div>
            
            <div>
              <label for="effectif" class="block text-sm font-medium text-gray-700 mb-1">
                Nombre de place <span class="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="effectif"
                v-model="form.effectif"
                min="0"
                step="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre de place"
                required
              />
            </div>
          </div>
          
          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="px-6 py-4 border-b">
          <h3 class="text-lg font-medium text-gray-900">Suppression</h3>
        </div>
        
        <div class="px-6 py-4">
          <p class="text-gray-600 mb-4">
            Voulez-vous vraiment supprimer la salle "{{ selectedSalle?.nom }}" ? 
            Veuillez noter que cette action est irréversible. Continuer ?
          </p>
          
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="closeDeleteModal"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Retour
            </button>
            <button
              @click="deleteSalle"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Continuer la suppression
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Données des salles (à remplacer par votre API)
const salles = ref([
  { id: 1, nom: 'SALLE A', nombrePlace: 30 },
  { id: 2, nom: 'SALLE AMPH', nombrePlace: 65 },
  { id: 3, nom: 'SALLE B', nombrePlace: 30 },
  { id: 4, nom: 'SALLE C', nombrePlace: 20 },
  { id: 5, nom: 'SALLE DE TEST', nombrePlace: 30 },
  { id: 6, nom: 'SALLE MTWI', nombrePlace: 30 },
  { id: 7, nom: 'SALLE TP', nombrePlace: 0 },
  { id: 8, nom: 'SALLE TP 1', nombrePlace: 30 },
  { id: 9, nom: 'SALLE TP 2', nombrePlace: 30 },
  { id: 10, nom: 'TEST', nombrePlace: 0 }
])

// État de la modale
const showModal = ref(false)
const showDeleteModal = ref(false)
const modalTitle = ref('')
const selectedSalle = ref(null)

// Formulaire
const form = ref({
  nom: '',
  effectif: ''
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(50)

// Calcul des salles à afficher
const displayedSalles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return salles.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, salles.value.length))

// Fonctions pour ouvrir les modales
const openAddModal = () => {
  modalTitle.value = "Formulaire de création d'une salle"
  form.value = { nom: '', effectif: '' }
  showModal.value = true
}

const openEditModal = (salle) => {
  modalTitle.value = "Formulaire de modification d'une salle"
  form.value = { 
    id: salle.id,
    nom: salle.nom, 
    effectif: salle.nombrePlace 
  }
  showModal.value = true
}

const openDeleteModal = (salle) => {
  selectedSalle.value = salle
  showDeleteModal.value = true
}

const openCalendar = (salle) => {
  // Redirection vers la page calendrier
  // navigateTo(`/admin/salles/calendar/${salle.id}`)
  console.log(`Ouvrir calendrier pour ${salle.nom}`)
}

// Fermer les modales
const closeModal = () => {
  showModal.value = false
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedSalle.value = null
}

// Sauvegarder une salle
const saveSalle = () => {
  if (form.value.id) {
    // Mise à jour
    const index = salles.value.findIndex(s => s.id === form.value.id)
    if (index !== -1) {
      salles.value[index] = {
        ...salles.value[index],
        nom: form.value.nom,
        nombrePlace: parseInt(form.value.effectif)
      }
    }
  } else {
    // Création
    const newSalle = {
      id: salles.value.length + 1,
      nom: form.value.nom,
      nombrePlace: parseInt(form.value.effectif)
    }
    salles.value.push(newSalle)
  }
  
  closeModal()
}

// Supprimer une salle
const deleteSalle = () => {
  if (selectedSalle.value) {
    const index = salles.value.findIndex(s => s.id === selectedSalle.value.id)
    if (index !== -1) {
      salles.value.splice(index, 1)
    }
    closeDeleteModal()
  }
}


</script>

<style scoped>
/* Styles spécifiques supplémentaires si nécessaire */
</style>