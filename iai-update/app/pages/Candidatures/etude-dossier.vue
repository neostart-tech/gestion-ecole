<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Administration', to: '/' },
        { label: 'Candidatures', to: '/candidatures' },
      ]"
      title="Étude de dossier"
      title-class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
    />

    <!-- Statistiques Rapides -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in statsCards" :key="stat.label"
        class="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div :class="`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`">
          <svg class="w-6 h-6" :class="stat.color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.iconPath" />
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <!-- Barre d'outils -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
      <div class="relative w-full md:w-96">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher un candidat (Nom, Email, Tel)..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
        />
        <svg class="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <select v-model="filterFiliere" class="flex-1 md:w-48 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm outline-none">
          <option value="">Toutes les filières</option>
          <option v-for="f in filiereStore.filieres" :key="f.id" :value="f.id">{{ f.nom }}</option>
        </select>

        <select v-model="filterStatut" class="flex-1 md:w-48 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm outline-none">
          <option value="">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="valide">Validés</option>
          <option value="rejete">Rejetés</option>
          <option value="rectification">Rectification</option>
        </select>
        
        <button @click="refreshData" class="p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
          <svg class="w-5 h-5" :class="{ 'animate-spin': isRefreshing }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Layout Master-Detail -->
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Liste des candidats (colonne gauche) -->
      <div :class="selectedCandidat ? 'lg:w-2/5' : 'w-full'" class="transition-all duration-300">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div class="divide-y divide-gray-100 dark:divide-gray-700 max-h-[70vh] overflow-y-auto">
            <div
              v-for="c in filteredCandidatures"
              :key="c.id"
              @click="selectCandidat(c)"
              class="p-4 hover:bg-purple-50 dark:hover:bg-purple-900/10 cursor-pointer transition-all group"
              :class="{ 'bg-purple-50 dark:bg-purple-900/10 border-l-4 border-purple-600': selectedCandidat?.id === c.id }"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {{ c.nom?.charAt(0) }}{{ c.prenom?.charAt(0) }}
                  </div>
                  <div>
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-white">{{ c.nom }} {{ c.prenom }}</h4>
                    <p class="text-xs text-gray-500">{{ c.filiere?.nom || 'Non défini' }} · {{ c.niveau?.nom || c.niveau?.libelle || '' }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span :class="getStatutBadgeClass(c)" class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {{ getStatutLabel(c) }}
                  </span>
                  <svg class="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredCandidatures.length === 0" class="p-12 text-center">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-gray-500">Aucun dossier à étudier pour le moment.</p>
          </div>
        </div>
      </div>

      <!-- Panneau de détail (colonne droite) -->
      <div v-if="selectedCandidat" class="lg:w-3/5 transition-all duration-300">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-4">
          <!-- En-tête du détail -->
          <div class="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6">
            <button @click="selectedCandidat = null" class="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-extrabold text-2xl">
                {{ selectedCandidat.nom?.charAt(0) }}{{ selectedCandidat.prenom?.charAt(0) }}
              </div>
              <div>
                <h2 class="text-xl font-extrabold text-white">{{ selectedCandidat.nom }} {{ selectedCandidat.prenom }}</h2>
                <p class="text-purple-200 text-sm">{{ selectedCandidat.email }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <span :class="getStatutBadgeClassLight(selectedCandidat)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold">
                    {{ getStatutLabel(selectedCandidat) }}
                  </span>
                  <span class="text-xs text-purple-200">Déposé le {{ formatDate(selectedCandidat.created_at) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Contenu scrollable -->
          <div class="max-h-[60vh] overflow-y-auto">
            <!-- Onglets -->
            <div class="border-b border-gray-100 dark:border-gray-700 flex sticky top-0 bg-white dark:bg-gray-800 z-10">
              <button v-for="tab in tabs" :key="tab.id"
                @click="activeTab = tab.id"
                class="flex-1 px-4 py-3 text-sm font-semibold transition-colors relative"
                :class="activeTab === tab.id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 hover:text-gray-700'"
              >
                {{ tab.label }}
                <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-t-full"></div>
              </button>
            </div>

            <!-- Tab: Informations Personnelles -->
            <div v-if="activeTab === 'perso'" class="p-6 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <InfoField label="Nom complet" :value="`${selectedCandidat.nom} ${selectedCandidat.prenom}`" />
                <InfoField label="Nom de jeune fille" :value="selectedCandidat.nom_jeune_fille" />
                <InfoField label="Genre" :value="selectedCandidat.genre === 'M' ? 'Masculin' : selectedCandidat.genre === 'F' ? 'Féminin' : selectedCandidat.genre" />
                <InfoField label="Date de naissance" :value="formatDate(selectedCandidat.date_naissance)" />
                <InfoField label="Lieu de naissance" :value="selectedCandidat.lieu_naissance" />
                <InfoField label="Nationalité" :value="selectedCandidat.nationalite" />
                <InfoField label="Email" :value="selectedCandidat.email" icon="mail" />
                <InfoField label="Téléphone" :value="selectedCandidat.tel" icon="phone" />
                <InfoField v-if="selectedCandidat.tel2" label="Téléphone 2" :value="selectedCandidat.tel2" icon="phone" />
                <InfoField v-if="selectedCandidat.tel3" label="Téléphone 3" :value="selectedCandidat.tel3" icon="phone" />
                <InfoField v-if="selectedCandidat.bp" label="Boîte Postale" :value="selectedCandidat.bp" />
                <InfoField v-if="selectedCandidat.fax" label="Fax" :value="selectedCandidat.fax" />
              </div>
              <div v-if="selectedCandidat.hobbit" class="mt-4">
                <p class="text-xs text-gray-500 font-semibold uppercase mb-1">Centres d'intérêt</p>
                <p class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl">{{ selectedCandidat.hobbit }}</p>
              </div>
            </div>

            <!-- Tab: Informations Académiques -->
            <div v-if="activeTab === 'acad'" class="p-6 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <InfoField label="Filière demandée" :value="selectedCandidat.filiere?.nom" highlight />
                <InfoField label="Niveau demandé" :value="selectedCandidat.niveau?.nom || selectedCandidat.niveau?.libelle" highlight />
                <InfoField label="Année du BAC" :value="selectedCandidat.annee_bac" />
                <InfoField label="Série" :value="selectedCandidat.serie" />
                <InfoField v-if="selectedCandidat.numero_table" label="N° de table" :value="selectedCandidat.numero_table" />
              </div>
              <div v-if="selectedCandidat.lettre_motivation" class="mt-4">
                <p class="text-xs text-gray-500 font-semibold uppercase mb-1">Lettre de motivation</p>
                <p class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl whitespace-pre-line leading-relaxed">{{ selectedCandidat.lettre_motivation }}</p>
              </div>
              
              <!-- Motif de rejet s'il y en a un -->
              <div v-if="selectedCandidat.motif" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <p class="text-xs text-red-600 font-bold uppercase mb-1">Motif de rejet / Rectification</p>
                <p class="text-sm text-red-700 dark:text-red-300">{{ selectedCandidat.motif }}</p>
              </div>
            </div>

            <!-- Tab: Documents & Fichiers -->
            <div v-if="activeTab === 'docs'" class="p-6">
              <div class="space-y-3">
                <!-- Documents exigés selon le niveau -->
                <div class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                  <p class="text-xs text-blue-700 dark:text-blue-300 font-bold uppercase mb-1">
                    <svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/></svg>
                    Documents exigés : {{ getDocRequirement(selectedCandidat) }}
                  </p>
                </div>

                <!-- Liste des fichiers de l'album -->
                <template v-if="selectedCandidat.album">
                  <DocItem label="Photo d'identité" :path="selectedCandidat.album.photo" icon="photo" />
                  <DocItem label="Pièce nationale d'identité / Passeport" :path="selectedCandidat.album.nationalite" icon="id" />
                  <DocItem label="Attestation / Diplôme BAC" :path="selectedCandidat.album.diplome" icon="diploma" />
                  <DocItem label="Relevé de BAC" :path="selectedCandidat.album.releve_bac1_path" icon="doc" />
                  <DocItem v-if="selectedCandidat.album.releve_bac2_path" label="Relevé de BAC 2" :path="selectedCandidat.album.releve_bac2_path" icon="doc" />
                  <DocItem label="Acte de naissance" :path="selectedCandidat.album.naissance" icon="doc" />
                  <DocItem label="Lettre de motivation (fichier)" :path="selectedCandidat.album.lettre" icon="letter" />
                  <DocItem v-if="selectedCandidat.album.certificat_medical" label="Certificat médical" :path="selectedCandidat.album.certificat_medical" icon="medical" />
                  <DocItem v-if="selectedCandidat.album.coupon" label="Coupon de paiement" :path="selectedCandidat.album.coupon" icon="payment" />
                  <DocItem v-if="selectedCandidat.album.cv" label="Curriculum Vitæ (CV)" :path="selectedCandidat.album.cv" icon="cv" />
                  
                  <!-- Bulletins Lycée -->
                  <template v-if="parsedBulletins">
                    <div v-for="(paths, niveau) in parsedBulletins" :key="niveau">
                      <DocItem v-for="(p, i) in paths" :key="i" :label="`Bulletin ${niveau} (${i+1})`" :path="p" icon="doc" />
                    </div>
                  </template>
                </template>

                <div v-else class="p-8 text-center">
                  <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p class="text-gray-400 text-sm">Aucun document joint à cette candidature.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Barre d'actions fixe en bas -->
          <div class="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
            <div class="flex flex-wrap gap-2 justify-center">
              <button @click="handleAction('valider', selectedCandidat)"
                class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-green-200 dark:shadow-none hover:scale-105 transition-all text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                Valider
              </button>
              <button @click="handleAction('rectifier', selectedCandidat)"
                class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-amber-200 dark:shadow-none hover:scale-105 transition-all text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                Rectification
              </button>
              <button @click="handleAction('reorienter', selectedCandidat)"
                class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none hover:scale-105 transition-all text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                Réorienter
              </button>
              <button @click="handleAction('rejeter', selectedCandidat)"
                class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 dark:shadow-none hover:scale-105 transition-all text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                Rejeter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Rejet / Rectification -->
    <Modal :show="showMotifModal" @close="showMotifModal = false" :title="modalTitle">
      <div class="space-y-4">
        <p class="text-sm text-gray-500">Veuillez indiquer le motif ou les instructions pour le candidat :</p>
        <textarea v-model="actionMotif" rows="4" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-purple-500/50" placeholder="Ex: Diplôme non conforme, Photo floue..."></textarea>
      </div>
      
      <template #footer>
        <button @click="showMotifModal = false" class="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">Annuler</button>
        <button @click="confirmAction" 
          :disabled="!actionMotif || isSubmitting"
          class="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all disabled:opacity-50">
          <span v-if="isSubmitting">Traitement...</span>
          <span v-else>Confirmer</span>
        </button>
      </template>
    </Modal>

    <!-- Modal Réorientation -->
    <Modal :show="showReorientModal" @close="showReorientModal = false" title="Réorienter le candidat">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nouvelle Filière</label>
          <select v-model="reorientForm.filiere_id" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="f in filiereStore.filieres" :key="f.id" :value="f.id">{{ f.nom }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nouveau Niveau</label>
          <select v-model="reorientForm.niveau_id" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="n in niveauStore.niveaux" :key="n.id" :value="n.id">{{ n.nom || n.libelle }}</option>
          </select>
        </div>
      </div>
      
      <template #footer>
        <button @click="showReorientModal = false" class="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">Annuler</button>
        <button @click="confirmReorientation" 
           :disabled="isSubmitting"
           class="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all disabled:opacity-50">
           {{ isSubmitting ? 'Traitement...' : 'Confirmer' }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, defineComponent } from 'vue'
import { useCandidatureStore } from '~~/stores/candidature'
import { useFiliereStore } from '~~/stores/filiere'
import { useNiveauStore } from '~~/stores/niveau'
import Breadcrumb from '~/components/Breadcrumb.vue'
import Modal from '~/components/Modal.vue'

const candidatureStore = useCandidatureStore()
const filiereStore = useFiliereStore()
const niveauStore = useNiveauStore()
const { $toastr, $swal } = useNuxtApp()

// --- Sub-components ---
const InfoField = defineComponent({
  props: { label: String, value: [String, Number], icon: String, highlight: Boolean },
  template: `
    <div class="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl">
      <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{{ label }}</p>
      <p class="text-sm font-semibold" :class="highlight ? 'text-purple-600 dark:text-purple-400' : 'text-gray-800 dark:text-gray-200'">{{ value || '—' }}</p>
    </div>
  `
})

const DocItem = defineComponent({
  props: { label: String, path: String, icon: String },
  setup(props) {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
    const fullUrl = computed(() => {
      if (!props.path) return null
      if (props.path.startsWith('http')) return props.path
      return `${apiBase}/storage/${props.path}`
    })
    return { fullUrl }
  },
  template: `
    <div class="flex items-center justify-between p-3 rounded-xl border transition-all" 
      :class="path ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10' : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="path ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'">
          <svg v-if="path" class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
          <svg v-else class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
        </div>
        <span class="text-sm font-medium" :class="path ? 'text-green-800 dark:text-green-300' : 'text-red-700 dark:text-red-400'">{{ label }}</span>
      </div>
      <a v-if="path && fullUrl" :href="fullUrl" target="_blank" class="px-3 py-1 text-xs font-bold text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-lg transition-colors">
        Voir ↗
      </a>
      <span v-else class="text-xs text-red-500 font-semibold">Manquant</span>
    </div>
  `
})

// États
const searchQuery = ref('')
const filterFiliere = ref('')
const filterStatut = ref('')
const isRefreshing = ref(false)
const isSubmitting = ref(false)
const selectedCandidat = ref(null)
const activeTab = ref('perso')

// Modals
const showMotifModal = ref(false)
const showReorientModal = ref(false)
const modalAction = ref('')
const modalTitle = ref('')
const actionMotif = ref('')

const reorientForm = ref({
  filiere_id: '',
  niveau_id: ''
})

const tabs = [
  { id: 'perso', label: 'Identité' },
  { id: 'acad', label: 'Académique' },
  { id: 'docs', label: 'Documents' },
]

// Stats
const statsCards = computed(() => [
  { label: 'Total Dossiers', value: candidatureStore.candidatures.length, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30', iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { label: 'À Étudier', value: candidatureStore.candidatures.filter(c => !c.dossier_valide && !c.motif && !c.rectification_expected).length, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Validés', value: candidatureStore.candidatures.filter(c => c.dossier_valide).length, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'En Suspens', value: candidatureStore.candidatures.filter(c => c.rectification_expected || c.motif).length, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30', iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
])

// Bulletins parsed
const parsedBulletins = computed(() => {
  if (!selectedCandidat.value?.album?.bulletins_lycee_paths) return null
  try {
    const data = selectedCandidat.value.album.bulletins_lycee_paths
    return typeof data === 'string' ? JSON.parse(data) : data
  } catch { return null }
})

// Filtres
const filteredCandidatures = computed(() => {
  let list = candidatureStore.candidatures || []
  
  if (filterFiliere.value) {
    list = list.filter(c => c.filiere_id == filterFiliere.value)
  }
  
  if (filterStatut.value) {
    switch (filterStatut.value) {
      case 'en_attente': list = list.filter(c => !c.dossier_valide && !c.motif && !c.rectification_expected); break
      case 'valide': list = list.filter(c => c.dossier_valide); break
      case 'rejete': list = list.filter(c => c.motif && !c.rectification_expected); break
      case 'rectification': list = list.filter(c => c.rectification_expected); break
    }
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(c => 
      c.nom?.toLowerCase().includes(q) || 
      c.prenom?.toLowerCase().includes(q) || 
      c.email?.toLowerCase().includes(q) ||
      c.tel?.includes(q)
    )
  }
  
  return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

// Helpers
const getStatutLabel = (c) => {
  if (c.dossier_valide) return 'Validé'
  if (c.rectification_expected) return 'Rectification'
  if (c.motif) return 'Rejeté'
  return 'En attente'
}

const getStatutBadgeClass = (c) => {
  if (c.dossier_valide) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  if (c.rectification_expected) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
  if (c.motif) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
}

const getStatutBadgeClassLight = (c) => {
  if (c.dossier_valide) return 'bg-green-400/20 text-green-100'
  if (c.rectification_expected) return 'bg-amber-400/20 text-amber-100'
  if (c.motif) return 'bg-red-400/20 text-red-100'
  return 'bg-white/20 text-white'
}

const getDocRequirement = (c) => {
  const niveau = c.niveau?.nom?.toLowerCase() || c.niveau?.libelle?.toLowerCase() || ''
  if (niveau.includes('master') || niveau.includes('executive')) return 'Master & Executive Master'
  if (niveau.includes('licence 3') || niveau.includes('l3')) return 'Licence 3'
  if (niveau.includes('licence 2') || niveau.includes('l2')) return 'Licence 2'
  return 'Licence 1'
}

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

// Actions
const selectCandidat = async (c) => {
  selectedCandidat.value = c
  activeTab.value = 'perso'
  // Charger les détails complets (album, tuteur, responsable)
  try {
    const detail = await candidatureStore.fetchCandidatureDetail(c.slug || c.id)
    if (detail) {
      selectedCandidat.value = { ...c, ...detail }
    }
  } catch (e) {
    console.warn('Détail non disponible, utilisation des données locales', e)
  }
}

const refreshData = async () => {
  isRefreshing.value = true
  try {
    await candidatureStore.fetchCandidatures()
  } finally {
    isRefreshing.value = false
  }
}

const handleAction = async (action, candidat) => {
  modalAction.value = action
  
  if (action === 'valider') {
    const result = await $swal.fire({
      title: 'Valider le dossier ?',
      text: `Voulez-vous valider le dossier de ${candidat.nom} ${candidat.prenom} ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, valider',
      cancelButtonText: 'Annuler'
    })
    
    if (result.isConfirmed) {
      isSubmitting.value = true
      try {
        await candidatureStore.validerDossier(candidat.id)
        $toastr.success('Dossier validé avec succès')
        refreshData()
      } catch (e) {
        $toastr.error(e.response?.data?.message || 'Erreur')
      } finally {
        isSubmitting.value = false
      }
    }
  } else if (action === 'rejeter') {
    modalTitle.value = 'Motif de rejet'
    actionMotif.value = ''
    showMotifModal.value = true
  } else if (action === 'rectifier') {
    modalTitle.value = 'Instructions de rectification'
    actionMotif.value = ''
    showMotifModal.value = true
  } else if (action === 'reorienter') {
    reorientForm.value = {
      filiere_id: candidat.filiere_id,
      niveau_id: candidat.niveau_id
    }
    showReorientModal.value = true
  }
}

const confirmAction = async () => {
  if (!selectedCandidat.value) return
  
  isSubmitting.value = true
  try {
    if (modalAction.value === 'rejeter') {
      await candidatureStore.rejeterDossier(selectedCandidat.value.id, actionMotif.value)
      $toastr.success('Candidat rejeté')
    } else if (modalAction.value === 'rectifier') {
      await candidatureStore.demanderRectification(selectedCandidat.value.id, { motif: actionMotif.value })
      $toastr.success('Demande envoyée')
    }
    showMotifModal.value = false
    selectedCandidat.value = null
    refreshData()
  } catch (e) {
    $toastr.error(e.response?.data?.message || 'Erreur')
  } finally {
    isSubmitting.value = false
  }
}

const confirmReorientation = async () => {
  isSubmitting.value = true
  try {
    await candidatureStore.reorienterCandidat(selectedCandidat.value.id, reorientForm.value)
    $toastr.success('Candidat réorienté')
    showReorientModal.value = false
    selectedCandidat.value = null
    refreshData()
  } catch (e) {
    $toastr.error(e.response?.data?.message || 'Erreur')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  refreshData()
  filiereStore.fetchFilieres()
  niveauStore.fetchNiveaux()
})
</script>