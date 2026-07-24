<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 p-4 md:p-8">
    <div class="max-w-3xl mx-auto">
      <div class="mb-8 text-center">
        <h1 class="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight">Concours d'admission</h1>
        <p class="text-slate-500 dark:text-gray-400 mt-2">Informations officielles sur la session en cours</p>
      </div>

      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>

      <div v-else-if="!session" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-10 text-center">
        <p class="text-gray-500 dark:text-gray-400">Concours à venir, les dates ne sont pas encore annoncées. Revenez bientôt.</p>
      </div>

      <div v-else class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 md:p-8">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">{{ session.libelle }}</h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div v-if="session.date_debut_depot" class="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
              <p class="text-xs uppercase font-semibold text-indigo-500">Début du dépôt des dossiers</p>
              <p class="text-lg font-bold text-indigo-900 dark:text-indigo-300">{{ formatDate(session.date_debut_depot) }}</p>
            </div>
            <div v-if="session.date_fin_depot" class="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
              <p class="text-xs uppercase font-semibold text-indigo-500">Fin du dépôt des dossiers</p>
              <p class="text-lg font-bold text-indigo-900 dark:text-indigo-300">{{ formatDate(session.date_fin_depot) }}</p>
            </div>
            <div v-if="session.avec_epreuve_ecrite && session.date_epreuve" class="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20">
              <p class="text-xs uppercase font-semibold text-amber-600">Date de l'épreuve écrite</p>
              <p class="text-lg font-bold text-amber-900 dark:text-amber-300">{{ formatDate(session.date_epreuve) }}</p>
            </div>
            <div v-if="session.avec_epreuve_ecrite && session.date_publication_resultats" class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
              <p class="text-xs uppercase font-semibold text-emerald-600">Publication des résultats</p>
              <p class="text-lg font-bold text-emerald-900 dark:text-emerald-300">{{ formatDate(session.date_publication_resultats) }}</p>
            </div>
          </div>

          <p
            v-if="session.communique"
            class="text-sm text-gray-700 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700 pt-4 whitespace-pre-line"
          >{{ session.communique }}</p>
        </div>

        <div v-if="session.avec_epreuve_ecrite && session.matieres?.length" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 md:p-8">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Matières de l'épreuve écrite</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-left text-xs font-semibold text-gray-500 uppercase border-b border-gray-100 dark:border-gray-700">
                  <th class="py-2">Matière</th>
                  <th class="py-2">Niveau</th>
                  <th class="py-2">Filière</th>
                  <th class="py-2 text-right">Coefficient</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                <tr v-for="(m, index) in session.matieres" :key="index">
                  <td class="py-2 font-medium text-gray-900 dark:text-white">{{ m.matiere }}</td>
                  <td class="py-2 text-gray-600 dark:text-gray-300">{{ m.niveau }}</td>
                  <td class="py-2 text-gray-600 dark:text-gray-300">{{ m.filiere || 'Toutes filières' }}</td>
                  <td class="py-2 text-right font-semibold text-indigo-600">{{ m.coefficient }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

definePageMeta({ layout: false });

const isLoading = ref(true);
const session = ref(null);

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
};

onMounted(async () => {
  try {
    const response = await axios.get('/public/concours/informations-publiques');
    session.value = response.data.data;
  } catch (error) {
    console.error('Erreur chargement des informations du concours:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>
