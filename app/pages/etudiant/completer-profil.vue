<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- En-tête d'information & vérification -->
      <div class="space-y-4 mb-8">
        <!-- Bannière principale de vérification -->
        <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 flex items-start gap-4">
          <div class="p-3 bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0 mt-0.5">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div class="flex-1">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">
                Vérification de vos informations personnelles
              </h2>
              <span v-if="profilVerifieAt" class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Profil vérifié
              </span>
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
              Veuillez contrôler l'exactitude de vos coordonnées et pièces justificatives. Si tout est exact, cliquez directement sur <strong>« Mes informations sont correctes »</strong>. En cas d'erreur ou d'ajout de documents, effectuez vos corrections puis cliquez sur <strong>« Enregistrer mon profil »</strong> pour validation par l'administration.
            </p>
          </div>
        </div>

        <!-- Alerte si demande en attente de validation -->
        <div v-if="isDemandeEnAttente" class="bg-amber-500/15 border-2 border-amber-500/50 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
          <div class="p-2.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl shrink-0 mt-0.5 animate-pulse">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="flex-1">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <h3 class="text-sm font-bold text-amber-900 dark:text-amber-200">
                Demande de modification en cours d'examen
              </h3>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-800 dark:text-amber-300 rounded-full text-xs font-bold">
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                En attente de validation
              </span>
            </div>
            <p class="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
              Vous avez soumis des modifications ou de nouvelles pièces le <strong>{{ derniereDemande.created_at }}</strong>. Votre dossier est actuellement en cours d'examen par la direction et le service informatique. Le formulaire est temporairement verrouillé jusqu'à la décision administrative.
            </p>
          </div>
        </div>

        <!-- Alerte si précédente demande rejetée -->
        <div v-if="derniereDemande && derniereDemande.statut === 'rejete'" class="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex items-start gap-3">
          <div class="p-2 bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg shrink-0 mt-0.5">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-rose-900 dark:text-rose-200">
              Précédente demande refusée
            </h3>
            <p class="text-xs text-rose-800 dark:text-rose-300 mt-0.5 font-medium">
              Motif du refus : <span class="font-bold underline">{{ derniereDemande.motif_refus || 'Non précisé' }}</span>
            </p>
            <p class="text-xs text-rose-700 dark:text-rose-400 mt-1">
              Vous pouvez corriger les informations ou documents contestés ci-dessous et enregistrer à nouveau votre profil.
            </p>
          </div>
        </div>
      </div>

      <!-- Chargement initial -->
      <div v-if="isLoadingData" class="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div class="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-sm text-slate-500 mt-4">Chargement de votre dossier...</p>
      </div>

      <!-- Formulaire principal -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-8">
        <fieldset :disabled="isDemandeEnAttente" class="space-y-8 border-0 p-0 m-0 disabled:opacity-90">
        <!-- 1. Informations Personnelles -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div class="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">1. Informations Personnelles</h3>
              <p class="text-xs text-slate-500">Votre état civil et vos coordonnées directes</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Matricule (Verrouillé) -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Matricule étudiant</span>
                <span class="inline-flex items-center gap-1 text-[11px] text-slate-400">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  Non modifiable
                </span>
              </label>
              <input
                :value="matricule"
                type="text"
                readonly
                disabled
                class="w-full px-3.5 py-2.5 rounded-xl border bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed select-none font-mono"
              />
            </div>

            <!-- Email (Verrouillé) -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Adresse email</span>
                <span class="inline-flex items-center gap-1 text-[11px] text-slate-400">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  Non modifiable
                </span>
              </label>
              <input
                :value="form.email"
                type="email"
                readonly
                disabled
                class="w-full px-3.5 py-2.5 rounded-xl border bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed select-none"
              />
            </div>

            <!-- Nom -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nom de famille <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.nom"
                type="text"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                :class="{'border-rose-400 bg-rose-50/30': isFieldMissing('nom')}"
              />
            </div>

            <!-- Prénom -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Prénom(s) <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.prenom"
                type="text"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                :class="{'border-rose-400 bg-rose-50/30': isFieldMissing('prenom')}"
              />
            </div>

            <!-- Nom de jeune fille -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nom de jeune fille <span class="text-slate-400 font-normal">(optionnel)</span>
              </label>
              <input
                v-model="form.nom_jeune_fille"
                type="text"
                class="w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <!-- Genre -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Genre <span class="text-rose-500">*</span>
              </label>
              <select
                v-model="form.genre"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                :class="{'border-rose-400 bg-rose-50/30': isFieldMissing('genre')}"
              >
                <option value="">Sélectionnez votre genre</option>
                <option value="Masculin">Masculin</option>
                <option value="Féminin">Féminin</option>
              </select>
            </div>

            <!-- Date de naissance -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date de naissance <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.date_naissance"
                type="date"
                required
                :max="maxDateNaissance"
                class="w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all [color-scheme:light] dark:[color-scheme:dark]"
                :class="{'border-rose-400 bg-rose-50/30': isFieldMissing('date_naissance') || dateError}"
              />
              <p v-if="dateError" class="text-xs text-rose-500 mt-1 font-medium">
                {{ dateError }}
              </p>
            </div>

            <!-- Lieu de naissance -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Lieu de naissance <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.lieu_naissance"
                type="text"
                required
                placeholder="Ex: Lomé"
                class="w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                :class="{'border-rose-400 bg-rose-50/30': isFieldMissing('lieu_naissance')}"
              />
            </div>

            <!-- Nationalité avec drapeaux -->
            <div>
              <NationaliteSelector
                v-model="form.nationalite"
                label="Nationalité"
                :required="true"
                placeholder="Sélectionner votre nationalité"
                :class="{'border-rose-400': isFieldMissing('nationalite')}"
              />
            </div>

            <!-- Téléphone -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Téléphone portable <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.tel"
                type="tel"
                required
                placeholder="Ex: +228 90 00 00 00"
                class="w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                :class="{'border-rose-400 bg-rose-50/30': isFieldMissing('tel')}"
              />
            </div>

            <!-- Biographie -->
            <div class="md:col-span-2">
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Biographie / Présentation <span class="text-slate-400 font-normal">(optionnel)</span>
              </label>
              <textarea
                v-model="form.biographie"
                rows="2"
                placeholder="Quelques mots sur vous..."
                class="w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 2. Informations du Parent ou Tuteur -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div class="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">2. Parent ou Tuteur légal</h3>
              <p class="text-xs text-slate-500">Contact d'urgence et représentant légal</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Nom du tuteur -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nom du tuteur <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.tuteur_nom"
                type="text"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                :class="{'border-rose-400 bg-rose-50/30': isFieldMissing('tuteur_nom')}"
              />
            </div>

            <!-- Prénom du tuteur -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Prénom du tuteur <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.tuteur_prenom"
                type="text"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                :class="{'border-rose-400 bg-rose-50/30': isFieldMissing('tuteur_prenom')}"
              />
            </div>

            <!-- Téléphone du tuteur -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Téléphone du tuteur <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.tuteur_tel"
                type="tel"
                required
                placeholder="Ex: +228 90 00 00 00"
                class="w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                :class="{'border-rose-400 bg-rose-50/30': isFieldMissing('tuteur_tel')}"
              />
            </div>

            <!-- Email du tuteur -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email du tuteur <span class="text-slate-400 font-normal">(optionnel)</span>
              </label>
              <input
                v-model="form.tuteur_email"
                type="email"
                class="w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <!-- Profession du tuteur -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Profession <span class="text-slate-400 font-normal">(optionnel)</span>
              </label>
              <input
                v-model="form.tuteur_profession"
                type="text"
                class="w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <!-- Adresse du tuteur -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Adresse / Ville <span class="text-slate-400 font-normal">(optionnel)</span>
              </label>
              <input
                v-model="form.tuteur_adresse"
                type="text"
                class="w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <!-- Responsable financier : même personne ? -->
          <div class="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700">
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                v-model="form.meme_responsable"
                type="checkbox"
                class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
                Le tuteur est également le responsable financier des frais de scolarité
              </span>
            </label>

            <!-- Si différent, afficher les champs du responsable financier -->
            <div v-if="!form.meme_responsable" class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nom du responsable financier</label>
                <input v-model="form.responsable_nom" type="text" class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-sm" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Prénom du responsable financier</label>
                <input v-model="form.responsable_prenom" type="text" class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-sm" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Téléphone du responsable financier</label>
                <input v-model="form.responsable_tel" type="tel" class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-sm" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email du responsable financier</label>
                <input v-model="form.responsable_email" type="email" class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-sm" />
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Pièces Justificatives (100% Dynamiques) -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div class="p-2.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">3. Pièces Justificatives à fournir</h3>
              <p class="text-xs text-slate-500">Documents configurés selon votre niveau et filière d'inscription</p>
            </div>
          </div>

          <div v-if="documentsRequis.length === 0" class="text-center py-8 text-sm text-slate-500 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            Aucune pièce jointe n'est requise pour votre niveau actuel.
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="doc in documentsRequis"
              :key="doc.id"
              class="p-5 rounded-2xl border transition-all"
              :class="isDocMissing(doc.document_key) ? 'border-amber-400/50 dark:border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20' : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80'"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-semibold text-sm text-slate-900 dark:text-white">
                      {{ doc.nom_affichage }}
                    </span>
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                      :class="doc.is_obligatoire ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'"
                    >
                      {{ doc.is_obligatoire ? 'Obligatoire' : 'Facultatif' }}
                    </span>
                    <span v-if="doc.is_photo" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      Photo Profil
                    </span>
                  </div>
                  <p v-if="doc.description" class="text-xs text-slate-500 mt-1 italic">
                    {{ doc.description }}
                  </p>
                </div>

                <!-- Indicateur de document en haut à droite -->
                <div v-if="getExistingDoc(doc.document_key)" class="flex items-center gap-2 shrink-0">
                  <span
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                    :class="getExistingDoc(doc.document_key).is_en_attente ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ getExistingDoc(doc.document_key).is_en_attente ? 'En attente de validation' : 'Déjà fourni' }}
                  </span>
                  <a
                    :href="getDocumentUrl(getExistingDoc(doc.document_key))"
                    target="_blank"
                    class="text-xs text-indigo-600 hover:underline dark:text-indigo-400 font-semibold inline-flex items-center gap-1"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Voir
                  </a>
                </div>
                <div v-else class="shrink-0">
                  <span class="px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded-lg text-xs font-semibold">
                    Non fourni
                  </span>
                </div>
              </div>

              <!-- Zone de document : Fichier sélectionné OU Fichier existant enregistré OU Zone de sélection -->
              <div class="mt-3">
                <!-- 1. CAS : Nouveau fichier sélectionné pour remplacement ou premier envoi -->
                <div
                  v-if="files[doc.document_key]"
                  class="border-2 border-dashed border-emerald-500/70 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl p-4 flex items-center justify-between gap-3 transition-all"
                >
                  <div class="flex items-center gap-3 text-left overflow-hidden">
                    <div class="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div class="overflow-hidden">
                      <div class="flex items-center gap-2">
                        <p class="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {{ files[doc.document_key].name }}
                        </p>
                        <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                          Nouveau
                        </span>
                      </div>
                      <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {{ formatFileSize(files[doc.document_key].size) }} • Prêt à être enregistré
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    @click.stop="removeFile(doc.document_key)"
                    class="px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                    title="Annuler ce remplacement"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Annuler</span>
                  </button>
                </div>

                <!-- 2. CAS : Document déjà fourni et enregistré en base -->
                <div
                  v-else-if="getExistingDoc(doc.document_key)"
                  @dragover.prevent="dragStates[doc.document_key] = true"
                  @dragleave.prevent="dragStates[doc.document_key] = false"
                  @drop.prevent="handleFileDrop($event, doc.document_key)"
                  class="border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all"
                  :class="dragStates[doc.document_key] ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30' : 'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50'"
                >
                  <div class="flex items-center gap-3.5 w-full sm:w-auto overflow-hidden">
                    <!-- Miniature image si photo, sinon icône document -->
                    <div v-if="doc.is_photo" class="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 shrink-0 bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <img
                        :src="getDocumentUrl(getExistingDoc(doc.document_key))"
                        :alt="doc.nom_affichage"
                        class="w-full h-full object-cover"
                        @error="$event.target.style.display='none'"
                      />
                    </div>
                    <div v-else class="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/30">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>

                    <div class="overflow-hidden">
                      <div class="flex items-center gap-2">
                        <p class="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {{ doc.nom_affichage }}
                        </p>
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                          Fichier enregistré
                        </span>
                      </div>
                      <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Ce document est enregistré dans votre dossier. Vous pouvez le visualiser ou le remplacer si nécessaire.
                      </p>
                    </div>
                  </div>

                  <!-- Actions : Voir ou Remplacer -->
                  <div class="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                    <a
                      :href="getDocumentUrl(getExistingDoc(doc.document_key))"
                      target="_blank"
                      class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 shadow-sm transition-all"
                    >
                      <svg class="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>Visualiser</span>
                    </a>

                    <button
                      type="button"
                      :disabled="isDemandeEnAttente"
                      @click="triggerDocInput(doc.document_key)"
                      class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      :title="isDemandeEnAttente ? 'Demande en cours d\'examen' : 'Remplacer ce fichier'"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span>{{ isDemandeEnAttente ? 'En attente' : 'Remplacer' }}</span>
                    </button>
                  </div>
                </div>

                <!-- 3. CAS : Aucun document fourni -> Zone de dépôt / sélection initiale -->
                <div
                  v-else
                  @dragover.prevent="!isDemandeEnAttente && (dragStates[doc.document_key] = true)"
                  @dragleave.prevent="dragStates[doc.document_key] = false"
                  @drop.prevent="!isDemandeEnAttente && handleFileDrop($event, doc.document_key)"
                  @click="!isDemandeEnAttente && triggerDocInput(doc.document_key)"
                  class="group relative border-2 border-dashed rounded-xl p-5 text-center transition-all duration-200"
                  :class="[
                    isDemandeEnAttente
                      ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 cursor-not-allowed opacity-60'
                      : dragStates[doc.document_key]
                      ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-900/30 cursor-pointer'
                      : isDocMissing(doc.document_key)
                      ? 'border-amber-400/80 bg-white dark:bg-slate-800/80 hover:border-amber-500 cursor-pointer'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/60 hover:border-indigo-400 hover:bg-slate-50/50 dark:hover:bg-slate-800 cursor-pointer'
                  ]"
                >
                  <div class="flex flex-col items-center justify-center py-2 space-y-2">
                    <div
                      class="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                      :class="isDemandeEnAttente ? 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500' : dragStates[doc.document_key] ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600' : 'bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30'"
                    >
                      <svg v-if="isDemandeEnAttente" class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>

                    <div>
                      <p v-if="isDemandeEnAttente" class="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Ajout verrouillé pendant l'examen de votre demande
                      </p>
                      <p v-else class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <span class="text-indigo-600 dark:text-indigo-400 hover:underline">Cliquez pour choisir un fichier</span> ou glissez-déposez ici
                      </p>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {{ getFormatsLabel(doc.accepted_formats) }} (Max 10 Mo)
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Input caché commun lié à ce document -->
                <input
                  :ref="el => setInputRef(el, doc.document_key)"
                  type="file"
                  :accept="getAcceptedTypes(doc.accepted_formats)"
                  @change="handleFileUpload($event, doc.document_key)"
                  class="hidden"
                />
              </div>
            </div>
          </div>
        </div>

        </fieldset>

        <!-- Barre d'action moderne et équilibrée -->
        <div class="sticky bottom-4 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-3.5 sm:p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3">
          <!-- Action secondaire à gauche : Vérifier plus tard -->
          <NuxtLink
            to="/"
            class="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-600/80 active:scale-[0.98] transition-all"
          >
            <svg class="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Vérifier plus tard</span>
          </NuxtLink>

          <!-- Si demande en attente : Information et blocage des boutons -->
          <div v-if="isDemandeEnAttente" class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-700/80 text-amber-800 dark:text-amber-300 text-xs font-semibold">
              <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Demande en cours d'examen par l'administration</span>
            </div>
            <button
              type="button"
              disabled
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-80"
              title="Votre demande est en attente de traitement par l'administration"
            >
              <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Enregistrement bloqué</span>
            </button>
          </div>

          <!-- Actions principales quand aucune demande n'est en cours -->
          <div v-else class="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
            <!-- Option 1 : Tout est exact -->
            <button
              type="button"
              @click="handleConfirmProfile"
              :disabled="isConfirming || isSubmitting"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-700/80 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span v-if="isConfirming" class="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
              <svg v-else class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ isConfirming ? 'Confirmation...' : 'Mes informations sont correctes' }}</span>
            </button>

            <!-- Option 2 : Enregistrer les modifications -->
            <button
              type="submit"
              :disabled="isSubmitting || isConfirming || !!dateError"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] shadow-md shadow-indigo-500/25 dark:shadow-indigo-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span v-if="isSubmitting" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span>{{ isSubmitting ? 'Enregistrement...' : 'Enregistrer mon profil' }}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useEtudiantStore } from '~~/stores/etudiant';
