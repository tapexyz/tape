import type { FEATURE_FLAGS } from '@tape.xyz/constants'
import { featureFlags } from '@tape.xyz/constants'

export const getIsFeatureEnabled = (flag: FEATURE_FLAGS, channelId: string) => {
  if (!channelId) {
    return false
  }
  const feature = featureFlags.find((f) => f.flag === flag)
  return feature?.enabledFor.includes(channelId)
}
