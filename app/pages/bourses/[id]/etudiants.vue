<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Bourses', to: '/bourses/liste' },
        { label: bourse?.nom || 'Détails', to: null },
      ]"
      :title="`Gestion des étudiants - ${bourse?.nom || 'Bourse'}`"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Info bourse avec skeleton loading -->
    <div v-if="isPageLoading" class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-5">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center gap-4 w-full sm:w-auto">
          <div class="p-3 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse h-16 w-16"></div>
          <div class="flex-1">
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48 mb-2"></div>
            <div class="flex gap-3">
              <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-20"></div>
              <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
            </div>
          </div>
        </div>
        <div class="flex gap-4 w-full sm:w-auto justify-end">
          <div class="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-24"></div>
          <div class="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-24"></div>
        </div>
      </div>
    </div>

    <!-- Info bourse (chargé) -->
    <div
      v-else
      class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div class="flex items-center gap-4 w-full sm:w-auto">
        <div
          class="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl"
        >
          <svg
            class="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ bourse?.nom }}
          </h2>
          <div class="flex flex-wrap gap-2 mt-1">
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                bourse?.type === 'pourcentage'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
              ]"
            >
              {{
                bourse?.type === "pourcentage" ? "Pourcentage" : "Montant fixe"
              }}
            </span>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Valeur:
              <span class="font-semibold">
                {{
                  bourse?.type === "pourcentage"
                    ? bourse?.valeur + "%"
                    : formatMontant(bourse?.valeur)
                }}
              </span>
            </span>
          </div>
        </div>
      </div>

      <!-- Statistiques avec design responsive -->
      <div class="flex gap-3 w-full sm:w-auto justify-end">
        <div
          class="text-center px-3 sm:px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex-1 sm:flex-none"
        >
          <p class="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {{ boursiers.length }}
          </p>
          <p class="text-xs text-gray-600 dark:text-gray-400">Boursiers</p>
        </div>
        <div
          class="text-center px-3 sm:px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg flex-1 sm:flex-none"
        >
          <p class="text-xl sm:text-2xl font-bold text-gray-600 dark:text-gray-400">
            {{ totalEtudiants }}
          </p>
          <p class="text-xs text-gray-600 dark:text-gray-400">
            Total étudiants
          </p>
        </div>
      </div>
    </div>

    <!-- Deux onglets : Liste des étudiants et Boursiers -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
      <!-- En-tête avec onglets -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="flex -mb-px overflow-x-auto">
          <button
            @click="activeTab = 'etudiants'"
            :class="[
              'px-4 sm:px-6 py-3 text-sm font-medium transition-colors duration-200 whitespace-nowrap',
              activeTab === 'etudiants'
                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
            ]"
          >
            <span class="flex items-center gap-2">
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span class="hidden sm:inline">Tous les étudiants</span>
              <span class="sm:hidden">Étudiants</span>
            </span>
          </button>
          <button
            @click="activeTab = 'boursiers'"
            :class="[
              'px-4 sm:px-6 py-3 text-sm font-medium transition-colors duration-200 whitespace-nowrap',
              activeTab === 'boursiers'
                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
            ]"
          >
            <span class="flex items-center gap-2">
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span class="hidden sm:inline">Boursiers</span>
              <span class="sm:hidden">Boursiers ({{ boursiers.length }})</span>
            </span>
          </button>
        </nav>
      </div>

      <!-- Barre de recherche et filtres -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex flex-col lg:flex-row gap-3 justify-between">
          <div class="relative flex-1">
            <input
              v-model="searchQuery"
              type="search"
              :placeholder="
                activeTab === 'etudiants'
                  ? 'Rechercher un étudiant...'
                  : 'Rechercher un boursier...'
              "
              class="w-full px-4 py-2 pl-10 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <svg
              class="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Filtre par niveau/filière -->
            <Dropdown
              v-model="filtreNiveau"
              :options="niveauOptions"
              optionLabel="label"
              optionValue="value"
              filter
              showClear
              placeholder="Filtrer par niveau"
              class="w-full sm:w-64"
            />

            <!-- Sélecteur de colonnes -->
            <client-only>
              <VDropdown placement="bottom-end">
                <button
                  class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span class="hidden sm:inline">Colonnes</span>
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
                    class="w-56 p-3 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  >
                    <div
                      v-for="col in columns"
                      :key="col.field"
                      class="flex items-center gap-2 py-1.5"
                    >
                      <input
                        type="checkbox"
                        v-model="col.visible"
                        :disabled="col.field === 'actions'"
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
      </div>

      <!-- Loading state pour le tableau -->
      <div v-if="isPageLoading" class="p-4">
        <div class="space-y-3">
          <div v-for="i in 5" :key="i" class="flex gap-4 animate-pulse">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
        </div>
      </div>

      <!-- Tableau des étudiants avec Vue3Datatable -->
      <div v-else class="p-4">
        <div v-if="isLoading" class="flex justify-center py-10">
          <div
            class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"
          ></div>
        </div>

        <div v-else>
          <!-- Message si aucun résultat -->
          <div v-if="filteredEtudiants.length === 0" class="text-center py-10">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-600 dark:text-gray-400">
              Aucun {{ activeTab === 'etudiants' ? 'étudiant' : 'boursier' }} trouvé
            </p>
          </div>

          <Vue3Datatable
            v-else
            :columns="visibleColumns"
            :rows="filteredEtudiants"
            :search="searchQuery"
            :per-page="itemsPerPage"
            :page="currentPage"
            @update:page="currentPage = $event"
            skin="bh-table-striped bh-table-hover"
            class="w-full"
          >
            <!-- Colonne Matricule -->
            <!-- <template #matricule="data">
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ data.value.matricule }}
              </span>
            </template> -->

            <!-- Colonne Nom & Prénom avec avatar -->
            <template #nom_prenom="data">
              <div class="flex items-center gap-2">
                <!-- <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {{ data.value.nom?.charAt(0) }}{{ data.value.prenom?.charAt(0) }}
                </div> -->
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ data.value.nom }} {{ data.value.prenom }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ data.value.email }}
                  </p>
                </div>
              </div>
            </template>

            <!-- Colonne Niveau -->
            <template #niveau="data">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ data.value.dernier_groupe?.niveau?.nom || "Non défini" }}
              </span>
            </template>

            <!-- Colonne Filière -->
            <template #filiere="data">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ data.value.dernier_groupe?.filiere?.nom || "Non défini" }}
              </span>
            </template>

            <!-- Colonne Actions avec design responsive -->
           <!-- Colonne Actions avec design responsive -->
