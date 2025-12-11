<template>
	<div class="min-h-screen bg-gray-50 p-4 md:p-6">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Breadcrumb -->
			<Breadcrumb
				:items="[
					{ label: 'Unités de valeur', to: '/' },
					{ label: 'Liste', to: null },
				]"
				title="Liste des unités de valeur"
				:title-class="'text-xl md:text-2xl text-gray-800'"
				:spacing="'mb-2'"
				:link-color="'text-blue-600 hover:text-blue-800'"
				:active-color="'text-gray-900 font-medium'"
				:text-size="'text-base'"
				align="left"
			/>

			<div class="flex gap-3 mb-6 items-start flex-wrap">
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
						class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
						placeholder="Rechercher..."
					/>
				</div>

				<!-- Sélecteur de colonnes -->
				<div class="relative">
					<button
						class="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
						@click="toggleSelector"
					>
						<span>Toutes les colonnes</span>
						<svg
							class="w-5 h-5 transition-transform duration-200"
							:class="{ 'rotate-180': showSelector }"
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
						v-if="showSelector"
						class="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[200px]"
					>
						<div class="p-3 space-y-2 max-h-60 overflow-y-auto">
							<div
								v-for="col in availableColumns"
								:key="col.field"
								class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
							>
								<input
									type="checkbox"
									:id="col.field"
									v-model="selectedColumns"
									:value="col.field"
									class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
								/>
								<label
									:for="col.field"
									class="text-sm text-gray-700 cursor-pointer select-none"
									>{{ col.title }}</label
								>
							</div>
						</div>
					</div>
				</div>

				<!-- Bouton Ajouter -->
				<button
					class="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
					Ajouter UV
				</button>
			</div>

			<!-- Tableau avec Vue3Datatable -->
			<div class="table-card">
				<Vue3Datatable
					:columns="filteredCols"
					:rows="rows"
					:per-page="10"
					:search="searchQuery"
					:pagination-options="{ dropdown: true, edge: true }"
					:searchable="true"
					:sortable="true"
					:filterable="true"
					:skin="'bh-table-hover bh-table-striped'"
					class="uv-datatable"
				>
					<!-- Template pour la colonne coefficient -->
					<template #coef="data">
						<span
							class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
							:class="getCoefficientClass(data.value)"
						>
							{{ data.value }}
						</span>
					</template>

					<!-- Template pour les actions -->
					<template #action="data">
						<div class="flex space-x-3">
							<button
								@click="editItem(data.value)"
								class="text-blue-600 hover:text-blue-900 transition-colors"
								title="Modifier"
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
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
									/>
								</svg>
							</button>
							<button
								@click="deleteItem(data.value)"
								class="text-red-600 hover:text-red-900 transition-colors"
								title="Supprimer"
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
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
							</button>
						</div>
					</template>
				</Vue3Datatable>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted } from "vue";
	import Vue3Datatable from "@bhplugin/vue3-datatable";
	import "@bhplugin/vue3-datatable/dist/style.css";

	const searchQuery = ref("");
	const showSelector = ref(false);

	// Configuration des colonnes
	const availableColumns = ref([
		{ field: "id", title: "ID", width: "60px", isUnique: true },
		{ field: "nom", title: "Nom" },
		{ field: "code", title: "Code" },
		{ field: "coef", title: "Coefficient", type: "number" },
		{ field: "ue", title: "UE" },
		{ field: "action", title: "Action", sort: false },
	]);

	const selectedColumns = ref([]);

	// Initialiser avec toutes les colonnes sélectionnées
	onMounted(() => {
		selectedColumns.value = availableColumns.value.map((col) => col.field);
	});

	// Colonnes filtrées selon la sélection
	const filteredCols = computed(() => {
		return availableColumns.value.filter((col) =>
			selectedColumns.value.includes(col.field),
		);
	});

	// Données
	const rows = ref([
		{
			id: 1,
			nom: "Initiation à l'algorithme",
			code: "IAL_1",
			coef: 4,
			ue: "APR_S1",
			action: 1,
		},
		{
			id: 2,
			nom: "Électronique Numérique",
			code: "ELN_1",
			coef: 3,
			ue: "ARC_S1",
			action: 2,
		},
		{
			id: 3,
			nom: "Langage C",
			code: "LAC_1",
			coef: 3,
			ue: "APR_S1",
			action: 3,
		},
		{
			id: 4,
			nom: "Initiation à GNU / LINUX",
			code: "ILI_1",
			coef: 3,
			ue: "PMO_S1",
			action: 4,
		},
		{
			id: 5,
			nom: "Suites IC3 de Microsoft",
			code: "LOU_1",
			coef: 3,
			ue: "PMO_S1",
			action: 5,
		},
		{
			id: 6,
			nom: "Anglais Informatique",
			code: "ANG_1",
			coef: 2,
			ue: "COM_S1",
			action: 6,
		},
		{
			id: 7,
			nom: "Expressions Ecrites et Orales",
			code: "EEO_1",
			coef: 2,
			ue: "COM_S1",
			action: 7,
		},
		{
			id: 8,
			nom: "Conception et Implémentation des SD",
			code: "CSD_2",
			coef: 3,
			ue: "CAP_S2",
			action: 8,
		},
		{
			id: 9,
			nom: "Initiation à la Programmation Objet",
			code: "IPO_2",
			coef: 3,
			ue: "CAP_S2",
			action: 9,
		},
		{
			id: 10,
			nom: "Initiation à la Programmation Web",
			code: "IPW_2",
			coef: 3,
			ue: "CAP_S2",
			action: 10,
		},
		{
			id: 11,
			nom: "Réseaux et Technologie CISCO CCNA 1 a",
			code: "RTA_2",
			coef: 3,
			ue: "FRE_S2",
			action: 11,
		},
		{
			id: 12,
			nom: "Réseaux et Technologie CISCO CCNA 1 b",
			code: "RTB_2",
			coef: 3,
			ue: "FRE_S2",
			action: 12,
		},
		{
			id: 13,
			nom: "Initiation aux Bases de données",
			code: "IBD_2",
			coef: 4,
			ue: "BDO_S2",
			action: 13,
		},
		{
			id: 14,
			nom: "Pratiques de SQL",
			code: "PSQ_2",
			coef: 3,
			ue: "BDO_S2",
			action: 14,
		},
		{
			id: 15,
			nom: "Comptabilité Générale",
			code: "CGE_2",
			coef: 2,
			ue: "EGO_S2",
			action: 15,
		},
		{
			id: 16,
			nom: "Environnement Economique",
			code: "EEC_2",
			coef: 2,
			ue: "EGO_S2",
			action: 16,
		},
		{
			id: 17,
			nom: "Projet Professionnel",
			code: "PRO_2",
			coef: 2,
			ue: "PPP_S2",
			action: 17,
		},
		{
			id: 18,
			nom: "Séminaire Thématique + Discipline",
			code: "DIS_2",
			coef: 1,
			ue: "PPP_S2",
			action: 18,
		},
		{ id: 19, nom: "Sport", code: "SPO_2", coef: 1, ue: "PPP_S2", action: 19 },
		{
			id: 20,
			nom: "Nouveau",
			code: "Nouveau",
			coef: 23,
			ue: "BDO_S2",
			action: 20,
		},
		{
			id: 21,
			nom: "Algo Fichier",
			code: "ALFI",
			coef: 2,
			ue: "APR_S1",
			action: 21,
		},
	]);

	const toggleSelector = () => {
		showSelector.value = !showSelector.value;
	};

	// Fonction pour styliser les coefficients
	const getCoefficientClass = (coef) => {
		if (coef >= 4) return "bg-red-100 text-red-800";
		if (coef === 3) return "bg-yellow-100 text-yellow-800";
		if (coef === 2) return "bg-blue-100 text-blue-800";
		return "bg-green-100 text-green-800";
	};

	// Fonctions d'action
	const editItem = (itemId) => {
		const item = rows.value.find((item) => item.id === itemId);
		console.log("Modifier:", item);
		// Implémentez votre logique de modification ici
	};

	const deleteItem = (itemId) => {
		const item = rows.value.find((item) => item.id === itemId);
		if (item && confirm(`Êtes-vous sûr de vouloir supprimer "${item.nom}" ?`)) {
			rows.value = rows.value.filter((i) => i.id !== itemId);
		}
	};
