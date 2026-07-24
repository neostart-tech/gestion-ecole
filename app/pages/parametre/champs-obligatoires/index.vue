<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Paramètres', to: '#' },
        { label: 'Champs obligatoires', to: null },
      ]"
      title="Champs obligatoires du formulaire de candidature"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <p class="text-sm text-gray-500 dark:text-gray-400 mb-5 max-w-3xl">
      Activez l'interrupteur pour rendre un champ obligatoire sur les formulaires de dépôt de
      candidature (site public et guichet). Un champ désactivé reste affiché mais optionnel.
    </p>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 mb-5">
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Identifiant de dossier affiché</label>
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
        Quel numéro utiliser pour identifier un dossier dans le back-office (étude de dossier, validation de paiement...).
      </p>
      <select
        v-model="localIdentifiantDossierSource"
        class="w-full max-w-md px-4 py-2 rounded-lg border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
      >
        <option v-for="opt in store.identifiantDossierSourceOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
      <div v-if="store.isLoading && !store.champs.length" class="flex justify-center py-20">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>

      <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
        <div
          v-for="champ in localChamps"
          :key="champ.id"
          class="flex items-center justify-between gap-4 py-3 px-1"
        >
          <div class="flex-1 min-w-0">
            <input
              v-if="estRenommable(champ)"
              v-model="champ.label"
              type="text"
              class="text-sm font-medium text-gray-800 dark:text-gray-200 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none w-full max-w-xs"
            />
            <p v-else class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ champ.label }}</p>
            <p class="text-[11px] text-gray-500 font-mono mt-0.5">Clé : {{ champ.champ_key }}</p>
          </div>

          <div class="flex items-center gap-5 shrink-0">
            <div v-if="estRenommable(champ)" class="flex items-center gap-2">
              <span class="text-xs text-gray-500 dark:text-gray-400">Afficher</span>
              <button
                type="button"
                @click="toggleAfficher(champ)"
                class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none"
                :class="champ.afficher ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'"
              >
                <span
                  class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform"
                  :class="champ.afficher ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500 dark:text-gray-400">Obligatoire</span>
              <button
                type="button"
                :disabled="!champ.afficher"
                @click="champ.obligatoire = !champ.obligatoire"
                class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                :class="champ.obligatoire ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'"
              >
                <span
                  class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform"
                  :class="champ.obligatoire ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>
          </div>
        </div>

        <div v-if="!localChamps.length" class="text-center py-10 text-gray-500 text-sm">
          Aucun champ configurable trouvé.
        </div>
      </div>
    </div>

    <div class="flex justify-end mt-5">
      <Can action="update-candidature-field-config">
        <button
          type="button"
          :disabled="store.isLoading || !isDirty"
          @click="save"
          class="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-md transition-all flex items-center gap-2"
        >
          <span v-if="store.isLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Enregistrer les modifications
        </button>
      </Can>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useCandidatureFieldConfigStore } from "~~/stores/candidatureFieldConfig";

const { $toastr } = useNuxtApp();
const store = useCandidatureFieldConfigStore();

const localChamps = ref([]);
const localIdentifiantDossierSource = ref("code");

// tuteur_nom/tuteur_prenom : toujours affichés (un tuteur sans nom n'a pas de sens) et non
// renommables — ils gardent uniquement l'interrupteur "Obligatoire" existant.
const estRenommable = (champ) => !["tuteur_nom", "tuteur_prenom"].includes(champ.champ_key);

const toggleAfficher = (champ) => {
  champ.afficher = !champ.afficher;
  if (!champ.afficher) champ.obligatoire = false;
};

const syncLocalChamps = () => {
  localChamps.value = store.champs.map((c) => ({ ...c }));
  localIdentifiantDossierSource.value = store.identifiantDossierSource;
};

const isDirty = computed(() => {
  const champDirty = localChamps.value.some((c) => {
    const original = store.champs.find((o) => o.id === c.id);
    if (!original) return false;
    return (
      !!original.obligatoire !== !!c.obligatoire ||
      !!original.afficher !== !!c.afficher ||
      original.label !== c.label
    );
  });
  return champDirty || localIdentifiantDossierSource.value !== store.identifiantDossierSource;
});

const save = async () => {
  try {
    await store.updateChamps(
      localChamps.value.map((c) => ({
        id: c.id,
        obligatoire: c.obligatoire,
        afficher: c.afficher,
        label: c.label,
      })),
      localIdentifiantDossierSource.value
    );
    syncLocalChamps();
    $toastr.success("Configuration mise à jour avec succès");
  } catch (error) {
    $toastr.error(error.response?.data?.message || "Une erreur est survenue");
  }
};

onMounted(async () => {
  await store.fetchChamps();
  syncLocalChamps();
});
</script>
