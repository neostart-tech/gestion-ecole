<template>
	<div
		class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8"
	>
		<div class="max-w-7xl mx-auto pl-0 lg:pl-16">
			<!-- Header -->
			<div class="mb-8">
				<h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
					Validation des Absences
				</h1>
				<p class="text-gray-600">Gérer et valider les absences des étudiants</p>
			</div>

			<!-- Main Container -->
			<div
				class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300"
			>
				<!-- Toolbar -->
				<div
					class="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white"
				>
					<div
						class="flex flex-col sm:flex-row sm:items-center justify-between"
					>
						<div class="mb-4 sm:mb-0">
							<h2 class="text-xl font-semibold text-gray-800">
								Absences à valider
							</h2>
							<p class="text-sm text-gray-500">
								{{ absencesCount }} absences en attente
							</p>
						</div>

						<div class="flex flex-wrap gap-3">
							<div class="relative">
								<div
									class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
								>
									<svg
										class="w-5 h-5 text-gray-400"
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
									type="text"
									v-model="searchQuery"
									placeholder="Nom/Prénom/Commentaire"
									class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
								/>
							</div>

							<button
								@click="validateSelected"
								:disabled="selectedAbsences.length === 0"
								:class="[
									'px-4 py-2 rounded-lg transition-colors flex items-center shadow-sm whitespace-nowrap',
									selectedAbsences.length > 0
										? 'bg-green-600 text-white hover:bg-green-700'
										: 'bg-gray-200 text-gray-500 cursor-not-allowed',
								]"
							>
								<svg
									class="w-5 h-5 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								Valider ({{ selectedAbsences.length }})
							</button>
						</div>
					</div>
				</div>

				<!-- Filters -->
				<div class="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<!-- Groupe -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2"
								>Groupe</label
							>
							<select
								v-model="selectedGroup"
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="">Tous</option>
								<option v-for="group in groups" :key="group" :value="group">
									{{ group }}
								</option>
							</select>
						</div>

						<!-- Date cours -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2"
								>Date cours</label
							>
							<div class="relative">
								<input
									type="date"
									v-model="selectedDate"
									class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
								<div
									class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
								>
									<svg
										class="w-5 h-5 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
								</div>
							</div>
						</div>

						<!-- Matière -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2"
								>Matière</label
							>
							<select
								v-model="selectedSubject"
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="">Toutes</option>
								<option
									v-for="subject in subjects"
									:key="subject"
									:value="subject"
								>
									{{ subject }}
								</option>
							</select>
						</div>
					</div>
				</div>

				<!-- Table -->
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th
									scope="col"
									class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
								>
									<input
										type="checkbox"
										v-model="selectAll"
										class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
								</th>
								<th
									scope="col"
									class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									<div class="flex items-center">
										Étudiant
										<button @click="sortBy('student')" class="ml-1">
											<svg
												class="w-4 h-4 text-gray-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
												/>
											</svg>
										</button>
									</div>
								</th>
								<th
									scope="col"
									class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
								>
									<div class="flex items-center">
										Cours
										<button @click="sortBy('course')" class="ml-1">
											<svg
												class="w-4 h-4 text-gray-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
												/>
											</svg>
										</button>
									</div>
								</th>
								<th
									scope="col"
									class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
								>
									Commentaire
								</th>
								<th
									scope="col"
									class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									<div class="flex items-center">
										Créé le
										<button @click="sortBy('createdAt')" class="ml-1">
											<svg
												class="w-4 h-4 text-gray-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
												/>
											</svg>
										</button>
									</div>
								</th>
								<th
									scope="col"
									class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									Action
								</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							<template v-if="filteredAbsences.length > 0">
								<tr
									v-for="absence in filteredAbsences"
									:key="absence.id"
									class="hover:bg-gray-50 transition-colors duration-150"
								>
									<td class="px-4 sm:px-6 py-4 whitespace-nowrap">
										<input
											type="checkbox"
											:value="absence.id"
											v-model="selectedAbsences"
											class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
										/>
									</td>
									<td class="px-4 sm:px-6 py-4">
										<div class="flex items-center">
											<div class="flex-shrink-0 h-10 w-10">
												<div
													class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"
												>
													<span class="text-blue-600 font-semibold">{{
														getInitials(absence.student)
													}}</span>
												</div>
											</div>
											<div class="ml-4">
												<div class="text-sm font-medium text-gray-900">
													{{ absence.student }}
												</div>
												<div class="text-sm text-gray-500">
													{{ absence.group }}
												</div>
											</div>
										</div>
									</td>
									<td class="px-4 sm:px-6 py-4 hidden md:table-cell">
										<div>
											<div class="text-sm font-medium text-gray-900">
												{{ absence.course }}
											</div>
											<div class="text-sm text-gray-500">
												{{ formatDate(absence.courseDate) }}
												<span class="mx-1">•</span>
												{{ absence.subject }}
											</div>
										</div>
									</td>
									<td class="px-4 sm:px-6 py-4 hidden lg:table-cell">
										<div class="max-w-xs">
											<p
												class="text-sm text-gray-900 truncate"
												:title="absence.comment"
											>
												{{ absence.comment || "Aucun commentaire" }}
											</p>
										</div>
									</td>
									<td class="px-4 sm:px-6 py-4 whitespace-nowrap">
										<div class="text-sm text-gray-900">
											{{ formatDateTime(absence.createdAt) }}
										</div>
										<div class="text-xs text-gray-500">
											Il y a {{ getTimeAgo(absence.createdAt) }}
										</div>
									</td>
									<td
										class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium"
									>
										<div class="flex space-x-2">
											<button
												@click="validateAbsence(absence.id)"
												class="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 transition-colors"
											>
												Valider
											</button>
											<button
												@click="rejectAbsence(absence.id)"
												class="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 transition-colors"
											>
												Rejeter
											</button>
											<button
												@click="viewDetails(absence)"
												class="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
											>
												Détails
											</button>
										</div>
									</td>
								</tr>
							</template>
							<template v-else>
								<tr>
									<td colspan="6" class="px-4 sm:px-6 py-8 text-center">
										<div
											class="flex flex-col items-center justify-center text-gray-500"
										>
											<svg
												class="w-16 h-16 mb-4 text-gray-300"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
												/>
											</svg>
											<p class="text-lg font-medium mb-2">
												Aucune absence en attente
											</p>
											<p class="text-sm">
												Toutes les absences ont été traitées
											</p>
										</div>
									</td>
								</tr>
							</template>
						</tbody>
					</table>
				</div>

				<!-- Pagination -->
				<div class="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
					<div
						class="flex flex-col sm:flex-row sm:items-center sm:justify-between"
					>
						<div class="mb-4 sm:mb-0">
							<p class="text-sm text-gray-700">
								Affichage de
								<span class="font-medium">{{ filteredAbsences.length }}</span>
								sur
								<span class="font-medium">{{ absences.length }}</span>
								résultats
							</p>
						</div>
						<div class="flex items-center space-x-2">
							<button
								@click="previousPage"
								:disabled="currentPage === 1"
								:class="[
									'px-3 py-1 border border-gray-300 rounded text-sm',
									currentPage === 1
										? 'text-gray-400 cursor-not-allowed'
										: 'text-gray-700 hover:bg-gray-50',
								]"
							>
								Précédent
							</button>
							<span class="text-sm text-gray-700">
								Page {{ currentPage }} sur {{ totalPages }}
							</span>
							<button
								@click="nextPage"
								:disabled="currentPage === totalPages"
								:class="[
									'px-3 py-1 border border-gray-300 rounded text-sm',
									currentPage === totalPages
										? 'text-gray-400 cursor-not-allowed'
										: 'text-gray-700 hover:bg-gray-50',
								]"
							>
								Suivant
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from "vue";

	interface Absence {
		id: number;
		student: string;
		group: string;
		course: string;
		subject: string;
		courseDate: string;
		comment: string;
		createdAt: string;
		status: "pending" | "validated" | "rejected";
	}

	// Données
	const absences = ref<Absence[]>([
		{
			id: 1,
			student: "Marie Dupont",
			group: "L3 Informatique",
			course: "Algorithmique avancée",
			subject: "Informatique",
			courseDate: "2024-01-15",
			comment: "Maladie avec certificat médical",
			createdAt: "2024-01-14T10:30:00",
			status: "pending",
		},
		{
			id: 2,
			student: "Jean Martin",
			group: "M1 Marketing",
			course: "Stratégie digitale",
			subject: "Marketing",
			courseDate: "2024-01-16",
			comment: "Problèmes de transport",
			createdAt: "2024-01-15T14:20:00",
			status: "pending",
		},
		{
			id: 3,
			student: "Sophie Bernard",
			group: "L2 Droit",
			course: "Droit des contrats",
			subject: "Droit",
			courseDate: "2024-01-14",
			comment: "",
			createdAt: "2024-01-13T16:45:00",
			status: "pending",
		},
		{
			id: 4,
			student: "Thomas Petit",
			group: "L3 Informatique",
			course: "Base de données",
			subject: "Informatique",
			courseDate: "2024-01-17",
			comment: "Rendez-vous médical urgent",
			createdAt: "2024-01-16T09:15:00",
			status: "pending",
		},
		{
			id: 5,
			student: "Laura Dubois",
			group: "M1 Management",
			course: "Gestion de projet",
			subject: "Management",
			courseDate: "2024-01-18",
			comment: "Conférence professionnelle",
			createdAt: "2024-01-17T11:30:00",
			status: "pending",
		},
	]);

	const groups = [
		"L3 Informatique",
		"M1 Marketing",
		"L2 Droit",
		"M1 Management",
		"L1 Économie",
	];
	const subjects = [
		"Informatique",
		"Marketing",
		"Droit",
		"Management",
		"Économie",
		"Mathématiques",
	];

	// Filtres
	const searchQuery = ref("");
	const selectedGroup = ref("");
	const selectedDate = ref("");
	const selectedSubject = ref("");
	const selectedAbsences = ref<number[]>([]);
	const selectAll = ref(false);
	const currentPage = ref(1);
	const itemsPerPage = 10;
	const sortField = ref<"student" | "course" | "createdAt">("createdAt");
	const sortDirection = ref<"asc" | "desc">("desc");

	// Computed
	const absencesCount = computed(() => filteredAbsences.value.length);

	const filteredAbsences = computed(() => {
		let filtered = absences.value.filter(
			(absence) => absence.status === "pending",
		);

		// Filtre de recherche
		if (searchQuery.value) {
			const query = searchQuery.value.toLowerCase();
			filtered = filtered.filter(
				(absence) =>
					absence.student.toLowerCase().includes(query) ||
					absence.comment.toLowerCase().includes(query),
			);
		}

		// Filtre par groupe
		if (selectedGroup.value) {
			filtered = filtered.filter(
				(absence) => absence.group === selectedGroup.value,
			);
		}

		// Filtre par date
		if (selectedDate.value) {
			filtered = filtered.filter(
				(absence) => absence.courseDate === selectedDate.value,
			);
		}

		// Filtre par matière
		if (selectedSubject.value) {
			filtered = filtered.filter(
				(absence) => absence.subject === selectedSubject.value,
			);
		}

		// Tri
		filtered.sort((a, b) => {
			let aValue = a[sortField.value];
			let bValue = b[sortField.value];

			if (sortField.value === "createdAt") {
				aValue = new Date(a.createdAt).getTime();
				bValue = new Date(b.createdAt).getTime();
			}

			if (aValue < bValue) return sortDirection.value === "asc" ? -1 : 1;
			if (aValue > bValue) return sortDirection.value === "asc" ? 1 : -1;
			return 0;
		});

		// Pagination
		const start = (currentPage.value - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		return filtered.slice(start, end);
	});

	const totalPages = computed(() =>
		Math.ceil(
			absences.value.filter((a) => a.status === "pending").length /
				itemsPerPage,
		),
	);

	// Watch pour selectAll
	const watchSelectAll = computed({
		get: () => selectAll.value,
		set: (value: boolean) => {
			selectAll.value = value;
			if (value) {
				selectedAbsences.value = filteredAbsences.value.map(
					(absence) => absence.id,
				);
			} else {
				selectedAbsences.value = [];
			}
		},
	});

	// Méthodes
	function getInitials(name: string) {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();
	}

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString("fr-FR");
	}

	function formatDateTime(dateString: string) {
		const date = new Date(dateString);
		return (
			date.toLocaleDateString("fr-FR") +
			" " +
			date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
		);
	}

	function getTimeAgo(dateString: string) {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

		if (diffHours < 1) {
			const diffMinutes = Math.floor(diffMs / (1000 * 60));
			return `${diffMinutes} min`;
		} else if (diffHours < 24) {
			return `${diffHours} h`;
		} else {
			const diffDays = Math.floor(diffHours / 24);
			return `${diffDays} jour${diffDays > 1 ? "s" : ""}`;
		}
	}

	function sortBy(field: "student" | "course" | "createdAt") {
		if (sortField.value === field) {
			sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
		} else {
			sortField.value = field;
			sortDirection.value = "desc";
		}
	}

	function validateSelected() {
		if (selectedAbsences.value.length === 0) return;

		if (confirm(`Valider ${selectedAbsences.value.length} absence(s) ?`)) {
			absences.value = absences.value.map((absence) =>
				selectedAbsences.value.includes(absence.id)
					? { ...absence, status: "validated" as const }
					: absence,
			);
			selectedAbsences.value = [];
			selectAll.value = false;
			alert(
				`${selectedAbsences.value.length} absence(s) validée(s) avec succès`,
			);
		}
	}

	function validateAbsence(id: number) {
		if (confirm("Valider cette absence ?")) {
			const absence = absences.value.find((a) => a.id === id);
			if (absence) {
				absence.status = "validated";
				alert("Absence validée avec succès");
			}
		}
	}

	function rejectAbsence(id: number) {
		if (confirm("Rejeter cette absence ?")) {
			const absence = absences.value.find((a) => a.id === id);
			if (absence) {
				absence.status = "rejected";
				alert("Absence rejetée");
			}
		}
	}

	function viewDetails(absence: Absence) {
		alert(
			`Détails de l'absence:\n\nÉtudiant: ${absence.student}\nCours: ${
				absence.course
			}\nDate: ${formatDate(absence.courseDate)}\nCommentaire: ${
				absence.comment || "Aucun"
			}`,
		);
	}

	function previousPage() {
		if (currentPage.value > 1) {
			currentPage.value--;
		}
	}

	function nextPage() {
		if (currentPage.value < totalPages.value) {
			currentPage.value++;
		}
	}

	// Reset pagination quand les filtres changent
	function resetPagination() {
		currentPage.value = 1;
	}

	// Watch les filtres pour reset la pagination
	watch(
		() => [
			searchQuery.value,
			selectedGroup.value,
			selectedDate.value,
			selectedSubject.value,
		],
		resetPagination,
	);
</script>

<style scoped>
	/* Styles spécifiques pour la table responsive */
	@media (max-width: 768px) {
		.hidden-mobile {
			display: none;
		}
	}

	/* Animation pour les lignes du tableau */
	tr {
		transition: background-color 0.15s ease-in-out;
	}

	/* Style pour les boutons d'action */
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Style pour le champ de recherche */
	input[type="text"]:focus,
	input[type="date"]:focus,
	select:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}
</style>
