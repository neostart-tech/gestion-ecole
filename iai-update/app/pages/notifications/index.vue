<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900  pb-10 px-4 sm:px-6 lg:px-8">
    <!-- En-tête de la page -->
    <div class="max-w-7xl mx-auto mb-6 sm:mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div class="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            Notifications
          </h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Gérez toutes vos notifications en un seul endroit
          </p>
        </div>
        
        <!-- Actions groupées -->
        <div class="flex items-center gap-2">
          <button
            @click="refreshNotifications"
            class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            :disabled="notificationStore.isLoading"
          >
            <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': notificationStore.isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>
          
          <button
            v-if="currentNotifications.length > 0 && currentTab !== 'archived'"
            @click="confirmMarkAllAsRead"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm hover:shadow"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Tout marquer comme lu
          </button>
        </div>
      </div>
    </div>

    <!-- Système d'onglets -->
    <div class="max-w-7xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <!-- En-tête des onglets -->
        <div class="border-b border-gray-200 dark:border-gray-700">
          <div class="px-4 sm:px-6">
            <nav class="flex space-x-6 overflow-x-auto scrollbar-hide" aria-label="Tabs">
              <!-- Onglet Toutes -->
              <button
                @click="currentTab = 'all'"
                :class="[
                  'py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors',
                  currentTab === 'all'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Toutes
                <span class="ml-1 py-0.5 px-2 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ notificationStore.notifications?.length || 0 }}
                </span>
              </button>

              <!-- Onglet Non lues -->
              <button
                @click="currentTab = 'unread'"
                :class="[
                  'py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors',
                  currentTab === 'unread'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                ]"
              >
                <div class="relative">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
                Non lues
                <span class="ml-1 py-0.5 px-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
                  {{ unreadCount }}
                </span>
              </button>

              <!-- Onglet Lues -->
              <button
                @click="currentTab = 'read'"
                :class="[
                  'py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors',
                  currentTab === 'read'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-5m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Lues
                <span class="ml-1 py-0.5 px-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                  {{ readCount }}
                </span>
              </button>

             
            
            </nav>
          </div>
        </div>

        <!-- Barre d'actions contextuelles -->
        <div v-if="currentNotifications.length > 0" class="px-4 sm:px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <!-- Checkbox de sélection multiple -->
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  v-model="selectAll"
                  class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                >
                <span class="text-sm text-gray-700 dark:text-gray-300">Tout sélectionner</span>
              </label>
              
              <span class="text-xs text-gray-500 dark:text-gray-400">
                ({{ selectedNotifications.length }} sélectionnée{{ selectedNotifications.length > 1 ? 's' : '' }})
              </span>
            </div>
            
            <div class="flex items-center gap-2">
              <!-- Actions en masse -->
              <button
                v-if="selectedNotifications.length > 0 && currentTab !== 'archived'"
                @click="bulkMarkAsRead"
                class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                :disabled="notificationStore.isLoading"
              >
                <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Marquer comme lues
              </button>
              
            
              
              <button
                v-if="selectedNotifications.length > 0"
                @click="bulkDelete"
                class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
                :disabled="notificationStore.isLoading"
              >
                <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer
              </button>
            </div>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="notificationStore.isLoading" class="p-12 text-center">
          <div class="flex flex-col items-center justify-center">
            <div class="relative">
              <div class="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
            <p class="mt-4 text-gray-600 dark:text-gray-400">
              Chargement des notifications...
            </p>
          </div>
        </div>

        <!-- Contenu des notifications -->
        <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
          <!-- État vide -->
          <div v-if="currentNotifications.length === 0" class="p-12 text-center">
            <div class="max-w-sm mx-auto">
              <div class="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mb-4">
                <svg class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">
                {{ emptyStateMessage.title }}
              </h3>
              <p class="text-gray-500 dark:text-gray-400 mb-4">
                {{ emptyStateMessage.description }}
              </p>
              <button
                v-if="currentTab !== 'all'"
                @click="currentTab = 'all'"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Voir toutes les notifications
              </button>
            </div>
          </div>

          <!-- Liste des notifications -->
          <div v-else>
            <div
              v-for="notification in currentNotifications"
              :key="notification.id"
              class="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative group"
              :class="{
                'bg-gradient-to-r from-blue-50/30 to-transparent dark:from-blue-900/5': !notification.read_at && currentTab !== 'read'
              }"
            >
              <div class="flex items-start gap-4">
                <!-- Checkbox de sélection -->
                <div class="flex-shrink-0 pt-1">
                  <input
                    type="checkbox"
                    :value="notification.id"
                    v-model="selectedNotifications"
                    class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                    @click.stop
                  >
                </div>

                <!-- Indicateur non lu -->
                <div class="flex-shrink-0 pt-1.5">
                  <div
                    v-if="!notification.read_at"
                    class="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-500 rounded-full shadow-lg shadow-blue-200 dark:shadow-blue-900 animate-pulse-custom"
                  ></div>
                  <div v-else class="w-2.5 h-2.5"></div>
                </div>

                <!-- Icône -->
                <div class="flex-shrink-0">
                  <div
                    :class="[
                      'w-10 h-10 rounded-xl flex items-center justify-center shadow-sm',
                      getNotificationStyle(notification.type).bgClass,
                    ]"
                    v-html="getNotificationStyle(notification.type).icon"
                  ></div>
                </div>

                <!-- Contenu principal -->
                <div class="flex-1 min-w-0">
                  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h4 class="text-base font-semibold text-gray-900 dark:text-white">
                        {{ notification.data.title }}
                      </h4>
                      <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {{ notification.data.content }}
                      </p>
                    </div>
                    <div class="flex flex-col items-end gap-2">
                      <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {{ formatRelativeTime(notification.created_at) }}
                      </span>
                      <span
                        :class="[
                          'inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium',
                          getLevelBadge(notification.data.level),
                        ]"
                      >
                        {{ getLevelLabel(notification.data.level) }}
                      </span>
                    </div>
                  </div>

                  <!-- Métadonnées supplémentaires -->
                  <div class="mt-3 flex flex-wrap items-center gap-3 text-xs">
                    <span class="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ formatTime(notification.created_at) }}
                    </span>
                    
                    <span v-if="notification.read_at" class="text-green-600 dark:text-green-400 flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Lu {{ formatRelativeTime(notification.read_at) }}
                    </span>
                  </div>
                </div>

                <!-- Actions sur la notification -->
                <div class="flex-shrink-0 flex items-start gap-1">
                  <button
                    v-if="!notification.read_at && currentTab !== 'archived'"
                    @click.stop="handleMarkAsRead(notification.id)"
                    class="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 transition-all"
                    title="Marquer comme lu"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  
                  
                  
                  <button
                    @click.stop="handleDeleteNotification(notification.id)"
                    class="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all"
                    title="Supprimer"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              Affichage de <span class="font-medium">{{ startItem }}</span> à <span class="font-medium">{{ endItem }}</span> sur <span class="font-medium">{{ currentNotifications.length }}</span> notifications
            </div>
            
            <div class="flex items-center gap-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <span class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                Page {{ currentPage }} / {{ totalPages }}
              </span>
              
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from "~~/stores/notification";
import { ref, computed, onMounted, watch } from "vue";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";

