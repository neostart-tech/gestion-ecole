<template>
	<div
		class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
	>
		<!-- Main content seulement -->
		<main class="p-4 md:p-6">
			<!-- Page Header -->
			<div class="mb-6">
				<div class="flex flex-col md:flex-row md:items-center justify-between">
					<div>
						<h1 class="text-2xl font-bold text-gray-800 dark:text-white">
							Mon emploi de temps
						</h1>
						<nav class="flex mt-2" aria-label="Breadcrumb">
							<ol class="inline-flex items-center space-x-1 md:space-x-3">
								<li class="inline-flex items-center">
									<span
										class="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-400"
									>
										Mon emploi de temps
									</span>
								</li>
								<li aria-current="page">
									<div class="flex items-center">
										<svg
											class="w-3 h-3 mx-1 text-gray-400"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 6 10"
										>
											<path
												stroke="currentColor"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="m1 9 4-4-4-4"
											/>
										</svg>
										<span
											class="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:ml-2"
											>Mes cours</span
										>
									</div>
								</li>
							</ol>
						</nav>
					</div>

					<!-- Bouton pour retour à l'accueil ou actions -->
					<div class="mt-4 md:mt-0 flex items-center space-x-3">
						<button
							@click="refreshData"
							class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
						>
							<svg
								class="w-4 h-4 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
							Actualiser
						</button>
					</div>
				</div>
			</div>

			<!-- Zone de recherche et filtres -->
			<div class="search-filter-area mb-6">
				<!-- Recherche -->
				<div class="relative">
					<div
						class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
					>
						<svg
							class="h-5 w-5 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
					<input
						v-model="searchQuery"
						type="search"
						class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
						placeholder="Rechercher un cours..."
					/>
				</div>

				<!-- Sélecteur de colonnes -->
				<div class="relative">
					<button
						class="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
						@click="toggleColumnSelector"
					>
						<span>Colonnes visibles</span>
						<svg
							class="w-5 h-5 transition-transform duration-200"
							:class="{ 'rotate-180': showColumnSelector }"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>
					<div
						v-if="showColumnSelector"
						class="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 min-w-[200px]"
					>
						<div class="p-3 space-y-2 max-h-60 overflow-y-auto">
							<div
								v-for="col in availableColumns"
								:key="col.field"
								class="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
							>
								<input
									type="checkbox"
									:id="col.field"
									v-model="selectedColumns"
									:value="col.field"
									class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:border-gray-600"
								/>
								<label
									:for="col.field"
									class="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
									>{{ col.title }}</label
								>
							</div>
						</div>
					</div>
				</div>

				<!-- Bouton Ajouter un cours -->
				<button
					class="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
					@click="addCourse"
				>
					<svg
						class="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
					Ajouter un cours
				</button>
			</div>

			<!-- Card de la liste des cours -->
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow">
				<div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<div class="flex justify-between items-center">
						<h2 class="text-lg font-semibold text-gray-800 dark:text-white">
							Liste de vos cours
						</h2>
						<span class="text-sm text-gray-500 dark:text-gray-400">
							{{ filteredCours.length }} cours affichés
						</span>
					</div>
				</div>
				<div class="p-6">
					<!-- Tableau -->
					<div class="overflow-x-auto">
						<table
							class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
						>
							<thead>
								<tr class="bg-gray-50 dark:bg-gray-700">
									<th
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
									>
										#
									</th>
									<th
										v-if="isColumnVisible('matiere')"
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
									>
										Matière
									</th>
									<th
										v-if="isColumnVisible('salle')"
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
									>
										Salle
									</th>
									<th
										v-if="isColumnVisible('jour')"
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
									>
										Jour
									</th>
									<th
										v-if="isColumnVisible('heure')"
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
									>
										Heure
									</th>
									<th
										class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
									>
										Action
									</th>
								</tr>
							</thead>
							<tbody
								class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
							>
								<tr v-for="(cours, index) in filteredCours" :key="cours.id">
									<td
										class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300"
									>
										{{ index + 1 }}
									</td>
									<td
										v-if="isColumnVisible('matiere')"
										class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300"
									>
										{{ cours.matiere }}
									</td>
									<td
										v-if="isColumnVisible('salle')"
										class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300"
									>
										{{ cours.salle }}
									</td>
									<td
										v-if="isColumnVisible('jour')"
										class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300"
									>
										{{ cours.jour }}
									</td>
									<td
										v-if="isColumnVisible('heure')"
										class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300"
									>
										{{ cours.heure }}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-center">
										<button
											@click="voirPresence(cours.id)"
											class="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
										>
											<svg
												class="w-4 h-4 mr-1"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/>
											</svg>
											Voir présence
										</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<!-- Message si pas de cours -->
					<div v-if="filteredCours.length === 0" class="text-center py-8">
						<div
							class="inline-flex flex-col items-center justify-center space-y-3"
						>
							<svg
								class="w-16 h-16 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1"
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
								/>
							</svg>
							<p class="text-gray-500 dark:text-gray-400">
								Aucun cours disponible
							</p>
							<button
								@click="fetchCours"
								class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
							>
								<svg
									class="w-4 h-4 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
									/>
								</svg>
								Actualiser la liste
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Stats ou informations supplémentaires -->
			<div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
				<!-- Card stat 1 -->
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
					<div class="flex items-center">
						<div
							class="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3"
						>
							<svg
								class="w-6 h-6 text-blue-600 dark:text-blue-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-500 dark:text-gray-400">
								Total heures cette semaine
							</p>
							<p class="text-2xl font-bold text-gray-800 dark:text-white">
								{{ totalHeures }}h
							</p>
						</div>
					</div>
				</div>
				<!-- Card stat 2 -->
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
					<div class="flex items-center">
						<div
							class="flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-lg p-3"
						>
							<svg
								class="w-6 h-6 text-green-600 dark:text-green-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-500 dark:text-gray-400">
								Cours aujourd'hui
							</p>
							<p class="text-2xl font-bold text-gray-800 dark:text-white">
								{{ coursAujourdhui }}
							</p>
						</div>
					</div>
				</div>
				<!-- Card stat 3 -->
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
					<div class="flex items-center">
						<div
							class="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3"
						>
							<svg
								class="w-6 h-6 text-purple-600 dark:text-purple-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-500 dark:text-gray-400">
								Étudiants totaux
							</p>
							<p class="text-2xl font-bold text-gray-800 dark:text-white">
								{{ totalEtudiants }}
							</p>
						</div>
					</div>
				</div>
			</div>
		</main>

		<!-- Modal d'ajout de cours -->
		<div v-if="showAddModal" class="modal-overlay" @click.self="closeAddModal">
			<div class="modal add-modal">
				<div class="modal-header">
					<h3>Ajouter un nouveau cours</h3>
					<button @click="closeAddModal" class="modal-close">
						<svg
							class="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
				<div class="modal-body">
					<form @submit.prevent="submitCourseForm">
						<div class="form-group">
							<label for="course-matiere" class="form-label"> Matière * </label>
							<input
								type="text"
								id="course-matiere"
								v-model="newCourse.matiere"
								class="form-input"
								placeholder="Ex: Mathématiques"
								required
							/>
						</div>
						<div class="form-group">
							<label for="course-salle" class="form-label"> Salle * </label>
							<input
								type="text"
								id="course-salle"
								v-model="newCourse.salle"
								class="form-input"
								placeholder="Ex: Salle 101"
								required
							/>
						</div>
						<div class="form-group">
							<label for="course-jour" class="form-label"> Jour * </label>
							<input
								type="date"
								id="course-jour"
								v-model="newCourse.jour"
								class="form-input"
								required
							/>
						</div>
						<div class="form-group">
							<label for="course-heure" class="form-label"> Heure * </label>
							<input
								type="time"
								id="course-heure"
								v-model="newCourse.heure"
								class="form-input"
								required
							/>
						</div>
						<div class="form-actions">
							<button type="button" class="btn-cancel" @click="closeAddModal">
								Annuler
							</button>
							<button type="submit" class="btn-submit">Ajouter le cours</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted, computed } from "vue";

	// Données
	const coursList = ref([]);
	const totalHeures = ref(12);
	const coursAujourdhui = ref(2);
	const totalEtudiants = ref(45);

	// Recherche et filtres
	const searchQuery = ref("");
	const showColumnSelector = ref(false);

	// Configuration des colonnes
	const availableColumns = ref([
		{ field: "matiere", title: "Matière" },
		{ field: "salle", title: "Salle" },
		{ field: "jour", title: "Jour" },
		{ field: "heure", title: "Heure" },
	]);

	const selectedColumns = ref(["matiere", "salle", "jour", "heure"]);

	// Modal d'ajout
	const showAddModal = ref(false);
	const newCourse = ref({
		matiere: "",
		salle: "",
		jour: "",
		heure: "",
	});

	// Fonctions
	const fetchCours = async () => {
		// Simuler une requête API
		coursList.value = [];

		setTimeout(() => {
			coursList.value = [
				{
					id: 1,
					matiere: "Mathématiques",
					salle: "Salle 101",
					jour: "2025-12-29",
					heure: "08:00",
				},
				{
					id: 2,
					matiere: "Physique",
					salle: "Salle 102",
					jour: "2025-12-29",
					heure: "10:30",
				},
				{
					id: 3,
					matiere: "Informatique",
					salle: "Salle 103",
					jour: "2025-12-30",
					heure: "08:00",
				},
				{
					id: 4,
					matiere: "Chimie",
					salle: "Salle 104",
					jour: "2025-12-31",
					heure: "14:00",
				},
				{
					id: 5,
					matiere: "Biologie",
					salle: "Salle 105",
					jour: "2026-01-01",
					heure: "09:00",
				},
			];
		}, 500);
	};

	const refreshData = () => {
		fetchCours();
		// Simuler un recalcul des stats
		totalHeures.value = Math.floor(Math.random() * 10) + 8;
		coursAujourdhui.value = Math.floor(Math.random() * 3) + 1;
	};

	const voirPresence = (coursId) => {
		alert(`Voir la présence pour le cours ID: ${coursId}`);
		// Dans une vraie application, rediriger vers la page de présence
		// window.location.href = `/enseignant/presence/${coursId}`
	};

	const toggleColumnSelector = () => {
		showColumnSelector.value = !showColumnSelector.value;
	};

	const isColumnVisible = (field) => {
		return selectedColumns.value.includes(field);
	};

	const addCourse = () => {
		showAddModal.value = true;
	};

	const closeAddModal = () => {
		showAddModal.value = false;
		resetCourseForm();
	};

	const resetCourseForm = () => {
		newCourse.value = {
			matiere: "",
			salle: "",
			jour: "",
			heure: "",
		};
	};

	const submitCourseForm = () => {
		if (
			!newCourse.value.matiere.trim() ||
			!newCourse.value.salle.trim() ||
			!newCourse.value.jour ||
			!newCourse.value.heure
		) {
			alert("Veuillez remplir tous les champs obligatoires");
			return;
		}

		const newId =
			coursList.value.length > 0
				? Math.max(...coursList.value.map((c) => c.id)) + 1
				: 1;

		// Formater la date pour l'affichage
		const jourFormate = new Date(newCourse.value.jour).toLocaleDateString(
			"fr-FR",
			{
				weekday: "long",
				day: "numeric",
				month: "long",
				year: "numeric",
			},
		);

		coursList.value.push({
			id: newId,
			matiere: newCourse.value.matiere,
			salle: newCourse.value.salle,
			jour: jourFormate,
			heure: `${newCourse.value.heure} - ${addHours(newCourse.value.heure, 2)}`,
		});

		alert(`Cours "${newCourse.value.matiere}" ajouté avec succès!`);
		closeAddModal();
	};

	const addHours = (time, hours) => {
		const [hour, minute] = time.split(":").map(Number);
		const newHour = hour + hours;
		return `${newHour.toString().padStart(2, "0")}:${minute
			.toString()
			.padStart(2, "0")}`;
	};

	// Computed properties
	const coursCount = computed(() => coursList.value.length);

	const filteredCours = computed(() => {
		if (!searchQuery.value) return coursList.value;

		const query = searchQuery.value.toLowerCase();
		return coursList.value.filter(
			(cours) =>
				cours.matiere.toLowerCase().includes(query) ||
				cours.salle.toLowerCase().includes(query) ||
				cours.jour.toLowerCase().includes(query) ||
				cours.heure.toLowerCase().includes(query),
		);
	});

	// Cycle de vie
	onMounted(() => {
		fetchCours();
	});
