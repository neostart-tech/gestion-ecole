<template>
  <div class="min-h-screen bg-slate-50 dark:bg-gray-900 p-4 md:px-6 md:py-6 font-sans">
    <div class="w-full max-w-full mx-auto space-y-5">

      <!-- Retour -->
      <button @click="navigateTo('/finance/recouvrement?tab=students')" class="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 dark:hover:text-gray-200 transition-colors mb-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Retour au recouvrement
      </button>

      <!-- Skeleton Loading -->
      <div v-if="isLoading" class="space-y-5">
        <!-- Profil Skeleton -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 p-5 flex items-start gap-4">
          <div class="w-14 h-14 rounded-full bg-slate-200 dark:bg-gray-700 animate-pulse"></div>
          <div class="space-y-3 flex-1">
            <div class="h-6 bg-slate-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
            <div class="h-4 bg-slate-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
        <!-- KPIs Skeleton -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div v-for="i in 4" :key="i" class="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 p-4">
            <div class="h-4 bg-slate-200 dark:bg-gray-700 rounded w-1/2 mb-3 animate-pulse"></div>
            <div class="h-8 bg-slate-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
          </div>
        </div>
        <!-- Tables Skeleton -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 p-5">
          <div class="h-6 bg-slate-200 dark:bg-gray-700 rounded w-1/4 mb-5 animate-pulse"></div>
          <div class="space-y-4">
            <div v-for="i in 3" :key="i" class="flex gap-4">
              <div class="h-4 bg-slate-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
              <div class="h-4 bg-slate-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
              <div class="h-4 bg-slate-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
              <div class="h-4 bg-slate-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <template v-else>
        <!-- Profil -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 p-5 flex items-start justify-between gap-4 flex-wrap mb-5" :class="{'opacity-75 grayscale-[0.5]': etudiant?.statut === 'abandon'}">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xl uppercase">
            {{ initiales }}
          </div>
          <div>
            <h1 class="text-lg font-black text-slate-800 dark:text-white">{{ etudiant?.nom_complet }}</h1>
            <div class="flex items-center gap-2 mt-1 flex-wrap">
              <span class="font-mono text-xs bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-gray-300 px-2 py-1 rounded-lg border border-slate-200 dark:border-gray-600">
                {{ etudiant?.matricule }}
              </span>
              <span v-if="!etudiant?.frais_id" class="text-xs font-bold px-2.5 py-1 rounded-lg border bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/30">
                Aucun contrat financier
              </span>
              <span v-else class="text-xs font-bold px-2.5 py-1 rounded-lg border" :class="getStatusClass(etudiant?.statut)">
                {{ getStatusLabel(etudiant?.statut) }}
              </span>
              <span v-if="etudiant?.inscription_statut" class="text-xs font-bold px-2.5 py-1 rounded-lg border ml-1"
                :class="etudiant?.inscription_statut === 'solde' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-100'">
                {{ etudiant?.inscription_statut === 'solde' ? 'Inscription Soldée' : 'Inscription Non Payée' }}
              </span>
            </div>
            <p class="text-sm text-slate-500 dark:text-gray-400 mt-1.5 font-medium">{{ etudiant?.niveau }} — <span class="text-indigo-600 dark:text-indigo-400">{{ etudiant?.filiere }}</span></p>
          </div>
        </div>
        <div class="flex flex-col items-end gap-1 text-right">
          <span class="text-xs text-slate-400">Dernière activité</span>
          <span class="text-sm text-slate-500 dark:text-gray-400 font-medium">{{ etudiant?.derniere_activite }}</span>
        </div>
      </div>

        <!-- Alerte Anomalie Financière / Contrat manquant (Design Premium) -->
        <div v-if="!etudiant?.frais_id || etudiant?.anomalie?.has_anomalie" class="relative overflow-hidden rounded-3xl p-1 mb-6 shadow-2xl group animate-in fade-in slide-in-from-top-4 duration-700">
          
          <!-- Cas 1 : Aucun contrat financier ou grille tarifaire manquante -->
          <template v-if="!etudiant?.frais_id || etudiant?.anomalie?.tarif_existant === false">
            <div class="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-600 to-amber-900 opacity-90 transition-opacity"></div>
            <div class="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-[22px] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
              <div class="relative flex-shrink-0">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-b from-white/20 to-white/5 border border-white/20 flex items-center justify-center shadow-inner text-white font-black">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
              </div>
              <div class="flex-1 space-y-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-sm">
                    {{ !etudiant?.frais_id ? 'Aucun Contrat Financier' : 'Grille Tarifaire Manquante' }}
                  </span>
                </div>
                <h3 class="text-2xl font-black text-white tracking-tight drop-shadow-sm">
                  {{ !etudiant?.frais_id ? 'Aucun contrat financier attribué' : 'Tarif académique non paramétré' }}
                </h3>
                <p class="text-amber-100 font-medium text-sm md:text-base max-w-xl leading-relaxed">
                  {{ !etudiant?.frais_id ? "Cet étudiant ne dispose actuellement d'aucun contrat financier pour cette année scolaire. Veuillez configurer la grille tarifaire correspondant à sa classe ou lui créer un tarif spécifique." : `Aucun tarif général n'est configuré dans la grille pour le profil de cet étudiant (mode ${etudiant?.anomalie?.mode_formation || 'En ligne'}).` }}
                </p>
              </div>
            </div>
            <div class="relative bg-black/40 backdrop-blur-md rounded-b-[22px] border-t border-white/10 p-5 md:px-8 mt-[-10px] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p class="text-amber-100/80 text-sm font-medium">Actions recommandées :</p>
              <div class="flex items-center gap-3 w-full sm:w-auto">
                <NuxtLink to="/finance/configuration-tranche-de-paiement" class="flex-1 sm:flex-none text-center px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-black transition-colors shadow-lg">
                  Paramétrer la grille
                </NuxtLink>
                <NuxtLink :to="`/admin/negociations/creer-une-negociation?etudiants=${etudiant?.slug}`" class="flex-1 sm:flex-none text-center px-6 py-2.5 bg-white text-amber-800 hover:bg-amber-50 rounded-xl text-sm font-black transition-colors shadow-lg">
                  Négocier un tarif
                </NuxtLink>
              </div>
            </div>
          </template>

          <!-- Cas 2 : Incohérence de tarif (Contrat vs Grille officielle) -->
          <template v-else>
            <div class="absolute inset-0 bg-gradient-to-br from-rose-500 via-red-600 to-red-900 opacity-90 transition-opacity group-hover:opacity-100"></div>
            <div class="absolute top-[-50%] left-[-10%] w-[50%] h-[150%] bg-white/10 rotate-12 blur-3xl pointer-events-none mix-blend-overlay"></div>
            
            <div class="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-[22px] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
              <div class="relative flex-shrink-0">
                <div class="absolute inset-0 bg-red-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
                <div class="relative w-16 h-16 rounded-2xl bg-gradient-to-b from-white/20 to-white/5 border border-white/20 flex items-center justify-center shadow-inner">
                  <svg class="w-8 h-8 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                </div>
              </div>

              <div class="flex-1 space-y-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-sm">Action Requise</span>
                  <span class="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                </div>
                <h3 class="text-2xl font-black text-white tracking-tight drop-shadow-sm">Contrat financier invalide</h3>
                <p class="text-rose-100 font-medium text-sm md:text-base max-w-xl leading-relaxed">
                  Le système a détecté une incohérence entre le tarif académique officiel et le montant actuellement facturé à cet étudiant.
                </p>
              </div>

              <div class="w-full md:w-auto bg-black/20 border border-white/10 rounded-2xl p-4 sm:px-6 flex items-center gap-4 sm:gap-6 shadow-inner backdrop-blur-md">
                <div class="text-center">
                  <p class="text-[10px] font-bold text-rose-200 uppercase tracking-widest mb-1 opacity-80">Attendu</p>
                  <p class="text-lg font-black text-white tabular-nums">{{ formatMontantShort(etudiant.anomalie.sit) }}</p>
                </div>
                <div class="w-px h-10 bg-white/10"></div>
                <div class="text-center">
                  <p class="text-[10px] font-bold text-rose-200 uppercase tracking-widest mb-1 opacity-80">Facturé</p>
                  <p class="text-lg font-black text-white tabular-nums">{{ formatMontantShort(etudiant.anomalie.dash) }}</p>
                </div>
                <div class="w-px h-10 bg-rose-500/50"></div>
                <div class="text-center relative">
                  <div class="absolute -top-2 -right-3">
                    <span class="flex h-3 w-3">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white/50"></span>
                    </span>
                  </div>
                  <p class="text-[10px] font-bold text-rose-200 uppercase tracking-widest mb-1 opacity-80">Écart</p>
                  <p class="text-xl font-black text-rose-300 tabular-nums drop-shadow-md">{{ formatMontantShort(Math.abs(etudiant.anomalie.diff)) }}</p>
                </div>
              </div>
            </div>
            
            <div class="relative bg-black/40 backdrop-blur-md rounded-b-[22px] border-t border-white/10 p-5 md:px-8 mt-[-10px] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p class="text-rose-100/80 text-sm font-medium">Sélectionnez une action pour régulariser ce dossier :</p>
              <div class="flex items-center gap-3 w-full sm:w-auto">
                <NuxtLink :to="`/admin/negociations/creer-une-negociation?etudiants=${etudiant.slug}`" class="flex-1 sm:flex-none text-center px-6 py-2.5 bg-white text-red-700 hover:bg-rose-50 rounded-xl text-sm font-black transition-colors shadow-lg shadow-black/20">
                  Ajuster le contrat
                </NuxtLink>
              </div>
            </div>
          </template>
        </div>

        <!-- Alerte Abandon -->
        <div v-if="etudiant?.statut === 'abandon'" class="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-700 shadow-sm animate-pulse mb-5">
          <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <div>
            <p class="font-black text-sm uppercase tracking-tight">Dossier en arrêt (Abandon)</p>
            <p class="text-xs opacity-80">Cet étudiant a été déclaré en situation d'abandon. Les opérations de recouvrement sont suspendues.</p>
          </div>
        </div>

      <!-- KPIs -->
      <div v-if="!etudiant?.anomalie?.has_anomalie" class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 p-4">
          <div class="flex justify-between items-start mb-2">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Scolarité Dû</p>
            <span v-if="etudiant?.frais_negocies?.bourse" class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Bourse : {{ etudiant.frais_negocies.bourse }}{{ etudiant.frais_negocies.type_bourse === 'pourcentage' ? '%' : (etudiant.frais_negocies.type_bourse === 'montant' || !etudiant.frais_negocies.type_bourse ? ' FCFA' : '') }}
            </span>
          </div>
          <p class="text-xl font-black text-slate-800 dark:text-white tabular-nums">{{ formatMontantShort(etudiant?.montant_du) }}</p>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="text-xs text-slate-400">FCFA</span>
            <span v-if="etudiant?.frais_negocies?.bourse" class="text-[10px] text-slate-400 line-through">{{ formatMontantShort(etudiant.frais_negocies.montant_initial) }}</span>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 p-4">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Scolarité Payée</p>
          <p class="text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{{ formatMontantShort(etudiant?.montant_paye) }}</p>
          <span class="text-xs text-slate-400">FCFA</span>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 p-4">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Inscription</p>
          <p class="text-xl font-black tabular-nums" :class="etudiant?.inscription_statut === 'solde' ? 'text-emerald-600' : 'text-amber-500'">
            {{ etudiant?.inscription_statut === 'solde' ? 'PAYÉE' : formatMontantShort(etudiant?.montant_inscription_du) }}
          </p>
          <span class="text-xs text-slate-400">{{ etudiant?.inscription_statut === 'solde' ? 'Validée' : 'FCFA à payer' }}</span>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 p-4">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Reste Scolarité</p>
          <p class="text-xl font-black tabular-nums" :class="etudiant?.reste > 0 ? 'text-red-500' : 'text-slate-400'">
            {{ etudiant?.reste > 0 ? formatMontantShort(etudiant?.reste) : '0' }}
          </p>
          <span class="text-xs text-slate-400">FCFA</span>
        </div>
      </div>

      <!-- Barre de progression -->
      <div v-if="!etudiant?.anomalie?.has_anomalie" class="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 p-4">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-slate-500 dark:text-gray-400">Progression du recouvrement</span>
          <span class="font-bold text-indigo-600 dark:text-indigo-400">{{ tauxCouverture }}%</span>
        </div>
        <div class="h-2 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div class="h-full bg-indigo-600 rounded-full transition-all duration-700"
            :style="`width: ${tauxCouverture}%`"></div>
        </div>
      </div>

      <!-- Échéancier -->
      <div v-if="!etudiant?.anomalie?.has_anomalie" class="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-gray-700">
          <h2 class="text-sm font-black text-slate-800 dark:text-white">Échéancier de paiement</h2>
          <span class="text-xs text-slate-400">{{ echeances.length }} tranches</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr class="border-b border-slate-100 dark:border-gray-700">
                <th class="py-3 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Tranche</th>
                <th class="py-3 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Échéance</th>
                <th class="py-3 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Montant</th>
                <th class="py-3 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Statut</th>
                <th class="py-3 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Date paiement</th>
                <th class="py-3 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Mode</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ech in echeances" :key="ech.id"
                class="border-b border-slate-50 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/40 transition-colors">
                <td class="py-3 px-5 font-semibold text-slate-700 dark:text-gray-300">{{ ech.libelle }}</td>
                <td class="py-3 px-5 text-slate-500 dark:text-gray-400">{{ formatDate(ech.date_echeance) }}</td>
                <td class="py-3 px-5 font-semibold text-right tabular-nums text-slate-700 dark:text-gray-200">{{ formatMontantShort(ech.montant) }} FCFA</td>
                <td class="py-3 px-5">
                  <span class="flex items-center gap-1.5 text-xs font-semibold"
                    :class="ech.statut === 'paye' ? 'text-emerald-600' : ech.statut === 'retard' ? 'text-red-500' : 'text-amber-500'">
                    <span class="w-2 h-2 rounded-full"
                      :class="ech.statut === 'paye' ? 'bg-emerald-500' : ech.statut === 'retard' ? 'bg-red-500' : 'bg-amber-400'">
                    </span>
                    {{ ech.statut === 'paye' ? 'Payée' : ech.statut === 'retard' ? 'En retard' : 'À venir' }}
                  </span>
                </td>
                <td class="py-3 px-5 text-slate-500 dark:text-gray-400 text-sm">{{ ech.date_paiement ? formatDate(ech.date_paiement) : '—' }}</td>
                <td class="py-3 px-5 text-slate-400 text-xs font-mono">{{ ech.mode_paiement || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Historique -->
      <div v-if="!etudiant?.anomalie?.has_anomalie" class="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-gray-700">
          <h2 class="text-sm font-black text-slate-800 dark:text-white">Historique des versements</h2>
          <span class="text-xs text-slate-400">{{ historique.length }} opérations</span>
        </div>
        <div>
          <div v-if="historique.length === 0" class="py-8 text-center text-slate-400 text-sm">Aucun versement enregistré.</div>
          <div v-for="op in historique" :key="op.id"
            class="flex items-start gap-3 px-5 py-3 border-b border-slate-50 dark:border-gray-800 last:border-0 hover:bg-slate-50 dark:hover:bg-gray-800/40 transition-colors">
            <span class="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
            <span class="text-xs text-slate-400 min-w-[80px]">{{ formatDate(op.date) }}</span>
            <span class="text-sm text-slate-700 dark:text-gray-200 flex-1">
              {{ op.description }}
              <span class="text-xs text-slate-400 font-mono ml-1">#{{ op.reference }}</span>
            </span>
            <span class="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums whitespace-nowrap">
              +{{ formatMontantShort(op.montant) }} FCFA
            </span>
            <button @click="genererRecu(op)" class="ml-2 text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors" title="Télécharger le reçu">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="!etudiant?.anomalie?.has_anomalie" class="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 dark:border-gray-700">
          <h2 class="text-sm font-black text-slate-800 dark:text-white">Actions</h2>
        </div>
        <div class="flex flex-wrap gap-3 p-5">
          <button @click="ouvrirModalPaiement"
            class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nouveau paiement
          </button>
          <Can action="send-rappel-recouvrement">
            <button @click="envoyerRappel"
              :disabled="!etudiant?.reste || etudiant?.statut === 'solde' || etudiant?.statut === 'abandon'"
              class="flex items-center gap-2 bg-slate-50 hover:bg-white dark:bg-gray-700 dark:hover:bg-gray-600 border border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-200 text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Envoyer un rappel
            </button>
          </Can>
          <Can action="declare-abandon-etudiant">
            <button @click="declarerAbandon"
              :disabled="etudiant?.statut === 'solde' || etudiant?.statut === 'abandon'"
              class="flex items-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 border border-red-100 dark:border-red-800/30 text-red-600 dark:text-red-400 text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Déclarer abandon
            </button>
          </Can>
        </div>
        <div v-if="etudiant?.statut === 'solde'" class="mx-5 mb-5 px-4 py-3 bg-slate-50 dark:bg-gray-700 rounded-xl text-sm text-slate-500 dark:text-gray-400">
          <span class="font-semibold text-slate-700 dark:text-gray-200">Note :</span>
          Scolarité entièrement soldée. Aucune action de recouvrement requise.
        </div>
      </div>

      </template>

    </div>

    <!-- Modal de reçu centralisé -->
    <FinanceRecuPaiement
      :is-open="showRecuModal"
      :etudiant="etudiant"
      :operation="selectedOperation"
      :app-name="appName"
      @close="closeRecuModal"
    />

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, navigateTo, useNuxtApp } from '#imports';
import { useRecouvrementStore } from '~~/stores/recouvrement';
import { useParametreStore } from '~~/stores/parametre';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot } from '@headlessui/vue';

