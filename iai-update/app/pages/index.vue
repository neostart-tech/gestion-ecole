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
    <button class="add-user-btn" @click="addUser">
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

	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";

const searchQuery = ref("");
const showSelector = ref(false);
const selectedColumns = ref([]);

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

const addUser = () => {
	// Fonction pour ajouter un utilisateur
	const newUserId = rows.value.length + 1;
	const newUser = {
		id: newUserId,
		name: `Nouvel utilisateur ${newUserId}`,
		username: `user${newUserId}`,
		email: `user${newUserId}@example.com`,
		phone: `000-000-${newUserId.toString().padStart(4, '0')}`,
		date: new Date().toISOString().split('T')[0],
		active: true,
		age: Math.floor(Math.random() * 30) + 20,
	};
	
	rows.value.push(newUser);
	alert(`Utilisateur "${newUser.name}" ajouté avec succès!`);
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

/* Boutons d'action */
.action-buttons {
	display: flex;
	gap: 10px;
	align-items: center;
}

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

/* Responsive */
@media (max-width: 768px) {
	.search-filter-area {
		flex-direction: column;
	}
	
	.search-input.compact {
		width: 100%;
	}
	
	.action-buttons {
		width: 100%;
		justify-content: space-between;
	}
}
</style>