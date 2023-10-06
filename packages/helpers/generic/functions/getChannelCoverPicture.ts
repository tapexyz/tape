import type { Profile } from '@tape.xyz/lens'

export const getChannelCoverPicture = (channel: Profile): string => {
  return channel.metadata?.coverPicture &&
    channel.metadata?.coverPicture.raw.uri
    ? channel?.metadata.coverPicture.raw.uri
    : 'ipfs://bafkreicrwjthp3qfdtywbrgyadmu7jcr3khykwbwmzxt4bacy36zihi4yu' // Fallback Cover of Tape - `${STATIC_ASSETS}/images/coverGradient.jpeg`
}
