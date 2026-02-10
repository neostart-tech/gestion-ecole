import { defineStore } from "pinia";
import axios from "axios";

export const useEvaluationStore = defineStore("evaluation", {
  state: () => ({
    evaluations: [],
    evaluation:null,
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
    async fetchEvaluations() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/evaluations/liste",
          this.authHeaders(),
        );

        this.evaluations = response.data.data;
      } catch (error) {
        console.error("Erreur chargement evaluations:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async addEvaluation(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/evaluations/ajouter",
          payload,
          this.authHeaders(),
        );
        this.evaluations.push(response.data.data ?? response.data);
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },
    async UpdateEvaluation(payload, evaluation) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/evaluations/${evaluation}/modifier`,
          payload,
          this.authHeaders(),
        );
        const index = this.evaluations.findIndex((e) => e.id === evaluation);
        if (index !== -1) {
          this.evaluations[index] = response.data.data ?? response.data;
        }
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteEvaluation(evaluation) {
      this.isLoading = true;
      try {
        const response = await axios.delete(
          `/evaluations/${evaluation}/supprimer`,
          this.authHeaders(),
        );
        this.evaluations = this.evaluations.filter((e) => e.id !== evaluation);
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

    async checkEvaluation(evaluation) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/evaluations/${evaluation}/modifier`,
          this.authHeaders(),
        );
        this.evaluation = response.data.data;
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

    async addFicheDePresence(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/fiches-de-presence/enregistrer",
          payload,
          this.authHeaders(),
        );
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

    async updateFicheDePresence(fiche, payload) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/fiches-de-presence/${fiche}/mettre-a-jour`,
          payload,
          this.authHeaders(),
        );
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

    async publishedEvaluation(evaluation) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/evaluations/${evaluation}/publier`,
          this.authHeaders(),
        );
        this.evaluations = response.data.data;
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

    // async deleteFiliere(filiereId) {
    //   this.isLoading = true;
    //   try {
    //     await axios.delete(
    //       `/filieres/${filiereId}/supprimer`,
    //       this.authHeaders()
    //     );

    //     this.filieres = this.filieres.filter(
    //       (f) => f.id !== filiereId
    //     );
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },

    // async updateFiliere(filiereId, updatedData) {
    //   this.isLoading = true;
    //   try {
    //     const response = await axios.put(
    //       `/filieres/${filiereId}/modifier`,
    //       updatedData,
    //       this.authHeaders()
    //     );

    //     const index = this.filieres.findIndex(
    //       (f) => f.id === filiereId
    //     );

    //     if (index !== -1) {
    //       this.filieres[index] = response.data.data ?? response.data;
    //     }

    //     return response.data;
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },
  },
});
