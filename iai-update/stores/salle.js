import { defineStore } from "pinia";
import axios from "axios";

export const useSalleStore = defineStore("salle", {
  state: () => ({
    salles: [],
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
    async fetchSalles() {
      this.isLoading = true;
      try {
        const response = await axios.get("/salles/liste", this.authHeaders());

        this.salles = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des salles:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async addSalle(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/salles/ajouter-une-salle",
          payload,
          this.authHeaders(),
        );

        this.salles.push(response.data.data ?? response.data);
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteSalle(id) {
      this.isLoading = true;
      try {
        await axios.delete(
          `/salles/${id}/supprimer-une-salle`,
          this.authHeaders(),
        );

        this.salles = this.salles.filter((f) => f.id !== id);
      } finally {
        this.isLoading = false;
      }
    },

    async updateSalle(payload) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/salles/ajouter-une-salle`,
          payload,
          this.authHeaders(),
        );
        this.salles.push(response.data.data ?? response.data);

        return response.data;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
