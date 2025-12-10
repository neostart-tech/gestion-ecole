<template>
	<div class="page-wrapper">

		<!-- Breadcrumb -->
		<div class="breadcrumb">
			<span class="breadcrumb-item">Accueil</span>
			<span class="breadcrumb-separator">/</span>
			<span class="breadcrumb-item active">Utilisateurs</span>
		</div>

		<!-- Titre -->
		<h1 class="page-title">Liste des utilisateurs</h1>

		<div class="search-filter-area">

			<!-- 1️⃣ Recherche -->
			<input
				v-model="searchQuery"
				type="search"
				class="search-input compact"
				placeholder="Rechercher..."
			/>

			<!-- 2️⃣ Sélecteur de colonnes -->
			<div class="column-selector-wrapper">
				<button class="toggle-btn" @click="toggleSelector">
					<span>Tous les colonnes</span>
					<svg class="chevron-icon" :class="{ 'rotated': showSelector }" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
					</svg>
				</button>
				
				<div v-if="showSelector" class="checkbox-dropdown">
					<div class="checkbox-group-vertical">
						<div v-for="col in availableColumns" :key="col.field" class="checkbox-item">
							<input
								type="checkbox"
								:id="col.field"
								v-model="selectedColumns"
								:value="col.field"
							/>
							<label :for="col.field">{{ col.title }}</label>
						</div>
					</div>
				</div>
			</div>

			<!-- 3️⃣ Ajouter utilisateur -->
			<button class="add-user-btn" @click="showAddModal = true">
				<svg class="add-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
				</svg>
				Ajouter utilisateur
			</button>

		</div>

		<!-- Tableau -->
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
			/>
		</div>

		<!-- Modal d'ajout d'utilisateur -->
		<div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
			<div class="modal-content">
				<div class="modal-header">
					<h2>Ajouter un nouvel utilisateur</h2>
					<button class="close-btn" @click="closeModal">&times;</button>
				</div>

				<div class="modal-body">
					<form @submit.prevent="submitUserForm">
						<!-- Photo de profil - Zone rectangulaire complète -->
						<div class="photo-upload-section">
							<div class="photo-container">
								<div class="photo-upload-area" @click="triggerFileInput">
									<template v-if="newUser.photoUrl">
										<img :src="newUser.photoUrl" alt="Photo de profil" class="uploaded-photo" />
										<div class="photo-overlay">
											<svg class="replace-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
											</svg>
											<span>Remplacer la photo</span>
										</div>
									</template>
									<template v-else>
										<div class="photo-placeholder-rect">
											<svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
											</svg>
											<div class="upload-text">
												<h3>Ajouter une photo de profil</h3>
												<p>Glissez-déposez ou cliquez pour sélectionner une image</p>
											</div>
											<div class="file-requirements">
												<span>Formats supportés: JPG, PNG, GIF</span>
												<span>Taille maximale: 2MB</span>
											</div>
										</div>
									</template>
								</div>
								<input
									type="file"
									ref="fileInput"
									@change="handleFileUpload"
									accept="image/*"
									class="file-input"
									style="display: none;"
								/>
							</div>
						</div>

						<!-- Informations personnelles -->
						<div class="form-grid">
							<div class="form-group">
								<label for="name">Nom complet *</label>
								<input
									type="text"
									id="name"
									v-model="newUser.name"
									required
									placeholder="Ex: Akakpo"
								/>
							</div>

							<div class="form-group">
								<label for="username">Pseudo *</label>
								<input
									type="text"
									id="username"
									v-model="newUser.username"
									required
									placeholder="Ex: Ali"
								/>
							</div>

							<div class="form-group">
								<label for="email">Email *</label>
								<input
									type="email"
									id="email"
									v-model="newUser.email"
									required
									placeholder="exemple@gmail.com"
								/>
							</div>

							<div class="form-group">
								<label for="phone">Téléphone</label>
								<input
									type="tel"
									id="phone"
									v-model="newUser.phone"
									placeholder="+228 00 00 00 00"
								/>
							</div>

							<div class="form-group">
								<label for="age">Âge</label>
								<input
									type="number"
									id="age"
									v-model="newUser.age"
									min="1"
									max="120"
									placeholder="25"
								/>
							</div>

							<div class="form-group">
								<label for="date">Date d'inscription</label>
								<input
									type="date"
									id="date"
									v-model="newUser.date"
								/>
							</div>

							<div class="form-group full-width">
								<label>Statut</label>
								<div class="radio-group">
									<label class="radio-label">
										<input
											type="radio"
											v-model="newUser.active"
											:value="true"
										/>
										<span>Actif</span>
									</label>
									<label class="radio-label">
										<input
											type="radio"
											v-model="newUser.active"
											:value="false"
										/>
										<span>Inactif</span>
									</label>
								</div>
							</div>

							<div class="form-group full-width">
								<label for="notes">Notes supplémentaires</label>
								<textarea
									id="notes"
									v-model="newUser.notes"
									rows="3"
									placeholder="Informations supplémentaires..."
								></textarea>
							</div>
						</div>

						<div class="modal-footer">
							<button type="button" class="btn-cancel" @click="closeModal">
								Annuler
							</button>
							<button type="submit" class="btn-submit">
								<svg class="submit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
								</svg>
								Créer l'utilisateur
							</button>
						</div>
					</form>
				</div>
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
const showAddModal = ref(false);
const selectedColumns = ref([]);
const fileInput = ref(null);

