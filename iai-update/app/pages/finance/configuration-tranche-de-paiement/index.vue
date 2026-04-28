<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 p-4 md:p-8 transition-all duration-500 font-sans relative overflow-hidden">
    
    <!-- Décorations d'arrière-plan -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/0 blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tl from-emerald-500/10 to-teal-500/0 blur-3xl pointer-events-none"></div>

    <div class="relative z-10">
    <!-- Breadcrumb Custom -->
    <div class="mb-8">
      <h1 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 tracking-tighter uppercase drop-shadow-sm">
        Tranches de Paiement
      </h1>
      <p class="text-slate-500 dark:text-gray-400 font-semibold text-sm flex items-center gap-2">
        <span class="w-2.5 h-2.5 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse"></span>
        Configuration des échéanciers par niveau
      </p>
    </div>

    <!-- Toolbar -->
    <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 mb-8 border border-white/50 dark:border-gray-700/50 shadow-sm flex flex-col lg:flex-row gap-4 lg:items-center">
      <!-- Recherche -->
      <div class="relative flex-1 max-w-md">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher un frais..."
          class="w-full px-4 py-2 pl-10 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <svg
          class="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Filtre par année scolaire -->
        <Dropdown
          v-model="filtreAnnee"
          :options="anneeOptions"
          optionLabel="label"
          optionValue="value"
          filter
          showClear
          placeholder="Filtrer par année"
          class="w-full sm:w-48"
        />

        <!-- Filtre par niveau -->
        <Dropdown
          v-model="filtreNiveau"
          :options="niveauOptions"
          optionLabel="label"
          optionValue="value"
          filter
          showClear
          placeholder="Filtrer par niveau"
          class="w-full sm:w-48"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div
        class="h-12 w-12 animate-spin rounded-full border-2 border-amber-600 border-t-transparent"
      ></div>
    </div>

    <!-- Liste des frais de scolarité -->
    <div v-else class="space-y-4">
      <!-- Message si aucun résultat -->
      <div v-if="filteredFrais.length === 0" class="text-center py-20 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-white/50 dark:border-gray-700/50">
        <div class="w-24 h-24 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-gray-600 dark:text-gray-400 text-xl font-bold uppercase tracking-wider">Aucun frais configuré</p>
        <p class="text-gray-400 dark:text-gray-500 text-sm mt-2">Veuillez ajuster vos filtres de recherche</p>
      </div>

      <div
        v-for="frais in filteredFrais"
        :key="frais.id"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-100 dark:border-gray-700 transition-all duration-300"
      >
        <!-- En-tête du frais -->
        <div
          @click="toggleFrais(frais.id)"
          class="p-6 bg-gradient-to-r from-white/50 to-slate-50/50 dark:from-gray-800/50 dark:to-gray-900/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-700/50 transition-all"
        >
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex items-center gap-3 flex-1">
              <div class="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ frais.niveau?.libelle || 'Niveau non spécifié' }}
                </h3>
                <div class="flex flex-wrap gap-2 mt-1">
                  <span class="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full">
                    {{ frais.annee_scolaire?.nom || 'Année non définie' }}
                  </span>
                  <span v-if="frais.filiere" class="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-0.5 rounded-full">
                    {{ frais.filiere.nom }}
                  </span>
                  <span v-if="frais.genre" class="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded-full">
                    {{ frais.genre }}
                  </span>
                  <span class="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-0.5 rounded-full">
                    {{ getTranchesCount(frais) }} tranche(s)
                  </span>
                  <span v-if="estFraisComplet(frais)" class="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded-full">
                    Complet
                  </span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div class="text-right">
                <span class="text-sm text-gray-500 dark:text-gray-400">Montant total</span>
                <p class="text-xl font-bold text-green-600 dark:text-green-400">
                  {{ formatMontant(frais.montant) }}
                </p>
              </div>
              <svg
                class="w-5 h-5 text-gray-500 transition-transform duration-200"
                :class="{ 'rotate-180': expandedFrais.includes(frais.id) }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <!-- Barre de progression -->
          <div class="mt-3">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600 dark:text-gray-400">Tranches configurées</span>
              <span class="font-medium" :class="{
                'text-green-600 dark:text-green-400': pourcentageRempli(frais) === 100,
                'text-amber-600 dark:text-amber-400': pourcentageRempli(frais) < 100 && pourcentageRempli(frais) > 0,
                'text-red-600 dark:text-red-400': pourcentageRempli(frais) > 100
              }">
                {{ pourcentageRempli(frais) }}%
              </span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                class="h-2.5 rounded-full transition-all duration-300"
                :class="{
                  'bg-green-600': pourcentageRempli(frais) === 100,
                  'bg-amber-600': pourcentageRempli(frais) < 100 && pourcentageRempli(frais) > 0,
                  'bg-red-600': pourcentageRempli(frais) > 100
                }"
                :style="{ width: Math.min(pourcentageRempli(frais), 100) + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Détail des tranches -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform -translate-y-2 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform -translate-y-2 opacity-0"
        >
          <div v-if="expandedFrais.includes(frais.id)" class="p-4 border-t border-gray-200 dark:border-gray-700">
            <!-- Message si le frais est complet -->
            <div v-if="estFraisComplet(frais)" class="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div class="flex items-center gap-2 text-green-700 dark:text-green-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm font-medium">Toutes les tranches sont configurées pour ce frais</span>
              </div>
            </div>

            <!-- Bouton Ajouter des tranches -->
            <div class="flex justify-end mb-4">
              <button
                @click="openAddTranchesModal(frais)"
                :disabled="estFraisComplet(frais)"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                :class="{
                  'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700': !estFraisComplet(frais),
                  'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed': estFraisComplet(frais)
                }"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter des tranches
                <span v-if="estFraisComplet(frais)" class="ml-2 text-xs bg-gray-500 text-white px-2 py-0.5 rounded-full">
                  Complet
                </span>
              </button>
            </div>

            <!-- Liste des tranches existantes -->
            <div v-if="!frais.tranches || frais.tranches.length === 0" class="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <svg class="w-16 h-16 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <p class="text-gray-600 dark:text-gray-400">Aucune tranche configurée pour ce frais</p>
              <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">Cliquez sur "Ajouter des tranches" pour configurer les paiements</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="tranche in frais.tranches"
                :key="tranche.id"
                class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors gap-3"
              >
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-gray-900 dark:text-white">{{ tranche.libelle }}</span>
                    <span :class="[
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      getStatutTranche(tranche).class
                    ]">
                      {{ getStatutTranche(tranche).label }}
                    </span>
                  </div>
                  <div class="flex flex-wrap gap-3 mt-1 text-sm">
                    <span class="text-green-600 dark:text-green-400 font-medium">
                      {{ formatMontant(tranche.montant) }}
                    </span>
                    <span class="text-gray-500 dark:text-gray-400">•</span>
                    <span class="text-gray-600 dark:text-gray-400">
                      Date limite: {{ formatDate(tranche.date_limite) }}
                    </span>
                  </div>
                </div>
                
                <div class="flex gap-2 self-end sm:self-center">
                  <button
                    @click="openEditModal(tranche)"
                    class="p-2 text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(tranche.id, tranche.libelle)"
                    class="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Récapitulatif -->
              <div class="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Total configuré</p>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white">
                      {{ formatMontant(calculerTotalTranches(frais)) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Reste à configurer</p>
                    <p class="text-lg font-semibold" :class="{
                      'text-green-600 dark:text-green-400': resteAConfigurer(frais) === 0,
                      'text-amber-600 dark:text-amber-400': resteAConfigurer(frais) > 0
                    }">
                      {{ formatMontant(resteAConfigurer(frais)) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Nombre de tranches</p>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white">
                      {{ frais.tranches?.length || 0 }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Modal d'ajout de plusieurs tranches -->
    <TransitionRoot appear :show="showAddMultipleModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeAddMultipleModal">
        <div class="fixed inset-0 bg-black/60" />

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
              >
                <!-- En-tête -->
                <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg shadow-md">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <DialogTitle class="text-lg font-semibold text-gray-900 dark:text-white">
                      Configurer les tranches de paiement
                    </DialogTitle>
                  </div>
                  <button
                    @click="closeAddMultipleModal"
                    class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Info frais -->
                <div v-if="selectedFrais" class="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <div class="flex justify-between items-center">
                    <div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Frais sélectionné</p>
                      <p class="font-semibold text-gray-900 dark:text-white">
                        {{ selectedFrais.niveau?.libelle }} - {{ formatMontant(selectedFrais.montant) }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Reste à configurer: {{ formatMontant(resteAConfigurer(selectedFrais)) }}
                      </p>
                    </div>
                    <span class="text-sm bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-full">
                      {{ getTranchesCount(selectedFrais) }} tranche(s) existante(s)
                    </span>
                  </div>
                </div>

                <!-- Liste des tranches à ajouter -->
                <div class="space-y-4 max-h-96 overflow-y-auto pr-2">
                  <div
                    v-for="(tranche, index) in nouvellesTranches"
                    :key="index"
                    class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative"
                  >
                    <button
                      v-if="nouvellesTranches.length > 1"
                      @click="removeTranche(index)"
                      class="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Tranche #{{ index + 1 }}
                    </h4>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <!-- Libellé -->
                      <div>
                        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Libellé <span class="text-red-500">*</span>
                        </label>
                        <input
                          v-model="tranche.libelle"
                          type="text"
                          class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                          placeholder="Ex: 1ère tranche"
                          required
                        />
                      </div>

                      <!-- Montant -->
                      <div>
                        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Montant <span class="text-red-500">*</span>
                        </label>
                        <InputNumber
                          v-model="tranche.montant"
                          mode="currency"
                          currency="XOF"
                          locale="fr-FR"
                          :min="0"
                          :max="resteDisponible"
                          class="w-full"
                          @update:model-value="validerMontants"
                        />
                      </div>

                      <!-- Date limite -->
                      <div class="md:col-span-2">
                        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Date limite <span class="text-red-500">*</span>
                        </label>
                        <Calendar
                          v-model="tranche.date_limite"
                          dateFormat="dd/mm/yy"
                          class="w-full"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Message d'erreur de dépassement -->
                <div v-if="resteDisponible < 0" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p class="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Dépassement de {{ formatMontant(Math.abs(resteDisponible)) }} par rapport au montant disponible
                  </p>
                </div>

                <!-- Boutons d'action -->
                <div class="mt-6 flex flex-col sm:flex-row justify-between gap-3">
                  <div>
                    <button
                      type="button"
                      @click="addTranche"
                      class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-lg transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Ajouter une autre tranche
                    </button>
                  </div>
                  
                  <div class="flex gap-3">
                    <button
                      type="button"
                      @click="closeAddMultipleModal"
                      class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      @click="saveMultipleTranches"
                      :disabled="isSaving || !validateTranches() || resteDisponible < 0"
                      class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <svg v-if="isSaving" class="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {{ isSaving ? 'Enregistrement...' : 'Enregistrer les tranches' }}
                    </button>
                  </div>
                </div>

                <!-- Récapitulatif des montants -->
                <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-600 dark:text-gray-400">Total des nouvelles tranches:</span>
                    <span class="font-semibold text-gray-900 dark:text-white">
                      {{ formatMontant(totalNouvellesTranches) }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center text-sm mt-1">
                    <span class="text-gray-600 dark:text-gray-400">Reste après ajout:</span>
                    <span :class="{
                      'text-green-600 dark:text-green-400': resteDisponible >= 0,
                      'text-red-600 dark:text-red-400': resteDisponible < 0
                    }">
                      {{ formatMontant(Math.abs(resteDisponible)) }}
                      {{ resteDisponible < 0 ? '(dépassement)' : '' }}
                    </span>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal d'édition d'une tranche -->
    <TransitionRoot appear :show="showEditModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeEditModal">
        <div class="fixed inset-0 bg-black/60" />

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
              >
                <!-- En-tête -->
                <div class="flex items-center gap-3 mb-6">
                  <div class="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg shadow-md">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <DialogTitle class="text-lg font-semibold text-gray-900 dark:text-white">
                    Modifier la tranche
                  </DialogTitle>
                </div>

                <!-- Formulaire -->
                <form @submit.prevent="updateTranche" class="space-y-4">
                  <!-- Libellé -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Libellé <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="editForm.libelle"
                      type="text"
                      required
                      class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <!-- Montant -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Montant <span class="text-red-500">*</span>
                    </label>
                    <InputNumber
                      v-model="editForm.montant"
                      mode="currency"
                      currency="XOF"
                      locale="fr-FR"
                      :min="0"
                      class="w-full"
                    />
                  </div>

                  <!-- Date limite -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date limite <span class="text-red-500">*</span>
                    </label>
                    <Calendar
                      v-model="editForm.date_limite"
                      dateFormat="dd/mm/yy"
                      class="w-full"
                    />
                  </div>

                  <!-- Actions -->
                  <div class="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      @click="closeEditModal"
                      class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      :disabled="isSaving"
                      class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {{ isSaving ? 'Modification...' : 'Modifier' }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useTranchePaiement } from "~~/stores/tranche-de-paiement";
import { useFraisStore } from "~~/stores/frais-de-scolarite";
import { useNiveauStore } from "~~/stores/niveau";
import { useAnneScolaireStore } from "~~/stores/annee-scolaire";
import Calendar from 'primevue/calendar';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';

const { $toastr, $swal } = useNuxtApp();

// Stores
const trancheStore = useTranchePaiement();
const fraisStore = useFraisStore();
const niveauStore = useNiveauStore();
const anneeStore = useAnneScolaireStore();

// États
const searchQuery = ref("");
const isLoading = ref(true);
const isSaving = ref(false);
const showAddMultipleModal = ref(false);
const showEditModal = ref(false);
const selectedFrais = ref(null);
const selectedTrancheId = ref(null);
const filtreAnnee = ref("");
const filtreNiveau = ref("");
const expandedFrais = ref([]);

// Formulaires
const nouvellesTranches = ref([]);
const editForm = ref({
  id: null,
  libelle: "",
  montant: null,
  date_limite: null
});

// Options pour les filtres
const niveauOptions = computed(() => {
  return (niveauStore.niveaux || []).map((n) => ({
    label: n.libelle,
    value: n.id,
  }));
});

const anneeOptions = computed(() => {
  return (anneeStore.annees || []).map((a) => ({
    label: a.nom,
    value: a.id,
  }));
});

// Liste des frais (directement depuis le store)
const fraisListe = computed(() => {
  return fraisStore.frais || [];
});

// Frais filtrés
const filteredFrais = computed(() => {
  let liste = fraisListe.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    liste = liste.filter(
      (f) =>
        f.niveau?.libelle?.toLowerCase().includes(query) ||
        f.filiere?.nom?.toLowerCase().includes(query) ||
        f.annee_scolaire?.nom?.toLowerCase().includes(query)
    );
  }

  if (filtreAnnee.value) {
    liste = liste.filter((f) => f.annee_scolaire?.id == filtreAnnee.value);
  }

  if (filtreNiveau.value) {
    liste = liste.filter((f) => f.niveau?.id == filtreNiveau.value);
  }

  return liste;
});

// Calculs pour le modal
const totalNouvellesTranches = computed(() => {
  return nouvellesTranches.value.reduce((sum, t) => sum + (t.montant || 0), 0);
});

const resteDisponible = computed(() => {
  if (!selectedFrais.value) return 0;
  return resteAConfigurer(selectedFrais.value) - totalNouvellesTranches.value;
});

// Fonctions utilitaires
const formatMontant = (valeur) => {
  if (!valeur && valeur !== 0) return "0 FCFA";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valeur);
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const estDateDepassee = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

const getStatutTranche = (tranche) => {
  if (!tranche.date_limite) {
    return { label: "Non défini", class: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" };
  }
  
  if (estDateDepassee(tranche.date_limite)) {
    return { label: "Expirée", class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" };
  }
  
  return { label: "Active", class: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" };
};

const getTranchesCount = (frais) => {
  return frais.tranches?.length || 0;
};

// Calculs pour un frais
const calculerTotalTranches = (frais) => {
  return frais.tranches?.reduce((sum, t) => sum + t.montant, 0) || 0;
};

const resteAConfigurer = (frais) => {
  return frais.montant - calculerTotalTranches(frais);
};

const pourcentageRempli = (frais) => {
  if (frais.montant === 0) return 0;
  return Math.round((calculerTotalTranches(frais) / frais.montant) * 100);
};

// Vérifier si le frais a atteint le montant total
const estFraisComplet = (frais) => {
  const totalTranches = calculerTotalTranches(frais);
  return totalTranches >= frais.montant;
};

// Validation
const validateTranches = () => {
  if (nouvellesTranches.value.length === 0) return false;
  
  for (const tranche of nouvellesTranches.value) {
    if (!tranche.libelle?.trim() || !tranche.montant || !tranche.date_limite) {
      return false;
    }
    if (tranche.montant <= 0) return false;
  }
  
  return true;
};

const validerMontants = () => {
  // Cette fonction est appelée à chaque changement de montant
};

// Toggle expansion
const toggleFrais = (fraisId) => {
  const index = expandedFrais.value.indexOf(fraisId);
  if (index === -1) {
    expandedFrais.value.push(fraisId);
  } else {
    expandedFrais.value.splice(index, 1);
  }
};

// Gestion des modales
const openAddTranchesModal = (frais) => {
  selectedFrais.value = frais;
  nouvellesTranches.value = [{
    libelle: "",
    montant: null,
    date_limite: null
  }];
  showAddMultipleModal.value = true;
};

const closeAddMultipleModal = () => {
  showAddMultipleModal.value = false;
  selectedFrais.value = null;
  nouvellesTranches.value = [];
};

const addTranche = () => {
  nouvellesTranches.value.push({
    libelle: "",
    montant: null,
    date_limite: null
  });
};

const removeTranche = (index) => {
  nouvellesTranches.value.splice(index, 1);
};

const openEditModal = (tranche) => {
  editForm.value = {
    id: tranche.id,
    libelle: tranche.libelle,
    montant: tranche.montant,
    date_limite: new Date(tranche.date_limite)
  };
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editForm.value = {
    id: null,
    libelle: "",
    montant: null,
    date_limite: null
  };
};

// Actions CRUD
const saveMultipleTranches = async () => {
  if (!validateTranches()) {
    $toastr.warning("Veuillez remplir correctement toutes les tranches");
    return;
  }

  if (resteDisponible.value < 0) {
    $toastr.warning("Le montant total dépasse le montant disponible");
    return;
  }

  isSaving.value = true;
  
  try {
    const payload = {
      frais_id: selectedFrais.value.id,
      tranches: nouvellesTranches.value.map(t => ({
        libelle: t.libelle.trim(),
        montant: t.montant,
        date_limite: t.date_limite.toISOString().split('T')[0]
      }))
    };

    await trancheStore.addTrancheDePaiement(payload);
    $toastr.success("Tranches ajoutées avec succès");
    await loadData();
    closeAddMultipleModal();
  } catch (error) {
    console.error(error);
    $toastr.error(error.response?.data?.message || "Une erreur est survenue");
  } finally {
    isSaving.value = false;
  }
};

const updateTranche = async () => {
  if (!editForm.value.libelle?.trim() || !editForm.value.montant || !editForm.value.date_limite) {
    $toastr.warning("Veuillez remplir tous les champs");
    return;
  }

  isSaving.value = true;
  
  try {
    const payload = {
      libelle: editForm.value.libelle.trim(),
      montant: editForm.value.montant,
      date_limite: editForm.value.date_limite.toISOString().split('T')[0]
    };

    // Appel avec l'ID dans l'URL
    await trancheStore.updatePlanPaiement(editForm.value.id, payload);
    $toastr.success("Tranche modifiée avec succès");
    await loadData();
    closeEditModal();
  } catch (error) {
    console.error(error);
    $toastr.error(error.response?.data?.message || "Une erreur est survenue");
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = (trancheId, trancheLibelle) => {
  $swal.fire({
    title: "Confirmer la suppression",
    text: `Êtes-vous sûr de vouloir supprimer la tranche "${trancheLibelle}" ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        // Appel avec l'ID dans l'URL
        await trancheStore.deletePlanPaiement(trancheId);
        $toastr.success("Tranche supprimée avec succès");
        await loadData();
      } catch (error) {
        console.error(error);
        $toastr.error(error.response?.data?.message || "Une erreur est survenue");
      }
    }
  });
};

// Chargement des données
const loadData = async () => {
  isLoading.value = true;
  try {
    await Promise.all([
      fraisStore.fetchFrais(),
      niveauStore.fetchNiveaux(),
      anneeStore.fetchAnneeScolaire(),
    ]);
  } catch (error) {
    console.error("Erreur lors du chargement:", error);
    $toastr.error("Erreur lors du chargement des données");
  } finally {
    isLoading.value = false;
  }
};

// Initialisation
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Style pour les dropdowns PrimeVue */
:deep(.p-dropdown) {
  width: 100%;
  background-color: white;
  border-color: #e2e8f0; 
}

.dark :deep(.p-dropdown) {
  background-color: #1f2937;
  border-color: #4b5563;
}

.dark :deep(.p-dropdown .p-dropdown-label) {
  color: white;
}

/* Style pour Calendar */
:deep(.p-calendar) {
  width: 100%;
}

.dark :deep(.p-calendar .p-inputtext) {
  background-color: #1f2937;
  border-color: #4b5563;
  color: white;
}

/* Style pour InputNumber */
:deep(.p-inputnumber) {
  width: 100%;
}

.dark :deep(.p-inputnumber .p-inputtext) {
  background-color: #1f2937;
  border-color: #4b5563;
  color: white;
}
</style>