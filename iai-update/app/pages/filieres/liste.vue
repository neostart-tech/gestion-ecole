<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">

    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Filieres', to: '/' },
        { label: 'Liste', to: null },
      ]"
      title="Liste des filières"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Toolbar -->
    <div class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5">

      <!-- Recherche -->
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Rechercher..."
        class="w-full lg:w-64 px-4 py-2 rounded-lg border
               bg-white dark:bg-gray-800
               border-gray-300 dark:border-gray-700
               text-gray-900 dark:text-white
               placeholder-gray-400
               focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div class="flex flex-col sm:flex-row gap-3">

        <!-- Colonnes -->
        <client-only>
          <VDropdown placement="bottom-end">
            <button
              class="flex items-center gap-2 px-4 py-2 rounded-lg border
                     bg-white dark:bg-gray-800
                     border-gray-300 dark:border-gray-700
                     text-gray-700 dark:text-gray-200
                     hover:bg-gray-100 dark:hover:bg-gray-700
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Colonnes
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 9l6 6 6-6" stroke-width="2" stroke-linecap="round" />
              </svg>
            </button>

            <template #popper>
              <div class="w-56 p-3 rounded-lg shadow-lg bg-white dark:bg-gray-800">
                <div
                  v-for="col in columns"
                  :key="col.field"
                  class="flex items-center gap-2 py-1"
                >
                  <input
                    type="checkbox"
                    v-model="col.visible"
                    :disabled="col.field === 'action'"
                    class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">
                    {{ col.title }}
                  </span>
                </div>
              </div>
            </template>
          </VDropdown>
        </client-only>

        <!-- Ajouter -->
        <button
          @click="openAddModal"
          class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                 bg-indigo-600 text-white hover:bg-indigo-700
                 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round" />
          </svg>
          Ajouter
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-3 sm:p-4">

      <div v-if="loading" class="flex justify-center py-10">
        <div class="h-10 w-10 animate-spin rounded-full
                    border-2 border-indigo-600 border-t-transparent"></div>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="visibleColumns"
          :rows="rows"
          :search="searchQuery"
          :per-page="itemsPerPage"
          skin="bh-table-striped bh-table-hover"
        >
        
          <template #action="{ value }">
            <div class="flex justify-center gap-3">

              <!-- Edit -->
              <button
                @click="openEditModal(value)"
                class="p-2 rounded-lg text-blue-600
                       hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M4 20h4l10-10-4-4L4 16v4z"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>

              <!-- Delete -->
              <button
                @click="deleteItem(value)"
                class="p-2 rounded-lg text-red-600
                       hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M3 6h18M8 6v14m8-14v14M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </button>

            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>

    <!-- Modal -->
    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeModal">

        <div class="fixed inset-0 bg-black/60" />

        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            class="w-full max-w-md rounded-xl
                   bg-white dark:bg-gray-800 p-5"
          >
            <DialogTitle class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {{ modalTitle }}
            </DialogTitle>

            <form @submit.prevent="saveFiliere" class="space-y-4">

              <input
                v-model="form.nom"
                placeholder="Nom"
                required
                class="w-full px-4 py-2 rounded-lg border
                       bg-white dark:bg-gray-700
                       border-gray-300 dark:border-gray-600
                       focus:ring-2 focus:ring-indigo-500"
              />

              <input
                v-model="form.code"
                placeholder="Code"
                required
                class="w-full px-4 py-2 rounded-lg border uppercase
                       bg-white dark:bg-gray-700
                       border-gray-300 dark:border-gray-600
                       focus:ring-2 focus:ring-indigo-500"
              />

              <textarea
                v-model="form.description"
                placeholder="Description"
                rows="3"
                class="w-full px-4 py-2 rounded-lg border
                       bg-white dark:bg-gray-700
                       border-gray-300 dark:border-gray-600
                       focus:ring-2 focus:ring-indigo-500"
              />

              <div class="flex justify-end gap-3">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 rounded-lg border
                         border-gray-300 dark:border-gray-600"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  class="px-4 py-2 rounded-lg bg-indigo-600 text-white
                         hover:bg-indigo-700"
                >
                  Enregistrer
                </button>
              </div>

            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import Vue3Datatable from "@bhplugin/vue3-datatable"
import "@bhplugin/vue3-datatable/dist/style.css"
import { Dialog, DialogPanel, DialogTitle, TransitionRoot } from "@headlessui/vue"
import Breadcrumb from "~/components/Breadcrumb.vue"
import { useFiliereStore } from "../../../stores/filiere"

const { $toastr, $swal } = useNuxtApp()
const filiereStore = useFiliereStore()

const searchQuery = ref("")
const loading = ref(true)
const showModal = ref(false)
const modalTitle = ref("")
const itemsPerPage = ref(10)

const form = ref({
  id: null,
  nom: "",
  code: "",
  description: ""
})

const columns = ref([
  { field: "nom", title: "Nom", visible: true },
  { field: "code", title: "Code", visible: false },
  { field: "inscrits", title: "Inscrits", visible: true },
   { field: "description", title: "Description", visible: false },
  { field: "action", title: "Actions", visible: true }
])

const visibleColumns = computed(() =>
  columns.value.filter(c => c.visible)
)

const rows = computed(() =>
  filiereStore.filieres.map(f => ({
    slug: f.slug,
    nom: f.nom,
    code: f.code,
     description: f.description,
    inscrits: f.etudiant_counts ?? 0
  }))
)

const openAddModal = () => {
  modalTitle.value = "Créer une filière"
  form.value = { nom: "", code: "", description: "" }
  showModal.value = true
}

const openEditModal = f => {
  modalTitle.value = "Modifier la filière"
  form.value = { ...f, id: f.id }
  showModal.value = true
}

const closeModal = () => (showModal.value = false)

const saveFiliere = async () => {
  try {
    form.value.id
      ? await filiereStore.updateFiliere(form.value.id, form.value)
      : await filiereStore.addFiliere(form.value)

    await filiereStore.fetchFilieres()
    $toastr.success("Succès")
    closeModal()
  } catch(error) {
    console.log(error)
    $toastr.error(error.response.data.message)
  }
}

const deleteItem = async filiere => {
  const res = await $swal.fire({
    title: "Supprimer cette filière ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Supprimer"
  })

  if (res.isConfirmed) {
    await filiereStore.deleteFiliere(filiere.slug)
    await filiereStore.fetchFilieres()
    $toastr.success("Filiere supprimée avec succes")
  }
}

onMounted(async () => {
  await filiereStore.fetchFilieres()
  loading.value = false
})
</script>
