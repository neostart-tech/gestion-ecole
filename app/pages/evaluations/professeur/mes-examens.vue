<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Evaluations', to: '/' },
        { label: 'Liste', to: null },
      ]"
      title="Mes examens"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Toolbar -->
    <div
      class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5"
    >
      <!-- Recherche -->
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Rechercher par matière, groupe, salle..."
        class="w-full lg:w-64 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Colonnes -->
        <client-only>
          <VDropdown placement="bottom-end">
            <button
              class="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Colonnes
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>

            <template #popper>
              <div
                class="w-56 p-3 rounded-lg shadow-lg bg-white dark:bg-gray-800"
              >
                <div
                  v-for="col in columns"
                  :key="col.field"
                  class="flex items-center gap-2 py-1"
                >
                  <input
                    type="checkbox"
                    v-model="col.visible"
                    :disabled="col.field === 'action'"
                    class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">
                    {{ col.title }}
                  </span>
                </div>
              </div>
            </template>
          </VDropdown>
        </client-only>

        <!-- Ajouter -->
        <Can action="create-evaluation">
          <NuxtLink
            to="/evaluations/ajouter-une-evaluation"
            class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <svg
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M12 5v14M5 12h14"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            Ajouter
          </NuxtLink>
        </Can>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-3 sm:p-4">
      <div v-if="loading" class="flex justify-center py-10">
        <div
          class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"
        ></div>
      </div>

      <div v-else-if="!filteredRows.length" class="text-center py-10">
        <svg
          class="w-16 h-16 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p class="text-gray-500 dark:text-gray-400">
          Aucune évaluation trouvée
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="visibleColumns"
          :rows="filteredRows"
          :search="searchQuery"
          :per-page="itemsPerPage"
          skin="bh-table-striped bh-table-hover"
        >
          <!-- Template pour la colonne Matière -->
          <template #matiere="data">
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ data.value?.nom || "Non spécifiée" }}
            </span>
          </template>

          <!-- Template pour la colonne Groupe -->
          <template #group.nom="data">
            <span class="text-sm font-medium text-gray-900 dark:text-white">
             {{ data.value?.group?.niveau?.libelle || "Non spécifiée" }} {{ data.value?.group?.nom || "Non spécifiée" }}
            </span>
          </template>

          <!-- Template pour la colonne Salle -->
          <template #salle.nom="data">
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ data.value?.salle?.nom || "Non spécifiée" }}
            </span>
          </template>

          <!-- Template pour la colonne Date -->
          <template #date="data">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ formatDate(data.value.date) }}
            </span>
          </template>

          <!-- Template pour la colonne Durée -->
          <template #duration_minutes="data">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ formatDuration(data.value.duration_minutes) }}
            </span>
          </template>

          <!-- Template pour la colonne Actions -->
          <template #action="{ value }">
            <div class="flex justify-center gap-2">
              <!-- Voir détails -->
              <NuxtLink
                :to="`/evaluations/professeur/detail-examen/${value.slug}`"
                class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                title="Voir les détails"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </NuxtLink>

              <!-- Questions (si en ligne) - uniquement pour les étudiants -->
              <NuxtLink
                v-if="value.is_online === 1 && isEtudiant"
                :to="`/evaluations/examen-en-ligne/${value.slug}/questions`"
                class="p-2 rounded-lg text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200"
                title="Composer l'examen"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </NuxtLink>

                <NuxtLink
                v-if="value.is_online === 1"
                :to="`/evaluations/examen-en-ligne/${value.slug}/soumission-des-etudiants`"
                class="p-2 rounded-lg text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200"
                title="Voir les soummissions des étudiants"
              >
         <svg
  class="w-4 h-4"
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
>
  <!-- Document avec personnes -->
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M9 12h6m-6 4h6m2-10H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"
  />
  <circle cx="12" cy="8" r="2" stroke="currentColor" />
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M8 18c.5-1 2-2 4-2s3.5 1 4 2"
  />
