<template>
  <!-- Overlay mobile -->
  <div
    v-if="themeStore.isMobileSidebarOpen"
    @click="closeMobileSidebar"
    class="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
  ></div>

  <!-- Le délégué et le sous délégué peuvent enregistrer la liste des présences-->

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-white dark:bg-gray-900 shadow-xl',
      themeStore.isSidebarOpen ? 'w-80' : 'w-20',
      themeStore.isMobileSidebarOpen
        ? 'translate-x-0'
        : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <!-- Zone Logo avec toggle -->
    <div
      class="h-20 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800"
      :class="{ 'justify-center': !themeStore.isSidebarOpen }"
    >
      <div v-if="themeStore.isSidebarOpen" class="w-full">
        <div
          v-if="appLogo"
          class="w-full h-16 flex items-center justify-center"
        >
          <img
            :src="appLogo"
            alt="Logo établissement"
            class="max-h-16 object-contain"
          />
        </div>

        <div v-else class="flex items-center space-x-3">
          <!-- Logo SVG -->
          <div
            class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md"
          >
            <svg
              class="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"
              />
            </svg>
          </div>

          <!-- Texte -->
          <div>
            <h1 class="text-xl font-bold text-blue-600">Gestion Ecole</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              v2.0 • Dashboard
            </p>
          </div>
        </div>
      </div>

      <!-- Logo réduit -->
      <div
        v-else
        class="w-10 h-10 rounded-xl flex items-center justify-center shadow-md overflow-hidden bg-white"
      >
        <img
          v-if="appLogo"
          :src="appLogo"
          alt="Logo établissement"
          class="w-full h-full object-cover"
        />

        <svg
          v-else
          class="w-6 h-6 text-white bg-gradient-to-br from-blue-600 to-indigo-700 p-1 rounded-lg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"
          />
        </svg>
      </div>

      <!-- Bouton toggle pour desktop -->
      <button
        v-if="themeStore.isSidebarOpen"
        @click="themeStore.toggleSidebar?.()"
        class="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
          />
        </svg>
      </button>
    </div>

    <!-- Profil utilisateur (version compacte) -->
    <div
      v-if="themeStore.isSidebarOpen"
      class="px-4 py-4 border-b border-gray-100 dark:border-gray-800"
    >
      <div class="flex items-center space-x-3">
        <div class="relative">
          <div
            class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-600 flex items-center justify-center text-white font-semibold"
            style="background: #3746e9"
          >
            {{ getUserInitials() }}
          </div>
          <span
            class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"
          ></span>
        </div>
        <div class="flex-1 min-w-0">
          <p
            class="text-sm font-semibold text-gray-900 dark:text-white truncate"
          >
            {{ getUserName() }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
            {{ getPrimaryRole() }}
          </p>
        </div>
      </div>
    </div>

    <!-- Menu avec scroll personnalisé -->
    <div class="h-[calc(100vh-8rem)] overflow-y-auto py-4 sidebar-scroll">
      <nav class="px-3">
        <!-- QUICK ACTIONS - Barre d'actions rapides -->

        <!-- SECTION MON ESPACE - Refonte moderne -->
        <section v-if="showMonEspaceSection" class="mb-6">
          <div class="flex items-center px-2 mb-2">
            <div class="w-1 h-5 bg-blue-600 rounded-full"></div>
            <h2
              v-if="themeStore.isSidebarOpen"
              class="ml-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
            >
              Mon espace
            </h2>
          </div>

          <ul class="space-y-1">
            <!-- Dashboard - carte active -->
            <li
              v-if="
                hasAnyRole([
                  'directeur-general-adjoint',
                  'directeur-general',
                  'responsable-du-site',
                  'directeur-academique',
                  'responsable-marketing',
                  'collaborateur-commercial',
                  'admin',
                  'informaticien',
                  'charge-de-la-clientele'
                ])
              "
            >
              <NuxtLink
                to="/"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/'
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/'
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"
                    />
                  </svg>
                </div>
                <span
                  v-if="themeStore.isSidebarOpen"
                  class="ml-3 font-medium flex-1"
                >
                  Tableau de bord
                </span>
                <div
                  v-if="themeStore.isSidebarOpen && $route.path === '/'"
                  class="w-1.5 h-1.5 bg-blue-600 rounded-full"
                ></div>
              </NuxtLink>
            </li>

            <!-- Actualités pour tous -->
            <li>
              <NuxtLink
                to="/actualites"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path.startsWith('/actualites')
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path.startsWith('/actualites')
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
                    />
                  </svg>
                </div>
                <span
                  v-if="themeStore.isSidebarOpen"
                  class="ml-3 font-medium flex-1"
                >
                  Actualités
                </span>
                <div
                  v-if="themeStore.isSidebarOpen && $route.path.startsWith('/actualites')"
                  class="w-1.5 h-1.5 bg-blue-600 rounded-full"
                ></div>
              </NuxtLink>
            </li>

            <li
              v-if="
                hasAnyRole([
                  'etudiant',
                  'enseignant',
                  'surveillant',
                  'titulaire-dune-classe',
                  'directeur-academique',
                  'logiticien-academique',
                  'directeur-general-adjoint',
                  'directeur-general',
                  'responsable-du-site',
                  'directeur-general',
                  'admin',
                  'directeur-des-affaires-financieres',
                  'responsable-administratif-et-financier',
                  'informaticien',
                  'charge-de-la-clientele'
                ])
              "
            >
              <NuxtLink
                to="/emploi-du-temps"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/emploi-du-temps'
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/emploi-du-temps'
                      ? 'bg-amber-100 dark:bg-amber-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span
                  v-if="themeStore.isSidebarOpen"
                  class="ml-3 font-medium flex-1"
                  >Emploi du temps</span
                >
                <div
                  v-if="
                    themeStore.isSidebarOpen &&
                    $route.path === '/emploi-du-temps'
                  "
                  class="w-1.5 h-1.5 bg-amber-600 rounded-full"
                ></div>
              </NuxtLink>
            </li>

            <!-- Info personnelle -->
            <li>
              <NuxtLink
                to="/profile/info"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/profile/info'
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/profile/info'
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Info personnelle</span
                >
              </NuxtLink>
            </li>

            <!-- Réclamations -->
            <li
              v-if="
                hasAnyRole([
                  'surveillant',
                  'directeur-general',
                  'directeur-academique',
                  'logiticien-academique',
                  'admin',
                ])
              "
            >
              <NuxtLink
                to="/reclamations"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/reclamations'
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/reclamations'
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Réclamations</span
                >

                <span
                  v-if="reclamationStore.reclamationsEnAttenteCount > 0"
                  class="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full"
                >
                  {{ reclamationStore.reclamationsEnAttenteCount }}
                </span>
              </NuxtLink>
            </li>
            <li v-if="hasAnyRole(['etudiant']) && !isStudentBlocked">
              <NuxtLink
                to="/evaluations/etudiant/mes-examens"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/evaluations/etudiant/mes-examens'
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/evaluations/etudiant/mes-examens'
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <!-- SVG Étudiant: Livre + Crayon (pour les examens à composer) -->
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5v14"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 5v14"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Mes examens</span
                >
              </NuxtLink>
            </li>
            <li
              v-if="
                hasAnyRole([
                  'enseignant',
                  'admin',
                  'directeur-general-adjoint',
                  'professeur',
                  'directeur-academiqiue',
                  'logiticien-academique',
                  'informaticien',
                ])
              "
            >
              <NuxtLink
                to="/evaluations/professeur/mes-examens"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/evaluations/professeur/mes-examens'
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/evaluations/professeur/mes-examens'
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <!-- SVG Professeur: Tableau + Craie (pour créer/corriger) -->
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 11h8"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 15h4"
                    />
                    <circle
                      cx="18"
                      cy="8"
                      r="2"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Mes examens</span
                >
              </NuxtLink>
            </li>
            <li v-if="hasAnyRole(['enseignant', 'delegue', 'etudiant'])">
              <NuxtLink
                to="/presences/liste-des-presences"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/presences/liste-des-presences'
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/presences/liste-des-presences'
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Présences</span
                >

                <span
                  v-if="reclamationStore.reclamationsEnAttenteCount > 0"
                  class="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full"
                >
                  {{ reclamationStore.reclamationsEnAttenteCount }}
                </span>
              </NuxtLink>
            </li>
            <li v-if="hasAnyRole(['surveillant', 'admin', 'stagiaire'])">
              <NuxtLink
                to="/presences/presences-des-etudiants"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/presences/presences-des-etudiants'
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/presences/presences-des-etudiants'
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Présences des étudiants</span
                >

                <span
                  v-if="reclamationStore.reclamationsEnAttenteCount > 0"
                  class="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full"
                >
                  {{ reclamationStore.reclamationsEnAttenteCount }}
                </span>
              </NuxtLink>
            </li>
            <li v-if="hasAnyRole(['etudiant'])">
              <NuxtLink
                to="/etudiant/annonces"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/etudiant/annonces'
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/etudiant/annonces'
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path
                      fill-rule="evenodd"
                      d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Annonces</span
                >
              </NuxtLink>
            </li>
            <!-- Mes paiements -->
            <!-- <li v-if="hasAnyRole(['etudiant'])">
              <NuxtLink
                to="/etudiant/mes-paiements"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/etudiant/mes-paiements'
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/etudiant/mes-paiements'
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path
                      fill-rule="evenodd"
                      d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Mes paiements</span
                >
              </NuxtLink>
            </li> -->
            <li v-if="hasAnyRole(['etudiant'])">
              <NuxtLink
                to="/etudiant/mes-notes"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/etudiant/mes-notes'
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/etudiant/mes-paiements'
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path
                      fill-rule="evenodd"
                      d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Mes notes</span
                >
              </NuxtLink>
            </li>
          </ul>
        </section>

        <!-- SECTION ADMINISTRATION ACADÉMIQUE -->
        <section v-if="showAdminAcademiqueSection" class="mb-6">
          <div class="flex items-center px-2 mb-2">
            <div class="w-1 h-5 bg-amber-500 rounded-full"></div>
            <h2
              v-if="themeStore.isSidebarOpen"
              class="ml-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
            >
              Administration académique
            </h2>
          </div>

          <ul class="space-y-1">
            <!-- Emploi du temps
						<li
							v-if="
								hasAnyRole([
									'directeur-academique',
									'logiticien-academique',
									'surveillant',
									'professeur',
									'charge-de-la-clientele',
									'responsable-marketing',
								])
							"
						>
							<NuxtLink
								to="/emploi-du-temps"
								class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
								:class="[
									$route.path === '/emploi-du-temps'
										? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-400'
										: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
								]"
								@click="toggleMobileMenu"
							>
								<div
									:class="[
										'p-1 rounded-lg',
										$route.path === '/emploi-du-temps'
											? 'bg-amber-100 dark:bg-amber-900/30'
											: 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
									]"
								>
									<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
								<span
									v-if="themeStore.isSidebarOpen"
									class="ml-3 font-medium flex-1"
									>Emploi du temps</span
								>
								<div
									v-if="
										themeStore.isSidebarOpen &&
										$route.path === '/emploi-du-temps'
									"
									class="w-1.5 h-1.5 bg-amber-600 rounded-full"
								></div>
							</NuxtLink>
						</li> -->
            <li
              v-if="
                hasAnyRole([
                  'directeur-academique',
                  'logiticien-academique',
                  'surveillant',
                  'professeur',
                  'directeur-general',
                  'charge-de-la-clientele',
                  'responsable-marketing',
                  'admin',
                  'informaticien',
                ])
              "
            >
              <NuxtLink
                to="/emploi-du-temps/exporter"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/emploi-du-temps/exporter'
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/emploi-du-temps/exporter'
                      ? 'bg-amber-100 dark:bg-amber-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span
                  v-if="themeStore.isSidebarOpen"
                  class="ml-3 font-medium flex-1"
                  >Etat emploi du temps</span
                >
                <div
                  v-if="
                    themeStore.isSidebarOpen &&
                    $route.path === '/emploi-du-temps/exporter'
                  "
                  class="w-1.5 h-1.5 bg-amber-600 rounded-full"
                ></div>
              </NuxtLink>
            </li>

            <!-- Présences à valider avec badge -->
            <!-- <li
              v-if="
                hasAnyRole([
                  'directeur-academique',
                  'logiticien-academique',
                  'surveillant',
                ])
              "
            >
              <NuxtLink
                to="/presences-validation"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/presences-validation'
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/presences-validation'
                      ? 'bg-amber-100 dark:bg-amber-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M5 11h10v2H5v-2z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span
                  v-if="themeStore.isSidebarOpen"
                  class="ml-3 font-medium flex items-center justify-between flex-1"
                >
                  Présences à valider
                  <span
                    class="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full"
                  >
                    3
                  </span>
                </span>
              </NuxtLink>
            </li> -->

            <!-- Années scolaires -->

            <!-- Filières & Parcours (Dropdown) -->
            <li
              v-if="
                hasAnyRole([
                  'directeur-academique',
                  'directeur-general-adjoint',
                  'directeur-general',
                  'admin',
                  'informaticien',
                  'logiticien-academique',
                  'responsable-marketing',
                  
                ])
              "
            >
              <button
                type="button"
                class="flex items-center justify-between w-full px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  activeDropdown === 'filieres'
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleDropdown('filieres')"
              >
                <div class="flex items-center">
                  <div
                    :class="[
                      'p-1 rounded-lg',
                      activeDropdown === 'filieres'
                        ? 'bg-amber-100 dark:bg-amber-900/30'
                        : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                    ]"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"
                      />
                    </svg>
                  </div>
                  <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                    >Filières & Parcours</span
                  >
                </div>
                <svg
                  v-if="themeStore.isSidebarOpen"
                  class="w-4 h-4 transition-transform duration-200"
                  :class="{ 'rotate-180': activeDropdown === 'filieres' }"
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

              <vue-collapsible :isOpen="activeDropdown === 'filieres'">
                <ul class="pl-11 space-y-1 mt-1">
                  <li>
                    <NuxtLink
                      to="/filieres/liste"
                      class="block px-3 py-2 text-sm rounded-lg transition-colors"
                      :class="[
                        $route.path === '/filieres/liste'
                          ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                      ]"
                      @click="toggleMobileMenu"
                    >
                      Liste des filières
                    </NuxtLink>
                  </li>
                  <!-- Les autres liens commentés restent inchangés -->
                </ul>
              </vue-collapsible>
            </li>

            <!-- Matières & Évaluations (Dropdown) -->
            <li
              v-if="
                hasAnyRole([
                  'directeur-academique',
                  'directeur-general',
                  'directeur-general-adjoint',
                  'directeur-general',
                  'admin',
                  'informaticien',
                  'logiticien-academique',
                  'responsable-marketing',
                ])
              "
            >
              <button
                type="button"
                class="flex items-center justify-between w-full px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  activeDropdown === 'matieres'
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleDropdown('matieres')"
              >
                <div class="flex items-center">
                  <div
                    :class="[
                      'p-1 rounded-lg',
                      activeDropdown === 'matieres'
                        ? 'bg-amber-100 dark:bg-amber-900/30'
                        : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                    ]"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"
                      />
                    </svg>
                  </div>
                  <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                    >Matières & Évaluations</span
                  >
                </div>
                <svg
                  v-if="themeStore.isSidebarOpen"
                  class="w-4 h-4 transition-transform duration-200"
                  :class="{ 'rotate-180': activeDropdown === 'matieres' }"
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

              <vue-collapsible :isOpen="activeDropdown === 'matieres'">
                <ul class="pl-11 space-y-1 mt-1">
                  <li v-if="showUe">
                    <NuxtLink
                      to="/ues/liste"
                      class="block px-3 py-2 text-sm rounded-lg transition-colors"
                      :class="[
                        $route.path === '/ues/liste'
                          ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                      ]"
                      @click="toggleMobileMenu"
                    >
                      Liste des unités d'enseignement
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      to="/uvs/liste"
                      class="block px-3 py-2 text-sm rounded-lg transition-colors"
                      :class="[
                        $route.path === '/uvs/liste'
                          ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                      ]"
                      @click="toggleMobileMenu"
                    >
                      Liste des matières
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      to="/evaluations/liste"
                      class="block px-3 py-2 text-sm rounded-lg transition-colors"
                      :class="[
                        $route.path === '/evaluations/liste'
                          ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                      ]"
                      @click="toggleMobileMenu"
                    >
                      Liste des évaluations
                    </NuxtLink>
                  </li>
                </ul>
              </vue-collapsible>
            </li>

            <!-- Gestion des salles -->
            <li
              v-if="
                hasAnyRole([
                  'directeur-academique',
                  'logiticien-academique',
                  'responsable-des-achats-et-de-la-logistique',
                  'directeur-general',
                  'admin',
                  'informaticien',
                  'responsable-marketing',
                ])
              "
            >
              <NuxtLink
                to="/salles"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/salles'
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/salles'
                      ? 'bg-amber-100 dark:bg-amber-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Gestion des salles</span
                >
              </NuxtLink>
            </li>

            <!-- Gestion des groupes -->
            <li
              v-if="
                hasAnyRole([
                  'directeur-academique',
                  'surveillant',
                  'logiticien-academique',
                  'directeur-general',
                  'admin',
                  'informaticien',
                ])
              "
            >
              <NuxtLink
                to="/groupes"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/groupes'
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/groupes'
                      ? 'bg-amber-100 dark:bg-amber-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Gestion des groupes</span
                >
              </NuxtLink>
            </li>
            <li
              v-if="
                hasAnyRole([
                  'directeur-academique',
                  'surveillant',
                  'logiticien-academique',
                  'directeur-general',
                  'directeur-general-adjoint',
                  'responsable-marketing',
                  'charge-de-la-clientele',
                  'collaborateur-commercial',
                  'responsable-des-achats-et-de-la-logistique',
                  'responsable-administratif-et-financier',
                  'directeur-des-affaires-financieres',
                  'admin',
                  'informaticien',
                ])
              "
            >
              <NuxtLink
                to="/admin/liste-des-etudiants"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/admin/liste-des-etudiants'
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/admin/liste-des-etudiants'
                      ? 'bg-amber-100 dark:bg-amber-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Liste des étudiants</span
                >
              </NuxtLink>
            </li>
          </ul>
        </section>

        <!-- SECTION GESTION FINANCIÈRE -->
        <section v-if="showFinanceSection" class="mb-6">
          <div class="flex items-center px-2 mb-2">
            <div class="w-1 h-5 bg-emerald-500 rounded-full"></div>
            <h2
              v-if="themeStore.isSidebarOpen"
              class="ml-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
            >
              Gestion financière
            </h2>
          </div>

          <ul class="space-y-1">
            <li
              v-if="
                hasAnyRole([
                  'responsable-administratif-et-financier',
                  'directeur-general-adjoint',
                  'directeur-des-affaires-financieres',
                  'directeur-general',
                  'admin',
                  'informaticien',
                  'charge-de-la-clientele'
                ])
              "
            >
              <NuxtLink
                to="/finance/dashboard"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/finance/dashboard'
                    ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 text-emerald-700 dark:text-emerald-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/finance/dashboard'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Dashboard financier</span
                >
              </NuxtLink>
            </li>
            <!-- 
            <li
              class="space-y-1"
              v-if="
                hasAnyRole([
                  'responsable-administratif-et-financier',
                  'directeur-general-adjoint',
                ])
              "
            >
              <button
                type="button"
                class="flex items-center justify-between w-full px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  activeDropdown === 'paiements'
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleDropdown('paiements')"
              >
                <div class="flex items-center">
                  <div
                    :class="[
                      'p-1 rounded-lg',
                      activeDropdown === 'paiements'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30'
                        : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                    ]"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path
                        fill-rule="evenodd"
                        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                    >Paiements & Factures</span
                  >
                </div>
                <svg
                  v-if="themeStore.isSidebarOpen"
                  class="w-4 h-4 transition-transform duration-200"
                  :class="{ 'rotate-180': activeDropdown === 'paiements' }"
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

              <vue-collapsible :isOpen="activeDropdown === 'paiements'">
                <ul class="pl-11 space-y-1 mt-1">
                  <li>
                    <NuxtLink
                      to="/finance/paiements"
                      class="block px-3 py-2 text-sm rounded-lg transition-colors"
                      :class="[
                        $route.path === '/finance/paiements'
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                      ]"
                      @click="toggleMobileMenu"
                    >
                      État des paiements
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      to="/finance/factures"
                      class="block px-3 py-2 text-sm rounded-lg transition-colors"
                      :class="[
                        $route.path === '/finance/factures'
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                      ]"
                      @click="toggleMobileMenu"
                    >
                      Générer factures
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      to="/finance/export"
                      class="block px-3 py-2 text-sm rounded-lg transition-colors"
                      :class="[
                        $route.path === '/finance/export'
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                      ]"
                      @click="toggleMobileMenu"
                    >
                      Export Excel/PDF
                    </NuxtLink>
                  </li>
                </ul>
              </vue-collapsible>
            </li>

            <li
              v-if="
                hasAnyRole([
                  'responsable-administratif-et-financier',
                  'directeur-general-adjoint',
                ])
              "
            >
              <NuxtLink
                to="/finance/budgets"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/finance/budgets'
                    ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 text-emerald-700 dark:text-emerald-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/finance/budgets'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662c.722-.481 1.324-1.256 1.324-2.246 0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Budgets & Dépenses</span
                >
              </NuxtLink>
            </li> -->
            <li
              v-if="
                hasAnyRole([
                  'responsable-administratif-et-financier',
                  'directeur-general-adjoint',
                  'directeur-general',
                  'directeur-des-affaires-financieres',
                  'admin',
                  'informaticien',
                  'charge-de-la-clientele'
                ])
              "
            >
              <NuxtLink
                to="/frais-de-scolarite/liste"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/frais-de-scolarite/liste'
                    ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 text-emerald-700 dark:text-emerald-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/frais-de-scolarite/liste'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662c.722-.481 1.324-1.256 1.324-2.246 0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Frais de scolarité</span
                >
              </NuxtLink>
               <NuxtLink
                to="/frais-inscription/liste-des-frais-inscription"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/frais-inscription/liste-des-frais-inscription'
                    ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 text-emerald-700 dark:text-emerald-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/frais-inscription/liste-des-frais-inscription'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662c.722-.481 1.324-1.256 1.324-2.246 0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Frais d'inscription</span
                >
              </NuxtLink>
            </li>
            <li
              v-if="
                hasAnyRole([
                  'responsable-administratif-et-financier',
                  'directeur-general-adjoint',
                  'directeur-general',
                  'directeur-des-affaires-financieres',
                  'admin',
                  'informaticien',
                  'charge-de-la-clientele'
                ])
              "
            >
              <NuxtLink
                to="/bourses/liste"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/bourses/liste'
                    ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 text-emerald-700 dark:text-emerald-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/bourses/liste'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M12 2L2 7v2l10 5 10-5V7l-10-5zM4 9v5l8 4 8-4V9l-8 4-8-4zm0 7v4h16v-4h-2v2H6v-2H4z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662c.722-.481 1.324-1.256 1.324-2.246 0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Bourse</span
                >
              </NuxtLink>
            </li>
            <li
              v-if="
                hasAnyRole([
                  'responsable-administratif-et-financier',
                  'directeur-general-adjoint',
                  'directeur-general',
                  'directeur-des-affaires-financieres',
                  'admin',
                  'charge-de-la-clientele'
                ])
              "
            >
              <NuxtLink
                to="/admin/negociations"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/admin/negociations'
                    ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 text-emerald-700 dark:text-emerald-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/admin/negociations'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v12h14V6H5zm4 2v2H7V8h2zm8 0v2h-2V8h2zM8 12h8v2H8v-2zm0 4h4v2H8v-2z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662c.722-.481 1.324-1.256 1.324-2.246 0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Echancier et paiements</span
                >
              </NuxtLink>
            </li>
            <li
              v-if="
                hasAnyRole([
                  'responsable-administratif-et-financier',
                  'directeur-general-adjoint',
                  'directeur-general',
                  'directeur-des-affaires-financieres',
                  'admin',
                ])
              "
            >
              <NuxtLink
                to="/admin/paiements/exports/etat-des-paiements"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/admin/paiements/exports/etat-des-paiements'
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 text-emerald-700 dark:text-emerald-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path ===
                    '/admin/paiements/exports/etat-des-paiements'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <!-- Icône alternative avec document et graphique -->
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clip-rule="evenodd"
                    />
                    <path d="M11 3.5V7h3.5L11 3.5z" />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >État des paiements</span
                >
              </NuxtLink>
            </li>
            <li
              v-if="
                hasAnyRole([
                  'responsable-administratif-et-financier',
                  'directeur-general-adjoint',
                  'directeur-general',
                  'directeur-des-affaires-financieres',
                  'charge-de-la-clientele',
                  'admin'
                ])
              "
            >
              <NuxtLink
                to="/admin/paiements"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/admin/paiements'
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/admin/paiements'
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <!-- Icône de billet/transaction -->
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path
                      fill-rule="evenodd"
                      d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                      clip-rule="evenodd"
                    />
                    <path d="M15 12h1a1 1 0 110 2h-1a1 1 0 110-2z" />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Paiements</span
                >
              </NuxtLink>
            </li>

            <li
              v-if="
                hasAnyRole([
                  'responsable-administratif-et-financier',
                  'directeur-general-adjoint',
                  'directeur-general',
                  'directeur-des-affaires-financieres',
                  'admin',
                  'charge-de-la-clientele'
                ])
              "
            >
              <NuxtLink
                to="/admin/etudiants/situation"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/admin/etudiants/situation'
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/admin/etudiants/situation'
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <!-- Icône de billet/transaction -->
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path
                      fill-rule="evenodd"
                      d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                      clip-rule="evenodd"
                    />
                    <path d="M15 12h1a1 1 0 110 2h-1a1 1 0 110-2z" />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Situation des paiements</span
                >
              </NuxtLink>
            </li>

            <li
              v-if="
                hasAnyRole([
                  'responsable-administratif-et-financier',
                  'directeur-general-adjoint',
                  'directeur-general',
                  'directeur-des-affaires-financieres',
                  'admin',
                  'charge-de-la-clientele'
                ])
              "
            >
              <NuxtLink
                to="/finance/configuration-tranche-de-paiement"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/finance/configuration-tranche-de-paiement'
                    ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 text-emerald-700 dark:text-emerald-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/finance/configuration-tranche-de-paiement'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M7 3h10a2 2 0 012 2v2h-2V5H7v2H5V5a2 2 0 012-2zM5 9h14v2H5V9zm0 4h14v2H5v-2zm2 4h10v2H7v-2z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662c.722-.481 1.324-1.256 1.324-2.246 0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Tranche de paiement</span
                >
              </NuxtLink>
            </li>

            <!-- Dashboard Financier -->
            <li
              v-if="
                hasAnyRole([
                  'responsable-administratif-et-financier',
                  'directeur-general-adjoint',
                  'directeur-general',
                  'directeur-des-affaires-financieres',
                  'admin',
                ])
              "
            >
              <NuxtLink
                to="/finance/dashboard"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path.startsWith('/finance/dashboard')
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-700 dark:text-indigo-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path.startsWith('/finance/dashboard')
                      ? 'bg-indigo-100 dark:bg-indigo-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Dashboard Financier</span
                >
              </NuxtLink>
            </li>

            <!-- Suivi du Recouvrement -->
            <li
              v-if="
                hasAnyRole([
                  'responsable-administratif-et-financier',
                  'directeur-general-adjoint',
                  'directeur-general',
                  'directeur-des-affaires-financieres',
                  'admin',
                  'charge-de-la-clientele'
                ])
              "
            >
              <NuxtLink
                to="/finance/recouvrement"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path.startsWith('/finance/recouvrement')
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 text-emerald-700 dark:text-emerald-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path.startsWith('/finance/recouvrement')
                      ? 'bg-emerald-100 dark:bg-emerald-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Suivi du Recouvrement</span
                >
              </NuxtLink>
            </li>

            <!-- Gestion des Dépenses -->
            <li
              v-if="
                hasAnyRole([
                  'responsable-administratif-et-financier',
                  'directeur-general-adjoint',
                  'directeur-general',
                  'directeur-des-affaires-financieres',
                  'admin',
                  'charge-de-la-clientele'
                ])
              "
            >
              <NuxtLink
                to="/finance/depenses"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path.startsWith('/finance/depenses')
                    ? 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 text-red-700 dark:text-red-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path.startsWith('/finance/depenses')
                      ? 'bg-red-100 dark:bg-red-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Gestion des Dépenses</span
                >
              </NuxtLink>
            </li>
          </ul>
        </section>

        <!-- SECTION CANDIDATURES & ADMISSIONS -->
        <section v-if="showCandidaturesSection" class="mb-6">
          <div class="flex items-center px-2 mb-2">
            <div class="w-1 h-5 bg-purple-500 rounded-full"></div>
            <h2
              v-if="themeStore.isSidebarOpen"
              class="ml-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
            >
              Candidatures
            </h2>
          </div>

          <ul class="space-y-1">
            <li
              class="space-y-1"
              v-if="
                hasAnyRole([
                  'directeur-general-adjoint',
                  'charge-de-la-clientele',
                  'responsable-marketing',
                  'admin',
                  'informaticien',
                  'directeur-general',
                  'directeur-academique',
                  'logiticien-academique',
                ])
              "
            >
              <button
                type="button"
                class="flex items-center justify-between w-full px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  activeDropdown === 'candidatures'
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleDropdown('candidatures')"
              >
                <div class="flex items-center">
                  <div
                    :class="[
                      'p-1 rounded-lg',
                      activeDropdown === 'candidatures'
                        ? 'bg-purple-100 dark:bg-purple-900/30'
                        : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                    ]"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path
                        fill-rule="evenodd"
                        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                    >Gestion des candidatures</span
                  >
                </div>
                <svg
                  v-if="themeStore.isSidebarOpen"
                  class="w-4 h-4 transition-transform duration-200"
                  :class="{ 'rotate-180': activeDropdown === 'candidatures' }"
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

              <vue-collapsible :isOpen="activeDropdown === 'candidatures'">
                <ul class="pl-11 space-y-1 mt-1">
                  <li>
                    <NuxtLink
                      to="/admin/candidatures/inscription"
                      class="block px-3 py-2 text-sm rounded-lg transition-colors"
                      :class="[
                        $route.path === '/admin/candidatures/inscription'
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                      ]"
                      @click="toggleMobileMenu"
                    >
                      Dépôt de candidature
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      to="/candidatures/etude-dossier"
                      class="block px-3 py-2 text-sm rounded-lg transition-colors"
                      :class="[
                        $route.path === '/candidatures/etude-dossier'
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                      ]"
                      @click="toggleMobileMenu"
                    >
                      Étude de dossier
                    </NuxtLink>
                  </li>
                  <li
                    v-if="
                      hasAnyRole([
                        'directeur-general-adjoint',
                        'responsable-administratif-et-financier',
                        'admin',
                      ])
                    "
                  >
                    <NuxtLink
                      to="/candidatures/payement"
                      class="block px-3 py-2 text-sm rounded-lg transition-colors"
                      :class="[
                        $route.path === '/candidatures/payement'
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                      ]"
                      @click="toggleMobileMenu"
                    >
                      Paiement Concours/Dossier
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      to="/candidatures/declaration-admission"
                      class="block px-3 py-2 text-sm rounded-lg transition-colors"
                      :class="[
                        $route.path === '/candidatures/declaration-admission'
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                      ]"
                      @click="toggleMobileMenu"
                    >
                      Admission
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      to="/candidatures/admis"
                      class="block px-3 py-2 text-sm rounded-lg transition-colors"
                      :class="[
                        $route.path === '/candidatures/admis'
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                      ]"
                      @click="toggleMobileMenu"
                    >
                      Inscription Finale
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      to="/admin/etudiants/reinscription"
                      class="block px-3 py-2 text-sm rounded-lg transition-colors"
                      :class="[
                        $route.path === '/admin/etudiants/reinscription'
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                      ]"
                      @click="toggleMobileMenu"
                    >
                      Réinscription
                    </NuxtLink>
                  </li>
                </ul>
              </vue-collapsible>
            </li>
          </ul>
        </section>

        <!-- SECTION GESTION DU PERSONNEL -->
        <section v-if="showPersonnelSection" class="mb-6">
          <div class="flex items-center px-2 mb-2">
            <div class="w-1 h-5 bg-indigo-500 rounded-full"></div>
            <h2
              v-if="themeStore.isSidebarOpen"
              class="ml-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
            >
              Personnel
            </h2>
          </div>

          <ul class="space-y-1">
            <li
              v-if="
                hasAnyRole([
                  'directeur-general-adjoint',
                  'directeur-academique',
                  'responsable-administratif-et-financier',
                  'informaticien',
                  'directeur-general',
                  'logiticien-academique',
                  'admin',
                ])
              "
            >
              <button
                type="button"
                class="flex items-center justify-between w-full px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  activeDropdown === 'personnel'
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleDropdown('personnel')"
              >
                <div class="flex items-center">
                  <div
                    :class="[
                      'p-1 rounded-lg',
                      activeDropdown === 'personnel'
                        ? 'bg-indigo-100 dark:bg-indigo-900/30'
                        : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                    ]"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
                      />
                    </svg>
                  </div>
                  <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                    >Personnel</span
                  >
                </div>
                <svg
                  v-if="themeStore.isSidebarOpen"
                  class="w-4 h-4 transition-transform duration-200"
                  :class="{ 'rotate-180': activeDropdown === 'personnel' }"
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

              <vue-collapsible :isOpen="activeDropdown === 'personnel'">
                <ul class="pl-11 space-y-1 mt-1">
                  <li
                    v-if="
                      hasAnyRole([
                        'directeur-general-adjoint',
                        'responsable-administratif-et-financier',
                        'informaticien',
                        'directeur-general',
                        'admin',
                        'logiticien-academique',
                        'directeur-academique'
                      ])
                    "
                  >
                    <NuxtLink
                      to="/personnel/utilisateurs"
                      class="block px-3 py-2 text-sm rounded-lg transition-colors"
                      :class="[
                        $route.path === '/personnel/utilisateurs'
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                      ]"
                      @click="toggleMobileMenu"
                    >
                      Liste des utilisateurs
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      to="/personnel/enseignants"
                      class="block px-3 py-2 text-sm rounded-lg transition-colors"
                      :class="[
                        $route.path === '/personnel/enseignants'
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                      ]"
                      @click="toggleMobileMenu"
                    >
                      Liste des enseignants
                    </NuxtLink>
                  </li>
                </ul>
              </vue-collapsible>
            </li>
          </ul>
        </section>

        <!-- SECTION RÔLES & PERMISSIONS -->
        <!-- <section v-if="hasAnyRole(['responsable-du-site', 'informaticien'])" class="mb-6">
					<div class="flex items-center px-2 mb-2">
						<div class="w-1 h-5 bg-rose-500 rounded-full"></div>
						<h2 v-if="themeStore.isSidebarOpen" class="ml-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
							Administration
						</h2>
					</div>
					
					<ul class="space-y-1">
						<li>
							<NuxtLink
								to="/roles-permissions/utilisateurs"
								class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
								:class="[$route.path === '/roles-permissions/utilisateurs' ? 'bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 text-rose-700 dark:text-rose-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300']"
								@click="toggleMobileMenu"
							>
								<div :class="['p-1 rounded-lg', $route.path === '/roles-permissions/utilisateurs' ? 'bg-rose-100 dark:bg-rose-900/30' : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700']">
									<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
										<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
									</svg>
								</div>
								<span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium">Utilisateurs</span>
							</NuxtLink>
						</li>
						<li>
							<NuxtLink
								to="/roles-permissions/roles"
								class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
								:class="[$route.path === '/roles-permissions/roles' ? 'bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 text-rose-700 dark:text-rose-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300']"
								@click="toggleMobileMenu"
							>
								<div :class="['p-1 rounded-lg', $route.path === '/roles-permissions/roles' ? 'bg-rose-100 dark:bg-rose-900/30' : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700']">
									<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clip-rule="evenodd" />
									</svg>
								</div>
								<span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium">Gestion des rôles</span>
							</NuxtLink>
						</li>
						<li v-if="hasRole('informaticien')">
							<NuxtLink
								to="/logs"
								class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
								:class="[$route.path === '/logs' ? 'bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 text-rose-700 dark:text-rose-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300']"
								@click="toggleMobileMenu"
							>
								<div :class="['p-1 rounded-lg', $route.path === '/logs' ? 'bg-rose-100 dark:bg-rose-900/30' : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700']">
									<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
										<path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm2 0a6 6 0 1012 0 6 6 0 00-12 0zm3 0a3 3 0 116 0 3 3 0 01-6 0z" />
									</svg>
								</div>
								<span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium">Logs système</span>
							</NuxtLink>
						</li>
					</ul>
				</section> -->
        <!-- <section v-if="hasAnyRole(['responsable-du-site', 'informaticien'])" class="mb-6">
					<div class="flex items-center px-2 mb-2">
						<div class="w-1 h-5 bg-rose-500 rounded-full"></div>
						<h2 v-if="themeStore.isSidebarOpen" class="ml-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
							Administration
						</h2>
					</div>
					
					<ul class="space-y-1">
						<li>
							<NuxtLink
								to="/roles-permissions/utilisateurs"
								class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
								:class="[$route.path === '/roles-permissions/utilisateurs' ? 'bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 text-rose-700 dark:text-rose-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300']"
								@click="toggleMobileMenu"
							>
								<div :class="['p-1 rounded-lg', $route.path === '/roles-permissions/utilisateurs' ? 'bg-rose-100 dark:bg-rose-900/30' : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700']">
									<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
										<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
									</svg>
								</div>
								<span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium">Utilisateurs</span>
							</NuxtLink>
						</li>
						<li>
							<NuxtLink
								to="/roles-permissions/roles"
								class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
								:class="[$route.path === '/roles-permissions/roles' ? 'bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 text-rose-700 dark:text-rose-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300']"
								@click="toggleMobileMenu"
							>
								<div :class="['p-1 rounded-lg', $route.path === '/roles-permissions/roles' ? 'bg-rose-100 dark:bg-rose-900/30' : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700']">
									<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clip-rule="evenodd" />
									</svg>
								</div>
								<span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium">Gestion des rôles</span>
							</NuxtLink>
						</li>
						<li v-if="hasRole('informaticien')">
							<NuxtLink
								to="/logs"
								class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
								:class="[$route.path === '/logs' ? 'bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 text-rose-700 dark:text-rose-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300']"
								@click="toggleMobileMenu"
							>
								<div :class="['p-1 rounded-lg', $route.path === '/logs' ? 'bg-rose-100 dark:bg-rose-900/30' : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700']">
									<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
										<path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm2 0a6 6 0 1012 0 6 6 0 00-12 0zm3 0a3 3 0 116 0 3 3 0 01-6 0z" />
									</svg>
								</div>
								<span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium">Logs système</span>
							</NuxtLink>
						</li>
					</ul>
				</section> -->

        <!-- SECTION ÉTUDIANTS -->
        <section v-if="hasRole('etudiant')" class="mb-6">
          <div class="flex items-center px-2 mb-2">
            <div class="w-1 h-5 bg-cyan-500 rounded-full"></div>
            <h2
              v-if="themeStore.isSidebarOpen"
              class="ml-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
            >
              Mon parcours et paiements
            </h2>
          </div>
          <ul class="space-y-1">
            <!-- Messages avec badge animé -->
            <li v-if="hasAnyRole(['etudiant'])">
              <NuxtLink
                to="/etudiant/mon-parcours"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/etudiant/mon-parcours'
                    ? 'bg-pink-50 dark:from-pink-900/20 dark:to-purple-900/20 text-pink-700 dark:text-pink-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/etudiant/mon-parcours'
                      ? 'bg-pink-100 dark:bg-pink-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"
                    />
                    <path
                      d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"
                    />
                  </svg>
                </div>
                <span
                  v-if="themeStore.isSidebarOpen"
                  class="ml-3 font-medium flex items-center justify-between flex-1"
                >
                  Mon parcours
                </span>
              </NuxtLink>
            </li>
          </ul>
        </section>

        <!-- SECTION ENSEIGNANTS -->
        <section v-if="hasRole('professeur')" class="mb-6">
          <div class="flex items-center px-2 mb-2">
            <div class="w-1 h-5 bg-orange-500 rounded-full"></div>
            <h2
              v-if="themeStore.isSidebarOpen"
              class="ml-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
            >
              Espace enseignant
            </h2>
          </div>
        </section>

        <!-- SECTION COMMUNICATION -->
        <section v-if="showCommunicationSection" class="mb-6">
          <div class="flex items-center px-2 mb-2">
            <div class="w-1 h-5 bg-pink-500 rounded-full"></div>
            <h2
              v-if="themeStore.isSidebarOpen"
              class="ml-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
            >
              Communication
            </h2>
          </div>

          <ul class="space-y-1">
            <!-- Messages avec badge animé -->
            <li
              v-if="
                hasAnyRole([
                  'charge-de-la-clientele',
                  'directeur-general',
                  'directeur-general-adjoint',
                  'admin',
                  'responsable-du-site',
                  'utilisateur-de-la-plateforme',
                  'informaticien',
                  'responsable-marketing',
                  'collaborateur-commercial',
                ])
              "
            >
              <NuxtLink
                to="/messages"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/messages'
                    ? 'bg-pink-50 dark:from-pink-900/20 dark:to-purple-900/20 text-pink-700 dark:text-pink-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/messages'
                      ? 'bg-pink-100 dark:bg-pink-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"
                    />
                    <path
                      d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"
                    />
                  </svg>
                </div>
                <span
                  v-if="themeStore.isSidebarOpen"
                  class="ml-3 font-medium flex items-center justify-between flex-1"
                >
                  Messages
                  <span
                    v-if="messageStore.totalUnread > 0"
                    class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse"
                  >
                    {{ messageStore.totalUnread }}
                  </span>
                </span>
              </NuxtLink>
            </li>

            <!-- Publications -->
            <li
              v-if="
                hasAnyRole([
                  'directeur-general-adjoint',
                  'directeur-academique',
                  'responsable-marketing',
                  'charge-de-la-clientele',
                  'directeur-general',
                  'admin',
                  'collaborateur-commercial',
                ])
              "
            >
              <button
                type="button"
                class="flex items-center justify-between w-full px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  activeDropdown === 'publications'
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleDropdown('publications')"
              >
                <div class="flex items-center">
                  <div
                    :class="[
                      'p-1 rounded-lg',
                      activeDropdown === 'publications'
                        ? 'bg-pink-100 dark:bg-pink-900/30'
                        : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                    ]"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                    >Publications</span
                  >
                </div>
                <svg
                  v-if="themeStore.isSidebarOpen"
                  class="w-4 h-4 transition-transform duration-200"
                  :class="{ 'rotate-180': activeDropdown === 'publications' }"
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

              <vue-collapsible :isOpen="activeDropdown === 'publications'">
                <ul class="pl-11 space-y-1 mt-1">
                  <li>
                    <NuxtLink
                      to="/publications/liste"
                      class="block px-3 py-2 text-sm rounded-lg transition-colors"
                      :class="[
                        $route.path === '/publications/liste'
                          ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                      ]"
                      @click="toggleMobileMenu"
                    >
                      Liste des publications
                    </NuxtLink>
                  </li>
                  <li
                    v-if="
                      hasAnyRole([
                        'directeur-academique',
                        'responsable-marketing',
                        'admin',
                        'collaborateur-commercial',
                      ])
                    "
                  >
                    <NuxtLink
                      to="/publications/ajouter-une-publication"
                      class="block px-3 py-2 text-sm rounded-lg transition-colors"
                      :class="[
                        $route.path === '/publications/ajouter'
                          ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                      ]"
                      @click="toggleMobileMenu"
                    >
                      + Ajouter une publication
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      to="/info-urgente/liste"
                      class="block px-3 py-2 text-sm rounded-lg transition-colors"
                      :class="[
                        $route.path.startsWith('/info-urgente')
                          ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                      ]"
                      @click="toggleMobileMenu"
                    >
                      Gestion des actualités
                    </NuxtLink>
                  </li>
                </ul>
              </vue-collapsible>
            </li>

            <!-- Événements -->
            <li
              v-if="
                hasAnyRole([
                  'responsable-marketing',
                  'directeur-general-adjoint',
                  'directeur-general',
                  'collaborateur-commercial',
                  'admin',
                ])
              "
            >
              <button
                type="button"
                class="flex items-center justify-between w-full px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  activeDropdown === 'evenements'
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleDropdown('evenements')"
              >
                <div class="flex items-center">
                  <div
                    :class="[
                      'p-1 rounded-lg',
                      activeDropdown === 'evenements'
                        ? 'bg-pink-100 dark:bg-pink-900/30'
                        : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                    ]"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                    >Événements</span
                  >
                </div>
                <svg
                  v-if="themeStore.isSidebarOpen"
                  class="w-4 h-4 transition-transform duration-200"
                  :class="{ 'rotate-180': activeDropdown === 'evenements' }"
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

              <vue-collapsible :isOpen="activeDropdown === 'evenements'">
                <ul class="pl-11 space-y-1 mt-1">
                  <li>
                    <NuxtLink
                      to="/evenements/liste"
                      class="block px-3 py-2 text-sm rounded-lg transition-colors"
                      :class="[
                        $route.path === '/evenements/liste'
                          ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                      ]"
                      @click="toggleMobileMenu"
                    >
                      Liste des événements
                    </NuxtLink>
                  </li>
                  <li
                    v-if="
                      hasAnyRole([
                        'responsable-marketing',
                        'collaborateur-commercial',
                      ])
                    "
                  >
                    <NuxtLink
                      to="/evenements/ajouter-un-evenement"
                      class="block px-3 py-2 text-sm rounded-lg transition-colors"
                      :class="[
                        $route.path === '/evenements/ajouter-un-evenement'
                          ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                      ]"
                      @click="toggleMobileMenu"
                    >
                      + Ajouter un événement
                    </NuxtLink>
                  </li>
                </ul>
              </vue-collapsible>
            </li>

            <!-- Partenaires -->
            <li
              v-if="
                hasAnyRole([
                  'responsable-marketing',
                  'directeur-general-adjoint',
                  'directeur-general',
                  'collaborateur-commercial',
                  'admin',
                ])
              "
            >
              <NuxtLink
                to="/partenaires/liste"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/partenaires'
                    ? 'bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 text-pink-700 dark:text-pink-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/partenaires'
                      ? 'bg-pink-100 dark:bg-pink-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Partenaires</span
                >
              </NuxtLink>
            </li>

            <!-- Opportunités -->
            <li
              v-if="
                hasAnyRole([
                  'responsable-marketing',
                  'directeur-general-adjoint',
                  'directeur-general',
                  'collaborateur-commercial',
                  'admin',
                ])
              "
            >
              <NuxtLink
                to="/opportunites/liste"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/opportunites'
                    ? 'bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 text-pink-700 dark:text-pink-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/opportunites'
                      ? 'bg-pink-100 dark:bg-pink-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Opportunités</span
                >
              </NuxtLink>
            </li>

             <li
              v-if="
                hasAnyRole([
                  'responsable-marketing',
                  'directeur-general-adjoint',
                  'directeur-general',
                  'collaborateur-commercial',
                  'admin',
                ])
              "
            >
              <a                
                href="https://www.youscribe.com/abo/code"
                target="_blank"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/opportunites'
                    ? 'bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 text-pink-700 dark:text-pink-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === 'https://www.youscribe.com/abo/code'
                      ? 'bg-pink-100 dark:bg-pink-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                 <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
</svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Bibliotheque</span
                >
              </a>
            </li>

            

            <!-- Galerie -->
            <!-- <li v-if="hasAnyRole(['responsable-marketing'])">
              <NuxtLink
                to="/galerie"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/galerie'
                    ? 'bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 text-pink-700 dark:text-pink-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/galerie'
                      ? 'bg-pink-100 dark:bg-pink-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Galerie</span
                >
              </NuxtLink>
            </li> -->
          </ul>
        </section>

        <!-- SECTION AUTRES - Support & Déconnexion -->
        <section
          class="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center px-2 mb-2">
            <div class="w-1 h-5 bg-gray-400 rounded-full"></div>
            <h2
              v-if="themeStore.isSidebarOpen"
              class="ml-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
            >
              Support et Paramètres
            </h2>
          </div>

          <ul class="space-y-1">
            <!-- <li>
              <NuxtLink
                to="#"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                @click="toggleMobileMenu"
              >
                <div
                  class="p-1 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Historique des activités</span
                >
              </NuxtLink>
            </li> -->

            <!-- <li>
              <a
                href="#"
                target="_blank"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <div
                  class="p-1 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Guide d'utilisation</span
                >
              </a>
            </li> -->

            <!-- <li>
              <NuxtLink
                to="#"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                @click="toggleMobileMenu"
              >
                <div
                  class="p-1 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Règlement intérieur</span
                >
              </NuxtLink>
            </li> -->
            <li
              v-if="
                hasAnyRole([
                  'directeur-general',
                  'directeur-general-adjoint',
                  'directeur-general',
                  'logiticien-académique',
                  'admin',
                  'directeur-academique',
                  'informaticien',
                ])
              "
            >
              <NuxtLink
                to="/parametre/liste"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/parametre/liste'
                    ? 'bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 text-pink-700 dark:text-pink-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/parametre/liste'
                      ? 'bg-pink-100 dark:bg-pink-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"
                    />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Parametre</span
                >
              </NuxtLink>
            </li>
            <li
              v-if="
                hasAnyRole([
                  'directeur-academique',
                  'directeur-general-adjoint',
                  'directeur-general',
                  'admin',
                  'directeur-academique',
                  'logiticien-academique',
                  'informaticien',
                  'charge-de-la-clientele',
                  'logiticien-academique',
                  'directeur-academique',
                ])
              "
            >
              <NuxtLink
                to="/annee-scolaire/liste"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/annee-scolaire/liste'
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/annee-scolaire/liste'
                      ? 'bg-amber-100 dark:bg-amber-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6zm8 4a1 1 0 110 2H6a1 1 0 110-2h8z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span
                  v-if="themeStore.isSidebarOpen"
                  class="ml-3 font-medium flex-1"
                  >Années scolaires</span
                >
                <div
                  v-if="
                    themeStore.isSidebarOpen &&
                    $route.path === '/annee-scolaire/liste'
                  "
                  class="w-1.5 h-1.5 bg-amber-600 rounded-full"
                ></div>
              </NuxtLink>
            </li>
            <li
              v-if="
                hasAnyRole([
                  'directeur-academique',
                  'directeur-general-adjoint',
                  'directeur-general',
                  'admin',
                  'directeur-academique',
                  'logiticien-academique',
                  'informaticien',
                ])
              "
            >
              <NuxtLink
                to="/periodes/liste/"
                class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="[
                  $route.path === '/periodes/liste/'
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
                @click="toggleMobileMenu"
              >
                <div
                  :class="[
                    'p-1 rounded-lg',
                    $route.path === '/periodes/liste/'
                      ? 'bg-amber-100 dark:bg-amber-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700',
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6zm8 4a1 1 0 110 2H6a1 1 0 110-2h8z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span
                  v-if="themeStore.isSidebarOpen"
                  class="ml-3 font-medium flex-1"
                  >Semestres</span
                >
                <div
                  v-if="
                    themeStore.isSidebarOpen &&
                    $route.path === '/periodes/liste/'
                  "
                  class="w-1.5 h-1.5 bg-amber-600 rounded-full"
                ></div>
              </NuxtLink>
            </li>

            <!-- Déconnexion avec séparateur -->
            <li class="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                @click="logout"
                class="flex items-center w-full px-3 py-2.5 rounded-xl transition-all duration-200 group hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
              >
                <div
                  class="p-1 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-red-100 dark:group-hover:bg-red-900/30"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10 4a1 1 0 10-2 0v4a1 1 0 102 0V7z"
                      clip-rule="evenodd"
                    />
                    <path d="M8 6h2v2H8V6z" />
                  </svg>
                </div>
                <span v-if="themeStore.isSidebarOpen" class="ml-3 font-medium"
                  >Déconnexion</span
                >
              </button>
            </li>
          </ul>
        </section>
      </nav>
    </div>

    <!-- Version info en bas -->
    <div
      v-if="themeStore.isSidebarOpen"
      class="absolute bottom-0 left-0 right-0 p-4 text-xs text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
    >
      Neo EduManager v2.0 • © 2024
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useThemeStore } from "../../stores/theme";
import { useLoginStore } from "~~/stores/login";
import VueCollapsible from "vue-height-collapsible/vue3";
import { useMessageStore } from "~~/stores/message";
import { useReclamationStore } from "~~/stores/reclamation";
import { useParametreStore } from "~~/stores/parametre";
import config from "~~/config";

