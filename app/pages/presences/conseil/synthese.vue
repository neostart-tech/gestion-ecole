<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- En-tête fixe -->
    <div class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 shadow-sm">
      <div class="flex items-center justify-between">
        <Breadcrumb
          :items="[
            { label: 'Tableau de bord', to: '/surveillant' },
            { label: 'Conseil de classe', to: '/surveillant/conseil' },
            { label: 'Synthèse', to: null }
          ]"
          title="Synthèse pour le conseil de classe"
          title-class="text-xl font-semibold text-gray-800 dark:text-white"
        />
        
        <!-- Boutons d'export -->
        <div class="flex items-center gap-2">
          <button 
            @click="exporterPDF" 
            :disabled="exportLoading || !donneesChargees"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            <svg v-if="exportLoading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF
          </button>
          
          <button 
            @click="exporterExcel" 
            :disabled="exportLoading || !donneesChargees"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Excel
          </button>
          
          <button 
            @click="imprimer" 
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimer
          </button>
        </div>
      </div>
    </div>

    <div class="p-4 sm:p-6">
      <!-- Filtres -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6 shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div class="md:col-span-2">
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Classe / Groupe</label>
            <Dropdown
              v-model="filters.classeId"
              :options="classesOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Sélectionner une classe"
              class="w-full"
              :filter="true"
              @change="chargerSynthese"
            />
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Période</label>
            <select 
              v-model="filters.periode" 
              @change="onPeriodeChange"
              class="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="trimestre1">1er Trimestre</option>
              <option value="trimestre2">2ème Trimestre</option>
              <option value="trimestre3">3ème Trimestre</option>
              <option value="semestre1">1er Semestre</option>
              <option value="semestre2">2ème Semestre</option>
              <option value="annee">Année complète</option>
              <option value="personnalise">Personnalisé</option>
            </select>
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Date début</label>
            <input 
              type="date" 
              v-model="filters.dateDebut" 
              @change="chargerSynthese"
              :disabled="filters.periode !== 'personnalise'"
              class="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Date fin</label>
            <input 
              type="date" 
              v-model="filters.dateFin" 
              @change="chargerSynthese"
              :disabled="filters.periode !== 'personnalise'"
              class="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>
        </div>
        
        <!-- Indicateur de chargement -->
        <div v-if="loading" class="mt-4 flex justify-center">
          <div class="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
          <span class="ml-2 text-sm text-gray-500">Chargement de la synthèse...</span>
        </div>
      </div>

      <!-- Zone à exporter en PDF -->
      <div 
        v-if="donneesChargees && !loading" 
        id="synthese-content" 
        ref="syntheseContent"
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6"
      >
        <!-- En-tête du document -->
        <div class="text-center mb-8 border-b pb-4 print:border-b-2">
          <h1 class="text-2xl font-bold text-indigo-800 dark:text-indigo-400">SYNTHÈSE CONSEIL DE CLASSE</h1>
          <h2 class="text-xl font-semibold mt-2 text-gray-800 dark:text-gray-200">{{ infos.classe }}</h2>
          <p class="text-gray-500 dark:text-gray-400 mt-1">Période : {{ infos.periode }} - Généré le {{ infos.dateGeneration }}</p>
        </div>

        <!-- Statistiques globales -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
            <p class="text-xs text-gray-600 dark:text-gray-400">Effectif</p>
            <p class="text-2xl font-bold text-blue-700 dark:text-blue-300">{{ statsGlobales.effectif }}</p>
          </div>
          <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
            <p class="text-xs text-gray-600 dark:text-gray-400">Taux présence</p>
            <p class="text-2xl font-bold text-green-700 dark:text-green-300">{{ statsGlobales.tauxPresence }}%</p>
          </div>
          <div class="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
            <p class="text-xs text-gray-600 dark:text-gray-400">Absences</p>
            <p class="text-2xl font-bold text-red-700 dark:text-red-300">{{ statsGlobales.absences }}</p>
          </div>
          <div class="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-center">
            <p class="text-xs text-gray-600 dark:text-gray-400">Retards</p>
            <p class="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{{ statsGlobales.retards }}</p>
          </div>
          <div class="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg text-center">
            <p class="text-xs text-gray-600 dark:text-gray-400">Signalements</p>
            <p class="text-2xl font-bold text-orange-700 dark:text-orange-300">{{ statsGlobales.signalements }}</p>
          </div>
          <div class="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
            <p class="text-xs text-gray-600 dark:text-gray-400">À surveiller</p>
            <p class="text-2xl font-bold text-purple-700 dark:text-purple-300">{{ statsGlobales.aSurveiller }}</p>
          </div>
        </div>

        <!-- Tableau des élèves -->
        <div class="mb-8 overflow-x-auto">
          <h3 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Liste des élèves
          </h3>
          
          <table class="w-full text-sm">
            <thead class="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">N°</th>
                <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Matricule</th>
                <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Élève</th>
                <th class="px-3 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">Prés.</th>
                <th class="px-3 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">Abs.</th>
                <th class="px-3 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">Ret.</th>
                <th class="px-3 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">Just.</th>
                <th class="px-3 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">Taux</th>
                <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Comportement</th>
                <th class="px-3 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">Sign.</th>
                <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Observations</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr 
                v-for="(eleve, index) in eleves" 
                :key="eleve.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700"
                :class="{
                  'bg-green-50 dark:bg-green-900/10': eleve.tauxPresence >= 90,
                  'bg-yellow-50 dark:bg-yellow-900/10': eleve.tauxPresence < 75 && eleve.tauxPresence >= 50,
                  'bg-red-50 dark:bg-red-900/10': eleve.tauxPresence < 50
                }"
              >
                <td class="px-3 py-2 text-gray-600 dark:text-gray-400">{{ index + 1 }}</td>
                <td class="px-3 py-2 font-mono text-xs text-gray-800 dark:text-gray-200">{{ eleve.matricule }}</td>
                <td class="px-3 py-2 font-medium text-gray-800 dark:text-gray-200">{{ eleve.prenom }} {{ eleve.nom }}</td>
                <td class="px-3 py-2 text-center font-bold text-green-600 dark:text-green-400">{{ eleve.stats.presents }}</td>
                <td class="px-3 py-2 text-center font-bold text-red-600 dark:text-red-400">{{ eleve.stats.absents }}</td>
                <td class="px-3 py-2 text-center font-bold text-yellow-600 dark:text-yellow-400">{{ eleve.stats.retards }}</td>
                <td class="px-3 py-2 text-center font-bold text-blue-600 dark:text-blue-400">{{ eleve.stats.justifies }}</td>
                <td class="px-3 py-2 text-center font-bold">{{ eleve.tauxPresence }}%</td>
                <td class="px-3 py-2">
                  <div class="flex flex-wrap gap-1">
                    <span 
                      v-for="(point, idx) in eleve.pointsAttention.slice(0, 2)" 
                      :key="idx"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      :title="point"
                    >
                      {{ getPointIcone(point) }}
                    </span>
                    <span 
                      v-for="(point, idx) in eleve.pointsPositifs.slice(0, 2)" 
                      :key="idx"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      :title="point"
                    >
                      {{ getPointIcone(point) }}
                    </span>
                    <span v-if="(eleve.pointsAttention?.length || 0) + (eleve.pointsPositifs?.length || 0) > 4" class="text-xs text-gray-500">
                      +{{ (eleve.pointsAttention?.length || 0) + (eleve.pointsPositifs?.length || 0) - 4 }}
                    </span>
                  </div>
                </td>
                <td class="px-3 py-2 text-center">
                  <span v-if="eleve.aSignalement" class="inline-flex items-center justify-center w-6 h-6 text-orange-600" title="Signalé">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </span>
                  <span v-else class="text-gray-300 dark:text-gray-600">—</span>
                </td>
                <td class="px-3 py-2 max-w-xs truncate text-gray-600 dark:text-gray-400">
                  {{ eleve.observations || '—' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Alertes et points d'attention -->
        <div v-if="alertes.length > 0" class="mb-8">
          <h3 class="text-lg font-semibold mb-3 text-orange-700 dark:text-orange-400 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Points d'attention
          </h3>
          
          <div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <ul class="space-y-2">
              <li v-for="alerte in alertes" :key="alerte.id" class="flex items-start gap-2 text-orange-700 dark:text-orange-300">
                <span class="mt-1">•</span>
                <div>
                  <span class="font-semibold">{{ alerte.eleve }} :</span> {{ alerte.message }}
                  <span v-if="alerte.recommandation" class="text-xs italic block mt-1 text-orange-600 dark:text-orange-400">
                    Recommandation : {{ alerte.recommandation }}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Félicitations -->
        <div v-if="felicitations.length > 0" class="mb-8">
          <h3 class="text-lg font-semibold mb-3 text-green-700 dark:text-green-400 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Félicitations
          </h3>
          
          <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <ul class="space-y-2">
              <li v-for="felicitation in felicitations" :key="felicitation.id" class="flex items-start gap-2 text-green-700 dark:text-green-300">
                <span class="mt-1">🏆</span>
                <div>
                  <span class="font-semibold">{{ felicitation.eleve }} :</span> {{ felicitation.message }}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Section Décisions du conseil (modifiable) -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Décisions du conseil
          </h3>
          
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Avertissements
                </label>
                <textarea 
                  v-model="decisions.avertissements"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                  placeholder="Liste des avertissements décidés..."
                ></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Félicitations / Encouragements
                </label>
                <textarea 
                  v-model="decisions.felicitations"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                  placeholder="Liste des félicitations..."
                ></textarea>
              </div>
            </div>
            
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Observations générales
              </label>
              <textarea 
                v-model="decisions.observations"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                placeholder="Observations et remarques du conseil..."
              ></textarea>
            </div>
            
            <div class="mt-4 flex justify-end">
              <button 
                @click="sauvegarderDecisions"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Enregistrer les décisions
              </button>
            </div>
          </div>
        </div>

        <!-- Pied de page -->
        <div class="text-xs text-gray-400 dark:text-gray-500 border-t pt-4 mt-8 flex justify-between">
          <span>Document généré automatiquement - {{ infos.dateGeneration }}</span>
          <span>{{ infos.classe }} - {{ infos.periode }}</span>
        </div>
      </div>

      <!-- Message si pas de données -->
      <div 
        v-else-if="!loading && !donneesChargees" 
        class="text-center py-12 text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-lg">Sélectionnez une classe pour générer la synthèse</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Dropdown from "primevue/dropdown";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { usePresenceStore } from "~~/stores/presence";
import html2pdf from "html2pdf.js";

const { $toastr } = useNuxtApp();
const presenceStore = usePresenceStore();

// Références
const syntheseContent = ref(null);

// États
const loading = ref(false);
const exportLoading = ref(false);
const donneesChargees = ref(false);

// Filtres
const filters = ref({
  classeId: null,
  periode: 'trimestre1',
  dateDebut: '',
  dateFin: ''
});

// Données de la synthèse
const infos = ref({
  classe: '',
  periode: '',
  dateGeneration: ''
});

const statsGlobales = ref({
  effectif: 0,
  tauxPresence: 0,
  absences: 0,
  retards: 0,
  signalements: 0,
  aSurveiller: 0
});

const eleves = ref([]);
const alertes = ref([]);
const felicitations = ref([]);

// Décisions du conseil (éditables)
const decisions = ref({
  avertissements: '',
  felicitations: '',
  observations: ''
});

// Options pour le dropdown des classes
const classesOptions = computed(() => {
  // À remplacer par vos vraies données
  return [
    { label: 'Terminale S1', value: 'ts1' },
    { label: 'Terminale S2', value: 'ts2' },
    { label: 'Première A', value: '1a' },
    { label: 'Première C', value: '1c' }
  ];
});

// Gestionnaire de changement de période
const onPeriodeChange = () => {
  if (filters.value.periode !== 'personnalise') {
    // Calculer les dates automatiquement selon la période
    const maintenant = new Date();
    const annee = maintenant.getFullYear();
    
    switch (filters.value.periode) {
      case 'trimestre1':
        filters.value.dateDebut = `${annee}-09-01`;
        filters.value.dateFin = `${annee}-12-20`;
        break;
      case 'trimestre2':
        filters.value.dateDebut = `${annee}-01-05`;
        filters.value.dateFin = `${annee}-03-31`;
        break;
      case 'trimestre3':
        filters.value.dateDebut = `${annee}-04-01`;
        filters.value.dateFin = `${annee}-06-30`;
        break;
      case 'semestre1':
        filters.value.dateDebut = `${annee}-09-01`;
        filters.value.dateFin = `${annee}-12-31`;
        break;
      case 'semestre2':
        filters.value.dateDebut = `${annee+1}-01-01`;
        filters.value.dateFin = `${annee+1}-06-30`;
        break;
      case 'annee':
        filters.value.dateDebut = `${annee}-09-01`;
        filters.value.dateFin = `${annee+1}-06-30`;
        break;
    }
  }
  
  chargerSynthese();
};

// Charger la synthèse
const chargerSynthese = async () => {
  if (!filters.value.classeId) return;
  
  loading.value = true;
  
  try {
    // Simuler un appel API (à remplacer par votre vraie API)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Données mockées pour l'exemple
    infos.value = {
      classe: 'Terminale S1',
      periode: '1er Trimestre 2025-2026',
      dateGeneration: new Date().toLocaleDateString('fr-FR')
    };
    
    statsGlobales.value = {
      effectif: 27,
      tauxPresence: 87,
      absences: 124,
      retards: 45,
      signalements: 3,
      aSurveiller: 5
    };
    
    eleves.value = [
      {
        id: 1,
        matricule: '2025-001',
        nom: 'Dupont',
        prenom: 'Jean',
        tauxPresence: 88,
        stats: { presents: 22, absents: 2, retards: 1, justifies: 1 },
        pointsAttention: ['bavardage'],
        pointsPositifs: [],
        aSignalement: false,
        observations: 'Bon élève'
      },
      {
        id: 2,
        matricule: '2025-002',
        nom: 'Martin',
        prenom: 'Marie',
        tauxPresence: 64,
        stats: { presents: 18, absents: 6, retards: 4, justifies: 2 },
        pointsAttention: ['bavardage', 'telephone'],
        pointsPositifs: [],
        aSignalement: true,
        observations: 'À surveiller'
      },
      {
        id: 3,
        matricule: '2025-003',
        nom: 'Petit',
        prenom: 'Paul',
        tauxPresence: 100,
        stats: { presents: 24, absents: 0, retards: 0, justifies: 0 },
        pointsAttention: [],
        pointsPositifs: ['excellent', 'participation'],
        aSignalement: false,
        observations: 'Excellent élève'
      }
    ];
    
    alertes.value = [
      {
        id: 1,
        eleve: 'Marie Martin',
        message: '6 absences, bavardage récurrent, téléphone en cours',
        recommandation: 'Avertissement pour absences répétées'
      },
      {
        id: 2,
        eleve: 'Sophie Lefebvre',
        message: 'Téléphone en cours (2 signalements)',
        recommandation: 'Convocation des parents'
      }
    ];
    
    felicitations.value = [
      {
        id: 1,
        eleve: 'Paul Petit',
        message: '100% de présence, participation active, excellente attitude'
      }
    ];
    
    donneesChargees.value = true;
    
  } catch (error) {
    console.error("Erreur chargement synthèse:", error);
    $toastr?.error("Erreur lors du chargement de la synthèse");
  } finally {
    loading.value = false;
  }
};

// Obtenir l'icône pour un point d'attention
const getPointIcone = (point) => {
  const icones = {
    telephone: '📱',
    bavardage: '💬',
    tenue: '👕',
    retard: '⏰',
    excellent: '🏆',
    participation: '👍',
    'non_concerné': '—'
  };
  return icones[point] || '•';
};

// Sauvegarder les décisions
const sauvegarderDecisions = async () => {
  try {
    // Appel API pour sauvegarder
    await new Promise(resolve => setTimeout(resolve, 500));
    $toastr?.success("Décisions enregistrées avec succès");
  } catch (error) {
    console.error("Erreur sauvegarde:", error);
    $toastr?.error("Erreur lors de la sauvegarde");
  }
};

// Exporter en PDF avec html2pdf
const exporterPDF = async () => {
  if (!syntheseContent.value) return;
  
  exportLoading.value = true;
  
  try {
    const element = syntheseContent.value;
    
    const opt = {
      margin:        [0.5, 0.5, 0.5, 0.5],
      filename:      `synthese_conseil_${infos.value.classe}_${new Date().toISOString().split('T')[0]}.pdf`,
      image:         { type: 'jpeg', quality: 0.98 },
      html2canvas:   { scale: 2, letterRendering: true, useCORS: true, logging: false },
      jsPDF:         { unit: 'in', format: 'a4', orientation: 'landscape' }
    };
    
    await html2pdf().set(opt).from(element).save();
    $toastr?.success("PDF généré avec succès");
    
  } catch (error) {
    console.error("Erreur génération PDF:", error);
    $toastr?.error("Erreur lors de la génération du PDF");
  } finally {
    exportLoading.value = false;
  }
};

// Exporter en Excel
const exporterExcel = async () => {
  if (!filters.value.classeId) return;
  
  exportLoading.value = true;
  
  try {
    // Appel à votre API d'export Excel
    await presenceStore.exportSyntheseConseil({
      classe_id: filters.value.classeId,
      date_debut: filters.value.dateDebut,
      date_fin: filters.value.dateFin,
      periode: filters.value.periode
    });
    
    $toastr?.success("Export Excel réussi");
    
  } catch (error) {
    console.error("Erreur export Excel:", error);
    $toastr?.error("Erreur lors de l'export Excel");
  } finally {
    exportLoading.value = false;
  }
};

// Imprimer
const imprimer = () => {
  window.print();
};

// Initialisation
onMounted(() => {
  const maintenant = new Date();
  const annee = maintenant.getFullYear();
  
  // Dates par défaut (1er trimestre)
  filters.value.dateDebut = `${annee}-09-01`;
  filters.value.dateFin = `${annee}-12-20`;
});
</script>

<style scoped>
/* Styles pour l'impression */
@media print {
  .sticky {
    display: none !important;
  }
  button {
    display: none !important;
  }
  #synthese-content {
    box-shadow: none !important;
    border: none !important;
    padding: 0.5in !important;
  }
  .bg-white {
    background-color: white !important;
  }
}
</style>