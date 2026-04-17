// stores/paiementGlobal.js

import { defineStore } from "pinia";
import axios from "axios";

export const usePaiementGlobalStore = defineStore("paiementGlobal", {
  state: () => ({
    // Recherche d'étudiants
    etudiantsRecherche: [],
    
    // Données de l'étudiant sélectionné
    infosEtudiant: null,        // Infos complètes (type negocie ou standard)
    historiquePaiements: [],     // Historique des paiements
    recap: null,                 // Récapitulatif
    
    // États de chargement
    isLoading: false,
    isSearching: false,
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
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
    },

    // Vérifier si l'étudiant a un frais négocié
    hasFraisNegocie: (state) => {
      return state.infosEtudiant?.type === 'negocie';
    },

    // Vérifier si c'est un frais standard (avec tranches)
    hasFraisStandard: (state) => {
      return state.infosEtudiant?.type === 'standard';
    },

    // Récupérer les échéances/tranches à afficher
    elementsAPayer: (state) => {
      if (!state.infosEtudiant) return [];
      
      if (state.infosEtudiant.type === 'negocie') {
        return state.infosEtudiant.echeances || [];
      } else {
        return state.infosEtudiant.tranches || [];
      }
    },

    // Calculer le total payé
    totalPaye: (state) => {
      return state.infosEtudiant?.total?.total_paye || 0;
    },

    // Calculer le reste à payer
    resteAPayer: (state) => {
      return state.infosEtudiant?.total?.reste_a_payer || 0;
    },

    // Montant total
    montantTotal: (state) => {
      return state.infosEtudiant?.total?.montant_total || 0;
    },

    // Informations sur la bourse
    bourseInfo: (state) => {
      return state.infosEtudiant?.bourse || null;
    },

    // Nombre d'éléments (échéances/tranches)
    nombreElements: (state) => {
      if (!state.infosEtudiant) return 0;
      
      if (state.infosEtudiant.type === 'negocie') {
        return state.infosEtudiant.echeances?.length || 0;
      } else {
        return state.infosEtudiant.tranches?.length || 0;
      }
    },

    // Prochaine échéance/tranche à payer
    prochainElement: (state) => {
      if (!state.infosEtudiant) return null;
      
      const elements = state.infosEtudiant.type === 'negocie' 
        ? state.infosEtudiant.echeances 
        : state.infosEtudiant.tranches;
      
      if (!elements || elements.length === 0) return null;
      
      // Filtrer ceux qui ne sont pas complètement payés
      const nonPayes = elements.filter(e => {
        if (state.infosEtudiant.type === 'negocie') {
          return e.statut !== 'paye';
        } else {
          return e.reste > 0;
        }
      });
      
      // Trier par date limite
      return nonPayes.sort((a, b) => 
        new Date(a.date_limite) - new Date(b.date_limite)
      )[0] || null;
    },

    // Pourcentage de progression global
    progressionGlobale: (state) => {
      return state.recap?.pourcentage || 0;
    },
  },

  actions: {
    // ========================================
    // RECHERCHE D'ÉTUDIANTS
    // ========================================
    
    /**
     * Rechercher des étudiants par nom, prénom ou matricule
     */
    async rechercherEtudiants(searchTerm) {
      if (!searchTerm || searchTerm.length < 2) {
        this.etudiantsRecherche = [];
        return { data: [] };
      }

      this.isSearching = true;
      this.error = null;
      
      try {
        const response = await axios.get(
          `/paiements/rechercher-etudiants?search=${encodeURIComponent(searchTerm)}`,
          this.authHeaders
        );
        
        this.etudiantsRecherche = response.data.data || [];
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur lors de la recherche";
        console.error("Erreur recherche étudiants:", error);
        throw error;
      } finally {
        this.isSearching = false;
      }
    },

    /**
     * Obtenir les informations de paiement d'un étudiant
     * CORRIGÉ pour gérer les erreurs sans bloquer
     */
    async getInfosEtudiant(etudiantId) {
      if (!etudiantId) {
        throw new Error("ID étudiant requis");
      }

      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await axios.get(
          `/paiements/infos/${etudiantId}`,
          this.authHeaders
        );
        
        if (response.data.success) {
          this.infosEtudiant = response.data.data;
          this.lastUpdated = new Date();
          this.error = null; // Effacer toute erreur précédente
        } else {
          // IMPORTANT: Ne pas throw d'erreur, juste stocker le message
          this.infosEtudiant = null;
          this.error = response.data.message || "Impossible de charger les informations";
        }
        
        return response.data;
      } catch (error) {
        // Gestion des erreurs réseau ou autres
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            "Erreur lors du chargement des informations";
        
        this.error = errorMessage;
        this.infosEtudiant = null;
        console.error("Erreur getInfosEtudiant:", error);
        
        // Retourner un objet d'erreur structuré au lieu de throw
        return {
          success: false,
          message: errorMessage
        };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Obtenir le récapitulatif des paiements
     * CORRIGÉ pour gérer les erreurs
     */
    async getRecap(etudiantId) {
      if (!etudiantId) {
        throw new Error("ID étudiant requis");
      }

      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await axios.get(
          `/paiements/recap/${etudiantId}`,
          this.authHeaders
        );
        
        if (response.data.success) {
          this.recap = response.data.data;
        } else {
          // Ne pas throw, juste retourner l'erreur
          console.warn("Récupération récapitulatif:", response.data.message);
          this.recap = null;
        }
        
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            "Erreur lors du chargement du récapitulatif";
        
        this.error = errorMessage;
        this.recap = null;
        console.error("Erreur getRecap:", error);
        
        return {
          success: false,
          message: errorMessage
        };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Obtenir l'historique des paiements d'un étudiant
     */
    async getHistorique(etudiantId) {
      if (!etudiantId) {
        throw new Error("ID étudiant requis");
      }

      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await axios.get(
          `/paiements/historique/${etudiantId}`,
          this.authHeaders
        );
        
        if (response.data.success) {
          this.historiquePaiements = response.data.data || [];
        } else {
          this.historiquePaiements = [];
          console.warn("Récupération historique:", response.data.message);
        }
        
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            "Erreur lors du chargement de l'historique";
        
        this.error = errorMessage;
        this.historiquePaiements = [];
        console.error("Erreur getHistorique:", error);
        
        return {
          success: false,
          message: errorMessage
        };
      } finally {
        this.isLoading = false;
      }
    },

    // ========================================
    // EFFECTUER UN PAIEMENT
    // ========================================
    
    /**
     * Effectuer un paiement
     */
    async effectuerPaiement(paiementData) {
      if (!paiementData.etudiant_id) throw new Error("ID étudiant requis");
      if (!paiementData.montant || paiementData.montant <= 0) throw new Error("Montant invalide");

      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await axios.post(
          `/paiements/store`, // Use the correct Laravel route naming if necessary, or just /paiements
          {
            etudiant_id: paiementData.etudiant_id,
            montant: paiementData.montant,
            mode_paiement: paiementData.mode_paiement,
            nature_paiement: paiementData.nature_paiement || 'scolarite',
            frais_retrait_mm: paiementData.frais_retrait_mm || 0,
            reference: paiementData.reference || null,
            commentaire: paiementData.commentaire || null
          },
          this.authHeaders
        );
        
        if (response.data.success) {
          // Rafraîchir toutes les données après le paiement
          await Promise.allSettled([ // Utiliser allSettled pour ne pas bloquer si une requête échoue
            this.getInfosEtudiant(paiementData.etudiant_id),
            this.getHistorique(paiementData.etudiant_id),
            this.getRecap(paiementData.etudiant_id)
          ]);
        }
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || "Erreur lors du paiement";
        console.error("Erreur effectuerPaiement:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // ========================================
    // MÉTHODES UTILITAIRES
    // ========================================
    
    /**
     * Réinitialiser toutes les données
     */
    resetInfos() {
      this.etudiantsRecherche = [];
      this.infosEtudiant = null;
      this.historiquePaiements = [];
      this.recap = null;
      this.error = null;
      this.lastUpdated = null;
    },

    /**
     * Réinitialiser seulement la recherche
     */
    resetRecherche() {
      this.etudiantsRecherche = [];
    },

    /**
     * Vérifier si l'étudiant a des données
     */
    hasData() {
      return this.infosEtudiant !== null;
    },

    /**
     * Obtenir le type de frais (pour affichage)
     */
    getTypeFrais() {
      if (!this.infosEtudiant) return null;
      
      if (this.infosEtudiant.type === 'negocie') {
        return {
          label: 'Négociation personnalisée',
          icon: 'pi pi-pencil',
          color: 'warning'
        };
      } else {
        return {
          label: 'Tranches standard',
          icon: 'pi pi-calendar',
          color: 'info'
        };
      }
    },

    /**
     * Formater le libellé d'un élément (échéance ou tranche)
     */
    formatElementLabel(element) {
      if (!element) return '';
      return element.libelle;
    },
  },
});