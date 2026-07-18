<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Bourses', to: '/' },
        { label: 'Liste', to: null },
      ]"
      title="Gestion des bourses"
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
        placeholder="Rechercher..."
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
        <button
          @click="openAddModal"
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
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-3 sm:p-4">
      <div v-if="bourseStore.isLoading" class="flex justify-center py-10">
        <div
          class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"
        ></div>
      </div>

      <div v-else class="overflow-x-auto text-gray-900 dark:text-gray-100">
        <Vue3Datatable
          :columns="visibleColumns"
          :rows="rows"
          :search="searchQuery"
          :per-page="itemsPerPage"
          skin="bh-table-striped bh-table-hover"
        >
          <!-- Type de bourse avec badge -->
          <template #type="data">
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                data.value.type === 'pourcentage'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
              ]"
            >
              {{  data.value.type === "pourcentage" ? "Pourcentage" : "Montant fixe" }}
            </span>
          </template>

          <!-- Valeur formatée -->
          <template #valeur="data">
            <span v-if="data.value && data.value.type === 'pourcentage'">{{ data.value.valeur }}%</span>
            <span v-else>{{ formatMontant(data.value.valeur) }}</span>
          </template>

          <!-- Nombre d'étudiants -->
          <template #nb_etudiants="data">
            <span
              class="px-2 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full text-xs font-medium"
            >
              {{ data.value.nb_etudiants }} étudiant{{ data.value.nb_etudiants > 1 ? "s" : "" }}
            </span>
          </template>

          <!-- Actions avec boutons directs -->
          <template #action="{ value }">
            <div class="flex justify-center gap-2">
              <!-- Voir détails -->
              <!-- <button
                @click="voirDetails(value)"
                class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                title="Voir détails"
              >
                <svg
                  class="w-5 h-5"
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
              </button> -->

              <!-- Modifier -->
              <button
                @click="openEditModal(value)"
                class="p-2 rounded-lg text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
                title="Modifier"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>

              <!-- Gérer les étudiants -->
              <!-- <button
                @click="gererEtudiants(value)"
                class="p-2 rounded-lg text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200"
                title="Gérer les étudiants"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </button> -->

              <!-- Affecter -->
              <NuxtLink
                :to="`/bourses/${value.id}/etudiants`"
                class="p-2 rounded-lg text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors duration-200"
                title="Affecter à un étudiant"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </NuxtLink>

              <!-- Supprimer -->
              <button
                @click="deleteBourse(value.id)"
                class="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
                title="Supprimer"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>

    <!-- Modale d'ajout/édition de bourse -->
    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeModal">
        <div class="fixed inset-0 bg-black/60" />

        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            class="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-5"
          >
            <DialogTitle
              class="text-lg font-semibold mb-4 text-gray-900 dark:text-white"
            >
              {{ modalTitle }}
            </DialogTitle>

            <form @submit.prevent="saveBourse" class="space-y-4">
              <FloatLabel variant="on">
                <InputText
                  id="nom"
                  v-model="form.nom"
                  class="w-full"
                  :class="{ 'p-invalid': errors.nom }"
                />
                <label for="nom">Nom de la bourse</label>
                <small v-if="errors.nom" class="text-red-500">{{
                  errors.nom
                }}</small>
              </FloatLabel>

              <FloatLabel variant="on">
                <Dropdown
                  v-model="form.type"
                  :options="typeOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder=""
                  class="w-full"
                  :class="{ 'p-invalid': errors.type }"
                />
                <label for="type">Type de bourse</label>
                <small v-if="errors.type" class="text-red-500">{{
                  errors.type
                }}</small>
              </FloatLabel>

              <FloatLabel variant="on">
                <InputNumber
                  v-model="form.valeur"
                  inputId="integeronly"
                  fluid
                  :min="0"
                  :max="form.type === 'pourcentage' ? 100 : null"
                  :suffix="form.type === 'pourcentage' ? '%' : ' FCFA'"
                  :class="{ 'p-invalid': errors.valeur }"
                />
                <label for="valeur">Valeur</label>
                <small v-if="errors.valeur" class="text-red-500">{{
                  errors.valeur
                }}</small>
              </FloatLabel>

              <FloatLabel variant="on">
                <Textarea
                  id="description"
                  v-model="form.description"
                  rows="4"
                  cols="30"
                  class="w-full"
                  style="resize: none"
                />
                <label for="description">Description (optionnelle)</label>
              </FloatLabel>

              <div class="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  :disabled="bourseStore.isLoading"
                >
                  {{
                    bourseStore.isLoading ? "Enregistrement..." : "Enregistrer"
                  }}
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
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
} from "@headlessui/vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useBourseStore } from "~~/stores/bourse";


// IMPORTS PRIMEVUE
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import FloatLabel from "primevue/floatlabel";

const { $toastr, $swal } = useNuxtApp();

const bourseStore = useBourseStore();

const searchQuery = ref("");
const showModal = ref(false);
const modalTitle = ref("");
const itemsPerPage = ref(10);
const selectedBourse = ref(null);

