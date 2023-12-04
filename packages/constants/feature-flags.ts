import { IS_MAINNET } from './general'
import { CORE_MEMBERS } from './verified'

export enum FEATURE_FLAGS {
  POST_WITH_SOURCE_URL = 'PostWithSource',
  PROFILE_NFTS = 'ProfileNfts',
  BANGERS = 'Bangers'
}

type FeatureFlag = {
  flag: string
  enabledFor: string[]
}

export const featureFlags: FeatureFlag[] = [
  {
    flag: FEATURE_FLAGS.POST_WITH_SOURCE_URL,
    enabledFor: CORE_MEMBERS
  },
  {
    flag: FEATURE_FLAGS.PROFILE_NFTS,
    enabledFor: CORE_MEMBERS
  },
  {
    flag: FEATURE_FLAGS.BANGERS,
    enabledFor: IS_MAINNET
      ? ['0x5c95', '0x0d', '0x6ba0', ...CORE_MEMBERS]
      : CORE_MEMBERS
  }
]