</script>

<style scoped>
	/* Styles pour la table responsive */
	@media (max-width: 768px) {
		table {
			display: block;
			overflow-x: auto;
			white-space: nowrap;
		}
	}

	/* Animation pour les transitions */
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.3s;
	}
	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}

	/* Styles pour les cartes de stats */
	.stat-card {
		transition: transform 0.2s ease-in-out;
	}
	.stat-card:hover {
		transform: translateY(-2px);
	}

	/* Loader animation pour le chargement */
	.loader {
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	/* Zone de recherche et filtres */
	.search-filter-area {
		display: flex;
		gap: 16px;
		margin-bottom: 24px;
		align-items: center;
		flex-wrap: wrap;
	}

	@media (max-width: 768px) {
		.search-filter-area {
			flex-direction: column;
			align-items: stretch;
		}
	}

	/* Modals */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 20px;
		backdrop-filter: blur(4px);
	}

	.modal {
		background: white;
		border-radius: 16px;
		width: 100%;
		max-width: 600px;
		max-height: 80vh;
		overflow-y: auto;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
		animation: modalSlideIn 0.3s ease-out;
	}

	.add-modal {
		max-width: 500px;
	}

	@keyframes modalSlideIn {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24px;
		border-bottom: 1px solid #e5e7eb;
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: white;
		border-radius: 16px 16px 0 0;
	}

	.modal-header h3 {
		margin: 0;
		font-size: 18px;
		font-weight: 600;
	}

	.modal-close {
		background: rgba(255, 255, 255, 0.1);
		border: none;
		color: white;
		cursor: pointer;
		padding: 8px;
		border-radius: 50%;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s;
	}

	.modal-close:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.modal-body {
		padding: 24px;
	}

	/* Formulaire dans modal */
	.form-group {
		margin-bottom: 20px;
	}

	.form-label {
		display: block;
		margin-bottom: 8px;
		font-size: 14px;
		font-weight: 500;
		color: #374151;
	}

	.form-input {
		width: 100%;
		padding: 12px 16px;
		border: 1px solid #d1d5db;
		border-radius: 8px;
		font-size: 14px;
		color: #374151;
		background-color: white;
		transition: all 0.2s;
	}

	.form-input:focus {
		outline: none;
		border-color: #4f46e5;
		box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
	}

	.form-input::placeholder {
		color: #9ca3af;
	}

	/* Actions du formulaire */
	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 16px;
		margin-top: 32px;
		padding-top: 24px;
		border-top: 1px solid #e5e7eb;
	}

	.btn-cancel {
		padding: 12px 24px;
		background: white;
		color: #4b5563;
		border: 1px solid #d1d5db;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-cancel:hover {
		background: #f9fafb;
		border-color: #9ca3af;
	}

	.btn-submit {
		padding: 12px 24px;
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.btn-submit:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
	}

	/* Dark mode styles */
	.dark .form-input {
		background-color: #374151;
		border-color: #4b5563;
		color: #f9fafb;
	}

	.dark .form-label {
		color: #e5e7eb;
	}

	.dark .btn-cancel {
		background-color: #374151;
		border-color: #4b5563;
		color: #e5e7eb;
	}

	.dark .btn-cancel:hover {
		background-color: #4b5563;
	}
