<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header avec breadcrumbs -->
    <div class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumb
          :items="[
            { label: 'Administration', to: '/' },
            { label: 'Informations urgentes', to: '/info-urgente/liste' },
            { label: 'Détails', to: null },
          ]"
          :title="info?.title || 'Détails de l\'information urgente'"
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

      <!-- Contenu de l'information urgente -->
      <div v-else-if="info" class="max-w-4xl mx-auto">
        <!-- Barre d'actions flottante (mobile) -->
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
              <!-- Télécharger le fichier -->
              <button
                v-if="info.file_path"
                @click="downloadFile"
                class="flex-shrink-0 inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Télécharger
              </button>

              <!-- Ouvrir le lien externe -->
              <a
                v-else-if="info.file_url"
                :href="info.file_url"
                target="_blank"
                class="flex-shrink-0 inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ouvrir le lien
              </a>

              <NuxtLink
                :to="`/info-urgente/${info.id}/modifier`"
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="info.is_published ? 'M20 12H4M12 4v16' : 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'" />
                </svg>
                {{ info.is_published ? "Dépublier" : "Publier" }}
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
          <!-- Bannière de fichier (si c'est une image) -->
          <div v-if="info.file_path && isImageFile" class="relative w-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-4" style="min-height: 200px;">
            <div class="relative max-w-full max-h-96 overflow-hidden rounded-lg">
              <img
                :src="getImageUrl"
                :alt="info.title"
                class="w-auto h-auto max-w-full max-h-96 object-contain mx-auto"
                loading="lazy"
                @click="previewFile"
                @error="handleImageError"
              />
              
              <!-- Overlay avec icône de zoom -->
              <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <svg class="w-12 h-12 text-white opacity-0 hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
            
            <!-- Badge statut sur l'image (mobile) -->
            <div class="absolute top-4 right-4 lg:hidden">
              <span
                :class="[
                  'px-3 py-1.5 text-xs font-medium rounded-full shadow-lg backdrop-blur-sm',
                  info.is_published
                    ? 'bg-green-500/90 text-white'
                    : 'bg-yellow-500/90 text-white',
                ]"
              >
                {{ info.is_published ? "Publié" : "Non publié" }}
              </span>
            </div>
          </div>

          <!-- Bannière pour les fichiers non-image -->
          <div v-else-if="info.file_path" class="relative w-full py-12 sm:py-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
            <div class="text-center">
              <!-- Icône selon le type de fichier -->
              <div class="mb-4">
                <svg v-if="isPdfFile" class="w-20 h-20 mx-auto text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .8-.7 1.5-1.5 1.5H8v1.5h2v.5H8v1.5h2.5c.8 0 1.5-.7 1.5-1.5v-1c0-.8-.7-1.5-1.5-1.5h-1v-1h2.5V9.5zM13.5 9h1v5h-1V9zm4 3h-2v1.5h2v.5h-2v1.5h2.5c.8 0 1.5-.7 1.5-1.5v-1c0-.8-.7-1.5-1.5-1.5H16v-1h2V9h-2.5c-.8 0-1.5.7-1.5 1.5v1c0 .8.7 1.5 1.5 1.5h1v1h-2v1.5h2.5c.8 0 1.5-.7 1.5-1.5v-1c0-.8-.7-1.5-1.5-1.5H16v-1h2V9z"/>
                </svg>
                <svg v-else-if="isWordFile" class="w-20 h-20 mx-auto text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm1.5 14h-5v-1.5h5V16zm0-3h-5v-1.5h5V13zm0-3h-5V8.5h5V10zM13 9V3.5L18.5 9H13z"/>
                </svg>
                <svg v-else-if="isExcelFile" class="w-20 h-20 mx-auto text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-3.5 14h-5v-1.5h5V16zm0-3h-5v-1.5h5V13zm0-3h-5V8.5h5V10zM13 9V3.5L18.5 9H13z"/>
                </svg>
                <svg v-else class="w-20 h-20 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            
              <button
                @click="downloadFile"
                class="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Télécharger le fichier
              </button>
            </div>
          </div>

          <!-- Bannière pour lien externe -->
          <div v-else-if="info.file_url" class="relative w-full py-12 sm:py-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
            <div class="text-center">
              <svg class="w-20 h-20 mx-auto text-indigo-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <p class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Lien externe</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 break-all max-w-md mx-auto px-4">{{ info.file_url }}</p>
              <a
                :href="info.file_url"
                target="_blank"
                class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ouvrir le lien
              </a>
            </div>
          </div>

          <!-- Contenu -->
          <div class="p-4 sm:p-6 lg:p-8">
            <!-- En-tête -->
            <header class="mb-4 sm:mb-6">
              <!-- Métadonnées compactes pour mobile -->
              <div class="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                <!-- Créé par -->
                <div class="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-full">
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span class="truncate max-w-[100px] sm:max-w-[150px]">{{ info.created_by_name || "Utilisateur" }}</span>
                </div>

                <!-- Date de création -->
                <div class="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-full">
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="whitespace-nowrap">{{ formatDateShort(info.created_at) }}</span>
                </div>

                <!-- Type de fichier -->
                <div v-if="info.file_path" class="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-full">
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{{ getFileExtension }}</span>
                </div>

                <!-- Statut (desktop only) -->
                <div class="hidden lg:flex items-center gap-1.5">
                  <span
                    :class="[
                      'px-3 py-1.5 text-xs font-medium rounded-full',
                      info.is_published
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                    ]"
                  >
                    {{ info.is_published ? "Publié" : "Non publié" }}
                  </span>
                </div>
              </div>

              <!-- Titre -->
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                {{ info.title }}
              </h1>
            </header>

            <!-- Résumé -->
            <div v-if="info.summary" class="mb-6">
              <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Résumé</h2>
              <p class="text-base text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                {{ info.summary }}
              </p>
            </div>


            <!-- Barre d'actions desktop (cachée sur mobile) -->
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
                <!-- Télécharger -->
                <button
                  v-if="info.file_path"
                  @click="downloadFile"
                  class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Télécharger
                </button>

                <!-- Lien externe -->
                <a
                  v-else-if="info.file_url"
                  :href="info.file_url"
                  target="_blank"
                  class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Ouvrir le lien
                </a>

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
                  class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="info.is_published ? 'M20 12H4M12 4v16' : 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'" />
                  </svg>
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

      <!-- État d'erreur -->
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
            Information non trouvée
          </h3>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            L'information urgente que vous recherchez n'existe pas ou a été supprimée.
          </p>
          <NuxtLink
            to="/info-urgente/liste"
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
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import loading from "~/components/loading.vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useUrgentInfoStore } from "~~/stores/urgent-info";

