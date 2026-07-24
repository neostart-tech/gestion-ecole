import { defineStore } from "pinia";
import axios from "axios";

export const useTranchePaiement = defineStore("tranchepaiement", {
  state: () => ({
    tranchespaiement: [],
    tranchepaiement: null,
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

    async fetchTranchePaiement(frais) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/tranche-de-paiement/${frais}`,  
          this.authHeaders(),
        );

        this.tranchepaiement = response.data.data; 
        return response.data;
      } catch (error) {
        console.error("Erreur chargement des tranches de paiement:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchTranchesPaiement() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          '/tranche-de-paiement/liste',
          this.authHeaders(),
        );

        this.tranchespaiement = response.data.data; 
        return response.data;
      } catch (error) {
        console.error("Erreur chargement des tranches de paiement:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async addTrancheDePaiement(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/tranche-de-paiement/store",
          payload,
          this.authHeaders(),
        );

        this.tranchespaiement.push(response.data.data ?? response.data);
        return response.data;
      } catch (error) {
        console.error("Erreur ajout tranche de paiement:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deletePlanPaiement(trancheId) {
      this.isLoading = true;
      try {
        await axios.delete(
          `/tranche-de-paiement/${trancheId}/delete`,
          this.authHeaders(),
        );

        this.tranchespaiement = this.tranchespaiement.filter((p) => p.id !== trancheId);
      } catch (error) {
        console.error("Erreur suppression tranche de paiement:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updatePlanPaiement(trancheId, payload) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/tranche-de-paiement/${trancheId}/update`,
          payload,
          this.authHeaders(),
        );

        const index = this.tranchespaiement.findIndex((f) => f.id === trancheId);

        if (index !== -1) {
          this.tranchespaiement[index] = response.data.data ?? response.data;
        }

        return response.data;
      } catch (error) {
        console.error("Erreur mise à jour tranche de paiement:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
