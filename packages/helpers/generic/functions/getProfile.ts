import type { Profile } from '@tape.xyz/lens'

import { LENS_NAMESPACE_PREFIX } from '@tape.xyz/constants'

export const getProfile = (
  profile: null | Profile
): {
  address: string
  displayName: string
  id: string
  link: string
  slug: string
  slugWithPrefix: string
} => {
  if (!profile) {
    return {
      address: '',
      displayName: '',
      id: '',
      link: '',
      slug: '',
      slugWithPrefix: ''
    }
  }

  const prefix = profile.handle ? '@' : '#'
  let slug: string = profile.handle?.fullHandle || profile.id
  slug = slug.replace(LENS_NAMESPACE_PREFIX, '')

  return {
    address: profile.ownedBy?.address,
    displayName: profile.metadata?.displayName || slug,
    id: profile.id,
    link: profile.handle
      ? `/u/${profile.handle.localName}`
      : `/profile/${profile.id}`,
    slug,
    slugWithPrefix: `${prefix}${slug}`
  }
}
