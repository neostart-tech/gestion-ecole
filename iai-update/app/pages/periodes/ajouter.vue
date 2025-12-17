<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <NuxtLink to="/periodes/liste" class="cursor-pointer hover:text-indigo-600 transition-colors">
        Administration
      </NuxtLink>
      <span>/</span>
      <NuxtLink to="/periodes/liste" class="cursor-pointer hover:text-indigo-600 transition-colors">
        Périodes
      </NuxtLink>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Ajouter une période</span>
    </div>

    <!-- Titre -->
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Ajouter une période</h1>

    <!-- Formulaire simplifié -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <form @submit.prevent="savePeriod" class="space-y-6">
        <!-- Nom de la période -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Nom de la période <span class="text-rose-500">*</span>
          </label>
          <input
            v-model="form.nom"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Nom de la période"
          />
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Description de la période
          </label>
          <textarea
            v-model="form.description"
            rows="4"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Description de la période..."
          ></textarea>
        </div>

        <!-- Date de début -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Date de début <span class="text-rose-500">*</span>
          </label>
          <input
            v-model="form.debut"
            type="date"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <p class="text-xs text-gray-500 mt-1">
            Format: jj/mm/aaaa
          </p>
        </div>

        <!-- Date de fin -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Date de fin <span class="text-rose-500">*</span>
          </label>
          <input
            v-model="form.fin"
            type="date"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <p class="text-xs text-gray-500 mt-1">
            Format: jj/mm/aaaa
          </p>
        </div>

        <!-- Durée calculée -->
        <div v-if="form.debut && form.fin" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <div>
              <p class="text-sm font-medium text-blue-800">Durée de la période</p>
              <p class="text-sm text-blue-700">{{ calculateDuration() }}</p>
            </div>
          </div>
        </div>

        <!-- Bouton Soumettre -->
        <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6">
          <NuxtLink
            to="/periodes/liste"
            class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Annuler
          </NuxtLink>
          
          <button
            type="submit"
            class="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            Soumettre
          </button>
        </div>
      </form>
    </div>

    <!-- Modal de succès -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="modal-content">
          <div class="modal-header border-b border-gray-200 p-6">
            <h5 class="modal-title text-lg font-semibold text-gray-900">
              Période ajoutée
            </h5>
            <button type="button" @click="closeSuccessModal" class="btn-close text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body p-6">
            <div class="text-center">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                Succès !
              </h3>
              <p class="text-gray-600 mb-6">
                La période a été ajoutée avec succès.
              </p>
            </div>
          </div>
          <div class="modal-footer border-t border-gray-200 p-6 flex justify-end gap-3">
            <button 
              type="button" 
              @click="closeSuccessModal"
              class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Ajouter une autre
            </button>
            <NuxtLink
              to="/periodes/liste"
              class="btn btn-primary px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Voir la liste
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Données réactives
const showSuccessModal = ref(false);

// Formulaire simplifié
const form = ref({
  nom: '',
  description: '',
  debut: '',
  fin: ''
});

// Calculer la durée
const calculateDuration = () => {
  if (!form.value.debut || !form.value.fin) return '';
  
  const start = new Date(form.value.debut);
  const end = new Date(form.value.fin);
  
  // Vérifier que la date de fin est après la date de début
  if (start > end) return 'Date de fin antérieure à la date de début';
  
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return '1 jour';
  } else if (diffDays < 30) {
    return `${diffDays} jours`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    if (days === 0) {
      return `${months} mois`;
    } else {
      return `${months} mois ${days} jours`;
    }
  } else {
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    if (months === 0) {
      return `${years} an${years > 1 ? 's' : ''}`;
    } else {
      return `${years} an${years > 1 ? 's' : ''} ${months} mois`;
    }
  }
};

// Sauvegarder la période
const savePeriod = () => {
  // Validation
  if (!form.value.nom.trim()) {
    alert('Le nom de la période est obligatoire');
    return;
  }
  
  if (!form.value.debut || !form.value.fin) {
    alert('Les dates de début et de fin sont obligatoires');
    return;
  }
  
  const debut = new Date(form.value.debut);
  const fin = new Date(form.value.fin);
  
  if (debut > fin) {
    alert('La date de début doit être antérieure à la date de fin');
    return;
  }
  
  // Charger les périodes existantes
  let periods = [];
  if (process.client) {
    const stored = localStorage.getItem('periods');
    periods = stored ? JSON.parse(stored) : [];
  }
  
  // Générer un ID unique
  const newId = periods.length > 0 ? Math.max(...periods.map(p => p.id)) + 1 : 1;
  
  // Créer la nouvelle période
  const newPeriod = {
    id: newId,
    nom: form.value.nom,
    description: form.value.description || '',
    debut: form.value.debut,
    fin: form.value.fin,
    code: `P${newId.toString().padStart(3, '0')}`,
    type: 'Semestre',
    isActive: true
  };
  
  // Ajouter à la liste
  periods.push(newPeriod);
  
  // Sauvegarder dans localStorage
  if (process.client) {
    localStorage.setItem('periods', JSON.stringify(periods));
  }
  
  // Afficher le modal de succès
  showSuccessModal.value = true;
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
  
  // Réinitialiser le formulaire si l'utilisateur veut ajouter une autre période
  form.value = {
    nom: '',
    description: '',
    debut: '',
    fin: ''
  };
};

// Initialiser avec la date du jour comme date de début
onMounted(() => {
  const today = new Date().toISOString().split('T')[0];
  form.value.debut = today;
  
  // Ajouter 6 mois pour la date de fin par défaut
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 6);
  form.value.fin = futureDate.toISOString().split('T')[0];
});
</script>

<style scoped>
/* Styles de base */
.form-group {
  margin-bottom: 1rem;
}

/* Animation pour le modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Styles pour les inputs date */
input[type="date"] {
  color: #374151;
  font-family: inherit;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0.6;
  cursor: pointer;
}

input[type="date"]::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .form-container {
    padding: 1rem;
  }
  
  .button-group {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .button-group button,
  .button-group a {
    width: 100%;
  }
}
</style>