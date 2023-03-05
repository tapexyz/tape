import type { QueuedCommentType, QueuedVideoType } from 'utils'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Tokens = {
  accessToken: string | null
  refreshToken: string | null
}

interface AppPerisistState {
  sidebarCollapsed: boolean
  latestNotificationId: string
  queuedVideos: QueuedVideoType[]
  queuedComments: QueuedCommentType[]
  setLatestNotificationId: (id: string) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setQueuedComments: (queuedComments: QueuedCommentType[]) => void
  setQueuedVideos: (queuedVideos: QueuedVideoType[]) => void
}

export const usePersistStore = create(
  persist<AppPerisistState>(
    (set, get) => ({
      sidebarCollapsed: true,
      latestNotificationId: '',
      queuedComments: [],
      queuedVideos: [],
      setQueuedVideos: (queuedVideos) => set({ queuedVideos }),
      setQueuedComments: (queuedComments) => set({ queuedComments }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setLatestNotificationId: (latestNotificationId) =>
        set({ latestNotificationId })
    }),
    {
      name: 'lenstube.store'
    }
  )
)

export default usePersistStore
