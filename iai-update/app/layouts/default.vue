<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<SidebarApp />
		<HeaderApp />
		<SettingsPanel />

		<!-- Main content -->
		<main
			:class="[
				'pt-16 transition-all duration-300',
				themeStore.isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20',
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
	import { useThemeStore } from "../../stores/theme";

	const themeStore = useThemeStore();

	// Appliquer le thème au chargement
	onMounted(() => {
		themeStore.applyTheme();
	});

	// Gérer le redimensionnement de la fenêtre
	const handleResize = () => {
		if (window.innerWidth >= 1024) {
			themeStore.isMobileSidebarOpen = false;
		}
	};

	onMounted(() => {
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	});
</script>
