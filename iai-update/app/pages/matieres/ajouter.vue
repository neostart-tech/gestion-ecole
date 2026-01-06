<template>
	<div
		class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-300"
	>
		<div class="max-w-6xl mx-auto">
			<!-- Breadcrumb -->
			<Breadcrumb
				:items="[
					{ label: 'Administration', to: '/admin' },
					{ label: 'Unités de valeur', to: '/admin/unites-valeur' },
					{ label: isEditMode ? 'Modifier' : 'Ajouter', to: null },
				]"
				:title="
					isEditMode
						? 'Modifier une unité de valeur'
						: 'Ajouter une unité de valeur'
				"
				:title-class="'text-xl md:text-2xl text-gray-800 dark:text-white font-semibold'"
				:spacing="'mb-6'"
				:link-color="'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'"
				:active-color="'text-gray-900 dark:text-gray-200 font-medium'"
				:text-size="'text-sm md:text-base'"
				align="left"
			/>

			<!-- Formulaire -->
			<div
				class="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-4 md:p-6 lg:p-8"
			>
				<form @submit.prevent="submitForm" class="space-y-6">
					<!-- Section 1: Informations de base -->
					<div>
						<h3
							class="text-lg font-semibold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700"
						>
							Informations de base
						</h3>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<!-- Unité d'enseignement -->
							<div class="space-y-2">
								<label
									for="ue_id"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									Unité d'enseignement
									<span class="text-red-500 dark:text-red-400">*</span>
								</label>
								<select
									id="ue_id"
									v-model="formData.ue_id"
									class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
									required
								>
									<option value="" disabled>
										Choisissez une unité d'enseignement
									</option>
									<option
										v-for="ue in ues"
										:key="ue.id"
										:value="ue.id"
										:selected="isEditMode && formData.ue_id === ue.id"
										class="dark:bg-gray-800"
									>
										{{ ue.code }} - {{ ue.nom }}
									</option>
								</select>
								<div
									v-if="errors.ue_id"
									class="text-sm text-red-600 dark:text-red-400 mt-1"
								>
									{{ errors.ue_id }}
								</div>
							</div>

							<!-- Nom de la matière -->
							<div class="space-y-2">
								<label
									for="nom"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									Nom de la matière
									<span class="text-red-500 dark:text-red-400">*</span>
								</label>
								<input
									type="text"
									id="nom"
									v-model="formData.nom"
									class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
									placeholder="Ex: Algorithmique Avancée"
									required
								/>
								<div
									v-if="errors.nom"
									class="text-sm text-red-600 dark:text-red-400 mt-1"
								>
									{{ errors.nom }}
								</div>
							</div>

							<!-- Code de la matière -->
							<div class="space-y-2">
								<label
									for="code"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									Code de la matière
									<span class="text-red-500 dark:text-red-400">*</span>
								</label>
								<input
									type="text"
									id="code"
									v-model="formData.code"
									class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white uppercase"
									placeholder="Ex: ALG_AV"
									required
								/>
								<div
									v-if="errors.code"
									class="text-sm text-red-600 dark:text-red-400 mt-1"
								>
									{{ errors.code }}
								</div>
							</div>

							<!-- Coefficient -->
							<div class="space-y-2">
								<label
									for="coefficient"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									Coefficient
									<span class="text-red-500 dark:text-red-400">*</span>
								</label>
								<input
									type="number"
									id="coefficient"
									v-model="formData.coefficient"
									class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
									placeholder="Ex: 3"
									min="1"
									step="1"
									required
								/>
								<div
									v-if="errors.coefficient"
									class="text-sm text-red-600 dark:text-red-400 mt-1"
								>
									{{ errors.coefficient }}
								</div>
							</div>
						</div>
					</div>

					<!-- Section 2: Volumes horaires -->
					<div>
						<h3
							class="text-lg font-semibold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700"
						>
							Volumes horaires
						</h3>

						<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
							<!-- CM -->
							<div class="space-y-2">
								<label
									for="cm"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									CM (h) <span class="text-red-500 dark:text-red-400">*</span>
								</label>
								<input
									type="number"
									id="cm"
									v-model="formData.cm"
									class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
									placeholder="Ex: 30"
									min="1"
									step="1"
									required
								/>
								<div
									v-if="errors.cm"
									class="text-sm text-red-600 dark:text-red-400 mt-1"
								>
									{{ errors.cm }}
								</div>
							</div>

							<!-- TD -->
							<div class="space-y-2">
								<label
									for="td"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									TD (h) <span class="text-red-500 dark:text-red-400">*</span>
								</label>
								<input
									type="number"
									id="td"
									v-model="formData.td"
									class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
									placeholder="Ex: 15"
									min="1"
									step="1"
									required
								/>
								<div
									v-if="errors.td"
									class="text-sm text-red-600 dark:text-red-400 mt-1"
								>
									{{ errors.td }}
								</div>
							</div>

							<!-- TP -->
							<div class="space-y-2">
								<label
									for="tp"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									TP (h) <span class="text-red-500 dark:text-red-400">*</span>
								</label>
								<input
									type="number"
									id="tp"
									v-model="formData.tp"
									class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
									placeholder="Ex: 15"
									min="1"
									step="1"
									required
								/>
								<div
									v-if="errors.tp"
									class="text-sm text-red-600 dark:text-red-400 mt-1"
								>
									{{ errors.tp }}
								</div>
							</div>

							<!-- EC -->
							<div class="space-y-2">
								<label
									for="ec"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									EC (ECTS)
									<span class="text-red-500 dark:text-red-400">*</span>
								</label>
								<input
									type="number"
									id="ec"
									v-model="formData.ec"
									class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
									placeholder="Ex: 2"
									min="1"
									step="1"
									required
								/>
								<div
									v-if="errors.ec"
									class="text-sm text-red-600 dark:text-red-400 mt-1"
								>
									{{ errors.ec }}
								</div>
							</div>
						</div>
					</div>

					<!-- Section 3: Enseignants -->
					<div>
						<h3
							class="text-lg font-semibold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700"
						>
							Enseignants
						</h3>

						<div class="space-y-2">
							<label
								for="enseignant_id"
								class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								Enseignant(s) responsable(s)
								<span class="text-red-500 dark:text-red-400">*</span>
							</label>
							<select
								id="enseignant_id"
								v-model="formData.enseignant_id"
								class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
								multiple
								size="4"
								required
							>
								<option
									v-for="enseignant in enseignants"
									:key="enseignant.id"
									:value="enseignant.id"
									class="dark:bg-gray-800"
								>
									{{ enseignant.nom }} {{ enseignant.prenom }}
								</option>
							</select>
							<div
								v-if="errors.enseignant_id"
								class="text-sm text-red-600 dark:text-red-400 mt-1"
							>
								{{ errors.enseignant_id }}
							</div>
							<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
								Maintenez Ctrl/Cmd pour sélectionner plusieurs enseignants
							</p>
						</div>
					</div>

					<!-- Section 4: Types d'évaluation -->
					<div>
						<h3
							class="text-lg font-semibold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700"
						>
							Types d'évaluation
							<span
								class="text-sm font-normal text-gray-500 dark:text-gray-400"
							>
								(La somme des pourcentages doit être égale à 100)
							</span>
						</h3>

						<!-- Cases à cocher -->
						<div class="flex flex-wrap gap-6 mb-6">
							<div class="flex items-center">
								<input
									type="checkbox"
									id="enable_devoir"
									v-model="evaluations.devoir.enabled"
									@change="toggleWeight('devoir')"
									class="w-4 h-4 text-indigo-600 dark:text-indigo-500 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800"
									checked
								/>
								<label
									for="enable_devoir"
									class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									Devoir
								</label>
							</div>

							<div class="flex items-center">
								<input
									type="checkbox"
									id="enable_interrogation"
									v-model="evaluations.interrogation.enabled"
									@change="toggleWeight('interrogation')"
									class="w-4 h-4 text-indigo-600 dark:text-indigo-500 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800"
									checked
								/>
								<label
									for="enable_interrogation"
									class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									Interrogation
								</label>
							</div>

							<div class="flex items-center">
								<input
									type="checkbox"
									id="enable_examen"
									v-model="evaluations.examen.enabled"
									@change="toggleWeight('examen')"
									class="w-4 h-4 text-indigo-600 dark:text-indigo-500 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800"
									checked
								/>
								<label
									for="enable_examen"
									class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									Examen
								</label>
							</div>

							<div class="flex items-center">
								<input
									type="checkbox"
									id="enable_tp"
									v-model="evaluations.tp.enabled"
									@change="toggleWeight('tp')"
									class="w-4 h-4 text-indigo-600 dark:text-indigo-500 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800"
								/>
								<label
									for="enable_tp"
									class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									TP
								</label>
							</div>

							<div class="flex items-center">
								<input
									type="checkbox"
									id="enable_expose"
									v-model="evaluations.expose.enabled"
									@change="toggleWeight('expose')"
									class="w-4 h-4 text-indigo-600 dark:text-indigo-500 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800"
								/>
								<label
									for="enable_expose"
									class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									Exposé
								</label>
							</div>
						</div>

						<!-- Pourcentages -->
						<div class="grid grid-cols-1 md:grid-cols-5 gap-4">
							<div class="space-y-2">
								<label
									for="poids_devoir"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									Devoir (%)
								</label>
								<input
									type="number"
									id="poids_devoir"
									v-model="evaluations.devoir.pourcentage"
									:disabled="!evaluations.devoir.enabled"
									class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
									min="0"
									max="100"
									placeholder="30"
								/>
							</div>

							<div class="space-y-2">
								<label
									for="poids_interrogation"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									Interrogation (%)
								</label>
								<input
									type="number"
									id="poids_interrogation"
									v-model="evaluations.interrogation.pourcentage"
									:disabled="!evaluations.interrogation.enabled"
									class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
									min="0"
									max="100"
									placeholder="10"
								/>
							</div>

							<div class="space-y-2">
								<label
									for="poids_examen"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									Examen (%)
								</label>
								<input
									type="number"
									id="poids_examen"
									v-model="evaluations.examen.pourcentage"
									:disabled="!evaluations.examen.enabled"
									class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
									min="0"
									max="100"
									placeholder="60"
								/>
							</div>

							<div class="space-y-2">
								<label
									for="poids_tp"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									TP (%)
								</label>
								<input
									type="number"
									id="poids_tp"
									v-model="evaluations.tp.pourcentage"
									:disabled="!evaluations.tp.enabled"
									class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
									min="0"
									max="100"
									placeholder="0"
								/>
							</div>

							<div class="space-y-2">
								<label
									for="poids_expose"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									Exposé (%)
								</label>
								<input
									type="number"
									id="poids_expose"
									v-model="evaluations.expose.pourcentage"
									:disabled="!evaluations.expose.enabled"
									class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
									min="0"
									max="100"
									placeholder="0"
								/>
							</div>
						</div>

						<!-- Total et message d'erreur -->
						<div
							class="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
						>
							<div class="text-sm text-gray-500 dark:text-gray-400">
								Total:
								<span class="font-semibold">{{ totalPourcentage }}%</span>
								<span v-if="totalPourcentage !== 100" class="ml-2">
									({{ totalPourcentage > 100 ? "+" : ""
									}}{{ 100 - totalPourcentage }}%)
								</span>
							</div>

							<div
								v-if="showSumError"
								class="px-4 py-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg"
							>
								<p class="text-sm text-red-600 dark:text-red-400 font-medium">
									La somme doit être égale à 100%
								</p>
							</div>

							<p class="text-sm text-gray-500 dark:text-gray-400">
								Valeurs par défaut: Devoir 30%, Interrogation 10%, Examen 60%
							</p>
						</div>
					</div>

					<!-- Actions -->
					<div
						class="pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-end gap-3"
					>
						<button
							type="button"
							@click="cancel"
							class="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
						>
							Annuler
						</button>
						<button
							type="submit"
							class="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors font-medium"
						>
							{{ isEditMode ? "Mettre à jour" : "Créer l'unité de valeur" }}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted } from "vue";
	import { useRouter, useRoute } from "#imports";
	import Breadcrumb from "~/components/Breadcrumb.vue";

	const router = useRouter();
	const route = useRoute();

	const isEditMode = ref(false);
	const showSumError = ref(false);

	// Données du formulaire
	const formData = ref({
		ue_id: "",
		nom: "",
		code: "",
		coefficient: "",
		cm: "",
		td: "",
		tp: "",
		ec: "",
		enseignant_id: [],
	});

	// Évaluations avec valeurs par défaut
	const evaluations = ref({
		devoir: { enabled: true, pourcentage: "30" },
		interrogation: { enabled: true, pourcentage: "10" },
		examen: { enabled: true, pourcentage: "60" },
		tp: { enabled: false, pourcentage: "0" },
		expose: { enabled: false, pourcentage: "0" },
	});

	// Erreurs
	const errors = ref({});

	// Données des listes déroulantes
	const ues = ref([
		{ id: 1, nom: "Algorithme et Programmation", code: "APR_S1" },
		{ id: 2, nom: "Bases de Données", code: "BDO_S2" },
		{ id: 3, nom: "Architecture des ordinateurs", code: "ARC_S1" },
		{ id: 4, nom: "Mathématiques Appliquées", code: "MAT_S1" },
		{ id: 5, nom: "Réseaux Informatiques", code: "RES_S2" },
	]);

	const enseignants = ref([
		{ id: 1, nom: "DUPONT", prenom: "Jean" },
		{ id: 2, nom: "MARTIN", prenom: "Marie" },
		{ id: 3, nom: "DURAND", prenom: "Pierre" },
		{ id: 4, nom: "LEFEVRE", prenom: "Sophie" },
		{ id: 5, nom: "ROBERT", prenom: "Luc" },
	]);

	// Calcul du total des pourcentages
	const totalPourcentage = computed(() => {
		return Object.values(evaluations.value).reduce((total, evalItem) => {
			return (
				total + (evalItem.enabled ? parseInt(evalItem.pourcentage) || 0 : 0)
			);
		}, 0);
	});

	// Fonction pour activer/désactiver les champs de pourcentage
	const toggleWeight = (type) => {
		if (!evaluations.value[type].enabled) {
			evaluations.value[type].pourcentage = "0";
		} else {
			// Valeurs par défaut si cochées
			const defaults = {
				devoir: "30",
				interrogation: "10",
				examen: "60",
				tp: "0",
				expose: "0",
			};
			evaluations.value[type].pourcentage = defaults[type];
		}
	};

	// Validation de la somme des pourcentages
	const validateWeightsSum = () => {
		const sum = totalPourcentage.value;
		showSumError.value = sum !== 100;
		return !showSumError.value;
	};

	// Initialisation pour l'édition
	onMounted(() => {
		const { id } = route.params;

		if (id) {
			isEditMode.value = true;
			loadUvData(id);
		}
	});

	// Charger les données de l'UV pour l'édition
	const loadUvData = async (id) => {
		try {
			// Simuler un chargement depuis l'API
			const mockUvData = {
				id: id,
				ue_id: 1,
				nom: "Algorithmique Avancée",
				code: "ALG_AV",
				coefficient: "3",
				cm: "30",
				td: "15",
				tp: "15",
				ec: "2",
				enseignant_id: [1, 3],
			};

			formData.value = { ...mockUvData };

			// Simuler des évaluations existantes
			evaluations.value = {
				devoir: { enabled: true, pourcentage: "30" },
				interrogation: { enabled: true, pourcentage: "10" },
				examen: { enabled: true, pourcentage: "60" },
				tp: { enabled: false, pourcentage: "0" },
				expose: { enabled: false, pourcentage: "0" },
			};
		} catch (error) {
			console.error("Erreur lors du chargement des données:", error);
			alert("Impossible de charger les données de l'unité de valeur");
		}
	};

	// Validation du formulaire
	const validateForm = () => {
		let isValid = true;
		errors.value = {};

		// Validation des champs obligatoires
		const requiredFields = [
			"ue_id",
			"nom",
			"code",
			"coefficient",
			"cm",
			"td",
			"tp",
			"ec",
		];
		requiredFields.forEach((field) => {
			if (!formData.value[field]) {
				errors.value[field] = "Ce champ est obligatoire";
				isValid = false;
			}
		});

		// Validation des enseignants
		if (!formData.value.enseignant_id.length) {
			errors.value.enseignant_id = "Sélectionnez au moins un enseignant";
			isValid = false;
		}

		// Validation des nombres positifs
		const numberFields = ["coefficient", "cm", "td", "tp", "ec"];
		numberFields.forEach((field) => {
			if (formData.value[field] && parseFloat(formData.value[field]) < 1) {
				errors.value[field] = "La valeur doit être au moins 1";
				isValid = false;
			}
		});

		// Validation des pourcentages
		if (!validateWeightsSum()) {
			isValid = false;
		}

		return isValid;
	};

	// Soumission du formulaire
	const submitForm = async () => {
		if (!validateForm()) {
			return;
		}

		try {
			// Préparer les données
			const data = {
				...formData.value,
				poids_devoir: evaluations.value.devoir.enabled
					? evaluations.value.devoir.pourcentage
					: "0",
				poids_interrogation: evaluations.value.interrogation.enabled
					? evaluations.value.interrogation.pourcentage
					: "0",
				poids_examen: evaluations.value.examen.enabled
					? evaluations.value.examen.pourcentage
					: "0",
				poids_tp: evaluations.value.tp.enabled
					? evaluations.value.tp.pourcentage
					: "0",
				poids_expose: evaluations.value.expose.enabled
					? evaluations.value.expose.pourcentage
					: "0",
			};

			console.log("Données soumises:", data);

			// Ici, vous feriez votre appel API réel
			// const url = isEditMode.value
			//   ? `/api/unites-valeur/${route.params.id}`
			//   : '/api/unites-valeur';
			// const method = isEditMode.value ? 'PUT' : 'POST';

			// const response = await fetch(url, {
			//   method: method,
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify(data)
			// });

			alert(
				isEditMode.value
					? "Unité de valeur mise à jour avec succès!"
					: "Unité de valeur créée avec succès!",
			);

			router.push("/admin/unites-valeur");
		} catch (error) {
			console.error("Erreur:", error);
			alert("Une erreur est survenue lors de la soumission du formulaire");
		}
	};

	// Annuler
	const cancel = () => {
		router.push("/admin/unites-valeur");
	};
</script>
