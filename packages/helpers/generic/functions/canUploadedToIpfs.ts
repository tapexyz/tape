import {
  IPFS_FREE_UPLOAD_LIMIT,
  IPFS_FREE_UPLOAD_MAX_LIMIT
} from '@tape.xyz/constants'
import type { Profile, ProfileOnchainIdentity } from '@tape.xyz/lens'

const validateOnchainIdentity = (onchainIdentity: ProfileOnchainIdentity) => {
  const { proofOfHumanity, ens, sybilDotOrg, worldcoin } = onchainIdentity
  return (
    proofOfHumanity || ens?.name || sybilDotOrg.verified || worldcoin.isHuman
  )
}

export const canUploadedToIpfs = (
  bytes: number,
  activeProfile: Profile | null
) => {
  if (!activeProfile || bytes === null || bytes === undefined) {
    return false
  }

  const score = activeProfile.stats.lensClassifierScore ?? 0
  const hasOnchainIdentity = validateOnchainIdentity(
    activeProfile.onchainIdentity
  )

  // Return false if the user dont have an onchain identity and the score is less than 100
  if (!hasOnchainIdentity && score <= 100) {
    return false
  }

  // Calculate the size of the file in megabytes
  const megaBytes = bytes / 1024 ** 2

  // Determine the upload limit based on the user's score
  const canUploadMaxLimit = score > 0.6 * 10000 // 60%
  const limit = canUploadMaxLimit
    ? IPFS_FREE_UPLOAD_MAX_LIMIT
    : IPFS_FREE_UPLOAD_LIMIT

  // Check if the file size is within the allowed limit
  return megaBytes < limit
}
