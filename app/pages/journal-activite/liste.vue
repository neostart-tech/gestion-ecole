<template>
  <div class="min-h-screen bg-[#f3f3f8] dark:bg-[#08080f] font-sans transition-colors duration-500 relative">

    <!-- Fond d'ambiance violet -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#7F45FD]/15 dark:bg-[#7F45FD]/25 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
      <div class="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#7F45FD]/15 dark:bg-[#7F45FD]/25 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjN0Y0NUZEIiBmaWxsLW9wYWNpdHk9IjAuMDgiPjxwYXRoIGQ9Ik0zNiAzNHYtNGgxdjRoLTF6bTAgM3YtMWgxdjFoLTF6bTAgNHYtMWgxdjFoLTF6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
    </div>

    <div class="relative z-10 w-full p-4 sm:p-6 lg:p-8">

      <Breadcrumb
        :items="[
          { label: 'Administration', to: '/' },
          { label: `Journal d'activité`, to: null },
        ]"
        title="Journal d'activité"
        :title-class="'text-xl md:text-2xl text-gray-800 dark:text-gray-100'"
        :spacing="'mb-2'"
        :link-color="'text-[#7F45FD] dark:text-[#a882ff] hover:text-[#6a35e8] dark:hover:text-[#c4a9ff]'"
        :active-color="'text-gray-900 dark:text-gray-100 font-medium'"
        :text-size="'text-base'"
        align="left"
      />

      <!-- Carte unique : en-tête + outils + datatable -->
      <div class="mt-6 bg-white dark:bg-[#11111e] border border-[#e8e8f0] dark:border-[#1a1a2a] rounded-2xl shadow-[0_8px_30px_rgba(127,69,253,0.04)] overflow-hidden">

        <!-- En-tête -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 lg:p-6 border-b border-[#e8e8f0] dark:border-[#1a1a2a]">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-8 bg-[#7F45FD] rounded-full shrink-0"></div>
            <div>
              <h1 class="text-2xl font-black text-[#1a1a2a] dark:text-[#fafafe] tracking-tight">Journal d'activité</h1>
              <p class="text-sm text-[#8a8a9a] font-medium">Historique des actions effectuées sur la plateforme</p>
            </div>
          </div>

          <button
            v-if="can('clear-activity-log') || can('delete-log')"
            @click="confirmClearAll"
            class="px-4 py-2.5 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white dark:bg-red-500/20 dark:hover:bg-red-600 dark:text-red-400 dark:hover:text-white border border-red-500/20 rounded-xl transition-all text-sm font-bold flex items-center gap-2 self-start sm:self-auto shrink-0 shadow-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Vider tous les logs
          </button>
        </div>

        <!-- Barre d'outils -->
        <div class="p-4 lg:p-5 border-b border-[#e8e8f0] dark:border-[#1a1a2a]">
          <div class="flex flex-col xl:flex-row gap-3">
            <div class="relative flex-1">
              <input
                v-model="filters.search"
                type="search"
                placeholder="Rechercher (chemin, description)..."
                class="w-full pl-11 pr-4 py-3 text-sm bg-[#fafafe] dark:bg-[#0a0a12] border border-[#e8e8f0] dark:border-[#1a1a2a] rounded-xl focus:ring-2 focus:ring-[#7F45FD]/20 focus:border-[#7F45FD] outline-none transition-all text-[#1a1a2a] dark:text-white placeholder-[#8a8a9a]"
                @keyup.enter="applyFilters"
                @change="applyFilters"
              />
              <svg class="w-5 h-5 absolute left-4 top-3 text-[#8a8a9a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div class="grid grid-cols-2 sm:flex gap-3 shrink-0">
              <input
                v-model="filters.date_from"
                type="date"
                class="w-full sm:w-auto px-4 py-3 text-sm bg-[#fafafe] dark:bg-[#0a0a12] border border-[#e8e8f0] dark:border-[#1a1a2a] rounded-xl outline-none focus:border-[#7F45FD] text-[#1a1a2a] dark:text-white"
                @change="applyFilters"
              />
              <input
                v-model="filters.date_to"
                type="date"
                class="w-full sm:w-auto px-4 py-3 text-sm bg-[#fafafe] dark:bg-[#0a0a12] border border-[#e8e8f0] dark:border-[#1a1a2a] rounded-xl outline-none focus:border-[#7F45FD] text-[#1a1a2a] dark:text-white"
                @change="applyFilters"
              />
              <button
                class="col-span-2 sm:col-auto px-4 py-3 bg-[#fafafe] dark:bg-[#0a0a12] border border-[#e8e8f0] dark:border-[#1a1a2a] text-[#8a8a9a] hover:text-[#7F45FD] rounded-xl shadow-sm transition-all text-sm font-semibold"
                @click="resetFilters"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        <!-- Barre d'actions groupées (Suppression multiple) -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="selectedIds.length > 0 && can('delete-log')"
            class="m-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            <div class="flex items-center gap-2 text-sm font-bold text-red-600 dark:text-red-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>{{ selectedIds.length }} log(s) sélectionné(s)</span>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="confirmBulkDelete"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg shadow transition-all flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer la sélection
              </button>
              <button
                @click="selectedRows = []"
                class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Annuler
              </button>
            </div>
          </div>
        </Transition>

        <!-- TABLEAU DATATABLE -->
        <div class="p-4 lg:p-5">
          <Vue3Datatable
            :isServerMode="true"
            :columns="columns"
            :rows="logStore.logs"
            :totalRows="logStore.meta.total"
            :pageSize="logStore.meta.per_page || 25"
            :loading="logStore.isLoading"
            :hasCheckbox="can('delete-log')"
            @change="changeServer"
            @rowSelect="onRowSelect"
            skin="bh-table-striped bh-table-hover"
            class="w-full activity-table"
          >
            <!-- Date -->
            <template #created_at="{ value }">
              <span class="whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ formatDate(value.created_at) }}
              </span>
            </template>

            <!-- Utilisateur -->
            <template #causer="{ value }">
              <span class="whitespace-nowrap font-semibold text-sm text-gray-900 dark:text-white">
                {{ value.causer?.nom ? (value.causer.nom + ' ' + (value.causer.prenom || '')) : 'Visiteur / Système' }}
              </span>
            </template>

            <!-- Action -->
            <template #action="{ value }">
              <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {{ value.action }}
              </span>
            </template>

            <!-- Actions (Supprimer) -->
            <template #actions="{ value }">
              <div v-if="can('delete-log')" class="flex justify-center">
                <button
                  @click="deleteSingleLog(value)"
                  class="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  title="Supprimer la ligne"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </template>
          </Vue3Datatable>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useState } from "#app";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useActivityLogStore } from "~~/stores/activityLog";
