<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Semestres', to: '/' },
        { label: 'Liste', to: null },
      ]"
      title="Liste des semestres"
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
      <div v-if="loading" class="flex justify-center py-10">
        <div
          class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"
        ></div>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="visibleColumns"
          :rows="rows"
          :search="searchQuery"
          :per-page="itemsPerPage"
          skin="bh-table-striped bh-table-hover"
        >
          <template #action="{ value }">
            <div class="flex justify-center gap-3">
              <button
                @click="openDetailModal(value)"
                class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                <svg
                  class="w-4 h-4 mr-1"
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
              </button>

              <!-- Edit -->
              <button
                @click="openEditModal(value)"
                class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                <svg
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M4 20h4l10-10-4-4L4 16v4z"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>

              <!-- Delete -->
              <button
                @click="deleteItem(value)"
                class="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                <svg
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M3 6h18M8 6v14m8-14v14M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>

    <TransitionRoot appear :show="showDetailModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeDetailModal">
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
              <DialogPanel
                class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
              >
                <!-- En-tête de la modale -->
                <div class="flex items-start justify-between mb-6">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <div
                        class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"
                      >
                        <svg
                          class="w-5 h-5 text-blue-600 dark:text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <DialogTitle
                        class="text-xl font-bold text-gray-900 dark:text-white"
                      >
                        {{ selectedEvent?.nom }}
                      </DialogTitle>
                    </div>
                    
                  </div>
                  <button
                    @click="closeDetailModal"
                    class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <!-- Contenu principal -->
                <div class="space-y-5">
                  <!-- Section Informations -->
                  <div class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                    <h3
                      class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"
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
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Informations du semestre
                    </h3>
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <p
                          class="text-xs text-gray-500 dark:text-gray-400 mb-1"
                        >
                          Date debut
                        </p>
                        <p class="font-medium text-gray-900 dark:text-white">
                          {{ selectedEvent?.debut }}
                        </p>
                      </div>
                      <div>
                        <p
                          class="text-xs text-gray-500 dark:text-gray-400 mb-1"
                        >
                          Date fin
                        </p>
                        <p class="font-medium text-gray-900 dark:text-white">
                          {{ selectedEvent?.date_fin }}
                        </p>
                      </div>
                    
                    </div>
                  </div>

                 
                  <!-- Section Détails supplémentaires -->
                  <div
                    v-if="selectedEvent?.details"
                    class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4"
                  >
                    <h3
                      class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Description
                    </h3>
                    <p
                      class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed"
                    >
                      {{ selectedEvent.description }}
                    </p>
                  </div>
                </div>

                <!-- Actions -->
                <div
                  class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center"
                >
                  <div
                    class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Dernière mise à jour : Aujourd'hui
                  </div>
                  <div class="flex gap-3">
                    <button
                      type="button"
                      @click="closeDetailModal"
                      class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Fermer
                    </button>
                    <button
                      type="button"
                      @click="editEvent"
                      class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Modifier
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

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

            <form @submit.prevent="savePeriode" class="space-y-4">
              <FloatLabel variant="on">
                <InputText
                  id="on_label"
                  v-model="form.nom"
                  autocomplete="off"
                  class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                />
                <label for="on_label">Nom</label>
              </FloatLabel>
              <FloatLabel variant="on">
                <DatePicker
                  v-model="form.debut"
                  dateFormat="yy-mm-dd"
                  showIcon
                  fluid
                  iconDisplay="input"
                />
                <label for="on_label">Date début</label>
              </FloatLabel>
              <FloatLabel variant="on">
                <DatePicker
                  v-model="form.fin"
                  dateFormat="yy-mm-dd"
                  showIcon
                  fluid
                  iconDisplay="input"
                />
                <label for="on_label">Date fin</label>
              </FloatLabel>

              <FloatLabel variant="on">
                <Textarea
                  id="on_label"
                  v-model="form.description"
                  cols="30"
                 
                  class="w-full"
                />
                <label for="on_label">Description</label>
              </FloatLabel>

              <div class="flex justify-end gap-3">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Enregistrer
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
import { useFiliereStore } from "../../../stores/filiere";
import { useUvStore } from "~~/stores/unite-valeur";
import { useUserStore } from "~~/stores/user";
import { usePeriodeStore } from "~~/stores/periode";

const { $toastr, $swal } = useNuxtApp();
const filiereStore = useFiliereStore();
const uvStore = useUvStore();
const userStore = useUserStore();
const periodeStore = usePeriodeStore();

const searchQuery = ref("");
const loading = ref(true);
const showModal = ref(false);
const modalTitle = ref("");
const itemsPerPage = ref(5);
const showDetailModal = ref(false);
const selectedEvent = ref(null);

const form = ref({
  id: null,
  nom: "",
  code: "",
  volume_horaire: "",
  coefficient: "",
  enseignant_id: [],
  filiere_id: "",
  periode_id: "",
});

const columns = ref([
  { field: "nom", title: "Nom", visible: true },
  { field: "description", title: "Description", visible: true },
  { field: "debut", title: "Début", visible: false },
  { field: "fin", title: "Fin", visible: false },
  { field: "action", title: "Actions", visible: true },
]);

const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

const rows = computed(() =>
  periodeStore.periode.map((f) => ({
    id: f.id,
    slug: f.slug,
    nom: f.nom,
    description: f.description ?? "--",
    debut: f.debut,
    fin: f.fin ?? null,
    date_debut: f.debut,
    date_fin: f.fin ?? null,
  })),
);


const openDetailModal = (item) => {
  selectedEvent.value = item;
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedEvent.value = null;
};

const openAddModal = () => {
  modalTitle.value = "Créer une matiere";
  form.value = {
    nom: "",
    debut: "",
    fin: "",
    description: "",
  };
  showModal.value = true;
};

const openEditModal = (f) => {
  modalTitle.value = "Modifier la matière";

  form.value = {
    id: f.id,
    slug: f.slug,
    nom: f.nom,
    description: f.description,
    debut: parseDate(f.date_debut),
    fin: parseDate(f.date_fin), 
  };

  showModal.value = true;
};


const closeModal = () => (showModal.value = false);

const savePeriode = async () => {
  try {
    form.value.id
      ? await periodeStore.updatePeriode(form.value.slug, form.value)
      : await periodeStore.addPeriode(form.value);

    await periodeStore.fetchPeriodeByYear();
    $toastr.success("Semestre enrégistré avec succes");
    closeModal();
  } catch (error) {
    console.log(error);
    $toastr.error(error.response.data.message);
  }
};

const deleteItem = async (p) => {
  const res = await $swal.fire({
    title: "Supprimer ce semestre ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Supprimer",
  });

  if (res.isConfirmed) {
    await periodeStore.deletePeriode(p.slug);
    await periodeStore.fetchPeriodeByYear();
    $toastr.success("Semestre supprimée avec succes");
  }
};

const parseDate = (value) => {
  if (!value) return null
  return new Date(value)
}

definePageMeta(()=>({
  middleware:'auth'
}))


onMounted(async () => {
  await periodeStore.fetchPeriodeByYear();
  loading.value = false;
});
</script>
