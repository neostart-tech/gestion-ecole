// stores/dashboardPaiement.js

import { defineStore } from "pinia";
import axios from "axios";

export const useDashboardPaiementStore = defineStore("dashboardPaiement", {
  state: () => ({
    // Données du dashboard
    statistiques: null,
    evolutionPaiements: [],
    repartitionStatuts: {},
    topPerformers: [],
    etudiantsEnRetard: [],
    paiementsRecents: [],
    statistiquesFilieres: [],
    statistiquesNiveaux: [],
    previsions: [],
    
    // Paramètres
    periode: 'annee',
    dateDebut: null,
    dateFin: null,
    
    // États de chargement
    isLoading: false,
    isExporting: false,
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

    // Résumé formaté
    resume: (state) => state.statistiques?.resume || {},
    
    // Taux de collecte formaté
    tauxCollecte: (state) => {
      return state.statistiques?.resume?.taux_collecte || 0;
    },

    // ================= SCOLARITE =================
    scolariteAPayer: (state) => {
      return state.statistiques?.resume?.scolarite_a_payer || 0;
    },
    scolariteCollecte: (state) => {
      return state.statistiques?.resume?.scolarite_collecte || 0;
    },
    scolariteRestant: (state) => {
      return state.statistiques?.resume?.scolarite_restant || 0;
    },
    scolariteTaux: (state) => {
      return state.statistiques?.resume?.scolarite_taux || 0;
    },

    // ================= INSCRIPTION =================
    inscriptionAPayer: (state) => {
      return state.statistiques?.resume?.inscription_a_payer || 0;
    },
    inscriptionCollecte: (state) => {
      return state.statistiques?.resume?.inscription_collecte || 0;
    },
    inscriptionRestant: (state) => {
      return state.statistiques?.resume?.inscription_restant || 0;
    },
    inscriptionTaux: (state) => {
      return state.statistiques?.resume?.inscription_taux || 0;
    },

    // ================= GLOBAUX =================
    // Montant total à payer formaté (Anciennement)
    montantTotalAPayer: (state) => {
      return state.statistiques?.resume?.montant_total_a_payer || 0;
    },

    // Montant collecté formaté
    montantCollecte: (state) => {
      return state.statistiques?.resume?.montant_collecte || 0;
    },

    // Montant restant formaté
    montantRestant: (state) => {
      return state.statistiques?.resume?.montant_restant || 0;
    },

    // Nombre total d'étudiants
    totalEtudiants: (state) => {
      return state.statistiques?.resume?.total_etudiants || 0;
    },

    // Frais de retrait Mobile Money
    fraisRetraitMM: (state) => {
      return state.statistiques?.resume?.frais_retrait_mm || 0;
    },

    // Étudiants avec frais
    etudiantsAvecFrais: (state) => {
      return state.statistiques?.resume?.etudiants_avec_frais || 0;
    },

    // Période affichée
    periodeAffichee: (state) => {
      return state.statistiques?.resume?.periode || 'Cette année';
    },

    // Données pour les graphiques
    graphiqueEvolution: (state) => {
      return {
        labels: state.evolutionPaiements.map(item => item.label),
        datasets: [
          {
            name: 'Montant',
            values: state.evolutionPaiements.map(item => item.montant)
          },
          {
            name: 'Nombre',
            values: state.evolutionPaiements.map(item => item.nombre)
          }
        ]
      };
    },

    // Statistiques par statut avec couleurs
    graphiqueStatuts: (state) => {
      const statuts = state.repartitionStatuts;
      return [
        { key: 'solde', label: 'Soldé', value: statuts.solde || 0, color: '#10b981' },
        { key: 'a_jour', label: 'À jour', value: statuts.a_jour || 0, color: '#3b82f6' },
        { key: 'retard', label: 'En retard', value: statuts.retard || 0, color: '#ef4444' },
        { key: 'abandon', label: 'Abandons', value: statuts.abandon || 0, color: '#64748b' }
      ];
    },

    // ================= ABANDONS =================
    caActive: (state) => state.statistiques?.resume?.ca_active || { inscription: 0, scolarite: 0, total: 0 },
    caAbandons: (state) => state.statistiques?.resume?.ca_abandons || { inscription: 0, scolarite: 0, total: 0 },
    grandTotalCollecte: (state) => state.statistiques?.resume?.grand_total_collecte || 0,

    // Top performers formaté
    topPerformersFormatted: (state) => {
      return state.topPerformers.map(p => ({
        ...p,
        total_paye_formatted: new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'XOF',
          minimumFractionDigits: 0
        }).format(p.total_paye).replace('XOF', 'FCFA')
      }));
    },

    // Étudiants en retard formatés
    etudiantsEnRetardFormatted: (state) => {
      return state.etudiantsEnRetard.map(e => ({
        ...e,
        montant_restant_formatted: new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'XOF',
          minimumFractionDigits: 0
        }).format(e.montant_restant).replace('XOF', 'FCFA'),
        jours_retard_text: e.jours_retard > 0 ? `${e.jours_retard} jours` : 'Aujourd\'hui'
      }));
    },
    
    // Paiements récents formatés
    paiementsRecentsFormatted: (state) => {
      return state.paiementsRecents.map(p => ({
        ...p,
        montant_formatted: new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'XOF',
          minimumFractionDigits: 0
        }).format(p.montant).replace('XOF', 'FCFA')
      }));
    },

    // Données pour le tableau des filières
    filieresData: (state) => {
      return state.statistiquesFilieres.map(f => ({
        ...f,
        total_a_payer_formatted: new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'XOF',
          minimumFractionDigits: 0
        }).format(f.total_a_payer).replace('XOF', 'FCFA'),
        total_paye_formatted: new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'XOF',
          minimumFractionDigits: 0
        }).format(f.total_paye).replace('XOF', 'FCFA'),
        total_restant_formatted: new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'XOF',
          minimumFractionDigits: 0
        }).format(f.total_restant).replace('XOF', 'FCFA'),
        progression: f.taux_collecte
      }));
    },

    // Données pour le tableau des niveaux
    niveauxData: (state) => {
      return state.statistiquesNiveaux.map(n => ({
        ...n,
        total_a_payer_formatted: new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'XOF',
          minimumFractionDigits: 0
        }).format(n.total_a_payer).replace('XOF', 'FCFA'),
        total_paye_formatted: new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'XOF',
          minimumFractionDigits: 0
        }).format(n.total_paye).replace('XOF', 'FCFA'),
        total_restant_formatted: new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'XOF',
          minimumFractionDigits: 0
        }).format(n.total_restant).replace('XOF', 'FCFA'),
        progression: n.taux_collecte
      }));
    },

    // Prévisions formatées
    previsionsFormatted: (state) => {
      return state.previsions.map(p => ({
        ...p,
        montant_prevu_formatted: new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'XOF',
          minimumFractionDigits: 0
        }).format(p.montant_prevu).replace('XOF', 'FCFA')
      }));
    },
  },

  actions: {
    // ========================================
    // GESTION DES PARAMÈTRES
    // ========================================

    /**
     * Définir la période
     */
    setPeriode(periode) {
      this.periode = periode;
      if (periode !== 'personnalise') {
        this.dateDebut = null;
        this.dateFin = null;
      }
    },

    /**
     * Définir les dates personnalisées
     */
    setDatesPersonnalisees(debut, fin) {
      this.dateDebut = debut;
      this.dateFin = fin;
      this.periode = 'personnalise';
    },

    // ========================================
    // CHARGEMENT DES DONNÉES
    // ========================================

    /**
     * Charger toutes les statistiques du dashboard
     */
    async loadStatistiques() {
      this.isLoading = true;
      this.error = null;

      try {
        const params = {
          periode: this.periode
        };

        if (this.periode === 'personnalise') {
          params.date_debut = this.dateDebut;
          params.date_fin = this.dateFin;
        }

        const response = await axios.get('/finance/dashboard', {
          ...this.authHeaders,
          params
        });

        if (response.data.success) {
          const data = response.data.data;
          
          this.statistiques = data;
          this.evolutionPaiements = data.evolution_paiements || [];
          this.repartitionStatuts = data.repartition_statuts || {};
          this.topPerformers = data.top_performers || [];
          this.etudiantsEnRetard = data.etudiants_en_retard || [];
          this.paiementsRecents = data.paiements_recents || [];
          this.statistiquesFilieres = data.statistiques_filieres || [];
          this.statistiquesNiveaux = data.statistiques_niveaux || [];
          this.previsions = data.previsions || [];
          
          this.lastUpdated = new Date();
        } else {
          throw new Error(response.data.message || "Erreur lors du chargement");
        }

        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || "Erreur lors du chargement des statistiques";
        console.error("Erreur loadStatistiques:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Charger les étudiants en retard
     */
    async loadEtudiantsEnRetard(limit = 20) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get('/dashboard/paiements/etudiants-en-retard', {
          ...this.authHeaders,
          params: { limit }
        });

        if (response.data.success) {
          this.etudiantsEnRetard = response.data.data || [];
        } else {
          throw new Error(response.data.message || "Erreur lors du chargement");
        }

        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || "Erreur lors du chargement";
        console.error("Erreur loadEtudiantsEnRetard:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Charger l'historique des paiements
     */
    async loadHistoriquePaiements(dateDebut, dateFin, page = 1, perPage = 20) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get('/dashboard/paiements/historique', {
          ...this.authHeaders,
          params: {
            date_debut: dateDebut,
            date_fin: dateFin,
            page,
            per_page: perPage
          }
        });

        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.message || "Erreur lors du chargement");
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message || "Erreur lors du chargement";
        console.error("Erreur loadHistoriquePaiements:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Charger les statistiques pour une filière spécifique
     */
    async loadStatistiquesFiliere(filiereId) {
      this.isLoading = true;
      this.error = null;

      try {
        const params = {
          periode: this.periode
        };

        if (this.periode === 'personnalise') {
          params.date_debut = this.dateDebut;
          params.date_fin = this.dateFin;
        }

        const response = await axios.get(`/dashboard/paiements/filiere/${filiereId}/statistiques`, {
          ...this.authHeaders,
          params
        });

        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || "Erreur lors du chargement";
        console.error("Erreur loadStatistiquesFiliere:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Charger les statistiques pour un niveau spécifique
     */
    async loadStatistiquesNiveau(niveauId) {
      this.isLoading = true;
      this.error = null;

      try {
        const params = {
          periode: this.periode
        };

        if (this.periode === 'personnalise') {
          params.date_debut = this.dateDebut;
          params.date_fin = this.dateFin;
        }

        const response = await axios.get(`/dashboard/paiements/niveau/${niveauId}/statistiques`, {
          ...this.authHeaders,
          params
        });

        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || "Erreur lors du chargement";
        console.error("Erreur loadStatistiquesNiveau:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

   
    downloadFile(response, filename) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },

    /**
     * Gérer les erreurs
     */
    async handleError(error) {
      let errorMessage = "Erreur lors de l'export";
      
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const json = JSON.parse(text);
          errorMessage = json.message || errorMessage;
        } catch {
          errorMessage = "Erreur lors de l'export";
        }
      } else {
        errorMessage = error.response?.data?.message || error.message || errorMessage;
      }
      
      this.error = errorMessage;
      console.error("Erreur export:", error);
    },

    /**
     * Rafraîchir toutes les données
     */
    async refresh() {
      await this.loadStatistiques();
    },

    /**
     * Réinitialiser le store
     */
    resetStore() {
      this.statistiques = null;
      this.evolutionPaiements = [];
      this.repartitionStatuts = {};
      this.topPerformers = [];
      this.etudiantsEnRetard = [];
      this.paiementsRecents = [];
      this.statistiquesFilieres = [];
      this.statistiquesNiveaux = [];
      this.previsions = [];
      this.periode = 'annee';
      this.dateDebut = null;
      this.dateFin = null;
      this.isLoading = false;
      this.isExporting = false;
      this.error = null;
      this.lastUpdated = null;
    },
  },
});