export enum FEATURE_FLAGS {
  MULTI_COLLECT_MODULE = 'MultiCollectModule'
}

type FeatureFlag = {
  flag: string
  enabledFor: string[]
}

export const featureFlags: FeatureFlag[] = []