<template #actions="data">
  <div v-if="activeTab === 'etudiants'">
    <!-- Bouton Affecter (pour les non-boursiers) -->
    <Can v-if="!estBoursier(data.value.id)" action="affecter-bourse">
      <button
        @click="affecterBourse(data.value)"
        class="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-sm hover:shadow text-xs sm:text-sm w-full sm:w-auto justify-center font-medium"
      >
        <svg
          class="w-3 h-3 sm:w-4 sm:h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>Affecter</span>
      </button>
    </Can>

    <!-- Badge Déjà boursier - Nouveau design élégant -->
    <div
      v-else
      class="group relative inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs sm:text-sm w-full sm:w-auto justify-center border border-emerald-200 dark:border-emerald-800/50 shadow-sm"
    >
      <!-- Icône avec animation -->
      <div class="relative">
        <svg
          class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 transition-transform group-hover:scale-110"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <!-- Petit point vert de statut -->
        <span class="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse ring-1 ring-white dark:ring-gray-800"></span>
      </div>
      
      <!-- Texte avec effet de gradient sur hover -->
      <span class="font-medium bg-gradient-to-r from-emerald-700 to-teal-700 dark:from-emerald-300 dark:to-teal-300 bg-clip-text text-transparent group-hover:from-emerald-600 group-hover:to-teal-600 transition-all duration-300">
        <span class="hidden sm:inline">Déjà boursier</span>
        <span class="sm:hidden">Boursier</span>
      </span>

      <!-- Badge "Actif" subtil -->
      <span class="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-200/50 dark:bg-emerald-800/30 text-emerald-800 dark:text-emerald-200 ml-1">
        Actif
      </span>
    </div>
  </div>

  <div v-else>
    <!-- Bouton Retirer (pour les boursiers) avec design amélioré -->
    <Can action="affecter-bourse">
      <button
        @click="retirerBourse(data.value)"
        class="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-lg hover:from-rose-700 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow text-xs sm:text-sm w-full sm:w-auto justify-center font-medium group"
      >
        <svg
          class="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 12H4"
          />
        </svg>
        <span>Retirer</span>
      </button>
    </Can>
  </div>
