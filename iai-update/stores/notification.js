import { defineStore } from "pinia";
import axios from "axios";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [],
    unreadNotifications: [],
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
    async fetchNotifications() {
      this.isLoading = true;
      try {
        const response = await axios.get("/notifications", this.authHeaders());

        this.notifications = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des notifications:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUnreadNotifications() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/notifications/unread",
          this.authHeaders(),
        );

        this.unreadNotifications = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des notifications:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteNotification(id) {
      this.isLoading = true;
      try {
        const response = await axios.delete(
          `/notifications/${id}`,
          this.authHeaders(),
        );

        this.notifications = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des notifications:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async markNotificationAsRead(id) {
      this.isLoading = true;
      try {
        const response = await axios.patch(
          `/notifications/${id}/read`,
          null,
          this.authHeaders(),
        );

        this.notifications = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des notifications:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async markAllNotificationAsRead(id) {
      this.isLoading = true;
      try {
        const response = await axios.patch(
          `/notifications/read-all`,
          null,
          this.authHeaders(),
        );

        this.notifications = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des notifications:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
