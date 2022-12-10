import { WebBundlr } from '@bundlr-network/client'
import type { FetchSignerResult } from '@wagmi/core'
import type { Profile } from 'lens'
import type { BundlrDataState, LenstubePublication } from 'utils'
import { BUNDLR_CURRENCY, BUNDLR_NODE_URL, POLYGON_RPC_URL } from 'utils'
import logger from 'utils/logger'
import create from 'zustand'

export const UPLOADED_VIDEO_BUNDLR_DEFAULTS = {
  balance: '0',
  estimatedPrice: '0',
  deposit: null,
  instance: null,
  depositing: false,
  showDeposit: false
}

interface AppState {
  channels: Profile[] | []
  recommendedChannels: Profile[] | []
  showCreateChannel: boolean
  hasNewNotification: boolean
  userSigNonce: number
  bundlrData: BundlrDataState
  upNextVideo: LenstubePublication | null
  selectedChannel: Profile | null
  videoWatchTime: number
  activeTagFilter: string
  setActiveTagFilter: (activeTagFilter: string) => void
  setVideoWatchTime: (videoWatchTime: number) => void
  setSelectedChannel: (channel: Profile | null) => void
  setUserSigNonce: (userSigNonce: number) => void
  setShowCreateChannel: (showCreateChannel: boolean) => void
  setChannels: (channels: Profile[]) => void
  setRecommendedChannels: (channels: Profile[]) => void
  setHasNewNotification: (value: boolean) => void
  setUpNextVideo: (upNextVideo: LenstubePublication) => void
  setBundlrData: (bundlrData: { [k: string]: any }) => void
  getBundlrInstance: (signer: FetchSignerResult) => Promise<WebBundlr | null>
}

export const useAppStore = create<AppState>((set) => ({
  channels: [],
  recommendedChannels: [],
  showCreateChannel: false,
  hasNewNotification: false,
  userSigNonce: 0,
  bundlrData: UPLOADED_VIDEO_BUNDLR_DEFAULTS,
  upNextVideo: null,
  selectedChannel: null,
  videoWatchTime: 0,
  activeTagFilter: 'all',
  setActiveTagFilter: (activeTagFilter) => set(() => ({ activeTagFilter })),
  setVideoWatchTime: (videoWatchTime) => set(() => ({ videoWatchTime })),
  setSelectedChannel: (channel) => set(() => ({ selectedChannel: channel })),
  setUpNextVideo: (upNextVideo) => set(() => ({ upNextVideo })),
  setBundlrData: (bundlrData) =>
    set((state) => ({ bundlrData: { ...state.bundlrData, ...bundlrData } })),
  setUserSigNonce: (userSigNonce) => set(() => ({ userSigNonce })),
  setHasNewNotification: (b) => set(() => ({ hasNewNotification: b })),
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
      logger.error('[Error Init Bundlr]', error)
      return null
    }
  }
}))

export default useAppStore
