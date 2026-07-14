<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-4 md:p-6 lg:p-8 transition-colors">
    
    <!-- ========== LOADING SKELETON ========== -->
    <div v-if="isPageLoading" class="animate-pulse space-y-8">
      <!-- Header Skeleton -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="space-y-3">
          <div class="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div class="h-4 w-96 bg-gray-100 dark:bg-gray-800 rounded"></div>
        </div>
        <div class="h-16 w-48 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"></div>
      </div>

      <!-- Progress Bar Skeleton -->
      <div class="h-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
        <div class="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div class="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full"></div>
      </div>

      <!-- Main Content Skeleton -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar Skeleton -->
        <div class="lg:col-span-1 h-[500px] bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"></div>
        <!-- Question Skeleton -->
        <div class="lg:col-span-3 space-y-6">
          <div v-for="i in 2" :key="i" class="h-96 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"></div>
        </div>
      </div>
    </div>

    <template v-else>
      <div v-if="canSeeCorrection" class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
            <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-red-800 dark:text-red-300">Examen terminé</h3>
            <p class="text-sm text-red-600 dark:text-red-400">Cet examen a pris fin le {{ formatDateTime(examStore.currentEvaluation && examStore.currentEvaluation.fin) }}. Vous êtes en mode consultation et pouvez voir la correction.</p>
          </div>
        </div>
      </div>

      <div v-else-if="examStatus === 'termine' && !canSeeCorrection" class="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-blue-800 dark:text-blue-300">Examen terminé - Correction en cours</h3>
            <p class="text-sm text-blue-600 dark:text-blue-400">L'examen est officiellement terminé. Les résultats seront affichés dès que le professeur aura validé et publié les notes.</p>
          </div>
        </div>
      </div>

      <div v-else-if="hasSubmitted" class="mb-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
            <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-emerald-800 dark:text-emerald-300">Copie soumise avec succès</h3>
            <p class="text-sm text-emerald-600 dark:text-emerald-400">Votre participation a été enregistrée. Les résultats seront disponibles une fois l'examen officiellement terminé et les notes publiées.</p>
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

        <div v-else-if="canSeeCorrection" class="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 border border-gray-100 dark:border-gray-700">
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
              {{ formatDate(examStore.currentEvaluation && examStore.currentEvaluation.fin) }}
            </p>
          </div>
        </div>

        <div v-else-if="examStatus === 'termine'" class="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 border border-gray-100 dark:border-gray-700">
          <div class="text-center px-4">
            <p class="text-xs text-gray-500 dark:text-gray-400">Statut</p>
            <p class="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              En cours de correction
            </p>
          </div>
          <div class="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
          <div class="text-center">
            <p class="text-xs text-gray-500 dark:text-gray-400">Terminé le</p>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              {{ formatDate(examStore.currentEvaluation && examStore.currentEvaluation.fin) }}
            </p>
          </div>
        </div>

        <div v-else-if="hasSubmitted" class="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 border border-gray-100 dark:border-gray-700">
          <div class="text-center px-4">
            <p class="text-xs text-gray-500 dark:text-gray-400">Statut</p>
            <p class="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Copie Soumise
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
          L'examen débutera automatiquement le {{ formatDate(examStore.currentEvaluation && examStore.currentEvaluation.debut) }} à {{ formatTimeFromDate(examStore.currentEvaluation && examStore.currentEvaluation.debut) }}. 
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

      <!-- ========== DIALOGUE ANTI-TRICHE ========== -->
      <TransitionRoot appear :show="showCheatWarning" as="template">
        <Dialog as="div" class="relative z-[100]" @close="showCheatWarning = false">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </TransitionChild>

          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all border-2 border-red-500">
                  <div class="flex items-center gap-4 text-red-600 mb-4">
                    <div class="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <DialogTitle as="h3" class="text-xl font-bold leading-6">
                      Avertissement de sécurité
                    </DialogTitle>
                  </div>

                  <div class="mt-2 space-y-3">
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Une activité suspecte a été détectée durant l'examen :
                    </p>
                    <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                      <p class="text-sm font-semibold text-red-700 dark:text-red-300">{{ cheatReason }}</p>
                    </div>
                    <p class="text-xs text-gray-500 italic">
                      Note : Quitter l'onglet ou la fenêtre de l'examen est strictement interdit. Vos actions sont enregistrées et peuvent entraîner une annulation de votre copie.
                    </p>
                  </div>

                  <div class="mt-6 flex justify-between items-center">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Avertissement : <span class="text-red-600">{{ cheatWarnings }}</span> / {{ maxWarnings }}
                    </div>
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors"
                      @click="showCheatWarning = false"
                    >
                      J'ai compris
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>

      <template v-if="examStatus === 'en_cours' || examStatus === 'termine'">
        <!-- ========== ÉTAT VIDE (DESIGN ULTRA-LIGHT ELITE) ========== -->
        <div v-if="examStore.parts.length === 0" class="max-w-4xl mx-auto py-20 px-6">
          <div class="relative bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-[40px] border border-white dark:border-white/10 shadow-2xl shadow-indigo-100 dark:shadow-none p-10 md:p-16 overflow-hidden">
            <!-- Cercles de lumière colorés -->
            <div class="absolute -top-20 -left-20 w-64 h-64 bg-blue-100/50 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-100/50 dark:bg-purple-500/10 rounded-full blur-3xl"></div>

            <div class="relative flex flex-col items-center text-center">
              <!-- Illustration "Crystal" -->
              <div class="mb-10">
                <div class="w-28 h-28 bg-gradient-to-tr from-blue-50 to-indigo-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-[32px] flex items-center justify-center shadow-inner relative group">
                  <svg class="w-14 h-14 text-indigo-500 dark:text-indigo-300 transform group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  
                  <!-- Particules brillantes -->
                  <div class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full blur-[2px] animate-pulse"></div>
                  <div class="absolute bottom-2 left-0 w-2 h-2 bg-blue-400 rounded-full blur-[1px]"></div>
                </div>
              </div>

              <!-- Titre et Message -->
              <div class="max-w-lg space-y-6">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white tracking-tight">
                  Espace en cours de <span class="text-indigo-600 dark:text-indigo-400">préparation</span>
                </h2>
                <p class="text-gray-500 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                  L'examen est bien répertorié, mais les questions n'ont pas encore été activées. Votre session s'ouvrira dès que le contenu sera disponible.
                </p>
              </div>

              <!-- Actions Lumineuses -->
              <div class="mt-12 flex flex-col sm:flex-row items-center gap-4">
                <button 
                  @click="handleRefreshData"
                  class="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                  <svg class="w-5 h-5" :class="{ 'animate-spin': isPageLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Vérifier à nouveau
                </button>
                
                <NuxtLink 
                  to="/evaluations/etudiant/mes-examens"
                  class="px-8 py-4 bg-white dark:bg-white/10 text-indigo-600 dark:text-white border border-indigo-100 dark:border-white/20 rounded-2xl font-bold hover:bg-indigo-50 dark:hover:bg-white/20 transition-all"
                >
                  Quitter l'examen
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
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
                      <span v-if="(examStatus === 'en_cours' && !hasSubmitted) || canSeeCorrection" class="text-[10px] text-gray-500 dark:text-gray-400">{{ getQuestionTotalPoints(q) }} pts</span>
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

              <!-- Résumé pour examen terminé avec correction -->
              <div v-else-if="canSeeCorrection" class="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
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

              <!-- État soumis avant correction -->
              <div v-else-if="hasSubmitted" class="p-4 border-t border-gray-200 dark:border-gray-700 bg-emerald-50 dark:bg-emerald-900/20 text-center">
                <div class="flex flex-col items-center gap-2">
                  <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-sm font-bold text-emerald-700 dark:text-emerald-300 uppercase">Copie Soumise</p>
                  <p class="text-[10px] text-emerald-600 dark:text-emerald-400 italic">En attente de la clôture de l'examen pour les résultats</p>
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
                      <span v-if="(examStatus === 'en_cours' && !hasSubmitted) || canSeeCorrection" class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ getQuestionTotalPoints(question) }} pts</span>
                      
                      <!-- Badge pour examen terminé (note obtenue) -->
                      <span v-if="canSeeCorrection" 
                            class="text-xs px-2 py-1 rounded-full"
                            :class="getQuestionResultClass(question.id)">
                        {{ getQuestionPoints(question.id) }}/{{ getQuestionTotalPoints(question) }} pts
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
                               'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800': canSeeCorrection && option.is_correct,
                               'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800': canSeeCorrection && isOptionSelected(question.id, option.id) && !option.is_correct
                             }">
                          <label class="flex items-center gap-3 cursor-pointer w-full">
                            <input
                              type="radio"
                              :name="`q-${question.id}`"
                              :value="option.id"
                              :checked="isOptionSelected(question.id, option.id)"
                              @change="selectOption(question.id, option.id)"
                              class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                              :disabled="examStatus !== 'en_cours' || hasSubmitted || examStore.isSubmitting || isSubmitting"
                            />
                            <span class="text-sm text-gray-700 dark:text-gray-300">{{ option.text }}</span>
                            
                            <!-- Indicateurs pour examen terminé -->
                            <template v-if="canSeeCorrection">
                              <span v-if="option.is_correct" class="ml-2 text-green-600">
                                ✓ (bonne réponse)
                              </span>
                              <span v-else-if="isOptionSelected(question.id, option.id) && !option.is_correct" class="ml-2 text-red-600">
                                ✗ (votre choix)
                              </span>
                            </template>
                          </label>
                        </div>

                        <!-- Justification -->
                        <div v-if="question.config?.requireJustification" class="mt-3">
                          <label class="block text-xs font-medium text-gray-500 mb-1">
                            Justification <span class="text-red-500">*</span>
                          </label>
                          <textarea
                            v-model="justifications[question.id]"
                            @input="debouncedSave(question)"
                            rows="2"
                            class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                            placeholder="Justifiez votre réponse..."
                            :disabled="examStatus !== 'en_cours' || hasSubmitted || examStore.isSubmitting || isSubmitting"
                          ></textarea>
                        </div>
                      </div>

                      <!-- QCM Multiple -->
                      <div v-else-if="question.type === 'qcm_multiple'" class="space-y-2">
                        <div v-for="option in question.options" :key="option.id"
                             class="flex items-center p-2 rounded-lg"
                             :class="{
                               'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800': canSeeCorrection && option.is_correct,
                               'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800': canSeeCorrection && isOptionSelected(question.id, option.id) && !option.is_correct
                             }">
                          <label class="flex items-center gap-3 cursor-pointer w-full">
                            <input
                              type="checkbox"
                              :value="option.id"
                              :checked="isOptionSelected(question.id, option.id)"
                              @change="toggleOption(question.id, option.id)"
                              class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              :disabled="examStatus !== 'en_cours' || hasSubmitted || examStore.isSubmitting || isSubmitting"
                            />
                            <span class="text-sm text-gray-700 dark:text-gray-300">{{ option.text }}</span>
                            
                            <!-- Indicateurs pour examen terminé -->
                            <template v-if="canSeeCorrection">
                              <span v-if="option.is_correct" class="ml-2 text-green-600">
                                ✓ (bonne réponse)
                              </span>
                              <span v-else-if="isOptionSelected(question.id, option.id) && !option.is_correct" class="ml-2 text-red-600">
                                ✗ (votre choix)
                              </span>
                            </template>
                          </label>
                        </div>

                        <!-- Justification -->
                        <div v-if="question.config?.requireJustification" class="mt-3">
                          <label class="block text-xs font-medium text-gray-500 mb-1">
                            Justification <span class="text-red-500">*</span>
                          </label>
                          <textarea
                            v-model="justifications[question.id]"
                            @input="debouncedSave(question)"
                            rows="2"
                            class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                            placeholder="Justifiez votre réponse..."
                            :disabled="examStatus !== 'en_cours' || hasSubmitted || examStore.isSubmitting || isSubmitting"
                          ></textarea>
                        </div>
                      </div>

                      <!-- Vrai/Faux -->
                      <div v-else-if="question.type === 'vrai_faux'" class="flex gap-4">
                        <div class="flex items-center p-2 rounded-lg"
                             :class="{
                               'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800': canSeeCorrection && isCorrectAnswer(question.id, 'vrai'),
                               'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800': canSeeCorrection && getResponse(question.id) === 'vrai' && !isCorrectAnswer(question.id, 'vrai')
                             }">
                          <label class="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              :name="`q-${question.id}`"
                              value="vrai"
                              :checked="getResponse(question.id) === 'vrai'"
                              @change="setResponse(question.id, 'vrai')"
                              class="w-4 h-4 text-indigo-600"
                              :disabled="examStatus !== 'en_cours' || hasSubmitted || examStore.isSubmitting || isSubmitting"
                            />
                            <span class="text-sm text-gray-700 dark:text-gray-300">Vrai</span>
                          </label>
                        </div>
                        <div class="flex items-center p-2 rounded-lg"
                             :class="{
                               'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800': canSeeCorrection && isCorrectAnswer(question.id, 'faux'),
                               'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800': canSeeCorrection && getResponse(question.id) === 'faux' && !isCorrectAnswer(question.id, 'faux')
                             }">
                          <label class="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              :name="`q-${question.id}`"
                              value="faux"
                              :checked="getResponse(question.id) === 'faux'"
                              @change="setResponse(question.id, 'faux')"
                              class="w-4 h-4 text-indigo-600"
                              :disabled="examStatus !== 'en_cours' || hasSubmitted || examStore.isSubmitting || isSubmitting"
                            />
                            <span class="text-sm text-gray-700 dark:text-gray-300">Faux</span>
                          </label>
                        </div>

                        <!-- Justification -->
                        <div v-if="question.config?.requireJustification" class="mt-3 w-full">
                          <label class="block text-xs font-medium text-gray-500 mb-1">
                            Justification <span class="text-red-500">*</span>
                          </label>
                          <textarea
                            v-model="justifications[question.id]"
                            @input="debouncedSave(question)"
                            rows="2"
                            class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                            placeholder="Justifiez votre réponse..."
                            :disabled="examStatus !== 'en_cours' || hasSubmitted || examStore.isSubmitting || isSubmitting"
                          ></textarea>
                        </div>
                      </div>

                      <!-- Texte court -->
                      <div v-else-if="question.type === 'texte_court'" class="space-y-2">
                        <div class="relative group">
                          <!-- Mode examen en cours : Textarea auto-extensible ou multi-ligne -->
                          <textarea
                            v-if="!canSeeCorrection"
                            v-model="responses[question.id]"
                            @input="debouncedSave(question)"
                            placeholder="Votre réponse..."
                            rows="2"
                            class="w-full px-4 py-3 text-sm rounded-xl border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none"
                            :disabled="examStatus !== 'en_cours' || hasSubmitted || examStore.isSubmitting || isSubmitting"
                          ></textarea>

                          <!-- Mode correction : Div neutre pour texte court -->
                          <div
                            v-else
                            class="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50 dark:bg-gray-800/50 transition-all"
                          >
                            <div class="flex justify-between items-start gap-4">
                              <div class="whitespace-pre-wrap flex-grow text-gray-700 dark:text-gray-200">
                                {{ responses[question.id] || '(Aucune réponse)' }}
                              </div>
                              <div v-if="responses[question.id]" class="shrink-0 pt-0.5">
                                <span class="flex items-center gap-1 text-indigo-600 font-bold uppercase text-[10px] tracking-wider">
                                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" /></svg>
                                  Réponse soumise
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- Réponse attendue pour examen terminé -->
                        <div v-if="canSeeCorrection && question.config?.expected_answer" class="mt-1 text-xs text-gray-500">
                          Réponse attendue: {{ question.config.expected_answer }}
                        </div>
                      </div>

                      <!-- Texte long avec TinyMCE -->
                      <div v-else-if="question.type === 'texte_long'">
                        <Editor
                          api-key="2i64hds9y2pudvppatub5l7yvbpfncjva29myumeyneiqnzl"
                          v-model="responses[question.id]"
                          :init="{
                            height: 300,
                            menubar: false,
                            paste_as_text: false,
                            paste_block_drop: true,
                            paste_data_images: false,
                            setup: function(editor) {
                              editor.on('paste', function(e) {
                                e.preventDefault();
                                showToastMessage('Collage interdit dans l\'éditeur', 'error');
                              });
                              editor.on('copy', function(e) {
                                e.preventDefault();
                                showToastMessage('Copie interdite dans l\'éditeur', 'error');
                              });
                              editor.on('cut', function(e) {
                                e.preventDefault();
                                showToastMessage('Coupage interdit dans l\'éditeur', 'error');
                              });
                            },
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
                          :disabled="examStatus !== 'en_cours' || hasSubmitted || examStore.isSubmitting || isSubmitting"
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
                                  <th v-for="(col, colIdx) in (question.complex_data.configuration && question.complex_data.configuration.colonnes) || []" 
                                      :key="colIdx" 
                                      class="border p-3 text-left font-medium">
                                    {{ col.titre || `Colonne ${String.fromCharCode(65 + colIdx)}` }}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(row, rowIdx) in question.complex_data.data || []" :key="rowIdx">
                                  <td class="border p-3 text-center bg-gray-50 dark:bg-gray-800 font-medium">{{ rowIdx + 1 }}</td>
                                  <td v-for="(col, colIdx) in (question.complex_data.configuration && question.complex_data.configuration.colonnes) || []" 
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
                                              :disabled="examStatus !== 'en_cours' || hasSubmitted"
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
                                                  :disabled="examStatus !== 'en_cours' || hasSubmitted"
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
                                              :disabled="examStatus !== 'en_cours' || hasSubmitted"
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
                                              :disabled="examStatus !== 'en_cours' || hasSubmitted"
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
                                              :disabled="examStatus !== 'en_cours' || hasSubmitted"
                                              placeholder="Saisissez votre réponse..."
                                            />
                                          </template>
                                        </template>
                                        
                                        <!-- Points de la cellule -->
                                        <div v-if="((examStatus === 'en_cours' && !hasSubmitted) || canSeeCorrection) && getCellQuestion(question, rowIdx, colIdx) && getCellQuestion(question, rowIdx, colIdx).points" class="text-xs text-gray-500 text-right">
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
                              <span v-if="(examStatus === 'en_cours' && !hasSubmitted) || canSeeCorrection" class="text-sm font-medium">{{ part.points }} pts</span>
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
                                  :disabled="examStatus !== 'en_cours' || hasSubmitted"
                                  placeholder="Votre réponse..."
                                ></textarea>
                              </template>
                              
                              <template v-else-if="part.type === 'qcm_unique' && part.options && part.options.length > 0">
                                <select
                                  v-model="multiPartResponses[`${question.id}_${partIdx}`]"
                                  @change="saveMultiPartResponse(question, partIdx)"
                                  class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                  :disabled="examStatus !== 'en_cours' || hasSubmitted"
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
                                  :disabled="examStatus !== 'en_cours' || hasSubmitted"
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
                            api-key="2i64hds9y2pudvppatub5l7yvbpfncjva29myumeyneiqnzl"
                              v-model="responses[question.id]"
                              :init="{
                                height: 300,
                                menubar: false,
                                paste_as_text: false,
                                paste_block_drop: true,
                                paste_data_images: false,
                                setup: function(editor) {
                                  editor.on('paste', function(e) {
                                    e.preventDefault();
                                    showToastMessage('Collage interdit dans l\'éditeur', 'error');
                                  });
                                  editor.on('copy', function(e) {
                                    e.preventDefault();
                                    showToastMessage('Copie interdite dans l\'éditeur', 'error');
                                  });
                                  editor.on('cut', function(e) {
                                    e.preventDefault();
                                    showToastMessage('Coupage interdit dans l\'éditeur', 'error');
                                  });
                                },
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
                              :disabled="examStatus !== 'en_cours' || hasSubmitted || examStore.isSubmitting || isSubmitting"
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
                                  :disabled="examStatus !== 'en_cours' || hasSubmitted"
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
                      <span v-else-if="isAnyResponseProvided(question.id)" class="text-gray-400">
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
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useExamStore } from '~~/stores/exam'
import Editor from '@tinymce/tinymce-vue'
import Swal from 'sweetalert2'

