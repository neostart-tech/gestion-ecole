<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <Breadcrumb
      :items="[
        { label: 'Matieres', to: '/uvs/liste' },
        { label: 'Affectations', to: null },
      ]"
      title="Affectations de la matière"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <div class="mb-5 flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-800 dark:text-white" v-if="matiere">
        Matière : {{ matiere.nom }} ({{ matiere.code }})
      </h2>
      <div v-else class="h-8 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>

      <Can action="create-uv">
        <button
          @click="openAddModal"
          class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Affecter à une classe
        </button>
      </Can>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-3 sm:p-4">
      <div v-if="loading" class="flex justify-center py-10">
        <div class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="columns"
          :rows="rows"
          :per-page="10"
          skin="bh-table-striped bh-table-hover"
        >
          <template #enseignants="{ value }">
             <div class="flex gap-1 flex-wrap">
               <span v-for="user in value.user" :key="user.id" class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                  {{ user.nom }} {{ user.prenom }}
               </span>
               <span v-if="!value.user || value.user.length === 0" class="text-gray-400 text-xs">Aucun</span>
             </div>
          </template>

          <template #action="{ value }">
            <div class="flex justify-center gap-3">
              <Can action="update-uv">
                <button
                  @click="openEditModal(value)"
                  class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 20h4l10-10-4-4L4 16v4z" stroke-width="2" stroke-linejoin="round"/>
                  </svg>
                </button>
              </Can>

              <Can action="delete-uv">
                <button
                  @click="deleteItem(value)"
                  class="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                >
                  <ButtonDelete />
                </button>
              </Can>
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>

    <!-- Modal d'ajout/modification -->
    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeModal">
        <div class="fixed inset-0 bg-black/60" />
        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel class="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-5 max-h-[90vh] overflow-y-auto">
            <DialogTitle class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {{ modalTitle }}
            </DialogTitle>

            <form @submit.prevent="saveAffectation" class="space-y-4">
              <!-- NIVEAU -->
              <MultiSelect
                v-if="!form.id"
                v-model="form.niveau_ids"
                display="chip"
                :options="NiveauxOptions"
                optionLabel="label"
                optionValue="value"
                multiple
                filter
                placeholder="Sélectionner des niveaux"
                class="w-full"
                @change="onNiveauChangeMulti"
              />
              <Dropdown
                v-else
                v-model="form.niveau_id"
                :options="NiveauxOptions"
                optionLabel="label"
                optionValue="value"
                filter
                showClear
                placeholder="Sélectionner un niveau"
                class="w-full"
                @change="onNiveauChange"
              />

              <!-- FILIERE -->
              <MultiSelect
                v-if="!form.id"
                v-model="form.filiere_ids"
                display="chip"
                :options="FilieresOptions"
                optionLabel="label"
                optionValue="value"
                multiple
                filter
                placeholder="Sélectionner des filières"
                class="w-full"
              />
               <Dropdown
                v-else
                v-model="form.filiere_id"
                :options="FilieresOptions"
                optionLabel="label"
                optionValue="value"
                filter
                showClear
                placeholder="Sélectionner une filiere"
                class="w-full"
              />

              <!-- PERIODE -->
              <MultiSelect
                v-if="!form.id"
                v-model="form.periode_ids"
                display="chip"
                :options="SemestreOptions"
                optionLabel="label"
                optionValue="value"
                multiple
                filter
                :disabled="!form.niveau_ids || form.niveau_ids.length === 0"
                :placeholder="form.niveau_ids?.length > 0 ? 'Sélectionner des semestres' : 'Sélectionnez d\'abord un niveau'"
                class="w-full"
              />
              <Dropdown
                v-else
                v-model="form.periode_id"
                :options="SemestreOptions"
                optionLabel="label"
                optionValue="value"
                filter
                showClear
                :disabled="!form.niveau_id"
                :placeholder="form.niveau_id ? 'Sélectionner un semestre' : 'Sélectionnez d\'abord un niveau'"
                class="w-full"
              />
              
              <FloatLabel variant="on">
                <InputNumber v-model="form.volume_horaire" inputId="vol_hor" fluid />
                <label for="vol_hor">Volume Horaire</label>
              </FloatLabel>
              <FloatLabel variant="on">
                <InputNumber v-model="form.coefficient" inputId="coef" fluid />
                <label for="coef">Coefficient</label>
              </FloatLabel>

              <!-- Poids des évaluations -->
              <div class="mb-4 border-t pt-4 border-gray-200 dark:border-gray-700">
                <h3 class="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  Types d'évaluations et pourcentages (somme = 100)
                </h3>
                <div class="grid grid-cols-2 md:grid-cols-2 gap-3">
                  <FloatLabel variant="on">
                    <InputNumber v-model="form.poids_devoir" inputId="poids_devoir" fluid />
                    <label for="poids_devoir">Devoir %</label>
                  </FloatLabel>
                  <FloatLabel variant="on">
                    <InputNumber v-model="form.poids_examen" inputId="poids_examen" fluid />
                    <label for="poids_examen">Examen %</label>
                  </FloatLabel>
                </div>
                <div v-if="totalPourcentage !== 100" class="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">
                  La somme des pourcentages doit être égale à 100 (actuellement {{ totalPourcentage }}).
                </div>
              </div>

              <MultiSelect
                v-model="form.enseignant_id"
                display="chip"
                :options="enseignantsOptions"
                optionLabel="label"
                optionValue="value"
                multiple
                filter
                placeholder="Sélectionner les professeurs"
                class="w-full"
              />

              <div class="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  :disabled="isSaving || totalPourcentage !== 100"
                  class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg v-if="isSaving" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import { Dialog, DialogPanel, DialogTitle, TransitionRoot } from "@headlessui/vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useFiliereStore } from "~~/stores/filiere";