import Swal from "sweetalert2";
import { useRoute } from "vue-router";

const themeStore = useThemeStore();
const loginStore = useLoginStore();
const parametreStore = useParametreStore();
const messageStore = useMessageStore();
const reclamationStore = useReclamationStore();
const route = useRoute();

// État des dropdowns
const activeDropdown = ref<string | null>(null);

// États des rôles
const isAdmin = ref(false);
const isDGA = ref(false);
const isDirecteurAcademique = ref(false);
const isLogisticien = ref(false);
const isSurveillant = ref(false);
const isRAF = ref(false);
const isResponsableAchats = ref(false);
const isChargeClientele = ref(false);
const isResponsableMarketing = ref(false);
const isInformaticien = ref(false);
const isEtudiant = ref(false);
const isProfesseur = ref(false);
const isStagiaire = ref(false);
const isSimpleUser = ref(false);
const isStudentBlocked = computed(() => {
  try {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    return userData?.statut === 'bloque';
  } catch {
    return false;
  }
});
const file_url = config.app_local
  ? config.app_dev_storage_url
  : config.app_prod_storage_url;

// Nombre de messages (à connecter à votre API)
const messageCount = ref();

// Fonctions pour les informations utilisateur
const getUserName = (): string => {
  try {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    return userData?.nom_complet || userData?.nom || "Utilisateur";
  } catch {
    return "Utilisateur";
  }
};

