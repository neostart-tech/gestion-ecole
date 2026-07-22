# Instructions pour Claude Code — gestion-ecole

## Mode sombre / clair (obligatoire, sans exception)

Toute page ou composant Vue créé ou modifié dans ce projet DOIT fonctionner correctement en mode clair **et** en mode sombre, sans qu'il soit nécessaire de le redemander.

Le mode sombre est piloté par la classe `.dark` posée sur un ancêtre (Tailwind `darkMode: 'class'`, voir `tailwind.config.ts`). Points de vigilance qui cassent le mode sombre en pratique :

- **Ne jamais injecter une couleur calculée en JS/inline** (`:style="{ background: '#eef2ff' }"`) pour un badge/glyphe/palette catégorielle — cette couleur ne changera jamais avec le thème. À la place : calculer une **classe** CSS déterministe (ex. `domain-color-3`) et définir cette classe deux fois dans le `<style>`.
- **Ne jamais redéfinir une variable CSS custom (`--xxx`) à l'intérieur d'un bloc `:global(.dark) .foo { --xxx: ... }` dans un `<style scoped>` de ce projet.** Constaté empiriquement sur `app/pages/roles/liste.vue` et `app/pages/roles/[slug]/permissions.vue` : ce pattern ne se propage pas de façon fiable (probablement le pipeline Lightning CSS/Tailwind v4 de Nuxt) — la page restait en fond clair malgré `.dark` bien posé sur `<html>`, alors que la barre latérale (Tailwind `dark:bg-...`) fonctionnait très bien. **Toujours écrire deux règles directes** à la place : `.foo { background: <valeur claire>; }` puis `:global(.dark) .foo { background: <valeur sombre>; }`, propriété par propriété, sans indirection par variable. C'est plus verbeux mais c'est le seul mécanisme vérifié fiable dans ce projet pour du CSS scoped fait main.
- Toujours fournir un contrepoint `dark:` (Tailwind) ou `:global(.dark) .xxx { propriete: valeur }` (CSS scoped, valeurs littérales) pour chaque couleur de fond, de texte et de bordure ajoutée — jamais une seule valeur qui suppose un fond clair ou un fond sombre, et jamais via une variable CSS redéfinie dans le bloc dark.
- Vérifier après coup en basculant réellement le thème (pas seulement en relisant le code) quand la page contient des couleurs catégorielles/dynamiques (badges par domaine, avatars par rôle, etc.).

## Charte graphique

Couleur primaire du projet : bleu (`#2563eb` / `--color-primary-600`, voir `tailwind.config.ts` et `app/assets/css/main.css`), utilisée dans la sidebar (`bg-blue-600`) et les liens. Ne pas introduire de dégradés violet/indigo comme couleur d'accent principale sans demande explicite — rester dans la famille bleue pour les éléments de marque (boutons primaires, bandeaux, liens actifs). Des couleurs catégorielles variées (palette à 8 teintes) restent acceptables pour distinguer visuellement des éléments d'une liste (badges de domaine, avatars), à condition de respecter la règle mode sombre/clair ci-dessus.
