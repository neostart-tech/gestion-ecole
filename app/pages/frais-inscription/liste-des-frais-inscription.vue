<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors font-sans">
    <!-- Breadcrumb with a more "premium" look -->
    <Breadcrumb
      :items="[
        { label: 'Gestion Financière', to: '/' },
        { label: 'Frais d\'inscription', to: null },
      ]"
      title="Frais d'inscription"
      title-class="text-lg sm:text-xl md:text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter"
      spacing="mb-8"
    />

    <!-- Action Toolbar: Balanced formal design -->
    <div class="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between mb-8 bg-white dark:bg-gray-800 p-4 rounded-md border border-slate-200 dark:border-gray-700 shadow-sm transition-all duration-300">
      <div class="relative w-full lg:w-96 group">
        <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </span>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher par année scolaire..."
          class="w-full pl-12 pr-4 py-3 rounded-2xl border-none bg-slate-100 dark:bg-gray-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm font-medium"
        />
      </div>

      <div class="flex items-center gap-3">
        <client-only>
          <VDropdown placement="bottom-end">
            <button
              class="flex items-center gap-2 px-4 py-3 rounded-2xl border bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold uppercase text-[10px] tracking-widest shadow-sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              Colonnes
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6" stroke-width="2" stroke-linecap="round" /></svg>
            </button>

            <template #popper>
              <div class="w-56 p-3 rounded-xl shadow-lg bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700">
                <div v-for="col in columns" :key="col.field" class="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    v-model="col.visible"
                    :disabled="col.field === 'action'"
                    class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-widest">
                    {{ col.title }}
                  </span>
                </div>
              </div>
            </template>
          </VDropdown>
        </client-only>

        <Can action="create-frais-inscription">
          <button
            @click="openAddModal"
            class="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md hover:shadow-indigo-500/25 group"
          >
            <svg class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14M5 12h14"/></svg>
            <span class="text-[10px] font-bold uppercase tracking-widest">Ajouter un tarif</span>
          </button>
        </Can>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-md shadow-md overflow-hidden border border-slate-200 dark:border-gray-700 transition-all duration-300">
      <div v-if="fraisStore.isLoading" class="flex flex-col justify-center items-center py-24 space-y-4">
        <div class="h-12 w-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <p class="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Chargement des données...</p>
      </div>

      <div v-else class="overflow-x-auto p-4 transition-all duration-500 ease-in-out">
        <Vue3Datatable
          :columns="visibleColumns"
          :rows="rows"
          :search="searchQuery"
          skin="bh-table-hover"
          class="w-full"
        >
          <!-- Custom Template for Amount -->
          <template #montant="data">
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-lg font-black text-sm">
                {{ formatCurrency(data.value.montant) }}
              </span>
            </div>
          </template>

          <!-- Custom Template for Academic Year -->
          <template #annee="data">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <span class="font-bold text-slate-700 dark:text-slate-200">{{ data.value.annee }}</span>
            </div>
          </template>

          <!-- Custom Template for Status / Activation -->
          <template #active="data">
            <div class="flex items-center">
              <Can action="update-frais-inscription">
              <button
                @click="confirmActivation(data.value)"
                :class="[
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
                  data.value.active ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-gray-700'
                ]"
              >
                <span
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="data.value.active ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
              </Can>
              <span class="ml-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                {{ data.value.active ? 'Actif' : 'Désactivé' }}
              </span>
            </div>
          </template>

          <!-- Actions Template -->
          <template #action="data">
            <div class="flex items-center gap-2 justify-end">
              <Can action="update-frais-inscription">
                <button
                  @click="data.value.has_payments ? null : openEditModal(data.value)"
                  :disabled="data.value.has_payments"
                  :class="[
                    'p-2.5 rounded-xl transition-all group',
                    data.value.has_payments ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                  ]"
                  :title="data.value.has_payments ? 'Impossible de modifier : des paiements sont liés' : 'Modifier'"
                >
                  <svg class="w-5 h-5 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
              </Can>
              <Can action="delete-frais-inscription">
                <button
                  @click="data.value.has_payments ? null : confirmDelete(data.value)"
                  :disabled="data.value.has_payments"
                  :class="[
                    'p-2.5 rounded-xl transition-all group',
                    data.value.has_payments ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' : 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                  ]"
                  :title="data.value.has_payments ? 'Impossible de supprimer : des paiements sont liés' : 'Supprimer'"
                >
                  <svg class="w-5 h-5 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </Can>
            </div>
          </template>
        </Vue3Datatable>

        <!-- Empty State -->
        <div v-if="!rows.length && !fraisStore.isLoading" class="text-center py-20 bg-slate-50/50 dark:bg-gray-800/50 rounded-2xl m-4">
          <div class="h-20 w-20 bg-indigo-50 dark:bg-gray-700 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h3 class="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tighter">Aucun tarif configuré</h3>
          <p class="text-slate-400 text-sm mt-1 mb-6">Définissez les frais d'inscription pour l'année scolaire en cours.</p>
          <button @click="openAddModal" class="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/20">Initialiser les frais</button>
        </div>
      </div>
    </div>

    <!-- Simplified Modal for Registration Fees -->
    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeModal">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-md bg-white dark:bg-gray-800 p-8 text-left align-middle shadow-2xl transition-all border border-slate-200 dark:border-gray-700">
                <div class="flex items-center gap-4 mb-8">
                  <div class="w-12 h-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                    <svg v-if="!isEditing" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                    <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tighter">
                      {{ isEditing ? 'Modifier le tarif' : 'Nouveau tarif' }}
                    </h3>
                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Inscription annuelle</p>
                  </div>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-6">
                  <div v-if="!isEditing">
                    <p class="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-1 mb-2">Année scolaire de destination</p>
                    <div class="px-4 py-3 rounded-md bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-black text-xs border border-indigo-100 dark:border-indigo-800/40">
                      {{ activeYearName || 'Année active indéterminée' }}
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Niveau (Optionnel)</label>
                    <Dropdown
                      v-model="form.niveau_id"
                      :options="niveauStore.niveaux"
                      optionLabel="libelle"
                      optionValue="id"
                      placeholder="Global"
                      showClear
                      class="w-full"
                    />
                  </div>

                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Filière (Optionnelle)</label>
                    <Dropdown
                      v-model="form.filiere_id"
                      :options="filiereStore.filieres"
                      optionLabel="nom"
                      optionValue="id"
                      placeholder="Global"
                      showClear
                      class="w-full"
                    />
                  </div>

                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Montant des frais (FCFA)</label>
                    <InputNumber
                      v-model="form.montant"
                      placeholder="Ex: 50000"
                      class="w-full"
                      :min="0"
                      inputId="frais_amount"
                    />
                  </div>

                  <div class="flex justify-end gap-3 pt-6">
                    <button
                      type="button"
                      @click="closeModal"
                      class="px-5 py-2.5 rounded-md text-slate-500 font-bold uppercase text-[10px] tracking-widest hover:bg-slate-100 dark:hover:bg-gray-700 transition-all border border-transparent"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      :disabled="fraisStore.isLoading"
                      class="px-6 py-2.5 rounded-md bg-indigo-600 text-white font-bold uppercase text-[10px] tracking-widest hover:bg-indigo-700 transition-all shadow-lg disabled:opacity-50"
                    >
                      {{ fraisStore.isLoading ? 'En cours...' : (isEditing ? 'Mettre à jour' : 'Confirmer') }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import '@bhplugin/vue3-datatable/dist/style.css';
import Breadcrumb from '~/components/Breadcrumb.vue';
import InputNumber from 'primevue/inputnumber';
import { useFraisInscriptionStore } from '~~/stores/frais-inscription';
import { useAnneScolaireStore } from '~~/stores/annee-scolaire';
import { useNiveauStore } from '~~/stores/niveau';
import { useFiliereStore } from '~~/stores/filiere';
import Dropdown from 'primevue/dropdown';

const { $toastr, $swal } = useNuxtApp();
const fraisStore = useFraisInscriptionStore();
const anneeScolaireStore = useAnneScolaireStore();
const niveauStore = useNiveauStore();
const filiereStore = useFiliereStore();

const searchQuery = ref('');
const showModal = ref(false);
const isEditing = ref(false);

const form = ref({
  id: null,
  montant: null
});

const columns = ref([
  { field: 'annee', title: 'Année scolaire', sortable: true, visible: true },
  { field: 'niveau_nom', title: 'Niveau', sortable: true, visible: false },
  { field: 'filiere_nom', title: 'Filière', sortable: true, visible: false },
  { field: 'montant', title: 'Montant (FCFA)', sortable: true, visible: true },
  { field: 'active', title: 'Statut', sortable: true, visible: true },
  { field: 'created_at_fmt', title: 'Date création', sortable: true, visible: true },
  { field: 'action', title: 'Actions', sortable: false, width: '120px', cellClass: 'text-right', visible: true }
]);

const visibleColumns = computed(() => columns.value.filter(c => c.visible));

const rows = computed(() => {
  return (fraisStore.frais || []).map(f => ({
    id: f.id,
    montant: f.montant || 0,
    active: f.active || false,
    annee: f.annee_scolaire?.nom || f.annee_scolaire_id || 'Archives / N/A',
    niveau_nom: f.niveau?.nom || 'Global',
    filiere_nom: f.filiere?.nom || 'Global',
    niveau_id: f.niveau_id,
    filiere_id: f.filiere_id,
    has_payments: f.has_payments || false,
    created_at_fmt: formatDate(f.created_at)
  }));
});

const activeYearName = computed(() => {
  return anneeScolaireStore.activeAnnee?.nom || 'Année non définie';
});

const openAddModal = () => {
  isEditing.value = false;
  form.value = {
    id: null,
    montant: null,
    niveau_id: null,
    filiere_id: null
  };
  showModal.value = true;
};

const openEditModal = (item) => {
  isEditing.value = true;
  form.value = {
    id: item.id,
    montant: item.montant,
    niveau_id: item.niveau_id,
    filiere_id: item.filiere_id
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const handleSubmit = async () => {
  if (!form.value.montant && form.value.montant !== 0) {
    $toastr.error('Veuillez saisir un montant');
    return;
  }

  try {
    if (isEditing.value) {
      await fraisStore.updateFrais(form.value.id, { 
        montant: form.value.montant,
        niveau_id: form.value.niveau_id,
        filiere_id: form.value.filiere_id
      });
      $toastr.success('Tarif mis à jour avec succès');
    } else {
      await fraisStore.addFrais({ 
        montant: form.value.montant,
        niveau_id: form.value.niveau_id,
        filiere_id: form.value.filiere_id
      });
      $toastr.success('Nouveau tarif enregistré');
    }
    closeModal();
  } catch (err) {
    $toastr.error(err.response?.data?.message || 'Une erreur est survenue');
  }
};

const confirmActivation = async (item) => {
  try {
    await fraisStore.activateFrais(item.id);
    $toastr.success(`Le tarif est désormais ${item.active ? 'désactivé' : 'actif'}`);
  } catch (err) {
    $toastr.error('Erreur lors de la modification de l\'état');
  }
};

const confirmDelete = async (item) => {
  const result = await $swal.fire({
    title: 'Supprimer ?',
    text: `Voulez-vous vraiment supprimer le tarif pour l'année ${item.annee} ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  });

  if (result.isConfirmed) {
    try {
      await fraisStore.deleteFrais(item.id);
      $toastr.success('Supprimé avec succès');
    } catch (err) {
      $toastr.error('Erreur lors de la suppression');
    }
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return '--';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

onMounted(async () => {
  await Promise.all([
    fraisStore.fetchFrais(),
    anneeScolaireStore.fetchAnneeScolaire(),
    niveauStore.fetchNiveaux(),
    filiereStore.fetchFilieres()
  ]);
});
</script>
