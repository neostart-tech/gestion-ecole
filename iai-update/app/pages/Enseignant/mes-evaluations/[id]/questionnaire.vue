<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Sidebar avec aperçu et statistiques -->
        <div class="lg:col-span-1">
          <div class="sticky top-6 space-y-6">
            <!-- Aperçu de l'évaluation -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden">
              <div class="bg-blue-600 text-white px-6 py-4">
                <h2 class="text-lg font-semibold flex items-center gap-2">
                  <EyeIcon class="w-5 h-5" />
                  Aperçu de l'évaluation
                </h2>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Nombre de questions:</span>
                    <strong class="text-lg">{{ questions.length }}</strong>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Points totaux:</span>
                    <strong class="text-lg">{{ totalPoints.toFixed(1) }}</strong>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Limite:</span>
                    <strong :class="['text-lg', exceedsLimit ? 'text-red-600' : 'text-green-600']">
                      {{ totalPoints.toFixed(1) }}/20
                    </strong>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Types de questions:</span>
                    <div class="flex flex-wrap gap-1 justify-end">
                      <span v-for="(count, type) in questionTypesSummary" 
                            :key="type"
                            class="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">
                        {{ getTypeLabel(type) }}: {{ count }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Barre de progression -->
                  <div class="mt-4">
                    <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div :class="['h-full rounded-full transition-all duration-300', 
                                 exceedsLimit ? 'bg-red-500' : 'bg-green-500']"
                           :style="{ width: `${Math.min((totalPoints / MAX_POINTS) * 100, 100)}%` }">
                      </div>
                    </div>
                    <div v-if="exceedsLimit" class="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <ExclamationTriangleIcon class="w-4 h-4" />
                      Dépassement de la limite de 20 points
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Guide rapide -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden">
              <div class="bg-gray-100 px-6 py-4">
                <h2 class="text-lg font-semibold flex items-center gap-2">
                  <InformationCircleIcon class="w-5 h-5 text-gray-600" />
                  Guide rapide
                </h2>
              </div>
              <div class="p-6">
                <ul class="space-y-3 text-gray-600 text-sm">
                  <li class="flex items-start gap-2">
                    <CheckIcon class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Cliquez sur "Ajouter une question" pour créer de nouvelles questions</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <CheckIcon class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Utilisez les flèches pour développer/réduire les questions</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <CheckIcon class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Attribuez des points à chaque question (max 20 au total)</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <CheckIcon class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Prévisualisez votre évaluation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulaire principal -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="border-b border-gray-200 px-6 py-4">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 class="text-2xl font-bold text-blue-600 flex items-center gap-2">
                  <PlusCircleIcon class="w-6 h-6" />
                  Modifier les questions de l'évaluation
                </h1>
                <div class="flex items-center gap-3">
                  <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {{ questions.length }} question{{ questions.length !== 1 ? 's' : '' }}
                  </span>
                  <span :class="['px-3 py-1 rounded-full text-sm font-medium',
                              exceedsLimit ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700']">
                    {{ totalPoints.toFixed(1) }}/20 pts
                  </span>
                </div>
              </div>
            </div>
            
            <div class="p-6">
              <form @submit.prevent="submitForm" class="space-y-8">
                <!-- Container des questions -->
                <div class="max-h-[70vh] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                  <div v-for="(question, index) in questions" 
                       :key="question.id"
                       :class="['bg-white border rounded-xl transition-all duration-300', 
                              question.expanded ? 'border-blue-500 shadow-lg' : 'border-gray-200 shadow-sm',
                              question.exceedsLimit ? 'border-red-500' : '']"
                       @mouseenter="question.hover = true"
                       @mouseleave="question.hover = false">
                    
                    <!-- En-tête de la question -->
                    <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b cursor-pointer"
                         @click="toggleQuestion(question.id)">
                      <div class="flex justify-between items-center">
                        <div class="flex items-center gap-3">
                          <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm',
                                     question.expanded ? 'bg-white text-blue-600' : 
                                     question.exceedsLimit ? 'bg-red-500' : 'bg-blue-500']">
                            {{ index + 1 }}
                          </div>
                          <h3 class="font-semibold text-gray-800">
                            {{ question.title || `Question ${index + 1}` }}
                          </h3>
                        </div>
                        <div class="flex items-center gap-2">
                          <span :class="['px-2 py-1 text-xs rounded-full',
                                      getTypeBadgeClass(question.type)]">
                            {{ getTypeLabel(question.type) }}
                          </span>
                          <ChevronDownIcon 
                            :class="['w-5 h-5 text-gray-500 transition-transform duration-300',
                                   question.expanded ? 'transform rotate-180' : '']" />
                        </div>
                      </div>
                    </div>
                    
                    <!-- Corps de la question (réduit/développé) -->
                    <div v-if="question.expanded" class="p-6 space-y-6">
                      <!-- Titre et Points -->
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">
                            Titre de la question
                          </label>
                          <input type="text" 
                                 v-model="question.title"
                                 class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                 placeholder="Ex: Question sur les fonctions"
                                 required>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">
                            Points (max 20 au total)
                          </label>
                          <input type="number" 
                                 v-model.number="question.points"
                                 min="0" 
                                 max="20" 
                                 step="0.1"
                                 @input="updateQuestionPoints(question.id)"
                                 :class="['w-full px-4 py-2 border rounded-lg focus:ring-2 transition',
                                        question.exceedsLimit ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 
                                        'border-gray-300 focus:ring-blue-500 focus:border-blue-500']">
                          <div v-if="question.exceedsLimit" class="mt-1 text-xs text-red-600">
                            Limite dépassée! Maximum recommandé: {{ (MAX_POINTS - getOtherQuestionsPoints(question.id)).toFixed(1) }} points
                          </div>
                        </div>
                      </div>
                      
                      <!-- Énoncé -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Énoncé de la question
                        </label>
                        <textarea v-model="question.statement"
                                  rows="3"
                                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                  placeholder="Décrivez la question en détail..."
                                  required></textarea>
                      </div>
                      
                      <!-- Type de question -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Type de question
                        </label>
                        <select v-model="question.type"
                                @change="updateQuestionType(question.id, $event.target.value)"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                          <option value="text">Texte court</option>
                          <option value="textarea">Texte long</option>
                          <option value="choice_single">Choix unique</option>
                          <option value="choice_multiple">Choix multiples</option>
                        </select>
                      </div>
                      
                      <!-- Options pour les questions à choix -->
                      <div v-if="question.type === 'choice_single' || question.type === 'choice_multiple'"
                           class="bg-gray-50 rounded-xl p-6">
                        <label class="block text-sm font-medium text-gray-700 mb-4">
                          Options de réponse
                        </label>
                        <div class="space-y-3">
                          <div v-for="(option, optionIndex) in question.options" 
                               :key="option.id"
                               class="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                            <div class="flex items-center gap-4">
                              <div :class="['flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center',
                                         question.type === 'choice_single' ? 'rounded-full' : 'rounded']">
                                <div :class="['w-2 h-2 rounded-full', 
                                           question.type === 'choice_single' ? 'rounded-full' : 'rounded']"></div>
                              </div>
                              <input type="text" 
                                     v-model="option.label"
                                     class="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                     :placeholder="`Option ${optionIndex + 1}`">
                              <button type="button"
                                      @click="removeOption(question.id, option.id)"
                                      v-if="question.options.length > 1"
                                      class="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                                <XMarkIcon class="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <button type="button"
                                @click="addNewOption(question.id)"
                                class="mt-4 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition flex items-center gap-2">
                          <PlusIcon class="w-4 h-4" />
                          Ajouter une option
                        </button>
                      </div>
                      
                      <!-- Actions de la question -->
                      <div class="flex justify-between items-center pt-4 border-t border-gray-200">
                        <button type="button"
                                @click="removeQuestion(question.id)"
                                class="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2">
                          <TrashIcon class="w-4 h-4" />
                          Supprimer cette question
                        </button>
                        <span class="text-sm text-gray-500">
                          Question {{ index + 1 }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Bouton d'ajout de question -->
                <div class="text-center">
                  <button type="button"
                          @click="addQuestion"
                          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto">
                    <PlusIcon class="w-5 h-5" />
                    Ajouter une question
                  </button>
                </div>
                
                <!-- Actions du formulaire -->
                <div class="pt-8 border-t border-gray-200">
                  <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button type="button"
                            @click="showPreview = true"
                            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
                      <EyeIcon class="w-5 h-5" />
                      Prévisualiser
                    </button>
                    <button type="submit"
                            :disabled="exceedsLimit || questions.length === 0"
                            :class="['px-6 py-3 rounded-lg transition flex items-center gap-2 font-medium',
                                   exceedsLimit || questions.length === 0 ? 
                                   'bg-gray-300 text-gray-500 cursor-not-allowed' : 
                                   'bg-green-600 text-white hover:bg-green-700']">
                      <CheckCircleIcon class="w-5 h-5" />
                      Mettre à jour l'évaluation
                    </button>
                  </div>
                </div>
              </form>
              
              <!-- Messages d'alerte -->
              <div v-if="errorMessage" 
                   class="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {{ errorMessage }}
              </div>
              <div v-if="successMessage" 
                   class="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                {{ successMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de prévisualisation -->
    <div v-if="showPreview" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div class="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
          <h2 class="text-xl font-semibold">Prévisualisation de l'évaluation</h2>
          <button @click="showPreview = false"
                  class="text-white hover:text-gray-200 transition">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-5rem)]">
          <div v-if="questions.length === 0" class="text-center text-gray-500 py-8">
            Aucune question créée
          </div>
          <div v-else class="space-y-6">
            <div v-for="(question, index) in questions" 
                 :key="`preview-${question.id}`"
                 class="bg-white border border-gray-200 rounded-xl p-6">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-semibold text-blue-600">
                  {{ index + 1 }}. {{ question.title || 'Sans titre' }}
                </h3>
                <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {{ question.points }} pts
                </span>
              </div>
              <p class="text-gray-700 mb-6">{{ question.statement || 'Aucun énoncé' }}</p>
              
              <div v-if="question.type === 'choice_single' || question.type === 'choice_multiple'"
                   class="space-y-3">
                <div v-for="option in question.options" 
                     :key="option.id"
                     class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div :class="['w-5 h-5 border-2 rounded-full flex items-center justify-center',
                             question.type === 'choice_single' ? 'rounded-full' : 'rounded']">
                    <div :class="['w-2 h-2', 
                               question.type === 'choice_single' ? 'rounded-full' : 'rounded']"></div>
                  </div>
                  <span class="text-gray-700">{{ option.label }}</span>
                </div>
              </div>
              
              <input v-else-if="question.type === 'text'" 
                     type="text"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                     placeholder="Réponse courte"
                     disabled>
              
              <textarea v-else-if="question.type === 'textarea'"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        rows="3"
                        placeholder="Réponse longue"
                        disabled></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// Icônes (remplacez par vos propres icônes ou utilisez un package comme @heroicons/vue)
const EyeIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>' }
const InformationCircleIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>' }
const CheckIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>' }
const PlusCircleIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' }
const ChevronDownIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>' }
const PlusIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>' }
const XMarkIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>' }
const TrashIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>' }
const ExclamationTriangleIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>' }
const CheckCircleIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' }

// Variables réactives
const questions = ref([])
const questionCount = ref(0)
const showPreview = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const MAX_POINTS = 20

// Données des questions existantes (à remplacer par un appel API)
const existingQuestions = [
  {
    id: 1,
    evaluation_id: 23,
    title: "Lorem ipsum",
    statement: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    type: "text",
    order: 0,
    points: 5,
    created_at: "2026-01-05T09:32:44.000000Z",
    updated_at: "2026-01-05T09:32:44.000000Z",
    options: []
  }
]

// Computed properties
const totalPoints = computed(() => {
  return questions.value.reduce((sum, q) => sum + (parseFloat(q.points) || 0), 0)
})

const exceedsLimit = computed(() => {
  return totalPoints.value > MAX_POINTS
})

const questionTypesSummary = computed(() => {
  const typeCount = {}
  questions.value.forEach(q => {
    typeCount[q.type] = (typeCount[q.type] || 0) + 1
  })
  return typeCount
})

// Fonctions utilitaires
const getTypeLabel = (type) => {
  const types = {
    'text': 'Texte court',
    'textarea': 'Texte long',
    'choice_single': 'Choix unique',
    'choice_multiple': 'Choix multiples'
  }
  return types[type] || type
}

