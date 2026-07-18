
import { defineStore } from "pinia";
import axios from "axios";

export const useRoleStore = defineStore("role", {
  state: () => ({
    roles: [],
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
    async fetchRoles() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/roles/liste",
          this.authHeaders()
        );

        this.roles = response.data.data;
      } catch (error) {
        console.error("Erreur chargement roles:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

   
    // async addFiliere(filiereData) {
    //   this.isLoading = true;
    //   try {
    //     const response = await axios.post(
    //       "/filieres/ajouter-une-filiere",
    //       filiereData,
    //       this.authHeaders()
    //     );

    //     this.filieres.push(response.data.data ?? response.data);
    //     return response.data;
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },

   
    // async deleteFiliere(filiereId) {
    //   this.isLoading = true;
    //   try {
    //     await axios.delete(
    //       `/filieres/${filiereId}/supprimer`,
    //       this.authHeaders()
    //     );

    //     this.filieres = this.filieres.filter(
    //       (f) => f.id !== filiereId
    //     );
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },

    // async updateFiliere(filiereId, updatedData) {
    //   this.isLoading = true;
    //   try {
    //     const response = await axios.put(
    //       `/filieres/${filiereId}/modifier`,
    //       updatedData,
    //       this.authHeaders()
    //     );

    //     const index = this.filieres.findIndex(
    //       (f) => f.id === filiereId
    //     );

    //     if (index !== -1) {
    //       this.filieres[index] = response.data.data ?? response.data;
    //     }

    //     return response.data;
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },
  },
});
