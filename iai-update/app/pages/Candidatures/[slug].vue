<template>
  <div class="min-h-screen bg-[#f8f9ff] dark:bg-[#09090b] font-sans transition-colors duration-500 text-slate-900 dark:text-slate-100">
    
    <!-- Top Header -->
    <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
      <div class="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink to="/candidatures/etude-dossier" class="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
          </NuxtLink>
          <div class="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
          <h1 class="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight truncate max-w-[200px] sm:max-w-none">
            {{ isPageLoading ? 'Chargement...' : `Dossier : ${candidat?.nom} ${candidat?.prenom}` }}
          </h1>
        </div>

        <div v-if="!isPageLoading && candidat" class="flex items-center gap-3">
          <span :class="[
            'px-3 py-1 rounded-lg text-[10px] font-bold uppercase border transition-all duration-500',
            getStatutTheme(candidat)
          ]">
            {{ getStatutLabel(candidat) }}
          </span>
        </div>
      </div>
    </header>

    <main class="max-w-[1400px] mx-auto px-4 py-8">
      
      <!-- Skeleton -->
      <div v-if="isPageLoading" class="animate-pulse space-y-6">
        <div class="h-32 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800"></div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 h-96 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800"></div>
          <div class="h-96 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800"></div>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else-if="candidat" class="space-y-6 animate-in fade-in duration-700">
        
        <!-- Summary Card: Sleek Profile Strip (Borderless Premium) -->
        <div class="bg-white dark:bg-slate-900 rounded-xl border-t-[3px] border-t-violet-600 flex flex-col lg:flex-row shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group">
           
           <!-- Portrait Area -->
           <div class="p-8 lg:p-10 shrink-0 bg-slate-50/40 dark:bg-slate-800/20 flex items-center justify-center">
              <div class="w-28 h-28 lg:w-36 lg:h-36 rounded-xl bg-white dark:bg-slate-800 p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] relative">
                <div class="w-full h-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <img v-if="candidat.album?.photo" :src="getFullUrl(candidat.album.photo)" class="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-700" />
                  <div v-else class="text-5xl font-black text-slate-200 uppercase">
                    {{ candidat.nom?.charAt(0) }}
                  </div>
                </div>
              </div>
           </div>

           <!-- Content: Identity & Path (Elite Design) -->
           <div class="flex-1 p-8 lg:p-12 flex flex-col justify-center">
              <div class="space-y-6">
                <!-- Dossier Number Badge -->
                <div class="inline-flex px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dossier #{{ candidat.id }}</span>
                </div>

                <div class="space-y-1">
                  <h2 class="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                    {{ candidat.nom }}
                  </h2>
                  <p class="text-3xl lg:text-4xl font-bold text-violet-600 uppercase tracking-tighter leading-none">
                    {{ candidat.prenom }}
                  </p>
                </div>

                <!-- Horizontal Badges Row -->
                <div class="flex flex-wrap items-center gap-3 pt-2">
                   <!-- Filiere Pill -->
                   <div class="px-4 py-2 bg-violet-600 text-white rounded-xl shadow-lg shadow-violet-600/20 flex items-center gap-3">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                      <span class="text-[10px] font-black uppercase tracking-widest">{{ candidat.filiere?.nom }}</span>
                   </div>
                   <!-- Niveau Pill -->
                   <div class="px-4 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                      <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
                      <span class="text-[10px] font-bold uppercase tracking-widest">{{ candidat.niveau?.libelle || candidat.niveau?.nom }}</span>
                   </div>
                   <!-- Status Pill -->
                   <div class="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-xl flex items-center gap-3">
                      <div class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                      <span class="text-[10px] font-bold uppercase tracking-widest">{{ getStatutLabel(candidat) }}</span>
                   </div>
                </div>
              </div>
           </div>

           <!-- Right Actions Bar: Decision Center -->
           <div class="w-full lg:w-[400px] p-8 lg:p-10 bg-slate-50/40 dark:bg-slate-800/10 flex flex-col justify-center gap-5">
              <template v-if="!candidat.dossier_valide">
                <!-- Primary Action -->
                <button @click="handleAction('valider')" class="w-full py-5 bg-violet-600 hover:bg-violet-700 text-white font-black text-xs uppercase tracking-[.2em] rounded-xl shadow-lg shadow-violet-600/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                  Valider le dossier
                </button>

                <!-- Secondary Actions Grid (3 Columns) -->
                <div class="grid grid-cols-3 gap-3">
                  <button @click="handleAction('rectifier')" class="py-4 bg-white dark:bg-slate-800 text-amber-600 font-bold text-[9px] uppercase tracking-widest rounded-xl hover:bg-amber-500 hover:text-white transition-all shadow-sm">
                    Rectifier
                  </button>
                  <button @click="handleAction('reorienter')" class="py-4 bg-white dark:bg-slate-800 text-indigo-600 font-bold text-[9px] uppercase tracking-widest rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                    Réorienter
                  </button>
                  <button @click="handleAction('rejeter')" class="py-4 bg-white dark:bg-slate-800 text-rose-600 font-bold text-[9px] uppercase tracking-widest rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                    Rejeter
                  </button>
                </div>
              </template>
              <template v-else>
                 <div class="flex items-center gap-5 bg-emerald-600 text-white p-6 rounded-2xl shadow-xl shadow-emerald-600/20">
                    <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center ring-4 ring-white/10 shrink-0">
                       <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <div>
                       <p class="text-[10px] font-black uppercase tracking-widest opacity-80 leading-none mb-1.5">Dossier Validé</p>
                       <NuxtLink v-if="!candidat.etudiant_id" :to="`/candidatures/inscription/${candidat.slug}`" class="text-xs font-black text-white hover:underline uppercase tracking-tight flex items-center gap-1.5">Finaliser l'inscription →</NuxtLink>
                    </div>
                 </div>
              </template>
           </div>
        </div>

        <div class="space-y-8 items-start pt-4">
          
          <!-- Information Tabs (Borderless Premium) -->
          <div class="w-full space-y-6">
            <div class="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-[0_10px_40px_rgb(0,0,0,0.03)] min-h-[400px]">
               <div class="flex bg-slate-50/30 dark:bg-slate-800/20">
                 <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                   class="flex-1 py-6 text-xs font-black uppercase tracking-[0.2em] relative transition-all"
                   :class="activeTab === tab.id ? 'text-violet-600 bg-white dark:bg-slate-900' : 'text-slate-400 hover:text-slate-600'">
                   {{ tab.label }}
                   <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-1.5 bg-violet-600"></div>
                 </button>
               </div>

               <div class="p-12">
                  <!-- Profile -->
                  <div v-if="activeTab === 'perso'" class="grid grid-cols-1 sm:grid-cols-3 gap-y-12 gap-x-16 animate-in slide-in-from-left-4 duration-500">
                    <div v-for="item in personalItems" :key="item.label" class="space-y-1.5">
                      <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{{ item.label }}</p>
                      <p class="text-base font-black text-slate-900 dark:text-slate-100 uppercase leading-none">{{ item.value || '—' }}</p>
                    </div>
                  </div>

                  <!-- Academic -->
                  <div v-if="activeTab === 'acad'" class="space-y-12 animate-in slide-in-from-left-4 duration-500">
                    <div class="grid grid-cols-3 gap-8">
                       <div class="p-8 bg-violet-50/40 dark:bg-violet-900/10 rounded-2xl shadow-sm">
                          <p class="text-[10px] font-black text-violet-400 mb-3 uppercase tracking-[0.2em]">OBTENTION BAC</p>
                          <p class="text-4xl font-black text-violet-700 dark:text-violet-400 leading-none">{{ candidat.annee_bac }}</p>
                       </div>
                       <div class="p-8 bg-indigo-50/40 dark:bg-indigo-900/10 rounded-2xl shadow-sm">
                          <p class="text-[10px] font-black text-indigo-400 mb-3 uppercase tracking-[0.2em]">SÉRIE BAC</p>
                          <p class="text-4xl font-black text-indigo-700 dark:text-indigo-400 leading-none">{{ candidat.serie }}</p>
                       </div>
                    </div>
                    
                    <div class="pt-12 border-t border-slate-50 dark:border-slate-800/60">
                       <h3 class="text-sm font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white mb-8">Lettre de Motivation</h3>
                       <p class="text-base text-slate-600 dark:text-slate-400 leading-relaxed font-semibold italic bg-slate-50/40 dark:bg-slate-800/40 p-10 rounded-2xl">
                          " {{ candidat.lettre_motivation || 'Aucune lettre de motivation annexée à ce dossier.' }} "
                       </p>
                    </div>
                  </div>

                  <!-- Contacts -->
                  <div v-if="activeTab === 'parents'" class="animate-in slide-in-from-left-4 duration-500">
                    <div v-if="!candidat.responsable && !candidat.tuteur" class="py-24 text-center space-y-6">
                       <div class="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-300 ring-8 ring-slate-100/50 dark:ring-slate-800/30">
                          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                       </div>
                       <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose max-w-sm mx-auto">Ces informations sont manquantes ou n'ont pas été renseignées lors de l'inscription.</p>
                    </div>
                    <div v-else class="space-y-20">
                      <div v-if="candidat.responsable" class="grid grid-cols-1 sm:grid-cols-3 gap-y-12 gap-x-12">
                         <div class="col-span-full flex items-center gap-6">
                            <div class="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                            <span class="text-[10px] font-black uppercase text-violet-600 tracking-[0.4em]">Le Responsable</span>
                            <div class="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                         </div>
                         <div v-for="item in responsableItems" :key="item.label" class="space-y-1.5">
                           <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{{ item.label }}</p>
                           <p class="text-base font-black text-slate-900 dark:text-slate-100 uppercase">{{ item.value || '—' }}</p>
                         </div>
                      </div>
                      <div v-if="candidat.tuteur" class="grid grid-cols-1 sm:grid-cols-3 gap-y-12 gap-x-12">
                         <div class="col-span-full flex items-center gap-6">
                            <div class="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                            <span class="text-[10px] font-black uppercase text-indigo-600 tracking-[0.4em]">Le Tuteur</span>
                            <div class="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                         </div>
                         <div v-for="item in tuteurItems" :key="item.label" class="space-y-1.5">
                           <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{{ item.label }}</p>
                           <p class="text-base font-black text-slate-900 dark:text-slate-100 uppercase">{{ item.value || '—' }}</p>
                         </div>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          <!-- Documents Section (Scaling Up) -->
          <div class="w-full space-y-8 pb-20">
             
             <!-- Motif/Observations (Larger Alert) -->
             <div v-if="candidat.motif" class="p-8 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border-l-[6px] border-amber-500 shadow-sm flex items-start gap-8">
                <div class="w-16 h-16 bg-amber-100 dark:bg-amber-900/50 rounded-2xl flex items-center justify-center text-amber-600 shrink-0 shadow-inner">
                  <svg class="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
                <div class="space-y-2">
                   <p class="text-[10px] font-black uppercase tracking-[0.3em] text-amber-700 opacity-70">Observations de l'administration</p>
                   <p class="text-sm lg:text-base text-slate-800 dark:text-slate-200 font-black italic leading-relaxed">" {{ candidat.motif }} "</p>
                </div>
             </div>

             <!-- Documents Grid (Clean & Professional) -->
             <div class="bg-slate-50/50 dark:bg-slate-800/10 rounded-[2rem] p-10 lg:p-14 shadow-sm">
                <div class="flex items-center justify-between mb-10">
                   <h3 class="text-sm font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-4">
                      <span class="w-2 h-8 bg-violet-600 rounded-full"></span>
                      Dossier de candidature
                   </h3>
                   <div class="hidden sm:flex items-center gap-3 px-5 py-2 bg-emerald-100/50 dark:bg-emerald-950/20 rounded-full">
                      <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span class="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Dossier Certifié</span>
                   </div>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
                   <CandidatDocEntry label="Photo d'Identité" :path="candidat.album?.photo" />
                   <CandidatDocEntry label="Extrait de Naissance" :path="candidat.album?.naissance" />
                   <CandidatDocEntry label="Certificat Nationalité" :path="candidat.album?.nationalite" />
                   <CandidatDocEntry label="Attestation de Réussite" :path="candidat.album?.diplome" />
                   <CandidatDocEntry label="Relevé 1ère" :path="candidat.album?.releve_bac1_path" />
                   <CandidatDocEntry v-if="candidat.album?.releve_bac2_path" label="Relevé Terminale" :path="candidat.album.releve_bac2_path" />
                   <CandidatDocEntry label="Visite Médicale" :path="candidat.album?.certificat_medical" />
                   <CandidatDocEntry label="Lettre d'Engagement" :path="candidat.album?.lettre" />
                </div>

                <!-- Scolarité (Ultra-Sleek Design) -->
                <div v-if="parsedBulletins" class="mt-24 space-y-20">
                   <div v-for="(paths, niv) in parsedBulletins" :key="niv" class="relative group/level">
                      <!-- Level Sidebar Indicator -->
                      <div class="absolute -left-12 top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-800 hidden xl:block">
                         <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white dark:bg-slate-900 border-2 border-violet-600 shadow-[0_0_10px_rgba(124,58,237,0.3)]"></div>
                      </div>

                      <div class="flex flex-col gap-10">
                         <!-- Header: Minimalist & High-End -->
                         <div class="flex items-center gap-6">
                            <div class="flex flex-col">
                               <h3 class="text-xs font-black text-violet-600 uppercase tracking-[.4em] mb-1">Scolarité Antérieure</h3>
                               <p class="text-2xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tighter">{{ niv }}</p>
                            </div>
                            <div class="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-800 dark:to-transparent"></div>
                         </div>

                         <!-- Grid or High-End Empty State -->
                         <div v-if="paths && Object.keys(paths).length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                            <CandidatDocEntry v-for="(p, i) in paths" :key="i" :label="`Bulletin Trimestre ${i+1}`" :path="p" />
                         </div>
                         <div v-else class="p-12 rounded-[2rem] bg-slate-50/50 dark:bg-white/5 border-none flex flex-col items-center justify-center text-center gap-4 group/empty">
                            <div class="w-14 h-14 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-300 group-hover/empty:text-violet-400 transition-colors">
                               <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                            </div>
                            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-loose">Aucun document numérique<br/>n'a été transmis pour ce niveau</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Headless UI Modals -->
    <TransitionRoot appear :show="isModalOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-50">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
              <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-10 text-left align-middle shadow-2xl transition-all border border-slate-100 dark:border-slate-800">
                
                <div v-if="modalAction === 'reorienter'" class="space-y-8">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                    </div>
                    <div>
                      <DialogTitle as="h3" class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Réorientation</DialogTitle>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Modification du parcours académique</p>
                    </div>
                  </div>

                  <div class="space-y-6">
                    <div class="space-y-3">
                       <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Nouvelle Filière</label>
                       <Select v-model="reorientForm.filiere_id" :options="filiereStore.filieres" optionLabel="nom" optionValue="id" placeholder="Choisir une filière" filter class="w-full prime-select-custom" />
                    </div>
                    <div class="space-y-3">
                       <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Niveau d'entrée</label>
                       <Select v-model="reorientForm.niveau_id" :options="niveauStore.niveaux" :optionLabel="(opt) => opt.nom || opt.libelle" optionValue="id" placeholder="Choisir un niveau" filter class="w-full prime-select-custom" />
                    </div>
                  </div>

                  <div class="flex gap-4 pt-4">
                    <button @click="closeModal" class="flex-1 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Annuler</button>
                    <button @click="confirmReorientation" :disabled="isSubmitting" class="flex-[2] py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50">
                       {{ isSubmitting ? 'Mise à jour...' : 'Réorienter le candidat' }}
                    </button>
                  </div>
                </div>

                <div v-else class="space-y-8">
                  <div class="flex items-center gap-4">
                    <div :class="modalAction === 'rejeter' ? 'bg-rose-600 shadow-rose-600/20' : 'bg-amber-500 shadow-amber-500/20'" class="w-12 h-12 text-white rounded-2xl flex items-center justify-center shadow-lg">
                      <svg v-if="modalAction === 'rejeter'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </div>
                    <div>
                      <DialogTitle as="h3" class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{{ modalTitle }}</DialogTitle>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action administrative requise</p>
                    </div>
                  </div>

                  <div class="space-y-2">
                     <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Motif de la décision</label>
                     <textarea v-model="actionMotif" rows="5" class="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl border-none font-bold text-sm outline-none focus:ring-2 transition-all" :class="modalAction === 'rejeter' ? 'focus:ring-rose-600' : 'focus:ring-amber-500'"></textarea>
                  </div>

                  <div class="flex gap-4 pt-4">
                    <button @click="closeModal" class="flex-1 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Annuler</button>
                    <button @click="confirmAction" :disabled="!actionMotif || isSubmitting" 
                      :class="modalAction === 'rejeter' ? 'bg-rose-600 shadow-rose-600/20' : 'bg-amber-500 shadow-amber-500/20'"
                      class="flex-[2] py-4 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg active:scale-95 disabled:opacity-50">
                       {{ isSubmitting ? 'Traitement...' : 'Confirmer l\'action' }}
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