const showUe = ref(true);

watch(
  () => parametreStore.getSystemePedagogique,
  (value) => {
    showUe.value = value === "ue_uv";
  },
  { immediate: true },
);

const appLogo = computed(() => {
  const logo = parametreStore.getAppLogo;
  if (!logo) return null;

  return logo;
});

const getUserInitials = (): string => {
  const name = getUserName();
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getPrimaryRole = (): string => {
  if (isAdmin.value) return "Super Administrateur";
  if (isDGA.value) return "Directeur général adjoint";
  if (isDirecteurAcademique.value) return "Directeur académique";
  if (isRAF.value) return "RAF";
  if (isEtudiant.value) return "Étudiant";
  if (isProfesseur.value) return "Enseignant";
  if (isChargeClientele.value) return "Chargé clientèle";
  if(isResponsableMarketing.value) return "Responsable marketing";
  if(isLogisticien.value) return "Logisticien académique";
  if(isStagiaire.value) return "Stagiaire académie";
  if(isSimpleUser.value) return "Utilisateur de la plateforme";
  if(isSurveillant.value) return "Surveillant";
  if(isResponsableAchats.value) return "Responsable des achats et de la logistique";
  if(isInformaticien.value) return "Informaticien";
  if(isResponsableAchats.value) return "Responsable des achats et de la logistique";
  return "Utilisateur";
};

// Fonction pour vérifier les rôles depuis localStorage
const fetchRoles = () => {
  try {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const roles = userData?.roles || [];

    for (const role of roles) {
      const slug = role.slug;

      if (
        slug === "responsable-du-site" ||
        slug === "admin" ||
        slug == "directeur-general"
      )
        isAdmin.value = true;
      if (slug === "directeur-general-adjoint") isDGA.value = true;
      if (slug === "directeur-academique") isDirecteurAcademique.value = true;
      if (slug === "logiticien-academique") isLogisticien.value = true;
      if (slug === "surveillant") isSurveillant.value = true;
      if (slug === "responsable-administratif-et-financier") isRAF.value = true;
      if (slug === "responsable-des-achats-et-de-la-logistique")
        isResponsableAchats.value = true;
      if (slug === "charge-de-la-clientele") isChargeClientele.value = true;
      if (slug === "responsable-marketing") isResponsableMarketing.value = true;
      if (slug === "informaticien") isInformaticien.value = true;
      if (slug === "etudiant") isEtudiant.value = true;
      if (slug === "enseignant") isProfesseur.value = true;
      if (slug === "stagiaire-academie") isStagiaire.value = true;
      if (slug === "utilisateur-de-la-plateforme") isSimpleUser.value = true;
    }
  } catch (error) {
    console.error("Erreur lors du chargement des rôles:", error);
  }
};

const fetchCount = async () => {
  try {
    await messageStore.getCountUnreadMessage();
  } catch (error) {
    console.log(error.response.data.message);
  }
};

// Helper pour vérifier si l'utilisateur a un rôle spécifique
const hasRole = (roleSlug: string): boolean => {
  switch (roleSlug) {
    case "responsable-du-site":
    case "admin":
      return isAdmin.value;
    case "directeur-general-adjoint":
      return isDGA.value;
    case "directeur-academique":
      return isDirecteurAcademique.value;
    case "logiticien-academique":
      return isLogisticien.value;
    case "surveillant":
      return isSurveillant.value;
    case "responsable-administratif-et-financier":
      return isRAF.value;
    case "responsable-des-achats-et-de-la-logistique":
      return isResponsableAchats.value;
    case "charge-de-la-clientele":
      return isChargeClientele.value;
    case "responsable-marketing":
      return isResponsableMarketing.value;
    case "informaticien":
      return isInformaticien.value;
    case "etudiant":
      return isEtudiant.value;
    case "enseignant":
      return isProfesseur.value;
    case "stagiaire-academie":
      return isStagiaire.value;
    case "utilisateur-de-la-plateforme":
      return isSimpleUser.value;
    default:
      return false;
  }
};

// Helper pour vérifier si l'utilisateur a au moins un des rôles
const hasAnyRole = (roleSlugs: string[]): boolean => {
  return roleSlugs.some((slug) => hasRole(slug));
};

// Computed pour les sections
const showMonEspaceSection = computed(() => {
  return (
    hasAnyRole([
      "etudiant",
      "enseignant",
      "surveillant",
      "titulaire-dune-classe",
      "directeur-general-adjoint",
      "responsable-du-site",
      "admin",
      "directeur-academique",
      "charge-de-la-clientele",
      "informaticien",
      "directeur-des-affaires-financieres",
      "responsable-administratif-et-financier",
      "stagiaire-academie",
      "utilisateur-de-la-plateforme",
      "responsable-marketing",
    ]) || isAdmin.value
  );
});

const showAdminAcademiqueSection = computed(() => {
  return (
    hasAnyRole([
      "directeur-academique",
      "logiticien-academique",
      "surveillant",
      "directeur-general-adjoint",
      "directeur-general",
      "informaticien",
      'responsable-marketing',
    ]) || isAdmin.value
  );
});

const showFinanceSection = computed(() => {
  return (
    hasAnyRole([
      "responsable-administratif-et-financier",
      "directeur-general-adjoint",
      "directeur-general",
      "directeur-des-affaires-financieres",
      "charge-de-la-clientele"
    ]) || isAdmin.value
  );
});

const showPersonnelSection = computed(() => {
  return (
    hasAnyRole([
      "directeur-general-adjoint",
      "responsable-administratif-et-financier",
      "informaticien",
      "logiticien-academique",
      "directeur-academique",
      "admin",
    ]) || isAdmin.value
  );
});

const showCommunicationSection = computed(() => {
  return (
    hasAnyRole([
      "directeur-general-adjoint",
      "directeur-general",
      "responsable-marketing",
      "responsable-des-achats-et-de-la-logistique",
      "admin",
    ]) || isAdmin.value
  );
});

const showCandidaturesSection = computed(() => {
  return (
    hasAnyRole([
      "directeur-general-adjoint",
      "charge-de-la-clientele",
      "responsable-marketing",
      "admin",
      "directeur-general",
      "directeur-academique",
      "logiticien-academique",
    ]) || isAdmin.value
  );
});

// Toggle dropdown
const toggleDropdown = (dropdownName: string) => {
  if (activeDropdown.value === dropdownName) {
    activeDropdown.value = null;
  } else {
    activeDropdown.value = dropdownName;
  }
};

// Déconnexion
const logout = () => {
  loginStore.logout();
  showMessage("Déconnexion réussie", "success");
};

// Message toast
const showMessage = (msg = "", type = "success") => {
  const toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
    customClass: { container: "toast" },
  });
  toast.fire({
    icon: type,
    title: msg,
    padding: "10px 20px",
  });
};

