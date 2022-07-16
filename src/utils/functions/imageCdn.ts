import { IMAGE_CDN_URL, IS_MAINNET } from '@utils/constants'

function removeHttp(url: string) {
  return url.replace(/^https?:\/\//, '')
}

const imageCdn = (
  url: string,
  type: 'thumbnail' | 'avatar' | 'avatar_lg' | 'square'
): string => {
  if (!url) return url
  return IS_MAINNET
    ? `${IMAGE_CDN_URL}/tr:n-${type}/${url}`
    : `${IMAGE_CDN_URL}/${removeHttp(url)}`
}

export default imageCdn