const getTypeBadgeClass = (type) => {
  switch(type) {
    case 'choice_single':
    case 'choice_multiple':
      return 'bg-yellow-100 text-yellow-800'
    case 'textarea':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getOtherQuestionsPoints = (questionId) => {
  return questions.value
    .filter(q => q.id !== questionId)
    .reduce((sum, q) => sum + (parseFloat(q.points) || 0), 0)
}

// Fonctions pour gérer les questions
const addQuestion = () => {
  questionCount.value++
  
  const newQuestion = {
    id: questionCount.value,
    title: '',
    statement: '',
    type: 'text',
    points: 5,
    options: [],
    expanded: true,
    isNew: true,
    exceedsLimit: false,
    hover: false
  }
  
  questions.value.push(newQuestion)
}

const removeQuestion = (questionId) => {
  if (window.confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
    const index = questions.value.findIndex(q => q.id === questionId)
    if (index !== -1) {
      questions.value.splice(index, 1)
    }
  }
}

const toggleQuestion = (questionId) => {
  const question = questions.value.find(q => q.id === questionId)
  if (question) {
    question.expanded = !question.expanded
  }
}

const updateQuestionPoints = (questionId) => {
  const question = questions.value.find(q => q.id === questionId)
  if (!question) return
  
  const points = parseFloat(question.points) || 0
  
  // Limiter la valeur maximale à 20
  if (points > 20) {
    question.points = 20
  }
  
  // Calculer les points des autres questions
  const otherQuestionsPoints = getOtherQuestionsPoints(questionId)
  
  // Vérifier si cette question fait dépasser la limite
  const wouldExceedLimit = (otherQuestionsPoints + points) > MAX_POINTS
  question.exceedsLimit = wouldExceedLimit
}

const updateQuestionType = (questionId, newType) => {
  const question = questions.value.find(q => q.id === questionId)
  if (question) {
    question.type = newType
    
    // Initialiser les options si c'est un type à choix
    if (newType === 'choice_single' || newType === 'choice_multiple') {
      if (!question.options || question.options.length === 0) {
        question.options = [
          { id: 1, label: 'Option 1' },
          { id: 2, label: 'Option 2' },
          { id: 3, label: 'Option 3' }
        ]
      }
    } else {
      question.options = []
    }
  }
}

const addNewOption = (questionId) => {
  const question = questions.value.find(q => q.id === questionId)
  if (question && (question.type === 'choice_single' || question.type === 'choice_multiple')) {
    const optionCount = question.options.length + 1
    question.options.push({
      id: optionCount,
      label: `Option ${optionCount}`
    })
  }
}

const removeOption = (questionId, optionId) => {
  const question = questions.value.find(q => q.id === questionId)
  if (question && question.options.length > 1) {
    const index = question.options.findIndex(o => o.id === optionId)
    if (index !== -1) {
      question.options.splice(index, 1)
    }
  }
}

// Fonction pour soumettre le formulaire
const submitForm = async () => {
  if (questions.value.length === 0) {
    errorMessage.value = 'Veuillez ajouter au moins une question'
    successMessage.value = ''
    return
  }

  // Validation des questions
  const invalidQuestions = questions.value.filter(q => !q.title || !q.statement)
  if (invalidQuestions.length > 0) {
    errorMessage.value = 'Certaines questions ont des champs manquants'
    successMessage.value = ''
    return
  }

  // Vérifier la limite des points
  if (exceedsLimit.value) {
    errorMessage.value = `Le total des points (${totalPoints.value.toFixed(1)}) dépasse la limite de 20 points`
    successMessage.value = ''
    return
  }

  try {
    // Préparer les données pour l'envoi
    const formData = {
      questions: questions.value.map(q => ({
        id: q.id,
        title: q.title,
        statement: q.statement,
        type: q.type,
        points: q.points,
        options_text: q.options && q.options.length > 0 
          ? q.options.map(o => ({ label: o.label }))
          : undefined
      }))
    }

    // Ici, vous feriez l'appel API avec fetch ou axios
    console.log('Données à envoyer:', formData)
    
    // Simuler une réponse réussie
    successMessage.value = 'Évaluation mise à jour avec succès!'
    errorMessage.value = ''
    
    // Réinitialiser après 3 secondes
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
    
  } catch (error) {
    errorMessage.value = 'Une erreur est survenue lors de l\'enregistrement'
    successMessage.value = ''
    console.error('Erreur:', error)
  }
}

// Charger les questions existantes
const loadExistingQuestions = () => {
  if (existingQuestions && existingQuestions.length > 0) {
    questions.value = existingQuestions.map((existingQuestion, index) => {
      questionCount.value++
      return {
        id: questionCount.value,
        title: existingQuestion.title || '',
        statement: existingQuestion.statement || '',
        type: existingQuestion.type || 'text',
        points: existingQuestion.points || 5,
        options: existingQuestion.options || [],
        expanded: index === 0, // Développer la première question
        isNew: false,
        exceedsLimit: false,
        hover: false
      }
    })
  } else {
    // Aucune question existante, ajouter une question vide
    addQuestion()
  }
}

// Initialisation
onMounted(() => {
  loadExistingQuestions()
})
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Animation pour l'ajout de questions */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.question-card-enter {
  animation: slideIn 0.3s ease-out;
}

/* Styles pour les champs de formulaire */
input:focus, textarea:focus, select:focus {
  outline: none;
  ring-width: 2px;
}

/* Transition pour les modales */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: transform 0.3s ease;
}

.modal-content-enter-from,
.modal-content-leave-to {
  transform: scale(0.95);
}
</style>