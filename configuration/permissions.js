// Configuration des permissions par rôle
export const rolePermissions = {
  // Rôles administratifs
  admin: ["*"], // Accès à tout
  "directeur-general-adjoint": ["*"], // Accès à tout
  "directeur-general": ["*"], // Accès à tout
  informaticien: ["*"],

  // Rôles académiques
  "directeur-academique": [
    "/",
    "/profile/*",
    "/messages/*",
    "/reclamations/*",
    "/presences/*",
    "/emploi-du-temps/*",
    "/filieres/*",
    "/ues/*",
    "/uvs/*",
    "/evaluations/*",
    "/salles/*",
    "/groupes/*",
    "/admin/liste-des-etudiants",
    "/admin/jours-feries",
    "/admin/releves-globaux/*",
    "/admin/liste-des-releves/*",
    "/admin/etudiants/cartes",
    "/annee-scolaire/*",
    "/notifications/*",
    "/candidatures/etude-dossier",
    "/candidatures/*",
    "/periodes/*",
    "/parcours/*",
    "/statistiques/*",
    "/chat/*",
    "/evaluations/professeur/mes-examens",
    "/personnel/*",
    "/parametre/*",
  ],

  "logiticien-academique": [
    "/",
    "/profile/*",
    "/messages/*",
    "/presences/*",
    "/emploi-du-temps/*",
    "/salles/*",
    "/groupes/*",
    "/admin/liste-des-etudiants",
    "/admin/jours-feries",
    "/admin/releves-globaux/*",
    "/admin/liste-des-releves/*",
    "/admin/etudiants/cartes",
    "/candidatures/etude-dossier",
    "/candidatures/*",
    "/personnel/*",
    "/parametre/*",
    "/periodes/*",
    "/evenements/*",
    "/notifications/*",
    "/chat/*",
    "/evaluations/professeur/mes-examens",
  ],

  surveillant: [
    "/",
    "/profile/*",
    "/reclamations/*",
    "/presences/*",
    "/emploi-du-temps/*",
    "/groupes/*",
    "/admin/liste-des-etudiants",
    "/notifications/*",
    "/chat/*",
  ],

  enseignant: [
    "/",
    "/profile/*",
    "/emploi-du-temps/*",
    "/presences/*",
    "/notifications/*",
    "/statistiques/*",
    "/chat/*",
    "/evaluations/professeur/mes-programmations",
    "/evaluations/professeur/detail-examen/*",
    "/enseignant/syllabuses/*",
    "/evaluations/examen-en-ligne/*",
  ],

  // Rôles financiers
  "responsable-administratif-et-financier": [
    "/",
    "/emploi-du-temps/*",
    "/profile/*",
    "/messages/*",
    "/finance/*",
    "/frais-de-scolarite/*",
    "/bourses/*",
    "/personnel/*",
    "/notifications/*",
    "/chat/*",
    "/admin/*",
  ],

  "directeur-des-affaires-financieres": [
    "/",
    "/profile/*",
    "/messages/*",
    "/finance/*",
    "/frais-de-scolarite/*",
    "/emploi-du-temps/*",
    "/bourses/*",
    "/personnel/*",
    "/notifications/*",
    "/chat/*",
    "/admin/*",
  ],

  // Rôles logistiques
  "responsable-des-achats-et-de-la-logistique": [
    "/",
    "/profile/*",
    "/messages/*",
    "/salles/*",
    "/evenements/*",
    "/notifications/*",
    "/chat/*",
  ],

  // Rôles communication
  "charge-de-la-clientele": [
    "/",
    "/profile/*",
    "/messages/*",
    "/reclamations/*",
    "/presences/*",
    "/emploi-du-temps/*",
    "/notifications/*",
    "/chat/*",
    "/finance/*",
    "/frais-de-scolarite/*",
    "/bourses/*",
    "/annonces",
    "/admin/liste-des-etudiants",
    "/frais-inscription/*",
    "/admin/negociations/*",
    "/admin/paiements/*",
    "/admin/etudiants/situation",
    "/admin/prospects",
    "/admin/candidatures/inscription",
    "/candidatures/*",
    "/candidatures/admis",
    "/admin/etudiants/reinscription",
    "/annee-scolaire/*",
    "/parametre/*",
  ],

  "responsable-marketing": [
    "/profile/*",
    "/emploi-du-temps/*",
    "/publications/*",
    "/evenements/*",
    "/partenaires/*",
    "/opportunites/*",
    "/notifications/*",
    "/info-urgente/*",
    "/chat/*",
    "/annonces",
    "/admin/communications/*",
  ],

  // Rôles administratifs/support
  secretaires: [
    "/",
    "/profile/*",
    "/messages/*",
    "/reclamations/*",
    "/presences/*",
    "/emploi-du-temps/*",
    "/admin/liste-des-etudiants",
    "/notifications/*",
    "/chat/*",
  ],

  "charge-de-la-reprographie": [
    "/",
    "/profile/*",
    "/messages/*",
    "/evenements/*",
    "/notifications/*",
    "/chat/*",
  ],

  // Rôles pédagogiques
  "titulaire-dune-classe": [
    "/",
    "/profile/*",
    "/emploi-du-temps/*",
    "/presences/*",
    "/groupes/*",
    "/notifications/*",
    "/chat/*",
  ],

  // Rôles étudiants/communautaires
  "membre-du-comite-etudiant": [
    "/",
    "/profile/*",
    "/messages/*",
    "/emploi-du-temps/*",
    "/evenements/*",
    "/notifications/*",
    "/chat/*",
  ],

  // Rôles parents
  parent: [
    "/",
    "/profile/*",
    "/emploi-du-temps/*",
    "/presences/*",
    "/messages/*",
    "/notifications/*",
    "/chat/*",
  ],

  // Rôles commerciaux
  "collaborateur-commercial": [
    "/",
    "/profile/*",
    "/messages/*",
    "/partenaires/*",
    "/opportunites/*",
    "/notifications/*",
    "/chat/*",
  ],

  // Étudiants
  etudiant: [
    "/profile/*",
    "/etudiant/*",
    "/emploi-du-temps/*",
    "/messages/*",
    "/notifications/*",
    "/chat/*",
    "/evaluations/etudiant/*",
    "/evaluations/examen-en-ligne/*",
    '/actualites/*',
    "/annonces",
    "/etudiant/syllabuses/*",
  ],

  delegue: [
    "/profile/*",
    "/etudiant/*",
    "/emploi-du-temps/*",
    "/messages/*",
    "/notifications/*",
    "/chat/*",
    "/presences/*",
    "/evaluations/etudiant/*",
    "/evaluations/examen-en-ligne/*",
    '/actualites/*',
    "/annonces",
    "/etudiant/syllabuses/*",
  ],

  // Utilisateur simple
  "utilisateur-de-la-plateforme": [
    "/",
    "/profile/*",
    "/messages/*",
    "/notifications/*",
    "/chat/*",
  ],

  "stagiaire-academie": [
    "/",
    "/profile/*",
    "/messages/*",
    "/presences/*",
    "/notifications/*",
    "/chat/*",
  ],
};

// Routes publiques (accessibles sans authentification)
export const publicRoutes = [
  "/login",
  "/register",
  "/mot-de-passe-oublie",
  "/reset-password",
  "/actualites",
  "/concours"
];

// Routes interdites pour les utilisateurs connectés (comme login)
export const authRoutes = ["/login", "/register", "/mot-de-passe-oublie"];
