import type { Profile } from 'lens'

const getChannelCoverPicture = (channel: Profile): string => {
  return channel.coverPicture && channel.coverPicture.__typename === 'MediaSet'
    ? channel?.coverPicture?.original?.url
    : 'ipfs://bafkreiez6nzklnjzj5w7bt43is4knd72sud7x2i3vcejgxfp3lzavuv3n4' // Fallback Cover of Lenstube - `${STATIC_ASSETS}/images/coverGradient.jpeg`
}

export default getChannelCoverPicture
