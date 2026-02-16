// stores/reclamation.js
import { defineStore } from "pinia";
import axios from "axios";

export const useReclamationStore = defineStore("reclamation", {
  state: () => ({
    // Liste des réclamations
    reclamations: [],
    reclamationDetail: null,

    // États de chargement
    isLoading: false,
    isSubmitting: false,
    isDeleting: false,

    // Erreurs
    errors: null,

    // Filtres
    filters: {
      statut: null,
    },

    // Statistiques pour l'étudiant
    stats: {
      en_attente: 0,
      approuvee: 0,
      rejetee: 0,
      total: 0,
    },
  }),

  getters: {
    // Réclamations filtrées par statut
    reclamationsEnAttente: (state) => {
      return state.reclamations.filter((r) => r.statut === "en_attente");
    },

    reclamationsApprouvees: (state) => {
      return state.reclamations.filter((r) => r.statut === "approuvee");
    },

    reclamationsRejetees: (state) => {
      return state.reclamations.filter((r) => r.statut === "rejetee");
    },

    // Vérifier si l'étudiant peut réclamer (max 3 en cours)
    peutEncoreReclamer: (state) => {
      return state.stats.en_attente < 3;
    },

    // Obtenir une réclamation par son ID
    getReclamationById: (state) => (id) => {
      return state.reclamations.find((r) => r.id === id);
    },
  },

  actions: {
    // RESET - Réinitialiser le store
    resetStore() {
      this.reclamations = [];
      this.reclamationDetail = null;
      this.isLoading = false;
      this.isSubmitting = false;
      this.isDeleting = false;
      this.errors = null;
      this.filters = { statut: null };
      this.stats = {
        en_attente: 0,
        approuvee: 0,
        rejetee: 0,
        total: 0,
      };
    },

    authHeaders() {
      const token = localStorage.getItem("gest-ecole-token");

      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
    },

     multipartHeaders() {
      const token = localStorage.getItem("gest-ecole-token");
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
        },
      };
    },
    // Mettre à jour les filtres
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters };
    },

    // Calculer les statistiques
    calculerStats() {
      const stats = {
        en_attente: 0,
        approuvee: 0,
        rejetee: 0,
        total: this.reclamations.length,
      };

      this.reclamations.forEach((r) => {
        if (r.statut === "en_attente") stats.en_attente++;
        else if (r.statut === "approuvee") stats.approuvee++;
        else if (r.statut === "rejetee") stats.rejetee++;
      });

      this.stats = stats;
    },

    // FETCH_RECLAMATIONS - Récupérer toutes les réclamations (admin)
    async fetchReclamations(params = {}) {
      this.isLoading = true;
      this.errors = null;

      try {
        const url = `/reclamations`;
        const response = await axios.get(url,this.authHeaders());

        // La réponse est directement une collection de ReclamationResource
        this.reclamations = response.data.data || response.data;

        // Calculer les stats
        this.calculerStats();

        return this.reclamations;
      } catch (error) {
        this.errors = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async fetchMesReclamations() {
      this.isLoading = true;
      this.errors = null;

      try {
        const response = await axios.get("/reclamations/mes-reclamations",this.authHeaders());

        // La réponse est une collection de ReclamationResource
        this.reclamations = response.data.data || response.data;

        // Calculer les stats pour l'étudiant
        this.calculerStats();

        return this.reclamations;
      } catch (error) {
        this.errors = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // STORE_RECLAMATION - Créer une nouvelle réclamation (étudiant)
    async storeReclamation(formData) {
      this.isSubmitting = true;
      this.errors = null;

      try {
        let data = formData;
        if (!(formData instanceof FormData)) {
          data = new FormData();
          Object.keys(formData).forEach((key) => {
            if (formData[key] !== null && formData[key] !== undefined) {
              data.append(key, formData[key]);
            }
          });
        }

         const token = localStorage.getItem("gest-ecole-token");
        const response = await axios.post(
          "/reclamations/mes-reclamations",
          data,
         this.multipartHeaders()
        );

        // Ajouter la nouvelle réclamation à la liste
        const newReclamation = response.data.data || response.data;
        this.reclamations.unshift(newReclamation);

        // Mettre à jour les stats
        this.calculerStats();

        return newReclamation;
      } catch (error) {
        this.errors =
          error.response?.data?.errors ||
          error.response?.data?.message ||
          error.message;
        throw error;
      } finally {
        this.isSubmitting = false;
      }
    },

    // TRAITER_RECLAMATION - Traiter une réclamation (admin)
    async traiterReclamation(reclamationId, data) {
      this.isSubmitting = true;
      this.errors = null;

      try {
        const response = await axios.post(
          `/reclamations/${reclamationId}/traiter`,
          data,
          this.authHeaders();
        );

        // Mettre à jour la réclamation dans la liste
        const updatedReclamation = response.data.data || response.data;
        const index = this.reclamations.findIndex(
          (r) => r.id === reclamationId,
        );
        if (index !== -1) {
          this.reclamations[index] = updatedReclamation;
        }

        // Si c'est la réclamation détaillée, la mettre à jour aussi
        if (this.reclamationDetail?.id === reclamationId) {
          this.reclamationDetail = updatedReclamation;
        }

        // Recalculer les stats
        this.calculerStats();

        return updatedReclamation;
      } catch (error) {
        this.errors = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.isSubmitting = false;
      }
    },

    // ANNULER_RECLAMATION - Annuler une réclamation (étudiant)
    async annulerReclamation(reclamationId) {
      this.isDeleting = true;
      this.errors = null;

      try {
        const response = await axios.delete(
          `/reclamations/reclamations/${reclamationId}/annuler`,
        );

        // Supprimer la réclamation de la liste
        this.reclamations = this.reclamations.filter(
          (r) => r.id !== reclamationId,
        );

        // Si c'est la réclamation détaillée, la supprimer aussi
        if (this.reclamationDetail?.id === reclamationId) {
          this.reclamationDetail = null;
        }

        // Recalculer les stats
        this.calculerStats();

        return response.data;
      } catch (error) {
        this.errors = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.isDeleting = false;
      }
    },

  g
  },

  persist: {
    // Ne pas persister tout le store, seulement si nécessaire
    enabled: false, // Désactivé par défaut
  },
});
