import type { Profile } from 'lens'

const getChannelCoverPicture = (channel: Profile): string => {
  return channel.coverPicture && channel.coverPicture.__typename === 'MediaSet'
    ? channel?.coverPicture?.original?.url
    : 'ipfs://bafkreicrwjthp3qfdtywbrgyadmu7jcr3khykwbwmzxt4bacy36zihi4yu' // Fallback Cover of Lenstube - `${STATIC_ASSETS}/images/coverGradient.jpeg`
}

export default getChannelCoverPicture
