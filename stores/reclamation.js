import { defineStore } from "pinia";
import axios from "axios";

export const useReclamationStore = defineStore("reclamation", {
  state: () => ({
    reclamations: [],
    reclamation: null,
    reclamationDetail: null,
    isLoading: false,
    isSubmitting: false,
    isDeleting: false,
    errors: null,
  }),

  getters: {
    reclamationsEnAttente: (state) => {
      return state.reclamations.filter((r) => r.statut === "en_attente");
    },
    reclamationsEnAttenteCount: (state) => {
      return state.reclamations && state.reclamations !==null ? state.reclamations.filter((r) => r.statut === "en_attente").length : 0;
    },
    reclamationsApprouvees: (state) => {
      return state.reclamations.filter((r) => r.statut === "approuvee");
    },
    reclamationsRejetees: (state) => {
      return state.reclamations.filter((r) => r.statut === "rejetee");
    },
    getReclamationById: (state) => (id) => {
      return state.reclamations.find((r) => r.id === id);
    },
  },

  actions: {
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

    async fetchReclamations() {
      this.isLoading = true;
      this.errors = null;
      try {
        const url = `/reclamations`;
        const response = await axios.get(url, this.authHeaders());
        this.reclamations = response.data.data || response.data;
        return this.reclamations;
      } catch (error) {
        this.errors = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async fetchReclamation(reclamation) {
      this.isLoading = true;
      this.errors = null;
      try {
        const url = `/reclamations/${reclamation}`;
        const response = await axios.get(url, this.authHeaders());
        this.reclamation = response.data.data || response.data;
        return this.reclamation;
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
        const response = await axios.get(
          "/reclamations/mes-reclamations",
          this.authHeaders(),
        ); // AJOUT DE /api/
        this.reclamations = response.data.data || response.data;
        return this.reclamations;
      } catch (error) {
        this.errors = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchReclamationDetail(note) {
      this.isLoading = true;
      this.errors = null;
      try {
        const response = await axios.get(
          `/reclamations/${note}/detail-une-reclamation`,
          this.authHeaders(),
        );
        return (this.reclamation = response.data.data || response.data);
        // return this.reclamation;
      } catch (error) {
        this.errors = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async storeReclamation(formData, note) {
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

        // CORRECTION: Ajout de /api/ dans l'URL
        const response = await axios.post(
          `/reclamations/${note}/enregistrer-une-reclamation`,
          data,
          this.multipartHeaders(),
        );

        const newReclamation = response.data.data || response.data;
        this.reclamations.unshift(newReclamation);
        return newReclamation;
      } catch (error) {
        this.errors =
          error.response?.data?.errors || error.response?.data || error.message;
        throw error;
      } finally {
        this.isSubmitting = false;
      }
    },

    async traiterReclamation(reclamationId, data) {
      this.isSubmitting = true;
      this.errors = null;
      try {
        const response = await axios.post(
          `/reclamations/${reclamationId}/traiter`,
          data,
          this.authHeaders(),
        );
        const updatedReclamation = response.data.data || response.data;
        const index = this.reclamations.findIndex(
          (r) => r.id === reclamationId,
        );
        if (index !== -1) {
          this.reclamations[index] = updatedReclamation;
        }
        if (this.reclamationDetail?.id === reclamationId) {
          this.reclamationDetail = updatedReclamation;
        }
        return updatedReclamation;
      } catch (error) {
        this.errors = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.isSubmitting = false;
      }
    },

    async annulerReclamation(reclamationId) {
      this.isDeleting = true;
      this.errors = null;
      try {
        const response = await axios.delete(
          `/reclamations/${reclamationId}/annuler`, // AJOUT DE /api/
          this.authHeaders(),
        );
        this.reclamations = this.reclamations.filter(
          (r) => r.id !== reclamationId,
        );
        if (this.reclamationDetail?.id === reclamationId) {
          this.reclamationDetail = null;
        }
        return response.data;
      } catch (error) {
        this.errors = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.isDeleting = false;
      }
    },
  },
});