import { useAccess } from "~/composables/useAccess";

const logStore = useActivityLogStore();
const router = useRouter();
const { can } = useAccess();
const { $toastr, $swal } = useNuxtApp();
const userLoaded = useState("userLoaded");

const waitForUserLoaded = () =>
  new Promise((resolve) => {
    if (userLoaded.value) {
      resolve();
      return;
    }
    const stop = watch(userLoaded, (loaded) => {
      if (loaded) {
        stop();
        resolve();
      }
    });
  });

const filters = ref({
  search: "",
  date_from: "",
  date_to: "",
});

const selectedRows = ref([]);
const selectedIds = computed(() => selectedRows.value.map((r) => r.id));

const columns = computed(() => {
  const cols = [
    { field: "created_at", title: "Date", sort: true },
    { field: "causer", title: "Utilisateur", sort: true },
    { field: "action", title: "Action", sort: true },
  ];
  if (can("delete-log")) {
    cols.push({ field: "actions", title: "Actions", width: "90px", sort: false, cellClass: "text-center" });
  }
  return cols;
});

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const onRowSelect = (rows) => {
  selectedRows.value = rows || [];
};

const changeServer = (data) => {
  logStore.fetchLogs(filters.value, data.current_page);
};

const applyFilters = () => {
  logStore.fetchLogs(filters.value, 1);
};