const { $toastr, $swal } = useNuxtApp();

const notificationStore = useNotificationStore();

// State
const currentTab = ref<'all' | 'unread' | 'read' | 'archived'>('all');
const selectedNotifications = ref<string[]>([]);
const currentPage = ref(1);
const itemsPerPage = 10;

// Computed notifications
const notifications = computed(() => notificationStore.notifications || []);

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read_at && !n.archived_at).length;
});

const readCount = computed(() => {
  return notifications.value.filter(n => n.read_at && !n.archived_at).length;
});

const archivedCount = computed(() => {
  return notifications.value.filter(n => n.archived_at).length;
});

// Notifications filtrées par onglet
const filteredNotifications = computed(() => {
  switch (currentTab.value) {
    case 'unread':
      return notifications.value.filter(n => !n.read_at && !n.archived_at);
    case 'read':
      return notifications.value.filter(n => n.read_at && !n.archived_at);
    case 'archived':
      return notifications.value.filter(n => n.archived_at);
    default:
      return notifications.value.filter(n => !n.archived_at);
  }
});

// Pagination
const currentNotifications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredNotifications.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredNotifications.value.length / itemsPerPage);
});

const startItem = computed(() => {
  return (currentPage.value - 1) * itemsPerPage + 1;
});

const endItem = computed(() => {
  return Math.min(currentPage.value * itemsPerPage, filteredNotifications.value.length);
});

// Sélection multiple
const selectAll = computed({
  get: () => {
    return currentNotifications.value.length > 0 && 
           selectedNotifications.value.length === currentNotifications.value.length;
  },
  set: (value: boolean) => {
    if (value) {
      selectedNotifications.value = currentNotifications.value.map(n => n.id);
    } else {
      selectedNotifications.value = [];
    }
  }
});

// Messages d'état vide
const emptyStateMessage = computed(() => {
  switch (currentTab.value) {
    case 'unread':
      return {
        title: 'Aucune notification non lue',
        description: 'Vous avez lu toutes vos notifications. Bon travail !'
      };
    case 'read':
      return {
        title: 'Aucune notification lue',
        description: 'Vous n\'avez pas encore marqué de notifications comme lues.'
      };
    case 'archived':
      return {
        title: 'Aucune notification archivée',
        description: 'Les notifications que vous archivez apparaîtront ici.'
      };
    default:
      return {
        title: 'Aucune notification',
        description: 'Vous n\'avez aucune notification pour le moment.'
      };
  }
});

// Actions
const refreshNotifications = async () => {
  await notificationStore.fetchNotifications();
  selectedNotifications.value = [];
};

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

