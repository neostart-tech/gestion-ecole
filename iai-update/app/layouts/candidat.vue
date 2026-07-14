<template>
  <div class="min-h-screen bg-[#f5f3ff] dark:bg-[#0a0a12] text-gray-900 dark:text-gray-100 flex overflow-x-hidden relative transition-colors">

    <!-- Background Animé -->
    <div class="fixed inset-0 -z-10" :class="isDarkMode ? 'dark-bg' : 'light-bg'"></div>

    <!-- Overlay Mobile -->
    <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false" class="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"></div>

    <!-- Sidebar -->
    <aside :class="[
      'fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-white dark:bg-[#11111e] shadow-[4px_0_24px_rgba(0,0,0,0.02)] w-80 flex flex-col border-r border-gray-100 dark:border-[#1a1a2a]',
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]">

      <!-- Zone Logo -->
      <div class="h-20 flex items-center justify-center px-6 border-b border-gray-50 dark:border-[#1a1a2a] relative">
        <img :src="appLogo" :alt="appName" class="max-h-12 object-contain drop-shadow-sm" />
        <button @click="isMobileMenuOpen = false" class="absolute right-4 lg:hidden p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1a2a] rounded-[10px]">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Profil Utilisateur -->
      <div class="px-6 py-6 border-b border-gray-50 dark:border-[#1a1a2a] bg-gray-50/30 dark:bg-[#0a0a12]/30">
        <div class="flex items-center space-x-4">
          <div class="relative">
            <div class="w-12 h-12 rounded-[10px] bg-gradient-to-br from-[#01b4d5] to-[#009ab5] flex items-center justify-center text-white font-extrabold text-lg shadow-[0_4px_12px_rgba(1,180,213,0.3)]">
              {{ candidatInitials }}
            </div>
            <span class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#11111e] rounded-full"></span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[15px] font-bold text-[#1A2238] dark:text-white truncate" :title="candidatFullName">{{ candidatFullName }}</p>
            <p class="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 truncate mt-0.5">Candidat</p>
          </div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <div class="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">

        <div class="flex items-center px-2 mb-4 mt-2">
          <div class="w-1 h-4 bg-[#01b4d5] rounded-full"></div>
          <h2 class="ml-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Mon espace</h2>
        </div>

        <NuxtLink to="/candidat/dashboard" class="flex items-center px-3 py-3 rounded-[10px] transition-all duration-300 relative overflow-hidden group" exact-active-class="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/40 dark:to-blue-950/40 text-[#01b4d5]" :class="[$route.path === '/candidat/dashboard' ? '' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1a2a] hover:text-[#1A2238] dark:hover:text-white']" @click="isMobileMenuOpen = false">
          <div class="p-2 rounded-[10px] transition-colors" :class="[$route.path === '/candidat/dashboard' ? 'bg-cyan-100/50 dark:bg-cyan-900/30 shadow-sm text-[#01b4d5]' : 'bg-gray-100 dark:bg-[#1a1a2a] group-hover:bg-gray-200 dark:group-hover:bg-[#242438]']">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
            </svg>
          </div>
          <span class="ml-3 font-semibold text-sm flex-1 relative z-10" :class="{'font-bold text-[#01b4d5]': $route.path === '/candidat/dashboard'}">Tableau de bord</span>
          <div v-if="$route.path === '/candidat/dashboard'" class="w-1.5 h-1.5 bg-[#01b4d5] rounded-full relative z-10 shadow-[0_0_8px_#01b4d5]"></div>
        </NuxtLink>

        <NuxtLink to="/candidat/profil" class="flex items-center px-3 py-3 rounded-[10px] transition-all duration-300 relative overflow-hidden group" exact-active-class="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/40 dark:to-blue-950/40 text-[#01b4d5]" :class="[$route.path === '/candidat/profil' ? '' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1a2a] hover:text-[#1A2238] dark:hover:text-white']" @click="isMobileMenuOpen = false">
          <div class="p-2 rounded-[10px] transition-colors" :class="[$route.path === '/candidat/profil' ? 'bg-cyan-100/50 dark:bg-cyan-900/30 shadow-sm text-[#01b4d5]' : 'bg-gray-100 dark:bg-[#1a1a2a] group-hover:bg-gray-200 dark:group-hover:bg-[#242438]']">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
            </svg>
          </div>
          <span class="ml-3 font-semibold text-sm flex-1 relative z-10" :class="{'font-bold text-[#01b4d5]': $route.path === '/candidat/profil'}">Infos personnelles</span>
          <div v-if="$route.path === '/candidat/profil'" class="w-1.5 h-1.5 bg-[#01b4d5] rounded-full relative z-10 shadow-[0_0_8px_#01b4d5]"></div>
        </NuxtLink>

        <NuxtLink to="/candidat/documents" class="flex items-center px-3 py-3 rounded-[10px] transition-all duration-300 relative overflow-hidden group" exact-active-class="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/40 dark:to-blue-950/40 text-[#01b4d5]" :class="[$route.path === '/candidat/documents' ? '' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1a2a] hover:text-[#1A2238] dark:hover:text-white']" @click="isMobileMenuOpen = false">
          <div class="p-2 rounded-[10px] transition-colors" :class="[$route.path === '/candidat/documents' ? 'bg-cyan-100/50 dark:bg-cyan-900/30 shadow-sm text-[#01b4d5]' : 'bg-gray-100 dark:bg-[#1a1a2a] group-hover:bg-gray-200 dark:group-hover:bg-[#242438]']">
             <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
               <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"/>
             </svg>
          </div>
          <span class="ml-3 font-semibold text-sm flex-1 relative z-10" :class="{'font-bold text-[#01b4d5]': $route.path === '/candidat/documents'}">Mes documents</span>
          <div v-if="$route.path === '/candidat/documents'" class="w-1.5 h-1.5 bg-[#01b4d5] rounded-full relative z-10 shadow-[0_0_8px_#01b4d5]"></div>
        </NuxtLink>

        <NuxtLink to="/candidat/notifications" class="flex items-center px-3 py-3 rounded-[10px] transition-all duration-300 relative overflow-hidden group" exact-active-class="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/40 dark:to-blue-950/40 text-[#01b4d5]" :class="[$route.path === '/candidat/notifications' ? '' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1a2a] hover:text-[#1A2238] dark:hover:text-white']" @click="isMobileMenuOpen = false">
          <div class="relative p-2 rounded-[10px] transition-colors" :class="[$route.path === '/candidat/notifications' ? 'bg-cyan-100/50 dark:bg-cyan-900/30 shadow-sm text-[#01b4d5]' : 'bg-gray-100 dark:bg-[#1a1a2a] group-hover:bg-gray-200 dark:group-hover:bg-[#242438]']">
             <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
               <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
             </svg>
             <span v-if="unreadNotifications.length > 0" class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#11111e]"></span>
          </div>
          <span class="ml-3 font-semibold text-sm flex-1 relative z-10" :class="{'font-bold text-[#01b4d5]': $route.path === '/candidat/notifications'}">Notifications</span>
          <div v-if="$route.path === '/candidat/notifications'" class="w-1.5 h-1.5 bg-[#01b4d5] rounded-full relative z-10 shadow-[0_0_8px_#01b4d5]"></div>
        </NuxtLink>
      </div>

      <!-- Deconnexion Sidebar -->
      <div class="p-4 border-t border-gray-100 dark:border-[#1a1a2a]">
        <button @click="logout" class="w-full flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold rounded-[10px] hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Se déconnecter
        </button>
      </div>
    </aside>

    <!-- Main Wrapper -->
    <div class="flex-1 lg:ml-80 flex flex-col min-h-screen">

      <!-- Topbar Header -->
      <header class="h-20 bg-white/80 dark:bg-[#11111e]/80 backdrop-blur-xl border-b border-gray-100 dark:border-[#1a1a2a] flex items-center justify-between px-4 lg:px-8 fixed top-0 right-0 left-0 lg:left-80 z-20 shadow-[0_2px_10px_rgba(0,0,0,0.01)] transition-all duration-300">

        <div class="flex items-center gap-4">
          <!-- Mobile Menu Toggle -->
          <button @click="isMobileMenuOpen = true" class="lg:hidden p-2.5 bg-white dark:bg-[#1a1a2a] rounded-[10px] shadow-sm border border-gray-100 dark:border-[#242438] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#242438] active:scale-95 transition-all">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <h1 class="text-lg lg:text-xl font-extrabold text-[#1A2238] dark:text-white hidden sm:block">Dossier Candidat</h1>
        </div>

        <div class="flex items-center gap-3 lg:gap-5">
          <!-- Bascule thème clair/sombre/auto -->
          <button
            @click="toggleTheme"
            class="w-10 h-10 rounded-[10px] bg-white dark:bg-[#1a1a2a] border border-gray-100 dark:border-[#242438] flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#242438] hover:text-[#01b4d5] transition-all shadow-sm relative group cursor-pointer"
            :title="`Mode ${currentMode === 'dark' ? 'sombre' : currentMode === 'light' ? 'clair' : 'auto'}`"
          >
            <svg v-if="currentMode === 'dark'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
            <svg v-else-if="currentMode === 'light'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m8.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
            <span class="sr-only">Changer le thème</span>
          </button>

          <!-- Notifications Dropdown -->
          <div class="relative dropdown-container">
            <button @click="isNotificationDropdownOpen = !isNotificationDropdownOpen" class="w-10 h-10 rounded-[10px] bg-white dark:bg-[#1a1a2a] border border-gray-100 dark:border-[#242438] flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#242438] hover:text-[#01b4d5] transition-all shadow-sm relative group cursor-pointer">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              <span v-if="unreadNotifications.length > 0" class="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-red-500 border-2 border-white dark:border-[#11111e] rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1 shadow-sm">{{ unreadNotifications.length > 9 ? '9+' : unreadNotifications.length }}</span>
            </button>

            <!-- Dropdown Menu Notifications -->
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0 translate-y-2"
              enter-to-class="transform scale-100 opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="transform scale-100 opacity-100 translate-y-0"
              leave-to-class="transform scale-95 opacity-0 translate-y-2"
            >
              <div v-if="isNotificationDropdownOpen" class="absolute right-0 mt-4 w-80 max-w-[calc(100vw-2rem)] bg-white/90 dark:bg-[#11111e]/90 backdrop-blur-xl rounded-[10px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-white/50 dark:border-[#242438] p-2 z-50 overflow-hidden" @click.stop>

                <div class="px-4 py-3 mb-2 bg-gradient-to-br from-gray-50 to-white dark:from-[#1a1a2a] dark:to-[#11111e] rounded-[10px] border border-gray-100/50 dark:border-[#242438] flex justify-between items-center">
                  <p class="text-sm font-extrabold text-[#1A2238] dark:text-white">Notifications</p>
                  <span v-if="unreadNotifications.length > 0" class="bg-cyan-100 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-full">{{ unreadNotifications.length }} nouvelle(s)</span>
                </div>

                <div v-if="unreadNotifications.length === 0" class="p-4 text-center">
                  <div class="w-12 h-12 mx-auto bg-gray-50 dark:bg-[#1a1a2a] rounded-full flex items-center justify-center mb-2">
                     <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  </div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Aucune nouvelle notification</p>
                </div>

                <div v-else class="max-h-80 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  <div v-for="notif in unreadNotifications.slice(0, 3)" :key="notif.id" class="p-3 bg-cyan-50/50 dark:bg-cyan-950/30 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 rounded-[10px] transition-colors border-l-2 border-[#01b4d5] cursor-pointer" @click="$router.push('/candidat/notifications'); isNotificationDropdownOpen = false">
                    <p class="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">{{ notif.titre || 'Notification' }}</p>
                    <p class="text-[11px] text-gray-600 dark:text-gray-300 line-clamp-2 mt-0.5">{{ notif.contenu }}</p>
                    <p class="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{{ formatRelativeTime(notif.created_at) }}</p>
                  </div>
                </div>

                <NuxtLink to="/candidat/notifications" class="block w-full text-center mt-2 p-2 text-xs font-bold text-[#01b4d5] hover:bg-cyan-50 dark:hover:bg-cyan-950/40 rounded-[10px] transition-colors" @click="isNotificationDropdownOpen = false">
                  Voir toutes les notifications
                </NuxtLink>
              </div>
            </transition>
          </div>

          <!-- Divider -->
          <div class="h-8 w-px bg-gray-200 dark:bg-[#242438] hidden sm:block"></div>

          <!-- Profil Dropdown -->
          <div class="relative dropdown-container">
            <div @click="isProfileDropdownOpen = !isProfileDropdownOpen" class="flex items-center gap-2 lg:gap-3 cursor-pointer group select-none">
               <div class="hidden sm:block text-right">
                 <p class="text-sm font-bold text-[#1A2238] dark:text-white leading-none group-hover:text-[#01b4d5] transition-colors">{{ candidatShortName }}</p>
               </div>
               <div class="w-10 h-10 rounded-[10px] bg-gradient-to-br from-[#01b4d5] to-[#009ab5] flex items-center justify-center text-white font-bold shadow-sm group-hover:shadow-md transition-all">
                {{ candidatInitials }}
               </div>
               <svg :class="{'rotate-180 text-[#01b4d5]': isProfileDropdownOpen, 'text-gray-400': !isProfileDropdownOpen}" class="w-4 h-4 transition-transform duration-200 group-hover:text-[#01b4d5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </div>

            <!-- Dropdown Menu Premium -->
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0 translate-y-2"
              enter-to-class="transform scale-100 opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="transform scale-100 opacity-100 translate-y-0"
              leave-to-class="transform scale-95 opacity-0 translate-y-2"
            >
              <div v-if="isProfileDropdownOpen" class="absolute right-0 mt-4 w-64 max-w-[calc(100vw-2rem)] bg-white/90 dark:bg-[#11111e]/90 backdrop-blur-xl rounded-[10px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-white/50 dark:border-[#242438] p-2 z-50">

                <!-- En-tête du Dropdown -->
                <div class="px-4 py-3 mb-2 bg-gradient-to-br from-gray-50 to-white dark:from-[#1a1a2a] dark:to-[#11111e] rounded-[10px] border border-gray-100/50 dark:border-[#242438]">
                  <p class="text-xs font-bold text-[#01b4d5] uppercase tracking-widest mb-1">Connecté en tant que</p>
                  <p class="text-sm font-extrabold text-[#1A2238] dark:text-white truncate" :title="candidatFullName">{{ candidatFullName }}</p>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">Candidat</p>
                </div>

                <!-- Action Déconnexion -->
                <button @click="logout" class="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50/50 dark:bg-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/30 font-bold rounded-[10px] transition-all group">
                  <div class="w-8 h-8 rounded-[10px] bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                  </div>
                  Se déconnecter
                </button>

              </div>
            </transition>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 p-4 lg:p-8 mt-20 relative z-10">
        <slot />
      </main>

      <!-- Footer -->
      <footer class="py-6 px-8 border-t border-gray-200/60 dark:border-[#1a1a2a] bg-white/50 dark:bg-[#11111e]/50 backdrop-blur-sm mt-auto text-center lg:text-left flex flex-col lg:flex-row justify-between items-center gap-4">
        <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">© {{ new Date().getFullYear() }} {{ appName }}. Tous droits réservés.</p>
        <p class="text-xs text-gray-400 dark:text-gray-500">
          Développé par <a href="https://neostart.tech/" target="_blank" rel="noopener noreferrer" class="font-bold text-[#01b4d5] hover:underline">Neo Start Technology</a>
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useCandidatAuthStore } from "~~/stores/candidatAuth";
import { useParametreStore } from "~~/stores/parametre";
import { useThemeStore } from "~~/stores/theme";

