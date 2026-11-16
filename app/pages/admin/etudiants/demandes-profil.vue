<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- En-tête de page -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            <h1 class="text-xl font-bold text-slate-900 dark:text-white">
              Validation des Profils Étudiants
            </h1>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Examinez et validez les mises à jour et pièces justificatives soumises par les étudiants.
          </p>
        </div>

        <button
          @click="loadDemandes"
          :disabled="isLoading"
          class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <svg class="w-4 h-4" :class="{'animate-spin': isLoading}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualiser
        </button>
      </div>

      <!-- Filtres & Onglets de statut -->
      <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- Onglets -->
        <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            @click="setStatutFilter('en_attente')"
            class="px-4 py-2 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-2"
            :class="statutFilter === 'en_attente' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
          >
            <span>En attente</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-bold">
              {{ counts.en_attente || 0 }}
            </span>
          </button>

          <button
            @click="setStatutFilter('valide')"
            class="px-4 py-2 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-2"
            :class="statutFilter === 'valide' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
          >
            <span>Validées</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-bold">
              {{ counts.valide || 0 }}
            </span>
          </button>

          <button
            @click="setStatutFilter('rejete')"
            class="px-4 py-2 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-2"
            :class="statutFilter === 'rejete' ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
          >
            <span>Refusées</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-bold">
              {{ counts.rejete || 0 }}
            </span>
          </button>

          <button
            @click="setStatutFilter('tous')"
            class="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
            :class="statutFilter === 'tous' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
          >
            Toutes
          </button>
        </div>

        <!-- Recherche -->
        <div class="relative w-full md:w-72">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Rechercher (Nom, Matricule...)"
            class="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Liste des demandes -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-xs text-slate-500 mt-3">Chargement des demandes...</p>
      </div>

      <div v-else-if="demandesList.length === 0" class="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center px-4">
        <div class="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 mb-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200">Aucune demande trouvée</h3>
        <p class="text-xs text-slate-500 mt-1 max-w-sm">
          Il n'y a actuellement aucune demande de mise à jour de profil avec le filtre sélectionné.
        </p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="demande in demandesList"
          :key="demande.id"
          class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <!-- Étudiant -->
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center shrink-0 uppercase text-sm">
                {{ (demande.etudiant?.nom?.[0] || '') + (demande.etudiant?.prenom?.[0] || '') }}
              </div>
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="text-sm font-bold text-slate-900 dark:text-white">
                    {{ demande.etudiant?.nom }} {{ demande.etudiant?.prenom }}
                  </h3>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {{ demande.etudiant?.matricule || 'N/A' }}
                  </span>
                  <!-- Badge statut -->
                  <span
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                    :class="{
                      'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300': demande.statut === 'en_attente',
                      'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300': demande.statut === 'valide',
                      'bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300': demande.statut === 'rejete',
                    }"
                  >
                    {{ formatStatut(demande.statut) }}
                  </span>
                </div>

                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>{{ demande.etudiant?.email }}</span>
                  <span>{{ demande.etudiant?.tel }}</span>
                  <span>Soumis le {{ formatDate(demande.created_at) }}</span>
                </div>

                <!-- Documents joints -->
                <div v-if="demande.documents_formatted && Object.keys(demande.documents_formatted).length > 0" class="mt-3 flex flex-wrap items-center gap-2">
                  <span class="text-[11px] font-medium text-slate-400">Pièces justificatives :</span>
                  <a
                    v-for="(doc, key) in demande.documents_formatted"
                    :key="key"
                    :href="doc.url"
                    target="_blank"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 transition-colors"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span>{{ formatDocKey(key) }}</span>
                  </a>
                </div>

                <!-- Motif de refus si rejeté -->
                <div v-if="demande.statut === 'rejete' && demande.motif_refus" class="mt-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20 p-2 rounded-lg border border-rose-200/50">
                  <strong>Motif du refus :</strong> {{ demande.motif_refus }}
                </div>
              </div>
            </div>

            <!-- Boutons d'actions -->
            <div class="flex items-center gap-2 self-end lg:self-center">
              <button
                @click="openDetailsModal(demande)"
                class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
              >
                Examiner
              </button>

              <button
                v-if="demande.statut === 'en_attente'"
                @click="handleValider(demande)"
                :disabled="isActionLoading"
                class="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
              >
                Valider
              </button>

              <button
                v-if="demande.statut === 'en_attente'"
                @click="openRejetModal(demande)"
                :disabled="isActionLoading"
                class="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-colors"
              >
                Refuser
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modale d'examen détaillé -->
    <div v-if="selectedDemande" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 class="text-base font-bold text-slate-900 dark:text-white">
              Détails de la demande - {{ selectedDemande.etudiant?.nom }} {{ selectedDemande.etudiant?.prenom }}
            </h2>
            <p class="text-xs text-slate-500">
              Matricule : {{ selectedDemande.etudiant?.matricule }} | Date : {{ formatDate(selectedDemande.created_at) }}
            </p>
          </div>
          <button @click="selectedDemande = null" class="text-slate-400 hover:text-slate-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Données soumises -->
        <div class="space-y-4">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Informations d'état civil demandées</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
            <div>
              <span class="text-slate-400 block">Nom :</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ selectedDemande.data?.nom }}</span>
            </div>
            <div>
              <span class="text-slate-400 block">Prénom :</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ selectedDemande.data?.prenom }}</span>
            </div>
            <div>
              <span class="text-slate-400 block">Nom jeune fille :</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ selectedDemande.data?.nom_jeune_fille || '—' }}</span>
            </div>
            <div>
              <span class="text-slate-400 block">Genre :</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ selectedDemande.data?.genre }}</span>
            </div>
            <div>
              <span class="text-slate-400 block">Date de naissance :</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ selectedDemande.data?.date_naissance }}</span>
            </div>
            <div>
              <span class="text-slate-400 block">Lieu de naissance :</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ selectedDemande.data?.lieu_naissance }}</span>
            </div>
            <div>
              <span class="text-slate-400 block">Nationalité :</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ selectedDemande.data?.nationalite }}</span>
            </div>
            <div>
              <span class="text-slate-400 block">Téléphone :</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ selectedDemande.data?.tel }}</span>
            </div>
            <div>
              <span class="text-slate-400 block">Email (Verrouillé) :</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ selectedDemande.etudiant?.email }}</span>
            </div>
          </div>

          <!-- Tuteur -->
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mt-4">Parent ou Tuteur</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
            <div>
              <span class="text-slate-400 block">Nom & Prénom :</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ selectedDemande.data?.tuteur?.nom }} {{ selectedDemande.data?.tuteur?.prenom }}</span>
            </div>
            <div>
              <span class="text-slate-400 block">Téléphone :</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ selectedDemande.data?.tuteur?.tel }}</span>
            </div>
            <div>
              <span class="text-slate-400 block">Profession :</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ selectedDemande.data?.tuteur?.profession || '—' }}</span>
            </div>
            <div>
              <span class="text-slate-400 block">Email :</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ selectedDemande.data?.tuteur?.email || '—' }}</span>
            </div>
            <div class="col-span-2">
              <span class="text-slate-400 block">Adresse :</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ selectedDemande.data?.tuteur?.adresse || '—' }}</span>
            </div>
          </div>

          <!-- Pièces jointes -->
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mt-4">Pièces téléversées</h3>
          <div v-if="selectedDemande.documents_formatted && Object.keys(selectedDemande.documents_formatted).length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="(doc, key) in selectedDemande.documents_formatted"
              :key="key"
              class="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            >
              <div class="flex items-center gap-2 truncate">
                <svg class="w-4 h-4 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                <span class="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{{ formatDocKey(key) }}</span>
              </div>
              <a
                :href="resolveDocUrl(doc.url || doc.path)"
                target="_blank"
                class="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Voir la pièce
              </a>
            </div>
          </div>
          <p v-else class="text-xs text-slate-400 italic">Aucune nouvelle pièce téléversée pour cette demande.</p>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button
            @click="selectedDemande = null"
            class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Fermer
          </button>
          <template v-if="selectedDemande.statut === 'en_attente'">
            <button
              @click="openRejetModal(selectedDemande); selectedDemande = null;"
              class="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white"
            >
              Refuser avec motif
            </button>
            <button
              @click="handleValider(selectedDemande); selectedDemande = null;"
              class="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              Valider définitivement
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Modale de Rejet avec Motif Obligatoire -->
    <div v-if="rejetModalDemande" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div class="flex items-start gap-3">
          <div class="p-2.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Refuser la mise à jour</h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Veuillez préciser le motif du refus. L'étudiant recevra ce motif par email.
            </p>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Motif du refus <span class="text-rose-500">*</span>
          </label>
          <textarea
            v-model="motifRefus"
            rows="4"
            required
            placeholder="Ex : La pièce d'identité fournie est illisible. Veuillez téléverser un document plus net."
            class="w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-rose-500 transition-all"
          ></textarea>
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            @click="rejetModalDemande = null; motifRefus = '';"
            class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Annuler
          </button>
          <button
            type="button"
            @click="handleConfirmerRejet"
            :disabled="!motifRefus.trim() || isActionLoading"
            class="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-50 transition-colors inline-flex items-center gap-1.5"
          >
            <span v-if="isActionLoading" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Confirmer et notifier</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useEtudiantStore } from '~~/stores/etudiant';
