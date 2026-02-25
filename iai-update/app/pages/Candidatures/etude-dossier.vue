<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Administration', to: '/' },
        { label: 'Gestion', to: null },
      ]"
      title="Gestion des réclamations"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Statistiques -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-sm">
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total</p>
        <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total }}</p>
      </div>
      <div class="bg-yellow-50 dark:bg-yellow-900/20 p-3 sm:p-4 rounded-xl shadow-sm">
        <p class="text-xs sm:text-sm text-yellow-600 dark:text-yellow-400">En attente</p>
        <p class="text-xl sm:text-2xl font-bold text-yellow-700 dark:text-yellow-300">{{ stats.en_attente }}</p>
      </div>
      <div class="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-xl shadow-sm">
        <p class="text-xs sm:text-sm text-green-600 dark:text-green-400">Approuvées</p>
        <p class="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-300">{{ stats.approuvee }}</p>
      </div>
      <div class="bg-red-50 dark:bg-red-900/20 p-3 sm:p-4 rounded-xl shadow-sm">
        <p class="text-xs sm:text-sm text-red-600 dark:text-red-400">Rejetées</p>
        <p class="text-xl sm:text-2xl font-bold text-red-700 dark:text-red-300">{{ stats.rejetee }}</p>
      </div>
    </div>

    <!-- Toolbar -->
    <div
      class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5"
    >
      <!-- Recherche -->
      <div class="relative w-full lg:w-64">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher étudiant, matière..."
          class="w-full px-4 py-2 pl-10 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <svg class="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Filtres -->
      <div class="flex flex-wrap gap-3">
        <select
          v-model="statutFilter"
          class="px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="approuvee">Approuvée</option>
          <option value="rejetee">Rejetée</option>
        </select>

        <!-- Colonnes -->
        <client-only>
          <VDropdown placement="bottom-end">
            <button
              class="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Colonnes
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>

            <template #popper>
              <div
                class="w-56 p-3 rounded-lg shadow-lg bg-white dark:bg-gray-800"
              >
                <div
                  v-for="col in columns"
                  :key="col.field"
                  class="flex items-center gap-2 py-1"
                >
                  <input
                    type="checkbox"
                    v-model="col.visible"
                    :disabled="col.field === 'action'"
                    class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">
                    {{ col.title }}
                  </span>
                </div>
              </div>
            </template>
          </VDropdown>
        </client-only>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-3 sm:p-4">
      <!-- Loader -->
      <div v-if="reclamationStore.isLoading" class="flex justify-center py-10">
        <div
          class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"
        ></div>
      </div>

      <div v-else-if="filteredReclamations.length === 0" class="text-center py-10">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p class="mt-2 text-gray-500 dark:text-gray-400">Aucune réclamation trouvée</p>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="visibleColumns"
          :rows="tableRows"
          :search="searchQuery"
          :per-page="itemsPerPage"
          skin="bh-table-striped bh-table-hover"
          class="w-full"
        >
          <!-- Étudiant -->
          <template #etudiant="{ value }">
            <div>
              <div class="font-medium text-gray-900 dark:text-white">
                {{ value.etudiant?.nom }} {{ value.etudiant?.prenom }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ value.etudiant?.email }}
              </div>
            </div>
          </template>

          <!-- Matière -->
          <template #matiere="{ value }">
            <div class="text-sm text-gray-900 dark:text-white">
              {{ value.evaluation?.matiere || 'N/A' }}
            </div>
          </template>

          <!-- Notes -->
          <template #notes="{ value }">
            <div class="flex items-center gap-2">
              <span :class="getNoteColorClass(value.note_actuelle)">
                {{ value.note_actuelle }}/20
              </span>
              <span v-if="value.nouvelle_note_proposee" class="text-xs text-indigo-600">
                → {{ value.nouvelle_note_proposee }}/20
              </span>
            </div>
          </template>

          <!-- Statut -->
          <template #statut="{ value }">
            <span :class="getStatusBadgeClass(value.statut)" class="px-2 py-1 text-xs rounded-full">
              {{ getStatusText(value.statut) }}
            </span>
          </template>

          <!-- Date -->
          <template #date="{ value }">
            <span class="text-sm text-gray-600 dark:text-gray-300">
              {{ value.date_creation }}
            </span>
          </template>

          <!-- Actions -->
          <template #action="{ value }">
            <div class="flex justify-center gap-2">
            

              <!-- Détails -->
              <button
                @click="voirDetails(value)"
                class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                title="Détails"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>

   
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import Vue3Datatable from "@bhplugin/vue3-datatable"
import "@bhplugin/vue3-datatable/dist/style.css"
import Breadcrumb from "~/components/Breadcrumb.vue"

import { useReclamationStore } from "~~/stores/reclamation"
import {useCandidatureStore} from "~~/stores/candidature"

const reclamationStore = useReclamationStore()
const candidatureStore = useCandidatureStore()
const { $toastr, $swal } = useNuxtApp()

