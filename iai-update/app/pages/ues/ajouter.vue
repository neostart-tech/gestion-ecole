<template>
	<div class="page-wrapper dark:bg-gray-900 transition-colors duration-300">
		<!-- Breadcrumb -->
		<Breadcrumb
			:items="[
				{ label: 'UEs', to: '/' },
				{ label: 'Ajouter', to: null },
			]"
			title="Ajouter une ue"
			:title-class="'text-xl md:text-2xl text-gray-800 dark:text-white'"
			:spacing="'mb-2'"
			:link-color="'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'"
			:active-color="'text-gray-900 dark:text-gray-200 font-medium'"
			:text-size="'text-base'"
			align="left"
		/>

		<!-- Formulaire -->
		<div
			class="form-card dark:bg-gray-800 dark:shadow-gray-900/30 transition-colors duration-300"
		>
			<form @submit.prevent="submitForm">
				<!-- Champ Nom -->
				<div class="form-group">
					<label for="nom" class="form-label dark:text-gray-300">
						Nom de l'UE
						<span class="required-field dark:text-rose-400">*</span>
					</label>
					<input
						type="text"
						id="nom"
						v-model="formData.nom"
						class="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
						placeholder="Ex: Algorithme et Programmation"
						required
					/>
					<div v-if="errors.nom" class="error-message dark:text-rose-300">
						{{ errors.nom }}
					</div>
				</div>

				<!-- Champ Code -->
				<div class="form-group">
					<label for="code" class="form-label dark:text-gray-300">
						Code de l'UE
						<span class="required-field dark:text-rose-400">*</span>
					</label>
					<input
						type="text"
						id="code"
						v-model="formData.code"
						class="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
						placeholder="Ex: APR_S1"
						required
					/>
					<div v-if="errors.code" class="error-message dark:text-rose-300">
						{{ errors.code }}
					</div>
				</div>

				<!-- Champ Période -->
				<div class="form-group">
					<label for="periode_id" class="form-label dark:text-gray-300">
						Période
						<span class="required-field dark:text-rose-400">*</span>
					</label>
					<select
						id="periode_id"
						v-model="formData.periode_id"
						class="form-select dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
						required
					>
						<option value="" class="dark:bg-gray-800 dark:text-gray-300">
							Sélectionner une période
						</option>
						<option
							v-for="periode in periodes"
							:key="periode.id"
							:value="periode.id"
							class="dark:bg-gray-800 dark:text-gray-300"
						>
							{{ periode.nom }} - {{ periode.anneeScolaire?.nom }}
						</option>
					</select>
					<div
						v-if="errors.periode_id"
						class="error-message dark:text-rose-300"
					>
						{{ errors.periode_id }}
					</div>
				</div>

				<!-- Champ Filière -->
				<div class="form-group">
					<label for="filiere_id" class="form-label dark:text-gray-300">
						Filière
						<span class="required-field dark:text-rose-400">*</span>
					</label>
					<select
						id="filiere_id"
						v-model="formData.filiere_id"
						class="form-select dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
						required
					>
						<option value="" class="dark:bg-gray-800 dark:text-gray-300">
							Sélectionner une filière
						</option>
						<option
							v-for="filiere in filieres"
							:key="filiere.id"
							:value="filiere.id"
							class="dark:bg-gray-800 dark:text-gray-300"
						>
							{{ filiere.nom }}
						</option>
					</select>
					<div
						v-if="errors.filiere_id"
						class="error-message dark:text-rose-300"
					>
						{{ errors.filiere_id }}
					</div>
				</div>

				<!-- Champ Crédits -->
				<div class="form-group">
					<label for="credit" class="form-label dark:text-gray-300">
						Nombre de crédits
						<span class="required-field dark:text-rose-400">*</span>
					</label>
					<input
						type="number"
						id="credit"
						v-model="formData.credit"
						class="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
						placeholder="Ex: 9"
						min="1"
						max="30"
						required
					/>
					<div v-if="errors.credit" class="error-message dark:text-rose-300">
						{{ errors.credit }}
					</div>
				</div>

				<!-- Actions du formulaire -->
				<div class="form-actions dark:border-gray-700">
					<button
						type="button"
						class="btn-cancel dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
						@click="cancel"
					>
						Annuler
					</button>
					<button
						type="submit"
						class="btn-submit dark:from-emerald-500 dark:to-emerald-600 dark:hover:shadow-emerald-500/30"
					>
						{{ isEditMode ? "Mettre à jour" : "Créer" }}
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted } from "vue";
	import { useRouter } from "#imports";

	const router = useRouter();
	const route = useRoute();

	const isEditMode = ref(false);
	const ueId = ref(null);

	// Données du formulaire
	const formData = ref({
		nom: "",
		code: "",
		periode_id: "",
		filiere_id: "",
		credit: "",
	});

	// Erreurs
	const errors = ref({
		nom: "",
		code: "",
		periode_id: "",
		filiere_id: "",
		credit: "",
	});

	// Données des listes déroulantes
	const periodes = ref([
		{ id: 1, nom: "Semestre 1", anneeScolaire: { id: 1, nom: "2023-2024" } },
		{ id: 2, nom: "Semestre 2", anneeScolaire: { id: 1, nom: "2023-2024" } },
		{ id: 3, nom: "Semestre 3", anneeScolaire: { id: 1, nom: "2023-2024" } },
		{ id: 4, nom: "Semestre 4", anneeScolaire: { id: 1, nom: "2023-2024" } },
	]);

	const filieres = ref([
		{ id: 1, nom: "Technologie de l'Information (TC_1)" },
		{ id: 2, nom: "Génie Logiciel et Systèmes d'Information (GLSI)" },
		{ id: 3, nom: "Administration Systèmes et Réseaux (ASR)" },
	]);

	// Initialisation pour l'édition
	onMounted(() => {
		const { id } = route.params;

		if (id) {
			isEditMode.value = true;
			ueId.value = id;
			loadUeData(id);
		}
	});

	// Charger les données de l'UE pour l'édition
	const loadUeData = async (id) => {
		try {
			// Simuler un chargement depuis l'API
			const mockUeData = {
				id: id,
				nom: "Algorithme et Programmation",
				code: "APR_S1",
				periode_id: 1,
				filiere_id: 1,
				credit: 9,
			};

			formData.value = { ...mockUeData };
		} catch (error) {
			console.error("Erreur lors du chargement des données:", error);
			alert("Impossible de charger les données de l'UE");
		}
	};

	// Validation du formulaire
	const validateForm = () => {
		let isValid = true;
		errors.value = {
			nom: "",
			code: "",
			periode_id: "",
			filiere_id: "",
			credit: "",
		};

		// Validation du nom
		if (!formData.value.nom.trim()) {
			errors.value.nom = "Le nom de l'UE est requis";
			isValid = false;
		}

		// Validation du code
		if (!formData.value.code.trim()) {
			errors.value.code = "Le code de l'UE est requis";
			isValid = false;
		}

		// Validation de la période
		if (!formData.value.periode_id) {
			errors.value.periode_id = "La période est requise";
			isValid = false;
		}

		// Validation de la filière
		if (!formData.value.filiere_id) {
			errors.value.filiere_id = "La filière est requise";
			isValid = false;
		}

		// Validation des crédits
		if (!formData.value.credit) {
			errors.value.credit = "Le nombre de crédits est requis";
			isValid = false;
		} else if (formData.value.credit < 1 || formData.value.credit > 30) {
			errors.value.credit = "Les crédits doivent être entre 1 et 30";
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
			const url = isEditMode.value ? `/api/ues/${ueId.value}` : "/api/ues";

			const method = isEditMode.value ? "PUT" : "POST";

			// Simuler un appel API
			console.log("Données soumises:", formData.value);

			// Message de succès
			alert(
				isEditMode.value
					? "UE mise à jour avec succès!"
					: "UE créée avec succès!",
			);

			// Redirection vers la liste
			router.push("/admin/ues");
		} catch (error) {
			console.error("Erreur:", error);
			alert("Une erreur est survenue lors de la soumission du formulaire");
		}
	};

	// Annuler
	const cancel = () => {
		router.push("/admin/ues");
	};
