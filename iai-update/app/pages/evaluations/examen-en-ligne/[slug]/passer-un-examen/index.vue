<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-4 md:p-6 lg:p-8 transition-colors">
    
    <div v-if="isPageLoading" class="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 z-50 flex items-center justify-center">
      <div class="text-center">
        <div class="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Chargement de l'examen...</p>
      </div>
    </div>

    <template v-else>
      <div v-if="examStatus === 'termine'" class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
            <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-red-800 dark:text-red-300">Examen terminé</h3>
            <p class="text-sm text-red-600 dark:text-red-400">Cet examen a pris fin le {{ formatDate(examStore.currentEvaluation?.fin) }}. Vous êtes en mode consultation.</p>
          </div>
        </div>
      </div>

      <div v-else-if="examStatus === 'en_attente'" class="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
            <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-amber-800 dark:text-amber-300">Examen à venir</h3>
            <p class="text-sm text-amber-600 dark:text-amber-400">
              L'examen commencera dans <span class="font-bold text-lg">{{ formatCountdown(timeUntilStart) }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- ========== EN-TÊTE AVEC TIMER ========== -->
      <div class="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <span class="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
            {{ examStore.examTitle }}
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ examenDescription }}</p>
        </div>

        <!-- Timer (différent selon le statut) -->
        <div v-if="examStatus === 'en_cours'" class="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 border border-gray-100 dark:border-gray-700">
          <div class="text-center">
            <p class="text-xs text-gray-500 dark:text-gray-400">Temps restant</p>
            <p class="text-xl sm:text-2xl font-bold" :class="timerColor">
              {{ formatTime(timeRemaining) }}
            </p>
          </div>
          <div class="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
          <div class="text-center">
            <p class="text-xs text-gray-500 dark:text-gray-400">Progression</p>
            <p class="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {{ progression }}%
            </p>
          </div>
        </div>

        <div v-else-if="examStatus === 'en_attente'" class="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 border border-gray-100 dark:border-gray-700">
          <div class="text-center">
            <p class="text-xs text-gray-500 dark:text-gray-400">Début dans</p>
            <p class="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
              {{ formatCountdown(timeUntilStart) }}
            </p>
          </div>
        </div>

        <div v-else-if="examStatus === 'termine'" class="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 border border-gray-100 dark:border-gray-700">
          <div class="text-center">
            <p class="text-xs text-gray-500 dark:text-gray-400">Note obtenue</p>
            <p class="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ getStudentTotalNote() }}/{{ examStore.totalPoints }}
            </p>
          </div>
          <div class="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
          <div class="text-center">
            <p class="text-xs text-gray-500 dark:text-gray-400">Terminé le</p>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              {{ formatDate(examStore.currentEvaluation?.fin) }}
            </p>
          </div>
        </div>
      </div>

      <!-- ========== BARRE DE PROGRESSION (visible seulement si en cours) ========== -->
      <div v-if="examStatus === 'en_cours'" class="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Questions répondues: {{ reponsesCount }}/{{ examStore.totalQuestions }}
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ questionsNonRepondues }} non répondues
          </span>
        </div>
        <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
            :style="{ width: progression + '%' }"
          ></div>
        </div>
      </div>

      <!-- ========== MESSAGE D'INFORMATION SI EXAMEN EN ATTENTE ========== -->
      <div v-if="examStatus === 'en_attente'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
        <svg class="w-20 h-20 mx-auto text-amber-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Examen à venir</h2>
        
        <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          L'examen débutera automatiquement le {{ formatDate(examStore.currentEvaluation?.debut) }} à {{ formatTime(examStore.currentEvaluation?.debut) }}. 
          La page se rafraîchira automatiquement à ce moment.
        </p>

        <div class="inline-flex items-center gap-2 px-6 py-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
          <svg class="w-5 h-5 text-amber-600 dark:text-amber-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-amber-800 dark:text-amber-300 font-medium text-lg">
            Début dans {{ formatCountdown(timeUntilStart) }}
          </span>
        </div>
      </div>

      <template v-if="examStatus === 'en_cours' || examStatus === 'termine'">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          <!-- ========== COLONNE DE GAUCHE - SOMMAIRE ========== -->
          <div class="lg:col-span-1 space-y-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-6">
              <div class="bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-3">
                <h2 class="text-sm font-semibold text-white flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Sommaire
                </h2>
              </div>
              
              <div class="p-3 max-h-[500px] overflow-y-auto">
                <div v-for="(part, partIndex) in examStore.parts" :key="part.id" class="mb-3">
                  <!-- En-tête de la partie -->
                  <button
                    @click="togglePart(part.id)"
                    class="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div class="flex items-center gap-2">
                      <span class="flex items-center justify-center w-5 h-5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-xs font-medium">
                        {{ partIndex + 1 }}
                      </span>
                      <span class="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                        {{ part.titre }}
                      </span>
                    </div>
                    <svg 
                      class="w-4 h-4 text-gray-500 transition-transform"
                      :class="{ 'rotate-180': expandedParts.includes(part.id) }"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <!-- Liste des questions de la partie -->
                  <div v-if="expandedParts.includes(part.id)" class="mt-1 ml-7 space-y-1">
                    <button
                      v-for="(q, qIndex) in getQuestionsForPart(part.id)"
                      :key="q.id"
                      @click="scrollToQuestion(q.id)"
                      class="w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors"
                      :class="[
                        currentQuestionId === q.id 
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      ]"
                    >
                      <span class="flex items-center justify-center w-4 h-4 text-[10px] font-medium rounded-full"
                        :class="getQuestionStatus(q).class"
                      >
                        {{ getQuestionStatus(q).icon }}
                      </span>
                      <span class="text-xs truncate flex-1">{{ truncateText(stripHtml(q.content), 25) }}</span>
                      <span class="text-[10px] text-gray-500 dark:text-gray-400">{{ q.points }} pts</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Bouton de soumission (visible seulement si en cours) -->
              <div v-if="examStatus === 'en_cours'" class="p-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  @click="confirmSubmit"
                  class="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all font-medium text-sm flex items-center justify-center gap-2"
                  :disabled="examStore.isSubmitting || isSubmitting"
                >
                  <svg v-if="!examStore.isSubmitting && !isSubmitting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ examStore.isSubmitting || isSubmitting ? 'Soumission...' : 'Soumettre' }}
                </button>
                <p class="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                  {{ questionsNonRepondues }} question(s) non répondue(s)
                </p>
              </div>

              <!-- Résumé pour examen terminé -->
              <div v-else-if="examStatus === 'termine'" class="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <div class="text-center">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Note finale</p>
                  <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {{ getStudentTotalNote() }}/{{ examStore.totalPoints }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {{ getStudentCorrectAnswers() }} réponses correctes sur {{ examStore.totalQuestions }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- ========== COLONNE DE DROITE - QUESTIONS ========== -->
          <div class="lg:col-span-3 space-y-6">
            <div v-for="(part, partIndex) in examStore.parts" :key="part.id" class="space-y-4">
              <!-- En-tête de la partie -->
              <div class="flex items-center gap-3">
                <div class="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg text-white text-sm font-medium">
                  {{ partIndex + 1 }}
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ part.titre }}</h2>
                  <p v-if="part.description" class="text-sm text-gray-500 dark:text-gray-400">{{ part.description }}</p>
                </div>
              </div>

              <!-- Contexte étude de cas -->
              <div v-if="part.contexte" class="ml-11 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-sm font-medium text-amber-800 dark:text-amber-300">Contexte</span>
                </div>
                <div class="text-sm text-gray-700 dark:text-gray-300 prose prose-sm max-w-none" v-html="part.contexte"></div>
              </div>

              <!-- Questions de la partie -->
              <div class="space-y-4 ml-11">
                <div
                  v-for="(question, qIndex) in getQuestionsForPart(part.id)"
                  :id="`question-${question.id}`"
                  :key="question.id"
                  class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden scroll-mt-4"
                  :ref="el => { if (el) questionElements[question.id] = el }"
                >
                  <!-- En-tête de la question -->
                  <div class="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <span class="flex items-center justify-center w-5 h-5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
                        {{ qIndex + 1 }}
                      </span>
                      <span class="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
                        {{ getTypeLabel(question.type) }}
                      </span>
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ question.points }} pts</span>
                      
                      <!-- Badge pour examen terminé (note obtenue) -->
                      <span v-if="examStatus === 'termine'" 
                            class="text-xs px-2 py-1 rounded-full"
                            :class="getQuestionResultClass(question.id)">
                        {{ getQuestionPoints(question.id) }}/{{ question.points }} pts
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs" :class="getQuestionStatus(question).indicator">
                        {{ getQuestionStatus(question).text }}
                      </span>
                      
                      <!-- Bouton de sauvegarde (visible seulement si en cours) -->
                      <button
                        v-if="examStatus === 'en_cours'"
                        @click="saveCurrentQuestion(question)"
                        class="p-1.5 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        title="Sauvegarder"
                        :disabled="examStore.isLoading || isSaving[question.id]"
                      >
                        <svg v-if="!isSaving[question.id]" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Contenu de la question -->
                  <div class="p-6">
                    <!-- Énoncé -->
                    <div class="mb-4 text-sm text-gray-800 dark:text-gray-200 prose prose-sm max-w-none" v-html="question.content"></div>

                    <!-- Zone de réponse selon le type -->
                    <div class="space-y-4">
                      <!-- QCM Unique -->
                      <div v-if="question.type === 'qcm_unique'" class="space-y-2">
                        <div v-for="option in question.options" :key="option.id" 
                             class="flex items-center p-2 rounded-lg"
                             :class="{
                               'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800': examStatus === 'termine' && option.is_correct,
                               'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800': examStatus === 'termine' && isOptionSelected(question.id, option.id) && !option.is_correct
                             }">
                          <label class="flex items-center gap-3 cursor-pointer w-full">
                            <input
                              type="radio"
                              :name="`q-${question.id}`"
                              :value="option.id"
                              :checked="isOptionSelected(question.id, option.id)"
                              @change="selectOption(question.id, option.id)"
                              class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                              :disabled="examStatus !== 'en_cours' || examStore.isSubmitting || isSubmitting"
                            />
                            <span class="text-sm text-gray-700 dark:text-gray-300">{{ option.text }}</span>
                            
                            <!-- Indicateurs pour examen terminé -->
                            <span v-if="examStatus === 'termine' && option.is_correct" class="ml-2 text-green-600">
                              ✓ (bonne réponse)
                            </span>
                            <span v-else-if="examStatus === 'termine' && isOptionSelected(question.id, option.id) && !option.is_correct" class="ml-2 text-red-600">
                              ✗ (votre choix)
                            </span>
                          </label>
                        </div>
                      </div>

                      <!-- QCM Multiple -->
                      <div v-else-if="question.type === 'qcm_multiple'" class="space-y-2">
                        <div v-for="option in question.options" :key="option.id"
                             class="flex items-center p-2 rounded-lg"
                             :class="{
                               'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800': examStatus === 'termine' && option.is_correct,
                               'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800': examStatus === 'termine' && isOptionSelected(question.id, option.id) && !option.is_correct
                             }">
                          <label class="flex items-center gap-3 cursor-pointer w-full">
                            <input
                              type="checkbox"
                              :value="option.id"
                              :checked="isOptionSelected(question.id, option.id)"
                              @change="toggleOption(question.id, option.id)"
                              class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              :disabled="examStatus !== 'en_cours' || examStore.isSubmitting || isSubmitting"
                            />
                            <span class="text-sm text-gray-700 dark:text-gray-300">{{ option.text }}</span>
                            
                            <!-- Indicateurs pour examen terminé -->
                            <span v-if="examStatus === 'termine' && option.is_correct" class="ml-2 text-green-600">
                              ✓ (bonne réponse)
                            </span>
                            <span v-else-if="examStatus === 'termine' && isOptionSelected(question.id, option.id) && !option.is_correct" class="ml-2 text-red-600">
                              ✗ (votre choix)
                            </span>
                          </label>
                        </div>
                      </div>

                      <!-- Vrai/Faux -->
                      <div v-else-if="question.type === 'vrai_faux'" class="flex gap-4">
                        <div class="flex items-center p-2 rounded-lg"
                             :class="{
                               'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800': examStatus === 'termine' && isCorrectAnswer(question.id, 'vrai'),
                               'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800': examStatus === 'termine' && getResponse(question.id) === 'vrai' && !isCorrectAnswer(question.id, 'vrai')
                             }">
                          <label class="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              :name="`q-${question.id}`"
                              value="vrai"
                              :checked="getResponse(question.id) === 'vrai'"
                              @change="setResponse(question.id, 'vrai')"
                              class="w-4 h-4 text-indigo-600"
                              :disabled="examStatus !== 'en_cours' || examStore.isSubmitting || isSubmitting"
                            />
                            <span class="text-sm text-gray-700 dark:text-gray-300">Vrai</span>
                          </label>
                        </div>
                        <div class="flex items-center p-2 rounded-lg"
                             :class="{
                               'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800': examStatus === 'termine' && isCorrectAnswer(question.id, 'faux'),
                               'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800': examStatus === 'termine' && getResponse(question.id) === 'faux' && !isCorrectAnswer(question.id, 'faux')
                             }">
                          <label class="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              :name="`q-${question.id}`"
                              value="faux"
                              :checked="getResponse(question.id) === 'faux'"
                              @change="setResponse(question.id, 'faux')"
                              class="w-4 h-4 text-indigo-600"
                              :disabled="examStatus !== 'en_cours' || examStore.isSubmitting || isSubmitting"
                            />
                            <span class="text-sm text-gray-700 dark:text-gray-300">Faux</span>
                          </label>
                        </div>
                      </div>

                      <!-- Texte court -->
                      <div v-else-if="question.type === 'texte_court'">
                        <div class="relative">
                          <input
                            type="text"
                            v-model="responses[question.id]"
                            @input="debouncedSave(question)"
                            placeholder="Votre réponse..."
                            class="w-full px-4 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            :disabled="examStatus !== 'en_cours' || examStore.isSubmitting || isSubmitting"
                            :class="{
                              'border-green-500 bg-green-50 dark:bg-green-900/20': examStatus === 'termine' && isCorrectAnswer(question.id, responses[question.id]),
                              'border-red-500 bg-red-50 dark:bg-red-900/20': examStatus === 'termine' && responses[question.id] && !isCorrectAnswer(question.id, responses[question.id])
                            }"
                          />
                          <!-- Indicateur de correction pour examen terminé -->
                          <div v-if="examStatus === 'termine' && responses[question.id]" class="absolute right-2 top-1/2 -translate-y-1/2">
                            <span v-if="isCorrectAnswer(question.id, responses[question.id])" class="text-green-600 text-xs font-medium">
                              ✓ Correct
                            </span>
                            <span v-else class="text-red-600 text-xs font-medium">
                              ✗ Incorrect
                            </span>
                          </div>
                        </div>
                        <!-- Réponse attendue pour examen terminé -->
                        <div v-if="examStatus === 'termine' && question.config?.expected_answer" class="mt-1 text-xs text-gray-500">
                          Réponse attendue: {{ question.config.expected_answer }}
                        </div>
                      </div>

                      <!-- Texte long avec TinyMCE -->
                      <div v-else-if="question.type === 'texte_long'">
                        <Editor
                          api-key="ktf8z0z55enm2wd9xyeoo6qzzoy7w9b629e51wii9y8lw4dx"
                          v-model="responses[question.id]"
                          :init="{
                            height: 300,
                            menubar: false,
                            plugins: [
                              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | blocks | ' +
                              'bold italic backcolor | alignleft aligncenter ' +
                              'alignright alignjustify | bullist numlist outdent indent | ' +
                              'removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                          }"
                          :disabled="examStatus !== 'en_cours' || examStore.isSubmitting || isSubmitting"
                          @input="debouncedSave(question)"
                        />
                        <div class="flex justify-end mt-1">
                          <span class="text-xs text-gray-500 dark:text-gray-400">
                            {{ wordCount(responses[question.id]) }} mots
                          </span>
                        </div>
                      </div>

                      <!-- ========== TABLEAUX DYNAMIQUES (complex_data) ========== -->
                      <div v-else-if="question.type === 'complex_data' && question.complex_data" class="space-y-4">
                        <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div class="flex items-center gap-2 mb-3">
                            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="3" y1="9" x2="21" y2="9"></line>
                              <line x1="3" y1="15" x2="21" y2="15"></line>
                            </svg>
                            <span class="text-sm font-medium text-blue-700 dark:text-blue-300">Tableau d'analyse</span>
                          </div>
                          
                          <!-- Tableau dynamique -->
                          <div class="overflow-x-auto">
                            <table class="w-full text-sm border-collapse">
                              <thead>
                                <tr class="bg-gray-100 dark:bg-gray-700">
                                  <th class="border p-3 text-left font-medium">#</th>
                                  <th v-for="(col, colIdx) in question.complex_data.configuration?.colonnes || []" 
                                      :key="colIdx" 
                                      class="border p-3 text-left font-medium">
                                    {{ col.titre || `Colonne ${String.fromCharCode(65 + colIdx)}` }}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(row, rowIdx) in question.complex_data.data || []" :key="rowIdx">
                                  <td class="border p-3 text-center bg-gray-50 dark:bg-gray-800 font-medium">{{ rowIdx + 1 }}</td>
                                  <td v-for="(col, colIdx) in question.complex_data.configuration?.colonnes || []" 
                                      :key="colIdx" 
                                      class="border p-3">
                                    
                                    <!-- Cellule avec données statiques (type: "data") -->
                                    <template v-if="getCellType(question, rowIdx, colIdx) === 'data'">
                                      <div class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                        {{ getCellData(question, rowIdx, colIdx) }}
                                      </div>
                                    </template>
                                    
                                    <!-- Cellule avec question à remplir (type: "question") -->
                                    <template v-else-if="getCellType(question, rowIdx, colIdx) === 'question'">
                                      <div class="space-y-2">
                                        <!-- Récupérer la configuration de la question pour cette cellule -->
                                        <template v-if="getCellQuestion(question, rowIdx, colIdx)">
                                          <!-- QCM Unique -->
                                          <template v-if="getCellQuestion(question, rowIdx, colIdx).type === 'qcm_unique'">
                                            <select
                                              v-model="tableResponses[`${question.id}_${rowIdx}_${colIdx}`]"
                                              @change="saveTableResponse(question, rowIdx, colIdx)"
                                              class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                              :disabled="examStatus !== 'en_cours'"
                                            >
                                              <option value="">Sélectionnez...</option>
                                              <option v-for="(opt, optIdx) in getCellQuestion(question, rowIdx, colIdx).options || []" 
                                                      :key="optIdx" :value="opt.text">
                                                {{ opt.text || `Option ${optIdx + 1}` }}
                                              </option>
                                            </select>
                                          </template>
                                          
                                          <!-- QCM Multiple -->
                                          <template v-else-if="getCellQuestion(question, rowIdx, colIdx).type === 'qcm_multiple'">
                                            <div class="space-y-1">
                                              <label v-for="(opt, optIdx) in getCellQuestion(question, rowIdx, colIdx).options || []" 
                                                     :key="optIdx" class="flex items-center gap-2">
                                                <input
                                                  type="checkbox"
                                                  :value="opt.text"
                                                  :checked="isTableOptionSelected(question, rowIdx, colIdx, opt.text)"
                                                  @change="toggleTableOption(question, rowIdx, colIdx, opt.text)"
                                                  class="w-4 h-4 text-indigo-600 rounded"
                                                  :disabled="examStatus !== 'en_cours'"
                                                />
                                                <span class="text-sm">{{ opt.text }}</span>
                                              </label>
                                            </div>
                                          </template>
                                          
                                          <!-- Texte court -->
                                          <template v-else-if="getCellQuestion(question, rowIdx, colIdx).type === 'texte_court'">
                                            <input
                                              type="text"
                                              v-model="tableResponses[`${question.id}_${rowIdx}_${colIdx}`]"
                                              @input="debouncedSaveTable(question, rowIdx, colIdx)"
                                              class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                              :disabled="examStatus !== 'en_cours'"
                                              placeholder="Saisissez votre réponse..."
                                            />
                                          </template>
                                          
                                          <!-- Texte long -->
                                          <template v-else-if="getCellQuestion(question, rowIdx, colIdx).type === 'texte_long'">
                                            <textarea
                                              v-model="tableResponses[`${question.id}_${rowIdx}_${colIdx}`]"
                                              @input="debouncedSaveTable(question, rowIdx, colIdx)"
                                              rows="3"
                                              class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                              :disabled="examStatus !== 'en_cours'"
                                              placeholder="Saisissez votre réponse..."
                                            ></textarea>
                                          </template>
                                          
                                          <!-- Par défaut (si type non reconnu) -->
                                          <template v-else>
                                            <input
                                              type="text"
                                              v-model="tableResponses[`${question.id}_${rowIdx}_${colIdx}`]"
                                              @input="debouncedSaveTable(question, rowIdx, colIdx)"
                                              class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                              :disabled="examStatus !== 'en_cours'"
                                              placeholder="Saisissez votre réponse..."
                                            />
                                          </template>
                                        </template>
                                        
                                        <!-- Points de la cellule -->
                                        <div v-if="getCellQuestion(question, rowIdx, colIdx)?.points" class="text-xs text-gray-500 text-right">
                                          {{ getCellQuestion(question, rowIdx, colIdx).points }} pts
                                        </div>
                                      </div>
                                    </template>
                                    
                                    <!-- Cellule vide -->
                                    <span v-else class="text-gray-400">-</span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      <!-- ========== MULTI-PARTIES (multi_parts) ========== -->
                      <div v-else-if="question.type === 'multi_parts' && question.multi_parts" class="space-y-4">
                        <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                          <div class="flex items-center gap-2 mb-3">
                            <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M4 4h16v16H4z"></path>
                              <line x1="9" y1="9" x2="15" y2="15"></line>
                              <line x1="15" y1="9" x2="9" y2="15"></line>
                            </svg>
                            <span class="text-sm font-medium text-amber-700 dark:text-amber-300">Questions à plusieurs parties</span>
                          </div>
                          
                          <div v-for="(part, partIdx) in question.multi_parts.parts || []" :key="partIdx" class="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <div class="flex items-center gap-2 mb-2">
                              <span class="flex items-center justify-center w-6 h-6 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
                                {{ String.fromCharCode(97 + partIdx) }}
                              </span>
                              <span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                                {{ getTypeLabel(part.type) }}
                              </span>
                              <span class="text-sm font-medium">{{ part.points }} pts</span>
                            </div>
                            
                            <p class="text-sm mb-3">{{ part.consigne }}</p>
                            
                            <!-- Champ de réponse pour cette partie -->
                            <div class="mt-2">
                              <template v-if="part.type === 'texte_long'">
                                <textarea
                                  v-model="multiPartResponses[`${question.id}_${partIdx}`]"
                                  @input="debouncedSaveMultiPart(question, partIdx)"
                                  rows="3"
                                  class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                  :disabled="examStatus !== 'en_cours'"
                                  placeholder="Votre réponse..."
                                ></textarea>
                              </template>
                              
                              <template v-else-if="part.type === 'qcm_unique' && part.options && part.options.length > 0">
                                <select
                                  v-model="multiPartResponses[`${question.id}_${partIdx}`]"
                                  @change="saveMultiPartResponse(question, partIdx)"
                                  class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                  :disabled="examStatus !== 'en_cours'"
                                >
                                  <option value="">Sélectionnez...</option>
                                  <option v-for="opt in part.options" :key="opt.id" :value="opt.id">
                                    {{ opt.text }}
                                  </option>
                                </select>
                              </template>
                              
                              <template v-else>
                                <input
                                  type="text"
                                  v-model="multiPartResponses[`${question.id}_${partIdx}`]"
                                  @input="debouncedSaveMultiPart(question, partIdx)"
                                  class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                  :disabled="examStatus !== 'en_cours'"
                                  placeholder="Votre réponse..."
                                />
                              </template>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- ========== RÉDACTION GUIDÉE (guided_writing) ========== -->
                      <div v-else-if="question.type === 'guided_writing' && question.guided_writing" class="space-y-4">
                        <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                          <div class="flex items-center gap-2 mb-3">
                            <svg class="w-5 h-5 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                            <span class="text-sm font-medium text-green-700 dark:text-green-300">Rédaction guidée</span>
                          </div>
                          
                          <div class="space-y-3">
                            <div v-if="question.guided_writing.instructions?.length" class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                              <p class="text-xs font-medium text-gray-600 mb-2">Consignes :</p>
                              <ul class="list-disc list-inside space-y-1">
                                <li v-for="(instruction, idx) in question.guided_writing.instructions" :key="idx" class="text-sm">
                                  {{ instruction }}
                                </li>
                              </ul>
                            </div>
                            
                            <div class="flex gap-4 text-sm text-gray-600">
                              <span>Mots : min {{ question.guided_writing.min_words || 0 }}</span>
                              <span>max {{ question.guided_writing.max_words || 500 }}</span>
                            </div>
                            
                            <Editor
                            api-key="ktf8z0z55enm2wd9xyeoo6qzzoy7w9b629e51wii9y8lw4dx"
                              v-model="responses[question.id]"
                              :init="{
                                height: 300,
                                menubar: false,
                                plugins: [
                                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                ],
                                toolbar: 'undo redo | blocks | ' +
                                  'bold italic backcolor | alignleft aligncenter ' +
                                  'alignright alignjustify | bullist numlist outdent indent | ' +
                                  'removeformat | help',
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                              }"
                              :disabled="examStatus !== 'en_cours' || examStore.isSubmitting || isSubmitting"
                              @input="debouncedSave(question)"
                            />
                            
                            <div class="flex justify-end">
                              <span class="text-sm text-gray-500">
                                {{ wordCount(responses[question.id]) }} mots
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- ========== QUESTIONS STRUCTURÉES (structured_data) ========== -->
                      <div v-else-if="question.type === 'structured_data' && question.structured_data" class="space-y-4">
                        <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                          <div class="flex items-center gap-2 mb-3">
                            <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="9" y1="9" x2="15" y2="15"></line>
                              <line x1="15" y1="9" x2="9" y2="15"></line>
                            </svg>
                            <span class="text-sm font-medium text-purple-700 dark:text-purple-300">Question à choix structuré</span>
                          </div>
                          
                          <div v-for="(item, idx) in question.structured_data.items || []" :key="idx" class="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <p class="text-sm font-medium mb-2">{{ item.question || `Item ${idx + 1}` }}</p>
                            <div class="space-y-2">
                              <label v-for="opt in question.structured_data.structure" :key="opt.nom" class="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                                <input
                                  type="radio"
                                  :name="`structured-${question.id}-${idx}`"
                                  :value="opt.nom"
                                  :checked="getStructuredResponse(question.id, idx) === opt.nom"
                                  @change="setStructuredResponse(question, idx, opt.nom)"
                                  class="w-4 h-4 text-indigo-600"
                                  :disabled="examStatus !== 'en_cours'"
                                />
                                <span class="text-sm font-medium" :style="{ color: opt.couleur }">{{ opt.nom }}</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Indicateur de sauvegarde (visible seulement si en cours) -->
                    <div v-if="examStatus === 'en_cours'" class="mt-3 flex items-center justify-end gap-2 text-xs">
                      <span v-if="isSaving[question.id]" class="text-amber-600 dark:text-amber-400">
                        Sauvegarde...
                      </span>
                      <span v-else-if="savedStates[question.id]" class="text-green-600 dark:text-green-400">
                        ✓ Sauvegardé
                      </span>
                      <span v-else-if="responses[question.id] || Object.keys(tableResponses).some(key => key.startsWith(question.id + '_')) || Object.keys(multiPartResponses).some(key => key.startsWith(question.id + '_')) || Object.keys(structuredResponses).some(key => key.startsWith(question.id + '_'))" class="text-gray-400">
                        Non sauvegardé
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useExamStore } from '~~/stores/exam'
import Editor from '@tinymce/tinymce-vue'

