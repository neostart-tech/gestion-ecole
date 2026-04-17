<template>
  <div class="page-wrapper">
    <div class="page">

      <!-- Breadcrumb + Titre -->
      <Breadcrumb
        :items="[
          { label: 'Accueil', to: '/' },
          { label: 'Actualités & Communiqués', to: null },
        ]"
        title="Actualités & Communiqués"
        title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
        spacing="mb-4"
      />

      <!-- Toolbar -->
      <div class="toolbar">
        <div class="search-wrap">
          <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="searchQuery"
            class="search-input"
            type="text"
            placeholder="Rechercher..."
          >
        </div>

        <div class="filters">
          <button
            v-for="f in filters"
            :key="f.value"
            class="filter-btn"
            :class="{ active: activeFilter === f.value }"
            @click="activeFilter = f.value"
          >
            {{ f.label }}
          </button>
        </div>

        <div class="count-badge">
          {{ filteredInfos.length }} résultat{{ filteredInfos.length > 1 ? 's' : '' }}
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="featured">
        <div v-for="i in 2" :key="i" class="fcard skeleton">
          <div class="skeleton-body">
            <div class="skeleton-line w-20"></div>
            <div class="skeleton-line w-full"></div>
            <div class="skeleton-line w-3q"></div>
            <div class="skeleton-line w-half"></div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredInfos.length === 0" class="empty">
        <div class="empty-ring">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <h3>Aucun résultat</h3>
        <p>Essayez de modifier vos critères de recherche.</p>
        <button class="btn-reset" @click="resetFilters">Réinitialiser</button>
      </div>

      <!-- Contenu -->
      <template v-else>

        <!-- 2 cartes vedettes -->
        <div class="featured">
          <div
            v-for="info in featuredInfos"
            :key="info.id"
            class="fcard"
            @click="router.push(`/actualites/${info.id}`)"
          >
            <div class="fcard-top">
              <span class="fcard-badge" :class="{ tgt: info.target_audience !== 'all' }">
                {{ info.target_audience === 'all' ? 'Général' : 'Ciblé' }}
              </span>
              <div class="fcard-title" v-html="truncateText(info.title, 60)">
              </div>
              <div class="fcard-sum" v-html="truncateText(info.summary || 'Consultez les détails complets de ce communiqué.', 120)">
              </div>
            </div>
            <div class="fcard-foot">
              <span class="fcard-date">{{ formatDate(info.publishedAt || info.created_at) }}</span>
              <span class="fcard-link">
                Lire
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </span>
            </div>
          </div>
        </div>

        <!-- Reste en liste numérotée -->
        <template v-if="regularInfos.length > 0">
          <div class="section-label">Autres annonces</div>
          <div class="list">
            <div
              v-for="(info, index) in regularInfos"
              :key="info.id"
              class="item"
              @click="router.push(`/actualites/${info.id}`)"
            >
              <div class="item-num">{{ String(index + 1).padStart(2, '0') }}</div>

              <div class="item-body">
                <div class="item-meta">
                  <span class="item-date">{{ formatDate(info.publishedAt || info.created_at) }}</span>
                  <span class="item-dot"></span>
                  <span class="item-badge" :class="{ tgt: info.target_audience !== 'all' }">
                    {{ info.target_audience === 'all' ? 'Général' : 'Ciblé' }}
                  </span>
                </div>
                <div class="item-title" v-html="truncateText(info.title, 70)">
                </div>
                <div class="item-sum" v-html="truncateText(info.summary, 100)">
                </div>
              </div>

              <div class="item-right">
                <div class="item-arr">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </div>
                <span v-if="info.attachments?.length" class="item-attach">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                  </svg>
                  {{ info.attachments.length }}
                </span>
              </div>
            </div>
          </div>
        </template>

      </template>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <button
          v-for="p in totalPages"
          :key="p"
          class="page-btn"
          :class="{ active: currentPage === p }"
          @click="currentPage = p"
        >
          {{ p }}
        </button>

        <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
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

