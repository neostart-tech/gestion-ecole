import { defineStore } from "pinia";
import axios from "axios";

export const useCalendarStore = defineStore("calendar", {
  state: () => ({
    calendarData: [],
    holidays: [],
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
    async loadAuthCalendar() {
      this.isLoading = true;

      try {
        const req = await axios.get("/load-calendar", this.authHeaders());
        this.calendarData = req.data.data;
        
        // Charger aussi les jours fériés pour l'affichage
        await this.loadHolidays();
      } catch (error) {
        console.error("Erreur chargement calendrier:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async loadHolidays() {
      try {
        const response = await axios.get("/jours-feries/liste", this.authHeaders());
        this.holidays = response.data.data;
      } catch (error) {
        console.error("Erreur chargement jours fériés:", error);
      }
    },

    // async exportCalendar() {
    //   this.isLoading = true;

    //   try {
    //     const req = await axios.get(
    //       "/emploi-du-temps/matrice/export",
    //       this.authHeaders(),
    //     );

    //     this.calendarData = req.data.data;
    //   } catch (error) {
    //     console.error("Erreur chargement calendrier:", error);
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },
    async exportCalendar(params) {
      this.isLoading = true;
      try {
        const response = await axios.get("/emploi-du-temps/matrice/export", {
          ...this.authHeaders(),
          params: params,
          responseType: "blob",
        });
        return response;
      } catch (error) {
        console.error("Erreur export calendrier:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async importCalendar(file) {
      this.isLoading = true;

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post("/emploi-du-temps/import", formData, {
          ...this.authHeaders(),
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return response;
      } catch (error) {
        console.error("Erreur import calendrier:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async getEmploiDuTempsData(params) {
      this.isLoading = true;
      try {
        const response = await axios.get("/emploi-du-temps/data", {
          ...this.authHeaders(),
          params: params,
        });
        return response;
      } catch (error) {
        console.error("Erreur récupération données PDF:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