import { getStorageBaseUrl } from '~~/app/utils/storageUrl';

const etudiantStore = useEtudiantStore();
const { $toastr } = useNuxtApp();

const isLoading = ref(true);
const isActionLoading = ref(false);
const demandesList = ref([]);
const counts = ref({ en_attente: 0, valide: 0, rejete: 0 });

const statutFilter = ref('en_attente');
const searchQuery = ref('');

const selectedDemande = ref(null);
const rejetModalDemande = ref(null);
const motifRefus = ref('');

const loadDemandes = async () => {
  isLoading.value = true;
  try {
    const params = {
      statut: statutFilter.value,
      search: searchQuery.value || undefined,
    };
    const res = await etudiantStore.fetchDemandesProfil(params);
    demandesList.value = res.demandes?.data || [];
    counts.value = res.counts || { en_attente: 0, valide: 0, rejete: 0 };
  } catch (error) {
    console.error('Erreur chargement demandes profil:', error);
    if ($toastr) $toastr.error('Impossible de charger les demandes.');
  } finally {
    isLoading.value = false;
  }
};

const setStatutFilter = (statut) => {
  statutFilter.value = statut;
  loadDemandes();
};

let searchTimeout = null;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadDemandes();
  }, 300);
};

const formatStatut = (statut) => {
  if (statut === 'en_attente') return 'En attente';
  if (statut === 'valide') return 'Validée';
  if (statut === 'rejete') return 'Refusée';
  return statut;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDocKey = (key) => {
  return String(key).replace(/_/g, ' ').toUpperCase();
};

const resolveDocUrl = (urlOrPath) => {
  if (!urlOrPath) return '#';
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
    if (urlOrPath.includes('ngrok-free.dev') || urlOrPath.includes('localhost:8000') || urlOrPath.includes('127.0.0.1:8000')) {
      const storageIdx = urlOrPath.indexOf('/storage/');
      if (storageIdx !== -1) {
        return `${getStorageBaseUrl()}${urlOrPath.substring(storageIdx)}`;
      }
    }
    return urlOrPath;
  }
  const cleanPath = urlOrPath.startsWith('/storage/') ? urlOrPath : `/storage/${urlOrPath.replace(/^\/+/, '')}`;
  return `${getStorageBaseUrl()}${cleanPath}`;
};

