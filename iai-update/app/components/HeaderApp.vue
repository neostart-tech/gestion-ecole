<template>
  <header
    class="fixed top-0 right-0 z-40 bg-white dark:bg-gray-800 shadow-sm transition-all duration-300"
    :class="[sidebarOpen ? 'lg:left-80' : 'lg:left-20', 'left-0']"
  >
    <div class="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
      <!-- Left section - Burger menu -->
      <div class="flex items-center">
        <button
          @click="toggleSidebar"
          class="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          :title="sidebarOpen ? 'Réduire le menu' : 'Étendre le menu'"
        >
          <svg
            class="w-5 h-5 sm:w-6 sm:h-6"
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

      <!-- Right section - Actions -->
      <div class="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
        <!-- Theme toggle - Mobile compact -->
        <button
          @click="toggleTheme"
          class="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative group"
          :title="`Mode ${currentMode === 'dark' ? 'sombre' : currentMode === 'light' ? 'clair' : 'auto'}`"
        >
          <svg
            v-if="currentMode === 'dark'"
            class="w-5 h-5 sm:w-5 sm:h-5"
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
            class="w-5 h-5 sm:w-5 sm:h-5"
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
            class="w-5 h-5 sm:w-5 sm:h-5"
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
          <span class="sr-only">Changer le thème</span>
          
          <!-- Tooltip desktop -->
          <span class="absolute hidden lg:group-hover:block -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
            {{ currentMode === "auto" ? "Auto" : currentMode === "dark" ? "Sombre" : "Clair" }}
          </span>
        </button>

        <!-- Settings - Masqué sur mobile -->
        <button
          @click="toggleSettings"
          class="hidden sm:block p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative group"
          title="Paramètres"
        >
          <svg
            class="w-5 h-5 sm:w-5 sm:h-5"
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

        <!-- Notifications - Avec indicateur visuel amélioré -->
        <div class="relative">
          <button
            @click="toggleNotifications"
            class="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative group"
            :class="{ 
              'ring-2 ring-indigo-400 dark:ring-indigo-500 ring-offset-2 dark:ring-offset-gray-800': unreadCount > 0 && !showNotifications 
            }"
            :title="getNotificationTitle"
          >
            <!-- Icône avec état visuel -->
            <div class="relative">
              <svg
                class="w-5 h-5 sm:w-5 sm:h-5 transition-transform group-hover:scale-110"
                :class="{
                  'text-indigo-600 dark:text-indigo-400': unreadCount > 0,
                  'text-gray-600 dark:text-gray-300': unreadCount === 0
                }"
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
              
              <!-- Badge de notification animé pour les nouvelles -->
              <span
                v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 shadow-lg"
                :class="{
                  'animate-pulse-custom': unreadCount > 0,
                  'animate-bounce-small': unreadCount > 0 && !showNotifications
                }"
              >
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
              
              <!-- Petit indicateur pour "pas de notifications" -->
              <span
                v-else
                class="absolute -top-1 -right-1 w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              ></span>
            </div>
            
            <!-- Tooltip avec compteur -->
            <span class="absolute hidden lg:group-hover:block -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
              {{ getNotificationTooltip }}
            </span>
          </button>

          <!-- Dropdown Notifications - Version Responsive -->
          <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
          >
            <div
              v-if="showNotifications"
              class="absolute right-0 mt-2 
                    w-[calc(100vw-2rem)] sm:w-96 
                    max-w-[calc(100vw-2rem)] sm:max-w-lg 
                    bg-white dark:bg-gray-800 
                    rounded-xl shadow-2xl 
                    border border-gray-200 dark:border-gray-700 
                    z-50 
                    flex flex-col
                    transition-all duration-200
                    sm:right-0
                    -right-4 sm:right-0"
              :class="[
                'max-h-[80vh] sm:max-h-[70vh]',
                windowWidth < 640 ? 'fixed left-4 right-4 w-auto' : ''
              ]"
              @click.stop
            >
              <!-- Header avec actions et indicateur de statut -->
              <div class="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 rounded-t-xl">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <div class="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                      Notifications
                    </h3>
                    <span
                      v-if="unreadCount > 0"
                      class="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full"
                    >
                      {{ unreadCount }} nouveau{{ unreadCount > 1 ? 'x' : '' }}
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-full"
                    >
                      Aucune
                    </span>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <button
                      v-if="unreadCount > 0"
                      @click.stop="handleMarkAllAsRead"
                      class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                      :disabled="notificationStore.isLoading"
                    >
                      Tout lire
                    </button>
                    <button
                      @click="showNotifications = false"
                      class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <!-- Statut de synchronisation -->
                <div class="mt-2 flex items-center justify-between">
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ notifications.length }} notification{{ notifications.length > 1 ? 's' : '' }} au total
                  </p>
                  <button 
                    @click.stop="refreshNotifications"
                    class="text-xs text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 flex items-center gap-1"
                    :disabled="notificationStore.isLoading"
                  >
                    <svg class="w-3 h-3" :class="{ 'animate-spin': notificationStore.isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {{ notificationStore.isLoading ? 'Chargement...' : 'Actualiser' }}
                  </button>
                </div>
              </div>

              <!-- Loading state -->
              <div v-if="notificationStore.isLoading" class="p-8 text-center">
                <div class="flex flex-col items-center justify-center">
                  <div class="relative">
                    <div class="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  </div>
                  <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    Chargement des notifications...
                  </p>
                </div>
              </div>

              <!-- Liste des notifications -->
              <div v-else class="flex-1 overflow-y-auto">
                <!-- État vide amélioré -->
                <div v-if="notifications.length === 0" class="p-8 text-center">
                  <div class="relative">
                    <div class="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mb-4">
                      <svg class="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <h4 class="text-gray-900 dark:text-white font-medium text-base sm:text-lg mb-1">
                      Aucune notification
                    </h4>
                    <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-[220px] mx-auto">
                      Vous n'avez aucune notification pour le moment. Les nouvelles notifications apparaîtront ici.
                    </p>
                    
                    <!-- Illustration de notification -->
                    <div class="mt-6 flex justify-center gap-2">
                      <div class="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                      <div class="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
                      <div class="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
                    </div>
                  </div>
                </div>

                <!-- Liste des notifications non lues -->
                <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
                  <div
                    v-for="notification in notifications.slice(0, 5)"
                    :key="notification.id"
                    @click.stop="handleMarkAsRead(notification.id)"
                    :class="[
                      'p-3 sm:p-4 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50 relative group',
                      !notification.read_at
                        ? 'bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent border-l-4 border-blue-500'
                        : 'bg-transparent border-l-4 border-transparent',
                    ]"
                  >
                    <div class="flex items-start gap-2 sm:gap-3">
                      <!-- Indicateur non lu amélioré -->
                      <div class="flex-shrink-0 mt-1.5">
                        <div
                          v-if="!notification.read_at"
                          class="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-500 rounded-full shadow-lg shadow-blue-200 dark:shadow-blue-900 animate-pulse-custom"
                        ></div>
                      </div>

                      <!-- Icône dynamique -->
                      <div class="flex-shrink-0">
                        <div
                          :class="[
                            'w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shadow-sm',
                            getNotificationStyle(notification.type).bgClass,
                          ]"
                          v-html="getNotificationStyle(notification.type).icon"
                        ></div>
                      </div>

                      <!-- Contenu -->
                      <div class="flex-1 min-w-0">
                        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                          <p class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 pr-6">
                            {{ notification.data.title }}
                          </p>
                          <span class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {{ formatRelativeTime(notification.created_at) }}
                          </span>
                        </div>

                        <p class="text-[11px] sm:text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                          {{ notification.data.content }}
                        </p>

                        <!-- Badges et métadonnées -->
                        <div class="mt-2 flex flex-wrap items-center gap-2">
                          <span
                            :class="[
                              'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-medium',
                              getLevelBadge(notification.data.level),
                            ]"
                          >
                            {{ getLevelLabel(notification.data.level) }}
                          </span>
                          <span class="text-[10px] text-gray-400 dark:text-gray-500">
                            {{ formatTime(notification.created_at) }}
                          </span>
                        </div>
                      </div>

                      <!-- Bouton supprimer -->
                      <button
                        @click.stop="handleDeleteNotification(notification.id)"
                        class="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 absolute right-2 top-2 sm:relative sm:right-auto sm:top-auto"
                        title="Supprimer cette notification"
                      >
                        <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Indicateur de plus de notifications -->
                  <div v-if="notifications.length > 5" class="p-2 text-center">
                    <NuxtLink
                      to="/notifications"
                      class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                      @click="showNotifications = false"
                    >
                      Voir les {{ notifications.length - 5 }} autres notifications...
                    </NuxtLink>
                  </div>
                </div>
              </div>

              <!-- Footer avec actions -->
              <div class="p-2 sm:p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
                <div class="flex items-center justify-between">
                  <NuxtLink
                    to="/notifications"
                    class="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 px-2 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center gap-1"
                    @click="showNotifications = false"
                  >
                    <span>Toutes les notifications</span>
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </NuxtLink>
                  
                  <button
                    v-if="notifications.length > 0"
                    @click.stop="confirmDeleteAll"
                    class="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 px-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-1"
                    :disabled="notificationStore.isLoading"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Tout supprimer</span>
                  </button>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- Profile dropdown -->
        <div class="relative">
          <button
            @click="toggleProfileDropdown"
            class="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            :title="userInfo.name"
          >
            <div
              class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow"
            >
              <span class="text-xs sm:text-sm font-semibold">{{ userInitials }}</span>
            </div>
            <div class="hidden md:block text-left">
              <p class="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 max-w-[120px] truncate">
                {{ userInfo.name }}
              </p>
              <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 max-w-[120px] truncate">
                {{ userInfo.email }}
              </p>
            </div>
            <svg
              class="hidden sm:block w-4 h-4 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors"
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
          <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
          >
            <div
              v-if="isProfileDropdownOpen"
              class="absolute right-0 mt-2 
                    w-56 sm:w-64 
                    bg-white dark:bg-gray-800 
                    rounded-xl shadow-2xl 
                    border border-gray-200 dark:border-gray-700 
                    z-50 py-2
                    transition-all duration-200
                    right-0"
            >
              <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                    <span class="text-sm font-semibold">{{ userInitials }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {{ userInfo.name }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {{ userInfo.email }}
                    </p>
                  </div>
                </div>
              </div>
              
              <div class="py-1">
                <NuxtLink
                  to="/profil"
                  class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  @click="isProfileDropdownOpen = false"
                >
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Mon profil</span>
                </NuxtLink>
                
                <button
                  @click="logout"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Me déconnecter</span>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useThemeStore } from "../../stores/theme";
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useNotificationStore } from "~~/stores/notification";
import { useLoginStore } from "../../stores/login";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";

