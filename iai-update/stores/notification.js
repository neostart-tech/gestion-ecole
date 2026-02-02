export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [],
    unreadCount: 0,
  }),
  actions: {
    addNotification(notification) {
      this.notifications.unshift(notification);
      this.unreadCount++;
    },
    markAllAsRead() {
      this.unreadCount = 0;
    },
  },
});
