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
				<!-- Carte Situation Financière pour l'étudiant -->
				<div v-if="userRole === 'etudiant' && financialRecap"
					class="col-span-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-blue-600 mb-6 animate-fade-in"
				>
					<div class="flex flex-col md:flex-row justify-between items-center gap-6">
						<div class="space-y-1">
							<h3 class="text-lg font-bold text-gray-800 dark:text-white">Votre situation financière</h3>
							<p class="text-sm text-gray-500">Année scolaire {{ anneeScolaireActive?.nom }}</p>
						</div>
						
						<div class="flex items-center gap-8">
							<div class="text-center">
								<p class="text-xs text-gray-400 uppercase font-semibold">Montant Total</p>
								<p class="text-xl font-bold text-gray-800 dark:text-white">{{ financialRecap.montant_total.toLocaleString() }} FCFA</p>
							</div>
							<div class="text-center">
								<p class="text-xs text-gray-400 uppercase font-semibold text-green-500">Déjà Payé</p>
								<p class="text-xl font-bold text-green-600">{{ financialRecap.total_paye.toLocaleString() }} FCFA</p>
							</div>
							<div class="text-center">
								<p class="text-xs text-gray-400 uppercase font-semibold text-red-500">Reste à Payer</p>
								<p class="text-xl font-bold text-red-600">{{ financialRecap.reste_a_payer.toLocaleString() }} FCFA</p>
							</div>
						</div>

						<NuxtLink to="/etudiant/mes-paiements" class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
							Détails & Paiement
						</NuxtLink>
					</div>

					<!-- Barre de progression -->
					<div class="mt-6">
						<div class="flex justify-between items-center mb-1 text-xs font-semibold">
							<span class="text-gray-500">Progression du paiement</span>
							<span class="text-blue-600">{{ financialRecap.pourcentage }}%</span>
						</div>
						<div class="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
							<div class="h-full bg-blue-600 rounded-full transition-all duration-1000" :style="{ width: financialRecap.pourcentage + '%' }"></div>
						</div>
					</div>
				</div>

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

		<!-- Grille 1 : Répartition par Cycle & Évolution des inscriptions -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
			<!-- Carte Répartition par Cycle -->
			<div class="relative overflow-hidden bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
				<div v-if="isLoading" class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"></div>
				<div class="flex items-center gap-3 mb-6">
					<div class="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
						<svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
						</svg>
					</div>
					<h3 class="font-semibold text-gray-800 dark:text-white text-lg">Répartition par Cycle</h3>
				</div>

				<div v-if="isLoading" class="flex flex-col md:flex-row items-center gap-6">
					<div class="w-48 h-48 rounded-full bg-gray-100 dark:bg-gray-700 animate-pulse"></div>
					<div class="flex-1 space-y-4 w-full">
						<div v-for="n in 2" :key="n" class="h-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-pulse"></div>
					</div>
				</div>
				<div v-else class="flex flex-col md:flex-row items-center gap-6 animate-fade-in">
					<div class="w-48 h-48 md:w-56 md:h-56">
						<Pie v-if="totalStudents > 0" :data="cycleData" :options="{ responsive: true, plugins: { legend: { display: false } } }" />
						<div v-else class="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-full">
							<p class="text-gray-400 text-sm">Aucune donnée</p>
						</div>
					</div>
					<div class="flex-1 space-y-4 w-full">
						<div v-for="(cycle, index) in cycles" :key="cycle.name" :class="['p-3 rounded-lg', cycle.bgClass]">
							<div class="flex justify-between items-center mb-1">
								<div class="flex items-center gap-2">
									<span :class="['w-3 h-3 rounded-full', cycle.dotColor]"></span>
									<span class="font-medium text-gray-700 dark:text-gray-300">{{ cycle.name }}</span>
								</div>
								<span :class="['text-sm font-semibold', cycle.percentColor]">{{ cycle.percent.toFixed(1) }}%</span>
							</div>
							<div class="flex justify-between items-center text-sm text-gray-500">
								<span>{{ cycle.value }} étudiants</span>
								<span :class="['text-xs px-2 py-0.5 rounded-full', cycle.badgeClass]">{{ cycle.percentage }}%</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Carte Évolution des inscriptions -->
			<div class="relative overflow-hidden bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
				<div v-if="isLoading" class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"></div>
				<div class="flex items-center gap-3 mb-6">
					<div class="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
						<svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
					</div>
					<h3 class="font-semibold text-gray-800 dark:text-white text-lg">Évolution des inscriptions</h3>
				</div>
				<div class="h-72">
					<Bar v-if="!isLoading && etudiantsParAnneeData.labels.length > 0" :data="etudiantsParAnneeData" :options="{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }" />
					<div v-else-if="isLoading" class="h-full flex items-center justify-center">Chargement...</div>
					<div v-else class="h-full flex items-center justify-center text-gray-400 italic text-sm">Aucune donnée disponible</div>
				</div>
			</div>
		</div>

		<!-- Grille 2 : Tendance Assiduité & Top Filières -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
			<!-- Tendance de l'assiduité -->
			<div class="relative overflow-hidden bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
				<div class="flex items-center justify-between mb-6">
					<div class="flex items-center gap-3">
						<div class="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
							<svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
							</svg>
						</div>
						<h3 class="font-semibold text-gray-800 dark:text-white text-lg">Tendance de l'assiduité</h3>
					</div>
					<div class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full dark:bg-green-900/20">6 derniers mois</div>
				</div>
				<div class="h-72">
					<Line v-if="!isLoading && presenceTrendData.labels.length > 0" :data="presenceTrendData" :options="{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }" />
					<div v-else-if="isLoading" class="h-full flex items-center justify-center text-gray-400">Chargement...</div>
					<div v-else class="h-full flex items-center justify-center text-gray-400 italic text-sm">Données insuffisantes</div>
				</div>
			</div>

			<!-- Top Filières -->
			<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
				<div class="flex items-center gap-3 mb-6">
					<div class="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
						<svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
						</svg>
					</div>
					<h3 class="font-semibold text-gray-800 dark:text-white text-lg">Top Filières</h3>
				</div>
				<div class="space-y-4">
					<div v-if="isLoading" class="space-y-4">
						<div v-for="n in 5" :key="n" class="h-10 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-pulse"></div>
					</div>
					<template v-else-if="statistiqueStore.stats.topFilieres.length > 0">
						<div v-for="(filiere, idx) in statistiqueStore.stats.topFilieres" :key="filiere.name" class="flex items-center gap-4">
							<div class="w-6 h-6 rounded bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">{{ idx + 1 }}</div>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{{ filiere.name }}</p>
								<div class="w-full bg-gray-100 dark:bg-gray-700 h-1 rounded-full mt-1 overflow-hidden">
									<div class="bg-indigo-500 h-full rounded-full" :style="{ width: (filiere.total / statistiqueStore.stats.topFilieres[0].total * 100) + '%' }"></div>
								</div>
							</div>
							<div class="text-right"><span class="text-sm font-bold text-gray-800 dark:text-white">{{ filiere.total }}</span></div>
						</div>
					</template>
					<div v-else class="text-center py-8 text-gray-400 italic text-sm">Aucune donnée</div>
				</div>
			</div>
		</div>

		<!-- Grille 3 : Évaluations & Autres -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
			<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
				<div class="flex items-center justify-between mb-6">
					<div class="flex items-center gap-3">
						<div class="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
							<svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
							</svg>
						</div>
						<h3 class="font-bold text-gray-800 dark:text-white text-lg">Activité des Évaluations</h3>
					</div>
					<!-- Sélecteur de Période -->
					<select 
						v-model="selectedPeriodeId"
						@change="updateEvalStats"
						class="text-xs bg-gray-50 dark:bg-gray-900 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 py-1 pl-2 pr-8 text-gray-600 dark:text-gray-400"
					>
						<option :value="null">Année entière</option>
						<option v-for="p in statistiqueStore.stats.periodes" :key="p.id" :value="p.id">
							{{ p.nom }}
						</option>
					</select>
				</div>
				<div class="space-y-6">
					<div class="flex items-center justify-between">
						<div class="space-y-1">
							<p class="text-sm text-gray-500">Taux de réussite {{ selectedPeriodeId ? 'périodique' : 'global' }}</p>
							<p class="text-2xl font-bold text-gray-800 dark:text-white">{{ statistiqueStore.stats.evalStats.reussite }}%</p>
						</div>
						<div class="w-20 h-20 relative">
							<svg class="w-full h-full transform -rotate-90">
								<circle cx="40" cy="40" r="35" stroke="currentColor" stroke-width="6" fill="transparent" class="text-gray-100 dark:text-gray-700" />
								<circle cx="40" cy="40" r="35" stroke="currentColor" stroke-width="6" fill="transparent" 
									:stroke-dasharray="2 * Math.PI * 35" 
									:stroke-dashoffset="2 * Math.PI * 35 * (1 - statistiqueStore.stats.evalStats.reussite / 100)" 
									class="text-indigo-600 transition-all duration-1000" stroke-linecap="round" />
							</svg>
							<div class="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-indigo-600 px-1 text-center leading-tight">
								{{ selectedPeriodeName }}
							</div>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-4">
						<div class="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
							<p class="text-xs text-gray-500 mb-1 uppercase">Programmés</p>
							<p class="text-lg font-bold">{{ statistiqueStore.stats.evaluations }}</p>
						</div>
						<div class="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
							<p class="text-xs text-gray-500 mb-1 uppercase">Validés</p>
							<p class="text-lg font-bold">{{ statistiqueStore.stats.evalStats.validees }}</p>
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
	import { useLoginStore } from "~~/stores/login";
	import axios from "axios";
	import { Chart, registerables } from "chart.js";
	import { Bar, Pie, Line } from "vue-chartjs";

	Chart.register(...registerables);

	const selectedPeriodeId = ref(null);

	const selectedPeriodeName = computed(() => {
		if (!selectedPeriodeId.value) return 'Année';
		const periode = statistiqueStore.stats.periodes.find(p => p.id === selectedPeriodeId.value);
		return periode ? periode.nom : 'Année';
	});

	const updateEvalStats = async () => {
		await statistiqueStore.fetchEvalStats({ periode_id: selectedPeriodeId.value });
	};

	const isLoading = ref(true);
	const financialRecap = ref(null);
	const userRole = ref('');
	const anneeScolaireStore = useAnneScolaireStore();
	const loginStore = useLoginStore();
	const { $api } = useNuxtApp();

	const userData = computed(() => {
		try {
			if (process.client) {
				const user = JSON.parse(localStorage.getItem("user") || "{}");
				if (user && user.roles && user.roles.length > 0) {
					userRole.value = user.roles[0].slug;
				}
				return user;
			}
			return {};
		} catch {
			return {};
		}
	});

	const fetchFinancialRecap = async () => {
		if (userRole.value === 'etudiant' && userData.value.id) {
			try {
				const response = await $api.get(`/paiements/recap/${userData.value.id}`);
				if (response.success) {
					financialRecap.value = response.data;
				}
			} catch (error) {
				console.error('Erreur recap financier:', error);
			}
		}
	};

	const showNationaliteAlert = computed(() => {
		const user = userData.value;
		if (!user || !user.roles) return false;
		const isEnseignant = user.roles.some(r => r.slug === 'enseignant' || r.slug === 'professeur');
		return isEnseignant && (!user.nationalite || user.nationalite.trim() === '');
	});

	const showNifAlert = computed(() => {
		const user = userData.value;
		if (!user || !user.roles) return false;
		const isEnseignant = user.roles.some(r => r.slug === 'enseignant' || r.slug === 'professeur');
		if (!isEnseignant) return false;
		
		const isTogolais = user.nationalite === 'Togo' || user.nationalite === 'Togolaise';
		const hasNoValidNif = !user.nif || ['N/A', 'N/R', ''].includes(user.nif.trim().toUpperCase());
		
		return isTogolais && hasNoValidNif;
	});

	const showDocumentsAlert = computed(() => {
		const user = userData.value;
		if (!user || !user.roles) return false;
		const isEnseignant = user.roles.some(r => r.slug === 'enseignant' || r.slug === 'professeur');
		if (!isEnseignant) return false;
		
		// Vérifier si au moins un document essentiel est manquant
		const missingDocs = !user.identity_document_url || !user.diploma_document_url || !user.cv_document_url;
		
		// Pour le NIF, on ne l'exige dans cette alerte que si Togolais
		const isTogolais = user.nationalite === 'Togo' || user.nationalite === 'Togolaise';
		const missingNifDoc = isTogolais && !user.nif_document_url;
		
		return missingDocs || missingNifDoc;
	});

	const etudiantStore = useEtudiantStore();
	const filiereStore = useFiliereStore();
	const userStore = useUserStore();
	const statistiqueStore = useStatistiqueStore();

	// Configuration des cartes de stats pour éviter la duplication
	const statsCards = computed(() => [
		{
			title: "Étudiants",
			value: stats.value.students,
			borderColor: "border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700",
			hoverColor: "group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
			bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
			hoverBgColor: "group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50",
			iconColor: "text-indigo-600 dark:text-indigo-400",
			dotColor: "bg-indigo-400 dark:bg-indigo-500",
			subtitle: "Total inscrits",
			icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />',
		},
		{
			title: "Enseignants",
			value: statistiqueStore.stats.enseignants,
			borderColor: "border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700",
			hoverColor: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
			bgColor: "bg-blue-50 dark:bg-blue-900/30",
			hoverBgColor: "group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50",
			iconColor: "text-blue-600 dark:text-blue-400",
			dotColor: "bg-blue-400 dark:bg-blue-500",
			subtitle: "Corps professoral",
			icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6m-6 4h10" />',
		},
		{
			title: "Filières",
			value: filiereStore.nombreFiliere,
			borderColor: "border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700",
			hoverColor: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
			bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
			hoverBgColor: "group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50",
			iconColor: "text-emerald-600 dark:text-emerald-400",
			dotColor: "bg-emerald-400 dark:bg-emerald-500",
			subtitle: "Programmes actifs",
			icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />',
		},
		{
			title: "Taux Présence",
			value: statistiqueStore.stats.presenceTaux + "%",
			borderColor: "border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-700",
			hoverColor: "group-hover:text-green-600 dark:group-hover:text-green-400",
			bgColor: "bg-green-50 dark:bg-green-900/30",
			hoverBgColor: "group-hover:bg-green-100 dark:group-hover:bg-green-900/50",
			iconColor: "text-green-600 dark:text-green-400",
			dotColor: "bg-green-400 dark:bg-green-500",
			subtitle: "Moyenne globale",
			icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />',
		},
		{
			title: "Évaluations",
			value: statistiqueStore.stats.evaluations,
			borderColor: "border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700",
			hoverColor: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
			bgColor: "bg-purple-50 dark:bg-purple-900/30",
			hoverBgColor: "group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50",
			iconColor: "text-purple-600 dark:text-purple-400",
			dotColor: "bg-purple-400 dark:bg-purple-500",
			subtitle: "Examens programmés",
			icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />',
		},
		{
			title: "Candidatures",
			value: statistiqueStore.stats.candidaturesEnAttente,
			borderColor: "border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-700",
			hoverColor: "group-hover:text-orange-600 dark:group-hover:text-orange-400",
			bgColor: "bg-orange-50 dark:bg-orange-900/30",
			hoverBgColor: "group-hover:bg-orange-100 dark:group-hover:bg-orange-900/50",
			iconColor: "text-orange-600 dark:text-orange-400",
			dotColor: "bg-orange-400 dark:bg-orange-500",
			subtitle: "À valider",
			icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />',
		},
		{
			title: "Salles occupées",
			value: stats.value.sallesUtilisees,
			borderColor: "border-gray-100 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-700",
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
			borderColor: "border-gray-100 dark:border-gray-700 hover:border-cyan-200 dark:hover:border-cyan-700",
			hoverColor: "group-hover:text-cyan-600 dark:group-hover:text-cyan-400",
			bgColor: "bg-cyan-50 dark:bg-cyan-900/30",
			hoverBgColor: "group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/50",
			iconColor: "text-cyan-600 dark:text-cyan-400",
			dotColor: "bg-cyan-400 dark:bg-cyan-500",
			subtitle: "Libres maintenant",
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

	// Données pour le graphique de tendance de l'assiduité
	const presenceTrendData = ref({
		labels: [],
		datasets: [
			{
				label: "Taux d'assiduité (%)",
				borderColor: "#10B981",
				backgroundColor: "rgba(16, 185, 129, 0.1)",
				data: [],
				fill: true,
				tension: 0.4,
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

	// Récupère les données de tendance de présence
	const fetchPresenceTrend = async () => {
		try {
			const response = await axios.get("/statistiques/presences/tendance", {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("gest-ecole-token")}`,
				},
			});
			presenceTrendData.value = {
				labels: response.data.labels,
				datasets: [
					{
						label: "Taux d'assiduité (%)",
						borderColor: "#10B981",
						backgroundColor: "rgba(16, 185, 129, 0.1)",
						data: response.data.data,
						fill: true,
						tension: 0.4,
						pointBackgroundColor: "#10B981",
						pointBorderColor: "#fff",
						pointHoverRadius: 6,
						pointRadius: 4,
					},
				],
			};
		} catch (error) {
			console.error("Erreur tendance présence:", error);
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

			await Promise.all([
				fetchEtudiantsParAnnee(),
				fetchPresenceTrend(),
			]);
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
		// Vérifier l'utilisateur
		try {
			await loginStore.fetchUser();
		} catch (error) {
			if (error.response?.status === 404 || error.response?.status === 401) {
				loginStore.logout();
				navigateTo("/login");
				return;
			}
		}
		
		await loadData();
		if (userRole.value === 'etudiant') {
			await fetchFinancialRecap();
		}
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
