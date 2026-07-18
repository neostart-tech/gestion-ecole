import { useLoginStore } from "~~/stores/login";
import { publicRoutes, authRoutes } from "~~/configuration/permissions";

export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return;

  // L'espace candidat a son propre système d'authentification (token distinct,
  // sans lien avec la connexion staff/étudiant) — géré par son propre middleware.
  // "/candidat" est un préfixe de "/candidatures" (pages staff) : il faut exiger
  // un "/" après pour ne pas les exclure par erreur de la vérification d'auth.
  if (to.path === '/candidat' || to.path.startsWith('/candidat/')) return;

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