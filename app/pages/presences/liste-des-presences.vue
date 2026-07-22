<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- En-tête fixe -->
    <div
      class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 shadow-sm"
    >
      <div class="flex items-center justify-between">
        <Breadcrumb
          :items="[
            { label: 'Mes cours', to: '/professeur/mes-cours' },
            { label: 'Présences', to: null },
          ]"
          title="Gestion des présences"
          title-class="text-xl font-semibold text-gray-800 dark:text-white"
          spacing="mb-4"
        />
      </div>
    </div>

    <div class="p-4 sm:p-6">
      <!-- Sélection du cours -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6 shadow-sm"
      >
        <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Sélectionner un cours
        </h2>

          <!-- Système de Onglets de filtrage -->
          <div class="flex flex-wrap items-center gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl w-fit">
            <button
              v-for="tab in [
                { id: 'all', label: 'Tous', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
                { id: 'current', label: 'En cours', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                { id: 'upcoming', label: 'À venir', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { id: 'past', label: 'Terminés', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
              ]"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200"
              :class="activeTab === tab.id 
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-gray-200 dark:ring-gray-600' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon" />
              </svg>
              {{ tab.label }}
              <span 
                class="ml-1 px-1.5 py-0.5 rounded-md text-[10px]"
                :class="activeTab === tab.id ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'bg-gray-200 dark:bg-gray-600 text-gray-500'"
              >
                {{ getTabCount(tab.id) }}
              </span>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Liste déroulante des cours -->
          <div>
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
              @change="onCoursChange"
            />
          </div>

          <!-- Bouton de chargement - MODIFIÉ pour permettre le chargement même si non modifiable -->
          <div class="flex items-end">
            <button
              @click="chargerEtudiants"
              :disabled="!selectedCoursId || etudiantStore.isLoading"
              class="w-full px-4 py-2.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2"
              :title="!isModifiable ? 'Mode consultation uniquement' : ''"
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
              {{ etudiantStore.isLoading ? "Chargement..." : "Charger les étudiants" }}
            </button>
          </div>
        </div>

        <!-- Résumé du cours sélectionné avec statut -->
        <div
          v-if="selectedCours"
          class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center gap-2 text-sm flex-wrap">
            <span class="text-gray-500 dark:text-gray-400"
              >Cours sélectionné :</span
            >
            <span class="font-medium text-indigo-600 dark:text-indigo-400">{{
              selectedCours.uv?.nom
            }}</span>
            <span class="text-gray-400">•</span>
            <span class="text-gray-600 dark:text-gray-300">{{
              selectedCours.group?.nom
            }}</span>
            <span class="text-gray-400">•</span>
            <span class="text-gray-600 dark:text-gray-300">{{
              formatDate(selectedCours.debut)
            }}</span>
            <span class="text-gray-400">•</span>
            <span class="text-gray-600 dark:text-gray-300">{{
              selectedCours.salle?.nom
            }}</span>
            <span class="text-gray-400">•</span>
            <span class="text-indigo-600 dark:text-indigo-400 font-medium">
              Prof: {{ selectedCours.owner?.nom }} {{ selectedCours.owner?.prenom }}
            </span>

            <!-- Badge de statut -->
            <span
              v-if="coursStatus"
              class="ml-2 px-2 py-1 rounded-full text-xs font-medium"
              :class="{
                'bg-green-100 text-green-800': coursStatus.modifiable,
                'bg-blue-100 text-blue-800':
                  !coursStatus.modifiable &&
                  coursStatus.type === 'deja_enregistre',
                'bg-yellow-100 text-yellow-800':
                  !coursStatus.modifiable &&
                  coursStatus.type !== 'deja_enregistre',
              }"
            >
              <span v-if="coursStatus.modifiable"> Modifiable</span>
              <span v-else-if="coursStatus.type === 'deja_enregistre'">
                Présences enregistrées (consultation)</span
              >
              <span v-else>
                {{
                  coursStatus.type === "pas_encore_commence"
                    ? "À venir"
                    : "Non modifiable"
                }}</span
              >
            </span>
          </div>

          <!-- Message détaillé -->
          <p
            v-if="coursStatus && !coursStatus.modifiable"
            class="mt-2 text-xs text-gray-500"
          >
            {{ coursStatus.message }}
          </p>

          <!-- Traçabilité : Qui a fait l'appel ? -->
          <div 
            v-if="selectedCours && (selectedCours.created_by_user || selectedCours.updated_by_user)"
            class="mt-3 p-3 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/50 flex items-center gap-3 text-xs"
          >
            <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="text-indigo-700 dark:text-indigo-300">
              <span v-if="selectedCours.updated_by_user">
                Dernière mise à jour par <span class="font-bold">{{ selectedCours.updated_by_user.nom }}</span> 
                le {{ formatDate(selectedCours.updated_at) }}
              </span>
              <span v-else-if="selectedCours.created_by_user">
                Enregistré par <span class="font-bold">{{ selectedCours.created_by_user.nom }}</span> 
                le {{ formatDate(selectedCours.created_at) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loader pendant le chargement des cours -->
      <div v-if="presenceStore.isLoading" class="flex justify-center py-10">
        <div
          class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"
        ></div>
      </div>

      <!-- Message si aucun cours trouvé -->
      <div
        v-else-if="mesCours.length === 0"
        class="text-center py-12 text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <svg
          class="w-16 h-16 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <p class="text-gray-500 dark:text-gray-400 text-lg">
          Aucun cours trouvé
        </p>
        <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Vous n'avez pas de cours planifiés
        </p>
      </div>

      <!-- Section des étudiants (si chargés) -->
       <div v-if="etudiantsCharges && etudiantsDuCours.length > 0">
        <!-- Stats rapides -->
        <div class="grid grid-cols-4 gap-3 mb-5">
          <div
            class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm hover:shadow transition-shadow"
          >
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">
              {{ totalEtudiants }}
            </p>
          </div>
          <div
            class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm hover:shadow transition-shadow"
          >
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Présents
            </p>
            <p class="text-xl font-bold text-green-600">{{ stats.presents }}</p>
          </div>
          <div
            class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm hover:shadow transition-shadow"
          >
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Absents</p>
            <p class="text-xl font-bold text-red-600">{{ stats.absents }}</p>
          </div>
          <div
            class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm hover:shadow transition-shadow"
          >
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Retards</p>
            <p class="text-xl font-bold text-yellow-600">{{ stats.retards }}</p>
          </div>
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
            <svg
              class="w-5 h-5 text-gray-400 absolute left-3 top-3"
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
        </div>

        <!-- Tableau des étudiants - MODIFIÉ pour désactiver les inputs en mode non modifiable -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
        >
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead
                class="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
              >
                <tr>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase"
                  >
                    N°
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase"
                  >
                    Matricule
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase"
                  >
                    Étudiant
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase"
                  >
                    Statut
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase"
                  >
                    Heure
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase"
                  >
                    Commentaire
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="(etudiant, index) in filteredRows"
                  :key="etudiant.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td class="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {{ index + 1 }}
                  </td>
                  <td
                    class="px-4 py-3 font-mono text-gray-900 dark:text-white text-xs"
                  >
                    {{ etudiant.matricule }}
                  </td>
                  <td class="px-4 py-3">
                    <div class="font-medium text-gray-900 dark:text-white">
                      {{ etudiant.prenom }} {{ etudiant.nom }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ etudiant.email }}
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <select
                      v-model="etudiant.statut"
                      @change="updateStatut(etudiant)"
                      class="px-2 py-1.5 text-xs border rounded-lg w-28 font-medium"
                      :class="getStatutClass(etudiant.statut)"
                      :disabled="!isModifiable"
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
                  <td class="px-4 py-3">
                    <input
                      v-if="['retard', 'retard_justifie', 'present'].includes(etudiant.statut)"
                      v-model="etudiant.heureArrivee"
                      type="time"
                      class="w-22 px-2 py-1.5 text-xs border rounded-lg"
                      @change="updateHeureArrivee(etudiant)"
                      :disabled="!isModifiable"
                    />
                    <span v-else class="text-gray-400">—</span>
                  </td>
                  <td class="px-4 py-3">
                    <input
                      v-model="etudiant.commentaire"
                      type="text"
                      :placeholder="getCommentairePlaceholder(etudiant.statut)"
                      class="w-40 px-2 py-1.5 text-xs border rounded-lg"
                      @change="updateCommentaire(etudiant)"
                      :title="getCommentaireTitle(etudiant.statut)"
                      :disabled="!isModifiable"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Actions -->
          <div
            class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            <div class="flex flex-wrap items-center gap-2">
              <!-- Bouton Tous présents - UNIQUEMENT si modifiable -->
              <button
                v-if="isModifiable"
                @click="marquerTousPresents"
                class="px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 font-medium transition-colors flex items-center gap-1"
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Tous présents
              </button>

              <!-- Bouton Appel par QR (Mode principal de présence) -->
              <Can action="enregistrer-presence-cours">
                <button
                  v-if="isModifiable"
                  @click="openQrModal"
                  class="px-6 py-2 text-sm bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 border border-purple-700"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  Démarrer l'appel (Générer QR)
                </button>
              </Can>

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

              <!-- Bouton Enregistrer - UNIQUEMENT si modifiable -->
              <Can action="enregistrer-presence-cours">
                <button
                  v-if="isModifiable"
                  @click="sauvegarderPresences"
                  :disabled="savingPresences || etudiantsDuCours.length === 0"
                  class="px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                  <svg
                    v-if="savingPresences"
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
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  {{
                    savingPresences
                      ? "Enregistrement..."
                      : "Enregistrer"
                  }}
                </button>
              </Can>

              <!-- Message de consultation - si non modifiable mais étudiants chargés -->
              <span
                v-if="!isModifiable && etudiantsDuCours.length > 0"
                class="text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Mode consultation
              </span>

              <!-- Bouton Exporter - TOUJOURS visible si des étudiants sont chargés -->
              <button
                @click="exporterPresences"
                :disabled="exportLoading || filteredRows.length === 0"
                class="px-4 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2 shadow-sm"
                title="Exporter les présences en Excel"
              >
                <svg
                  v-if="exportLoading"
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                {{ exportLoading ? "Export en cours..." : "Exporter Excel" }}
              </button>
            </div>

            <!-- Compteur -->
            <span
              class="text-xs text-gray-600 dark:text-gray-300 font-medium bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm"
            >
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
        <svg
          class="w-16 h-16 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <p class="text-gray-500 dark:text-gray-400 text-lg">
          Cliquez sur "Charger les étudiants"
        </p>
        <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Pour voir la liste des étudiants de ce cours
        </p>
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

    <!-- Modal d'exportation Headless UI -->
    <TransitionRoot appear :show="isExportModalOpen" as="template">
      <Dialog as="div" @close="isExportModalOpen = false" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" />
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
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all border border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-center mb-6">
                  <div class="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-full">
                    <svg class="w-12 h-12 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                <DialogTitle as="h3" class="text-2xl font-bold text-center leading-6 text-gray-900 dark:text-white mb-2">
                  Exporter les présences
                </DialogTitle>
                
                <p class="text-center text-gray-500 dark:text-gray-400 text-sm mb-8">
                  Choisissez le format et les filtres pour votre export
                </p>

                <div class="space-y-5">
                  <!-- Type d'export -->
                  <div>
                    <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Type d'export</label>
                    <div class="grid grid-cols-2 gap-3">
                      <button 
                        @click="exportOptions.type = 'simple'"
                        class="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all"
                        :class="exportOptions.type === 'simple' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200'"
                      >
                        <span class="font-bold text-sm">Simple</span>
                        <span class="text-[10px] opacity-70">Tout inclure</span>
                      </button>
                      <button 
                        @click="exportOptions.type = 'filtered'"
                        class="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all"
                        :class="exportOptions.type === 'filtered' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200'"
                      >
                        <span class="font-bold text-sm">Filtré</span>
                        <span class="text-[10px] opacity-70">Personnalisé</span>
                      </button>
                    </div>
                  </div>

                  <!-- Filtres additionnels (affichés si type === 'filtered') -->
                  <div v-if="exportOptions.type === 'filtered'" class="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div>
                      <label class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Statut</label>
                      <select v-model="exportOptions.statut" class="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500">
                        <option value="">Tous les statuts</option>
                        <option value="present">Présent</option>
                        <option value="absent">Absent</option>
                        <option value="retard">Retard</option>
                        <option value="justifie">Justifié</option>
                      </select>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Du</label>
                        <input type="date" v-model="exportOptions.date_debut" class="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Au</label>
                        <input type="date" v-model="exportOptions.date_fin" class="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500" />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-10 flex gap-3">
                  <button
                    type="button"
                    class="flex-1 inline-flex justify-center rounded-xl border border-transparent bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
                    @click="confirmerExportation"
                  >
                    Exporter
                  </button>
                  <button
                    type="button"
                    class="flex-1 inline-flex justify-center rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none transition-all"
                    @click="isExportModalOpen = false"
                  >
                    Annuler
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";
import Dropdown from "primevue/dropdown";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { usePresenceStore } from "~~/stores/presence";
import { useEtudiantStore } from "~~/stores/etudiant";
import { useLoginStore } from "~~/stores/login";
import { getApiBaseUrl } from "~/utils/storageUrl";

const { $toastr, $swal } = useNuxtApp();
const presenceStore = usePresenceStore();
const etudiantStore = useEtudiantStore();
const loginStore = useLoginStore();

// États
const searchQuery = ref("");
const selectedCoursId = ref(null);
const selectedCours = ref(null);
const savingPresences = ref(false);
const coursStatus = ref(null);
const exportLoading = ref(false);
const etudiantsCharges = ref(false);
const activeTab = ref("current"); // Par défaut sur les cours en cours

// États pour le modal d'export Headless UI
const isExportModalOpen = ref(false);
const exportOptions = ref({
  type: "simple",
  statut: "",
  date_debut: "",
  date_fin: "",
});

// États et logique pour le système de QR Code
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
  // On recharge la liste des étudiants pour voir qui a flashé
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

// Récupérer les cours du professeur
const mesCours = computed(() => presenceStore.mesCours || []);

// Options pour le dropdown des cours avec filtrage par onglet
const coursOptions = computed(() => {
  const now = new Date();
  let cours = [...mesCours.value];

  // Filtrage par onglet
  if (activeTab.value === "current") {
    cours = cours.filter((c) => {
      const debut = new Date(c.debut);
      const fin = new Date(c.fin);
      return now >= debut && now <= fin;
    });
  } else if (activeTab.value === "upcoming") {
    cours = cours.filter((c) => new Date(c.debut) > now);
  } else if (activeTab.value === "past") {
    cours = cours.filter((c) => new Date(c.fin) < now);
  }

  return cours.map((cours) => ({
    label: `${cours.uv?.nom || "Sans titre"} - ${cours.owner?.nom || ""} ${cours.owner?.prenom || ""} - ${cours.group?.niveau?.libelle || ""} ${cours.group?.nom || "Groupe"} (${formatDateShort(cours.debut)} - ${cours.salle?.nom || "Salle"})`,
    value: cours.id,
    details: cours,
  }));
});

// Compteur pour les onglets
const getTabCount = (tabId) => {
  const now = new Date();
  const cours = mesCours.value;
  
  if (tabId === 'all') return cours.length;
  if (tabId === 'current') return cours.filter(c => now >= new Date(c.debut) && now <= new Date(c.fin)).length;
  if (tabId === 'upcoming') return cours.filter(c => new Date(c.debut) > now).length;
  if (tabId === 'past') return cours.filter(c => new Date(c.fin) < now).length;
  return 0;
};

// Vérifier si le cours est modifiable
const isModifiable = computed(() => {
  return coursStatus.value?.modifiable || false;
});

// Quand on sélectionne un cours
const onCoursChange = async () => {
  if (selectedCoursId.value) {
    const result = await presenceStore.selectionnerCours(selectedCoursId.value);
    selectedCours.value = result.cours;
    coursStatus.value = result.status;
    etudiantStore.etudiants = [];
  } else {
    selectedCours.value = null;
    coursStatus.value = null;
    etudiantStore.etudiants = [];
  }
};

// Charger les étudiants du groupe lié au cours - MODIFIÉ pour charger même si non modifiable
// Charger les étudiants du groupe lié au cours
const chargerEtudiants = async () => {
  if (!selectedCours.value) {
    $toastr?.warning("Veuillez sélectionner un cours");
    return;
  }

  const groupeId =
    selectedCours.value.group?.slug || selectedCours.value.group_id;
  if (!groupeId) {
    $toastr?.error("Ce cours n'est pas associé à un groupe");
    return;
  }

  try {
    await etudiantStore.fetchGroupEtudiants(groupeId);

    // Récupérer les présences existantes depuis le cours sélectionné
    const presencesExistantes = selectedCours.value.presences || [];
    
    // Créer un map des présences par etudiant_id
    const mapPresences = {};
    presencesExistantes.forEach(presence => {
      mapPresences[presence.etudiant_id] = presence;
    });

    // Initialiser les étudiants avec les présences existantes
    const etudiantsAvecPresences = etudiantStore.etudiants.map((etudiant) => {
      const presenceExistante = mapPresences[etudiant.id];
      
      if (presenceExistante) {
        return {
          ...etudiant,
          statut: presenceExistante.statut || "absent",
          heureArrivee: presenceExistante.heure_arrivee ? presenceExistante.heure_arrivee.substring(0, 5) : "",
          commentaire: presenceExistante.commentaire || "",
          sanction: presenceExistante.sanction || null,
          presence_id: presenceExistante.id
        };
      } else {
        return {
          ...etudiant,
          statut: "absent",
          heureArrivee: "",
          commentaire: "",
          sanction: null,
        };
      }
    });

    // Mettre à jour le store avec les étudiants (avec leurs présences)
    etudiantStore.etudiants = etudiantsAvecPresences;
    etudiantsCharges.value = true;
    searchQuery.value = "";
    
    const nbPresences = presencesExistantes.length;
    
    if (nbPresences > 0) {
      $toastr?.info(
        `${etudiantsCharges.value} étudiants chargés avec ${nbPresences} présence(s) existante(s)`,
        { timeout: 3000 }
      );
    } else if (isModifiable.value) {
      $toastr?.success(
        `${etudiantStore.etudiants.length} étudiants chargés pour ${selectedCours.value.uv?.nom}`,
      );
    } else {
      $toastr?.info(
        `${etudiantStore.etudiants.length} étudiants chargés (mode consultation)`,
      );
    }
  } catch (error) {
    $toastr?.error("Erreur lors du chargement des étudiants");
    console.error(error);
  }
};
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
        e.email?.toLowerCase().includes(q),
    );
  }

  return filtered;
});

