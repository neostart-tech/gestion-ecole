<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-300"
  >
    <!-- Container principal qui prend toute la page -->
    <div class="h-full flex flex-col">
      <!-- Header avec breadcrumb et titre -->
      <div class="mb-6">
        <Breadcrumb
          :items="[
            { label: 'Filieres', to: '/' },
            { label: 'Ajouter une unité d\'enseignement', to: null },
          ]"
          title="Ajouter une unité d\'enseignement"
          :title-class="'text-xl md:text-2xl text-gray-800 dark:text-white'"
          :spacing="'mb-2'"
          :link-color="'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'"
          :active-color="'text-gray-900 dark:text-gray-200 font-medium'"
          :text-size="'text-base'"
          align="left"
        />

        <!-- Bouton retour -->
        <div class="mt-4">
          <NuxtLink
            to="/ues/liste"
            class="inline-flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Retour à la liste
          </NuxtLink>
        </div>
      </div>

      <!-- Formulaire qui prend le reste de l'espace -->
      <div class="flex-1">
        <div class="h-full">
          <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 h-full p-6 md:p-8 transition-colors duration-300"
          >
            <form
              v-if="!ueStore.isLoading"
              @submit.prevent="submitForm"
              class="h-full flex flex-col"
            >
              <!-- Contenu du formulaire avec scroll si nécessaire -->
              <div class="flex-1 overflow-y-auto pr-2 -mr-2">
                <div class="space-y-6">
                  <!-- Nom de la filière -->
                  <div>
                    <label
                      for="nom"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Nom de l'unité d'enseignement
                      <span class="text-rose-500 dark:text-rose-400">*</span>
                    </label>
                    <input
                      id="nom"
                      v-model="form.nom"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Nom de l'unité enseignement"
                    />
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Ex: Mathématique
                    </p>
                  </div>

                  <!-- Code de la filière -->
                  <div>
                    <label
                      for="code"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Code de l'unité d'enseignement
                      <span class="text-rose-500 dark:text-rose-400">*</span>
                    </label>
                    <input
                      id="code"
                      v-model="form.code"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white uppercase transition-all placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Code de l'unité d'enseignement"
                      maxlength="10"
                    />
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Ex: MATH
                    </p>
                  </div>
                  <div>
                    <label
                      for="code"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Période
                      <span class="text-rose-500 dark:text-rose-400">*</span>
                    </label>
                    <Dropdown
                      v-model="form.periode_id"
                      :options="PeriodesOptions"
                      optionLabel="label"
                      optionValue="value"
                      filter
                      showClear
                      placeholder="Sélectionner une période"
                      class="w-full"
                    />
                  </div>
                  <div>
                    <label
                      for="code"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Filiere
                      <span class="text-rose-500 dark:text-rose-400">*</span>
                    </label>
                    <Dropdown
                      v-model="form.filiere_id"
                      :options="filieresOptions"
                      optionLabel="label"
                      optionValue="value"
                      filter
                      showClear
                      placeholder="Sélectionner une filière"
                      class="w-full"
                    />
                  </div>
                  <div>
                    <label
                      for="credit"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Crédit
                      <span class="text-rose-500 dark:text-rose-400">*</span>
                    </label>
                    <input
                      id="credit"
                      v-model="form.credit"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Nombre de crédit"
                    />
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Ex: 3
                    </p>
                  </div>
                </div>
              </div>

              <!-- Boutons d'action - Toujours visible en bas -->
              <div
                class="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700"
              >
                <div class="flex flex-col sm:flex-row justify-end gap-3">
                  <NuxtLink
                    to="/filieres"
                    class="px-6 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-center"
                  >
                    Annuler
                  </NuxtLink>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-center"
                  >
                    <span
                      v-if="loading"
                      class="flex items-center justify-center gap-2"
                    >
                      <svg
                        class="animate-spin h-5 w-5 text-white"
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Enregistrement...
                    </span>
                    <span v-else> Soumettre </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useFiliereStore } from "~~/stores/filiere";
import { usePeriodeStore } from "~~/stores/periode";
import { useUeStore } from "~~/stores/unite-enseignement";
import { useRouter } from "vue-router";

const filiereStore = useFiliereStore();
const periodeStore = usePeriodeStore();
const ueStore = useUeStore();
const loading = ref(false);
const route = useRoute();
const id = ref("");
id.value = route.params.id;

const { $toastr } = useNuxtApp();

const form = ref({
  nom: "",
  code: "",
  periode_id: "",
  filiere_id: "",
  credit: "",
});

const submitForm = async () => {
  try {
    await ueStore.updateUe(id.value, form.value);
    navigateTo("/ues/liste");
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await ueStore.getUe(id.value);
  await filiereStore.fetchFilieres();
  await periodeStore.fetchPeriodeByYear();
  form.value = {
    nom: ueStore.ue.nom ?? "",
    code: ueStore.ue.code ?? "",
    periode_id: ueStore.ue.periode?.id ?? null,
    filiere_id: ueStore.ue.filiere?.id ?? null,
    credit: ueStore.ue.credit ?? "",
  };

  $toastr.success("Données chargées avec succes");
});

const filieresOptions = computed(() =>
  filiereStore.filieres.map((f) => ({
    label: f.nom,
    value: f.id,
  })),
);

const PeriodesOptions = computed(() =>
  periodeStore.periode.map((p) => ({
    label: p.nom,
    value: p.id,
  })),
);

definePageMeta(()=>({
  middleware:'auth'
}))

</script>
