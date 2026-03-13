<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-4 md:p-6 lg:p-8 transition-colors">
    
    <!-- ========== BREADCRUMB ========== -->
    <Breadcrumb
      :items="[
        { label: 'Examens', to: '/examens' },
        { label: 'Constructeur', to: null }
      ]"
      :title="`Constructeur - ${examStore.examTitle}`"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4 sm:mb-6"
    />

    <!-- ========== EN-TÊTE STATISTIQUES ========== -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <!-- Carte: Parties -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Parties</p>
            <p class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{{ examStore.parts.length }}</p>
          </div>
          <div class="p-2 sm:p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Carte: Questions -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Questions</p>
            <p class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{{ examStore.totalQuestions }}</p>
          </div>
          <div class="p-2 sm:p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Carte: Points -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Points</p>
            <p class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{{ examStore.totalPoints }}</p>
          </div>
          <div class="p-2 sm:p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Carte: Progression -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Complétion</p>
            <p class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{{ completionRate }}%</p>
          </div>
          <div class="p-2 sm:p-3 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <!-- Barre de progression -->
        <div class="mt-2 sm:mt-3 w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full" :style="{ width: completionRate + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- ========== GRILLE PRINCIPALE ========== -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      
      <!-- ========== COLONNE GAUCHE ========== -->
      <div class="lg:col-span-1 space-y-4 sm:space-y-6">
        
        <!-- CARD: Création d'une partie -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div class="bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 sm:px-5 py-3 sm:py-4">
            <h2 class="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter une partie
            </h2>
          </div>
          
          <div class="p-4 sm:p-5">
            <form @submit.prevent="addPart" class="space-y-3 sm:space-y-4">
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Titre de la partie *
                </label>
                <input
                  v-model="newPart.titre"
                  type="text"
                  placeholder="ex: Partie 1: Théorie"
                  required
                  class="w-full px-3 sm:px-4 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  v-model="newPart.description"
                  rows="2"
                  placeholder="Description de la partie..."
                  class="w-full px-3 sm:px-4 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <!-- Option étude de cas -->
              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  v-model="newPart.isCaseStudy"
                  id="isCaseStudy"
                  class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label for="isCaseStudy" class="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  C'est une étude de cas
                </label>
              </div>

              <!-- Contexte pour étude de cas -->
              <div v-if="newPart.isCaseStudy">
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contexte de l'étude de cas *
                </label>
                <Editor
                  api-key="ktf8z0z55enm2wd9xyeoo6qzzoy7w9b629e51wii9y8lw4dx"
                  v-model="newPart.contexte"
                  :init="{
                    height: 150,
                    menubar: false,
                    plugins: 'lists link image',
                    toolbar: 'undo redo | bold italic | bullist numlist | link',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:13px; }'
                  }"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Ce contexte sera visible pour toutes les questions de cette partie
                </p>
              </div>
              
              <button
                type="submit"
                :disabled="examStore.isLoading"
                class="w-full px-4 py-2.5 text-sm bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all font-medium shadow-sm disabled:opacity-50"
              >
                {{ examStore.isLoading ? 'Création...' : 'Créer la partie' }}
              </button>
            </form>
          </div>
        </div>

        <!-- CARD: Liste des parties -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div class="bg-gradient-to-r from-purple-600 to-purple-700 px-4 sm:px-5 py-3 sm:py-4">
            <h2 class="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Parties ({{ examStore.parts.length }})
            </h2>
          </div>
          
          <div class="p-4 sm:p-5 max-h-[500px] overflow-y-auto">
            <div v-if="examStore.parts.length === 0" class="text-center py-6 sm:py-8">
              <svg class="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p class="text-sm text-gray-500 dark:text-gray-400">Aucune partie créée</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(part, partIndex) in examStore.parts"
                :key="part.id"
                class="group rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all cursor-pointer"
                :class="{ 'ring-2 ring-indigo-500': selectedPart?.id === part.id }"
                @click="selectPart(part)"
              >
                <!-- En-tête de la partie -->
                <div class="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50">
                  <div class="flex items-start justify-between">
                    <div class="flex items-start gap-2 sm:gap-3">
                      <span class="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium shrink-0 mt-0.5">
                        {{ partIndex + 1 }}
                      </span>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                          <h3 class="font-medium text-sm sm:text-base text-gray-800 dark:text-white truncate">{{ part.titre }}</h3>
                          <span v-if="part.is_case_study" class="px-2 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full whitespace-nowrap">
                            Étude de cas
                          </span>
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {{ getQuestionsCountForPart(part.id) }} question(s) • {{ getPartPoints(part.id) }} pts
                        </p>
                      </div>
                    </div>
                    
                    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        @click.stop="editPart(part)"
                        class="p-1.5 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                      >
                        <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        @click.stop="deletePart(part.id)"
                        class="p-1.5 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Aperçu du contexte si étude de cas -->
                  <div v-if="part.is_case_study && part.contexte" class="mt-2 ml-7 sm:ml-9">
                    <div class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2" v-html="part.contexte"></div>
                  </div>
                </div>

                <!-- Mini-liste des questions (si partie sélectionnée) -->
                <div v-if="selectedPart?.id === part.id" class="border-t border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
                  <div v-for="(q, qIndex) in getQuestionsForPart(part.id).slice(0, 2)" :key="q.id" class="p-2 sm:p-3 flex items-center gap-2 text-xs">
                    <span class="font-medium text-gray-500 dark:text-gray-400 w-4">{{ qIndex + 1 }}</span>
                    <span class="flex-1 truncate text-gray-700 dark:text-gray-300">{{ stripHtml(q.content).substring(0, 30) }}...</span>
                    <span class="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">{{ q.points }} pts</span>
                  </div>
                  <div v-if="getQuestionsForPart(part.id).length > 2" class="p-2 text-center">
                    <span class="text-xs text-indigo-600 dark:text-indigo-400">+ {{ getQuestionsForPart(part.id).length - 2 }} autres</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== COLONNE DROITE ========== -->
      <div class="lg:col-span-2 space-y-4 sm:space-y-6">
        
        <!-- Message si aucune partie sélectionnée -->
        <div v-if="!selectedPart" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 sm:p-12 text-center">
          <svg class="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 class="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Aucune partie sélectionnée</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Sélectionnez une partie pour commencer à ajouter des questions</p>
          <button
            @click="scrollToNewPart"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Créer une partie
          </button>
        </div>

        <!-- CARD: Création de question -->
        <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div class="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 sm:px-5 py-3 sm:py-4">
            <h2 class="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ editingQuestion ? 'Modifier' : 'Ajouter' }} une question
            </h2>
          </div>

          <div class="p-4 sm:p-5">
            <!-- Affichage du contexte si étude de cas -->
            <div v-if="selectedPart.is_case_study && selectedPart.contexte" class="mb-5 p-3 sm:p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm font-medium text-amber-800 dark:text-amber-300">Contexte de l'étude de cas</span>
              </div>
              <div class="text-sm text-gray-700 dark:text-gray-300 prose prose-sm max-w-none" v-html="selectedPart.contexte"></div>
            </div>

            <!-- Type de question -->
            <div class="mb-4 sm:mb-5">
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                Type de question *
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                <button
                  v-for="type in questionTypes"
                  :key="type.value"
                  type="button"
                  @click="selectedType = type.value"
                  class="flex flex-col items-center p-2 sm:p-3 rounded-xl border-2 transition-all"
                  :class="[
                    selectedType === type.value
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800'
                  ]"
                >
                  <span class="w-5 h-5 sm:w-6 sm:h-6 mb-1" v-html="type.icon"></span>
                  <span class="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                    {{ type.label }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Énoncé avec TinyMCE -->
            <div class="mb-4 sm:mb-5">
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                Énoncé de la question *
              </label>
              <Editor
                api-key="ktf8z0z55enm2wd9xyeoo6qzzoy7w9b629e51wii9y8lw4dx"
                v-model="questionForm.content"
                :init="{
                  height: 150,
                  menubar: false,
                  plugins: 'lists link image',
                  toolbar: 'undo redo | bold italic underline | bullist numlist | link',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; }'
                }"
              />
            </div>

            <!-- Points avec validation -->
            <div class="mb-4 sm:mb-5">
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                Points * (max 20)
              </label>
              <div class="relative w-24 sm:w-32">
                <input
                  v-model.number="questionForm.points"
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  @input="validatePoints"
                  class="w-full px-3 sm:px-4 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  :class="{ 'border-red-500 dark:border-red-500': pointsError }"
                />
              </div>
              <p v-if="pointsError" class="text-xs text-red-600 dark:text-red-400 mt-1">
                {{ pointsError }}
              </p>
            </div>

            <!-- Options selon le type -->
            <div v-if="isQCM" class="mb-4 sm:mb-5 space-y-3 sm:space-y-4">
              <div class="flex items-center justify-between">
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Options de réponse
                </label>
                <button
                  type="button"
                  @click="addOption"
                  class="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-1"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter
                </button>
              </div>

              <div v-for="(option, index) in questionForm.options" :key="index" class="flex items-center gap-2">
                <div class="flex-1 relative">
                  <input
                    v-model="option.text"
                    type="text"
                    :placeholder="`Option ${index + 1}`"
                    class="w-full px-3 sm:px-4 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    @click="toggleCorrect(index)"
                    class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full"
                    :class="option.isCorrect ? 'text-green-600 bg-green-100 dark:bg-green-900/30' : 'text-gray-400 hover:text-gray-600'"
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
                  v-if="questionForm.options.length > 2"
                  class="p-2 text-gray-400 hover:text-red-600"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <!-- Message pour QCM unique sans correcte -->
              <p v-if="selectedType === 'qcm_unique' && !hasCorrectOption" class="text-xs text-amber-600 dark:text-amber-400">
                ⚠️ Veuillez marquer une option comme correcte
              </p>
            </div>

            <!-- Configuration texte court -->
            <div v-else-if="selectedType === 'texte_court'" class="mb-4 sm:mb-5 space-y-3">
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Réponse attendue
                </label>
                <input
                  v-model="questionForm.expectedAnswer"
                  type="text"
                  placeholder="ex: Hypertext Preprocessor"
                  class="w-full px-3 sm:px-4 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div class="flex items-center gap-4">
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="questionForm.caseSensitive" class="rounded border-gray-300 text-indigo-600">
                  <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Respecter la casse</span>
                </label>
              </div>
            </div>

            <!-- Configuration texte long -->
            <div v-else-if="selectedType === 'texte_long'" class="mb-4 sm:mb-5 grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mots min
                </label>
                <input
                  v-model.number="questionForm.minWords"
                  type="number"
                  min="0"
                  class="w-full px-3 sm:px-4 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mots max
                </label>
                <input
                  v-model.number="questionForm.maxWords"
                  type="number"
                  min="0"
                  class="w-full px-3 sm:px-4 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <!-- Boutons d'action -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                @click="resetQuestionForm"
                class="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors order-2 sm:order-1"
              >
                Annuler
              </button>
              <button
                type="button"
                @click="addQuestion"
                :disabled="!canSaveQuestion || examStore.isLoading"
                class="px-6 py-2 text-sm rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium transition-all shadow-sm order-1 sm:order-2"
                :class="(canSaveQuestion && !examStore.isLoading) ? 'hover:from-emerald-700 hover:to-emerald-800' : 'opacity-50 cursor-not-allowed'"
              >
                {{ examStore.isLoading ? 'Enregistrement...' : (editingQuestion ? 'Mettre à jour' : 'Ajouter') }}
              </button>
            </div>
          </div>
        </div>

        <!-- CARD: Liste des questions -->
        <div v-if="selectedPart && getQuestionsForPart(selectedPart.id).length" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div class="bg-gradient-to-r from-amber-600 to-amber-700 px-4 sm:px-5 py-3 sm:py-4">
            <h2 class="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Questions ({{ getQuestionsForPart(selectedPart.id).length }})
            </h2>
          </div>

          <div class="p-4 sm:p-5">
            <div class="space-y-3 max-h-[400px] overflow-y-auto">
              <div
                v-for="(question, index) in getQuestionsForPart(selectedPart.id)"
                :key="question.id"
                class="group flex flex-col sm:flex-row sm:items-start gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div class="flex items-center gap-3 sm:items-start">
                  <span class="flex items-center justify-center w-6 h-6 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-medium shrink-0">
                    {{ index + 1 }}
                  </span>
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-2 mb-1">
                      <span class="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
                        {{ getTypeLabel(question.type) }}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">{{ question.points }} pts</span>
                      <span v-if="question.points > 20" class="text-xs text-red-600 dark:text-red-400">(dépasse 20!)</span>
                    </div>
                    <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-2" v-html="question.content"></p>
                  </div>
                </div>

                <div class="flex items-center justify-end sm:justify-start gap-1 ml-9 sm:ml-0">
                  <button
                    @click="editQuestion(question)"
                    class="p-1.5 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteQuestion(question.id)"
                    class="p-1.5 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumb from '~/components/Breadcrumb.vue'
