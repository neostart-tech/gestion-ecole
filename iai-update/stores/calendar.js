import { defineStore } from "pinia";
import axios from "axios";

export const useCalendarStore = defineStore("calendar", {
  state: () => ({
    calendarData: [],
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
      } catch (error) {
        console.error("Erreur chargement calendrier:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async exportCalendar() {
      this.isLoading = true;

      try {
        const req = await axios.get(
          "/emploi-du-temps/matrice/export",
          this.authHeaders(),
        );

        this.calendarData = req.data.data;
      } catch (error) {
        console.error("Erreur chargement calendrier:", error);
      } finally {
        this.isLoading = false;
      }
    },
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
  },
});
