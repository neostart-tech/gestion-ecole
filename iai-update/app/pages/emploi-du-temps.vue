<template>
	<div
		class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8 transition-colors duration-300"
	>
		<div class="max-w-7xl mx-auto">
			<!-- Breadcrumb -->
			<Breadcrumb
				:items="[
					{ label: 'Accueil', to: '/' },
					{ label: 'Emploi du temps', to: null },
				]"
				title="Mon emploi du temps"
				:title-class="'text-xl md:text-2xl text-gray-800 dark:text-white'"
				:spacing="'mb-2'"
				:link-color="'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'"
				:active-color="'text-gray-900 dark:text-gray-200 font-medium'"
				:text-size="'text-base'"
				align="left"
			/>

			<!-- Sous-titre -->
			<p class="text-gray-600 dark:text-gray-300 mb-8">
				Gérez vos événements et réunions en toute simplicité
			</p>

			<!-- Calendar Container -->
			<div
				class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300"
			>
				<!-- Calendar Toolbar -->
				<div
					class="px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-900"
				>
					<div
						class="flex flex-col sm:flex-row sm:items-center justify-between"
					>
						<div class="mb-4 sm:mb-0">
							<h2 class="text-xl font-semibold text-gray-800 dark:text-white">
								Calendrier
							</h2>
							<p class="text-sm text-gray-500 dark:text-gray-400">
								{{ currentMonth }}
							</p>
						</div>

						<div class="flex flex-wrap gap-2">
							<button
								@click="handleCreateEvent"
								class="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center shadow-sm whitespace-nowrap"
							>
								<svg
									class="w-4 h-4 sm:w-5 sm:h-5 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 4v16m8-8H4"
									/>
								</svg>
								<span class="hidden sm:inline">Nouvel événement</span>
								<span class="sm:hidden">Nouveau</span>
							</button>
						</div>
					</div>
				</div>

				<!-- Calendar -->
				<div class="p-2 sm:p-4 md:p-6">
					<ClientOnly>
						<FullCalendar
							v-if="showCalendar"
							ref="calendarRef"
							:options="calendarOptions"
							class="custom-calendar"
						/>
						<div v-else class="space-y-4 animate-pulse">
							<div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
							<div class="grid grid-cols-7 gap-1 sm:gap-2">
								<div
									v-for="i in 7"
									:key="i"
									class="h-8 bg-gray-100 dark:bg-gray-800 rounded"
								></div>
							</div>
							<div class="grid grid-cols-7 gap-1 sm:gap-2">
								<div
									v-for="i in 42"
									:key="i"
									class="h-16 sm:h-20 bg-gray-50 dark:bg-gray-900 rounded"
								></div>
							</div>
						</div>
					</ClientOnly>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted, computed } from "vue";
	import type { CalendarOptions } from "@fullcalendar/core";

	// Import du composant Breadcrumb
	import Breadcrumb from "~/components/Breadcrumb.vue";

	// Déclarer les types pour les imports dynamiques
	let FullCalendar: any = null;
	let dayGridPlugin: any = null;
	let timeGridPlugin: any = null;
	let listPlugin: any = null;
	let interactionPlugin: any = null;
	let frLocale: any = null;

	const showCalendar = ref(false);
	const calendarRef = ref();
	const calendarView = ref("dayGridMonth");

	const currentMonth = computed(() => {
		const date = new Date();
		return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
	});

	const viewTypes = [
		{ label: "Jour", value: "timeGridDay" },
		{ label: "Semaine", value: "timeGridWeek" },
		{ label: "Mois", value: "dayGridMonth" },
		{ label: "Liste", value: "listWeek" },
	];

	const upcomingEvents = [
		{
			id: 1,
			title: "Réunion d'équipe marketing",
			date: "15 Jan 2025",
			time: "09:00 - 10:30",
			type: "Réunion",
			color: "bg-blue-500",
		},
		{
			id: 2,
			title: "Présentation client",
			date: "16 Jan 2025",
			time: "14:00 - 15:30",
			type: "Présentation",
			color: "bg-green-500",
		},
		{
			id: 3,
			title: "Revue trimestrielle",
			date: "18 Jan 2025",
			time: "11:00 - 12:30",
			type: "Revue",
			color: "bg-purple-500",
		},
	];

	// Charger FullCalendar côté client seulement
	onMounted(async () => {
		// Vérifier si on est côté client
		if (typeof window !== "undefined") {
			try {
				// Importer FullCalendar et ses plugins
				const fullCalendarModule = await import("@fullcalendar/vue3");
				FullCalendar = fullCalendarModule.default;

				const dayGridModule = await import("@fullcalendar/daygrid");
				dayGridPlugin = dayGridModule.default;

				const timeGridModule = await import("@fullcalendar/timegrid");
				timeGridPlugin = timeGridModule.default;

				const listModule = await import("@fullcalendar/list");
				listPlugin = listModule.default;

				const interactionModule = await import("@fullcalendar/interaction");
				interactionPlugin = interactionModule.default;

				const localeModule = await import("@fullcalendar/core/locales/fr");
				frLocale = localeModule.default;

				showCalendar.value = true;
			} catch (error) {
				console.error("Erreur lors du chargement de FullCalendar:", error);
			}
		}
	});

	// Configuration du calendrier
	const calendarOptions = computed<CalendarOptions>(() => {
		if (!showCalendar.value) return {};

		return {
			plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
			initialView: calendarView.value,
			locale: frLocale,
			initialDate: "2025-01-01",
			height: "auto",
			headerToolbar: {
				left: "prev,next today",
				center: "title",
				right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
			},

			events: [
				{
					title: "Réunion Marketing",
					date: "2025-01-10",
					backgroundColor: "#3b82f6",
					borderColor: "#2563eb",
				},
				{
					title: "Présentation Client",
					date: "2025-01-14",
					backgroundColor: "#10b981",
					borderColor: "#059669",
				},
				{
					title: "Formation Technique",
					start: "2025-01-20",
					end: "2025-01-21",
					backgroundColor: "#f59e0b",
					borderColor: "#d97706",
				},
				{
					title: "Réunion Produit",
					date: "2025-01-22",
					backgroundColor: "#06b6d4",
					borderColor: "#0891b2",
				},
				{
					title: "Conférence",
					start: "2025-01-25",
					end: "2025-01-26",
					backgroundColor: "#8b5cf6",
					borderColor: "#7c3aed",
				},
			],

			selectable: true,
			editable: true,
			nowIndicator: true,
			dayMaxEvents: true,

			dateClick: (info: any) => {
				console.log("Date cliquée:", info.dateStr);
				alert(`Date cliquée: ${info.dateStr}`);
			},

			eventClick: (info: any) => {
				console.log("Événement cliqué:", info.event.title);
				alert(`Événement: ${info.event.title}`);
			},

			// Personnalisation
			eventColor: "#3b82f6",
			eventBackgroundColor: "#3b82f6",
			eventTextColor: "#ffffff",
		};
	});

	function changeView(view: string) {
		calendarView.value = view;
		if (calendarRef.value?.getApi) {
			try {
				const calendarApi = calendarRef.value.getApi();
				calendarApi.changeView(view);
			} catch (error) {
				console.error("Erreur lors du changement de vue:", error);
			}
		}
	}

	function handleCreateEvent() {
		alert("Fonctionnalité: Créer un nouvel événement");
	}
