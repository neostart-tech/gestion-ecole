// stores/candidature.js
import { defineStore } from "pinia";
import axios from "axios";

export const useCandidatureStore = defineStore("candidature", {
  state: () => ({
    candidatures: [],
    candidature: null,
    mesCandidatures: [],
    groupes: [],
    groupeActuel: null,
    candidaturesGroupe: [],
    isLoading: false,
    error: null,
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

    // Headers pour l'upload de fichiers
    multipartHeaders() {
      const token = localStorage.getItem("gest-ecole-token");
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
        },
      };
    },


    // GET|HEAD  api/candidature/liste
    async fetchCandidatures() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(
          "/candidature/liste",
          this.authHeaders(),
        );
        this.candidatures = response.data.data || response.data;
        return this.candidatures;
      } catch (error) {
        console.error("Erreur chargement candidatures:", error);
        this.error =
          error.response?.data?.message ||
          "Erreur lors du chargement des candidatures";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // GET|HEAD  api/candidature/{candidature}/evaluer
    async fetchCandidatureDetail(candidature) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(
          `/candidature/${candidature}/evaluer`,
          this.authHeaders(),
        );
        this.candidature = response.data.data || response.data;
        return this.candidature;
      } catch (error) {
        console.error("Erreur chargement détail candidature:", error);
        this.error =
          error.response?.data?.message ||
          "Erreur lors du chargement du détail";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // PUT  api/candidature/{candidature}/valider
    async validerDossier(candidature, data = {}) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.put(
          `/candidature/${candidature}/valider`,
          data,
          this.authHeaders(),
        );
        await this.fetchCandidatures();
        return response.data;
      } catch (error) {
        console.error("Erreur validation dossier:", error);
        this.error =
          error.response?.data?.message || "Erreur lors de la validation";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // PUT  api/candidature/{candidature}/rejeter
    async rejeterDossier(candidature, motif) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.put(
          `/candidature/${candidature}/rejeter`,
          { motif },
          this.authHeaders(),
        );
        await this.fetchCandidatures();
        return response.data;
      } catch (error) {
        console.error("Erreur rejet dossier:", error);
        this.error = error.response?.data?.message || "Erreur lors du rejet";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // PUT  api/candidature/{candidature}/demander-rectification
    async demanderRectification(candidature, data = {}) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.put(
          `/candidature/${candidature}/demander-rectification`,
          data,
          this.authHeaders(),
        );
        await this.fetchCandidatures();
        return response.data;
      } catch (error) {
        console.error("Erreur demande rectification:", error);
        this.error =
          error.response?.data?.message ||
          "Erreur lors de la demande de rectification";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // ============ ROUTES DE FILTRES ============

    // GET|HEAD  api/candidature/admission-a-laravel
    async fetchCandidaturesAdmission() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(
          "/candidature/admission-a-laravel",
          this.authHeaders(),
        );
        return response.data.data || response.data;
      } catch (error) {
        console.error("Erreur chargement candidatures admission:", error);
        this.error =
          error.response?.data?.message || "Erreur lors du chargement";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // GET|HEAD  api/candidature/participation-au-concours
    async fetchCandidaturesParticipation() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(
          "/candidature/participation-au-concours",
          this.authHeaders(),
        );
        return response.data.data || response.data;
      } catch (error) {
        console.error("Erreur chargement candidatures participation:", error);
        this.error =
          error.response?.data?.message || "Erreur lors du chargement";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // GET|HEAD  api/candidature/payement-des-frais-de-participation
    async fetchCandidaturesPayement() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(
          "/candidature/payement-des-frais-de-participation",
          this.authHeaders(),
        );
        return response.data.data || response.data;
      } catch (error) {
        console.error("Erreur chargement candidatures payement:", error);
        this.error =
          error.response?.data?.message || "Erreur lors du chargement";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // GET|HEAD  api/candidature/liste-des-rectifications
    async fetchCandidaturesRectifications() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(
          "/candidature/liste-des-rectifications",
          this.authHeaders(),
        );
        return response.data.data || response.data;
      } catch (error) {
        console.error("Erreur chargement candidatures rectifications:", error);
        this.error =
          error.response?.data?.message || "Erreur lors du chargement";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // GET|HEAD  api/candidature/liste-des-rejets
    async fetchCandidaturesRejets() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(
          "/candidature/liste-des-rejets",
          this.authHeaders(),
        );
        return response.data.data || response.data;
      } catch (error) {
        console.error("Erreur chargement candidatures rejets:", error);
        this.error =
          error.response?.data?.message || "Erreur lors du chargement";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // ============ ROUTES DE GROUPES ============

    // GET|HEAD  api/candidature/choix-de-groupe
    async fetchGroupesChoix() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(
          "/candidature/choix-de-groupe",
          this.authHeaders(),
        );
        this.groupes = response.data.data || response.data;
        return this.groupes;
      } catch (error) {
        console.error("Erreur chargement groupes:", error);
        this.error =
          error.response?.data?.message ||
          "Erreur lors du chargement des groupes";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // GET|HEAD  api/candidature/attribution-de-groupe/{group}
    async fetchGroupeAttribution(group) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(
          `/candidature/attribution-de-groupe/${group}`,
          this.authHeaders(),
        );
        this.groupeActuel = group;
        this.candidaturesGroupe = response.data.data || response.data;
        return this.candidaturesGroupe;
      } catch (error) {
        console.error("Erreur chargement attribution groupe:", error);
        this.error =
          error.response?.data?.message || "Erreur lors du chargement";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // POST  api/candidature/attribution-de-groupe
    async attribuerGroupe(data) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post(
          "/candidature/attribution-de-groupe",
          data,
          this.authHeaders(),
        );
        return response.data;
      } catch (error) {
        console.error("Erreur attribution groupe:", error);
        this.error =
          error.response?.data?.message ||
          "Erreur lors de l'attribution du groupe";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // ============ ROUTES DE SOUMISSION ============

    // POST  api/candidature/admission-sub
    async soumettreAdmission(data) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post(
          "/candidature/admission-sub",
          data,
          this.authHeaders(),
        );
        return response.data;
      } catch (error) {
        console.error("Erreur soumission admission:", error);
        this.error =
          error.response?.data?.message ||
          "Erreur lors de la soumission des admissions";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // POST  api/candidature/presence-sub
    async soumettrePresence(data) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post(
          "/candidature/presence-sub",
          data,
          this.authHeaders(),
        );
        return response.data;
      } catch (error) {
        console.error("Erreur soumission présence:", error);
        this.error =
          error.response?.data?.message ||
          "Erreur lors de la soumission des présences";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // POST  api/candidature/payement-des-frais-de-participation
    async soumettrePayement(data) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post(
          "/candidature/payement-des-frais-de-participation",
          data,
          this.authHeaders(),
        );
        return response.data;
      } catch (error) {
        console.error("Erreur soumission payement:", error);
        this.error =
          error.response?.data?.message ||
          "Erreur lors de la soumission des payements";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // POST  api/candidature/{candidature}/reorienter
    async reorienterCandidat(candidature, data) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post(
          `/candidature/${candidature}/reorienter`,
          data,
          this.authHeaders(),
        );
        return response.data;
      } catch (error) {
        console.error("Erreur réorientation:", error);
        this.error =
          error.response?.data?.message || "Erreur lors de la réorientation";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // ============ ROUTES POUR LES ÉTUDIANTS ============

    // GET|HEAD  api/etudiant/annonces/liste
    async fetchAnnoncesEtudiant() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(
          "/etudiant/annonces/liste",
          this.authHeaders(),
        );
        this.mesCandidatures = response.data.data || response.data;
        return this.mesCandidatures;
      } catch (error) {
        console.error("Erreur chargement annonces étudiant:", error);
        this.error =
          error.response?.data?.message || "Erreur lors du chargement";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // GET|HEAD  api/etudiant/annonces/mes-depots
    async fetchMesDepots() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(
          "/etudiant/annonces/mes-depots",
          this.authHeaders(),
        );
        return response.data.data || response.data;
      } catch (error) {
        console.error("Erreur chargement dépôts:", error);
        this.error =
          error.response?.data?.message || "Erreur lors du chargement";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // GET|HEAD  api/etudiant/annonces/{annonce}/details
    async fetchAnnonceDetail(annonce) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(
          `/etudiant/annonces/${annonce}/details`,
          this.authHeaders(),
        );
        return response.data.data || response.data;
      } catch (error) {
        console.error("Erreur chargement détail annonce:", error);
        this.error =
          error.response?.data?.message || "Erreur lors du chargement";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // POST  api/etudiant/annonces/{annonce}/postuler-a-une-offre
    async postulerAnnonce(annonce, formData) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post(
          `/etudiant/annonces/${annonce}/postuler-a-une-offre`,
          formData,
          this.multipartHeaders(),
        );
        return response.data;
      } catch (error) {
        console.error("Erreur postulation:", error);
        this.error =
          error.response?.data?.message || "Erreur lors de la postulation";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Reset state
    resetState() {
      this.candidatures = [];
      this.candidature = null;
      this.mesCandidatures = [];
      this.groupes = [];
      this.groupeActuel = null;
      this.candidaturesGroupe = [];
      this.isLoading = false;
      this.error = null;
    },

    resetError() {
      this.error = null;
    },
  },

  getters: {
    getCandidaturesValidees: (state) => {
      return state.candidatures.filter((c) => c.dossier_valide === true);
    },

    getCandidaturesEnAttente: (state) => {
      return state.candidatures.filter(
        (c) => c.dossier_valide === false && !c.motif,
      );
    },

    getCandidaturesRejetees: (state) => {
      return state.candidatures.filter((c) => c.motif !== null);
    },

    getCandidaturesRectification: (state) => {
      return state.candidatures.filter(
        (c) => c.rectification_expected === true,
      );
    },

    getCandidaturesAdmises: (state) => {
      return state.candidatures.filter((c) => c.admission === true);
    },

    getCandidaturesFraisPayes: (state) => {
      return state.candidatures.filter((c) => c.frais_paye === true);
    },

    getCandidaturesParticipants: (state) => {
      return state.candidatures.filter((c) => c.participation === true);
    },

    hasError: (state) => state.error !== null,
    isLoading: (state) => state.isLoading,

    getCandidatureBySlug: (state) => (slug) => {
      return state.candidatures.find((c) => c.slug === slug);
    },
  },
});
