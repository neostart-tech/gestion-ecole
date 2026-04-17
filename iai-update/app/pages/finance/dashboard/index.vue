<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 lg:p-8 transition-colors duration-300"
  >
    <!-- En-tête avec sélecteur de période -->
    <div class="mb-8">
      <div
        class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div class="flex items-center gap-4">
          <div class="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
            <svg
              class="w-8 h-8 text-indigo-600 dark:text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <h1
              class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white"
            >
              Dashboard financier
            </h1>
          </div>
        </div>

        <!-- Badge période avec indicateur de chargement intégré -->
        <div
          class="flex flex-wrap items-center gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-2 rounded-xl border border-gray-200/50 dark:border-gray-700/50"
        >
          <div v-if="isLoading" class="flex items-center gap-2 px-3">
            <svg
              class="animate-spin h-4 w-4 text-indigo-600 dark:text-indigo-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
              Chargement des données...
            </span>
          </div>

          <div
            v-else
            class="flex flex-wrap items-center gap-3"
          >
            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span class="text-sm font-medium text-gray-600 dark:text-gray-300"
              >Mise à jour en temps réel</span
            >

            <!-- Sélecteur de période -->
            <div
              class="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1"
            >
              <button
                v-for="option in periodeOptions"
                :key="option.value"
                @click="changerPeriode(option.value)"
                :class="[
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  dashboardStore.periode === option.value
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
              >
                {{ option.label }}
              </button>
            </div>

            <!-- Dates personnalisées -->
            <div
              v-if="dashboardStore.periode === 'personnalise'"
              class="flex items-center gap-2"
            >
              <input
                type="date"
                v-model="dateDebut"
                @change="appliquerDatesPersonnalisees"
                class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              />
              <input
                type="date"
                v-model="dateFin"
                @change="appliquerDatesPersonnalisees"
                :min="dateDebut"
                class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              />
            </div>

            <!-- Bouton rafraîchir -->
            <button
              @click="rafraichirDonnees"
              class="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              :disabled="dashboardStore.isLoading"
            >
              <svg
                class="w-5 h-5 text-gray-600 dark:text-gray-400"
                :class="{ 'animate-spin': dashboardStore.isLoading }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cartes de résumé (KPI) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <!-- Loading avec effet de vague -->
      <template v-if="isLoading">
        <div
          v-for="n in 4"
          :key="n"
          class="relative overflow-hidden bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700"
        >
          <!-- Effet de vague de chargement -->
          <div
            class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
          ></div>

          <div class="flex items-start justify-between">
            <div class="w-full">
              <div
                class="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
              ></div>
              <div
                class="h-8 w-24 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded mt-2"
              ></div>
            </div>
            <div
              class="p-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg"
            >
              <div class="w-6 h-6"></div>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-1">
            <div
              class="w-2 h-2 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-full"
            ></div>
            <div
              class="h-3 w-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
            ></div>
          </div>
        </div>
      </template>

      <!-- Données réelles avec animation d'apparition -->
      <template v-else>
        <div
          v-for="(kpi, index) in kpis"
          :key="index"
          @click="navigateTo('/finance/recouvrement?tab=students')"
          class="group bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700 animate-fade-in-up cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-800"
          :style="{ animationDelay: index * 100 + 'ms' }"
        >
          <div class="flex items-start justify-between mb-4">
            <div :class="['p-3 rounded-lg', kpi.bgColor]">
              <svg
                class="w-6 h-6"
                :class="kpi.iconColor"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="kpi.icon"
                />
              </svg>
            </div>
            <span
              class="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              {{ kpi.periode }}
            </span>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {{ kpi.label }}
          </p>
          <p class="text-2xl font-bold" :class="kpi.valueClass">
            {{ kpi.value }}
          </p>
          <!-- Indicateur visuel discret -->
          <div class="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
            <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </template>
    </div>

    <!-- Tableaux de Performance par Cycle (Chiffres Bruts) -->
    <div v-if="!isLoading && macroCycles.length > 0" class="mb-8 animate-fade-in-up" style="animation-delay: 200ms">
      <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50 transition-colors">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-indigo-50 dark:bg-indigo-900/40 rounded-lg">
              <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 00-4-4H5m11 2a4 4 0 01-4 4H12m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">Récapitulatif par Cycle</h2>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Analyse chiffrée détaillée du recouvrement</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
             <span class="px-2.5 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300 shadow-sm">
                {{ dashboardStore.periodeAffichee }}
             </span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-900/20">
              <tr>
                <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Cycle / Niveau</th>
                <th class="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Inscriptions</th>
                <th class="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Scolarité</th>
                <th class="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Total Encaissé</th>
                <th class="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Prévisions</th>
                <th class="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Taux</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
              <template v-for="cycle in macroCycles" :key="cycle.nom">
                <!-- Ligne de Cycle (Gris/Indig) -->
                <tr class="bg-indigo-50/20 dark:bg-indigo-900/10 transition-colors">
                  <td class="px-6 py-5 text-sm font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-tight">
                    <div class="flex items-center gap-2">
                      <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      {{ cycle.nom }}
                    </div>
                  </td>
                  <td class="px-6 py-5 text-right text-sm font-bold text-gray-600 dark:text-gray-300 tabular-nums">
                    {{ formatMontant(cycle.inscription) }}
                  </td>
                  <td class="px-6 py-5 text-right text-sm font-bold text-gray-600 dark:text-gray-300 tabular-nums">
                    {{ formatMontant(cycle.scolarite) }}
                  </td>
                  <td class="px-6 py-5 text-right text-sm font-black text-emerald-600 dark:text-emerald-400 tabular-nums bg-emerald-50/30 dark:bg-emerald-900/10">
                    {{ formatMontant(cycle.total) }}
                  </td>
                  <td class="px-6 py-5 text-right text-sm font-bold text-gray-500 dark:text-gray-400 tabular-nums">
                    {{ formatMontant(cycle.previsions) }}
                  </td>
                  <td class="px-6 py-5 text-right">
                    <div class="inline-flex items-center px-3 py-1 rounded-lg text-[11px] font-black border tracking-tighter" :class="getTauxColor(cycle.taux_recouvrement, true)">
                       {{ cycle.taux_recouvrement }}%
                    </div>
                  </td>
                </tr>
                <!-- Détails par Niveau -->
                <tr v-for="niv in cycle.details" :key="niv.nom" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                  <td class="px-10 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                    {{ niv.nom }}
                  </td>
                  <td class="px-6 py-3 text-right text-xs font-semibold text-gray-400 dark:text-gray-500 tabular-nums">
                    {{ formatMontant(niv.inscription) }}
                  </td>
                  <td class="px-6 py-3 text-right text-xs font-semibold text-gray-400 dark:text-gray-500 tabular-nums">
                    {{ formatMontant(niv.scolarite) }}
                  </td>
                  <td class="px-6 py-3 text-right text-sm font-bold text-emerald-500/80 dark:text-emerald-500/60 tabular-nums">
                    {{ formatMontant(niv.total) }}
                  </td>
                  <td class="px-6 py-3 text-right text-xs font-semibold text-gray-400 dark:text-gray-500 tabular-nums">
                    {{ formatMontant(niv.previsions) }}
                  </td>
                  <td class="px-6 py-3 text-right">
                    <span class="text-[11px] font-bold text-gray-400">{{ niv.previsions > 0 ? Math.round((Number(niv.total) / Number(niv.previsions))*100) : (Number(niv.total) > 0 ? 100 : 0) }}%</span>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 4 Nouveaux Graphiques Analytiques -->
    <div v-if="!isLoading && areNewChartsDataReady" class="mb-8 animate-fade-in-up" style="animation-delay: 300ms">
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <!-- Recouvrement par niveau (Bar + Ligne) -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4 text-center">Recouvrement par niveau</h3>
          <div class="h-[350px] relative w-full">
            <canvas ref="recouvrementChart"></canvas>
          </div>
        </div>

        <!-- Retard de paiement en YTD (Bar horiz) -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4 text-center">Retard de paiement en YTD</h3>
          <div class="h-[350px] relative w-full">
            <canvas ref="retardChart"></canvas>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <!-- Répartition du CA par niveau (Camembert) -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4 text-center">Répartition du CA par niveau</h3>
          <div class="h-[350px] relative w-full flex justify-center">
            <canvas ref="repartitionChart"></canvas>
          </div>
        </div>

        <!-- Nb d'inscrits et d'abandon par niveau (Stacked) -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4 text-center">Nb d'inscrits et d'abandon par niveau</h3>
          <div class="h-[350px] relative w-full">
            <canvas ref="effectifsChart"></canvas>
          </div>
        </div>
      </div>
    </div>


    <!-- Graphiques principaux -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Évolution des paiements -->
      <div
        class="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <div
          v-if="isLoading"
          class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
        ></div>

        <div class="flex items-center justify-between mb-6">
          <h3
            class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"
          >
            <svg
              class="w-5 h-5 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
            Évolution des paiements
          </h3>

          <!-- Indicateur de progression pour le chargement -->
          <div v-if="isLoading" class="flex items-center gap-2">
            <div
              class="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full animate-progress"
              ></div>
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-400"
              >Chargement...</span
            >
          </div>

          <div v-else class="flex gap-2">
            <button
              @click="toggleGraphView('montant')"
              :class="[
                'px-3 py-1 rounded-md text-xs font-medium transition',
                graphView === 'montant'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
              ]"
            >
              Montant
            </button>
            <button
              @click="toggleGraphView('nombre')"
              :class="[
                'px-3 py-1 rounded-md text-xs font-medium transition',
                graphView === 'nombre'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
              ]"
            >
              Nombre
            </button>
          </div>
        </div>

        <div class="h-80">
          <!-- Loading avec effet de vague -->
          <template v-if="isLoading">
            <div class="h-full flex items-end justify-around gap-2 px-4 relative">
              <div
                v-for="n in 6"
                :key="n"
                class="relative w-12 bg-gradient-to-t from-indigo-200 to-indigo-300 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-t-lg overflow-hidden"
                :style="{ height: Math.random() * 60 + 20 + '%' }"
              >
                <div
                  class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
                ></div>
              </div>
              <div
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300 dark:from-indigo-700 dark:to-purple-700 animate-pulse"
              ></div>
            </div>
          </template>

          <!-- Données réelles -->
          <canvas v-else ref="evolutionChart" class="animate-fade-in"></canvas>
        </div>
      </div>

      <!-- Répartition par statut -->
      <div
        class="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <div
          v-if="isLoading"
          class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
        ></div>

        <h3
          class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6"
        >
          <svg
            class="w-5 h-5 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
          </svg>
          Répartition par statut
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="h-64">
            <!-- Loading avec effet de pulse -->
            <template v-if="isLoading">
              <div class="w-48 h-48 md:w-56 md:h-56 mx-auto relative">
                <div
                  class="w-full h-full rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse"
                ></div>
                <div
                  class="absolute inset-2 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 animate-pulse opacity-50"
                ></div>
                <div
                  class="absolute inset-4 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 animate-pulse opacity-30"
                ></div>
              </div>
            </template>

            <!-- Données réelles -->
            <canvas v-else ref="statutChart" class="animate-fade-in"></canvas>
          </div>

          <div class="space-y-4">
            <!-- Loading pour la légende -->
            <template v-if="isLoading">
              <div
                v-for="n in 3"
                :key="n"
                class="relative overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 p-3 rounded-lg"
              >
                <div
                  class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
                ></div>
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-3 h-3 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-full"
                    ></div>
                    <div
                      class="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
                    ></div>
                  </div>
                  <div
                    class="h-4 w-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
                  ></div>
                </div>
              </div>
              <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div class="flex justify-between items-center">
                  <div
                    class="h-4 w-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
                  ></div>
                  <div
                    class="h-6 w-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
                  ></div>
                </div>
              </div>
            </template>

            <!-- Données réelles -->
            <template v-else>
              <div
                v-for="statut in statutsListe"
                :key="statut.label"
                class="flex items-center justify-between p-2 rounded-lg transition-all animate-slide-in-right"
                :style="{ animationDelay: statutsListe.indexOf(statut) * 100 + 'ms' }"
              >
                <div class="flex items-center gap-2">
                  <span
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: statut.color }"
                  ></span>
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{
                    statut.label
                  }}</span>
                </div>
                <div class="text-right">
                  <span class="font-medium text-gray-900 dark:text-white">{{
                    statut.value
                  }}</span>
                  <span class="text-xs text-gray-500 ml-2"
                    >({{ statut.pourcentage }}%)</span
                  >
                </div>
              </div>
              <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Total étudiants</span>
                  <span
                    class="font-bold text-gray-900 dark:text-white animate-count-up"
                    >{{ dashboardStore.totalEtudiants }}</span
                  >
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Tableaux de performance -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Top payeurs -->
      <div
        class="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <div
          v-if="isLoading"
          class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
        ></div>

        <div
          class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
        >
          <h3
            class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"
          >
            <svg
              class="w-5 h-5 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            Top payeurs
          </h3>
        </div>

        <div class="divide-y divide-gray-100 dark:divide-gray-700">
          <!-- Loading -->
          <template v-if="isLoading">
            <div
              v-for="n in 5"
              :key="n"
              class="relative overflow-hidden flex items-center gap-4 p-4"
            >
              <div
                class="w-10 h-10 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"
              ></div>
              <div class="flex-1">
                <div
                  class="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded mb-2"
                ></div>
                <div
                  class="h-3 w-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
                ></div>
              </div>
              <div class="text-right">
                <div
                  class="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded mb-2"
                ></div>
                <div
                  class="h-3 w-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
                ></div>
              </div>
            </div>
          </template>

          <!-- Données réelles -->
          <template v-else>
            <div
              v-for="(performer, index) in dashboardStore.topPerformersFormatted"
              :key="index"
              class="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors animate-slide-in-right"
              :style="{ animationDelay: index * 100 + 'ms' }"
            >
              <div
                class="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg"
              >
                {{ index + 1 }}
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ performer.nom }} {{ performer.prenom }}
                </p>
                <p class="text-sm text-gray-500">{{ performer.matricule }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-emerald-600">
                  {{ performer.total_paye_formatted }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ performer.nombre_paiements }} paiements
                </p>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Étudiants en retard -->
      <div
        class="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <div
          v-if="isLoading"
          class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
        ></div>

        <div
          class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
        >
          <h3
            class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"
          >
            <svg
              class="w-5 h-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Étudiants en retard
          </h3>
        </div>

        <div class="divide-y divide-gray-100 dark:divide-gray-700">
          <!-- Loading -->
          <template v-if="isLoading">
            <div
              v-for="n in 5"
              :key="n"
              class="relative overflow-hidden flex items-center gap-4 p-4"
            >
              <div
                class="w-10 h-10 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"
              ></div>
              <div class="flex-1">
                <div
                  class="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded mb-2"
                ></div>
                <div
                  class="h-3 w-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
                ></div>
              </div>
              <div class="text-right">
                <div
                  class="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded mb-2"
                ></div>
                <div
                  class="h-3 w-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
                ></div>
              </div>
            </div>
          </template>

          <!-- Données réelles -->
          <template v-else>
            <div
              v-for="(etudiant, index) in dashboardStore.etudiantsEnRetardFormatted"
              :key="index"
              class="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors animate-slide-in-right"
              :style="{ animationDelay: index * 100 + 'ms' }"
            >
              <div
                class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ etudiant.nom }} {{ etudiant.prenom }}
                </p>
                <p class="text-sm text-gray-500">{{ etudiant.matricule }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-red-600">
                  {{ etudiant.montant_restant_formatted }}
                </p>
                <p class="text-xs text-gray-500">{{ etudiant.jours_retard_text }}</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Tableau des filières -->
    <div
      class="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mb-8"
    >
      <div
        v-if="isLoading"
        class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
      ></div>

      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3
          class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"
        >
          <svg
            class="w-5 h-5 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        Performance par filière
      </h3>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <th
              class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Filière
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Étudiants
            </th>
            <th
              class="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              À payer
            </th>
            <th
              class="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Payé
            </th>
            <th
              class="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Reste
            </th>
            <th
              class="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Taux
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
          <!-- Loading -->
          <template v-if="isLoading">
            <tr v-for="n in 4" :key="n" class="relative overflow-hidden">
              <td class="px-6 py-4">
                <div
                  class="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
                ></div>
                <div
                  class="h-3 w-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded mt-2"
                ></div>
              </td>
              <td class="px-6 py-4">
                <div
                  class="h-4 w-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
                ></div>
              </td>
              <td class="px-6 py-4 text-right">
                <div
                  class="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded ml-auto"
                ></div>
              </td>
              <td class="px-6 py-4 text-right">
                <div
                  class="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded ml-auto"
                ></div>
              </td>
              <td class="px-6 py-4 text-right">
                <div
                  class="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded ml-auto"
                ></div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <div
                    class="h-4 w-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
                  ></div>
                  <div
                    class="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full w-3/4 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-full"
                    ></div>
                  </div>
                </div>
              </td>
            </tr>
          </template>

          <!-- Données réelles -->
          <template v-else>
            <tr
              v-for="(filiere, index) in dashboardStore.filieresData"
              :key="filiere.filiere_id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors animate-fade-in-up"
              :style="{ animationDelay: index * 50 + 'ms' }"
            >
              <td class="px-6 py-4">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ filiere.filiere_nom }}
                  </p>
                  <p class="text-xs text-gray-500">{{ filiere.filiere_code }}</p>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-900 dark:text-white">
                {{ filiere.nombre_etudiants }}
              </td>
              <td class="px-6 py-4 text-right font-mono text-gray-900 dark:text-white">
                {{ filiere.total_a_payer_formatted }}
              </td>
              <td class="px-6 py-4 text-right font-mono text-emerald-600">
                {{ filiere.total_paye_formatted }}
              </td>
              <td class="px-6 py-4 text-right font-mono text-amber-600">
                {{ filiere.total_restant_formatted }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <span
                    class="text-sm font-medium"
                    :class="getTauxColor(filiere.progression)"
                    >{{ filiere.progression }}%</span
                  >
                  <div
                    class="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full rounded-full"
                      :class="getProgressBarColor(filiere.progression)"
                      :style="{ width: filiere.progression + '%' }"
                    ></div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Prévisions et paiements récents -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <!-- Prévisions -->
      <div
        class="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <div
          v-if="isLoading"
          class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
        ></div>

        <h3
          class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6"
        >
          <svg
            class="w-5 h-5 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Prévisions des 6 prochains mois
        </h3>

        <div class="space-y-4">
          <!-- Loading -->
          <template v-if="isLoading">
            <div
              v-for="n in 6"
              :key="n"
              class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3"
            >
              <div>
                <div
                  class="h-4 w-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded mb-2"
                ></div>
                <div
                  class="h-3 w-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
                ></div>
              </div>
              <div
                class="h-5 w-28 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
              ></div>
            </div>
          </template>

          <!-- Données réelles -->
          <template v-else>
            <div
              v-for="(prev, index) in dashboardStore.previsionsFormatted"
              :key="prev.mois"
              class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0 animate-slide-in-right"
              :style="{ animationDelay: index * 100 + 'ms' }"
            >
              <div class="flex-1">
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ prev.label }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ prev.nombre_echeances }} échéances
                </p>
              </div>
              <div class="text-right">
                <p class="font-bold text-indigo-600">
                  {{ prev.montant_prevu_formatted }}
                </p>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Paiements récents -->
      <div
        class="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <div
          v-if="isLoading"
          class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
        ></div>

        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3
            class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"
          >
            <svg
              class="w-5 h-5 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Paiements récents
          </h3>
        </div>

        <div class="divide-y divide-gray-100 dark:divide-gray-700">
          <!-- Loading -->
          <template v-if="isLoading">
            <div
              v-for="n in 5"
              :key="n"
              class="relative overflow-hidden flex items-center gap-4 p-4"
            >
              <div
                class="w-10 h-10 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"
              ></div>
              <div class="flex-1">
                <div
                  class="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded mb-2"
                ></div>
                <div
                  class="h-3 w-40 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
                ></div>
              </div>
              <div class="text-right">
                <div
                  class="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded mb-2"
                ></div>
                <div
                  class="h-3 w-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
                ></div>
              </div>
            </div>
          </template>

          <!-- Données réelles -->
          <template v-else>
            <div
              v-for="(paiement, index) in dashboardStore.paiementsRecentsFormatted"
              :key="paiement.id"
              class="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors animate-slide-in-right"
              :style="{ animationDelay: index * 100 + 'ms' }"
            >
              <div
                class="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ paiement.etudiant }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ paiement.libelle }} • {{ paiement.mode_paiement }}
                </p>
              </div>
              <div class="text-right">
                <p class="font-bold text-emerald-600">
                  {{ paiement.montant_formatted }}
                </p>
                <p class="text-xs text-gray-500">{{ paiement.date }}</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    </div>

    <!-- Toast -->
    <Toast position="top-right" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import { useDashboardPaiementStore } from "~~/stores/dashboard-paiement";
