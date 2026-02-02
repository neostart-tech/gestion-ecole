import { defineStore } from "pinia";
import axios from "axios";

export const useFiliereStore = defineStore("filiere", {
  state: () => ({
    filieres: [],
    isLoading: false,
  }),

  actions: {
    authHeaders() {
      const token = localStorage.getItem("token");

      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
    },
    async fetchFilieres() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/filieres/liste",
          this.authHeaders()
        );

        this.filieres = response.data.data;
      } catch (error) {
        console.error("Erreur chargement filières:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // ➕ AJOUT
    async addFiliere(filiereData) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/filieres/ajouter-une-filiere",
          filiereData,
          this.authHeaders()
        );

        this.filieres.push(response.data.data ?? response.data);
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

   
    async deleteFiliere(filiereId) {
      this.isLoading = true;
      try {
        await axios.delete(
          `/filieres/${filiereId}/supprimer`,
          this.authHeaders()
        );

        this.filieres = this.filieres.filter(
          (f) => f.id !== filiereId
        );
      } finally {
        this.isLoading = false;
      }
    },

    async updateFiliere(filiereId, updatedData) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/filieres/${filiereId}/modifier`,
          updatedData,
          this.authHeaders()
        );

        const index = this.filieres.findIndex(
          (f) => f.id === filiereId
        );

        if (index !== -1) {
          this.filieres[index] = response.data.data ?? response.data;
        }

        return response.data;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
