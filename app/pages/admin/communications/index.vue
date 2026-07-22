<template>
  <div class="p-3 sm:p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestion de la Communication</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Créez et gérez les annonces pour les étudiants et le personnel.</p>
      </div>
      <div class="mt-4 md:mt-0">
        <Can action="create-communication">
          <NuxtLink
            to="/admin/communications/create"
            class="inline-flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle Annonce
          </NuxtLink>
        </Can>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
            <svg class="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Annonces</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ communicationStore.pagination?.total || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Bar & Column Picker -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="flex flex-col sm:flex-row items-center gap-4 flex-1">
        <div class="relative w-full sm:w-64">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-violet-500 focus:border-violet-500 text-sm transition-colors"
          />
        </div>
        <select v-model="selectedType" class="w-full sm:w-auto border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-violet-500 focus:border-violet-500 transition-colors">
          <option value="">Tous les types</option>
          <option value="info">Information</option>
          <option value="urgent">Urgent</option>
          <option value="event">Événement</option>
        </select>
      </div>

      <!-- Column Picker -->
      <div class="relative z-20">
        <button 
          @click="showColumnPicker = !showColumnPicker"
          class="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
        >
          Colonnes
          <svg class="w-4 h-4 transition-transform duration-200" :class="{'rotate-180': showColumnPicker}" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M6 9l6 6 6-6" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
        <div v-if="showColumnPicker" class="absolute right-0 mt-2 w-56 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <div class="space-y-2">
            <div v-for="col in columns" :key="col.field" class="flex items-center gap-2 py-1">
              <input 
                type="checkbox" 
                v-model="col.visible" 
                :disabled="col.field === 'actions' || col.field === 'title'"
                class="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" 
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ col.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Datatable -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative z-10 p-3 sm:p-4">
      <div v-if="communicationStore.isLoading" class="flex justify-center py-20">
        <div class="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="visibleColumns"
          :rows="filteredRows"
          :search="searchQuery"
          :per-page="10"
          skin="bh-table-striped bh-table-hover"
          sortable
          class="w-full"
        >
          <!-- Annonce (Titre + Contenu) -->
          <template #title="data">
            <div class="flex items-start py-2">
              <div :class="getTypeClass(data.value.type)" class="w-2 h-2 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
              <div class="min-w-0 flex-1">
                <div class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ data.value.title }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-sm">{{ stripHtml(data.value.content) }}</div>
              </div>
            </div>
          </template>

          <!-- Type -->
          <template #type="data">
            <span class="capitalize text-[11px] font-bold px-2 py-1 rounded-lg whitespace-nowrap" :class="getTypeBadgeClass(data.value.type)">
              {{ data.value.type }}
            </span>
          </template>

          <!-- Cible -->
          <template #target_type="data">
            <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg whitespace-nowrap">
              {{ getTargetLabel(data.value.target_type) }}
            </span>
          </template>

          <!-- Fichiers -->
          <template #attachments="data">
            <div class="flex items-center">
              <span v-if="data.value.attachments?.length" class="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {{ data.value.attachments.length }}
              </span>
              <span v-else class="text-[10px] text-gray-400 dark:text-gray-500 italic">Aucun</span>
            </div>
          </template>

          <!-- Statut -->
          <template #is_published="data">
            <span 
              class="px-2 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg whitespace-nowrap"
              :class="data.value.is_published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'"
            >
              {{ data.value.is_published ? 'Publié' : 'Brouillon' }}
            </span>
          </template>

          <!-- Lectures -->
          <template #readers_count="data">
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg class="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {{ data.value.readers_count || 0 }}
            </div>
          </template>

          <!-- Date -->
          <template #created_at="data">
            <div class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {{ formatDate(data.value.created_at) }}
            </div>
          </template>

          <!-- Actions -->
          <template #actions="data">
            <div class="flex justify-end gap-2">
              <NuxtLink
                :to="`/admin/communications/${data.value.uuid}/detail`"
                class="p-2 rounded-lg text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                title="Détails"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </NuxtLink>
              <NuxtLink
                :to="`/admin/communications/${data.value.uuid}/edit`"
                class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                title="Modifier"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </NuxtLink>
              <Can action="delete-communication">
                <button
                  @click="confirmDelete(data.value.uuid)"
                  class="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  title="Supprimer"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </Can>
            </div>
          </template>
        </Vue3Datatable>
      </div>

      <!-- Pagination -->
      <div v-if="communicationStore.pagination?.last_page > 1" class="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <button
          @click="changePage(communicationStore.pagination.current_page - 1)"
          :disabled="communicationStore.pagination.current_page === 1"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Précédent
        </button>
        <span class="text-sm text-gray-600 dark:text-gray-400">
          Page {{ communicationStore.pagination.current_page }} sur {{ communicationStore.pagination.last_page }}
        </span>
        <button
          @click="changePage(communicationStore.pagination.current_page + 1)"
          :disabled="communicationStore.pagination.current_page === communicationStore.pagination.last_page"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCommunicationStore } from '~~/stores/communication';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import '@bhplugin/vue3-datatable/dist/style.css';
