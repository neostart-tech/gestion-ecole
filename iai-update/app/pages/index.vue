<template>
	<div
		class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8"
	>
		<!-- Header avec effet de verre -->
		<div class="mb-8">
			<div
				class="flex flex-col md:flex-row md:items-center justify-between gap-4"
			>
				<div class="space-y-1">
					<h1
						class="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight"
					>
						Tableau de bord
					</h1>
					<p class="text-sm text-gray-500 flex items-center gap-2">
						<svg
							class="w-4 h-4"
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
						<span
							>Année universitaire
							<span class="font-semibold text-indigo-600">{{
								anneeScolaireActive?.nom || currentYear
							}}</span></span
						>
					</p>
				</div>

				<!-- Badge période -->
				<div
					class="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-gray-200/50"
				>
					<span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
					<span class="text-sm font-medium text-gray-600"
						>Mise à jour en temps réel</span
					>
				</div>
			</div>
		</div>

		<!-- Statistiques principales avec design moderne -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
			<div
				class="group bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-indigo-200"
			>
				<div class="flex items-start justify-between">
					<div>
						<p class="text-sm font-medium text-gray-500">Étudiants</p>
						<p
							class="text-3xl font-bold text-gray-800 mt-2 group-hover:text-indigo-600 transition-colors"
						>
							{{ stats.students }}
						</p>
					</div>
					<div
						class="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors"
					>
						<svg
							class="w-6 h-6 text-indigo-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
							/>
						</svg>
					</div>
				</div>
				<div class="mt-3 text-xs text-gray-400 flex items-center gap-1">
					<span class="inline-block w-2 h-2 bg-indigo-400 rounded-full"></span>
					<span>Total inscrits</span>
				</div>
			</div>

			<div
				class="group bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-emerald-200"
			>
				<div class="flex items-start justify-between">
					<div>
						<p class="text-sm font-medium text-gray-500">Filières</p>
						<p
							class="text-3xl font-bold text-gray-800 mt-2 group-hover:text-emerald-600 transition-colors"
						>
							{{ stats.filieres }}
						</p>
					</div>
					<div
						class="p-3 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors"
					>
						<svg
							class="w-6 h-6 text-emerald-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
							/>
						</svg>
					</div>
				</div>
				<div class="mt-3 text-xs text-gray-400 flex items-center gap-1">
					<span class="inline-block w-2 h-2 bg-emerald-400 rounded-full"></span>
					<span>Programmes actifs</span>
				</div>
			</div>

			<div
				class="group bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-amber-200"
			>
				<div class="flex items-start justify-between">
					<div>
						<p class="text-sm font-medium text-gray-500">Salles utilisées</p>
						<p
							class="text-3xl font-bold text-gray-800 mt-2 group-hover:text-amber-600 transition-colors"
						>
							{{ stats.sallesUtilisees }}
						</p>
					</div>
					<div
						class="p-3 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors"
					>
						<svg
							class="w-6 h-6 text-amber-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
							/>
						</svg>
					</div>
				</div>
				<div class="mt-3 text-xs text-gray-400 flex items-center gap-1">
					<span class="inline-block w-2 h-2 bg-amber-400 rounded-full"></span>
					<span>En cours d'utilisation</span>
				</div>
			</div>

			<div
				class="group bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200"
			>
				<div class="flex items-start justify-between">
					<div>
						<p class="text-sm font-medium text-gray-500">Salles disponibles</p>
						<p
							class="text-3xl font-bold text-gray-800 mt-2 group-hover:text-blue-600 transition-colors"
						>
							{{ stats.sallesDispos }}
						</p>
					</div>
					<div
						class="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors"
					>
						<svg
							class="w-6 h-6 text-blue-600"
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
				</div>
				<div class="mt-3 text-xs text-gray-400 flex items-center gap-1">
					<span class="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
					<span>Libres pour réservation</span>
				</div>
			</div>
		</div>

		<!-- Répartition par Cycle et Graphique -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
			<!-- Carte Répartition par Cycle avec Pie Chart -->
			<div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
				<div class="flex items-center gap-3 mb-6">
					<div class="p-2 bg-indigo-50 rounded-lg">
						<svg
							class="w-5 h-5 text-indigo-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
							/>
						</svg>
					</div>
					<h3 class="font-semibold text-gray-800 text-lg">
						Répartition par Cycle
					</h3>
				</div>

				<div class="flex flex-col md:flex-row items-center gap-6">
					<!-- Pie Chart -->
					<div class="w-48 h-48 md:w-56 md:h-56">
						<Pie
							v-if="totalStudents > 0"
							:data="cycleData"
							:options="{
								responsive: true,
								maintainAspectRatio: true,
								plugins: {
									legend: {
										display: false,
									},
									tooltip: {
										backgroundColor: '#1F2937',
										titleColor: '#F9FAFB',
										bodyColor: '#F3F4F6',
										padding: 12,
										cornerRadius: 8,
										callbacks: {
											label: (context) => {
												const label = context.label || '';
												const value = context.raw || 0;
												const percentage = (
													(value / totalStudents) *
													100
												).toFixed(1);
												return `${label}: ${value} étudiants (${percentage}%)`;
											},
										},
									},
								},
								cutout: '0%',
							}"
						/>
						<div
							v-else
							class="w-full h-full flex items-center justify-center bg-gray-50 rounded-full"
						>
							<p class="text-gray-400 text-sm">Aucune donnée</p>
						</div>
					</div>

					<!-- Légende et statistiques -->
					<div class="flex-1 space-y-4">
						<!-- Licence -->
						<div class="bg-indigo-50/50 p-3 rounded-lg">
							<div class="flex justify-between items-center mb-1">
								<div class="flex items-center gap-2">
									<span class="w-3 h-3 bg-indigo-500 rounded-full"></span>
									<span class="font-medium text-gray-700">Licence</span>
								</div>
								<span class="text-sm font-semibold text-indigo-600"
									>{{ licencePercent.toFixed(1) }}%</span
								>
							</div>
							<div class="flex justify-between items-center text-sm">
								<span class="text-gray-500">{{ stats.licence }} étudiants</span>
								<span
									class="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full"
								>
									{{ ((stats.licence / totalStudents) * 100).toFixed(1) }}%
								</span>
							</div>
						</div>

						<!-- Master -->
						<div class="bg-emerald-50/50 p-3 rounded-lg">
							<div class="flex justify-between items-center mb-1">
								<div class="flex items-center gap-2">
									<span class="w-3 h-3 bg-emerald-500 rounded-full"></span>
									<span class="font-medium text-gray-700">Master</span>
								</div>
								<span class="text-sm font-semibold text-emerald-600"
									>{{ masterPercent.toFixed(1) }}%</span
								>
							</div>
							<div class="flex justify-between items-center text-sm">
								<span class="text-gray-500">{{ stats.master }} étudiants</span>
								<span
									class="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full"
								>
									{{ ((stats.master / totalStudents) * 100).toFixed(1) }}%
								</span>
							</div>
						</div>

						<!-- Total -->
						<div class="mt-4 pt-4 border-t border-gray-200">
							<div class="flex justify-between items-center">
								<span class="text-sm text-gray-500">Total</span>
								<div class="text-right">
									<span class="text-lg font-bold text-gray-800">{{
										totalStudents
									}}</span>
									<span class="text-xs text-gray-500 ml-1">étudiants</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Graphique : Nombre d'étudiants par année scolaire -->
			<div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
				<div class="flex items-center gap-3 mb-6">
					<div class="p-2 bg-purple-50 rounded-lg">
						<svg
							class="w-5 h-5 text-purple-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<h3 class="font-semibold text-gray-800 text-lg">
						Évolution des inscriptions
					</h3>
				</div>

				<div class="h-72">
					<Bar
						v-if="etudiantsParAnneeData.labels.length > 0"
						:data="etudiantsParAnneeData"
						:options="{
							responsive: true,
							maintainAspectRatio: false,
							plugins: {
								legend: {
									display: false,
								},
								tooltip: {
									backgroundColor: '#1F2937',
									titleColor: '#F9FAFB',
									bodyColor: '#F3F4F6',
									padding: 12,
									cornerRadius: 8,
									displayColors: false,
								},
							},
							scales: {
								y: {
									beginAtZero: true,
									grid: {
										color: 'rgba(0, 0, 0, 0.05)',
									},
									ticks: {
										color: '#6B7280',
										font: { size: 11 },
									},
								},
								x: {
									grid: { display: false },
									ticks: {
										color: '#6B7280',
										font: { size: 11 },
									},
								},
							},
						}"
					/>

					<div v-else class="h-full flex items-center justify-center">
						<div class="text-center">
							<svg
								class="w-12 h-12 text-gray-300 mx-auto mb-3"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
								/>
							</svg>
							<p class="text-gray-400 text-sm">Aucune donnée disponible</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted } from "vue";
	import { useEtudiantStore } from "~~/stores/etudiant";
	import { useFiliereStore } from "~~/stores/filiere";
	import { useUserStore } from "~~/stores/user";
	import { useAnneScolaireStore } from "~~/stores/annee-scolaire";
	import { useStatistiqueStore } from "~~/stores/statistique";
	import axios from "axios";
	import { Chart, registerables } from "chart.js";
	import { Bar, Pie } from "vue-chartjs";

	Chart.register(...registerables);

	const anneeScolaireStore = useAnneScolaireStore();
	const etudiantStore = useEtudiantStore();
	const filiereStore = useFiliereStore();
	const userStore = useUserStore();
	const statistiqueStore = useStatistiqueStore();

	// Données pour le Pie Chart
	const cycleData = computed(() => ({
		labels: ["Licence", "Master"],
		datasets: [
			{
				data: [stats.value.licence, stats.value.master],
				backgroundColor: ["#6366F1", "#10B981"],
				borderColor: ["#4F46E5", "#059669"],
				borderWidth: 2,
				hoverOffset: 10,
			},
		],
	}));

	// Utilisation directe des données du store
	const stats = computed(() => ({
		students: etudiantStore.nombreEtudiant,
		filieres: statistiqueStore.stats.filieres,
		licence: statistiqueStore.stats.etudiants.licence,
		master: statistiqueStore.stats.etudiants.master,
		sallesUtilisees: statistiqueStore.stats.salles.utilisees,
		sallesDispos: statistiqueStore.stats.salles.dispos,
	}));

	const currentYear = computed(() => {
		const year = new Date().getFullYear();
		return `${year}`;
	});

	const anneeScolaireActive = computed(() => {
		return (
			anneeScolaireStore.annneescolaires.find((annee) => annee.active) || null
		);
	});

	const totalStudents = computed(
		() => stats.value.licence + stats.value.master,
	);

	const licencePercent = computed(() =>
		totalStudents.value > 0
			? (stats.value.licence / totalStudents.value) * 100
			: 0,
	);

	const masterPercent = computed(() =>
		totalStudents.value > 0
			? (stats.value.master / totalStudents.value) * 100
			: 0,
	);

	// Données pour le graphique du nombre d'étudiants par année scolaire
	const etudiantsParAnneeData = ref({
		labels: [],
		datasets: [
			{
				label: "Nombre d'étudiants",
				backgroundColor: "#4F46E5",
				data: [],
			},
		],
	});

	const createGradient = (ctx, area) => {
		const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
		gradient.addColorStop(0, "rgba(79, 70, 229, 0.8)");
		gradient.addColorStop(1, "rgba(139, 92, 246, 0.8)");
		return gradient;
	};

	// Récupère les données pour le graphique
	const fetchEtudiantsParAnnee = async () => {
		try {
			const annees = anneeScolaireStore.annneescolaires;
			if (annees.length === 0) {
				console.warn("Aucune année scolaire disponible.");
				return;
			}

			const labels = annees.map((annee) => annee.nom);
			const data = await Promise.all(
				annees.map(async (annee) => {
					try {
						const response = await axios.get(
							`/statistiques/etudiants/total/${annee.id}`,
							{
								headers: {
									Authorization: `Bearer ${localStorage.getItem("gest-ecole-token")}`,
								},
							},
						);
						return response.data;
					} catch (error) {
						console.error(`Erreur pour l'année ${annee.id}:`, error);
						return 0;
					}
				}),
			);

			etudiantsParAnneeData.value = {
				labels: labels,
				datasets: [
					{
						label: "Nombre d'étudiants",
						data: data,
						backgroundColor: (context) => {
							const chart = context.chart;
							const { ctx, chartArea } = chart;
							if (!chartArea) {
								return null;
							}
							return createGradient(ctx, chartArea);
						},
						borderColor: "rgba(79, 70, 229, 0.5)",
						borderWidth: 1,
						borderRadius: 6,
						hoverBackgroundColor: "rgba(79, 70, 229, 0.8)",
						hoverBorderColor: "rgba(79, 70, 229, 1)",
					},
				],
			};
		} catch (error) {
			console.error(
				"Erreur globale lors du chargement des étudiants par année:",
				error,
			);
		}
	};

	onMounted(async () => {
		await Promise.all([
			etudiantStore.fetchEtudiants(),
			filiereStore.fetchFilieres(),
			userStore.fetchUsersEnseignant(),
			anneeScolaireStore.fetchAnneeScolaire(),
			statistiqueStore.fetchAllStats(),
		]);
		await fetchEtudiantsParAnnee();
	});
</script>
