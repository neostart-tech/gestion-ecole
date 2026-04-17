import { defineStore } from "pinia";
import axios from "axios";

export const useRecouvrementStore = defineStore("recouvrement", {
  state: () => ({
    students: [],
    niveaux: [],
    journalier: null,
    mensuel: [],
    abandons: [],
    kpis: null,
    loading: false,
    error: null,
    etudiantCourant: null,
    echeances: [],
    historique: [],
  }),

  getters: {
    // Headers d'authentification
    authHeaders() {
      const token = localStorage.getItem("gest-ecole-token");
      return {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
    },

    totalEncaisse(state) {
      return state.students.reduce((acc, s) => acc + s.montant_paye, 0);
    },

    tauxGlobal(state) {
      const total = state.students.reduce((acc, s) => acc + s.montant_du, 0);
      return total > 0 ? Math.round((this.totalEncaisse / total) * 100) : 0;
    }
  },

  actions: {
    /**
     * Récupérer les recouvrements
     */
    async fetchRecouvrements(niveau_id = "", statut = "") {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('/finance/recouvrement', {
          params: { niveau_id, statut },
          ...this.authHeaders
        });
        
        if (response.data.success) {
          this.students = response.data.data || [];
        } else {
          // If the backend doesn't envelope in .success, we might just get data
          this.students = response.data.data || response.data || [];
        }
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur lors du chargement des recouvrements";
        console.error("Erreur fetchRecouvrements:", error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Récupérer la liste des niveaux
     */
    async fetchNiveaux() {
      try {
        const response = await axios.get('/niveau/liste', this.authHeaders);
        this.niveaux = response.data.data || response.data || [];
        return response.data;
      } catch (error) {
        console.error("Erreur fetchNiveaux:", error);
      }
    },

    async fetchRecouvrementJournalier(dateFin = '') {
      try {
        const response = await axios.get('/finance/recouvrement-journalier', {
          params: { date_fin: dateFin },
          ...this.authHeaders
        });
        this.journalier = response.data.data;
        return response.data;
      } catch (error) {
        console.error("Erreur fetchRecouvrementJournalier:", error);
      }
    },

    async fetchSuiviMensuel(mois = '', annee = '') {
      try {
        const response = await axios.get('/finance/suivi-mensuel', {
          params: { mois, annee },
          ...this.authHeaders
        });
        this.mensuel = response.data.data;
        return response.data;
      } catch (error) {
        console.error("Erreur fetchSuiviMensuel:", error);
      }
    },

    async fetchAbandons() {
      try {
        const response = await axios.get('/finance/abandons', this.authHeaders);
        this.abandons = response.data.data;
        return response.data;
      } catch (error) {
        console.error("Erreur fetchAbandons:", error);
      }
    },

    async fetchDashboardKPIs() {
      try {
        const response = await axios.get('/finance/dashboard', this.authHeaders);
        if(response.data.data) {
           const resume = response.data.data.resume || {};
           const extra = response.data.data.extra_kpis || {};
           
           let total_a_collecter = Number(resume.montant_total_a_payer) || 0;
           let total_encaisse = Number(resume.montant_collecte) || 0;
           
           // Fallback sur la liste locale si les chiffres principaux du dashboard sont à 0 (chargement partiel)
           if (total_a_collecter === 0 && this.students.length > 0) {
              total_a_collecter = this.students.reduce((acc, s) => acc + Number(s.montant_du || 0), 0);
              total_encaisse = this.students.reduce((acc, s) => acc + Number(s.montant_paye || 0), 0);
           }

           const retard_calc = this.students.filter(s => s.statut === 'retard' || s.statut === 'en_retard');
           const retard_montant = retard_calc.reduce((acc, s) => acc + (Number(s.montant_du) - Number(s.montant_paye)), 0);

           this.kpis = {
             ...extra,
             total_a_encaisser: total_a_collecter,
             total_encaisse: total_encaisse,
             total_restant: total_a_collecter - total_encaisse,
             taux_collecte: total_a_collecter > 0 ? Math.round((total_encaisse / total_a_collecter) * 100) : 0,
             retard_paiement: (Number(extra.retard_paiement?.montant) > 0) ? extra.retard_paiement : {
                montant: retard_montant,
                nombre_etudiants: retard_calc.length
             }
           };
        }
        return response.data;
      } catch (error) {
        console.error("Erreur fetchDashboardKPIs:", error);
      }
    },

    async fetchEtudiantDetail(slug) {
      if (!slug) return;
      this.loading = true;
      try {
        const response = await axios.get(`/finance/recouvrement/${slug}/detail`, this.authHeaders);
        this.etudiantCourant = response.data.data?.etudiant || response.data.data;
        this.echeances = response.data.data?.echeances || [];
        this.historique = response.data.data?.historique || [];
        return response.data;
      } catch (error) {
        console.error("Erreur fetchEtudiantDetail:", error);
      } finally {
        this.loading = false;
      }
    },

    async envoyerRappel(slug) {
      if (!slug) return;
      try {
        const response = await axios.post(`/finance/recouvrement/${slug}/rappel`, {}, this.authHeaders);
        return response.data;
      } catch (error) {
        console.error("Erreur envoyerRappel:", error);
        throw error;
      }
    },

    async declarerAbandon(slug) {
      if (!slug) return;
      try {
        const response = await axios.post(`/finance/recouvrement/${slug}/abandon-ui`, {}, this.authHeaders);
        return response.data;
      } catch (error) {
        console.error("Erreur declarerAbandon:", error);
        throw error;
      }
    }
  }
});
