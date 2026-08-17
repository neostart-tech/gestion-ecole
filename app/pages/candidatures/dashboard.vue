<template>
  <div class="min-h-screen bg-[#f3f3f8] dark:bg-[#08080f] font-sans transition-colors duration-500 relative">
    
    <!-- Fond d'ambiance violet -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#7F45FD]/15 dark:bg-[#7F45FD]/25 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
      <div class="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#7F45FD]/15 dark:bg-[#7F45FD]/25 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjN0Y0NUZEIiBmaWxsLW9wYWNpdHk9IjAuMDgiPjxwYXRoIGQ9Ik0zNiAzNHYtNGgxdjRoLTF6bTAgM3YtMWgxdjFoLTF6bTAgNHYtMWgxdjFoLTF6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
    </div>

    <div class="relative z-10 w-full max-w-7xl mx-auto p-3 sm:p-5 lg:p-8 space-y-6 overflow-x-hidden">
      
      <!-- Header Intégré & Professionnel -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-3 mb-1 sm:mb-2">
            <div class="w-1.5 h-6 sm:h-8 bg-[#7F45FD] rounded-full shrink-0"></div>
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-black text-[#1a1a2a] dark:text-[#fafafe] tracking-tight">
              Tableau de Bord des Candidatures
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-[#8a8a9a] font-medium ml-4">
            Analyses statistiques, métriques de conversion et suivi dynamique du recrutement
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
          <button
            @click="chargerDonnees"
            :disabled="candidatureStore.isLoading"
            class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-[#151525] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#1a1a2a] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-[#1a1a30] transition-all shadow-sm disabled:opacity-50"
          >
            <svg
              class="w-4 h-4 text-[#7F45FD]"
              :class="{ 'animate-spin': candidatureStore.isLoading }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Actualiser</span>
          </button>

          <NuxtLink
            to="/candidatures/etude-dossier"
            class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#7F45FD] hover:bg-[#6a35e8] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-[0_8px_25px_rgba(127,69,253,0.3)]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Étude de dossier</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Barre de Filtres Avancés -->
      <div class="bg-white dark:bg-[#11111e] border border-[#e8e8f0] dark:border-[#1a1a2a] rounded-2xl p-4 sm:p-5 shadow-[0_8px_30px_rgba(127,69,253,0.04)] relative z-20">
        <div class="flex items-center gap-2 mb-3">
          <svg class="w-4 h-4 text-[#7F45FD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 16a1 1 0 011-1h8a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
          </svg>
          <span class="text-xs font-bold uppercase tracking-wider text-[#1a1a2a] dark:text-gray-200">Filtres analytiques</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <!-- Année Scolaire -->
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-[#8a8a9a] mb-1">Année Académique</label>
            <select
              v-model="filtres.annee_scolaire_id"
              @change="chargerDonnees"
              class="w-full bg-[#f8f8fc] dark:bg-[#181828] border border-[#e8e8f0] dark:border-[#222235] text-[#1a1a2a] dark:text-gray-200 text-xs font-medium rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#7F45FD]/50 outline-none transition"
            >
              <option value="">Toutes les années</option>
              <option
                v-for="annee in anneeScolaireStore.annneescolaires"
                :key="annee.id"
                :value="annee.id"
              >
                {{ annee.nom }} {{ annee.active ? '(Active)' : '' }}
              </option>
            </select>
          </div>

          <!-- Filière -->
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-[#8a8a9a] mb-1">Filière</label>
            <select
              v-model="filtres.filiere_id"
              @change="chargerDonnees"
              class="w-full bg-[#f8f8fc] dark:bg-[#181828] border border-[#e8e8f0] dark:border-[#222235] text-[#1a1a2a] dark:text-gray-200 text-xs font-medium rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#7F45FD]/50 outline-none transition"
            >
              <option value="">Toutes les filières</option>
              <option
                v-for="filiere in filiereStore.filieres"
                :key="filiere.id"
                :value="filiere.id"
              >
                {{ filiere.nom }} ({{ filiere.sigle }})
              </option>
            </select>
          </div>

          <!-- Niveau d'étude -->
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-[#8a8a9a] mb-1">Niveau d'étude</label>
            <select
              v-model="filtres.niveau_id"
              @change="chargerDonnees"
              class="w-full bg-[#f8f8fc] dark:bg-[#181828] border border-[#e8e8f0] dark:border-[#222235] text-[#1a1a2a] dark:text-gray-200 text-xs font-medium rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#7F45FD]/50 outline-none transition"
            >
              <option value="">Tous les niveaux</option>
              <option
                v-for="niveau in niveauStore.niveaux"
                :key="niveau.id"
                :value="niveau.id"
              >
                {{ niveau.nom }}
              </option>
            </select>
          </div>

          <!-- Mode de formation -->
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-[#8a8a9a] mb-1">Mode de formation</label>
            <select
              v-model="filtres.mode_formation"
              @change="chargerDonnees"
              class="w-full bg-[#f8f8fc] dark:bg-[#181828] border border-[#e8e8f0] dark:border-[#222235] text-[#1a1a2a] dark:text-gray-200 text-xs font-medium rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#7F45FD]/50 outline-none transition"
            >
              <option value="">Tous les modes</option>
              <option value="presentiel">Présentiel</option>
              <option value="en_ligne">En ligne</option>
              <option value="hybride">Hybride</option>
            </select>
          </div>

          <!-- Date de début -->
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-[#8a8a9a] mb-1">Du</label>
            <input
              type="date"
              v-model="filtres.date_debut"
              @change="chargerDonnees"
              class="w-full bg-[#f8f8fc] dark:bg-[#181828] border border-[#e8e8f0] dark:border-[#222235] text-[#1a1a2a] dark:text-gray-200 text-xs font-medium rounded-xl px-2 py-2 focus:ring-2 focus:ring-[#7F45FD]/50 outline-none transition"
            />
          </div>

          <!-- Date de fin -->
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-[#8a8a9a] mb-1">Au</label>
            <input
              type="date"
              v-model="filtres.date_fin"
              @change="chargerDonnees"
              class="w-full bg-[#f8f8fc] dark:bg-[#181828] border border-[#e8e8f0] dark:border-[#222235] text-[#1a1a2a] dark:text-gray-200 text-xs font-medium rounded-xl px-2 py-2 focus:ring-2 focus:ring-[#7F45FD]/50 outline-none transition"
            />
          </div>
        </div>

        <div v-if="hasActiveFilters" class="mt-3 flex items-center justify-between pt-3 border-t border-[#e8e8f0] dark:border-[#1a1a2a]">
          <span class="text-xs text-[#7F45FD] font-medium flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-[#7F45FD] animate-ping"></span>
            Filtres actifs appliqués
          </span>
          <button
            @click="reinitialiserFiltres"
            class="text-xs font-bold text-rose-500 hover:text-rose-600 transition"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      <!-- State de Chargement (Shimmer Skeleton) -->
      <div v-if="candidatureStore.isLoading && !stats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div v-for="n in 6" :key="n" class="bg-white dark:bg-[#11111e] p-5 rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a] animate-pulse space-y-3">
          <div class="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div class="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div class="h-2 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      </div>

      <!-- Métriques KPIs (Cartes Exécutives Épurées) -->
      <div v-else class="space-y-6">
        
        <!-- Grid principal 4 Cartes KPI spacieuses -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          <!-- Total Candidatures -->
          <div class="bg-white dark:bg-[#11111e] p-5 rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg class="w-16 h-16 text-[#7F45FD]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-[#8a8a9a]">Total Candidatures</p>
            <p class="text-3xl font-black text-[#1a1a2a] dark:text-[#fafafe] my-1.5">
              {{ stats?.kpis?.total_candidatures || 0 }}
            </p>
            <span class="text-[10px] font-semibold text-[#7F45FD] bg-[#7F45FD]/10 px-2.5 py-1 rounded-md inline-block">
              Toutes candidatures enregistrées
            </span>
          </div>

          <!-- Dossiers Validés -->
          <div class="bg-white dark:bg-[#11111e] p-5 rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg class="w-16 h-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-[#8a8a9a]">Dossiers Validés</p>
            <p class="text-3xl font-black text-emerald-600 dark:text-emerald-400 my-1.5">
              {{ stats?.kpis?.valides || 0 }}
            </p>
            <span class="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md inline-block">
              {{ stats?.kpis?.taux_validation || 0 }}% de taux de validation
            </span>
          </div>

          <!-- En cours de Traitement -->
          <div class="bg-white dark:bg-[#11111e] p-5 rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg class="w-16 h-16 text-[#7F45FD]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-[#8a8a9a]">En Cours d'Étude</p>
            <p class="text-3xl font-black text-[#7F45FD] dark:text-[#a882ff] my-1.5">
              {{ stats?.kpis?.en_etude || 0 }}
            </p>
            <span class="text-[10px] font-semibold text-[#7F45FD] bg-[#7F45FD]/10 px-2.5 py-1 rounded-md inline-block">
              {{ stats?.kpis?.transmis_academie || 0 }} académie · {{ stats?.kpis?.rectification || 0 }} à rectifier
            </span>
          </div>

          <!-- Candidats Admis -->
          <div class="bg-white dark:bg-[#11111e] p-5 rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg class="w-16 h-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-[#8a8a9a]">Candidats Admis</p>
            <p class="text-3xl font-black text-emerald-600 dark:text-emerald-400 my-1.5">
              {{ stats?.kpis?.admis || 0 }}
            </p>
            <span class="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md inline-block">
              Taux d'admission : {{ stats?.kpis?.taux_conversion || 0 }}%
            </span>
          </div>

        </div>

        <!-- Section 2: Synthèse Graphique & Ratio (3 Cartes Spacieuses) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          
          <!-- Carte Taux d'Admission -->
          <div class="bg-white dark:bg-[#11111e] p-5 sm:p-6 rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a] shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div class="flex items-center justify-between gap-2 mb-3">
                <h3 class="text-xs font-bold text-[#1a1a2a] dark:text-gray-200 uppercase tracking-wider">
                  Taux d'Admission
                </h3>
                <span class="text-xs font-black text-[#7F45FD] bg-[#7F45FD]/10 px-2.5 py-1 rounded-full shrink-0">
                  {{ stats?.kpis?.taux_conversion || 0 }}%
                </span>
              </div>
              
              <!-- Progress Bar -->
              <div class="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden my-3">
                <div
                  class="h-full bg-[#7F45FD] rounded-full transition-all duration-1000"
                  :style="{ width: (stats?.kpis?.taux_conversion || 0) + '%' }"
                ></div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 pt-3 border-t border-[#e8e8f0] dark:border-[#1a1a2a] text-xs">
              <div>
                <span class="block text-[11px] text-[#8a8a9a]">Admis</span>
                <span class="font-black text-emerald-600 dark:text-emerald-400 text-base">{{ stats?.kpis?.admis || 0 }}</span>
              </div>
              <div>
                <span class="block text-[11px] text-[#8a8a9a]">Rejetés / Abandon</span>
                <span class="font-black text-rose-500 text-base">{{ stats?.kpis?.rejetes || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Carte Frais de Dossier -->
          <div class="bg-white dark:bg-[#11111e] p-5 sm:p-6 rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a] shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div class="flex items-center justify-between gap-2 mb-3">
                <h3 class="text-xs font-bold text-[#1a1a2a] dark:text-gray-200 uppercase tracking-wider">
                  Frais de Dossier
                </h3>
                <span class="text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full shrink-0">
                  {{ stats?.kpis?.frais_payes || 0 }} payés
                </span>
              </div>

              <!-- Progress Bar -->
              <div class="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden my-3">
                <div
                  class="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                  :style="{ width: calculatedTauxFrais + '%' }"
                ></div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 pt-3 border-t border-[#e8e8f0] dark:border-[#1a1a2a] text-xs">
              <div>
                <span class="block text-[11px] text-[#8a8a9a]">Encassés</span>
                <span class="font-black text-emerald-600 text-base">{{ stats?.kpis?.frais_payes || 0 }}</span>
              </div>
              <div>
                <span class="block text-[11px] text-[#8a8a9a]">En Attente</span>
                <span class="font-black text-amber-500 text-base">{{ stats?.kpis?.frais_non_payes || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Carte Répartition par Genre -->
          <div class="bg-white dark:bg-[#11111e] p-5 sm:p-6 rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a] shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-xs font-bold text-[#1a1a2a] dark:text-gray-200 uppercase tracking-wider">
                  Répartition par Genre
                </h3>
              </div>

              <div class="space-y-3">
                <!-- Hommes -->
                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span class="font-medium text-[#1a1a2a] dark:text-gray-300 flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                      Masculin ({{ genreStats.masculinCount }})
                    </span>
                    <span class="font-bold text-blue-600">{{ genreStats.masculinPercent }}%</span>
                  </div>
                  <div class="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500 rounded-full transition-all duration-700" :style="{ width: genreStats.masculinPercent + '%' }"></div>
                  </div>
                </div>

                <!-- Femmes -->
                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span class="font-medium text-[#1a1a2a] dark:text-gray-300 flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full bg-pink-500 shrink-0"></span>
                      Féminin ({{ genreStats.femininCount }})
                    </span>
                    <span class="font-bold text-pink-600">{{ genreStats.femininPercent }}%</span>
                  </div>
                  <div class="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div class="h-full bg-pink-500 rounded-full transition-all duration-700" :style="{ width: genreStats.femininPercent + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-3 border-t border-[#e8e8f0] dark:border-[#1a1a2a] text-[11px] text-[#8a8a9a] flex justify-between items-center">
              <span>Ratio H/F</span>
              <span class="font-bold text-[#1a1a2a] dark:text-gray-200">{{ genreStats.masculinCount }} Hommes / {{ genreStats.femininCount }} Femmes</span>
            </div>
          </div>

        </div>

        <!-- Section 3: Graphiques analytiques (Filières & Niveaux) -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- Top Filières les plus demandées -->
          <div class="bg-white dark:bg-[#11111e] p-6 rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a] shadow-sm">
            <div class="flex items-center justify-between mb-5">
              <div class="flex items-center gap-2">
                <div class="w-2 h-5 bg-[#7F45FD] rounded-full shrink-0"></div>
                <h3 class="text-sm font-bold text-[#1a1a2a] dark:text-gray-200 uppercase tracking-wider">
                  Filières les plus demandées
                </h3>
              </div>
              <span class="text-xs text-[#8a8a9a] font-medium">Volumétrie candidatures</span>
            </div>

            <div v-if="!filieresDistribution || filieresDistribution.length === 0" class="py-8 text-center text-xs text-[#8a8a9a]">
              Aucune candidature enregistrée pour cette sélection.
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="(filiere, idx) in filieresDistribution.slice(0, 6)"
                :key="filiere.id"
                class="group"
              >
                <div class="flex justify-between items-center text-xs mb-1.5">
                  <span class="font-bold text-[#1a1a2a] dark:text-gray-200 flex items-center gap-2">
                    <span class="w-5 h-5 rounded-lg bg-[#7F45FD]/10 text-[#7F45FD] font-black text-[10px] flex items-center justify-center shrink-0">
                      {{ idx + 1 }}
                    </span>
                    {{ filiere.nom }}
                    <span class="text-[10px] text-[#8a8a9a] font-normal">({{ filiere.sigle }})</span>
                  </span>
                  <span class="font-black text-[#7F45FD] shrink-0 ml-2">{{ filiere.count }} ({{ filiere.percentage }}%)</span>
                </div>
                <div class="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-[#7F45FD] rounded-full transition-all duration-700 group-hover:scale-x-[1.01]"
                    :style="{ width: filiere.percentage + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Distribution par Niveau d'étude -->
          <div class="bg-white dark:bg-[#11111e] p-6 rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a] shadow-sm">
            <div class="flex items-center justify-between mb-5">
              <div class="flex items-center gap-2">
                <div class="w-2 h-5 bg-blue-500 rounded-full shrink-0"></div>
                <h3 class="text-sm font-bold text-[#1a1a2a] dark:text-gray-200 uppercase tracking-wider">
                  Répartition par Niveau d'Étude
                </h3>
              </div>
              <span class="text-xs text-[#8a8a9a] font-medium">Répartition par niveau</span>
            </div>

            <div v-if="!niveauxDistribution || niveauxDistribution.length === 0" class="py-8 text-center text-xs text-[#8a8a9a]">
              Aucune donnée disponible.
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="niveau in niveauxDistribution"
                :key="niveau.id"
                class="group"
              >
                <div class="flex justify-between items-center text-xs mb-1.5">
                  <span class="font-bold text-[#1a1a2a] dark:text-gray-200">
                    {{ niveau.nom }}
                  </span>
                  <span class="font-black text-blue-600 dark:text-blue-400 shrink-0 ml-2">{{ niveau.count }} ({{ niveau.percentage }}%)</span>
                </div>
                <div class="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-blue-600 rounded-full transition-all duration-700"
                    :style="{ width: niveau.percentage + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Section 4: Évolution Mensuelle des Candidatures -->
        <div class="bg-white dark:bg-[#11111e] p-6 rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a] shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-sm font-bold text-[#1a1a2a] dark:text-gray-200 uppercase tracking-wider">
                Évolution Temporelle des Candidatures (12 derniers mois)
              </h3>
              <p class="text-xs text-[#8a8a9a]">Distribution du volume mensuel des soumissions</p>
            </div>
            <span class="text-xs font-bold text-[#7F45FD] bg-[#7F45FD]/10 px-3 py-1 rounded-full shrink-0">
              Volume Mensuel
            </span>
          </div>

          <div v-if="!monthlyTrendData || monthlyTrendData.length === 0" class="py-12 text-center text-xs text-[#8a8a9a]">
            Aucune tendance mensuelle enregistrée.
          </div>

          <div v-else class="overflow-x-auto pb-2">
            <div class="h-48 flex items-end justify-between gap-2 pt-6 px-2 min-w-[500px] border-b border-[#e8e8f0] dark:border-[#1a1a2a]">
              <div
                v-for="item in monthlyTrendData"
                :key="item.mois"
                class="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
              >
                <!-- Info Bulle -->
                <span class="text-[10px] font-black text-[#7F45FD] opacity-0 group-hover:opacity-100 transition-opacity bg-[#7F45FD]/10 px-1.5 py-0.5 rounded">
                  {{ item.total }}
                </span>

                <!-- Barre -->
                <div class="w-full max-w-[36px] bg-gray-100 dark:bg-gray-800 rounded-t-lg overflow-hidden flex items-end h-full">
                  <div
                    class="w-full bg-[#7F45FD] rounded-t-lg transition-all duration-700 group-hover:brightness-110"
                    :style="{ height: getBarHeight(item.total) + '%' }"
                  ></div>
                </div>

                <!-- Libellé Mois -->
                <span class="text-[10px] font-semibold text-[#8a8a9a] tracking-tighter max-w-full">
                  {{ item.mois }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 5: Table des 10 Dernières Candidatures Entrantes -->
        <div class="bg-white dark:bg-[#11111e] rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a] shadow-sm overflow-hidden">
          <div class="p-5 border-b border-[#e8e8f0] dark:border-[#1a1a2a] flex items-center justify-between">
            <div>
              <h3 class="text-sm font-bold text-[#1a1a2a] dark:text-gray-200 uppercase tracking-wider">
                Dernières Candidatures Reçues
              </h3>
              <p class="text-xs text-[#8a8a9a]">Aperçu en temps réel des soumissions récentes</p>
            </div>
            <NuxtLink
              to="/candidatures/etude-dossier"
              class="text-xs font-bold text-[#7F45FD] hover:underline flex items-center gap-1"
            >
              <span>Voir tout</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </NuxtLink>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#f8f8fc] dark:bg-[#181828] text-[10px] font-bold uppercase tracking-wider text-[#8a8a9a] border-b border-[#e8e8f0] dark:border-[#1a1a2a] whitespace-nowrap">
                  <th class="p-3.5 pl-5">Candidat</th>
                  <th class="p-3.5">Filière / Niveau</th>
                  <th class="p-3.5">Statut Dossier</th>
                  <th class="p-3.5">Décision / Admission</th>
                  <th class="p-3.5">Date de dépôt</th>
                  <th class="p-3.5 pr-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#e8e8f0] dark:divide-[#1a1a2a] text-xs">
                <tr
                  v-for="cand in candidaturesRecent"
                  :key="cand.id"
                  class="hover:bg-[#f8f8fc]/50 dark:hover:bg-[#151525]/50 transition-colors"
                >
                  <td class="p-3.5 pl-5 font-bold text-[#1a1a2a] dark:text-gray-200 whitespace-nowrap">
                    {{ cand.prenom }} {{ cand.nom }}
                  </td>
                  <td class="p-3.5 text-[#8a8a9a] whitespace-nowrap">
                    <span class="font-semibold text-[#1a1a2a] dark:text-gray-300">{{ cand.filiere?.sigle || cand.filiere?.code || cand.filiere?.nom || '-' }}</span>
                    <span v-if="cand.niveau" class="text-[11px] block text-[#8a8a9a]">{{ cand.niveau?.libelle || cand.niveau?.nom }}</span>
                  </td>
                  <td class="p-3.5 whitespace-nowrap">
                    <span
                      class="px-2.5 py-1 rounded-full text-[10px] font-bold inline-block whitespace-nowrap"
                      :class="getStatutBadgeClass(cand)"
                    >
                      {{ getStatutLabel(cand) }}
                    </span>
                  </td>
                  <td class="p-3.5 whitespace-nowrap">
                    <span
                      v-if="cand.est_inscrit || cand.etudiant_id"
                      class="px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 inline-flex items-center gap-1.5 shadow-xs whitespace-nowrap"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                      <span>Inscrit(e)</span>
                      <span v-if="cand.etudiant?.matricule" class="opacity-80 font-mono text-[10px] font-bold">({{ cand.etudiant.matricule }})</span>
                    </span>
                    <span
                      v-else-if="cand.admission"
                      class="px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 inline-flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                      <span>Admis(e)</span>
                    </span>
                    <span
                      v-else-if="cand.motif && !cand.rectification_expected"
                      class="px-2.5 py-1 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 inline-flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                      <span>Refusé(e)</span>
                    </span>
                    <span
                      v-else
                      class="px-2.5 py-1 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 inline-flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"></span>
                      <span>En cours d'étude</span>
                    </span>
                  </td>
                  <td class="p-3.5 text-[#8a8a9a]">
                    {{ formatDate(cand.created_at || cand.soumis_le) }}
                  </td>
                  <td class="p-3.5 pr-5 text-right">
                    <NuxtLink
                      :to="(cand.est_inscrit || cand.etudiant_id) ? (cand.etudiant?.slug ? `/admin/liste-des-etudiants/${cand.etudiant.slug}/detail` : `/candidatures/${cand.slug || cand.id}`) : (cand.admission ? `/candidatures/inscription/${cand.slug || cand.id}` : `/candidatures/${cand.slug || cand.id}`)"
                      class="px-3 py-1.5 bg-[#7F45FD]/10 hover:bg-[#7F45FD] text-[#7F45FD] hover:text-white font-bold rounded-lg transition-colors text-[11px] inline-block whitespace-nowrap"
                    >
                      <span v-if="cand.est_inscrit || cand.etudiant_id">Fiche Étudiant</span>
                      <span v-else-if="cand.admission">Inscrire</span>
                      <span v-else>Examiner</span>
                    </NuxtLink>
                  </td>
                </tr>
                <tr v-if="!candidaturesRecent || candidaturesRecent.length === 0">
                  <td colspan="6" class="p-6 text-center text-xs text-[#8a8a9a]">
                    Aucune candidature récente trouvée.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCandidatureStore } from '~~/stores/candidature';
import { useAnneScolaireStore } from '~~/stores/annee-scolaire';
import { useFiliereStore } from '~~/stores/filiere';
import { useNiveauStore } from '~~/stores/niveau';

definePageMeta({
  // Protected globally by auth.global.js
});

const candidatureStore = useCandidatureStore();
const anneeScolaireStore = useAnneScolaireStore();
const filiereStore = useFiliereStore();
const niveauStore = useNiveauStore();

const filtres = ref({
  annee_scolaire_id: '',
  filiere_id: '',
  niveau_id: '',
  mode_formation: '',
  date_debut: '',
  date_fin: '',
});

const stats = computed(() => candidatureStore.dashboardStats);

const candidaturesRecent = computed(() => stats.value?.recentes || []);

const filieresDistribution = computed(() => {
  if (!stats.value?.filieres_summary) return [];
  const total = stats.value?.kpis?.total || stats.value?.kpis?.total_candidatures || 1;
  return stats.value.filieres_summary
    .filter((f) => (f.total || 0) > 0)
    .map((f) => ({
      id: f.id,
      nom: f.nom,
      sigle: f.code || f.nom,
      count: f.total,
      percentage: total > 0 ? Math.round((f.total / total) * 100) : 0,
    }));
});

const niveauxDistribution = computed(() => {
  if (!stats.value?.niveaux_summary) return [];
  const total = stats.value?.kpis?.total || stats.value?.kpis?.total_candidatures || 1;
  return stats.value.niveaux_summary
    .filter((n) => (n.total || 0) > 0)
    .map((n) => ({
      id: n.id,
      nom: n.libelle || n.code || n.nom,
      count: n.total,
      percentage: total > 0 ? Math.round((n.total / total) * 100) : 0,
    }));
});

const genreStats = computed(() => {
  const g = stats.value?.genre_distribution;
  return {
    masculinCount: g?.hommes?.count || 0,
    masculinPercent: g?.hommes?.percentage || 0,
    femininCount: g?.femmes?.count || 0,
    femininPercent: g?.femmes?.percentage || 0,
  };
});

const monthlyTrendData = computed(() => {
  if (!stats.value?.monthly_trend) return [];
  return stats.value.monthly_trend.map((m) => ({
    mois: m.month_name,
    total: m.count,
  }));
});

const hasActiveFilters = computed(() => {
  return (
    filtres.value.annee_scolaire_id !== '' ||
    filtres.value.filiere_id !== '' ||
    filtres.value.niveau_id !== '' ||
    filtres.value.mode_formation !== '' ||
    filtres.value.date_debut !== '' ||
    filtres.value.date_fin !== ''
  );
});

const calculatedTauxFrais = computed(() => {
  if (!stats.value?.kpis) return 0;
  const payes = stats.value.kpis.frais_payes || 0;
  const nonPayes = stats.value.kpis.frais_non_payes || 0;
  const total = payes + nonPayes;
  return total > 0 ? Math.round((payes / total) * 100) : 0;
});

const getBarHeight = (total) => {
  if (!monthlyTrendData.value || monthlyTrendData.value.length === 0) return 10;
  const max = Math.max(...monthlyTrendData.value.map((t) => t.total || 0));
  if (max === 0) return 10;
  const height = (total / max) * 100;
  return Math.max(height, 8); // au moins 8% de hauteur visuelle
};

const chargerDonnees = async () => {
  try {
    await candidatureStore.fetchDashboardStats(filtres.value);
  } catch (err) {
    console.error('Erreur chargement dashboard candidatures:', err);
  }
};

const reinitialiserFiltres = () => {
  filtres.value = {
    annee_scolaire_id: '',
    filiere_id: '',
    niveau_id: '',
    mode_formation: '',
    date_debut: '',
    date_fin: '',
  };
  chargerDonnees();
};

const getStatutLabel = (cand) => {
  if (cand.admission) return 'Admis';
  if (cand.motif && !cand.rectification_expected) return 'Rejeté';
  if (cand.rectification_expected) return 'A Rectifier';
  if (cand.dossier_valide) return 'Validé';
  if (cand.transmis_academie) return 'À l\'Académie';
  return 'En étude';
};

const getStatutBadgeClass = (cand) => {
  if (cand.admission) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400';
  if (cand.motif && !cand.rectification_expected) return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400';
  if (cand.rectification_expected) return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400';
  if (cand.dossier_valide) return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400';
  if (cand.transmis_academie) return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400';
  return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (e) {
    return dateStr;
  }
};

onMounted(async () => {
  await Promise.allSettled([
    anneeScolaireStore.fetchAnneeScolaire(),
    filiereStore.fetchFilieres(),
    niveauStore.fetchNiveaux(),
  ]);

  await chargerDonnees();
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
