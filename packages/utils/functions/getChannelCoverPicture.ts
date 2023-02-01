import type { Profile } from 'lens'

import { STATIC_ASSETS } from '../constants'

const getChannelCoverPicture = (channel: Profile): string => {
  console.log(
    '🚀 ~ file: getChannelCoverPicture.ts:6 ~ getChannelCoverPicture ~ channel',
    channel
  )
  return channel.coverPicture && channel.coverPicture.__typename === 'MediaSet'
    ? channel?.coverPicture?.original?.url
    : `${STATIC_ASSETS}/images/coverGradient.jpeg`
}

export default getChannelCoverPicture
