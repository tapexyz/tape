import type { QueuedCommentType, QueuedVideoType } from 'utils'
import { CustomNotificationsFilterEnum } from 'utils'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppPerisistState {
  sidebarCollapsed: boolean
  latestNotificationId: string
  queuedVideos: QueuedVideoType[]
  queuedComments: QueuedCommentType[]
  selectedNotificationsFilter: CustomNotificationsFilterEnum
  setLatestNotificationId: (id: string) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setQueuedComments: (queuedComments: QueuedCommentType[]) => void
  setQueuedVideos: (queuedVideos: QueuedVideoType[]) => void
  setSelectedNotificationsFilter: (
    filter: CustomNotificationsFilterEnum
  ) => void
  visitorId: string | null
  setVisitorId: (visitorId: string | null) => void
}

export const usePersistStore = create(
  persist<AppPerisistState>(
    (set) => ({
      sidebarCollapsed: true,
      latestNotificationId: '',
      queuedComments: [],
      queuedVideos: [],
      setQueuedVideos: (queuedVideos) => set({ queuedVideos }),
      setQueuedComments: (queuedComments) => set({ queuedComments }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setLatestNotificationId: (latestNotificationId) =>
        set({ latestNotificationId }),
      selectedNotificationsFilter: CustomNotificationsFilterEnum.HIGH_SIGNAL,
      setSelectedNotificationsFilter: (selectedNotificationsFilter) =>
        set({ selectedNotificationsFilter }),
      visitorId: null,
      setVisitorId: (visitorId) => set({ visitorId })
    }),
    {
      name: 'lenstube.store'
    }
  )
)

export default usePersistStore
