<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header avec breadcrumbs -->
    <div class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumb
          :items="[
            { label: 'Administration', to: '/' },
            { label: 'Blog', to: '/publications/liste' },
            { label: 'Détails', to: null },
          ]"
          :title="blog?.title || 'Détails de la publication'"
          title-class="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 dark:text-white truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px]"
          spacing="mb-0"
        />
      </div>
    </div>

    <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <!-- État de chargement -->
      <div v-if="isLoading" class="flex justify-center items-center py-12 sm:py-16 lg:py-20">
        <loading />
      </div>

      <!-- Contenu du blog -->
      <div v-else-if="blog" class="max-w-4xl mx-auto">
        <!-- Barre d'actions flottante (mobile) -->
        <div class="lg:hidden mb-4">
          <div class="flex items-center justify-between gap-2 overflow-x-auto pb-2">
            <NuxtLink
              to="/publications/liste"
              class="flex-shrink-0 inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour
            </NuxtLink>

            <div class="flex items-center gap-2">
              <NuxtLink
                :to="`/publications/${blog.slug || blog.id}/modifier-une-publication`"
                class="flex-shrink-0 inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modifier
              </NuxtLink>

              <button
                @click="togglePublishStatus"
                class="flex-shrink-0 inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="blog.status === 'published' ? 'M20 12H4M12 4v16' : 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'" />
                </svg>
                {{ blog.status === "published" ? "Dépublier" : "Publier" }}
              </button>

              <button
                @click="confirmDelete"
                class="flex-shrink-0 inline-flex items-center px-3 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors text-sm"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer
              </button>
            </div>
          </div>
        </div>

        <!-- Carte principale -->
        <article class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <!-- Image de couverture avec overlay pour le texte sur mobile -->
          <div v-if="blog.image" class="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img
              :src="blog.image"
              :alt="blog.title"
              class="w-full h-full object-cover"
              loading="lazy"
            />
            
            <!-- Badge statut sur l'image (mobile) -->
            <div class="absolute top-4 right-4 lg:hidden">
              <span
                :class="[
                  'px-3 py-1.5 text-xs font-medium rounded-full shadow-lg backdrop-blur-sm',
                  blog.status === 'published'
                    ? 'bg-green-500/90 text-white'
                    : 'bg-yellow-500/90 text-white',
                ]"
              >
                {{ blog.status === "published" ? "Publié" : "Brouillon" }}
              </span>
            </div>
          </div>

          <!-- Contenu -->
          <div class="p-4 sm:p-6 lg:p-8">
            <!-- En-tête -->
            <header class="mb-4 sm:mb-6">
              <!-- Métadonnées compactes pour mobile -->
              <div class="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                <!-- Auteur -->
                <div class="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-full">
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span class="truncate max-w-[100px] sm:max-w-[150px]">{{ blog.author_name || blog.auteur || "Auteur" }}</span>
                </div>

                <!-- Date -->
                <div class="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-full">
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="whitespace-nowrap">{{ formatDateShort(blog.date_publication || blog.publication_date) }}</span>
                </div>

                <!-- Statut (desktop only) -->
                <div class="hidden lg:flex items-center gap-1.5">
                  <span
                    :class="[
                      'px-3 py-1.5 text-xs font-medium rounded-full',
                      blog.status === 'published'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                    ]"
                  >
                    {{ blog.status === "published" ? "Publié" : "Brouillon" }}
                  </span>
                </div>
              </div>

              <!-- Titre -->
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                {{ blog.title }}
              </h1>
            </header>

            <!-- Contenu du blog avec gestion responsive -->
            <div class="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert">
              <div v-html="blog.content" class="break-words"></div>
            </div>

            <!-- Tags ou catégories -->
            <div v-if="blog.tags || blog.categories" class="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tags</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in (blog.tags || blog.categories)"
                  :key="tag"
                  class="px-2 sm:px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs sm:text-sm"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>

            <!-- Barre d'actions desktop (cachée sur mobile) -->
            <div class="hidden lg:flex mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 items-center justify-between">
              <NuxtLink
                to="/publications/liste"
                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour à la liste
              </NuxtLink>

              <div class="flex items-center gap-3">
                <NuxtLink
                  :to="`/publications/${blog.slug || blog.id}/modifier-une-publication`"
                  class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modifier
                </NuxtLink>

                <button
                  @click="togglePublishStatus"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="blog.status === 'published' ? 'M20 12H4M12 4v16' : 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'" />
                  </svg>
                  {{ blog.status === "published" ? "Dépublier" : "Publier" }}
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

        <!-- Section commentaires (placeholder) -->
        <div class="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Commentaires (0)
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
            Aucun commentaire pour le moment
          </p>
        </div>
      </div>

      <!-- État d'erreur amélioré -->
      <div v-else class="max-w-4xl mx-auto text-center py-12 sm:py-16 lg:py-20">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8">
          <svg
            class="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 class="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2">
            Publication non trouvée
          </h3>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            La publication que vous recherchez n'existe pas ou a été supprimée.
          </p>
          <NuxtLink
            to="/publications/liste"
            class="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à la liste
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBlogStore } from "~~/stores/blog";
import loading from "~/components/loading.vue";
import Breadcrumb from "~/components/Breadcrumb.vue";

