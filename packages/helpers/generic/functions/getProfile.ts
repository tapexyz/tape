import type { Profile } from '@tape.xyz/lens'
import type { SimpleProfile } from '@tape.xyz/lens/custom-types'

import { trimLensHandle } from './trimLensHandle'

export const getProfile = (
  profile: Profile | SimpleProfile
): {
  prefix: '@' | '#'
  slug: string
  slugWithPrefix: string
  displayName: string
  link: string
  id: string
  address: string
} => {
  if (!profile) {
    return {
      prefix: '@',
      slug: '',
      slugWithPrefix: '',
      displayName: '',
      link: '',
      id: '',
      address: ''
    }
  }

  const prefix = profile.handle ? '@' : '#'
  const slug: string = trimLensHandle(profile.handle) || profile.id

  return {
    prefix,
    slug,
    slugWithPrefix: `${prefix}${slug}`,
    displayName: profile.metadata?.displayName || slug,
    id: profile.id,
    link: profile.handle
      ? `/u/${trimLensHandle(profile.handle)}`
      : `/profile/${profile.id}`,
    address: profile.ownedBy.address
  }
}
