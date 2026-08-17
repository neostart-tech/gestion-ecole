<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 p-4 md:p-8 transition-all duration-500 font-sans relative overflow-hidden">
    
    <!-- Décorations d'arrière-plan lumineuses -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/0 blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tl from-rose-500/15 to-amber-500/0 blur-3xl pointer-events-none"></div>

    <!-- Header & Action Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 relative z-10">
      <div class="space-y-1">
        <h1 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 tracking-tighter uppercase drop-shadow-sm">
          Diagnostic Financier
        </h1>
        <p class="text-slate-500 dark:text-gray-400 font-semibold text-sm flex items-center gap-2">
          <span class="w-2.5 h-2.5 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)] animate-pulse"></span>
          Détection d'anomalies entre la scolarité académique et le contrat financier
        </p>
      </div>

      <div class="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 dark:border-gray-700/50">
        <button 
          @click="loadDiagnostic" 
          class="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/20 dark:shadow-none transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          :disabled="loading"
        >
          <svg class="w-4 h-4" :class="{'animate-spin': loading}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <span>Actualiser l'audit</span>
        </button>
      </div>
    </div>

    <!-- Skeleton Loading State -->
    <div v-if="loading && !result" class="space-y-8 relative z-10 animate-pulse">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div v-for="i in 4" :key="i" class="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 p-5 h-28">
          <div class="h-3 bg-slate-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div class="h-7 bg-slate-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 p-6 h-96">
        <div class="h-6 bg-slate-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
        <div class="space-y-4">
          <div v-for="i in 5" :key="i" class="h-10 bg-slate-100 dark:bg-gray-700/50 rounded w-full"></div>
        </div>
      </div>
    </div>

    <!-- Data Loaded Content -->
    <div v-else-if="result" class="space-y-8 relative z-10">
      
      <!-- KPIs Overview (4 cartes stylisées) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        <!-- KPI 1 : Total Académique Attendu -->
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-gray-700 flex flex-col justify-between gap-2 hover:-translate-y-0.5 transition-transform duration-200 overflow-hidden shadow-sm min-w-0">
          <div class="absolute left-0 top-0 h-full w-1 bg-indigo-500 rounded-l-2xl"></div>
          <div class="flex items-center gap-2 min-w-0">
            <div class="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-lg flex-shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <span class="text-[10px] sm:text-[11px] font-black tracking-wider text-slate-400 dark:text-gray-500 uppercase leading-tight">Total Académique (Attendu)</span>
          </div>
          <p class="text-lg sm:text-xl lg:text-lg xl:text-xl 2xl:text-2xl font-black text-slate-800 dark:text-white tabular-nums tracking-tight leading-tight break-words" :title="formatMontant(result.total_sit)">
            {{ formatMontant(result.total_sit) }}
          </p>
          <!-- Subtitle removed for cleanliness -->
        </div>

        <!-- KPI 2 : Total Contrats Actuels -->
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-gray-700 flex flex-col justify-between gap-2 hover:-translate-y-0.5 transition-transform duration-200 overflow-hidden shadow-sm min-w-0">
          <div class="absolute left-0 top-0 h-full w-1 bg-emerald-500 rounded-l-2xl"></div>
          <div class="flex items-center gap-2 min-w-0">
            <div class="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-lg flex-shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="text-[10px] sm:text-[11px] font-black tracking-wider text-slate-400 dark:text-gray-500 uppercase leading-tight">Total Contrats (Facturé)</span>
          </div>
          <p class="text-lg sm:text-xl lg:text-lg xl:text-xl 2xl:text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight leading-tight break-words" :title="formatMontant(result.total_dash)">
            {{ formatMontant(result.total_dash) }}
          </p>
          <span class="text-[11px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full w-fit">Contrats enregistrés</span>
        </div>

        <!-- KPI 3 : Écart Financier Global -->
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-gray-700 flex flex-col justify-between gap-2 hover:-translate-y-0.5 transition-transform duration-200 overflow-hidden shadow-sm min-w-0">
          <div class="absolute left-0 top-0 h-full w-1" :class="result.ecart_total !== 0 ? 'bg-amber-500' : 'bg-slate-300'"></div>
          <div class="flex items-center gap-2 min-w-0">
            <div class="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-lg flex-shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="text-[10px] sm:text-[11px] font-black tracking-wider text-slate-400 dark:text-gray-500 uppercase leading-tight">Écart Financier Global</span>
          </div>
          <p class="text-lg sm:text-xl lg:text-lg xl:text-xl 2xl:text-2xl font-black tabular-nums tracking-tight leading-tight break-words" :class="result.ecart_total !== 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400'" :title="formatMontant(result.ecart_total)">
            {{ formatMontant(result.ecart_total) }}
          </p>
          <span class="text-[11px] font-bold text-slate-400 italic">Différence nette globale</span>
        </div>

        <!-- KPI 4 : Anomalies Détectées -->
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-gray-700 flex flex-col justify-between gap-2 hover:-translate-y-0.5 transition-transform duration-200 overflow-hidden shadow-sm min-w-0">
          <div class="absolute left-0 top-0 h-full w-1" :class="result.nb_differences > 0 ? 'bg-rose-500' : 'bg-emerald-500'"></div>
          <div class="flex items-center gap-2 min-w-0">
            <div class="p-2 rounded-lg flex-shrink-0" :class="result.nb_differences > 0 ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-500' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
            </div>
            <span class="text-[10px] sm:text-[11px] font-black tracking-wider uppercase leading-tight" :class="result.nb_differences > 0 ? 'text-rose-500' : 'text-emerald-500'">Anomalies Détectées</span>
          </div>
          <p class="text-lg sm:text-xl lg:text-lg xl:text-xl 2xl:text-2xl font-black tabular-nums tracking-tight leading-tight break-words" :class="result.nb_differences > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'">
            {{ result.nb_differences }} étudiant(s)
          </p>
          <span class="text-[11px] font-bold px-2 py-0.5 rounded-full w-fit" :class="result.nb_differences > 0 ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300'">
            {{ result.nb_differences > 0 ? 'À régulariser' : 'Aucune incohérence' }}
          </span>
        </div>
      </div>

      <!-- Filters & Toolbar Card -->
      <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 border border-white/50 dark:border-gray-700/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <!-- Recherche -->
        <div class="relative max-w-md w-full group">
          <input
            v-model="search"
            type="text"
            placeholder="Rechercher un étudiant, une classe..."
            class="w-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white dark:placeholder-gray-500 shadow-sm"
          />
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>

        <!-- Bulk Action Controls -->
        <div class="flex items-center gap-3">
          <button 
            v-if="selectedEtudiantIds.length > 0"
            @click="openBulkModeModal"
            class="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-black shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
            Changer le mode pour la sélection ({{ selectedEtudiantIds.length }})
          </button>
          <span v-else class="text-xs text-slate-400 font-medium hidden sm:inline-block">
            Sélectionnez des étudiants pour modifier leur mode de formation en masse.
          </span>
        </div>
      </div>

      <!-- Main Data Table Card -->
      <div class="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-xl transition-colors">
        
        <!-- Card Header -->
        <div class="px-6 py-5 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center bg-slate-50/50 dark:bg-gray-800/50">
          <div>
            <h3 class="text-base font-black text-slate-800 dark:text-white uppercase tracking-tight">Liste des incohérences à régulariser</h3>
            <p class="text-xs text-slate-400 font-semibold mt-0.5">Étudiants dont le contrat ne correspond pas à la scolarité théorique</p>
          </div>
          <span 
            class="px-3 py-1 rounded-full text-xs font-black tracking-wide"
            :class="result.nb_differences > 0 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'"
          >
            {{ result.nb_differences }} anomalie(s)
          </span>
        </div>
        
        <!-- Empty State -->
        <div v-if="result.nb_differences === 0" class="py-16 px-6 text-center text-slate-500 dark:text-gray-400 flex flex-col items-center justify-center">
          <div class="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-500 mb-4 shadow-inner">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-lg font-black text-slate-800 dark:text-white mb-1">Diagnostic Parfait !</p>
          <p class="text-sm text-slate-500 dark:text-gray-400 max-w-md">Aucune anomalie détectée entre les profils académiques des étudiants et leurs contrats financiers actuels.</p>
        </div>

        <!-- Table View -->
        <div v-else class="p-0">
          <vue3-datatable
            :key="tableKey"
            :rows="result.details"
            :columns="cols"
            :search="search"
            :sortable="true"
            :hasCheckbox="true"
            @rowSelect="onRowSelect"
            skin="bh-table-hover"
            class="w-full text-sm premium-table"
          >
            <!-- Custom Slot: Student Name -->
            <template #nom="data">
              <div class="flex items-center gap-3 py-1">
                <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-xs shadow-md flex-shrink-0">
                  {{ data.value.nom?.charAt(0) || 'E' }}
                </div>
                <div class="flex flex-col">
                  <span class="font-bold text-slate-800 dark:text-gray-200 leading-tight">{{ data.value.nom }}</span>
                  <span v-if="data.value.niveau" class="text-xs text-slate-400 font-medium mt-0.5">{{ data.value.niveau }}</span>
                </div>
              </div>
            </template>

            <!-- Custom Slot: Mode Formation -->
            <template #mode_formation="data">
              <div class="flex items-center py-1">
                <span 
                  class="px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 border shadow-sm whitespace-nowrap transition-colors"
                  :class="data.value.mode_formation === 'En ligne' 
                    ? 'bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/50'
                    : 'bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/50'"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  {{ data.value.mode_formation || 'Présentiel' }}
                </span>
              </div>
            </template>

            <!-- Custom Slot: Tarif Académique (SIT) -->
            <template #sit="data">
              <div class="text-right py-1">
                <span v-if="data.value.tarif_existant === false" class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs font-bold whitespace-nowrap">
                  <svg class="w-3.5 h-3.5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  Non paramétré
                </span>
                <span v-else class="font-bold text-slate-800 dark:text-gray-200 tabular-nums whitespace-nowrap">
                  {{ formatMontant(data.value.sit) }}
                </span>
              </div>
            </template>

            <!-- Custom Slot: Contrat Actuel (DASH) -->
            <template #dash="data">
              <div class="text-right font-semibold text-slate-600 dark:text-gray-300 tabular-nums whitespace-nowrap py-1">
                {{ formatMontant(data.value.dash) }}
              </div>
            </template>

            <!-- Custom Slot: Différence / Statut -->
            <template #diff="data">
              <div class="text-right py-1">
                <span v-if="data.value.tarif_existant === false" class="inline-block px-3 py-1 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 rounded-xl text-xs font-black whitespace-nowrap">
                  Grille manquante
                </span>
                <span v-else class="font-black text-rose-600 dark:text-rose-400 tabular-nums whitespace-nowrap">
                  {{ data.value.diff > 0 ? '+' : '' }}{{ formatMontant(data.value.diff) }}
                </span>
              </div>
            </template>

            <!-- Custom Slot: Actions -->
            <template #actions="data">
              <div class="text-center flex justify-center items-center gap-2 py-1">
                <!-- Bouton Changer Mode (Icon-only) -->
                <button 
                  @click="openChangeModeModal(data.value)" 
                  title="Changer le mode de formation"
                  class="w-8 h-8 flex-shrink-0 inline-flex items-center justify-center bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 dark:text-amber-300 rounded-xl transition-all border border-amber-200/80 dark:border-amber-500/30 shadow-sm transform hover:scale-105 active:scale-95"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                  </svg>
                </button>

                <!-- Bouton Paramétrer la grille (Icon-only si manquante) -->
                <NuxtLink 
                  v-if="data.value.tarif_existant === false"
                  to="/finance/configuration-tranche-de-paiement" 
                  title="Paramétrer la grille tarifaire"
                  class="w-8 h-8 flex-shrink-0 inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-500/20 transition-all transform hover:scale-105 active:scale-95"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                </NuxtLink>

                <!-- Bouton Régulariser (Icon-only) -->
                <NuxtLink 
                  v-else
                  :to="`/finance/recouvrement/${data.value.slug}`" 
                  title="Régulariser le dossier"
                  class="w-8 h-8 flex-shrink-0 inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl shadow-md shadow-indigo-500/20 transition-all transform hover:scale-105 active:scale-95"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </NuxtLink>
              </div>
            </template>
          </vue3-datatable>
        </div>
      </div>
    </div>

    <!-- Modal Changer Mode Individuel -->
    <div v-if="showModeModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md">
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-white/50 dark:border-gray-700 space-y-6 transform transition-all duration-300">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-gray-700/50 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
            </div>
            <div>
              <h3 class="text-base font-black text-slate-800 dark:text-white uppercase tracking-tight">Changement de Mode</h3>
              <p class="text-xs text-slate-500 dark:text-gray-400 font-medium">{{ selectedEtudiant?.nom }}</p>
            </div>
          </div>
          <button @click="showModeModal = false" class="p-2 text-slate-400 hover:text-rose-500 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="space-y-4">
          <p class="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
            Sélectionnez le nouveau mode de formation. Les tarifs et frais de scolarité seront <span class="font-bold text-indigo-600 dark:text-indigo-400">recalculés automatiquement</span> pour cet étudiant.
          </p>

          <div class="space-y-2">
            <label v-for="mode in modesDisponibles" :key="mode" 
              class="flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all"
              :class="selectedMode === mode 
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20' 
                : 'border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700/50 text-slate-700 dark:text-gray-300'"
            >
              <div class="flex items-center gap-3">
                <input type="radio" v-model="selectedMode" :value="mode" class="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                <span class="font-bold text-sm">{{ mode }}</span>
              </div>
              <span v-if="selectedEtudiant?.mode_formation === mode" class="text-xs font-semibold px-2 py-0.5 bg-slate-200 dark:bg-gray-700 text-slate-600 dark:text-gray-300 rounded-md">Actuel</span>
            </label>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-50 dark:border-gray-700/50">
          <button @click="showModeModal = false" class="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-slate-300 font-bold text-xs uppercase tracking-wider transition-all hover:bg-slate-200">
            Annuler
          </button>
          <button 
            @click="submitChangeMode" 
            :disabled="savingMode || selectedMode === selectedEtudiant?.mode_formation"
            class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="savingMode" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Enregistrer & Recalculer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Changer Mode en Masse -->
    <div v-if="showBulkModeModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md">
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-white/50 dark:border-gray-700 space-y-6 transform transition-all duration-300">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-gray-700/50 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
            </div>
            <div>
              <h3 class="text-base font-black text-slate-800 dark:text-white uppercase tracking-tight">Changement en Masse</h3>
              <p class="text-xs text-amber-600 dark:text-amber-400 font-bold">{{ selectedEtudiantIds.length }} étudiant(s) sélectionné(s)</p>
            </div>
          </div>
          <button @click="showBulkModeModal = false" class="p-2 text-slate-400 hover:text-rose-500 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="space-y-4">
          <p class="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
            Sélectionnez le mode de formation à appliquer aux <span class="font-bold text-indigo-600 dark:text-indigo-400">{{ selectedEtudiantIds.length }} étudiants</span>. Leurs frais seront automatiquement recalculés.
          </p>

          <div class="space-y-2">
            <label v-for="mode in modesDisponibles" :key="mode" 
              class="flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all"
              :class="selectedBulkMode === mode 
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20' 
                : 'border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700/50 text-slate-700 dark:text-gray-300'"
            >
              <div class="flex items-center gap-3">
                <input type="radio" v-model="selectedBulkMode" :value="mode" class="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                <span class="font-bold text-sm">{{ mode }}</span>
              </div>
            </label>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-50 dark:border-gray-700/50">
          <button @click="showBulkModeModal = false" class="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-slate-300 font-bold text-xs uppercase tracking-wider transition-all hover:bg-slate-200">
            Annuler
          </button>
          <button 
            @click="submitBulkChangeMode" 
            :disabled="savingBulkMode"
            class="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="savingBulkMode" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Appliquer à tous ({{ selectedEtudiantIds.length }})
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onActivated, computed, ref } from 'vue';
import { useNuxtApp } from '#app';
import { useDiagnosticFinancierStore } from '~~/stores/diagnosticFinancier';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import '@bhplugin/vue3-datatable/dist/style.css';

