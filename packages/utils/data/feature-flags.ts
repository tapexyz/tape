import { IS_MAINNET } from 'utils'

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
    enabledFor: IS_MAINNET ? [] : ['0x2f']
  }
]