const { $toastr, $swal } = useNuxtApp();

const themeStore = useThemeStore();
const notificationStore = useNotificationStore();
const loginStore = useLoginStore();

// State
const isProfileDropdownOpen = ref(false);
const showNotifications = ref(false);
const windowWidth = ref(0);

// User info
const user = JSON.parse(localStorage.getItem("user") || "{}");
const userInfo = ref({
  name: `${user.nom || ""} ${user.prenom || ""}`.trim() || "Utilisateur",
  email: user.email || "utilisateur@example.com",
});

const userInitials = computed(() => {
  const name = userInfo.value.name;
  if (!name || name === "Utilisateur") return "U";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
});

// Notifications
const notifications = computed(() => {
  return notificationStore.unreadNotifications?.length
    ? notificationStore.unreadNotifications
    : notificationStore.notifications || [];
});

const unreadCount = computed(() => {
  return notificationStore.unreadNotifications?.length || 0;
});

// Titres et tooltips pour les notifications
const getNotificationTitle = computed(() => {
  if (unreadCount.value === 0) {
    return "Aucune notification";
  }
  return `${unreadCount.value} notification${unreadCount.value > 1 ? 's' : ''} non lue${unreadCount.value > 1 ? 's' : ''}`;
});

const getNotificationTooltip = computed(() => {
  if (unreadCount.value === 0) {
    return "Aucune nouvelle notification";
  }
  return `${unreadCount.value} notification${unreadCount.value > 1 ? 's' : ''} non lue${unreadCount.value > 1 ? 's' : ''}`;
});

