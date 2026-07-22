<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-[600px]">
      <div class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
    </div>

    <div v-else class="space-y-6">
      <!-- En-tête -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Paiement global
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Effectuez des paiements pour les étudiants (avec ou sans négociation)
          </p>
        </div>
      </div>

      <!-- Recherche étudiant avec AutoComplete PrimeVue -->
      <Card class="shadow-lg border border-gray-100 dark:border-gray-700">
        <template #content>
          <div class="p-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rechercher un étudiant
            </label>
            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex-1">
                <AutoComplete
                  v-model="selectedEtudiant"
                  :suggestions="filteredEtudiants"
                  @complete="searchEtudiants"
                  field="nom_complet"
                  placeholder="Nom, prénom ou matricule..."
                  class="w-full"
                  :loading="searchLoading"
                  dropdown
                  @item-select="handleEtudiantSelect"
                >
                  <template #option="slotProps">
                    <div class="flex items-center gap-3 p-2">
                      <Avatar
                        :label="getInitials(slotProps.option)"
                        class="bg-indigo-600 text-white"
                        size="large"
                        shape="circle"
                      />
                      <div>
                        <div class="font-medium">{{ slotProps.option.nom_complet }}</div>
                        <div class="text-sm text-gray-500">
                          {{ slotProps.option.matricule }} - {{ slotProps.option.niveau }}
                        </div>
                      </div>
                    </div>
                  </template>
                </AutoComplete>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Informations étudiant sélectionné -->
      <div v-if="paiementStore.infosEtudiant">
        <!-- Header étudiant -->
        <Card class="shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <template #content>
            <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <div class="flex items-center gap-4">
                <Avatar
                  :label="getInitials(paiementStore.infosEtudiant.etudiant)"
                  class="bg-white text-indigo-600 font-bold"
                  size="xlarge"
                  shape="circle"
                />
                <div class="text-white">
                  <h2 class="text-2xl font-bold">{{ paiementStore.infosEtudiant.etudiant.nom_complet }}</h2>
                  <div class="flex flex-wrap gap-4 mt-2">
                    <div class="flex items-center gap-1">
                      <Tag value="Matricule" severity="info" />
                      <span class="text-sm">{{ paiementStore.infosEtudiant.etudiant.matricule }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <Tag value="Niveau" severity="success" />
                      <span class="text-sm">{{ paiementStore.infosEtudiant.etudiant.niveau }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <Tag value="Tél" severity="warning" />
                      <span class="text-sm">{{ paiementStore.infosEtudiant.etudiant.telephone || 'N/A' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stats rapides -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
              <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <span class="text-sm text-gray-500">Total à payer</span>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ formatMontant(paiementStore.infosEtudiant.frais?.montant_apres_bourse || paiementStore.infosEtudiant.reste_a_payer_total) }}
                </p>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <span class="text-sm text-gray-500">Déjà payé</span>
                <p class="text-2xl font-bold text-emerald-600">
                  {{ formatMontant(paiementStore.infosEtudiant.frais?.total_paye || 0) }}
                </p>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <span class="text-sm text-gray-500">Reste à payer</span>
                <p class="text-2xl font-bold text-amber-600">
                  {{ formatMontant(paiementStore.infosEtudiant.reste_a_payer_total) }}
                </p>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <span class="text-sm text-gray-500">Type</span>
                <Tag
                  :value="paiementStore.infosEtudiant.type_paiement === 'negociation' ? 'Négociation' : 'Global'"
                  :severity="paiementStore.infosEtudiant.type_paiement === 'negociation' ? 'warning' : 'info'"
                  class="mt-1"
                />
                <p class="text-xs text-gray-500 mt-2">{{ paiementStore.infosEtudiant.annee_scolaire.nom }}</p>
              </div>
            </div>
          </template>
        </Card>

        <!-- Formulaire de paiement -->
        <Card class="shadow-lg border border-gray-100 dark:border-gray-700">
          <template #title>
            <div class="flex items-center gap-2 px-6 pt-6">
              <i class="pi pi-credit-card text-indigo-600"></i>
              <span class="text-lg font-semibold">Nouveau paiement</span>
            </div>
          </template>
          <template #content>
            <div class="p-6 pt-0">
              <form @submit.prevent="handlePaiement" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Nature de paiement -->
                  <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nature du paiement <span class="text-red-500">*</span>
                    </label>
                    <SelectButton
                      v-model="paiementForm.nature_paiement"
                      :options="naturesPaiement"
                      optionLabel="label"
                      optionValue="value"
                      class="w-full"
                    />
                  </div>

                  <!-- Montant -->
                  <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Montant <span class="text-red-500">*</span>
                    </label>
                    <div class="p-inputgroup">
                      <InputNumber
                        v-model="paiementForm.montant"
                        :min="1"
                        :max="paiementStore.infosEtudiant.reste_a_payer_total"
                        placeholder="Saisir le montant"
                        class="w-full font-bold"
                        mode="currency"
                        currency="XOF"
                        locale="fr-FR"
                      />
                      <span class="p-inputgroup-addon bg-gray-100 dark:bg-gray-700">
                        FCFA
                      </span>
                    </div>
                  </div>

                  <!-- Mode de paiement -->
                  <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mode de paiement <span class="text-red-500">*</span>
                    </label>
                    <Dropdown
                      v-model="paiementForm.mode_paiement"
                      :options="modesPaiement"
                      optionLabel="label"
                      optionValue="value"
                      class="w-full"
                    >
                      <template #option="slotProps">
                        <div class="flex items-center gap-2">
                          <i :class="slotProps.option.icon"></i>
                          <span>{{ slotProps.option.label }}</span>
                        </div>
                      </template>
                    </Dropdown>
                  </div>

                  <!-- Frais retrait MM (Visible si Mobile Money) -->
                  <div v-if="['mobile_money', 'semoa'].includes(paiementForm.mode_paiement)" class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-amber-600">
                      Frais de retrait Mobile Money
                    </label>
                    <InputNumber
                      v-model="paiementForm.frais_retrait_mm"
                      placeholder="0 FCFA"
                      class="w-full"
                      mode="currency"
                      currency="XOF"
                      locale="fr-FR"
                    />
                  </div>

                  <!-- Référence -->
                  <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Référence / N° de transaction
                    </label>
                    <InputText
                      v-model="paiementForm.reference"
                      placeholder="N° de reçu, ID transaction..."
                      class="w-full"
                    />
                  </div>

                  <!-- Commentaire -->
                  <div class="flex flex-col gap-1 md:col-span-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Commentaire / Note interne
                    </label>
                    <Textarea
                      v-model="paiementForm.commentaire"
                      placeholder="Précisions sur le paiement..."
                      class="w-full bg-slate-50 dark:bg-gray-700 border-none rounded-xl"
                      rows="2"
                    />
                  </div>
                </div>

                <!-- Boutons d'action -->
                <div class="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    label="Réinitialiser"
                    icon="pi pi-refresh"
                    class="p-button-outlined p-button-secondary"
                    @click="resetForm"
                  />
                  <Can action="create-paiement">
                    <Button
                      type="submit"
                      :label="isSubmitting ? 'Traitement...' : 'Effectuer le paiement'"
                      icon="pi pi-check"
                      :loading="isSubmitting"
                      :disabled="isSubmitting || !paiementForm.montant || paiementForm.montant <= 0"
                    />
                  </Can>
                </div>
              </form>
            </div>
          </template>
        </Card>

        <!-- Échéances à payer -->
        <Card class="shadow-lg border border-gray-100 dark:border-gray-700">
          <template #title>
            <div class="flex items-center gap-2 px-6 pt-6">
              <i class="pi pi-calendar text-indigo-600"></i>
              <span class="text-lg font-semibold">Échéances à payer</span>
              <Badge :value="paiementStore.infosEtudiant.prochaines_echeances.length" severity="info" class="ml-2" />
            </div>
          </template>
          <template #content>
            <div class="p-6 pt-0">
              <DataTable
                :value="paiementStore.infosEtudiant.prochaines_echeances"
                :paginator="true"
                :rows="5"
                class="p-datatable-sm"
                responsiveLayout="scroll"
              >
                <Column field="ordre" header="N°" style="width: 70px">
                  <template #body="slotProps">
                    <Tag :value="slotProps.data.ordre" severity="info" />
                  </template>
                </Column>
                <Column field="libelle" header="Échéance"></Column>
                <Column field="montant" header="Montant">
                  <template #body="slotProps">
                    <span class="font-medium">{{ formatMontant(slotProps.data.montant) }}</span>
                  </template>
                </Column>
                <Column field="montant_paye" header="Payé">
                  <template #body="slotProps">
                    <span class="text-emerald-600">{{ formatMontant(slotProps.data.montant_paye) }}</span>
                  </template>
                </Column>
                <Column field="reste" header="Reste">
                  <template #body="slotProps">
                    <span class="font-bold" :class="slotProps.data.reste > 0 ? 'text-amber-600' : 'text-emerald-600'">
                      {{ formatMontant(slotProps.data.reste) }}
                    </span>
                  </template>
                </Column>
                <Column field="date_limite_formatted" header="Date limite">
                  <template #body="slotProps">
                    <div class="flex items-center gap-1">
                      <i class="pi pi-calendar text-gray-400"></i>
                      <span>{{ slotProps.data.date_limite_formatted }}</span>
                    </div>
                  </template>
                </Column>
                <Column field="statut" header="Statut">
                  <template #body="slotProps">
                    <Tag
                      :value="slotProps.data.statut === 'paye' ? 'Payé' : 
                             slotProps.data.statut === 'partiel' ? 'Partiel' :
                             slotProps.data.statut === 'en_retard' ? 'En retard' : 'En attente'"
                      :severity="slotProps.data.statut === 'paye' ? 'success' :
                                 slotProps.data.statut === 'partiel' ? 'warning' :
                                 slotProps.data.statut === 'en_retard' ? 'danger' : 'info'"
                    />
                  </template>
                </Column>
              </DataTable>
            </div>
          </template>
        </Card>

        <!-- Historique des paiements -->
        <Card class="shadow-lg border border-gray-100 dark:border-gray-700">
          <template #title>
            <div class="flex items-center gap-2 px-6 pt-6">
              <i class="pi pi-history text-indigo-600"></i>
              <span class="text-lg font-semibold">Historique des paiements</span>
              <Badge :value="paiementStore.historiquePaiements.length" severity="info" class="ml-2" />
            </div>
          </template>
          <template #content>
            <div class="p-6 pt-0">
              <DataTable
                :value="paiementStore.historiquePaiements"
                :paginator="true"
                :rows="5"
                class="p-datatable-sm"
                responsiveLayout="scroll"
              >
                <Column field="date_formatted" header="Date">
                  <template #body="slotProps">
                    <div class="flex items-center gap-1">
                      <i class="pi pi-calendar text-gray-400"></i>
                      <span>{{ slotProps.data.date_formatted }}</span>
                    </div>
                  </template>
                </Column>
                <Column field="montant" header="Montant">
                  <template #body="slotProps">
                    <span class="font-bold text-emerald-600">{{ formatMontant(slotProps.data.montant) }}</span>
                  </template>
                </Column>
                <Column field="mode_label" header="Mode">
                  <template #body="slotProps">
                    <Tag :value="slotProps.data.mode_label" severity="info" />
                  </template>
                </Column>
                <Column field="reference" header="Référence">
                  <template #body="slotProps">
                    <span class="font-mono text-sm">{{ slotProps.data.reference || '—' }}</span>
                  </template>
                </Column>
                <Column field="libelle" header="Libellé"></Column>
                <Column field="status_label" header="Statut">
                  <template #body="slotProps">
                    <Tag
                      :value="slotProps.data.status_label"
                      :severity="slotProps.data.status === 'valide' ? 'success' :
                                 slotProps.data.status === 'rejete' ? 'danger' : 'warning'"
                    />
                  </template>
                </Column>
              </DataTable>

              <div v-if="paiementStore.historiquePaiements.length === 0" class="text-center py-8">
                <i class="pi pi-inbox text-4xl text-gray-300 mb-3"></i>
                <p class="text-gray-500">Aucun paiement enregistré</p>
              </div>
            </div>
          </template>
        </Card>

        <!-- Récapitulatif -->
        <Card v-if="paiementStore.recap" class="shadow-lg border border-gray-100 dark:border-gray-700">
          <template #title>
            <div class="flex items-center gap-2 px-6 pt-6">
              <i class="pi pi-chart-pie text-indigo-600"></i>
              <span class="text-lg font-semibold">Récapitulatif</span>
            </div>
          </template>
          <template #content>
            <div class="p-6 pt-0">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <span class="text-sm text-gray-500">Progression</span>
                  <p class="text-2xl font-bold">{{ paiementStore.recap.pourcentage }}%</p>
                  <ProgressBar :value="paiementStore.recap.pourcentage" class="mt-2" />
                </div>
                <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <span class="text-sm text-gray-500">Échéances</span>
                  <p class="text-2xl font-bold">{{ paiementStore.recap.nombre_echeances }}</p>
                  <div class="flex gap-2 mt-2 text-xs">
                    <Tag value="Payées" :badge="paiementStore.recap.echeances_payees" severity="success" />
                    <Tag value="En cours" :badge="paiementStore.recap.echeances_en_cours" severity="warning" />
                  </div>
                </div>
                <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <span class="text-sm text-gray-500">En attente</span>
                  <p class="text-2xl font-bold text-amber-600">{{ paiementStore.recap.echeances_en_attente }}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <span class="text-sm text-gray-500">En retard</span>
                  <p class="text-2xl font-bold text-red-600">{{ paiementStore.recap.echeances_en_retard }}</p>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Message si aucun étudiant sélectionné -->
      <div v-else class="text-center py-12">
        <i class="pi pi-search text-5xl text-gray-300 mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Recherchez un étudiant
        </h3>
        <p class="text-gray-500 dark:text-gray-400">
          Utilisez la barre de recherche ci-dessus pour trouver un étudiant et effectuer un paiement
        </p>
      </div>
    </div>

    <!-- Toast pour les notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import AutoComplete from "primevue/autocomplete";
import Avatar from "primevue/avatar";
import Card from "primevue/card";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import SelectButton from "primevue/selectbutton";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
import Badge from "primevue/badge";
import ProgressBar from "primevue/progressbar";
import Toast from "primevue/toast";
import { usePaiementGlobalStore } from "~~/stores/paiement";

definePageMeta({
  middleware: 'auth',
  layout: 'admin'
});

const toast = useToast();
const paiementStore = usePaiementGlobalStore();

// États
const isLoading = ref(false);
const isSubmitting = ref(false);
const searchLoading = ref(false);
const selectedEtudiant = ref(null);
const filteredEtudiants = ref([]);

// Formulaire de paiement
const paiementForm = ref({
  etudiant_id: null,
  montant: null,
  mode_paiement: "especes",
  nature_paiement: "scolarite",
  frais_retrait_mm: 0,
  reference: "",
  commentaire: ""
});

// Natures de paiement
const naturesPaiement = ref([
  { value: "scolarite", label: "Scolarité", icon: "pi pi-book" },
  { value: "inscription", label: "Inscription", icon: "pi pi-id-card" },
]);

// Modes de paiement
const modesPaiement = ref([
  { value: "especes", label: "Espèces", icon: "pi pi-money-bill" },
  { value: "banque", label: "Banque", icon: "pi pi-building" },
  { value: "mobile_money", label: "Mobile Money", icon: "pi pi-mobile" },
  { value: "virement", label: "Virement", icon: "pi pi-send" },
  { value: "cheque", label: "Chèque", icon: "pi pi-file" },
  { value: "autre", label: "Autre", icon: "pi pi-ellipsis-h" },
]);

// Recherche d'étudiants
const searchEtudiants = async (event) => {
  const query = event.query;
  if (query.length < 2) return;

  searchLoading.value = true;
  try {
    await paiementStore.rechercherEtudiants(query);
    filteredEtudiants.value = paiementStore.etudiants;
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Erreur",
      detail: "Erreur lors de la recherche",
      life: 3000,
    });
  } finally {
    searchLoading.value = false;
  }
};

