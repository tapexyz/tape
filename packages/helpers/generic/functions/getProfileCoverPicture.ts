import type { Profile } from '@tape.xyz/lens'

export const getProfileCoverPicture = (
  profile: Profile,
  withFallback: boolean = false
): string => {
  return profile.metadata?.coverPicture &&
    profile.metadata?.coverPicture.optimized?.uri
    ? profile?.metadata.coverPicture.optimized.uri
    : withFallback
      ? 'ipfs://bafkreihn5v4hpuxgcysnpb4pgcerkmhwddxq65qswmit6j4nj44btyzdou' //`${STATIC_ASSETS}/images/fallback-cover.svg`
      : null
}