const route = useRoute()
const examStore = useExamStore()

const evaluationId = route.params.slug

// ========== DONNÉES LOCALES ==========
const isPageLoading = ref(true)
const isSubmitting = ref(false)
const currentQuestionId = ref(null)
const expandedParts = ref([])
const responses = ref({}) // Réponses simples
const isSaving = ref({})
const savedStates = ref({})
const showSubmitModal = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const questionElements = ref({})
const currentUser = ref(null)

// Nouvelles structures pour les questions complexes
const tableResponses = ref({})      // Pour les tableaux
const multiPartResponses = ref({})  // Pour les multi-parties
const structuredResponses = ref({}) // Pour les structurés

// Variables pour les timers
const timeUntilStart = ref(0)
const timeRemaining = ref(0)

// Timers
let countdownInterval = null
let examTimerInterval = null
let autoSaveInterval = null

// ========== STATUT DE L'EXAMEN ==========
const examStatus = computed(() => {
  if (!examStore.currentEvaluation) return 'chargement'
  
  const now = new Date()
  const debut = new Date(examStore.currentEvaluation.debut)
  const fin = new Date(examStore.currentEvaluation.fin)
  
  if (now > fin) return 'termine'
  if (now < debut) return 'en_attente'
  return 'en_cours'
})

// Récupérer l'utilisateur depuis localStorage
const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      return JSON.parse(userStr)
    }
    return null
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error)
    return null
  }
}

