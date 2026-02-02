<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Matieres', to: '/' },
        { label: 'Liste', to: null },
      ]"
      title="Liste des matieres"
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
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Code : {{ selectedEvent?.code }} • Coefficient :
                      {{ selectedEvent?.coefficient }}
                    </p>
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
                      Informations du cours
                    </h3>
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <p
                          class="text-xs text-gray-500 dark:text-gray-400 mb-1"
                        >
                          Volume horaire
                        </p>
                        <p class="font-medium text-gray-900 dark:text-white">
                          {{ selectedEvent?.volumeHoraire }}
                        </p>
                      </div>
                      <div>
                        <p
                          class="text-xs text-gray-500 dark:text-gray-400 mb-1"
                        >
                          Période
                        </p>
                        <p class="font-medium text-gray-900 dark:text-white">
                          {{ selectedEvent?.periode }}
                        </p>
                      </div>
                      <div>
                        <p
                          class="text-xs text-gray-500 dark:text-gray-400 mb-1"
                        >
                          Date de la période
                        </p>
                        <p class="font-medium text-gray-900 dark:text-white">
                          {{ selectedEvent?.debut }}
                        </p>
                      </div>
                      <div>
                        <p
                          class="text-xs text-gray-500 dark:text-gray-400 mb-1"
                        >
                          Filière
                        </p>
                        <p class="font-medium text-gray-900 dark:text-white">
                          {{ selectedEvent?.filiere }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Section Enseignants -->
                  <div class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                    <div class="flex items-center justify-between mb-3">
                      <h3
                        class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Enseignants
                      </h3>
                      <span
                        class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full"
                      >
                        {{ selectedEvent?.user?.length || 0 }}
                      </span>
                    </div>

                    <div v-if="selectedEvent?.user?.length" class="space-y-3">
                      <div
                        v-for="(enseignant, index) in selectedEvent.user"
                        :key="index"
                        class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                      >
                        <!-- Avatar -->
                        <div class="relative">
                          <div
                            class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                          >
                            {{ enseignant.nom }}{{ enseignant.prenom }}
                          </div>
                          <div
                            class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"
                          ></div>
                        </div>

                        <!-- Infos enseignant -->
                        <div class="flex-1 min-w-0">
                          <p
                            class="font-medium text-gray-900 dark:text-white truncate"
                          >
                            {{ enseignant.prenom }} {{ enseignant.nom }}
                          </p>
                          <p
                            class="text-xs text-gray-500 dark:text-gray-400 truncate"
                          >
                            {{ enseignant.email }}
                          </p>
                        </div>

                        <!-- Menu d'actions -->
                        <!-- <button
                      class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      @click="openEnseignantMenu(enseignant)"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button> -->
                      </div>
                    </div>
                    <!-- Aucun enseignant -->
                    <div v-else class="text-center py-6">
                      <div
                        class="w-12 h-12 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center"
                      >
                        <svg
                          class="w-6 h-6 text-gray-400"
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
                      </div>
                      <p class="text-gray-500 dark:text-gray-400 mb-2">
                        Aucun enseignant affecté
                      </p>
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
                      {{ selectedEvent.details }}
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

            <form @submit.prevent="saveMatiere" class="space-y-4">
              <input
                v-model="form.nom"
                placeholder="Nom"
                required
                class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
              />

              <input
                v-model="form.code"
                placeholder="Code"
                required
                class="w-full px-4 py-2 rounded-lg border uppercase bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
              />

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

              <input
                v-model="form.volume_horaire"
                placeholder="volume horaire"
                required
                class="w-full px-4 py-2 rounded-lg border uppercase bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
              />
              <input
                v-model="form.coefficient"
                placeholder="Coefficient"
                required
                class="w-full px-4 py-2 rounded-lg border uppercase bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
              />

              <Dropdown
                v-model="form.filiere_id"
                :options="FilieresOptions"
                optionLabel="label"
                optionValue="value"
                filter
                showClear
                placeholder="Sélectionner une filiere"
                class="w-full"
              />

              <MultiSelect
                v-model="form.enseignant_id"
                display="chip"
                :options="enseignantsOptions"
                optionLabel="label"
                optionValue="value"
                multiple
                filter
                placeholder="Sélectionner les professeurs"
                class="w-full"
              />

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
  { field: "code", title: "Code", visible: true },
  // { field: "cm", title: "Code magistrale", visible: true },
  // { field: "td", title: "Traveaux dirigés", visible: true },
  // { field: "tp", title: "Traveaux pratiques", visible: true },
  // { field: "ec", title: "Elements constitutifs", visible: true },
  { field: "coefficient", title: "Coefficient", visible: true },
  { field: "filiere", title: "Filiere", visible: false },
  { field: "volumeHoraire", title: "Volume Horaire", visible: false },
  { field: "periode", title: "Période", visible: false },
  { field: "action", title: "Actions", visible: true },
]);

const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

const rows = computed(() =>
  uvStore.uvs.map((f) => ({
    id:f.id,
    slug: f.slug,
    nom: f.nom,
    code: f.code,
    cm: f.cm,
    td: f.td ?? 0,
    tp: f.tp ?? 0,
    ec: f.ec ?? 0,
    coefficient: f.coefficient ?? 0,
    // debut: f.ue.periode.debut + "-" + f.ue.periode.fin ?? "--",
    filiere: f.filiere.nom ?? 0,
    volumeHoraire: f.volume_horaire ?? 0,
    // periode: f.ue.periode.nom ?? "--",
    user: f.user ?? null,
    periode: f.ue.periode.nom ?? null,
  })),
);

const enseignantsOptions = computed(() => {
  return userStore.enseignants.map((e) => ({
    label: `${e.nom} ${e.prenom}`,
    value: e.id,
  }));
});


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
    code: "",
    volume_horaire: "",
    coefficient: "",
    enseignant_id: [],
    filiere_id: "",
    periode_id: "",
  };
  showModal.value = true;
};

const openEditModal = (f) => {
  modalTitle.value = "Modifier la filière";
  form.value = { ...f, id: f.id };
  showModal.value = true;
};

const closeModal = () => (showModal.value = false);

const saveMatiere = async () => {
  try {
    form.value.id
      ? await uvStore.updateUv(form.value.id, form.value)
      : await uvStore.addUv(form.value);

    await uvStore.fetchUv();
    $toastr.success("Succès");
    closeModal();
  } catch (error) {
    console.log(error);
    $toastr.error(error.response.data.message);
  }
};

const deleteItem = async (uv) => {
  const res = await $swal.fire({
    title: "Supprimer cette matiere ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Supprimer",
  });

  if (res.isConfirmed) {
    await uvStore.deleteUv(uv.id);
    await uvStore.fetchUv();
    $toastr.success("Filiere supprimée avec succes");
  }
};

const PeriodesOptions = computed(() =>
  periodeStore.periode.map((p) => ({
    label: p.nom,
    value: p.id,
  })),
);

const FilieresOptions = computed(() =>
  filiereStore.filieres.map((f) => ({
    label: f.nom,
    value: f.id,
  })),
);

onMounted(async () => {
  await filiereStore.fetchFilieres();
  await uvStore.fetchUv();
  await userStore.fetchUsersEnseignant();
  await periodeStore.fetchPeriodeByYear();
  loading.value = false;
});
</script>
