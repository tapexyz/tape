import { IPFS_GATEWAY } from '@utils/constants'

export const sanitizeIpfsUrl = (url: string) => {
  return url.startsWith('ipfs://')
    ? `${IPFS_GATEWAY}/${url.split('//')[1]}`
    : url
}
