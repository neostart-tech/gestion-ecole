<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <NuxtLink to="/" class="cursor-pointer hover:text-indigo-600 transition-colors">Accueil</NuxtLink>
      <span>/</span>
      <NuxtLink to="/evaluations" class="cursor-pointer hover:text-indigo-600 transition-colors">Administration</NuxtLink>
      <span>/</span>
      <NuxtLink to="/evaluations" class="cursor-pointer hover:text-indigo-600 transition-colors">Évaluations</NuxtLink>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Ajouter une évaluation</span>
    </div>

    <!-- Titre -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-900">Ajouter une évaluation</h1>
      <NuxtLink 
        to="/evaluations" 
        class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour à la liste
      </NuxtLink>
    </div>

    <!-- Formulaire -->
    <div class="max-w-3xl mx-auto">
      <div class="bg-white rounded-xl shadow-sm p-6 md:p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          
          <!-- Niveau -->
          <div>
            <label for="niveau" class="block text-sm font-medium text-gray-700 mb-2">
              Niveau <span class="text-rose-500">*</span>
            </label>
            <select
              id="niveau"
              v-model="formData.niveau"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
            >
              <option value="">-- Optionnel --</option>
              <option value="L1">Licence 1</option>
              <option value="L2">Licence 2</option>
              <option value="L3">Licence 3</option>
              <option value="M1">Master 1</option>
              <option value="M2">Master 2</option>
            </select>
          </div>

          <!-- Semestre -->
          <div>
            <label for="semestre" class="block text-sm font-medium text-gray-700 mb-2">
              Semestre <span class="text-rose-500">*</span>
            </label>
            <select
              id="semestre"
              v-model="formData.semestre"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
            >
              <option value="Semestre 1">Semestre 1</option>
              <option value="Semestre 2">Semestre 2</option>
              <option value="Semestre 3">Semestre 3</option>
              <option value="Semestre 4">Semestre 4</option>
              <option value="Semestre 5">Semestre 5</option>
              <option value="Semestre 6">Semestre 6</option>
            </select>
          </div>

          <!-- Type -->
          <div>
            <label for="type" class="block text-sm font-medium text-gray-700 mb-2">
              Type <span class="text-rose-500">*</span>
            </label>
            <select
              id="type"
              v-model="formData.type"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              @change="verifyEvaluationLimit"
            >
              <option value="Devoir">Devoir</option>
              <option value="Examen">Examen</option>
              <option value="Quiz">Quiz</option>
              <option value="Projet">Projet</option>
              <option value="TP">TP</option>
            </select>
            <div v-if="limitWarning" class="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-amber-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-amber-800">
                    Limite : maximum 2 évaluations par type par matière
                  </p>
                  <p v-if="existingEvaluationsCount > 0" class="text-xs text-amber-700 mt-1">
                    Cette matière a déjà {{ existingEvaluationsCount }} évaluation(s) de type "{{ formData.type }}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Groupe -->
          <div>
            <label for="groupe" class="block text-sm font-medium text-gray-700 mb-2">
              Groupe <span class="text-rose-500">*</span>
            </label>
            <select
              id="groupe"
              v-model="formData.groupe"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              @change="updateAvailableMatieres"
            >
              <option value="">Sélectionner un groupe</option>
              <option v-for="groupe in groupesList" :key="groupe.id" :value="groupe.id">
                {{ groupe.nom }} - {{ groupe.filiere }}
              </option>
            </select>
          </div>

          <!-- Matières -->
          <div>
            <label for="matiere" class="block text-sm font-medium text-gray-700 mb-2">
              Matières <span class="text-rose-500">*</span>
            </label>
            <select
              id="matiere"
              v-model="formData.matiere"
              required
              :disabled="!formData.groupe"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              @change="verifyEvaluationLimit"
            >
              <option value="">Choisissez un groupe pour en afficher les matières</option>
              <option v-for="matiere in filteredMatieres" :key="matiere.id" :value="matiere.id">
                {{ matiere.nom }} ({{ matiere.code }})
              </option>
            </select>
            <p v-if="!formData.groupe" class="mt-1 text-sm text-gray-500">
              Sélectionnez d'abord un groupe pour voir les matières disponibles
            </p>
          </div>

          <!-- Salle -->
          <div>
            <label for="salle" class="block text-sm font-medium text-gray-700 mb-2">
              Salle <span class="text-rose-500">*</span>
            </label>
            <select
              id="salle"
              v-model="formData.salle"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
            >
              <option value="">Sélectionner une salle</option>
              <option v-for="salle in sallesList" :key="salle.id" :value="salle.id">
                {{ salle.nom }} ({{ salle.nombrePlace }} places)
              </option>
            </select>
          </div>

          <!-- Date et Heures -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Date de l'évaluation -->
            <div>
              <label for="date" class="block text-sm font-medium text-gray-700 mb-2">
                Date de l'évaluation <span class="text-rose-500">*</span>
              </label>
              <input
                id="date"
                v-model="formData.date"
                type="date"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <!-- Heure de début -->
            <div>
              <label for="heureDebut" class="block text-sm font-medium text-gray-700 mb-2">
                Heure de début <span class="text-rose-500">*</span>
              </label>
              <input
                id="heureDebut"
                v-model="formData.heureDebut"
                type="time"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <!-- Heure de Fin -->
            <div>
              <label for="heureFin" class="block text-sm font-medium text-gray-700 mb-2">
                Heure de Fin <span class="text-rose-500">*</span>
              </label>
              <input
                id="heureFin"
                v-model="formData.heureFin"
                type="time"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <!-- Date de remise des corrections -->
          <div>
            <label for="dateRemise" class="block text-sm font-medium text-gray-700 mb-2">
              Date de remise des corrections
            </label>
            <input
              id="dateRemise"
              v-model="formData.dateRemise"
              type="date"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <!-- Coefficient -->
          <div>
            <label for="coefficient" class="block text-sm font-medium text-gray-700 mb-2">
              Coefficient
            </label>
            <input
              id="coefficient"
              v-model="formData.coefficient"
              type="number"
              min="0"
              step="0.5"
              max="5"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Ex: 2.0"
            />
            <p class="mt-1 text-sm text-gray-500">Valeur entre 0 et 5 (ex: 2.0, 1.5)</p>
          </div>

          <!-- Instructions -->
          <div>
            <label for="instructions" class="block text-sm font-medium text-gray-700 mb-2">
              Instructions pour les étudiants
            </label>
            <textarea
              id="instructions"
              v-model="formData.instructions"
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              placeholder="Instructions détaillées pour l'évaluation..."
            ></textarea>
          </div>

          <!-- Fichiers joints -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fichiers joints (optionnel)
            </label>
            <div 
              @dragover.prevent="isDragOver = true"
              @dragleave="isDragOver = false"
              @drop.prevent="handleFileDrop"
              :class="[
                'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all',
                isDragOver 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-300 hover:border-gray-400'
              ]"
              @click="openFileSelector"
            >
              <input
                ref="fileInputRef"
                type="file"
                multiple
                class="hidden"
                @change="handleFileSelection"
              />
              
              <div class="space-y-3">
                <div class="flex justify-center">
                  <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-700">
                    Cliquez pour sélectionner ou glissez-déposez des fichiers
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    PDF, DOC, DOCX, images (max 10MB par fichier)
                  </p>
                </div>
                
                <!-- Liste des fichiers -->
                <div v-if="formData.fichiers.length > 0" class="mt-4 space-y-2">
                  <div v-for="(fichier, index) in formData.fichiers" :key="index" class="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div class="flex items-center">
                      <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span class="text-sm text-gray-700 truncate">{{ fichier.name }}</span>
                    </div>
                    <button
                      type="button"
                      @click.stop="removeFile(index)"
                      class="text-rose-500 hover:text-rose-700"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Publication -->
          <div class="pt-6 border-t border-gray-200">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="publier"
                  v-model="formData.publier"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                />
              </div>
              <div class="ml-3">
                <label for="publier" class="text-sm font-medium text-gray-700">
                  Publier la programmation auprès des étudiants concernés ?
                </label>
                <p class="text-sm text-gray-500 mt-1">
                  Si coché, l'évaluation sera visible par les étudiants du groupe sélectionné
                </p>
              </div>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <NuxtLink
              to="/evaluations"
              class="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </NuxtLink>
            <button
              type="submit"
              :disabled="isLoading || (limitWarning && existingEvaluationsCount >= 2)"
              class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="flex items-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </span>
              <span v-else>
                Ajouter évaluation
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fileInputRef = ref(null)
const isDragOver = ref(false)
const isLoading = ref(false)
const limitWarning = ref(false)
const existingEvaluationsCount = ref(0)