import Chart from "chart.js/auto";

const toast = useToast();
const dashboardStore = useDashboardPaiementStore();

// États locaux
const isLoading = ref(true);
const dateDebut = ref("");
const dateFin = ref("");
const graphView = ref("montant");
const chartsInitialized = ref(false);

const evolutionChart = ref(null);
const statutChart = ref(null);

const recouvrementChart = ref(null);
const retardChart = ref(null);
const repartitionChart = ref(null);
const effectifsChart = ref(null);

let evolutionChartInstance = null;
let statutChartInstance = null;

let recouvrementChartInstance = null;
let retardChartInstance = null;
let repartitionChartInstance = null;
let effectifsChartInstance = null;

// Options de période
const periodeOptions = [
  { value: "semaine", label: "Semaine" },
  { value: "mois", label: "Mois" },
  { value: "annee", label: "Année" },
  { value: "personnalise", label: "Personnalisé" },
];

// KPIs calculés
const kpis = computed(() => [
  // --- SCOLARITE ---
  {
    label: "Scolarité à encaisser",
    value: formatMontant(dashboardStore.scolariteAPayer),
    periode: dashboardStore.periodeAffichee,
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    valueClass: "text-gray-900 dark:text-white",
  },
  {
    label: "Scolarité déjà encaissée",
    value: formatMontant(dashboardStore.scolariteCollecte),
    periode: dashboardStore.periodeAffichee,
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    valueClass: "text-emerald-600",
  },
  {
    label: "Scolarité restante",
    value: formatMontant(dashboardStore.scolariteRestant),
    periode: dashboardStore.periodeAffichee,
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    valueClass: "text-amber-600",
  },
  {
    label: "Taux recouv. (Scolarité)",
    value: dashboardStore.scolariteTaux + "%",
    periode: dashboardStore.periodeAffichee,
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
    valueClass: "text-purple-600",
  },
  // --- INSCRIPTION ---
  {
    label: "Frais d'inscript. (Prévus)",
    value: formatMontant(dashboardStore.inscriptionAPayer),
    periode: dashboardStore.periodeAffichee,
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    iconColor: "text-indigo-500 dark:text-indigo-400",
    valueClass: "text-gray-700 dark:text-gray-300",
  },
  {
    label: "Inscript. Encaissées",
    value: formatMontant(dashboardStore.inscriptionCollecte),
    periode: dashboardStore.periodeAffichee,
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
    iconColor: "text-teal-500 dark:text-teal-400",
    valueClass: "text-teal-600",
  },
  {
    label: "Inscript. Restantes",
    value: formatMontant(dashboardStore.inscriptionRestant),
    periode: dashboardStore.periodeAffichee,
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    iconColor: "text-orange-500 dark:text-orange-400",
    valueClass: "text-orange-600",
  },
  {
    label: "Taux recouv. (Inscript.)",
    value: dashboardStore.inscriptionTaux + "%",
    periode: dashboardStore.periodeAffichee,
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    iconColor: "text-pink-500 dark:text-pink-400",
    valueClass: "text-pink-600",
  },
]);

