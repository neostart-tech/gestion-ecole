<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      <!-- Header -->
      <div class="mb-6">
        <Breadcrumb
          :items="[
            { label: 'Tableau de bord', to: '/admin/dashboard' },
            { label: 'Frais scolaires', to: '/admin/negociations' },
            { label: 'Nouvel échéancier', to: null }
          ]"
          title="Créer un échéancier"
          title-class="text-2xl font-bold text-gray-900 dark:text-white"
        />
      </div>

      <!-- Message d'info -->
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-blue-700">
              Sélectionnez un étudiant pour commencer
            </p>
          </div>
        </div>
      </div>

      <!-- Étape 1 : Sélection étudiant -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <span class="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">1</span>
            <h2 class="text-lg font-semibold">Sélectionner un étudiant</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Recherche -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Rechercher un étudiant <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="searchQuery"
                @input="searchStudents"
                placeholder="Nom, prénom ou matricule..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              
              <!-- Résultats -->
              <div v-if="searchQuery && filteredStudents.length" class="mt-2 border rounded-lg max-h-60 overflow-y-auto">
                <div
                  v-for="student in filteredStudents"
                  :key="student.id"
                  @click="selectStudent(student)"
                  class="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  :class="{ 'bg-indigo-50': selectedStudent?.id === student.id }"
                >
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                      {{ getInitials(student) }}
                    </div>
                    <div>
                      <div class="font-medium">{{ student.nom }} {{ student.prenom }}</div>
                      <div class="text-sm text-gray-500">{{ student.matricule }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="searchQuery && !filteredStudents.length" class="mt-2 p-3 text-gray-500 text-center border rounded-lg">
                Aucun étudiant trouvé
              </div>
            </div>

            <!-- Infos étudiant -->
            <div v-if="selectedStudent" class="bg-blue-50 p-4 rounded-lg">
              <h3 class="text-sm font-medium text-blue-800 mb-3">Étudiant sélectionné</h3>
              <div class="flex items-center">
                <div class="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  {{ getInitials(selectedStudent) }}
                </div>
                <div>
                  <div class="font-semibold">{{ selectedStudent.nom }} {{ selectedStudent.prenom }}</div>
                  <div class="text-sm text-gray-600">{{ selectedStudent.matricule }}</div>
                  <div class="flex mt-2 space-x-2">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {{ selectedStudent.dernier_groupe?.niveau?.libelle || 'Niveau' }}
                    </span>
                    <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      {{ selectedStudent.dernier_groupe?.filiere?.nom || 'Filière' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="bg-gray-50 p-4 rounded-lg flex items-center justify-center text-gray-400">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Aucun étudiant sélectionné</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Étape 2 : Bourses -->
      <div v-if="selectedStudent" class="bg-white rounded-lg shadow mb-6">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <span class="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">2</span>
            <h2 class="text-lg font-semibold">Bourse de l'étudiant</h2>
          </div>

          <!-- Loading -->
          <div v-if="bourseLoading" class="flex justify-center py-4">
            <svg class="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="ml-2">Vérification des bourses...</span>
          </div>

          <!-- Liste bourses -->
          <div v-else-if="boursesEtudiant.length" class="space-y-4">
            <div class="bg-green-50 border-l-4 border-green-500 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-green-700">
                    Cet étudiant bénéficie d'une ou plusieurs bourses
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <div
                v-for="bourse in boursesEtudiant"
                :key="bourse.id"
                @click="selectBourse(bourse)"
                class="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                :class="{ 'border-indigo-500 bg-indigo-50': selectedBourse?.id === bourse.id }"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-semibold">{{ bourse.bourse.nom }}</h3>
                    <p class="text-sm text-gray-600">{{ bourse.bourse.description }}</p>
                  </div>
                  <div class="text-right">
                    <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-1">
                      {{ bourse.bourse.type === 'pourcentage' ? 'Pourcentage' : 'Montant fixe' }}
                    </span>
                    <div class="font-bold text-green-600">
                      {{ bourse.bourse.type === 'pourcentage' 
                        ? bourse.bourse.valeur + '%' 
                        : formatMontant(bourse.bourse.valeur) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pas de bourse -->
          <div v-else class="bg-gray-50 p-6 text-center">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-600">Cet étudiant n'a pas de bourse</p>
            <p class="text-sm text-gray-500 mt-1">Vous pouvez continuer sans appliquer de bourse</p>
          </div>
        </div>
      </div>

      <!-- Étape 3 : Échéancier -->
      <div v-if="selectedStudent" class="bg-white rounded-lg shadow">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <span class="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">3</span>
            <h2 class="text-lg font-semibold">Configuration de l'échéancier</h2>
          </div>

          <div class="space-y-6">
            <!-- Année et type -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Année scolaire <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.annee_scolaire_id"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="" disabled>Sélectionner une année</option>
                  <option v-for="annee in anneesScolaires" :key="annee.id" :value="annee.id">
                    {{ annee.nom }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Type de paiement <span class="text-red-500">*</span>
                </label>
                <div class="flex space-x-2">
                  <button
                    v-for="option in typePaiementOptions"
                    :key="option.value"
                    @click="form.type_paiement = option.value"
                    class="flex-1 px-4 py-2 border rounded-lg text-sm font-medium"
                    :class="form.type_paiement === option.value
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Info bourse sélectionnée -->
            <div v-if="selectedBourse" class="bg-blue-50 p-4 rounded-lg">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-blue-700">
                    La bourse <strong>{{ selectedBourse.bourse.nom }}</strong> 
                    ({{ selectedBourse.bourse.type === 'pourcentage' ? selectedBourse.bourse.valeur + '%' : formatMontant(selectedBourse.bourse.valeur) }})
                    sera appliquée automatiquement
                  </p>
                </div>
              </div>
            </div>

            <!-- Échéances -->
            <div>
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-medium">Échéances</h3>
                <button
                  @click="addEcheance"
                  class="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  + Ajouter
                </button>
              </div>

              <div class="space-y-3">
                <div
                  v-for="(echeance, index) in form.echeances"
                  :key="index"
                  class="bg-gray-50 p-4 rounded-lg"
                >
                  <div class="flex items-start space-x-3">
                    <span class="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                      {{ index + 1 }}
                    </span>
                    
                    <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        v-model="echeance.libelle"
                        type="text"
                        placeholder="Libellé"
                        class="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        v-model="echeance.montant"
                        type="number"
                        placeholder="Montant"
                        class="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        v-model="echeance.date_limite"
                        type="date"
                        class="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        :min="new Date().toISOString().split('T')[0]"
                      />
                    </div>

                    <button
                      @click="removeEcheance(index)"
                      class="text-red-500 hover:text-red-700"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div v-if="!form.echeances.length" class="text-center py-8 text-gray-500">
                  <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>Aucune échéance ajoutée</p>
                </div>
              </div>

              <!-- Bouton génération auto -->
              <div class="flex justify-end mt-4">
                <button
                  @click="showAutoGeneration = true"
                  class="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Générer automatiquement
                </button>
              </div>
            </div>

            <!-- Résumé -->
            <div class="border-t pt-4">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="bg-green-50 p-4 rounded-lg">
                  <span class="text-sm text-gray-600">Montant total</span>
                  <p class="text-xl font-bold text-green-600">{{ formatMontant(totalMontant) }}</p>
                </div>
                <div class="bg-blue-50 p-4 rounded-lg">
                  <span class="text-sm text-gray-600">Nombre d'échéances</span>
                  <p class="text-xl font-bold text-blue-600">{{ form.echeances.length }}</p>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg">
                  <span class="text-sm text-gray-600">Moyenne</span>
                  <p class="text-xl font-bold text-purple-600">{{ formatMontant(moyenneParEcheance) }}</p>
                </div>
              </div>
            </div>

            <!-- Boutons -->
            <div class="flex justify-end space-x-3 pt-4 border-t">
              <button
                @click="resetForm"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                @click="submitForm"
                :disabled="!canSubmit || isSubmitting"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isSubmitting">Création...</span>
                <span v-else>Créer l'échéancier</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal génération auto -->
      <div v-if="showAutoGeneration" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <h3 class="text-lg font-bold mb-4">Génération automatique</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fréquence de paiement
              </label>
              <div class="flex space-x-2">
                <button
                  v-for="freq in frequenceOptions"
                  :key="freq.value"
                  @click="autoGenFrequence = freq.value"
                  class="flex-1 px-3 py-2 border rounded-lg text-sm"
                  :class="autoGenFrequence === freq.value
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300'"
                >
                  {{ freq.label }}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Montant total (optionnel)
              </label>
              <input
                v-model="autoGenMontant"
                type="number"
                placeholder="Montant total"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                v-model="autoGenDateDebut"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                :min="new Date().toISOString().split('T')[0]"
              />
            </div>

            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-sm text-blue-700">
                <strong>{{ nombreEcheancesAuto }}</strong> échéances seront générées
              </p>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="showAutoGeneration = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              @click="generateEcheances"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Générer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import Breadcrumb from '~/components/Breadcrumb.vue'
import { useNegociationStore } from '~~/stores/negociation'
import { useAnneScolaireStore } from '~~/stores/annee-scolaire'
import { useEtudiantStore } from '~~/stores/etudiant'
import { useBourseStore } from '~~/stores/bourse'

const { $toastr, $api } = useNuxtApp()

// Stores
const negociationStore = useNegociationStore()
const anneeStore = useAnneScolaireStore()
const etudiantStore = useEtudiantStore()
const bourseStore = useBourseStore()

// États
const selectedStudent = ref(null)
const searchQuery = ref('')
const filteredStudents = ref([])
const boursesEtudiant = ref([])
const selectedBourse = ref(null)
const bourseLoading = ref(false)
const isSubmitting = ref(false)
const showAutoGeneration = ref(false)
const autoGenFrequence = ref('mensuel')
const autoGenMontant = ref(null)
const autoGenDateDebut = ref(new Date().toISOString().split('T')[0])

// Formulaire
const form = reactive({
  etudiant_id: null,
  annee_scolaire_id: null,
  type_paiement: 'negociation',
  bourse_etudiant_id: null,
  commentaire: null,
  echeances: []
})

// Options
const typePaiementOptions = [
  { label: 'Global', value: 'tranches_globales' },
  { label: 'Négocié', value: 'negociation' }
]

const frequenceOptions = [
  { label: 'Mensuel', value: 'mensuel' },
  { label: 'Bimestriel', value: 'bimestriel' },
  { label: 'Trimestriel', value: 'trimestriel' },
  { label: 'Annuel', value: 'annuel' }
]

// Computed
const anneesScolaires = computed(() => anneeStore.annneescolaires || [])
const totalMontant = computed(() => {
  return form.echeances.reduce((sum, e) => sum + (Number(e.montant) || 0), 0)
})
const moyenneParEcheance = computed(() => {
  if (!form.echeances.length) return 0
  return totalMontant.value / form.echeances.length
})
const nombreEcheancesAuto = computed(() => {
  const map = { mensuel: 12, bimestriel: 6, trimestriel: 4, annuel: 1 }
  return map[autoGenFrequence.value] || 0
})
const canSubmit = computed(() => {
  return selectedStudent.value && 
         form.annee_scolaire_id && 
         form.echeances.length > 0 &&
         form.echeances.every(e => e.libelle?.trim() && e.montant > 0 && e.date_limite)
})

// Watch étudiant
watch(selectedStudent, async (newStudent) => {
  if (newStudent) {
    form.etudiant_id = newStudent.id
    await loadBourses(newStudent.id)
  } else {
    form.etudiant_id = null
    form.bourse_etudiant_id = null
    boursesEtudiant.value = []
    selectedBourse.value = null
  }
})

// Initialisation
onMounted(async () => {
  try {
    await Promise.all([
      anneeStore.fetchAnneeScolaire(),
      etudiantStore.fetchEtudiants({ limit: 100 })
    ])
    filteredStudents.value = etudiantStore.etudiants || []
  } catch (error) {
    $toastr.error('Erreur de chargement')
  }
})

// Méthodes
function searchStudents() {
  if (!searchQuery.value) {
    filteredStudents.value = etudiantStore.etudiants || []
    return
  }
  
  const query = searchQuery.value.toLowerCase()
  filteredStudents.value = (etudiantStore.etudiants || []).filter(s => 
    s.nom?.toLowerCase().includes(query) ||
    s.prenom?.toLowerCase().includes(query) ||
    s.matricule?.toLowerCase().includes(query)
  )
}

function selectStudent(student) {
  selectedStudent.value = student
  searchQuery.value = ''
}

async function loadBourses(etudiantId) {
  bourseLoading.value = true
  try {
    const response = await $api.get(`/bourse/${etudiantId}/etudiant`)
    boursesEtudiant.value = response.data?.data || response.data || []
    
    if (boursesEtudiant.value.length === 1) {
      selectBourse(boursesEtudiant.value[0])
    }
  } catch (error) {
    console.error('Erreur chargement bourses:', error)
    boursesEtudiant.value = []
  } finally {
    bourseLoading.value = false
  }
}

function selectBourse(bourse) {
  selectedBourse.value = bourse
  form.bourse_etudiant_id = bourse.id
  $toastr.success(`Bourse "${bourse.bourse.nom}" sélectionnée`)
}

function getInitials(student) {
  if (!student) return ''
  return ((student.nom?.[0] || '') + (student.prenom?.[0] || '')).toUpperCase()
}

function formatMontant(montant) {
  if (!montant && montant !== 0) return '0 FCFA'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(montant)
}

function addEcheance() {
  form.echeances.push({
    libelle: `Échéance ${form.echeances.length + 1}`,
    montant: null,
    date_limite: null
  })
}

function removeEcheance(index) {
  form.echeances.splice(index, 1)
}

function generateEcheances() {
  const montantTotal = autoGenMontant.value || totalMontant.value
  if (montantTotal <= 0) {
    $toastr.warning('Montant total invalide')
    return
  }

  const nombre = nombreEcheancesAuto.value
  const montantParEcheance = Math.floor(montantTotal / nombre)
  const reste = montantTotal - (montantParEcheance * nombre)
  const nouvelles = []
  const dateDebut = new Date(autoGenDateDebut.value)

  for (let i = 0; i < nombre; i++) {
    const dateLimite = new Date(dateDebut)
    
    if (autoGenFrequence.value === 'mensuel') {
      dateLimite.setMonth(dateLimite.getMonth() + i)
    } else if (autoGenFrequence.value === 'bimestriel') {
      dateLimite.setMonth(dateLimite.getMonth() + (i * 2))
    } else if (autoGenFrequence.value === 'trimestriel') {
      dateLimite.setMonth(dateLimite.getMonth() + (i * 3))
    }

    nouvelles.push({
      libelle: `Échéance ${i + 1}`,
      montant: i === nombre - 1 ? montantParEcheance + reste : montantParEcheance,
      date_limite: dateLimite.toISOString().split('T')[0]
    })
  }

  form.echeances = nouvelles
  showAutoGeneration.value = false
  $toastr.success(`${nombre} échéances générées`)
}

function resetForm() {
  selectedStudent.value = null
  selectedBourse.value = null
  searchQuery.value = ''
  form.etudiant_id = null
  form.annee_scolaire_id = null
  form.type_paiement = 'negociation'
  form.bourse_etudiant_id = null
  form.commentaire = null
  form.echeances = []
  boursesEtudiant.value = []
}

async function submitForm() {
  if (!canSubmit.value) {
    $toastr.warning('Veuillez remplir tous les champs')
    return
  }

  isSubmitting.value = true
  try {
    const data = {
      etudiant_id: form.etudiant_id,
      annee_scolaire_id: form.annee_scolaire_id,
      type_paiement: form.type_paiement,
      bourse_etudiant_id: selectedBourse.value?.id || null,
      commentaire: form.commentaire,
      echeances: form.echeances.map(e => ({
        libelle: e.libelle,
        montant: e.montant,
        date_limite: e.date_limite
      }))
    }

    await negociationStore.createNegociation(data)
    $toastr.success('Échéancier créé avec succès')
    resetForm()
  } catch (error) {
    $toastr.error('Erreur lors de la création')
  } finally {
    isSubmitting.value = false
  }
}
</script>