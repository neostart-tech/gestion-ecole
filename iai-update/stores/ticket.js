import { defineStore } from "pinia";
import axios from "axios";

export const useTicketStore = defineStore("ticket", {
  state: () => ({
    tickets: [],
    isLoading: false,
  }),

  getters: {
    nombreTickets: (state) => state.tickets.length,
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

    async fetchTickets() {
      this.isLoading = true;

      try {
        const response = await axios.get(
          "/tickets/liste",
          this.authHeaders()
        );

        this.tickets = response.data.data;
      } catch (error) {
        console.error("Erreur chargement tickets:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async addTicket(ticketData) {
      this.isLoading = true;

      try {
        const response = await axios.post(
          "/tickets/ajouter",
          ticketData,
          this.authHeaders()
        );

        this.tickets.push(response.data.data ?? response.data);

        return response.data;
      } catch (error) {
        console.error("Erreur création ticket:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteTicket(ticketId) {
      this.isLoading = true;

      try {
        await axios.delete(
          `/tickets/${ticketId}/supprimer`,
          this.authHeaders()
        );

        this.tickets = this.tickets.filter(
          (t) => t.id !== ticketId
        );
      } catch (error) {
        console.error("Erreur suppression ticket:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async closeTicket(ticketId) {
      this.isLoading = true;

      try {
        const response = await axios.post(
          `/tickets/${ticketId}/fermer`,
          {},
          this.authHeaders()
        );

        const index = this.tickets.findIndex(
          (t) => t.id === ticketId
        );

        if (index !== -1) {
          this.tickets[index].status = "closed";
        }

        return response.data;
      } catch (error) {
        console.error("Erreur fermeture ticket:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});