import type { FEATURE_FLAGS } from '../data/feature-flags'
import { featureFlags } from '../data/feature-flags'

const getIsFeatureEnabled = (flag: FEATURE_FLAGS, channelId: string) => {
  if (!channelId) {
    return false
  }
  const feature = featureFlags.find((f) => f.flag === flag)
  return feature?.enabledFor.includes(channelId)
}

export default getIsFeatureEnabled
