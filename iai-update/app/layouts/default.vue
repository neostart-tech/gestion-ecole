<template>
	<div class="min-h-screen text-gray-900 dark:text-gray-100">
		<!-- Fond animé (basculé dynamiquement) -->
		<div
			class="fixed inset-0 -z-10"
			:class="isDarkMode ? 'dark-bg' : 'light-bg'"
		></div>

		<AppLogo />
		<SidebarApp />
		<HeaderApp />
		<SettingsPanel />

		<!-- Main content -->
		<main
			:class="[
				'pt-16 transition-all duration-300 mt-10 relative',
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
	import { useThemeStore } from "../../stores/theme";
	import { computed } from "vue";

	const themeStore = useThemeStore();

	// Computed pour détecter le mode sombre
	const isDarkMode = computed(() => themeStore.themeSettings.mode === "dark");

	// Charger et appliquer le thème au chargement
	onMounted(() => {
		themeStore.loadState();

		// Observer les changements de thème système (mode auto)
		if (typeof window !== "undefined") {
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

			const handleSystemThemeChange = () => {
				if (themeStore.themeSettings.mode === "auto") {
					console.log("Thème système changé, mise à jour...");
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
			console.log(`Mode changé en: ${newMode}`);
			themeStore.applyTheme();
		},
		{ immediate: false },
	);
</script>

<style scoped>
	/* Fond pour le mode clair */
	.light-bg {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		background: #cae9f1;
		background-image:
			radial-gradient(4px 100px at 0px 235px, #272257, #0000),
			radial-gradient(4px 100px at 300px 235px, #272257, #0000),
			/* ... (toutes les autres radial-gradient pour le mode clair) ... */
			radial-gradient(1.5px 1.5px at 150px 105px, #272257 100%, #0000 150%);
		background-size:
			300px 235px,
			300px 235px,
			/* ... (toutes les autres tailles) ... */ 300px 210px,
			300px 210px,
			300px 210px;
		animation: hi-light 150s linear infinite;
	}

	/* Fond pour le mode sombre */
	.dark-bg {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		background-color: #000;
		--c: #09f;
		background-image:
			radial-gradient(4px 100px at 0px 235px, var(--c), #0000),
			radial-gradient(4px 100px at 300px 235px, var(--c), #0000),
			/* ... (toutes les autres radial-gradient pour le mode sombre) ... */
			radial-gradient(1.5px 1.5px at 150px 105px, var(--c) 100%, #0000 150%);
		background-size:
			300px 235px,
			300px 235px,
			/* ... (toutes les autres tailles) ... */ 300px 210px,
			300px 210px,
			300px 210px;
		animation: hi-dark 150s linear infinite;
	}

	.dark-bg::after {
		content: "";
		position: absolute;
		inset: 0;
		z-index: -1;
		background-image: radial-gradient(
			ellipse 1.5px 2px at 1.5px 50%,
			#0000 0,
			#0000 90%,
			#000 100%
		);
		background-size: 25px 8px;
	}

	/* Animation pour le mode clair */
	@keyframes hi-light {
		0% {
			background-position:
				0px 220px,
				3px 220px,
				/* ... (toutes les autres positions) ... */ 426.5px 180px;
		}
		to {
			background-position:
				0px 6800px,
				3px 6800px,
				/* ... (toutes les autres positions) ... */ 426.5px 6480px;
		}
	}

	/* Animation pour le mode sombre */
	@keyframes hi-dark {
		0% {
			background-position:
				0px 220px,
				3px 220px,
				/* ... (toutes les autres positions) ... */ 426.5px 180px;
		}
		to {
			background-position:
				0px 6800px,
				3px 6800px,
				/* ... (toutes les autres positions) ... */ 426.5px 6480px;
		}
	}
</style>
