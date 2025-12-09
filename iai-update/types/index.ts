export interface MenuItem {
	id: string;
	title: string;
	icon?: string;
	path?: string;
	children?: MenuItem[];
	badge?: number;
	open?: boolean;
	// Nouveaux champs pour les sous-menus spécifiques
	subMenus?: Record<string, MenuItem[]>;
}

export interface ThemeSettings {
	mode: "light" | "dark" | "auto";
	contrast: "default" | "high";
	primaryColor: string;
	sidebarCaption: boolean;
	layout: "ltr" | "rtl";
	width: "full" | "container";
}