// Données pour les graphiques
const evolutionChartData = computed(() => {
  // Mode comparaison multi-courbes (Montant)
  if (graphView.value === "montant" && dashboardStore.statistiques?.series_graphique) {
    return dashboardStore.statistiques.series_graphique;
  }

  // Mode simple (Nombre de paiements)
  if (!dashboardStore.evolutionPaiements?.length) return null;
  
  return { 
    labels: dashboardStore.evolutionPaiements.map((item) => item.label), 
    encaissements: dashboardStore.evolutionPaiements.map((item) => item.montant),
    nombre: dashboardStore.evolutionPaiements.map((item) => item.nombre)
  };
});

const statutsListe = computed(() => {
  if (!dashboardStore.graphiqueStatuts?.length) return [];
  
  return dashboardStore.graphiqueStatuts.map((s) => ({
    ...s,
    pourcentage:
      dashboardStore.totalEtudiants > 0
        ? ((s.value / dashboardStore.totalEtudiants) * 100).toFixed(1)
        : 0,
  }));
});

const macroCycles = computed(() => {
  const data = dashboardStore.statistiques?.encaissements_par_niveau || [];
  const cycles = {};
  
  data.forEach(niv => {
    const cycleName = niv.nom ? niv.nom.split(' ')[0] : 'Autre';
    if (!cycles[cycleName]) {
      cycles[cycleName] = { nom: cycleName, details: [], total: 0, previsions: 0, inscription: 0, scolarite: 0 };
    }
    cycles[cycleName].details.push(niv);
    cycles[cycleName].total += Number(niv.total || 0);
    cycles[cycleName].previsions += Number(niv.previsions || 0);
    cycles[cycleName].inscription += Number(niv.inscription || 0);
    cycles[cycleName].scolarite += Number(niv.scolarite || 0);
  });
  
  return Object.values(cycles).map(c => {
    c.taux_recouvrement = c.previsions > 0 ? Math.round((c.total / c.previsions)*100) : 0;
    // Sort details to have Licence 1 before Licence 2
    c.details.sort((a,b) => a.nom.localeCompare(b.nom));
    return c;
  });
});

