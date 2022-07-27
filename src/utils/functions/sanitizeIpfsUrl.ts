import { IPFS_GATEWAY } from '@utils/constants'

export const sanitizeIpfsUrl = (url: string) => {
  return url.startsWith('ipfs://')
    ? `${IPFS_GATEWAY}/${url.split('//')[1].substring(0, 46)}`
    : url.startsWith('Qm')
    ? `${IPFS_GATEWAY}/${url}`
    : url
}
