// stores/blog.js
import { defineStore } from "pinia";
import axios from "axios";

export const useUrgentInfoStore = defineStore("urgent info", {
  state: () => ({
    urgentinfos: [],
    urgentinfo: null,
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

    async fetchUrgentInfos() {
      this.isLoading = true;
      try {
        const response = await axios.get("/informations-urgentes/liste", {
          ...this.authHeaders(),
        });
        this.urgentinfos = response.data.data || response.data;

        return response.data;
      } catch (error) {
        console.error("Erreur chargement des informations urgentes:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUrgentInfo(urgent) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/informations-urgentes/${urgent}/show`,
          this.authHeaders(),
        );

        this.urgentinfo = response.data.data || response.data;
        return this.urgentinfo;
      } catch (error) {
        console.error(`Erreur chargement du blog ${urgent}:`, error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async createUrgentInfo(formData) {
      this.isLoading = true;
      try {
        if (!(formData instanceof FormData)) {
          console.error("formData n'est pas une instance de FormData");
          throw new Error("Les données doivent être au format FormData");
        }

        const response = await axios.post(
          "/informations-urgentes/ajouter",
          formData,
          this.multipartHeaders(),
        );

        const newInfoUrgent = response.data.data || response.data;
        this.urgentinfos = [newInfoUrgent, ...this.urgentinfos];

        return newInfoUrgent;
      } catch (error) {
        console.error("Erreur création des informations urgentes:", error);

        // Afficher les erreurs de validation
        if (error.response?.data?.errors) {
          console.error("Erreurs de validation:", error.response.data.errors);
        }

        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateUrgentInfo(id, formData) {
      this.isLoading = true;
      try {
        if (!(formData instanceof FormData)) {
          console.error("formData n'est pas une instance de FormData");
          throw new Error("Les données doivent être au format FormData");
        }

        formData.append("_method", "PUT");

        const response = await axios.post(
          `/informations-urgentes/${id}/modifier`,
          formData,
          this.multipartHeaders(),
        );

        const updatedInfoUrgent = response.data.data || response.data;
        const index = this.urgentinfos.findIndex((b) => b.id === id);
        if (index !== -1) {
          this.urgentinfos[index] = updatedInfoUrgent;
        }

        if (this.urgentinfo && this.urgentinfo.id === id) {
          this.urgentinfo = updatedInfoUrgent;
        }

        return updatedInfoUrgent;
      } catch (error) {
        console.error(`Erreur mise à jour du blog ${id}:`, error);
        if (error.response?.data?.errors) {
          console.error("Erreurs de validation:", error.response.data.errors);
        }
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteUrgentInfo(id) {
      this.isLoading = true;
      try {
        const response = await axios.delete(
          `/informations-urgentes/${id}/supprimer`,
          this.authHeaders(),
        );

        this.urgentinfos = this.urgentinfos.filter((b) => b.id !== id);

        if (this.urgentinfo && this.urgentinfo.id === id) {
          this.urgentinfo = null;
        }

        return response.data;
      } catch (error) {
        console.error(`Erreur suppression du blog ${id}:`, error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async publishUrgentInfo(id) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          `/informations-urgentes/${id}/publier`,
          null,
          this.authHeaders(),
        );
        return response.data;
      } catch (error) {
        console.error(
          `Erreur publication de l'information urgente ${id}:`,
          error,
        );
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async unPublishUrgentInfo(id) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          `/informations-urgentes/${id}/depublier`,
          null,
          this.authHeaders(),
        );
        return response.data;
      } catch (error) {
        console.error(
          `Erreur publication de l'information urgente ${id}:`,
          error,
        );
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
