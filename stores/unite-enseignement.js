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
      const token = localStorage.getItem("gest-ecole-token");

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

   
    async deleteUe(ueOrSlug) {
      const slug = typeof ueOrSlug === "object" ? (ueOrSlug.slug || ueOrSlug.id) : ueOrSlug;
      this.isLoading = true;
      try {
        await axios.delete(
          `/unites-d-enseignement/${slug}/supprimer`,
          this.authHeaders()
        );

        this.ues = this.ues.filter(
          (f) => f.slug !== slug && f.id !== slug
        );
      } finally {
        this.isLoading = false;
      }
    },

    async updateUe(slugOrId, payload) {
      const slug = typeof slugOrId === "object" ? (slugOrId.slug || slugOrId.id) : slugOrId;
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/unites-d-enseignement/${slug}/modifier`,
          payload,
          this.authHeaders()
        );

        const index = this.ues.findIndex(
          (f) => f.slug === slug || f.id === slug
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
