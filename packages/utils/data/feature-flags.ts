import { IS_MAINNET } from '../constants'
import { CORE_MEMBERS } from './verified'

export enum FEATURE_FLAGS {
  POST_WITH_SOURCE_URL = 'PostWithSource'
}

type FeatureFlag = {
  flag: string
  enabledFor: string[]
}

export const featureFlags: FeatureFlag[] = [
  {
    flag: FEATURE_FLAGS.POST_WITH_SOURCE_URL,
    enabledFor: IS_MAINNET ? [...CORE_MEMBERS, '0x01a5c1'] : CORE_MEMBERS
  }
]
