import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
	state: () => ({
		users: [],
		enseignants: [],
		enseignant: null,
		user: null,
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
		async fetchUsersEnseignant() {
			this.isLoading = true;
			try {
				const response = await axios.get(
					"/users/liste-des-enseignants",
					this.authHeaders(),
				);

				this.enseignants = response.data.data;
			} catch (error) {
				console.error("Erreur chargement des enseignants:", error);
				throw error;
			} finally {
				this.isLoading = false;
			}
		},
		async fetchUsers() {
			this.isLoading = true;
			try {
				const response = await axios.get("/users/liste", this.authHeaders());

				this.users = response.data.data;
			} finally {
				this.isLoading = false;
			}
		},

		async addUser(payload) {
			this.isLoading = true;
			try {
				const response = await axios.post(
					"/users/create",
					payload,
					this.authHeaders(),
				);
				// ajoute l'utilisateur dans le store si la réponse contient bien l'utilisateur
				if (response.data?.data) {
					this.users.unshift(response.data.data);
				}

				return response.data; // retourne ce qui vient du serveur
			} finally {
				this.isLoading = false;
			}
		},

		async updateUser(id, updatedData) {
			this.isLoading = true;
			try {
				const response = await axios.put(
					`/users/${id}/update`,
					updatedData,
					this.authHeaders(),
				);
				const index = this.users.findIndex((u) => u.id === id);

				if (index !== -1) {
					this.users[index] = response.data.data ?? response.data;
				}
				return response.data;
			} finally {
				this.isLoading = false;
			}
		},

		async deleteUser(id) {
			this.isLoading = true;
			try {
				await axios.delete(`/users/${id}/delete`, this.authHeaders());

				// retirer l'utilisateur du store
				this.users = this.users.filter((u) => u.id !== id);
			} catch (error) {
				console.error("Erreur suppression utilisateur :", error);
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		async updateFiliere(filiereId, updatedData) {
			this.isLoading = true;
			try {
				const response = await axios.put(
					`/filieres/${filiereId}/modifier`,
					updatedData,
					this.authHeaders(),
				);

				const index = this.filieres.findIndex((f) => f.id === filiereId);

				if (index !== -1) {
					this.filieres[index] = response.data.data ?? response.data;
				}

				return response.data;
			} finally {
				this.isLoading = false;
			}
		},
	},
});
