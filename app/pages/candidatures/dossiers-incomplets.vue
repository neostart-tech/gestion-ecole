<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
      <span class="cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Administration</span>
      <span>/</span>
      <span class="cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Candidatures</span>
      <span>/</span>
      <span class="text-gray-900 dark:text-white font-medium cursor-default">Dossiers incomplets</span>
    </div>

    <!-- Titre -->
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-6">Dossiers incomplets</h1>

    <!-- Instruction -->
    <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-amber-500 dark:text-amber-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <p class="text-sm text-amber-800 dark:text-amber-300">
          Ces candidats ont commencé leur inscription en ligne mais ne l'ont pas terminée. Ils n'apparaissent pas dans les autres listes de candidatures tant que leur dossier n'est pas soumis. Vous pouvez les recontacter pour les inviter à finaliser leur inscription.
        </p>
      </div>
    </div>

    <!-- Recherche -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div class="relative w-full md:w-64">
        <input
          v-model="searchQuery"
          type="search"
          class="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="Rechercher un candidat..."
        />
        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Chargement -->
    <div v-if="isLoading && !dossiers.length" class="flex justify-center py-20">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
    </div>

    <!-- Tableau -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Candidat</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Contact</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Étape atteinte</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Dernière activité</th>
              <th class="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="filteredDossiers.length === 0">
              <td colspan="5" class="px-6 py-12 text-center">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun dossier incomplet</h3>
                <p class="text-gray-500 dark:text-gray-400">
                  {{ searchQuery ? 'Aucun résultat pour votre recherche' : "Tous les candidats ayant commencé une inscription en ligne l'ont terminée." }}
                </p>
              </td>
            </tr>

            <tr v-for="dossier in filteredDossiers" :key="dossier.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center shrink-0">
                    <span class="text-amber-600 dark:text-amber-300 font-semibold">{{ getInitials(dossier.nom, dossier.prenom) }}</span>
                  </div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ dossier.nom }} {{ dossier.prenom }}</h4>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                <div>{{ dossier.email || '—' }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ dossier.tel || '—' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                  {{ dossier.derniere_etape_atteinte }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {{ formatDate(dossier.derniere_activite_le) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex justify-center">
                  <Can action="delete-brouillon-candidature">
                    <button
                      @click="supprimer(dossier)"
                      :disabled="isDeleting === dossier.id"
                      title="Supprimer ce brouillon"
                      class="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white transition-colors disabled:opacity-50"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </Can>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCandidatureStore } from '~~/stores/candidature';

const { $toastr, $swal } = useNuxtApp();
const candidatureStore = useCandidatureStore();

const searchQuery = ref('');
const dossiers = ref([]);
const isLoading = ref(true);
const isDeleting = ref(null);

const getInitials = (nom, prenom) => `${nom?.[0] || ''}${prenom?.[0] || ''}`.toUpperCase();

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const filteredDossiers = computed(() => {
  if (!searchQuery.value) return dossiers.value;
  const query = searchQuery.value.toLowerCase();
  return dossiers.value.filter(d =>
    `${d.nom} ${d.prenom}`.toLowerCase().includes(query) ||
    d.email?.toLowerCase().includes(query) ||
    d.tel?.toLowerCase().includes(query)
  );
});

const loadDossiers = async () => {
  isLoading.value = true;
  try {
    dossiers.value = await candidatureStore.fetchDossiersIncomplets();
  } catch (error) {
    $toastr.error("Impossible de charger les dossiers incomplets.");
  } finally {
    isLoading.value = false;
  }
};

const supprimer = async (dossier) => {
  const res = await $swal.fire({
    title: 'Supprimer ce brouillon ?',
    text: `Le dossier incomplet de ${dossier.nom} ${dossier.prenom} sera définitivement supprimé.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#ef4444',
  });
  if (!res.isConfirmed) return;

  isDeleting.value = dossier.id;
  try {
    await candidatureStore.supprimerBrouillon(dossier.id);
    dossiers.value = dossiers.value.filter(d => d.id !== dossier.id);
    $toastr.success('Brouillon supprimé avec succès.');
  } catch (error) {
    $toastr.error(error.response?.data?.message || "Erreur lors de la suppression.");
  } finally {
    isDeleting.value = null;
  }
};

onMounted(loadDossiers);
</script>