// Computed properties
const currentMode = computed(() => themeStore.themeSettings.mode);
const sidebarOpen = computed(() => {
  return windowWidth.value >= 1024 ? themeStore.isSidebarOpen : false;
});

// Styles pour les notifications
const getNotificationStyle = (type: string) => {
  if (type.includes("EnseignantEvaluationProgrammation")) {
    return {
      icon: '<svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>',
      bgClass: "bg-gradient-to-br from-purple-500 to-purple-600",
    };
  }
  if (type.includes("EnseignantEvaluationDeprogrammation")) {
    return {
      icon: '<svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
      bgClass: "bg-gradient-to-br from-orange-500 to-orange-600",
    };
  }
  if (type.includes("Evaluation") || type.includes("Note")) {
    return {
      icon: '<svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>',
      bgClass: "bg-gradient-to-br from-green-500 to-green-600",
    };
  }
  return {
    icon: '<svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
    bgClass: "bg-gradient-to-br from-blue-500 to-blue-600",
  };
};

const getLevelBadge = (level: string = "info") => {
  switch (level?.toLowerCase()) {
    case "danger":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800";
    case "warning":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800";
    case "success":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800";
    default:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800";
  }
};

const getLevelLabel = (level: string = "info") => {
  switch (level?.toLowerCase()) {
    case "danger":
      return "Urgent";
    case "warning":
      return "Important";
    case "success":
      return "Succès";
    default:
      return "Info";
  }
};

