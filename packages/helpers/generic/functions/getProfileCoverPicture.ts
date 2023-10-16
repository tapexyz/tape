import type { Profile } from '@tape.xyz/lens'

export const getProfileCoverPicture = (profile: Profile): string => {
  return profile.metadata?.coverPicture &&
    profile.metadata?.coverPicture.raw.uri
    ? profile?.metadata.coverPicture.raw.uri
    : 'ipfs://bafkreicrwjthp3qfdtywbrgyadmu7jcr3khykwbwmzxt4bacy36zihi4yu' // Fallback Cover of Tape - `${STATIC_ASSETS}/images/coverGradient.jpeg`
}
