import type { IMAGE_TRANSFORMATIONS } from '@tape.xyz/constants'
import type { Profile } from '@tape.xyz/lens'

import { getRandomProfilePicture } from './getRandomProfilePicture'
import { imageCdn } from './imageCdn'
import { sanitizeDStorageUrl } from './sanitizeDStorageUrl'

export const getProfilePicture = (
  profile: Profile,
  type?: keyof typeof IMAGE_TRANSFORMATIONS,
  withFallback = true
): string => {
  const url =
    profile.metadata?.picture &&
    profile.metadata?.picture.__typename === 'ImageSet'
      ? profile.metadata?.picture?.raw?.uri
      : profile.metadata?.picture?.__typename === 'NftImage'
      ? profile?.metadata.picture.image?.raw.uri
      : withFallback
      ? getRandomProfilePicture(profile?.ownedBy.address)
      : ''
  const sanitized = sanitizeDStorageUrl(url)
  return imageCdn(sanitized, type)
}