</script>

<style>
	/* Styles globaux pour FullCalendar */
	.custom-calendar {
		width: 100%;
		min-height: 500px;
	}

	@media (min-width: 640px) {
		.custom-calendar {
			min-height: 600px;
		}
	}

	.fc {
		--fc-border-color: #e5e7eb;
		--fc-button-bg-color: #3b82f6;
		--fc-button-border-color: #3b82f6;
		--fc-button-hover-bg-color: #2563eb;
		--fc-button-active-bg-color: #1d4ed8;
		--fc-button-text-color: white;
		--fc-today-bg-color: #eff6ff;
		--fc-page-bg-color: white;
		--fc-neutral-bg-color: #f9fafb;
		--fc-list-event-hover-bg-color: #f3f4f6;
	}

	/* Mode sombre pour FullCalendar */
	.dark .fc {
		--fc-border-color: #4b5563;
		--fc-button-bg-color: #3b82f6;
		--fc-button-border-color: #3b82f6;
		--fc-button-hover-bg-color: #2563eb;
		--fc-button-active-bg-color: #1d4ed8;
		--fc-today-bg-color: rgba(59, 130, 246, 0.2);
		--fc-page-bg-color: transparent;
		--fc-neutral-bg-color: #374151;
		--fc-list-event-hover-bg-color: #4b5563;
	}

	.fc .fc-toolbar-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
	}

	.dark .fc .fc-toolbar-title {
		color: #f3f4f6;
	}

	@media (min-width: 640px) {
		.fc .fc-toolbar-title {
			font-size: 1.25rem;
		}
	}

	.fc .fc-button {
		border-radius: 0.375rem;
		padding: 0.25rem 0.5rem;
		font-weight: 500;
		font-size: 0.75rem;
	}

	@media (min-width: 640px) {
		.fc .fc-button {
			padding: 0.375rem 0.75rem;
			font-size: 0.875rem;
		}
	}

	.fc .fc-daygrid-day-frame {
		min-height: 80px;
		padding: 2px;
	}

	@media (min-width: 640px) {
		.fc .fc-daygrid-day-frame {
			min-height: 100px;
			padding: 4px;
		}
	}

	.fc .fc-event {
		border-radius: 0.25rem;
		border: none;
		padding: 1px 4px;
		margin: 1px;
		font-size: 0.7rem;
		font-weight: 500;
	}

	@media (min-width: 640px) {
		.fc .fc-event {
			padding: 2px 6px;
			font-size: 0.75rem;
		}
	}

	.fc .fc-day-today {
		background-color: #eff6ff !important;
	}

	.dark .fc .fc-day-today {
		background-color: rgba(59, 130, 246, 0.2) !important;
	}

	.fc .fc-daygrid-day-number {
		font-weight: 500;
		color: #374151;
		padding: 2px 4px;
		font-size: 0.75rem;
	}

	.dark .fc .fc-daygrid-day-number {
		color: #e5e7eb;
	}

	@media (min-width: 640px) {
		.fc .fc-daygrid-day-number {
			padding: 4px;
			font-size: 0.875rem;
		}
	}

	.fc .fc-col-header-cell {
		background-color: #f9fafb;
		padding: 8px 2px;
		font-weight: 600;
		color: #374151;
		text-transform: uppercase;
		font-size: 0.7rem;
		border-bottom: 2px solid #e5e7eb;
	}

	.dark .fc .fc-col-header-cell {
		background-color: #374151;
		color: #e5e7eb;
		border-bottom-color: #4b5563;
	}

	@media (min-width: 640px) {
		.fc .fc-col-header-cell {
			padding: 12px 4px;
			font-size: 0.75rem;
		}
	}

	.fc .fc-daygrid-day {
		border: 1px solid #e5e7eb;
	}

	.dark .fc .fc-daygrid-day {
		border-color: #4b5563;
	}

	.fc .fc-daygrid-day:hover {
		background-color: #f9fafb;
	}

	.dark .fc .fc-daygrid-day:hover {
		background-color: #4b5563;
	}

	.fc .fc-daygrid-more-link {
		color: #3b82f6;
		font-weight: 500;
		font-size: 0.7rem;
	}

	.dark .fc .fc-daygrid-more-link {
		color: #60a5fa;
	}

	@media (min-width: 640px) {
		.fc .fc-daygrid-more-link {
			font-size: 0.75rem;
		}
	}

	.fc .fc-timegrid-slot {
		height: 2.5em;
		border-color: #e5e7eb;
	}

	.dark .fc .fc-timegrid-slot {
		border-color: #4b5563;
	}

	.fc .fc-list-event:hover td {
		background-color: #f3f4f6;
	}

	.dark .fc .fc-list-event:hover td {
		background-color: #4b5563;
	}

	/* Styles pour le tableau en mode sombre */
	.fc-theme-standard td,
	.fc-theme-standard th {
		border-color: #e5e7eb;
	}

	.dark .fc-theme-standard td,
	.dark .fc-theme-standard th {
		border-color: #4b5563;
	}

	/* Styles pour les événements en mode sombre */
	.fc .fc-event-main {
		color: #ffffff;
	}

	.fc .fc-event-main-frame {
		background-color: transparent;
	}

	/* Styles pour la vue liste en mode sombre */
	.fc-list {
		background-color: white;
	}

	.dark .fc-list {
		background-color: transparent;
	}

	.fc-list-day-cushion {
		background-color: #f9fafb;
	}

	.dark .fc-list-day-cushion {
		background-color: #374151;
		color: #e5e7eb;
	}

	/* Animation de skeleton en mode sombre */
	.dark .animate-pulse div {
		background-color: #374151;
	}

	.dark .animate-pulse .bg-gray-200 {
		background-color: #4b5563;
	}

	.dark .animate-pulse .bg-gray-100 {
		background-color: #374151;
	}

	.dark .animate-pulse .bg-gray-50 {
		background-color: #1f2937;
	}

	/* Personnalisation du bouton today */
	.fc .fc-button-primary:not(:disabled).fc-button-active,
	.fc .fc-button-primary:not(:disabled):active {
		background-color: var(--fc-button-active-bg-color);
		border-color: var(--fc-button-active-bg-color);
	}

	/* Personnalisation du header */
	.fc .fc-toolbar.fc-header-toolbar {
		margin-bottom: 1em;
		padding: 0.5em;
		border-radius: 0.5em;
		background-color: var(--fc-neutral-bg-color);
	}

	/* Ajustements responsive pour le mode sombre */
	@media (max-width: 640px) {
		.dark .fc .fc-toolbar-title {
			font-size: 1rem;
		}

		.dark .fc .fc-button {
			padding: 0.25rem 0.5rem;
			font-size: 0.7rem;
		}
	}

	/* Transition fluide pour le changement de thème */
	.fc * {
		transition: background-color 0.3s ease, border-color 0.3s ease,
			color 0.3s ease;
	}
</style>
