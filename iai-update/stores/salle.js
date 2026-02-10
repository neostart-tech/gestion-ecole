import { defineStore } from "pinia";
import axios from "axios";

export const useSalleStore = defineStore("salle", {
  state: () => ({
    salles: [],
    salle: null,
    isLoading: false,
    programmes: [],
    isAvailable: false,
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
    async fetchSalles() {
      this.isLoading = true;
      try {
        const response = await axios.get("/salles/liste", this.authHeaders());

        this.salles = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des salles:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async getSalleBySlug(salle) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/salles/${salle}/show`,
          this.authHeaders(),
        );

        this.salle = response.data.data;
      } catch (error) {
        console.error("Erreur chargement de la salle:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async addSalle(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/salles/ajouter-une-salle",
          payload,
          this.authHeaders(),
        );

        this.salles.push(response.data.data ?? response.data);
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteSalle(id) {
      this.isLoading = true;
      try {
        await axios.delete(
          `/salles/${id}/supprimer-une-salle`,
          this.authHeaders(),
        );

        this.salles = this.salles.filter((f) => f.id !== id);
      } finally {
        this.isLoading = false;
      }
    },

    async updateSalle(payload) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/salles/ajouter-une-salle`,
          payload,
          this.authHeaders(),
        );
        this.salles.push(response.data.data ?? response.data);

        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

    async salleDisplayCalendar(salle) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/salles/${salle}/emploi-du-temps`,
          this.authHeaders(),
        );

        this.programmes = response.data.data;
      } catch (error) {
        console.error("Erreur chargement du programme de la salle:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async checkAvailability(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/emploi-du-temps/check-availability",
          payload,
          this.authHeaders(),
        );

        this.isAvailable = response.data.available;

        return response.data;
      } catch (error) {
        console.error("Erreur vérification disponibilité:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async addProgrammes(payload) {
      this.isLoading = true;

      try {
        const req = await axios.post(
          "/emploi-du-temps/store",
          payload,
          this.authHeaders(),
        );
        this.programmes = res.data.data;
      } catch (error) {
        console.error("Erreur d'enregistrment du programme:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async updateProgramme(payload) {
      this.isLoading = true;

      try {
        const res = await axios.put(
          "/emploi-du-temps/update",
          payload,
          this.authHeaders(),
        );

        return res.data;
      } catch (error) {
        console.error("Erreur de mise à jour du programme:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateDate(payload) {
      this.isLoading = true;

      try {
        await axios.put(
          "/emploi-du-temps/update-dates",
          payload,
          this.authHeaders(),
        );
      } catch (error) {
        console.error("Erreur de modification de la date du programme:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async DeleteProgramme(slug) {
      this.isLoading = true;

      try {
        const req = await axios.delete(
          `/emploi-du-temps/${slug}/delete`,
          this.authHeaders(),
        );

        this.programmes = req.data.data;
      } catch (error) {
        console.error("Erreur de suppression du programme:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
