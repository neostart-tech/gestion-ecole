<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Administration</span>
      <span>/</span>
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Candidatures</span>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Payement des frais de participation</span>
    </div>

    <!-- Titre -->
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Payement des frais de participation</h1>

    <!-- Instruction -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-sm text-blue-800">
          Ne choisissez que les candidats qui ont payé
        </p>
      </div>
    </div>

    <!-- Barre de contrôle -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <!-- Sélecteur d'éléments -->
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
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                #
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Nom & Prénoms
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
                      {{ candidate.email }}
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

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <!-- Bouton Marqué comme ayant payé -->
                  <button 
                    v-if="!candidate.hasPaid"
                    @click="markAsPaid(candidate)"
                    class="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors font-medium"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Marqué comme ayant payé
                  </button>

                  <!-- Statut Payé -->
                  <div v-else class="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg">
                    <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span class="font-medium">Payé</span>
                  </div>

                  <!-- Bouton Annuler paiement -->
                  <button 
                    v-if="candidate.hasPaid"
                    @click="cancelPayment(candidate)"
                    class="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Annuler le paiement"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
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

    <!-- Section de validation -->
    <div v-if="filteredCandidates.length > 0" class="mt-8 bg-white rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Validation de la section</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Statut des paiements -->
        <div class="bg-gray-50 rounded-lg p-6">
          <h3 class="text-sm font-medium text-gray-900 mb-2">Statut des paiements</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Total des candidats</span>
              <span class="text-sm font-medium text-gray-900">{{ filteredCandidates.length }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Candidats ayant payé</span>
              <span class="text-sm font-medium text-emerald-600">{{ paidCandidatesCount }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Candidats en attente</span>
              <span class="text-sm font-medium text-amber-600">{{ pendingCandidatesCount }}</span>
            </div>
            <div class="pt-3 border-t border-gray-200">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-900">Taux de paiement</span>
                <span class="text-sm font-medium text-indigo-600">{{ paymentRate }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions de validation -->
        <div class="bg-indigo-50 rounded-lg p-6 md:col-span-2">
          <h3 class="text-sm font-medium text-indigo-900 mb-2">Validation finale</h3>
          <p class="text-sm text-indigo-700 mb-4">
            Valider cette section une fois que tous les candidats ont payé leurs frais de participation.
          </p>
          
          <div class="space-y-4">
            <!-- Validation partielle -->
            <button
              @click="validateSection"
              :disabled="paidCandidatesCount === 0"
              :class="[
                'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors',
                paidCandidatesCount === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Valider la section
            </button>

            <!-- Information sur la validation -->
            <div v-if="paidCandidatesCount < filteredCandidates.length" class="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-amber-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.698-.833-2.464 0L4.288 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
                <div class="text-sm text-amber-800">
                  <p class="font-medium mb-1">Attention</p>
                  <p>
                    {{ filteredCandidates.length - paidCandidatesCount }} candidat(s) n'ont pas encore payé.
                    Vous pouvez valider uniquement les candidats ayant payé.
                  </p>
                </div>
              </div>
            </div>

            <!-- Validation complète -->
            <button
              v-if="paidCandidatesCount === filteredCandidates.length"
              @click="completeValidation"
              class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Valider tous les candidats
            </button>
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
              {{ confirmationAction === 'validate' ? 'Validation de la section' : 'Confirmer le paiement' }}
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
                confirmationAction === 'validate' ? 'bg-indigo-100' : 'bg-emerald-100'
              ]">
                <svg 
                  class="h-6 w-6" 
                  :class="confirmationAction === 'validate' ? 'text-indigo-600' : 'text-emerald-600'" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
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
                confirmationAction === 'validate' 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
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
const itemsPerPage = ref(50);
const currentPage = ref(1);
const showConfirmationModal = ref(false);
const confirmationAction = ref('');
const confirmationTitle = ref('');
const confirmationMessage = ref('');
const candidateToProcess = ref(null);

// Données initiales des candidats
const initialCandidates = [
  {
    id: 1,
    name: 'Pfeffer Stephanie',
    email: 'stephanie.pfeffer@example.com',
    code: '57527',
    hasPaid: true
  },
  {
    id: 2,
    name: 'Martin Dupont',
    email: 'martin.dupont@example.com',
    code: '48291',
    hasPaid: false
  },
  {
    id: 3,
    name: 'Sophie Bernard',
    email: 'sophie.bernard@example.com',
    code: '63914',
    hasPaid: true
  },
  {
    id: 4,
    name: 'Thomas Leroy',
    email: 'thomas.leroy@example.com',
    code: '72183',
    hasPaid: false
  },
  {
    id: 5,
    name: 'Julie Moreau',
    email: 'julie.moreau@example.com',
    code: '39476',
    hasPaid: true
  },
  {
    id: 6,
    name: 'Pierre Girard',
    email: 'pierre.girard@example.com',
    code: '85623',
    hasPaid: false
  },
  {
    id: 7,
    name: 'Marie Petit',
    email: 'marie.petit@example.com',
    code: '91247',
    hasPaid: true
  },
  {
    id: 8,
    name: 'David Robert',
    email: 'david.robert@example.com',
    code: '57382',
    hasPaid: false
  },
  {
    id: 9,
    name: 'Catherine Blanc',
    email: 'catherine.blanc@example.com',
    code: '41963',
    hasPaid: true
  },
  {
    id: 10,
    name: 'Jean Laurent',
    email: 'jean.laurent@example.com',
    code: '78251',
    hasPaid: false
  }
];

const candidates = ref([]);

// Charger les données
onMounted(() => {
  loadCandidates();
});

const loadCandidates = () => {
  if (process.client) {
    const stored = localStorage.getItem('candidates');
    if (stored) {
      candidates.value = JSON.parse(stored);
    } else {
      candidates.value = initialCandidates;
      localStorage.setItem('candidates', JSON.stringify(initialCandidates));
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
    candidate.email.toLowerCase().includes(query) ||
    candidate.code.toLowerCase().includes(query)
  );
});

// Statistiques
const paidCandidatesCount = computed(() => {
  return filteredCandidates.value.filter(c => c.hasPaid).length;
});

const pendingCandidatesCount = computed(() => {
  return filteredCandidates.value.filter(c => !c.hasPaid).length;
});

const paymentRate = computed(() => {
  if (filteredCandidates.value.length === 0) return 0;
  return Math.round((paidCandidatesCount.value / filteredCandidates.value.length) * 100);
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
const markAsPaid = (candidate) => {
  candidateToProcess.value = candidate;
  confirmationAction.value = 'markPaid';
  confirmationTitle.value = 'Confirmer le paiement';
  confirmationMessage.value = `Confirmer que ${candidate.name} a payé les frais de participation ?`;
  showConfirmationModal.value = true;
};

const cancelPayment = (candidate) => {
  candidateToProcess.value = candidate;
  confirmationAction.value = 'cancelPayment';
  confirmationTitle.value = 'Annuler le paiement';
  confirmationMessage.value = `Annuler le paiement de ${candidate.name} ?`;
  showConfirmationModal.value = true;
};

const validateSection = () => {
  confirmationAction.value = 'validate';
  confirmationTitle.value = 'Validation de la section';
  confirmationMessage.value = `Valider la section avec ${paidCandidatesCount.value} candidat(s) ayant payé ?`;
  showConfirmationModal.value = true;
};

const completeValidation = () => {
  confirmationAction.value = 'complete';
  confirmationTitle.value = 'Validation complète';
  confirmationMessage.value = 'Tous les candidats ont payé. Valider définitivement cette section ?';
  showConfirmationModal.value = true;
};

// Confirmation des actions
const confirmAction = () => {
  if (confirmationAction.value === 'markPaid' && candidateToProcess.value) {
    const candidate = candidates.value.find(c => c.id === candidateToProcess.value.id);
    if (candidate) {
      candidate.hasPaid = true;
      localStorage.setItem('candidates', JSON.stringify(candidates.value));
    }
  } else if (confirmationAction.value === 'cancelPayment' && candidateToProcess.value) {
    const candidate = candidates.value.find(c => c.id === candidateToProcess.value.id);
    if (candidate) {
      candidate.hasPaid = false;
      localStorage.setItem('candidates', JSON.stringify(candidates.value));
    }
  } else if (confirmationAction.value === 'validate') {
    alert(`Section validée avec ${paidCandidatesCount.value} candidat(s) ayant payé.`);
  } else if (confirmationAction.value === 'complete') {
    alert('Section validée avec succès ! Tous les candidats ont payé.');
  }
  
  closeConfirmationModal();
};

const closeConfirmationModal = () => {
  showConfirmationModal.value = false;
  candidateToProcess.value = null;
  confirmationAction.value = '';
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

/* Styles pour les avatars */
.avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

/* Styles pour les badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
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
}
</style>