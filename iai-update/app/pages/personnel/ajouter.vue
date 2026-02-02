<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
		<!-- Breadcrumb -->
		<Breadcrumb
			:items="[
				{ label: 'Administration', to: '/' },
				{ label: 'Membres', to: '/personnel/utilisateurs' },
				{ label: 'Ajouter', to: null },
			]"
			title="Ajouter un utilisateur"
			title-class="text-2xl font-semibold text-gray-800 dark:text-white"
			spacing="mb-6"
		/>

		<!-- Formulaire -->
		<form
			@submit.prevent="submitUser"
			class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-5"
		>
			<!-- Nom -->
			<div>
				<label class="block text-gray-700 dark:text-gray-300 font-medium mb-1"
					>Nom *</label
				>
				<input
					v-model="form.nom"
					type="text"
					placeholder="Nom"
					required
					class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
				/>
			</div>

			<!-- Prénoms -->
			<div>
				<label class="block text-gray-700 dark:text-gray-300 font-medium mb-1"
					>Prénoms *</label
				>
				<input
					v-model="form.prenom"
					type="text"
					placeholder="Prénom(s)"
					required
					class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
				/>
			</div>

			<!-- Email -->
			<div>
				<label class="block text-gray-700 dark:text-gray-300 font-medium mb-1"
					>Email *</label
				>
				<input
					v-model="form.email"
					type="email"
					placeholder="Adresse mail"
					required
					class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
				/>
			</div>

			<!-- Téléphone -->
			<div>
				<label class="block text-gray-700 dark:text-gray-300 font-medium mb-1"
					>Numéro de téléphone *</label
				>
				<input
					v-model="form.tel"
					type="text"
					placeholder="Numéro de téléphone"
					required
					class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
				/>
			</div>

			<!-- Genre -->
			<div>
				<label class="block text-gray-700 dark:text-gray-300 font-medium mb-1"
					>Genre *</label
				>
				<select
					v-model="form.genre"
					required
					class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
				>
					<option value="" disabled>Choisir le genre</option>
					<option value="Masculin">Masculin</option>
					<option value="Féminin">Féminin</option>
				</select>
			</div>

			<!-- Type de Surveillant -->
			<div>
				<label class="block text-gray-700 dark:text-gray-300 font-medium mb-1"
					>Type de Surveillant</label
				>
				<select
					v-model="form.supervisor_type"
					class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
				>
					<option value="non_surveillant">Non surveillant</option>
					<option value="interne">Interne</option>
					<option value="externe">Externe</option>
				</select>
			</div>

			<!-- Biographie -->
			<div>
				<label class="block text-gray-700 dark:text-gray-300 font-medium mb-1"
					>Biographie</label
				>
				<Editor
					api-key="ktf8z0z55enm2wd9xyeoo6qzzoy7w9b629e51wii9y8lw4dx"
					v-model="form.biographie"
					:init="{
						height: 250,
						menubar: false,
						plugins: 'lists link image media table wordcount',
						toolbar:
							'undo redo | bold italic underline | bullist numlist | link image media | removeformat',
						content_style:
							'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
					}"
				/>
			</div>

			<!-- Bouton Soumettre -->
			<div class="flex justify-end">
				<button
					type="submit"
					:disabled="userStore.isLoading"
					class="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<span v-if="userStore.isLoading">Enregistrement...</span>
					<span v-else>Soumettre</span>
				</button>
			</div>
		</form>
	</div>
</template>

<script setup>
	import { ref } from "vue";
	import { useUserStore } from "~~/stores/user";
	import { useRouter } from "vue-router";
	import Breadcrumb from "~/components/Breadcrumb.vue";
	import Editor from "@tinymce/tinymce-vue";

	const userStore = useUserStore();
	const router = useRouter();

	const form = ref({
		nom: "",
		prenom: "",
		email: "",
		tel: "",
		genre: "",
		supervisor_type: "non_surveillant",
		biographie: "",
	});

	const submitUser = async () => {
		try {
			await userStore.addUser(form.value);

			$swal.fire({
				icon: "success",
				title: "Utilisateur ajouté !",
				timer: 1500,
				showConfirmButton: false,
			});

			router.push("/personnel/utilisateurs");
		} catch (error) {
			// Gère uniquement les erreurs 422 de validation
			if (error.response && error.response.status === 422) {
				const messages = Object.entries(error.response.data.errors)
					.map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
					.join("<br>");
				if (typeof $swal !== "undefined") {
					$swal.fire({
						icon: "error",
						title: "Erreur de validation",
						html: messages,
					});
				}
			} else {
				// Autres erreurs réseau / serveur
				if (typeof $swal !== "undefined") {
					$swal.fire({
						icon: "error",
						title: "Erreur",
						text: "Impossible d'ajouter l'utilisateur.",
					});
				}
			}
		}
	};
</script>
