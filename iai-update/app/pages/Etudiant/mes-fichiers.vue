<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <!-- En-tête de la page -->
    <div class="mb-8">
      <nav class="mb-4" aria-label="Breadcrumb">
        <ol class="flex flex-wrap items-center text-sm text-gray-600">
          <li class="inline-flex items-center">
            <a href="#" class="hover:text-blue-600">Mon dossier</a>
          </li>
          <li class="mx-2">/</li>
          <li class="text-gray-800 font-medium">Mes fichiers</li>
        </ol>
      </nav>
      <h1 class="text-2xl font-bold text-gray-800">Mes fichiers</h1>
    </div>

    <!-- Grille des fichiers -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <!-- Carte de fichier - Lettre manuscrite -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-4">
          <div class="flex justify-center mb-4">
            <div class="h-32 w-32 flex items-center justify-center bg-red-50 rounded-lg">
              <svg class="h-20 w-20 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-gray-900 truncate">Lettre manuscrite</h3>
            </div>
            <button 
              @click="openPreview('/storage/lettres_manuscrites/afantsao-komi-ebenezer-amenouveve686cf0233554b.pdf')"
              class="ml-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Carte de fichier - Extrait de naissance -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-4">
          <div class="flex justify-center mb-4">
            <div class="h-32 w-32 flex items-center justify-center bg-red-50 rounded-lg">
              <svg class="h-20 w-20 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-gray-900 truncate">Extrait de naissance</h3>
            </div>
            <button 
              @click="openPreview('/storage/naissances/afantsao-komi-ebenezer-amenouveve686cf0237175c.pdf')"
              class="ml-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Carte de fichier - Certificat de nationalité -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-4">
          <div class="flex justify-center mb-4">
            <div class="h-32 w-32 flex items-center justify-center bg-red-50 rounded-lg">
              <svg class="h-20 w-20 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-gray-900 truncate">Certificat de nationalité</h3>
            </div>
            <button 
              @click="openPreview('/storage/nationalites/afantsao-komi-ebenezer-amenouveve686cf02377ac2.pdf')"
              class="ml-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Carte de fichier - Diplôme requis -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-4">
          <div class="flex justify-center mb-4">
            <div class="h-32 w-32 flex items-center justify-center bg-red-50 rounded-lg">
              <svg class="h-20 w-20 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-gray-900 truncate">Diplôme requis</h3>
              <p class="text-xs text-gray-500 mt-1">Diplôme universitaire de technologie</p>
            </div>
            <button 
              @click="openPreview('/storage/diplomes/afantsao-komi-ebenezer-amenouveve686cf0237493d.pdf')"
              class="ml-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Carte de fichier - Photo d'identité -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-4">
          <div class="flex justify-center mb-4">
            <div class="h-32 w-32 flex items-center justify-center bg-blue-50 rounded-lg">
              <svg class="h-20 w-20 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-gray-900 truncate">Photo d'identité</h3>
            </div>
            <button 
              @click="openPreview('/storage/photos_identite/afantsao-komi-ebenezer-amenouveve686cf0237b2a2.jpg')"
              class="ml-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Carte de fichier - Certificat médical -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-4">
          <div class="flex justify-center mb-4">
            <div class="h-32 w-32 flex items-center justify-center bg-red-50 rounded-lg">
              <svg class="h-20 w-20 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-gray-900 truncate">Certificat médical</h3>
            </div>
            <button 
              @click="openPreview('/storage/certificats_medicaux/afantsao-komi-ebenezer-amenouveve686cf0238580a.pdf')"
              class="ml-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
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

    <!-- Modal de prévisualisation -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Overlay -->
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75" @click="closePreview"></div>
        </div>

        <!-- Modal -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Prévisualisation
                  </h3>
                  <button 
                    @click="closePreview"
                    class="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                
                <!-- Contenu du fichier -->
                <div class="mt-2 w-full">
                  <iframe 
                    v-if="currentFile && currentFile.endsWith('.pdf')"
                    :src="currentFile" 
                    class="w-full h-96 border-0"
                    frameborder="0"
                  ></iframe>
                  <img 
                    v-else-if="currentFile && (currentFile.endsWith('.jpg') || currentFile.endsWith('.jpeg') || currentFile.endsWith('.png'))"
                    :src="currentFile" 
                    alt="Preview" 
                    class="w-full h-auto max-h-96 object-contain mx-auto"
                  />
                  <div v-else class="text-center py-12 text-gray-500">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <p class="mt-2">Aucun fichier sélectionné</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              @click="closePreview"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
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
import { ref } from 'vue'

const showModal = ref(false)
const currentFile = ref('')

const openPreview = (fileUrl) => {
  currentFile.value = fileUrl
  showModal.value = true
  // Empêcher le défilement de la page principale
  document.body.style.overflow = 'hidden'
}

const closePreview = () => {
  showModal.value = false
  currentFile.value = ''
  // Réactiver le défilement de la page principale
  document.body.style.overflow = 'auto'
}

// Fermer la modale avec la touche Échap
const handleEscape = (event) => {
  if (event.key === 'Escape' && showModal.value) {
    closePreview()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>