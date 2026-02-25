import { useLoginStore } from "~~/stores/login";
import { rolePermissions } from "~~/configuration/permissions";

export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return;

  const authStore = useLoginStore();
  
  if (!authStore.isAuthenticated()) {
    return;
  }

  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/unauthorized'];
  if (publicRoutes.includes(to.path)) {
    return;
  }

  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userRoles = userData?.roles || [];
  
  // Vérifier si l'utilisateur a un rôle avec accès total
  const hasFullAccess = userRoles.some(role => 
    ['responsable-du-site', 'admin', 'directeur-general-adjoint','directeur-general'].includes(role.slug)
  );

  // REDIRECTION SPÉCIALE POUR LA PAGE D'ACCUEIL (/)
  if (to.path === '/') {
    // Si l'utilisateur n'a pas accès total, rediriger vers sa page spécifique
    if (!hasFullAccess) {
      // Étudiant
      if (userRoles.some(role => role.slug === 'etudiant')) {
        return navigateTo('/emploi-du-temps');
      }
      
      // Professeur
      if (userRoles.some(role => role.slug === 'enseignant')) {
        return navigateTo('/emploi-du-temps');
      }
      
      // Autres rôles sans accès total
      // Vous pouvez ajouter d'autres redirections ici
    }
  }

  if (hasFullAccess) {
    return; // Accès autorisé à tout
  }

  // Vérifier les permissions pour chaque rôle
  const hasAccess = userRoles.some(role => {
    const permissions = rolePermissions[role.slug];
    if (!permissions) return false;
    
    return permissions.some(pattern => {
      if (pattern === '*') return true;
      if (pattern === to.path) return true;
      
      if (pattern.endsWith('/*')) {
        const basePath = pattern.slice(0, -2);
        return to.path.startsWith(basePath);
      }
      
      return false;
    });
  });

  if (!hasAccess) {
    const {$toastr}=useNuxtApp()
    $toastr.error(`Accès refusé car vous n'avez pas la permission d'accéder à cette page!`);
    // console.log(`Accès refusé pour ${to.path} - redirection`);
    
    // Rediriger vers la page appropriée selon le rôle
    if (userRoles.some(role => role.slug === 'etudiant')) {
      return navigateTo('/emploi-du-temps');
    }
    if (userRoles.some(role => role.slug === 'professeur')) {
      return navigateTo('/emploi-du-temps');
    }
    
    return navigateTo('/unauthorized');
  }
});