// Données du formulaire
const formData = reactive({
  niveau: '',
  semestre: 'Semestre 1',
  type: 'Devoir',
  groupe: '',
  matiere: '',
  salle: '',
  date: new Date().toISOString().split('T')[0],
  heureDebut: '12:00',
  heureFin: '14:00',
  dateRemise: '',
  coefficient: '',
  instructions: '',
  fichiers: [],
  publier: true
})

// Données de test
const groupesList = ref([
  { id: 1, nom: 'GROUPE A', filiere: 'GLSI' },
  { id: 2, nom: 'GROUPE B', filiere: 'GLSI' },
  { id: 3, nom: 'GROUPE C', filiere: 'ASR' },
  { id: 4, nom: 'GROUPE D', filiere: 'MTWI' },
  { id: 5, nom: 'GROUPE E', filiere: 'TC_1' }
])

const matieresList = ref([
  { id: 1, nom: 'Algorithmique Avancée', code: 'ALG-301', filiereId: 1 },
  { id: 2, nom: 'Base de Données', code: 'BD-302', filiereId: 1 },
  { id: 3, nom: 'Programmation Web', code: 'WEB-303', filiereId: 1 },
  { id: 4, nom: 'Réseaux Informatiques', code: 'RES-401', filiereId: 3 },
  { id: 5, nom: 'Systèmes d\'Exploitation', code: 'SE-402', filiereId: 3 },
  { id: 6, nom: 'Mathématiques Appliquées', code: 'MATH-101', filiereId: 5 },
  { id: 7, nom: 'Physique Fondamentale', code: 'PHY-102', filiereId: 5 }
])

