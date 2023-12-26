import { IS_MAINNET } from './general'
import { CORE_MEMBERS } from './verified'

export enum FEATURE_FLAGS {
  BANGERS = 'Bangers',
  POST_WITH_SOURCE_URL = 'PostWithSource',
  PROFILE_NFTS = 'ProfileNfts'
}

type FeatureFlag = {
  enabledFor: string[]
  flag: string
}

export const featureFlags: FeatureFlag[] = [
  {
    enabledFor: CORE_MEMBERS,
    flag: FEATURE_FLAGS.POST_WITH_SOURCE_URL
  },
  {
    enabledFor: CORE_MEMBERS,
    flag: FEATURE_FLAGS.PROFILE_NFTS
  },
  {
    enabledFor: IS_MAINNET
      ? ['0x5c95', '0x0d', '0x6ba0', ...CORE_MEMBERS]
      : CORE_MEMBERS,
    flag: FEATURE_FLAGS.BANGERS
  }
]
