import { useState } from "#app";

export default defineNuxtPlugin(() => {
  const user = useState("user", () => null);

  try {
    const userLS = localStorage.getItem("user");

    if (userLS) {
      user.value = JSON.parse(userLS);
      console.log("[PLUGIN] User chargé AVANT rendu :", user.value);
    } else {
      console.log("[PLUGIN] Aucun user trouvé");
    }
  } catch (e) {
    console.error("[PLUGIN] erreur parsing user", e);
    user.value = null;
  }
});