const route = useRoute()
const examStore = useExamStore()

const evaluationId = route.params.slug

// ========== DONNÉES LOCALES ==========
const isPageLoading = ref(true)
const isSubmitting = ref(false)
const currentQuestionId = ref(null)
const expandedParts = ref([])
const responses = ref({}) // Réponses simples
const justifications = ref({}) // Justifications
const isSaving = ref({})
const savedStates = ref({})
const currentTime = ref(new Date())
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

// ========== ANTI-TRICHE ==========
const cheatWarnings = ref(0)
const maxWarnings = 3
const showCheatWarning = ref(false)
const cheatReason = ref('')

const handleSecurityEvent = (reason) => {
  if (examStatus.value !== 'en_cours' || isSubmitting.value) return
  
  cheatWarnings.value++
  cheatReason.value = reason
  showCheatWarning.value = true
  
  // Vibration si mobile
  if ('vibrate' in navigator) navigator.vibrate([100, 50, 100])
  
  showToastMessage(`Attention : ${reason}`, 'error')
  
  if (cheatWarnings.value >= maxWarnings) {
    // Force submit maybe?
  }
}

const preventDefaults = (e) => {
  if (examStatus.value === 'en_cours') {
    e.preventDefault()
    showToastMessage('Action interdite durant l\'examen (Droit d\'auteur/Sécurité)', 'error')
    handleSecurityEvent('Tentative de copier-coller ou clic droit détectée')
    return false
  }
}

