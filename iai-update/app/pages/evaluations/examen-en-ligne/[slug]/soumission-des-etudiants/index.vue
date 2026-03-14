<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-4 md:p-6 lg:p-8 transition-colors">
    
    <!-- ========== LOADING ========== -->
    <div v-if="isPageLoading" class="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 z-50 flex items-center justify-center">
      <div class="text-center">
        <div class="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Chargement des corrections...</p>
      </div>
    </div>

    <template v-else>
      <!-- ========== BREADCRUMB ========== -->
      <Breadcrumb
        :items="[
          { label: 'Examens', to: '/examens' },
          { label: 'Correction', to: '/examens/correction' },
          { label: examStore.examTitle, to: null }
        ]"
        :title="examStore.examTitle"
        title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
        spacing="mb-4 sm:mb-6"
      />

      <!-- ========== FILTRES ET STATISTIQUES ========== -->
      <div class="mb-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <!-- Stats carte 1: Total étudiants -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Étudiants</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ totalEtudiants }}</p>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Stats carte 2: Taux de participation -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Participation</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ participationRate }}%</p>
            </div>
            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Stats carte 3: Moyenne générale -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Moyenne</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ moyenneGenerale }}/{{ examStore.totalPoints }}</p>
            </div>
            <div class="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Stats carte 4: Questions non corrigées -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">À corriger</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ questionsNonCorrigees }}</p>
            </div>
            <div class="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
              <svg class="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== BARRE DE RECHERCHE ET FILTRES ========== -->
      <div class="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div class="relative w-full sm:w-96">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un étudiant..."
            class="w-full pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <select
            v-model="filterPartie"
            class="px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="">Toutes les parties</option>
            <option v-for="part in examStore.parts" :key="part.id" :value="part.id">
              {{ part.titre }}
            </option>
          </select>

          <select
            v-model="filterStatut"
            class="px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="">Tous les statuts</option>
            <option value="corrige">Corrigé</option>
            <option value="non_corrige">Non corrigé</option>
            <option value="partiel">Partiellement corrigé</option>
          </select>
        </div>
      </div>

      <!-- ========== LISTE DES ÉTUDIANTS ========== -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Étudiant</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progression</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Note</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dernière activité</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="etudiant in filteredEtudiants" :key="etudiant.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {{ getInitials(etudiant.nom, etudiant.prenom) }}
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ etudiant.nom }} {{ etudiant.prenom }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ etudiant.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ getStudentProgression(etudiant.id).repondues }}/{{ getStudentProgression(etudiant.id).total }}</span>
                    <div class="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div class="h-full bg-indigo-600 rounded-full" :style="{ width: getStudentProgression(etudiant.id).pourcentage + '%' }"></div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm font-medium" :class="getNoteColor(getStudentNote(etudiant.id), examStore.totalPoints)">
                    {{ getStudentNote(etudiant.id) }}/{{ examStore.totalPoints }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs rounded-full" :class="getStatutClass(getStudentStatut(etudiant.id))">
                    {{ getStudentStatut(etudiant.id) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(getStudentLastActivity(etudiant.id)) }}
                </td>
                <td class="px-6 py-4">
                  <button
                    @click="openCorrectionModal(etudiant)"
                    class="p-2 rounded-lg text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                    title="Corriger"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ========== MODAL DE CORRECTION ========== -->
      <TransitionRoot appear :show="showCorrectionModal" as="template">
        <Dialog as="div" class="relative z-50" @close="closeCorrectionModal">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/60" />
          </TransitionChild>

          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                  <!-- En-tête -->
                  <div class="flex items-start justify-between mb-6">
                    <div class="flex items-center gap-3">
                      <div class="p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <div>
                        <DialogTitle class="text-xl font-semibold text-gray-900 dark:text-white">
                          Correction - {{ selectedEtudiant?.nom }} {{ selectedEtudiant?.prenom }}
                        </DialogTitle>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Note actuelle: {{ getStudentNote(selectedEtudiant?.id) }}/{{ examStore.totalPoints }}
                        </p>
                      </div>
                    </div>
                    <button
                      @click="closeCorrectionModal"
                      class="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <!-- Navigation par parties -->
                  <div class="mb-6 flex gap-2 overflow-x-auto pb-2">
                    <button
                      v-for="part in examStore.parts"
                      :key="part.id"
                      @click="selectedPartCorrection = part"
                      class="px-4 py-2 text-sm rounded-lg whitespace-nowrap transition-colors"
                      :class="selectedPartCorrection?.id === part.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
                    >
                      {{ part.titre }}
                    </button>
                  </div>

                  <!-- Liste des questions à corriger -->
                  <div v-if="selectedPartCorrection" class="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    <div
                      v-for="question in getQuestionsForPart(selectedPartCorrection.id)"
                      :key="question.id"
                      class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                    >
                      <!-- En-tête de la question -->
                      <div class="bg-gray-50 dark:bg-gray-700/50 p-4 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                          <span class="px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
                            {{ getTypeLabel(question.type) }}
                          </span>
                          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {{ question.points }} pts
                          </span>
                        </div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                          {{ isQuestionCorrigee(selectedEtudiant?.id, question.id) ? 'Corrigé' : 'Non corrigé' }}
                        </span>
                      </div>

                      <!-- Contenu de la question -->
                      <div class="p-4 space-y-4">
                        <!-- Énoncé -->
                        <div>
                          <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Question:</p>
                          <div class="text-sm text-gray-800 dark:text-gray-200" v-html="question.content"></div>
                        </div>

                        <!-- Réponse de l'étudiant -->
                        <div>
                          <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Réponse de l'étudiant:</p>
                          <div class="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                            <template v-if="question.type === 'qcm_unique' || question.type === 'qcm_multiple' || question.type === 'vrai_faux'">
                              <div v-for="opt in question.options" :key="opt.id" class="flex items-center gap-2 py-1">
                                <span :class="opt.is_correct ? 'text-green-600' : 'text-red-600'">
                                  {{ opt.is_correct ? '✓' : '✗' }}
                                </span>
                                <span class="text-sm" :class="{ 'font-bold': isOptionSelected(selectedEtudiant?.id, question.id, opt.id) }">
                                  {{ opt.text }}
                                  <span v-if="isOptionSelected(selectedEtudiant?.id, question.id, opt.id)" class="ml-2 text-xs text-indigo-600">(choisi)</span>
                                </span>
                              </div>
                            </template>
                            <div v-else class="text-sm text-gray-700 dark:text-gray-300">
                              {{ getStudentResponse(selectedEtudiant?.id, question.id) }}
                            </div>
                          </div>
                        </div>

                        <!-- Zone de correction -->
                        <div class="flex items-end gap-4">
                          <div class="flex-1">
                            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Points attribués (max {{ question.points }})
                            </label>
                            <input
                              v-model.number="correctionForm[question.id].points"
                              type="number"
                              :max="question.points"
                              min="0"
                              step="0.5"
                              class="w-32 px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                              @input="validatePoints(question)"
                            />
                          </div>
                          <div class="flex-1">
                            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Commentaire
                            </label>
                            <input
                              v-model="correctionForm[question.id].commentaire"
                              type="text"
                              placeholder="Optionnel"
                              class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <button
                            @click="saveQuestionCorrection(question)"
                            class="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            :disabled="correctionForm[question.id]?.points > question.points"
                          >
                            Enregistrer
                          </button>
                        </div>
                        <p v-if="correctionForm[question.id]?.points > question.points" class="text-xs text-red-600 mt-1">
                          Les points ne peuvent pas dépasser {{ question.points }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Pied de la modale -->
                  <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      Total: {{ calculateTotalPoints(selectedEtudiant?.id) }}/{{ examStore.totalPoints }}
                    </div>
                    <div class="flex gap-3">
                      <button
                        @click="closeCorrectionModal"
                        class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Fermer
                      </button>
                      <button
                        @click="saveAllCorrections"
                        class="px-4 py-2 text-sm bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800"
                        :disabled="isSavingAll"
                      >
                        {{ isSavingAll ? 'Enregistrement...' : 'Enregistrer tout' }}
                      </button>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>

      <!-- ========== TOAST ========== -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform translate-y-2 opacity-0"
      >
        <div v-if="showToast" class="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm z-50">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ toastMessage }}
        </div>
      </Transition>
    </template>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import Breadcrumb from '~/components/Breadcrumb.vue'
