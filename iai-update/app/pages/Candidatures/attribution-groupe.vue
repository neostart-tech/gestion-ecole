<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <span class="cursor-pointer hover:text-indigo-600 transition-colors">Administration</span>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Attribution de groupes aux candidats</span>
    </div>

    <!-- Titre -->
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Attribution de groupes aux candidats</h1>

    <!-- Instruction -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-sm text-blue-800">
          Ne sélectionnez que les étudiants que vous voulez ajouter au groupe
        </p>
      </div>
    </div>

    <!-- Grille des groupes -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- Groupe A - GLSI -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-1">GROUPE A - GLSI</h3>
              <p class="text-sm text-gray-600">Génie Logiciel & Systèmes d'Informations</p>
            </div>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              25 Étudiants
            </span>
          </div>
          <div class="space-y-2 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span>Responsable: Prof. Martin Dupont</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Horaires: Lundi 08h-12h</span>
            </div>
          </div>
          <div class="mt-6 flex items-center justify-between">
            <button 
              @click="viewGroupDetails('groupe-a-gls1')"
              class="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Voir les détails
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
            <button 
              @click="selectGroup('groupe-a-gls1')"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
            >
              Sélectionner
            </button>
          </div>
        </div>
      </div>

      <!-- Groupe B - TC_1 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-1">GROUPE B - TC_1</h3>
              <p class="text-sm text-gray-600">Tronc Commun Première Année</p>
            </div>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
              30 Étudiants
            </span>
          </div>
          <div class="space-y-2 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span>Responsable: Prof. Sophie Bernard</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Horaires: Mardi 14h-18h</span>
            </div>
          </div>
          <div class="mt-6 flex items-center justify-between">
            <button 
              @click="viewGroupDetails('groupe-b-tc1')"
              class="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Voir les détails
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
            <button 
              @click="selectGroup('groupe-b-tc1')"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
            >
              Sélectionner
            </button>
          </div>
        </div>
      </div>

      <!-- Groupe C - TC_1 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-1">GROUPE C - TC_1</h3>
              <p class="text-sm text-gray-600">Tronc Commun Première Année</p>
            </div>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
              19 Étudiants
            </span>
          </div>
          <div class="space-y-2 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span>Responsable: Prof. Thomas Leroy</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Horaires: Mercredi 08h-12h</span>
            </div>
          </div>
          <div class="mt-6 flex items-center justify-between">
            <button 
              @click="viewGroupDetails('groupe-c-tc1')"
              class="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Voir les détails
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
            <button 
              @click="selectGroup('groupe-c-tc1')"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
            >
              Sélectionner
            </button>
          </div>
        </div>
      </div>

      <!-- Groupe des Elites de Génie Logiciel -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-1">GROUPE DES ELITES DE GENIE LOGICIEL</h3>
              <p class="text-sm text-gray-600">GLSI - Groupe Avancé</p>
            </div>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              1 Étudiant
            </span>
          </div>
          <div class="space-y-2 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span>Responsable: Prof. Julie Moreau</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Horaires: Jeudi 14h-18h</span>
            </div>
          </div>
          <div class="mt-6 flex items-center justify-between">
            <button 
              @click="viewGroupDetails('elites-gls1')"
              class="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Voir les détails
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
            <button 
              @click="selectGroup('elites-gls1')"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
            >
              Sélectionner
            </button>
          </div>
        </div>
      </div>

      <!-- Groupe Z - ASR -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-1">GROUPE Z - ASR</h3>
              <p class="text-sm text-gray-600">Administration Systèmes & Réseaux</p>
            </div>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              0 Étudiants
            </span>
          </div>
          <div class="space-y-2 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span>Responsable: À déterminer</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Horaires: Vendredi 08h-12h</span>
            </div>
          </div>
          <div class="mt-6 flex items-center justify-between">
            <button 
              @click="viewGroupDetails('groupe-z-asr')"
              class="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Voir les détails
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
            <button 
              @click="selectGroup('groupe-z-asr')"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
            >
              Sélectionner
            </button>
          </div>
        </div>
      </div>

      <!-- Nouveau groupe -->
      <div class="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden hover:border-indigo-400 transition-colors">
        <div class="p-6 h-full flex flex-col items-center justify-center text-center">
          <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Créer un nouveau groupe</h3>
          <p class="text-sm text-gray-600 mb-4">
            Ajoutez un nouveau groupe pour organiser vos étudiants
          </p>
          <button 
            @click="createNewGroup"
            class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Créer un groupe
          </button>
        </div>
      </div>
    </div>

    <!-- Tableau des étudiants (visible uniquement quand un groupe est sélectionné) -->
    <div v-if="selectedGroup" class="bg-white rounded-xl shadow-sm overflow-hidden">
      <!-- En-tête du groupe sélectionné -->
      <div class="bg-indigo-50 border-b border-indigo-100 p-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold text-indigo-900 mb-1">
              Ajouter des étudiants à : {{ selectedGroup.name }}
            </h2>
            <p class="text-indigo-700">
              Sélectionnez les étudiants à ajouter à ce groupe
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button 
              @click="deselectGroup"
              class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Changer de groupe
            </button>
            <button 
              @click="addSelectedStudents"
              :disabled="selectedStudents.length === 0"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                selectedStudents.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              ]"
            >
              Ajouter {{ selectedStudents.length }} étudiant(s)
            </button>
          </div>
        </div>
      </div>

      <!-- Barre de contrôle du tableau -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 border-b border-gray-200">
        <!-- Sélecteur d'éléments -->
        <div class="flex items-center gap-2">
          <span class="text-gray-600 whitespace-nowrap">Afficher</span>
          <select 
            v-model="itemsPerPage" 
            class="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span class="text-gray-600 whitespace-nowrap">éléments</span>
        </div>

        <!-- Recherche -->
        <div class="relative w-full md:w-64">
          <input
            v-model="searchQuery"
            type="search"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Rechercher:"
          />
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Tableau des étudiants -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <input
                  type="checkbox"
                  :checked="allSelected"
                  @change="toggleSelectAll"
                  class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                #
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Nom
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Prénoms
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Code
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <!-- Message vide -->
            <tr v-if="filteredStudents.length === 0">
              <td colspan="6" class="px-6 py-12 text-center">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun étudiant trouvé</h3>
                <p class="text-gray-500">
                  {{ searchQuery ? 'Aucun résultat pour votre recherche' : 'Aucun étudiant disponible' }}
                </p>
              </td>
            </tr>

            <!-- Liste des étudiants -->
            <tr 
              v-for="(student, index) in paginatedStudents" 
              :key="student.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- Checkbox de sélection -->
              <td class="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  :checked="isSelected(student.id)"
                  @change="toggleStudentSelection(student.id)"
                  class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </td>

              <!-- Numéro -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900 font-medium">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </span>
              </td>

              <!-- Nom -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span class="text-gray-600 font-semibold text-xs">
                      {{ getInitials(student.lastName, student.firstName) }}
                    </span>
                  </div>
                  <span class="text-sm font-medium text-gray-900">
                    {{ student.lastName }}
                  </span>
                </div>
              </td>

              <!-- Prénoms -->
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">
                  {{ student.firstName }}
                </span>
              </td>

              <!-- Code -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {{ student.code }}
                </span>
              </td>

              <!-- Action -->
              <td class="px-6 py-4 whitespace-nowrap">
                <button 
                  @click="addSingleStudent(student)"
                  class="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors font-medium text-sm"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  Intégrer au groupe
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="filteredStudents.length > 0" class="border-t border-gray-200 px-6 py-4">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <!-- Info de pagination -->
          <div class="text-sm text-gray-700">
            Affichage de 
            <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
            à
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredStudents.length) }}</span>
            sur
            <span class="font-medium">{{ filteredStudents.length }}</span>
            étudiants
          </div>

          <!-- Contrôles de pagination -->
          <div class="flex items-center gap-2">
            <!-- Bouton Précédent -->
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              :class="[
                'px-3 py-1 border border-gray-300 rounded-lg text-sm',
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                  : 'text-gray-700 hover:bg-gray-50'
              ]"
            >
              Précédent
            </button>

            <!-- Numéros de page -->
            <div class="flex items-center gap-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium',
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                {{ page }}
              </button>
              
              <!-- Ellipsis -->
              <span v-if="hasMorePages" class="px-2 text-gray-400">...</span>
            </div>

            <!-- Bouton Suivant -->
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              :class="[
                'px-3 py-1 border border-gray-300 rounded-lg text-sm',
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                  : 'text-gray-700 hover:bg-gray-50'
              ]"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de création de groupe -->
    <div v-if="showCreateGroupModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <form @submit.prevent="createGroup" class="modal-content">
          <div class="modal-header border-b border-gray-200 p-6">
            <h5 class="modal-title text-lg font-semibold text-gray-900">
              Créer un nouveau groupe
            </h5>
            <button type="button" @click="closeCreateGroupModal" class="btn-close text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <div class="modal-body p-6 space-y-4">
            <!-- Nom du groupe -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Nom du groupe <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="newGroup.name"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Ex: GROUPE D - MTWI"
              />
            </div>

            <!-- Description -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                v-model="newGroup.description"
                rows="2"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Description du groupe..."
              ></textarea>
            </div>

            <!-- Filière -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Filière associée
              </label>
              <select
                v-model="newGroup.program"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              >
                <option value="">Sélectionner une filière</option>
                <option value="GLSI">GLSI - Génie Logiciel</option>
                <option value="TC_1">TC_1 - Tronc Commun 1</option>
                <option value="TC_2">TC_2 - Tronc Commun 2</option>
                <option value="ASR">ASR - Administration Systèmes</option>
                <option value="MTWI">MTWI - Multimédia & Web</option>
              </select>
            </div>

            <!-- Responsable -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Responsable du groupe
              </label>
              <input
                v-model="newGroup.responsible"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Nom du responsable"
              />
            </div>

            <!-- Horaires -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Horaires
              </label>
              <input
                v-model="newGroup.schedule"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Ex: Lundi 08h-12h"
              />
            </div>
          </div>
          
          <div class="modal-footer border-t border-gray-200 p-6 flex justify-end gap-3">
            <button 
              type="button" 
              @click="closeCreateGroupModal"
              class="btn btn-secondary px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              class="btn btn-primary px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Créer le groupe
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Données réactives
const searchQuery = ref('');
const itemsPerPage = ref(50);
const currentPage = ref(1);
const selectedGroup = ref(null);
const selectedStudents = ref([]);
const showCreateGroupModal = ref(false);

