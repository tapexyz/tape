import { IS_MAINNET } from '../constants'

export enum FEATURE_FLAGS {
  LENSTUBE_ECHOS = 'lenstube-echos',
  MULTI_COLLECT_MODULE = 'multi-collect-module'
}

export const featureFlags = [
  {
    flag: FEATURE_FLAGS.LENSTUBE_ECHOS,
    enabledFor: IS_MAINNET ? ['0x2d'] : ['0x2f']
  },
  {
    flag: FEATURE_FLAGS.MULTI_COLLECT_MODULE,
    enabledFor: IS_MAINNET ? ['0x2d'] : ['0x2f']
  }
]
