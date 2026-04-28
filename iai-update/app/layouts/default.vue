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
				<!-- Alertes Globales Premium (Profil incomplet) -->
				<div class="mb-6 space-y-3">
					<!-- Alerte Nationalité -->
					<div v-if="showNationaliteAlert" class="group relative overflow-hidden bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-amber-200/50 dark:border-amber-500/20 p-3 rounded-2xl shadow-sm transition-all hover:shadow-md hover:bg-white/60 dark:hover:bg-gray-800/60 animate-fade-in-down">
						<div class="flex items-center gap-4">
							<div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
								<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
								</svg>
							</div>
							<div class="flex-1 min-w-0">
								<h4 class="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-0.5">Nationalité requise</h4>
								<p class="text-sm text-amber-700/80 dark:text-amber-300/80 truncate">Complétez votre profil pour régulariser votre dossier.</p>
							</div>
							<NuxtLink to="/profile/info" class="flex-shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95">
								Remplir
							</NuxtLink>
						</div>
					</div>

					<!-- Alert NIF -->
					<div v-if="showNifAlert" class="group relative overflow-hidden bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-orange-200/50 dark:border-orange-500/20 p-3 rounded-2xl shadow-sm transition-all hover:shadow-md hover:bg-white/60 dark:hover:bg-gray-800/60 animate-fade-in-down">
						<div class="flex items-center gap-4">
							<div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
								<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
								</svg>
							</div>
							<div class="flex-1 min-w-0">
								<h4 class="text-xs font-bold text-orange-800 dark:text-orange-400 uppercase tracking-wider mb-0.5">Information Fiscale</h4>
								<p class="text-sm text-orange-700/80 dark:text-orange-300/80">
									Si le NIF est renseigné, seulement <strong>5 %</strong> sont prélevés sur votre salaire ; sinon, <strong>20 %</strong> seront prélevés. Le NIF est obligatoire pour les Togolais.
								</p>
							</div>
							<NuxtLink to="/profile/info" class="flex-shrink-0 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95">
								Corriger
							</NuxtLink>
						</div>
					</div>

					<!-- Alert Documents -->
					<div v-if="showDocumentsAlert" class="group relative overflow-hidden bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-rose-200/50 dark:border-rose-500/20 p-3 rounded-2xl shadow-sm transition-all hover:shadow-md hover:bg-white/60 dark:hover:bg-gray-800/60 animate-fade-in-down">
						<div class="flex items-center gap-4">
							<div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
								<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
								</svg>
							</div>
							<div class="flex-1 min-w-0">
								<h4 class="text-xs font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider mb-0.5">Dossier incomplet</h4>
								<p class="text-sm text-rose-700/80 dark:text-rose-300/80 truncate">Des documents justificatifs sont encore manquants.</p>
							</div>
							<NuxtLink to="/profile/info" class="flex-shrink-0 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-rose-500/20 active:scale-95">
								Soumettre
							</NuxtLink>
						</div>
					</div>
				</div>

				<slot />
			</div>
		</main>
	</div>
</template>

<script setup lang="ts">
	import { useThemeStore } from "../../stores/theme";
	import { useLoginStore } from "../../stores/login";
	import { computed, onMounted, onUnmounted, watch } from "vue";

	const themeStore = useThemeStore();
	const loginStore = useLoginStore();

	const userData = computed(() => {
		try {
			if (process.client) {
				return JSON.parse(localStorage.getItem("user") || "{}");
			}
			return {};
		} catch {
			return {};
		}
	});

	const showNationaliteAlert = computed(() => {
		const user = userData.value;
		if (!user || !user.roles) return false;
		const isEnseignant = user.roles.some((r: any) => r.slug === 'enseignant' || r.slug === 'professeur');
		return isEnseignant && (!user.nationalite || user.nationalite.trim() === '');
	});

	const showNifAlert = computed(() => {
		const user = userData.value;
		if (!user || !user.roles) return false;
		const isEnseignant = user.roles.some((r: any) => r.slug === 'enseignant' || r.slug === 'professeur');
		if (!isEnseignant) return false;
		
		const isTogolais = user.nationalite === 'Togo' || user.nationalite === 'Togolaise';
		const hasNoValidNif = !user.nif || ['N/A', 'N/R', ''].includes(user.nif.trim().toUpperCase());
		
		return isTogolais && hasNoValidNif;
	});

	const showDocumentsAlert = computed(() => {
		const user = userData.value;
		if (!user || !user.roles) return false;
		const isEnseignant = user.roles.some((r: any) => r.slug === 'enseignant' || r.slug === 'professeur');
		if (!isEnseignant) return false;
		
		const missingDocs = !user.identity_document_url || !user.diploma_document_url || !user.cv_document_url;
		const isTogolais = user.nationalite === 'Togo' || user.nationalite === 'Togolaise';
		const missingNifDoc = isTogolais && !user.nif_document_url;
		
		return missingDocs || missingNifDoc;
	});

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
		background: #f5f3ff;
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
