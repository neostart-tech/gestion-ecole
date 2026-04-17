<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 transition-colors">
    <Breadcrumb
      :items="[
        { label: 'Administration', to: '/' },
        { label: 'Étudiants', to: '/admin/etudiants' },
      ]"
      title="Réinscription / Promotion"
      title-class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
    />

    <!-- Recherche Étudiant -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
      <div class="flex flex-col md:flex-row gap-4 items-end">
        <div class="flex-1 space-y-2">
          <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Rechercher l'étudiant à réinscrire</label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Saisissez le matricule ou le nom de l'étudiant..."
              class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-purple-500/50"
              @keyup.enter="searchEtudiant"
            />
            <svg class="w-5 h-5 absolute left-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <button 
          @click="searchEtudiant"
          class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          Rechercher
        </button>
      </div>

      <!-- Résultat Recherche -->
      <div v-if="foundEtudiants.length > 0" class="mt-8 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700">
        <table class="w-full whitespace-nowrap">
           <thead class="bg-gray-50 dark:bg-gray-800/50 text-left text-xs font-semibold text-gray-500 uppercase tracking-widest border-b dark:border-gray-700">
             <tr>
               <th class="px-6 py-4">Matricule</th>
               <th class="px-6 py-4">Étudiant</th>
               <th class="px-6 py-4">Niveau / Filière Actuel</th>
               <th class="px-6 py-4 text-right">Action</th>
             </tr>
           </thead>
           <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
             <tr v-for="e in foundEtudiants" :key="e.id" class="text-sm">
               <td class="px-6 py-4 font-mono font-bold text-purple-600">{{ e.matricule || 'Sans Matricule' }}</td>
               <td class="px-6 py-4">
                 <div class="flex items-center gap-2">
                   <div class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold">
                     {{ e.nom?.charAt(0) }}
                   </div>
                   <span class="font-medium">{{ e.nom }} {{ e.prenom }}</span>
                 </div>
               </td>
               <td class="px-6 py-4">
                 <span v-if="e.group" class="text-gray-600">{{ e.group?.niveau?.nom }} - {{ e.group?.filiere?.nom }}</span>
                 <span v-else class="text-gray-400 italic">Non affecté</span>
               </td>
               <td class="px-6 py-4 text-right">
                 <button 
                  @click="initReinscription(e)"
                  class="px-4 py-2 text-indigo-600 font-bold border-2 border-indigo-100 dark:border-indigo-900/30 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                 >
                   Promouvoir
                 </button>
               </td>
             </tr>
           </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Formulaire Réinscription -->
    <Modal :show="showModal" @close="showModal = false" title="Passage au niveau supérieur">
      <div v-if="selectedEtudiant" class="flex gap-4 items-center mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
        <div class="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 font-bold shrink-0">
          {{ selectedEtudiant.nom?.charAt(0) }}
        </div>
        <div>
          <p class="text-sm font-bold text-indigo-900 dark:text-indigo-300">Réinscription de {{ selectedEtudiant.nom }} {{ selectedEtudiant.prenom }}</p>
          <p class="text-xs text-indigo-600 dark:text-indigo-400 italic">Préparez le passage vers son futur parcours académique.</p>
        </div>
      </div>

      <form id="reinscriptionForm" @submit.prevent="submitReinscription" class="space-y-5">
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Choisir le nouveau niveau :</label>
          <select v-model="form.niveau_id" required class="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all">
            <option value="">Sélectionnez le niveau</option>
            <option v-for="n in niveaux" :key="n.id" :value="n.id">{{ n.nom }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Affectation Groupe (Auto ou manuel) :</label>
          <select v-model="form.group_id" class="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all">
            <option :value="''">Auto-sélection par défaut</option>
            <option v-for="g in filteredGroups" :key="g.id" :value="g.id">{{ g.nom }} ({{ g.filiere?.nom }})</option>
          </select>
          <p class="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/></svg>
            Le système choisira le groupe unique si possible.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Partenaire de suivi :</label>
            <select v-model="form.advertiser_id" class="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all">
              <option :value="null">Inchangé</option>
              <option v-for="adv in advertisers" :key="adv.id" :value="adv.id">{{ adv.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Année Promotion :</label>
            <input v-model="form.promotion" type="text" placeholder="ex: 2024-2025" class="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" />
          </div>
        </div>
      </form>

      <template #footer>
        <button type="button" @click="showModal = false" class="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-2xl transition-colors">Annuler</button>
        <button 
          form="reinscriptionForm"
          type="submit" 
          :disabled="isSubmitting"
          class="px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          <span v-if="isSubmitting">Finalisation...</span>
          <span v-else>Valider la réinscription</span>
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useEtudiantStore } from '~~/stores/etudiant'
import { useNiveauStore } from '~~/stores/niveau'
import { useGroupeStore } from '~~/stores/group'
import { useAdvertiserStore } from '~~/stores/adverstiser'
import Breadcrumb from '~/components/Breadcrumb.vue'
import Modal from '~/components/Modal.vue'

const etudiantStore = useEtudiantStore()
const niveauStore = useNiveauStore()
const groupStore = useGroupeStore()
const advertiserStore = useAdvertiserStore()
const { $toastr, $swal } = useNuxtApp()

// États
const searchQuery = ref('')
const foundEtudiants = ref([])
const isSubmitting = ref(false)
const showModal = ref(false)
const selectedEtudiant = ref(null)

const form = ref({
  niveau_id: '',
  group_id: '',
  advertiser_id: null,
  promotion: '',
})

// Data
const niveaux = computed(() => niveauStore.niveaux || [])
const advertisers = computed(() => advertiserStore.advertisers || [])

// Groupes filtrés par le niveau sélectionné dans le formulaire
const filteredGroups = computed(() => {
  if (!form.value.niveau_id) return []
  return groupStore.groups.filter(g => g.niveau_id == form.value.niveau_id)
})

const searchEtudiant = async () => {
  if (searchQuery.value.length < 3) {
    $toastr.warning('Veuillez saisir au moins 3 caractères')
    return
  }
  
  try {
    // Si la route de recherche n'existe pas, on filtre en local après fetch
    // Mais ici on suppose que fetchEtudiants ramène tout ou qu'on a déjà chargé
    if (etudiantStore.etudiants.length === 0) {
      await etudiantStore.fetchEtudiants()
    }
    
    const q = searchQuery.value.toLowerCase()
    foundEtudiants.value = etudiantStore.etudiants.filter(e => 
      e.nom?.toLowerCase().includes(q) || 
      e.prenom?.toLowerCase().includes(q) || 
      e.matricule?.toLowerCase().includes(q)
    )
    
    if (foundEtudiants.value.length === 0) {
      $toastr.error('Aucun étudiant trouvé')
    }
  } catch (e) {
    $toastr.error('Erreur lors de la recherche')
  }
}

const initReinscription = (etudiant) => {
  selectedEtudiant.value = etudiant
  form.value = {
    niveau_id: '',
    group_id: '',
    advertiser_id: etudiant.advertiser_id,
    promotion: getCurrentPromotion(),
  }
  showModal.value = true
}

const submitReinscription = async () => {
  if (!form.value.niveau_id) {
    $toastr.error('Veuillez sélectionner un niveau')
    return
  }

  isSubmitting.value = true
  try {
    await etudiantStore.reinscrire(selectedEtudiant.value.id, form.value)
    
    await $swal.fire({
      title: 'Réinscription réussie !',
      text: `${selectedEtudiant.value.nom} a été promu avec succès.`,
      icon: 'success'
    })
    
    showModal.value = false
    foundEtudiants.value = []
    searchQuery.value = ''
  } catch (error) {
    $toastr.error(error.response?.data?.message || 'Erreur lors de la réinscription')
  } finally {
    isSubmitting.value = false
  }
}

const getCurrentPromotion = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  if (month >= 8) return `${year}-${year + 1}`
  return `${year - 1}-${year}`
}

onMounted(() => {
  niveauStore.fetchNiveaux()
  groupStore.fetchGroups()
  advertiserStore.fetchAdvertisers()
})
</script>
