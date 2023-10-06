import { WebIrys } from '@irys/sdk'
import {
  CREATOR_VIDEO_CATEGORIES,
  IRYS_CURRENCY,
  IRYS_NODE_URL,
  POLYGON_RPC_URL,
  WMATIC_TOKEN_ADDRESS
} from '@tape.xyz/constants'
import { logger } from '@tape.xyz/generic'
import type { IrysDataState, UploadedVideo } from '@tape.xyz/lens/custom-types'
import { create } from 'zustand'

export const UPLOADED_VIDEO_IRYS_DEFAULTS = {
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
  durationInSeconds: 0,
  videoCategory: CREATOR_VIDEO_CATEGORIES[0],
  isByteVideo: false,
  collectModule: {
    type: 'revertCollectModule',
    followerOnlyCollect: false,
    amount: { currency: WMATIC_TOKEN_ADDRESS, value: '' },
    referralFee: 0,
    timeLimit: false,
    isFeeCollect: false,
    isRevertCollect: true,
    isMultiRecipientFeeCollect: false,
    collectLimit: '0',
    collectLimitEnabled: false,
    multiRecipients: []
  },
  referenceModule: {
    followerOnlyReferenceModule: false,
    degreesOfSeparationReferenceModule: null
  }
}

interface AppState {
  uploadedVideo: UploadedVideo
  irysData: IrysDataState
  videoWatchTime: number
  activeTagFilter: string
  setUploadedVideo: (videoProps: Partial<UploadedVideo>) => void
  setActiveTagFilter: (activeTagFilter: string) => void
  setVideoWatchTime: (videoWatchTime: number) => void
  setIrysData: (irysProps: Partial<IrysDataState>) => void
  getIrysInstance: (signer: {
    signMessage: (message: string) => Promise<string>
  }) => Promise<WebIrys | null>
}

export const useAppStore = create<AppState>((set) => ({
  videoWatchTime: 0,
  activeTagFilter: 'all',
  irysData: UPLOADED_VIDEO_IRYS_DEFAULTS,
  uploadedVideo: UPLOADED_VIDEO_FORM_DEFAULTS,
  setActiveTagFilter: (activeTagFilter) => set({ activeTagFilter }),
  setVideoWatchTime: (videoWatchTime) => set({ videoWatchTime }),
  setIrysData: (props) =>
    set((state) => ({ irysData: { ...state.irysData, ...props } })),
  setUploadedVideo: (videoProps) =>
    set((state) => ({
      uploadedVideo: { ...state.uploadedVideo, ...videoProps }
    })),
  getIrysInstance: async (signer) => {
    try {
      const instance = new WebIrys({
        url: IRYS_NODE_URL,
        token: IRYS_CURRENCY,
        wallet: {
          rpcUrl: POLYGON_RPC_URL,
          name: 'rainbowkitv1',
          provider: signer
        }
      })
      await instance.utils.getBundlerAddress(IRYS_CURRENCY)
      await instance.ready()
      return instance
    } catch (error) {
      logger.error('[Error Init Irys]', error)
      return null
    }
  }
}))

export default useAppStore
