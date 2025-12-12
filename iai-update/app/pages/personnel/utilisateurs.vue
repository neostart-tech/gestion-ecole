<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Membres de l'administration</span>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Liste</span>
    </div>

    <!-- Titre -->
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Liste des membres de l'administration</h1>

    <!-- Zone de recherche et filtres -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <!-- Recherche -->
      <input
        v-model="searchQuery"
        type="search"
        class="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        placeholder="Rechercher..."
      />

      <!-- Filtre par rôle -->
      <div class="relative">
        <select 
          v-model="filterRole"
          class="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="">Tous les rôles</option>
          <option value="Enseignant">Enseignant</option>
          <option value="Responsable du site">Responsable du site</option>
          <option value="Directeur des Affaires Académique et Scolaires">Directeur des Affaires</option>
          <option value="Utilisateur de la plateforme">Utilisateur plateforme</option>
        </select>
      </div>

      <!-- Filtre par type surveillant -->
      <div class="relative">
        <select 
          v-model="filterSurveillant"
          class="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="">Tous les types</option>
          <option value="Surveillant">Surveillant</option>
          <option value="Non surveillant">Non surveillant</option>
        </select>
      </div>

      <!-- Sélecteur de colonnes -->
      <div class="relative">
        <button 
          @click="toggleSelector"
          class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span class="text-gray-700 font-medium">Toutes les colonnes</span>
          <svg 
            :class="{ 'rotate-180': showSelector }" 
            class="w-4 h-4 text-gray-500 transition-transform"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        <!-- Dropdown des colonnes -->
        <div 
          v-if="showSelector"
          class="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        >
          <div class="p-3 space-y-2 max-h-64 overflow-y-auto">
            <div 
              v-for="col in availableColumns" 
              :key="col.field"
              class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                :id="col.field"
                v-model="selectedColumns"
                :value="col.field"
                class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <label 
                :for="col.field"
                class="text-sm text-gray-700 cursor-pointer select-none"
              >
                {{ col.title }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Contrôles d'affichage -->
      <div class="flex items-center gap-2">
        <span class="text-gray-600 whitespace-nowrap">Afficher</span>
        <select 
          v-model="itemsPerPage" 
          class="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span class="text-gray-600 whitespace-nowrap">éléments</span>
      </div>

      <!-- Bouton Ajouter membre -->
      <button 
        @click="openAddModal"
        class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium whitespace-nowrap"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Ajouter un membre
      </button>
    </div>

    <!-- Tableau -->
    <div class="bg-white rounded-xl shadow-sm p-4 md:p-6">
      <Vue3Datatable
        :columns="filteredCols"
        :rows="filteredRows"
        :per-page="itemsPerPage"
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
        :loading="loading"
        :totalRows="filteredRows.length"
        skin="bh-table-striped bh-table-hover"
      >
        <!-- Slot pour les rôles - CODE CORRIGÉ -->
        <template #roles="data">
          <div class="flex flex-wrap gap-1">
            <template v-if="data.value && typeof data.value === 'string'">
              <span 
                v-for="(role, index) in data.value.split(' ').filter(r => r && r.trim())" 
                :key="index"
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  getRoleClass(role.trim())
                ]"
              >
                {{ role.trim() }}
              </span>
            </template>
            <template v-else-if="Array.isArray(data.value)">
              <span 
                v-for="(role, index) in data.value.filter(r => r && r.trim())" 
                :key="index"
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  getRoleClass(role.trim())
                ]"
              >
                {{ role.trim() }}
              </span>
            </template>
          </div>
        </template>

        <!-- Slot pour le type surveillant -->
        <template #typeSurveillant="data">
          <span 
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium',
              data.value === 'Surveillant' 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-gray-100 text-gray-800'
            ]"
          >
            {{ data.value || 'Non surveillant' }}
          </span>
        </template>

        <!-- Slot pour les actions -->
        <template #action="data">
          <div class="flex items-center justify-center gap-2">
            <!-- Bouton Voir -->
            <button 
              @click="openViewModal(data.value)"
              class="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200"
              title="Voir détails"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <!-- Bouton Modifier -->
            <button 
              @click="openEditModal(data.value)"
              class="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded transition-colors duration-200"
              title="Modifier"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            
            <!-- Bouton Activer/Désactiver -->
            <button 
              @click="toggleStatus(data.value)"
              class="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded transition-colors duration-200"
              :title="data.value.actif ? 'Désactiver' : 'Activer'"
            >
              <svg v-if="data.value.actif" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <!-- Bouton Supprimer -->
            <button 
              @click="openDeleteModal(data.value)"
              class="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors duration-200"
              title="Supprimer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </template>
      </Vue3Datatable>
    </div>

    <!-- Modal d'ajout/modification -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="modal-content">
          <form @submit.prevent="saveMembre">
            <div class="modal-header border-b border-gray-200 p-6">
              <h5 class="modal-title text-lg font-semibold text-gray-900">{{ modalTitle }}</h5>
              <button type="button" @click="closeModal" class="btn-close text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="modal-body p-6 space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Nom -->
                <div class="form-group text-start">
                  <label for="nom" class="block text-sm font-medium text-gray-700 mb-2">
                    Nom <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="nom" 
                    v-model="form.nom" 
                    required
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase" 
                    placeholder="Nom de famille"
                  />
                </div>

                <!-- Prénoms -->
                <div class="form-group text-start">
                  <label for="prenoms" class="block text-sm font-medium text-gray-700 mb-2">
                    Prénoms <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="prenoms" 
                    v-model="form.prenoms" 
                    required
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Prénoms"
                  />
                </div>
              </div>

              <!-- Email -->
              <div class="form-group text-start">
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Email <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="form.email" 
                  required
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="email@iai-togo.tg"
                />
              </div>

              <!-- Rôles (multiselect) -->
              <div class="form-group text-start">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Rôles <span class="text-rose-500">*</span>
                </label>
                <div class="space-y-2">
                  <div v-for="role in rolesDisponibles" :key="role.id" class="flex items-center">
                    <input
                      type="checkbox"
                      :id="'role-' + role.id"
                      :value="role.nom"
                      v-model="form.roles"
                      class="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                    />
                    <label :for="'role-' + role.id" class="ml-2 text-sm text-gray-700">
                      {{ role.nom }}
                    </label>
                  </div>
                </div>
                <p class="mt-1 text-xs text-gray-500">Sélectionnez un ou plusieurs rôles</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Type surveillant -->
                <div class="form-group text-start">
                  <label for="typeSurveillant" class="block text-sm font-medium text-gray-700 mb-2">
                    Type Surveillant
                  </label>
                  <select 
                    id="typeSurveillant" 
                    v-model="form.typeSurveillant" 
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Non surveillant">Non surveillant</option>
                    <option value="Surveillant">Surveillant</option>
                  </select>
                </div>

                <!-- Statut -->
                <div class="form-group text-start">
                  <label for="actif" class="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select 
                    id="actif" 
                    v-model="form.actif" 
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option :value="true">Actif</option>
                    <option :value="false">Inactif</option>
                  </select>
                </div>
              </div>

              <!-- Téléphone -->
              <div class="form-group text-start">
                <label for="telephone" class="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input 
                  type="tel" 
                  id="telephone" 
                  v-model="form.telephone" 
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="+228 XX XX XX XX"
                />
              </div>

              <!-- Département -->
              <div class="form-group text-start">
                <label for="departement" class="block text-sm font-medium text-gray-700 mb-2">
                  Département
                </label>
                <input 
                  type="text" 
                  id="departement" 
                  v-model="form.departement" 
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Département"
                />
              </div>

              <!-- Notes -->
              <div class="form-group text-start">
                <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea 
                  id="notes" 
                  v-model="form.notes" 
                  rows="3"
                  class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Informations complémentaires..."
                ></textarea>
              </div>
            </div>
            <div class="modal-footer border-t border-gray-200 p-6 flex justify-end gap-3">
              <button type="button" @click="closeModal" class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Annuler
              </button>
              <button type="submit" class="btn btn-primary px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de visualisation -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div class="modal-content">
          <div class="modal-header border-b border-gray-200 p-6">
            <h5 class="modal-title text-lg font-semibold text-gray-900">Détails du membre</h5>
            <button type="button" @click="closeViewModal" class="btn-close text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="modal-body p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h6 class="text-sm font-medium text-gray-500 mb-1">Nom</h6>
                <p class="text-gray-900 font-medium">{{ viewedMembre.nom }}</p>
              </div>
              <div>
                <h6 class="text-sm font-medium text-gray-500 mb-1">Prénoms</h6>
                <p class="text-gray-900">{{ viewedMembre.prenoms }}</p>
              </div>
              <div>
                <h6 class="text-sm font-medium text-gray-500 mb-1">Email</h6>
                <p class="text-gray-900">{{ viewedMembre.email }}</p>
              </div>
              <div>
                <h6 class="text-sm font-medium text-gray-500 mb-1">Téléphone</h6>
                <p class="text-gray-900">{{ viewedMembre.telephone || 'Non renseigné' }}</p>
              </div>
            </div>

            <div>
              <h6 class="text-sm font-medium text-gray-500 mb-1">Rôles</h6>
              <div class="flex flex-wrap gap-2">
                <template v-if="viewedMembre.roles && typeof viewedMembre.roles === 'string'">
                  <span 
                    v-for="(role, index) in viewedMembre.roles.split(' ').filter(r => r && r.trim())" 
                    :key="index"
                    :class="[
                      'px-2 py-1 rounded text-xs font-medium',
                      getRoleClass(role.trim())
                    ]"
                  >
                    {{ role.trim() }}
                  </span>
                </template>
                <template v-else-if="Array.isArray(viewedMembre.roles)">
                  <span 
                    v-for="(role, index) in viewedMembre.roles.filter(r => r && r.trim())" 
                    :key="index"
                    :class="[
                      'px-2 py-1 rounded text-xs font-medium',
                      getRoleClass(role.trim())
                    ]"
                  >
                    {{ role.trim() }}
                  </span>
                </template>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <h6 class="text-sm font-medium text-gray-500 mb-1">Type Surveillant</h6>
                <span 
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    viewedMembre.typeSurveillant === 'Surveillant' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ viewedMembre.typeSurveillant || 'Non surveillant' }}
                </span>
              </div>
              <div>
                <h6 class="text-sm font-medium text-gray-500 mb-1">Statut</h6>
                <span 
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    viewedMembre.actif 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ viewedMembre.actif ? 'Actif' : 'Inactif' }}
                </span>
              </div>
            </div>

            <div v-if="viewedMembre.departement">
              <h6 class="text-sm font-medium text-gray-500 mb-1">Département</h6>
              <p class="text-gray-900">{{ viewedMembre.departement }}</p>
            </div>

            <div v-if="viewedMembre.notes">
              <h6 class="text-sm font-medium text-gray-500 mb-1">Notes</h6>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-gray-700">{{ viewedMembre.notes }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer border-t border-gray-200 p-6 flex justify-end">
            <button type="button" @click="closeViewModal" class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="modal-content">
          <div class="modal-header border-b border-gray-200 p-6">
            <h5 class="modal-title text-lg font-semibold text-gray-900">Suppression</h5>
            <button type="button" @click="closeDeleteModal" class="btn-close text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="modal-body p-6">
            <p class="text-gray-600 mb-6">
              Voulez-vous vraiment supprimer ce membre de l'administration ? Cette action est irréversible. Continuer ?
            </p>
          </div>
          <div class="modal-footer border-t border-gray-200 p-6 flex justify-end gap-3">
            <form @submit.prevent="deleteMembre" class="flex items-center gap-3">
              <input type="hidden" id="deleteMembreForm" :value="selectedMembre?.id" />
              <button 
                type="button" 
                @click="closeDeleteModal"
                class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Retour
              </button>
              <button 
                type="submit" 
                class="btn btn-warning px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
              >
                Continuer la suppression
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";

