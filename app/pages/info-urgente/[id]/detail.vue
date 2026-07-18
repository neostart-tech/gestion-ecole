<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumb
          :items="[
            { label: 'Administration', to: '/' },
            { label: 'Actualités', to: '/info-urgente/liste' },
            { label: 'Détails', to: null },
          ]"
          :title="info?.title || 'Détails de l\'actualité'"
          title-class="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 dark:text-white truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px]"
          spacing="mb-0"
        />
      </div>
    </div>

    <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <!-- Loader -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="h-16 w-16 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>

      <!-- Contenu -->
      <div v-else-if="info" class="max-w-4xl mx-auto">
        <!-- Barre d'actions mobile -->
        <div class="lg:hidden mb-4">
          <div class="flex items-center justify-between gap-2 overflow-x-auto pb-2">
            <NuxtLink
              to="/info-urgente/liste"
              class="flex-shrink-0 inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour
            </NuxtLink>

            <div class="flex items-center gap-2">
              <NuxtLink
                :to="`/info-urgente/${info.id}/modifier-une-information-urgente`"
                class="flex-shrink-0 inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              >
                Modifier
              </NuxtLink>

              <button
                @click="togglePublishStatus"
                class="flex-shrink-0 inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                {{ info.is_published ? "Dépublier" : "Publier" }}
              </button>

              <button
                @click="confirmDelete"
                class="flex-shrink-0 inline-flex items-center px-3 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors text-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>

        <!-- Carte principale -->
        <article class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <!-- Image de couverture -->
          <div v-if="info.image" class="relative w-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-4" style="min-height: 200px;">
            <img
              :src="info.image"
              :alt="info.title"
              class="w-auto h-auto max-w-full max-h-96 object-contain mx-auto rounded-lg"
              loading="lazy"
              @click="window.open(info.image, '_blank')"
            />
            <!-- Badge statut sur l'image -->
            <div class="absolute top-4 right-4">
              <span
                :class="[
                  'px-3 py-1.5 text-xs font-medium rounded-full shadow-lg backdrop-blur-sm',
                  info.is_published ? 'bg-green-500/90 text-white' : 'bg-yellow-500/90 text-white',
                ]"
              >
                {{ info.is_published ? "Publié" : "Brouillon" }}
              </span>
            </div>
          </div>

          <!-- Contenu -->
          <div class="p-4 sm:p-6 lg:p-8">
            <!-- Métadonnées -->
            <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
              <!-- Statut (si pas d'image) -->
              <span
                v-if="!info.image"
                :class="[
                  'px-3 py-1 text-xs font-medium rounded-full',
                  info.is_published
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                ]"
              >
                {{ info.is_published ? "Publié" : "Brouillon" }}
              </span>

              <!-- Cible -->
              <span class="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-medium">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ formatAudience(info.target_audience) }}
                <template v-if="info.target_group"> — {{ info.target_group.nom || info.target_group.name }}</template>
              </span>

              <!-- Date -->
              <div class="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-full">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ formatDate(info.created_at) }}</span>
              </div>
            </div>

            <!-- Titre -->
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              {{ info.title }}
            </h1>

            <!-- Résumé / Contenu -->
            <div v-if="info.summary" class="mb-6">
              <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Contenu</h2>
              <div 
                v-html="info.summary"
                class="text-base text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
              ></div>
            </div>

            <!-- Lien externe -->
            <div v-if="info.file_url" class="mb-6">
              <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Lien externe</h2>
              <a
                :href="info.file_url"
                target="_blank"
                class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {{ info.file_url }}
              </a>
            </div>

            <!-- Pièces jointes -->
            <div v-if="info.attachments && info.attachments.length" class="mb-6">
              <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Pièces jointes ({{ info.attachments.length }})
              </h2>
              <div class="space-y-2">
              <a
                  v-for="(att, index) in info.attachments"
                  :key="index"
                  :href="att.url || att"
                  target="_blank"
                  class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div class="flex items-center gap-3 truncate">
                    <svg class="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ att.name || getFileNameFromPath(att.url || att) }}</span>
                  </div>
                  <svg class="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              </div>
            </div>

            <!-- Barre d'actions desktop -->
            <div class="hidden lg:flex mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 items-center justify-between">
              <NuxtLink
                to="/info-urgente/liste"
                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour à la liste
              </NuxtLink>

              <div class="flex items-center gap-3">
                <NuxtLink
                  :to="`/info-urgente/${info.id}/modifier-une-information-urgente`"
                  class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modifier
                </NuxtLink>

                <button
                  @click="togglePublishStatus"
                  :class="[
                    'inline-flex items-center px-4 py-2 rounded-lg transition-colors',
                    info.is_published 
                      ? 'border border-gray-300 text-gray-700 hover:bg-gray-50' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  ]"
                >
                  {{ info.is_published ? "Dépublier" : "Publier" }}
                </button>

                <button
                  @click="confirmDelete"
                  class="inline-flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Erreur -->
      <div v-else class="max-w-4xl mx-auto text-center py-20">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
          <svg class="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">Actualité non trouvée</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">L'actualité recherchée n'existe pas ou a été supprimée.</p>
          <NuxtLink
            to="/info-urgente/liste"
            class="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retour à la liste
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useUrgentInfoStore } from "~~/stores/urgent-info";

