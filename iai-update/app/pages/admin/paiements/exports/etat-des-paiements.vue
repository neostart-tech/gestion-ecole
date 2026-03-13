<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <!-- En-tête -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-blue-600 rounded-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Export des paiements</h1>
            <p class="text-gray-500 text-sm mt-1">Générez des rapports détaillés sur les paiements</p>
          </div>
        </div>

        <!-- Stats rapides -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-gray-200">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              <span class="text-sm text-gray-600">{{ etudiantStore.nombreEtudiant }} étudiants</span>
            </div>
            <div class="w-px h-4 bg-gray-200"></div>
            <span class="text-sm text-gray-600">{{ niveauStore.niveaux.length }} niveaux</span>
            <div class="w-px h-4 bg-gray-200"></div>
            <span class="text-sm text-gray-600">{{ filiereStore.filieres.length }} filières</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Grille principale -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Panneau de configuration -->
      <div class="lg:col-span-8 space-y-6">
        <!-- Carte principale -->
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <!-- Onglets -->
          <div class="border-b border-gray-200 bg-gray-50">
            <div class="flex p-1">
              <button
                v-for="type in exportTypes"
                :key="type.value"
                @click="exportStore.setExportType(type.value)"
                :class="[
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  exportStore.exportParams.type === type.value
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                ]"
              >
                <span class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="type.icon" />
                  </svg>
                  {{ type.label }}
                </span>
              </button>
            </div>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Colonne gauche : Sélection -->
              <div class="space-y-4">
                <h3 class="text-sm font-medium text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Critères de sélection
                </h3>

                <!-- Sélection niveau -->
                <div v-if="exportStore.exportParams.type === 'niveau'">
                  <label class="block text-sm text-gray-600 mb-1">Niveau <span class="text-red-400">*</span></label>
                  <Dropdown
                    v-model="exportStore.exportParams.id"
                    :options="niveauStore.niveaux"
                    optionLabel="libelle"
                    optionValue="id"
                    placeholder="Sélectionner un niveau..."
                    class="w-full"
                    :loading="niveauStore.isLoading"
                    filter
                    showClear
                  />
                </div>

                <!-- Sélection filière -->
                <div v-else-if="exportStore.exportParams.type === 'filiere'">
                  <label class="block text-sm text-gray-600 mb-1">Filière <span class="text-red-400">*</span></label>
                  <Dropdown
                    v-model="exportStore.exportParams.id"
                    :options="filiereStore.filieres"
                    optionLabel="nom"
                    optionValue="id"
                    placeholder="Sélectionner une filière..."
                    class="w-full"
                    :loading="filiereStore.isLoading"
                    filter
                    showClear
                  />
                </div>

                <!-- Sélection étudiant -->
                <div v-else-if="exportStore.exportParams.type === 'etudiant'">
                  <label class="block text-sm text-gray-600 mb-1">Étudiant <span class="text-red-400">*</span></label>
                  <Dropdown
                    v-model="exportStore.exportParams.id"
                    :options="etudiantStore.etudiants"
                    optionLabel="nom_complet"
                    optionValue="id"
                    placeholder="Choisir un étudiant..."
                    class="w-full"
                    :loading="etudiantStore.isLoading"
                    filter
                    filterPlaceholder="Rechercher un étudiant..."
                    showClear
                  >
                    <template #value="slotProps">
                      <div v-if="slotProps.value" class="flex items-center gap-2">
                        <Avatar :label="getInitialsFromId(slotProps.value)" size="normal" shape="circle" class="bg-blue-500 text-white" />
                        <div>
                          <div class="text-sm font-medium">{{ getEtudiantName(slotProps.value) }}</div>
                          <div class="text-xs text-gray-500">{{ getEtudiantMatricule(slotProps.value) }}</div>
                        </div>
                      </div>
                    </template>
                  </Dropdown>
                </div>

                <!-- Export global -->
                <div v-else class="p-4 bg-blue-50 rounded-lg">
                  <p class="text-sm font-medium text-blue-800">Export global</p>
                  <p class="text-xs text-blue-600">Tous les étudiants seront inclus</p>
                </div>
              </div>

              <!-- Colonne droite : Période -->
              <div class="space-y-4">
                <h3 class="text-sm font-medium text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Période (optionnel)
                </h3>

                <div class="space-y-3">
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Date début</label>
                    <Calendar v-model="periodeDebut" dateFormat="dd/mm/yy" placeholder="jj/mm/aaaa" class="w-full" :showIcon="true" />
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Date fin</label>
                    <Calendar v-model="periodeFin" dateFormat="dd/mm/yy" placeholder="jj/mm/aaaa" class="w-full" :minDate="periodeDebut" :showIcon="true" />
                  </div>
                </div>

                <!-- Aperçu des filtres -->
                <div v-if="exportStore.isValidExport" class="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center gap-2 text-xs text-gray-600">
                    <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Prêt à exporter</span>
                  </div>
                  <div class="mt-2 text-xs text-gray-500">
                    <div class="flex justify-between">
                      <span>Type :</span>
                      <span class="font-medium text-gray-700">{{ exportStore.exportTypeLabel }}</span>
                    </div>
                    <div v-if="exportStore.selectedItemName" class="flex justify-between mt-1">
                      <span>Sélection :</span>
                      <span class="font-medium text-blue-600">{{ exportStore.selectedItemName }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Boutons d'export -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="grid grid-cols-2 gap-4">
                <!-- Bouton Excel -->
                <button
                  @click="handleExport('excel')"
                  :disabled="!exportStore.isValidExport || exportStore.isExporting"
                  class="px-6 py-3 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg v-if="!exportStore.isExporting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ exportStore.isExporting ? "Export en cours..." : "Exporter en Excel" }}</span>
                </button>

                <!-- Bouton PDF -->
                <button
                  @click="handleExport('pdf')"
                  :disabled="!exportStore.isValidExport || isPdfGenerating"
                  class="px-6 py-3 bg-red-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg v-if="!isPdfGenerating" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ isPdfGenerating ? "Génération PDF..." : "Exporter en PDF" }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panneau latéral -->
      <div class="lg:col-span-4 space-y-6">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Contenu du rapport
          </h3>

          <div class="space-y-2">
            <div class="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-sm text-gray-600">Montant initial par étudiant</span>
            </div>
            <div class="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-sm text-gray-600">Montant après bourse</span>
            </div>
            <div class="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-sm text-gray-600">Total payé / Reste à payer</span>
            </div>
            <div class="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-sm text-gray-600">Statut (soldé/en cours/retard)</span>
            </div>
            <div class="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-sm text-gray-600">Ligne de totaux généraux</span>
            </div>
          </div>

          <div class="mt-4 p-3 bg-blue-50 rounded-lg">
            <p class="text-xs text-blue-700">
              <span class="font-medium">Excel :</span> Fichier .xlsx avec coloration automatique<br>
              <span class="font-medium">PDF :</span> Format paysage avec tableau détaillé
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Composant PDF caché -->
    <div style="position: absolute; left: -9999px; top: -9999px; width: 1200px;">
      <ExportPaiementPDF
        v-if="pdfData.etudiants.length > 0"
        ref="pdfContentRef"
        :etudiants="pdfData.etudiants"
        :totaux="pdfData.totaux"
        :type="exportStore.exportParams.type"
        :selected-item-name="exportStore.selectedItemName"
        :periode-debut="exportStore.exportParams.periode_debut"
        :periode-fin="exportStore.exportParams.periode_fin"
      />
    </div>

    <Toast position="top-right" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { useToast } from "primevue/usetoast";
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";
import Avatar from "primevue/avatar";
import Toast from "primevue/toast";
import { useExportPaiementStore } from "~~/stores/export-paiement";
import { useEtudiantStore } from "~~/stores/etudiant";
import { useNiveauStore } from "~~/stores/niveau";
import { useFiliereStore } from "~~/stores/filiere";
import ExportPaiementPDF from "~/components/ExportPaiementPDF.vue";
import { useHtml2Pdf } from "~/composables/useHtml2Pdf";
import config from "~~/config";