const openDetailsModal = (demande) => {
  selectedDemande.value = demande;
};

const openRejetModal = (demande) => {
  rejetModalDemande.value = demande;
  motifRefus.value = '';
};

const handleValider = async (demande) => {
  if (!confirm(`Confirmez-vous la validation du profil de ${demande.etudiant?.nom} ${demande.etudiant?.prenom} ? Les informations seront définitivement appliquées.`)) {
    return;
  }

  isActionLoading.value = true;
  try {
    const res = await etudiantStore.validerDemandeProfil(demande.id);
    if ($toastr) $toastr.success(res.message || 'Demande validée avec succès.');
    await loadDemandes();
  } catch (error) {
    console.error('Erreur validation:', error);
    const msg = error?.response?.data?.message || 'Erreur lors de la validation.';
    if ($toastr) $toastr.error(msg);
  } finally {
    isActionLoading.value = false;
  }
};

const handleConfirmerRejet = async () => {
  if (!motifRefus.value.trim() || !rejetModalDemande.value) return;

  isActionLoading.value = true;
  try {
    const res = await etudiantStore.rejeterDemandeProfil(rejetModalDemande.value.id, motifRefus.value);
    if ($toastr) $toastr.success(res.message || 'Demande refusée. L\'étudiant a été notifié par email.');
    rejetModalDemande.value = null;
    motifRefus.value = '';
    await loadDemandes();
  } catch (error) {
    console.error('Erreur rejet:', error);
    const msg = error?.response?.data?.message || 'Erreur lors du rejet.';
    if ($toastr) $toastr.error(msg);
  } finally {
    isActionLoading.value = false;
  }
};

onMounted(() => {
  loadDemandes();
});
</script>