import { useExamStore } from '~~/stores/exam'
import { useEtudiantStore } from '~~/stores/etudiant'

const route = useRoute()
const examStore = useExamStore()
const etudiantStore = useEtudiantStore()

const evaluationId = route.params.slug

// ========== DONNÉES LOCALES ==========
const isPageLoading = ref(true)
const searchQuery = ref('')
const filterPartie = ref('')
const filterStatut = ref('')
const showCorrectionModal = ref(false)
const selectedEtudiant = ref(null)
const selectedPartCorrection = ref(null)
const isSavingAll = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const correctionForm = ref({})

// Liste des étudiants du groupe
const etudiants = ref([])

// ========== COMPUTED ==========
const totalEtudiants = computed(() => etudiants.value.length)

const participationRate = computed(() => {
  if (etudiants.value.length === 0) return 0
  
  // Vérifier que submissions est un tableau
  const submissions = Array.isArray(examStore.submissions) ? examStore.submissions : []
  
  const participe = etudiants.value.filter(e => {
    const etudiantSubmissions = submissions.filter(s => s?.etudiant_id === e.id)
    return etudiantSubmissions.length > 0
  }).length
  
  return Math.round((participe / etudiants.value.length) * 100)
})

const moyenneGenerale = computed(() => {
  if (etudiants.value.length === 0) return 0
  
  let total = 0
  etudiants.value.forEach(e => {
    total += getStudentNote(e.id)
  })
  
  return (total / etudiants.value.length).toFixed(1)
})

