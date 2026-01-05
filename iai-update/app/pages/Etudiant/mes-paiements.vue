<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <nav class="mb-6">
        <ol class="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <a href="#" class="hover:text-blue-600">Frais de scolarité</a>
          </li>
          <li class="flex items-center">
            <svg class="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
            <span class="text-gray-900 font-medium">Mes paiements</span>
          </li>
        </ol>
      </nav>

      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Paiement des frais de scolarité</h1>
      </div>

      <!-- Payment Form -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-6">Effectuer un paiement</h2>
        
        <form @submit.prevent="submitPayment" class="space-y-6">
          <!-- Name Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="lastname" class="block text-sm font-medium text-gray-700 mb-2">
                Nom
              </label>
              <input
                type="text"
                id="lastname"
                v-model="form.lastname"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
            
            <div>
              <label for="firstname" class="block text-sm font-medium text-gray-700 mb-2">
                Prénom
              </label>
              <input
                type="text"
                id="firstname"
                v-model="form.firstname"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          <!-- Phone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
              Téléphone (format international)
            </label>
            <input
              type="tel"
              id="phone"
              v-model="form.phone"
              pattern="^\+228\d{8}$"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="+2289xxxxxxx"
              required
            />
            <p class="mt-1 text-sm text-gray-500">
              Le numéro doit commencer par +228 suivi de 8 chiffres
            </p>
          </div>

          <!-- Amount -->
          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700 mb-2">
              Montant (FCFA)
            </label>
            <input
              type="number"
              id="amount"
              v-model="form.amount"
              min="100"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <!-- Payment Method -->
          <div>
            <label for="payment_method" class="block text-sm font-medium text-gray-700 mb-2">
              Mode de paiement
            </label>
            <select
              id="payment_method"
              v-model="form.payment_method"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              <option value="016eb63c-f29d-4384-92e4-b1bd37ef69f8">Flooz TG</option>
              <option value="a2c87957-1033-46e9-8706-056e45737de1">Mix By Yas</option>
              <option value="14f4597d-ef96-4263-8107-1e1970959133">SANDBOX</option>
              <option value="Ecobank-Mobile">Ecobank</option>
              <option value="f7bbfaef-eba3-4b82-ac31-61eb2b772289">Orabank</option>
            </select>
          </div>

          <!-- Submit Button -->
          <div class="pt-4">
            <button
            type="submit"
            class="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            Payer maintenant
          </button>

          </div>
        </form>
      </div>

      <!-- Payment History -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-6">Historique des paiements</h2>
        
        <!-- Empty State -->
        <div class="text-center py-12">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun paiement</h3>
          <p class="text-gray-500 max-w-md mx-auto">
            Vous n'avez effectué aucun paiement pour le moment.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Formulaire de paiement
const form = ref({
  lastname: 'AFANTSAO',
  firstname: 'Komi Ebénezer Aménouvévé',
  phone: '',
  amount: '',
  payment_method: '016eb63c-f29d-4384-92e4-b1bd37ef69f8'
})

// Soumission du formulaire
const submitPayment = () => {
  // Validation du numéro de téléphone
  const phonePattern = /^\+228\d{8}$/
  if (!phonePattern.test(form.value.phone)) {
    alert('Veuillez entrer un numéro de téléphone valide au format +2289xxxxxxx')
    return
  }

  // Validation du montant minimum
  if (parseInt(form.value.amount) < 100) {
    alert('Le montant minimum est de 100 FCFA')
    return
  }

  // Ici, vous intégrerez l'appel API pour le paiement
  console.log('Formulaire soumis:', form.value)
  
  // Simulation d'envoi
  // En production, utilisez :
  // await $fetch('/api/paiement', { method: 'POST', body: form.value })
  
  alert('Paiement en cours de traitement...')
}
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>