const sallesList = ref([
  { id: 1, nom: 'SALLE A', nombrePlace: 30 },
  { id: 2, nom: 'SALLE B', nombrePlace: 25 },
  { id: 3, nom: 'SALLE C', nombrePlace: 20 },
  { id: 4, nom: 'SALLE AMPH', nombrePlace: 65 },
  { id: 5, nom: 'SALLE TP 1', nombrePlace: 30 }
])

// Matières filtrées par groupe
const filteredMatieres = computed(() => {
  if (!formData.groupe) return []
  const selectedGroupe = groupesList.value.find(g => g.id == formData.groupe)
  if (!selectedGroupe) return []
  
  return matieresList.value.filter(matiereItem => {
    return matiereItem.filiereId == selectedGroupe.id
  })
})

// Mettre à jour les matières quand le groupe change
const updateAvailableMatieres = () => {
  formData.matiere = ''
  verifyEvaluationLimit()
}

// Vérifier la limite d'évaluations
const verifyEvaluationLimit = () => {
  if (!formData.matiere || !formData.type) {
    limitWarning.value = false
    return
  }
  
  // Charger les évaluations existantes
  let existingEvaluations = []
  if (process.client) {
    const storedData = localStorage.getItem('evaluations')
    if (storedData) {
      existingEvaluations = JSON.parse(storedData)
    }
  }
  
  // Compter les évaluations existantes pour cette matière et type
  const count = existingEvaluations.filter(item => 
    item.matiereId == formData.matiere && item.type === formData.type
  ).length
  
  existingEvaluationsCount.value = count
  limitWarning.value = count >= 2
}

// Gestion des fichiers
const openFileSelector = () => {
  fileInputRef.value.click()
}

const handleFileSelection = (event) => {
  const selectedFiles = Array.from(event.target.files)
  selectedFiles.forEach(file => {
    if (file.size > 10 * 1024 * 1024) {
      alert(`Le fichier ${file.name} est trop volumineux (max 10MB)`)
      return
    }
    formData.fichiers.push(file)
  })
}

