import { IPFS_FREE_UPLOAD_LIMIT } from '@tape.xyz/constants'
import type { Profile } from '@tape.xyz/lens'

export const canUploadedToIpfs = (
  bytes: number,
  activeProfile: Profile | null
) => {
  const sponsored = activeProfile?.sponsor
  const hasGoodScore =
    (activeProfile?.stats.lensClassifierScore ?? 0) > 10 ? true : false
  const allowed = hasGoodScore && sponsored
  if (bytes === null || bytes === undefined || !allowed) {
    return false
  }
  const megaBytes = bytes ? bytes / 1024 ** 2 : 0
  return bytes ? (megaBytes < IPFS_FREE_UPLOAD_LIMIT ? true : false) : false
}
