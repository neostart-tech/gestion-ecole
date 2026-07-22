<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <!-- En-tête de page -->
    <div class="mb-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div class="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            Gestion des Jours Fériés
          </h1>
          <p class="mt-1 text-gray-500 dark:text-gray-400">Configurez les jours de congés et fêtes pour l'emploi du temps.</p>
        </div>
      </div>

      <!-- Statistiques rapides -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div class="group bg-white dark:bg-gray-800 p-6 rounded-[5px] shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-10 dark:opacity-25 group-hover:opacity-20 dark:group-hover:opacity-40 transition-opacity">
            <svg class="w-12 h-12 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 19H5V8h14v11zM16 1H8v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-3V1z" />
            </svg>
          </div>
          <div class="relative z-10">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total jours fériés</p>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ joursFeries.length }}</h3>
          </div>
        </div>

        <div class="group bg-white dark:bg-gray-800 p-6 rounded-[5px] shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-10 dark:opacity-25 group-hover:opacity-20 dark:group-hover:opacity-40 transition-opacity">
            <svg class="w-12 h-12 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
            </svg>
          </div>
          <div class="relative z-10">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Jours récurrents</p>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ joursFeries.filter(j => j.est_recurrent).length }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Table de données et outils -->
    <div class="bg-white dark:bg-gray-800 rounded-[5px] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <!-- Barre d'outils -->
      <div class="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-800/50">
        <div class="flex flex-wrap items-center gap-4 flex-1">
          <div class="relative max-w-xs w-full">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher un jour..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-[5px] bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
        </div>

        <div class="flex items-center gap-2">
          <Can action="create-jour-ferie">
            <button
              @click="openAddModal"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-[5px] transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un jour férié
            </button>
          </Can>
        </div>
      </div>

      <!-- Table -->
      <div class="p-0">
        <Vue3Datatable
          :rows="filteredRows"
          :columns="columns"
          :loading="loading"
          :sortable="true"
          skin="bh-table-hover bh-table-striped"
          class="bh-table-responsive bh-table-rounded-none"
          :pageSize="10"
        >
          <!-- Slot pour le titre -->
          <template #titre="data">
            <div class="flex flex-col">
              <span class="font-bold text-gray-900 dark:text-white">{{ data.value.titre }}</span>
              <span v-if="data.value.description" class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{{ data.value.description }}</span>
            </div>
          </template>

          <!-- Slot pour la date -->
          <template #date="data">
            <div class="flex items-center gap-2">
              <div class="p-1.5 bg-indigo-50 text-indigo-600 rounded dark:bg-indigo-900/20 dark:text-indigo-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span class="font-medium text-gray-700 dark:text-gray-300">{{ data.value.date_formatee }}</span>
            </div>
          </template>

          <!-- Slot pour la récurrence -->
          <template #est_recurrent="data">
            <span
              v-if="data.value.est_recurrent"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Annuel
            </span>
            <span
              v-else
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-100 dark:border-gray-800"
            >
              Ponctuel
            </span>
          </template>

          <!-- Slot pour l'année scolaire -->
          <template #annee_scolaire_nom="data">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
              {{ data.value.annee_scolaire_nom || 'Toutes les années' }}
            </span>
          </template>

          <!-- Slot pour les actions -->
          <template #action="data">
            <div class="flex justify-center gap-3">
              <Can action="update-jour-ferie">
                <button
                  @click="openEditModal(data.value)"
                  class="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  title="Modifier"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </Can>
              <Can action="delete-jour-ferie">
                <button
                  @click="confirmDelete(data.value)"
                  class="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  title="Supprimer"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </Can>
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>

    <!-- Modal de création/édition -->
    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeModal">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95 translate-y-4"
              enter-to="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100 translate-y-0"
              leave-to="opacity-0 scale-95 translate-y-4"
            >
              <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-8 shadow-2xl transition-all border border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-between mb-8">
                  <DialogTitle class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div class="p-2 bg-indigo-100 text-indigo-600 rounded-lg dark:bg-indigo-900/30">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    {{ isEditing ? 'Modifier le jour férié' : 'Nouveau jour férié' }}
                  </DialogTitle>
                  <button @click="closeModal" class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form @submit.prevent="saveJourFerie" class="space-y-6">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Titre du jour férié</label>
                    <input
                      v-model="form.titre"
                      type="text"
                      required
                      placeholder="Ex: Fête de l'Indépendance"
                      class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-gray-900 dark:text-white"
                    />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Date</label>
                      <input
                        v-model="form.date"
                        type="date"
                        required
                        class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-gray-900 dark:text-white"
                      />
                    </div>
                    <div class="flex items-end pb-2">
                      <label class="flex items-center gap-3 cursor-pointer group">
                        <div class="relative">
                          <input
                            v-model="form.est_recurrent"
                            type="checkbox"
                            class="sr-only"
                          />
                          <div class="w-10 h-6 bg-gray-200 dark:bg-gray-600 rounded-full transition-colors group-hover:bg-gray-300 dark:group-hover:bg-gray-500" :class="{'bg-indigo-500': form.est_recurrent}"></div>
                          <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" :class="{'translate-x-4': form.est_recurrent}"></div>
                        </div>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Récurrent (Annuel)</span>
                      </label>
                    </div>
                  </div>

                  <div v-if="!form.est_recurrent">
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Année scolaire</label>
                    <select
                      v-model="form.annee_scolaire_id"
                      class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-gray-900 dark:text-white"
                    >
                      <option :value="null">Toutes les années</option>
                      <option v-for="annee in anneeScolaireStore.annneescolaires" :key="annee.id" :value="annee.id">
                        {{ annee.nom }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description (Optionnel)</label>
                    <textarea
                      v-model="form.description"
                      rows="3"
                      class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-gray-900 dark:text-white"
                      placeholder="Informations complémentaires..."
                    ></textarea>
                  </div>

                  <div class="flex justify-end gap-4 mt-10">
                    <button
                      type="button"
                      @click="closeModal"
                      class="px-6 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      :disabled="loading"
                      class="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                    >
                      <svg v-if="loading" class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ isEditing ? 'Mettre à jour' : 'Enregistrer' }}
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import '@bhplugin/vue3-datatable/dist/style.css';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import { useJourFerieStore } from '~~/stores/jour-ferie';
import { useAnneScolaireStore } from '~~/stores/annee-scolaire';
import Swal from 'sweetalert2';

