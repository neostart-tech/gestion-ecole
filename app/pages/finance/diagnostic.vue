<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 p-4 md:p-8 transition-all duration-500 font-sans relative overflow-hidden">
    
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-rose-500/20 to-orange-500/0 blur-3xl pointer-events-none"></div>

    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 relative z-10">
      <div class="space-y-1">
        <h1 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 tracking-tighter uppercase drop-shadow-sm">
          Diagnostic Financier
        </h1>
        <p class="text-slate-500 dark:text-gray-400 font-semibold text-sm flex items-center gap-2">
          <span class="w-2.5 h-2.5 bg-gradient-to-tr from-rose-600 to-orange-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)] animate-pulse"></span>
          Détection d'anomalies entre la scolarité académique et le contrat financier
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button @click="loadDiagnostic" class="px-6 py-2.5 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 rounded-xl transition-all shadow-sm border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-200 font-bold text-sm flex items-center gap-2">
          <svg class="w-4 h-4" :class="{'animate-spin': loading}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Actualiser l'audit
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !result" class="flex items-center justify-center py-20 relative z-10">
      <div class="flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-slate-500 font-medium animate-pulse">Analyse comptable en cours...</p>
      </div>
    </div>

    <!-- Data Loaded -->
    <div v-else-if="result" class="space-y-8 relative z-10">
      
      <!-- KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
            <div class="absolute left-0 top-0 h-full w-1 bg-indigo-500 rounded-l-2xl"></div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Académique (Attendu)</p>
            <p class="text-2xl font-black text-slate-800 dark:text-white tabular-nums">{{ formatMontant(result.total_sit) }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
            <div class="absolute left-0 top-0 h-full w-1 bg-emerald-500 rounded-l-2xl"></div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Contrats (Actuel)</p>
            <p class="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{{ formatMontant(result.total_dash) }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
            <div class="absolute left-0 top-0 h-full w-1" :class="result.ecart_total !== 0 ? 'bg-amber-500' : 'bg-slate-300'"></div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Écart Financier Global</p>
            <p class="text-2xl font-black tabular-nums" :class="result.ecart_total !== 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400'">{{ formatMontant(result.ecart_total) }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
            <div class="absolute left-0 top-0 h-full w-1" :class="result.nb_differences > 0 ? 'bg-rose-500' : 'bg-emerald-500'"></div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Anomalies Détectées</p>
            <p class="text-2xl font-black tabular-nums" :class="result.nb_differences > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'">{{ result.nb_differences }} étudiant(s)</p>
        </div>
      </div>

      <!-- Table Anomalies -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 overflow-hidden shadow-sm">
        <div class="p-6 border-b border-slate-50 dark:border-gray-700 flex justify-between items-center bg-slate-50/50 dark:bg-gray-800/50">
            <h3 class="text-lg font-black text-slate-800 dark:text-white">Liste des incohérences à régulariser</h3>
            <span class="px-3 py-1 bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 rounded-full text-xs font-bold">{{ result.nb_differences }} erreurs</span>
        </div>
        
        <div v-if="result.nb_differences === 0" class="p-12 text-center text-slate-500 dark:text-gray-400 flex flex-col items-center">
            <svg class="w-16 h-16 text-emerald-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p class="text-lg font-bold">Parfait !</p>
            <p class="text-sm">Aucune anomalie détectée entre les profils académiques et les contrats financiers.</p>
        </div>

        <div v-else class="p-0">
          <div class="px-6 py-4 border-b border-slate-50 dark:border-gray-700 flex justify-end">
             <input v-model="search" type="text" placeholder="Rechercher un étudiant..." class="px-4 py-2 border border-slate-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full max-w-xs shadow-sm" />
          </div>
          <vue3-datatable
            :rows="result.details"
            :columns="cols"
            :search="search"
            :sortable="true"
            skin="bh-table-hover"
            class="w-full text-sm"
          >
            <!-- Custom columns -->
            <template #nom="data">
              <div>
                <span class="font-bold text-slate-800 dark:text-white block">{{ data.value.nom }}</span>
                <span v-if="data.value.niveau" class="text-xs text-slate-400">{{ data.value.niveau }}</span>
              </div>
            </template>

            <template #mode_formation="data">
              <div class="flex items-center gap-2">
                <span 
                  class="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1"
                  :class="data.value.mode_formation === 'En ligne' 
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  {{ data.value.mode_formation || 'Présentiel' }}
                </span>
                <button 
                  @click="openChangeModeModal(data.value)"
                  title="Changer le mode de formation"
                  class="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                  </svg>
                </button>
              </div>
            </template>

            <template #sit="data">
              <div class="text-right font-semibold text-slate-600 dark:text-gray-300 tabular-nums">
                {{ formatMontant(data.value.sit) }}
              </div>
            </template>
            <template #dash="data">
              <div class="text-right font-semibold text-slate-600 dark:text-gray-300 tabular-nums">
                {{ formatMontant(data.value.dash) }}
              </div>
            </template>
            <template #diff="data">
              <div class="text-right font-black text-rose-600 dark:text-rose-400 tabular-nums">
                {{ data.value.diff > 0 ? '+' : '' }}{{ formatMontant(data.value.diff) }}
              </div>
            </template>
            <template #actions="data">
              <div class="text-center flex justify-center items-center gap-2">
                <button 
                  @click="openChangeModeModal(data.value)" 
                  class="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50 rounded-xl text-xs font-bold transition-all border border-amber-200 dark:border-amber-800 shadow-sm"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                  Changer Mode
                </button>
                <NuxtLink :to="`/finance/recouvrement/${data.value.slug}`" class="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 rounded-xl text-xs font-bold transition-all">
                    Régulariser
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </NuxtLink>
              </div>
            </template>
          </vue3-datatable>
        </div>
      </div>
    </div>

    <!-- Modal Changer Mode de Formation -->
    <div v-if="showModeModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 dark:border-gray-700 space-y-6 animate-scale-up">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-gray-700 pb-4">
          <div>
            <h3 class="text-lg font-black text-slate-800 dark:text-white">Changement Rapide du Mode</h3>
            <p class="text-xs text-slate-500 dark:text-gray-400 font-medium">{{ selectedEtudiant?.nom }}</p>
          </div>
          <button @click="showModeModal = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="space-y-4">
          <p class="text-sm text-slate-600 dark:text-gray-300">
            Sélectionnez le nouveau mode de formation. Les tarifs et frais de scolarité seront <span class="font-bold text-indigo-600 dark:text-indigo-400">recalculés automatiquement</span> pour cet étudiant.
          </p>

          <div class="space-y-2">
            <label v-for="mode in modesDisponibles" :key="mode" 
              class="flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all"
              :class="selectedMode === mode 
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20' 
                : 'border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700/50 text-slate-700 dark:text-gray-300'"
            >
              <div class="flex items-center gap-3">
                <input type="radio" v-model="selectedMode" :value="mode" class="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                <span class="font-bold text-sm">{{ mode }}</span>
              </div>
              <span v-if="selectedEtudiant?.mode_formation === mode" class="text-xs font-semibold px-2 py-0.5 bg-slate-200 dark:bg-gray-700 text-slate-600 dark:text-gray-300 rounded-md">Actuel</span>
            </label>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <button @click="showModeModal = false" class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 text-sm font-bold hover:bg-slate-100 dark:hover:bg-gray-700 transition-all">
            Annuler
          </button>
          <button 
            @click="submitChangeMode" 
            :disabled="savingMode || selectedMode === selectedEtudiant?.mode_formation"
            class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="savingMode" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Enregistrer & Recalculer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useNuxtApp } from '#app';
import { useDiagnosticFinancierStore } from '~~/stores/diagnosticFinancier';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import '@bhplugin/vue3-datatable/dist/style.css';

const cols = [
  { field: 'nom', title: 'Étudiant' },
  { field: 'mode_formation', title: 'Mode Formation' },
  { field: 'sit', title: 'Tarif Académique (Attendu)', headerClass: 'justify-end' },
  { field: 'dash', title: 'Contrat Actuel (Facturé)', headerClass: 'justify-end' },
  { field: 'diff', title: 'Écart (Différence)', headerClass: 'justify-end' },
  { field: 'actions', title: 'Actions', sort: false, headerClass: 'justify-center' }
];

const search = ref('');

// Modal & Quick Change State
const showModeModal = ref(false);
const selectedEtudiant = ref(null);
const selectedMode = ref('Présentiel');
const savingMode = ref(false);
const modesDisponibles = ['Présentiel', 'En ligne'];

const diagnosticStore = useDiagnosticFinancierStore();
const { $toast } = useNuxtApp();

const loading = computed(() => diagnosticStore.loading);
const result = computed(() => diagnosticStore.result);

const loadDiagnostic = async () => {
  try {
    await diagnosticStore.fetchDiagnostic();
  } catch (error) {
    console.error("Erreur chargement diagnostic:", error);
  }
};

const openChangeModeModal = (etudiant) => {
  selectedEtudiant.value = etudiant;
  selectedMode.value = etudiant.mode_formation || 'Présentiel';
  showModeModal.value = true;
};

const submitChangeMode = async () => {
  if (!selectedEtudiant.value) return;
  savingMode.value = true;
  try {
    const res = await diagnosticStore.changerModeFormation(
      selectedEtudiant.value.id,
      selectedMode.value
    );
    if ($toast?.success) {
      $toast.success(res.message || "Mode de formation mis à jour avec succès !");
    } else {
      alert(res.message || "Mode de formation mis à jour avec succès !");
    }
    showModeModal.value = false;
  } catch (error) {
    console.error("Erreur lors de la modification du mode:", error);
    const msg = error.response?.data?.message || "Échec de la modification du mode.";
    if ($toast?.error) {
      $toast.error(msg);
    } else {
      alert(msg);
    }
  } finally {
    savingMode.value = false;
  }
};

const formatMontant = (m) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 })
    .format(m).replace('XOF', 'FCFA');

onMounted(() => {
  loadDiagnostic();
});
</script>
