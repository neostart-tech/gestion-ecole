import { defineStore } from "pinia";
import axios from "axios";

export const useTypeDiplomeStore = defineStore("typeDiplome", {
  state: () => ({
    typesDiplome: [],
    champsDisponibles: {},
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
    async fetchTypesDiplome() {
      this.isLoading = true;
      try {
        const response = await axios.get("/type-diplomes", this.authHeaders());
        this.typesDiplome = response.data.data || response.data;
      } catch (error) {
        console.error("Erreur chargement des types de diplôme:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async fetchChampsDisponibles() {
      try {
        const response = await axios.get(
          "/type-diplomes/champs-disponibles",
          this.authHeaders()
        );
        this.champsDisponibles = response.data;
        return response.data;
      } catch (error) {
        console.error("Erreur chargement des champs disponibles:", error);
        throw error;
      }
    },
    async addTypeDiplome(form) {
      this.isLoading = true;
      try {
        const response = await axios.post("/type-diplomes", form, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur ajout du type de diplôme:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async updateTypeDiplome(id, form) {
      this.isLoading = true;
      try {
        const response = await axios.put(`/type-diplomes/${id}`, form, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur modification du type de diplôme:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteTypeDiplome(id) {
      this.isLoading = true;
      try {
        const response = await axios.delete(`/type-diplomes/${id}`, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur suppression du type de diplôme:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
