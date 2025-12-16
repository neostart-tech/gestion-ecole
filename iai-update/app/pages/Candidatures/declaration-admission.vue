<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Administration</span>
      <span>/</span>
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Admissions</span>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Admission à IAI-Togo</span>
    </div>

    <!-- Titre -->
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Admission à IAI-Togo</h1>

    <!-- Barre de contrôle -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <!-- Sélecteur d'éléments seulement -->
      <div class="flex items-center gap-2">
        <span class="text-gray-600 whitespace-nowrap">Afficher</span>
        <select 
          v-model="itemsPerPage" 
          class="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span class="text-gray-600 whitespace-nowrap">éléments</span>
      </div>

      <!-- Recherche -->
      <div class="relative w-full md:w-64">
        <input
          v-model="searchQuery"
          type="search"
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder="Rechercher:"
        />
        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Tableau des candidats -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                #
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Nom & prénoms
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Code
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <!-- Message vide -->
            <tr v-if="filteredCandidates.length === 0">
              <td colspan="4" class="px-6 py-12 text-center">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun candidat trouvé</h3>
                <p class="text-gray-500">
                  {{ searchQuery ? 'Aucun résultat pour votre recherche' : 'Aucun candidat à afficher' }}
                </p>
              </td>
            </tr>

            <!-- Liste des candidats -->
            <tr 
              v-for="(candidate, index) in paginatedCandidates" 
              :key="candidate.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- Numéro -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900 font-medium">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </span>
              </td>

              <!-- Nom & Prénoms -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <!-- Avatar -->
                  <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span class="text-indigo-600 font-semibold">
                      {{ getInitials(candidate.name) }}
                    </span>
                  </div>
                  
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">
                      {{ candidate.name }}
                    </h4>
                    <p class="text-xs text-gray-500">
                      {{ candidate.program || 'Non spécifié' }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Code -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {{ candidate.code }}
                </span>
              </td>

              <!-- Actions - Admis/Recalé -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <!-- Bouton Admis -->
                  <button 
                    @click="markAsAdmitted(candidate)"
                    :class="[
                      'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                      candidate.status === 'admitted'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-default'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                    ]"
                    :disabled="candidate.status === 'admitted'"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Admis
                  </button>

                  <!-- Bouton Recalé -->
                  <button 
                    @click="markAsRejected(candidate)"
                    :class="[
                      'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                      candidate.status === 'rejected'
                        ? 'bg-rose-100 text-rose-700 border border-rose-200 cursor-default'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                    ]"
                    :disabled="candidate.status === 'rejected'"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    Recalé
                  </button>

                  <!-- Statut actuel -->
                  <div v-if="candidate.status" class="ml-2">
                    <span :class="[
                      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                      candidate.status === 'admitted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    ]">
                      {{ candidate.status === 'admitted' ? 'Admis' : 'Recalé' }}
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="filteredCandidates.length > 0" class="border-t border-gray-200 px-6 py-4">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <!-- Info de pagination -->
          <div class="text-sm text-gray-700">
            Affichage de 
            <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
            à
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredCandidates.length) }}</span>
            sur
            <span class="font-medium">{{ filteredCandidates.length }}</span>
            candidats
          </div>

          <!-- Contrôles de pagination -->
          <div class="flex items-center gap-2">
            <!-- Bouton Précédent -->
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              :class="[
                'px-3 py-1 border border-gray-300 rounded-lg text-sm',
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                  : 'text-gray-700 hover:bg-gray-50'
              ]"
            >
              Précédent
            </button>

            <!-- Numéros de page -->
            <div class="flex items-center gap-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium',
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                {{ page }}
              </button>
              
              <!-- Ellipsis -->
              <span v-if="hasMorePages" class="px-2 text-gray-400">...</span>
            </div>

            <!-- Bouton Suivant -->
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              :class="[
                'px-3 py-1 border border-gray-300 rounded-lg text-sm',
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                  : 'text-gray-700 hover:bg-gray-50'
              ]"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Section de soumission de la liste -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Soumettre la liste</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Statistiques -->
        <div class="bg-gray-50 rounded-lg p-6">
          <h3 class="text-sm font-medium text-gray-900 mb-2">Statistiques des admissions</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Total des candidats</span>
              <span class="text-sm font-medium text-gray-900">{{ filteredCandidates.length }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Candidats admis</span>
              <span class="text-sm font-medium text-emerald-600">{{ admittedCount }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Candidats recalés</span>
              <span class="text-sm font-medium text-rose-600">{{ rejectedCount }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">En attente de décision</span>
              <span class="text-sm font-medium text-amber-600">{{ pendingCount }}</span>
            </div>
            <div class="pt-3 border-t border-gray-200">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-900">Taux d'admission</span>
                <span class="text-sm font-medium text-indigo-600">{{ admissionRate }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions de soumission -->
        <div class="bg-indigo-50 rounded-lg p-6 md:col-span-2">
          <h3 class="text-sm font-medium text-indigo-900 mb-2">Soumission finale</h3>
          <p class="text-sm text-indigo-700 mb-4">
            Une fois que toutes les décisions d'admission sont prises, vous pouvez soumettre la liste définitive.
          </p>
          
          <div class="space-y-4">
            <!-- Vérification de complétude -->
            <div v-if="pendingCount > 0" class="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-amber-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.698-.833-2.464 0L4.288 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
                <div class="text-sm text-amber-800">
                  <p class="font-medium mb-1">Décisions manquantes</p>
                  <p>
                    {{ pendingCount }} candidat(s) n'ont pas encore reçu de décision (Admis/Recalé).
                    Veuillez prendre une décision pour chaque candidat avant de soumettre.
                  </p>
                </div>
              </div>
            </div>

            <!-- Validation complète -->
            <div v-else class="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-emerald-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div class="text-sm text-emerald-800">
                  <p class="font-medium mb-1">Prêt à soumettre</p>
                  <p>
                    Toutes les décisions ont été prises. Vous pouvez maintenant soumettre la liste définitive des admissions.
                  </p>
                </div>
              </div>
            </div>

            <!-- Boutons d'action -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Soumettre la liste -->
              <button
                @click="submitList"
                :disabled="pendingCount > 0"
                :class="[
                  'flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors',
                  pendingCount > 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
                </svg>
                Soumettre la liste
              </button>

              <!-- Exporter en PDF -->
              <button
                @click="exportToPDF"
                :disabled="filteredCandidates.length === 0"
                :class="[
                  'flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors',
                  filteredCandidates.length === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-800 text-white hover:bg-gray-900'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414a1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                Exporter en PDF
              </button>
            </div>

            <!-- Option de notification -->
            <div class="pt-4 border-t border-indigo-100">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  v-model="sendNotifications"
                  class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span class="text-sm text-gray-700">
                  Envoyer les notifications par email
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation -->
    <div v-if="showConfirmationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="modal-content">
          <div class="modal-header border-b border-gray-200 p-6">
            <h5 class="modal-title text-lg font-semibold text-gray-900">
              {{ confirmationTitle }}
            </h5>
            <button type="button" @click="closeConfirmationModal" class="btn-close text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body p-6">
            <div class="text-center">
              <div :class="[
                'mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4',
                confirmationType === 'admit' ? 'bg-emerald-100' : 
                confirmationType === 'reject' ? 'bg-rose-100' : 'bg-indigo-100'
              ]">
                <svg 
                  class="h-6 w-6" 
                  :class="confirmationType === 'admit' ? 'text-emerald-600' : 
                         confirmationType === 'reject' ? 'text-rose-600' : 'text-indigo-600'" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    v-if="confirmationType === 'submit'" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M5 13l4 4L19 7"
                  />
                  <path 
                    v-else-if="confirmationType === 'admit'" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M5 13l4 4L19 7"
                  />
                  <path 
                    v-else-if="confirmationType === 'reject'" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                {{ confirmationTitle }}
              </h3>
              <p class="text-gray-600 mb-6">
                {{ confirmationMessage }}
              </p>
            </div>
          </div>
          <div class="modal-footer border-t border-gray-200 p-6 flex justify-end gap-3">
            <button 
              type="button" 
              @click="closeConfirmationModal"
              class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button 
              type="button" 
              @click="confirmAction"
              :class="[
                'btn btn-primary px-4 py-2 rounded-lg font-medium',
                confirmationType === 'admit' 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : confirmationType === 'reject'
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              ]"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Données réactives
const searchQuery = ref('');
const itemsPerPage = ref(50); // Défaut à 50 comme demandé
const currentPage = ref(1);
const showConfirmationModal = ref(false);
const confirmationType = ref('');
const confirmationTitle = ref('');
const confirmationMessage = ref('');
const candidateToProcess = ref(null);
const sendNotifications = ref(true);

// Données initiales des candidats
const initialCandidates = [
  {
    id: 1,
    name: 'FOMBO Orouma',
    code: '21240',
    program: 'Génie Logiciel',
    status: null
  },
  {
    id: 2,
    name: 'Johnson Samuel',
    code: '94094',
    program: 'Administration Systèmes',
    status: null
  },
  {
    id: 3,
    name: 'Sophie Martin',
    code: '38472',
    program: 'Multimédia et Web',
    status: 'admitted'
  },
  {
    id: 4,
    name: 'Thomas Dubois',
    code: '56189',
    program: 'Génie Logiciel',
    status: 'rejected'
  },
  {
    id: 5,
    name: 'Marie Laurent',
    code: '72934',
    program: 'Tronc Commun',
    status: null
  },
  {
    id: 6,
    name: 'Pierre Bernard',
    code: '41856',
    program: 'Administration Systèmes',
    status: 'admitted'
  },
  {
    id: 7,
    name: 'Julie Petit',
    code: '89347',
    program: 'Multimédia et Web',
    status: 'rejected'
  },
  {
    id: 8,
    name: 'David Moreau',
    code: '34712',
    program: 'Génie Logiciel',
    status: null
  },
  {
    id: 9,
    name: 'Catherine Robert',
    code: '61984',
    program: 'Tronc Commun',
    status: 'admitted'
  },
  {
    id: 10,
    name: 'Jean Leroy',
    code: '57239',
    program: 'Administration Systèmes',
    status: null
  }
];

const candidates = ref([]);

// Charger les données
onMounted(() => {
  loadCandidates();
});

const loadCandidates = () => {
  if (process.client) {
    const stored = localStorage.getItem('admissionCandidates');
    if (stored) {
      candidates.value = JSON.parse(stored);
    } else {
      candidates.value = initialCandidates;
      localStorage.setItem('admissionCandidates', JSON.stringify(initialCandidates));
    }
  }
};

// Formater les initiales
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Filtrer les candidats
const filteredCandidates = computed(() => {
  if (!searchQuery.value) return candidates.value;
  
  const query = searchQuery.value.toLowerCase();
  return candidates.value.filter(candidate =>
    candidate.name.toLowerCase().includes(query) ||
    candidate.code.toLowerCase().includes(query) ||
    (candidate.program && candidate.program.toLowerCase().includes(query))
  );
});

// Statistiques
const admittedCount = computed(() => {
  return filteredCandidates.value.filter(c => c.status === 'admitted').length;
});

const rejectedCount = computed(() => {
  return filteredCandidates.value.filter(c => c.status === 'rejected').length;
});

const pendingCount = computed(() => {
  return filteredCandidates.value.filter(c => !c.status).length;
});

const admissionRate = computed(() => {
  const totalDecided = admittedCount.value + rejectedCount.value;
  if (totalDecided === 0) return 0;
  return Math.round((admittedCount.value / totalDecided) * 100);
});

// Pagination
const totalPages = computed(() => {
  return Math.ceil(filteredCandidates.value.length / itemsPerPage.value);
});

const paginatedCandidates = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredCandidates.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  
  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    let start = Math.max(1, currentPage.value - 2);
    let end = Math.min(totalPages.value, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }
  
  return pages;
});

