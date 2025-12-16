<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Publications</span>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Liste des publications</span>
    </div>

    <!-- Titre et boutons -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-900">Liste des blogs</h1>
      
      <div class="flex flex-col sm:flex-row gap-3">
        <NuxtLink
          to="/publications/infos-urgentes"
          class="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.698-.833-2.464 0L4.288 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          Informations urgentes
        </NuxtLink>
        
        <NuxtLink
          to="/publications/ajouter"
          class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Ajouter une publication
        </NuxtLink>
      </div>
    </div>

    <!-- Barre de recherche et filtre -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <!-- Recherche -->
      <div class="relative flex-1">
        <input
          v-model="searchQuery"
          type="search"
          class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder="Rechercher une publication..."
        />
        <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>

      <!-- Filtre d'ordre -->
      <select 
        v-model="sortOrder"
        class="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
      >
        <option value="desc">Du plus récent au plus ancien</option>
        <option value="asc">Du plus ancien au plus récent</option>
        <option value="alpha">Ordre alphabétique</option>
      </select>
    </div>

    <!-- Liste des blogs -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="blog in filteredBlogs" 
        :key="blog.id"
        class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
      >
        <!-- Image du blog -->
        <div class="h-48 bg-gray-200 relative overflow-hidden">
          <img 
            v-if="blog.image"
            :src="blog.image" 
            :alt="blog.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-r from-indigo-100 to-purple-100">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          
          <!-- Badge urgent -->
          <span 
            v-if="blog.isUrgent"
            class="absolute top-3 left-3 px-2 py-1 bg-rose-500 text-white text-xs font-semibold rounded"
          >
            URGENT
          </span>
        </div>

        <!-- Contenu du blog -->
        <div class="p-6">
          <!-- Date et auteur -->
          <div class="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span>{{ formatDate(blog.date) }}</span>
            <span class="mx-1">•</span>
            <span>Auteur: {{ blog.author }}</span>
          </div>

          <!-- Titre -->
          <h3 class="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
            {{ blog.title }}
          </h3>

          <!-- Contenu prévisualisé -->
          <p class="text-gray-600 mb-4 line-clamp-3">
            {{ blog.excerpt || blog.content.substring(0, 150) + '...' }}
          </p>

          <!-- Actions -->
          <div class="flex items-center justify-between pt-4 border-t border-gray-100">
            <!-- Statut -->
            <span 
              :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                blog.status === 'published' 
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              ]"
            >
              {{ blog.status === 'published' ? 'Publié' : 'Brouillon' }}
            </span>

            <!-- Boutons d'actions -->
            <div class="flex items-center gap-2">
              <!-- Modifier -->
              <button 
                @click="editBlog(blog)"
                class="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Modifier"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>

              <!-- Supprimer -->
              <button 
                @click="deleteBlog(blog)"
                class="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Supprimer"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>

              <!-- Prévisualiser -->
              <button 
                @click="previewBlog(blog)"
                class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Prévisualiser"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message si aucune publication -->
    <div 
      v-if="filteredBlogs.length === 0"
      class="bg-white rounded-xl shadow-sm p-12 text-center"
    >
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune publication trouvée</h3>
      <p class="text-gray-500 mb-6">Commencez par créer votre première publication.</p>
      <NuxtLink
        to="/publications/ajouter"
        class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Ajouter une publication
      </NuxtLink>
    </div>

    <!-- Modal de suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="modal-content">
          <div class="modal-header border-b border-gray-200 p-6">
            <h5 class="modal-title text-lg font-semibold text-gray-900">Supprimer la publication</h5>
            <button type="button" @click="closeDeleteModal" class="btn-close text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body p-6">
            <p class="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer la publication "{{ blogToDelete?.title }}" ? Cette action est irréversible.
            </p>
          </div>
          <div class="modal-footer border-t border-gray-200 p-6 flex justify-end gap-3">
            <button 
              type="button" 
              @click="closeDeleteModal"
              class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button 
              type="button" 
              @click="confirmDelete"
              class="btn btn-warning px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
            >
              Supprimer définitivement
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de prévisualisation -->
    <div v-if="showPreviewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div class="modal-content">
          <div class="modal-header border-b border-gray-200 p-6 flex justify-between items-center">
            <h5 class="modal-title text-lg font-semibold text-gray-900">Prévisualisation</h5>
            <button type="button" @click="closePreviewModal" class="btn-close text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body p-6 overflow-y-auto max-h-[70vh]">
            <div v-if="blogToPreview" class="prose max-w-none">
              <!-- Image -->
              <div class="mb-6">
                <img 
                  v-if="blogToPreview.image"
                  :src="blogToPreview.image" 
                  :alt="blogToPreview.title"
                  class="w-full h-64 object-cover rounded-lg"
                />
              </div>
              
              <!-- Métadonnées -->
              <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span>{{ formatDate(blogToPreview.date) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  <span>Auteur: {{ blogToPreview.author }}</span>
                </div>
              </div>
              
              <!-- Titre -->
              <h1 class="text-3xl font-bold text-gray-900 mb-6">{{ blogToPreview.title }}</h1>
              
              <!-- Contenu -->
              <div class="text-gray-700" v-html="blogToPreview.content"></div>
            </div>
          </div>
          <div class="modal-footer border-t border-gray-200 p-6 flex justify-end">
            <button 
              type="button" 
              @click="closePreviewModal"
              class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Données réactives
const searchQuery = ref('');
const sortOrder = ref('desc');
const showDeleteModal = ref(false);
const showPreviewModal = ref(false);
const blogToDelete = ref(null);
const blogToPreview = ref(null);

// Données initiales des blogs (exemples)
const initialBlogs = [
  {
    id: 1,
    title: "Code & Design: L'Importance du Design UX/UI dans le Développement Web",
    author: "Admin",
    date: "2024-07-04",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    excerpt: "Découvrez pourquoi le design UX/UI est crucial pour le succès de vos applications web modernes.",
    content: "<p>Le design UX/UI n'est plus un luxe mais une nécessité dans le développement web moderne...</p>",
    status: "published",
    isUrgent: false
  },
  {
    id: 2,
    title: "Tech à la Une: L'Internet des Objets (IoT)",
    author: "Admin",
    date: "2024-07-04",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    excerpt: "Explorez le monde fascinant de l'Internet des Objets et son impact sur notre quotidien.",
    content: "<p>L'IoT révolutionne notre façon d'interagir avec les objets connectés...</p>",
    status: "published",
    isUrgent: true
  },
  {
    id: 3,
    title: "Innovations Numériques: Les Avancées de la Réalité Augmentée et ses Applications",
    author: "Admin",
    date: "2024-07-03",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    excerpt: "Plongez dans l'univers de la réalité augmentée et découvrez ses applications innovantes.",
    content: "<p>La réalité augmentée ouvre de nouvelles possibilités dans divers domaines...</p>",
    status: "published",
    isUrgent: false
  },
  {
    id: 4,
    title: "Le Coin des Geeks: Comprendre les Bases de la Cybersécurité",
    author: "Admin",
    date: "2024-07-03",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    excerpt: "Apprenez les fondamentaux de la cybersécurité pour protéger vos données numériques.",
    content: "<p>Dans un monde de plus en plus connecté, la cybersécurité est essentielle...</p>",
    status: "draft",
    isUrgent: false
  },
  {
    id: 5,
    title: "Tech et Innovation: L'Impact de l'Intelligence Artificielle sur les Emplois",
    author: "Admin",
    date: "2024-07-03",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    excerpt: "Analyse de l'influence de l'IA sur le marché du travail et les métiers de demain.",
    content: "<p>L'intelligence artificielle transforme radicalement le paysage professionnel...</p>",
    status: "published",
    isUrgent: false
  },
  {
    id: 6,
    title: "Les Meilleures Pratiques pour Écrire un Code Propre",
    author: "Admin",
    date: "2024-07-03",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    excerpt: "Découvrez les meilleures pratiques pour écrire un code maintenable et efficace.",
    content: "<p>Un code propre est la base de tout projet logiciel réussi...</p>",
    status: "published",
    isUrgent: false
  }
];

const blogs = ref([]);

// Charger les blogs depuis localStorage
onMounted(() => {
  loadBlogs();
});

const loadBlogs = () => {
  if (process.client) {
    const storedBlogs = localStorage.getItem('blogs');
    if (storedBlogs) {
      blogs.value = JSON.parse(storedBlogs);
    } else {
      blogs.value = initialBlogs;
      localStorage.setItem('blogs', JSON.stringify(initialBlogs));
    }
  }
};

// Filtrer et trier les blogs
const filteredBlogs = computed(() => {
  let filtered = [...blogs.value];
  
  // Filtre de recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(blog =>
      blog.title.toLowerCase().includes(query) ||
      blog.author.toLowerCase().includes(query) ||
      blog.excerpt.toLowerCase().includes(query) ||
      blog.content.toLowerCase().includes(query)
    );
  }
  
  // Tri
  filtered.sort((a, b) => {
    switch (sortOrder.value) {
      case 'desc':
        return new Date(b.date) - new Date(a.date);
      case 'asc':
        return new Date(a.date) - new Date(b.date);
      case 'alpha':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
  
  return filtered;
});

// Formater la date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Actions sur les blogs
const editBlog = (blog) => {
  navigateTo(`/publications/modifier/${blog.id}`);
};

const deleteBlog = (blog) => {
  blogToDelete.value = blog;
  showDeleteModal.value = true;
};

const previewBlog = (blog) => {
  blogToPreview.value = blog;
  showPreviewModal.value = true;
};

const confirmDelete = () => {
  if (blogToDelete.value) {
    const index = blogs.value.findIndex(b => b.id === blogToDelete.value.id);
    if (index !== -1) {
      blogs.value.splice(index, 1);
      localStorage.setItem('blogs', JSON.stringify(blogs.value));
    }
    closeDeleteModal();
  }
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  blogToDelete.value = null;
};

const closePreviewModal = () => {
  showPreviewModal.value = false;
  blogToPreview.value = null;
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prose :deep(h1) {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.prose :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.prose :deep(img) {
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}
</style>