import { defineStore } from "pinia";
import axios from "axios";

export const useStatistiqueStore = defineStore("statistique", {
	state: () => ({
		stats: {
			filieres: 0,
			etudiants: {
				licence: 0,
				master: 0,
				total: 0,
			},
			salles: {
				utilisees: 0,
				dispos: 0,
			},
			enseignants: 0,
			evaluations: 0,
			presenceTaux: 0,
			candidaturesEnAttente: 0,
			topFilieres: [],
			evalStats: { reussite: 0, validees: 0 },
			currentPeriode: { nom: 'S1' },
			periodes: [],
			communicationStats: {
				messages: { total: 0, non_lus: 0 },
				prospects: { total: 0, non_contactes: 0 },
				blogs: { total: 0, publies: 0 },
				evenements: { total: 0 },
				opportunites: { total: 0, actives: 0 },
				partenaires: { total: 0 }
			}
		},
		isLoading: false,
	}),

	actions: {
		authHeaders() {
			const token = localStorage.getItem("gest-ecole-token");
			return {
				headers: {
					Authorization: token ? `Bearer ${token}` : "",
				},
			};
		},

		// Récupère le nombre de filières pour l'année scolaire active
		async fetchNbreFilieres() {
			this.isLoading = true;
			try {
				const response = await axios.get(
					"/statistiques/filieres/nombre",
					this.authHeaders(),
				);
				this.stats.filieres = response.data;
			} catch (error) {
				console.error("Erreur chargement du nombre de filières:", error);
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		// Récupère le nombre d'étudiants par niveau (Licence/Master) pour l'année scolaire active
		async fetchNbreEtudiantsParNiveau() {
			this.isLoading = true;
			try {
				const response = await axios.get(
					"/statistiques/etudiants/niveaux",
					this.authHeaders(),
				);
				this.stats.etudiants.licence = response.data.licence;
				this.stats.etudiants.master = response.data.master;
			} catch (error) {
				console.error(
					"Erreur chargement du nombre d'étudiants par niveau:",
					error,
				);
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		// Récupère le nombre de salles utilisées pour une plage horaire donnée
		async fetchNbreSallesUtilisees(params = {}) {
			this.isLoading = true;
			try {
				const response = await axios.get("/statistiques/salles/utilisees", {
					...this.authHeaders(),
					params,
				});
				this.stats.salles.utilisees = response.data;
			} catch (error) {
				console.error(
					"Erreur chargement du nombre de salles utilisées:",
					error,
				);
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		// Récupère le nombre de salles disponibles pour une plage horaire donnée
		async fetchNbreSallesDispos(params = {}) {
			this.isLoading = true;
			try {
				const response = await axios.get("/statistiques/salles/dispos", {
					...this.authHeaders(),
					params,
				});
				this.stats.salles.dispos = response.data;
			} catch (error) {
				console.error(
					"Erreur chargement du nombre de salles disponibles:",
					error,
				);
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		// Récupère le nombre total d'étudiants pour l'année scolaire active ou une année spécifique
		async fetchNbreTotalEtudiants(anneeScolaireId = null) {
			this.isLoading = true;
			try {
				const url = anneeScolaireId
					? `/statistiques/etudiants/total/${anneeScolaireId}`
					: "/statistiques/etudiants/total";
				const response = await axios.get(url, this.authHeaders());
				this.stats.etudiants.total = response.data;
			} catch (error) {
				console.error("Erreur chargement du nombre total d'étudiants:", error);
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		// Récupère le nombre d'enseignants
		async fetchNbreEnseignants() {
			try {
				const response = await axios.get("/statistiques/enseignants/nombre", this.authHeaders());
				this.stats.enseignants = response.data;
			} catch (error) {
				console.error("Erreur enseignants:", error);
			}
		},

		// Récupère le nombre d'évaluations
		async fetchNbreEvaluations() {
			try {
				const response = await axios.get("/statistiques/evaluations/nombre", this.authHeaders());
				this.stats.evaluations = response.data;
			} catch (error) {
				console.error("Erreur évaluations:", error);
			}
		},

		// Récupère le taux de présence
		async fetchTauxPresence() {
			try {
				const response = await axios.get("/statistiques/presences/taux", this.authHeaders());
				this.stats.presenceTaux = response.data;
			} catch (error) {
				console.error("Erreur taux présence:", error);
			}
		},

		// Récupère les candidatures en attente
		async fetchCandidaturesEnAttente() {
			try {
				const response = await axios.get("/statistiques/candidatures/en-attente", this.authHeaders());
				this.stats.candidaturesEnAttente = response.data;
			} catch (error) {
				console.error("Erreur candidatures:", error);
			}
		},

		// Récupère le top des filières
		async fetchTopFilieres() {
			try {
				const response = await axios.get("/statistiques/filieres/top", this.authHeaders());
				this.stats.topFilieres = response.data;
			} catch (error) {
				console.error("Erreur top filières:", error);
			}
		},

		// Récupère les stats d'évaluations réelles
		async fetchEvalStats(params = {}) {
			try {
				const response = await axios.get("/statistiques/evaluations/stats", {
					params: params,
					...this.authHeaders()
				});
				this.stats.evalStats = response.data;
			} catch (error) {
				console.error("Erreur stats évaluations:", error);
			}
		},

		// Récupère la période actuelle
		async fetchCurrentPeriode() {
			try {
				const response = await axios.get("/statistiques/periodes/current", this.authHeaders());
				if (response.data) {
					this.stats.currentPeriode = response.data;
				}
			} catch (error) {
				console.error("Erreur période actuelle:", error);
			}
		},

		// Récupère toutes les périodes
		async fetchPeriodes() {
			try {
				const response = await axios.get("/statistiques/periodes", this.authHeaders());
				this.stats.periodes = response.data;
			} catch (error) {
				console.error("Erreur liste périodes:", error);
			}
		},

		// Récupère les stats de communication
		async fetchCommunicationStats() {
			this.isLoading = true;
			try {
				const response = await axios.get("/statistiques/communication", this.authHeaders());
				this.stats.communicationStats = response.data;
			} catch (error) {
				console.error("Erreur communication stats:", error);
			} finally {
				this.isLoading = false;
			}
		},

		// Charge toutes les statistiques d'un coup
		async fetchAllStats(params = {}) {
			this.isLoading = true;
			try {
				await Promise.all([
					this.fetchNbreFilieres(),
					this.fetchNbreEtudiantsParNiveau(),
					this.fetchNbreSallesUtilisees(params),
					this.fetchNbreSallesDispos(params),
					this.fetchNbreTotalEtudiants(),
					this.fetchNbreEnseignants(),
					this.fetchNbreEvaluations(),
					this.fetchTauxPresence(),
					this.fetchCandidaturesEnAttente(),
					this.fetchTopFilieres(),
					this.fetchEvalStats(),
					this.fetchCurrentPeriode(),
					this.fetchPeriodes(),
				]);
			} catch (error) {
				console.error("Erreur chargement des statistiques:", error);
				throw error;
			} finally {
				this.isLoading = false;
			}
		},
	},
});
