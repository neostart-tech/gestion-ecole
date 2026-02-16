<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header avec breadcrumbs -->
    <div class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumb
          :items="[
            { label: 'Administration', to: '/' },
            { label: 'Événements', to: '/evenements/liste' },
            { label: 'Détails', to: null },
          ]"
          :title="evenement?.nom || 'Détails de l\'événement'"
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

      <!-- Contenu de l'événement -->
      <div v-else-if="evenement" class="max-w-4xl mx-auto">
        <!-- Barre d'actions flottante (mobile) -->
        <div class="lg:hidden mb-4">
          <div class="flex items-center justify-between gap-2 overflow-x-auto pb-2">
            <NuxtLink
              to="/evenements/liste"
              class="flex-shrink-0 inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour
            </NuxtLink>

            <div class="flex items-center gap-2">
              <NuxtLink
                :to="`/evenements/${evenement.id}/modifier-un-evenement`"
                class="flex-shrink-0 inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modifier
              </NuxtLink>

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
          <!-- Image de couverture si disponible -->
          <div v-if="evenement.image" class="relative h-48 sm:h-64 lg:h-96 overflow-hidden">
            <img 
              :src="evenement.image" 
              :alt="evenement.nom"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Contenu -->
          <div class="p-4 sm:p-6 lg:p-8">
            <!-- En-tête -->
            <header class="mb-4 sm:mb-6">
              <!-- Métadonnées compactes pour mobile -->
              <div class="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                <!-- Période -->
                <div class="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-full">
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="whitespace-nowrap">
                    {{ formatDateShort(evenement.date_debut) }}
                    <template v-if="evenement.date_fin">
                      → {{ formatDateShort(evenement.date_fin) }}
                    </template>
                  </span>
                </div>

                <!-- Lieu (si disponible) -->
                <div v-if="evenement.lieu" class="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-full">
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="truncate max-w-[150px]">{{ evenement.lieu }}</span>
                </div>
              </div>

              <!-- Titre -->
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                {{ evenement.nom }}
              </h1>

              <!-- Dates détaillées -->
              <div class="mt-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Début : {{ formatDate(evenement.date_debut) }}</span>
                </div>
                <div v-if="evenement.date_fin" class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Fin : {{ formatDate(evenement.date_fin) }}</span>
                </div>
              </div>
            </header>

            <!-- Description de l'événement -->
            <div class="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert">
              <div v-html="evenement.details" class="break-words"></div>
            </div>

            <!-- Tags ou catégories -->
            <div v-if="evenement.tags || evenement.categories" class="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tags</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in (evenement.tags || evenement.categories)"
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
                to="/evenements/liste"
                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour à la liste
              </NuxtLink>

              <div class="flex items-center gap-3">
                <NuxtLink
                  :to="`/evenements/${evenement.id || evenement.id}/modifier-un-evenement`"
                  class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modifier
                </NuxtLink>

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

        <!-- Section participants (optionnel) -->
        <div v-if="evenement.participants" class="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Participants ({{ evenement.participants_count || 0 }})
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
            Liste des participants à venir
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
            Événement non trouvé
          </h3>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            L'événement que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <NuxtLink
            to="/evenements/liste"
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
import { useEvenementStore } from "~~/stores/evenement";
import loading from "~/components/loading.vue";
import Breadcrumb from "~/components/Breadcrumb.vue";

const route = useRoute();
const router = useRouter();
const evenementStore = useEvenementStore();
const { $toastr, $swal } = useNuxtApp();

const evenement = ref(null);
const isLoading = ref(true);

// Charger les détails de l'événement
onMounted(async () => {
  try {
    const slug = route.params.slug;
    if (!slug) {
      throw new Error("Aucun identifiant fourni");
    }

    const data = await evenementStore.fetchEvenement(slug);
    evenement.value = data;
  } catch (error) {
    console.error("Erreur chargement:", error);
    $toastr.error("Erreur lors du chargement de l'événement");
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

// Confirmer la suppression
const confirmDelete = async () => {
  if (!evenement.value) return;
  
  const isDark = document.documentElement.classList.contains("dark");
  
  const result = await $swal.fire({
    title: "Supprimer l'événement ?",
    html: `Êtes-vous sûr de vouloir supprimer <strong>"${evenement.value.nom}"</strong> ?<br><br>Cette action est <strong class="text-rose-600">irréversible</strong>.`,
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
      await evenementStore.deleteEvenement(evenement.value.id);
      $toastr.success("Événement supprimé avec succès");
      await evenementStore.fetchEvenements();
      router.push("/evenements/liste");
    } catch (error) {
      console.error("Erreur suppression:", error);
      $toastr.error(error.response?.data?.message || "Impossible de supprimer l'événement");
    }
  }
};
</script>