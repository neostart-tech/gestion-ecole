import { defineStore } from 'pinia'
import axios from 'axios'

export const usePaiementStore = defineStore('paiement', {
  state: () => ({
    paiements: [],
    isLoading: false,
    error: null
  }),

  actions: {
    authHeaders() {
      const token = localStorage.getItem('gest-ecole-token')
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      }
    },

    async fetchByEtudiant(etudiantId) {
      this.isLoading = true
      try {
        const response = await axios.get(`/paiements/etudiant/${etudiantId}`, this.authHeaders())
        return response.data.data || []
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de chargement'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async create(data) {
      this.isLoading = true
      try {
        const response = await axios.post('/paiements', data, this.authHeaders())
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de paiement'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async annuler(id, motif) {
      this.isLoading = true
      try {
        const response = await axios.put(`/paiements/${id}/annuler`, { motif }, this.authHeaders())
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur d\'annulation'
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})