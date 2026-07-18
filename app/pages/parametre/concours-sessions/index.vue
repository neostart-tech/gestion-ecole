<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <Breadcrumb
      :items="[
        { label: 'Paramètres', to: '#' },
        { label: 'Sessions de concours', to: null },
      ]"
      title="Gestion des sessions de concours"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <div class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5">
      <p class="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
        Une session est créée par année scolaire. Activez « Épreuve écrite » uniquement si le concours de cette
        session comporte un examen (présence, matières, notes) ; sinon la sélection continue de se faire uniquement
        sur dossier, comme aujourd'hui.
      </p>
      <Button @click="openAddModal" label="Nouvelle session" icon="pi pi-plus" class="whitespace-nowrap" />
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
      <div v-if="sessionStore.isLoading && !sessionStore.sessions.length" class="flex justify-center py-20">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>

      <div v-else-if="!sessionStore.sessions.length" class="text-center py-16 text-gray-500 dark:text-gray-400">
        Aucune session de concours n'a encore été créée.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              <th class="py-3 px-3">Session</th>
              <th class="py-3 px-3">Année scolaire</th>
              <th class="py-3 px-3">Épreuve écrite</th>
              <th class="py-3 px-3">Statut</th>
              <th class="py-3 px-3">Publiée</th>
              <th class="py-3 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
            <tr v-for="session in sessionStore.sessions" :key="session.id" class="hover:bg-gray-50 dark:hover:bg-gray-900/40">
              <td class="py-3 px-3 font-medium text-gray-900 dark:text-white">{{ session.libelle }}</td>
              <td class="py-3 px-3 text-gray-600 dark:text-gray-300">{{ session.annee_scolaire?.nom || '—' }}</td>
              <td class="py-3 px-3 whitespace-nowrap">
                <span
                  class="inline-block px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                  :class="session.avec_epreuve_ecrite ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'"
                >
                  {{ session.avec_epreuve_ecrite ? 'Avec épreuve' : 'Dossier uniquement' }}
                </span>
              </td>
              <td class="py-3 px-3">
                <Dropdown
                  :modelValue="session.statut"
                  @update:modelValue="(val) => changeStatus(session, val)"
                  :options="statutOptions"
                  optionLabel="label"
                  optionValue="value"
                  class="!text-xs w-40"
                />
              </td>
              <td class="py-3 px-3">
                <ToggleSwitch :modelValue="!!session.est_publiee" @update:modelValue="() => togglePublish(session)" />
              </td>
              <td class="py-3 px-3">
                <div class="flex justify-center gap-2">
                  <button
                    v-if="session.avec_epreuve_ecrite"
                    @click="openMatieresModal(session)"
                    class="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                    title="Gérer les matières & coefficients"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  <button
                    @click="openEditModal(session)"
                    class="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                    title="Modifier"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Ajout/Edition -->
    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeModal">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
              <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl transition-all">
                <DialogTitle class="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {{ form.id ? 'Modifier la session' : 'Nouvelle session de concours' }}
                </DialogTitle>

                <form @submit.prevent="saveSession" class="space-y-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Année scolaire</label>
                    <Dropdown
                      v-model="form.annee_scolaire_id"
                      :options="anneeStore.annneescolaires"
                      optionLabel="nom"
                      optionValue="id"
                      placeholder="Choisir une année scolaire"
                      class="w-full"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Libellé</label>
                    <InputText v-model="form.libelle" placeholder="Ex: Concours d'entrée 2026" class="w-full" />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Mode de sélection des candidats</label>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        @click="form.avec_epreuve_ecrite = false"
                        class="text-left p-4 rounded-xl border-2 transition-all"
                        :class="!form.avec_epreuve_ecrite
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
                      >
                        <div class="flex items-center justify-between mb-1">
                          <span class="text-sm font-semibold" :class="!form.avec_epreuve_ecrite ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'">
                            Dossier uniquement
                          </span>
                          <span v-if="!form.avec_epreuve_ecrite" class="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center">
                            <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                          </span>
                          <span v-else class="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600"></span>
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          Procédure actuelle : la décision d'admission se fait uniquement sur l'étude du dossier, sans épreuve ni notes.
                        </p>
                      </button>

                      <button
                        type="button"
                        @click="form.avec_epreuve_ecrite = true"
                        class="text-left p-4 rounded-xl border-2 transition-all"
                        :class="form.avec_epreuve_ecrite
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
                      >
                        <div class="flex items-center justify-between mb-1">
                          <span class="text-sm font-semibold" :class="form.avec_epreuve_ecrite ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'">
                            Concours avec épreuve écrite
                          </span>
                          <span v-if="form.avec_epreuve_ecrite" class="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center">
                            <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                          </span>
                          <span v-else class="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600"></span>
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          Active la présence à l'épreuve, les matières/coefficients par filière et la saisie des notes pour cette session.
                        </p>
                      </button>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Début du dépôt</label>
                      <Calendar v-model="form.date_debut_depot" dateFormat="dd/mm/yy" showIcon class="w-full" />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Fin du dépôt</label>
                      <Calendar v-model="form.date_fin_depot" dateFormat="dd/mm/yy" showIcon class="w-full" />
                    </div>
                  </div>

                  <div v-if="form.avec_epreuve_ecrite" class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Date de l'épreuve</label>
                      <Calendar v-model="form.date_epreuve" dateFormat="dd/mm/yy" showIcon class="w-full" />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Publication des résultats</label>
                      <Calendar v-model="form.date_publication_resultats" dateFormat="dd/mm/yy" showIcon class="w-full" />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Communiqué public (optionnel)</label>
                    <Textarea v-model="form.communique" rows="3" placeholder="Texte affiché sur le site public si la session est publiée..." class="w-full" />
                  </div>

                  <div class="flex justify-end gap-3 mt-6">
                    <Button type="button" @click="closeModal" label="Annuler" severity="secondary" outlined />
                    <Button type="submit" :loading="sessionStore.isLoading" :label="form.id ? 'Mettre à jour' : 'Enregistrer'" />
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal Matières & coefficients -->
    <TransitionRoot appear :show="showMatieresModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeMatieresModal">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
              <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl transition-all">
                <DialogTitle class="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Matières & coefficients : {{ selectedSession?.libelle }}
                </DialogTitle>

                <div class="mb-6 bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Matières configurées</h3>
                  <div v-if="isMatieresLoading" class="flex justify-center py-4">
                    <div class="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
                  </div>
                  <div v-else-if="sessionMatieres.length === 0" class="text-center py-6 text-gray-500 text-sm bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                    Aucune matière configurée pour cette session.
                  </div>
                  <div v-else class="space-y-2 max-h-64 overflow-y-auto pr-2">
                    <div v-for="sm in sessionMatieres" :key="sm.id" class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div>
                        <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ sm.concours_matiere?.nom }}</p>
                        <p class="text-xs text-gray-500">{{ sm.niveau?.libelle }}<span v-if="sm.filiere"> · {{ sm.filiere?.nom }}</span><span v-else> · Toutes filières</span></p>
                      </div>
                      <div class="flex items-center gap-3">
                        <span class="text-xs font-bold px-2 py-1 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">Coeff. {{ sm.coefficient }}</span>
                        <button @click="deleteSessionMatiere(sm)" class="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-md transition-colors">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <form @submit.prevent="saveSessionMatiere" class="bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 space-y-3">
                  <h3 class="text-sm font-semibold text-emerald-900 dark:text-emerald-300">Ajouter une matière</h3>
                  <div class="grid grid-cols-2 gap-3">
                    <Dropdown v-model="matiereForm.niveau_id" :options="niveauStore.niveaux" optionLabel="libelle" optionValue="id" placeholder="Niveau" class="w-full !text-sm" />
                    <Dropdown v-model="matiereForm.filiere_id" :options="filiereStore.filieres" optionLabel="nom" optionValue="id" placeholder="Toutes les filières" showClear class="w-full !text-sm" />
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <Dropdown v-model="matiereForm.concours_matiere_id" :options="matiereStore.matieres" optionLabel="nom" optionValue="id" placeholder="Matière" class="w-full !text-sm" />
                    <InputNumber v-model="matiereForm.coefficient" placeholder="Coefficient" :min="0.1" :step="0.1" :minFractionDigits="1" class="w-full" />
                  </div>
                  <Button type="submit" :loading="isMatiereSaving" label="Ajouter à la liste" size="small" />
                </form>

                <div class="flex justify-end mt-6">
                  <Button type="button" @click="closeMatieresModal" label="Terminer" severity="secondary" outlined />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Calendar from "primevue/calendar";
