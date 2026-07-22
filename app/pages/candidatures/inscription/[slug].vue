<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8 transition-colors duration-500">
    
    <!-- Layout Container -->
    <div class="max-w-6xl mx-auto">
      
      <!-- Header / Navigation -->
      <div class="flex items-center justify-between mb-8">
        <NuxtLink :to="`/candidatures/${route.params.slug}`" class="group flex items-center gap-3 text-gray-500 hover:text-indigo-600 transition-all font-medium">
          <div class="w-10 h-10 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center transition-all group-hover:border-indigo-200 group-hover:bg-indigo-50">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </div>
          <span class="text-xs uppercase tracking-widest">Retour au dossier</span>
        </NuxtLink>

        <div class="hidden sm:flex items-center gap-3 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span class="text-[10px] font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Enrôlement actif</span>
        </div>
      </div>

      <!-- Main Content Area -->
      <div v-if="loading" class="py-32 flex flex-col items-center justify-center gap-6">
        <div class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-xs font-medium text-gray-500 uppercase tracking-widest animate-pulse">Initialisation de l'enrôlement...</p>
      </div>

      <div v-else-if="candidat" class="space-y-8">
        
        <!-- Student Identity Card (Hero Section) -->
        <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800">
          <div class="flex flex-col md:flex-row items-center gap-8">
            <!-- Photo / Avatar -->
            <div class="relative group">
              <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border-4 border-white dark:border-gray-900 shadow-sm">
                <img v-if="candidat.album?.photo" :src="getFullUrl(candidat.album.photo)" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-3xl font-semibold text-gray-400">
                  {{ candidat.nom?.charAt(0) }}{{ candidat.prenom?.charAt(0) }}
                </div>
              </div>
              <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-2xl shadow-lg border-2 border-white dark:border-gray-900 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
              </div>
            </div>
            
            <!-- Details -->
            <div class="text-center md:text-left flex-1">
              <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                <h1 class="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">{{ candidat.nom }} {{ candidat.prenom }}</h1>
                <span class="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-wider">Candidat Admis</span>
              </div>
              <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">Finalisation de l'admission académique pour la promotion {{ currentPromotion }}</p>
              
              <div class="flex flex-wrap justify-center md:justify-start gap-4">
                <div class="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <span class="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Niveau</span>
                  <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ candidat.niveau?.libelle }}</span>
                </div>
                <div class="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <span class="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Filière</span>
                  <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ candidat.filiere?.nom }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Enrollment Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Column: Form Controls (2/3) -->
          <div class="lg:col-span-2 space-y-8">
            
            <!-- Section: Groupe d'étude -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800">
              <div class="flex items-center gap-4 mb-8">
                <div class="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center text-violet-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Affectation Administrative</h3>
                  <p class="text-xs text-gray-500">Choisir le groupe d'étude et le partenaire de référence</p>
                </div>
              </div>

              <div class="space-y-6">
                <!-- Group Selection -->
                <div class="space-y-3">
                  <div class="flex items-center justify-between px-1">
                    <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Groupe d'étude cible</label>
                    <span v-if="filteredGroups.length === 0" class="text-[10px] font-semibold text-rose-500 uppercase">Attention: Aucun groupe actif</span>
                  </div>
                  
                  <div v-if="filteredGroups.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div v-for="g in filteredGroups" :key="g.id" 
                      @click="enrollForm.group_id = g.id"
                      class="relative cursor-pointer group transition-all duration-200 p-4 border rounded-2xl"
                      :class="enrollForm.group_id === g.id 
                        ? 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-500/50 ring-2 ring-indigo-500/20' 
                        : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-800'">
                      
                      <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm group-hover:scale-110">
                          <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-[10px] font-bold text-indigo-600/70 dark:text-indigo-400/70 uppercase tracking-tighter">{{ g.code }}</p>
                          <h4 class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ g.nom }}</h4>
                        </div>
                        <div v-if="enrollForm.group_id === g.id">
                          <svg class="w-5 h-5 text-indigo-600 animate-in zoom-in" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="p-8 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-900/50">
                    <p class="text-sm text-gray-400 font-medium italic">Aucun groupe configuré pour ce niveau.</p>
                  </div>
                </div>

                <!-- Advertiser -->
                <div class="space-y-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Partenaire Associé (Advertiser)</label>
                  <Select 
                    v-model="enrollForm.advertiser_id" 
                    :options="advertiserStore.advertisers" 
                    optionLabel="nom" 
                    optionValue="id" 
                    placeholder="Aucun partenaire spécifique" 
                    filter 
                    class="w-full prime-select-enroll"
                  />
                </div>
              </div>
            </div>

            <!-- Section: Financement -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800">
              <div class="flex items-center gap-4 mb-8">
                <div class="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Aides & Bourses</h3>
                  <p class="text-xs text-gray-500">Configurer les réductions de scolarité</p>
                </div>
              </div>

              <div class="p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                <div class="flex flex-col sm:flex-row items-center gap-6">
                  <div class="w-16 h-16 shrink-0 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-indigo-100 dark:border-indigo-900 flex items-center justify-center">
                    <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                  </div>
                  <div class="flex-1 space-y-4 text-center sm:text-left">
                    <p class="text-xs text-gray-500 font-medium italic leading-relaxed">
                      L'application d'une bourse génère une réduction automatique sur l'échéantier financier global (Scolarité).
                    </p>
                    <Select 
                      v-model="enrollForm.bourse_id" 
                      :options="bourseStore.bourses" 
                      optionLabel="nom" 
                      optionValue="id" 
                      placeholder="Aucune bourse (Standard)" 
                      filter 
                      class="w-full prime-select-enroll"
                    >
                      <template #option="slotProps">
                        <div class="flex items-center justify-between w-full">
                          <span>{{ slotProps.option.nom }}</span>
                          <span class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                            {{ slotProps.option.type === 'pourcentage' ? '-' + slotProps.option.valeur + '%' : '-' + slotProps.option.valeur + ' FCFA' }}
                          </span>
                        </div>
                      </template>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section: Paiement Initial -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800">
              <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                  </div>
                  <div>
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Frais d'Inscription</h3>
                    <p class="text-xs text-gray-500">Enregistrer le règlement immédiat (Optionnel)</p>
                  </div>
                </div>
                
                <Switch
                  v-model="enrollForm.frais_inscription_paye"
                  :class="enrollForm.frais_inscription_paye ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'"
                  class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                >
                  <span class="sr-only">Statut Paiement</span>
                  <span
                    aria-hidden="true"
                    :class="enrollForm.frais_inscription_paye ? 'translate-x-5' : 'translate-x-0'"
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                  />
                </Switch>
              </div>

              <div v-if="enrollForm.frais_inscription_paye" class="space-y-6 animate-in slide-in-from-top-4 duration-300">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Mode de règlement</label>
                    <Select 
                      v-model="enrollForm.mode_paiement" 
                      :options="[
                        { label: 'Espèces / Cash', value: 'especes' },
                        { label: 'Mobile Money (Moov/Tmoney)', value: 'mobile_money' },
                        { label: 'Virement Bancaire', value: 'virement' }
                      ]" 
                      optionLabel="label" 
                      optionValue="value" 
                      placeholder="Sélectionner un mode" 
                      class="w-full prime-select-enroll"
                    />
                  </div>
                  <div class="space-y-2" v-if="enrollForm.mode_paiement === 'mobile_money'">
                    <label class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest pl-1">Frais de retrait</label>
                    <input type="number" v-model="enrollForm.frais_retrait" class="w-full h-11 px-4 bg-emerald-50/30 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-2xl font-semibold text-sm" placeholder="0" />
                  </div>
                </div>

                <div class="p-6 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-indigo-500/20">
                  <div>
                    <p class="text-[10px] font-bold text-indigo-100 uppercase tracking-widest">Montant Total à Percevoir</p>
                    <p class="text-[10px] text-indigo-200/70 font-medium italic mt-1">Frais scolarité + Frais annexes (si applicable)</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-3xl font-bold font-mono text-white tracking-tighter">{{ totalApercevoir.toLocaleString() }}</span>
                    <span class="text-xs font-semibold text-indigo-200 uppercase">CFA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Column: Summary / Action (1/3) -->
          <div class="lg:col-span-1">
            <div class="sticky top-8 space-y-6">
              
              <!-- Completion Card -->
              <div class="bg-indigo-600 dark:bg-indigo-700 rounded-2xl p-8 text-white">
                <h3 class="text-sm font-semibold uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Résumé Admission</h3>
                
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-indigo-100/70 font-medium">Promotion</span>
                    <span class="text-sm font-semibold">{{ currentPromotion }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-indigo-100/70 font-medium">Scolarité Active</span>
                    <span class="text-sm font-semibold">{{ activeFraisMontant.toLocaleString() }} FCFA</span>
                  </div>
                   <div class="flex items-center justify-between">
                    <span class="text-xs text-indigo-100/70 font-medium">Statut Dossier</span>
                    <span class="px-2 py-0.5 bg-emerald-500 text-white rounded-md text-[8px] font-bold uppercase tracking-wider">Validé</span>
                  </div>
                </div>

                <div class="mt-10">
                  <Can action="inscrire-etudiant-candidature">
                    <button
                      @click="confirmEnrollment"
                      :disabled="!enrollForm.group_id || isSubmitting"
                      class="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-black/10 transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                    >
                      {{ isSubmitting ? 'Traitement...' : 'Confirmer l\'Enrôlement' }}
                    </button>
                  </Can>
                  <p v-if="!enrollForm.group_id" class="text-[9px] text-center text-indigo-200 font-medium italic mt-3 animate-pulse">Sélectionnez un groupe pour activer l'enrôlement</p>
                </div>
              </div>

              <!-- Information Tooltip -->
              <div class="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Guide Administratif</span>
                </div>
                <p class="text-[10px] text-gray-500 font-medium leading-relaxed italic">
                  L'étudiant sera automatiquement notifié par email dès la validation. Le matricule généré servira à son identification unique dans tout le système académique.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCandidatureStore } from '~~/stores/candidature'
import { useAdvertiserStore } from '~~/stores/adverstiser'
import { useBourseStore } from '~~/stores/bourse'
import { useGroupeStore } from '~~/stores/group'
import { useFraisInscriptionStore } from '~~/stores/frais-inscription'
import { getStorageBaseUrl } from '~/utils/storageUrl'
import { Switch } from '@headlessui/vue'

const route = useRoute()
const router = useRouter()
const candidatureStore = useCandidatureStore()
const advertiserStore = useAdvertiserStore()
const bourseStore = useBourseStore()
const groupeStore = useGroupeStore()
const fraisInscriptionStore = useFraisInscriptionStore()

const { $toastr, $swal } = useNuxtApp()

// States
const loading = ref(true)
const isSubmitting = ref(false)
const candidat = ref(null)

const enrollForm = ref({
  group_id: '',
  advertiser_id: null,
  bourse_id: null,
  frais_inscription_paye: true,
  mode_paiement: 'especes',
  frais_retrait: 0
})

// Fetching
const init = async () => {
    loading.value = true
    try {
        const slug = route.params.slug
        const res = await candidatureStore.fetchCandidatureDetail(slug)
        if (res) {
            candidat.value = res
            enrollForm.value.advertiser_id = res.advertiser_id || null
            
            await groupeStore.fetchGroupes({
                niveau_id: res.niveau_id || res.niveau?.id
            })

            if (!res.dossier_valide) {
                $toastr.warning("Dossier non encore certifié.")
                router.push(`/candidatures/${slug}`)
            }
        } else {
            router.push('/candidatures/admis')
        }
    } catch (e) {
        console.error('Init error:', e)
        $toastr.error("Données inaccessibles.")
    } finally {
        loading.value = false
    }
}

// Helpers
const getFullUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${getStorageBaseUrl()}/storage/${path}`
}

const filteredGroups = computed(() => {
  if (!candidat.value) return []
  const targetNiveauId = candidat.value.niveau_id || candidat.value.niveau?.id;
  return groupeStore.groupes.filter(g => (g.niveau_id || g.niveau?.id) == targetNiveauId)
})

const activeFraisMontant = computed(() => {
  const activeFrais = fraisInscriptionStore.frais.find(f => f.active)
  return activeFrais ? activeFrais.montant : 0
})

const totalApercevoir = computed(() => {
  if (!enrollForm.value.frais_inscription_paye) return 0
  const base = parseInt(activeFraisMontant.value) || 0
  const fees = enrollForm.value.mode_paiement === 'mobile_money' ? (parseInt(enrollForm.value.frais_retrait) || 0) : 0
  return base + fees
})

const currentPromotion = computed(() => {
    const year = new Date().getFullYear()
    return `${year}-${year + 1}`
})

// Submission
const confirmEnrollment = async () => {
  const result = await $swal.fire({
    title: '<span class="text-indigo-600 uppercase font-bold tracking-widest text-lg">Valider l\'Enrôlement ?</span>',
    html: `<p class="text-sm font-medium text-gray-500">Voulez-vous finaliser l'inscription de <b class="text-gray-900 dark:text-white">${candidat.value.nom} ${candidat.value.prenom}</b> ?</p>`,
    showCancelButton: true,
    confirmButtonText: 'CONFIRMER',
    cancelButtonText: 'ANNULER',
    confirmButtonColor: '#4f46e5',
    cancelButtonColor: '#9ca3af',
    reverseButtons: true
  })

  if (result.isConfirmed) {
    isSubmitting.value = true
    try {
      await candidatureStore.inscrireEtudiant(candidat.value.slug, enrollForm.value)
      $toastr.success('Étudiant enrôlé avec succès !')
      router.push(`/candidatures/admis`)
    } catch (e) {
      const errorMsg = e.response?.data?.message || 'Erreur lors de l\'enrôlement.'
      $toastr.error(errorMsg)
    } finally {
      isSubmitting.value = false
    }
  }
}

onMounted(() => {
  init()
  advertiserStore.fetchAdvertisers()
  bourseStore.fetchBourses()
  fraisInscriptionStore.fetchFrais()
})
</script>

<style scoped>
.animation-delay-2000 {
  animation-delay: 2s;
}

:deep(.prime-select-enroll) {
    background: #f9fafb !important;
    border: 2px solid #e5e7eb !important;
    border-radius: 1rem !important;
    height: 3rem !important;
    display: flex !important;
    align-items: center !important;
    transition: all 0.2s !important;
    font-weight: 500 !important;
}

:deep(.prime-select-enroll:hover) {
    border-color: #d1d5db !important;
}

:deep(.prime-select-enroll.p-focus) {
    border-color: #4f46e5 !important;
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1) !important;
}

.dark :deep(.prime-select-enroll) {
    background: #111827 !important;
    border-color: #374151 !important;
}
</style>
