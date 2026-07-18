<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Administration', to: '/' },
        { label: 'Actualités', to: null },
      ]"
      title="Liste des actualités"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Toolbar -->
    <div class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5">
      <!-- Recherche -->
      <div class="relative w-full lg:w-64">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
        />
        <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Bouton d'ajout -->
        <NuxtLink
          to="/info-urgente/ajouter-une-information-urgente"
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200 transform hover:scale-105"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round" />
          </svg>
          Ajouter une actualité
        </NuxtLink>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4 overflow-hidden border border-gray-200 dark:border-gray-700">
      <div v-if="isLoading" class="flex justify-center py-16">
        <div class="h-16 w-16 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="columns"
          :rows="filteredRows"
          :search="searchQuery"
          :per-page="10"
          skin="bh-table-striped bh-table-hover"
          sortable
          class="w-full"
        >
          <!-- Colonne Image -->
          <template #image="data">
            <div class="flex justify-center">
              <img 
                v-if="data.value.image" 
                :src="data.value.image" 
                class="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm"
                alt="Miniature"
              />
              <div v-else class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 012-2V6a2 2 0 01-2-2H6a2 2 0 01-2 2v12a2 2 0 012 2z" />
                </svg>
              </div>
            </div>
          </template>

          <!-- Colonne Cible -->
          <template #target_audience="data">
            <div class="flex flex-col gap-1">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {{ formatAudience(data.value.target_audience) }}
              </span>
              <span v-if="data.value.target_group" class="text-[10px] text-gray-500 font-bold uppercase truncate max-w-[100px]">
                 {{ data.value.target_group.nom || data.value.target_group.name }}
              </span>
            </div>
          </template>

          <!-- Titre / Résumé -->
          <template #title="data">
            <div class="max-w-xs">
              <p class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ data.value.title }}</p>
              <p class="text-xs text-gray-500 truncate">{{ stripHtml(data.value.summary) }}</p>
            </div>
          </template>

          <!-- Fichiers -->
          <template #attachments="data">
            <div class="flex items-center gap-1">
              <span v-if="data.value.attachments?.length" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-700">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                {{ data.value.attachments.length }}
              </span>
              <span v-else class="text-[10px] text-gray-400">Aucun</span>
            </div>
          </template>

          <!-- Statut con toggle -->
          <template #status="data">
            <div class="flex items-center justify-center">
              <button
                @click="toggleStatus(data.value)"
                :class="[
                  'relative w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200',
                  data.value.is_published === true ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-200 dark:bg-gray-700'
                ]"
              >
                <div
                  :class="[
                    'w-4 h-4 rounded-full shadow transform transition-all duration-200',
                    data.value.is_published === true ? 'bg-green-500 translate-x-6' : 'bg-white translate-x-0'
                  ]"
                ></div>
              </button>
            </div>
          </template>

          <!-- Actions -->
          <template #action="data">
            <div class="flex justify-center gap-1">
               <a :href="`/actualites/${data.value.slug || data.value.id}`" target="_blank" class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Prévisualiser sur le site">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
               <NuxtLink :to="`/info-urgente/${data.value.slug || data.value.id}/detail`" class="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </NuxtLink>
              <NuxtLink :to="`/info-urgente/${data.value.slug || data.value.id}/modifier-une-information-urgente`" class="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </NuxtLink>
              <button @click="confirmDelete(data.value)" class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useUrgentInfoStore } from "~~/stores/urgent-info";

// Store
const urgentinfoStore = useUrgentInfoStore();
const { $toastr, $swal } = useNuxtApp();

// État
const searchQuery = ref("");
const isLoading = computed(() => urgentinfoStore.isLoading);

// Colonnes
const columns = [
  { field: "image", title: "Image", sortable: false, width: "70px" },
  { field: "title", title: "Actualité", sortable: true },
  { field: "target_audience", title: "Cible", sortable: true },
  { field: "attachments", title: "Fichiers", sortable: false, width: "80px" },
  { field: "status", title: "Statut", sortable: true, width: "80px" },
  { field: "action", title: "Actions", sortable: false, width: "120px" },
];

const filteredRows = computed(() => urgentinfoStore.urgentinfos);

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
};

const formatAudience = (aud) => {
  const map = {
    'all': 'Tous',
    'students': 'Étudiants',
    'teachers': 'Enseignants',
    'administration': 'Administration',
    'group': 'Groupe'
  };
  return map[aud] || aud;
};

const toggleStatus = async (item) => {
  try {
    if (item.is_published) {
      await urgentinfoStore.unPublishUrgentInfo(item.id);
      $toastr.success("Actualité dépubliée");
    } else {
      await urgentinfoStore.publishUrgentInfo(item.id);
      $toastr.success("Actualité publiée (notification envoyée)");
    }
    await urgentinfoStore.fetchUrgentInfos();
  } catch (error) {
    $toastr.error("Erreur de modification");
  }
};

const confirmDelete = async (item) => {
  const result = await $swal.fire({
    title: "Supprimer ?",
    text: "Action irréversible.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    confirmButtonText: "Supprimer"
  });

  if (result.isConfirmed) {
    try {
      await urgentinfoStore.deleteUrgentInfo(item.id);
      $toastr.success("Supprimé");
    } catch (error) {
      $toastr.error("Erreur");
    }
  }
};

onMounted(() => {
  urgentinfoStore.fetchUrgentInfos();
});
</script>
