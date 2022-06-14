/* eslint-disable no-unused-vars */
import { WebBundlr } from '@bundlr-network/client'
import {
  ALCHEMY_RPC_URL,
  BUNDLR_CURRENCY,
  BUNDLR_NODE_URL
} from '@utils/constants'
import { FetchSignerResult } from '@wagmi/core'
import { Profile } from 'src/types'
import { LenstubePublication } from 'src/types/local'
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  channels: Profile[] | []
  recommendedChannels: Profile[] | []
  selectedChannel: Profile | null
  showUploadVideoModal: boolean
  showCreateChannel: boolean
  isAuthenticated: boolean
  notificationCount: number
  hasNewNotification: boolean
  isSideBarOpen: boolean
  recentlyWatched: LenstubePublication[] | []
  watchLater: LenstubePublication[] | []
  setIsAuthenticated: (auth: boolean) => void
  setIsSidebarOpen: (open: boolean) => void
  setShowCreateChannel: (showCreateChannel: boolean) => void
  setShowUploadVideoModal: (show: boolean) => void
  setSelectedChannel: (channel: Profile | null) => void
  setChannels: (channels: Profile[]) => void
  setRecommendedChannels: (channels: Profile[]) => void
  setNotificationCount: (count: number) => void
  setHasNewNotification: (value: boolean) => void
  addToRecentlyWatched: (video: LenstubePublication) => void
  addToWatchLater: (video: LenstubePublication) => void
  removeFromWatchLater: (video: LenstubePublication) => void
  getBundlrInstance: (signer: FetchSignerResult) => Promise<WebBundlr | null>
}

export const useAppStore = create(
  persist<AppState>(
    (set, get) => ({
      channels: [],
      recentlyWatched: [],
      watchLater: [],
      recommendedChannels: [],
      selectedChannel: null,
      showCreateChannel: false,
      showUploadVideoModal: false,
      isAuthenticated: false,
      notificationCount: 0,
      hasNewNotification: false,
      isSideBarOpen: false,
      setShowUploadVideoModal: (b) => set(() => ({ showUploadVideoModal: b })),
      setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),
      setIsSidebarOpen: (isSideBarOpen) => set(() => ({ isSideBarOpen })),
      setHasNewNotification: (b) => set(() => ({ hasNewNotification: b })),
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
        delete videos[index]
        set(() => ({
          watchLater: videos.length === 1 ? [] : videos
        }))
      },
      setNotificationCount: (notificationCount) =>
        set(() => ({ notificationCount })),
      setChannels: (channels) => set(() => ({ channels })),
      setRecommendedChannels: (recommendedChannels) =>
        set(() => ({ recommendedChannels })),
      setShowCreateChannel: (showCreateChannel) =>
        set(() => ({ showCreateChannel })),
      getBundlrInstance: async (signer) => {
        try {
          const bundlr = new WebBundlr(
            BUNDLR_NODE_URL,
            BUNDLR_CURRENCY,
            signer?.provider,
            {
              providerUrl: ALCHEMY_RPC_URL
            }
          )
          await bundlr.utils.getBundlerAddress(BUNDLR_CURRENCY)
          await bundlr.ready()
          return bundlr
        } catch (error) {
          return null
        }
      }
    }),
    {
      name: 'app-storage'
    }
  )
)

export default useAppStore
