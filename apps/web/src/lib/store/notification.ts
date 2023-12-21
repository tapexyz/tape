import { create } from 'zustand'

interface NotificationState {
  hasNewNotification: boolean
  setHasNewNotification: (value: boolean) => void
}

const useNotificationStore = create<NotificationState>((set) => ({
  hasNewNotification: false,
  setHasNewNotification: (hasNewNotification) => set({ hasNewNotification })
}))

export default useNotificationStore
