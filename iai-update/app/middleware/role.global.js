import { useLoginStore } from "~~/stores/login";
import { rolePermissions } from "~~/configuration/permissions";

export default defineNuxtRouteMiddleware((to) => {
	if (process.server) return;

	const authStore = useLoginStore();

	if (!authStore.isAuthenticated()) {
		return;
	}

	const publicRoutes = [
		"/login",
		"/mot-de-passe-oublie",
		"/reset-password",
		"/unauthorized",
        "/actualites",
        "/annonces",
        "/support/ticket"
	];
	if (publicRoutes.includes(to.path) || to.path.startsWith("/actualites/") || to.path.startsWith("/annonces/")) {
		return;
	}

	const userData = JSON.parse(localStorage.getItem("user") || "{}");
	const userRoles = userData?.roles || [];

	// Liste des rôles autorisés à voir la page d'accueil (/)
	const rolesWithHomeAccess = [
		"responsable-du-site",
		"admin",
		"directeur-general-adjoint",
		"directeur-general",
		"informaticien",
		"secretaires",
		"surveillant",
		"charge-de-la-clientele",
		"responsable-marketing",
		"collaborateur-commercial",
		"stagiaire",
		"logiticien-academique",
		'directeur-academique'
	];

	// Vérifier si l'utilisateur a un rôle avec accès total
	const hasFullAccess = userRoles.some((role) =>
		rolesWithHomeAccess.includes(role.slug)
	);

	// REDIRECTION SPÉCIALE POUR LA PAGE D'ACCUEIL (/)
	if (to.path === "/") {
		// Si l'utilisateur n'a pas accès total, rediriger vers sa page par défaut
		if (!hasFullAccess) {
			// Redirection par défaut pour tous les utilisateurs sans accès total
			return navigateTo("/emploi-du-temps");
		}
		
		// Si l'utilisateur a accès total, on le laisse voir /
		return;
	}

	if (hasFullAccess) {
		return; // Accès autorisé à tout
	}

	// Vérifier les permissions pour chaque rôle
	const hasAccess = userRoles.some((role) => {
		const permissions = rolePermissions[role.slug];
		if (!permissions) return false;

		return permissions.some((pattern) => {
			if (pattern === "*") return true;
			if (pattern === to.path) return true;

			if (pattern.endsWith("/*")) {
				const basePath = pattern.slice(0, -2);
				return to.path.startsWith(basePath);
			}

			return false;
		});
	});

	if (!hasAccess) {
		const { $toastr } = useNuxtApp();
		// Éviter la boucle infinie si on est déjà sur la page par défaut
		if (to.path === "/emploi-du-temps") {
			return;
		}

		$toastr.error(
			`Accès refusé car vous n'avez pas la permission d'accéder à cette page!`,
		);

		// Rediriger vers la page par défaut
		return navigateTo("/emploi-du-temps");
	}
});