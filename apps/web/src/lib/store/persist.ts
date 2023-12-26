import type {
  QueuedCommentType,
  QueuedVideoType
} from '@tape.xyz/lens/custom-types'

import {
  CustomNotificationsFilterEnum,
  LocalStore
} from '@tape.xyz/lens/custom-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppPerisistState {
  lastOpenedNotificationId: string
  latestNotificationId: string
  queuedComments: QueuedCommentType[]
  queuedVideos: QueuedVideoType[]
  selectedNotificationsFilter: CustomNotificationsFilterEnum
  setLastOpenedNotificationId: (id: string) => void
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
      lastOpenedNotificationId: '',
      latestNotificationId: '',
      queuedComments: [],
      queuedVideos: [],
      selectedNotificationsFilter:
        CustomNotificationsFilterEnum.ALL_NOTIFICATIONS,
      setLastOpenedNotificationId: (id) =>
        set({ lastOpenedNotificationId: id }),
      setLatestNotificationId: (latestNotificationId) =>
        set({ latestNotificationId }),
      setQueuedComments: (queuedComments) => set({ queuedComments }),
      setQueuedVideos: (queuedVideos) => set({ queuedVideos }),
      setSelectedNotificationsFilter: (selectedNotificationsFilter) =>
        set({ selectedNotificationsFilter })
    }),
    {
      name: LocalStore.TAPE_STORE
    }
  )
)

export default usePersistStore
