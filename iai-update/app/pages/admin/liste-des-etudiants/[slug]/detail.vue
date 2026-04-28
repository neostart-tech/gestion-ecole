<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors overflow-x-hidden">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Étudiants', to: '/admin/liste-des-etudiants' },
        { label: studentName, to: null },
      ]"
      :title="studentName"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-6"
    />

    <!-- Loading -->
    <div v-if="etudiantStore.isLoading" class="flex flex-col items-center justify-center py-24">
      <div class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-gray-500 dark:text-gray-400 animate-pulse font-medium">Chargement du dossier...</p>
    </div>

    <!-- Error -->
    <div v-else-if="etudiantStore.error" class="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 text-center shadow-xl border border-gray-100 dark:border-gray-700">
      <div class="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      </div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Étudiant non trouvé</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-8">Le dossier demandé n'existe pas ou a été déplacé.</p>
      <NuxtLink to="/admin/liste-des-etudiants" class="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none">
        Retour à la liste
      </NuxtLink>
    </div>

    <!-- Contenu principal -->
    <div v-else-if="etudiantStore.etudiant" class="max-w-7xl mx-auto space-y-6 md:space-y-8" id="printable-dossier">
      <!-- En-tête de profil Premium -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="h-24 md:h-32 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600"></div>
        <div class="px-4 md:px-8 pb-6 md:pb-8">
          <div class="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 -mt-10 md:-mt-12 text-center md:text-left">
            <div class="relative group">
              <div class="w-24 h-24 md:w-32 md:h-32 bg-white dark:bg-gray-700 rounded-3xl p-1.5 shadow-xl border border-gray-100 dark:border-gray-600">
                <div class="w-full h-full rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center overflow-hidden">
                  <img v-if="etudiantStore.etudiant.image" :src="etudiantStore.etudiant.image" class="w-full h-full object-cover" alt="Profile" />
                  <span v-else class="text-3xl md:text-4xl font-black text-indigo-600 dark:text-indigo-400">{{ initials }}</span>
                </div>
              </div>
              <div class="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 p-1 md:p-1.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <div 
                  class="w-3 h-3 md:w-4 md:h-4 rounded-full" 
                  :class="etudiantStore.etudiant.statut === 'actif' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'"
                ></div>
              </div>
            </div>

            <div class="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 pb-2 w-full">
              <div>
                <div class="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                  <h1 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                    {{ etudiantStore.etudiant.nom }} {{ etudiantStore.etudiant.prenom }}
                  </h1>
                  <span 
                    class="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest"
                    v-if="etudiantStore.etudiant.statut === 'actif'"
                  >
                    Actif
                  </span>
                  <span 
                    class="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-[10px] font-black uppercase tracking-widest"
                    v-else
                  >
                    Bloqué
                  </span>
                </div>
                <div class="flex flex-wrap items-center justify-center md:justify-start gap-x-4 md:gap-x-6 gap-y-2 mt-3">
                  <div class="flex items-center gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                    <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    {{ etudiantStore.etudiant.matricule }}
                  </div>
                  <div class="flex items-center gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                    <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    {{ etudiantStore.etudiant.email }}
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-center gap-3 w-full md:w-auto">
                <NuxtLink
                  :to="`/admin/liste-des-etudiants/${route.params.slug}/modifier`"
                  class="flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  Modifier
                </NuxtLink>
                <button 
                  @click="toggleMenu"
                  class="p-2.5 md:p-3 bg-white dark:bg-gray-700 text-gray-500 border border-gray-200 dark:border-gray-600 rounded-2xl hover:text-indigo-500 transition-colors shadow-sm"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                </button>
                <Menu ref="menu" id="overlay_menu" :model="menuItems" :popup="true" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation par Onglets (Scrollable sur mobile) -->
      <div class="overflow-x-auto pb-2 scrollbar-hide">
        <div class="flex items-center gap-1.5 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl w-max">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-300 whitespace-nowrap"
            :class="activeTab === tab.id ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon" /></svg>
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Contenu des onglets -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
        <!-- Colonne Principale -->
        <div class="lg:col-span-2 space-y-6 md:space-y-8">
          <!-- Onglet Informations -->
          <div v-if="activeTab === 'info'" class="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <!-- Identité -->
            <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div class="flex items-center gap-3 mb-6 md:mb-8">
                <div class="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h2 class="text-lg md:text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Identité</h2>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 md:gap-x-12 gap-y-6 md:gap-y-8">
                <div v-for="item in personalInfo" :key="item.label" class="space-y-1">
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{{ item.label }}</p>
                  <p class="text-sm md:text-base font-bold text-gray-900 dark:text-white">{{ item.value || '—' }}</p>
                </div>
              </div>
            </div>

            <!-- Famille -->
            <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div class="flex items-center gap-3 mb-6 md:mb-8">
                <div class="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <h2 class="text-lg md:text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Responsables</h2>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div v-for="role in ['tuteur', 'responsable']" :key="role" class="p-5 md:p-6 bg-gray-50 dark:bg-gray-900/30 rounded-3xl border border-gray-100 dark:border-gray-800">
                  <h4 class="text-[10px] font-black uppercase tracking-widest mb-4" :class="role === 'tuteur' ? 'text-indigo-600' : 'text-amber-600'">
                    {{ role === 'tuteur' ? 'Tuteur légal' : 'Responsable financier' }}
                  </h4>
                  <div class="space-y-4" v-if="etudiantStore.etudiant[role] && (etudiantStore.etudiant[role].nom || etudiantStore.etudiant[role].prenom)">
                    <div class="space-y-1">
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Nom complet</p>
                      <p class="text-sm font-bold text-gray-900 dark:text-white">{{ etudiantStore.etudiant[role].nom }} {{ etudiantStore.etudiant[role].prenom }}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Téléphone</p>
                      <p class="text-sm font-bold text-gray-900 dark:text-white">{{ etudiantStore.etudiant[role].tel || '—' }}</p>
                    </div>
                  </div>
                  <p v-else class="text-xs text-gray-400 italic">Non renseigné</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Onglet Relevés -->
          <div v-if="activeTab === 'releves'" class="space-y-6 animate-in fade-in duration-500">
            <div class="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <h2 class="text-lg md:text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Historique des Relevés</h2>
                <button @click="openReleveModal" class="w-full sm:w-auto px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 dark:shadow-none flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                    Nouveau
                </button>
            </div>
            
            <div class="grid grid-cols-1 gap-4">
              <template v-if="relevenoteStore.releves.length > 0">
                <div v-for="releve in relevenoteStore.releves" :key="releve.id" class="group bg-white dark:bg-gray-800 p-4 md:p-5 rounded-3xl border border-gray-100 dark:border-gray-700 hover:border-indigo-500 transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div class="flex items-center gap-4 md:gap-5 w-full sm:w-auto">
                    <div class="w-12 h-12 md:w-14 md:h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0">
                        <svg class="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div class="min-w-0">
                      <h3 class="font-black text-gray-900 dark:text-white uppercase tracking-tight truncate">{{ releve.periode }}</h3>
                      <p class="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium truncate">{{ releve.annee_scolaire }} • {{ formatDate(releve.date_generation) }}</p>
                    </div>
                  </div>
                  <div class="flex gap-2 w-full sm:w-auto justify-end">
                    <button @click="activeReleve = releve; showPreviewModal = true;" class="flex-1 sm:flex-none p-3 bg-gray-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all flex justify-center">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                    <button @click="deleteReleve(releve.id)" class="flex-1 sm:flex-none p-3 bg-gray-50 dark:bg-gray-700 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex justify-center">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </template>
              <div v-else class="text-center py-16 md:py-20 bg-gray-50 dark:bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <p class="text-gray-500 text-sm">Aucun relevé généré pour le moment.</p>
              </div>
            </div>
          </div>

          <!-- Onglet Dossier -->
          <div v-if="activeTab === 'dossier'" class="animate-in fade-in duration-500">
            <div v-if="hasDocuments" class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div 
                    v-for="(label, key) in documentLabels" 
                    :key="key"
                    v-show="etudiantStore.etudiant.album[key]"
                    class="group bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                >
                    <div class="h-32 md:h-40 bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                        <img v-if="isImage(etudiantStore.etudiant.album[key])" :src="getFileUrl(etudiantStore.etudiant.album[key])" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div v-else class="flex flex-col items-center text-gray-400">
                            <svg class="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            <span class="text-[10px] font-black uppercase mt-2 tracking-widest">{{ getFileExtension(etudiantStore.etudiant.album[key]) }}</span>
                        </div>
                    </div>
                    <div class="p-4 md:p-5 flex items-center justify-between gap-2">
                        <h4 class="text-[10px] md:text-xs font-black text-gray-800 dark:text-white uppercase tracking-tight truncate">{{ label }}</h4>
                        <a :href="getFileUrl(etudiantStore.etudiant.album[key])" target="_blank" class="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shrink-0">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </a>
                    </div>
                </div>
            </div>
            <div v-else class="text-center py-16 md:py-20 bg-gray-50 dark:bg-gray-800/30 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <p class="text-xs text-gray-500">Aucun document fourni.</p>
            </div>
          </div>
        </div>

        <!-- Colonne Latérale -->
        <div class="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 md:mb-8 border-b border-gray-50 dark:border-gray-700 pb-4">Parcours Académique</h3>
            <div class="space-y-6" v-if="etudiantStore.etudiant.dernier_groupe">
                <div v-for="info in sidebarAcademic" :key="info.label" class="flex items-start gap-4">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :class="info.color || 'bg-gray-50 dark:bg-gray-700 text-gray-400'">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="info.icon" /></svg>
                  </div>
                  <div>
                    <p class="text-[9px] font-black text-gray-400 uppercase tracking-tighter leading-none mb-1">{{ info.label }}</p>
                    <p class="text-sm font-bold text-gray-800 dark:text-gray-200 leading-tight">{{ info.value }}</p>
                  </div>
                </div>
            </div>
            <p v-else class="text-xs text-gray-400 italic">Aucun groupe assigné</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <Toast />
    
    <!-- Modal Prévisualisation Relevé -->
    <TransitionRoot appear :show="showPreviewModal" as="template">
      <Dialog as="div" class="relative z-50" @close="showPreviewModal = false">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-2 md:p-4 text-center">
            <DialogPanel class="w-full max-w-5xl transform overflow-hidden rounded-3xl bg-white dark:bg-gray-800 p-4 md:p-8 shadow-2xl transition-all">
                <div class="flex justify-between items-center mb-6 md:mb-8">
                    <DialogTitle class="text-lg md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Prévisualisation</DialogTitle>
                    <div class="flex gap-2 md:gap-3">
                        <button @click="downloadCurrentPDF" class="px-4 md:px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 text-xs md:text-base">
                            <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            <span class="hidden sm:inline">Télécharger</span> PDF
                        </button>
                        <button @click="showPreviewModal = false" class="p-2 text-gray-400 hover:text-gray-900 transition-colors"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                </div>
                <div class="bg-gray-50 dark:bg-gray-900 p-2 md:p-8 rounded-3xl max-h-[70vh] overflow-auto border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <div id="releve-content" class="bg-white p-4 md:p-12 mx-auto w-full md:w-[210mm] min-h-fit md:min-h-[297mm] shadow-lg origin-top scale-[0.6] sm:scale-[0.8] md:scale-100 mb-10">
                        <div v-if="currentReleve" class="text-black font-serif">
                            <div class="text-center mb-10">
                                <img v-if="currentReleve.logo_url || parametreStore.getAppLogo" :src="currentReleve.logo_url || parametreStore.getAppLogo" class="h-16 md:h-20 mx-auto mb-4" />
                                <h1 class="text-xl md:text-2xl font-bold text-indigo-700 uppercase">{{ parametreStore.getParamValue('nom_de_etablissement') || 'UNIVERSITÉ EXCELLENCE' }}</h1>
                            </div>
                            <div class="flex justify-between border-b-2 border-indigo-600 pb-4 mb-8 text-left">
                                <div>
                                    <p class="text-[10px] text-gray-500 uppercase">Étudiant</p>
                                    <p class="text-base md:text-lg font-bold">{{ studentName }}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-[10px] text-gray-500 uppercase">Matricule</p>
                                    <p class="text-base md:text-lg font-bold">{{ etudiantStore.etudiant?.matricule }}</p>
                                </div>
                            </div>
                            <table class="w-full border-collapse mb-8 text-left">
                                <thead class="bg-indigo-600 text-white text-[10px] uppercase">
                                    <tr>
                                        <th class="p-3">Matières</th>
                                        <th class="p-3 text-center">Devoir</th>
                                        <th class="p-3 text-center">Examen</th>
                                        <th class="p-3 text-center">Moy.</th>
                                        <th class="p-3 text-center">Crédit</th>
                                    </tr>
                                </thead>
                                <tbody class="text-xs md:text-sm">
                                    <tr v-for="uv in currentUVs" :key="uv.nom" class="border-b border-gray-100">
                                        <td class="p-2 md:p-3">{{ uv.nom }}</td>
                                        <td class="p-2 md:p-3 text-center">{{ uv.devoir }}</td>
                                        <td class="p-2 md:p-3 text-center">{{ uv.examen }}</td>
                                        <td class="p-2 md:p-3 text-center font-bold">{{ uv.note }}</td>
                                        <td class="p-2 md:p-3 text-center">{{ uv.credits }}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="flex justify-between items-center bg-gray-50 p-4 md:p-6 rounded-2xl">
                                <p class="text-xs md:text-sm font-bold uppercase">Moyenne Générale</p>
                                <p class="text-2xl md:text-3xl font-black text-indigo-600">{{ currentReleve.moyenne_generale }} / 20</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal Désactivation -->
    <TransitionRoot appear :show="showDisableModal" as="template">
        <Dialog as="div" class="relative z-50" @close="showDisableModal = false">
            <div class="fixed inset-0 bg-black/60" />
            <div class="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel class="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl">
                    <DialogTitle class="text-xl md:text-2xl font-black mb-4 uppercase tracking-tight text-red-600">Désactiver le compte</DialogTitle>
                    <p class="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-8">
                        Êtes-vous sûr de vouloir changer le statut de ce compte ? Cette action peut restreindre l'accès de l'étudiant à la plateforme.
                    </p>
                    <div class="flex gap-3 justify-end">
                        <button @click="showDisableModal = false" class="px-4 py-2 text-gray-500 font-bold">Annuler</button>
                        <button @click="confirmDisable" class="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all">Confirmer</button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    </TransitionRoot>

    <!-- Modal Sélection Période -->
    <TransitionRoot appear :show="showReleveModal" as="template">
        <Dialog as="div" class="relative z-50" @close="showReleveModal = false">
            <div class="fixed inset-0 bg-black/60" />
            <div class="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel class="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl">
                    <DialogTitle class="text-xl md:text-2xl font-black mb-6 uppercase tracking-tight">Générer un relevé</DialogTitle>
                    <Dropdown v-model="form.periode_id" :options="periodeOptions" optionLabel="label" optionValue="value" placeholder="Choisir une période" class="w-full mb-8" />
                    <div class="flex gap-3 justify-end">
                        <button @click="showReleveModal = false" class="px-4 py-2 text-gray-500 font-bold">Annuler</button>
                        <button @click="generateReleveDeNote" class="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">Confirmer</button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Dialog, DialogPanel, DialogTitle, TransitionRoot } from "@headlessui/vue";
