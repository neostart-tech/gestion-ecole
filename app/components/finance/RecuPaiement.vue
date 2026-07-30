<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="closeModal">
      <div class="fixed inset-0 bg-black/60" />

      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel class="w-full max-w-4xl rounded-xl bg-white dark:bg-gray-800 p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
          <DialogTitle class="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Reçu de paiement</span>
            </div>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </DialogTitle>

          <div v-if="etudiant" class="space-y-4">
            <!-- Contenu du reçu -->
            <div ref="recuContent" class="bg-white relative overflow-hidden" style="font-family: Arial, sans-serif; color: #1e293b; padding: 40px 40px 60px 40px; border-bottom: 12px solid #4f46e5;">
              
              <!-- Filigrane (Watermark) -->
              <div v-if="appLogo" class="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none" style="opacity: 0.05;">
                <img :src="appLogo" style="width: 350px; height: auto; object-fit: contain;" />
              </div>

              <!-- Contenu principal (sur le filigrane) -->
              <div class="relative z-10">
                
                <!-- En-tête -->
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                  <!-- Logo gauche -->
                  <div style="width: 140px;">
                    <img v-if="appLogo" :src="appLogo" style="width: 100%; height: auto; object-fit: contain;" />
                  </div>
                  
                  <!-- Infos école au centre -->
                  <div style="flex: 1; text-align: center; padding: 0 20px;">
                    <h1 style="font-size: 32px; font-weight: 900; color: #4f46e5; text-transform: uppercase; margin: 0; letter-spacing: 1px;">{{ appName }}</h1>
                    <p style="font-size: 14px; font-weight: 700; color: #4f46e5; margin: 8px 0 0 0; text-transform: uppercase;">Établissement d'Enseignement Supérieur</p>
                    <p style="font-size: 12px; color: #4f46e5; margin: 4px 0 0 0;">Document Administratif et Financier</p>
                  </div>

                  <!-- Espace vide à droite pour symétrie -->
                  <div style="width: 140px;"></div>
                </div>

                <!-- Titre RECU et DATE -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; margin-bottom: 30px;">
                  <h2 style="font-size: 26px; font-weight: 900; color: #4f46e5; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Reçu Officiel</h2>
                  
                  <div style="text-align: right;">
                    <div style="display: flex; align-items: baseline; gap: 10px; font-size: 15px; font-weight: 700; color: #4f46e5;">
                      <span>Date :</span>
                      <span style="border-bottom: 2px dotted #cbd5e1; width: 140px; text-align: center; color: #1e293b; padding-bottom: 2px;">{{ formatDate(operation?.date || new Date()) }}</span>
                    </div>
                    <div style="margin-top: 8px; font-size: 13px; color: #64748b; font-weight: 600;">
                      RÉF: {{ operation?.reference || 'N/A' }}
                    </div>
                  </div>
                </div>

                <!-- Lignes de texte à trous (Dotted lines) -->
                <div style="font-size: 16px; font-weight: 700; color: #4f46e5; line-height: 1.5;">
                  
                  <!-- Reçu de -->
                  <div style="display: flex; align-items: flex-end; margin-bottom: 25px;">
                    <span style="white-space: nowrap; margin-right: 15px;">Reçu de :</span>
                    <span style="flex: 1; border-bottom: 2px dotted #cbd5e1; color: #1e293b; padding: 0 10px 4px 10px; font-size: 18px;">{{ etudiant?.nom_complet }} (Matricule: {{ etudiant?.matricule }})</span>
                  </div>

                  <!-- La somme de -->
                  <div style="display: flex; align-items: flex-end; margin-bottom: 25px;">
                    <span style="white-space: nowrap; margin-right: 15px;">La somme de :</span>
                    <span style="flex: 1; border-bottom: 2px dotted #cbd5e1; color: #1e293b; padding: 0 10px 4px 10px; font-size: 18px;">
                      {{ formatMontantShort(operation?.montant) }} FCFA
                    </span>
                  </div>
                  
                  <!-- Pour -->
                  <div style="display: flex; align-items: flex-end; margin-bottom: 25px;">
                    <span style="white-space: nowrap; margin-right: 15px;">Pour (Motif) :</span>
                    <span style="flex: 1; border-bottom: 2px dotted #cbd5e1; color: #1e293b; padding: 0 10px 4px 10px; font-size: 18px;">{{ operation?.description || 'Frais de scolarité' }} - {{ etudiant?.filiere }}</span>
                  </div>
                  
                  <div style="display: flex; align-items: flex-end; margin-bottom: 35px;">
                    <span style="flex: 1; border-bottom: 2px dotted #cbd5e1; color: #1e293b; padding: 0 10px 4px 10px; min-height: 28px;"></span>
                  </div>

                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px;">
                  
                  <!-- Mode de paiement & Encadré Montant -->
                  <div style="display: flex; flex-direction: column; gap: 20px;">
                    <!-- Checkboxes -->
                    <div style="display: flex; gap: 20px; font-weight: 700; color: #4f46e5; font-size: 15px;">
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 20px; height: 20px; border: 2px solid #4f46e5; border-radius: 4px; display: flex; align-items: center; justify-content: center; padding: 2px;">
                          <div v-if="isCash" style="width: 100%; height: 100%; background-color: #4f46e5; border-radius: 2px;"></div>
                        </div> Espèces
                      </div>
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 20px; height: 20px; border: 2px solid #4f46e5; border-radius: 4px; display: flex; align-items: center; justify-content: center; padding: 2px;">
                          <div v-if="isBank" style="width: 100%; height: 100%; background-color: #4f46e5; border-radius: 2px;"></div>
                        </div> Chèque/Banque
                      </div>
                    </div>
                    
                    <!-- Gros cadre montant -->
                    <div style="display: inline-flex; align-items: center; justify-content: center; padding: 12px 30px; border: 2px solid #4f46e5; border-radius: 12px; min-width: 200px;">
                      <span style="font-size: 24px; font-weight: 900; color: #1e293b;">{{ formatMontantShort(operation?.montant) }}</span>
                      <span style="margin-left: 10px; font-size: 18px; font-weight: 900; color: #4f46e5;">FCFA</span>
                    </div>
                  </div>

                  <!-- Balance & Signature -->
                  <div style="width: 300px; font-weight: 700; color: #4f46e5; font-size: 15px;">
                    <div v-if="!isFraisInscription" style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 30px;">
                      <span style="white-space: nowrap;">Reste à payer :</span>
                      <span style="border-bottom: 2px dotted #cbd5e1; flex: 1; margin-left: 10px; text-align: right; color: #1e293b; padding-bottom: 2px; font-size: 18px;">{{ formatMontantShort(etudiant.reste) }} FCFA</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
                      <span style="white-space: nowrap;">Signature :</span>
                      <span style="border-bottom: 2px dotted #cbd5e1; flex: 1; margin-left: 10px; height: 30px; display: inline-block;"></span>
                    </div>
                  </div>

                </div>
                
                <!-- Spacer pour html2canvas afin d'éviter la coupure du texte en bas -->
                <div style="height: 40px; width: 100%;"></div>

              </div>
            </div>

            <!-- Boutons d'action -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                @click="closeModal"
                class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
              >
                Fermer
              </button>
              <button
                @click="downloadRecu"
                :disabled="isDownloading"
                class="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 shadow-sm transition-colors"
              >
                <svg v-if="isDownloading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                {{ isDownloading ? 'Téléchargement...' : 'Télécharger le reçu PDF' }}
              </button>
            </div>
          </div>
          
          <!-- État de chargement si aucune donnée -->
          <div v-else class="p-8 text-center text-gray-500">
            Chargement des informations du reçu...
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot } from '@headlessui/vue';
import { useParametreStore } from '~~/stores/parametre';
import { usePdfGenerator } from '~~/app/composables/usePdfGenerator';