const route = useRoute();
const router = useRouter();
const infoUrgentStore = useUrgentInfoStore();
const { $toastr, $swal } = useNuxtApp();

const info = ref(null);
const isLoading = ref(true);
const infoId = ref(route.params.id);
const imageError = ref(false);

// URL de l'image avec fallback
const getImageUrl = computed(() => {
  if (!info.value?.file_path) return '';
  
  // Si l'URL est déjà complète (commence par http)
  if (info.value.file_path.startsWith('http')) {
    return info.value.file_path;
  }
  
  // Sinon, construire l'URL complète (adapter selon votre configuration)
  const baseUrl = 'http://localhost:8000'; // ou utilisez une variable d'environnement
  return `${baseUrl}${info.value.file_path.startsWith('/') ? '' : '/'}${info.value.file_path}`;
});

// Vérifications des types de fichiers
const isImageFile = computed(() => {
  if (!info.value?.file_path) return false;
  const ext = info.value.file_path.split('.').pop()?.toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
});

const isPdfFile = computed(() => {
  if (!info.value?.file_path) return false;
  const ext = info.value.file_path.split('.').pop()?.toLowerCase();
  return ext === 'pdf';
});

const isWordFile = computed(() => {
  if (!info.value?.file_path) return false;
  const ext = info.value.file_path.split('.').pop()?.toLowerCase();
  return ['doc', 'docx'].includes(ext);
});

const isExcelFile = computed(() => {
  if (!info.value?.file_path) return false;
  const ext = info.value.file_path.split('.').pop()?.toLowerCase();
  return ['xls', 'xlsx', 'csv'].includes(ext);
});

const getFileName = computed(() => {
  if (!info.value?.file_path) return 'Aucun fichier';
  return info.value.file_path.split('/').pop() || 'Fichier';
});

