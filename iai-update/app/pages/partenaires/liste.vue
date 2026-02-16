<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Partenaires', to: '/' },
        { label: 'Liste', to: null },
      ]"
      title="Liste des partenaires"
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
        <NuxtLink
          to="/partenaires/ajouter-un-partenaire"
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
        </NuxtLink>
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
              <!-- Detail -->
              <NuxtLink
                :to="`/partenaires/${value.slug}/detail`"
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
              </NuxtLink>

              <!-- Edit -->
              <NuxtLink
                :to="`/partenaires/${value.slug}/modifier-un-partenaire`"
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
              </NuxtLink>

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

    <!-- MODAL DETAIL -->
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <DialogTitle
                        class="text-xl font-bold text-gray-900 dark:text-white"
                      >
                        {{ selectedAdvertiser?.nom }}
                      </DialogTitle>
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ selectedAdvertiser?.email }}
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
                      Informations du partenaire
                    </h3>
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <p
                          class="text-xs text-gray-500 dark:text-gray-400 mb-1"
                        >
                          Ville
                        </p>
                        <p class="font-medium text-gray-900 dark:text-white">
                          {{ selectedAdvertiser?.ville }}
                        </p>
                      </div>
                      <div>
                        <p
                          class="text-xs text-gray-500 dark:text-gray-400 mb-1"
                        >
                          Site web
                        </p>
                        <p class="font-medium text-gray-900 dark:text-white">
                          <a
                            :href="selectedAdvertiser?.site"
                            target="_blank"
                            class="text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            {{ selectedAdvertiser?.site }}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Section Description -->
                  <div
                    v-if="selectedAdvertiser?.details"
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
                    <div
                      class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed"
                      v-html="selectedAdvertiser?.details"
                    ></div>
                  </div>
                </div>

                <!-- Actions -->
                <div
                  class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center"
                >
                  <div class="flex gap-3">
                    <button
                      type="button"
                      @click="closeDetailModal"
                      class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- MODAL AJOUT / EDIT -->
    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" class="relative z-150" @close="closeModal">
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

            <form @submit.prevent="saveAdvertiser" class="space-y-4">
              <FloatLabel variant="on">
                <InputText
                  id="nom"
                  v-model="form.nom"
                  autocomplete="off"
                  class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                />
                <label for="nom">Nom</label>
              </FloatLabel>

              <FloatLabel variant="on">
                <InputText
                  id="email"
                  v-model="form.email"
                  autocomplete="off"
                  class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                />
                <label for="email">Email</label>
              </FloatLabel>

              <FloatLabel variant="on">
                <InputText
                  id="ville"
                  v-model="form.ville"
                  autocomplete="off"
                  class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                />
                <label for="ville">Ville</label>
              </FloatLabel>

              <FloatLabel variant="on">
                <InputText
                  id="site"
                  v-model="form.site"
                  autocomplete="off"
                  class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                />
                <label for="site">Site web</label>
              </FloatLabel>

              <FloatLabel variant="on">
                <!-- <Textarea
                  id="details"
                  v-model="form.details"
                  rows="4"
                  class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                /> -->
                <Editor
                  api-key="ktf8z0z55enm2wd9xyeoo6qzzoy7w9b629e51wii9y8lw4dx"
                  v-model="form.details"
                  :init="{
                    height: 250,
                    menubar: false,
                    plugins: 'lists link image media table wordcount',
                    toolbar:
                      'undo redo | bold italic underline | bullist numlist | link image media | removeformat',
                    content_style:
                      'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                  }"
                />
                <!-- <label for="details">Description</label> -->
              </FloatLabel>

              <div class="flex justify-end gap-3">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
  TransitionChild,
} from "@headlessui/vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useAdvertiserStore } from "~~/stores/adverstiser";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Editor from "@tinymce/tinymce-vue";

const { $toastr, $swal } = useNuxtApp();
const advertiserStore = useAdvertiserStore();

const searchQuery = ref("");
const loading = ref(true);
const showModal = ref(false);
const showDetailModal = ref(false);
const modalTitle = ref("");
const itemsPerPage = ref(5);
const selectedAdvertiser = ref(null);

const form = ref({
  id: null,
  slug: null,
  nom: "",
  email: "",
  ville: "",
  site: "",
  details: "",
});

const columns = ref([
  { field: "nom", title: "Nom", visible: true },
  { field: "email", title: "Email", visible: true },
  { field: "ville", title: "Ville", visible: true },
  { field: "site", title: "Site web", visible: false },
  { field: "action", title: "Actions", visible: true },
]);

const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

const rows = computed(() =>
  advertiserStore.advertisers.map((a) => ({
    id: a.id,
    slug: a.slug,
    nom: a.nom,
    email: a.email,
    ville: a.ville,
    site: a.site ?? "--",
    details: a.details,
  })),
);

const openDetailModal = (item) => {
  selectedAdvertiser.value = item;
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedAdvertiser.value = null;
};

const openAddModal = () => {
  modalTitle.value = "Ajouter un partenaire";
  form.value = {
    id: null,
    slug: null,
    nom: "",
    email: "",
    ville: "",
    site: "",
    details: "",
  };
  showModal.value = true;
};

const openEditModal = (a) => {
  modalTitle.value = "Modifier le partenaire";
  form.value = {
    id: a.id,
    slug: a.slug,
    nom: a.nom,
    email: a.email,
    ville: a.ville,
    site: a.site,
    details: a.details,
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveAdvertiser = async () => {
  try {
    if (form.value.id) {
      await advertiserStore.updateAdvertiser(form.value, form.value.slug);
      $toastr.success("Partenaire modifié avec succès");
    } else {
      await advertiserStore.addAdvertiser(form.value);
      $toastr.success("Partenaire ajouté avec succès");
    }
    await advertiserStore.fetchAdvertisers();
    closeModal();
  } catch (error) {
    console.log(error);
    $toastr.error(error.response?.data?.message || "Une erreur est survenue");
  }
};

const deleteItem = async (advertiser) => {
  const res = await $swal.fire({
    title: "Supprimer ce partenaire ?",
    text: "Cette action est irréversible",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Supprimer",
    cancelButtonText: "Annuler",
  });

  if (res.isConfirmed) {
    try {
      await advertiserStore.deleteAdvertiser(advertiser.slug);
      await advertiserStore.fetchAdvertisers();
      $toastr.success("Partenaire supprimé avec succès");
    } catch (error) {
      console.log(error);
      $toastr.error(error.response?.data?.message || "Une erreur est survenue");
    }
  }
};

onMounted(async () => {
  await advertiserStore.fetchAdvertisers();
  loading.value = false;
});
</script>