const formatRelativeTime = (date: string) => {
  try {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: fr,
    }).replace("environ", "~");
  } catch {
    return "Date inconnue";
  }
};

const formatTime = (date: string) => {
  try {
    return format(new Date(date), "HH:mm", { locale: fr });
  } catch {
    return "";
  }
};

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
  themeStore.applyTheme();
};

const toggleSettings = () => {
  themeStore.toggleSettings();
};

const toggleNotifications = async () => {
  showNotifications.value = !showNotifications.value;

  if (showNotifications.value) {
    isProfileDropdownOpen.value = false;
    await refreshNotifications();
  }
};

const refreshNotifications = async () => {
  await Promise.all([
    notificationStore.fetchUnreadNotifications(),
    notificationStore.fetchNotifications(),
  ]);
};

const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value;
  if (isProfileDropdownOpen.value) {
    showNotifications.value = false;
  }
};

// Actions sur les notifications
const handleMarkAsRead = async (id: string) => {
  try {
    await notificationStore.markNotificationAsRead(id);
    await refreshNotifications();
    $toastr.success("Notification marquée comme lue");
  } catch (error) {
    console.error(error);
    $toastr.error("Erreur lors du marquage");
  }
};

const handleMarkAllAsRead = async () => {
  try {
    await notificationStore.markAllNotificationAsRead();
    await refreshNotifications();
    $toastr.success("Toutes les notifications ont été marquées comme lues");
  } catch (error) {
    console.error(error);
    $toastr.error("Erreur lors du marquage");
  }
};

const handleDeleteNotification = async (id: string) => {
  try {
    const result = await $swal.fire({
      title: "Supprimer cette notification ?",
      text: "Cette action est irréversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#dc2626",
      background: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#1f2937' : '#ffffff',
      color: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#f3f4f6' : '#111827',
    });

    if (result.isConfirmed) {
      await notificationStore.deleteNotification(id);
      await refreshNotifications();
      $toastr.success("Notification supprimée");
    }
  } catch (error) {
    console.error(error);
    $toastr.error("Erreur lors de la suppression");
  }
};

const confirmDeleteAll = async () => {
  if (!notifications.value.length) return;

  try {
    const result = await $swal.fire({
      title: "Supprimer toutes les notifications ?",
      text: "Cette action est irréversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Tout supprimer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#dc2626",
    });

    if (result.isConfirmed) {
      for (const notification of notifications.value) {
        await notificationStore.deleteNotification(notification.id);
      }
      await refreshNotifications();
      $toastr.success("Toutes les notifications ont été supprimées");
    }
  } catch (error) {
    console.error(error);
    $toastr.error("Erreur lors de la suppression");
  }
};

const logout = () => {
  loginStore.logout();
  $toastr.success("Déconnexion réussie");
  navigateTo("/login");
};

// Gestion des clics extérieurs
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
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

// Fermer les dropdowns avec la touche Escape
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    showNotifications.value = false;
    isProfileDropdownOpen.value = false;
  }
};

onMounted(async () => {
  updateWindowWidth();
  window.addEventListener("resize", updateWindowWidth);
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleEscape);

  await refreshNotifications();

  themeStore.applyTheme();
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWindowWidth);
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleEscape);
});

watch(
  () => loginStore.isAuthenticated,
  async (isAuth) => {
    if (isAuth) {
      await refreshNotifications();
    }
  }
);
</script>

<style scoped>
/* Line clamp utilities */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animations personnalisées pour les notifications */
@keyframes pulse-custom {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.animate-pulse-custom {
  animation: pulse-custom 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes bounce-small {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

.animate-bounce-small {
  animation: bounce-small 1s ease infinite;
}

/* Scrollbar personnalisée et responsive */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}

/* Transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Group hover pour mobile et desktop */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

@media (max-width: 640px) {
  .group-hover\:opacity-100 {
    opacity: 1 !important;
  }
  
  .line-clamp-2 {
    -webkit-line-clamp: 3;
  }
}

/* Amélioration du touch sur mobile */
@media (max-width: 640px) {
  button, 
  [role="button"],
  .cursor-pointer {
    min-height: 44px;
    min-width: 44px;
  }
  
  .p-1, .p-1\.5, .p-2 {
    padding: 0.5rem;
  }
}

/* Support du dark mode automatique */
@media (prefers-color-scheme: dark) {
  .dark\:bg-gray-800 {
    background-color: #1f2937;
  }
}

/* Animation d'entrée pour les dropdowns */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Indicateur visuel pour icône de notification */
.ring-offset-2 {
  --tw-ring-offset-width: 2px;
}

/* Animation de chargement */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>