import Editor from '@tinymce/tinymce-vue'
import { useExamStore } from '~~/stores/exam'

const route = useRoute()
const examStore = useExamStore()

// Récupérer l'ID de l'évaluation depuis l'URL
const evaluationId = route.params.slug

// ========== DONNÉES LOCALES ==========
const selectedPart = ref(null)
const editingQuestion = ref(null)
const selectedType = ref('qcm_unique')
const pointsError = ref('')

const newPart = ref({
  titre: '',
  description: '',
  isCaseStudy: false,
  contexte: ''
})

const questionForm = reactive({
  content: '',
  points: 5,
  options: [
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ],
  expectedAnswer: '',
  caseSensitive: false,
  minWords: 50,
  maxWords: 500
})

// ========== TYPES DE QUESTIONS ==========
const questionTypes = [
  { 
    value: 'qcm_unique', 
    label: 'QCM Unique',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>'
  },
  { 
    value: 'qcm_multiple', 
    label: 'QCM Multiple',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="12" y1="9" x2="12" y2="15"/></svg>'
  },
  { 
    value: 'vrai_faux', 
    label: 'Vrai/Faux',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/><path d="M20 18L9 7l-5 5"/></svg>'
  },
  { 
    value: 'texte_court', 
    label: 'Texte court',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="14" y2="18"/></svg>'
  },
  { 
    value: 'texte_long', 
    label: 'Texte long',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg>'
  }
]

