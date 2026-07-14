import { useState } from "#app";
import { roleAccess } from "~/utils/roleAccess";

export const useAccess = () => {
  const user = useState("user");
  const userLoaded = useState("userLoaded"); // indique si le user est déjà chargé

  const can = (permission) => {
    // bloquer tant que le user n’est pas chargé
    if (!userLoaded.value) {
      console.log("[useAccess] User pas encore chargé, retour false pour:", permission);
      return false;
    }

    if (!user.value) {
      console.log("[useAccess] Pas d'utilisateur connecté");
      return false;
    }

    // Récupération des rôles
    const roles = user.value.roles?.map((r) => r.slug) || [];
    console.log("[useAccess] Rôles de l'utilisateur:", roles);

    // Fusion des permissions de tous les rôles
    const permissions = new Set(
      roles.flatMap(role => {
        const perms = roleAccess[role] || [];
        console.log(`[useAccess] Permissions pour le rôle "${role}":`, perms);
        return perms;
      })
    );

    const result = permissions.has(permission);
    console.log(`[useAccess] Vérification permission "${permission}":`, result);
    console.log("[useAccess] Toutes les permissions de l'utilisateur:", Array.from(permissions));

    return result;
  };

  return { can };
};