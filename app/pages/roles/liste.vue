<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Administration', to: '/' },
        { label: 'Accès', to: null },
      ]"
      title="Rôles"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Toolbar -->
    <div class="flex flex-col sm:flex-row gap-3 items-center justify-between mb-5">
      <!-- Recherche -->
      <div class="relative w-full sm:w-80">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher un rôle..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <!-- Bouton ajouter -->
      <Can action="create-role">
        <button
          @click="openAddModal"
          class="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors whitespace-nowrap"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Ajouter un rôle
        </button>
      </Can>
    </div>

    <!-- Tableau -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 overflow-hidden">
      <Vue3Datatable
        :columns="availableColumns"
        :rows="filteredRoles"
        :per-page="10"
        :search="searchQuery"
        :pagination-options="{ 
          dropdown: true, 
          edge: true,
          nav: 'scroll',
          position: 'bottom'
        }"
        :searchable="true"
        :sortable="true"
        :filterable="true"
        :loading="roleStore.isLoading"
        :totalRows="filteredRoles.length"
        skin="bh-table-striped bh-table-hover"
      >
        <!-- Colonne Nom -->
        <template #nom="data">
          <div class="flex items-center gap-3">
            <div :class="['flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs', roleColorClass(data.value.nom)]">
              {{ initialsOf(data.value.nom) }}
            </div>
            <span class="font-medium text-gray-900 dark:text-white">{{ data.value.nom }}</span>
          </div>
        </template>


        <!-- Colonne Permissions -->
        <template #permissions="data">
          <div class="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs">
            <span class="font-bold">{{ data.value.permissions?.length || 0 }}</span>
            <span class="font-medium uppercase tracking-wider">perm.</span>
          </div>
        </template>

        <!-- Colonne Actions -->
        <template #action="data">
          <div class="flex items-center gap-2">
            <Can action="assign-role-permissions">
              <NuxtLink :to="`/roles/${data.value.slug}/permissions`" class="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/30 rounded-lg transition-colors" title="Gérer les permissions">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </NuxtLink>
            </Can>
            <Can action="update-role">
              <button @click="openEditModal(data.value)" class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Modifier le rôle">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.94l-3.05 1.144 1.144-3.05a4 4 0 01.94-1.414z"/>
                </svg>
              </button>
            </Can>
            <Can action="delete-role">
              <button @click="confirmDeleteRole(data.value)" class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Supprimer le rôle">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </Can>
          </div>
        </template>
      </Vue3Datatable>
    </div>

    <!-- Modal d'ajout / modification de rôle -->
    <div v-if="showFormModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" @click.self="closeFormModal">
      <div class="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-xl overflow-hidden">
        <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ editingRole ? "Modifier le rôle" : "Ajouter un rôle" }}
          </h3>
          <button @click="closeFormModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="p-6">
          <form @submit.prevent="submitRoleForm" class="space-y-4">
            <div>
              <label for="role-nom-input" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom du rôle *</label>
              <input
                type="text"
                id="role-nom-input"
                v-model="roleForm.nom"
                class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Administrateur"
                required
              />
            </div>
            <div class="flex justify-end gap-3 pt-4">
              <button type="button" @click="closeFormModal" class="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                Annuler
              </button>
              <button type="submit" :disabled="savingForm" class="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors">
                {{ savingForm ? "Enregistrement..." : (editingRole ? "Mettre à jour" : "Créer le rôle") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useRoleStore } from "~~/stores/role";
import { useNuxtApp } from "#app";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";

const roleStore = useRoleStore();

const searchQuery = ref("");
const showFormModal = ref(false);
const editingRole = ref(null);
const savingForm = ref(false);

const roleForm = ref({ nom: "" });

const availableColumns = ref([
  { field: "nom", title: "Nom du rôle", isUnique: true },
  { field: "permissions", title: "Permissions" },
  { field: "action", title: "Actions", sort: false, width: "150px" }
]);

onMounted(async () => {
  await roleStore.fetchRoles();
});

const filteredRoles = computed(() => {
  if (!searchQuery.value) return roleStore.roles;

  const query = searchQuery.value.toLowerCase();
  return roleStore.roles.filter((role) =>
    role.nom.toLowerCase().includes(query) || role.slug.toLowerCase().includes(query)
  );
});

const initialsOf = (nom) => {
  if (!nom) return "?";
  return nom
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
};

const ROLE_COLOR_COUNT = 8;
const roleColorClass = (nom) => {
  let hash = 0;
  const str = nom || "";
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  
  const colors = [
    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  ];
  
  return colors[hash % ROLE_COLOR_COUNT];
};

const openAddModal = () => {
  editingRole.value = null;
  roleForm.value = { nom: "" };
  showFormModal.value = true;
};

const openEditModal = (role) => {
  editingRole.value = role;
  roleForm.value = { nom: role.nom };
  showFormModal.value = true;
};

const closeFormModal = () => {
  showFormModal.value = false;
  editingRole.value = null;
  roleForm.value = { nom: "" };
};

const submitRoleForm = async () => {
  const { $toastr } = useNuxtApp();
  
  if (!roleForm.value.nom.trim()) {
    $toastr.error("Veuillez saisir un nom de rôle");
    return;
  }

  savingForm.value = true;
  try {
    if (editingRole.value) {
      await roleStore.updateRole(editingRole.value.slug, { nom: roleForm.value.nom });
      $toastr.success("Rôle mis à jour avec succès");
    } else {
      await roleStore.addRole({ nom: roleForm.value.nom, permissions: [] });
      $toastr.success("Rôle créé avec succès");
    }
    closeFormModal();
  } catch (error) {
    $toastr.error(error.response?.data?.message || "Erreur lors de l'enregistrement du rôle.");
  } finally {
    savingForm.value = false;
  }
};

const confirmDeleteRole = async (role) => {
  const { $swal, $toastr } = useNuxtApp();
  
  if (role.permissions && role.permissions.length > 0) {
    await $swal.fire({
      title: "Action impossible",
      text: `Le rôle "${role.nom}" possède ${role.permissions.length} permission(s) assignée(s). Vous devez d'abord lui retirer toutes ses permissions avant de pouvoir le supprimer.`,
      icon: "error",
      confirmButtonColor: "#4f46e5",
      confirmButtonText: "Compris",
    });
    return;
  }
  
  const result = await $swal.fire({
    title: "Supprimer ?",
    text: `Voulez-vous supprimer le rôle "${role.nom}" ? Cette action est irréversible.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
  });

  if (result.isConfirmed) {
    try {
      await roleStore.deleteRole(role.slug);
      $toastr.success("Rôle supprimé avec succès");
    } catch (error) {
      $toastr.error(error.response?.data?.message || "Erreur lors de la suppression du rôle.");
    }
  }
};
</script>
