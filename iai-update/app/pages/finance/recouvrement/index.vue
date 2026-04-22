<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 p-4 md:p-8 transition-all duration-500 font-sans relative overflow-hidden">
    
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/0 blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tl from-emerald-500/10 to-teal-500/0 blur-3xl pointer-events-none"></div>

    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 relative z-10">
      <div class="space-y-1">
        <h1 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 tracking-tighter uppercase drop-shadow-sm">
          Suivi du Recouvrement
        </h1>
        <p class="text-slate-500 dark:text-gray-400 font-semibold text-sm flex items-center gap-2">
          <span class="w-2.5 h-2.5 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)] animate-pulse"></span>
          Pilotage financier global et grand livre
        </p>
      </div>
      <div class="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 dark:border-gray-700/50">
        <button @click="refreshAll" class="p-3 bg-gradient-to-b from-white to-slate-50 dark:from-gray-700 dark:to-gray-800 hover:from-slate-50 hover:to-slate-100 rounded-xl transition-all shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_4px_rgba(0,0,0,0.05)] border border-slate-200/60 dark:border-gray-600 text-slate-600 dark:text-gray-200">
          <svg class="w-5 h-5 drop-shadow-sm" :class="{'animate-spin': globalLoading}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>
      </div>
    </div>



    <div class="flex gap-6 border-b-2 border-slate-200 dark:border-gray-800 mb-8 overflow-x-auto no-scrollbar">
      <button @click="activeTab = 'dashboard'"
        :class="{'text-indigo-600 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400': activeTab === 'dashboard', 'text-slate-400 border-transparent hover:text-slate-600': activeTab !== 'dashboard'}"
        class="px-2 py-4 border-b-4 font-black uppercase text-sm tracking-wider whitespace-nowrap transition-colors">
        Tableaux de Bord
      </button>
      <button @click="activeTab = 'students'"
        :class="{'text-indigo-600 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400': activeTab === 'students', 'text-slate-400 border-transparent hover:text-slate-600': activeTab !== 'students'}"
        class="px-2 py-4 border-b-4 font-black uppercase text-sm tracking-wider whitespace-nowrap transition-colors">
        Liste Globale Étudiants
      </button>
    </div>

    <!-- TAB DASHBOARD -->
    <div v-if="activeTab === 'dashboard'" class="space-y-8 relative z-10 transition-all duration-300" :class="{'opacity-75 pointer-events-none': dashboardLoading}">
      
      <div v-if="dashboardLoading && !globalLoading" class="absolute inset-0 bg-white/20 dark:bg-slate-900/20 backdrop-blur-[1.5px] z-50 flex items-start justify-center rounded-3xl transition-all duration-300 pointer-events-auto" style="padding-top: 10%;">
        <div class="bg-white dark:bg-gray-800 px-6 py-4 rounded-full shadow-[0_10px_40px_-5px_rgba(79,70,229,0.3)] border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-3 animate-bounce">
          <svg class="w-5 h-5 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
             <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
             <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-xs font-black tracking-widest uppercase text-indigo-600 dark:text-indigo-400">Actualisation en cours...</span>
        </div>
      </div>

      <!-- Dashboard Skeleton -->
      <template v-if="globalLoading || !kpis">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div v-for="i in 8" :key="i" class="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 p-5 h-32 animate-pulse">
            <div class="h-4 bg-slate-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div class="h-8 bg-slate-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
            <div class="h-3 bg-slate-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-6">
          <div class="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 p-6 h-[400px] animate-pulse flex flex-col gap-6">
            <div class="h-6 bg-slate-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div class="h-10 bg-slate-200 dark:bg-gray-700 rounded w-full"></div>
            <div class="h-full bg-slate-100 dark:bg-gray-800/50 rounded w-full"></div>
          </div>
        </div>
      </template>

      <!-- Real Dashboard Content -->
      <template v-else>

      <!-- LIGNE 1 : KPIs Principaux (3 cartes) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <!-- KPI : Objectif Global -->
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-100 dark:border-gray-700 flex flex-col gap-2 hover:-translate-y-0.5 transition-transform duration-200 overflow-hidden shadow-sm">
          <div class="absolute left-0 top-0 h-full w-1 bg-indigo-500 rounded-l-2xl"></div>
          <div class="flex items-center gap-2">
            <div class="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-lg">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="text-[10px] font-black tracking-widest text-slate-400 dark:text-gray-500 uppercase">Objectif à collecter</span>
          </div>
          <p class="text-xl font-black text-slate-800 dark:text-white tabular-nums">{{ formatMontant(kpis.total_a_encaisser) }}</p>
          <span class="text-[11px] font-bold text-slate-400 italic">Total frais actifs pour l'année</span>
        </div>

        <!-- KPI : Total Encaissé -->
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-100 dark:border-gray-700 flex flex-col gap-2 hover:-translate-y-0.5 transition-transform duration-200 overflow-hidden shadow-sm">
          <div class="absolute left-0 top-0 h-full w-1 bg-emerald-500 rounded-l-2xl"></div>
          <div class="flex items-center gap-2">
            <div class="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-lg">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="text-[10px] font-black tracking-widest text-slate-400 dark:text-gray-500 uppercase">Total encaissé</span>
          </div>
          <p class="text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{{ formatMontant(kpis.total_encaisse) }}</p>
          <span class="text-[11px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded w-fit">{{ kpis.taux_collecte }}% réalisé</span>
        </div>

        <!-- KPI : Reste à collecter -->
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-100 dark:border-gray-700 flex flex-col gap-2 hover:-translate-y-0.5 transition-transform duration-200 overflow-hidden shadow-sm">
          <div class="absolute left-0 top-0 h-full w-1 bg-amber-500 rounded-l-2xl"></div>
          <div class="flex items-center gap-2">
            <div class="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-lg">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="text-[10px] font-black tracking-widest text-slate-400 dark:text-gray-500 uppercase">Reste à collecter</span>
          </div>
          <p class="text-xl font-black text-amber-600 dark:text-amber-400 tabular-nums">{{ formatMontant(kpis.total_restant) }}</p>
          <span class="text-[11px] font-bold text-slate-400 italic">Écart sur étudiants actifs</span>
        </div>

      </div>

      <!-- LIGNE 2 : Statistiques Abandons -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- CA Encaissé sur Abandons -->
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-100 dark:border-gray-700 flex flex-col gap-3 hover:-translate-y-0.5 transition-transform duration-200 overflow-hidden shadow-sm">
          <div class="absolute left-0 top-0 h-full w-1 bg-slate-400 rounded-l-2xl"></div>
          <div class="flex items-center gap-2">
            <div class="p-2 bg-slate-50 dark:bg-slate-700/50 text-slate-500 rounded-lg">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
              </svg>
            </div>
            <span class="text-[10px] font-black tracking-widest text-slate-500 dark:text-gray-400 uppercase">CA Récupéré — Abandons</span>
          </div>
          <!-- Détail Inscription / Scolarité -->
          <div class="space-y-2 mt-1">
            <div class="flex justify-between items-center">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Inscription</span>
              <span class="text-sm font-black text-slate-600 dark:text-gray-300 tabular-nums">{{ formatMontant(kpis.ca_abandons_resume?.inscription || 0) }}</span>
            </div>
            <div class="flex justify-between items-center border-b border-slate-100 dark:border-gray-700 pb-2">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Scolarité</span>
              <span class="text-sm font-black text-slate-600 dark:text-gray-300 tabular-nums">{{ formatMontant(kpis.ca_abandons_resume?.scolarite || 0) }}</span>
            </div>
            <div class="flex justify-between items-center pt-1">
              <span class="text-[11px] font-black text-slate-500 uppercase tracking-wider">Total encaissé</span>
              <span class="text-lg font-black text-slate-700 dark:text-gray-200 tabular-nums">{{ formatMontant(kpis.ca_abandons_resume?.total || 0) }}</span>
            </div>
          </div>
        </div>

        <!-- CA Non Récupéré sur Abandons (Perte sèche) -->
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-100 dark:border-gray-700 flex flex-col gap-3 hover:-translate-y-0.5 transition-transform duration-200 overflow-hidden shadow-sm">
          <div class="absolute left-0 top-0 h-full w-1 bg-rose-400 rounded-l-2xl"></div>
          <div class="flex items-center gap-2">
            <div class="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-lg">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
            </div>
            <span class="text-[10px] font-black tracking-widest text-rose-400 uppercase">CA Non Récupéré — Abandons</span>
          </div>
          <!-- Détail Inscription / Scolarité restantes -->
          <div class="space-y-2 mt-1">
            <div class="flex justify-between items-center">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Inscription non payée</span>
              <span class="text-sm font-black text-slate-600 dark:text-gray-300 tabular-nums">{{ formatMontant(kpis.ca_abandons_resume?.reste_inscription || 0) }}</span>
            </div>
            <div class="flex justify-between items-center border-b border-slate-100 dark:border-gray-700 pb-2">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Scolarité non payée</span>
              <span class="text-sm font-black text-slate-600 dark:text-gray-300 tabular-nums">{{ formatMontant(kpis.ca_abandons_resume?.reste_scolarite || 0) }}</span>
            </div>
            <div class="flex justify-between items-center pt-1">
              <span class="text-[11px] font-black text-rose-500 uppercase tracking-wider">Total non récupéré</span>
              <span class="text-lg font-black text-rose-600 dark:text-rose-400 tabular-nums">{{ formatMontant(kpis.ca_abandons_resume?.total_non_recupere || 0) }}</span>
            </div>
          </div>
        </div>

      </div>


      <!-- Recouvrement journalier -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 p-6">
        <div class="flex flex-col md:flex-row justify-between md:items-center mb-5 gap-3">
          <h2 class="text-base font-black text-slate-800 dark:text-white">Recouvrement sur une période donnée</h2>
          <div class="flex items-center gap-2">
            <label class="text-xs font-bold text-slate-400 uppercase">Date fin :</label>
            <input type="date" v-model="journalierDate" @change="loadJournalier"
              class="bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl py-2 px-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>
        <div class="overflow-x-auto" v-if="journalier">
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr class="border-b border-slate-100 dark:border-gray-700">
                <th class="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Niveau</th>
                <th v-for="date in journalier.dates" :key="date" class="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                  {{ formatDate(date) }}
                </th>
                <th class="py-3 px-4 text-xs font-bold text-indigo-500 uppercase tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in journalier.lignes" :key="row.niveau_id"
                class="border-b border-slate-50 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/40 transition-colors">
                <td class="py-3 px-4 font-semibold text-slate-700 dark:text-gray-300">{{ row.niveau_nom }}</td>
                <td v-for="date in journalier.dates" :key="date" class="py-3 px-4 text-slate-500 dark:text-gray-400 text-right tabular-nums">
                  {{ formatMontantShort(row.jours[date]) }}
                </td>
                <td class="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400 text-right tabular-nums">
                  {{ formatMontantShort(row.total_semaine) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="border-t border-slate-200 dark:border-gray-700">
                <td class="py-3 px-4 font-bold text-slate-800 dark:text-white">Total</td>
                <td v-for="date in journalier.dates" :key="date" class="py-3 px-4 font-bold text-slate-700 dark:text-gray-200 text-right tabular-nums">
                  {{ formatMontantShort(journalier.lignes.reduce((acc, r) => acc + Number(r.jours[date] || 0), 0)) }}
                </td>
                <td class="py-3 px-4 font-black text-indigo-600 dark:text-indigo-400 text-right tabular-nums">
                  {{ formatMontantShort(journalier.lignes.reduce((acc, r) => acc + Number(r.total_semaine || 0), 0)) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Suivi mensuel -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 p-6">
        <div class="flex flex-col md:flex-row justify-between md:items-start mb-5 gap-3">
          <div class="space-y-1">
            <h2 class="text-base font-black text-slate-800 dark:text-white uppercase tracking-tighter">Suivi du recouvrement mensuel</h2>
            <p class="text-xs font-semibold text-slate-400">Analyse détaillée par période(s)</p>
          </div>
          <div class="w-full md:w-[400px]">
            <Multiselect
              v-model="selectedPeriods"
              mode="tags"
              :options="monthOptions"
              placeholder="Sélectionner un ou plusieurs mois"
              class="premium-multiselect"
            />
          </div>
        </div>

        <div v-if="mensuel && mensuel.length > 0" class="space-y-10">
          <div v-for="(periodResult, idx) in formattedMensuel" :key="idx" class="space-y-4">
            <div v-if="formattedMensuel.length > 1" class="flex items-center gap-3">
              <span class="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-black uppercase">
                {{ periodResult.label }}
              </span>
              <div class="h-[1px] flex-1 bg-slate-100 dark:bg-gray-800"></div>
            </div>

            <div class="overflow-x-auto border border-slate-100 dark:border-gray-800 rounded-xl">
              <table class="w-full text-left border-collapse text-sm">
                <thead>
                  <tr class="bg-slate-50/50 dark:bg-gray-800/20">
                    <th class="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Niveau</th>
                    <th class="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Prévision</th>
                    <th class="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Recouvré</th>
                    <th class="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Taux</th>
                    <th class="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Reste</th>
                    <th class="py-3 px-4 text-xs font-bold text-emerald-500 uppercase tracking-wider text-right bg-emerald-50/30 dark:bg-emerald-900/10">Excédent</th>
                    <th class="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right border-l border-slate-100 dark:border-gray-700">Cumul RAR M-1</th>
                    <th class="py-3 px-4 text-xs font-bold text-indigo-500 uppercase tracking-wider text-right">Cumul RAR YTD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in periodResult.donnees" :key="row.niveau_nom"
                    class="border-b border-slate-50 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/40 transition-colors">
                    <td class="py-3 px-4 font-semibold text-slate-700 dark:text-gray-300">{{ row.niveau_nom }}</td>
                    <td class="py-3 px-4 text-slate-500 dark:text-gray-400 text-right tabular-nums">{{ formatMontantShort(row.prevision) }}</td>
                    <td class="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400 text-right tabular-nums">{{ formatMontantShort(row.montant_recouvre) }}</td>
                    <td class="py-3 px-4 text-right">
                      <span class="text-xs font-bold px-2 py-0.5 rounded-full" :class="row.taux_recouvre > 70 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'">
                        {{ row.taux_recouvre }}%
                      </span>
                    </td>
                    <td class="py-3 px-4 font-semibold text-red-500 text-right tabular-nums">{{ formatMontantShort(row.reste_a_recouvrer) }}</td>
                    <td class="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 text-right tabular-nums bg-emerald-50/30 dark:bg-emerald-900/10" :class="{'opacity-30': !row.excedent}">{{ row.excedent > 0 ? '+' + formatMontantShort(row.excedent) : '-' }}</td>
                    <td class="py-3 px-4 text-slate-400 dark:text-gray-500 text-right tabular-nums border-l border-slate-50 dark:border-gray-800">{{ formatMontantShort(row.cumul_rar_m1) }}</td>
                    <td class="py-3 px-4 font-semibold text-indigo-600 dark:text-indigo-400 text-right tabular-nums">{{ formatMontantShort(row.cumul_rar_ytd) }}</td>
                  </tr>
                </tbody>
                <tfoot class="bg-slate-50/30 dark:bg-gray-800/10">
                  <tr class="border-t border-slate-200 dark:border-gray-700">
                    <td class="py-3 px-4 font-bold text-slate-800 dark:text-white">TOTAL {{ periodResult.label }}</td>
                    <td class="py-3 px-4 font-bold text-right tabular-nums">{{ formatMontantShort(periodResult.donnees.reduce((s, r) => s + r.prevision, 0)) }}</td>
                    <td class="py-3 px-4 font-bold text-emerald-600 text-right tabular-nums">{{ formatMontantShort(periodResult.donnees.reduce((s, r) => s + r.montant_recouvre, 0)) }}</td>
                    <td class="py-3 px-4 font-bold text-right">
                      {{ periodResult.donnees.reduce((s, r) => s + r.prevision, 0) > 0
                        ? Math.round((periodResult.donnees.reduce((s, r) => s + r.montant_recouvre, 0) / periodResult.donnees.reduce((s, r) => s + r.prevision, 0)) * 100)
                        : 0 }}%
                    </td>
                    <td class="py-3 px-4 font-bold text-red-500 text-right tabular-nums">{{ formatMontantShort(periodResult.donnees.reduce((s, r) => s + r.reste_a_recouvrer, 0)) }}</td>
                    <td class="py-3 px-4 font-black text-emerald-600 text-right tabular-nums bg-emerald-50/50 dark:bg-emerald-900/20">+{{ formatMontantShort(periodResult.donnees.reduce((s, r) => s + (r.excedent || 0), 0)) }}</td>
                    <td class="py-3 px-4 font-semibold text-slate-400 text-right tabular-nums border-l border-slate-100">{{ formatMontantShort(periodResult.donnees.reduce((s, r) => s + r.cumul_rar_m1, 0)) }}</td>
                    <td class="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400 text-right tabular-nums">{{ formatMontantShort(periodResult.donnees.reduce((s, r) => s + r.cumul_rar_ytd, 0)) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        <div v-else class="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
          <svg class="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p class="font-medium">Sélectionnez une ou plusieurs périodes pour afficher le suivi</p>
        </div>
      </div>

      <!-- Liste des abandons -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 p-6 max-h-[460px] overflow-y-auto">
        <h2 class="text-base font-black text-slate-800 dark:text-white mb-5 text-center">Liste des abandons</h2>
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="border-b border-slate-100 dark:border-gray-700">
              <th class="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Nom & prénoms</th>
              <th class="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Niveau</th>
              <th class="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Filière</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="abandons.length === 0">
              <td colspan="3" class="py-8 text-center text-slate-400 font-medium">Aucun abandon déclaré.</td>
            </tr>
            <tr v-for="ab in abandons" :key="ab.id"
              class="border-b border-slate-50 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase">
                    {{ (ab.nom || '?').charAt(0) }}
                  </div>
                  <div class="flex flex-col">
                    <span class="font-semibold text-slate-700 dark:text-gray-300">{{ ab.nom }}</span>
                    <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wide">{{ ab.matricule }}</span>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4 text-slate-500 dark:text-gray-400 text-sm">{{ ab.niveau }}</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 bg-slate-50 dark:bg-gray-700 rounded-md text-xs font-mono text-slate-500 dark:text-gray-400 border border-slate-100 dark:border-gray-600">
                  {{ ab.filiere }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      </template>
    </div>

    <!-- TAB ÉTUDIANTS -->
    <div v-if="activeTab === 'students'" class="relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-6">

        <!-- Filtres -->
        <div class="lg:col-span-3 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-100 dark:border-gray-700 flex flex-wrap gap-4 items-end">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Recherche</label>
            <div class="relative">
              <input v-model="searchQuery" type="text" placeholder="Matricule, nom…"
                class="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
          <div class="w-48">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Niveau</label>
            <select v-model="filterNiveau"
              class="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl py-2.5 px-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer">
              <option value="">Tous les niveaux</option>
              <option v-for="n in niveaux" :key="n.id" :value="n.id">{{ n.libelle || n.nom }}</option>
            </select>
          </div>
          <div class="w-48">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Statut Scolarité</label>
            <select v-model="filterStatut"
              class="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl py-2.5 px-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer">
              <option value="">Tous</option>
              <option value="solde">Soldé</option>
              <option value="retard">Retard</option>
              <option value="en_cours">À jour</option>
              <option value="abandon">Abandon</option>
            </select>
          </div>
          <div class="w-48">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Statut Inscription</label>
            <select v-model="filterStatutInscription"
              class="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl py-2.5 px-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer">
              <option value="">Tous</option>
              <option value="solde">Soldé</option>
              <option value="non_paye">Non payé</option>
            </select>
          </div>
          <!-- Boutons Export supprimés -->
        </div>

        <!-- Encaissement global -->
        <div class="bg-indigo-600 dark:bg-indigo-700 rounded-2xl p-6 text-white flex flex-col justify-center gap-2">
          <p class="text-indigo-200 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
            </svg>
            Encaissement global
          </p>
          <p class="text-2xl font-black tabular-nums">{{ formatMontant(totalEncaisse) }}</p>
          <div class="inline-flex items-center gap-2 text-xs font-semibold bg-black/20 px-3 py-1.5 rounded-lg w-fit">
            <span class="w-2 h-2 bg-emerald-400 rounded-full"></span>
            Taux : {{ tauxGlobal }}%
          </div>
        </div>
      </div>

      <!-- Datatable et Skeleton -->
      <div class="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl overflow-hidden p-2">
        <!-- Skeleton Loading -->
        <div v-if="loading || globalLoading" class="p-6">
          <div class="space-y-4">
            <div v-for="i in 5" :key="i" class="flex gap-4">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
            </div>
          </div>
        </div>

        <!-- Table -->
        <Vue3Datatable
          v-else-if="students"
          :columns="columns"
          :rows="students"
          :search="searchQuery"
          skin="bh-table-striped"
          :rowClass="(row) => row.est_en_abandon ? 'opacity-50 grayscale dark:opacity-30' : ''"
          class="premium-table"
        >
          <template #etudiant="{ value }">
            <div class="flex items-center gap-3 py-1">
              <div class="w-8 h-8 flex-shrink-0 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase">
                {{ value.etudiant.charAt(0) }}
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-sm text-slate-800 dark:text-gray-200 leading-tight truncate max-w-[180px]" :title="value.etudiant">{{ value.etudiant }}</span>
                <span class="text-[10px] font-mono font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{{ value.matricule }}</span>
              </div>
            </div>
          </template>
          <template #niveau="{ value }">
             <div class="text-xs font-bold text-slate-600 dark:text-gray-300 uppercase tracking-tighter">
                {{ value.niveau }}
             </div>
          </template>
          <template #filiere="{ value }">
             <div class="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded inline-block truncate max-w-[140px]" :title="value.filiere">
                {{ value.filiere }}
             </div>
          </template>
          <template #statut="{ value }">
            <div class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border" :class="getStatusClass(value.statut)">
              {{ getStatusLabel(value.statut) }}
            </div>
          </template>
          <template #inscription_statut="{ value }">
            <div v-if="value.inscription_statut" class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all"
              :class="value.inscription_statut === 'solde' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-100'">
              {{ value.inscription_statut === 'solde' ? 'Inscr. Validée' : 'Inscr. Non Payée' }}
            </div>
            <div v-else class="text-[10px] text-slate-300 italic font-medium px-2.5 py-1">--</div>
          </template>
          <template #montant_paye="{ value }">
            <div class="flex flex-col">
              <span class="text-sm font-bold text-slate-800 dark:text-white tabular-nums">{{ formatMontant(value.montant_paye) }}</span>
              <span class="text-xs text-slate-400 mt-0.5 tabular-nums">/ {{ formatMontantShort(value.montant_du) }}</span>
            </div>
          </template>
          <template #reste="{ value }">
            <span :class="value.reste > 0 ? 'text-slate-800 dark:text-gray-100 font-bold' : 'text-slate-400'" class="text-sm tabular-nums">
              {{ value.reste > 0 ? formatMontant(value.reste) : 'Soldé' }}
            </span>
          </template>
          <template #prochaine_echeance_date="{ value }">
            <div class="flex flex-col py-1">
              <span class="text-xs font-medium text-slate-700 dark:text-gray-300">{{ value.prochaine_echeance_date }}</span>
              <span class="text-xs text-slate-400 mt-0.5 tabular-nums">{{ formatMontant(value.prochaine_echeance_montant) }}</span>
            </div>
          </template>
          <template #action="{ value }">
            <button @click="openManagePaiement(value)"
              class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 text-xs font-semibold transition-colors py-1.5 px-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center gap-1">
              Ouvrir
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </template>
        </Vue3Datatable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useNuxtApp } from '#app';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import '@bhplugin/vue3-datatable/dist/style.css';
import Multiselect from '@vueform/multiselect';
import '@vueform/multiselect/themes/default.css';
import { useRecouvrementStore } from '~~/stores/recouvrement';

const { $swal } = useNuxtApp();
const route = useRoute();
const recouvrementStore = useRecouvrementStore();

const activeTab = ref(route.query.tab || 'dashboard');
const searchQuery = ref('');
const filterNiveau = ref('');
const filterStatut = ref(route.query.statut || '');
const filterStatutInscription = ref('');
const journalierDate = ref(new Date().toISOString().split('T')[0]);
const currentYear = new Date().getFullYear();
const selectedPeriods = ref([`${currentYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}`]);
const dashboardLoading = ref(false);
const globalLoading = ref(true);
const isExporting = ref(false);

// Export Excel via l'API (téléchargement direct avec token)
const exportExcel = async () => {
  isExporting.value = true;
  try {
    const token = localStorage.getItem('gest-ecole-token');
    const params = new URLSearchParams();
    if (filterNiveau.value) params.append('niveau_id', filterNiveau.value);
    const url = `/finance/export/xlsx?${params.toString()}`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    });
    if (!response.ok) throw new Error('Erreur export');
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `etat_paiements_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (e) {
    console.error('Export Excel échoué:', e);
    alert('Erreur lors de l\'export Excel. Veuillez réessayer.');
  } finally {
    isExporting.value = false;
  }
};

// Impression PDF via le navigateur
const printPDF = () => {
  window.print();
};

const monthOptions = computed(() => {
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const options = [];
  // Proposer l'année courante et la précédente
  [currentYear, currentYear - 1].forEach(year => {
    months.forEach((m, i) => {
      const value = `${year}-${String(i + 1).padStart(2, '0')}`;
      options.push({ value, label: `${m} ${year}` });
    });
  });
  return options;
});

const columns = [
  { field: 'etudiant', title: 'Étudiant', width: '240px', sort: true },
  { field: 'niveau', title: 'Niveau', width: '100px', sort: true },
  { field: 'filiere', title: 'Filière', width: '130px', sort: true },
  { field: 'montant_du', title: 'Total dû', visible: false },
  { field: 'montant_paye', title: 'Scol. Payée' },
  { field: 'reste', title: 'Scol. Reste' },
  { field: 'statut', title: 'Statut Scol.' },
  { field: 'inscription_statut', title: 'Statut Inscr.' },
  { field: 'prochaine_echeance_date', title: 'Prochain paiement' },
  { field: 'action', title: 'Actions', width: '120px', sort: false }
];

const loadJournalier = async () => {
  dashboardLoading.value = true;
  await recouvrementStore.fetchRecouvrementJournalier(journalierDate.value);
  dashboardLoading.value = false;
};

const loadMensuel = async () => {
  if (!selectedPeriods.value || selectedPeriods.value.length === 0) {
    recouvrementStore.mensuel = [];
    return;
  }
  
  dashboardLoading.value = true;
  
  const points = selectedPeriods.value.map(p => {
    const [year, month] = p.split('-');
    return { mois: month, annee: year };
  });

  const moisStr = points.map(p => p.mois).join(',');
  const anneeStr = points.map(p => p.annee).join(',');
  
  await recouvrementStore.fetchSuiviMensuel(moisStr, anneeStr);
  dashboardLoading.value = false;
};

const formattedMensuel = computed(() => {
  if (!mensuel.value) return [];
  
  // Si c'est un tableau de périodes (nouveau format)
  if (Array.isArray(mensuel.value) && mensuel.value.length > 0 && mensuel.value[0].periode) {
    return mensuel.value.map(p => {
      const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
      ];
      return {
        label: `${monthNames[p.periode.mois - 1]} ${p.periode.annee}`,
        donnees: p.donnees
      };
    });
  }
  
  // Cas rétrocompatible ou un seul mois
  const [year, month] = selectedPeriods.value[0]?.split('-') || [];
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  return [{
    label: month ? `${monthNames[parseInt(month) - 1]} ${year}` : 'Période',
    donnees: mensuel.value
  }];
});

const refreshAll = async () => {
  globalLoading.value = true;
  await Promise.all([
    recouvrementStore.fetchDashboardKPIs(),
    loadJournalier(),
    loadMensuel(),
    recouvrementStore.fetchAbandons(),
    recouvrementStore.fetchNiveaux(),
    recouvrementStore.fetchRecouvrements(filterNiveau.value, filterStatut.value, filterStatutInscription.value)
  ]);
  globalLoading.value = false;
};

const loading = computed(() => recouvrementStore.loading);
const students = computed(() => recouvrementStore.students);
const niveaux = computed(() => recouvrementStore.niveaux);
const totalEncaisse = computed(() => recouvrementStore.totalEncaisse);
const tauxGlobal = computed(() => recouvrementStore.tauxGlobal);
const journalier = computed(() => recouvrementStore.journalier);
const mensuel = computed(() => recouvrementStore.mensuel);
const abandons = computed(() => recouvrementStore.abandons);
const kpis = computed(() => recouvrementStore.kpis);

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const formatMontant = (m) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 })
    .format(m).replace('XOF', 'FCFA');

const formatMontantShort = (m) => {
  if (!m) return '0';
  return new Intl.NumberFormat('fr-FR').format(m);
};

const getStatusLabel = (status) => ({
  solde: 'Scolarité soldée',
  retard: 'Retard',
  avance: 'Payé en avance',
  en_cours: 'À jour',
  abandon: 'Abandon'
})[status] || status;

const getStatusClass = (status) => ({
  solde: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30',
  retard: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-100 dark:border-red-800/30',
  avance: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/30',
  en_cours: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-800/30',
  abandon: 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-gray-700'
})[status] || '';

const openManagePaiement = (student) => {
  navigateTo(`/finance/recouvrement/${student.slug}`);
};

onMounted(() => refreshAll());

watch([filterNiveau, filterStatut, filterStatutInscription], () => {
  recouvrementStore.fetchRecouvrements(filterNiveau.value, filterStatut.value, filterStatutInscription.value);
});

watch(selectedPeriods, async (newVal) => {
  if (!newVal) return;
  // Cloner et trier chronologiquement le tableau de mois sélectionné
  const sorted = [...newVal].sort();
  
  // Si le tableau n'est pas trié, on le met à jour et on s'arrête là
  // (Le "watch" se déclenchera à nouveau sur la valeur corrigée)
  if (JSON.stringify(newVal) !== JSON.stringify(sorted)) {
    selectedPeriods.value = sorted;
    return;
  }
  
  // Si le tableau est proprement trié, on charge les données !
  await loadMensuel();
}, { deep: true });
</script>

<style scoped>
.premium-table :deep(.bh-datatable table tbody tr) {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.15s ease;
}
.dark .premium-table :deep(.bh-datatable table tbody tr) {
  border-bottom-color: #1f2937;
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
  box-shadow: none !important;
}
.dark .premium-table :deep(.bh-datatable thead th) {
  color: #6b7280 !important;
  border-bottom-color: #374151 !important;
}
.premium-table :deep(.bh-datatable table td) {
  padding: 0.6rem 1rem;
}
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.premium-multiselect {
  --ms-ring-color: #6366f1;
  --ms-border-color: #e2e8f0;
  --ms-radius: 0.75rem;
  --ms-bg: #f8fafc;
  --ms-tag-bg: #6366f1;
  --ms-tag-color: #ffffff;
}

.dark .premium-multiselect {
  --ms-bg: #111827;
  --ms-border-color: #374151;
  --ms-option-bg-selected: #4f46e5;
  --ms-option-color-selected: #ffffff;
  --ms-ring-color: #4f46e5;
}
/* ===== IMPRESSION PDF ===== */
@media print {
  /* Masquer tout sauf la table des étudiants */
  .no-print,
  nav, header, footer,
  button,
  [class*="backdrop"],
  [class*="bg-gradient"] > div:first-child,
  [class*="bg-gradient"] > div:nth-child(2) {
    display: none !important;
  }

  /* Fond blanc pour l'impression */
  body, .min-h-screen {
    background: white !important;
    color: black !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Table propre */
  table {
    width: 100% !important;
    border-collapse: collapse !important;
    font-size: 10px !important;
  }

  th, td {
    border: 1px solid #ccc !important;
    padding: 4px 6px !important;
    color: black !important;
    background: white !important;
  }

  th {
    background: #f0f0f0 !important;
    font-weight: bold !important;
  }

  /* Forcer affichage complet des montants — pas d'abréviation */
  .tabular-nums {
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  /* Masquer colonnes inutiles à l'impression */
  .bh-datatable td:last-child,
  .bh-datatable th:last-child {
    display: none !important;
  }

  /* Afficher uniquement l'onglet étudiants */
  [v-if="activeTab === 'dashboard'"] {
    display: none !important;
  }

  /* Titre d'impression */
  .print-title {
    display: block !important;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 12px;
  }
}

/* Cacher le titre print en mode normal */
.print-title {
  display: none;
}
</style>