import { create } from 'zustand'

export const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (notification) => {
    const id = Date.now()
    const notif = { id, ...notification }
    set((state) => ({
      notifications: [...state.notifications, notif]
    }))
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
      }))
    }, notification.duration || 4000)
    return id
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    }))
  },
  clearNotifications: () => {
    set({ notifications: [] })
  }
}))
