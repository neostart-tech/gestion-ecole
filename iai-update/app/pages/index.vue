<template>
  <div class="min-h-screen bg-gray-100 p-4 md:p-6">
    <!-- Header -->
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between">
      <div>
        <h1 class="text-xl md:text-2xl font-semibold text-gray-800">
          Dashboard Universitaire
        </h1>
        <p class="text-sm text-gray-600">
          Année {{ stats.year }} • {{ stats.semester }}
        </p>
      </div>
    </div>

    <!-- Statistiques principales -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div class="bg-white p-4 border border-gray-200 rounded-lg">
        <p class="text-sm text-gray-500">Étudiants</p>
        <p class="text-2xl font-bold text-blue-600 mt-2">
          {{ stats.students }}
        </p>
      </div>

      <div class="bg-white p-4 border border-gray-200 rounded-lg">
        <p class="text-sm text-gray-500">Filières</p>
        <p class="text-2xl font-bold text-green-600 mt-2">
          {{ stats.programs }}
        </p>
      </div>

      <div class="bg-white p-4 border border-gray-200 rounded-lg">
        <p class="text-sm text-gray-500">Enseignants</p>
        <p class="text-2xl font-bold text-blue-600 mt-2">
          {{ stats.teachers }}
        </p>
      </div>
    </div>

    <!-- Répartition simple : Admis / Ajournés et Taux de réussite -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <!-- Bloc 1 : Admis / Ajournés -->
      <div class="bg-white p-6 border border-gray-200 rounded-lg">
        <h3 class="font-semibold text-gray-800 mb-4">Statut Étudiants</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Admis</span>
            <span
              class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ stats.admis }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Ajournés</span>
            <span
              class="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ stats.ajournes }}
            </span>
          </div>
        </div>
      </div>

      <!-- Bloc 2 : Taux de réussite -->
      <div class="bg-white p-6 border border-gray-200 rounded-lg">
        <h3 class="font-semibold text-gray-800 mb-4">Taux de Réussite</h3>
        <p class="text-3xl font-bold text-yellow-600">
          {{ stats.successRate }}%
        </p>
        <p class="text-sm text-gray-500 mt-1">Calculé sur tous les étudiants</p>
      </div>
    </div>

    <!-- Répartition par Cycle -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <div class="bg-white p-4 border border-gray-200 rounded-lg">
        <h3 class="font-semibold text-gray-800 mb-4">Répartition par Cycle</h3>

        <div class="mb-3">
          <div class="flex justify-between text-sm mb-1">
            <span>Licence</span>
            <span>{{ stats.licence }}</span>
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
            <span>{{ stats.master }}</span>
          </div>
          <div class="h-2 bg-gray-200 rounded">
            <div
              class="h-2 bg-green-500 rounded"
              :style="{ width: masterPercent + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Bloc vide / futur graphique simple -->
      <div
        class="bg-white p-4 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400"
      >
        Graphique ou autre statistique
      </div>
    </div>

    <!-- Footer -->
    <div
      class="mt-10 pt-6 border-t border-gray-300 text-center text-sm text-gray-500"
    >
      © 2024 Université Excellence
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useEtudiantStore } from "~~/stores/etudiant";
import { useFiliereStore } from "~~/stores/filiere";
import { useUserStore } from "~~/stores/user";

const etudiantStore = useEtudiantStore();
const filiereStore = useFiliereStore();
const UserStore = useUserStore();

const stats = ref({
  year: "2023-2024",
  semester: "Semestre 2",
  students: computed(() => {
    return etudiantStore.nombreEtudiant;
  }),
  programs:computed(() => {
    return filiereStore.nombreFiliere;
  }) ,
  teachers: computed(() => {
    return UserStore.nombreEnseignant;
  }),
  successRate: 88.7,
  licence: 100,
  master: 22,
  admis: 100,
  ajournes: 22,
});

const totalStudents = computed(() => stats.value.licence + stats.value.master);

const licencePercent = computed(
  () => (stats.value.licence / totalStudents.value) * 100,
);

const masterPercent = computed(
  () => (stats.value.master / totalStudents.value) * 100,
);

onMounted(async() => {
await  etudiantStore.fetchEtudiants();
 await filiereStore.fetchFilieres();
  await UserStore.fetchUsersEnseignant();
});
</script>

<style scoped>
/* Design volontairement simple et professionnel, responsive */
</style>
