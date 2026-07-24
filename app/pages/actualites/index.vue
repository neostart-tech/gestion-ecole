<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 p-4 md:p-8 transition-all duration-500 font-sans relative overflow-hidden">
    
    <!-- Décorations d'arrière-plan -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/0 blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tl from-emerald-500/10 to-teal-500/0 blur-3xl pointer-events-none"></div>

    <div class="relative z-10 max-w-7xl mx-auto">
      <!-- Breadcrumb + Titre -->
      <div class="mb-8">
        <Breadcrumb
          :items="[
            { label: 'Accueil', to: '/' },
            { label: 'Actualités & Communiqués', to: null },
          ]"
          title="Actualités & Communiqués"
          title-class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 tracking-tighter uppercase drop-shadow-sm"
          spacing="mb-2"
        />
        <p class="text-slate-500 dark:text-gray-400 font-semibold text-sm flex items-center gap-2">
          <span class="w-2.5 h-2.5 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)] animate-pulse"></span>
          Dernières annonces et informations de l'établissement
        </p>
      </div>

      <!-- Toolbar -->
      <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 mb-8 border border-white/50 dark:border-gray-700/50 shadow-sm flex flex-col lg:flex-row gap-4 lg:items-center">
        <div class="relative flex-1 max-w-md">
          <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="searchQuery"
            class="w-full px-4 py-2 pl-10 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            type="text"
            placeholder="Rechercher une actualité..."
          >
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            v-for="f in filters"
            :key="f.value"
            class="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300"
            :class="activeFilter === f.value 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25' 
              : 'bg-white/50 dark:bg-gray-700/50 text-slate-600 dark:text-slate-400 border border-white/50 dark:border-gray-600/50 hover:bg-white dark:hover:bg-gray-700'"
            @click="activeFilter = f.value"
          >
            {{ f.label }}
          </button>
        </div>

        <div class="lg:ml-auto text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest">
          {{ filteredInfos.length }} RÉSULTAT{{ filteredInfos.length > 1 ? 'S' : '' }}
        </div>
      </div>

      <!-- Content Area -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="i in 2" :key="i" class="h-64 bg-white/40 dark:bg-gray-800/40 rounded-3xl animate-pulse"></div>
      </div>

      <div v-else-if="filteredInfos.length === 0" class="text-center py-20 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-white/50 dark:border-gray-700/50">
        <div class="w-24 h-24 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <h3 class="text-gray-600 dark:text-gray-400 text-xl font-bold uppercase tracking-wider">Aucun résultat</h3>
        <p class="text-gray-400 dark:text-gray-500 text-sm mt-2">Réessayez avec d'autres critères de recherche.</p>
        <button class="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors" @click="resetFilters">Réinitialiser</button>
      </div>

      <template v-else>
        <!-- Featured Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
          <div
            v-for="(info, index) in featuredInfos"
            :key="info.id"
            @click="router.push(`/actualites/${info.slug || info.id}`)"
            class="group relative overflow-hidden rounded-3xl transition-all duration-500 cursor-pointer"
            :class="index === 0 
              ? 'md:row-span-2 bg-gradient-to-br from-indigo-600 to-purple-700 shadow-2xl shadow-indigo-500/20' 
              : 'bg-white dark:bg-gray-800 shadow-xl vertical-card'"
          >
            <!-- Badge -->
            <div class="p-8 h-full flex flex-col">
              <span class="inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 w-fit"
                :class="index === 0 
                  ? 'bg-white/20 text-white' 
                  : (info.target_audience === 'all' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400')">
                {{ info.target_audience === 'all' ? 'Général' : 'Ciblé' }}
              </span>

              <h3 class="font-bold leading-tight mb-4 transition-colors"
                :class="index === 0 ? 'text-3xl text-white' : 'text-xl text-slate-800 dark:text-white group-hover:text-indigo-600'"
                v-html="truncateText(info.title, index === 0 ? 80 : 60)">
              </h3>

              <div class="text-sm line-clamp-4 flex-1"
                :class="index === 0 ? 'text-indigo-100/80' : 'text-slate-500 dark:text-gray-400'"
                v-html="truncateText(info.summary || 'Consultez les détails complets de ce communiqué.', index === 0 ? 150 : 120)">
              </div>

              <div class="mt-8 pt-6 border-t flex items-center justify-between"
                :class="index === 0 ? 'border-white/10' : 'border-slate-100 dark:border-gray-700'">
                <span class="text-xs font-semibold" :class="index === 0 ? 'text-indigo-200' : 'text-slate-400'">
                  {{ formatDate(info.publishedAt || info.created_at) }}
                </span>
                <span class="flex items-center gap-2 text-xs font-black uppercase tracking-widest group-hover:gap-3 transition-all"
                  :class="index === 0 ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'">
                  Lire
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section List -->
        <template v-if="regularInfos.length > 0">
          <div class="flex items-center gap-4 mb-8">
            <h2 class="text-sm font-black uppercase tracking-widest text-slate-400">Autres annonces</h2>
            <div class="flex-1 h-px bg-slate-200 dark:bg-gray-700"></div>
          </div>

          <div class="space-y-4">
            <div
              v-for="(info, index) in regularInfos"
              :key="info.id"
              @click="router.push(`/actualites/${info.slug || info.id}`)"
              class="group bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm p-4 rounded-2xl border border-white/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg transition-all duration-300 flex items-center gap-6 cursor-pointer"
            >
              <div class="hidden sm:flex text-3xl font-black text-slate-200 dark:text-gray-700 transition-colors group-hover:text-indigo-500/30">
                {{ String(index + 3).padStart(2, '0') }}
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-[10px] font-bold text-slate-400">{{ formatDate(info.publishedAt || info.created_at) }}</span>
                  <div class="w-1 h-1 rounded-full bg-slate-300"></div>
                  <span class="text-[10px] font-bold uppercase tracking-widest"
                    :class="info.target_audience === 'all' ? 'text-blue-500' : 'text-purple-500'">
                    {{ info.target_audience === 'all' ? 'Général' : 'Ciblé' }}
                  </span>
                </div>
                <h4 class="font-bold text-slate-800 dark:text-white truncate group-hover:text-indigo-600 transition-colors" v-html="info.title"></h4>
                <p class="text-sm text-slate-500 dark:text-gray-400 line-clamp-1 mt-1" v-html="info.summary"></p>
              </div>

              <div class="flex items-center gap-4">
                <span v-if="info.attachments?.length" class="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                  {{ info.attachments.length }}
                </span>
                <div class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7-7 7"/></svg>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>

      <!-- Pagination Premium -->
      <div v-if="totalPages > 1" class="mt-12 flex justify-center gap-2">
        <button 
          :disabled="currentPage === 1" 
          @click="currentPage--"
          class="p-2 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-white/50 dark:border-gray-700 disabled:opacity-30 hover:bg-white dark:hover:bg-gray-700 transition-all font-bold text-indigo-600 dark:text-indigo-400"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>

        <button
          v-for="p in totalPages"
          :key="p"
          @click="currentPage = p"
          class="w-10 h-10 rounded-xl font-bold transition-all border border-white/50 dark:border-gray-700/50"
          :class="currentPage === p 
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 scale-110' 
            : 'bg-white/60 dark:bg-gray-800/60 text-slate-500 hover:bg-white dark:hover:bg-gray-700'"
        >
          {{ p }}
        </button>

        <button 
          :disabled="currentPage === totalPages" 
          @click="currentPage++"
          class="p-2 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-white/50 dark:border-gray-700 disabled:opacity-30 hover:bg-white dark:hover:bg-gray-700 transition-all font-bold text-indigo-600 dark:text-indigo-400"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUrgentInfoStore } from '~~/stores/urgent-info';
