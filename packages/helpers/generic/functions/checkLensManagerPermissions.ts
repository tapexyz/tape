import type { Profile } from '@tape.xyz/lens'

export const checkLensManagerPermissions = (
  profile: Profile | null
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