const areChartDataReady = computed(() => {
  return (
    !isLoading.value &&
    evolutionChartData.value &&
    statutsListe.value.length > 0 &&
    evolutionChart.value &&
    statutChart.value
  );
});

const areNewChartsDataReady = computed(() => {
  return (
    !isLoading.value &&
    dashboardStore.statistiques?.encaissements_par_niveau &&
    dashboardStore.statistiques?.retards_par_niveau &&
    dashboardStore.statistiques?.effectifs_par_niveau
  );
});

// Méthodes
onMounted(async () => {
  await chargerDonnees();
});

// Observer les changements des données et initialiser les graphiques
watch(
  [areChartDataReady, areNewChartsDataReady, chartsInitialized],
  async ([ready, newReady, initialized]) => {
    if ((ready || newReady) && !initialized) {
      await nextTick();
      initializeCharts();
    }
  },
  { immediate: true, deep: true }
);

// Observer les changements de vue (montant/nombre)
watch(graphView, () => {
  if (chartsInitialized.value && evolutionChartData.value) {
    updateCharts();
  }
});

// Observer les changements du store
watch(
  () => [dashboardStore.evolutionPaiements, dashboardStore.graphiqueStatuts],
  () => {
    if (!isLoading.value && chartsInitialized.value) {
      updateCharts();
    }
  },
  { deep: true }
);

