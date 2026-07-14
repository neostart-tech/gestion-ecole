import { defineStore } from "pinia";

export interface ThemeSettings {
	mode: "light" | "dark" | "auto";
	contrast: "default" | "high";
	primaryColor: string;
	sidebarCaption: boolean;
	layout: "ltr" | "rtl";
	width: "full" | "container";
}

export const useThemeStore = defineStore("theme", {
	state: () => ({
		isSidebarOpen: true,
		isMobileSidebarOpen: false,
		themeSettings: {
			// "auto" par défaut : tant que l'utilisateur n'a pas choisi explicitement
			// un mode dans l'application, celle-ci doit suivre la préférence de son
			// système d'exploitation (clair/sombre), partout et pas seulement sur le topbar.
			mode: "auto",
			contrast: "default",
			primaryColor: "#3b82f6",
			sidebarCaption: true,
			layout: "ltr",
			width: "full",
		} as ThemeSettings,
		isSettingsOpen: false,
	}),

	actions: {
		// Charger l'état depuis localStorage
		loadState() {
			if (typeof window === "undefined") return;

			try {
				const saved = localStorage.getItem("theme-state");
				if (saved) {
					const parsed = JSON.parse(saved);
					if (parsed.themeSettings) {
						this.themeSettings = parsed.themeSettings;
					}
					if (parsed.isSidebarOpen !== undefined) {
						this.isSidebarOpen = parsed.isSidebarOpen;
					}
				}

				// Toujours appliquer, même sans préférence sauvegardée, pour que le
				// mode "auto" par défaut soit effectif dès le premier chargement.
				this.applyTheme();
			} catch (error) {
				console.warn("Failed to load theme state:", error);
			}
		},

		// Sauvegarder l'état
		saveState() {
			if (typeof window === "undefined") return;

			try {
				const state = {
					themeSettings: this.themeSettings,
					isSidebarOpen: this.isSidebarOpen,
				};
				localStorage.setItem("theme-state", JSON.stringify(state));
			} catch (error) {
				console.warn("Failed to save theme state:", error);
			}
		},

		toggleSidebar() {
			this.isSidebarOpen = !this.isSidebarOpen;
			this.saveState();
		},

		toggleMobileSidebar() {
			this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
		},

		updateThemeSettings(settings: Partial<ThemeSettings>) {
			this.themeSettings = { ...this.themeSettings, ...settings };
			this.saveState();
			this.applyTheme();
		},

		resetLayout() {
			this.themeSettings = {
				mode: "auto",
				contrast: "default",
				primaryColor: "#3b82f6",
				sidebarCaption: true,
				layout: "ltr",
				width: "full",
			};
			this.saveState();
			this.applyTheme();
		},

		// Méthode pour appliquer le thème
		applyTheme() {
			if (typeof window === "undefined") return;

			const html = document.documentElement;
			const root = document.documentElement;

			// Déterminer si on doit être en mode sombre
			const shouldBeDark = this.shouldBeDark();

			if (shouldBeDark) {
				html.classList.add("dark");
				console.log("🌙 Mode sombre appliqué");
			} else {
				html.classList.remove("dark");
				console.log("☀️ Mode clair appliqué");
			}

			// Appliquer la direction
			html.setAttribute("dir", this.themeSettings.layout);

			// 🔥 CRITIQUE : Appliquer la couleur principale dynamiquement
			this.applyPrimaryColor();

			// Débogage
			console.log("Mode configuré:", this.themeSettings.mode);
			console.log("Devrait être sombre:", shouldBeDark);
			console.log("Classe dark présente:", html.classList.contains("dark"));
			console.log("Couleur primaire:", this.themeSettings.primaryColor);
		},

		// Appliquer la couleur principale dynamiquement
		applyPrimaryColor() {
			const root = document.documentElement;
			
			// Créer ou mettre à jour la variable CSS personnalisée
			root.style.setProperty('--color-primary-50', this.lightenColor(this.themeSettings.primaryColor, 0.9));
			root.style.setProperty('--color-primary-100', this.lightenColor(this.themeSettings.primaryColor, 0.8));
			root.style.setProperty('--color-primary-200', this.lightenColor(this.themeSettings.primaryColor, 0.6));
			root.style.setProperty('--color-primary-300', this.lightenColor(this.themeSettings.primaryColor, 0.4));
			root.style.setProperty('--color-primary-400', this.lightenColor(this.themeSettings.primaryColor, 0.2));
			root.style.setProperty('--color-primary-500', this.themeSettings.primaryColor);
			root.style.setProperty('--color-primary-600', this.darkenColor(this.themeSettings.primaryColor, 0.1));
			root.style.setProperty('--color-primary-700', this.darkenColor(this.themeSettings.primaryColor, 0.2));
			root.style.setProperty('--color-primary-800', this.darkenColor(this.themeSettings.primaryColor, 0.3));
			root.style.setProperty('--color-primary-900', this.darkenColor(this.themeSettings.primaryColor, 0.4));
			root.style.setProperty('--color-primary-950', this.darkenColor(this.themeSettings.primaryColor, 0.5));

			// Appliquer aussi pour le mode sombre
			root.style.setProperty('--color-primary-dark-50', this.lightenColor(this.themeSettings.primaryColor, 0.1));
			root.style.setProperty('--color-primary-dark-100', this.themeSettings.primaryColor);
			root.style.setProperty('--color-primary-dark-200', this.darkenColor(this.themeSettings.primaryColor, 0.1));
			root.style.setProperty('--color-primary-dark-300', this.darkenColor(this.themeSettings.primaryColor, 0.2));
			root.style.setProperty('--color-primary-dark-400', this.darkenColor(this.themeSettings.primaryColor, 0.3));
			root.style.setProperty('--color-primary-dark-500', this.darkenColor(this.themeSettings.primaryColor, 0.4));
			root.style.setProperty('--color-primary-dark-600', this.darkenColor(this.themeSettings.primaryColor, 0.5));
			root.style.setProperty('--color-primary-dark-700', this.darkenColor(this.themeSettings.primaryColor, 0.6));
			root.style.setProperty('--color-primary-dark-800', this.darkenColor(this.themeSettings.primaryColor, 0.7));
			root.style.setProperty('--color-primary-dark-900', this.darkenColor(this.themeSettings.primaryColor, 0.8));
		},

		// Helper pour éclaircir une couleur
		lightenColor(color: string, factor: number): string {
			const hex = color.replace('#', '');
			const r = parseInt(hex.substring(0, 2), 16);
			const g = parseInt(hex.substring(2, 4), 16);
			const b = parseInt(hex.substring(4, 6), 16);
			
			const newR = Math.min(255, Math.round(r + (255 - r) * factor));
			const newG = Math.min(255, Math.round(g + (255 - g) * factor));
			const newB = Math.min(255, Math.round(b + (255 - b) * factor));
			
			return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
		},

		// Helper pour assombrir une couleur
		darkenColor(color: string, factor: number): string {
			const hex = color.replace('#', '');
			const r = parseInt(hex.substring(0, 2), 16);
			const g = parseInt(hex.substring(2, 4), 16);
			const b = parseInt(hex.substring(4, 6), 16);
			
			const newR = Math.max(0, Math.round(r * (1 - factor)));
			const newG = Math.max(0, Math.round(g * (1 - factor)));
			const newB = Math.max(0, Math.round(b * (1 - factor)));
			
			return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
		},

		// Déterminer si on doit être en mode sombre
		shouldBeDark(): boolean {
			const { mode } = this.themeSettings;

			if (mode === "dark") return true;
			if (mode === "light") return false;

			// Mode auto - utiliser la préférence système
			if (typeof window !== "undefined") {
				return window.matchMedia("(prefers-color-scheme: dark)").matches;
			}

			return false;
		},

		toggleSettings() {
			this.isSettingsOpen = !this.isSettingsOpen;
		},
	},
});
