import { SUSPENDED_PROFILES } from '@tape.xyz/constants'

export const getIsSuspendedProfile = (profileId: string): boolean => {
  return SUSPENDED_PROFILES.includes(profileId)
}