const cols = [
  { field: 'nom', title: 'Étudiant', minWidth: '220px' },
  { field: 'mode_formation', title: 'Mode Formation', minWidth: '150px' },
  { field: 'sit', title: 'Tarif Académique (Attendu)', minWidth: '180px', headerClass: 'justify-end' },
  { field: 'dash', title: 'Contrat Actuel (Facturé)', minWidth: '180px', headerClass: 'justify-end' },
  { field: 'diff', title: 'Écart / Statut', minWidth: '150px', headerClass: 'justify-end' },
  { field: 'actions', title: 'Actions', sort: false, minWidth: '100px', headerClass: 'justify-center' }
];

const search = ref('');
const tableKey = ref(0);

// Selection & Bulk State
const selectedEtudiants = ref([]);
const showBulkModeModal = ref(false);
const selectedBulkMode = ref('Présentiel');
const savingBulkMode = ref(false);

const selectedEtudiantIds = computed(() => {
  return (selectedEtudiants.value || []).map(e => e.id);
});

const onRowSelect = (rows) => {
  selectedEtudiants.value = rows || [];
};

// Modal & Quick Change State (Individuel)
const showModeModal = ref(false);
const selectedEtudiant = ref(null);
const selectedMode = ref('Présentiel');
const savingMode = ref(false);
const modesDisponibles = ['Présentiel', 'En ligne'];

