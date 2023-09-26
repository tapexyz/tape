import type { IMAGE_TRANSFORMATIONS } from '@lenstube/constants'
import type { Profile } from '@lenstube/lens'

import { getRandomProfilePicture } from './getRandomProfilePicture'
import { imageCdn } from './imageCdn'
import { sanitizeDStorageUrl } from './sanitizeDStorageUrl'

export const getProfilePicture = (
  channel: Profile,
  type?: keyof typeof IMAGE_TRANSFORMATIONS,
  withFallback = true
): string => {
  const url =
    channel.metadata?.picture &&
    channel.metadata?.picture.__typename === 'ImageSet'
      ? channel.metadata?.picture?.raw?.uri
      : channel.metadata?.picture?.__typename === 'NftImage'
      ? channel?.metadata.picture.image?.raw.uri
      : withFallback
      ? getRandomProfilePicture(channel?.ownedBy.address)
      : ''
  const sanitized = sanitizeDStorageUrl(url)
  return imageCdn(sanitized, type)
}