import { useLoginStore } from '~~/stores/login';
import { getStorageBaseUrl } from '~~/app/utils/storageUrl';

const etudiantStore = useEtudiantStore();
const loginStore = useLoginStore();

const isLoadingData = ref(true);
const isSubmitting = ref(false);
const isConfirming = ref(false);

const matricule = ref('');
const profilVerifieAt = ref(null);
const derniereDemande = ref(null);
const isDemandeEnAttente = computed(() => derniereDemande.value?.statut === 'en_attente');

const champsManquants = ref([]);
const documentsRequis = ref([]);
const documentsSoumis = ref([]);

const files = reactive({});
const dragStates = reactive({});
const fileInputs = reactive({});

const setInputRef = (el, docKey) => {
  if (el) {
    fileInputs[docKey] = el;
  }
};

const triggerDocInput = (docKey) => {
  if (isDemandeEnAttente.value) return;
  if (fileInputs[docKey]) {
    fileInputs[docKey].click();
  }
};

const handleFileDrop = (event, docKey) => {
  if (isDemandeEnAttente.value) return;
  dragStates[docKey] = false;
  const droppedFiles = event.dataTransfer?.files;
  if (droppedFiles && droppedFiles.length > 0) {
    files[docKey] = droppedFiles[0];
  }
};

