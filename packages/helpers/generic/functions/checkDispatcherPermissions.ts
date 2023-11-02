import type { Profile } from '@tape.xyz/lens'

export const checkDispatcherPermissions = (
  profile: Profile | null
): {
  canBroadcast: boolean
  canUseRelay: boolean
} => {
  if (!profile) {
    return { canBroadcast: false, canUseRelay: false }
  }
  const canUseRelay = profile?.signless && profile?.sponsor
  const canBroadcast = profile?.sponsor
  return { canBroadcast, canUseRelay }
}
