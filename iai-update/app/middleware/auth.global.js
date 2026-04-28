import { useLoginStore } from "~~/stores/login";
import { publicRoutes, authRoutes } from "~~/configuration/permissions";

export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return;

  const authStore = useLoginStore();
  const isAuthenticated = authStore.isAuthenticated();

  // Routes publiques - toujours accessibles
  if (publicRoutes.includes(to.path) || to.path.startsWith('/actualites')) {
    // Si l'utilisateur est connecté et essaie d'aller sur login, rediriger
    if (isAuthenticated && authRoutes.includes(to.path)) {
      return navigateTo('/');
    }
    return;
  }

  // Routes protégées - nécessitent authentification
  if (!isAuthenticated) {
    return navigateTo('/login');
  }
});