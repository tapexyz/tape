import {
  IPFS_FREE_UPLOAD_LIMIT,
  UNSPONSORED_IPFS_UPLOADS
} from '@tape.xyz/constants'

export const canUploadedToIpfs = (bytes: number, profileId: string) => {
  const unsponsored = UNSPONSORED_IPFS_UPLOADS.includes(profileId)
  if (bytes === null || bytes === undefined || unsponsored) {
    return false
  }
  const megaBytes = bytes ? bytes / 1024 ** 2 : 0
  return bytes ? (megaBytes < IPFS_FREE_UPLOAD_LIMIT ? true : false) : false
}
