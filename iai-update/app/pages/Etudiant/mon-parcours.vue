<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
    <!-- Loading state -->
    <div v-if="store.isLoading" class="flex justify-center items-center min-h-[600px]">
      <Loading/>
    </div>

    <!-- Contenu principal -->
    <div v-else class="max-w-7xl mx-auto space-y-6">
      <!-- En-tête avec photo et infos -->
      <div v-if="store.identite" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div class="p-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div class="flex items-center gap-4">
              <!-- Avatar -->
              <div class="relative">
                <div class="w-20 h-20 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-sm">
                  {{ getInitials(store.identite) }}
                </div>
                <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              
              <!-- Infos -->
              <div>
                <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {{ store.identite.nom_complet }}
                </h1>
                <div class="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    {{ store.identite.matricule }}
                  </span>
                  <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {{ store.identite.email }}
                  </span>
                  <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {{ store.identite.telephone || 'Non renseigné' }}
                  </span>
                </div>
                <div class="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>{{ store.identite.nationalite || 'Nationalité non renseignée' }}</span>
                  <span v-if="store.identite.date_naissance">• Né(e) le {{ store.identite.date_naissance }}</span>
                </div>
              </div>
            </div>

            <!-- Badge statut global -->
            <div v-if="store.statutFinancier" 
                 :class="['px-4 py-2 rounded-lg border flex items-center gap-2', 
                          store.statutFinancier.est_solde ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700']">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      :d="store.statutFinancier.est_solde ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'" />
              </svg>
              <span class="font-medium">
                {{ store.statutFinancier.est_solde ? 'Tout est soldé' : 'Paiements en cours' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Message si aucune donnée -->
      <div v-if="!store.parcours || store.parcours.length === 0" class="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucune information disponible</h3>
        <p class="text-gray-500 dark:text-gray-400">Votre parcours n'a pas encore été configuré.</p>
      </div>

      <!-- Cartes de résumé financier -->
      <div v-if="store.statutFinancier" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Total à payer</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatMontant(store.statutFinancier.total_a_payer) }}</p>
          <p class="text-xs text-gray-400 mt-1">Toutes années confondues</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Déjà payé</p>
          <p class="text-2xl font-bold text-emerald-600">{{ formatMontant(store.statutFinancier.total_paye) }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ store.statistiques?.total_paiements || 0 }} paiements</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Reste à payer</p>
          <p class="text-2xl font-bold" :class="store.statutFinancier.reste_a_payer > 0 ? 'text-amber-600' : 'text-emerald-600'">
            {{ formatMontant(store.statutFinancier.reste_a_payer) }}
          </p>
          <p class="text-xs text-gray-400 mt-1">
            {{ store.statutFinancier.est_solde ? 'Total soldé' : 'En attente' }}
          </p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Progression</p>
          <div class="flex items-center gap-3">
            <p class="text-2xl font-bold text-indigo-600">{{ store.statutFinancier.progression }}%</p>
          </div>
          <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
            <div class="h-full bg-indigo-600 rounded-full" 
                 :style="{ width: store.statutFinancier.progression + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- Parcours académique -->
      <div v-if="store.parcoursAcademique && store.parcoursAcademique.length > 0" 
           class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Parcours académique
          </h2>
        </div>
        <div class="divide-y divide-gray-100 dark:divide-gray-700">
          <div v-for="(annee, index) in store.parcoursAcademique" :key="index" 
               class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div class="flex flex-wrap items-center gap-4">
              <div class="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                {{ annee.annee_scolaire.split('-')[0] }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ annee.niveau }}</h3>
                  <span v-if="annee.est_actuel" class="px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">Actuel</span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ annee.filiere }} • Groupe: {{ annee.groupe }} • {{ annee.annee_scolaire }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Switch d'années -->
      <div v-if="store.anneesDisponibles && store.anneesDisponibles.length > 0" 
           class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Historique des paiements par année
            </h2>
            <button v-if="store.vueDetails" 
                    @click="store.backToList"
                    class="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à la liste
            </button>
          </div>

          <!-- Pills des années -->
          <div class="flex flex-wrap gap-2 mt-4">
            <button v-for="annee in store.anneesDisponibles" :key="annee.id"
                    @click="store.selectAnnee(annee.id)"
                    :class="[
                      'px-4 py-2 rounded-lg border transition-all flex items-center gap-2',
                      store.anneeSelectionnee === annee.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-700',
                      annee.estActuelle ? 'ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-gray-800' : ''
                    ]">
              <span :class="[
                'w-2 h-2 rounded-full',
                annee.statut === 'solde' ? 'bg-emerald-500' :
                annee.statut === 'en_retard' ? 'bg-red-500' :
                annee.statut === 'en_cours' ? 'bg-amber-500' : 'bg-gray-500'
              ]"></span>
              <span class="font-medium">{{ annee.label }}</span>
              <span v-if="annee.estActuelle" class="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">Actuelle</span>
            </button>
          </div>
        </div>

        <!-- Contenu selon la vue -->
        <div class="p-6">
          <!-- Vue liste des années -->
          <div v-if="!store.vueDetails" class="space-y-4">
            <div v-for="annee in store.historiqueAnnees" :key="annee.annee_id"
                 @click="store.selectAnnee(annee.annee_id); store.showDetails()"
                 class="group p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition-all border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800">
              <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                    {{ annee.annee_scolaire.split('-')[0] }}
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">{{ annee.annee_scolaire }}</h3>
                    <div class="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span>{{ annee.nombre_paiements }} paiements</span>
                      <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span :class="['px-2 py-0.5 rounded-full text-xs', 
                                   annee.statut === 'solde' ? 'bg-emerald-50 text-emerald-700' :
                                   annee.statut === 'en_retard' ? 'bg-red-50 text-red-700' :
                                   annee.statut === 'en_cours' ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-700']">
                        {{ annee.statut === 'solde' ? 'Soldé' :
                           annee.statut === 'en_retard' ? 'En retard' :
                           annee.statut === 'en_cours' ? 'En cours' : 'Aucun frais' }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-500">Payé / Total</p>
                  <p class="font-mono font-bold">
                    <span class="text-emerald-600">{{ formatMontant(annee.montant_paye) }}</span>
                    <span class="text-gray-400"> / </span>
                    <span class="text-gray-900 dark:text-white">{{ formatMontant(annee.montant_total) }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Vue détails d'une année -->
          <div v-else-if="anneeDetails" class="space-y-6">
            <!-- En-tête de l'année -->
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
              <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ anneeDetails.annee_scolaire }}</h2>
                  <p class="text-gray-600 dark:text-gray-400 mt-1">
                    {{ anneeDetails.frais?.type === 'negocie' ? 'Négociation personnalisée' : 'Tranches standard' }}
                  </p>
                </div>
                <div :class="['px-4 py-2 rounded-lg border flex items-center gap-2',
                             anneeDetails.statut === 'solde' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                             anneeDetails.statut === 'en_retard' ? 'bg-red-50 border-red-200 text-red-700' :
                             anneeDetails.statut === 'en_cours' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-gray-50 border-gray-200 text-gray-700']">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          :d="anneeDetails.statut === 'solde' ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' :
                              anneeDetails.statut === 'en_retard' ? 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' :
                              anneeDetails.statut === 'en_cours' ? 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' :
                              'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'" />
                  </svg>
                  <span class="font-medium">
                    {{ anneeDetails.statut === 'solde' ? 'Soldé' :
                       anneeDetails.statut === 'en_retard' ? 'En retard' :
                       anneeDetails.statut === 'en_cours' ? 'En cours' : 'Aucun frais' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Bourse si présente -->
            <div v-if="anneeDetails.frais?.bourse" class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-amber-800 dark:text-amber-400">Bourse appliquée</p>
                  <p class="text-sm text-amber-700 dark:text-amber-300">
                    {{ anneeDetails.frais.bourse.nom }} - 
                    {{ anneeDetails.frais.bourse.type === 'pourcentage' 
                      ? anneeDetails.frais.bourse.valeur + '% de réduction' 
                      : formatMontant(anneeDetails.frais.bourse.valeur) + ' de réduction' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Résumé financier de l'année -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <p class="text-sm text-gray-500 mb-1">Total à payer</p>
                <p class="text-xl font-bold text-gray-900 dark:text-white">{{ formatMontant(anneeDetails.total_a_payer) }}</p>
              </div>
              <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <p class="text-sm text-gray-500 mb-1">Déjà payé</p>
                <p class="text-xl font-bold text-emerald-600">{{ formatMontant(anneeDetails.total_paye) }}</p>
              </div>
              <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <p class="text-sm text-gray-500 mb-1">Reste à payer</p>
                <p class="text-xl font-bold" :class="anneeDetails.reste_a_payer > 0 ? 'text-amber-600' : 'text-emerald-600'">
                  {{ formatMontant(anneeDetails.reste_a_payer) }}
                </p>
              </div>
            </div>

            <!-- Barre de progression -->
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Progression</span>
                <span class="text-sm font-bold text-indigo-600">{{ anneeDetails.progression }}%</span>
              </div>
              <div class="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full bg-indigo-600 rounded-full" 
                     :style="{ width: anneeDetails.progression + '%' }"></div>
              </div>
            </div>

            <!-- Échéances ou Tranches -->
            <div v-if="anneeDetails.frais?.echeances || anneeDetails.frais?.tranches" 
                 class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ anneeDetails.frais.echeances ? 'Échéances' : 'Tranches de paiement' }}
                </h3>
              </div>
              <div class="divide-y divide-gray-100 dark:divide-gray-700">
                <div v-for="item in (anneeDetails.frais.echeances || anneeDetails.frais.tranches)" :key="item.id"
                     class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div class="flex flex-wrap items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-medium">
                        {{ item.libelle?.split(' ')[1] || 'E' }}
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">{{ item.libelle }}</p>
                        <p class="text-xs text-gray-500">Échéance: {{ item.date_limite }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="font-mono font-bold">
                        <span class="text-emerald-600">{{ formatMontant(item.montant_paye || item.paye || 0) }}</span>
                        <span class="text-gray-400"> / </span>
                        <span class="text-gray-900 dark:text-white">{{ formatMontant(item.montant) }}</span>
                      </p>
                      <p class="text-xs mt-1">
                        <span :class="[
                          'px-2 py-0.5 rounded-full',
                          (item.reste || 0) > 0 
                            ? (item.statut === 'en_retard' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600')
                            : 'bg-emerald-100 text-emerald-600'
                        ]">
                          Reste: {{ formatMontant(item.reste || item.reste_a_payer || 0) }}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Historique des paiements de l'année -->
            <div v-if="anneeDetails.paiements && anneeDetails.paiements.length > 0" 
                 class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Historique des paiements
                </h3>
              </div>
              <div class="divide-y divide-gray-100 dark:divide-gray-700">
                <div v-for="paiement in anneeDetails.paiements" :key="paiement.id"
                     class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div class="flex flex-wrap items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">{{ paiement.libelle }}</p>
                        <div class="flex items-center gap-2 text-xs text-gray-500">
                          <span>{{ paiement.date }}</span>
                          <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span>{{ paiement.mode }}</span>
                          <span v-if="paiement.reference" class="font-mono">{{ paiement.reference }}</span>
                        </div>
                      </div>
                    </div>
                    <p class="text-xl font-bold font-mono text-emerald-600">{{ formatMontant(paiement.montant) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bourses obtenues -->
      <div v-if="store.boursesObtenues && store.boursesObtenues.length > 0" 
           class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Bourses obtenues
          </h2>
        </div>
        <div class="divide-y divide-gray-100 dark:divide-gray-700">
          <div v-for="bourse in store.boursesObtenues" :key="bourse.id"
               class="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 019.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ bourse.nom }}</p>
                <p class="text-sm text-gray-500">{{ bourse.annee_scolaire }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-amber-600">
                {{ bourse.type === 'pourcentage' ? bourse.valeur + '%' : formatMontant(bourse.valeur) }}
              </p>
              <p class="text-xs text-gray-500">{{ bourse.type === 'pourcentage' ? 'de réduction' : 'de réduction' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Toast position="top-right" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import { useEtudiantParcoursStore } from "~~/stores/mon-parcours";

const toast = useToast();
const store = useEtudiantParcoursStore();

// Computed pour l'année sélectionnée
const anneeDetails = computed(() => {
  if (!store.anneeSelectionnee || !store.vueDetails) return null;
  return store.anneeSelectionneeData;
});

// Chargement initial
onMounted(async () => {
  try {
    await store.loadParcours();
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Parcours chargé avec succès',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: error.message || 'Impossible de charger votre parcours',
      life: 5000
    });
  }
});

// Initiales pour l'avatar
const getInitials = (identite) => {
  if (!identite) return "?";
  const nom = identite.nom || "";
  const prenom = identite.prenom || "";
  return (nom.charAt(0) + prenom.charAt(0)).toUpperCase();
};

// Formatage des montants
const formatMontant = (montant) => {
  if (montant === undefined || montant === null) return '-';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(montant).replace('XOF', 'FCFA');
};
</script>
