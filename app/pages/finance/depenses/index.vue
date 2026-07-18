<script setup>
import { ref, computed, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import '@bhplugin/vue3-datatable/dist/style.css';
import { useDepenseStore } from '~~/stores/depense';

const { $swal } = useNuxtApp();
const depenseStore = useDepenseStore();

const showModal = ref(false);
const isEdit = ref(false);
const editId = ref(null);
const loadingAction = ref(false);
const searchQuery = ref('');
const pageSize = ref(10);

const filters = ref({ categorie: '', mode_paiement: '' });

const form = ref({
  titre: '',
  montant: '',
  date_depense: new Date().toISOString().split('T')[0],
  categorie: '',
  description: '',
  reference: '',
  mode_paiement: 'Banque / Virement'
});

const categories = [
  'Salaires & Honoraires', 'Matériel Pédagogique', 'Maintenance & Travaux', 
  'Services (Eau, électricité, Web)', 'Recherche & Conférences', 'Marketing & Communication', 
  'Événements Académiques', 'Fournitures & Bureautique', 'Bourses & Social', 'Divers'
];

const modesPaiement = ['Espèce', 'Banque / Virement', 'Chèque', 'Mobile Money'];

const columns = [
    { field: 'date_depense', title: 'Date', width: '120px', sort: true },
    { field: 'titre', title: 'Libellé / Objet', sort: true },
    { field: 'categorie', title: 'Catégorie', width: '200px' },
    { field: 'montant', title: 'Montant', width: '150px', cellClass: 'text-right font-semibold text-gray-800 dark:text-gray-200' },
    { field: 'mode_paiement', title: 'Paiement', width: '150px' },
    { field: 'actions', title: 'Actions', width: '100px', sort: false, cellClass: 'text-center' }
];

const filteredData = computed(() => {
    let data = depenseStore.depenses || [];
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        data = data.filter(d => d.titre?.toLowerCase().includes(query) || d.reference?.toLowerCase().includes(query));
    }
    if (filters.value.categorie) data = data.filter(d => d.categorie === filters.value.categorie);
    if (filters.value.mode_paiement) data = data.filter(d => d.mode_paiement === filters.value.mode_paiement);
    return data;
});

const formatMontant = (amount) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount || 0);
};

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR')
}

const openAddModal = () => {
  isEdit.value = false;
  editId.value = null;
  form.value = { titre: '', montant: '', date_depense: new Date().toISOString().split('T')[0], categorie: '', description: '', reference: '', mode_paiement: 'Banque / Virement' };
  showModal.value = true;
};

const openEditModal = (depense) => {
  isEdit.value = true;
  editId.value = depense.id;
  form.value = { 
    titre: depense.titre, 
    montant: depense.montant, 
    date_depense: depense.date_depense.split(' ')[0], 
    categorie: depense.categorie, 
    description: depense.description, 
    reference: depense.reference, 
    mode_paiement: depense.mode_paiement 
  };
  showModal.value = true;
};

const handleStore = async () => {
  loadingAction.value = true;
  try {
    if (isEdit.value) {
      await depenseStore.updateDepense(editId.value, form.value);
    } else {
      await depenseStore.storeDepense(form.value);
    }
    showModal.value = false;
    $swal.fire({ icon: 'success', title: isEdit.value ? 'Mise à jour réussie' : 'Enregistré', timer: 1500, showConfirmButton: false });
    depenseStore.fetchStats();
  } catch (error) {
    $swal.fire('Erreur', error.response?.data?.message || 'Une erreur est survenue.', 'error');
  } finally { loadingAction.value = false; }
};

const confirmDelete = (id) => {
  $swal.fire({
    title: 'Supprimer ?',
    text: "Cette action est irréversible.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await depenseStore.deleteDepense(id);
        depenseStore.fetchStats();
      } catch (error) { $swal.fire('Erreur', 'Impossible de supprimer.', 'error'); }
    }
  });
};

