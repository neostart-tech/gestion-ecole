<template>
  <header
    class="fixed top-0 right-0 z-40 bg-white dark:bg-gray-800 shadow-sm transition-all duration-300"
    :class="[sidebarOpen ? 'lg:left-80' : 'lg:left-20', 'left-0']"
  >
    <div class="flex items-center justify-between px-4 py-3">
      <!-- Left section -->
      <div class="flex items-center space-x-4">
        <!-- Burger menu -->
        <button
          @click="toggleSidebar"
          class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <!-- Right section -->
      <div class="flex items-center space-x-4">
        <!-- Theme toggle -->
        <button
          @click="toggleTheme"
          class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
        >
          <svg
            v-if="currentMode === 'dark'"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
          <svg
            v-else-if="currentMode === 'light'"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.663 17h4.673M12 3v1m8.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <span class="text-sm hidden md:inline">{{
            currentMode === "auto"
              ? "Auto"
              : currentMode === "dark"
                ? "Sombre"
                : "Clair"
          }}</span>
        </button>

        <!-- Settings -->
        <button
          @click="toggleSettings"
          class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        <!-- Notifications -->
        <div class="relative">
          <button
            @click="toggleNotifications"
            class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 relative"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span
              v-if="unreadNotifications > 0"
              class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
            ></span>
          </button>

          <!-- Dropdown Notifications SIMPLIFIÉ -->
          <div
            v-if="showNotifications"
            class="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[70vh] overflow-hidden flex flex-col"
          >
            <!-- Header simple -->
            <div class="p-3 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-gray-800 dark:text-white">
                  Notifications
                </h3>
                <div class="flex items-center space-x-2">
                  <span
                    v-if="unreadNotifications > 0"
                    class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                  >
                    {{ unreadNotifications }} non lu{{
                      unreadNotifications > 1 ? "s" : ""
                    }}
                  </span>
                  <button
                    v-if="unreadNotifications > 0"
                    @click="markAllAsRead"
                    class="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                  >
                    Tout lire
                  </button>
                </div>
              </div>
            </div>

            <!-- Liste simplifiée -->
            <div class="flex-1 overflow-y-auto">
              <div v-if="notifications.length === 0" class="p-6 text-center">
                <svg
                  class="w-10 h-10 mx-auto text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Aucune notification
                </p>
              </div>

              <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  @click="markAsRead(notification.id)"
                  :class="[
                    'p-3 cursor-pointer transition-colors',
                    notification.read
                      ? 'bg-transparent'
                      : 'bg-blue-50 dark:bg-blue-900/20',
                  ]"
                >
                  <div class="flex items-start space-x-3">
                    <!-- Indicateur de non-lu -->
                    <div v-if="!notification.read" class="pt-1">
                      <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <div v-else class="pt-1">
                      <div class="w-2 h-2"></div>
                    </div>

                    <!-- Contenu -->
                    <div class="flex-1 min-w-0">
                      <div class="flex justify-between items-start mb-1">
                        <p
                          class="text-sm font-medium text-gray-800 dark:text-white line-clamp-2"
                        >
                          {{ notification.title }}
                        </p>
                        <span
                          class="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0"
                        >
                          {{ notification.time }}
                        </span>
                      </div>

                      <p
                        class="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-1"
                      >
                        {{ notification.message }}
                      </p>

                      <!-- Date complète -->
                      <div class="text-xs text-gray-400 dark:text-gray-500">
                        {{ notification.date }}
                      </div>

                      <!-- Détails simples -->
                      <div v-if="notification.details" class="mt-1">
                        <div
                          v-if="notification.details.evaluation"
                          class="text-xs text-gray-500 dark:text-gray-400"
                        >
                          {{ notification.details.evaluation }}
                        </div>
                        <div
                          v-if="notification.details.date_evaluation"
                          class="text-xs text-gray-500 dark:text-gray-400"
                        >
                          {{ notification.details.date_evaluation }}
                          <span
                            v-if="notification.details.heure_debut"
                            class="ml-1"
                          >
                            {{ notification.details.heure_debut }}-{{
                              notification.details.heure_fin
                            }}
                          </span>
                        </div>
                        <div
                          v-if="notification.details.salle"
                          class="text-xs text-gray-500 dark:text-gray-400"
                        >
                          Salle {{ notification.details.salle }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer simple -->
            <div class="p-3 border-t border-gray-200 dark:border-gray-700">
              <button
                @click="deleteAllNotifications"
                class="w-full text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 py-1"
              >
                Supprimer toutes les notifications
              </button>
            </div>
          </div>
        </div>

        <!-- Profile dropdown -->
        <div class="relative">
          <button
            @click="toggleProfileDropdown"
            class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div
              class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300"
            >
              <span class="font-semibold">A</span>
            </div>
            <div class="hidden lg:block text-left">
              <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {{ userInfo.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ userInfo.email }}
              </p>
            </div>
            <svg
              class="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <!-- Dropdown menu -->
          <div
            v-if="isProfileDropdownOpen"
            class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-200 dark:border-gray-700 z-50"
          >
            <div
              class="px-4 py-2 border-b border-gray-100 dark:border-gray-700"
            >
              <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {{ userInfo.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ userInfo.email }}
              </p>
            </div>
            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Mon profil
            </a>
            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Me déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useThemeStore } from "../../stores/theme";
import type { Notification } from "../../types";
import { ref, computed, onMounted, onUnmounted } from "vue";

import { useLoginStore } from "../../stores/login";
const { $toastr } = useNuxtApp();

const loginStore = useLoginStore();

const themeStore = useThemeStore();
const isProfileDropdownOpen = ref(false);
const showNotifications = ref(false);
const windowWidth = ref(0);
const userInfo = ref<{ name: string; email: string }>({
  name: "",
  email: "",
});

