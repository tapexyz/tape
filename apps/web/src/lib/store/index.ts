import type { IrysDataState, UploadedMedia } from '@tape.xyz/lens/custom-types'

import { WebIrys } from '@irys/sdk'
import { MetadataLicenseType } from '@lens-protocol/metadata'
import {
  CREATOR_VIDEO_CATEGORIES,
  IRYS_CURRENCY,
  IRYS_NODE_URL,
  POLYGON_RPC_URL,
  WMATIC_TOKEN_ADDRESS
} from '@tape.xyz/constants'
import { logger } from '@tape.xyz/generic'
import { create } from 'zustand'

export const UPLOADED_VIDEO_IRYS_DEFAULTS = {
  balance: '0',
  deposit: null,
  depositing: false,
  estimatedPrice: '0',
  instance: null,
  showDeposit: false
}

export const UPLOADED_VIDEO_FORM_DEFAULTS: UploadedMedia = {
  buttonText: 'Post Now',
  collectModule: {
    amount: { currency: WMATIC_TOKEN_ADDRESS, value: '' },
    collectLimit: '0',
    collectLimitEnabled: false,
    followerOnlyCollect: false,
    isFeeCollect: false,
    isMultiRecipientFeeCollect: false,
    isRevertCollect: true,
    multiRecipients: [],
    referralFee: 0,
    timeLimit: '1',
    timeLimitEnabled: false
  },
  description: '',
  durationInSeconds: 1,
  dUrl: '',
  file: null,
  isByteVideo: false,
  isSensitiveContent: false,
  isUploadToIpfs: false,
  loading: false,
  mediaCategory: CREATOR_VIDEO_CATEGORIES[0],
  mediaLicense: MetadataLicenseType.CC_BY,
  mediaType: '',
  percent: 0,
  preview: '',
  referenceModule: {
    degreesOfSeparationReferenceModule: null,
    followerOnlyReferenceModule: false
  },
  stream: null,
  thumbnail: '',
  thumbnailType: '',
  title: '',
  type: 'VIDEO',
  uploadingThumbnail: false
}

interface AppState {
  activeTagFilter: string
  getIrysInstance: (signer: {
    signMessage: (message: string) => Promise<string>
  }) => Promise<null | WebIrys>
  irysData: IrysDataState
  setActiveTagFilter: (activeTagFilter: string) => void
  setIrysData: (irysProps: Partial<IrysDataState>) => void
  setUploadedMedia: (mediaProps: Partial<UploadedMedia>) => void
  setVideoWatchTime: (videoWatchTime: number) => void
  uploadedMedia: UploadedMedia
  videoWatchTime: number
}

const useAppStore = create<AppState>((set) => ({
  activeTagFilter: 'all',
  getIrysInstance: async (signer) => {
    try {
      const instance = new WebIrys({
        token: IRYS_CURRENCY,
        url: IRYS_NODE_URL,
        wallet: {
          name: 'viem',
          provider: signer,
          rpcUrl: POLYGON_RPC_URL
        }
      })
      await instance.utils.getBundlerAddress(IRYS_CURRENCY)
      await instance.ready()
      return instance
    } catch (error) {
      logger.error('[Error Init Irys]', error)
      return null
    }
  },
  irysData: UPLOADED_VIDEO_IRYS_DEFAULTS,
  setActiveTagFilter: (activeTagFilter) => set({ activeTagFilter }),
  setIrysData: (props) =>
    set((state) => ({ irysData: { ...state.irysData, ...props } })),
  setUploadedMedia: (mediaProps) =>
    set((state) => ({
      uploadedMedia: { ...state.uploadedMedia, ...mediaProps }
    })),
  setVideoWatchTime: (videoWatchTime) => set({ videoWatchTime }),
  uploadedMedia: UPLOADED_VIDEO_FORM_DEFAULTS,
  videoWatchTime: 0
}))

export default useAppStore
