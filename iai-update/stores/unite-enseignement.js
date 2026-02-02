import { defineStore } from "pinia";
import axios from "axios";

export const useUeStore = defineStore("ue", {
  state: () => ({
    ues: [],
    ue:{},
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
    async fetchUe() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/unites-d-enseignement/liste ",
          this.authHeaders()
        );

        this.ues = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des unités d'enseignement:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

     async getUe(id) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/unites-d-enseignement/${id}/a-propos`,
          this.authHeaders()
        );

        this.ue = response.data.data;
      } catch (error) {
        console.error("Erreur chargement de l'unité d'enseignement:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

 
    async addUe(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/unites-d-enseignement/ajouter-une-ue",
          payload,
          this.authHeaders()
        );

        this.ues.push(response.data.data ?? response.data);
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

   
    async deleteUe(ue) {
      this.isLoading = true;
      try {
        await axios.delete(
          `/unites-d-enseignement/${ue}/supprimer`,
          this.authHeaders()
        );

        this.ues = this.ues.filter(
          (f) => f.id !== ue
        );
      } finally {
        this.isLoading = false;
      }
    },

    async updateUe(id, payload) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/unites-d-enseignement/${id}/modifier`,
          payload,
          this.authHeaders()
        );

        const index = this.ues.findIndex(
          (f) => f.id === id
        );

        if (index !== -1) {
          this.ues[index] = response.data.data ?? response.data;
        }

        return response.data;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
