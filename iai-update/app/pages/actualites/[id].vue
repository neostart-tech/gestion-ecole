<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      
      <!-- Breadcrumb -->
      <div class="mb-6">
        <Breadcrumb
          :items="breadcrumbItems"
          title="Actualités & Communiqués"
          title-class="text-base sm:text-lg font-medium text-gray-600"
          spacing="mb-4"
        />
      </div>

      <!-- Back Button -->
      <NuxtLink 
        v-if="actualite"
        to="/actualites" 
        class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#7C86FF] transition-colors mb-6 group"
      >
        <svg class="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        <span>Retour</span>
      </NuxtLink>

      <!-- Loading -->
      <div v-if="isLoading" class="space-y-6 animate-pulse">
        <div class="h-6 bg-gray-200 rounded-lg w-1/3"></div>
        <div class="h-48 bg-gray-200 rounded-xl"></div>
        <div class="space-y-3">
          <div class="h-3 bg-gray-200 rounded-full w-full"></div>
          <div class="h-3 bg-gray-200 rounded-full w-11/12"></div>
          <div class="h-3 bg-gray-200 rounded-full w-2/3"></div>
        </div>
      </div>

      <article v-else-if="actualite" class="space-y-8">
        
        <!-- Header -->
        <header class="space-y-4">
          <div class="flex flex-wrap items-center gap-3">
            <span 
              class="px-3 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider"
              :class="actualite.target_audience === 'all' 
                ? 'bg-[#7C86FF]/10 text-[#7C86FF]' 
                : 'bg-amber-50 text-amber-600'"
            >
              {{ actualite.target_audience === 'all' ? 'Annonce générale' : 'Information ciblée' }}
            </span>
            
            <span class="w-1 h-1 rounded-full bg-gray-300"></span>
            
            <time class="text-xs text-gray-400 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate(actualite.publishedAt || actualite.created_at) }}
            </time>

            <span v-if="isRecent(actualite.publishedAt || actualite.created_at)" 
                  class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-500 text-[10px] font-medium flex items-center gap-1">
              <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Nouveau
            </span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-semibold text-gray-800 leading-tight tracking-tight">
            {{ actualite.title }}
          </h1>
          
          <p v-if="actualite.subtitle" class="text-base text-gray-500 leading-relaxed">
            {{ actualite.subtitle }}
          </p>
        </header>

        <!-- Image -->
        <div v-if="actualite.image" class="relative rounded-xl overflow-hidden bg-gray-100">
          <img 
            :src="actualite.image" 
            :alt="actualite.title" 
            class="w-full h-auto max-h-[400px] object-cover"
            loading="lazy"
          />
        </div>

        <!-- Content -->
        <div class="bg-white rounded-xl border border-gray-100 p-6 sm:p-8">
          <div 
            v-html="actualite.summary"
            class="prose prose-sm max-w-none 
                   prose-headings:text-gray-800 prose-headings:font-semibold
                   prose-h1:text-2xl prose-h1:mt-6 prose-h1:first:mt-0
                   prose-h2:text-xl prose-h2:mt-5
                   prose-h3:text-lg prose-h3:mt-4
                   prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
                   prose-strong:text-gray-700 prose-strong:font-semibold
                   prose-a:text-[#7C86FF] prose-a:no-underline hover:prose-a:underline
                   prose-ul:my-4 prose-li:text-gray-600
                   prose-blockquote:border-l-[#7C86FF] prose-blockquote:bg-gray-50 prose-blockquote:p-4 prose-blockquote:rounded-lg
                   prose-img:rounded-lg prose-img:my-4
                   break-words"
          ></div>

          <!-- Tags -->
          <div v-if="actualite.tags?.length" class="mt-8 flex flex-wrap gap-2">
            <div class="flex items-center gap-1 mr-2">
              <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
            <span v-for="tag in actualite.tags" :key="tag" 
                  class="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-xs hover:bg-[#7C86FF]/10 hover:text-[#7C86FF] transition-colors cursor-pointer">
              {{ tag }}
            </span>
          </div>

          <!-- Attachments -->
          <div v-if="actualite.attachments?.length" class="mt-10 pt-8 border-t border-gray-100">
            <div class="flex items-center gap-2 mb-5">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <h3 class="text-sm font-medium text-gray-700">Documents</h3>
              <span class="text-xs text-gray-400 ml-auto">{{ actualite.attachments.length }} fichier(s)</span>
            </div>
            
            <div class="space-y-2">
              <a 
                v-for="(file, idx) in actualite.attachments" 
                :key="idx"
                :href="file.url"
                target="_blank"
                class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-white hover:shadow-sm border border-gray-100 transition-all group"
              >
                <div class="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#7C86FF] transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a2 2 0 00-.586-1.414l-5.414-5.414A2 2 0 0011.586 2H7a2 2 0 00-2 2v15a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-700 truncate group-hover:text-[#7C86FF] transition-colors">{{ file.name }}</p>
                  <p class="text-[10px] text-gray-400 flex items-center gap-1">
                    <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {{ formatFileSize(file.size) }}
                  </p>
                </div>
                <svg class="w-4 h-4 text-gray-300 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

      
     
      </article>

      <!-- 404 -->
      <div v-else class="text-center py-16 bg-white rounded-xl border border-gray-100">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Contenu introuvable</h2>
        <p class="text-sm text-gray-400 mb-6">L'actualité recherchée n'existe pas ou a été déplacée.</p>
        <NuxtLink to="/actualites" class="inline-flex items-center gap-2 px-5 py-2 bg-[#7C86FF] text-white rounded-lg text-sm font-medium hover:bg-[#6B76F0] transition-all">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h18M3 12l4-4m-4 4l4 4" />
          </svg>
          Voir les actualités
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUrgentInfoStore } from '~~/stores/urgent-info';

const route = useRoute();
const urgentInfoStore = useUrgentInfoStore();
const actualite = ref(null);
const isLoading = ref(true);

const breadcrumbItems = computed(() => [
  { label: 'Accueil', to: '/' },
  { label: 'Actualités', to: '/actualites' },
  ...(actualite.value ? [{ label: actualite.value.title, to: null }] : [])
]);

onMounted(async () => {
  try {
    const data = await urgentInfoStore.fetchUrgentInfo(route.params.id);
    
    if (data && process.client) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userRoles = (userData?.roles || []).map(r => r.slug);
      const userGroupId = userData.etudiant?.groupe_id || null;
      const isAdmin = userRoles.some(r => ['admin', 'directeur-general', 'responsable-du-site'].includes(r));

      let hasAccess = true;
      if (!isAdmin) {
        switch (data.target_audience) {
          case 'students': hasAccess = userRoles.includes('etudiant'); break;
          case 'teachers': hasAccess = userRoles.includes('enseignant'); break;
          case 'administration': hasAccess = userRoles.some(r => !['etudiant', 'enseignant'].includes(r)); break;
          case 'group': hasAccess = userGroupId && data.target_group_id == userGroupId; break;
        }
      }

      if (!hasAccess) {
        alert("Vous n'avez pas les droits pour consulter cette publication.");
        return navigateTo('/actualites');
      }
    }

    actualite.value = data;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error("Détail actualité introuvable:", error);
  } finally {
    isLoading.value = false;
  }
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatFileSize = (bytes) => {
  if (!bytes) return 'N/A';
  const k = 1024;
  const sizes = ['o', 'Ko', 'Mo', 'Go'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const isRecent = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};
</script>

<style scoped>
:deep(.prose) {
  --tw-prose-body: #6B7280;
  --tw-prose-headings: #374151;
  --tw-prose-lead: #4B5563;
  --tw-prose-links: #7C86FF;
  --tw-prose-bold: #374151;
  --tw-prose-counters: #9CA3AF;
  --tw-prose-bullets: #D1D5DB;
  --tw-prose-hr: #E5E7EB;
  --tw-prose-quotes: #374151;
  --tw-prose-quote-borders: #7C86FF;
  --tw-prose-captions: #6B7280;
  --tw-prose-code: #374151;
  --tw-prose-pre-code: #E5E7EB;
  --tw-prose-pre-bg: #1F2937;
  --tw-prose-th-borders: #D1D5DB;
  --tw-prose-td-borders: #E5E7EB;
}
</style>