// Données des groupes
const groups = ref([
  {
    id: 'groupe-a-gls1',
    name: 'GROUPE A - GLSI',
    program: 'GLSI',
    description: 'Génie Logiciel & Systèmes d\'Informations',
    responsible: 'Prof. Martin Dupont',
    schedule: 'Lundi 08h-12h',
    studentCount: 25,
    color: 'indigo'
  },
  {
    id: 'groupe-b-tc1',
    name: 'GROUPE B - TC_1',
    program: 'TC_1',
    description: 'Tronc Commun Première Année',
    responsible: 'Prof. Sophie Bernard',
    schedule: 'Mardi 14h-18h',
    studentCount: 30,
    color: 'emerald'
  },
  {
    id: 'groupe-c-tc1',
    name: 'GROUPE C - TC_1',
    program: 'TC_1',
    description: 'Tronc Commun Première Année',
    responsible: 'Prof. Thomas Leroy',
    schedule: 'Mercredi 08h-12h',
    studentCount: 19,
    color: 'amber'
  },
  {
    id: 'elites-gls1',
    name: 'GROUPE DES ELITES DE GENIE LOGICIEL',
    program: 'GLSI',
    description: 'GLSI - Groupe Avancé',
    responsible: 'Prof. Julie Moreau',
    schedule: 'Jeudi 14h-18h',
    studentCount: 1,
    color: 'purple'
  },
  {
    id: 'groupe-z-asr',
    name: 'GROUPE Z - ASR',
    program: 'ASR',
    description: 'Administration Systèmes & Réseaux',
    responsible: 'À déterminer',
    schedule: 'Vendredi 08h-12h',
    studentCount: 0,
    color: 'gray'
  }
]);