import { useMatiereStore } from "~~/stores/matiere";
import { useUvStore } from "~~/stores/unite-valeur";
import { useUserStore } from "~~/stores/user";
import { usePeriodeStore } from "~~/stores/periode";
import { useNiveauStore } from "~~/stores/niveau";
import ButtonDelete from "~/components/ui/buttonDelete.vue";

const route = useRoute();
const matiereSlug = route.params.slug;

const { $toastr, $swal } = useNuxtApp();
const filiereStore = useFiliereStore();
const matiereStore = useMatiereStore();
const uvStore = useUvStore();
const userStore = useUserStore();
const periodeStore = usePeriodeStore();
const niveauStore = useNiveauStore();

const loading = ref(true);
const isSaving = ref(false);
const showModal = ref(false);
const modalTitle = ref("");

const matiere = computed(() => matiereStore.matieres.find(m => m.slug === matiereSlug));

const columns = ref([
  { field: "niveau_label", title: "Niveau" },
  { field: "filiere_label", title: "Filière" },
  { field: "semestre_label", title: "Semestre" },
  { field: "volume_horaire", title: "Vol. Horaire" },
  { field: "coefficient", title: "Coefficient" },
  { field: "enseignants", title: "Enseignants" },
  { field: "action", title: "Actions" },
]);

const rows = computed(() => {
  if (!matiere.value) return [];
  return uvStore.uvs
    .filter(uv => uv.matiere_id === matiere.value.id)
    .map((f) => ({
      ...f,
      niveau_label: f.niveau?.libelle ?? "--",
      filiere_label: f.filiere?.nom ?? "--",
      semestre_label: f.periode?.nom ?? "--",
      enseignant_ids: f.user?.map(u => u.id) ?? []
    }));
});

const form = ref({
  id: null,
  matiere_id: null,
  volume_horaire: "",
  coefficient: "",
  enseignant_id: [],
  filiere_id: "",
  periode_id: "",
  niveau_id: "",
  filiere_ids: [],
  periode_ids: [],
  niveau_ids: [],
  poids_devoir: 40,
  poids_interrogation: 0,
  poids_examen: 60,
  poids_tp: 0,
  poids_expose: 0,
});

const totalPourcentage = computed(() => {
  return (
    (form.value.poids_devoir || 0) +
    (form.value.poids_examen || 0)
  );
});

const openAddModal = () => {
  modalTitle.value = "Affecter la matière à une classe";
  form.value = {
    id: null,
    matiere_id: matiere.value?.id,
    volume_horaire: "",
    coefficient: "",
    enseignant_id: [],
    filiere_id: "",
    periode_id: "",
    niveau_id: "",
    filiere_ids: [],
    periode_ids: [],
    niveau_ids: [],
    poids_devoir: 40,
    poids_interrogation: 0,
    poids_examen: 60,
    poids_tp: 0,
    poids_expose: 0,
  };
  filteredPeriodes.value = [];
  showModal.value = true;
};