const diagnosticStore = useDiagnosticFinancierStore();
const nuxtApp = useNuxtApp();

const notifySuccess = (message) => {
  if (nuxtApp.$toastr?.success) {
    nuxtApp.$toastr.success(message);
  } else if (nuxtApp.$toast?.success) {
    nuxtApp.$toast.success(message);
  }
};

const notifyError = (message) => {
  if (nuxtApp.$toastr?.error) {
    nuxtApp.$toastr.error(message);
  } else if (nuxtApp.$toast?.error) {
    nuxtApp.$toast.error(message);
  }
};

const loading = computed(() => diagnosticStore.loading);
const result = computed(() => diagnosticStore.result);

const loadDiagnostic = async () => {
  try {
    selectedEtudiants.value = [];
    await diagnosticStore.fetchDiagnostic();
    tableKey.value++;
  } catch (error) {
    console.error("Erreur chargement diagnostic:", error);
    notifyError("Erreur lors du chargement des anomalies du diagnostic.");
  }
};

const openChangeModeModal = (etudiant) => {
  selectedEtudiant.value = etudiant;
  selectedMode.value = etudiant.mode_formation || 'Présentiel';
  showModeModal.value = true;
};

const openBulkModeModal = () => {
  if (selectedEtudiantIds.value.length === 0) return;
  selectedBulkMode.value = 'Présentiel';
  showBulkModeModal.value = true;
};

