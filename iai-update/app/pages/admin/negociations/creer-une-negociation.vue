<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink to="/admin/negociations" class="text-indigo-600 dark:text-indigo-400 hover:underline mb-2 inline-block">
        ← Retour à la liste
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Nouveau frais étudiant</h1>
    </div>

    <form @submit.prevent="submitForm" class="max-w-4xl">
      <!-- Étape 1: Sélection étudiant -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">1. Sélectionner l'étudiant</h2>
        
        <div class="relative mb-4">
          <input v-model="searchEtudiant" type="text" placeholder="Rechercher un étudiant..."
                 class="w-full px-4 py-2 pl-10 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
          <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2">
          <div v-for="e in filteredEtudiants" :key="e.id"
               @click="selectEtudiant(e)"
               class="p-3 border rounded-lg cursor-pointer transition-all"
               :class="selectedEtudiant?.id === e.id 
                 ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                 : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'">
            <div class="font-medium">{{ e.nom }} {{ e.prenom }}</div>
            <div class="text-sm text-gray-500">{{ e.matricule }} - {{ e.dernier_groupe?.niveau?.libelle }}</div>
          </div>
        </div>
      </div>

      <!-- Étape 2: Frais et année -->
      <div v-if="selectedEtudiant" class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">2. Frais et année académique</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Année scolaire</label>
            <select v-model="form.annee_scolaire_id" required
                    class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <option value="">Sélectionner</option>
              <option v-for="a in annees" :key="a.id" :value="a.id">{{ a.nom }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Frais de scolarité</label>
            <select v-model="form.frais_scolarite_id" required @change="onFraisChange"
                    class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <option value="">Sélectionner</option>
              <option v-for="f in fraisDisponibles" :key="f.id" :value="f.id">
                {{ f.niveau?.libelle }} - {{ f.montant }} FCFA
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Étape 3: Bourse -->
      <div v-if="selectedFrais" class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">3. Bourse (optionnel)</h2>

        <div class="mb-4">
          <select v-model="form.bourse_etudiant_id" class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
            <option value="">Aucune bourse</option>
            <option v-for="b in boursesActives" :key="b.id" :value="b.id">
              {{ b.bourse?.nom }} - {{ b.bourse?.type === 'pourcentage' ? b.bourse?.valeur + '%' : b.bourse?.valeur + ' FCFA' }}
            </option>
          </select>
        </div>

        <div v-if="form.bourse_etudiant_id" class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p class="text-green-800 dark:text-green-300">
            Montant initial: {{ formatMontant(selectedFrais.montant) }}<br>
            Montant après bourse: {{ formatMontant(montantApresBourse) }}
          </p>
        </div>
      </div>

      <!-- Étape 4: Type de paiement -->
      <div v-if="selectedFrais" class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">4. Type de paiement</h2>

        <div class="grid grid-cols-2 gap-4 mb-6">
          <button type="button"
                  @click="form.type_paiement = 'tranches_globales'"
                  class="p-4 border-2 rounded-lg text-center transition-all"
                  :class="form.type_paiement === 'tranches_globales' 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                    : 'border-gray-200 dark:border-gray-700'">
            <div class="text-2xl mb-2">📅</div>
            <div class="font-medium">Tranches globales</div>
            <div class="text-sm text-gray-500">Utilise les tranches par défaut</div>
          </button>

          <button type="button"
                  @click="form.type_paiement = 'negociation'"
                  class="p-4 border-2 rounded-lg text-center transition-all"
                  :class="form.type_paiement === 'negociation' 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                    : 'border-gray-200 dark:border-gray-700'">
            <div class="text-2xl mb-2">🤝</div>
            <div class="font-medium">Négociation</div>
            <div class="text-sm text-gray-500">Échéances personnalisées</div>
          </button>
        </div>

        <!-- Fréquence (pour globales) -->
        <div v-if="form.type_paiement === 'tranches_globales'" class="mb-4">
          <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Fréquence de paiement</label>
          <select v-model="form.frequence_paiement" class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
            <option value="annuel">Annuel (1 fois)</option>
            <option value="trimestriel">Trimestriel (4 fois)</option>
            <option value="bimestriel">Bimestriel (6 fois)</option>
            <option value="mensuel">Mensuel (12 fois)</option>
          </select>
        </div>

        <!-- Échéances personnalisées (pour négociation) -->
        <div v-if="form.type_paiement === 'negociation'" class="space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="font-medium">Échéances négociées</h3>
            <button type="button" @click="addEcheance" 
                    class="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter une échéance
            </button>
          </div>

          <div v-for="(e, index) in form.echeances" :key="index" 
               class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative">
            <button v-if="form.echeances.length > 1" @click="removeEcheance(index)"
                    class="absolute top-2 right-2 text-gray-400 hover:text-red-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label class="block text-xs mb-1">Libellé</label>
                <input v-model="e.libelle" type="text" placeholder="Ex: 1ère tranche"
                       class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              </div>
              <div>
                <label class="block text-xs mb-1">Montant</label>
                <input v-model="e.montant" type="number" min="1"
                       class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              </div>
              <div>
                <label class="block text-xs mb-1">Date limite</label>
                <input v-model="e.date_limite" type="date"
                       :min="new Date().toISOString().split('T')[0]"
                       class="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              </div>
            </div>
          </div>

          <div class="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div class="flex justify-between">
              <span>Total des échéances:</span>
              <span class="font-bold">{{ formatMontant(totalEcheances) }}</span>
            </div>
            <div class="flex justify-between mt-2">
              <span>Montant à payer:</span>
              <span class="font-bold" :class="totalEcheances === montantApresBourse ? 'text-green-600' : 'text-red-600'">
                {{ formatMontant(montantApresBourse) }}
              </span>
            </div>
            <p v-if="totalEcheances !== montantApresBourse" class="text-xs text-red-600 mt-2">
              ⚠️ Le total des échéances doit être égal au montant à payer
            </p>
          </div>
        </div>
      </div>

      <!-- Commentaire -->
      <div v-if="selectedFrais" class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">5. Commentaire (optionnel)</h2>
        <textarea v-model="form.commentaire" rows="3" 
                  class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  placeholder="Ajouter un commentaire..."></textarea>
      </div>

      <!-- Boutons -->
      <div class="flex justify-end gap-4">
        <NuxtLink to="/admin/negociations" class="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          Annuler
        </NuxtLink>
        <button type="submit" :disabled="isSaving || !canSubmit"
                class="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50">
          {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useEtudiantStore } from '~~/stores/etudiant'
import { useFraisScolariteStore } from '~~/stores/frais-de-scolarite'  // ← AJOUTER CETTE LIGNE
import { useAnneeScolaireStore } from '~~/stores/annee-scolaire'    // ← AJOUTER CETTE LIGNE
import { useBourseStore } from '~~/stores/bourse'
import { useNegociationStore } from '~~/stores/negociation'         // ← AJOUTER CETTE LIGNE

const { $toastr } = useNuxtApp()

// Stores
const etudiantStore = useEtudiantStore()
const fraisStore = useFraisScolariteStore()      // ← MAINTENANT DÉFINI
const anneeStore = useAnneeScolaireStore()        // ← MAINTENANT DÉFINI
const bourseStore = useBourseStore()
const negociationStore = useNegociationStore()

// États
const isSaving = ref(false)
const searchEtudiant = ref('')
const selectedEtudiant = ref(null)
const selectedFrais = ref(null)
const annees = ref([])
const boursesActives = ref([])

// Formulaire
const form = ref({
  etudiant_id: null,
  frais_scolarite_id: null,
  annee_scolaire_id: null,
  bourse_etudiant_id: null,
  type_paiement: 'tranches_globales',
  frequence_paiement: 'trimestriel',
  echeances: [],
  commentaire: ''
})

// Chargement initial
onMounted(async () => {
  try {
    await Promise.all([
      etudiantStore.fetchEtudiants(),
      fraisStore.fetchFrais(),
      anneeStore.fetchAnnees()
    ])
    annees.value = anneeStore.annees
  } catch (error) {
    console.error('Erreur chargement:', error)
    $toastr.error('Erreur lors du chargement des données')
  }
})

// Étudiants filtrés
const filteredEtudiants = computed(() => {
  let liste = etudiantStore.etudiants || []
  if (searchEtudiant.value) {
    const search = searchEtudiant.value.toLowerCase()
    liste = liste.filter(e => 
      e.nom?.toLowerCase().includes(search) ||
      e.prenom?.toLowerCase().includes(search) ||
      e.matricule?.toLowerCase().includes(search)
    )
  }
  return liste.slice(0, 10)
})

// Frais disponibles pour l'étudiant
const fraisDisponibles = computed(() => {
  if (!selectedEtudiant.value?.dernier_groupe) return []
  
  const niveauId = selectedEtudiant.value.dernier_groupe.niveau_id
  const filiereId = selectedEtudiant.value.dernier_groupe.filiere_id

  return (fraisStore.frais || []).filter(f => 
    f.niveau_id === niveauId && 
    (!f.filiere_id || f.filiere_id === filiereId)
  )
})

// Montant après bourse
const montantApresBourse = computed(() => {
  if (!selectedFrais.value) return 0
  let montant = selectedFrais.value.montant

  if (form.value.bourse_etudiant_id) {
    const bourse = boursesActives.value.find(b => b.id === form.value.bourse_etudiant_id)
    if (bourse?.bourse) {
      if (bourse.bourse.type === 'pourcentage') {
        montant = montant * (1 - bourse.bourse.valeur / 100)
      } else {
        montant = Math.max(0, montant - bourse.bourse.valeur)
      }
    }
  }
  return montant
})

// Total des échéances négociées
const totalEcheances = computed(() => {
  return form.value.echeances.reduce((sum, e) => sum + (Number(e.montant) || 0), 0)
})

// Peut-on soumettre ?
const canSubmit = computed(() => {
  if (!selectedEtudiant.value || !form.value.annee_scolaire_id || !form.value.frais_scolarite_id) return false
  
  if (form.value.type_paiement === 'negociation') {
    if (form.value.echeances.length === 0) return false
    if (totalEcheances.value !== montantApresBourse.value) return false
    for (const e of form.value.echeances) {
      if (!e.libelle || !e.montant || !e.date_limite) return false
    }
  }
  
  return true
})

// Méthodes
const selectEtudiant = async (etudiant) => {
  selectedEtudiant.value = etudiant
  form.value.etudiant_id = etudiant.id
  
  try {
    // Charger les bourses de l'étudiant
    const response = await bourseStore.fetchByEtudiant(etudiant.id)
    boursesActives.value = response || []
  } catch (error) {
    console.error('Erreur chargement bourses:', error)
    $toastr.error('Erreur lors du chargement des bourses')
  }
}

const onFraisChange = () => {
  selectedFrais.value = fraisStore.frais.find(f => f.id === form.value.frais_scolarite_id)
}

const addEcheance = () => {
  form.value.echeances.push({
    libelle: '',
    montant: null,
    date_limite: ''
  })
}

const removeEcheance = (index) => {
  form.value.echeances.splice(index, 1)
}

const formatMontant = (montant) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(montant || 0)
}

const submitForm = async () => {
  if (!canSubmit.value) return

  isSaving.value = true
  try {
    const payload = {
      etudiant_id: form.value.etudiant_id,
      frais_scolarite_id: form.value.frais_scolarite_id,
      annee_scolaire_id: form.value.annee_scolaire_id,
      bourse_etudiant_id: form.value.bourse_etudiant_id || null,
      type_paiement: form.value.type_paiement,
      frequence_paiement: form.value.type_paiement === 'tranches_globales' ? form.value.frequence_paiement : null,
      echeances: form.value.type_paiement === 'negociation' ? form.value.echeances.map(e => ({
        libelle: e.libelle,
        montant: Number(e.montant),
        date_limite: e.date_limite
      })) : [],
      commentaire: form.value.commentaire || ''
    }

    await negociationStore.create(payload)
    $toastr.success('Frais créé avec succès')
    await navigateTo('/admin/negociations')
  } catch (error) {
    console.error('Erreur création:', error)
    $toastr.error(error.response?.data?.message || 'Une erreur est survenue')
  } finally {
    isSaving.value = false
  }
}
</script>