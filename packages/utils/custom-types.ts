import type { WebBundlr } from '@bundlr-network/client'
import type {
  AaveFeeCollectModuleSettings,
  Attribute,
  FeeCollectModuleSettings,
  FreeCollectModuleSettings,
  LimitedFeeCollectModuleSettings,
  LimitedTimedFeeCollectModuleSettings,
  MultirecipientFeeCollectModuleSettings,
  RecipientDataInput,
  RevertCollectModuleSettings,
  TimedFeeCollectModuleSettings
} from 'lens'

export type VideoDraft = {
  preview: string
  title: string
  description: string
}

export type BundlrDataState = {
  instance: WebBundlr | null
  balance: string
  estimatedPrice: string
  deposit: string | null
  depositing: boolean
  showDeposit: boolean
}

export type FileReaderStreamType = NodeJS.ReadableStream & {
  name: string
  size: number
  type: string
  lastModified: string
}

export type CollectModuleType = {
  isTimedFeeCollect?: boolean
  isFreeCollect?: boolean
  isFeeCollect?: boolean
  isRevertCollect?: boolean
  isLimitedFeeCollect?: boolean
  isLimitedTimeFeeCollect?: boolean
  isMultiRecipientFeeCollect?: boolean
  amount?: { currency?: string; value: string }
  referralFee?: number
  collectLimit?: string
  followerOnlyCollect?: boolean
  recipient?: string
  multiRecipients?: RecipientDataInput[]
}

export type ReferenceModuleType = {
  followerOnlyReferenceModule: boolean
  degreesOfSeparationReferenceModule?: {
    commentsRestricted: boolean
    mirrorsRestricted: boolean
    degreesOfSeparation: number
  } | null
}

export type UploadedVideo = {
  stream: FileReaderStreamType | null
  preview: string
  videoType: string
  file: File | null
  title: string
  description: string
  thumbnail: string
  thumbnailType: string
  videoCategory: { tag: string; name: string }
  percent: number
  isSensitiveContent: boolean
  isUploadToIpfs: boolean
  loading: boolean
  uploadingThumbnail: boolean
  videoSource: string
  buttonText: string
  durationInSeconds: string | null
  collectModule: CollectModuleType
  referenceModule: ReferenceModuleType
  isByteVideo: boolean
}

export type IPFSUploadResult = {
  url: string
  type: string
}

export type VideoUploadForm = {
  videoThumbnail: IPFSUploadResult | null
  videoSource: string | null
  title: string
  description: string
  adultContent: boolean
}

export type ProfileMetadata = {
  version: string
  metadata_id: string
  name: string | null
  bio: string | null
  cover_picture: string | null
  attributes: Attribute[]
}

type MultiRecipientFeeCollectModuleSettings =
  MultirecipientFeeCollectModuleSettings & {
    optionalEndTimestamp?: string
    optionalCollectLimit?: string
  }

export type LenstubeCollectModule = FreeCollectModuleSettings &
  FeeCollectModuleSettings &
  RevertCollectModuleSettings &
  TimedFeeCollectModuleSettings &
  LimitedFeeCollectModuleSettings &
  LimitedTimedFeeCollectModuleSettings &
  MultiRecipientFeeCollectModuleSettings &
  AaveFeeCollectModuleSettings

export interface CustomErrorWithData extends Error {
  data?: {
    message: string
  }
}

export interface ProfileInterest {
  category: { label: string; id: string }
  subCategories: Array<{ label: string; id: string }>
}

export type QueuedVideoType = {
  thumbnailUrl: string
  title: string
  txnId?: string
  txnHash?: string
}

export type QueuedCommentType = {
  comment: string
  pubId: string
  txnId?: string
  txnHash?: string
}

export enum CustomCommentsFilterEnum {
  RELEVANT_COMMENTS = 'RelevantComments',
  NEWEST_COMMENTS = 'NewestComments'
}