const submitChangeMode = async () => {
  if (!selectedEtudiant.value) return;
  savingMode.value = true;
  try {
    const res = await diagnosticStore.changerModeFormation(
      selectedEtudiant.value.id,
      selectedMode.value
    );
    notifySuccess(res?.message || "Mode de formation mis à jour avec succès !");
    showModeModal.value = false;
    await loadDiagnostic();
  } catch (error) {
    console.error("Erreur lors de la modification du mode:", error);
    const msg = error.response?.data?.message || "Échec de la modification du mode.";
    notifyError(msg);
  } finally {
    savingMode.value = false;
  }
};

const submitBulkChangeMode = async () => {
  if (selectedEtudiantIds.value.length === 0) return;
  savingBulkMode.value = true;
  try {
    const res = await diagnosticStore.changerModeFormationMasse(
      selectedEtudiantIds.value,
      selectedBulkMode.value
    );
    notifySuccess(res?.message || "Modes de formation mis à jour en masse avec succès !");
    selectedEtudiants.value = [];
    showBulkModeModal.value = false;
    await loadDiagnostic();
  } catch (error) {
    console.error("Erreur lors de la modification en masse:", error);
    const msg = error.response?.data?.message || "Échec de la modification en masse.";
    notifyError(msg);
  } finally {
    savingBulkMode.value = false;
  }
};