// Statistiques
const stats = computed(() => {
  const presents = etudiantsDuCours.value.filter(
    (e) => e.statut === "present",
  ).length;
  const absents = etudiantsDuCours.value.filter(
    (e) => e.statut === "absent",
  ).length;
  const retards = etudiantsDuCours.value.filter(
    (e) => e.statut === "retard",
  ).length;
  return { presents, absents, retards };
});

const totalEtudiants = computed(() => etudiantsDuCours.value.length);

// Utilitaires
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateShort = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
  });
};

// Placeholders dynamiques pour les commentaires selon le statut
const getCommentairePlaceholder = (statut) => {
  const placeholders = {
    present: "Comportement, participation...",
    retard: "Raison du retard...",
    absent: "Motif de l'absence...",
    absent_justifie: "Justification...",
    retard_justifie: "Justification du retard...",
  };
  return placeholders[statut] || "Commentaire...";
};

const getCommentaireTitle = (statut) => {
  const titles = {
    present: "Noter le comportement ou la participation",
    retard: "Noter la raison du retard",
    absent: "Noter le motif de l'absence",
    absent_justifie: "Noter la justification",
    retard_justifie: "Noter la justification du retard",
  };
  return titles[statut] || "Ajouter un commentaire";
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

// Actions sur les présences - UNIQUEMENT si modifiable
const marquerTousPresents = () => {
  if (!isModifiable.value) {
    $toastr?.warning(coursStatus.value?.message);
    return;
  }

  etudiantsDuCours.value.forEach((e) => {
    e.statut = "present";
    e.heureArrivee = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  });
  $toastr?.success("Tous les étudiants ont été marqués présents");
};

const resetPresences = () => {
  if (!isModifiable.value) {
    $toastr?.warning(coursStatus.value?.message);
    return;
  }

  etudiantsDuCours.value.forEach((e) => {
    e.statut = "absent";
    e.heureArrivee = "";
    e.commentaire = "";
    e.sanction = null;
  });
  $toastr?.info("Présences réinitialisées");
};

const updateStatut = (etudiant) => {
  if (!isModifiable.value) {
    $toastr?.warning(coursStatus.value?.message);
    return;
  }

  if (
    (etudiant.statut === "present" || etudiant.statut === "retard") &&
    !etudiant.heureArrivee
  ) {
    etudiant.heureArrivee = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  $toastr?.info(`Statut mis à jour pour ${etudiant.prenom} ${etudiant.nom}`);
};

const updateHeureArrivee = (etudiant) => {
  if (!isModifiable.value) {
    $toastr?.warning(coursStatus.value?.message);
    return;
  }
  $toastr?.success(`Heure enregistrée pour ${etudiant.prenom} ${etudiant.nom}`);
};

const updateCommentaire = (etudiant) => {
  if (!isModifiable.value) {
    $toastr?.warning(coursStatus.value?.message);
    return;
  }
  if (etudiant.commentaire) {
    $toastr?.info(
      `Commentaire enregistré pour ${etudiant.prenom} ${etudiant.nom}`,
    );
  }
};

// Sauvegarder les présences - UNIQUEMENT si modifiable
const sauvegarderPresences = async () => {
  if (!selectedCours.value) {
    $toastr?.warning("Aucun cours sélectionné");
    return;
  }

  if (etudiantsDuCours.value.length === 0) {
    $toastr?.warning("Aucun étudiant à enregistrer");
    return;
  }

  // Vérification via le store
  const verification = await presenceStore.verifierAvantEnregistrement(
    selectedCours.value.id,
  );

  if (!verification.peutEnregistrer) {
    if (verification.type === "deja_enregistre") {
      const confirm = await $swal?.fire({
        title: "Présences déjà existantes",
        text: `${verification.nombrePresences} présence(s) existante(s). Voulez-vous les écraser ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, écraser",
        cancelButtonText: "Non, annuler",
        confirmButtonColor: "#dc2626",
      });

      if (!confirm?.isConfirmed) return;
    } else {
      $toastr?.warning(verification.message);
      return;
    }
  }

  const confirm = await $swal?.fire({
    title: "Enregistrer les présences ?",
    text:
      verification.type === "deja_enregistre"
        ? "Cette action va écraser les présences existantes"
        : "Cette action va sauvegarder tous les statuts et commentaires",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Oui, enregistrer",
    cancelButtonText: "Annuler",
  });

  if (!confirm?.isConfirmed) return;

  savingPresences.value = true;

  try {
    const payload = {
      emploi_du_temps_id: selectedCours.value.id,
      presences: etudiantsDuCours.value.map((e) => {
        const presence = {
          etudiant_id: e.id,
          statut: e.statut || "absent",
          commentaire: e.commentaire || null,
          sanction: e.sanction || null,
        };

        if (e.statut === "present" || e.statut === "retard") {
          presence.heure_arrivee =
            e.heureArrivee ||
            new Date().toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            });
        }

        return presence;
      }),
    };

    await presenceStore.savePresence(payload);

    // Recharger les cours pour mettre à jour les présences
    await presenceStore.fetchMesCours();

    // Mettre à jour le statut du cours
    if (selectedCoursId.value) {
      const result = await presenceStore.selectionnerCours(
        selectedCoursId.value,
      );
      coursStatus.value = result.status;
    }

    $toastr?.success(
      `${payload.presences.length} présences enregistrées avec succès`,
    );
  } catch (error) {
    console.error("Erreur sauvegarde:", error);
    $toastr?.error(
      error.message || "Erreur lors de l'enregistrement des présences",
    );
  } finally {
    savingPresences.value = false;
  }
};

// Exporter les présences - TOUJOURS disponible
const exporterPresences = () => {
  if (!selectedCours.value) {
    $toastr?.warning("Veuillez sélectionner un cours");
    return;
  }

  if (etudiantsDuCours.value.length === 0) {
    $toastr?.warning("Aucune présence à exporter");
    return;
  }

  // Initialiser les options par défaut
  exportOptions.value = {
    type: "simple",
    statut: "",
    date_debut: "",
    date_fin: "",
  };

  // Ouvrir le modal Headless UI
  isExportModalOpen.value = true;
};

// Confirmer l'exportation depuis le modal
const confirmerExportation = async () => {
  const filters = {};
  
  if (exportOptions.value.type === "filtered") {
    if (exportOptions.value.statut) filters.statut = exportOptions.value.statut;
    if (exportOptions.value.date_debut) filters.date_debut = exportOptions.value.date_debut;
    if (exportOptions.value.date_fin) filters.date_fin = exportOptions.value.date_fin;
  }

  isExportModalOpen.value = false;
  await downloadPresences(filters);
};

// Fonction de téléchargement
const downloadPresences = async (filters = {}) => {
  exportLoading.value = true;

  try {
    const response = await presenceStore.exportPresencesCours(
      selectedCours.value.id,
      filters,
    );

    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    // Récupérer le nom du fichier depuis l'en-tête Content-Disposition
    const contentDisposition = response.headers["content-disposition"];
    let filename = "presences.xlsx";

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }

    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    $toastr?.success("Export terminé avec succès");
  } catch (error) {
    console.error("Erreur export:", error);
    $toastr?.error(error.message || "Erreur lors de l'export");
  } finally {
    exportLoading.value = false;
  }
};

// Watch pour réinitialiser la recherche quand on change de cours
watch(selectedCoursId, () => {
  searchQuery.value = "";
});

// Watch pour réinitialiser la sélection quand on change d'onglet
watch(activeTab, () => {
  selectedCoursId.value = null;
  selectedCours.value = null;
  coursStatus.value = null;
  etudiantStore.etudiants = [];
  etudiantsCharges.value = false;
});

// Chargement initial
onMounted(async () => {
  etudiantStore.etudiants = [];
  await presenceStore.fetchMesCours();
});
</script>

