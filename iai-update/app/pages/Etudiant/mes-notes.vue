<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Espace étudiant', to: '/' },
        { label: 'Notes', to: null },
      ]"
      title="Mes notes"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Statistiques globales -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <p class="text-sm text-gray-500 dark:text-gray-400">Total notes</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalNotes }}</p>
      </div>
      <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl shadow-sm">
        <p class="text-sm text-blue-600 dark:text-blue-400">Moyenne générale</p>
        <p class="text-2xl font-bold text-blue-700 dark:text-blue-300">{{ moyenneGenerale }}/20</p>
      </div>
      <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl shadow-sm">
        <p class="text-sm text-green-600 dark:text-green-400">Meilleure note</p>
        <p class="text-2xl font-bold text-green-700 dark:text-green-300">{{ meilleureNote }}/20</p>
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
          placeholder="Rechercher par matière..."
          class="w-full px-4 py-2 pl-10 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <svg class="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Filtres -->
      <div class="flex flex-wrap gap-3">
        <select
          v-model="selectedSemestre"
          class="px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Tous les semestres</option>
          <option v-for="periode in periodes" :key="periode.id" :value="periode.nom">
            {{ periode.nom }}
          </option>
        </select>

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

    <!-- Table des notes -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-3 sm:p-4">
      <div v-if="loading" class="flex justify-center py-10">
        <div
          class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"
        ></div>
      </div>

      <div v-else-if="filteredNotes.length === 0" class="text-center py-10">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="mt-2 text-gray-500 dark:text-gray-400">Aucune note trouvée</p>
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
          <!-- Code -->
          <template #code="{ value }">
            <span class="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {{ value.evaluation?.matiere?.code || 'N/A' }}
            </span>
          </template>

          <!-- Matière -->
          <template #matiere="{ value }">
            <div class="font-medium text-gray-900 dark:text-white">
              {{ value.evaluation?.matiere?.nom || 'N/A' }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              Coefficient: {{ value.evaluation?.matiere?.coefficient || 1 }}
            </div>
          </template>

          <!-- Type évaluation -->
          <template #type="{ value }">
            <span class="px-2 py-1 text-xs rounded-full" :class="getTypeClass(value.evaluation?.type)">
              {{ value.evaluation?.type || 'N/A' }}
            </span>
          </template>

          <!-- Période -->
          <template #periode="{ value }">
            <div class="text-sm">
              <span>{{ value.evaluation?.matiere?.ue?.periode?.nom || 'N/A' }}</span>
            </div>
          </template>

          <!-- Note -->
          <template #note="{ value }">
            <div class="text-center">
              <span :class="[
                'text-xl font-bold block',
                getNoteColor(value.notation)
              ]">
                {{ value.notation }}/20
              </span>
              <span class="text-xs text-gray-500">
                {{ getMention(value.notation) }}
              </span>
            </div>
          </template>

          <!-- Actions -->
          <template #action="{ value }">
            <div class="flex justify-center gap-2">
              <!-- Voir détails -->
              <button
                @click="openDetailModal(value)"
                class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                title="Voir détails"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>

              <NuxtLink
  
                :to="`/etudiant/${value.id}/faire-une-reclamation`"
                class="p-2 rounded-lg text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                title="Réclamer"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </NuxtLink>
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>

    <!-- MODAL DÉTAIL NOTE (avec bouton annuler) -->
    <Teleport to="body">
      <TransitionRoot appear :show="showDetailModal" as="template">
        <Dialog as="div" class="relative z-50" @close="closeDetailModal">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="ease-in duration-200"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/60" />
          </TransitionChild>

          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                as="template"
                enter="ease-out duration-300"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="ease-in duration-200"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel
                  class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 text-left align-middle shadow-xl transition-all"
                >
                  <!-- En-tête -->
                  <div class="flex items-start justify-between mb-4 sm:mb-6">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 sm:gap-3 mb-2">
                        <div class="p-1.5 sm:p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex-shrink-0">
                          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <DialogTitle class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                          {{ selectedNote?.evaluation?.matiere?.nom || 'Détail de la note' }}
                        </DialogTitle>
                      </div>
                      <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                        Code: {{ selectedNote?.evaluation?.matiere?.code || 'N/A' }} | 
                        Coefficient: {{ selectedNote?.evaluation?.matiere?.coefficient || 1 }}
                      </p>
                    </div>
                    <button
                      @click="closeDetailModal"
                      class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <!-- Contenu détaillé -->
                  <div v-if="selectedNote" class="space-y-4 sm:space-y-6">
                    <!-- Grille d'information -->
                    <div class="grid grid-cols-2 gap-3 sm:gap-4">
                      <div class="bg-gray-50 dark:bg-gray-900/50 p-2 sm:p-3 rounded-lg">
                        <p class="text-xs text-gray-500 dark:text-gray-400">Note obtenue</p>
                        <p :class="['text-xl sm:text-2xl font-bold', getNoteColor(selectedNote.notation)]">
                          {{ selectedNote.notation }}/20
                        </p>
                        <p class="text-xs text-gray-500">{{ getMention(selectedNote.notation) }}</p>
                      </div>

                      <div class="bg-gray-50 dark:bg-gray-900/50 p-2 sm:p-3 rounded-lg">
                        <p class="text-xs text-gray-500 dark:text-gray-400">Type</p>
                        <p class="font-medium text-sm sm:text-base">{{ selectedNote.evaluation?.type || 'N/A' }}</p>
                        <p class="text-xs text-gray-500">Évaluation</p>
                      </div>

                      <div class="bg-gray-50 dark:bg-gray-900/50 p-2 sm:p-3 rounded-lg">
                        <p class="text-xs text-gray-500 dark:text-gray-400">Date</p>
                        <p class="font-medium text-sm sm:text-base">{{ formatDate(selectedNote.evaluation?.date) }}</p>
                        <p class="text-xs text-gray-500">{{ selectedNote.evaluation?.matiere?.ue?.periode?.nom || 'N/A' }}</p>
                      </div>

                      <div class="bg-gray-50 dark:bg-gray-900/50 p-2 sm:p-3 rounded-lg">
                        <p class="text-xs text-gray-500 dark:text-gray-400">Statut</p>
                        <span :class="getStatusClass(selectedNote)" class="text-xs sm:text-sm">
                          {{ selectedNote.notation >= 10 ? 'Validé' : 'Non validé' }}
                        </span>
                      </div>
                    </div>

                    <!-- Barre de progression -->
                    <div class="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                      <p class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Progression</p>
                      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-2.5">
                        <div 
                          class="h-2 sm:h-2.5 rounded-full transition-all duration-500"
                          :class="selectedNote.notation >= 10 ? 'bg-green-500' : 'bg-orange-500'"
                          :style="{ width: (selectedNote.notation * 5) + '%' }"
                        ></div>
                      </div>
                      <p class="text-xs text-gray-500 mt-2">
                        {{ selectedNote.notation >= 10 ? 'Matière validée' : 'Matière non validée' }} 
                        ({{ (selectedNote.notation * 5).toFixed(1) }}% de la note maximale)
                      </p>
                    </div>

                    <!-- Section Réclamation si elle existe -->
                    <div v-if="selectedNote.reclamation && selectedNote.reclamation.length > 0" class="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                      <div class="flex items-center justify-between mb-3">
                        <h3 class="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Réclamation
                        </h3>
                        <span :class="getReclamationBadgeClass(selectedNote.reclamation[0]?.statut)" class="text-xs px-2 py-1 rounded-full">
                          {{ getReclamationStatus(selectedNote.reclamation[0]?.statut) }}
                        </span>
                      </div>
                      
                      <div class="space-y-2 text-sm">
                        <p class="text-gray-600 dark:text-gray-300">
                          <span class="font-medium">Motif:</span> <span v-html="selectedNote.reclamation[0]?.motif"></span>
                        </p>
                        <p v-if="selectedNote.reclamation[0]?.nouvelle_note_proposee" class="text-gray-600 dark:text-gray-300">
                          <span class="font-medium">Note proposée:</span> {{ selectedNote.reclamation[0]?.nouvelle_note_proposee }}/20
                        </p>
                        <p v-if="selectedNote.reclamation[0]?.commentaire_admin" class="text-gray-600 dark:text-gray-300">
                          <span class="font-medium">Réponse:</span> {{ selectedNote.reclamation[0]?.commentaire_admin }}
                        </p>
                        <p class="text-xs text-gray-400">
                          Soumise le {{ selectedNote.reclamation[0]?.date_creation }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <!-- Actions -->
                  <div class="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:justify-end gap-3">
                    <!-- Bouton Annuler (visible seulement si réclamation en attente) -->
                    <button
                      v-if="selectedNote?.reclamation && selectedNote.reclamation[0]?.statut === 'en_attente'"
                      @click="confirmerAnnulation(selectedNote.reclamation[0].slug)"
                      :disabled="isDeleting"
                      class="w-full sm:w-auto px-4 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 order-2 sm:order-1"
                    >
                      <svg v-if="isDeleting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {{ isDeleting ? "Annulation..." : "Annuler la réclamation" }}
                    </button>

                    <!-- Bouton Réclamer (si pas de réclamation ou rejetée) -->
                    <NuxtLink
                      v-if="!selectedNote?.reclamation || selectedNote.reclamation[0]?.statut === 'rejetee'"
                      :to="`/etudiant/${selectedNote?.id}/faire-une-reclamation`"
                      class="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 order-1 sm:order-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Réclamer
                    </NuxtLink>

                    <!-- Bouton Fermer -->
                    <button
                      type="button"
                      @click="closeDetailModal"
                      class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors order-3"
                    >
                      Fermer
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import Vue3Datatable from "@bhplugin/vue3-datatable"
import "@bhplugin/vue3-datatable/dist/style.css"
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue"
import Breadcrumb from "~/components/Breadcrumb.vue"
import { useNoteStore } from "~~/stores/note"
import { usePeriodeStore } from "~~/stores/periode"
import { useReclamationStore } from "~~/stores/reclamation"
import { useRouter } from "vue-router"

const { $toastr, $swal } = useNuxtApp()
const noteStore = useNoteStore()
const periodeStore = usePeriodeStore()
const reclamationStore = useReclamationStore()
const router = useRouter()

// États
const searchQuery = ref("")
const loading = ref(true)
const showDetailModal = ref(false)
const selectedNote = ref(null)
const itemsPerPage = ref(10)
const selectedSemestre = ref("")
const currentPage = ref(1)
const isDeleting = ref(false)

// Colonnes du tableau
const columns = ref([
  { field: "code", title: "Code", visible: true },
  { field: "matiere", title: "Matière", visible: true },
  { field: "type", title: "Type", visible: true },
  { field: "periode", title: "Période", visible: true },
  { field: "note", title: "Note", visible: true },
  { field: "action", title: "Actions", visible: true },
])

const visibleColumns = computed(() => columns.value.filter((c) => c.visible))

// Périodes depuis le store
const periodes = computed(() => periodeStore.periodes)

// Statistiques calculées
const totalNotes = computed(() => noteStore.notes.length)

const moyenneGenerale = computed(() => {
  if (!noteStore.notes.length) return "0.00"
  const somme = noteStore.notes.reduce((acc, n) => acc + (n.notation || 0), 0)
  return (somme / noteStore.notes.length).toFixed(2)
})

const meilleureNote = computed(() => {
  if (!noteStore.notes.length) return 0
  return Math.max(...noteStore.notes.map(n => n.notation || 0))
})

// Notes filtrées
const filteredNotes = computed(() => {
  let notes = noteStore.notes

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    notes = notes.filter(n => 
      n.evaluation?.matiere?.nom?.toLowerCase().includes(query) ||
      n.evaluation?.matiere?.code?.toLowerCase().includes(query)
    )
  }

  if (selectedSemestre.value) {
    notes = notes.filter(n => 
      n.evaluation?.matiere?.ue?.periode?.nom === selectedSemestre.value
    )
  }

  return notes
})

