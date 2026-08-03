<template>
  <div class="min-h-screen bg-[#f3f3f8] dark:bg-[#08080f] font-sans transition-colors duration-500 relative">
    <!-- Fond d'ambiance violet -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#7F45FD]/15 dark:bg-[#7F45FD]/25 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
      <div class="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#7F45FD]/15 dark:bg-[#7F45FD]/25 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjN0Y0NUZEIiBmaWxsLW9wYWNpdHk9IjAuMDgiPjxwYXRoIGQ9Ik0zNiAzNHYtNGgxdjRoLTF6bTAgM3YtMWgxdjFoLTF6bTAgNHYtMWgxdjFoLTF6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
    </div>

    <div class="relative z-10 w-full p-4 sm:p-6 lg:p-8">
      <Breadcrumb
        :items="[
          { label: 'Administration', to: '/' },
          { label: 'Évaluations', to: '/evaluations/liste' },
          { label: 'Ajouter une évaluation', to: null },
        ]"
        title="Ajouter une évaluation"
        :title-class="'text-xl md:text-2xl text-gray-800 dark:text-gray-100'"
        :spacing="'mb-2'"
        :link-color="'text-[#7F45FD] dark:text-[#a882ff] hover:text-[#6a35e8] dark:hover:text-[#c4a9ff]'"
        :active-color="'text-gray-900 dark:text-gray-100 font-medium'"
        :text-size="'text-base'"
        align="left"
      />

      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl md:text-3xl font-black text-[#1a1a2a] dark:text-[#fafafe] tracking-tight">
          Ajouter une évaluation
        </h1>
        <NuxtLink
          to="/evaluations/liste"
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-[#11111e] border border-gray-200 dark:border-[#1a1a2a] rounded-xl hover:bg-gray-50 dark:hover:bg-[#1a1a2a] transition-all shadow-sm"
        >
          Retour à la liste
        </NuxtLink>
      </div>

      <!-- loading overlay or skeleton -->
      <div v-if="loading" class="w-full bg-white dark:bg-[#11111e] border border-gray-200 dark:border-[#1a1a2a] rounded-2xl shadow-[0_8px_30px_rgba(127,69,253,0.04)] p-6 md:p-8">
        <div class="animate-pulse space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="i in 8" :key="i" class="space-y-2">
              <div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="h-10 w-full bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
            </div>
          </div>
          <div class="space-y-4">
            <div v-for="i in 2" :key="i" class="h-16 w-full bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700"></div>
          </div>
          <div class="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
            <div class="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div class="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>

      <div v-else class="w-full bg-white dark:bg-[#11111e] border border-gray-200 dark:border-[#1a1a2a] rounded-2xl shadow-[0_8px_30px_rgba(127,69,253,0.04)] p-6 md:p-8">
        <form @submit.prevent="saveEvaluation" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Groupes -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1.5"
                >Groupes *</label
              >
              <Dropdown
                v-model="form.group_id"
                :options="groupesOptions"
                optionLabel="label"
                optionValue="value"
                filter
                showClear
                placeholder="Sélectionner un groupe"
                class="w-full"
              />
            </div>

            <!-- Type d'évaluation -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1.5"
                >Catégorie</label
              >
              <Dropdown
                v-model="form.type"
                :options="typeExamenOptions"
                optionLabel="label"
                optionValue="value"
                filter
                showClear
                placeholder="Sélectionner une catégorie"
                class="w-full"
              />
            </div>

            <!-- Unité de Valeur -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1.5"
                >Unité de Valeur *</label
              >
              <Dropdown
                v-model="form.unite_valeur_id"
                :options="matieresOptions"
                optionLabel="label"
                optionValue="value"
                :loading="loadingMatieres"
                filter
                showClear
                placeholder="Sélectionner une UE"
                class="w-full"
              />
            </div>

            <!-- Salle -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1.5"
                >Salle</label
              >
              <Dropdown
                v-model="form.salle_id"
                :options="salleOptions"
                optionLabel="label"
                optionValue="value"
                filter
                showClear
                placeholder="Sélectionner une salle"
                class="w-full"
              />
            </div>

            <!-- Date de l'évaluation -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1.5"
                >Date de l'évaluation *</label
              >
              <FloatLabel variant="on">
                <DatePicker
                  v-model="form.date"
                  dateFormat="dd/mm/yy"
                  showIcon
                  fluid
                  iconDisplay="input"
                />
                <label class="dark:text-gray-400">Date de l'évaluation *</label>
              </FloatLabel>
            </div>

            <!-- Heure début -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1.5"
                >Heure de début *</label
              >
              <FloatLabel variant="on">
                <input
                  type="time"
                  v-model="form.debut"
                  class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-[#0a0a12] border-gray-300 dark:border-[#1a1a2a] text-[#1a1a2a] dark:text-white focus:ring-2 focus:ring-[#7F45FD]/20 focus:border-[#7F45FD] outline-none transition-all"
                />
              </FloatLabel>
            </div>

            <!-- Heure fin -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1.5"
                >Heure de fin *</label
              >
              <FloatLabel variant="on">
                <input
                  type="time"
                  v-model="form.fin"
                  class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-[#0a0a12] border-gray-300 dark:border-[#1a1a2a] text-[#1a1a2a] dark:text-white focus:ring-2 focus:ring-[#7F45FD]/20 focus:border-[#7F45FD] outline-none transition-all"
                />
              </FloatLabel>
            </div>

            <!-- Date de fin de correction -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1.5"
                >Date de fin de correction *</label
              >
              <FloatLabel variant="on">
                <DatePicker
                  v-model="form.correction_end_date"
                  dateFormat="dd/mm/yy"
                  showIcon
                  fluid
                  iconDisplay="input"
                />
                <label class="dark:text-gray-400">Date de fin de correction</label>
              </FloatLabel>
            </div>

            <!-- Durée -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1.5"
                >Durée (minutes)</label
              >
              <FloatLabel variant="on">
                <InputNumber
                  v-model="form.duration_minutes"
                  :disabled="true"
                  fluid
                />
                <label class="dark:text-gray-400">Durée (minutes)</label>
              </FloatLabel>
            </div>
          </div>

          <div class="space-y-3 mt-4">
            <div
              class="flex items-center gap-3 p-4 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/50"
            >
              <input
                type="checkbox"
                id="is_online"
                v-model="form.is_online"
                @change="confirmIsOnline"
                class="w-5 h-5 text-[#7F45FD] border-gray-300 rounded focus:ring-2 focus:ring-[#7F45FD] cursor-pointer"
              />
              <label
                for="is_online"
                class="text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer flex-1"
                >Évaluation en ligne</label
              >
            </div>

            <div
              class="flex items-center gap-3 p-4 bg-green-50/70 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-900/50"
            >
              <input
                type="checkbox"
                id="published"
                v-model="form.published"
                @change="confirmPublish"
                class="w-5 h-5 text-[#7F45FD] border-gray-300 rounded focus:ring-2 focus:ring-[#7F45FD] cursor-pointer"
              />
              <label
                for="published"
                class="text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer flex-1"
                >Publier la programmation auprès des étudiants concernés</label
              >
            </div>
          </div>

          <div
            class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-[#1a1a2a]"
          >
            <button
              type="button"
              @click="router.push('/evaluations/liste')"
              class="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#1a1a2a] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a2a] transition-all font-semibold text-sm"
              :disabled="isSaving"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-6 py-2.5 rounded-xl bg-[#7F45FD] hover:bg-[#6a35e8] text-white font-semibold text-sm transition-all shadow-md flex items-center gap-2"
              :disabled="isSaving"
            >
              <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useFiliereStore } from "~~/stores/filiere";
import { useGroupeStore } from "~~/stores/group";
// import { useNiveauStore } from "~~/stores/niveau";
import { useEvaluationStore } from "~~/stores/evaluations";
import { useUserStore } from "~~/stores/user";
import { useSalleStore } from "~~/stores/salle";
import { useUvStore } from "~~/stores/unite-valeur";
import { useRouter } from "#imports";

const { $toastr, $swal, $axios } = useNuxtApp();
const filiereStore = useFiliereStore();
// const niveauStore = useNiveauStore();
const userStore = useUserStore();
const uvStore = useUvStore();
const evaluationStore = useEvaluationStore();
const salleStore = useSalleStore();
const groupStore = useGroupeStore();
const router = useRouter();

const loading = ref(true);
const isSaving = ref(false);

const form = ref({
  id: null,
  type: "",
  // niveau_id: null,
  group_id: null,
  unite_valeur_id: null,
  salle_id: null,
  date: null,
  debut: null,
  fin: null,
  duration_minutes: null,
  correction_end_date: null,
  is_online: false,
  published: false,
});

const matieres = ref([]);
const loadingMatieres = ref(false);

// const niveauxOptions = computed(() => niveauStore.niveaux.map(n => ({ label: n.libelle, value: n.id })));
const groupesOptions = computed(() =>
  groupStore.groupes.map((g) => ({
    label: `${g.nom} (${g.niveau?.libelle || "Niveau inconnu"})`,
    value: g.slug,
  })),
);
const salleOptions = computed(() =>
  salleStore.salles.map((s) => ({ label: s.nom, value: s.id })),
);
const typeExamenOptions = computed(() => [
  { label: "Examen", value: "Examen" },
  { label: "Devoir", value: "Devoir" },
]);
const matieresOptions = computed(() =>
  uvStore.uvs.map((m) => ({
    label: `${m.nom} (${m.code || "N/A"})`,
    value: m.slug,
  })),
);

const confirmPublish = async (event) => {
  if (event.target.checked) {
    const res = await $swal.fire({
      title: "Publier l'évaluation ?",
      text: "Cette programmation sera publiée auprès de tous les étudiants concernés. Ils seront notifiés de l'évaluation.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, publier",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#6b7280",
    });

    if (!res.isConfirmed) {
      form.value.published = false;
    }
  }
};

const confirmIsOnline = async (event) => {
  if (event.target.checked) {
    const res = await $swal.fire({
      title: "Évaluation en ligne ?",
      text: "Cette évaluation se déroulera en ligne. Les étudiants y accéderont numériquement.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Oui, en ligne",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#6b7280",
    });

    if (!res.isConfirmed) {
      form.value.is_online = false;
    }
  }
};

const calculateDuration = () => {
  if (form.value.debut && form.value.fin) {
    const [startH, startM] = form.value.debut.split(":").map(Number);
    const [endH, endM] = form.value.fin.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    form.value.duration_minutes = Math.max(0, endMinutes - startMinutes);
  }
};

const getMatiere = async (groupId) => {
  if (!groupId) {
    matieres.value = [];
    return;
  }

  loadingMatieres.value = true;
  try {
    // Find the group by ID to get its slug
    const selectedGroup = groupStore.groupes.find((g) => g.id === groupId);
    if (!selectedGroup || !selectedGroup.slug) {
      console.warn("Groupe non trouvé ou sans slug");
      matieres.value = [];
      return;
    }

    // Use the group's slug to fetch matières
    await groupStore.getMatiere(selectedGroup.slug);
    matieres.value = groupStore.matieres || [];
  } catch (error) {
    console.error("Erreur chargement des matières du groupe:", error);
    matieres.value = [];
    $toastr.error("Erreur lors du chargement des matières");
  } finally {
    loadingMatieres.value = false;
  }
};

watch(
  () => form.value.group_id,
  (newGroupId) => {
    if (newGroupId) getMatiere(newGroupId);
    else matieres.value = [];
  },
);

watch([() => form.value.debut, () => form.value.fin], () =>
  calculateDuration(),
);
const saveEvaluation = async () => {
  if (isSaving.value) return;
  isSaving.value = true;
  try {
    // Validation des champs obligatoires
    if (
      !form.value.type ||
      !form.value.group_id ||
      !form.value.unite_valeur_id ||
      !form.value.salle_id ||
      !form.value.date ||
      !form.value.debut ||
      !form.value.fin
    ) {
      $toastr.error("Veuillez remplir tous les champs obligatoires (*)");
      return;
    }

    // Vérifier que l'heure de fin est après l'heure de début
    if (form.value.fin <= form.value.debut) {
      $toastr.error("L'heure de fin doit être après l'heure de début");
      return;
    }

    // Fonction pour convertir la date au format YYYY-MM-DD
    const formatDateToYMD = (dateInput) => {
      if (!dateInput) return null;

      // Si c'est un objet Date
      if (dateInput instanceof Date) {
        return dateInput.toISOString().split("T")[0]; // YYYY-MM-DD
      }

      // Si c'est une string au format dd/mm/yy
      if (typeof dateInput === "string" && dateInput.includes("/")) {
        const parts = dateInput.split("/");
        if (parts.length === 3) {
          let [day, month, year] = parts;
          // Gérer l'année sur 2 chiffres
          if (year.length === 2) {
            year = "20" + year;
          }
          return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }
      }

      // Si c'est déjà au format YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
        return dateInput;
      }

      // Essayer de parser
      const date = new Date(dateInput);
      if (!isNaN(date)) {
        return date.toISOString().split("T")[0];
      }

      return null;
    };

    // Fonction pour créer un datetime combiné (format: YYYY-MM-DD HH:MM)
    const createDateTime = (dateStr, timeStr) => {
      const date = formatDateToYMD(dateStr);
      if (!date || !timeStr) return null;

      // Normalize time to HH:MM (strip seconds if present)
      let time = timeStr;
      if (typeof time === "string" && time.includes(":")) {
        const parts = time.split(":").map((p) => p.trim());
        const hh = parts[0].padStart(2, "0");
        const mm = (parts[1] || "00").padStart(2, "0");
        time = `${hh}:${mm}`;
      }

      return `${date} ${time}`;
    };

    const payload = {
      type: form.value.type,
      group_id: form.value.group_id,
      unite_valeur_id: form.value.unite_valeur_id,
      salle_id: form.value.salle_id,
      date: formatDateToYMD(form.value.date),
      debut: createDateTime(form.value.date, form.value.debut),
      fin: createDateTime(form.value.date, form.value.fin),

      duration_minutes: form.value.duration_minutes,
      correction_end_date: form.value.correction_end_date
        ? createDateTime(form.value.correction_end_date, "00:00")
        : null,

      is_online: form.value.is_online,
      published: form.value.published,
    };
    if (form.value.id) {
      await evaluationStore.UpdateEvaluation(form.value.id, payload);
      $toastr.success("Évaluation modifiée avec succès");
    } else {
      await evaluationStore.addEvaluation(payload);
      $toastr.success("Évaluation créée avec succès");
    }

    await evaluationStore.fetchEvaluations();
    router.push("/evaluations/liste");
  } catch (error) {
    console.error("Erreur détaillée:", error);
    console.error("Response:", error.response?.data);
    $toastr.error(
      error.response?.data?.message ||
        error.message ||
        "Une erreur est survenue",
    );
  } finally {
    isSaving.value = false;
  }
};

onMounted(async () => {
  try {
    await Promise.all([
      evaluationStore.fetchEvaluations(),
      filiereStore.fetchFilieres(),
      uvStore.fetchUv(),
      // niveauStore.fetchNiveaux(),
      groupStore.fetchGroupes(),
      userStore.fetchUsersSurveillant(),
      salleStore.fetchSalles(),
    ]);
    loading.value = false;
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
    $toastr.error("Erreur lors du chargement des données");
    loading.value = false;
  }
});
</script>

<style scoped>
input[type="file"] {
  display: none;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
.border-dashed:hover {
  animation: pulse 2s infinite;
}
select:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}
.file-item {
  transition: all 0.2s ease;
}
.file-item:hover {
  background-color: #f3f4f6;
}
@media (max-width: 768px) {
  .grid-cols-3 {
    grid-template-columns: 1fr;
  }
}

/* Custom styles pour le mode sombre PrimeVue & Form inputs */
:deep(.p-dropdown),
:deep(.p-datepicker),
:deep(.p-inputnumber-input) {
  border-radius: 0.75rem !important;
}

.dark :deep(.p-dropdown) {
  background-color: #0a0a12 !important;
  border-color: #1a1a2a !important;
  color: #fafafe !important;
}

.dark :deep(.p-dropdown .p-dropdown-label) {
  color: #fafafe !important;
}

.dark :deep(.p-dropdown-panel) {
  background-color: #11111e !important;
  border-color: #1a1a2a !important;
  color: #fafafe !important;
}

.dark :deep(.p-dropdown-items .p-dropdown-item) {
  color: #fafafe !important;
}

.dark :deep(.p-dropdown-items .p-dropdown-item:hover) {
  background-color: rgba(127, 69, 253, 0.15) !important;
}

.dark :deep(.p-datepicker-input),
.dark :deep(.p-inputnumber-input) {
  background-color: #0a0a12 !important;
  border-color: #1a1a2a !important;
  color: #fafafe !important;
}

.dark :deep(.p-float-label label) {
  color: #8a8a9a !important;
}
</style>
