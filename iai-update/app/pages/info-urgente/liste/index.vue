<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Administration', to: '/' },
        { label: 'Informations urgentes', to: null },
      ]"
      title="Liste des informations urgentes"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Toolbar -->
    <div
      class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5"
    >
      <!-- Recherche avec icône -->
      <div class="relative w-full lg:w-64">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
        />
        <svg
          class="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
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
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Filtre par statut -->
      <Dropdown
        v-model="statusFilter"
        :options="statusOptions"
        optionLabel="label"
        optionValue="value"
        :showClear="true"
        placeholder="Filtrer par statut"
        class="w-full lg:w-48"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex items-center gap-2">
            <span
              class="w-2 h-2 rounded-full"
              :class="
                slotProps.value === '1'
                  ? 'bg-green-500'
                  : 'bg-amber-500'
              "
            ></span>
            <span>{{
              slotProps.value === "1" ? "Publié" : "Non publié"
            }}</span>
          </div>
          <span v-else class="text-gray-400">Filtrer par statut</span>
        </template>

        <template #option="slotProps">
          <div class="flex items-center gap-2">
            <span
              class="w-2 h-2 rounded-full"
              :class="
                slotProps.option.value === '1'
                  ? 'bg-green-500'
                  : 'bg-amber-500'
              "
            ></span>
            <span>{{ slotProps.option.label }}</span>
          </div>
        </template>
      </Dropdown>

      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Sélecteur de colonnes -->
        <client-only>
          <VDropdown placement="bottom-end">
            <button
              class="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              Colonnes
              <svg
                class="w-4 h-4 ml-1"
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
                <p
                  class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2"
                >
                  Afficher les colonnes
                </p>
                <div
                  v-for="col in columns"
                  :key="col.field"
                  class="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    v-model="col.visible"
                    :disabled="col.field === 'action'"
                    class="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">
                    {{ col.title }}
                  </span>
                </div>
              </div>
            </template>
          </VDropdown>
        </client-only>

        <!-- Bouton d'ajout -->
        <NuxtLink
          to="/info-urgente/ajouter-une-information-urgente"
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M12 5v14M5 12h14"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          Ajouter
        </NuxtLink>
      </div>
    </div>

    <!-- Table -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4 overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      <!-- Loader -->
      <div v-if="urgentinfoStore.isLoading" class="flex justify-center py-16">
        <div class="relative">
          <div
            class="h-16 w-16 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"
          ></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <span
              class="text-xs font-medium text-indigo-600 dark:text-indigo-400"
            ></span>
          </div>
        </div>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="visibleColumns"
          :rows="filteredRows"
          :search="searchQuery"
          :per-page="itemsPerPage"
          skin="bh-table-striped bh-table-hover"
          sortable
          class="w-full"
          :sortable-icon="{
            asc: '↑',
            desc: '↓',
          }"
        >
          <!-- Icône/aperçu du fichier -->
          <template #file="data">
            <div class="flex items-center justify-center">
              <div class="relative group">
                <!-- Image -->
                

                <!-- PDF -->
                <div v-if="isPdfFile(data.value)" class="relative">
                  <div
                    @click="previewFile(data.value)"
                    class="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/30 dark:to-rose-800/30 flex items-center justify-center ring-2 ring-transparent group-hover:ring-indigo-500 transition-all duration-200 cursor-pointer"
                  >
                    <svg class="w-6 h-6 text-rose-600 dark:text-rose-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .8-.7 1.5-1.5 1.5H8v1.5h2v.5H8v1.5h2.5c.8 0 1.5-.7 1.5-1.5v-1c0-.8-.7-1.5-1.5-1.5h-1v-1h2.5V9.5zM13.5 9h1v5h-1V9zm4 3h-2v1.5h2v.5h-2v1.5h2.5c.8 0 1.5-.7 1.5-1.5v-1c0-.8-.7-1.5-1.5-1.5H16v-1h2V9h-2.5c-.8 0-1.5.7-1.5 1.5v1c0 .8.7 1.5 1.5 1.5h1v1h-2v1.5h2.5c.8 0 1.5-.7 1.5-1.5v-1c0-.8-.7-1.5-1.5-1.5H16v-1h2V9z"/>
                    </svg>
                  </div>
                  <span class="absolute -bottom-1 -right-1 text-[8px] font-bold bg-rose-600 text-white px-1 rounded">PDF</span>
                </div>

                <!-- Word -->
                <div v-else-if="isWordFile(data.value)" class="relative">
                  <div
                    @click="previewFile(data.value)"
                    class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center ring-2 ring-transparent group-hover:ring-indigo-500 transition-all duration-200 cursor-pointer"
                  >
                    <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm1.5 14h-5v-1.5h5V16zm0-3h-5v-1.5h5V13zm0-3h-5V8.5h5V10zM13 9V3.5L18.5 9H13z"/>
                    </svg>
                  </div>
                  <span class="absolute -bottom-1 -right-1 text-[8px] font-bold bg-blue-600 text-white px-1 rounded">DOC</span>
                </div>

                <!-- Excel -->
                <div v-else-if="isExcelFile(data.value)" class="relative">
                  <div
                    @click="previewFile(data.value)"
                    class="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center ring-2 ring-transparent group-hover:ring-indigo-500 transition-all duration-200 cursor-pointer"
                  >
                    <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-3.5 14h-5v-1.5h5V16zm0-3h-5v-1.5h5V13zm0-3h-5V8.5h5V10zM13 9V3.5L18.5 9H13z"/>
                    </svg>
                  </div>
                  <span class="absolute -bottom-1 -right-1 text-[8px] font-bold bg-green-600 text-white px-1 rounded">XLS</span>
                </div>

                <!-- Autre fichier -->
                <div v-else class="relative">
                  <div
                    @click="previewFile(data.value)"
                    class="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center ring-2 ring-transparent group-hover:ring-indigo-500 transition-all duration-200 cursor-pointer"
                  >
                    <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <!-- Tooltip au survol -->
                <div
                  class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10 shadow-lg"
                >
                  {{ getFileName(data.value) }}
                </div>
              </div>
            </div>
          </template>

          <!-- Titre avec résumé -->
          <template #title="data">
            <div class="max-w-xs">
              <NuxtLink
                :to="`/info-urgente/${data.value.id}/detail`"
                class="group flex items-start gap-2"
              >
                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 truncate"
                  >
                    {{ data.value.title }}
                  </p>
                  <p
                    class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1"
                  >
                    <svg
                      class="w-3 h-3 inline"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h8m-8 6h16"
                      />
                    </svg>
                    {{ truncateText(data.value.summary || "Pas de résumé", 60) }}
                  </p>
                </div>
              </NuxtLink>
            </div>
          </template>

          <!-- Résumé -->
          <template #summary="data">
            <div class="max-w-xs">
              <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {{ data.value.summary || "Pas de résumé" }}
              </p>
            </div>
          </template>

          <!-- Lien/Fichier -->
          <template #file_info="data">
            <div class="flex items-center gap-2">
              <!-- Si c'est un lien externe -->
              <a
                v-if="data.value.file_url"
                :href="data.value.file_url"
                target="_blank"
                class="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Lien externe
              </a>

              <!-- Si c'est un fichier uploadé -->
              <button
                v-else-if="data.value.file_path"
                @click="downloadFile(data.value)"
                class="inline-flex items-center gap-1 px-2 py-1 text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Télécharger
              </button>

              <span v-else class="text-xs text-gray-400">Aucun fichier</span>
            </div>
          </template>

          <!-- Date -->
          <template #created_at="data">
            <div class="flex items-center gap-1.5 text-sm">
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span class="text-gray-600 dark:text-gray-400">
                {{ formatDate(data.value.created_at) }}
              </span>
            </div>
          </template>

          <!-- Statut avec toggle -->
          <template #status="data">
            <div class="flex items-center justify-center">
              <button
                @click="toggleStatus(data.value)"
                :class="[
                  'relative w-14 h-7 rounded-full flex items-center px-1 transition-colors duration-200',
                  data.value.is_published === true
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-gray-200 dark:bg-gray-700'
                ]"
                :title="data.value.is_published === true ? 'Publié' : 'Non publié'"
              >
                <div
                  :class="[
                    'w-5 h-5 rounded-full shadow-md transform transition-all duration-200',
                    data.value.is_published === true
                      ? 'bg-green-500 dark:bg-green-600 translate-x-7'
                      : 'bg-white dark:bg-gray-400 translate-x-0'
                  ]"
                ></div>
              </button>
              <span
                v-if="data.value.is_published === true"
                class="ml-2 text-xs font-medium text-green-700 dark:text-green-300"
              >
                
              </span>
            </div>
          </template>

          <!-- Actions -->
          <template #action="data">
            <div class="flex justify-center gap-1">
              <!-- Télécharger -->
              <button
                v-if="data.value.file_path"
                @click="downloadFile(data.value)"
                class="p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 transform hover:scale-110"
                title="Télécharger"
                download
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>

              <!-- Lien externe -->
              <a
                v-else-if="data.value.file_url"
                :href="data.value.file_url"
                target="_blank"
                class="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 transform hover:scale-110"
                title="Ouvrir le lien"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              <!-- View -->
              <NuxtLink
                :to="`/info-urgente/${data.value.id}/detail`"
                class="p-2 rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 transform hover:scale-110"
                title="Voir détails"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </NuxtLink>

              <!-- Edit -->
              <NuxtLink
                :to="`/info-urgente/${data.value.id}/modifier-une-information-urgente`"
                class="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 transform hover:scale-110"
                title="Modifier"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </NuxtLink>

              <!-- Delete -->
              <button
                class="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 transform hover:scale-110"
                @click="confirmDelete(data.value)"
                title="Supprimer"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </template>
        </Vue3Datatable>

        <!-- Message si aucune donnée -->
        <div v-if="filteredRows.length === 0" class="text-center py-16">
          <div
            class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 mb-4"
          >
            <svg
              class="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucune information urgente trouvée
          </h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">
            Commencez par créer votre première information urgente.
          </p>
          <NuxtLink
            to="/info-urgente/ajouter-une-information-urgente"
            class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <svg
              class="w-5 h-5"
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
            Ajouter une information
          </NuxtLink>
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
import Dropdown from "primevue/dropdown";
import { useUrgentInfoStore } from "~~/stores/urgent-info";

