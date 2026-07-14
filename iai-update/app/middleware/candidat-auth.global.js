import { useCandidatAuthStore } from "~~/stores/candidatAuth";

// Protège l'espace candidat (/candidat/*) avec son propre token, indépendamment
// de l'authentification staff/étudiant (gérée par auth.global.js/role.global.js,
// qui s'excluent explicitement de ce préfixe).
export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return;
  // "/candidat" est un préfixe littéral de "/candidatures" (candidatures/etude-dossier,
  // /candidatures/admis, ...) : un simple startsWith("/candidat") matche donc aussi ces
  // routes staff par erreur, et redirigeait un directeur académique vers /candidat/login.
  // On exige un "/" après pour ne matcher que l'espace candidat lui-même.
  if (!(to.path === "/candidat" || to.path.startsWith("/candidat/"))) return;

  // Pages publiques de l'espace candidat : connexion et réinitialisation de
  // mot de passe (accédée depuis un lien reçu par email, sans être connecté).
  const publicCandidatPaths = ["/candidat/login", "/candidat/mot-de-passe-oublie", "/candidat/reinitialiser-mot-de-passe"];
  if (publicCandidatPaths.includes(to.path)) {
    return;
  }

  const candidatAuthStore = useCandidatAuthStore();
  if (!candidatAuthStore.isAuthenticated()) {
    return navigateTo("/candidat/login");
  }
});