const form = ref({
  id: null,
  nom: "",
  type: "montant_fixe",
  valeur: null,
  description: "",
});

const errors = ref({});

const typeOptions = [
  { label: "Montant fixe", value: "montant_fixe" },
  { label: "Pourcentage", value: "pourcentage" },
];

const columns = ref([
  { field: "nom", title: "Nom", visible: true },
  { field: "type", title: "Type", visible: true },
  { field: "valeur", title: "Valeur", visible: true },
  { field: "description", title: "Description", visible: false },
  { field: "nb_etudiants", title: "Étudiants", visible: true },
  { field: "action", title: "Actions", visible: true },
]);

const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

const rows = computed(() =>
  bourseStore.bourses.map((b) => ({
    id: b.slug,
    nom: b.nom || "--",
    type: b.type,
    valeur: b.valeur,
    description: b.description || "--",
    nb_etudiants: b.etudiants?.length || 0,
    etudiants: b.etudiants || [],
  })),
);

// Fonctions
const formatMontant = (valeur) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valeur);
};

const openAddModal = () => {
  modalTitle.value = "Ajouter une bourse";
  form.value = {
    id: null,
    nom: "",
    type: "montant_fixe",
    valeur: null,
    description: "",
  };
  errors.value = {};
  showModal.value = true;
};

const openEditModal = (bourse) => {
  console.log("Édition de:", bourse);
  modalTitle.value = "Modifier la bourse";
  form.value = {
    id: bourse.id,
    nom: bourse.nom,
    type: bourse.type,
    valeur: bourse.valeur,
    description: bourse.description || "",
  };
  errors.value = {};
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  form.value = {
    id: null,
    nom: "",
    type: "montant_fixe",
    valeur: null,
    description: "",
  };
  errors.value = {};
};

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!form.value.nom || form.value.nom.trim() === "") {
    errors.value.nom = "Le nom est requis";
    isValid = false;
  }

  if (!form.value.type) {
    errors.value.type = "Le type est requis";
    isValid = false;
  }

  if (form.value.valeur === null || form.value.valeur === undefined) {
    errors.value.valeur = "La valeur est requise";
    isValid = false;
  } else if (form.value.type === "pourcentage" && form.value.valeur > 100) {
    errors.value.valeur = "Le pourcentage ne peut pas dépasser 100%";
    isValid = false;
  } else if (form.value.type === "pourcentage" && form.value.valeur < 0) {
    errors.value.valeur = "Le pourcentage doit être positif";
    isValid = false;
  } else if (form.value.type === "montant_fixe" && form.value.valeur < 0) {
    errors.value.valeur = "Le montant doit être positif";
    isValid = false;
  }

  return isValid;
};

const saveBourse = async () => {
  if (!validateForm()) return;

  try {
    if (form.value.id) {
      await bourseStore.updateBourse(form.value.id, form.value);
      $toastr.success("Bourse modifiée avec succès");
    } else {
      await bourseStore.createBourse(form.value);
      $toastr.success("Bourse créée avec succès");
    }
    await bourseStore.fetchBourses();
    closeModal();
  } catch (error) {
    console.log(error);
    $toastr.error(error.response?.data?.message || "Une erreur est survenue");
  }
};

const deleteBourse = async (id) => {
  const result = await $swal.fire({
    title: "Voulez-vous supprimer cette bourse ?",
    text: "Cette action est irréversible",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
    confirmButtonColor: "#dc2626",
  });

  if (result.isConfirmed) {
    try {
      await bourseStore.deleteBourse(id);
      await bourseStore.fetchBourses();
      $toastr.success("Bourse supprimée avec succès");
    } catch (error) {
      console.log(error);
      $toastr.error(error.response?.data?.message || "Une erreur est survenue");
    }
  }
};

// Nouvelles fonctions pour les actions
const voirDetails = (bourse) => {
  console.log("Voir détails:", bourse);
  // navigateTo(`/bourses/${bourse.id}/voir-detail`);
  $toastr.info("Page de détails à venir");
};

const gererEtudiants = (bourse) => {
  console.log("Gérer étudiants:", bourse);
  // navigateTo(`/bourses/${bourse.id}/etudiants`);
  $toastr.info("Gestion des étudiants à venir");
};

const affecterBourse = (bourse) => {
  console.log("Affecter:", bourse);
  // navigateTo(`/bourses/affecter?bourse_id=${bourse.id}`);
  $toastr.info("Page d'affectation à venir");
};

onMounted(async () => {
  try {
    await bourseStore.fetchBourses();
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
    $toastr.error("Erreur lors du chargement des données");
  }
});
</script>

<style scoped>
/* La librairie Vue3Datatable fixe elle-même une couleur de texte
   quasi-noire (.bh-text-black) sur la racine du tableau, qui prime
   sur toute couleur héritée d'un parent : on la surcharge ici pour
   le mode sombre. */
:deep(.bh-text-black) {
  color: #111827;
}
:global(.dark) :deep(.bh-text-black) {
  color: #f3f4f6 !important;
}
</style>

