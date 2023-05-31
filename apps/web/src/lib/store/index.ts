import { WebBundlr } from '@bundlr-network/client'
import type { FetchSignerResult } from '@wagmi/core'
import type { BundlrDataState, UploadedLivestream, UploadedVideo } from 'utils'
import {
  BUNDLR_CURRENCY,
  BUNDLR_NODE_URL,
  LivestreamType,
  POLYGON_RPC_URL,
  WMATIC_TOKEN_ADDRESS
} from 'utils'
import { CREATOR_VIDEO_CATEGORIES } from 'utils/data/categories'
import logger from 'utils/logger'
import { create } from 'zustand'

export const UPLOADED_VIDEO_BUNDLR_DEFAULTS = {
  balance: '0',
  estimatedPrice: '0',
  deposit: null,
  instance: null,
  depositing: false,
  showDeposit: false
}

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
  isByteVideo: false,
  isNSFW: false,
  isNSFWThumbnail: false,
  collectModule: {
    type: 'revertCollectModule',
    followerOnlyCollect: false,
    amount: { currency: WMATIC_TOKEN_ADDRESS, value: '' },
    referralFee: 0,
    isTimedFeeCollect: false,
    isFreeCollect: false,
    isFeeCollect: false,
    isRevertCollect: true,
    isLimitedFeeCollect: false,
    isLimitedTimeFeeCollect: false,
    isMultiRecipientFeeCollect: false,
    collectLimit: '0',
    multiRecipients: []
  },
  referenceModule: {
    followerOnlyReferenceModule: false,
    degreesOfSeparationReferenceModule: null
  }
}

export const UPLOADED_LIVESTREAM_FORM_DEFAULTS = {
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
  buttonText: 'Post Livestream',
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
    isRevertCollect: true,
    isLimitedFeeCollect: false,
    isLimitedTimeFeeCollect: false,
    isMultiRecipientFeeCollect: false,
    collectLimit: '0',
    multiRecipients: []
  },
  referenceModule: {
    followerOnlyReferenceModule: false,
    degreesOfSeparationReferenceModule: null
  },
  isNSFW: false,
  isNSFWThumbnail: false,
  isByteVideo: false,
  isLivestream: true,
  livestreamKey: '',
  livestreamName: '',
  livestreamPlaybackId: '',
  livestreamType: LivestreamType.Perpetual
}

interface AppState {
  uploadedVideo: UploadedVideo
  bundlrData: BundlrDataState
  videoWatchTime: number
  activeTagFilter: string
  uploadedLivestream: UploadedLivestream
  setUploadedLivestream: (livestream: { [k: string]: any }) => void
  setUploadedVideo: (videoProps: Partial<UploadedVideo>) => void
  setActiveTagFilter: (activeTagFilter: string) => void
  setVideoWatchTime: (videoWatchTime: number) => void
  setBundlrData: (bundlrProps: Partial<BundlrDataState>) => void
  getBundlrInstance: (signer: FetchSignerResult) => Promise<WebBundlr | null>
}

export const useAppStore = create<AppState>((set) => ({
  videoWatchTime: 0,
  activeTagFilter: 'all',
  bundlrData: UPLOADED_VIDEO_BUNDLR_DEFAULTS,
  uploadedVideo: UPLOADED_VIDEO_FORM_DEFAULTS,
  setActiveTagFilter: (activeTagFilter) => set({ activeTagFilter }),
  setVideoWatchTime: (videoWatchTime) => set({ videoWatchTime }),
  setBundlrData: (bundlrProps) =>
    set((state) => ({ bundlrData: { ...state.bundlrData, ...bundlrProps } })),
  setUploadedVideo: (videoProps) =>
    set((state) => ({
      uploadedVideo: { ...state.uploadedVideo, ...videoProps }
    })),
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
  },
  uploadedLivestream: UPLOADED_LIVESTREAM_FORM_DEFAULTS,
  setUploadedLivestream: (livestreamData) =>
    set((state) => ({
      uploadedLivestream: { ...state.uploadedLivestream, ...livestreamData }
    }))
}))

export default useAppStore
