import { defineStore } from "pinia";
import axios from "axios";

export const useAdvertiserStore = defineStore("advertiser", {
  state: () => ({
    advertisers: [],
    advertiser: null,
    isLoading: false,
    message: null,
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
        this.message = null;
      } catch (error) {
        console.error("Erreur chargement des annonceurs:", error);
        this.message = error.response?.data?.message || "Erreur inconnue";
      }
      this.isLoading = false;
    },

    async getAdvertiser(advertiserSlug) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/partenaires/${advertiserSlug}/details`,
          this.authHeaders(),
        );
        this.advertiser = response.data.data;
        this.message = null;
      } catch (error) {
        console.error("Erreur chargement des annonceurs:", error);
        this.message = error.response?.data?.message || "Erreur inconnue";
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
        this.message = "Partenaire ajouté avec succès";

        return response.data;
      } catch (error) {
        console.error("Erreur ajout d'un annonceur:", error);
        this.message = error.response?.data?.message || "Erreur inconnue";

        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateAdvertiser(advertiserData, slug) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/partenaires/${slug}/update`,
          advertiserData,
          this.authHeaders(),
        );
        this.advertisers = response.data.data;
        this.message = "Partenaire mis à jour avec succès";
      } catch (error) {
        console.error("Erreur modification d'un annonceur:", error);
        this.message = error.response?.data?.message || "Erreur inconnue";
      }
      this.isLoading = false;
    },

    async deleteAdvertiser(advertiserId) {
      this.isLoading = true;
      try {
        const response = await axios.delete(
          `/partenaires/${advertiserId}/delete`,
          this.authHeaders(),
        );
        this.advertisers = this.advertisers.filter(
          (advertiser) => advertiser.id !== advertiserId,
        );
        this.message = "Partenaire supprimé avec succes";
      } catch (error) {
        this.message = error.response?.data?.message || "Erreur inconnue";
        console.error("Erreur lors de la suppression d'un annonceur:", error);
      }
      this.isLoading = false;
    },
  },
});
