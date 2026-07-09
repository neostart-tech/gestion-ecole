<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Administration</span>
      <span>/</span>
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Candidatures</span>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Payement des frais de participation</span>
    </div>

    <!-- Titre -->
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Payement des frais de participation</h1>

    <!-- Instruction -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-sm text-blue-800">
          Cette liste ne contient que les candidats dont le dossier a été validé et qui n'ont pas encore payé les frais de participation au concours.
        </p>
      </div>
    </div>

    <!-- Recherche -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div class="relative w-full md:w-64">
        <input
          v-model="searchQuery"
          type="search"
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder="Rechercher un candidat..."
        />
        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>

      <button
        v-if="selectedSlugs.length"
        @click="markSelectedAsPaid"
        :disabled="isSubmitting"
        class="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm disabled:opacity-50"
      >
        <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        Marquer {{ selectedSlugs.length }} candidat(s) comme ayant payé
      </button>
    </div>

    <!-- Chargement -->
    <div v-if="candidatureStore.isLoading && !candidates.length" class="flex justify-center py-20">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
    </div>

    <!-- Tableau des candidats -->
    <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 w-10">
                <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" class="rounded text-indigo-600 focus:ring-indigo-500" />
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nom & Prénoms</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Filière</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Code</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="filteredCandidates.length === 0">
              <td colspan="5" class="px-6 py-12 text-center">
                <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun candidat en attente de paiement</h3>
                <p class="text-gray-500">
                  {{ searchQuery ? 'Aucun résultat pour votre recherche' : 'Tous les dossiers validés ont déjà payé les frais de participation.' }}
                </p>
              </td>
            </tr>

            <tr v-for="candidate in filteredCandidates" :key="candidate.slug" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <input type="checkbox" v-model="selectedSlugs" :value="candidate.slug" class="rounded text-indigo-600 focus:ring-indigo-500" />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span class="text-indigo-600 font-semibold">{{ getInitials(candidate.nom, candidate.prenom) }}</span>
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">{{ candidate.nom }} {{ candidate.prenom }}</h4>
                    <p class="text-xs text-gray-500">{{ candidate.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ candidate.filiere?.nom || '—' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {{ candidate.matricule_concours || candidate.code }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  @click="markAsPaid(candidate)"
                  :disabled="isSubmitting"
                  class="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors font-medium disabled:opacity-50"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Marquer comme ayant payé
                </button>
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
const candidates = ref([]);
const selectedSlugs = ref([]);
const isSubmitting = ref(false);

const loadCandidates = async () => {
  try {
    candidates.value = await candidatureStore.fetchCandidaturesPayement();
  } catch (error) {
    $toastr.error("Impossible de charger la liste des candidats.");
  }
};

const getInitials = (nom, prenom) => {
  return `${nom?.[0] || ''}${prenom?.[0] || ''}`.toUpperCase();
};

const filteredCandidates = computed(() => {
  if (!searchQuery.value) return candidates.value;
  const query = searchQuery.value.toLowerCase();
  return candidates.value.filter(candidate =>
    `${candidate.nom} ${candidate.prenom}`.toLowerCase().includes(query) ||
    candidate.email?.toLowerCase().includes(query) ||
    String(candidate.code).includes(query) ||
    String(candidate.matricule_concours || '').toLowerCase().includes(query)
  );
});

const allSelected = computed(() => {
  return filteredCandidates.value.length > 0 && selectedSlugs.value.length === filteredCandidates.value.length;
});

const toggleSelectAll = () => {
  selectedSlugs.value = allSelected.value ? [] : filteredCandidates.value.map(c => c.slug);
};

const submitPayement = async (slugs) => {
  if (!slugs.length) return;
  isSubmitting.value = true;
  try {
    await candidatureStore.soumettrePayement({ paye: slugs });
    $toastr.success("Paiement soumis avec succès. Le traitement est en cours.");
    candidates.value = candidates.value.filter(c => !slugs.includes(c.slug));
    selectedSlugs.value = selectedSlugs.value.filter(s => !slugs.includes(s));
  } catch (error) {
    $toastr.error(error.response?.data?.message || "Erreur lors de la soumission du paiement.");
  } finally {
    isSubmitting.value = false;
  }
};

const markAsPaid = async (candidate) => {
  const res = await $swal.fire({
    title: 'Confirmer le paiement',
    text: `Confirmer que ${candidate.nom} ${candidate.prenom} a payé les frais de participation ?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui, confirmer',
    cancelButtonText: 'Annuler',
  });
  if (res.isConfirmed) {
    await submitPayement([candidate.slug]);
  }
};

const markSelectedAsPaid = async () => {
  const res = await $swal.fire({
    title: 'Confirmer le paiement',
    text: `Confirmer le paiement pour ${selectedSlugs.value.length} candidat(s) ?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui, confirmer',
    cancelButtonText: 'Annuler',
  });
  if (res.isConfirmed) {
    await submitPayement([...selectedSlugs.value]);
  }
};

onMounted(loadCandidates);
</script>
