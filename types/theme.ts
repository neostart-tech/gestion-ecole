// types/theme.ts
export interface ThemeSettings {
  mode: "light" | "dark" | "auto";
  contrast: "default" | "high";
  primaryColor: string;
  sidebarCaption: boolean;
  layout: "ltr" | "rtl";
  width: "full" | "container";
}