<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Communication', to: '/' },
        { label: 'Tableau de bord', to: null },
      ]"
      title="Tableau de bord - Communication"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-6"
    />

    <div v-if="statStore.isLoading" class="flex justify-center py-20">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      <!-- Prospects / Brochures -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between group hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Prospects (Brochures)</p>
            <h3 class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats?.prospects?.total || 0 }}</h3>
          </div>
          <div class="p-3 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-xl group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-red-500 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {{ stats?.prospects?.non_contactes || 0 }} non contactés
          </span>
        </div>
      </div>

      <!-- Messages Contact -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between group hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Messages reçus</p>
            <h3 class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats?.messages?.total || 0 }}</h3>
          </div>
          <div class="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-yellow-600 font-medium bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            {{ stats?.messages?.non_lus || 0 }} non lus
          </span>
        </div>
      </div>

      <!-- Publications (Blogs) -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between group hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Publications</p>
            <h3 class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats?.blogs?.total || 0 }}</h3>
          </div>
          <div class="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-green-600 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            {{ stats?.blogs?.publies || 0 }} publiés
          </span>
        </div>
      </div>

      <!-- Opportunités (Annonces) -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between group hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Opportunités</p>
            <h3 class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats?.opportunites?.total || 0 }}</h3>
          </div>
          <div class="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"></path>
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-emerald-600 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full flex items-center gap-1">
            {{ stats?.opportunites?.actives || 0 }} actives
          </span>
        </div>
      </div>

      <!-- Événements -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between group hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Événements</p>
            <h3 class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats?.evenements?.total || 0 }}</h3>
          </div>
          <div class="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-gray-500">Organisés</span>
        </div>
      </div>

      <!-- Partenaires -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between group hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Partenaires</p>
            <h3 class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats?.partenaires?.total || 0 }}</h3>
          </div>
          <div class="p-3 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-xl group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-gray-500">Réseau actif</span>
        </div>
      </div>
    </div>

    <!-- Graphiques -->
    <div v-if="!statStore.isLoading" class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Répartition Contacts & Prospects -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Répartition des Requêtes</h3>
        <div class="h-64 relative w-full">
          <canvas ref="repartitionChart"></canvas>
        </div>
      </div>

      <!-- Volume des Publications -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Volume des Ressources</h3>
        <div class="h-64 relative w-full">
          <canvas ref="volumeChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Paramètres des chiffres clés -->
    <div v-if="!statStore.isLoading" class="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Chiffres Clés (Site Public)</h3>
        <button 
          @click="saveParametres" 
          :disabled="isSavingParams"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <svg v-if="isSavingParams" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Enregistrer
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        <!-- Étudiants formés -->
        <div class="group">
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
            Étudiants formés
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            </div>
            <input type="number" v-model="formData.stat_etudiants_formes" class="block w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-lg font-semibold focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm" placeholder="Ex: 520" />
          </div>
        </div>

        <!-- Diplômés -->
        <div class="group">
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
            Diplômés
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
              </svg>
            </div>
            <input type="number" v-model="formData.stat_diplomes" class="block w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-lg font-semibold focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm" placeholder="Ex: 410" />
          </div>
        </div>

        <!-- Partenaires -->
        <div class="group">
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
            Partenaires
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <input type="number" v-model="formData.stat_partenaires" class="block w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-lg font-semibold focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm" placeholder="Ex: 84" />
          </div>
        </div>

        <!-- Insertion pro -->
        <div class="group">
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
            Insertion pro. (%)
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <input type="number" v-model="formData.stat_insertion_pro" class="block w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-lg font-semibold focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm" placeholder="Ex: 76" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, onUnmounted } from 'vue';
import Breadcrumb from '~/components/Breadcrumb.vue';
import { useStatistiqueStore } from '~~/stores/statistique';
import { useParametreStore } from '~~/stores/parametre';
import Chart from 'chart.js/auto';

