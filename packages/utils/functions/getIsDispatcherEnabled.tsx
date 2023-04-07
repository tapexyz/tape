import type { Profile } from 'lens'
import { RELAYER_ADDRESS } from 'utils'

const getIsDispatcherEnabled = (channel: Profile | null) => {
  return (
    channel?.dispatcher?.canUseRelay &&
    channel.dispatcher?.address?.toLocaleLowerCase() !==
      RELAYER_ADDRESS.toLocaleLowerCase()
  )
}

export default getIsDispatcherEnabled
