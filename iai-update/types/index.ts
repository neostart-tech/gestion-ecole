export interface MenuItem {
	id: string;
	title: string;
	icon?: string;
	path?: string;
	children?: MenuItem[];
	badge?: number;
	open?: boolean;
}

export interface ThemeSettings {
	mode: "light" | "dark" | "auto";
	contrast: "default" | "high";
	primaryColor: string;
	sidebarCaption: boolean;
	layout: "ltr" | "rtl";
	width: "full" | "container";
}
