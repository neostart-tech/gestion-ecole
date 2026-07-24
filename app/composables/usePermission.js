// composables/usePermission.js
import { useState } from 'nuxt/app'; // Pour Nuxt 3

export const usePermission = () => {
  // Récupérer l'utilisateur depuis le state
  const user = useState('user');
  
  const can = (permission) => {
    if (!user.value) {
      console.warn('Aucun utilisateur connecté');
      return false;
    }

    // Vérifier si l'utilisateur a la permission
    const hasPermission = user.value.permissions?.includes(permission);
    
    // Log de débogage
    console.log(`Permission vérifiée: ${permission}`, {
      userRole: user.value.role,
      userPermissions: user.value.permissions,
      hasPermission: hasPermission
    });
    
    return hasPermission;
  };

  return { can };
};