const examenDescription = computed(() => {
  if (!examStore.currentEvaluation) return 'Chargement...'
  return `Durée: ${examStore.examDuration} min • ${examStore.currentEvaluation.type}`
})

const timerColor = computed(() => {
  if (timeRemaining.value < 300) return 'text-red-600 dark:text-red-400' // < 5 min
  if (timeRemaining.value < 900) return 'text-amber-600 dark:text-amber-400' // < 15 min
  return 'text-emerald-600 dark:text-emerald-400'
})

// ========== COMPUTED ==========
const totalQuestions = computed(() => examStore.totalQuestions)
const reponsesCount = computed(() => {
  let count = Object.keys(responses.value).length
  
  // Compter les réponses de tableaux
  count += Object.keys(tableResponses.value).length
  
  // Compter les réponses multi-parties
  count += Object.keys(multiPartResponses.value).length
  
  // Compter les réponses structurées
  count += Object.keys(structuredResponses.value).length
  
  return count
})
const questionsNonRepondues = computed(() => totalQuestions.value - reponsesCount.value)
const progression = computed(() => {
  return totalQuestions.value > 0 ? Math.round((reponsesCount.value / totalQuestions.value) * 100) : 0
})

// ========== MÉTHODES UTILITAIRES ==========
const formatTime = (seconds) => {
  if (!seconds && seconds !== 0) return '00:00:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const formatCountdown = (seconds) => {
  if (seconds <= 0) return '00:00:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const getTypeLabel = (type) => {
  const types = {
    qcm_unique: 'QCM Unique',
    qcm_multiple: 'QCM Multiple',
    texte_court: 'Texte court',
    texte_long: 'Texte long',
    vrai_faux: 'Vrai/Faux',
    complex_data: 'Tableau',
    structured_data: 'Structuré',
    multi_parts: 'Multi-parties',
    guided_writing: 'Rédaction'
  }
  return types[type] || type
}

