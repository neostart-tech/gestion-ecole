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




    <div class="space-y-8 relative z-10 transition-all duration-300" :class="{'opacity-75 pointer-events-none': dashboardLoading}">
      
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


      </template>
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

const journalierDate = ref(new Date().toISOString().split('T')[0]);
const currentYear = new Date().getFullYear();
const selectedPeriods = ref([`${currentYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}`]);
const dashboardLoading = ref(false);
const globalLoading = ref(true);



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
    recouvrementStore.fetchNiveaux()
  ]);
  globalLoading.value = false;
};

const niveaux = computed(() => recouvrementStore.niveaux);
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

onMounted(() => refreshAll());

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