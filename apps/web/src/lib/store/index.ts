import { WebBundlr } from '@bundlr-network/client'
import type { FetchSignerResult } from '@wagmi/core'
import type { Profile } from 'lens'
import type { BundlrDataState, UploadedVideo } from 'utils'
import {
  BUNDLR_CURRENCY,
  BUNDLR_NODE_URL,
  POLYGON_RPC_URL,
  WMATIC_TOKEN_ADDRESS
} from 'utils'
import { CREATOR_VIDEO_CATEGORIES } from 'utils/data/categories'
import logger from 'utils/logger'
import create from 'zustand'

export const UPLOADED_VIDEO_FORM_DEFAULTS = {
  stream: null,
  preview: '',
  videoType: '',
  file: null,
  title: '',
  description: '',
  thumbnail: '',
  thumbnailType: '',
  videoSource: '',
  percent: 0,
  playbackId: '',
  isSensitiveContent: false,
  isUploadToIpfs: false,
  loading: false,
  uploadingThumbnail: false,
  buttonText: 'Post Video',
  durationInSeconds: null,
  videoCategory: CREATOR_VIDEO_CATEGORIES[0],
  collectModule: {
    type: 'revertCollectModule',
    followerOnlyCollect: false,
    amount: { currency: WMATIC_TOKEN_ADDRESS, value: '' },
    referralFee: 0,
    isTimedFeeCollect: false,
    isFreeCollect: false,
    isFeeCollect: false,
    isRevertCollect: true
  },
  referenceModule: {
    followerOnlyReferenceModule: false,
    degreesOfSeparationReferenceModule: null
  },
  isNSFW: false,
  isNSFWThumbnail: false
}

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
  uploadedVideo: UploadedVideo
  bundlrData: BundlrDataState
  selectedChannel: Profile | null
  videoWatchTime: number
  activeTagFilter: string
  setActiveTagFilter: (activeTagFilter: string) => void
  setVideoWatchTime: (videoWatchTime: number) => void
  setSelectedChannel: (channel: Profile | null) => void
  setUploadedVideo: (video: { [k: string]: any }) => void
  setUserSigNonce: (userSigNonce: number) => void
  setShowCreateChannel: (showCreateChannel: boolean) => void
  setChannels: (channels: Profile[]) => void
  setRecommendedChannels: (channels: Profile[]) => void
  setHasNewNotification: (value: boolean) => void
  setBundlrData: (bundlrData: { [k: string]: any }) => void
  getBundlrInstance: (signer: FetchSignerResult) => Promise<WebBundlr | null>
}

export const useAppStore = create<AppState>((set) => ({
  channels: [],
  recommendedChannels: [],
  showCreateChannel: false,
  hasNewNotification: false,
  userSigNonce: 0,
  uploadedVideo: UPLOADED_VIDEO_FORM_DEFAULTS,
  bundlrData: UPLOADED_VIDEO_BUNDLR_DEFAULTS,
  selectedChannel: null,
  videoWatchTime: 0,
  activeTagFilter: 'all',
  setActiveTagFilter: (activeTagFilter) => set(() => ({ activeTagFilter })),
  setVideoWatchTime: (videoWatchTime) => set(() => ({ videoWatchTime })),
  setSelectedChannel: (channel) => set(() => ({ selectedChannel: channel })),
  setBundlrData: (bundlrData) =>
    set((state) => ({ bundlrData: { ...state.bundlrData, ...bundlrData } })),
  setUploadedVideo: (videoData) =>
    set((state) => ({
      uploadedVideo: { ...state.uploadedVideo, ...videoData }
    })),
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
      set((state) => ({
        uploadedVideo: { ...state.uploadedVideo, loading: false }
      }))
      return null
    }
  }
}))

export default useAppStore
