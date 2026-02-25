import { defineStore } from "pinia";
import axios from "axios";

export const useFraisStore = defineStore("frais de scolarité", {
  state: () => ({
    frais: [],
    isLoading: false,
  }),

//    getters: {
//     nombreFiliere: (state) => state.filieres.length,
//   },

  actions: {
    authHeaders() {
      const token = localStorage.getItem("gest-ecole-token");

      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
    },
    async fetchFrais() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/frais/index",
          this.authHeaders()
        );

        this.frais = response.data.data;
      } catch (error) {
        console.error("Erreur chargement frais de scolarité:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async addFrais(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/frais/payer",
          payload,
        );

        this.frais.push(response.data.data ?? response.data);
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

   
    async deleteFrais(fraisId) {
      this.isLoading = true;
      try {
        await axios.delete(
          `/frais/destroy/${fraisId}`,
          this.authHeaders()
        );

        this.frais = this.frais.filter(
          (f) => f.id !== fraisId
        );
      } finally {
        this.isLoading = false;
      }
    },

    async updateFrais(fraisId, updatedData) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/frais/update/${fraisId}`,
          updatedData,
          this.authHeaders()
        );

        const index = this.frais.findIndex(
          (f) => f.id === fraisId
        );

        if (index !== -1) {
          this.frais[index] = response.data.data ?? response.data;
        }

        return response.data;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
