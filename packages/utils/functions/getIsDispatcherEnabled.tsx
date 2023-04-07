import type { Profile } from 'lens'
import { LENS_RELAYER_ADDRESS } from 'utils'

const getIsDispatcherEnabled = (channel: Profile | null) => {
  return (
    channel?.dispatcher?.canUseRelay &&
    channel.dispatcher?.address?.toLocaleLowerCase() !==
      LENS_RELAYER_ADDRESS.toLocaleLowerCase()
  )
}

export default getIsDispatcherEnabled