const questionsNonCorrigees = computed(() => {
  // Vérifier que submissions est un tableau
  const submissions = Array.isArray(examStore.submissions) ? examStore.submissions : []
  
  let count = 0
  submissions.forEach(sub => {
    if (sub && sub.points_obtenus === null) count++
  })
  return count
})

const filteredEtudiants = computed(() => {
  return etudiants.value.filter(e => {
    const matchesSearch = searchQuery.value === '' || 
      `${e?.nom || ''} ${e?.prenom || ''}`.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      e?.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const statut = getStudentStatut(e?.id)
    const matchesStatut = filterStatut.value === '' || 
      (filterStatut.value === 'corrige' && statut === 'Corrigé') ||
      (filterStatut.value === 'non_corrige' && statut === 'Non corrigé') ||
      (filterStatut.value === 'partiel' && statut === 'Partiellement corrigé')
    
    return matchesSearch && matchesStatut
  })
})

// ========== MÉTHODES POUR LES ÉTUDIANTS ==========
const getStudentProgression = (etudiantId) => {
  if (!etudiantId) return { total: 0, repondues: 0, pourcentage: 0 }
  
  // Vérifier que submissions est un tableau
  const submissions = Array.isArray(examStore.submissions) 
    ? examStore.submissions.filter(s => s && s.etudiant_id === etudiantId)
    : []
    
  const total = examStore.totalQuestions || 0
  const repondues = submissions.length
  
  return {
    total,
    repondues,
    pourcentage: total > 0 ? Math.round((repondues / total) * 100) : 0
  }
}

const getStudentNote = (etudiantId) => {
  if (!etudiantId) return 0
  
  const submissions = Array.isArray(examStore.submissions)
    ? examStore.submissions.filter(s => s && s.etudiant_id === etudiantId)
    : []
    
  return submissions.reduce((sum, s) => sum + (s?.points_obtenus || 0), 0)
}

const getStudentStatut = (etudiantId) => {
  if (!etudiantId) return 'Non corrigé'
  
  const submissions = Array.isArray(examStore.submissions)
    ? examStore.submissions.filter(s => s && s.etudiant_id === etudiantId)
    : []
    
  if (submissions.length === 0) return 'Non corrigé'
  
  const allCorrigees = submissions.every(s => s && s.points_obtenus !== null)
  const anyCorrigee = submissions.some(s => s && s.points_obtenus !== null)
  
  if (allCorrigees) return 'Corrigé'
  if (anyCorrigee) return 'Partiellement corrigé'
  return 'Non corrigé'
}

const getStudentLastActivity = (etudiantId) => {
  if (!etudiantId) return null
  
  const submissions = Array.isArray(examStore.submissions)
    ? examStore.submissions.filter(s => s && s.etudiant_id === etudiantId)
    : []
    
  if (submissions.length === 0) return null
  
  const lastSub = submissions.reduce((latest, current) => {
    if (!latest) return current
    if (!current) return latest
    return new Date(current.submitted_at || current.auto_saved_at) > new Date(latest.submitted_at || latest.auto_saved_at) ? current : latest
  })
  
  return lastSub?.submitted_at || lastSub?.auto_saved_at
}

