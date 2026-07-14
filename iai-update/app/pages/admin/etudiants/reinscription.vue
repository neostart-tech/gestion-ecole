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

    <!-- Sélection Étudiant -->
    <div class="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgba(127,69,253,0.04)] border border-gray-100 dark:border-gray-700 mb-8">
      <div class="max-w-3xl mx-auto space-y-4">
        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Sélectionner l'étudiant à réinscrire</label>
        <Select 
          v-model="selectedEtudiantToPromote" 
          :options="studentsList" 
          filter 
          optionLabel="nomComplet" 
          placeholder="Rechercher et sélectionner un étudiant..." 
          class="w-full prime-select-enroll"
        >
          <template #option="slotProps">
             <div class="flex items-center gap-4 py-1">
               <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                 {{ slotProps.option.nom?.charAt(0) }}{{ slotProps.option.prenom?.charAt(0) }}
               </div>
               <div class="flex flex-col">
                 <span class="font-bold text-sm text-gray-900 dark:text-white">{{ slotProps.option.nom }} {{ slotProps.option.prenom }}</span>
                 <span class="text-[10px] text-gray-500 font-mono mt-0.5">{{ slotProps.option.matricule || 'Sans matricule' }}</span>
               </div>
             </div>
          </template>
        </Select>
      </div>

      <!-- Résultat Sélectionné -->
      <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0">
        <div v-if="selectedEtudiantToPromote" class="mt-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-indigo-500/10 border border-gray-100 dark:border-gray-700 overflow-hidden">
          
          <!-- En-tête : Infos Académiques & Bouton Promouvoir -->
          <div class="p-6 md:p-8 flex flex-col md:flex-row items-start justify-between gap-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <div class="flex items-start gap-6 w-full md:w-auto">
              <div class="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-500/30 shrink-0 mt-2">
                {{ selectedEtudiantToPromote.nom?.charAt(0) }}
              </div>
              <div class="space-y-4 flex-1">
                <div>
                  <h2 class="text-2xl font-black text-gray-900 dark:text-white leading-none mb-1">{{ selectedEtudiantToPromote.nom }} {{ selectedEtudiantToPromote.prenom }}</h2>
                  <p class="text-indigo-600 dark:text-indigo-400 font-medium">{{ selectedEtudiantToPromote.matricule }}</p>
                  
                  <div class="flex flex-wrap gap-2 mt-3">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                      Niveau actuel: {{ selectedEtudiantToPromote.dernier_groupe?.niveau?.nom || 'N/A' }}
                    </span>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm shadow-indigo-500/10">
                      Passage vers: {{ nextNiveauToPromote ? nextNiveauToPromote.libelle : 'Fin de cursus' }}
                    </span>
                    <span v-if="selectedEtudiantToPromote.dernier_groupe?.filiere" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      {{ selectedEtudiantToPromote.dernier_groupe?.filiere?.nom }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              @click="confirmReinscription(selectedEtudiantToPromote)"
              :disabled="!nextNiveauToPromote || isSubmitting"
              class="w-full md:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold text-sm uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-500/30 transition-transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap self-center"
            >
              <span v-if="isSubmitting">Traitement...</span>
              <span v-else>Promouvoir</span>
            </button>
          </div>

          <!-- Section Financière Détaillée -->
          <div class="p-6 md:p-8">
            <h4 class="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Situation Financière Détaillée
            </h4>

            <div v-if="isLoadingFinances" class="flex justify-center items-center py-10">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span class="ml-3 text-sm font-medium text-gray-500">Chargement de la situation financière...</span>
            </div>

            <div v-else>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                <div class="bg-indigo-50/70 dark:bg-indigo-900/10 rounded-2xl p-5 border border-indigo-100/50 dark:border-indigo-800/30">
                  <p class="text-[11px] font-bold text-indigo-500 uppercase mb-1">Montant Total Dû</p>
                  <p class="text-2xl font-black text-indigo-700 dark:text-indigo-400">{{ formatMontant(situationFinanciere?.montant_apres_bourse) }}</p>
                </div>
                <div class="bg-emerald-50/70 dark:bg-emerald-900/10 rounded-2xl p-5 border border-emerald-100/50 dark:border-emerald-800/30">
                  <p class="text-[11px] font-bold text-emerald-600/70 uppercase mb-1">Déjà Payé</p>
                  <p class="text-2xl font-black text-emerald-600 dark:text-emerald-400">{{ formatMontant(calculerTotalPaye(situationFinanciere)) }}</p>
                </div>
                <div class="bg-amber-50/70 dark:bg-amber-900/10 rounded-2xl p-5 border border-amber-100/50 dark:border-amber-800/30 relative overflow-hidden">
                  <p class="text-[11px] font-bold text-amber-600/70 uppercase mb-1">Reste à payer</p>
                  <p class="text-2xl font-black text-amber-600 dark:text-amber-400">{{ formatMontant((Number(situationFinanciere?.montant_apres_bourse) || 0) - calculerTotalPaye(situationFinanciere)) }}</p>
                  <div v-if="situationFinanciere && (Number(situationFinanciere?.montant_apres_bourse) || 0) - calculerTotalPaye(situationFinanciere) > 0" class="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded-bl-lg">Solde en cours</div>
                </div>
              </div>

              <!-- Barre de progression de paiement -->
              <div class="mb-8" v-if="situationFinanciere">
                <div class="flex items-center justify-between text-xs mb-2">
                  <span class="font-bold text-gray-500">Progression globale du paiement</span>
                  <span class="font-black" :class="calculateProgression(situationFinanciere) >= 100 ? 'text-emerald-600' : 'text-indigo-600'">{{ calculateProgression(situationFinanciere) }}%</span>
                </div>
                <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div class="h-3 rounded-full transition-all duration-1000 ease-out" 
                       :class="calculateProgression(situationFinanciere) >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'" 
                       :style="{ width: `${calculateProgression(situationFinanciere)}%` }">
                  </div>
                </div>
              </div>

              <!-- Liste des échéances -->
              <div v-if="getEcheancesDetails(situationFinanciere).length > 0">
                <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Détail des échéances</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div v-for="(ech, idx) in getEcheancesDetails(situationFinanciere)" :key="idx" class="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex items-center gap-3">
                      <div :class="ech.reste <= 0 ? 'bg-emerald-100 text-emerald-600' : (new Date(ech.date_limite) < new Date() ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600')" class="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                        <svg v-if="ech.reste <= 0" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      </div>
                      <div>
                        <p class="text-sm font-bold text-gray-900 dark:text-white leading-tight">{{ ech.libelle }}</p>
                        <p class="text-[10px] text-gray-500 font-medium">Limite: {{ ech.date_limite_formatted }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-black text-gray-900 dark:text-white">{{ ech.montant_formatted }}</p>
                      <p class="text-[11px] font-bold" :class="ech.reste <= 0 ? 'text-emerald-500' : (new Date(ech.date_limite) < new Date() ? 'text-red-500' : 'text-amber-500')">Reste: {{ ech.reste_formatted }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 text-center border border-dashed border-gray-200 dark:border-gray-700 mt-4">
                <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <p class="text-sm font-bold text-gray-700 dark:text-gray-300">Aucun détail financier disponible</p>
                <p class="text-xs text-gray-500 mt-1">L'historique des paiements de cet étudiant est introuvable.</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>


  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useEtudiantStore } from '~~/stores/etudiant'
import { useNiveauStore } from '~~/stores/niveau'
import { useGroupeStore } from '~~/stores/group'
import { useAdvertiserStore } from '~~/stores/adverstiser'
import { useNegociationStore } from '~~/stores/negociation'
import Breadcrumb from '~/components/Breadcrumb.vue'
import Modal from '~/components/Modal.vue'

const etudiantStore = useEtudiantStore()
const niveauStore = useNiveauStore()
const groupStore = useGroupeStore()
const advertiserStore = useAdvertiserStore()
const negociationStore = useNegociationStore()
const { $toastr, $swal } = useNuxtApp()

// États
const searchQuery = ref('')
const foundEtudiants = ref([])
const isSubmitting = ref(false)
const showModal = ref(false)
const selectedEtudiant = ref(null)
const selectedEtudiantToPromote = ref(null)
const situationFinanciere = ref(null)
const isLoadingFinances = ref(false)

const form = ref({
  niveau_id: '',
  group_id: '',
  advertiser_id: null,
  promotion: '',
})

// Data
const niveaux = computed(() => niveauStore.niveaux || [])
const advertisers = computed(() => advertiserStore.advertisers || [])

const studentsList = computed(() => {
  return etudiantStore.etudiants.map(e => ({
    ...e,
    nomComplet: `${e.nom} ${e.prenom} (${e.matricule || 'Sans matricule'})`
  }))
})

// Groupes filtrés par le niveau sélectionné dans le formulaire
const filteredGroups = computed(() => {
  if (!form.value.niveau_id) return []
  return groupStore.groupes.filter(g => g.niveau_id == form.value.niveau_id)
})

const searchEtudiant = async () => {
  // Not used anymore as we pick from dropdown, kept for compatibility if needed elsewhere
}

const nextNiveauToPromote = computed(() => {
  if (!selectedEtudiantToPromote.value) return null
  const currentNiveau = selectedEtudiantToPromote.value.dernier_groupe?.niveau;
  if (currentNiveau) {
     const fullCurrentNiveau = niveaux.value.find(n => n.id === currentNiveau.id) || currentNiveau;
     const currentOrdre = Number(fullCurrentNiveau.ordre);
     if (!isNaN(currentOrdre)) {
        return niveaux.value.find(n => Number(n.ordre) === (currentOrdre + 1));
     }
  }
  return null
})

const confirmReinscription = async (etudiant) => {
  const nextNiveau = nextNiveauToPromote.value;
  if (!nextNiveau) {
    $toastr.error('Fin de cursus ou niveau supérieur introuvable.')
    return
  }

  const result = await $swal.fire({
    title: 'Confirmer la promotion ?',
    html: `Voulez-vous vraiment promouvoir <b>${etudiant.nom} ${etudiant.prenom}</b> vers le niveau <b>${nextNiveau.libelle}</b> pour l'année scolaire <b>${getCurrentPromotion()}</b> ?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#4f46e5',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, promouvoir',
    cancelButtonText: 'Annuler',
    customClass: {
      confirmButton: 'px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700',
      cancelButton: 'px-6 py-2.5 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300'
    },
    buttonsStyling: false
  })

  if (result.isConfirmed) {
    form.value = {
      niveau_id: nextNiveau.id,
      group_id: '',
      advertiser_id: etudiant.advertiser_id,
      promotion: getCurrentPromotion(),
    }
    await submitReinscription(etudiant)
  }
}

const submitReinscription = async (etudiant) => {
  isSubmitting.value = true
  try {
    await etudiantStore.reinscrire(etudiant.id, form.value)
    
    await $swal.fire({
      title: 'Réinscription réussie !',
      text: `${etudiant.nom} a été promu avec succès.`,
      icon: 'success',
      confirmButtonColor: '#4f46e5'
    })
    
    selectedEtudiantToPromote.value = null
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

const formatMontant = (montant) => {
  if (!montant && montant !== 0) return '0 FCFA'
  return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA'
}

const calculerTotalPaye = (negociation) => {
  if (!negociation || !negociation.echeances) return 0
  return negociation.echeances.reduce((sum, e) => sum + (Number(e.montant_paye) || 0), 0)
}

const calculateProgression = (negociation) => {
  if (!negociation) return 0
  const total = Number(negociation.montant_apres_bourse) || 0
  if (total === 0) return 0
  const paye = calculerTotalPaye(negociation)
  return Math.min(100, Math.round((paye / total) * 100))
}

const getEcheancesDetails = (negociation) => {
  if (!negociation || !negociation.echeances) return []
  return negociation.echeances.map(e => {
    const montant = Number(e.montant) || 0
    const paye = Number(e.montant_paye) || 0
    const reste = montant - paye
    return {
      libelle: e.libelle,
      date_limite: e.date_limite,
      date_limite_formatted: new Date(e.date_limite).toLocaleDateString('fr-FR'),
      montant_formatted: formatMontant(montant),
      reste: reste,
      reste_formatted: formatMontant(reste)
    }
  })
}

watch(selectedEtudiantToPromote, async (newVal) => {
  situationFinanciere.value = null
  if (newVal) {
    isLoadingFinances.value = true
    try {
      const data = await negociationStore.fetchNegociationByEtudiant(newVal.id)
      situationFinanciere.value = data
    } catch (e) {
      console.warn('Pas de données financières trouvées pour cet étudiant')
    } finally {
      isLoadingFinances.value = false
    }
  }
})

onMounted(() => {
  etudiantStore.fetchEtudiants()
  niveauStore.fetchNiveaux()
  groupStore.fetchGroupes()
  advertiserStore.fetchAdvertisers()
})
</script>