// Fermeture sidebar mobile
const closeMobileSidebar = () => {
  themeStore.isMobileSidebarOpen = false;
};

const toggleMobileMenu = () => {
  if (window.innerWidth < 1024) {
    themeStore.isMobileSidebarOpen = false;
  }
};

// Initialisation
onMounted(() => {
  fetchRoles();
  fetchCount();

  messageCount.value = messageStore.totalUnread.count;
  reclamationStore.fetchReclamations();
  parametreStore.fetchParametres();

  // Activer le menu actif
  setTimeout(() => {
    const selector = document.querySelector(
      '.sidebar ul a[href="' + window.location.pathname + '"]',
    );
    if (selector) {
      selector.classList.add("active");
      const ul: any = selector.closest("ul.sub-menu");
      if (ul) {
        let ele: any =
          ul.closest("li.menu")?.querySelectorAll(".nav-link") || [];
        if (ele.length) {
          ele = ele[0];
          setTimeout(() => {
            ele.click();
          });
        }
      }
    }
  }, 100);
});
</script>

<style scoped>
/* Scroll personnalisé pour la sidebar */
.sidebar-scroll::-webkit-scrollbar {
  width: 4px;
}

.sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 4px;
}

.dark .sidebar-scroll::-webkit-scrollbar-thumb {
  background: #4a5568;
}

.sidebar-scroll::-webkit-scrollbar-thumb:hover {
  background: #cbd5e0;
}

.dark .sidebar-scroll::-webkit-scrollbar-thumb:hover {
  background: #718096;
}

/* Transitions douces */
.rotate-180 {
  transform: rotate(180deg);
}

/* Animation pour les badges */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
