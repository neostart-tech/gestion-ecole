import { defineStore } from "pinia";
import axios from "axios";

export const useAnneScolaireStore = defineStore("annee-scolaire", {
  state: () => ({
    annneescolaires: [],
    isLoading: false,
  }),

  getters: {
    activeAnnee: (state) => state.annneescolaires.find((a) => a.active === true || a.active === 1),
    annees: (state) => state.annneescolaires,
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
    async fetchAnneeScolaire() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/annee-scolaire/liste",
          this.authHeaders(),
        );

        this.annneescolaires = response.data.data || response.data || [];
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

    async fetchCalendrier(anneeId) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/annee-scolaire/${anneeId}/calendrier`,
          this.authHeaders()
        );
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

    async saveCalendrier(anneeId, payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          `/annee-scolaire/${anneeId}/calendrier/save`,
          payload,
          this.authHeaders()
        );
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteCalendrierEntry(anneeId, entryId) {
      this.isLoading = true;
      try {
        const response = await axios.delete(
          `/annee-scolaire/${anneeId}/calendrier/${entryId}`,
          this.authHeaders()
        );
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

  },
});
