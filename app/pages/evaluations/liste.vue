<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Evaluations', to: '/evaluations/liste' },
        { label: 'Liste', to: null },
      ]"
      title="Liste des évaluations"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Toolbar -->
    <div class="flex flex-col gap-4 mb-5">
      <!-- Ligne 1: Recherche et Actions -->
      <div class="flex flex-col sm:flex-row justify-between gap-3">
        <!-- Recherche -->
        <div class="w-full sm:max-w-md">
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Rechercher..."
            class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3 shrink-0">
          <!-- Colonnes -->
          <client-only>
            <VDropdown placement="bottom-end">
              <button
                class="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

          <!-- Ajouter -->
          <Can action="create-evaluation">
            <NuxtLink
              to="/evaluations/ajouter-une-evaluation"
              class="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
          </Can>
        </div>
      </div>

      <!-- Ligne 2: Filtres -->
      <div class="flex flex-wrap gap-3">
        <!-- Filtre Niveau -->
        <Dropdown
          v-model="filterNiveau"
          :options="niveauOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Niveau"
          class="w-full sm:w-40 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          :showClear="true"
        />

        <!-- Filtre Filière -->
        <Dropdown
          v-model="filterFiliere"
          :options="filiereOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Filière"
          class="w-full sm:w-40 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          :showClear="true"
        />

        <!-- Filtre Type -->
        <select
          v-model="filterType"
          class="w-full sm:w-40 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Catégorie</option>
          <option value="Examen">Examen</option>
          <option value="Devoir">Devoir</option>
        </select>

        <!-- Filtre Session -->
        <select
          v-model="filterSessionType"
          class="w-full sm:w-40 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Session (Toutes)</option>
          <option value="normale">Normale</option>
          <option value="rattrapage">Rattrapage</option>
        </select>

        <!-- Filtre Statut -->
        <select
          v-model="filterPublished"
          class="w-full sm:w-40 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Statut (Tous)</option>
          <option value="true">Publié</option>
          <option value="false">Non publié</option>
        </select>
      </div>
    </div>


    <!-- Onglets Évaluations Actives / Corbeille -->
    <div class="flex items-center border-b border-gray-200 dark:border-gray-700 mb-5 gap-2">
      <button
        @click="switchTab('active')"
        class="flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition-colors duration-200"
        :class="activeTab === 'active'
          ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>Évaluations actives</span>
        <span
          class="ml-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300"
        >
          {{ activeEvaluationsCount }}
        </span>
      </button>

      <button
        @click="switchTab('corbeille')"
        class="flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition-colors duration-200"
        :class="activeTab === 'corbeille'
          ? 'border-red-600 text-red-600 dark:text-red-400 font-semibold'
          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span>Corbeille</span>
        <span
          class="ml-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full"
          :class="trashedEvaluationsCount > 0 ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
        >
          {{ trashedEvaluationsCount }}
        </span>
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-3 sm:p-4">
      <div v-if="loading" class="flex justify-center py-10">
        <div
          class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"
        ></div>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="visibleColumns"
          :rows="rows"
          :search="searchQuery"
          :per-page="itemsPerPage"
          skin="bh-table-striped bh-table-hover"
        >
          <template #published="{ value }">
            <div class="flex items-center justify-center">
              <!-- Si déjà publié -->
              <div
                v-if="value === 1 || value === true"
                class="flex items-center"
              >
                <span class="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 shadow-sm uppercase tracking-wider">
                  <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Publié
                </span>
              </div>

              <!-- Si non publié -->
              <div v-else class="flex items-center">
                <Can action="publish-evaluation">
                <button
                  @click="
                    value.published === 1 || value.published === true
                      ? null
                      : togglePublish(value)
                  "
                  :disabled="value.published === 1 || value.published === true || activeTab === 'corbeille'"
                  class="relative inline-flex items-center h-7 rounded-full w-14 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  :class="{
                    'bg-green-100 dark:bg-green-900/30 focus:ring-green-300 cursor-default':
                      value.published === 1 || value.published === true,
                    'bg-gray-100 dark:bg-gray-800/40 focus:ring-gray-300 cursor-pointer':
                      !(value.published === 1 || value.published === true),
                  }"
                  :title="
                    value.published === 1 || value.published === true
                      ? 'Déjà publié (irréversible)'
                      : 'Cliquer pour publier'
                  "
                >
                  <span
                    :class="{
                      'translate-x-8 bg-green-500 dark:bg-green-600':
                        value.published === 1 || value.published === true,
                      'translate-x-1 bg-gray-500 dark:bg-gray-600': !(
                        value.published === 1 || value.published === true
                      ),
                    }"
                    class="inline-block w-5 h-5 transform rounded-full shadow-sm transition-all duration-200"
                  ></span>
                </button>
                </Can>
                <span
                  class="ml-3 text-sm font-medium text-red-700 dark:text-red-300"
                >
                </span>
              </div>
            </div>
          </template>

          <!-- Colonne personnalisée pour Session Type (badge) -->
          <template #session_type="{ value }">
            <span
              v-if="value.session_type === 'rattrapage'"
              class="px-2 py-1 text-xs font-semibold rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
            >
              Rattrapage
            </span>
            <span
              v-else
              class="px-2 py-1 text-xs font-semibold rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300"
            >
              Normale
            </span>
          </template>

          <template #action="{ value }">
            <!-- Mode Liste Active -->
            <div v-if="activeTab === 'active'" class="flex justify-center gap-3">
              <NuxtLink
                :to="`/evaluations/${value.slug}/details`"
                class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                title="Voir les détails"
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </NuxtLink>

              <!-- Edit -->
              <Can action="update-evaluation">
                <button
                  @click="openEditModal(value)"
                  class="p-2 rounded-lg text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
                  title="Modifier"
                >
                  <svg
                    class="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M4 20h4l10-10-4-4L4 16v4z"
                      stroke-width="2"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </Can>
              <NuxtLink
                class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                title="Fiche d'anonymat"
                :to="`/evaluations/fiche-de-note/${value.slug}`"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-4 h-4"
                >
                  <path
                    d="M6 2h8l4 4v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
                  />
                  <path d="M14 2v6h6" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="8" y1="16" x2="16" y2="16" />
                </svg>
              </NuxtLink>

              <!-- Sujet & Questions de l'examen en ligne -->
              <Can action="update-question-examen">
                <NuxtLink
                  class="p-2 rounded-lg text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors duration-200"
                  title="Éditer le sujet & questions d'examen"
                  :to="`/evaluations/examen-en-ligne/${value.slug}/questions`"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </NuxtLink>
              </Can>

              <!-- Validation des copies / Corrections -->
              <Can action="grade-examen">
                <NuxtLink
                  class="p-2 rounded-lg text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors duration-200"
                  title="Corrections & Validation"
                  :to="`/evaluations/examen-en-ligne/${value.slug}/soumission-des-etudiants`"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </NuxtLink>
              </Can>

              <Can action="update-evaluation">
                <button
                  @click="openConfigModal(value)"
                  class="p-2 rounded-lg text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200"
                  title="Configurer"
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </Can>

              <!-- Mettre en corbeille -->
              <Can action="delete-evaluation">
                <button
                  @click="deleteItem(value)"
                  class="p-2 rounded-lg text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors duration-200"
                  title="Mettre en corbeille"
                >
                  <ButtonDelete />
                </button>
              </Can>
            </div>

            <!-- Mode Corbeille -->
            <div v-else class="flex justify-center gap-3">
              <NuxtLink
                :to="`/evaluations/${value.slug}/details`"
                class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                title="Voir les détails"
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </NuxtLink>

              <!-- Restaurer -->
              <Can action="restore-evaluation">
                <button
                  @click="restoreItem(value)"
                  class="p-2 rounded-lg text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors duration-200"
                  title="Restaurer l'évaluation"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </Can>

              <!-- Supprimer définitivement -->
              <Can action="force-delete-evaluation">
                <button
                  @click="forceDeleteItem(value)"
                  class="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
                  title="Supprimer définitivement"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </Can>
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>

    <TransitionRoot appear :show="showConfigModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeConfigModal">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/60" />
        </TransitionChild>

        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            class="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-5"
          >
            <DialogTitle
              class="text-lg font-semibold mb-4 text-gray-900 dark:text-white"
            >
              Configurer l'évaluation -
              {{ selectedEvaluation?.matiere?.nom || "" }}
            </DialogTitle>

            <form @submit.prevent="saveConfig" class="space-y-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Surveillant 1
                </label>
                <Dropdown
                  v-model="configForm.surveillant_1_id"
                  :options="surveillantsOptions"
                  optionLabel="label"
                  optionValue="value"
                  filter
                  showClear
                  placeholder="Sélectionner un surveillant"
                  class="w-full"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Surveillant 2
                </label>
                <Dropdown
                  v-model="configForm.surveillant_2_id"
                  :options="surveillantsOptions"
                  optionLabel="label"
                  optionValue="value"
                  filter
                  showClear
                  placeholder="Sélectionner un surveillant"
                  class="w-full"
                />
              </div>

              <div class="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  @click="closeConfigModal"
                  class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  {{ isUpdating ? "Mettre à jour" : "Enregistrer" }}
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
import { ref, computed, onMounted, watch } from "vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import { useRouter } from "vue-router";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";
import Dropdown from "primevue/dropdown";
import Breadcrumb from "~/components/Breadcrumb.vue";