import Dropdown from "primevue/dropdown";
import Menu from "primevue/menu";
import Breadcrumb from "~/components/Breadcrumb.vue";
import Toast from 'primevue/toast';
import { useEtudiantStore } from "~~/stores/etudiant";
import { usePeriodeStore } from "~~/stores/periode";
import { useReleveNoteStore } from "~~/stores/relevenote";
import { useParametreStore } from "~~/stores/parametre";
import config from "~~/config";

// Chargement dynamique sécurisé de html2pdf
const loadHtml2Pdf = async () => {
    if (process.client) {
        const module = await import("html2pdf.js");
        return module.default;
    }
    return null;
};

const etudiantStore = useEtudiantStore();
const periodeStore = usePeriodeStore();
const relevenoteStore = useReleveNoteStore();
const parametreStore = useParametreStore();
const route = useRoute();
const { $toastr, $swal } = useNuxtApp();

const activeTab = ref("info");
const showPreviewModal = ref(false);
const showReleveModal = ref(false);
const showDisableModal = ref(false);
const activeReleve = ref(null);
const isGenerating = ref(false);
const form = ref({ periode_id: "" });
const menu = ref(null);

const initials = computed(() => {
    if (!etudiantStore.etudiant) return "";
    return (etudiantStore.etudiant.nom.charAt(0) + etudiantStore.etudiant.prenom.charAt(0)).toUpperCase();
});

