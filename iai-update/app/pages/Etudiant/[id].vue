<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <div class="mb-6">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li class="inline-flex items-center">
              <NuxtLink to="/annonces" class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                Annonces
              </NuxtLink>
            </li>
            <li aria-current="page">
              <div class="flex items-center">
                <svg class="w-3 h-3 mx-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">Détail</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mt-2">Détail de l'annonce</h1>
      </div>

      <!-- Détail de l'annonce -->
      <div v-if="announcement" class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="p-6 md:p-8">
          <div class="space-y-6">
            <!-- En-tête -->
            <div>
              <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ announcement.title }}</h2>
              <p class="text-gray-500 text-lg mb-4">{{ announcement.type }}</p>
              <p class="text-gray-600 text-base leading-relaxed">{{ announcement.description }}</p>
            </div>

            <!-- Métadonnées -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-center text-gray-500">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>{{ announcement.location }}</span>
              </div>
              <div class="flex items-center text-gray-500">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span>Publié le {{ formatDate(announcement.createdAt) }}</span>
              </div>
            </div>

            <!-- Contenu détaillé -->
            <div class="prose max-w-none">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">Description détaillée</h3>
              <p class="text-gray-700">
                {{ announcement.detailedDescription }}
              </p>
            </div>

            <!-- Boutons d'action -->
            <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
              <button class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md">
                Postuler maintenant
              </button>
              <button class="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Message de chargement ou d'erreur -->
      <div v-else-if="loading" class="text-center py-12">
        <p class="text-gray-500">Chargement de l'annonce...</p>
      </div>
      <div v-else class="text-center py-12">
        <p class="text-red-500">Annonce non trouvée.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

interface Announcement {
  id: number;
  title: string;
  type: string;
  description: string;
  detailedDescription: string;
  location: string;
  createdAt: string;
}

const route = useRoute();
const announcement = ref<Announcement | null>(null);
const loading = ref(true);

onMounted(async () => {
  // Récupérer l'ID de l'annonce depuis l'URL
  const { id } = route.params;

  try {
    // Ici, vous devriez faire un appel API pour récupérer les détails de l'annonce
    // Pour l'exemple, nous simulons une requête
    const response = await fetch(`/api/announcements/${id}`);
    if (response.ok) {
      announcement.value = await response.json();
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};
</script>