const resetFilters = () => {
  filters.value = { search: "", date_from: "", date_to: "" };
  applyFilters();
};

const deleteSingleLog = async (log) => {
  const result = await $swal.fire({
    title: "Supprimer ce log ?",
    text: `Voulez-vous vraiment supprimer l'action "${log.action}" ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
    customClass: {
      confirmButton: "bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg ml-2",
      cancelButton: "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold px-4 py-2 rounded-lg",
    },
    buttonsStyling: false,
  });

  if (result.isConfirmed) {
    try {
      await logStore.deleteLog(log.id);
      $toastr.success("Log supprimé avec succès");
      await logStore.fetchLogs(filters.value, logStore.meta.current_page);
    } catch (error) {
      $toastr.error("Erreur lors de la suppression du log");
    }
  }
};

const confirmBulkDelete = async () => {
  if (selectedIds.value.length === 0) return;

  const result = await $swal.fire({
    title: "Supprimer la sélection ?",
    text: `Voulez-vous vraiment supprimer ces ${selectedIds.value.length} log(s) ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, supprimer tout",
    cancelButtonText: "Annuler",
    customClass: {
      confirmButton: "bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg ml-2",
      cancelButton: "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold px-4 py-2 rounded-lg",
    },
    buttonsStyling: false,
  });

  if (result.isConfirmed) {
    try {
      await logStore.bulkDeleteLogs(selectedIds.value);
      $toastr.success(`${selectedIds.value.length} log(s) supprimé(s) avec succès`);
      selectedRows.value = [];
      await logStore.fetchLogs(filters.value, logStore.meta.current_page);
    } catch (error) {
      $toastr.error("Erreur lors de la suppression des logs");
    }
  }
};

const confirmClearAll = async () => {
  const result = await $swal.fire({
    title: "Vider entièrement le journal ?",
    text: "Attention : cette action va supprimer DÉFINITIVEMENT TOUS LES LOGS de la plateforme. Cette opération est irréversible !",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, tout vider",
    cancelButtonText: "Annuler",
    customClass: {
      confirmButton: "bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg ml-2",
      cancelButton: "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold px-4 py-2 rounded-lg",
    },
    buttonsStyling: false,
  });

  if (result.isConfirmed) {
    try {
      await logStore.clearAllLogs();
      $toastr.success("Le journal d'activités a été entièrement vidé");
      selectedRows.value = [];
      await logStore.fetchLogs(filters.value, 1);
    } catch (error) {
      $toastr.error("Erreur lors de la réinitialisation du journal d'activités");
    }
  }
};

onMounted(async () => {
  await waitForUserLoaded();
  if (!can("view-logs")) {
    router.replace("/unauthorized");
    return;
  }

  await logStore.fetchLogs();
});
</script>

<style scoped>
.activity-table :deep(.bh-datatable table tbody tr) {
  border-bottom: 1px solid #e8e8f0;
}
.dark .activity-table :deep(.bh-datatable table tbody tr) {
  border-bottom-color: #1a1a2a;
  color: #fafafe;
}
.activity-table :deep(.bh-datatable table tbody tr:hover) {
  background-color: rgba(127, 69, 253, 0.03);
}
.dark .activity-table :deep(.bh-datatable table tbody tr:hover) {
  background-color: rgba(127, 69, 253, 0.08);
}
.activity-table :deep(.bh-datatable thead th) {
  background-color: #fafafe !important;
  color: #8a8a9a !important;
  font-weight: 800 !important;
  text-transform: uppercase;
  font-size: 0.7rem !important;
  letter-spacing: 0.1em;
  padding: 0.9rem 1.5rem !important;
  border-bottom: 1px solid #e8e8f0 !important;
}
.dark .activity-table :deep(.bh-datatable thead th) {
  background-color: #0a0a12 !important;
  color: #8a8a9a !important;
  border-bottom-color: #1a1a2a !important;
}
.activity-table :deep(.bh-datatable table td) {
  padding: 1.1rem 1.5rem;
}
</style>
