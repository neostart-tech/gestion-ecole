<template>
	<header
		class="fixed top-0 right-0 z-40 bg-white dark:bg-gray-800 shadow-sm transition-all duration-300"
		:class="[sidebarOpen ? 'lg:left-64' : 'lg:left-20', 'left-0']"
	>
		<div class="flex items-center justify-between px-4 py-3">
			<!-- Left section -->
			<div class="flex items-center space-x-4">
				<!-- Burger menu -->
				<button
					@click="toggleSidebar"
					class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
			</div>

			<!-- Right section -->
			<div class="flex items-center space-x-4">
				<!-- Theme toggle -->
				<button
					@click="toggleTheme"
					class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
				>
					<svg
						v-if="themeStore.themeSettings.mode === 'dark'"
						class="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
						/>
					</svg>
					<svg
						v-else
						class="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
						/>
					</svg>
				</button>

				<!-- Settings -->
				<button
					@click="toggleSettings"
					class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
							d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
				</button>

				<!-- Notifications -->
				<button
					@click="toggleNotifications"
					class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 relative"
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
							d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
						/>
					</svg>
					<span
						v-if="notifications.length > 0"
						class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
					></span>
				</button>

				<!-- Profile dropdown -->
				<div class="relative">
					<button
						@click="toggleProfileDropdown"
						class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						<div
							class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300"
						>
							<span class="font-semibold">A</span>
						</div>
						<div class="hidden lg:block text-left">
							<p class="text-sm font-semibold text-gray-800 dark:text-gray-200">
								Admin Administrateur
							</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">
								admin@test.com
							</p>
						</div>
						<svg
							class="w-5 h-5 text-gray-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>

					<!-- Dropdown menu -->
					<div
						v-if="isProfileDropdownOpen"
						class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-200 dark:border-gray-700 z-50"
					>
						<div
							class="px-4 py-2 border-b border-gray-100 dark:border-gray-700"
						>
							<p class="text-sm font-semibold text-gray-800 dark:text-gray-200">
								Admin Administrateur
							</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">
								admin@test.com
							</p>
						</div>
						<a
							href="#"
							class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
						>
							Mon profil
						</a>
						<button
							@click="logout"
							class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
						>
							Me déconnecter
						</button>
					</div>
				</div>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
	import { useThemeStore } from "../../stores/theme";

	const themeStore = useThemeStore();
	const isProfileDropdownOpen = ref(false);
	const notifications = ref([1, 2, 3]); // Exemple de notifications
	const windowWidth = ref(0);

	const sidebarOpen = computed(() => {
		return windowWidth.value >= 1024 ? themeStore.isSidebarOpen : false;
	});

	const toggleSidebar = () => {
		if (windowWidth.value < 1024) {
			themeStore.toggleMobileSidebar();
		} else {
			themeStore.toggleSidebar();
		}
	};

	const toggleTheme = () => {
		const currentMode = themeStore.themeSettings.mode;
		const nextMode =
			currentMode === "light"
				? "dark"
				: currentMode === "dark"
				? "auto"
				: "light";
		themeStore.updateThemeSettings({ mode: nextMode });
	};

	const toggleSettings = () => {
		themeStore.toggleSettings();
	};

	const toggleNotifications = () => {
		// Implémenter la logique des notifications
		console.log("Toggle notifications");
	};

	const toggleProfileDropdown = () => {
		isProfileDropdownOpen.value = !isProfileDropdownOpen.value;
	};

	const closeProfileDropdown = () => {
		isProfileDropdownOpen.value = false;
	};

	const logout = () => {
		console.log("Déconnexion");
		// Implémenter la logique de déconnexion
	};

	// Fermer le dropdown si on clique ailleurs
	const handleClickOutside = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (!target.closest(".relative")) {
			closeProfileDropdown();
		}
	};

	// Mettre à jour la largeur de la fenêtre
	const updateWindowWidth = () => {
		if (typeof window !== "undefined") {
			windowWidth.value = window.innerWidth;
		}
	};

	onMounted(() => {
		// Initialiser la largeur de la fenêtre
		updateWindowWidth();

		// Écouter les changements de taille
		window.addEventListener("resize", updateWindowWidth);

		// Gérer les clics pour fermer le dropdown
		document.addEventListener("click", handleClickOutside);
	});

	onUnmounted(() => {
		window.removeEventListener("resize", updateWindowWidth);
		document.removeEventListener("click", handleClickOutside);
	});
</script>
