import { IPFS_FREE_UPLOAD_LIMIT } from '@utils/constants'

const canUploadedToIpfs = (bytes: number | undefined) => {
  return bytes
    ? bytes / 1024 ** 2 < IPFS_FREE_UPLOAD_LIMIT
      ? true
      : false
    : false
}

export default canUploadedToIpfs