// SEO
useHead({
  title: 'Gestion des Jours Fériés | Edu-Manager',
  meta: [
    { name: 'description', content: 'Administrez les jours fériés et congés scolaires pour la planification des cours.' }
  ]
});

const jourFerieStore = useJourFerieStore();
const anneeScolaireStore = useAnneScolaireStore();

const searchQuery = ref('');
const loading = ref(false);
const showModal = ref(false);
const isEditing = ref(false);
const currentSlug = ref('');

const form = ref({
  titre: '',
  date: '',
  est_recurrent: false,
  annee_scolaire_id: null,
  description: ''
});

const columns = [
  { field: 'titre', title: 'Nom du jour', sort: true },
  { field: 'date', title: 'Date', sort: true },
  { field: 'est_recurrent', title: 'Récurrence', sort: true },
  { field: 'annee_scolaire_nom', title: 'Année Scolaire', sort: true },
  { field: 'action', title: 'Actions', sort: false, headerClass: 'justify-center', cellClass: 'justify-center' }
];

const joursFeries = computed(() => jourFerieStore.joursFeries);

const filteredRows = computed(() => {
  if (!searchQuery.value) return joursFeries.value;
  const q = searchQuery.value.toLowerCase();
  return joursFeries.value.filter(j => 
    j.titre.toLowerCase().includes(q) || 
    (j.description && j.description.toLowerCase().includes(q))
  );
});

onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([
      jourFerieStore.fetchJoursFeries(),
      anneeScolaireStore.fetchAnneeScolaire()
    ]);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

const openAddModal = () => {
  isEditing.value = false;
  form.value = {
    titre: '',
    date: '',
    est_recurrent: false,
    annee_scolaire_id: null,
    description: ''
  };
  showModal.value = true;
};

const openEditModal = (jour) => {
  isEditing.value = true;
  currentSlug.value = jour.slug;
  form.value = {
    titre: jour.titre,
    date: jour.date,
    est_recurrent: !!jour.est_recurrent,
    annee_scolaire_id: jour.annee_scolaire_id,
    description: jour.description || ''
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveJourFerie = async () => {
  loading.value = true;
  try {
    if (isEditing.value) {
      await jourFerieStore.updateJourFerie(currentSlug.value, form.value);
      Swal.fire('Succès', 'Jour férié mis à jour', 'success');
    } else {
      await jourFerieStore.createJourFerie(form.value);
      Swal.fire('Succès', 'Jour férié créé', 'success');
    }
    closeModal();
  } catch (error) {
    Swal.fire('Erreur', 'Une erreur est survenue lors de l\'enregistrement', 'error');
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (jour) => {
  Swal.fire({
    title: 'Supprimer ce jour férié ?',
    text: `Voulez-vous vraiment supprimer "${jour.titre}" ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  }).then(async (result) => {
    if (result.isConfirmed) {
      loading.value = true;
      try {
        await jourFerieStore.deleteJourFerie(jour.slug);
        Swal.fire('Supprimé', 'Le jour férié a été supprimé', 'success');
      } catch (error) {
        Swal.fire('Erreur', 'Impossible de supprimer ce jour', 'error');
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>

<style scoped>
.bh-table-responsive {
  border: none !important;
}
:deep(.bh-table-responsive table) {
  border-collapse: collapse !important;
}
:deep(.bh-table-responsive th) {
  background-color: rgb(249 250 251 / 0.5) !important;
  font-size: 0.75rem !important;
  line-height: 1rem !important;
  text-transform: uppercase !important;  
  letter-spacing: 0.05em !important;
  font-weight: 700 !important;
  color: rgb(107 114 128) !important;
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
  padding-left: 1.5rem !important;
  padding-right: 1.5rem !important;
  border-bottom-width: 1px !important;
  border-bottom-color: rgb(243 244 246) !important;
}
:deep(.bh-table-responsive td) {
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
  padding-left: 1.5rem !important;
  padding-right: 1.5rem !important;
  border-bottom-width: 1px !important;
  border-bottom-color: rgb(249 250 251) !important;
}
</style>

<!--
  Règles de mode sombre pour le tableau tierce-partie (bh-table), dans un bloc
  non scoped : ".dark" est posé sur <html>, un ANCÊTRE du composant, jamais un
  descendant. Un ":deep(.dark ...)" dans <style scoped> exige un descendant et
  ne matche donc jamais — d'où le fond d'en-tête qui restait clair en sombre.
-->
<style>
.dark .bh-table-responsive th {
  background-color: rgb(31 41 55 / 0.5) !important;
  color: rgb(156 163 175) !important;
  border-bottom-color: rgb(55 65 81) !important;
}
.dark .bh-table-responsive td {
  border-bottom-color: rgb(55 65 81 / 0.5) !important;
}
</style>
