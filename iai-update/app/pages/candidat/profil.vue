<template>
  <div class="max-w-5xl mx-auto space-y-10">
    <!-- En-tête Premium -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-100 dark:border-[#1a1a2a]">
      <div class="flex items-center gap-5">
        <div class="w-14 h-14 rounded-[10px] bg-[#01b4d5]/10 text-[#01b4d5] flex items-center justify-center ring-4 ring-[#01b4d5]/5">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1A2238] dark:text-white tracking-tight">Informations du Candidat</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Consultez et gérez vos données personnelles de candidature.</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- Bouton d'enregistrement visible uniquement en mode rectification -->
        <button v-if="isRectification" @click="saveProfile" :disabled="isSaving || isSubmitting" class="h-11 px-6 bg-[#01b4d5] hover:bg-[#009ab5] text-white font-bold rounded-[10px] shadow-[0_4px_14px_0_rgba(1,180,213,0.39)] hover:shadow-[0_6px_20px_rgba(1,180,213,0.23)] hover:-translate-y-0.5 transition-all flex items-center gap-2.5 disabled:opacity-70 disabled:pointer-events-none whitespace-nowrap">
          <svg v-if="isSaving" class="animate-spin h-5 w-5 text-white shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <svg v-else class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <span class="hidden sm:inline">{{ isSaving ? 'Enregistrement...' : 'Sauvegarder' }}</span>
          <span class="sm:hidden">{{ isSaving ? '...' : 'Sauver' }}</span>
        </button>

        <!-- Bouton Soumettre définitivement -->
        <button v-if="isRectification" @click="submitRectifications" :disabled="isSaving || isSubmitting" class="h-11 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-[10px] shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 transition-all flex items-center gap-2.5 disabled:opacity-70 disabled:pointer-events-none whitespace-nowrap">
          <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <svg v-else class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
          <span class="hidden sm:inline">{{ isSubmitting ? 'Soumission...' : 'Terminer & Soumettre' }}</span>
          <span class="sm:hidden">{{ isSubmitting ? '...' : 'Soumettre' }}</span>
        </button>
      </div>
    </div>

    <!-- Message de Rectification -->
    <div v-if="isRectification" class="bg-white dark:bg-[#11111e] rounded-[10px] border border-[#01b4d5]/20 shadow-xl shadow-[#01b4d5]/10 relative overflow-hidden mb-10">
      <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#01b4d5] to-[#009ab5]"></div>

      <div class="p-8 md:p-10">
        <div class="flex flex-col md:flex-row gap-8 items-start">

          <!-- Icon -->
          <div class="w-16 h-16 rounded-[10px] bg-[#01b4d5]/10 flex items-center justify-center flex-shrink-0 border border-[#01b4d5]/20 shadow-inner">
            <svg class="w-8 h-8 text-[#01b4d5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>

          <!-- Content -->
          <div class="flex-1">
            <h3 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Mode Édition Activé</h3>
            <p class="text-gray-500 dark:text-gray-400 text-base mb-6 leading-relaxed max-w-3xl">
              Suite à la demande de rectification de l'administration, vous pouvez maintenant modifier vos informations personnelles ci-dessous. N'oubliez pas de sauvegarder.
            </p>

            <!-- Motif Box -->
            <div v-if="candidature?.motif" class="bg-gray-50/50 dark:bg-[#0a0a12]/50 rounded-[10px] p-6 border border-gray-200 dark:border-[#1a1a2a] relative max-w-3xl">
              <div class="flex gap-4">
                <svg class="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                <div>
                  <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Message de l'administration</h4>
                  <p class="text-gray-800 dark:text-gray-200 text-base italic font-medium leading-relaxed">"{{ candidature.motif }}"</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-32">
       <svg class="animate-spin h-10 w-10 text-[#01b4d5] mb-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
       <p class="text-gray-500 dark:text-gray-400 font-medium">Récupération sécurisée de votre profil...</p>
    </div>

    <form v-else-if="candidature" class="space-y-8" @submit.prevent>

      <!-- Section 1: Identité du candidat -->
      <div class="bg-white dark:bg-[#11111e] rounded-[10px] p-6 sm:p-8 border border-gray-100 dark:border-[#1a1a2a] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        <h3 class="flex items-center gap-3 text-sm font-extrabold text-[#1A2238] dark:text-white uppercase tracking-widest mb-6">
          <span class="w-8 h-8 rounded-[10px] bg-[#01b4d5]/10 flex items-center justify-center text-[#01b4d5]">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </span>
          Identité du Candidat
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5">
          <div>
            <label class="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Genre</label>
            <select v-model="formData.genre" :disabled="!isRectification" :class="inputClass">
              <option value="">Sélectionner</option>
              <option value="Masculin">Masculin</option>
              <option value="Féminin">Féminin</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Nom</label>
            <input type="text" v-model="formData.nom" :readonly="!isRectification" :class="inputClass" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Prénoms</label>
            <input type="text" v-model="formData.prenom" :readonly="!isRectification" :class="inputClass" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Date de naissance</label>
            <input type="date" v-model="formData.date_naissance" :readonly="!isRectification" :class="inputClass" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Lieu de naissance</label>
            <input type="text" v-model="formData.lieu_naissance" :readonly="!isRectification" :class="inputClass" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Nationalité</label>
            <div class="relative" ref="dropdownRef" v-if="isRectification">
                <button type="button" @click="isDropdownOpen = !isDropdownOpen" :class="[inputClass, 'flex items-center justify-between text-left cursor-pointer']">
                    <div v-if="formData.nationalite" class="flex items-center gap-3">
                        <img :src="`https://flagcdn.com/w20/${nationalitesList.find(n => n.value === formData.nationalite)?.code || 'tg'}.png`" class="w-6 shadow-sm rounded-[10px]" />
                        <span class="text-[#1A2238] dark:text-white font-medium">{{ formData.nationalite }}</span>
                    </div>
                    <div v-else class="text-gray-400 font-medium">Sélectionner une nationalité</div>
                    <svg class="w-4 h-4 text-gray-400 transition-transform duration-300" :class="{ 'rotate-180': isDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>

                <div v-if="isDropdownOpen" class="absolute z-50 w-full mt-2 bg-white dark:bg-[#1a1a2a] border border-gray-100 dark:border-[#242438] rounded-[10px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] max-h-64 overflow-hidden flex flex-col">
                    <div class="p-2 border-b border-gray-50 dark:border-[#242438] bg-gray-50/50 dark:bg-[#11111e]/50">
                         <input type="text" v-model="searchNat" placeholder="Rechercher un pays..." class="w-full px-4 py-2.5 bg-white dark:bg-[#0a0a12] border border-gray-200 dark:border-[#242438] rounded-[10px] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#01b4d5] focus:ring-1 focus:ring-[#01b4d5] transition-all shadow-sm">
                    </div>
                    <div class="overflow-y-auto p-1">
                        <div v-if="filteredNationalites.length === 0" class="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            Aucun résultat trouvé.
                        </div>
                        <button type="button" v-for="nat in filteredNationalites" :key="nat.value" @click="selectNat(nat.value)" class="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-[#242438] rounded-[10px] flex items-center gap-3 transition-colors">
                            <img :src="`https://flagcdn.com/w20/${nat.code}.png`" class="w-5 shadow-sm rounded-[10px]" />
                            <span class="text-sm font-medium" :class="formData.nationalite === nat.value ? 'text-[#01b4d5]' : 'text-gray-700 dark:text-gray-300'">{{ nat.label }}</span>
                            <svg v-if="formData.nationalite === nat.value" class="w-4 h-4 text-[#01b4d5] ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        </button>
                    </div>
                </div>
            </div>
            <div v-else :class="[inputClass, 'flex items-center gap-3']">
                <img v-if="formData.nationalite" :src="`https://flagcdn.com/w20/${nationalitesList.find(n => n.value === formData.nationalite)?.code || 'tg'}.png`" class="w-6 shadow-sm rounded-[10px]" />
                <span class="text-[#1A2238] dark:text-white font-medium">{{ formData.nationalite || 'Non renseigné' }}</span>
            </div>
          </div>
          <div class="sm:col-span-2">
            <label class="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Quartier (Adresse)</label>
            <input type="text" v-model="formData.adresse" :readonly="!isRectification" :class="inputClass" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Téléphone</label>
            <div class="w-full" :class="{ 'pointer-events-none opacity-80': !isRectification }">
               <input type="tel" ref="phoneInput" :class="inputClass" />
            </div>
          </div>
          <div class="sm:col-span-3">
            <label class="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Email</label>
            <input type="email" v-model="formData.email" :readonly="!isRectification" :class="inputClass" />
          </div>
        </div>
      </div>

      <!-- Section 1.5: Formation Souhaitée -->
      <div class="bg-white dark:bg-[#11111e] rounded-[10px] p-6 sm:p-8 border border-gray-100 dark:border-[#1a1a2a] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        <h3 class="flex items-center gap-3 text-sm font-extrabold text-[#1A2238] dark:text-white uppercase tracking-widest mb-6">
          <span class="w-8 h-8 rounded-[10px] bg-purple-50 flex items-center justify-center text-purple-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          </span>
          Formation Souhaitée
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
          <div>
            <label class="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Niveau visé</label>
            <select disabled class="w-full px-4 py-3 bg-gray-50/50 dark:bg-[#0a0a12]/50 border border-gray-100 dark:border-[#1a1a2a] rounded-[10px] font-semibold text-[#1A2238] dark:text-white focus:outline-none placeholder-gray-300 pointer-events-none opacity-90">
              <option>{{ formData.niveau_nom || 'Non renseigné' }}</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Filière souhaitée</label>
            <select disabled class="w-full px-4 py-3 bg-gray-50/50 dark:bg-[#0a0a12]/50 border border-gray-100 dark:border-[#1a1a2a] rounded-[10px] font-semibold text-[#1A2238] dark:text-white focus:outline-none placeholder-gray-300 pointer-events-none opacity-90">
              <option>{{ formData.filiere_nom || 'Non renseigné' }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Section 2: Parcours Scolaire (Baccalauréat) -->
      <div class="bg-white dark:bg-[#11111e] rounded-[10px] p-6 sm:p-8 border border-gray-100 dark:border-[#1a1a2a] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        <h3 class="flex items-center gap-3 text-sm font-extrabold text-[#1A2238] dark:text-white uppercase tracking-widest mb-6">
          <span class="w-8 h-8 rounded-[10px] bg-indigo-50 flex items-center justify-center text-indigo-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
          </span>
          Parcours Scolaire
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
          <div>
            <label class="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Type de diplôme</label>
            <input type="text" v-model="formData.type_diplome" :readonly="!isRectification" :class="inputClass" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Série (Bac)</label>
            <select v-model="formData.serie" :disabled="!isRectification" :class="inputClass">
              <option value="">Sélectionner</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F2">F2</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Établissement</label>
            <input type="text" v-model="formData.etablissement_diplome" :readonly="!isRectification" :class="inputClass" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Année d'obtention</label>
            <input type="text" v-model="formData.annee_bac" :readonly="!isRectification" :class="inputClass" />
          </div>
        </div>
      </div>

      <!-- Section 3: Tuteurs (multi-tuteur) -->
      <div class="bg-white dark:bg-[#11111e] rounded-[10px] p-6 sm:p-8 border border-gray-100 dark:border-[#1a1a2a] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        <div class="flex items-center justify-between mb-6">
          <h3 class="flex items-center gap-3 text-sm font-extrabold text-[#1A2238] dark:text-white uppercase tracking-widest">
            <span class="w-8 h-8 rounded-[10px] bg-emerald-50 flex items-center justify-center text-emerald-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </span>
            Tuteurs / Responsable des frais
          </h3>
          <button v-if="isRectification" type="button" @click="ajouterTuteur" class="h-9 px-4 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-[10px] flex items-center gap-2 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Ajouter un tuteur
          </button>
        </div>

        <p class="text-xs text-gray-400 dark:text-gray-500 font-medium mb-5 -mt-2">Cochez "Responsable des frais" pour le tuteur qui prend en charge les frais de scolarité.</p>

        <div class="space-y-6">
          <div v-for="(tuteur, index) in tuteurs" :key="tuteur._uid" class="border border-gray-100 dark:border-[#1a1a2a] rounded-[10px] p-5 relative bg-gray-50/40 dark:bg-[#0a0a12]/30">
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Tuteur {{ index + 1 }}</span>
              <button v-if="isRectification && tuteurs.length > 1" type="button" @click="retirerTuteur(index)" class="w-7 h-7 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[10px] transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5">
              <div>
                <label class="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Nom</label>
                <input type="text" v-model="tuteur.nom" :readonly="!isRectification" :class="inputClass" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Prénom</label>
                <input type="text" v-model="tuteur.prenom" :readonly="!isRectification" :class="inputClass" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Profession</label>
                <input type="text" v-model="tuteur.profession" :readonly="!isRectification" :class="inputClass" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Employeur</label>
                <input type="text" v-model="tuteur.employeur" :readonly="!isRectification" :class="inputClass" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Téléphone</label>
                <div class="w-full" :class="{ 'pointer-events-none opacity-80': !isRectification }">
                  <input type="tel" v-model="tuteur.tel" :readonly="!isRectification" :ref="(el) => initPhoneWidget(el, tuteur._uid, (num) => (tuteur.tel = num))" :class="inputClass" />
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Email</label>
                <input type="email" v-model="tuteur.email" :readonly="!isRectification" :class="inputClass" />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Adresse</label>
                <input type="text" v-model="tuteur.adresse" :readonly="!isRectification" :class="inputClass" />
              </div>
              <div class="flex items-end pb-2">
                <label class="flex items-center gap-2.5 cursor-pointer select-none" :class="{ 'pointer-events-none opacity-70': !isRectification }">
                  <input type="checkbox" v-model="tuteur.responsable_des_frais" :disabled="!isRectification" class="w-4 h-4 rounded accent-[#01b4d5]" />
                  <span class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Responsable des frais</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

    </form>

    <!-- Empty State Si pas de candidat -->
    <div v-else class="bg-red-50 dark:bg-red-900/20 rounded-[10px] p-12 text-center border border-red-100 dark:border-red-800 mt-10">
       <div class="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/40 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mb-5">
         <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
       </div>
       <h3 class="text-xl font-extrabold text-red-800 dark:text-red-300">Impossible de charger le profil</h3>
       <p class="text-red-600 dark:text-red-400 font-medium mt-2">Vous n'êtes pas connecté ou votre session a expiré.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from "vue";
import { useNuxtApp } from "#app";
import { useCandidatAuthStore } from "~~/stores/candidatAuth";
import { useNiveauStore } from "~~/stores/niveau";
import { useFiliereStore } from "~~/stores/filiere";

definePageMeta({
  layout: "candidat",
});

const { $toastr, $swal, $intlTelInput } = useNuxtApp();
const candidatAuthStore = useCandidatAuthStore();
const niveauStore = useNiveauStore();
const filiereStore = useFiliereStore();

const isLoading = ref(true);
const isSaving = ref(false);
const isSubmitting = ref(false);
const candidature = ref(null);

const phoneInput = ref(null);

let itiTel = null;

const tuteurs = ref([]);
let tuteurUidCounter = 0;
const phoneWidgets = {};

const searchNat = ref("");
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

const nationalitesList = [
    { label: "Afghane", value: "Afghane", code: "af" }, { label: "Sud-africaine", value: "Sud-africaine", code: "za" }, { label: "Albanaise", value: "Albanaise", code: "al" }, { label: "Algérienne", value: "Algérienne", code: "dz" }, { label: "Allemande", value: "Allemande", code: "de" }, { label: "Américaine", value: "Américaine", code: "us" }, { label: "Andorrane", value: "Andorrane", code: "ad" }, { label: "Angolaise", value: "Angolaise", code: "ao" }, { label: "Argentine", value: "Argentine", code: "ar" }, { label: "Arménienne", value: "Arménienne", code: "am" }, { label: "Australienne", value: "Australienne", code: "au" }, { label: "Autrichienne", value: "Autrichienne", code: "at" }, { label: "Azerbaïdjanaise", value: "Azerbaïdjanaise", code: "az" }, { label: "Bahamienne", value: "Bahamienne", code: "bs" }, { label: "Bangladaise", value: "Bangladaise", code: "bd" }, { label: "Belge", value: "Belge", code: "be" }, { label: "Béninoise", value: "Béninoise", code: "bj" }, { label: "Biélorusse", value: "Biélorusse", code: "by" }, { label: "Bolivienne", value: "Bolivienne", code: "bo" }, { label: "Bosnienne", value: "Bosnienne", code: "ba" }, { label: "Botswanaise", value: "Botswanaise", code: "bw" }, { label: "Brésilienne", value: "Brésilienne", code: "br" }, { label: "Britannique", value: "Britannique", code: "gb" }, { label: "Bulgare", value: "Bulgare", code: "bg" }, { label: "Burkinabée", value: "Burkinabée", code: "bf" }, { label: "Burundaise", value: "Burundaise", code: "bi" }, { label: "Camerounaise", value: "Camerounaise", code: "cm" }, { label: "Canadienne", value: "Canadienne", code: "ca" }, { label: "Cap-Verdienne", value: "Cap-Verdienne", code: "cv" }, { label: "Centrafricaine", value: "Centrafricaine", code: "cf" }, { label: "Chilienne", value: "Chilienne", code: "cl" }, { label: "Chinoise", value: "Chinoise", code: "cn" }, { label: "Colombienne", value: "Colombienne", code: "co" }, { label: "Comorienne", value: "Comorienne", code: "km" }, { label: "Congolaise (RDC)", value: "Congolaise (RDC)", code: "cd" }, { label: "Congolaise (Rép)", value: "Congolaise (Rép)", code: "cg" }, { label: "Costaricaine", value: "Costaricaine", code: "cr" }, { label: "Croate", value: "Croate", code: "hr" }, { label: "Cubaine", value: "Cubaine", code: "cu" }, { label: "Danoise", value: "Danoise", code: "dk" }, { label: "Djiboutienne", value: "Djiboutienne", code: "dj" }, { label: "Dominicaine", value: "Dominicaine", code: "do" }, { label: "Égyptienne", value: "Égyptienne", code: "eg" }, { label: "Émirienne", value: "Émirienne", code: "ae" }, { label: "Équatorienne", value: "Équatorienne", code: "ec" }, { label: "Espagnole", value: "Espagnole", code: "es" }, { label: "Éthiopienne", value: "Éthiopienne", code: "et" }, { label: "Finlandaise", value: "Finlandaise", code: "fi" }, { label: "Française", value: "Française", code: "fr" }, { label: "Gabonaise", value: "Gabonaise", code: "ga" }, { label: "Gambienne", value: "Gambienne", code: "gm" }, { label: "Géorgienne", value: "Géorgienne", code: "ge" }, { label: "Ghanéenne", value: "Ghanéenne", code: "gh" }, { label: "Grecque", value: "Grecque", code: "gr" }, { label: "Guinéenne", value: "Guinéenne", code: "gn" }, { label: "Équato-guinéenne", value: "Équato-guinéenne", code: "gq" }, { label: "Bissau-guinéenne", value: "Bissau-guinéenne", code: "gw" }, { label: "Haïtienne", value: "Haïtienne", code: "ht" }, { label: "Hongroise", value: "Hongroise", code: "hu" }, { label: "Indienne", value: "Indienne", code: "in" }, { label: "Indonésienne", value: "Indonésienne", code: "id" }, { label: "Irakienne", value: "Irakienne", code: "iq" }, { label: "Iranienne", value: "Iranienne", code: "ir" }, { label: "Irlandaise", value: "Irlandaise", code: "ie" }, { label: "Israélienne", value: "Israélienne", code: "il" }, { label: "Italienne", value: "Italienne", code: "it" }, { label: "Ivoirienne", value: "Ivoirienne", code: "ci" }, { label: "Jamaïcaine", value: "Jamaïcaine", code: "jm" }, { label: "Japonaise", value: "Japonaise", code: "jp" }, { label: "Jordanienne", value: "Jordanienne", code: "jo" }, { label: "Kényane", value: "Kényane", code: "ke" }, { label: "Koweïtienne", value: "Koweïtienne", code: "kw" }, { label: "Libanaise", value: "Libanaise", code: "lb" }, { label: "Libérienne", value: "Libérienne", code: "lr" }, { label: "Libyenne", value: "Libyenne", code: "ly" }, { label: "Malgache", value: "Malgache", code: "mg" }, { label: "Malaisienne", value: "Malaisienne", code: "my" }, { label: "Malienne", value: "Malienne", code: "ml" }, { label: "Marocaine", value: "Marocaine", code: "ma" }, { label: "Mauricienne", value: "Mauricienne", code: "mu" }, { label: "Mauritanienne", value: "Mauritanienne", code: "mr" }, { label: "Mexicaine", value: "Mexicaine", code: "mx" }, { label: "Monégasque", value: "Monégasque", code: "mc" }, { label: "Mozambicaine", value: "Mozambicaine", code: "mz" }, { label: "Namibienne", value: "Namibienne", code: "na" }, { label: "Nigérienne", value: "Nigérienne", code: "ne" }, { label: "Nigériane", value: "Nigériane", code: "ng" }, { label: "Norvégienne", value: "Norvégienne", code: "no" }, { label: "Néo-zélandaise", value: "Néo-zélandaise", code: "nz" }, { label: "Ougandaise", value: "Ougandaise", code: "ug" }, { label: "Pakistanaise", value: "Pakistanaise", code: "pk" }, { label: "Palestinienne", value: "Palestinienne", code: "ps" }, { label: "Panaméenne", value: "Panaméenne", code: "pa" }, { label: "Paraguayenne", value: "Paraguayenne", code: "py" }, { label: "Néerlandaise", value: "Néerlandaise", code: "nl" }, { label: "Péruvienne", value: "Péruvienne", code: "pe" }, { label: "Philippine", value: "Philippine", code: "ph" }, { label: "Polonaise", value: "Polonaise", code: "pl" }, { label: "Portugaise", value: "Portugaise", code: "pt" }, { label: "Qatarienne", value: "Qatarienne", code: "qa" }, { label: "Roumaine", value: "Roumaine", code: "ro" }, { label: "Russe", value: "Russe", code: "ru" }, { label: "Rwandaise", value: "Rwandaise", code: "rw" }, { label: "Saoudienne", value: "Saoudienne", code: "sa" }, { label: "Sénégalaise", value: "Sénégalaise", code: "sn" }, { label: "Serbe", value: "Serbe", code: "rs" }, { label: "Somalienne", value: "Somalienne", code: "so" }, { label: "Soudanaise", value: "Soudanaise", code: "sd" }, { label: "Suédoise", value: "Suédoise", code: "se" }, { label: "Suisse", value: "Suisse", code: "ch" }, { label: "Syrienne", value: "Syrienne", code: "sy" }, { label: "Tanzanienne", value: "Tanzanienne", code: "tz" }, { label: "Tchadienne", value: "Tchadienne", code: "td" }, { label: "Tchèque", value: "Tchèque", code: "cz" }, { label: "Thaïlandaise", value: "Thaïlandaise", code: "th" }, { label: "Togolaise", value: "Togolaise", code: "tg" }, { label: "Tunisienne", value: "Tunisienne", code: "tn" }, { label: "Turque", value: "Turque", code: "tr" }, { label: "Ukrainienne", value: "Ukrainienne", code: "ua" }, { label: "Uruguayenne", value: "Uruguayenne", code: "uy" }, { label: "Vénézuélienne", value: "Vénézuélienne", code: "ve" }, { label: "Vietnamienne", value: "Vietnamienne", code: "vn" }, { label: "Zambienne", value: "Zambienne", code: "zm" }, { label: "Zimbabwéenne", value: "Zimbabwéenne", code: "zw" }
];

const filteredNationalites = computed(() => {
    if (!searchNat.value) return nationalitesList;
    const q = searchNat.value.toLowerCase();
    return nationalitesList.filter((n) => n.label.toLowerCase().includes(q));
});

const selectNat = (val) => {
    formData.value.nationalite = val;
    isDropdownOpen.value = false;
    searchNat.value = "";
};

let countryCodePromise = null;
const getCountryCode = () => {
    if (!countryCodePromise) {
        countryCodePromise = fetch("https://api.country.is/")
            .then((res) => res.json())
            .then((data) => (data.country ? data.country.toLowerCase() : "tg"))
            .catch(() => "tg");
    }
    return countryCodePromise;
};

const initIti = (inputRef) => {
    if (inputRef.value && $intlTelInput) {
        return $intlTelInput(inputRef.value, {
            initialCountryLookup: () => getCountryCode(),
            separateDialCode: true,
            useFullscreenPopup: false,
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@25.15.0/build/js/utils.js",
        });
    }
    return null;
};

// iti.getNumber() lance une exception tant que le script utilsScript (chargé de
// façon asynchrone depuis un CDN) n'est pas encore prêt — on doit toujours
// l'entourer d'un try/catch et retomber sur la valeur brute du champ.
const safeGetNumber = (iti) => {
  try {
    return iti.getNumber();
  } catch (e) {
    return null;
  }
};

const applyFallbackPhone = () => {
       if (itiTel) {
           const num = safeGetNumber(itiTel);
           if (num) formData.value.tel = num;
           else if (phoneInput.value && phoneInput.value.value) {
               const cd = itiTel.getSelectedCountry();
               formData.value.tel = (cd ? "+" + cd.dialCode : "") + " " + phoneInput.value.value;
           }
       }
};

// Widget d'indicatif téléphonique pour une liste dynamique de tuteurs — pattern
// identique à modifier-[slug].vue : ref-callback qui initialise au montage et
// détruit au démontage (el vaut null quand Vue retire l'élément du DOM).
const initPhoneWidget = (el, key, onNumberChange) => {
  if (!el) {
    if (phoneWidgets[key]) {
      try { phoneWidgets[key].destroy(); } catch (e) { /* déjà détruit */ }
      delete phoneWidgets[key];
    }
    return;
  }
  if (phoneWidgets[key] || !$intlTelInput) return;

  const iti = $intlTelInput(el, {
    initialCountryLookup: () => getCountryCode(),
    separateDialCode: true,
    useFullscreenPopup: false,
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@25.15.0/build/js/utils.js",
  });
  phoneWidgets[key] = iti;

  const sync = () => onNumberChange(safeGetNumber(iti) || el.value);
  el.addEventListener("blur", sync);
  el.addEventListener("countrychange", sync);
};

const creerTuteurVide = () => ({
  _uid: ++tuteurUidCounter,
  nom: "", prenom: "", profession: "", employeur: "", email: "", tel: "", adresse: "", responsable_des_frais: false,
});

const ajouterTuteur = () => {
  tuteurs.value.push(creerTuteurVide());
};
const retirerTuteur = (index) => {
  tuteurs.value.splice(index, 1);
};

const formData = ref({
  genre: "", nom: "", prenom: "", date_naissance: "", lieu_naissance: "", nationalite: "", adresse: "", tel: "", email: "",
  serie: "", annee_bac: "", type_diplome: "", etablissement_diplome: "",
  niveau_nom: "", filiere_nom: "",
});

const isRectification = computed(() => {
  if (!candidature.value) return false;
  return !!candidature.value.rectification_expected;
});

const inputClass = computed(() => {
  return isRectification.value
    ? "w-full px-4 py-3 bg-white dark:bg-[#1a1a2a] border border-gray-200 dark:border-[#242438] focus:border-[#01b4d5] focus:ring-4 focus:ring-[#01b4d5]/10 rounded-[10px] font-semibold text-[#1A2238] dark:text-white transition-all shadow-sm placeholder-gray-300 dark:placeholder-gray-500"
    : "w-full px-4 py-3 bg-gray-50/50 dark:bg-[#0a0a12]/50 border border-gray-100 dark:border-[#1a1a2a] rounded-[10px] font-semibold text-[#1A2238] dark:text-white focus:outline-none placeholder-gray-300 dark:placeholder-gray-500";
});

const initFormData = (data) => {
  formData.value = {
    genre: data.genre || "",
    nom: data.nom || "",
    prenom: data.prenom || "",
    date_naissance: data.date_naissance ? data.date_naissance.split("T")[0] : "",
    lieu_naissance: data.lieu_naissance || "",
    nationalite: data.nationalite || "",
    adresse: data.adresse || "",
    tel: data.tel || "",
    email: data.email || "",
    niveau_nom: data.niveau?.libelle || "",
    filiere_nom: data.filiere?.nom || "",
    serie: data.serie || "",
    annee_bac: data.annee_bac || "",
    type_diplome: data.dernier_diplome || "",
    etablissement_diplome: data.etablissement_diplome || "",
  };

  // `tuteurs` (MorphMany) et `tuteur` (MorphOne) pointent vers la même table ;
  // `tuteurs` contient toujours l'historique complet, quel que soit le nombre
  // réel de tuteurs saisis à l'origine — on ne se fie jamais au seul `tuteur`.
  const tuteursExistants = data.tuteurs && data.tuteurs.length > 0
    ? data.tuteurs
    : (data.tuteur ? [data.tuteur] : []);

  tuteurs.value = tuteursExistants.length > 0
    ? tuteursExistants.map((t) => ({
        _uid: ++tuteurUidCounter,
        nom: t.nom || "",
        prenom: t.prenom || "",
        profession: t.profession || "",
        employeur: t.employeur || "",
        email: t.email || "",
        tel: t.tel || "",
        adresse: t.adresse || "",
        responsable_des_frais: Boolean(t.responsable_des_frais),
      }))
    : [creerTuteurVide()];
};

const buildTuteursPayload = () => {
  return tuteurs.value
    .filter((t) => t.nom || t.prenom)
    .map((t) => ({
      nom: t.nom,
      prenom: t.prenom,
      profession: t.profession,
      employeur: t.employeur,
      email: t.email,
      tel: t.tel,
      adresse: t.adresse,
      responsable_des_frais: t.responsable_des_frais,
    }));
};

const buildUpdatePayload = () => ({
  genre: formData.value.genre,
  nom: formData.value.nom,
  prenom: formData.value.prenom,
  date_naissance: formData.value.date_naissance,
  lieu_naissance: formData.value.lieu_naissance,
  nationalite: formData.value.nationalite,
  adresse: formData.value.adresse,
  tel: formData.value.tel,
  email: formData.value.email,
  serie: formData.value.serie,
  annee_bac: formData.value.annee_bac,
  type_diplome: formData.value.type_diplome,
  etablissement_diplome: formData.value.etablissement_diplome,
  tuteurs: buildTuteursPayload(),
});

const saveProfile = async () => {
  applyFallbackPhone();
  if (!isRectification.value) return;
  isSaving.value = true;
  try {
    const data = await candidatAuthStore.updateProfil(buildUpdatePayload());
    $toastr.success("Profil mis à jour avec succès.");
    candidature.value = data.candidature;
    initFormData(data.candidature);
  } catch (error) {
    console.error("Erreur mise à jour profil:", error);
    $toastr.error("Erreur lors de la sauvegarde. Veuillez vérifier les informations.");
  } finally {
    isSaving.value = false;
  }
};

const submitRectifications = async () => {
  const res = await $swal.fire({
    title: "Soumettre les modifications ?",
    text: "Voulez-vous vraiment soumettre votre dossier rectifié ? L'administration en sera notifiée et vous ne pourrez plus faire de modifications.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, soumettre",
    cancelButtonText: "Annuler",
    confirmButtonColor: "#01b4d5",
  });

  if (!res.isConfirmed) return;

  isSubmitting.value = true;
  try {
    applyFallbackPhone();
    await candidatAuthStore.updateProfil(buildUpdatePayload());

    const data = await candidatAuthStore.submitRectification();

    candidature.value = data.candidature;
    initFormData(data.candidature);

    await $swal.fire({
      title: "Dossier soumis !",
      text: "Vos rectifications ont été envoyées à l'administration avec succès.",
      icon: "success",
      confirmButtonText: "OK",
    });
  } catch (error) {
    console.error("Erreur soumission rectifications:", error);
    $toastr.error("Une erreur est survenue lors de la soumission de votre dossier.");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  try {
    candidature.value = await candidatAuthStore.fetchMonDossier();
    if (candidature.value) {
      initFormData(candidature.value);

      if (!formData.value.niveau_nom && candidature.value.niveau_id) {
        try {
          await niveauStore.fetchNiveaux();
          const niv = niveauStore.niveaux.find((n) => n.id === candidature.value.niveau_id);
          if (niv) formData.value.niveau_nom = niv.libelle || "";
        } catch (e) {}
      }
      if (!formData.value.filiere_nom && candidature.value.filiere_id) {
        try {
          await filiereStore.fetchFilieres(candidature.value.niveau_id);
          const fil = filiereStore.filieres.find((f) => f.id === candidature.value.filiere_id);
          if (fil) formData.value.filiere_nom = fil.nom || "";
        } catch (e) {}
      }
    }
  } catch (error) {
    console.error("Erreur profil:", error);
  } finally {
    isLoading.value = false;
    await nextTick();
    itiTel = initIti(phoneInput);
    if (itiTel && formData.value.tel) itiTel.setNumber(formData.value.tel);
  }

  document.addEventListener("click", (e) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
      isDropdownOpen.value = false;
    }
  });
});
</script>

<style>
/* Corriger le z-index et l'affichage d'intl-tel-input */
.iti {
  width: 100%;
}
</style>
