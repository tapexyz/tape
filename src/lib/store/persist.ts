/* eslint-disable no-unused-vars */
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
  addToRecentlyWatched: (video: LenstubePublication) => void
  addToWatchLater: (video: LenstubePublication) => void
  removeFromWatchLater: (video: LenstubePublication) => void
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
      setSelectedChannelId: (id) => set(() => ({ selectedChannelId: id })),
      addToRecentlyWatched: (video) => {
        const alreadyExists = get().recentlyWatched.find(
          (el) => el.id === video.id
        )
        const newList = get().recentlyWatched?.slice(0, 7)
        set(() => ({
          recentlyWatched: alreadyExists
            ? get().recentlyWatched
            : [video, ...newList]
        }))
      },
      addToWatchLater: (video) => {
        const alreadyExists = get().watchLater.find((el) => el.id === video.id)
        const newList = get().watchLater.splice(0, 7)
        set(() => ({
          watchLater: alreadyExists ? get().watchLater : [video, ...newList]
        }))
      },
      removeFromWatchLater: (video) => {
        const videos = get().watchLater.filter((el) => el.id !== video.id)
        set(() => ({
          watchLater: videos
        }))
      }
    }),
    {
      name: 'lenstube.store'
    }
  )
)

export default usePersistStore
