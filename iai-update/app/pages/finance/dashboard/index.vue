<template>
  <div class="min-h-screen bg-gray-100 p-4 md:p-6">
    <!-- Header -->
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between">
      <div>
        <h1 class="text-xl md:text-2xl font-semibold text-gray-800">
          Dashboard Comptabilité
        </h1>
        <p class="text-sm text-gray-600">
          Frais de scolarité • Année {{ stats.year }}
        </p>
      </div>
    </div>

    <!-- Statistiques principales -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-4 border border-gray-200 rounded-lg">
        <p class="text-sm text-gray-500">Frais Totaux Attendus</p>
        <p class="text-2xl font-bold text-blue-600 mt-2">
          {{ stats.totalExpected.toLocaleString() }} FCFA
        </p>
      </div>

      <div class="bg-white p-4 border border-gray-200 rounded-lg">
        <p class="text-sm text-gray-500">Total Payé</p>
        <p class="text-2xl font-bold text-green-600 mt-2">
          {{ stats.totalPaid.toLocaleString() }} FCFA
        </p>
      </div>

      <div class="bg-white p-4 border border-gray-200 rounded-lg">
        <p class="text-sm text-gray-500">Reste à Payer</p>
        <p class="text-2xl font-bold text-red-600 mt-2">
          {{ remainingAmount.toLocaleString() }} FCFA
        </p>
      </div>

      <div class="bg-white p-4 border border-gray-200 rounded-lg">
        <p class="text-sm text-gray-500">Paiements en Retard</p>
        <p class="text-2xl font-bold text-yellow-600 mt-2">
          {{ stats.latePayments }}
        </p>
      </div>
    </div>

    <!-- Taux de recouvrement -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <div class="bg-white p-6 border border-gray-200 rounded-lg">
        <h3 class="font-semibold text-gray-800 mb-4">
          Taux de Recouvrement
        </h3>

        <p class="text-3xl font-bold text-indigo-600 mb-4">
          {{ recoveryRate.toFixed(1) }}%
        </p>

        <div class="h-2 bg-gray-200 rounded">
          <div
            class="h-2 bg-indigo-500 rounded"
            :style="{ width: recoveryRate + '%' }"
          ></div>
        </div>

        <p class="text-sm text-gray-500 mt-2">
          Pourcentage des frais encaissés
        </p>
      </div>

      <!-- Répartition par cycle -->
      <div class="bg-white p-6 border border-gray-200 rounded-lg">
        <h3 class="font-semibold text-gray-800 mb-4">
          Répartition Paiements par Cycle
        </h3>

        <div class="space-y-4">
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span>Licence</span>
              <span>{{ stats.licencePaid.toLocaleString() }} FCFA</span>
            </div>
            <div class="h-2 bg-gray-200 rounded">
              <div
                class="h-2 bg-blue-500 rounded"
                :style="{ width: licencePercent + '%' }"
              ></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-sm mb-1">
              <span>Master</span>
              <span>{{ stats.masterPaid.toLocaleString() }} FCFA</span>
            </div>
            <div class="h-2 bg-gray-200 rounded">
              <div
                class="h-2 bg-green-500 rounded"
                :style="{ width: masterPercent + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bloc futur graphique -->
    <div
      class="bg-white p-4 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400"
    >
      Graphique des paiements mensuels
    </div>

    <!-- Footer -->
    <div
      class="mt-10 pt-6 border-t border-gray-300 text-center text-sm text-gray-500"
    >
      © 2024 Gestion École
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const stats = ref({
  year: "2023-2024",
  totalExpected: 250000,
  totalPaid: 180000,
  latePayments: 35,
  licencePaid: 120000,
  masterPaid: 60000,
});

const remainingAmount = computed(() => {
  return stats.value.totalExpected - stats.value.totalPaid;
});

const recoveryRate = computed(() => {
  return (stats.value.totalPaid / stats.value.totalExpected) * 100;
});

const totalCyclePaid = computed(() => {
  return stats.value.licencePaid + stats.value.masterPaid;
});

const licencePercent = computed(() => {
  return (stats.value.licencePaid / totalCyclePaid.value) * 100;
});

const masterPercent = computed(() => {
  return (stats.value.masterPaid / totalCyclePaid.value) * 100;
});
</script>

<style scoped>
/* Design simple, propre, orienté comptabilité école */
</style>
