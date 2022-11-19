import type { LenstubePublication } from 'src/types'

import { sanitizeIpfsUrl } from './sanitizeIpfsUrl'

export const getVideoUrl = (video: LenstubePublication) => {
  const url = video?.metadata?.media[0]?.original.url
  return sanitizeIpfsUrl(url)
}
