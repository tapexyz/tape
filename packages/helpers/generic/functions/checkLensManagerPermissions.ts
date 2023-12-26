import type { Profile } from '@tape.xyz/lens'

export const checkLensManagerPermissions = (
  profile: null | Profile
): {
  canBroadcast: boolean
  canUseLensManager: boolean
} => {
  if (!profile) {
    return { canBroadcast: false, canUseLensManager: false }
  }
  const canUseLensManager = profile?.signless && profile?.sponsor
  const canBroadcast = profile?.sponsor
  return { canBroadcast, canUseLensManager }
}
