<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Administration', to: '/' },
        { label: 'Communications', to: '/communiques/liste' },
        { label: 'Nouveau communiqué', to: null },
      ]"
      title="Nouveau communiqué"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Formulaire -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700"
    >
      <form @submit.prevent="submitCommunique">
        <!-- Section 1: Informations générales -->
        <div class="mb-8">
          <h3
            class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2"
          >
            <svg
              class="w-5 h-5 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Informations générales
          </h3>

          <div class="grid grid-cols-1 gap-6">
            <!-- Titre -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Titre du communiqué <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.titre"
                type="text"
                required
                class="w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                placeholder="Ex: Réunion pédagogique, Soutenance de projet..."
              />
            </div>

            <!-- Contenu -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Contenu <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.contenu"
                rows="5"
                required
                class="w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                placeholder="Détails du communiqué..."
              ></textarea>
            </div>

            <!-- Dates -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Date de publication <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.date_publication"
                  type="datetime-local"
                  required
                  class="w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Date d'expiration
                </label>
                <input
                  v-model="form.date_expiration"
                  type="datetime-local"
                  class="w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>
            </div>

            <!-- Pièce jointe -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Pièce jointe (PDF, DOC, JPG, PNG - max 5MB)
              </label>
              <div class="flex items-center gap-3">
                <label
                  class="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  Choisir un fichier
                  <input
                    type="file"
                    ref="fileInput"
                    @change="handleFileUpload"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    class="hidden"
                  />
                </label>
                <span
                  v-if="form.piece_jointe_nom"
                  class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"
                >
                  <svg
                    class="w-4 h-4 text-green-500"
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
                  {{ form.piece_jointe_nom }}
                  <button
                    type="button"
                    @click="removeFile"
                    class="text-red-500 hover:text-red-700"
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
                </span>
              </div>
            </div>

            <!-- Niveau d'importance -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Niveau d'importance
              </label>
              <div class="flex flex-wrap gap-3">
                <label
                  v-for="level in importanceLevels"
                  :key="level.value"
                  class="flex items-center gap-2"
                >
                  <input
                    type="radio"
                    v-model="form.level"
                    :value="level.value"
                    class="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span
                    class="px-3 py-1 rounded-full text-xs font-medium"
                    :class="level.class"
                  >
                    {{ level.label }}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Choix des destinataires -->
        <div class="mb-8">
          <h3
            class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2"
          >
            <svg
              class="w-5 h-5 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Destinataires
          </h3>

          <!-- Type de cible principal -->
          <div class="mb-6">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
            >
              Cibler <span class="text-red-500">*</span>
            </label>
            <div class="flex flex-wrap gap-3">
              <button
                type="button"
                v-for="type in targetTypes"
                :key="type.value"
                @click="selectTargetType(type.value)"
                class="px-4 py-2.5 rounded-lg border transition-all duration-200 flex items-center gap-2"
                :class="[
                  targetType === type.value
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
                ]"
              >
                <span v-html="type.icon"></span>
                {{ type.label }}
              </button>
            </div>
          </div>

          <!-- Panneau de sélection selon le type -->
          <div
            class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <!-- Chargement -->
            <div v-if="isLoadingOptions" class="flex justify-center py-8">
              <div
                class="h-8 w-8 animate-spin rounded-full border-3 border-indigo-200 border-t-indigo-600"
              ></div>
            </div>

            <!-- Sélection par ÉTUDIANTS -->
            <div v-else-if="targetType === 'etudiants'">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rechercher des étudiants
                </label>
                <div class="relative">
                  <input
                    v-model="searchEtudiantQuery"
                    type="text"
                    placeholder="Nom, prénom, matricule..."
                    class="w-full pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                </div>
              </div>

              <!-- Liste des étudiants -->
              <div class="max-h-60 overflow-y-auto border rounded-lg bg-white dark:bg-gray-800">
                <div
                  v-for="etudiant in filteredEtudiants"
                  :key="etudiant.id"
                  class="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 border-b last:border-b-0"
                >
                  <input
                    type="checkbox"
                    :value="etudiant.id"
                    v-model="selectedEtudiants"
                    class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ etudiant.nom }} {{ etudiant.prenom }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ etudiant.matricule }} - 
                      {{ etudiant.filiere }} {{ etudiant.niveau }}
                      <span v-if="etudiant.groupe">({{ etudiant.groupe }})</span>
                    </p>
                  </div>
                </div>
                <div v-if="filteredEtudiants.length === 0" class="p-4 text-center text-gray-500">
                  Aucun étudiant trouvé
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-2">
                {{ selectedEtudiants.length }} étudiant(s) sélectionné(s)
              </p>
            </div>

            <!-- Sélection par GROUPES -->
            <div v-else-if="targetType === 'groupes'">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="groupe in groupeStore.groupes" :key="groupe.id" class="border rounded-lg p-3">
                  <label class="flex items-start gap-3">
                    <input
                      type="checkbox"
                      :value="groupe.id"
                      v-model="selectedGroupes"
                      class="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">{{ groupe.nom }}</p>
                      <p class="text-xs text-gray-500">
                        {{ groupe.filieres?.join(', ') }} - {{ groupe.niveau }}
                      </p>
                      <p class="text-xs text-gray-400 mt-1">
                        {{ groupe.total_etudiants || 0 }} étudiants
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Sélection par NIVEAUX -->
            <div v-else-if="targetType === 'niveaux'">
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div
                  v-for="niveau in niveauStore.niveaux"
                  :key="niveau.id"
                  class="border rounded-lg p-3"
                >
                  <label class="flex items-center gap-3">
                    <input
                      type="checkbox"
                      :value="niveau.id"
                      v-model="selectedNiveaux"
                      class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span class="font-medium text-gray-900 dark:text-white">
                      {{ niveau.libelle }}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Sélection par FILIÈRES -->
            <div v-else-if="targetType === 'filieres'">
              <div class="space-y-3">
                <div
                  v-for="filiere in filiereStore.filieres"
                  :key="filiere.id"
                  class="border rounded-lg p-3"
                >
                  <div class="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      :value="filiere.id"
                      v-model="selectedFilieres"
                      class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span class="font-medium text-gray-900 dark:text-white">
                      {{ filiere.nom }}
                    </span>
                    <span class="text-xs text-gray-500">
                      ({{ filiere.total_etudiants || 0 }} étudiants)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sélection par UTILISATEURS (enseignants, surveillants, etc) -->
            <div v-else-if="targetType === 'users'">
              <!-- Filtres par rôle -->
              <div class="flex gap-2 mb-4">
                <button
                  type="button"
                  v-for="role in userRoles"
                  :key="role.value"
                  @click="selectedUserRole = role.value"
                  class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  :class="[
                    selectedUserRole === role.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600',
                  ]"
                >
                  {{ role.label }}
                </button>
              </div>

              <!-- Recherche -->
              <div class="mb-4">
                <input
                  v-model="searchUserQuery"
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                />
              </div>

              <!-- Liste des utilisateurs -->
              <div class="max-h-60 overflow-y-auto border rounded-lg bg-white dark:bg-gray-800">
                <div
                  v-for="user in filteredUsers"
                  :key="user.id"
                  class="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 border-b"
                >
                  <input
                    type="checkbox"
                    :value="user.id"
                    v-model="selectedUsers"
                    class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ user.name }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ user.email }} - {{ user.role }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- TOUS les étudiants d'une année -->
            <div v-else-if="targetType === 'tous'">
              <div class="p-4 text-center">
                <svg
                  class="w-12 h-12 text-gray-400 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p class="text-gray-700 dark:text-gray-300 mb-3">
                  Envoyer à tous les étudiants de l'année scolaire
                </p>
                <select
                  v-model="selectedAnneeScolaire"
                  class="w-full max-w-xs mx-auto px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                >
                  <option value="">Sélectionner une année</option>
                  <option value="1">2024-2025</option>
                  <option value="2">2023-2024</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Résumé de la sélection -->
        <div
          v-if="hasSelection"
          class="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800"
        >
          <h4 class="text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-2 flex items-center gap-2">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Récapitulatif des destinataires
          </h4>
          <div class="text-sm text-indigo-700 dark:text-indigo-400">
            <p v-if="selectedEtudiants.length">
              • {{ selectedEtudiants.length }} étudiant(s) spécifique(s)
            </p>
            <p v-if="selectedGroupes.length">
              • {{ selectedGroupes.length }} groupe(s) ({{ getTotalEtudiantsByGroupes }} étudiants)
            </p>
            <p v-if="selectedNiveaux.length">
              • {{ selectedNiveaux.length }} niveau(x)
            </p>
            <p v-if="selectedFilieres.length">
              • {{ selectedFilieres.length }} filière(s)
            </p>
            <p v-if="selectedUsers.length">
              • {{ selectedUsers.length }} utilisateur(s) (enseignants/surveillants)
            </p>
            <p v-if="selectedAnneeScolaire">
              • Tous les étudiants de l'année {{ selectedAnneeScolaire }}
            </p>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="cancel"
            class="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="!canSubmit || communiqueStore.isLoading"
            class="px-6 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <svg
              v-if="communiqueStore.isLoading"
              class="w-4 h-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{{ communiqueStore.isLoading ? 'Envoi en cours...' : 'Envoyer le communiqué' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useFiliereStore } from "~~/stores/filiere";
import { useGroupeStore } from "~~/stores/group";
import { useNiveauStore } from "~~/stores/niveau";
import { useEtudiantStore } from "~~/stores/etudiant";
import { useUserStore } from "~~/stores/user";
import { useCommuniqueStore } from "~~/stores/communique";

// Stores
const filiereStore = useFiliereStore();
const groupeStore = useGroupeStore();
const niveauStore = useNiveauStore();
const etudiantStore = useEtudiantStore();
const userStore = useUserStore();
const communiqueStore = useCommuniqueStore();

const { $toastr, $swal } = useNuxtApp();
const router = useRouter();

// État du formulaire
const form = ref({
  titre: "",
  contenu: "",
  date_publication: new Date().toISOString().slice(0, 16),
  date_expiration: "",
  level: "info",
  piece_jointe: null,
  piece_jointe_nom: "",
});

// Type de cible sélectionné
const targetType = ref("etudiants");

// Sélections
const selectedEtudiants = ref([]);
const selectedGroupes = ref([]);
const selectedNiveaux = ref([]);
const selectedFilieres = ref([]);
const selectedUsers = ref([]);
const selectedAnneeScolaire = ref("");

// Recherche
const searchEtudiantQuery = ref("");
const searchUserQuery = ref("");
const selectedUserRole = ref("enseignant");

// Options
const targetTypes = [
  {
    value: "etudiants",
    label: "Étudiants spécifiques",
    icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>',
  },
  {
    value: "groupes",
    label: "Groupes",
    icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>',
  },
  {
    value: "niveaux",
    label: "Niveaux",
    icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>',
  },
  {
    value: "filieres",
    label: "Filières",
    icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>',
  },
  {
    value: "users",
    label: "Enseignants & Personnel",
    icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>',
  },
  {
    value: "tous",
    label: "Tous les étudiants",
    icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>',
  },
];

const importanceLevels = [
  { value: "info", label: "Information", class: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  { value: "warning", label: "Important", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
  { value: "danger", label: "Urgent", class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  { value: "success", label: "Succès", class: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
];

const userRoles = [
  { value: "enseignant", label: "Enseignants" },
  { value: "surveillant", label: "Surveillants" },
  { value: "admin", label: "Administrateurs" },
  { value: "tous", label: "Tous" },
];

// Computed
const isLoadingOptions = computed(() => {
  return (
    filiereStore.isLoading ||
    groupeStore.isLoading ||
    niveauStore.isLoading ||
    etudiantStore.isLoading ||
    userStore.isLoading
  );
});

const filteredEtudiants = computed(() => {
  if (!searchEtudiantQuery.value) return etudiantStore.etudiants;
  
  const query = searchEtudiantQuery.value.toLowerCase();
  return etudiantStore.etudiants.filter(
    (e) =>
      e.nom?.toLowerCase().includes(query) ||
      e.prenom?.toLowerCase().includes(query) ||
      e.matricule?.toLowerCase().includes(query)
  );
});

const filteredUsers = computed(() => {
  let users = [];
  
  if (selectedUserRole.value === "enseignant") {
    users = userStore.enseignants;
  } else if (selectedUserRole.value === "surveillant") {
    users = userStore.surveillants;
  } else {
    users = userStore.users;
  }
  
  if (!searchUserQuery.value) return users;
  
  const query = searchUserQuery.value.toLowerCase();
  return users.filter(
    (u) =>
      u.name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query)
  );
});

const getTotalEtudiantsByGroupes = computed(() => {
  // À implémenter selon votre logique
  return selectedGroupes.value.length * 30; // Exemple
});

const hasSelection = computed(() => {
  return (
    selectedEtudiants.value.length > 0 ||
    selectedGroupes.value.length > 0 ||
    selectedNiveaux.value.length > 0 ||
    selectedFilieres.value.length > 0 ||
    selectedUsers.value.length > 0 ||
    selectedAnneeScolaire.value
  );
});

const canSubmit = computed(() => {
  return (
    form.value.titre &&
    form.value.contenu &&
    form.value.date_publication &&
    hasSelection.value
  );
});

// Méthodes
const selectTargetType = (type) => {
  targetType.value = type;
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      $toastr.error("Le fichier ne doit pas dépasser 5MB");
      return;
    }
    form.value.piece_jointe = file;
    form.value.piece_jointe_nom = file.name;
  }
};

const removeFile = () => {
  form.value.piece_jointe = null;
  form.value.piece_jointe_nom = "";
  document.querySelector('input[type="file"]').value = "";
};

const cancel = () => {
  router.push("/communiques/liste");
};

const submitCommunique = async () => {
  try {
    // Construction du payload
    const formData = new FormData();
    
    // Infos générales
    formData.append("titre", form.value.titre);
    formData.append("contenu", form.value.contenu);
    formData.append("date_publication", form.value.date_publication);
    if (form.value.date_expiration) {
      formData.append("date_expiration", form.value.date_expiration);
    }
    formData.append("level", form.value.level);
    
    // Type de cible
    formData.append("cible_type", targetType.value);
    
    // Ajout des IDs selon le type
    if (targetType.value === "etudiants") {
      selectedEtudiants.value.forEach(id => formData.append("cible_ids[]", id));
    } else if (targetType.value === "groupes") {
      selectedGroupes.value.forEach(id => formData.append("cible_ids[]", id));
    } else if (targetType.value === "niveaux") {
      selectedNiveaux.value.forEach(id => formData.append("cible_ids[]", id));
    } else if (targetType.value === "filieres") {
      selectedFilieres.value.forEach(id => formData.append("cible_ids[]", id));
    } else if (targetType.value === "users") {
      selectedUsers.value.forEach(id => formData.append("cible_ids[]", id));
    } else if (targetType.value === "tous" && selectedAnneeScolaire.value) {
      formData.append("annee_scolaire_id", selectedAnneeScolaire.value);
    }
    
    // Pièce jointe
    if (form.value.piece_jointe) {
      formData.append("piece_jointe", form.value.piece_jointe);
    }
    
    // Envoi
    const result = await communiqueStore.sendCommunique(formData);
    
    if (result.success) {
      await $swal.fire({
        icon: "success",
        title: "Succès !",
        text: `Communiqué envoyé à ${result.data.statistiques.total} personne(s)`,
        timer: 2000,
        showConfirmButton: false,
      });
      router.push("/communiques/liste");
    }
  } catch (error) {
    console.error("Erreur envoi communiqué:", error);
    $toastr.error(error.response?.data?.message || "Erreur lors de l'envoi");
  }
};

// Chargement initial
onMounted(async () => {
  try {
    await Promise.all([
      filiereStore.fetchFilieres(),
      groupeStore.fetchGroupes(),
      niveauStore.fetchNiveaux(),
      etudiantStore.fetchEtudiants(),
      userStore.fetchUsersEnseignant(),
      userStore.fetchUsersSurveillant(),
      userStore.fetchUsers(),
    ]);
  } catch (error) {
    console.error("Erreur chargement données:", error);
    $toastr.error("Erreur lors du chargement des données");
  }
});

// Reset des sélections quand on change de type
watch(targetType, () => {
  selectedEtudiants.value = [];
  selectedGroupes.value = [];
  selectedNiveaux.value = [];
  selectedFilieres.value = [];
  selectedUsers.value = [];
  selectedAnneeScolaire.value = "";
});
</script>