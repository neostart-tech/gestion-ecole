// Configuration des permissions par rôle
export const rolePermissions = {
  // Rôles administratifs
  'responsable-du-site': ['*'], // Accès à tout
  'admin': ['*'], // Accès à tout
  'directeur-general-adjoint': ['*'], // Accès à tout
  
  // Rôles académiques
  'directeur-academique': [
    '/',
    '/profile/*',
    '/messages/*',
    '/reclamations/*',
    '/presences/*',
    '/emploi-du-temps/*',
    '/filieres/*',
    '/ues/*',
    '/uvs/*',
    '/evaluations/*',
    '/salles/*',
    '/groupes/*',
    '/admin/liste-des-etudiants',
    '/annee-scolaire/*',
    '/personnel/*',
    '/publications/*'
  ],
  
  'logiticien-academique': [
    '/',
    '/profile/*',
    '/messages/*',
    '/presences/*',
    '/emploi-du-temps/*',
    '/salles/*',
    '/groupes/*',
    '/admin/liste-des-etudiants',
    '/evenements/*'
  ],
  
  'surveillant': [
    '/',
    '/profile/*',
    '/reclamations/*',
    '/presences/*',
    '/emploi-du-temps/*',
    '/groupes/*',
    '/admin/liste-des-etudiants'
  ],
  
  'professeur': [
    '/',
    '/profile/*',
    '/emploi-du-temps/*',
    '/presences/*'
  ],
  
  // Rôles financiers
  'responsable-administratif-et-financier': [
    '/',
    '/profile/*',
    '/messages/*',
    '/finance/*',
    '/frais-de-scolarite/*',
    '/bourses/*',
    '/personnel/*'
  ],
  
  // Rôles logistiques
  'responsable-des-achats-et-de-la-logistique': [
    '/',
    '/profile/*',
    '/messages/*',
    '/salles/*',
    '/evenements/*'
  ],
  
  // Rôles communication
  'charge-de-la-clientele': [
    '/',
    '/profile/*',
    '/messages/*',
    '/reclamations/*',
    '/presences/*',
    '/publications/*',
    '/emploi-du-temps/*'
  ],
  
  'responsable-marketing': [
    '/',
    '/profile/*',
    '/emploi-du-temps/*',
    '/publications/*',
    '/evenements/*',
    '/partenaires/*',
    '/opportunites/*'
  ],
  
  // Rôles techniques
  'informaticien': [
    '/',
    '/profile/*',
    '/reclamations/*',
    '/presences/*',
    '/personnel/*',
    '/logs'
  ],
  
  // Étudiants
  'etudiant': [
    '/',
    '/profile/*',
    '/etudiant/*',
    '/emploi-du-temps/*',
    '/messages/*'
  ],
  
  // Utilisateur simple
  'utilisateur-de-la-plateforme': [
    '/',
    '/profile/*',
    '/messages/*'
  ],
  
  'stagiaire-academie': [
    '/',
    '/profile/*',
    '/messages/*',
    '/presences/*'
  ]
};

// Routes publiques (accessibles sans authentification)
export const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password'
];

// Routes interdites pour les utilisateurs connectés (comme login)
export const authRoutes = [
  '/login',
  '/register',
  '/forgot-password'
];