// stores/etudiant/parcours.js

import { defineStore } from "pinia";
import axios from "axios";

export const useEtudiantParcoursStore = defineStore("etudiantParcours", {
  state: () => ({
    // Données du parcours
    parcours: null,
    identite: null,
    parcoursAcademique: [],
    paiementsParAnnee: [],
    boursesObtenues: [],
    statutFinancier: null,
    historiqueAnnees: [],
    statistiques: null,
    
    // État de l'interface
    anneeSelectionnee: null,
    vueDetails: false,
    
    // États de chargement
    isLoading: false,
    isLoadingDetails: false,
    error: null,
    
    // Métadonnées
    lastUpdated: null,
  }),

  getters: {
    // Headers d'authentification
    authHeaders: () => {
      const token = localStorage.getItem("gest-ecole-token");
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
    },

    // Année en cours
    anneeActuelle: (state) => {
      if (!state.paiementsParAnnee) return null;
      return state.paiementsParAnnee.find(a => a.est_actuelle) || null;
    },

    // Années disponibles pour le switch
    anneesDisponibles: (state) => {
      if (!state.paiementsParAnnee) return [];
      return state.paiementsParAnnee.map(a => ({
        id: a.annee_scolaire_id,
        label: a.annee_scolaire,
        estActuelle: a.est_actuelle,
        statut: a.statut,
        progression: a.progression
      }));
    },

    // Données de l'année sélectionnée
    anneeSelectionneeData: (state) => {
      if (!state.anneeSelectionnee || !state.paiementsParAnnee) return null;
      return state.paiementsParAnnee.find(
        a => a.annee_scolaire_id === state.anneeSelectionnee
      ) || null;
    },

    // Progression globale formatée
    progressionGlobale: (state) => {
      return state.statutFinancier?.progression || 0;
    },

    // Total à payer formaté
    totalAPayerFormatted: (state) => {
      return formatMontant(state.statutFinancier?.total_a_payer);
    },

    // Total payé formaté
    totalPayeFormatted: (state) => {
      return formatMontant(state.statutFinancier?.total_paye);
    },

    // Reste à payer formaté
    resteAPayerFormatted: (state) => {
      return formatMontant(state.statutFinancier?.reste_a_payer);
    },

    // Couleur du statut
    couleurStatut: (state) => (statut) => {
      const couleurs = {
        solde: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
        en_cours: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
        en_retard: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
        aucun_frais: 'text-gray-600 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
      };
      return couleurs[statut] || 'text-gray-600 bg-gray-50 dark:bg-gray-700';
    },

    // Libellé du statut
    libelleStatut: () => (statut) => {
      const libelles = {
        solde: 'Soldé',
        en_cours: 'En cours',
        en_retard: 'En retard',
        aucun_frais: 'Aucun frais'
      };
      return libelles[statut] || statut;
    },

    // Icône du statut
    iconeStatut: () => (statut) => {
      const icones = {
        solde: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        en_cours: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        en_retard: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        aucun_frais: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
      };
      return icones[statut] || 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  },

  actions: {
   
    async loadParcours() {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get('/etudiant/parcours', this.authHeaders);

        if (response.data.success) {
          const data = response.data.data;
          
          this.parcours = data;
          this.identite = data.identite;
          this.parcoursAcademique = data.parcours_academique || [];
          this.paiementsParAnnee = data.paiements_par_annee || [];
          this.boursesObtenues = data.bourses_obtenues || [];
          this.statutFinancier = data.statut_financier;
          this.historiqueAnnees = data.historique_annees || [];
          this.statistiques = data.statistiques;
          
          // Par défaut, sélectionner l'année en cours
          const anneeActuelle = this.paiementsParAnnee.find(a => a.est_actuelle);
          if (anneeActuelle) {
            this.anneeSelectionnee = anneeActuelle.annee_scolaire_id;
          } else if (this.paiementsParAnnee.length > 0) {
            this.anneeSelectionnee = this.paiementsParAnnee[0].annee_scolaire_id;
          }
          
          this.lastUpdated = new Date();
        } else {
          throw new Error(response.data.message || "Erreur lors du chargement");
        }

        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || "Erreur lors du chargement";
        console.error("Erreur loadParcours:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Charge les détails d'une année spécifique
     */
    async loadDetailsAnnee(anneeId) {
      this.isLoadingDetails = true;
      this.error = null;

      try {
        const response = await axios.get(`/etudiant/parcours/annee/${anneeId}`, this.authHeaders);

        if (response.data.success) {
          // Mettre à jour les données de l'année dans paiementsParAnnee
          const index = this.paiementsParAnnee.findIndex(a => a.annee_scolaire_id == anneeId);
          if (index !== -1) {
            this.paiementsParAnnee[index] = {
              ...this.paiementsParAnnee[index],
              details: response.data.data
            };
          }
          
          this.vueDetails = true;
        }

        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || "Erreur lors du chargement des détails";
        console.error("Erreur loadDetailsAnnee:", error);
        throw error;
      } finally {
        this.isLoadingDetails = false;
      }
    },

    /**
     * Charge les paiements d'une année spécifique
     */
    async loadPaiementsAnnee(anneeId) {
      this.isLoadingDetails = true;
      this.error = null;

      try {
        const response = await axios.get(`/etudiant/parcours/paiements/${anneeId}`, this.authHeaders);

        if (response.data.success) {
          // Mettre à jour les paiements dans l'année correspondante
          const index = this.paiementsParAnnee.findIndex(a => a.annee_scolaire_id == anneeId);
          if (index !== -1) {
            this.paiementsParAnnee[index].paiements = response.data.data;
          }
        }

        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || "Erreur lors du chargement des paiements";
        console.error("Erreur loadPaiementsAnnee:", error);
        throw error;
      } finally {
        this.isLoadingDetails = false;
      }
    },

    selectAnnee(anneeId) {
      this.anneeSelectionnee = anneeId;
      this.vueDetails = false;
      
      // Charger les détails si pas encore chargés
      const annee = this.paiementsParAnnee.find(a => a.annee_scolaire_id == anneeId);
      if (annee && !annee.details) {
        this.loadDetailsAnnee(anneeId);
      }
    },

    /**
     * Affiche les détails de l'année sélectionnée
     */
    showDetails() {
      if (this.anneeSelectionnee && !this.vueDetails) {
        this.loadDetailsAnnee(this.anneeSelectionnee);
      }
    },

    /**
     * Retourne à la vue liste
     */
    backToList() {
      this.vueDetails = false;
    },

    /**
     * Rafraîchit les données
     */
    async refresh() {
      await this.loadParcours();
    },

    resetStore() {
      this.parcours = null;
      this.identite = null;
      this.parcoursAcademique = [];
      this.paiementsParAnnee = [];
      this.boursesObtenues = [];
      this.statutFinancier = null;
      this.historiqueAnnees = [];
      this.statistiques = null;
      this.anneeSelectionnee = null;
      this.vueDetails = false;
      this.isLoading = false;
      this.isLoadingDetails = false;
      this.error = null;
      this.lastUpdated = null;
    },

    /**
     * Formate un montant
     */
    formatMontant(montant) {
      if (montant === undefined || montant === null) return '-';
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0
      }).format(montant).replace('XOF', 'FCFA');
    }
  }
});

// Fonction utilitaire externe pour les getters
function formatMontant(montant) {
  if (montant === undefined || montant === null) return '-';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(montant).replace('XOF', 'FCFA');
}