<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Paramètres', to: '#' },
        { label: 'Moyens de connaissance', to: null },
      ]"
      title="Moyens de connaissance de l'établissement"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <p class="text-sm text-gray-500 dark:text-gray-400 mb-5 max-w-3xl">
      Gérez la liste des options proposées au candidat pour répondre à "Comment avez-vous connu
      notre établissement ?". Cette question est activée dans
      <span class="font-medium">Paramètres &gt; Champs obligatoires</span>.
    </p>

    <!-- Toolbar -->
    <div class="flex justify-end mb-5">
      <Can action="create-moyen-connaissance">
        <button
          @click="openAddModal"
          class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all shadow-md hover:shadow-lg"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Ajouter un moyen de connaissance
        </button>
      </Can>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
      <div v-if="store.isLoading && !store.moyensConnaissance.length" class="flex justify-center py-20">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="columns"
          :rows="store.moyensConnaissance"
          :per-page="10"
          skin="bh-table-striped bh-table-hover"
          class="w-full"
        >
          <template #libelle="{ value }">
            <span class="font-medium text-gray-900 dark:text-white">{{ value.libelle }}</span>
          </template>

          <template #actif="{ value }">
            <Can action="update-moyen-connaissance">
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
              <Can action="update-moyen-connaissance">
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
              <Can action="delete-moyen-connaissance">
                <button
                  @click="deleteMoyen(value)"
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
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl transition-all">
                <DialogTitle class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <div class="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  {{ form.id ? 'Modifier le moyen de connaissance' : 'Nouveau moyen de connaissance' }}
                </DialogTitle>

                <form @submit.prevent="saveMoyen" class="space-y-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Libellé</label>
                    <input
                      v-model="form.libelle"
                      type="text"
                      placeholder="Ex: Réseaux sociaux, Bouche à oreille, Site web..."
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
                        Cet ordre est déjà utilisé par un autre moyen de connaissance.
                      </p>
                    </div>
                    <div class="flex items-end pb-2">
                      <label class="flex items-center gap-2 cursor-pointer group">
                        <input v-model="form.actif" type="checkbox" class="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" />
                        <span class="text-sm text-gray-700 dark:text-gray-300">Actif (proposé aux candidats)</span>
                      </label>
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
                      :disabled="store.isLoading || isOrdreEnDoublon"
                      class="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-md transition-all flex items-center gap-2"
                    >
                      <span v-if="store.isLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
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
import { useMoyenConnaissanceStore } from "~~/stores/moyenConnaissance";
import { useAccess } from "~/composables/useAccess";

const { $toastr, $swal } = useNuxtApp();
const store = useMoyenConnaissanceStore();
const { can } = useAccess();

const showModal = ref(false);

// Une colonne dont toutes les actions sont masquées (permission manquante) ne
// doit pas non plus afficher son en-tête — sinon la colonne reste vide et vide
// de sens à l'écran.
const columns = computed(() => {
  const cols = [{ field: "libelle", title: "Libellé", sort: true }];
  if (can("update-moyen-connaissance")) {
    cols.push({ field: "actif", title: "Actif", sort: true });
  }
  if (can("update-moyen-connaissance") || can("delete-moyen-connaissance")) {
    cols.push({ field: "action", title: "Actions", sort: false, headerClass: "text-center" });
  }
  return cols;
});

const form = ref({
  id: null,
  libelle: "",
  actif: true,
  ordre: null,
});

const maxExistingOrdre = computed(() => {
  if (!store.moyensConnaissance.length) return 0;
  return Math.max(...store.moyensConnaissance.map((t) => t.ordre || 0));
});

const nextSuggestedOrdre = computed(() => maxExistingOrdre.value + 1);

const isOrdreEnDoublon = computed(() => {
  if (form.value.ordre === null || form.value.ordre === "") return false;
  return store.moyensConnaissance.some(
    (t) => t.id !== form.value.id && Number(t.ordre) === Number(form.value.ordre)
  );
});

const openAddModal = () => {
  form.value = { id: null, libelle: "", actif: true, ordre: nextSuggestedOrdre.value };
  showModal.value = true;
};

const openEditModal = (moyen) => {
  form.value = {
    id: moyen.id,
    libelle: moyen.libelle,
    actif: !!moyen.actif,
    ordre: moyen.ordre,
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveMoyen = async () => {
  if (isOrdreEnDoublon.value) {
    $toastr.error("Cet ordre d'affichage est déjà utilisé par un autre moyen de connaissance.");
    return;
  }

  try {
    const payload = {
      libelle: form.value.libelle,
      actif: form.value.actif,
      ordre: form.value.ordre,
    };

    if (form.value.id) {
      await store.updateMoyenConnaissance(form.value.id, payload);
      $toastr.success("Moyen de connaissance modifié avec succès");
    } else {
      await store.addMoyenConnaissance(payload);
      $toastr.success("Moyen de connaissance créé avec succès");
    }
    await store.fetchMoyensConnaissance();
    closeModal();
  } catch (error) {
    const premiereErreur = Object.values(error.response?.data?.errors || {})[0]?.[0];
    $toastr.error(premiereErreur || error.response?.data?.message || "Une erreur est survenue");
  }
};

const toggleActif = async (moyen) => {
  try {
    await store.updateMoyenConnaissance(moyen.id, {
      libelle: moyen.libelle,
      actif: !moyen.actif,
      ordre: moyen.ordre,
    });
    await store.fetchMoyensConnaissance();
    $toastr.success(`Moyen de connaissance ${moyen.actif ? 'désactivé' : 'activé'} avec succès`);
  } catch (error) {
    $toastr.error("Erreur lors de la modification du statut");
  }
};

const deleteMoyen = async (moyen) => {
  const res = await $swal.fire({
    title: "Supprimer ce moyen de connaissance ?",
    text: `Voulez-vous vraiment supprimer "${moyen.libelle}" ? Cette action est irréversible.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
    confirmButtonColor: "#ef4444",
  });

  if (res.isConfirmed) {
    try {
      await store.deleteMoyenConnaissance(moyen.id);
      await store.fetchMoyensConnaissance();
      $toastr.success("Moyen de connaissance supprimé avec succès");
    } catch (error) {
      $toastr.error(error.response?.data?.message || "Erreur lors de la suppression.");
    }
  }
};

onMounted(async () => {
  await store.fetchMoyensConnaissance();
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