</script>

<style scoped>
	/* Page structurée et centrée */
	.page-wrapper {
		max-width: 800px;
		margin: 30px auto;
		padding: 20px;
		min-height: 100vh;
		transition: background-color 0.3s ease;
	}

	/* Breadcrumb */
	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 10px;
		font-size: 14px;
		color: #6b7280;
	}

	.breadcrumb-item {
		cursor: pointer;
		transition: color 0.2s;
	}

	.breadcrumb-item:hover {
		color: #4f46e5;
	}

	.dark .breadcrumb-item:hover {
		color: #818cf8;
	}

	.breadcrumb-item.active {
		color: #111827;
		font-weight: 500;
		cursor: default;
	}

	.dark .breadcrumb-item.active {
		color: #f3f4f6;
	}

	.breadcrumb-separator {
		color: #9ca3af;
	}

	.dark .breadcrumb-separator {
		color: #6b7280;
	}

	/* Titre */
	.page-title {
		font-size: 28px;
		font-weight: 700;
		color: #1f2937;
		margin-bottom: 24px;
	}

	.dark .page-title {
		color: #f9fafb;
	}

	/* Carte du formulaire */
	.form-card {
		background: white;
		padding: 32px;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		transition: all 0.3s ease;
	}

	.dark .form-card {
		background: #1f2937;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
	}

	/* Groupes de formulaire */
	.form-group {
		margin-bottom: 24px;
	}

	.form-label {
		display: block;
		margin-bottom: 8px;
		font-size: 14px;
		font-weight: 600;
		color: #374151;
		transition: color 0.3s ease;
	}

	.dark .form-label {
		color: #e5e7eb;
	}

	.required-field {
		color: #ef4444;
		margin-left: 4px;
	}

	.dark .required-field {
		color: #f87171;
	}

	/* Champs de formulaire */
	.form-input,
	.form-select {
		width: 100%;
		padding: 12px 16px;
		border: 1px solid #d1d5db;
		border-radius: 8px;
		font-size: 14px;
		color: #374151;
		background-color: white;
		transition: all 0.3s ease;
	}

	.dark .form-input,
	.dark .form-select {
		background-color: #374151;
		border-color: #4b5563;
		color: #f3f4f6;
	}

	.form-input:focus,
	.form-select:focus {
		outline: none;
		border-color: #4f46e5;
		box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
	}

	.dark .form-input:focus,
	.dark .form-select:focus {
		border-color: #818cf8;
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
	}

	.form-input::placeholder {
		color: #9ca3af;
	}

	.dark .form-input::placeholder {
		color: #9ca3af;
	}

	/* Styles spécifiques pour le select */
	.form-select {
		appearance: none;
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
		background-position: right 16px center;
		background-repeat: no-repeat;
		background-size: 16px 16px;
		padding-right: 44px;
		cursor: pointer;
	}

	.dark .form-select {
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
	}

	/* Messages d'erreur */
	.error-message {
		margin-top: 6px;
		font-size: 13px;
		color: #ef4444;
		font-weight: 500;
		transition: color 0.3s ease;
	}

	.dark .error-message {
		color: #fca5a5;
	}

	/* Actions du formulaire */
	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 16px;
		margin-top: 32px;
		padding-top: 24px;
		border-top: 1px solid #e5e7eb;
		transition: border-color 0.3s ease;
	}

	.dark .form-actions {
		border-top-color: #374151;
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
		transition: all 0.3s ease;
	}

	.dark .btn-cancel {
		background: #374151;
		color: #e5e7eb;
		border-color: #4b5563;
	}

	.btn-cancel:hover {
		background: #f9fafb;
		border-color: #9ca3af;
	}

	.dark .btn-cancel:hover {
		background: #4b5563;
		border-color: #6b7280;
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

	.dark .btn-submit {
		background: linear-gradient(135deg, #059669 0%, #047857 100%);
	}

	.btn-submit:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
	}

	.dark .btn-submit:hover {
		box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.page-wrapper {
			padding: 15px;
		}

		.form-card {
			padding: 24px;
		}

		.form-actions {
			flex-direction: column;
		}

		.btn-cancel,
		.btn-submit {
			width: 100%;
		}
	}

	@media (max-width: 480px) {
		.page-title {
			font-size: 24px;
		}

		.form-card {
			padding: 20px;
		}

		.form-group {
			margin-bottom: 20px;
		}
	}

	/* Transitions fluides pour le changement de thème */
	.form-card * {
		transition: background-color 0.3s ease, border-color 0.3s ease,
			color 0.3s ease, box-shadow 0.3s ease;
	}

	/* Focus visible pour l'accessibilité */
	.form-input:focus-visible,
	.form-select:focus-visible {
		outline: 2px solid #4f46e5;
		outline-offset: 2px;
	}

	.dark .form-input:focus-visible,
	.dark .form-select:focus-visible {
		outline-color: #818cf8;
	}

	/* Scrollbar personnalisée pour le mode sombre */
	.dark ::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}

	.dark ::-webkit-scrollbar-track {
		background: #374151;
		border-radius: 4px;
	}

	.dark ::-webkit-scrollbar-thumb {
		background: #4b5563;
		border-radius: 4px;
	}

	.dark ::-webkit-scrollbar-thumb:hover {
		background: #6b7280;
	}
</style>
