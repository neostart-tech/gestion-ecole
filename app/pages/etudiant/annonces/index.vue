<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Espace étudiant', to: '/espace-etudiant' },
        { label: 'Annonces', to: null },
      ]"
      title="Liste des annonces"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Toolbar -->
    <div
      class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5"
    >
      <!-- Recherche -->
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Rechercher une annonce..."
        class="w-full lg:w-64 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <!-- Filtre par type de contrat -->
      <Dropdown
        v-model="filterType"
        :options="typeContratOptions"
        optionLabel="label"
        optionValue="value"
        filter
        showClear
        placeholder="Filtrer par type"
        class="w-full lg:w-48"
      />

      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Colonnes -->
        <client-only>
          <VDropdown placement="bottom-end">
            <button
              class="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Colonnes
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>

            <template #popper>
              <div
                class="w-56 p-3 rounded-lg shadow-lg bg-white dark:bg-gray-800"
              >
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
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-3 sm:p-4">
      <!-- Loader -->
      <div v-if="annonceStore.isLoading" class="flex justify-center py-10">
        <div
          class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"
        ></div>
      </div>

      <div v-else-if="filteredAnnonces.length === 0" class="text-center py-10">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        <p class="mt-2 text-gray-500 dark:text-gray-400">Aucune annonce trouvée</p>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="visibleColumns"
          :rows="tableRows"
          :search="searchQuery"
          :per-page="itemsPerPage"
          skin="bh-table-striped bh-table-hover"
        >
          <!-- Titre/Entreprise -->
          <template #titre="data">
            <div>
              <div class="font-medium text-gray-900 dark:text-white">
                {{ data.value.titre.slice(0, 25) }}<span v-if="data.value.titre.length > 50">...</span>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ data.value.entreprise }}
              </div>
            </div>
          </template>

          <!-- Type et Contrat -->
          <template #type_contrat="data">
            <div>
              <div class="text-sm text-gray-900 dark:text-white">
                {{ data.value.type_contrat }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ data.value.type_annonce }}
              </div>
            </div>
          </template>

          <!-- Ville -->
          <template #ville="data">
            <span class="text-sm text-gray-600 dark:text-gray-300">
              {{ data.value.ville }}
            </span>
          </template>

          <!-- Durée -->
          <template #duree="data">
            <span v-if="data.value.duree" class="text-sm text-gray-600 dark:text-gray-300">
              {{ data.value.duree }} mois
            </span>
            <span v-else class="text-sm text-gray-400 dark:text-gray-500">—</span>
          </template>

          <!-- Statut (Candidature) -->
          <template #statut="data">
            <div class="flex justify-center">
              <span
                v-if="data.value.applied"
                class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 border border-gray-200 rounded-md text-xs text-gray-600"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
                </svg>
                Déjà postulé
              </span>
              <span
                v-else
                class="inline-flex items-center px-2 py-1 bg-green-50 border border-green-200 rounded-md text-xs text-green-600"
              >
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Postuler
              </span>
            </div>
          </template>

          <!-- Actions -->
          <template #action="data">
            <div class="flex justify-center gap-3">
              <!-- Voir détails -->
              <NuxtLink
                :to="`/etudiant/annonces/${data.value.slug}/details`"
                class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                title="Voir détails"
              >
                <svg
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <path
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </NuxtLink>

              <!-- Postuler (si pas déjà postulé) -->
             

             
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue"
import Vue3Datatable from "@bhplugin/vue3-datatable"
import "@bhplugin/vue3-datatable/dist/style.css"
import Breadcrumb from "~/components/Breadcrumb.vue"
import Dropdown from "primevue/dropdown"
import { useAnnonceStore } from "~~/stores/annonce"

const annonceStore = useAnnonceStore()

// États
const searchQuery = ref("")
const filterType = ref("")
const itemsPerPage = ref(10)
const isMobile = ref(false)

// Détection mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth < 640
}

// Options pour le filtre
const typeContratOptions = [
  { label: "CDD", value: "Contrat à Durée Déterminée" },
  { label: "CDI", value: "Contrat à Durée Indéterminée" },
  { label: "Stage", value: "Stage" },
]

// Colonnes de la table
const columns = ref([
  { field: "titre", title: "Titre / Entreprise", sortable: true, visible: true },
  { field: "type_contrat", title: "Type / Contrat", sortable: true, visible: true },
  { field: "ville", title: "Ville", sortable: true, visible: false },
  { field: "duree", title: "Durée", sortable: true, visible: false },
  { field: "statut", title: "Statut", sortable: true, visible: true },
  { field: "action", title: "Actions", sortable: false, visible: true },
])

const visibleColumns = computed(() => columns.value.filter((c) => c.visible))

// Fonction de recherche
const filteredAnnonces = computed(() => {
  let result = annonceStore.mesannonces

  // Filtre par type de contrat
  if (filterType.value) {
    result = result.filter(a => a.type_contrat === filterType.value)
  }

  // Filtre par recherche textuelle
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(annonce => {
      const searchableFields = [
        annonce.advertiser?.nom,
        annonce.title,
        annonce.titre,
        annonce.type_annonce,
        annonce.type_contrat,
        annonce.ville,
      ].map(field => field?.toLowerCase() || '')

      return searchableFields.some(field => field.includes(query))
    })
  }

  return result
})

// Données pour la table
const tableRows = computed(() => {
  return filteredAnnonces.value.map(annonce => ({
    id: annonce.id,
    slug: annonce.slug,
    titre: annonce.title || annonce.titre || 'Sans titre',
    entreprise: annonce.advertiser?.nom || 'Annonceur',
    type_contrat: annonce.type_contrat || 'Non spécifié',
    type_annonce: annonce.type_annonce || 'Non spécifié',
    ville: annonce.ville || 'Non spécifiée',
    duree: annonce.duration || null,
    applied: annonce.applied || false,
    date_publication: annonce.date_publication,
  }))
})

// Charger les annonces
onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  await annonceStore.fetchAnnoncesEtudiant()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

