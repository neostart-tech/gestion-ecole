import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	ssr: true,
	devtools: { enabled: false },
	modules: ["@pinia/nuxt"],
	imports: {
		dirs: ["stores"],
	},
	css: ["./app/assets/css/main.css"],
	vite: {
		plugins: [tailwindcss()],
	},
});