import Textarea from "primevue/textarea";
import ToggleSwitch from "primevue/toggleswitch";
import Button from "primevue/button";
import { useConcoursSessionStore } from "~~/stores/concoursSession";
import { useConcoursMatiereStore } from "~~/stores/concoursMatiere";
import { useAnneScolaireStore } from "~~/stores/annee-scolaire";
import { useNiveauStore } from "~~/stores/niveau";
import { useFiliereStore } from "~~/stores/filiere";

const { $toastr, $swal } = useNuxtApp();
const sessionStore = useConcoursSessionStore();
const matiereStore = useConcoursMatiereStore();
const anneeStore = useAnneScolaireStore();
const niveauStore = useNiveauStore();
const filiereStore = useFiliereStore();

const statutOptions = [
  { label: "Brouillon", value: "brouillon" },
  { label: "Ouvert", value: "ouvert" },
  { label: "Clos", value: "clos" },
];

const showModal = ref(false);
const showMatieresModal = ref(false);
const selectedSession = ref(null);
const sessionMatieres = ref([]);
const isMatieresLoading = ref(false);
const isMatiereSaving = ref(false);

const form = ref({
  id: null,
  annee_scolaire_id: null,
  libelle: "",
  avec_epreuve_ecrite: false,
  date_debut_depot: null,
  date_fin_depot: null,
  date_epreuve: null,
  date_publication_resultats: null,
  communique: "",
});