const getStudentResponse = (etudiantId, questionId) => {
  if (!etudiantId || !questionId) return 'Pas de réponse'
  
  const submission = Array.isArray(examStore.submissions)
    ? examStore.submissions.find(s => s && s.etudiant_id === etudiantId && s.question_id === questionId)
    : null
    
  if (!submission) return 'Pas de réponse'
  
  const reponse = submission.reponse
  if (!reponse) return 'Pas de réponse'
  
  if (typeof reponse === 'string') return reponse
  
  if (reponse.text) return reponse.text
  if (reponse.option_id) {
    const question = Array.isArray(examStore.questions) 
      ? examStore.questions.find(q => q && q.id === questionId)
      : null
    const option = question?.options?.find(o => o && o.id === reponse.option_id)
    return option ? option.text : `Option ${reponse.option_id}`
  }
  if (reponse.option_ids && reponse.option_ids.length > 0) {
    const question = Array.isArray(examStore.questions) 
      ? examStore.questions.find(q => q && q.id === questionId)
      : null
    const options = question?.options
      ?.filter(o => reponse.option_ids.includes(o.id))
      .map(o => o.text)
      .join(', ')
    return options || `Options: ${reponse.option_ids.join(', ')}`
  }
  
  return JSON.stringify(reponse)
}

const isOptionSelected = (etudiantId, questionId, optionId) => {
  if (!etudiantId || !questionId || !optionId) return false
  
  const submission = Array.isArray(examStore.submissions)
    ? examStore.submissions.find(s => s && s.etudiant_id === etudiantId && s.question_id === questionId)
    : null
    
  if (!submission) return false
  
  const reponse = submission.reponse
  if (!reponse) return false
  
  if (reponse.option_id) {
    return reponse.option_id === optionId
  }
  if (reponse.option_ids && Array.isArray(reponse.option_ids)) {
    return reponse.option_ids.includes(optionId)
  }
  return false
}

const isQuestionCorrigee = (etudiantId, questionId) => {
  if (!etudiantId || !questionId) return false
  
  const submission = Array.isArray(examStore.submissions)
    ? examStore.submissions.find(s => s && s.etudiant_id === etudiantId && s.question_id === questionId)
    : null
    
  return submission?.points_obtenus !== null
}

// ========== MÉTHODES UTILITAIRES ==========
const getInitials = (nom, prenom) => {
  if (!nom && !prenom) return '??'
  return ((nom?.[0] || '') + (prenom?.[0] || '')).toUpperCase()
}

