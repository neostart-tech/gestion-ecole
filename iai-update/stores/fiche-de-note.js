import { defineStore } from "pinia";
import axios from "axios";

export const useFicheDeNoteStore = defineStore("fiche de note", {
  state: () => ({
    fiches: [] || null,
    notes: [] || null,
    isLoading: false,
  }),

  actions: {
    authHeaders() {
      const token = localStorage.getItem("gest-ecole-token");

      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          Accept: "application/json",
        },
      };
    },
    async fetchFiche(evaluation) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/evaluations/${evaluation}/fiche-de-note`,
          this.authHeaders(),
        );

        this.fiches = response.data.notes;
      } catch (error) {
        console.error("Erreur chargement fiche de notes:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async addFicheNote(evaluation, payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          `/evaluations/${evaluation}/notes/enregistrer-note`,
          payload,
          this.authHeaders(),
        );
        this.fiches = response.data.notes;
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },
    async PublishNote(evaluation) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/evaluations/${evaluation}/notes/publier-les-notes`,
          null,
          this.authHeaders(),
        );
        this.fiches = response.data.notes;
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

    async exportNote(evaluation) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/evaluations/${evaluation}/notes/export`,
          {
            ...this.authHeaders(),
            responseType: 'blob',
          },
        );
        return response;
      } finally {
        this.isLoading = false;
      }
    },

    async exportNotes(evaluation) {
      return this.exportNote(evaluation);
    },

    // async updateFicheDePresence(fiche,payload) {
    //   this.isLoading = true;
    //   try {
    //     const response = await axios.put(
    //       `/fiches-de-presence/${fiche}/mettre-a-jour`,
    //       payload,
    //       this.authHeaders(),
    //     );
    //     return response.data;
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },

    // async publishedEvaluation(evaluation) {
    //   this.isLoading = true;
    //   try {
    //     const response = await axios.get(
    //       `/evaluations/${evaluation}/publier`,
    //       this.authHeaders(),
    //     );
    //     this.evaluations=response.data.data;
    //     return response.data;
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },
    // async publishedEvaluation(evaluation) {
    //   this.isLoading = true;
    //   try {
    //     const response = await axios.get(
    //       `/evaluations/${evaluation}/fiche-de-note`,
    //       this.authHeaders(),
    //     );
    //     this.evaluations=response.data.data;
    //     return response.data;
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },
  },
});