const router = useRouter();

const filterByStatut = (statutKey) => {
  if (!statutKey || statutKey === 'aucun_frais') return;
  
  toast.add({
    severity: "info",
    summary: "Filtrage",
    detail: "Redirection vers la liste des étudiants...",
    life: 2000,
  });
  
  navigateTo(`/finance/recouvrement?tab=students&statut=${statutKey}`);
};

const chargerDonnees = async () => {
  isLoading.value = true;
  chartsInitialized.value = false;

  // Détruire les anciennes instances
  destroyCharts();

  try {
    await dashboardStore.loadStatistiques();

    // Petit délai pour une transition fluide
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  } catch (error) {
    console.error("Erreur chargement données:", error);
    toast.add({
      severity: "error",
      summary: "Erreur",
      detail: "Impossible de charger les données",
      life: 5000,
    });
    isLoading.value = false;
  }
};

const destroyCharts = () => {
  if (evolutionChartInstance) {
    evolutionChartInstance.destroy();
    evolutionChartInstance = null;
  }
  if (statutChartInstance) {
    statutChartInstance.destroy();
    statutChartInstance = null;
  }
  if (recouvrementChartInstance) { recouvrementChartInstance.destroy(); recouvrementChartInstance = null; }
  if (retardChartInstance) { retardChartInstance.destroy(); retardChartInstance = null; }
  if (repartitionChartInstance) { repartitionChartInstance.destroy(); repartitionChartInstance = null; }
  if (effectifsChartInstance) { effectifsChartInstance.destroy(); effectifsChartInstance = null; }
};

