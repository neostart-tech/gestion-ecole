import { defineStore } from "pinia";
import axios from "axios";

export const useReleveNoteStore = defineStore("releve de note", {
  state: () => ({
    releves: [],
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
    async fetchReleveNotes() {
      this.isLoading = true;
      try {
        const response = await axios.get("/roles/liste", this.authHeaders());

        this.releves = response.data.data;
      } catch (error) {
        console.error("Erreur chargement roles:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async GenererReleveNotes(etudiant, payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          `/releves-de-note/${etudiant}/generer-releve-de-note`,
          payload,
          this.authHeaders(),
        );

        this.releves = response.data.data;
      } catch (error) {
        console.error("Erreur chargement releves:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async getReleveNotes(etudiant) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/releves-de-note/${etudiant}/get-releve-de-note`,
          this.authHeaders(),
        );

        this.releves = response.data.data;
      } catch (error) {
        console.error("Erreur chargement releves:", error);
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
