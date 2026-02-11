import { defineStore } from "pinia";
import axios from "axios";

export const useEtudiantStore = defineStore("etudiant", {
  state: () => ({
    etudiants: [],
    isLoading: false,
    mesevaluations: [],
    mesfichiers: [],
    mesNotes: [],
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
          this.authHeaders(),
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
        const response = await axios.get("/etudiants/export", {
          ...this.authHeaders(),
          params: params,
          responseType: "blob", // Ceci est essentiel
        });
        return response; // Retourner la réponse complète
      } catch (error) {
        console.error("Erreur exportation étudiants:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchEvaluationsEtudiant() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/espace-etudiant/evaluation/liste",
          this.authHeaders(),
        );
        this.mesevaluations = response.data.data;
      } catch (error) {
        console.error(
          "Erreur lors du chargement des évaluations de l'étudiant:",
          error,
        );
      } finally {
        this.isLoading = false;
      }
    },

    async fetchEtudiantFichier() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/espace-etudiant/mes-fichiers",
          this.authHeaders(),
        );
        this.mesfichiers = response.data.data;
      } catch (error) {
        console.error(
          "Erreur lors du chargement des fichiers de l'étudiant:",
          error,
        );
      } finally {
        this.isLoading = false;
      }
    },
    async fetchEtudiantNote() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/espace-etudiant/mes-notes",
          this.authHeaders(),
        );
        this.mesNotes = response.data.data;
      } catch (error) {
        console.error(
          "Erreur lors du chargement des notes de l'étudiant:",
          error,
        );
      } finally {
        this.isLoading = false;
      }
    },
  },
});
