import { IMAGE_CDN_URL } from '../constants'
import { sanitizeIpfsUrl } from './sanitizeIpfsUrl'

const imageCdn = (
  url: string,
  type?: 'thumbnail' | 'avatar' | 'avatar_lg' | 'square' | 'thumbnail_v'
): string => {
  if (!url) return url
  return type
    ? `${IMAGE_CDN_URL}/tr:n-${type},tr:di-placeholder.webp/${sanitizeIpfsUrl(
        url
      )}`
    : `${IMAGE_CDN_URL}/tr:di-placeholder.webp/${sanitizeIpfsUrl(url)}`
}

export default imageCdn