// Données du nouvel utilisateur
const newUser = ref({
	name: "",
	username: "",
	email: "",
	phone: "",
	age: "",
	date: new Date().toISOString().split('T')[0],
	active: true,
	notes: "",
	photoUrl: ""
});

const availableColumns = ref([
	{ field: "id", title: "ID", width: "60px" },
	{ field: "name", title: "Nom" },
	{ field: "username", title: "Pseudo" },
	{ field: "email", title: "Email" },
	{ field: "phone", title: "Téléphone" },
	{ field: "date", title: "Date", type: "date" },
	{ field: "active", title: "Actif", type: "bool" },
	{ field: "age", title: "Âge", type: "number" },
]);

// Initialiser avec toutes les colonnes sélectionnées
onMounted(() => {
	selectedColumns.value = availableColumns.value.map(col => col.field);
});

// Colonnes filtrées selon la sélection
const filteredCols = computed(() => {
	return availableColumns.value.filter(col => 
		selectedColumns.value.includes(col.field)
	);
});

const rows = ref([
	{
		id: 1,
		name: "Leanne Graham",
		username: "Bret",
		email: "Sincere@april.biz",
		phone: "1-770-736-8031",
		date: "2022-09-27",
		active: true,
		age: 28,
	},
	{
		id: 2,
		name: "Ervin Howell",
		username: "Antonette",
		email: "Shanna@melissa.tv",
		phone: "010-692-6593",
		date: "2023-01-15",
		active: false,
		age: 32,
	},
	{
		id: 3,
		name: "Clementine Bauch",
		username: "Samantha",
		email: "Nathan@yesenia.net",
		phone: "1-463-123-4447",
		date: "2022-11-30",
		active: true,
		age: 25,
	},
]);

const toggleSelector = () => {
	showSelector.value = !showSelector.value;
};

// Gestion de l'upload de photo
const triggerFileInput = () => {
	fileInput.value.click();
};

const handleFileUpload = (event) => {
	const file = event.target.files[0];
	if (file) {
		// Vérifier la taille (max 2MB)
		if (file.size > 2 * 1024 * 1024) {
			alert("Le fichier est trop volumineux. Taille maximale: 2MB");
			return;
		}

		// Vérifier le type
		if (!file.type.startsWith('image/')) {
			alert("Veuillez sélectionner une image valide");
			return;
		}

		// Créer une URL pour l'aperçu
		const reader = new FileReader();
		reader.onload = (e) => {
			newUser.value.photoUrl = e.target.result;
		};
		reader.readAsDataURL(file);
	}
};

// Fermer la modal
const closeModal = () => {
	showAddModal.value = false;
	resetForm();
};

// Réinitialiser le formulaire
const resetForm = () => {
	newUser.value = {
		name: "",
		username: "",
		email: "",
		phone: "",
		age: "",
		date: new Date().toISOString().split('T')[0],
		active: true,
		notes: "",
		photoUrl: ""
	};
	if (fileInput.value) {
		fileInput.value.value = "";
	}
};