// États
const searchQuery = ref("")
const statutFilter = ref("")
const showTraitementModal = ref(false)
const selectedReclamation = ref(null)
const isSubmitting = ref(false)
const itemsPerPage = ref(10)

// Formulaire
const form = ref({
  statut: "",
  nouvelle_note: "",
  commentaire_admin: ""
})

// Colonnes du tableau
const columns = ref([
  { field: "etudiant", title: "Étudiant", visible: true },
  { field: "matiere", title: "Matière", visible: true },
  { field: "notes", title: "Notes", visible: true },
  { field: "statut", title: "Statut", visible: true },
  { field: "date", title: "Date", visible: false },
  { field: "action", title: "Actions", visible: true },
])

const visibleColumns = computed(() => columns.value.filter((c) => c.visible))

// Statistiques
const stats = computed(() => {
  const reclamations = reclamationStore.reclamations || []
  return {
    total: reclamations.length,
    en_attente: reclamations.filter(r => r.statut === 'en_attente').length,
    approuvee: reclamations.filter(r => r.statut === 'approuvee').length,
    rejetee: reclamations.filter(r => r.statut === 'rejetee').length
  }
})

// Réclamations filtrées
const filteredReclamations = computed(() => {
  let result = reclamationStore.reclamations || []

  // Filtre par statut
  if (statutFilter.value) {
    result = result.filter(r => r.statut === statutFilter.value)
  }

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(r => 
      r.etudiant?.nom?.toLowerCase().includes(query) ||
      r.etudiant?.prenom?.toLowerCase().includes(query) ||
      r.etudiant?.email?.toLowerCase().includes(query) ||
      r.evaluation?.matiere?.toLowerCase().includes(query)
    )
  }

  return result
})

// Données pour le tableau
const tableRows = computed(() => {
  return filteredReclamations.value.map(reclamation => ({
    id: reclamation.id,
    slug: reclamation.slug,
    etudiant: reclamation.etudiant,
    evaluation: reclamation.evaluation,
    note_actuelle: reclamation.note_actuelle,
    nouvelle_note_proposee: reclamation.nouvelle_note_proposee,
    statut: reclamation.statut,
    date_creation: reclamation.date_creation,
    motif: reclamation.motif,
    commentaire_admin: reclamation.commentaire_admin,
    fichier_justificatif: reclamation.fichier_justificatif
  }))
})

// Utilitaires
const getStatusText = (statut) => {
  const status = {
    'en_attente': 'En attente',
    'approuvee': 'Approuvée',
    'rejetee': 'Rejetée'
  }
  return status[statut] || statut
}

const getStatusBadgeClass = (statut) => {
  const classes = {
    'en_attente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'approuvee': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'rejetee': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  }
  return classes[statut] || 'bg-gray-100 text-gray-800'
}

const getNoteColorClass = (note) => {
  if (note >= 16) return 'text-green-600 dark:text-green-400 font-medium'
  if (note >= 12) return 'text-blue-600 dark:text-blue-400 font-medium'
  if (note >= 10) return 'text-yellow-600 dark:text-yellow-400 font-medium'
  return 'text-red-600 dark:text-red-400 font-medium'
}

// Actions
const openTraitementModal = (reclamation) => {
  selectedReclamation.value = reclamation
  form.value = {
    statut: "",
    nouvelle_note: "",
    commentaire_admin: ""
  }
  showTraitementModal.value = true
}

const closeTraitementModal = () => {
  showTraitementModal.value = false
  selectedReclamation.value = null
}

const voirDetails = (reclamation) => {
  // Rediriger vers la page de détail
  navigateTo(`/reclamations/${reclamation.slug}/traiter-la-reclamation`)
}

const traiterReclamation = async () => {
  if (!form.value.statut) {
    $toastr.error("Veuillez choisir une décision")
    return
  }

  if (form.value.statut === 'approuvee' && !form.value.nouvelle_note) {
    $toastr.error("Veuillez saisir la nouvelle note")
    return
  }

  try {
    isSubmitting.value = true
    
    await reclamationStore.traiterReclamation(selectedReclamation.value.id, {
      statut: form.value.statut,
      nouvelle_note: form.value.nouvelle_note || null,
      commentaire_admin: form.value.commentaire_admin || null
    })

    $toastr.success("Réclamation traitée avec succès")
    closeTraitementModal()
    
  } catch (error) {
    console.error("Erreur traitement:", error)
    $toastr.error(error.message || "Erreur lors du traitement")
  } finally {
    isSubmitting.value = false
  }
}

// Chargement initial
onMounted(async () => {
  try {
    await reclamationStore.fetchReclamations()
    await candidatureStore.fetchCandidatures()
  } catch (error) {
    console.error("Erreur chargement:", error)
    $toastr.error("Erreur lors du chargement des réclamations")
  }
})
</script>

<style scoped>
/* Animation pour les cartes */
.transition-shadow {
  transition: box-shadow 0.2s ease;
}

/* Animation spin */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>