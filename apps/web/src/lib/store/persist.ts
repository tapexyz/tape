import type { QueuedCommentType, QueuedVideoType } from 'utils'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Tokens = {
  accessToken: string | null
  refreshToken: string | null
}

interface AppPerisistState {
  accessToken: Tokens['accessToken']
  refreshToken: Tokens['refreshToken']
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
  signIn: (tokens: { accessToken: string; refreshToken: string }) => void
  signOut: () => void
  hydrateAuthTokens: () => Tokens
}

export const usePersistStore = create(
  persist<AppPerisistState>(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      selectedChannelId: null,
      sidebarCollapsed: true,
      notificationCount: 0,
      queuedComments: [],
      queuedVideos: [],
      setQueuedVideos: (queuedVideos) => set({ queuedVideos }),
      setQueuedComments: (queuedComments) => set({ queuedComments }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setNotificationCount: (notificationCount) => set({ notificationCount }),
      setSelectedChannelId: (id) => set({ selectedChannelId: id }),
      signIn: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),
      signOut: () => localStorage.removeItem('lenstube.store'),
      hydrateAuthTokens: () => {
        return {
          accessToken: get().accessToken,
          refreshToken: get().refreshToken
        }
      }
    }),
    {
      name: 'lenstube.store'
    }
  )
)

export default usePersistStore

export const signIn = (tokens: { accessToken: string; refreshToken: string }) =>
  usePersistStore.getState().signIn(tokens)
export const signOut = () => usePersistStore.getState().signOut()
export const hydrateAuthTokens = () =>
  usePersistStore.getState().hydrateAuthTokens()
