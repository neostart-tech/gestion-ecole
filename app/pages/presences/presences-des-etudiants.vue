<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- En-tête fixe -->
    <div
      class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 shadow-sm"
    >
      <div class="flex items-center justify-between">
        <Breadcrumb
          :items="[
            { label: 'Tableau de bord', to: '/surveillant' },
            { label: 'Présences', to: null },
          ]"
          title="Gestion des présences étudiants"
          title-class="text-xl font-semibold text-gray-800 dark:text-white"
          spacing="mb-4"
        />
        
        <!-- Boutons d'action rapide -->
        <div class="flex items-center gap-2">
          <button 
            @click="voirHistorique"
            class="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            title="Voir l'historique des présences"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button 
            @click="voirAlertes"
            class="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 relative"
            title="Voir les alertes"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span v-if="alertesNonLues > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {{ alertesNonLues }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <div class="p-4 sm:p-6">
      <!-- Sélection du cours et de la date -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6 shadow-sm"
      >
        <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Sélectionner un cours et une date
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Dropdown des cours -->
          <div class="md:col-span-2">
            <label
              class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
              >Cours</label
            >
            <Dropdown
              v-model="selectedCoursId"
              :options="coursOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Choisir un cours"
              class="w-full"
              :showClear="true"
              :filter="true"
              filterPlaceholder="Rechercher un cours..."
              @change="onCoursChange"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex items-center gap-2">
                  <span class="font-medium">{{ getCoursLabel(slotProps.value) }}</span>
                </div>
                <span v-else>{{ slotProps.placeholder }}</span>
              </template>
              <template #option="slotProps">
                <div class="flex flex-col py-1">
                  <div class="flex items-center justify-between">
                    <span class="font-medium">{{ slotProps.option.uv }}</span>
                    <span
                      class="px-2 py-0.5 rounded-full text-xs font-medium"
                      :class="getOptionBadgeClass(slotProps.option)"
                    >
                      {{ slotProps.option.statut }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{{ slotProps.option.groupe }}</span>
                    <span>•</span>
                    <span>{{ slotProps.option.date }}</span>
                    <span>•</span>
                    <span>{{ slotProps.option.salle }}</span>
                  </div>
                  <div class="flex items-center justify-between mt-1">
                    <span class="text-xs text-gray-500">{{ slotProps.option.professeur }}</span>
                    <div class="flex items-center gap-2">
                      <span
                        v-if="slotProps.option.aPresences"
                        class="text-xs text-blue-600 flex items-center gap-1"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ slotProps.option.nbPresences }}
                      </span>
                    </div>
                  </div>
                </div>
              </template>
            </Dropdown>
          </div>

          <!-- Sélecteur de date -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Date de la séance
            </label>
            <input
              type="date"
              v-model="selectedDate"
              class="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              :min="minDate"
              :max="maxDate"
            />
            <!-- Indicateur de séance existante -->
            <div v-if="seanceInfo" class="mt-1 text-xs" :class="seanceInfo.color">
              {{ seanceInfo.message }}
            </div>
          </div>

          <!-- Bouton de chargement -->
          <div class="flex items-end">
            <button
              @click="chargerEtudiants"
              :disabled="!selectedCoursId || !selectedDate || etudiantStore.isLoading"
              class="w-full px-4 py-2.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg
                v-if="etudiantStore.isLoading"
                class="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <svg
                v-else
                class="w-4 h-4"
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
              {{ etudiantStore.isLoading ? "Chargement..." : "Charger" }}
            </button>
          </div>
        </div>

        <!-- Résumé du cours sélectionné -->
        <div
          v-if="selectedCours"
          class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center gap-2 text-sm flex-wrap">
            <span class="text-gray-500 dark:text-gray-400">Cours sélectionné :</span>
            <span class="font-medium text-indigo-600 dark:text-indigo-400">{{ selectedCours.uv?.nom }}</span>
            <span class="text-gray-400">•</span>
            <span class="text-gray-600 dark:text-gray-300">{{ selectedCours.group?.nom }}</span>
            <span class="text-gray-400">•</span>
            <span class="text-gray-600 dark:text-gray-300">{{ formatDate(selectedCours.debut) }}</span>
            <span class="text-gray-400">•</span>
            <span class="text-gray-600 dark:text-gray-300">{{ selectedCours.salle?.nom }}</span>

            <!-- Badge présence étudiants -->
            <span
              v-if="aDesPresencesExistantes"
              class="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
            >
              <span class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ seanceInfo?.seance?.nb_presences || 0 }} présence(s)
              </span>
            </span>

            <!-- Badge jour de récurrence -->
            <span
              v-if="selectedCours?.recurrence_type === 'hebdomadaire'"
              class="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
            >
              <span class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatJoursRecurrence(selectedCours.recurrence_days) }}
              </span>
            </span>
          </div>

          <!-- Message si ce n'est pas le bon jour -->
          <p
            v-if="!estJourValide && selectedCours?.recurrence_type === 'hebdomadaire'"
            class="mt-2 text-xs text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 p-2 rounded-lg flex items-center gap-1"
          >
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <span class="font-medium">Attention :</span> Ce cours a lieu les {{ formatJoursRecurrence(selectedCours.recurrence_days) }} uniquement.
              Le {{ formatDateSeance(selectedDate) }} n'est pas un jour de cours.
            </span>
          </p>
        </div>

        <!-- Mini calendrier des séances -->
        <div v-if="selectedCours && seances.length > 0" class="mt-4">
          <p class="text-xs text-gray-500 mb-2">Séances de ce cours :</p>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="seance in seances"
              :key="seance.id"
              @click="selectedDate = seance.date_seance; chargerEtudiants()"
              class="px-3 py-1.5 text-xs rounded-full cursor-pointer transition-colors flex items-center gap-1"
              :class="[
                seance.date_seance === selectedDate 
                  ? 'bg-indigo-600 text-white' 
                  : seance.presences_count > 0
                    ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              ]"
            >
              <span>{{ formatDateSeance(seance.date_seance) }}</span>
              <span v-if="seance.presences_count > 0" class="text-xs font-bold">
                ({{ seance.presences_count }})
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loader -->
      <div v-if="presenceStore.isLoading" class="flex justify-center py-10">
        <div class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
      </div>

      <!-- Message si aucun cours -->
      <div
        v-else-if="tousLesCours.length === 0"
        class="text-center py-12 text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <p class="text-gray-500 dark:text-gray-400 text-lg">Aucun cours trouvé</p>
        <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">Aucun cours n'est disponible pour le moment</p>
      </div>

      <!-- Section des étudiants -->
      <div v-if="etudiantsCharges && etudiantsDuCours.length > 0">
        <!-- Stats enrichies -->
        <div class="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-5">
          <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ totalEtudiants }}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Présents</p>
            <p class="text-xl font-bold text-green-600">{{ stats.presents }}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Absents</p>
            <p class="text-xl font-bold text-red-600">{{ stats.absents }}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Retards</p>
            <p class="text-xl font-bold text-yellow-600">{{ stats.retards }}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Justifiés</p>
            <p class="text-xl font-bold text-blue-600">{{ stats.justifies }}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Signalements</p>
            <p class="text-xl font-bold text-orange-600">{{ stats.signalements }}</p>
          </div>
        </div>

        <!-- Bannière d'information -->
        <div 
          v-if="!estModifiable"
          class="mb-4 p-3 rounded-lg flex items-center gap-2"
          :class="{
            'bg-orange-50 border border-orange-200': !estJourValide,
            'bg-blue-50 border border-blue-200': aDesPresencesExistantes && estJourValide
          }"
        >
          <svg 
            v-if="!estJourValide"
            class="w-5 h-5 text-orange-500 flex-shrink-0" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg 
            v-else-if="aDesPresencesExistantes"
            class="w-5 h-5 text-blue-500 flex-shrink-0" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span class="text-sm" :class="{
            'text-orange-700': !estJourValide,
            'text-blue-700': aDesPresencesExistantes && estJourValide
          }">
            <span class="font-semibold">
              {{ !estJourValide ? 'Date non valide' : 'Consultation des présences existantes' }}
            </span>
            — 
            {{ !estJourValide 
              ? `Cette date ne correspond pas aux jours de cours.` 
              : 'Les présences ont déjà été enregistrées et ne peuvent plus être modifiées.'
            }}
          </span>
        </div>

        <!-- Barre de recherche -->
        <div class="mb-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher un étudiant par nom, prénom ou matricule..."
              class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Tableau des étudiants ENRICHIS -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">N°</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Matricule</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Étudiant</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Statut</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Heure</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Participation</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Attitude</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Points</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="(etudiant, index) in filteredRows"
                  :key="etudiant.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700"
                  :class="{ 'bg-orange-50 dark:bg-orange-900/10': etudiant.a_signalement }"
                >
                  <td class="px-4 py-3 text-gray-500 dark:text-gray-400">{{ index + 1 }}</td>
                  <td class="px-4 py-3 font-mono text-gray-900 dark:text-white text-xs">{{ etudiant.matricule }}</td>
                  
                  <!-- Étudiant avec badges SVG -->
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <div class="font-medium text-gray-900 dark:text-white">
                        {{ etudiant.prenom }} {{ etudiant.nom }}
                      </div>
                      <div v-if="etudiant.a_signalement" class="text-orange-600" title="Signalé">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div v-if="etudiant.a_remonter_conseil" class="text-purple-600" title="À remonter au conseil">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ etudiant.email }}</div>
                  </td>
                  
                  <!-- Statut enrichi -->
                  <td class="px-4 py-3">
                    <select
                      v-model="etudiant.statut"
                      @change="updateStatut(etudiant)"
                      class="px-2 py-1.5 text-xs border rounded-lg w-28 font-medium"
                      :class="getStatutClass(etudiant.statut)"
                      :disabled="!estModifiable"
                    >
                      <option value="present">Présent</option>
                      <option value="absent">Absent</option>
                      <option value="absent_justifie">Absent justifié</option>
                      <option value="retard">Retard</option>
                      <option value="retard_justifie">Retard justifié</option>
                      <option value="dispense">Dispensé</option>
                      <option value="exclu_temporairement">Exclu</option>
                      <option value="malade">Malade</option>
                      <option value="sortie_anticipee">Sortie anticipée</option>
                    </select>
                  </td>
                  
                  <!-- Heure -->
                  <td class="px-4 py-3">
                    <input
                      :disabled="!estModifiable"
                      v-if="['retard', 'retard_justifie', 'present'].includes(etudiant.statut)"
                      v-model="etudiant.heureArrivee"
                      type="time"
                      class="w-22 px-2 py-1.5 text-xs border rounded-lg"
                      @change="updateHeureArrivee(etudiant)"
                    />
                    <span v-else class="text-gray-400">—</span>
                  </td>
                  
                  <!-- Participation -->
                  <td class="px-4 py-3">
                    <select
                      v-model="etudiant.participation"
                      @change="updateComportement(etudiant)"
                      class="px-2 py-1.5 text-xs border rounded-lg w-24"
                      :disabled="!estModifiable"
                    >
                      <option value="">—</option>
                      <option value="excellente">Excellente</option>
                      <option value="bonne">Bonne</option>
                      <option value="moyenne">Moyenne</option>
                      <option value="faible">Faible</option>
                      <option value="nulle">Nulle</option>
                    </select>
                  </td>
                  
                  <!-- Attitude -->
                  <td class="px-4 py-3">
                    <select
                      v-model="etudiant.attitude"
                      @change="updateComportement(etudiant)"
                      class="px-2 py-1.5 text-xs border rounded-lg w-24"
                      :disabled="!estModifiable"
                    >
                      <option value="">—</option>
                      <option value="exemplaire">Exemplaire</option>
                      <option value="correcte">Correcte</option>
                      <option value="a_surveiller">À surveiller</option>
                      <option value="problematique">Problématique</option>
                      <option value="perturbateur">Perturbateur</option>
                    </select>
                  </td>
                  
                  <!-- Points d'attention SVG -->
                  <td class="px-4 py-3">
                    <div class="flex gap-1">
                      <button
                        @click="togglePointAttention(etudiant, 'telephone')"
                        class="p-1 rounded hover:bg-gray-200"
                        :class="etudiant.points_attention?.includes('telephone') ? 'text-red-600' : 'text-gray-400'"
                        :disabled="!estModifiable"
                        title="Téléphone"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button
                        @click="togglePointAttention(etudiant, 'bavardage')"
                        class="p-1 rounded hover:bg-gray-200"
                        :class="etudiant.points_attention?.includes('bavardage') ? 'text-red-600' : 'text-gray-400'"
                        :disabled="!estModifiable"
                        title="Bavardage"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </button>
                      <button
                        @click="togglePointAttention(etudiant, 'tenue')"
                        class="p-1 rounded hover:bg-gray-200"
                        :class="etudiant.points_attention?.includes('tenue') ? 'text-red-600' : 'text-gray-400'"
                        :disabled="!estModifiable"
                        title="Tenue"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  
                  <!-- Actions SVG -->
                  <td class="px-4 py-3">
                    <div class="flex gap-1">
                      <button
                        @click="toggleSignalement(etudiant)"
                        class="p-1 rounded hover:bg-gray-200"
                        :class="etudiant.a_signalement ? 'text-orange-600' : 'text-gray-400'"
                        :disabled="!estModifiable"
                        :title="etudiant.a_signalement ? 'Retirer signalement' : 'Signaler'"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </button>
                      <button
                        @click="toggleRemonterConseil(etudiant)"
                        class="p-1 rounded hover:bg-gray-200"
                        :class="etudiant.a_remonter_conseil ? 'text-purple-600' : 'text-gray-400'"
                        :disabled="!estModifiable"
                        :title="etudiant.a_remonter_conseil ? 'Ne pas remonter' : 'Remonter au conseil'"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                      <button
                        @click="uploadJustificatif(etudiant)"
                        class="p-1 rounded hover:bg-gray-200"
                        :class="etudiant.justificatif ? 'text-green-600' : 'text-gray-400'"
                        :disabled="!estModifiable || !['absent', 'retard', 'absent_justifie', 'retard_justifie'].includes(etudiant.statut)"
                        :title="etudiant.justificatif ? 'Justificatif fourni' : 'Ajouter justificatif'"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </button>
                      <button
                        @click="voirDetailsEtudiant(etudiant)"
                        class="p-1 rounded hover:bg-gray-200 text-gray-400"
                        title="Voir historique"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Actions principales -->
          <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-2">
              <!-- Boutons d'action -->
              <button
                v-if="estModifiable"
                @click="marquerTousPresents"
                class="px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 font-medium transition-colors flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Tous présents
              </button>

              <button
                v-if="estModifiable"
                @click="resetPresences"
                class="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 font-medium transition-colors flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Réinitialiser
              </button>

              <button
                v-if="estModifiable"
                @click="openQrModal"
                class="px-6 py-2 text-sm bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 border border-purple-700"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                Démarrer l'appel (Générer QR)
              </button>

              <button
                v-if="estModifiable"
                @click="sauvegarderPresences"
                :disabled="savingPresences || etudiantsDuCours.length === 0"
                class="px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                <svg v-if="savingPresences" class="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                {{ savingPresences ? "Enregistrement..." : "Enregistrer" }}
              </button>

              <button
                @click="chargerEtudiants"
                v-if="etudiantsDuCours.length > 0"
                class="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-colors flex items-center gap-2 shadow-sm"
                title="Actualiser la liste"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualiser
              </button>

              <!-- Messages d'état -->
              <span
                v-if="!estModifiable && aDesPresencesExistantes"
                class="text-xs text-amber-600 bg-amber-100 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Consultation seule
              </span>

              <span
                v-if="!estModifiable && !aDesPresencesExistantes && !estJourValide"
                class="text-xs text-orange-600 bg-orange-100 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Date non valide
              </span>

              <!-- Boutons d'export -->
              <button
                @click="exporterPresences"
                :disabled="presenceStore.exportLoading || filteredRows.length === 0"
                class="px-4 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                <svg v-if="presenceStore.exportLoading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exporter
              </button>

              <!-- Synthèse conseil -->
              <button
                @click="genererSyntheseConseil"
                class="px-4 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Synthèse conseil
              </button>
            </div>

            <!-- Compteur -->
            <span class="text-xs text-gray-600 dark:text-gray-300 font-medium bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm">
              {{ filteredRows.length }} étudiant(s)
            </span>
          </div>
        </div>
      </div>

      <!-- Message si aucun étudiant chargé -->
      <div
        v-else-if="selectedCours && !etudiantsCharges && !etudiantStore.isLoading"
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center shadow-sm"
      >
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="text-gray-500 dark:text-gray-400 text-lg">Cliquez sur "Charger"</p>
        <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">Pour voir les étudiants de cette séance</p>
      </div>
    </div>

    <!-- Modal QR Code -->
    <TransitionRoot appear :show="isQrModalOpen" as="template">
      <Dialog as="div" @close="closeQrModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/75 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 text-left align-middle shadow-xl transition-all border border-gray-100 dark:border-gray-700">
                <DialogTitle as="h3" class="text-3xl font-bold text-center leading-6 text-gray-900 dark:text-white mb-2">
                  Appel par QR Code
                </DialogTitle>
                <p class="text-center text-gray-500 mb-8">Demandez aux étudiants de scanner ce code depuis leur espace. <br> Le code change toutes les 10 secondes pour éviter la triche.</p>

                <div class="flex flex-col items-center justify-center space-y-6">
                  <div class="bg-white p-4 rounded-xl shadow-inner border border-gray-100 flex items-center justify-center min-h-[300px] min-w-[300px]">
                    <img v-if="qrToken" :src="'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + qrToken" alt="QR Code" class="w-64 h-64" />
                    <div v-else class="flex flex-col items-center justify-center text-purple-600">
                      <div class="animate-spin mb-4 h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                      <span>Génération en cours...</span>
                    </div>
                  </div>
                  
                  <div class="text-sm font-medium text-purple-600 bg-purple-50 px-4 py-2 rounded-full flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                    Actualisation dans {{ qrRefreshTimer }} secondes
                  </div>
                </div>

                <div class="mt-10 flex justify-center">
                  <button
                    type="button"
                    class="rounded-xl border border-transparent bg-gray-100 px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-200 focus:outline-none transition-all"
                    @click="closeQrModal"
                  >
                    Fermer et recharger la liste
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal pour justificatif -->
    <Dialog v-model:visible="showJustificatifModal" header="Ajouter un justificatif" :modal="true" class="p-4">
      <div v-if="selectedEtudiant" class="space-y-4">
        <p class="text-sm">Étudiant : <span class="font-semibold">{{ selectedEtudiant.prenom }} {{ selectedEtudiant.nom }}</span></p>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Type de justificatif</label>
          <select v-model="justificatifType" class="w-full border rounded-lg p-2">
            <option value="certificat_medical">Certificat médical</option>
            <option value="mot_parental">Mot parental</option>
            <option value="convocation">Convocation</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fichier</label>
          <input type="file" @change="handleFileUpload" class="w-full border rounded-lg p-2" accept=".pdf,.jpg,.jpeg,.png">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea v-model="justificatifDescription" rows="3" class="w-full border rounded-lg p-2" placeholder="Description du justificatif..."></textarea>
        </div>
        
        <div class="flex justify-end gap-2 mt-4">
          <button @click="showJustificatifModal = false" class="px-4 py-2 bg-gray-200 rounded-lg">Annuler</button>
          <button @click="saveJustificatif" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">Uploader</button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Dropdown from "primevue/dropdown";
