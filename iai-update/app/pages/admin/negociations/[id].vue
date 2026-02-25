<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
    </div>

    <div v-else>
      <!-- Header -->
      <div class="mb-6">
        <NuxtLink to="/admin/negociations" class="text-indigo-600 dark:text-indigo-400 hover:underline mb-2 inline-block">
          ← Retour à la liste
        </NuxtLink>
        
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ frais?.etudiant?.nom }} {{ frais?.etudiant?.prenom }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              {{ frais?.frais_scolarite?.niveau?.libelle }} - {{ frais?.annee_scolaire?.nom }}
            </p>
          </div>

          <div class="flex gap-2">
            <button v-if="frais?.type_paiement === 'negociation' && frais?.statut !== 'solde'"
                    @click="openEditModal"
                    class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifier
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">Montant total</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ formatMontant(frais?.montant_apres_bourse) }}</p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">Déjà payé</p>
          <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ formatMontant(totalPaye) }}</p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">Reste à payer</p>
          <p class="text-2xl font-bold" :class="resteAPayer === 0 ? 'text-green-600' : 'text-amber-600'">
            {{ formatMontant(resteAPayer) }}
          </p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">Statut</p>
          <p class="text-lg font-semibold" :class="{
            'text-green-600': frais?.statut === 'solde',
            'text-amber-600': frais?.statut === 'en_cours',
            'text-red-600': frais?.statut === 'en_retard'
          }">
            {{ getStatutLabel(frais?.statut) }}
          </p>
        </div>
      </div>

      <!-- Informations complémentaires -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Infos étudiant -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h3 class="font-semibold mb-3 text-gray-900 dark:text-white">Informations étudiant</h3>
          <div class="space-y-2 text-sm">
            <p><span class="text-gray-500">Matricule:</span> {{ frais?.etudiant?.matricule }}</p>
            <p><span class="text-gray-500">Email:</span> {{ frais?.etudiant?.email }}</p>
            <p><span class="text-gray-500">Téléphone:</span> {{ frais?.etudiant?.telephone }}</p>
          </div>
        </div>

        <!-- Infos frais -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h3 class="font-semibold mb-3 text-gray-900 dark:text-white">Détails du frais</h3>
          <div class="space-y-2 text-sm">
            <p><span class="text-gray-500">Type:</span> 
              <span class="px-2 py-1 rounded-full text-xs" :class="{
                'bg-amber-100 text-amber-800': frais?.type_paiement === 'tranches_globales',
                'bg-green-100 text-green-800': frais?.type_paiement === 'negociation'
              }">
                {{ frais?.type_paiement === 'tranches_globales' ? 'Tranches globales' : 'Négociation' }}
              </span>
            </p>
            <p v-if="frais?.type_paiement === 'tranches_globales'">
              <span class="text-gray-500">Fréquence:</span> {{ getFrequenceLabel(frais?.frequence_paiement) }}
            </p>
            <p><span class="text-gray-500">Date création:</span> {{ formatDate(frais?.created_at) }}</p>
            <p v-if="frais?.bourse_etudiant?.bourse">
              <span class="text-gray-500">Bourse appliquée:</span> 
              {{ frais.bourse_etudiant.bourse.nom }}
              ({{ frais.bourse_etudiant.bourse.type === 'pourcentage' ? frais.bourse_etudiant.bourse.valeur + '%' : formatMontant(frais.bourse_etudiant.bourse.valeur) }})
            </p>
          </div>
        </div>

        <!-- Commentaire -->
        <div v-if="frais?.echeancier?.commentaire" class="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h3 class="font-semibold mb-3 text-gray-900 dark:text-white">Commentaire</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ frais.echeancier.commentaire }}</p>
        </div>
      </div>

      <!-- Liste des échéances -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Échéances</h3>
          <button v-if="resteAPayer > 0" @click="openPaiementModal"
                  class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-600 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Enregistrer un paiement
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Libellé</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payé</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reste</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date limite</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="echeance in echeances" :key="echeance.id" 
                  class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-4 py-3">{{ echeance.libelle }}</td>
                <td class="px-4 py-3 font-medium">{{ formatMontant(echeance.montant) }}</td>
                <td class="px-4 py-3 text-green-600">{{ formatMontant(echeance.montant_paye) }}</td>
                <td class="px-4 py-3">{{ formatMontant(echeance.reste_a_payer) }}</td>
                <td class="px-4 py-3">
                  <span :class="{
                    'text-red-600 font-medium': estEnRetard(echeance)
                  }">
                    {{ formatDate(echeance.date_limite) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 rounded-full text-xs" :class="{
                    'bg-green-100 text-green-800': echeance.statut === 'paye',
                    'bg-yellow-100 text-yellow-800': echeance.statut === 'partiel',
                    'bg-gray-100 text-gray-800': echeance.statut === 'en_attente',
                    'bg-red-100 text-red-800': echeance.statut === 'en_retard'
                  }">
                    {{ getEcheanceStatut(echeance.statut) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <button v-if="echeance.reste_a_payer > 0" 
                          @click="openPaiementModal(echeance)"
                          class="text-indigo-600 hover:text-indigo-800 text-sm">
                    Payer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Historique des paiements -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Historique des paiements</h3>
        
        <div v-if="paiements.length === 0" class="text-center py-6 text-gray-500">
          Aucun paiement enregistré
        </div>

        <div v-else class="space-y-3">
          <div v-for="p in paiements" :key="p.id" 
               class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p class="font-medium">{{ formatDate(p.created_at) }} - {{ p.reference }}</p>
                <p class="text-sm text-gray-500">Mode: {{ getModePaiementLabel(p.mode_paiement) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-lg font-semibold text-green-600">{{ formatMontant(p.montant) }}</p>
              <p class="text-xs text-gray-500">sur {{ getEcheanceLabel(p.payable_id) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de paiement -->
    <TransitionRoot appear :show="showPaiementModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closePaiementModal">
        <div class="fixed inset-0 bg-black/60" />

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6">
                <DialogTitle class="text-lg font-semibold mb-4">Enregistrer un paiement</DialogTitle>

                <form @submit.prevent="savePaiement" class="space-y-4">
                  <!-- Échéance -->
                  <div v-if="!selectedEcheance">
                    <label class="block text-sm font-medium mb-1">Échéance</label>
                    <select v-model="paiementForm.echeance_id" required
                            class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                      <option value="">Sélectionner</option>
                      <option v-for="e in echeancesWithReste" :key="e.id" :value="e.id">
                        {{ e.libelle }} - Reste: {{ formatMontant(e.reste_a_payer) }}
                      </option>
                    </select>
                  </div>

                  <!-- Montant -->
                  <div>
                    <label class="block text-sm font-medium mb-1">Montant</label>
                    <input v-model="paiementForm.montant" type="number" min="1" 
                           :max="montantMax"
                           class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                           required>
                    <p v-if="montantMax" class="text-xs text-gray-500 mt-1">
                      Maximum: {{ formatMontant(montantMax) }}
                    </p>
                  </div>

                  <!-- Mode de paiement -->
                  <div>
                    <label class="block text-sm font-medium mb-1">Mode de paiement</label>
                    <select v-model="paiementForm.mode_paiement" required
                            class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                      <option value="especes">Espèces</option>
                      <option value="banque">Banque</option>
                      <option value="semoa">SEMOA</option>
                      <option value="caisse">Caisse</option>
                    </select>
                  </div>

                  <!-- Référence -->
                  <div>
                    <label class="block text-sm font-medium mb-1">Référence (optionnel)</label>
                    <input v-model="paiementForm.reference" type="text"
                           class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                           placeholder="N° de reçu, transaction...">
                  </div>

                  <!-- Actions -->
                  <div class="flex justify-end gap-3 pt-4">
                    <button type="button" @click="closePaiementModal"
                            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                      Annuler
                    </button>
                    <button type="submit" :disabled="isSaving"
                            class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50">
                      {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue'

const { $toastr } = useNuxtApp()
const route = useRoute()
const fraisId = route.params.id

// Stores
const fraisStore = useFraisEtudiantStore()
const paiementStore = usePaiementStore()

// États
const isLoading = ref(true)
const isSaving = ref(false)
const showPaiementModal = ref(false)
const selectedEcheance = ref(null)
const frais = ref(null)
const echeances = ref([])
const paiements = ref([])

// Formulaire de paiement
const paiementForm = ref({
  echeance_id: '',
  montant: '',
  mode_paiement: 'especes',
  reference: ''
})

// Chargement des données
onMounted(async () => {
  await loadData()
})

const loadData = async () => {
  isLoading.value = true
  try {
    const data = await fraisStore.fetchOne(fraisId)
    frais.value = data
    echeances.value = data.echeances || []
    
    const paiementsData = await paiementStore.fetchByEtudiant(data.etudiant_id)
    paiements.value = paiementsData.filter(p => p.payable_type === 'App\\Models\\Echeance')
  } catch (error) {
    $toastr.error('Erreur lors du chargement')
  } finally {
    isLoading.value = false
  }
}

// Calculs
const totalPaye = computed(() => {
  return echeances.value.reduce((sum, e) => sum + (e.montant_paye || 0), 0)
})

const resteAPayer = computed(() => {
  return (frais.value?.montant_apres_bourse || 0) - totalPaye.value
})

const echeancesWithReste = computed(() => {
  return echeances.value.filter(e => e.reste_a_payer > 0)
})

const montantMax = computed(() => {
  if (paiementForm.value.echeance_id) {
    const echeance = echeances.value.find(e => e.id == paiementForm.value.echeance_id)
    return echeance?.reste_a_payer || 0
  }
  if (selectedEcheance.value) {
    return selectedEcheance.value.reste_a_payer
  }
  return 0
})

// Méthodes
const formatMontant = (montant) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(montant || 0)
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR')
}

const getStatutLabel = (statut) => {
  const labels = {
    en_cours: 'En cours',
    solde: 'Soldé',
    en_retard: 'En retard'
  }
  return labels[statut] || statut
}

const getFrequenceLabel = (freq) => {
  const labels = {
    annuel: 'Annuel',
    trimestriel: 'Trimestriel',
    bimestriel: 'Bimestriel',
    mensuel: 'Mensuel'
  }
  return labels[freq] || freq
}

const getEcheanceStatut = (statut) => {
  const labels = {
    en_attente: 'En attente',
    partiel: 'Partiel',
    paye: 'Payé',
    en_retard: 'En retard'
  }
  return labels[statut] || statut
}

const getModePaiementLabel = (mode) => {
  const labels = {
    especes: 'Espèces',
    banque: 'Banque',
    semoa: 'SEMOA',
    caisse: 'Caisse'
  }
  return labels[mode] || mode
}

const getEcheanceLabel = (echeanceId) => {
  const echeance = echeances.value.find(e => e.id === echeanceId)
  return echeance?.libelle || 'N/A'
}

const estEnRetard = (echeance) => {
  return new Date(echeance.date_limite) < new Date() && echeance.reste_a_payer > 0
}

// Gestion des modales
const openPaiementModal = (echeance = null) => {
  selectedEcheance.value = echeance
  paiementForm.value = {
    echeance_id: echeance?.id || '',
    montant: '',
    mode_paiement: 'especes',
    reference: ''
  }
  showPaiementModal.value = true
}

const closePaiementModal = () => {
  showPaiementModal.value = false
  selectedEcheance.value = null
}

const savePaiement = async () => {
  if (!paiementForm.value.montant || paiementForm.value.montant <= 0) {
    $toastr.warning('Montant invalide')
    return
  }

  if (paiementForm.value.montant > montantMax.value) {
    $toastr.warning(`Le montant ne peut pas dépasser ${formatMontant(montantMax.value)}`)
    return
  }

  isSaving.value = true
  try {
    const echeanceId = selectedEcheance.value?.id || paiementForm.value.echeance_id
    await paiementStore.create({
      echeance_id: echeanceId,
      montant: paiementForm.value.montant,
      mode_paiement: paiementForm.value.mode_paiement,
      reference: paiementForm.value.reference
    })
    
    $toastr.success('Paiement enregistré')
    closePaiementModal()
    await loadData()
  } catch (error) {
    $toastr.error(error.response?.data?.message || 'Erreur lors du paiement')
  } finally {
    isSaving.value = false
  }
}

const openEditModal = () => {
  navigateTo(`/admin/negociations/${fraisId}/edit`)
}
</script>