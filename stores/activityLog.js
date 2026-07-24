import { defineStore } from "pinia";
import axios from "axios";

export const useActivityLogStore = defineStore("activityLog", {
  state: () => ({
    logs: [],
    modules: [],
    meta: { current_page: 1, last_page: 1, total: 0 },
    isLoading: false,
  }),

  actions: {
    authHeaders() {
      const token = localStorage.getItem("gest-ecole-token");
      return { headers: { Authorization: token ? `Bearer ${token}` : "" } };
    },

    async fetchLogs(filters = {}, page = 1) {
      this.isLoading = true;
      try {
        const response = await axios.get("/logs", {
          ...this.authHeaders(),
          params: { ...filters, page },
        });

        this.logs = response.data.data;
        this.meta = response.data.meta;
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

    // Historique personnel (self-service) : ne renvoie que l'activité de
    // l'utilisateur connecté, accessible sans la permission view-logs.
    async fetchMine(filters = {}, page = 1) {
      this.isLoading = true;
      try {
        const response = await axios.get("/logs/mine", {
          ...this.authHeaders(),
          params: { ...filters, page },
        });

        this.logs = response.data.data;
        this.meta = response.data.meta;
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchModules() {
      const response = await axios.get("/logs/modules", this.authHeaders());
      this.modules = response.data.data;
      return this.modules;
    },
  },
});
