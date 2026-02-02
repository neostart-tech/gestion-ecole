<template>
	<div
		class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
	>
		<!-- Breadcrumb -->
		<Breadcrumb
			:items="[
				{ label: 'Administration', to: '/' },
				{ label: 'Membres', to: null },
			]"
			title="Liste des membres de l’administration"
			title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
			spacing="mb-4"
		/>

		<!-- Toolbar -->
		<div
			class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5"
		>
			<!-- Recherche -->
			<input
				v-model="searchQuery"
				type="search"
				placeholder="Rechercher..."
				class="w-full lg:w-64 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
			/>

			<div class="flex flex-col sm:flex-row gap-3">
				<!-- Colonnes -->
				<client-only>
					<VDropdown placement="bottom-end">
						<button
							class="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						>
							Colonnes
							<svg
								class="w-4 h-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
							>
								<path
									d="M6 9l6 6 6-6"
									stroke-width="2"
									stroke-linecap="round"
								/>
							</svg>
						</button>

						<template #popper>
							<div
								class="w-56 p-3 rounded-lg shadow-lg bg-white dark:bg-gray-800"
							>
								<div
									v-for="col in columns"
									:key="col.field"
									class="flex items-center gap-2 py-1"
								>
									<input
										type="checkbox"
										v-model="col.visible"
										:disabled="col.field === 'action'"
										class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
									/>
									<span class="text-sm text-gray-700 dark:text-gray-300">
										{{ col.title }}
									</span>
								</div>
							</div>
						</template>
					</VDropdown>
				</client-only>

				<!-- Bouton ajouter -->
				<NuxtLink
					to="/personnel/ajouter"
					class="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
				>
					<svg
						class="w-5 h-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
					>
						<path
							d="M12 5v14M5 12h14"
							stroke-width="2"
							stroke-linecap="round"
						/>
					</svg>
					Ajouter
				</NuxtLink>
			</div>
		</div>

		<!-- Table -->
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow p-3 sm:p-4">
			<!-- Loader -->
			<div v-if="loading" class="flex justify-center py-10">
				<div
					class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"
				></div>
			</div>

			<div v-else class="overflow-x-auto">
				<Vue3Datatable
					:columns="visibleColumns"
					:rows="rows"
					:search="searchQuery"
					:per-page="itemsPerPage"
					skin="bh-table-striped bh-table-hover"
				>
					<!-- Actions -->
					<template #action="{ row }">
						<div class="flex justify-center gap-3">
							<button
								class="p-2 rounded-lg text-blue-600 hover:bg-blue-100"
								@click="openEditModal(row)"
							>
								<svg
									class="w-5 h-5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
								>
									<path
										d="M4 20h4l10-10-4-4L4 16v4z"
										stroke-width="2"
										stroke-linejoin="round"
									/>
								</svg>
							</button>

							<!-- Delete -->
							<button
								class="p-2 rounded-lg text-red-600 hover:bg-red-100"
								@click="confirmDelete(row)"
							>
								<svg
									class="w-5 h-5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
								>
									<path
										d="M3 6h18M8 6v14m8-14v14M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14"
										stroke-width="2"
										stroke-linecap="round"
									/>
								</svg>
							</button>
						</div>
					</template>
				</Vue3Datatable>
			</div>
		</div>
	</div>

	<!-- MODAL MODIFICATION -->
	<div
		v-if="showEditModal"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
	>
		<div
			class="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-xl shadow-xl p-6 overflow-y-auto max-h-[90vh]"
		>
			<div class="flex justify-between items-center mb-6">
				<h2 class="text-2xl font-semibold text-gray-800 dark:text-white">
					Modifier l'utilisateur
				</h2>
				<button
					class="text-gray-500 hover:text-red-600"
					@click="showEditModal = false"
				>
					✕
				</button>
			</div>

			<form @submit.prevent="submitUpdate" class="space-y-5">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label class="label">Nom *</label>
						<input v-model="editForm.nom" class="input" required />
					</div>

					<div>
						<label class="label">Prénoms *</label>
						<input v-model="editForm.prenom" class="input" required />
					</div>

					<div>
						<label class="label">Email *</label>
						<input
							type="email"
							v-model="editForm.email"
							class="input"
							required
						/>
					</div>

					<div>
						<label class="label">Téléphone *</label>
						<input v-model="editForm.tel" class="input" required />
					</div>

					<div>
						<label class="label">Genre *</label>
						<select v-model="editForm.genre" class="input" required>
							<option value="Masculin">Masculin</option>
							<option value="Féminin">Féminin</option>
						</select>
					</div>

					<div>
						<label class="label">Type surveillant</label>
						<select v-model="editForm.supervisor_type" class="input">
							<option value="non_surveillant">Non surveillant</option>
							<option value="interne">Interne</option>
							<option value="externe">Externe</option>
						</select>
					</div>
				</div>

				<div class="flex justify-end gap-3 pt-6">
					<button
						type="button"
						class="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
						@click="showEditModal = false"
					>
						Annuler
					</button>

					<button
						type="submit"
						class="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
					>
						Enregistrer
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted } from "vue";
	import Vue3Datatable from "@bhplugin/vue3-datatable";
	import "@bhplugin/vue3-datatable/dist/style.css";
	import Breadcrumb from "~/components/Breadcrumb.vue";
	import { useUserStore } from "~~/stores/user";

	import Swal from "sweetalert2";

	const showEditModal = ref(false);
	const editForm = ref({});

	const openEditModal = (user) => {
		editForm.value = {
			id: user.id,
			nom: user.nom,
			prenom: user.prenom,
			email: user.email,
			tel: user.tel,
			genre: user.genre,
			supervisor_type: user.supervisor_type ?? "non_surveillant",
			biographie: user.biographie ?? "",
		};

		showEditModal.value = true;
	};

	const confirmDelete = async (user) => {
		const result = await Swal.fire({
			title: "Supprimer ?",
			text: `Voulez-vous supprimer ${user.nom} ${user.prenom} ?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#dc2626",
			cancelButtonColor: "#6b7280",
			confirmButtonText: "Oui, supprimer",
			cancelButtonText: "Annuler",
		});

		if (result.isConfirmed) {
			await userStore.deleteUser(user.id);

			Swal.fire({
				icon: "success",
				title: "Supprimé",
				text: "Utilisateur supprimé avec succès",
				timer: 1500,
				showConfirmButton: false,
			});
		}
	};

	const submitUpdate = async () => {
		try {
			await userStore.updateUser(editForm.value.id, editForm.value);

			showEditModal.value = false;

			Swal.fire({
				icon: "success",
				title: "Succès",
				text: "Utilisateur modifié",
				timer: 1500,
				showConfirmButton: false,
			});
		} catch (e) {
			Swal.fire({
				icon: "error",
				title: "Erreur",
				text: "Impossible de modifier l'utilisateur",
			});
		}
	};

	const userStore = useUserStore();

	const searchQuery = ref("");
	const itemsPerPage = ref(10);
	const loading = ref(true);

	/* Colonnes avec visible: true par défaut */
	const columns = ref([
		{ field: "index", title: "#", sortable: true, visible: true },
		{ field: "nom", title: "Nom", sortable: true, visible: true },
		{ field: "prenom", title: "Prénoms", sortable: true, visible: true },
		{
			field: "supervisor_type",
			title: "Type surveillant",
			sortable: true,
			visible: true,
		},
		{ field: "action", title: "Actions", sortable: false, visible: true },
	]);

	/* Colonnes réellement affichées selon visible */
	const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

	/* Rows avec index dynamique et supervisor_type */
	const rows = computed(() =>
		userStore.users.map((u, i) => ({
			...u,
			index: i + 1,
			supervisor_type: u.supervisor_type ?? "—",
		})),
	);

	onMounted(async () => {
		await userStore.fetchUsers(); // users/liste
		loading.value = false;
	});
</script>