const hasMorePages = computed(() => {
  return totalPages.value > 5 && currentPage.value < totalPages.value - 2;
});

// Navigation des pages
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPage = (page) => {
  currentPage.value = page;
};

// Actions sur les candidats
const markAsAdmitted = (candidate) => {
  candidateToProcess.value = candidate;
  confirmationType.value = 'admit';
  confirmationTitle.value = 'Marquer comme admis';
  confirmationMessage.value = `Confirmer l'admission de ${candidate.name} (${candidate.code}) ?`;
  showConfirmationModal.value = true;
};

const markAsRejected = (candidate) => {
  candidateToProcess.value = candidate;
  confirmationType.value = 'reject';
  confirmationTitle.value = 'Marquer comme recalé';
  confirmationMessage.value = `Confirmer le rejet de ${candidate.name} (${candidate.code}) ?`;
  showConfirmationModal.value = true;
};

const submitList = () => {
  if (pendingCount.value > 0) {
    alert(`Veuillez prendre une décision pour les ${pendingCount.value} candidat(s) restants.`);
    return;
  }
  
  confirmationType.value = 'submit';
  confirmationTitle.value = 'Soumettre la liste';
  confirmationMessage.value = 'Confirmer la soumission définitive de la liste des admissions ? Cette action est irréversible.';
  showConfirmationModal.value = true;
};

