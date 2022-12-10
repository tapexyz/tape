import type { Profile } from 'lens'

import { STATIC_ASSETS } from '../constants'
import sanitizeIpfsUrl from './sanitizeIpfsUrl'

const getCoverPicture = (channel: Profile): string => {
  const url =
    channel.coverPicture && channel.coverPicture.__typename === 'MediaSet'
      ? channel?.coverPicture?.original?.url
      : `${STATIC_ASSETS}/images/coverGradient.jpeg`
  return sanitizeIpfsUrl(url)
}

export default getCoverPicture