</style>

  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- Main content seulement -->
    <main class="p-4 md:p-6">
      <!-- Page Header -->
      <div class="mb-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Mon emploi de temps</h1>
            <nav class="flex mt-2" aria-label="Breadcrumb">
              <ol class="inline-flex items-center space-x-1 md:space-x-3">
                <li class="inline-flex items-center">
                  <span class="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-400">
                    Mon emploi de temps
                  </span>
                </li>
                <li aria-current="page">
                  <div class="flex items-center">
                    <svg class="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <span class="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:ml-2">Mes cours</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
         
          <!-- Bouton pour retour à l'accueil ou actions -->
          <div class="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              @click="refreshData"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser
            </button>
          </div>
        </div>
      </div>

      <!-- Zone de recherche et filtres -->
      <div class="search-filter-area mb-6">
        <!-- Recherche -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="search"
            class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            placeholder="Rechercher un cours..."
          />
        </div>
        
        <!-- Sélecteur de colonnes -->
        <div class="relative">
          <button
            class="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="toggleColumnSelector"
          >
            <span>Colonnes visibles</span>
            <svg
              class="w-5 h-5 transition-transform duration-200"
              :class="{ 'rotate-180': showColumnSelector }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div
            v-if="showColumnSelector"
            class="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 min-w-[200px]"
          >
            <div class="p-3 space-y-2 max-h-60 overflow-y-auto">
              <div
                v-for="col in availableColumns"
                :key="col.field"
                class="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
              >
                <input
                  type="checkbox"
                  :id="col.field"
                  v-model="selectedColumns"
                  :value="col.field"
                  class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:border-gray-600"
                />
                <label
                  :for="col.field"
                  class="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                >{{ col.title }}</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Bouton Ajouter un cours -->
        <button
          class="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          @click="addCourse"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Ajouter un cours
        </button>
      </div>

      <!-- Card de la liste des cours -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Liste de vos cours</h2>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ filteredCours.length }} cours affichés
            </span>
          </div>
        </div>
        <div class="p-6">
          <!-- Tableau -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr class="bg-gray-50 dark:bg-gray-700">
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">#</th>
                  <th 
                    v-if="isColumnVisible('matiere')"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Matière
                  </th>
                  <th 
                    v-if="isColumnVisible('salle')"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Salle
                  </th>
                  <th 
                    v-if="isColumnVisible('jour')"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Jour
                  </th>
                  <th 
                    v-if="isColumnVisible('heure')"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Heure
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(cours, index) in filteredCours" :key="cours.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{{ index + 1 }}</td>
                  <td 
                    v-if="isColumnVisible('matiere')"
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300"
                  >
                    {{ cours.matiere }}
                  </td>
                  <td 
                    v-if="isColumnVisible('salle')"
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300"
                  >
                    {{ cours.salle }}
                  </td>
                  <td 
                    v-if="isColumnVisible('jour')"
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300"
                  >
                    {{ cours.jour }}
                  </td>
                  <td 
                    v-if="isColumnVisible('heure')"
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300"
                  >
                    {{ cours.heure }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <button
                      @click="voirPresence(cours.id)"
                      class="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Voir présence
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Message si pas de cours -->
          <div v-if="filteredCours.length === 0" class="text-center py-8">
            <div class="inline-flex flex-col items-center justify-center space-y-3">
              <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p class="text-gray-500 dark:text-gray-400">Aucun cours disponible</p>
              <button
                @click="fetchCours"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualiser la liste
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats ou informations supplémentaires -->
      <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Card stat 1 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total heures cette semaine</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ totalHeures }}h</p>
            </div>
          </div>
        </div>
        <!-- Card stat 2 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Cours aujourd'hui</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ coursAujourdhui }}</p>
            </div>
          </div>
        </div>
        <!-- Card stat 3 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Étudiants totaux</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ totalEtudiants }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal d'ajout de cours -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeAddModal">
      <div class="modal add-modal">
        <div class="modal-header">
          <h3>Ajouter un nouveau cours</h3>
          <button @click="closeAddModal" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitCourseForm">
            <div class="form-group">
              <label for="course-matiere" class="form-label">
                Matière *
              </label>
              <input
                type="text"
                id="course-matiere"
                v-model="newCourse.matiere"
                class="form-input"
                placeholder="Ex: Mathématiques"
                required
              />
            </div>
            <div class="form-group">
              <label for="course-salle" class="form-label">
                Salle *
              </label>
              <input
                type="text"
                id="course-salle"
                v-model="newCourse.salle"
                class="form-input"
                placeholder="Ex: Salle 101"
                required
              />
            </div>
            <div class="form-group">
              <label for="course-jour" class="form-label">
                Jour *
              </label>
              <input
                type="date"
                id="course-jour"
                v-model="newCourse.jour"
                class="form-input"
                required
              />
            </div>
            <div class="form-group">
              <label for="course-heure" class="form-label">
                Heure *
              </label>
              <input
                type="time"
                id="course-heure"
                v-model="newCourse.heure"
                class="form-input"
                required
              />
            </div>
            <div class="form-actions">
              <button type="button" class="btn-cancel" @click="closeAddModal">
                Annuler
              </button>
              <button type="submit" class="btn-submit">
                Ajouter le cours
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// Données
const coursList = ref([])
const totalHeures = ref(12)
const coursAujourdhui = ref(2)
const totalEtudiants = ref(45)

