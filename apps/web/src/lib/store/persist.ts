import type {
  QueuedCommentType,
  QueuedVideoType
} from '@tape.xyz/lens/custom-types'
import { CustomNotificationsFilterEnum } from '@tape.xyz/lens/custom-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppPerisistState {
  lastOpenedNotificationId: string
  setLastOpenedNotificationId: (id: string) => void
  latestNotificationId: string
  setLatestNotificationId: (id: string) => void
  queuedVideos: QueuedVideoType[]
  queuedComments: QueuedCommentType[]
  selectedNotificationsFilter: CustomNotificationsFilterEnum
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
      setLatestNotificationId: (latestNotificationId) =>
        set({ latestNotificationId }),
      lastOpenedNotificationId: '',
      setLastOpenedNotificationId: (id) =>
        set({ lastOpenedNotificationId: id }),
      queuedComments: [],
      queuedVideos: [],
      setQueuedVideos: (queuedVideos) => set({ queuedVideos }),
      setQueuedComments: (queuedComments) => set({ queuedComments }),

      selectedNotificationsFilter: CustomNotificationsFilterEnum.HIGH_SIGNAL,
      setSelectedNotificationsFilter: (selectedNotificationsFilter) =>
        set({ selectedNotificationsFilter })
    }),
    {
      name: 'tape.store'
    }
  )
)

export default usePersistStore
