import { defineStore } from "pinia";
import type { ThemeSettings } from "../types";

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
		toggleSidebar() {
			this.isSidebarOpen = !this.isSidebarOpen;
		},

		toggleMobileSidebar() {
			this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
		},

		updateThemeSettings(settings: Partial<ThemeSettings>) {
			this.themeSettings = { ...this.themeSettings, ...settings };
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
			this.applyTheme();
		},

		applyTheme() {
			// Mode sombre/clair
			if (
				this.themeSettings.mode === "dark" ||
				(this.themeSettings.mode === "auto" &&
					window.matchMedia("(prefers-color-scheme: dark)").matches)
			) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}

			// Couleur primaire
			document.documentElement.style.setProperty(
				"--color-primary",
				this.themeSettings.primaryColor,
			);

			// Direction du layout
			document.documentElement.setAttribute("dir", this.themeSettings.layout);
		},

		toggleSettings() {
			this.isSettingsOpen = !this.isSettingsOpen;
		},
	},
});