</template>
          </Vue3Datatable>

          <!-- Pagination info responsive -->
          <div class="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center sm:text-right">
            Affichage de {{ filteredEtudiants.length }} résultat{{ filteredEtudiants.length > 1 ? 's' : '' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation pour affecter/retirer -->
    <TransitionRoot appear :show="showConfirmModal" as="template">
      <Dialog as="div" class="relative z-50" @close="showConfirmModal = false">
        <div class="fixed inset-0 bg-black/60" />

        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            class="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-5 mx-4"
          >
            <DialogTitle
              class="text-lg font-semibold mb-2 text-gray-900 dark:text-white"
            >
              {{ confirmTitle }}
            </DialogTitle>

            <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {{ confirmMessage }}
            </p>

            <div class="flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                @click="showConfirmModal = false"
                class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors order-2 sm:order-1"
              >
                Annuler
              </button>

              <button
                type="button"
                @click="confirmAction"
                class="px-4 py-2 rounded-lg text-white transition-colors order-1 sm:order-2"
                :class="
                  confirmType === 'affecter'
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-red-600 hover:bg-red-700'
                "
              >
                {{
                  confirmType === "affecter" ? "Oui, affecter" : "Oui, retirer"
                }}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import { useRoute } from "vue-router";
import "@bhplugin/vue3-datatable/dist/style.css";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
} from "@headlessui/vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useBourseStore } from "~~/stores/bourse";
import { useEtudiantStore } from "~~/stores/etudiant";
import { useNiveauStore } from "~~/stores/niveau";

const route = useRoute();

const bourseId = ref(route.params.id);

const { $toastr } = useNuxtApp();

const bourseStore = useBourseStore();
const etudiantStore = useEtudiantStore();
const niveauStore = useNiveauStore();

// États
const activeTab = ref("etudiants");
const searchQuery = ref("");
const filtreNiveau = ref("");
const isLoading = ref(false);
const isPageLoading = ref(true);
const showConfirmModal = ref(false);
const confirmTitle = ref("");
const confirmMessage = ref("");
const confirmType = ref("affecter");
const selectedEtudiant = ref(null);
const itemsPerPage = ref(10);
const currentPage = ref(1);

// Données
const bourse = computed(() => bourseStore.bourseDetail);
const boursiers = computed(() => bourseStore.boursesetudiants || []);
const tousEtudiants = computed(() => etudiantStore.etudiants || []);

// Total étudiants
const totalEtudiants = computed(() => tousEtudiants.value.length);

// Niveaux pour le filtre
const niveauOptions = computed(() => {
  return (niveauStore.niveaux || []).map((n) => ({
    label: n.libelle,
    value: n.id,
  }));
});

// Configuration des colonnes du tableau avec visibilité
const columns = ref([
//   { field: "matricule", title: "Matricule", isUnique: true, visible: true },
  { field: "nom_prenom", title: "Nom & Prénom", visible: true },
  { field: "niveau", title: "Niveau", visible: true },
  { field: "filiere", title: "Filière", visible: true },
  { field: "actions", title: "Actions", visible: true },
]);

// Colonnes visibles
const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

// Filtrer les étudiants selon l'onglet actif
const filteredEtudiants = computed(() => {
  let liste =
    activeTab.value === "etudiants" ? tousEtudiants.value : boursiers.value;

  // Filtrer par niveau
  if (filtreNiveau.value) {
    liste = liste.filter(
      (e) => e.dernier_groupe?.niveau?.id == filtreNiveau.value,
    );
  }

  return liste;
});

// Vérifier si un étudiant est déjà boursier
const estBoursier = (etudiantId) => {
  return boursiers.value.some((b) => b.id === etudiantId);
};

// Formater le montant
const formatMontant = (valeur) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valeur);
};

// Ouvrir modal d'affectation
const affecterBourse = (etudiant) => {
  selectedEtudiant.value = etudiant;
  confirmType.value = "affecter";
  confirmTitle.value = "Confirmer l'affectation";
  confirmMessage.value = `Voulez-vous affecter la bourse "${bourse.value?.nom}" à ${etudiant.nom} ${etudiant.prenom} ?`;
  showConfirmModal.value = true;
};

// Ouvrir modal de retrait
const retirerBourse = (etudiant) => {
  selectedEtudiant.value = etudiant;
  confirmType.value = "retirer";
  confirmTitle.value = "Confirmer le retrait";
  confirmMessage.value = `Voulez-vous retirer la bourse "${bourse.value?.nom}" de ${etudiant.nom} ${etudiant.prenom} ?`;
  showConfirmModal.value = true;
};

// Confirmer l'action
const confirmAction = async () => {
  showConfirmModal.value = false;
  isLoading.value = true;

  try {
    if (confirmType.value === "affecter") {
      await bourseStore.affecterBourse({
        etudiant_id: selectedEtudiant.value.id,
        bourse_id: bourse.value.id,
      });
      $toastr.success("Bourse affectée avec succès");
    } else {
      await bourseStore.retirerBourse({
        etudiant_id: selectedEtudiant.value.id,
        bourse_id: bourse.value.id,
      });
      $toastr.success("Bourse retirée avec succès");
    }

    // Recharger les données
    await Promise.all([
      bourseStore.fetchBourseDetail(bourseId.value),
      bourseStore.fetchEtudiantsBourse(bourseId.value),
    ]);
  } catch (error) {
    console.error(error);
    $toastr.error(error.response?.data?.message || "Une erreur est survenue");
  } finally {
    isLoading.value = false;
    selectedEtudiant.value = null;
  }
};

// Chargement initial
onMounted(async () => {
  isPageLoading.value = true;
  try {
    await Promise.all([
      bourseStore.fetchBourseDetail(bourseId.value),
      bourseStore.fetchEtudiantsBourse(bourseId.value),
      etudiantStore.fetchEtudiants(),
      niveauStore.fetchNiveaux(),
    ]);
  } catch (error) {
    console.error("Erreur lors du chargement:", error);
    $toastr.error("Erreur lors du chargement des données");
  } finally {
    isPageLoading.value = false;
  }
});
</script>

