import type { FEATURE_FLAGS } from '@dragverse/constants'
import { featureFlags } from '@dragverse/constants'

export const getIsFeatureEnabled = (flag: FEATURE_FLAGS, profileId: string) => {
  if (!profileId) {
    return false
  }
  const feature = featureFlags.find((f) => f.flag === flag)
  return feature?.enabledFor.includes(profileId)
}
