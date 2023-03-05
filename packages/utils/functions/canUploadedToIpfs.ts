import { IPFS_FREE_UPLOAD_LIMIT } from '../constants'

const canUploadedToIpfs = (bytes: number | undefined) => {
  const megaBytes = bytes ? bytes / 1024 ** 2 : 0
  return bytes ? (megaBytes < IPFS_FREE_UPLOAD_LIMIT ? true : false) : false
}

export default canUploadedToIpfs
