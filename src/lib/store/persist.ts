import { LenstubePublication } from 'src/types/local'
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface AppPerisistState {
  autoPlay: boolean
  selectedChannelId: string | null
  recentlyWatched: LenstubePublication[] | []
  watchLater: LenstubePublication[] | []
  notificationCount: number
  setNotificationCount: (count: number) => void
  setSelectedChannelId: (id: string | null) => void
  setAutoPlay: (auto: boolean) => void
}

export const usePersistStore = create(
  persist<AppPerisistState>(
    (set, get) => ({
      autoPlay: true,
      recentlyWatched: [],
      watchLater: [],
      selectedChannelId: null,
      notificationCount: 0,
      setAutoPlay: (autoPlay) => set(() => ({ autoPlay })),
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
