import { IS_MAINNET } from '../constants'
import { featureFlags } from '../data/feature-flags'

const getIsFeatureEnabled = (flag: string, channelId: string | null) => {
  if (!channelId) return false
  const feature = featureFlags.find((feature) => feature.flag === flag)

  return IS_MAINNET ? feature?.enabledFor.includes(channelId) ?? false : true
}

export default getIsFeatureEnabled