const user = JSON.parse(localStorage.getItem("user") || "{}");



userInfo.value = {
  name: user.nom  + " "+ user.prenom || "Utilisateur",
  email: user.email || "utilisateur@example.com"
};

// $toastr.success(`Bienvenue ${userInfo.value.name} !`);

// Données de notifications simplifiées
const notifications = ref<Notification[]>([
  {
    id: 1,
    title: "Publication de note",
    message:
      "Les notes de l'évaluation Examen de Algo Fichier ont été publiées.",
    time: "Il y a 4 mois",
    date: "04 août 2025 06:42",
    read: false,
    type: "note",
    details: {
      evaluation: "Examen de Algo Fichier",
    },
  },
  {
    id: 2,
    title: "Publication de note",
    message:
      "Les notes de l'évaluation Examen de Pratiques de SQL ont été publiées.",
    time: "Il y a 1 an",
    date: "24 juin 2024 15:20",
    read: true,
    type: "note",
    details: {
      evaluation: "Examen de Pratiques de SQL",
    },
  },
  {
    id: 3,
    title: "Publication de note",
    message:
      "Les notes de l'évaluation Examen de Initiation à la Programmation Objet ont été publiées.",
    time: "Il y a 1 an",
    date: "18 juin 2024 16:00",
    read: false,
    type: "note",
    details: {
      evaluation: "Examen de Initiation à la Programmation Objet",
    },
  },
  {
    id: 4,
    title: "Annonce de programmation",
    message:
      "Bonjour M. Admin Administrateur Vous êtes programmé pour la surveillance durant l'évaluation suivante: Examen de Pratiques de SQL.",
    time: "Il y a 1 an",
    date: "18 juin 2024 10:36",
    read: false,
    type: "programmation",
    details: {
      evaluation: "Examen de Pratiques de SQL",
      date_evaluation: "19 juin 2024",
      heure_debut: "10:00",
      heure_fin: "12:00",
      salle: "SALLE A",
    },
  },
  {
    id: 5,
    title: "Annonce de déprogrammation",
    message:
      "Bonjour M. Admin Administrateur. Vous êtes déprogrammé pour la surveillance durant l'évaluation suivante: Examen de Électronique Numérique.",
    time: "Il y a 1 an",
    date: "06 mai 2024 10:03",
    read: false,
    type: "deprogrammation",
    details: {
      evaluation: "Examen de Électronique Numérique",
      date_evaluation: "06 mai 2024",
      heure_debut: "10:00",
      heure_fin: "12:00",
      salle: "SALLE A",
    },
  },
  {
    id: 6,
    title: "Annonce de programmation",
    message:
      "Bonjour M. Admin Administrateur Vous êtes programmé pour la surveillance durant l'évaluation suivante: Devoir de Initiation à l'algorithme.",
    time: "Il y a 1 an",
    date: "30 avril 2024 18:25",
    read: false,
    type: "programmation",
    details: {
      evaluation: "Devoir de Initiation à l'algorithme",
      date_evaluation: "02 mai 2024",
      heure_debut: "07:30",
      heure_fin: "09:30",
      salle: "SALLE B",
    },
  },
]);

// Computed properties
const unreadNotifications = computed(() => {
  return notifications.value.filter((n) => !n.read).length;
});

const currentMode = computed(() => {
  return themeStore.themeSettings.mode;
});

const sidebarOpen = computed(() => {
  return windowWidth.value >= 1024 ? themeStore.isSidebarOpen : false;
});

// Méthodes
const toggleSidebar = () => {
  if (windowWidth.value < 1024) {
    themeStore.toggleMobileSidebar();
  } else {
    themeStore.toggleSidebar();
  }
};

const toggleTheme = () => {
  const current = themeStore.themeSettings.mode;
  const next =
    current === "light" ? "dark" : current === "dark" ? "auto" : "light";
  themeStore.updateThemeSettings({ mode: next });
};

const toggleSettings = () => {
  themeStore.toggleSettings();
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value) {
    isProfileDropdownOpen.value = false;
  }
};

const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value;
  if (isProfileDropdownOpen.value) {
    showNotifications.value = false;
  }
};

const markAsRead = (id: number) => {
  const notification = notifications.value.find((n) => n.id === id);
  if (notification) {
    notification.read = true;
  }
};

const markAllAsRead = () => {
  notifications.value.forEach((n) => (n.read = true));
};

const deleteAllNotifications = () => {
  if (confirm("Voulez-vous vraiment supprimer toutes les notifications ?")) {
    notifications.value = [];
  }
};

const logout = () => {
  loginStore.logout();
  $toastr.success("Vous avez été déconnecté avec succès.");
  navigateTo("/login");
};

// Gestion des clics extérieurs
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;

  // Fermer les dropdowns si on clique ailleurs
  if (!target.closest(".relative")) {
    isProfileDropdownOpen.value = false;
    showNotifications.value = false;
  }
};

const updateWindowWidth = () => {
  if (typeof window !== "undefined") {
    windowWidth.value = window.innerWidth;
  }
};

onMounted(() => {
  updateWindowWidth();
  window.addEventListener("resize", updateWindowWidth);
  document.addEventListener("click", handleClickOutside);

  // Appliquer le thème au chargement
  themeStore.applyTheme();
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWindowWidth);
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style>
/* Pour le line-clamp (couper le texte sur plusieurs lignes) */
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

/* Optimisation mobile */
@media (max-width: 640px) {
  .line-clamp-1 {
    -webkit-line-clamp: 1;
  }

  .line-clamp-2 {
    -webkit-line-clamp: 2;
  }
}
</style>
