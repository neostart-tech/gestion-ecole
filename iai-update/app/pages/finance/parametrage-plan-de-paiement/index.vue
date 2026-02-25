<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Finance', to: '/finance' },
        { label: 'Plans de paiement', to: null }
      ]"
      :title="'Gestion des plans de paiement'"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Loading skeleton -->
    <div v-if="isPageLoading" class="space-y-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 animate-pulse">
        <div class="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div class="space-y-3">
          <div v-for="i in 3" :key="i" class="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div v-else class="space-y-6">
      <!-- Header avec statistiques -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total plans -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Total plans</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ plans.length }}</p>
            </div>
            <div class="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Plans actifs -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Plans actifs</p>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ plansActifs }}</p>
            </div>
            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Plans inactifs -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Plans inactifs</p>
              <p class="text-2xl font-bold text-gray-600 dark:text-gray-400">{{ plansInactifs }}</p>
            </div>
            <div class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Types de plans -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Types</p>
              <p class="text-sm font-medium text-gray-900 dark:text-white mt-1">
                {{ statsTypes.standard }} Standard • {{ statsTypes.tranches_fixes }} Fixes • {{ statsTypes.negociation }} Négociation
              </p>
            </div>
            <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-5-5A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Barre d'actions et recherche -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <div class="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div class="relative w-full sm:w-96">
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Rechercher un plan..."
              class="w-full px-4 py-2.5 pl-10 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div class="flex gap-3 w-full sm:w-auto">
            <!-- Filtre par type -->
            <select
              v-model="typeFilter"
              class="px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Tous les types</option>
              <option value="standard">Standard</option>
              <option value="tranches_fixes">Tranches fixes</option>
              <option value="negociation">Négociation</option>
            </select>

            <!-- Filtre statut -->
            <select
              v-model="statusFilter"
              class="px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Tous les statuts</option>
              <option value="actif">Actifs</option>
              <option value="inactif">Inactifs</option>
            </select>

            <!-- Bouton ajouter -->
            <button
              @click="openModal('ajouter')"
              class="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Nouveau plan</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Liste des plans -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="plan in filteredPlans"
          :key="plan.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <!-- En-tête de la carte -->
          <div class="p-5 border-b border-gray-200 dark:border-gray-700">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ plan.nom }}</h3>
                <div class="flex gap-2 mt-2">
                  <span
                    :class="[
                      'px-2 py-1 rounded-full text-xs font-medium',
                      plan.type === 'standard' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      plan.type === 'tranches_fixes' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                    ]"
                  >
                    {{ formatType(plan.type) }}
                  </span>
                  <span
                    :class="[
                      'px-2 py-1 rounded-full text-xs font-medium',
                      plan.actif
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    ]"
                  >
                    {{ plan.actif ? 'Actif' : 'Inactif' }}
                  </span>
                </div>
              </div>
              
              <!-- Actions -->
              <div class="flex gap-2">
                <button
                  @click="openModal('modifier', plan)"
                  class="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="toggleActif(plan)"
                  class="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                  :title="plan.actif ? 'Désactiver' : 'Activer'"
                >
                  <svg v-if="plan.actif" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button
                  @click="openModal('supprimer', plan)"
                  class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Corps de la carte -->
          <div class="p-5">
            <div class="mb-3">
              <span class="text-sm text-gray-600 dark:text-gray-400">Nombre de tranches:</span>
              <span class="ml-2 text-sm font-semibold text-gray-900 dark:text-white">{{ plan.nombre_tranches }}</span>
            </div>

            <!-- Liste des tranches -->
            <div v-if="plan.tranches && plan.tranches.length > 0" class="space-y-2">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Détail des tranches</p>
              <div
                v-for="tranche in plan.tranches"
                :key="tranche.id"
                class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Tranche {{ tranche.ordre }}</span>
                <div class="flex gap-3">
                  <span v-if="tranche.montant" class="text-xs text-indigo-600 dark:text-indigo-400">
                    {{ formatMontant(tranche.montant) }}
                  </span>
                  <span v-if="tranche.pourcentage" class="text-xs text-purple-600 dark:text-purple-400">
                    {{ tranche.pourcentage }}%
                  </span>
                  <span class="text-xs text-gray-600 dark:text-gray-400">
                    +{{ tranche.mois_apres_debut }} mois
                  </span>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
              Aucune tranche définie
            </div>
          </div>

          <!-- Pied de carte -->
          <div class="px-5 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
            <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Créé le {{ formatDate(plan.created_at) }}</span>
              <span>Slug: {{ plan.slug }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Message si aucun résultat -->
      <div v-if="filteredPlans.length === 0" class="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-gray-600 dark:text-gray-400">Aucun plan de paiement trouvé</p>
      </div>
    </div>

    <!-- Modal Ajout/Modification/Suppression -->
    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" class="relative z-50" @close="showModal = false">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />

        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel class="w-full max-w-2xl rounded-xl bg-white dark:bg-gray-800 p-6 mx-4 shadow-2xl">
            <DialogTitle class="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <span class="p-2 rounded-lg" :class="modalClass">
                <svg v-if="modalType === 'ajouter'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <svg v-else-if="modalType === 'modifier'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <svg v-else class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </span>
              {{ modalTitle }}
            </DialogTitle>

            <div v-if="modalType === 'supprimer'" class="mb-6">
              <p class="text-gray-600 dark:text-gray-400">
                Êtes-vous sûr de vouloir supprimer le plan <span class="font-semibold text-gray-900 dark:text-white">"{{ selectedPlan?.nom }}"</span> ?
              </p>
              <p class="text-sm text-red-600 dark:text-red-400 mt-2">Cette action est irréversible.</p>
            </div>

            <div v-else class="space-y-6">
              <!-- Informations générales -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom du plan *</label>
                  <input
                    v-model="form.nom"
                    type="text"
                    class="w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ex: Plan standard"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type *</label>
                  <select
                    v-model="form.type"
                    class="w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="standard">Standard</option>
                    <option value="tranches_fixes">Tranches fixes</option>
                    <option value="negociation">Négociation</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre de tranches</label>
                  <input
                    v-model.number="form.nombre_tranches"
                    type="number"
                    min="1"
                    class="w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Statut</label>
                  <div class="flex items-center h-10">
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="form.actif" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                      <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {{ form.actif ? 'Actif' : 'Inactif' }}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Section des tranches -->
              <div v-if="form.type === 'tranches_fixes'" class="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div class="flex justify-between items-center mb-4">
                  <h4 class="text-lg font-medium text-gray-900 dark:text-white">Détail des tranches</h4>
                  <button
                    @click="ajouterTranche"
                    type="button"
                    class="px-3 py-1.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors text-sm flex items-center gap-1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Ajouter une tranche
                  </button>
                </div>

                <div class="space-y-3">
                  <div
                    v-for="(tranche, index) in form.tranches"
                    :key="index"
                    class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300 w-16">T{{ tranche.ordre }}</span>
                    
                    <div class="flex-1 flex gap-3">
                      <input
                        v-model.number="tranche.montant"
                        type="number"
                        placeholder="Montant"
                        class="w-32 px-3 py-1.5 rounded border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm"
                      />
                      <span class="text-sm text-gray-500 self-center">ou</span>
                      <input
                        v-model.number="tranche.pourcentage"
                        type="number"
                        placeholder="%"
                        class="w-20 px-3 py-1.5 rounded border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm"
                      />
                      <input
                        v-model.number="tranche.mois_apres_debut"
                        type="number"
                        placeholder="Mois"
                        class="w-24 px-3 py-1.5 rounded border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm"
                      />
                    </div>

                    <button
                      @click="supprimerTranche(index)"
                      type="button"
                      class="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                @click="showModal = false"
                class="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
              >
                Annuler
              </button>
              <button
                v-if="modalType !== 'supprimer'"
                @click="savePlan"
                :disabled="!form.nom"
                class="px-6 py-2.5 rounded-lg text-white transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                :class="modalType === 'ajouter' ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600' : 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600'"
              >
                {{ modalType === 'ajouter' ? 'Créer le plan' : 'Modifier' }}
              </button>
              <button
                v-else
                @click="deletePlan"
                class="px-6 py-2.5 rounded-lg text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-sm"
              >
                Confirmer la suppression
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
} from "@headlessui/vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { usePlanPaiementStore } from "~~/stores/plan-de-paiement";

