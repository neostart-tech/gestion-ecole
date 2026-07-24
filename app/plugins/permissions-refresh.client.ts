// Rafraîchit périodiquement les permissions effectives de l'utilisateur connecté,
// pour qu'un changement de rôle/permission fait depuis la page Rôles prenne effet
// automatiquement, sans que l'utilisateur ait besoin de se déconnecter/reconnecter.
// `fetchUser()` met déjà à jour l'état réactif `useState("user")` lu par
// `useAccess()`/`<Can>` — il suffit donc de l'appeler régulièrement en arrière-plan.
import { useLoginStore } from "~~/stores/login";

const REFRESH_INTERVAL_MS = 60_000;

export default defineNuxtPlugin(() => {
  if (!process.client) return;

  const loginStore = useLoginStore();
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const tick = () => {
    if (!loginStore.isAuthenticated()) return;
    loginStore.fetchUser().catch(() => {
      // Échec silencieux (ex: token expiré) : la navigation normale gère déjà
      // la redirection vers /login le cas échéant, pas besoin de dupliquer ça ici.
    });
  };

  intervalId = setInterval(tick, REFRESH_INTERVAL_MS);

  // Rafraîchir aussi dès que l'onglet redevient actif (l'utilisateur avait peut-être
  // changé de rôle pendant qu'il était sur un autre onglet/application).
  const onVisibilityChange = () => {
    if (document.visibilityState === "visible") tick();
  };
  document.addEventListener("visibilitychange", onVisibilityChange);
});
