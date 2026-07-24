// plugins/theme.client.ts
export default defineNuxtPlugin(() => {
	// Ce plugin s'exécute uniquement côté client

	// Fonction pour appliquer le thème
	const applyTheme = () => {
		// Vérifier le localStorage (même clé/format que stores/theme.ts,
		// qui est la source de vérité une fois l'app montée)
		const savedSettings = localStorage.getItem("theme-state");
		let mode = "auto";

		if (savedSettings) {
			try {
				const parsed = JSON.parse(savedSettings);
				mode = parsed.themeSettings?.mode || "auto";
			} catch {
				mode = "auto";
			}
		}

		const html = document.documentElement;
		html.classList.remove("light", "dark");

		let shouldBeDark = false;
		if (mode === "dark") {
			shouldBeDark = true;
		} else if (mode === "light") {
			shouldBeDark = false;
		} else {
			// auto
			shouldBeDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		}

		if (shouldBeDark) {
			html.classList.add("dark");
		} else {
			html.classList.add("light");
		}

		console.log(
			"🎨 Thème appliqué via plugin:",
			mode,
			shouldBeDark ? "dark" : "light",
		);
	};

	// Appliquer immédiatement au chargement
	applyTheme();

	// Observer les changements de localStorage (pour les autres onglets)
	window.addEventListener("storage", (event) => {
		if (event.key === "theme-state") {
			applyTheme();
		}
	});
});