const route = useRoute();
const infoUrgentStore = useUrgentInfoStore();
const { $toastr, $swal } = useNuxtApp();

const info = ref(null);
const isLoading = ref(true);

const formatAudience = (aud) => {
  const map = {
    'all': 'Tous',
    'students': 'Étudiants',
    'teachers': 'Enseignants',
    'administration': 'Administration',
    'group': 'Groupe'
  };
  return map[aud] || aud || 'Tous';
};

const getFileNameFromPath = (path) => {
  if (!path) return 'Fichier';
  return path.split('/').pop() || 'Fichier';
};

function formatDate(dateString) {
  if (!dateString) return "Date inconnue";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Chargement
onMounted(async () => {
  try {
    const id = route.params.id;
    if (!id) throw new Error("ID manquant");
    const data = await infoUrgentStore.fetchUrgentInfo(id);
    info.value = data;
  } catch (error) {
    console.error("Erreur chargement:", error);
    $toastr.error("Erreur lors du chargement");
  } finally {
    isLoading.value = false;
  }
});

// Publier / Dépublier
async function togglePublishStatus() {
  const action = info.value.is_published ? "dépublier" : "publier";
  const result = await $swal.fire({
    title: `${action === "publier" ? "Publier" : "Dépublier"} ?`,
    text: `Voulez-vous ${action} "${info.value.title}" ?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: info.value.is_published ? "#6b7280" : "#10b981",
    confirmButtonText: `Oui, ${action}`,
    cancelButtonText: "Annuler",
  });

  if (result.isConfirmed) {
    try {
      if (info.value.is_published) {
        await infoUrgentStore.unPublishUrgentInfo(info.value.id);
        $toastr.success("Actualité dépubliée");
      } else {
        await infoUrgentStore.publishUrgentInfo(info.value.id);
        $toastr.success("Actualité publiée (notification envoyée)");
      }
      info.value = await infoUrgentStore.fetchUrgentInfo(info.value.id);
    } catch (error) {
      $toastr.error("Erreur lors du changement de statut");
    }
  }
}

// Supprimer
const confirmDelete = async () => {
  const result = await $swal.fire({
    title: "Supprimer ?",
    html: `Supprimer <strong>"${info.value.title}"</strong> ? Action irréversible.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    confirmButtonText: "Supprimer",
    cancelButtonText: "Annuler",
  });

  if (result.isConfirmed) {
    try {
      await infoUrgentStore.deleteUrgentInfo(info.value.id);
      $toastr.success("Actualité supprimée");
      navigateTo("/info-urgente/liste");
    } catch (error) {
      $toastr.error("Erreur lors de la suppression");
    }
  }
};
</script>