// Soumettre le formulaire
const submitUserForm = () => {
	// Validation simple
	if (!newUser.value.name || !newUser.value.username || !newUser.value.email) {
		alert("Veuillez remplir les champs obligatoires (*)");
		return;
	}

	const newUserId = rows.value.length + 1;
	const userToAdd = {
		id: newUserId,
		name: newUser.value.name,
		username: newUser.value.username,
		email: newUser.value.email,
		phone: newUser.value.phone || "Non spécifié",
		date: newUser.value.date,
		active: newUser.value.active,
		age: newUser.value.age ? parseInt(newUser.value.age) : 0,
		photoUrl: newUser.value.photoUrl,
		notes: newUser.value.notes
	};

	rows.value.push(userToAdd);
	
	alert(`Utilisateur "${newUser.value.name}" ajouté avec succès!`);
	closeModal();
};
</script>

<style scoped>
/* Page structurée et centrée */
.page-wrapper {
	max-width: 1100px;
	margin: 30px auto;
	padding: 15px;
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

.breadcrumb-item.active {
	color: #111827;
	font-weight: 500;
	cursor: default;
}

.breadcrumb-item.active:hover {
	color: #111827;
}

.breadcrumb-separator {
	color: #9ca3af;
}

/* Titre */
.page-title {
	font-size: 24px;
	font-weight: 600;
	color: #333;
	margin-bottom: 20px;
}

/* Zone recherche et boutons d'action */
.search-filter-area {
	display: flex;
	gap: 15px;
	margin-bottom: 20px;
	align-items: flex-start;
	flex-wrap: wrap;
}

.search-input {
	padding: 10px 14px;
	border-radius: 8px;
	border: 1px solid #d1d5db;
	font-size: 15px;
	transition: 0.2s;
	background: #fff;
	flex: 1;
	min-width: 200px;
}

.search-input.compact {
	width: 250px;
	flex: 0 0 auto;
}

.search-input:focus {
	outline: none;
	border-color: #4f46e5;
	box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.25);
}

/* Bouton Ajouter utilisateur */
.add-user-btn {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 10px 18px;
	background-color: #10b981;
	color: white;
	border: none;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: background-color 0.2s;
	white-space: nowrap;
}

.add-user-btn:hover {
	background-color: #059669;
}

.add-icon {
	width: 18px;
	height: 18px;
}

/* Sélecteur de colonnes */
.column-selector-wrapper {
	position: relative;
}

.toggle-btn {
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 10px 16px;
	background-color: white;
	color: #4b5563;
	border: 1px solid #d1d5db;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
	white-space: nowrap;
}

.toggle-btn:hover {
	background-color: #f9fafb;
	border-color: #9ca3af;
}

.chevron-icon {
	width: 16px;
	height: 16px;
	transition: transform 0.2s;
}

.chevron-icon.rotated {
	transform: rotate(180deg);
}

/* Dropdown des colonnes */
.checkbox-dropdown {
	position: absolute;
	top: 100%;
	right: 0;
	margin-top: 8px;
	background: white;
	border-radius: 8px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	z-index: 100;
	min-width: 200px;
	overflow: hidden;
	border: 1px solid #e5e7eb;
}

.checkbox-group-vertical {
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 15px;
	max-height: 300px;
	overflow-y: auto;
}

.checkbox-item {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 6px 0;
}

.checkbox-item input[type="checkbox"] {
	width: 16px;
	height: 16px;
	cursor: pointer;
	accent-color: #4f46e5;
}

.checkbox-item label {
	font-size: 14px;
	color: #374151;
	cursor: pointer;
	user-select: none;
}

.checkbox-item:hover {
	background-color: #f9fafb;
	border-radius: 4px;
	padding-left: 8px;
	padding-right: 8px;
	margin-left: -8px;
	margin-right: -8px;
}

/* Carte contenant le tableau */
.table-card {
	background: white;
	padding: 22px;
	border-radius: 12px;
	box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.08);
}

/* Modal */
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
	padding: 20px;
}

.modal-content {
	background: white;
	border-radius: 12px;
	width: 100%;
	max-width: 800px;
	max-height: 90vh;
	overflow-y: auto;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px 24px;
	border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
	margin: 0;
	font-size: 20px;
	font-weight: 600;
	color: #111827;
}

.close-btn {
	background: none;
	border: none;
	font-size: 28px;
	color: #6b7280;
	cursor: pointer;
	line-height: 1;
	padding: 0;
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 4px;
	transition: background-color 0.2s;
}

