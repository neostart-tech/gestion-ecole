// stores/evenement.js
import { defineStore } from "pinia";
import axios from "axios";

export const useEvenementStore = defineStore("evenement", {
  state: () => ({
    evenements: [],
    evenement: null,
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

    multipartHeaders() {
      const token = localStorage.getItem("gest-ecole-token");
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
        },
      };
    },

    async fetchEvenements() {
      this.isLoading = true;
      try {
        const response = await axios.get("/evenements", {
          ...this.authHeaders(),
        });
        this.evenements = response.data.data || response.data;
        return response.data;
      } catch (error) {
        console.error("Erreur chargement des evenements:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchEvenement(slug) {
      // Changé id en slug
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/evenements/${slug}`, // Utilisation du slug
          this.authHeaders(),
        );

        this.evenement = response.data.data || response.data;
        return this.evenement;
      } catch (error) {
        console.error(`Erreur chargement de l'événement ${slug}:`, error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async createEvenement(formData) {
      this.isLoading = true;
      try {

        const response = await axios.post(
          "/evenements",
          formData,
          this.authHeaders(),
        );

        const newEvenement = response.data.data || response.data;
        this.evenements = [newEvenement, ...this.evenements];

        return newEvenement;
      } catch (error) {
        console.error("Erreur création des événements:", error);
        if (error.response?.data?.errors) {
          console.error("Erreurs de validation:", error.response.data.errors);
        }
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateEvenement(id, formData) {
      this.isLoading = true;
      try {

        const response = await axios.put(
          `/evenements/${id}/modifier`,
          formData,
          this.authHeaders(),
        );

        const updatedEvenement = response.data.data || response.data;
        const index = this.evenements.findIndex((b) => b.id === id);
        if (index !== -1) {
          this.evenements[index] = updatedEvenement;
        }

        if (this.evenement && this.evenement.id === id) {
          this.evenement = updatedEvenement;
        }

        return updatedEvenement;
      } catch (error) {
        console.error(`Erreur mise à jour de l'evenement ${id}:`, error);
        if (error.response?.data?.errors) {
          console.error("Erreurs de validation:", error.response.data.errors);
        }
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteEvenement(id) {
      // Renommé de deleteBlog
      this.isLoading = true;
      try {
        const response = await axios.delete(
          `/evenements/${id}`,
          this.authHeaders(),
        );

        this.evenements = this.evenements.filter((b) => b.id !== id);

        if (this.evenement && this.evenement.id === id) {
          this.evenement = null;
        }

        return response.data;
      } catch (error) {
        console.error(`Erreur suppression de l'événement ${id}:`, error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async publishEvenement(id) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/evenements/${id}/toggle-status`, 
          null,
          this.authHeaders(),
        );
        return response.data;
      } catch (error) {
        console.error(`Erreur publication de l'événement ${id}:`, error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
