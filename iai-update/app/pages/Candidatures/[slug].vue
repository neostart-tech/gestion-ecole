<template>
  <div class="min-h-screen bg-[#f3f3f8] dark:bg-[#08080f] font-sans transition-colors duration-500">
    
    <!-- Fond d'ambiance violet -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#7F45FD]/15 dark:bg-[#7F45FD]/25 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
      <div class="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#7F45FD]/15 dark:bg-[#7F45FD]/25 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjN0Y0NUZEIiBmaWxsLW9wYWNpdHk9IjAuMDgiPjxwYXRoIGQ9Ik0zNiAzNHYtNGgxdjRoLTF6bTAgM3YtMWgxdjFoLTF6bTAgNHYtMWgxdjFoLTF6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
    </div>

    <!-- Header - Élégant avec accent violet -->
    <header class="sticky top-0 z-30 bg-white/90 dark:bg-[#0a0a12]/90 backdrop-blur-2xl border-b border-[#e8e8f0] dark:border-[#1a1a2a]">
      <div class="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10">
        <div class="h-20 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <NuxtLink to="/candidatures/etude-dossier" class="group p-2 text-[#8a8a9a] hover:text-[#7F45FD] transition-all duration-300">
              <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
            </NuxtLink>
            <div class="h-5 w-px bg-[#e8e8f0] dark:bg-[#1a1a2a]"></div>
            <div class="space-y-0.5">
              <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a8a9a] dark:text-[#666]">Dossier</p>
              <h1 class="text-sm font-semibold text-[#1a1a2a] dark:text-[#fafafe]">
                {{ isPageLoading ? '...' : `${candidat?.nom} ${candidat?.prenom}` }}
              </h1>
            </div>
          </div>

          <div v-if="!isPageLoading && candidat" class="flex items-center gap-4">
            <span :class="[
              'px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full',
              getStatutStyle(candidat)
            ]">
              {{ getStatutLabel(candidat) }}
            </span>
          </div>
        </div>
      </div>
    </header>

    <main class="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 py-10">
      
      <!-- Skeleton -->
      <div v-if="isPageLoading" class="animate-pulse space-y-8">
        <div class="h-48 bg-white/50 dark:bg-[#111]/50 rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a]"></div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 h-96 bg-white/50 dark:bg-[#111]/50 rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a]"></div>
          <div class="h-96 bg-white/50 dark:bg-[#111]/50 rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a]"></div>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else-if="candidat" class="space-y-8 animate-fade-in">
        
        <!-- Profile Header - Violet Premium -->
        <div class="bg-white dark:bg-[#11111e] rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a] shadow-[0_8px_30px_rgba(127,69,253,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] overflow-hidden">
          <div class="p-8 lg:p-10">
            <div class="flex flex-col sm:flex-row gap-8 lg:gap-12 items-start">
              <!-- Portrait - Cadre violet -->
              <div class="shrink-0">
                <div class="w-28 h-28 lg:w-36 lg:h-36 bg-white dark:bg-[#1a1a2a] p-1.5 rounded-2xl border-2 border-[#7F45FD]/30 shadow-[0_4px_20px_rgba(127,69,253,0.15)]">
                  <div class="w-full h-full rounded-xl overflow-hidden bg-[#f5f5ff] dark:bg-[#1a1a2a] relative flex items-center justify-center">
                    <span class="text-3xl lg:text-5xl font-black text-[#7F45FD]/40">
                      {{ candidat.nom?.charAt(0) }}{{ candidat.prenom?.charAt(0) }}
                    </span>
                    <img v-if="candidat.album?.photo" :src="getFullUrl(candidat.album.photo)" class="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300" @error="$event.target.style.opacity='0'" />
                  </div>
                </div>
              </div>

              <!-- Identity & Path -->
              <div class="flex-1 min-w-0 space-y-5 lg:space-y-6">
                <div class="space-y-2">
                  <div class="flex items-center gap-3">
                    <span class="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a8a9a] dark:text-[#666]">Dossier</span>
                    <span class="text-[10px] font-bold text-[#7F45FD]">#{{ formatId(candidat.code) }}</span>
                  </div>
                  <h2 class="flex flex-wrap items-center gap-2 lg:gap-3 text-3xl lg:text-4xl font-bold tracking-tight text-[#1a1a2a] dark:text-[#fafafe] leading-[1.15]">
                    <span class="font-bold">{{ candidat.nom }}</span>
                    <span class="text-[#7F45FD]">{{ candidat.prenom }}</span>
                  </h2>
                </div>

                <!-- Badges - Violet Theme -->
                <div class="flex flex-wrap items-center gap-3 pt-1">
                  <div class="px-5 py-2.5 bg-[#7F45FD]/10 border border-[#7F45FD]/20 text-[#7F45FD] rounded-xl flex items-start gap-2 max-w-full">
                    <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                    <span class="text-[9px] font-bold uppercase tracking-[0.15em] whitespace-normal leading-relaxed">{{ getFiliereName }}</span>
                  </div>
                  <div class="px-5 py-2.5 bg-white dark:bg-[#1a1a2a] border border-[#e8e8f0] dark:border-[#2a2a3a] text-[#8a8a9a] dark:text-[#888] rounded-xl flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#7F45FD]"></span>
                    <span class="text-[9px] font-bold uppercase tracking-[0.15em]">{{ getNiveauName }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Panel - Bottom Bar -->
            <div class="mt-8 lg:mt-10 pt-6 lg:pt-8 border-t border-[#e8e8f0] dark:border-[#1a1a2a]">
              
              <div v-if="!candidat.dossier_valide && !candidat.motif && !candidat.rectification_expected" class="flex flex-wrap items-center gap-3">
                <button @click="handleAction('valider')" :disabled="isSubmitting" class="px-8 py-3.5 bg-[#7F45FD] hover:bg-[#6a35e8] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all duration-300 hover:shadow-[0_8px_25px_rgba(127,69,253,0.3)] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                  <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                  Valider le dossier
                </button>
                <button @click="handleAction('rectifier')" :disabled="isSubmitting" class="px-6 py-3.5 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[9px] font-bold uppercase tracking-[0.1em] rounded-xl transition-all duration-300 hover:shadow-[0_8px_20px_rgba(245,158,11,0.3)] disabled:opacity-60 disabled:cursor-not-allowed">Corriger</button>
                <button @click="handleAction('reorienter')" :disabled="isSubmitting" class="px-6 py-3.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-[9px] font-bold uppercase tracking-[0.1em] rounded-xl transition-all duration-300 hover:shadow-[0_8px_20px_rgba(59,130,246,0.3)] disabled:opacity-60 disabled:cursor-not-allowed">Réorienter</button>
                <button @click="handleAction('rejeter')" :disabled="isSubmitting" class="px-6 py-3.5 bg-[#ff4757] hover:bg-[#e84118] text-white text-[9px] font-bold uppercase tracking-[0.1em] rounded-xl transition-all duration-300 hover:shadow-[0_8px_20px_rgba(255,71,87,0.3)] disabled:opacity-60 disabled:cursor-not-allowed">Rejeter</button>
              </div>

              <div v-else-if="candidat.dossier_valide && nextStep" :class="[
                'flex items-center gap-4 py-3 px-6 rounded-xl border',
                nextStep.tone === 'rose' ? 'bg-[#ff4757]/10 border-[#ff4757]/20' : nextStep.tone === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-[#7F45FD]/10 border-[#7F45FD]/20'
              ]">
                <div class="flex items-center gap-2">
                  <svg :class="[
                    'w-5 h-5',
                    nextStep.tone === 'rose' ? 'text-[#ff4757]' : nextStep.tone === 'emerald' ? 'text-emerald-500' : 'text-[#7F45FD]'
                  ]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                  <p :class="[
                    'text-sm font-bold',
                    nextStep.tone === 'rose' ? 'text-[#ff4757]' : nextStep.tone === 'emerald' ? 'text-emerald-500' : 'text-[#7F45FD]'
                  ]">{{ nextStep.text }}</p>
                </div>
                <NuxtLink v-if="nextStep.linkText" :to="nextStep.to" :class="[
                  'text-[11px] underline ml-2',
                  nextStep.tone === 'rose' ? 'text-[#ff4757]/70 hover:text-[#ff4757]' : nextStep.tone === 'emerald' ? 'text-emerald-500/70 hover:text-emerald-500' : 'text-[#7F45FD]/70 hover:text-[#7F45FD]'
                ]">{{ nextStep.linkText }}</NuxtLink>
              </div>

              <div v-else-if="candidat.rectification_expected" class="py-3 px-6 bg-[#FFB347]/10 border border-[#FFB347]/20 rounded-xl">
                <p class="text-[#FFB347] text-sm font-bold">✎ Correction demandée</p>
              </div>

              <div v-else-if="candidat.motif" class="py-3 px-6 bg-[#ff4757]/10 border border-[#ff4757]/20 rounded-xl">
                <p class="text-[#ff4757] text-sm font-bold">✕ Dossier rejeté</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Observations -->
        <div v-if="candidat.motif" class="bg-[#FFF4F4] dark:bg-[#1a0a0a] border-l-4 border-l-[#ff4757] rounded-xl p-6">
          <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff4757] mb-2">Observation</p>
          <p class="text-sm text-[#1a1a2a] dark:text-[#fafafe] italic font-medium">"{{ candidat.motif }}"</p>
        </div>

        <!-- Content Sections - Accordion Violet -->
        <div class="space-y-4">
          
          <!-- Section: Profil Civil -->
          <div class="bg-white dark:bg-[#11111e] rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
            <button @click="activeTab = activeTab === 'perso' ? '' : 'perso'" class="w-full px-8 py-5 flex items-center justify-between hover:bg-[#fafafe]/50 dark:hover:bg-[#1a1a2a]/50 transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-1 h-6 bg-[#7F45FD] rounded-full"></div>
                <h3 class="text-sm font-bold text-[#1a1a2a] dark:text-[#fafafe] tracking-tight">Profil Civil</h3>
              </div>
              <svg :class="{'rotate-180': activeTab === 'perso'}" class="w-4 h-4 text-[#8a8a9a] transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div v-show="activeTab === 'perso'" class="px-8 pb-8 pt-2 border-t border-[#e8e8f0] dark:border-[#1a1a2a]">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
                <div v-for="item in personalItems" :key="item.label" class="space-y-1.5">
                  <p class="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8a8a9a] dark:text-[#666]">{{ item.label }}</p>
                  <p class="text-sm font-medium text-[#1a1a2a] dark:text-[#fafafe]">{{ item.value || '—' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Section: Parcours Académique -->
          <div class="bg-white dark:bg-[#11111e] rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
            <button @click="activeTab = activeTab === 'academique' ? '' : 'academique'" class="w-full px-8 py-5 flex items-center justify-between hover:bg-[#fafafe]/50 dark:hover:bg-[#1a1a2a]/50 transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-1 h-6 bg-[#7F45FD] rounded-full"></div>
                <h3 class="text-sm font-bold text-[#1a1a2a] dark:text-[#fafafe] tracking-tight">Parcours Académique</h3>
              </div>
              <svg :class="{'rotate-180': activeTab === 'academique'}" class="w-4 h-4 text-[#8a8a9a] transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div v-show="activeTab === 'academique'" class="px-8 pb-8 pt-2 border-t border-[#e8e8f0] dark:border-[#1a1a2a]">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div class="p-6 bg-[#fafafe] dark:bg-[#0a0a12] rounded-xl border border-[#e8e8f0] dark:border-[#2a2a3a]">
                  <p class="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8a8a9a] dark:text-[#666] mb-1">Type de diplôme</p>
                  <p class="text-xl font-bold text-[#1a1a2a] dark:text-[#fafafe]">{{ candidat.dernier_diplome || candidat.album?.type_diplome || candidat.type_diplome || '—' }}</p>
                </div>
                <div class="p-6 bg-[#fafafe] dark:bg-[#0a0a12] rounded-xl border border-[#e8e8f0] dark:border-[#2a2a3a]">
                  <p class="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8a8a9a] dark:text-[#666] mb-1">Établissement</p>
                  <p class="text-xl font-bold text-[#1a1a2a] dark:text-[#fafafe]">{{ candidat.etablissement_diplome || '—' }}</p>
                </div>
                <div class="p-6 bg-[#fafafe] dark:bg-[#0a0a12] rounded-xl border border-[#e8e8f0] dark:border-[#2a2a3a]">
                  <p class="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8a8a9a] dark:text-[#666] mb-1">Année d'obtention</p>
                  <p class="text-xl font-bold text-[#1a1a2a] dark:text-[#fafafe]">{{ candidat.annee_bac || '—' }}</p>
                </div>
                <div class="p-6 bg-[#fafafe] dark:bg-[#0a0a12] rounded-xl border border-[#e8e8f0] dark:border-[#2a2a3a]">
                  <p class="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8a8a9a] dark:text-[#666] mb-1">Série</p>
                  <p class="text-xl font-bold text-[#1a1a2a] dark:text-[#fafafe]">{{ candidat.serie || '—' }}</p>
                </div>
                <div class="p-6 bg-[#fafafe] dark:bg-[#0a0a12] rounded-xl border border-[#e8e8f0] dark:border-[#2a2a3a]">
                  <p class="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8a8a9a] dark:text-[#666] mb-1">Mention au BAC</p>
                  <p class="text-xl font-bold text-[#1a1a2a] dark:text-[#fafafe]">{{ candidat.mention_bac || '—' }}</p>
                </div>
                <div class="p-6 bg-[#fafafe] dark:bg-[#0a0a12] rounded-xl border border-[#e8e8f0] dark:border-[#2a2a3a]">
                  <p class="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8a8a9a] dark:text-[#666] mb-1">Numéro de table</p>
                  <p class="text-xl font-bold text-[#1a1a2a] dark:text-[#fafafe]">{{ candidat.numero_table || '—' }}</p>
                </div>
              </div>
              

            </div>
          </div>

          <!-- Section: Garanties -->
          <div class="bg-white dark:bg-[#11111e] rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
            <button @click="activeTab = activeTab === 'garanties' ? '' : 'garanties'" class="w-full px-8 py-5 flex items-center justify-between hover:bg-[#fafafe]/50 dark:hover:bg-[#1a1a2a]/50 transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-1 h-6 bg-[#7F45FD] rounded-full"></div>
                <h3 class="text-sm font-bold text-[#1a1a2a] dark:text-[#fafafe] tracking-tight">Garanties & Parents</h3>
              </div>
              <svg :class="{'rotate-180': activeTab === 'garanties'}" class="w-4 h-4 text-[#8a8a9a] transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div v-show="activeTab === 'garanties'" class="px-8 pb-8 pt-2 border-t border-[#e8e8f0] dark:border-[#1a1a2a]">
              <div v-if="!hasResponsable && !hasTuteur" class="py-12 text-center">
                <p class="text-sm text-[#8a8a9a]">Aucune information renseignée</p>
              </div>
              <div v-else class="space-y-10">
                <div v-if="hasResponsable" class="space-y-4">
                  <div class="flex items-center gap-3">
                    <div class="w-1 h-4 bg-[#7F45FD] rounded-full"></div>
                    <h4 class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7F45FD]">Responsable Légal</h4>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                    <div v-for="item in responsableItems" :key="item.label" class="space-y-1">
                      <p class="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8a8a9a] dark:text-[#666]">{{ item.label }}</p>
                      <p class="text-sm font-medium text-[#1a1a2a] dark:text-[#fafafe]">{{ item.value || '—' }}</p>
                    </div>
                  </div>
                </div>
                <div v-if="hasTuteur" class="space-y-4">
                  <div class="flex items-center gap-3">
                    <div class="w-1 h-4 bg-[#8a8a9a] rounded-full"></div>
                    <h4 class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a8a9a]">Tuteur en ville</h4>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                    <div v-for="item in tuteurItems" :key="item.label" class="space-y-1">
                      <p class="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8a8a9a] dark:text-[#666]">{{ item.label }}</p>
                      <p class="text-sm font-medium text-[#1a1a2a] dark:text-[#fafafe]">{{ item.value || '—' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section: Documents -->
          <div class="bg-white dark:bg-[#11111e] rounded-2xl border border-[#e8e8f0] dark:border-[#1a1a2a] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
            <button @click="activeTab = activeTab === 'documents' ? '' : 'documents'" class="w-full px-8 py-5 flex items-center justify-between hover:bg-[#fafafe]/50 dark:hover:bg-[#1a1a2a]/50 transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-1 h-6 bg-[#7F45FD] rounded-full"></div>
                <h3 class="text-sm font-bold text-[#1a1a2a] dark:text-[#fafafe] tracking-tight">Pièces Jointes</h3>
              </div>
              <svg :class="{'rotate-180': activeTab === 'documents'}" class="w-4 h-4 text-[#8a8a9a] transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div v-show="activeTab === 'documents'" class="px-8 pb-8 pt-2 border-t border-[#e8e8f0] dark:border-[#1a1a2a]">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                <template v-if="candidat.expected_docs && candidat.expected_docs.length > 0">
                  <CandidatDocEntry 
                    v-for="doc in candidat.expected_docs" 
                    :key="doc.document_type?.document_key || doc.id" 
                    :label="(doc.document_type?.nom_affichage || 'Document') + (doc.is_obligatoire ? '' : ' (Facultatif)')" 
                    :path="candidat.album?.[doc.document_type?.document_key]" 
                  />
                </template>
                <template v-else>
                  <CandidatDocEntry label="Photo d'Identité" :path="candidat.album?.photo" />
                  <CandidatDocEntry label="Extrait de Naissance" :path="candidat.album?.naissance" />
                  <CandidatDocEntry label="Certificat Nationalité" :path="candidat.album?.nationalite" />
                  <CandidatDocEntry label="Attestation de Réussite" :path="candidat.album?.diplome" />
                  <CandidatDocEntry label="Relevé 1ère" :path="candidat.album?.releve_bac1_path" />
                  <CandidatDocEntry v-if="candidat.album?.releve_bac2_path" label="Relevé Terminale" :path="candidat.album.releve_bac2_path" />
                  <CandidatDocEntry label="Visite Médicale" :path="candidat.album?.certificat_medical" />
                  <CandidatDocEntry label="Lettre d'Engagement" :path="candidat.album?.lettre" />
                </template>
              </div>

              <div v-if="parsedBulletins" class="mt-10 pt-8 border-t border-[#e8e8f0] dark:border-[#1a1a2a] space-y-8">
                <div v-for="(paths, niv) in parsedBulletins" :key="niv" class="space-y-4">
                  <div class="flex items-center gap-3">
                    <div class="w-1 h-4 bg-[#7F45FD] rounded-full"></div>
                    <h4 class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a8a9a]">{{ niv }}</h4>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    <CandidatDocEntry v-for="(p, i) in paths" :key="i" :label="`Bulletin T${i+1}`" :path="p" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal - Violet Premium -->
    <TransitionRoot appear :show="isModalOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-50">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#11111e] border border-[#e8e8f0] dark:border-[#1a1a2a] p-8 text-left align-middle shadow-2xl">
                
                <div v-if="modalAction === 'reorienter'" class="space-y-6">
                  <div class="flex items-center gap-4 border-b border-[#e8e8f0] dark:border-[#1a1a2a] pb-4">
                    <div class="w-10 h-10 rounded-xl bg-[#7F45FD]/10 border border-[#7F45FD]/20 flex items-center justify-center text-[#7F45FD]">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                    </div>
                    <h3 class="text-lg font-bold text-[#1a1a2a] dark:text-[#fafafe]">Réorientation</h3>
                  </div>

                  <div class="space-y-4">
                    <div>
                      <label class="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a8a9a] dark:text-[#666] block mb-2">Filière</label>
                      <Select v-model="reorientForm.filiere_id" :options="filiereStore.filieres" optionLabel="nom" optionValue="id" placeholder="Choisir une filière" class="w-full" />
                    </div>
                    <div>
                      <label class="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a8a9a] dark:text-[#666] block mb-2">Niveau</label>
                      <Select v-model="reorientForm.niveau_id" :options="niveauStore.niveaux" :optionLabel="(opt) => opt.nom || opt.libelle" optionValue="id" placeholder="Choisir un niveau" class="w-full" />
                    </div>
                  </div>

                  <div class="flex gap-3 pt-4 border-t border-[#e8e8f0] dark:border-[#1a1a2a]">
                    <button @click="closeModal" class="flex-1 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a8a9a] hover:text-[#1a1a2a] dark:hover:text-[#fafafe] transition-colors">Annuler</button>
                    <button @click="confirmReorientation" :disabled="isSubmitting" class="flex-1 py-3 bg-[#7F45FD] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#6a35e8] disabled:opacity-50 transition-all hover:shadow-[0_4px_15px_rgba(127,69,253,0.3)]">
                      {{ isSubmitting ? '...' : 'Confirmer' }}
                    </button>
                  </div>
                </div>

                <div v-else class="space-y-6">
                  <div class="flex items-center gap-4 border-b border-[#e8e8f0] dark:border-[#1a1a2a] pb-4">
                    <div :class="modalAction === 'rejeter' ? 'bg-[#ff4757]/10 border-[#ff4757]/20 text-[#ff4757]' : 'bg-[#FFB347]/10 border-[#FFB347]/20 text-[#FFB347]'" class="w-10 h-10 rounded-xl border flex items-center justify-center">
                      <svg v-if="modalAction === 'rejeter'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </div>
                    <h3 class="text-lg font-bold text-[#1a1a2a] dark:text-[#fafafe]">{{ modalTitle }}</h3>
                  </div>

                  <div>
                    <label class="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a8a9a] dark:text-[#666] block mb-2">Motif</label>
                    <textarea v-model="actionMotif" rows="4" placeholder="Détaillez le motif ici..." class="w-full p-4 bg-[#fafafe] dark:bg-[#0a0a12] rounded-xl border border-[#e8e8f0] dark:border-[#2a2a3a] focus:border-[#7F45FD] focus:ring-2 focus:ring-[#7F45FD]/20 outline-none text-sm text-[#1a1a2a] dark:text-[#fafafe] placeholder-[#8a8a9a]/50 transition-all resize-none"></textarea>
                  </div>

                  <div class="flex gap-3 pt-4 border-t border-[#e8e8f0] dark:border-[#1a1a2a]">
                    <button @click="closeModal" class="flex-1 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a8a9a] hover:text-[#1a1a2a] dark:hover:text-[#fafafe] transition-colors">Annuler</button>
                    <button @click="confirmAction" :disabled="!actionMotif || isSubmitting" 
                      :class="modalAction === 'rejeter' ? 'bg-[#ff4757] hover:bg-[#e63946]' : 'bg-[#FFB347] hover:bg-[#f0a030]'"
                      class="flex-1 py-3 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl disabled:opacity-50 transition-all">
                      {{ isSubmitting ? '...' : 'Confirmer' }}
                    </button>
                  </div>
                </div>

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCandidatureStore } from '~~/stores/candidature'
import { useFiliereStore } from '~~/stores/filiere'
import { useNiveauStore } from '~~/stores/niveau'
import { getStorageBaseUrl } from '~/utils/storageUrl'
import {
  TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle,
} from '@headlessui/vue'
import CandidatDocEntry from '~/components/CandidatDocEntry.vue'

const route = useRoute()
const router = useRouter()
const candidatureStore = useCandidatureStore()
const filiereStore = useFiliereStore()
const niveauStore = useNiveauStore()
const { $toastr, $swal } = useNuxtApp()

// États
const isPageLoading = ref(true)
const candidat = ref(null)
const activeTab = ref('perso')
const isSubmitting = ref(false)

// Modals Headless UI
const isModalOpen = ref(false)
const modalAction = ref('')
const modalTitle = ref('')
const actionMotif = ref('')
const reorientForm = ref({ filiere_id: '', niveau_id: '', motif: '' })

const openModal = (action) => {
  modalAction.value = action
  if (action === 'rejeter') modalTitle.value = 'Rejet Définitif'
  else if (action === 'rectifier') modalTitle.value = 'Rectification'
  else if (action === 'reorienter') modalTitle.value = 'Réorientation'
  isModalOpen.value = true
}
const closeModal = () => { isModalOpen.value = false; actionMotif.value = '' }

const tabs = [
  { id: 'perso', label: 'Profil Civil' },
  { id: 'acad', label: 'Académie' },
  { id: 'parents', label: 'Garanties' },
]

const getFiliereName = computed(() => {
  if (candidat.value?.filiere?.nom) return candidat.value.filiere.nom;
  const f = filiereStore.filieres?.find(f => f.id === candidat.value?.filiere_id);
  return f ? f.nom : '—';
});

const getNiveauName = computed(() => {
  if (candidat.value?.niveau?.libelle) return candidat.value.niveau.libelle;
  if (candidat.value?.niveau?.nom) return candidat.value.niveau.nom;
  const n = niveauStore.niveaux?.find(n => n.id === candidat.value?.niveau_id);
  return n ? (n.libelle || n.nom) : '—';
});

const hasResponsable = computed(() => {
  return candidat.value?.responsable || candidat.value?.nom_resp;
});

const hasTuteur = computed(() => {
  return candidat.value?.tuteur || candidat.value?.nom_tuteur;
});

const personalItems = computed(() => [
  { label: 'Nom complet', value: candidat.value?.nom },
  { label: 'Prénoms', value: candidat.value?.prenom },
  { label: 'Nom de jeune fille', value: candidat.value?.nom_jeune_fille },
  { label: 'Genre', value: candidat.value?.genre },
  { label: 'Date de naissance', value: formatDate(candidat.value?.date_naissance, false) },
  { label: 'Lieu de naissance', value: candidat.value?.lieu_naissance },
  { label: 'Nationalité', value: candidat.value?.nationalite },
  { label: 'Email', value: candidat.value?.email },
  { label: 'Téléphone 1', value: candidat.value?.tel },
  { label: 'Téléphone 2', value: candidat.value?.tel2 },
])

const responsableItems = computed(() => {
  const resp = candidat.value?.responsable || {};
  return [
    { label: 'Nom Complet', value: `${resp.nom || ''} ${resp.prenom || ''}`.trim() },
    { label: 'Profession', value: resp.profession },
    { label: 'Téléphone', value: resp.tel },
    { label: 'Email', value: resp.email },
    { label: 'Adresse / Domicile', value: resp.adresse },
  ]
})

const tuteurItems = computed(() => {
  const tut = candidat.value?.tuteur || {};
  return [
    { label: 'Nom Complet', value: `${tut.nom || ''} ${tut.prenom || ''}`.trim() },
    { label: 'Profession', value: tut.profession },
    { label: 'Téléphone', value: tut.tel },
    { label: 'Email', value: tut.email },
    { label: 'Adresse / Domicile', value: tut.adresse },
  ]
})

const fetchCandidat = async () => {
    isPageLoading.value = true
    try {
        const res = await candidatureStore.fetchCandidatureDetail(route.params.slug)
        if (res) candidat.value = res
        else router.push('/candidatures/etude-dossier')
    } catch (e) { $toastr.error("Erreur serveur.") }
    finally { isPageLoading.value = false }
}

const getFullUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${getStorageBaseUrl()}/storage/${path}`
}

const formatId = (id) => (id || 0).toString().padStart(6, '0')
const formatDate = (date, withTime = true) => {
  if (!date) return '—'
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
  if (withTime) options.hour = '2-digit', options.minute = '2-digit'
  return new Date(date).toLocaleDateString('fr-FR', options)
}

const getStatutLabel = (c) => {
  if (c.dossier_valide) return 'Validé'
  if (c.rectification_expected) return 'En Correction'
  if (c.motif) return 'Refusé'
  return 'En Étude'
}

const getStatutStyle = (c) => {
  if (c.dossier_valide) return 'border-emerald-600/30 text-emerald-600 bg-emerald-600/5'
  if (c.rectification_expected) return 'border-amber-600/30 text-amber-600 bg-amber-600/5'
  if (c.motif) return 'border-rose-600/30 text-rose-600 bg-rose-600/5'
  return 'border-[#7F45FD]/30 text-[#7F45FD] bg-[#7F45FD]/10'
}

// Une candidature suit le mode concours uniquement si sa session le précise explicitement
// (même logique que le backend). Une candidature sans session suit toujours le mode dossier
// uniquement — aucun repli sur un paramètre global.
const suitModeConcours = computed(() => Boolean(candidat.value?.avec_epreuve_ecrite))

const nextStep = computed(() => {
  const c = candidat.value
  if (!c) return null

  if (c.etudiant_id) {
    return { tone: 'emerald', text: 'Étudiant inscrit', linkText: null, to: null }
  }
  if (!suitModeConcours.value) {
    return { tone: 'purple', text: 'Dossier validé', linkText: "Finaliser l'inscription →", to: `/candidatures/inscription/${c.slug}` }
  }
  if (!c.frais_paye) {
    return { tone: 'purple', text: 'Dossier validé — en attente du paiement des frais de concours', linkText: 'Voir les paiements →', to: '/candidatures/payement' }
  }
  if (!c.participation_date) {
    return { tone: 'purple', text: 'Frais payés — en attente du contrôle de présence à l\'épreuve', linkText: 'Contrôle de présence →', to: '/candidatures/controle-presence' }
  }
  if (!c.participation) {
    return { tone: 'rose', text: 'Absent à l\'épreuve écrite', linkText: null, to: null }
  }
  if (!c.admission_date) {
    return { tone: 'purple', text: 'Présent à l\'épreuve — en attente de la décision d\'admission', linkText: 'Décision d\'admission →', to: '/candidatures/declaration-admission' }
  }
  if (!c.admission) {
    return { tone: 'rose', text: 'Non admis au concours', linkText: null, to: null }
  }
  return { tone: 'purple', text: 'Admis au concours', linkText: "Finaliser l'inscription →", to: `/candidatures/inscription/${c.slug}` }
})

const parsedBulletins = computed(() => {
  if (!candidat.value?.album?.bulletins_lycee_paths) return null
  try {
    const data = candidat.value.album.bulletins_lycee_paths
    return typeof data === 'string' ? JSON.parse(data) : data
  } catch { return null }
})

const handleAction = async (action) => {
  if (action === 'valider') {
    const result = await $swal.fire({
      title: 'Certification',
      text: `Valider définitivement ce dossier ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, valider',
      confirmButtonColor: '#7c3aed',
      customClass: { popup: 'rounded-3xl' }
    })
    if (result.isConfirmed) {
      isSubmitting.value = true
      try {
        await candidatureStore.validerDossier(candidat.value.slug)
        $toastr.success('Dossier certifié.')
        fetchCandidat()
      } catch (e) { $toastr.error('Erreur.') }
      finally { isSubmitting.value = false }
    }
  } else {
    openModal(action)
  }
}

const confirmAction = async () => {
  isSubmitting.value = true
  try {
    if (modalAction.value === 'rejeter') await candidatureStore.rejeterDossier(candidat.value.slug, actionMotif.value)
    else await candidatureStore.demanderRectification(candidat.value.slug, { motif: actionMotif.value })
    $toastr.success('Action transmise.')
    closeModal()
    fetchCandidat()
  } catch (e) { $toastr.error('Erreur.') }
  finally { isSubmitting.value = false }
}

const confirmReorientation = async () => {
  isSubmitting.value = true
  try {
    await candidatureStore.reorienterCandidat(candidat.value.slug, { ...reorientForm.value, motif: 'Réorientation.' })
    $toastr.success('Affectation mise à jour.')
    closeModal()
    fetchCandidat()
  } catch (e) { $toastr.error('Erreur.') }
  finally { isSubmitting.value = false }
}

onMounted(() => {
  fetchCandidat()
  filiereStore.fetchFilieres()
  niveauStore.fetchNiveaux()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>