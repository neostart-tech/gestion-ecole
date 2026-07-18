<!-- pages/unauthorized.vue -->
<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50 p-4"
  >
    <div class="text-center max-w-md">
      <!-- Logo ou icône -->
     

      <!-- Code d'erreur -->
      <div class="mb-4">
        <span
          class="inline-block px-4 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium"
        >
          Erreur 403
        </span>
      </div>

      <!-- Titre -->
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>

      <!-- Message -->
      <p class="text-gray-600 mb-8 text-lg">
        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
      </p>

      <!-- Message personnalisé selon le rôle -->

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <NuxtLink
          to="/"
          class="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Retour à l'accueil
        </NuxtLink>

        <button
          @click="goBack"
          class="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Page précédente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLoginStore } from "~~/stores/login";
import { useRouter } from "vue-router";

// Définir que cette page n'utilise pas le layout par défaut
definePageMeta({
  layout: false,
});

const authStore = useLoginStore();
const router = useRouter();

// Récupérer l'email de l'utilisateur
const getUserEmail = () => {
  const user = authStore.user;
  return user?.email || "utilisateur@exemple.com";
};

// Récupérer les rôles formatés
const getUserRoles = () => {
  const user = authStore.user;
  if (!user?.roles || user.roles.length === 0) return "Aucun rôle";

  const roleNames = user.roles.map((r) => {
    const roleMap = {
      etudiant: "Étudiant",
      professeur: "Professeur",
      "directeur-academique": "Directeur académique",
      "responsable-du-site": "Administrateur",
      "directeur-general-adjoint": "Directeur général adjoint",
      "logiticien-academique": "Logisticien académique",
      surveillant: "Surveillant",
      "responsable-administratif-et-financier":
        "Responsable administratif et financier",
      "responsable-des-achats-et-de-la-logistique":
        "Responsable achats & logistique",
      "charge-de-la-clientele": "Chargé de la clientèle",
      "responsable-marketing": "Responsable marketing",
      informaticien: "Informaticien",
      "stagiaire-academie": "Stagiaire",
      "utilisateur-de-la-plateforme": "Utilisateur",
    };
    return roleMap[r.slug] || r.slug;
  });

  return roleNames.join(" • ");
};

// Fonction pour revenir en arrière
const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
};
</script>

<style scoped>
/* Animation subtile pour l'icône */
@keyframes gentle-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.w-16.h-16 {
  animation: gentle-pulse 3s ease-in-out infinite;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  h1 {
    font-size: 2rem;
  }

  .text-lg {
    font-size: 1rem;
  }
}
</style>
