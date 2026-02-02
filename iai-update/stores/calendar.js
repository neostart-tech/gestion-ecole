import { defineStore } from "pinia";
import axios from "axios";

export const useCalendarStore = defineStore("calendar", {
  state: () => ({
    calendarData: [],
    isLoading: false,
  }),

  actions: {
    authHeaders() {
      const token = localStorage.getItem("token");
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
  },
});
