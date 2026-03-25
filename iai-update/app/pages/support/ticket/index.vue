<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Support', to: '/' },
        { label: 'Tickets', to: null },
      ]"
      title="Centre de support"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-blue-500"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Total tickets
            </p>
            <p class="text-2xl font-bold text-gray-800 dark:text-white">
              {{ totalTickets }}
            </p>
          </div>
          <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <svg
              class="w-6 h-6 text-blue-600 dark:text-blue-400"
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
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-green-500"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Tickets ouverts
            </p>
            <p class="text-2xl font-bold text-gray-800 dark:text-white">
              {{ ticketsOuverts }}
            </p>
          </div>
          <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <svg
              class="w-6 h-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-yellow-500"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">En cours</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-white">
              {{ ticketsEnCours }}
            </p>
          </div>
          <div class="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
            <svg
              class="w-6 h-6 text-yellow-600 dark:text-yellow-400"
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
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-purple-500"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Résolus</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-white">
              {{ ticketsResolus }}
            </p>
          </div>
          <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <svg
              class="w-6 h-6 text-purple-600 dark:text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div
      class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5"
    >
      <!-- Recherche et filtres -->
      <div class="flex flex-col sm:flex-row gap-3 flex-1">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher un ticket..."
          class="w-full lg:w-80 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <select
          v-model="statusFilter"
          class="w-full sm:w-40 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Tous les statuts</option>
          <option value="open">Ouverts</option>
          <option value="in_progress">En cours</option>
          <option value="closed">Fermés</option>
        </select>
      </div>

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

        <!-- Nouveau ticket -->
        <button
          @click="openAddModal"
          :disabled="ticketStore.isLoading"
          class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <svg
            v-if="ticketStore.isLoading"
            class="w-5 h-5 animate-spin"
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
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>

          <svg
            v-else
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

          {{ ticketStore.isLoading ? "Création..." : "Nouveau ticket" }}
        </button>
      </div>
    </div>

    <!-- Table des tickets -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-3 sm:p-4">
      <div v-if="loading" class="flex justify-center py-10">
        <div
          class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"
        ></div>
      </div>

      <div v-else-if="filteredTickets.length === 0" class="text-center py-10">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
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
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          Aucun ticket
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Commencez par créer un nouveau ticket.
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="visibleColumns"
          :rows="filteredTickets"
          :search="searchQuery"
          :per-page="itemsPerPage"
          skin="bh-table-striped bh-table-hover"
        >
          <template #subject="{ value, row }">
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-900 dark:text-white">
                {{ value }}
              </span>
              <span
                v-if="row.priority === 'high'"
                class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full"
              >
                Urgent
              </span>
            </div>
          </template>

          <template #status="{ value }">
            <span
              :class="{
                'px-2 py-1 text-xs font-medium rounded-full': true,
                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400':
                  value === 'open',
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400':
                  value === 'in_progress',
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300':
                  value === 'closed',
              }"
            >
              {{ getStatusLabel(value) }}
            </span>
          </template>

          <template #created_at="{ value }">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ formatDate(value) }}
            </span>
          </template>

          <template #action="{ value }">
            <div class="flex justify-center gap-2">
              <!-- Voir détails -->
              <button
                @click="viewTicket(value)"
                class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                title="Voir détails"
              >
                <svg
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    stroke-width="2"
                  />
                  <path
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    stroke-width="2"
                  />
                </svg>
              </button>

              <!-- Fermer (seulement si ouvert) -->
              <button
                v-if="value.status === 'open'"
                @click="closeTicket(value)"
                class="p-2 rounded-lg text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
                title="Fermer le ticket"
              >
                <svg
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </button>

              <!-- Supprimer -->
              <button
                @click="deleteTicket(value)"
                class="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                title="Supprimer"
              >
                <ButtonDelete />
              </button>
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>

    <!-- Modal de création/édition -->
    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeModal">
        <div class="fixed inset-0 bg-black/60" />

        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            class="w-full max-w-2xl rounded-xl bg-white dark:bg-gray-800 p-5"
          >
            <DialogTitle
              class="text-lg font-semibold mb-4 text-gray-900 dark:text-white"
            >
              {{ modalTitle }}
            </DialogTitle>

            <form @submit.prevent="saveTicket" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sujet
                </label>
                <input
                  v-model="form.subject"
                  type="text"
                  required
                  placeholder="Ex: Problème de connexion"
                  class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priorité
                </label>
                <select
                  v-model="form.priority"
                  class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="normal">Normale</option>
                  <option value="high">Haute (Urgent)</option>
                  <option value="low">Basse</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Catégorie
                </label>
                <select
                  v-model="form.category"
                  class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="technical">Problème technique</option>
                  <option value="billing">Facturation</option>
                  <option value="account">Compte utilisateur</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  v-model="form.message"
                  required
                  rows="5"
                  placeholder="Décrivez votre problème en détail..."
                  class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pièces jointes (optionnel)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              <div class="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  :disabled="ticketStore.isLoading"
                  class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {{ ticketStore.isLoading ? "Envoi en cours..." : "Envoyer" }}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal de détails -->
    <TransitionRoot appear :show="showDetailsModal" as="template">
      <Dialog as="div" class="relative z-50" @close="showDetailsModal = false">
        <div class="fixed inset-0 bg-black/60" />

        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            class="w-full max-w-2xl rounded-xl bg-white dark:bg-gray-800 p-5"
          >
            <DialogTitle
              class="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex justify-between items-center"
            >
              <span>Détails du ticket</span>
              <span
                :class="{
                  'px-2 py-1 text-xs font-medium rounded-full': true,
                  'bg-green-100 text-green-800': selectedTicket?.status === 'open',
                  'bg-yellow-100 text-yellow-800': selectedTicket?.status === 'in_progress',
                  'bg-gray-100 text-gray-800': selectedTicket?.status === 'closed',
                }"
              >
                {{ getStatusLabel(selectedTicket?.status) }}
              </span>
            </DialogTitle>

            <div v-if="selectedTicket" class="space-y-4">
              <div>
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Sujet
                </h4>
                <p class="text-gray-900 dark:text-white">
                  {{ selectedTicket.subject }}
                </p>
              </div>

              <div>
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Message
                </h4>
                <p class="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {{ selectedTicket.message }}
                </p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Créé le
                  </h4>
                  <p class="text-gray-900 dark:text-white">
                    {{ formatDate(selectedTicket.created_at) }}
                  </p>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Catégorie
                  </h4>
                  <p class="text-gray-900 dark:text-white">
                    {{ getCategoryLabel(selectedTicket.category) }}
                  </p>
                </div>
              </div>

              <!-- Réponses -->
              <div v-if="selectedTicket.responses?.length" class="mt-4">
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Réponses ({{ selectedTicket.responses.length }})
                </h4>
                <div class="space-y-3">
                  <div
                    v-for="response in selectedTicket.responses"
                    :key="response.id"
                    class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3"
                  >
                    <div class="flex justify-between items-start mb-1">
                      <span class="font-medium text-indigo-600 dark:text-indigo-400">
                        {{ response.user_name }}
                      </span>
                      <span class="text-xs text-gray-500">
                        {{ formatDate(response.created_at) }}
                      </span>
                    </div>
                    <p class="text-gray-700 dark:text-gray-300 text-sm">
                      {{ response.message }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Répondre -->
              <div v-if="selectedTicket.status !== 'closed'" class="mt-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ajouter une réponse
                </label>
                <textarea
                  v-model="replyMessage"
                  rows="3"
                  placeholder="Écrivez votre réponse..."
                  class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                />
                <div class="flex justify-end mt-2">
                  <button
                    @click="sendReply"
                    :disabled="!replyMessage.trim() || ticketStore.isLoading"
                    class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 text-sm"
                  >
                    Envoyer
                  </button>
                </div>
              </div>
            </div>

            <div class="flex justify-end mt-6">
              <button
                @click="showDetailsModal = false"
                class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Fermer
              </button>
            </div>
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
import { useTicketStore } from "~~/stores/ticket";
import ButtonDelete from "~/components/ui/buttonDelete.vue";

const { $toastr, $swal } = useNuxtApp();
const ticketStore = useTicketStore();

// États
const searchQuery = ref("");
const statusFilter = ref("all");
const loading = ref(true);
const showModal = ref(false);
const showDetailsModal = ref(false);
const modalTitle = ref("");
const itemsPerPage = ref(10);
const selectedTicket = ref(null);
const replyMessage = ref("");

// Formulaire
const form = ref({
  subject: "",
  message: "",
  priority: "normal",
  category: "technical",
});

// Configuration des colonnes
const columns = ref([
  { field: "subject", title: "Sujet", visible: true },
  { field: "status", title: "Statut", visible: true },
  { field: "priority", title: "Priorité", visible: false },
  { field: "category", title: "Catégorie", visible: false },
  { field: "created_at", title: "Date", visible: true },
  { field: "action", title: "Actions", visible: true },
]);

const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

// Tickets filtrés
const filteredTickets = computed(() => {
  let tickets = ticketStore.tickets.map((t) => ({
    id: t.id,
    subject: t.subject,
    message: t.message,
    status: t.status,
    priority: t.priority || "normal",
    category: t.category || "technical",
    created_at: t.created_at,
    responses: t.responses || [],
  }));

  if (statusFilter.value !== "all") {
    tickets = tickets.filter((t) => t.status === statusFilter.value);
  }

  return tickets;
});

// Statistiques
const totalTickets = computed(() => ticketStore.tickets.length);
const ticketsOuverts = computed(
  () => ticketStore.tickets.filter((t) => t.status === "open").length,
);
const ticketsEnCours = computed(
  () => ticketStore.tickets.filter((t) => t.status === "in_progress").length,
);
const ticketsResolus = computed(
  () => ticketStore.tickets.filter((t) => t.status === "closed").length,
);

// Méthodes utilitaires
const getStatusLabel = (status) => {
  const labels = {
    open: "Ouvert",
    in_progress: "En cours",
    closed: "Fermé",
  };
  return labels[status] || status;
};

const getCategoryLabel = (category) => {
  const labels = {
    technical: "Technique",
    billing: "Facturation",
    account: "Compte",
    other: "Autre",
  };
  return labels[category] || category;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Actions
const openAddModal = () => {
  modalTitle.value = "Nouveau ticket de support";
  form.value = {
    subject: "",
    message: "",
    priority: "normal",
    category: "technical",
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveTicket = async () => {
  try {
    await ticketStore.addTicket(form.value);
    await ticketStore.fetchTickets();
    $toastr.success("Ticket créé avec succès");
    closeModal();
  } catch (error) {
    $toastr.error(error.response?.data?.message || "Erreur lors de la création");
  }
};

const viewTicket = (ticket) => {
  selectedTicket.value = ticket;
  replyMessage.value = "";
  showDetailsModal.value = true;
};

const sendReply = async () => {
  if (!replyMessage.value.trim()) return;

  try {
    // Implémentez la logique d'envoi de réponse ici
    $toastr.success("Réponse envoyée");
    replyMessage.value = "";
    // Recharger les détails du ticket
  } catch (error) {
    $toastr.error("Erreur lors de l'envoi");
  }
};

const closeTicket = async (ticket) => {
  const res = await $swal.fire({
    title: "Fermer le ticket ?",
    text: "Êtes-vous sûr de vouloir fermer ce ticket ?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Fermer",
    cancelButtonText: "Annuler",
  });

  if (res.isConfirmed) {
    try {
      await ticketStore.closeTicket(ticket.id);
      await ticketStore.fetchTickets();
      $toastr.success("Ticket fermé avec succès");
    } catch (error) {
      $toastr.error("Erreur lors de la fermeture");
    }
  }
};

const deleteTicket = async (ticket) => {
  const res = await $swal.fire({
    title: "Supprimer le ticket ?",
    text: "Cette action est irréversible !",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Supprimer",
    confirmButtonColor: "#dc2626",
  });

  if (res.isConfirmed) {
    try {
      await ticketStore.deleteTicket(ticket.id);
      await ticketStore.fetchTickets();
      $toastr.success("Ticket supprimé avec succès");
    } catch (error) {
      $toastr.error("Erreur lors de la suppression");
    }
  }
};

// Initialisation
onMounted(async () => {
  await ticketStore.fetchTickets();
  loading.value = false;
});
</script>