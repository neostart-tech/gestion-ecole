<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-4 md:p-6 lg:p-8 transition-colors"
  >
    <!-- ========== LOADING SKELETON ========== -->
    <div v-if="examStore.isLoading" class="animate-pulse space-y-8">
      <!-- Breadcrumb Skeleton -->
      <div class="flex items-center gap-4 mb-6">
        <div class="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>

      <!-- Stats Skeleton -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div v-for="i in 4" :key="i" class="h-32 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
          <div class="flex justify-between items-start">
            <div class="space-y-3">
              <div class="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      </div>

      <!-- Main Content Skeleton -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column -->
        <div class="lg:col-span-1 space-y-6">
          <div class="h-96 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"></div>
          <div class="h-64 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"></div>
        </div>
        <!-- Right Column -->
        <div class="lg:col-span-2">
          <div class="h-[600px] bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"></div>
        </div>
      </div>
    </div>

    <!-- ========== MAIN CONTENT ========== -->
    <div v-else class="animate-fade-in">
    <!-- ========== BREADCRUMB ========== -->
    <Breadcrumb
      :items="[
        { label: 'Examens', to: '/examens' },
        { label: 'Constructeur', to: null },
      ]"
      :title="`Constructeur - ${examStore.examTitle}`"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4 sm:mb-6"
    />

    <!-- ========== STATS CARDS MODERNES ========== -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <!-- Carte Parties -->
      <div class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Parties</p>
              <p class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mt-1">{{ examStore.parts.length }}</p>
            </div>
            <div class="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
          </div>
          <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span class="font-medium text-indigo-600 dark:text-indigo-400">{{ examStore.parts.length }}</span> au total
          </div>
        </div>
      </div>

      <!-- Carte Questions -->
      <div class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Questions</p>
              <p class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mt-1">{{ examStore.totalQuestions }}</p>
            </div>
            <div class="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span class="font-medium text-emerald-600 dark:text-emerald-400">{{ examStore.totalQuestions }}</span> questions créées
          </div>
        </div>
      </div>

      <!-- Carte Points -->
      <div class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Points</p>
              <p class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mt-1">{{ examStore.totalPoints.toFixed(1) }}</p>
            </div>
            <div class="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span class="font-medium text-amber-600 dark:text-amber-400">{{ examStore.totalPoints.toFixed(1) }}</span> points distribués
          </div>
        </div>
      </div>

      <!-- Carte Progression -->
      <div class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-rose-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Complétion</p>
              <p class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mt-1">{{ completionRate }}%</p>
            </div>
            <div class="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div class="mt-2">
            <div class="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full transition-all duration-500"
                :style="{ width: completionRate + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== GRILLE PRINCIPALE ========== -->
    <!-- Alerte Examen Verrouillé (Lecture Seule) -->
    <div v-if="isExamLocked" class="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-2xl shadow-sm animate-pulse-subtle">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-amber-700 font-medium">
            L'évaluation a démarré ou est terminée. L'interface est en mode <span class="uppercase font-bold">Lecture Seule</span> pour garantir l'intégrité des réponses. Toute modification est désactivée.
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <!-- ========== COLONNE GAUCHE ========== -->
      <div class="lg:col-span-1 space-y-4 sm:space-y-6">
        <!-- CARD: Création d'une partie -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
          <div class="bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-4">
            <h2 class="text-lg font-semibold text-white flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <div class="p-1 bg-white/20 rounded-lg">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                {{ isExamLocked ? "Consulter la partie" : (editingPart ? "Modifier la partie" : "Ajouter une partie") }}
              </div>
              <button 
                v-if="editingPart" 
                @click="resetPartForm"
                class="text-[10px] bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
                title="Fermer la vue"
              >
                {{ isExamLocked ? "Fermer" : "Annuler" }}
              </button>
            </h2>
          </div>

          <div class="p-5">
            <form @submit.prevent="addPart" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Titre de la partie <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="newPart.titre"
                  type="text"
                  placeholder="ex: Partie 1: Théorie"
                  required
                  class="w-full px-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  v-model="newPart.description"
                  rows="2"
                  placeholder="Description de la partie..."
                  class="w-full px-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                ></textarea>
              </div>

              <div class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <input
                  type="checkbox"
                  v-model="newPart.isCaseStudy"
                  id="isCaseStudy"
                  class="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label for="isCaseStudy" class="text-sm text-gray-700 dark:text-gray-300">
                  C'est une étude de cas
                </label>
              </div>

              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 -translate-y-4"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-4"
              >
                <div v-if="newPart.isCaseStudy" class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Contexte de l'étude de cas <span class="text-red-500">*</span>
                  </label>
                  <Editor
                    api-key="2i64hds9y2pudvppatub5l7yvbpfncjva29myumeyneiqnzl"
                    v-model="newPart.contexte"
                    :init="{
                      height: 150,
                      menubar: false,
                      plugins: 'lists link image',
                      toolbar: 'undo redo | bold italic | bullist numlist | link',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:13px; }',
                      branding: false,
                    }"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Ce contexte sera visible pour toutes les questions de cette partie
                  </p>
                </div>
              </Transition>

              <button
                type="submit"
                v-if="canEdit"
                :disabled="examStore.isLoading"
                class="w-full px-4 py-3 text-sm bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all font-medium shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ examStore.isLoading ? (editingPart ? "Mise à jour..." : "Création...") : (editingPart ? "Mettre à jour la partie" : "Créer la partie") }}
              </button>
              <div v-else class="p-3 text-center bg-gray-100 dark:bg-gray-700/50 rounded-xl text-xs text-gray-500 italic">
                Mode lecture seule activé
              </div>
            </form>
          </div>
        </div>

        <!-- CARD: Liste des parties -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div class="bg-gradient-to-r from-purple-600 to-purple-700 px-5 py-4">
            <h2 class="text-lg font-semibold text-white flex items-center gap-2">
              <div class="p-1 bg-white/20 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </div>
              Parties ({{ examStore.parts.length }})
            </h2>
          </div>

          <div class="p-5 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            <div v-if="examStore.parts.length === 0" class="text-center py-12">
              <div class="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg class="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Aucune partie créée</p>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Commencez par créer une partie</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(part, partIndex) in examStore.parts"
                :key="part.id"
                class="group relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden"
                :class="[
                  selectedPart?.id === part.id
                    ? 'border-indigo-500 shadow-lg shadow-indigo-500/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                ]"
                @click="selectPart(part)"
              >
                <!-- En-tête -->
                <div class="p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800">
                  <div class="flex items-start justify-between">
                    <div class="flex items-start gap-3">
                      <span class="flex items-center justify-center w-7 h-7 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium">
                        {{ partIndex + 1 }}
                      </span>
                      <div>
                        <div class="flex items-center gap-2 flex-wrap">
                          <h3 class="font-medium text-gray-800 dark:text-white">
                            {{ part.titre }}
                          </h3>
                          <span
                            v-if="part.is_case_study"
                            class="px-2 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full"
                          >
                            Étude de cas
                          </span>
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {{ getQuestionsCountForPart(part.id) }} question(s) • {{ getPartPoints(part.id) }} pts
                        </p>
                      </div>
                    </div>

                    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        v-if="canEdit"
                        @click.stop="editPart(part)"
                        class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        title="Modifier"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        v-else
                        @click.stop="editPart(part)"
                        class="p-2 rounded-lg text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                        title="Voir les détails"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      <button
                        v-if="canEdit"
                        @click.stop="deletePart(part.id)"
                        class="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        title="Supprimer"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Aperçu contexte -->
                  <Transition
                    enter-active-class="transition-all duration-300"
                    enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                  >
                    <div v-if="part.is_case_study && part.contexte" class="mt-3 ml-10">
                      <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-xs text-gray-600 dark:text-gray-400 border border-amber-200 dark:border-amber-800" v-html="part.contexte"></div>
                    </div>
                  </Transition>
                </div>

                <!-- Mini-liste questions -->
                <Transition
                  enter-active-class="transition-all duration-300"
                  enter-from-class="opacity-0 -translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                >
                  <div v-if="selectedPart?.id === part.id" class="border-t border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
                    <div
                      v-for="(q, qIndex) in getQuestionsForPart(part.id).slice(0, 2)"
                      :key="q.id"
                      class="p-3 flex items-center gap-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <span class="font-medium text-gray-500 dark:text-gray-400 w-5">{{ qIndex + 1 }}</span>
                      <span class="flex-1 truncate text-gray-700 dark:text-gray-300">{{ stripHtml(q.content).substring(0, 40) }}...</span>
                      <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">{{ getQuestionTotalPoints(q).toFixed(2) }} pts</span>
                    </div>
                    <div v-if="getQuestionsForPart(part.id).length > 2" class="p-3 text-center">
                      <span class="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                        + {{ getQuestionsForPart(part.id).length - 2 }} autres
                      </span>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== COLONNE DROITE ========== -->
      <div class="lg:col-span-2 space-y-4 sm:space-y-6">
        <!-- Message si aucune partie -->
        <div v-if="!selectedPart">
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-12 text-center"
            >
              <div class="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-6">
                <svg class="w-12 h-12 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 class="text-xl font-medium text-gray-800 dark:text-white mb-2">
                Aucune partie sélectionnée
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Sélectionnez une partie dans la liste ou créez-en une nouvelle pour commencer à ajouter des questions
              </p>
              <button
                @click="scrollToNewPart"
                class="inline-flex items-center gap-2 px-6 py-3 text-sm bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-500/25"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Créer une partie
              </button>
            </div>
          </Transition>
        </div>

        <!-- CARD: Création de question -->
        <div
          v-else
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div class="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-white flex items-center gap-2">
              <div class="p-1 bg-white/20 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              {{ isExamLocked ? "Consulter" : (editingQuestion ? "Modifier" : "Ajouter") }} une question
            </h2>
            <button
              v-if="!editingQuestion && canEdit"
              @click="openAIModal"
              class="flex items-center gap-2 px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-all border border-white/30"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Générer par IA
            </button>
          </div>

          <div class="p-6 space-y-6">
            <!-- Contexte étude de cas -->
            <Transition
              enter-active-class="transition-all duration-300"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
            >
              <div
                v-if="selectedPart.is_case_study && selectedPart.contexte"
                class="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800"
              >
                <div class="flex items-center gap-2 mb-2">
                  <div class="p-1.5 bg-amber-200 dark:bg-amber-800 rounded-lg">
                    <svg class="w-4 h-4 text-amber-700 dark:text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span class="text-sm font-semibold text-amber-800 dark:text-amber-300">
                    Contexte de l'étude de cas
                  </span>
                </div>
                <div class="text-sm text-gray-700 dark:text-gray-300 prose prose-sm max-w-none" v-html="selectedPart.contexte"></div>
              </div>
            </Transition>

            <!-- Types de questions -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Type de question <span class="text-red-500">*</span>
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                <button
                  v-for="type in questionTypes"
                  :key="type.value"
                  type="button"
                  @click="selectedType = type.value"
                  class="group relative flex flex-col items-center p-3 rounded-xl border-2 transition-all"
                  :class="[
                    selectedType === type.value
                      ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-900/20 shadow-lg shadow-emerald-500/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  ]"
                >
                  <span class="w-6 h-6 mb-2" v-html="type.icon"></span>
                  <span class="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center">
                    {{ type.label }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Énoncé TinyMCE -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Énoncé de la question <span class="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  @click="openRefineModal"
                  :disabled="!questionForm.content"
                  class="flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 rounded-lg text-[10px] font-bold hover:bg-purple-200 disabled:opacity-50 transition-colors"
                >
                   <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   Aide IA
                </button>
              </div>
              <Editor
                api-key="2i64hds9y2pudvppatub5l7yvbpfncjva29myumeyneiqnzl"
                v-model="questionForm.content"
                :init="{
                  height: 200,
                  menubar: false,
                  plugins: 'lists link image table',
                  toolbar: 'undo redo | bold italic underline | bullist numlist | link | table',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; }',
                  branding: false,
                }"
              />
            </div>

            <!-- Points -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Points <span class="text-red-500">*</span> <span class="text-xs text-gray-500">(max 20)</span>
              </label>
              <div class="flex items-center gap-4">
                <div class="relative w-32">
                  <input
                    v-model.number="questionForm.points"
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    @input="handlePointsInput"
                    class="w-full px-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    :class="{ 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/10': pointsError }"
                  />
                  <div v-if="questionForm.points > 20" class="absolute -bottom-6 left-0 text-[10px] text-red-500 font-medium whitespace-nowrap">
                    Maximum 20 points autorisé
                  </div>
                </div>
                <span v-if="pointsError" class="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg">
                  {{ pointsError }}
                </span>
                <span v-else-if="questionForm.points > 0" class="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg font-medium">
                  {{ questionForm.points }} pts valides
                </span>
              </div>
            </div>

            <!-- ========== OPTIONS DYNAMIQUES ========== -->

            <!-- QCM -->
            <div v-if="isQCM" class="space-y-4">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Options de réponse
                </label>
                <button
                  v-if="canEdit"
                  type="button"
                  @click="addOption"
                  class="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter une option
                </button>
              </div>

              <div class="space-y-2">
                <div
                  v-for="(option, index) in questionForm.options"
                  :key="index"
                  class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                >
                  <div class="flex-1 relative">
                    <input
                      v-model="option.text"
                      type="text"
                      :disabled="isExamLocked"
                      :placeholder="`Option ${index + 1}`"
                      class="w-full px-4 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 pr-12 disabled:opacity-75"
                    />
                    <button
                      type="button"
                      @click="toggleCorrect(index)"
                      :disabled="isExamLocked"
                      class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all disabled:opacity-100"
                      :class="
                        option.isCorrect
                          ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                      "
                    >
                      <svg v-if="option.isCorrect" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    @click="removeOption(index)"
                    v-if="questionForm.options.length > 2 && canEdit"
                    class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Option justification -->
              <div class="mt-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-700/20 rounded-xl">
                <label class="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    v-model="questionForm.requireJustification"
                    :disabled="isExamLocked"
                    class="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 disabled:opacity-50"
                  />
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Demander une justification
                  </span>
                </label>

                <Transition
                  enter-active-class="transition-all duration-300"
                  enter-from-class="opacity-0 -translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                >
                  <div v-if="questionForm.requireJustification" class="space-y-3 pl-7">
                    <div>
                      <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Type de justification
                      </label>
                      <select
                        v-model="questionForm.justificationType"
                        :disabled="isExamLocked"
                        class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 disabled:opacity-50"
                      >
                        <option value="text">Texte libre</option>
                        <option value="textarea">Zone de texte longue</option>
                        <option value="keywords">Mots-clés attendus</option>
                      </select>
                    </div>

                    <div v-if="questionForm.justificationType === 'keywords'">
                      <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Mots-clés attendus (séparés par des virgules)
                      </label>
                      <input
                        v-model="questionForm.expectedKeywords"
                        type="text"
                        :disabled="isExamLocked"
                        placeholder="ex: justifier, expliquer, démontrer"
                        class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Points pour la justification
                      </label>
                      <input
                        v-model.number="questionForm.justificationPoints"
                        :disabled="isExamLocked"
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        class="w-24 px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                      />
                    </div>
                  </div>
                </Transition>
              </div>

              <p
                v-if="selectedType === 'qcm_unique' && !hasCorrectOption"
                class="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg"
              >
                 Veuillez marquer une option comme correcte
              </p>
            </div>

            <!-- Texte court -->
            <div v-else-if="selectedType === 'texte_court'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Réponse attendue
                </label>
                <input
                  v-model="questionForm.expectedAnswer"
                  type="text"
                  :disabled="isExamLocked"
                  placeholder="ex: Hypertext Preprocessor"
                  class="w-full px-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                />
              </div>
              <div class="flex items-center gap-4">
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="questionForm.caseSensitive"
                    :disabled="isExamLocked"
                    class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 disabled:opacity-50"
                  />
                  <span class="text-sm text-gray-600 dark:text-gray-400">Respecter la casse</span>
                </label>
              </div>

              <!-- Option justification -->
              <div class="mt-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-700/20 rounded-xl">
                <label class="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    v-model="questionForm.requireJustification"
                    class="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Demander une justification
                  </span>
                </label>

                <Transition
                  enter-active-class="transition-all duration-300"
                  enter-from-class="opacity-0 -translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                >
                  <div v-if="questionForm.requireJustification" class="pl-7">
                    <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Points pour la justification
                    </label>
                    <input
                      v-model.number="questionForm.justificationPoints"
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      class="w-24 px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    />
                  </div>
                </Transition>
              </div>
            </div>

            <!-- Texte long -->
            <div v-else-if="selectedType === 'texte_long'" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mots minimum
                  </label>
                  <input
                    v-model.number="questionForm.minWords"
                    type="number"
                    :disabled="isExamLocked"
                    min="0"
                    class="w-full px-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mots maximum
                  </label>
                  <input
                    v-model.number="questionForm.maxWords"
                    type="number"
                    :disabled="isExamLocked"
                    min="0"
                    class="w-full px-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <!-- Grille d'évaluation -->
              <div class="mt-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-700/20 rounded-xl">
                <label class="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    v-model="questionForm.useEvaluationGrid"
                    :disabled="isExamLocked"
                    class="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 disabled:opacity-50"
                  />
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Utiliser une grille d'évaluation
                  </span>
                </label>

                <Transition
                  enter-active-class="transition-all duration-300"
                  enter-from-class="opacity-0 -translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                >
                  <div v-if="questionForm.useEvaluationGrid" class="space-y-3 pl-7">
                    <div
                      v-for="(critere, idx) in questionForm.evaluationCriteria"
                      :key="idx"
                      class="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg"
                    >
                      <input
                        v-model="critere.name"
                        type="text"
                        :disabled="isExamLocked"
                        :placeholder="`Critère ${idx + 1}`"
                        class="flex-1 px-3 py-1.5 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 disabled:opacity-50"
                      />
                      <input
                        v-model.number="critere.points"
                        type="number"
                        :disabled="isExamLocked"
                        min="0"
                        step="0.5"
                        placeholder="Pts"
                        class="w-20 px-3 py-1.5 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 disabled:opacity-50"
                      />
                      <button
                        v-if="canEdit"
                        @click="removeEvaluationCriteria(idx)"
                        class="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                    <button
                      v-if="canEdit"
                      @click="addEvaluationCriteria"
                      class="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      Ajouter un critère
                    </button>
                  </div>
                </Transition>
              </div>
            </div>

            <!-- Vrai/Faux -->
            <div v-else-if="selectedType === 'vrai_faux'" class="space-y-4">
              <div class="flex items-center gap-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <label class="flex items-center gap-2">
                  <input
                    type="radio"
                    v-model="questionForm.correctAnswer"
                    :disabled="isExamLocked"
                    value="true"
                    class="w-4 h-4 text-emerald-600 focus:ring-emerald-500 disabled:opacity-75"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">Vrai</span>
                </label>
                <label class="flex items-center gap-2">
                  <input
                    type="radio"
                    v-model="questionForm.correctAnswer"
                    :disabled="isExamLocked"
                    value="false"
                    class="w-4 h-4 text-emerald-600 focus:ring-emerald-500 disabled:opacity-75"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">Faux</span>
                </label>
              </div>

              <!-- Option justification -->
              <div class="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-700/20 rounded-xl">
                <label class="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    v-model="questionForm.requireJustification"
                    class="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Demander une justification
                  </span>
                </label>

                <Transition
                  enter-active-class="transition-all duration-300"
                  enter-from-class="opacity-0 -translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                >
                  <div v-if="questionForm.requireJustification" class="space-y-3 pl-7">
                    <div>
                      <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Type de justification
                      </label>
                      <select
                        v-model="questionForm.justificationType"
                        :disabled="isExamLocked"
                        class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 disabled:opacity-50"
                      >
                        <option value="text">Texte libre</option>
                        <option value="textarea">Zone de texte longue</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Points pour la justification
                      </label>
                      <input
                        v-model.number="questionForm.justificationPoints"
                        :disabled="isExamLocked"
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        class="w-24 px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                      />
                    </div>
                  </div>
                </Transition>
              </div>
            </div>

            <!-- ========== CONSTRUCTEUR TABLEAU DYNAMIQUE ========== -->
          <!-- ========== CONSTRUCTEUR TABLEAU DYNAMIQUE AMÉLIORÉ ========== -->
<div v-else-if="selectedType === 'complex_data'" class="space-y-6">
  <!-- Configuration taille -->
  <div class="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 p-5 rounded-xl">
    <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
      <div class="p-1.5 bg-blue-200 dark:bg-blue-800 rounded-lg">
        <svg class="w-4 h-4 text-blue-700 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </div>
      Configuration du tableau
    </h4>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <!-- Colonnes -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-xs font-medium text-gray-600 dark:text-gray-400">
            Colonnes <span class="text-blue-600">(2-8)</span>
          </label>
          <span class="text-sm font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-lg">
            {{ tableauConfig.colonnes }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="decrementerColonnes"
            :disabled="isExamLocked"
            class="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <input
            type="range"
            v-model.number="tableauConfig.colonnes"
            :disabled="isExamLocked"
            min="2"
            max="8"
            class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
            @input="ajusterColonnes"
          />
          <button 
            @click="incrementerColonnes"
            :disabled="isExamLocked"
            class="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Lignes -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-xs font-medium text-gray-600 dark:text-gray-400">
            Lignes <span class="text-blue-600">(1-15)</span>
          </label>
          <span class="text-sm font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-lg">
            {{ tableauConfig.lignes }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="decrementerLignes"
            :disabled="isExamLocked"
            class="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <input
            type="range"
            v-model.number="tableauConfig.lignes"
            :disabled="isExamLocked"
            min="1"
            max="15"
            class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
            @input="ajusterLignes"
          />
          <button 
            @click="incrementerLignes"
            :disabled="isExamLocked"
            class="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Configuration colonnes avec duplication -->
  <div class="bg-white dark:bg-gray-700 p-5 rounded-xl border border-gray-200 dark:border-gray-600">
    <div class="flex items-center justify-between mb-4">
      <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <div class="p-1.5 bg-gray-200 dark:bg-gray-600 rounded-lg">
          <svg class="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <line x1="3" y1="12" x2="21" y2="12" stroke-width="2"/>
            <line x1="3" y1="6" x2="21" y2="6" stroke-width="2"/>
            <line x1="3" y1="18" x2="21" y2="18" stroke-width="2"/>
          </svg>
        </div>
        Configuration des colonnes
      </h4>
      
      <!-- Boutons de duplication rapide -->
      <div class="flex items-center gap-2">
        <button
          @click="ouvrirModalDuplication"
          class="flex items-center gap-1 px-3 py-1.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Dupliquer
        </button>
        <span class="text-xs text-gray-500">|</span>
        <button
          @click="appliquerAToutesLesColonnes"
          class="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-all"
          title="Appliquer la première colonne à toutes"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Uniformiser
        </button>
      </div>
    </div>

    <div class="space-y-3 max-h-[300px] overflow-y-auto pr-2">
      <div
        v-for="(col, idx) in tableauConfig.colonnesListe"
        :key="idx"
        class="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg group relative"
        :class="getColonneClass(col.type)"
      >
        <div class="flex items-center gap-2 w-full sm:w-1/3">
          <span class="text-xs font-medium text-gray-500 w-6">{{ String.fromCharCode(65 + idx) }}.</span>
          <input
            v-model="col.titre"
            type="text"
            :placeholder="`Colonne ${String.fromCharCode(65 + idx)}`"
            class="flex-1 px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
          />
        </div>
        
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <select
            v-model="col.type"
            class="flex-1 sm:w-32 px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
            @change="onColumnTypeChange(col)"
          >
            <optgroup label="Types simples">
              <option value="text" class="text-blue-600">Texte</option>
              <option value="number" class="text-green-600">Nombre</option>
              <option value="color" class="text-pink-600">Couleur</option>
            </optgroup>
            <optgroup label="Types de réponse">
              <option value="select" class="text-purple-600">Liste déroulante</option>
              <option value="qcm_unique" class="text-amber-600">QCM Unique</option>
              <option value="qcm_multiple" class="text-orange-600">QCM Multiple</option>
              <option value="vrai_faux" class="text-cyan-600">Vrai/Faux</option>
              <option value="texte_court" class="text-teal-600">Texte court</option>
              <option value="texte_long" class="text-indigo-600">Texte long</option>
            </optgroup>
          </select>

          <!-- Indicateur visuel du type (petit cercle coloré) -->
          <div class="w-2 h-2 rounded-full" :class="getTypeColor(col.type)"></div>

          <!-- Boutons d'actions rapides -->
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <!-- Pour les colonnes de type select -->
            <button
              v-if="col.type === 'select'"
              @click="ouvrirEditeurOptions(col)"
              class="p-1.5 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg"
              title="Configurer les options"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.02.02A10 10 0 0 0 12 17.66a10 10 0 0 0 6.38-2.64z"/>
              </svg>
            </button>

            <!-- Pour les types de réponse -->
            <button
              v-if="['qcm_unique', 'qcm_multiple', 'vrai_faux', 'texte_long', 'texte_court', 'select'].includes(col.type)"
              @click="configurerTypeReponse(col)"
              class="p-1.5 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg"
              title="Configurer les paramètres"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.02.02A10 10 0 0 0 12 17.66a10 10 0 0 0 6.38-2.64z"/>
              </svg>
            </button>

            <!-- Bouton pour dupliquer cette colonne -->
            <button
              @click="dupliquerColonne(idx)"
              class="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg"
              title="Dupliquer cette colonne"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Résumé des types avec badges colorés -->
    <div class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
      <div class="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
        <span class="font-medium">Types :</span>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(col, idx) in tableauConfig.colonnesListe"
            :key="idx"
            class="px-2 py-0.5 rounded-full text-white text-[10px] font-medium"
            :class="getTypeBadgeClass(col.type)"
          >
            {{ String.fromCharCode(65 + idx) }}: {{ getTypeShortLabel(col.type) }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <!-- Matrice cellules -->
  <div class="bg-white dark:bg-gray-700 p-5 rounded-xl border border-gray-200 dark:border-gray-600">
    <div class="flex items-center justify-between mb-4">
      <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <div class="p-1.5 bg-gray-200 dark:bg-gray-600 rounded-lg">
          <svg class="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
          </svg>
        </div>
        Configuration des cellules
      </h4>
      <span class="text-xs text-gray-500">Cliquez pour configurer</span>
    </div>

    <!-- Légende -->
    <div class="flex flex-wrap items-center gap-4 mb-4 text-xs">
      <div class="flex items-center gap-1">
        <div class="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
        <span>Donnée</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
        <span>Question</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
        <span>Avec justification</span>
      </div>
    </div>

    <!-- Grille -->
    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="border p-2 bg-gray-100 dark:bg-gray-800 text-xs font-medium"></th>
            <th
              v-for="(col, idx) in tableauConfig.colonnesListe"
              :key="idx"
              class="border p-2 text-xs font-medium bg-gray-100 dark:bg-gray-800"
            >
              <div class="flex items-center justify-center gap-1">
                <span>{{ col.titre || `Col ${String.fromCharCode(65 + idx)}` }}</span>
                <div class="w-2 h-2 rounded-full" :class="getTypeColor(col.type)"></div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ligneIdx in tableauConfig.lignes" :key="ligneIdx">
            <td class="border p-2 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-center">
              L{{ ligneIdx }}
            </td>
            <td
              v-for="(col, colIdx) in tableauConfig.colonnesListe"
              :key="colIdx"
              class="border p-1"
            >
              <div
                @click="ouvrirConfigCellule(ligneIdx - 1, colIdx)"
                class="min-h-[60px] p-2 rounded cursor-pointer transition-all hover:scale-105"
                :class="getCelluleClass(ligneIdx - 1, colIdx)"
              >
                <div v-if="getCelluleType(ligneIdx - 1, colIdx) === 'data'" class="text-xs">
                  <svg class="w-3 h-3 inline mr-1 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <span class="text-gray-600 dark:text-gray-400 font-medium">Donnée:</span>
                  <div class="mt-1 text-xs truncate">{{ getCelluleData(ligneIdx - 1, colIdx) || '—' }}</div>
                </div>
                
                <div v-else-if="getCelluleType(ligneIdx - 1, colIdx) === 'question'" class="text-xs">
                  <svg class="w-3 h-3 inline mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-blue-600 font-medium">Question</span>
                  <div class="mt-1 text-gray-600 truncate">{{ getCelluleQuestion(ligneIdx - 1, colIdx)?.type || '?' }}</div>
                  <div v-if="getCelluleQuestion(ligneIdx - 1, colIdx)?.requireJustification" class="mt-1 text-purple-600 text-[10px]">
                    <svg class="w-2 h-2 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Avec justification
                  </div>
                </div>
                
                <div v-else class="text-xs text-gray-400 text-center flex items-center justify-center h-full">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Boutons action -->
  <div class="flex flex-wrap items-center justify-between gap-3">
    <button
      @click="ajouterLigne"
      class="flex items-center gap-2 px-4 py-2.5 text-sm bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-xl hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Ajouter ligne
    </button>

    <button
      @click="ajouterColonne"
      v-if="tableauConfig.colonnes < 8"
      class="flex items-center gap-2 px-4 py-2.5 text-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-all"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Ajouter colonne
    </button>
  </div>
</div>

<!-- ========== CONSTRUCTEUR DE SOUS-QUESTIONS (MULTI-PARTS) ========== -->
<div
  v-else-if="selectedType === 'multi_parts'"
  class="mb-4 sm:mb-5 space-y-4"
>
  <div
    class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800"
  >
    <!-- En-tête -->
    <div class="flex items-center gap-2 mb-4">
      <svg
        class="w-5 h-5 text-amber-600 dark:text-amber-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M4 4h16v16H4z"></path>
        <line x1="9" y1="9" x2="15" y2="15"></line>
        <line x1="15" y1="9" x2="9" y2="15"></line>
      </svg>
      <h3 class="text-sm font-medium text-gray-800 dark:text-white">
        Questions à plusieurs parties
      </h3>
      <span
        class="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full"
      >
        {{ multiParts.length }} partie(s)
      </span>
    </div>

    <!-- Liste des sous-questions -->
    <div class="space-y-4">
      <div
        v-for="(part, idx) in multiParts"
        :key="idx"
        class="p-4 bg-white dark:bg-gray-800 rounded-lg border relative"
      >
        <!-- En-tête de partie -->
        <div
          class="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center gap-3">
            <span
              class="flex items-center justify-center w-7 h-7 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg text-sm font-medium"
            >
              {{ String.fromCharCode(97 + idx) }}
            </span>
            <span
              class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Partie {{ String.fromCharCode(97 + idx).toUpperCase() }}
            </span>
          </div>
          <button
            @click="supprimerMultiPart(idx)"
            class="text-red-600 hover:text-red-800 p-1"
          >
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Configuration de la sous-question -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label class="block text-[10px] text-gray-500 mb-1">Type</label>
            <select
              v-model="part.type"
              class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700"
            >
              <option value="texte_long">Texte long</option>
              <option value="texte_court">Texte court</option>
              <option value="qcm_unique">QCM (choix unique)</option>
              <option value="qcm_multiple">QCM (choix multiples)</option>
              <option value="vrai_faux">Vrai/Faux</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] text-gray-500 mb-1">Points</label>
            <input
              v-model.number="part.points"
              type="number"
              min="0"
              step="0.5"
              class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700"
            />
          </div>
          <div class="md:col-span-3">
            <label class="block text-[10px] text-gray-500 mb-1">Consigne</label>
            <textarea
              v-model="part.consigne"
              rows="2"
              placeholder="Texte de la question..."
              class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700"
            ></textarea>
          </div>
        </div>

        <!-- Options supplémentaires selon le type -->
        <div
          v-if="part.type.includes('qcm')"
          class="mt-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
        >
          <div class="flex items-center justify-between mb-2">
            <span
              class="text-xs font-medium text-gray-700 dark:text-gray-300"
              >Options</span
            >
            <button
              @click="ajouterOptionPart(part)"
              class="text-xs text-indigo-600"
            >
              + Ajouter
            </button>
          </div>
          <div
            v-for="(opt, optIdx) in part.options"
            :key="optIdx"
            class="flex items-center gap-2 mb-2"
          >
            <input
              v-model="opt.text"
              type="text"
              placeholder="Texte de l'option"
              class="flex-1 px-2 py-1 text-xs rounded border bg-white dark:bg-gray-700"
            />
            <label class="flex items-center gap-1">
              <input
                type="checkbox"
                v-model="opt.is_correct"
                class="rounded text-indigo-600"
              />
              <span class="text-xs">Correct</span>
            </label>
            <button
              @click="supprimerOptionPart(part, optIdx)"
              class="text-red-600"
            >
              <svg
                class="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Section justification pour les sous-questions -->
        <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
          <label class="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              v-model="part.requireJustification"
              class="rounded text-indigo-600"
            />
            <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
              Demander une justification
            </span>
          </label>

          <div v-if="part.requireJustification" class="pl-6 space-y-2">
            <div>
              <label class="block text-[10px] text-gray-500 mb-1">
                Type de justification
              </label>
              <select
                v-model="part.justificationType"
                class="w-full px-2 py-1 text-xs rounded border bg-white dark:bg-gray-700"
              >
                <option value="text">Texte libre</option>
                <option value="textarea">Zone de texte longue</option>
                <option value="keywords">Mots-clés attendus</option>
              </select>
            </div>

            <div v-if="part.justificationType === 'keywords'">
              <label class="block text-[10px] text-gray-500 mb-1">
                Mots-clés attendus
              </label>
              <input
                v-model="part.expectedKeywords"
                type="text"
                placeholder="séparés par des virgules"
                class="w-full px-2 py-1 text-xs rounded border bg-white dark:bg-gray-700"
              />
            </div>

            <div>
              <label class="block text-[10px] text-gray-500 mb-1">
                Points pour la justification
              </label>
              <input
                v-model.number="part.justificationPoints"
                type="number"
                min="0"
                step="0.5"
                class="w-16 px-2 py-1 text-xs rounded border bg-white dark:bg-gray-700"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Bouton ajouter une partie -->
      <button
        @click="ajouterMultiPart"
        class="w-full py-3 border-2 border-dashed border-amber-200 dark:border-amber-800 rounded-lg text-amber-600 dark:text-amber-400 text-sm flex items-center justify-center gap-2 hover:bg-amber-50 dark:hover:bg-amber-900/10"
      >
        <svg
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Ajouter une partie
      </button>
    </div>

    <!-- Résumé des points totaux -->
    <div class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
      <div class="flex justify-between items-center text-xs">
        <span class="font-medium text-gray-600 dark:text-gray-400">
          Total des points distribués:
        </span>
        <span class="font-bold text-emerald-600 dark:text-emerald-400">
          {{ calculerTotalPointsMultiParts() }} / {{ questionForm.points }}
        </span>
      </div>
      <div v-if="calculerTotalPointsMultiParts() > questionForm.points" 
           class="mt-1 text-xs text-red-600 dark:text-red-400">
        Le total des points dépasse les points de la question !
      </div>
    </div>
  </div>
</div>





            <!-- Boutons finaux -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                @click="resetQuestionForm"
                class="px-6 py-3 text-sm rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                Annuler
              </button>
              <button
                type="button"
                @click="addQuestion"
                :disabled="!canSaveQuestion || examStore.isLoading || isExamLocked"
                class="px-8 py-3 text-sm rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium transition-all shadow-lg shadow-emerald-500/25 hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ examStore.isLoading ? "Enregistrement..." : editingQuestion ? "Mettre à jour" : "Ajouter la question" }}
              </button>
            </div>
          </div>
        </div>

        <!-- Liste des questions -->
        <div
          v-if="selectedPart"
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div class="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-white flex items-center gap-2">
              <div class="p-1 bg-white/20 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              Questions ({{ getQuestionsForPart(selectedPart.id).length }})
            </h2>
            <button
              v-if="canEdit"
              @click="openAIModal"
              class="flex items-center gap-2 px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-all backdrop-blur-md border border-white/30"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Générer par IA
            </button>
          </div>

          <div class="p-6">
            <div class="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              <div
                v-for="(question, index) in getQuestionsForPart(selectedPart.id)"
                :key="question.id"
                class="group flex flex-col sm:flex-row sm:items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/30 dark:to-gray-800 rounded-xl hover:shadow-md transition-all"
              >
                <div class="flex items-start gap-3 flex-1">
                  <span class="flex items-center justify-center w-7 h-7 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg text-sm font-medium">
                    {{ index + 1 }}
                  </span>

                  <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-2 mb-1">
                      <span class="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
                        {{ getTypeLabel(question.type) }}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">{{ getQuestionTotalPoints(question).toFixed(2) }} pts</span>
                      <span
                        v-if="question.requireJustification"
                        class="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full"
                      >
                        Avec justification
                      </span>
                    </div>
                    <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-2" v-html="question.content"></p>
                  </div>
                </div>

                <div class="flex items-center justify-end sm:justify-start gap-1">
                  <!-- Toujours autoriser la vue de la question dans le formulaire -->
                  <button
                    v-if="canEdit"
                    @click="editQuestion(question)"
                    class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    title="Modifier"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    v-else
                    @click="editQuestion(question)"
                    class="p-2 rounded-lg text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                    title="Voir l'énoncé complet"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <button
                    v-if="canEdit"
                    @click="deleteQuestion(question.id)"
                    class="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    title="Supprimer"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== MODAL AVEC HEADLESSUI ========== -->
    <TransitionRoot appear :show="showCelluleModal" as="template">
      <Dialog as="div" @close="showCelluleModal = false" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
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
              <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all">
                <!-- En-tête modal -->
                <div class="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                  <div class="flex items-center justify-between">
                    <DialogTitle as="h3" class="text-lg font-semibold text-white flex items-center gap-2">
                      <div class="p-1 bg-white/20 rounded-lg">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
                        </svg>
                      </div>
                      Configurer la cellule
                    </DialogTitle>
                    <button
                      @click="showCelluleModal = false"
                      class="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                  <p class="text-sm text-indigo-100 mt-1">
                    Ligne {{ currentCellule.ligne + 1 }} • Colonne {{ currentCellule.colonne + 1 }}
                  </p>
                </div>

                <!-- Corps modal -->
                <div class="p-6 max-h-[70vh] overflow-y-auto">
                  <div class="space-y-6">
                    <!-- Type cellule -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type de cellule
                      </label>
                      <div class="grid grid-cols-2 gap-3">
                        <button
                          @click="currentCellule.type = 'data'"
                          class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all"
                          :class="[
                            currentCellule.type === 'data'
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                          ]"
                        >
                          <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                          </div>
                          <div class="text-left">
                            <span class="text-sm font-medium text-gray-800 dark:text-white">Donnée</span>
                            <p class="text-xs text-gray-500">Valeur pré-remplie</p>
                          </div>
                        </button>

                        <button
                          @click="currentCellule.type = 'question'"
                          class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all"
                          :class="[
                            currentCellule.type === 'question'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                          ]"
                        >
                          <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div class="text-left">
                            <span class="text-sm font-medium text-gray-800 dark:text-white">Question</span>
                            <p class="text-xs text-gray-500">À poser à l'étudiant</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    <!-- Contenu selon type -->
                    <div v-if="currentCellule.type === 'data'">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Valeur pré-remplie
                      </label>
                      <textarea
                        v-model="currentCellule.data"
                        rows="4"
                        class="w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Entrez la valeur par défaut..."
                      ></textarea>
                    </div>

                    <div v-else class="space-y-6">
                      <!-- Type question -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Type de question
                        </label>
                        <select
                          v-model="currentCellule.question.type"
                          class="w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="qcm_unique">QCM (choix unique)</option>
                          <option value="qcm_multiple">QCM (choix multiples)</option>
                          <option value="vrai_faux">Vrai/Faux</option>
                          <option value="texte_court">Texte court</option>
                          <option value="texte_long">Texte long</option>
                        </select>
                      </div>

                      <!-- Options QCM -->
                      <div v-if="['qcm_unique', 'qcm_multiple'].includes(currentCellule.question.type)">
                        <div class="flex items-center justify-between mb-2">
                          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Options
                          </label>
                          <button
                            @click="addOptionCellule"
                            class="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Ajouter
                          </button>
                        </div>
                        <div class="space-y-2">
                          <div
                            v-for="(opt, idx) in currentCellule.question.options"
                            :key="idx"
                            class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                          >
                            <input
                              v-model="opt.text"
                              type="text"
                              :placeholder="`Option ${idx + 1}`"
                              class="flex-1 px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                            />
                            <label class="flex items-center gap-1 px-2">
                              <input
                                type="checkbox"
                                v-model="opt.isCorrect"
                                class="rounded text-indigo-600"
                              />
                              <span class="text-xs">Correct</span>
                            </label>
                            <button
                              @click="removeOptionCellule(idx)"
                              class="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                            >
                              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- Vrai/Faux -->
                      <div v-if="currentCellule.question.type === 'vrai_faux'">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Réponse correcte
                        </label>
                        <div class="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                          <label class="flex items-center gap-2">
                            <input
                              type="radio"
                              v-model="currentCellule.question.correctAnswer"
                              value="true"
                              class="text-indigo-600"
                            />
                            <span>Vrai</span>
                          </label>
                          <label class="flex items-center gap-2">
                            <input
                              type="radio"
                              v-model="currentCellule.question.correctAnswer"
                              value="false"
                              class="text-indigo-600"
                            />
                            <span>Faux</span>
                          </label>
                        </div>
                      </div>

                      <!-- Justification -->
                      <div class="border-t pt-4">
                        <label class="flex items-center gap-3 mb-3">
                          <input
                            type="checkbox"
                            v-model="currentCellule.question.requireJustification"
                            class="w-4 h-4 rounded border-gray-300 text-indigo-600"
                          />
                          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Demander une justification
                          </span>
                        </label>

                        <Transition
                          enter-active-class="transition-all duration-300"
                          enter-from-class="opacity-0 -translate-y-2"
                          enter-to-class="opacity-100 translate-y-0"
                        >
                          <div v-if="currentCellule.question.requireJustification" class="space-y-3 pl-7">
                            <div>
                              <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                Type de justification
                              </label>
                              <select
                                v-model="currentCellule.question.justificationType"
                                class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                              >
                                <option value="text">Texte libre</option>
                                <option value="textarea">Zone de texte longue</option>
                                <option value="keywords">Mots-clés attendus</option>
                              </select>
                            </div>

                            <div v-if="currentCellule.question.justificationType === 'keywords'">
                              <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                Mots-clés attendus
                              </label>
                              <input
                                v-model="currentCellule.question.expectedKeywords"
                                type="text"
                                placeholder="séparés par des virgules"
                                class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                              />
                            </div>

                            <div>
                              <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                Points justification
                              </label>
                              <input
                                v-model.number="currentCellule.question.justificationPoints"
                                type="number"
                                min="0"
                                step="0.5"
                                class="w-24 px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                              />
                            </div>
                          </div>
                        </Transition>
                      </div>

                      <!-- Points -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Points
                        </label>
                        <input
                          v-model.number="currentCellule.question.points"
                          type="number"
                          min="0"
                          max="20"
                          step="0.5"
                          class="w-24 px-4 py-3 rounded-xl border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Pied modal -->
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                  <button
                    @click="showCelluleModal = false"
                    class="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    @click="saveCelluleConfig"
                    class="px-6 py-2 text-sm rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-500/25"
                  >
                    Enregistrer
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Toast -->
    <!-- Toast -->
    <Toast position="top-right" />

    <!-- ========== MODALS IA (DÉPLACÉS ICI POUR MEILLEUR RENDU) ========== -->
    <ClientOnly>
      <TransitionRoot appear :show="showAIModal" as="template">
        <Dialog as="div" @close="showAIModal = false" class="relative z-50">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/70 backdrop-blur-md" />
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
                <DialogPanel class="w-full max-w-3xl transform overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-2xl transition-all">
                  <!-- En-tête -->
                  <div class="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5">
                    <div class="flex items-center justify-between">
                      <DialogTitle as="h3" class="text-xl font-bold text-white flex items-center gap-3">
                        <div class="p-2 bg-white/20 rounded-xl animate-pulse">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        Génération assistée par IA (Gemini)
                      </DialogTitle>
                      <button @click="showAIModal = false" class="text-white/80 hover:text-white transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Configuration -->
                  <div class="p-6 space-y-6">
                    <div v-if="!aiQuestions.length" class="space-y-4">
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Sur quel sujet porteront les questions ?</label>
                        <textarea
                          v-model="aiConfig.topic"
                          rows="3"
                          placeholder="Ex: Les fondamentaux du développement Web moderne avec Vue.js et Tailwind CSS..."
                          class="w-full px-4 py-3 rounded-2xl border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all"
                        ></textarea>
                      </div>

                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nombre de questions</label>
                          <select
                            v-model="aiConfig.count"
                            class="w-full px-4 py-3 rounded-2xl border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
                          >
                            <option :value="3">3 questions</option>
                            <option :value="5">5 questions</option>
                            <option :value="10">10 questions</option>
                          </select>
                        </div>
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Difficulté</label>
                          <select
                            v-model="aiConfig.difficulty"
                            class="w-full px-4 py-3 rounded-2xl border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="débutant">Débutant</option>
                            <option value="intermédiaire">Intermédiaire</option>
                            <option value="avancé">Avancé / Expert</option>
                          </select>
                        </div>
                      </div>

                      <button
                        @click="generateWithAI"
                        :disabled="isGeneratingAI || !aiConfig.topic"
                        class="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                      >
                        <svg v-if="isGeneratingAI" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ isGeneratingAI ? "L'IA réfléchit..." : "Générer les questions" }}
                      </button>
                    </div>

                    <!-- Résultats de l'IA -->
                    <div v-else class="space-y-4">
                      <div class="flex items-center justify-between">
                        <h4 class="font-bold text-gray-800 dark:text-white">Questions suggérées par l'IA :</h4>
                        <button @click="aiQuestions = []" class="text-sm text-purple-600 hover:underline">Recommencer</button>
                      </div>
                      
                      <div class="max-h-[50vh] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        <div
                          v-for="(q, index) in aiQuestions"
                          :key="index"
                          class="p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all bg-gray-50 dark:bg-gray-900/40"
                        >
                          <div class="flex justify-between items-start gap-4 mb-3">
                            <div class="flex-1">
                              <span class="text-[10px] px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full font-bold uppercase">{{ getTypeLabel(q.type) }}</span>
                              <h5 class="font-semibold text-gray-800 dark:text-white mt-1">{{ q.content }}</h5>
                            </div>
                            <button
                              @click="useAIQuestion(q)"
                              class="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20"
                            >
                              Utiliser
                            </button>
                          </div>
                          
                          <div v-if="q.options" class="flex flex-wrap gap-2">
                            <div
                              v-for="(opt, idx) in q.options"
                              :key="idx"
                              class="text-[10px] px-2 py-1 rounded-lg border"
                              :class="opt.is_correct ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800' : 'bg-white border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700'"
                            >
                              {{ opt.text }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>

      <TransitionRoot appear :show="showRefineModal" as="template">
        <Dialog as="div" @close="showRefineModal = false" class="relative z-50">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
            <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </TransitionChild>
          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
                <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-2xl transition-all border border-purple-100 dark:border-purple-900/30">
                  <DialogTitle as="h3" class="text-xl font-bold leading-6 text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                    <span class="p-2 bg-purple-100 dark:bg-purple-900 rounded-xl text-purple-600 dark:text-purple-400">
                      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </span>
                    Suggestions de l'IA pour votre question
                  </DialogTitle>

                  <div v-if="isRefiningAI" class="flex flex-col items-center justify-center py-12 space-y-4">
                    <div class="relative w-16 h-16">
                       <div class="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                       <div class="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p class="text-purple-600 font-medium animate-pulse">L'IA analyse votre question...</p>
                  </div>

                  <div v-else-if="refineResult" class="space-y-6">
                    <!-- Reformulation -->
                    <div class="space-y-2">
                      <h4 class="text-sm font-bold text-gray-500 uppercase tracking-wider">Reformulation suggérée</h4>
                      <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800 text-gray-800 dark:text-gray-200 leading-relaxed shadow-sm">
                        {{ refineResult.refined_content }}
                      </div>
                      <button @click="questionForm.content = refineResult.refined_content; showRefineModal = false" class="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                        Appliquer cette reformulation
                      </button>
                    </div>

                    <!-- Leurre / Distracteurs -->
                    <div v-if="refineResult.suggested_distractors && refineResult.suggested_distractors.length" class="space-y-2">
                      <h4 class="text-sm font-bold text-gray-500 uppercase tracking-wider">Distracteurs suggérés</h4>
                      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div v-for="(d, i) in refineResult.suggested_distractors" :key="i" class="p-3 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 text-xs font-medium text-gray-600 dark:text-gray-300">
                          {{ d }}
                        </div>
                      </div>
                    </div>

                    <!-- Explication -->
                    <div class="space-y-2">
                      <h4 class="text-sm font-bold text-gray-500 uppercase tracking-wider">Guide de correction</h4>
                      <div class="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800 text-sm text-emerald-800 dark:text-emerald-300 italic">
                        "{{ refineResult.explanation }}"
                      </div>
                    </div>

                    <div class="mt-8 flex justify-end">
                      <button @click="showRefineModal = false" class="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-xl font-bold hover:bg-gray-200 transition-colors">Fermer</button>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </ClientOnly>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from "@headlessui/vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useNuxtApp } from '#app'
import Editor from "@tinymce/tinymce-vue";
import { useExamStore } from "~~/stores/exam";

const route = useRoute();
const examStore = useExamStore();
const { $toastr, $swal } = useNuxtApp()

// Récupérer l'ID de l'évaluation depuis l'URL
const evaluationId = route.params.slug;

// ========== DONNÉES LOCALES ==========
const selectedPart = ref(null);
const editingQuestion = ref(null);
const editingPart = ref(null);
const selectedType = ref("qcm_unique");

const isExamLocked = computed(() => {
  if (!examStore.currentEvaluation?.debut) return false;
  return new Date(examStore.currentEvaluation.debut) <= new Date();
});

const canEdit = computed(() => !isExamLocked.value);
const pointsError = ref("");
const totalPointsWarning = ref(false);

// ========== DONNÉES POUR LES TYPES COMPLEXES ==========
// Configuration du tableau
const tableauConfig = ref({
  colonnes: 4,
  lignes: 3,
  colonnesListe: [
    { titre: "Colonne A", type: "text" },
    { titre: "Colonne B", type: "text" },
    { titre: "Colonne C", type: "text" },
    { titre: "Colonne D", type: "text" },
  ],
});

// Options dynamiques pour les colonnes de type select
const columnOptions = ref({});
const tableauData = ref([]);
const cellulesConfig = ref({});
const colonneConfigs = ref({});

// Multi-parts
const multiParts = ref([
  { 
    type: "texte_long", 
    points: 1, 
    consigne: "", 
    options: [],
    requireJustification: false,
    justificationType: "text",
    justificationPoints: 0,
    expectedKeywords: ""
  },
]);

// Rédaction guidée
const guidedWriting = ref({
  min_words: 100,
  max_words: 500,
  consignes: [""],
  criteres: [{ nom: "Pertinence", points: 1 }],
});

const newPart = ref({
  titre: "",
  description: "",
  isCaseStudy: false,
  contexte: "",
});

const questionForm = reactive({
  content: "",
  points: 5,
  options: [
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ],
  expectedAnswer: "",
  caseSensitive: false,
  minWords: 50,
  maxWords: 500,
  requireJustification: false,
  justificationType: 'text',
  justificationPoints: 0,
  expectedKeywords: '',
  useEvaluationGrid: false,
  evaluationCriteria: [{ name: 'Pertinence', points: 1 }],
  correctAnswer: 'true'
});

// ========== DONNÉES POUR LE MODAL ==========
const showCelluleModal = ref(false)
const currentCellule = ref({
  ligne: 0,
  colonne: 0,
  type: 'question',
  data: '',
  question: {
    type: 'qcm_unique',
    content: '',
    options: [],
    correctAnswer: 'true'
  }
})

// ========== AI STATES & METHODS ==========
const showAIModal = ref(false);
const isGeneratingAI = ref(false);
const aiQuestions = ref([]);
const aiConfig = reactive({
  topic: "",
  count: 5,
  difficulty: "intermédiaire"
});

const openAIModal = () => {
  if (!selectedPart.value) {
    if (examStore.parts.length > 0) {
      selectedPart.value = examStore.parts[0];
    } else {
      $toastr.error("Veuillez d'abord créer une partie.");
      return;
    }
  }
  showAIModal.value = true;
};

const generateWithAI = async () => {
  if (!aiConfig.topic) return;
  
  isGeneratingAI.value = true;
  try {
    const result = await examStore.generateQuestionsAI({
      topic: aiConfig.topic,
      count: aiConfig.count,
      difficulty: aiConfig.difficulty,
      part_id: selectedPart.value.id
    });
    
    if (result.success && result.questions) {
      aiQuestions.value = result.questions;
      $toastr.success(`${result.questions.length} suggestions générées !`);
    } else {
      $toastr.error("L'IA n'a pas pu générer de questions. Réessayez.");
    }
  } catch (err) {
    $toastr.error("Erreur de connexion avec l'IA.");
  } finally {
    isGeneratingAI.value = false;
  }
};

const useAIQuestion = (q) => {
  // Remplir le formulaire avec les données de l'IA
  selectedType.value = q.type;
  questionForm.content = q.content;
  questionForm.points = q.points || 2;
  
  if (q.options) {
    questionForm.options = q.options.map(opt => ({
      text: opt.text,
      isCorrect: opt.is_correct
    }));
  }
  
  showAIModal.value = false;
  $toastr.info("Question chargée dans le formulaire.");
  // Scroll to form automatically
  document.querySelector('.lg\\:col-span-2')?.scrollIntoView({ behavior: 'smooth' });
};

// --- Refinement ---
const showRefineModal = ref(false);
const isRefiningAI = ref(false);
const refineResult = ref(null);

const openRefineModal = async () => {
  if (!questionForm.content) {
    $toastr.warning("L'énoncé est vide.");
    return;
  }
  
  $toastr.info("Analyse de la question par l'IA...");
  showRefineModal.value = true;
  isRefiningAI.value = true;
  refineResult.value = null;
  
  try {
    const result = await examStore.refineQuestionAI({
      content: questionForm.content,
      type: selectedType.value,
      options: isQCM.value ? questionForm.options : null
    });
    
    if (result.success) {
      refineResult.value = result;
    } else {
      $toastr.error("L'IA n'a pas pu analyser la question.");
      showRefineModal.value = false;
    }
  } catch (err) {
    $toastr.error("Erreur de connexion...");
    showRefineModal.value = false;
  } finally {
    isRefiningAI.value = false;
  }
};

// ========== WATCHER POUR SURVEILLER LES POINTS ==========
watch(() => examStore.totalPoints, (newTotal) => {
  if (newTotal > 20) {
    totalPointsWarning.value = true;
    $toastr.warning(`⚠️ Total des points: ${newTotal}/20 (dépassement de ${(newTotal - 20).toFixed(1)} pts)`);
  } else if (newTotal === 20) {
    $toastr.success(`✅ Maximum de points atteint (20/20)`);
    totalPointsWarning.value = false;
  } else {
    totalPointsWarning.value = false;
  }
});

// ========== FONCTIONS DE VALIDATION DES POINTS ==========
const handlePointsInput = () => {
  if (questionForm.points > 20) {
    pointsError.value = "Le maximum est de 20 points";
    // On ne force pas la valeur à 20 immédiatement pour laisser l'utilisateur corriger,
    // mais on bloquera la sauvegarde via canSaveQuestion
  } else if (questionForm.points < 0) {
    pointsError.value = "Les points doivent être positifs";
  } else {
    pointsError.value = "";
  }
};

const validateQuestionPoints = (value) => {
  let points = parseFloat(value) || 0;
  points = Math.round(points * 2) / 2;
  
  if (points > 20) {
    pointsError.value = "Les points ne peuvent pas dépasser 20";
    return 20;
  } else if (points < 0) {
    pointsError.value = "Les points doivent être positifs";
    return 0;
  } else {
    pointsError.value = "";
    return points;
  }
};

const formatPoints = (value) => {
  const num = parseFloat(value) || 0;
  return Math.round(num * 2) / 2;
};

const validateMultiPartsPoints = () => {
  const totalParent = questionForm.points;
  const totalParts = calculerTotalPointsMultiParts();
  
  if (totalParts > totalParent) {
    $toastr.warning(
      `Le total des sous-questions (${totalParts.toFixed(1)} pts) dépasse les points de la question parent (${totalParent.toFixed(1)} pts)`,
      { position: 'top-center', timeout: 5000 }
    );
    return false;
  }
  return true;
};

const validateGuidedWritingPoints = () => {
  const totalParent = questionForm.points;
  const totalCriteria = calculerTotalPointsCritères();
  
  if (totalCriteria > totalParent) {
    $toastr.warning(
      `Le total des critères (${totalCriteria.toFixed(1)} pts) dépasse les points de la question (${totalParent.toFixed(1)} pts)`,
      { position: 'top-center', timeout: 5000 }
    );
    return false;
  }
  return true;
};

const validateComplexDataPoints = () => {
  const totalParent = questionForm.points;
  let totalCellQuestions = 0;
  
  Object.values(cellulesConfig.value).forEach(config => {
    if (config.type === 'question' && config.question?.points) {
      totalCellQuestions += config.question.points;
    }
  });
  
  if (totalCellQuestions > totalParent) {
    $toastr.warning(
      `Le total des points des cellules (${totalCellQuestions.toFixed(1)} pts) dépasse les points de la question (${totalParent.toFixed(1)} pts)`,
      { position: 'top-center', timeout: 5000 }
    );
    return false;
  }
  return true;
};

const validateJustificationPoints = () => {
  if (questionForm.requireJustification) {
    const totalWithJustification = questionForm.points + (questionForm.justificationPoints || 0);
    if (totalWithJustification > 20) {
      $toastr.warning(
        `Points totaux avec justification (${totalWithJustification.toFixed(1)} pts) dépassent 20`,
        { position: 'top-center', timeout: 5000 }
      );
      return false;
    }
  }
  return true;
};

const checkTotalPoints = () => {
  const total = examStore.totalPoints;
  if (total > 20) {
    totalPointsWarning.value = true;
    $toastr.warning(`Total des points: ${total.toFixed(1)}/20 (dépassement de ${(total - 20).toFixed(1)} pts)`);
    return false;
  } else if (total === 20) {
    $toastr.success(`Maximum de points atteint (20/20)`);
    totalPointsWarning.value = false;
    return true;
  } else {
    totalPointsWarning.value = false;
    return true;
  }
};

const checkTotalPointsBeforeSave = () => {
  // Calculer le total actuel sans la question en cours d'édition
  let currentTotal = examStore.totalPoints;
  
  if (editingQuestion.value) {
    // Si on édite, enlever les points de l'ancienne version
    currentTotal -= (editingQuestion.value.points || 0);
  }
  
  // Ajouter les nouveaux points
  const newTotal = currentTotal + questionForm.points;
  
  if (newTotal > 20) {
    $toastr.error(
      `Impossible d'ajouter cette question. Le total dépasserait 20 pts (${newTotal.toFixed(1)}/20)`,
      { position: 'top-center', timeout: 5000 }
    );
    return false;
  }
  
  return true;
};

// ========== COMPUTED ==========
const completionRate = computed(() => {
  if (examStore.parts.length === 0) return 0;
  const partsWithQuestions = examStore.parts.filter(
    (p) => getQuestionsForPart(p.id).length > 0,
  ).length;
  return Math.round((partsWithQuestions / examStore.parts.length) * 100);
});

const isQCM = computed(() => {
  return ["qcm_unique", "qcm_multiple", "vrai_faux"].includes(
    selectedType.value,
  );
});

const hasCorrectOption = computed(() => {
  return questionForm.options.some((opt) => opt.isCorrect);
});

const canSaveQuestion = computed(() => {
  if (!questionForm.content.trim()) return false;
  
  // Validation stricte des points
  if (questionForm.points > 20) {
    return false;
  }
  
  if (questionForm.points < 0) {
    return false;
  }
  
  if (isQCM.value && !hasCorrectOption.value) return false;
  
  // Vérifier également les points de justification si applicable
  if (questionForm.requireJustification) {
    const total = questionForm.points + (questionForm.justificationPoints || 0);
    if (total > 20) return false;
  }
  
  return true;
});

const totalPointsDisplay = computed(() => {
  return examStore.totalPoints.toFixed(1);
});

const remainingPoints = computed(() => {
  return (20 - examStore.totalPoints).toFixed(1);
});

// ========== MÉTHODES UTILITAIRES ==========
const stripHtml = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const getTypeLabel = (type) => {
  const found = questionTypes.find((t) => t.value === type);
  return found ? found.label : type;
};

const getQuestionsForPart = (partId) => {
  return examStore.questions.filter((q) => q.part_id === partId);
};

const getQuestionsCountForPart = (partId) => {
  return getQuestionsForPart(partId).length;
};

const getQuestionTotalPoints = (q) => {
  let qPoints = 0;
  
  if (q.points) {
    const p = parseFloat(q.points);
    qPoints += isNaN(p) ? 0 : p;
  }
  
  if (q.config?.requireJustification && q.config?.justificationPoints) {
    const j = parseFloat(q.config.justificationPoints);
    qPoints += isNaN(j) ? 0 : j;
  }
  
  return qPoints;
};

const getPartPoints = (partId) => {
  return getQuestionsForPart(partId).reduce((sum, q) => {
    return sum + getQuestionTotalPoints(q);
  }, 0);
};

// ========== MÉTHODES POUR LES PARTIES ==========
const addPart = async () => {
  if (!newPart.value.titre || isExamLocked.value) return;

  try {
    const partData = {
      evaluation_id: evaluationId,
      titre: newPart.value.titre,
      description: newPart.value.description,
      is_case_study: newPart.value.isCaseStudy,
      contexte: newPart.value.contexte,
    };

    if (editingPart.value) {
      await examStore.updatePart(editingPart.value.id, partData);
      $toastr.success('Partie mise à jour avec succès');
    } else {
      await examStore.addPart({
        ...partData,
        order: examStore.parts.length + 1,
      });
      $toastr.success('Partie créée avec succès');
    }

    resetPartForm();
  } catch (error) {
    console.error("Erreur lors de l'action sur la partie:", error);
    $toastr.error('Erreur lors de l\'enregistrement');
  }
};

const resetPartForm = () => {
  newPart.value = {
    titre: "",
    description: "",
    isCaseStudy: false,
    contexte: "",
  };
  editingPart.value = null;
};

const selectPart = (part) => {
  selectedPart.value = part;
  resetQuestionForm();
};

const editPart = (part) => {
  editingPart.value = part;
  newPart.value = {
    titre: part.titre,
    description: part.description,
    isCaseStudy: part.is_case_study || false,
    contexte: part.contexte || "",
  };
  // Scroll to form automatically
  document.querySelector('.lg\\:col-span-1')?.scrollIntoView({ behavior: 'smooth' });
};

const deletePart = async (partId) => {
  if (isExamLocked.value) {
    $toastr.error("Modification impossible : l'examen a déjà commencé ou est terminé.");
    return;
  }
  const result = await $swal.fire({
    title: 'Êtes-vous sûr ?',
    text: "Cette action est irréversible !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  });

  if (result.isConfirmed) {
    try {
      await examStore.deletePart(partId);
      if (selectedPart.value?.id === partId) {
        selectedPart.value = null;
      }
      $toastr.success('Partie supprimée avec succès');
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      $toastr.error('Erreur lors de la suppression');
    }
  }
};

const scrollToNewPart = () => {
  document
    .querySelector(".bg-gradient-to-r.from-indigo-600")
    ?.scrollIntoView({ behavior: "smooth" });
};

// ========== MÉTHODES POUR LES OPTIONS ==========
const addOption = () => {
  questionForm.options.push({ text: "", isCorrect: false });
};

const removeOption = (index) => {
  if (questionForm.options.length > 2) {
    questionForm.options.splice(index, 1);
  }
};

const toggleCorrect = (index) => {
  if (selectedType.value === "qcm_unique") {
    questionForm.options.forEach((opt, i) => {
      opt.isCorrect = i === index;
    });
  } else {
    questionForm.options[index].isCorrect =
      !questionForm.options[index].isCorrect;
  }
};

// ========== MÉTHODES POUR TABLEAU ==========
const ajusterColonnes = () => {
  const oldLength = tableauConfig.value.colonnesListe.length;
  const newLength = tableauConfig.value.colonnes;

  if (newLength > oldLength) {
    for (let i = oldLength; i < newLength; i++) {
      tableauConfig.value.colonnesListe.push({
        titre: `Colonne ${String.fromCharCode(65 + i)}`,
        type: "text",
      });
    }
  } else if (newLength < oldLength) {
    tableauConfig.value.colonnesListe = tableauConfig.value.colonnesListe.slice(
      0,
      newLength,
    );
  }

  ajusterLignes();
};

const ajusterLignes = () => {
  const newLignes = [];
  for (let i = 0; i < tableauConfig.value.lignes; i++) {
    const ligne = {};
    for (let j = 0; j < tableauConfig.value.colonnes; j++) {
      ligne[`col_${j}`] = "";
    }
    newLignes.push(ligne);
  }
  tableauData.value = newLignes;
};

const ajouterLigne = () => {
  const ligne = {};
  for (let j = 0; j < tableauConfig.value.colonnes; j++) {
    ligne[`col_${j}`] = "";
  }
  tableauData.value.push(ligne);
  tableauConfig.value.lignes++;
};

const supprimerLigne = (index) => {
  tableauData.value.splice(index, 1);
  tableauConfig.value.lignes--;
};

const ajouterColonne = () => {
  if (tableauConfig.value.colonnes < 8) {
    tableauConfig.value.colonnes++;
    tableauConfig.value.colonnesListe.push({
      titre: `Colonne ${String.fromCharCode(65 + tableauConfig.value.colonnes - 1)}`,
      type: "text",
    });
    tableauData.value.forEach((ligne) => {
      ligne[`col_${tableauConfig.value.colonnes - 1}`] = "";
    });
  }
};

const supprimerMultiPart = (index) => {
  multiParts.value.splice(index, 1);
};

const ajouterMultiPart = () => {
  multiParts.value.push({
    type: "texte_long",
    points: 1,
    consigne: "",
    options: [],
    requireJustification: false,
    justificationType: "text",
    justificationPoints: 0,
    expectedKeywords: ""
  });
};

const ajouterOptionPart = (part) => {
  if (!part.options) part.options = [];
  part.options.push({ text: "", is_correct: false });
};

const supprimerOptionPart = (part, index) => {
  part.options.splice(index, 1);
};

const calculerTotalPointsMultiParts = () => {
  return multiParts.value.reduce((total, part) => {
    const p = parseFloat(part.points) || 0;
    let pointsPart = p;
    if (part.requireJustification) {
      const j = parseFloat(part.justificationPoints) || 0;
      pointsPart += j;
    }
    return total + pointsPart;
  }, 0);
};

// ========== MÉTHODES POUR RÉDACTION ==========
const ajouterConsigne = () => {
  guidedWriting.value.consignes.push("");
};

const supprimerConsigne = (index) => {
  guidedWriting.value.consignes.splice(index, 1);
};

const ajouterCritere = () => {
  guidedWriting.value.criteres.push({ nom: "", points: 1 });
};

const supprimerCritere = (index) => {
  guidedWriting.value.criteres.splice(index, 1);
};

const calculerTotalPointsCritères = () => {
  return guidedWriting.value.criteres.reduce((total, critere) => {
    const p = parseFloat(critere.points) || 0;
    return total + p;
  }, 0);
};

// ========== MÉTHODES POUR LA CONFIGURATION DES CELLULES ==========
const ouvrirConfigCellule = (ligne, colonne) => {
  const key = `${ligne}-${colonne}`;
  const existing = cellulesConfig.value[key] || {
    type: 'question',
    data: '',
    question: {
      type: 'qcm_unique',
      options: [{ text: '', isCorrect: false }],
      correctAnswer: 'true',
      requireJustification: false,
      justificationType: 'text',
      expectedKeywords: '',
      justificationPoints: 0,
      points: 1
    }
  };
  
  currentCellule.value = {
    ligne,
    colonne,
    ...existing
  };
  
  showCelluleModal.value = true;
};

const saveCelluleConfig = () => {
  const key = `${currentCellule.value.ligne}-${currentCellule.value.colonne}`;
  cellulesConfig.value[key] = {
    type: currentCellule.value.type,
    data: currentCellule.value.data,
    question: currentCellule.value.question
  };
  
  // Valider les points après sauvegarde
  if (currentCellule.value.type === 'question') {
    validateComplexDataPoints();
  }
  
  showCelluleModal.value = false;
};

const getCelluleClass = (ligne, colonne) => {
  const key = `${ligne}-${colonne}`;
  const config = cellulesConfig.value[key];
  
  if (!config) return 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100';
  if (config.type === 'data') return 'bg-green-50 dark:bg-green-900/20 border border-green-200';
  if (config.question?.requireJustification) return 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200';
  return 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200';
};

const getCelluleType = (ligne, colonne) => {
  const key = `${ligne}-${colonne}`;
  return cellulesConfig.value[key]?.type || null;
};

const getCelluleData = (ligne, colonne) => {
  const key = `${ligne}-${colonne}`;
  return cellulesConfig.value[key]?.data || '';
};

const getCelluleQuestion = (ligne, colonne) => {
  const key = `${ligne}-${colonne}`;
  return cellulesConfig.value[key]?.question || null;
};

const addOptionCellule = () => {
  if (!currentCellule.value.question.options) {
    currentCellule.value.question.options = [];
  }
  currentCellule.value.question.options.push({ text: '', isCorrect: false });
};

const removeOptionCellule = (index) => {
  currentCellule.value.question.options.splice(index, 1);
};

// ========== MÉTHODES POUR LES CRITÈRES ==========
const addEvaluationCriteria = () => {
  questionForm.evaluationCriteria.push({ name: '', points: 1 });
};

const removeEvaluationCriteria = (index) => {
  questionForm.evaluationCriteria.splice(index, 1);
};

// ========== TYPES DE QUESTIONS ==========
const questionTypes = [
  {
    value: "qcm_unique",
    label: "QCM Unique",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>',
  },
  {
    value: "qcm_multiple",
    label: "QCM Multiple",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="12" y1="9" x2="12" y2="15"/></svg>',
  },
  {
    value: "vrai_faux",
    label: "Vrai/Faux",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/><path d="M20 18L9 7l-5 5"/></svg>',
  },
  {
    value: "texte_court",
    label: "Texte court",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="14" y2="18"/></svg>',
  },
  {
    value: "texte_long",
    label: "Texte long",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg>',
  },
  // {
  //   value: "complex_data",
  //   label: "Tableau",
  //   icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="21" x2="9" y2="9"></line><line x1="15" y1="21" x2="15" y2="9"></line></svg>',
  // },
  // {
  //   value: "multi_parts",
  //   label: "Multi-parties",
  //   icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"></path><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>',
  // },

];

// ========== MÉTHODES POUR LES COULEURS DES TYPES ==========
const getTypeColor = (type) => {
  const colors = {
    text: 'bg-blue-500',
    number: 'bg-green-500',
    select: 'bg-purple-500',
    color: 'bg-pink-500',
    qcm_unique: 'bg-amber-500',
    qcm_multiple: 'bg-orange-500',
    vrai_faux: 'bg-cyan-500',
    texte_court: 'bg-teal-500',
    texte_long: 'bg-indigo-500'
  };
  return colors[type] || 'bg-gray-500';
};

const getTypeBadgeClass = (type) => {
  const badges = {
    text: 'bg-blue-500',
    number: 'bg-green-500',
    select: 'bg-purple-500',
    color: 'bg-pink-500',
    qcm_unique: 'bg-amber-500',
    qcm_multiple: 'bg-orange-500',
    vrai_faux: 'bg-cyan-500',
    texte_court: 'bg-teal-500',
    texte_long: 'bg-indigo-500'
  };
  return badges[type] || 'bg-gray-500';
};

const getTypeShortLabel = (type) => {
  const labels = {
    text: 'Texte',
    number: 'Nb',
    select: 'Liste',
    color: 'Coul',
    qcm_unique: 'QCM U',
    qcm_multiple: 'QCM M',
    vrai_faux: 'V/F',
    texte_court: 'Court',
    texte_long: 'Long'
  };
  return labels[type] || type;
};

const getColonneClass = (type) => {
  const classes = {
    text: 'bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-blue-500',
    number: 'bg-green-50/50 dark:bg-green-900/10 border-l-4 border-green-500',
    select: 'bg-purple-50/50 dark:bg-purple-900/10 border-l-4 border-purple-500',
    color: 'bg-pink-50/50 dark:bg-pink-900/10 border-l-4 border-pink-500',
    qcm_unique: 'bg-amber-50/50 dark:bg-amber-900/10 border-l-4 border-amber-500',
    qcm_multiple: 'bg-orange-50/50 dark:bg-orange-900/10 border-l-4 border-orange-500',
    vrai_faux: 'bg-cyan-50/50 dark:bg-cyan-900/10 border-l-4 border-cyan-500',
    texte_court: 'bg-teal-50/50 dark:bg-teal-900/10 border-l-4 border-teal-500',
    texte_long: 'bg-indigo-50/50 dark:bg-indigo-900/10 border-l-4 border-indigo-500'
  };
  return classes[type] || 'bg-gray-50/50 dark:bg-gray-700/10 border-l-4 border-gray-500';
};

// ========== MÉTHODES POUR LA CONFIGURATION DES COLONNES ==========
const onColumnTypeChange = (col) => {
  if (col.type === "select" && !columnOptions.value[col.titre]) {
    columnOptions.value[col.titre] = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ];
  }
};

const ouvrirEditeurOptions = async (col) => {
  const { value: optionsStr } = await $swal.fire({
    title: 'Configurer les options',
    input: 'textarea',
    inputLabel: 'Options au format JSON',
    inputValue: JSON.stringify(columnOptions.value[col.titre] || [], null, 2),
    inputPlaceholder: 'Entrez les options au format JSON...',
    showCancelButton: true,
    confirmButtonText: 'Valider',
    cancelButtonText: 'Annuler',
    inputValidator: (value) => {
      try {
        JSON.parse(value);
        return null;
      } catch (e) {
        return 'Format JSON invalide';
      }
    }
  });

  if (optionsStr) {
    try {
      columnOptions.value[col.titre] = JSON.parse(optionsStr);
      $toastr.success('Options enregistrées');
    } catch (e) {
      $toastr.error('Format JSON invalide');
    }
  }
};

const configurerTypeReponse = (col) => {
  if (col.type === 'texte_long') {
    configurerTexteLong(col);
  } else if (col.type === 'texte_court') {
    configurerTexteCourt(col);
  } else if (col.type === 'select') {
    ouvrirEditeurOptions(col);
  } else if (col.type === 'qcm_unique' || col.type === 'qcm_multiple') {
    configurerQCM(col);
  } else if (col.type === 'vrai_faux') {
    configurerVraiFaux(col);
  }
};

const configurerTexteLong = async (col) => {
  const config = colonneConfigs.value[col.titre] || { minWords: 50, maxWords: 500 };
  
  const { value: formValues } = await $swal.fire({
    title: 'Configuration texte long',
    html: `
      <div class="space-y-3">
        <div>
          <label class="block text-sm text-left mb-1">Mots minimum</label>
          <input id="minWords" type="number" min="0" value="${config.minWords}" class="swal2-input">
        </div>
        <div>
          <label class="block text-sm text-left mb-1">Mots maximum</label>
          <input id="maxWords" type="number" min="0" value="${config.maxWords}" class="swal2-input">
        </div>
      </div>
    `,
    focusConfirm: false,
    preConfirm: () => {
      return {
        minWords: parseInt(document.getElementById('minWords').value),
        maxWords: parseInt(document.getElementById('maxWords').value)
      };
    },
    showCancelButton: true,
    confirmButtonText: 'Enregistrer',
    cancelButtonText: 'Annuler'
  });

  if (formValues) {
    colonneConfigs.value[col.titre] = formValues;
    $toastr.success('Configuration enregistrée');
  }
};

const configurerTexteCourt = async (col) => {
  const config = colonneConfigs.value[col.titre] || { caseSensitive: false };
  
  const { value: formValues } = await $swal.fire({
    title: 'Configuration texte court',
    html: `
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <input id="caseSensitive" type="checkbox" ${config.caseSensitive ? 'checked' : ''}>
          <label for="caseSensitive">Respecter la casse</label>
        </div>
      </div>
    `,
    focusConfirm: false,
    preConfirm: () => {
      return {
        caseSensitive: document.getElementById('caseSensitive').checked
      };
    },
    showCancelButton: true,
    confirmButtonText: 'Enregistrer',
    cancelButtonText: 'Annuler'
  });

  if (formValues) {
    colonneConfigs.value[col.titre] = formValues;
    $toastr.success('Configuration enregistrée');
  }
};

const configurerQCM = async (col) => {
  $swal.fire({
    title: 'Configuration QCM',
    text: 'Cette fonctionnalité sera bientôt disponible',
    icon: 'info',
    confirmButtonText: 'OK'
  });
};

const configurerVraiFaux = async (col) => {
  const config = colonneConfigs.value[col.titre] || { correctAnswer: 'true' };
  
  const { value: formValues } = await $swal.fire({
    title: 'Configuration Vrai/Faux',
    html: `
      <div class="space-y-3">
        <div class="flex items-center justify-center gap-4">
          <label class="flex items-center gap-2">
            <input type="radio" name="correctAnswer" value="true" ${config.correctAnswer === 'true' ? 'checked' : ''}>
            <span>Vrai</span>
          </label>
          <label class="flex items-center gap-2">
            <input type="radio" name="correctAnswer" value="false" ${config.correctAnswer === 'false' ? 'checked' : ''}>
            <span>Faux</span>
          </label>
        </div>
      </div>
    `,
    focusConfirm: false,
    preConfirm: () => {
      const radios = document.getElementsByName('correctAnswer');
      for (let radio of radios) {
        if (radio.checked) {
          return { correctAnswer: radio.value };
        }
      }
      return { correctAnswer: 'true' };
    },
    showCancelButton: true,
    confirmButtonText: 'Enregistrer',
    cancelButtonText: 'Annuler'
  });

  if (formValues) {
    colonneConfigs.value[col.titre] = formValues;
    $toastr.success('Configuration enregistrée');
  }
};

// ========== MÉTHODES DE DUPLICATION ==========
const ouvrirModalDuplication = async () => {
  const { value: sourceCol } = await $swal.fire({
    title: 'Dupliquer une configuration',
    text: 'Choisissez la colonne source à dupliquer',
    input: 'select',
    inputOptions: tableauConfig.value.colonnesListe.reduce((acc, col, idx) => {
      acc[idx] = `Colonne ${String.fromCharCode(65 + idx)}: ${col.titre || `Colonne ${String.fromCharCode(65 + idx)}`} (${col.type})`;
      return acc;
    }, {}),
    showCancelButton: true,
    confirmButtonText: 'Suivant',
    cancelButtonText: 'Annuler'
  });

  if (sourceCol !== undefined) {
    const { value: targetCols } = await $swal.fire({
      title: 'Colonnes cibles',
      text: 'Sélectionnez les colonnes à remplacer (séparées par des virgules, ex: 0,2,4)',
      input: 'text',
      inputPlaceholder: 'ex: 1,3,4',
      showCancelButton: true,
      confirmButtonText: 'Dupliquer',
      cancelButtonText: 'Annuler'
    });

    if (targetCols) {
      const targetIndexes = targetCols.split(',').map(i => parseInt(i.trim())).filter(i => !isNaN(i));
      dupliquerConfiguration(parseInt(sourceCol), targetIndexes);
    }
  }
};

const dupliquerConfiguration = (sourceIdx, targetIndexes) => {
  const sourceCol = { ...tableauConfig.value.colonnesListe[sourceIdx] };
  
  targetIndexes.forEach(idx => {
    if (idx >= 0 && idx < tableauConfig.value.colonnesListe.length && idx !== sourceIdx) {
      tableauConfig.value.colonnesListe[idx].type = sourceCol.type;
      tableauConfig.value.colonnesListe[idx].titre = sourceCol.titre;
      
      if (sourceCol.type === 'select' && columnOptions.value[sourceCol.titre]) {
        columnOptions.value[tableauConfig.value.colonnesListe[idx].titre] = 
          JSON.parse(JSON.stringify(columnOptions.value[sourceCol.titre]));
      }
      
      if (colonneConfigs.value && colonneConfigs.value[sourceIdx]) {
        if (!colonneConfigs.value[idx]) {
          colonneConfigs.value[idx] = {};
        }
        colonneConfigs.value[idx] = JSON.parse(JSON.stringify(colonneConfigs.value[sourceIdx]));
      }
    }
  });
  
  $toastr.success(`Configuration dupliquée vers ${targetIndexes.length} colonne(s)`);
};

const appliquerAToutesLesColonnes = async () => {
  const result = await $swal.fire({
    title: 'Uniformiser les colonnes',
    text: 'Voulez-vous appliquer la configuration de la première colonne à toutes les colonnes ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, appliquer',
    cancelButtonText: 'Annuler'
  });

  if (result.isConfirmed && tableauConfig.value.colonnesListe.length > 0) {
    const sourceCol = tableauConfig.value.colonnesListe[0];
    const sourceType = sourceCol.type;
    
    tableauConfig.value.colonnesListe.forEach((col, idx) => {
      if (idx > 0) {
        col.type = sourceType;
      }
    });
    
    $toastr.success('Type appliqué à toutes les colonnes');
  }
};

const dupliquerColonne = (idx) => {
  if (tableauConfig.value.colonnes < 8) {
    tableauConfig.value.colonnes++;
    const newCol = { ...tableauConfig.value.colonnesListe[idx] };
    newCol.titre = `${newCol.titre} (copie)`;
    tableauConfig.value.colonnesListe.push(newCol);
    
    tableauData.value.forEach(ligne => {
      ligne[`col_${tableauConfig.value.colonnes - 1}`] = ligne[`col_${idx}`] || '';
    });
    
    ajusterColonnes();
    $toastr.success('Colonne dupliquée avec succès');
  } else {
    $toastr.warning('Nombre maximum de colonnes atteint (8)');
  }
};

// ========== MÉTHODES POUR LES QUESTIONS ==========
const addQuestion = async () => {
  if (!selectedPart.value || !canSaveQuestion.value || isExamLocked.value) return;

  // Formater les points
  questionForm.points = formatPoints(questionForm.points);
  
  // Validation du total global
  if (!checkTotalPointsBeforeSave()) {
    return;
  }

  // Validation des points selon le type
  if (selectedType.value === "multi_parts" && !validateMultiPartsPoints()) {
    return;
  }
  

  
  if (selectedType.value === "complex_data" && !validateComplexDataPoints()) {
    return;
  }
  
  if (!validateJustificationPoints()) {
    return;
  }

  let optionsData = [];
  if (isQCM.value) {
    optionsData = questionForm.options
      .filter((opt) => opt.text.trim() !== "")
      .map((opt, index) => ({
        text: opt.text,
        is_correct: opt.isCorrect,
        order: index + 1,
      }));
  }

  const questionData = {
    part_id: selectedPart.value.id,
    content: questionForm.content,
    type: selectedType.value,
    points: questionForm.points,
    order: getQuestionsForPart(selectedPart.value.id).length + 1,
    config: {
      requireJustification: questionForm.requireJustification,
      justificationType: questionForm.justificationType,
      justificationPoints: questionForm.justificationPoints,
      expectedKeywords: questionForm.expectedKeywords,
      ...(selectedType.value === "texte_court" && {
        expectedAnswer: questionForm.expectedAnswer,
        caseSensitive: questionForm.caseSensitive,
      }),
      ...(selectedType.value === "texte_long" && {
        minWords: questionForm.minWords,
        maxWords: questionForm.maxWords,
        useEvaluationGrid: questionForm.useEvaluationGrid,
        evaluationCriteria: questionForm.evaluationCriteria,
      }),
      ...(selectedType.value === "vrai_faux" && {
        correctAnswer: questionForm.correctAnswer,
      }),
    },
    options: optionsData,
  };

  // Ajouter les données complexes selon le type
  if (selectedType.value === "complex_data") {
    questionData.complex_data = {
      data_type: "tableau_analyse",
      configuration: {
        colonnes: tableauConfig.value.colonnesListe,
      },
      data: tableauData.value,
      cell_configuration: cellulesConfig.value,
      cell_data: {}
    };
  }

  if (selectedType.value === "multi_parts") {
    questionData.multi_parts_data = {
      parts: multiParts.value.filter((p) => p.consigne.trim() !== ""),
      configuration: {
        total_parts: multiParts.value.length,
        points_distribues: calculerTotalPointsMultiParts()
      }
    };
  }

 

  try {
    if (editingQuestion.value) {
      await examStore.updateQuestion(editingQuestion.value.id, questionData);
      $toastr.success('Question mise à jour avec succès');
    } else {
      await examStore.addQuestion(questionData);
      $toastr.success('Question ajoutée avec succès');
    }

    await examStore.fetchQuestions(selectedPart.value.id);
    resetQuestionForm();
    
    // Vérifier le total après ajout
    checkTotalPoints();
  } catch (error) {
    console.error("Erreur lors de l'ajout de la question:", error);
    $toastr.error("Erreur lors de l'enregistrement");
  }
};

const editQuestion = (question) => {
  editingQuestion.value = question;
  selectedType.value = question.type;
  questionForm.content = question.content;
  questionForm.points = question.points;

  if (question.options && question.options.length > 0) {
    questionForm.options = question.options.map((opt) => ({
      text: opt.text,
      isCorrect: opt.is_correct,
    }));
  } else {
    questionForm.options = [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ];
  }

  if (question.type === "texte_court") {
    questionForm.expectedAnswer = question.config?.expectedAnswer || "";
    questionForm.caseSensitive = question.config?.caseSensitive || false;
  }

  if (question.type === "texte_long") {
    questionForm.minWords = question.config?.minWords || 50;
    questionForm.maxWords = question.config?.maxWords || 500;
    questionForm.useEvaluationGrid = question.config?.useEvaluationGrid || false;
    questionForm.evaluationCriteria = question.config?.evaluationCriteria || [{ name: 'Pertinence', points: 1 }];
  }

  if (question.type === "vrai_faux") {
    questionForm.correctAnswer = question.config?.correctAnswer || 'true';
  }

  // Restaurer les réglages de justification
  questionForm.requireJustification = question.config?.requireJustification || false;
  questionForm.justificationType = question.config?.justificationType || 'text';
  questionForm.justificationPoints = question.config?.justificationPoints || 0;
  questionForm.expectedKeywords = question.config?.expectedKeywords || '';

  // Charger les données complexes si présentes
  if (question.type === "complex_data" && question.complex_data) {
    if (question.complex_data.configuration?.colonnes) {
      tableauConfig.value.colonnesListe =
        question.complex_data.configuration.colonnes;
      tableauConfig.value.colonnes = tableauConfig.value.colonnesListe.length;
    }
    
    if (question.complex_data.data) {
      tableauData.value = question.complex_data.data;
      tableauConfig.value.lignes = tableauData.value.length;
    }
    
    if (question.complex_data.cell_configuration) {
      cellulesConfig.value = question.complex_data.cell_configuration;
    } else {
      cellulesConfig.value = {};
    }
  }

  if (question.type === "multi_parts") {
    const multiPartsData = examStore.getMultiPartsForQuestion(question.id);
    
    if (multiPartsData && multiPartsData.parts) {
      multiParts.value = multiPartsData.parts;
    } else if (question.multi_parts && question.multi_parts.parts) {
      multiParts.value = question.multi_parts.parts;
    } else {
      multiParts.value = [
        { 
          type: "texte_long", 
          points: 1, 
          consigne: "", 
          options: [],
          requireJustification: false,
          justificationType: "text",
          justificationPoints: 0,
          expectedKeywords: ""
        },
      ];
    }
  }

 
};

const deleteQuestion = async (questionId) => {
  if (isExamLocked.value) {
    $toastr.error("Modification impossible : l'examen a déjà commencé ou est terminé.");
    return;
  }
  const result = await $swal.fire({
    title: 'Êtes-vous sûr ?',
    text: "Cette question sera définitivement supprimée !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  });

  if (result.isConfirmed) {
    try {
      await examStore.deleteQuestion(questionId);
      $toastr.success('Question supprimée avec succès');
      
      // Vérifier le total après suppression
      checkTotalPoints();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      $toastr.error('Erreur lors de la suppression');
    }
  }
};

const resetQuestionForm = () => {
  questionForm.content = "";
  questionForm.points = 5;
  questionForm.options = [
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ];
  questionForm.expectedAnswer = "";
  questionForm.caseSensitive = false;
  questionForm.minWords = 50;
  questionForm.maxWords = 500;
  questionForm.requireJustification = false;
  questionForm.justificationType = 'text';
  questionForm.justificationPoints = 0;
  questionForm.expectedKeywords = '';
  questionForm.useEvaluationGrid = false;
  questionForm.evaluationCriteria = [{ name: 'Pertinence', points: 1 }];
  questionForm.correctAnswer = 'true';
  
  pointsError.value = "";
  editingQuestion.value = null;
  selectedType.value = "qcm_unique";

  tableauConfig.value = {
    colonnes: 4,
    lignes: 3,
    colonnesListe: [
      { titre: "Colonne A", type: "text" },
      { titre: "Colonne B", type: "text" },
      { titre: "Colonne C", type: "text" },
      { titre: "Colonne D", type: "text" },
    ],
  };
  tableauData.value = [];
  cellulesConfig.value = {};

  multiParts.value = [
    { 
      type: "texte_long", 
      points: 1, 
      consigne: "", 
      options: [],
      requireJustification: false,
      justificationType: "text",
      justificationPoints: 0,
      expectedKeywords: ""
    },
  ];

  guidedWriting.value = {
    min_words: 100,
    max_words: 500,
    consignes: [""],
    criteres: [{ nom: "Pertinence", points: 1 }],
  };
};

// ========== CHARGEMENT INITIAL ==========
onMounted(async () => {
  try {
    await examStore.loadExam(evaluationId);
    if (examStore.parts.length > 0) {
      selectedPart.value = examStore.parts[0];
    }

    ajusterLignes();
    
    // Vérifier le total au chargement
    checkTotalPoints();
  } catch (error) {
    console.error("Erreur lors du chargement de l'examen:", error);
  }
});
</script>
<style scoped>
/* Pour TinyMCE en mode sombre */
.dark .tox-tinymce {
  background-color: #1f2937;
  border-color: #374151;
}

/* Line clamp */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Scrollbar personnalisée */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}

/* Animations pour les transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>