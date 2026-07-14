<template>
  <div class="max-w-5xl mx-auto space-y-8">
    <!-- Header Welcome -->
    <div v-if="candidature" class="bg-gradient-to-r from-gray-900 to-[#1A2238] rounded-[10px] p-8 shadow-2xl relative overflow-hidden border border-gray-800">
      <div class="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-[#01b4d5]/20 rounded-full blur-2xl pointer-events-none"></div>

      <div class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
            Bonjour, <span class="text-[#01b4d5]">{{ candidature?.prenom || 'Candidat' }}</span>
            <svg class="w-7 h-7 text-[#01b4d5] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
          </h1>
          <p class="text-gray-400 font-medium">Bienvenue sur votre espace d'admission {{ appName }}.</p>
        </div>
        <div class="bg-white/10 backdrop-blur-md px-6 py-4 rounded-[10px] border border-white/10 text-center shadow-inner">
          <p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">N° Dossier</p>
          <p class="text-xl font-bold font-mono text-white tracking-wider">#{{ candidature?.id?.toString().padStart(5, '0') || '00000' }}</p>
        </div>
      </div>
    </div>

    <!-- Skeleton loader for Welcome -->
    <div v-else class="bg-gray-200 dark:bg-gray-800 animate-pulse rounded-[10px] h-32 w-full"></div>

    <!-- Message de Rectification sur le Dashboard -->
    <div v-if="isRectification" class="bg-white dark:bg-[#11111e] rounded-[10px] border border-[#01b4d5]/20 shadow-xl shadow-[#01b4d5]/10 relative overflow-hidden mb-8">
      <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#01b4d5] to-[#009ab5]"></div>

      <div class="p-8 md:p-10">
        <div class="flex flex-col md:flex-row gap-8 items-start">

          <!-- Icon -->
          <div class="w-16 h-16 rounded-[10px] bg-[#01b4d5]/10 flex items-center justify-center flex-shrink-0 border border-[#01b4d5]/20 shadow-inner">
            <svg class="w-8 h-8 text-[#01b4d5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>

          <!-- Content -->
          <div class="flex-1">
            <h3 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Rectification requise</h3>
            <p class="text-gray-500 dark:text-gray-400 text-base mb-6 leading-relaxed max-w-3xl">
              L'administration a examiné votre dossier et demande des corrections avant de pouvoir poursuivre l'évaluation de votre candidature. Veuillez mettre à jour les éléments demandés.
            </p>

            <!-- Motif Box -->
            <div v-if="candidature?.motif" class="bg-gray-50/50 dark:bg-[#0a0a12]/50 rounded-[10px] p-6 border border-gray-200 dark:border-[#1a1a2a] mb-8 relative max-w-3xl">
              <div class="flex gap-4">
                <svg class="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                <div>
                  <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Message de l'administration</h4>
                  <p class="text-gray-800 dark:text-gray-200 text-base italic font-medium leading-relaxed">"{{ candidature.motif }}"</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-5 items-center">
              <button @click="submitRectification" :disabled="isSubmitting" class="w-full sm:w-auto px-8 py-4 bg-[#01b4d5] hover:bg-[#009ab5] text-white font-bold rounded-[10px] shadow-[0_4px_14px_0_rgba(1,180,213,0.39)] hover:shadow-[0_6px_20px_rgba(1,180,213,0.23)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none">
                <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                {{ isSubmitting ? 'Envoi en cours...' : "J'ai terminé mes corrections" }}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <!-- Timeline Col -->
      <div class="lg:col-span-2 bg-white dark:bg-[#11111e] rounded-[10px] p-8 shadow-xl border border-gray-100 dark:border-[#1a1a2a] relative overflow-hidden">
        <h3 class="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-8 border-l-4 border-[#01b4d5] pl-3">
          État d'avancement du dossier
        </h3>

        <!-- Skeleton timeline -->
        <div v-if="isLoading" class="space-y-6">
          <div v-for="i in 3" :key="i" class="flex gap-4">
            <div class="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse flex-shrink-0"></div>
            <div class="flex-1 space-y-2 pt-1">
              <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3 animate-pulse"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>
        </div>

        <!-- Real Timeline -->
        <div v-else class="relative">
          <div class="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-[#1a1a2a]"></div>

          <div class="space-y-8 relative">

            <!-- Etape 1 : Dépôt -->
            <div class="flex gap-4 group">
              <div class="relative z-10 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.4)] border-4 border-white dark:border-[#11111e] transition-transform group-hover:scale-110">
                <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
              </div>
              <div class="flex-1 pt-1">
                <h4 class="text-sm font-bold text-gray-900 dark:text-white">Dépôt du dossier</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">Vos informations et documents ont été reçus avec succès sur notre plateforme.</p>
                <p class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mt-2 bg-emerald-50 dark:bg-emerald-900/20 inline-block px-2.5 py-1 rounded-[10px] border border-emerald-100 dark:border-emerald-800">Soumis le {{ formatDate(candidature?.created_at) }}</p>
              </div>
            </div>

            <!-- Etape 2 : Validation (Dynamic) -->
            <div class="flex gap-4 group">
              <div class="relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white dark:border-[#11111e] transition-transform group-hover:scale-110"
                   :class="candidature?.dossier_valide ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : (isRectification ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-gradient-to-r from-[#01b4d5] to-[#009ab5] shadow-[0_0_15px_rgba(1,180,213,0.5)]')">

                <svg v-if="candidature?.dossier_valide" class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                <svg v-else-if="isRectification" class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                <div v-else class="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
              </div>
              <div class="flex-1 pt-1">
                <h4 class="text-sm font-bold" :class="candidature?.dossier_valide ? 'text-gray-900 dark:text-white' : (isRectification ? 'text-orange-600 dark:text-orange-400' : 'text-[#01b4d5]')">Étude de conformité</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">Vérification de l'authenticité de vos pièces jointes par notre comité académique.</p>

                <div v-if="isRectification" class="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800">
                  <div class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></div>
                  <span class="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider">Correction demandée</span>
                </div>
                <div v-else-if="!candidature?.dossier_valide" class="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] bg-[#01b4d5]/10 border border-[#01b4d5]/20">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#01b4d5] animate-ping"></div>
                  <span class="text-[10px] text-[#01b4d5] font-bold uppercase tracking-wider">Étape actuelle en cours</span>
                </div>
                <p v-else class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mt-2 bg-emerald-50 dark:bg-emerald-900/20 inline-block px-2.5 py-1 rounded-[10px] border border-emerald-100 dark:border-emerald-800">Dossier Validé et Conforme</p>
              </div>
            </div>

            <!-- Etape 3 : Admission -->
            <div class="flex gap-4 group" :class="!candidature?.dossier_valide ? 'opacity-50' : ''">
              <div class="relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white dark:border-[#11111e] transition-transform group-hover:scale-110"
                   :class="candidature?.admis ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : (candidature?.dossier_valide ? 'bg-gradient-to-r from-[#01b4d5] to-[#009ab5] shadow-[0_0_15px_rgba(1,180,213,0.5)]' : 'bg-gray-200 dark:bg-gray-700')">
                <svg v-if="candidature?.admis" class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                <div v-else-if="candidature?.dossier_valide" class="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                <span v-else class="w-2 h-2 rounded-full bg-gray-400"></span>
              </div>
              <div class="flex-1 pt-1">
                <h4 class="text-sm font-bold" :class="candidature?.admis ? 'text-gray-900 dark:text-white' : (candidature?.dossier_valide ? 'text-[#01b4d5]' : 'text-gray-400 dark:text-gray-500')">Décision d'Admission</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">Approbation finale de votre candidature par la direction académique et jury.</p>
                <div v-if="candidature?.dossier_valide && !candidature?.admis" class="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] bg-[#01b4d5]/10 border border-[#01b4d5]/20">
                  <span class="text-[10px] text-[#01b4d5] font-bold uppercase tracking-wider">En attente de décision</span>
                </div>
              </div>
            </div>

            <!-- Etape 4 : Inscription -->
            <div class="flex gap-4 group" :class="!candidature?.admis ? 'opacity-40' : ''">
              <div class="relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white dark:border-[#11111e] transition-transform group-hover:scale-110"
                   :class="candidature?.inscrit ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'">
                <svg v-if="candidature?.inscrit" class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                <span v-else class="w-2 h-2 rounded-full bg-gray-400"></span>
              </div>
              <div class="flex-1 pt-1">
                <h4 class="text-sm font-bold" :class="candidature?.inscrit ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'">Inscription officielle</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">Validation de l'inscription et création de votre espace étudiant définitif.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Actions Col -->
      <div class="space-y-6">

        <!-- Status Card Quick -->
        <div class="bg-white dark:bg-[#11111e] rounded-[10px] p-6 shadow-xl border border-gray-100 dark:border-[#1a1a2a] text-center flex flex-col justify-center min-h-[200px] relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 dark:to-[#0a0a12] pointer-events-none"></div>
          <div class="relative z-10">
            <div class="w-16 h-16 mx-auto rounded-[10px] flex items-center justify-center mb-4 transform -rotate-6 shadow-sm border transition-transform duration-500 group-hover:rotate-0"
                 :class="candidature?.admis ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' : (isRectification ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-500 dark:text-orange-400 border-orange-100 dark:border-orange-800' : (candidature?.dossier_valide ? 'bg-[#01b4d5]/10 text-[#01b4d5] border-[#01b4d5]/20' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-500 dark:text-orange-400 border-orange-100 dark:border-orange-800'))">
               <svg v-if="candidature?.admis" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
               <svg v-else-if="isRectification" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
               <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ candidature?.admis ? "Admis(e) !" : (isRectification ? 'Vérification demandée' : (candidature?.dossier_valide ? 'En attente de décision' : "En cours d'étude")) }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {{ candidature?.admis ? `Félicitations, vous êtes admis(e) à ${appName}.` : (isRectification ? 'Des corrections sont attendues de votre part avant de poursuivre l\'étude de votre dossier.' : 'Votre dossier est actuellement entre les mains de notre équipe.') }}
            </p>
          </div>
        </div>

        <!-- Shortcut Card Profil -->
        <nuxt-link to="/candidat/profil" class="block bg-gradient-to-br from-[#01b4d5] to-[#009ab5] rounded-[10px] p-6 shadow-lg shadow-[#01b4d5]/20 hover:shadow-xl hover:shadow-[#01b4d5]/40 transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden">
          <div class="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500"></div>

          <div class="flex items-center justify-between relative z-10">
            <div>
              <h3 class="text-lg font-bold text-white mb-1">Mon Profil</h3>
              <p class="text-xs text-white/80">Consulter mes informations</p>
            </div>
            <div class="w-10 h-10 bg-white/20 rounded-[10px] flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:bg-white group-hover:text-[#01b4d5] text-white transition-colors duration-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </div>
          </div>
        </nuxt-link>

        <!-- Shortcut Card Documents -->
        <nuxt-link to="/candidat/documents" class="block bg-white dark:bg-[#11111e] border border-gray-200 dark:border-[#1a1a2a] rounded-[10px] p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden">
          <div class="flex items-center justify-between relative z-10">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">Mes Fichiers</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Gérer mes pièces jointes</p>
            </div>
            <div class="w-10 h-10 bg-gray-50 dark:bg-[#1a1a2a] rounded-[10px] flex items-center justify-center border border-gray-100 dark:border-[#242438] text-gray-400 group-hover:text-[#01b4d5] transition-colors duration-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
            </div>
          </div>
        </nuxt-link>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useNuxtApp } from "#app";
