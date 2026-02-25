<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>

    <!-- Statistiques -->
    <StatsCards :stats="stats" class="mb-6" />

    <!-- Graphiques et listes -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Échéances à venir -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <h3 class="text-lg font-semibold mb-4">Échéances à venir (7 jours)</h3>
        <div v-if="echeancesAVenir.length === 0" class="text-center py-6 text-gray-500">
          Aucune échéance à venir
        </div>
        <div v-else class="space-y-3">
          <div v-for="e in echeancesAVenir" :key="e.id" 
               class="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div class="flex justify-between">
              <div>
                <p class="font-medium">{{ e.fraisEtudiant?.etudiant?.nom }} {{ e.fraisEtudiant?.etudiant?.prenom }}</p>
                <p class="text-sm text-gray-500">{{ e.libelle }} - {{ formatMontant(e.reste_a_payer) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-amber-600">J-{{ joursRestants(e.date_limite) }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(e.date_limite) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Derniers paiements -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <h3 class="text-lg font-semibold mb-4">Derniers paiements</h3>
        <div v-if="derniersPaiements.length === 0" class="text-center py-6 text-gray-500">
          Aucun paiement récent
        </div>
        <div v-else class="space-y-3">
          <div v-for="p in derniersPaiements" :key="p.id" 
               class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div>
              <p class="font-medium">{{ p.etudiant?.nom }} {{ p.etudiant?.prenom }}</p>
              <p class="text-sm text-gray-500">{{ getModePaiementLabel(p.mode_paiement) }} - {{ p.reference }}</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-semibold text-green-600">{{ formatMontant(p.montant) }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(p.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { $toastr } = useNuxtApp()

// Stores
const fraisStore = useFraisEtudiantStore()
const paiementStore = usePaiementStore()

// Données
const stats = ref({
  totalEtudiants: 0,
  montantTotal: 0,
  montantPaye: 0,
  echeancesEnRetard: 0
})

const echeancesAVenir = ref([])
const derniersPaiements = ref([])

onMounted(async () => {
  try {
    await loadDashboard()
  } catch (error) {
    $toastr.error('Erreur de chargement')
  }
})

const loadDashboard = async () => {
  const [fraisData, paiementsData] = await Promise.all([
    fraisStore.fetchAll(),
    paiementStore.fetchAll()
  ])

  // Calcul des stats
  const tousFrais = fraisStore.frais
  stats.value.totalEtudiants = new Set(tousFrais.map(f => f.etudiant_id)).size
  stats.value.montantTotal = tousFrais.reduce((sum, f) => sum + f.montant_apres_bourse, 0)
  
  const tousPaiements = paiementsData || []
  stats.value.montantPaye = tousPaiements.reduce((sum, p) => sum + p.montant, 0)

  // Échéances à venir
  const aujourdhui = new Date()
  const dans7Jours = new Date()
  dans7Jours.setDate(aujourdhui.getDate() + 7)

  echeancesAVenir.value = tousFrais
    .flatMap(f => f.echeances || [])
    .filter(e => {
      const dateLimite = new Date(e.date_limite)
      return dateLimite > aujourdhui && dateLimite <= dans7Jours && e.reste_a_payer > 0
    })
    .sort((a, b) => new Date(a.date_limite) - new Date(b.date_limite))
    .slice(0, 5)

  stats.value.echeancesEnRetard = tousFrais
    .flatMap(f => f.echeances || [])
    .filter(e => new Date(e.date_limite) < aujourdhui && e.reste_a_payer > 0)
    .length

  // Derniers paiements
  derniersPaiements.value = tousPaiements
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)
}

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

const joursRestants = (date) => {
  const diff = new Date(date) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
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
</script>