<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Administration', to: '/' },
        { label: 'Candidatures', to: null },
        { label: 'Attribution de groupe', to: null },
      ]"
      title="Attribution de groupes aux candidats admis"
      title-class="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white"
      spacing="mb-6"
    />

    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <p class="text-sm text-blue-800 dark:text-blue-300">
        Sélectionnez un groupe pour afficher les candidats admis de la filière correspondante, puis attribuez-leur ce groupe.
      </p>
    </div>

    <!-- Chargement des groupes -->
    <div v-if="isLoadingGroupes" class="flex justify-center py-16">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
    </div>

    <template v-else>
      <div class="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        <div class="flex items-center gap-2 w-full md:w-auto">
          <span class="text-gray-600 dark:text-gray-400 whitespace-nowrap">Groupe :</span>
          <Dropdown
            v-model="selectedGroupId"
            @update:modelValue="loadCandidates"
            :options="candidatureStore.groupes"
            :optionLabel="groupLabel"
            optionValue="id"
            placeholder="Choisir un groupe"
            filter
            class="w-full md:min-w-[320px]"
          />
        </div>

        <Button
          v-if="selectedCandidates.length"
          @click="submitAttribution"
          :loading="isSubmitting"
          :label="`Attribuer le groupe à ${selectedCandidates.length} candidat(s)`"
          icon="pi pi-check"
        />
      </div>

      <div v-if="isLoadingCandidates" class="flex justify-center py-16">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>

      <div v-else-if="selectedGroupId" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <DataTable
          v-model:selection="selectedCandidates"
          :value="candidates"
          dataKey="slug"
          responsiveLayout="scroll"
        >
          <template #empty>
            <div class="text-center py-12 text-gray-500 dark:text-gray-400">
              Aucun candidat admis en attente d'affectation pour ce groupe.
            </div>
          </template>

          <Column selectionMode="multiple" headerStyle="width: 3rem" />

          <Column header="Candidat">
            <template #body="{ data }">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center shrink-0">
                  <span class="text-indigo-600 dark:text-indigo-400 font-semibold">{{ getInitials(data.nom, data.prenom) }}</span>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ data.nom }} {{ data.prenom }}</h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ data.email }}</p>
                </div>
              </div>
            </template>
          </Column>

          <Column field="matricule_concours" header="Matricule">
            <template #body="{ data }">
              {{ data.matricule_concours || data.numero_dossier_affiche }}
            </template>
          </Column>

          <Column header="Niveau">
            <template #body="{ data }">
              {{ data.niveau?.libelle || '—' }}
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Breadcrumb from '~/components/Breadcrumb.vue';
import { useCandidatureStore } from '~~/stores/candidature';

const { $toastr, $swal } = useNuxtApp();
const candidatureStore = useCandidatureStore();

const isLoadingGroupes = ref(true);
const isLoadingCandidates = ref(false);
const isSubmitting = ref(false);
const selectedGroupId = ref(null);
const candidates = ref([]);
const selectedCandidates = ref([]);

const getInitials = (nom, prenom) => `${nom?.[0] || ''}${prenom?.[0] || ''}`.toUpperCase();

const groupLabel = (group) => {
  const niveau = group.niveau?.libelle ? `${group.niveau.libelle} ` : '';
  const filieres = group.filieres?.length ? ` (${group.filieres.map(f => f.code).join(', ')})` : '';
  return `${niveau}${group.nom}${filieres}`;
};

const loadCandidates = async () => {
  selectedCandidates.value = [];
  if (!selectedGroupId.value) {
    candidates.value = [];
    return;
  }
  // La route de consultation attend le slug du groupe (clé de route de Group),
  // alors que l'attribution elle-même (POST) se fait par id.
  const group = candidatureStore.groupes.find(g => g.id === selectedGroupId.value);
  if (!group) {
    candidates.value = [];
    return;
  }
  isLoadingCandidates.value = true;
  try {
    candidates.value = await candidatureStore.fetchGroupeAttribution(group.slug);
  } catch (error) {
    $toastr.error("Impossible de charger les candidats de ce groupe.");
  } finally {
    isLoadingCandidates.value = false;
  }
};

const submitAttribution = async () => {
  const res = await $swal.fire({
    title: 'Attribuer ce groupe ?',
    text: `${selectedCandidates.value.length} candidat(s) seront affectés à ce groupe.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui, attribuer',
    cancelButtonText: 'Annuler',
  });
  if (!res.isConfirmed) return;

  isSubmitting.value = true;
  try {
    await candidatureStore.attribuerGroupe({
      group_id: selectedGroupId.value,
      candidats: selectedCandidates.value.map(c => c.slug),
    });
    $toastr.success("Groupe attribué avec succès.");
    await loadCandidates();
  } catch (error) {
    $toastr.error(error.response?.data?.message || "Erreur lors de l'attribution du groupe.");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  try {
    await candidatureStore.fetchGroupesChoix();
  } catch (error) {
    $toastr.error("Impossible de charger la liste des groupes.");
  } finally {
    isLoadingGroupes.value = false;
  }
});
</script>

<style scoped>
/* Aligne les composants PrimeVue de cette page sur l'indigo utilisé dans le reste de l'app. */
:deep(.p-button:not(.p-button-outlined):not(.p-button-secondary)) {
  --p-button-primary-background: #4f46e5;
  --p-button-primary-hover-background: #4338ca;
  --p-button-primary-active-background: #3730a3;
  --p-button-primary-border-color: #4f46e5;
  --p-button-primary-hover-border-color: #4338ca;
  --p-button-primary-active-border-color: #3730a3;
}

:deep(.p-dropdown.p-focus) {
  border-color: #4f46e5 !important;
  box-shadow: 0 0 0 1px #4f46e5 !important;
}

:deep(.p-checkbox-checked .p-checkbox-box) {
  background: #4f46e5;
  border-color: #4f46e5;
}
</style>