const { $toastr } = useNuxtApp();
const planStore = usePlanPaiementStore();

// États
const searchQuery = ref("");
const typeFilter = ref("");
const statusFilter = ref("");
const isPageLoading = ref(true);
const showModal = ref(false);
const modalType = ref("ajouter");
const selectedPlan = ref(null);
const form = ref({
  nom: "",
  type: "standard",
  nombre_tranches: 1,
  est_personnalise: false,
  actif: true,
  tranches: []
});

// Computed
const plans = computed(() => planStore.plansPaiement || []);

const plansActifs = computed(() => {
  return plans.value.filter(p => p.actif).length;
});

const plansInactifs = computed(() => {
  return plans.value.filter(p => !p.actif).length;
});

const statsTypes = computed(() => {
  return {
    standard: plans.value.filter(p => p.type === 'standard').length,
    tranches_fixes: plans.value.filter(p => p.type === 'tranches_fixes').length,
    negociation: plans.value.filter(p => p.type === 'negociation').length
  };
});

const filteredPlans = computed(() => {
  return plans.value.filter(plan => {
    const matchesSearch = !searchQuery.value || 
      plan.nom?.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    const matchesType = !typeFilter.value || plan.type === typeFilter.value;
    
    const matchesStatus = !statusFilter.value || 
      (statusFilter.value === 'actif' ? plan.actif : !plan.actif);
    
    return matchesSearch && matchesType && matchesStatus;
  });
});