import { useCandidatAuthStore } from "~~/stores/candidatAuth";
import { useParametreStore } from "~~/stores/parametre";

definePageMeta({
  layout: "candidat",
});

const { $toastr } = useNuxtApp();
const candidatAuthStore = useCandidatAuthStore();
const parametreStore = useParametreStore();

const appName = computed(() => parametreStore.getAppName || "ESCEN University");

const isLoading = ref(true);
const candidature = ref(null);
const isSubmitting = ref(false);

const isRectification = computed(() => {
  if (!candidature.value) return false;
  return !!candidature.value.rectification_expected;
});

const submitRectification = async () => {
  isSubmitting.value = true;
  try {
    const data = await candidatAuthStore.submitRectification();
    $toastr.success("Dossier soumis avec succès pour ré-examen.");
    candidature.value = data.candidature;
  } catch (error) {
    console.error("Erreur:", error);
    $toastr.error("Erreur lors de la soumission du dossier.");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  parametreStore.fetchParametres();
  try {
    candidature.value = await candidatAuthStore.fetchMonDossier();
  } catch (error) {
    console.error("Erreur dashboard:", error);
  } finally {
    isLoading.value = false;
  }
});

const formatDate = (dateString) => {
  if (!dateString) return "Date inconnue";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};
</script>
