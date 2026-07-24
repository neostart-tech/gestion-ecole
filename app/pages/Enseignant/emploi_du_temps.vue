<template>
	<div
		class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8"
	>
		<div class="max-w-7xl mx-auto">
			<!-- Breadcrumb -->
			<Breadcrumb
				:items="[
					{ label: 'Accueil', to: '/' },
					{ label: 'Emploi du temps', to: null },
				]"
				title="Mon emploi du temps"
				:title-class="'text-xl md:text-2xl text-gray-800'"
				:spacing="'mb-2'"
				:link-color="'text-blue-600 hover:text-blue-800'"
				:active-color="'text-gray-900 font-medium'"
				:text-size="'text-base'"
				align="left"
			/>

			<!-- Sous-titre -->
			<p class="text-gray-600 mb-8">
				Gérez vos événements et réunions en toute simplicité
			</p>

			<!-- Calendar Container -->
			<div
				class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300"
			>
				<!-- Calendar Toolbar -->
				<div
					class="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white"
				>
					<div
						class="flex flex-col sm:flex-row sm:items-center justify-between"
					>
						<div class="mb-4 sm:mb-0">
							<h2 class="text-xl font-semibold text-gray-800">Calendrier</h2>
							<p class="text-sm text-gray-500">{{ currentMonth }}</p>
						</div>

						<div class="flex flex-wrap gap-2">
							<button
								@click="handleCreateEvent"
								class="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm whitespace-nowrap"
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
							<div class="h-8 bg-gray-200 rounded w-1/4"></div>
							<div class="grid grid-cols-7 gap-1 sm:gap-2">
								<div
									v-for="i in 7"
									:key="i"
									class="h-8 bg-gray-100 rounded"
								></div>
							</div>
							<div class="grid grid-cols-7 gap-1 sm:gap-2">
								<div
									v-for="i in 42"
									:key="i"
									class="h-16 sm:h-20 bg-gray-50 rounded"
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

      dayCellClassNames: (arg: any) => {
        // Logique simplifiée ici car pas de holidays chargés explicitement dans ce fichier spécifique
        return [];
      },

			eventClick: (info: any) => {
				console.log("Événement cliqué:", info.event.title);
			},

      eventContent: (arg: any) => {
        const type = arg.event.extendedProps?.type || "Cours";
        const title = arg.event.title || "";
        const viewType = arg.view.type;
        const isEval = type === "Évaluation";

        // Vue Liste
        if (viewType.startsWith("list")) {
          return {
            html: `
              <div style="display:flex;align-items:center;gap:6px;padding:2px 4px;">
                <span style="width:8px;height:8px;border-radius:50%;flex-shrink:0;background:${isEval ? '#f97316' : '#2563eb'}"></span>
                <span style="font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${title}</span>
              </div>
            `
          };
        }

        // Vue Mois — Design en "pilule" colorée
        if (viewType.startsWith("dayGrid")) {
          const isHoliday = type === "Jour Férié";
          const pillBg = isHoliday ? "#dc2626" : (isEval ? "#f97316" : "#3b82f6");
          
          return {
            html: `
              <div style="display:flex;align-items:center;padding:2px 8px;width:100%;background:${pillBg};border-radius:4px;overflow:hidden;margin:1px 0;">
                <span style="font-size:11px;font-weight:700;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;">${title}</span>
              </div>
            `
          };
        }

        // Vue Semaine / Jour — design premium
        const gradient = isEval ? "linear-gradient(135deg,#f97316,#ea580c)" : "linear-gradient(135deg,#2563eb,#1d4ed8)";
        const accent = isEval ? "rgba(251,146,60,0.4)" : "rgba(96,165,250,0.4)";

        return {
          html: `
            <div style="display:flex;flex-direction:column;padding:6px 8px;width:100%;height:100%;min-height:100%;background:${gradient};border-radius:6px;border:1px solid ${accent};box-shadow:0 1px 3px rgba(0,0,0,0.2);overflow:hidden;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;padding-bottom:3px;border-bottom:1px solid rgba(255,255,255,0.2);">
                <span style="font-size:9px;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.9);">${arg.timeText || ""}</span>
              </div>
              <div style="font-size:11px;font-weight:700;color:#fff;line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;">${title}</div>
            </div>
          `,
        };
      },
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

<style scoped>
:deep(.fc) {
  --fc-border-color: #e5e7eb;
  --fc-page-bg-color: #ffffff;
  --fc-list-event-hover-bg-color: #f3f4f6;
  --fc-today-bg-color: rgba(79, 70, 229, 0.05);
}

:deep(.dark .fc) {
  --fc-border-color: #374151;
  --fc-page-bg-color: #1f2937;
  --fc-list-event-hover-bg-color: #374151;
  --fc-neutral-bg-color: #111827;
  --fc-today-bg-color: rgba(79, 70, 229, 0.15);
}

:deep(.fc-toolbar-title) {
  font-size: 1.25rem !important;
  font-weight: 700 !important;
}

:deep(.dark .fc-toolbar-title) {
  color: #f9fafb;
}

:deep(.holiday-cell) {
  background-color: #fee2e2 !important;
}

:deep(.dark .holiday-cell) {
  background-color: rgba(220, 38, 38, 0.25) !important;
}

:deep(.fc-event) {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
}

:deep(.fc-v-event), :deep(.fc-h-event) {
  background-color: transparent !important;
  border: none !important;
}

:deep(.fc-event-main) {
  padding: 0 !important;
  color: white !important;
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
}
</style>
