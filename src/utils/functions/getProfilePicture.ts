/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Profile } from 'src/types/lens'

import { getIsDicebearImage } from './getIsDicebearImage'
import { getRandomProfilePicture } from './getRandomProfilePicture'
import imageCdn from './imageCdn'
import { sanitizeIpfsUrl } from './sanitizeIpfsUrl'

const getProfilePicture = (
  channel: Profile,
  type: 'avatar' | 'avatar_lg' | 'thumbnail' = 'avatar'
): string => {
  const url =
    // @ts-ignore
    channel?.picture?.original?.url ??
    // @ts-ignore
    channel?.picture?.uri ??
    getRandomProfilePicture(channel?.handle)
  const sanitized = sanitizeIpfsUrl(url)
  return getIsDicebearImage(sanitized)
    ? getRandomProfilePicture(channel?.handle)
    : imageCdn(sanitized, type)
}

export default getProfilePicture
