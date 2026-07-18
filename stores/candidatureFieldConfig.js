import { defineStore } from "pinia";
import axios from "axios";

export const useCandidatureFieldConfigStore = defineStore("candidatureFieldConfig", {
  state: () => ({
    champs: [],
    identifiantDossierSource: "code",
    identifiantDossierSourceOptions: [],
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
    applyPayload(data) {
      this.champs = data.champs || [];
      this.identifiantDossierSource = data.identifiant_dossier_source || "code";
      this.identifiantDossierSourceOptions = data.identifiant_dossier_source_options || [];
    },
    async fetchChamps() {
      this.isLoading = true;
      try {
        const response = await axios.get("/candidature-field-configs", this.authHeaders());
        this.applyPayload(response.data);
      } catch (error) {
        console.error("Erreur chargement des champs de candidature:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async updateChamps(champs, identifiantDossierSource) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          "/candidature-field-configs",
          { champs, identifiant_dossier_source: identifiantDossierSource },
          this.authHeaders()
        );
        this.applyPayload(response.data);
        return response.data;
      } catch (error) {
        console.error("Erreur mise à jour des champs de candidature:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
