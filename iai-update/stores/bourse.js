import { defineStore } from "pinia";
import axios from "axios";

export const useBourseStore = defineStore("bourse", {
  state: () => ({
    bourses: [],
    boursesetudiants: [],
    bourseDetail: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    nombreTotalBourses: (state) => state.bourses.length,
    
    listeEtudiantsBoursiers: (state) => state.boursesetudiants,
    
    nombreEtudiantsBoursiers: (state) => state.boursesetudiants.length,
  },

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

    async fetchBourses() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(
          "/bourse/liste",
          this.authHeaders()
        );
        this.bourses = response.data.data || response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur lors du chargement des bourses";
        console.error("Erreur lors du chargement des bourses:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchEtudiantsBourse(bourseId) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(
          `/bourse/${bourseId}/etudiants`, 
          this.authHeaders()
        );
        this.boursesetudiants = response.data.data || response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur lors du chargement des étudiants boursiers";
        console.error("Erreur lors du chargement des étudiants boursiers:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchBourseDetail(id) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(
          `/bourse/${id}`,
          this.authHeaders()
        );
        this.bourseDetail = response.data.data || response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur lors du chargement des détails de la bourse";
        console.error("Erreur lors du chargement des détails:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async createBourse(payload) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post(
          "/bourse/store",
          payload,
          this.authHeaders()
        );
        
        await this.fetchBourses();
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur lors de la création de la bourse";
        console.error("Erreur lors de la création:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async affecterBourse(payload) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post(
          "/bourse/affecter",
          payload,
          this.authHeaders()
        );
        
        await this.fetchBourses();
        
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur lors de l'affectation de la bourse";
        console.error("Erreur lors de l'affectation:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async retirerBourse(payload) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post(
          "/bourse/retirer",
          payload,
          this.authHeaders()
        );
        
        await this.fetchBourses();
      
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur lors du retrait de la bourse";
        console.error("Erreur lors du retrait:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateBourse(id, payload) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.put(
          `/bourse/${id}/update`,
          payload,
          this.authHeaders()
        );
        
        await this.fetchBourses();
        
        if (this.bourseDetail && this.bourseDetail.id === id) {
          this.bourseDetail = response.data.data || response.data;
        }
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur lors de la mise à jour de la bourse";
        console.error("Erreur lors de la mise à jour:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteBourse(id) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.delete(
          `/bourse/${id}/delete`,
          this.authHeaders()
        );
        
        this.bourses = this.bourses.filter(b => b.id !== id);
        
        if (this.bourseDetail && this.bourseDetail.id === id) {
          this.bourseDetail = null;
        }
        
        // Si on était sur les étudiants de cette bourse, vider la liste
        this.boursesetudiants = [];
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur lors de la suppression de la bourse";
        console.error("Erreur lors de la suppression:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    resetState() {
      this.bourses = [];
      this.boursesetudiants = [];
      this.bourseDetail = null;
      this.isLoading = false;
      this.error = null;
    },

    clearError() {
      this.error = null;
    },
  },
});