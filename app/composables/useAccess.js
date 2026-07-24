import { useState } from "#app";

// Système de permissions dynamique : les permissions effectives de l'utilisateur
// viennent du backend (calculées à partir des rôles réellement assignés en base,
// voir User::effectivePermissionSlugs() côté API), pas d'un mapping codé en dur ici.
// Le champ `user.value.permissions` est renvoyé par /login et /user.
export const useAccess = () => {
  const user = useState("user");
  const userLoaded = useState("userLoaded"); // indique si le user est déjà chargé

  const can = (permission) => {
    // bloquer tant que le user n'est pas chargé
    if (!userLoaded.value || !user.value) {
      return false;
    }

    const permissions = user.value.permissions || [];
    return permissions.includes(permission);
  };

  return { can };
};