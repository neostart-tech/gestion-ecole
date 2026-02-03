import { defineStore } from "pinia";
import axios from "axios";

export const usePeriodeStore = defineStore("periode", {
  state: () => ({
    periodes: [],
    periode:[],
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
    async fetchPeriode() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/decoupage-academique/liste",
          this.authHeaders()
        );

        this.periodes = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des périodes:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async fetchPeriodeByYear() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/decoupage-academique/periode-by-year",
          this.authHeaders()
        );

        this.periode = response.data.data;
      } catch (error) {
        console.error("Erreur chargement de la période:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async addPeriode(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/decoupage-academique/ajouter-un-decoupage",
          payload,
          this.authHeaders()
        );

        this.periodes.push(response.data.data ?? response.data);
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

   
    async deletePeriode(periodeId) {
      this.isLoading = true;
      try {
        await axios.delete(
          `/decoupage-academique/${periodeId}/supprimer`,
          this.authHeaders()
        );

        this.periodes = this.periodes.filter(
          (p) => p.id !== periodeId
        );
      } finally {
        this.isLoading = false;
      }
    },

    async updatePeriode(periodeId, payload) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/decoupage-academique/${periodeId}/modifier`,
          payload,
          this.authHeaders()
        );

        const index = this.periodes.findIndex(
          (f) => f.id === periodeId
        );

        if (index !== -1) {
          this.periodes[index] = response.data.data ?? response.data;
        }

        return response.data;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
