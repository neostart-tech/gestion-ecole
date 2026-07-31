<template>
  <div class="min-h-screen bg-[#f3f3f8] dark:bg-[#08080f] font-sans transition-colors duration-500 relative">
    <!-- Fond d'ambiance violet -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#7F45FD]/15 dark:bg-[#7F45FD]/25 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
      <div class="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#7F45FD]/15 dark:bg-[#7F45FD]/25 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjN0Y0NUZEIiBmaWxsLW9wYWNpdHk9IjAuMDgiPjxwYXRoIGQ9Ik0zNiAzNHYtNGgxdjRoLTF6bTAgM3YtMWgxdjFoLTF6bTAgNHYtMWgxdjFoLTF6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
    </div>

    <div class="relative z-10 w-full p-4 sm:p-6 lg:p-8">
      <Breadcrumb
        :items="[
          { label: 'Administration', to: '/' },
          { label: 'Sauvegardes du système', to: null },
        ]"
        title="Sauvegardes & Sécurité"
        :title-class="'text-xl md:text-2xl text-gray-800 dark:text-gray-100'"
        :spacing="'mb-2'"
        :link-color="'text-[#7F45FD] dark:text-[#a882ff] hover:text-[#6a35e8] dark:hover:text-[#c4a9ff]'"
        :active-color="'text-gray-900 dark:text-gray-100 font-medium'"
        :text-size="'text-base'"
        align="left"
      />

      <!-- Carte principale -->
      <div class="mt-6 bg-white dark:bg-[#11111e] border border-[#e8e8f0] dark:border-[#1a1a2a] rounded-2xl shadow-[0_8px_30px_rgba(127,69,253,0.04)] overflow-hidden">
        <!-- En-tête avec boutons de génération -->
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 lg:p-6 border-b border-[#e8e8f0] dark:border-[#1a1a2a]">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-8 bg-[#7F45FD] rounded-full shrink-0"></div>
            <div>
              <h1 class="text-2xl font-black text-[#1a1a2a] dark:text-[#fafafe] tracking-tight">Sauvegardes du Système</h1>
              <p class="text-sm text-[#8a8a9a] font-medium">Générez et téléchargez des copies de sécurité de votre base de données et de vos fichiers</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              :disabled="backupStore.isGenerating"
              class="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#7F45FD] hover:bg-[#6a35e8] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-md shadow-[#7F45FD]/20"
              @click="handleGenerate('db')"
            >
              <svg v-if="!backupStore.isGenerating" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s-8-1.79-8-4" />
              </svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Sauvegarder la BDD (.sql)</span>
            </button>

            <button
              type="button"
              :disabled="backupStore.isGenerating"
              class="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all"
              @click="handleGenerate('full')"
            >
              <svg v-if="!backupStore.isGenerating" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Sauvegarde Complète (.zip)</span>
            </button>
          </div>
        </div>

        <!-- Barre de recherche -->
        <div class="p-4 lg:p-5 border-b border-[#e8e8f0] dark:border-[#1a1a2a]">
          <div class="relative max-w-md">
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Rechercher par nom de fichier..."
              class="w-full pl-11 pr-4 py-2.5 text-sm bg-[#fafafe] dark:bg-[#0a0a12] border border-[#e8e8f0] dark:border-[#1a1a2a] rounded-xl focus:ring-2 focus:ring-[#7F45FD]/20 focus:border-[#7F45FD] outline-none transition-all text-[#1a1a2a] dark:text-white placeholder-[#8a8a9a]"
            />
            <svg class="w-5 h-5 absolute left-4 top-2.5 text-[#8a8a9a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Table des sauvegardes -->
        <div class="backup-table overflow-x-auto">
          <Vue3Datatable
            :rows="filteredBackups"
            :columns="columns"
            :loading="backupStore.isLoading"
            :sortable="true"
            skin="bh-table-striped bh-table-hover"
            class="w-full text-left"
          >
            <!-- Slot Nom du fichier -->
            <template #filename="data">
              <div class="flex items-center gap-3">
                <div class="p-2.5 rounded-xl shrink-0" :class="data.value.extension === 'zip' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-purple-100 dark:bg-purple-900/30 text-[#7F45FD] dark:text-[#a882ff]'">
                  <svg v-if="data.value.extension === 'zip'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8-4" />
                  </svg>
                </div>
                <div>
                  <span class="font-mono text-sm font-semibold text-[#1a1a2a] dark:text-white block tracking-tight">{{ data.value.filename }}</span>
                  <span class="text-xs text-[#8a8a9a] font-medium">{{ data.value.extension.toUpperCase() }} File</span>
                </div>
              </div>
            </template>

            <!-- Slot Type -->
            <template #type="data">
              <span
                class="px-3 py-1.5 text-xs font-semibold rounded-lg inline-flex items-center gap-2"
                :class="data.value.type.includes('Complet') ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40' : 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40'"
              >
                <span class="w-2 h-2 rounded-full shrink-0" :class="data.value.type.includes('Complet') ? 'bg-amber-500' : 'bg-[#7F45FD]'"></span>
                {{ data.value.type }}
              </span>
            </template>

            <!-- Slot Taille -->
            <template #size_formatted="data">
              <span class="font-mono text-sm text-gray-700 dark:text-gray-300 font-semibold">
                {{ data.value.size_formatted }}
              </span>
            </template>

            <!-- Slot Date -->
            <template #created_at="data">
              <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {{ data.value.created_at }}
              </span>
            </template>

            <!-- Slot Actions -->
            <template #actions="data">
              <div class="flex items-center gap-2.5 justify-end">
                <button
                  type="button"
                  title="Télécharger la sauvegarde"
                  class="p-2.5 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 rounded-xl transition-all shadow-sm"
                  @click="handleDownload(data.value.filename)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>

                <button
                  type="button"
                  title="Supprimer la sauvegarde"
                  class="p-2.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-xl transition-all shadow-sm"
                  @click="handleDelete(data.value.filename)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </template>
          </Vue3Datatable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useBackupStore } from "~~/stores/backup";