const modalTitle = computed(() => {
  return {
    ajouter: "Ajouter un plan de paiement",
    modifier: "Modifier le plan de paiement",
    supprimer: "Supprimer le plan de paiement"
  }[modalType.value];
});

const modalClass = computed(() => {
  return {
    ajouter: "bg-gradient-to-r from-indigo-600 to-indigo-500",
    modifier: "bg-gradient-to-r from-yellow-600 to-yellow-500",
    supprimer: "bg-gradient-to-r from-red-600 to-red-500"
  }[modalType.value];
});

// Méthodes
const formatType = (type) => {
  return {
    standard: "Standard",
    tranches_fixes: "Tranches fixes",
    negociation: "Négociation"
  }[type] || type;
};

const formatMontant = (montant) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(montant);
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

const openModal = (type, plan = null) => {
  modalType.value = type;
  selectedPlan.value = plan;
  
  if (type === "ajouter") {
    form.value = {
      nom: "",
      type: "standard",
      nombre_tranches: 1,
      est_personnalise: false,
      actif: true,
      tranches: []
    };
  } else {
    form.value = {
      nom: plan.nom,
      type: plan.type,
      nombre_tranches: plan.nombre_tranches,
      est_personnalise: plan.est_personnalise,
      actif: plan.actif,
      tranches: plan.tranches ? [...plan.tranches] : []
    };
  }
  
  showModal.value = true;
};

const ajouterTranche = () => {
  form.value.tranches.push({
    ordre: form.value.tranches.length + 1,
    montant: null,
    pourcentage: null,
    mois_apres_debut: 0
  });
};

const supprimerTranche = (index) => {
  form.value.tranches.splice(index, 1);
  // Réordonner
  form.value.tranches.forEach((t, i) => {
    t.ordre = i + 1;
  });
};

const savePlan = async () => {
  try {
    if (!form.value.nom) {
      $toastr.warning("Le nom du plan est requis");
      return;
    }

    const payload = {
      ...form.value,
      nombre_tranches: form.value.tranches.length || form.value.nombre_tranches
    };

    if (modalType.value === "ajouter") {
      await planStore.addPlanPaiement(payload);
      $toastr.success("Plan ajouté avec succès");
    } else {
      await planStore.updatePlanPaiement(selectedPlan.value.id, payload);
      $toastr.success("Plan modifié avec succès");
    }
    
    showModal.value = false;
    await planStore.fetchPlansPaiement();
  } catch (error) {
    console.error(error);
    $toastr.error("Erreur lors de l'enregistrement");
  }
};

const deletePlan = async () => {
  try {
    await planStore.deletePlanPaiement(selectedPlan.value.id);
    $toastr.success("Plan supprimé avec succès");
    showModal.value = false;
    await planStore.fetchPlansPaiement();
  } catch (error) {
    console.error(error);
    $toastr.error("Erreur lors de la suppression");
  }
};

const toggleActif = async (plan) => {
  try {
    await planStore.updatePlanPaiement(plan.id, { actif: !plan.actif });
    $toastr.success(plan.actif ? "Plan désactivé" : "Plan activé");
    await planStore.fetchPlansPaiement();
  } catch (error) {
    console.error(error);
    $toastr.error("Erreur lors du changement de statut");
  }
};

// Initialisation
onMounted(async () => {
  isPageLoading.value = true;
  try {
    await planStore.fetchPlansPaiement();
  } catch (error) {
    console.error(error);
    $toastr.error("Erreur lors du chargement des plans");
  } finally {
    isPageLoading.value = false;
  }
});
</script>