import Dialog from "primevue/dialog";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { usePresenceStore } from "~~/stores/presence";
import { useEtudiantStore } from "~~/stores/etudiant";
import { getApiBaseUrl } from "~/utils/storageUrl";
import axios from "axios";

const { $toastr, $swal } = useNuxtApp();
const presenceStore = usePresenceStore();
const etudiantStore = useEtudiantStore();

// États
const searchQuery = ref("");
const selectedCoursId = ref(null);
const selectedCours = ref(null);
const selectedDate = ref(new Date().toISOString().split('T')[0]);
const savingPresences = ref(false);
const etudiantsCharges = ref(false);
const showJustificatifModal = ref(false);
const selectedEtudiant = ref(null);
const justificatifType = ref("certificat_medical");
const justificatifDescription = ref("");
const justificatifFile = ref(null);
const alertesNonLues = ref(0);
const seances = ref([]);
const minDate = ref('');
const maxDate = ref('');
const seanceInfo = ref(null);

// Import components for Headless UI Modal
import {
  TransitionRoot,
  TransitionChild,
  Dialog as HeadlessDialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";

// QR Modal State
const isQrModalOpen = ref(false);
const qrToken = ref(null);
const qrRefreshTimer = ref(10);
let qrInterval = null;
let qrCountdown = null;

const openQrModal = async () => {
  if (!selectedCoursId.value) return;
  isQrModalOpen.value = true;
  await refreshQrCode();
  
  qrInterval = setInterval(refreshQrCode, 10000);
  
  qrCountdown = setInterval(() => {
    qrRefreshTimer.value--;
    if (qrRefreshTimer.value <= 0) qrRefreshTimer.value = 10;
  }, 1000);
};

const closeQrModal = () => {
  isQrModalOpen.value = false;
  qrToken.value = null;
  if (qrInterval) clearInterval(qrInterval);
  if (qrCountdown) clearInterval(qrCountdown);
  chargerEtudiants();
};

const refreshQrCode = async () => {
  if (!selectedCoursId.value) return;
  try {
    const token = localStorage.getItem("gest-ecole-token");
    const response = await $fetch(`${getApiBaseUrl()}/presence/cours/${selectedCoursId.value}/generate-qr`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (response && response.qr_token) {
      qrToken.value = response.qr_token;
      qrRefreshTimer.value = 10;
    }
  } catch (error) {
    console.error('Erreur génération QR:', error);
  }
};

// Getters computed
const tousLesCours = computed(() => presenceStore.mesCours || []);

// Jour actuel
const jourActuel = computed(() => {
  const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return jours[new Date().getDay()];
});

// Vérifier si la date est valide pour ce cours
const estJourValide = computed(() => {
  if (!selectedCours.value || !selectedDate.value) return false;
  
  if (selectedCours.value.recurrence_type !== 'hebdomadaire' || !selectedCours.value.recurrence_days) {
    return true;
  }
  
  const joursMap = {
    'MO': 1, 'TU': 2, 'WE': 3, 'TH': 4, 'FR': 5, 'SA': 6, 'SU': 0
  };
  
  const dateObj = new Date(selectedDate.value + 'T12:00:00');
  const jourSemaine = dateObj.getDay();
  
  const joursPrevu = selectedCours.value.recurrence_days.split(',');
  const joursNumeriques = joursPrevu.map(j => joursMap[j]);
  
  return joursNumeriques.includes(jourSemaine);
});

// Séance modifiable ?
const estModifiable = computed(() => {
  return seanceInfo.value?.modifiable ?? true;
});

// Présences existantes ?
const aDesPresencesExistantes = computed(() => {
  return seanceInfo.value?.hasPresences ?? false;
});

// Options dropdown
const coursOptions = computed(() => {
  return tousLesCours.value.map((cours) => {
    const statut = getCoursStatut(cours);
    const aPresences = cours.presences?.length > 0;
    
    return {
      label: `${cours.uv?.nom || "Sans titre"} - ${cours.group?.niveau?.libelle} ${cours.group?.nom || "Groupe"} (${formatDateShort(cours.debut)})`,
      value: cours.id,
      uv: cours.uv?.nom || "Sans titre",
      groupe: cours.group?.nom || "Groupe",
      date: formatDateShort(cours.debut),
      heure: formatHeure(cours.debut),
      salle: cours.salle?.nom || "Salle",
      professeur: formatProfesseur(cours.owner),
      statut: statut,
      aPresences: aPresences,
      nbPresences: cours.presences?.length || 0,
      recurrence_type: cours.recurrence_type,
      recurrence_days: cours.recurrence_days,
      details: cours,
    };
  });
});

// Étudiants du cours
const etudiantsDuCours = computed(() => etudiantStore.etudiants || []);

// Filtrage
const filteredRows = computed(() => {
  let filtered = [...etudiantsDuCours.value];

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(
      (e) =>
        e.nom?.toLowerCase().includes(q) ||
        e.prenom?.toLowerCase().includes(q) ||
        e.matricule?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q)
    );
  }

  return filtered;
});

