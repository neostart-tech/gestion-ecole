import { useState } from "#app";

export default defineNuxtPlugin(() => {
  if (process.client) {
    const userState = useState("user");
    const userLoaded = useState("userLoaded");

    const userLS = localStorage.getItem("user");
    if (userLS) {
      userState.value = JSON.parse(userLS);
    }

    userLoaded.value = true; // user prêt, maintenant can() peut fonctionner
  }
});