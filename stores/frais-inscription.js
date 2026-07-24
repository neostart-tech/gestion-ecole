import { defineStore } from "pinia";
import axios from "axios";

export const useFraisInscriptionStore = defineStore("fraisInscription", {
  state: () => ({
    frais: [],
    isLoading: false,
    error: null
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

    async fetchFrais() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/frais-inscription/index",
          this.authHeaders()
        );
        this.frais = response.data.data;
      } catch (error) {
        console.error("Erreur chargement frais d'inscription:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async addFrais(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/frais-inscription/payer",
          payload,
          this.authHeaders()
        );
        const newItem = response.data.data ?? response.data;
        this.frais.unshift(newItem);
        return response.data;
      } catch (error) {
        console.error("Erreur d'ajout frais d'inscription:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateFrais(id, updatedData) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/frais-inscription/update/${id}`,
          updatedData,
          this.authHeaders()
        );
        const index = this.frais.findIndex((f) => f.id === id);
        if (index !== -1) {
          this.frais[index] = response.data.data ?? response.data;
        }
        return response.data;
      } catch (error) {
        console.error("Erreur modification frais d'inscription:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async activateFrais(id) {
      this.isLoading = true;
      try {
        await axios.put(
          `/frais-inscription/activate/${id}`,
          null,
          this.authHeaders()
        );
        // On met à jour l'état localement : tout le monde à false excepté celui-là
        this.frais = this.frais.map((f) => ({
          ...f,
          active: f.id === id
        }));
      } catch (error) {
        console.error("Erreur activation frais d'inscription:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteFrais(id) {
      this.isLoading = true;
      try {
        await axios.delete(
          `/frais-inscription/destroy/${id}`,
          this.authHeaders()
        );
        this.frais = this.frais.filter((f) => f.id !== id);
      } catch (error) {
        console.error("Erreur suppression frais d'inscription:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