.close-btn:hover {
	background-color: #f3f4f6;
	color: #111827;
}

.modal-body {
	padding: 24px;
}

/* Section photo - Zone rectangulaire complète */
.photo-upload-section {
	margin-bottom: 30px;
}

.photo-container {
	width: 100%;
}

.photo-upload-area {
	width: 100%;
	min-height: 200px;
	border: 2px dashed #d1d5db;
	border-radius: 12px;
	background: #f9fafb;
	position: relative;
	cursor: pointer;
	transition: all 0.3s ease;
	overflow: hidden;
}

.photo-upload-area:hover {
	border-color: #10b981;
	background: #f0fdfa;
}

/* Style quand une photo est uploadée */
.uploaded-photo {
	width: 100%;
	height: 100%;
	object-fit: cover;
	min-height: 200px;
}

.photo-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.6);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: white;
	opacity: 0;
	transition: opacity 0.3s ease;
}

.photo-upload-area:hover .photo-overlay {
	opacity: 1;
}

.replace-icon {
	width: 40px;
	height: 40px;
	margin-bottom: 10px;
}

.photo-overlay span {
	font-size: 14px;
	font-weight: 500;
}

/* Style pour le placeholder (quand aucune photo) */
.photo-placeholder-rect {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40px 20px;
	min-height: 200px;
	text-align: center;
}

.upload-icon {
	width: 60px;
	height: 60px;
	color: #9ca3af;
	margin-bottom: 20px;
}

.upload-text h3 {
	margin: 0 0 8px 0;
	font-size: 18px;
	font-weight: 600;
	color: #374151;
}

.upload-text p {
	margin: 0 0 20px 0;
	color: #6b7280;
	font-size: 14px;
}

.file-requirements {
	display: flex;
	flex-direction: column;
	gap: 4px;
	font-size: 12px;
	color: #9ca3af;
}

/* Formulaire */
.form-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20px;
	margin-bottom: 24px;
}

.form-group {
	display: flex;
	flex-direction: column;
}

.form-group.full-width {
	grid-column: span 2;
}

.form-group label {
	margin-bottom: 8px;
	font-size: 14px;
	font-weight: 500;
	color: #374151;
}

.form-group label::after {
	content: " *";
	color: #ef4444;
	visibility: hidden;
}

.form-group input[required] + label::after,
.form-group textarea[required] + label::after {
	visibility: visible;
}

.form-group input:not([type="radio"]),
.form-group textarea {
	padding: 10px 12px;
	border: 1px solid #d1d5db;
	border-radius: 8px;
	font-size: 14px;
	transition: all 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
	outline: none;
	border-color: #10b981;
	box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-group textarea {
	resize: vertical;
	min-height: 80px;
}

/* Radio buttons */
.radio-group {
	display: flex;
	gap: 20px;
	padding: 10px 0;
}

.radio-label {
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
}

.radio-label input[type="radio"] {
	width: 18px;
	height: 18px;
	accent-color: #10b981;
}

.radio-label span {
	font-size: 14px;
	color: #374151;
}

/* Footer modal */
.modal-footer {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	padding-top: 24px;
	border-top: 1px solid #e5e7eb;
}

.btn-cancel {
	padding: 10px 20px;
	background: white;
	color: #6b7280;
	border: 1px solid #d1d5db;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
}

.btn-cancel:hover {
	background-color: #f9fafb;
	color: #374151;
}

.btn-submit {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 10px 24px;
	background-color: #10b981;
	color: white;
	border: none;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: background-color 0.2s;
}

.btn-submit:hover {
	background-color: #059669;
}

.submit-icon {
	width: 18px;
	height: 18px;
}

/* Responsive */
@media (max-width: 768px) {
	.search-filter-area {
		flex-direction: column;
	}
	
	.search-input.compact {
		width: 100%;
	}
	
	.form-grid {
		grid-template-columns: 1fr;
	}
	
	.form-group.full-width {
		grid-column: span 1;
	}
	
	.modal-content {
		max-height: 95vh;
	}
	
	.photo-placeholder-rect {
		padding: 30px 15px;
	}
	
	.upload-text h3 {
		font-size: 16px;
	}
	
	.upload-text p {
		font-size: 13px;
	}
}
</style>