import { useEvaluationStore } from "~~/stores/evaluations";
import { useUserStore } from "~~/stores/user";
import { useNiveauStore } from "~~/stores/niveau";
import { useFiliereStore } from "~~/stores/filiere";
import ButtonDelete from "~/components/ui/buttonDelete.vue";

const { $toastr, $swal } = useNuxtApp();

const userStore = useUserStore();
const evaluationStore = useEvaluationStore();
const niveauStore = useNiveauStore();
const filiereStore = useFiliereStore();
const router = useRouter();
const searchQuery = ref("");
const loading = ref(true);
const showModal = ref(false);
const modalTitle = ref("");
const itemsPerPage = ref(5);

const selectedEvent = ref(null);
const showConfigModal = ref(false);
const evaluation_id = ref("");
const activeTab = ref("active");
const selectedEvaluation = ref(null);
const isUpdating = ref(false);
const filterType = ref("");
const filterSessionType = ref("");
const filterPublished = ref("");
const filterNiveau = ref(null);
const filterFiliere = ref(null);

const niveauOptions = computed(() => {
  return (niveauStore.niveaux || []).map((n) => ({
    label: n.libelle || n.nom,
    value: n.id,
  }));
});

const filiereOptions = computed(() => {
  return (filiereStore.filieres || []).map((f) => ({
    label: f.nom,
    value: f.id,
  }));
});

