import { IPFS_GATEWAY } from '@utils/constants'

import { getIsInfuraUrl } from './getVideoUrl'

export const sanitizeIpfsUrl = (url: string) => {
  return url.startsWith('ipfs://')
    ? url.replace('ipfs://', IPFS_GATEWAY)
    : url.startsWith('Qm')
    ? `${IPFS_GATEWAY}${url}`
    : getIsInfuraUrl(url)
    ? url.replace('https://ipfs.infura.io/', IPFS_GATEWAY)
    : url
}
