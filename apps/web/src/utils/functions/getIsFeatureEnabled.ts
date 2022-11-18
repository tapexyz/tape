import { IS_MAINNET } from '@utils/constants'
import { featureFlags } from '@utils/data/feature-flags'

const getIsFeatureEnabled = (flag: string, channelId: string) => {
  const feature = featureFlags.find((feature) => feature.flag === flag)

  return IS_MAINNET ? feature?.enabledFor.includes(channelId) ?? false : true
}

export default getIsFeatureEnabled
