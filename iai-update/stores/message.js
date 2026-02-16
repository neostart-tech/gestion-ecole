import { defineStore } from "pinia";
import axios from "axios";

export const useMessageStore = defineStore("message", {
  state: () => ({
    messages: [],
    message: null,
    isLoading: false,
    totalUnread: 0,
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

    async fetchMessages() {
      this.isLoading = true;
      try {
        const response = await axios.get("/messages", this.authHeaders());
        this.messages = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des messages:", error);
      }
      this.isLoading = false;
    },

    // async getMessage(contact) {
    //   this.isLoading = true;
    //   try {
    //     const response = await axios.get(
    //       `/messages/${contact}`,
    //       this.authHeaders(),
    //     );
    //     this.message = response.data.data;
    //   } catch (error) {
    //     console.error("Erreur chargement des messages:", error);
    //   }
    //   this.isLoading = false;
    // },

    // async addMessage(payload) {
    //   this.isLoading = true;
    //   try {
    //     const response = await axios.post(
    //       "/opportunites/ajouter ",
    //       payload,
    //       this.authHeaders(),
    //     );
    //     this.annonces = response.data.data;
    //   } catch (error) {
    //     console.error("Erreur chargement des annonces:", error);
    //   }
    //   this.isLoading = false;
    // },
    async deleteMessage(contact) {
      this.isLoading = true;
      try {
        const response = await axios.delete(
          `/messages/${contact}`,
          this.authHeaders(),
        );
        this.messages = response.data.data;
      } catch (error) {
        throw error;

        console.error("Erreur chargement des messages:", error);
      }
      this.isLoading = false;
    },

    async MarkMessageAsRead(contact) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/messages/${contact}/lire`,
          this.authHeaders(),
        );
        this.messages = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des messages:", error);
      }
      this.isLoading = false;
    },

    async getCountUnreadMessage() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/messages/count-unread-message`,
          this.authHeaders(),
        );
        this.totalUnread = response.data.count;
      } catch (error) {
        console.error("Erreur chargement des messages:", error);
      }
      this.isLoading = false;
    },
  },
});
