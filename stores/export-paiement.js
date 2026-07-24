// stores/exportPaiement.js

import { defineStore } from "pinia";
import axios from "axios";
import { useNiveauStore } from "./niveau";
import { useFiliereStore } from "./filiere";
import { useEtudiantStore } from "./etudiant";

export const useExportPaiementStore = defineStore("exportPaiement", {
  state: () => ({
    // États de chargement
    isExporting: false,
    error: null,
    
    // Paramètres d'export
    exportParams: {
      type: 'global', // 'etudiant', 'niveau', 'filiere', 'global'
      id: null,
      periode_debut: null,
      periode_fin: null,
    },
    
    // Résultats de recherche d'étudiants
    etudiantsRecherche: [],
    isSearching: false,
    
    // Métadonnées
    lastUpdated: null,
  }),

  getters: {
    // Headers d'authentification
    authHeaders: () => {
      const token = localStorage.getItem("gest-ecole-token");
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
    },

    // Vérifier si les filtres sont valides
    isValidExport: (state) => {
      if (state.exportParams.type === 'global') return true;
      if (state.exportParams.type === 'etudiant') return !!state.exportParams.id;
      if (state.exportParams.type === 'niveau') return !!state.exportParams.id;
      if (state.exportParams.type === 'filiere') return !!state.exportParams.id;
      return false;
    },

    // Libellé du type d'export
    exportTypeLabel: (state) => {
      const labels = {
        etudiant: 'Étudiant spécifique',
        niveau: 'Par niveau',
        filiere: 'Par filière',
        global: 'Tous les étudiants'
      };
      return labels[state.exportParams.type] || 'Non défini';
    },

    // Récupérer le nom de l'élément sélectionné
    selectedItemName: (state) => {
      if (!state.exportParams.id) return '';
      
      const niveauStore = useNiveauStore();
      const filiereStore = useFiliereStore();
      
      if (state.exportParams.type === 'niveau') {
        const niveau = niveauStore.niveaux.find(n => n.id === state.exportParams.id);
        return niveau?.libelle || niveau?.nom || '';
      }
      
      if (state.exportParams.type === 'filiere') {
        const filiere = filiereStore.filieres.find(f => f.id === state.exportParams.id);
        return filiere?.nom || '';
      }
      
      if (state.exportParams.type === 'etudiant') {
        const etudiantStore = useEtudiantStore();
        const etudiant = etudiantStore.etudiants.find(e => e.id === state.exportParams.id) || 
                        state.etudiantsRecherche.find(e => e.id === state.exportParams.id);
        return etudiant ? `${etudiant.nom} ${etudiant.prenom}` : '';
      }
      
      return '';
    },
  },

  actions: {
    // Gestion des paramètres
    setExportType(type) {
      this.exportParams.type = type;
      this.exportParams.id = null;
    },

    setExportId(id) {
      this.exportParams.id = id;
    },

    setPeriode(debut, fin) {
      this.exportParams.periode_debut = debut;
      this.exportParams.periode_fin = fin;
    },

    resetParams() {
      this.exportParams = {
        type: 'global',
        id: null,
        periode_debut: null,
        periode_fin: null,
      };
      this.etudiantsRecherche = [];
    },

    // Recherche d'étudiants (en utilisant votre route existante)
    async rechercherEtudiants(searchTerm) {
      if (!searchTerm || searchTerm.length < 2) {
        this.etudiantsRecherche = [];
        return [];
      }

      this.isSearching = true;
      this.error = null;
      
      try {
        const response = await axios.get(
          `/etudiants/liste?search=${encodeURIComponent(searchTerm)}`,
          this.authHeaders
        );
        
        this.etudiantsRecherche = response.data.data || [];
        return this.etudiantsRecherche;
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur lors de la recherche";
        console.error("Erreur recherche étudiants:", error);
        return [];
      } finally {
        this.isSearching = false;
      }
    },

    // Export principal - CORRIGÉ avec le bon chemin
    async exportPaiements(params = null) {
      const exportData = params || this.exportParams;
      
      if (!this.isValidExport && !params) {
        throw new Error("Veuillez sélectionner tous les critères d'export");
      }

      this.isExporting = true;
      this.error = null;

      try {
        // CORRECTION: Utilisation du bon chemin d'API
        const response = await axios.post('/paiements/exports/paiements', exportData, {
          ...this.authHeaders,
          responseType: 'blob',
        });

        this.handleDownload(response);
        this.lastUpdated = new Date();
        
        return {
          success: true,
          message: 'Export effectué avec succès',
        };
      } catch (error) {
        return this.handleError(error);
      } finally {
        this.isExporting = false;
      }
    },

    // Méthodes d'export spécifiques
    async exportForEtudiant(etudiantId, periodeDebut = null, periodeFin = null) {
      return this.exportPaiements({
        type: 'etudiant',
        id: etudiantId,
        periode_debut: periodeDebut,
        periode_fin: periodeFin
      });
    },

    async exportForNiveau(niveauId, periodeDebut = null, periodeFin = null) {
      const niveauStore = useNiveauStore();
      const niveau = niveauStore.niveaux.find(n => n.id === niveauId);
      if (!niveau) {
        throw new Error("Niveau non trouvé");
      }

      return this.exportPaiements({
        type: 'niveau',
        id: niveauId,
        periode_debut: periodeDebut,
        periode_fin: periodeFin
      });
    },

    async exportForFiliere(filiereId, periodeDebut = null, periodeFin = null) {
      const filiereStore = useFiliereStore();
      const filiere = filiereStore.filieres.find(f => f.id === filiereId);
      if (!filiere) {
        throw new Error("Filière non trouvée");
      }

      return this.exportPaiements({
        type: 'filiere',
        id: filiereId,
        periode_debut: periodeDebut,
        periode_fin: periodeFin
      });
    },

    async exportAll(periodeDebut = null, periodeFin = null) {
      return this.exportPaiements({
        type: 'global',
        id: null,
        periode_debut: periodeDebut,
        periode_fin: periodeFin
      });
    },

    // Gestion du téléchargement
    handleDownload(response) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = response.headers['content-disposition'];
      let filename = this.generateFilename();
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },


async fetchExportData(params = null) {
  const exportData = params || this.exportParams;
  
  if (!this.isValidExport && !params) {
    throw new Error("Veuillez sélectionner tous les critères d'export");
  }

  try {
    const response = await axios.post('/paiements/exports/paiements-data', exportData, {
      ...this.authHeaders
    });
    
    return response.data;
  } catch (error) {
    console.error("Erreur récupération données:", error);
    throw error;
  }
},

    

    // Gestion des erreurs
    async handleError(error) {
      let errorMessage = "Erreur lors de l'export";
      
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const json = JSON.parse(text);
          errorMessage = json.message || errorMessage;
        } catch {
          errorMessage = "Erreur lors de l'export";
        }
      } else {
        errorMessage = error.response?.data?.message || error.message || errorMessage;
      }
      
      this.error = errorMessage;
      console.error("Erreur export:", error);
      throw new Error(errorMessage);
    },

    // Génération du nom de fichier
    generateFilename() {
      const date = new Date();
      const dateStr = date.toISOString().split('T')[0];
      const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-');
      
      let prefix = 'paiements';
      switch (this.exportParams.type) {
        case 'etudiant':
          prefix = `etudiant_${this.selectedItemName.replace(/\s+/g, '_')}`;
          break;
        case 'niveau':
          prefix = `niveau_${this.selectedItemName.replace(/\s+/g, '_')}`;
          break;
        case 'filiere':
          prefix = `filiere_${this.selectedItemName.replace(/\s+/g, '_')}`;
          break;
        case 'global':
          prefix = 'tous_etudiants';
          break;
      }
      
      return `export_${prefix}_${dateStr}_${timeStr}.xlsx`;
    },

    // Réinitialisation
    resetStore() {
      this.isExporting = false;
      this.error = null;
      this.exportParams = {
        type: 'global',
        id: null,
        periode_debut: null,
        periode_fin: null,
      };
      this.etudiantsRecherche = [];
      this.lastUpdated = null;
    },
  },
});

// Fonction utilitaire
function formatDateFr(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR');
}