const { $toastr } = useNuxtApp();
const statStore = useStatistiqueStore();
const paramStore = useParametreStore();

const stats = computed(() => statStore.stats.communicationStats);

const repartitionChart = ref(null);
const volumeChart = ref(null);

const formData = ref({
  stat_etudiants_formes: '',
  stat_diplomes: '',
  stat_partenaires: '',
  stat_insertion_pro: ''
});
const isSavingParams = ref(false);

let repartitionChartInstance = null;
let volumeChartInstance = null;

const initCharts = () => {
  if (!stats.value) return;

  // Détruire les instances existantes pour éviter les doublons
  if (repartitionChartInstance) repartitionChartInstance.destroy();
  if (volumeChartInstance) volumeChartInstance.destroy();

  // Graphique de répartition (Doughnut)
  if (repartitionChart.value) {
    const prospectsContactes = stats.value.prospects?.total - stats.value.prospects?.non_contactes || 0;
    const messagesLus = stats.value.messages?.total - stats.value.messages?.non_lus || 0;

    repartitionChartInstance = new Chart(repartitionChart.value, {
      type: 'doughnut',
      data: {
        labels: ['Prospects Contactés', 'Prospects Non Contactés', 'Messages Lus', 'Messages Non Lus'],
        datasets: [{
          data: [
            prospectsContactes,
            stats.value.prospects?.non_contactes || 0,
            messagesLus,
            stats.value.messages?.non_lus || 0
          ],
          backgroundColor: [
            '#10B981', // Green
            '#EF4444', // Red
            '#6366F1', // Indigo
            '#F59E0B'  // Amber
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#6B7280',
              font: { family: "'Inter', sans-serif" }
            }
          }
        },
        cutout: '65%'
      }
    });
  }

  // Graphique de volume (Bar)
  if (volumeChart.value) {
    volumeChartInstance = new Chart(volumeChart.value, {
      type: 'bar',
      data: {
        labels: ['Publications', 'Opportunités', 'Événements', 'Partenaires'],
        datasets: [{
          label: 'Total',
          data: [
            stats.value.blogs?.total || 0,
            stats.value.opportunites?.total || 0,
            stats.value.evenements?.total || 0,
            stats.value.partenaires?.total || 0
          ],
          backgroundColor: '#A855F7', // Purple
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#E5E7EB',
              drawBorder: false
            },
            ticks: {
              color: '#6B7280',
              font: { family: "'Inter', sans-serif" }
            }
          },
          x: {
            grid: { display: false },
            ticks: {
              color: '#6B7280',
              font: { family: "'Inter', sans-serif" }
            }
          }
        }
      }
    });
  }
};

const loadParametres = async () => {
  await paramStore.fetchParametres();
  formData.value.stat_etudiants_formes = paramStore.getParamValue('stat_etudiants_formes') || '520';
  formData.value.stat_diplomes = paramStore.getParamValue('stat_diplomes') || '410';
  formData.value.stat_partenaires = paramStore.getParamValue('stat_partenaires') || '84';
  formData.value.stat_insertion_pro = paramStore.getParamValue('stat_insertion_pro') || '76';
};

const saveParametres = async () => {
  isSavingParams.value = true;
  try {
    await paramStore.updateParametres(formData.value);
    if($toastr) {
      $toastr.success("Chiffres clés mis à jour avec succès");
    }
  } catch(error) {
    console.error(error);
    if($toastr) {
      $toastr.error("Erreur lors de la mise à jour");
    }
  } finally {
    isSavingParams.value = false;
  }
};

onMounted(async () => {
  await statStore.fetchCommunicationStats();
  await loadParametres();
  initCharts();
});

watch(stats, () => {
  initCharts();
}, { deep: true });

onUnmounted(() => {
  if (repartitionChartInstance) repartitionChartInstance.destroy();
  if (volumeChartInstance) volumeChartInstance.destroy();
});
</script>
