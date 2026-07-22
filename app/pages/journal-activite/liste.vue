<template>
  <div class="page-wrapper">
    <Breadcrumb
      :items="[
        { label: 'Administration', to: '/' },
        { label: `Journal d'activité`, to: null },
      ]"
      title="Journal d'activité"
      :title-class="'text-xl md:text-2xl text-gray-800 dark:text-gray-100'"
      :spacing="'mb-2'"
      :link-color="'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'"
      :active-color="'text-gray-900 dark:text-gray-100 font-medium'"
      :text-size="'text-base'"
      align="left"
    />

    <!-- Filtres -->
    <div class="filters-bar bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <input
        v-model="filters.search"
        type="search"
        placeholder="Rechercher (chemin, description)..."
        class="filter-input border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        @change="applyFilters"
      />
      <select v-model="filters.method" class="filter-input border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300" @change="applyFilters">
        <option value="">Toutes les méthodes</option>
        <option v-for="m in methods" :key="m" :value="m">{{ m }}</option>
      </select>
      <select v-model="filters.log_name" class="filter-input border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300" @change="applyFilters">
        <option value="">Tous les modules</option>
        <option v-for="m in logStore.modules" :key="m" :value="m">{{ m }}</option>
      </select>
      <input
        v-model="filters.date_from"
        type="date"
        class="filter-input border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
        @change="applyFilters"
      />
      <input
        v-model="filters.date_to"
        type="date"
        class="filter-input border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
        @change="applyFilters"
      />
      <button class="reset-btn border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" @click="resetFilters">
        Réinitialiser
      </button>
    </div>

    <!-- Tableau -->
    <div class="rounded-xl shadow p-4 sm:p-5 bg-white dark:bg-gray-800">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900/40">
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
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="logStore.isLoading">
              <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Chargement...
              </td>
            </tr>
            <template v-for="log in logStore.logs" :key="log.id">
              <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/40">
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
                  <button class="details-btn text-blue-600 dark:text-blue-400" @click="toggleExpand(log.id)">
                    {{ expandedId === log.id ? 'Masquer' : 'Détails' }}
                  </button>
                </td>
                -->
              </tr>
              <!--
              <tr v-if="expandedId === log.id">
                <td colspan="8" class="px-6 py-4 bg-gray-50 dark:bg-gray-900/40">
                  <pre class="details-pre text-gray-700 dark:text-gray-300">{{ JSON.stringify(log.properties, null, 2) }}</pre>
                </td>
              </tr>
              -->
            </template>
            <tr v-if="!logStore.isLoading && logStore.logs.length === 0">
              <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Aucune activité trouvée.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="logStore.meta.last_page > 1" class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Page {{ logStore.meta.current_page }} / {{ logStore.meta.last_page }} ({{ logStore.meta.total }} entrées)
        </div>
        <div class="flex gap-2">
          <button
            class="page-btn border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
            :disabled="logStore.meta.current_page <= 1"
            @click="changePage(logStore.meta.current_page - 1)"
          >
            Précédent
          </button>
          <button
            class="page-btn border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
            :disabled="logStore.meta.current_page >= logStore.meta.last_page"
            @click="changePage(logStore.meta.current_page + 1)"
          >
            Suivant
          </button>
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

const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const expandedId = ref(null);

const filters = ref({
  search: "",
  method: "",
  log_name: "",
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
  filters.value = { search: "", method: "", log_name: "", date_from: "", date_to: "" };
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

  await Promise.all([logStore.fetchLogs(), logStore.fetchModules()]);
});
</script>

<style scoped>
.page-wrapper {
  max-width: 1300px;
  margin: 30px auto;
  padding: 20px;
}

.filters-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  padding: 16px;
  border: 1px solid;
  border-radius: 12px;
  margin-bottom: 20px;
}

.filter-input {
  padding: 8px 12px;
  border: 1px solid;
  border-radius: 8px;
  font-size: 13.5px;
  outline: none;
}

.reset-btn {
  padding: 8px 16px;
  border: 1px solid;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-left: auto;
}

.th {
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
}
:global(.dark) .th {
  color: #9ca3af;
}

.td {
  padding: 0.75rem 1.5rem;
  font-size: 0.85rem;
  color: #111827;
}
:global(.dark) .td {
  color: #e5e7eb;
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
  padding: 6px 14px;
  border: 1px solid;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  background: none;
}
.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .page-wrapper {
    padding: 15px;
  }
  .reset-btn {
    margin-left: 0;
  }
}
</style>