const route = useRoute();
const recouvrementStore = useRecouvrementStore();
const parametreStore = useParametreStore();
const { $toastr } = useNuxtApp();

const isLoading = ref(true);

const etudiant = computed(() => recouvrementStore.etudiantCourant);
const echeances = computed(() => recouvrementStore.echeances);
const historique = computed(() => recouvrementStore.historique);

const showRecuModal = ref(false);
const selectedOperation = ref(null);
const appName = computed(() => parametreStore.getAppName || 'Établissement');

const initiales = computed(() => {
  const nom = etudiant.value?.nom_complet || '';
  return nom.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
});

const tauxCouverture = computed(() => {
  const du = etudiant.value?.montant_du || 0;
  const paye = etudiant.value?.montant_paye || 0;
  return du > 0 ? Math.round((paye / du) * 100) : 0;
});

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const formatMontantShort = (m) => {
  if (!m && m !== 0) return '0';
  return new Intl.NumberFormat('fr-FR').format(m);
};

const getStatusLabel = (s) => ({
  solde: 'Scolarité soldée', 
  en_retard: 'En retard',
  retard: 'En retard',
  avance: 'Payé en avance', 
  en_cours: 'À jour', 
  abandon: 'Étudiant en abandon', 
  en_attente: 'À venir'
})[s] || s;

