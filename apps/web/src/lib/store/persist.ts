import type {
  QueuedCommentType,
  QueuedVideoType
} from '@lenstube/lens/custom-types'
import { CustomNotificationsFilterEnum } from '@lenstube/lens/custom-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppPerisistState {
  latestNotificationId: string
  queuedVideos: QueuedVideoType[]
  queuedComments: QueuedCommentType[]
  selectedNotificationsFilter: CustomNotificationsFilterEnum
  setLatestNotificationId: (id: string) => void
  setQueuedComments: (queuedComments: QueuedCommentType[]) => void
  setQueuedVideos: (queuedVideos: QueuedVideoType[]) => void
  setSelectedNotificationsFilter: (
    filter: CustomNotificationsFilterEnum
  ) => void
}

export const usePersistStore = create(
  persist<AppPerisistState>(
    (set) => ({
      latestNotificationId: '',
      queuedComments: [],
      queuedVideos: [],
      setQueuedVideos: (queuedVideos) => set({ queuedVideos }),
      setQueuedComments: (queuedComments) => set({ queuedComments }),
      setLatestNotificationId: (latestNotificationId) =>
        set({ latestNotificationId }),
      selectedNotificationsFilter: CustomNotificationsFilterEnum.HIGH_SIGNAL,
      setSelectedNotificationsFilter: (selectedNotificationsFilter) =>
        set({ selectedNotificationsFilter })
    }),
    {
      name: 'lenstube.store'
    }
  )
)

export default usePersistStore
