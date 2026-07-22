import { useLoginStore } from "~~/stores/login";
import { rolePermissions } from "~~/configuration/permissions";
import { routePermissionFallback } from "~~/configuration/permissionFallback";

export default defineNuxtRouteMiddleware((to) => {
	if (process.server) return;

	// L'espace candidat a son propre système d'authentification, indépendant
	// des permissions du staff/étudiant gérées ici. Attention : "/candidat" est
	// un préfixe de "/candidatures" (pages staff de gestion des candidatures) —
	// il faut exiger un "/" après pour ne pas les exclure par erreur des
	// vérifications de permission ci-dessous.
	if (to.path === '/candidat' || to.path.startsWith('/candidat/')) return;

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
        "/support/ticket",
        "/concours"
	];
	if (publicRoutes.includes(to.path) || to.path.startsWith("/actualites/") || to.path.startsWith("/annonces/")) {
		return;
	}

	const userData = JSON.parse(localStorage.getItem("user") || "{}");
	const userRoles = userData?.roles || [];

	// Routes réservées strictement à certains rôles, même pour les comptes
	// ayant par ailleurs un accès total ("*"), comme l'admin.
	const strictRoleOnlyRoutes = {
		"/enseignant/syllabuses": ["enseignant"],
	};
	const strictPrefix = Object.keys(strictRoleOnlyRoutes).find((prefix) =>
		to.path.startsWith(prefix)
	);
	if (strictPrefix) {
		const allowedRoles = strictRoleOnlyRoutes[strictPrefix];
		const isAllowed = userRoles.some((role) => allowedRoles.includes(role.slug));
		if (!isAllowed) {
			const { $toastr } = useNuxtApp();
			$toastr.error(
				`Accès refusé car vous n'avez pas la permission d'accéder à cette page!`,
			);
			return navigateTo("/emploi-du-temps");
		}
		return;
	}

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

	// REDIRECTION SPÉCIALE POUR LA PAGE D'ACCUEIL (/)
	if (to.path === "/") {
		const hasHomeAccess = userRoles.some((role) =>
			rolesWithHomeAccess.includes(role.slug)
		);
		// Si l'utilisateur n'a pas accès à l'accueil, rediriger vers sa page par défaut
		if (!hasHomeAccess) {
			return navigateTo("/emploi-du-temps");
		}

		// Sinon on le laisse voir /
		return;
	}

	// Accès total réel : uniquement les rôles ayant la permission "*"
	// (ne pas confondre avec rolesWithHomeAccess, qui ne concerne que la page d'accueil)
	const hasFullAccess = userRoles.some((role) => {
		const permissions = rolePermissions[role.slug];
		return permissions && permissions.includes("*");
	});

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
		// Filet de sécurité dynamique : la liste ci-dessus (rolePermissions) est
		// maintenue à la main et ne connaît pas les permissions accordées depuis
		// la page "Rôles". Si le chemin correspond à un domaine de permissions
		// dynamiques et que l'utilisateur a au moins une des permissions requises,
		// on autorise quand même — voir configuration/permissionFallback.js.
		const userPermissions = userData?.permissions || [];
		const fallbackMatch = routePermissionFallback.find((entry) =>
			to.path.startsWith(entry.prefix),
		);
		if (
			fallbackMatch &&
			fallbackMatch.anySlugOf.some((slug) => userPermissions.includes(slug))
		) {
			return;
		}

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