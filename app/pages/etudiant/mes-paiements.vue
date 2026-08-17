<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 transition-colors duration-300 font-sans text-gray-900 dark:text-gray-100">

    <!-- NAV BREADCRUMB -->
    <nav class="flex items-center gap-2 text-xs font-semibold mb-6 text-gray-500 dark:text-gray-400">
      <NuxtLink to="/frais-scolarite" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Frais de scolarité</NuxtLink>
      <span>›</span>
      <span class="text-gray-900 dark:text-white font-bold">Mes paiements</span>
    </nav>

    <!-- LOADING STATE PREMIUM -->
    <Transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isPageLoading"
        class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/75 dark:bg-gray-900/80 backdrop-blur-md"
      >
        <div class="relative flex items-center justify-center">
          <div class="absolute w-32 h-32 bg-indigo-500/20 rounded-full animate-ping"></div>
          <div class="absolute w-24 h-24 bg-indigo-600/30 rounded-full animate-pulse delay-75"></div>
          <div class="relative w-16 h-16 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-12">
            <svg class="w-8 h-8 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-8 flex flex-col items-center">
          <h2 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 animate-pulse">
            Chargement de vos finances...
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium tracking-widest uppercase">
            Mise à jour de vos paiements
          </p>
        </div>
      </div>
    </Transition>

    <div class="max-w-7xl mx-auto space-y-8" v-if="!errorState">

      <!-- PAGE HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm">
        <div>
          <p class="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Finances</p>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">Paiement des <span class="text-indigo-600 dark:text-indigo-400 italic">frais de scolarité</span></h1>
        </div>
        <button @click="loadData(true)" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer" :disabled="isPageLoading">
          <svg :class="{ 'animate-spin': isPageLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Actualiser</span>
        </button>
      </div>

      <!-- STATS CARDS -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm flex items-center gap-5">
          <div class="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900/30">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Scolarité</p>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{{ formatAmount(paiementStore.recap?.montant_total) }} <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">FCFA</span></h3>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm flex items-center gap-5">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/30">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Payé</p>
            <h3 class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{{ formatAmount(paiementStore.recap?.total_paye) }} <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">FCFA</span></h3>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm flex items-center gap-5">
          <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/30">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Reste à payer</p>
            <h3 class="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{{ formatAmount(paiementStore.recap?.reste_a_payer) }} <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">FCFA</span></h3>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT GRID -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <!-- COLONNE GAUCHE (8 COLS) -->
        <div class="lg:col-span-8 space-y-8">

          <!-- FORMULAIRE -->
          <div class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-gray-100 dark:border-gray-700/80 flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                </svg>
              </div>
              <div>
                <h2 class="text-base font-bold text-gray-900 dark:text-white">Effectuer un paiement</h2>
                <p class="text-xs text-gray-500 dark:text-gray-400">Complétez les informations ci-dessous</p>
              </div>
            </div>

            <div class="p-6">
              <form @submit.prevent="submitPayment" class="space-y-5">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">Nom</label>
                    <input v-model="form.lastname" type="text" class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none transition-all" placeholder="Nom" required />
                  </div>
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">Prénom</label>
                    <input v-model="form.firstname" type="text" class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none transition-all" placeholder="Prénom" required />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">Téléphone</label>
                  <div class="relative">
                    <div class="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 004.516 4.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                      <span>+228</span>
                    </div>
                    <input v-model="form.phone" type="tel" class="w-full pl-20 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none transition-all" placeholder="90000000" maxlength="8" @input="form.phone = form.phone.replace(/\D/g, '').slice(0, 8)" required />
                  </div>
                </div>

                <!-- NATURE DU PAIEMENT (Masqué si inscription déjà payée) -->
                <div v-if="paiementStore.recap && !paiementStore.recap.inscription_payee">
                  <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">Nature du paiement</label>
                  <select v-model="form.nature_paiement" class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none transition-all" required>
                    <option value="inscription">Frais d'inscription</option>
                    <option value="scolarite">Frais de scolarité</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">Montant</label>
                  <div class="relative">
                    <input 
                      v-model.number="form.montant" 
                      type="number" 
                      min="100" 
                      :max="maxAmount"
                      @input="handleAmountInput"
                      class="w-full pr-16 pl-4 py-2.5 rounded-xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 text-sm outline-none transition-all"
                      :class="[
                        form.nature_paiement === 'inscription' ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed border-gray-300 dark:border-gray-700' : 'border-gray-300 dark:border-gray-600',
                        isAmountTooHigh ? 'border-red-500 focus:ring-red-500' : ''
                      ]"
                      placeholder="0" 
                      :disabled="form.nature_paiement === 'inscription'"
                      required 
                    />
                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">FCFA</span>
                  </div>
                  <p v-if="isAmountTooHigh" class="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400 mt-1.5 font-medium">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Le montant dépasse le reste à payer ({{ formatAmount(maxAmount) }} FCFA).
                  </p>
                  <p v-if="form.nature_paiement === 'inscription'" class="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 mt-1.5 font-medium">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Le montant des frais d'inscription est fixe.
                  </p>
                </div>

                <div class="pt-2">
                  <button type="submit" class="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="paiementStore.isLoading || isAmountTooHigh">
                    <svg v-if="!paiementStore.isLoading" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    <svg v-else class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                    <span v-if="paiementStore.isLoading">Traitement...</span>
                    <span v-else>Payer · {{ formatAmount(form.montant) }} FCFA</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- HISTORIQUE -->
          <div class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-gray-100 dark:border-gray-700/80 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-indigo-600"></span>
                <h3 class="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">Historique des paiements</h3>
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{{ historiqueList.length }} paiements</span>
            </div>

            <div v-if="historiqueList.length > 0" class="divide-y divide-gray-100 dark:divide-gray-700/60">
              <div v-for="pay in historiqueList" :key="pay.id" class="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0 overflow-hidden">
                    <img v-if="getModeLogo(pay.mode_label)" :src="getModeLogo(pay.mode_label)" :alt="pay.mode_label" class="w-full h-full object-cover" />
                    <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="getModeIcon(pay.mode_label)" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-gray-900 dark:text-white">{{ pay.libelle }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ pay.date_formatted }} · {{ pay.mode_label }}</div>
                  </div>
                </div>

                <div class="text-right shrink-0">
                  <div class="flex items-center justify-end gap-2">
                    <span class="text-sm font-bold text-gray-900 dark:text-white">{{ formatAmount(pay.montant) }} FCFA</span>
                    <a v-if="pay.status === 'valide' && pay.recu" :href="pay.recu" target="_blank" class="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors" title="Télécharger le reçu">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 00-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </a>
                  </div>
                  <span class="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider" :class="getStatusClass(pay.status)">{{ pay.status_label }}</span>
                </div>
              </div>
            </div>
            <div v-else class="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Aucun paiement enregistré pour le moment.
            </div>
          </div>

        </div>

        <!-- COLONNE DROITE / RÉCAPITULATIF (4 COLS) -->
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm overflow-hidden">
            <div class="p-6 bg-gradient-to-br from-indigo-600 to-blue-600 text-white">
              <p class="text-xs font-bold uppercase tracking-wider opacity-80">Montant à régler</p>
              <div class="text-3xl font-extrabold mt-1">{{ formatAmount(form.montant) }} <span class="text-sm font-semibold opacity-90">FCFA</span></div>
            </div>
            <div class="p-6 space-y-3 divide-y divide-gray-100 dark:divide-gray-700/60 text-xs">
              <div class="flex justify-between items-center pt-2">
                <span class="text-gray-500 dark:text-gray-400">Étudiant</span>
                <span class="font-bold text-gray-900 dark:text-white">{{ form.lastname }} {{ form.firstname }}</span>
              </div>
              <div class="flex justify-between items-center pt-3">
                <span class="text-gray-500 dark:text-gray-400">Nature</span>
                <span class="font-bold text-indigo-600 dark:text-indigo-400">{{ form.nature_paiement === 'inscription' ? "Inscription" : "Scolarité" }}</span>
              </div>
              <div class="flex justify-between items-center pt-3">
                <span class="text-gray-500 dark:text-gray-400">Mode</span>
                <span class="font-bold text-gray-900 dark:text-white">{{ selectedMethodLabel }}</span>
              </div>
              <div class="flex justify-between items-center pt-4 text-sm font-extrabold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700">
                <span>Total TTC</span>
                <span>{{ formatAmount(form.montant) }} FCFA</span>
              </div>
            </div>
            <div class="p-4 bg-emerald-50 dark:bg-emerald-950/30 border-t border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-4 h-4 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              <span>Paiement sécurisé via SEMOA</span>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- ERROR STATE -->
    <div v-else class="flex items-center justify-center min-h-[70vh] p-4">
      <div class="bg-white dark:bg-gray-800 p-8 rounded-3xl text-center max-w-md shadow-xl border border-gray-200 dark:border-gray-700 space-y-4">
        <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Oups ! Problème de profil</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ errorMessage }}</p>
        <button @click="retryLoad" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/20 transition-all">Réessayer</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from "primevue/usetoast"
