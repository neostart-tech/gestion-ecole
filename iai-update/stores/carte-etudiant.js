import { defineStore } from 'pinia'
import { nextTick } from 'vue'
import axios from 'axios'
import { useEtudiantStore } from './etudiant'

export const useCarteEtudiantStore = defineStore('carte-etudiant', {
  state: () => ({
    cardsData: [],
    previewCardData: null,
    isLoading: false,
    isGenerating: false,
  }),

  actions: {
    authHeaders() {
      const token = localStorage.getItem('gest-ecole-token')
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      }
    },

    /**
     * Charge les données d'une ou plusieurs cartes depuis l'API
     */
    async fetchSelectedData(ids) {
      this.isLoading = true
      try {
        const response = await axios.post(
          '/student-cards/selected-data',
          { ids },
          this.authHeaders()
        )
        this.cardsData = response.data
        return response.data
      } catch (error) {
        console.error('Erreur chargement données cartes:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Prépare l'aperçu d'une carte individuelle
     */
    async loadPreview(etudiantId) {
      this.isLoading = true
      this.previewCardData = null
      try {
        const data = await this.fetchSelectedData([etudiantId])
        this.previewCardData = data[0] || null
        return this.previewCardData
      } catch (error) {
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Déclenche la génération PDF côté client
     */
    async generatePDF(ids, filename = null) {
      if (!ids || ids.length === 0) {
        throw new Error("Aucun étudiant sélectionné")
      }

      this.isGenerating = true
      try {
        // Le store charge les données dans cardsData
        await this.fetchSelectedData(ids)
        return true
      } catch (error) {
        console.error('[CARTE-STORE] Erreur préparation PDF:', error)
        throw error
      } finally {
        this.isGenerating = false
      }
    },
  },
})