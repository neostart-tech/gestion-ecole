<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Concours</span>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Notes du concours</span>
    </div>

    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Saisie des notes du concours</h1>

    <!-- Chargement des sessions -->
    <div v-if="isLoadingSessions" class="flex justify-center py-16">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
    </div>

    <div v-else-if="!sessionsAvecEpreuve.length" class="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
      <p class="text-amber-800">
        Aucune session de concours avec épreuve écrite n'est configurée. Rendez-vous dans
        <NuxtLink to="/parametre/concours-sessions" class="font-semibold underline">Paramètres &gt; Sessions de concours</NuxtLink>
        pour en activer une et y associer des matières.
      </p>
    </div>

    <template v-else>
      <div class="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-gray-600 whitespace-nowrap">Session :</span>
          <select
            v-model.number="selectedSessionId"
            @change="loadGrille"
            class="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-[220px]"
          >
            <option v-for="session in sessionsAvecEpreuve" :key="session.id" :value="session.id">{{ session.libelle }}</option>
          </select>
        </div>

        <button
          v-if="rows.length"
          @click="saveNotes"
          :disabled="isSaving"
          class="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
        >
          <span v-if="isSaving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Enregistrer les notes
        </button>
      </div>

      <div v-if="isLoadingGrille" class="flex justify-center py-16">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>

      <div v-else-if="!rows.length" class="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
        Aucun candidat n'a encore participé à l'épreuve pour cette session, ou aucune matière n'est configurée pour leur niveau/filière.
      </div>

      <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Candidat</th>
                <th v-for="matiere in allMatieresLabels" :key="matiere" class="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {{ matiere }}
                </th>
                <th class="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Moyenne</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="row in rows" :key="row.candidature.slug" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4">
                  <h4 class="text-sm font-medium text-gray-900">{{ row.candidature.nom }} {{ row.candidature.prenom }}</h4>
                  <p class="text-xs text-gray-500">{{ row.candidature.matricule_concours || row.candidature.code }}</p>
                </td>
                <td v-for="matiereLabel in allMatieresLabels" :key="matiereLabel" class="px-4 py-4 text-center">
                  <input
                    v-if="findMatiere(row, matiereLabel)"
                    type="number" min="0" max="20" step="0.25"
                    v-model.number="findMatiere(row, matiereLabel).note"
                    class="w-20 text-center border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span v-else class="text-gray-300">—</span>
                </td>
                <td class="px-4 py-4 text-center font-bold" :class="row.moyenne >= 10 ? 'text-green-600' : 'text-rose-600'">
                  {{ row.moyenne ?? '—' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useConcoursSessionStore } from '~~/stores/concoursSession';
import { useConcoursNoteStore } from '~~/stores/concoursNote';

const { $toastr } = useNuxtApp();
const sessionStore = useConcoursSessionStore();
const noteStore = useConcoursNoteStore();

const isLoadingSessions = ref(true);
const isLoadingGrille = ref(false);
const isSaving = ref(false);
const selectedSessionId = ref(null);
const rows = ref([]);

const sessionsAvecEpreuve = computed(() => sessionStore.sessions.filter(s => s.avec_epreuve_ecrite));

const allMatieresLabels = computed(() => {
  const labels = new Set();
  rows.value.forEach(row => row.matieres.forEach(m => labels.add(m.matiere)));
  return Array.from(labels);
});

const findMatiere = (row, matiereLabel) => row.matieres.find(m => m.matiere === matiereLabel);

const loadGrille = async () => {
  if (!selectedSessionId.value) {
    rows.value = [];
    return;
  }
  isLoadingGrille.value = true;
  try {
    rows.value = await noteStore.fetchNotesSession(selectedSessionId.value);
  } catch (error) {
    $toastr.error("Impossible de charger la grille de notes.");
  } finally {
    isLoadingGrille.value = false;
  }
};

const saveNotes = async () => {
  const notes = [];
  rows.value.forEach(row => {
    row.matieres.forEach(m => {
      notes.push({
        candidature_id: row.candidature.id,
        concours_session_matiere_id: m.concours_session_matiere_id,
        note: m.note === '' || m.note === undefined ? null : m.note,
      });
    });
  });

  isSaving.value = true;
  try {
    await noteStore.saveNotes(selectedSessionId.value, notes);
    $toastr.success("Notes enregistrées avec succès.");
    await loadGrille();
  } catch (error) {
    $toastr.error(error.response?.data?.message || "Erreur lors de l'enregistrement des notes.");
  } finally {
    isSaving.value = false;
  }
};

onMounted(async () => {
  isLoadingSessions.value = true;
  try {
    await sessionStore.fetchSessions();
    if (sessionsAvecEpreuve.value.length) {
      selectedSessionId.value = sessionsAvecEpreuve.value[0].id;
      await loadGrille();
    }
  } catch (error) {
    $toastr.error("Impossible de charger les sessions de concours.");
  } finally {
    isLoadingSessions.value = false;
  }
});
</script>
