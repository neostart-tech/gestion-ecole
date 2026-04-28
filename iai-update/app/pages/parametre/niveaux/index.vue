<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Paramètres', to: '#' },
        { label: 'Niveaux Scolaires', to: null },
      ]"
      title="Gestion des niveaux scolaires"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Toolbar -->
    <div class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5">
      <!-- Recherche -->
      <div class="relative w-full lg:w-64">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher un niveau..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div class="absolute left-3 top-2.5">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Ajouter -->
        <button
          @click="openAddModal"
          class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all shadow-md hover:shadow-lg"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Ajouter un niveau
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
      <div v-if="niveauStore.isLoading && !niveauStore.niveaux.length" class="flex justify-center py-20">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="columns"
          :rows="niveauStore.niveaux"
          :search="searchQuery"
          :per-page="10"
          skin="bh-table-striped bh-table-hover"
          class="w-full"
        >
          <template #libelle="{ value }">
             <div class="flex items-center gap-3">
               <div class="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                 {{ value.code || value.libelle.substring(0, 2).toUpperCase() }}
               </div>
               <span class="font-medium text-gray-900 dark:text-white">{{ value.libelle }}</span>
             </div>
          </template>

          <template #active="{ value }">
            <button
              @click="toggleStatus(value)"
              class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none"
              :class="value.active ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'"
            >
              <span
                class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform"
                :class="value.active ? 'translate-x-6' : 'translate-x-1'"
              />
            </button>
            <span class="ml-2 text-xs font-medium" :class="value.active ? 'text-green-600' : 'text-gray-500'">
              {{ value.active ? 'Actif' : 'Inactif' }}
            </span>
          </template>

          <template #action="{ value }">
            <div class="flex justify-center gap-2">
              <button
                @click="openEditModal(value)"
                class="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                title="Modifier"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>

    <!-- Modal Ajout/Edition -->
    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeModal">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl transition-all">
                <DialogTitle class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <div class="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  {{ form.id ? 'Modifier le niveau' : 'Nouveau niveau scolaire' }}
                </DialogTitle>

                <form @submit.prevent="saveNiveau" class="space-y-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Libellé du niveau</label>
                    <input
                      v-model="form.libelle"
                      type="text"
                      placeholder="Ex: Licence 1, Master 2..."
                      required
                      class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Code</label>
                      <input
                        v-model="form.code"
                        type="text"
                        placeholder="Ex: L1"
                        class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Ordre</label>
                      <input
                        v-model.number="form.ordre"
                        type="number"
                        placeholder="1"
                        class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                        :class="{ 'border-amber-500 ring-amber-500': isOrderLow }"
                      />
                      <p v-if="isOrderLow && !form.id" class="text-[10px] text-amber-600 mt-1 font-medium">
                        L'ordre doit être 0 ou supérieur à {{ maxExistingOrder }}
                      </p>
                    </div>
                  </div>

                  <div v-if="!form.id" class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex gap-3 items-start">
                    <svg class="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <p class="text-xs text-blue-700 dark:text-blue-300">
                      L'ordre définit la hiérarchie académique. Le système a suggéré l'ordre {{ nextSuggestedOrder }} basé sur vos enregistrements.
                    </p>
                  </div>

                  <div class="flex justify-end gap-3 mt-8">
                    <button
                      type="button"
                      @click="closeModal"
                      class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      :disabled="niveauStore.isLoading"
                      class="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition-all flex items-center gap-2"
                    >
                      <span v-if="niveauStore.isLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
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
import { ref, onMounted, computed, watch } from 'vue';
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
import { useNiveauStore } from "~~/stores/niveau";

const { $toastr, $swal } = useNuxtApp();
const niveauStore = useNiveauStore();

const searchQuery = ref("");
const showModal = ref(false);
const form = ref({
  id: null,
  libelle: "",
  code: "",
  ordre: null
});

const columns = [
  { field: "libelle", title: "Niveau", sort: true },
  { field: "code", title: "Code", sort: true },
  { field: "ordre", title: "Ordre", sort: true },
  { field: "active", title: "Statut", sort: true },
  { field: "action", title: "Actions", sort: false, headerClass: "text-center" },
];

const maxExistingOrder = computed(() => {
  if (!niveauStore.niveaux.length) return 0;
  return Math.max(...niveauStore.niveaux.map(n => n.ordre || 0));
});

const nextSuggestedOrder = computed(() => maxExistingOrder.value + 1);

const isOrderLow = computed(() => {
  if (form.value.id) return false;
  return form.value.ordre !== null && form.value.ordre !== 0 && form.value.ordre <= maxExistingOrder.value;
});

const openAddModal = () => {
  form.value = { 
    id: null, 
    libelle: "", 
    code: "", 
    ordre: nextSuggestedOrder.value 
  };
  showModal.value = true;
};

const openEditModal = (niveau) => {
  form.value = { ...niveau };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveNiveau = async () => {
  try {
    if (form.value.id) {
      await niveauStore.updateNiveau(form.value.id, form.value);
      $toastr.success("Niveau modifié avec succès");
    } else {
      await niveauStore.addNiveau(form.value);
      $toastr.success("Niveau créé avec succès");
    }
    await niveauStore.fetchNiveaux();
    closeModal();
  } catch (error) {
    $toastr.error(error.response?.data?.message || "Une erreur est survenue");
  }
};

const toggleStatus = async (niveau) => {
  const action = niveau.active ? "désactiver" : "activer";
  const res = await $swal.fire({
    title: `${action.charAt(0).toUpperCase() + action.slice(1)} le niveau ?`,
    text: `Voulez-vous vraiment ${action} le niveau "${niveau.libelle}" ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: `Oui, ${action}`,
    cancelButtonText: "Annuler",
    confirmButtonColor: niveau.active ? "#ef4444" : "#10b981"
  });

  if (res.isConfirmed) {
    try {
      await niveauStore.toggleNiveauStatus(niveau.id);
      await niveauStore.fetchNiveaux();
      $toastr.success(`Niveau ${niveau.active ? 'désactivé' : 'activé'} avec succès`);
    } catch (error) {
      $toastr.error("Erreur lors de la modification du statut");
    }
  }
};

const generateCode = (val) => {
  if (!val) return "";
  // Extrait les initiales de chaque mot
  const initials = val.split(/\s+/)
    .filter(word => word.length > 0)
    .map(word => word[0].toUpperCase())
    .join("");
    
  // Extrait les chiffres
  const numbers = val.match(/\d+/g)?.join("") || "";
  
  // Combine initiales (sans les chiffres qui auraient pu être pris comme première lettre) + chiffres
  // On nettoie les initiales pour enlever ce qui n'est pas une lettre si besoin, 
  // mais généralement le premier caractère d'un mot suffit.
  return initials.replace(/[0-9]/g, '') + numbers;
};

watch(() => form.value.libelle, (newVal) => {
  if (!form.value.id && newVal) {
    form.value.code = generateCode(newVal);
  }
});

onMounted(() => {
  niveauStore.fetchNiveaux();
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
