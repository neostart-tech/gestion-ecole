import { defineStore } from "pinia";
import axios from "axios";

export const useBackupStore = defineStore("backup", {
  state: () => ({
    backups: [],
    isLoading: false,
    isGenerating: false,
  }),

  actions: {
    authHeaders() {
      const token = localStorage.getItem("gest-ecole-token");
      return { headers: { Authorization: token ? `Bearer ${token}` : "" } };
    },

    async fetchBackups() {
      this.isLoading = true;
      try {
        const response = await axios.get("/backups", this.authHeaders());
        this.backups = response.data.backups || [];
        return this.backups;
      } finally {
        this.isLoading = false;
      }
    },

    async generateBackup(type = "db") {
      this.isGenerating = true;
      try {
        const response = await axios.post("/backups/generate", { type }, this.authHeaders());
        await this.fetchBackups();
        return response.data;
      } finally {
        this.isGenerating = false;
      }
    },

    async downloadBackup(filename) {
      const response = await axios.get(`/backups/download/${encodeURIComponent(filename)}`, {
        ...this.authHeaders(),
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    async deleteBackup(filename) {
      const response = await axios.delete(`/backups/${encodeURIComponent(filename)}`, this.authHeaders());
      await this.fetchBackups();
      return response.data;
    },
  },
});