const isMobileMenuOpen = ref(false);
const isProfileDropdownOpen = ref(false);
const isNotificationDropdownOpen = ref(false);
const router = useRouter();
const candidatAuthStore = useCandidatAuthStore();
const parametreStore = useParametreStore();
const themeStore = useThemeStore();

// Bascule clair/sombre/auto — même store de thème que le reste de l'application,
// pour que le choix du candidat soit cohérent d'une visite à l'autre.
const currentMode = computed(() => themeStore.themeSettings.mode);

// La préférence système est suivie séparément (réactive), car
// window.matchMedia(...).matches n'est pas un état réactif Vue.
const systemPrefersDark = ref(false);
const isDarkMode = computed(() => {
  if (currentMode.value === "dark") return true;
  if (currentMode.value === "light") return false;
  return systemPrefersDark.value;
});

const toggleTheme = () => {
  const next = currentMode.value === "light" ? "dark" : currentMode.value === "dark" ? "auto" : "light";
  themeStore.updateThemeSettings({ mode: next });
  themeStore.applyTheme();
};

const appLogo = computed(() => parametreStore.getAppLogo || "/logo/logo_escen.png");
const appName = computed(() => parametreStore.getAppName || "ESCEN University");

const candidat = computed(() => candidatAuthStore.candidat);

