import { IS_MAINNET } from '../constants'
import { featureFlags } from '../data/feature-flags'

const getIsFeatureEnabled = (flag: string, channelId: string) => {
  if (!channelId) return false
  const feature = featureFlags.find((f) => f.flag === flag)

  return IS_MAINNET ? feature?.enabledFor.includes(channelId) ?? false : false
}

export default getIsFeatureEnabled