// ========== COMPUTED ==========
const completionRate = computed(() => {
  if (examStore.parts.length === 0) return 0
  const partsWithQuestions = examStore.parts.filter(p => getQuestionsForPart(p.id).length > 0).length
  return Math.round((partsWithQuestions / examStore.parts.length) * 100)
})

const isQCM = computed(() => {
  return ['qcm_unique', 'qcm_multiple', 'vrai_faux'].includes(selectedType.value)
})

const hasCorrectOption = computed(() => {
  return questionForm.options.some(opt => opt.isCorrect)
})

const canSaveQuestion = computed(() => {
  if (!questionForm.content.trim()) return false
  if (questionForm.points > 20) return false
  if (isQCM.value && !hasCorrectOption.value) return false
  return true
})

// ========== MÉTHODES UTILITAIRES ==========
const stripHtml = (html) => {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

const getTypeLabel = (type) => {
  const found = questionTypes.find(t => t.value === type)
  return found ? found.label : type
}

const getQuestionsForPart = (partId) => {
  return examStore.questions.filter(q => q.part_id === partId)
}

const getQuestionsCountForPart = (partId) => {
  return getQuestionsForPart(partId).length
}

const getPartPoints = (partId) => {
  return getQuestionsForPart(partId).reduce((sum, q) => sum + (q.points || 0), 0)
}

const validatePoints = () => {
  if (questionForm.points > 20) {
    pointsError.value = 'Les points ne peuvent pas dépasser 20'
  } else if (questionForm.points < 0) {
    pointsError.value = 'Les points doivent être positifs'
    questionForm.points = 0
  } else {
    pointsError.value = ''
  }
}

// ========== MÉTHODES POUR LES PARTIES ==========
const addPart = async () => {
  if (!newPart.value.titre) return
  
  try {
    await examStore.addPart({
      evaluation_id: evaluationId,
      titre: newPart.value.titre,
      description: newPart.value.description,
      is_case_study: newPart.value.isCaseStudy,
      contexte: newPart.value.contexte,
      order: examStore.parts.length + 1
    })
    
    newPart.value = { titre: '', description: '', isCaseStudy: false, contexte: '' }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la partie:', error)
  }
}

const selectPart = (part) => {
  selectedPart.value = part
  resetQuestionForm()
}

const editPart = (part) => {
  newPart.value = { 
    titre: part.titre, 
    description: part.description,
    isCaseStudy: part.is_case_study || false,
    contexte: part.contexte || ''
  }
  // TODO: Implémenter la modification
}

const deletePart = async (partId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette partie ?')) {
    try {
      await examStore.deletePart(partId)
      if (selectedPart.value?.id === partId) {
        selectedPart.value = null
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

const scrollToNewPart = () => {
  document.querySelector('.bg-gradient-to-r.from-indigo-600')?.scrollIntoView({ behavior: 'smooth' })
}

// ========== MÉTHODES POUR LES OPTIONS ==========
const addOption = () => {
  questionForm.options.push({ text: '', isCorrect: false })
}

const removeOption = (index) => {
  if (questionForm.options.length > 2) {
    questionForm.options.splice(index, 1)
  }
}

const toggleCorrect = (index) => {
  if (selectedType.value === 'qcm_unique') {
    questionForm.options.forEach((opt, i) => {
      opt.isCorrect = i === index
    })
  } else {
    questionForm.options[index].isCorrect = !questionForm.options[index].isCorrect
  }
}

// ========== MÉTHODES POUR LES QUESTIONS ==========
const addQuestion = async () => {
  if (!selectedPart.value || !canSaveQuestion.value) return

  // 1️⃣ PRÉPARER LES OPTIONS SI C'EST UN QCM
  let optionsData = []
  if (isQCM.value) {
    optionsData = questionForm.options
      .filter(opt => opt.text.trim() !== '') // Garder seulement les options non vides
      .map((opt, index) => ({
        text: opt.text,
        is_correct: opt.isCorrect,
        order: index + 1
      }))
  }

  // 2️⃣ CONSTRUIRE LE PAYLOAD COMPLET
  const questionData = {
    part_id: selectedPart.value.id,
    content: questionForm.content,
    type: selectedType.value,
    points: questionForm.points,
    order: getQuestionsForPart(selectedPart.value.id).length + 1,
    config: {
      ...(selectedType.value === 'texte_court' && {
        expectedAnswer: questionForm.expectedAnswer,
        caseSensitive: questionForm.caseSensitive
      }),
      ...(selectedType.value === 'texte_long' && {
        minWords: questionForm.minWords,
        maxWords: questionForm.maxWords
      })
    },
    // 🔴 C'EST ICI QU'IL FAUT AJOUTER LES OPTIONS
    options: optionsData
  }

  // 3️⃣ AFFICHER LE PAYLOAD POUR VÉRIFIER (optionnel)
  console.log('Payload envoyé:', JSON.stringify(questionData, null, 2))

  try {
    if (editingQuestion.value) {
      // Mode édition
      await examStore.updateQuestion(editingQuestion.value.id, questionData)
    } else {
      // Mode création
      await examStore.addQuestion(questionData)
    }

    // 4️⃣ RECHARGER LES QUESTIONS
    await examStore.fetchQuestions(selectedPart.value.id)
    
    // 5️⃣ RÉINITIALISER LE FORMULAIRE
    resetQuestionForm()
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la question:', error)
  }
}

const editQuestion = (question) => {
  editingQuestion.value = question
  selectedType.value = question.type
  questionForm.content = question.content
  questionForm.points = question.points
  
  // 🔴 CHARGER LES OPTIONS CORRECTEMENT
  if (question.options && question.options.length > 0) {
    // Si la question a des options, les charger
    questionForm.options = question.options.map(opt => ({ 
      text: opt.text, 
      isCorrect: opt.is_correct 
    }))
  } else {
    // Sinon, réinitialiser avec des options vides
    questionForm.options = [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ]
  }
  
  if (question.type === 'texte_court') {
    questionForm.expectedAnswer = question.config?.expectedAnswer || ''
    questionForm.caseSensitive = question.config?.caseSensitive || false
  }
  
  if (question.type === 'texte_long') {
    questionForm.minWords = question.config?.minWords || 50
    questionForm.maxWords = question.config?.maxWords || 500
  }
}

const deleteQuestion = async (questionId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
    try {
      await examStore.deleteQuestion(questionId)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

const resetQuestionForm = () => {
  questionForm.content = ''
  questionForm.points = 5
  questionForm.options = [
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ]
  questionForm.expectedAnswer = ''
  questionForm.caseSensitive = false
  questionForm.minWords = 50
  questionForm.maxWords = 500
  pointsError.value = ''
  editingQuestion.value = null
  selectedType.value = 'qcm_unique'
}

// ========== CHARGEMENT INITIAL ==========
onMounted(async () => {
  try {
    await examStore.loadExam(evaluationId)
    if (examStore.parts.length > 0) {
      selectedPart.value = examStore.parts[0]
    }
  } catch (error) {
    console.error('Erreur lors du chargement de l\'examen:', error)
  }
})
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
</style>