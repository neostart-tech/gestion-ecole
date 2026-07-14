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
      
      let elements = [];
      if (state.infosEtudiant.type === 'negocie') {
        elements = [...(state.infosEtudiant.echeances || [])];
      } else {
        elements = [...(state.infosEtudiant.tranches || [])];
      }

      // Ajouter le frais d'inscription s'il existe et n'est pas payé
      if (state.infosEtudiant.frais_inscription && state.infosEtudiant.frais_inscription.reste > 0) {
        // On le met au début avec un type spécial
        const insc = {
           ...state.infosEtudiant.frais_inscription,
           payable_type: 'frais_inscription',
           is_inscription: true
        };
        elements.unshift(insc);
      }

      return elements;
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
      
      let count = 0;
      if (state.infosEtudiant.type === 'negocie') {
        count = state.infosEtudiant.echeances?.length || 0;
      } else {
        count = state.infosEtudiant.tranches?.length || 0;
      }

      if (state.infosEtudiant.frais_inscription) count++;
      return count;
    },

    // Prochaine échéance/tranche à payer
    prochainElement(state) {
      const elements = this.elementsAPayer;
      if (!elements || elements.length === 0) return null;
      
      // Filtrer ceux qui ne sont pas complètement payés
      const nonPayes = elements.filter(e => (e.reste || e.reste_a_payer) > 0);
      
      // Si on a un frais d'inscription non payé, c'est la priorité absolue
      const insc = nonPayes.find(e => e.is_inscription);
      if (insc) return insc;

      // Trier par date limite
      return nonPayes.sort((a, b) => 
        new Date(a.date_limite || '9999-12-31') - new Date(b.date_limite || '9999-12-31')
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
    async getInfosEtudiant(etudiantId = null) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const url = etudiantId ? `/paiements/infos/${etudiantId}` : `/paiements/infos`;
        const response = await axios.get(url, this.authHeaders);
        
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
    async getRecap(etudiantId = null) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const url = etudiantId ? `/paiements/recap/${etudiantId}` : `/paiements/recap`;
        const response = await axios.get(url, this.authHeaders);
        
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
    async getHistorique(etudiantId = null) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const url = etudiantId ? `/paiements/historique/${etudiantId}` : `/paiements/historique`;
        const response = await axios.get(url, this.authHeaders);
        
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
        const hasFile = paiementData.justificatif instanceof File || paiementData.justificatif instanceof Blob;
        let payload;
        let config = { ...this.authHeaders };

        if (hasFile) {
          payload = new FormData();
          payload.append('etudiant_id', paiementData.etudiant_id);
          payload.append('montant', paiementData.montant);
          payload.append('mode_paiement', paiementData.mode_paiement);
          payload.append('nature_paiement', paiementData.nature_paiement || 'scolarite');
          payload.append('frais_retrait_mm', paiementData.frais_retrait || paiementData.frais_retrait_mm || 0);
          
          if (paiementData.reference) payload.append('reference', paiementData.reference);
          if (paiementData.commentaire) payload.append('commentaire', paiementData.commentaire);
          if (paiementData.payable_id) {
            payload.append('payable_id', paiementData.payable_id);
            const type = paiementData.payable_type || (this.infosEtudiant?.type === 'negocie' ? 'echeance' : 'tranche');
            payload.append('payable_type', type);
          }
          
          payload.append('justificatif', paiementData.justificatif);
          
          // Supprimer le Content-Type par défaut pour laisser le navigateur mettre le bon avec le boundary
          delete config.headers['Content-Type'];
        } else {
          payload = {
            etudiant_id: paiementData.etudiant_id,
            montant: paiementData.montant,
            mode_paiement: paiementData.mode_paiement,
            nature_paiement: paiementData.nature_paiement || 'scolarite',
            frais_retrait_mm: paiementData.frais_retrait || paiementData.frais_retrait_mm || 0,
            reference: paiementData.reference || null,
            commentaire: paiementData.commentaire || null,
            payable_id: paiementData.payable_id || null,
            payable_type: paiementData.payable_type || (paiementData.payable_id ? (this.infosEtudiant?.type === 'negocie' ? 'echeance' : 'tranche') : null)
          };
        }

        const response = await axios.post(
          `/paiements/store`,
          payload,
          config
        );
        
        if (response.data.success) {
          // Rafraîchir toutes les données après le paiement
          await Promise.allSettled([ 
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

    /**
     * Initier un paiement via SEMOA (USSD/Direct Pay)
     */
    async initierPaiementSemoa(paiementData) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post(
          '/semoa/initiate',
          paiementData,
          this.authHeaders
        );
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur SEMOA";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Modifier un paiement existant
     */
    async modifierPaiement(paiementId, paiementData) {
      if (!paiementId) throw new Error("ID paiement requis");
      
      this.isLoading = true;
      this.error = null;
      
      try {
        const hasFile = paiementData.justificatif instanceof File || paiementData.justificatif instanceof Blob;
        let payload;
        let config = { ...this.authHeaders };

        if (hasFile) {
          payload = new FormData();
          if (paiementData.montant) payload.append('montant', paiementData.montant);
          if (paiementData.mode_paiement) payload.append('mode_paiement', paiementData.mode_paiement);
          if (paiementData.reference) payload.append('reference', paiementData.reference);
          if (paiementData.commentaire) payload.append('commentaire', paiementData.commentaire);
          if (paiementData.frais_retrait_mm !== undefined) payload.append('frais_retrait_mm', paiementData.frais_retrait_mm);
          payload.append('justificatif', paiementData.justificatif);
          
          delete config.headers['Content-Type'];
        } else {
          payload = {
            montant: paiementData.montant,
            mode_paiement: paiementData.mode_paiement,
            reference: paiementData.reference,
            commentaire: paiementData.commentaire,
            frais_retrait_mm: paiementData.frais_retrait_mm
          };
        }

        const response = await axios.post(
          `/paiements/${paiementId}/update`,
          payload,
          config
        );
        
        if (response.data.success) {
          // Rafraîchir les données de l'étudiant
          const etudiantId = response.data.paiement.etudiant_id;
          await Promise.allSettled([
            this.getInfosEtudiant(etudiantId),
            this.getHistorique(etudiantId),
            this.getRecap(etudiantId)
          ]);
        }
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || "Erreur lors de la modification";
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