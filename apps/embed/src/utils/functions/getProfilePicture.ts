/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Profile } from 'src/types/lens'

import { getIsDicebearImage } from './getIsDicebearImage'
import { getRandomProfilePicture } from './getRandomProfilePicture'
import { sanitizeIpfsUrl } from './sanitizeIpfsUrl'

const getProfilePicture = (channel: Profile): string => {
  const url =
    // @ts-ignore
    channel?.picture?.original?.url ??
    // @ts-ignore
    channel?.picture?.uri ??
    getRandomProfilePicture(channel?.handle)
  const sanitized = sanitizeIpfsUrl(url)
  return getIsDicebearImage(sanitized)
    ? getRandomProfilePicture(channel?.handle)
    : sanitized
}

export default getProfilePicture