const candidatInitials = computed(() => {
  if (!candidat.value) return "CA";
  const p = candidat.value.prenom ? String(candidat.value.prenom).charAt(0) : "";
  const n = candidat.value.nom ? String(candidat.value.nom).charAt(0) : "";
  return (p + n).toUpperCase() || "CA";
});

const candidatFullName = computed(() => {
  if (!candidat.value) return "Candidat";
  return `${candidat.value.prenom || ""} ${candidat.value.nom || ""}`.trim() || "Candidat";
});

const candidatShortName = computed(() => {
  if (!candidat.value) return "Candidat";
  const p = candidat.value.prenom || "";
  const n = candidat.value.nom ? String(candidat.value.nom).charAt(0) + "." : "";
  return `${p} ${n}`.trim() || "Candidat";
});

const notifications = ref([]);

const fetchNotifications = async () => {
  try {
    notifications.value = await candidatAuthStore.fetchNotifications();
  } catch (error) {
    console.error("Erreur notifications:", error);
  }
};

const unreadNotifications = computed(() => notifications.value.filter((n) => !n.lu));

const formatRelativeTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "À l'instant";
  if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
  if (diffInSeconds < 2592000) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;

  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(date);
};

const logout = async () => {
  isProfileDropdownOpen.value = false;
  isMobileMenuOpen.value = false;
  isNotificationDropdownOpen.value = false;
  await candidatAuthStore.logout();
  router.push("/candidat/login");
};