const exportToPDF = () => {
  // Simuler l'export PDF
  alert('Export PDF en cours de préparation...\n\nAdmis: ' + admittedCount.value + '\nRecalés: ' + rejectedCount.value);
};

// Confirmation des actions
const confirmAction = () => {
  if (confirmationType.value === 'admit' && candidateToProcess.value) {
    const candidate = candidates.value.find(c => c.id === candidateToProcess.value.id);
    if (candidate) {
      candidate.status = 'admitted';
      localStorage.setItem('admissionCandidates', JSON.stringify(candidates.value));
    }
  } else if (confirmationType.value === 'reject' && candidateToProcess.value) {
    const candidate = candidates.value.find(c => c.id === candidateToProcess.value.id);
    if (candidate) {
      candidate.status = 'rejected';
      localStorage.setItem('admissionCandidates', JSON.stringify(candidates.value));
    }
  } else if (confirmationType.value === 'submit') {
    // Soumettre la liste définitive
    const submissionData = {
      timestamp: new Date().toISOString(),
      totalCandidates: filteredCandidates.value.length,
      admitted: admittedCount.value,
      rejected: rejectedCount.value,
      sendNotifications: sendNotifications.value,
      candidates: candidates.value.map(c => ({
        id: c.id,
        name: c.name,
        code: c.code,
        status: c.status
      }))
    };
    
    // Sauvegarder la soumission
    if (process.client) {
      localStorage.setItem('admissionSubmission', JSON.stringify(submissionData));
    }
    
    alert(`Liste soumise avec succès !\n\nRésumé :\n• ${admittedCount.value} candidat(s) admis\n• ${rejectedCount.value} candidat(s) recalés\n${sendNotifications.value ? '• Notifications envoyées par email' : '• Aucune notification envoyée'}`);
  }
  
  closeConfirmationModal();
};

const closeConfirmationModal = () => {
  showConfirmationModal.value = false;
  candidateToProcess.value = null;
  confirmationType.value = '';
  confirmationTitle.value = '';
  confirmationMessage.value = '';
};
</script>

<style scoped>
/* Styles pour le tableau */
table {
  min-width: 100%;
}

th {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td, th {
  padding: 1rem 1.5rem;
  text-align: left;
}

tbody tr {
  border-bottom: 1px solid #e5e7eb;
}

tbody tr:last-child {
  border-bottom: none;
}

/* Animation pour les transitions */
button {
  transition: all 0.2s ease;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .table-container {
    overflow-x: auto;
  }
  
  .pagination-controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>