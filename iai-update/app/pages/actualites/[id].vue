<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 p-4 md:p-8 transition-all duration-500 font-sans relative overflow-hidden">
    
    <!-- Décorations d'arrière-plan -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/0 blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tl from-emerald-500/10 to-teal-500/0 blur-3xl pointer-events-none"></div>

    <div class="relative z-10 max-w-4xl mx-auto">
      
      <!-- Breadcrumb -->
      <div v-if="breadcrumbItems.length" class="mb-6">
        <Breadcrumb
          :items="breadcrumbItems"
          :title="actualite?.title || 'Détails'"
          title-class="text-base sm:text-lg font-black text-slate-700 dark:text-slate-300"
        />
      </div>

      <!-- Detail Area -->
      <div v-if="isLoading" class="space-y-8">
        <div class="h-10 w-2/3 bg-white/40 dark:bg-gray-800/40 rounded-2xl animate-pulse"></div>
        <div class="h-[400px] bg-white/40 dark:bg-gray-800/40 rounded-3xl animate-pulse"></div>
        <div class="space-y-4">
          <div class="h-4 bg-white/40 dark:bg-gray-800/40 rounded-full w-full animate-pulse"></div>
          <div class="h-4 bg-white/40 dark:bg-gray-800/40 rounded-full w-5/6 animate-pulse"></div>
        </div>
      </div>

      <article v-else-if="actualite" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <!-- Back Button -->
        <NuxtLink 
          to="/actualites" 
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/50 dark:border-gray-700 text-sm font-black text-slate-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group shadow-sm"
        >
          <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <span>Retour aux actualités</span>
        </NuxtLink>

        <!-- Header -->
        <header class="space-y-6">
          <div class="flex flex-wrap items-center gap-4">
            <span 
              class="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest leading-none shadow-sm"
              :class="actualite.target_audience === 'all' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-amber-500 text-white'"
            >
              {{ actualite.target_audience === 'all' ? 'Communiqué' : 'Information Ciblée' }}
            </span>
            
            <div class="flex items-center gap-2 text-slate-500 dark:text-gray-400 font-bold text-[11px] uppercase tracking-wider">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate(actualite.publishedAt || actualite.created_at) }}
            </div>
          </div>

          <h1 class="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tighter uppercase">
            {{ actualite.title }}
          </h1>
          
          <p v-if="actualite.subtitle" class="text-xl text-slate-600 dark:text-gray-400 leading-relaxed font-semibold italic border-l-4 border-indigo-500 pl-6">
            {{ actualite.subtitle }}
          </p>
        </header>

        <!-- Featured Image -->
        <div v-if="actualite.image" class="relative group rounded-[2rem] overflow-hidden bg-white/20 dark:bg-black/20 border border-white/50 dark:border-gray-700/50 shadow-2xl">
          <img 
            :src="actualite.image" 
            :alt="actualite.title" 
            class="w-full h-auto max-h-[600px] object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </div>

        <!-- Main Content -->
        <div class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-[2.5rem] border border-white dark:border-gray-800 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div 
            v-html="actualite.summary"
            class="prose prose-slate dark:prose-invert max-w-none 
                   prose-p:text-lg prose-p:leading-relaxed prose-p:text-slate-700 dark:prose-p:text-gray-300
                   prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:font-black prose-headings:tracking-tighter
                   prose-strong:text-indigo-600 dark:prose-strong:text-indigo-400
                   prose-blockquote:border-l-indigo-500 prose-blockquote:bg-indigo-50 dark:prose-blockquote:bg-indigo-500/10 prose-blockquote:rounded-2xl
                   prose-img:rounded-3xl prose-img:shadow-xl
                   break-words"
          ></div>

          <!-- Documents -->
          <div v-if="actualite.attachments?.length" class="mt-16 pt-10 border-t border-slate-200 dark:border-gray-800">
            <h3 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
              <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Documents à télécharger
            </h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a 
                v-for="(file, idx) in actualite.attachments" 
                :key="idx"
                :href="file.url"
                target="_blank"
                class="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-gray-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div class="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a2 2 0 00-.586-1.414l-5.414-5.414A2 2 0 0011.586 2H7a2 2 0 00-2 2v15a2 2 0 002 2z"/></svg>
                </div>
                <div class="flex-1 min-w-0">
                   <p class="text-sm font-black text-slate-800 dark:text-white truncate">{{ file.name }}</p>
                   <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{{ formatFileSize(file.size) }}</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </article>

      <!-- Not Found/Error -->
      <div v-else class="text-center py-24 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-gray-700 shadow-2xl">
        <div class="w-24 h-24 bg-slate-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <h2 class="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">Publication introuvable</h2>
        <p class="text-slate-500 dark:text-slate-400 font-semibold mb-10 max-w-md mx-auto">Cette information n'est plus disponible ou vous n'avez pas les autorisations nécessaires.</p>
        <NuxtLink to="/actualites" class="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-500/25 hover:scale-105 transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 12h18M3 12l4-4m-4 4l4 4"/></svg>
          Retour à la liste
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUrgentInfoStore } from '~~/stores/urgent-info';
import Breadcrumb from '~/components/Breadcrumb.vue';

const route = useRoute();
const router = useRouter();
const urgentInfoStore = useUrgentInfoStore();
const actualite = ref(null);
const isLoading = ref(true);

const breadcrumbItems = computed(() => {
  const items = [
    { label: 'Accueil', to: '/' },
    { label: 'Actualités', to: '/actualites' }
  ];
  if (actualite.value) {
    items.push({ label: actualite.value.title, to: null });
  }
  return items;
});

onMounted(async () => {
  try {
    const data = await urgentInfoStore.fetchUrgentInfo(route.params.id);
    
    if (data && process.client) {
      let userData = {};
      try {
        const stored = localStorage.getItem('user');
        if (stored && stored !== 'undefined') {
          userData = JSON.parse(stored);
        }
      } catch (e) {
        console.error("Erreur parsing user data", e);
      }

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
        console.warn("Accès refusé");
        return router.push('/actualites');
      }
    }

    actualite.value = data;
    if (process.client) window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error("Erreur lors du chargement de l'actualité:", error);
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
</script>

<style scoped>
.prose {
  max-width: none;
}
</style>