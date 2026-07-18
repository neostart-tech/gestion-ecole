<template>
	<!-- Overlay -->
	<div
		v-if="themeStore.isSettingsOpen"
		@click="themeStore.toggleSettings"
		class="fixed inset-0 z-50 bg-black bg-opacity-50"
	></div>

	<!-- Panel -->
	<div
		:class="[
			'fixed top-0 right-0 z-50 h-screen w-80 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300',
			themeStore.isSettingsOpen ? 'translate-x-0' : 'translate-x-full',
		]"
	>
		<!-- Header -->
		<div
			class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700"
		>
			<h2 class="text-xl font-semibold text-gray-800 dark:text-white">
				Paramètres
			</h2>
			<button
				@click="themeStore.toggleSettings"
				class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
			>
				<svg
					class="w-6 h-6"
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

		<!-- Content -->
		<div class="h-[calc(100vh-5rem)] overflow-y-auto p-6">
			<!-- Theme Mode -->
			<div class="mb-6">
				<h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
					Mode du thème
				</h3>
				<div class="space-y-2">
					<button
						v-for="mode in ['light', 'dark', 'auto']"
						:key="mode"
						@click="updateTheme('mode', mode)"
						:class="[
							'w-full px-4 py-3 rounded-lg border text-left transition-all duration-200',
							themeStore.themeSettings.mode === mode
								? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
								: 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
						]"
					>
						<div class="flex items-center justify-between">
							<span class="capitalize">{{
								mode === "auto"
									? "Système"
									: mode === "light"
									? "Clair"
									: "Sombre"
							}}</span>
							<svg
								v-if="themeStore.themeSettings.mode === mode"
								class="w-5 h-5"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					</button>
				</div>
			</div>

			<!-- Theme Contrast -->
			<div class="mb-6">
				<h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
					Contraste du thème
				</h3>
				<div class="space-y-2">
					<button
						v-for="contrast in ['default', 'high']"
						:key="contrast"
						@click="updateTheme('contrast', contrast)"
						:class="[
							'w-full px-4 py-3 rounded-lg border text-left transition-all duration-200',
							themeStore.themeSettings.contrast === contrast
								? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
								: 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
						]"
					>
						<div class="flex items-center justify-between">
							<span class="capitalize">{{
								contrast === "default" ? "Défaut" : "Haut contraste"
							}}</span>
							<svg
								v-if="themeStore.themeSettings.contrast === contrast"
								class="w-5 h-5"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					</button>
				</div>
			</div>

			<!-- Custom Theme Color -->
			<div class="mb-6">
				<h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
					Couleur principale
				</h3>
				<div class="grid grid-cols-5 gap-2">
					<button
						v-for="color in themeColors"
						:key="color.value"
						@click="updateTheme('primaryColor', color.value)"
						:class="[
							'w-10 h-10 rounded-lg border-2',
							themeStore.themeSettings.primaryColor === color.value
								? 'border-gray-800 dark:border-white'
								: 'border-gray-300 dark:border-gray-600',
						]"
						:style="{ backgroundColor: color.value }"
						:title="color.name"
					>
						<svg
							v-if="themeStore.themeSettings.primaryColor === color.value"
							class="w-5 h-5 mx-auto text-white"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</div>
			</div>

			<!-- Sidebar Caption -->
			<div class="mb-6">
				<div class="flex items-center justify-between">
					<div>
						<h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
							Légende sidebar
						</h3>
						<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
							Afficher/cacher les titres
						</p>
					</div>
					<button
						@click="toggleSidebarCaption"
						:class="[
							'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
							themeStore.themeSettings.sidebarCaption
								? 'bg-primary-600'
								: 'bg-gray-300 dark:bg-gray-600',
						]"
					>
						<span
							:class="[
								'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
								themeStore.themeSettings.sidebarCaption
									? 'translate-x-6'
									: 'translate-x-1',
							]"
						/>
					</button>
				</div>
			</div>

			<!-- Theme Layout -->
			<div class="mb-6">
				<h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
					Direction du layout
				</h3>
				<div class="grid grid-cols-2 gap-2">
					<button
						v-for="layout in ['ltr', 'rtl']"
						:key="layout"
						@click="updateTheme('layout', layout)"
						:class="[
							'px-4 py-3 rounded-lg border text-center transition-all duration-200',
							themeStore.themeSettings.layout === layout
								? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
								: 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
						]"
					>
						<span class="uppercase font-medium">{{ layout }}</span>
					</button>
				</div>
			</div>

			<!-- Layout Width -->
			<div class="mb-6">
				<h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
					Largeur du layout
				</h3>
				<div class="grid grid-cols-2 gap-2">
					<button
						v-for="width in ['full', 'container']"
						:key="width"
						@click="updateTheme('width', width)"
						:class="[
							'px-4 py-3 rounded-lg border text-center transition-all duration-200',
							themeStore.themeSettings.width === width
								? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
								: 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
						]"
					>
						<span class="capitalize">{{
							width === "full" ? "Complet" : "Conteneur"
						}}</span>
					</button>
				</div>
			</div>

			<!-- Reset Button -->
			<div class="mt-8">
				<button
					@click="resetLayout"
					class="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200 font-medium"
				>
					Réinitialiser le layout
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useThemeStore } from "../../stores/theme";

	const themeStore = useThemeStore();

	const themeColors = [
		{ name: "Bleu", value: "#3b82f6" },
		{ name: "Indigo", value: "#6366f1" },
		{ name: "Violet", value: "#8b5cf6" },
		{ name: "Rose", value: "#ec4899" },
		{ name: "Orange", value: "#f97316" },
		{ name: "Émeraude", value: "#10b981" },
		{ name: "Cyan", value: "#06b6d4" },
		{ name: "Jaune", value: "#eab308" },
		{ name: "Gris", value: "#6b7280" },
		{ name: "Rouge", value: "#ef4444" },
	];

	const updateTheme = (key: string, value: any) => {
		themeStore.updateThemeSettings({ [key]: value });
	};

	const toggleSidebarCaption = () => {
		themeStore.updateThemeSettings({
			sidebarCaption: !themeStore.themeSettings.sidebarCaption,
		});
	};

	const resetLayout = () => {
		themeStore.resetLayout();
	};
</script>
