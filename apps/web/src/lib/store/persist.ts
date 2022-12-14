import type { QueuedCommentType, QueuedVideoType } from 'utils'
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface AppPerisistState {
  selectedChannelId: string | null
  sidebarCollapsed: boolean
  notificationCount: number
  queuedVideos: QueuedVideoType[]
  queuedComments: QueuedCommentType[]
  setNotificationCount: (count: number) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setSelectedChannelId: (id: string | null) => void
  setQueuedComments: (queuedComments: QueuedCommentType[]) => void
  setQueuedVideos: (queuedVideos: QueuedVideoType[]) => void
}

export const usePersistStore = create(
  persist<AppPerisistState>(
    (set) => ({
      selectedChannelId: null,
      queuedComments: [],
      sidebarCollapsed: true,
      notificationCount: 0,
      queuedVideos: [],
      setQueuedVideos: (queuedVideos) => set(() => ({ queuedVideos })),
      setQueuedComments: (queuedComments) => set(() => ({ queuedComments })),
      setSidebarCollapsed: (sidebarCollapsed) =>
        set(() => ({ sidebarCollapsed })),
      setNotificationCount: (notificationCount) =>
        set(() => ({ notificationCount })),
      setSelectedChannelId: (id) => set(() => ({ selectedChannelId: id }))
    }),
    {
      name: 'lenstube.store'
    }
  )
)

export default usePersistStore
