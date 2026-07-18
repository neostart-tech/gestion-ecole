import { defineStore } from "pinia";
import axios from "axios";

export const useCandidatAuthStore = defineStore("candidatAuth", {
  state: () => ({
    candidat: null,
    expectedDocs: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    authHeaders() {
      const token = localStorage.getItem("candidat-token");

      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
    },

    isAuthenticated() {
      return !!localStorage.getItem("candidat-token");
    },

    async login(credentials) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post("/me-connecter", credentials);
        localStorage.setItem("candidat-token", response.data.token);
        localStorage.setItem("candidat-user", JSON.stringify(response.data.user));
        this.candidat = response.data.user;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur de connexion";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      this.isLoading = true;
      try {
        const response = await axios.post("/me-deconnecter", {}, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error(error);
      } finally {
        localStorage.removeItem("candidat-token");
        localStorage.removeItem("candidat-user");
        this.candidat = null;
        this.isLoading = false;
      }
    },

    async forgetPassword(credentials) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post("/mot-de-passe-oublie", credentials);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur lors de la demande";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async resetPassword(credentials) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post("/mot-de-passe-oublié", credentials);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur lors de la réinitialisation";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchMonDossier() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get("/mon-dossier", this.authHeaders());
        this.candidat = response.data.candidature;
        this.expectedDocs = response.data.expected_docs || [];
        return this.candidat;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Erreur lors du chargement du dossier";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateProfil(data) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.put(
          "/mon-dossier/mes-informations",
          data,
          this.authHeaders(),
        );
        this.candidat = response.data.candidature;
        return response.data;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Erreur lors de la mise à jour du profil";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async uploadFile(formData) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post(
          "/mon-dossier/mes-fichiers",
          formData,
          {
            headers: {
              ...this.authHeaders().headers,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        return response.data;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Erreur lors de l'envoi du fichier";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async submitRectification() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post(
          "/mon-dossier/soumettre-rectification",
          {},
          this.authHeaders(),
        );
        this.candidat = response.data.candidature;
        return response.data;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Erreur lors de la soumission";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchMesFichiers() {
      const response = await axios.get("/mon-dossier/mes-fichiers", this.authHeaders());
      return response.data;
    },

    async fetchNotifications() {
      const response = await axios.get("/mon-dossier/notifications", this.authHeaders());
      return response.data.notifications || [];
    },

    async markNotificationAsRead(id) {
      const response = await axios.post(`/mon-dossier/notifications/${id}/lu`, {}, this.authHeaders());
      return response.data;
    },

    async deleteNotifications(ids) {
      const response = await axios.post(
        "/mon-dossier/notifications/supprimer-masse",
        { ids },
        this.authHeaders(),
      );
      return response.data;
    },
  },
});
