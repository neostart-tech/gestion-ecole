<template>
	<div
		class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-300"
	>
		<!-- Container principal qui prend toute la page -->
		<div class="h-full flex flex-col">
			<!-- Header avec breadcrumb et titre -->
			<div class="mb-6">
				<Breadcrumb
					:items="[
						{ label: 'Filieres', to: '/' },
						{ label: 'Ajouter une filiere', to: null },
					]"
					title="Ajouter une filiere"
					:title-class="'text-xl md:text-2xl text-gray-800 dark:text-white'"
					:spacing="'mb-2'"
					:link-color="'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'"
					:active-color="'text-gray-900 dark:text-gray-200 font-medium'"
					:text-size="'text-base'"
					align="left"
				/>

				<!-- Bouton retour -->
				<div class="mt-4">
					<NuxtLink
						to="/filières/list"
						class="inline-flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
						Retour à la liste
					</NuxtLink>
				</div>
			</div>

			<!-- Formulaire qui prend le reste de l'espace -->
			<div class="flex-1">
				<div class="h-full">
					<div
						class="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 h-full p-6 md:p-8 transition-colors duration-300"
					>
						<form @submit.prevent="submitForm" class="h-full flex flex-col">
							<!-- Contenu du formulaire avec scroll si nécessaire -->
							<div class="flex-1 overflow-y-auto pr-2 -mr-2">
								<div class="space-y-6">
									<!-- Nom de la filière -->
									<div>
										<label
											for="nom"
											class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											Nom de la filière
											<span class="text-rose-500 dark:text-rose-400">*</span>
										</label>
										<input
											id="nom"
											v-model="form.nom"
											type="text"
											required
											class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all placeholder-gray-500 dark:placeholder-gray-400"
											placeholder="Nom de la filière"
										/>
										<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
											Ex: Génie Logiciel & Systèmes d'Informations
										</p>
									</div>

									<!-- Code de la filière -->
									<div>
										<label
											for="code"
											class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											Code de la filière
											<span class="text-rose-500 dark:text-rose-400">*</span>
										</label>
										<input
											id="code"
											v-model="form.code"
											type="text"
											required
											class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white uppercase transition-all placeholder-gray-500 dark:placeholder-gray-400"
											placeholder="Code de la filière"
											maxlength="10"
										/>
										<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
											Ex: GLSI, ASR, TC_1 (maximum 10 caractères)
										</p>
									</div>

									<!-- Description de la filière -->
									<div>
										<label
											for="description"
											class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											Description de la filière
										</label>
										<textarea
											id="description"
											v-model="form.description"
											rows="4"
											class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all resize-none placeholder-gray-500 dark:placeholder-gray-400"
											placeholder="Décrivez la filière..."
										></textarea>
										<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
											Description détaillée de la filière (objectifs, débouchés, etc.)
										</p>
									</div>

									<!-- Image d'illustration -->
									<div>
										<label
											class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											Image d'illustration
										</label>

										<!-- Zone de drag & drop -->
										<div
											@dragover.prevent="dragOver = true"
											@dragleave="dragOver = false"
											@drop.prevent="handleFileDrop"
											:class="[
												'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all',
												dragOver
													? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
													: 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
											]"
											@click="triggerFileInput"
										>
											<input
												ref="fileInput"
												type="file"
												accept="image/*"
												class="hidden"
												@change="handleFileSelect"
											/>

											<div class="space-y-3">
												<div class="flex justify-center">
													<div
														class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center"
													>
														<svg
															class="w-6 h-6 text-gray-400 dark:text-gray-500"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
															/>
														</svg>
													</div>
												</div>

												<div>
													<p
														class="text-sm font-medium text-gray-700 dark:text-gray-300"
													>
														Cliquez pour sélectionner ou glissez-déposez
													</p>
													<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
														PNG, JPG, GIF jusqu'à 5MB
													</p>
												</div>

												<div v-if="form.imagePreview" class="mt-4">
													<div class="relative inline-block">
														<img
															:src="form.imagePreview"
															alt="Aperçu"
															class="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
														/>
														<button
															type="button"
															@click.stop="removeImage"
															class="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 dark:bg-rose-600 text-white rounded-full flex items-center justify-center hover:bg-rose-600 dark:hover:bg-rose-700 transition-colors"
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
																	d="M6 18L18 6M6 6l12 12"
																/>
															</svg>
														</button>
													</div>
												</div>
												<div v-else>
													<p class="text-sm text-gray-400 dark:text-gray-500">
														Aucun fichier n'a été sélectionné
													</p>
												</div>
											</div>
										</div>
									</div>

									<!-- Informations supplémentaires -->
									<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
										<!-- Durée de la formation -->
										<div>
											<label
												for="duree"
												class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
											>
												Durée de la formation
											</label>
											<input
												id="duree"
												v-model="form.duree"
												type="text"
												class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all placeholder-gray-500 dark:placeholder-gray-400"
												placeholder="Ex: 3 ans"
											/>
										</div>

										<!-- Nombre de crédits -->
										<div>
											<label
												for="credits"
												class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
											>
												Nombre de crédits
											</label>
											<input
												id="credits"
												v-model="form.credits"
												type="number"
												min="0"
												class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all placeholder-gray-500 dark:placeholder-gray-400"
												placeholder="Ex: 180"
											/>
										</div>
									</div>

									<!-- Statut de la filière -->
									<div>
										<label
											class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											Statut de la filière
										</label>
										<div class="flex flex-col sm:flex-row gap-4">
											<label class="inline-flex items-center">
												<input
													type="radio"
													v-model="form.statut"
													value="active"
													class="h-4 w-4 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
												/>
												<span class="ml-2 text-sm text-gray-700 dark:text-gray-300"
													>Active</span
												>
											</label>
											<label class="inline-flex items-center">
												<input
													type="radio"
													v-model="form.statut"
													value="inactive"
													class="h-4 w-4 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
												/>
												<span class="ml-2 text-sm text-gray-700 dark:text-gray-300"
													>Inactive</span
												>
											</label>
											<label class="inline-flex items-center">
												<input
													type="radio"
													v-model="form.statut"
													value="bientot"
													class="h-4 w-4 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
												/>
												<span class="ml-2 text-sm text-gray-700 dark:text-gray-300"
													>Bientôt disponible</span
												>
											</label>
										</div>
									</div>
								</div>
							</div>

							<!-- Boutons d'action - Toujours visible en bas -->
							<div
								class="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700"
							>
								<div class="flex flex-col sm:flex-row justify-end gap-3">
									<NuxtLink
										to="/filieres"
										class="px-6 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-center"
									>
										Annuler
									</NuxtLink>
									<button
										type="submit"
										:disabled="loading"
										class="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-center"
									>
										<span
											v-if="loading"
											class="flex items-center justify-center gap-2"
										>
											<svg
												class="animate-spin h-5 w-5 text-white"
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
											Enregistrement...
										</span>
										<span v-else> Soumettre </span>
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, reactive } from "vue";
	import { useRouter } from "vue-router";
	import Breadcrumb from "~/components/Breadcrumb.vue";

	const router = useRouter();
	const fileInput = ref(null);
	const dragOver = ref(false);
	const loading = ref(false);

	// Formulaire
	const form = reactive({
		nom: "",
		code: "",
		description: "",
		image: null,
		imagePreview: null,
		duree: "",
		credits: "",
		statut: "active",
		inscrits: 0,
	});

	// Déclencher l'input file
	const triggerFileInput = () => {
		fileInput.value.click();
	};

	// Gérer la sélection de fichier
	const handleFileSelect = (event) => {
		const file = event.target.files[0];
		if (file && file.type.startsWith("image/")) {
			if (file.size > 5 * 1024 * 1024) {
				alert("Le fichier est trop volumineux (max 5MB)");
				return;
			}

			form.image = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				form.imagePreview = e.target.result;
			};
			reader.readAsDataURL(file);
		} else {
			alert("Veuillez sélectionner une image valide");
		}
	};

	// Gérer le drop de fichier
	const handleFileDrop = (event) => {
		dragOver.value = false;
		const file = event.dataTransfer.files[0];
		if (file && file.type.startsWith("image/")) {
			if (file.size > 5 * 1024 * 1024) {
				alert("Le fichier est trop volumineux (max 5MB)");
				return;
			}

			form.image = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				form.imagePreview = e.target.result;
			};
			reader.readAsDataURL(file);
		} else {
			alert("Veuillez déposer une image valide");
		}
	};

	// Supprimer l'image
	const removeImage = () => {
		form.image = null;
		form.imagePreview = null;
		if (fileInput.value) {
			fileInput.value.value = "";
		}
	};

	// Soumettre le formulaire
	const submitForm = async () => {
		if (!form.nom || !form.code) {
			alert("Veuillez remplir les champs obligatoires");
			return;
		}

		loading.value = true;

		try {
			// Charger les filières existantes
			let filieres = [];
			if (process.client) {
				const stored = localStorage.getItem("filieres");
				if (stored) {
					filieres = JSON.parse(stored);
				}
			}

			// Générer un nouvel ID
			const newId =
				filieres.length > 0 ? Math.max(...filieres.map((f) => f.id)) + 1 : 1;

			// Créer la nouvelle filière
			const nouvelleFiliere = {
				id: newId,
				nom: form.nom,
				code: form.code.toUpperCase(),
				description: form.description || "À fournir...",
				inscrits: 0,
				duree: form.duree,
				credits: parseInt(form.credits) || 0,
				statut: form.statut,
				// Pour l'image, en production vous devriez l'uploader vers un serveur
				image: form.imagePreview, // Stocker l'URL de l'image
				dateCreation: new Date().toISOString().split("T")[0],
			};

			// Ajouter à la liste
			filieres.push(nouvelleFiliere);

			// Sauvegarder dans localStorage
			if (process.client) {
				localStorage.setItem("filieres", JSON.stringify(filieres));
			}

			// Simuler un délai de traitement
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Redirection vers la liste des filières
			router.push("/filieres");
		} catch (error) {
			console.error("Erreur lors de l'ajout:", error);
			alert("Une erreur est survenue lors de l'ajout de la filière");
		} finally {
			loading.value = false;
		}
	};
</script>

