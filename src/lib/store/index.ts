/* eslint-disable no-unused-vars */
import { WebBundlr } from '@bundlr-network/client'
import {
  BUNDLR_CURRENCY,
  BUNDLR_NODE_URL,
  POLYGON_RPC_URL
} from '@utils/constants'
import { FetchSignerResult } from '@wagmi/core'
import { Profile } from 'src/types'
import create from 'zustand'

interface AppState {
  channels: Profile[] | []
  recommendedChannels: Profile[] | []
  selectedChannel: Profile | null
  showCreateChannel: boolean
  notificationCount: number
  hasNewNotification: boolean
  setShowCreateChannel: (showCreateChannel: boolean) => void
  setSelectedChannel: (channel: Profile | null) => void
  setChannels: (channels: Profile[]) => void
  setRecommendedChannels: (channels: Profile[]) => void
  setNotificationCount: (count: number) => void
  setHasNewNotification: (value: boolean) => void
  getBundlrInstance: (signer: FetchSignerResult) => Promise<WebBundlr | null>
}

export const useAppStore = create<AppState>((set, get) => ({
  channels: [],
  recommendedChannels: [],
  selectedChannel: null,
  showCreateChannel: false,
  notificationCount: 0,
  hasNewNotification: false,
  setHasNewNotification: (b) => set(() => ({ hasNewNotification: b })),
  setSelectedChannel: (channel) => set(() => ({ selectedChannel: channel })),
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
          providerUrl: POLYGON_RPC_URL
        }
      )
      await bundlr.utils.getBundlerAddress(BUNDLR_CURRENCY)
      await bundlr.ready()
      return bundlr
    } catch (error) {
      return null
    }
  }
}))

export default useAppStore