// Statistiques enrichies
const stats = computed(() => {
  const presents = etudiantsDuCours.value.filter((e) => e.statut === "present").length;
  const absents = etudiantsDuCours.value.filter((e) => e.statut === "absent" || e.statut === "absent_justifie").length;
  const retards = etudiantsDuCours.value.filter((e) => e.statut === "retard" || e.statut === "retard_justifie").length;
  const justifies = etudiantsDuCours.value.filter((e) => e.statut?.includes('justifie')).length;
  const signalements = etudiantsDuCours.value.filter((e) => e.a_signalement).length;
  
  return { presents, absents, retards, justifies, signalements };
});

const totalEtudiants = computed(() => etudiantsDuCours.value.length);

// Méthodes utilitaires
const getCoursLabel = (id) => {
  const option = coursOptions.value.find(opt => opt.value === id);
  return option ? `${option.uv} - ${option.groupe} (${option.date})` : "";
};

const getOptionBadgeClass = (option) => {
  const classes = {
    "À venir": "bg-yellow-100 text-yellow-800",
    "En cours": "bg-green-100 text-green-800",
    "Terminé": "bg-gray-100 text-gray-800",
  };
  return classes[option.statut] || "bg-gray-100 text-gray-800";
};

const getStatutClass = (statut) => {
  const classes = {
    'present': 'bg-green-50 text-green-700 border-green-300',
    'absent': 'bg-red-50 text-red-700 border-red-300',
    'absent_justifie': 'bg-blue-50 text-blue-700 border-blue-300',
    'retard': 'bg-yellow-50 text-yellow-700 border-yellow-300',
    'retard_justifie': 'bg-orange-50 text-orange-700 border-orange-300',
    'dispense': 'bg-purple-50 text-purple-700 border-purple-300',
    'exclu_temporairement': 'bg-gray-50 text-gray-700 border-gray-300',
    'malade': 'bg-pink-50 text-pink-700 border-pink-300',
    'sortie_anticipee': 'bg-indigo-50 text-indigo-700 border-indigo-300',
  };
  return classes[statut] || 'bg-gray-50 text-gray-700 border-gray-300';
};