const setupSecurityListeners = () => {
  if (examStatus.value === 'en_cours') {
    console.log('[Security] Attaching anti-cheat listeners')
    // Bloquer le copier-coller
    document.addEventListener('copy', preventDefaults)
    document.addEventListener('paste', preventDefaults)
    document.addEventListener('cut', preventDefaults)
    document.addEventListener('contextmenu', preventDefaults)
    
    // Détecter le changement d'onglet/fenêtre
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Détecter la perte de focus
    window.addEventListener('blur', handleBlur)
  }
}

const handleVisibilityChange = () => {
  if (document.visibilityState === 'hidden' && examStatus.value === 'en_cours') {
    handleSecurityEvent('Changement d\'onglet détecté')
  }
}

const handleBlur = () => {
  if (examStatus.value === 'en_cours') {
    handleSecurityEvent('Perte de focus navigateur (sortie de la fenêtre)')
  }
}

// ========== STATUT DE L'EXAMEN ==========
const examStatus = computed(() => {
  if (!examStore.currentEvaluation || isPageLoading.value) return 'chargement'
  
  const now = currentTime.value
  const debut = new Date(examStore.currentEvaluation.debut)
  const fin = new Date(examStore.currentEvaluation.fin)
  
  if (now < debut) return 'en_attente'
  if (now > fin) return 'termine'
  return 'en_cours'
})

