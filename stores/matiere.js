import { defineStore } from "pinia";
import axios from "axios";

export const useMatiereStore = defineStore("matiere", {
  state: () => ({
    matieres: [],
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
    
    async fetchMatieres() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/matieres/liste",
          this.authHeaders()
        );

        this.matieres = response.data.data;
        return this.matieres;
      } catch (error) {
        console.error("Erreur chargement des matières:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async addMatiere(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/matieres/ajouter",
          payload,
          this.authHeaders()
        );

        this.matieres.push(response.data.data ?? response.data);
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

    async updateMatiere(id, payload) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/matieres/${id}/modifier`,
          payload,
          this.authHeaders()
        );

        const index = this.matieres.findIndex((f) => f.id === id);
        if (index !== -1) {
          this.matieres[index] = response.data.data ?? response.data;
        }

        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteMatiere(id) {
      this.isLoading = true;
      try {
        await axios.delete(
          `/matieres/${id}/supprimer`,
          this.authHeaders()
        );

        this.matieres = this.matieres.filter((f) => f.id !== id);
      } finally {
        this.isLoading = false;
      }
    }
  },
});