// Recherche et filtres
const searchQuery = ref('')
const showColumnSelector = ref(false)

// Configuration des colonnes
const availableColumns = ref([
  { field: 'matiere', title: 'Matière' },
  { field: 'salle', title: 'Salle' },
  { field: 'jour', title: 'Jour' },
  { field: 'heure', title: 'Heure' }
])

const selectedColumns = ref(['matiere', 'salle', 'jour', 'heure'])

// Modal d'ajout
const showAddModal = ref(false)
const newCourse = ref({
  matiere: '',
  salle: '',
  jour: '',
  heure: ''
})

// Fonctions
const fetchCours = async () => {
  // Simuler une requête API
  coursList.value = []
 
  setTimeout(() => {
    coursList.value = [
      {
        id: 1,
        matiere: 'Mathématiques',
        salle: 'Salle 101',
        jour: '2025-12-29',
        heure: '08:00'
      },
      {
        id: 2,
        matiere: 'Physique',
        salle: 'Salle 102',
        jour: '2025-12-29',
        heure: '10:30'
      },
      {
        id: 3,
        matiere: 'Informatique',
        salle: 'Salle 103',
        jour: '2025-12-30',
        heure: '08:00'
      },
      {
        id: 4,
        matiere: 'Chimie',
        salle: 'Salle 104',
        jour: '2025-12-31',
        heure: '14:00'
      },
      {
        id: 5,
        matiere: 'Biologie',
        salle: 'Salle 105',
        jour: '2026-01-01',
        heure: '09:00'
      }
    ]
  }, 500)
}

