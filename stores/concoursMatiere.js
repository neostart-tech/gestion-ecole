import { defineStore } from "pinia";
import axios from "axios";

export const useConcoursMatiereStore = defineStore("concoursMatiere", {
  state: () => ({
    matieres: [],
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
    async fetchMatieres() {
      this.isLoading = true;
      try {
        const response = await axios.get("/concours-matiere/liste", this.authHeaders());
        this.matieres = response.data.data || response.data;
        return this.matieres;
      } catch (error) {
        console.error("Erreur chargement du catalogue des matières:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async addMatiere(form) {
      this.isLoading = true;
      try {
        const response = await axios.post("/concours-matiere/ajouter", form, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur ajout d'une matière:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async updateMatiere(id, form) {
      this.isLoading = true;
      try {
        const response = await axios.put(`/concours-matiere/${id}/modifier`, form, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur modification d'une matière:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteMatiere(id) {
      this.isLoading = true;
      try {
        const response = await axios.delete(`/concours-matiere/${id}/supprimer`, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur suppression d'une matière:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