import Swal from "sweetalert2"
import { usePaiementGlobalStore } from '../../../stores/paiement'

const toast = useToast()
const paiementStore = usePaiementGlobalStore()

const errorState = ref(false)
const isPageLoading = ref(true)
const errorMessage = ref('')

const paymentMethods = [
  { value: '016eb63c-f29d-4384-92e4-b1bd37ef69f8', label: 'Flooz', sub: 'Moov Africa', logo: '/logo/moovmonye.jpg' },
  { value: 'e2daf18d-b8d8-42b7-ac42-e3ab8bdb95c1', label: 'Yas', sub: 'Mix By Yas', logo: '/logo/mixbyyas.png' },
  { value: '64369062-817c-43a5-9615-5683296a8497', label: 'Ecobank', sub: 'Mobile Banking', logo: '/logo/ecobank.png' },
  { value: 'f7bbfaef-eba3-4b82-ac31-61eb2b772289', label: 'Orabank', sub: 'Virement Orabank', logo: '/logo/orabank.jpg' }
]

const form = ref({ 
  etudiant_id: '', 
  lastname: '', 
  firstname: '', 
  phone: '', 
  montant: '', 
  nature_paiement: 'scolarite',
  payment_method: '14f4597d-ef96-4263-8107-1e1970959133' 
})