const openEditModal = (f) => {
  modalTitle.value = "Modifier l'affectation";
  form.value = {
    id: f.id,
    slug: f.slug,
    matiere_id: matiere.value?.id,
    volume_horaire: f.volume_horaire,
    coefficient: f.coefficient,
    filiere_id: f.filiere?.id,
    periode_id: f.periode?.id,
    niveau_id: f.niveau?.id,
    enseignant_id: [...f.enseignant_ids],
    filiere_ids: [],
    periode_ids: [],
    niveau_ids: [],
    poids_devoir: f.devoir ?? 40,
    poids_interrogation: f.interrogation ?? 0,
    poids_examen: f.examen ?? 60,
    poids_tp: f.tp ?? 0,
    poids_expose: f.expose ?? 0,
  };
  if (f.niveau?.id) onNiveauChange();
  showModal.value = true;
};

const closeModal = () => (showModal.value = false);

const filteredPeriodes = ref([]);
const onNiveauChange = async () => {
  if (form.value.niveau_id) {
    try {
      const periodes = await niveauStore.fetchNiveauPeriodes(form.value.niveau_id);
      filteredPeriodes.value = periodes;
      if (form.value.periode_id && !periodes.find(p => p.id === form.value.periode_id)) {
        form.value.periode_id = "";
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    filteredPeriodes.value = [];
    form.value.periode_id = "";
  }
};

const onNiveauChangeMulti = async () => {
  if (form.value.niveau_ids && form.value.niveau_ids.length > 0) {
    try {
      let allPeriodes = [];
      for (const nid of form.value.niveau_ids) {
          const p = await niveauStore.fetchNiveauPeriodes(nid);
          allPeriodes = [...allPeriodes, ...p];
      }
      const uniqueIds = new Set();
      filteredPeriodes.value = allPeriodes.filter(p => {
          if (!uniqueIds.has(p.id)) {
              uniqueIds.add(p.id);
              return true;
          }
          return false;
      });
      if (form.value.periode_ids && form.value.periode_ids.length > 0) {
          form.value.periode_ids = form.value.periode_ids.filter(id => 
              filteredPeriodes.value.find(p => p.id === id)
          );
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    filteredPeriodes.value = [];
    form.value.periode_ids = [];
  }
};

const saveAffectation = async () => {
  isSaving.value = true;
  try {
    form.value.id || form.value.slug
      ? await uvStore.updateUv(form.value.slug || form.value.id, form.value)
      : await uvStore.addUv(form.value);

    await uvStore.fetchUv();
    await matiereStore.fetchMatieres(); // to update the affectations count
    $toastr.success("Affectation enregistrée avec succes");
    closeModal();
  } catch (error) {
    console.log(error);
    $toastr.error(error.response?.data?.message || "Une erreur est survenue");
  } finally {
    isSaving.value = false;
  }
};

const deleteItem = async (uv) => {
  const res = await $swal.fire({
    title: "Supprimer cette affectation ?",
    text: "Toutes les notes et cours liés seront perdus.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Supprimer",
  });

  if (res.isConfirmed) {
    try {
      await uvStore.deleteUv(uv.slug || uv.id);
      await uvStore.fetchUv();
      await matiereStore.fetchMatieres();
      $toastr.success("Affectation supprimée avec succes");
    } catch (e) {
      $toastr.error("Erreur lors de la suppression");
    }
  }
};

const SemestreOptions = computed(() => {
  const source = filteredPeriodes.value.length > 0 ? filteredPeriodes.value : periodeStore.periode;
  return source.map((p) => ({ label: p.nom, value: p.id }));
});

const NiveauxOptions = computed(() => niveauStore.niveaux.map((n) => ({ label: n.libelle, value: n.id })));
const FilieresOptions = computed(() => filiereStore.filieres.map((f) => ({ label: f.nom, value: f.id })));
const enseignantsOptions = computed(() => userStore.enseignants.map((e) => ({ label: `${e.nom} ${e.prenom}`, value: e.id })));

onMounted(async () => {
  await Promise.all([
    matiereStore.fetchMatieres(),
    uvStore.fetchUv(),
    filiereStore.fetchFilieres(),
    userStore.fetchUsersEnseignant(),
    niveauStore.fetchNiveaux(),
    periodeStore.fetchPeriodeByYear()
  ]);
  loading.value = false;
});
</script>