const closeDropdowns = (e) => {
  if (!e.target.closest(".dropdown-container")) {
    isProfileDropdownOpen.value = false;
    isNotificationDropdownOpen.value = false;
  }
};

let mediaQuery = null;
const handleSystemThemeChange = (event) => {
  systemPrefersDark.value = event.matches;
  if (themeStore.themeSettings.mode === "auto") {
    themeStore.applyTheme();
  }
};

onMounted(() => {
  themeStore.loadState();
  parametreStore.fetchParametres();
  fetchNotifications();
  if (typeof window !== "undefined") {
    document.addEventListener("click", closeDropdowns);
    mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    systemPrefersDark.value = mediaQuery.matches;
    mediaQuery.addEventListener("change", handleSystemThemeChange);
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    document.removeEventListener("click", closeDropdowns);
    mediaQuery?.removeEventListener("change", handleSystemThemeChange);
  }
});
</script>

<style scoped>
/* Background Animation */
.light-bg {
  background: #f5f3ff;
  background-image:
    radial-gradient(4px 100px at 0px 235px, rgba(39,34,87,0.03), transparent),
    radial-gradient(4px 100px at 300px 235px, rgba(39,34,87,0.03), transparent),
    radial-gradient(1.5px 1.5px at 150px 105px, rgba(39,34,87,0.05) 100%, transparent 150%);
  background-size: 300px 235px, 300px 235px, 300px 210px;
  animation: hi-light 150s linear infinite;
}

@keyframes hi-light {
  0% { background-position: 0px 220px, 3px 220px, 426.5px 180px; }
  to { background-position: 0px 6800px, 3px 6800px, 426.5px 6480px; }
}

/* Fond pour le mode sombre */
.dark-bg {
  background: #0a0a12;
  background-image:
    radial-gradient(4px 100px at 0px 235px, rgba(1,180,213,0.15), transparent),
    radial-gradient(4px 100px at 300px 235px, rgba(1,180,213,0.15), transparent),
    radial-gradient(1.5px 1.5px at 150px 105px, rgba(1,180,213,0.2) 100%, transparent 150%);
  background-size: 300px 235px, 300px 235px, 300px 210px;
  animation: hi-light 150s linear infinite;
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>