const getFileExtension = computed(() => {
  if (!info.value?.file_path) return '';
  const ext = info.value.file_path.split('.').pop()?.toLowerCase();
  return ext ? ext.toUpperCase() : '';
});

const getFileType = computed(() => {
  if (isImageFile.value) return 'Image';
  if (isPdfFile.value) return 'Document PDF';
  if (isWordFile.value) return 'Document Word';
  if (isExcelFile.value) return 'Tableur Excel';
  if (info.value?.file_path) return 'Fichier';
  if (info.value?.file_url) return 'Lien externe';
  return 'Aucun fichier';
});

const getFileSize = computed(() => {
  // Si l'API ne retourne pas la taille, on peut l'estimer ou laisser vide
  return null;
});

// Gestionnaire d'erreur d'image
const handleImageError = (e) => {
  console.error("Erreur de chargement de l'image:", info.value?.file_path);
  imageError.value = true;
  e.target.src = 'https://via.placeholder.com/400x300?text=Image+non+disponible';
};

// Charger les détails
onMounted(async () => {
  try {
    const id = route.params.id;
    if (!id) {
      throw new Error("Aucun identifiant fourni");
    }

    const data = await infoUrgentStore.fetchUrgentInfo(id);
    info.value = data;
    console.log("Info chargée:", data); // Pour déboguer
  } catch (error) {
    console.error("Erreur chargement:", error);
    $toastr.error("Erreur lors du chargement de l'information");
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

// Télécharger le fichier
const downloadFile = async () => {
  if (!info.value?.file_path) return;
  
  try {
    const link = document.createElement('a');
    link.href = info.value.file_path.startsWith('http') 
      ? info.value.file_path 
      : `http://localhost:8000${info.value.file_path.startsWith('/') ? '' : '/'}${info.value.file_path}`;
    link.download = getFileName.value;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    $toastr.success("Téléchargement démarré");
  } catch (error) {
    console.error("Erreur téléchargement:", error);
    $toastr.error("Erreur lors du téléchargement");
  }
};

// Prévisualiser le fichier
const previewFile = () => {
  if (info.value?.file_path) {
    const url = info.value.file_path.startsWith('http')
      ? info.value.file_path
      : `http://localhost:8000${info.value.file_path.startsWith('/') ? '' : '/'}${info.value.file_path}`;
    window.open(url, '_blank');
  } else if (info.value?.file_url) {
    window.open(info.value.file_url, '_blank');
  }
};

// Publier/Dépublier
async function togglePublishStatus() {
  const isDark = document.documentElement.classList.contains("dark");
  const action = info.value.is_published ? "dépublier" : "publier";
  
  const result = await $swal.fire({
    title: `${action === "publier" ? "Publier" : "Dépublier"} l'information ?`,
    text: `Voulez-vous ${action} "${info.value.title}" ?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: info.value.is_published ? "#6b7280" : "#10b981",
    cancelButtonColor: "#6b7280",
    confirmButtonText: `Oui, ${action}`,
    cancelButtonText: "Annuler",
    background: isDark ? "#1f2937" : "#fff",
    color: isDark ? "#fff" : "#000",
  });

  if (result.isConfirmed) {
    try {
      if (info.value.is_published) {
        await infoUrgentStore.unPublishUrgentInfo(infoId.value);
        $toastr.success("Information dépubliée avec succès");
      } else {
        await infoUrgentStore.publishUrgentInfo(infoId.value);
        $toastr.success("Information publiée avec succès");
      }
      
      // Recharger les données
      info.value = await infoUrgentStore.fetchUrgentInfo(infoId.value);
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
    title: "Supprimer l'information ?",
    html: `Êtes-vous sûr de vouloir supprimer <strong>"${info.value.title}"</strong> ?<br><br>Cette action est <strong class="text-rose-600">irréversible</strong>.`,
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
      await infoUrgentStore.deleteUrgentInfo(infoId.value);
      $toastr.success("Information supprimée avec succès");
      await infoUrgentStore.fetchUrgentInfos();
      navigateTo("/info-urgente/liste");
    } catch (error) {
      console.error("Erreur suppression:", error);
      $toastr.error(error.response?.data?.message || "Impossible de supprimer l'information");
    }
  }
};
</script>

