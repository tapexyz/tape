import type { Profile } from 'lens'
import { OLD_LENS_RELAYER_ADDRESS } from 'utils'

const getIsDispatcherEnabled = (channel: Profile | null) => {
  return (
    channel?.dispatcher?.canUseRelay &&
    channel.dispatcher?.address?.toLocaleLowerCase() !==
      OLD_LENS_RELAYER_ADDRESS.toLocaleLowerCase()
  )
}

export default getIsDispatcherEnabled
