<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Messages', to: '/' },
        { label: 'Liste', to: null },
      ]"
      title="Liste des messages"
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

              <!-- SI NON LU - Message non lu -->
              <button
                v-if="value.status === 'Non lu'"
                @click="markAsRead(value)"
                class="p-2 rounded-lg text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                title="Non lu - Marquer comme lu"
              >
                <svg
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <!-- Bulle de message -->
                  <path
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <!-- Point indicateur non lu -->
                  <circle cx="19" cy="7" r="2.5" fill="currentColor" />
                </svg>
              </button>

              <!-- SI DÉJÀ LU - Message lu avec coche -->
              <button
                v-else
                disabled
                class="p-2 rounded-lg text-green-600 cursor-default opacity-75"
                title="Déjà lu"
              >
                <svg
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <!-- Bulle de message -->
                  <path
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <!-- Double coche (WhatsApp style) -->
                  <path
                    d="M6 12l2 2 4-4"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M14 12l2 2 4-4"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>

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
          <div class="flex w-full items-center justify-center p-4">
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
                class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
              >
                <!-- En-tête de la modale -->
                <div class="flex items-start justify-between mb-6">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <!-- Icône dynamique selon le statut -->
                      <div
                        :class="[
                          'p-2 rounded-lg',
                          selectedMessage?.status === 'Non lu'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30'
                            : 'bg-green-100 dark:bg-green-900/30',
                        ]"
                      >
                        <svg
                          v-if="selectedMessage?.status === 'Non lu'"
                          class="w-5 h-5 text-yellow-600 dark:text-yellow-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <svg
                          v-else
                          class="w-5 h-5 text-green-600 dark:text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>

                      <DialogTitle
                        class="text-xl font-bold text-gray-900 dark:text-white"
                      >
                        Message de {{ selectedMessage?.nom }}
                      </DialogTitle>
                    </div>

                    <!-- Badge de statut -->
                    <div class="flex items-center gap-2 mt-1">
                      <span
                        :class="[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          selectedMessage?.status === 'Non lu'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
                        ]"
                      >
                        {{ selectedMessage?.status }}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        Reçu le {{ selectedMessage?.date_reception }}
                      </span>
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
                  <!-- Section Informations de contact -->
                  <div class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                    <h3
                      class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2"
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Informations de contact
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <!-- Nom -->
                      <div class="flex items-start gap-3">
                        <div class="flex-shrink-0 mt-0.5">
                          <div
                            class="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg"
                          >
                            <svg
                              class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <p
                            class="text-xs text-gray-500 dark:text-gray-400 mb-0.5"
                          >
                            Nom complet
                          </p>
                          <p
                            class="text-sm font-medium text-gray-900 dark:text-white"
                          >
                            {{ selectedMessage?.nom }}
                          </p>
                        </div>
                      </div>

                      <!-- Email -->
                      <div class="flex items-start gap-3">
                        <div class="flex-shrink-0 mt-0.5">
                          <div
                            class="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg"
                          >
                            <svg
                              class="w-3.5 h-3.5 text-purple-600 dark:text-purple-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <p
                            class="text-xs text-gray-500 dark:text-gray-400 mb-0.5"
                          >
                            Email
                          </p>
                          <a
                            :href="`mailto:${selectedMessage?.email}`"
                            class="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline break-all"
                          >
                            {{ selectedMessage?.email }}
                          </a>
                        </div>
                      </div>

                      <!-- Téléphone -->
                      <div
                        v-if="selectedMessage?.tel"
                        class="flex items-start gap-3"
                      >
                        <div class="flex-shrink-0 mt-0.5">
                          <div
                            class="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg"
                          >
                            <svg
                              class="w-3.5 h-3.5 text-green-600 dark:text-green-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <p
                            class="text-xs text-gray-500 dark:text-gray-400 mb-0.5"
                          >
                            Téléphone
                          </p>
                          <a
                            :href="`tel:${selectedMessage?.tel}`"
                            class="text-sm font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                          >
                            {{ selectedMessage?.tel }}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Section Message -->
                  <div class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
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
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                      Message
                    </h3>

                    <div
                      class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                    >
                      <p
                        class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed"
                      >
                        {{ selectedMessage?.message }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div
                  class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-3"
                >
                  <div class="flex items-center gap-2 order-2 sm:order-1"></div>

                  <div class="flex gap-2 order-1 sm:order-2">
                    <!-- Bouton Supprimer -->
                    <button
                      @click="deleteItem(selectedMessage)"
                      class="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium rounded-lg transition-colors"
                    >
                      <svg
                        class="w-4 h-4 mr-2"
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
                      Supprimer
                    </button>

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
import { useMessageStore } from "~~/stores/message";

const messageStore = useMessageStore();

const { $toastr, $swal } = useNuxtApp();

const searchQuery = ref("");
const loading = ref(true);
const showModal = ref(false);
const modalTitle = ref("");
const itemsPerPage = ref(5);
const showDetailModal = ref(false);
const selectedMessage = ref(null);

const form = ref({
  nom: "",
  effectif: "",
});

const columns = ref([
  { field: "nom", title: "Nom", visible: true },
  { field: "email", title: "Email", visible: false },
  { field: "tel", title: "Téléphone", visible: false },
  { field: "status", title: "Status", visible: true },
  { field: "date_reception", title: "Date réception", visible: true },
  { field: "action", title: "Actions", visible: true },
]);

const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

const rows = computed(() =>
  messageStore.messages.map((m) => ({
    id: m.id,
    slug: m.slug,
    nom: m.nom,
    email: m.email ?? "--",
    tel: m.tel ?? "--",
    status: m.status,
    message: m.message ?? "--",
    date_reception: m.date_reception ?? "--",
  })),
);

const openDetailModal = (item) => {
  selectedMessage.value = item;
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedMessage.value = null;
};

const closeModal = () => (showModal.value = false);

const markAsRead = async (value) => {
  try {
    await messageStore.MarkMessageAsRead(value.slug);
    messageStore.fetchMessages();
    $toastr.success("Message marqué comme lu");
  } catch (error) {
    $toatr.error(error.response.data.message);
  }
};

const deleteItem = async (m) => {
  const res = await $swal.fire({
    title: "Supprimer ce message ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Supprimer",
  });

  if (res.isConfirmed) {
    try {
      messageStore.deleteMessage(m.slug);
      messageStore.fetchMessages();
      $toastr.success("Message supprimé avec succes");
      showDetailModal.value = false;
    } catch (error) {
      $toastr.error(error.response.data.message);
    }
  }
};


onMounted(async () => {
  await messageStore.fetchMessages();
  loading.value = false;
});
</script>