const refreshData = () => {
  fetchCours()
  // Simuler un recalcul des stats
  totalHeures.value = Math.floor(Math.random() * 10) + 8
  coursAujourdhui.value = Math.floor(Math.random() * 3) + 1
}

const voirPresence = (coursId) => {
  alert(`Voir la présence pour le cours ID: ${coursId}`)
  // Dans une vraie application, rediriger vers la page de présence
  // window.location.href = `/enseignant/presence/${coursId}`
}

const toggleColumnSelector = () => {
  showColumnSelector.value = !showColumnSelector.value
}

const isColumnVisible = (field) => {
  return selectedColumns.value.includes(field)
}

const addCourse = () => {
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
  resetCourseForm()
}

const resetCourseForm = () => {
  newCourse.value = {
    matiere: '',
    salle: '',
    jour: '',
    heure: ''
  }
}

const submitCourseForm = () => {
  if (!newCourse.value.matiere.trim() || 
      !newCourse.value.salle.trim() || 
      !newCourse.value.jour || 
      !newCourse.value.heure) {
    alert("Veuillez remplir tous les champs obligatoires")
    return
  }

  const newId = coursList.value.length > 0 ? Math.max(...coursList.value.map(c => c.id)) + 1 : 1
  
  // Formater la date pour l'affichage
  const jourFormate = new Date(newCourse.value.jour).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  coursList.value.push({
    id: newId,
    matiere: newCourse.value.matiere,
    salle: newCourse.value.salle,
    jour: jourFormate,
    heure: `${newCourse.value.heure} - ${addHours(newCourse.value.heure, 2)}`
  })

  alert(`Cours "${newCourse.value.matiere}" ajouté avec succès!`)
  closeAddModal()
}

