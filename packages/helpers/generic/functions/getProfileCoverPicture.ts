import { STATIC_ASSETS } from '@tape.xyz/constants'
import type { Profile } from '@tape.xyz/lens'

export const getProfileCoverPicture = (profile: Profile): string => {
  return profile.metadata?.coverPicture &&
    profile.metadata?.coverPicture.raw.uri
    ? profile?.metadata.coverPicture.raw.uri
    : `${STATIC_ASSETS}/images/fallback-cover.svg`
}
