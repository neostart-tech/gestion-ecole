import { defineStore } from "pinia";
import axios from "axios";

export const useUvStore = defineStore("uv", {
  state: () => ({
    uvs: [],
    uv:{},
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
    async fetchUv() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/unites-de-valeur/liste",
          this.authHeaders()
        );

        this.uvs = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des unités des matieres:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    //  async getUe(id) {
    //   this.isLoading = true;
    //   try {
    //     const response = await axios.get(
    //       `/unites-d-enseignement/${id}/a-propos`,
    //       this.authHeaders()
    //     );

    //     this.ue = response.data.data;
    //   } catch (error) {
    //     console.error("Erreur chargement de l'unité d'enseignement:", error);
    //     throw error;
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },

 
    async addUv(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/unites-de-valeur/ajouter-une-matiere",
          payload,
          this.authHeaders()
        );

        this.uvs.push(response.data.data ?? response.data);
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

   
    async deleteUv(uv) {
      this.isLoading = true;
      try {
        await axios.delete(
          `/unites-de-valeur/${uv}/supprimer`,
          this.authHeaders()
        );

        this.uvs = this.uvs.filter(
          (f) => f.id !== uv
        );
      } finally {
        this.isLoading = false;
      }
    },

    async updateUv(id, payload) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/unites-de-valeur/${id}/modifier`,
          payload,
          this.authHeaders()
        );

        const index = this.uvs.findIndex(
          (f) => f.id === id
        );

        if (index !== -1) {
          this.uvs[index] = response.data.data ?? response.data;
        }

        return response.data;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