import Swal from 'sweetalert2';

definePageMeta({
  layout: 'default',
});

const communicationStore = useCommunicationStore();

const searchQuery = ref('');
const selectedType = ref('');
const showColumnPicker = ref(false);

const columns = ref([
  { field: 'title', title: 'Annonce', sortable: true, visible: true },
  { field: 'type', title: 'Type', sortable: true, visible: true },
  { field: 'target_type', title: 'Cible', sortable: true, width: '120px', visible: false },
  { field: 'attachments', title: 'Fichiers', sortable: false, width: '100px', visible: true },
  { field: 'is_published', title: 'Statut', sortable: true, width: '100px', visible: true },
  { field: 'readers_count', title: 'Lectures', sortable: true, width: '100px', visible: false },
  { field: 'created_at', title: 'Date', sortable: true, width: '150px', visible: true },
  { field: 'actions', title: 'Actions', sortable: false, width: '120px', headerClass: 'justify-end', visible: true },
]);

const visibleColumns = computed(() => columns.value.filter(col => col.visible));

const filteredRows = computed(() => {
  let rows = communicationStore.communications || [];
  if (selectedType.value) {
    rows = rows.filter(r => r.type === selectedType.value);
  }
  return rows;
});

onMounted(() => {
  communicationStore.fetchAdminCommunications();
});

const changePage = (page: number) => {
  communicationStore.fetchAdminCommunications(page);
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const stripHtml = (html: string) => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
};

const getTypeClass = (type: string) => {
  switch (type) {
    case 'urgent': return 'bg-red-500';
    case 'event': return 'bg-blue-500';
    case 'info': return 'bg-violet-500';
    default: return 'bg-gray-500';
  }
};

const getTypeBadgeClass = (type: string) => {
  switch (type) {
    case 'urgent': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'event': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'info': return 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
  }
};

const getTargetLabel = (type: string) => {
  switch (type) {
    case 'all': return 'Tous';
    case 'roles': return 'Par Rôles';
    case 'specific_users': return 'Ciblé';
    default: return type;
  }
};

const confirmDelete = (uuid: string) => {
  Swal.fire({
    title: 'Supprimer cette annonce ?',
    text: "Cette action est irréversible !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#7c3aed',
    cancelButtonColor: '#ef4444',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    borderRadius: '5px'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await communicationStore.deleteCommunication(uuid);
        Swal.fire({
          title: 'Supprimé !',
          text: 'L\'annonce a été supprimée.',
          icon: 'success',
          borderRadius: '5px'
        });
      } catch (error) {
        Swal.fire({
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la suppression.',
          icon: 'error',
          borderRadius: '5px'
        });
      }
    }
  });
};
</script>

<style scoped>
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>