const studentName = computed(() => etudiantStore.etudiant ? `${etudiantStore.etudiant.nom} ${etudiantStore.etudiant.prenom}` : "Chargement...");

const tabs = [
    { id: 'info', label: 'Informations', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'releves', label: 'Relevés de notes', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'dossier', label: 'Dossier (Album)', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' }
];

const personalInfo = computed(() => [
    { label: 'Nom de famille', value: etudiantStore.etudiant?.nom },
    { label: 'Prénom(s)', value: etudiantStore.etudiant?.prenom },
    { label: 'Genre', value: etudiantStore.etudiant?.genre },
    { label: 'Nationalité', value: etudiantStore.etudiant?.nationalite },
    { label: 'Date de naissance', value: formatDate(etudiantStore.etudiant?.date_naissance) },
    { label: 'Lieu de naissance', value: etudiantStore.etudiant?.lieu_naissance }
]);

const sidebarAcademic = computed(() => [
    { label: 'Groupe', value: etudiantStore.etudiant?.dernier_groupe?.group?.nom, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'Niveau', value: etudiantStore.etudiant?.dernier_groupe?.niveau?.nom, icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { label: 'Filière', value: etudiantStore.etudiant?.dernier_groupe?.filiere?.nom, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { label: 'Formation', value: etudiantStore.etudiant?.dernier_groupe?.mode_formation || 'Présentiel', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' }
]);

const menuItems = computed(() => [
    {
        label: 'Actions',
        items: [
            {
                label: etudiantStore.etudiant?.statut === 'actif' ? 'Désactiver le compte' : 'Réactiver le compte',
                icon: 'pi pi-ban',
                command: () => showDisableModal.value = true
            },
            {
                label: 'Imprimer le dossier',
                icon: 'pi pi-print',
                command: () => printDossier()
            }
        ]
    }
]);

const toggleMenu = (event) => menu.value.toggle(event);

const hasDocuments = computed(() => {
    if (!etudiantStore.etudiant?.album) return false;
    return Object.keys(documentLabels).some(key => etudiantStore.etudiant.album[key]);
});

const documentLabels = {
    naissance: "Acte de naissance",
    diplome: "Diplôme / Attestation BAC",
    nationalite: "Nationalité",
    photo: "Photo d'identité",
    certificat_medical: "Certificat Médical",
    cv: "CV / Expériences",
    releve_bac1_path: "Relevé BAC 1",
    releve_bac2_path: "Relevé BAC 2",
};

const currentReleve = computed(() => activeReleve.value);
const currentUVs = computed(() => {
    if (!currentReleve.value?.ues) return [];
    return currentReleve.value.ues.flatMap(ue => ue.uvs.map(uv => ({
        nom: uv.nom,
        devoir: uv.devoir || "0.00",
        examen: uv.examen || "0.00",
        note: uv.moyenne_uv,
        credits: uv.coefficient
    })));
});

const periodeOptions = computed(() => periodeStore.periode.map(p => ({ label: p.nom, value: p.id })));

const formatDate = (date) => date ? new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';
const getFileUrl = (path) => `${process.dev ? config.app_dev_storage_url : config.app_prod_storage_url}/${path}`;
const isImage = (path) => /\.(jpg|jpeg|png|webp|svg)$/i.test(path);
const getFileExtension = (path) => path?.split('.').pop().toUpperCase();

const printDossier = async () => {
    const html2pdf = await loadHtml2Pdf();
    if (!html2pdf) return $toastr.error("Bibliothèque PDF non disponible.");
    
    $swal.fire({
        title: 'Impression du dossier...',
        text: 'Génération du document en cours.',
        allowOutsideClick: false,
        didOpen: () => $swal.showLoading()
    });
    
    const element = document.getElementById('printable-dossier'); 
    const options = {
        margin: [10, 10, 10, 10],
        filename: `dossier_${etudiantStore.etudiant?.nom || 'etudiant'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        await html2pdf().set(options).from(element).save();
        $swal.close();
        $toastr.success("Dossier téléchargé");
    } catch (e) {
        $swal.close();
        $toastr.error("Erreur lors de l'impression");
    }
};

const generateReleveDeNote = async () => {
    if (!form.value.periode_id) return $toastr.error("Sélectionnez une période");
    isGenerating.value = true;
    try {
        const res = await relevenoteStore.GenererReleveNotes(route.params.slug, {
            annee_scolaire_id: periodeStore.periodes.find(p => p.id === form.value.periode_id).annee_scolaire_id,
            periode_id: form.value.periode_id
        });
        if (res) {
            activeReleve.value = res;
            showPreviewModal.value = true;
            showReleveModal.value = false;
        }
    } catch (e) { $toastr.error("Erreur de génération"); }
    finally { isGenerating.value = false; }
};

const deleteReleve = async (id) => {
    const res = await $swal.fire({ title: 'Supprimer ?', icon: 'warning', showCancelButton: true });
    if (res.isConfirmed) {
        await relevenoteStore.deleteReleveNote(id);
        $toastr.success("Supprimé");
    }
};

const confirmDisable = async () => {
    const newStatut = etudiantStore.etudiant.statut === 'actif' ? 'bloque' : 'actif';
    etudiantStore.etudiant.statut = newStatut;
    $toastr.success(`Statut mis à jour : ${newStatut}`);
    showDisableModal.value = false;
};

const openReleveModal = () => showReleveModal.value = true;
const downloadCurrentPDF = async () => {
    const html2pdf = await loadHtml2Pdf();
    if (!html2pdf) return;
    const element = document.getElementById("releve-content");
    await html2pdf().set({ margin: 10, filename: 'releve.pdf', html2canvas: { scale: 2 } }).from(element).save();
};

onMounted(async () => {
    await etudiantStore.fetchEtudiant(route.params.slug);
    await periodeStore.fetchPeriodeByYear();
    await relevenoteStore.getReleveNotes(route.params.slug);
    await parametreStore.fetchParametres();
});
</script>

<style scoped>
.animate-in { animation: animate-in 0.5s ease-out; }
@keyframes animate-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
:deep(.p-dropdown) { border-radius: 1rem !important; border: 1px solid #e5e7eb !important; }
</style>
