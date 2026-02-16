import { defineStore } from "pinia";
import axios from "axios";

export const useAnneScolaireStore = defineStore("annee-scolaire", {
  state: () => ({
    annneescolaires: [],
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
    async fetchAnneeScolaire() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/annee-scolaire/liste",
          this.authHeaders(),
        );

        this.annneescolaires = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des années scolaires:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async addAnneeScolaire(paylaod) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/annee-scolaire/create",
          paylaod,
          this.authHeaders(),
        );

        this.annneescolaires = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des années scolaires:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async updateAnneeScolaire(paylaod, annee) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/annee-scolaire/${annee}/update`,
          paylaod,
          this.authHeaders(),
        );

        this.annneescolaires = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des années scolaires:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async activerAnneeScolaire(id) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/annee-scolaire/${id}/activate`,
          null,
          this.authHeaders(),
        );

        this.annneescolaires = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des annees scolaires:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async desactiverAnneeScolaire(id) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/annee-scolaire/${id}/desactivate`,
          null,
          this.authHeaders(),
        );

        this.annneescolaires = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des annees scolaires:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
