import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	ssr: true,
	devtools: { enabled: false },
	modules: ["@pinia/nuxt"],
	
	imports: {
		dirs: ["stores"],
	},
	
	css: [
		"~/assets/css/main.css",
	],
	
	// Ajoutez les plugins
	plugins: [
		'~/plugins/theme.client.ts'
	],
	
	vite: {
		plugins: [tailwindcss()],
	},
	
	pinia: {
		storesDirs: ['stores/**'],
	},
});