<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-6 transition-colors">
    <div class="max-w-5xl mx-auto">

      <!-- Retour -->
      <NuxtLink
        to="/annonces"
        class="inline-flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 mb-5 transition-colors group"
      >
        <div class="w-7 h-7 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover:border-violet-300 dark:group-hover:border-violet-800 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
        </div>
        Retour aux annonces
      </NuxtLink>

      <!-- Skeleton -->
      <div v-if="isLoading" class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden animate-pulse">
        <div class="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div class="flex items-center gap-2 mb-3">
            <div class="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div class="h-3 w-24 bg-gray-100 dark:bg-gray-700 rounded"></div>
          </div>
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div class="h-6 bg-gray-100 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div class="space-y-1">
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
              <div class="h-2 bg-gray-100 dark:bg-gray-700 rounded w-20"></div>
            </div>
          </div>
        </div>
        <div class="p-5 space-y-2">
          <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
          <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
          <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded w-2/3"></div>
        </div>
      </div>

      <!-- Annonce -->
      <article v-else-if="announcement" class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">

        <!-- Header -->
        <div class="px-5 py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
          <div class="flex items-center gap-2 mb-3">
            <span :class="['type-badge', announcement.type || 'info']">
              {{ announcement.type === 'urgent' ? 'Important' : announcement.type === 'event' ? 'Événement' : 'Information' }}
            </span>
            <span class="text-xs text-gray-400 dark:text-gray-500">{{ formatDate(announcement.created_at) }}</span>
          </div>

          <h1 class="text-lg font-semibold text-gray-900 dark:text-white leading-snug mb-4">
            {{ announcement.title }}
          </h1>

          <div v-if="announcement.author" class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-semibold text-gray-500 overflow-hidden flex-shrink-0">
              <img v-if="announcement.author.image" :src="announcement.author.image" class="w-full h-full object-cover"/>
              <span v-else>{{ announcement.author.nom?.[0] }}</span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ announcement.author.nom }}</p>
              <p class="text-xs text-gray-400 dark:text-gray-500">Administration IAI</p>
            </div>
          </div>
        </div>

        <!-- Corps -->
        <div class="px-5 py-5">
          <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {{ announcement.content }}
          </p>

          <!-- Pièces jointes -->
          <div v-if="announcement.attachments?.length" class="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
              </svg>
              <span class="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Pièces jointes</span>
              <span class="text-[11px] font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/40 px-2 py-px rounded-full">
                {{ announcement.attachments.length }} fichier{{ announcement.attachments.length > 1 ? 's' : '' }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                v-for="file in announcement.attachments"
                :key="file.id"
                :href="file.file_url"
                target="_blank"
                class="attach-card group"
              >
                <div class="w-8 h-8 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0 group-hover:border-violet-200 dark:group-hover:border-violet-800 transition-colors">
                  <svg class="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {{ file.original_name || file.file_name }}
                  </p>
                  <div class="flex items-center gap-1.5 mt-0.5">
                    <span class="text-xs text-gray-400 dark:text-gray-500">{{ formatSize(file.file_size) }}</span>
                    <span class="text-gray-200 dark:text-gray-700">·</span>
                    <span class="text-xs text-violet-600 dark:text-violet-400 flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                      Télécharger
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
          <p class="text-xs text-gray-400 dark:text-gray-500 text-center">
            Cette communication est destinée aux membres de {{ appName || "l'établissement" }}.
          </p>
        </div>

      </article>

      <!-- Introuvable -->
      <div v-else class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-14 text-center">
        <div class="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
        </div>
        <h2 class="text-base font-medium text-gray-900 dark:text-white mb-1">Annonce introuvable</h2>
        <p class="text-sm text-gray-400 dark:text-gray-500 mb-5">L'annonce que vous recherchez n'existe pas ou a été supprimée.</p>
        <NuxtLink to="/annonces" class="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors">
          Retour à la liste
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCommunicationStore } from '~~/stores/communication';
import { useParametreStore } from '~~/stores/parametre';
import axios from 'axios';

const route               = useRoute();
const communicationStore  = useCommunicationStore();
const parametreStore      = useParametreStore();
const announcement        = ref<any>(null);
const isLoading           = ref(true);

const appName = computed(() => parametreStore.getAppName);

onMounted(async () => {
  parametreStore.fetchParametres();
  const uuid = route.params.uuid;
  try {
    const response = await axios.get(`/communications/${uuid}`, communicationStore.getHeaders());
    announcement.value = response.data;
    if (!announcement.value.is_read) {
      communicationStore.markAsRead(uuid as string);
    }
  } catch (error) {
    console.error('Erreur chargement annonce:', error);
  } finally {
    isLoading.value = false;
  }
});

const formatDate = (d: string) => {
  if (!d) return '';
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(d));
};

const formatSize = (bytes: number) => {
  if (!bytes) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
</script>

<style scoped>
@reference "tailwindcss";

/* ── Type badges ── */
.type-badge {
  @apply inline-block text-[10px] font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-full border;
}
.type-badge.info   { @apply bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-900/40; }
.type-badge.urgent { @apply bg-red-50 text-red-500 border-red-100 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/40; }
.type-badge.event  { @apply bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40; }

/* ── Fichiers joints ── */
.attach-card {
  @apply flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50
    border border-gray-100 dark:border-gray-700 rounded-lg
    hover:border-violet-200 dark:hover:border-violet-900/50
    transition-colors no-underline;
}
</style>