// Fonction pour tronquer le texte (sans decode car v-html le fait)
const truncateText = (text, maxLength) => {
  if (!text) return '';
  
  // Enlève temporairement les balises HTML pour le comptage
  const cleanText = text.replace(/<[^>]*>/g, '');
  if (cleanText.length <= maxLength) return text;
  
  // Troncature intelligente
  let truncated = cleanText.substring(0, maxLength).trim();
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > 0) {
    truncated = truncated.substring(0, lastSpace);
  }
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
      case 'all':
        return true;
      case 'students':
        return userRoles.includes('etudiant');
      case 'teachers':
        return userRoles.includes('enseignant');
      case 'administration':
        return userRoles.some(r => !['etudiant', 'enseignant'].includes(r));
      case 'group':
        return userGroupId && info.target_group_id == userGroupId; 
      default:
        return true;
    }
  });

  if (activeFilter.value === 'general') {
    results = results.filter((info) => info.target_audience === 'all');
  } else if (activeFilter.value === 'targeted') {
    results = results.filter((info) => info.target_audience !== 'all');
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    results = results.filter(
      (info) =>
        info.title.toLowerCase().includes(query) ||
        (info.summary && info.summary.toLowerCase().includes(query))
    );
  }

  return results.sort(
    (a, b) =>
      new Date(b.publishedAt || b.created_at) - new Date(a.publishedAt || a.created_at)
  );
});

// 2 premières cartes en vedette
const featuredInfos = computed(() => filteredInfos.value.slice(0, 2));

// Le reste avec pagination
const regularInfos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredInfos.value.slice(2).slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  const remainingCount = Math.max(0, filteredInfos.value.length - 2);
  return Math.ceil(remainingCount / itemsPerPage);
});

watch([searchQuery, activeFilter], () => {
  currentPage.value = 1;
});

const resetFilters = () => {
  searchQuery.value = '';
  activeFilter.value = 'all';
};
</script>

<style scoped>
/* ── Variables ── */
.page-wrapper {
  --b: #3746E9;
  --v: #8A31F7;
  --grad: linear-gradient(110deg, #3746E9, #8A31F7);
  --ink: #0A0A14;
  --ink2: #3D3D55;
  --ink3: #8888A8;
  --bg: #F9F8FF;
  --surf: #FFFFFF;
  --surf2: #F2F1FA;
  --line: #E6E5F2;

  font-family: system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--ink);
  min-height: 100vh;
}

.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 28px 100px;
}

/* ── Toolbar ── */
.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 44px;
  margin-top: 28px;
}

.search-wrap {
  position: relative;
  flex: 0 0 280px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 15px;
  height: 15px;
  color: var(--ink3);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surf);
  font-family: inherit;
  font-size: 13px;
  color: var(--ink);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  border-color: var(--b);
  box-shadow: 0 0 0 3px rgba(55, 70, 233, 0.09);
}

.search-input::placeholder {
  color: var(--ink3);
}

.filters {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 9px 20px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  color: var(--ink3);
  cursor: pointer;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surf);
  transition: all 0.18s;
  white-space: nowrap;
}

.filter-btn:hover {
  border-color: var(--b);
  color: var(--b);
}

.filter-btn.active {
  background: var(--grad);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 3px 12px rgba(55, 70, 233, 0.2);
}

.count-badge {
  margin-left: auto;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink3);
  white-space: nowrap;
}

/* ── Featured ── */
.featured {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.fcard {
  background: var(--surf);
  border: 1px solid var(--line);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s;
  display: flex;
  flex-direction: column;
  min-height: 280px;
}

.fcard:hover {
  border-color: rgba(55, 70, 233, 0.3);
  box-shadow: 0 8px 32px rgba(55, 70, 233, 0.09);
  transform: translateY(-2px);
}

.fcard:first-child {
  grid-row: span 2;
  background: var(--grad);
  min-height: 380px;
}

.fcard-top {
  padding: 28px 28px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.fcard:first-child .fcard-top {
  padding: 32px 32px 24px;
}

.fcard-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(55, 70, 233, 0.1);
  color: var(--b);
  margin-bottom: 16px;
  width: fit-content;
}

.fcard-badge.tgt {
  background: rgba(138, 49, 247, 0.1);
  color: var(--v);
}

.fcard:first-child .fcard-badge,
.fcard:first-child .fcard-badge.tgt {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
}

.fcard-title {
  font-size: 19px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--ink);
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fcard:first-child .fcard-title {
  font-size: 26px;
  color: #fff;
  -webkit-line-clamp: 3;
}

.fcard-sum {
  font-size: 13px;
  color: var(--ink3);
  line-height: 1.5;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fcard:first-child .fcard-sum {
  color: rgba(255, 255, 255, 0.6);
  -webkit-line-clamp: 5;
}

.fcard-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 28px;
  border-top: 1px solid var(--line);
}

.fcard:first-child .fcard-foot {
  border-color: rgba(255, 255, 255, 0.15);
}

.fcard-date {
  font-size: 11px;
  font-weight: 500;
  color: var(--ink3);
}

.fcard:first-child .fcard-date {
  color: rgba(255, 255, 255, 0.45);
}

.fcard-link {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--b);
  transition: gap 0.2s;
}