const removeFile = (docKey) => {
  delete files[docKey];
  if (fileInputs[docKey]) {
    fileInputs[docKey].value = '';
  }
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'Ko', 'Mo', 'Go'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getFormatsLabel = (format) => {
  if (format === 'image') return 'Images autorisées (JPG, PNG, JPEG)';
  if (format === 'pdf') return 'Fichier PDF uniquement';
  return 'Tous formats de documents acceptés (PDF, JPG, PNG)';
};

const form = reactive({
  nom: '',
  prenom: '',
  nom_jeune_fille: '',
  genre: '',
  date_naissance: '',
  lieu_naissance: '',
  nationalite: '',
  tel: '',
  email: '',
  biographie: '',

  // Tuteur
  tuteur_nom: '',
  tuteur_prenom: '',
  tuteur_tel: '',
  tuteur_email: '',
  tuteur_profession: '',
  tuteur_adresse: '',

  // Responsable financier
  meme_responsable: true,
  responsable_nom: '',
  responsable_prenom: '',
  responsable_tel: '',
  responsable_email: '',
  responsable_adresse: '',
});

const maxDateNaissance = computed(() => {
  // L'étudiant doit avoir au minimum 10 ans
  const d = new Date();
  d.setFullYear(d.getFullYear() - 10);
  return d.toISOString().split('T')[0];
});

const dateError = computed(() => {
  if (!form.date_naissance) return '';
  const selected = new Date(form.date_naissance);
  const today = new Date();
  if (selected > today) {
    return 'La date de naissance ne peut pas être dans le futur.';
  }
  const ageDiff = today.getFullYear() - selected.getFullYear();
  if (ageDiff < 10) {
    return 'L\'étudiant doit avoir au moins 10 ans.';
  }
  return '';
});

const missingCount = computed(() => {
  return champsManquants.value.length;
});

const isFieldMissing = (field) => {
  return champsManquants.value.includes(field);
};

const isDocMissing = (docKey) => {
  return champsManquants.value.includes('doc_' + docKey);
};

const getDocumentUrl = (doc) => {
  if (!doc) return '#';
  const path = doc.file_path || doc.raw_path || '';
  if (!path) return '#';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    if (path.includes('ngrok-free.dev') || path.includes('localhost:8000') || path.includes('127.0.0.1:8000')) {
      const storageIdx = path.indexOf('/storage/');
      if (storageIdx !== -1) {
        return `${getStorageBaseUrl()}${path.substring(storageIdx)}`;
      }
    }
    return path;
  }
  const cleanPath = path.startsWith('/storage/') ? path : `/storage/${path.replace(/^\/+/, '')}`;
  return `${getStorageBaseUrl()}${cleanPath}`;
};

