<template>
  <div class="min-h-screen bg-transparent pt-4 pb-10">
    <!-- En-tête de la page -->
    <div class="w-full mb-6 sm:mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div class="p-2 bg-gradient-to-br from-[#01b4d5] to-[#009ab5] rounded-xl shadow-lg">
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
            @click="fetchNotifications"
            class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-[#242438] text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1a2a] hover:bg-gray-50 dark:hover:bg-[#242438] transition-colors"
            :disabled="isLoading"
          >
            <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>

          <button
            v-if="currentNotifications.length > 0 && unreadCount > 0"
            @click="confirmMarkAllAsRead"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-[#01b4d5] hover:bg-[#009ab5] transition-colors shadow-sm hover:shadow"
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
    <div class="w-full">
      <div class="bg-white dark:bg-[#11111e] rounded-xl shadow-md overflow-hidden border border-transparent dark:border-[#1a1a2a]">
        <!-- En-tête des onglets -->
        <div class="border-b border-gray-200 dark:border-[#1a1a2a]">
          <div class="px-4 sm:px-6">
            <nav class="flex space-x-6 overflow-x-auto scrollbar-hide" aria-label="Tabs">
              <button
                @click="currentTab = 'all'"
                :class="[
                  'py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors',
                  currentTab === 'all'
                    ? 'border-[#01b4d5] text-[#01b4d5]'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Toutes
                <span class="ml-1 py-0.5 px-2 bg-gray-100 dark:bg-[#1a1a2a] rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ notifications?.length || 0 }}
                </span>
              </button>

              <button
                @click="currentTab = 'unread'"
                :class="[
                  'py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors',
                  currentTab === 'unread'
                    ? 'border-[#01b4d5] text-[#01b4d5]'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
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

              <button
                @click="currentTab = 'read'"
                :class="[
                  'py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors',
                  currentTab === 'read'
                    ? 'border-[#01b4d5] text-[#01b4d5]'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
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
        <div v-if="currentNotifications.length > 0" class="px-4 sm:px-6 py-3 bg-gray-50 dark:bg-[#0a0a12] border-b border-gray-200 dark:border-[#1a1a2a]">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  v-model="selectAll"
                  class="w-4 h-4 text-[#01b4d5] border-gray-300 rounded focus:ring-[#01b4d5]"
                >
                <span class="text-sm text-gray-700 dark:text-gray-300">Tout sélectionner</span>
              </label>

              <span class="text-xs text-gray-500 dark:text-gray-400">
                ({{ selectedNotifications.length }} sélectionnée{{ selectedNotifications.length > 1 ? 's' : '' }})
              </span>
            </div>

            <div class="flex items-center gap-2">
              <button
                v-if="selectedNotifications.length > 0"
                @click="bulkMarkAsRead"
                class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-[#242438] text-xs font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1a2a] hover:bg-gray-50 dark:hover:bg-[#242438] transition-colors"
                :disabled="isLoading"
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
                :disabled="isLoading"
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
        <div v-if="isLoading" class="p-12 text-center">
          <div class="flex flex-col items-center justify-center">
            <div class="w-16 h-16 border-4 border-[#01b4d5]/20 border-t-[#01b4d5] rounded-full animate-spin"></div>
            <p class="mt-4 text-gray-600 dark:text-gray-400">
              Chargement des notifications...
            </p>
          </div>
        </div>

        <!-- Contenu des notifications -->
        <div v-else class="divide-y divide-gray-100 dark:divide-[#1a1a2a]">
          <!-- État vide -->
          <div v-if="currentNotifications.length === 0" class="p-12 text-center">
            <div class="max-w-sm mx-auto">
              <div class="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-50 dark:from-[#1a1a2a] dark:to-[#0a0a12] rounded-full flex items-center justify-center mb-4">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-[#01b4d5] hover:bg-[#009ab5] transition-colors"
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
              class="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-[#0a0a12] transition-colors relative group"
              :class="{
                'bg-gradient-to-r from-cyan-50/50 dark:from-cyan-900/10 to-transparent': !notification.lu && currentTab !== 'read'
              }"
            >
              <div class="flex items-start gap-4">
                <!-- Checkbox de sélection -->
                <div class="flex-shrink-0 pt-1">
                  <input
                    type="checkbox"
                    :value="notification.id"
                    v-model="selectedNotifications"
                    class="w-4 h-4 text-[#01b4d5] border-gray-300 rounded focus:ring-[#01b4d5]"
                    @click.stop
                  >
                </div>

                <!-- Indicateur non lu -->
                <div class="flex-shrink-0 pt-1.5">
                  <div
                    v-if="!notification.lu"
                    class="w-2.5 h-2.5 bg-[#01b4d5] rounded-full shadow-lg shadow-cyan-200 animate-pulse-custom"
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
                        {{ notification.titre || notification.title || 'Notification' }}
                      </h4>
                      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {{ notification.contenu || notification.message }}
                      </p>
                    </div>
                    <div class="flex flex-col items-end gap-2">
                      <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {{ formatRelativeTime(notification.created_at) }}
                      </span>
                      <span
                        :class="[
                          'inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium',
                          getLevelBadge(notification.type),
                        ]"
                      >
                        {{ getLevelLabel(notification.type) }}
                      </span>
                    </div>
                  </div>

                  <div class="mt-3 flex flex-wrap items-center gap-3 text-xs">
                    <span class="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ formatTime(notification.created_at) }}
                    </span>

                    <span v-if="notification.lu" class="text-green-600 dark:text-green-400 flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Lu
                    </span>
                  </div>
                </div>

                <!-- Actions sur la notification -->
                <div class="flex-shrink-0 flex items-start gap-1">
                  <button
                    v-if="!notification.lu"
                    @click.stop="handleMarkAsRead(notification.id)"
                    class="p-2 rounded-lg text-gray-400 hover:text-[#01b4d5] hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all"
                    title="Marquer comme lu"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>

                  <button
                    @click.stop="handleDeleteNotification(notification.id)"
                    class="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
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
        <div v-if="totalPages > 1" class="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-[#1a1a2a] bg-gray-50 dark:bg-[#0a0a12]">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              Affichage de <span class="font-medium">{{ startItem }}</span> à <span class="font-medium">{{ endItem }}</span> sur <span class="font-medium">{{ filteredNotifications.length }}</span> notifications
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="p-2 rounded-lg border border-gray-300 dark:border-[#242438] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a2a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                class="p-2 rounded-lg border border-gray-300 dark:border-[#242438] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a2a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useNuxtApp } from '#app'
import { useCandidatAuthStore } from '~~/stores/candidatAuth'

definePageMeta({
  layout: 'candidat'
})

const { $toastr, $swal } = useNuxtApp()
const candidatAuthStore = useCandidatAuthStore()

const formatRelativeTime = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return "À l'instant"
  if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`
  if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`
  if (diffInSeconds < 2592000) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`

  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

const formatTime = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(date)
}

const isLoading = ref(true)
const notifications = ref([])

const currentTab = ref('all')
const selectedNotifications = ref([])
const currentPage = ref(1)
const itemsPerPage = 10

const fetchNotifications = async () => {
  isLoading.value = true
  try {
    notifications.value = await candidatAuthStore.fetchNotifications()
    selectedNotifications.value = []
  } catch (error) {
    console.error('Erreur notifications:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchNotifications()
})

const unreadCount = computed(() => notifications.value.filter(n => !n.lu).length)
const readCount = computed(() => notifications.value.filter(n => n.lu).length)

const filteredNotifications = computed(() => {
  switch (currentTab.value) {
    case 'unread':
      return notifications.value.filter(n => !n.lu)
    case 'read':
      return notifications.value.filter(n => n.lu)
    default:
      return notifications.value
  }
})

const currentNotifications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredNotifications.value.slice(start, end)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredNotifications.value.length / itemsPerPage)))
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage, filteredNotifications.value.length))

const selectAll = computed({
  get: () => currentNotifications.value.length > 0 && selectedNotifications.value.length === currentNotifications.value.length,
  set: (value) => {
    selectedNotifications.value = value ? currentNotifications.value.map(n => n.id) : []
  }
})

const emptyStateMessage = computed(() => {
  switch (currentTab.value) {
    case 'unread':
      return { title: 'Aucune notification non lue', description: 'Vous avez lu toutes vos notifications. Bon travail !' }
    case 'read':
      return { title: 'Aucune notification lue', description: "Vous n'avez pas encore marqué de notifications comme lues." }
    default:
      return { title: 'Aucune notification', description: "Vous n'avez aucune notification pour le moment." }
  }
})

const handleMarkAsRead = async (id) => {
  try {
    await candidatAuthStore.markNotificationAsRead(id)
    const notif = notifications.value.find(n => n.id === id)
    if (notif) notif.lu = true
    $toastr.success('Notification marquée comme lue')
  } catch (error) {
    console.error(error)
  }
}

const handleDeleteNotification = async (id) => {
  const res = await $swal.fire({
    title: 'Supprimer cette notification ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Supprimer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#ef4444',
  })
  if (!res.isConfirmed) return
  try {
    await candidatAuthStore.deleteNotifications([id])
    notifications.value = notifications.value.filter(n => n.id !== id)
    $toastr.success('Notification supprimée')
  } catch (error) {
    console.error(error)
  }
}

const bulkMarkAsRead = async () => {
  const res = await $swal.fire({
    title: `Marquer ${selectedNotifications.value.length} notification(s) comme lue(s) ?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#01b4d5',
  })
  if (!res.isConfirmed) return
  try {
    for (const id of selectedNotifications.value) {
      await candidatAuthStore.markNotificationAsRead(id)
      const notif = notifications.value.find(n => n.id === id)
      if (notif) notif.lu = true
    }
    $toastr.success(`${selectedNotifications.value.length} notification(s) marquée(s) comme lue(s)`)
    selectedNotifications.value = []
  } catch (error) {
    console.error(error)
  }
}

const bulkDelete = async () => {
  const res = await $swal.fire({
    title: `Supprimer ${selectedNotifications.value.length} notification(s) ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Supprimer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#ef4444',
  })
  if (!res.isConfirmed) return
  try {
    await candidatAuthStore.deleteNotifications(selectedNotifications.value)
    notifications.value = notifications.value.filter(n => !selectedNotifications.value.includes(n.id))
    $toastr.success(`${selectedNotifications.value.length} notification(s) supprimée(s)`)
    selectedNotifications.value = []
  } catch (error) {
    console.error(error)
  }
}

const confirmMarkAllAsRead = async () => {
  const unreadIds = notifications.value.filter(n => !n.lu).map(n => n.id)
  if (unreadIds.length === 0) return

  const res = await $swal.fire({
    title: `Marquer toutes les ${unreadIds.length} notifications non lues comme lues ?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#01b4d5',
  })
  if (!res.isConfirmed) return
  try {
    for (const id of unreadIds) {
      await candidatAuthStore.markNotificationAsRead(id)
      const notif = notifications.value.find(n => n.id === id)
      if (notif) notif.lu = true
    }
    $toastr.success(`${unreadIds.length} notifications marquées comme lues`)
  } catch (error) {
    console.error(error)
  }
}

const getNotificationStyle = (type) => {
  const t = type?.toLowerCase() || ''
  if (t === 'alerte' || t === 'warning') return {
    icon: '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>',
    bgClass: 'bg-gradient-to-br from-orange-500 to-orange-600',
  }
  if (t === 'succes' || t === 'success') return {
    icon: '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
    bgClass: 'bg-gradient-to-br from-green-500 to-green-600',
  }
  return {
    icon: '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
    bgClass: 'bg-gradient-to-br from-[#01b4d5] to-[#009ab5]',
  }
}

const getLevelBadge = (level) => {
  const t = level?.toLowerCase() || ''
  if (t === 'alerte' || t === 'warning') return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
  if (t === 'succes' || t === 'success') return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800'
  return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800'
}

const getLevelLabel = (level) => {
  const t = level?.toLowerCase() || ''
  if (t === 'alerte' || t === 'warning') return 'Important'
  if (t === 'succes' || t === 'success') return 'Succès'
  return 'Info'
}

watch(currentTab, () => {
  currentPage.value = 1
  selectedNotifications.value = []
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
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
</style>
