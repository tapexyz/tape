import { WebIrys } from '@irys/sdk'
import { MetadataLicenseType } from '@lens-protocol/metadata'
import { viemPublicClient } from '@lib/viemClient'
import {
  CREATOR_VIDEO_CATEGORIES,
  IRYS_CURRENCY,
  IRYS_NODE_URL,
  WMATIC_TOKEN_ADDRESS
} from '@tape.xyz/constants'
import { logger } from '@tape.xyz/generic'
import type { IrysDataState, UploadedMedia } from '@tape.xyz/lens/custom-types'
import type { WalletClient } from 'viem'
import { create } from 'zustand'

export const UPLOADED_VIDEO_IRYS_DEFAULTS = {
  balance: '0',
  estimatedPrice: '0',
  deposit: null,
  instance: null,
  depositing: false,
  showDeposit: false
}

export const UPLOADED_VIDEO_FORM_DEFAULTS: UploadedMedia = {
  type: 'VIDEO',
  stream: null,
  preview: '',
  mediaType: '',
  file: null,
  title: '',
  description: '',
  thumbnail: '',
  thumbnailType: '',
  thumbnailBlobUrl: '',
  dUrl: '',
  percent: 0,
  isSensitiveContent: false,
  isUploadToIpfs: false,
  loading: false,
  uploadingThumbnail: false,
  buttonText: 'Post Now',
  durationInSeconds: 1,
  mediaCategory: CREATOR_VIDEO_CATEGORIES[0],
  mediaLicense: MetadataLicenseType.CC_BY,
  isByteVideo: false,
  collectModule: {
    followerOnlyCollect: false,
    amount: { currency: WMATIC_TOKEN_ADDRESS, value: '' },
    referralFee: 0,
    timeLimitEnabled: false,
    timeLimit: '1',
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
  },
  unknownOpenAction: null,
  hasOpenActions: false
}

interface AppState {
  uploadedMedia: UploadedMedia
  irysData: IrysDataState
  videoWatchTime: number
  activeTagFilter: string
  setUploadedMedia: (mediaProps: Partial<UploadedMedia>) => void
  setActiveTagFilter: (activeTagFilter: string) => void
  setVideoWatchTime: (videoWatchTime: number) => void
  setIrysData: (irysProps: Partial<IrysDataState>) => void
  getIrysInstance: (client: WalletClient) => Promise<WebIrys | null>
}

const useAppStore = create<AppState>((set) => ({
  videoWatchTime: 0,
  activeTagFilter: 'all',
  irysData: UPLOADED_VIDEO_IRYS_DEFAULTS,
  uploadedMedia: UPLOADED_VIDEO_FORM_DEFAULTS,
  setActiveTagFilter: (activeTagFilter) => set({ activeTagFilter }),
  setVideoWatchTime: (videoWatchTime) => set({ videoWatchTime }),
  setIrysData: (props) =>
    set((state) => ({ irysData: { ...state.irysData, ...props } })),
  setUploadedMedia: (mediaProps) =>
    set((state) => ({
      uploadedMedia: { ...state.uploadedMedia, ...mediaProps }
    })),
  getIrysInstance: async (client: WalletClient) => {
    try {
      const instance = new WebIrys({
        url: IRYS_NODE_URL,
        token: IRYS_CURRENCY,
        wallet: {
          name: 'viemv2',
          provider: client,
          publicClient: viemPublicClient
        }
      })
      await instance.ready()
      return instance
    } catch (error) {
      logger.error('[Error Init Irys]', error)
      return null
    }
  }
}))

export default useAppStore
