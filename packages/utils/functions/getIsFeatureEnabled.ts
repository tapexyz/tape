import type { FEATURE_FLAGS } from '@lenstube/constants'
import { featureFlags } from '@lenstube/constants'

const getIsFeatureEnabled = (flag: FEATURE_FLAGS, channelId: string) => {
  if (!channelId) {
    return false
  }
  const feature = featureFlags.find((f) => f.flag === flag)
  return feature?.enabledFor.includes(channelId)
}

export default getIsFeatureEnabled
