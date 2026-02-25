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
