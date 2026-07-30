import { defineStore } from 'pinia';
import axios from 'axios';

export const useDiagnosticFinancierStore = defineStore('diagnosticFinancier', {
  state: () => ({
    result: null,
    loading: false,
    error: null,
  }),

  getters: {
    authHeaders() {
      const token = localStorage.getItem('gest-ecole-token');
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      };
    }
  },

  actions: {
    async fetchDiagnostic() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('/finance/diagnostic/anomalies', this.authHeaders);
        this.result = response.data.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement du diagnostic';
        console.error('Error fetchDiagnostic:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
