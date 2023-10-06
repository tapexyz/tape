import { IPFS_FREE_UPLOAD_LIMIT } from '@tape.xyz/constants'

export const canUploadedToIpfs = (bytes?: number | null) => {
  if (bytes === null || bytes === undefined) {
    return false
  }
  const megaBytes = bytes ? bytes / 1024 ** 2 : 0
  return bytes ? (megaBytes < IPFS_FREE_UPLOAD_LIMIT ? true : false) : false
}
