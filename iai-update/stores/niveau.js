import { defineStore } from "pinia";
import axios from "axios";

export const useNiveauStore = defineStore("niveau", {
  state: () => ({
    niveaux: [],
    isLoading: false,
  }),

  actions: {
    authHeaders() {
      const token = localStorage.getItem("gest-ecole-token");

      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
    },
    async fetchNiveaux() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/niveau/liste",
          this.authHeaders()
        );

        this.niveaux = response.data.data || response.data;
      } catch (error) {
        console.error("Erreur chargement des niveaux:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async addNiveau(form) {
      this.isLoading = true;
      try {
        const response = await axios.post("/niveau/ajouter", form, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur ajout du niveau:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async updateNiveau(id, form) {
      this.isLoading = true;
      try {
        const response = await axios.put(`/niveau/${id}/modifier`, form, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur modification du niveau:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async toggleNiveauStatus(id) {
      this.isLoading = true;
      try {
        const response = await axios.patch(`/niveau/${id}/toggle-status`, {}, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur basculement statut niveau:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async fetchNiveauPeriodes(id) {
      this.isLoading = true;
      try {
        const response = await axios.get(`/niveau/${id}/periodes`, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur chargement des périodes du niveau:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async assignPeriodesToNiveau(id, periodeIds) {
      this.isLoading = true;
      try {
        const response = await axios.post(`/niveau/${id}/assign-periodes`, { periode_ids: periodeIds }, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur lors de l'assignation des périodes:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async fetchDocumentRequirements(id) {
      try {
        const response = await axios.get(`/niveau/${id}/documents`, this.authHeaders());
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async addDocumentRequirement(id, form) {
      try {
        const response = await axios.post(`/niveau/${id}/documents`, form, this.authHeaders());
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateDocumentRequirement(docId, form) {
      try {
        const response = await axios.put(`/niveau/documents/${docId}`, form, this.authHeaders());
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteDocumentRequirement(docId) {
      try {
        const response = await axios.delete(`/niveau/documents/${docId}`, this.authHeaders());
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  },
});
