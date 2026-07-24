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

      <!-- Carte unique : en-tête + outils + tableau -->
      <div class="mt-6 bg-white dark:bg-[#11111e] border border-[#e8e8f0] dark:border-[#1a1a2a] rounded-2xl shadow-[0_8px_30px_rgba(127,69,253,0.04)] overflow-hidden">

        <!-- En-tête -->
        <div class="flex items-center gap-3 p-5 lg:p-6 border-b border-[#e8e8f0] dark:border-[#1a1a2a]">
          <div class="w-1.5 h-8 bg-[#7F45FD] rounded-full shrink-0"></div>
          <div>
            <h1 class="text-2xl font-black text-[#1a1a2a] dark:text-[#fafafe] tracking-tight">Journal d'activité</h1>
            <p class="text-sm text-[#8a8a9a] font-medium">Historique des actions effectuées sur la plateforme</p>
          </div>
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
                @change="applyFilters"
              />
              <svg class="w-5 h-5 absolute left-4 top-3 text-[#8a8a9a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- Filtre par module et méthode retiré (demande utilisateur) : ne pas supprimer,
                 juste commenté pour pouvoir le remettre facilement si besoin.
            <select v-model="filters.method" class="filter-select" @change="applyFilters">
              <option value="">Toutes les méthodes</option>
              <option v-for="m in methods" :key="m" :value="m">{{ m }}</option>
            </select>
            <select v-model="filters.log_name" class="filter-select" @change="applyFilters">
              <option value="">Tous les modules</option>
              <option v-for="m in logStore.modules" :key="m" :value="m">{{ m }}</option>
            </select>
            -->

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

        <!-- SKELETON LOADER -->
        <div v-if="logStore.isLoading" class="p-5 lg:p-6 space-y-4">
          <div v-for="i in 6" :key="i" class="border border-[#e8e8f0] dark:border-[#1a1a2a] rounded-2xl p-6 flex items-center justify-between gap-6 animate-pulse">
            <div class="h-3 bg-gray-200 dark:bg-gray-800/50 rounded w-32"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-800/50 rounded w-40"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-800/50 rounded flex-1 max-w-md"></div>
          </div>
        </div>

        <!-- TABLEAU -->
        <template v-else-if="logStore.logs.length > 0">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-[#e8e8f0] dark:divide-[#1a1a2a]">
              <thead class="bg-[#fafafe] dark:bg-[#0a0a12]">
                <tr>
                  <th class="th">Date</th>
                  <th class="th">Utilisateur</th>
                  <th class="th">Action</th>
                  <!-- Masqués pour le moment (demande utilisateur) : Méthode, Chemin, Statut, Module, Détails.
                       Ne pas supprimer le code ci-dessous, juste commenté pour pouvoir les remettre facilement. -->
                  <!--
                  <th class="th">Méthode</th>
                  <th class="th">Chemin</th>
                  <th class="th">Statut</th>
                  <th class="th">Module</th>
                  <th class="th"></th>
                  -->
                </tr>
              </thead>
              <tbody class="divide-y divide-[#e8e8f0] dark:divide-[#1a1a2a]">
                <template v-for="log in logStore.logs" :key="log.id">
                  <tr class="hover:bg-[#fafafe] dark:hover:bg-[#0a0a12] transition-colors">
                    <td class="td whitespace-nowrap">{{ formatDate(log.created_at) }}</td>
                    <td class="td whitespace-nowrap">{{ log.causer?.nom || 'Système / anonyme' }}</td>
                    <td class="td action-cell">{{ log.action }}</td>
                    <!--
                    <td class="td">
                      <span class="method-badge" :class="methodClass(log.properties?.method)">
                        {{ log.properties?.method || '—' }}
                      </span>
                    </td>
                    <td class="td font-mono text-xs">{{ log.properties?.path || '—' }}</td>
                    <td class="td">
                      <span class="status-badge" :class="statusClass(log.properties?.status)">
                        {{ log.properties?.status || '—' }}
                      </span>
                    </td>
                    <td class="td whitespace-nowrap">{{ log.log_name }}</td>
                    <td class="td">
                      <button class="details-btn text-[#7F45FD]" @click="toggleExpand(log.id)">
                        {{ expandedId === log.id ? 'Masquer' : 'Détails' }}
                      </button>
                    </td>
                    -->
                  </tr>
                  <!--
                  <tr v-if="expandedId === log.id">
                    <td colspan="8" class="px-6 py-4 bg-[#fafafe] dark:bg-[#0a0a12]">
                      <pre class="details-pre text-gray-700 dark:text-gray-300">{{ JSON.stringify(log.properties, null, 2) }}</pre>
                    </td>
                  </tr>
                  -->
                </template>
              </tbody>
            </table>
          </div>

          <div v-if="logStore.meta.last_page > 1" class="px-6 py-4 border-t border-[#e8e8f0] dark:border-[#1a1a2a] flex items-center justify-between">
            <div class="text-sm text-[#8a8a9a] font-medium">
              Page {{ logStore.meta.current_page }} / {{ logStore.meta.last_page }} ({{ logStore.meta.total }} entrées)
            </div>
            <div class="flex gap-2">
              <button
                class="page-btn"
                :disabled="logStore.meta.current_page <= 1"
                @click="changePage(logStore.meta.current_page - 1)"
              >
                Précédent
              </button>
              <button
                class="page-btn"
                :disabled="logStore.meta.current_page >= logStore.meta.last_page"
                @click="changePage(logStore.meta.current_page + 1)"
              >
                Suivant
              </button>
            </div>
          </div>
        </template>

        <!-- Vide -->
        <div v-else class="py-20 text-center">
          <div class="w-16 h-16 bg-[#7F45FD]/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-[#7F45FD]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-[#1a1a2a] dark:text-[#fafafe] mb-2">Aucune activité</h3>
          <p class="text-sm font-medium text-[#8a8a9a]">Aucune activité trouvée pour ces critères.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useState } from "#app";
