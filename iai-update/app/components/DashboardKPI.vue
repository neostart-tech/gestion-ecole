<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
    <!-- Total Étudiants -->
    <KPICard
      title="Total étudiants"
      :value="stats.total_etudiants"
      :loading="loading"
      icon="users"
      color="blue"
      :trend="stats.en_cours"
      trend-label="en cours"
      @click="$emit('card-click', 'total')"
    />

    <!-- En cours -->
    <KPICard
      title="En cours"
      :value="stats.en_cours"
      :loading="loading"
      icon="clock"
      color="amber"
      :sub-value="stats.en_retard"
      sub-label="en retard"
      @click="$emit('card-click', 'en_cours')"
    />

    <!-- En retard -->
    <KPICard
      title="En retard"
      :value="stats.en_retard"
      :loading="loading"
      icon="alert"
      color="red"
      :sub-value="stats.montant_en_retard"
      sub-label="montant"
      :format-sub-value="true"
      @click="$emit('card-click', 'retard')"
    />

    <!-- Montant total -->
    <KPICard
      title="Total payé"
      :value="stats.montant_paye"
      :loading="loading"
      icon="currency"
      color="green"
      :sub-value="stats.montant_total"
      sub-label="total"
      :format-value="true"
      :format-sub-value="true"
      @click="$emit('card-click', 'total')"
    />
  </div>
</template>

<script setup>
import KPICard from './KPICard.vue'

defineProps({
  stats: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['card-click'])
</script>