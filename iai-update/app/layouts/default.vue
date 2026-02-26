<!-- layouts/default.vue -->
<template>
	<div
		class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
	>
		<AppLogo />
		<SidebarApp />
		<HeaderApp />
		<SettingsPanel />

		<!-- Main content -->
		<main
			:class="[
				'pt-16 transition-all duration-300 mt-10',
				themeStore.isSidebarOpen ? 'lg:ml-80' : 'lg:ml-20',
				'ml-0',
			]"
		>
			<div
				:class="[
					themeStore.themeSettings.width === 'container'
						? 'container mx-auto px-4'
						: 'px-4',
				]"
			>
				<slot />
			</div>
		</main>
	</div>
</template>

<script setup lang="ts">
	import type HeaderAppVue from "~/components/HeaderApp.vue";
	import { useThemeStore } from "../../stores/theme";

	const themeStore = useThemeStore();

	// Charger et appliquer le thème au chargement
	onMounted(() => {
		themeStore.loadState();

		// Observer les changements de thème système (mode auto)
		if (typeof window !== "undefined") {
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

			const handleSystemThemeChange = () => {
				if (themeStore.themeSettings.mode === "auto") {
					console.log("🔄 Thème système changé, mise à jour...");
					themeStore.applyTheme();
				}
			};

			// Ajouter l'écouteur
			mediaQuery.addEventListener("change", handleSystemThemeChange);

			// Nettoyer
			onUnmounted(() => {
				mediaQuery.removeEventListener("change", handleSystemThemeChange);
			});
		}
	});

	// Observer les changements de mode pour réappliquer le thème
	watch(
		() => themeStore.themeSettings.mode,
		(newMode) => {
			console.log(`🎨 Mode changé en: ${newMode}`);
			themeStore.applyTheme();
		},
		{ immediate: false },
	);
</script>
