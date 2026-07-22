<template>
  <div class="min-h-screen bg-slate-50 dark:bg-gray-900 p-4 md:p-8 font-sans">
    <div class="max-w-3xl mx-auto space-y-5">

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
        <!-- Alerte Abandon -->
        <div v-if="etudiant?.statut === 'abandon'" class="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-700 shadow-sm animate-pulse">
          <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <div>
            <p class="font-black text-sm uppercase tracking-tight">Dossier en arrêt (Abandon)</p>
            <p class="text-xs opacity-80">Cet étudiant a été déclaré en situation d'abandon. Les opérations de recouvrement sont suspendues.</p>
          </div>
        </div>

        <!-- Profil -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 p-5 flex items-start justify-between gap-4 flex-wrap" :class="{'opacity-75 grayscale-[0.5]': etudiant?.statut === 'abandon'}">
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
              <span class="text-xs font-bold px-2.5 py-1 rounded-lg border" :class="getStatusClass(etudiant?.statut)">
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

      <!-- KPIs -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 p-4">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Scolarité Dû</p>
          <p class="text-xl font-black text-slate-800 dark:text-white tabular-nums">{{ formatMontantShort(etudiant?.montant_du) }}</p>
          <span class="text-xs text-slate-400">FCFA</span>
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
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 p-4">
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
      <div class="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 overflow-hidden">
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
      <div class="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 overflow-hidden">
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
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 overflow-hidden">
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
          <button @click="genererRecu"
            class="flex items-center gap-2 bg-slate-50 hover:bg-white dark:bg-gray-700 dark:hover:bg-gray-600 border border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-200 text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Générer le reçu
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

    <!-- Modal de reçu -->
    <TransitionRoot appear :show="showRecuModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeRecuModal">
        <div class="fixed inset-0 bg-black/60" />

        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel class="w-full max-w-4xl rounded-xl bg-white dark:bg-gray-800 p-6 max-h-[90vh] overflow-y-auto">
            <DialogTitle class="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center justify-between">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Reçu de paiement</span>
              </div>
              <button @click="closeRecuModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </DialogTitle>

            <div v-if="etudiant" class="space-y-4">
              <!-- Contenu du reçu -->
              <div ref="recuContent" class="bg-white p-8" style="font-family: Arial, Helvetica, sans-serif; color: #333; line-height: 1.5;">
                <!-- En-tête -->
                <div style="text-align: center; margin-bottom: 2rem; border-bottom: 2px solid #4f46e5; padding-bottom: 1rem;">
                  <h1 style="font-size: 24px; font-weight: bold; color: #1e293b; margin: 0 0 0.5rem 0;">{{ appName }}</h1>
                  <p style="font-size: 14px; color: #64748b; margin: 0;">Reçu de paiement officiel</p>
                  <p style="font-size: 12px; color: #94a3b8; margin-top: 0.5rem;">N° REC-{{ etudiant.matricule }}-{{ new Date().toISOString().split('T')[0].replace(/-/g, '') }}</p>
                </div>

                <!-- Informations étudiant -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                  <div>
                    <p style="font-size: 12px; color: #64748b; margin: 0 0 0.25rem 0;">Étudiant</p>
                    <p style="font-weight: 600; color: #1e293b; margin: 0;">{{ etudiant.nom_complet }}</p>
                    <p style="font-size: 12px; color: #64748b; margin: 0;">Matricule: {{ etudiant.matricule }}</p>
                  </div>
                  <div>
                    <p style="font-size: 12px; color: #64748b; margin: 0 0 0.25rem 0;">Filière / Niveau</p>
                    <p style="font-weight: 600; color: #1e293b; margin: 0;">{{ etudiant.filiere }}</p>
                    <p style="font-size: 12px; color: #64748b; margin: 0;">{{ etudiant.niveau }}</p>
                  </div>
                </div>

                <!-- Tableau des paiements (Historique) -->
                <h3 style="font-size: 16px; font-weight: 600; color: #1e293b; margin: 1.5rem 0 1rem 0;">Détail des paiements</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; border: 1px solid #e2e8f0;">
                  <thead>
                    <tr style="background-color: #f8fafc;">
                      <th style="padding: 0.75rem; text-align: left; font-size: 12px; font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0;">Description</th>
                      <th style="padding: 0.75rem; text-align: left; font-size: 12px; font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0;">Date</th>
                      <th style="padding: 0.75rem; text-align: right; font-size: 12px; font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0;">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="op in historique" :key="op.id" style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 0.75rem; font-size: 13px;">{{ op.description }}</td>
                      <td style="padding: 0.75rem; font-size: 13px;">{{ formatDate(op.date) }}</td>
                      <td style="padding: 0.75rem; text-align: right; font-size: 13px; font-family: monospace;">{{ formatMontantShort(op.montant) }} FCFA</td>
                    </tr>
                    <tr v-if="historique.length === 0">
                      <td colspan="3" style="padding: 1rem; text-align: center; font-size: 13px; color: #94a3b8;">Aucun paiement enregistré</td>
                    </tr>
                  </tbody>
                </table>

                <!-- Récapitulatif -->
                <div style="display: flex; justify-content: flex-end; gap: 2rem; padding-top: 1rem; border-top: 2px solid #e2e8f0;">
                  <div>
                    <p style="font-size: 12px; color: #64748b; margin: 0 0 0.25rem 0;">Total payé</p>
                    <p style="font-size: 18px; font-weight: bold; color: #059669; margin: 0;">{{ formatMontantShort(etudiant.montant_paye) }} FCFA</p>
                  </div>
                  <div>
                    <p style="font-size: 12px; color: #64748b; margin: 0 0 0.25rem 0;">Reste à payer</p>
                    <p style="font-size: 18px; font-weight: bold; color: #d97706; margin: 0;">{{ formatMontantShort(etudiant.reste) }} FCFA</p>
                  </div>
                </div>

                <!-- Signature -->
                <div style="display: flex; justify-content: space-between; margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
                  <div>
                    <p style="font-size: 12px; color: #64748b; margin: 0 0 0.25rem 0;">Date d'émission</p>
                    <p style="font-weight: 500; color: #1e293b; margin: 0;">{{ formatDate(new Date()) }}</p>
                  </div>
                  <div style="text-align: right;">
                    <p style="font-size: 12px; color: #64748b; margin: 0 0 0.25rem 0;">Cachet et signature</p>
                    <div style="width: 200px; height: 50px; border-bottom: 2px dashed #cbd5e1; margin-top: 0.5rem;"></div>
                  </div>
                </div>
              </div>

               <!-- Boutons d'action -->
              <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  @click="closeRecuModal"
                  class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Fermer
                </button>
                <button
                  @click="downloadRecu"
                  :disabled="isDownloadingRecu"
                  class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {{ isDownloadingRecu ? 'Téléchargement...' : 'Télécharger le reçu' }}
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </TransitionRoot>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
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
const recuContent = ref(null);
const isDownloadingRecu = ref(false);
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

