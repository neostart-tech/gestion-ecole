<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
    <!-- Loader -->
    <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
      <div class="w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div class="h-full bg-blue-600 animate-loader"></div>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
      <span class="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Mes relevés</span>
      <span>/</span>
      <span class="text-gray-900 dark:text-white font-medium cursor-default">Voir mon relevé de notes</span>
    </div>

    <!-- Contenu principal -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
      <!-- Bouton d'impression -->
      <div class="flex justify-end mb-4 no-print">
        <button
          @click="printReleve"
          class="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
          </svg>
          Imprimer
        </button>
      </div>

      <!-- Relevé de notes -->
      <div id="releveToPrint" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6">
        <!-- En-tête du relevé -->
        <div class="text-center border-b border-gray-300 dark:border-gray-600 pb-4 mb-6">
          <img src="https://www.iai-togo.tg/wp-content/uploads/2017/06/logo.jpeg" alt="Logo École" class="h-16 mx-auto mb-2">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">INSTITUT AFRICAIN D'INFORMATIQUE</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Excellence, Rigueur, Innovation</p>
          <p class="text-xs text-gray-500 dark:text-gray-500">B.P. 1234 – Lomé, Togo | Tél : +228 90 00 00 00 | Email : contact@iai.tg</p>
          <div class="h-px bg-blue-600 mt-3"></div>
        </div>

        <!-- Informations de l'étudiant -->
        <div v-if="releveData.user" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Nom :</p>
            <p class="font-semibold text-gray-900 dark:text-white">{{ releveData.user.nom?.toUpperCase() }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Prénom :</p>
            <p class="font-semibold text-gray-900 dark:text-white">{{ releveData.user.prenom }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Période :</p>
            <p class="font-semibold text-gray-900 dark:text-white">{{ releveData.periode_nom }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Année :</p>
            <p class="font-semibold text-gray-900 dark:text-white">{{ releveData.anne }}</p>
          </div>
        </div>

        <!-- Légende des notes -->
        <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 class="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">Légende des notes (sur 20)</h4>
          <div class="flex flex-wrap gap-4">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span class="text-xs text-gray-700 dark:text-gray-300">≥ 16 : Excellent</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span class="text-xs text-gray-700 dark:text-gray-300">12 - 15.9 : Bien</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span class="text-xs text-gray-700 dark:text-gray-300">10 - 11.9 : Passable</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span class="text-xs text-gray-700 dark:text-gray-300">&lt; 10 : Échec</span>
            </div>
          </div>
        </div>

        <!-- Unités d'Enseignement -->
        <div v-for="(ueData, ueNom) in releveData.releve_grouped" :key="ueNom" class="mb-8">
          <!-- Header UE -->
          <div class="mb-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="font-bold text-blue-800 dark:text-blue-300">UE : {{ ueNom }}</h3>
                <p class="text-sm text-blue-700 dark:text-blue-400">
                  Crédits : {{ ueData[0]?.credit || 0 }} | 
                  Moyenne UE : <span :class="getNoteClass(ueData[0]?.moyenne_ue)">{{ ueData[0]?.moyenne_ue || 'N/A' }}/20</span>
                </p>
              </div>
              <div class="text-right">
                <span v-if="getUEValidationStatus(ueData)" 
                      :class="getUEValidationClass(ueData)"
                      class="text-sm font-semibold px-3 py-1 rounded-full">
                  {{ getUEValidationText(ueData) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Table des UVs -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">MATIERE</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Devoir</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Interro</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Examen</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Moy. UV</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Coef.</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Statut</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="uv in ueData" :key="uv.uv" 
                    :class="{'bg-red-50 dark:bg-red-900/20': parseFloat(uv.moyenne_uv) < 10}">
                  <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">{{ uv.uv }}</td>
                  <td class="px-4 py-2 text-sm text-center">{{ uv.devoir || '-' }}</td>
                  <td class="px-4 py-2 text-sm text-center">{{ uv.interrogation || '-' }}</td>
                  <td class="px-4 py-2 text-sm text-center">{{ uv.examen || '-' }}</td>
                  <td class="px-4 py-2 text-sm text-center font-medium" 
                      :class="getNoteClass(uv.moyenne_uv)">
                    {{ uv.moyenne_uv }}/20
                  </td>
                  <td class="px-4 py-2 text-sm text-center">{{ uv.coefficient }}</td>
                  <td class="px-4 py-2 text-sm text-center">
                    <span :class="getValidationClass(uv.moyenne_uv)" class="px-2 py-1 rounded-full text-xs">
                      {{ getValidationText(uv.moyenne_uv) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Résumé -->
        <div class="mt-8">
          <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Résumé du semestre</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p class="text-sm text-gray-600 dark:text-gray-400">Moyenne générale</p>
              <p class="text-2xl font-bold" :class="getNoteClass(releveData.moyenne_generale)">
                {{ releveData.moyenne_generale || 'N/A' }}/20
              </p>
            </div>
            <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p class="text-sm text-green-700 dark:text-green-400">Total crédits validés</p>
              <p class="text-2xl font-bold text-green-800 dark:text-green-300">{{ releveData.total_credits_valides || 0 }}</p>
            </div>
            <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p class="text-sm text-red-700 dark:text-red-400">Total crédits non validés</p>
              <p class="text-2xl font-bold text-red-800 dark:text-red-300">{{ releveData.total_credits_non_valides || 0 }}</p>
            </div>
          </div>
        </div>

        <!-- Signature -->
        <div class="mt-12 pt-6 border-t border-gray-300 dark:border-gray-700">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-end">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Fait à Lomé, le {{ currentDate }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Cachet et signature</p>
            </div>
            <div class="text-right mt-4 md:mt-0">
              <p class="font-semibold text-gray-900 dark:text-white">LE DIRECTEUR</p>
              <div class="h-20 w-48 border-b border-gray-400 mt-2"></div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Signature</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Message si pas de données -->
      <div v-if="!releveData.user && !loading" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p class="text-gray-500 dark:text-gray-400">Aucun relevé de notes disponible pour le moment.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// États
const loading = ref(true)
const releveData = ref({})

// Données de test (simulées) - avec 10 comme moyenne de validation
const mockData = {
  user: {
    nom: "AFANTSAO",
    prenom: "Komi Ebénezer Aménouvévé"
  },
  periode_nom: "Semestre 1 - 2024/2025",
  annee: "2024/2025",
  moyenne_generale: "12.8",
  total_credits_valides: 24,
  total_credits_non_valides: 6,
  releve_grouped: {
    "Algorithme et Programmation": [
      {
        uv: "Algorithme de base",
        devoir: "15.5",
        interrogation: "12.0",
        examen: "16.0",
        moyenne_uv: "14.5",
        coefficient: "4",
        credit: "6",
        moyenne_ue: "13.8"
      },
      {
        uv: "Programmation C",
        devoir: "18.0",
        interrogation: "16.5",
        examen: "17.0",
        moyenne_uv: "17.2",
        coefficient: "3",
        credit: "6",
        moyenne_ue: "13.8"
      },
      {
        uv: "Structures de données",
        devoir: "8.5",
        interrogation: "9.0",
        examen: "7.5",
        moyenne_uv: "8.3",
        coefficient: "3",
        credit: "6",
        moyenne_ue: "13.8"
      }
    ],
    "Mathématiques Appliquées": [
      {
        uv: "Algèbre Linéaire",
        devoir: "14.5",
        interrogation: "13.0",
        examen: "15.5",
        moyenne_uv: "14.3",
        coefficient: "3",
        credit: "4",
        moyenne_ue: "11.2"
      },
      {
        uv: "Analyse Mathématique",
        devoir: "9.0",
        interrogation: "8.5",
        examen: "10.5",
        moyenne_uv: "9.3",
        coefficient: "3",
        credit: "4",
        moyenne_ue: "11.2"
      },
      {
        uv: "Probabilités",
        devoir: "11.0",
        interrogation: "10.5",
        examen: "12.0",
        moyenne_uv: "11.2",
        coefficient: "2",
        credit: "4",
        moyenne_ue: "11.2"
      }
    ],
    "Systèmes d'Information": [
      {
        uv: "Bases de données",
        devoir: "14.0",
        interrogation: "13.5",
        examen: "15.0",
        moyenne_uv: "14.2",
        coefficient: "4",
        credit: "5",
        moyenne_ue: "15.1",
        gratification: { type: "Compensation" }
      },
      {
        uv: "Systèmes d'exploitation",
        devoir: "8.0",
        interrogation: "7.5",
        examen: "9.0",
        moyenne_uv: "8.2",
        coefficient: "3",
        credit: "5",
        moyenne_ue: "15.1"
      }
    ]
  }
}

// Date actuelle formatée
const currentDate = computed(() => {
  return new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Fonctions utilitaires - 10 comme moyenne de validation
const getNoteClass = (note) => {
  const numericNote = parseFloat(note)
  if (numericNote >= 16) return 'text-green-600 dark:text-green-400'
  if (numericNote >= 12) return 'text-blue-600 dark:text-blue-400'
  if (numericNote >= 10) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

const getValidationClass = (moyenne) => {
  const numericMoyenne = parseFloat(moyenne)
  if (numericMoyenne >= 16) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
  if (numericMoyenne >= 12) return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300'
  if (numericMoyenne >= 10) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
  return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
}

const getValidationText = (moyenne) => {
  const numericMoyenne = parseFloat(moyenne)
  if (numericMoyenne >= 16) return 'Excellent'
  if (numericMoyenne >= 12) return 'Bien'
  if (numericMoyenne >= 10) return 'Passable'
  return 'Échec'
}

const getUEValidationStatus = (ueData) => {
  if (!Array.isArray(ueData) || ueData.length === 0) return false
  
  // Vérifier si une gratification existe
  const hasGratification = ueData.some(uv => uv.gratification)
  if (hasGratification) return 'gratification'
  
  // Vérifier s'il y a des UV en échec (< 10/20)
  const hasFailedUV = ueData.some(uv => parseFloat(uv.moyenne_uv) < 10)
  if (hasFailedUV) return 'failed'
  
  // Vérifier la moyenne de l'UE
  const moyenneUE = parseFloat(ueData[0]?.moyenne_ue || 0)
  if (moyenneUE >= 10) return 'valid'
  
  return 'not_valid'
}

const getUEValidationText = (ueData) => {
  const status = getUEValidationStatus(ueData)
  switch (status) {
    case 'gratification':
      return 'Validé par gratification'
    case 'failed':
      return 'Ajourné (matière < 10)'
    case 'valid':
      return 'Validé'
    case 'not_valid':
      return 'Non validé'
    default:
      return 'En cours'
  }
}

const getUEValidationClass = (ueData) => {
  const status = getUEValidationStatus(ueData)
  switch (status) {
    case 'gratification':
    case 'valid':
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
    case 'failed':
    case 'not_valid':
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
    default:
      return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
  }
}

// Fonction d'impression
const printReleve = () => {
  const printContent = document.getElementById('releveToPrint')
  const originalContent = document.body.innerHTML
  
  document.body.innerHTML = printContent.outerHTML
  window.print()
  document.body.innerHTML = originalContent
  window.location.reload()
}

// Récupération des données
const fetchReleveData = async () => {
  try {
    loading.value = true
    
    // Simuler un délai de chargement
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // En production, vous feriez :
    // const response = await fetch('/api/espace-etudiant/mes-releves')
    // releveData.value = await response.json()
    
    // Pour l'exemple, on utilise les données mockées
    releveData.value = mockData
    
  } catch (error) {
    console.error('Erreur lors de la récupération du relevé:', error)
    // Afficher un message d'erreur
  } finally {
    loading.value = false
  }
}

// Initialisation
onMounted(() => {
  fetchReleveData()
})
</script>

<style scoped>
.animate-loader {
  animation: loader 2s ease-in-out infinite;
}

@keyframes loader {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Styles pour l'impression */
@media print {
  .no-print {
    display: none !important;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-size: 11px;
    background: white !important;
    color: black !important;
  }
  
  #releveToPrint {
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  
  table {
    font-size: 10px !important;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 2px 4px !important;
    border: 1px solid #ccc !important;
  }
  
  .bg-gray-50, .bg-blue-50, .bg-green-50, .bg-red-50, .bg-yellow-50 {
    background-color: #f9fafb !important;
    -webkit-print-color-adjust: exact;
  }
  
  .dark\:bg-gray-800, .dark\:bg-blue-900\/30, .dark\:bg-green-900\/20, .dark\:bg-red-900\/20, .dark\:bg-yellow-900\/20 {
    background-color: white !important;
  }
  
  .text-gray-900, .dark\:text-white {
    color: black !important;
  }
  
  .text-gray-600, .dark\:text-gray-400 {
    color: #666 !important;
  }
}
</style>