const addHours = (time, hours) => {
  const [hour, minute] = time.split(':').map(Number)
  const newHour = hour + hours
  return `${newHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

// Computed properties
const coursCount = computed(() => coursList.value.length)

const filteredCours = computed(() => {
  if (!searchQuery.value) return coursList.value

  const query = searchQuery.value.toLowerCase()
  return coursList.value.filter(cours =>
    cours.matiere.toLowerCase().includes(query) ||
    cours.salle.toLowerCase().includes(query) ||
    cours.jour.toLowerCase().includes(query) ||
    cours.heure.toLowerCase().includes(query)
  )
})

// Cycle de vie
onMounted(() => {
  fetchCours()
})
</script>

<style scoped>
/* Styles pour la table responsive */
@media (max-width: 768px) {
  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}

/* Animation pour les transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Styles pour les cartes de stats */
.stat-card {
  transition: transform 0.2s ease-in-out;
}
.stat-card:hover {
  transform: translateY(-2px);
}

/* Loader animation pour le chargement */
.loader {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Zone de recherche et filtres */
.search-filter-area {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .search-filter-area {
    flex-direction: column;
    align-items: stretch;
  }
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: modalSlideIn 0.3s ease-out;
}

.add-modal {
  max-width: 500px;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-radius: 16px 16px 0 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.modal-close {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 24px;
}

/* Formulaire dans modal */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  background-color: white;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

/* Actions du formulaire */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel {
  padding: 12px 24px;
  background: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-submit {
  padding: 12px 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* Dark mode styles */
.dark .form-input {
  background-color: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}

.dark .form-label {
  color: #e5e7eb;
}

.dark .btn-cancel {
  background-color: #374151;
  border-color: #4b5563;
  color: #e5e7eb;
}

.dark .btn-cancel:hover {
  background-color: #4b5563;
}
</style>

