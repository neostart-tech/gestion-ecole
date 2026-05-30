<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Étudiants', to: '/admin/liste-des-etudiants' },
        { label: studentName, to: `/admin/liste-des-etudiants/${route.params.slug}/detail` },
        { label: 'Modifier', to: null },
      ]"
      :title="`Modifier : ${studentName}`"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-6"
    />

    <!-- Loading state -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <div class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-gray-500 dark:text-gray-400 animate-pulse">Chargement des informations...</p>
    </div>

    <!-- Main Content -->
    <div v-else-if="etudiant" class="max-w-6xl mx-auto">
      <form @submit.prevent="handleUpdate" class="space-y-6" enctype="multipart/form-data">
        <!-- Actions fixes & Navigation (Sticky Top) -->
        <div class="sticky top-4 z-30 space-y-4">
          <!-- Barre d'actions principale -->
          <div class="flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl shadow-xl shadow-indigo-500/5 border border-white dark:border-gray-700">
            <div class="flex items-center gap-4">
              <NuxtLink
                :to="`/admin/liste-des-etudiants/${route.params.slug}/detail`"
                class="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-xl transition-all"
                title="Retour"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
              </NuxtLink>
              
              <div class="h-10 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
              
              <!-- Petit résumé profil (Visible au scroll) -->
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-200">
                  {{ etudiant.nom?.charAt(0) }}{{ etudiant.prenom?.charAt(0) }}
                </div>
                <div class="hidden sm:block">
                  <h4 class="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[150px]">{{ studentName }}</h4>
                  <p class="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{{ etudiant?.dernier_groupe?.niveau?.nom || 'Étudiant' }}</p>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <p class="text-xs font-medium text-gray-400 hidden lg:block mr-2">Dernière modif : {{ formatDate(etudiant.updated_at) }}</p>
              <button
                type="submit"
                :disabled="saving"
                class="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ saving ? 'Enregistrement...' : 'Enregistrer les modifications' }}</span>
              </button>
            </div>
          </div>

          <!-- Navigation horizontale (Tabs) -->
          <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-1.5 rounded-2xl border border-white dark:border-gray-700 shadow-lg shadow-black/5 flex items-center gap-1 overflow-x-auto scrollbar-hide">
            <button 
              type="button" 
              @click="activeTab = 'general'"
              :class="[activeTab === 'general' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50']"
              class="flex-1 min-w-max flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span>GÉNÉRAL</span>
            </button>
            <button 
              type="button" 
              @click="activeTab = 'family'"
              :class="[activeTab === 'family' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50']"
              class="flex-1 min-w-max flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <span>FAMILLE</span>
            </button>
            <button 
              type="button" 
              @click="activeTab = 'documents'"
              :class="[activeTab === 'documents' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50']"
              class="flex-1 min-w-max flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span>DOCUMENTS</span>
            </button>
          </div>
        </div>

        <div class="space-y-6 pb-20 max-w-5xl mx-auto">
            <!-- TAB 1: Général & Académique -->
            <div v-if="activeTab === 'general'" class="space-y-6">
              <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <div class="p-6 border-b border-gray-50 dark:border-gray-700 bg-gradient-to-r from-indigo-50/30 to-transparent dark:from-indigo-900/10">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span class="w-1 h-6 bg-indigo-500 rounded-full"></span>
                    Cursus & Administration
                  </h3>
                </div>
                <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-1">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Matricule</label>
                    <input v-model="form.matricule" type="text" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Année d'admission</label>
                    <input v-model="form.annee_admission" type="text" maxlength="4" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Groupe Académique</label>
                    <Dropdown
                      v-model="form.group_id"
                      :options="groupOptions"
                      optionLabel="label"
                      optionValue="value"
                      filter
                      placeholder="Rechercher un groupe..."
                      class="w-full rounded-xl"
                    />
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Mode de formation</label>
                    <Dropdown
                      v-model="form.mode_formation"
                      :options="[{label: 'Présentiel', value: 'Présentiel'}, {label: 'En ligne', value: 'En ligne'}]"
                      optionLabel="label"
                      optionValue="value"
                      class="w-full rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <div class="p-6 border-b border-gray-50 dark:border-gray-700 bg-gradient-to-r from-emerald-50/30 to-transparent dark:from-emerald-900/10">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
                    Identité & Contact
                  </h3>
                </div>
                <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-1">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Nom <span class="text-red-500">*</span></label>
                    <input v-model="form.nom" type="text" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Prénom <span class="text-red-500">*</span></label>
                    <input v-model="form.prenom" type="text" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Genre <span class="text-red-500">*</span></label>
                    <Dropdown
                      v-model="form.genre"
                      :options="[{label: 'Masculin', value: 'Masculin'}, {label: 'Féminin', value: 'Féminin'}]"
                      optionLabel="label"
                      optionValue="value"
                      class="w-full rounded-xl"
                      required
                    />
                  </div>
                  <div class="space-y-1">
                    <NationaliteSelector v-model="form.nationalite" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Téléphone <span class="text-red-500">*</span></label>
                    <input v-model="form.tel" type="tel" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Date de naissance</label>
                    <input v-model="form.date_naissance" type="date" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Lieu de naissance</label>
                    <input v-model="form.lieu_naissance" type="text" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div class="space-y-1 md:col-span-2">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Adresse de résidence</label>
                    <input v-model="form.adresse" type="text" placeholder="Ex: Akwa, Douala, Rue 123..." class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div class="space-y-1 md:col-span-2">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Email professionnel <span class="text-red-500">*</span></label>
                    <input v-model="form.email" type="email" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 2: Famille & Responsables -->
            <div v-if="activeTab === 'family'" class="space-y-6">
              <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <div class="p-6 border-b border-gray-50 dark:border-gray-700 bg-gradient-to-r from-amber-50/30 to-transparent dark:from-amber-900/10">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span class="w-1 h-6 bg-amber-500 rounded-full"></span>
                    Informations du Tuteur
                  </h3>
                </div>
                <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-1">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Nom du tuteur</label>
                    <input v-model="form.tuteur.nom" type="text" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Prénom du tuteur</label>
                    <input v-model="form.tuteur.prenom" type="text" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Téléphone du tuteur</label>
                    <input v-model="form.tuteur.tel" type="text" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Email du tuteur</label>
                    <input v-model="form.tuteur.email" type="email" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div class="space-y-1 md:col-span-2">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Adresse complète</label>
                    <input v-model="form.tuteur.adresse" type="text" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                </div>
              </div>

              <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <div class="p-6 border-b border-gray-50 dark:border-gray-700 bg-gradient-to-r from-blue-50/30 to-transparent dark:from-blue-900/10 flex items-center justify-between">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span class="w-1 h-6 bg-blue-500 rounded-full"></span>
                    Responsable des frais
                  </h3>
                  <button 
                    type="button"
                    @click="copyTuteurToResponsable"
                    class="px-4 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-lg transition-all flex items-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    IDENTIQUE AU TUTEUR
                  </button>
                </div>
                <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-1">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Nom du responsable</label>
                    <input v-model="form.responsable.nom" type="text" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Prénom du responsable</label>
                    <input v-model="form.responsable.prenom" type="text" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Téléphone</label>
                    <input v-model="form.responsable.tel" type="text" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
                    <input v-model="form.responsable.email" type="email" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div class="space-y-1 md:col-span-2">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Adresse complète</label>
                    <input v-model="form.responsable.adresse" type="text" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 3: Documents (Album) -->
            <div v-if="activeTab === 'documents'" class="space-y-10">
              <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10">
                <div class="p-8 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
                  <div>
                    <h3 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Dossier de candidature</h3>
                    <p class="text-sm text-gray-500 mt-1">Tous les documents sont facultatifs lors de la modification.</p>
                  </div>
                  <div class="px-5 py-2 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-200 dark:shadow-none">
                    {{ etudiant?.dernier_groupe?.niveau?.nom || 'Niveau' }}
                  </div>
                </div>

                <!-- Liste Documents Requis (Info) -->
                <div class="p-8 pb-4">
                  <div class="p-6 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-800 border border-indigo-100 dark:border-indigo-800 rounded-3xl">
                    <div class="flex items-start gap-4">
                      <div class="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/></svg>
                      </div>
                      <div class="space-y-3">
                        <p class="text-base font-bold text-indigo-900 dark:text-indigo-300">Rappel des pièces attendues :</p>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                          <div v-for="doc in requiredDocsList" :key="doc" class="flex items-center gap-3 text-sm text-indigo-700/80 dark:text-indigo-400/80">
                            <span class="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                            </span>
                            {{ doc }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Zone d'Upload Globale -->
                <div class="p-8 space-y-12">
                  <!-- Section 1: Identité -->
                  <div class="space-y-6">
                    <div class="flex items-center gap-4">
                        <h4 class="text-sm font-black text-gray-400 uppercase tracking-widest">Documents d'Identité</h4>
                        <div class="h-px bg-gray-100 dark:bg-gray-700 flex-1"></div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div class="space-y-3">
                        <label class="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Photo d'identité (JPEG/PNG)</label>
                        <FileUpload v-model="files.photo_identite_file" id="photo_up" accept=".jpg,.jpeg,.png" :existing-file="etudiant?.album?.photo" />
                      </div>
                      <div class="space-y-3">
                        <label class="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Pièce d'identité / Passeport (PDF)</label>
                        <FileUpload v-model="files.nationalite_file" id="nat_up" accept=".pdf,.jpg,.jpeg,.png" :existing-file="etudiant?.album?.nationalite" />
                      </div>
                      <div class="space-y-3">
                        <label class="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Acte de naissance</label>
                        <FileUpload v-model="files.naissance_file" id="birth_up" accept=".pdf,.jpg,.jpeg,.png" :existing-file="etudiant?.album?.naissance" />
                      </div>
                      <div class="space-y-3">
                        <label class="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Certificat médical</label>
                        <FileUpload v-model="files.certificat_medical_file" id="med_up" accept=".pdf,.jpg,.jpeg,.png" :existing-file="etudiant?.album?.certificat_medical" />
                      </div>
                    </div>
                  </div>

                  <!-- Section 2: Académique -->
                  <div class="space-y-6">
                    <div class="flex items-center gap-4">
                        <h4 class="text-sm font-black text-gray-400 uppercase tracking-widest">Parcours Académique</h4>
                        <div class="h-px bg-gray-100 dark:bg-gray-700 flex-1"></div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div class="space-y-3">
                        <label class="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">{{ isMaster ? 'Dernier diplôme universitaire' : 'Attestation de BAC / Diplôme' }}</label>
                        <FileUpload v-model="files.diplome_file" id="dip_up" accept=".pdf,.jpg,.jpeg,.png" :existing-file="etudiant?.album?.diplome" />
                      </div>
                      <div v-if="isMaster" class="space-y-3">
                        <label class="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Curriculum Vitæ (CV)</label>
                        <FileUpload v-model="files.cv_file" id="cv_up" accept=".pdf,.doc,.docx" :existing-file="etudiant?.album?.cv" />
                      </div>
                      <div v-if="!isMaster" class="space-y-3">
                        <label class="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">{{ isLicence1 ? 'Relevé de notes du BAC' : 'Relevés de notes BAC 1 / Année 1' }}</label>
                        <MultipleFileUpload v-model="files.releve_bac1" id="rel1_up" accept=".pdf" :existing-files="etudiant?.album?.releve_bac1_path ? [etudiant.album.releve_bac1_path] : []" />
                      </div>
                      <div v-if="isLicence3 || isMaster" class="space-y-3">
                        <label class="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Relevés de notes BAC 2 / Année 2</label>
                        <MultipleFileUpload v-model="files.releve_bac2" id="rel2_up" accept=".pdf" :existing-files="etudiant?.album?.releve_bac2_path ? [etudiant.album.releve_bac2_path] : []" />
                      </div>
                    </div>
                  </div>

                  <!-- Section 3: Bulletins (Aéré) -->
                  <div class="space-y-8">
                    <div class="flex items-center gap-4">
                        <h4 class="text-sm font-black text-gray-400 uppercase tracking-widest">Bulletins du Lycée</h4>
                        <div class="h-px bg-gray-100 dark:bg-gray-700 flex-1"></div>
                    </div>
                    <div class="grid grid-cols-1 gap-8">
                      <div class="space-y-4 p-5 bg-gray-50/50 dark:bg-gray-900/30 rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col">
                        <h5 class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter text-center mb-1">Classe de Seconde</h5>
                        <div class="flex-1 min-w-0">
                          <MultipleFileUpload v-model="files.bulletins_seconde" id="bul2_up" accept=".pdf" :existing-files="bulletinsPaths?.seconde || []" />
                        </div>
                      </div>
                      <div class="space-y-4 p-5 bg-gray-50/50 dark:bg-gray-900/30 rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col">
                        <h5 class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter text-center mb-1">Classe de Première</h5>
                        <div class="flex-1 min-w-0">
                          <MultipleFileUpload v-model="files.bulletins_premiere" id="bul1_up" accept=".pdf" :existing-files="bulletinsPaths?.premiere || []" />
                        </div>
                      </div>
                      <div class="space-y-4 p-5 bg-gray-50/50 dark:bg-gray-900/30 rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col">
                        <h5 class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter text-center mb-1">Classe de Terminale</h5>
                        <div class="flex-1 min-w-0">
                          <MultipleFileUpload v-model="files.bulletins_terminale" id="bulT_up" accept=".pdf" :existing-files="bulletinsPaths?.terminale || []" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Info pied de page -->
                <div class="p-8 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700">
                  <div class="flex items-center gap-3 text-sm text-gray-500 font-medium italic">
                    <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    Note : Seuls les fichiers modifiés seront remplacés. Les autres resteront inchangés.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    <!-- Toast notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Dropdown from "primevue/dropdown";
import Breadcrumb from "~/components/Breadcrumb.vue";
import FileUpload from "~/components/FileUpload.vue";
import MultipleFileUpload from "~/components/MultipleFileUpload.vue";
import NationaliteSelector from "~/components/NationaliteSelector.vue";
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
import { useEtudiantStore } from "~~/stores/etudiant";
import { useGroupeStore } from "~~/stores/group";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const etudiantStore = useEtudiantStore();
const groupeStore = useGroupeStore();

const loading = ref(true);
const saving = ref(false);
const etudiant = ref(null);
const activeTab = ref('general');

const form = ref({
  nom: "",
  prenom: "",
  email: "",
  tel: "",
  genre: "",
  nationalite: "",
  date_naissance: "",
  lieu_naissance: "",
  adresse: "",
  group_id: null,
  matricule: "",
  promotion: "",
  annee_admission: "",
  nom_jeune_fille: "",
  biographie: "",
  mode_formation: "Présentiel",
  tuteur: { nom: "", prenom: "", tel: "", email: "", profession: "", adresse: "" },
  responsable: { nom: "", prenom: "", tel: "", email: "", profession: "", adresse: "" },
});

// Fichiers sélectionnés (Tous facultatifs)
const files = reactive({
  lettre_file: null,
  naissance_file: null,
  diplome_file: null,
  nationalite_file: null,
  photo_identite_file: null,
  certificat_medical_file: null,
  coupon_file: null,
  cv_file: null,
  bulletins_seconde: [],
  bulletins_premiere: [],
  bulletins_terminale: [],
  releve_bac1: [],
  releve_bac2: [],
});

const studentName = computed(() => {
  return etudiant.value ? `${etudiant.value.nom} ${etudiant.value.prenom}` : "Chargement...";
});

const niveauName = computed(() => {
  const nom = etudiant.value?.dernier_groupe?.niveau?.nom || '';
  return nom.toLowerCase();
});

const isLicence1 = computed(() => niveauName.value.includes('licence 1') || niveauName.value === 'l1');
const isLicence2 = computed(() => niveauName.value.includes('licence 2') || niveauName.value === 'l2');
const isLicence3 = computed(() => niveauName.value.includes('licence 3') || niveauName.value === 'l3');
const isMaster = computed(() => niveauName.value.includes('master') || niveauName.value.includes('executive'));

const requiredDocsList = computed(() => {
  const common = [
    'Photos d\'identité',
    'Pièce d\'identité / Passeport',
    'Acte de naissance',
    'Certificat médical',
  ];
  if (isMaster.value) return [...common, 'Dernier diplôme universitaire', 'Curriculum Vitæ (CV)'];
  if (isLicence3.value) return [...common, 'Attestation BAC ou BTS', 'Relevé de BAC ou BTS', 'Relevés Année 1 & 2'];
  if (isLicence2.value) return [...common, 'Attestation de BAC', 'Relevé de BAC', 'Relevé Année 1'];
  return [...common, 'Attestation de BAC', 'Relevé de BAC'];
});

const bulletinsPaths = computed(() => {
  try {
    const raw = etudiant.value?.album?.bulletins_lycee_paths;
    if (!raw) return null;
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch (e) {
    return null;
  }
});

const groupOptions = computed(() => {
  if (!etudiant.value || !etudiant.value.dernier_groupe) return [];
  const levelId = etudiant.value.dernier_groupe.niveau.id;
  
  return groupeStore.groupes
    .filter((g) => g.niveau.id === levelId)
    .map((g) => ({
      label: `${g.niveau.libelle} - ${g.nom}`,
      level: g.niveau.libelle,
      groupName: g.nom,
      value: g.id,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
});

const loadData = async () => {
  try {
    loading.value = true;
    await etudiantStore.fetchEtudiant(route.params.slug);
    await groupeStore.fetchGroupes();
    etudiant.value = etudiantStore.etudiant;
    if (etudiant.value) {
      form.value = {
        nom: etudiant.value.nom,
        prenom: etudiant.value.prenom,
        email: etudiant.value.email || "",
        tel: etudiant.value.tel || etudiant.value.telephone || "",
        genre: etudiant.value.genre,
        nationalite: etudiant.value.nationalite || "",
        date_naissance: etudiant.value.date_naissance ? etudiant.value.date_naissance.split("T")[0] : "",
        lieu_naissance: etudiant.value.lieu_naissance || "",
        adresse: etudiant.value.adresse || "",
        group_id: etudiant.value.dernier_groupe?.group?.id,
        matricule: etudiant.value.matricule,
        promotion: etudiant.value.promotion || "",
        annee_admission: etudiant.value.annee_admission,
        nom_jeune_fille: etudiant.value.nom_jeune_fille || "",
        biographie: etudiant.value.biographie || "",
        mode_formation: etudiant.value.dernier_groupe?.mode_formation || "Présentiel",
        tuteur: {
          nom: etudiant.value.tuteur?.nom || "",
          prenom: etudiant.value.tuteur?.prenom || "",
          tel: etudiant.value.tuteur?.tel || "",
          email: etudiant.value.tuteur?.email || "",
          profession: etudiant.value.tuteur?.profession || "",
          adresse: etudiant.value.tuteur?.adresse || ""
        },
        responsable: {
          nom: etudiant.value.responsable?.nom || "",
          prenom: etudiant.value.responsable?.prenom || "",
          tel: etudiant.value.responsable?.tel || "",
          email: etudiant.value.responsable?.email || "",
          profession: etudiant.value.responsable?.profession || "",
          adresse: etudiant.value.responsable?.adresse || ""
        }
      };
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Échec du chargement', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const handleUpdate = async () => {
  try {
    saving.value = true;
    const formDataToSend = new FormData();
    formDataToSend.append('_method', 'PUT');

    Object.keys(form.value).forEach(key => {
      if (typeof form.value[key] === 'object' && form.value[key] !== null) {
        Object.keys(form.value[key]).forEach(subKey => {
          formDataToSend.append(`${key}[${subKey}]`, form.value[key][subKey]);
        });
      } else if (form.value[key] !== null) {
        formDataToSend.append(key, form.value[key]);
      }
    });

    const fileFields = ['lettre_file', 'naissance_file', 'diplome_file', 'nationalite_file', 'photo_identite_file', 'certificat_medical_file', 'coupon_file', 'cv_file'];
    fileFields.forEach(field => { if (files[field]) formDataToSend.append(field, files[field]); });

    ['seconde', 'premiere', 'terminale'].forEach(n => {
      if (files[`bulletins_${n}`] && files[`bulletins_${n}`].length > 0) {
        files[`bulletins_${n}`].forEach((file, index) => formDataToSend.append(`bulletins_${n}[${index}]`, file));
      }
    });

    ['releve_bac1', 'releve_bac2'].forEach(field => {
      if (files[field] && files[field].length > 0) {
        files[field].forEach((file, index) => formDataToSend.append(`${field}[${index}]`, file));
      }
    });

    await etudiantStore.updateEtudiant(route.params.slug, formDataToSend);
    toast.add({ severity: 'success', summary: 'Succès', detail: 'Données enregistrées', life: 3000 });
    setTimeout(() => { router.push(`/admin/liste-des-etudiants/${route.params.slug}/detail`); }, 1000);
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Erreur', detail: error.response?.data?.message || 'Erreur serveur', life: 5000 });
  } finally {
    saving.value = false;
  }
};

const copyTuteurToResponsable = () => {
  form.value.responsable = { 
    ...form.value.responsable, // Garder les autres champs (profession)
    nom: form.value.tuteur.nom,
    prenom: form.value.tuteur.prenom,
    tel: form.value.tuteur.tel,
    email: form.value.tuteur.email,
    adresse: form.value.tuteur.adresse
  };
  toast.add({ severity: 'info', summary: 'Copié', detail: 'Informations du tuteur dupliquées', life: 2000 });
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

onMounted(loadData);
</script>

<style scoped>
:deep(.p-dropdown) { border-radius: 0.75rem !important; border-color: #e5e7eb !important; }
:deep(.p-dropdown:not(.p-disabled).p-focus) { box-shadow: 0 0 0 2px #6366f1 !important; }

.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