// Convertit une date string 'YYYY-MM-DD' (API) en objet Date (PrimeVue Calendar)
const toDateObject = (value) => (value ? new Date(value) : null);
// Convertit un objet Date (PrimeVue Calendar) en string 'YYYY-MM-DD' (API)
const toApiDate = (value) => (value ? new Date(value).toISOString().split('T')[0] : null);

const matiereForm = ref({
  niveau_id: null,
  filiere_id: null,
  concours_matiere_id: null,
  coefficient: 1,
});

const openAddModal = () => {
  form.value = {
    id: null,
    annee_scolaire_id: null,
    libelle: "",
    avec_epreuve_ecrite: false,
    date_debut_depot: null,
    date_fin_depot: null,
    date_epreuve: null,
    date_publication_resultats: null,
    communique: "",
  };
  showModal.value = true;
};

const openEditModal = (session) => {
  form.value = {
    id: session.id,
    annee_scolaire_id: session.annee_scolaire_id,
    libelle: session.libelle,
    avec_epreuve_ecrite: !!session.avec_epreuve_ecrite,
    date_debut_depot: toDateObject(session.date_debut_depot),
    date_fin_depot: toDateObject(session.date_fin_depot),
    date_epreuve: toDateObject(session.date_epreuve),
    date_publication_resultats: toDateObject(session.date_publication_resultats),
    communique: session.communique || "",
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveSession = async () => {
  if (!form.value.annee_scolaire_id || !form.value.libelle?.trim()) {
    $toastr.error("L'année scolaire et le libellé sont obligatoires.");
    return;
  }

  const debut = form.value.date_debut_depot ? new Date(form.value.date_debut_depot) : null;
  const fin = form.value.date_fin_depot ? new Date(form.value.date_fin_depot) : null;
  const epreuve = form.value.date_epreuve ? new Date(form.value.date_epreuve) : null;
  const publication = form.value.date_publication_resultats ? new Date(form.value.date_publication_resultats) : null;

  if (debut && fin && fin < debut) {
    $toastr.error("La fin du dépôt ne peut pas être avant le début du dépôt.");
    return;
  }
  if (form.value.avec_epreuve_ecrite) {
    if (fin && epreuve && epreuve < fin) {
      $toastr.error("La date de l'épreuve ne peut pas être avant la fin du dépôt des dossiers.");
      return;
    }
    if (epreuve && publication && publication < epreuve) {
      $toastr.error("La publication des résultats ne peut pas être avant la date de l'épreuve.");
      return;
    }
  }

  const payload = {
    ...form.value,
    date_debut_depot: toApiDate(form.value.date_debut_depot),
    date_fin_depot: toApiDate(form.value.date_fin_depot),
    date_epreuve: toApiDate(form.value.date_epreuve),
    date_publication_resultats: toApiDate(form.value.date_publication_resultats),
  };

  try {
    if (form.value.id) {
      await sessionStore.updateSession(form.value.id, payload);
      $toastr.success("Session modifiée avec succès");
    } else {
      await sessionStore.addSession(payload);
      $toastr.success("Session créée avec succès");
    }
    await sessionStore.fetchSessions();
    closeModal();
  } catch (error) {
    $toastr.error(error.response?.data?.message || "Une erreur est survenue");
  }
};

const changeStatus = async (session, statut) => {
  try {
    await sessionStore.toggleSessionStatus(session.id, statut);
    await sessionStore.fetchSessions();
    $toastr.success("Statut mis à jour avec succès");
  } catch (error) {
    $toastr.error("Erreur lors du changement de statut");
  }
};

const togglePublish = async (session) => {
  const action = session.est_publiee ? "dépublier" : "publier";
  const res = await $swal.fire({
    title: `${action.charAt(0).toUpperCase() + action.slice(1)} cette session ?`,
    text: session.est_publiee
      ? "Les informations du concours ne seront plus visibles sur le site public."
      : "Les dates, matières et coefficients de cette session seront visibles sur le site public.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: `Oui, ${action}`,
    cancelButtonText: "Annuler",
  });

  if (res.isConfirmed) {
    try {
      if (session.est_publiee) {
        await sessionStore.unpublishSession(session.id);
      } else {
        await sessionStore.publishSession(session.id);
      }
      await sessionStore.fetchSessions();
      $toastr.success(`Session ${session.est_publiee ? 'dépubliée' : 'publiée'} avec succès`);
    } catch (error) {
      $toastr.error("Erreur lors de la publication");
    }
  }
};

const openMatieresModal = async (session) => {
  selectedSession.value = session;
  showMatieresModal.value = true;
  matiereForm.value = { niveau_id: null, filiere_id: null, concours_matiere_id: null, coefficient: 1 };
  if (!niveauStore.niveaux.length) await niveauStore.fetchNiveaux();
  if (!filiereStore.filieres.length) await filiereStore.fetchFilieres();
  if (!matiereStore.matieres.length) await matiereStore.fetchMatieres();
  await fetchSessionMatieres();
};

const closeMatieresModal = () => {
  showMatieresModal.value = false;
  selectedSession.value = null;
  sessionMatieres.value = [];
};

const fetchSessionMatieres = async () => {
  if (!selectedSession.value) return;
  isMatieresLoading.value = true;
  try {
    sessionMatieres.value = await sessionStore.fetchSessionMatieres(selectedSession.value.id);
  } catch (error) {
    $toastr.error("Impossible de charger les matières de la session.");
  } finally {
    isMatieresLoading.value = false;
  }
};

const saveSessionMatiere = async () => {
  if (!selectedSession.value) return;
  if (!matiereForm.value.niveau_id || !matiereForm.value.concours_matiere_id || !matiereForm.value.coefficient) {
    $toastr.error("Niveau, matière et coefficient sont obligatoires.");
    return;
  }
  isMatiereSaving.value = true;
  try {
    await sessionStore.addSessionMatiere(selectedSession.value.id, matiereForm.value);
    $toastr.success("Matière ajoutée à la session avec succès !");
    matiereForm.value = { niveau_id: null, filiere_id: null, concours_matiere_id: null, coefficient: 1 };
    await fetchSessionMatieres();
  } catch (error) {
    $toastr.error(error.response?.data?.message || "Erreur lors de l'enregistrement.");
  } finally {
    isMatiereSaving.value = false;
  }
};

const deleteSessionMatiere = async (sm) => {
  const res = await $swal.fire({
    title: "Retirer cette matière ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, retirer",
    cancelButtonText: "Annuler",
    confirmButtonColor: "#ef4444",
  });

  if (res.isConfirmed) {
    try {
      await sessionStore.deleteSessionMatiere(selectedSession.value.id, sm.id);
      $toastr.success("Matière retirée avec succès.");
      await fetchSessionMatieres();
    } catch (error) {
      $toastr.error("Erreur lors de la suppression.");
    }
  }
};

onMounted(() => {
  sessionStore.fetchSessions();
  anneeStore.fetchAnneeScolaire();
});
</script>

<style scoped>
/* Aligne les boutons PrimeVue de cette page sur l'indigo utilisé partout ailleurs dans l'app,
   au lieu du vert émeraude par défaut du thème Aura. */
:deep(.p-button:not(.p-button-outlined):not(.p-button-secondary)) {
  --p-button-primary-background: #4f46e5;
  --p-button-primary-hover-background: #4338ca;
  --p-button-primary-active-background: #3730a3;
  --p-button-primary-border-color: #4f46e5;
  --p-button-primary-hover-border-color: #4338ca;
  --p-button-primary-active-border-color: #3730a3;
}

:deep(.p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider) {
  background: #4f46e5;
}

:deep(.p-dropdown.p-focus),
:deep(.p-inputtext:focus),
:deep(.p-inputnumber-input:focus),
:deep(.p-datepicker-input:focus) {
  border-color: #4f46e5 !important;
  box-shadow: 0 0 0 1px #4f46e5 !important;
}
</style>
