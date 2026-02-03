import { defineStore } from "pinia";
import axios from "axios";

export const useEtudiantStore = defineStore("etudiant", {
  state: () => ({
    etudiants: [],
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
    async importEtudiants(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/etudiants/import",
          payload,
          this.authHeaders()
        );
        this.etudiants = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des etudiants:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
     async exportEtudiants(params = {}) {
      this.isLoading = true;
      try {
        // IMPORTANT: Ajouter responseType: 'blob' pour recevoir le fichier
        const response = await axios.get(
          "/etudiants/export",
          {
            ...this.authHeaders(),
            params: params,
            responseType: 'blob' // Ceci est essentiel
          }
        );
        return response; // Retourner la réponse complète
      } catch (error) {
        console.error("Erreur exportation étudiants:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },


   
  },
});
