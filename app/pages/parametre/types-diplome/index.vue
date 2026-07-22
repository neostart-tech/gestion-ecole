<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Paramètres', to: '#' },
        { label: 'Types de diplôme', to: null },
      ]"
      title="Types de diplôme (dernier diplôme obtenu)"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <p class="text-sm text-gray-500 dark:text-gray-400 mb-5 max-w-3xl">
      Gérez la liste des diplômes proposée aux candidats et, pour chacun, quels champs du
      parcours scolaire s'affichent et lesquels sont obligatoires.
    </p>

    <!-- Toolbar -->
    <div class="flex justify-end mb-5">
      <Can action="create-type-diplome">
        <button
          @click="openAddModal"
          class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all shadow-md hover:shadow-lg"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Ajouter un type de diplôme
        </button>
      </Can>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
      <div v-if="typeDiplomeStore.isLoading && !typeDiplomeStore.typesDiplome.length" class="flex justify-center py-20">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="columns"
          :rows="typeDiplomeStore.typesDiplome"
          :per-page="10"
          skin="bh-table-striped bh-table-hover"
          class="w-full"
        >
          <template #nom="{ value }">
            <span class="font-medium text-gray-900 dark:text-white">{{ value.nom }}</span>
          </template>

          <template #champs="{ value }">
            <div v-if="value.champs?.length" class="flex flex-wrap gap-1">
              <span
                v-for="c in value.champs"
                :key="c.id"
                class="text-[10px] uppercase font-bold px-2 py-1 rounded-md"
                :class="c.obligatoire ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400'"
              >
                {{ champsDisponiblesLabels[c.champ_key] || c.champ_key }}
              </span>
            </div>
            <span v-else class="text-xs text-gray-400 italic">Aucun champ configuré</span>
          </template>

          <template #actif="{ value }">
            <Can action="update-type-diplome">
              <button
                @click="toggleActif(value)"
                class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none"
                :class="value.actif ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'"
              >
                <span
                  class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform"
                  :class="value.actif ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </Can>
          </template>

          <template #action="{ value }">
            <div class="flex justify-center gap-2">
              <Can action="update-type-diplome">
                <button
                  @click="openEditModal(value)"
                  class="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                  title="Modifier"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </Can>
              <Can action="delete-type-diplome">
                <button
                  @click="deleteType(value)"
                  class="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Supprimer"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </Can>
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>

    <!-- Modal Ajout/Edition -->
    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeModal">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
              <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl transition-all">
                <DialogTitle class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <div class="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 14l6.16-3.42A12.083 12.083 0 0112 21 12.083 12.083 0 015.84 10.58L12 14z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  {{ form.id ? 'Modifier le type de diplôme' : 'Nouveau type de diplôme' }}
                </DialogTitle>

                <form @submit.prevent="saveType" class="space-y-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Nom du diplôme</label>
                    <input
                      v-model="form.nom"
                      type="text"
                      placeholder="Ex: BAC, Licence, Master, BTS..."
                      required
                      class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Ordre d'affichage</label>
                      <input
                        v-model.number="form.ordre"
                        type="number"
                        placeholder="1"
                        class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                        :class="isOrdreEnDoublon ? 'border-rose-500 ring-1 ring-rose-500' : 'border-gray-300 dark:border-gray-700'"
                      />
                      <p v-if="isOrdreEnDoublon" class="text-[11px] text-rose-600 mt-1 font-medium">
                        Cet ordre est déjà utilisé par un autre type de diplôme.
                      </p>
                    </div>
                    <div class="flex items-end pb-2">
                      <label class="flex items-center gap-2 cursor-pointer group">
                        <input v-model="form.actif" type="checkbox" class="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" />
                        <span class="text-sm text-gray-700 dark:text-gray-300">Actif (proposé aux candidats)</span>
                      </label>
                    </div>
                  </div>

                  <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Champs du parcours scolaire à afficher pour ce diplôme
                    </h3>
                    <div class="space-y-2">
                      <div
                        v-for="(label, key) in typeDiplomeStore.champsDisponibles"
                        :key="key"
                        class="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700"
                      >
                        <label class="flex items-center gap-2 cursor-pointer group flex-1">
                          <input
                            type="checkbox"
                            :checked="isChampAffiche(key)"
                            @change="toggleChampAffiche(key, $event.target.checked)"
                            class="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                          />
                          <span class="text-sm text-gray-700 dark:text-gray-300">{{ label }}</span>
                        </label>
                        <label
                          v-if="isChampAffiche(key)"
                          class="flex items-center gap-2 cursor-pointer group text-xs"
                        >
                          <input
                            type="checkbox"
                            :checked="isChampObligatoire(key)"
                            @change="toggleChampObligatoire(key, $event.target.checked)"
                            class="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                          />
                          <span class="text-rose-600 dark:text-rose-400 font-medium">Obligatoire</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div class="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      @click="closeModal"
                      class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      :disabled="typeDiplomeStore.isLoading || isOrdreEnDoublon"
                      class="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-md transition-all flex items-center gap-2"
                    >
                      <span v-if="typeDiplomeStore.isLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      {{ form.id ? 'Mettre à jour' : 'Enregistrer' }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
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
  TransitionChild,
} from "@headlessui/vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useTypeDiplomeStore } from "~~/stores/typeDiplome";