</script>

<style scoped>
	/* Carte contenant le tableau */
	.table-card {
		background: white;
		padding: 22px;
		border-radius: 12px;
		box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.08);
	}

	/* Personnalisation du datatable */
	.uv-datatable {
		--bh-table-border-color: #e5e7eb;
		--bh-table-head-bg: #f9fafb;
		--bh-table-head-color: #374151;
		--bh-table-row-hover-bg: #f9fafb;
	}

	:deep(.bh-pagination-dropdown) {
		border: 1px solid #d1d5db;
		border-radius: 6px;
	}

	:deep(.bh-pagination-btn) {
		border: 1px solid #d1d5db;
		color: #374151;
		transition: all 0.2s;
	}

	:deep(.bh-pagination-btn:hover) {
		background-color: #f3f4f6;
	}

	:deep(.bh-pagination-btn.active) {
		background-color: #4f46e5;
		color: white;
		border-color: #4f46e5;
	}

	:deep(.bh-table thead th) {
		font-weight: 600;
		text-transform: uppercase;
		font-size: 0.75rem;
		letter-spacing: 0.05em;
	}

	:deep(.bh-table tbody tr) {
		border-bottom: 1px solid #e5e7eb;
	}

	:deep(.bh-table tbody tr:hover) {
		background-color: #f9fafb;
	}
</style>