const urgentinfoStore = useUrgentInfoStore();
const { $toastr, $swal } = useNuxtApp();

// Références
const searchQuery = ref("");
const statusFilter = ref(null);
const itemsPerPage = ref(10);

// Options pour le filtre de statut
const statusOptions = [
  { label: "Publié", value: "1" },
  { label: "Non publié", value: "0" },
];

// Colonnes de la table
const columns = ref([
  { field: "file", title: "Fichier", sortable: false, visible: true },
  { field: "title", title: "Titre", sortable: true, visible: true },
  { field: "summary", title: "Résumé", sortable: true, visible: true },
  { field: "created_at", title: "Date création", sortable: true, visible: true },
  { field: "status", title: "Statut", sortable: true, visible: true },
  { field: "action", title: "Actions", sortable: false, visible: true },
]);

const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

// Rows filtrées
const filteredRows = computed(() => {
  let rows = urgentinfoStore.urgentinfos.map((info) => ({
    ...info,
    title: info.title || "--",
    summary: info.summary || "",
    file_url: info.file_url || null,
    file_path: info.file_path || null,
    status: info.is_published,
    created_at: info.created_at || info.published_at,
  }));

  // Filtre par statut
  if (statusFilter.value !== null && statusFilter.value !== undefined) {
    rows = rows.filter((info) => info.status === statusFilter.value);
  }

  return rows;
});


