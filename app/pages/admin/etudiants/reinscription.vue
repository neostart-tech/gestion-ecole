<template>
  <div class="min-h-screen bg-[#f3f3f8] dark:bg-[#08080f] font-sans transition-colors duration-500 relative">
    
    <!-- Fond d'ambiance violet -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#7F45FD]/15 dark:bg-[#7F45FD]/25 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
      <div class="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#7F45FD]/15 dark:bg-[#7F45FD]/25 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3Lm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjN0Y0NUZEIiBmaWxsLW9wYWNpdHk9IjAuMDgiPjxwYXRoIGQ9Ik0zNiAzNHYtNGgxdjRoLTF6bTAgM3YtMWgxdjFoLTF6bTAgNHYtMWgxdjFoLTF6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
    </div>

    <div class="relative z-10 w-full p-4 sm:p-6 lg:p-8">

      <!-- Navigation Breadcrumb -->
      <Breadcrumb
        :items="[
          { label: 'Administration', to: '/' },
          { label: 'Étudiants', to: '/admin/etudiants' },
          { label: 'Réinscription', to: null },
        ]"
        title="Réinscription & Promotion"
        :title-class="'text-xl md:text-2xl text-gray-800 dark:text-gray-100 font-bold'"
        :spacing="'mb-3'"
        :link-color="'text-[#7F45FD] dark:text-[#a882ff] hover:text-[#6a35e8] dark:hover:text-[#c4a9ff]'"
        :active-color="'text-gray-900 dark:text-gray-100 font-medium'"
        :text-size="'text-base'"
        align="left"
      />

      <!-- Carte Principale : En-tête + Sélecteur Étudiant -->
      <div class="mt-4 bg-white dark:bg-[#11111e] border border-[#e8e8f0] dark:border-[#1a1a2a] rounded-2xl shadow-[0_8px_30px_rgba(127,69,253,0.04)] overflow-hidden transition-all duration-300">

        <!-- En-tête de la Console -->
        <div class="flex items-center gap-3 p-5 lg:p-6 border-b border-[#e8e8f0] dark:border-[#1a1a2a]">
          <div class="w-1.5 h-8 bg-[#7F45FD] rounded-full shrink-0"></div>
          <div>
            <h1 class="text-2xl font-black text-[#1a1a2a] dark:text-[#fafafe] tracking-tight">Réinscription & Promotion des Étudiants</h1>
            <p class="text-sm text-[#8a8a9a] font-medium">Recherchez un étudiant pour configurer sa réinscription, son niveau cible, sa filière ou reconduire sa bourse.</p>
          </div>
        </div>

        <!-- Section de Sélection de l'étudiant -->
        <div class="p-6 lg:p-8 bg-[#fafafe]/50 dark:bg-[#0d0d16]/50">
          <div class="max-w-2xl">
            <label class="block text-xs font-black uppercase tracking-wider text-[#8a8a9a] mb-2 flex items-center gap-2">
              <svg class="w-4 h-4 text-[#7F45FD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Sélectionner un étudiant à réinscrire
            </label>

            <Select 
              v-model="selectedEtudiantToPromote" 
              :options="studentsList" 
              filter 
              optionLabel="nomComplet" 
              placeholder="Rechercher par nom, prénom ou matricule..." 
              class="w-full prime-select-enroll shadow-sm"
              @change="onEtudiantSelected"
            >
              <template #option="slotProps">
                <div class="flex items-center gap-3.5 py-1.5 px-1">
                  <div class="w-9 h-9 rounded-xl bg-[#7F45FD]/10 text-[#7F45FD] flex items-center justify-center font-black text-xs shrink-0 border border-[#7F45FD]/20">
                    {{ slotProps.option.nom?.charAt(0) }}{{ slotProps.option.prenom?.charAt(0) }}
                  </div>
                  <div class="flex flex-col min-w-0">
                    <span class="font-bold text-sm text-[#1a1a2a] dark:text-white truncate">{{ slotProps.option.nom }} {{ slotProps.option.prenom }}</span>
                    <span class="text-xs text-[#8a8a9a] font-mono mt-0.5">{{ slotProps.option.matricule || 'Sans matricule' }}</span>
                  </div>
                </div>
              </template>
            </Select>
            <p class="text-xs text-[#8a8a9a] mt-2 font-medium">Tapez le nom ou le matricule pour filtrer instantanément la liste des étudiants.</p>
          </div>
        </div>

      </div>

      <!-- Interface Intégrée si un Étudiant est Sélectionné -->
      <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0">
        <div v-if="selectedEtudiantToPromote" class="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Colonne Gauche (7 cols) : Infos Étudiant, Relevé Financier & GRAND RÉSUMÉ SYNTHÉTIQUE -->
          <div class="lg:col-span-7 space-y-6">
            
            <!-- Carte En-tête Profil Étudiant -->
            <div class="bg-white dark:bg-[#11111e] border border-[#e8e8f0] dark:border-[#1a1a2a] rounded-2xl p-6 shadow-sm">
              <div class="flex items-center gap-5">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7F45FD] to-[#5b21d6] flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-[#7F45FD]/25 shrink-0">
                  {{ selectedEtudiantToPromote.nom?.charAt(0) }}
                </div>
                <div class="space-y-1 min-w-0 flex-1">
                  <div class="flex items-center gap-3 flex-wrap">
                    <h2 class="text-xl font-black text-[#1a1a2a] dark:text-[#fafafe] tracking-tight">
                      {{ selectedEtudiantToPromote.nom }} {{ selectedEtudiantToPromote.prenom }}
                    </h2>
                    <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#7F45FD]/10 text-[#7F45FD] border border-[#7F45FD]/20">
                      {{ selectedEtudiantToPromote.matricule || 'Sans matricule' }}
                    </span>
                  </div>
                  
                  <div class="flex flex-wrap items-center gap-2 pt-1">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                      Niveau actuel : <strong class="text-gray-900 dark:text-white">{{ currentNiveauObj?.nom || currentNiveauObj?.libelle || 'N/A' }}</strong>
                    </span>
                    <span v-if="selectedEtudiantToPromote.dernier_groupe?.filiere" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
                      Filière : {{ selectedEtudiantToPromote.dernier_groupe?.filiere?.nom }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section Relevé Financier Année Actuelle -->
            <div class="bg-white dark:bg-[#11111e] border border-[#e8e8f0] dark:border-[#1a1a2a] rounded-2xl p-6 shadow-sm">
              <h3 class="text-xs font-black text-[#8a8a9a] uppercase tracking-wider mb-5 flex items-center gap-2">
                <svg class="w-4 h-4 text-[#7F45FD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Situation Financière & Scolarité (Année Actuelle)
              </h3>

              <div v-if="isLoadingFinances" class="flex justify-center items-center py-10">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7F45FD]"></div>
                <span class="ml-3 text-sm font-semibold text-[#8a8a9a]">Chargement des données financières...</span>
              </div>

              <div v-else>
                <!-- Cartes Récapitulatives -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div class="bg-[#fafafe] dark:bg-[#0d0d16] rounded-xl p-4 border border-[#e8e8f0] dark:border-[#1a1a2a]">
                    <p class="text-[11px] font-bold text-[#8a8a9a] uppercase tracking-wider mb-1">Total Dû (N)</p>
                    <p class="text-xl font-black text-[#1a1a2a] dark:text-white">{{ formatMontant(getMontantTotalDu(situationFinanciere)) }}</p>
                  </div>

                  <div class="bg-emerald-500/5 dark:bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
                    <p class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Total Réglé (N)</p>
                    <p class="text-xl font-black text-emerald-600 dark:text-emerald-400">{{ formatMontant(calculerTotalPaye(situationFinanciere)) }}</p>
                  </div>

                  <div class="bg-amber-500/5 dark:bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
                    <p class="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Arriérés / Reste (N)</p>
                    <p class="text-xl font-black text-amber-600 dark:text-amber-400">{{ formatMontant(resteAPayerAnneeCourante) }}</p>
                  </div>
                </div>

                <!-- Progression -->
                <div v-if="situationFinanciere" class="mb-6 p-4 rounded-xl bg-[#fafafe] dark:bg-[#0d0d16] border border-[#e8e8f0] dark:border-[#1a1a2a]">
                  <div class="flex items-center justify-between text-xs mb-2">
                    <span class="font-bold text-[#8a8a9a]">Progression des versements</span>
                    <span class="font-black text-sm" :class="calculateProgression(situationFinanciere) >= 100 ? 'text-emerald-600' : 'text-[#7F45FD]'">
                      {{ calculateProgression(situationFinanciere) }}%
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div 
                      class="h-2 rounded-full transition-all duration-700 ease-out" 
                      :class="calculateProgression(situationFinanciere) >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-[#7F45FD] to-[#a882ff]'" 
                      :style="{ width: `${calculateProgression(situationFinanciere)}%` }"
                    ></div>
                  </div>
                </div>

                <!-- Échéancier compact -->
                <div v-if="getEcheancesDetails(situationFinanciere).length > 0">
                  <p class="text-[11px] font-black text-[#8a8a9a] uppercase tracking-wider mb-2.5">Échéancier</p>
                  <div class="space-y-2">
                    <div 
                      v-for="(ech, idx) in getEcheancesDetails(situationFinanciere)" 
                      :key="idx" 
                      class="flex items-center justify-between p-3 rounded-xl bg-[#fafafe] dark:bg-[#0d0d16] border border-[#e8e8f0] dark:border-[#1a1a2a]"
                    >
                      <div class="flex items-center gap-3">
                        <div 
                          :class="ech.reste <= 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'" 
                          class="w-7 h-7 rounded-lg flex items-center justify-center font-bold"
                        >
                          <svg v-if="ech.reste <= 0" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <div>
                          <p class="text-xs font-bold text-[#1a1a2a] dark:text-white leading-tight">{{ ech.libelle }}</p>
                          <p class="text-[10px] text-[#8a8a9a] font-medium">Limite : {{ ech.date_limite_formatted }}</p>
                        </div>
                      </div>

                      <div class="text-right">
                        <p class="text-xs font-black text-[#1a1a2a] dark:text-[#fafafe]">{{ ech.montant_formatted }}</p>
                        <p class="text-[10px] font-bold" :class="ech.reste <= 0 ? 'text-emerald-500' : 'text-amber-500'">
                          Reste : {{ ech.reste_formatted }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="bg-[#fafafe] dark:bg-[#0d0d16] rounded-xl p-6 text-center border border-dashed border-[#e8e8f0] dark:border-[#1a1a2a]">
                  <p class="text-xs font-bold text-[#8a8a9a]">Aucun échéancier enregistré pour cet étudiant</p>
                </div>
              </div>
            </div>

            <!-- GRAND RÉSUMÉ SYNTHÉTIQUE & TOTAL FACTORISÉ + ARRIÉRÉS -->
            <div class="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-[#161626] via-[#121220] to-[#0a0a14] text-white border border-[#7F45FD]/40 shadow-2xl space-y-5">
              
              <!-- En-tête de la Fiche Synthèse -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7F45FD] to-[#6025e6] flex items-center justify-center text-white font-black shadow-lg shadow-[#7F45FD]/30 shrink-0">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-sm sm:text-base font-black text-white uppercase tracking-wider">Résumé Synthétique & Bilan Financier</h3>
                    <p class="text-xs text-purple-200/70 font-medium">Bilan complet factorisé de la réinscription et des arriérés d'impayés</p>
                  </div>
                </div>
                
                <span class="self-start sm:self-auto text-[11px] font-black px-3 py-1 rounded-full bg-[#7F45FD]/30 text-purple-300 border border-[#7F45FD]/50 uppercase tracking-wider">
                  {{ decisionType }}
                </span>
              </div>

              <!-- Identité Académique & Destination -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 p-3.5 sm:p-4 rounded-xl border border-white/10">
                <div>
                  <span class="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Année Scolaire</span>
                  <span class="font-black text-purple-300 text-xs sm:text-sm mt-0.5 block truncate">{{ selectedAnneeScolaireLabel }}</span>
                </div>
                <div>
                  <span class="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Niveau Cible</span>
                  <span class="font-black text-white text-xs sm:text-sm mt-0.5 block truncate">{{ targetNiveauObj?.libelle || targetNiveauObj?.nom || 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Filière / Groupe</span>
                  <span class="font-bold text-white text-xs mt-0.5 block truncate">{{ selectedFiliereObj?.code || selectedFiliereObj?.nom || 'Générale' }} - {{ selectedGroupObj?.nom || 'Non affecté' }}</span>
                </div>
                <div>
                  <span class="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Mode de Formation</span>
                  <span class="font-black text-emerald-400 text-xs mt-0.5 block truncate">{{ selectedModeFormation }}</span>
                </div>
              </div>

              <!-- Detail Financier Factorisé -->
              <div class="space-y-2.5 text-xs sm:text-sm bg-black/30 p-3.5 sm:p-4 rounded-xl border border-white/5">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-gray-300">
                  <span class="font-medium">Frais d'inscription / réinscription :</span>
                  <span class="font-mono font-bold text-sm sm:text-base" :class="payerFraisInscription ? 'text-emerald-400' : 'text-gray-400 line-through'">
                    {{ payerFraisInscription ? formatMontant(montantFraisInscriptionInput) : '0 FCFA (Non réglé)' }}
                  </span>
                </div>

                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-gray-300">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="font-medium">Scolarité théorique brute :</span>
                    <span v-if="isFraisFromDifferentYear" class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Report {{ matchedFraisAnneeNom }}
                    </span>
                  </div>
                  <span class="font-mono font-bold text-sm sm:text-base">
                    {{ configuredFraisScolarite !== null ? formatMontant(configuredFraisScolarite) : '0 FCFA (Non configurée)' }}
                  </span>
                </div>

                <div v-if="bourseReductionAmount > 0" class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-emerald-400">
                  <span class="font-medium">Réduction Bourse appliquée :</span>
                  <span class="font-mono font-bold text-sm sm:text-base">- {{ formatMontant(bourseReductionAmount) }}</span>
                </div>

                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-purple-200 pt-2 border-t border-white/10">
                  <span class="font-bold">Scolarité Nette Due (Après bourse) :</span>
                  <span class="font-mono font-black text-sm sm:text-base text-purple-300">
                    {{ formatMontant(calculatedNetScolarite) }}
                  </span>
                </div>

                <!-- Arriérés s'il y en a -->
                <div v-if="resteAPayerAnneeCourante > 0" class="pt-2 border-t border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-amber-400">
                  <span class="font-bold flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    Arriérés d'impayés (Année précédente / courante) :
                  </span>
                  <span class="font-mono font-black text-sm sm:text-base">+ {{ formatMontant(resteAPayerAnneeCourante) }}</span>
                </div>

                <!-- Réorientation : Déjà versé & Avoir éventuel -->
                <div v-if="decisionType === 'reorientation' && totalDejaPayeCurrentYear > 0" class="pt-2 border-t border-blue-500/30 space-y-1.5">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-blue-200">
                    <span class="font-medium">Versements déjà effectués cette année :</span>
                    <span class="font-mono font-bold text-sm sm:text-base text-emerald-400">- {{ formatMontant(totalDejaPayeCurrentYear) }}</span>
                  </div>

                  <div v-if="netBalanceReorientation < 0" class="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-emerald-300">
                    <span class="font-bold text-xs flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                      Avoir disponible (Trop-perçu en faveur de l'étudiant) :
                    </span>
                    <span class="font-mono font-black text-base text-emerald-300">+ {{ formatMontant(Math.abs(netBalanceReorientation)) }}</span>
                  </div>
                </div>
              </div>

              <!-- TOTAL GÉNÉRAL À RECOUVRER (Arriérés + Nouveau Cycle) -->
              <div class="relative overflow-hidden p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#7F45FD]/30 via-indigo-600/20 to-[#7F45FD]/25 border-2 border-[#7F45FD]/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                    <p class="text-xs font-black uppercase tracking-wider text-purple-200">
                      {{ (decisionType === 'reorientation' && netBalanceReorientation < 0) ? 'BILAN COMPTABLE DE LA RÉORIENTATION' : 'TOTAL GÉNÉRAL À RECOUVRER' }}
                    </p>
                  </div>
                  <p class="text-xs text-gray-300 font-medium">
                    <span v-if="decisionType === 'reorientation' && netBalanceReorientation < 0">
                      Paiements effectués ({{ formatMontant(totalDejaPayeCurrentYear) }}) > Nouvelle scolarité ({{ formatMontant(totalGlobalEngage) }})
                    </span>
                    <span v-else>
                      <span v-if="resteAPayerAnneeCourante > 0">Arriérés ({{ formatMontant(resteAPayerAnneeCourante) }}) + </span>
                      Nouveau cycle ({{ formatMontant(totalGlobalEngage) }})
                    </span>
                  </p>
                </div>
                <div class="text-left sm:text-right">
                  <p v-if="decisionType === 'reorientation' && netBalanceReorientation < 0" class="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight font-mono drop-shadow-sm">
                    Avoir {{ formatMontant(Math.abs(netBalanceReorientation)) }}
                  </p>
                  <p v-else class="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono drop-shadow-sm">
                    {{ formatMontant(grandTotalAbsolu) }}
                  </p>
                </div>
              </div>

            </div>

          </div>

          <!-- Colonne Droite (5 cols) : Formulaire Intégré de Configuration -->
          <div class="lg:col-span-5">
            <div class="bg-white dark:bg-[#11111e] border-2 border-[#7F45FD]/30 dark:border-[#7F45FD]/40 rounded-2xl p-4 sm:p-6 shadow-xl lg:sticky lg:top-6 space-y-4">
              
              <!-- En-tête du Panneau Intégré -->
              <div class="flex items-center gap-3 pb-3.5 border-b border-[#e8e8f0] dark:border-[#1a1a2a]">
                <div class="w-10 h-10 rounded-xl bg-[#7F45FD] text-white flex items-center justify-center font-black shadow-md">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-black text-lg text-[#1a1a2a] dark:text-white leading-tight">Configuration Réinscription</h3>
                  <p class="text-xs text-[#8a8a9a]">Niveau, Filière & Décision Académique</p>
                </div>
              </div>

              <!-- 1. Décision Académique -->
              <div>
                <label class="block text-xs font-black uppercase tracking-wider text-[#8a8a9a] mb-1.5">
                  Décision Académique <span class="text-red-500">*</span>
                </label>

                <div class="grid grid-cols-3 gap-2">
                  <!-- Promotion -->
                  <button 
                    type="button"
                    @click="setDecisionType('promotion')"
                    class="p-2.5 rounded-xl border-2 font-bold text-[11px] transition-all flex flex-col items-center gap-1.5 text-center"
                    :class="decisionType === 'promotion' 
                      ? 'border-[#7F45FD] bg-[#7F45FD]/10 text-[#7F45FD] dark:text-[#a882ff] shadow-sm' 
                      : 'border-[#e8e8f0] dark:border-[#1a1a2a] bg-gray-50 dark:bg-[#0d0d16] text-[#8a8a9a] hover:border-[#7F45FD]/30'"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                    </svg>
                    <span>Promotion</span>
                  </button>

                  <!-- Redoublement -->
                  <button 
                    type="button"
                    @click="setDecisionType('redoublement')"
                    class="p-2.5 rounded-xl border-2 font-bold text-[11px] transition-all flex flex-col items-center gap-1.5 text-center"
                    :class="decisionType === 'redoublement' 
                      ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-sm' 
                      : 'border-[#e8e8f0] dark:border-[#1a1a2a] bg-gray-50 dark:bg-[#0d0d16] text-[#8a8a9a] hover:border-amber-500/30'"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    <span>Redoublement</span>
                  </button>

                  <!-- Réorientation -->
                  <button 
                    type="button"
                    @click="setDecisionType('reorientation')"
                    class="p-2.5 rounded-xl border-2 font-bold text-[11px] transition-all flex flex-col items-center gap-1.5 text-center"
                    :class="decisionType === 'reorientation' 
                      ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm' 
                      : 'border-[#e8e8f0] dark:border-[#1a1a2a] bg-gray-50 dark:bg-[#0d0d16] text-[#8a8a9a] hover:border-blue-500/30'"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span>Réorientation</span>
                  </button>
                </div>
              </div>

              <!-- 2. Mode de Formation (Design Stylisé sous forme de Toggle Cards) -->
              <div>
                <label class="block text-xs font-black uppercase tracking-wider text-[#8a8a9a] mb-1.5">
                  Mode de Formation <span class="text-red-500">*</span>
                </label>

                <div class="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    @click="selectedModeFormation = 'Présentiel'"
                    class="p-2.5 rounded-xl border-2 font-bold text-xs transition-all flex items-center justify-center gap-2"
                    :class="selectedModeFormation === 'Présentiel' 
                      ? 'border-[#7F45FD] bg-[#7F45FD]/10 text-[#7F45FD] dark:text-[#a882ff] shadow-sm' 
                      : 'border-[#e8e8f0] dark:border-[#1a1a2a] bg-gray-50 dark:bg-[#0d0d16] text-[#8a8a9a] hover:border-[#7F45FD]/30'"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                    <span>Présentiel</span>
                  </button>

                  <button 
                    type="button"
                    @click="selectedModeFormation = 'En ligne'"
                    class="p-2.5 rounded-xl border-2 font-bold text-xs transition-all flex items-center justify-center gap-2"
                    :class="selectedModeFormation === 'En ligne' 
                      ? 'border-[#7F45FD] bg-[#7F45FD]/10 text-[#7F45FD] dark:text-[#a882ff] shadow-sm' 
                      : 'border-[#e8e8f0] dark:border-[#1a1a2a] bg-gray-50 dark:bg-[#0d0d16] text-[#8a8a9a] hover:border-[#7F45FD]/30'"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <span>En ligne</span>
                  </button>
                </div>
              </div>

              <!-- 3. Sélection du Niveau d'études de Destination -->
              <div>
                <label class="block text-xs font-black uppercase tracking-wider text-[#8a8a9a] mb-1 flex items-center justify-between">
                  <span>Niveau d'études de destination <span class="text-red-500">*</span></span>
                  <span v-if="decisionType === 'redoublement'" class="text-[10px] text-amber-600 dark:text-amber-400 font-bold lowercase flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                    Verrouillé (Même niveau)
                  </span>
                </label>
                
                <select 
                  v-model="selectedNiveauId"
                  :disabled="decisionType === 'redoublement'"
                  @change="onNiveauChanged"
                  class="w-full px-3.5 py-2 rounded-xl border border-[#e8e8f0] dark:border-[#1a1a2a] bg-[#fafafe] dark:bg-[#0d0d16] text-[#1a1a2a] dark:text-white font-semibold text-xs focus:border-[#7F45FD] focus:outline-none disabled:opacity-65 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800/60"
                >
                  <option v-for="niv in niveaux" :key="niv.id" :value="niv.id">
                    {{ niv.libelle || niv.nom }}
                  </option>
                </select>
              </div>

              <!-- 4. Sélection de la Filière de Destination -->
              <div>
                <label class="block text-xs font-black uppercase tracking-wider text-[#8a8a9a] mb-1 flex items-center justify-between">
                  <span>Filière pour {{ targetNiveauObj?.libelle || targetNiveauObj?.nom }} <span class="text-red-500">*</span></span>
                  <span v-if="decisionType === 'reorientation'" class="text-[10px] text-blue-600 dark:text-blue-400 font-bold lowercase">Changement de spécialité</span>
                  <span v-else-if="decisionType === 'redoublement'" class="text-[10px] text-amber-600 dark:text-amber-400 font-bold lowercase flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                    Verrouillé (Même spécialité)
                  </span>
                </label>
                
                <select 
                  v-model="selectedFiliereId"
                  :disabled="decisionType === 'redoublement'"
                  @change="onFiliereChanged"
                  class="w-full px-3.5 py-2 rounded-xl border border-[#e8e8f0] dark:border-[#1a1a2a] bg-[#fafafe] dark:bg-[#0d0d16] text-[#1a1a2a] dark:text-white font-semibold text-xs focus:border-[#7F45FD] focus:outline-none disabled:opacity-65 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800/60"
                >
                  <option :value="null">-- Sélectionner une filière --</option>
                  <option v-for="fil in filieresListForTargetNiveau" :key="fil.id" :value="fil.id">
                    {{ fil.nom || fil.libelle }}
                  </option>
                </select>
              </div>

              <!-- 5. Sélection de l'Année Scolaire -->
              <div>
                <label class="block text-xs font-black uppercase tracking-wider text-[#8a8a9a] mb-1">
                  Année Scolaire <span class="text-red-500">*</span>
                </label>
                
                <select 
                  v-model="selectedAnneeScolaireId"
                  class="w-full px-3.5 py-2 rounded-xl border border-[#e8e8f0] dark:border-[#1a1a2a] bg-[#fafafe] dark:bg-[#0d0d16] text-[#1a1a2a] dark:text-white font-semibold text-xs focus:border-[#7F45FD] focus:outline-none"
                >
                  <option v-for="annee in anneesList" :key="annee.id" :value="annee.id">
                    {{ getAnneeLabel(annee) }}
                  </option>
                </select>

                <!-- Message d'Alerte / Blocage si déjà inscrit pour cette année -->
                <div v-if="isAlreadyEnrolledInSelectedAnnee" class="mt-2 p-2.5 rounded-xl border text-xs" :class="decisionType === 'reorientation' ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300' : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300'">
                  <div class="flex items-start gap-2">
                    <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div>
                      <span v-if="decisionType === 'reorientation'" class="font-bold block">Réorientation / Transfert en cours d'année</span>
                      <span v-else class="font-bold block">Déjà inscrit pour cette année scolaire</span>

                      <p class="text-[11px] mt-0.5 leading-snug opacity-90">
                        <span v-if="decisionType === 'reorientation'">
                          L'étudiant est actuellement inscrit pour {{ selectedAnneeScolaireLabel }}. La valider effectuera un transfert de classe/filière pour cette même année.
                        </span>
                        <span v-else>
                          Cet étudiant est DÉJÀ inscrit pour l'année <strong>{{ selectedAnneeScolaireLabel }}</strong>. Pour un passage ou redoublement, veuillez sélectionner l'année N+1 dans la liste déroulante.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 6. Choix du Groupe / Classe -->
              <div>
                <label class="block text-xs font-black uppercase tracking-wider text-[#8a8a9a] mb-1">
                  Groupe / Classe ({{ targetNiveauObj?.libelle || targetNiveauObj?.nom }}) <span class="text-red-500">*</span>
                </label>

                <div v-if="availableGroupsForTarget.length > 0" class="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  <div 
                    v-for="grp in availableGroupsForTarget" 
                    :key="grp.id"
                    @click="selectedTargetGroupId = grp.id"
                    class="p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2"
                    :class="selectedTargetGroupId === grp.id 
                      ? 'border-[#7F45FD] bg-[#7F45FD]/5 dark:bg-[#7F45FD]/15 shadow-sm' 
                      : 'border-[#e8e8f0] dark:border-[#1a1a2a] bg-[#fafafe] dark:bg-[#0d0d16] hover:border-[#7F45FD]/30'"
                  >
                    <div class="min-w-0">
                      <p class="font-bold text-xs text-[#1a1a2a] dark:text-white truncate">{{ grp.nom }}</p>
                      <p class="text-[10px] text-[#7F45FD] font-semibold truncate">{{ getGroupFiliereName(grp) }}</p>
                    </div>

                    <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                      :class="selectedTargetGroupId === grp.id ? 'border-[#7F45FD] bg-[#7F45FD] text-white' : 'border-gray-300 dark:border-gray-700'"
                    >
                      <svg v-if="selectedTargetGroupId === grp.id" class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div v-else class="p-2.5 text-center bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-medium">
                  Aucun groupe configuré pour ces critères.
                </div>
              </div>

              <!-- 7. Gestion Avancée des Bourses (Reconduction par défaut si existante) -->
              <div class="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-black uppercase text-purple-950 dark:text-purple-100 flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-[#7F45FD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                    </svg>
                    Bourse d'études & Réduction
                  </span>
                  <span v-if="previousBourseInfo" class="text-[10px] font-bold bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 px-2 py-0.5 rounded-md">
                    Bourse détectée (Par défaut)
                  </span>
                </div>

                <div v-if="previousBourseInfo" class="text-xs text-purple-900 dark:text-purple-200 font-medium">
                  Bourse année précédente : <strong>{{ previousBourseInfo.nom }}</strong> <span v-if="previousBourseInfo.val">({{ previousBourseInfo.val }})</span>
                </div>

                <!-- Sélecteur Bourse -->
                <div>
                  <label class="block text-[10px] font-bold text-purple-900 dark:text-purple-300 mb-1">
                    Bourse à appliquer pour la nouvelle année
                  </label>
                  <select 
                    v-model="selectedBourseChoice"
                    :disabled="configuredFraisScolarite === null"
                    class="w-full px-3 py-1.5 rounded-lg border border-purple-300 dark:border-purple-700 bg-white dark:bg-[#11111e] text-xs font-bold text-purple-950 dark:text-purple-100 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <option v-if="previousBourseInfo" value="reconducted">Reconduire la bourse précédente ({{ previousBourseInfo.nom }})</option>
                    <option value="none">Aucune bourse (Plein tarif / Non boursier)</option>
                    <option v-for="b in boursesList" :key="b.id" :value="b.id">
                      Attribuer : {{ b.nom }} ({{ b.type === 'pourcentage' ? `${b.valeur}%` : formatMontant(b.valeur) }})
                    </option>
                  </select>

                  <!-- Bandeau d'Action Requise si frais non configurés -->
                  <div v-if="configuredFraisScolarite === null" class="mt-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-300 space-y-2">
                    <div class="flex items-start gap-2">
                      <svg class="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                      </svg>
                      <div>
                        <span class="font-bold block text-xs">Action requise : Grille tarifaire non configurée</span>
                        <p class="text-[11px] mt-0.5 leading-snug opacity-90">
                          Les frais de scolarité pour ce niveau, cette filière et ce mode n'ont pas encore été paramétrés. Veuillez d'abord configurer le tarif dans la grille pour pouvoir poursuivre la réinscription.
                        </p>
                      </div>
                    </div>

                    <NuxtLink 
                      to="/frais-de-scolarite/liste" 
                      target="_blank" 
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] shadow-sm transition-colors"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      Aller paramétrer la grille des tarifs
                    </NuxtLink>
                  </div>
                </div>
              </div>

              <!-- Bloc Option Notification E-mail -->
              <div class="p-3.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/50 space-y-2.5">
                <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-purple-950 dark:text-purple-100">
                  <input 
                    type="checkbox" 
                    v-model="sendEmailNotification" 
                    class="w-4 h-4 rounded border-purple-300 text-[#7F45FD] focus:ring-[#7F45FD] cursor-pointer"
                  />
                  <div class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-[#7F45FD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <span>Envoyer un e-mail de confirmation & bilan financier à l'étudiant</span>
                  </div>
                </label>

                <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-1">
                  <div v-if="sendEmailNotification" class="pt-2 border-t border-purple-200/60 dark:border-purple-800/40 space-y-2">
                    <div>
                      <label class="block text-[10px] font-bold text-purple-900 dark:text-purple-300 mb-1">
                        Date limite de paiement des frais *
                      </label>
                      <input 
                        type="date" 
                        v-model="dateLimitePaiement"
                        class="w-full px-3 py-1.5 rounded-lg border border-purple-300 dark:border-purple-700 bg-white dark:bg-[#11111e] text-xs font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#7F45FD]"
                      />
                    </div>

                    <!-- Aperçu dynamique pré-rédigé du message -->
                    <div class="p-2.5 rounded-lg bg-white/80 dark:bg-[#0a0a12]/80 border border-purple-100 dark:border-purple-900 text-[11px] text-gray-600 dark:text-gray-300 space-y-1 leading-snug">
                      <p class="font-bold text-[#7F45FD]">Aperçu du récapitulatif e-mail :</p>
                      <p class="flex items-center gap-1.5">
                        <span>• Frais d'inscription :</span>
                        <span class="font-bold" :class="payerFraisInscription ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'">
                          {{ payerFraisInscription ? `Réglés (${formatMontant(montantFraisInscriptionInput)})` : 'Non réglés (À régulariser)' }}
                        </span>
                      </p>
                      <p v-if="resteAPayerAnneeCourante > 0" class="text-amber-600 dark:text-amber-400 font-bold">
                        • Rappel d'arriérés : {{ formatMontant(resteAPayerAnneeCourante) }} d'impayés antérieurs inclus
                      </p>
                      <p>
                        • Date limite notifiée : <strong>{{ formattedDateLimiteDisplay }}</strong>
                      </p>
                    </div>
                  </div>
                </Transition>
              </div>

              <!-- 8. Récapitulatif Tarifaire Théorique de Destination -->
              <div class="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 space-y-2">
                <p class="text-xs font-black uppercase text-blue-900 dark:text-blue-200 flex items-center justify-between">
                  <span>Scolarité Théorique de Destination</span>
                  <span class="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-bold">{{ selectedModeFormation.toUpperCase() }}</span>
                </p>

                <div class="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div class="bg-white/80 dark:bg-black/30 p-2 rounded-lg">
                    <p class="text-[10px] font-bold text-gray-500 dark:text-gray-400">Frais d'inscription dus</p>
                    <p class="font-black text-blue-950 dark:text-blue-100 mt-0.5">
                      {{ configuredFraisInscription !== null ? formatMontant(configuredFraisInscription) : 'Non défini' }}
                    </p>
                  </div>

                  <div class="bg-white/80 dark:bg-black/30 p-2 rounded-lg">
                    <p class="text-[10px] font-bold text-gray-500 dark:text-gray-400">Scolarité totale théorique</p>
                    <p class="font-black text-blue-950 dark:text-blue-100 mt-0.5">
                      {{ configuredFraisScolarite !== null ? formatMontant(calculatedNetScolarite) : '0 FCFA (Non configurée)' }}
                    </p>
                    <p v-if="bourseReductionAmount > 0" class="text-[9px] text-emerald-600 font-bold mt-0.5">
                      Dont déduction bourse : -{{ formatMontant(bourseReductionAmount) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- 9. Frais de Réinscription & Caisse -->
              <div class="p-3 rounded-xl bg-[#fafafe] dark:bg-[#0d0d16] border border-[#e8e8f0] dark:border-[#1a1a2a] space-y-2.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <input 
                      id="payerFraisInline" 
                      type="checkbox" 
                      v-model="payerFraisInscription" 
                      class="w-4 h-4 rounded text-[#7F45FD] focus:ring-[#7F45FD] cursor-pointer"
                    />
                    <label for="payerFraisInline" class="text-xs font-bold text-[#1a1a2a] dark:text-white cursor-pointer select-none">
                      Règlement des frais de réinscription
                    </label>
                  </div>
                  <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded" :class="payerFraisInscription ? 'bg-emerald-500/15 text-emerald-600' : 'bg-amber-500/15 text-amber-600'">
                    {{ payerFraisInscription ? 'Payé' : 'Non réglé' }}
                  </span>
                </div>

                <!-- Si Frais de Réinscription Coché -->
                <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0">
                  <div v-if="payerFraisInscription" class="pt-2 border-t border-gray-200 dark:border-gray-800 space-y-2">
                    
                    <!-- Champ Saisie Montant Inscription -->
                    <div>
                      <label class="block text-[10px] font-bold text-[#8a8a9a] mb-0.5 flex items-center justify-between">
                        <span>Montant Frais d'Inscription (FCFA) <span class="text-red-500">*</span></span>
                        <span v-if="configuredFraisInscription !== null" class="text-[9px] text-[#7F45FD] font-bold">Tarif configuré</span>
                      </label>
                      <input 
                        type="number"
                        v-model.number="montantFraisInscriptionInput"
                        placeholder="Ex: 50000"
                        min="0"
                        class="w-full px-3 py-1.5 rounded-lg border border-[#e8e8f0] dark:border-[#1a1a2a] bg-white dark:bg-[#11111e] text-xs font-bold text-[#1a1a2a] dark:text-white focus:border-[#7F45FD] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label class="block text-[10px] font-bold text-[#8a8a9a] mb-0.5">Mode de Paiement</label>
                      <select 
                        v-model="modePaiementFrais"
                        class="w-full px-3 py-1.5 rounded-lg border border-[#e8e8f0] dark:border-[#1a1a2a] bg-white dark:bg-[#11111e] text-xs font-semibold text-[#1a1a2a] dark:text-white focus:border-[#7F45FD] focus:outline-none"
                      >
                        <option value="especes">Espèces / Caisse</option>
                        <option value="banque">Banque / Virement</option>
                        <option value="mobile_money">Mobile Money</option>
                        <option value="cheque">Chèque</option>
                      </select>
                    </div>

                    <div v-if="modePaiementFrais === 'mobile_money'" class="bg-[#7F45FD]/5 p-2 rounded-lg border border-[#7F45FD]/20">
                      <label class="block text-[10px] font-bold text-[#7F45FD] mb-0.5">Frais de retrait Mobile Money (FCFA)</label>
                      <input 
                        type="number"
                        v-model.number="fraisRetraitMM"
                        placeholder="Ex: 500"
                        min="0"
                        class="w-full px-3 py-1.5 rounded-lg border border-[#e8e8f0] dark:border-[#1a1a2a] bg-white dark:bg-[#11111e] text-xs font-bold text-[#1a1a2a] dark:text-white focus:border-[#7F45FD] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label class="block text-[10px] font-bold text-[#8a8a9a] mb-0.5">
                        Référence du Reçu <span class="text-[9px] text-[#7F45FD] font-normal">(Auto)</span>
                      </label>
                      <div class="relative flex items-center">
                        <input 
                          type="text"
                          v-model="referencePaiement"
                          placeholder="Génération automatique..."
                          class="w-full px-3 py-1.5 pr-9 rounded-lg border border-[#e8e8f0] dark:border-[#1a1a2a] bg-white dark:bg-[#11111e] text-xs font-mono font-bold text-[#7F45FD] focus:border-[#7F45FD] focus:outline-none"
                        />
                        <button 
                          type="button" 
                          @click="generateAutoReference" 
                          title="Régénérer une référence" 
                          class="absolute right-2 text-[#8a8a9a] hover:text-[#7F45FD] transition-colors p-1"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>

              <!-- Note explicative scolarités -->
              <p class="text-[10px] text-amber-600 dark:text-amber-400 font-medium italic">
                * Note : Le paramétrage de la grille tarifaire des frais de scolarité est obligatoire pour valider toute réinscription.
              </p>

              <!-- Bouton de Soumission Inline -->
              <button 
                @click="execSubmitReinscription"
                :disabled="!selectedTargetGroupId || !selectedAnneeScolaireId || configuredFraisScolarite === null || isSubmitting || (isAlreadyEnrolledInSelectedAnnee && decisionType !== 'reorientation')"
                class="w-full py-3.5 rounded-xl font-bold text-sm bg-[#7F45FD] hover:bg-[#6a35e8] disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white shadow-lg shadow-[#7F45FD]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                <span v-if="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                <span>{{ isSubmitting ? 'Validation en cours...' : getSubmitButtonText() }}</span>
              </button>

            </div>
          </div>

        </div>
      </Transition>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useEtudiantStore } from '~~/stores/etudiant'
import { useNiveauStore } from '~~/stores/niveau'
import { useGroupeStore } from '~~/stores/group'
import { useFiliereStore } from '~~/stores/filiere'
import { useFraisStore } from '~~/stores/frais-de-scolarite'
import { useFraisInscriptionStore } from '~~/stores/frais-inscription'
import { useBourseStore } from '~~/stores/bourse'
import { useAdvertiserStore } from '~~/stores/adverstiser'
import { useNegociationStore } from '~~/stores/negociation'
import { useAnneScolaireStore } from '~~/stores/annee-scolaire'
import Breadcrumb from '~/components/Breadcrumb.vue'

const etudiantStore = useEtudiantStore()
const niveauStore = useNiveauStore()
const groupStore = useGroupeStore()
const filiereStore = useFiliereStore()
const fraisStore = useFraisStore()
const fraisInscriptionStore = useFraisInscriptionStore()
const bourseStore = useBourseStore()
const advertiserStore = useAdvertiserStore()
const negociationStore = useNegociationStore()
const anneeScolaireStore = useAnneScolaireStore()
const { $toastr, $swal } = useNuxtApp()

// États
const isSubmitting = ref(false)
const selectedEtudiantToPromote = ref(null)
const situationFinanciere = ref(null)
const isLoadingFinances = ref(false)

// États Configuration Inline Réinscription
const decisionType = ref('promotion') // 'promotion', 'redoublement', 'reorientation'
const selectedModeFormation = ref('Présentiel') // 'Présentiel', 'En ligne' (Stricte cohérence avec la finance)
const selectedNiveauId = ref(null)
const selectedFiliereId = ref(null)
const selectedTargetGroupId = ref(null)
const selectedAnneeScolaireId = ref(null)
const payerFraisInscription = ref(true)
const montantFraisInscriptionInput = ref(0)
const selectedBourseChoice = ref('reconducted') // 'reconducted', 'none', ou bourse_id
const modePaiementFrais = ref('especes')
const fraisRetraitMM = ref(0)
const referencePaiement = ref('')

// Notification E-mail
const sendEmailNotification = ref(true)

const getDefaultDeadline = () => {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().split('T')[0]
}

const dateLimitePaiement = ref(getDefaultDeadline())

const formattedDateLimiteDisplay = computed(() => {
  if (!dateLimitePaiement.value) return 'Non spécifiée'
  try {
    const parts = dateLimitePaiement.value.split('-')
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2])
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    }
    return dateLimitePaiement.value
  } catch (e) {
    return dateLimitePaiement.value
  }
})

// Data
const niveaux = computed(() => niveauStore.niveaux || [])
const anneesList = computed(() => anneeScolaireStore.annneescolaires || [])
const filieresList = computed(() => filiereStore.filieres || [])
const boursesList = computed(() => bourseStore.bourses || [])
const activeAnneeObj = computed(() => anneeScolaireStore.activeAnnee)

const studentsList = computed(() => {
  return etudiantStore.etudiants.map(e => ({
    ...e,
    nomComplet: `${e.nom} ${e.prenom} (${e.matricule || 'Sans matricule'})`
  }))
})

// Objet Année sélectionnée
const selectedAnneeScolaireObj = computed(() => {
  if (!selectedAnneeScolaireId.value) return null
  return anneesList.value.find(a => Number(a.id) === Number(selectedAnneeScolaireId.value))
})

const selectedAnneeScolaireLabel = computed(() => {
  if (!selectedAnneeScolaireObj.value) return 'Non définie'
  return selectedAnneeScolaireObj.value.nom || selectedAnneeScolaireObj.value.code || selectedAnneeScolaireObj.value.libelle || (selectedAnneeScolaireObj.value.annee_debut && selectedAnneeScolaireObj.value.annee_fin ? `${selectedAnneeScolaireObj.value.annee_debut}-${selectedAnneeScolaireObj.value.annee_fin}` : `Année ${selectedAnneeScolaireObj.value.id}`)
})

const selectedFiliereObj = computed(() => {
  return filieresList.value.find(f => Number(f.id) === Number(selectedFiliereId.value))
})

const selectedGroupObj = computed(() => {
  return (groupStore.groupes || []).find(g => Number(g.id) === Number(selectedTargetGroupId.value))
})

// Détection de Bourse de l'année précédente
const previousBourseInfo = computed(() => {
  if (!situationFinanciere.value && !selectedEtudiantToPromote.value) return null
  
  const fin = getFinancialTarget(situationFinanciere.value)
  if (fin && (fin.bourse || fin.bourse_nom || fin.taux_bourse || fin.montant_bourse || fin.pourcentage_bourse)) {
    const nom = fin.bourse?.nom || fin.bourse_nom || 'Bourse d\'études'
    const val = fin.taux_bourse ? `${fin.taux_bourse}%` : (fin.pourcentage_bourse ? `${fin.pourcentage_bourse}%` : (fin.montant_bourse ? formatMontant(fin.montant_bourse) : ''))
    const id = fin.bourse?.id || fin.bourse_id || null
    return { id, nom, val }
  }

  if (selectedEtudiantToPromote.value?.bourses && selectedEtudiantToPromote.value.bourses.length > 0) {
    const b = selectedEtudiantToPromote.value.bourses[0]
    return { id: b.id, nom: b.nom || b.libelle || 'Bourse d\'études', val: b.pourcentage ? `${b.pourcentage}%` : (b.valeur ? `${b.valeur}%` : '') }
  }

  return null
})

// Niveau Actuel
const currentNiveauObj = computed(() => {
  if (!selectedEtudiantToPromote.value) return null
  const currentNiveau = selectedEtudiantToPromote.value.dernier_groupe?.niveau
  if (!currentNiveau) return null
  return niveaux.value.find(n => Number(n.id) === Number(currentNiveau.id)) || currentNiveau
})

// Niveau Supérieur (Passage)
const nextNiveauToPromote = computed(() => {
  if (!currentNiveauObj.value) return null
  const currentOrdre = Number(currentNiveauObj.value.ordre)
  if (!isNaN(currentOrdre)) {
    return niveaux.value.find(n => Number(n.ordre) === (currentOrdre + 1))
  }
  return null
})

// Niveau Cible selon la Sélection ou la Décision
const targetNiveauObj = computed(() => {
  if (selectedNiveauId.value) {
    return niveaux.value.find(n => Number(n.id) === Number(selectedNiveauId.value)) || currentNiveauObj.value
  }
  if (decisionType.value === 'redoublement') {
    return currentNiveauObj.value
  }
  return nextNiveauToPromote.value || currentNiveauObj.value
})

// 1. Frais d'inscription configurés pour la destination
const configuredFraisInscription = computed(() => {
  const targetLevelId = targetNiveauObj.value ? Number(targetNiveauObj.value.id) : null
  const targetFiliereId = selectedFiliereId.value ? Number(selectedFiliereId.value) : null
  const targetAnneeId = selectedAnneeScolaireId.value ? Number(selectedAnneeScolaireId.value) : null

  const list = fraisInscriptionStore.frais || []
  if (list.length === 0 || !targetLevelId) return null

  const matchLevel = (f) => {
    const nid = f.niveau_id ?? f.niveau?.id
    if (nid !== null && nid !== undefined && targetLevelId && Number(nid) === targetLevelId) return true
    const nLib = f.niveau?.libelle || f.niveau?.nom || (typeof f.niveau === 'string' ? f.niveau : null)
    if (nLib && targetNiveauObj.value) {
      const targetLib = targetNiveauObj.value.libelle || targetNiveauObj.value.nom
      if (targetLib && normalizeStr(nLib) === normalizeStr(targetLib)) return true
    }
    return false
  }

  const matchFiliere = (f) => {
    const fid = f.filiere_id ?? f.filiere?.id
    if (!fid || fid === 0) return true
    if (!targetFiliereId) return true
    return Number(fid) === targetFiliereId
  }

  const matchAnnee = (f) => {
    const aid = f.annee_scolaire_id ?? f.annee_scolaire?.id
    const aNom = f.annee_scolaire?.nom || f.annee_scolaire?.code || f.annee_scolaire?.libelle || (typeof f.annee_scolaire === 'string' ? f.annee_scolaire : null)
    if (!aid && !aNom) return true
    if (aid && targetAnneeId && Number(aid) === targetAnneeId) return true
    if (aNom && selectedAnneeScolaireLabel.value) {
      if (normalizeYearStr(aNom) === normalizeYearStr(selectedAnneeScolaireLabel.value)) return true
    }
    if (aid && anneesList.value) {
      const matchInList = anneesList.value.find(a => Number(a.id) === Number(aid))
      if (matchInList) {
        const nomInList = matchInList.nom || matchInList.code || matchInList.libelle
        if (nomInList && selectedAnneeScolaireLabel.value && normalizeYearStr(nomInList) === normalizeYearStr(selectedAnneeScolaireLabel.value)) return true
      }
    }
    return false
  }

  let found = list.find(f => matchLevel(f) && matchFiliere(f) && matchAnnee(f))

  if (!found) {
    found = list.find(f => matchLevel(f) && matchAnnee(f))
  }

  return found ? (Number(found.montant) || 0) : null
})

const normalizeStr = (str) => {
  if (!str) return ''
  return String(str).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
}

const normalizeYearStr = (str) => {
  if (!str) return ''
  return String(str).toLowerCase().replace(/[\s\-\/\_\.]/g, '').trim()
}

const matchedFraisRecord = computed(() => {
  const targetLevelId = targetNiveauObj.value ? Number(targetNiveauObj.value.id) : null
  const targetFiliereId = selectedFiliereId.value ? Number(selectedFiliereId.value) : null
  const targetAnneeId = selectedAnneeScolaireId.value ? Number(selectedAnneeScolaireId.value) : null
  const targetModeNorm = normalizeStr(selectedModeFormation.value || 'Présentiel')

  const list = fraisStore.frais || []
  if (list.length === 0 || !targetLevelId) return null

  const matchLevel = (f) => {
    const nid = f.niveau_id ?? f.niveau?.id
    if (nid !== null && nid !== undefined && targetLevelId && Number(nid) === targetLevelId) return true
    const nLib = f.niveau?.libelle || f.niveau?.nom || (typeof f.niveau === 'string' ? f.niveau : null)
    if (nLib && targetNiveauObj.value) {
      const targetLib = targetNiveauObj.value.libelle || targetNiveauObj.value.nom
      if (targetLib && normalizeStr(nLib) === normalizeStr(targetLib)) return true
    }
    return false
  }

  const matchFiliereExact = (f) => {
    const fid = f.filiere_id ?? f.filiere?.id
    return fid && targetFiliereId && Number(fid) === targetFiliereId
  }

  const matchFiliereGeneral = (f) => {
    const fid = f.filiere_id ?? f.filiere?.id
    if (!fid || fid === 0) return true
    if (!targetFiliereId) return true
    return Number(fid) === targetFiliereId
  }

  const matchAnneeExact = (f) => {
    const aid = f.annee_scolaire_id ?? f.annee_scolaire?.id
    const aNom = f.annee_scolaire?.nom || f.annee_scolaire?.code || f.annee_scolaire?.libelle || (typeof f.annee_scolaire === 'string' ? f.annee_scolaire : null)
    
    if (!aid && !aNom) return true // Tarif global toutes années

    if (aid && targetAnneeId && Number(aid) === targetAnneeId) return true
    
    if (aNom && selectedAnneeScolaireLabel.value) {
      if (normalizeYearStr(aNom) === normalizeYearStr(selectedAnneeScolaireLabel.value)) return true
    }

    if (aid && anneesList.value) {
      const matchInList = anneesList.value.find(a => Number(a.id) === Number(aid))
      if (matchInList) {
        const nomInList = matchInList.nom || matchInList.code || matchInList.libelle
        if (nomInList && selectedAnneeScolaireLabel.value && normalizeYearStr(nomInList) === normalizeYearStr(selectedAnneeScolaireLabel.value)) return true
      }
    }

    return false
  }

  const matchModeExact = (f) => {
    if (!f.mode_formation || f.mode_formation === 'Tous') return true
    return normalizeStr(f.mode_formation) === targetModeNorm
  }

  // 1. Tout exact (Level + Filière + Année + Mode)
  let found = list.find(f => matchLevel(f) && matchFiliereExact(f) && matchAnneeExact(f) && matchModeExact(f))

  // 2. Level exact + Filière générale (ou null) + Année exacte + Mode exact
  if (!found) {
    found = list.find(f => matchLevel(f) && matchFiliereGeneral(f) && matchAnneeExact(f) && matchModeExact(f))
  }

  // 3. Level exact + Année exacte + Mode exact
  if (!found) {
    found = list.find(f => matchLevel(f) && matchAnneeExact(f) && matchModeExact(f))
  }

  // 4. Level exact + Année exacte (Mode quelconque)
  if (!found) {
    found = list.find(f => matchLevel(f) && matchAnneeExact(f))
  }

  return found || null
})

// 2. Frais de scolarité totale configurée pour la destination
const configuredFraisScolarite = computed(() => {
  const found = matchedFraisRecord.value
  if (!found) return null

  const tranches = found.tranchepaiement || found.tranches?.data || found.tranches
  if (Array.isArray(tranches) && tranches.length > 0) {
    return tranches.reduce((sum, t) => sum + (Number(t.montant) || 0), 0)
  }

  return Number(found.montant) || 0
})

const isFraisFromDifferentYear = computed(() => {
  const found = matchedFraisRecord.value
  if (!found || !selectedAnneeScolaireId.value) return false
  const aid = found.annee_scolaire_id ?? found.annee_scolaire?.id
  return aid ? Number(aid) !== Number(selectedAnneeScolaireId.value) : false
})

const matchedFraisAnneeNom = computed(() => {
  const found = matchedFraisRecord.value
  return found?.annee_scolaire?.nom || found?.annee_scolaire?.code || null
})

// Calcul de la déduction de bourse
const bourseReductionAmount = computed(() => {
  const scolarite = configuredFraisScolarite.value
  if (!scolarite || scolarite <= 0) return 0

  if (selectedBourseChoice.value === 'none') return 0

  let bourseObj = null

  if (selectedBourseChoice.value === 'reconducted') {
    if (previousBourseInfo.value?.id) {
      bourseObj = boursesList.value.find(b => b.id === previousBourseInfo.value.id)
    }
    if (!bourseObj && previousBourseInfo.value?.val) {
      const valNum = parseFloat(previousBourseInfo.value.val)
      if (!isNaN(valNum)) {
        return (scolarite * valNum) / 100
      }
    }
  } else {
    bourseObj = boursesList.value.find(b => b.id === Number(selectedBourseChoice.value))
  }

  if (!bourseObj) return 0

  if (bourseObj.type === 'pourcentage') {
    return (scolarite * (Number(bourseObj.valeur) || 0)) / 100
  } else {
    return Number(bourseObj.valeur) || 0
  }
})

const calculatedNetScolarite = computed(() => {
  const scolarite = configuredFraisScolarite.value
  if (scolarite === null) return 0
  return Math.max(0, scolarite - bourseReductionAmount.value)
})

// TOTAL GLOBAL ENGAGÉ (Frais d'inscription + Scolarité nette)
const totalGlobalEngage = computed(() => {
  const fraisInsc = payerFraisInscription.value ? (Number(montantFraisInscriptionInput.value) || 0) : 0
  const scolarite = calculatedNetScolarite.value !== null ? calculatedNetScolarite.value : 0
  return fraisInsc + scolarite
})

// Arriérés d'impayés de l'exercice en cours / précédent
const resteAPayerAnneeCourante = computed(() => {
  if (!situationFinanciere.value) return 0
  const total = getMontantTotalDu(situationFinanciere.value)
  const paye = calculerTotalPaye(situationFinanciere.value)
  return Math.max(0, total - paye)
})

// Versements déjà effectués par l'étudiant pour l'année en cours
const totalDejaPayeCurrentYear = computed(() => {
  if (!situationFinanciere.value) return 0
  return calculerTotalPaye(situationFinanciere.value)
})

// Solde net après prise en compte des versements déjà effectués (notamment pour réorientation)
const netBalanceReorientation = computed(() => {
  const engagement = totalGlobalEngage.value
  const paye = totalDejaPayeCurrentYear.value
  return engagement - paye
})

// GRAND TOTAL ABSOLU À RECOUVRER (Arriérés + Total engagé N+1)
const grandTotalAbsolu = computed(() => {
  return resteAPayerAnneeCourante.value + totalGlobalEngage.value
})

// Reconduction automatique de la bourse par défaut si elle existe
watch(previousBourseInfo, (info) => {
  if (info) {
    selectedBourseChoice.value = 'reconducted'
  }
}, { immediate: true })

// Pré-remplissage automatique des frais d'inscription
watch(configuredFraisInscription, (newVal) => {
  if (newVal !== null && newVal !== undefined) {
    montantFraisInscriptionInput.value = newVal
  }
}, { immediate: true })

// Filières disponibles spécifiquement pour le Niveau Cible sélectionné
const filieresListForTargetNiveau = computed(() => {
  if (!targetNiveauObj.value) return filieresList.value

  const targetLevelId = Number(targetNiveauObj.value.id)
  
  const groupsInLevel = (groupStore.groupes || []).filter(g => {
    return Number(g.niveau_id) === targetLevelId || Number(g.niveau?.id) === targetLevelId
  })

  const filiereIdsInLevel = new Set()
  groupsInLevel.forEach(g => {
    if (g.filiere_id) filiereIdsInLevel.add(Number(g.filiere_id))
    if (g.filiere?.id) filiereIdsInLevel.add(Number(g.filiere.id))
    if (g.filieres && Array.isArray(g.filieres)) {
      g.filieres.forEach(f => filiereIdsInLevel.add(Number(f.id)))
    }
  })

  if (filiereIdsInLevel.size > 0) {
    const filtered = filieresList.value.filter(f => filiereIdsInLevel.has(Number(f.id)))
    if (filtered.length > 0) return filtered
  }

  return filieresList.value
})

// Groupes disponibles selon le niveau cible et la filière
const availableGroupsForTarget = computed(() => {
  if (!targetNiveauObj.value) return []
  const targetId = targetNiveauObj.value.id
  
  let groups = (groupStore.groupes || []).filter(g => {
    return Number(g.niveau_id) === Number(targetId) || Number(g.niveau?.id) === Number(targetId)
  })

  if (selectedFiliereId.value) {
    groups = groups.filter(g => {
      if (g.filiere_id && Number(g.filiere_id) === Number(selectedFiliereId.value)) return true
      if (g.filiere && Number(g.filiere.id) === Number(selectedFiliereId.value)) return true
      if (g.filieres && Array.isArray(g.filieres)) {
        return g.filieres.some(f => Number(f.id) === Number(selectedFiliereId.value))
      }
      return false
    })
  }

  return groups
})

const setDecisionType = (type) => {
  decisionType.value = type
  
  if (type === 'promotion') {
    selectedNiveauId.value = nextNiveauToPromote.value ? nextNiveauToPromote.value.id : (currentNiveauObj.value ? currentNiveauObj.value.id : null)
    if (selectedEtudiantToPromote.value?.dernier_groupe?.filiere_id || selectedEtudiantToPromote.value?.dernier_groupe?.filiere?.id) {
      selectedFiliereId.value = selectedEtudiantToPromote.value.dernier_groupe.filiere_id || selectedEtudiantToPromote.value.dernier_groupe.filiere.id
    }
  } else if (type === 'redoublement') {
    selectedNiveauId.value = currentNiveauObj.value ? currentNiveauObj.value.id : null
    selectedFiliereId.value = selectedEtudiantToPromote.value?.dernier_groupe?.filiere_id || 
                              selectedEtudiantToPromote.value?.dernier_groupe?.filiere?.id || null
  } else if (type === 'reorientation') {
    if (!selectedNiveauId.value) {
      selectedNiveauId.value = nextNiveauToPromote.value ? nextNiveauToPromote.value.id : (currentNiveauObj.value ? currentNiveauObj.value.id : null)
    }
  }

  onNiveauChanged()
}

const onNiveauChanged = () => {
  const availableFilieres = filieresListForTargetNiveau.value
  if (availableFilieres && availableFilieres.length > 0) {
    const stillValid = availableFilieres.some(f => Number(f.id) === Number(selectedFiliereId.value))
    if (!stillValid) {
      selectedFiliereId.value = availableFilieres[0].id
    }
  }

  const grps = availableGroupsForTarget.value
  if (grps && grps.length > 0) {
    selectedTargetGroupId.value = grps[0].id
  } else {
    selectedTargetGroupId.value = null
  }
}

const onFiliereChanged = () => {
  const grps = availableGroupsForTarget.value
  if (grps && grps.length > 0) {
    selectedTargetGroupId.value = grps[0].id
  } else {
    selectedTargetGroupId.value = null
  }
}

const generateAutoReference = () => {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase()
  referencePaiement.value = `REINS-${rand}`
}

// Détection si l'étudiant est DÉJÀ inscrit dans l'année scolaire sélectionnée
const isAlreadyEnrolledInSelectedAnnee = computed(() => {
  if (!selectedEtudiantToPromote.value || !selectedAnneeScolaireId.value) return false

  const targetAnneeId = Number(selectedAnneeScolaireId.value)

  // 1. Vérifier dans le dernier groupe de l'étudiant
  const dg = selectedEtudiantToPromote.value.dernier_groupe
  if (dg) {
    const dgAnneeId = dg.annee_scolaire_id ?? dg.annee_scolaire?.id
    if (dgAnneeId && Number(dgAnneeId) === targetAnneeId) {
      return true
    }
  }

  // 2. Vérifier dans l'historique des groupes / inscriptions
  const historical = selectedEtudiantToPromote.value.inscriptions || selectedEtudiantToPromote.value.groupes || []
  if (Array.isArray(historical)) {
    return historical.some(h => {
      const aid = h.annee_scolaire_id ?? h.annee_scolaire?.id ?? h.pivot?.annee_scolaire_id
      return aid && Number(aid) === targetAnneeId
    })
  }

  return false
})

const onEtudiantSelected = () => {
  decisionType.value = 'promotion'

  if (!nextNiveauToPromote.value && currentNiveauObj.value) {
    decisionType.value = 'redoublement'
  }

  // Mode de formation : Présentiel par défaut ou En ligne
  if (selectedEtudiantToPromote.value?.mode_formation && selectedEtudiantToPromote.value.mode_formation.toLowerCase().includes('ligne')) {
    selectedModeFormation.value = 'En ligne'
  } else {
    selectedModeFormation.value = 'Présentiel'
  }

  selectedNiveauId.value = nextNiveauToPromote.value ? nextNiveauToPromote.value.id : (currentNiveauObj.value ? currentNiveauObj.value.id : null)

  selectedFiliereId.value = selectedEtudiantToPromote.value?.dernier_groupe?.filiere_id || 
                            selectedEtudiantToPromote.value?.dernier_groupe?.filiere?.id || null

  // Année scolaire par défaut (auto-sélection N+1 si déjà inscrit l'année en cours)
  const dgAnneeId = selectedEtudiantToPromote.value?.dernier_groupe?.annee_scolaire_id ?? selectedEtudiantToPromote.value?.dernier_groupe?.annee_scolaire?.id
  if (dgAnneeId && anneesList.value.length > 1) {
    const nextAnnee = anneesList.value.find(a => Number(a.id) > Number(dgAnneeId))
    if (nextAnnee) {
      selectedAnneeScolaireId.value = nextAnnee.id
    } else if (activeAnneeObj.value) {
      selectedAnneeScolaireId.value = activeAnneeObj.value.id
    }
  } else if (activeAnneeObj.value) {
    selectedAnneeScolaireId.value = activeAnneeObj.value.id
  } else if (anneesList.value.length > 0) {
    selectedAnneeScolaireId.value = anneesList.value[0].id
  }

  onNiveauChanged()

  payerFraisInscription.value = true
  selectedBourseChoice.value = previousBourseInfo.value ? 'reconducted' : 'none'
  modePaiementFrais.value = 'especes'
  fraisRetraitMM.value = 0

  if (configuredFraisInscription.value !== null) {
    montantFraisInscriptionInput.value = configuredFraisInscription.value
  }

  generateAutoReference()
}

const getAnneeLabel = (annee) => {
  if (!annee) return ''
  const lib = annee.nom || annee.code || annee.libelle || (annee.annee_debut && annee.annee_fin ? `${annee.annee_debut} - ${annee.annee_fin}` : `Année ${annee.id}`)
  return (annee.active || annee.active === 1 || annee.active === true) ? `${lib} (Active)` : lib
}

const getGroupFiliereName = (grp) => {
  if (!grp) return 'Toutes filières'
  if (grp.filieres && Array.isArray(grp.filieres) && grp.filieres.length > 0) {
    return grp.filieres.map(f => f.nom || f.libelle).join(', ')
  }
  if (grp.filiere) {
    return grp.filiere.nom || grp.filiere.libelle
  }
  return 'Tronc commun / Générale'
}

const getSubmitButtonText = () => {
  if (decisionType.value === 'reorientation') return 'Valider la Réorientation'
  if (decisionType.value === 'redoublement') return 'Valider le Redoublement'
  return 'Valider la Réinscription'
}

const execSubmitReinscription = async () => {
  if (!selectedEtudiantToPromote.value || !targetNiveauObj.value || !selectedTargetGroupId.value || !selectedAnneeScolaireId.value) return

  if (configuredFraisScolarite.value === null) {
    const swalRes = await $swal.fire({
      title: 'Tarif de scolarité non configuré',
      text: "La grille tarifaire des frais de scolarité pour cette combinaison (Année / Niveau / Filière / Mode) n'a pas encore été paramétrée. Veuillez d'abord configurer le tarif dans la grille tarifaire pour pouvoir réinscrire l'étudiant.",
      icon: 'warning',
      confirmButtonText: 'Configurer la grille tarifaire',
      confirmButtonColor: '#7F45FD',
      showCancelButton: true,
      cancelButtonText: 'Fermer',
    })
    if (swalRes.isConfirmed) {
      window.open('/frais-de-scolarite/liste', '_blank')
    }
    return
  }

  const etudiant = selectedEtudiantToPromote.value
  const targetLevel = targetNiveauObj.value

  const targetAnneeObj = anneesList.value.find(a => a.id === selectedAnneeScolaireId.value)
  const promotionStr = targetAnneeObj ? (targetAnneeObj.nom || targetAnneeObj.code || targetAnneeObj.libelle || `${targetAnneeObj.annee_debut}-${targetAnneeObj.annee_fin}`) : getCurrentPromotion()

  // 1. Swal de confirmation avant enregistrement
  const confirmResult = await $swal.fire({
    title: 'Confirmer la réinscription ?',
    html: `
      <div class="text-left text-xs space-y-2 p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 text-gray-800 dark:text-gray-200">
        <p><strong>Étudiant :</strong> ${etudiant.nom} ${etudiant.prenom}</p>
        <p><strong>Décision Académique :</strong> <span class="uppercase font-black text-[#7F45FD]">${decisionType.value}</span></p>
        <p><strong>Niveau Cible :</strong> ${targetLevel.libelle || targetLevel.nom}</p>
        <p><strong>Mode de Formation :</strong> ${selectedModeFormation.value}</p>
        ${resteAPayerAnneeCourante.value > 0 ? `<p class="text-amber-600 dark:text-amber-400"><strong>Arriérés d'impayés :</strong> +${formatMontant(resteAPayerAnneeCourante.value)}</p>` : ''}
        <p><strong>Total engagé (N+1) :</strong> ${formatMontant(totalGlobalEngage.value)}</p>
        <p class="pt-1 border-t border-purple-200 dark:border-purple-800"><strong>TOTAL GÉNÉRAL À RECOUVRER :</strong> <span class="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">${formatMontant(grandTotalAbsolu.value)}</span></p>
        ${sendEmailNotification.value ? `<p class="pt-1.5 text-purple-600 dark:text-purple-300 font-semibold border-t border-purple-200/60 dark:border-purple-800/60">Notification e-mail : Envoyée (Date limite : ${formattedDateLimiteDisplay.value})</p>` : ''}
      </div>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui, confirmer et réinscrire',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#7F45FD',
  })

  if (!confirmResult.isConfirmed) return

  isSubmitting.value = true
  try {
    const payload = {
      niveau_id: targetLevel.id,
      group_id: selectedTargetGroupId.value,
      filiere_id: selectedFiliereId.value,
      mode_formation: selectedModeFormation.value,
      annee_scolaire_id: selectedAnneeScolaireId.value,
      type_decision: decisionType.value,
      payer_frais_inscription: payerFraisInscription.value,
      montant_frais_inscription: montantFraisInscriptionInput.value,
      reaffecter_bourse: selectedBourseChoice.value === 'reconducted',
      bourse_id: (selectedBourseChoice.value !== 'reconducted' && selectedBourseChoice.value !== 'none') ? Number(selectedBourseChoice.value) : null,
      mode_paiement: modePaiementFrais.value,
      frais_retrait: modePaiementFrais.value === 'mobile_money' ? fraisRetraitMM.value : 0,
      reference: referencePaiement.value,
      advertiser_id: etudiant.advertiser_id,
      promotion: promotionStr,
      send_email_notification: sendEmailNotification.value,
      date_limite_paiement: dateLimitePaiement.value,
      email_details: sendEmailNotification.value ? {
        etudiant_email: etudiant.email || etudiant.user?.email,
        etudiant_nom: `${etudiant.nom} ${etudiant.prenom}`,
        frais_inscription_statut: payerFraisInscription.value ? 'PAYE' : 'NON_PAYE',
        montant_frais_inscription: payerFraisInscription.value ? montantFraisInscriptionInput.value : 0,
        scolarite_brute: configuredFraisScolarite.value,
        reduction_bourse: bourseReductionAmount.value,
        scolarite_nette: calculatedNetScolarite.value,
        arrieres_impayes: resteAPayerAnneeCourante.value,
        grand_total_recouvrer: grandTotalAbsolu.value,
        date_limite_formattee: formattedDateLimiteDisplay.value,
      } : null,
    }

    // Utilisation obligatoire du SLUG de l'étudiant pour correspondre à la route backend Laravel
    const etudiantKey = etudiant.slug || etudiant.id
    await etudiantStore.reinscrire(etudiantKey, payload)

    let titleText = 'Réinscription & Promotion réussie !'
    let detailText = `${etudiant.nom} ${etudiant.prenom} a été promu(e) avec succès vers le niveau ${targetLevel.libelle || targetLevel.nom} (${promotionStr}).`

    if (decisionType.value === 'reorientation') {
      titleText = 'Réorientation enregistrée !'
      detailText = `${etudiant.nom} ${etudiant.prenom} a été réorienté(e) avec succès vers la filière et le niveau ${targetLevel.libelle || targetLevel.nom} (${promotionStr}).`
    } else if (decisionType.value === 'redoublement') {
      titleText = 'Redoublement enregistré !'
      detailText = `${etudiant.nom} ${etudiant.prenom} a été réinscrit(e) en redoublement pour le niveau ${targetLevel.libelle || targetLevel.nom} (${promotionStr}).`
    }

    if (sendEmailNotification.value) {
      detailText += ` Un e-mail de bilan financier avec échéance de règlement au ${formattedDateLimiteDisplay.value} a été envoyé à l'étudiant.`
    }

    await $swal.fire({
      title: titleText,
      text: detailText,
      icon: 'success',
      confirmButtonColor: '#7F45FD'
    })
    
    selectedEtudiantToPromote.value = null
    await etudiantStore.fetchEtudiants()
  } catch (error) {
    $toastr.error(error.response?.data?.message || 'Erreur lors de la réinscription')
  } finally {
    isSubmitting.value = false
  }
}

const getCurrentPromotion = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  if (month >= 8) return `${year}-${year + 1}`
  return `${year - 1}-${year}`
}

const formatMontant = (montant) => {
  if (!montant && montant !== 0) return '0 FCFA'
  return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA'
}

const getFinancialTarget = (negociation) => {
  if (!negociation) return null
  return negociation.data || negociation
}

const getMontantTotalDu = (negociation) => {
  const fin = getFinancialTarget(negociation)
  if (!fin) return 0
  return Number(fin.montant_apres_bourse ?? fin.montant_initial ?? 0)
}

const calculerTotalPaye = (negociation) => {
  const fin = getFinancialTarget(negociation)
  if (!fin) return 0

  if (fin.echeances && Array.isArray(fin.echeances) && fin.echeances.length > 0) {
    const totalEcheances = fin.echeances.reduce((sum, e) => sum + (Number(e.montant_paye) || 0), 0)
    if (totalEcheances > 0) return totalEcheances
  }

  if (fin.paiements && Array.isArray(fin.paiements) && fin.paiements.length > 0) {
    const totalPaiementsValid = fin.paiements
      .filter(p => p.status === 'valide' || p.statut === 'valide' || !p.status)
      .reduce((sum, p) => sum + (Number(p.montant) || 0), 0)
    if (totalPaiementsValid > 0) return totalPaiementsValid
  }

  if (fin.montant_paye !== undefined && fin.montant_paye !== null) {
    return Number(fin.montant_paye) || 0
  }

  return 0
}

const calculateProgression = (negociation) => {
  const total = getMontantTotalDu(negociation)
  if (total === 0) return 0
  const paye = calculerTotalPaye(negociation)
  return Math.min(100, Math.round((paye / total) * 100))
}

const getEcheancesDetails = (negociation) => {
  const fin = getFinancialTarget(negociation)
  if (!fin || !fin.echeances || !Array.isArray(fin.echeances)) return []
  return fin.echeances.map(e => {
    const montant = Number(e.montant) || 0
    const paye = Number(e.montant_paye) || 0
    const reste = Math.max(0, montant - paye)
    return {
      libelle: e.libelle,
      date_limite: e.date_limite,
      date_limite_formatted: e.date_limite ? new Date(e.date_limite).toLocaleDateString('fr-FR') : 'Non définie',
      montant_formatted: formatMontant(montant),
      reste: reste,
      reste_formatted: formatMontant(reste)
    }
  })
}

watch(selectedEtudiantToPromote, async (newVal) => {
  situationFinanciere.value = null
  if (newVal) {
    isLoadingFinances.value = true
    try {
      const response = await negociationStore.fetchNegociationByEtudiant(newVal.id)
      situationFinanciere.value = response?.data || response
    } catch (e) {
      console.warn('Pas de données financières trouvées pour cet étudiant')
    } finally {
      isLoadingFinances.value = false
    }
    onEtudiantSelected()
  }
})

watch(payerFraisInscription, (val) => {
  if (val && !referencePaiement.value) {
    generateAutoReference()
  }
})

watch(selectedAnneeScolaireId, (newVal) => {
  if (newVal) {
    fraisStore.fetchFrais()
    fraisInscriptionStore.fetchFrais()
  }
})

onMounted(() => {
  etudiantStore.fetchEtudiants()
  niveauStore.fetchNiveaux()
  groupStore.fetchGroupes()
  filiereStore.fetchFilieres()
  fraisStore.fetchFrais()
  fraisInscriptionStore.fetchFrais()
  bourseStore.fetchBourses()
  advertiserStore.fetchAdvertisers()
  anneeScolaireStore.fetchAnneeScolaire()
})
</script>

<style>
.prime-select-enroll {
  border-radius: 0.875rem !important;
  border: 1px solid #e8e8f0 !important;
  background: #ffffff !important;
  transition: all 0.2s ease !important;
}
.dark .prime-select-enroll {
  background: #0a0a12 !important;
  border-color: #1a1a2a !important;
  color: #ffffff !important;
}
.prime-select-enroll:hover, .prime-select-enroll.p-focus {
  border-color: #7F45FD !important;
  box-shadow: 0 0 0 3px rgba(127, 69, 253, 0.15) !important;
}
.prime-select-enroll .p-select-label {
  padding: 0.75rem 1rem !important;
  font-weight: 500 !important;
  font-size: 0.9375rem !important;
}
</style>
