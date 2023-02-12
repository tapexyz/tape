import { IMAGE_CDN_URL } from '../constants'
import sanitizeIpfsUrl from './sanitizeIpfsUrl'

const imageCdn = (
  url: string,
  type?: 'thumbnail' | 'avatar' | 'avatar_lg' | 'square' | 'thumbnail_v'
): string => {
  if (!url || !IMAGE_CDN_URL) {
    return url
  }
  return type
    ? `${IMAGE_CDN_URL}/tr:n-${type}/${sanitizeIpfsUrl(url)}`
    : `${IMAGE_CDN_URL}/${sanitizeIpfsUrl(url)}`
}

export default imageCdn