const activeEvaluationsCount = computed(
  () => (evaluationStore.evaluations || []).length
);
const trashedEvaluationsCount = computed(
  () => (evaluationStore.trashedEvaluations || []).length
);

const switchTab = async (tab) => {
  activeTab.value = tab;
  if (tab === "corbeille") {
    await evaluationStore.fetchTrashedEvaluations();
  } else {
    await evaluationStore.fetchEvaluations();
  }
};

const configForm = ref({
  surveillant_1_id: "",
  surveillant_2_id: "",
});

const form = ref({
  id: null,
  type: "", // 'Examen' ou 'Devoir'
  niveau_id: null,
  filieres: [],
  group_id: null,
  unite_valeur_id: null,
  salle_id: null,
  semestre: null,
  date: null,
  debut: null,
  fin: null,
  duration_minutes: null,
  correction_end_date: null,
  is_online: false,
  published: false,
});

const columns = ref([
  { field: "type", title: "Catégorie", visible: true },
  { field: "session_type", title: "Session", visible: true },
  { field: "matiere.nom", title: "Matiere", visible: true },
  { field: "published", title: "Publier", visible: true },
  { field: "action", title: "Actions", visible: true },
]);

const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

const existingSurveillants = computed(() => {
  if (!selectedEvaluation.value?.fiche?.surveillants) return [];
  return selectedEvaluation.value.fiche.surveillants;
});