const searchQuery = ref("");
const filterRole = ref("");
const filterSurveillant = ref("");
const showSelector = ref(false);
const selectedColumns = ref([]);
const showModal = ref(false);
const showViewModal = ref(false);
const showDeleteModal = ref(false);
const modalTitle = ref('');
const selectedMembre = ref(null);
const viewedMembre = ref({});
const itemsPerPage = ref(50);
const loading = ref(false);

// Rôles disponibles
const rolesDisponibles = ref([
  { id: 1, nom: 'Utilisateur de la plateforme' },
  { id: 2, nom: 'Enseignant' },
  { id: 3, nom: 'Responsable du site' },
  { id: 4, nom: 'Directeur des Affaires Académique et Scolaires' },
  { id: 5, nom: 'Administrateur' }
]);

// Classes CSS pour les rôles
const getRoleClass = (role) => {
  if (!role) return 'bg-gray-100 text-gray-800';
  
  switch(role) {
    case 'Administrateur':
      return 'bg-red-100 text-red-800';
    case 'Enseignant':
      return 'bg-blue-100 text-blue-800';
    case 'Responsable du site':
      return 'bg-purple-100 text-purple-800';
    case 'Directeur des Affaires Académique et Scolaires':
      return 'bg-emerald-100 text-emerald-800';
    case 'Utilisateur de la plateforme':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Formulaire
const form = ref({
  id: null,
  nom: '',
  prenoms: '',
  email: '',
  roles: [],
  typeSurveillant: 'Non surveillant',
  actif: true,
  telephone: '',
  departement: '',
  notes: ''
});

// Charger les membres depuis localStorage
const loadMembres = () => {
  if (process.client) {
    const storedMembres = localStorage.getItem('membres_administration');
    if (storedMembres) {
      return JSON.parse(storedMembres);
    }
  }
  return [];
};

// Données initiales
const initialMembres = [
  { 
    id: 1, 
    nom: 'ADMIN', 
    prenoms: 'Administrateur', 
    roles: 'Utilisateur de la plateforme Responsable du site Directeur des Affaires Académique et Scolaires', 
    typeSurveillant: 'Non surveillant',
    email: 'admin@iai-togo.tg',
    actif: true
  },
  { 
    id: 2, 
    nom: 'APÉKÉ', 
    prenoms: 'Séna', 
    roles: 'Enseignant Utilisateur de la plateforme', 
    typeSurveillant: 'Non surveillant',
    email: 'sena.apeke@iai-togo.tg',
    actif: true
  },
  { 
    id: 3, 
    nom: 'ALFORD', 
    prenoms: 'Scarlet', 
    roles: 'Utilisateur de la plateforme Enseignant', 
    typeSurveillant: 'Non surveillant',
    email: 'scarlet.alford@iai-togo.tg',
    actif: true
  },
  { 
    id: 4, 
    nom: 'HOLMAN', 
    prenoms: 'Kamal', 
    roles: 'Utilisateur de la plateforme Enseignant', 
    typeSurveillant: 'Non surveillant',
    email: 'kamal.holman@iai-togo.tg',
    actif: true
  },
  { 
    id: 5, 
    nom: 'GBODUI', 
    prenoms: 'Roland Joseph', 
    roles: 'Enseignant Utilisateur de la plateforme', 
    typeSurveillant: 'Non surveillant',
    email: 'roland.gbodui@iai-togo.tg',
    actif: true
  },
  { 
    id: 6, 
    nom: 'AMEVOR', 
    prenoms: 'Kossi', 
    roles: 'Utilisateur de la plateforme Enseignant', 
    typeSurveillant: 'Non surveillant',
    email: 'kossi.amevor@iai-togo.tg',
    actif: true
  },
  { 
    id: 7, 
    nom: 'HANTZ', 
    prenoms: 'Hantz', 
    roles: 'Utilisateur de la plateforme Enseignant', 
    typeSurveillant: 'Non surveillant',
    email: 'hantz@iai-togo.tg',
    actif: true
  },
  { 
    id: 8, 
    nom: 'KEOULA', 
    prenoms: 'Edem Lonlon', 
    roles: 'Utilisateur de la plateforme Enseignant', 
    typeSurveillant: 'Non surveillant',
    email: 'edem.keoula@iai-togo.tg',
    actif: true
  },
  { 
    id: 9, 
    nom: 'DAVON', 
    prenoms: 'Essè Nicolas', 
    roles: 'Utilisateur de la plateforme Enseignant', 
    typeSurveillant: 'Non surveillant',
    email: 'esse.davon@iai-togo.tg',
    actif: true
  },
  { 
    id: 10, 
    nom: 'AMEYIKPO', 
    prenoms: 'Nicolas', 
    roles: 'Utilisateur de la plateforme Directeur des Affaires Académique et Scolaires Enseignant', 
    typeSurveillant: 'Non surveillant',
    email: 'nicolas.ameyikpo@iai-togo.tg',
    actif: true
  },
  { 
    id: 11, 
    nom: 'AMOUZOU', 
    prenoms: 'Kevin', 
    roles: 'Enseignant', 
    typeSurveillant: 'Non surveillant',
    email: 'kevin.amouzou@iai-togo.tg',
    actif: true
  },
  { 
    id: 12, 
    nom: 'AMOUZOU', 
    prenoms: 'Kevin', 
    roles: 'Enseignant', 
    typeSurveillant: 'Non surveillant',
    email: 'kevin2.amouzou@iai-togo.tg',
    actif: true
  },
  { 
    id: 13, 
    nom: 'ASSIBI', 
    prenoms: 'Jordan', 
    roles: 'Enseignant', 
    typeSurveillant: 'Non surveillant',
    email: 'jordan.assibi@iai-togo.tg',
    actif: true
  },
  { 
    id: 14, 
    nom: 'BERNARD', 
    prenoms: 'Kossi Jules', 
    roles: 'Responsable du site', 
    typeSurveillant: 'Non surveillant',
    email: 'kossi.bernard@iai-togo.tg',
    actif: true
  }
];

const rows = ref([]);

// Initialiser les données
onMounted(() => {
  let membres = loadMembres();
  if (membres.length === 0) {
    membres = initialMembres;
    if (process.client) {
      localStorage.setItem('membres_administration', JSON.stringify(membres));
    }
  }
  rows.value = membres;
  selectedColumns.value = availableColumns.value.map(col => col.field);
});

const availableColumns = ref([
  { field: "id", title: "#", width: "80px", isUnique: true },
  { field: "nom", title: "Nom" },
  { field: "prenoms", title: "Prénoms" },
  { field: "roles", title: "Rôles" },
  { field: "typeSurveillant", title: "Type Surveillant" },
  { field: "action", title: "Actions", sort: false, width: "180px", type: "click" }
]);

// Colonnes filtrées selon la sélection
const filteredCols = computed(() => {
  return availableColumns.value.filter(col => 
    selectedColumns.value.includes(col.field)
  );
});

// Rows filtrées selon la recherche et filtres
const filteredRows = computed(() => {
  let filtered = rows.value;
  
  // Filtre par rôle
  if (filterRole.value) {
    filtered = filtered.filter(membre => 
      membre.roles && membre.roles.toLowerCase().includes(filterRole.value.toLowerCase())
    );
  }
  
  // Filtre par type surveillant
  if (filterSurveillant.value) {
    filtered = filtered.filter(membre => 
      membre.typeSurveillant === filterSurveillant.value
    );
  }
  
  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(membre => 
      (membre.nom && membre.nom.toLowerCase().includes(query)) ||
      (membre.prenoms && membre.prenoms.toLowerCase().includes(query)) ||
      (membre.roles && membre.roles.toLowerCase().includes(query)) ||
      (membre.email && membre.email.toLowerCase().includes(query))
    );
  }
  
  return filtered;
});

const toggleSelector = () => {
  showSelector.value = !showSelector.value;
};

// Sauvegarder dans localStorage
const saveToLocalStorage = () => {
  if (process.client) {
    localStorage.setItem('membres_administration', JSON.stringify(rows.value));
  }
};

// Gestion des modales
const openAddModal = () => {
  modalTitle.value = "Formulaire de création d'un membre";
  form.value = { 
    id: null,
    nom: '',
    prenoms: '',
    email: '',
    roles: [],
    typeSurveillant: 'Non surveillant',
    actif: true,
    telephone: '',
    departement: '',
    notes: ''
  };
  showModal.value = true;
};

const openEditModal = (membre) => {
  modalTitle.value = "Formulaire de modification d'un membre";
  form.value = { 
    id: membre.id,
    nom: membre.nom,
    prenoms: membre.prenoms,
    email: membre.email,
    roles: membre.roles ? membre.roles.split(' ').filter(r => r && r.trim()) : [],
    typeSurveillant: membre.typeSurveillant || 'Non surveillant',
    actif: membre.actif !== undefined ? membre.actif : true,
    telephone: membre.telephone || '',
    departement: membre.departement || '',
    notes: membre.notes || ''
  };
  showModal.value = true;
};

const openViewModal = (membre) => {
  viewedMembre.value = membre;
  showViewModal.value = true;
};

const openDeleteModal = (membre) => {
  selectedMembre.value = membre;
  showDeleteModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const closeViewModal = () => {
  showViewModal.value = false;
  viewedMembre.value = {};
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedMembre.value = null;
};

// Gestion des membres
const saveMembre = () => {
  // Convertir le tableau de rôles en string
  const rolesString = form.value.roles.filter(r => r && r.trim()).join(' ');
  
  if (form.value.id) {
    // Mise à jour
    const index = rows.value.findIndex(m => m.id === form.value.id);
    if (index !== -1) {
      rows.value[index] = {
        ...rows.value[index],
        nom: form.value.nom ? form.value.nom.toUpperCase() : '',
        prenoms: form.value.prenoms || '',
        email: form.value.email || '',
        roles: rolesString,
        typeSurveillant: form.value.typeSurveillant || 'Non surveillant',
        actif: form.value.actif !== undefined ? form.value.actif : true,
        telephone: form.value.telephone || '',
        departement: form.value.departement || '',
        notes: form.value.notes || ''
      };
    }
  } else {
    // Création
    const newId = rows.value.length > 0 
      ? Math.max(...rows.value.map(m => m.id)) + 1 
      : 1;
    
    const newMembre = {
      id: newId,
      nom: form.value.nom ? form.value.nom.toUpperCase() : '',
      prenoms: form.value.prenoms || '',
      email: form.value.email || '',
      roles: rolesString,
      typeSurveillant: form.value.typeSurveillant || 'Non surveillant',
      actif: form.value.actif !== undefined ? form.value.actif : true,
      telephone: form.value.telephone || '',
      departement: form.value.departement || '',
      notes: form.value.notes || '',
      dateCreation: new Date().toISOString().split('T')[0]
    };
    
    rows.value.push(newMembre);
  }
  
  saveToLocalStorage();
  closeModal();
};

const toggleStatus = (membre) => {
  const index = rows.value.findIndex(m => m.id === membre.id);
  if (index !== -1) {
    rows.value[index].actif = !rows.value[index].actif;
    saveToLocalStorage();
  }
};

const deleteMembre = () => {
  if (selectedMembre.value) {
    const index = rows.value.findIndex(m => m.id === selectedMembre.value.id);
    if (index !== -1) {
      rows.value.splice(index, 1);
    }
    saveToLocalStorage();
    closeDeleteModal();
  }
};
</script>

<style scoped>
/* Styles pour le tableau */
:deep(.bh-table-wrapper) {
  overflow-x: auto;
}

:deep(.bh-table) {
  min-width: 100%;
  width: 100%;
  border-collapse: collapse;
}

:deep(.bh-table th) {
  padding: 12px 16px;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.bh-table td) {
  padding: 16px;
  white-space: nowrap;
  font-size: 0.875rem;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.bh-table tr:hover) {
  background-color: #f9fafb;
}

:deep(.bh-pagination) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

:deep(.bh-table-striped tbody tr:nth-child(odd)) {
  background-color: #f9fafb;
}

:deep(.bh-table-hover tbody tr:hover) {
  background-color: #f3f4f6;
}
</style>