import { defineStore } from "pinia";
import axios from "axios";

export const useMoyenConnaissanceStore = defineStore("moyenConnaissance", {
  state: () => ({
    moyensConnaissance: [],
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
    async fetchMoyensConnaissance() {
      this.isLoading = true;
      try {
        const response = await axios.get("/moyens-connaissance", this.authHeaders());
        this.moyensConnaissance = response.data.data || response.data;
      } catch (error) {
        console.error("Erreur chargement des moyens de connaissance:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async addMoyenConnaissance(form) {
      this.isLoading = true;
      try {
        const response = await axios.post("/moyens-connaissance", form, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur ajout du moyen de connaissance:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async updateMoyenConnaissance(id, form) {
      this.isLoading = true;
      try {
        const response = await axios.put(`/moyens-connaissance/${id}`, form, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur modification du moyen de connaissance:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteMoyenConnaissance(id) {
      this.isLoading = true;
      try {
        const response = await axios.delete(`/moyens-connaissance/${id}`, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur suppression du moyen de connaissance:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
