<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <NuxtLink
        to="/"
        class="cursor-pointer hover:text-indigo-600 transition-colors"
        >Accueil</NuxtLink
      >
      <span>/</span>
      <NuxtLink
        to="/evaluations"
        class="cursor-pointer hover:text-indigo-600 transition-colors"
        >Évaluations</NuxtLink
      >
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default"
        >Ajouter une évaluation</span
      >
    </div>

    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-900">
        Ajouter une évaluation
      </h1>
      <NuxtLink
        to="/evaluations/liste"
        class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Retour à la liste
      </NuxtLink>
    </div>

    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
      <div v-if="!loading">
        <form @submit.prevent="saveEvaluation" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Niveau -->
            <!-- <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Niveau</label>
            <Dropdown
              v-model="form.niveau_id"
              :options="niveauxOptions"
              optionLabel="label"
              optionValue="value"
              filter
              showClear
              placeholder="Sélectionner un niveau"
              class="w-full"
            />
          </div> -->

            <!-- Groupes -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
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
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
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
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
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

            <!-- Filières ciblées (Si le groupe contient plusieurs filières) -->
            <div
              v-if="availableFilieresForGroup.length > 1"
              class="md:col-span-2 p-4 sm:p-5 rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/70 via-slate-50/40 to-blue-50/30 dark:from-blue-950/20 dark:via-gray-900/30 dark:to-blue-950/10 space-y-3.5 shadow-2xs"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-blue-100/80 dark:border-blue-900/40">
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-blue-600 text-white shadow-xs shrink-0">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </span>
                    <label class="text-sm font-bold text-gray-900 dark:text-gray-100">
                      Filières ciblées par cette évaluation <span class="text-red-500">*</span>
                    </label>
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      {{ (form.filiere_ids || []).length }}/{{ availableFilieresForGroup.length }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Ce groupe comprend plusieurs filières. Sélectionnez uniquement celles concernées.
                  </p>
                </div>

                <!-- Boutons d'action modernes Tout cocher / Tout décocher -->
                <div class="inline-flex items-center p-0.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shrink-0 self-start sm:self-center shadow-xs">
                  <button
                    type="button"
                    @click="selectAllFilieres"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors whitespace-nowrap active:scale-95"
                    title="Sélectionner toutes les filières"
                  >
                    <svg class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Tout cocher</span>
                  </button>
                  <span class="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-0.5"></span>
                  <button
                    type="button"
                    @click="deselectAllFilieres"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700/60 dark:hover:text-gray-200 transition-colors whitespace-nowrap active:scale-95"
                    title="Désélectionner toutes les filières"
                  >
                    <svg class="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Tout décocher</span>
                  </button>
                </div>
              </div>

              <!-- Cartes des filières -->
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                <label
                  v-for="fil in availableFilieresForGroup"
                  :key="fil.id"
                  class="group relative flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none"
                  :class="(form.filiere_ids || []).includes(fil.id)
                    ? 'border-blue-500 bg-white dark:bg-gray-800/90 shadow-xs ring-1 ring-blue-500/20 text-blue-950 dark:text-blue-100'
                    : 'border-gray-200 dark:border-gray-700/80 bg-white/70 dark:bg-gray-800/30 text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-white dark:hover:bg-gray-800/60'"
                >
                  <input
                    type="checkbox"
                    :value="fil.id"
                    v-model="form.filiere_ids"
                    class="w-4 h-4 rounded text-blue-600 border-gray-300 dark:border-gray-600 focus:ring-blue-500 cursor-pointer shrink-0"
                  />
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-bold truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {{ fil.nom }}
                    </p>
                    <p v-if="fil.code" class="text-[10px] text-gray-400 dark:text-gray-500 font-mono tracking-wide mt-0.5">
                      {{ fil.code }}
                    </p>
                  </div>
                </label>
              </div>

              <!-- Message d'état -->
              <div class="pt-0.5 flex items-center justify-between text-xs">
                <p v-if="!form.filiere_ids || form.filiere_ids.length === 0" class="text-xs text-red-500 font-bold flex items-center gap-1.5">
                  <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Veuillez sélectionner au moins une filière pour cette évaluation.
                </p>
                <p v-else class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  Seuls les étudiants de ces filières verront cette évaluation et recevront la notification.
                </p>
              </div>
            </div>

            <!-- Salle -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
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
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
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
                <label>Date de l'évaluation *</label>
              </FloatLabel>
            </div>

            <!-- Heure début -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Heure de début *</label
              >
              <FloatLabel variant="on">
                <input
                  type="time"
                  v-model="form.debut"
                  class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                />
              </FloatLabel>
            </div>

            <!-- Heure fin -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Heure de fin *</label
              >
              <FloatLabel variant="on">
                <input
                  type="time"
                  v-model="form.fin"
                  class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                />
              </FloatLabel>
            </div>

            <!-- Date de fin de correction -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Date de fin de correction*</label
              >

              <FloatLabel variant="on">
                <DatePicker
                  v-model="form.correction_end_date"
                  dateFormat="dd/mm/yy"
                  showIcon
                  fluid
                  iconDisplay="input"
                />
                <label>Date de fin de correction</label>
              </FloatLabel>
            </div>

            <!-- Durée -->
            <div>
              <FloatLabel variant="on">
                <InputNumber
                  v-model="form.duration_minutes"
                  :disabled="true"
                  fluid
                />
                <label>Durée (minutes)</label>
              </FloatLabel>
            </div>
          </div>

          <div class="space-y-3 mt-4">
            <div
              class="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
            >
              <input
                type="checkbox"
                id="is_online"
                v-model="form.is_online"
                @change="confirmIsOnline"
                class="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              />
              <label
                for="is_online"
                class="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer flex-1"
                >Évaluation en ligne</label
              >
            </div>

            <div
              class="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
            >
              <input
                type="checkbox"
                id="published"
                v-model="form.published"
                @change="confirmPublish"
                class="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              />
              <label
                for="published"
                class="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer flex-1"
                >Publier la programmation auprès des étudiants concernés</label
              >
            </div>
          </div>

          <div
            class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <button
              type="button"
              @click="router.push('/evaluations')"
              class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
      <div v-else class="py-10 text-center">
        <svg
          class="mx-auto h-10 w-10 text-indigo-500 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <p class="mt-3 text-gray-600">
          Récupération des données, veuillez patienter...
        </p>
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
import { useRoute } from "vue-router";

const { $toastr, $swal, $axios } = useNuxtApp();
const route = useRoute();
const filiereStore = useFiliereStore();
// const niveauStore = useNiveauStore();
const userStore = useUserStore();
const uvStore = useUvStore();
const evaluationStore = useEvaluationStore();
const salleStore = useSalleStore();
const groupStore = useGroupeStore();
const router = useRouter();
const evaluationSlug = ref(route.params.slug);

const loading = ref(true);

// Helper to convert ISO datetime to Date object (for DatePicker)
const extractDateObj = (isoString) => {
  if (!isoString) return null;
  const d = new Date(isoString);
  return isNaN(d) ? null : d;
};

// Helper to extract time from ISO datetime (HH:MM format)
const extractTime = (isoString) => {
  if (!isoString) return null;
  const date = new Date(isoString);
  if (isNaN(date)) return null;
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

const form = ref({
  id: evaluationStore.evaluation?.id || null,
  type: evaluationStore.evaluation?.type || null,
  // niveau_id: null,
  group_id: evaluationStore.evaluation?.group?.slug || null,
  unite_valeur_id: evaluationStore.evaluation?.matiere?.slug || null,
  salle_id: evaluationStore.evaluation?.salle?.id || null,
  date: extractDateObj(evaluationStore.evaluation?.date),
  debut: extractTime(evaluationStore.evaluation?.debut),
  fin: extractTime(evaluationStore.evaluation?.fin),
  duration_minutes: evaluationStore.evaluation?.duration_minutes || null,
  correction_end_date: extractDateObj(
    evaluationStore.evaluation?.correction_end_date,
  ),
  is_online: Boolean(evaluationStore.evaluation?.is_online),
  published: Boolean(evaluationStore.evaluation?.published),
});

const matieres = ref([]);
const loadingMatieres = ref(false);

// Filières disponibles pour le groupe sélectionné
const availableFilieresForGroup = computed(() => {
  if (!form.value.group_id) return [];
  const grp = groupStore.groupes.find(
    (g) => g.id === form.value.group_id || g.slug === form.value.group_id
  );
  return grp?.filieres || [];
});

const selectAllFilieres = () => {
  form.value.filiere_ids = availableFilieresForGroup.value.map((f) => f.id);
};

const deselectAllFilieres = () => {
  form.value.filiere_ids = [];
};

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

watch([() => form.value.debut, () => form.value.fin], () =>
  calculateDuration(),
);
const saveEvaluation = async () => {
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
      await evaluationStore.UpdateEvaluation(payload,evaluationSlug.value,);
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
  }
};

onMounted(async () => {
  try {
    await Promise.all([
      evaluationStore.fetchEvaluations(),
      filiereStore.fetchFilieres(),
      uvStore.fetchUv(),
      evaluationStore.checkEvaluation(evaluationSlug.value),
      groupStore.fetchGroupes(),
      userStore.fetchUsersSurveillant(),
      salleStore.fetchSalles(),
    ]);

    // Update form with fetched evaluation data after stores are populated
    if (evaluationStore.evaluation) {
      const evaluationData = evaluationStore.evaluation;
      form.value = {
        id: evaluationData.id || null,
        type: evaluationData.type || null,
        group_id: evaluationData.group?.slug || null,
        unite_valeur_id: evaluationData.matiere?.slug || null,
        salle_id: evaluationData.salle?.id || null,
        date: extractDateObj(evaluationData.date),
        debut: extractTime(evaluationData.debut),
        fin: extractTime(evaluationData.fin),
        duration_minutes: evaluationData.duration_minutes || null,
        correction_end_date: extractDateObj(evaluationData.correction_end_date),
        is_online: Boolean(evaluationData.is_online),
        published: Boolean(evaluationData.published),
      };
    }

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
</style>