// Surveillance de l'état de l'inscription pour ajuster la nature par défaut
watch(() => paiementStore.recap, (newRecap) => {
  if (newRecap) {
    if (newRecap.inscription_payee) {
      form.value.nature_paiement = 'scolarite'
    } else {
      form.value.nature_paiement = 'inscription'
      // Si on vient de charger les données et qu'on est en mode inscription, on force le montant
      if (newRecap.montant_inscription) {
        form.value.montant = newRecap.montant_inscription
      }
    }
  }
}, { immediate: true, deep: true })

// Surveillance de la nature du paiement pour forcer le montant de l'inscription
watch(() => form.value.nature_paiement, (nature) => {
  if (nature === 'inscription' && paiementStore.recap?.montant_inscription) {
    form.value.montant = paiementStore.recap.montant_inscription
  } else if (nature === 'scolarite' && form.value.montant === paiementStore.recap?.montant_inscription) {
    // Optionnel: on peut vider le montant si on repasse en scolarité pour laisser l'étudiant choisir
    form.value.montant = ''
  }
})

const selectedMethodLabel = computed(() => {
  const m = paymentMethods.find(m => m.value === form.value.payment_method)
  return m ? m.label : '—'
})

const historiqueList = computed(() => {
  return paiementStore.historiquePaiements || []
})

const isAmountTooHigh = computed(() => {
  const m = parseFloat(form.value.montant) || 0
  return m > maxAmount.value
})

const maxAmount = computed(() => {
  return form.value.nature_paiement === 'scolarite' 
    ? (paiementStore.recap?.reste_a_payer || 0) 
    : (paiementStore.recap?.montant_inscription || 0)
})

const handleAmountInput = (e) => {
  let val = parseFloat(e.target.value) || 0
  if (val > maxAmount.value) {
    form.value.montant = maxAmount.value
  }
}