// Sélection d'un étudiant
const handleEtudiantSelect = async (event) => {
  const etudiant = event.value;
  isLoading.value = true;
  
  try {
    await paiementStore.getInfosEtudiant(etudiant.id);
    await paiementStore.getHistorique(etudiant.id);
    await paiementStore.getRecap(etudiant.id);
    
    paiementForm.value.etudiant_id = etudiant.id;
    
    toast.add({
      severity: "success",
      summary: "Succès",
      detail: `Étudiant ${etudiant.nom_complet} chargé`,
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Erreur",
      detail: "Erreur lors du chargement des informations",
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};

// Traitement du paiement
const handlePaiement = async () => {
  if (!paiementForm.value.montant || paiementForm.value.montant <= 0) {
    toast.add({
      severity: "warn",
      summary: "Attention",
      detail: "Veuillez saisir un montant valide",
      life: 3000,
    });
    return;
  }

  if (paiementForm.value.montant > paiementStore.infosEtudiant.reste_a_payer_total) {
    const confirm = window.confirm(
      `Le montant saisi (${formatMontant(paiementForm.value.montant)}) dépasse le reste total dû (${formatMontant(paiementStore.infosEtudiant.reste_a_payer_total)}). Voulez-vous continuer ? Le surplus sera perdu.`
    );
    if (!confirm) return;
  }

  isSubmitting.value = true;
  
  try {
    const result = await paiementStore.effectuerPaiement({
      etudiant_id: paiementForm.value.etudiant_id,
      montant: paiementForm.value.montant,
      mode_paiement: paiementForm.value.mode_paiement,
      nature_paiement: paiementForm.value.nature_paiement,
      frais_retrait_mm: paiementForm.value.frais_retrait_mm,
      reference: paiementForm.value.reference || null,
      commentaire: paiementForm.value.commentaire || null,
    });

    toast.add({
      severity: "success",
      summary: "Succès",
      detail: result.message || "Paiement effectué avec succès",
      life: 5000,
    });

    resetForm();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Erreur",
      detail: error.response?.data?.error || "Erreur lors du paiement",
      life: 5000,
    });
  } finally {
    isSubmitting.value = false;
  }
};

// Reset du formulaire
const resetForm = () => {
  paiementForm.value.montant = null;
  paiementForm.value.reference = "";
  // Garder le mode de paiement sélectionné
};

// Initiales pour l'avatar
const getInitials = (etudiant) => {
  if (!etudiant) return "?";
  const nom = etudiant.nom || "";
  const prenom = etudiant.prenom || "";
  return (nom.charAt(0) + prenom.charAt(0)).toUpperCase();
};

// Formatage des montants
const formatMontant = (montant) => {
  if (montant === undefined || montant === null) return "-";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(montant)
    .replace("XOF", "FCFA");
};

// Cleanup
onMounted(() => {
  // Reset du store au montage
  paiementStore.resetInfos();
});
</script>

<style scoped>
:deep(.p-autocomplete) {
  width: 100%;
}

:deep(.p-autocomplete-panel) {
  max-height: 400px;
}

:deep(.p-inputnumber) {
  width: 100%;
}

:deep(.p-selectbutton) {
  display: flex;
}

:deep(.p-selectbutton .p-button) {
  flex: 1;
}

:deep(.p-card) {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

:deep(.p-card .p-card-content) {
  padding: 0;
}

:deep(.dark .p-card) {
  background: #1f2937;
  border-color: #374151;
}

:deep(.dark .p-card .p-card-title) {
  color: #f9fafb;
}

:deep(.dark .p-card .p-card-subtitle) {
  color: #9ca3af;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #f9fafb;
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 1rem;
}

:deep(.dark .p-datatable .p-datatable-thead > tr > th) {
  background: #1f2937;
  color: #e5e7eb;
  border-color: #374151;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
  border-color: #f3f4f6;
}

:deep(.dark .p-datatable .p-datatable-tbody > tr > td) {
  border-color: #374151;
  color: #e5e7eb;
}

:deep(.p-tag) {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

:deep(.p-progressbar) {
  height: 0.5rem;
}

:deep(.p-progressbar .p-progressbar-value) {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
}

:deep(.p-inputgroup-addon) {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #4b5563;
}

:deep(.dark .p-inputgroup-addon) {
  background: #374151;
  border-color: #4b5563;
  color: #e5e7eb;
}
</style>