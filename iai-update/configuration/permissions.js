// Configuration des permissions par rôle
export const rolePermissions = {
	// Rôles administratifs
	"responsable-du-site": ["*"], // Accès à tout
	admin: ["*"], // Accès à tout
	"directeur-general-adjoint": ["*"], // Accès à tout
	"directeur-general": ["*"], // Accès à tout

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
		"/annee-scolaire/*",
		"/personnel/*",
		"/publications/*",
		"/notifications/*",
		"admin/*",
		"année-scolaire/*",
		"periodes/*",
		"parcours/*",
		"annonces/*",
		"statistiques/*",
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
		"/evenements/*",
		"/notifications/*",
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
	],

	enseignant: [
		"/",
		"/profile/*",
		"/emploi-du-temps/*",
		"/presences/*",
		"/notifications/*",
		"/statistiques/*",
	],

	// Rôles financiers
	"responsable-administratif-et-financier": [
		"/",
		"/profile/*",
		"/messages/*",
		"/finance/*",
		"/frais-de-scolarite/*",
		"/bourses/*",
		"/personnel/*",
		"/notifications/*",
	],

	"directeur-des-affaires-financieres": [
		"/",
		"/profile/*",
		"/messages/*",
		"/finance/*",
		"/frais-de-scolarite/*",
		"/bourses/*",
		"/personnel/*",
		"/notifications/*",
	],

	// Rôles logistiques
	"responsable-des-achats-et-de-la-logistique": [
		"/",
		"/profile/*",
		"/messages/*",
		"/salles/*",
		"/evenements/*",
		"/notifications/*",
	],

	// Rôles communication
	"charge-de-la-clientele": [
		"/",
		"/profile/*",
		"/messages/*",
		"/reclamations/*",
		"/presences/*",
		"/publications/*",
		"/emploi-du-temps/*",
		"/notifications/*",
	],

	"responsable-marketing": [
		"/profile/*",
		"/emploi-du-temps/*",
		"/publications/*",
		"/evenements/*",
		"/partenaires/*",
		"/opportunites/*",
		"/notifications/*",
	],

	// Rôles techniques
	informaticien: [
		"/",
		"/profile/*",
		"/reclamations/*",
		"/presences/*",
		"/personnel/*",
		"/logs",
		"/notifications/*",
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
	],

	"charge-de-la-reprographie": [
		"/",
		"/profile/*",
		"/messages/*",
		"/evenements/*",
		"/notifications/*",
	],

	// Rôles pédagogiques
	"titulaire-dune-classe": [
		"/",
		"/profile/*",
		"/emploi-du-temps/*",
		"/presences/*",
		"/groupes/*",
		"/notifications/*",
	],

	// Rôles étudiants/communautaires
	"membre-du-comite-etudiant": [
		"/",
		"/profile/*",
		"/messages/*",
		"/emploi-du-temps/*",
		"/evenements/*",
		"/notifications/*",
	],

	// Rôles parents
	parent: [
		"/",
		"/profile/*",
		"/emploi-du-temps/*",
		"/presences/*",
		"/messages/*",
		"/notifications/*",
	],

	// Rôles commerciaux
	"collaborateur-commercial": [
		"/",
		"/profile/*",
		"/messages/*",
		"/partenaires/*",
		"/opportunites/*",
		"/notifications/*",
	],

	// Étudiants
	etudiant: [
		"/",
		"/profile/*",
		"/etudiant/*",
		"/emploi-du-temps/*",
		"/messages/*",
		"/notifications/*",
	],

	// Utilisateur simple
	"utilisateur-de-la-plateforme": [
		"/",
		"/profile/*",
		"/messages/*",
		"/notifications/*",
	],

	"stagiaire-academie": [
		"/",
		"/profile/*",
		"/messages/*",
		"/presences/*",
		"/notifications/*",
	],
};

// Routes publiques (accessibles sans authentification)
export const publicRoutes = [
	"/login",
	"/register",
	"/mot-de-passe-oublie",
	"/reset-password",
	"/notifications/*",
];

// Routes interdites pour les utilisateurs connectés (comme login)
export const authRoutes = [
	"/login",
	"/register",
	"/mot-de-passe-oublie",
	"/notifications/*",
];