</svg>
              </NuxtLink>
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>

    <!-- Modal de configuration -->
    <TransitionRoot appear :show="showConfigModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeConfigModal">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/60" />
        </TransitionChild>

        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            class="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-5"
          >
            <DialogTitle
              class="text-lg font-semibold mb-4 text-gray-900 dark:text-white"
            >
              Configurer l'évaluation
            </DialogTitle>

            <form @submit.prevent="saveConfig" class="space-y-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Surveillant 1
                </label>
                <Dropdown
                  v-model="configForm.surveillant_1_id"
                  :options="surveillantsOptions"
                  optionLabel="label"
                  optionValue="value"
                  filter
                  showClear
                  placeholder="Sélectionner un surveillant"
                  class="w-full"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Surveillant 2
                </label>
                <Dropdown
                  v-model="configForm.surveillant_2_id"
                  :options="surveillantsOptions"
                  optionLabel="label"
                  optionValue="value"
                  filter
                  showClear
                  placeholder="Sélectionner un surveillant"
                  class="w-full"
                />
              </div>

              <div class="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  @click="closeConfigModal"
                  class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  {{ isUpdating ? "Mettre à jour" : "Enregistrer" }}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import { useRouter } from "vue-router";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useEvaluationStore } from "~~/stores/evaluations";
import { useUserStore } from "~~/stores/user";

const { $toastr, $swal } = useNuxtApp();

const userStore = useUserStore();
const evaluationStore = useEvaluationStore();
const router = useRouter();

const currentUser = useState('user');
const isEtudiant = computed(() =>
  currentUser.value?.roles?.some(r => r.slug === 'etudiant') ?? false
);
const searchQuery = ref("");
const loading = ref(true);
const itemsPerPage = ref(10);
const showConfigModal = ref(false);
const selectedEvaluation = ref(null);
const isUpdating = ref(false);

const configForm = ref({
  surveillant_1_id: "",
  surveillant_2_id: "",
});

// Configuration des colonnes
const columns = ref([
  { field: "matiere.nom", title: "Matière", visible: true },
  { field: "group.nom", title: "Groupe", visible: true },
  { field: "salle.nom", title: "Salle", visible: true },
  { field: "date", title: "Date", visible: true },
  { field: "duration_minutes", title: "Durée", visible: true },
  { field: "status", title: "Statut", visible: true },
  { field: "action", title: "Actions", visible: true },
]);

const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

// Utiliser les données du store
const rows = computed(() => evaluationStore.evaluations || []);

// Filtre de recherche personnalisé
const filteredRows = computed(() => {
  if (!searchQuery.value) return rows.value;

  const query = searchQuery.value.toLowerCase();
  return rows.value.filter(
    (item) =>
      item.type?.toLowerCase().includes(query) ||
      item.matiere?.nom?.toLowerCase().includes(query) ||
      item.group?.nom?.toLowerCase().includes(query) ||
      item.salle?.nom?.toLowerCase().includes(query) ||
      item.status?.toLowerCase().includes(query),
  );
});

const surveillantsOptions = computed(() => {
  return (
    userStore.enseignants?.map((e) => ({
      label: `${e.nom} ${e.prenom} (${e.supervisor_type || "Non défini"})`,
      value: e.slug,
    })) || []
  );
});

// ========== MÉTHODES ==========
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTime = (timeString) => {
  if (!timeString) return "";
  const date = new Date(timeString);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDuration = (minutes) => {
  if (!minutes) return "Non défini";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h${mins > 0 ? mins : ""}` : `${mins}min`;
};

const getStatusClass = (status) => {
  switch (status) {
    case "Terminée":
      return "text-red-600 dark:text-red-400";
    case "En attente":
      return "text-yellow-600 dark:text-yellow-400";
    case "En cours":
      return "text-green-600 dark:text-green-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};



const openConfigModal = (evaluation) => {
  selectedEvaluation.value = evaluation;
  configForm.value = {
    surveillant_1_id: evaluation.surveillant_1_id || "",
    surveillant_2_id: evaluation.surveillant_2_id || "",
  };
  isUpdating.value = false;
  showConfigModal.value = true;
};

const closeConfigModal = () => {
  showConfigModal.value = false;
  selectedEvaluation.value = null;
  configForm.value = {
    surveillant_1_id: "",
    surveillant_2_id: "",
  };
};

const saveConfig = async () => {
  if (!selectedEvaluation.value) return;

  try {
    // Logique de sauvegarde à implémenter
    $toastr.success("Configuration enregistrée avec succès");
    closeConfigModal();
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error);
    $toastr.error("Erreur lors de la sauvegarde");
  }
};

onMounted(async () => {
  try {
    await Promise.all([
      evaluationStore.fetchEvaluationsForTeacher(),
      userStore.fetchUsersSurveillant(),
    ]);
  } catch (error) {
    console.error("Erreur lors du chargement:", error);
    $toastr.error("Erreur lors du chargement des données");
  } finally {
    loading.value = false;
  }
});
</script>