const rows = computed(() => {
  let list =
    activeTab.value === "active"
      ? evaluationStore.evaluations || []
      : evaluationStore.trashedEvaluations || [];
      
  if (filterType.value) {
    list = list.filter(item => item.type === filterType.value);
  }
  
  if (filterSessionType.value) {
    list = list.filter(item => item.session_type === filterSessionType.value);
  }
  
  if (filterNiveau.value) {
    list = list.filter(item => {
      return (item.niveau_id == filterNiveau.value) || 
             (item.niveau && item.niveau.id == filterNiveau.value) ||
             (item.group && item.group.niveau_id == filterNiveau.value) ||
             (item.group && item.group.niveau && item.group.niveau.id == filterNiveau.value);
    });
  }
  
  if (filterFiliere.value) {
    list = list.filter(item => {
      return item.group && item.group.filieres && item.group.filieres.some(f => f.id == filterFiliere.value);
    });
  }

  if (filterPublished.value !== "") {
    const isPublishedFilter = filterPublished.value === "true";
    list = list.filter(item => {
      const isItemPublished = item.published === 1 || item.published === true;
      return isItemPublished === isPublishedFilter;
    });
  }
  
  return [...list].sort((a, b) => (b.id || 0) - (a.id || 0));
});

const openConfigModal = (evaluation) => {
  selectedEvaluation.value = evaluation;
  isUpdating.value = !!evaluation?.fiche;
  configForm.value = {
    surveillant_1_id: "",
    surveillant_2_id: "",
  };
  if (
    evaluation?.fiche?.surveillants &&
    evaluation.fiche.surveillants.length > 0
  ) {
    if (evaluation.fiche.surveillants[0]) {
      configForm.value.surveillant_1_id = evaluation.fiche.surveillants[0].slug;
    }
    if (evaluation.fiche.surveillants[1]) {
      configForm.value.surveillant_2_id = evaluation.fiche.surveillants[1].slug;
    }
  }
  showConfigModal.value = true;
};

const closeConfigModal = () => {
  showConfigModal.value = false;
  selectedEvaluation.value = null;
  isUpdating.value = false;
  configForm.value = {
    surveillant_1_id: "",
    surveillant_2_id: "",
  };
};

const saveConfig = async () => {
  try {
    const payload = {
      evaluation_id: selectedEvaluation.value.slug,
      ...configForm.value,
    };

    if (isUpdating.value && selectedEvaluation.value?.fiche?.slug) {
      await evaluationStore.updateFicheDePresence(
        selectedEvaluation.value.fiche.slug,
        payload,
      );
      $toastr.success("Configuration mise à jour avec succès");
    } else {
      await evaluationStore.addFicheDePresence(payload);
      $toastr.success("Configuration enregistrée avec succès");
    }
    await evaluationStore.fetchEvaluations();
    closeConfigModal();
  } catch (error) {
    console.error("Erreur lors de la configuration:", error);
    $toastr.error(error.response?.data?.message || "Une erreur est survenue");
  }
};

const togglePublish = async (evaluation) => {
  try {
    const res = await $swal.fire({
      title: "Publier cette évaluation ?",
      text: "Une fois publiée, l'évaluation ne pourra plus être modifiée ou supprimée.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Publier",
      cancelButtonText: "Annuler",
    });

    if (res.isConfirmed) {
      await evaluationStore.publishedEvaluation(evaluation.slug);
      await evaluationStore.fetchEvaluations();
      $toastr.success("Évaluation publiée avec succès");
    }
  } catch (error) {
    console.error("Erreur lors de la publication:", error);
    $toastr.error(error.response?.data?.message || "Une erreur est survenue");
  }
};

const surveillantsOptions = computed(() => {
  return userStore.enseignants.map((e) => ({
    label: `${e.nom} ${e.prenom} (${e.supervisor_type || "Non défini"})`,
    value: e.slug,
  }));
});


