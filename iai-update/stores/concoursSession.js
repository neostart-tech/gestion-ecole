import { defineStore } from "pinia";
import axios from "axios";

export const useConcoursSessionStore = defineStore("concoursSession", {
  state: () => ({
    sessions: [],
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
    async fetchSessions() {
      this.isLoading = true;
      try {
        const response = await axios.get("/concours-session/liste", this.authHeaders());
        this.sessions = response.data.data || response.data;
        return this.sessions;
      } catch (error) {
        console.error("Erreur chargement des sessions de concours:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async addSession(form) {
      this.isLoading = true;
      try {
        const response = await axios.post("/concours-session/ajouter", form, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur ajout de la session de concours:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async updateSession(id, form) {
      this.isLoading = true;
      try {
        const response = await axios.put(`/concours-session/${id}/modifier`, form, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur modification de la session de concours:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async toggleSessionStatus(id, statut) {
      this.isLoading = true;
      try {
        const response = await axios.patch(`/concours-session/${id}/toggle-status`, { statut }, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur changement de statut de la session:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async publishSession(id) {
      try {
        const response = await axios.post(`/concours-session/${id}/publier`, {}, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur publication de la session:", error);
        throw error;
      }
    },
    async unpublishSession(id) {
      try {
        const response = await axios.post(`/concours-session/${id}/depublier`, {}, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur dépublication de la session:", error);
        throw error;
      }
    },
    async fetchSessionMatieres(sessionId) {
      try {
        const response = await axios.get(`/concours-session/${sessionId}/matieres`, this.authHeaders());
        return response.data.data || response.data;
      } catch (error) {
        console.error("Erreur chargement des matières de la session:", error);
        throw error;
      }
    },
    async addSessionMatiere(sessionId, form) {
      try {
        const response = await axios.post(`/concours-session/${sessionId}/matieres`, form, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur ajout d'une matière à la session:", error);
        throw error;
      }
    },
    async updateSessionMatiere(sessionId, sessionMatiereId, form) {
      try {
        const response = await axios.put(`/concours-session/${sessionId}/matieres/${sessionMatiereId}`, form, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur modification d'une matière de la session:", error);
        throw error;
      }
    },
    async deleteSessionMatiere(sessionId, sessionMatiereId) {
      try {
        const response = await axios.delete(`/concours-session/${sessionId}/matieres/${sessionMatiereId}`, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur suppression d'une matière de la session:", error);
        throw error;
      }
    },
  },
});
