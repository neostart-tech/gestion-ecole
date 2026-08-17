import { defineStore } from "pinia";
import axios from "axios";

export const useFraisInscriptionStore = defineStore("fraisInscription", {
  state: () => ({
    frais: [],
    recapPaiement: null,
    loadingRecap: false,
    hasLoadedRecap: false,
    isLoading: false,
    error: null,
  }),

  getters: {
    authHeaders() {
      const token = typeof window !== "undefined" ? localStorage.getItem("gest-ecole-token") : "";
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          Accept: "application/json",
        },
      };
    },

    getUser() {
      if (typeof window !== "undefined") {
        try {
          return JSON.parse(localStorage.getItem("user") || "{}");
        } catch {
          return {};
        }
      }
      return {};
    },

    isEtudiant() {
      const u = this.getUser;
      if (!u || !u.roles) return false;
      return u.roles.some(
        (r) => r.slug === "etudiant" || r.name?.toLowerCase().includes("etudiant")
      );
    },

    isFraisInscriptionPaye(state) {
      if (!this.isEtudiant) return true; // Les admins et enseignants sont exempts

      // 1. Récapitulatif API
      if (state.recapPaiement) {
        const recap = state.recapPaiement.data || state.recapPaiement;
        if (typeof recap.inscription_payee !== "undefined") {
          return Boolean(recap.inscription_payee);
        }
        if (typeof recap.frais_inscription_paye !== "undefined") {
          return Boolean(recap.frais_inscription_paye);
        }
      }

      // 2. Fallback sur l'utilisateur en localStorage
      const u = this.getUser;
      if (typeof u.frais_inscription_paye !== "undefined") {
        return Boolean(u.frais_inscription_paye);
      }
      if (typeof u.inscription_payee !== "undefined") {
        return Boolean(u.inscription_payee);
      }
      if (u.etudiant) {
        if (typeof u.etudiant.frais_inscription_paye !== "undefined") {
          return Boolean(u.etudiant.frais_inscription_paye);
        }
        if (typeof u.etudiant.inscription_payee !== "undefined") {
          return Boolean(u.etudiant.inscription_payee);
        }
      }

      return false;
    },

    isFraisInscriptionImpaye() {
      if (!this.isEtudiant) return false;
      // Ne pas bloquer prématurément avant d'avoir vérifié l'API pour éviter le flash au chargement
      if (!this.hasLoadedRecap || this.loadingRecap) return false;
      return !this.isFraisInscriptionPaye;
    },
  },

  actions: {
    async fetchRecapPaiement(force = false) {
      if (this.recapPaiement && !force && this.hasLoadedRecap) return this.recapPaiement;

      this.loadingRecap = true;
      this.error = null;

      try {
        const response = await axios.get("/paiements/recap", this.authHeaders);
        const resData = response.data;
        const actualData = resData?.data?.data ?? resData?.data ?? resData;
        this.recapPaiement = actualData;
        return this.recapPaiement;
      } catch (error) {
        console.warn("Erreur récupération récapitulatif de paiement :", error);
        this.error = error.response?.data?.message || error.message;
        return null;
      } finally {
        this.loadingRecap = false;
        this.hasLoadedRecap = true;
      }
    },

    async fetchFrais() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/frais-inscription/index",
          this.authHeaders
        );
        const resData = response.data?.data ?? response.data;
        this.frais = Array.isArray(resData) ? resData : [];
      } catch (error) {
        console.error("Erreur chargement frais d'inscription:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async addFrais(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/frais-inscription/payer",
          payload,
          this.authHeaders
        );
        const newItem = response.data.data ?? response.data;
        this.frais.unshift(newItem);
        return response.data;
      } catch (error) {
        console.error("Erreur d'ajout frais d'inscription:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateFrais(id, updatedData) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/frais-inscription/update/${id}`,
          updatedData,
          this.authHeaders
        );
        const index = this.frais.findIndex((f) => f.id === id);
        if (index !== -1) {
          this.frais[index] = response.data.data ?? response.data;
        }
        return response.data;
      } catch (error) {
        console.error("Erreur modification frais d'inscription:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async activateFrais(id) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/frais-inscription/activate/${id}`,
          null,
          this.authHeaders
        );
        const updatedFrais = response.data.data ?? response.data;
        const index = this.frais.findIndex((f) => f.id === id);
        if (index !== -1) {
          this.frais[index] = updatedFrais;
        }
      } catch (error) {
        console.error("Erreur activation frais d'inscription:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteFrais(id) {
      this.isLoading = true;
      try {
        await axios.delete(
          `/frais-inscription/destroy/${id}`,
          this.authHeaders
        );
        this.frais = this.frais.filter((f) => f.id !== id);
      } catch (error) {
        console.error("Erreur suppression frais d'inscription:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
