import type { Profile } from '@lenstube/lens'

export const getIsDispatcherEnabled = (channel: Profile | null) => {
  return channel?.lensManager && channel.sponsor
}
