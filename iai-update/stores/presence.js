import { defineStore } from "pinia";
import axios from "axios";

export const usePresenceStore = defineStore("presence", {
  state: () => ({
    // États pour les cours
    mesCours: [],
    presences: [],
    coursSelectionne: null,
    coursStatus: null,
    
    // NOUVEAU : États pour les séances
    seances: [],
    seanceSelectionnee: null,
    
    // NOUVEAU : États pour les comportements
    comportements: [],
    
    // NOUVEAU : États pour les justificatifs
    justificatifsEnAttente: [],
    
    // NOUVEAU : États pour les statistiques
    statistiquesGlobales: null,
    statistiquesCours: null,
    statistiquesEtudiant: null,
    
    // NOUVEAU : États pour les alertes
    alertes: [],
    etudiantsASurveiller: [],
    
    // États pour les présences enseignants
    enseignantPresenceEnCours: null,
    enseignantPresenceTerminee: null,
    volumeHoraireInfo: null,
    enseignantPresenceExistante: false,
    tempsRestantDepart: null,
    
    // États de chargement
    isLoading: false,
    exportLoading: false,
    error: null,
  }),

  getters: {
    // Getters existants
    isCoursModifiable: (state) => (cours) => {
      if (!cours) return false;

      if (cours.presences?.length > 0) {
        return false;
      }

      if (cours.recurrence_type === "aucune") {
        return true;
      }

      const aujourdhui = new Date();
      aujourdhui.setHours(0, 0, 0, 0);

      const dateDebut = new Date(cours.debut);
      dateDebut.setHours(0, 0, 0, 0);

      const dateFinRecurrence = cours.recurrence_end_date
        ? new Date(cours.recurrence_end_date)
        : null;
      if (dateFinRecurrence) dateFinRecurrence.setHours(0, 0, 0, 0);

      if (aujourdhui < dateDebut) return false;
      if (dateFinRecurrence && aujourdhui > dateFinRecurrence) return false;

      if (cours.recurrence_type === "hebdomadaire" && cours.recurrence_days) {
        const joursMap = {
          SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6,
        };

        const jourActuel = aujourdhui.getDay();
        const joursRecurrence = cours.recurrence_days.split(",");
        const joursNumeriques = joursRecurrence.map((j) => joursMap[j]);

        if (!joursNumeriques.includes(jourActuel)) {
          return false;
        }
      }

      return true;
    },

    getCoursStatus: (state) => (cours) => {
      if (!cours) return null;

      const formatDate = (date) => {
        return new Date(date).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      };

      if (cours.presences?.length > 0) {
        return {
          modifiable: false,
          message: "Les présences ont déjà été enregistrées pour ce cours",
          type: "deja_enregistre",
          dateEnregistrement: cours.presences[0]?.created_at,
        };
      }

      if (cours.recurrence_type === "aucune") {
        return {
          modifiable: true,
          message: "Cours non récurrent - vous pouvez enregistrer les présences",
          type: "non_recurrent",
        };
      }

      const aujourdhui = new Date();
      aujourdhui.setHours(0, 0, 0, 0);

      const dateDebut = new Date(cours.debut);
      dateDebut.setHours(0, 0, 0, 0);

      const dateFinRecurrence = cours.recurrence_end_date
        ? new Date(cours.recurrence_end_date)
        : null;
      if (dateFinRecurrence) dateFinRecurrence.setHours(0, 0, 0, 0);

      if (aujourdhui < dateDebut) {
        return {
          modifiable: false,
          message: `Ce cours commence le ${formatDate(dateDebut)}`,
          type: "pas_encore_commence",
          dateDebut: cours.debut,
        };
      }

      if (dateFinRecurrence && aujourdhui > dateFinRecurrence) {
        return {
          modifiable: false,
          message: `La période de récurrence s'est terminée le ${formatDate(dateFinRecurrence)}`,
          type: "recurrence_terminee",
          dateFin: cours.recurrence_end_date,
        };
      }

      if (cours.recurrence_type === "hebdomadaire" && cours.recurrence_days) {
        const joursMap = {
          SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6,
        };

        const joursNoms = {
          SU: "Dimanche", MO: "Lundi", TU: "Mardi", WE: "Mercredi",
          TH: "Jeudi", FR: "Vendredi", SA: "Samedi",
        };

        const jourActuel = aujourdhui.getDay();
        const joursRecurrence = cours.recurrence_days.split(",");
        const joursNumeriques = joursRecurrence.map((j) => joursMap[j]);

        if (!joursNumeriques.includes(jourActuel)) {
          const joursLisibles = joursRecurrence
            .map((j) => joursNoms[j])
            .join(", ");
          return {
            modifiable: false,
            message: `Ce cours a lieu les ${joursLisibles} uniquement`,
            type: "mauvais_jour",
            joursPrevu: joursRecurrence,
          };
        }
      }

      return {
        modifiable: true,
        message: "Vous pouvez enregistrer les présences",
        type: "modifiable",
      };
    },

    coursModifiablesAujourdhui: (state) => {
      return state.mesCours.filter((cours) => {
        const status = this.getCoursStatus(cours);
        return status?.modifiable;
      });
    },

    coursDejaEnregistres: (state) => {
      return state.mesCours.filter((cours) => cours.presences?.length > 0);
    },

    // NOUVEAU Getters pour les séances
    seancesParCours: (state) => (coursId) => {
      return state.seances.filter(s => s.emploi_du_temps_id === coursId);
    },

    seanceDuJour: (state) => (coursId) => {
      const aujourdhui = new Date().toISOString().split('T')[0];
      return state.seances.find(s => 
        s.emploi_du_temps_id === coursId && 
        s.date_seance === aujourdhui
      );
    },

    // NOUVEAU Getters pour les statistiques
    tauxPresenceGlobal: (state) => {
      if (!state.statistiquesGlobales) return 0;
      return state.statistiquesGlobales.taux_presence_moyen || 0;
    },

    etudiantsAlerteRouge: (state) => {
      return state.etudiantsASurveiller.filter(e => e.niveau_alerte === 'rouge');
    },

    // Getters existants pour enseignants
    hasEnseignantPresenceEnCours: (state) => {
      return state.enseignantPresenceEnCours !== null;
    },

    hasEnseignantPresenceTerminee: (state) => {
      return state.enseignantPresenceTerminee !== null;
    },

    enseignantPresenceStatus: (state) => {
      if (state.enseignantPresenceEnCours) return state.enseignantPresenceEnCours.statut;
      if (state.enseignantPresenceTerminee) return state.enseignantPresenceTerminee.statut;
      return null;
    },

    enseignantPresenceFormatted: (state) => (presence) => {
      if (!presence) return null;
      
      const statuts = {
        present: { text: "Présent", color: "text-green-600", bg: "bg-green-100" },
        retard: { text: "Retard", color: "text-yellow-600", bg: "bg-yellow-100" },
        absent: { text: "Absent", color: "text-red-600", bg: "bg-red-100" },
        justifie: { text: "Justifié", color: "text-orange-600", bg: "bg-orange-100" },
      };
      
      return statuts[presence.statut] || { text: presence.statut, color: "text-gray-600", bg: "bg-gray-100" };
    },
  },

  actions: {
    // Headers d'authentification
    authHeaders() {
      const token = localStorage.getItem("gest-ecole-token");
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
    },

   

    async fetchMesCours() {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(
          "/presence/get-my-course",
          this.authHeaders(),
        );
        this.mesCours = response.data;
        return response.data;
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          "Erreur lors du chargement des cours";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCours() {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(
          "/presence/liste-des-cours",
          this.authHeaders(),
        );
        this.mesCours = response.data;
        return response.data;
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          "Erreur lors du chargement des cours";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async selectionnerCours(coursId) {
      const cours = this.mesCours.find((c) => c.id === coursId);
      if (!cours) return null;

      this.coursSelectionne = cours;
      this.coursStatus = this.getCoursStatus(cours);

      return {
        cours,
        status: this.coursStatus,
      };
    },

    async verifierAvantEnregistrement(coursId) {
      const cours = this.mesCours.find((c) => c.id === coursId);
      if (!cours) {
        return {
          peutEnregistrer: false,
          message: "Cours non trouvé",
        };
      }

      if (cours.presences?.length > 0) {
        return {
          peutEnregistrer: false,
          message: "Des présences ont déjà été enregistrées pour ce cours",
          type: "deja_enregistre",
          nombrePresences: cours.presences.length,
        };
      }

      const status = this.getCoursStatus(cours);

      return {
        peutEnregistrer: status.modifiable,
        message: status.message,
        type: status.type,
        cours,
      };
    },

    async savePresence(payload) {
      this.isLoading = true;
      this.error = null;

      try {
        const verification = await this.verifierAvantEnregistrement(
          payload.emploi_du_temps_id,
        );

        if (!verification.peutEnregistrer) {
          throw new Error(verification.message);
        }

        const response = await axios.post(
          "/presence/save-student-presence",
          payload,
          this.authHeaders(),
        );

        this.presences = response.data;
        await this.fetchMesCours();

        return response.data;
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Erreur lors de l'enregistrement";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchPresencesByCours(coursId) {
      this.isLoading = true;
      try {
        const cours = this.mesCours.find((c) => c.id === coursId);
        if (cours) {
          this.presences = cours.presences || [];
          return cours.presences;
        }
        return [];
      } catch (error) {
        this.error = "Erreur lors du chargement des présences";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updatePresence(presenceId, data) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/presence/${presenceId}`,
          data,
          this.authHeaders(),
        );

        await this.fetchMesCours();

        return response.data;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Erreur lors de la mise à jour";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deletePresence(presenceId) {
      this.isLoading = true;
      try {
        const response = await axios.delete(
          `/presence/${presenceId}`,
          this.authHeaders(),
        );

        await this.fetchMesCours();

        return response.data;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Erreur lors de la suppression";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchSeances(coursId) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(
          `/presence/cours/${coursId}/seances`,
          this.authHeaders(),
        );
        this.seances = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur chargement séances";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Récupérer les étudiants d'une séance avec leurs présences
     */
    async fetchEtudiantsParSeance(seanceId) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(
          `/presence/seance/${seanceId}/etudiants`,
          this.authHeaders(),
        );
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur chargement étudiants";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Valider une séance (marquer comme terminée)
     */
    async validerSeance(seanceId, data = {}) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.post(
          `/presence/seance/${seanceId}/valider`,
          data,
          this.authHeaders(),
        );
        
        // Mettre à jour la séance dans la liste
        const index = this.seances.findIndex(s => s.id === seanceId);
        if (index !== -1) {
          this.seances[index] = response.data.seance;
        }
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur validation séance";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Annuler une séance
     */
    async annulerSeance(seanceId, motif) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.put(
          `/presence/seance/${seanceId}/annuler`,
          { motif },
          this.authHeaders(),
        );
        
        // Mettre à jour la séance dans la liste
        const index = this.seances.findIndex(s => s.id === seanceId);
        if (index !== -1) {
          this.seances[index] = response.data.seance;
        }
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur annulation séance";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

   
    async updateComportement(presenceId, data) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.put(
          `/presence/presence/${presenceId}/comportement`,
          data,
          this.authHeaders(),
        );
        
        // Mettre à jour la présence dans la liste si elle existe
        if (this.presences.length > 0) {
          const index = this.presences.findIndex(p => p.id === presenceId);
          if (index !== -1) {
            this.presences[index] = response.data.data;
          }
        }
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur mise à jour comportement";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Récupérer l'historique des comportements d'un étudiant
     */
    async fetchComportementsEtudiant(etudiantId, params = {}) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(
          `/presence/etudiant/${etudiantId}/comportements`,
          { ...this.authHeaders(), params }
        );
        this.comportements = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur chargement comportements";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

  
    async fetchStatistiquesGlobales(params = {}) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(
          "/presence/statistiques/globales",
          { ...this.authHeaders(), params }
        );
        this.statistiquesGlobales = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur chargement statistiques";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Récupérer les statistiques d'un cours
     */
    async fetchStatistiquesCours(coursId) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(
          `/presence/statistiques/cours/${coursId}`,
          this.authHeaders(),
        );
        this.statistiquesCours = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur chargement statistiques cours";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Récupérer les statistiques d'un étudiant
     */
    async fetchStatistiquesEtudiant(etudiantId) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(
          `/presence/statistiques/etudiant/${etudiantId}`,
          this.authHeaders(),
        );
        this.statistiquesEtudiant = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur chargement statistiques étudiant";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Récupérer les statistiques sur une période
     */
    async fetchStatistiquesPeriodiques(params) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(
          "/presence/statistiques/periodiques",
          { ...this.authHeaders(), params }
        );
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur chargement statistiques périodiques";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchHistoriqueEtudiant(etudiantId, params = {}) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(
          `/presence/historique/etudiant/${etudiantId}`,
          { ...this.authHeaders(), params }
        );
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur chargement historique";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Récupérer l'historique d'un cours
     */
    async fetchHistoriqueCours(coursId) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(
          `/presence/historique/cours/${coursId}`,
          this.authHeaders(),
        );
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur chargement historique cours";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Récupérer le détail d'une séance
     */
    async fetchHistoriqueSeance(seanceId) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(
          `/presence/historique/seance/${seanceId}`,
          this.authHeaders(),
        );
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur chargement détail séance";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async exportPresencesCours(coursId, filters = {}) {
      this.exportLoading = true;
      this.error = null;

      try {
        const response = await axios.post(
          `/presence/export/cours/${coursId}`,
          filters,
          {
            ...this.authHeaders(),
            responseType: "blob",
          }
        );
        return response;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur lors de l'export";
        console.error(error);
        throw error;
      } finally {
        this.exportLoading = false;
      }
    },

    /**
     * Exporter les présences d'un étudiant
     */
    async exportPresencesEtudiant(etudiantId, filters = {}) {
      this.exportLoading = true;
      this.error = null;

      try {
        const response = await axios.post(
          `/presence/export/etudiant/${etudiantId}`,
          filters,
          {
            ...this.authHeaders(),
            responseType: "blob",
          }
        );
        return response;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur lors de l'export";
        console.error(error);
        throw error;
      } finally {
        this.exportLoading = false;
      }
    },

    /**
     * Exporter les présences d'une séance
     */
    async exportPresencesSeance(seanceId, filters = {}) {
      this.exportLoading = true;
      this.error = null;

      try {
        const response = await axios.post(
          `/presence/export/seance/${seanceId}`,
          filters,
          {
            ...this.authHeaders(),
            responseType: "blob",
          }
        );
        return response;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur lors de l'export";
        console.error(error);
        throw error;
      } finally {
        this.exportLoading = false;
      }
    },

    
    async uploadJustificatif(presenceId, formData) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.post(
          `/presence/presence/${presenceId}/justificatif`,
          formData,
          {
            ...this.authHeaders(),
            headers: {
              ...this.authHeaders().headers,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur upload justificatif";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

  
    async fetchJustificatifsEnAttente() {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(
          "/presence/justificatifs/en-attente",
          this.authHeaders(),
        );
        this.justificatifsEnAttente = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur chargement justificatifs";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

   
    async validerJustificatif(justificatifId) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.put(
          `/presence/justificatif/${justificatifId}/valider`,
          {},
          this.authHeaders(),
        );
        
        // Retirer de la liste des en attente
        this.justificatifsEnAttente = this.justificatifsEnAttente.filter(
          j => j.id !== justificatifId
        );
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur validation justificatif";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

   
    async refuserJustificatif(justificatifId, motif) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.put(
          `/presence/justificatif/${justificatifId}/refuser`,
          { motif },
          this.authHeaders(),
        );
        
        // Retirer de la liste des en attente
        this.justificatifsEnAttente = this.justificatifsEnAttente.filter(
          j => j.id !== justificatifId
        );
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur refus justificatif";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

   
    async fetchAlertes() {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(
          "/presence/alertes",
          this.authHeaders(),
        );
        this.alertes = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur chargement alertes";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

   
    async traiterAlerte(alerteId, action) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.put(
          `/presence/alerte/${alerteId}/traiter`,
          { action },
          this.authHeaders(),
        );
        
        // Mettre à jour l'alerte dans la liste
        const index = this.alertes.findIndex(a => a.id === alerteId);
        if (index !== -1) {
          this.alertes[index] = response.data;
        }
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur traitement alerte";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Récupérer la liste des étudiants à surveiller
     */
    async fetchEtudiantsASurveiller() {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(
          "/presence/etudiants/a-surveiller",
          this.authHeaders(),
        );
        this.etudiantsASurveiller = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur chargement étudiants à surveiller";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

   
    async fetchFicheConseil(classeId, params = {}) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(
          `/presence/conseil/classe/${classeId}`,
          { ...this.authHeaders(), params }
        );
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur chargement fiche conseil";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

   
    async fetchFicheEtudiantConseil(etudiantId) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(
          `/presence/conseil/etudiant/${etudiantId}`,
          this.authHeaders(),
        );
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur chargement fiche étudiant";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

   
    async genererSyntheseConseil(params) {
      this.exportLoading = true;
      this.error = null;

      try {
        const response = await axios.post(
          "/presence/conseil/synthese",
          params,
          {
            ...this.authHeaders(),
            responseType: "blob",
          }
        );
        return response;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur génération synthèse";
        console.error(error);
        throw error;
      } finally {
        this.exportLoading = false;
      }
    },

    async fetchCoursDuJour(date = null) {
      this.isLoading = true;
      this.error = null;
      
      try {
        let url = '/enseignant-presence/cours-du-jour';
        if (date) {
          url += `?date=${date}`;
        }
        
        const response = await axios.get(url, this.authHeaders());
      
        const coursExistants = this.mesCours.filter(c => 
          !response.data.cours.some(nc => nc.id === c.id)
        );
        
        this.mesCours = [...coursExistants, ...response.data.cours];
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur chargement cours du jour';
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async saveEnseignantArrivee(payload) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.post(
          "/enseignant-presence/arrivee",
          payload,
          this.authHeaders(),
        );

        if (response.data.presence) {
          if (!response.data.presence.est_termine) {
            this.enseignantPresenceEnCours = response.data.presence;
            this.enseignantPresenceTerminee = null;
          } else {
            this.enseignantPresenceEnCours = null;
            this.enseignantPresenceTerminee = response.data.presence;
          }
        }
        
        this.volumeHoraireInfo = response.data.volume_horaire;
        await this.fetchCoursDuJour();

        return response.data;
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Erreur lors de l'enregistrement de l'arrivée";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async saveEnseignantDepart(emploiDuTempsId) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.post(
          `/enseignant-presence/depart/${emploiDuTempsId}`,
          {},
          this.authHeaders(),
        );

        this.enseignantPresenceEnCours = null;
        if (response.data.presence) {
          this.enseignantPresenceTerminee = response.data.presence;
        }
        this.volumeHoraireInfo = null;
        this.tempsRestantDepart = null;
        
        await this.fetchCoursDuJour();

        return response.data;
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Erreur lors de l'enregistrement du départ";
        console.error(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async checkEnseignantPresence(emploiDuTempsId) {
      try {
        const response = await axios.get(
          `/enseignant-presence/check/${emploiDuTempsId}`,
          this.authHeaders(),
        );
        
        const data = response.data;
        
        if (data.exists) {
          this.enseignantPresenceExistante = true;
          if (data.en_cours) {
            this.enseignantPresenceEnCours = data.presence;
            this.enseignantPresenceTerminee = null;
          } else if (data.terminee) {
            this.enseignantPresenceEnCours = null;
            this.enseignantPresenceTerminee = data.presence;
          }
        } else {
          this.enseignantPresenceExistante = false;
          this.enseignantPresenceEnCours = null;
          this.enseignantPresenceTerminee = null;
        }
        
        return data;
      } catch (error) {
        console.error("Erreur vérification présence enseignant:", error);
        return { exists: false };
      }
    },

    async getTempsRestantDepart(emploiDuTempsId) {
      try {
        const response = await axios.get(
          `/enseignant-presence/temps-restant/${emploiDuTempsId}`,
          this.authHeaders(),
        );
        
        this.tempsRestantDepart = response.data;
        return response.data;
      } catch (error) {
        console.error("Erreur récupération temps restant:", error);
        return { peut_enregistrer: false };
      }
    },

    async getRecapHeuresEnseignant(enseignantId, uvId) {
      try {
        const response = await axios.get(
          `/enseignant-presence/recap/${enseignantId}/${uvId}`,
          this.authHeaders(),
        );
        return response.data;
      } catch (error) {
        console.error("Erreur récupération récapitulatif:", error);
        throw error;
      }
    },

    async exportEnseignantPresences(emploiDuTempsId, filters = {}) {
      this.exportLoading = true;
      this.error = null;

      try {
        let response;
        
        if (Object.keys(filters).length > 0) {
          response = await axios.post(
            '/enseignant-presence/export/filtered',
            { emploi_du_temps_id: emploiDuTempsId, ...filters },
            {
              ...this.authHeaders(),
              responseType: 'blob',
            }
          );
        } else {
          response = await axios.get(
            `/enseignant-presence/export/cours/${emploiDuTempsId}`,
            {
              ...this.authHeaders(),
              responseType: 'blob',
            }
          );
        }

        return response;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur lors de l'export";
        console.error(error);
        throw error;
      } finally {
        this.exportLoading = false;
      }
    },

    async exportRecapUV(enseignantId, uvId) {
      this.exportLoading = true;
      this.error = null;

      try {
        const response = await axios.get(
          `/enseignant-presence/export/recap-uv/${enseignantId}/${uvId}`,
          {
            ...this.authHeaders(),
            responseType: 'blob',
          }
        );

        return response;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur lors de l'export";
        console.error(error);
        throw error;
      } finally {
        this.exportLoading = false;
      }
    },

    resetEnseignantPresence() {
      this.enseignantPresenceEnCours = null;
      this.enseignantPresenceTerminee = null;
      this.volumeHoraireInfo = null;
      this.enseignantPresenceExistante = false;
      this.tempsRestantDepart = null;
    },

    resetState() {
      this.coursSelectionne = null;
      this.coursStatus = null;
      this.error = null;
      this.presences = [];
      this.seances = [];
      this.seanceSelectionnee = null;
      this.comportements = [];
      this.justificatifsEnAttente = [];
      this.statistiquesGlobales = null;
      this.statistiquesCours = null;
      this.statistiquesEtudiant = null;
      this.alertes = [];
      this.etudiantsASurveiller = [];
      this.resetEnseignantPresence();
    },

    clearCache() {
      this.mesCours = [];
      this.presences = [];
      this.seances = [];
      this.resetState();
    },
  },
});