const { $toastr, $swal } = useNuxtApp();
const typeDiplomeStore = useTypeDiplomeStore();

const showModal = ref(false);

const columns = [
  { field: "nom", title: "Diplôme", sort: true },
  { field: "champs", title: "Champs configurés", sort: false },
  { field: "actif", title: "Actif", sort: true },
  { field: "action", title: "Actions", sort: false, headerClass: "text-center" },
];

const champsDisponiblesLabels = computed(() => typeDiplomeStore.champsDisponibles || {});

const form = ref({
  id: null,
  nom: "",
  actif: true,
  ordre: null,
  champs: [], // [{ champ_key, obligatoire }]
});

const isChampAffiche = (key) => form.value.champs.some((c) => c.champ_key === key);
const isChampObligatoire = (key) =>
  form.value.champs.find((c) => c.champ_key === key)?.obligatoire ?? false;

const toggleChampAffiche = (key, checked) => {
  if (checked) {
    if (!isChampAffiche(key)) {
      form.value.champs.push({ champ_key: key, obligatoire: false });
    }
  } else {
    form.value.champs = form.value.champs.filter((c) => c.champ_key !== key);
  }
};

const toggleChampObligatoire = (key, checked) => {
  const champ = form.value.champs.find((c) => c.champ_key === key);
  if (champ) champ.obligatoire = checked;
};

// Ordre d'affichage : on suggère automatiquement le prochain (dernier ordre + 1),
// et on interdit deux types de diplôme sur le même ordre (doublon de position).
const maxExistingOrdre = computed(() => {
  if (!typeDiplomeStore.typesDiplome.length) return 0;
  return Math.max(...typeDiplomeStore.typesDiplome.map((t) => t.ordre || 0));
});

const nextSuggestedOrdre = computed(() => maxExistingOrdre.value + 1);

const isOrdreEnDoublon = computed(() => {
  if (form.value.ordre === null || form.value.ordre === "") return false;
  return typeDiplomeStore.typesDiplome.some(
    (t) => t.id !== form.value.id && Number(t.ordre) === Number(form.value.ordre)
  );
});

const openAddModal = () => {
  form.value = { id: null, nom: "", actif: true, ordre: nextSuggestedOrdre.value, champs: [] };
  showModal.value = true;
};

const openEditModal = (type) => {
  form.value = {
    id: type.id,
    nom: type.nom,
    actif: !!type.actif,
    ordre: type.ordre,
    champs: (type.champs || []).map((c) => ({ champ_key: c.champ_key, obligatoire: !!c.obligatoire })),
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveType = async () => {
  if (isOrdreEnDoublon.value) {
    $toastr.error("Cet ordre d'affichage est déjà utilisé par un autre type de diplôme.");
    return;
  }

  try {
    const payload = {
      nom: form.value.nom,
      actif: form.value.actif,
      ordre: form.value.ordre,
      champs: form.value.champs,
    };

    if (form.value.id) {
      await typeDiplomeStore.updateTypeDiplome(form.value.id, payload);
      $toastr.success("Type de diplôme modifié avec succès");
    } else {
      await typeDiplomeStore.addTypeDiplome(payload);
      $toastr.success("Type de diplôme créé avec succès");
    }
    await typeDiplomeStore.fetchTypesDiplome();
    closeModal();
  } catch (error) {
    const premiereErreur = Object.values(error.response?.data?.errors || {})[0]?.[0];
    $toastr.error(premiereErreur || error.response?.data?.message || "Une erreur est survenue");
  }
};

const toggleActif = async (type) => {
  try {
    await typeDiplomeStore.updateTypeDiplome(type.id, {
      nom: type.nom,
      actif: !type.actif,
      ordre: type.ordre,
    });
    await typeDiplomeStore.fetchTypesDiplome();
    $toastr.success(`Type de diplôme ${type.actif ? 'désactivé' : 'activé'} avec succès`);
  } catch (error) {
    $toastr.error("Erreur lors de la modification du statut");
  }
};

const deleteType = async (type) => {
  const res = await $swal.fire({
    title: "Supprimer ce type de diplôme ?",
    text: `Voulez-vous vraiment supprimer "${type.nom}" ? Cette action est irréversible.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
    confirmButtonColor: "#ef4444",
  });

  if (res.isConfirmed) {
    try {
      await typeDiplomeStore.deleteTypeDiplome(type.id);
      await typeDiplomeStore.fetchTypesDiplome();
      $toastr.success("Type de diplôme supprimé avec succès");
    } catch (error) {
      $toastr.error(error.response?.data?.message || "Erreur lors de la suppression.");
    }
  }
};

onMounted(async () => {
  await typeDiplomeStore.fetchChampsDisponibles();
  await typeDiplomeStore.fetchTypesDiplome();
});
</script>

<style scoped>
.bh-table-striped .bh-table-row:nth-child(even) {
  background-color: rgba(249, 250, 251, 0.5);
}
.dark .bh-table-striped .bh-table-row:nth-child(even) {
  background-color: rgba(31, 41, 55, 0.3);
}
</style>
