import { IMAGE_CDN_URL } from '@utils/constants'

import { sanitizeIpfsUrl } from './sanitizeIpfsUrl'

const imageCdn = (
  url: string,
  type: 'thumbnail' | 'avatar' | 'avatar_lg' | 'square' | 'thumbnail_v'
): string => {
  if (!url) return url
  return `${IMAGE_CDN_URL}/tr:n-${type}/${sanitizeIpfsUrl(url)}`
}

export default imageCdn