const getCoursStatut = (cours) => {
  const now = new Date();
  const debut = new Date(cours.debut);
  const fin = new Date(cours.fin);

  if (debut > now) return "À venir";
  if (debut <= now && fin >= now) return "En cours";
  return "Terminé";
};

const formatProfesseur = (owner) => {
  if (!owner) return "Non assigné";
  return `${owner.prenom || ""} ${owner.nom || ""}`.trim() || "Non assigné";
};

const formatDateShort = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatHeure = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateSeance = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString + 'T12:00:00');
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
  });
};

const formatJoursRecurrence = (daysString) => {
  if (!daysString) return "";
  const joursMap = {
    MO: "Lundi", TU: "Mardi", WE: "Mercredi",
    TH: "Jeudi", FR: "Vendredi", SA: "Samedi", SU: "Dimanche"
  };
  
  const jours = daysString.split(',');
  return jours.map(j => joursMap[j] || j).join(', ');
};

// Charger les séances d'un cours
const chargerSeances = async () => {
  if (!selectedCours.value) return;
  
  try {
    const response = await axios.get(
      `/presence/cours/${selectedCours.value.id}/seances`,
      presenceStore.authHeaders()
    );
    seances.value = response.data.seances || [];
    
    // Définir les dates min/max
    if (selectedCours.value.recurrence_type === 'hebdomadaire') {
      const dateDebut = new Date(selectedCours.value.debut);
      minDate.value = dateDebut.toISOString().split('T')[0];
      
      if (selectedCours.value.recurrence_end_date) {
        maxDate.value = selectedCours.value.recurrence_end_date;
      } else {
        const dateFin = new Date();
        dateFin.setMonth(dateFin.getMonth() + 3);
        maxDate.value = dateFin.toISOString().split('T')[0];
      }
    } else {
      minDate.value = new Date(selectedCours.value.debut).toISOString().split('T')[0];
      maxDate.value = minDate.value;
      selectedDate.value = minDate.value;
    }
  } catch (error) {
    console.error("Erreur chargement séances:", error);
  }
};

