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
      <!-- Barre d'outils de sélection -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between border border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-3 w-full md:w-auto">
          <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Groupe d'affectation :</label>
          <Dropdown
            v-model="selectedGroupId"
            @update:modelValue="loadCandidates"
            :options="candidatureStore.groupes"
            :optionLabel="groupLabel"
            optionValue="id"
            placeholder="Rechercher ou choisir un groupe..."
            filter
            class="w-full md:w-96 rounded-xl"
          />
        </div>

        <Can action="attribuer-groupe-candidature">
          <Button
            v-if="selectedCandidates.length"
            @click="submitAttribution"
            :loading="isSubmitting"
            :label="`Affecter ${selectedCandidates.length} candidat(s)`"
            icon="pi pi-check"
            class="w-full md:w-auto"
          />
        </Can>
      </div>

      <div v-if="isLoadingCandidates" class="flex justify-center py-16">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>

      <div v-else-if="selectedGroupId" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-end bg-gray-50/50 dark:bg-gray-900/20">
          <client-only>
            <VDropdown placement="bottom-end" :distance="12">
              <button class="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-[5px] bg-white dark:bg-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
                </svg>
                Colonnes
                <svg class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <template #popper>
                <div class="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-2">
                  <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Affichage des colonnes</div>
                  <div class="max-h-64 overflow-y-auto">
                    <div 
                      v-for="col in columns" 
                      :key="col.field" 
                      class="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors" 
                      @click="col.visible = !col.visible"
                    >
                      <div 
                        class="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center transition-colors" 
                        :class="{'bg-blue-600 border-blue-600': col.visible}"
                      >
                        <svg v-if="col.visible" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ col.header }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </VDropdown>
          </client-only>
        </div>
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

          <Column v-if="isColumnVisible('candidat')" header="Candidat">
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

          <Column v-if="isColumnVisible('matricule')" field="matricule_concours" header="Matricule">
            <template #body="{ data }">
              {{ data.matricule_concours || data.numero_dossier_affiche }}
            </template>
          </Column>

          <Column v-if="isColumnVisible('numero')" header="Numéro de dossier">
            <template #body="{ data }">
              {{ data.numero_dossier_affiche || '—' }}
            </template>
          </Column>

          <Column v-if="isColumnVisible('niveau')" header="Niveau">
            <template #body="{ data }">
              {{ data.niveau?.libelle || '—' }}
            </template>
          </Column>

          <Column header="Actions" :exportable="false" style="min-width: 8rem" alignFrozen="right" :frozen="true">
            <template #body="{ data }">
              <Can action="attribuer-groupe-candidature">
                <button
                  @click="submitSingleAttribution(data)"
                  :disabled="isSubmittingSingle === data.slug"
                  class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all"
                  :class="isSubmittingSingle === data.slug 
                    ? 'bg-gray-100 text-gray-400 cursor-wait dark:bg-gray-800' 
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:scale-105 active:scale-95 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50'"
                >
                  <i v-if="isSubmittingSingle === data.slug" class="pi pi-spinner pi-spin text-[10px]"></i>
                  <i v-else class="pi pi-user-plus text-[10px]"></i>
                  Affecter
                </button>
              </Can>
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
const isSubmittingSingle = ref(null);

const columns = ref([
  { field: 'candidat', header: 'Candidat', visible: true },
  { field: 'matricule', header: 'Matricule', visible: false },
  { field: 'numero', header: 'Numéro de dossier', visible: true },
  { field: 'niveau', header: 'Niveau', visible: true }
]);

const isColumnVisible = (field) => {
  const col = columns.value.find(c => c.field === field);
  return col ? col.visible : false;
};

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

const submitSingleAttribution = async (candidate) => {
  const res = await $swal.fire({
    title: 'Attribuer ce groupe ?',
    text: `${candidate.nom} ${candidate.prenom} sera affecté(e) à ce groupe.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui, attribuer',
    cancelButtonText: 'Annuler',
  });
  if (!res.isConfirmed) return;

  isSubmittingSingle.value = candidate.slug;
  try {
    await candidatureStore.attribuerGroupe({
      group_id: selectedGroupId.value,
      candidats: [candidate.slug],
    });
    $toastr.success(`Groupe attribué avec succès à ${candidate.nom}.`);
    await loadCandidates();
  } catch (error) {
    $toastr.error(error.response?.data?.message || "Erreur lors de l'attribution du groupe.");
  } finally {
    isSubmittingSingle.value = null;
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