import Swal from "sweetalert2";

const backupStore = useBackupStore();
const searchQuery = ref("");

const columns = [
  { field: "filename", title: "Fichier de Sauvegarde" },
  { field: "type", title: "Type" },
  { field: "size_formatted", title: "Taille" },
  { field: "created_at", title: "Date de Création" },
  { field: "actions", title: "Actions", sort: false, headerClass: "!text-right pr-6", cellClass: "!text-right pr-6" },
];

const filteredBackups = computed(() => {
  if (!searchQuery.value.trim()) {
    return backupStore.backups;
  }
  const q = searchQuery.value.toLowerCase();
  return backupStore.backups.filter((b) => b.filename.toLowerCase().includes(q));
});

onMounted(() => {
  backupStore.fetchBackups();
});

const handleGenerate = async (type) => {
  const typeText = type === "full" ? "complète (Base + Storage)" : "de la base de données";
  const confirm = await Swal.fire({
    title: "Générer une sauvegarde ?",
    text: `Voulez-vous créer une sauvegarde ${typeText} ?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#7F45FD",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Oui, sauvegarder",
    cancelButtonText: "Annuler",
  });

  if (!confirm.isConfirmed) return;

  try {
    const res = await backupStore.generateBackup(type);
    Swal.fire({
      title: "Succès !",
      text: res.message || "Sauvegarde générée avec succès.",
      icon: "success",
      confirmButtonColor: "#7F45FD",
    });
  } catch (error) {
    Swal.fire({
      title: "Erreur",
      text: error?.response?.data?.message || "Échec de la génération de la sauvegarde.",
      icon: "error",
      confirmButtonColor: "#7F45FD",
    });
  }
};

const handleDownload = async (filename) => {
  try {
    await backupStore.downloadBackup(filename);
  } catch (error) {
    Swal.fire({
      title: "Erreur",
      text: "Impossible de télécharger le fichier de sauvegarde.",
      icon: "error",
      confirmButtonColor: "#7F45FD",
    });
  }
};

const handleDelete = async (filename) => {
  const confirm = await Swal.fire({
    title: "Supprimer la sauvegarde ?",
    text: `Êtes-vous sûr de vouloir supprimer définitivement ${filename} ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
  });

  if (!confirm.isConfirmed) return;

  try {
    await backupStore.deleteBackup(filename);
    Swal.fire({
      title: "Supprimé !",
      text: "Le fichier de sauvegarde a été supprimé.",
      icon: "success",
      confirmButtonColor: "#7F45FD",
    });
  } catch (error) {
    Swal.fire({
      title: "Erreur",
      text: error?.response?.data?.message || "Échec de la suppression.",
      icon: "error",
      confirmButtonColor: "#7F45FD",
    });
  }
};
</script>

<style scoped>
.backup-table :deep(.bh-datatable table tbody tr) {
  border-bottom: 1px solid #e8e8f0;
}
.dark .backup-table :deep(.bh-datatable table tbody tr) {
  border-bottom-color: #1a1a2a;
  color: #fafafe;
}
.backup-table :deep(.bh-datatable table tbody tr:hover) {
  background-color: rgba(127, 69, 253, 0.03);
}
.dark .backup-table :deep(.bh-datatable table tbody tr:hover) {
  background-color: rgba(127, 69, 253, 0.08);
}
.backup-table :deep(.bh-datatable thead th) {
  background-color: #fafafe !important;
  color: #8a8a9a !important;
  font-weight: 800 !important;
  text-transform: uppercase;
  font-size: 0.725rem !important;
  letter-spacing: 0.08em;
  padding: 1.1rem 1.5rem !important;
  border-bottom: 1px solid #e8e8f0 !important;
}
.dark .backup-table :deep(.bh-datatable thead th) {
  background-color: #0a0a12 !important;
  color: #8a8a9a !important;
  border-bottom-color: #1a1a2a !important;
}
.backup-table :deep(.bh-datatable table td) {
  padding: 1.25rem 1.5rem !important;
  vertical-align: middle;
}
.backup-table :deep(.bh-pagination) {
  padding: 1.25rem 1.5rem !important;
  border-top: 1px solid #e8e8f0;
  background-color: transparent !important;
}
.dark .backup-table :deep(.bh-pagination) {
  border-top-color: #1a1a2a;
}
</style>
