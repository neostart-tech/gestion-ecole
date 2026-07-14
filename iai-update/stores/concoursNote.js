import { defineStore } from "pinia";
import axios from "axios";

export const useConcoursNoteStore = defineStore("concoursNote", {
  state: () => ({
    grille: [],
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
    async fetchNotesSession(sessionId) {
      this.isLoading = true;
      try {
        const response = await axios.get(`/concours-session/${sessionId}/notes`, this.authHeaders());
        this.grille = response.data.data || response.data;
        return this.grille;
      } catch (error) {
        console.error("Erreur chargement de la grille de notes:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async saveNotes(sessionId, notes) {
      this.isLoading = true;
      try {
        const response = await axios.post(`/concours-session/${sessionId}/notes/enregistrer`, { notes }, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur enregistrement des notes:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