const initializeCharts = () => {
  console.log("Initialisation des graphiques...");
  
  // Initialiser le graphique d'évolution
  if (evolutionChart.value && evolutionChartData.value) {
    console.log("Initialisation graphique évolution", evolutionChartData.value);
    
    // S'assurer que le canvas est propre
    const ctx = evolutionChart.value.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, evolutionChart.value.width, evolutionChart.value.height);
    }

    evolutionChartInstance = new Chart(evolutionChart.value, {
      type: "line",
      data: {
        labels: evolutionChartData.value.labels,
        datasets: graphView.value === "montant" && dashboardStore.statistiques?.series_graphique ? [
          {
            label: "Encaissements",
            data: evolutionChartData.value.encaissements,
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            tension: 0.4,
            fill: true
          },
          {
            label: "Prévisions",
            data: evolutionChartData.value.previsions,
            borderColor: "#4f46e5",
            borderDash: [5, 5],
            tension: 0.4,
            fill: false
          },
          {
            label: "Dépenses",
            data: evolutionChartData.value.depenses,
            borderColor: "#ef4444",
            tension: 0.4,
            fill: false
          }
        ] : [
          {
            label: "Nombre de paiements",
            data: evolutionChartData.value.nombre,
            borderColor: "#4f46e5",
            backgroundColor: "rgba(79, 70, 229, 0.1)",
            tension: 0.4,
            fill: true
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom' },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (context) => {
                const value = context.raw;
                return graphView.value === "montant"
                  ? context.dataset.label + ": " + formatMontant(value)
                  : value + " paiements";
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) =>
                graphView.value === "montant"
                  ? value.toLocaleString("fr-FR")
                  : value,
            },
          },
        },
      },
    });
  }

  // Initialiser le graphique des statuts
  if (statutChart.value && dashboardStore.graphiqueStatuts.length) {
    console.log("Initialisation graphique statuts", dashboardStore.graphiqueStatuts);
    
    const ctx = statutChart.value.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, statutChart.value.width, statutChart.value.height);
    }

    statutChartInstance = new Chart(statutChart.value, {
      type: "doughnut",
      data: {
        labels: dashboardStore.graphiqueStatuts.map((s) => s.label),
        datasets: [
          {
            data: dashboardStore.graphiqueStatuts.map((s) => s.value),
            backgroundColor: dashboardStore.graphiqueStatuts.map((s) => s.color),
            borderWidth: 0,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 800,
          easing: 'easeInOutQuart',
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1F2937",
            titleColor: "#F9FAFB",
            bodyColor: "#F3F4F6",
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (context) => {
                const value = context.raw;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.label}: ${value} étudiants (${percentage}%)`;
              },
            },
          },
        },
        cutout: "65%",
      },
    });
  }

  // --- NOUVEAUX GRAPHIQUES METIERS ---

  const encaissementsData = dashboardStore.statistiques?.encaissements_par_niveau || [];
  const retardsData = dashboardStore.statistiques?.retards_par_niveau || [];
  const effectifsData = dashboardStore.statistiques?.effectifs_par_niveau || [];
  
  if (encaissementsData.length > 0) {
    const labels = encaissementsData.map(n => n.nom);

    // 1. Recouvrement par niveau (Bar + Ligne)
    if (recouvrementChart.value) {
      const ctx = recouvrementChart.value.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, recouvrementChart.value.width, recouvrementChart.value.height);

      recouvrementChartInstance = new Chart(recouvrementChart.value, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { type: 'bar', label: 'CA', data: encaissementsData.map(n => n.previsions), backgroundColor: '#3b82f6', categoryPercentage: 0.8, barPercentage: 0.9 },
            { type: 'bar', label: 'Recouvré', data: encaissementsData.map(n => n.total), backgroundColor: '#10b981', categoryPercentage: 0.8, barPercentage: 0.9 },
            { type: 'bar', label: 'RAR', data: encaissementsData.map(n => n.rar), backgroundColor: '#84cc16', categoryPercentage: 0.8, barPercentage: 0.9 }, // yellow-green
            { type: 'line', label: 'Taux', data: encaissementsData.map(n => n.taux_recouvrement), borderColor: '#6b7280', yAxisID: 'y1', tension: 0.1, datalabels: { align: 'top', color: '#ef4444', formatter: v => v+'%' } }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          scales: {
            x: { stacked: false },
            y: { title: { display: true, text: 'Montant (FCFA)' }, beginAtZero: true },
            y1: { type: 'linear', position: 'right', beginAtZero: true, max: 100, grid: { drawOnChartArea: false }, ticks: { callback: v => v+'%' } }
          },
          plugins: {
            legend: { position: 'bottom' },
            tooltip: { callbacks: { label: c => c.dataset.type === 'line' ? `Taux: ${c.raw}%` : `${c.dataset.label}: ${formatMontant(c.raw)}` } }
          }
        }
      });
    }

    // 2. Retard de paiement YTD (Horizontal Bar)
    if (retardChart.value && retardsData.length > 0) {
      const ctx = retardChart.value.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, retardChart.value.width, retardChart.value.height);
      
      retardChartInstance = new Chart(retardChart.value, {
        type: 'bar',
        data: {
          labels: retardsData.map(n => n.nom),
          datasets: [{
            label: 'Solde',
            data: retardsData.map(n => n.montant_retard),
            backgroundColor: '#3b82f6'
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: { 
              callbacks: { 
                label: c => `Solde: ${formatMontant(c.raw)}`,
                afterLabel: c => `Étudiants en retard: ${retardsData[c.dataIndex].nombre_etudiants}` 
              } 
            }
          }
        }
      });
    }

    // 3. Répartition CA (Pie)
    if (repartitionChart.value) {
      const ctx = repartitionChart.value.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, repartitionChart.value.width, repartitionChart.value.height);

      repartitionChartInstance = new Chart(repartitionChart.value, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            data: encaissementsData.map(n => n.previsions),
            backgroundColor: encaissementsData.map((_, i) => getNiveauColor(i)),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right' },
            tooltip: {
              callbacks: {
                label: c => {
                  const total = c.dataset.data.reduce((a,b)=>a+b,0);
                  const p = total > 0 ? Math.round((c.raw/total)*100) : 0;
                  return `${c.label}: ${formatMontant(c.raw)} (${p}%)`;
                }
              }
            }
          }
        }
      });
    }

    // 4. Effectifs / Abandons (Stacked)
    if (effectifsChart.value && effectifsData.length > 0) {
      const ctx = effectifsChart.value.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, effectifsChart.value.width, effectifsChart.value.height);

      effectifsChartInstance = new Chart(effectifsChart.value, {
        type: 'bar',
        data: {
          labels: effectifsData.map(n => n.nom),
          datasets: [
            { label: 'Actif', data: effectifsData.map(n => n.actifs), backgroundColor: '#3b82f6' },
            { label: 'Abandon', data: effectifsData.map(n => n.abandons), backgroundColor: '#ef4444' }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true }
          },
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }
  }

  chartsInitialized.value = true;
};

const updateCharts = () => {
  console.log("Mise à jour des graphiques...");
  
  if (evolutionChartInstance) { evolutionChartInstance.destroy(); evolutionChartInstance = null; }
  if (statutChartInstance) { statutChartInstance.destroy(); statutChartInstance = null; }
  if (recouvrementChartInstance) { recouvrementChartInstance.destroy(); recouvrementChartInstance = null; }
  if (retardChartInstance) { retardChartInstance.destroy(); retardChartInstance = null; }
  if (repartitionChartInstance) { repartitionChartInstance.destroy(); repartitionChartInstance = null; }
  if (effectifsChartInstance) { effectifsChartInstance.destroy(); effectifsChartInstance = null; }

  initializeCharts();
};

const rafraichirDonnees = async () => {
  await chargerDonnees();
  toast.add({
    severity: "success",
    summary: "Succès",
    detail: "Données actualisées",
    life: 3000,
  });
};

const changerPeriode = (periode) => {
  dashboardStore.setPeriode(periode);
  if (periode !== "personnalise") {
    chargerDonnees();
  }
};

const appliquerDatesPersonnalisees = () => {
  if (dateDebut.value && dateFin.value) {
    dashboardStore.setDatesPersonnalisees(dateDebut.value, dateFin.value);
    chargerDonnees();
  }
};

const toggleGraphView = (view) => {
  graphView.value = view;
};

const formatMontant = (montant) => {
  if (!montant && montant !== 0) return "-";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  })
    .format(montant)
    .replace("XOF", "FCFA");
};

const getTauxColor = (taux, isBadge = false) => {
  const t = parseFloat(taux) || 0;
  if (isBadge) {
    if (t >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800';
    if (t >= 50) return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
    return 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
  }
  if (t >= 80) return "text-emerald-600";
  if (t >= 50) return "text-amber-600";
  return "text-red-600";
};

const getProgressBarColor = (taux) => {
  if (taux >= 80) return "bg-emerald-500";
  if (taux >= 50) return "bg-amber-500";
  return "bg-red-500";
};

const getNiveauColor = (idx) => {
  const palette = ['#3b82f6', '#4f46e5', '#9333ea', '#ec4899', '#f43f5e', '#f97316'];
  return palette[idx % palette.length];
};

// Nettoyage à la destruction du composant
onUnmounted(() => {
  destroyCharts();
});
</script>
<style scoped>
/* Personnalisation des inputs date */
input[type="date"] {
  @apply appearance-none;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  @apply dark:invert opacity-50 hover:opacity-100 cursor-pointer;
}

/* Animations personnalisées */
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes count-up {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes progress {
  0% {
    width: 0%;
  }
  50% {
    width: 70%;
  }
  100% {
    width: 100%;
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
}

.animate-slide-in-right {
  animation: slide-in-right 0.5s ease-out forwards;
  opacity: 0;
}

.animate-fade-in {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animate-count-up {
  animation: count-up 0.5s ease-out forwards;
}

.animate-progress {
  animation: progress 2s ease-in-out infinite;
}

.animate-[shimmer_2s_infinite] {
  animation: shimmer 2s infinite;
}

/* Transition fluide pour le changement d'état */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>