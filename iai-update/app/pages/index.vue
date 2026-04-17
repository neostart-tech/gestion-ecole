<template>
	<div
		class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 lg:p-8"
	>
		<!-- Header avec effet de verre -->
		<div class="mb-8">
			<div
				class="flex flex-col md:flex-row md:items-center justify-between gap-4"
			>
				<div class="space-y-1">
					<h1
						class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white tracking-tight"
					>
						Tableau de bord
					</h1>
					<p
						class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2"
					>
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
							<span class="font-semibold text-indigo-600 dark:text-indigo-400">
								{{ anneeScolaireActive?.nom || currentYear }}
							</span>
						</span>
					</p>
				</div>

				<!-- Badge période avec indicateur de chargement intégré -->
				<div
					class="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50"
				>
					<div v-if="isLoading" class="flex items-center gap-2">
						<svg
							class="animate-spin h-4 w-4 text-indigo-600 dark:text-indigo-400"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						<span class="text-sm font-medium text-gray-600 dark:text-gray-300">
							Chargement des données...
						</span>
					</div>
					<template v-else>
						<span
							class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
						></span>
						<span class="text-sm font-medium text-gray-600 dark:text-gray-300"
							>Mise à jour en temps réel</span
						>
					</template>
				</div>
			</div>
		</div>

		<!-- Statistiques principales -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
			<!-- Loading avec effet de vague -->
			<template v-if="isLoading">
				<div
					v-for="n in 4"
					:key="n"
					class="relative overflow-hidden bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700"
				>
					<!-- Effet de vague de chargement -->
					<div
						class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
					></div>

					<div class="flex items-start justify-between">
						<div class="w-full">
							<div
								class="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
							></div>
							<div
								class="h-8 w-16 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded mt-2"
							></div>
						</div>
						<div
							class="p-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg"
						>
							<div class="w-6 h-6"></div>
						</div>
					</div>
					<div class="mt-3 flex items-center gap-1">
						<div
							class="w-2 h-2 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-full"
						></div>
						<div
							class="h-3 w-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
						></div>
					</div>
				</div>
			</template>

			<!-- Données réelles avec animation d'apparition -->
			<template v-else>
				<div
					v-for="(stat, index) in statsCards"
					:key="stat.title"
					:class="[
						'group bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border',
						stat.borderColor,
						'animate-fade-in-up',
					]"
					:style="{ animationDelay: index * 100 + 'ms' }"
				>
					<div class="flex items-start justify-between">
						<div>
							<p class="text-sm font-medium text-gray-500 dark:text-gray-400">
								{{ stat.title }}
							</p>
							<p
								:class="[
									'text-3xl font-bold text-gray-800 dark:text-white mt-2 transition-colors',
									stat.hoverColor,
								]"
							>
								{{ stat.value }}
							</p>
						</div>
						<div
							:class="[
								'p-3 rounded-lg transition-colors',
								stat.bgColor,
								stat.hoverBgColor,
							]"
						>
							<svg
								class="w-6 h-6"
								:class="stat.iconColor"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								v-html="stat.icon"
							/>
						</div>
					</div>
					<div
						class="mt-3 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1"
					>
						<span
							:class="['inline-block w-2 h-2 rounded-full', stat.dotColor]"
						></span>
						<span>{{ stat.subtitle }}</span>
					</div>
				</div>
			</template>
		</div>

		<!-- Répartition par Cycle et Graphique -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
			<!-- Carte Répartition par Cycle -->
			<div
				class="relative overflow-hidden bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
			>
				<div
					v-if="isLoading"
					class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
				></div>

				<div class="flex items-center gap-3 mb-6">
					<div class="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
						<svg
							class="w-5 h-5 text-indigo-600 dark:text-indigo-400"
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
					<h3 class="font-semibold text-gray-800 dark:text-white text-lg">
						Répartition par Cycle
					</h3>

					<!-- Indicateur de progression pour le chargement -->
					<div v-if="isLoading" class="ml-auto flex items-center gap-2">
						<div
							class="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
						>
							<div
								class="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full animate-progress"
							></div>
						</div>
						<span class="text-xs text-gray-500 dark:text-gray-400"
							>Chargement...</span
						>
					</div>
				</div>

				<div
					v-if="isLoading"
					class="flex flex-col md:flex-row items-center gap-6"
				>
					<!-- Loading avec effet de pulse pour le pie chart -->
					<div class="w-48 h-48 md:w-56 md:h-56 relative">
						<div
							class="w-full h-full rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse"
						></div>
						<!-- Cercles concentriques pour effet de profondeur -->
						<div
							class="absolute inset-2 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 animate-pulse opacity-50"
						></div>
						<div
							class="absolute inset-4 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 animate-pulse opacity-30"
						></div>
					</div>

					<!-- Loading avec effet de vague pour la légende -->
					<div class="flex-1 space-y-4">
						<div
							v-for="n in 2"
							:key="n"
							class="relative overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 p-3 rounded-lg"
						>
							<div
								class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
							></div>
							<div class="flex justify-between items-center mb-2">
								<div class="flex items-center gap-2">
									<div
										class="w-3 h-3 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-full"
									></div>
									<div
										class="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
									></div>
								</div>
								<div
									class="h-4 w-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
								></div>
							</div>
							<div class="flex justify-between items-center">
								<div
									class="h-3 w-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
								></div>
								<div
									class="h-5 w-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full"
								></div>
							</div>
						</div>
						<div
							class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
						>
							<div class="flex justify-between items-center">
								<div
									class="h-4 w-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
								></div>
								<div
									class="h-6 w-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
								></div>
							</div>
						</div>
					</div>
				</div>

				<!-- Données réelles avec animation d'apparition -->
				<div
					v-else
					class="flex flex-col md:flex-row items-center gap-6 animate-fade-in"
				>
					<!-- Pie Chart -->
					<div
						class="w-48 h-48 md:w-56 md:h-56 transition-all duration-500 transform hover:scale-105"
					>
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
							class="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-full"
						>
							<p class="text-gray-400 dark:text-gray-500 text-sm">
								Aucune donnée
							</p>
						</div>
					</div>

					<!-- Légende et statistiques -->
					<div class="flex-1 space-y-4">
						<div
							v-for="(cycle, index) in cycles"
							:key="cycle.name"
							:class="[
								'p-3 rounded-lg transition-all duration-300 hover:shadow-md animate-slide-in-right',
								cycle.bgClass,
							]"
							:style="{ animationDelay: index * 100 + 'ms' }"
						>
							<div class="flex justify-between items-center mb-1">
								<div class="flex items-center gap-2">
									<span
										:class="['w-3 h-3 rounded-full', cycle.dotColor]"
									></span>
									<span class="font-medium text-gray-700 dark:text-gray-300">{{
										cycle.name
									}}</span>
								</div>
								<span :class="['text-sm font-semibold', cycle.percentColor]">
									{{ cycle.percent.toFixed(1) }}%
								</span>
							</div>
							<div class="flex justify-between items-center text-sm">
								<span class="text-gray-500 dark:text-gray-400"
									>{{ cycle.value }} étudiants</span
								>
								<span
									:class="[
										'text-xs px-2 py-0.5 rounded-full',
										cycle.badgeClass,
									]"
								>
									{{ cycle.percentage }}%
								</span>
							</div>
						</div>

						<!-- Total -->
						<div
							class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fade-in"
						>
							<div class="flex justify-between items-center">
								<span class="text-sm text-gray-500 dark:text-gray-400"
									>Total</span
								>
								<div class="text-right">
									<span
										class="text-lg font-bold text-gray-800 dark:text-white animate-count-up"
									>
										{{ totalStudents }}
									</span>
									<span class="text-xs text-gray-500 dark:text-gray-400 ml-1"
										>étudiants</span
									>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Graphique : Nombre d'étudiants par année scolaire -->
			<div
				class="relative overflow-hidden bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
			>
				<div
					v-if="isLoading"
					class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
				></div>

				<div class="flex items-center gap-3 mb-6">
					<div class="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
						<svg
							class="w-5 h-5 text-purple-600 dark:text-purple-400"
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
					<h3 class="font-semibold text-gray-800 dark:text-white text-lg">
						Évolution des inscriptions
					</h3>
				</div>

				<div class="h-72">
					<!-- Loading avec effet de vague -->
					<template v-if="isLoading">
						<div
							class="h-full flex items-end justify-around gap-2 px-4 relative"
						>
							<div
								v-for="n in 5"
								:key="n"
								class="relative w-12 bg-gradient-to-t from-purple-200 to-purple-300 dark:from-purple-900/30 dark:to-purple-800/30 rounded-t-lg overflow-hidden"
								:style="{ height: Math.random() * 60 + 20 + '%' }"
							>
								<div
									class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
								></div>
							</div>
							<!-- Barres de progression animées -->
							<div
								class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-300 to-indigo-300 dark:from-purple-700 dark:to-indigo-700 animate-pulse"
							></div>
						</div>
					</template>

					<!-- Données réelles -->
					<template v-else>
						<Bar
							v-if="etudiantsParAnneeData.labels.length > 0"
							:data="etudiantsParAnneeData"
							:options="{
								responsive: true,
								maintainAspectRatio: false,
								animation: {
									duration: 1000,
									easing: 'easeInOutQuart',
								},
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

						<div
							v-else
							class="h-full flex items-center justify-center animate-fade-in"
						>
							<div class="text-center">
								<svg
									class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3 animate-bounce"
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
								<p class="text-gray-400 dark:text-gray-500 text-sm">
									Aucune donnée disponible
								</p>
							</div>
						</div>
					</template>
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

	const isLoading = ref(true);
	const anneeScolaireStore = useAnneScolaireStore();
	const etudiantStore = useEtudiantStore();
	const filiereStore = useFiliereStore();
	const userStore = useUserStore();
	const statistiqueStore = useStatistiqueStore();

	// Configuration des cartes de stats pour éviter la duplication
	const statsCards = computed(() => [
		{
			title: "Étudiants",
			value: stats.value.students,
			borderColor:
				"border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700",
			hoverColor:
				"group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
			bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
			hoverBgColor:
				"group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50",
			iconColor: "text-indigo-600 dark:text-indigo-400",
			dotColor: "bg-indigo-400 dark:bg-indigo-500",
			subtitle: "Total inscrits",
			icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />',
		},
		{
			title: "Filières",
			value: filiereStore.nombreFiliere,
			borderColor:
				"border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700",
			hoverColor:
				"group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
			bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
			hoverBgColor:
				"group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50",
			iconColor: "text-emerald-600 dark:text-emerald-400",
			dotColor: "bg-emerald-400 dark:bg-emerald-500",
			subtitle: "Programmes actifs",
			icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />',
		},
		{
			title: "Salles utilisées",
			value: stats.value.sallesUtilisees,
			borderColor:
				"border-gray-100 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-700",
			hoverColor: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
			bgColor: "bg-amber-50 dark:bg-amber-900/30",
			hoverBgColor: "group-hover:bg-amber-100 dark:group-hover:bg-amber-900/50",
			iconColor: "text-amber-600 dark:text-amber-400",
			dotColor: "bg-amber-400 dark:bg-amber-500",
			subtitle: "En cours d'utilisation",
			icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />',
		},
		{
			title: "Salles disponibles",
			value: stats.value.sallesDispos,
			borderColor:
				"border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700",
			hoverColor: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
			bgColor: "bg-blue-50 dark:bg-blue-900/30",
			hoverBgColor: "group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50",
			iconColor: "text-blue-600 dark:text-blue-400",
			dotColor: "bg-blue-400 dark:bg-blue-500",
			subtitle: "Libres pour réservation",
			icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />',
		},
	]);

	// Configuration des cycles
	const cycles = computed(() => [
		{
			name: "Licence",
			value: stats.value.licence,
			percent: licencePercent.value,
			percentage: ((stats.value.licence / totalStudents.value) * 100).toFixed(
				1,
			),
			dotColor: "bg-indigo-500",
			percentColor: "text-indigo-600 dark:text-indigo-400",
			bgClass: "bg-indigo-50/50 dark:bg-indigo-900/20",
			badgeClass:
				"bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300",
		},
		{
			name: "Master",
			value: stats.value.master,
			percent: masterPercent.value,
			percentage: ((stats.value.master / totalStudents.value) * 100).toFixed(1),
			dotColor: "bg-emerald-500",
			percentColor: "text-emerald-600 dark:text-emerald-400",
			bgClass: "bg-emerald-50/50 dark:bg-emerald-900/20",
			badgeClass:
				"bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
		},
	]);

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

	// Chargement des données avec gestion d'erreur
	const loadData = async () => {
		isLoading.value = true;

		try {
			// Chargement parallèle avec gestion d'erreur individuelle
			await Promise.allSettled([
				etudiantStore
					.fetchEtudiants()
					.catch((err) => console.error("Erreur étudiants:", err)),
				filiereStore
					.fetchFilieres()
					.catch((err) => console.error("Erreur filières:", err)),
				userStore
					.fetchUsersEnseignant()
					.catch((err) => console.error("Erreur enseignants:", err)),
				anneeScolaireStore
					.fetchAnneeScolaire()
					.catch((err) => console.error("Erreur années:", err)),
				statistiqueStore
					.fetchAllStats()
					.catch((err) => console.error("Erreur stats:", err)),
			]);

			await fetchEtudiantsParAnnee();
		} catch (error) {
			console.error("Erreur globale lors du chargement:", error);
		} finally {
			// Petit délai pour une transition fluide
			setTimeout(() => {
				isLoading.value = false;
			}, 500);
		}
	};

	onMounted(async () => {
		await loadData();
	});
</script>

<style scoped>
	/* Animations personnalisées */
	@keyframes shimmer {
		100% {
			transform: translateX(100%);
		}
	}

	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes slide-in-right {
		from {
			opacity: 0;
			transform: translateX(30px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes count-up {
		from {
			transform: scale(0.5);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes progress {
		0% {
			width: 0%;
		}
		50% {
			width: 70%;
		}
		100% {
			width: 100%;
		}
	}

	.animate-fade-in-up {
		animation: fade-in-up 0.6s ease-out forwards;
		opacity: 0;
	}

	.animate-slide-in-right {
		animation: slide-in-right 0.5s ease-out forwards;
		opacity: 0;
	}

	.animate-fade-in {
		animation: fade-in-up 0.8s ease-out forwards;
	}

	.animate-count-up {
		animation: count-up 0.5s ease-out forwards;
	}

	.animate-progress {
		animation: progress 2s ease-in-out infinite;
	}

	.animate-[shimmer_2s_infinite] {
		animation: shimmer 2s infinite;
	}

	/* Transition fluide pour le changement d'état */
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.3s ease;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}
</style>
