import { defineStore } from 'pinia';
import axios from 'axios';

export const useDepenseStore = defineStore('depense', {
  state: () => ({
    depenses: [],
    loading: false,
    error: null,
    stats: []
  }),

  getters: {
    authHeaders() {
      const token = localStorage.getItem('gest-ecole-token');
      return {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      };
    },
    totalDepenses: (state) => state.depenses.reduce((acc, dep) => acc + parseFloat(dep.montant), 0)
  },

  actions: {
    async fetchDepenses(params = {}) {
      this.loading = true;
      try {
        const response = await axios.get('/finance/depenses', {
          params,
          ...this.authHeaders
        });
        this.depenses = response.data.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des dépenses';
        console.error('Error fetchDepenses:', error);
      } finally {
        this.loading = false;
      }
    },

    async storeDepense(data) {
      this.loading = true;
      try {
        const response = await axios.post('/finance/depenses', data, this.authHeaders);
        this.depenses.unshift(response.data.data);
        return response.data;
      } catch (error) {
        console.error('Error storeDepense:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteDepense(id) {
      try {
        const response = await axios.delete(`/finance/depenses/${id}`, this.authHeaders);
        this.depenses = this.depenses.filter(d => d.id !== id);
        return response.data;
      } catch (error) {
        console.error('Error deleteDepense:', error);
        throw error;
      }
    },

    async updateDepense(id, data) {
      this.loading = true;
      try {
        const response = await axios.put(`/finance/depenses/${id}`, data, this.authHeaders);
        const index = this.depenses.findIndex(d => d.id === parseInt(id));
        if (index !== -1) {
          this.depenses[index] = response.data.data;
        }
        return response.data;
      } catch (error) {
        console.error('Error updateDepense:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchStats() {
      try {
        const response = await axios.get('/finance/depenses/stats', this.authHeaders);
        this.stats = response.data.data;
        return response.data;
      } catch (error) {
        console.error('Error fetchStats:', error);
      }
    }
  }
});
