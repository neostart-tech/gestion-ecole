// Configuration des permissions par rôle
export const rolePermissions = {
  // Rôles administratifs
  'responsable-du-site': ['*'], // Accès à tout
  'admin': ['*'], // Accès à tout
  'directeur-general-adjoint': ['*'], // Accès à tout
    'directeur-general': ['*'], // Accès à tout

  
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
    '/publications/*',
    '/notifications/*',
    'admin/*',
    'année-scolaire/*',
    'periodes/*',
    'parcours/*',
    'annonces/*',
    'statistiques/*'
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
    '/evenements/*',
    '/notifications/*'
  ],
  
  'surveillant': [
    '/',
    '/profile/*',
    '/reclamations/*',
    '/presences/*',
    '/emploi-du-temps/*',
    '/groupes/*',
    '/admin/liste-des-etudiants',
    '/notifications/*'
  ],
  
  'professeur': [
    '/',
    '/profile/*',
    '/emploi-du-temps/*',
    '/presences/*',
    '/notifications/*',
    '/annonces/*',
    '/statistiques/*',
    
  ],
  
  // Rôles financiers
  'responsable-administratif-et-financier': [
    '/',
    '/profile/*',
    '/messages/*',
    '/finance/*',
    '/frais-de-scolarite/*',
    '/bourses/*',
    '/personnel/*',
    '/notifications/*'
  ],
  
  // Rôles logistiques
  'responsable-des-achats-et-de-la-logistique': [
    '/',
    '/profile/*',
    '/messages/*',
    '/salles/*',
    '/evenements/*',
    '/notifications/*'
  ],
  
  // Rôles communication
  'charge-de-la-clientele': [
    '/',
    '/profile/*',
    '/messages/*',
    '/reclamations/*',
    '/presences/*',
    '/publications/*',
    '/emploi-du-temps/*',
    '/notifications/*'
  ],
  
  'responsable-marketing': [
    '/',
    '/profile/*',
    '/emploi-du-temps/*',
    '/publications/*',
    '/evenements/*',
    '/partenaires/*',
    '/opportunites/*',
    '/notifications/*'
  ],
  
  // Rôles techniques
  'informaticien': [
    '/',
    '/profile/*',
    '/reclamations/*',
    '/presences/*',
    '/personnel/*',
    '/logs',
    '/notifications/*'
  ],
  
  // Étudiants
  'etudiant': [
    '/',
    '/profile/*',
    '/etudiant/*',
    '/emploi-du-temps/*',
    '/messages/*',
    '/notifications/*'
  ],
  
  // Utilisateur simple
  'utilisateur-de-la-plateforme': [
    '/',
    '/profile/*',
    '/messages/*',
    '/notifications/*'
  ],
  
  'stagiaire-academie': [
    '/',
    '/profile/*',
    '/messages/*',
    '/presences/*',
    '/notifications/*'
  ]
};

// Routes publiques (accessibles sans authentification)
export const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/notifications/*'
];

// Routes interdites pour les utilisateurs connectés (comme login)
export const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/notifications/*'
];