const handleArchive = async (id: string) => {
  try {
    await notificationStore.archiveNotification(id);
    await refreshNotifications();
    $toastr.success(currentTab.value === 'archived' ? "Notification désarchivée" : "Notification archivée");
  } catch (error) {
    console.error(error);
    $toastr.error("Erreur lors de l'archivage");
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

// Actions en masse
const bulkMarkAsRead = async () => {
  try {
    const result = await $swal.fire({
      title: "Marquer comme lues",
      text: `Voulez-vous marquer ${selectedNotifications.value.length} notification${selectedNotifications.value.length > 1 ? 's' : ''} comme lue${selectedNotifications.value.length > 1 ? 's' : ''} ?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Oui, marquer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#4f46e5",
    });

    if (result.isConfirmed) {
      for (const id of selectedNotifications.value) {
        await notificationStore.markNotificationAsRead(id);
      }
      await refreshNotifications();
      $toastr.success(`${selectedNotifications.value.length} notification${selectedNotifications.value.length > 1 ? 's' : ''} marquée${selectedNotifications.value.length > 1 ? 's' : ''} comme lue${selectedNotifications.value.length > 1 ? 's' : ''}`);
      selectedNotifications.value = [];
    }
  } catch (error) {
    console.error(error);
    $toastr.error("Erreur lors du marquage");
  }
};

const bulkArchive = async () => {
  try {
    const result = await $swal.fire({
      title: "Archiver",
      text: `Voulez-vous archiver ${selectedNotifications.value.length} notification${selectedNotifications.value.length > 1 ? 's' : ''} ?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Oui, archiver",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#4f46e5",
    });

    if (result.isConfirmed) {
      for (const id of selectedNotifications.value) {
        await notificationStore.archiveNotification(id);
      }
      await refreshNotifications();
      $toastr.success(`${selectedNotifications.value.length} notification${selectedNotifications.value.length > 1 ? 's' : ''} archivée${selectedNotifications.value.length > 1 ? 's' : ''}`);
      selectedNotifications.value = [];
    }
  } catch (error) {
    console.error(error);
    $toastr.error("Erreur lors de l'archivage");
  }
};

const bulkDelete = async () => {
  try {
    const result = await $swal.fire({
      title: "Supprimer",
      text: `Voulez-vous supprimer définitivement ${selectedNotifications.value.length} notification${selectedNotifications.value.length > 1 ? 's' : ''} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#dc2626",
    });

    if (result.isConfirmed) {
      for (const id of selectedNotifications.value) {
        await notificationStore.deleteNotification(id);
      }
      await refreshNotifications();
      $toastr.success(`${selectedNotifications.value.length} notification${selectedNotifications.value.length > 1 ? 's' : ''} supprimée${selectedNotifications.value.length > 1 ? 's' : ''}`);
      selectedNotifications.value = [];
    }
  } catch (error) {
    console.error(error);
    $toastr.error("Erreur lors de la suppression");
  }
};

const confirmMarkAllAsRead = async () => {
  const unreadIds = filteredNotifications.value
    .filter(n => !n.read_at)
    .map(n => n.id);
    
  if (unreadIds.length === 0) {
    $toastr.info("Aucune notification non lue à marquer");
    return;
  }
  
  try {
    const result = await $swal.fire({
      title: "Tout marquer comme lu",
      text: `Voulez-vous marquer toutes les ${unreadIds.length} notifications non lues comme lues ?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Oui, tout marquer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#4f46e5",
    });

    if (result.isConfirmed) {
      for (const id of unreadIds) {
        await notificationStore.markNotificationAsRead(id);
      }
      await refreshNotifications();
      $toastr.success(`${unreadIds.length} notifications marquées comme lues`);
    }
  } catch (error) {
    console.error(error);
    $toastr.error("Erreur lors du marquage");
  }
};

// Fonctions utilitaires (gardées du header)
const getNotificationStyle = (type: string) => {
  if (type.includes("EnseignantEvaluationProgrammation")) {
    return {
      icon: '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>',
      bgClass: "bg-gradient-to-br from-purple-500 to-purple-600",
    };
  }
  if (type.includes("EnseignantEvaluationDeprogrammation")) {
    return {
      icon: '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
      bgClass: "bg-gradient-to-br from-orange-500 to-orange-600",
    };
  }
  if (type.includes("Evaluation") || type.includes("Note")) {
    return {
      icon: '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>',
      bgClass: "bg-gradient-to-br from-green-500 to-green-600",
    };
  }
  return {
    icon: '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
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

// Reset page quand on change d'onglet
watch(currentTab, () => {
  currentPage.value = 1;
  selectedNotifications.value = [];
});

onMounted(async () => {
  await refreshNotifications();
});
</script>

<style scoped>
/* Scrollbar personnalisée */
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

/* Masquer scrollbar pour le nav des onglets */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Animation de pulse */
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

/* Transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Responsive */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>