<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Prospects', to: '/' },
        { label: 'Liste des téléchargements de brochure', to: null },
      ]"
      title="Liste des prospects (Brochures)"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Toolbar -->
    <div class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5">
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Rechercher..."
        class="w-full lg:w-64 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div class="flex flex-col sm:flex-row gap-3 items-center">
        <select
          v-model="statusFilter"
          class="w-full sm:w-auto px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Tous les prospects</option>
          <option value="contacted">Contactés</option>
          <option value="not_contacted">Non contactés</option>
        </select>
        <!-- Menu Colonnes -->
        <client-only>
          <VDropdown placement="bottom-end">
            <button
              class="w-full sm:w-auto px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Colonnes
            </button>
            
            <template #popper>
              <div class="w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 border border-gray-200 dark:border-gray-700">
                <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">Affichage</h3>
                <div class="flex flex-col space-y-1">
                  <label 
                    v-for="col in columns" 
                    :key="col.field"
                    class="flex items-center px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors"
                  >
                    <input 
                      type="checkbox" 
                      v-model="col.visible" 
                      class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-indigo-500"
                    >
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ col.title }}</span>
                  </label>
                </div>
              </div>
            </template>
          </VDropdown>
        </client-only>
        <button
          @click="exportToCSV"
          :disabled="isExporting"
          class="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <svg v-if="!isExporting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <svg v-else class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isExporting ? 'Exportation...' : 'Exporter (Excel)' }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-3 sm:p-4">
      <div v-if="loading" class="flex justify-center py-10">
        <div class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="visibleColumns"
          :rows="filteredRows"
          :search="searchQuery"
          :per-page="itemsPerPage"
          skin="bh-table-striped bh-table-hover"
        >


          <template #status="{ value }">
            <span
              :class="[
                'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap',
                value.status === 'Non contacté'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
              ]"
            >
              {{ value.status }}
            </span>
          </template>

          <template #action="{ value }">
            <div class="flex justify-center gap-3">
              <button
                @click="openModal(value)"
                class="p-2 rounded-lg text-indigo-600 hover:bg-indigo-100 dark:text-indigo-400 dark:hover:bg-indigo-900/30 transition-colors"
                title="Voir les détails"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </button>
              <button
                v-if="value.status === 'Non contacté'"
                @click="toggleStatus(value)"
                class="p-2 rounded-lg text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                title="Marquer comme contacté"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 13l4 4L19 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              
              <button
                @click="deleteItem(value)"
                class="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
              >
               <ButtonDelete/>
              </button>
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>

    <!-- Modal Headless UI -->
    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25 dark:bg-black/40 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4 flex justify-between items-center">
                  <span>Détails du Prospect</span>
                  <button @click="closeModal" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </DialogTitle>
                
                <div class="mt-4 space-y-4" v-if="selectedProspect">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                      <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Nom complet</p>
                      <p class="font-medium text-gray-900 dark:text-white">{{ selectedProspect.nom }}</p>
                    </div>
                    
                    <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                      <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Téléphone</p>
                      <p class="font-medium text-gray-900 dark:text-white">{{ selectedProspect.tel }}</p>
                    </div>

                    <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 md:col-span-2">
                      <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                      <p class="font-medium text-gray-900 dark:text-white break-all">{{ selectedProspect.email }}</p>
                    </div>
                  </div>

                  <div class="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                    <p class="text-sm text-indigo-800 dark:text-indigo-300 font-medium mb-3 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      Formations téléchargées
                    </p>
                    <div class="flex flex-col gap-2">
                      <div 
                        v-for="(formation, index) in (selectedProspect.formation_visee || 'Non spécifié').split('|')" 
                        :key="index"
                        class="flex items-start gap-2 bg-white dark:bg-gray-800 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-800/50 shadow-sm"
                      >
                        <span class="text-indigo-500 mt-0.5">•</span>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ formation.trim() }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-6 flex justify-end">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-lg border border-transparent bg-indigo-100 dark:bg-indigo-900/50 px-4 py-2 text-sm font-medium text-indigo-900 dark:text-indigo-100 hover:bg-indigo-200 dark:hover:bg-indigo-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors"
                    @click="closeModal"
                  >
                    Fermer
                  </button>
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
import { ref, computed, onMounted } from "vue";
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useProspectStore } from "~~/stores/prospect";
import ButtonDelete from "~/components/ui/buttonDelete.vue";