const openEditModal = async (evaluation) => {
  try {
    await evaluationStore.checkEvaluation(evaluation.slug);
    navigateTo(`/evaluations/${evaluation.slug}/modifier-une-evaluation`);
  } catch (error) {
    console.error("Erreur lors de l'ouverture du modal d'ajout:", error);
    $toastr.error(error.response?.data?.message || "Une erreur est survenue");
  }
};


const calculateDuration = () => {
  if (form.value.debut && form.value.fin) {
    const [startH, startM] = form.value.debut.split(":").map(Number);
    const [endH, endM] = form.value.fin.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    form.value.duration_minutes = Math.max(0, endMinutes - startMinutes);
  }
};

// Méthodes pour formater les dates et heures
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (timeString) => {
  if (!timeString) return "";
  const date = new Date(timeString);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const deleteItem = async (evaluation) => {
  const res = await $swal.fire({
    title: "Mettre en corbeille ?",
    text: "Cette évaluation sera déplacée dans la corbeille. Vous pourrez la restaurer ultérieurement.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Mettre en corbeille",
    cancelButtonText: "Annuler",
    confirmButtonColor: "#f59e0b",
  });

  if (res.isConfirmed) {
    try {
      await evaluationStore.deleteEvaluation(evaluation.slug || evaluation.id);
      await Promise.all([
        evaluationStore.fetchEvaluations(),
        evaluationStore.fetchTrashedEvaluations(),
      ]);
      $toastr.success("Évaluation déplacée dans la corbeille");
    } catch (error) {
      console.log(error);
      $toastr.error(error.response?.data?.message || "Une erreur est survenue");
    }
  }
};

const restoreItem = async (evaluation) => {
  const res = await $swal.fire({
    title: "Restaurer cette évaluation ?",
    text: "L'évaluation sera réintégrée dans la liste des évaluations actives.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Restaurer",
    cancelButtonText: "Annuler",
    confirmButtonColor: "#10b981",
  });

  if (res.isConfirmed) {
    try {
      await evaluationStore.restoreEvaluation(evaluation.slug || evaluation.id);
      await Promise.all([
        evaluationStore.fetchEvaluations(),
        evaluationStore.fetchTrashedEvaluations(),
      ]);
      $toastr.success("Évaluation restaurée avec succès");
    } catch (error) {
      console.log(error);
      $toastr.error(
        error.response?.data?.message ||
          "Une erreur est survenue lors de la restauration"
      );
    }
  }
};

const forceDeleteItem = async (evaluation) => {
  const res = await $swal.fire({
    title: "Supprimer définitivement ?",
    text: "Attention, cette action est irréversible et supprimera l'évaluation définitivement de la base de données.",
    icon: "error",
    showCancelButton: true,
    confirmButtonText: "Supprimer définitivement",
    cancelButtonText: "Annuler",
    confirmButtonColor: "#ef4444",
  });

  if (res.isConfirmed) {
    try {
      await evaluationStore.forceDeleteEvaluation(evaluation.slug || evaluation.id);
      await Promise.all([
        evaluationStore.fetchEvaluations(),
        evaluationStore.fetchTrashedEvaluations(),
      ]);
      $toastr.success("Évaluation supprimée définitivement");
    } catch (error) {
      console.log(error);
      $toastr.error(
        error.response?.data?.message ||
          "Une erreur est survenue lors de la suppression définitive"
      );
    }
  }
};

watch([() => form.value.debut, () => form.value.fin], () => {
  calculateDuration();
});

onMounted(async () => {
  try {
    await Promise.all([
      evaluationStore.fetchEvaluations(),
      evaluationStore.fetchTrashedEvaluations(),
      userStore.fetchUsersSurveillant(),
      niveauStore.fetchNiveaux(),
      filiereStore.fetchFilieres(),
    ]);
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
    $toastr.error("Erreur lors du chargement des données");
  } finally {
    loading.value = false;
  }
});
</script>
