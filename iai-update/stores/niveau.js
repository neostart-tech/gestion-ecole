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

        this.niveaux = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des niveaux:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

  },
});
