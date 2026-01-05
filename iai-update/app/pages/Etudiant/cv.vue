<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <!-- En-tête -->
    <div class="mb-6">
      <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <a href="#" class="hover:text-blue-600">Mon dossier</a>
        <span>/</span>
        <span class="text-gray-800 font-medium">Mon CV</span>
      </div>
      <h1 class="text-2xl font-bold text-gray-800">Mon CV</h1>
    </div>

    <!-- Contenu principal -->
    <div class="max-w-3xl mx-auto">
      <!-- État sans CV -->
      <div v-if="!cvFile" class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <h2 class="text-lg font-semibold text-gray-700 mb-2">Aucun CV</h2>
        <p class="text-gray-500 mb-6">Téléchargez votre CV au format PDF</p>
        
        <input 
          type="file" 
          accept=".pdf"
          @change="handleFileUpload"
          class="hidden"
          ref="fileInput"
        />
        
        <button 
          @click="$refs.fileInput.click()"
          class="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ajouter un CV
        </button>
        
        <p class="text-sm text-gray-400 mt-4">Format PDF uniquement</p>
      </div>

      <!-- État avec CV -->
      <div v-else class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <!-- En-tête -->
        <div class="flex items-start justify-between mb-6">
          <div>
            <h2 class="text-lg font-semibold text-gray-800">Votre CV</h2>
            <p class="text-sm text-gray-500 mt-1">Ajouté aujourd'hui</p>
          </div>
          <span class="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            Actif
          </span>
        </div>

        <!-- Aperçu -->
        <div class="border border-gray-200 rounded-lg p-4 mb-6">
          <div class="flex flex-col md:flex-row gap-4">
            <!-- Icône PDF -->
            <div class="flex-shrink-0">
              <div class="w-20 h-24 flex flex-col border border-gray-300 bg-white rounded-md overflow-hidden">
                <div class="w-full h-8 bg-red-600 flex items-center justify-center">
                  <span class="text-white text-xs font-bold">PDF</span>
                </div>
                <div class="flex-1 flex flex-col items-center justify-center p-2">
                  <div class="text-sm font-medium text-gray-700 mb-1">CV.pdf</div>
                  <div class="text-xs text-gray-500">{{ cvFile.size }}</div>
                </div>
              </div>
            </div>

            <!-- Détails -->
            <div class="flex-1">
              <div class="mb-4">
                <h3 class="text-sm text-gray-500 mb-1">Nom du fichier</h3>
                <p class="text-sm font-medium text-gray-800">{{ cvFile.name }}</p>
              </div>
              
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 class="text-sm text-gray-500">Taille</h3>
                  <p class="text-sm font-medium text-gray-800">{{ cvFile.size }}</p>
                </div>
                <div>
                  <h3 class="text-sm text-gray-500">Type</h3>
                  <p class="text-sm font-medium text-gray-800">PDF</p>
                </div>
              </div>
              
              <!-- Actions -->
              <div class="flex flex-wrap gap-3">
                <button 
                  @click="previewCV"
                  class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Voir le CV
                </button>
                
                <button 
                  @click="$refs.fileInput.click()"
                  class="px-4 py-2 border border-blue-600 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-50 transition-colors"
                >
                  Remplacer
                </button>
                
                <button 
                  @click="removeCV"
                  class="px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-md hover:bg-red-50 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input file caché (pour le remplacement) -->
      <input 
        type="file" 
        accept=".pdf"
        @change="handleFileUpload"
        class="hidden"
        ref="fileInput"
      />
    </div>

    <!-- Modal de prévisualisation -->
    <div v-if="showPreview" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <!-- En-tête modal -->
        <div class="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">Prévisualisation du CV</h3>
          </div>
          <button 
            @click="showPreview = false"
            class="text-gray-400 hover:text-gray-500"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Contenu PDF -->
        <div class="flex-1 p-4 overflow-auto">
          <div v-if="cvFile && cvFile.url" class="h-full">
            <iframe 
              :src="cvFile.url" 
              class="w-full h-full min-h-[500px] border-0"
              frameborder="0"
            ></iframe>
          </div>
          <div v-else class="h-full flex items-center justify-center text-gray-500">
            Aucun fichier à afficher
          </div>
        </div>

        <!-- Pied de modal -->
        <div class="px-6 py-4 border-t flex justify-end">
          <button 
            @click="showPreview = false"
            class="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cvFile: null,
      showPreview: false
    }
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0]
      
      if (!file) return
      
      // Vérifier le type
      if (file.type !== 'application/pdf') {
        alert('Veuillez sélectionner un fichier PDF')
        return
      }
      
      // Vérifier la taille
      if (file.size > 10 * 1024 * 1024) { // 10MB
        alert('Le fichier est trop volumineux')
        return
      }
      
      // Créer une URL pour le fichier
      const fileUrl = URL.createObjectURL(file)
      
      // Formater la taille
      const size = this.formatFileSize(file.size)
      
      // Sauvegarder le fichier
      this.cvFile = {
        name: file.name,
        size: size,
        url: fileUrl,
        file: file
      }
      
      // Réinitialiser l'input
      event.target.value = ''
    },
    
    formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' bytes'
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    },
    
    previewCV() {
      this.showPreview = true
    },
    
    removeCV() {
      if (confirm('Supprimer ce CV ?')) {
        // Libérer l'URL si elle existe
        if (this.cvFile && this.cvFile.url) {
          URL.revokeObjectURL(this.cvFile.url)
        }
        this.cvFile = null
        this.showPreview = false
      }
    }
  },
  
  beforeDestroy() {
    // Nettoyer l'URL quand le composant est détruit
    if (this.cvFile && this.cvFile.url) {
      URL.revokeObjectURL(this.cvFile.url)
    }
  }
}
</script>

<style scoped>
/* Empêcher le défilement du body quand la modal est ouverte */
body {
  overflow: auto;
}
</style>