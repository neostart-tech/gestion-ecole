import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [],
    enseignants:[],
    enseignant:null,
    user:null,
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
    async fetchUsersEnseignant() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/users/liste-des-enseignants",
          this.authHeaders()
        );

        this.enseignants = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des enseignants:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
      async fetchUsers() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/users/liste",
          this.authHeaders()
        );

        this.enseignants = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des enseignants:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    
    async addUser(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/users/create",
          payload,
          this.authHeaders()
        );

        this.users.push(response.data.data ?? response.data);
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

   
    async deleteUser(id) {
      this.isLoading = true;
      try {
        await axios.delete(
          `/users/delete`,
          this.authHeaders()
        );

        this.filieres = this.filieres.filter(
          (f) => f.id !== filiereId
        );
      } finally {
        this.isLoading = false;
      }
    },

    async updateFiliere(filiereId, updatedData) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/filieres/${filiereId}/modifier`,
          updatedData,
          this.authHeaders()
        );

        const index = this.filieres.findIndex(
          (f) => f.id === filiereId
        );

        if (index !== -1) {
          this.filieres[index] = response.data.data ?? response.data;
        }

        return response.data;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
