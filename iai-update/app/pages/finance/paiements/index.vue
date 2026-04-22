<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 p-4 md:p-8 transition-all duration-500 font-sans relative overflow-hidden">
    
    <!-- Décorations d'arrière-plan -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/0 blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tl from-emerald-500/10 to-teal-500/0 blur-3xl pointer-events-none"></div>

    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 relative z-10">
      <div class="space-y-1">
        <h1 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 tracking-tighter uppercase drop-shadow-sm">
          Paiements Étudiants
        </h1>
        <p class="text-slate-500 dark:text-gray-400 font-semibold text-sm flex items-center gap-2">
          <span class="w-2.5 h-2.5 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)] animate-pulse"></span>
          Gestion des transactions et encaissements
        </p>
      </div>

      <div class="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 dark:border-gray-700/50">
        <button
          @click="openAddModal"
          class="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Ajouter un paiement
        </button>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-5 mb-6 border border-white/50 dark:border-gray-700/50 shadow-sm relative z-10">
      <div class="relative max-w-md group">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un étudiant ou une transaction..."
          class="w-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white dark:placeholder-gray-500"
        />
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
    </div>

    <!-- Main Table -->
    <div class="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-xl relative z-10 transition-colors">
      <Vue3Datatable
        :columns="columns"
        :rows="paiements"
        :search="searchQuery"
        skin="bh-table-striped"
        class="premium-table"
      >
        <template #etudiant="{ value }">
          <div class="flex items-center gap-3 py-1 pl-4">
            <div class="w-8 h-8 flex-shrink-0 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase">
              {{ value.etudiant.charAt(0) }}
            </div>
            <span class="font-bold text-sm text-slate-800 dark:text-gray-200">{{ value.etudiant }}</span>
          </div>
        </template>
        <template #mode="{ value }">
          <span class="px-2 py-1 bg-slate-100 dark:bg-gray-700 rounded text-[10px] font-black uppercase text-slate-500 dark:text-gray-400 tracking-wider">
            {{ value.mode }}
          </span>
        </template>
        <template #action="{ value }">
          <div class="flex gap-1 justify-center">
            <button
              @click="openEditModal(value)"
              class="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="deletePayment(value.id)"
              class="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </template>
      </Vue3Datatable>
    </div>

    <!-- Modal d'ajout/édition -->
    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" class="relative z-[60]" @close="closeModal">
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-md" />
        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel class="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-white/50 dark:border-gray-700 relative transform transition-all duration-300">
            <!-- Modal Header -->
            <div class="px-8 py-6 border-b border-slate-50 dark:border-gray-700/50 flex justify-between items-center">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <DialogTitle class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-1">
                    {{ modalTitle }}
                  </DialogTitle>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saisie de transaction</p>
                </div>
              </div>
              <button @click="closeModal" class="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <!-- Modal Body -->
            <form @submit.prevent="savePayment" class="p-8 space-y-6">
              <div class="grid grid-cols-1 gap-6">
                <div class="space-y-2 group">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Étudiant concerné</label>
                  <select v-model="form.etudiant" required class="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                    <option v-for="e in etudiants" :key="e.id" :value="e.nom">{{ e.nom }}</option>
                  </select>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Mode de paiement</label>
                    <select v-model="form.mode" class="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                      <option value="especes">Espèces</option>
                      <option value="banque">Banque</option>
                    </select>
                  </div>
                  <div class="space-y-2" v-if="form.mode === 'banque'">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nom de la banque</label>
                    <input v-model="form.banque" type="text" placeholder="Ex: UBA, ECOBANK..." class="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                </div>

                <div v-if="form.mode === 'banque'" class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Numéro du reçu</label>
                    <input v-model="form.numero_recu" type="text" placeholder="REF-0000" class="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Date effective</label>
                    <input v-model="form.date_paiement" type="date" class="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="flex justify-end gap-3 pt-4 border-t border-slate-50 dark:border-gray-700/50">
                <button type="button" @click="closeModal" class="px-6 py-3 rounded-xl bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-slate-300 font-black text-[10px] uppercase tracking-widest transition-all hover:bg-slate-200">Annuler</button>
                <button type="submit" class="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-200 dark:shadow-none hover:scale-105 active:scale-95 transition-all">
                  {{ form.id ? 'Appliquer les modifications' : 'Enregistrer le paiement' }}
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
import { ref, computed } from "vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import { Dialog, DialogPanel, DialogTitle, TransitionRoot } from "@headlessui/vue";

// Simulation des étudiants
const etudiants = ref([
  { id: 1, nom: "Alice" },
  { id: 2, nom: "Bob" },
  { id: 3, nom: "Charlie" },
]);

// Paiements par défaut (simulation)
const paiements = ref([
  { id: 1, etudiant: "Alice", mode: "especes", banque: "--", numero_recu: "--", date_paiement: "2026-04-10" },
  { id: 2, etudiant: "Bob", mode: "banque", banque: "UBA", numero_recu: "12345", date_paiement: "2026-02-19" },
]);

const searchQuery = ref("");
const showModal = ref(false);
const modalTitle = ref("Ajouter un paiement");
const form = ref({ id: null, etudiant: "", mode: "especes", banque: "", numero_recu: "", date_paiement: new Date().toISOString().split('T')[0] });

const columns = [
  { field: "etudiant", title: "Étudiant", width: "250px" },
  { field: "mode", title: "Type" },
  { field: "banque", title: "Banque" },
  { field: "numero_recu", title: "Réf. Reçu" },
  { field: "date_paiement", title: "Date" },
  { field: "action", title: "Actions", width: "100px", sort: false, cellClass: "text-center" },
];

const openAddModal = () => {
  modalTitle.value = "Nouveau paiement";
  form.value = { id: null, etudiant: "", mode: "especes", banque: "", numero_recu: "", date_paiement: new Date().toISOString().split('T')[0] };
  showModal.value = true;
};

const openEditModal = (p) => {
  modalTitle.value = "Modifier le paiement";
  form.value = { ...p };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const savePayment = () => {
  if(form.value.id) {
    const index = paiements.value.findIndex(p => p.id === form.value.id);
    if(index !== -1) paiements.value[index] = { ...form.value };
  } else {
    form.value.id = paiements.value.length + 1;
    paiements.value.push({ ...form.value });
  }
  closeModal();
};

const deletePayment = (id) => {
  if(confirm("Voulez-vous supprimer ce paiement ?")) {
    paiements.value = paiements.value.filter(p => p.id !== id);
  }
};
</script>

<style scoped>
.premium-table :deep(.bh-datatable table tbody tr) {
  border-bottom: 1px solid #f1f5f9;
}
.dark .premium-table :deep(.bh-datatable table tbody tr) {
  border-bottom-color: #1f2937;
  color: #e2e8f0;
}
.premium-table :deep(.bh-datatable table tbody tr:hover) {
  background-color: rgba(248, 250, 252, 0.8);
}
.dark .premium-table :deep(.bh-datatable table tbody tr:hover) {
  background-color: rgba(31, 41, 55, 0.4);
}
.premium-table :deep(.bh-datatable thead th) {
  background-color: transparent !important;
  color: #94a3b8 !important;
  font-weight: 700 !important;
  text-transform: uppercase;
  font-size: 0.65rem !important;
  letter-spacing: 0.05em;
  padding: 1rem !important;
  border-bottom: 1px solid #e2e8f0 !important;
}
.dark .premium-table :deep(.bh-datatable thead th) {
  color: #6b7280 !important;
  border-bottom-color: #374151 !important;
}
.premium-table :deep(.bh-datatable table td) {
  padding: 0.8rem 1rem;
}
</style>
