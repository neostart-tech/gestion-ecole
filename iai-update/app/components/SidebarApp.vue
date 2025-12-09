<template>
	<!-- Overlay mobile -->
	<div
		v-if="themeStore.isMobileSidebarOpen"
		@click="closeMobileSidebar"
		class="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
	></div>

	<!-- Sidebar -->
	<aside
		:class="[
			'fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-white dark:bg-gray-800 shadow-lg',
			themeStore.isSidebarOpen ? 'w-64' : 'w-20',
			themeStore.isMobileSidebarOpen
				? 'translate-x-0'
				: '-translate-x-full lg:translate-x-0',
		]"
	>
		<!-- Menu -->
		<div class="h-[calc(100vh)] overflow-y-auto py-4">
			<nav class="px-2">
				<!-- Section Admin -->
				<div class="mb-6">
					<div v-if="themeStore.isSidebarOpen" class="px-4 mb-2">
						<p
							class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
						>
							Administrateur
						</p>
					</div>

					<!-- Item Admin -->
					<SidebarItem
						:item="{
							title: 'Admin Administrateur',
							icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
							children: [{ title: 'Déconnexion', path: '/logout' }],
						}"
					/>
				</div>

				<!-- Menu items -->
				<div v-for="(section, index) in menuSections" :key="index" class="mb-6">
					<!-- Section title (seulement quand sidebar est ouverte) -->
					<div
						v-if="themeStore.isSidebarOpen && section.title"
						class="px-4 mb-2"
					>
						<p
							class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
						>
							{{ section.title }}
						</p>
					</div>

					<!-- Menu items -->
					<SidebarItem
						v-for="item in section.items"
						:key="item.id"
						:item="item"
					/>
				</div>
			</nav>
		</div>
	</aside>
</template>

<script setup lang="ts">
	import { useThemeStore } from "../../stores/theme";
	import SidebarItem from "./SidebarItem.vue";

	const themeStore = useThemeStore();

	const menuSections = [
		{
			title: "",
			items: [
				{
					id: "1",
					title: "Emploi du temps",
					icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
				},
				{
					id: "2",
					title: "Présences à valider",
					icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
					badge: 3,
				},
			],
		},
		{
			title: "Administration",
			items: [
				{
					id: "3",
					title: "Filières",
					icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
				},
				{
					id: "4",
					title: "Unités d'enseignement",
					icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
				},
				{
					id: "5",
					title: "Unité de valeur",
					icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
				},
				{
					id: "6",
					title: "Périodes",
					icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
				},
				{
					id: "7",
					title: "Gestion des salles",
					icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
				},
				{
					id: "8",
					title: "Gestion des Groupes",
					icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
				},
				{
					id: "9",
					title: "Rôles",
					icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
				},
				{
					id: "10",
					title: "Évaluations",
					icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
				},
				{
					id: "11",
					title: "Personnel",
					icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0a4 4 0 110 5.392M9 21h6",
				},
			],
		},
		{
			title: "Candidatures",
			items: [
				{
					id: "12",
					title: "Candidatures",
					icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
				},
			],
		},
		{
			title: "Autres",
			items: [
				{
					id: "13",
					title: "Galerie",
					icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
				},
				{
					id: "14",
					title: "Messages",
					icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
					badge: 1,
				},
				{
					id: "15",
					title: "Réclamations",
					icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z",
				},
				{
					id: "16",
					title: "Publications",
					icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
				},
				{
					id: "17",
					title: "Évènements",
					icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
				},
				{
					id: "18",
					title: "Partenaires",
					icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
				},
				{
					id: "19",
					title: "Opportunités",
					icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
				},
			],
		},
	];

	const closeMobileSidebar = () => {
		themeStore.isMobileSidebarOpen = false;
	};
</script>