const stripHtml = (html) => {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

const truncateText = (text, length) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

const getQuestionsForPart = (partId) => {
  return examStore.questions.filter(q => q.part_id === partId).sort((a, b) => a.order - b.order)
}

const getQuestionStatus = (question) => {
  let hasResponse = false
  
  if (question.type === 'complex_data') {
    // Vérifier si au moins une cellule du tableau est remplie
    hasResponse = Object.keys(tableResponses.value).some(key => key.startsWith(`${question.id}_`))
  } else if (question.type === 'multi_parts') {
    // Vérifier si au moins une partie est remplie
    hasResponse = Object.keys(multiPartResponses.value).some(key => key.startsWith(`${question.id}_`))
  } else if (question.type === 'structured_data') {
    // Vérifier si au moins un item est rempli
    hasResponse = Object.keys(structuredResponses.value).some(key => key.startsWith(`${question.id}_`))
  } else {
    hasResponse = responses.value[question.id] !== undefined && 
                  responses.value[question.id] !== '' &&
                  (Array.isArray(responses.value[question.id]) 
                    ? responses.value[question.id].length > 0 
                    : true)
  }
  
  if (hasResponse) {
    return {
      icon: '✓',
      text: 'Répondu',
      class: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      indicator: 'text-green-600 dark:text-green-400'
    }
  }
  return {
    icon: '○',
    text: 'Non répondu',
    class: 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
    indicator: 'text-gray-400'
  }
}

const isOptionSelected = (questionId, optionId) => {
  const response = responses.value[questionId]
  if (Array.isArray(response)) {
    return response.includes(optionId)
  }
  return response === optionId
}

const wordCount = (text) => {
  if (!text) return 0
  return text.trim().split(/\s+/).length
}

// ========== MÉTHODES POUR TABLEAUX DYNAMIQUES ==========
const getCellConfig = (question, rowIdx, colIdx) => {
  if (!question.complex_data?.cell_configuration) return null
  const key = `${rowIdx}-${colIdx}`
  return question.complex_data.cell_configuration[key]
}

const getCellType = (question, rowIdx, colIdx) => {
  const config = getCellConfig(question, rowIdx, colIdx)
  return config?.type || null
}

const getCellData = (question, rowIdx, colIdx) => {
  const config = getCellConfig(question, rowIdx, colIdx)
  if (config?.type === 'data') {
    return config.data
  }
  return null
}

const getCellQuestion = (question, rowIdx, colIdx) => {
  const config = getCellConfig(question, rowIdx, colIdx)
  if (config?.type === 'question') {
    return config.question
  }
  return null
}

const isTableOptionSelected = (question, rowIdx, colIdx, optionText) => {
  const key = `${question.id}_${rowIdx}_${colIdx}`
  const response = tableResponses.value[key]
  if (Array.isArray(response)) {
    return response.includes(optionText)
  }
  return response === optionText
}

const toggleTableOption = async (question, rowIdx, colIdx, optionText) => {
  const key = `${question.id}_${rowIdx}_${colIdx}`
  
  if (!tableResponses.value[key]) {
    tableResponses.value[key] = []
  }
  
  const index = tableResponses.value[key].indexOf(optionText)
  if (index === -1) {
    tableResponses.value[key].push(optionText)
  } else {
    tableResponses.value[key].splice(index, 1)
  }
  
  await saveTableResponse(question, rowIdx, colIdx)
}

/**
 * 🔴 IMPORTANT: Sauvegarde d'une cellule de tableau
 */
const saveTableResponse = async (question, rowIdx, colIdx) => {
  const key = `${question.id}_${rowIdx}_${colIdx}`
  isSaving.value[key] = true
  
  try {
    // Structure complète pour une réponse de tableau
    const reponseData = {
      type: 'complex_data',
      data: {
        row: rowIdx,
        column: colIdx,
        cell_key: `${rowIdx}-${colIdx}`,
        value: tableResponses.value[key]
      }
    }
    
    // Appel API unifié
    await examStore.saveResponse(
      evaluationId, 
      question.id, 
      reponseData, 
      currentUser.value.id
    )
    
    isSaving.value[key] = false
    savedStates.value[key] = true
    
    showToastMessage('Cellule sauvegardée')
    
    setTimeout(() => {
      savedStates.value[key] = false
    }, 2000)
  } catch (error) {
    console.error('Erreur sauvegarde tableau:', error)
    isSaving.value[key] = false
    showToastMessage('Erreur de sauvegarde', 'error')
  }
}

// ========== MÉTHODES POUR QUESTIONS STRUCTURÉES ==========
const getStructuredResponse = (questionId, itemIdx) => {
  const key = `${questionId}_${itemIdx}`
  return structuredResponses.value[key]
}

const setStructuredResponse = async (question, itemIdx, value) => {
  const key = `${question.id}_${itemIdx}`
  structuredResponses.value[key] = value
  
  isSaving.value[key] = true
  
  try {
    const reponseData = {
      type: 'structured_data',
      data: {
        item: itemIdx,
        value: value
      }
    }
    
    await examStore.saveResponse(
      evaluationId, 
      question.id, 
      reponseData, 
      currentUser.value.id
    )
    
    isSaving.value[key] = false
    savedStates.value[key] = true
    
    showToastMessage('Sauvegardé')
    
    setTimeout(() => {
      savedStates.value[key] = false
    }, 2000)
  } catch (error) {
    console.error('Erreur sauvegarde structurée:', error)
    isSaving.value[key] = false
  }
}

// ========== MÉTHODES POUR MULTI-PARTIES ==========
/**
 * 🔴 IMPORTANT: Sauvegarde d'une partie de question multi-parties
 */
const saveMultiPartResponse = async (question, partIdx) => {
  const key = `${question.id}_${partIdx}`
  
  isSaving.value[key] = true
  
  try {
    const reponseData = {
      type: 'multi_parts',
      data: {
        part: partIdx,
        value: multiPartResponses.value[key]
      }
    }
    
    await examStore.saveResponse(
      evaluationId, 
      question.id, 
      reponseData, 
      currentUser.value.id
    )
    
    isSaving.value[key] = false
    savedStates.value[key] = true
    
    showToastMessage('Partie sauvegardée')
    
    setTimeout(() => {
      savedStates.value[key] = false
    }, 2000)
  } catch (error) {
    console.error('Erreur sauvegarde multi-parties:', error)
    isSaving.value[key] = false
  }
}

// ========== MÉTHODES D'INTERACTION DE BASE ==========
const selectOption = async (questionId, optionId) => {
  if (isSubmitting.value || examStatus.value !== 'en_cours') return
  responses.value[questionId] = optionId
  const question = examStore.questions.find(q => q.id === questionId)
  if (question) await saveCurrentQuestion(question)
}

const toggleOption = async (questionId, optionId) => {
  if (isSubmitting.value || examStatus.value !== 'en_cours') return
  if (!responses.value[questionId]) {
    responses.value[questionId] = []
  }
  
  const index = responses.value[questionId].indexOf(optionId)
  if (index === -1) {
    responses.value[questionId].push(optionId)
  } else {
    responses.value[questionId].splice(index, 1)
  }
  
  const question = examStore.questions.find(q => q.id === questionId)
  if (question) await saveCurrentQuestion(question)
}

const setResponse = async (questionId, value) => {
  if (isSubmitting.value || examStatus.value !== 'en_cours') return
  responses.value[questionId] = value
  const question = examStore.questions.find(q => q.id === questionId)
  if (question) await saveCurrentQuestion(question)
}

const getResponse = (questionId) => {
  return responses.value[questionId]
}

/**
 * 🔴 IMPORTANT: Sauvegarde d'une réponse simple
 */
const saveCurrentQuestion = async (question) => {
  if (!question || isSubmitting.value || examStatus.value !== 'en_cours') return
  
  isSaving.value[question.id] = true
  
  try {
    let reponseData
    
    if (question.type === 'qcm_unique' || question.type === 'vrai_faux') {
      reponseData = { option_id: responses.value[question.id] }
    } else if (question.type === 'qcm_multiple') {
      reponseData = { option_ids: responses.value[question.id] || [] }
    } else {
      reponseData = { text: responses.value[question.id] || '' }
    }
    
    await examStore.saveResponse(evaluationId, question.id, reponseData, currentUser.value.id)
    
    isSaving.value[question.id] = false
    savedStates.value[question.id] = true
    
    showToastMessage('Sauvegardé')
    
    setTimeout(() => {
      savedStates.value[question.id] = false
    }, 2000)
  } catch (error) {
    console.error('Erreur sauvegarde:', error)
    isSaving.value[question.id] = false
    showToastMessage('Erreur de sauvegarde', 'error')
  }
}

// Debounce helpers
function useDebounceFn(fn, delay) {
  let timeout = null
  return (...args) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

const debouncedSave = useDebounceFn(saveCurrentQuestion, 1000)
const debouncedSaveTable = useDebounceFn(saveTableResponse, 1000)
const debouncedSaveMultiPart = useDebounceFn(saveMultiPartResponse, 1000)

const scrollToQuestion = (questionId) => {
  currentQuestionId.value = questionId
  questionElements.value[questionId]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const togglePart = (partId) => {
  const index = expandedParts.value.indexOf(partId)
  if (index === -1) {
    expandedParts.value.push(partId)
  } else {
    expandedParts.value.splice(index, 1)
  }
}

const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const confirmSubmit = () => {
  if (examStatus.value !== 'en_cours') return
  showSubmitModal.value = true
}

const submitExam = async () => {
  if (isSubmitting.value || examStatus.value !== 'en_cours') return
  
  isSubmitting.value = true
  showSubmitModal.value = false
  
  try {
    await examStore.submitAllExam(evaluationId, currentUser.value.id)
    showToastMessage('Examen soumis avec succès !')
    
    setTimeout(() => {
      navigateTo(`/evaluations/examen-en-ligne/${evaluationId}/passer-un-examen`)
    }, 2000)
  } catch (error) {
    console.error('Erreur soumission:', error)
    showToastMessage('Erreur lors de la soumission', 'error')
    isSubmitting.value = false
  }
}

// ========== AUTO-SAVE MANUEL ==========
const startAutoSave = () => {
  if (autoSaveInterval) clearInterval(autoSaveInterval)
  
  autoSaveInterval = setInterval(() => {
    if (examStatus.value !== 'en_cours') return
    
    // Sauvegarder toutes les réponses non sauvegardées
    Object.keys(responses.value).forEach(questionId => {
      if (!savedStates.value[questionId]) {
        const question = examStore.questions.find(q => q.id === parseInt(questionId))
        if (question) saveCurrentQuestion(question)
      }
    })
    
    Object.keys(tableResponses.value).forEach(key => {
      if (!savedStates.value[key]) {
        const [questionId, rowIdx, colIdx] = key.split('_')
        const question = examStore.questions.find(q => q.id === parseInt(questionId))
        if (question) saveTableResponse(question, parseInt(rowIdx), parseInt(colIdx))
      }
    })
    
    Object.keys(multiPartResponses.value).forEach(key => {
      if (!savedStates.value[key]) {
        const [questionId, partIdx] = key.split('_')
        const question = examStore.questions.find(q => q.id === parseInt(questionId))
        if (question) saveMultiPartResponse(question, parseInt(partIdx))
      }
    })
  }, 30000) // Toutes les 30 secondes
}

// ========== MÉTHODES POUR EXAMEN TERMINÉ ==========
const getStudentTotalNote = () => {
  return examStore.submissions.reduce((sum, s) => sum + (s.points_obtenus || 0), 0)
}

const getStudentCorrectAnswers = () => {
  return examStore.submissions.filter(s => s.is_correct === true).length
}

const getQuestionPoints = (questionId) => {
  const submission = examStore.submissions.find(s => s.question_id === questionId)
  return submission?.points_obtenus || 0
}

const getQuestionResultClass = (questionId) => {
  const submission = examStore.submissions.find(s => s.question_id === questionId)
  if (!submission) return 'bg-gray-100 dark:bg-gray-700 text-gray-600'
  if (submission.is_correct) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
  return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
}

const isCorrectAnswer = (questionId, value) => {
  const question = examStore.questions.find(q => q.id === questionId)
  if (!question) return false
  
  if (question.type === 'vrai_faux' || question.type === 'qcm_unique') {
    const correctOption = question.options?.find(o => o.is_correct)
    return correctOption && value === correctOption.id
  }
  
  if (question.type === 'texte_court') {
    const expected = question.config?.expected_answer?.toLowerCase()
    return expected && value?.toLowerCase() === expected
  }
  
  return false
}

// ========== FONCTIONS DE MISE À JOUR DES TIMERS ==========
const updateCountdown = () => {
  if (!examStore.currentEvaluation) return
  
  const now = new Date()
  const debut = new Date(examStore.currentEvaluation.debut)
  const diff = Math.max(0, Math.floor((debut - now) / 1000))
  
  timeUntilStart.value = diff
  
  if (diff <= 0 && examStatus.value === 'en_attente') {
    window.location.reload()
  }
}

const updateExamTimer = () => {
  if (!examStore.currentEvaluation) return
  
  const now = new Date()
  const fin = new Date(examStore.currentEvaluation.fin)
  const diff = Math.max(0, Math.floor((fin - now) / 1000))
  
  timeRemaining.value = diff
  
  if (diff <= 0 && examStatus.value === 'en_cours' && !isSubmitting.value) {
    submitExam()
  }
}

// ========== GESTION DES TIMERS ==========
const startCountdown = () => {
  if (countdownInterval) clearInterval(countdownInterval)
  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
}

const startExamTimer = () => {
  if (examTimerInterval) clearInterval(examTimerInterval)
  updateExamTimer()
  examTimerInterval = setInterval(updateExamTimer, 1000)
}

// ========== CHARGEMENT INITIAL ==========
onMounted(async () => {
  try {
    currentUser.value = getUserFromStorage()
    
    if (!currentUser.value) {
      showToastMessage('Utilisateur non connecté', 'error')
      setTimeout(() => navigateTo('/connexion'), 2000)
      return
    }
    
    await examStore.loadExam(evaluationId)
    await examStore.fetchSubmissions(evaluationId, currentUser.value.id)
    
    /**
     * 🔴 IMPORTANT: Restaurer les réponses existantes
     */
    examStore.submissions.forEach(submission => {
      if (submission.reponse) {
        // Réponse complexe avec type
        if (submission.reponse.type) {
          switch (submission.reponse.type) {
            case 'complex_data':
              if (submission.reponse.data) {
                const key = `${submission.question_id}_${submission.reponse.data.row}_${submission.reponse.data.column}`
                tableResponses.value[key] = submission.reponse.data.value
              }
              break
              
            case 'multi_parts':
              if (submission.reponse.data) {
                const key = `${submission.question_id}_${submission.reponse.data.part}`
                multiPartResponses.value[key] = submission.reponse.data.value
              }
              break
              
            case 'structured_data':
              if (submission.reponse.data) {
                const key = `${submission.question_id}_${submission.reponse.data.item}`
                structuredResponses.value[key] = submission.reponse.data.value
              }
              break
          }
        } 
        // Réponse simple
        else {
          if (submission.reponse.option_id) {
            responses.value[submission.question_id] = submission.reponse.option_id
          } else if (submission.reponse.option_ids) {
            responses.value[submission.question_id] = submission.reponse.option_ids
          } else if (submission.reponse.text) {
            responses.value[submission.question_id] = submission.reponse.text
          }
        }
      }
    })
    
    if (examStatus.value === 'en_attente') {
      startCountdown()
    } else if (examStatus.value === 'en_cours') {
      await examStore.startExam(evaluationId, currentUser.value.id)
      
      if (examStore.parts.length > 0) {
        expandedParts.value.push(examStore.parts[0].id)
      }
      
      startExamTimer()
      startAutoSave()
    } else if (examStatus.value === 'termine') {
      if (examStore.parts.length > 0) {
        expandedParts.value.push(examStore.parts[0].id)
      }
    }
    
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
    showToastMessage('Erreur lors du chargement de l\'examen', 'error')
  } finally {
    isPageLoading.value = false
  }
})

onUnmounted(() => {
  if (examTimerInterval) clearInterval(examTimerInterval)
  if (countdownInterval) clearInterval(countdownInterval)
  if (autoSaveInterval) clearInterval(autoSaveInterval)
})
</script>

<style scoped>
/* Animation de sauvegarde */
@keyframes savePulse {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}

.saving {
  animation: savePulse 1.5s infinite;
}

/* Style pour TinyMCE */
.prose {
  max-width: none;
}

.prose p {
  margin: 0.5em 0;
}

/* Scroll margin pour les questions */
.scroll-mt-4 {
  scroll-margin-top: 1rem;
}

/* Styles pour les tableaux */
table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
  text-align: left;
}

.dark th, .dark td {
  border-color: #374151;
}

/* Espacement amélioré */
.p-6 {
  padding: 1.5rem;
}

.ml-11 {
  margin-left: 2.75rem;
}

/* Style pour l'éditeur TinyMCE */
.tox-tinymce {
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.dark .tox-tinymce {
  border-color: #374151;
}

/* Style pour les cellules de tableau */
.whitespace-pre-line {
  white-space: pre-line;
}

/* Style pour les badges de points */
.text-right {
  text-align: right;
}
</style>