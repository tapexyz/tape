// import { IMAGEKIT_URL } from '@utils/constants'

const CDN_URL = 'https://i0.wp.com'
function removeHttp(url: string) {
  return url.replace(/^https?:\/\//, '')
}

const imageCdn = (url: string): string => {
  // return `${IMAGEKIT_URL}/${url}`
  return url ? `${CDN_URL}/${removeHttp(url)}` : url
}

export default imageCdn
