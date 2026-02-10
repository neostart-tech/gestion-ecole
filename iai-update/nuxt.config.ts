import tailwindcss from "@tailwindcss/vite";
import Aura from '@primeuix/themes/aura';


export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	ssr: true,
	devtools: { enabled: false },
	modules: ["@pinia/nuxt",'@primevue/nuxt-module'],
	
	imports: {
		dirs: ["stores"],
	},
	
	css: [
		"~/assets/css/main.css",
		'~/assets/css/calendar.css',
	],
	
	// Ajoutez les plugins
	plugins: [
		'~/plugins/theme.client.ts',
		"~/plugins/toastr.client.js"
	],
	
	vite: {
		plugins: [tailwindcss()],
	},
	
	pinia: {
		storesDirs: ['stores/**'],
	},
	 primevue: {
        options: {
            ripple: true,
            inputVariant: 'filled',
            theme: {
                preset: Aura,
                options: {
                    prefix: 'p',
                    darkModeSelector: 'system',
                    cssLayer: false
                }
            }
        }
    }
});