const getExistingDoc = (docKey) => {
  const doc = documentsSoumis.value.find((d) => d.document_key === docKey);
  if (doc) return doc;
  if (derniereDemande.value?.documents && derniereDemande.value.documents[docKey]) {
    return {
      document_key: docKey,
      file_path: derniereDemande.value.documents[docKey],
      statut: derniereDemande.value.statut,
      is_en_attente: true,
    };
  }
  return null;
};

const getAcceptedTypes = (format) => {
  if (format === 'image') return 'image/*';
  if (format === 'pdf') return 'application/pdf';
  return '*/*';
};

const handleFileUpload = (event, docKey) => {
  const file = event.target.files[0];
  if (file) {
    files[docKey] = file;
  } else {
    delete files[docKey];
  }
};

const loadProfileData = async () => {
  isLoadingData.value = true;
  try {
    const data = await etudiantStore.fetchProfilCompletion();
    champsManquants.value = data.champs_manquants || [];
    documentsRequis.value = data.documents_requis || [];
    documentsSoumis.value = data.documents_soumis || [];
    profilVerifieAt.value = data.profil_verifie_at || null;
    derniereDemande.value = data.derniere_demande || null;

    if (data.etudiant) {
      matricule.value = data.etudiant.matricule || '';
      form.nom = data.etudiant.nom || '';
      form.prenom = data.etudiant.prenom || '';
      form.nom_jeune_fille = data.etudiant.nom_jeune_fille || '';
      form.genre = data.etudiant.genre || '';
      form.date_naissance = data.etudiant.date_naissance || '';
      form.lieu_naissance = data.etudiant.lieu_naissance || '';
      form.nationalite = data.etudiant.nationalite || '';
      form.tel = data.etudiant.tel || '';
      form.email = data.etudiant.email || '';
      form.biographie = data.etudiant.biographie || '';
    }

    if (data.tuteur) {
      form.tuteur_nom = data.tuteur.nom || '';
      form.tuteur_prenom = data.tuteur.prenom || '';
      form.tuteur_tel = data.tuteur.tel || '';
      form.tuteur_email = data.tuteur.email || '';
      form.tuteur_profession = data.tuteur.profession || '';
      form.tuteur_adresse = data.tuteur.adresse || '';
    }

    if (data.responsable) {
      form.responsable_nom = data.responsable.nom || '';
      form.responsable_prenom = data.responsable.prenom || '';
      form.responsable_tel = data.responsable.tel || '';
      form.responsable_email = data.responsable.email || '';
      form.responsable_adresse = data.responsable.adresse || '';
      form.meme_responsable = false;
    } else {
      form.meme_responsable = true;
    }
  } catch (error) {
    console.error('Erreur chargement profil:', error);
  } finally {
    isLoadingData.value = false;
  }
};

