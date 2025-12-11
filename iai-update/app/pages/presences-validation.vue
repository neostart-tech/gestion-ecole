<template>
	<div class="min-h-screen bg-gray-50 py-8">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Breadcrumb -->
			<Breadcrumb
				:items="[
					{ label: 'Presences', to: '/' },
					{ label: 'Validation', to: null },
				]"
				title="Absences à valider"
				:title-class="'text-xl md:text-2xl text-gray-800'"
				:spacing="'mb-2'"
				:link-color="'text-blue-600 hover:text-blue-800'"
				:active-color="'text-gray-900 font-medium'"
				:text-size="'text-base'"
				align="left"
			/>

			<!-- Sous-titre -->
			<p class="text-gray-600 mb-8">
				Gérez et validez les absences des étudiants
			</p>

			<!-- Zone recherche, filtres et actions -->
			<div class="space-y-6 mb-8">
				<!-- Recherche -->
				<div class="relative max-w-md">
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
						class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
						placeholder="Nom/Prénom/Commentaire..."
					/>
				</div>

				<!-- Filtres avancés -->
				<div class="flex flex-col sm:flex-row sm:items-center gap-4">
					<select
						v-model="selectedGroup"
						class="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-colors"
					>
						<option value="">Groupe: Tous</option>
						<option v-for="group in groups" :key="group" :value="group">
							{{ group }}
						</option>
					</select>

					<div class="flex-1">
						<input
							type="date"
							v-model="selectedDate"
							class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
							placeholder="Date cours"
						/>
					</div>

					<select
						v-model="selectedSubject"
						class="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-colors"
					>
						<option value="">Matière: Toutes</option>
						<option v-for="subject in subjects" :key="subject" :value="subject">
							{{ subject }}
						</option>
					</select>
				</div>

				<!-- Actions -->
				<div class="flex flex-col sm:flex-row gap-4">
					<!-- Sélecteur de colonnes -->
					<div class="relative">
						<button
							@click="toggleColumnSelector"
							class="flex items-center justify-between px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors min-w-[180px]"
						>
							<span class="text-sm font-medium text-gray-700"
								>Toutes les colonnes</span
							>
							<svg
								class="h-4 w-4 text-gray-500 transition-transform duration-200"
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

						<!-- Dropdown -->
						<div
							v-if="showColumnSelector"
							class="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
						>
							<div class="p-3 space-y-2 max-h-60 overflow-y-auto">
								<div
									v-for="col in availableColumns"
									:key="col.field"
									class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
								>
									<input
										type="checkbox"
										:id="'col-' + col.field"
										v-model="selectedColumns"
										:value="col.field"
										class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
									/>
									<label
										:for="'col-' + col.field"
										class="text-sm text-gray-700 cursor-pointer select-none"
									>
										{{ col.title }}
									</label>
								</div>
							</div>
						</div>
					</div>

					<!-- Bouton Valider -->
					<button
						@click="validateSelected"
						:disabled="selectedAbsences.length === 0"
						:class="[
							'flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-colors',
							selectedAbsences.length > 0
								? 'bg-emerald-600 hover:bg-emerald-700 text-white'
								: 'bg-gray-200 text-gray-500 cursor-not-allowed',
						]"
					>
						<svg
							class="h-5 w-5"
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
						<span>Valider ({{ selectedAbsences.length }})</span>
					</button>

					<!-- Bouton Ajouter absence -->
					<button
						@click="addAbsence"
						class="flex items-center justify-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
					>
						<svg
							class="h-5 w-5"
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
						<span>Ajouter absence</span>
					</button>
				</div>
			</div>

			<!-- Tableau -->
			<div
				class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
			>
				<!-- En-tête du tableau -->
				<div class="px-6 py-4 border-b border-gray-200">
					<h2 class="text-lg font-semibold text-gray-900">
						Absences à valider
					</h2>
					<p class="text-sm text-gray-500">
						{{ absencesCount }} absences en attente
					</p>
				</div>

				<!-- Table -->
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-gray-50">
							<tr>
								<th class="py-3 px-6 text-left">
									<input
										type="checkbox"
										v-model="selectAll"
										class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
									/>
								</th>
								<template v-for="col in visibleColumns" :key="col.field">
									<th
										v-if="col.field !== 'actions'"
										@click="sortBy(col.field)"
										class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
									>
										<div class="flex items-center space-x-1">
											<span>{{ col.title }}</span>
											<svg
												class="h-3 w-3"
												:class="{ 'text-indigo-500': sortField === col.field }"
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
										</div>
									</th>
								</template>
								<th
									v-if="visibleColumns.some((c) => c.field === 'actions')"
									class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									Actions
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200">
							<template v-if="filteredAbsences.length > 0">
								<tr
									v-for="absence in paginatedAbsences"
									:key="absence.id"
									class="hover:bg-gray-50 transition-colors"
								>
									<td class="py-4 px-6">
										<input
											type="checkbox"
											:value="absence.id"
											v-model="selectedAbsences"
											class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
										/>
									</td>
									<template v-for="col in visibleColumns" :key="col.field">
										<td v-if="col.field === 'student'" class="py-4 px-6">
											<div class="flex items-center space-x-3">
												<div
													class="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center"
												>
													<span class="text-indigo-600 font-semibold">
														{{ getInitials(absence.student) }}
													</span>
												</div>
												<div>
													<div class="font-medium text-gray-900">
														{{ absence.student }}
													</div>
													<div class="text-sm text-gray-500">
														{{ absence.group }}
													</div>
												</div>
											</div>
										</td>
										<td v-else-if="col.field === 'course'" class="py-4 px-6">
											<div>
												<div class="font-medium text-gray-900">
													{{ absence.course }}
												</div>
												<div
													class="text-sm text-gray-500 flex items-center space-x-2"
												>
													<span>{{ formatDate(absence.courseDate) }}</span>
													<span class="text-gray-300">•</span>
													<span>{{ absence.subject }}</span>
												</div>
											</div>
										</td>
										<td v-else-if="col.field === 'comment'" class="py-4 px-6">
											<div class="max-w-xs truncate text-gray-600">
												{{ absence.comment || "Aucun commentaire" }}
											</div>
										</td>
										<td v-else-if="col.field === 'createdAt'" class="py-4 px-6">
											<div>
												<div class="text-gray-900">
													{{ formatDateTime(absence.createdAt) }}
												</div>
												<div class="text-sm text-gray-500">
													Il y a {{ getTimeAgo(absence.createdAt) }}
												</div>
											</div>
										</td>
										<td v-else-if="col.field === 'status'" class="py-4 px-6">
											<span
												:class="[
													'px-2 py-1 text-xs font-medium rounded-full',
													absence.status === 'pending'
														? 'bg-amber-100 text-amber-800'
														: absence.status === 'validated'
														? 'bg-emerald-100 text-emerald-800'
														: 'bg-red-100 text-red-800',
												]"
											>
												{{ getStatusText(absence.status) }}
											</span>
										</td>
									</template>
									<td
										v-if="visibleColumns.some((c) => c.field === 'actions')"
										class="py-4 px-6"
									>
										<div class="flex space-x-2">
											<button
												@click.stop="validateAbsence(absence.id)"
												class="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
												title="Valider"
											>
												<svg
													class="h-5 w-5"
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
											</button>
											<button
												@click.stop="rejectAbsence(absence.id)"
												class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
												title="Rejeter"
											>
												<svg
													class="h-5 w-5"
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
											<button
												@click.stop="viewDetails(absence)"
												class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
												title="Détails"
											>
												<svg
													class="h-5 w-5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
													/>
												</svg>
											</button>
										</div>
									</td>
								</tr>
							</template>
							<tr v-else>
								<td
									:colspan="visibleColumns.length + 1"
									class="py-12 text-center"
								>
									<div class="flex flex-col items-center justify-center">
										<svg
											class="h-16 w-16 text-gray-300 mb-4"
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
										<h3 class="text-lg font-medium text-gray-900 mb-2">
											Aucune absence en attente
										</h3>
										<p class="text-gray-500">
											Toutes les absences ont été traitées
										</p>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- Pagination -->
				<div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
					<div
						class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
					>
						<div class="text-sm text-gray-700">
							Affichage de
							<span class="font-medium">{{ paginatedAbsences.length }}</span>
							sur
							<span class="font-medium">{{ filteredAbsences.length }}</span>
							résultats
						</div>

						<div class="flex items-center space-x-2">
							<button
								@click="previousPage"
								:disabled="currentPage === 1"
								:class="[
									'px-3 py-1.5 text-sm border border-gray-300 rounded-md transition-colors',
									currentPage === 1
										? 'text-gray-400 cursor-not-allowed'
										: 'text-gray-700 hover:bg-gray-100',
								]"
							>
								Précédent
							</button>

							<div class="flex items-center space-x-1">
								<button
									v-for="page in visiblePages"
									:key="page"
									@click="goToPage(page)"
									:class="[
										'px-3 py-1.5 text-sm border rounded-md transition-colors',
										page === currentPage
											? 'bg-indigo-600 border-indigo-600 text-white'
											: 'border-gray-300 text-gray-700 hover:bg-gray-100',
									]"
								>
									{{ page }}
								</button>
								<span v-if="showEllipsis" class="px-2 text-gray-500">...</span>
							</div>

							<button
								@click="nextPage"
								:disabled="currentPage === totalPages"
								:class="[
									'px-3 py-1.5 text-sm border border-gray-300 rounded-md transition-colors',
									currentPage === totalPages
										? 'text-gray-400 cursor-not-allowed'
										: 'text-gray-700 hover:bg-gray-100',
								]"
							>
								Suivant
							</button>
						</div>

						<div class="flex items-center space-x-2 text-sm text-gray-700">
							<span>Afficher</span>
							<select
								v-model="itemsPerPage"
								class="px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
							>
								<option value="10">10</option>
								<option value="25">25</option>
								<option value="50">50</option>
								<option value="100">100</option>
							</select>
							<span>par page</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, watch } from "vue";

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

	// Colonnes disponibles
	const availableColumns = ref([
		{ field: "student", title: "Étudiant" },
		{ field: "course", title: "Cours" },
		{ field: "comment", title: "Commentaire" },
		{ field: "createdAt", title: "Créé le" },
		{ field: "status", title: "Statut" },
		{ field: "actions", title: "Actions" },
	]);

	// Filtres et sélections
	const searchQuery = ref("");
	const selectedGroup = ref("");
	const selectedDate = ref("");
	const selectedSubject = ref("");
	const selectedAbsences = ref<number[]>([]);
	const selectAll = ref(false);
	const currentPage = ref(1);
	const itemsPerPage = ref(10);
	const sortField = ref("createdAt");
	const sortDirection = ref<"asc" | "desc">("desc");
	const showColumnSelector = ref(false);
	const selectedColumns = ref<string[]>([
		"student",
		"course",
		"createdAt",
		"actions",
	]);

	// Computed properties
	const absencesCount = computed(() => {
		return absences.value.filter((absence) => absence.status === "pending")
			.length;
	});

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
					absence.comment.toLowerCase().includes(query) ||
					absence.course.toLowerCase().includes(query),
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
			let aValue: any = a[sortField.value as keyof Absence];
			let bValue: any = b[sortField.value as keyof Absence];

			if (sortField.value === "createdAt" || sortField.value === "courseDate") {
				aValue = new Date(aValue).getTime();
				bValue = new Date(bValue).getTime();
			}

			if (typeof aValue === "string" && typeof bValue === "string") {
				return sortDirection.value === "asc"
					? aValue.localeCompare(bValue)
					: bValue.localeCompare(aValue);
			}

			if (aValue < bValue) return sortDirection.value === "asc" ? -1 : 1;
			if (aValue > bValue) return sortDirection.value === "asc" ? 1 : -1;
			return 0;
		});

		return filtered;
	});

	const totalPages = computed(() => {
		return Math.ceil(filteredAbsences.value.length / itemsPerPage.value);
	});

	const paginatedAbsences = computed(() => {
		const start = (currentPage.value - 1) * itemsPerPage.value;
		const end = start + itemsPerPage.value;
		return filteredAbsences.value.slice(start, end);
	});

	const visibleColumns = computed(() => {
		return availableColumns.value.filter((col) =>
			selectedColumns.value.includes(col.field),
		);
	});

	const visiblePages = computed(() => {
		const pages = [];
		const maxVisible = 5;

		if (totalPages.value <= maxVisible) {
			for (let i = 1; i <= totalPages.value; i++) {
				pages.push(i);
			}
		} else {
			let start = Math.max(1, currentPage.value - 2);
			let end = Math.min(totalPages.value, start + maxVisible - 1);

			if (end - start + 1 < maxVisible) {
				start = Math.max(1, end - maxVisible + 1);
			}

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}
		}

		return pages;
	});

	const showEllipsis = computed(() => {
		return (
			totalPages.value > 5 &&
			(currentPage.value < totalPages.value - 2 || currentPage.value > 3)
		);
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

	function getStatusText(status: string) {
		switch (status) {
			case "pending":
				return "En attente";
			case "validated":
				return "Validée";
			case "rejected":
				return "Rejetée";
			default:
				return status;
		}
	}

	function sortBy(field: string) {
		if (sortField.value === field) {
			sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
		} else {
			sortField.value = field;
			sortDirection.value = "desc";
		}
	}

	function toggleColumnSelector() {
		showColumnSelector.value = !showColumnSelector.value;
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

	function addAbsence() {
		const newAbsence: Absence = {
			id: absences.value.length + 1,
			student: `Nouvel Étudiant ${absences.value.length + 1}`,
			group: groups[Math.floor(Math.random() * groups.length)],
			course: `Cours ${absences.value.length + 1}`,
			subject: subjects[Math.floor(Math.random() * subjects.length)],
			courseDate: new Date().toISOString().split("T")[0],
			comment: "Nouvelle absence ajoutée",
			createdAt: new Date().toISOString(),
			status: "pending",
		};

		absences.value.push(newAbsence);
		alert(`Absence ajoutée pour ${newAbsence.student}`);
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

	function goToPage(page: number) {
		currentPage.value = page;
	}

	// Watchers
	watch(selectAll, (newValue) => {
		if (newValue) {
			selectedAbsences.value = paginatedAbsences.value.map(
				(absence) => absence.id,
			);
		} else {
			selectedAbsences.value = [];
		}
	});

	watch([searchQuery, selectedGroup, selectedDate, selectedSubject], () => {
		currentPage.value = 1;
	});

	watch(itemsPerPage, () => {
		currentPage.value = 1;
	});

	// Initialiser les colonnes sélectionnées
	selectedColumns.value = availableColumns.value.map((col) => col.field);
</script>