const getStatusClass = (s) => ({
  solde: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30',
  en_retard: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-100 dark:border-red-800/30',
  retard: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-100 dark:border-red-800/30',
  avance: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/30',
  en_cours: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-800/30',
  abandon: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
})[s] || '';

const ouvrirModalPaiement = () => {
  navigateTo('/admin/paiements');
};

const genererRecu = (op) => {
  selectedOperation.value = op;
  showRecuModal.value = true;
};

const closeRecuModal = () => {
  showRecuModal.value = false;
};

const envoyerRappel = async () => {
  try {
    const response = await recouvrementStore.envoyerRappel(route.params.slug);
    if ($toastr) $toastr.success(response.message || "Le rappel a été envoyé avec succès par email !");
  } catch (e) {
    if ($toastr) {
      $toastr.error(e.response?.data?.message || "Erreur lors de l'envoi du rappel.");
    }
  }
};

const declarerAbandon = async () => {
  const { $swal } = useNuxtApp();
  
  if (!$swal) {
      if (confirm("Êtes-vous sûr de vouloir déclarer cet étudiant en abandon ?")) {
          traiterAbandon();
      }
      return;
  }

  const result = await $swal.fire({
    title: 'Confirmer l\'abandon ?',
    text: "Cette action marquera l'étudiant comme ayant abandonné ses études pour cette année. Cette opération est irréversible dans ce menu.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Oui, déclarer l\'abandon',
    cancelButtonText: 'Annuler',
    reverseButtons: true
  });

  if (result.isConfirmed) {
    traiterAbandon();
  }
};

const traiterAbandon = async () => {
  const { $toastr } = useNuxtApp();
  try {
    const response = await recouvrementStore.declarerAbandon(route.params.slug);
    if ($toastr) $toastr.success(response.message || "La déclaration d'abandon a été traitée avec succès.");
    await recouvrementStore.fetchEtudiantDetail(route.params.slug);
  } catch (e) {
    if ($toastr) {
      $toastr.error(e.response?.data?.message || "Erreur lors de la déclaration d'abandon.");
    }
  }
};

const loadData = async (slug) => {
  if (!slug) return;
  isLoading.value = true;
  recouvrementStore.etudiantCourant = null;
  recouvrementStore.echeances = [];
  recouvrementStore.historique = [];
  try {
    await Promise.all([
      recouvrementStore.fetchEtudiantDetail(slug),
      parametreStore.fetchParametres()
    ]);
  } catch (error) {
    console.error("Erreur lors du chargement des détails de l'étudiant :", error);
  } finally {
    isLoading.value = false;
  }
};

watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    loadData(newSlug);
  }
}, { immediate: true });
</script>