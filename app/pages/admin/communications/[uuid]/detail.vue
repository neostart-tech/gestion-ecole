<template>
  <div class="p-3 sm:p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
    <!-- Breadcrumbs / Back Button -->
    <div class="mb-8">
      <NuxtLink 
        to="/admin/communications" 
        class="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 mb-4 transition-colors group"
      >
        <svg class="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour à la liste
      </NuxtLink>
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Détails de l'annonce</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Consultez les informations complètes et les statistiques de cette communication.</p>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink
            :to="`/admin/communications/${uuid}/edit`"
            class="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifier
          </NuxtLink>
          <button
            @click="confirmDelete"
            class="inline-flex items-center px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors shadow-sm border border-red-100 dark:border-red-900/30"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-24">
      <div class="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      <p class="mt-4 text-gray-500 animate-pulse">Chargement des détails...</p>
    </div>

    <!-- Content -->
    <div v-else-if="comm" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <!-- Banner / Type -->
          <div :class="getTypeBannerClass(comm.type)" class="h-2 w-full"></div>
          
          <div class="p-6 md:p-8">
            <div class="flex items-center gap-3 mb-4">
              <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full" :class="getTypeBadgeClass(comm.type)">
                {{ comm.type }}
              </span>
              <span class="text-gray-400">•</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">Publié le {{ formatDate(comm.created_at) }}</span>
            </div>

            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">{{ comm.title }}</h2>
            
            <div class="prose prose-violet dark:prose-invert max-w-none">
              <div v-html="comm.content" class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap"></div>
            </div>

            <!-- Attachments Section -->
            <div v-if="comm.attachments?.length" class="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Pièces jointes ({{ comm.attachments.length }})
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                  v-for="file in comm.attachments" 
                  :key="file.id"
                  :href="file.url"
                  target="_blank"
                  class="flex items-center p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group"
                >
                  <div class="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="ml-4 overflow-hidden">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ file.name }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatSize(file.size) }}</p>
                  </div>
                  <svg class="w-4 h-4 ml-auto text-gray-400 group-hover:text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar Info -->
      <div class="space-y-6">
        <!-- Stats Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <svg class="w-4 h-4 mr-2 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Statistiques de lecture
          </h3>
          
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl mb-4">
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ comm.readers_count || 0 }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Vues totales</p>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Targeting Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <svg class="w-4 h-4 mr-2 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Audience ciblée
          </h3>
          
          <div class="space-y-4">
            <div>
              <p class="text-xs text-gray-400 mb-1 capitalize">Type de ciblage</p>
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ getTargetLabel(comm.target_type) }}</p>
            </div>
            
            <div v-if="comm.target_data_details?.length || comm.target_data?.length">
              <p class="text-xs text-gray-400 mb-2">Détails des cibles</p>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="(target, idx) in (comm.target_data_details || comm.target_data)" 
                  :key="idx"
                  class="px-2 py-1 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 text-[10px] font-semibold rounded-md border border-violet-100 dark:border-violet-900/30"
                >
                  {{ target }}
                </span>
              </div>
            </div>

            <div class="pt-4 border-t border-gray-50 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">Statut de publication</span>
                <span 
                  class="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase"
                  :class="comm.is_published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'"
                >
                  {{ comm.is_published ? 'Publié' : 'Brouillon' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCommunicationStore } from '~~/stores/communication';
import Swal from 'sweetalert2';

definePageMeta({
  layout: 'default',
});

const route = useRoute();
const router = useRouter();
const communicationStore = useCommunicationStore();

const uuid = route.params.uuid as string;
const isLoading = ref(true);

const comm = computed(() => communicationStore.currentCommunication);

onMounted(async () => {
  try {
    await communicationStore.fetchCommunication(uuid);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Impossible de charger les détails de l\'annonce.',
      confirmButtonText: 'Retour',
      confirmButtonColor: '#7c3aed'
    }).then(() => {
      router.push('/admin/communications');
    });
  } finally {
    isLoading.value = false;
  }
});

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getTargetLabel = (type: string) => {
  switch (type) {
    case 'all': return 'Tout le monde';
    case 'roles': return 'Rôles spécifiques';
    case 'specific_users': return 'Utilisateurs ciblés';
    default: return type;
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

const getTypeBannerClass = (type: string) => {
  switch (type) {
    case 'urgent': return 'bg-red-500';
    case 'event': return 'bg-blue-500';
    case 'info': return 'bg-violet-500';
    default: return 'bg-gray-500';
  }
};

const confirmDelete = () => {
  Swal.fire({
    title: 'Supprimer cette annonce ?',
    text: "Cette action est irréversible !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    borderRadius: '10px'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await communicationStore.deleteCommunication(uuid);
        Swal.fire({
          title: 'Supprimé !',
          text: 'L\'annonce a été supprimée.',
          icon: 'success',
          borderRadius: '10px',
          timer: 2000,
          showConfirmButton: false
        });
        router.push('/admin/communications');
      } catch (error) {
        Swal.fire({
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la suppression.',
          icon: 'error',
          borderRadius: '10px'
        });
      }
    }
  });
};
</script>

<style scoped>
.prose :deep(img) {
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>
