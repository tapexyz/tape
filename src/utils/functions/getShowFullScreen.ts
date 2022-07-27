import { BYTES } from '@utils/url-path'

export const getShowFullScreen = (pathname: string) => {
  return pathname === BYTES || pathname === '/bytes/[id]'
}