const handleFileDrop = (event) => {
  isDragOver.value = false
  const droppedFiles = Array.from(event.dataTransfer.files)
  droppedFiles.forEach(file => {
    if (file.size > 10 * 1024 * 1024) {
      alert(`Le fichier ${file.name} est trop volumineux (max 10MB)`)
      return
    }
    formData.fichiers.push(file)
  })
}

const removeFile = (index) => {
  formData.fichiers.splice(index, 1)
}

// Soumettre le formulaire
const handleSubmit = async () => {
  // Validation des champs obligatoires
  if (!formData.niveau || !formData.semestre || !formData.type || !formData.groupe || !formData.matiere || !formData.salle || !formData.date || !formData.heureDebut || !formData.heureFin) {
    alert('Veuillez remplir tous les champs obligatoires (*)')
    return
  }

  // Vérifier la limite d'évaluations
  if (existingEvaluationsCount.value >= 2) {
    alert('Limite atteinte : maximum 2 évaluations par type par matière')
    return
  }

  // Vérifier que l'heure de fin est après l'heure de début
  if (formData.heureFin <= formData.heureDebut) {
    alert('L\'heure de fin doit être après l\'heure de début')
    return
  }

  isLoading.value = true

  try {
    // Récupérer les informations sélectionnées
    const selectedGroupe = groupesList.value.find(g => g.id == formData.groupe)
    const selectedMatiere = matieresList.value.find(m => m.id == formData.matiere)
    const selectedSalle = sallesList.value.find(s => s.id == formData.salle)

    // Charger les évaluations existantes
    let currentEvaluations = []
    if (process.client) {
      const storedData = localStorage.getItem('evaluations')
      if (storedData) {
        currentEvaluations = JSON.parse(storedData)
      }
    }

    // Générer un nouvel ID
    const newId = currentEvaluations.length > 0 
      ? Math.max(...currentEvaluations.map(item => item.id)) + 1 
      : 1

    // Formatage de la date
    const dateObject = new Date(formData.date)
    const formattedDate = dateObject.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

    // Créer la nouvelle évaluation
    const newEvaluation = {
      id: newId,
      type: formData.type,
      matiere: selectedMatiere.nom,
      matiereCode: selectedMatiere.code,
      matiereId: formData.matiere,
      groupe: selectedGroupe.nom,
      groupeId: formData.groupe,
      filiere: selectedGroupe.filiere,
      niveau: formData.niveau,
      semestre: formData.semestre,
      salle: selectedSalle.nom,
      date: formData.date,
      dateFormatee: formattedDate,
      heureDebut: formData.heureDebut,
      heureFin: formData.heureFin,
      dateRemise: formData.dateRemise,
      coefficient: parseFloat(formData.coefficient) || 1,
      instructions: formData.instructions,
      publier: formData.publier ? 'Publié' : 'Brouillon',
      fichiersCount: formData.fichiers.length,
      dateCreation: new Date().toISOString().split('T')[0],
      statut: 'Planifiée'
    }

    // Ajouter à la liste
    currentEvaluations.push(newEvaluation)

    // Sauvegarder dans localStorage
    if (process.client) {
      localStorage.setItem('evaluations', JSON.stringify(currentEvaluations))
    }

    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Message de succès
    alert(`Évaluation "${selectedMatiere.nom}" ajoutée avec succès !`)
    
    // Redirection vers la liste des évaluations
    router.push('/evaluations')

  } catch (error) {
    console.error('Erreur lors de l\'ajout:', error)
    alert('Une erreur est survenue lors de l\'ajout de l\'évaluation')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Styles spécifiques */
input[type="file"] {
  display: none;
}

/* Animation pour le drag & drop */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.border-dashed:hover {
  animation: pulse 2s infinite;
}

/* Style pour les selects désactivés */
select:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

/* Style pour la zone de fichiers */
.file-item {
  transition: all 0.2s ease;
}

.file-item:hover {
  background-color: #f3f4f6;
}

/* Responsive */
@media (max-width: 768px) {
  .grid-cols-3 {
    grid-template-columns: 1fr;
  }
}
</style>