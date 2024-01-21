import type { WebIrys } from '@irys/sdk'
import type { MetadataLicenseType } from '@lens-protocol/metadata'
import type {
  LegacyMultirecipientFeeCollectModuleSettings,
  LegacySimpleCollectModuleSettings,
  MultirecipientFeeCollectOpenActionSettings,
  ProfileInterestTypes,
  RecipientDataInput,
  SimpleCollectOpenActionSettings
} from '@tape.xyz/lens'

export type IrysDataState = {
  instance: WebIrys | null
  balance: string
  estimatedPrice: string
  deposit: string | null
  depositing: boolean
  showDeposit: boolean
}

export type CollectModuleType = {
  isRevertCollect?: boolean
  isSimpleCollect?: boolean
  isFeeCollect?: boolean
  isMultiRecipientFeeCollect?: boolean
  amount?: { currency?: string; value: string }
  referralFee?: number
  collectLimitEnabled?: boolean
  collectLimit?: string
  timeLimitEnabled?: boolean
  timeLimit?: string
  followerOnlyCollect?: boolean
  recipient?: string
  multiRecipients?: RecipientDataInput[]
}

export type ReferenceModuleType = {
  followerOnlyReferenceModule: boolean
  degreesOfSeparationReferenceModule?: {
    commentsRestricted: boolean
    mirrorsRestricted: boolean
    quotesRestricted: boolean
    degreesOfSeparation: number
  } | null
}

type FileReaderStreamType = NodeJS.ReadableStream & {
  name: string
  size: number
  type: string
  lastModified: string
}

export type UnknownOpenActionType = {
  address: string
  data: string
  name: string
  description: string
}

export type UploadedMedia = {
  type: 'VIDEO' | 'AUDIO'
  stream: FileReaderStreamType | null
  preview: string
  mediaType: string
  file: File | null
  title: string
  description: string
  thumbnail: string
  thumbnailType: string
  thumbnailBlobUrl: string
  mediaCategory: { tag: string; name: string }
  mediaLicense: MetadataLicenseType
  percent: number
  isSensitiveContent: boolean
  isUploadToIpfs: boolean
  loading: boolean
  uploadingThumbnail: boolean
  dUrl: string
  buttonText: string
  durationInSeconds: number
  collectModule: CollectModuleType
  referenceModule: ReferenceModuleType
  isByteVideo: boolean
  unknownOpenAction: UnknownOpenActionType | null
  hasOpenActions: boolean
}

export type IPFSUploadResult = {
  url: string
  type: string
}

export interface CustomErrorWithData extends Error {
  data?: {
    message: string
  }
}

export interface ProfileInterest {
  category: { label: string; id: ProfileInterestTypes }
  subCategories: Array<{ label: string; id: ProfileInterestTypes }>
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

export enum CustomNotificationsFilterEnum {
  HIGH_SIGNAL = 'HighSignal',
  ALL_NOTIFICATIONS = 'AllNotifications'
}

export enum LocalStore {
  TAPE_AUTH_STORE = 'tape.auth.store',
  TAPE_STORE = 'tape.store',
  TAPE_FINGERPRINT = 'tape.fingerprint',
  WAGMI_STORE = 'wagmi.store'
}

export enum LocalIDBStore {
  PROFILE_STORE = 'profile.store',
  COLLECT_STORE = 'collect.store',
  VERIFIED_STORE = 'verified.store',
  ALLOWED_TOKENS_STORE = 'allowed-tokens.store',
  RESTRICTIONS_STORE = 'restrictions.store'
}

export interface CustomNftItemType {
  contentValue: {
    video: string
    audio: string
  }
  metaData: {
    name: string
    image: string
    description: string
  }
  tokenId: string
  blockchain: string
  chainId: string
  address: string
}

export type SupportedOpenActionModuleType =
  | SimpleCollectOpenActionSettings
  | MultirecipientFeeCollectOpenActionSettings
  | LegacySimpleCollectModuleSettings
  | LegacyMultirecipientFeeCollectModuleSettings

export enum StreamChannelType {
  Unlonely = 'unlonely',
  Rad = 'rad'
}

export type ChannelStreamType = {
  title: string
  content: string
  posterUrl: string
  playbackUrl: string
  liveUrl: string
  uid: string
  pid: string
  streamer: string
  channel: string
  isLive: boolean
}

// ------------------------------------------------------------------------MOBILE STARTS---------------------------------------------------------------------------------------------------------------

export enum TimelineFeedType {
  CURATED = 'CURATED',
  FOLLOWING = 'FOLLOWING',
  HIGHLIGHTS = 'HIGHLIGHTS',
  ALGORITHM = 'ALGORITHM'
}

export enum AlgoType {
  K3L_RECOMMENDED = 'K3L_RECOMMENDED',
  K3L_POPULAR = 'K3L_POPULAR',
  K3L_CROWDSOURCED = 'K3L_CROWDSOURCED'
}

export enum ALGO_PROVIDER {
  K3L = 'K3L'
}

export const MOBILE_PROFILE_ITEMS = [
  'Clan',
  'Media',
  'Bytes',
  'Replies',
  'Gallery'
] as const

export type MobileProfileTabItemType = (typeof MOBILE_PROFILE_ITEMS)[number]

export interface MobileThemeConfig {
  textColor: string
  secondaryTextColor: string
  backgroudColor: string
  backgroudColor2: string
  backgroudColor3: string
  sheetBackgroundColor: string
  borderColor: string
  contrastBorderColor: string
  sheetBorderColor: string
  contrastBackgroundColor: string
  contrastTextColor: string
  buttonBackgroundColor: string
  buttonTextColor: string
}

// ------------------------------------------------------------------------MOBILE ENDS---------------------------------------------------------------------------------------------------------------