// Données des étudiants
const initialStudents = [
  {
    id: 1,
    lastName: 'Dolores',
    firstName: 'ut nostrum a',
    code: '17000',
    program: 'GLSI',
    email: 'dolores.ut@example.com'
  },
  {
    id: 2,
    lastName: 'Accusantium',
    firstName: 'Id exce',
    code: '17001',
    program: 'TC_1',
    email: 'accusantium.id@example.com'
  },
  {
    id: 3,
    lastName: 'Martin',
    firstName: 'Sophie',
    code: '17002',
    program: 'GLSI',
    email: 'sophie.martin@example.com'
  },
  {
    id: 4,
    lastName: 'Dupont',
    firstName: 'Thomas',
    code: '17003',
    program: 'ASR',
    email: 'thomas.dupont@example.com'
  },
  {
    id: 5,
    lastName: 'Bernard',
    firstName: 'Pierre',
    code: '17004',
    program: 'TC_1',
    email: 'pierre.bernard@example.com'
  },
  {
    id: 6,
    lastName: 'Moreau',
    firstName: 'Julie',
    code: '17005',
    program: 'GLSI',
    email: 'julie.moreau@example.com'
  },
  {
    id: 7,
    lastName: 'Petit',
    firstName: 'Marie',
    code: '17006',
    program: 'MTWI',
    email: 'marie.petit@example.com'
  },
  {
    id: 8,
    lastName: 'Robert',
    firstName: 'David',
    code: '17007',
    program: 'TC_2',
    email: 'david.robert@example.com'
  },
  {
    id: 9,
    lastName: 'Blanc',
    firstName: 'Catherine',
    code: '17008',
    program: 'GLSI',
    email: 'catherine.blanc@example.com'
  },
  {
    id: 10,
    lastName: 'Laurent',
    firstName: 'Jean',
    code: '17009',
    program: 'ASR',
    email: 'jean.laurent@example.com'
  }
];

