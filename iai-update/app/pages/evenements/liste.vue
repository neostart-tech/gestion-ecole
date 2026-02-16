<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Administration', to: '/' },
        { label: 'Evénement', to: null },
      ]"
      title="Liste des événements"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Toolbar -->
    <div
      class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5"
    >
      <!-- Recherche avec icône -->


      <div class="relative w-full lg:w-64">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
        />
        <svg
          class="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Filtre par statut -->
 

      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Sélecteur de colonnes -->
        <client-only>
          <VDropdown placement="bottom-end">
            <button
              class="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              Colonnes
              <svg
                class="w-4 h-4 ml-1"
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
                class="w-56 p-3 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <p
                  class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2"
                >
                  Afficher les colonnes
                </p>
                <div
                  v-for="col in columns"
                  :key="col.field"
                  class="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    v-model="col.visible"
                    :disabled="col.field === 'action'"
                    class="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">
                    {{ col.title }}
                  </span>
                </div>
              </div>
            </template>
          </VDropdown>
        </client-only>

        <!-- Bouton d'ajout -->
        <NuxtLink
          to="/evenements/ajouter-un-evenement"
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
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
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4 overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      <!-- Loader -->
      <div v-if="blogStore.isLoading" class="flex justify-center py-16">
        <div class="relative">
          <div
            class="h-16 w-16 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"
          ></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <span
              class="text-xs font-medium text-indigo-600 dark:text-indigo-400"
            ></span>
          </div>
        </div>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="visibleColumns"
          :rows="filteredRows"
          :search="searchQuery"
          :per-page="itemsPerPage"
          skin="bh-table-striped bh-table-hover"
          sortable
          class="w-full"
          :sortable-icon="{
            asc: '↑',
            desc: '↓',
          }"
        >
          <!-- Image avec tooltip -->
       

          <!-- Titre avec design amélioré -->
          <template #nom="data">
            <div class="max-w-xs">
              <NuxtLink
                :to="`/evenements/${data.value.id || data.value.slug}/detail`"
                class="group flex items-start gap-2"
              >
                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 truncate"
                  >
                    {{ data.value.nom }}
                  </p>
                  <p
                    class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1"
                  >
                    <svg
                      class="w-3 h-3 inline"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h8m-8 6h16"
                      />
                    </svg>
                    {{
                      data.value.excerpt
                        ? truncateText(stripHtml(data.value.excerpt), 40)
                        : truncateText(stripHtml(data.value.details), 40)
                    }}
                  </p>
                </div>

                <!-- Badge de longueur de titre -->
                <span
                  v-if="data.value.title && data.value.title.length > 50"
                  class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                  title="Titre long"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
              </NuxtLink>
            </div>
          </template>

       
        

      
          <template #action="data">
            <div class="flex justify-center gap-1">
              <!-- View -->
              <NuxtLink
                :to="`/evenements/${data.value.id}/detail`"
                class="p-2 rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 transform hover:scale-110"
                title="Voir détails"
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
                    stroke-width="1.5"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </NuxtLink>

              <!-- Edit -->
              <NuxtLink
                class="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 transform hover:scale-110"
                title="Modifier"
                :to="`/evenements/${data.value.id || data.value.id}/modifier-un-evenement`"
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
                    stroke-width="1.5"
                    d="M4 20h4l10-10-4-4L4 16v4z"
                  />
                </svg>
              </NuxtLink>

              <!-- Delete -->
              <button
                class="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 transform hover:scale-110"
                @click="confirmDelete(data.value)"
                title="Supprimer"
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
                    stroke-width="1.5"
                    d="M3 6h18M8 6v14m8-14v14M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14"
                  />
                </svg>
              </button>
            </div>
          </template>
        </Vue3Datatable>

        <!-- Pagination améliorée -->

        <!-- Message si aucune donnée -->
        <div v-if="filteredRows.length === 0" class="text-center py-16">
          <div
            class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 mb-4"
          >
            <svg
              class="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucune publication trouvée
          </h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">
            Commencez par créer votre première publication.
          </p>
          <NuxtLink
            to="/evenements/ajouter-un-evenement"
            class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Ajouter
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import Breadcrumb from "~/components/Breadcrumb.vue";
import Dropdown from "primevue/dropdown";
import {useEvenementStore} from "~~/stores/evenement"

import { useBlogStore } from "~~/stores/blog";

const blogStore = useBlogStore();
const evenementStore=useEvenementStore();
const { $toastr } = useNuxtApp();

// Références
const showEditModal = ref(false);
const searchQuery = ref("");
const statusFilter = ref(null);
const itemsPerPage = ref(10);

// Colonnes de la table
const columns = ref([
  // { field: "image", title: "Image", sortable: false, visible: true },
  { field: "nom", title: "Nom", sortable: true, visible: true },
  {
    field: "date_debut_detail",
    title: "Date début",
    sortable: true,
    visible: true,
  },
   {
    field: "date_fin_detail",
    title: "Date fin",
    sortable: true,
    visible: true,
  },
  // { field: "status", title: "Statut", sortable: true, visible: true },
  { field: "action", title: "Actions", sortable: false, visible: true },
]);

const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

// Rows filtrées
const filteredRows = computed(() => {
  let rows = evenementStore.evenements.map((event) => ({
    ...event,
    nom: event.nom || "--",
    details: event.details || "Admin",
    date_debut_detail: event.date_debut_detail,
    date_fin_detail: event.date_fin_detail,
 
  }));


  return rows;
});



const clearSearch = () => {
  searchQuery.value = "";
};


const confirmDelete = async (event) => {
  const { $swal } = useNuxtApp();
  const result = await $swal.fire({
    title: "Supprimer ?",
    text: `Voulez-vous supprimer "${event.nom}" ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
    background: document.documentElement.classList.contains("dark")
      ? "#1f2937"
      : "#fff",
    color: document.documentElement.classList.contains("dark")
      ? "#fff"
      : "#000",
  });

  if (result.isConfirmed) {
    try {
      await evenementStore.deleteEvenement(event.id);
      $toastr.success("Evénement supprimé avec succès");
      await evenementStore.fetchEvenements();
    } catch (error) {
      console.error("Erreur suppression:", error);
      $toastr.error(error.response.data.message);
    }
  }
};

// Utilitaires
const formatDate = (dateString) => {
  if (!dateString) return "Date inconnue";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};


const getInitials = (name) => {
  if (!name) return "A";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const truncateText = (text, length) => {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
};

const stripHtml = (html) => {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
};

// Chargement initial
onMounted(async () => {
  try {
    await evenementStore.fetchEvenements();
  } catch (error) {
    console.error("Erreur chargement:", error);
    $toastr.error("Erreur lors du chargement");
  }
});
</script>
