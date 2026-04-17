<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Administration', to: '/' },
        { label: 'Candidatures', to: '/candidatures' },
      ]"
      title="Inscription Finale (Admis)"
      title-class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
    />

    <!-- En-tête avec Filtres -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
      <div class="relative w-full md:w-96">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher un admis..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
        />
        <svg class="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
         <select v-model="filterFiliere" class="flex-1 md:w-48 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm outline-none">
          <option value="">Toutes les filières</option>
          <option v-for="f in filieres" :key="f.id" :value="f.id">{{ f.nom }}</option>
        </select>
        <button @click="refreshData" class="p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
          <svg class="w-5 h-5" :class="{ 'animate-spin': isRefreshing }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Liste des Admis -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div v-if="isLoading" class="p-12 flex justify-center">
        <div class="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-900/50 text-left border-b border-gray-100 dark:border-gray-700">
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidat Admis</th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Filière / Niveau</th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lieu Naissance</th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
            <tr v-for="c in filteredAdmis" :key="c.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold">
                    {{ c.nom?.charAt(0) }}{{ c.prenom?.charAt(0) }}
                  </div>
                  <div>
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-white">{{ c.nom }} {{ c.prenom }}</h4>
                    <p class="text-xs text-gray-500">{{ c.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900 dark:text-gray-200">{{ c.filiere?.nom }}</div>
                <div class="text-xs text-gray-500">{{ c.niveau?.nom }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {{ c.lieu_naissance || '-' }}
              </td>
              <td class="px-6 py-4 text-right">
                <button 
                  @click="openEnrollModal(c)"
                  class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-lg shadow-purple-200 dark:shadow-none transition-all hover:scale-105"
                >
                  Inscrire l'étudiant
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!isLoading && filteredAdmis.length === 0" class="p-12 text-center">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <p class="text-gray-500">Aucun candidat admis trouvé ou encore à inscrire.</p>
      </div>
    </div>

    <!-- Modal Inscription Finale -->
    <Modal :show="showEnrollModal" @close="showEnrollModal = false" title="Inscription Finale & Affectation">
      <div class="p-6">
        <div v-if="selectedCandidate" class="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
          <p class="text-sm text-purple-800 dark:text-purple-300">
            Vous allez inscrire <span class="font-bold">{{ selectedCandidate.nom }} {{ selectedCandidate.prenom }}</span> pour l'année scolaire active.
          </p>
        </div>

        <form @submit.prevent="submitEnrollment" class="space-y-5">
          <!-- Partenaire (Advertiser) -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Partenaire / Provenance (Optionnel)
            </label>
            <select v-model="enrollForm.advertiser_id" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-purple-500/50">
              <option :value="null">-- Aucun partenaire --</option>
              <option v-for="adv in advertisers" :key="adv.id" :value="adv.id">{{ adv.name }}</option>
            </select>
            <p class="text-[10px] text-gray-400 mt-1 italic">Si rattaché à un partenaire (ex: Campus France, Entreprise, etc.)</p>
          </div>

          <!-- Groupe -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Affectation au Groupe <span class="text-red-500">*</span>
            </label>
            <select v-model="enrollForm.groupe_id" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-purple-500/50">
              <optgroup v-if="relevantGroups.length > 0" label="Groupes suggérés (Même Niveau/Filière)">
                <option v-for="g in relevantGroups" :key="g.id" :value="g.id">{{ g.nom }} ({{ g.nb_etudiants || 0 }} étu.)</option>
              </optgroup>
              <optgroup label="Tous les groupes">
                <option v-for="g in otherGroups" :key="g.id" :value="g.id">{{ g.nom }} ({{ g.nb_etudiants || 0 }} étu.)</option>
              </optgroup>
            </select>
            <p v-if="relevantGroups.length === 0" class="text-xs text-amber-600 mt-1">
              Aucun groupe trouvé pour ce niveau/filière. Veuillez en sélectionner un manuellement.
            </p>
          </div>

          <!-- Info Complémentaire -->
          <div class="grid grid-cols-2 gap-4">
             <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Type d'étudiant</label>
              <select v-model="enrollForm.is_old" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none">
                <option :value="false">Nouveau</option>
                <option :value="true">Ancien (Réinscription)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Promotion</label>
              <input v-model="enrollForm.promotion" type="text" placeholder="ex: 2023-2024" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none" />
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showEnrollModal = false" class="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">
              Annuler
            </button>
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all disabled:opacity-50"
            >
              <span v-if="isSubmitting" class="flex items-center gap-2">
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Inscription...
              </span>
              <span v-else>Confirmer l'inscription</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCandidatureStore } from '~~/stores/candidature'
import { useFiliereStore } from '~~/stores/filiere'
import { useGroupeStore } from '~~/stores/group'
import { useAdvertiserStore } from '~~/stores/adverstiser'
import Breadcrumb from '~/components/Breadcrumb.vue'
import Modal from '~/components/Modal.vue'

const candidatureStore = useCandidatureStore()
const filiereStore = useFiliereStore()
const groupStore = useGroupeStore()
const advertiserStore = useAdvertiserStore()
const { $toastr, $swal } = useNuxtApp()

// États
const searchQuery = ref('')
const filterFiliere = ref('')
const isLoading = ref(false)
const isRefreshing = ref(false)
const isSubmitting = ref(false)

// Modal
const showEnrollModal = ref(false)
const selectedCandidate = ref(null)
const enrollForm = ref({
  advertiser_id: null,
  groupe_id: '',
  is_old: false,
  promotion: '',
})

// Data
const filieres = computed(() => filiereStore.filieres || [])
const advertisers = computed(() => advertiserStore.advertisers || [])
const allGroups = computed(() => groupStore.groups || [])

const filteredAdmis = computed(() => {
  let list = candidatureStore.candidatures.filter(c => c.admission)
  
  if (filterFiliere.value) {
    list = list.filter(c => c.filiere_id == filterFiliere.value)
  }
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(c => 
      c.nom?.toLowerCase().includes(q) || 
      c.prenom?.toLowerCase().includes(q) || 
      c.email?.toLowerCase().includes(q)
    )
  }
  
  return list
})

// Groupes filtrés par pertinence
const relevantGroups = computed(() => {
  if (!selectedCandidate.value) return []
  return allGroups.value.filter(g => 
    g.niveau_id == selectedCandidate.value.niveau_id && 
    g.filiere_id == selectedCandidate.value.filiere_id
  )
})

const otherGroups = computed(() => {
  if (!selectedCandidate.value) return allGroups.value
  const relevantIds = relevantGroups.value.map(g => g.id)
  return allGroups.value.filter(g => !relevantIds.includes(g.id))
})

// Actions
const refreshData = async () => {
  isLoading.value = true
  try {
    await Promise.all([
      candidatureStore.fetchCandidatures(),
      filiereStore.fetchFilieres(),
      groupStore.fetchGroups(),
      advertiserStore.fetchAdvertisers()
    ])
  } finally {
    isLoading.value = false
  }
}

const openEnrollModal = (candidate) => {
  selectedCandidate.value = candidate
  enrollForm.value = {
    advertiser_id: null,
    groupe_id: '',
    is_old: false,
    promotion: getCurrentPromotion(),
  }
  
  // Auto-select group if only one relevant exists
  setTimeout(() => {
    if (relevantGroups.value.length === 1) {
      enrollForm.value.groupe_id = relevantGroups.value[0].id
    }
  }, 50)
  
  showEnrollModal.value = true
}

const submitEnrollment = async () => {
  if (!enrollForm.value.groupe_id) {
    $toastr.error('Veuillez sélectionner un groupe')
    return
  }

  isSubmitting.value = true
  try {
    const response = await candidatureStore.inscrireEtudiant(selectedCandidate.value.id, enrollForm.value)
    
    await $swal.fire({
      title: 'Inscription réussie !',
      text: `${selectedCandidate.value.nom} est désormais inscrit en tant qu'étudiant.`,
      icon: 'success'
    })
    
    showEnrollModal.value = false
    refreshData()
  } catch (error) {
    console.error(error)
    $toastr.error(error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.')
  } finally {
    isSubmitting.value = false
  }
}

const getCurrentPromotion = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1 // 1-indexed
  
  if (month >= 9) { // Septembre à Décembre
    return `${year}-${year + 1}`
  } else { // Janvier à Août
    return `${year - 1}-${year}`
  }
}

onMounted(() => {
  refreshData()
})
</script>
