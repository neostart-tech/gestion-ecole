<template>
  <div v-if="isLocked" class="relative w-full">
    <!-- Slot avec flou visuel et clic désactivé -->
    <div class="filter blur-md select-none pointer-events-none opacity-40 transition-all duration-300">
      <slot />
    </div>

    <!-- Overlay d'accès restreint -->
    <div class="absolute inset-0 z-40 flex items-center justify-center p-4 sm:p-6 min-h-[400px]">
      <div class="w-full max-w-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-rose-200/80 dark:border-rose-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 animate-fade-in-up">
        
        <!-- Icone Cadenas Institutionnel -->
        <div class="mx-auto w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/50 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-inner">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <!-- Titre & Description -->
        <div class="space-y-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            Accès académique restreint
          </span>
          <h3 class="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Frais d'inscription en attente
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mx-auto">
            L'accès aux supports de cours, emplois du temps, examens et relevés nécessite la validation préalable de vos frais d'inscription. Vous pouvez effectuer le paiement directement en ligne ou vous rendre à la caisse de l'établissement.
          </p>
        </div>

        <!-- Récapitulatif informatif -->
        <div class="bg-gray-50/80 dark:bg-gray-800/60 border border-gray-200/70 dark:border-gray-700/60 rounded-2xl p-4 text-left space-y-2 text-xs">
          <div class="flex items-center justify-between text-gray-700 dark:text-gray-300 font-semibold">
            <span>Statut du dossier financier :</span>
            <span class="text-rose-600 dark:text-rose-400 font-bold">Non régularisé</span>
          </div>
          <p class="text-[#8a8a9a] text-[11px]">
            Dès enregistrement de votre règlement (à la caisse ou en ligne via votre portail), l'ensemble de vos modules sera débloqué immédiatement.
          </p>
        </div>

        <!-- Bouton d'action direct -->
        <div class="pt-2">
          <NuxtLink
            to="/etudiant/mes-paiements"
            class="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-rose-600/25 transition-all duration-200 active:scale-98"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Regler en ligne ou consulter mes paiements</span>
          </NuxtLink>
        </div>

      </div>
    </div>
  </div>
  <div v-else>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useFraisInscriptionStore } from '~~/stores/frais-inscription';

const store = useFraisInscriptionStore();
const isLocked = computed(() => store.isFraisInscriptionImpaye);

onMounted(() => {
  store.fetchRecapPaiement(true);
});
</script>
