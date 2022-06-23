/* eslint-disable no-unused-vars */
import { Profile } from 'src/types'
import { LenstubePublication } from 'src/types/local'
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface AppPerisistState {
  isAuthenticated: boolean
  selectedChannel: Profile | null
  recentlyWatched: LenstubePublication[] | []
  watchLater: LenstubePublication[] | []
  notificationCount: number
  setNotificationCount: (count: number) => void
  setSelectedChannel: (channel: Profile | null) => void
  setIsAuthenticated: (auth: boolean) => void
  addToRecentlyWatched: (video: LenstubePublication) => void
  addToWatchLater: (video: LenstubePublication) => void
  removeFromWatchLater: (video: LenstubePublication) => void
}

export const usePersistStore = create(
  persist<AppPerisistState>(
    (set, get) => ({
      isAuthenticated: false,
      recentlyWatched: [],
      watchLater: [],
      selectedChannel: null,
      notificationCount: 0,
      setNotificationCount: (notificationCount) =>
        set(() => ({ notificationCount })),
      setSelectedChannel: (channel) =>
        set(() => ({ selectedChannel: channel })),
      addToRecentlyWatched: (video) => {
        const alreadyExists = get().recentlyWatched.find(
          (el) => el.id === video.id
        )
        const newList = get().recentlyWatched.slice(0, 7)
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
        const index = get().watchLater.findIndex((el) => el.id === video.id)
        const videos = get().watchLater
        videos.splice(index, 1)
        set(() => ({
          watchLater: videos
        }))
      },
      setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated }))
    }),
    {
      name: 'lenstube.store'
    }
  )
)

export default usePersistStore
