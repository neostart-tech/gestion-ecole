// stores/negociation.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useNegociationStore = defineStore('negociation', {
  state: () => ({
    negociations: [],
    currentNegociation: null,
    echeancesAVenir: [],
    echeancesEnRetard: [],
    stats: {
      total_etudiants: 0,
      en_cours: 0,
      en_retard: 0,
      solde: 0,
      montant_total: 0,
      montant_paye: 0
    },
    isLoading: false,
    error: null
  }),

  getters: {
    authHeaders: () => {
      const token = localStorage.getItem('gest-ecole-token')
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    },

    // Getters pour faciliter l'accès aux données
    getNegociationsEnCours: (state) => 
      state.negociations.filter(n => n.statut === 'en_cours'),
    
    getNegociationsEnRetard: (state) => 
      state.negociations.filter(n => n.statut === 'en_retard'),
    
    getNegociationsSoldees: (state) => 
      state.negociations.filter(n => n.statut === 'solde')
  },

  actions: {
    // Récupérer toutes les négociations
    async fetchNegociations() {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await axios.get('/admin/negociations', this.authHeaders)
        // Gérer le cas où la réponse est enveloppée dans une clé 'data'
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          this.negociations = response.data.data
        } else if (Array.isArray(response.data)) {
          this.negociations = response.data
        } else {
          this.negociations = []
          console.warn('Format de réponse inattendu pour les négociations:', response.data)
        }
        return this.negociations
      } catch (error) {
        this.negociations = []
        this.error = error.response?.data?.message || 'Erreur lors du chargement des négociations'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Récupérer une négociation spécifique
    async fetchNegociation(id) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await axios.get(`/admin/negociations/${id}`, this.authHeaders)
        this.currentNegociation = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement de la négociation'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Récupérer la négociation d'un étudiant pour l'année en cours
    async fetchNegociationByEtudiant(etudiantId, anneeScolaireId = null) {
      this.isLoading = true
      this.error = null
      
      try {
        let url = `/admin/negociations/etudiant/${etudiantId}`
        if (anneeScolaireId) {
          url += `?annee_scolaire_id=${anneeScolaireId}`
        }
        
        const response = await axios.get(url, this.authHeaders)
        return response.data
      } catch (error) {
        // Ne pas jeter l'erreur si c'est un 404 (cas normal où l'étudiant n'a pas encore de négociation)
        if (error.response?.status === 404) {
          return null
        }
        this.error = error.response?.data?.message || 'Erreur lors de la vérification de la négociation'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Créer une nouvelle négociation
    async createNegociation(data) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await axios.post('/admin/negociations', data, this.authHeaders)
        
        // Rafraîchir la liste après création
        await this.fetchNegociations()
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la création de la négociation'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Mettre à jour une négociation
    async updateNegociation(id, data) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await axios.put(`/admin/negociations/${id}`, data, this.authHeaders)
        
        // Mettre à jour la négociation dans la liste
        const index = this.negociations.findIndex(n => n.id === id)
        if (index !== -1) {
          this.negociations[index] = response.data
        }
        
        // Mettre à jour la négociation courante si c'est la même
        if (this.currentNegociation?.id === id) {
          this.currentNegociation = response.data
        }
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la mise à jour de la négociation'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Ajouter un paiement à une échéance
    async ajouterPaiement(negociationId, data) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await axios.post(
          `/admin/negociations/${negociationId}/ajouter-paiement`, 
          data, 
          this.authHeaders
        )
        
        // Rafraîchir la négociation courante pour voir le nouveau paiement
        if (this.currentNegociation?.id === negociationId) {
          await this.fetchNegociation(negociationId)
        }
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de l\'ajout du paiement'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Récupérer les données du dashboard
    async fetchDashboard() {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await axios.get('/admin/negociations/dashboard', this.authHeaders)
        
        this.stats = response.data.stats
        this.echeancesAVenir = response.data.echeances_a_venir
        this.echeancesEnRetard = response.data.echeances_en_retard
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement du dashboard'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Méthode utilitaire pour préparer les données de création
    prepareNegociationData(formData) {
      const data = {
        etudiant_id: formData.etudiant_id,
        frais_scolarite_id: formData.frais_scolarite_id,
        annee_scolaire_id: formData.annee_scolaire_id,
        type_paiement: formData.type_paiement,
        commentaire: formData.commentaire || null
      }

      // Ajouter la bourse si sélectionnée
      if (formData.bourse_etudiant_id) {
        data.bourse_etudiant_id = formData.bourse_etudiant_id
      }

      // Ajouter la fréquence pour les tranches globales
      if (formData.type_paiement === 'tranches_globales') {
        data.frequence_paiement = formData.frequence_paiement || 'annuel'
      }

      // Ajouter les échéances pour la négociation
      if (formData.type_paiement === 'negociation' && formData.echeances) {
        data.echeances = formData.echeances.map((e, index) => ({
          id: e.id || null,
          libelle: e.libelle,
          montant: parseFloat(e.montant),
          date_limite: e.date_limite,
          ordre: index + 1
        }))
      }

      return data
    },

    // Réinitialiser l'état
    resetState() {
      this.negociations = []
      this.currentNegociation = null
      this.echeancesAVenir = []
      this.echeancesEnRetard = []
      this.stats = {
        total_etudiants: 0,
        en_cours: 0,
        en_retard: 0,
        solde: 0,
        montant_total: 0,
        montant_paye: 0
      }
      this.isLoading = false
      this.error = null
    },

    // Effacer l'erreur courante
    clearError() {
      this.error = null
    }
  }
})