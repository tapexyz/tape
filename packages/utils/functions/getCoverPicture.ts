import type { Profile } from 'lens'

import { STATIC_ASSETS } from '../constants'

const getCoverPicture = (channel: Profile): string => {
  return channel.coverPicture && channel.coverPicture.__typename === 'MediaSet'
    ? channel?.coverPicture?.original?.url
    : `${STATIC_ASSETS}/images/coverGradient.jpeg`
}

export default getCoverPicture