const students = ref([]);

// Données pour créer un nouveau groupe
const newGroup = ref({
  name: '',
  description: '',
  program: '',
  responsible: '',
  schedule: ''
});

// Charger les données
onMounted(() => {
  loadStudents();
});

const loadStudents = () => {
  if (process.client) {
    const stored = localStorage.getItem('groupStudents');
    if (stored) {
      students.value = JSON.parse(stored);
    } else {
      students.value = initialStudents;
      localStorage.setItem('groupStudents', JSON.stringify(initialStudents));
    }
  }
};

// Formater les initiales
const getInitials = (lastName, firstName) => {
  return (lastName[0] + firstName[0]).toUpperCase();
};

// Filtrer les étudiants
const filteredStudents = computed(() => {
  if (!searchQuery.value) return students.value;
  
  const query = searchQuery.value.toLowerCase();
  return students.value.filter(student =>
    student.lastName.toLowerCase().includes(query) ||
    student.firstName.toLowerCase().includes(query) ||
    student.code.toLowerCase().includes(query) ||
    student.email.toLowerCase().includes(query)
  );
});

// Pagination
const totalPages = computed(() => {
  return Math.ceil(filteredStudents.value.length / itemsPerPage.value);
});

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredStudents.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  
  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    let start = Math.max(1, currentPage.value - 2);
    let end = Math.min(totalPages.value, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }
  
  return pages;
});

const hasMorePages = computed(() => {
  return totalPages.value > 5 && currentPage.value < totalPages.value - 2;
});

// Navigation des pages
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPage = (page) => {
  currentPage.value = page;
};

// Gestion de la sélection
const allSelected = computed(() => {
  if (paginatedStudents.value.length === 0) return false;
  return paginatedStudents.value.every(student => 
    selectedStudents.value.includes(student.id)
  );
});

const isSelected = (studentId) => {
  return selectedStudents.value.includes(studentId);
};