onMounted(() => {
  depenseStore.fetchDepenses();
  depenseStore.fetchStats();
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 p-4 md:p-8 transition-all duration-500 font-sans relative overflow-hidden">
    
    <!-- Décorations d'arrière-plan -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/0 blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tl from-emerald-500/10 to-teal-500/0 blur-3xl pointer-events-none"></div>

    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 relative z-10">
      <div class="space-y-1">
        <h1 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 tracking-tighter uppercase drop-shadow-sm">
          Journal des Décaissements
        </h1>
        <p class="text-slate-500 dark:text-gray-400 font-semibold text-sm flex items-center gap-2">
          <span class="w-2.5 h-2.5 bg-gradient-to-tr from-rose-600 to-orange-500 rounded-full shadow-[0_0_10px_rgba(225,29,72,0.5)] animate-pulse"></span>
          Pilotage et suivi des flux sortants
        </p>
      </div>

      <div class="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 dark:border-gray-700/50">
        <button
          @click="depenseStore.fetchDepenses"
          class="p-3 bg-gradient-to-b from-white to-slate-50 dark:from-gray-700 dark:to-gray-800 hover:from-slate-50 hover:to-slate-100 rounded-xl transition-all shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_4px_rgba(0,0,0,0.05)] border border-slate-200/60 dark:border-gray-600 text-slate-600 dark:text-gray-200"
        >
          <svg class="w-5 h-5 drop-shadow-sm" :class="{ 'animate-spin': depenseStore.loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        <button
          @click="openAddModal"
          class="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Saisir une dépense
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total décaissements</p>
            <p class="text-2xl font-black text-gray-900 dark:text-white tabular-nums">{{ formatMontant(depenseStore.totalDepenses) }}</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center shadow-inner">
            <svg class="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Opérations</p>
            <p class="text-2xl font-black text-gray-900 dark:text-white">{{ depenseStore.depenses.length }}</p>
            <p class="text-[10px] text-indigo-500 mt-1 font-semibold" v-if="depenseStore.depenses[0]">Dernière : {{ formatDate(depenseStore.depenses[0].date_depense) }}</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center shadow-inner">
            <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pôle Majoritaire</p>
            <p class="text-xl font-black text-gray-900 dark:text-white truncate max-w-[200px]">{{ depenseStore.stats[0]?.categorie || 'Non classé' }}</p>
            <p class="text-[10px] text-emerald-500 mt-1 font-bold">{{ formatMontant(depenseStore.stats[0]?.total || 0) }} cumulés</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shadow-inner">
            <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div class="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/50">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="relative flex-1 group">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher par libellé ou référence..."
              class="w-full px-5 py-3 pl-12 rounded-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm shadow-sm"
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div class="flex flex-wrap gap-3">
            <select v-model="filters.categorie" class="px-5 py-3 rounded-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm transition-all cursor-pointer">
              <option value="">Tous les Pôles</option>
              <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
            </select>
            <select v-model="filters.mode_paiement" class="px-5 py-3 rounded-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm transition-all cursor-pointer">
              <option value="">Modes de règlement</option>
              <option v-for="m in modesPaiement" :key="m" :value="m">{{ m }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="p-0">
        <Vue3Datatable
          :columns="columns"
          :rows="filteredData"
          :loading="depenseStore.loading"
          skin="bh-table-striped bh-table-hover"
          :pageSize="pageSize"
          class="w-full bh-premium-grid"
        >
          <template #date_depense="data">
            <span class="text-xs font-bold text-gray-500 dark:text-gray-400 pl-4">{{ formatDate(data.value.date_depense) }}</span>
          </template>

          <template #titre="data">
            <div class="flex flex-col">
              <span class="font-bold text-gray-800 dark:text-white text-sm capitalize">{{ data.value.titre }}</span>
              <span class="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic" v-if="data.value.reference">#{{ data.value.reference }}</span>
            </div>
          </template>

          <template #montant="data">
            <span class="font-black text-gray-900 dark:text-white tabular-nums">{{ formatMontant(data.value.montant) }}</span>
          </template>

          <template #categorie="data">
            <span class="px-3 py-1 rounded-lg text-[10px] font-bold bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 border border-gray-100 dark:border-gray-600 uppercase tracking-tighter">
              {{ data.value.categorie }}
            </span>
          </template>

          <template #actions="data">
             <div class="flex items-center justify-center gap-1">
                <button
                    @click="openEditModal(data.value)"
                    class="p-2.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
                    title="Modifier l'écriture"
                >
                    <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button
                    @click="confirmDelete(data.value.id)"
                    class="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all"
                    title="Supprimer définitivement"
                >
                    <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
             </div>
          </template>
        </Vue3Datatable>
      </div>

      <div class="px-6 py-4 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Journal comptable synchronisé au flux réel</p>
          <div class="flex items-center gap-4">
              <span class="text-[10px] font-black text-gray-400">Affichage</span>
              <select v-model="pageSize" class="bg-transparent text-xs font-black text-indigo-600 outline-none">
                  <option :value="10">10 l./p.</option>
                  <option :value="25">25 l./p.</option>
                  <option :value="50">50 l./p.</option>
              </select>
          </div>
      </div>
    </div>

    <!-- REFONTE DE LA MODAL - Design Élégant & Premium -->
    <client-only>
      <Transition name="modal-bounce">
        <div v-if="showModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md">
          <div class="bg-white dark:bg-gray-800 w-full max-w-xl rounded-3xl shadow-[0_32px_120px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-white dark:border-gray-700 transition-all duration-300">
            <!-- Modal Header : Plus Épuré -->
            <div class="px-10 py-8 border-b border-gray-50 dark:border-gray-700/50 flex justify-between items-center bg-white dark:bg-gray-800">
              <div class="flex items-center gap-5">
                <div class="w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 dark:shadow-none transition-transform hover:scale-105 duration-300">
                  <svg v-if="isEdit" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-2xl font-black text-gray-900 dark:text-white tracking-tighter capitalize leading-none mb-1">
                    {{ isEdit ? 'Mise à jour' : 'Saisie comptable' }}
                  </h3>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Gestion des décaissements</p>
                </div>
              </div>
              <button @click="showModal = false" class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-900/40 text-gray-400 hover:text-rose-500 hover:rotate-90 transition-all duration-300">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <!-- Body avec Scroll Élégant -->
            <form @submit.prevent="handleStore" class="px-10 py-8 space-y-8 max-h-[65vh] overflow-y-auto custom-scrollbar bg-white dark:bg-gray-800">
              <div class="grid grid-cols-1 gap-y-8">
                <!-- Libellé -->
                <div class="space-y-3 group">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 group-focus-within:text-indigo-600 transition-colors">Libellé de l'opération</label>
                  <input v-model="form.titre" required type="text" placeholder="Désignation du décaissement..." 
                    class="w-full bg-gray-50 dark:bg-gray-900/40 border-2 border-transparent dark:border-gray-700/50 rounded-2xl px-6 py-4 text-sm font-bold text-gray-800 dark:text-white outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-500 transition-all placeholder:text-gray-300 shadow-sm">
                </div>

                <!-- Montant & Date -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div class="space-y-3 group">
                    <label class="text-[10px] font-black text-rose-400 uppercase tracking-widest pl-1">Montant Décaissé</label>
                    <div class="relative">
                        <input v-model="form.montant" required type="number" 
                          class="w-full bg-gray-50 dark:bg-gray-900/40 border-2 border-transparent dark:border-gray-700/50 rounded-2xl pl-6 pr-14 py-4 text-lg font-black text-indigo-600 dark:text-indigo-400 focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-500 outline-none transition-all shadow-sm">
                        <span class="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 uppercase">XOF</span>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Date d'engagement</label>
                    <input v-model="form.date_depense" required type="date" 
                      class="w-full bg-gray-50 dark:bg-gray-900/40 border-2 border-transparent dark:border-gray-700/50 rounded-2xl px-6 py-4 text-sm font-bold text-gray-800 dark:text-white outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-500 transition-all shadow-sm appearance-none">
                  </div>
                </div>

                <!-- Catégorie & Mode -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div class="space-y-3">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Pôle Analytique</label>
                    <div class="relative group">
                        <select v-model="form.categorie" required 
                            class="w-full bg-gray-50 dark:bg-gray-900/40 border-2 border-transparent dark:border-gray-700/50 rounded-2xl px-6 py-4 text-sm font-bold text-gray-800 dark:text-white outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-500 transition-all appearance-none cursor-pointer shadow-sm">
                            <option value="" disabled>Classifier...</option>
                            <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                        </select>
                        <svg class="w-4 h-4 text-gray-300 absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Mode de règlement</label>
                    <div class="relative group">
                        <select v-model="form.mode_paiement" required 
                            class="w-full bg-gray-50 dark:bg-gray-900/40 border-2 border-transparent dark:border-gray-700/50 rounded-2xl px-6 py-4 text-sm font-bold text-gray-800 dark:text-white outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-500 transition-all appearance-none cursor-pointer shadow-sm">
                            <option v-for="m in modesPaiement" :key="m" :value="m">{{ m }}</option>
                        </select>
                        <svg class="w-4 h-4 text-gray-300 absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <!-- Référence -->
                <div class="space-y-3 group">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Référence / Pièce jointe (N°)</label>
                  <input v-model="form.reference" type="text" placeholder="N° de chèque, virement, facture..." 
                    class="w-full bg-gray-50 dark:bg-gray-900/40 border-2 border-transparent dark:border-gray-700/50 rounded-2xl px-6 py-4 text-sm font-bold text-gray-800 dark:text-white outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-500 transition-all placeholder:text-gray-300 shadow-sm">
                </div>

                <!-- Description -->
                <div class="space-y-3 group">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Observations</label>
                  <textarea v-model="form.description" rows="3" placeholder="Notes complémentaires éventuelles..." 
                    class="w-full bg-gray-50 dark:bg-gray-900/40 border-2 border-transparent dark:border-gray-700/50 rounded-2xl px-6 py-4 text-sm font-bold text-gray-800 dark:text-white outline-none resize-none focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-500 transition-all placeholder:text-gray-300 shadow-sm custom-scrollbar"></textarea>
                </div>
              </div>
            </form>

            <!-- Sticky Footer : Élégant & Minimaliste -->
            <div class="px-10 py-8 border-t border-gray-50 dark:border-gray-700/50 bg-gray-50/20 dark:bg-gray-800/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <button @click="showModal = false" type="button" 
                  class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-gray-700 text-gray-400 dark:text-gray-400 font-black text-[10px] uppercase tracking-widest transition-all hover:bg-gray-50 hover:text-gray-600 dark:hover:text-white border border-gray-100 dark:border-gray-600">
                  Abandonner
                </button>
                <div class="flex items-center gap-4 w-full sm:w-auto">
                    <button type="button" @click="handleStore" :disabled="loadingAction"
                        class="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 dark:shadow-none hover:scale-105 active:scale-95 disabled:opacity-50 transition-all duration-300">
                      <svg v-if="loadingAction" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      {{ isEdit ? 'Appliquer les modifs' : 'Enregistrer le flux' }}
                    </button>
                </div>
            </div>
          </div>
        </div>
      </Transition>
    </client-only>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
* { font-family: 'Outfit', sans-serif; }

.no-scrollbar::-webkit-scrollbar { display: none; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { @apply bg-transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { @apply bg-gray-100 dark:bg-gray-700 rounded-full; }

/* Animation Entrée Modal */
.modal-bounce-enter-active { animation: modal-bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.modal-bounce-leave-active { transition: all 0.3s ease; }
.modal-bounce-leave-to { opacity: 0; transform: scale(0.9) translateY(20px); }

@keyframes modal-bounce-in {
  0% { opacity: 0; transform: scale(0.9) translateY(40px); }
  70% { transform: scale(1.02) translateY(-5px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Style Premium pour le tableau */
:deep(.bh-premium-grid) { border: none !important; }
:deep(.bh-premium-grid thead th) {
  @apply bg-gray-50 dark:bg-gray-800/80 p-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-none;
}
:deep(.bh-premium-grid tbody td) {
  @apply p-5 border-b border-gray-50 dark:border-gray-700/50 transition-all duration-300;
}
:deep(.bh-premium-grid tbody tr:hover) {
  @apply bg-indigo-50/30 dark:bg-indigo-900/10;
}
</style>
