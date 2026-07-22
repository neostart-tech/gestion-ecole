<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Administration', to: '/' },
        { label: 'Réclamations', to: '/admin/reclamations' },
        { label: 'Détail', to: null },
      ]"
      title="Détail de la réclamation"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Loading -->
    <div v-if="reclamationStore.isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
    </div>

    <!-- Contenu -->
    <div v-else-if="reclamation" class="max-w-4xl mx-auto">
      <!-- Carte principale -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <!-- En-tête avec statut -->
        <div class="px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Réclamation #{{ reclamation.id }}
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Soumise le {{ reclamation.date_creation }}
              </p>
            </div>
            <span :class="getStatusBadgeClass(reclamation.statut)" class="px-3 py-1.5 text-sm rounded-full self-start sm:self-auto">
              {{ getStatusText(reclamation.statut) }}
            </span>
          </div>
        </div>

        <!-- Grille d'informations -->
        <div class="p-4 sm:p-6 space-y-6">
          <!-- Informations étudiant -->
          <div class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
            <h2 class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Étudiant
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Nom complet</p>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ reclamation.etudiant?.nom }} {{ reclamation.etudiant?.prenom }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p class="font-medium text-gray-900 dark:text-white break-all">
                  {{ reclamation.etudiant?.email }}
                </p>
              </div>
            </div>
          </div>

          <!-- Informations évaluation -->
          <div class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
            <h2 class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Évaluation
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Matière</p>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ reclamation.evaluation?.matiere || 'N/A' }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Note actuelle</p>
                <p :class="['font-medium', getNoteColorClass(reclamation.note_actuelle)]">
                  {{ reclamation.note_actuelle }}/20
                </p>
              </div>
            </div>
          </div>

          <!-- Détails de la réclamation -->
          <div class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
            <h2 class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Détails de la réclamation
            </h2>
            
            <!-- Note proposée -->
            <div v-if="reclamation.nouvelle_note_proposee" class="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <p class="text-xs text-indigo-600 dark:text-indigo-400 mb-1">Note proposée par l'étudiant</p>
              <p class="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                {{ reclamation.nouvelle_note_proposee }}/20
              </p>
            </div>

            <!-- Motif -->
            <div class="mb-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Motif</p>
              <div class="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700" 
                   v-html="reclamation.motif">
              </div>
            </div>

            <!-- Fichier justificatif -->
            <div v-if="reclamation.fichier_justificatif">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Fichier justificatif</p>
              <a 
                :href="reclamation.fichier_justificatif" 
                target="_blank"
                class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span class="text-sm text-gray-700 dark:text-gray-300">Voir le document</span>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <!-- Réponse admin (si déjà traitée) -->
            <div v-if="reclamation.commentaire_admin" class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p class="text-xs text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Réponse de l'administration
              </p>
              <p class="text-sm text-gray-700 dark:text-gray-300">{{ reclamation.commentaire_admin }}</p>
              <p v-if="reclamation.date_traitement" class="text-xs text-gray-500 mt-2">
                Traitée le {{ reclamation.date_traitement }}
              </p>
            </div>
          </div>

          <!-- Actions (si réclamation en attente) -->
          <div v-if="reclamation.statut === 'en_attente'" class="flex flex-col sm:flex-row gap-3 pt-4">
            <!-- Bouton Approuver -->
            <Can action="update-reclamation">
              <button
                @click="openTraitementModal('approuvee')"
                class="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Approuver
              </button>
            </Can>

            <!-- Bouton Rejeter -->
            <Can action="update-reclamation">
              <button
                @click="openTraitementModal('rejetee')"
                class="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Rejeter
              </button>
            </Can>
          </div>

          <!-- Message si déjà traitée -->
          <div v-else class="pt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Cette réclamation a déjà été traitée.
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL DE TRAITEMENT -->
    <TransitionRoot appear :show="showTraitementModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeTraitementModal">
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
              <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                <!-- En-tête -->
                <div class="flex items-center justify-between mb-4">
                  <DialogTitle class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ actionType === 'approuvee' ? 'Approuver' : 'Rejeter' }} la réclamation
                  </DialogTitle>
                  <button @click="closeTraitementModal" class="text-gray-400 hover:text-gray-500">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Formulaire -->
                <form @submit.prevent="traiterReclamation" class="space-y-4">
                  <!-- Nouvelle note (si approbation) -->
                  <div v-if="actionType === 'approuvee'">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nouvelle note *
                    </label>
                    <input
                      v-model="form.nouvelle_note"
                      type="number"
                      step="0.5"
                      min="0"
                      max="20"
                      required
                      class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                      placeholder="Note sur 20"
                    />
                    <p v-if="reclamation?.nouvelle_note_proposee" class="mt-1 text-xs text-gray-500">
                      Note proposée par l'étudiant : {{ reclamation.nouvelle_note_proposee }}/20
                    </p>
                  </div>

                  <!-- Commentaire -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {{ actionType === 'rejetee' ? 'Motif du rejet *' : 'Commentaire (optionnel)' }}
                    </label>
                    <textarea
                      v-model="form.commentaire_admin"
                      rows="4"
                      :required="actionType === 'rejetee'"
                      class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      :placeholder="actionType === 'rejetee' ? 'Expliquez pourquoi vous rejetez cette réclamation...' : 'Ajoutez un commentaire (optionnel)...'"
                    ></textarea>
                  </div>

                  <!-- Boutons -->
                  <div class="flex gap-3 pt-4">
                    <button
                      type="button"
                      @click="closeTraitementModal"
                      class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      :disabled="isSubmitting || (actionType === 'approuvee' && !form.nouvelle_note)"
                      :class="[
                        'flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                        actionType === 'approuvee' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                      ]"
                    >
                      {{ isSubmitting ? 'Traitement...' : (actionType === 'approuvee' ? 'Approuver' : 'Rejeter') }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import Breadcrumb from "~/components/Breadcrumb.vue"
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue"
import { useReclamationStore } from "~~/stores/reclamation"

const route = useRoute()
const router = useRouter()
const reclamationStore = useReclamationStore()
const { $toastr } = useNuxtApp()

// États
const reclamation = ref(null)
const showTraitementModal = ref(false)
const actionType = ref('approuvee')
const isSubmitting = ref(false)

// Formulaire
const form = ref({
  nouvelle_note: "",
  commentaire_admin: ""
})

// Charger la réclamation
onMounted(async () => {
  try {
    const id = route.params.slug
    await reclamationStore.fetchReclamation(id)
    reclamation.value = reclamationStore.reclamation
  } catch (error) {
    console.error("Erreur chargement:", error)
    $toastr.error("Erreur lors du chargement de la réclamation")
  }
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
  if (note >= 16) return 'text-green-600 dark:text-green-400'
  if (note >= 12) return 'text-blue-600 dark:text-blue-400'
  if (note >= 10) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

// Actions
const openTraitementModal = (type) => {
  actionType.value = type
  form.value = {
    nouvelle_note: reclamation.value?.nouvelle_note_proposee || "",
    commentaire_admin: ""
  }
  showTraitementModal.value = true
}

const closeTraitementModal = () => {
  showTraitementModal.value = false
}

const traiterReclamation = async () => {
  try {
    isSubmitting.value = true
    
    await reclamationStore.traiterReclamation(route.params.slug, {
      statut: actionType.value,
      nouvelle_note: form.value.nouvelle_note || null,
      commentaire_admin: form.value.commentaire_admin || null
    })

    $toastr.success(`Réclamation ${actionType.value === 'approuvee' ? 'approuvée' : 'rejetée'} avec succès`)
    closeTraitementModal()
    
    // Recharger les données
    await reclamationStore.fetchReclamation(route.params.slug)
    reclamation.value = reclamationStore.reclamation
    
  } catch (error) {
    console.error("Erreur traitement:", error)
    $toastr.error(error.message || "Erreur lors du traitement")
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
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