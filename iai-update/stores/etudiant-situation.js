// stores/etudiant-situation.js

import { defineStore } from "pinia";
import axios from "axios";
import config from "~~/config";

export const useEtudiantSituationStore = defineStore("etudiantSituation", {
  state: () => ({
    // Données
    etudiants: [],
    filieres: [],
    niveaux: [],
    anneesScolaires: [],

    // États
    isLoading: false,
    isPageLoading: true,
    error: null,
    isExporting: false, // Nouvel état pour l'exportation

    // Filtres (pour les selects uniquement)
    filtres: {
      filiere_id: null,
      niveau_id: null,
      statut: null,
      annee_id: null,
    },

    // Statistiques calculées
    statistiques: {
      total: 0,
      par_statut: {
        solde: 0,
        en_cours: 0,
        en_retard: 0,
        aucun_frais: 0,
      },
      montants: {
        total_a_payer: 0,
        total_paye: 0,
        total_restant: 0,
      },
      retards: {
        total_etudiants_retard: 0,
        montant_total_impaye: 0,
        jours_retard_moyen: 0,
      },
    },
  }),

  getters: {
    // Données pour le tableau (Vue3Datatable fera la recherche et pagination)
    etudiantsData: (state) => {
      return state.etudiants.map((e) => ({
        ...e,
        // Ajouter des propriétés calculées pour faciliter l'affichage
        nom_complet: `${e.nom} ${e.prenom}`,
        filiere_nom: e.filiere || "Non assigné",
        niveau_libelle: e.niveau || "Non assigné",
        statut_classe: e.statut,
        statut_libelle: e.statut_libelle,
        en_retard: e.en_retard,
        progression: e.taux_progression,
        montant_restant_formatted: e.montant_restant_formatted,
        montant_paye_formatted: e.montant_paye_formatted,
        montant_total_formatted: e.montant_total_a_payer_formatted,
      }));
    },

    // Données filtrées par les selects (filière, niveau, statut)
    etudiantsFiltres: (state) => {
      let result = [...state.etudiantsData];

      // Filtre par filière
      if (state.filtres.filiere_id) {
        result = result.filter((e) => e.filiere_id == state.filtres.filiere_id);
      }

      // Filtre par niveau
      if (state.filtres.niveau_id) {
        result = result.filter((e) => e.niveau_id == state.filtres.niveau_id);
      }

      // Filtre par statut
      if (state.filtres.statut) {
        result = result.filter((e) => e.statut === state.filtres.statut);
      }

      return result;
    },

    // Statistiques mises à jour en fonction des filtres
    statistiquesFiltrees: (state) => {
      const filtered = state.etudiantsFiltres;

      const stats = {
        total: filtered.length,
        par_statut: {
          solde: 0,
          en_cours: 0,
          en_retard: 0,
          aucun_frais: 0,
        },
        montants: {
          total_a_payer: 0,
          total_paye: 0,
          total_restant: 0,
        },
        retards: {
          total_etudiants_retard: 0,
          montant_total_impaye: 0,
          jours_retard_moyen: 0,
        },
      };

      let sommeJoursRetard = 0;

      filtered.forEach((e) => {
        // Compter par statut
        stats.par_statut[e.statut]++;

        // Fonction pour extraire le nombre depuis une chaîne formatée
        const extraireMontant = (valeur) => {
          if (typeof valeur === "number") return valeur;
          if (typeof valeur === "string") {
            // Supprimer les espaces, "FCFA", et convertir en nombre
            const nettoye = valeur.replace(/\s/g, "").replace("FCFA", "");
            return parseFloat(nettoye) || 0;
          }
          return 0;
        };

        const montantAPayer = extraireMontant(e.montant_total_a_payer);
        const montantPaye = extraireMontant(e.montant_paye);
        const montantRestant = extraireMontant(e.montant_restant);

        stats.montants.total_a_payer += montantAPayer;
        stats.montants.total_paye += montantPaye;
        stats.montants.total_restant += montantRestant;

        // Statistiques des retards
        if (e.en_retard) {
          stats.retards.total_etudiants_retard++;
          stats.retards.montant_total_impaye += montantRestant;
          sommeJoursRetard += e.jours_retard_max || 0;
        }
      });

      // Calculer la moyenne des jours de retard
      stats.retards.jours_retard_moyen =
        stats.retards.total_etudiants_retard > 0
          ? Math.round(sommeJoursRetard / stats.retards.total_etudiants_retard)
          : 0;

      // Ajouter les pourcentages
      Object.keys(stats.par_statut).forEach((key) => {
        stats.par_statut[`${key}_pourcentage`] =
          stats.total > 0
            ? Math.round((stats.par_statut[key] / stats.total) * 100)
            : 0;
      });

      return stats;
    },

    // Données pour les cartes KPI
    kpis: (state) => {
      const stats = state.statistiquesFiltrees;

      return [
        {
          label: "Total étudiants",
          value: stats.total,
          icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
          bgColor: "bg-blue-100 dark:bg-blue-900/30",
          iconColor: "text-blue-600 dark:text-blue-400",
          details: [
            {
              label: "Soldé",
              value: stats.par_statut.solde,
              color: "text-emerald-600",
            },
            {
              label: "En cours",
              value: stats.par_statut.en_cours,
              color: "text-amber-600",
            },
            {
              label: "En retard",
              value: stats.par_statut.en_retard,
              color: "text-red-600",
            },
          ],
        },
        {
          label: "Montant total",
          value: formatMontant(stats.montants.total_a_payer),
          icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
          bgColor: "bg-purple-100 dark:bg-purple-900/30",
          iconColor: "text-purple-600 dark:text-purple-400",
          details: [
            {
              label: "Payé",
              value: formatMontant(stats.montants.total_paye),
              color: "text-emerald-600",
            },
            {
              label: "Restant",
              value: formatMontant(stats.montants.total_restant),
              color: "text-amber-600",
            },
          ],
        },
        {
          label: "Étudiants en retard",
          value: stats.retards.total_etudiants_retard,
          icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
          bgColor: "bg-red-100 dark:bg-red-900/30",
          iconColor: "text-red-600 dark:text-red-400",
          details: [
            {
              label: "Montant impayé",
              value: formatMontant(stats.retards.montant_total_impaye),
              color: "text-red-600",
            },
            {
              label: "Jours retard moy.",
              value: stats.retards.jours_retard_moyen + "j",
              color: "text-amber-600",
            },
          ],
        },
        {
          label: "Taux de collecte",
          value:
            stats.montants.total_a_payer > 0
              ? Math.round(
                  (stats.montants.total_paye / stats.montants.total_a_payer) *
                    100,
                ) + "%"
              : "0%",
          icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
          bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
          iconColor: "text-emerald-600 dark:text-emerald-400",
          progress:
            stats.montants.total_a_payer > 0
              ? Math.round(
                  (stats.montants.total_paye / stats.montants.total_a_payer) *
                    100,
                )
              : 0,
        },
      ];
    },

    // Options pour les filtres
    filtreOptions: (state) => ({
      filieres: [
        { value: null, label: "Toutes les filières" },
        ...state.filieres.map((f) => ({ value: f.id, label: f.nom })),
      ],
      niveaux: [
        { value: null, label: "Tous les niveaux" },
        ...state.niveaux.map((n) => ({ value: n.id, label: n.libelle })),
      ],
      statuts: [
        { value: null, label: "Tous les statuts" },
        { value: "solde", label: "Soldé", color: "emerald" },
        { value: "en_cours", label: "En cours", color: "amber" },
        { value: "en_retard", label: "En retard", color: "red" },
        { value: "aucun_frais", label: "Aucun frais", color: "gray" },
      ],
    }),
  },

  actions: {
    // Headers d'authentification
    authHeaders() {
      const token = localStorage.getItem("gest-ecole-token");
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
    },

    // Chargement initial des données (un seul appel API)
    async loadInitialData() {
      this.isPageLoading = true;
      this.error = null;

      try {
        const response = await axios.get(
          "/etudiants/situation",
          this.authHeaders(),
        );

        if (response.data && response.data.success) {
          this.etudiants = response.data.data.etudiants || [];
          this.filieres = response.data.data.filieres || [];
          this.niveaux = response.data.data.niveaux || [];
          this.anneesScolaires = response.data.data.annees_scolaires || [];

          // Mettre à jour les statistiques globales
          this.calculerStatistiquesGlobales();
        } else {
          console.error("Réponse API invalide:", response.data);
          this.error = "Format de réponse invalide";
        }
      } catch (error) {
        console.error("Erreur chargement données:", error);
        this.error = error.message || "Erreur de chargement";
      } finally {
        this.isPageLoading = false;
      }
    },

    // Calculer les statistiques globales à partir des données
    calculerStatistiquesGlobales() {
      const stats = {
        total: this.etudiants.length,
        par_statut: {
          solde: 0,
          en_cours: 0,
          en_retard: 0,
          aucun_frais: 0,
        },
        montants: {
          total_a_payer: 0,
          total_paye: 0,
          total_restant: 0,
        },
        retards: {
          total_etudiants_retard: 0,
          montant_total_impaye: 0,
          jours_retard_moyen: 0,
        },
      };

      let sommeJoursRetard = 0;

      this.etudiants.forEach((e) => {
        stats.par_statut[e.statut]++;

        // Fonction pour extraire le nombre depuis une chaîne formatée
        const extraireMontant = (valeur) => {
          if (typeof valeur === "number") return valeur;
          if (typeof valeur === "string") {
            // Supprimer les espaces, "FCFA", et convertir en nombre
            const nettoye = valeur.replace(/\s/g, "").replace("FCFA", "");
            return parseFloat(nettoye) || 0;
          }
          return 0;
        };

        const montantAPayer = extraireMontant(e.montant_total_a_payer);
        const montantPaye = extraireMontant(e.montant_paye);
        const montantRestant = extraireMontant(e.montant_restant);

        stats.montants.total_a_payer += montantAPayer;
        stats.montants.total_paye += montantPaye;
        stats.montants.total_restant += montantRestant;

        if (e.en_retard) {
          stats.retards.total_etudiants_retard++;
          stats.retards.montant_total_impaye += montantRestant;
          sommeJoursRetard += e.jours_retard_max || 0;
        }
      });

      stats.retards.jours_retard_moyen =
        stats.retards.total_etudiants_retard > 0
          ? Math.round(sommeJoursRetard / stats.retards.total_etudiants_retard)
          : 0;

      Object.keys(stats.par_statut).forEach((key) => {
        stats.par_statut[`${key}_pourcentage`] =
          stats.total > 0
            ? Math.round((stats.par_statut[key] / stats.total) * 100)
            : 0;
      });

      this.statistiques = stats;
    },

    // Mettre à jour un filtre
    setFiltre(key, value) {
      this.filtres[key] = value;
    },

    // Réinitialiser tous les filtres
    resetFiltres() {
      this.filtres = {
        filiere_id: null,
        niveau_id: null,
        statut: null,
        annee_id: null,
      };
    },

    // Rafraîchir les données
    async refreshData() {
      await this.loadInitialData();
    },

    // Exporter en Excel (appel API backend)
   async exporterExcel() {
      this.isExporting = true
      
      try {
        // Construire l'URL avec les filtres
        const params = new URLSearchParams()
        
        if (this.filtres.filiere_id) {
          params.append('filiere_id', this.filtres.filiere_id)
        }
        if (this.filtres.niveau_id) {
          params.append('niveau_id', this.filtres.niveau_id)
        }
        if (this.filtres.statut) {
          params.append('statut', this.filtres.statut)
        }
        
        const url = `/etudiants/situation/export/excel${params.toString() ? '?' + params.toString() : ''}`
        
        // Faire la requête avec axios
        const response = await axios.get(url, {
          ...this.authHeaders(),
          responseType: 'blob', // Important pour recevoir un fichier
        })
        
        // Créer un lien de téléchargement
        const blob = new Blob([response.data], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        })
        const link = document.createElement('a')
        const url_ = window.URL.createObjectURL(blob)
        
        // Extraire le nom du fichier de l'en-tête Content-Disposition si disponible
        const contentDisposition = response.headers['content-disposition']
        let filename = 'etudiants_situation.xlsx'
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '')
          }
        }
        
        link.href = url_
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url_)
        
      } catch (error) {
        console.error('Erreur exportation Excel:', error)
        throw error
      } finally {
        this.isExporting = false
      }
    },
    // Exporter en CSV (optionnel)
  async exporterCSV() {
      this.isExporting = true;

      try {
        const params = new URLSearchParams();

        if (this.filtres.filiere_id) {
          params.append("filiere_id", this.filtres.filiere_id);
        }
        if (this.filtres.niveau_id) {
          params.append("niveau_id", this.filtres.niveau_id);
        }
        if (this.filtres.statut) {
          params.append("statut", this.filtres.statut);
        }

        const url = `/etudiants/situation/export/csv${params.toString() ? "?" + params.toString() : ""}`;
        
        // Faire la requête avec axios
        const response = await axios.get(url, {
          ...this.authHeaders(),
          responseType: 'blob', // Important pour recevoir un fichier
        });

        // Créer un lien de téléchargement
        const blob = new Blob([response.data], { 
          type: 'text/csv;charset=utf-8;' 
        });
        
        // Créer l'URL du blob
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        // Extraire le nom du fichier de l'en-tête Content-Disposition
        let filename = 'etudiants_situation.csv';
        const contentDisposition = response.headers['content-disposition'];
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '');
          }
        }

        link.href = blobUrl;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);

      } catch (error) {
        console.error("Erreur exportation CSV:", error);
        throw error;
      } finally {
        this.isExporting = false;
      }
    }
  
  },
});

// Fonction utilitaire de formatage des montants
const formatMontant = (montant) => {
  if (montant === undefined || montant === null || isNaN(montant))
    return "0 FCFA";

  const nombre = Number(montant);
  if (isNaN(nombre)) return "0 FCFA";

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(nombre)
    .replace("XOF", "FCFA");
};