import Breadcrumb from '~/components/Breadcrumb.vue';

const router = useRouter();
const urgentInfoStore = useUrgentInfoStore();
const isLoading = ref(true);

const searchQuery = ref('');
const activeFilter = ref('all');
const currentPage = ref(1);
const itemsPerPage = 6;

const filters = [
  { label: 'Toutes', value: 'all' },
  { label: 'Générales', value: 'general' },
  { label: 'Ciblées', value: 'targeted' },
];

onMounted(async () => {
  try {
    await urgentInfoStore.fetchUrgentInfos();
  } catch (error) {
    console.error('Erreur chargement actualités:', error);
  } finally {
    isLoading.value = false;
  }
});

const truncateText = (text, maxLength) => {
  if (!text) return '';
  const cleanText = text.replace(/<[^>]*>/g, '');
  if (cleanText.length <= maxLength) return text;
  let truncated = cleanText.substring(0, maxLength).trim();
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > 0) truncated = truncated.substring(0, lastSpace);
  return truncated + '...';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const filteredInfos = computed(() => {
  if (!urgentInfoStore.urgentinfos) return [];
  let userRoles = [];
  let userGroupId = null;
  try {
    if (process.client) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userRoles = (userData?.roles || []).map(r => r.slug);
      userGroupId = userData.etudiant?.groupe_id || null;
    }
  } catch (e) {
    console.error("Erreur lecture rôles utilisateur:", e);
  }
  const isAdmin = userRoles.some(r => ['admin', 'directeur-general', 'responsable-du-site'].includes(r));
  let results = urgentInfoStore.urgentinfos.filter((info) => {
    if (!info.is_published) return false;
    if (isAdmin) return true;
    switch (info.target_audience) {
      case 'all': return true;
      case 'students': return userRoles.includes('etudiant');
      case 'teachers': return userRoles.includes('enseignant');
      case 'administration': return userRoles.some(r => !['etudiant', 'enseignant'].includes(r));
      case 'group': return userGroupId && info.target_group_id == userGroupId; 
      default: return true;
    }
  });
  if (activeFilter.value === 'general') results = results.filter((info) => info.target_audience === 'all');
  else if (activeFilter.value === 'targeted') results = results.filter((info) => info.target_audience !== 'all');
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    results = results.filter((info) => info.title.toLowerCase().includes(query) || (info.summary && info.summary.toLowerCase().includes(query)));
  }
  return results.sort((a, b) => new Date(b.publishedAt || b.created_at) - new Date(a.publishedAt || a.created_at));
});

const featuredInfos = computed(() => filteredInfos.value.slice(0, 2));
const regularInfos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredInfos.value.slice(2).slice(start, start + itemsPerPage);
});
const totalPages = computed(() => {
  const remainingCount = Math.max(0, filteredInfos.value.length - 2);
  return Math.ceil(remainingCount / itemsPerPage);
});
watch([searchQuery, activeFilter], () => { currentPage.value = 1; });
const resetFilters = () => { searchQuery.value = ''; activeFilter.value = 'all'; };
</script>

<style scoped>
.vertical-card:hover { transform: translateY(-5px); }
</style>