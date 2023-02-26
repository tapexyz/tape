import { CORE_MEMBERS } from './verified'
import { AAVE_MEMBERS } from './verified/aave-members'

export enum FEATURE_FLAGS {
  MULTI_COLLECT_MODULE = 'MultiCollectModule'
}

export const featureFlags = [
  {
    flag: FEATURE_FLAGS.MULTI_COLLECT_MODULE,
    enabledFor: [...AAVE_MEMBERS, ...CORE_MEMBERS]
  }
]
