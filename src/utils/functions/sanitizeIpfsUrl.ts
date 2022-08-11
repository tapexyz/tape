import { IPFS_GATEWAY } from '@utils/constants'

export const sanitizeIpfsUrl = (url: string) => {
  const gateway = IPFS_GATEWAY

  return url
    .replace(/^Qm[1-9A-Za-z]{44}/gm, `${gateway}${url}`)
    .replace('https://ipfs.io/ipfs/', gateway)
    .replace('https://ipfs.infura.io/ipfs/', gateway)
    .replace('ipfs://', gateway)
}