const formatAmount = (val) => (parseInt(val) || 0).toLocaleString('fr-FR')
const getStatusClass = (s) => (s === 'valide' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : s === 'en_attente' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300')

const getModeLogo = (l) => {
  const m = paymentMethods.find(m => (l || '').toLowerCase().includes(m.label.toLowerCase()))
  return m ? m.logo : null
}

const getModeIcon = (l) => {
  const m = paymentMethods.find(m => (l || '').toLowerCase().includes(m.label.toLowerCase()))
  return m ? m.iconPath : '<path stroke="currentColor" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>'
}

const submitPayment = async () => {
  // Validation du téléphone
  let p = form.value.phone.replace(/\D/g, '')
  if (p.length !== 8) return toast.add({ severity: 'warn', summary: '8 chiffres requis', life: 3000 })

  // Validation du montant (Garde-fou)
  const reste = form.value.nature_paiement === 'scolarite' 
    ? (paiementStore.recap?.reste_a_payer || 0) 
    : (paiementStore.recap?.montant_inscription || 0)

  if (form.value.montant > reste) {
    return Swal.fire({
      icon: 'warning',
      title: 'Montant trop élevé',
      text: `Vous ne pouvez pas payer plus que votre reste à payer (${formatAmount(reste)} FCFA).`,
      confirmButtonColor: '#6c52e3'
    })
  }

  try {
    const res = await paiementStore.initierPaiementSemoa({ ...form.value, phone: '+228' + p })
    if (res.success) window.open(res.payment_url, '_blank')
    else Swal.fire("Erreur", res.message, "error")
  } catch { Swal.fire("Erreur", "Connexion impossible", "error") }
}

const loadData = async (isManual = false) => {
  if (isManual) isPageLoading.value = true
  const user = JSON.parse(localStorage.getItem('gest-ecole-user')) || JSON.parse(localStorage.getItem('user'))
  if (user) {
    form.value.etudiant_id = user.etudiant_id || user.id
    form.value.lastname = user.nom || user.name || ''
    form.value.firstname = user.prenom || ''
    form.value.phone = user.tel || user.phone || ''
    
    try {
      const resRecap = await paiementStore.getRecap()
      if (!resRecap.success) {
        errorState.value = true
        errorMessage.value = resRecap.message
        isPageLoading.value = false
        return
      }
      await paiementStore.getHistorique()
      errorState.value = false
    } catch (err) {
      errorState.value = true
      errorMessage.value = "Une erreur est survenue lors de la récupération des données."
    } finally {
      // Un petit délai pour que l'animation soit visible si c'est trop rapide
      setTimeout(() => {
        isPageLoading.value = false
      }, 500)
    }
  }
}

const retryLoad = () => {
  errorState.value = false
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.paiement-page {
  --violet: #6c52e3; --ink: #0e0d1a; --ink-3: #7e7c96; --ink-4: #b8b6cc; --surface-2: #f7f6fc; --border: rgba(108,82,227,0.1);
  font-family: 'DM Sans', sans-serif; background: var(--surface-2); min-height: 100vh; color: var(--ink);
}
.paiement-nav { padding: 12px 24px; border-bottom: 1px solid var(--border); display: flex; gap: 8px; font-size: 11px; font-weight: 600; }
.nav-link { color: var(--ink-3); text-decoration: none; }
.page-inner { display: grid; grid-template-columns: 1fr 340px; gap: 24px; padding: 24px 22px; align-items: start; max-width: 1280px; margin: 0 auto; }
.page-header { grid-column: 1/-1; margin-bottom: 10px; }
.page-eyebrow { font-size: 9px; font-weight: 700; text-transform: uppercase; color: var(--violet); letter-spacing: .2em; }
.page-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; }
.page-title em { font-style: italic; color: var(--violet); }

.stats-grid { grid-column: 1/-1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 25px; }
.stat-card { background: #fff; padding: 20px; border-radius: 16px; border: 1px solid var(--border); display: flex; align-items: center; gap: 16px; }
.stat-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon.due { background: #fff5f5; color: #ff5a5a; }
.stat-icon.paid { background: #f0fdf4; color: #10b981; }
.stat-icon.rest { background: #f5f3ff; color: var(--violet); }
.stat-label { font-size: 10px; font-weight: 700; color: var(--ink-4); text-transform: uppercase; }
.stat-value { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; }

.left-col { display: flex; flex-direction: column; gap: 20px; }
.card { background: #fff; border-radius: 20px; border: 1px solid var(--border); overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
.card-hd { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
.card-hd-icon { width: 32px; height: 32px; background: var(--violet); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
.card-hd-icon svg { width: 15px; height: 15px; }
.form-body { padding: 20px; }
.frow { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.fg { margin-bottom: 15px; }
.fl { display: block; font-size: 9px; font-weight: 700; text-transform: uppercase; color: var(--ink-3); margin-bottom: 4px; }
.fi { width: 100%; padding: 10px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13px; outline: none; transition: 0.2s; }
.fi:focus { border-color: var(--violet); box-shadow: 0 0 0 4px rgba(108,82,227,0.05); }
.fi-disabled { background: #f9f9fb; color: var(--ink-3); cursor: not-allowed; border-color: var(--border); }
.info-tip { display: flex; align-items: center; gap: 4px; font-size: 10px; color: var(--violet); margin-top: 6px; font-weight: 600; }

.select-fi { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%237e7c96'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; background-size: 14px; padding-right: 40px; }

.phone-wrap { position: relative; }
.phone-prefix { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-weight: 700; font-size: 12px; display: flex; align-items: center; gap: 4px; }
.phone-wrap .fi { padding-left: 55px; }
.amount-wrap { position: relative; }
.amount-suffix { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); font-size: 10px; font-weight: 700; color: var(--ink-4); }
.method-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.method-card { padding: 10px; border: 1.5px solid var(--border); border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
.method-card:hover { border-color: var(--violet); }
.method-card.active { border-color: var(--violet); background: #f5f3ff; }
.method-card-icon { width: 34px; height: 34px; background: var(--surface-2); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
.method-logo { width: 100%; height: 100%; object-fit: contain; }
.method-card-name { font-size: 11px; font-weight: 700; }
.method-card-sub { font-size: 9px; color: var(--ink-3); }
.submit-btn { width: 100%; padding: 14px; background: var(--violet); color: #fff; border: none; border-radius: 12px; font-weight: 700; text-transform: uppercase; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px; font-size: 11px; transition: 0.2s; }
.submit-btn:hover:not(:disabled) { background: #5a42cc; transform: translateY(-2px); }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.submit-btn svg { width: 16px; height: 16px; }

.history-hd { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.history-hd-title { font-size: 11px; font-weight: 700; text-transform: uppercase; display: flex; align-items: center; gap: 6px; }
.hd-dot { width: 5px; height: 5px; background: var(--violet); border-radius: 50%; }
.hrow { padding: 12px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; transition: 0.2s; }
.hrow:hover { background: #fafafa; }
.hrow-icon { width: 36px; height: 36px; background: var(--surface-2); border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
.hrow-logo { width: 80%; height: 80%; object-fit: contain; }
.hrow-info { flex: 1; }
.hrow-libelle { font-size: 13px; font-weight: 600; }
.hrow-meta { font-size: 10px; color: var(--ink-3); }
.hrow-right { text-align: right; }
.hrow-amount { font-size: 13px; font-weight: 700; }
.spill { font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 20px; text-transform: uppercase; }
.sp-ok { background: #ecfdf5; color: #10b981; }
.sp-wait { background: #fffbeb; color: #b45309; }
.sp-err { background: #fff1f2; color: #e11d48; }
.receipt-link { width: 26px; height: 26px; background: #f5f3ff; color: var(--violet); border-radius: 6px; display: flex; align-items: center; justify-content: center; display: inline-flex; margin-left: 6px; vertical-align: middle; transition: 0.2s; }
.receipt-link:hover { background: var(--violet); color: #fff; }

.empty { padding: 30px; text-align: center; color: var(--ink-3); font-size: 13px; }

.summary-strip { padding: 20px; background: linear-gradient(135deg, #3d2daf, #7053d9); color: #fff; }
.summary-amount { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; }
.summary-rows { padding: 15px 20px; }
.srow { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 11px; }
.total-row { padding: 14px 20px; display: flex; justify-content: space-between; font-weight: 700; border-top: 1px solid var(--border); }
.secure-row { padding: 12px 20px; display: flex; align-items: center; gap: 8px; color: #10b981; font-size: 10px; font-weight: 600; }
.secure-row svg { width: 14px; height: 14px; flex-shrink: 0; }

.error-container { display: flex; align-items: center; justify-content: center; min-height: 80vh; padding: 20px; }
.error-card { background: #fff; padding: 40px; border-radius: 24px; text-align: center; max-width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid var(--border); }
.error-icon { color: #f43f5e; margin-bottom: 20px; }
.error-card h2 { font-family: 'Playfair Display', serif; margin-bottom: 12px; color: var(--ink); }
.error-card p { color: var(--ink-3); font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
.retry-btn { padding: 12px 24px; background: var(--violet); color: #fff; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; }
.retry-btn:hover { background: #5a42cc; transform: translateY(-2px); }

.refresh-btn { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #fff; border: 1px solid var(--border); border-radius: 10px; color: var(--violet); font-size: 11px; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: 0.2s; }
.refresh-btn:hover:not(:disabled) { background: var(--surface-2); border-color: var(--violet); }
.refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.refresh-btn svg { width: 14px; height: 14px; }

.fi-error { border-color: #ef4444 !important; background: #fef2f2 !important; }
.error-tip { display: flex; align-items: center; gap: 4px; font-size: 10px; color: #ef4444; margin-top: 6px; font-weight: 600; }

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>