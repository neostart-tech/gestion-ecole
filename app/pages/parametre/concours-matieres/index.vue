<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <Breadcrumb
      :items="[
        { label: 'Paramètres', to: '#' },
        { label: 'Matières du concours', to: null },
      ]"
      title="Catalogue des matières du concours"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <div class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5">
      <p class="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
        Ce catalogue est réutilisable d'une session de concours à l'autre. Associez ensuite chaque matière à une
        session avec un coefficient depuis la page « Sessions de concours ».
      </p>
      <button
        @click="openAddModal"
        class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round" />
        </svg>
        Ajouter une matière
      </button>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
      <div v-if="matiereStore.isLoading && !matiereStore.matieres.length" class="flex justify-center py-20">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>

      <div v-else-if="!matiereStore.matieres.length" class="text-center py-16 text-gray-500 dark:text-gray-400">
        Aucune matière n'a encore été créée.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              <th class="py-3 px-3">Matière</th>
              <th class="py-3 px-3">Code</th>
              <th class="py-3 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
            <tr v-for="matiere in matiereStore.matieres" :key="matiere.id" class="hover:bg-gray-50 dark:hover:bg-gray-900/40">
              <td class="py-3 px-3 font-medium text-gray-900 dark:text-white">{{ matiere.nom }}</td>
              <td class="py-3 px-3 text-gray-600 dark:text-gray-300">{{ matiere.code || '—' }}</td>
              <td class="py-3 px-3">
                <div class="flex justify-center gap-2">
                  <button @click="openEditModal(matiere)" class="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors" title="Modifier">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                  <button @click="deleteMatiere(matiere)" class="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors" title="Supprimer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeModal">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl transition-all">
                <DialogTitle class="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {{ form.id ? 'Modifier la matière' : 'Nouvelle matière' }}
                </DialogTitle>

                <form @submit.prevent="saveMatiere" class="space-y-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Nom de la matière</label>
                    <input v-model="form.nom" type="text" required placeholder="Ex: Mathématiques" class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Code (généré automatiquement)</label>
                    <input
                      v-model="form.code"
                      type="text"
                      readonly
                      placeholder="Généré à partir du nom..."
                      class="w-full px-4 py-2 rounded-lg border bg-gray-100 dark:bg-gray-900/60 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed font-mono"
                    />
                  </div>

                  <div class="flex justify-end gap-3 mt-6">
                    <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700">
                      Annuler
                    </button>
                    <button type="submit" :disabled="matiereStore.isLoading" class="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md flex items-center gap-2">
                      <span v-if="matiereStore.isLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
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
import { ref, watch, onMounted } from 'vue';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useConcoursMatiereStore } from "~~/stores/concoursMatiere";

const { $toastr, $swal } = useNuxtApp();
const matiereStore = useConcoursMatiereStore();

const showModal = ref(false);
const form = ref({ id: null, nom: "", code: "" });

const openAddModal = () => {
  form.value = { id: null, nom: "", code: "" };
  showModal.value = true;
};

const openEditModal = (matiere) => {
  form.value = { id: matiere.id, nom: matiere.nom, code: matiere.code || "" };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const generateCode = (val) => {
  if (!val) return "";
  const initials = val
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map((word) => word[0].toUpperCase())
    .join("");

  return initials.replace(/[0-9]/g, "").slice(0, 6);
};

watch(() => form.value.nom, (newVal) => {
  form.value.code = generateCode(newVal);
});

const saveMatiere = async () => {
  try {
    if (form.value.id) {
      await matiereStore.updateMatiere(form.value.id, form.value);
      $toastr.success("Matière modifiée avec succès");
    } else {
      await matiereStore.addMatiere(form.value);
      $toastr.success("Matière créée avec succès");
    }
    await matiereStore.fetchMatieres();
    closeModal();
  } catch (error) {
    $toastr.error(error.response?.data?.message || "Une erreur est survenue");
  }
};

const deleteMatiere = async (matiere) => {
  const res = await $swal.fire({
    title: "Supprimer cette matière ?",
    text: `« ${matiere.nom} » sera retirée du catalogue.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
    confirmButtonColor: "#ef4444",
  });

  if (res.isConfirmed) {
    try {
      await matiereStore.deleteMatiere(matiere.id);
      $toastr.success("Matière supprimée avec succès.");
      await matiereStore.fetchMatieres();
    } catch (error) {
      $toastr.error("Erreur lors de la suppression.");
    }
  }
};

onMounted(() => {
  matiereStore.fetchMatieres();
});
</script>