// Gestion des événements
const onCoursChange = async () => {
  if (selectedCoursId.value) {
    selectedCours.value = tousLesCours.value.find(c => c.id === selectedCoursId.value);
    etudiantStore.etudiants = [];
    etudiantsCharges.value = false;
    seanceInfo.value = null;
    await chargerSeances();
  } else {
    selectedCours.value = null;
    etudiantStore.etudiants = [];
    etudiantsCharges.value = false;
    seances.value = [];
    seanceInfo.value = null;
  }
};

const chargerEtudiants = async () => {
  if (!selectedCours.value) {
    $toastr?.warning("Veuillez sélectionner un cours");
    return;
  }

  const groupeId = selectedCours.value.group?.slug || selectedCours.value.group_id;
  if (!groupeId) {
    $toastr?.error("Ce cours n'est pas associé à un groupe");
    return;
  }

  try {
    etudiantStore.isLoading = true;
    
    // 1. Charger les étudiants du groupe
    await etudiantStore.fetchGroupEtudiants(groupeId);

    // 2. Récupérer les présences pour cette date via l'API
    const response = await axios.get(
      `/presence/cours/${selectedCours.value.id}/etudiants?date=${selectedDate.value}`,
      presenceStore.authHeaders()
    );

    // 3. Sauvegarder les informations de séance
    seanceInfo.value = {
      existe: response.data.seance_existe,
      modifiable: response.data.est_modifiable,
      hasPresences: response.data.seance?.nb_presences > 0,
      message: response.data.seance_existe 
        ? `Séance existante (${response.data.seance?.nb_presences || 0} présences)`
        : 'Nouvelle séance (sera créée à l\'enregistrement)',
      color: response.data.seance_existe ? 'text-green-600' : 'text-amber-600',
      seance: response.data.seance
    };

    // 4. Mettre à jour les étudiants avec leurs présences
    if (response.data.etudiants) {
      etudiantStore.etudiants = response.data.etudiants;
    }

    etudiantsCharges.value = true;
    searchQuery.value = "";

    // 5. Message de feedback
    if (!response.data.est_modifiable) {
      $toastr?.info("Mode consultation : des présences existent déjà pour cette date");
    } else if (response.data.seance_existe) {
      $toastr?.info("Séance existante chargée");
    } else {
      $toastr?.success(`${etudiantStore.etudiants.length} étudiants chargés`);
    }

  } catch (error) {
    console.error("Erreur chargement:", error);
    $toastr?.error(error.response?.data?.message || "Erreur lors du chargement");
  } finally {
    etudiantStore.isLoading = false;
  }
};