const personalItems = computed(() => [
  { label: 'Nom complet', value: candidat.value?.nom },
  { label: 'Prénoms', value: candidat.value?.prenom },
  { label: 'Sexe', value: candidat.value?.genre },
  { label: 'Date de naissance', value: formatDate(candidat.value?.date_naissance, false) },
  { label: 'Lieu de naissance', value: candidat.value?.lieu_naissance },
  { label: 'Nationalité', value: candidat.value?.nationalite },
  { label: 'Pays de résidence', value: candidat.value?.pays_residence },
  { label: 'Email', value: candidat.value?.email },
  { label: 'Contact habituel', value: candidat.value?.tel },
])

const responsableItems = computed(() => [
  { label: 'Parent / Garant', value: `${candidat.value?.responsable?.nom || ''} ${candidat.value?.responsable?.prenom || ''}` },
  { label: 'Activité', value: candidat.value?.responsable?.profession },
  { label: 'Téléphone', value: candidat.value?.responsable?.tel },
  { label: 'Domicile', value: candidat.value?.responsable?.adresse },
])

const tuteurItems = computed(() => [
  { label: 'Référent en ville', value: `${candidat.value?.tuteur?.nom || ''} ${candidat.value?.tuteur?.prenom || ''}` },
  { label: 'Activité', value: candidat.value?.tuteur?.profession },
  { label: 'Téléphone', value: candidat.value?.tuteur?.tel },
  { label: 'Domicile', value: candidat.value?.tuteur?.adresse },
])

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
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
    return `${apiBase}/storage/${path}`
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

const getStatutTheme = (c) => {
  if (c.dossier_valide) return 'bg-emerald-600 text-white border-emerald-700 shadow-sm shadow-emerald-500/20'
  if (c.rectification_expected) return 'bg-amber-100 text-amber-700 border-amber-300 shadow-sm shadow-amber-500/10'
  if (c.motif) return 'bg-rose-600 text-white border-rose-700 shadow-sm shadow-rose-500/20'
  return 'bg-violet-600 text-white border-violet-700 shadow-sm shadow-violet-500/20'
}

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
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

:deep(.prime-select-custom) {
  border-radius: 12px !important;
  border: 1px solid #e2e8f0 !important;
  background: #f8fafc !important;
  padding: 0.25rem 0.5rem !important;
}
.dark :deep(.prime-select-custom) {
  background: #1e293b !important;
  border-color: #334155 !important;
}
:deep(.prime-select-custom .p-select-label) {
  font-weight: 700 !important;
  font-size: 0.875rem !important;
  color: #334155 !important;
}
.dark :deep(.prime-select-custom .p-select-label) {
  color: #f1f5f9 !important;
}
</style>