<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-4 md:p-6 lg:p-8 transition-colors">
    
    <!-- ========== LOADING ========== -->
    <!-- ========== LOADING SKELETON ========== -->
    <div v-if="isPageLoading" class="animate-pulse space-y-8">
      <!-- Breadcrumb Skeleton -->
      <div class="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>

      <!-- Stats Skeleton -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-32 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"></div>
      </div>

      <!-- Filter Bar Skeleton -->
      <div class="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div class="h-12 w-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div class="flex gap-2">
          <div class="h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div class="h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>

      <!-- Table Skeleton -->
      <div class="h-[500px] bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"></div>
    </div>

    <template v-else>
      <!-- ========== BREADCRUMB ========== -->
      <div class="flex flex-col gap-4 mb-6 w-full overflow-hidden">
        <Breadcrumb
          :items="[
            { label: 'Examens', to: '/examens' },
            { label: 'Correction', to: '/examens/correction' },
            { label: examStore.examTitle, to: null }
          ]"
          :title="examStore.examTitle"
          title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
          spacing="mb-0"
        />
        <div class="flex flex-wrap items-center gap-3 w-full">
          <!-- Déverrouiller (Admin) -->
          <button
            v-if="examStore.currentEvaluation?.correction_submission_date && !isTeacher"
            @click="confirmUnlockCorrections"
            class="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-semibold text-sm shadow-sm flex items-center gap-2 whitespace-nowrap"
            :disabled="isValidating"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            Invalider / Déverrouiller
          </button>

          <!-- Valider (Admin uniquement) -->
          <button
            v-if="!examStore.currentEvaluation?.correction_submission_date && !isTeacher"
            @click="confirmValidateCorrections"
            class="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold text-sm shadow-sm flex items-center gap-2 whitespace-nowrap"
            :disabled="isValidating"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ isValidating ? 'Validation...' : 'Valider les notes' }}
          </button>

          <button
            v-if="examStore.currentEvaluation && examStore.currentEvaluation.published !== 1"
            @click="confirmPublish"
            class="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all font-semibold text-sm shadow-sm flex items-center gap-2"
            :disabled="isPublishing"
          >
            <svg v-if="!isPublishing" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isPublishing ? 'Publication...' : 'Publier les résultats' }}
          </button>
          
          <div v-else-if="examStore.currentEvaluation?.published === 1" class="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-sm font-semibold">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Résultats publiés
          </div>

          <button
            @click="handleRefreshData"
            class="p-2.5 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            title="Rafraîchir"
          >
            <svg class="w-5 h-5" :class="{ 'animate-spin': isPageLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <!-- ========== FILTRES ET STATISTIQUES ========== -->
      <div class="mb-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <!-- Stats carte 1: Total étudiants -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ examStore.currentEvaluation?.has_anonymat ? 'Candidats' : 'Étudiants' }}</p>
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
            :placeholder="examStore.currentEvaluation?.has_anonymat ? 'Rechercher par anonymat...' : 'Rechercher un étudiant...'"
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

          <select
            v-model="filterSubmissionType"
            @change="handleRefreshData"
            class="px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
          >
            <option value="all">Tous les inscrits</option>
            <option value="submitted">Soumissions reçues</option>
          </select>
        </div>
      </div>

      <!-- ========== LISTE DES ÉTUDIANTS ========== -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ examStore.currentEvaluation?.has_anonymat ? 'Anonymat' : 'Étudiant' }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progression</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Note</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dernière activité</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody v-if="filteredEtudiants.length > 0" class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="etudiant in filteredEtudiants" :key="etudiant.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      <template v-if="examStore.currentEvaluation?.has_anonymat">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </template>
                      <template v-else>
                        {{ getInitials(etudiant.nom, etudiant.prenom) }}
                      </template>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ examStore.currentEvaluation?.has_anonymat ? (etudiant.anonymat || 'N/A') : (etudiant.nom + ' ' + etudiant.prenom) }}
                      </p>
                      <p v-if="!examStore.currentEvaluation?.has_anonymat" class="text-xs text-gray-500 dark:text-gray-400">
                        {{ etudiant.email }}
                      </p>
                      <p v-else class="text-xs text-gray-500 dark:text-gray-400">
                        Candidat anonyme
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ getStudentProgression(etudiant).repondues }}/{{ getStudentProgression(etudiant).total }}</span>
                  <div class="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div class="h-full bg-indigo-600 rounded-full" :style="{ width: getStudentProgression(etudiant).pourcentage + '%' }"></div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-medium" :class="getNoteColor(getStudentNote(etudiant), examStore.totalPoints)">
                  {{ getStudentNote(etudiant) }}/{{ examStore.totalPoints }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs rounded-full" :class="getStatutClass(getStudentStatut(etudiant))">
                  {{ getStudentStatut(etudiant) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(getStudentLastActivity(etudiant)) }}
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

          <!-- Empty State -->
          <div v-if="filteredEtudiants.length === 0" class="flex flex-col items-center justify-center py-16 px-4">
            <div class="bg-gray-100 dark:bg-gray-700/50 p-6 rounded-full mb-4">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">Aucun étudiant trouvé</h3>
            <p class="text-gray-500 dark:text-gray-400 text-center max-w-xs">
              {{ filterSubmissionType === 'submitted' 
                  ? "Aucun étudiant n'a encore envoyé sa soumission pour cet examen." 
                  : "Aucun étudiant ne correspond à vos critères de recherche." }}
            </p>
            <button 
              v-if="filterSubmissionType === 'submitted'"
              @click="filterSubmissionType = 'all'; handleRefreshData()"
              class="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Voir tous les inscrits
            </button>
          </div>
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
                  <div v-if="selectedEtudiant">
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
                          Correction - {{ examStore.currentEvaluation?.has_anonymat ? (selectedEtudiant?.anonymat || 'Candidat Anonyme') : (selectedEtudiant?.nom + ' ' + selectedEtudiant?.prenom) }}
                        </DialogTitle>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Note actuelle: {{ getStudentNote(selectedEtudiant) }}/{{ examStore.totalPoints }}
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
                            <div v-else class="text-sm text-gray-700 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none" v-html="getStudentResponse(selectedEtudiant?.id, question.id)">
                            </div>
                          </div>
                        </div>

                        <!-- Justification de l'étudiant -->
                        <div v-if="getStudentJustification(selectedEtudiant?.id, question.id)">
                          <p class="text-xs font-medium text-amber-600 mb-1 flex items-center gap-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Justification fournie :
                          </p>
                          <div class="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-lg text-sm italic text-gray-700 dark:text-gray-300">
                            "{{ getStudentJustification(selectedEtudiant?.id, question.id) }}"
                          </div>
                        </div>

                        <!-- Zone de correction -->
                        <div class="flex items-start gap-4">
                          <!-- Points -->
                          <div class="w-32">
                            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Points (max {{ (parseFloat(question.points) + parseFloat(question.config?.justificationPoints || 0)).toFixed(1) }})
                            </label>
                            <input
                              v-model.number="correctionForm[question.id].points"
                              type="number"
                              :max="(parseFloat(question.points) + parseFloat(question.config?.justificationPoints || 0))"
                              min="0"
                              step="0.5"
                              class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                              @input="validatePoints(question)"
                              :disabled="isCorrectionsLocked"
                            />
                          </div>
                          
                          <!-- Commentaire -->
                          <div class="flex-1">
                            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Commentaire
                            </label>
                            <div class="flex gap-2">
                              <textarea
                                v-model="correctionForm[question.id].commentaire"
                                placeholder="Écrire un commentaire..."
                                rows="2"
                                class="flex-1 px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 disabled:bg-gray-100 dark:disabled:bg-gray-800/50 resize-y min-h-[42px]"
                                :readonly="isCorrectionsLocked"
                              ></textarea>
                              <!-- Bouton Suggestion IA -->
                              <button
                                v-if="!isCorrectionsLocked"
                                @click="getAISuggestion(question)"
                                class="px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors flex items-center gap-1 shrink-0"
                                :disabled="isAnalysingIA[question.id]"
                                title="Suggérer une note via Gemini IA"
                              >
                                <svg v-if="isAnalysingIA[question.id]" class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span class="hidden sm:inline text-xs font-semibold">IA</span>
                              </button>
                            </div>
                          </div>
                        </div>
                        <p v-if="correctionForm[question.id]?.points > (parseFloat(question.points) + parseFloat(question.config?.justificationPoints || 0))" class="text-xs text-red-600 mt-1">
                          Les points ne peuvent pas dépasser {{ (parseFloat(question.points) + parseFloat(question.config?.justificationPoints || 0)).toFixed(1) }}
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
                        class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                      >
                        Fermer
                      </button>
                      <button
                        @click="saveAllCorrections"
                        class="px-6 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 shadow-sm transition-all font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                        :disabled="isSavingAll || isCorrectionsLocked"
                      >
                        {{ isSavingAll ? 'Enregistrement...' : 'Enregistrer tout' }}
                      </button>
                    </div>
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
import { useState } from '#app'
import Swal from 'sweetalert2'

const route = useRoute()
const examStore = useExamStore()
const etudiantStore = useEtudiantStore()

const evaluationId = route.params.slug

// ========== DONNÉES LOCALES ==========
const isPageLoading = ref(true)
const searchQuery = ref('')
const filterPartie = ref('')
const filterStatut = ref('')
const filterSubmissionType = ref('submitted') // 'all' or 'submitted'
const showCorrectionModal = ref(false)
const selectedEtudiant = ref(null)
const selectedPartCorrection = ref(null)
const isSavingAll = ref(false)
const isPublishing = ref(false)
const isValidating = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const correctionForm = ref({})
const isAnalysingIA = ref({})

const currentUser = computed(() => {
  const userState = useState('user')
  if (userState.value) return userState.value
  if (process.client) {
    const userStr = localStorage.getItem('user')
    if (userStr) return JSON.parse(userStr)
  }
  return null
})

const isTeacher = computed(() => {
  const user = currentUser.value
  if (!user || !user.roles) return true;
  const roles = user.roles.map(r => r.nom ? r.nom.toLowerCase() : '');
  const hasTeacherRole = roles.some(r => ['enseignant', 'professeur'].includes(r));
  const hasAdminRole = roles.some(r => ['admin', 'directeur général', 'directeur académique', 'informaticien', 'super admin', 'super-admin', 'super administrateur', 'administrateur'].includes(r));
  return hasTeacherRole && !hasAdminRole;
})

const isCorrectionsLocked = computed(() => {
  return isTeacher.value && examStore.currentEvaluation?.correction_submission_date !== null
})

const confirmValidateCorrections = () => {
  Swal.fire({
    title: 'Valider les notes ?',
    text: "Une fois validées, vous ne pourrez plus modifier les notes sans contacter l'administration.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, valider',
    cancelButtonText: 'Annuler',
    reverseButtons: true
  }).then(async (result) => {
    if (result.isConfirmed) {
      isValidating.value = true
      try {
        await examStore.validateCorrections(evaluationId)
        examStore.currentEvaluation.correction_submission_date = new Date().toISOString()
        showToastMessage('Notes validées avec succès')
      } catch (error) {
        showToastMessage("Erreur lors de la validation", "error")
      } finally {
        isValidating.value = false
      }
    }
  })
}

const confirmUnlockCorrections = () => {
  Swal.fire({
    title: 'Déverrouiller les notes ?',
    text: "Le professeur pourra à nouveau modifier les notes.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f97316',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, déverrouiller',
    cancelButtonText: 'Annuler',
    reverseButtons: true
  }).then(async (result) => {
    if (result.isConfirmed) {
      isValidating.value = true
      try {
        await examStore.unlockCorrections(evaluationId)
        examStore.currentEvaluation.correction_submission_date = null
        showToastMessage('Évaluation déverrouillée avec succès')
      } catch (error) {
        showToastMessage("Erreur lors du déverrouillage", "error")
      } finally {
        isValidating.value = false
      }
    }
  })
}

const confirmPublish = () => {
  if (questionsNonCorrigees.value > 0) {
    Swal.fire({
      title: 'Attention',
      text: `Il reste encore ${questionsNonCorrigees.value} questions à corriger. Voulez-vous vraiment publier les résultats maintenant ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Oui, publier',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        publishResults()
      }
    })
  } else {
    Swal.fire({
      title: 'Publier les résultats ?',
      text: "Les étudiants pourront consulter leurs notes et la correction dès la publication.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Oui, publier',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        publishResults()
      }
    })
  }
}

const publishResults = async () => {
  if (isPublishing.value) return
  
  isPublishing.value = true
  try {
    await examStore.publishEvaluation(evaluationId)
    showToastMessage('Résultats publiés avec succès')
    
    // Alerte de succès
    Swal.fire({
      title: 'Félicitations !',
      text: 'Les résultats ont été publiés. Les étudiants peuvent désormais les consulter.',
      icon: 'success',
      confirmButtonColor: '#10b981'
    })
  } catch (error) {
    console.error('Erreur publication:', error)
    Swal.fire('Erreur', 'Une erreur est survenue lors de la publication.', 'error')
  } finally {
    isPublishing.value = false
  }
}

const getAISuggestion = async (question) => {
  if (!selectedEtudiant.value || !question) return
  
  // Trouver la soumission
  const submissions = Array.isArray(examStore.submissions) ? examStore.submissions : []
  const submission = submissions.find(
    s => s && s.etudiant_id === selectedEtudiant.value.id && s.question_id === question.id
  )
  
  if (!submission || !submission.id) {
    showToastMessage('Soumission introuvable', 'error')
    return
  }

  isAnalysingIA.value[question.id] = true
  
  try {
    const response = await examStore.suggestGrade(submission.id)
    if (response && response.success) {
      correctionForm.value[question.id].points = response.points
      correctionForm.value[question.id].commentaire = response.justification
      showToastMessage('Suggestion IA reçue')
    } else {
      showToastMessage(response?.message || 'L\'IA n\'a pas pu générer de suggestion', 'error')
    }
  } catch (error) {
    console.error('Erreur suggestion IA:', error)
    showToastMessage('Erreur lors de l\'analyse IA', 'error')
  } finally {
    isAnalysingIA.value[question.id] = false
  }
}

// Liste des étudiants du groupe
const etudiants = ref([])

// ========== COMPUTED ==========
const totalEtudiants = computed(() => etudiants.value.length)

const participationRate = computed(() => {
  if (etudiants.value.length === 0) return 0
  
  const participe = etudiants.value.filter(e => {
    const prog = getStudentProgression(e)
    return prog.repondues > 0
  }).length
  
  return Math.round((participe / etudiants.value.length) * 100)
})

const moyenneGenerale = computed(() => {
  if (etudiants.value.length === 0) return 0
  
  let total = 0
  etudiants.value.forEach(e => {
    total += getStudentNote(e)
  })
  
  return (total / etudiants.value.length).toFixed(1)
})

const questionsNonCorrigees = computed(() => {
  return examStore.examStats.a_corriger || 0
})

const filteredEtudiants = computed(() => {
  return etudiants.value.filter(e => {
    const matchesSearch = searchQuery.value === '' || 
      `${e?.nom || ''} ${e?.prenom || ''}`.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      e?.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const statut = getStudentStatut(e)
    const matchesStatut = filterStatut.value === '' || 
      (filterStatut.value === 'corrige' && statut === 'Corrigé') ||
      (filterStatut.value === 'non_corrige' && statut === 'Non corrigé') ||
      (filterStatut.value === 'partiel' && statut === 'Partiellement corrigé')
    
    return matchesSearch && matchesStatut
  })
})

// ========== MÉTHODES POUR LES ÉTUDIANTS ==========
const getStudentProgression = (etudiant) => {
  if (!etudiant) return { total: 0, repondues: 0, pourcentage: 0 }
  
  // Utiliser les données pré-calculées par l'API si disponibles
  if (etudiant.progression) {
    return etudiant.progression
  }
  
  const etudiantId = etudiant.id
  // Fallback sur le store (utile lors d'une mise à jour en temps réel dans la modale)
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

const getStudentNote = (etudiant) => {
  if (!etudiant) return 0
  
  // Utiliser la note pré-calculée par l'API
  if (etudiant.note !== undefined && etudiant.note !== null) {
    return etudiant.note
  }

  const etudiantId = etudiant.id
  const submissions = Array.isArray(examStore.submissions)
    ? examStore.submissions.filter(s => s && s.etudiant_id === etudiantId)
    : []
    
  return submissions.reduce((sum, s) => sum + (s?.points_obtenus || 0), 0)
}

const getStudentStatut = (etudiant) => {
  if (!etudiant) return 'Non corrigé'
  
  // Utiliser le statut pré-calculé par l'API
  if (etudiant.statutCorrection) {
    return etudiant.statutCorrection
  }

  const etudiantId = etudiant.id
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

const getStudentLastActivity = (etudiant) => {
  if (!etudiant) return null
  
  if (etudiant.derniereActivite) {
    return etudiant.derniereActivite
  }

  const etudiantId = etudiant.id
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

const getStudentJustification = (etudiantId, questionId) => {
  if (!etudiantId || !questionId) return null
  
  const submission = Array.isArray(examStore.submissions)
    ? examStore.submissions.find(s => s && s.etudiant_id === etudiantId && s.question_id === questionId)
    : null
    
  if (!submission || !submission.reponse) return null
  
  return submission.reponse.justification || null
}

const isAllGraded = (etudiantId) => {
  if (!etudiantId) return true
  const studentQuestions = examStore.questions || []
  return studentQuestions.every(q => isQuestionCorrigee(etudiantId, q.id))
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
  
  const maxPoints = parseFloat(question.points) + parseFloat(question.config?.justificationPoints || 0)
  
  if (correctionForm.value[question.id]?.points > maxPoints) {
    correctionForm.value[question.id].points = maxPoints
  }
}

const calculateTotalPoints = (etudiantId) => {
  let total = 0
  Object.values(correctionForm.value).forEach(item => {
    if (item && item.points) {
      const p = parseFloat(item.points)
      if (!isNaN(p)) total += p
    }
  })
  return total.toFixed(1)
}

const showToastMessage = (message, type = 'success') => {
  const { $toastr } = useNuxtApp()
  if (type === 'error') {
    $toastr.error(message)
  } else {
    $toastr.success(message)
  }
}

// ========== MÉTHODES DE CORRECTION ==========
const openCorrectionModal = async (etudiant) => {
  if (!etudiant || !etudiant.id) return
  
  selectedEtudiant.value = etudiant
  selectedPartCorrection.value = examStore.parts?.[0] || null
  
  // Initialiser le formulaire de correction pour TOUTES les questions par défaut
  examStore.questions.forEach(q => {
    if (q && q.id) {
      correctionForm.value[q.id] = {
        points: 0,
        commentaire: ''
      }
    }
  })
  
  try {
    // Charger les soumissions spécifiques de l'étudiant
    await examStore.fetchSubmissions(evaluationId, etudiant.id)
    
    // Recharger les soumissions depuis le store
    const submissions = Array.isArray(examStore.submissions) ? examStore.submissions : []
    
    submissions
      .filter(s => s && s.etudiant_id === etudiant.id)
      .forEach(sub => {
        if (sub && sub.question_id && correctionForm.value[sub.question_id]) {
          correctionForm.value[sub.question_id] = {
            points: parseFloat(sub.points_obtenus || 0),
            commentaire: sub.reponse?.commentaire_correction || ''
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
      // await examStore.finalizeGrade(evaluationId, selectedEtudiant.value.id)
      await handleRefreshData()
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
      // Finaliser la note globale de l'étudiant
      // await examStore.finalizeGrade(evaluationId, selectedEtudiant.value.id)
      
      await handleRefreshData()
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

const handleRefreshData = async () => {
  isPageLoading.value = true
  try {
    if (filterSubmissionType.value === 'submitted') {
      const resp = await examStore.fetchSubmittedSubmissions(evaluationId)
      if (resp && resp.data && resp.data.etudiants) {
        etudiants.value = resp.data.etudiants
      }
    } else {
      const resp = await examStore.fetchAllSubmissions(evaluationId)
      if (resp && resp.data && resp.data.etudiants) {
        etudiants.value = resp.data.etudiants
      }
    }
  } catch (error) {
    console.error('Erreur rafraîchissement:', error)
  } finally {
    isPageLoading.value = false
  }
}

// ========== CHARGEMENT INITIAL ==========
onMounted(async () => {
  try {
    // Charger l'examen avec ses parties et questions
    await examStore.loadExam(evaluationId)
    
    // Charger selon le filtre par défaut (Soumissions reçues)
    await handleRefreshData()
    
    // Alternative si toujours pas d'étudiants
    if (etudiants.value.length === 0 && filterSubmissionType.value === 'all') {
      if (typeof examStore.fetchAllSessions === 'function') {
        const sessionsResponse = await examStore.fetchAllSessions(evaluationId)
        if (sessionsResponse && sessionsResponse.length > 0) {
          etudiants.value = sessionsResponse.map(s => s?.etudiant).filter(Boolean)
        }
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