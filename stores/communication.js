import { defineStore } from "pinia";
import axios from "axios";

export const useCommunicationStore = defineStore("communication", {
  state: () => ({
    communications: [],
    unreadCount: 0,
    currentCommunication: null,
    isLoading: false,
    pagination: {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 20,
    },
  }),

  actions: {
    getHeaders() {
      const token = localStorage.getItem("gest-ecole-token");
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
    },

    async fetchCommunications(page = 1) {
      this.isLoading = true;
      try {
        const response = await axios.get(`/communications?page=${page}`, this.getHeaders());
        this.communications = response.data.data;
        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          total: response.data.total,
          per_page: response.data.per_page,
        };
      } catch (error) {
        console.error("Erreur fetch communications:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUnreadCount() {
      try {
        const response = await axios.get("/communications/unread-count", this.getHeaders());
        this.unreadCount = response.data.unread_count;
      } catch (error) {
        console.error("Erreur fetch unread count:", error);
      }
    },

    async fetchAdminCommunications(page = 1) {
      this.isLoading = true;
      try {
        const response = await axios.get(`/admin/communications?page=${page}`, this.getHeaders());
        this.communications = response.data.data;
        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          total: response.data.total,
          per_page: response.data.per_page,
        };
      } catch (error) {
        console.error("Erreur fetch admin communications:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async createCommunication(data) {
      this.isLoading = true;
      try {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
          if (key === 'target_data' && Array.isArray(data[key])) {
            data[key].forEach(id => formData.append('target_data[]', id));
          } else if (key === 'attachments' && data[key]) {
            for (let i = 0; i < data[key].length; i++) {
              formData.append('attachments[]', data[key][i]);
            }
          } else if (typeof data[key] === 'boolean') {
            formData.append(key, data[key] ? 1 : 0);
          } else if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
          }
        });

        const response = await axios.post("/admin/communications", formData, {
          headers: {
            ...this.getHeaders().headers,
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error) {
        console.error("Erreur creation communication:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateCommunication(uuid, data) {
      this.isLoading = true;
      try {
        const response = await axios.put(`/admin/communications/${uuid}`, data, this.getHeaders());
        return response.data;
      } catch (error) {
        console.error("Erreur update communication:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteCommunication(uuid) {
      try {
        await axios.delete(`/admin/communications/${uuid}`, this.getHeaders());
        this.communications = this.communications.filter(c => c.uuid !== uuid);
      } catch (error) {
        console.error("Erreur delete communication:", error);
        throw error;
      }
    },

    async markAsRead(uuid) {
      try {
        await axios.post(`/communications/${uuid}/mark-as-read`, {}, this.getHeaders());
        this.fetchUnreadCount();
      } catch (error) {
        console.error("Erreur mark as read:", error);
      }
    },

    async uploadAttachments(uuid, files) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files[]', files[i]);
      }
      try {
        const response = await axios.post(`/admin/communications/${uuid}/attachments`, formData, {
          headers: {
            ...this.getHeaders().headers,
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error) {
        console.error("Erreur upload attachments:", error);
        throw error;
      }
    },

    async deleteAttachment(id) {
      try {
        await axios.delete(`/admin/communications/attachments/${id}`, this.getHeaders());
      } catch (error) {
        console.error("Erreur delete attachment:", error);
        throw error;
      }
    },

    async fetchCommunication(uuid) {
      this.isLoading = true;
      try {
        const response = await axios.get(`/admin/communications/${uuid}`, this.getHeaders());
        this.currentCommunication = response.data;
        return response.data;
      } catch (error) {
        console.error("Erreur fetch communication:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
