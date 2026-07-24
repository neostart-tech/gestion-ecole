<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-6 transition-colors">
    <div>

    <!-- En-tête -->
    <div class="flex items-start justify-between mb-5">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
          </svg>
        </div>
        <div>
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Communications</h1>
          <p class="text-sm text-gray-400 dark:text-gray-500">Actualités, annonces officielles et documents partagés</p>
        </div>
      </div>
      <button
        @click="communicationStore.fetchCommunications()"
        class="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center text-gray-400 hover:text-violet-600 hover:border-violet-300 dark:hover:border-violet-800 transition-colors"
        title="Actualiser"
      >
        <svg :class="{ 'animate-spin': communicationStore.isLoading }" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
      </button>
    </div>

    <!-- Onglets -->
    <div class="flex gap-0.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit mb-5 border border-gray-200 dark:border-gray-700">
      <button
        @click="activeTab = 'feed'"
        :class="[
          'px-5 py-1.5 rounded-lg text-sm transition-all',
          activeTab === 'feed'
            ? 'bg-white dark:bg-gray-900 text-violet-600 dark:text-violet-400 font-medium shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        ]"
      >
        Fil d'actualité
      </button>
      <button
        @click="activeTab = 'docs'"
        :class="[
          'px-5 py-1.5 rounded-lg text-sm transition-all',
          activeTab === 'docs'
            ? 'bg-white dark:bg-gray-900 text-violet-600 dark:text-violet-400 font-medium shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        ]"
      >
        Bibliothèque
      </button>
    </div>

    <!-- ─── Onglet Fil d'actualité ─── -->
    <div v-if="activeTab === 'feed'" class="space-y-3">

      <!-- Skeletons de chargement -->
      <template v-if="communicationStore.isLoading && communicationStore.communications.length === 0">
        <div v-for="i in 3" :key="i" class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 animate-pulse">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
            <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded w-24"></div>
          </div>
          <div class="space-y-2">
            <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4"></div>
            <div class="h-3 bg-gray-50 dark:bg-gray-800 rounded w-full"></div>
            <div class="h-3 bg-gray-50 dark:bg-gray-800 rounded w-5/6"></div>
          </div>
        </div>
      </template>

      <!-- Liste des communications -->
      <template v-else-if="communicationStore.communications.length > 0">
        <NuxtLink
          v-for="comm in communicationStore.communications"
          :key="comm.uuid"
          :to="'/annonces/' + comm.uuid"
          class="comm-card group"
        >
          <!-- Top -->
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex items-center gap-2">
              <div :class="['type-icon', comm.type]">
                <svg v-if="comm.type === 'urgent'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <svg v-else-if="comm.type === 'event'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span class="text-xs text-gray-400 dark:text-gray-500">{{ formatDate(comm.created_at) }}</span>
              <span v-if="comm.type === 'urgent'" class="badge-urgent">Urgent</span>
            </div>
            <span v-if="!isRead(comm)" class="badge-new">
              <span class="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0"></span>
              Nouveau
            </span>
          </div>

          <!-- Titre + Extrait -->
          <h2 class="text-sm font-medium text-gray-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors leading-snug">
            {{ comm.title }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">{{ comm.content }}</p>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
            <div v-if="comm.author" class="flex items-center gap-2">
              <div class="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[9px] font-bold text-gray-500 overflow-hidden">
                <img v-if="comm.author.image" :src="comm.author.image" class="w-full h-full object-cover"/>
                <span v-else>{{ comm.author.nom?.[0] }}</span>
              </div>
              <span class="text-xs text-gray-400 dark:text-gray-500">Par {{ comm.author.nom }}</span>
            </div>
            <div class="flex items-center gap-3">
              <div v-if="comm.attachments?.length" class="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                </svg>
                {{ comm.attachments.length }}
              </div>
              <span class="text-xs text-violet-600 dark:text-violet-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Lire la suite
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </div>
        </NuxtLink>

        <!-- Pagination -->
        <div v-if="communicationStore.pagination.last_page > 1" class="flex items-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden w-fit mt-2">
          <button
            @click="changePage(communicationStore.pagination.current_page - 1)"
            :disabled="communicationStore.pagination.current_page === 1"
            class="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-default transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <div class="h-9 flex items-center gap-1 px-4 text-sm border-x border-gray-100 dark:border-gray-800">
            <span class="font-medium text-gray-900 dark:text-white">Page {{ communicationStore.pagination.current_page }}</span>
            <span class="text-gray-300 dark:text-gray-600">/</span>
            <span class="text-gray-400 dark:text-gray-500">{{ communicationStore.pagination.last_page }}</span>
          </div>
          <button
            @click="changePage(communicationStore.pagination.current_page + 1)"
            :disabled="communicationStore.pagination.current_page === communicationStore.pagination.last_page"
            class="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-default transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </template>

      <!-- Vide -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg class="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
        </div>
        <p class="text-sm font-medium text-gray-900 dark:text-white">Tout est calme ici</p>
        <p class="text-sm text-gray-400 dark:text-gray-500">Vous avez consulté toutes les communications.</p>
      </div>
    </div>

    <!-- ─── Onglet Bibliothèque ─── -->
    <div v-else>
      <div class="flex items-center gap-3 mb-4">
        <svg class="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <span class="text-sm font-medium text-gray-900 dark:text-white">Documents partagés</span>
        <span class="text-[11px] font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/40 px-2 py-0.5 rounded-full">
          {{ allDocuments.length }} fichier{{ allDocuments.length > 1 ? 's' : '' }}
        </span>
      </div>

      <div v-if="allDocuments.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="doc in allDocuments"
          :key="doc.id"
          class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex flex-col gap-3 hover:border-violet-200 dark:hover:border-violet-900/50 transition-colors"
        >
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-snug">{{ doc.file_name }}</p>
              <NuxtLink :to="'/annonces/' + doc.comm_uuid" class="text-xs text-gray-400 dark:text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors mt-0.5 block truncate">
                {{ doc.comm_title }}
              </NuxtLink>
            </div>
          </div>
          <div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
            <span class="text-xs text-gray-400 dark:text-gray-500">{{ formatSize(doc.file_size) }}</span>
            <a
              :href="doc.file_url"
              target="_blank"
              class="inline-flex items-center gap-1.5 text-xs font-medium bg-violet-600 text-white px-3 py-1.5 rounded-lg hover:bg-violet-700 transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Consulter
            </a>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg class="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <p class="text-sm font-medium text-gray-900 dark:text-white">Aucun document</p>
        <p class="text-sm text-gray-400 dark:text-gray-500">Aucun document partagé dans les communications récentes.</p>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useCommunicationStore } from '~~/stores/communication';

