export interface Notification {
	id: number;
	title: string;
	message: string;
	time: string; // Format relatif: "Il y a 4 mois", "Il y a 1 an"
	date: string; // Format date: "04 août 2025 06:42"
	read: boolean;
	type:
		| "info"
		| "warning"
		| "success"
		| "error"
		| "programmation"
		| "deprogrammation"
		| "note";
	details?: {
		evaluation?: string;
		salle?: string;
		date_evaluation?: string;
		heure_debut?: string;
		heure_fin?: string;
	};
}

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
