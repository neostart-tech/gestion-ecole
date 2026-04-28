<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-300">
    <!-- En-tête -->
    <div class="max-w-7xl mx-auto mb-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <NuxtLink 
            to="/filieres/liste" 
            class="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:text-indigo-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </NuxtLink>
          <div>
            <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Programme Académique
            </h1>
            <p class="text-gray-500 dark:text-gray-400 font-medium">
              Filière : <span class="text-indigo-600 dark:text-indigo-400 font-bold">{{ filiere?.nom }}</span> ({{ filiere?.code }})
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-xl border border-indigo-100 dark:border-indigo-800 font-bold flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {{ totalCredits }} Crédits Total
          </div>
        </div>
      </div>
    </div>

    <!-- Chargement -->
    <div v-if="loading" class="max-w-7xl mx-auto flex flex-col items-center justify-center py-20">
      <div class="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Chargement du cursus...</p>
    </div>

    <!-- Contenu par semestre -->
    <div v-else class="max-w-7xl mx-auto space-y-10">
      <div v-for="(group, index) in groupedBySemester" :key="index" class="relative">
        <div class="flex items-center gap-4 mb-6">
          <div class="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/30">
            S{{ group.periode_numero || (index + 1) }}
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ group.periode_nom }}</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest">
              {{ group.ues.length }} Unités d'Enseignement
            </p>
          </div>
          <div class="flex-grow border-t-2 border-dashed border-gray-200 dark:border-gray-700 ml-4"></div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div v-for="ue in group.ues" :key="ue.id" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="p-5 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
              <div>
                <h3 class="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span class="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  {{ ue.nom }}
                </h3>
                <span class="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{{ ue.code }}</span>
              </div>
              <div class="px-2.5 py-1 bg-white dark:bg-gray-700 rounded-lg shadow-sm text-xs font-black text-indigo-600 dark:text-indigo-400 border border-gray-100 dark:border-gray-600">
                {{ ue.credit || 0 }} CREDITS
              </div>
            </div>

            <div class="p-0">
              <table class="w-full text-left">
                <thead>
                  <tr class="text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-gray-50 dark:border-gray-700">
                    <th class="px-5 py-3 font-bold">Matière (UV)</th>
                    <th class="px-5 py-3 font-bold text-center">Coeff.</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50 dark:divide-gray-700">
                  <tr v-for="uv in ue.unite_de_valeurs" :key="uv.id" class="group hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors">
                    <td class="px-5 py-4">
                      <div class="font-bold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {{ uv.nom }}
                      </div>
                      <div class="text-[10px] text-gray-400 font-medium">{{ uv.code }}</div>
                    </td>
                    <td class="px-5 py-4 text-center">
                      <span class="inline-block px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold min-w-[30px]">
                        {{ uv.coefficient || 0 }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pied de page / Informations générales -->
    <div v-if="!loading && filiere?.description" class="max-w-7xl mx-auto mt-20 pt-10 border-t border-gray-200 dark:border-gray-700">
      <div class="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div class="relative z-10 max-w-2xl">
          <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            À propos de cette filière
          </h3>
          <p class="text-indigo-100 leading-relaxed font-medium">
            {{ filiere.description }}
          </p>
        </div>
        <!-- Décoration -->
        <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div class="absolute -left-10 -top-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const slug = route.params.slug;
const loading = ref(true);
const filiere = ref(null);

const authHeaders = () => {
  const token = localStorage.getItem("gest-ecole-token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

const groupedBySemester = computed(() => {
  if (!filiere.value || !filiere.value.unites_enseignements) return [];

  const semesters = {};
  
  filiere.value.unites_enseignements.forEach(ue => {
    const periId = ue.periode_id || 'Autre';
    const periName = ue.periode?.nom || 'Semestre non défini';
    
    if (!semesters[periId]) {
      semesters[periId] = {
        periode_nom: periName,
        periode_numero: ue.periode?.ordre || null,
        debut: ue.periode?.debut || null,
        ues: []
      };
    }
    semesters[periId].ues.push(ue);
  });

  // Trier par date de début si possible
  return Object.values(semesters).sort((a, b) => {
    if (a.debut && b.debut) return new Date(a.debut) - new Date(b.debut);
    return (a.periode_numero || 0) - (b.periode_numero || 0);
  });
});

const totalCredits = computed(() => {
  if (!filiere.value || !filiere.value.unites_enseignements) return 0;
  
  return filiere.value.unites_enseignements.reduce((total, ue) => {
    return total + (ue.credit || 0);
  }, 0);
});

onMounted(async () => {
  try {
    const response = await axios.get(`/filieres/${slug}/programme`, authHeaders());
    filiere.value = response.data.data;
  } catch (error) {
    console.error("Erreur lors du chargement du programme:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.shadow-indigo-500\/30 {
  --tw-shadow-color: rgba(99, 102, 241, 0.3);
  --tw-shadow: var(--tw-shadow-line, 0 0 #0000), var(--tw-shadow-line, 0 0 #0000), var(--tw-shadow-color);
}
</style>
