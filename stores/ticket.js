import { defineStore } from "pinia";
import axios from "axios";

export const useTicketStore = defineStore("ticket", {
  state: () => ({
    tickets: [],
    categories: [],
    currentTicket: null,
    isLoading: false,
  }),

  getters: {
    nombreTickets: (state) => state.tickets.length,
    ticketsOuverts: (state) => state.tickets.filter(t => t.status === 'open').length,
    ticketsEnCours: (state) => state.tickets.filter(t => t.status === 'in_progress').length,
    ticketsResolus: (state) => state.tickets.filter(t => ['resolved', 'closed'].includes(t.status)).length,
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
        const response = await axios.get("/support/tickets", this.authHeaders());
        this.tickets = response.data.data;
      } catch (error) {
        console.error("Erreur chargement tickets:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCategories() {
      try {
        const response = await axios.get("/support/categories", this.authHeaders());
        this.categories = response.data.data;
      } catch (error) {
        console.error("Erreur chargement catégories:", error);
      }
    },

    async addTicket(ticketData) {
      this.isLoading = true;
      try {
        const response = await axios.post("/support/tickets", ticketData, this.authHeaders());
        await this.fetchTickets(); // Refresh list
        return response.data;
      } catch (error) {
        console.error("Erreur création ticket:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchTicketDetails(ticketId) {
      this.isLoading = true;
      try {
        const response = await axios.get(`/support/tickets/${ticketId}`, this.authHeaders());
        this.currentTicket = response.data.data;
        return response.data.data;
      } catch (error) {
        console.error("Erreur chargement détails ticket:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async sendMessage(ticketId, formData) {
      try {
        const config = this.authHeaders();
        if (formData instanceof FormData) {
          config.headers['Content-Type'] = 'multipart/form-data';
        }
        
        const response = await axios.post(`/support/tickets/${ticketId}/messages`, formData, config);
        if (this.currentTicket && this.currentTicket.id === ticketId) {
          if (!this.currentTicket.messages) this.currentTicket.messages = [];
          this.currentTicket.messages.push(response.data.data);
        }
        return response.data;
      } catch (error) {
        console.error("Erreur envoi message:", error);
        throw error;
      }
    },

    async updateMessage(messageId, formData) {
      try {
        const config = this.authHeaders();
        if (formData instanceof FormData) {
          config.headers['Content-Type'] = 'multipart/form-data';
        }
        
        const response = await axios.post(`/support/messages/${messageId}?_method=PUT`, formData, config);
        if (this.currentTicket) {
          const idx = this.currentTicket.messages.findIndex(m => m.id === messageId);
          if (idx !== -1) {
            this.currentTicket.messages[idx] = response.data.data;
          }
        }
        return response.data;
      } catch (error) {
        console.error("Erreur modification message:", error);
        throw error;
      }
    },

    async deleteMessage(messageId) {
      try {
        await axios.delete(`/support/messages/${messageId}`, this.authHeaders());
        if (this.currentTicket) {
          this.currentTicket.messages = this.currentTicket.messages.filter(m => m.id !== messageId);
        }
      } catch (error) {
        console.error("Erreur suppression message:", error);
        throw error;
      }
    },

    async updateTicketStatus(ticketId, status) {
      try {
        const response = await axios.put(`/support/tickets/${ticketId}/status`, { status }, this.authHeaders());
        const index = this.tickets.findIndex(t => t.id === ticketId);
        if (index !== -1) {
          this.tickets[index].status = status;
        }
        if (this.currentTicket && this.currentTicket.id === ticketId) {
          this.currentTicket.status = status;
        }
        return response.data;
      } catch (error) {
        console.error("Erreur mise à jour statut:", error);
        throw error;
      }
    },

    async assignTicket(ticketId, assignData) {
      try {
        const response = await axios.post(`/support/tickets/${ticketId}/assign`, assignData, this.authHeaders());
        if (this.currentTicket && this.currentTicket.id === ticketId) {
          this.currentTicket.assigned_agent = response.data.data.assigned_agent;
          this.currentTicket.status = response.data.data.status;
        }
        await this.fetchTickets(); // Refresh list to show assigned agent
        return response.data;
      } catch (error) {
        console.error("Erreur assignation ticket:", error);
        throw error;
      }
    },

    async rateTicket(ticketId, ratingData) {
      try {
        const response = await axios.post(`/support/tickets/${ticketId}/rate`, ratingData, this.authHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur évaluation ticket:", error);
        throw error;
      }
    },

    // Garder par compatibilité si nécessaire mais rediriger vers updateTicketStatus
    async closeTicket(ticketId) {
      return this.updateTicketStatus(ticketId, 'closed');
    }
  },
});