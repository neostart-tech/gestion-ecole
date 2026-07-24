import { defineStore } from "pinia";
import axios from "axios";

export const useJourFerieStore = defineStore("jour-ferie", {
  state: () => ({
    joursFeries: [],
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

    async fetchJoursFeries() {
      this.isLoading = true;
      try {
        const response = await axios.get("/jours-feries/liste", this.authHeaders());
        this.joursFeries = response.data.data;
        return response.data.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des jours fériés:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async createJourFerie(data) {
      this.isLoading = true;
      try {
        const response = await axios.post("/jours-feries/ajouter", data, this.authHeaders());
        await this.fetchJoursFeries();
        return response.data.data;
      } catch (error) {
        console.error("Erreur lors de la création du jour férié:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateJourFerie(slug, data) {
      this.isLoading = true;
      try {
        const response = await axios.put(`/jours-feries/${slug}/modifier`, data, this.authHeaders());
        await this.fetchJoursFeries();
        return response.data.data;
      } catch (error) {
        console.error("Erreur lors de la modification du jour férié:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteJourFerie(slug) {
      this.isLoading = true;
      try {
        await axios.delete(`/jours-feries/${slug}/supprimer`, this.authHeaders());
        await this.fetchJoursFeries();
      } catch (error) {
        console.error("Erreur lors de la suppression du jour férié:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
