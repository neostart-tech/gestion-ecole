<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <span class="cursor-pointer hover:text-blue-600 transition-colors">Études de dossier</span>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Liste</span>
    </div>

    <!-- Titre -->
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Liste des études de dossier</h1>

    <!-- Zone de recherche et filtres -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <!-- Recherche -->
      <input
        v-model="searchQuery"
        type="search"
        class="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        placeholder="Rechercher..."
      />

      <!-- Filtre par statut -->
      <div class="relative">
        <select 
          v-model="filterStatut"
          class="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Tous les statuts</option>
          <option value="En attente">En attente</option>
          <option value="En cours">En cours</option>
          <option value="Validé">Validé</option>
          <option value="Rejeté">Rejeté</option>
          <option value="Complément requis">Complément requis</option>
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
            <div class="flex justify-between items-center p-2 border-b mb-2">
              <span class="font-medium text-sm">Afficher/Masquer</span>
              <button 
                @click="toggleAllColumns" 
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                {{ allColumnsVisible ? 'Tout masquer' : 'Tout afficher' }}
              </button>
            </div>
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
                class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
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
          class="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span class="text-gray-600 whitespace-nowrap">éléments</span>
      </div>

      <!-- Bouton Nouvelle étude -->
      <button 
        @click="openAddModal"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Nouvelle étude
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
        <!-- Slot pour le code -->
        <template #code="data">
          <span class="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
            {{ data.value }}
          </span>
        </template>

        <!-- Slot pour le statut -->
        <template #statut="data">
          <span 
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium',
              getStatusClass(data.value)
            ]"
          >
            {{ data.value }}
          </span>
        </template>

        <!-- Slot pour le score -->
        <template #score="data">
          <div class="flex items-center">
            <div class="w-20 bg-gray-200 rounded-full h-2 mr-2">
              <div 
                :class="getScoreColor(data.value)" 
                class="h-2 rounded-full"
                :style="{ width: `${data.value}%` }"
              ></div>
            </div>
            <span class="text-sm font-medium">{{ data.value }}%</span>
          </div>
        </template>

        <!-- Slot pour les actions (SEULEMENT APERÇU) -->
        <template #action="data">
          <div class="flex items-center justify-center gap-2">
            <!-- SEULEMENT le bouton Aperçu -->
            <button 
              @click="openPreviewModal(data.row)"
              class="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200"
              title="Aperçu des détails"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </template>
      </Vue3Datatable>
    </div>

    <!-- Modal Aperçu des détails -->
    <div v-if="showPreviewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900">Évaluation d'une candidature - {{ previewData.nom }} {{ previewData.prenoms }}</h2>
            <button type="button" @click="closePreviewModal" class="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Informations du dossier -->
          <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p class="text-sm text-blue-600 font-medium mb-1">Code dossier</p>
                <p class="text-lg font-bold">{{ previewData.code }}</p>
              </div>
              <div>
                <p class="text-sm text-blue-600 font-medium mb-1">Statut</p>
                <span :class="['px-3 py-1 rounded-full text-xs font-medium', getStatusClass(previewData.statut)]">
                  {{ previewData.statut }}
                </span>
              </div>
              <div>
                <p class="text-sm text-blue-600 font-medium mb-1">Score</p>
                <div class="flex items-center">
                  <div class="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      :class="getScoreColor(previewData.score)" 
                      class="h-2 rounded-full"
                      :style="{ width: `${previewData.score}%` }"
                    ></div>
                  </div>
                  <span class="font-medium">{{ previewData.score }}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Sections dépliables -->
          <div class="space-y-4">
            <!-- Section 1: Identité du candidat -->
            <div class="border rounded-lg overflow-hidden">
              <button 
                @click="togglePreviewSection('identity')"
                class="w-full bg-blue-600 text-white p-4 flex justify-between items-center hover:bg-blue-700 transition"
              >
                <span class="font-semibold">Identité du candidat</span>
                <svg 
                  :class="{'rotate-180': previewSections.identity}"
                  class="w-5 h-5 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div v-if="previewSections.identity" class="p-6 bg-gray-50">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p class="text-gray-500 text-sm">Nom</p>
                    <p class="font-medium">{{ previewData.nom || 'Willms' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Prénom</p>
                    <p class="font-medium">{{ previewData.prenoms || 'Rebeca' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Nom de jeune fille</p>
                    <p class="font-medium">{{ previewData.nomJeuneFille || 'Katelyn' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Genre</p>
                    <p class="font-medium">{{ previewData.genre || 'Féminin' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Date de naissance</p>
                    <p class="font-medium">{{ previewData.dateNaissance || '29 décembre 1970' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Lieu de naissance</p>
                    <p class="font-medium">{{ previewData.lieuNaissance || 'Sokodé' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Téléphone</p>
                    <p class="font-medium">{{ previewData.telephone || '+228 808500531' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Nationalité</p>
                    <p class="font-medium">{{ previewData.nationalite || 'France' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Boîte postale</p>
                    <p class="font-medium text-gray-400">{{ previewData.boitePostale || '-' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Fax</p>
                    <p class="font-medium text-gray-400">{{ previewData.fax || '-' }}</p>
                  </div>
                  <div class="md:col-span-2 lg:col-span-3">
                    <p class="text-gray-500 text-sm">Centres d'intérêt</p>
                    <p class="font-medium mt-1">{{ previewData.centresInteret || 'Quidem et non illo aut quis hic. Eaque nisi nobis quidem eum eius. Dignissimos quos tempora provident itaque.' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Niveau d'études</p>
                    <p class="font-medium">{{ previewData.niveauEtudes || 'Licence 1' }}</p>
                  </div>
                  <div class="md:col-span-2">
                    <p class="text-gray-500 text-sm">Filière</p>
                    <p class="font-medium">{{ previewData.filiere || 'Génie Logiciel & Systèmes d\'Informations' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 2: Personne responsable des frais de formation -->
            <div class="border rounded-lg overflow-hidden">
              <button 
                @click="togglePreviewSection('payer')"
                class="w-full bg-green-600 text-white p-4 flex justify-between items-center hover:bg-green-700 transition"
              >
                <span class="font-semibold">Personne responsable des frais de formation</span>
                <svg 
                  :class="{'rotate-180': previewSections.payer}"
                  class="w-5 h-5 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div v-if="previewSections.payer" class="p-6 bg-gray-50">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p class="text-gray-500 text-sm">Nom</p>
                    <p class="font-medium">{{ previewData.responsableNom || 'Goyette' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Prénom(s)</p>
                    <p class="font-medium">{{ previewData.responsablePrenoms || 'Christine' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Profession</p>
                    <p class="font-medium">{{ previewData.responsableProfession || 'id' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Nom de l'employeur</p>
                    <p class="font-medium">{{ previewData.responsableEmployeur || 'modi' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Email</p>
                    <p class="font-medium">{{ previewData.responsableEmail || 'prosacco.rafaela@gmail.com' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Téléphone</p>
                    <p class="font-medium">{{ previewData.responsableTelephone || '+228 543937316' }}</p>
                  </div>
                  <div class="md:col-span-2 lg:col-span-3">
                    <p class="text-gray-500 text-sm">Adresse</p>
                    <p class="font-medium">{{ previewData.responsableAdresse || '4136 Sage Court Apt. 025North Jordane, AL 57344' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Fax</p>
                    <p class="font-medium text-gray-400">{{ previewData.responsableFax || '-' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Boîte postale</p>
                    <p class="font-medium text-gray-400">{{ previewData.responsableBoitePostale || '-' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 3: Parent ou tuteur -->
            <div class="border rounded-lg overflow-hidden">
              <button 
                @click="togglePreviewSection('parent')"
                class="w-full bg-purple-600 text-white p-4 flex justify-between items-center hover:bg-purple-700 transition"
              >
                <span class="font-semibold">Parent ou tuteur</span>
                <svg 
                  :class="{'rotate-180': previewSections.parent}"
                  class="w-5 h-5 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div v-if="previewSections.parent" class="p-6 bg-gray-50">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p class="text-gray-500 text-sm">Nom</p>
                    <p class="font-medium">{{ previewData.parentNom || 'Collins' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Prénom(s)</p>
                    <p class="font-medium">{{ previewData.parentPrenoms || 'Elyse' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Profession</p>
                    <p class="font-medium">{{ previewData.parentProfession || 'amet' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Nom de l'employeur</p>
                    <p class="font-medium">{{ previewData.parentEmployeur || 'odio' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Email</p>
                    <p class="font-medium">{{ previewData.parentEmail || 'kaylee.ward@okuneva.com' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Téléphone</p>
                    <p class="font-medium">{{ previewData.parentTelephone || '+228 605846213' }}</p>
                  </div>
                  <div class="md:col-span-2 lg:col-span-3">
                    <p class="text-gray-500 text-sm">Adresse</p>
                    <p class="font-medium">{{ previewData.parentAdresse || '1200 Jordane TurnpikeMelisabury, VA 42511-6599' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Fax</p>
                    <p class="font-medium text-gray-400">{{ previewData.parentFax || '-' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Boîte postale</p>
                    <p class="font-medium text-gray-400">{{ previewData.parentBoitePostale || '-' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 4: Documents -->
            <div class="border rounded-lg overflow-hidden">
              <button 
                @click="togglePreviewSection('documents')"
                class="w-full bg-orange-600 text-white p-4 flex justify-between items-center hover:bg-orange-700 transition"
              >
                <span class="font-semibold">Documents</span>
                <svg 
                  :class="{'rotate-180': previewSections.documents}"
                  class="w-5 h-5 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div v-if="previewSections.documents" class="p-6 bg-gray-50">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div class="border rounded-lg p-4 bg-white">
                    <p class="text-gray-500 text-sm mb-2">Lettre manuscrite</p>
                    <div class="bg-gray-100 h-32 flex items-center justify-center rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div class="border rounded-lg p-4 bg-white">
                    <p class="text-gray-500 text-sm mb-2">Extrait de naissance</p>
                    <div class="bg-gray-100 h-32 flex items-center justify-center rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div class="border rounded-lg p-4 bg-white">
                    <p class="text-gray-500 text-sm mb-2">Certificat de nationalité</p>
                    <div class="bg-gray-100 h-32 flex items-center justify-center rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div class="border rounded-lg p-4 bg-white">
                    <p class="text-gray-500 text-sm mb-2">Diplôme requis</p>
                    <p class="font-medium mb-2">{{ previewData.diplomeRequis || 'BAC 2' }}</p>
                    <div class="bg-gray-100 h-32 flex items-center justify-center rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div class="border rounded-lg p-4 bg-white">
                    <p class="text-gray-500 text-sm mb-2">Photo d'identité</p>
                    <div class="bg-gray-100 h-32 flex items-center justify-center rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div class="border rounded-lg p-4 bg-white">
                    <p class="text-gray-500 text-sm mb-2">Certificat médical</p>
                    <div class="bg-gray-100 h-32 flex items-center justify-center rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div class="border rounded-lg p-4 bg-white md:col-span-2 lg:col-span-3">
                    <p class="text-gray-500 text-sm mb-2">Coupon réponse</p>
                    <div class="bg-gray-100 h-32 flex items-center justify-center rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <!-- Bulletins et relevés -->
                <div class="mt-8">
                  <h3 class="font-bold text-lg mb-4">Bulletins et relevés (0)</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="border rounded-lg p-4 bg-white">
                      <p class="font-medium mb-2">Bulletins Seconde</p>
                      <p class="text-gray-500 italic">Aucun bulletin</p>
                    </div>
                    <div class="border rounded-lg p-4 bg-white">
                      <p class="font-medium mb-2">Bulletins Première</p>
                      <p class="text-gray-500 italic">Aucun bulletin</p>
                    </div>
                    <div class="border rounded-lg p-4 bg-white">
                      <p class="font-medium mb-2">Bulletins Terminale</p>
                      <p class="text-gray-500 italic">Aucun bulletin</p>
                    </div>
                    <div class="border rounded-lg p-4 bg-white">
                      <p class="font-medium mb-2">Relevés BAC 1</p>
                      <p class="text-gray-500 italic">Aucun relevé BAC 1</p>
                    </div>
                    <div class="border rounded-lg p-4 bg-white md:col-span-2">
                      <p class="font-medium mb-2">Relevés BAC 2</p>
                      <p class="text-gray-500 italic">Aucun relevé BAC 2</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 pt-6 border-t mt-6">
            <button @click="closePreviewModal" class="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout/modification -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div class="modal-content">
          <form @submit.prevent="saveDossier">
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
                <div class="form-group text-start">
                  <label for="nom" class="block text-sm font-medium text-gray-700 mb-2">
                    Nom <span class="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="nom" 
                    v-model="form.nom" 
                    required
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Nom"
                  />
                </div>

                <div class="form-group text-start">
                  <label for="prenoms" class="block text-sm font-medium text-gray-700 mb-2">
                    Prénoms <span class="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="prenoms" 
                    v-model="form.prenoms" 
                    required
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Prénoms"
                  />
                </div>

                <div class="form-group text-start">
                  <label for="code" class="block text-sm font-medium text-gray-700 mb-2">
                    Code <span class="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="code" 
                    v-model="form.code" 
                    required
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Code"
                  />
                </div>

                <div class="form-group text-start">
                  <label for="statut" class="block text-sm font-medium text-gray-700 mb-2">
                    Statut <span class="text-red-500">*</span>
                  </label>
                  <select 
                    id="statut" 
                    v-model="form.statut" 
                    required
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="En attente">En attente</option>
                    <option value="En cours">En cours</option>
                    <option value="Validé">Validé</option>
                    <option value="Rejeté">Rejeté</option>
                    <option value="Complément requis">Complément requis</option>
                  </select>
                </div>

                <div class="form-group text-start">
                  <label for="evaluateur" class="block text-sm font-medium text-gray-700 mb-2">
                    Évaluateur
                  </label>
                  <input 
                    type="text" 
                    id="evaluateur" 
                    v-model="form.evaluateur" 
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Évaluateur"
                  />
                </div>

                <div class="form-group text-start">
                  <label for="score" class="block text-sm font-medium text-gray-700 mb-2">
                    Score
                  </label>
                  <div class="flex items-center gap-2">
                    <input 
                      type="range" 
                      id="score" 
                      v-model="form.score" 
                      min="0" 
                      max="100" 
                      step="1"
                      class="w-full"
                    />
                    <span class="text-lg font-bold text-blue-600 min-w-[50px]">{{ form.score }}%</span>
                  </div>
                </div>

                <div class="form-group text-start">
                  <label for="typeFormation" class="block text-sm font-medium text-gray-700 mb-2">
                    Type de formation
                  </label>
                  <select 
                    id="typeFormation" 
                    v-model="form.typeFormation" 
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Licence">Licence</option>
                    <option value="Master">Master</option>
                    <option value="Doctorat">Doctorat</option>
                    <option value="Formation continue">Formation continue</option>
                  </select>
                </div>

                <div class="form-group text-start">
                  <label for="dateSoumission" class="block text-sm font-medium text-gray-700 mb-2">
                    Date de soumission
                  </label>
                  <input 
                    type="date" 
                    id="dateSoumission" 
                    v-model="form.dateSoumission" 
                    class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>

                <!-- Champs supplémentaires pour les détails -->
                <div class="form-group text-start md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Informations supplémentaires
                  </label>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      v-model="form.nomJeuneFille" 
                      class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="Nom de jeune fille"
                    />
                    <input 
                      type="text" 
                      v-model="form.genre" 
                      class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="Genre"
                    />
                    <input 
                      type="text" 
                      v-model="form.nationalite" 
                      class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="Nationalité"
                    />
                    <input 
                      type="text" 
                      v-model="form.telephone" 
                      class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="Téléphone"
                    />
                    <input 
                      type="text" 
                      v-model="form.niveauEtudes" 
                      class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="Niveau d'études"
                    />
                    <input 
                      type="text" 
                      v-model="form.filiere" 
                      class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="Filière"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer border-t border-gray-200 p-6 flex justify-end gap-3">
              <button type="button" @click="closeModal" class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Annuler
              </button>
              <button type="submit" class="btn btn-primary px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Enregistrer
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
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";

const searchQuery = ref("");
const filterStatut = ref("");
const showSelector = ref(false);
const selectedColumns = ref([]);
const showModal = ref(false);
const showPreviewModal = ref(false);
const modalTitle = ref('');
const selectedDossier = ref(null);
const itemsPerPage = ref(50);
const loading = ref(false);

// Sections dépliables dans l'aperçu
const previewSections = ref({
  identity: true,
  payer: true,
  parent: true,
  documents: true,
});

// Données pour l'aperçu
const previewData = ref({
  nom: '',
  prenoms: '',
  code: '',
  statut: '',
  score: 0,
  nomJeuneFille: '',
  genre: '',
  dateNaissance: '',
  lieuNaissance: '',
  telephone: '',
  nationalite: '',
  boitePostale: '',
  fax: '',
  centresInteret: '',
  niveauEtudes: '',
  filiere: '',
  responsableNom: '',
  responsablePrenoms: '',
  responsableProfession: '',
  responsableEmployeur: '',
  responsableEmail: '',
  responsableTelephone: '',
  responsableAdresse: '',
  responsableFax: '',
  responsableBoitePostale: '',
  parentNom: '',
  parentPrenoms: '',
  parentProfession: '',
  parentEmployeur: '',
  parentEmail: '',
  parentTelephone: '',
  parentAdresse: '',
  parentFax: '',
  parentBoitePostale: '',
  diplomeRequis: ''
});

// Formulaire principal
const form = ref({
  id: null,
  nom: '',
  prenoms: '',
  code: '',
  statut: 'En attente',
  evaluateur: '',
  score: 50,
  typeFormation: 'Licence',
  dateSoumission: new Date().toISOString().split('T')[0],
  dateEvaluation: '',
  // Champs supplémentaires pour l'aperçu
  nomJeuneFille: '',
  genre: 'Féminin',
  nationalite: 'France',
  telephone: '',
  niveauEtudes: 'Licence 1',
  filiere: 'Génie Logiciel & Systèmes d\'Informations'
});

// Classes CSS pour les statuts
const getStatusClass = (statut) => {
  switch(statut) {
    case 'En attente':
      return 'bg-yellow-100 text-yellow-800';
    case 'En cours':
      return 'bg-blue-100 text-blue-800';
    case 'Validé':
      return 'bg-green-100 text-green-800';
    case 'Rejeté':
      return 'bg-red-100 text-red-800';
    case 'Complément requis':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getScoreColor = (score) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

// Charger les dossiers depuis localStorage
const loadDossiers = () => {
  if (process.client) {
    const storedDossiers = localStorage.getItem('etudesDossier');
    if (storedDossiers) {
      return JSON.parse(storedDossiers);
    }
  }
  return [];
};

// Données initiales
const initialDossiers = [
  { 
    id: 1, 
    nom: "Willms", 
    prenoms: "Rebeca", 
    code: "98304", 
    statut: "En cours", 
    evaluateur: "Jean Dupont",
    score: 75,
    typeFormation: "Licence",
    dateSoumission: "2024-12-10",
    dateEvaluation: "2024-12-11",
    nomJeuneFille: "Katelyn",
    genre: "Féminin",
    nationalite: "France",
    telephone: "+228 808500531",
    niveauEtudes: "Licence 1",
    filiere: "Génie Logiciel & Systèmes d'Informations"
  },
  { 
    id: 2, 
    nom: "Crona", 
    prenoms: "Kraig", 
    code: "83460", 
    statut: "Validé", 
    evaluateur: "Marie Martin",
    score: 92,
    typeFormation: "Master",
    dateSoumission: "2024-12-09",
    dateEvaluation: "2024-12-10"
  },
  { 
    id: 3, 
    nom: "Schmeler", 
    prenoms: "Katelyn", 
    code: "41638", 
    statut: "En attente", 
    evaluateur: "",
    score: 0,
    typeFormation: "Licence",
    dateSoumission: "2024-12-08",
    dateEvaluation: ""
  },
  { 
    id: 4, 
    nom: "Moen", 
    prenoms: "Icie", 
    code: "80368", 
    statut: "Rejeté", 
    evaluateur: "Pierre Leroy",
    score: 45,
    typeFormation: "Doctorat",
    dateSoumission: "2024-12-07",
    dateEvaluation: "2024-12-08"
  }
];

const rows = ref([]);

// Initialiser les données
onMounted(() => {
  let dossiers = loadDossiers();
  if (dossiers.length === 0) {
    dossiers = initialDossiers;
    if (process.client) {
      localStorage.setItem('etudesDossier', JSON.stringify(dossiers));
    }
  }
  rows.value = dossiers;
  selectedColumns.value = availableColumns.value.map(col => col.field);
});

const availableColumns = ref([
  { field: "id", title: "#", width: "80px", isUnique: true },
  { field: "nom", title: "Nom" },
  { field: "prenoms", title: "Prénoms" },
  { field: "code", title: "Code" },
  { field: "statut", title: "Statut" },
  { field: "evaluateur", title: "Évaluateur" },
  { field: "score", title: "Score" },
  { field: "typeFormation", title: "Type de formation" },
  { field: "dateSoumission", title: "Date de soumission" },
  { field: "action", title: "Action", sort: false, width: "100px", type: "click" }
]);

// Colonnes filtrées selon la sélection
const filteredCols = computed(() => {
  return availableColumns.value.filter(col => 
    selectedColumns.value.includes(col.field)
  );
});

// Rows filtrées selon la recherche et le filtre de statut
const filteredRows = computed(() => {
  let filtered = rows.value;
  
  // Filtre par statut
  if (filterStatut.value) {
    filtered = filtered.filter(dossier => 
      dossier.statut === filterStatut.value
    );
  }
  
  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(dossier => 
      dossier.nom.toLowerCase().includes(query) ||
      dossier.prenoms.toLowerCase().includes(query) ||
      dossier.code.toLowerCase().includes(query) ||
      dossier.statut.toLowerCase().includes(query) ||
      (dossier.evaluateur && dossier.evaluateur.toLowerCase().includes(query)) ||
      (dossier.typeFormation && dossier.typeFormation.toLowerCase().includes(query))
    );
  }
  
  return filtered;
});

const allColumnsVisible = computed(() => {
  return availableColumns.value.every(col => 
    selectedColumns.value.includes(col.field)
  );
});

const toggleSelector = () => {
  showSelector.value = !showSelector.value;
};

const toggleAllColumns = () => {
  const newValue = !allColumnsVisible.value;
  selectedColumns.value = newValue 
    ? availableColumns.value.map(col => col.field)
    : [];
};

// Gestion des sections de l'aperçu
const togglePreviewSection = (section) => {
  previewSections.value[section] = !previewSections.value[section];
};

// Sauvegarder dans localStorage
const saveToLocalStorage = () => {
  if (process.client) {
    localStorage.setItem('etudesDossier', JSON.stringify(rows.value));
  }
};

// Gestion des modales
const openAddModal = () => {
  modalTitle.value = "Formulaire de création d'une étude de dossier";
  form.value = { 
    id: null,
    nom: '',
    prenoms: '',
    code: '',
    statut: 'En attente',
    evaluateur: '',
    score: 50,
    typeFormation: 'Licence',
    dateSoumission: new Date().toISOString().split('T')[0],
    dateEvaluation: '',
    nomJeuneFille: '',
    genre: 'Féminin',
    nationalite: 'France',
    telephone: '',
    niveauEtudes: 'Licence 1',
    filiere: 'Génie Logiciel & Systèmes d\'Informations'
  };
  showModal.value = true;
};

const openPreviewModal = (dossier) => {
  selectedDossier.value = dossier;
  
  // Mettre à jour les données d'aperçu avec les données du dossier
  previewData.value = {
    nom: dossier.nom,
    prenoms: dossier.prenoms,
    code: dossier.code,
    statut: dossier.statut,
    score: dossier.score || 0,
    nomJeuneFille: dossier.nomJeuneFille || 'Katelyn',
    genre: dossier.genre || 'Féminin',
    dateNaissance: dossier.dateNaissance || '29 décembre 1970',
    lieuNaissance: dossier.lieuNaissance || 'Sokodé',
    telephone: dossier.telephone || '+228 808500531',
    nationalite: dossier.nationalite || 'France',
    boitePostale: dossier.boitePostale || '-',
    fax: dossier.fax || '-',
    centresInteret: dossier.centresInteret || 'Quidem et non illo aut quis hic. Eaque nisi nobis quidem eum eius. Dignissimos quos tempora provident itaque.',
    niveauEtudes: dossier.niveauEtudes || 'Licence 1',
    filiere: dossier.filiere || 'Génie Logiciel & Systèmes d\'Informations',
    responsableNom: dossier.responsableNom || 'Goyette',
    responsablePrenoms: dossier.responsablePrenoms || 'Christine',
    responsableProfession: dossier.responsableProfession || 'id',
    responsableEmployeur: dossier.responsableEmployeur || 'modi',
    responsableEmail: dossier.responsableEmail || 'prosacco.rafaela@gmail.com',
    responsableTelephone: dossier.responsableTelephone || '+228 543937316',
    responsableAdresse: dossier.responsableAdresse || '4136 Sage Court Apt. 025North Jordane, AL 57344',
    responsableFax: dossier.responsableFax || '-',
    responsableBoitePostale: dossier.responsableBoitePostale || '-',
    parentNom: dossier.parentNom || 'Collins',
    parentPrenoms: dossier.parentPrenoms || 'Elyse',
    parentProfession: dossier.parentProfession || 'amet',
    parentEmployeur: dossier.parentEmployeur || 'odio',
    parentEmail: dossier.parentEmail || 'kaylee.ward@okuneva.com',
    parentTelephone: dossier.parentTelephone || '+228 605846213',
    parentAdresse: dossier.parentAdresse || '1200 Jordane TurnpikeMelisabury, VA 42511-6599',
    parentFax: dossier.parentFax || '-',
    parentBoitePostale: dossier.parentBoitePostale || '-',
    diplomeRequis: dossier.diplomeRequis || 'BAC 2'
  };
  
  // Ouvrir toutes les sections par défaut
  Object.keys(previewSections.value).forEach(key => {
    previewSections.value[key] = true;
  });
  
  showPreviewModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  form.value = {
    id: null,
    nom: '',
    prenoms: '',
    code: '',
    statut: 'En attente',
    evaluateur: '',
    score: 50,
    typeFormation: 'Licence',
    dateSoumission: new Date().toISOString().split('T')[0],
    dateEvaluation: '',
    nomJeuneFille: '',
    genre: 'Féminin',
    nationalite: 'France',
    telephone: '',
    niveauEtudes: 'Licence 1',
    filiere: 'Génie Logiciel & Systèmes d\'Informations'
  };
};

const closePreviewModal = () => {
  showPreviewModal.value = false;
  selectedDossier.value = null;
  previewData.value = {
    nom: '',
    prenoms: '',
    code: '',
    statut: '',
    score: 0,
    nomJeuneFille: '',
    genre: '',
    dateNaissance: '',
    lieuNaissance: '',
    telephone: '',
    nationalite: '',
    boitePostale: '',
    fax: '',
    centresInteret: '',
    niveauEtudes: '',
    filiere: '',
    responsableNom: '',
    responsablePrenoms: '',
    responsableProfession: '',
    responsableEmployeur: '',
    responsableEmail: '',
    responsableTelephone: '',
    responsableAdresse: '',
    responsableFax: '',
    responsableBoitePostale: '',
    parentNom: '',
    parentPrenoms: '',
    parentProfession: '',
    parentEmployeur: '',
    parentEmail: '',
    parentTelephone: '',
    parentAdresse: '',
    parentFax: '',
    parentBoitePostale: '',
    diplomeRequis: ''
  };
};

// Gestion des dossiers
const saveDossier = () => {
  if (form.value.id) {
    // Mise à jour
    const index = rows.value.findIndex(d => d.id === form.value.id);
    if (index !== -1) {
      rows.value[index] = {
        ...rows.value[index],
        nom: form.value.nom,
        prenoms: form.value.prenoms,
        code: form.value.code,
        statut: form.value.statut,
        evaluateur: form.value.evaluateur,
        score: parseInt(form.value.score),
        typeFormation: form.value.typeFormation,
        dateSoumission: form.value.dateSoumission,
        // Sauvegarder les champs supplémentaires
        nomJeuneFille: form.value.nomJeuneFille,
        genre: form.value.genre,
        nationalite: form.value.nationalite,
        telephone: form.value.telephone,
        niveauEtudes: form.value.niveauEtudes,
        filiere: form.value.filiere
      };
    }
  } else {
    // Création
    const newId = rows.value.length > 0 
      ? Math.max(...rows.value.map(d => d.id)) + 1 
      : 1;
    
    const newDossier = {
      id: newId,
      nom: form.value.nom,
      prenoms: form.value.prenoms,
      code: form.value.code,
      statut: form.value.statut,
      evaluateur: form.value.evaluateur,
      score: parseInt(form.value.score),
      typeFormation: form.value.typeFormation,
      dateSoumission: form.value.dateSoumission,
      dateEvaluation: '',
      // Sauvegarder les champs supplémentaires
      nomJeuneFille: form.value.nomJeuneFille,
      genre: form.value.genre,
      nationalite: form.value.nationalite,
      telephone: form.value.telephone,
      niveauEtudes: form.value.niveauEtudes,
      filiere: form.value.filiere
    };
    
    rows.value.push(newDossier);
  }
  
  saveToLocalStorage();
  closeModal();
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

/* Style pour le range input */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  border-radius: 4px;
  background: #e5e7eb;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>