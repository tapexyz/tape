import { IPFS_FREE_UPLOAD_LIMIT } from '@tape.xyz/constants'

export const canUploadedToIpfs = (bytes: number, sponsored?: boolean) => {
  if (bytes === null || bytes === undefined || !sponsored) {
    return false
  }
  const megaBytes = bytes ? bytes / 1024 ** 2 : 0
  return bytes ? (megaBytes < IPFS_FREE_UPLOAD_LIMIT ? true : false) : false
}