const communicationStore = useCommunicationStore();
const activeTab = ref('feed');

onMounted(() => {
  communicationStore.fetchCommunications();
  communicationStore.fetchUnreadCount();
});

const allDocuments = computed(() => {
  const docs: any[] = [];
  communicationStore.communications?.forEach(comm => {
    comm.attachments?.forEach((att: any) => {
      docs.push({ ...att, comm_title: comm.title, comm_uuid: comm.uuid });
    });
  });
  return docs;
});

const changePage = (page: number) => communicationStore.fetchCommunications(page);
const isRead     = (comm: any)   => comm.is_read || false;

const formatDate = (d: string) => {
  if (!d) return '';
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d));
};

const formatSize = (bytes: number) => {
  if (!bytes) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
</script>

<style scoped>
@reference "~/assets/css/main.css";

/* ── Comm card ── */
.comm-card {
  @apply block bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800
    rounded-xl p-4 cursor-pointer transition-colors no-underline;
}
.comm-card:hover {
  @apply border-violet-200 dark:border-violet-900/50;
}

/* ── Type icons ── */
.type-icon {
  @apply w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0;
}
.type-icon.info   { @apply bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400; }
.type-icon.urgent { @apply bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400; }
.type-icon.event  { @apply bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400; }

/* ── Badges ── */
.badge-urgent {
  @apply inline-block text-[9px] font-semibold uppercase tracking-wider
    bg-red-50 dark:bg-red-950/40 text-red-500 border border-red-100 dark:border-red-900/40
    px-2 py-px rounded-full;
}
.badge-new {
  @apply inline-flex items-center gap-1.5 text-[10px] font-medium
    text-violet-600 dark:text-violet-400
    bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/40
    px-2 py-0.5 rounded-full flex-shrink-0;
}

/* ── Empty state ── */
.empty-state {
  @apply flex flex-col items-center justify-center py-14 bg-white dark:bg-gray-900
    border border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-center gap-2;
}
.empty-icon {
  @apply w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800
    flex items-center justify-center mb-2;
}
</style>