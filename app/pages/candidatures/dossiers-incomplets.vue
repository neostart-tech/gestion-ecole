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

    <!-- Tableau -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-3 sm:p-4">
      <div v-if="isLoading && !dossiers.length" class="flex justify-center py-20">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="columns"
          :rows="dossiers"
          :search="searchQuery"
          :per-page="10"
          skin="bh-table-striped bh-table-hover"
        >
          <template #candidat="{ value }">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center shrink-0">
                <span class="text-amber-600 dark:text-amber-300 font-semibold">{{ getInitials(value.nom, value.prenom) }}</span>
              </div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ value.nom }} {{ value.prenom }}</h4>
            </div>
          </template>

          <template #contact="{ value }">
            <div class="text-sm text-gray-700 dark:text-gray-300">{{ value.email || '—' }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ value.tel || '—' }}</div>
          </template>

          <template #derniere_etape_atteinte="{ value }">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
              {{ value.derniere_etape_atteinte }}
            </span>
          </template>

          <template #derniere_activite_le="{ value }">
            <span class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {{ formatDate(value.derniere_activite_le) }}
            </span>
          </template>

          <template #actions="{ value }">
            <div class="flex justify-center gap-2">
              <nuxt-link
                :to="`/candidatures/${value.slug}`"
                title="Voir les détails"
                class="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </nuxt-link>
              
              <Can action="delete-brouillon-candidature">
                <button
                  @click="supprimer(value)"
                  :disabled="isDeleting === value.id"
                  title="Supprimer ce brouillon"
                  class="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white transition-colors disabled:opacity-50"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </Can>
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCandidatureStore } from '~~/stores/candidature';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import '@bhplugin/vue3-datatable/dist/style.css';

const { $toastr, $swal } = useNuxtApp();
const candidatureStore = useCandidatureStore();

const searchQuery = ref('');
const dossiers = ref([]);
const isLoading = ref(true);
const isDeleting = ref(null);

const columns = [
  { field: 'candidat', title: 'Candidat' },
  { field: 'contact', title: 'Contact' },
  { field: 'derniere_etape_atteinte', title: 'Étape atteinte' },
  { field: 'derniere_activite_le', title: 'Dernière activité' },
  { field: 'actions', title: 'Actions', sort: false, headerClass: 'justify-center' },
];

const getInitials = (nom, prenom) => `${nom?.[0] || ''}${prenom?.[0] || ''}`.toUpperCase();

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

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