const formatMontant = (m) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 })
    .format(m).replace('XOF', 'FCFA');

onMounted(() => {
  loadDiagnostic();
});

onActivated(() => {
  loadDiagnostic();
});
</script>

<style scoped>
.premium-table :deep(.bh-datatable table tbody tr) {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.15s ease;
}
.dark .premium-table :deep(.bh-datatable table tbody tr) {
  border-bottom-color: #1f2937;
  color: #e2e8f0;
}
.premium-table :deep(.bh-datatable table tbody tr:hover) {
  background-color: rgba(248, 250, 252, 0.8);
}
.dark .premium-table :deep(.bh-datatable table tbody tr:hover) {
  background-color: rgba(31, 41, 55, 0.4);
}
.premium-table :deep(.bh-datatable thead th) {
  background-color: transparent !important;
  color: #94a3b8 !important;
  font-weight: 700 !important;
  text-transform: uppercase;
  font-size: 0.65rem !important;
  letter-spacing: 0.05em;
  padding: 1rem !important;
  border-bottom: 1px solid #e2e8f0 !important;
}
.dark .premium-table :deep(.bh-datatable thead th) {
  color: #6b7280 !important;
  border-bottom-color: #374151 !important;
}
.premium-table :deep(.bh-datatable table td) {
  padding: 0.8rem 1rem;
}
</style>
