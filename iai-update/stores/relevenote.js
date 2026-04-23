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
    async fetchGlobalReleves(params = {}) {
      this.isLoading = true;
      try {
        const response = await axios.get("/releves-de-note/liste", {
          ...this.authHeaders(),
          params
        });
        return response.data;
      } catch (error) {
        console.error("Erreur chargement global relevés:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async checkRelevesStatus(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/releves-de-note/check-statuses",
          payload,
          this.authHeaders()
        );
        return response.data;
      } catch (error) {
        console.error("Erreur vérification statuts relevés:", error);
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

        // Recharger la liste complète pour que l'UI soit à jour
        await this.getReleveNotes(etudiant);
        
        return response.data.releve;
      } catch (error) {
        console.error("Erreur génération relevé:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async BulkGenerateReleveNotes(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          '/releves-de-note/bulk-generate',
          payload,
          this.authHeaders(),
        );
        return response.data;
      } catch (error) {
        console.error("Erreur génération groupée:", error);
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

        this.releves = response.data.data || [];
      } catch (error) {
        console.error("Erreur chargement releves:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteReleveNote(releveId) {
      this.isLoading = true;
      try {
        await axios.delete(
          `/releves-de-note/${releveId}/supprimer`,
          this.authHeaders(),
        );
        this.releves = this.releves.filter((r) => r.id !== releveId);
      } catch (error) {
        console.error("Erreur suppression relevé:", error);
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
