<template>
	<div
		class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-300"
	>
		<!-- Breadcrumb -->
		<Breadcrumb
			:items="[
				{ label: 'Filieres', to: '/' },
				{ label: 'Liste', to: null },
			]"
			title="Liste des filieres"
			:title-class="'text-xl md:text-2xl text-gray-800 dark:text-white'"
			:spacing="'mb-2'"
			:link-color="'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'"
			:active-color="'text-gray-900 dark:text-gray-200 font-medium'"
			:text-size="'text-base'"
			align="left"
		/>

		<!-- Zone de recherche et filtres -->
		<div class="flex flex-col md:flex-row gap-4 mb-6">
			<!-- Recherche -->
			<input
				v-model="searchQuery"
				type="search"
				class="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
				placeholder="Rechercher..."
			/>

			<!-- Sélecteur de colonnes -->
			<div class="relative">
				<button
					@click="toggleSelector"
					class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
				>
					<span class="text-gray-700 dark:text-gray-300 font-medium"
						>Toutes les colonnes</span
					>
					<svg
						:class="{ 'rotate-180': showSelector }"
						class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform"
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

				<!-- Dropdown des colonnes -->
				<div
					v-if="showSelector"
					class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-900/50 z-50"
				>
					<div class="p-3 space-y-2 max-h-64 overflow-y-auto">
						<div
							v-for="col in availableColumns"
							:key="col.field"
							class="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors"
						>
							<input
								type="checkbox"
								:id="col.field"
								v-model="selectedColumns"
								:value="col.field"
								class="w-4 h-4 text-indigo-600 dark:text-indigo-500 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
							/>
							<label
								:for="col.field"
								class="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
							>
								{{ col.title }}
							</label>
						</div>
					</div>
				</div>
			</div>

			<!-- Contrôles d'affichage -->
			<div class="flex items-center gap-2">
				<span class="text-gray-600 dark:text-gray-400 whitespace-nowrap"
					>Afficher</span
				>
				<select
					v-model="itemsPerPage"
					class="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
				>
					<option value="10" class="dark:bg-gray-800">10</option>
					<option value="25" class="dark:bg-gray-800">25</option>
					<option value="50" class="dark:bg-gray-800">50</option>
					<option value="100" class="dark:bg-gray-800">100</option>
				</select>
				<span class="text-gray-600 dark:text-gray-400 whitespace-nowrap"
					>éléments</span
				>
			</div>

			<!-- Bouton Ajouter filière -->
			<button
				@click="openAddModal"
				class="flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors font-medium whitespace-nowrap"
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
				Ajouter une filière
			</button>
		</div>

		<!-- Tableau avec wrapper personnalisé -->
		<div
			class="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-4 md:p-6 transition-colors duration-300 dark-mode-table-wrapper"
		>
			<Vue3Datatable
				:columns="filteredCols"
				:rows="filteredRows"
				:per-page="itemsPerPage"
				:search="searchQuery"
				:pagination-options="{
					dropdown: true,
					edge: true,
					nav: 'scroll',
					position: 'bottom',
				}"
				:searchable="true"
				:sortable="true"
				:filterable="true"
				:loading="loading"
				:totalRows="filteredRows.length"
				skin="bh-table-striped bh-table-hover"
			>
				<!-- Slot pour les inscrits -->
				<template #inscrits="data">
					<span
						class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-black dark:text-white"
					>
						{{ data.value }}
					</span>
				</template>

				<!-- Slot pour la description -->
				<template #description="data">
					<div
						class="max-w-xs truncate text-gray-900 dark:text-white"
						:title="data.value"
					>
						{{ data.value || "À fournir..." }}
					</div>
				</template>

				<!-- Slot pour les actions -->
				<template #action="data">
					<div class="flex items-center justify-center gap-2">
						<!-- Bouton Modifier -->
						<button
							@click="openEditModal(data.value)"
							class="p-1.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded transition-colors duration-200"
							title="Modifier"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
								/>
							</svg>
						</button>

						<!-- Bouton Étudiants -->
						<NuxtLink
							:to="`/filieres/${data.value.id}/etudiants`"
							class="p-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors duration-200"
							title="Étudiants de la filière"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
								/>
							</svg>
						</NuxtLink>

						<!-- Bouton Supprimer -->
						<button
							@click="openDeleteModal(data.value)"
							class="p-1.5 text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors duration-200"
							title="Supprimer"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
									clip-rule="evenodd"
								/>
							</svg>
						</button>
					</div>
				</template>
			</Vue3Datatable>
		</div>

		<!-- Modal d'ajout/modification -->
		<div
			v-if="showModal"
			class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50"
		>
			<div
				class="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900/50 max-w-md w-full transition-colors duration-300"
			>
				<div class="modal-content">
					<form @submit.prevent="saveFiliere">
						<div
							class="modal-header border-b border-gray-200 dark:border-gray-700 p-6"
						>
							<h5
								class="modal-title text-lg font-semibold text-gray-900 dark:text-white"
							>
								{{ modalTitle }}
							</h5>
							<button
								type="button"
								@click="closeModal"
								class="btn-close text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
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
						<div class="modal-body p-6 space-y-4">
							<div class="form-group text-start">
								<label
									for="nom"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									Nom de la filière
									<span class="text-rose-500 dark:text-rose-400">*</span>
								</label>
								<input
									type="text"
									id="nom"
									v-model="form.nom"
									required
									class="form-control w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
									placeholder="Nom de la filière"
								/>
							</div>

							<div class="form-group text-start">
								<label
									for="code"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									Code <span class="text-rose-500 dark:text-rose-400">*</span>
								</label>
								<input
									type="text"
									id="code"
									v-model="form.code"
									required
									class="form-control w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white uppercase transition-colors"
									placeholder="Code (ex: GLSI)"
								/>
							</div>

							<div class="form-group text-start">
								<label
									for="description"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									Description
								</label>
								<textarea
									id="description"
									v-model="form.description"
									rows="3"
									class="form-control w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
									placeholder="Description de la filière..."
								></textarea>
							</div>

							<div class="form-group text-start">
								<label
									for="inscrits"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									Nombre d'inscrits
								</label>
								<input
									type="number"
									step="1"
									min="0"
									id="inscrits"
									v-model="form.inscrits"
									class="form-control w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
									placeholder="Nombre d'étudiants inscrits"
								/>
							</div>
						</div>
						<div
							class="modal-footer border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end gap-3"
						>
							<button
								type="button"
								@click="closeModal"
								class="btn btn-secondary px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
							>
								Annuler
							</button>
							<button
								type="submit"
								class="btn btn-primary px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
							>
								Enregistrer
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>

		<!-- Modal de suppression -->
		<div
			v-if="showDeleteModal"
			class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50"
		>
			<div
				class="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900/50 max-w-md w-full transition-colors duration-300"
			>
				<div class="modal-content">
					<div
						class="modal-header border-b border-gray-200 dark:border-gray-700 p-6"
					>
						<h5
							class="modal-title text-lg font-semibold text-gray-900 dark:text-white"
						>
							Suppression
						</h5>
						<button
							type="button"
							@click="closeDeleteModal"
							class="btn-close text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
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
					<div class="modal-body p-6">
						<p class="text-gray-600 dark:text-gray-400 mb-6">
							Voulez-vous vraiment supprimer cette filière ? Cette action est
							irréversible et affectera tous les étudiants associés. Continuer ?
						</p>
					</div>
					<div
						class="modal-footer border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end gap-3"
					>
						<form
							@submit.prevent="deleteFiliere"
							class="flex items-center gap-3"
						>
							<input
								type="hidden"
								id="deleteFiliereForm"
								:value="selectedFiliere?.id"
							/>
							<button
								type="button"
								@click="closeDeleteModal"
								class="btn btn-secondary px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
							>
								Retour
							</button>
							<button
								type="submit"
								class="btn btn-warning px-4 py-2 bg-amber-500 dark:bg-amber-600 text-white rounded-lg hover:bg-amber-600 dark:hover:bg-amber-700 transition-colors"
							>
								Continuer la suppression
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted } from "vue";
	import Vue3Datatable from "@bhplugin/vue3-datatable";
	import "@bhplugin/vue3-datatable/dist/style.css";
	import Breadcrumb from "~/components/Breadcrumb.vue";

	const searchQuery = ref("");
	const showSelector = ref(false);
	const selectedColumns = ref([]);
	const showModal = ref(false);
	const showDeleteModal = ref(false);
	const modalTitle = ref("");
	const selectedFiliere = ref(null);
	const itemsPerPage = ref(50);
	const loading = ref(false);

	// Formulaire
	const form = ref({
		id: null,
		nom: "",
		code: "",
		description: "",
		inscrits: 0,
	});

	// Charger les filières depuis localStorage
	const loadFilieres = () => {
		if (process.client) {
			const storedFilieres = localStorage.getItem("filieres");
			if (storedFilieres) {
				return JSON.parse(storedFilieres);
			}
		}
		return [];
	};

	// Données initiales selon votre exemple
	const initialFilieres = [
		{
			id: 1,
			nom: "Génie Logiciel & Systèmes d'Informations",
			code: "GLSI",
			description: "À fournir...",
			inscrits: 26,
		},
		{
			id: 2,
			nom: "Administration Systèmes & Réseaux",
			code: "ASR",
			description: "À fournir...",
			inscrits: 0,
		},
		{
			id: 3,
			nom: "Multimédia, Technologies Web & Infographie",
			code: "MTWI",
			description: "Concevoir une animat...",
			inscrits: 0,
		},
		{
			id: 4,
			nom: "Tronc Commun Première année",
			code: "TC_1",
			description: "Filière de Tronc Co...",
			inscrits: 49,
		},
		{
			id: 5,
			nom: "Tronc Commun Deuxième année",
			code: "TC_2",
			description: "Tronc Commun de la d...",
			inscrits: 0,
		},
	];

	const rows = ref([]);

	// Initialiser les données
	onMounted(() => {
		let filieres = loadFilieres();
		if (filieres.length === 0) {
			filieres = initialFilieres;
			if (process.client) {
				localStorage.setItem("filieres", JSON.stringify(filieres));
			}
		}
		rows.value = filieres;
		selectedColumns.value = availableColumns.value.map((col) => col.field);
	});

	const availableColumns = ref([
		{ field: "id", title: "#", width: "80px", isUnique: true },
		{ field: "nom", title: "Nom" },
		{ field: "code", title: "Code" },
		{ field: "description", title: "Description" },
		{ field: "inscrits", title: "Inscrits" },
		{
			field: "action",
			title: "Actions",
			sort: false,
			width: "150px",
			type: "click",
		},
	]);

	// Colonnes filtrées selon la sélection
	const filteredCols = computed(() => {
		return availableColumns.value.filter((col) =>
			selectedColumns.value.includes(col.field),
		);
	});

	// Rows filtrées selon la recherche
	const filteredRows = computed(() => {
		if (!searchQuery.value) return rows.value;

		const query = searchQuery.value.toLowerCase();
		return rows.value.filter(
			(filiere) =>
				filiere.nom.toLowerCase().includes(query) ||
				filiere.code.toLowerCase().includes(query) ||
				filiere.description.toLowerCase().includes(query) ||
				filiere.inscrits.toString().includes(query),
		);
	});

	const toggleSelector = () => {
		showSelector.value = !showSelector.value;
	};

	// Sauvegarder dans localStorage
	const saveToLocalStorage = () => {
		if (process.client) {
			localStorage.setItem("filieres", JSON.stringify(rows.value));
		}
	};

	// Gestion des modales
	const openAddModal = () => {
		modalTitle.value = "Formulaire de création d'une filière";
		form.value = {
			id: null,
			nom: "",
			code: "",
			description: "",
			inscrits: 0,
		};
		showModal.value = true;
	};

	const openEditModal = (filiere) => {
		modalTitle.value = "Formulaire de modification d'une filière";
		form.value = {
			id: filiere.id,
			nom: filiere.nom,
			code: filiere.code,
			description: filiere.description,
			inscrits: filiere.inscrits,
		};
		showModal.value = true;
	};

	const openDeleteModal = (filiere) => {
		selectedFiliere.value = filiere;
		showDeleteModal.value = true;
	};

	const closeModal = () => {
		showModal.value = false;
	};

	const closeDeleteModal = () => {
		showDeleteModal.value = false;
		selectedFiliere.value = null;
	};

	// Gestion des filières
	const saveFiliere = () => {
		if (form.value.id) {
			// Mise à jour
			const index = rows.value.findIndex((f) => f.id === form.value.id);
			if (index !== -1) {
				rows.value[index] = {
					...rows.value[index],
					nom: form.value.nom,
					code: form.value.code.toUpperCase(),
					description: form.value.description,
					inscrits: parseInt(form.value.inscrits) || 0,
				};
			}
		} else {
			// Création
			const newId =
				rows.value.length > 0
					? Math.max(...rows.value.map((f) => f.id)) + 1
					: 1;

			const newFiliere = {
				id: newId,
				nom: form.value.nom,
				code: form.value.code.toUpperCase(),
				description: form.value.description,
				inscrits: parseInt(form.value.inscrits) || 0,
			};

			rows.value.push(newFiliere);
		}

		saveToLocalStorage();
		closeModal();
	};

	const deleteFiliere = () => {
		if (selectedFiliere.value) {
			const index = rows.value.findIndex(
				(f) => f.id === selectedFiliere.value.id,
			);
			if (index !== -1) {
				rows.value.splice(index, 1);
			}
			saveToLocalStorage();
			closeDeleteModal();
		}
	};
