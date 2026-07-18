import tailwindcss from "@tailwindcss/vite";
import Aura from "@primeuix/themes/aura";

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	ssr: false,
	devtools: { enabled: false },
	modules: ["@pinia/nuxt", "@primevue/nuxt-module"],

	imports: {
		dirs: ["stores"],
	},

	css: ["~/assets/css/main.css", "~/assets/css/calendar.css",'~/assets/css/calendarstyle.css','flag-icons/css/flag-icons.min.css'],

	// Ajoutez les plugins
	plugins: ["~/plugins/theme.client.ts", "~/plugins/toastr.client.js"],

	vite: {
		plugins: [tailwindcss()],
	},

	pinia: {
		storesDirs: ["stores/**"],
	},

	primevue: {
		options: {
			ripple: true,
			inputVariant: "filled",
			theme: {
				preset: Aura,
				options: {
					prefix: "p",
					// Aligné sur la classe que stores/theme.ts bascule déjà sur <html> :
					// avant, `false` désactivait purement et simplement les variables CSS
					// de mode sombre pour tous les composants PrimeVue (Dropdown,
					// MultiSelect, InputText, ...), qui restaient donc toujours clairs
					// même quand le reste de l'application passait en sombre.
					darkModeSelector: ".dark",
					cssLayer: false,
				},
			},
		},
	},

	app: {
		head: {
			link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
		},
	},
});