const hasSubmitted = computed(() => {
  return examStore.currentSession?.status === 'termine'
})

const canSeeCorrection = computed(() => {
  if (!examStore.currentEvaluation || examStatus.value !== 'termine') return false
  
  const isPublished = Number(examStore.currentEvaluation.published) === 1
  
  // Nouvelle sécurité : vérifier si la copie est entièrement corrigée
  // On considère une copie corrigée si toutes les questions ont une note (même 0, mais pas null)
  const hasSubmissions = examStore.submissions && examStore.submissions.length > 0
  const allGraded = hasSubmissions && examStore.submissions.every(s => s && s.points_obtenus !== null)
  
  // On ne montre la correction que si c'est publié ET que le prof a fini de noter
  return isPublished && allGraded
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

const formatTimeFromDate = (dateString) => {
  if (!dateString) return '--:--'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '--:--'
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
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

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(':', 'h')
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

const isQuestionAnswered = (questionId) => {
  // Vérifier réponses simples
  const simpleResponse = responses.value[questionId]
  if (simpleResponse !== null && simpleResponse !== undefined && simpleResponse !== '') {
    if (Array.isArray(simpleResponse)) return simpleResponse.length > 0
    return true
  }
  
  // Vérifier tableaux (chercher n'importe quelle cellule pour cette question)
  const hasTableData = Object.keys(tableResponses.value).some(key => key.startsWith(`${questionId}_`))
  if (hasTableData) return true
  
  // Vérifier multi-parties
  const hasMultiPartData = Object.keys(multiPartResponses.value).some(key => key.startsWith(`${questionId}_`))
  if (hasMultiPartData) return true
  
  // Vérifier structuré
  const hasStructuredData = Object.keys(structuredResponses.value).some(key => key.startsWith(`${questionId}_`))
  if (hasStructuredData) return true
  
  return false
}

const isAnyResponseProvided = (questionId) => {
  // Réponses simples
  if (responses.value[questionId]) return true
  
  // Tableaux
  if (Object.keys(tableResponses.value).some(k => k.startsWith(`${questionId}_`))) return true
  
  // Multi-parties
  if (Object.keys(multiPartResponses.value).some(k => k.startsWith(`${questionId}_`))) return true
  
  // Structuré
  if (Object.keys(structuredResponses.value).some(k => k.startsWith(`${questionId}_`))) return true
  
  return false
}

const isOptionSelected = (questionId, optionId) => {
  const response = responses.value[questionId]
  if (Array.isArray(response)) {
    return response.some(id => id == optionId)
  }
  return response == optionId
}

const wordCount = (text) => {
  if (!text) return 0
  return text.trim().split(/\s+/).length
}

const getStudentAnswerDisplay = (question) => {
  if (question.type === 'complex_data') {
    const cells = Object.keys(tableResponses.value).filter(key => key.startsWith(`${question.id}_`))
    if (cells.length === 0) return 'Aucune réponse'
    return `${cells.length} cellule(s) remplie(s)`
  }
  
  if (question.type === 'multi_parts') {
    const parts = Object.keys(multiPartResponses.value).filter(key => key.startsWith(`${question.id}_`))
    if (parts.length === 0) return 'Aucune réponse'
    return `${parts.length} partie(s) répondue(s)`
  }
  
  if (question.type === 'structured_data') {
    const items = Object.keys(structuredResponses.value).filter(key => key.startsWith(`${question.id}_`))
    if (items.length === 0) return 'Aucune réponse'
    return `${items.length} item(s) sélectionné(s)`
  }
  
  const response = responses.value[question.id]
  if (response === undefined || response === null || response === '') {
    return 'Aucune réponse fournie'
  }
  
  if (question.type === 'qcm_unique' || question.type === 'vrai_faux') {
    const option = question.options?.find(o => o.id == response)
    return option ? option.text : response
  }
  
  if (question.type === 'qcm_multiple') {
    if (!Array.isArray(response)) return response
    const selected = question.options?.filter(o => response.includes(o.id))
    return selected?.length ? selected.map(o => o.text).join(', ') : 'Aucune option sélectionnée'
  }
  
  if (question.type === 'texte_long') {
    return stripHtml(response).substring(0, 100) + (stripHtml(response).length > 100 ? '...' : '')
  }
  
  return response
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
      reponseData = { 
        option_id: responses.value[question.id],
        justification: justifications.value[question.id] || ''
      }
    } else if (question.type === 'qcm_multiple') {
      reponseData = { 
        option_ids: responses.value[question.id] || [],
        justification: justifications.value[question.id] || ''
      }
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
  
  Swal.fire({
    title: 'Soumettre votre copie ?',
    text: "Une fois soumise, vous ne pourrez plus modifier vos réponses.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, soumettre',
    cancelButtonText: 'Annuler',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      submitExam()
    }
  })
}

const submitExam = async (isAuto = false) => {
  if (isSubmitting.value || examStatus.value !== 'en_cours') return
  
  if (!currentUser.value?.id) {
    Swal.fire('Erreur', 'Utilisateur non identifié. Veuillez vous reconnecter.', 'error')
    return
  }
  
  // Confirmation finale avant l'envoi (seulement pour soumission manuelle)
  if (!isAuto) {
    const confirmation = await Swal.fire({
      title: 'Soumettre définitivement ?',
      text: "Une fois soumise, vous ne pourrez plus modifier vos réponses.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, soumettre',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    })

    if (!confirmation.isConfirmed) return
  }

  // Affichage du loader
  Swal.fire({
    title: isAuto ? 'Temps écoulé ! Soumission...' : 'Soumission en cours...',
    text: 'Veuillez patienter pendant l\'enregistrement de votre copie.',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    }
  })

  isSubmitting.value = true
  
  try {
    console.log('[Exam] Sending submit-all request for evaluation:', evaluationId)
    const result = await examStore.submitAllExam(evaluationId, currentUser.value.id)
    console.log('[Exam] Submission successful:', result)
    
    // Succès !
    await Swal.fire({
      title: 'Félicitations !',
      text: 'Votre copie a été soumise avec succès. Vous allez être redirigé vers le message de confirmation.',
      icon: 'success',
      confirmButtonText: 'Terminer',
      confirmButtonColor: '#10b981'
    })
    
    // Le store a mis à jour currentSession.status à 'termine', l'UI va suivre via hasSubmitted
  } catch (error) {
    console.error('[Exam] Submission error:', error)
    const errorMsg = error.response?.data?.message || error.message || 'Une erreur est survenue lors de la soumission.'
    Swal.fire('Erreur', errorMsg, 'error')
  } finally {
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

const getQuestionTotalPoints = (question) => {
  if (!question) return 0
  let total = parseFloat(question.points) || 0
  
  // Ajouter les points de justification si activée
  if (question.config?.requireJustification && question.config?.justificationPoints) {
    const jPoints = parseFloat(question.config.justificationPoints)
    if (!isNaN(jPoints)) {
      total += jPoints
    }
  }
  return total
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
    return false // On ne corrige plus automatiquement les textes courts côté client
  }
  
  return false
}

// ========== GESTION DU TEMPS RÉEL ==========
let globalTimeInterval = null

const startGlobalTimer = () => {
  if (globalTimeInterval) clearInterval(globalTimeInterval)
  globalTimeInterval = setInterval(() => {
    currentTime.value = new Date()
    
    // Si on est en attente, mettre aussi à jour le countdown
    if (examStatus.value === 'en_attente') {
      updateCountdown()
    } else if (examStatus.value === 'en_cours') {
      updateExamTimer()
    }
  }, 1000)
}

// ========== FONCTIONS DE MISE À JOUR DES TIMERS ==========
const updateCountdown = () => {
  if (!examStore.currentEvaluation) return
  
  const now = currentTime.value
  const debut = new Date(examStore.currentEvaluation.debut)
  const diff = Math.max(0, Math.floor((debut - now) / 1000))
  
  timeUntilStart.value = diff
}

const updateExamTimer = () => {
  if (!examStore.currentEvaluation) return
  
  const now = currentTime.value
  const fin = new Date(examStore.currentEvaluation.fin)
  const diff = Math.max(0, Math.floor((fin - now) / 1000))
  
  timeRemaining.value = diff
  
  if (diff <= 0 && examStatus.value === 'en_cours' && !isSubmitting.value) {
    submitExam(true)
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

// Watcher pour le changement de statut automatique
watch(examStatus, async (newStatus, oldStatus) => {
  console.log(`[ExamDebug] Statut changé: ${oldStatus} -> ${newStatus}`)
  
  if (newStatus === 'en_cours' && (oldStatus === 'en_attente' || oldStatus === 'chargement' || oldStatus === undefined)) {
    console.log('[ExamDebug] Déclenchement automatique du démarrage de l\'examen')
    showToastMessage('L\'examen commence maintenant ! Bonne chance.', 'success')
    
    // Charger les données si nécessaire
    if (examStore.parts.length === 0) {
      await examStore.loadExam(evaluationId)
    }
    
    // Initialiser le passage d'examen
    await examStore.startExam(evaluationId, currentUser.value.id)
    
    if (examStore.parts.length > 0 && expandedParts.value.length === 0) {
      expandedParts.value.push(examStore.parts[0].id)
    }
    
    startAutoSave()
    setupSecurityListeners()
  }
}, { immediate: true })

// ========== CHARGEMENT INITIAL ==========
onMounted(async () => {
  try {
    currentUser.value = getUserFromStorage()
    console.log('Utilisateur actuel:', currentUser.value)
    
    if (!currentUser.value) {
      showToastMessage('Utilisateur non connecté', 'error')
      setTimeout(() => navigateTo('/connexion'), 2000)
      return
    }
    
    await examStore.loadExam(evaluationId)
    const fetchedSubmissions = await examStore.fetchSubmissions(evaluationId, currentUser.value.id)
    
    const loadedQuestionIds = examStore.questions.map(q => q.id)
    console.log('IDs des questions chargées sur cette page:', loadedQuestionIds)
    console.log('Nombre de soumissions reçues du serveur:', fetchedSubmissions?.length || 0)
    
    if (examStore.submissions && examStore.submissions.length > 0) {
      const newResponses = { ...responses.value }
      const newJustifications = { ...justifications.value }
      const newTableResponses = { ...tableResponses.value }
      const newMultiPartResponses = { ...multiPartResponses.value }
      const newStructuredResponses = { ...structuredResponses.value }

      examStore.submissions.forEach(submission => {
        const questionId = Number(submission.question_id)
        
        // Vérifier si cette question existe dans l'examen actuel
        if (!loadedQuestionIds.some(id => Number(id) === questionId)) {
          console.warn(`Attention: La soumission pour la question ID ${questionId} ne correspond à aucune question chargée sur cette page (IDs chargés: ${loadedQuestionIds.join(',')})`)
          return // Passer à la suivante
        }
        
        let reponse = submission.reponse
        if (typeof reponse === 'string') {
          try { reponse = JSON.parse(reponse) } catch (e) {}
        }
        
        if (reponse) {
          if (reponse.type === 'complex_data' && reponse.data) {
            if (reponse.data.row !== undefined && reponse.data.column !== undefined) {
              newTableResponses[`${questionId}_${reponse.data.row}_${reponse.data.column}`] = reponse.data.value
            } else {
              Object.keys(reponse.data).forEach(cellKey => {
                if (cellKey.includes('-')) {
                  const [row, col] = cellKey.split('-')
                  newTableResponses[`${questionId}_${row}_${col}`] = reponse.data[cellKey]
                }
              })
            }
          } else if (reponse.type === 'multi_parts' && reponse.data) {
            Object.keys(reponse.data).forEach(partKey => {
              if (partKey.startsWith('part_')) {
                const partIdx = partKey.split('_')[1]
                newMultiPartResponses[`${questionId}_${partIdx}`] = reponse.data[partKey]
              }
            })
          } else if (reponse.type === 'structured_data' && reponse.data) {
            Object.keys(reponse.data).forEach(itemKey => {
              if (itemKey.startsWith('item_')) {
                const itemIdx = itemKey.split('_')[1]
                newStructuredResponses[`${questionId}_${itemIdx}`] = reponse.data[itemKey]
              }
            })
          } else {
            if (reponse.option_id !== undefined) {
              newResponses[questionId] = reponse.option_id
            } else if (reponse.option_ids !== undefined) {
              newResponses[questionId] = reponse.option_ids
            } else if (reponse.text !== undefined) {
              newResponses[questionId] = reponse.text
            } else if (typeof reponse !== 'object') {
              newResponses[questionId] = reponse
            }
            
            // Toujours essayer de récupérer la justification
            if (reponse.justification !== undefined) {
              newJustifications[questionId] = reponse.justification
            }
          }
        }
      })
      
      responses.value = newResponses
      justifications.value = newJustifications
      tableResponses.value = newTableResponses
      multiPartResponses.value = newMultiPartResponses
      structuredResponses.value = newStructuredResponses
    }
    
    console.log('Restauration terminée. État de "responses":', responses.value)
    
    // ========== SÉCURITÉ : EMPÊCHER DE QUITTER ==========
    window.addEventListener('beforeunload', (e) => {
      if (examStatus.value === 'en_cours' && !isSubmitting.value) {
        e.preventDefault()
        e.returnValue = 'Attention : votre examen est en cours. Vos réponses pourraient être perdues.'
      }
    })
    
    startGlobalTimer()
    console.log('[ExamDebug] mounted - Statut initial:', examStatus.value)
    
    // Le reste de l'initialisation (startExam, etc.) est géré par le watcher sur examStatus
    // car il est configuré avec immediate: true et capte le premier état après chargement.
    
    // ========== SÉCURITÉ & ANTI-TRICHE ==========
    setupSecurityListeners()
    
    // Bloquer les raccourcis clavier nuisibles (toujours actif si en cours)
    document.addEventListener('keydown', (e) => {
      if (examStatus.value !== 'en_cours') return
      
      // Bloquer F12, Ctrl+Shift+I (inspecter), Ctrl+U (source), Ctrl+S (sauver)
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') || 
        (e.ctrlKey && e.key === 'u') || 
        (e.ctrlKey && e.key === 's')
      ) {
        e.preventDefault()
        handleSecurityEvent('Raccourci clavier interdit détecté')
        return false
      }
    })
    
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
    showToastMessage('Erreur lors du chargement de l\'examen', 'error')
  } finally {
    isPageLoading.value = false
  }
})

onUnmounted(() => {
  if (globalTimeInterval) clearInterval(globalTimeInterval)
  if (autoSaveInterval) clearInterval(autoSaveInterval)
  
  // Nettoyage sécurité
  document.removeEventListener('copy', preventDefaults)
  document.removeEventListener('paste', preventDefaults)
  document.removeEventListener('cut', preventDefaults)
  document.removeEventListener('contextmenu', preventDefaults)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  window.removeEventListener('blur', handleBlur)
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
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.2; transform: scale(1.2); }
}
</style>