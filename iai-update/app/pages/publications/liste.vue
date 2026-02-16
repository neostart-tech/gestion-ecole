<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Administration', to: '/' },
        { label: 'Blog', to: null },
      ]"
      title="Liste des publications"
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
      <Dropdown
        v-model="statusFilter"
        :options="statusOptions"
        optionLabel="label"
        optionValue="value"
        :showClear="true"
        placeholder="Filtrer par statut"
        class="w-full lg:w-48"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex items-center gap-2">
            <span
              class="w-2 h-2 rounded-full"
              :class="
                slotProps.value === 'published'
                  ? 'bg-green-500'
                  : 'bg-amber-500'
              "
            ></span>
            <span>{{
              slotProps.value === "published" ? "Publié" : "Brouillon"
            }}</span>
          </div>
          <span v-else class="text-gray-400">Filtrer par statut</span>
        </template>

        <template #option="slotProps">
          <div class="flex items-center gap-2">
            <span
              class="w-2 h-2 rounded-full"
              :class="
                slotProps.option.value === 'published'
                  ? 'bg-green-500'
                  : 'bg-amber-500'
              "
            ></span>
            <span>{{ slotProps.option.label }}</span>
          </div>
        </template>
      </Dropdown>

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
          to="/publications/ajouter-une-publication"
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
          <template #image="data">
            <div class="flex items-center justify-center">
              <div class="relative group">
                <img
                  v-if="data.value.image"
                  :src="data.value.image"
                  :alt="data.value.title"
                  class="w-10 h-10 rounded-lg object-cover ring-2 ring-transparent group-hover:ring-indigo-500 transition-all duration-200"
                  @error="handleImageError"
                />
                <div
                  v-else
                  class="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center ring-2 ring-transparent group-hover:ring-indigo-500 transition-all duration-200"
                >
                  <svg
                    class="w-5 h-5 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                <!-- Tooltip au survol -->
                <div
                  class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10 shadow-lg"
                >
                  {{ data.value.title }}
                </div>
              </div>
            </div>
          </template>

          <!-- Titre avec design amélioré -->
          <template #title="data">
            <div class="max-w-xs">
              <NuxtLink
                :to="`/publications/${data.value.slug || data.value.id}/detail`"
                class="group flex items-start gap-2"
              >
                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 truncate"
                  >
                    {{ data.value.title }}
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
                        : truncateText(stripHtml(data.value.content), 40)
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

          <!-- Auteur avec avatar -->
          <template #author_name="data">
            <div class="flex items-center gap-2">
              <div
                class="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium shadow-sm"
              >
                {{ getInitials(data.value.author_name || "Admin") }}
              </div>
              <span class="text-sm text-gray-700 dark:text-gray-300">
                {{ data.value.author_name || "Admin" }}
              </span>
            </div>
          </template>

          <!-- Date avec icône et format élégant -->
          <template #publication_date="data">
            <div class="flex items-center gap-1.5 text-sm">
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span class="text-gray-600 dark:text-gray-400">
                {{
                  formatDate(
                    data.value.publication_date || data.value.created_at,
                  )
                }}
              </span>
            </div>
          </template>

          <!-- Statut avec toggle amélioré -->
          <template #status="data">
            <div class="flex items-center justify-center">
              <!-- Si déjà publié -->
              <div
                v-if="data.value.status === 'published'"
                class="flex items-center gap-2"
              >
                <div class="relative">
                  <div
                    class="w-14 h-7 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center px-1"
                  >
                    <div
                      class="w-5 h-5 bg-green-500 dark:bg-green-600 rounded-full shadow-md transform translate-x-7 transition-all duration-200"
                    ></div>
                  </div>
                  <span class="absolute -top-1 -right-1 flex h-3 w-3">
                    <span
                      class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
                    ></span>
                    <span
                      class="relative inline-flex rounded-full h-3 w-3 bg-green-500"
                    ></span>
                  </span>
                </div>
                <span
                  class="text-xs font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full"
                >
                </span>
              </div>

              <!-- Si non publié -->
              <div v-else class="flex items-center gap-2">
                <button
                  @click="publishBlogs(data.value)"
                  class="relative w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center px-1 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 group"
                  :title="'Cliquer pour publier ' + data.value.title"
                >
                  <div
                    class="w-5 h-5 bg-white dark:bg-gray-400 rounded-full shadow-md transform transition-all duration-200 group-hover:scale-110"
                  ></div>
                </button>
                <span
                  class="text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full"
                >
                </span>
              </div>
            </div>
          </template>

          <!-- Actions avec design amélioré -->
          <template #action="data">
            <div class="flex justify-center gap-1">
              <!-- View -->
              <NuxtLink
                :to="`/publications/${data.value.slug || data.value.id}/detail`"
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
                :to="`/publications/${data.value.slug || data.value.id}/modifier-une-publication`"
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
            to="/publications/liste"
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
            Ajouter une publication
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