const { $toastr } = useNuxtApp();

// Action 1 : L'étudiant valide que tout est déjà correct
const handleConfirmProfile = async () => {
  if (isDemandeEnAttente.value) {
    if ($toastr) $toastr.warning('Votre demande est déjà en attente de validation par l\'administration.');
    return;
  }

  isConfirming.value = true;
  try {
    const res = await etudiantStore.confirmerProfilCorrect();
    sessionStorage.setItem('etudiant_verification_prompted', 'true');

    if (res.user) {
      const userStr = localStorage.getItem('user');
      let currentUser = userStr ? JSON.parse(userStr) : {};
      currentUser = {
        ...currentUser,
        ...res.user,
        profil_verifie_at: new Date().toISOString(),
      };
      localStorage.setItem('user', JSON.stringify(currentUser));
    }

    if ($toastr) {
      $toastr.success('Merci ! Vos informations ont été confirmées avec succès.');
    }
    navigateTo('/');
  } catch (error) {
    console.error('Erreur confirmation profil:', error);
    const msg = error?.response?.data?.message || 'Une erreur est survenue lors de la confirmation.';
    if ($toastr) {
      $toastr.error(msg);
    }
  } finally {
    isConfirming.value = false;
  }
};

// Action 2 : L'étudiant enregistre ses modifications pour soumission à l'administration
const handleSubmit = async () => {
  if (isDemandeEnAttente.value) {
    if ($toastr) $toastr.warning('Votre demande de modification est déjà en cours de validation par l\'administration.');
    return;
  }

  if (dateError.value) {
    if ($toastr) $toastr.warning(dateError.value);
    return;
  }

  isSubmitting.value = true;
  try {
    const fd = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null && form[key] !== undefined) {
        if (typeof form[key] === 'boolean') {
          fd.append(key, form[key] ? '1' : '0');
        } else {
          fd.append(key, form[key]);
        }
      }
    });

    Object.keys(files).forEach((docKey) => {
      if (files[docKey]) {
        fd.append(`documents[${docKey}]`, files[docKey]);
      }
    });

    const res = await etudiantStore.updateMonProfil(fd);
    sessionStorage.setItem('etudiant_verification_prompted', 'true');

    // Mettre à jour l'utilisateur stocké
    if (res.user) {
      const userStr = localStorage.getItem('user');
      let currentUser = userStr ? JSON.parse(userStr) : {};
      currentUser = {
        ...currentUser,
        ...res.user,
        profil_verifie_at: new Date().toISOString(),
      };
      localStorage.setItem('user', JSON.stringify(currentUser));
    }

    if ($toastr) {
      $toastr.success('Vos informations ont été enregistrées et soumises pour validation à l\'administration.');
    }
    await loadProfileData();
  } catch (error) {
    console.error('Erreur soumission profil:', error);
    const errorMsg = error?.response?.data?.message || 'Une erreur est survenue lors de la mise à jour.';
    if ($toastr) {
      $toastr.error(errorMsg);
    } else {
      alert(errorMsg);
    }
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  loadProfileData();
});
</script>
