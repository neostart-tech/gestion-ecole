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

	// Pages self-service : accessibles à tout utilisateur authentifié quel que
	// soit son rôle, puisqu'elles ne montrent que ses propres données (pas de
	// permission dédiée à vérifier — contrairement à publicRoutes ci-dessus,
	// l'authentification reste requise).
	const selfServiceRoutes = [
		"/parametre/mon-activite",
		"/cours-en-ligne",
	];
	if (selfServiceRoutes.includes(to.path) || to.path.startsWith("/cours-en-ligne/")) {
		return;
	}

	const userData = JSON.parse(localStorage.getItem("user") || "{}");
	const rawRoles = userData?.roles || [];
	const userRoles = Array.isArray(rawRoles) ? rawRoles : (userData?.role ? [userData.role] : []);

	const getRoleSlug = (r) => {
		if (!r) return "";
		if (typeof r === "string") return r.trim().toLowerCase();
		return (r.slug || r.name || r.nom || "").toString().trim().toLowerCase();
	};

	const userRoleSlugs = userRoles.map(getRoleSlug).filter(Boolean);

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
		const isAllowed = userRoleSlugs.some((slug) => allowedRoles.includes(slug));
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
		"superadmin",
		"super-admin",
		"super_admin",
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
		"directeur-academique",
	];

	// REDIRECTION SPÉCIALE POUR LA PAGE D'ACCUEIL (/)
	if (to.path === "/") {
		const hasHomeAccess = userRoleSlugs.some((slug) =>
			rolesWithHomeAccess.includes(slug)
		);
		// Si l'utilisateur n'a pas accès à l'accueil, rediriger vers sa page par défaut
		if (!hasHomeAccess) {
			return navigateTo("/emploi-du-temps");
		}

		// Sinon on le laisse voir /
		return;
	}

	// Rôles administratifs avec accès universel
	const adminFullAccessSlugs = [
		"admin",
		"superadmin",
		"super-admin",
		"super_admin",
		"directeur-general",
		"directeur-general-adjoint",
		"responsable-du-site",
		"informaticien",
	];

	// Accès total réel : rôles administratifs de base OU ceux ayant la permission "*"
	const hasFullAccess = userRoleSlugs.some((slug) => {
		if (adminFullAccessSlugs.includes(slug)) return true;
		const permissions = rolePermissions[slug];
		return permissions && permissions.includes("*");
	});

	if (hasFullAccess) {
		return; // Accès autorisé à tout
	}

	const normalizedPath = to.path.replace(/\/+$/, "") || "/";

	// Vérifier les permissions pour chaque rôle
	const hasAccess = userRoleSlugs.some((slug) => {
		const permissions = rolePermissions[slug];
		if (!permissions) return false;

		return permissions.some((pattern) => {
			if (pattern === "*") return true;
			const cleanPattern = pattern.replace(/\/+$/, "") || "/";
			if (cleanPattern === normalizedPath) return true;

			if (pattern.endsWith("/*")) {
				const basePath = pattern.slice(0, -2);
				return normalizedPath.startsWith(basePath);
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
		const rawPerms = userData?.permissions || [];
		const userPermissions = (Array.isArray(rawPerms) ? rawPerms : []).map((p) =>
			(typeof p === "string" ? p : (p?.slug || p?.name || "")).toString().trim().toLowerCase()
		);
		const fallbackMatch = routePermissionFallback.find((entry) =>
			normalizedPath.startsWith(entry.prefix.replace(/\/+$/, ""))
		);
		if (
			fallbackMatch &&
			fallbackMatch.anySlugOf.some((slug) => userPermissions.includes(slug.toLowerCase()))
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