</script>

<style>
	/* Solution alternative avec injection directe des styles */
	.dark .dark-mode-table-wrapper .bh-table-wrapper {
		background-color: #1f2937 !important;
	}

	.dark .dark-mode-table-wrapper .bh-table {
		background-color: #1f2937 !important;
		color: #ffffff !important;
	}

	.dark .dark-mode-table-wrapper .bh-table th {
		background-color: #111827 !important;
		color: #ffffff !important;
		border-bottom-color: #374151 !important;
	}

	.dark .dark-mode-table-wrapper .bh-table td {
		background-color: #1f2937 !important;
		color: #ffffff !important;
		border-bottom-color: #374151 !important;
	}

	.dark .dark-mode-table-wrapper .bh-table tr {
		background-color: #1f2937 !important;
	}

	/* Suppression des effets hover et striped */
	.dark .dark-mode-table-wrapper .bh-table-striped tbody tr:nth-child(odd),
	.dark .dark-mode-table-wrapper .bh-table-striped tbody tr:nth-child(even),
	.dark .dark-mode-table-wrapper .bh-table-hover tbody tr:hover {
		background-color: #1f2937 !important;
	}

	/* Pagination */
	.dark .dark-mode-table-wrapper .bh-pagination {
		background-color: #1f2937 !important;
		border-top-color: #374151 !important;
		color: #ffffff !important;
	}

	.dark .dark-mode-table-wrapper .bh-pagination-info {
		color: #d1d5db !important;
	}

	.dark .dark-mode-table-wrapper .bh-pagination-dropdown {
		background-color: #111827 !important;
		border-color: #374151 !important;
		color: #ffffff !important;
	}

	.dark .dark-mode-table-wrapper .bh-pagination-page {
		background-color: #111827 !important;
		border-color: #374151 !important;
		color: #ffffff !important;
	}

	.dark .dark-mode-table-wrapper .bh-pagination-page.active {
		background-color: #4f46e5 !important;
		border-color: #4f46e5 !important;
		color: white !important;
	}

	/* Recherche */
	.dark .dark-mode-table-wrapper .bh-table-search {
		background-color: #111827 !important;
		border-color: #374151 !important;
		color: #ffffff !important;
	}

	.dark .dark-mode-table-wrapper .bh-table-search::placeholder {
		color: #9ca3af !important;
	}

	/* Scrollbar */
	.dark .dark-mode-table-wrapper .bh-table-wrapper::-webkit-scrollbar-track {
		background: #374151 !important;
	}

	.dark .dark-mode-table-wrapper .bh-table-wrapper::-webkit-scrollbar-thumb {
		background: #4b5563 !important;
	}

	/* Alternative avec classes Tailwind via attributs */
	.dark .dark-mode-table-wrapper [class*="bh-"] {
		background-color: #1f2937 !important;
		color: #ffffff !important;
	}

	.dark .dark-mode-table-wrapper [class*="bh-table"] th {
		background-color: #111827 !important;
	}

	.dark .dark-mode-table-wrapper [class*="bh-table"] td {
		background-color: #1f2937 !important;
	}

	/* Reset complet */
	.dark .dark-mode-table-wrapper * {
		--bh-color-bg: #1f2937 !important;
		--bh-color-bg-alt: #111827 !important;
		--bh-color-border: #374151 !important;
		--bh-color-text: #ffffff !important;
		--bh-color-text-light: #d1d5db !important;
		--bh-color-primary: #4f46e5 !important;
	}
</style>
