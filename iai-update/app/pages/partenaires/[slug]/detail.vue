<template>
  <div>
    <!-- Breadcrumbs avec boutons d'action -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <Breadcrumb
        :items="[
          { label: 'Partenaires', to: '/' },
          { label: 'Liste', to: '/partenaires' },
          { label: advertiserStore.advertiser?.nom || 'Détail', to: null }
        ]"
        title="Détail du partenaire"
        title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
        spacing=""
      />
      
      <!-- Boutons d'action -->
      <div v-if="advertiserStore.advertiser" class="flex items-center gap-2">
        <NuxtLink
          :to="`/partenaires/${advertiserStore.advertiser.slug}/modifier-un-partenaire`"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Modifier
        </NuxtLink>
        
        <button
          @click="confirmDelete(advertiserStore.advertiser)"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Supprimer
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="advertiserStore.isLoading" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-10">
      <div class="py-10 text-center">
        <svg
          class="mx-auto h-10 w-10 text-indigo-500 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <p class="mt-3 text-gray-600 dark:text-gray-400">
          Chargement des données, veuillez patienter...
        </p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="advertiserStore.error" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <div class="py-10 text-center">
        <svg
          class="mx-auto h-12 w-12 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">
          Erreur de chargement
        </h3>
        <p class="mt-1 text-gray-600 dark:text-gray-400">
          {{ advertiserStore.error }}
        </p>
        <button
          @click="loadAdvertiser"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Réessayer
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="advertiserStore.advertiser" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <!-- Header avec badge statut -->
      <div class="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {{ advertiserStore.advertiser.nom }}
          </h1>
          
          <!-- Badge statut (optionnel) -->
          <span 
            v-if="advertiserStore.advertiser.statut"
            :class="[
              'px-3 py-1 text-sm font-medium rounded-full',
              advertiserStore.advertiser.statut === 'actif' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            ]"
          >
            {{ advertiserStore.advertiser.statut }}
          </span>
        </div>
        
        <!-- Contact info -->
        <div class="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div v-if="advertiserStore.advertiser.email" class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a :href="`mailto:${advertiserStore.advertiser.email}`" class="hover:text-indigo-600 dark:hover:text-indigo-400">
              {{ advertiserStore.advertiser.email }}
            </a>
          </div>
          
          <div v-if="advertiserStore.advertiser.tel" class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a :href="`tel:${advertiserStore.advertiser.tel}`" class="hover:text-indigo-600 dark:hover:text-indigo-400">
              {{ advertiserStore.advertiser.tel }}
            </a>
          </div>
          
          <div v-if="advertiserStore.advertiser.site" class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m0 0c1.657 0 3 4.03 3 9s-1.343 9-3 9z" />
            </svg>
            <a :href="advertiserStore.advertiser.site" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
              {{ advertiserStore.advertiser.site.replace(/^https?:\/\//, '') }}
            </a>
          </div>
          
          <div v-if="advertiserStore.advertiser.ville" class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ advertiserStore.advertiser.ville }}
          </div>
        </div>
      </div>

      <!-- Details HTML content -->
      <div 
        class="prose prose-lg max-w-none dark:prose-invert"
        v-html="advertiserStore.advertiser.details"
      ></div>
      
      <!-- Métadonnées (dates) -->
      <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div class="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div v-if="advertiserStore.advertiser.created_at">
            Créé le: {{ new Date(advertiserStore.advertiser.created_at).toLocaleDateString('fr-FR') }}
          </div>
          <div v-if="advertiserStore.advertiser.updated_at">
            Modifié le: {{ new Date(advertiserStore.advertiser.updated_at).toLocaleDateString('fr-FR') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Not found -->
    <div v-else class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <div class="py-10 text-center">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">
          Partenaire non trouvé
        </h3>
        <p class="mt-1 text-gray-500 dark:text-gray-400">
          Le partenaire que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <NuxtLink
          to="/partenaires"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Retour à la liste
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useAdvertiserStore } from '~~/stores/adverstiser';
import { onMounted, watch } from 'vue';
import Breadcrumb from "~/components/Breadcrumb.vue";

const route = useRoute();
const router = useRouter();
const advertiserStore = useAdvertiserStore();
const {$swal,$toastr}=useNuxtApp();

const loadAdvertiser = async () => {
  const slug = route.params.slug;
  if (slug) {
    await advertiserStore.getAdvertiser(slug);
  }
};

const confirmDelete = async (advertiser) => {
  const result = await $swal.fire({
    title: "Supprimer ce partenaire ?",
    text: `Êtes-vous sûr de vouloir supprimer "${advertiser.nom}" ? Cette action est irréversible.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    try {
      await advertiserStore.deleteAdvertiser(advertiser.slug);
      await $toastr.success("Partenaire supprimé avec succès");
      router.push('/partenaires/liste');
    } catch (error) {
      console.error(error);
      $toastr.error(error.response?.data?.message || "Une erreur est survenue lors de la suppression");
    }
  }
};

onMounted(async () => {
  await loadAdvertiser();
});

// Recharger si le slug change
watch(() => route.params.slug, async (newSlug) => {
  if (newSlug) {
    await advertiserStore.getAdvertiser(newSlug);
  }
});
</script>