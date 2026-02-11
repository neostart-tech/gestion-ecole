import { defineStore } from "pinia";
import axios from "axios";

export const useAdvertiserStore = defineStore("advertiser", {
  state: () => ({
    advertisers: [],
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

    async fetchAdvertisers() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/partenaires/liste",
          this.authHeaders(),
        );
        this.advertisers = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des annonceurs:", error);
      }
      this.isLoading = false;
    },

    async addAdvertiser(advertiserData) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/partenaires/ajouter",
          advertiserData,
          this.authHeaders(),
        );
        this.advertisers = [...this.advertisers, response.data.data];
      } catch (error) {
        console.error("Erreur ajout d'un annonceur:", error);
      }
      this.isLoading = false;
    },

    async updateAdvertiser(advertiserData,slug) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/partenaires/${slug}/supprimer`,
          advertiserData,
          this.authHeaders(),
        );
        this.advertisers = response.data.data;
      } catch (error) {
        console.error("Erreur modification d'un annonceur:", error);
      }
      this.isLoading = false;
    },

    async deleteAdvertiser(advertiserId) {
      this.isLoading = true;
      try {
        const response = await axios.delete(
          `/advertisers/${advertiserId}`,
          this.authHeaders(),
        );
        this.advertisers = this.advertisers.filter(
          (advertiser) => advertiser.id !== advertiserId,
        );
      } catch (error) {
        console.error("Erreur lors de la suppression d'un annonceur:", error);
      }
      this.isLoading = false;
    },
  },
});