.fcard:first-child .fcard-link {
  color: #fff;
}

.fcard-link svg {
  width: 12px;
  height: 12px;
  transition: transform 0.2s;
}

.fcard:hover .fcard-link svg {
  transform: translateX(3px);
}

/* ── Section label ── */
.section-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink3);
  margin-bottom: 24px;
  margin-top: 56px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--line);
}

/* ── List ── */
.list {
  display: flex;
  flex-direction: column;
}

.item {
  display: grid;
  grid-template-columns: 52px 1fr auto;
  align-items: center;
  gap: 22px;
  padding: 20px 0;
  border-bottom: 1px solid var(--line);
  cursor: pointer;
  transition: all 0.15s;
  border-radius: 0;
}

.item:hover {
  background: var(--surf2);
  margin: 0 -14px;
  padding-left: 14px;
  padding-right: 14px;
  border-radius: 10px;
  border-color: transparent;
}

.item:hover .item-num {
  background: var(--grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.item:hover .item-title {
  color: var(--b);
}

.item-num {
  font-size: 26px;
  font-weight: 800;
  color: var(--line);
  text-align: right;
  line-height: 1;
  transition: all 0.2s;
  letter-spacing: -0.02em;
}

.item-body {
  flex: 1;
  min-width: 0;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.item-date {
  font-size: 11px;
  font-weight: 500;
  color: var(--ink3);
}

.item-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--line);
}

.item-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: rgba(55, 70, 233, 0.08);
  color: var(--b);
}

.item-badge.tgt {
  background: rgba(138, 49, 247, 0.1);
  color: var(--v);
}

.item-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--ink);
  margin-bottom: 5px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s;
}

.item-sum {
  font-size: 12.5px;
  color: var(--ink3);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  flex-shrink: 0;
}

.item-arr {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.item:hover .item-arr {
  background: var(--grad);
  border-color: transparent;
}

.item-arr svg {
  width: 13px;
  height: 13px;
  stroke: var(--ink3);
  stroke-width: 2;
  fill: none;
  transition: stroke 0.2s;
}

.item:hover .item-arr svg {
  stroke: #fff;
}

.item-attach {
  font-size: 10px;
  font-weight: 600;
  color: var(--ink3);
  display: flex;
  align-items: center;
  gap: 3px;
}

.item-attach svg {
  width: 11px;
  height: 11px;
}

/* ── Skeleton ── */
.skeleton {
  pointer-events: none;
}

.skeleton-body {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-height: 200px;
}

.skeleton-line {
  height: 14px;
  border-radius: 6px;
  background: var(--line);
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-line.w-20  { width: 20%; }
.skeleton-line.w-full { width: 100%; }
.skeleton-line.w-3q  { width: 75%; }
.skeleton-line.w-half { width: 50%; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ── Empty ── */
.empty {
  text-align: center;
  padding: 72px 24px;
}

.empty-ring {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.empty-ring svg {
  width: 20px;
  height: 20px;
  stroke: var(--ink3);
  fill: none;
  stroke-width: 1.5;
}

.empty h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 8px;
}

.empty p {
  font-size: 13px;
  color: var(--ink3);
  margin-bottom: 20px;
}

.btn-reset {
  padding: 10px 22px;
  border-radius: 8px;
  background: var(--grad);
  color: #fff;
  border: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-reset:hover {
  opacity: 0.88;
}

/* ── Pagination ── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 56px;
  padding-top: 40px;
  border-top: 1px solid var(--line);
}

.page-btn {
  width: 36px;
  height: 36px;
  border-radius: 7px;
  border: 1px solid var(--line);
  background: var(--surf);
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  color: var(--ink2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s;
}

.page-btn svg {
  width: 13px;
  height: 13px;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--b);
  color: var(--b);
}

.page-btn.active {
  background: var(--grad);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 3px 12px rgba(55, 70, 233, 0.25);
}

.page-btn:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .page { padding: 32px 16px 80px; }
  .featured { grid-template-columns: 1fr; }
  .fcard:first-child { grid-row: auto; min-height: 280px; }
  .search-wrap { flex: 1 1 100%; }
  .count-badge { display: none; }
}

@media (max-width: 480px) {
  .item { grid-template-columns: 40px 1fr auto; gap: 12px; }
  .item-num { font-size: 20px; }
  .filter-btn { padding: 8px 14px; }
}
</style>