const prospectStore = useProspectStore();
const { $toastr, $swal } = useNuxtApp();

const searchQuery = ref("");
const statusFilter = ref("all");
const loading = ref(true);
const itemsPerPage = ref(10);

const columns = ref([
  { field: "nom", title: "Nom", visible: true },
  { field: "email", title: "Email", visible: true },
  { field: "tel", title: "Téléphone", visible: true },
  { field: "status", title: "Statut", visible: true },
  { field: "date_formatted", title: "Date réception", visible: true },
  { field: "action", title: "Actions", visible: true },
]);

const isOpen = ref(false);
const selectedProspect = ref(null);

const openModal = (prospect) => {
  selectedProspect.value = prospect;
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
  setTimeout(() => {
    selectedProspect.value = null;
  }, 300);
};

const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

const filteredRows = computed(() => {
  let filtered = prospectStore.prospects;
  
  if (statusFilter.value === "contacted") {
    filtered = filtered.filter((p) => p.status);
  } else if (statusFilter.value === "not_contacted") {
    filtered = filtered.filter((p) => !p.status);
  }

  return filtered.map((p) => ({
    id: p.id,
    nom: p.nom,
    email: p.email ?? "--",
    tel: p.tel ?? "--",
    formation_visee: p.formation_visee ?? "--",
    status: p.status ? "Contacté" : "Non contacté",
    date_formatted: p.date_formatted ?? "--",
  }));
});

const isExporting = ref(false);

const exportToCSV = async () => {
  if (filteredRows.value.length === 0) {
    if ($toastr && $toastr.warning) {
      $toastr.warning("Aucune donnée à exporter.");
    }
    return;
  }

  isExporting.value = true;

  try {
    const { $axios } = useNuxtApp();
    const token = localStorage.getItem("gest-ecole-token");
    
    const response = await $axios.get(`/prospects/export?status=${statusFilter.value}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `prospects_${statusFilter.value}_${new Date().toISOString().split('T')[0]}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if ($toastr && $toastr.success) {
      $toastr.success("Exportation réussie.");
    }
  } catch (error) {
    console.error(error);
    if ($toastr && $toastr.error) {
      $toastr.error("Erreur lors de l'exportation.");
    }
  } finally {
    isExporting.value = false;
  }
};

const toggleStatus = async (value) => {
  const res = await $swal.fire({
    title: "Marquer comme contacté ?",
    text: `Voulez-vous marquer ${value.nom} comme contacté ?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Oui, marquer",
    cancelButtonText: "Annuler",
    confirmButtonColor: "#4f46e5"
  });

  if (res.isConfirmed) {
    try {
      await prospectStore.toggleStatus(value.id);
      await prospectStore.fetchProspects();
      if ($toastr && $toastr.success) {
        $toastr.success("Statut mis à jour avec succès.");
      }
    } catch (error) {
      console.error(error);
      if ($toastr && $toastr.error) {
        $toastr.error("Erreur lors de la mise à jour du statut.");
      }
    }
  }
};

const deleteItem = async (p) => {
  const res = await $swal.fire({
    title: "Supprimer ce prospect ?",
    text: "Cette action est irréversible.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
    confirmButtonColor: "#dc2626"
  });

  if (res.isConfirmed) {
    try {
      await prospectStore.deleteProspect(p.id);
      await prospectStore.fetchProspects();
      if ($toastr && $toastr.success) {
        $toastr.success("Prospect supprimé avec succès.");
      }
    } catch (error) {
      console.error(error);
      if ($toastr && $toastr.error) {
        $toastr.error("Erreur lors de la suppression.");
      }
    }
  }
};

onMounted(async () => {
  await prospectStore.fetchProspects();
  loading.value = false;
});
</script>
