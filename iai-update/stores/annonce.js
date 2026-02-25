// stores/annonce.js
import { defineStore } from "pinia";
import axios from "axios";

export const useAnnonceStore = defineStore("annonce", {
  state: () => ({
    annonces: [],
    mesannonces: [],
    annonce: null,
    mesdepots: [],
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

    // Headers pour l'upload de fichiers
    multipartHeaders() {
      const token = localStorage.getItem("gest-ecole-token");
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
        },
      };
    },

    async fetchAnnonces() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/opportunites/liste",
          this.authHeaders()
        );
        this.annonces = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des annonces:", error);
      }
      this.isLoading = false;
    },

    async addAnnonce(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/opportunites/ajouter",
          payload,
          this.authHeaders()
        );
        this.annonces = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des annonces:", error);
      }
      this.isLoading = false;
    },

    async deleteAnnonce(announcement) {
      this.isLoading = true;
      try {
        const response = await axios.delete(
          `/opportunites/${announcement}/supprimer`,
          this.authHeaders()
        );
        this.annonces = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des annonces:", error);
      }
      this.isLoading = false;
    },

    async updateAnnonce(announcement, payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          `/opportunites/${announcement}/mettre-a-jour`,
          payload,
          this.authHeaders()
        );
        this.annonces = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des annonces:", error);
      }
      this.isLoading = false;
    },

    async PublierAnnonce(announcement) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/opportunites/${announcement}/publier`,
          this.authHeaders()
        );
        this.annonces = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des annonces:", error);
      }
      this.isLoading = false;
    },

    async fetchAnnoncesEtudiant() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/etudiant/annonces/liste",
          this.authHeaders()
        );
        this.mesannonces = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des annonces:", error);
      }
      this.isLoading = false;
    },

    async fetchMesDepots() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/etudiant/annonces/mes-depots",
          this.authHeaders()
        );
        this.mesdepots = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des annonces:", error);
      }
      this.isLoading = false;
    },

    async fetchAnnonceDetail(announcement) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/etudiant/annonces/${announcement}/details`,
          this.authHeaders()
        );
        this.annonce = response.data.data;
      } catch (error) {
        console.error(
          "Erreur lors du chargement des détails de l'annonce:",
          error
        );
      }
      this.isLoading = false;
    },

    // MODIFICATION ICI : Pour l'envoi de fichiers
    async postulerAnnonce(announcement, formData) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          `/etudiant/annonces/${announcement}/postuler-a-une-offre`,
          formData,
          this.multipartHeaders() // Utilisation des headers multipart
        );
        
        // Mise à jour des données si nécessaire
        if (response.data.data) {
          // Traiter la réponse
        }
        
        return response.data;
      } catch (error) {
        console.error("Erreur lors de la postulation à l'annonce:", error);
        throw error; // Important pour la gestion d'erreur dans le composant
      } finally {
        this.isLoading = false;
      }
    },
  },
});