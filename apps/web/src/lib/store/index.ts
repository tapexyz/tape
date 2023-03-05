import { WebBundlr } from '@bundlr-network/client'
import type { FetchSignerResult } from '@wagmi/core'
import type { BundlrDataState, UploadedVideo } from 'utils'
import {
  BUNDLR_CURRENCY,
  BUNDLR_NODE_URL,
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
  isSensitiveContent: false,
  isUploadToIpfs: false,
  loading: false,
  uploadingThumbnail: false,
  buttonText: 'Post Video',
  durationInSeconds: null,
  videoCategory: CREATOR_VIDEO_CATEGORIES[0],
  isByteVideo: false,
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
    collectLimit: '1',
    multiRecipients: []
  },
  referenceModule: {
    followerOnlyReferenceModule: false,
    degreesOfSeparationReferenceModule: null
  }
}

interface AppState {
  uploadedVideo: UploadedVideo
  bundlrData: BundlrDataState
  videoWatchTime: number
  activeTagFilter: string
  setUploadedVideo: <T extends UploadedVideo>(video: T) => void
  setActiveTagFilter: (activeTagFilter: string) => void
  setVideoWatchTime: (videoWatchTime: number) => void
  setBundlrData: <T extends BundlrDataState>(bundlrData: T) => void
  getBundlrInstance: (signer: FetchSignerResult) => Promise<WebBundlr | null>
}

export const useAppStore = create<AppState>((set) => ({
  videoWatchTime: 0,
  activeTagFilter: 'all',
  bundlrData: UPLOADED_VIDEO_BUNDLR_DEFAULTS,
  uploadedVideo: UPLOADED_VIDEO_FORM_DEFAULTS,
  setActiveTagFilter: (activeTagFilter) => set({ activeTagFilter }),
  setVideoWatchTime: (videoWatchTime) => set({ videoWatchTime }),
  setBundlrData: (bundlrData) =>
    set((state) => ({ bundlrData: { ...state.bundlrData, ...bundlrData } })),
  setUploadedVideo: (uploadedVideo) => set({ uploadedVideo }),
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
