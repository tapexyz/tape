import { STATIC_ASSETS } from '@utils/constants'
import { LenstubePublication } from 'src/types/local'

import { sanitizeIpfsUrl } from './sanitizeIpfsUrl'

const getThumbnailUrl = (video: LenstubePublication): string => {
  return (
    sanitizeIpfsUrl(video.metadata?.cover?.original.url) ??
    sanitizeIpfsUrl(video.metadata?.image) ??
    `${STATIC_ASSETS}/images/fallbackThumbnail.png`
  )
}

export default getThumbnailUrl