const parametreStore = useParametreStore();
const appLogo = computed(() => parametreStore.getAppLogo || '');
const { downloadAsPdf, isGenerating } = usePdfGenerator();

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  etudiant: {
    type: Object,
    required: true,
    default: () => ({})
  },
  operation: {
    type: Object,
    required: true,
    default: () => ({})
  },
  appName: {
    type: String,
    default: 'Établissement'
  }
});

const emit = defineEmits(['close']);

const recuContent = ref(null);
const isDownloading = ref(false);

const dateAujourdhui = computed(() => {
  return new Date().toISOString().split('T')[0].replace(/-/g, '');
});

const closeModal = () => {
  emit('close');
};

const formatDate = (d) => {
  if (!d) return '—';
  const dateObj = new Date(d);
  if (isNaN(dateObj.getTime())) return d;
  return dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatMontantShort = (m) => {
  if (!m && m !== 0) return '0';
  return new Intl.NumberFormat('fr-FR').format(m);
};

const isCash = computed(() => {
  if (!props.operation || !props.operation.mode_paiement) return true; // Default to Espèces if mode is missing
  const mode = props.operation.mode_paiement.toLowerCase();
  return mode.includes('espèce') || mode.includes('espece') || mode.includes('cash') || mode.includes('caisse');
});

const isBank = computed(() => {
  if (!props.operation || !props.operation.mode_paiement) return false;
  return !isCash.value; 
});

const isFraisInscription = computed(() => {
  if (!props.operation) return false;
  const desc = (props.operation.description || props.operation.libelle || '').toLowerCase();
  const type = (props.operation.payable_type || '').toLowerCase();
  return desc.includes('inscription') || type.includes('fraisinscription');
});

const downloadRecu = async () => {
  if (!recuContent.value || !props.etudiant || !props.operation) return;
  
  isDownloading.value = true;
  try {
    const filename = `recu_${props.operation.reference || 'paiement'}_${props.etudiant.matricule}.pdf`;
    await downloadAsPdf(recuContent.value, filename, {
      margin: 10,
      orientation: 'portrait',
      format: 'a4',
      wrapperStyle: 'width:100%;background:#fff;font-family:sans-serif;'
    });
  } catch (error) {
    console.error('Erreur téléchargement reçu:', error);
  } finally {
    isDownloading.value = false;
  }
};
</script>
