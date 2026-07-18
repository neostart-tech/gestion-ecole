import { defineStore } from "pinia";
import axios from "axios";

export const useGalerieStore = defineStore("galerie", {
  state: () => ({
    galeriesalbum: [],
    galeriesphoto: [],
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
    async fetchGalerieAlbum() {
      this.isLoading = true;
      try {
        const response = await axios.get("/galerie/albums", this.authHeaders());

        this.galeriesalbum = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des groupes:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchGaleriePhoto() {
      this.isLoading = true;
      try {
        const response = await axios.get("/galerie/photos", this.authHeaders());

        this.galeriesphoto = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des groupes:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async GroupDisplayCalendar(group) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/groups/${group}/emploi-du-temps`,
          this.authHeaders(),
        );

        this.programmes = response.data.data;
      } catch (error) {
        console.error("Erreur chargement du programme de la salle:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchGroupEtudiants(id) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/groups/${id}/liste-des-etudiants`,
          this.authHeaders(),
        );

        this.etudiants = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des étudiants du groupe:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async getMatiere(group) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/groups/${group}/get-matieres`,
          this.authHeaders(),
        );

        this.matieres = response.data.data;
      } catch (error) {
        a;
        console.error("Erreur chargement des matières du groupe:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async addGroupe(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/groups/ajouter",
          payload,
          this.authHeaders(),
        );

        this.groupes.push(response.data.data ?? response.data);
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteGroupe(id) {
      this.isLoading = true;
      try {
        await axios.delete(`/groups/${id}/supprimer`, this.authHeaders());

        this.groupes = this.groupes.filter((f) => f.id !== id);
      } finally {
        this.isLoading = false;
      }
    },

    async updateGroupe(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          `/groups/ajouter`,
          payload,
          this.authHeaders(),
        );

        return response.data;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
