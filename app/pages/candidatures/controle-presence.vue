<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Concours</span>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Contrôle de présence</span>
    </div>

    <!-- Titre -->
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Contrôle de présence au concours</h1>

    <!-- Chargement des sessions -->
    <div v-if="isLoadingSessions" class="flex justify-center py-16">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
    </div>

    <!-- Aucune session avec épreuve écrite -->
    <div v-else-if="!sessionsAvecEpreuve.length" class="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
      <p class="text-amber-800">
        Aucune session de concours avec épreuve écrite n'est configurée. Rendez-vous dans
        <NuxtLink to="/parametre/concours-sessions" class="font-semibold underline">Paramètres &gt; Sessions de concours</NuxtLink>
        pour en activer une.
      </p>
    </div>

    <template v-else>
      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <p class="text-sm text-gray-600">Total candidats</p>
          <p class="text-2xl font-semibold text-gray-900 mt-2">{{ totalCandidates }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-6">
          <p class="text-sm text-gray-600">Restants à traiter</p>
          <p class="text-2xl font-semibold text-indigo-600 mt-2">{{ candidates.length }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-6">
          <p class="text-sm text-gray-600">Marqués absents</p>
          <p class="text-2xl font-semibold text-rose-600 mt-2">{{ selectedAbsents.length }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-6">
          <p class="text-sm text-gray-600">Session sélectionnée</p>
          <p class="text-sm font-semibold text-gray-900 mt-2">{{ selectedSession?.libelle || '—' }}</p>
        </div>
      </div>

      <!-- Barre de contrôle -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div class="flex items-center gap-2">
          <span class="text-gray-600 whitespace-nowrap">Session :</span>
          <select
            v-model.number="selectedSessionId"
            @change="loadCandidates"
            class="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option v-for="session in sessionsAvecEpreuve" :key="session.id" :value="session.id">{{ session.libelle }}</option>
          </select>
        </div>

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
      </div>

      <!-- Instruction -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p class="text-sm text-blue-800">
          Cochez uniquement les candidats <strong>absents</strong> à l'épreuve. Tous les autres candidats de la liste
          seront automatiquement marqués présents à la soumission.
        </p>
      </div>

      <!-- Chargement -->
      <div v-if="isLoadingCandidates" class="flex justify-center py-16">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>

      <!-- Tableau des candidats -->
      <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Candidat</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Matricule</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Filière</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Absent ?</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-if="filteredCandidates.length === 0">
                <td colspan="4" class="px-6 py-12 text-center">
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun candidat trouvé</h3>
                  <p class="text-gray-500">
                    {{ searchQuery ? 'Aucun résultat pour votre recherche' : "Aucun candidat n'a encore payé les frais de participation pour cette session." }}
                  </p>
                </td>
              </tr>

              <tr v-for="candidate in filteredCandidates" :key="candidate.slug" class="hover:bg-gray-50 transition-colors">
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
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {{ candidate.matricule_concours || candidate.numero_dossier_affiche }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ candidate.filiere?.nom || '—' }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" v-model="selectedAbsents" :value="candidate.slug" class="w-5 h-5 rounded text-rose-600 focus:ring-rose-500" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Soumission -->
      <div v-if="filteredCandidates.length" class="mt-6 flex justify-end">
        <button
          @click="submitPresence"
          :disabled="isSubmitting"
          class="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
        >
          <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Soumettre la liste de présence
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCandidatureStore } from '~~/stores/candidature';
import { useConcoursSessionStore } from '~~/stores/concoursSession';

const { $toastr, $swal } = useNuxtApp();
const candidatureStore = useCandidatureStore();
const sessionStore = useConcoursSessionStore();

const searchQuery = ref('');
const candidates = ref([]);
const selectedAbsents = ref([]);
const selectedSessionId = ref(null);
const isLoadingSessions = ref(true);
const isLoadingCandidates = ref(false);
const isSubmitting = ref(false);

const sessionsAvecEpreuve = computed(() => sessionStore.sessions.filter(s => s.avec_epreuve_ecrite));
const selectedSession = computed(() => sessionsAvecEpreuve.value.find(s => s.id === selectedSessionId.value));

const totalCandidates = computed(() => candidates.value.length);

const filteredCandidates = computed(() => {
  if (!searchQuery.value) return candidates.value;
  const query = searchQuery.value.toLowerCase();
  return candidates.value.filter(candidate =>
    `${candidate.nom} ${candidate.prenom}`.toLowerCase().includes(query) ||
    candidate.email?.toLowerCase().includes(query) ||
    String(candidate.matricule_concours || candidate.numero_dossier_affiche || '').toLowerCase().includes(query)
  );
});

const getInitials = (nom, prenom) => `${nom?.[0] || ''}${prenom?.[0] || ''}`.toUpperCase();

const loadCandidates = async () => {
  if (!selectedSessionId.value) {
    candidates.value = [];
    return;
  }
  isLoadingCandidates.value = true;
  selectedAbsents.value = [];
  try {
    const all = await candidatureStore.fetchCandidaturesParticipation();
    candidates.value = (all || []).filter(c => c.concours_session_id === selectedSessionId.value);
  } catch (error) {
    $toastr.error("Impossible de charger la liste des candidats.");
  } finally {
    isLoadingCandidates.value = false;
  }
};

const submitPresence = async () => {
  const res = await $swal.fire({
    title: 'Soumettre la liste de présence ?',
    text: `${selectedAbsents.value.length} candidat(s) seront marqués absents, les ${candidates.value.length - selectedAbsents.value.length} autres seront marqués présents. Cette action déclenche l'envoi des emails correspondants.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, soumettre',
    cancelButtonText: 'Annuler',
  });
  if (!res.isConfirmed) return;

  isSubmitting.value = true;
  try {
    await candidatureStore.soumettrePresence({ candidats: selectedAbsents.value });
    $toastr.success("Liste de présence soumise avec succès.");
    await loadCandidates();
  } catch (error) {
    $toastr.error(error.response?.data?.message || "Erreur lors de la soumission.");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  isLoadingSessions.value = true;
  try {
    await sessionStore.fetchSessions();
    if (sessionsAvecEpreuve.value.length) {
      selectedSessionId.value = sessionsAvecEpreuve.value[0].id;
      await loadCandidates();
    }
  } catch (error) {
    $toastr.error("Impossible de charger les sessions de concours.");
  } finally {
    isLoadingSessions.value = false;
  }
});
</script>
