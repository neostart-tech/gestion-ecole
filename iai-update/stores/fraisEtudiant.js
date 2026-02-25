import { defineStore } from 'pinia'
import axios from 'axios'

export const useFraisEtudiantStore = defineStore('fraisEtudiant', {
  state: () => ({
    frais: [],
    fraisCourant: null,
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

    async fetchAll() {
      this.isLoading = true
      try {
        const response = await axios.get('/frais-etudiants', this.authHeaders())
        this.frais = response.data.data || []
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de chargement'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchOne(id) {
      this.isLoading = true
      try {
        const response = await axios.get(`/frais-etudiants/${id}`, this.authHeaders())
        this.fraisCourant = response.data.data
        return this.fraisCourant
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
        const response = await axios.post('/frais-etudiants', data, this.authHeaders())
        await this.fetchAll()
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de création'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async update(id, data) {
      this.isLoading = true
      try {
        const response = await axios.put(`/frais-etudiants/${id}`, data, this.authHeaders())
        await this.fetchAll()
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de modification'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async delete(id) {
      this.isLoading = true
      try {
        const response = await axios.delete(`/frais-etudiants/${id}`, this.authHeaders())
        await this.fetchAll()
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de suppression'
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})