import { IMAGE_CDN_URL } from '../constants'
import sanitizeDStorageUrl from './sanitizeDStorageUrl'

const imageCdn = (
  url: string,
  type?: 'thumbnail' | 'avatar' | 'avatar_lg' | 'square' | 'thumbnail_v'
): string => {
  if (!url || !IMAGE_CDN_URL) {
    return url
  }
  return type
    ? `${IMAGE_CDN_URL}/tr:n-${type}/${sanitizeDStorageUrl(url)}`
    : `${IMAGE_CDN_URL}/${sanitizeDStorageUrl(url)}`
}

export default imageCdn