const isPdfFile = (item) => {
  if (!item.file_path) return false;
  const ext = item.file_path.split('.').pop()?.toLowerCase();
  return ext === 'pdf';
};

const isWordFile = (item) => {
  if (!item.file_path) return false;
  const ext = item.file_path.split('.').pop()?.toLowerCase();
  return ['doc', 'docx'].includes(ext);
};

const isExcelFile = (item) => {
  if (!item.file_path) return false;
  const ext = item.file_path.split('.').pop()?.toLowerCase();
  return ['xls', 'xlsx', 'csv'].includes(ext);
};

const getFileName = (item) => {
  if (item.file_path) {
    return item.file_path.split('/').pop() || 'Fichier';
  }
  if (item.file_url) {
    return 'Lien externe';
  }
  return 'Aucun fichier';
};

// Actions
const clearSearch = () => {
  searchQuery.value = "";
};

const toggleStatus = async (item) => {
  const newStatus = item.is_published === true ? "0" : "1";
  const action = newStatus === '1' ? "publier" : "dépublier";
  
  const result = await $swal.fire({
    title: `${action === "publier" ? "Publier" : "Dépublier"} ?`,
    text: `Voulez-vous ${action} "${item.title}" ?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: newStatus === "1" ? "#10b981" : "#6b7280",
    cancelButtonColor: "#6b7280",
    confirmButtonText: `Oui, ${action}`,
    cancelButtonText: "Annuler",
    background: document.documentElement.classList.contains("dark") ? "#1f2937" : "#fff",
    color: document.documentElement.classList.contains("dark") ? "#fff" : "#000",
  });

  if (result.isConfirmed) {
    try {
        if(newStatus === "1"){
            await urgentinfoStore.publishUrgentInfo(item.id)            
        }else{
            await urgentinfoStore.unPublishUrgentInfo(item.id)
        }
      await urgentinfoStore.fetchUrgentInfos();
      $toastr.success(`Information ${action}ée avec succès`);
    } catch (error) {
      console.error("Erreur changement statut:", error);
      $toastr.error(error.response?.data?.message || "Erreur lors du changement de statut");
    }
  }
};

const downloadFile = async (item) => {
  if (!item.file_path) return;
  
  try {
    // Téléchargement direct
    const link = document.createElement('a');
    link.href = item.file_path;
    link.download = getFileName(item);
    document.body.appendChild(link);
    link.target="_blank"
    link.click();
    document.body.removeChild(link);
    
    $toastr.success("Téléchargement démarré");
  } catch (error) {
    console.error("Erreur téléchargement:", error);
    $toastr.error("Erreur lors du téléchargement");
  }
};

const previewFile = (item) => {
  if (item.file_path) {
    window.open(item.file_path, '_blank');
  } else if (item.file_url) {
    window.open(item.file_url, '_blank');
  }
};

const confirmDelete = async (item) => {
  const result = await $swal.fire({
    title: "Supprimer ?",
    html: `Voulez-vous supprimer <strong>"${item.title}"</strong> ?<br><br>Cette action est irréversible.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
    background: document.documentElement.classList.contains("dark") ? "#1f2937" : "#fff",
    color: document.documentElement.classList.contains("dark") ? "#fff" : "#000",
  });

  if (result.isConfirmed) {
    try {
      await urgentinfoStore.deleteUrgentInfo(item.id);
      $toastr.success("Information supprimée avec succès");
      await urgentinfoStore.fetchUrgentInfos();
    } catch (error) {
      console.error("Erreur suppression:", error);
      $toastr.error(error.response?.data?.message || "Impossible de supprimer l'information");
    }
  }
};

// Utilitaires
const formatDate = (dateString) => {
  if (!dateString) return "Date inconnue";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const handleImageError = (e) => {
  e.target.src = "https://via.placeholder.com/40x40?text=Image";
};

const truncateText = (text, length) => {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
};

// Chargement initial
onMounted(async () => {
  try {
    await urgentinfoStore.fetchUrgentInfos();
  } catch (error) {
    console.error("Erreur chargement:", error);
    $toastr.error("Erreur lors du chargement");
  }
});
</script>

