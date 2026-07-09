<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-3 sm:p-4 md:p-6">
    <Breadcrumb
      :items="[{ label: 'Étudiants', to: '/admin/liste-des-etudiants' }, { label: 'Ajouter', to: null }]"
      title="Inscrire un nouvel étudiant"
      title-class="text-xl md:text-2xl font-bold text-gray-800 dark:text-white"
      spacing="mb-6"
    />

    <div>
      <form @submit.prevent="submitAddForm">
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">

          <!-- COLONNE GAUCHE : Formulaire (2/3) -->
          <div class="xl:col-span-2 space-y-5">

            <!-- Identité -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-50 dark:border-gray-700 bg-gradient-to-r from-indigo-50/50 to-transparent dark:from-indigo-900/10 flex items-center gap-3">
                <span class="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </span>
                <h3 class="font-semibold text-gray-800 dark:text-white">Identité & Contact</h3>
              </div>
              <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Nom <span class="text-red-500">*</span></label>
                  <input v-model="form.nom" type="text" required placeholder="Ex: DUPONT" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Prénom <span class="text-red-500">*</span></label>
                  <input v-model="form.prenom" type="text" required placeholder="Ex: Jean" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Matricule</label>
                  <input v-model="form.matricule" type="text" disabled placeholder="Ex: 2024001" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed outline-none text-sm" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Genre</label>
                  <Dropdown v-model="form.genre" :options="[{label:'Masculin',value:'Masculin'},{label:'Féminin',value:'Féminin'}]" optionLabel="label" optionValue="value" class="w-full" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Téléphone</label>
                  <div class="w-full intl-tel-wrapper">
                    <input
                      ref="phoneInput"
                      v-model="form.tel"
                      type="tel"
                      class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
                      placeholder="Téléphone principal"
                    />
                  </div>
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Email <span class="text-red-500">*</span></label>
                  <input v-model="form.email" type="email" required placeholder="jean.dupont@email.com" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Date de naissance</label>
                  <input v-model="form.date_naissance" type="date" :max="maxDateString" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Nationalité</label>
                  <NationaliteSelector v-model="form.nationalite" label="" />
                </div>
                <div class="space-y-1.5 sm:col-span-2">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Adresse géographique (lieu de résidence)</label>
                  <textarea v-model="form.adresse" rows="2" placeholder="Adresse complète" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm resize-none"></textarea>
                </div>
              </div>
            </div>

            <!-- Tuteur & Responsable -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-50 dark:border-gray-700 bg-gradient-to-r from-orange-50/50 to-transparent dark:from-orange-900/10 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="w-8 h-8 bg-orange-100 dark:bg-orange-900/40 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  </span>
                  <h3 class="font-semibold text-gray-800 dark:text-white">Tuteur & Responsable</h3>
                </div>
                <button type="button" @click="copyTuteurToResp" class="text-xs font-bold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors flex items-center gap-1.5 bg-orange-100/50 dark:bg-orange-900/30 px-3 py-1.5 rounded-lg border border-orange-200/50 dark:border-orange-800/50">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                  Copier le tuteur
                </button>
              </div>
              <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Nom du tuteur</label>
                  <input v-model="form.nom_tuteur" type="text" placeholder="Nom du tuteur" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Prénom du tuteur</label>
                  <input v-model="form.prenom_tuteur" type="text" placeholder="Prénom du tuteur" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Contact du tuteur</label>
                  <div class="w-full intl-tel-wrapper">
                    <input
                      ref="tuteurInput"
                      v-model="form.contact_tuteur"
                      type="tel"
                      class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm"
                      placeholder="Numéro"
                    />
                  </div>
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Profession du tuteur</label>
                  <input v-model="form.profession_tuteur" type="text" placeholder="Ex: Médecin" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Email du tuteur</label>
                  <input v-model="form.email_tuteur" type="email" placeholder="tuteur@email.com" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm" />
                </div>
                <div class="space-y-1.5 sm:col-span-2">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Adresse du tuteur</label>
                  <input v-model="form.adresse_tuteur" type="text" placeholder="Quartier, Ville..." class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm" />
                </div>
                
                <div class="sm:col-span-2 border-t border-gray-100 dark:border-gray-700 mt-2 pt-4"></div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Nom du responsable</label>
                  <input v-model="form.nom_responsable" type="text" placeholder="Nom du responsable légal/financier" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Prénom du responsable</label>
                  <input v-model="form.prenom_responsable" type="text" placeholder="Prénom du responsable légal/financier" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Contact du responsable</label>
                  <div class="w-full intl-tel-wrapper">
                    <input
                      ref="respInput"
                      v-model="form.contact_responsable"
                      type="tel"
                      class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm"
                      placeholder="Numéro"
                    />
                  </div>
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Profession du responsable</label>
                  <input v-model="form.profession_responsable" type="text" placeholder="Ex: Commerçant" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Email du responsable</label>
                  <input v-model="form.email_responsable" type="email" placeholder="responsable@email.com" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm" />
                </div>
                <div class="space-y-1.5 sm:col-span-2">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Adresse du responsable</label>
                  <input v-model="form.adresse_responsable" type="text" placeholder="Quartier, Ville..." class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm" />
                </div>
              </div>
            </div>

            <!-- Cursus -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-50 dark:border-gray-700 bg-gradient-to-r from-emerald-50/50 to-transparent dark:from-emerald-900/10 flex items-center gap-3">
                <span class="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13"/></svg>
                </span>
                <h3 class="font-semibold text-gray-800 dark:text-white">Cursus Académique</h3>
              </div>
              <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div class="space-y-1.5 sm:col-span-2">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Année Scolaire</label>
                  <Dropdown v-model="form.annee_scolaire_id" :options="anneeOptions" optionLabel="label" optionValue="value" placeholder="Sélectionner" filter class="w-full" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Filière <span class="text-red-500">*</span></label>
                  <Dropdown v-model="form.filiere_id" :options="filiereOptions" optionLabel="label" optionValue="value" required placeholder="Sélectionner" filter class="w-full" @change="form.niveau_id = null; form.group_id = null" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Niveau <span class="text-red-500">*</span></label>
                  <Dropdown v-model="form.niveau_id" :options="niveauOptions" optionLabel="label" optionValue="value" required placeholder="Sélectionner" filter class="w-full" @change="form.group_id = null" />
                </div>
                <div class="space-y-1.5 sm:col-span-2">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Groupe <span class="text-red-500">*</span></label>
                  <Dropdown v-model="form.group_id" :options="groupeOptions" optionLabel="label" optionValue="value" required placeholder="Sélectionner le groupe" filter class="w-full" :disabled="!form.niveau_id" />
                </div>
                <div class="space-y-1.5 sm:col-span-2">
                  <label class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Mode de formation</label>
                  <div class="flex gap-3">
                    <button v-for="m in ['Présentiel','En ligne']" :key="m" type="button"
                      @click="form.mode_formation = m"
                      :class="form.mode_formation === m ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'"
                      class="flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all">
                      {{ m }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Documents Requis -->
            <div v-if="documentRequirements && documentRequirements.length > 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-6">
              <div class="px-6 py-4 border-b border-gray-50 dark:border-gray-700 bg-gradient-to-r from-cyan-50/50 to-transparent dark:from-cyan-900/10 flex items-center gap-3">
                <span class="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/40 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </span>
                <h3 class="font-semibold text-gray-800 dark:text-white">Documents à fournir</h3>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div v-for="doc in documentRequirements" :key="doc.id" class="relative group h-32 w-full rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-cyan-500 transition-all duration-300 bg-gray-50/30 dark:bg-gray-900/30 hover:bg-cyan-50 dark:hover:bg-cyan-900/10 flex flex-col items-center justify-center overflow-hidden cursor-pointer"
                       :class="{ 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 ring-4 ring-cyan-100 dark:ring-cyan-900/30': requiredDocumentsFiles[doc.id] }">
                    
                    <input type="file" @change="e => handleFileUpload(e, doc)" 
                           class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                           :multiple="doc.is_multiple == 1 || doc.is_multiple === true"
                           :title="doc.nom_affichage || doc.nom || doc.nom_document || doc.libelle || 'Document'" :required="doc.is_required || doc.obligatoire">
                    
                    <div v-if="requiredDocumentsFiles[doc.id]" class="flex flex-col items-center justify-center text-center p-4 z-0 pointer-events-none">
                      <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mb-2 shadow-sm transform group-hover:scale-110 transition-transform">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                      </div>
                      <p class="text-sm font-bold text-gray-800 dark:text-white truncate px-2 max-w-full">
                         {{ Array.isArray(requiredDocumentsFiles[doc.id]) ? requiredDocumentsFiles[doc.id].length + ' fichiers sélectionnés' : requiredDocumentsFiles[doc.id].name }}
                      </p>
                      <p class="text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                         {{ Array.isArray(requiredDocumentsFiles[doc.id]) ? 'Fichiers prêts' : 'Fichier prêt' }}
                      </p>
                    </div>

                    <div v-else class="flex flex-col items-center justify-center text-center p-4 z-0 pointer-events-none">
                      <div class="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-cyan-500 flex items-center justify-center mb-2 group-hover:-translate-y-1 transition-transform duration-300">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                      </div>
                      <p class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-0.5">
                        {{ doc.nom_affichage || doc.nom || doc.nom_document || doc.libelle || doc.document_key || 'Document' }} 
                        <span v-if="doc.is_required || doc.obligatoire" class="text-red-500">*</span>
                      </p>
                      <p class="text-xs text-gray-400">Cliquez ou glissez ici</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3">
              <NuxtLink to="/admin/liste-des-etudiants" class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                Annuler
              </NuxtLink>
              <button type="submit" :disabled="loading || isFeeMissing" :class="isFeeMissing ? 'opacity-50 cursor-not-allowed bg-gray-400 dark:bg-gray-600' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg'" class="px-6 py-2.5 text-sm font-bold text-white rounded-xl flex items-center gap-2 transition-all">
                <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </div>

          <!-- COLONNE DROITE : Récapitulatif financier (1/3) -->
          <div class="space-y-5">

            <!-- Aperçu étudiant -->
            <div class="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-lg p-6 text-white">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-2xl font-black">
                  {{ initials }}
                </div>
                <div>
                  <p class="font-bold text-lg leading-tight">{{ fullName || 'Nouvel étudiant' }}</p>
                  <p class="text-indigo-200 text-sm">{{ form.matricule || 'Matricule non défini' }}</p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3 mt-2">
                <div class="bg-white/10 rounded-xl px-3 py-2">
                  <p class="text-indigo-200 text-xs">Filière</p>
                  <p class="text-sm font-semibold truncate">{{ selectedFiliereLabel || '—' }}</p>
                </div>
                <div class="bg-white/10 rounded-xl px-3 py-2">
                  <p class="text-indigo-200 text-xs">Niveau</p>
                  <p class="text-sm font-semibold truncate">{{ selectedNiveauLabel || '—' }}</p>
                </div>
              </div>
            </div>

            <!-- Récapitulatif des frais -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div class="px-5 py-4 border-b border-gray-50 dark:border-gray-700 bg-gradient-to-r from-amber-50/50 to-transparent dark:from-amber-900/10 flex items-center gap-3">
                <span class="w-8 h-8 bg-amber-100 dark:bg-amber-900/40 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </span>
                <h3 class="font-semibold text-gray-800 dark:text-white">Frais à payer</h3>
              </div>

              <div class="p-5 space-y-4">
                <!-- Frais de scolarité -->
                <div>
                  <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Scolarité</p>
                  <div v-if="fraisLoading" class="animate-pulse h-10 bg-gray-100 dark:bg-gray-700 rounded-xl" />
                  <div v-else-if="matchedFraisScolarite" class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-xl p-3">
                    <div class="flex items-start justify-between gap-2">
                      <div>
                        <p class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{{ matchedFraisScolarite.niveau?.libelle }} — {{ matchedFraisScolarite.filiere?.nom || 'Toutes filières' }}</p>
                        <p class="text-xs text-gray-500 mt-0.5">{{ matchedFraisScolarite.mode_formation || 'Tous modes' }} • {{ matchedFraisScolarite.genre || 'Tous genres' }}</p>
                      </div>
                      <p class="text-lg font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{{ formatMoney(matchedFraisScolarite.montant) }}</p>
                    </div>
                  </div>
                  <div v-else-if="canSearchFees" class="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30 rounded-xl p-3 text-center">
                    <svg class="w-5 h-5 text-orange-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <p class="text-xs text-orange-600 dark:text-orange-400">Aucun tarif correspondant trouvé pour l'année scolaire sélectionnée</p>
                  </div>
                  <div v-else class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                    <p class="text-xs text-gray-400">Sélectionnez filière + niveau</p>
                  </div>
                </div>

                <!-- Frais d'inscription -->
                <div>
                  <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Inscription</p>
                  <div v-if="fraisLoading" class="animate-pulse h-10 bg-gray-100 dark:bg-gray-700 rounded-xl" />
                  <div v-else-if="activeFraisInscription" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-xl p-3 flex items-center justify-between">
                    <p class="text-xs text-blue-600 dark:text-blue-400 font-medium">Frais d'inscription actifs</p>
                    <p class="text-lg font-black text-blue-600 dark:text-blue-400">{{ formatMoney(activeFraisInscription.montant) }}</p>
                  </div>
                  <div v-else class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                    <p class="text-xs text-gray-400">Aucun frais d'inscription configuré</p>
                  </div>
                </div>

                <!-- Séparateur -->
                <div class="border-t border-dashed border-gray-200 dark:border-gray-600" />

                <!-- Total -->
                <div class="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-4 text-white">
                  <div class="flex items-center justify-between mb-1">
                    <p class="text-sm font-medium text-indigo-100">Total à payer</p>
                    <div v-if="totalFrais > 0" class="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  </div>
                  <p class="text-3xl font-black tracking-tight">{{ formatMoney(totalFrais) }}</p>
                  <div v-if="totalFrais > 0" class="mt-3 space-y-1 text-xs text-indigo-200">
                    <div v-if="matchedFraisScolarite" class="flex justify-between">
                      <span>Scolarité</span><span>{{ formatMoney(matchedFraisScolarite.montant) }}</span>
                    </div>
                    <div v-if="activeFraisInscription" class="flex justify-between">
                      <span>Inscription</span><span>{{ formatMoney(activeFraisInscription.montant) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Note -->
                <p class="text-xs text-gray-400 dark:text-gray-500 text-center leading-relaxed">
                  Les frais sont calculés automatiquement selon les critères de l'étudiant (niveau, filière, genre, mode).
                </p>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useNuxtApp } from '#app';
import Breadcrumb from '~/components/Breadcrumb.vue';
import Dropdown from 'primevue/dropdown';
import Toast from 'primevue/toast';
import NationaliteSelector from '~/components/NationaliteSelector.vue';
import { useFiliereStore } from '~~/stores/filiere';
import { useNiveauStore } from '~~/stores/niveau';
import { useFraisStore } from '~~/stores/frais-de-scolarite';
import { useFraisInscriptionStore } from '~~/stores/frais-inscription';
import { useEtudiantStore } from '~~/stores/etudiant';
import { useAnneScolaireStore } from '~~/stores/annee-scolaire';
import { useGroupeStore } from '~~/stores/group';

const router = useRouter();
const { $api, $toastr, $intlTelInput } = useNuxtApp();
const filiereStore = useFiliereStore();
const niveauStore = useNiveauStore();
const fraisStore = useFraisStore();
const fraisInscriptionStore = useFraisInscriptionStore();
const etudiantStore = useEtudiantStore();
const anneeStore = useAnneScolaireStore();
const groupeStore = useGroupeStore();

const loading = ref(false);
const fraisLoading = ref(true);

const form = ref({
  nom: '',
  prenom: '',
  matricule: '',
  genre: 'Masculin',
  date_naissance: '',
  email: '',
  tel: '',
  nationalite: '',
  nom_tuteur: '',
  prenom_tuteur: '',
  contact_tuteur: '',
  profession_tuteur: '',
  email_tuteur: '',
  adresse_tuteur: '',
  nom_responsable: '',
  prenom_responsable: '',
  contact_responsable: '',
  profession_responsable: '',
  email_responsable: '',
  adresse_responsable: '',
  annee_scolaire_id: null,
  filiere_id: null,
  niveau_id: null,
  group_id: null,
  mode_formation: 'Présentiel',
});

const today = new Date();
const maxDateString = `${today.getFullYear() - 12}-12-31`; // Doit avoir au moins 12 ans

const phoneInput = ref(null);
const tuteurInput = ref(null);
const respInput = ref(null);

let itiPhone = null;
let itiTuteur = null;
let itiResp = null;

let countryCodePromise = null;
const getCountryCode = () => {
    if (!countryCodePromise) {
        countryCodePromise = fetch("https://api.country.is/")
            .then(res => res.json())
            .then(data => data.country ? data.country.toLowerCase() : 'tg')
            .catch(() => 'tg');
    }
    return countryCodePromise;
};

const initIti = (inputRef) => {
    if (inputRef.value && $intlTelInput) {
        const iti = $intlTelInput(inputRef.value, {
            initialCountry: "tg",
            separateDialCode: true,
            useFullscreenPopup: false,
            utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input/dist/js/utils.js'
        });
        return iti;
    }
    return null;
};

const copyTuteurToResp = () => {
    form.value.nom_responsable = form.value.nom_tuteur;
    form.value.prenom_responsable = form.value.prenom_tuteur;
    form.value.contact_responsable = form.value.contact_tuteur;
    form.value.profession_responsable = form.value.profession_tuteur;
    form.value.email_responsable = form.value.email_tuteur;
    form.value.adresse_responsable = form.value.adresse_tuteur;
    if (itiResp && itiTuteur) {
        itiResp.setNumber(itiTuteur.getNumber());
    }
};

const filiereOptions = computed(() =>
  filiereStore.filieres.map(f => ({ label: f.nom, value: f.id }))
);

const documentRequirements = ref([]);
const requiredDocumentsFiles = ref({});

const handleFileUpload = (event, doc) => {
  const files = Array.from(event.target.files || []);
  if (files.length > 0) {
    if (doc.is_multiple == 1 || doc.is_multiple === true) {
      requiredDocumentsFiles.value[doc.id] = files;
    } else {
      requiredDocumentsFiles.value[doc.id] = files[0];
    }
  } else {
    delete requiredDocumentsFiles.value[doc.id];
  }
};

watch(() => form.value.niveau_id, async (newNiveauId) => {
  if (newNiveauId) {
    try {
      const res = await niveauStore.fetchDocumentRequirements(newNiveauId);
      documentRequirements.value = res?.data || res || [];
    } catch (error) {
      console.error("Erreur récupération des documents:", error);
      documentRequirements.value = [];
    }
  } else {
    documentRequirements.value = [];
  }
  requiredDocumentsFiles.value = {};
});

const niveauOptions = computed(() =>
  niveauStore.niveaux.map(n => ({ label: n.libelle, value: n.id }))
);

const anneeOptions = computed(() =>
  anneeStore.annneescolaires.map(a => ({ label: a.annee_scolaire || a.nom || a.libelle, value: a.id }))
);

const groupeOptions = computed(() => {
  if (!form.value.niveau_id) return [];
  let groups = groupeStore.groupes;
  
  groups = groups.filter((g) => g.niveau.id === form.value.niveau_id);
  
  return groups
    .map((g) => ({
      label: g.nom,
      value: g.id,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
});

const fullName = computed(() => {
  const parts = [form.value.nom, form.value.prenom].filter(Boolean);
  return parts.join(' ') || '';
});

const initials = computed(() => {
  const n = form.value.nom?.[0] || '';
  const p = form.value.prenom?.[0] || '';
  return (n + p).toUpperCase() || '?';
});

const selectedFiliereLabel = computed(() =>
  filiereOptions.value.find(f => f.value === form.value.filiere_id)?.label || ''
);

const selectedNiveauLabel = computed(() =>
  niveauOptions.value.find(n => n.value === form.value.niveau_id)?.label || ''
);

const canSearchFees = computed(() => form.value.filiere_id && form.value.niveau_id);

// Matching frais de scolarité (niveau + filière + genre + mode + annee_scolaire)
const matchedFraisScolarite = computed(() => {
  if (!form.value.niveau_id || !form.value.annee_scolaire_id) return null;
  const all = fraisStore.frais || [];
  
  const formAnneeId = String(form.value.annee_scolaire_id);
  const formNiveauId = String(form.value.niveau_id);
  const formFiliereId = form.value.filiere_id ? String(form.value.filiere_id) : null;
  
  const matchAnnee = (f) => String(f.annee_scolaire_id || f.annee_scolaire?.id) === formAnneeId;
  const matchNiveau = (f) => String(f.niveau?.id || f.niveau_id) === formNiveauId;
  const matchFiliere = (f) => !formFiliereId || String(f.filiere?.id || f.filiere_id) === formFiliereId;
  const matchGenre = (f) => !f.genre || f.genre === 'Tous' || f.genre === form.value.genre;
  const matchModeTous = (f) => !f.mode_formation || f.mode_formation === 'Tous';
  const matchModeExact = (f) => f.mode_formation === form.value.mode_formation;

  // Recherche prioritaire : Mode de formation EXACT et ANNEE SCOLAIRE
  let match = all.find(f =>
    matchAnnee(f) && matchNiveau(f) && matchFiliere(f) && matchGenre(f) && matchModeExact(f)
  );
  
  // Fallback 1 : Mode de formation "Tous" (avec filière et annee scolaire)
  if (!match) {
    match = all.find(f =>
      matchAnnee(f) && matchNiveau(f) && matchFiliere(f) && matchGenre(f) && matchModeTous(f)
    );
  }
  
  // Fallback 2 : Mode exact sans filière mais avec annee
  if (!match) {
    match = all.find(f =>
      matchAnnee(f) && matchNiveau(f) && (!f.filiere_id && !f.filiere?.id) && matchGenre(f) && matchModeExact(f)
    );
  }

  // Fallback 3 : Mode "Tous" sans filière avec annee
  if (!match) {
    match = all.find(f =>
      matchAnnee(f) && matchNiveau(f) && (!f.filiere_id && !f.filiere?.id) && matchGenre(f) && matchModeTous(f)
    );
  }
  
  // Fallback ultime : juste le niveau et annee
  if (!match) {
    match = all.find(f => matchAnnee(f) && matchNiveau(f));
  }
  return match || null;
});

const isFeeMissing = computed(() => {
  return form.value.niveau_id && form.value.annee_scolaire_id && !fraisLoading.value && !matchedFraisScolarite.value;
});

const activeFraisInscription = computed(() => {
  const all = fraisInscriptionStore.frais || [];
  return all.find(f => f.active) || all[0] || null;
});

const totalFrais = computed(() => {
  const s = Number(matchedFraisScolarite.value?.montant || 0);
  const i = Number(activeFraisInscription.value?.montant || 0);
  return s + i;
});

const formatMoney = (v) => {
  if (!v && v !== 0) return '—';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(Number(v));
};

onMounted(async () => {
  await Promise.all([
    filiereStore.fetchFilieres(),
    niveauStore.fetchNiveaux(),
    fraisStore.fetchFrais(),
    fraisInscriptionStore.fetchFrais(),
    etudiantStore.fetchEtudiants(),
    anneeStore.fetchAnneeScolaire(),
    groupeStore.fetchGroupes(),
  ]);
  
  fraisLoading.value = false;
  
  // Set default active academic year
  if (anneeStore.activeAnnee) {
    form.value.annee_scolaire_id = anneeStore.activeAnnee.id;
  }
  
  // Auto-generate Matricule: XXX-ESC-YYYY
  const activeYearData = anneeStore.activeAnnee?.annee_scolaire || anneeStore.activeAnnee?.nom || '';
  const startYear = activeYearData.split('-')[0] || new Date().getFullYear().toString();
  const count = (etudiantStore.etudiants.length + 1).toString().padStart(3, '0');
  form.value.matricule = `${count}-ESC-${startYear}`;

  setTimeout(() => {
    itiPhone = initIti(phoneInput);
    itiTuteur = initIti(tuteurInput);
    itiResp = initIti(respInput);
  }, 300);
});

const submitAddForm = async () => {
  try {
    loading.value = true;
    
    // Capture numbers from ITI
    if (itiPhone) form.value.tel = itiPhone.getNumber() || form.value.tel;
    if (itiTuteur) form.value.contact_tuteur = itiTuteur.getNumber() || form.value.contact_tuteur;
    if (itiResp) form.value.contact_responsable = itiResp.getNumber() || form.value.contact_responsable;

    const formData = new FormData();
    
    // Append standard fields
    for (const key in form.value) {
      if (form.value[key] !== null && form.value[key] !== undefined && form.value[key] !== '') {
        formData.append(key, form.value[key]);
      }
    }
    
    // Append documents arrays
    if (documentRequirements.value && documentRequirements.value.length > 0) {
      Object.keys(requiredDocumentsFiles.value).forEach((reqId) => {
        const f = requiredDocumentsFiles.value[reqId];
        if (Array.isArray(f)) {
          f.forEach(file => {
            formData.append('document[]', file);
            formData.append('document_requirement[]', reqId);
          });
        } else {
          formData.append('document[]', f);
          formData.append('document_requirement[]', reqId);
        }
      });
    }

    const response = await $api.post('/admin/etudiants/store', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if ($toastr?.success) $toastr.success(response.message || 'Étudiant enregistré avec succès.');
    setTimeout(() => router.push('/admin/liste-des-etudiants'), 1000);
  } catch (error) {
    const msg = error.response?.data?.message || "Erreur lors de l'enregistrement.";
    if ($toastr?.error) $toastr.error(msg);
  } finally {
    loading.value = false;
  }
};
</script>

<style>
/* ITI Dark Mode Overrides */
.iti { width: 100%; }
.iti__country-list {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  z-index: 50;
}
.dark .iti__country-list {
  background-color: #1f2937;
  border-color: #374151;
  color: #f3f4f6;
}
.dark .iti__country:hover { background-color: #374151; }
.dark .iti__divider { border-bottom-color: #374151; }
.iti__flag { border-radius: 2px; }
.dark .iti__search-input { background-color: #111827; color: white; border-color: #374151; }
</style>

<style scoped>
:deep(.p-dropdown) { border-radius: 0.75rem !important; border-color: #e5e7eb !important; }
:deep(.p-dropdown:not(.p-disabled).p-focus) { box-shadow: 0 0 0 2px #6366f1 !important; }
</style>