// Pagination
const pagination = computed(() => {
  const total = filteredNotes.value.length
  const totalPages = Math.ceil(total / itemsPerPage.value)
  const debut = ((currentPage.value - 1) * itemsPerPage.value) + 1
  const fin = Math.min(currentPage.value * itemsPerPage.value, total)
  
  return {
    total,
    totalPages,
    debut: total > 0 ? debut : 0,
    fin: total > 0 ? fin : 0
  }
})

// Données pour le tableau
const tableRows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredNotes.value.slice(start, end).map(note => ({
    id: note.id,
    notation: note.notation,
    evaluation: note.evaluation,
    reclamation: note.reclamation
  }))
})

// Formatters
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Couleur de la note
const getNoteColor = (note) => {
  if (note >= 16) return 'text-green-600 dark:text-green-400'
  if (note >= 12) return 'text-blue-600 dark:text-blue-400'
  if (note >= 10) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

// Mention
const getMention = (note) => {
  if (note >= 16) return 'Très bien'
  if (note >= 14) return 'Bien'
  if (note >= 12) return 'Assez bien'
  if (note >= 10) return 'Passable'
  return 'Insuffisant'
}

// Classe pour le type d'évaluation
const getTypeClass = (type) => {
  const classes = {
    'Examen': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    'Contrôle': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'TP': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'Projet': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
  }
  return classes[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

// Statut de la note
const getStatusClass = (note) => {
  return note.notation >= 10 
    ? 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    : 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
}

// Badge réclamation
const getReclamationBadgeClass = (statut) => {
  const classes = {
    'en_attente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'approuvee': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'rejetee': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  }
  return classes[statut] || 'bg-gray-100 text-gray-800'
}

const getReclamationStatus = (statut) => {
  const status = {
    'en_attente': 'En attente',
    'approuvee': 'Approuvée',
    'rejetee': 'Rejetée'
  }
  return status[statut] || statut
}

// Modal
const openDetailModal = (note) => {
  selectedNote.value = note
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  setTimeout(() => {
    selectedNote.value = null
  }, 300)
}

// Confirmation et annulation de réclamation
const confirmerAnnulation = async (reclamationId) => {
  const result = await $swal.fire({
    title: 'Annuler la réclamation ?',
    text: 'Cette action est irréversible. La réclamation sera définitivement supprimée.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, annuler',
    cancelButtonText: 'Non, conserver',
    reverseButtons: true,
    customClass: {
      confirmButton: 'px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none',
      cancelButton: 'px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none ml-3'
    },
    buttonsStyling: false
  })

  if (result.isConfirmed) {
    await annulerReclamation(reclamationId)
  }
}

const annulerReclamation = async (reclamationId) => {
  try {
    isDeleting.value = true
    await reclamationStore.annulerReclamation(reclamationId)
    
    // Recharger les notes pour mettre à jour l'état
    await noteStore.fetchAuthNote()
    
    // Fermer le modal
    closeDetailModal()
    
    $toastr.success('Réclamation annulée avec succès')
  } catch (error) {
    console.error('Erreur annulation:', error)
    $toastr.error(error.message || "Impossible d'annuler la réclamation")
  } finally {
    isDeleting.value = false
  }
}

// Initialisation
onMounted(async () => {
  try {
    await Promise.all([
      noteStore.fetchAuthNote(),
      periodeStore.fetchPeriode()
    ])
  } catch (error) {
    console.error(error)
    $toastr.error("Erreur lors du chargement des données")
  } finally {
    loading.value = false
  }
})
</script>
