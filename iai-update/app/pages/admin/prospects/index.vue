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
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-3 sm:p-4">
      <div v-if="loading" class="flex justify-center py-10">
        <div class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="visibleColumns"
          :rows="rows"
          :search="searchQuery"
          :per-page="itemsPerPage"
          skin="bh-table-striped bh-table-hover"
        >
          <template #status="{ value }">
            <span
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                value.status === 'Non contacté'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
              ]"
            >
              {{ value.status }}
            </span>
          </template>

          <template #action="{ value }">
            <div class="flex justify-center gap-3">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useProspectStore } from "~~/stores/prospect";
import ButtonDelete from "~/components/ui/buttonDelete.vue";

const prospectStore = useProspectStore();
const { $toastr, $swal } = useNuxtApp();

const searchQuery = ref("");
const loading = ref(true);
const itemsPerPage = ref(10);

const columns = ref([
  { field: "nom", title: "Nom", visible: true },
  { field: "email", title: "Email", visible: true },
  { field: "tel", title: "Téléphone", visible: true },
  { field: "formation_visee", title: "Formation", visible: true },
  { field: "status", title: "Statut", visible: true },
  { field: "date_formatted", title: "Date réception", visible: true },
  { field: "action", title: "Actions", visible: true },
]);

const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

const rows = computed(() =>
  prospectStore.prospects.map((p) => ({
    id: p.id,
    nom: p.nom,
    email: p.email ?? "--",
    tel: p.tel ?? "--",
    formation_visee: p.formation_visee ?? "--",
    status: p.status ? "Contacté" : "Non contacté",
    date_formatted: p.date_formatted ?? "--",
  }))
);

const toggleStatus = async (value) => {
  try {
    await prospectStore.toggleStatus(value.id);
    await prospectStore.fetchProspects();
  } catch (error) {
    console.error(error);
  }
};

const deleteItem = async (p) => {
  const res = await $swal.fire({
    title: "Supprimer ce prospect ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Supprimer",
  });

  if (res.isConfirmed) {
    try {
      await prospectStore.deleteProspect(p.id);
      await prospectStore.fetchProspects();
    } catch (error) {
      console.error(error);
    }
  }
};

onMounted(async () => {
  await prospectStore.fetchProspects();
  loading.value = false;
});
</script>
