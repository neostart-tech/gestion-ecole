import { defineStore } from "pinia";
import axios from "axios";

export const usePresenceStore = defineStore("presence", {
  state: () => ({
    mesCours: [],
    presences: [],
    isLoading: false,
    error: null,
    coursSelectionne: null,
    coursStatus: null,
  }),

  getters: {
    // Vérifier si un cours est modifiable
    isCoursModifiable: (state) => (cours) => {
      if (!cours) return false;

      // Si des présences existent déjà
      if (cours.presences?.length > 0) {
        return false;
      }

      // Cours non récurrent
      if (cours.recurrence_type === "aucune") {
        return true;
      }

      // Cours récurrent
      const aujourdhui = new Date();
      aujourdhui.setHours(0, 0, 0, 0);

      const dateDebut = new Date(cours.debut);
      dateDebut.setHours(0, 0, 0, 0);

      const dateFinRecurrence = cours.recurrence_end_date
        ? new Date(cours.recurrence_end_date)
        : null;
      if (dateFinRecurrence) dateFinRecurrence.setHours(0, 0, 0, 0);

      // Vérifications
      if (aujourdhui < dateDebut) return false;
      if (dateFinRecurrence && aujourdhui > dateFinRecurrence) return false;

      // Vérifier le jour pour les cours hebdomadaires
      if (cours.recurrence_type === "hebdomadaire" && cours.recurrence_days) {
        const joursMap = {
          SU: 0,
          MO: 1,
          TU: 2,
          WE: 3,
          TH: 4,
          FR: 5,
          SA: 6,
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

    // Obtenir le statut détaillé d'un cours
    getCoursStatus: (state) => (cours) => {
      if (!cours) return null;

      // Helper pour formater la date
      const formatDate = (date) => {
        return new Date(date).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      };

      // Si des présences existent déjà
      if (cours.presences?.length > 0) {
        return {
          modifiable: false,
          message: "Les présences ont déjà été enregistrées pour ce cours",
          type: "deja_enregistre",
          dateEnregistrement: cours.presences[0]?.created_at,
        };
      }

      // Cours non récurrent
      if (cours.recurrence_type === "aucune") {
        return {
          modifiable: true,
          message:
            "Cours non récurrent - vous pouvez enregistrer les présences",
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

      // Si la date est avant le début
      if (aujourdhui < dateDebut) {
        return {
          modifiable: false,
          message: `Ce cours commence le ${formatDate(dateDebut)}`,
          type: "pas_encore_commence",
          dateDebut: cours.debut,
        };
      }

      // Si la date est après la fin de récurrence
      if (dateFinRecurrence && aujourdhui > dateFinRecurrence) {
        return {
          modifiable: false,
          message: `La période de récurrence s'est terminée le ${formatDate(dateFinRecurrence)}`,
          type: "recurrence_terminee",
          dateFin: cours.recurrence_end_date,
        };
      }

      // Vérifier le jour pour les cours hebdomadaires
      if (cours.recurrence_type === "hebdomadaire" && cours.recurrence_days) {
        const joursMap = {
          SU: 0,
          MO: 1,
          TU: 2,
          WE: 3,
          TH: 4,
          FR: 5,
          SA: 6,
        };

        const joursNoms = {
          SU: "Dimanche",
          MO: "Lundi",
          TU: "Mardi",
          WE: "Mercredi",
          TH: "Jeudi",
          FR: "Vendredi",
          SA: "Samedi",
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

    // Liste des cours modifiables aujourd'hui
    coursModifiablesAujourdhui: (state) => {
      return state.mesCours.filter((cours) => {
        const status = this.getCoursStatus(cours);
        return status?.modifiable;
      });
    },

    // Liste des cours déjà enregistrés
    coursDejaEnregistres: (state) => {
      return state.mesCours.filter((cours) => cours.presences?.length > 0);
    },
  },

  actions: {
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
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          "Erreur lors du chargement des cours";
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },

    async savePresence(payload) {
      this.isLoading = true;
      this.error = null;

      try {
        // Vérification préalable
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

        // Mettre à jour les présences et recharger les cours
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

    // Action pour sélectionner un cours
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

    // Action pour vérifier avant enregistrement
    async verifierAvantEnregistrement(coursId) {
      const cours = this.mesCours.find((c) => c.id === coursId);
      if (!cours) {
        return {
          peutEnregistrer: false,
          message: "Cours non trouvé",
        };
      }

      // Vérifier si des présences existent déjà
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

    // Action pour récupérer les présences d'un cours
    async fetchPresencesByCours(coursId) {
      this.isLoading = true;
      try {
        // Utiliser le cours déjà chargé qui contient les présences
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
    async exportPresences(emploiDuTempsId, filters = {}) {
      this.exportLoading = true;
      this.error = null;

      try {
        // Construire l'URL avec les paramètres
        let url = `/presences/export/${emploiDuTempsId}`;

        // Si on a des filtres, utiliser l'endpoint avec POST
        if (Object.keys(filters).length > 0) {
          const response = await axios.post(
            "/presences/export/filtered",
            { emploi_du_temps_id: emploiDuTempsId, ...filters },
            {
              ...this.authHeaders(),
              responseType: "blob", // Important pour recevoir un fichier
            },
          );
          return response;
        } else {
          // Export simple sans filtres
          const response = await axios.get(url, {
            ...this.authHeaders(),
            responseType: "blob",
          });
          return response;
        }
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur lors de l'export";
        console.error(error);
        throw error;
      } finally {
        this.exportLoading = false;
      }
    },

    // Action pour mettre à jour une présence existante
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

    // Action pour supprimer une présence
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

    // Action pour réinitialiser l'état
    resetState() {
      this.coursSelectionne = null;
      this.coursStatus = null;
      this.error = null;
      this.presences = [];
    },

    // Action pour vider le cache/local si nécessaire
    clearCache() {
      this.mesCours = [];
      this.presences = [];
      this.resetState();
    },
  },
});
