<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
    
    <div class="max-w-7xl mx-auto space-y-6">
      
      <!-- Top Breadcrumb & Actions Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200/80 dark:border-gray-800">
        <div class="flex items-center gap-3">
          <NuxtLink 
            :to="`/candidatures/${route.params.slug}`" 
            class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            <span>Retour au dossier candidate</span>
          </NuxtLink>
          <span class="text-gray-300 dark:text-gray-700">/</span>
          <span class="text-xs font-bold text-gray-900 dark:text-white">Inscription Définitive</span>
        </div>

        <div class="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full shadow-2xs text-[11px] font-semibold text-gray-700 dark:text-gray-300">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Session d'enrôlement active</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <div class="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p class="text-xs font-semibold text-gray-500 dark:text-gray-400">Chargement du dossier candidat...</p>
      </div>

      <!-- Main Content Card -->
      <div v-else-if="candidat" class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xs divide-y divide-gray-100 dark:divide-gray-800">
        
        <!-- Candidate Identity Header -->
        <div class="p-6 sm:p-8 bg-gradient-to-r from-gray-50/80 to-white dark:from-gray-900 dark:to-gray-900">
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <!-- Photo / Initial Avatar -->
            <div class="relative shrink-0">
              <div class="w-16 h-16 rounded-full overflow-hidden bg-slate-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xl font-bold text-gray-700 dark:text-gray-200 shadow-2xs">
                <img v-if="candidat.album?.photo" :src="getFullUrl(candidat.album.photo)" class="w-full h-full object-cover" />
                <span v-else>{{ candidat.nom?.charAt(0) }}{{ candidat.prenom?.charAt(0) }}</span>
              </div>
            </div>
            
            <!-- Details -->
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-3 mb-1">
                <h1 class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{{ candidat.nom }} {{ candidat.prenom }}</h1>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Candidat Admis
                </span>
              </div>

              <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Procédure d'inscription académique &bull; Année <span class="font-semibold text-gray-700 dark:text-gray-300">{{ currentPromotion }}</span>
              </p>
              
              <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-600 dark:text-gray-300">
                <div class="flex items-center gap-1.5">
                  <span class="text-gray-400 font-medium">Niveau:</span>
                  <span class="font-semibold text-gray-900 dark:text-white">{{ candidat.niveau?.libelle || 'N/A' }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-gray-400 font-medium">Filière:</span>
                  <span class="font-semibold text-gray-900 dark:text-white">{{ candidat.filiere?.nom || 'N/A' }}</span>
                </div>
                <div v-if="candidat.genre" class="flex items-center gap-1.5">
                  <span class="text-gray-400 font-medium">Genre:</span>
                  <span class="font-semibold text-gray-900 dark:text-white">{{ candidat.genre }}</span>
                </div>
                <div v-if="candidat.email" class="flex items-center gap-1.5">
                  <span class="text-gray-400 font-medium">Email:</span>
                  <span class="font-medium text-gray-700 dark:text-gray-300">{{ candidat.email }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Body -->
        <div class="p-6 sm:p-8 space-y-8">
          
          <!-- Section 1: Mode de Formation -->
          <div class="space-y-4">
            <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                <span class="w-5 h-5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-semibold">1</span>
                <span>Mode d'Enseignement</span>
              </h3>
              <span class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-indigo-900">
                Mode sélectionné : {{ enrollForm.mode_formation }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Option Présentiel -->
              <div 
                @click="enrollForm.mode_formation = 'Présentiel'"
                class="cursor-pointer p-4 rounded-xl border transition-all flex items-start gap-3"
                :class="enrollForm.mode_formation === 'Présentiel' 
                  ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-600 dark:border-indigo-500 ring-1 ring-indigo-600/20' 
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'"
              >
                <div class="mt-0.5">
                  <div 
                    class="w-4 h-4 rounded-full border flex items-center justify-center"
                    :class="enrollForm.mode_formation === 'Présentiel' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 dark:border-gray-700'"
                  >
                    <div v-if="enrollForm.mode_formation === 'Présentiel'" class="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-gray-900 dark:text-white">Présentiel (Sur campus)</h4>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Cours dispensés en salle au sein des locaux de l'établissement.</p>
                </div>
              </div>

              <!-- Option En ligne -->
              <div 
                @click="enrollForm.mode_formation = 'En ligne'"
                class="cursor-pointer p-4 rounded-xl border transition-all flex items-start gap-3"
                :class="enrollForm.mode_formation === 'En ligne' 
                  ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-600 dark:border-indigo-500 ring-1 ring-indigo-600/20' 
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'"
              >
                <div class="mt-0.5">
                  <div 
                    class="w-4 h-4 rounded-full border flex items-center justify-center"
                    :class="enrollForm.mode_formation === 'En ligne' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 dark:border-gray-700'"
                  >
                    <div v-if="enrollForm.mode_formation === 'En ligne'" class="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-gray-900 dark:text-white">En ligne (À distance)</h4>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Formation accessible à distance via la plateforme e-learning.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Affectation Administrative -->
          <div class="space-y-4">
            <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                <span class="w-5 h-5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-semibold">2</span>
                <span>Affectation & Structure Administrative</span>
              </h3>
            </div>

            <!-- Group Selection -->
            <div class="space-y-2">
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Groupe d'étude obligatoire <span class="text-rose-500">*</span>
              </label>

              <div v-if="filteredGroups.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div 
                  v-for="g in filteredGroups" 
                  :key="g.id" 
                  @click="enrollForm.group_id = g.id"
                  class="cursor-pointer p-3.5 rounded-lg border transition-all flex items-center justify-between"
                  :class="enrollForm.group_id === g.id 
                    ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-600 dark:border-indigo-500 ring-1 ring-indigo-600/20' 
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'"
                >
                  <div class="min-w-0 pr-2">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">{{ g.code }}</span>
                    <h4 class="text-xs font-semibold text-gray-900 dark:text-white truncate">{{ g.nom }}</h4>
                  </div>
                  <div 
                    class="w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
                    :class="enrollForm.group_id === g.id ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 dark:border-gray-700'"
                  >
                    <svg v-if="enrollForm.group_id === g.id" class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                  </div>
                </div>
              </div>
              <div v-else class="p-4 text-center border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50/50 dark:bg-gray-900">
                <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Aucun groupe disponible pour ce niveau académique.</p>
              </div>
            </div>

            <!-- Partner & Année Scolaire -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">Partenaire Associé (Optionnel)</label>
                <Select 
                  v-model="enrollForm.advertiser_id" 
                  :options="advertiserStore.advertisers" 
                  optionLabel="nom" 
                  optionValue="id" 
                  placeholder="Sélectionner un partenaire" 
                  filter 
                  class="w-full prime-select-enroll"
                />
              </div>

              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">Année Académique *</label>
                <Select 
                  v-model="enrollForm.annee_scolaire_id" 
                  :options="anneeScolaireStore.annneescolaires || []" 
                  optionLabel="nom" 
                  optionValue="id" 
                  placeholder="Sélectionner une année" 
                  class="w-full prime-select-enroll"
                />
              </div>
            </div>
          </div>

          <!-- Section 3: Identifiants Académiques -->
          <div class="space-y-4">
            <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                <span class="w-5 h-5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-semibold">3</span>
                <span>Compte & Identifiants Étudiant</span>
              </h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Matricule -->
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">Matricule Étudiant *</label>
                <input 
                  type="text" 
                  v-model="enrollForm.matricule" 
                  class="w-full h-10 px-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-xs font-mono font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all" 
                  placeholder="Ex: 001-ESC-2026" 
                />
              </div>

              <!-- Email Institutionnel -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">Email Institutionnel</label>
                  <button 
                    @click="usePersonalEmail" 
                    type="button" 
                    class="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors"
                  >
                    Email personnel
                  </button>
                </div>
                <input 
                  type="email" 
                  v-model="enrollForm.email_pro" 
                  class="w-full h-10 px-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all" 
                  placeholder="prenom.nom@ecole.com" 
                />
              </div>

              <!-- Mot de passe -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">Mot de passe provisoire</label>
                  <button 
                    @click="generatePassword" 
                    type="button" 
                    class="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors"
                  >
                    Régénérer
                  </button>
                </div>
                <input 
                  type="text" 
                  v-model="enrollForm.password" 
                  class="w-full h-10 px-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-xs font-mono font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all" 
                  placeholder="Mot de passe" 
                />
              </div>
            </div>
          </div>

          <!-- Section 4: Bourse d'Étude -->
          <div class="space-y-4">
            <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                <span class="w-5 h-5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-semibold">4</span>
                <span>Financement & Bourse d'Étude</span>
              </h3>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">Bourse ou Réduction Tarifaire</label>
              <Select 
                v-model="enrollForm.bourse_id" 
                :options="bourseStore.bourses" 
                optionLabel="nom" 
                optionValue="id" 
                placeholder="Aucune bourse appliquée (Tarif standard)" 
                filter 
                class="w-full prime-select-enroll"
              >
                <template #option="slotProps">
                  <div class="flex items-center justify-between w-full">
                    <span class="font-medium text-xs">{{ slotProps.option.nom }}</span>
                    <span class="text-[10px] font-bold text-indigo-700 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-300 px-2 py-0.5 rounded">
                      {{ slotProps.option.type === 'pourcentage' ? '-' + slotProps.option.valeur + '%' : '-' + slotProps.option.valeur + ' FCFA' }}
                    </span>
                  </div>
                </template>
              </Select>
            </div>
          </div>

          <!-- Section 5: Frais d'Inscription Initial -->
          <div class="space-y-4">
            <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                <span class="w-5 h-5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-semibold">5</span>
                <span>Règlement des Frais d'Inscription</span>
              </h3>
              
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold" :class="enrollForm.frais_inscription_paye ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'">
                  {{ enrollForm.frais_inscription_paye ? 'Frais réglés à l\'enrôlement' : 'Non réglés à l\'enrôlement' }}
                </span>
                <Switch
                  v-model="enrollForm.frais_inscription_paye"
                  :class="enrollForm.frais_inscription_paye ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'"
                  class="relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                >
                  <span class="sr-only">Statut des frais d'inscription</span>
                  <span
                    aria-hidden="true"
                    :class="enrollForm.frais_inscription_paye ? 'translate-x-5' : 'translate-x-0'"
                    class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-2xs ring-0 transition duration-200 ease-in-out"
                  />
                </Switch>
              </div>
            </div>

            <div v-if="enrollForm.frais_inscription_paye" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">Mode de paiement</label>
                <Select 
                  v-model="enrollForm.mode_paiement" 
                  :options="[
                    { label: 'Espèces / Cash', value: 'especes' },
                    { label: 'Mobile Money (Moov/Tmoney)', value: 'mobile_money' },
                    { label: 'Virement Bancaire', value: 'virement' }
                  ]" 
                  optionLabel="label" 
                  optionValue="value" 
                  placeholder="Sélectionner le mode" 
                  class="w-full prime-select-enroll"
                />
              </div>

              <div class="space-y-1.5" v-if="enrollForm.mode_paiement === 'mobile_money'">
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">Frais de retrait Mobile Money</label>
                <input 
                  type="number" 
                  v-model="enrollForm.frais_retrait" 
                  class="w-full h-10 px-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 outline-none" 
                  placeholder="0" 
                />
              </div>
            </div>
          </div>

        </div>

        <!-- Executive Financial Summary & Action Footer -->
        <div class="p-6 sm:p-8 bg-gray-50/70 dark:bg-gray-900/90 rounded-b-xl border-t border-gray-200 dark:border-gray-800 space-y-6">
          <h3 class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Résumé Financier de l'Enrôlement
          </h3>

          <!-- Financial Cards Grid -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <!-- Mode -->
            <div class="p-4 bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800">
              <span class="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-1">Mode de Formation</span>
              <span class="text-xs font-bold text-gray-900 dark:text-white">{{ enrollForm.mode_formation }}</span>
            </div>

            <!-- Groupe -->
            <div class="p-4 bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800">
              <span class="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-1">Groupe d'Étude</span>
              <span class="text-xs font-bold" :class="enrollForm.group_id ? 'text-gray-900 dark:text-white' : 'text-amber-600 dark:text-amber-400'">
                {{ filteredGroups.find(g => g.id === enrollForm.group_id)?.nom || 'Non sélectionné' }}
              </span>
            </div>

            <!-- Frais Scolarité -->
            <div class="p-4 bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800">
              <div class="flex items-center justify-between mb-1">
                <span class="text-[11px] font-semibold text-gray-500 dark:text-gray-400">Scolarité Net</span>
                <span v-if="enrollForm.bourse_id" class="text-[9px] font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded">Bourse</span>
              </div>
              <div class="text-base font-bold font-mono text-gray-900 dark:text-white">
                {{ finalFraisScolariteAttendu.toLocaleString() }} <span class="text-xs font-semibold text-gray-500">FCFA</span>
              </div>
            </div>

            <!-- Frais d'Inscription -->
            <div class="p-4 bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800">
              <div class="flex items-center justify-between mb-1">
                <span class="text-[11px] font-semibold text-gray-500 dark:text-gray-400">Frais d'Inscription</span>
                <span v-if="!enrollForm.frais_inscription_paye" class="text-[9px] font-bold px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">Non payé</span>
              </div>
              <div class="text-base font-bold font-mono" :class="enrollForm.frais_inscription_paye ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'">
                {{ activeFraisMontant.toLocaleString() }} <span class="text-xs font-semibold text-gray-500">FCFA</span>
              </div>
            </div>
          </div>

          <!-- Alert / Action Row -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div v-if="!enrollForm.group_id" class="flex items-center gap-2 text-xs font-medium text-amber-700 dark:text-amber-400">
              <svg class="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Veuillez sélectionner un groupe d'étude ci-dessus pour activer la validation.</span>
            </div>
            <p v-else class="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Veuillez confirmer l'exactitude des informations saisies avant de valider l'inscription.
            </p>

            <Can action="inscrire-etudiant-candidature">
              <button
                @click="confirmEnrollment"
                :disabled="!enrollForm.group_id || isSubmitting"
                class="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg font-semibold text-xs uppercase tracking-wider transition-colors shadow-2xs flex items-center justify-center gap-2 disabled:opacity-50 shrink-0 cursor-pointer"
              >
                <span v-if="isSubmitting" class="flex items-center gap-2">
                  <svg class="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Traitement...
                </span>
                <span v-else class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Valider l'Enrôlement
                </span>
              </button>
            </Can>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { useCandidatureStore } from '~~/stores/candidature'
import { useAdvertiserStore } from '~~/stores/adverstiser'
import { useBourseStore } from '~~/stores/bourse'
import { useGroupeStore } from '~~/stores/group'
import { useFraisStore } from '~~/stores/frais-de-scolarite'
import { useFraisInscriptionStore } from '~~/stores/frais-inscription'
import { useAnneScolaireStore } from '~~/stores/annee-scolaire'
import { getStorageBaseUrl } from '~/utils/storageUrl'
import { Switch } from '@headlessui/vue'

const route = useRoute()
const router = useRouter()
const candidatureStore = useCandidatureStore()
const advertiserStore = useAdvertiserStore()
const bourseStore = useBourseStore()
const groupeStore = useGroupeStore()
const fraisStore = useFraisStore()
const fraisInscriptionStore = useFraisInscriptionStore()
const anneeScolaireStore = useAnneScolaireStore()

const { $toastr, $swal } = useNuxtApp()

// States
const loading = ref(true)
const isSubmitting = ref(false)
const candidat = ref(null)

const enrollForm = ref({
  group_id: '',
  advertiser_id: null,
  annee_scolaire_id: null,
  bourse_id: null,
  mode_formation: 'Présentiel',
  frais_inscription_paye: true,
  mode_paiement: 'especes',
  frais_retrait: 0,
  matricule: '',
  email_pro: '',
  password: ''
})

const generateEmailPro = (candidatData) => {
    if (!candidatData) return '';
    let prenom = candidatData.prenom ? candidatData.prenom.split(' ')[0].toLowerCase() : '';
    let nom = candidatData.nom ? candidatData.nom.split(' ').join('').toLowerCase() : '';
    prenom = prenom.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    nom = nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const domain = candidatData.email_domain || 'escen.university';
    return `${prenom}.${nom}@${domain}`;
}

const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
    let password = "";
    for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    enrollForm.value.password = password;
}

const usePersonalEmail = () => {
    if (candidat.value && candidat.value.email) {
        enrollForm.value.email_pro = candidat.value.email;
    }
}

watch(() => enrollForm.value.annee_scolaire_id, async (newId, oldId) => {
    if (!newId || !oldId) return;
    
    const annee = anneeScolaireStore.annneescolaires?.find(a => a.id === newId);
    if (annee && annee.date_debut) {
        const year = new Date(annee.date_debut).getFullYear();
        try {
            const res = await axios.get(`/candidature/${year}/generer-matricule`, candidatureStore.authHeaders());
            if (res.data && res.data.matricule) {
                enrollForm.value.matricule = res.data.matricule;
                $toastr.info("Matricule mis à jour pour l'année sélectionnée.");
            }
        } catch (e) {
            console.error('Erreur génération matricule:', e);
        }
    }
});

// Fetching
const init = async () => {
    loading.value = true
    try {
        const slug = route.params.slug
        const res = await candidatureStore.fetchCandidatureDetail(slug)
        if (res) {
            candidat.value = res
            enrollForm.value.advertiser_id = res.advertiser_id || null
            enrollForm.value.annee_scolaire_id = res.active_annee_scolaire?.id || null
            enrollForm.value.matricule = res.next_matricule || ''
            enrollForm.value.mode_formation = res.mode_formation || 'Présentiel'
            enrollForm.value.email_pro = generateEmailPro(res)
            generatePassword()
            
            await Promise.all([
              groupeStore.fetchGroupes({ niveau_id: res.niveau_id || res.niveau?.id }),
              fraisStore.fetchFrais(),
              advertiserStore.fetchAdvertisers(),
              bourseStore.fetchBourses(),
              fraisInscriptionStore.fetchFrais(),
              anneeScolaireStore.fetchAnneeScolaire()
            ])

            if (filteredGroups.value.length > 0 && !enrollForm.value.group_id) {
                enrollForm.value.group_id = filteredGroups.value[0].id
            }

            if (res.etudiant || res.etudiant_id) {
                $toastr.info("Ce candidat est déjà inscrit.")
                const targetSlug = res.etudiant?.slug || res.etudiant_id
                router.push(`/admin/liste-des-etudiants/${targetSlug}/detail`)
                return
            }

            if (!res.dossier_valide) {
                $toastr.warning("Dossier non encore certifié.")
                router.push(`/candidatures/${slug}`)
            }
        } else {
            router.push('/candidatures/admis')
        }
    } catch (e) {
        console.error('Init error:', e)
        $toastr.error("Données inaccessibles.")
    } finally {
        loading.value = false
    }
}

// Helpers
const getFullUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${getStorageBaseUrl()}/storage/${path}`
}

const filteredGroups = computed(() => {
  if (!candidat.value) return []
  const targetNiveauId = candidat.value.niveau_id || candidat.value.niveau?.id;
  return groupeStore.groupes.filter(g => (g.niveau_id || g.niveau?.id) == targetNiveauId)
})

watch(filteredGroups, (groups) => {
  if (groups && groups.length > 0 && !enrollForm.value.group_id) {
    enrollForm.value.group_id = groups[0].id
  }
}, { immediate: true })

// Dynamically calculated tuition fee according to mode_formation, genre, filiere, niveau, annee
const matchedFraisScolarite = computed(() => {
  if (!candidat.value || !enrollForm.value.annee_scolaire_id) return 0
  const all = fraisStore.frais || []
  if (!all.length) return 0

  const formAnneeId = String(enrollForm.value.annee_scolaire_id)
  const formNiveauId = String(candidat.value.niveau_id || candidat.value.niveau?.id)
  const formFiliereId = (candidat.value.filiere_id || candidat.value.filiere?.id) ? String(candidat.value.filiere_id || candidat.value.filiere?.id) : null
  const formGenre = candidat.value.genre || 'Tous'
  const formMode = enrollForm.value.mode_formation || 'Présentiel'

  const getMode = (f) => {
    if (!f.mode_formation) return 'Tous'
    if (typeof f.mode_formation === 'object') return f.mode_formation.value || f.mode_formation.name || f.mode_formation.label || 'Tous'
    return String(f.mode_formation)
  }

  const getGenre = (f) => {
    if (!f.genre) return 'Tous'
    if (typeof f.genre === 'object') return f.genre.value || f.genre.name || f.genre.label || 'Tous'
    return String(f.genre)
  }

  const matchAnnee = (f) => String(f.annee_scolaire_id || f.annee_scolaire?.id) === formAnneeId
  const matchNiveau = (f) => String(f.niveau?.id || f.niveau_id) === formNiveauId
  const matchFiliere = (f) => {
    const filId = f.filiere?.id || f.filiere_id
    if (formFiliereId) return String(filId) === formFiliereId
    return !filId
  }

  // A fee record is ONLY compatible with formMode if its mode is formMode OR 'Tous'
  const matchModeExact = (f) => getMode(f) === formMode
  const matchModeTous = (f) => getMode(f) === formMode || getMode(f) === 'Tous' || !f.mode_formation

  // 1. Filière + Genre exact + Mode exact
  let match = all.find(f => matchAnnee(f) && matchNiveau(f) && matchFiliere(f) && getGenre(f) === formGenre && matchModeExact(f))
  
  // 2. Filière + Genre exact + Mode "Tous"
  if (!match) {
    match = all.find(f => matchAnnee(f) && matchNiveau(f) && matchFiliere(f) && getGenre(f) === formGenre && matchModeTous(f))
  }

  // 3. Filière + Genre "Tous" + Mode exact
  if (!match) {
    match = all.find(f => matchAnnee(f) && matchNiveau(f) && matchFiliere(f) && (getGenre(f) === 'Tous' || !getGenre(f)) && matchModeExact(f))
  }

  // 4. Filière + Genre "Tous" + Mode "Tous"
  if (!match) {
    match = all.find(f => matchAnnee(f) && matchNiveau(f) && matchFiliere(f) && (getGenre(f) === 'Tous' || !getGenre(f)) && matchModeTous(f))
  }

  // 5. Sans filière + Mode exact
  if (!match) {
    match = all.find(f => matchAnnee(f) && matchNiveau(f) && (!f.filiere_id && !f.filiere?.id) && matchModeExact(f))
  }

  // 6. Sans filière + Mode "Tous"
  if (!match) {
    match = all.find(f => matchAnnee(f) && matchNiveau(f) && (!f.filiere_id && !f.filiere?.id) && matchModeTous(f))
  }

  // 7. Niveau + Année + Mode compatible (strictement compatible)
  if (!match) {
    match = all.find(f => matchAnnee(f) && matchNiveau(f) && matchModeTous(f))
  }

  return match ? Number(match.montant) : 0
})

const finalFraisScolariteAttendu = computed(() => {
  const baseMontant = matchedFraisScolarite.value || 0
  
  if (!enrollForm.value.bourse_id) return baseMontant
  
  const selectedBourse = bourseStore.bourses?.find(b => b.id === enrollForm.value.bourse_id)
  if (!selectedBourse) return baseMontant
  
  if (selectedBourse.type === 'pourcentage') {
    const reduction = (baseMontant * Number(selectedBourse.valeur)) / 100
    return Math.max(0, baseMontant - reduction)
  } else {
    return Math.max(0, baseMontant - Number(selectedBourse.valeur))
  }
})

const activeFraisMontant = computed(() => {
  if (!enrollForm.value.frais_inscription_paye) return 0
  const activeFrais = fraisInscriptionStore.frais.find(f => f.active)
  return activeFrais ? activeFrais.montant : 0
})

const currentPromotion = computed(() => {
    const year = new Date().getFullYear()
    return `${year}-${year + 1}`
})

// Submission
const confirmEnrollment = async () => {
  const result = await $swal.fire({
    title: '<span class="text-indigo-600 uppercase font-bold tracking-wider text-base">Valider l\'Enrôlement ?</span>',
    html: `
      <div class="space-y-3 py-2 text-left">
        <p class="text-xs font-medium text-gray-600 dark:text-gray-300">
          Voulez-vous finaliser l'inscription définitive de <b class="text-gray-900 dark:text-white">${candidat.value.nom} ${candidat.value.prenom}</b> ?
        </p>
        <div class="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg border border-indigo-100 dark:border-indigo-900/40 text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
          <span>Mode de formation :</span>
          <span class="px-2 py-0.5 bg-indigo-600 text-white rounded-md text-[11px]">${enrollForm.value.mode_formation}</span>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'CONFIRMER L\'ENRÔLEMENT',
    cancelButtonText: 'ANNULER',
    confirmButtonColor: '#4f46e5',
    cancelButtonColor: '#9ca3af',
    reverseButtons: true
  })

  if (result.isConfirmed) {
    isSubmitting.value = true
    try {
      await candidatureStore.inscrireEtudiant(candidat.value.slug, enrollForm.value)
      $toastr.success('Étudiant enrôlé avec succès !')
      router.push(`/candidatures/admis`)
    } catch (e) {
      const errorMsg = e.response?.data?.message || 'Erreur lors de l\'enrôlement.'
      $toastr.error(errorMsg)
    } finally {
      isSubmitting.value = false
    }
  }
}

onMounted(() => {
  init()
})
</script>

<style scoped>
:deep(.prime-select-enroll) {
    background: #f9fafb !important;
    border: 1px solid #e5e7eb !important;
    border-radius: 0.5rem !important;
    height: 2.5rem !important;
    display: flex !important;
    align-items: center !important;
    transition: all 0.2s !important;
    font-size: 0.75rem !important;
    font-weight: 500 !important;
}

:deep(.prime-select-enroll:hover) {
    border-color: #d1d5db !important;
}

:deep(.prime-select-enroll.p-focus) {
    border-color: #4f46e5 !important;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
}

.dark :deep(.prime-select-enroll) {
    background: #030712 !important;
    border-color: #1f2937 !important;
    color: #f9fafb !important;
}
</style>