import { useBlogStore } from "~~/stores/blog";

const blogStore = useBlogStore();
const { $toastr } = useNuxtApp();

// Références
const showEditModal = ref(false);
const searchQuery = ref("");
const statusFilter = ref(null);
const itemsPerPage = ref(10);

const editForm = ref({
  id: null,
  slug: null,
  title: "",
  author_name: "",
  content: "",
  image: null,
  image_file: null,
  status: "draft",
});


// Options pour le filtre de statut
const statusOptions = [
  { label: "Publié", value: "published" },
  { label: "Brouillon", value: "draft" },
];

// Colonnes de la table
const columns = ref([
  { field: "image", title: "Image", sortable: false, visible: true },
  { field: "title", title: "Titre", sortable: true, visible: true },
  { field: "author_name", title: "Auteur", sortable: true, visible: false },
  {
    field: "date_publication_detail",
    title: "Date",
    sortable: true,
    visible: true,
  },
  { field: "status", title: "Statut", sortable: true, visible: true },
  { field: "action", title: "Actions", sortable: false, visible: true },
]);

const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

// Rows filtrées
const filteredRows = computed(() => {
  let rows = blogStore.blogs.map((blog) => ({
    ...blog,
    title: blog.title || "--",
    author_name: blog.author_name || "Admin",
    date_publication: blog.date_publication,
    date_publication_detail: blog.date_publication_detail,
    status: blog.status || "draft",
    views: blog.views || 0,
    excerpt: blog.excerpt || "",
  }));

  // Filtre par statut
  if (statusFilter.value) {
    rows = rows.filter((blog) => blog.status === statusFilter.value);
  }

  return rows;
});



const clearSearch = () => {
  searchQuery.value = "";
};

const publishBlogs = async (blog) => {
  const { $swal } = useNuxtApp();

  const result = await $swal.fire({
    title: "Publier la publication ?",
    text: `Voulez-vous publier "${blog.title}" ? Cette action est irréversible.`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#10b981",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Oui, publier",
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
      await blogStore.publishBlog(blog.slug);
      await blogStore.fetchBlogs();
      $toastr.success("Publication publiée avec succès");
    } catch (error) {
      console.error("Erreur publication:", error);
      $toastr.error(error.response.data.message);
    }
  }
};

const confirmDelete = async (blog) => {
  const { $swal } = useNuxtApp();
  const result = await $swal.fire({
    title: "Supprimer ?",
    text: `Voulez-vous supprimer "${blog.title}" ?`,
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
      await blogStore.deleteBlog(blog.slug);
      $toastr.success("Publication supprimée avec succès");
      await blogStore.fetchBlogs();
    } catch (error) {
      console.error("Erreur suppression:", error);
      $toastr.error("Impossible de supprimer la publication");
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

const handleImageError = (e) => {
  e.target.src = "https://via.placeholder.com/40x40?text=Image";
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
    await blogStore.fetchBlogs({ per_page: itemsPerPage.value });
  } catch (error) {
    console.error("Erreur chargement:", error);
    $toastr.error("Erreur lors du chargement");
  }
});
</script>