const toast = useToast();
const exportStore = useExportPaiementStore();
const etudiantStore = useEtudiantStore();
const niveauStore = useNiveauStore();
const filiereStore = useFiliereStore();
const app_url=config.app_local ? config.app_dev_storage_url : config.app_prod_url;

// États
const periodeDebut = ref(null);
const periodeFin = ref(null);
const pdfContentRef = ref(null);
const { isGenerating: isPdfGenerating, generatePDF } = useHtml2Pdf();

// Types d'export
const exportTypes = [
  { value: "global", label: "Global", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
  { value: "niveau", label: "Par niveau", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { value: "filiere", label: "Par filière", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { value: "etudiant", label: "Étudiant", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }
];

// Données PDF
const pdfData = ref({
  etudiants: [],
  totaux: { montant_initial: 0, montant_apres_bourse: 0, total_paye: 0, reste_a_payer: 0 }
});

// Watch période
watch([periodeDebut, periodeFin], () => {
  exportStore.setPeriode(
    periodeDebut.value ? formatDateForAPI(periodeDebut.value) : null,
    periodeFin.value ? formatDateForAPI(periodeFin.value) : null
  );
});

// Initialisation
onMounted(async () => {
  await Promise.all([
    etudiantStore.fetchEtudiants(),
    niveauStore.fetchNiveaux(),
    filiereStore.fetchFilieres()
  ]);
});

// Utilitaires
const getInitialsFromId = (id) => {
  const etudiant = etudiantStore.etudiants.find(e => e.id === id);
  return etudiant ? (etudiant.nom[0] + etudiant.prenom[0]).toUpperCase() : "?";
};

const getEtudiantName = (id) => {
  const etudiant = etudiantStore.etudiants.find(e => e.id === id);
  return etudiant ? `${etudiant.nom} ${etudiant.prenom}` : "";
};

const getEtudiantMatricule = (id) => {
  const etudiant = etudiantStore.etudiants.find(e => e.id === id);
  return etudiant?.matricule || "";
};

const formatDateForAPI = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split('T')[0];
};

// Génération PDF
const generatePDFFromData = async () => {
  try {
    if (!exportStore.isValidExport) {
      toast.add({ severity: "warn", summary: "Attention", detail: "Veuillez sélectionner les critères d'export", life: 3000 });
      return;
    }

    // Récupérer les données depuis l'API Laravel directement
    const token = localStorage.getItem("gest-ecole-token");
    const response = await fetch(`${app_url}/api/paiements/exports/paiements-data`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(exportStore.exportParams)
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (!data.etudiants || data.etudiants.length === 0) {
      toast.add({ severity: "warn", summary: "Attention", detail: "Aucune donnée à exporter", life: 3000 });
      return;
    }

    pdfData.value = {
      etudiants: data.etudiants,
      totaux: data.totaux
    };

    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!pdfContentRef.value) {
      throw new Error("Référence PDF non trouvée");
    }

    const pdfElement = pdfContentRef.value.$el || pdfContentRef.value;
    const filename = exportStore.generateFilename().replace('.xlsx', '.pdf');

    await generatePDF(pdfElement, {
      filename: filename,
      margin: [0.3, 0.3, 0.3, 0.3],
      html2canvas: { scale: 2, logging: false, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    });

    toast.add({ severity: "success", summary: "Succès", detail: "PDF généré avec succès", life: 3000 });

  } catch (error) {
    console.error('Erreur:', error);
    toast.add({ severity: "error", summary: "Erreur", detail: error.message || "Erreur de génération", life: 5000 });
  }
};

// Export handler
const handleExport = async (format) => {
  if (format === 'pdf') {
    await generatePDFFromData();
  } else {
    try {
      await exportStore.exportPaiements();
      toast.add({ severity: "success", summary: "Succès", detail: "Export Excel lancé", life: 3000 });
    } catch (error) {
      toast.add({ severity: "error", summary: "Erreur", detail: error.message, life: 5000 });
    }
  }
};
</script>

<style>
/* Styles supplémentaires si nécessaires */
</style>