const toggleStudentSelection = (studentId) => {
  const index = selectedStudents.value.indexOf(studentId);
  if (index === -1) {
    selectedStudents.value.push(studentId);
  } else {
    selectedStudents.value.splice(index, 1);
  }
};

const toggleSelectAll = () => {
  if (allSelected.value) {
    // Désélectionner tous les étudiants de la page courante
    paginatedStudents.value.forEach(student => {
      const index = selectedStudents.value.indexOf(student.id);
      if (index !== -1) {
        selectedStudents.value.splice(index, 1);
      }
    });
  } else {
    // Sélectionner tous les étudiants de la page courante
    paginatedStudents.value.forEach(student => {
      if (!selectedStudents.value.includes(student.id)) {
        selectedStudents.value.push(student.id);
      }
    });
  }
};

// Actions sur les groupes
const viewGroupDetails = (groupId) => {
  const group = groups.value.find(g => g.id === groupId);
  if (group) {
    // Rediriger vers la page de détails du groupe
    navigateTo(`/groupes/${groupId}/details`);
  }
};

const selectGroup = (groupId) => {
  selectedGroup.value = groups.value.find(g => g.id === groupId);
  // Réinitialiser la sélection des étudiants
  selectedStudents.value = [];
  // Réinitialiser la pagination
  currentPage.value = 1;
};

const deselectGroup = () => {
  selectedGroup.value = null;
  selectedStudents.value = [];
};

const createNewGroup = () => {
  newGroup.value = {
    name: '',
    description: '',
    program: '',
    responsible: '',
    schedule: ''
  };
  showCreateGroupModal.value = true;
};

const closeCreateGroupModal = () => {
  showCreateGroupModal.value = false;
};

const createGroup = () => {
  if (!newGroup.value.name.trim()) {
    alert('Le nom du groupe est obligatoire');
    return;
  }

  const newGroupId = `groupe-${groups.value.length + 1}`;
  const createdGroup = {
    id: newGroupId,
    name: newGroup.value.name,
    program: newGroup.value.program || '',
    description: newGroup.value.description || '',
    responsible: newGroup.value.responsible || 'À déterminer',
    schedule: newGroup.value.schedule || '',
    studentCount: 0,
    color: 'gray'
  };

  groups.value.push(createdGroup);
  showCreateGroupModal.value = false;
  alert(`Groupe "${newGroup.value.name}" créé avec succès !`);
};

// Actions sur les étudiants
const addSingleStudent = (student) => {
  if (!selectedStudents.value.includes(student.id)) {
    selectedStudents.value.push(student.id);
    alert(`${student.firstName} ${student.lastName} ajouté à la sélection`);
  }
};

const addSelectedStudents = () => {
  if (selectedStudents.value.length === 0) {
    alert('Veuillez sélectionner au moins un étudiant');
    return;
  }

  const selectedCount = selectedStudents.value.length;
  const groupName = selectedGroup.value.name;
  
  // Simuler l'ajout des étudiants au groupe
  alert(`${selectedCount} étudiant(s) ajouté(s) au groupe "${groupName}"`);
  
  // Réinitialiser la sélection
  selectedStudents.value = [];
  
  // Mettre à jour le compteur du groupe
  const groupIndex = groups.value.findIndex(g => g.id === selectedGroup.value.id);
  if (groupIndex !== -1) {
    groups.value[groupIndex].studentCount += selectedCount;
  }
};
</script>

<style scoped>
/* Styles pour le tableau */
table {
  min-width: 100%;
}

th {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td, th {
  padding: 1rem 1.5rem;
  text-align: left;
}

tbody tr {
  border-bottom: 1px solid #e5e7eb;
}

tbody tr:last-child {
  border-bottom: none;
}

/* Animation pour les transitions */
button {
  transition: all 0.2s ease;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}

/* Styles pour les cartes de groupe */
.group-card {
  transition: all 0.3s ease;
}

.group-card:hover {
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .table-container {
    overflow-x: auto;
  }
  
  .pagination-controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .group-card {
    margin-bottom: 1rem;
  }
}
</style>