// Actions sur les présences
const marquerTousPresents = () => {
  if (!estModifiable.value) {
    $toastr?.warning("Cette séance n'est pas modifiable");
    return;
  }

  const now = new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  etudiantsDuCours.value.forEach((e) => {
    e.statut = "present";
    e.heureArrivee = now;
    e.participation = "bonne";
    e.attitude = "correcte";
  });
  $toastr?.success("Tous les étudiants ont été marqués présents");
};

const resetPresences = () => {
  if (!estModifiable.value) {
    $toastr?.warning("Cette séance n'est pas modifiable");
    return;
  }

  etudiantsDuCours.value.forEach((e) => {
    e.statut = "absent";
    e.heureArrivee = "";
    e.participation = "";
    e.attitude = "";
    e.observations = "";
    e.points_attention = [];
    e.a_signalement = false;
    e.a_remonter_conseil = false;
  });
  $toastr?.info("Présences réinitialisées");
};

const updateStatut = (etudiant) => {
  if (!estModifiable.value) {
    $toastr?.warning("Cette séance n'est pas modifiable");
    return;
  }

  if (etudiant.statut === "present" && !etudiant.heureArrivee) {
    etudiant.heureArrivee = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
};

const updateHeureArrivee = (etudiant) => {
  if (!estModifiable.value) {
    $toastr?.warning("Cette séance n'est pas modifiable");
    return;
  }
};

const updateComportement = (etudiant) => {
  if (!estModifiable.value) {
    $toastr?.warning("Cette séance n'est pas modifiable");
    return;
  }
};

const togglePointAttention = (etudiant, point) => {
  if (!estModifiable.value) return;
  
  if (!etudiant.points_attention) {
    etudiant.points_attention = [];
  }
  
  const index = etudiant.points_attention.indexOf(point);
  if (index === -1) {
    etudiant.points_attention.push(point);
  } else {
    etudiant.points_attention.splice(index, 1);
  }
  
  updateComportement(etudiant);
};

const toggleSignalement = (etudiant) => {
  if (!estModifiable.value) return;
  etudiant.a_signalement = !etudiant.a_signalement;
  updateComportement(etudiant);
  
  if (etudiant.a_signalement) {
    $toastr?.info(`${etudiant.prenom} ${etudiant.nom} a été signalé`);
  }
};

const toggleRemonterConseil = (etudiant) => {
  if (!estModifiable.value) return;
  etudiant.a_remonter_conseil = !etudiant.a_remonter_conseil;
  updateComportement(etudiant);
};

const uploadJustificatif = (etudiant) => {
  selectedEtudiant.value = etudiant;
  showJustificatifModal.value = true;
};

const handleFileUpload = (event) => {
  justificatifFile.value = event.target.files[0];
};

const saveJustificatif = async () => {
  if (!justificatifFile.value) {
    $toastr?.warning("Veuillez sélectionner un fichier");
    return;
  }

  try {
    const formData = new FormData();
    formData.append('fichier', justificatifFile.value);
    formData.append('type', justificatifType.value);
    formData.append('description', justificatifDescription.value);
    
    await presenceStore.uploadJustificatif(selectedEtudiant.value.presence_id, formData);
    
    $toastr?.success("Justificatif ajouté avec succès");
    showJustificatifModal.value = false;
    selectedEtudiant.value.justificatif = true;
    
    justificatifType.value = "certificat_medical";
    justificatifDescription.value = "";
    justificatifFile.value = null;
  } catch (error) {
    $toastr?.error("Erreur lors de l'upload");
  }
};

const voirDetailsEtudiant = (etudiant) => {
  navigateTo(`/surveillant/etudiants/${etudiant.id}/historique`);
};

const sauvegarderPresences = async () => {
  if (!selectedCours.value) {
    $toastr?.warning("Aucun cours sélectionné");
    return;
  }

  if (!estModifiable.value) {
    $toastr?.warning("Cette séance n'est pas modifiable");
    return;
  }

  savingPresences.value = true;

  try {
    const payload = {
      emploi_du_temps_id: selectedCours.value.id,
      date: selectedDate.value,
      presences: etudiantsDuCours.value.map((e) => ({
        etudiant_id: e.id,
        statut: e.statut || "absent",
        heure_arrivee: (e.statut === "present" || e.statut === "retard" || e.statut === "retard_justifie") 
          ? (e.heureArrivee || new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }))
          : null,
        commentaire: e.observations || null,
        participation: e.participation || null,
        attitude: e.attitude || null,
        points_attention: e.points_attention || [],
        points_positifs: e.points_positifs || [],
        a_signalement: e.a_signalement || false,
        a_remonter_conseil: e.a_remonter_conseil || false,
      })),
    };

    await presenceStore.savePresence(payload);
    
    await presenceStore.fetchCours();
    await chargerSeances();
    await chargerEtudiants();

    $toastr?.success(`${payload.presences.length} présences enregistrées`);
  } catch (error) {
    console.error("Erreur sauvegarde:", error);
    $toastr?.error(error.response?.data?.message || "Erreur lors de l'enregistrement");
  } finally {
    savingPresences.value = false;
  }
};