const genererRecu = () => {
  showRecuModal.value = true;
};

const closeRecuModal = () => {
  showRecuModal.value = false;
};

const downloadRecu = async () => {
  if (!recuContent.value) return;
  isDownloadingRecu.value = true;
  try {
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = html2pdfModule.default;
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `recu_${etudiant.value?.matricule || 'etudiant'}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, logging: false, backgroundColor: '#ffffff', useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    await html2pdf().set(opt).from(recuContent.value).save();
  } catch (error) {
    console.error('Erreur téléchargement reçu:', error);
  } finally {
    isDownloadingRecu.value = false;
  }
};

const envoyerRappel = async () => {
  try {
    const response = await recouvrementStore.envoyerRappel(route.params.slug);
    $toastr.success(response.message || "Le rappel a été envoyé avec succès par email !");
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
          // Fallback if swal not available
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
    $toastr.success(response.message || "La déclaration d'abandon a été traitée avec succès.");
    await recouvrementStore.fetchEtudiantDetail(route.params.slug); // Refresh the UI state
  } catch (e) {
    if ($toastr) {
      $toastr.error(e.response?.data?.message || "Erreur lors de la déclaration d'abandon.");
    }
  }
};

onMounted(async () => {
  isLoading.value = true;
  await Promise.all([
    recouvrementStore.fetchEtudiantDetail(route.params.slug),
    parametreStore.fetchParametres()
  ]);
  isLoading.value = false;
});
</script>