import { IMAGE_CDN_URL } from '@utils/constants'

function removeHttp(url: string) {
  return url.replace(/^https?:\/\//, '')
}

const imageCdn = (url: string): string => {
  return url ? `${IMAGE_CDN_URL}/${removeHttp(url)}` : url
}

export default imageCdn