const exporterPresences = async () => {
  if (!selectedCours.value) {
    $toastr?.warning("Veuillez sélectionner un cours");
    return;
  }

  try {
    const response = await presenceStore.exportPresencesCours(selectedCours.value.id, {
      date: selectedDate.value
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `presences_${selectedCours.value.uv?.nom || "cours"}_${selectedDate.value}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    $toastr?.success("Export terminé");
  } catch (error) {
    $toastr?.error("Erreur lors de l'export");
  }
};

const voirHistorique = () => {
  navigateTo('/surveillant/presences/historique');
};

const voirAlertes = () => {
  navigateTo('/surveillant/alertes');
};

const genererSyntheseConseil = () => {
  navigateTo('/surveillant/conseil/synthese');
};

// Watchers
watch(selectedCoursId, () => {
  searchQuery.value = "";
});

watch(selectedDate, () => {
  if (selectedCours.value && etudiantsCharges.value) {
    chargerEtudiants();
  }
});

// Initialisation
onMounted(async () => {
  etudiantStore.etudiants = [];
  await presenceStore.fetchCours();
  
  try {
    const response = await presenceStore.fetchAlertes();
    alertesNonLues.value = response.filter(a => !a.lue).length;
  } catch (error) {
    console.error("Erreur chargement alertes:", error);
  }
});
</script>