import { useActivityLogStore } from "~~/stores/activityLog";
import { useAccess } from "~/composables/useAccess";

const logStore = useActivityLogStore();
const router = useRouter();
const { can } = useAccess();
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

// Filtre par module et méthode retiré (demande utilisateur) — voir le
// commentaire dans le template. `methods` et `expandedId` restent utilisés
// par le code masqué ci-dessus, laissés en place pour la même raison.
const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const expandedId = ref(null);

const filters = ref({
  search: "",
  date_from: "",
  date_to: "",
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

const methodClass = (method) => {
  return {
    "method-get": method === "GET",
    "method-post": method === "POST",
    "method-put": method === "PUT" || method === "PATCH",
    "method-delete": method === "DELETE",
  };
};

const statusClass = (status) => {
  const code = Number(status);
  return {
    "status-ok": code >= 200 && code < 300,
    "status-redirect": code >= 300 && code < 400,
    "status-client-error": code >= 400 && code < 500,
    "status-server-error": code >= 500,
  };
};

const toggleExpand = (id) => {
  expandedId.value = expandedId.value === id ? null : id;
};

const applyFilters = () => {
  logStore.fetchLogs(filters.value, 1);
};

const resetFilters = () => {
  filters.value = { search: "", date_from: "", date_to: "" };
  applyFilters();
};

const changePage = (page) => {
  logStore.fetchLogs(filters.value, page);
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
.th {
  padding: 0.9rem 1.5rem;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #8a8a9a;
}

.td {
  padding: 1.1rem 1.5rem;
  font-size: 0.85rem;
  color: #1a1a2a;
}
:global(.dark) .td {
  color: #fafafe;
}

.action-cell {
  font-weight: 600;
  min-width: 220px;
}

.method-badge, .status-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.method-get { background: #dbeafe; color: #1d4ed8; }
:global(.dark) .method-get { background: rgba(59, 130, 246, 0.2); color: #93c5fd; }
.method-post { background: #d1fae5; color: #047857; }
:global(.dark) .method-post { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; }
.method-put { background: #fef3c7; color: #b45309; }
:global(.dark) .method-put { background: rgba(217, 119, 6, 0.2); color: #fcd34d; }
.method-delete { background: #fee2e2; color: #b91c1c; }
:global(.dark) .method-delete { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }

.status-ok { background: #d1fae5; color: #047857; }
:global(.dark) .status-ok { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; }
.status-redirect { background: #e0e7ff; color: #4338ca; }
:global(.dark) .status-redirect { background: rgba(99, 102, 241, 0.2); color: #a5b4fc; }
.status-client-error { background: #fef3c7; color: #b45309; }
:global(.dark) .status-client-error { background: rgba(217, 119, 6, 0.2); color: #fcd34d; }
.status-server-error { background: #fee2e2; color: #b91c1c; }
:global(.dark) .status-server-error { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }

.details-btn {
  font-size: 12px;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
}
.details-btn:hover {
  text-decoration: underline;
}

.details-pre {
  font-size: 11.5px;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 320px;
  overflow-y: auto;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #e8e8f0;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  background: #fafafe;
  color: #1a1a2a;
  transition: all 0.2s;
}
.page-btn:hover:not(:disabled) { color: #7F45FD; border-color: #7F45FD; background: white; }
.page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
:global(.dark) .page-btn { background: #0a0a12; border-color: #1a1a2a; color: #fafafe; }
</style>
