import type { Profile } from '@tape.xyz/lens'

export const getIsDispatcherEnabled = (channel: Profile | null) => {
  return channel?.signless && channel.sponsor
}
