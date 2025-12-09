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
			mode: "light",
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

					// Appliquer immédiatement
					this.applyTheme();
				}
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
				mode: "light",
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

			// Débogage
			console.log("Mode configuré:", this.themeSettings.mode);
			console.log("Devrait être sombre:", shouldBeDark);
			console.log("Classe dark présente:", html.classList.contains("dark"));
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
