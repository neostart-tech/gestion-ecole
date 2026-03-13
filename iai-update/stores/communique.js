// stores/communiqueStore.js
import { defineStore } from "pinia";
import axios from "axios";

export const useCommuniqueStore = defineStore("communique", {
  state: () => ({
    communiques: [],
    unreadCommuniques: [],
    stats: null,
    ciblageOptions: null,
    isLoading: false,
    pagination: {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 15,
    },
  }),

  getters: {
    // Compter les communiqués non lus
    unreadCount: (state) => {
      return state.communiques.filter(c => !c.lu).length;
    },
    
    // Grouper par date
    communiquesParDate: (state) => {
      const groups = {};
      state.communiques.forEach(communique => {
        const date = communique.recu_le.split(' ')[0];
        if (!groups[date]) groups[date] = [];
        groups[date].push(communique);
      });
      return groups;
    },
    
    // Filtrer par niveau d'importance
    communiquesParNiveau: (state) => (level) => {
      return state.communiques.filter(c => c.level === level);
    }
  },

  actions: {
    // Headers d'authentification
    authHeaders() {
      const token = localStorage.getItem("gest-ecole-token");
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data", // Pour les pièces jointes
        },
      };
    },

    // Headers pour JSON (sans multipart)
    jsonHeaders() {
      const token = localStorage.getItem("gest-ecole-token");
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      };
    },

 
    async fetchMesCommuniques({ page = 1, filter = 'all' } = {}) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/etudiant/mes-communiques?page=${page}&filter=${filter}`,
          this.jsonHeaders()
        );

        if (response.data.success) {
          this.communiques = response.data.data.items;
          this.pagination = {
            current_page: response.data.data.current_page,
            last_page: response.data.data.last_page,
            total: response.data.data.total,
            per_page: 15,
          };
          
          // Mettre à jour aussi les non lus
          this.unreadCommuniques = this.communiques.filter(c => !c.lu);
        }
        
        return response.data;
      } catch (error) {
        console.error("Erreur chargement des communiqués:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Récupérer un communiqué spécifique
    async fetchCommunique(id) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/etudiant/communiques/${id}`,
          this.jsonHeaders()
        );

        if (response.data.success) {
          // Mettre à jour dans la liste si existant
          const index = this.communiques.findIndex(c => c.id === id);
          if (index !== -1) {
            this.communiques[index] = response.data.data;
          }
        }
        
        return response.data;
      } catch (error) {
        console.error("Erreur chargement du communiqué:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Marquer un communiqué comme lu
    async markAsRead(id) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          `/etudiant/communiques/${id}/lu`,
          null,
          this.jsonHeaders()
        );

        if (response.data.success) {
          // Mettre à jour le statut dans la liste
          const communique = this.communiques.find(c => c.id === id);
          if (communique) {
            communique.lu = true;
            communique.lu_le = new Date().toISOString();
          }
          
          // Mettre à jour la liste des non lus
          this.unreadCommuniques = this.communiques.filter(c => !c.lu);
        }
        
        return response.data;
      } catch (error) {
        console.error("Erreur marquage du communiqué:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Marquer tous les communiqués comme lus
    async markAllAsRead() {
      this.isLoading = true;
      try {
        const response = await axios.post(
          `/etudiant/communiques/tout/lu`,
          null,
          this.jsonHeaders()
        );

        if (response.data.success) {
          // Marquer tous comme lus
          this.communiques = this.communiques.map(c => ({
            ...c,
            lu: true,
            lu_le: new Date().toISOString()
          }));
          this.unreadCommuniques = [];
        }
        
        return response.data;
      } catch (error) {
        console.error("Erreur marquage tous les communiqués:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

  
    async fetchCiblageOptions(anneeScolaireId = null) {
      this.isLoading = true;
      try {
        let url = '/admin/communiques/options-ciblage';
        if (anneeScolaireId) {
          url += `?annee_scolaire_id=${anneeScolaireId}`;
        }
        
        const response = await axios.get(url, this.jsonHeaders());

        if (response.data.success) {
          this.ciblageOptions = response.data.data;
        }
        
        return response.data;
      } catch (error) {
        console.error("Erreur chargement options ciblage:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Envoyer un nouveau communiqué (admin)
    async sendCommunique(formData) {
      this.isLoading = true;
      try {
        // Si c'est un FormData, l'utiliser directement
        let data = formData;
        
        // Sinon, créer un FormData à partir de l'objet
        if (!(formData instanceof FormData)) {
          data = new FormData();
          
          // Champs simples
          data.append('titre', formData.titre);
          data.append('contenu', formData.contenu);
          data.append('date_publication', formData.date_publication);
          if (formData.date_expiration) {
            data.append('date_expiration', formData.date_expiration);
          }
          if (formData.level) {
            data.append('level', formData.level);
          }
          
          // Type de cible
          data.append('cible_type', formData.cible_type);
          
          // IDs des cibles (si tableau)
          if (formData.cible_ids && Array.isArray(formData.cible_ids)) {
            formData.cible_ids.forEach(id => {
              data.append('cible_ids[]', id);
            });
          }
          
          // Année scolaire pour "tous"
          if (formData.annee_scolaire_id) {
            data.append('annee_scolaire_id', formData.annee_scolaire_id);
          }
          
          // Pièce jointe
          if (formData.piece_jointe) {
            data.append('piece_jointe', formData.piece_jointe);
          }
        }

        const response = await axios.post(
          '/admin/communiques',
          data,
          this.authHeaders() // Headers avec multipart/form-data
        );

        return response.data;
      } catch (error) {
        console.error("Erreur envoi communiqué:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Récupérer les statistiques (admin)
    async fetchStats() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          '/admin/communiques/statistiques',
          this.jsonHeaders()
        );

        if (response.data.success) {
          this.stats = response.data.data;
        }
        
        return response.data;
      } catch (error) {
        console.error("Erreur chargement statistiques:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Rechercher des étudiants (pour le ciblage)
    async searchEtudiants(query, anneeScolaireId = null) {
      try {
        let url = `/admin/ciblage/recherche-etudiants?q=${query}`;
        if (anneeScolaireId) {
          url += `&annee_scolaire_id=${anneeScolaireId}`;
        }
        
        const response = await axios.get(url, this.jsonHeaders());

        if (response.data.success) {
          return response.data.data;
        }
        
        return [];
      } catch (error) {
        console.error("Erreur recherche étudiants:", error);
        return [];
      }
    },

    // ========================================
    // UTILITAIRES
    // ========================================

    // Télécharger une pièce jointe
    async downloadAttachment(communique) {
      if (!communique.piece_jointe) {
        console.error("Pas de pièce jointe");
        return;
      }

      try {
        // Ouvrir dans un nouvel onglet
        window.open(communique.piece_jointe, '_blank');
      } catch (error) {
        console.error("Erreur téléchargement:", error);
      }
    },

    // Reset du store
    resetStore() {
      this.communiques = [];
      this.unreadCommuniques = [];
      this.stats = null;
      this.ciblageOptions = null;
      this.isLoading = false;
      this.pagination = {
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 15,
      };
    },
  },
});