import { OLD_LENS_RELAYER_ADDRESS } from '@tape.xyz/constants'
import type { Profile } from '@tape.xyz/lens'

export const getIsDispatcherEnabled = (channel: Profile | null) => {
  return (
    channel?.dispatcher?.canUseRelay &&
    channel.dispatcher?.address?.toLocaleLowerCase() !==
      OLD_LENS_RELAYER_ADDRESS.toLocaleLowerCase()
  )
}