const route = useRoute();
const router = useRouter();
const blogStore = useBlogStore();
const { $toastr, $swal } = useNuxtApp();

const blog = ref(null);
const isLoading = ref(true);
const blogSlug = ref(route.params.slug);

// Charger les détails du blog
onMounted(async () => {
  try {
    const slug = route.params.slug;
    if (!slug) {
      throw new Error("Aucun identifiant fourni");
    }

    const data = await blogStore.fetchBlog(slug);
    blog.value = data;
  } catch (error) {
    console.error("Erreur chargement:", error);
    $toastr.error("Erreur lors du chargement de la publication");
  } finally {
    isLoading.value = false;
  }
});

// Formater la date (version longue)
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

// Formater la date (version courte pour mobile)
function formatDateShort(dateString) {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "Aujourd'hui";
  } else if (diffDays === 1) {
    return "Hier";
  } else if (diffDays < 7) {
    return `Il y a ${diffDays} jours`;
  } else {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  }
}

// Publier/Dépublier
async function togglePublishStatus() {
  const isDark = document.documentElement.classList.contains("dark");
  const action = blog.value.status === "published" ? "dépublier" : "publier";
  
  const result = await $swal.fire({
    title: `${action === "publier" ? "Publier" : "Dépublier"} la publication ?`,
    text: `Voulez-vous ${action} "${blog.value.title}" ?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: blog.value.status === "published" ? "#6b7280" : "#10b981",
    cancelButtonColor: "#6b7280",
    confirmButtonText: `Oui, ${action}`,
    cancelButtonText: "Annuler",
    background: isDark ? "#1f2937" : "#fff",
    color: isDark ? "#fff" : "#000",
  });

  if (result.isConfirmed) {
    try {
      if (blog.value.status === "published") {
        await blogStore.unpublishBlog(blogSlug.value);
        $toastr.success("Publication dépubliée avec succès");
      } else {
        await blogStore.publishBlog(blogSlug.value);
        $toastr.success("Publication publiée avec succès");
      }
      
      // Recharger les données
      blog.value = await blogStore.fetchBlog(blogSlug.value);
    } catch (error) {
      console.error("Erreur changement statut:", error);
      $toastr.error(error.response?.data?.message || "Erreur lors du changement de statut");
    }
  }
}

// Confirmer la suppression
const confirmDelete = async () => {
  const isDark = document.documentElement.classList.contains("dark");
  
  const result = await $swal.fire({
    title: "Supprimer la publication ?",
    html: `Êtes-vous sûr de vouloir supprimer <strong>"${blog.value.title}"</strong> ?<br><br>Cette action est <strong class="text-rose-600">irréversible</strong>.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
    background: isDark ? "#1f2937" : "#fff",
    color: isDark ? "#fff" : "#000",
  });

  if (result.isConfirmed) {
    try {
      await blogStore.deleteBlog(blogSlug.value);
      $toastr.success("Publication supprimée avec succès");
      await blogStore.fetchBlogs();
      navigateTo("/publications/liste");
    } catch (error) {
      console.error("Erreur suppression:", error);
      $toastr.error(error.response?.data?.message || "Impossible de supprimer la publication");
    }
  }
};
</script>