const getNoteColor = (note, max) => {
  if (max === 0) return 'text-gray-600 dark:text-gray-400'
  const pourcentage = (note / max) * 100
  if (pourcentage >= 80) return 'text-green-600 dark:text-green-400'
  if (pourcentage >= 50) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

const getStatutClass = (statut) => {
  const classes = {
    'Corrigé': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    'Non corrigé': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    'Partiellement corrigé': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
  }
  return classes[statut] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
}

const formatDate = (dateString) => {
  if (!dateString) return 'Jamais'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTypeLabel = (type) => {
  const types = {
    qcm_unique: 'QCM Unique',
    qcm_multiple: 'QCM Multiple',
    texte_court: 'Texte court',
    texte_long: 'Texte long',
    vrai_faux: 'Vrai/Faux'
  }
  return types[type] || type
}

const getQuestionsForPart = (partId) => {
  return (examStore.questions || [])
    .filter(q => q && q.part_id === partId)
    .sort((a, b) => (a?.order || 0) - (b?.order || 0))
}

const validatePoints = (question) => {
  if (!question || !question.id) return
  
  if (correctionForm.value[question.id]?.points > question.points) {
    correctionForm.value[question.id].points = question.points
  }
}

const calculateTotalPoints = () => {
  let total = 0
  Object.values(correctionForm.value).forEach(item => {
    if (item && item.points) total += item.points
  })
  return total
}

const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// ========== MÉTHODES DE CORRECTION ==========
const openCorrectionModal = async (etudiant) => {
  if (!etudiant || !etudiant.id) return
  
  selectedEtudiant.value = etudiant
  selectedPartCorrection.value = examStore.parts?.[0] || null
  
  // Initialiser le formulaire de correction avec les valeurs existantes
  correctionForm.value = {}
  
  try {
    // Charger les soumissions spécifiques de l'étudiant
    await examStore.fetchSubmissions(evaluationId, etudiant.id)
    
    // Recharger les soumissions depuis le store
    const submissions = Array.isArray(examStore.submissions) ? examStore.submissions : []
    
    submissions
      .filter(s => s && s.etudiant_id === etudiant.id)
      .forEach(sub => {
        if (sub && sub.question_id) {
          correctionForm.value[sub.question_id] = {
            points: sub.points_obtenus,
            commentaire: sub.metadata?.commentaire_correction || ''
          }
        }
      })
    
    showCorrectionModal.value = true
  } catch (error) {
    console.error('Erreur lors du chargement des soumissions:', error)
    showToastMessage('Erreur lors du chargement')
  }
}

const closeCorrectionModal = () => {
  showCorrectionModal.value = false
  selectedEtudiant.value = null
  selectedPartCorrection.value = null
  correctionForm.value = {}
}

const saveQuestionCorrection = async (question) => {
  if (!selectedEtudiant.value || !selectedEtudiant.value.id || !question || !question.id) return
  
  const formData = correctionForm.value[question.id]
  if (!formData) return
  
  try {
    // Trouver la soumission correspondante
    const submissions = Array.isArray(examStore.submissions) ? examStore.submissions : []
    const submission = submissions.find(
      s => s && s.etudiant_id === selectedEtudiant.value.id && s.question_id === question.id
    )
    
    if (submission && submission.id) {
      await examStore.gradeSubmission(
        submission.id,
        formData.points || 0,
        formData.commentaire || ''
      )
      showToastMessage('Correction enregistrée')
    } else {
      showToastMessage('Soumission non trouvée')
    }
  } catch (error) {
    console.error('Erreur lors de la correction:', error)
    showToastMessage('Erreur lors de l\'enregistrement')
  }
}

const saveAllCorrections = async () => {
  if (!selectedEtudiant.value || !selectedEtudiant.value.id) return
  
  isSavingAll.value = true
  
  try {
    const promises = []
    const submissions = Array.isArray(examStore.submissions) ? examStore.submissions : []
    
    for (const [questionId, data] of Object.entries(correctionForm.value)) {
      const submission = submissions.find(
        s => s && s.etudiant_id === selectedEtudiant.value.id && s.question_id === parseInt(questionId)
      )
      
      if (submission && submission.id && data.points !== undefined) {
        promises.push(
          examStore.gradeSubmission(submission.id, data.points || 0, data.commentaire || '')
        )
      }
    }
    
    if (promises.length > 0) {
      await Promise.all(promises)
      showToastMessage('Toutes les corrections ont été enregistrées')
      closeCorrectionModal()
    } else {
      showToastMessage('Aucune correction à enregistrer')
      closeCorrectionModal()
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    showToastMessage('Erreur lors de l\'enregistrement')
  } finally {
    isSavingAll.value = false
  }
}

// ========== CHARGEMENT INITIAL ==========
onMounted(async () => {
  try {
    // Charger l'examen avec ses parties et questions
    await examStore.loadExam(evaluationId)
    
    // Récupérer toutes les soumissions pour correction si la méthode existe
    if (typeof examStore.fetchAllSubmissions === 'function') {
      const submissionsData = await examStore.fetchAllSubmissions(evaluationId)
      
      if (submissionsData && submissionsData.etudiants) {
        etudiants.value = submissionsData.etudiants
      }
    }
    
    // Alternative si fetchAllSubmissions n'existe pas ou n'a pas retourné d'étudiants
    if (etudiants.value.length === 0 && typeof examStore.fetchAllSessions === 'function') {
      const sessionsResponse = await examStore.fetchAllSessions(evaluationId)
      
      if (sessionsResponse && sessionsResponse.length > 0) {
        etudiants.value = sessionsResponse
          .map(s => s?.etudiant)
          .filter(Boolean)
      }
    }
    
    // Si toujours pas d'étudiants, essayer via le groupe
    if (etudiants.value.length === 0 && examStore.currentEvaluation?.group_id) {
      if (typeof etudiantStore.fetchEtudiantsByGroup === 'function') {
        await etudiantStore.fetchEtudiantsByGroup(examStore.currentEvaluation.group_id)
        etudiants.value = etudiantStore.etudiants || []
      }
    }
    
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
    showToastMessage('Erreur lors du chargement des données')
  } finally {
    isPageLoading.value = false
  }
})
</script>