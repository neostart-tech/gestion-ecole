import { defineStore } from "pinia";
import axios from "axios";

export const usePlanPaiementStore = defineStore("planPaiement", {
  state: () => ({
    plansPaiement: [],
    planPaiement: null,
    isLoading: false,
  }),

  actions: {
    authHeaders() {
      const token = localStorage.getItem("gest-ecole-token");

      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json", 
        },
      };
    },

    async fetchPlansPaiement() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/plan-de-paiement/liste",  
          this.authHeaders(),
        );

        this.plansPaiement = response.data.data; 
        return response.data;
      } catch (error) {
        console.error("Erreur chargement des plans de paiement:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchPlanPaiement(planId) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/plan-de-paiement/${planId}`,
          this.authHeaders(),
        );

        this.planPaiement = response.data.data; 
        return response.data;
      } catch (error) {
        console.error("Erreur chargement du plan de paiement:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async addPlanPaiement(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/plan-de-paiement/store",
          payload,
          this.authHeaders(),
        );

        this.plansPaiement.push(response.data.data ?? response.data);
        return response.data;
      } catch (error) {
        console.error("Erreur ajout plan de paiement:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deletePlanPaiement(planId) {
      this.isLoading = true;
      try {
        await axios.delete(
          `/plan-de-paiement/${planId}/delete`,
          this.authHeaders(),
        );

        this.plansPaiement = this.plansPaiement.filter((p) => p.id !== planId);
      } catch (error) {
        console.error("Erreur suppression plan de paiement:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updatePlanPaiement(planId, payload) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/plan-de-paiement/${planId}/update`,
          payload,
          this.authHeaders(),
        );

        const index = this.plansPaiement.findIndex((f) => f.id === planId);

        if (index !== -1) {
          this.plansPaiement[index] = response.data.data ?? response.data;
        }

        return response.data;
      } catch (error) {
        console.error("Erreur mise à jour plan de paiement:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
