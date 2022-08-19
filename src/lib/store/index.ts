/* eslint-disable no-unused-vars */
import { WebBundlr } from '@bundlr-network/client'
import logger from '@lib/logger'
import {
  BUNDLR_CURRENCY,
  BUNDLR_NODE_URL,
  POLYGON_RPC_URL,
  WMATIC_TOKEN_ADDRESS
} from '@utils/constants'
import { CREATOR_VIDEO_CATEGORIES } from '@utils/data/categories'
import { FetchSignerResult } from '@wagmi/core'
import { Profile } from 'src/types'
import {
  BundlrDataState,
  LenstubePublication,
  UploadedVideo
} from 'src/types/local'
import create from 'zustand'

export const UPLOADED_VIDEO_FORM_DEFAULTS = {
  buffer: null,
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
  buttonText: 'Upload Video',
  durationInSeconds: null,
  videoCategory: CREATOR_VIDEO_CATEGORIES[0],
  collectModule: {
    type: 'freeCollectModule',
    followerOnlyCollect: false,
    amount: { currency: WMATIC_TOKEN_ADDRESS, value: '' },
    referralFee: 0,
    isTimedFeeCollect: false,
    isFreeCollect: true,
    isFeeCollect: false,
    isRevertCollect: false
  },
  disableComments: false,
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
  upNextVideo: LenstubePublication | null
  setUploadedVideo: (video: { [k: string]: any }) => void
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
  uploadedVideo: UPLOADED_VIDEO_FORM_DEFAULTS,
  bundlrData: UPLOADED_VIDEO_BUNDLR_DEFAULTS,
  upNextVideo: null,
  setUpNextVideo: (upNextVideo) => set(() => ({ upNextVideo })),
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
      return null
    }
  }
}))

export default useAppStore
