# Guide : comment sont faits les appels API (Axios + Pinia)

Ce guide explique comment ce frontend (Nuxt 3) communique avec le backend Laravel, pour que vous puissiez ajouter de nouveaux appels API sans deviner le pattern.

## 1. La base URL — `config.ts` (racine du projet)

```ts
const isLocal = true; // <- seul interrupteur dev/prod du fichier
export default {
  app_local: isLocal,
  app_dev_url: "http://localhost:8000/api",
  app_prod_url: "https://new.iai-togo.tg/api",
  app_dev_storage_url: "http://localhost:8000",
  app_prod_storage_url: "https://new.iai-togo.tg",
  reverb: { /* config websockets */ }
}
```

- `isLocal` bascule tout le fichier entre dev et prod. **Pas de `.env`** pour ça — c'est un fichier TS commité, à modifier à la main avant un déploiement/test.
- `app_dev_url` / `app_prod_url` = base de **tous les appels API** (le `/api` est déjà inclus dedans).
- `app_dev_storage_url` / `app_prod_storage_url` = base pour les **fichiers stockés** (images, PDF, `/storage/...`) — c'est une URL différente, sans le préfixe `/api`. Ne jamais construire une URL de fichier à partir de la base API.

## 2. Le plugin Axios global — `app/plugins/axios.ts`

```ts
import config from '../../config';
const base_url = config.app_local ? config.app_dev_url : config.app_prod_url;

export default defineNuxtPlugin((nuxtApp) => {
    axios.default.defaults.baseURL = base_url;   // mutation globale du singleton axios

    axios.default.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                // déconnexion auto, voir §4
            }
            return Promise.reject(error);
        }
    );

    return { provide: { axios: axios.default } };
});
```

**Point clé à comprendre** : ce plugin modifie `axios.defaults.baseURL` sur **l'instance singleton du package `axios`**. Conséquence : que vous fassiez `import axios from "axios"` (import direct, le plus courant dans ce projet) ou `const { $axios } = useNuxtApp()` (instance injectée par le plugin), c'est **le même objet**. Les deux fonctionnent, le code utilise indifféremment les deux styles selon les fichiers.

Le seul vrai rôle du plugin au-delà de fixer la baseURL, c'est l'**intercepteur 401 global** : en cas de token expiré/invalide, il déconnecte automatiquement l'utilisateur — voir §4 pour la logique de distinction entre espaces.

## 3. Le pattern dans chaque store Pinia (`stores/*.js`)

Il n'y a **pas** d'intercepteur global qui injecte le token `Authorization`. Chaque store le fait lui-même via deux helpers locaux (copiés d'un store à l'autre, pas factorisés) :

```js
import { defineStore } from "pinia";
import axios from "axios";

export const useMonStore = defineStore("mon-store", {
  state: () => ({ items: [], isLoading: false }),

  actions: {
    authHeaders() {
      const token = localStorage.getItem("gest-ecole-token"); // ou "candidat-token", voir §4
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      };
    },

    multipartHeaders() {
      const token = localStorage.getItem("gest-ecole-token");
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
        },
      };
    },

    async fetchItems() {
      this.isLoading = true;
      try {
        const response = await axios.get("/mon-endpoint", { ...this.authHeaders() });
        this.items = response.data.data || response.data;
        return this.items;
      } catch (error) {
        console.error("Erreur chargement:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
```

Remarques sur ce pattern, à respecter pour rester cohérent avec le reste du code :
- `response.data.data || response.data` : le backend renvoie parfois une `Resource` Laravel enveloppée dans `{ data: ... }`, parfois un objet brut — ce fallback gère les deux sans casser.
- `isLoading` en state, mis à `true`/`false` autour de chaque action, pour piloter les spinners dans les pages.
- `try/catch/finally` avec `console.error` + `throw error` : le store logue puis relance l'erreur, c'est à la page/au composant appelant de l'attraper pour afficher un toast (`$toastr.error(...)`).
- `multipartHeaders()` uniquement quand on envoie un `FormData` (upload de fichier) — sinon `authHeaders()` (JSON classique).

## 4. Deux espaces d'authentification, une seule API

| Espace | Clé token (localStorage) | Clé user (localStorage) | Pages concernées |
|---|---|---|---|
| Staff (admin/personnel) | `gest-ecole-token` | `user` | tout sauf `/candidat/*` |
| Candidat (portail externe) | `candidat-token` | `candidat-user` | `/candidat/*` |

Même base URL (`/api`), même backend Laravel Sanctum — la distinction se fait uniquement par **quel token est utilisé** et par le **path courant**. L'intercepteur 401 du plugin axios choisit quoi nettoyer/où rediriger selon `window.location.pathname` :

```js
const path = window.location.pathname;
if (path === '/candidat' || path.startsWith('/candidat/')) {
    // nettoie candidat-token / candidat-user, redirige vers /candidat/login
} else {
    // nettoie gest-ecole-token / user, redirige vers /login
}
```

⚠️ Piège connu : `/candidat` est un préfixe de `/candidatures` (pages staff). Le test exige donc une correspondance exacte OU un `/` après `/candidat` — ne jamais simplifier en `path.startsWith('/candidat')` seul, ça route les pages staff `/candidatures/*` vers le login candidat.

## 5. Recette : ajouter un nouvel appel API

1. Identifier l'espace concerné (staff ou candidat) → quelle clé de token utiliser dans `authHeaders()`.
2. Ouvrir (ou créer) le store correspondant dans `stores/`.
3. Copier le pattern `authHeaders()`/`multipartHeaders()` si le store est neuf.
4. Ajouter l'action : `axios.get/post/put/delete("/chemin-relatif", ..., this.authHeaders())`
   - **Ne jamais** répéter `/api` ni le domaine dans le chemin — c'est déjà dans `baseURL`.
5. Pour un upload : construire un `FormData`, utiliser `multipartHeaders()`, et si c'est une mise à jour (`PUT` via POST), penser à `formData.append("_method", "PUT")` (Laravel a besoin de ce champ pour les requêtes multipart en PUT).
6. Pour afficher un fichier stocké (image, PDF) dans un template : utiliser `getStorageBaseUrl()` de `app/utils/storageUrl.js`, **pas** la baseURL d'axios.
   ```js
   import { getStorageBaseUrl } from '~/utils/storageUrl'
   const url = `${getStorageBaseUrl()}/storage/${path}`
   ```
7. Appeler l'action du store depuis la page/le composant, dans un `try/catch`, avec un toast utilisateur en cas d'erreur.

## 6. Pièges connus

- **`isLocal` dans `config.ts` doit être repassé à `false` avant un build de prod** — rien ne le fait automatiquement.
- Les stores dupliquent `authHeaders()`/`multipartHeaders()` au lieu de les factoriser — c'est un choix assumé du projet (duplication simple plutôt qu'abstraction centralisée), à reproduire plutôt qu'à "corriger" seul dans un coin du code.
- Le token n'est jamais rafraîchi automatiquement : à l'expiration, seul le 401 global gère la déconnexion — il n'y a pas de refresh token.
